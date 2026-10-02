import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setIsDismissed(false);
    } else if (wasOffline) {
      setShowReconnected(true);
      setIsDismissed(false);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <AnimatePresence mode="wait">
      {showReconnected ? (
        <motion.div
          key="online-reconnected-banner"
          id="online-reconnected-banner"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden w-full bg-emerald-600 text-white shadow-xs border-b border-emerald-500"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <motion.div
                initial={{ scale: 0.8, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="shrink-0"
              >
                <CheckCircle2 size={16} className="text-emerald-100" />
              </motion.div>
              <span className="font-bold truncate text-white">
                ইন্টারনেট পুনঃসংযুক্ত হয়েছে — অনলাইন মোড সক্রিয়।
              </span>
            </div>
            <button
              type="button"
              id="btn-close-reconnected-banner"
              onClick={() => setShowReconnected(false)}
              className="p-1 rounded-md hover:bg-emerald-700/80 active:bg-emerald-800 transition cursor-pointer text-emerald-100 hover:text-white shrink-0"
              aria-label="বন্ধ করুন"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      ) : !isOnline && !isDismissed ? (
        <motion.div
          key="offline-status-banner"
          id="offline-status-banner"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, height: 0, y: -12 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -12 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden w-full bg-stone-900/95 dark:bg-stone-900 text-stone-100 border-b border-rose-500/40 shadow-xs backdrop-blur-xs"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center shrink-0"
              >
                <WifiOff size={16} className="text-rose-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              </motion.div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-rose-400 shrink-0">
                  অফলাইন মোড সক্রিয়:
                </span>
                <span className="text-stone-300 leading-snug">
                  ইন্টারনেট সংযোগ নেই — ক্যাশ থেকে হিরাগানা ও কাতাকানা স্বাভাবিকভাবে অনুশীলন করতে পারবেন।
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="btn-dismiss-offline-banner"
                onClick={() => setIsDismissed(true)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 border border-stone-700/80 shadow-xs"
                title="নোটিফিকেশন বন্ধ করুন"
                aria-label="নোটিফিকেশন বন্ধ করুন"
              >
                <span>বুঝেছি</span>
                <X size={13} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

