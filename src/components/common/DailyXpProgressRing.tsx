import React from 'react';
import { Zap, Check, Flame, Sparkles, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface DailyXpProgressRingProps {
  currentXP: number;
  goalXP: number;
  size?: number;
  strokeWidth?: number;
  showDetails?: boolean;
  className?: string;
  onClick?: () => void;
}

export const DailyXpProgressRing: React.FC<DailyXpProgressRingProps> = ({
  currentXP,
  goalXP,
  size = 120,
  strokeWidth = 10,
  showDetails = true,
  className = '',
  onClick
}) => {
  const safeGoal = Math.max(10, goalXP || 50);
  const safeCurrent = Math.max(0, currentXP || 0);
  const percentage = Math.min(100, Math.round((safeCurrent / safeGoal) * 100));
  const isCompleted = safeCurrent >= safeGoal;

  // SVG Geometry calculations
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const gradientId = `dailyXpGradient-${size}`;
  const completeGradientId = `dailyXpCompleteGradient-${size}`;

  return (
    <div 
      className={`inline-flex flex-col items-center justify-center ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
      id="daily-xp-progress-ring-container"
      title={isCompleted ? `আজকের লক্ষ্য সম্পন্ন (${safeCurrent}/${safeGoal} XP)!` : `দৈনিক অগ্রগতি: ${safeCurrent}/${safeGoal} XP (${percentage}%)`}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center"
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            {/* Standard In-progress Gradient (Amber -> Orange -> Rose) */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>

            {/* Completed Goal Gradient (Emerald -> Teal -> Amber) */}
            <linearGradient id={completeGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#059669" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-stone-100 dark:text-stone-800"
          />

          {/* Foreground Progress Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={`url(#${isCompleted ? completeGradientId : gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none select-none">
          {isCompleted ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs mb-0.5">
                <Check size={16} strokeWidth={3} />
              </div>
              <span className="text-[13px] font-black text-emerald-600 dark:text-emerald-400 leading-none">
                100%
              </span>
              <span className="text-[9px] font-bold text-stone-500 dark:text-stone-400 mt-0.5">
                অর্জিত!
              </span>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Zap size={size < 100 ? 14 : 16} className="text-amber-500 fill-amber-500 mb-0.5 animate-pulse" />
              <span className="text-sm sm:text-base font-black text-stone-900 dark:text-white leading-none">
                {safeCurrent}
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">/{safeGoal}</span>
              </span>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {percentage}% XP
              </span>
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 text-center">
          <div className="flex items-center justify-center gap-1">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                <Sparkles size={13} className="text-emerald-500" />
                <span>আজকের লক্ষ্য পূর্ণ!</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                আজকের লক্ষ্য: <strong className="text-amber-600 dark:text-amber-400 font-extrabold">{safeGoal} XP</strong>
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            {isCompleted 
              ? `মোট ${safeCurrent} XP অর্জিত হয়েছে 🎉` 
              : `লক্ষ্য পূরণে আরও ${Math.max(0, safeGoal - safeCurrent)} XP বাকি`}
          </p>
        </div>
      )}
    </div>
  );
};
