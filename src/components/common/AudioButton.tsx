import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { playJapaneseAudio, isSpeechSupported, isPronunciationSoundEnabled } from '../../utils/speech';

interface AudioButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showText?: boolean;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  className = '',
  size = 'md',
  label = 'শুনুন',
  showText = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const supported = isSpeechSupported();
  const soundEnabled = isPronunciationSoundEnabled();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!supported) return;

    if (!soundEnabled) {
      // Still attempt play (or speech utility will handle gracefully)
    }

    setIsPlaying(true);
    playJapaneseAudio(text, () => {
      setIsPlaying(false);
    });
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="অডিও প্লেয়ার ব্রাউজারে অনুপলব্ধ"
        className={`inline-flex items-center justify-center rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed ${sizeClasses[size]} ${className}`}
      >
        <VolumeX size={iconSizes[size]} />
        {showText && <span>অডিও নেই</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      id={`audio-btn-${text}`}
      onClick={handlePlay}
      aria-label={`উচ্চারণ শুনুন: ${text}`}
      title={!soundEnabled ? 'প্রোফাইলে উচ্চারণ অডিও নিঃশব্দ (Muted) করা আছে' : `উচ্চারণ শুনুন: ${text}`}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 active:scale-95 cursor-pointer ${
        isPlaying
          ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
          : !soundEnabled
            ? 'bg-stone-100 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-750'
            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60'
      } ${sizeClasses[size]} ${className}`}
    >
      {!soundEnabled ? (
        <VolumeX size={iconSizes[size]} className="text-stone-400" />
      ) : (
        <Volume2
          size={iconSizes[size]}
          className={isPlaying ? 'animate-pulse text-white' : 'text-rose-600 dark:text-rose-400'}
        />
      )}
      {showText && <span>{isPlaying ? 'বলছে...' : !soundEnabled ? 'নিঃশব্দ' : label}</span>}
    </button>
  );
};
