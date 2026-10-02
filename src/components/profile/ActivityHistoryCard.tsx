import React, { useState, useEffect, useMemo } from 'react';
import { 
  History, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Trophy, 
  RotateCcw, 
  BookOpen, 
  Sparkles, 
  Target, 
  ChevronRight, 
  Calendar,
  Flame,
  Award,
  Play,
  ArrowRight,
  Filter
} from 'lucide-react';
import { UserProfile, QuizResultRecord, CompletedLessonRecord, QuizCourseType } from '../../types';
import { 
  activityService, 
  toBnNum, 
  formatRelativeTimeBn, 
  getCourseTitleBn,
  getTodayDateStr
} from '../../services/activityService';
import { playKitsuneChime } from '../../utils/speech';

interface ActivityHistoryCardProps {
  userProfile: UserProfile | null;
  onProfileUpdated?: (updated: UserProfile) => void;
}

type TabType = 'today' | 'quizzes' | 'lessons';
type FilterCourse = 'all' | 'hiragana' | 'katakana' | 'kanji' | 'daily_challenge';

export const ActivityHistoryCard: React.FC<ActivityHistoryCardProps> = ({
  userProfile
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [filterCourse, setFilterCourse] = useState<FilterCourse>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizResultRecord[]>([]);
  const [todayLessons, setTodayLessons] = useState<CompletedLessonRecord[]>([]);
  const [allLessons, setAllLessons] = useState<CompletedLessonRecord[]>([]);

  // Load and refresh activity data
  const loadData = () => {
    if (!userProfile) return;
    const quizzes = activityService.getRecentQuizzes(userProfile, 30);
    const todayL = activityService.getTodayCompletedLessons(userProfile);
    const allL = activityService.getAllCompletedLessons(userProfile);

    setRecentQuizzes(quizzes);
    setTodayLessons(todayL);
    setAllLessons(allL);
  };

  useEffect(() => {
    loadData();
  }, [
    userProfile?.uid,
    userProfile?.xp,
    userProfile?.quizStats?.totalQuizzes,
    userProfile?.lastDailyQuizDate,
    userProfile?.hiraganaProgress?.completedLevels?.length,
    userProfile?.katakanaProgress?.completedLevels?.length,
    userProfile?.lastStudyDate
  ]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    playKitsuneChime();
    loadData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const todaySummary = useMemo(() => {
    return activityService.getTodaySummary(userProfile);
  }, [userProfile, recentQuizzes, todayLessons]);

  const todayDateKey = getTodayDateStr();

  // Filtered today's quizzes
  const todayQuizzes = useMemo(() => {
    return recentQuizzes.filter(q => {
      const isDateMatch = q.dateKey === todayDateKey || (Date.now() - (q.timestamp || 0)) < 24 * 3600000;
      return isDateMatch;
    });
  }, [recentQuizzes, todayDateKey]);

  // Combined timeline of today's events (lessons and quizzes)
  const todayTimeline = useMemo(() => {
    const list: Array<{
      id: string;
      kind: 'quiz' | 'lesson';
      timestamp: number;
      quizData?: QuizResultRecord;
      lessonData?: CompletedLessonRecord;
    }> = [];

    todayQuizzes.forEach(q => {
      list.push({
        id: q.id || `quiz_${q.timestamp}`,
        kind: 'quiz',
        timestamp: q.timestamp || Date.now(),
        quizData: q
      });
    });

    todayLessons.forEach(l => {
      list.push({
        id: l.id || `lesson_${l.completedAt}`,
        kind: 'lesson',
        timestamp: l.completedAt || Date.now(),
        lessonData: l
      });
    });

    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [todayQuizzes, todayLessons]);

  // Filtered recent quizzes
  const filteredQuizzes = useMemo(() => {
    if (filterCourse === 'all') return recentQuizzes;
    return recentQuizzes.filter(q => q.course === filterCourse);
  }, [recentQuizzes, filterCourse]);

  // Filtered completed lessons
  const filteredLessons = useMemo(() => {
    if (filterCourse === 'all') return allLessons;
    return allLessons.filter(l => l.course === filterCourse);
  }, [allLessons, filterCourse]);

  const handleNavigate = (tab: string) => {
    window.dispatchEvent(new CustomEvent('chandu_navigate_tab', { detail: tab }));
  };

  const renderPerformanceBadge = (scorePercentage: number) => {
    if (scorePercentage === 100) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <Sparkles size={11} className="text-emerald-600 dark:text-emerald-400" />
          <span>পারফেক্ট ১০০%</span>
        </span>
      );
    }
    if (scorePercentage >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
          <span>চমৎকার ({toBnNum(scorePercentage)}%)</span>
        </span>
      );
    }
    if (scorePercentage >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <span>ভালো অগ্রগতি ({toBnNum(scorePercentage)}%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
        <span>চর্চা প্রয়োজন ({toBnNum(scorePercentage)}%)</span>
      </span>
    );
  };

  return (
    <div id="section-activity-history" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 shadow-2xs shrink-0">
            <History size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                দৈনিক অ্যাক্টিভিটি ও স্টাডি হিস্ট্রি
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                Activity History
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              আজকের সম্পন্ন লেসন এবং সাম্প্রতিক কুইজ পারফরম্যান্সের বিস্তারিত তালিকা
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
          title="হিস্ট্রি রিফ্রেশ করুন"
        >
          <RotateCcw size={13} className={isRefreshing ? 'animate-spin text-rose-600' : ''} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* 4 Summary Highlight Cards for Today */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Today's Quizzes */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-stone-900 dark:to-stone-900 border border-amber-200/80 dark:border-amber-900/60">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
            <span className="text-[11px] font-bold">আজকের কুইজ</span>
            <Target size={15} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              {toBnNum(todaySummary.quizzesCount)}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-bold">টি সম্পন্ন</span>
          </div>
        </div>

        {/* Today's Lessons */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-950/40 dark:via-stone-900 dark:to-stone-900 border border-rose-200/80 dark:border-rose-900/60">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-1">
            <span className="text-[11px] font-bold">আজকের সম্পন্ন লেসন</span>
            <BookOpen size={15} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              {toBnNum(todaySummary.lessonsCount)}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-bold">টি পাঠ</span>
          </div>
        </div>

        {/* Today's Earned XP */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-stone-900 dark:to-stone-900 border border-emerald-200/80 dark:border-emerald-900/60">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="text-[11px] font-bold">আজকের মোট XP</span>
            <Zap size={15} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              +{toBnNum(todaySummary.xpEarned)}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">XP</span>
          </div>
        </div>

        {/* Today's Accuracy */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-950/40 dark:via-stone-900 dark:to-stone-900 border border-blue-200/80 dark:border-blue-900/60">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-1">
            <span className="text-[11px] font-bold">গড় নির্ভুলতা</span>
            <Award size={15} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              {toBnNum(todaySummary.accuracy)}%
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-bold">সঠিক</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'today'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-black'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>আজকের কার্যক্রম</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'today' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
            }`}>
              {toBnNum(todayTimeline.length)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quizzes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quizzes'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-black'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>কুইজ পারফরম্যান্স</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'quizzes' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
            }`}>
              {toBnNum(recentQuizzes.length)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lessons')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lessons'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-black'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>সম্পন্ন লেসন</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'lessons' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
            }`}>
              {toBnNum(allLessons.length)}
            </span>
          </button>
        </div>

        {/* Filter Pills for Course Types */}
        {(activeTab === 'quizzes' || activeTab === 'lessons') && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-stone-400 mr-1 flex items-center gap-1">
              <Filter size={12} />
              <span>ফিল্টার:</span>
            </span>
            {[
              { id: 'all', label: 'সবগুলো' },
              { id: 'hiragana', label: 'হিরাগানা' },
              { id: 'katakana', label: 'কাতাকানা' },
              ...(activeTab === 'quizzes' ? [{ id: 'daily_challenge', label: 'ডেইলি কুইজ' }] : []),
              { id: 'kanji', label: 'কাঞ্জি' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterCourse(f.id as FilterCourse)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  filterCourse === f.id
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: TODAY'S ACTIVITY TIMELINE */}
      {activeTab === 'today' && (
        <div className="space-y-3.5">
          {todayTimeline.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-stone-50 dark:bg-stone-850/60 border border-dashed border-stone-200 dark:border-stone-800 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center text-2xl shadow-xs">
                🦊
              </div>
              <h4 className="text-base font-black text-stone-900 dark:text-white">
                আজকের কোনো স্টাডি অ্যাক্টিভিটি পাওয়া যায়নি
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                আজকে এখনো কোনো কুইজ বা লেসন শেষ করা হয়নি। ধারাবাহিক স্ট্রিক বজায় রাখতে ও XP অর্জন করতে এখনই শুরু করুন!
              </p>
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('quiz')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Play size={13} />
                  <span>কুইজ শুরু করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('hiragana')}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen size={13} />
                  <span>লেসন পড়ুন</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1 font-bold">
                <span>আজকের টাইমলাইন ({toBnNum(todayTimeline.length)} টি ইভেন্ট)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>লাইভ ট্র্যাকিং</span>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {todayTimeline.map(item => {
                  if (item.kind === 'quiz' && item.quizData) {
                    const q = item.quizData;
                    const meta = getCourseTitleBn(q.course, q.level);
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 hover:border-amber-300 dark:hover:border-amber-800/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                            {meta.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-stone-900 dark:text-white">
                                {q.titleBn || meta.title}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                                কুইজ
                              </span>
                              {renderPerformanceBadge(q.scorePercentage)}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1 flex-wrap">
                              <span className="font-semibold text-stone-700 dark:text-stone-300">
                                স্কোর: <strong className="text-stone-900 dark:text-white">{toBnNum(q.correctAnswers)} / {toBnNum(q.totalQuestions)}</strong>
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                <Zap size={12} />
                                <span>+{toBnNum(q.xpEarned)} XP</span>
                              </span>
                              {q.timeSpentSeconds && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>{toBnNum(q.timeSpentSeconds)} সেক</span>
                                  </span>
                                </>
                              )}
                              <span>•</span>
                              <span className="text-stone-400">{formatRelativeTimeBn(q.timestamp)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleNavigate('quiz')}
                            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                          >
                            <span>আবার দিন</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (item.kind === 'lesson' && item.lessonData) {
                    const l = item.lessonData;
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 hover:border-rose-300 dark:hover:border-rose-800/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs font-serif">
                            {l.course === 'hiragana' ? 'あ' : l.course === 'katakana' ? 'ア' : '漢'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-stone-900 dark:text-white">
                                {l.titleBn}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                                সম্পন্ন লেসন
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                                ✓ আজ সম্পন্ন
                              </span>
                            </div>

                            {/* Japanese Characters Display */}
                            {l.characters && l.characters.length > 0 && (
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">অক্ষরসমূহ:</span>
                                {l.characters.slice(0, 6).map((char, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-black text-rose-600 dark:text-rose-400 font-serif shadow-2xs"
                                  >
                                    {char}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1 flex-wrap">
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                <Zap size={12} />
                                <span>+{toBnNum(l.xpEarned)} XP</span>
                              </span>
                              <span>•</span>
                              <span className="text-stone-400">{formatRelativeTimeBn(l.completedAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleNavigate(l.course === 'katakana' ? 'katakana' : l.course === 'kanji' ? 'kanji' : 'hiragana')}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                          >
                            <span>রিভিউ করুন</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECENT QUIZZES PERFORMANCE */}
      {activeTab === 'quizzes' && (
        <div className="space-y-3">
          {filteredQuizzes.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-stone-50 dark:bg-stone-850/60 border border-dashed border-stone-200 dark:border-stone-800 space-y-2">
              <span className="text-3xl block">🎯</span>
              <h4 className="text-sm font-black text-stone-900 dark:text-white">কোনো কুইজ রেকর্ড পাওয়া যায়নি</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                এই ক্যাটাগরিতে এখনো কোনো কুইজ সম্পন্ন করেননি। এখনই কুইজে অংশ নিন!
              </p>
              <button
                type="button"
                onClick={() => handleNavigate('quiz')}
                className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Play size={13} />
                <span>কুইজ শুরু করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredQuizzes.map(q => {
                const meta = getCourseTitleBn(q.course, q.level);
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 hover:border-stone-300 dark:hover:border-stone-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center font-black text-base shrink-0 shadow-2xs ${meta.badgeColor}`}>
                        {meta.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-stone-900 dark:text-white">
                            {q.titleBn || meta.title}
                          </h4>
                          {renderPerformanceBadge(q.scorePercentage)}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          {meta.subtitle}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-2 flex-wrap">
                          <span className="font-bold text-stone-800 dark:text-stone-200 bg-stone-200/70 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                            স্কোর: {toBnNum(q.correctAnswers)} / {toBnNum(q.totalQuestions)}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Zap size={13} />
                            <span>+{toBnNum(q.xpEarned)} XP</span>
                          </span>
                          {q.timeSpentSeconds && (
                            <span className="flex items-center gap-1">
                              <Clock size={13} />
                              <span>{toBnNum(q.timeSpentSeconds)} সেকেন্ড</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-stone-400">
                            <Calendar size={13} />
                            <span>{formatRelativeTimeBn(q.timestamp)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleNavigate('quiz')}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <RotateCcw size={12} />
                        <span>পুনরায় কুইজ দিন</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALL COMPLETED LESSONS */}
      {activeTab === 'lessons' && (
        <div className="space-y-3">
          {filteredLessons.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-stone-50 dark:bg-stone-850/60 border border-dashed border-stone-200 dark:border-stone-800 space-y-2">
              <span className="text-3xl block">📖</span>
              <h4 className="text-sm font-black text-stone-900 dark:text-white">কোনো সম্পন্ন লেসন পাওয়া যায়নি</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                কোর্স থেকে লেসন সম্পন্ন করলে আপনার পূর্ণাঙ্গ তালিকা এখানে প্রদর্শিত হবে।
              </p>
              <button
                type="button"
                onClick={() => handleNavigate('hiragana')}
                className="mt-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <BookOpen size={13} />
                <span>লেসন পড়া শুরু করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredLessons.map(l => (
                <div
                  key={l.id}
                  className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 hover:border-stone-300 dark:hover:border-stone-700 transition flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        l.course === 'hiragana' 
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                          : l.course === 'katakana'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {l.course === 'hiragana' ? 'হিরাগানা' : l.course === 'katakana' ? 'কাতাকানা' : 'কাঞ্জি'} • লেভেল {toBnNum(l.level || 1)}
                      </span>

                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>সম্পন্ন</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-stone-900 dark:text-white">
                      {l.titleBn}
                    </h4>

                    {/* Character chips */}
                    {l.characters && l.characters.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {l.characters.map((char, cIdx) => (
                          <span
                            key={cIdx}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-xs font-black text-rose-600 dark:text-rose-400 font-serif shadow-2xs"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Zap size={13} />
                      <span>+{toBnNum(l.xpEarned)} XP</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleNavigate(l.course === 'katakana' ? 'katakana' : l.course === 'kanji' ? 'kanji' : 'hiragana')}
                      className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>রিভিউ</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Callout to Study/Quiz */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-amber-500 shrink-0" />
          <span>প্রতিদিনের নিয়মিত ৫ মিনিটের কুইজ ও লেসন সম্পন্ন করে স্ট্রিক ধরে রাখুন।</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleNavigate('quiz')}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>স্পিড কুইজ পেজ</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

    </div>
  );
};
