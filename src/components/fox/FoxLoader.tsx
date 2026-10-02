import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { FoxAvatar } from './FoxAvatar';
import { playKitsuneChime } from '../../utils/speech';

interface FoxLoaderProps {
  message?: string;
  subMessage?: string;
  showPetals?: boolean;
  interactive?: boolean;
  size?: 'md' | 'lg' | 'xl';
  durationMs?: number;
  onComplete?: () => void;
}

const JAPANESE_LOAD_GREETINGS = [
  { jp: 'ようこそ！', bn: 'স্বাগতম! প্রস্তুত হোন...', romaji: 'Youkoso!' },
  { jp: 'がんばって！', bn: 'পরিশ্রম করুন, সাফল্য আসবেই!', romaji: 'Ganbatte!' },
  { jp: '日本語を学ぼう！', bn: 'চলুন সহজে জাপানি শিখি!', romaji: 'Nihongo o manabou!' },
  { jp: 'きつね先生参上！', bn: 'কিটসুনে সেনসেই আপনার সাথে আছে!', romaji: 'Kitsune Sensei sanjou!' },
  { jp: '準備完了！', bn: 'যাত্রা শুরু হতে যাচ্ছে...', romaji: 'Junbi kanryou!' }
];

export const FoxLoader: React.FC<FoxLoaderProps> = ({
  message = 'চান্দু জাপানিজ স্কুল লোড হচ্ছে...',
  subMessage = 'স্মার্ট ও সহজ উপায়ে হিরাগানা এবং কাতাকানা শিখুন',
  showPetals = true,
  interactive = true,
  size = 'lg',
  durationMs = 5000,
  onComplete
}) => {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [progress, setProgress] = useState(0);

  // 5-second progress calculation & greeting rotation
  useEffect(() => {
    const stepInterval = 50; // update progress every 50ms
    const totalSteps = durationMs / stepInterval;
    let stepCount = 0;

    const progressTimer = setInterval(() => {
      stepCount++;
      const currentPct = Math.min(100, Math.round((stepCount / totalSteps) * 100));
      setProgress(currentPct);

      // Rotate greetings across 5 stages throughout the 5 seconds
      const nextIndex = Math.min(
        JAPANESE_LOAD_GREETINGS.length - 1,
        Math.floor((currentPct / 100) * JAPANESE_LOAD_GREETINGS.length)
      );
      setGreetingIndex(nextIndex);

      if (stepCount >= totalSteps) {
        clearInterval(progressTimer);
        if (onComplete) {
          onComplete();
        }
      }
    }, stepInterval);

    return () => clearInterval(progressTimer);
  }, [durationMs, onComplete]);

  const handleFoxClick = () => {
    if (!interactive) return;
    setIsWaving(true);
    setShowHeart(true);
    playKitsuneChime();
    setTimeout(() => setIsWaving(false), 1500);
    setTimeout(() => setShowHeart(false), 1800);
  };

  const currentGreeting = JAPANESE_LOAD_GREETINGS[greetingIndex];

  return (
    <div className="relative flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Floating Sakura Petals Background Animation */}
      {showPetals && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-tr-xl rounded-bl-xl bg-gradient-to-br from-rose-300/40 to-pink-400/20 backdrop-blur-2xs"
              style={{
                left: `${10 + (i * 11) % 85}%`,
                top: `${(i * 13) % 80}%`,
              }}
              animate={{
                y: [0, 45, 90],
                x: [0, (i % 2 === 0 ? 15 : -15), (i % 2 === 0 ? -10 : 20)],
                rotate: [0, 180, 360],
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Glow Halo */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-rose-600/25 via-amber-500/20 to-orange-500/25 blur-2xl pointer-events-none"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.4, 0.75, 0.4]
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut'
        }}
      />

      {/* Fox Character Container with Hover & Bounce */}
      <div 
        onClick={handleFoxClick}
        className={`relative group ${interactive ? 'cursor-pointer' : ''}`}
        title="ক্লিক করে কিটসুনে ফক্সকে হ্যালো বলুন!"
      >
        {/* Heart Pop on click */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1.4, y: -40 }}
              exit={{ opacity: 0, scale: 0.5, y: -60 }}
              className="absolute -top-4 right-2 text-rose-500 z-30 pointer-events-none"
            >
              <Heart size={24} className="fill-rose-500 text-rose-500 drop-shadow-md" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orbiting Sparkle Star */}
        <motion.div
          className="absolute -top-1 -right-1 text-amber-400 z-20 pointer-events-none"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: 'linear'
          }}
        >
          <Sparkles size={18} className="fill-amber-300 drop-shadow-sm" />
        </motion.div>

        {/* Mascot Body with Floating/Breathing Animation */}
        <motion.div
          animate={
            isWaving
              ? {
                  y: [0, -12, 0, -8, 0],
                  rotate: [0, -8, 8, -4, 0],
                  scale: [1, 1.1, 1]
                }
              : {
                  y: [0, -7, 0],
                  rotate: [-1.5, 1.5, -1.5],
                  scale: [1, 1.02, 1]
                }
          }
          transition={{
            repeat: isWaving ? 1 : Infinity,
            duration: isWaving ? 0.8 : 2.6,
            ease: 'easeInOut'
          }}
          className="relative z-10"
        >
          <FoxAvatar 
            size={size} 
            isSpeaking={true} 
            isHappy={true} 
            className="filter drop-shadow-lg"
          />
        </motion.div>
      </div>

      {/* Dynamic Japanese Speech Bubble */}
      <motion.div
        key={greetingIndex}
        initial={{ opacity: 0, y: 6, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.92 }}
        transition={{ duration: 0.3 }}
        className="mt-4 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-stone-850/80 backdrop-blur-md border border-rose-400/30 text-xs font-bold text-rose-300 shadow-lg inline-flex items-center gap-2"
      >
        <span className="text-amber-400 font-serif text-sm">
          {currentGreeting.jp}
        </span>
        <span className="text-[11px] text-stone-200">
          ({currentGreeting.romaji})
        </span>
      </motion.div>

      {/* Main Title & Subtitle */}
      <div className="mt-4 max-w-sm">
        <h3 className="text-base sm:text-lg font-black tracking-tight text-stone-100">
          {message}
        </h3>
        <p className="text-xs text-rose-300/80 font-medium mt-1">
          {currentGreeting.bn || subMessage}
        </p>
      </div>

      {/* 5-Second Animated Progress Bar */}
      <div className="w-64 max-w-xs mt-5 space-y-2">
        <div className="w-full bg-stone-900/80 rounded-full h-2 p-0.5 border border-rose-900/40 overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-600 via-amber-500 to-rose-500 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 px-1">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>প্রস্তুতি চলছে...</span>
          </span>
          <span className="text-amber-400 font-mono">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
