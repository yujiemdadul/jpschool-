import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Volume2, 
  Zap, 
  Trophy, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Layers, 
  ChevronRight, 
  Flame,
  Timer
} from 'lucide-react';
import { KanaType, QuizQuestion, QuizType, KanaChar, MistakeRecord } from '../../types';
import { quizService } from '../../services/quizService';
import { playJapaneseAudio, playSuccessSound, playWrongSound, playFanfareSound } from '../../utils/speech';
import { ProgressBar } from '../common/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { QuizSessionSummary, SessionMistakeItem } from './QuizSessionSummary';
import { HIRAGANA_CHARS } from '../../data/hiraganaData';
import { KATAKANA_CHARS } from '../../data/katakanaData';

interface QuizSessionProps {
  initialCourse?: KanaType | 'mixed';
  initialLevel?: number;
  onNavigateHome: () => void;
  onNavigateToCourse: (course: KanaType) => void;
  onNavigateToMistakes?: () => void;
}

export const QuizSession: React.FC<QuizSessionProps> = ({
  initialCourse = 'hiragana',
  initialLevel,
  onNavigateHome,
  onNavigateToCourse,
  onNavigateToMistakes
}) => {
  const { userProfile, setUserProfile, recordMistake, setScriptLanguage } = useAuth();

  // Setup state
  const [selectedCourse, setSelectedCourse] = useState<KanaType | 'mixed'>(initialCourse);
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(initialLevel);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync and auto-launch when navigated from level card quiz button
  useEffect(() => {
    if (initialCourse) {
      setSelectedCourse(initialCourse);
    }
    if (initialLevel !== undefined) {
      setSelectedLevel(initialLevel);
      const courseType = (initialCourse || 'hiragana') as KanaType | 'mixed';
      const generated = quizService.generateQuiz(courseType, initialLevel, questionCount, userProfile?.scriptLanguage);
      if (generated && generated.length > 0) {
        setQuestions(generated);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setScore(0);
        setEarnedXP(0);
        setUserAnswers([]);
        const now = Date.now();
        setSessionStartTime(now);
        setTimeSpentSeconds(0);
        setLiveElapsedSeconds(0);
        setIsQuizFinished(false);
        setIsQuizActive(true);

        if (generated[0]?.type === 'listen_to_jp' && generated[0]?.audioChar) {
          setTimeout(() => {
            playJapaneseAudio(generated[0].audioChar!);
          }, 300);
        }
      }
    }
  }, [initialCourse, initialLevel]);

  // Active session state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [earnedXP, setEarnedXP] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ question: QuizQuestion; chosenIndex: number; isCorrect: boolean }[]>([]);

  // Time Tracking
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [liveElapsedSeconds, setLiveElapsedSeconds] = useState<number>(0);

  // Live timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isQuizActive && !isQuizFinished && sessionStartTime) {
      interval = setInterval(() => {
        setLiveElapsedSeconds(Math.max(0, Math.floor((Date.now() - sessionStartTime) / 1000)));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQuizActive, isQuizFinished, sessionStartTime]);

  // Start a new quiz session
  const handleStartQuiz = () => {
    const generated = quizService.generateQuiz(selectedCourse, selectedLevel, questionCount, userProfile?.scriptLanguage);
    if (!generated || generated.length === 0) {
      setErrorMessage('কুইজ প্রশ্ন তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে অন্য কোর্স বা লেভেল নির্বাচন করুন।');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setEarnedXP(0);
    setUserAnswers([]);
    const now = Date.now();
    setSessionStartTime(now);
    setTimeSpentSeconds(0);
    setLiveElapsedSeconds(0);
    setIsQuizFinished(false);
    setIsQuizActive(true);

    // Auto-play audio if first question is listening type
    if (generated[0]?.type === 'listen_to_jp' && generated[0]?.audioChar) {
      setTimeout(() => {
        playJapaneseAudio(generated[0].audioChar!);
      }, 300);
    }
  };

  const currentQ = questions[currentIndex];

  // Auto-play audio for listening questions
  useEffect(() => {
    if (isQuizActive && currentQ && currentQ.type === 'listen_to_jp' && currentQ.audioChar) {
      playJapaneseAudio(currentQ.audioChar);
    }
  }, [currentIndex, isQuizActive, currentQ]);

  // Handle Option selection & instant submission
  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerSubmitted || !currentQ) return;

    setSelectedOption(optionIndex);
    setIsAnswerSubmitted(true);

    const isCorrect = optionIndex === currentQ.correctOptionIndex;
    if (isCorrect) {
      playSuccessSound();
      setScore(prev => prev + 1);
    } else {
      playWrongSound();
      if (currentQ.sourceKana && recordMistake) {
        recordMistake({
          kana: currentQ.sourceKana,
          questionPrompt: currentQ.promptText,
          userAnswer: currentQ.options[optionIndex],
          correctAnswer: currentQ.correctAnswer
        });
      }
    }

    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQ,
        chosenIndex: optionIndex,
        isCorrect
      }
    ]);
  };

  // Move to next question or finish
  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finish Quiz & calculate duration
      const finalDuration = Math.max(1, Math.round((Date.now() - (sessionStartTime || Date.now())) / 1000));
      setTimeSpentSeconds(finalDuration);
      setIsQuizFinished(true);
      playFanfareSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // confetti fallback
      }

      if (userProfile) {
        const finalScore = score;
        const res = await quizService.recordQuizResult(userProfile, {
          course: selectedCourse,
          level: selectedLevel,
          totalQuestions: questions.length,
          correctAnswers: finalScore,
          timeSpentSeconds: finalDuration
        });
        setUserProfile(res.updatedProfile);
        setEarnedXP(res.xpEarned);
      }
    }
  };

  // Helper to compile weak characters from this session + recent history
  const getWeakCharacters = useCallback((): SessionMistakeItem[] => {
    const list: SessionMistakeItem[] = [];
    const seenKanaIds = new Set<string>();
    const allChars = [...HIRAGANA_CHARS, ...KATAKANA_CHARS];

    // 1. Weak characters from this specific quiz session
    userAnswers.forEach((ans) => {
      if (!ans.isCorrect) {
        const q = ans.question;
        const kana = q.sourceKana || 
          allChars.find(c => 
            c.character === q.promptChar || 
            c.character === q.audioChar || 
            c.character === q.correctAnswer ||
            c.bangla === q.correctAnswer ||
            c.romaji === q.correctAnswer
          );

        if (kana && !seenKanaIds.has(kana.id)) {
          seenKanaIds.add(kana.id);
          list.push({
            id: `session_mistake_${kana.id}`,
            kanaId: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            bangla: kana.bangla,
            type: kana.type,
            level: kana.level,
            questionPrompt: q.promptText,
            userAnswer: q.options[ans.chosenIndex],
            correctAnswer: q.correctAnswer,
            fromRecentHistory: false,
            sourceKana: kana
          });
        }
      }
    });

    // 2. Also incorporate recent unmastered mistakes from userProfile
    if (userProfile?.mistakes) {
      const pending = userProfile.mistakes.filter(m => !m.mastered);
      pending.forEach(m => {
        if (!seenKanaIds.has(m.kanaId)) {
          seenKanaIds.add(m.kanaId);
          const foundKana = allChars.find(c => c.id === m.kanaId);
          list.push({
            id: m.id,
            kanaId: m.kanaId,
            character: m.character,
            romaji: m.romaji,
            bangla: m.bangla,
            type: m.type,
            level: m.level,
            questionPrompt: m.lastQuestionPrompt,
            userAnswer: m.userAnswer,
            correctAnswer: m.correctAnswer,
            fromRecentHistory: true,
            wrongCount: m.wrongCount,
            sourceKana: foundKana
          });
        }
      });
    }

    return list;
  }, [userAnswers, userProfile]);

  // Direct practice session targeting weak characters
  const handlePracticeWeakCharacters = (targetKanas: KanaChar[]) => {
    if (!targetKanas || targetKanas.length === 0) return;

    const mockMistakes: MistakeRecord[] = targetKanas.map(k => ({
      id: `mistake_${k.id}`,
      kanaId: k.id,
      character: k.character,
      romaji: k.romaji,
      bangla: k.bangla,
      type: k.type,
      level: k.level,
      wrongCount: 1,
      lastMistakeAt: Date.now(),
      mastered: false
    }));

    const count = Math.min(10, Math.max(targetKanas.length * 2, 4));
    const generated = quizService.generateMistakesQuiz(mockMistakes, count, userProfile?.scriptLanguage);
    if (!generated || generated.length === 0) {
      setErrorMessage('অনুশীলন প্রশ্ন তৈরিতে সমস্যা হয়েছে।');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setEarnedXP(0);
    setUserAnswers([]);
    const now = Date.now();
    setSessionStartTime(now);
    setTimeSpentSeconds(0);
    setLiveElapsedSeconds(0);
    setIsQuizFinished(false);
    setIsQuizActive(true);

    if (generated[0]?.type === 'listen_to_jp' && generated[0]?.audioChar) {
      setTimeout(() => {
        playJapaneseAudio(generated[0].audioChar!);
      }, 300);
    }
  };

  // Keyboard shortcut listener (1, 2, 3, 4 or Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isQuizActive || isQuizFinished) return;

      if (!isAnswerSubmitted) {
        if (['1', 'a', 'A'].includes(e.key)) handleSelectOption(0);
        else if (['2', 'b', 'B'].includes(e.key)) handleSelectOption(1);
        else if (['3', 'c', 'C'].includes(e.key)) handleSelectOption(2);
        else if (['4', 'd', 'D'].includes(e.key)) handleSelectOption(3);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuizActive, isQuizFinished, isAnswerSubmitted, currentQ, currentIndex]);

  // 1. Setup / Selection Screen
  if (!isQuizActive) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        
        {/* Banner */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs text-center">
          <div className="inline-flex p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mb-3 border border-rose-200 dark:border-rose-900/40">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            ইন্টারেক্টিভ জাপানি কুইজ (Quizzes)
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base mt-1.5 max-w-lg mx-auto">
            হিরাগানা, কাতাকানা ও উচ্চারণ শুনে আপনার জাপানি পড়ার দক্ষতা যাচাই করুন এবং এক্সপি অর্জন করুন।
          </p>
        </div>

        {/* Configuration Box */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {/* Step 1: Select Course */}
          <div>
            <label className="block text-sm font-bold text-stone-900 dark:text-white mb-2">
              ১. কোর্স নির্বাচন করুন:
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              <button
                type="button"
                id="btn-quiz-course-hiragana"
                onClick={() => setSelectedCourse('hiragana')}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCourse === 'hiragana'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-600 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <span className="text-2xl font-bold font-serif mb-1">あ</span>
                <span className="text-xs sm:text-sm font-bold">হিরাগানা</span>
              </button>

              <button
                type="button"
                id="btn-quiz-course-katakana"
                onClick={() => setSelectedCourse('katakana')}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCourse === 'katakana'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 ring-2 ring-blue-400'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <span className="text-2xl font-bold font-serif mb-1">ア</span>
                <span className="text-xs sm:text-sm font-bold">কাতাকানা</span>
              </button>

              <button
                type="button"
                id="btn-quiz-course-mixed"
                onClick={() => {
                  setSelectedCourse('mixed');
                  setSelectedLevel(undefined);
                }}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCourse === 'mixed'
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 text-purple-700 dark:text-purple-300 ring-2 ring-purple-400'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <span className="text-2xl font-bold font-serif mb-1">あ / ア</span>
                <span className="text-xs sm:text-sm font-bold">মিশ্র চ্যালেঞ্জ</span>
              </button>
            </div>
          </div>

          {/* Step 2: Select Level (if not mixed) */}
          {selectedCourse !== 'mixed' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-stone-900 dark:text-white">
                  ২. লেভেল নির্বাচন করুন:
                </label>
                <button
                  type="button"
                  onClick={() => setSelectedLevel(undefined)}
                  className={`text-xs font-bold cursor-pointer ${
                    selectedLevel === undefined ? 'text-rose-600 dark:text-rose-400' : 'text-stone-500 hover:underline'
                  }`}
                >
                  সব লেভেল মিলিয়ে
                </button>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    id={`btn-quiz-lvl-${lvl}`}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selectedLevel === lvl
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    Lvl {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Question Count */}
          <div>
            <label className="block text-sm font-bold text-stone-900 dark:text-white mb-2">
              ৩. প্রশ্নের সংখ্যা:
            </label>
            <div className="flex items-center gap-3">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    questionCount === cnt
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 shadow-xs'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {cnt}টি প্রশ্ন
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Language Medium (বাংলা vs English Romaji) */}
          <div>
            <label className="block text-sm font-bold text-stone-900 dark:text-white mb-2">
              ৪. প্রশ্ন ও উত্তরের ভাষা মাধ্যম:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                id="btn-quiz-lang-bangla"
                onClick={() => setScriptLanguage('bangla')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  (userProfile?.scriptLanguage || 'bangla') === 'bangla'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-600 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                <span className="font-extrabold text-sm">🇧🇩 বাংলা মাধ্যম</span>
                <span className="text-[11px] opacity-80 font-normal mt-0.5">উচ্চারণ: তা, কা, হা</span>
              </button>

              <button
                type="button"
                id="btn-quiz-lang-english"
                onClick={() => setScriptLanguage('english')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  userProfile?.scriptLanguage === 'english'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 ring-2 ring-blue-400 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                <span className="font-extrabold text-sm">🔤 English Romaji</span>
                <span className="text-[11px] opacity-80 font-normal mt-0.5">Romaji: ta, ka, ha</span>
              </button>
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              id="btn-launch-quiz"
              onClick={handleStartQuiz}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={18} />
              <span>কুইজ শুরু করুন →</span>
            </button>
          </div>

        </div>

      </div>
    );
  }

  // 2. Finished Result Screen (Session Summary)
  if (isQuizFinished) {
    const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const weakCharacters = getWeakCharacters();

    const courseLabel = selectedCourse === 'hiragana' 
      ? 'হিরাগানা কোর্স' 
      : selectedCourse === 'katakana' 
        ? 'কাতাকানা কোর্স' 
        : 'মিশ্র কুইজ (হিরাগানা + কাতাকানা)';

    return (
      <QuizSessionSummary
        score={score}
        totalQuestions={questions.length}
        accuracy={accuracy}
        timeSpentSeconds={timeSpentSeconds}
        earnedXP={earnedXP}
        sessionAnswers={userAnswers}
        weakCharacters={weakCharacters}
        courseName={courseLabel}
        levelNumber={selectedLevel}
        onRetry={handleStartQuiz}
        onPracticeWeakCharacters={handlePracticeWeakCharacters}
        onNavigateHome={onNavigateHome}
        onNavigateToMistakes={onNavigateToMistakes}
      />
    );
  }

  // 3. Active Quiz Question View
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Session Progress Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-lg">
            প্রশ্ন {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 hidden sm:inline">
            স্কোর: <strong className="text-stone-900 dark:text-white">{score}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-56 mx-auto">
          <ProgressBar 
            value={((currentIndex + (isAnswerSubmitted ? 1 : 0)) / questions.length) * 100} 
            colorClass="bg-rose-600" 
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-mono font-bold">
            <Timer size={13} className="text-rose-500 shrink-0" />
            <span>{Math.floor(liveElapsedSeconds / 60)}:{(liveElapsedSeconds % 60).toString().padStart(2, '0')}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsQuizActive(false)}
            className="text-xs font-bold text-stone-400 hover:text-rose-600 transition cursor-pointer"
          >
            প্রস্থান
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div 
        id="quiz-question-box"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm text-center"
      >
        
        {/* Question Type Header Badge */}
        <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
          {currentQ.type === 'listen_to_jp' && '🔊 অডিও লিসেনিং টেস্ট'}
          {currentQ.type === 'jp_to_bn' && 'জাপানি থেকে বাংলা উচ্চারণ'}
          {currentQ.type === 'bn_to_jp' && 'বাংলা থেকে সঠিক জাপানি বর্ণ'}
          {currentQ.type === 'jp_to_romaji' && 'জাপানি থেকে Romaji'}
          {currentQ.type === 'romaji_to_jp' && 'Romaji থেকে জাপানি বর্ণ'}
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white mb-6">
          {currentQ.promptText}
        </h2>

        {/* Visual Character Display or Audio Speaker */}
        {currentQ.promptChar && (
          <div className="w-28 h-28 mx-auto my-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs">
            <span className="text-6xl font-black font-serif text-stone-900 dark:text-stone-50">
              {currentQ.promptChar}
            </span>
          </div>
        )}

        {currentQ.audioChar && (
          <div className="my-4 flex flex-col items-center">
            <button
              type="button"
              id="btn-replay-quiz-audio"
              onClick={() => playJapaneseAudio(currentQ.audioChar!)}
              className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md active:scale-95 transition cursor-pointer"
            >
              <Volume2 size={36} className="animate-pulse" />
            </button>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-2">
              পুনরায় শুনতে ক্লিক করুন
            </span>
          </div>
        )}

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrectOption = optIdx === currentQ.correctOptionIndex;

            let optionStyle = 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700';

            if (isAnswerSubmitted) {
              if (isCorrectOption) {
                optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-400';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 ring-2 ring-rose-400';
              } else {
                optionStyle = 'border-stone-200 dark:border-stone-800 opacity-40';
              }
            }

            const optionKeyLabel = ['A', 'B', 'C', 'D'][optIdx];

            return (
              <button
                key={optIdx}
                id={`quiz-opt-${optIdx}`}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(optIdx)}
                className={`flex items-center justify-between p-4 rounded-2xl border text-left font-bold text-base sm:text-lg transition-all active:scale-98 cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {optionKeyLabel}
                  </span>
                  <span className="font-serif text-xl sm:text-2xl">
                    {opt}
                  </span>
                </div>

                {isAnswerSubmitted && isCorrectOption && (
                  <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrectOption && (
                  <XCircle size={20} className="text-rose-600 dark:text-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback Explanation Banner */}
        {isAnswerSubmitted && (
          <div className="mt-6 p-4 rounded-2xl border animate-in fade-in zoom-in-95 duration-150 text-left flex items-start gap-3 bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700">
            <div className="mt-0.5">
              {selectedOption === currentQ.correctOptionIndex ? (
                <CheckCircle size={22} className="text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle size={22} className="text-rose-600 dark:text-rose-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-stone-900 dark:text-white">
                {selectedOption === currentQ.correctOptionIndex
                  ? '✓ সঠিক উত্তর! অসাধারণ! এগিয়ে যাও।'
                  : '✗ এবার ভুল হয়েছে। লক্ষ্য করুন:'}
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                {currentQ.explanationBn}
              </p>
            </div>
            <button
              type="button"
              id="btn-quiz-next"
              onClick={handleNextQuestion}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer shrink-0"
            >
              <span>{currentIndex === questions.length - 1 ? 'ফলাফল দেখুন' : 'চালিয়ে যাও'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
