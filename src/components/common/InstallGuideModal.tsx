import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Laptop, 
  Download, 
  Check, 
  Sparkles, 
  Share2, 
  PlusSquare, 
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : 'android'
  );
  const [installing, setInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    setInstalling(true);
    try {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-rose-200 dark:border-rose-800 bg-white flex items-center justify-center">
              <img 
                src="/pwa-192x192.png" 
                alt="Chandu Japanese School Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-black text-rose-600 text-xl font-serif pointer-events-none -z-10">
                日
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white leading-tight">
                Chandu Japanese School
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                চান্দু জাপানিজ স্কুল • হোম পেজ অ্যাপ ডাউনলোড
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          
          {/* Direct Install CTA (if browser triggered beforeinstallprompt) */}
          {isInstallable && !isInstalled && (
            <div className="p-4 rounded-2xl bg-linear-to-r from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/30 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                  <Sparkles size={14} />
                  <span>১-ট্যাপে সরাসরি ইনস্টল</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  আপনার ব্রাউজার সরাসরি ডাউনলোড সাপোর্ট করছে
                </p>
              </div>

              <button
                type="button"
                onClick={handleDirectInstall}
                disabled={installing}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {installSuccess ? (
                  <>
                    <Check size={16} />
                    <span>ইনস্টল সফল!</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>{installing ? 'ডাউনলোড হচ্ছে...' : 'Chandu Japanese School ইনস্টল করুন'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* App Home Screen Icon & Name Live Preview */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60 flex items-center gap-4">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-700 bg-white flex items-center justify-center">
                <img 
                  src="/pwa-192x192.png" 
                  alt="Chandu Japanese School Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 tracking-tight text-center max-w-[90px] truncate">
                Chandu JP
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>সঠিক লোগো ও নাম সহ সেভ হবে</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                ইনস্টল করার পর আপনার ফোনের হোম স্ক্রিনে <strong className="text-stone-700 dark:text-stone-200">Chandu Japanese School</strong> এর অফিসিয়াল লোগো সহ অ্যাপটি সরাসরি যুক্ত হবে।
              </p>
            </div>
          </div>

          {/* Benefits pills */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
              <div className="text-sm font-black text-rose-600 dark:text-rose-400">0 MB</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">প্লেস্টোর ছাড়াই</div>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">অফলাইন</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">নেট ছাড়াও পড়া যাবে</div>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
              <div className="text-sm font-black text-amber-600 dark:text-amber-400">১-ট্যাপ</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">হোম স্ক্রিন লঞ্চ</div>
            </div>
          </div>

          {/* Platform Tabs */}
          <div>
            <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
              আপনার ডিভাইস সিলেক্ট করুন:
            </div>
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Smartphone size={14} />
                <span>অ্যান্ড্রয়েড</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Smartphone size={14} />
                <span>আইফোন / iOS</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Laptop size={14} />
                <span>কম্পিউটার / PC</span>
              </button>
            </div>
          </div>

          {/* Guide Steps based on active tab */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
            {activeTab === 'android' && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ১
                  </span>
                  <div className="text-xs text-stone-700 dark:text-stone-200">
                    Chrome ব্রাউজারের উপরে ডানপাশে <strong>৩-ডট (⋮)</strong> মেনু বাটনে ট্যাপ করুন।
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ২
                  </span>
                  <div className="text-xs text-stone-700 dark:text-stone-200">
                    তালিকা থেকে <strong>"Install app"</strong> অথবা <strong>"Add to Home screen" (হোম স্ক্রিনে যোগ করুন)</strong> সিলেক্ট করুন।
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ৩
                  </span>
                  <div className="text-xs text-stone-700 dark:text-stone-200">
                    পপ-আপে <strong>"Install"</strong> চাপুন। আপনার ফোনের হোম পেজে সুন্দর আইকন সহ অ্যাপটি সেভ হয়ে যাবে!
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ios' && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ১
                  </span>
                  <div className="text-xs text-stone-700 dark:text-stone-200 flex items-center gap-1 flex-wrap">
                    Safari ব্রাউজারের নিচে <strong>Share (শেয়ার)</strong> বাটনে ট্যাপ করুন।
                    <Share2 size={13} className="text-rose-500 inline" />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ২
                  </span>
                  <div className="text-xs text-stone-700 dark:text-stone-200 flex items-center gap-1 flex-wrap">
                    নিচে স্ক্রোল করে <strong>"Add to Home Screen"</strong> বেছে নিন।
                    <PlusSquare size={13} className="text-rose-500 inline" />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ৩
                  </span>
                  <div className="text-xs text-stone-700 dark:text-stone-200">
                    উপরে ডানপাশে <strong>"Add"</strong> বাটনে ট্যাপ করুন। ব্যস, iPhone / iPad এর হোম স্ক্রিনে চলে আসবে!
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'desktop' && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ১
                  </span>
                  <div className="text-xs text-stone-700 dark:text-stone-200">
                    Chrome বা Edge ব্রাউজারের অ্যাড্রেস বারের ডানপাশে <strong>ইনস্টল আইকন (⤓)</strong> দেখতে পাবেন।
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ২
                  </span>
                  <div className="text-xs text-stone-700 dark:text-stone-200">
                    সেখানে ক্লিক করে <strong>"Install"</strong> চাপুন। অথবা ৩-ডট মেনু থেকে <strong>"Save and share" &gt; "Install Chandu Japanese School"</strong> সিলেক্ট করুন।
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ৩
                  </span>
                  <div className="text-xs text-stone-700 dark:text-stone-200">
                    কম্পিউটারের ডেস্কটপ এবং স্টার্ট মেন্যুতে আলাদা উইন্ডো অ্যাপ হিসেবে যুক্ত হবে।
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>হোম স্ক্রিনে রাখলে কোনো ব্রাউজার বার থাকবে না</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition cursor-pointer"
          >
            বুঝেছি
          </button>
        </div>
      </div>
    </div>
  );
};
