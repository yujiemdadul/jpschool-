export type KanaType = 'hiragana' | 'katakana';

export interface KanaExample {
  japanese: string;
  romaji: string;
  bangla: string;
  english?: string;
}

export interface StrokeStep {
  step: number;
  instructionBn: string;
  pathData?: string;
}

export interface KanaChar {
  id: string; // e.g. "h_a", "k_ka"
  character: string; // あ, ア
  type: KanaType;
  row: string; // 'a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa'
  level: number; // 1 to 10
  romaji: string; // a, ka, shi, etc.
  bangla: string; // আ, কা, শি, etc.
  mnemonicBn?: string;
  strokeCount: number;
  strokeSteps: StrokeStep[];
  examples: KanaExample[];
}

export interface KanaLevel {
  level: number;
  type: KanaType;
  titleBn: string;
  titleJp: string;
  characters: KanaChar[];
  descriptionBn: string;
}

export type QuizType = 
  | 'jp_to_bn'       // あ -> আ
  | 'bn_to_jp'       // আ -> あ
  | 'jp_to_romaji'   // あ -> a
  | 'romaji_to_jp'   // a -> あ
  | 'listen_to_jp';  // Audio -> あ

export interface QuizQuestion {
  id: string;
  type: QuizType;
  promptText: string;
  promptChar?: string;
  audioChar?: string;
  options: string[]; // exactly 4 unique options
  correctOptionIndex: number; // 0, 1, 2, 3
  correctAnswer: string;
  explanationBn: string;
  sourceKana: KanaChar;
}

export type QuizCourseType = KanaType | 'mixed' | 'kanji' | 'daily_challenge' | 'mistakes';

export interface QuizResultRecord {
  id?: string;
  course: QuizCourseType;
  level?: number;
  titleBn?: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  xpEarned: number;
  timeSpentSeconds?: number;
  timestamp: number;
  dateKey?: string;
}

export interface CompletedLessonRecord {
  id: string;
  course: KanaType | 'kanji';
  level?: number;
  titleBn: string;
  titleJp?: string;
  characters?: string[];
  xpEarned: number;
  completedAt: number;
  dateKey: string;
}

export interface UserProgress {
  completedLevels: number[]; // e.g. [1, 2, 3]
  completedChars: string[]; // e.g. ["h_a", "h_i"]
  lastLevel: number;
}

