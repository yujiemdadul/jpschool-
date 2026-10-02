import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Code2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { FoxAvatar } from '../fox/FoxAvatar';
import { AppLogo } from '../common/AppLogo';
import { motion, AnimatePresence } from 'motion/react';
import { playKitsuneChime } from '../../utils/speech';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register' | 'forgot';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess
}) => {
  const { loginWithEmail, registerWithEmail } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          throw new Error('অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড উভয়ই প্রদান করুন।');
        }
        await loginWithEmail(email.trim(), password);
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'register') {
        if (!name.trim()) {
          throw new Error('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
        }
        if (!email.trim()) {
          throw new Error('অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন।');
        }
        if (password.length < 6) {
          throw new Error('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।');
        }
        await registerWithEmail(name.trim(), email.trim(), password);
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          throw new Error('পাসওয়ার্ড রিসেটের জন্য ইমেইল ঠিকানা প্রয়োজন।');
        }
        await authService.resetPassword(email.trim());
        setSuccessMsg('আপনার ইমেইলে পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে।');
      }
    } catch (err: unknown) {
      const msg = (err as Error)?.message || 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="auth-modal"
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 my-auto transition-all"
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="বন্ধ করুন"
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Brand Title & Fox Mascot Header */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -6, 6, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playKitsuneChime()}
              className="cursor-pointer relative"
              title="কিটসুনে ফক্সকে হ্যালো বলুন!"
            >
              <FoxAvatar 
                size="md" 
                isSpeaking={isLoading} 
                isHappy={mode === 'register' || showPassword}
                className="filter drop-shadow-md"
              />
              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 text-amber-400"
              >
                <Sparkles size={14} className="fill-amber-400" />
              </motion.span>
            </motion.div>

            <div className="text-left flex items-center gap-2">
              <div className="p-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0">
                <AppLogo variant="emblem" size={24} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white leading-tight">
                  চান্দু জাপানিজ স্কুল
                </h2>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                  Kitsune Sensei এর সাথে শিখুন 🌸
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Fox Speech Bubble */}
          <motion.div 
            key={mode}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300"
          >
            <span>🦊</span>
            <span>
              {mode === 'login' 
                ? 'ようこそ！ লগইন করে আপনার স্ট্রিক চালিয়ে নিন 🔥' 
                : mode === 'register' 
                  ? 'স্বাগতম! নতুন ফ্রি একাউন্ট দিয়ে যাত্রা শুরু করুন ✨' 
                  : 'পাসওয়ার্ড ভুলে গেছেন? ইমেইলে রিসেট লিঙ্ক পাঠাচ্ছি 💌'}
            </span>
          </motion.div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-stone-100 dark:bg-stone-800/80 p-1 mb-6 border border-stone-200/60 dark:border-stone-700/60">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            লগইন
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              mode === 'register'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            নতুন একাউন্ট
          </button>
          <button
            type="button"
            onClick={() => { setMode('forgot'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              mode === 'forgot'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            রিকভারি
          </button>
        </div>

        {/* Error / Success messages */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-start gap-2">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                আপনার পুরো নাম
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              ইমেইল ঠিকানা
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  পাসওয়ার্ড
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-auth-submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>প্রসেস হচ্ছে...</span>
              </span>
            ) : mode === 'login' ? (
              <><span>লগইন করুন</span><ArrowRight size={16} /></>
            ) : mode === 'register' ? (
              <><span>অ্যাকাউন্ট তৈরি করুন</span><Sparkles size={16} /></>
            ) : (
              <span>পাসওয়ার্ড রিসেট লিংক পাঠান</span>
            )}
          </button>
        </form>

        {/* Developer Info Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 text-center">
          <a
            href="https://uchihaemdadul.bio.link/"
            target="_blank"
            rel="noopener noreferrer"
            id="auth-modal-dev-link"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition cursor-pointer"
          >
            <Code2 size={13} className="text-rose-500 shrink-0" />
            <span>Developer: <strong className="font-bold text-stone-700 dark:text-stone-300">uchihaemdadul</strong></span>
            <ExternalLink size={11} className="shrink-0" />
          </a>
        </div>

      </div>
    </div>
  );
};

