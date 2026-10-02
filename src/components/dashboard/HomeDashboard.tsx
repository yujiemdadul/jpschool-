import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Zap, 
  Trophy, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  CheckCircle, 
  Target,
  Sparkles,
  Compass,
  Clock,
  Gift,
  Play,
  Award,
  Sliders,
  ChevronRight,
  RotateCcw,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { ProgressBar } from '../common/ProgressBar';
import { NavTab } from '../common/Navbar';
import { HIRAGANA_LEVELS } from '../../data/hiraganaData';
import { KATAKANA_LEVELS } from '../../data/katakanaData';
import { userService } from '../../services/userService';
import { DailyQuizModal } from './DailyQuizModal';
import { calculateUserLevel } from '../../utils/xpLevels';
import { FoxAvatar } from '../fox/FoxAvatar';
import { FoxGuideModal } from '../fox/FoxGuideModal';
import { playKitsuneChime } from '../../utils/speech';
import { StreakCounter } from '../common/StreakCounter';
import { DailyXpProgressRing } from '../common/DailyXpProgressRing';
import { HomeInstallBanner } from './HomeInstallBanner';

interface HomeDashboardProps {
  onNavigate: (tab: NavTab, subLevel?: number) => void;
  onOpenLevelModal: (type: 'hiragana' | 'katakana', level: number, initialStep?: 1 | 2 | 3 | 4) => void;
  onStartQuiz: (course: 'hiragana' | 'katakana' | 'mixed', level?: number) => void;
  onOpenGoalWizard?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenLevelModal,
  onStartQuiz,
  onOpenGoalWizard
}) => {
  const { userProfile } = useAuth();
  const [isDailyModalOpen, setIsDailyModalOpen] = useState<boolean>(false);
  const [isFoxGuideOpen, setIsFoxGuideOpen] = useState<boolean>(false);
  const [countdownStr, setCountdownStr] = useState<string>('');

  const displayName = userProfile?.displayName || 'শিক্ষার্থী';
  const streak = userProfile?.streak || 1;
  const xp = userProfile?.xp || 0;
  const achievementsCount = userProfile?.achievements?.length || 0;
  const dailyStreak = userProfile?.dailyQuizStreak || 0;
  const isDailyDoneToday = userService.isDailyQuizCompletedToday(userProfile);
  const dailyXpGoal = userService.getDailyXpGoal(userProfile);
  const todayEarnedXp = userService.getTodayEarnedXP(userProfile);
  const isDailyGoalMet = todayEarnedXp >= dailyXpGoal;

  // Calculate live countdown to midnight (next 24h reset)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, midnight.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdownStr(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate overall progress across 92 total characters (46 Hiragana + 46 Katakana)
  const hiraganaCompletedCount = userProfile?.hiraganaProgress?.completedChars?.length || 0;
  const katakanaCompletedCount = userProfile?.katakanaProgress?.completedChars?.length || 0;
  const kanjiCompletedCount = userProfile?.kanjiProgress?.learnedKanjiIds?.length || 0;
  const pendingMistakes = userService.getActiveMistakes(userProfile);
  const totalCompletedChars = hiraganaCompletedCount + katakanaCompletedCount;
  const overallPercentage = Math.min(100, Math.round((totalCompletedChars / 92) * 100));

  // Determine current active level to continue
  const hiraganaLevelsDone = userProfile?.hiraganaProgress?.completedLevels || [];
  let continueCourse: 'hiragana' | 'katakana' = 'hiragana';
  let continueLevelNum = 1;

  for (let i = 1; i <= 10; i++) {
    if (!hiraganaLevelsDone.includes(i)) {
      continueLevelNum = i;
      break;
    }
    if (i === 10) {
      // Check katakana
      continueCourse = 'katakana';
      const katakanaLevelsDone = userProfile?.katakanaProgress?.completedLevels || [];
      for (let j = 1; j <= 10; j++) {
        if (!katakanaLevelsDone.includes(j)) {
          continueLevelNum = j;
          break;
        }
      }
    }
  }

  const activeLevelObj = continueCourse === 'hiragana'
    ? HIRAGANA_LEVELS.find(l => l.level === continueLevelNum) || HIRAGANA_LEVELS[0]
    : KATAKANA_LEVELS.find(l => l.level === continueLevelNum) || KATAKANA_LEVELS[0];

  const continueLevelChars = activeLevelObj.characters;
  const currentCompletedCharsList = (continueCourse === 'hiragana'
    ? userProfile?.hiraganaProgress?.completedChars
    : userProfile?.katakanaProgress?.completedChars) || [];
  const isContinueLevelAllCharsLearned = continueLevelChars.length > 0 &&
    continueLevelChars.every(c => currentCompletedCharsList.includes(c.id));

  const activeCharsPreview = activeLevelObj.characters.map(c => c.character).join(' ');

  const levelInfo = calculateUserLevel(xp);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Greeting Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                Chandu Japanese School
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
                <Award size={12} className="text-amber-500" />
                <span>Level {levelInfo.level}: {levelInfo.titleBn}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              こんにちは, {displayName} 👋
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base mt-1">
              আজ কী শিখবে? ধাপে ধাপে জাপানি পড়ার দক্ষতা বাড়িয়ে তুলুন।
            </p>
          </div>

          {/* User Stats Badges Grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            {/* XP */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 min-w-20 sm:min-w-24">
              <Zap size={20} className="fill-amber-500 text-amber-500 mb-1" />
              <span className="text-base sm:text-lg font-black text-amber-900 dark:text-amber-200 leading-tight">
                {xp}
              </span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                XP অর্জিত
              </span>
            </div>

            {/* Streak Counter Card with Keyframe Fire & Sparkles */}
            <StreakCounter
              streak={streak}
              isGoalCompleted={userService.isDailyGoalCompletedToday(userProfile)}
              variant="card"
            />

            {/* Achievements */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 min-w-20 sm:min-w-24">
              <Trophy size={20} className="fill-emerald-500 text-emerald-500 mb-1" />
              <span className="text-base sm:text-lg font-black text-emerald-900 dark:text-emerald-200 leading-tight">
                {achievementsCount}
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                অর্জন 🏆
              </span>
            </div>
          </div>
        </div>

        {/* Level XP & Overall Progress Grid */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Level XP Progress Bar */}
          <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  লেভেল {levelInfo.level} অগ্রগতি ({levelInfo.titleJp})
                </span>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {levelInfo.currentLevelXp} / {levelInfo.xpForNextLevel} XP ({levelInfo.progressPercent}%)
              </span>
            </div>
            <ProgressBar 
              value={levelInfo.progressPercent} 
              colorClass="bg-gradient-to-r from-amber-500 to-yellow-400" 
              heightClass="h-2.5"
            />
          </div>

          {/* Overall 92 Chars Progress Bar */}
          <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  মোট কাণা সমাপ্তি (Overall Kana)
                </span>
              </div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {totalCompletedChars} / 92 অক্ষর ({overallPercentage}%)
              </span>
            </div>
            <ProgressBar 
              value={overallPercentage} 
              colorClass="bg-gradient-to-r from-rose-600 to-pink-500" 
              heightClass="h-2.5"
            />
          </div>

        </div>
      </div>

      {/* PWA App Home Page Download / Add to Home Screen Banner */}
      <HomeInstallBanner />

      {/* Featured: Daily Quiz Challenge Banner */}
      <div 
        id="card-daily-quiz-challenge"
        className={`relative overflow-hidden rounded-2xl border-2 transition-all p-5 sm:p-6 shadow-sm ${
          isDailyDoneToday 
            ? 'bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-stone-50 dark:from-emerald-950/20 dark:via-stone-900 dark:to-stone-900 border-emerald-200 dark:border-emerald-900/50' 
            : 'bg-gradient-to-r from-amber-50 via-orange-50/70 to-rose-50/60 dark:from-amber-950/30 dark:via-stone-900 dark:to-rose-950/20 border-amber-300 dark:border-amber-800/80 shadow-amber-500/5'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                isDailyDoneToday 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-amber-500 text-white animate-pulse'
              }`}>
                <Zap size={13} className="fill-white" />
                <span>দৈনিক কুইজ চ্যালেঞ্জ (Daily Challenge)</span>
              </span>

              {dailyStreak > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-xs font-bold">
                  <Flame size={13} className="fill-orange-500 text-orange-500" />
                  <span>{dailyStreak} দিনের স্ট্রিক</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold">
                <Gift size={13} />
                <span>+50 Bonus XP</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              {isDailyDoneToday 
                ? '🎉 আজকের দৈনিক চ্যালেঞ্জ সম্পন্ন হয়েছে!' 
                : '⚡ আজকের ৫টি দ্রুত প্রশ্নের চ্যালেঞ্জ নিন!'}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl">
              {isDailyDoneToday 
                ? `আপনি আজকের +50 XP বোনাস অর্জন করেছেন। আপনার দৈনিক চ্যালেঞ্জ স্ট্রিক অব্যাহত আছে (${dailyStreak} দিন)।` 
                : 'প্রতি ২৪ ঘণ্টায় একবার ৫টি প্রশ্নের উত্তর দিয়ে স্ট্রিক বৃদ্ধি করুন এবং নিশ্চিত +৫০ বোনাস XP সংগ্রহ করুন।'}
            </p>

            {isDailyDoneToday && (
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <Clock size={14} />
                <span>পরবর্তী চ্যালেঞ্জ আনলক হবে: <strong className="font-mono text-emerald-800 dark:text-emerald-300">{countdownStr}</strong></span>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              id="btn-start-daily-quiz-main"
              onClick={() => setIsDailyModalOpen(true)}
              className={`px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                isDailyDoneToday 
                  ? 'bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20'
              }`}
            >
              {isDailyDoneToday ? (
                <>
                  <CheckCircle size={18} className="text-emerald-400" />
                  <span>পুনরায় অনুশীলন করুন</span>
                </>
              ) : (
                <>
                  <Play size={18} className="fill-white" />
                  <span>চ্যালেঞ্জ শুরু করুন (৫টি প্রশ্ন)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Continue Learning Card + Daily Goal Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Continue Learning Featured Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-stone-900 dark:to-rose-950/30 border-2 border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Japanese Watermark */}
          <span className="absolute -right-4 -bottom-6 text-9xl font-serif text-rose-200/40 dark:text-rose-900/20 pointer-events-none select-none font-bold">
            {activeLevelObj.characters[0]?.character || 'あ'}
          </span>

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-rose-600 text-white shadow-xs">
                <Sparkles size={13} />
                <span>চালিয়ে যান (Continue Learning)</span>
              </span>
              <span className="text-xs font-extrabold text-stone-600 dark:text-stone-300">
                Level {continueLevelNum} / 10
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mb-1">
              {continueCourse === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'} — Level {continueLevelNum}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">
              {activeLevelObj.descriptionBn}
            </p>

            {/* Characters big preview */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 my-4">
              {activeLevelObj.characters.map(char => {
                const isEnglishMode = userProfile?.scriptLanguage === 'english';
                return (
                  <div 
                    key={char.id}
                    className="flex flex-col items-center justify-center w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-white dark:bg-stone-800 border border-rose-200 dark:border-stone-700 shadow-xs"
                  >
                    <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                      {char.character}
                    </span>
                    <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                      {isEnglishMode ? char.romaji : char.bangla}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-rose-200/60 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-600 dark:text-stone-300">
              অগ্রগতি: {continueCourse === 'hiragana' ? hiraganaLevelsDone.length : (userProfile?.katakanaProgress?.completedLevels?.length || 0)} / 10 লেভেল সম্পন্ন
            </div>
            
            <button
              type="button"
              id="btn-continue-learning"
              onClick={() => onOpenLevelModal(continueCourse, continueLevelNum, isContinueLevelAllCharsLearned ? 4 : 1)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{isContinueLevelAllCharsLearned ? 'কুইজ সম্পন্ন করুন' : 'চালিয়ে যাও'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Daily Goal & XP Progress Ring Card */}
        <div id="card-daily-xp-goal-dashboard" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Title & Goal Settings Link */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold text-sm">
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                  <Target size={16} />
                </div>
                <span>আজকের XP লক্ষ্যমাত্রা</span>
              </div>

              <button
                type="button"
                id="btn-edit-daily-goal-link"
                onClick={() => {
                  if (onOpenGoalWizard) {
                    onOpenGoalWizard();
                  } else {
                    onNavigate('profile');
                  }
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/60 transition cursor-pointer"
                title="দৈনিক লক্ষ্য ও সময় পরিবর্তন করুন"
              >
                <Sliders size={12} />
                <span>লক্ষ্য পরিবর্তন</span>
              </button>
            </div>

            {/* Visual Progress Ring Centerpiece */}
            <div className="py-2.5 flex items-center justify-center">
              <DailyXpProgressRing
                currentXP={todayEarnedXp}
                goalXP={dailyXpGoal}
                size={130}
                strokeWidth={10}
                showDetails={true}
                onClick={() => onNavigate('profile')}
              />
            </div>

            {/* Streak Counter Fire Banner */}
            <div className="my-3">
              <StreakCounter
                streak={streak}
                isGoalCompleted={isDailyGoalMet || userService.isDailyGoalCompletedToday(userProfile)}
                variant="featured"
                showBonusBadge={true}
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                <span>আজকের স্থিতি:</span>
                <span className={`font-bold ${isDailyGoalMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {isDailyGoalMet ? '✓ দৈনিক লক্ষ্য অর্জিত!' : `আর ${Math.max(0, dailyXpGoal - todayEarnedXp)} XP প্রয়োজন`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                <span>দৈনিক স্ট্রিক বোনাস:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">+10 XP</span>
              </div>
            </div>
          </div>

          <div className="pt-3.5 mt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2">
            {!isDailyDoneToday ? (
              <button
                type="button"
                id="btn-dashboard-daily-challenge"
                onClick={() => setIsDailyModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Flame size={15} className="fill-stone-950 text-stone-950 animate-bounce" />
                <span>আজকের ডেইলি কুইজ খেলুন (+৫০ XP)</span>
              </button>
            ) : (
              <button
                type="button"
                id="btn-quick-quiz"
                onClick={() => onStartQuiz('mixed')}
                className="w-full py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm hover:bg-stone-100 dark:hover:bg-stone-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <HelpCircle size={15} className="text-rose-600 dark:text-rose-400" />
                <span>র‌্যান্ডম কুইজ অনুশীলন</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Interactive Kitsune Fox Guide Mascot Card */}
      <div 
        id="card-kitsune-guide-spotlight"
        onClick={() => {
          playKitsuneChime();
          setIsFoxGuideOpen(true);
        }}
        className="relative overflow-hidden rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-orange-500/10 dark:from-rose-950/40 dark:via-stone-900 dark:to-amber-950/30 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-rose-400 dark:hover:border-rose-700 transition-all cursor-pointer group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <FoxAvatar size="md" isSpeaking={false} isHappy={true} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                  Interactive Fox Guide 🦊
                </span>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  きつね先生 (Kitsune Sensei)
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                ওয়েবসাইটের সবকিছু এক নজরে বুঝে নিন ও জাপানি শেখার কৌশল জানুন
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                কোর্স ট্যুর, জাপানি বর্ণমালার সহজ কৌশল এবং অডিওসহ দৈনন্দিন প্রয়োজনীয় বাক্য দেখতে ট্যাপ করুন।
              </p>
            </div>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 inline-flex items-center justify-center gap-1.5 transition-all group-hover:scale-102 shrink-0 cursor-pointer"
          >
            <span>গাইড খুলুন</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Mistakes Review Callout Card (shown if user has mistakes needing practice) */}
      {pendingMistakes.length > 0 && (
        <div 
          id="card-mistakes-callout"
          onClick={() => onNavigate('mistakes')}
          className="relative overflow-hidden rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/10 dark:from-amber-950/40 dark:via-stone-900 dark:to-rose-950/30 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
                <RotateCcw size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                    ভুল পর্যালোচনার খাতা 📝
                  </span>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    {pendingMistakes.length}টি বর্ণ সংশোধনের বাকি
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                  কুইজে ভুল হওয়া বর্ণগুলো প্র্যাকটিস করে ঠিক করে নিন
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  প্রতিটি ভুল বর্ণ সফলভাবে সংশোধন করলে পাবেন +১৫ XP বোনাস!
                </p>
              </div>
            </div>

            <button
              type="button"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 inline-flex items-center justify-center gap-1.5 transition-all group-hover:scale-102 shrink-0 cursor-pointer"
            >
              <span>ভুলগুলো প্র্যাকটিস করুন</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Main Study Tracks Cards (Hiragana & Katakana & Quizzes) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Compass size={18} className="text-rose-600" />
            <span>কোর্স মডিউলসমূহ</span>
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            স্ট্যান্ডার্ড Gojuuon বিন্যাসে সাজানো
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Hiragana Course Card */}
          <div 
            onClick={() => onNavigate('hiragana')}
            className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-900 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-lg">
                  あ
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  ১০ লেভেল (৪৬ অক্ষর)
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-rose-600 transition-colors">
                হিরাগানা (Hiragana)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-4">
                জাপানি পড়ার প্রথম ও সবচেয়ে গুরুত্বপূর্ণ মৌলিক বর্ণমালা।
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-600 dark:text-stone-300 mb-1.5">
                <span>সম্পন্ন:</span>
                <span>{hiraganaCompletedCount} / 46 অক্ষর</span>
              </div>
              <ProgressBar 
                value={(hiraganaCompletedCount / 46) * 100} 
                colorClass="bg-rose-600" 
              />
            </div>
          </div>

          {/* Katakana Course Card */}
          <div 
            onClick={() => onNavigate('katakana')}
            className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-blue-300 dark:hover:border-blue-900 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                  ア
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  ১০ লেভেল (৪৬ অক্ষর)
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-blue-600 transition-colors">
                কাতাকানা (Katakana)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-4">
                বিদেশি শব্দ, দেশ ও আধুনিক প্রযুক্তির নাম লেখার বর্ণমালা।
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-600 dark:text-stone-300 mb-1.5">
                <span>সম্পন্ন:</span>
                <span>{katakanaCompletedCount} / 46 অক্ষর</span>
              </div>
              <ProgressBar 
                value={(katakanaCompletedCount / 46) * 100} 
                colorClass="bg-blue-600" 
              />
            </div>
          </div>

          {/* Kanji N5 Course Card */}
          <div 
            onClick={() => onNavigate('kanji')}
            className="group bg-gradient-to-br from-rose-500/10 via-white to-amber-500/10 dark:from-stone-900 dark:via-stone-900 dark:to-rose-950/40 border border-rose-300/80 dark:border-rose-900/60 hover:border-rose-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xl font-serif shadow-xs">
                  漢
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  JLPT N5 বিশেষ
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-rose-600 transition-colors">
                কাঞ্জি চিত্রলিপি (Kanji)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-4">
                বাস্তব ছবি ও সহজ স্মৃতির কৌশল দিয়ে N5 কাঞ্জি সহজেই আয়ত্ত করুন।
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-600 dark:text-stone-300 mb-1.5">
                <span>সম্পন্ন:</span>
                <span>{kanjiCompletedCount} / 35 কাঞ্জি</span>
              </div>
              <ProgressBar 
                value={(kanjiCompletedCount / 35) * 100} 
                colorClass="bg-rose-600" 
              />
            </div>
          </div>

          {/* Interactive Quiz Engine Card */}
          <div 
            onClick={() => onNavigate('quiz')}
            className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-900 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                  🎯
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  ৫টি মোড
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                ইন্টারেক্টিভ কুইজ (Quizzes)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-4">
                অডিও লিসেনিং, রোমাজি ও উচ্চারণ যাচাই করে এক্সপি অর্জন করুন।
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-600 dark:text-stone-300 mb-1.5">
                <span>সঠিকতার হার:</span>
                <span>{userProfile?.quizStats?.accuracy || 100}%</span>
              </div>
              <ProgressBar 
                value={userProfile?.quizStats?.accuracy || 100} 
                colorClass="bg-emerald-600" 
              />
            </div>
          </div>

          {/* Student Leaderboard Card */}
          <div 
            onClick={() => onNavigate('leaderboard')}
            className="group bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 dark:from-amber-950/30 dark:via-stone-900 dark:to-stone-900 border border-amber-300/80 dark:border-amber-800/80 hover:border-amber-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
                  🏆
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  আসল নাম
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-600 transition-colors">
                শিক্ষার্থী লিডারবোর্ড (Rankings)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-4">
                শীর্ষ শিক্ষার্থীদের র‍্যাঙ্ক, সর্বোচ্চ XP ও স্ট্রিক দেখুন।
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-amber-200/60 dark:border-stone-800 text-xs font-bold text-amber-800 dark:text-amber-300">
              <span>র‍্যাঙ্কিং দেখুন</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Japanese PDF Library & Books Card */}
          <div 
            id="card-home-pdf-library"
            onClick={() => onNavigate('pdf')}
            className="group bg-gradient-to-br from-rose-500/10 via-white to-orange-500/10 dark:from-rose-950/30 dark:via-stone-900 dark:to-stone-900 border border-rose-300/80 dark:border-rose-900/60 hover:border-rose-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                  <FileText size={20} />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  ফ্রি রিসোর্স ও বই
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-rose-600 transition-colors">
                জাপানিজ PDF লাইব্রেরি (PDF Library)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-4">
                হিরাগানা ও কাতাকানা লেখার ওয়ার্কশিট, ব্যাকরণ সামারি ও JLPT প্রশ্ন শিট ডাউনলোড করুন।
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-rose-100 dark:border-stone-800 text-xs font-bold text-rose-600 dark:text-rose-400">
              <span>PDF লাইব্রেরি খুলুন</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>


        </div>
      </div>

      {/* Daily Quiz Challenge Modal */}
      <DailyQuizModal 
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
      />

      {/* Kitsune Fox Guide Modal */}
      <FoxGuideModal 
        isOpen={isFoxGuideOpen}
        onClose={() => setIsFoxGuideOpen(false)}
        onNavigate={onNavigate}
        onOpenLevel={onOpenLevelModal}
        onStartQuiz={onStartQuiz}
      />

    </div>
  );
};
