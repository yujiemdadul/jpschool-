import React from 'react';
import { Home, BookOpen, Layers, Sparkles, HelpCircle, Trophy, TrendingUp, RotateCcw, FileText } from 'lucide-react';
import { NavTab } from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAuthModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuthModal
}) => {
  const { userProfile } = useAuth();

  const activeMistakesCount = userService.getActiveMistakes(userProfile).length;

  const navItems = [
    { id: 'home' as NavTab, label: 'হোম', icon: Home },
    { id: 'hiragana' as NavTab, label: 'হিরাগানা', icon: BookOpen },
    { id: 'katakana' as NavTab, label: 'কাতাকানা', icon: Layers },
    { id: 'kanji' as NavTab, label: 'কাঞ্জি', icon: Sparkles },
    { id: 'quiz' as NavTab, label: 'কুইজ', icon: HelpCircle },
    { id: 'pdf' as NavTab, label: 'PDF বই', icon: FileText },
    { id: 'mistakes' as NavTab, label: 'ভুল খাতা', icon: RotateCcw, badge: activeMistakesCount },
    { id: 'leaderboard' as NavTab, label: 'লিডারবোর্ড', icon: Trophy },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 pb-safe">
      <div className="grid grid-cols-8 h-16 max-w-lg mx-auto items-center px-0.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all ${isActive ? 'bg-rose-50 dark:bg-rose-950/60' : ''}`}>
                <Icon size={17} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-rose-600 text-white rounded-full text-[8px] font-black leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[8px] tracking-tight leading-none mt-0.5 truncate max-w-[48px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
