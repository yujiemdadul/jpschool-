import React, { useState } from 'react';
import { Download, Smartphone, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { InstallGuideModal } from '../common/InstallGuideModal';

export const HomeInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('chandu_home_install_banner_dismissed') === 'true';
  });

  // If running inside standalone app, don't show the install banner
  if (isInstalled || isDismissed) {
    return (
      <>
        {isModalOpen && (
          <InstallGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </>
    );
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('chandu_home_install_banner_dismissed', 'true');
    } catch {}
  };

  const handleAction = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div 
        id="home-pwa-install-banner" 
        className="relative overflow-hidden rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-linear-to-r from-rose-500 via-rose-600 to-orange-500 p-4 sm:p-5 text-white shadow-md shadow-rose-500/10"
      >
        {/* Decorative circle glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none blur-xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            {/* Official App Logo Icon */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white/60 bg-white flex items-center justify-center">
              <img 
                src="/pwa-192x192.png" 
                alt="Chandu Japanese School Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-black text-rose-600 text-2xl font-serif pointer-events-none -z-10">
                日
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-base sm:text-lg leading-tight tracking-tight text-white">
                  Chandu Japanese School
                </h4>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                  <Sparkles size={11} />
                  হোম পেজ অ্যাপ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-100 leading-relaxed max-w-xl">
                চান্দু জাপানিজ স্কুল অ্যাপটি ফোনে ডাউনলোড করে হোম পেজে রাখুন — কোনো প্লে-স্টোর ছাড়াই যেকোনো সময় অফলাইনে প্র্যাকটিস করুন!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            <button
              type="button"
              id="btn-home-install-action"
              onClick={handleAction}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Download size={16} className="stroke-[2.5]" />
              <span>{isInstallable ? 'অ্যাপ ডাউনলোড করুন' : 'হোম পেজে সেভ করার নিয়ম'}</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="লুকান"
              title="এই ব্যানারটি লুকান"
              className="p-2 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      <InstallGuideModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
