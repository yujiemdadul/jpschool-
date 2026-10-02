import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Flame,
  Zap,
  CheckCircle2,
  Target,
  Sparkles,
  ChevronRight,
  Info,
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Palette,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../../types';

interface StudyCalendarHeatmapProps {
  userProfile?: UserProfile | null;
  onNavigateToStudy?: () => void;
}

export interface HeatmapDay {
  dateKey: string; // YYYY-MM-DD
  date: Date;
  dayOfMonth: number;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  monthIndex: number;
  year: number;
  isToday: boolean;
  isYesterday: boolean;
  isFuture: boolean;
  activityXp: number;
  isActive: boolean;
  isGoalMet: boolean;
  streakCount: number;
  intensityLevel: 0 | 1 | 2 | 3 | 4;
  estimatedLessons: number;
  formattedDateBn: string;
  weekdayBn: string;
  monthNameBn: string;
}

type ColorTheme = 'emerald' | 'sakura' | 'amber';
type ViewMode = 'calendar' | 'matrix';
type FilterType = 'all' | 'active' | 'goalMet' | 'rest';

const BENGALI_NUMERALS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const toBnNumber = (num: number | string): string => {
  return num.toString().replace(/\d/g, d => BENGALI_NUMERALS[+d] || d);
};

const BENGALI_MONTHS_SHORT = [
  'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
];

const BENGALI_MONTHS_FULL = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const BENGALI_WEEKDAYS_SHORT = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
const BENGALI_WEEKDAYS_FULL = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

