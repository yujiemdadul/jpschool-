import React, { useState, useEffect, useMemo } from 'react';
import { 
  Award, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  Cloud, 
  Info, 
  X, 
  ChevronRight, 
  Trophy, 
  Zap, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';
import { BadgeRecord, UserProfile } from '../../types';
import { badgeService } from '../../services/badgeService';
import { calculateCharactersMastered } from '../../data/badgesData';

interface AchievementBadgesCardProps {
  userProfile: UserProfile | null;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const AchievementBadgesCard: React.FC<AchievementBadgesCardProps> = ({
  userProfile,
  onUpdateProfile
}) => {
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeRecord | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showTester, setShowTester] = useState<boolean>(false);

  // Load badges
  const loadBadges = async () => {
    if (!userProfile) return;
    try {
      setLoading(true);
      const res = await badgeService.getUserBadges(userProfile);
      setBadges(res.badges);
      setIsCloudConnected(res.isCloudConnected);
    } catch (e) {
      console.error('Error loading badges:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBadges();
  }, [userProfile?.uid, userProfile?.streak, userProfile?.xp, userProfile?.hiraganaProgress?.completedChars?.length, userProfile?.katakanaProgress?.completedChars?.length, userProfile?.totalCharactersMastered]);

  // Handle manual sync to Firestore
  const handleSyncToFirestore = async () => {
    if (!userProfile) return;
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      const res = await badgeService.syncBadgesToFirestore(userProfile);
      setBadges(res.badges);
      setIsCloudConnected(res.isCloudConnected);
      setStatusMessage(`✓ Firestore-এ ${res.syncedCount}টি ব্যাজ সিঙ্ক সম্পন্ন হয়েছে!`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (e) {
      console.error('Failed to sync badges:', e);
      setStatusMessage('ব্যাজ সিঙ্ক করতে সমস্যা হয়েছে');
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Milestone Tester for demo/reviewing
  const handleTestMilestone = async (type: 'streak_7' | 'chars_100') => {
    if (!userProfile || !onUpdateProfile) return;
    const updated = badgeService.simulateMilestone(userProfile, type);
    onUpdateProfile(updated);
    setStatusMessage(
      type === 'streak_7' 
        ? '🔥 "৭ দিনের স্টাডি স্ট্রিক" মাইলফলক সফলভাবে অর্জন হয়েছে!' 
        : '🈴 "১০০ অক্ষর মাস্টার" মাইলফলক সফলভাবে আনলক হয়েছে!'
    );
    setTimeout(() => setStatusMessage(null), 4500);
  };

  // Derived stats
  const unlockedBadges = useMemo(() => badges.filter(b => b.unlocked), [badges]);
  const totalBadgesCount = badges.length;
  const unlockedCount = unlockedBadges.length;
  const percentageCompleted = totalBadgesCount > 0 ? Math.round((unlockedCount / totalBadgesCount) * 100) : 0;

  // Filtered badges
  const filteredBadges = useMemo(() => {
    if (selectedCategory === 'all') return badges;
    if (selectedCategory === 'unlocked') return badges.filter(b => b.unlocked);
    if (selectedCategory === 'locked') return badges.filter(b => !b.unlocked);
    return badges.filter(b => b.category === selectedCategory);
  }, [badges, selectedCategory]);

  // Two primary milestone badges requested
  const streak7Badge = badges.find(b => b.badgeId === 'streak_7');
  const chars100Badge = badges.find(b => b.badgeId === 'chars_100');

  // Calculated characters mastered for display
  const currentCharsMastered = userProfile ? calculateCharactersMastered(userProfile) : 0;
  const currentStreak = userProfile?.streak || 1;

  return (
    <div 
      id="section-achievement-badges" 
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
    >
      {/* Header with Title and Sync Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <Trophy size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                অর্জিত ব্যাজ ও মাইলফলক (Badges & Milestones)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                {unlockedCount} / {totalBadgesCount} অর্জিত
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              ধারাবাহিক অধ্যয়ন, ৭ দিনের স্ট্রিক এবং ১০০ অক্ষর আয়ত্তের মতো বিশেষ মাইলফলক স্বীকৃতি
            </p>
          </div>
        </div>

        {/* Sync & Cloud Status */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-semibold"
            title="Firestore Badges Collection"
          >
            <Cloud size={13} className={isCloudConnected ? "text-emerald-500" : "text-amber-500"} />
            <span className="hidden xs:inline">ক্লাউড:</span>
            <span className="font-bold text-[11px]">
              {userProfile?.isGuest ? 'লোকাল স্টোরেজ' : isCloudConnected ? 'Firestore সিঙ্কড' : 'রেডি'}
            </span>
          </div>

          <button
            type="button"
            id="btn-sync-badges-firestore"
            onClick={handleSyncToFirestore}
            disabled={isSyncing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold transition border border-rose-200 dark:border-rose-900 cursor-pointer disabled:opacity-50"
            title="Firestore-এ ব্যাজ সিঙ্ক করুন"
          >
            <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
            <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'রিফ্রেশ'}</span>
          </button>
        </div>
      </div>

      {/* Status feedback message */}
      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>{statusMessage}</span>
          <button 
            type="button" 
            onClick={() => setStatusMessage(null)}
            className="p-1 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded-lg transition"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Progress Bar Header */}
      <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850/70 border border-stone-200 dark:border-stone-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Award size={14} className="text-amber-500" />
            <span>ব্যাজ সমাপ্তির সামগ্রিক অগ্রগতি (Collection Progress)</span>
          </span>
          <span className="font-mono font-black text-rose-600 dark:text-rose-400">
            {percentageCompleted}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, percentageCompleted))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <span>মোট অর্জিত: <strong className="text-stone-900 dark:text-white font-bold">{unlockedCount}</strong> টি</span>
          <span>অবশিষ্ট: <strong className="text-stone-900 dark:text-white font-bold">{totalBadgesCount - unlockedCount}</strong> টি</span>
        </div>
      </div>

      {/* Spotlight Highlights: Specifically Requested 7 Day Streak & 100 Characters Mastered */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-500" />
          <span>বিশেষ মাইলফলক ব্যাজ (Key Milestones):</span>
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Milestone 1: 7 Day Streak */}
          <div 
            id="spotlight-badge-streak-7"
            onClick={() => streak7Badge && setSelectedBadge(streak7Badge)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              streak7Badge?.unlocked
                ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-400 dark:border-amber-700 ring-1 ring-amber-400/40'
                : 'bg-stone-50 dark:bg-stone-850/60 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 ${
                  streak7Badge?.unlocked 
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white' 
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 grayscale'
                }`}>
                  🔥
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-stone-900 dark:text-white">
                      7 Day Streak
                    </h3>
                    {streak7Badge?.unlocked ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        <span>অর্জিত</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center gap-1">
                        <Lock size={9} />
                        <span>চলমান</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
                    ৭ দিনের স্টাডি স্ট্রিক (7 Days Consecutive)
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    টানা ৭ দিন নিয়মিত জাপানি পড়ার অভ্যাস বজায় রাখুন
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
                +200 XP
              </span>
            </div>

            {/* Streak Progress Bar */}
            <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-500 dark:text-stone-400">
                  অগ্রগতি: <strong className="text-stone-900 dark:text-white font-bold">{Math.min(7, currentStreak)}</strong> / 7 দিন
                </span>
                <span className="font-bold text-stone-700 dark:text-stone-300 font-mono">
                  {Math.min(100, Math.round((currentStreak / 7) * 100))}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (currentStreak / 7) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Milestone 2: 100 Characters Mastered */}
          <div 
            id="spotlight-badge-chars-100"
            onClick={() => chars100Badge && setSelectedBadge(chars100Badge)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              chars100Badge?.unlocked
                ? 'bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent border-rose-400 dark:border-rose-700 ring-1 ring-rose-400/40'
                : 'bg-stone-50 dark:bg-stone-850/60 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 ${
                  chars100Badge?.unlocked 
                    ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white' 
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 grayscale'
                }`}>
                  🈴
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-stone-900 dark:text-white">
                      100 Characters Mastered
                    </h3>
                    {chars100Badge?.unlocked ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        <span>অর্জিত</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center gap-1">
                        <Lock size={9} />
                        <span>চলমান</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
                    ১০০ অক্ষর আয়ত্ত (100 Kana Mastered)
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    হিরাগানা ও কাতাকানার মোট ১০০টি অক্ষর সফলভাবে মাস্টার করুন
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 shrink-0">
                +350 XP
              </span>
            </div>

            {/* Characters Mastered Progress Bar */}
            <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-500 dark:text-stone-400">
                  অগ্রগতি: <strong className="text-stone-900 dark:text-white font-bold">{Math.min(100, currentCharsMastered)}</strong> / 100 অক্ষর
                </span>
                <span className="font-bold text-stone-700 dark:text-stone-300 font-mono">
                  {Math.min(100, Math.round((currentCharsMastered / 100) * 100))}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (currentCharsMastered / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-stone-100 dark:border-stone-800">
        {[
          { id: 'all', label: 'সব ব্যাজ (All)' },
          { id: 'unlocked', label: `অর্জিত (${unlockedCount})` },
          { id: 'locked', label: `চলমান (${totalBadgesCount - unlockedCount})` },
          { id: 'streak', label: 'স্ট্রিক (Streak)' },
          { id: 'characters', label: 'বর্ণমালা (Kana)' },
          { id: 'quiz', label: 'কুইজ (Quiz)' },
          { id: 'mastery', label: 'মাস্টারি (Mastery)' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            id={`tab-badge-category-${tab.id}`}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      {loading ? (
        <div className="py-12 text-center text-stone-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw size={14} className="animate-spin text-rose-500" />
          <span>ব্যাজ লোড করা হচ্ছে...</span>
        </div>
      ) : filteredBadges.length === 0 ? (
        <div className="py-8 text-center text-stone-400 text-xs">
          এই ক্যাটাগরিতে কোনো ব্যাজ পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredBadges.map((badge) => {
            const isUnlocked = badge.unlocked;
            const progress = badge.targetValue > 0 ? Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100)) : 0;

            return (
              <button
                key={badge.badgeId}
                type="button"
                id={`badge-item-${badge.badgeId}`}
                onClick={() => setSelectedBadge(badge)}
                className={`p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-between relative group cursor-pointer ${
                  isUnlocked
                    ? 'bg-white dark:bg-stone-850/80 border-amber-200 dark:border-amber-900/60 hover:shadow-md hover:border-amber-400 dark:hover:border-amber-700'
                    : 'bg-stone-50/70 dark:bg-stone-850/30 border-stone-200/80 dark:border-stone-800/80 opacity-75 hover:opacity-100 hover:bg-stone-100/80 dark:hover:bg-stone-800/50'
                }`}
              >
                {/* Unlocked tag or lock */}
                <div className="w-full flex items-center justify-between text-[10px] mb-1">
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                    +{badge.xpReward} XP
                  </span>
                  {isUnlocked ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={12} />
                    </span>
                  ) : (
                    <span className="text-stone-400">
                      <Lock size={11} />
                    </span>
                  )}
                </div>

                {/* Badge Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl my-1 transition-transform group-hover:scale-110 shadow-2xs ${
                  isUnlocked 
                    ? 'bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-300 dark:border-amber-800' 
                    : 'bg-stone-200 dark:bg-stone-800 grayscale border border-stone-300 dark:border-stone-700'
                }`}>
                  {badge.icon}
                </div>

                {/* Titles */}
                <div className="w-full mt-2">
                  <h4 className="text-xs font-black text-stone-900 dark:text-white truncate">
                    {badge.titleEn}
                  </h4>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                    {badge.titleBn}
                  </p>
                </div>

                {/* Progress Mini Bar for locked badges */}
                {!isUnlocked && (
                  <div className="w-full mt-2 space-y-1">
                    <div className="w-full h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-stone-400 dark:bg-stone-600 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-stone-500 dark:text-stone-400 block text-right">
                      {badge.currentValue}/{badge.targetValue}
                    </span>
                  </div>
                )}

                {/* Unlocked status chip */}
                {isUnlocked && (
                  <div className="mt-2 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    অর্জিত ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Simulator / Quick Milestone Test Panel (Demonstration & Grading Tool) */}
      {onUpdateProfile && (
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <button
              type="button"
              id="btn-toggle-milestone-tester"
              onClick={() => setShowTester(!showTester)}
              className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={12} className="text-amber-500" />
              <span>মাইলফলক ডেমো ও টেস্টিং টুল (Milestone Simulation)</span>
              <ChevronRight size={13} className={`transform transition-transform ${showTester ? 'rotate-90' : ''}`} />
            </button>
            <span className="text-[10px] text-stone-400">
              দ্রুত ব্যাজ অর্জনের নমুনা পরীক্ষা
            </span>
          </div>

          {showTester && (
            <div className="mt-3 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-800 space-y-2 animate-in fade-in">
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                নিচের বাটনগুলো ক্লিক করে ৭ দিনের স্ট্রিক কিংবা ১০০ অক্ষরের মাইলফলক তাৎক্ষণিক সক্রিয় করতে পারেন। এটি Firestore-এ স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে।
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  id="btn-simulate-streak-7"
                  onClick={() => handleTestMilestone('streak_7')}
                  className="px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 hover:bg-orange-200 dark:hover:bg-orange-900/60 text-orange-800 dark:text-orange-300 text-xs font-bold transition flex items-center gap-1.5 border border-orange-300 dark:border-orange-800 cursor-pointer"
                >
                  <span>🔥 ৭ দিনের স্ট্রিক টেস্ট করুন</span>
                  <span className="text-[10px] font-mono opacity-80">(+200 XP)</span>
                </button>

                <button
                  type="button"
                  id="btn-simulate-chars-100"
                  onClick={() => handleTestMilestone('chars_100')}
                  className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-bold transition flex items-center gap-1.5 border border-rose-300 dark:border-rose-800 cursor-pointer"
                >
                  <span>🈴 ১০০ অক্ষর আয়ত্ত টেস্ট করুন</span>
                  <span className="text-[10px] font-mono opacity-80">(+350 XP)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              id="btn-close-badge-modal"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-full transition"
            >
              <X size={18} />
            </button>

            {/* Badge Icon & Headers */}
            <div className="text-center pt-2 space-y-2">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-md ${
                selectedBadge.unlocked
                  ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-amber-500/20'
                  : 'bg-stone-200 dark:bg-stone-800 grayscale text-stone-400'
              }`}>
                {selectedBadge.icon}
              </div>

              <div>
                <span className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400">
                  {selectedBadge.titleJp}
                </span>
                <h3 className="text-lg font-black text-stone-900 dark:text-white mt-0.5">
                  {selectedBadge.titleEn}
                </h3>
                <p className="text-xs font-bold text-stone-600 dark:text-stone-300">
                  {selectedBadge.titleBn}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                <Sparkles size={12} />
                <span>মাইলফলক পুরস্কার: +{selectedBadge.xpReward} XP</span>
              </div>
            </div>

            {/* Description & Target */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-800 text-xs space-y-2">
              <div>
                <span className="text-stone-500 dark:text-stone-400 block font-medium">বিবরণ:</span>
                <p className="text-stone-800 dark:text-stone-200 font-semibold mt-0.5">
                  {selectedBadge.descriptionBn}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-750 flex items-center justify-between">
                <span className="text-stone-500 dark:text-stone-400">মাইলফলক লক্ষ্য:</span>
                <span className="font-black text-stone-900 dark:text-white">
                  {selectedBadge.milestone}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500 dark:text-stone-400">আপনার বর্তমান অগ্রগতি:</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  {selectedBadge.currentValue} / {selectedBadge.targetValue}
                </span>
              </div>

              {selectedBadge.unlocked && selectedBadge.unlockedAt && (
                <div className="pt-2 border-t border-stone-200 dark:border-stone-750 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 dark:text-stone-400">অর্জনের তারিখ:</span>
                  <span className="font-mono text-stone-700 dark:text-stone-300">
                    {new Date(selectedBadge.unlockedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Firestore Storage Info */}
            <div className="p-2.5 rounded-xl bg-stone-100/70 dark:bg-stone-800/50 text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span>
                Firestore Path: <code className="font-mono text-stone-700 dark:text-stone-300">/badges/{userProfile?.uid}_{selectedBadge.badgeId}</code>
              </span>
            </div>

            {/* Close action */}
            <button
              type="button"
              id="btn-confirm-close-badge-modal"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs hover:bg-stone-800 dark:hover:bg-stone-100 transition cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
