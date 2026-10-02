import { KanaChar, KanaType, QuizQuestion, QuizResultRecord, QuizType, UserProfile, MistakeRecord } from '../types';
import { HIRAGANA_CHARS } from '../data/hiraganaData';
import { KATAKANA_CHARS } from '../data/katakanaData';
import { validateQuizQuestion } from '../utils/dataValidator';
import { userService } from './userService';
import { activityService } from './activityService';
import { collection, addDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const quizService = {
  /**
   * Generates a validated quiz question for a target kana character.
   */
  generateQuestionForKana(
    targetKana: KanaChar,
    kanaPool: KanaChar[],
    questionType: QuizType,
    existingIds: Set<string>,
    scriptLanguage?: 'bangla' | 'english'
  ): QuizQuestion | null {
    const qId = `q_${targetKana.id}_${questionType}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    if (existingIds.has(qId)) return null;

    // Distractor candidates from pool (excluding targetKana)
    const otherKanas = kanaPool.filter(k => k.id !== targetKana.id);
    if (otherKanas.length < 3) return null;

    // Pick 3 unique distractors
    const shuffledOthers = shuffleArray(otherKanas);
    const distractorKanas = shuffledOthers.slice(0, 3);

    let promptText = '';
    let promptChar: string | undefined = undefined;
    let audioChar: string | undefined = undefined;
    let correctAnswer = '';
    const distractors: string[] = [];
    let explanationBn = '';

    const activeLang = scriptLanguage || userService.getActiveProfile()?.scriptLanguage || 'bangla';
    const isEnglish = activeLang === 'english';

    switch (questionType) {
      case 'jp_to_bn':
        promptText = `「${targetKana.character}」এর সঠিক বাংলা উচ্চারণ কোনটি?`;
        promptChar = targetKana.character;
        correctAnswer = targetKana.bangla;
        distractorKanas.forEach(d => distractors.push(d.bangla));
        explanationBn = `সঠিক উত্তর: ${targetKana.character} = ‘${targetKana.bangla}’।`;
        break;

      case 'bn_to_jp':
        promptText = `বাংলা ‘${targetKana.bangla}’ উচ্চারণের জন্য সঠিক জাপানি বর্ণ কোনটি?`;
        correctAnswer = targetKana.character;
        distractorKanas.forEach(d => distractors.push(d.character));
        explanationBn = `‘${targetKana.bangla}’ এর জাপানি রূপ হলো: ${targetKana.character}।`;
        break;

      case 'jp_to_romaji':
        promptText = isEnglish ? `What is the correct Romaji for「${targetKana.character}」?` : `「${targetKana.character}」বর্ণটির সঠিক Romaji কী?`;
        promptChar = targetKana.character;
        correctAnswer = targetKana.romaji;
        distractorKanas.forEach(d => distractors.push(d.romaji));
        explanationBn = `সঠিক উত্তর: ${targetKana.character} এর Romaji হলো '${targetKana.romaji}' (বাংলা: ${targetKana.bangla})।`;
        break;

      case 'romaji_to_jp':
        promptText = isEnglish ? `Select the correct Japanese character for '${targetKana.romaji}':` : `Romaji '${targetKana.romaji}' এর জন্য সঠিক জাপানি বর্ণ কোনটি?`;
        correctAnswer = targetKana.character;
        distractorKanas.forEach(d => distractors.push(d.character));
        explanationBn = `'${targetKana.romaji}' Romaji-র জাপানি অক্ষর হলো ${targetKana.character} (বাংলা: ${targetKana.bangla})।`;
        break;

      case 'listen_to_jp':
        promptText = isEnglish ? `Listen to the audio and select the correct Japanese character:` : `উচ্চারণ শুনুন এবং সঠিক জাপানি বর্ণটি নির্বাচন করুন:`;
        audioChar = targetKana.character;
        correctAnswer = targetKana.character;
        distractorKanas.forEach(d => distractors.push(d.character));
        explanationBn = isEnglish
          ? `The spoken audio was: ${targetKana.character} (Romaji: ${targetKana.romaji}).`
          : `শোনা অডিওটি ছিল: ${targetKana.character} (বাংলা: ‘${targetKana.bangla}’)।`;
        break;
    }

    // Ensure distinct options
    const rawOptions = [correctAnswer, ...distractors];
    const uniqueOptions = Array.from(new Set(rawOptions));

    // If there is any collision in values, pull additional unique candidates
    if (uniqueOptions.length < 4) {
      const remainingCandidates = shuffledOthers.slice(3);
      for (const cand of remainingCandidates) {
        let val = '';
        if (questionType === 'jp_to_bn') val = cand.bangla;
        else if (questionType === 'jp_to_romaji') val = cand.romaji;
        else val = cand.character;

        if (!uniqueOptions.includes(val)) {
          uniqueOptions.push(val);
        }
        if (uniqueOptions.length === 4) break;
      }
    }

    if (uniqueOptions.length !== 4) return null;

    // Shuffle the 4 options
    const options = shuffleArray(uniqueOptions);
    const correctOptionIndex = options.indexOf(correctAnswer);

    const question: QuizQuestion = {
      id: qId,
      type: questionType,
      promptText,
      promptChar,
      audioChar,
      options,
      correctOptionIndex,
      correctAnswer,
      explanationBn,
      sourceKana: targetKana
    };

    if (!validateQuizQuestion(question)) {
      console.warn('Quiz question failed strict validation, rejected:', question);
      return null;
    }

    return question;
  },

  /**
   * Generates a full quiz set of N questions for a specific course and level (or mixed).
   */
  generateQuiz(
    course: KanaType | 'mixed',
    level?: number,
    questionCount = 10,
    scriptLanguage?: 'bangla' | 'english'
  ): QuizQuestion[] {
    let pool: KanaChar[] = [];
    const fullAlphabet: KanaChar[] = course === 'katakana' ? KATAKANA_CHARS : HIRAGANA_CHARS;

    if (course === 'hiragana') {
      pool = HIRAGANA_CHARS;
    } else if (course === 'katakana') {
      pool = KATAKANA_CHARS;
    } else {
      // Mixed
      pool = [...HIRAGANA_CHARS, ...KATAKANA_CHARS];
    }

    const activeLanguage = scriptLanguage || userService.getActiveProfile()?.scriptLanguage || 'bangla';

    // Strictly separate questions based on user's selected script language:
    // If 'bangla': only use Bangla pronunciation and character questions (NEVER Romaji!)
    // If 'english': test with English Romaji transliteration
    const quizTypes: QuizType[] = activeLanguage === 'english'
      ? ['jp_to_romaji', 'romaji_to_jp', 'listen_to_jp']
      : ['jp_to_bn', 'bn_to_jp', 'listen_to_jp'];

    const generatedQuestions: QuizQuestion[] = [];
    const usedQuestionIds = new Set<string>();

    let attempts = 0;
    const maxAttempts = questionCount * 25;

    // Prioritize target level characters if level is specified
    const targetLevelChars = level ? pool.filter(c => c.level === level) : pool;
    const shuffledTargets = shuffleArray(targetLevelChars.length > 0 ? targetLevelChars : pool);

    let targetIndex = 0;

    while (generatedQuestions.length < questionCount && attempts < maxAttempts) {
      attempts++;

      // Pick target kana: cycle through target level characters if level is specified
      let targetKana: KanaChar;
      if (level && targetLevelChars.length > 0) {
        targetKana = targetLevelChars[targetIndex % targetLevelChars.length];
        targetIndex++;
      } else if (targetIndex < shuffledTargets.length) {
        targetKana = shuffledTargets[targetIndex];
        targetIndex++;
      } else {
        targetKana = pool[Math.floor(Math.random() * pool.length)];
      }

      // Rotate quiz types
      const qType = quizTypes[(generatedQuestions.length + attempts) % quizTypes.length];

      // Pool for distractors uses fullAlphabet or full pool so there are always ample distractors
      const question = this.generateQuestionForKana(targetKana, fullAlphabet, qType, usedQuestionIds, activeLanguage);
      if (question) {
        usedQuestionIds.add(question.id);
        generatedQuestions.push(question);
      }
    }

    return generatedQuestions;
  },

  /**
   * Generates a quiz specifically targeted to practice user mistakes.
   */
  generateMistakesQuiz(
    mistakes: MistakeRecord[],
    questionCount = 10,
    scriptLanguage?: 'bangla' | 'english'
  ): QuizQuestion[] {
    if (!mistakes || mistakes.length === 0) return [];

    const allChars = [...HIRAGANA_CHARS, ...KATAKANA_CHARS];
    const mistakeChars: KanaChar[] = [];

    for (const m of mistakes) {
      const found = allChars.find(c => c.id === m.kanaId);
      if (found) {
        mistakeChars.push(found);
      }
    }

    if (mistakeChars.length === 0) return [];

    const activeLanguage = scriptLanguage || userService.getActiveProfile()?.scriptLanguage || 'bangla';
    const quizTypes: QuizType[] = activeLanguage === 'english'
      ? ['jp_to_romaji', 'romaji_to_jp', 'listen_to_jp']
      : ['jp_to_bn', 'bn_to_jp', 'listen_to_jp'];

    const generatedQuestions: QuizQuestion[] = [];
    const usedQuestionIds = new Set<string>();

    const targetCount = Math.min(questionCount, Math.max(mistakeChars.length * 2, 5));
    let attempts = 0;
    const maxAttempts = targetCount * 25;

    let targetIdx = 0;
    const shuffledMistakes = shuffleArray(mistakeChars);

    while (generatedQuestions.length < targetCount && attempts < maxAttempts) {
      attempts++;
      const targetKana = shuffledMistakes[targetIdx % shuffledMistakes.length];
      targetIdx++;

      // Distractor pool based on kana type
      const pool = targetKana.type === 'katakana' ? KATAKANA_CHARS : HIRAGANA_CHARS;
      const qType = quizTypes[generatedQuestions.length % quizTypes.length];

      const question = this.generateQuestionForKana(targetKana, pool, qType, usedQuestionIds, activeLanguage);
      if (question) {
        usedQuestionIds.add(question.id);
        generatedQuestions.push(question);
      }
    }

    return generatedQuestions;
  },

  /**
   * Records a quiz result, awards XP, updates user statistics, and saves to Firestore.
   */
  async recordQuizResult(
    profile: UserProfile,
    result: {
      course: KanaType | 'mixed';
      level?: number;
      totalQuestions: number;
      correctAnswers: number;
      timeSpentSeconds?: number;
    }
  ): Promise<{ updatedProfile: UserProfile; xpEarned: number }> {
    const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
    
    // XP Calculation:
    // +10 XP per correct question
    // +20 XP completion bonus
    // +40 XP perfect score bonus (100%)
    let xpEarned = result.correctAnswers * 10 + 20;
    if (scorePercentage === 100) {
      xpEarned += 40;
    }

    const currentStats = profile.quizStats;
    const newTotalQuizzes = currentStats.totalQuizzes + 1;
    const newTotalQuestions = currentStats.totalQuestions + result.totalQuestions;
    const newCorrectAnswers = currentStats.correctAnswers + result.correctAnswers;
    const newAccuracy = newTotalQuestions > 0 ? Math.round((newCorrectAnswers / newTotalQuestions) * 100) : 100;

    const record: QuizResultRecord = {
      course: result.course,
      level: result.level,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      scorePercentage,
      xpEarned,
      timeSpentSeconds: result.timeSpentSeconds,
      timestamp: Date.now()
    };

    // If level was passed with >= 70%, also mark level completed
    let workingProfile = profile;
    if (result.level && scorePercentage >= 70 && result.course !== 'mixed') {
      workingProfile = await userService.markLevelCompleted(profile, result.course, result.level);
    }

    // Check perfect score achievement
    if (scorePercentage === 100 && !workingProfile.achievements.includes('perfect_score')) {
      const achSet = new Set(workingProfile.achievements);
      achSet.add('perfect_score');
      workingProfile.achievements = Array.from(achSet);
      workingProfile.xp += 100;
    }

    // Intercept with streak freeze in case user missed prior study days
    const freezeCheck = userService.checkAndApplyStreakFreeze(workingProfile);
    const checkedProfile = freezeCheck.updatedProfile;
    const streakUpdate = userService.calculateUpdatedStreak(checkedProfile.lastStudyDate, checkedProfile.streak);

    const updatedProfile: UserProfile = {
      ...checkedProfile,
      xp: checkedProfile.xp + xpEarned,
      streak: streakUpdate.newStreak,
      lastStudyDate: streakUpdate.newDate,
      dailyXpHistory: userService.recordEarnedDailyXP(checkedProfile, xpEarned),
      quizStats: {
        totalQuizzes: newTotalQuizzes,
        totalQuestions: newTotalQuestions,
        correctAnswers: newCorrectAnswers,
        accuracy: newAccuracy
      }
    };

    const { updatedProfile: checkedProfileFinal } = userService.checkAchievements(updatedProfile);
    
    // Record into user's activity history (in profile + localStorage)
    const { updatedProfile: finalProfile } = activityService.recordQuizActivity(checkedProfileFinal, record);
    await userService.saveUserProfile(finalProfile);

    // Save quiz result subcollection in Firestore if available
    if (isFirebaseConfigured && db && !profile.isGuest) {
      try {
        const quizCollectionRef = collection(db, `users/${profile.uid}/quizResults`);
        await addDoc(quizCollectionRef, record);
      } catch (e) {
        console.warn('Failed to save quiz result to Firestore subcollection:', e);
      }
    }

    return { updatedProfile: finalProfile, xpEarned };
  }
};
