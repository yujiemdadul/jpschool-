import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  colorClass?: string;
  showLabel?: boolean;
  labelPosition?: 'right' | 'top';
  labelPrefix?: string;
  showShimmer?: boolean;
  heightClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className = '',
  colorClass = 'bg-rose-600',
  showLabel = false,
  labelPosition = 'right',
  labelPrefix = '',
  showShimmer = true,
  heightClass = 'h-2.5'
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-between text-xs font-semibold mb-1 text-stone-600 dark:text-stone-300">
          <span>{labelPrefix}</span>
          <span className="font-bold tabular-nums">{clamped}%</span>
        </div>
      )}
      <div className="flex items-center gap-2 w-full">
        <div className={`flex-1 ${heightClass} bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden relative shadow-inner`}>
          <motion.div
            className={`h-full rounded-full relative overflow-hidden ${colorClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={{
              type: 'spring',
              damping: 24,
              stiffness: 70,
              mass: 0.6
            }}
          >
            {/* Subtle top gloss line */}
            <div className="absolute inset-x-0 top-0 h-[35%] bg-white/25 rounded-t-full pointer-events-none" />
            
            {/* Subtle animated shimmer highlight */}
            {showShimmer && clamped > 0 && (
              <motion.div
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: 'easeInOut',
                  repeatDelay: 1.2
                }}
              />
            )}
          </motion.div>
        </div>
        {showLabel && labelPosition === 'right' && (
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 min-w-9 text-right tabular-nums">
            {clamped}%
          </span>
        )}
      </div>
    </div>
  );
};

