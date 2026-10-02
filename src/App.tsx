import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar, NavTab } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { CourseView } from './components/courses/CourseView';
import { KanjiView } from './components/kanji/KanjiView';
import { LevelDetailModal } from './components/courses/LevelDetailModal';
import { QuizSession } from './components/quiz/QuizSession';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { ProgressDashboard } from './components/progress/ProgressDashboard';
import { ProfilePage } from './components/profile/ProfilePage';
import { LandingPage } from './components/auth/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { FoxFloatingGuide } from './components/fox/FoxFloatingGuide';
import { FoxLoader } from './components/fox/FoxLoader';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PWAInstallButton } from './components/common/PWAInstallButton';
import { AppLogo } from './components/common/AppLogo';
import { KanaType } from './types';
import { validateKanaData } from './utils/dataValidator';
import { checkAndTriggerDailyReminder } from './services/reminderService';
import { Code2, ExternalLink, Sun, Moon } from 'lucide-react';
import { MistakesView } from './components/mistakes/MistakesView';
import { PdfLibraryView } from './components/pdf/PdfLibraryView';
import { CommunityEntryModal } from './components/community/CommunityEntryModal';
import { useTheme } from './context/ThemeContext';

const MainAppContent: React.FC = () => {
  const { userProfile, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [splashLoading, setSplashLoading] = useState<boolean>(true);
  const [forceCommunityPreview, setForceCommunityPreview] = useState<boolean>(false);

  // Fast loading splash: dismiss as soon as auth is ready or max 300ms
  useEffect(() => {
    if (!loading) {
      setSplashLoading(false);
    } else {
      const timer = setTimeout(() => {
        setSplashLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Instant website and data update listener: checks server build version and content updates
  useEffect(() => {
    let lastBuildTime: number | null = null;
    let lastDataUpdateTime: number | null = null;

    const checkAppVersion = async () => {
      try {
        const res = await fetch(`/api/version?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            // 1. Detect new app build / deployment: reload page immediately
            if (data.buildTime) {
              const savedBuild = localStorage.getItem('chandu_app_build_version');
              if (savedBuild && String(data.buildTime) !== savedBuild) {
                console.log('⚡ New website update deployed on server, refreshing immediately...');
                localStorage.setItem('chandu_app_build_version', String(data.buildTime));
                window.location.reload();
                return;
              }
              localStorage.setItem('chandu_app_build_version', String(data.buildTime));

              if (lastBuildTime !== null && data.buildTime !== lastBuildTime) {
                console.log('⚡ New website update detected from server, reloading instantly...');
                window.location.reload();
                return;
              }
              lastBuildTime = data.buildTime;
            }

            // 2. Detect content updates (PDF library, data changes): dispatch live update event
            if (data.dataUpdateTime) {
              if (lastDataUpdateTime !== null && data.dataUpdateTime > lastDataUpdateTime) {
                console.log('⚡ Content update detected, syncing live views...');
                window.dispatchEvent(new CustomEvent('chandu_data_updated', { detail: data }));
              }
              lastDataUpdateTime = data.dataUpdateTime;
            }
          }
        }
      } catch {
        // network offline, ignore
      }
    };

    checkAppVersion();

    // Check whenever tab is re-focused
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAppVersion();
      }
    };
    window.addEventListener('focus', checkAppVersion);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Poll every 4 seconds for fast real-time synchronization
    const interval = setInterval(checkAppVersion, 4 * 1000);

    return () => {
      window.removeEventListener('focus', checkAppVersion);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  // Global tab navigation event listener
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<NavTab>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    const handleOpenCommunity = () => {
      setForceCommunityPreview(true);
    };
    window.addEventListener('chandu_navigate_tab', handleNav);
    window.addEventListener('chandu_open_community_popup_preview', handleOpenCommunity);
    return () => {
      window.removeEventListener('chandu_navigate_tab', handleNav);
      window.removeEventListener('chandu_open_community_popup_preview', handleOpenCommunity);
    };
  }, []);

  // Level Detail Modal State
  const [levelModal, setLevelModal] = useState<{
    isOpen: boolean;
    type: KanaType;
    level: number;
    initialStep?: 1 | 2 | 3 | 4;
  }>({
    isOpen: false,
    type: 'hiragana',
    level: 1,
    initialStep: 1
  });

  // Quiz state
  const [quizConfig, setQuizConfig] = useState<{
    course: KanaType | 'mixed';
    level?: number;
  }>({
    course: 'hiragana',
    level: undefined
  });

  // Validate all Kana datasets at runtime startup
  useEffect(() => {
    validateKanaData();
  }, []);

  // Check if first-time user or newly logged-in user needs goal onboarding prompt
  useEffect(() => {
    if (userProfile && !userProfile.isGuest) {
      const isDismissed = 
        localStorage.getItem(`onboarding_dismissed_${userProfile.uid}`) ||
        localStorage.getItem('onboarding_modal_dismissed_session');
      if (!userProfile.hasCompletedGoalOnboarding && !isDismissed) {
        setIsOnboardingOpen(true);
      }
    }
  }, [userProfile?.uid, userProfile?.hasCompletedGoalOnboarding]);

  // Periodic watcher for Daily Study Reminder via Notification API
  useEffect(() => {
    if (!userProfile?.studyReminderEnabled) return;

    // Check on mount or time change
    checkAndTriggerDailyReminder(
      userProfile.studyReminderEnabled,
      userProfile.studyReminderTime,
      userProfile.streak
    );

    // Recheck every 30 seconds
    const interval = setInterval(() => {
      checkAndTriggerDailyReminder(
        userProfile.studyReminderEnabled,
        userProfile.studyReminderTime,
        userProfile.streak
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [userProfile?.studyReminderEnabled, userProfile?.studyReminderTime, userProfile?.streak]);

  const handleOpenLevelModal = (type: KanaType, level: number, initialStep: 1 | 2 | 3 | 4 = 1) => {
    setLevelModal({
      isOpen: true,
      type,
      level,
      initialStep
    });
  };

  const handleCloseLevelModal = () => {
    setLevelModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleStartQuiz = (course: KanaType | 'mixed', level?: number) => {
    setQuizConfig({ course, level });
    setActiveTab('quiz');
  };

  if (loading || splashLoading) {
    return (
      <div 
        onClick={() => setSplashLoading(false)}
        className="min-h-screen bg-stone-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden cursor-pointer"
        title="ক্লিক করে সরাসরি প্রবেশ করুন"
      >
        {/* Ambient background glow */}
        <div className="w-96 h-96 rounded-full bg-rose-600/15 blur-3xl absolute pointer-events-none" />
        <div className="w-80 h-80 rounded-full bg-amber-500/10 blur-3xl absolute -bottom-10 pointer-events-none" />
        
        <FoxLoader
          message="চান্দু জাপানিজ স্কুল লোড হচ্ছে..."
          subMessage="স্মার্ট ও সহজ উপায়ে হিরাগানা এবং কাতাকানা শিখুন"
          size="lg"
          showPetals={true}
          interactive={true}
          durationMs={400}
          onComplete={() => setSplashLoading(false)}
        />
      </div>
    );
  }

  // If visitor is not logged in or in guest mode, show Landing Page and require authentication
  if (!userProfile || userProfile.isGuest) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-between transition-colors">
        <header className="w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <AppLogo variant="navbar" />

            <div className="flex items-center gap-2 sm:gap-2.5">
              <PWAInstallButton />
              
              <button
                type="button"
                id="btn-landing-theme"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>

              <button
                type="button"
                id="btn-nav-login"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-98 cursor-pointer shrink-0"
              >
                লগইন / একাউন্ট
              </button>
            </div>
          </div>
        </header>

        {/* Top Offline Notification Strip (Non-blocking in flow) */}
        <OfflineIndicator />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
          <LandingPage 
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onStartGuest={() => setIsAuthModalOpen(true)}
          />
        </main>

        <footer className="border-t border-stone-200 dark:border-stone-800 py-8 text-center text-xs text-stone-500 dark:text-stone-400">
          <div className="max-w-7xl mx-auto px-4 space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 font-medium">
              <span>Developed with ❤️ by</span>
              <a
                href="https://uchihaemdadul.bio.link/"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-dev-link"
                className="font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900"
              >
                <Code2 size={13} />
                <span>uchihaemdadul</span>
                <ExternalLink size={11} />
              </a>
            </div>

            <p className="font-bold text-stone-700 dark:text-stone-300">
              © {new Date().getFullYear()} Chandu Japanese School (চান্দু জাপানিজ স্কুল) • সর্বস্বত্ব সংরক্ষিত
            </p>
            <p className="text-[11px] text-stone-400">
              হিরাগানা • কাতাকানা • স্ট্রোক অর্ডার • কুইজ এক্সাম • প্রমিত জাপানি অডিও
            </p>
          </div>
        </footer>

        <FoxFloatingGuide 
          onNavigate={() => setIsAuthModalOpen(true)}
          activeTab="home"
        />

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={() => setIsOnboardingOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col pb-20 md:pb-10 transition-colors">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Top Offline Notification Strip (In flow, never covers bottom content or buttons) */}
      <OfflineIndicator />

      {/* Main Body Content Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1">
        {activeTab === 'home' && (
          <HomeDashboard 
            onNavigate={(tab, subLevel) => {
              setActiveTab(tab);
              if (subLevel && (tab === 'hiragana' || tab === 'katakana')) {
                handleOpenLevelModal(tab, subLevel);
              }
            }}
            onOpenLevelModal={handleOpenLevelModal}
            onStartQuiz={handleStartQuiz}
            onOpenGoalWizard={() => setIsOnboardingOpen(true)}
          />
        )}

        {activeTab === 'hiragana' && (
          <CourseView 
            courseType="hiragana"
            onOpenLevel={handleOpenLevelModal}
            onStartLevelQuiz={(type, lvl) => handleStartQuiz(type, lvl)}
          />
        )}

        {activeTab === 'katakana' && (
          <CourseView 
            courseType="katakana"
            onOpenLevel={handleOpenLevelModal}
            onStartLevelQuiz={(type, lvl) => handleStartQuiz(type, lvl)}
          />
        )}

        {activeTab === 'kanji' && (
          <KanjiView />
        )}

        {activeTab === 'quiz' && (
          <QuizSession 
            initialCourse={quizConfig.course}
            initialLevel={quizConfig.level}
            onNavigateHome={() => setActiveTab('home')}
            onNavigateToCourse={(c) => setActiveTab(c)}
            onNavigateToMistakes={() => setActiveTab('mistakes')}
          />
        )}

        {activeTab === 'mistakes' && (
          <MistakesView 
            onNavigateHome={() => setActiveTab('home')}
            onNavigateToQuiz={() => {
              setQuizConfig({ course: 'hiragana', level: undefined });
              setActiveTab('quiz');
            }}
          />
        )}

        {activeTab === 'pdf' && (
          <PdfLibraryView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        )}

        {activeTab === 'progress' && (
          <ProgressDashboard onNavigateToStudy={() => setActiveTab('hiragana')} />
        )}

        {activeTab === 'profile' && (
          <ProfilePage onOpenGoalWizard={() => setIsOnboardingOpen(true)} />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Modals */}
      {levelModal.isOpen && (
        <LevelDetailModal 
          key={`${levelModal.type}-${levelModal.level}`}
          courseType={levelModal.type}
          levelNumber={levelModal.level}
          initialStep={levelModal.initialStep}
          isOpen={levelModal.isOpen}
          onClose={handleCloseLevelModal}
          onNextLevel={(nextType, nextLevel) => {
            setLevelModal({
              isOpen: true,
              type: nextType,
              level: nextLevel,
              initialStep: 1
            });
          }}
          onStartQuiz={(course, lvl) => {
            handleCloseLevelModal();
            handleStartQuiz(course, lvl);
          }}
        />
      )}

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsOnboardingOpen(true)}
      />

      <OnboardingModal 
        isOpen={isOnboardingOpen}
        onClose={() => {
          setIsOnboardingOpen(false);
          const uid = userProfile?.uid || 'guest';
          try {
            localStorage.setItem(`onboarding_dismissed_${uid}`, 'true');
            localStorage.setItem('onboarding_modal_dismissed_session', 'true');
          } catch (e) {
            // Ignore
          }
        }}
        onSelectTrack={(track) => setActiveTab(track)}
        onOpenLevelModal={handleOpenLevelModal}
      />

      {/* Community Announcement Entry Popup with 6-Hour Snooze */}
      <CommunityEntryModal 
        forceOpen={forceCommunityPreview}
        onCloseCustom={() => setForceCommunityPreview(false)}
      />

      {/* Floating Interactive Fox Mascot Guide (Only visible on Home tab) */}
      {activeTab === 'home' && (
        <FoxFloatingGuide 
          onNavigate={(tab, subLevel) => {
            setActiveTab(tab);
            if (subLevel && (tab === 'hiragana' || tab === 'katakana')) {
              handleOpenLevelModal(tab, subLevel);
            }
          }}
          onOpenLevel={handleOpenLevelModal}
          onStartQuiz={handleStartQuiz}
          activeTab={activeTab}
        />
      )}

    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
