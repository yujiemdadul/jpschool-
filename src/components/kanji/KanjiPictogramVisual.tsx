import React from 'react';
import { KanjiChar } from '../../types';

interface KanjiPictogramVisualProps {
  kanji: KanjiChar;
  size?: 'sm' | 'md' | 'lg';
  showEvolution?: boolean;
}

export const KanjiPictogramVisual: React.FC<KanjiPictogramVisualProps> = ({
  kanji,
  size = 'md',
  showEvolution = true
}) => {
  const { visualOrigin, character, meaningBn } = kanji;
  const pType = visualOrigin.pictogramType;

  // Render SVG illustration representing the real world object
  const renderObjectSvg = () => {
    switch (pType) {
      case 'sun':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="28" fill="#F59E0B" className="animate-pulse" />
            <circle cx="50" cy="50" r="20" fill="#FDE047" />
            <circle cx="50" cy="50" r="5" fill="#B45309" />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="50"
                y1="12"
                x2="50"
                y2="4"
                stroke="#F59E0B"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </svg>
        );

      case 'moon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <path
              d="M 58 16 A 34 34 0 1 0 58 84 A 28 28 0 0 1 58 16 Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="2"
            />
            {/* Soft cloud band across moon */}
            <path
              d="M 22 45 Q 36 38 52 46 T 82 48"
              stroke="#93C5FD"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M 28 62 Q 44 54 60 62 T 76 64"
              stroke="#93C5FD"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
        );

      case 'fire':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Outer flame */}
            <path
              d="M 50 14 C 55 30 74 44 74 65 C 74 80 63 88 50 88 C 37 88 26 80 26 65 C 26 44 45 30 50 14 Z"
              fill="#EF4444"
            />
            {/* Inner flame */}
            <path
              d="M 50 36 C 54 46 63 56 63 68 C 63 76 57 82 50 82 C 43 82 37 76 37 68 C 37 56 46 46 50 36 Z"
              fill="#FBBF24"
            />
            {/* Flying sparks */}
            <circle cx="20" cy="52" r="3.5" fill="#F97316" />
            <circle cx="80" cy="52" r="3.5" fill="#F97316" />
            <circle cx="50" cy="8" r="2.5" fill="#EF4444" />
          </svg>
        );

      case 'water':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Central stream */}
            <path
              d="M 50 12 Q 42 36 54 55 T 48 88"
              stroke="#0284C7"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Left droplets & spray */}
            <path
              d="M 28 32 Q 22 45 32 56"
              stroke="#38BDF8"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="24" cy="70" r="4" fill="#0284C7" />
            {/* Right droplets & spray */}
            <path
              d="M 72 32 Q 78 45 68 56"
              stroke="#38BDF8"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="76" cy="70" r="4" fill="#0284C7" />
          </svg>
        );

      case 'tree':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Trunk */}
            <line x1="50" y1="18" x2="50" y2="78" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
            {/* Branches */}
            <path d="M 50 42 Q 30 36 18 48" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />
            <path d="M 50 42 Q 70 36 82 48" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />
            {/* Ground line */}
            <line x1="15" y1="78" x2="85" y2="78" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
            {/* Roots */}
            <path d="M 50 78 Q 36 84 22 92" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
            <path d="M 50 78 Q 64 84 78 92" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 'mountain':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Mountain silhouette with 3 peaks */}
            <polygon points="12,82 50,18 88,82" fill="#059669" opacity="0.8" />
            <polygon points="20,82 50,18 42,82" fill="#047857" />
            <polygon points="6,82 26,45 46,82" fill="#10B981" />
            <polygon points="54,82 74,45 94,82" fill="#10B981" />
            {/* Snow caps */}
            <polygon points="50,18 43,32 57,32" fill="#FFFFFF" />
            <polygon points="26,45 21,54 31,54" fill="#FFFFFF" />
            <polygon points="74,45 69,54 79,54" fill="#FFFFFF" />
          </svg>
        );

      case 'river':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <path d="M 28 14 Q 20 45 32 86" stroke="#0284C7" strokeWidth="7" strokeLinecap="round" />
            <path d="M 50 14 Q 44 45 54 86" stroke="#0369A1" strokeWidth="8" strokeLinecap="round" />
            <path d="M 72 14 Q 66 45 76 86" stroke="#0284C7" strokeWidth="7" strokeLinecap="round" />
          </svg>
        );

      case 'ricefield':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect x="18" y="18" width="64" height="64" rx="4" fill="#84CC16" stroke="#4D7C0F" strokeWidth="6" />
            <line x1="18" y1="50" x2="82" y2="50" stroke="#4D7C0F" strokeWidth="5" />
            <line x1="50" y1="18" x2="50" y2="82" stroke="#4D7C0F" strokeWidth="5" />
            {/* Small sprout shoots in paddies */}
            <path d="M 32 36 Q 34 28 36 36 M 34 32 Q 28 30 34 26" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 66 36 Q 68 28 70 36 M 68 32 Q 62 30 68 26" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 32 68 Q 34 60 36 68 M 34 64 Q 28 62 34 58" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 66 68 Q 68 60 70 68 M 68 64 Q 62 62 68 58" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'rain':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Fluffy rain cloud */}
            <path
              d="M 28 42 A 14 14 0 0 1 54 32 A 18 18 0 0 1 82 44 A 12 12 0 0 1 76 56 L 26 56 A 12 12 0 0 1 28 42 Z"
              fill="#64748B"
            />
            {/* 4 Raindrops matching Rain Kanji dots */}
            <line x1="36" y1="64" x2="30" y2="76" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
            <line x1="48" y1="64" x2="42" y2="76" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
            <line x1="60" y1="64" x2="54" y2="76" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
            <line x1="72" y1="64" x2="66" y2="76" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'person':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Head */}
            <circle cx="50" cy="24" r="12" fill="#F43F5E" />
            {/* Two walking legs matching 人 */}
            <path d="M 50 36 Q 44 58 24 88" stroke="#F43F5E" strokeWidth="8" strokeLinecap="round" />
            <path d="M 44 54 Q 58 68 76 88" stroke="#E11D48" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 'child':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Big baby head */}
            <circle cx="50" cy="28" r="16" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="44" cy="26" r="2.5" fill="#713F12" />
            <circle cx="56" cy="26" r="2.5" fill="#713F12" />
            <path d="M 46 34 Q 50 38 54 34" stroke="#713F12" strokeWidth="2" strokeLinecap="round" />
            {/* Outstretched arms matching horizontal stroke */}
            <path d="M 16 52 L 84 52" stroke="#CA8A04" strokeWidth="7" strokeLinecap="round" />
            {/* Swaddled curved body */}
            <path d="M 50 44 Q 58 65 52 82 Q 46 90 40 86" stroke="#CA8A04" strokeWidth="7" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'woman':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Gentle head */}
            <circle cx="50" cy="20" r="11" fill="#EC4899" />
            {/* Kneeling woman graceful pose */}
            <path
              d="M 50 30 Q 32 50 36 68 Q 40 84 62 84"
              stroke="#DB2777"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Arms crossed politely */}
            <path d="M 22 55 Q 50 50 78 55" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );

      case 'mouth':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Open mouth */}
            <path
              d="M 20 44 Q 50 34 80 44 Q 84 68 50 78 Q 16 68 20 44 Z"
              fill="#F43F5E"
              stroke="#BE123C"
              strokeWidth="4"
            />
            {/* Teeth & Tongue */}
            <path d="M 28 46 Q 50 48 72 46" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="50" cy="65" rx="16" ry="8" fill="#FDA4AF" />
          </svg>
        );

      case 'eye':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Almond shaped eye rotated vertically like Kanji */}
            <path
              d="M 50 14 C 74 34 74 66 50 86 C 26 66 26 34 50 14 Z"
              fill="#FFFFFF"
              stroke="#2563EB"
              strokeWidth="5"
            />
            {/* Iris and pupil */}
            <circle cx="50" cy="50" r="18" fill="#3B82F6" />
            <circle cx="50" cy="50" r="9" fill="#1E3A8A" />
            <circle cx="46" cy="46" r="3.5" fill="#FFFFFF" />
            {/* Eyelash line */}
            <line x1="32" y1="36" x2="68" y2="36" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
            <line x1="32" y1="64" x2="68" y2="64" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'hand':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Palm and 5 fingers */}
            <path
              d="M 32 86 L 32 60 Q 32 40 40 40 Q 46 40 46 60 L 46 32 Q 46 22 52 22 Q 58 22 58 32 L 58 26 Q 58 16 64 16 Q 70 16 70 28 L 70 42 Q 70 34 76 34 Q 82 34 82 48 L 82 72 Q 82 86 64 88 Z"
              fill="#FED7AA"
              stroke="#EA580C"
              strokeWidth="3.5"
            />
          </svg>
        );

      case 'ear':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Ear outline */}
            <path
              d="M 36 22 C 60 12 80 24 80 44 C 80 62 66 68 64 74 C 62 82 50 86 42 80 C 34 74 42 66 48 66"
              stroke="#EA580C"
              strokeWidth="6"
              strokeLinecap="round"
              fill="#FFEDD5"
            />
            {/* Inner ear cartilage */}
            <path d="M 52 32 C 64 36 66 48 58 54" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'above':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <line x1="16" y1="76" x2="84" y2="76" stroke="#D97706" strokeWidth="7" strokeLinecap="round" />
            <line x1="50" y1="76" x2="50" y2="24" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
            <polygon points="50,14 38,30 62,30" fill="#F59E0B" />
          </svg>
        );

      case 'below':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <line x1="16" y1="24" x2="84" y2="24" stroke="#D97706" strokeWidth="7" strokeLinecap="round" />
            <line x1="50" y1="24" x2="50" y2="74" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
            <polygon points="50,86 38,70 62,70" fill="#F59E0B" />
          </svg>
        );

      case 'middle':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect x="22" y="30" width="56" height="40" rx="4" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="5" />
            <line x1="50" y1="12" x2="50" y2="88" stroke="#DC2626" strokeWidth="7" strokeLinecap="round" />
            <circle cx="50" cy="50" r="6" fill="#DC2626" />
          </svg>
        );

      case 'big':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Person stretching wide */}
            <circle cx="50" cy="20" r="10" fill="#4338CA" />
            <line x1="14" y1="48" x2="86" y2="48" stroke="#4F46E5" strokeWidth="8" strokeLinecap="round" />
            <path d="M 50 32 L 20 86" stroke="#4F46E5" strokeWidth="8" strokeLinecap="round" />
            <path d="M 50 32 L 80 86" stroke="#4F46E5" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 'small':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Central small hook */}
            <path d="M 50 20 L 50 72 Q 50 82 40 80" stroke="#059669" strokeWidth="7" strokeLinecap="round" fill="none" />
            {/* Two separated small droplets */}
            <circle cx="26" cy="52" r="6" fill="#10B981" />
            <circle cx="74" cy="52" r="6" fill="#10B981" />
          </svg>
        );

      case 'car':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Chariot axle & wheels from above */}
            <rect x="18" y="24" width="64" height="52" rx="4" fill="#FDE68A" stroke="#B45309" strokeWidth="5" />
            <line x1="18" y1="50" x2="82" y2="50" stroke="#B45309" strokeWidth="5" />
            <line x1="50" y1="12" x2="50" y2="88" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
            {/* Left & right wheels */}
            <rect x="10" y="32" width="8" height="36" rx="2" fill="#78350F" />
            <rect x="82" y="32" width="8" height="36" rx="2" fill="#78350F" />
          </svg>
        );

      case 'gate':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Left saloon door */}
            <rect x="16" y="20" width="30" height="60" rx="3" fill="#FED7AA" stroke="#C2410C" strokeWidth="4" />
            <line x1="16" y1="44" x2="46" y2="44" stroke="#C2410C" strokeWidth="3" />
            {/* Right saloon door */}
            <rect x="54" y="20" width="30" height="60" rx="3" fill="#FED7AA" stroke="#C2410C" strokeWidth="4" />
            <line x1="54" y1="44" x2="84" y2="44" stroke="#C2410C" strokeWidth="3" />
          </svg>
        );

      case 'fish':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Fish body */}
            <ellipse cx="50" cy="46" rx="28" ry="20" fill="#67E8F9" stroke="#0891B2" strokeWidth="4" />
            {/* Tail fin */}
            <polygon points="76,46 94,28 94,64" fill="#0891B2" />
            {/* Eye & mouth */}
            <circle cx="32" cy="42" r="4" fill="#0E7490" />
            <circle cx="31" cy="41" r="1.5" fill="#FFFFFF" />
            {/* Scales */}
            <path d="M 44 38 Q 48 46 44 54" stroke="#0891B2" strokeWidth="2.5" />
            <path d="M 54 38 Q 58 46 54 54" stroke="#0891B2" strokeWidth="2.5" />
            {/* 4 Bottom fin dots */}
            <circle cx="38" cy="74" r="3" fill="#0891B2" />
            <circle cx="48" cy="74" r="3" fill="#0891B2" />
            <circle cx="58" cy="74" r="3" fill="#0891B2" />
            <circle cx="68" cy="74" r="3" fill="#0891B2" />
          </svg>
        );

      case 'rest':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Tree */}
            <line x1="68" y1="20" x2="68" y2="82" stroke="#78350F" strokeWidth="7" strokeLinecap="round" />
            <circle cx="68" cy="28" r="18" fill="#22C55E" opacity="0.85" />
            {/* Person leaning against tree */}
            <circle cx="38" cy="40" r="9" fill="#F43F5E" />
            <path d="M 38 49 L 38 72 L 56 72" stroke="#F43F5E" strokeWidth="6" strokeLinecap="round" fill="none" />
            <line x1="38" y1="58" x2="62" y2="52" stroke="#F43F5E" strokeWidth="5" strokeLinecap="round" />
            <line x1="16" y1="82" x2="88" y2="82" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'book':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Open book pages */}
            <path
              d="M 50 78 C 36 68 18 70 14 74 L 14 30 C 18 26 36 24 50 34 C 64 24 82 26 86 30 L 86 74 C 82 70 64 68 50 78 Z"
              fill="#FEF3C7"
              stroke="#D97706"
              strokeWidth="4"
            />
            <line x1="50" y1="34" x2="50" y2="78" stroke="#B45309" strokeWidth="3" />
            <line x1="22" y1="42" x2="42" y2="42" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="22" y1="52" x2="42" y2="52" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="42" x2="78" y2="42" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="52" x2="78" y2="52" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'see':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Eye on top */}
            <rect x="32" y="16" width="36" height="42" rx="4" fill="#EFF6FF" stroke="#2563EB" strokeWidth="5" />
            <line x1="32" y1="30" x2="68" y2="30" stroke="#2563EB" strokeWidth="4" />
            <line x1="32" y1="44" x2="68" y2="44" stroke="#2563EB" strokeWidth="4" />
            <circle cx="50" cy="37" r="5" fill="#1D4ED8" />
            {/* Running feet below */}
            <path d="M 40 58 Q 32 72 22 84" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
            <path d="M 60 58 Q 66 70 78 84" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );

      case 'eat':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Roof / bowl cover */}
            <polygon points="50,14 16,42 84,42" fill="#F87171" stroke="#DC2626" strokeWidth="3" />
            {/* Steaming bowl below */}
            <path d="M 24 50 L 76 50 L 68 80 L 32 80 Z" fill="#FED7AA" stroke="#EA580C" strokeWidth="4" />
            <line x1="28" y1="84" x2="72" y2="84" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
            {/* Steam waves */}
            <path d="M 40 44 Q 44 47 40 49" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <path d="M 60 44 Q 64 47 60 49" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      default:
        // Generic fallback symbol
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect x="20" y="20" width="60" height="60" rx="12" fill="#F3E8FF" stroke="#9333EA" strokeWidth="5" />
            <circle cx="50" cy="50" r="16" fill="#A855F7" />
            <text x="50" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold">
              {character}
            </text>
          </svg>
        );
    }
  };

  const containerSizes = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-36 sm:h-36'
  };

  return (
    <div className="flex flex-col items-center">
      {showEvolution ? (
        <div className="w-full bg-linear-to-b from-stone-50 to-stone-100 dark:from-stone-800/80 dark:to-stone-900/80 border border-stone-200 dark:border-stone-700/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-2 px-1">
            <span>১. বাস্তব রূপ</span>
            <span>২. রূপান্তর সংকেত</span>
            <span>৩. আধুনিক কাঞ্জি</span>
          </div>

          <div className="grid grid-cols-5 items-center gap-1 sm:gap-2">
            {/* Step 1: Real world object illustration */}
            <div className="col-span-2 flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 shadow-xs">
              <div className={`${containerSizes[size]} flex items-center justify-center`}>
                {renderObjectSvg()}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-stone-800 dark:text-stone-200 text-center mt-1.5 leading-tight">
                {visualOrigin.realWorldObject}
              </span>
            </div>

            {/* Step 2: Evolution Arrow & Hint */}
            <div className="col-span-1 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-sm sm:text-base animate-pulse">
                ➔
              </div>
              <span className="text-[9px] sm:text-[10px] text-stone-500 dark:text-stone-400 font-semibold mt-1">
                চিত্রলিপি
              </span>
            </div>

            {/* Step 3: Modern Kanji display */}
            <div className="col-span-2 flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-stone-800 border-2 border-rose-500/30 dark:border-rose-500/40 shadow-xs">
              <div className={`${containerSizes[size]} flex items-center justify-center`}>
                <span className="text-4xl sm:text-5xl font-black text-rose-600 dark:text-rose-400 font-serif">
                  {character}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-rose-700 dark:text-rose-300 text-center mt-1.5">
                {meaningBn}
              </span>
            </div>
          </div>

          {/* Transformation explanation hint */}
          <div className="mt-3.5 pt-3 border-t border-stone-200/60 dark:border-stone-700/60 text-xs text-stone-600 dark:text-stone-300 flex items-start gap-2">
            <span className="text-sm">💡</span>
            <p className="leading-relaxed">
              <strong className="text-stone-800 dark:text-stone-100">চিত্রের কৌশল: </strong>
              {visualOrigin.transformationHint}
            </p>
          </div>
        </div>
      ) : (
        <div className={`${containerSizes[size]} p-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs`}>
          {renderObjectSvg()}
        </div>
      )}
    </div>
  );
};