export interface UserStats {
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface Achievement {
  id: string;
  titleBn: string;
  titleJp?: string;
  descriptionBn: string;
  icon: string;
  unlockedAt?: number;
  xpReward: number;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  xp: number;
  streak: number;
  hiraganaLevelsCount: number;
  katakanaLevelsCount: number;
  totalCompletedChars: number;
  lastLogin?: number;
}

export interface MistakeRecord {
  id: string; // Keyed by kanaId, e.g. "mistake_h_a"
  kanaId: string;
  character: string; // あ or ア
  romaji: string;
  bangla: string;
  type: KanaType;
  level: number;
  wrongCount: number; // Number of times user failed this character
  lastMistakeAt: number; // Timestamp of last mistake
  lastQuestionPrompt?: string; // Text of the question failed
  userAnswer?: string; // Selected wrong option
  correctAnswer?: string; // Correct answer
  mastered?: boolean; // Whether user has reviewed and fixed this mistake
  resolvedAt?: number;
}

export interface StreakFreezeRecord {
  id: string; // Unique ID, e.g. "freeze_1726567200000"
  purchasedAt: number; // Timestamp of purchase
  costXP: number; // XP points spent
  status: 'active' | 'used'; // Active or consumed
  usedAt?: number; // Timestamp when used
  usedForDate?: string; // YYYY-MM-DD that was protected
  descriptionBn?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: number;
  lastLogin: number;
  xp: number;
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD in local time
  hiraganaProgress: UserProgress;
  katakanaProgress: UserProgress;
  quizStats: UserStats;
  achievements: string[]; // IDs of unlocked achievements
  mistakes?: MistakeRecord[]; // Records of incorrectly answered characters
  streakFreezeCount?: number; // Total active/equipped streak freezes (e.g. 0, 1, 2)
  streakFreezeInventory?: StreakFreezeRecord[]; // History and active list of streak freezes
  lastStreakFreezeUsedAt?: number;
  lastStreakFreezeUsedForDate?: string;
  experienceLevel?: 'beginner' | 'some_knowledge' | 'know_hiragana' | 'know_katakana';
  scriptLanguage?: 'bangla' | 'english'; // Default: 'bangla'
  soundEnabled?: boolean; // Japanese character and quiz pronunciation audio (Default: true)
  soundEffectsEnabled?: boolean; // Sound effects & mascot audio (Default: true)
  lastDailyQuizDate?: string; // YYYY-MM-DD
  dailyQuizStreak?: number;
  dailyQuizLastCompletedAt?: number;
  dailyStudyGoalMinutes?: number; // Daily study commitment in minutes (Default: 10)
  dailyXpGoal?: number; // User configurable daily XP goal (Default: 50 XP)
  dailyXpHistory?: Record<string, number>; // Maps YYYY-MM-DD to earned XP on that day
  hasCompletedGoalOnboarding?: boolean; // True once user completes or dismisses initial goal setup
  studyReminderEnabled?: boolean; // Daily study reminder toggle using Notification API
  studyReminderTime?: string; // Preferred daily reminder time in HH:MM format (Default: '20:00')
  totalCharactersMastered?: number; // Total Japanese characters mastered through lessons, reviews, and quizzes
  kanjiProgress?: {
    learnedKanjiIds: string[];
    lastStudiedKanjiId?: string;
  };
  quizHistory?: QuizResultRecord[];
  completedLessonHistory?: CompletedLessonRecord[];
  isGuest?: boolean;
}

export type KanjiCategory = 
  | 'nature'       // প্রকৃতি ও উপাদান (日, 月, 火, 水, 木, 金, 土, 山, 川, 雨, 天, 気)
  | 'numbers'      // সংখ্যা ও গণনা (一, 二, 三, 四, 五, 六, 七, 八, 九, 十, 百, 千, 万, 円)
  | 'people'       // মানুষ, পরিবার ও শরীর (人, 子, 女, 男, 父, 母, 目, 耳, 口, 手, 足)
  | 'directions'   // দিক, অবস্থান ও সময় (上, 下, 左, 右, 中, 前, 後, 北, 南, 東, 西, 時, 年, 半, 今, 間)
  | 'actions'      // মৌলিক ক্রিয়াপদ (見, 食, 飲, 行, 来, 話, 読, 書, 聞, 休, 立)
  | 'life';        // সমাজ, স্কুল ও জীবন (学, 校, 先, 生, 本, 国, 道, 店, 大, 小, 白, 友, 名, 車, 門, 魚)

export interface KanjiExample {
  word: string;
  reading: string;
  readingBn: string;
  meaningBn: string;
}

export interface KanjiChar {
  id: string;
  character: string;
  meaningBn: string;
  meaningEn: string;
  onyomi: string[];
  kunyomi: string[];
  onyomiBn: string[];
  kunyomiBn: string[];
  strokeCount: number;
  level: 'N5';
  category: KanjiCategory;
  categoryBn: string;
  mnemonicStoryBn: string;
  visualOrigin: {
    realWorldObject: string;
    ancientFormDescription: string;
    transformationHint: string;
    pictogramType: string;
  };
  examples: KanjiExample[];
}

export type BadgeCategory = 'milestone' | 'streak' | 'characters' | 'quiz' | 'mastery';

export interface BadgeRecord {
  id: string; // Document ID: `${userId}_${badgeId}`
  userId: string;
  badgeId: string;
  titleBn: string;
  titleEn: string;
  titleJp: string;
  descriptionBn: string;
  icon: string;
  category: BadgeCategory;
  milestone: string; // e.g. '7 Day Streak', '100 Characters Mastered'
  targetValue: number;
  currentValue: number;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: number;
  syncedToFirestore?: boolean;
}

export type PdfCategory = 
  | 'grammar'       // ব্যাকরণ ও বাক্য গঠন
  | 'kanji'         // কাঞ্জি শিট ও স্ট্রোক
  | 'vocabulary'    // শব্দভাণ্ডার ও শব্দকোষ
  | 'writing'       // হিরাগানা ও কাতাকানা লেখার বই
  | 'jlpt'          // JLPT N5/N4 পরীক্ষার প্রশ্ন ও সমাধান
  | 'conversation'  // প্রাত্যহিক কথোপকথন
  | 'guide';        // পূর্ণাঙ্গ শিখন গাইড ও রেফারেন্স

export type JlptLevel = 'all' | 'N5' | 'N4' | 'N3' | 'beginner';

export interface JapanesePdf {
  id: string;
  titleBn: string;
  titleJp?: string;
  descriptionBn: string;
  category: PdfCategory;
  level: JlptLevel;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  pageCount?: number;
  uploadedBy: string;
  uploadedAt: number;
  downloadCount: number;
  viewCount?: number;
  isFeatured?: boolean;
  driveUrl?: string;
}

export type CommunityPlatform = 'facebook' | 'telegram' | 'whatsapp' | 'discord' | 'youtube' | 'custom';

export interface CommunityPopupConfig {
  id: string;
  isEnabled: boolean;
  titleBn: string;
  titleJp?: string;
  tagBn?: string;
  descriptionBn: string;
  imageUrl?: string;
  primaryLinkUrl: string;
  primaryLinkText: string;
  primaryPlatform: CommunityPlatform;
  secondaryLinkUrl?: string;
  secondaryLinkText?: string;
  secondaryPlatform?: CommunityPlatform;
  badgeText?: string;
  highlightPoints?: string[];
  snoozeHours: number; // default: 6 hours
  updatedAt: number;
  updatedBy?: string;
}

