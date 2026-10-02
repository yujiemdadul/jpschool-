import { BadgeCategory, BadgeRecord, UserProfile } from '../types';

export interface BadgeDefinition {
  id: string;
  milestone: string;
  titleBn: string;
  titleEn: string;
  titleJp: string;
  descriptionBn: string;
  icon: string;
  category: BadgeCategory;
  targetValue: number;
  xpReward: number;
  getValue: (profile: UserProfile) => number;
}

export const calculateCharactersMastered = (profile: UserProfile): number => {
  if (!profile) return 0;
  const hChars = profile.hiraganaProgress?.completedChars?.length || 0;
  const kChars = profile.katakanaProgress?.completedChars?.length || 0;
  const customMastered = profile.totalCharactersMastered || 0;
  const resolvedMistakes = (profile.mistakes || []).filter(m => m.mastered).length;
  // Characters learned + reviewed mistakes + any explicit mastery
  const computed = hChars + kChars + resolvedMistakes;
  return Math.max(computed, customMastered);
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'streak_7',
    milestone: '7 Day Streak',
    titleBn: '৭ দিনের স্টাডি স্ট্রিক',
    titleEn: '7 Day Streak',
    titleJp: '7日間連続達成',
    descriptionBn: 'টানা ৭ দিন নিয়মিত জাপানি পড়ার অবিচল অভ্যাস গড়ে তুলেছেন',
    icon: '🔥',
    category: 'streak',
    targetValue: 7,
    xpReward: 200,
    getValue: (profile) => profile.streak || 1
  },
  {
    id: 'chars_100',
    milestone: '100 Characters Mastered',
    titleBn: '১০০ অক্ষর আয়ত্ত',
    titleEn: '100 Characters Mastered',
    titleJp: '100文字習得',
    descriptionBn: 'হিরাগানা ও কাতাকানার মোট ১০০টি অক্ষর সফলভাবে মাস্টার করেছেন',
    icon: '🈴',
    category: 'characters',
    targetValue: 100,
    xpReward: 350,
    getValue: (profile) => calculateCharactersMastered(profile)
  },
  {
    id: 'first_lesson',
    milestone: 'First Character Mastered',
    titleBn: 'প্রথম পদক্ষেপ',
    titleEn: 'First Step',
    titleJp: '最初の一歩',
    descriptionBn: 'প্রথম জাপানি অক্ষরের পাঠ ও স্ট্রোক সফলভাবে সমাপ্ত করেছেন',
    icon: '🌱',
    category: 'characters',
    targetValue: 1,
    xpReward: 50,
    getValue: (profile) => (profile.hiraganaProgress?.completedChars?.length || 0) + (profile.katakanaProgress?.completedChars?.length || 0)
  },
  {
    id: 'streak_3',
    milestone: '3 Day Streak',
    titleBn: 'ধারাবাহিক শিক্ষার্থী',
    titleEn: '3 Day Streak',
    titleJp: '3日間継続',
    descriptionBn: 'টানা ৩ দিন নিয়মিত পড়ার স্ট্রিক অর্জন করেছেন',
    icon: '⚡',
    category: 'streak',
    targetValue: 3,
    xpReward: 100,
    getValue: (profile) => profile.streak || 1
  },
  {
    id: 'hiragana_master',
    milestone: 'All 46 Hiragana Mastered',
    titleBn: 'হিরাগানা মাস্টার',
    titleEn: 'Hiragana Master',
    titleJp: 'ひらがなマスター',
    descriptionBn: 'হিরাগানার সব ৪৬টি মৌলিক বর্ণ সফলভাবে সমাপ্ত করেছেন',
    icon: '🌸',
    category: 'mastery',
    targetValue: 46,
    xpReward: 300,
    getValue: (profile) => profile.hiraganaProgress?.completedChars?.length || 0
  },
  {
    id: 'katakana_master',
    milestone: 'All 46 Katakana Mastered',
    titleBn: 'কাতাকানা মাস্টার',
    titleEn: 'Katakana Master',
    titleJp: 'カタカナマスター',
    descriptionBn: 'কাতাকানার সব ৪৬টি মৌলিক বর্ণ সফলভাবে সমাপ্ত করেছেন',
    icon: '🎌',
    category: 'mastery',
    targetValue: 46,
    xpReward: 300,
    getValue: (profile) => profile.katakanaProgress?.completedChars?.length || 0
  },
  {
    id: 'quiz_master',
    milestone: '100 Correct Quiz Answers',
    titleBn: 'কুইজ মাস্টার',
    titleEn: 'Quiz Master',
    titleJp: 'クイズマスター',
    descriptionBn: 'কুইজে মোট ১০০টি প্রশ্নের সঠিক উত্তর দিয়ে পূর্ণ পারদর্শিতা দেখিয়েছেন',
    icon: '🏆',
    category: 'quiz',
    targetValue: 100,
    xpReward: 250,
    getValue: (profile) => profile.quizStats?.correctAnswers || 0
  },
  {
    id: 'perfect_score',
    milestone: '100% Score on Quiz',
    titleBn: 'নিখুঁত কুইজ স্কোর',
    titleEn: 'Flawless Quiz',
    titleJp: '満点達成',
    descriptionBn: 'যেকোনো কুইজে ১০০% সঠিক উত্তর দিয়ে পারফেক্ট স্কোর পেয়েছেন',
    icon: '✨',
    category: 'quiz',
    targetValue: 1,
    xpReward: 100,
    getValue: (profile) => (profile.achievements?.includes('perfect_score') ? 1 : 0)
  },
  {
    id: 'daily_streak_7',
    milestone: '7 Day Daily Challenge Streak',
    titleBn: 'সাপ্তাহিক কুইজ চ্যাম্পিয়ন',
    titleEn: 'Weekly Quiz Champion',
    titleJp: '週間チャンピオン',
    descriptionBn: 'টানা ৭ দিন দৈনিক চ্যালেঞ্জ সম্পন্ন করে সেরা ধারাবাহিকতা দেখিয়েছেন',
    icon: '⚔️',
    category: 'streak',
    targetValue: 7,
    xpReward: 200,
    getValue: (profile) => profile.dailyQuizStreak || 0
  },
  {
    id: 'streak_30',
    milestone: '30 Day Streak',
    titleBn: '৩০ দিনের সাধক',
    titleEn: '30 Day Streak',
    titleJp: '30日間継続',
    descriptionBn: 'টানা ৩০ দিন অবিরাম অনুশীলনে জাপানি ভাষার একনিষ্ঠ শিক্ষার্থী হয়েছেন',
    icon: '👑',
    category: 'streak',
    targetValue: 30,
    xpReward: 500,
    getValue: (profile) => profile.streak || 1
  }
];

export const evaluateBadgesForUser = (
  profile: UserProfile,
  existingSavedBadges?: Record<string, { unlockedAt: number }>
): BadgeRecord[] => {
  if (!profile) return [];

  return BADGE_DEFINITIONS.map(def => {
    const currentValue = def.getValue(profile);
    // Unlocked if value meets or exceeds target, or already marked in achievements
    const isUnlocked = currentValue >= def.targetValue || (profile.achievements || []).includes(def.id);
    
    let unlockedAt = existingSavedBadges?.[def.id]?.unlockedAt;
    if (isUnlocked && !unlockedAt) {
      unlockedAt = Date.now();
    }

    return {
      id: `${profile.uid}_${def.id}`,
      userId: profile.uid,
      badgeId: def.id,
      titleBn: def.titleBn,
      titleEn: def.titleEn,
      titleJp: def.titleJp,
      descriptionBn: def.descriptionBn,
      icon: def.icon,
      category: def.category,
      milestone: def.milestone,
      targetValue: def.targetValue,
      currentValue: Math.min(currentValue, def.targetValue),
      xpReward: def.xpReward,
      unlocked: isUnlocked,
      unlockedAt,
      syncedToFirestore: false
    };
  });
};
