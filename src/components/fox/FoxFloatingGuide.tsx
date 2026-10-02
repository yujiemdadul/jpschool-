import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Compass, Lightbulb, Volume2 } from 'lucide-react';
import { FoxAvatar } from './FoxAvatar';
import { FoxGuideModal } from './FoxGuideModal';
import { playKitsuneChime, playJapaneseAudio } from '../../utils/speech';
import { NavTab } from '../common/Navbar';
import { KanaType } from '../../types';

interface FoxFloatingGuideProps {
  onNavigate: (tab: NavTab, subLevel?: number) => void;
  onOpenLevel?: (type: KanaType, level: number) => void;
  onStartQuiz?: (course: KanaType | 'mixed', level?: number) => void;
  activeTab?: NavTab;
}

export const FoxFloatingGuide: React.FC<FoxFloatingGuideProps> = ({
  onNavigate,
  onOpenLevel,
  onStartQuiz,
  activeTab = 'home'
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [bubbleMessageIndex, setBubbleMessageIndex] = useState<number>(0);

  const bubbleTips = [
    {
      jp: 'こんにちは！',
      bn: 'হ্যালো! ওয়েবসাইট বুঝতে সমস্যা হচ্ছে? আমাকে চাপ দিয়ে গাইড দেখে নিন 🦊',
      tag: 'গাইড'
    },
    {
      jp: 'がんばって！',
      bn: 'প্রতিদিন মাত্র ১০ মিনিট অনুশীলন করলেই জাপানি বর্ণমালা সহজে আয়ত্ত হবে! ✨',
      tag: 'টিপস'
    },
    {
      jp: 'クイズに挑戦！',
      bn: 'আজকের ৫-প্রশ্নের দৈনিক কুইজ সম্পন্ন করে নিজের স্ট্রিক বাড়িয়ে নিন! 🔥',
      tag: 'কুইজ'
    },
    {
      jp: 'ひらがなから！',
      bn: 'নতুন শুরু করছেন? হিরাগানা লেভেল ১ থেকে যাত্রা শুরু করুন! 🎌',
      tag: 'শুরু'
    }
  ];

  // Rotate helpful speech bubble tip periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setBubbleMessageIndex((prev) => (prev + 1) % bubbleTips.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenGuide = () => {
    playKitsuneChime();
    setIsModalOpen(true);
    setShowBubble(false);
  };

  const handleAudioGreet = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentJp = bubbleTips[bubbleMessageIndex].jp;
    playJapaneseAudio(currentJp);
  };

  return (
    <>
      {/* Floating Mascot Widget */}
      <div 
        className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end pointer-events-none select-none"
      >
        {/* Animated Speech Bubble */}
        <AnimatePresence>
          {showBubble && !isModalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto mb-2 max-w-[260px] sm:max-w-xs bg-white dark:bg-stone-900 border border-rose-300 dark:border-rose-700/80 rounded-xl p-2.5 shadow-lg shadow-rose-950/10 relative text-left"
            >
              {/* Little Speech Triangle Pointer */}
              <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white dark:bg-stone-900 border-b border-r border-rose-300 dark:border-rose-700/80 transform rotate-45" />

              {/* Close Bubble Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBubble(false);
                }}
                id="fox-bubble-dismiss"
                className="absolute top-1.5 right-1.5 p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition cursor-pointer"
                title="বন্ধ করুন"
              >
                <X size={12} />
              </button>

              <div className="flex items-start gap-2 pr-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/80 text-[9px] font-black text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                      <Sparkles size={8} className="text-amber-500" />
                      <span>{bubbleTips[bubbleMessageIndex].tag}</span>
                    </span>
                    <span className="font-serif font-bold text-[11px] text-rose-600 dark:text-rose-400">
                      {bubbleTips[bubbleMessageIndex].jp}
                    </span>
                    <button
                      onClick={handleAudioGreet}
                      className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                      title="জাপানি শুনুন"
                    >
                      <Volume2 size={11} />
                    </button>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-stone-700 dark:text-stone-200 font-medium leading-tight mt-1">
                    {bubbleTips[bubbleMessageIndex].bn}
                  </p>
                </div>
              </div>

              {/* Action Buttons in Bubble */}
              <div className="mt-2 pt-1.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-1">
                <button
                  onClick={handleOpenGuide}
                  id="fox-bubble-open-tour"
                  className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] inline-flex items-center gap-1 transition shadow-2xs cursor-pointer"
                >
                  <Compass size={11} />
                  <span>গাইড দেখুন</span>
                </button>
                
                <span className="text-[9px] text-stone-400 dark:text-stone-500 font-medium">
                  Kitsune 🦊
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Mascot Button */}
        <motion.button
          onClick={handleOpenGuide}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          id="fox-floating-mascot-btn"
          className="pointer-events-auto relative group flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full bg-stone-900/90 hover:bg-stone-900 dark:bg-stone-850 dark:hover:bg-stone-800 text-white shadow-md shadow-rose-950/20 border border-amber-400/70 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          title="কিটসুনে সেনসেই - ওয়েবসাইট গাইড ও টিপস"
        >
          {/* Subtle halo behind avatar */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 opacity-30 blur-2xs group-hover:opacity-60 transition-opacity" />

          {/* Fox Avatar Component - now smaller */}
          <div className="relative z-10">
            <FoxAvatar size="sm" isSpeaking={isHovered} isHappy={isHovered} />
          </div>

          {/* Compact text pill on desktop */}
          <div className="hidden sm:flex flex-col items-start pr-2 relative z-10 text-left">
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 leading-none">
              Guide 🦊
            </span>
            <span className="text-[10px] font-bold text-stone-200 group-hover:text-white transition-colors leading-tight mt-0.5">
              টিপস ও সহায়তা
            </span>
          </div>
        </motion.button>
      </div>

      {/* Full Guide Modal */}
      <FoxGuideModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNavigate={onNavigate}
        onOpenLevel={onOpenLevel}
        onStartQuiz={onStartQuiz}
      />
    </>
  );
};
