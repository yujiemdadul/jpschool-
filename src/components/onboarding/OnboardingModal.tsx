import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Target, 
  Flame, 
  Sparkles, 
  Check, 
  Sliders, 
  BookOpen, 
  Zap, 
  GraduationCap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { KanaType } from '../../types';
import { DailyXpProgressRing } from '../common/DailyXpProgressRing';
import { FoxAvatar } from '../fox/FoxAvatar';
import { playKitsuneChime, playSuccessSound } from '../../utils/speech';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (track: 'hiragana' | 'katakana' | 'quiz') => void;
  onOpenLevelModal?: (type: KanaType, level: number) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSelectTrack,
  onOpenLevelModal
}) => {
  const { userProfile, completeGoalOnboarding } = useAuth();

  // Multi-step state (1: Study Time -> 2: XP Goal -> 3: Starting Track)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Study Time in minutes
  const [studyMinutes, setStudyMinutes] = useState<number>(
    userProfile?.dailyStudyGoalMinutes || 10
  );
  const [isCustomMinutes, setIsCustomMinutes] = useState<boolean>(false);

  // Step 2: Daily XP Goal
  const [xpGoal, setXpGoal] = useState<number>(
    userProfile?.dailyXpGoal || 50
  );
  const [isCustomXp, setIsCustomXp] = useState<boolean>(false);

  // Step 3: Starting Level/Track
  const [selectedLevel, setSelectedLevel] = useState<
    'beginner' | 'some_knowledge' | 'know_hiragana' | 'know_katakana'
  >(userProfile?.experienceLevel || 'beginner');
  const [selectedTrack, setSelectedTrack] = useState<'hiragana' | 'katakana' | 'quiz'>('hiragana');
  const [targetLevel, setTargetLevel] = useState<{ type: KanaType; level: number } | undefined>({
    type: 'hiragana',
    level: 1
  });

  if (!isOpen) return null;

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // 1. Immediately close modal with 0ms delay
    onClose();

    // 2. Persist dismissal locally
    const uid = userProfile?.uid || 'guest';
    try {
      localStorage.setItem(`onboarding_dismissed_${uid}`, 'true');
      localStorage.setItem('onboarding_modal_dismissed_session', 'true');
    } catch (err) {
      // Ignore
    }

    // 3. Save defaults non-blockingly in background
    if (userProfile && completeGoalOnboarding) {
      completeGoalOnboarding({
        dailyStudyGoalMinutes: studyMinutes,
        dailyXpGoal: xpGoal,
        experienceLevel: selectedLevel
      }).catch((err) => {
        console.warn('Background goal onboarding save error:', err);
      });
    }
  };

  const handleNext = () => {
    playKitsuneChime();
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleFinish = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // 1. Immediately close modal
    onClose();
    onSelectTrack(selectedTrack);

    // 2. Persist dismissal locally
    const uid = userProfile?.uid || 'guest';
    try {
      localStorage.setItem(`onboarding_dismissed_${uid}`, 'true');
      localStorage.setItem('onboarding_modal_dismissed_session', 'true');
    } catch (err) {
      // Ignore
    }

    playSuccessSound();

    // 3. Save goal settings non-blockingly in background
    if (userProfile && completeGoalOnboarding) {
      completeGoalOnboarding({
        dailyStudyGoalMinutes: studyMinutes,
        dailyXpGoal: xpGoal,
        experienceLevel: selectedLevel
      }).catch((err) => {
        console.warn('Background goal onboarding save error:', err);
      });
    }

    if (targetLevel && onOpenLevelModal) {
      setTimeout(() => {
        onOpenLevelModal(targetLevel.type, targetLevel.level);
      }, 200);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleDismiss(e);
        }
      }}
    >
      <div 
        id="onboarding-goal-modal"
        className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 my-auto touch-manipulation select-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-right close button */}
        <button
          type="button"
          id="btn-close-onboarding"
          onClick={(e) => handleDismiss(e)}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer shadow-xs active:scale-95"
          aria-label="বন্ধ করুন"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Step Progress Dots Header */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <FoxAvatar size="sm" isHappy={true} />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                স্বাগতম • WELCOME
              </span>
              <h3 className="text-sm font-black text-stone-900 dark:text-white leading-none">
                {userProfile?.displayName ? `${userProfile.displayName} এর লার্নিং প্ল্যান` : 'দৈনিক লার্নিং প্ল্যান সেটআপ'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full border border-stone-200/60 dark:border-stone-700/60">
            <span className="text-xs font-black text-rose-600 dark:text-rose-400">ধাপ {step}/৩</span>
            <div className="flex gap-1 ml-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === step
                      ? 'w-5 bg-rose-600 dark:bg-rose-500'
                      : i < step
                        ? 'bg-emerald-500'
                        : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Wizard Steps */}
        <AnimatePresence mode="wait">
          {/* STEP 1: Daily Study Time (মিনিট নির্বাচন) */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold mb-1.5">
                  <Clock size={13} />
                  <span>ধাপ ১: দৈনিক অধ্যয়ন সময়</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                  প্রতিদিন কত মিনিট জাপানি শিখবেন?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  নিয়মিত অল্প সময় ব্যয় করাই জাপানি বর্ণমালা দ্রুত মনে রাখার মূল চাবিকাঠি।
                </p>
              </div>

              {/* Time Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {[
                  { minutes: 5, label: 'Casual (সহজ)', desc: 'প্রতিদিন ছোট ৫ মিনিট চর্চা', icon: '🌱' },
                  { minutes: 10, label: 'Regular (নিয়মিত)', desc: 'সুষম ও কার্যকর অনুশীলন', isRecommended: true, icon: '🔥' },
                  { minutes: 15, label: 'Dedicated (মনোযোগী)', desc: 'দ্রুত বর্ণমালা ও স্ট্রোক শেখা', icon: '⚡' },
                  { minutes: 20, label: 'Focused (নিবেদিত)', desc: 'গভীর পাঠ ও কুইজ স্পিড টেস্ট', icon: '🎯' },
                  { minutes: 30, label: 'Intensive (উচ্চাকাঙ্ক্ষী)', desc: 'দ্রুততম সময়ে জাপানি আয়ত্ত', icon: '🚀' },
                ].map((item) => {
                  const isSelected = studyMinutes === item.minutes && !isCustomMinutes;
                  return (
                    <button
                      key={item.minutes}
                      type="button"
                      id={`btn-onboarding-minutes-${item.minutes}`}
                      onClick={() => {
                        setStudyMinutes(item.minutes);
                        setIsCustomMinutes(false);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/80 shadow-2xs'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-stone-900 dark:text-white">
                              {item.label}
                            </span>
                            {item.isRecommended && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white">
                                সেরা পছন্দ
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                            {item.minutes} মিনিট / দিন
                          </span>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                          <Check size={13} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Minutes Slider */}
              <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Sliders size={13} className="text-rose-500" />
                    <span>কাস্টম সময় দিন:</span>
                  </span>
                  <span className="font-black text-rose-600 dark:text-rose-400 font-mono">
                    {studyMinutes} মিনিট / দিন
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="2"
                    max="60"
                    step="1"
                    value={studyMinutes}
                    onChange={(e) => {
                      setStudyMinutes(Number(e.target.value));
                      setIsCustomMinutes(true);
                    }}
                    className="w-full accent-rose-600 cursor-pointer h-2 bg-stone-200 dark:bg-stone-700 rounded-lg"
                  />
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-400 shrink-0 w-12 text-right">
                    {studyMinutes} মি.
                  </span>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  id="btn-skip-onboarding-step1"
                  onClick={handleDismiss}
                  className="text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  পরে বেছে নেব
                </button>

                <button
                  type="button"
                  id="btn-onboarding-next-step1"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>পরবর্তী: দৈনিক XP লক্ষ্য</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Daily XP Goal (এক্সপি লক্ষ্যমাত্রা) */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold mb-1.5">
                  <Target size={13} />
                  <span>ধাপ ২: দৈনিক XP লক্ষ্যমাত্রা</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                  প্রতিদিন কত XP অর্জন করতে চান?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  প্রতিদিন পাঠ ও কুইজ শেষ করলে রিয়েল-টাইম প্রগ্রেস রিংয়ে আপনার অর্জন ভেসে উঠবে।
                </p>
              </div>

              {/* Grid with Presets on Left and Live Ring Preview on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center pt-1">
                <div className="md:col-span-7 space-y-2">
                  {[
                    { xp: 30, label: 'Casual (সহজ)', time: '~৫ মিনিট', icon: '🌱' },
                    { xp: 50, label: 'Regular (নিয়মিত)', time: '~১০ মিনিট', isRecommended: true, icon: '🔥' },
                    { xp: 100, label: 'Dedicated (মনোযোগী)', time: '~২০ মিনিট', icon: '⚡' },
                    { xp: 150, label: 'Intensive (উচ্চাকাঙ্ক্ষী)', time: '~৩০ মিনিট', icon: '🚀' },
                  ].map((preset) => {
                    const isSelected = xpGoal === preset.xp && !isCustomXp;
                    return (
                      <button
                        key={preset.xp}
                        type="button"
                        id={`btn-onboarding-xp-${preset.xp}`}
                        onClick={() => {
                          setXpGoal(preset.xp);
                          setIsCustomXp(false);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/80 shadow-2xs'
                            : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{preset.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900 dark:text-white">
                                {preset.label}
                              </span>
                              {preset.isRecommended && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950">
                                  সুপারিশকৃত
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                              {preset.xp} XP / দিন <span className="text-[10px] font-normal text-stone-500 dark:text-stone-400">({preset.time})</span>
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Live Progress Ring Preview Box */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center">
                  <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-wider">
                    হোম রিং প্রিভিউ
                  </span>
                  <DailyXpProgressRing
                    currentXP={0}
                    goalXP={xpGoal}
                    size={105}
                    strokeWidth={8}
                    showDetails={true}
                  />
                </div>
              </div>

              {/* Custom XP Range Slider */}
              <div className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Sliders size={13} className="text-amber-500" />
                    <span>কাস্টম XP লক্ষ্য:</span>
                  </span>
                  <span className="font-black text-amber-600 dark:text-amber-400 font-mono">
                    {xpGoal} XP
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="5"
                    value={xpGoal}
                    onChange={(e) => {
                      setXpGoal(Number(e.target.value));
                      setIsCustomXp(true);
                    }}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 dark:bg-stone-700 rounded-lg"
                  />
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-400 shrink-0 w-12 text-right font-mono">
                    {xpGoal} XP
                  </span>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  id="btn-onboarding-back-step2"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>আগের ধাপ</span>
                </button>

                <button
                  type="button"
                  id="btn-onboarding-next-step2"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>পরবর্তী: শুরুর ধাপ</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Starting Track & Experience Level (শুরুর ধাপ নির্বাচন) */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold mb-1.5">
                  <GraduationCap size={13} />
                  <span>ধাপ ৩: জাপানি দক্ষতার স্তর</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                  কোন ধাপ থেকে শুরু করতে চান?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  আপনার দক্ষতা অনুযায়ী নিচের যেকোনো একটি অপশন বেছে নিন:
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  {
                    id: 'beginner',
                    level: 'beginner' as const,
                    track: 'hiragana' as const,
                    target: { type: 'hiragana' as KanaType, level: 1 },
                    icon: '🌱',
                    title: 'আমি একদম নতুন (Start from Scratch)',
                    desc: 'হিরাগানা Level 1 (あ い う え お) এর মৌলিক পাঠ থেকে শুরু করুন।'
                  },
                  {
                    id: 'some_knowledge',
                    level: 'some_knowledge' as const,
                    track: 'hiragana' as const,
                    target: undefined,
                    icon: '📖',
                    title: 'অল্প কিছু জানি (Quick Review)',
                    desc: 'উচ্চারণ ও লেখার নিয়ম রিভিশন দিয়ে পরবর্তী লেভেলে যান।'
                  },
                  {
                    id: 'know_hiragana',
                    level: 'know_hiragana' as const,
                    track: 'katakana' as const,
                    target: { type: 'katakana' as KanaType, level: 1 },
                    icon: '⚡',
                    title: 'হিরাগানা পারি, কাতাকানা শিখব',
                    desc: 'সরাসরি কাতাকানা বর্ণমালার লেভেল ১ থেকে শুরু করুন।'
                  },
                  {
                    id: 'know_katakana',
                    level: 'know_katakana' as const,
                    track: 'quiz' as const,
                    target: undefined,
                    icon: '🎯',
                    title: 'কুইজ দিয়ে দক্ষতা যাচাই',
                    desc: 'হিরাগানা ও কাতাকানার মিশ্র কুইজ দিয়ে সরাসরি এক্সপি অর্জন করুন।'
                  }
                ].map((opt) => {
                  const isSelected = selectedLevel === opt.level;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      id={`btn-onboarding-${opt.id}`}
                      onClick={() => {
                        setSelectedLevel(opt.level);
                        setSelectedTrack(opt.track);
                        setTargetLevel(opt.target);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/80 shadow-2xs'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{opt.icon}</span>
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                            {opt.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 pl-6">
                          {opt.desc}
                        </p>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 ml-2">
                          <Check size={13} strokeWidth={3} />
                        </div>
                      ) : (
                        <ArrowRight size={15} className="text-stone-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Summary Pill */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 text-[11px] text-stone-600 dark:text-stone-300">
                <span>
                  ⏱️ <strong>{studyMinutes} মিনিট</strong> / দিন
                </span>
                <span>
                  🎯 <strong>{xpGoal} XP</strong> লক্ষ্য
                </span>
                <span>
                  🎌 <strong>{selectedTrack === 'katakana' ? 'কাতাকানা' : selectedTrack === 'quiz' ? 'কুইজ' : 'হিরাগানা'}</strong>
                </span>
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  id="btn-onboarding-back-step3"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>আগের ধাপ</span>
                </button>

                <button
                  type="button"
                  id="btn-onboarding-finish"
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles size={15} />
                  <span>যাত্রা শুরু করুন 🚀</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
