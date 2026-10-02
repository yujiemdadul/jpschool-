import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Medal, 
  Crown, 
  Search, 
  RotateCw, 
  ShieldCheck, 
  User as UserIcon, 
  Sparkles, 
  BookOpen, 
  Layers,
  ArrowUpRight,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { LeaderboardEntry } from '../../types';

interface LeaderboardViewProps {
  onOpenAuthModal?: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onOpenAuthModal }) => {
  const { userProfile } = useAuth();
  const [sortBy, setSortBy] = useState<'xp' | 'streak'>('xp');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await userService.getLeaderboard(sortBy, userProfile);
      setLeaderboardData(data);
    } catch (err) {
      console.error('Failed to load leaderboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy, userProfile?.xp, userProfile?.streak, userProfile?.displayName]);

  // Filtered by search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return leaderboardData;
    const query = searchQuery.toLowerCase().trim();
    return leaderboardData.filter(user => 
      user.displayName.toLowerCase().includes(query) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  }, [leaderboardData, searchQuery]);

  // Find current user's rank
  const myRankIndex = useMemo(() => {
    if (!userProfile) return -1;
    return leaderboardData.findIndex(u => 
      u.uid === userProfile.uid || 
      (Boolean(userProfile.email) && Boolean(u.email) && u.email.toLowerCase() === userProfile.email.toLowerCase())
    );
  }, [leaderboardData, userProfile]);

  const myRank = myRankIndex >= 0 ? myRankIndex + 1 : null;

  // Top 3 Podium
  const top1 = filteredUsers[0];
  const top2 = filteredUsers[1];
  const top3 = filteredUsers[2];
  const remainingUsers = filteredUsers.slice(3);

  const isGuestOrAnonymous = !userProfile || userProfile.isGuest || !userProfile.displayName || userProfile.displayName === 'গেস্ট শিক্ষার্থী';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Trophy size={14} className="text-rose-600 dark:text-rose-400" />
              <span>Global Hall of Fame</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>শিক্ষার্থী লিডারবোর্ড</span>
              <span className="text-sm sm:text-base font-bold px-2.5 py-0.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                আসল নাম ও র‍্যাঙ্ক
              </span>
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              নিয়মিত জাপানি হিরাগানা ও কাতাকানা অনুশীলনকারী শিক্ষার্থীদের বাস্তব তালিকা। প্রতিদিন প্র্যাকটিস করুন ও পয়েন্ট বাড়িয়ে শীর্ষে উঠুন!
            </p>
          </div>

          {/* Sort Switcher Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <div className="inline-flex p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60">
              <button
                type="button"
                id="btn-sort-xp"
                onClick={() => setSortBy('xp')}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sortBy === 'xp'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Zap size={15} className="fill-amber-500 text-amber-500" />
                <span>সর্বোচ্চ XP</span>
              </button>

              <button
                type="button"
                id="btn-sort-streak"
                onClick={() => setSortBy('streak')}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sortBy === 'streak'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Flame size={15} className="fill-orange-500 text-orange-500" />
                <span>দৈনিক স্ট্রিক</span>
              </button>
            </div>

            <button
              type="button"
              onClick={fetchLeaderboard}
              disabled={loading}
              title="লিডারবোর্ড রিফ্রেশ করুন"
              className="p-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-750 transition disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              <RotateCw size={18} className={loading ? 'animate-spin text-rose-600' : ''} />
            </button>
          </div>
        </div>

        {/* Real Names Guarantee Badge */}
        <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span>স্বচ্ছতা ও সত্যতা: এখানে কেবল নিবন্ধিত শিক্ষার্থীদের প্রকৃত নাম ও অর্জিত প্রগ্রেস দেখানো হয়।</span>
          </div>
          <div className="text-stone-400 text-[11px]">
            মোট সক্রিয় শিক্ষার্থী: {leaderboardData.length} জন
          </div>
        </div>
      </div>

      {/* Current User Status Banner (If Guest or Logged-in) */}
      {isGuestOrAnonymous ? (
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/20 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
              ?
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                আপনি এখনো গেস্ট মোডে আছেন
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-0.5">
                লগইন করে আপনার আসল নামে লিডারবোর্ডে নিজের নাম যুক্ত করুন ও বন্ধুদের সাথে প্রতিযোগিতা করুন!
              </p>
            </div>
          </div>
          {onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <LogIn size={15} />
              <span>আসল নামে যুক্ত হোন</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-stone-900 dark:bg-stone-800 text-white border border-stone-800 dark:border-stone-700 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm border border-amber-300/30">
              {myRank ? `#${myRank}` : '⭐'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-rose-400">আপনার বর্তমান অবস্থান</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                  {myRank ? `র‍্যাঙ্ক #${myRank}` : 'নিবন্ধিত শিক্ষার্থী'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
                {userProfile?.displayName}
                <CheckCircle2 size={16} className="text-emerald-400 inline" />
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-around sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-800">
            <div className="text-center sm:text-right">
              <span className="text-[11px] text-stone-400 block font-medium">অর্জিত মোট XP</span>
              <span className="text-base font-black text-amber-400 flex items-center gap-1 sm:justify-end">
                <Zap size={14} className="fill-amber-400 text-amber-400" />
                {userProfile?.xp || 0} XP
              </span>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div className="text-center sm:text-right">
              <span className="text-[11px] text-stone-400 block font-medium">ধারাবাহিক স্ট্রিক</span>
              <span className="text-base font-black text-orange-400 flex items-center gap-1 sm:justify-end">
                <Flame size={14} className="fill-orange-400 text-orange-400" />
                {userProfile?.streak || 1} দিন
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Input Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="শিক্ষার্থীর আসল নাম দিয়ে খুঁজুন..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            ক্লিয়ার
          </button>
        )}
      </div>

      {/* Top Podium (Visible when not searching and at least 1 real student exists) */}
      {!searchQuery && leaderboardData.length > 0 && (
        <div className={`grid gap-4 sm:gap-6 pt-6 items-end ${
          leaderboardData.length === 1 
            ? 'grid-cols-1 max-w-sm mx-auto' 
            : leaderboardData.length === 2 
            ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' 
            : 'grid-cols-1 md:grid-cols-3'
        }`}>
          
          {/* 2nd Place (Left) */}
          {top2 && (
            <div className="order-2 md:order-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 text-center relative shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-2 border-white dark:border-stone-900 flex items-center justify-center font-black text-sm shadow-xs">
                ২
              </div>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 font-extrabold text-2xl flex items-center justify-center shadow-inner mt-2 mb-3">
                {top2.displayName.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-white truncate" title={top2.displayName}>
                {top2.displayName}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">২য় স্থান (Silver)</p>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-center gap-4 text-xs">
                <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap size={14} className="fill-amber-500 text-amber-500" />
                  {top2.xp} XP
                </span>
                <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <Flame size={14} className="fill-orange-500 text-orange-500" />
                  {top2.streak} দিন
                </span>
              </div>
            </div>
          )}

          {/* 1st Place (Center - Prominent) */}
          {top1 && (
            <div className={`order-1 ${leaderboardData.length >= 3 ? 'md:order-2' : ''} bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/40 dark:via-stone-900 dark:to-stone-900 border-2 border-amber-400 dark:border-amber-600 rounded-3xl p-6 sm:p-7 text-center relative shadow-lg transform ${leaderboardData.length >= 3 ? 'md:-translate-y-2' : ''}`}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <Crown size={28} className="fill-amber-400 text-amber-500 animate-bounce" />
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 border-2 border-white dark:border-stone-900 flex items-center justify-center font-black text-base shadow-md">
                  ১
                </div>
              </div>

              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black text-3xl flex items-center justify-center shadow-lg mt-4 mb-3 border-2 border-amber-200 dark:border-amber-400/40">
                {top1.displayName.charAt(0).toUpperCase()}
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold mb-1">
                <Sparkles size={12} />
                <span>শীর্ষ চ্যাম্পিয়ন</span>
              </div>

              <h3 className="text-lg font-black text-stone-900 dark:text-white truncate" title={top1.displayName}>
                {top1.displayName}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">১ম স্থান (Gold Champion)</p>

              <div className="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center gap-5 text-sm">
                <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap size={16} className="fill-amber-500 text-amber-500" />
                  {top1.xp} XP
                </span>
                <span className="font-extrabold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <Flame size={16} className="fill-orange-500 text-orange-500" />
                  {top1.streak} দিন স্ট্রিক
                </span>
              </div>
            </div>
          )}

          {/* 3rd Place (Right) */}
          {top3 && (
            <div className="order-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 text-center relative shadow-xs hover:border-amber-700/40 transition">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700/20 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-2 border-white dark:border-stone-900 flex items-center justify-center font-black text-sm shadow-xs">
                ৩
              </div>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 font-extrabold text-2xl flex items-center justify-center shadow-inner mt-2 mb-3">
                {top3.displayName.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-white truncate" title={top3.displayName}>
                {top3.displayName}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">৩য় স্থান (Bronze)</p>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-center gap-4 text-xs">
                <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap size={14} className="fill-amber-500 text-amber-500" />
                  {top3.xp} XP
                </span>
                <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <Flame size={14} className="fill-orange-500 text-orange-500" />
                  {top3.streak} দিন
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Full Leaderboard Ranking List */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Medal size={18} className="text-rose-600 dark:text-rose-400" />
            <span>সকল শিক্ষার্থীর র‍্যাংকিং তালিকা</span>
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            {filteredUsers.length} জন প্রদর্শিত
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RotateCw size={28} className="animate-spin mx-auto text-rose-600" />
            <p className="text-xs font-bold text-stone-500 dark:text-stone-400">
              বাস্তব শিক্ষার্থী তালিকা লোড হচ্ছে...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <UserIcon size={36} className="mx-auto text-stone-300 dark:text-stone-700" />
            <p className="text-base font-bold text-stone-800 dark:text-stone-200">
              {searchQuery ? 'কোনো শিক্ষার্থী পাওয়া যায়নি' : 'এখনো কোনো শিক্ষার্থী অ্যাকাউন্ট নেই'}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              {searchQuery 
                ? 'নামটি আবার সঠিক করে লিখে সার্চ করুন।' 
                : 'আপনার আসল অ্যাকাউন্টে লগইন করে জাপানি বর্ণ প্র্যাকটিস ও কুইজ খেলে সবার প্রথমে লিডারবোর্ডে ১ নম্বর স্থান অর্জন করুন!'}
            </p>
            {!searchQuery && onOpenAuthModal && isGuestOrAnonymous && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <LogIn size={14} />
                  <span>এখনই একাউন্ট তৈরি বা লগইন করুন</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredUsers.map((learner, idx) => {
              const rankNum = idx + 1;
              const isMe = userProfile?.uid === learner.uid;

              return (
                <div
                  key={learner.uid || idx}
                  className={`p-4 sm:px-6 flex items-center justify-between gap-4 transition-colors ${
                    isMe
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-l-4 border-l-rose-600 font-semibold'
                      : 'hover:bg-stone-50/60 dark:hover:bg-stone-800/40'
                  }`}
                >
                  {/* Left: Rank & Avatar & Real Name */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs sm:text-sm">
                      {rankNum === 1 ? (
                        <span className="w-full h-full rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-xs">
                          ১
                        </span>
                      ) : rankNum === 2 ? (
                        <span className="w-full h-full rounded-xl bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center font-bold">
                          ২
                        </span>
                      ) : rankNum === 3 ? (
                        <span className="w-full h-full rounded-xl bg-amber-700/30 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold">
                          ৩
                        </span>
                      ) : (
                        <span className="text-stone-400 font-bold">
                          #{rankNum}
                        </span>
                      )}
                    </div>

                    {/* Avatar Initial */}
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
                      {learner.displayName.charAt(0).toUpperCase()}
                    </div>

                    {/* Real Name & Sub-details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-white truncate">
                          {learner.displayName}
                        </span>
                        {isMe && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                            আপনি
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        <span>{learner.totalCompletedChars || 0}টি বর্ণ সমাপ্ত</span>
                        <span>•</span>
                        <span>{learner.hiraganaLevelsCount + learner.katakanaLevelsCount}টি লেভেল ক্লিয়ার</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: XP & Streak Badges */}
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/70 dark:border-orange-900/60">
                      <Flame size={14} className="fill-orange-500 text-orange-500 shrink-0" />
                      <span className="text-xs font-bold text-orange-900 dark:text-orange-200">
                        {learner.streak} দিন
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60 min-w-[80px] justify-center">
                      <Zap size={14} className="fill-amber-500 text-amber-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200">
                        {learner.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
