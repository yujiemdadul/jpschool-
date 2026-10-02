import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { InstallGuideModal } from './InstallGuideModal';

export const PWAInstallButton: React.FC<{ className?: string; label?: string }> = ({ 
  className = '', 
  label = 'অ্যাপ ইনস্টল' 
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        id="btn-pwa-install-nav"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 ${className}`}
        title="অ্যাপটি ডাউনলোড করে আপনার হোম পেজে রাখুন"
      >
        <Download size={14} className="text-rose-500 shrink-0" />
        <span className="whitespace-nowrap">{label}</span>
      </button>

      <InstallGuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
      />
    </>
  );
};
