import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { UserProfile } from '../types';

export function getFriendlyBanglaAuthError(errorCode: string, rawMessage?: string): string {
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  
  switch (errorCode) {
    case 'auth/unauthorized-domain':
      return `ডোমেন অনুমোদিত নয় (${currentHost})। Firebase Console -> Authentication -> Settings -> Authorized domains এ গিয়ে এই ডোমেনটি অ্যাড (Add domain) করতে হবে।`;
    case 'auth/operation-not-allowed':
      return 'Firebase Console এ Google Sign-In মেথড এনাবল (Enable) করা নেই। Authentication -> Sign-in method এ গিয়ে Google চালু করুন।';
    case 'auth/invalid-email':
      return 'সঠিক ইমেইল ঠিকানা দিন।';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।';
    case 'auth/email-already-in-use':
      return 'এই ইমেইল দিয়ে আগে থেকেই একটি অ্যাকাউন্ট আছে।';
    case 'auth/weak-password':
      return 'পাসওয়ার্ডটি অন্তত ৬ অক্ষরের হতে হবে।';
    case 'auth/network-request-failed':
      return 'ইন্টারনেট সংযোগে সমস্যা হয়েছে। আপনার নেটওয়ার্ক চেক করুন।';
    case 'auth/too-many-requests':
      return 'অতিরিক্ত ব্যর্থ চেষ্টার কারণে সাময়িকভাবে বন্ধ। কিছুক্ষণ পর আবার চেষ্টা করুন।';
    case 'auth/popup-closed-by-user':
      return 'Google লগইন উইন্ডো বন্ধ করা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    case 'auth/popup-blocked':
      return 'ব্রাউজার অথবা আইফ্রেম (iframe) পপ-আপ ব্লক করেছে। অনুগ্রহ করে ব্রাউজারের পপ-আপ এলাও করুন বা নতুন ট্যাবে অ্যাপটি খুলুন।';
    default:
      return rawMessage || 'লগইনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
  }
}

const LOCAL_STORAGE_USER_KEY = 'chandu_school_user';

export const authService = {
  async loginWithEmail(email: string, pass: string): Promise<User | null> {
    if (!isFirebaseConfigured || !auth) {
      // Fallback local simulated auth
      const mockUser = {
        uid: 'local_' + btoa(email).slice(0, 12),
        displayName: email.split('@')[0],
        email: email,
        photoURL: ''
      } as unknown as User;
      return mockUser;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return cred.user;
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code || '';
      throw new Error(getFriendlyBanglaAuthError(code));
    }
  },

  async registerWithEmail(name: string, email: string, pass: string): Promise<User | null> {
    if (!name.trim()) {
      throw new Error('অনুগ্রহ করে আপনার পুরো নাম দিন।');
    }
    if (!email.trim() || !email.includes('@')) {
      throw new Error('সঠিক ইমেইল ঠিকানা দিন।');
    }
    if (pass.length < 6) {
      throw new Error('পাসওয়ার্ডটি অন্তত ৬ অক্ষরের হতে হবে।');
    }

    if (!isFirebaseConfigured || !auth) {
      const mockUser = {
        uid: 'local_' + Date.now(),
        displayName: name,
        email: email,
        photoURL: ''
      } as unknown as User;
      return mockUser;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      return cred.user;
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code || '';
      const rawMsg = (error as { message?: string })?.message || '';
      throw new Error(getFriendlyBanglaAuthError(code, rawMsg));
    }
  },

  async loginWithGoogle(): Promise<User | null> {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      // Fallback guest/google simulated
      const mockUser = {
        uid: 'google_local_' + Math.random().toString(36).substring(2, 9),
        displayName: 'জাপানি শিক্ষার্থী',
        email: 'learner@chandujapanese.com',
        photoURL: ''
      } as unknown as User;
      return mockUser;
    }

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      return cred.user;
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code || '';
      const rawMsg = (error as { message?: string })?.message || '';
      throw new Error(getFriendlyBanglaAuthError(code, rawMsg));
    }
  },

  async loginAsGuest(guestName?: string): Promise<UserProfile> {
    const name = guestName?.trim() || 'জাপানি শিক্ষার্থী';
    const guestId = 'guest_' + Date.now();
    const guestProfile: UserProfile = {
      uid: guestId,
      displayName: name,
      email: 'guest@chandujapanese.com',
      photoURL: '',
      createdAt: Date.now(),
      lastLogin: Date.now(),
      xp: 0,
      streak: 1,
      lastStudyDate: new Date().toISOString().split('T')[0],
      hiraganaProgress: {
        completedLevels: [],
        completedChars: [],
        lastLevel: 1
      },
      katakanaProgress: {
        completedLevels: [],
        completedChars: [],
        lastLevel: 1
      },
      quizStats: {
        totalQuizzes: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 100
      },
      achievements: [],
      scriptLanguage: 'bangla',
      studyReminderEnabled: false,
      studyReminderTime: '20:00',
      isGuest: true
    };

    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guestProfile));
    return guestProfile;
  },

  async resetPassword(email: string): Promise<void> {
    if (!email.trim() || !email.includes('@')) {
      throw new Error('সঠিক ইমেইল ঠিকানা দিন।');
    }

    if (!isFirebaseConfigured || !auth) {
      // Graceful offline message
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code || '';
      throw new Error(getFriendlyBanglaAuthError(code));
    }
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Sign out warning:', err);
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  }
};
