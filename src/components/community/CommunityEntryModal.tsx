import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Clock, 
  Share2, 
  ArrowRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { CommunityPopupConfig, CommunityPlatform } from '../../types';
import { communityService, DEFAULT_COMMUNITY_CONFIG } from '../../services/communityService';
import confetti from 'canvas-confetti';

interface CommunityEntryModalProps {
  forceOpen?: boolean;
  onCloseCustom?: () => void;
}

// Platform-specific styling & brand icons
const renderPlatformIcon = (platform?: CommunityPlatform) => {
  switch (platform) {
    case 'facebook':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'telegram':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.942z"/>
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.508-.678-.517-.176-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.512s1.08 2.913 1.231 3.114c.15.2 2.126 3.246 5.15 4.553.719.311 1.28.497 1.718.636.723.23 1.381.197 1.902.12.58-.087 1.78-.727 2.031-1.429.251-.702.251-1.304.176-1.429-.076-.125-.276-.2-.577-.35zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.97-1.403A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'discord':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      );
    default:
      return <ExternalLink size={16} className="shrink-0" />;
  }
};

export const CommunityEntryModal: React.FC<CommunityEntryModalProps> = ({
  forceOpen = false,
  onCloseCustom
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<CommunityPopupConfig>(DEFAULT_COMMUNITY_CONFIG);
  const [snoozeFor6Hours, setSnoozeFor6Hours] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAndOpen = async () => {
      const fetchedConfig = await communityService.getPopupConfig();
      if (!mounted) return;
      setConfig(fetchedConfig);

      if (forceOpen) {
        setIsOpen(true);
        return;
      }

      // Check if popup is enabled and not snoozed
      const isEnabled = fetchedConfig.isEnabled !== false;
      const isSnoozed = communityService.isSnoozed();

      if (isEnabled && !isSnoozed) {
        // Small delay to ensure pleasant landing experience
        const timer = setTimeout(() => {
          if (mounted) {
            setIsOpen(true);
            try {
              confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.3 }
              });
            } catch {
              // ignore
            }
          }
        }, 800);
        return () => clearTimeout(timer);
      }
    };

    checkAndOpen();

    // Listen for live admin updates
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CommunityPopupConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      }
    };

    window.addEventListener('chandu_community_popup_updated', handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('chandu_community_popup_updated', handleUpdate);
    };
  }, [forceOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (snoozeFor6Hours) {
      communityService.snooze(config.snoozeHours || 6);
    }
    setIsOpen(false);
    if (onCloseCustom) {
      onCloseCustom();
    }
  };

  const handleJoinPrimary = () => {
    if (snoozeFor6Hours) {
      communityService.snooze(config.snoozeHours || 6);
    }
    if (config.primaryLinkUrl) {
      window.open(config.primaryLinkUrl, '_blank', 'noopener,noreferrer');
    }
    setIsOpen(false);
  };

  const handleJoinSecondary = () => {
    if (snoozeFor6Hours) {
      communityService.snooze(config.snoozeHours || 6);
    }
    if (config.secondaryLinkUrl) {
      window.open(config.secondaryLinkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const points = config.highlightPoints && config.highlightPoints.length > 0
    ? config.highlightPoints
    : DEFAULT_COMMUNITY_CONFIG.highlightPoints!;

  const displayImage = config.imageUrl || '/community_banner.jpg';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        id="community-entry-popup-card"
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col my-auto transition-all transform scale-100 animate-in zoom-in-95 duration-200"
      >
        {/* Top Floating Close Button */}
        <button
          type="button"
          id="btn-close-community-popup"
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md transition shadow-md cursor-pointer group"
          title="বন্ধ করুন"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Top Banner Image Container */}
        <div className="relative w-full aspect-16/9 bg-stone-900 overflow-hidden shrink-0">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-stone-800 animate-pulse flex items-center justify-center text-stone-500">
              <span className="text-xs font-bold">লোড হচ্ছে...</span>
            </div>
          )}

          {!imageError ? (
            <img
              src={displayImage}
              alt="Community Banner"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-rose-900 via-stone-900 to-amber-900 flex flex-col items-center justify-center p-6 text-center text-white">
              <span className="text-4xl mb-2">🌸</span>
              <span className="text-lg font-black font-serif">Chandu Japanese School</span>
              <span className="text-xs opacity-75">লার্নিং কমিউনিটি</span>
            </div>
          )}

          {/* Gradient Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

          {/* Floating Category Tag */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-600/90 hover:bg-rose-600 text-white backdrop-blur-md shadow-sm border border-rose-400/40">
              <Sparkles size={11} className="fill-white" />
              <span>{config.tagBn || 'অফিশিয়াল কমিউনিটি'}</span>
            </span>
          </div>

          {/* Title Over Banner Bottom */}
          <div className="absolute bottom-3 left-4 right-4 z-10">
            {config.titleJp && (
              <span className="text-[11px] font-black text-amber-300 font-serif tracking-wider uppercase drop-shadow-xs block mb-0.5">
                {config.titleJp}
              </span>
            )}
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
              {config.titleBn || 'আমাদের অফিশিয়াল জাপানিজ লার্নিং কমিউনিটিতে স্বাগতম!'}
            </h3>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Main Description */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {config.descriptionBn}
          </p>

          {/* Highlight Perks List */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Users size={14} className="text-amber-600 dark:text-amber-400" />
                <span>{config.badgeText || 'কমিউনিটিতে যা যা পাচ্ছেন:'}</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                ফ্রি অ্যাক্সেস
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Join Buttons */}
          <div className="space-y-2 pt-1">
            {/* Primary Community Link Button */}
            <button
              type="button"
              id="btn-community-join-primary"
              onClick={handleJoinPrimary}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
            >
              {renderPlatformIcon(config.primaryPlatform)}
              <span>{config.primaryLinkText || 'কমিউনিটিতে যোগ দিন 🚀'}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Optional Secondary Link Button */}
            {config.secondaryLinkUrl && (
              <button
                type="button"
                id="btn-community-join-secondary"
                onClick={handleJoinSecondary}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                {renderPlatformIcon(config.secondaryPlatform)}
                <span>{config.secondaryLinkText || 'টেলিগ্রাম চ্যানেলে যুক্ত হোন'}</span>
                <ExternalLink size={12} className="opacity-60" />
              </button>
            )}
          </div>

          {/* Bottom Bar: 6-Hour Snooze Option & Close */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            
            {/* 6 Hours Snooze Checkbox */}
            <label 
              htmlFor="checkbox-snooze-6-hours"
              className="flex items-center gap-2 cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white select-none transition"
            >
              <input
                type="checkbox"
                id="checkbox-snooze-6-hours"
                checked={snoozeFor6Hours}
                onChange={(e) => setSnoozeFor6Hours(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600 border-stone-300 dark:border-stone-700 cursor-pointer"
              />
              <span className="flex items-center gap-1 font-semibold">
                <Clock size={12} className="text-amber-500" />
                <span>{config.snoozeHours || 6} ঘণ্টার জন্য আর দেখাবেন না</span>
              </span>
            </label>

            {/* Dismiss CTA */}
            <button
              type="button"
              id="btn-dismiss-community-popup"
              onClick={handleClose}
              className="text-xs font-bold text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition underline cursor-pointer"
            >
              এখনই ওয়েবসাইটে যান
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
