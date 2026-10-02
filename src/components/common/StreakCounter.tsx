import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { playFireSparkleChime } from '../../utils/speech';

export interface StreakCounterProps {
  streak: number;
  isGoalCompleted?: boolean;
  variant?: 'badge' | 'card' | 'featured';
  interactive?: boolean;
  showBonusBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  isGoalCompleted = false,
  variant = 'badge',
  interactive = true,
  showBonusBadge = false,
  className = '',
  onClick
}) => {
  const [isBurstActive, setIsBurstActive] = useState<boolean>(false);
  const [hasTriggeredInitialBurst, setHasTriggeredInitialBurst] = useState<boolean>(false);

  // Trigger celebration effect when goal is completed
  useEffect(() => {
    if (isGoalCompleted && !hasTriggeredInitialBurst) {
      setIsBurstActive(true);
      setHasTriggeredInitialBurst(true);
      const timer = setTimeout(() => setIsBurstActive(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [isGoalCompleted, hasTriggeredInitialBurst]);

  const handleTriggerCelebration = (e: React.MouseEvent) => {
    if (onClick) onClick();
    if (!interactive) return;

    e.stopPropagation();
    setIsBurstActive(true);
    playFireSparkleChime();
    setTimeout(() => setIsBurstActive(false), 2200);
  };

  // -------------------------------------------------------------
  // Variant: CARD (Used in Dashboard / Progress Stats)
  // -------------------------------------------------------------
  if (variant === 'card') {
    return (
      <div
        id="streak-counter-card"
        onClick={handleTriggerCelebration}
        className={`relative overflow-hidden flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border transition-all duration-300 min-w-20 sm:min-w-24 ${
          isGoalCompleted
            ? 'bg-gradient-to-b from-orange-500/15 via-amber-500/10 to-rose-500/15 dark:from-orange-950/50 dark:via-stone-900 dark:to-rose-950/40 border-orange-400/80 dark:border-orange-600/70 shadow-md shadow-orange-500/15 animate-fire-glow-pulse cursor-pointer'
            : 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/40 cursor-pointer hover:border-orange-300'
        } ${className}`}
        title={isGoalCompleted ? 'আজকের দৈনিক লক্ষ্য সম্পন্ন! 🔥 স্ট্রিক সক্রিয় (ক্লিক করে স্পার্কল দেখুন)' : `${streak} দিনের স্ট্রিক`}
      >
        {/* Fire Burst Wave Ring on Goal Completion / Click */}
        {isBurstActive && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="w-12 h-12 rounded-full border-2 border-orange-400 dark:border-orange-300 animate-fire-burst-ring" />
            <span className="w-16 h-16 rounded-full border border-amber-300 dark:border-amber-400 animate-fire-burst-ring" style={{ animationDelay: '0.15s' }} />
          </div>
        )}

        {/* Floating Ember Particles */}
        {(isGoalCompleted || isBurstActive) && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <span 
              className="absolute bottom-2 left-1/3 w-1.5 h-1.5 rounded-full bg-orange-400 animate-ember-float" 
              style={{ '--ember-x': '-8px', '--ember-y': '-30px', animationDelay: '0s' } as React.CSSProperties} 
            />
            <span 
              className="absolute bottom-2 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ember-float" 
              style={{ '--ember-x': '10px', '--ember-y': '-28px', animationDelay: '0.4s' } as React.CSSProperties} 
            />
            <span 
              className="absolute bottom-3 left-1/2 w-1 h-1 rounded-full bg-rose-400 animate-ember-float" 
              style={{ '--ember-x': '4px', '--ember-y': '-34px', animationDelay: '0.8s' } as React.CSSProperties} 
            />
          </div>
        )}

        {/* Sparkle Twinkles */}
        {(isGoalCompleted || isBurstActive) && (
          <>
            <Sparkles 
              size={12} 
              className="absolute top-1.5 right-1.5 text-amber-500 fill-amber-400 animate-sparkle-twinkle" 
            />
            <Sparkles 
              size={10} 
              className="absolute bottom-1.5 left-1.5 text-orange-500 fill-orange-400 animate-sparkle-twinkle" 
              style={{ animationDelay: '0.7s' }} 
            />
          </>
        )}

        {/* Flame Icon with keyframe flicker & glow */}
        <div className={`relative mb-1 transition-transform ${isBurstActive ? 'animate-streak-pop' : ''}`}>
          <Flame
            size={22}
            className={`transition-all ${
              isGoalCompleted
                ? 'fill-orange-500 text-orange-500 animate-flame-flicker'
                : 'fill-orange-500/80 text-orange-500'
            }`}
          />
          {isGoalCompleted && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          )}
        </div>

        {/* Streak Number */}
        <span className={`text-base sm:text-lg font-black leading-tight ${
          isGoalCompleted 
            ? 'text-orange-950 dark:text-orange-200' 
            : 'text-orange-900 dark:text-orange-200'
        }`}>
          {streak} দিন
        </span>

        {/* Label */}
        <span className="text-xs font-semibold text-orange-700 dark:text-orange-400 flex items-center gap-1">
          <span>Streak</span>
          {isGoalCompleted ? <span>🔥✨</span> : <span>🔥</span>}
        </span>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Variant: FEATURED (Used in Daily Goals / Challenge Cards)
  // -------------------------------------------------------------
  if (variant === 'featured') {
    return (
      <div
        id="streak-counter-featured"
        onClick={handleTriggerCelebration}
        className={`relative overflow-hidden p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
          isGoalCompleted
            ? 'bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-rose-500/15 dark:from-orange-950/40 dark:via-stone-900 dark:to-rose-950/40 border-orange-400 dark:border-orange-600/80 shadow-lg shadow-orange-500/10 animate-fire-glow-pulse cursor-pointer'
            : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-700/80 cursor-pointer hover:border-orange-300'
        } ${className}`}
        title="ক্লিক করে স্ট্রিক ফায়ার এফেক্ট উপভোগ করুন"
      >
        {/* Background Fire Gradient Lick */}
        {isGoalCompleted && (
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 via-amber-400/5 to-transparent pointer-events-none" />
        )}

        {/* Burst Rings */}
        {isBurstActive && (
          <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
            <span className="w-14 h-14 rounded-full border-2 border-orange-400 animate-fire-burst-ring" />
            <span className="w-20 h-20 rounded-full border border-amber-400 animate-fire-burst-ring" style={{ animationDelay: '0.15s' }} />
          </div>
        )}

        {/* Left: Animated Flame + Counter Info */}
        <div className="flex items-center gap-3 relative z-10">
          <div className={`relative flex items-center justify-center w-11 h-11 rounded-xl ${
            isGoalCompleted
              ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 animate-fire-glow-pulse'
              : 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400'
          }`}>
            <Flame
              size={24}
              className={`${
                isGoalCompleted ? 'fill-white text-white animate-flame-flicker' : 'fill-orange-500 text-orange-500'
              }`}
            />
            {isGoalCompleted && (
              <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-200 fill-amber-200 animate-sparkle-twinkle" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-stone-900 dark:text-white">
                দৈনিক স্ট্রিক: <strong className="text-orange-600 dark:text-orange-400 font-extrabold">{streak} দিন</strong>
              </span>
              {isGoalCompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 size={11} />
                  <span>আজকেরটি সম্পন্ন</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isGoalCompleted
                ? 'চমৎকার! আজকের দৈনিক লক্ষ্য পূরণ হয়েছে। ফায়ার স্ট্রিক সক্রিয় রয়েছে!'
                : 'প্রতিদিন অন্তত ১টি লেভেল বা কুইজ শেষ করে স্ট্রিক ফায়ার ধরে রাখুন।'}
            </p>
          </div>
        </div>

        {/* Right: Sparkle Streak Bonus XP */}
        {showBonusBadge && (
          <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-black shadow-2xs relative z-10">
            <Zap size={13} className="fill-amber-500 text-amber-500 animate-bounce" />
            <span>+10 XP Bonus</span>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // Variant: BADGE (Default - Used in Navbar / Compact Header)
  // -------------------------------------------------------------
  return (
    <div
      id="streak-counter-badge"
      onClick={handleTriggerCelebration}
      title={isGoalCompleted ? 'আজকের দৈনিক লক্ষ্য সম্পন্ন! 🔥 (ক্লিক করে ফায়ার এফেক্ট দেখুন)' : `${streak} দিনের অ্যাক্টিভ স্ট্রিক`}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 select-none ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${
        isGoalCompleted
          ? 'bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-rose-500/20 dark:from-orange-950/60 dark:via-amber-950/40 dark:to-rose-950/50 border border-orange-400 dark:border-orange-500/80 text-orange-600 dark:text-orange-400 shadow-sm shadow-orange-500/20 animate-fire-glow-pulse'
          : 'bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400'
      } ${className}`}
    >
      {/* Burst Ripple Ring */}
      {isBurstActive && (
        <span className="absolute inset-0 -m-1 rounded-full border-2 border-orange-400 dark:border-orange-300 animate-fire-burst-ring pointer-events-none" />
      )}

      {/* Twinkling Gold Sparkle on top corner */}
      {(isGoalCompleted || isBurstActive) && (
        <Sparkles
          size={10}
          className="absolute -top-1.5 -right-1 text-amber-400 fill-amber-300 animate-sparkle-twinkle pointer-events-none"
        />
      )}

      {/* Tiny rising ember */}
      {(isGoalCompleted || isBurstActive) && (
        <span
          className="absolute -top-1 left-2 w-1 h-1 rounded-full bg-orange-400 animate-ember-float pointer-events-none"
          style={{ '--ember-x': '3px', '--ember-y': '-12px' } as React.CSSProperties}
        />
      )}

      {/* Flame Icon with dynamic CSS keyframe animation */}
      <div className={`relative ${isBurstActive ? 'animate-streak-pop' : ''}`}>
        <Flame
          size={14}
          className={`transition-all ${
            isGoalCompleted
              ? 'fill-orange-500 text-orange-500 animate-flame-flicker'
              : 'fill-orange-500 text-orange-500 animate-bounce'
          }`}
        />
      </div>

      <span className="font-extrabold tracking-tight">
        {streak}d
      </span>

      {isGoalCompleted && (
        <span className="text-xs text-amber-500 animate-pulse leading-none">
          ✨
        </span>
      )}
    </div>
  );
};
