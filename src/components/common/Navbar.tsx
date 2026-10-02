import React from 'react';
import { 
  Home, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  TrendingUp, 
  Trophy,
  Sun, 
  Moon, 
  LogOut, 
  Flame, 
  Zap, 
  User as UserIcon,
  LogIn,
  RotateCcw,
  Sparkles,
  WifiOff,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { PWAInstallButton } from './PWAInstallButton';
import { StreakCounter } from './StreakCounter';
import { userService } from '../../services/userService';
import { AppLogo } from './AppLogo';

export type NavTab = 'home' | 'hiragana' | 'katakana' | 'kanji' | 'quiz' | 'mistakes' | 'pdf' | 'leaderboard' | 'progress' | 'profile';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuthModal
}) => {
  const { userProfile, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isOnline = useOnlineStatus();

  const activeMistakesCount = userService.getActiveMistakes(userProfile).length;

  const navItems = [
    { id: 'home' as NavTab, label: 'হোম', icon: Home, jp: 'ホーム' },
    { id: 'hiragana' as NavTab, label: 'হিরাগানা', icon: BookOpen, jp: 'ひらがな' },
    { id: 'katakana' as NavTab, label: 'কাতাকানা', icon: Layers, jp: 'カタカナ' },
    { id: 'kanji' as NavTab, label: 'কাঞ্জি (N5)', icon: Sparkles, jp: '漢字' },
    { id: 'quiz' as NavTab, label: 'কুইজ', icon: HelpCircle, jp: 'クイズ' },
    { id: 'pdf' as NavTab, label: 'PDF বই', icon: FileText, jp: '資料' },
    { 
      id: 'mistakes' as NavTab, 
      label: 'ভুল খাতা', 
      icon: RotateCcw, 
      jp: '復習',
      badge: activeMistakesCount > 0 ? activeMistakesCount : undefined
    },
    { id: 'leaderboard' as NavTab, label: 'লিডারবোর্ড', icon: Trophy, jp: '順位' },
    { id: 'progress' as NavTab, label: 'প্রগ্রেস', icon: TrendingUp, jp: '進捗' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer group select-none"
        >
          <AppLogo variant="navbar" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                  isActive
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-rose-600 dark:text-rose-400' : 'text-stone-400'} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black leading-none animate-pulse">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-rose-600 dark:bg-rose-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & User Stats */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {!isOnline && (
            <div 
              title="ইন্টারনেট সংযোগ নেই — অফলাইন মোড সক্রিয়"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/80 text-rose-700 dark:text-rose-400 text-xs font-bold shrink-0 animate-pulse"
            >
              <WifiOff size={13} className="shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="hidden sm:inline">অফলাইন</span>
            </div>
          )}

          <PWAInstallButton className="hidden sm:inline-flex" />

          {userProfile && (
            <>
              {/* Streak Badge with Keyframe Fire & Sparkle Animation */}
              <StreakCounter
                streak={userProfile.streak}
                isGoalCompleted={userService.isDailyGoalCompletedToday(userProfile)}
                variant="badge"
              />

              {/* XP Badge */}
              <div 
                title={`${userProfile.xp} মোট এক্সপি পয়েন্ট`}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 text-xs font-bold"
              >
                <Zap size={14} className="fill-amber-500 text-amber-500" />
                <span>{userProfile.xp} XP</span>
              </div>
            </>
          )}

          {/* Dark Mode Toggle */}
          <button
            type="button"
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* User Profile or Login CTA */}
          {userProfile ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="user-profile-btn"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border transition ${
                  activeTab === 'profile'
                    ? 'border-rose-400 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs relative">
                  {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                  {isAdmin && (
                    <span className="absolute -top-1 -right-1 text-[10px]" title="এডমিন">👑</span>
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold max-w-28 truncate leading-tight">
                    {userProfile.displayName}
                  </span>
                  {isAdmin && (
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 leading-none">
                      এডমিন
                    </span>
                  )}
                </div>
              </button>

              <button
                type="button"
                id="logout-btn"
                onClick={logout}
                title="লগআউট"
                className="p-2 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="login-cta-btn"
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs sm:text-sm hover:bg-rose-700 active:scale-95 transition shadow-xs"
            >
              <LogIn size={15} />
              <span>লগইন</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