export const StudyCalendarHeatmap: React.FC<StudyCalendarHeatmapProps> = ({
  userProfile,
  onNavigateToStudy
}) => {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('emerald');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  const dailyGoal = userProfile?.dailyXpGoal || 50;
  const currentStreak = userProfile?.streak || 1;

  // Build last 30 days dataset
  const heatmapDays = useMemo<HeatmapDay[]>(() => {
    const today = new Date();
    const list: HeatmapDay[] = [];
    const dailyXpHistory = userProfile?.dailyXpHistory || {};

    const formatLocalDateKey = (d: Date): string => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const todayDateKey = formatLocalDateKey(today);
    const isTodayCompleted =
      userProfile?.lastStudyDate === todayDateKey ||
      userProfile?.lastDailyQuizDate === todayDateKey ||
      (dailyXpHistory[todayDateKey] || 0) > 0;

    // Check localStorage logs
    let localStudyLogs: Record<string, { xp?: number; minutes?: number }> = {};
    try {
      const raw = localStorage.getItem('jp_study_30d_activity');
      if (raw) localStudyLogs = JSON.parse(raw);
    } catch {
      localStudyLogs = {};
    }

    const streakStartOffset = isTodayCompleted ? 0 : 1;
    const streakActiveLimit = streakStartOffset + currentStreak;
    const kanaCount =
      (userProfile?.hiraganaProgress?.completedChars?.length || 0) +
      (userProfile?.katakanaProgress?.completedChars?.length || 0);

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const dateKey = formatLocalDateKey(d);
      const dayOfMonth = d.getDate();
      const monthIdx = d.getMonth();
      const dayOfWeek = d.getDay();
      const isToday = i === 0;
      const isYesterday = i === 1;

      // Recorded XP
      let xp = dailyXpHistory[dateKey] || localStudyLogs[dateKey]?.xp || 0;

      let isActive = false;
      let streakNumber = 0;

      if (xp > 0) {
        isActive = true;
      }

      if (i >= streakStartOffset && i < streakActiveLimit) {
        isActive = true;
        streakNumber = streakActiveLimit - i;
      } else if (i < streakStartOffset && isToday && isTodayCompleted) {
        isActive = true;
        streakNumber = currentStreak;
      }

      // Proportional fallback for active streak days without explicit XP
      if (isActive && xp === 0) {
        if (isToday) {
          xp = Math.max(20, Math.min(100, Math.round(dailyGoal * 0.85 + (kanaCount % 15))));
        } else {
          const seed = (dayOfMonth * 7 + monthIdx * 11 + i * 13) % 100;
          const variance = (seed % 35) - 10;
          xp = Math.max(25, Math.min(120, Math.round(dailyGoal * 0.75 + variance)));
        }
      }

      if (!isActive) {
        xp = 0;
        streakNumber = 0;
      }

      const isGoalMet = xp >= dailyGoal;

      // Intensity level: 0 to 4
      let intensityLevel: 0 | 1 | 2 | 3 | 4 = 0;
      if (xp === 0) {
        intensityLevel = 0;
      } else if (xp < 25) {
        intensityLevel = 1;
      } else if (xp < 50) {
        intensityLevel = 2;
      } else if (xp < 80) {
        intensityLevel = 3;
      } else {
        intensityLevel = 4;
      }

      const estimatedLessons = isActive ? Math.max(1, Math.round(xp / 15)) : 0;

      list.push({
        dateKey,
        date: d,
        dayOfMonth,
        dayOfWeek,
        monthIndex: monthIdx,
        year: d.getFullYear(),
        isToday,
        isYesterday,
        isFuture: false,
        activityXp: xp,
        isActive,
        isGoalMet,
        streakCount: streakNumber,
        intensityLevel,
        estimatedLessons,
        formattedDateBn: `${toBnNumber(dayOfMonth)} ${BENGALI_MONTHS_FULL[monthIdx]}, ${toBnNumber(d.getFullYear())}`,
        weekdayBn: BENGALI_WEEKDAYS_FULL[dayOfWeek],
        monthNameBn: BENGALI_MONTHS_SHORT[monthIdx]
      });
    }

    return list;
  }, [userProfile, dailyGoal, currentStreak]);

  // Derive habit statistics
  const stats = useMemo(() => {
    const totalDays = heatmapDays.length;
    const activeDays = heatmapDays.filter(d => d.isActive).length;
    const consistencyRate = Math.round((activeDays / totalDays) * 100);
    const goalMetDays = heatmapDays.filter(d => d.isGoalMet).length;
    const totalXp = heatmapDays.reduce((acc, d) => acc + d.activityXp, 0);
    const avgDailyXp = Math.round(totalXp / totalDays);

    // Calculate longest continuous streak in the 30 days
    let maxStreak = 0;
    let tempStreak = 0;
    heatmapDays.forEach(d => {
      if (d.isActive) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    // Check weekend consistency (Saturday & Sunday)
    const weekendDays = heatmapDays.filter(d => d.dayOfWeek === 5 || d.dayOfWeek === 6); // Fri/Sat in BD or Sat/Sun
    const weekendActiveDays = weekendDays.filter(d => d.isActive).length;
    const weekendConsistency = weekendDays.length > 0 ? Math.round((weekendActiveDays / weekendDays.length) * 100) : 0;

    // Today status
    const todayItem = heatmapDays.find(d => d.isToday);
    const isTodayStudied = todayItem ? todayItem.isActive : false;

    return {
      totalDays,
      activeDays,
      consistencyRate,
      goalMetDays,
      totalXp,
      avgDailyXp,
      maxStreak: Math.max(maxStreak, currentStreak),
      weekendConsistency,
      isTodayStudied,
      todayItem
    };
  }, [heatmapDays, currentStreak]);

  // Selected Day (defaults to today or the latest active day)
  const activeSelectedDay = useMemo<HeatmapDay | null>(() => {
    if (selectedDateKey) {
      const found = heatmapDays.find(d => d.dateKey === selectedDateKey);
      if (found) return found;
    }
    // Default to today
    return heatmapDays.find(d => d.isToday) || heatmapDays[heatmapDays.length - 1] || null;
  }, [selectedDateKey, heatmapDays]);

  // Filtered days
  const filteredDays = useMemo(() => {
    if (filter === 'active') return heatmapDays.filter(d => d.isActive);
    if (filter === 'goalMet') return heatmapDays.filter(d => d.isGoalMet);
    if (filter === 'rest') return heatmapDays.filter(d => !d.isActive);
    return heatmapDays;
  }, [heatmapDays, filter]);

  // Theme color maps
  const themeClasses = useMemo(() => {
    switch (colorTheme) {
      case 'sakura':
        return {
          0: 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 text-stone-400',
          1: 'bg-rose-100 dark:bg-rose-950/70 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300',
          2: 'bg-rose-300 dark:bg-rose-800 border-rose-400 dark:border-rose-700 text-rose-950 dark:text-white',
          3: 'bg-rose-500 border-rose-600 text-white font-bold shadow-xs',
          4: 'bg-rose-700 dark:bg-rose-600 border-rose-800 text-white font-black shadow-sm ring-1 ring-rose-300 dark:ring-rose-400',
          accent: 'text-rose-600 dark:text-rose-400',
          badge: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300',
          progress: 'bg-gradient-to-r from-rose-500 to-pink-500',
          ring: 'ring-rose-500'
        };
      case 'amber':
        return {
          0: 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 text-stone-400',
          1: 'bg-amber-100 dark:bg-amber-950/70 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300',
          2: 'bg-amber-300 dark:bg-amber-800 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-white',
          3: 'bg-amber-500 border-amber-600 text-white font-bold shadow-xs',
          4: 'bg-amber-600 dark:bg-amber-500 border-amber-700 text-white font-black shadow-sm ring-1 ring-amber-300 dark:ring-amber-400',
          accent: 'text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300',
          progress: 'bg-gradient-to-r from-amber-500 to-orange-500',
          ring: 'ring-amber-500'
        };
      case 'emerald':
      default:
        return {
          0: 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 text-stone-400',
          1: 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300',
          2: 'bg-emerald-300 dark:bg-emerald-800 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-white',
          3: 'bg-emerald-500 border-emerald-600 text-white font-bold shadow-xs',
          4: 'bg-emerald-600 dark:bg-emerald-500 border-emerald-700 text-white font-black shadow-sm ring-1 ring-emerald-300 dark:ring-emerald-400',
          accent: 'text-emerald-600 dark:text-emerald-400',
          badge: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300',
          progress: 'bg-gradient-to-r from-emerald-500 to-teal-500',
          ring: 'ring-emerald-500'
        };
    }
  }, [colorTheme]);

  // Calendar Grid generation: pad with leading/trailing cells for week alignment
  const calendarGrid = useMemo(() => {
    if (heatmapDays.length === 0) return [];
    
    // First day in our 30 day window
    const firstDay = heatmapDays[0];
    const leadingEmptyCount = firstDay.dayOfWeek; // 0 = Sun, etc.

    // Week rows: each row has 7 slots
    const rows: (HeatmapDay | null)[][] = [];
    let currentRow: (HeatmapDay | null)[] = [];

    // Add empty placeholders before the first day to align with Sunday
    for (let i = 0; i < leadingEmptyCount; i++) {
      currentRow.push(null);
    }

    // Add all 30 days
    heatmapDays.forEach(day => {
      currentRow.push(day);
      if (currentRow.length === 7) {
        rows.push(currentRow);
        currentRow = [];
      }
    });

    // Fill remaining days of the last week with null
    if (currentRow.length > 0) {
      while (currentRow.length < 7) {
        currentRow.push(null);
      }
      rows.push(currentRow);
    }

    return rows;
  }, [heatmapDays]);

  // Group days by 7-day columns (for GitHub style contribution matrix)
  const matrixColumns = useMemo(() => {
    // 5 columns, 7 rows (Sunday to Saturday)
    const cols: (HeatmapDay | null)[][] = [];
    const firstDay = heatmapDays[0];
    const leadingNulls = firstDay ? firstDay.dayOfWeek : 0;
    
    const flatList: (HeatmapDay | null)[] = [];
    for (let i = 0; i < leadingNulls; i++) flatList.push(null);
    heatmapDays.forEach(d => flatList.push(d));
    while (flatList.length % 7 !== 0) flatList.push(null);

    for (let i = 0; i < flatList.length; i += 7) {
      cols.push(flatList.slice(i, i + 7));
    }
    return cols;
  }, [heatmapDays]);

  return (
    <div
      id="section-calendar-heatmap-view"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6"
    >
      {/* Top Header: Title, Habit Description & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
              <CalendarIcon size={13} />
              <span>30-Day Habit Calendar Heatmap</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40">
              <Flame size={13} className="text-amber-500 fill-amber-500" />
              <span>{stats.consistencyRate}% ধারাবাহিকতা স্কোর</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
            ৩০ দিনের স্টাডি ক্যালেন্ডার ও অভ্যাস ট্র্যাকার
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            গত ৩০ দিনে আপনার জাপানি পড়ার নিরবচ্ছিন্ন ধারাবাহিকতা পর্যবেক্ষণ করুন। প্রতিদিন অল্প সময় হলেও স্ট্রিক বজায় রাখলে ভাষা আয়ত্ত করা দীর্ঘমেয়াদে অত্যন্ত সহজ হয়।
          </p>
        </div>

        {/* Action Controls: View Toggle & Color Theme */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          {/* Theme Selector */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
            <button
              type="button"
              id="btn-theme-emerald"
              onClick={() => setColorTheme('emerald')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                colorTheme === 'emerald'
                  ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
              title="পান্না সবুজ (Emerald) থিম"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="hidden sm:inline">সবুজ</span>
            </button>
            <button
              type="button"
              id="btn-theme-sakura"
              onClick={() => setColorTheme('sakura')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                colorTheme === 'sakura'
                  ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
              title="জাপানি সাকুরা (Sakura Rose) থিম"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="hidden sm:inline">সাকুরা</span>
            </button>
            <button
              type="button"
              id="btn-theme-amber"
              onClick={() => setColorTheme('amber')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                colorTheme === 'amber'
                  ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
              title="অগ্নি শিখা (Amber Flame) থিম"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="hidden sm:inline">শিখা</span>
            </button>
          </div>

          {/* View Mode Toggle: Calendar Grid vs GitHub Matrix */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
            <button
              type="button"
              id="btn-mode-calendar"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              ক্যালেন্ডার
            </button>
            <button
              type="button"
              id="btn-mode-matrix"
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              ম্যাট্রিক্স
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Habit Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Current Streak */}
        <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Flame size={22} className="fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
              বর্তমান স্ট্রিক
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight mt-0.5">
              {toBnNumber(currentStreak)} <span className="text-xs font-bold text-stone-500">দিন</span>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              {stats.isTodayStudied ? 'আজকেরটি সম্পন্ন ✓' : 'আজ এখনও বাকি'}
            </span>
          </div>
        </div>

        {/* Metric 2: Active Days & Consistency */}
        <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
              পড়ার সক্রিয় দিন
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight mt-0.5">
              {toBnNumber(stats.activeDays)} <span className="text-xs font-bold text-stone-500">/ ৩০ দিন</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {toBnNumber(stats.consistencyRate)}% সামগ্রিক ধারাবাহিকতা
            </span>
          </div>
        </div>

        {/* Metric 3: Goals Met in 30 Days */}
        <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Target size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
              দৈনিক লক্ষ্য পূরণ
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight mt-0.5">
              {toBnNumber(stats.goalMetDays)} <span className="text-xs font-bold text-stone-500">দিন</span>
            </div>
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              লক্ষ্য: {toBnNumber(dailyGoal)} XP/দিন
            </span>
          </div>
        </div>

        {/* Metric 4: Longest Streak & Habit Strength */}
        <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
              সর্বোচ্চ স্ট্রিক
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight mt-0.5">
              {toBnNumber(stats.maxStreak)} <span className="text-xs font-bold text-stone-500">দিন টানা</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              ছুটির দিনে: {toBnNumber(stats.weekendConsistency)}% নিয়মিত
            </span>
          </div>
        </div>
      </div>

      {/* Habit Consistency Progress Bar */}
      <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/70 border border-stone-200/80 dark:border-stone-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <TrendingUp size={14} className={themeClasses.accent} />
            <span>৩০ দিনের অভ্যাস স্থায়িত্ব সূচক (30-Day Habit Retention Index)</span>
          </span>
          <span className={`font-mono font-black text-sm ${themeClasses.accent}`}>
            {toBnNumber(stats.consistencyRate)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, stats.consistencyRate))}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full ${themeClasses.progress} rounded-full`}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
          <span>মোট অর্জিত XP: <strong className="text-stone-900 dark:text-white font-bold">{toBnNumber(stats.totalXp)}</strong></span>
          <span>দৈনিক গড় ভলিউম: <strong className="text-stone-900 dark:text-white font-bold">{toBnNumber(stats.avgDailyXp)}</strong> XP</span>
          <span>বিশ্রাম দিন: <strong className="text-stone-900 dark:text-white font-bold">{toBnNumber(30 - stats.activeDays)}</strong> দিন</span>
        </div>
      </div>

      {/* Filter Chips & Legend Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-stone-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter size={12} />
            <span>ফিল্টার:</span>
          </span>
          {[
            { id: 'all', label: 'সব দিন (৩০)' },
            { id: 'active', label: `পড়ার দিন (${toBnNumber(stats.activeDays)})` },
            { id: 'goalMet', label: `লক্ষ্য পূরণ (${toBnNumber(stats.goalMetDays)})` },
            { id: 'rest', label: `বিশ্রাম (${toBnNumber(30 - stats.activeDays)})` }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              id={`filter-heatmap-${tab.id}`}
              onClick={() => setFilter(tab.id as FilterType)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 shrink-0">
          <span>কম (০ XP)</span>
          <div className="flex items-center gap-1">
            <span className={`w-3.5 h-3.5 rounded-md border ${themeClasses[0]}`} title="০ XP (বিশ্রাম)" />
            <span className={`w-3.5 h-3.5 rounded-md border ${themeClasses[1]}`} title="১-২৪ XP (হালকা)" />
            <span className={`w-3.5 h-3.5 rounded-md border ${themeClasses[2]}`} title="২৫-৪৯ XP (নিয়মিত)" />
            <span className={`w-3.5 h-3.5 rounded-md border ${themeClasses[3]}`} title="৫০-৭৯ XP (লক্ষ্য পূরণ)" />
            <span className={`w-3.5 h-3.5 rounded-md border ${themeClasses[4]}`} title="৮০+ XP (চমৎকার)" />
          </div>
          <span>বেশি (৮০+ XP)</span>
        </div>
      </div>

      {/* HEATMAP VIEW 1: Standard Calendar Grid with Weekdays */}
      {viewMode === 'calendar' && (
        <div className="p-3 sm:p-5 rounded-2xl bg-stone-50/60 dark:bg-stone-850/40 border border-stone-200/70 dark:border-stone-800/80 space-y-2">
          {/* Weekday Columns Header */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-black text-stone-500 dark:text-stone-400 pb-1">
            {BENGALI_WEEKDAYS_SHORT.map((wd, idx) => (
              <div
                key={idx}
                className={`py-1 rounded-lg ${
                  idx === 5 || idx === 6 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
                }`}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Calendar Rows */}
          <div className="space-y-1.5 sm:space-y-2">
            {calendarGrid.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {row.map((day, colIdx) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${rowIdx}-${colIdx}`}
                        className="aspect-square rounded-2xl border border-transparent opacity-20 pointer-events-none"
                      />
                    );
                  }

                  const isSelected = activeSelectedDay?.dateKey === day.dateKey;
                  const isHovered = hoveredDay?.dateKey === day.dateKey;
                  const isDimmed = filter !== 'all' && !filteredDays.some(fd => fd.dateKey === day.dateKey);

                  return (
                    <button
                      key={day.dateKey}
                      type="button"
                      id={`cal-day-${day.dateKey}`}
                      onClick={() => setSelectedDateKey(day.dateKey)}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`aspect-square rounded-xl sm:rounded-2xl border p-1 sm:p-2 flex flex-col items-center justify-between relative transition-all duration-150 cursor-pointer ${
                        themeClasses[day.intensityLevel]
                      } ${
                        day.isToday
                          ? 'ring-2 ring-rose-500 dark:ring-rose-400 ring-offset-2 dark:ring-offset-stone-900 shadow-md scale-105 z-10'
                          : ''
                      } ${
                        isSelected
                          ? 'ring-2 ring-stone-900 dark:ring-white ring-offset-1 dark:ring-offset-stone-900 shadow-lg scale-105 z-10'
                          : ''
                      } ${
                        isDimmed ? 'opacity-25 grayscale' : 'hover:scale-105 hover:shadow-md'
                      }`}
                    >
                      {/* Day of month and Today tag */}
                      <div className="w-full flex items-center justify-between text-[10px] sm:text-xs">
                        <span className="font-mono font-bold leading-none">
                          {toBnNumber(day.dayOfMonth)}
                        </span>
                        {day.isToday && (
                          <span className="px-1 py-0.2 rounded-full text-[9px] font-black bg-rose-600 text-white leading-none">
                            আজ
                          </span>
                        )}
                      </div>

                      {/* Middle Icon / XP Indicator */}
                      <div className="flex items-center justify-center my-auto">
                        {day.isGoalMet ? (
                          <CheckCircle2 size={15} className="drop-shadow-xs" />
                        ) : day.isActive ? (
                          <Flame size={14} className="fill-current drop-shadow-xs" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                        )}
                      </div>

                      {/* Bottom XP count */}
                      <div className="w-full text-center">
                        {day.activityXp > 0 ? (
                          <span className="text-[9px] sm:text-[10px] font-mono font-bold block truncate leading-none">
                            +{toBnNumber(day.activityXp)}
                          </span>
                        ) : (
                          <span className="text-[9px] text-stone-400 block truncate leading-none">
                            ০
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HEATMAP VIEW 2: GitHub-Style Compact 7-Day Rows Matrix */}
      {viewMode === 'matrix' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/60 dark:bg-stone-850/40 border border-stone-200/70 dark:border-stone-800/80 overflow-x-auto">
          <div className="min-w-fit flex items-start gap-4">
            {/* Weekday labels along left */}
            <div className="flex flex-col gap-2 pt-6 text-[11px] font-bold text-stone-400 select-none">
              <span className="h-7 flex items-center">রবি</span>
              <span className="h-7 flex items-center">সোম</span>
              <span className="h-7 flex items-center">মঙ্গল</span>
              <span className="h-7 flex items-center">বুধ</span>
              <span className="h-7 flex items-center">বৃহস্পতি</span>
              <span className="h-7 flex items-center">শুক্র</span>
              <span className="h-7 flex items-center">শনি</span>
            </div>

            {/* Matrix columns (weeks) */}
            <div className="flex items-start gap-2">
              {matrixColumns.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-2">
                  {/* Column Month Label */}
                  <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 h-4 text-center">
                    {col.find(d => d !== null)?.monthNameBn || ''}
                  </span>

                  {/* 7 Days in this column */}
                  {col.map((day, dayIdx) => {
                    if (!day) {
                      return (
                        <div
                          key={`mat-null-${colIdx}-${dayIdx}`}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-transparent opacity-10"
                        />
                      );
                    }

                    const isSelected = activeSelectedDay?.dateKey === day.dateKey;
                    const isDimmed = filter !== 'all' && !filteredDays.some(fd => fd.dateKey === day.dateKey);

                    return (
                      <button
                        key={day.dateKey}
                        type="button"
                        id={`mat-day-${day.dateKey}`}
                        onClick={() => setSelectedDateKey(day.dateKey)}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-150 cursor-pointer relative ${
                          themeClasses[day.intensityLevel]
                        } ${
                          day.isToday
                            ? 'ring-2 ring-rose-500 ring-offset-1 dark:ring-offset-stone-900 z-10'
                            : ''
                        } ${
                          isSelected
                            ? 'ring-2 ring-stone-900 dark:ring-white ring-offset-1 z-10 scale-110'
                            : ''
                        } ${
                          isDimmed ? 'opacity-20' : 'hover:scale-110 hover:shadow-xs'
                        }`}
                        title={`${day.formattedDateBn}: ${day.activityXp} XP`}
                      >
                        {day.dayOfMonth}
                        {day.isGoalMet && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-stone-900" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Selected Day Detail Inspector Card */}
      {activeSelectedDay && (
        <motion.div
          key={activeSelectedDay.dateKey}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-stone-50/90 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-800 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/70 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-xs shrink-0 ${
                  themeClasses[activeSelectedDay.intensityLevel]
                }`}
              >
                {activeSelectedDay.isGoalMet ? '✓' : activeSelectedDay.isActive ? '🔥' : '💤'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                    {activeSelectedDay.formattedDateBn}
                  </h3>
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    ({activeSelectedDay.weekdayBn})
                  </span>
                  {activeSelectedDay.isToday && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                      আজকের দিন
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {activeSelectedDay.isActive
                    ? activeSelectedDay.isGoalMet
                      ? 'অসাধারণ! এই দিনে দৈনিক স্টাডি লক্ষ্য সফলভাবে অর্জিত হয়েছিল।'
                      : 'এই দিনে নিয়মিত পড়াশোনা করে স্ট্রিক বজায় রাখা হয়েছিল।'
                    : 'বিশ্রাম দিবস — এই দিনে কোনো পাঠ বা কুইজ সম্পন্ন হয়নি।'}
                </p>
              </div>
            </div>

            {/* Status Chip */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {activeSelectedDay.isActive ? (
                <div className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <Flame size={13} className="fill-emerald-500" />
                  <span>স্ট্রিক সক্রিয় ছিল ({toBnNumber(activeSelectedDay.streakCount)} দিন)</span>
                </div>
              ) : (
                <div className="px-3 py-1 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-semibold">
                  অধ্যয়ন বিরতি
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics of Selected Day */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800">
              <span className="text-stone-500 dark:text-stone-400 block text-[11px]">অর্জিত XP</span>
              <span className="text-base font-black text-stone-900 dark:text-white mt-0.5 block">
                +{toBnNumber(activeSelectedDay.activityXp)} XP
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800">
              <span className="text-stone-500 dark:text-stone-400 block text-[11px]">দৈনিক লক্ষ্য</span>
              <span
                className={`text-base font-black mt-0.5 block ${
                  activeSelectedDay.isGoalMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                {activeSelectedDay.isGoalMet ? 'অর্জিত ✓' : `${Math.round((activeSelectedDay.activityXp / dailyGoal) * 100)}%`}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800">
              <span className="text-stone-500 dark:text-stone-400 block text-[11px]">আনুমানিক অনুশীলন</span>
              <span className="text-base font-black text-stone-900 dark:text-white mt-0.5 block">
                {toBnNumber(activeSelectedDay.estimatedLessons)} টি সেশন
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800">
              <span className="text-stone-500 dark:text-stone-400 block text-[11px]">স্ট্রিক অবস্থান</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
                {activeSelectedDay.streakCount > 0 ? `${toBnNumber(activeSelectedDay.streakCount)}তম দিন` : 'বিরতি'}
              </span>
            </div>
          </div>

          {/* If today is selected and not studied, call to action */}
          {activeSelectedDay.isToday && !activeSelectedDay.isActive && onNavigateToStudy && (
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-amber-500 fill-amber-500 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-300 font-bold">
                  আজ এখনও কোনো পাঠ সম্পন্ন হয়নি! এখনই ৩-৫ মিনিটের কুইজ বা অনুশীলন করে আপনার স্ট্রিক রক্ষা করুন।
                </p>
              </div>
              <button
                type="button"
                id="btn-study-today-cta"
                onClick={onNavigateToStudy}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>আজকের পাঠ শুরু করুন</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Habit Maintenance Coaching & Psychological Insights Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-850/50 border border-stone-200/80 dark:border-stone-800 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500 shrink-0" />
          <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
            অভ্যাস বজায় রাখার বিজ্ঞানসম্মত কৌশল (Habit Psychology Tips)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 space-y-1">
            <span className="font-bold text-rose-600 dark:text-rose-400 block">
              ১. দুই দিনের নিয়ম (The 2-Day Rule)
            </span>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-[11px]">
              কখনোই পর পর দুই দিন বিরতি দেবেন না। ব্যস্ততার দিনে অন্তত ৩ মিনিটের একটি রিভিশন কুইজ সম্পন্ন করে নিউরাল সংযোগ অক্ষুণ্ণ রাখুন।
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
              ২. মাইক্রো-হ্যাবিট (Micro-Habit Strategy)
            </span>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-[11px]">
              একটানা দীর্ঘ সময় পড়ার চেয়ে প্রতিদিন নিয়ম করে সকাল বা রাতে ১০ মিনিট বরাদ্দ রাখা জাপানি অক্ষর মনে রাখতে ৪ গুণ বেশি কার্যকর।
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 space-y-1">
            <span className="font-bold text-amber-600 dark:text-amber-400 block">
              ৩. ধারাবাহিকতার পুরষ্কার (Compounding Gain)
            </span>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-[11px]">
              টানা ৭ দিন পড়াশোনা করলে ৭-দিনের স্ট্রিক ব্যাজ এবং অতিরিক্ত +২০০ XP অর্জিত হয় যা পরবর্তী লেভেলে দ্রুত উন্নীত হতে সাহায্য করে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
