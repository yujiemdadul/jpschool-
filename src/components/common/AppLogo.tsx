import React from 'react';

interface AppLogoProps {
  variant?: 'emblem' | 'full' | 'navbar';
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  variant = 'emblem',
  size = 'md',
  className = '',
  showText = true,
}) => {
  // Dimension map
  const sizeMap: Record<string, { img: string; px: number }> = {
    sm: { img: 'w-7 h-7', px: 28 },
    md: { img: 'w-10 h-10', px: 40 },
    lg: { img: 'w-16 h-16', px: 64 },
    xl: { img: 'w-24 h-24 sm:w-28 sm:h-28', px: 96 },
  };

  const currentSize = typeof size === 'number' ? { img: '', px: size } : sizeMap[size] || sizeMap.md;
  const inlineStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined;

  // Full Logo variant with emblem + text banner
  if (variant === 'full') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        {/* Crisp official logo (uses light in light mode and dark-adapted in dark mode) */}
        <div className="relative group">
          <img
            src="/logo.png"
            alt="Chandu Japanese School Logo"
            width={currentSize.px || 120}
            height={currentSize.px || 120}
            style={inlineStyle}
            className={`${typeof size !== 'number' ? currentSize.img : ''} object-contain dark:hidden drop-shadow-xs transition-transform duration-200 group-hover:scale-105`}
            referrerPolicy="no-referrer"
          />
          <img
            src="/logo-dark.png"
            alt="Chandu Japanese School Logo"
            width={currentSize.px || 120}
            height={currentSize.px || 120}
            style={inlineStyle}
            className={`${typeof size !== 'number' ? currentSize.img : ''} object-contain hidden dark:block drop-shadow-xs transition-transform duration-200 group-hover:scale-105`}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  // Navbar brand display: Circular emblem + title + subtitle
  if (variant === 'navbar') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <div className="relative shrink-0 flex items-center justify-center p-0.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs group-hover:scale-105 transition-transform duration-200 overflow-hidden">
          <img
            src="/icon.svg"
            alt="Chandu Japanese School Emblem"
            width={40}
            height={40}
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain dark:brightness-125 transition"
            referrerPolicy="no-referrer"
          />
        </div>

        {showText && (
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-stone-900 dark:text-white text-base sm:text-lg tracking-tight">
                Chandu Japanese School
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                日本語
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block font-medium">
              বাংলায় সহজে জাপানি শেখা
            </p>
          </div>
        )}
      </div>
    );
  }

  // Standalone Emblem Icon
  return (
    <div 
      style={inlineStyle}
      className={`relative inline-flex items-center justify-center shrink-0 ${typeof size !== 'number' ? currentSize.img : ''} ${className}`}
    >
      <img
        src="/icon.svg"
        alt="Chandu Japanese School Logo Emblem"
        className="w-full h-full object-contain dark:brightness-110 drop-shadow-xs"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
