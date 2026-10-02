import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { UserProfile, KanaChar } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { pdfService, setStoredAdminKey, clearStoredAdminKey, ADMIN_EMAILS } from '../services/pdfService';
import { setPronunciationSoundEnabled, setSoundEffectsEnabled as setSpeechSoundEffectsEnabled } from '../utils/speech';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  refreshProfile: () => Promise<void>;
  setExperienceLevel: (level: 'beginner' | 'some_knowledge' | 'know_hiragana' | 'know_katakana') => Promise<void>;
  setScriptLanguage: (mode: 'bangla' | 'english') => Promise<void>;
  setSoundEnabled: (enabled: boolean) => Promise<void>;
  setSoundEffectsEnabled: (enabled: boolean) => Promise<void>;
  setDailyXpGoal: (goal: number) => Promise<void>;
  setDailyStudyGoalMinutes: (minutes: number) => Promise<void>;
  setStudyReminderEnabled: (enabled: boolean) => Promise<boolean>;
  setStudyReminderTime: (time: string) => Promise<void>;
  completeGoalOnboarding: (settings: {
    dailyStudyGoalMinutes?: number;
    dailyXpGoal?: number;
    experienceLevel?: 'beginner' | 'some_knowledge' | 'know_hiragana' | 'know_katakana';
  }) => Promise<void>;
  recordMistake: (data: {
    kana: KanaChar;
    questionPrompt?: string;
    userAnswer?: string;
    correctAnswer?: string;
  }) => Promise<void>;
  resolveMistake: (kanaId: string) => Promise<number>;
  removeMistake: (kanaId: string) => Promise<void>;
  clearAllMistakes: () => Promise<void>;
  purchaseStreakFreeze: (costXP?: number) => Promise<{ success: boolean; error?: string }>;
  simulateMissedDayWithFreeze: () => Promise<{ success: boolean; message: string }>;
  isAdmin: boolean;
  adminEmail: string;
  loginAsAdmin: (passcode: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'chandu_school_user';
const ADMIN_EMAIL_ADDRESS = 'emdadulff12@gmail.com';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    let unsubscribe = () => {};
    let isMounted = true;

    // 1. Immediately restore authenticated local session for 0ms initial load
    const savedUserStr = localStorage.getItem(LOCAL_USER_KEY);
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr) as UserProfile;
        if (parsed && !parsed.isGuest) {
          setUserProfile(parsed);
        } else {
          localStorage.removeItem(LOCAL_USER_KEY);
        }
      } catch (e) {
        console.warn('Error restoring local profile session:', e);
      }
    }

    // Sync any existing local profiles to centralized server in background
    userService.syncAllLocalProfilesToServer();

    // Safety timeout to guarantee loading screen never hangs for more than 200ms
    const timer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 200);

    // 2. Firebase Auth state listener
    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!isMounted) return;
        setCurrentUser(user);
        if (user) {
          try {
            const profile = await userService.getOrCreateUserProfile(user.uid, {
              displayName: user.displayName || user.email?.split('@')[0] || 'শিক্ষার্থী',
              email: user.email || '',
              photoURL: user.photoURL || ''
            });
            if (isMounted) {
              setUserProfile(profile);
              if (!profile.isGuest) {
                localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
              }
            }
          } catch (err) {
            console.warn('Silent fallback for Firestore profile:', err);
          }
        } else {
          localStorage.removeItem(LOCAL_USER_KEY);
        }
        if (isMounted) {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }

    // 3. Listen for immediate real-time profile updates across components
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>;
      if (customEvent.detail && isMounted) {
        setUserProfile(customEvent.detail);
      }
    };
    window.addEventListener('chandu_user_profile_updated', handleProfileUpdate);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      unsubscribe();
      window.removeEventListener('chandu_user_profile_updated', handleProfileUpdate);
    };
  }, []);

  // Synchronize memory cache and local session storage whenever userProfile changes
  useEffect(() => {
    if (userProfile) {
      userService.setActiveProfile(userProfile);
      if (!userProfile.isGuest) {
        try {
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userProfile));
        } catch (e) {
          // ignore
        }
      }
    }
  }, [userProfile]);

  // Sync sound settings with speech engine whenever userProfile changes
  useEffect(() => {
    if (userProfile) {
      if (typeof userProfile.soundEnabled === 'boolean') {
        setPronunciationSoundEnabled(userProfile.soundEnabled);
      }
      if (typeof userProfile.soundEffectsEnabled === 'boolean') {
        setSpeechSoundEffectsEnabled(userProfile.soundEffectsEnabled);
      }
    }
  }, [userProfile?.soundEnabled, userProfile?.soundEffectsEnabled]);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const user = await authService.loginWithEmail(email, pass);
      if (user) {
        setCurrentUser(user);
        const profile = await userService.getOrCreateUserProfile(user.uid, {
          displayName: user.displayName || email.split('@')[0],
          email: user.email || email,
          photoURL: user.photoURL || ''
        });
        setUserProfile(profile);
      }
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const user = await authService.registerWithEmail(name, email, pass);
      if (user) {
        setCurrentUser(user);
        const profile = await userService.getOrCreateUserProfile(user.uid, {
          displayName: name,
          email: email,
          photoURL: user.photoURL || ''
        });
        setUserProfile(profile);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      if (user) {
        setCurrentUser(user);
        const profile = await userService.getOrCreateUserProfile(user.uid, {
          displayName: user.displayName || 'জাপানি শিক্ষার্থী',
          email: user.email || '',
          photoURL: user.photoURL || ''
        });
        setUserProfile(profile);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async (name?: string) => {
    setLoading(true);
    try {
      const guestProf = await authService.loginAsGuest(name);
      setUserProfile(guestProf);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(LOCAL_USER_KEY);
      clearStoredAdminKey();
      await authService.logout();
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const loginAsAdmin = async (passcode: string): Promise<{ success: boolean; error?: string }> => {
    const cleanKey = (passcode || '').trim();
    if (!cleanKey) {
      return { success: false, error: 'অনুগ্রহ করে এডমিন সিক্রেট পাসকোড প্রদান করুন।' };
    }

    setLoading(true);
    try {
      const isValid = await pdfService.verifyAdminCredentials(cleanKey);
      if (!isValid) {
        return { 
          success: false, 
          error: 'ভুল সিক্রেট পাসকোড! শুধুমাত্র Chandu Japanese School এর মূল এডমিন প্রবেশ করতে পারবেন।' 
        };
      }

      setStoredAdminKey(cleanKey);
      const profile = await userService.getOrCreateUserProfile('admin_emdadul', {
        displayName: 'Emdadul (Admin)',
        email: ADMIN_EMAIL_ADDRESS,
        photoURL: ''
      });
      setUserProfile(profile);
      try {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      } catch (e) {
        // ignore
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'এডমিন ভেরিফিকেশনে ত্রুটি ঘটেছে' };
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = Boolean(
    (userProfile?.email && ADMIN_EMAILS.includes(userProfile.email.toLowerCase().trim())) ||
    (currentUser?.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim())) ||
    (userProfile?.uid === 'admin_emdadul')
  );

  const updateDisplayName = async (name: string) => {
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      displayName: name.trim() || userProfile.displayName
    };
    setUserProfile(updated);
    await userService.saveUserProfile(updated);
  };

  const refreshProfile = async () => {
    if (!userProfile) return;
    const latest = await userService.getOrCreateUserProfile(userProfile.uid);
    setUserProfile(latest);
  };

  const setExperienceLevel = async (level: 'beginner' | 'some_knowledge' | 'know_hiragana' | 'know_katakana') => {
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      experienceLevel: level
    };
    setUserProfile(updated);
    await userService.saveUserProfile(updated);
  };

  const setScriptLanguage = async (mode: 'bangla' | 'english') => {
    const current = userProfile || userService.getActiveProfile();
    if (!current) return;
    const updated: UserProfile = {
      ...current,
      scriptLanguage: mode
    };
    setUserProfile(updated);
    userService.setActiveProfile(updated);
    await userService.saveUserProfile(updated);
  };

  const setSoundEnabled = async (enabled: boolean) => {
    setPronunciationSoundEnabled(enabled);
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      soundEnabled: enabled
    };
    setUserProfile(updated);
    await userService.saveUserProfile(updated);
  };

  const setSoundEffectsEnabled = async (enabled: boolean) => {
    setSpeechSoundEffectsEnabled(enabled);
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      soundEffectsEnabled: enabled
    };
    setUserProfile(updated);
    await userService.saveUserProfile(updated);
  };

  const setDailyXpGoal = async (goal: number) => {
    if (!userProfile) return;
    const clamped = Math.max(10, Math.min(500, Math.round(goal || 50)));
    const updated: UserProfile = {
      ...userProfile,
      dailyXpGoal: clamped
    };
    setUserProfile(updated);
    await userService.saveUserProfile(updated);
  };

  const setDailyStudyGoalMinutes = async (minutes: number) => {
    if (!userProfile) return;
    const clamped = Math.max(1, Math.min(120, Math.round(minutes || 10)));
    const updated: UserProfile = {
      ...userProfile,
      dailyStudyGoalMinutes: clamped
    };
    setUserProfile(updated);
    await userService.saveUserProfile(updated);
  };

  const setStudyReminderEnabled = async (enabled: boolean): Promise<boolean> => {
    if (!userProfile) return false;
    const updated: UserProfile = {
      ...userProfile,
      studyReminderEnabled: enabled
    };
    setUserProfile(updated);
    await userService.saveUserProfile(updated);
    return true;
  };

  const setStudyReminderTime = async (time: string) => {
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      studyReminderTime: time
    };
    setUserProfile(updated);
    await userService.saveUserProfile(updated);
  };

  const completeGoalOnboarding = async (settings: {
    dailyStudyGoalMinutes?: number;
    dailyXpGoal?: number;
    experienceLevel?: 'beginner' | 'some_knowledge' | 'know_hiragana' | 'know_katakana';
  }) => {
    if (!userProfile) return;
    const updated = await userService.completeGoalOnboarding(userProfile, settings);
    setUserProfile(updated);
  };

  const recordMistake = async (data: {
    kana: KanaChar;
    questionPrompt?: string;
    userAnswer?: string;
    correctAnswer?: string;
  }) => {
    if (!userProfile) return;
    const updated = await userService.recordMistake(userProfile, data);
    setUserProfile(updated);
  };

  const resolveMistake = async (kanaId: string): Promise<number> => {
    if (!userProfile) return 0;
    const { updatedProfile, xpEarned } = await userService.resolveMistake(userProfile, kanaId);
    setUserProfile(updatedProfile);
    return xpEarned;
  };

  const removeMistake = async (kanaId: string) => {
    if (!userProfile) return;
    const updated = await userService.removeMistake(userProfile, kanaId);
    setUserProfile(updated);
  };

  const clearAllMistakes = async () => {
    if (!userProfile) return;
    const updated = await userService.clearAllMistakes(userProfile);
    setUserProfile(updated);
  };

  const purchaseStreakFreeze = async (costXP: number = 100): Promise<{ success: boolean; error?: string }> => {
    if (!userProfile) return { success: false, error: 'ইউজার প্রোফাইল পাওয়া যায়নি' };
    const res = await userService.purchaseStreakFreeze(userProfile, costXP);
    if (res.success) {
      setUserProfile(res.profile);
    }
    return { success: res.success, error: res.error };
  };

  const simulateMissedDayWithFreeze = async (): Promise<{ success: boolean; message: string }> => {
    if (!userProfile) return { success: false, message: 'ইউজার প্রোফাইল পাওয়া যায়নি' };
    const res = await userService.simulateMissedDayWithFreeze(userProfile);
    if (res.success) {
      setUserProfile(res.profile);
    }
    return { success: res.success, message: res.message };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsGuest,
        logout,
        updateDisplayName,
        setUserProfile,
        refreshProfile,
        setExperienceLevel,
        setScriptLanguage,
        setSoundEnabled,
        setSoundEffectsEnabled,
        setDailyXpGoal,
        setDailyStudyGoalMinutes,
        setStudyReminderEnabled,
        setStudyReminderTime,
        completeGoalOnboarding,
        recordMistake,
        resolveMistake,
        removeMistake,
        clearAllMistakes,
        purchaseStreakFreeze,
        simulateMissedDayWithFreeze,
        isAdmin,
        adminEmail: ADMIN_EMAIL_ADDRESS,
        loginAsAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
