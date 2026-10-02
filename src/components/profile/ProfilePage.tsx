import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Check, 
  Moon, 
  Sun, 
  LogOut, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Trophy,
  RotateCcw,
  Code2,
  ExternalLink,
  Languages,
  Sparkles,
  Volume2,
  VolumeX,
  Volume1,
  Music,
  Play,
  Target,
  Clock,
  Sliders,
  CheckCircle2,
  Smartphone,
  Download,
  Type,
  Share2,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { playJapaneseAudio, playKitsuneChime, playSuccessSound, isSpeechSupported } from '../../utils/speech';
import { userService } from '../../services/userService';
import { DailyXpProgressRing } from '../common/DailyXpProgressRing';
import { DailyStudyReminderCard } from './DailyStudyReminderCard';
import { AchievementBadgesCard } from './AchievementBadgesCard';
import { StreakFreezeCard } from './StreakFreezeCard';
import { ActivityHistoryCard } from './ActivityHistoryCard';
import { InstallGuideModal } from '../common/InstallGuideModal';
import { CommunityPopupAdminModal } from '../admin/CommunityPopupAdminModal';
import { AdminGuard } from '../common/AdminGuard';
import { UserProfile } from '../../types';

interface ProfilePageProps {
  onOpenGoalWizard?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenGoalWizard }) => {
  const { 
    userProfile, 
    setUserProfile,
    updateDisplayName, 
    logout, 
    setExperienceLevel, 
    setScriptLanguage,
    setSoundEnabled,
    setSoundEffectsEnabled,
    setDailyXpGoal,
    setDailyStudyGoalMinutes,
    isAdmin,
    adminEmail
  } = useAuth();
  const { theme, toggleTheme, fontSize, setFontSize, resetFontSize } = useTheme();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile?.displayName || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [scriptSaveSuccess, setScriptSaveSuccess] = useState(false);
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);
  const [isTestingSpeech, setIsTestingSpeech] = useState(false);
  const [goalFeedback, setGoalFeedback] = useState<string | null>(null);
  const [timeFeedback, setTimeFeedback] = useState<string | null>(null);

  const currentDailyGoal = userProfile?.dailyXpGoal || 50;
  const currentStudyMinutes = userProfile?.dailyStudyGoalMinutes || 10;
  const todayEarnedXp = userService.getTodayEarnedXP(userProfile);
  const [customGoalInput, setCustomGoalInput] = useState<number>(currentDailyGoal);
  const [customMinutesInput, setCustomMinutesInput] = useState<number>(currentStudyMinutes);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [isCustomTimeMode, setIsCustomTimeMode] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isCommunityPopupAdminOpen, setIsCommunityPopupAdminOpen] = useState<boolean>(false);

  const currentScriptLanguage = userProfile?.scriptLanguage || 'bangla';
  const isSoundActive = userProfile?.soundEnabled !== false;
  const isEffectsActive = userProfile?.soundEffectsEnabled !== false;
  const speechSupported = isSpeechSupported();

  const handleUpdateProfile = async (updated: UserProfile) => {
    setUserProfile(updated);
    await userService.saveUserProfile(updated);
  };

  const handleToggleSound = async (enabled: boolean) => {
    await setSoundEnabled(enabled);
    const msg = enabled ? '✓ জাপানি উচ্চারণ অডিও চালু করা হয়েছে!' : '✓ জাপানি উচ্চারণ অডিও বন্ধ (নিঃশব্দ) করা হয়েছে!';
    setSoundFeedback(msg);
    setTimeout(() => setSoundFeedback(null), 2500);
  };

  const handleToggleEffects = async (enabled: boolean) => {
    await setSoundEffectsEnabled(enabled);
    const msg = enabled ? '✓ কুইজ ও চিম সাউন্ড এফেক্টস চালু করা হয়েছে!' : '✓ সাউন্ড এফেক্টস বন্ধ করা হয়েছে!';
    setSoundFeedback(msg);
    setTimeout(() => setSoundFeedback(null), 2500);
  };

  const handleTestAudio = () => {
    setIsTestingSpeech(true);
    playJapaneseAudio('こんにちは', () => {
      setIsTestingSpeech(false);
    });
  };

  const handleTestChime = () => {
    playSuccessSound();
  };

  const handleSelectScriptLanguage = async (mode: 'bangla' | 'english') => {
    await setScriptLanguage(mode);
    setScriptSaveSuccess(true);
    setTimeout(() => setScriptSaveSuccess(false), 2200);
  };

  const handleSelectPresetMinutes = async (mins: number) => {
    await setDailyStudyGoalMinutes(mins);
    setCustomMinutesInput(mins);
    setIsCustomTimeMode(false);
    playKitsuneChime();
    setTimeFeedback(`✓ দৈনিক অধ্যয়ন সময় ${mins} মিনিটে আপডেট করা হয়েছে!`);
    setTimeout(() => setTimeFeedback(null), 2500);
  };

  const handleSaveCustomMinutes = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clamped = Math.max(1, Math.min(120, customMinutesInput));
    await setDailyStudyGoalMinutes(clamped);
    playKitsuneChime();
    setTimeFeedback(`✓ কাস্টম দৈনিক সময় ${clamped} মিনিটে সংরক্ষিত হয়েছে!`);
    setTimeout(() => setTimeFeedback(null), 2500);
  };

  const handleSelectPresetGoal = async (xp: number) => {
    await setDailyXpGoal(xp);
    setCustomGoalInput(xp);
    setIsCustomMode(false);
    playKitsuneChime();
    setGoalFeedback(`✓ দৈনিক লক্ষ্যমাত্রা ${xp} XP-তে আপডেট করা হয়েছে!`);
    setTimeout(() => setGoalFeedback(null), 2500);
  };

  const handleSaveCustomGoal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clamped = Math.max(10, Math.min(500, customGoalInput));
    await setDailyXpGoal(clamped);
    playKitsuneChime();
    setGoalFeedback(`✓ কাস্টম দৈনিক লক্ষ্যমাত্রা ${clamped} XP-তে সফলভাবে সংরক্ষিত!`);
    setTimeout(() => setGoalFeedback(null), 2500);
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    await updateDisplayName(nameInput.trim());
    setIsEditingName(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const createdDateStr = userProfile?.createdAt 
    ? new Date(userProfile.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'সম্প্রতি';

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Profile Card Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
          
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-3xl shadow-md font-serif">
              {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : '日'}
            </div>
            <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-stone-900" title="অ্যাক্টিভ শিক্ষার্থী">
              <ShieldCheck size={14} />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 max-w-sm mx-auto sm:mx-0">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="px-3 py-1.5 rounded-xl border border-rose-400 dark:border-rose-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-rose-500 w-full"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition"
                  title="সংরক্ষণ করুন"
                >
                  <Check size={16} />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white truncate">
                  {userProfile?.displayName || 'জাপানি শিক্ষার্থী'}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(userProfile?.displayName || '');
                    setIsEditingName(true);
                  }}
                  className="p-1 text-stone-400 hover:text-rose-600 transition"
                  title="নাম পরিবর্তন করুন"
                >
                  <Edit3 size={16} />
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1">
                <Mail size={13} />
                <span>{userProfile?.email || 'guest@chandujapanese.com'}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                <span>যোগদান: {createdDateStr}</span>
              </span>
            </div>

            {saveSuccess && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                ✓ নাম সফলভাবে আপডেট করা হয়েছে!
              </p>
            )}
          </div>

          {/* Quick Badges */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            {isAdmin ? (
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-black border border-amber-300 dark:border-amber-800 flex items-center gap-1 justify-center">
                <span>👑</span>
                <span>এডমিন</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900">
                {userProfile?.isGuest ? 'গেস্ট মোড' : 'রেজিস্টার্ড শিক্ষার্থী'}
              </span>
            )}
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
          <div className="text-center p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50">
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-medium">মোট XP</span>
            <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
              {userProfile?.xp || 0}
            </span>
          </div>

          <div className="text-center p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 flex flex-col justify-center">
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-medium">স্টাডি স্ট্রিক</span>
            <span className="text-lg sm:text-xl font-black text-orange-600 dark:text-orange-400 mt-0.5 block">
              {userProfile?.streak || 1} দিন 🔥
            </span>
            {(userProfile?.streakFreezeCount || 0) > 0 ? (
              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 block mt-0.5">
                ❄️ ফ্রিজ: {userProfile?.streakFreezeCount}/2
              </span>
            ) : null}
          </div>

          <div className="text-center p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50">
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-medium">দৈনিক চ্যালেঞ্জ স্ট্রিক</span>
            <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5 block">
              {userProfile?.dailyQuizStreak || 0} দিন ⚡
            </span>
          </div>

          <div className="text-center p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50">
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-medium">কুইজ সঠিকতা</span>
            <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {userProfile?.quizStats?.accuracy || 100}%
            </span>
          </div>
        </div>
      </div>

      {/* Admin Japanese PDF Management & Community Popup Callout Card protected by AdminGuard */}
      <AdminGuard>
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 dark:from-amber-950/40 dark:via-stone-900 dark:to-rose-950/30 border border-amber-300 dark:border-amber-800/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    এডমিন ড্যাশবোর্ড
                  </span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {adminEmail}
                  </span>
                </div>
                <h3 className="text-base font-black text-stone-900 dark:text-white">
                  মাস্টার এডমিন কন্ট্রোল ও কন্টেন্ট ব্যবস্থাপনা
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  ওয়েবসাইটে প্রবেশের পপআপ পোস্ট, কমিউনিটি লিংক, ছবি ও জাপানিজ PDF লাইব্রেরি পরিচালনা করুন।
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0 w-full sm:w-auto">
              {/* Community Popup Manager Button */}
              <button
                type="button"
                id="btn-admin-community-popup-manager"
                onClick={() => setIsCommunityPopupAdminOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                title="ওয়েবসাইটে প্রবেশের পোস্ট ও কমিউনিটি লিংক পরিবর্তন করুন"
              >
                <Share2 size={13} className="text-stone-950" />
                <span>কমিউনিটি পোস্ট ও পপআপ</span>
              </button>

              {/* PDF Library Button */}
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('chandu_navigate_tab', { detail: 'pdf' }));
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>PDF লাইব্রেরি দেখুন</span>
              </button>
            </div>
          </div>
        </div>
      </AdminGuard>

      {/* Activity History: Lists recent quiz performance and completed lessons for the day */}
      <ActivityHistoryCard 
        userProfile={userProfile} 
        onProfileUpdated={handleUpdateProfile} 
      />

      {/* Streak Freeze Management & Purchase Card */}
      <StreakFreezeCard 
        userProfile={userProfile} 
        onProfileUpdated={handleUpdateProfile} 
      />

      {/* Earned Achievement Badges & Milestones (Firestore Badges Collection) */}
      <AchievementBadgesCard 
        userProfile={userProfile} 
        onUpdateProfile={handleUpdateProfile} 
      />

      {/* User-Configurable Daily Study Time Settings */}
      <div id="section-daily-study-time-settings" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <span>দৈনিক অধ্যয়ন সময় (Daily Study Time)</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
                    {currentStudyMinutes} মিনিট/দিন
                  </span>
                </h3>
              </div>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              প্রতিদিন জাপানি শেখায় কত মিনিট ব্যয় করতে চান তা নির্বাচন করুন। নিয়মিত অল্প চর্চায় বর্ণমালা সহজে মনে থাকে।
            </p>
          </div>

          {timeFeedback && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto animate-in fade-in">
              {timeFeedback}
            </span>
          )}
        </div>

        {/* Minutes Presets */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
            সময় নির্বাচন করুন (Study Time Presets):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {[
              { mins: 5, title: 'Casual (সহজ)', desc: 'প্রতিদিন ৫ মিনিট ছোট প্র্যাকটিস', icon: '🌱' },
              { mins: 10, title: 'Regular (নিয়মিত)', desc: 'সুষম ও কার্যকর অনুশীলন', isDefault: true, icon: '🔥' },
              { mins: 15, title: 'Dedicated (মনোযোগী)', desc: 'দ্রুত বর্ণমালা ও উচ্চারণ শেখা', icon: '⚡' },
              { mins: 20, title: 'Focused (নিবেদিত)', desc: 'গভীর স্টাডি ও কুইজ স্পিড টেস্ট', icon: '🎯' },
              { mins: 30, title: 'Intensive (উচ্চাকাঙ্ক্ষী)', desc: 'দ্রুততম সময়ে আয়ত্ত করা', icon: '🚀' },
            ].map((preset) => {
              const isSelected = currentStudyMinutes === preset.mins && !isCustomTimeMode;
              return (
                <button
                  key={preset.mins}
                  type="button"
                  id={`btn-preset-minutes-${preset.mins}`}
                  onClick={() => handleSelectPresetMinutes(preset.mins)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/80 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{preset.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-stone-900 dark:text-white">
                            {preset.title}
                          </span>
                          {preset.isDefault && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white">
                              ডিফল্ট
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                          {preset.mins} মিনিট / দিন
                        </span>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400">
                          {preset.desc}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Minutes Slider / Input */}
          <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-850/50 space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                id="btn-toggle-custom-minutes"
                onClick={() => setIsCustomTimeMode(!isCustomTimeMode)}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
              >
                <Sliders size={14} className="text-rose-500" />
                <span>কাস্টম অধ্যয়ন সময় দিন (Custom Minutes)</span>
              </button>
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono">
                {customMinutesInput} মিনিট / দিন
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="range"
                id="range-daily-study-minutes"
                min="2"
                max="60"
                step="1"
                value={customMinutesInput}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomMinutesInput(val);
                  setIsCustomTimeMode(true);
                }}
                className="w-full accent-rose-600 cursor-pointer h-2 bg-stone-200 dark:bg-stone-700 rounded-lg"
              />

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <input
                  type="number"
                  id="input-custom-daily-minutes"
                  min="1"
                  max="120"
                  value={customMinutesInput}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(120, Number(e.target.value) || 1));
                    setCustomMinutesInput(val);
                    setIsCustomTimeMode(true);
                  }}
                  className="w-20 px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-xs text-center focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  id="btn-save-custom-minutes"
                  onClick={() => handleSaveCustomMinutes()}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer shadow-2xs"
                >
                  সেভ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Study Reminder using Browser Notification API */}
      <DailyStudyReminderCard />

      {/* User-Configurable Daily XP Goal Setting */}
      <div id="section-daily-xp-goal-settings" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                <Target size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <span>দৈনিক XP লক্ষ্যমাত্রা (Daily XP Goal Settings)</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    {currentDailyGoal} XP/দিন
                  </span>
                </h3>
              </div>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              প্রতিদিন আপনি কত XP অর্জন করতে চান তা পছন্দমতো নির্ধারণ করুন। হোম ড্যাশবোর্ডের প্রগ্রেস রিংয়ে আপনার আজকের অগ্রগতি রিয়েল-টাইমে প্রদর্শিত হবে।
            </p>
          </div>

          {goalFeedback && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto animate-in fade-in">
              {goalFeedback}
            </span>
          )}
        </div>

        {/* Content Layout: Presets + Live Ring Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-1">
          {/* Preset Buttons & Custom Input (7 cols on md) */}
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              লক্ষ্যমাত্রা নির্বাচন করুন (Preset Options):
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { xp: 30, title: 'Casual (সহজ)', time: '~৫ মিনিট/দিন', desc: 'দৈনিক নিয়মিত অল্প পাঠ', icon: '🌱' },
                { xp: 50, title: 'Regular (নিয়মিত)', time: '~১০ মিনিট/দিন', desc: 'সুষম চর্চা (ডিফল্ট/সুপারিশকৃত)', isDefault: true, icon: '🔥' },
                { xp: 100, title: 'Dedicated (মনোযোগী)', time: '~২০ মিনিট/দিন', desc: 'দ্রুত বর্ণমালা মুখস্থ ও প্র্যাকটিস', icon: '⚡' },
                { xp: 150, title: 'Intensive (উচ্চাকাঙ্ক্ষী)', time: '~৩০ মিনিট/দিন', desc: 'গভীর স্টাডি ও কুইজ স্পিড টেস্ট', icon: '🚀' },
              ].map((preset) => {
                const isSelected = currentDailyGoal === preset.xp && !isCustomMode;
                return (
                  <button
                    key={preset.xp}
                    type="button"
                    id={`btn-preset-goal-${preset.xp}`}
                    onClick={() => handleSelectPresetGoal(preset.xp)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/80 shadow-2xs'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{preset.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-stone-900 dark:text-white">
                              {preset.title}
                            </span>
                            {preset.isDefault && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                                ডিফল্ট
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                            {preset.xp} XP <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400">({preset.time})</span>
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Goal Slider / Input Section */}
            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-850/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  id="btn-toggle-custom-goal"
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
                >
                  <Sliders size={14} className="text-amber-500" />
                  <span>কাস্টম XP লক্ষ্য নির্ধারণ করুন (Custom Goal)</span>
                </button>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
                  {customGoalInput} XP
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="range"
                  id="range-daily-xp-goal"
                  min="10"
                  max="300"
                  step="5"
                  value={customGoalInput}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCustomGoalInput(val);
                    setIsCustomMode(true);
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 dark:bg-stone-700 rounded-lg"
                />

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <input
                    type="number"
                    id="input-custom-daily-xp"
                    min="10"
                    max="500"
                    value={customGoalInput}
                    onChange={(e) => {
                      const val = Math.max(10, Math.min(500, Number(e.target.value) || 10));
                      setCustomGoalInput(val);
                      setIsCustomMode(true);
                    }}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-xs text-center focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    id="btn-save-custom-xp-goal"
                    onClick={() => handleSaveCustomGoal()}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs transition cursor-pointer shadow-2xs"
                  >
                    সেভ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Progress Ring Preview (4 cols on md) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-800 text-center">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wider">
              হোম ড্যাশবোর্ড প্রিভিউ
            </span>
            <DailyXpProgressRing
              currentXP={todayEarnedXp}
              goalXP={currentDailyGoal}
              size={110}
              strokeWidth={9}
              showDetails={true}
            />
          </div>
        </div>

        {/* Wizard Relaunch Banner */}
        {onOpenGoalWizard && (
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
              <Sparkles size={14} className="text-amber-500" />
              <span>সহজে ৩-ধাপের ইন্টারেক্টিভ উইজার্ড দিয়ে প্ল্যান পরিবর্তন করতে চান?</span>
            </div>
            <button
              type="button"
              id="btn-relaunch-goal-wizard"
              onClick={onOpenGoalWizard}
              className="px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border border-stone-300/80 dark:border-stone-700"
            >
              <span>উইজার্ড চালু করুন</span>
              <Sliders size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Alphabet & Script Language Preference (বাংলা vs English Romaji) */}
      <div id="section-script-language-preference" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Languages size={18} className="text-rose-600 dark:text-rose-400" />
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                বর্ণমালা ও উচ্চারণ প্রদর্শন মাধ্যম (Script & Alphabet Guide)
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              জাপানি অক্ষরের উচ্চারণ ও গাইড কোন ভাষায় দেখতে চান তা নির্বাচন করুন। (ডিফল্ট: বাংলা)
            </p>
          </div>

          {scriptSaveSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto animate-in fade-in">
              ✓ মোড সফলভাবে পরিবর্তিত হয়েছে!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Option 1: Bangla (Default) */}
          <button
            type="button"
            id="btn-select-script-bangla"
            onClick={() => handleSelectScriptLanguage('bangla')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              currentScriptLanguage === 'bangla'
                ? 'border-rose-600 bg-rose-50/70 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/80 shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-100 hover:border-stone-300 dark:hover:border-stone-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇧🇩</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-stone-900 dark:text-white">বাংলা মাধ্যম</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                      ডিফল্ট
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    আ, ই, উ, এ, ও • কা, কি, কু...
                  </span>
                </div>
              </div>

              {currentScriptLanguage === 'bangla' && (
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <Check size={13} />
                </div>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-rose-200/50 dark:border-rose-900/40 text-[11px] font-medium text-stone-600 dark:text-stone-300 flex items-center justify-between">
              <span>নমুনা প্রদর্শন:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-stone-900 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-800">
                あ (আ) • か (কা)
              </span>
            </div>
          </button>

          {/* Option 2: English / Romaji */}
          <button
            type="button"
            id="btn-select-script-english"
            onClick={() => handleSelectScriptLanguage('english')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              currentScriptLanguage === 'english'
                ? 'border-rose-600 bg-rose-50/70 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/80 shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-100 hover:border-stone-300 dark:hover:border-stone-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔤</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-stone-900 dark:text-white">English (Romaji)</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      English
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    a, i, u, e, o • ka, ki, ku...
                  </span>
                </div>
              </div>

              {currentScriptLanguage === 'english' && (
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <Check size={13} />
                </div>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-rose-200/50 dark:border-rose-900/40 text-[11px] font-medium text-stone-600 dark:text-stone-300 flex items-center justify-between">
              <span>Preview:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-stone-900 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-800 font-mono">
                あ (a) • か (ka)
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Global Sound & Pronunciation Audio Settings */}
      <div id="section-sound-settings" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Volume2 size={18} className="text-rose-600 dark:text-rose-400" />
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                সাউন্ড ও জাপানি উচ্চারণ সেটিংস (Audio & Sound Settings)
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              বর্ণমালা এবং কুইজের প্রশ্নের সময় জাপানি অক্ষরের ভয়েস উচ্চারণ অডিও সক্রিয় বা নিঃশব্দ করুন।
            </p>
          </div>

          {soundFeedback && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto animate-in fade-in">
              {soundFeedback}
            </span>
          )}
        </div>

        <div className="space-y-3 pt-1">
          {/* Main Pronunciation Audio Toggle */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 transition-all hover:border-stone-300 dark:hover:border-stone-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isSoundActive 
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400' 
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                }`}>
                  {isSoundActive ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-stone-900 dark:text-white">
                      জাপানি উচ্চারণ ভয়েস অডিও (Pronunciation Audio)
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSoundActive
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-stone-700'
                    }`}>
                      {isSoundActive ? 'চালু (Active)' : 'নিঃশব্দ (Muted)'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
                    হিরাগানা/কাতাকানা ক্যারেক্টার কার্ড, লেসন ডিটেইল এবং কুইজ প্রশ্নের সময় জাপানি অক্ষরের স্বাভাবিক উচ্চারণ অডিও চালু বা বন্ধ রাখুন।
                  </p>
                </div>
              </div>

              {/* Action Buttons: Test Audio + Toggle Switch */}
              <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                {isSoundActive && speechSupported && (
                  <button
                    type="button"
                    id="btn-test-pronunciation-audio"
                    onClick={handleTestAudio}
                    disabled={isTestingSpeech}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-stone-800 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer shadow-2xs"
                    title="উচ্চারণ পরীক্ষা করুন"
                  >
                    <Play size={12} className={isTestingSpeech ? 'animate-spin text-rose-600' : 'fill-rose-600 text-rose-600'} />
                    <span>{isTestingSpeech ? 'বলছে...' : 'উচ্চারণ টেস্ট'}</span>
                  </button>
                )}

                <button
                  type="button"
                  id="toggle-pronunciation-sound-btn"
                  role="switch"
                  aria-checked={isSoundActive}
                  onClick={() => handleToggleSound(!isSoundActive)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer ${
                    isSoundActive ? 'bg-rose-600' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  title={isSoundActive ? 'উচ্চারণ অডিও বন্ধ করুন' : 'উচ্চারণ অডিও চালু করুন'}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                      isSoundActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  >
                    {isSoundActive ? (
                      <Volume2 size={12} className="text-rose-600" />
                    ) : (
                      <VolumeX size={12} className="text-stone-500" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sound Effects Toggle (Chimes & Fanfare) */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 transition-all hover:border-stone-300 dark:hover:border-stone-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isEffectsActive 
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400' 
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                }`}>
                  <Music size={20} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-stone-900 dark:text-white">
                      কুইজ ও নোটিফিকেশন সাউন্ড এফেক্টস (Quiz Effects)
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isEffectsActive
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-stone-700'
                    }`}>
                      {isEffectsActive ? 'চালু (Active)' : 'নিঃশব্দ (Muted)'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
                    কুইজে সঠিক বা ভুল উত্তরের অডিও এবং কিটসুনে ফক্স অ্যানিমেশনের মনোরম বেল সাউন্ড এফেক্টস।
                  </p>
                </div>
              </div>

              {/* Action Buttons: Test Chime + Toggle Switch */}
              <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                {isEffectsActive && (
                  <button
                    type="button"
                    id="btn-test-sound-effects"
                    onClick={handleTestChime}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900 bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-50 dark:hover:bg-amber-950/50 transition cursor-pointer shadow-2xs"
                    title="সাউন্ড পরীক্ষা করুন"
                  >
                    <Sparkles size={12} className="text-amber-500" />
                    <span>সাউন্ড টেস্ট</span>
                  </button>
                )}

                <button
                  type="button"
                  id="toggle-effects-sound-btn"
                  role="switch"
                  aria-checked={isEffectsActive}
                  onClick={() => handleToggleEffects(!isEffectsActive)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer ${
                    isEffectsActive ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  title={isEffectsActive ? 'সাউন্ড এফেক্টস বন্ধ করুন' : 'সাউন্ড এফেক্টস চালু করুন'}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                      isEffectsActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  >
                    {isEffectsActive ? (
                      <Music size={12} className="text-amber-600" />
                    ) : (
                      <VolumeX size={12} className="text-stone-500" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Level & Learning Preferences */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 dark:text-white">
          আপনার অভিজ্ঞতা ও শুরুর ধাপ (Learning Stage)
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          আপনার জাপানি জানার স্তর নির্বাচন করুন যাতে অ্যাপ আপনার প্রয়োজন অনুযায়ী সাজানো থাকে।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {[
            { id: 'beginner', title: 'একদম নতুন (Beginner)', desc: 'হিরাগানা লেভেল ১ থেকে শুরু' },
            { id: 'some_knowledge', title: 'অল্প কিছু অক্ষর জানি', desc: 'মৌলিক উচ্চারণ ও রিভিশন' },
            { id: 'know_hiragana', title: 'হিরাগানা জানি', desc: 'কাতাকানা ও কুইজ ফোকাস' },
            { id: 'know_katakana', title: 'উভয় বর্ণমালা রিভিশন', desc: 'অ্যাডভান্সড স্পিড টেস্ট কুইজ' },
          ].map((lvl) => {
            const isSelected = (userProfile?.experienceLevel || 'beginner') === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setExperienceLevel(lvl.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 ring-1 ring-rose-500'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{lvl.title}</span>
                  {isSelected && <Check size={14} className="text-rose-600 dark:text-rose-400" />}
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 block">
                  {lvl.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* App Settings */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 dark:text-white">
          অ্যাপ সেটিংস (Settings)
        </h3>

        <div className="space-y-3">
          {/* Theme setting */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={18} className="text-amber-400" /> : <Sun size={18} className="text-rose-600" />}
              <div>
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white block">অ্যাপ থিম (Theme)</span>
                <span className="text-xs text-stone-500 dark:text-stone-400">বর্তমানে {theme === 'dark' ? 'ডার্ক মোড' : 'লাইট মোড'} চালু আছে</span>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 text-xs font-bold hover:bg-white dark:hover:bg-stone-700 transition cursor-pointer"
            >
              পরিবর্তন করুন
            </button>
          </div>

          {/* Font / Text Size setting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 gap-3">
            <div className="flex items-center gap-3">
              <Type size={18} className="text-rose-600 dark:text-rose-400 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white block">
                  ফন্ট সাইজ / লেখার সাইজ (Text Size)
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  লেখার আকার স্বাভাবিক বা বড় করুন (বর্তমান: {fontSize === 'large' ? 'বড়' : fontSize === 'small' ? 'ছোট' : 'স্বাভাবিক'})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                id="btn-font-size-small"
                onClick={() => setFontSize('small')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  fontSize === 'small'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-600'
                }`}
              >
                ছোট (15px)
              </button>
              <button
                type="button"
                id="btn-font-size-normal"
                onClick={() => setFontSize('normal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  fontSize === 'normal'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-600'
                }`}
              >
                স্বাভাবিক (16px)
              </button>
              <button
                type="button"
                id="btn-font-size-large"
                onClick={() => setFontSize('large')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  fontSize === 'large'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-600'
                }`}
              >
                বড় (18px)
              </button>
              {fontSize !== 'normal' && (
                <button
                  type="button"
                  id="btn-font-size-reset"
                  onClick={resetFontSize}
                  title="ডিফল্ট আকারে রিসেট করুন"
                  className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-600 text-stone-500 hover:text-stone-800 dark:hover:text-white transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>
          </div>

          {/* PWA Home Screen Installation Option */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-rose-600 dark:text-rose-400" />
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-white block">হোম পেজে অ্যাপ রাখুন (PWA)</span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">Chandu Japanese School অফিশিয়াল লোগো সহ অফলাইনে পড়ুন</span>
              </div>
            </div>
            <button
              type="button"
              id="btn-profile-install-guide"
              onClick={() => setIsInstallModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>ইনস্টল করুন</span>
            </button>
          </div>

          {/* Developer Link Option */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <Code2 size={18} className="text-rose-600 dark:text-rose-400" />
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-white block">অ্যাপ ডেভেলপার (Developer)</span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">Created by uchihaemdadul</span>
              </div>
            </div>
            <a
              href="https://uchihaemdadul.bio.link/"
              target="_blank"
              rel="noopener noreferrer"
              id="profile-dev-link"
              className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition inline-flex items-center gap-1.5"
            >
              <span>uchihaemdadul</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            type="button"
            id="btn-profile-logout"
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold text-xs sm:text-sm hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>অ্যাকাউন্ট থেকে লগআউট</span>
          </button>
        </div>
      </div>

      <InstallGuideModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
      />

      <CommunityPopupAdminModal
        isOpen={isCommunityPopupAdminOpen}
        onClose={() => setIsCommunityPopupAdminOpen(false)}
        onOpenTestPreview={() => {
          setIsCommunityPopupAdminOpen(false);
          window.dispatchEvent(new CustomEvent('chandu_open_community_popup_preview'));
        }}
      />

    </div>
  );
};
