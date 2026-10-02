import React from 'react';
import { 
  TrendingUp, 
  Flame, 
  Zap, 
  Trophy, 
  CheckCircle2, 
  Lock, 
  HelpCircle,
  BookOpen,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { ProgressBar } from '../common/ProgressBar';
import { ACHIEVEMENTS } from '../../data/achievementsData';
import { HIRAGANA_LEVELS } from '../../data/hiraganaData';
import { KATAKANA_LEVELS } from '../../data/katakanaData';
import { calculateUserLevel } from '../../utils/xpLevels';
import { StreakCounter } from '../common/StreakCounter';
import { userService } from '../../services/userService';
import { WeeklyStudyTimeChart } from './WeeklyStudyTimeChart';
import { ThirtyDayStreakActivityChart } from './ThirtyDayStreakActivityChart';
import { StudyCalendarHeatmap } from './StudyCalendarHeatmap';

interface ProgressDashboardProps {
  onNavigateToStudy?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onNavigateToStudy }) => {
  const { userProfile } = useAuth();

  const xp = userProfile?.xp || 0;
  const streak = userProfile?.streak || 1;
  const levelInfo = calculateUserLevel(xp);

  const hiraganaCompletedChars = userProfile?.hiraganaProgress?.completedChars || [];
  const katakanaCompletedChars = userProfile?.katakanaProgress?.completedChars || [];
  const hiraganaCompletedLevels = userProfile?.hiraganaProgress?.completedLevels || [];
  const katakanaCompletedLevels = userProfile?.katakanaProgress?.completedLevels || [];

  const totalCharsCompleted = hiraganaCompletedChars.length + katakanaCompletedChars.length;
  const overallPercentage = Math.min(100, Math.round((totalCharsCompleted / 92) * 100));

  const hiraganaPercentage = Math.min(100, Math.round((hiraganaCompletedChars.length / 46) * 100));
  const katakanaPercentage = Math.min(100, Math.round((katakanaCompletedChars.length / 46) * 100));

  const quizStats = userProfile?.quizStats || {
    totalQuizzes: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 100
  };

  const unlockedAchievements = new Set(userProfile?.achievements || []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner with Level & Experience */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                Learning Analytics
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
                <Award size={13} className="text-amber-500" />
                <span>Level {levelInfo.level}: {levelInfo.titleBn} ({levelInfo.titleJp})</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              আপনার শেখার অগ্রগতি (Progress & Stats)
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base mt-1">
              ধারাবাহিক অনুশীলন ও জাপানি বর্ণমালার দক্ষতা পর্যবেক্ষণ করুন।
            </p>
          </div>

          {/* User Quick Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <StreakCounter
              streak={streak}
              isGoalCompleted={userService.isDailyGoalCompletedToday(userProfile)}
              variant="card"
              className="py-2 px-3"
            />

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 min-w-20">
              <Zap size={20} className="fill-amber-500 text-amber-500 mb-1" />
              <span className="text-base font-black text-amber-900 dark:text-amber-200 leading-tight">{xp}</span>
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">মোট XP</span>
            </div>
          </div>
        </div>

        {/* Global Level & Kana Progress Dual Bars */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Experience / Level Progress Bar */}
          <div className="p-4 rounded-xl bg-stone-50/70 dark:bg-stone-800/30 border border-stone-200/60 dark:border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>লেভেল {levelInfo.level} অভিজ্ঞতা (XP Level)</span>
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {levelInfo.currentLevelXp} / {levelInfo.xpForNextLevel} XP ({levelInfo.progressPercent}%)
              </span>
            </div>
            <ProgressBar 
              value={levelInfo.progressPercent} 
              colorClass="bg-gradient-to-r from-amber-500 to-yellow-400" 
              heightClass="h-3"
            />
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5 flex justify-between">
              <span>পরবর্তী লেভেলে উন্নীত হতে:</span>
              <span className="font-semibold text-stone-700 dark:text-stone-300">আর {levelInfo.xpForNextLevel - levelInfo.currentLevelXp} XP প্রয়োজন</span>
            </p>
          </div>

          {/* Total 92 Characters Progress Bar */}
          <div className="p-4 rounded-xl bg-stone-50/70 dark:bg-stone-800/30 border border-stone-200/60 dark:border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>সর্বমোট জাপানি বর্ণমালা (Total 92 Characters)</span>
              </span>
              <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                {totalCharsCompleted} / 92 ({overallPercentage}%)
              </span>
            </div>
            <ProgressBar 
              value={overallPercentage} 
              colorClass="bg-gradient-to-r from-rose-600 to-pink-500" 
              heightClass="h-3"
            />
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5 flex justify-between">
              <span>হিরাগানা + কাতাকানা:</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">{92 - totalCharsCompleted} টি বর্ণ এখনও বাকি</span>
            </p>
          </div>

        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Hiragana Completed */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">হিরাগানা অক্ষর</span>
              <BookOpen size={16} className="text-rose-600" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {hiraganaCompletedChars.length} / 46
            </div>
            <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1 mb-2.5">
              {hiraganaPercentage}% সম্পূর্ণ ({hiraganaCompletedLevels.length} লেভেল)
            </div>
          </div>
          <ProgressBar value={hiraganaPercentage} colorClass="bg-rose-600" heightClass="h-2" />
        </div>

        {/* Katakana Completed */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">কাতাকানা অক্ষর</span>
              <Layers size={16} className="text-blue-600" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {katakanaCompletedChars.length} / 46
            </div>
            <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-1 mb-2.5">
              {katakanaPercentage}% সম্পূর্ণ ({katakanaCompletedLevels.length} লেভেল)
            </div>
          </div>
          <ProgressBar value={katakanaPercentage} colorClass="bg-blue-600" heightClass="h-2" />
        </div>

        {/* Quiz Accuracy */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">কুইজ সঠিকতা</span>
              <HelpCircle size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {quizStats.accuracy}%
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 mb-2.5">
              {quizStats.correctAnswers} / {quizStats.totalQuestions} প্রশ্ন সঠিক
            </div>
          </div>
          <ProgressBar value={quizStats.accuracy} colorClass="bg-emerald-600" heightClass="h-2" />
        </div>

        {/* Quizzes Taken */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">দৈনিক চ্যালেঞ্জ স্ট্রিক</span>
              <Flame size={16} className="text-orange-500 fill-orange-500" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {userProfile?.dailyQuizStreak || 0} দিন
            </div>
            <div className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 mt-1 mb-2.5">
              {userProfile?.lastDailyQuizDate === new Date().toISOString().split('T')[0] ? 'আজকেরটি সম্পন্ন ✓' : 'আজ এখনও বাকি'}
            </div>
          </div>
          <ProgressBar 
            value={Math.min(100, ((userProfile?.dailyQuizStreak || 0) / 7) * 100)} 
            colorClass="bg-orange-500" 
            heightClass="h-2" 
          />
        </div>

      </div>

      {/* 30-Day Study Calendar Heatmap View (Habit Visualization & Streak Tracking) */}
      <StudyCalendarHeatmap 
        userProfile={userProfile} 
        onNavigateToStudy={onNavigateToStudy} 
      />

      {/* 30-Day Study Streak & Activity Volume Bar Chart */}
      <ThirtyDayStreakActivityChart userProfile={userProfile} />

      {/* Weekly Study Time Analytics Bar Chart (Hiragana vs Katakana) */}
      <WeeklyStudyTimeChart userProfile={userProfile} />

      {/* Level by Level Detailed Progression Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Hiragana Level Grid */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-xs">
                あ
              </span>
              <span>হিরাগানা লেভেল ব্রেকডাউন</span>
            </h3>
            <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
              {HIRAGANA_LEVELS.filter(lvl => hiraganaCompletedLevels.includes(lvl.level) || lvl.characters.every(c => hiraganaCompletedChars.includes(c.id))).length} / 10
            </span>
          </div>

          <div className="space-y-2.5">
            {HIRAGANA_LEVELS.map((lvl) => {
              const learnedInLevel = lvl.characters.filter(c => hiraganaCompletedChars.includes(c.id)).length;
              const isDone = hiraganaCompletedLevels.includes(lvl.level) || (lvl.characters.length > 0 && learnedInLevel === lvl.characters.length);
              const levelPct = Math.round((learnedInLevel / lvl.characters.length) * 100);
              return (
                <div 
                  key={lvl.level}
                  className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 text-xs transition-colors hover:border-rose-200 dark:hover:border-rose-900/40"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-700 dark:text-stone-300">Level {lvl.level}:</span>
                      <span className="font-serif font-bold text-stone-900 dark:text-white">{lvl.characters.map(c => c.character).join(' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 dark:text-stone-400 font-semibold">{learnedInLevel}/{lvl.characters.length}</span>
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-700" />
                      )}
                    </div>
                  </div>
                  <ProgressBar 
                    value={levelPct} 
                    colorClass={isDone ? "bg-emerald-600" : "bg-rose-500"} 
                    heightClass="h-1.5"
                    showShimmer={levelPct > 0}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Katakana Level Grid */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                ア
              </span>
              <span>কাতাকানা লেভেল ব্রেকডাউন</span>
            </h3>
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
              {KATAKANA_LEVELS.filter(lvl => katakanaCompletedLevels.includes(lvl.level) || lvl.characters.every(c => katakanaCompletedChars.includes(c.id))).length} / 10
            </span>
          </div>

          <div className="space-y-2.5">
            {KATAKANA_LEVELS.map((lvl) => {
              const learnedInLevel = lvl.characters.filter(c => katakanaCompletedChars.includes(c.id)).length;
              const isDone = katakanaCompletedLevels.includes(lvl.level) || (lvl.characters.length > 0 && learnedInLevel === lvl.characters.length);
              const levelPct = Math.round((learnedInLevel / lvl.characters.length) * 100);
              return (
                <div 
                  key={lvl.level}
                  className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 text-xs transition-colors hover:border-blue-200 dark:hover:border-blue-900/40"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-700 dark:text-stone-300">Level {lvl.level}:</span>
                      <span className="font-serif font-bold text-stone-900 dark:text-white">{lvl.characters.map(c => c.character).join(' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 dark:text-stone-400 font-semibold">{learnedInLevel}/{lvl.characters.length}</span>
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-700" />
                      )}
                    </div>
                  </div>
                  <ProgressBar 
                    value={levelPct} 
                    colorClass={isDone ? "bg-emerald-600" : "bg-blue-500"} 
                    heightClass="h-1.5"
                    showShimmer={levelPct > 0}
                  />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Achievements Showcase */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              <span>অর্জিত ব্যাজ ও সম্মাননা (Achievements)</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              বিভিন্ন মাইলফলক অর্জনের মাধ্যমে বিশেষ ব্যাজ ও এক্সপি আনলক করুন।
            </p>
          </div>
          <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900">
            {unlockedAchievements.size} / {ACHIEVEMENTS.length} আনলকড
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedAchievements.has(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60 ring-1 ring-amber-400/30'
                    : 'bg-stone-50/70 dark:bg-stone-800/30 border-stone-200 dark:border-stone-800 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  isUnlocked ? 'bg-amber-100 dark:bg-amber-900/50 shadow-xs' : 'bg-stone-200 dark:bg-stone-800 grayscale'
                }`}>
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {ach.titleBn}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 shrink-0">
                        +{ach.xpReward} XP
                      </span>
                    ) : (
                      <Lock size={12} className="text-stone-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                    {ach.descriptionBn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
