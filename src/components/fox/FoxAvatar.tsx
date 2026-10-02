import React from 'react';
import { motion } from 'motion/react';

interface FoxAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  isHappy?: boolean;
  className?: string;
}

export const FoxAvatar: React.FC<FoxAvatarProps> = ({
  size = 'sm',
  isSpeaking = false,
  isHappy = false,
  className = ''
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-22 h-22 sm:w-26 sm:h-26'
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 select-none ${sizeMap[size]} ${className}`}>
      
      {/* Gentle ambient glow */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/30 via-rose-500/20 to-orange-400/30 blur-md pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut'
        }}
      />

      {/* SVG Character Avatar */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md relative z-10 overflow-visible"
      >
        <defs>
          <linearGradient id="foxFurGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" /> {/* Amber/Orange-400 */}
            <stop offset="50%" stopColor="#EA580C" /> {/* Orange-600 */}
            <stop offset="100%" stopColor="#BE123C" /> {/* Rose-700 */}
          </linearGradient>

          <linearGradient id="foxInnerEar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FECDD3" /> {/* Rose-200 */}
            <stop offset="100%" stopColor="#FDA4AF" /> {/* Rose-300 */}
          </linearGradient>

          <linearGradient id="foxWhiteFur" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF1F2" />
          </linearGradient>

          <filter id="foxShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Fluffy Tail */}
        <motion.g
          animate={{
            rotate: [0, 8, -4, 0],
            originX: '75px',
            originY: '70px'
          }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: 'easeInOut'
          }}
        >
          <path
            d="M 72 65 C 92 50, 98 75, 82 88 C 72 96, 60 88, 68 76 Z"
            fill="url(#foxFurGrad)"
          />
          {/* White tail tip */}
          <path
            d="M 86 58 C 96 68, 88 80, 80 82 C 84 72, 82 64, 86 58 Z"
            fill="#FFFFFF"
          />
        </motion.g>

        {/* Left Ear */}
        <motion.g
          animate={{
            rotate: isSpeaking ? [0, -6, 2, 0] : [0, -3, 0],
            originX: '28px',
            originY: '35px'
          }}
          transition={{
            repeat: Infinity,
            duration: isSpeaking ? 1.2 : 4,
            ease: 'easeInOut'
          }}
        >
          <path
            d="M 22 42 L 14 14 C 20 18, 35 24, 38 36 Z"
            fill="url(#foxFurGrad)"
            filter="url(#foxShadow)"
          />
          <path
            d="M 23 38 L 18 19 C 22 22, 32 27, 34 34 Z"
            fill="url(#foxInnerEar)"
          />
          {/* Ear fluff */}
          <path
            d="M 28 35 Q 24 28 32 30"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Right Ear */}
        <motion.g
          animate={{
            rotate: isSpeaking ? [0, 6, -2, 0] : [0, 3, 0],
            originX: '72px',
            originY: '35px'
          }}
          transition={{
            repeat: Infinity,
            duration: isSpeaking ? 1.4 : 4.5,
            ease: 'easeInOut',
            delay: 0.2
          }}
        >
          <path
            d="M 78 42 L 86 14 C 80 18, 65 24, 62 36 Z"
            fill="url(#foxFurGrad)"
            filter="url(#foxShadow)"
          />
          <path
            d="M 77 38 L 82 19 C 78 22, 68 27, 66 34 Z"
            fill="url(#foxInnerEar)"
          />
          {/* Ear fluff */}
          <path
            d="M 72 35 Q 76 28 68 30"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Head Main Shape */}
        <path
          d="M 24 45 C 20 62, 35 84, 50 84 C 65 84, 80 62, 76 45 C 72 30, 28 30, 24 45 Z"
          fill="url(#foxFurGrad)"
          filter="url(#foxShadow)"
        />

        {/* White Cheeks / Muzzle Fur */}
        <path
          d="M 26 50 C 22 68, 38 82, 50 82 C 62 82, 78 68, 74 50 C 66 58, 56 60, 50 60 C 44 60, 34 58, 26 50 Z"
          fill="url(#foxWhiteFur)"
        />

        {/* Traditional Japanese Red Forehead Kitsune Mark (Magatama / Shrine symbol) */}
        <g>
          <path
            d="M 50 32 C 48 36, 48 40, 50 43 C 52 40, 52 36, 50 32 Z"
            fill="#E11D48"
          />
          <circle cx="50" cy="30" r="1.8" fill="#E11D48" />
          <path
            d="M 44 38 Q 47 40 45 43"
            stroke="#E11D48"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 56 38 Q 53 40 55 43"
            stroke="#E11D48"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Eyes */}
        {isHappy ? (
          // Happy closed curving anime eyes ^ ^
          <g>
            <path
              d="M 33 50 Q 38 43 43 50"
              stroke="#3F2D24"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 57 50 Q 62 43 67 50"
              stroke="#3F2D24"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          // Bright, cute open sparkling eyes
          <g>
            {/* Left Eye */}
            <ellipse cx="38" cy="49" rx="4.2" ry="5.2" fill="#292524" />
            <circle cx="36.5" cy="47" r="1.8" fill="#FFFFFF" />
            <circle cx="40" cy="51" r="0.8" fill="#FFFFFF" />
            
            {/* Right Eye */}
            <ellipse cx="62" cy="49" rx="4.2" ry="5.2" fill="#292524" />
            <circle cx="60.5" cy="47" r="1.8" fill="#FFFFFF" />
            <circle cx="64" cy="51" r="0.8" fill="#FFFFFF" />
          </g>
        )}

        {/* Cute Blushing Cheeks */}
        <ellipse cx="28" cy="56" rx="3.5" ry="2.2" fill="#FB7185" opacity="0.6" />
        <ellipse cx="72" cy="56" rx="3.5" ry="2.2" fill="#FB7185" opacity="0.6" />

        {/* Nose */}
        <polygon points="50,59 47,56 53,56" fill="#1C1917" />

        {/* Mouth */}
        {isSpeaking ? (
          <motion.path
            d="M 46 62 Q 50 67 54 62 Z"
            fill="#E11D48"
            stroke="#1C1917"
            strokeWidth="0.8"
            animate={{
              d: [
                'M 46 62 Q 50 67 54 62 Z',
                'M 47 62 Q 50 64 53 62 Z',
                'M 46 62 Q 50 67 54 62 Z'
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 0.35
            }}
          />
        ) : (
          <path
            d="M 46 61 Q 50 63 50 60 Q 50 63 54 61"
            stroke="#1C1917"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Golden Shrine Bell & Red Bow Ribbon */}
        <g>
          {/* Red Ribbon */}
          <path
            d="M 42 81 Q 50 83 58 81"
            stroke="#E11D48"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Gold Bell */}
          <circle cx="50" cy="85" r="4" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
          <circle cx="50" cy="86" r="1" fill="#78350F" />
          <line x1="47.5" y1="84" x2="52.5" y2="84" stroke="#78350F" strokeWidth="0.6" />
        </g>

        {/* Sakura blossom petal on head */}
        <path
          d="M 32 32 C 30 28, 34 26, 36 29 C 38 26, 42 28, 40 32 C 38 35, 34 35, 32 32 Z"
          fill="#FDA4AF"
          opacity="0.9"
        />
        <circle cx="36" cy="30.5" r="0.8" fill="#FFF1F2" />
      </svg>
    </div>
  );
};
