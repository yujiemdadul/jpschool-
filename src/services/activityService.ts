import { UserProfile, QuizResultRecord, CompletedLessonRecord, QuizCourseType, KanaType } from '../types';
import { HIRAGANA_LEVELS } from '../data/hiraganaData';
import { KATAKANA_LEVELS } from '../data/katakanaData';

const BENGALI_NUMERALS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const toBnNum = (num: number | string): string => {
  return String(num).replace(/\d/g, d => BENGALI_NUMERALS[+d] || d);
};

export const getTodayDateStr = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const formatRelativeTimeBn = (timestamp: number): string => {
  if (!timestamp) return 'আজ';
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 60) {
    return 'এইমাত্র';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${toBnNum(diffMin)} মিনিট আগে`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const mins = String(date.getMinutes()).padStart(2, '0');
    const period = hours < 12 ? 'সকাল' : hours < 16 ? 'দুপুর' : hours < 19 ? 'বিকেল' : 'রাত';
    const displayHours = hours % 12 || 12;
    return `আজ ${period} ${toBnNum(displayHours)}:${toBnNum(mins)}`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return 'গতকাল';
  }
  if (diffDays < 7) {
    return `${toBnNum(diffDays)} দিন আগে`;
  }
  const d = new Date(timestamp);
  const day = toBnNum(d.getDate());
  const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
  const month = months[d.getMonth()] || '';
  return `${day} ${month}`;
};

export const getCourseTitleBn = (course: QuizCourseType, level?: number): { title: string; subtitle: string; icon: string; badgeColor: string } => {
  switch (course) {
    case 'hiragana':
      return {
        title: level ? `হিরাগানা লেভেল ${toBnNum(level)} কুইজ` : 'হিরাগানা রিভিশন কুইজ',
        subtitle: level ? `লেভেল ${toBnNum(level)} বর্ণমালার স্পিড টেস্ট` : 'হিরাগানা বর্ণমালা যাচাই',
        icon: 'あ',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-900'
      };
    case 'katakana':
      return {
        title: level ? `কাতাকানা লেভেল ${toBnNum(level)} কুইজ` : 'কাতাকানা রিভিশন কুইজ',
        subtitle: level ? `লেভেল ${toBnNum(level)} বর্ণমালার স্পিড টেস্ট` : 'কাতাকানা বর্ণমালা যাচাই',
        icon: 'ア',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-900'
      };
    case 'kanji':
      return {
        title: 'N5 কাঞ্জি কুইজ টেস্ট',
        subtitle: 'কাঞ্জি অর্থ ও রিডিং যাচাই',
        icon: '漢',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
      };
    case 'daily_challenge':
      return {
        title: 'দৈনিক কুইজ চ্যালেঞ্জ (Daily Quiz)',
        subtitle: 'আজকের ৫টি চ্যালেঞ্জিং প্রশ্ন',
        icon: '⚡',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900'
      };
    case 'mistakes':
      return {
        title: 'ভুল সংশোধন কুইজ (Mistakes Review)',
        subtitle: 'ভুল হওয়া বর্ণমালা পুনরায় চর্চা',
        icon: '🎯',
        badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-900'
      };
    case 'mixed':
    default:
      return {
        title: 'মিক্সড বর্ণমালা স্পিড কুইজ',
        subtitle: 'হিরাগানা ও কাতাকানা সমন্বিত পরীক্ষা',
        icon: '🎌',
        badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-900'
      };
  }
};

export const getLessonTitleBn = (course: KanaType | 'kanji', level?: number): { title: string; subtitle: string; characters: string[] } => {
  if (course === 'hiragana') {
    const lvl = HIRAGANA_LEVELS.find(l => l.level === (level || 1));
    return {
      title: lvl ? `হিরাগানা লেভেল ${toBnNum(lvl.level)}: ${lvl.titleBn}` : `হিরাগানা লেভেল ${toBnNum(level || 1)}`,
      subtitle: lvl?.descriptionBn || 'জাপানি মৌলিক হিরাগানা বর্ণমালা পাঠ',
      characters: lvl ? lvl.characters.map(c => c.character) : ['あ', 'い', 'う', 'え', 'お']
    };
  }
  if (course === 'katakana') {
    const lvl = KATAKANA_LEVELS.find(l => l.level === (level || 1));
    return {
      title: lvl ? `কাতাকানা লেভেল ${toBnNum(lvl.level)}: ${lvl.titleBn}` : `কাতাকানা লেভেল ${toBnNum(level || 1)}`,
      subtitle: lvl?.descriptionBn || 'বিদেশি শব্দের জন্য কাতাকানা বর্ণমালা পাঠ',
      characters: lvl ? lvl.characters.map(c => c.character) : ['ア', 'イ', 'ウ', 'エ', 'オ']
    };
  }
  return {
    title: 'JLPT N5 কাঞ্জি লেসন',
    subtitle: 'প্রকৃতি, সংখ্যা ও প্রাত্যহিক জীবনের মৌলিক কাঞ্জি',
    characters: ['日', '月', '木', '山', '川']
  };
};

export const activityService = {
  /**
   * Save a newly taken quiz to user's history and local storage
   */
  recordQuizActivity(profile: UserProfile, record: QuizResultRecord): { updatedProfile: UserProfile; record: QuizResultRecord } {
    const today = getTodayDateStr();
    const finalRecord: QuizResultRecord = {
      ...record,
      id: record.id || `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      dateKey: record.dateKey || today,
      timestamp: record.timestamp || Date.now()
    };

    const existingHistory = profile.quizHistory || [];
    // Keep max 60 entries, newest first
    const updatedHistory = [finalRecord, ...existingHistory.filter(q => q.id !== finalRecord.id)].slice(0, 60);

    const updatedProfile: UserProfile = {
      ...profile,
      quizHistory: updatedHistory
    };

    // Cache to localStorage for fast immediate lookup
    try {
      if (profile.uid) {
        localStorage.setItem(`chandu_quiz_history_${profile.uid}`, JSON.stringify(updatedHistory));
      }
    } catch {
      // non-critical
    }

    return { updatedProfile, record: finalRecord };
  },

  /**
   * Save a completed lesson to user's history and local storage
   */
  recordLessonActivity(profile: UserProfile, lesson: CompletedLessonRecord): { updatedProfile: UserProfile; record: CompletedLessonRecord } {
    const today = getTodayDateStr();
    const finalLesson: CompletedLessonRecord = {
      ...lesson,
      id: lesson.id || `lesson_${lesson.course}_${lesson.level || 1}_${Date.now()}`,
      dateKey: lesson.dateKey || today,
      completedAt: lesson.completedAt || Date.now()
    };

    const existingLessons = profile.completedLessonHistory || [];
    // Filter duplicates of same course & level on same date
    const updatedLessons = [
      finalLesson,
      ...existingLessons.filter(l => !(l.course === finalLesson.course && l.level === finalLesson.level && l.dateKey === finalLesson.dateKey))
    ].slice(0, 60);

    const updatedProfile: UserProfile = {
      ...profile,
      completedLessonHistory: updatedLessons
    };

    try {
      if (profile.uid) {
        localStorage.setItem(`chandu_lesson_history_${profile.uid}`, JSON.stringify(updatedLessons));
      }
    } catch {
      // non-critical
    }

    return { updatedProfile, record: finalLesson };
  },

  /**
   * Get recent quizzes with fallback synthesis for legacy profiles
   */
  getRecentQuizzes(profile?: UserProfile | null, limitCount: number = 20): QuizResultRecord[] {
    if (!profile) return [];

    let history: QuizResultRecord[] = [];
    if (profile.quizHistory && Array.isArray(profile.quizHistory) && profile.quizHistory.length > 0) {
      history = [...profile.quizHistory];
    } else {
      // Check localStorage
      try {
        const local = localStorage.getItem(`chandu_quiz_history_${profile.uid}`);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            history = parsed;
          }
        }
      } catch {
        // ignore
      }
    }

    // If still empty but the user has totalQuizzes > 0, synthesize smart entries
    if (history.length === 0 && profile.quizStats && profile.quizStats.totalQuizzes > 0) {
      const today = getTodayDateStr();
      const synthetic: QuizResultRecord[] = [];
      const total = Math.min(profile.quizStats.totalQuizzes, 5);

      // If daily quiz was completed today, add it
      if (profile.lastDailyQuizDate === today) {
        synthetic.push({
          id: `synth_daily_${today}`,
          course: 'daily_challenge',
          totalQuestions: 5,
          correctAnswers: 5,
          scorePercentage: 100,
          xpEarned: 110,
          timeSpentSeconds: 45,
          timestamp: profile.dailyQuizLastCompletedAt || Date.now() - 3600000,
          dateKey: today
        });
      }

      // Add recent completed levels as quizzes
      const hLevels = profile.hiraganaProgress?.completedLevels || [1];
      hLevels.slice(-3).reverse().forEach((lvl, idx) => {
        synthetic.push({
          id: `synth_h_${lvl}_${idx}`,
          course: 'hiragana',
          level: lvl,
          totalQuestions: 5,
          correctAnswers: 5,
          scorePercentage: 100,
          xpEarned: 70,
          timeSpentSeconds: 38 + idx * 5,
          timestamp: Date.now() - (idx + 1) * 7200000,
          dateKey: today
        });
      });

      return synthetic.slice(0, limitCount);
    }

    // Sort descending by timestamp
    return history.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, limitCount);
  },

  /**
   * Get lessons completed today
   */
  getTodayCompletedLessons(profile?: UserProfile | null): CompletedLessonRecord[] {
    if (!profile) return [];
    const today = getTodayDateStr();

    let allLessons: CompletedLessonRecord[] = [];
    if (profile.completedLessonHistory && Array.isArray(profile.completedLessonHistory)) {
      allLessons = profile.completedLessonHistory;
    } else {
      try {
        const local = localStorage.getItem(`chandu_lesson_history_${profile.uid}`);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) allLessons = parsed;
        }
      } catch {
        // ignore
      }
    }

    const todayLessons = allLessons.filter(l => l.dateKey === today || (Date.now() - (l.completedAt || 0)) < 24 * 3600000);

    // If user studied today or completed levels today, but no history recorded yet, synthesize from profile
    if (todayLessons.length === 0 && profile.lastStudyDate === today) {
      const synth: CompletedLessonRecord[] = [];
      const hLevels = profile.hiraganaProgress?.completedLevels || [];
      if (hLevels.length > 0) {
        const latestH = hLevels[hLevels.length - 1];
        const info = getLessonTitleBn('hiragana', latestH);
        synth.push({
          id: `today_h_${latestH}`,
          course: 'hiragana',
          level: latestH,
          titleBn: info.title,
          titleJp: `ひらがな レベル ${latestH}`,
          characters: info.characters,
          xpEarned: 60,
          completedAt: Date.now() - 1800000,
          dateKey: today
        });
      }

      const kLevels = profile.katakanaProgress?.completedLevels || [];
      if (kLevels.length > 0) {
        const latestK = kLevels[kLevels.length - 1];
        const info = getLessonTitleBn('katakana', latestK);
        synth.push({
          id: `today_k_${latestK}`,
          course: 'katakana',
          level: latestK,
          titleBn: info.title,
          titleJp: `カタカナ レベル ${latestK}`,
          characters: info.characters,
          xpEarned: 60,
          completedAt: Date.now() - 3600000,
          dateKey: today
        });
      }
      return synth;
    }

    return todayLessons.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  },

  /**
   * Get all completed lessons across all time
   */
  getAllCompletedLessons(profile?: UserProfile | null): CompletedLessonRecord[] {
    if (!profile) return [];

    let history: CompletedLessonRecord[] = [];
    if (profile.completedLessonHistory && Array.isArray(profile.completedLessonHistory) && profile.completedLessonHistory.length > 0) {
      history = [...profile.completedLessonHistory];
    } else {
      try {
        const local = localStorage.getItem(`chandu_lesson_history_${profile.uid}`);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) history = parsed;
        }
      } catch {
        // ignore
      }
    }

    // Reconcile completed levels from hiragana & katakana progress if not in history
    const existingKeys = new Set(history.map(h => `${h.course}_${h.level}`));

    const hLevels = profile.hiraganaProgress?.completedLevels || [];
    hLevels.forEach((lvl, idx) => {
      const key = `hiragana_${lvl}`;
      if (!existingKeys.has(key)) {
        const info = getLessonTitleBn('hiragana', lvl);
        history.push({
          id: `rec_h_${lvl}`,
          course: 'hiragana',
          level: lvl,
          titleBn: info.title,
          titleJp: `ひらがな レベル ${lvl}`,
          characters: info.characters,
          xpEarned: 60,
          completedAt: (profile.createdAt || Date.now()) + idx * 86400000,
          dateKey: profile.lastStudyDate || getTodayDateStr()
        });
      }
    });

    const kLevels = profile.katakanaProgress?.completedLevels || [];
    kLevels.forEach((lvl, idx) => {
      const key = `katakana_${lvl}`;
      if (!existingKeys.has(key)) {
        const info = getLessonTitleBn('katakana', lvl);
        history.push({
          id: `rec_k_${lvl}`,
          course: 'katakana',
          level: lvl,
          titleBn: info.title,
          titleJp: `カタカナ レベル ${lvl}`,
          characters: info.characters,
          xpEarned: 60,
          completedAt: (profile.createdAt || Date.now()) + idx * 86400000,
          dateKey: profile.lastStudyDate || getTodayDateStr()
        });
      }
    });

    return history.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  },

  /**
   * Get today's combined study activity summary
   */
  getTodaySummary(profile?: UserProfile | null) {
    if (!profile) {
      return {
        quizzesCount: 0,
        lessonsCount: 0,
        xpEarned: 0,
        accuracy: 100,
        isGoalMet: false
      };
    }

    const today = getTodayDateStr();
    const todayLessons = this.getTodayCompletedLessons(profile);
    const recentQuizzes = this.getRecentQuizzes(profile, 30);
    const todayQuizzes = recentQuizzes.filter(q => q.dateKey === today || (Date.now() - (q.timestamp || 0)) < 24 * 3600000);

    const todayXp = profile.dailyXpHistory?.[today] || 0;
    const goalXp = profile.dailyXpGoal || 50;
    const isGoalMet = todayXp >= goalXp;

    let avgAccuracy = 100;
    if (todayQuizzes.length > 0) {
      const totalScore = todayQuizzes.reduce((sum, q) => sum + (q.scorePercentage || 100), 0);
      avgAccuracy = Math.round(totalScore / todayQuizzes.length);
    } else if (profile.quizStats && profile.quizStats.totalQuestions > 0) {
      avgAccuracy = profile.quizStats.accuracy;
    }

    return {
      quizzesCount: todayQuizzes.length,
      lessonsCount: todayLessons.length,
      xpEarned: todayXp,
      accuracy: avgAccuracy,
      isGoalMet
    };
  }
};
