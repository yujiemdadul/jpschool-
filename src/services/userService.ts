import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { UserProfile, KanaType, LeaderboardEntry, MistakeRecord, KanaChar, StreakFreezeRecord } from '../types';
import { ACHIEVEMENTS } from '../data/achievementsData';
import { HIRAGANA_LEVELS } from '../data/hiraganaData';
import { KATAKANA_LEVELS } from '../data/katakanaData';
import { badgeService } from './badgeService';
import { activityService, getLessonTitleBn } from './activityService';

// Key constants for local persistence
const LOCAL_STORAGE_PROFILE_PREFIX = 'chandu_profile_';
const LOCAL_STORAGE_GLOBAL_REGISTRY = 'chandu_global_leaderboard_registry';

/**
 * Reconciles completedChars and completedLevels bidirectionally:
 * - If all characters of a level are learned, the level is marked completed.
 * - If a level is marked completed, its characters are marked learned.
 * - Ensures lastLevel accurately reflects the next uncompleted level (up to 10).
 */
export function reconcileLevelProgress(profile: UserProfile): UserProfile {
  if (!profile) return profile;

  // Hiragana reconciliation
  const hProgress = profile.hiraganaProgress || { completedLevels: [], completedChars: [], lastLevel: 1 };
  const hCompletedChars = new Set(hProgress.completedChars || []);
  const hCompletedLevels = new Set(hProgress.completedLevels || []);

  for (const lvl of HIRAGANA_LEVELS) {
    if (hCompletedLevels.has(lvl.level)) {
      lvl.characters.forEach(c => hCompletedChars.add(c.id));
    }
  }

  let hNextLevel = 1;
  for (let i = 1; i <= 10; i++) {
    if (!hCompletedLevels.has(i)) {
      hNextLevel = i;
      break;
    }
    if (i === 10) hNextLevel = 10;
  }

  // Katakana reconciliation
  const kProgress = profile.katakanaProgress || { completedLevels: [], completedChars: [], lastLevel: 1 };
  const kCompletedChars = new Set(kProgress.completedChars || []);
  const kCompletedLevels = new Set(kProgress.completedLevels || []);

  for (const lvl of KATAKANA_LEVELS) {
    if (kCompletedLevels.has(lvl.level)) {
      lvl.characters.forEach(c => kCompletedChars.add(c.id));
    }
  }

  let kNextLevel = 1;
  for (let i = 1; i <= 10; i++) {
    if (!kCompletedLevels.has(i)) {
      kNextLevel = i;
      break;
    }
    if (i === 10) kNextLevel = 10;
  }

  return {
    ...profile,
    hiraganaProgress: {
      ...hProgress,
      completedLevels: Array.from(hCompletedLevels).sort((a, b) => a - b),
      completedChars: Array.from(hCompletedChars),
      lastLevel: Math.max(hProgress.lastLevel || 1, hNextLevel)
    },
    katakanaProgress: {
      ...kProgress,
      completedLevels: Array.from(kCompletedLevels).sort((a, b) => a - b),
      completedChars: Array.from(kCompletedChars),
      lastLevel: Math.max(kProgress.lastLevel || 1, kNextLevel)
    }
  };
}

export function isRealRegisteredUser(entry: LeaderboardEntry | UserProfile): boolean {
  if (!entry) return false;
  const uid = entry.uid || '';
  if (!uid || uid.includes('_official_student') || uid.startsWith('mock_') || uid.startsWith('fake_')) return false;
  if ('isGuest' in entry && (entry as UserProfile).isGuest) return false;
  const name = (entry.displayName || '').trim();
  if (!name || name === 'গেস্ট শিক্ষার্থী') return false;
  return true;
}

function profileToLeaderboardEntry(profile: UserProfile): LeaderboardEntry {
  const hLevels = profile.hiraganaProgress?.completedLevels?.length || 0;
  const kLevels = profile.katakanaProgress?.completedLevels?.length || 0;
  const totalChars = (profile.hiraganaProgress?.completedChars?.length || 0) + (profile.katakanaProgress?.completedChars?.length || 0);

  return {
    uid: profile.uid,
    displayName: (profile.displayName || 'শিক্ষার্থী').trim(),
    email: profile.email || '',
    photoURL: profile.photoURL || '',
    xp: Number(profile.xp) || 0,
    streak: Number(profile.streak) || 1,
    hiraganaLevelsCount: hLevels,
    katakanaLevelsCount: kLevels,
    totalCompletedChars: totalChars,
    lastLogin: typeof profile.lastLogin === 'number' ? profile.lastLogin : Date.now()
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMissedDaysBetween(lastStudyDate: string, targetDate: string = getTodayDateString()): number {
  if (!lastStudyDate) return 0;
  try {
    const d1 = new Date(lastStudyDate + 'T00:00:00');
    const d2 = new Date(targetDate + 'T00:00:00');
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays - 1);
  } catch {
    return 0;
  }
}

export function checkAndApplyStreakFreeze(profile: UserProfile): {
  updatedProfile: UserProfile;
  freezeUsed: boolean;
  freezesConsumed: number;
  message?: string;
} {
  const today = getTodayDateString();
  const lastStudy = profile.lastStudyDate;
  if (!lastStudy || lastStudy === today) {
    return { updatedProfile: profile, freezeUsed: false, freezesConsumed: 0 };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yYear = yesterday.getFullYear();
  const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

  if (lastStudy === yesterdayStr) {
    return { updatedProfile: profile, freezeUsed: false, freezesConsumed: 0 };
  }

  // The user missed days
  const missedDays = getMissedDaysBetween(lastStudy, today);
  const availableFreezes = profile.streakFreezeCount || 0;

  if (missedDays > 0 && availableFreezes > 0) {
    const freezesToUse = Math.min(missedDays, availableFreezes);
    const newFreezeCount = availableFreezes - freezesToUse;

    const inventory = [...(profile.streakFreezeInventory || [])];
    let usedCount = 0;
    const now = Date.now();
    for (let i = 0; i < inventory.length && usedCount < freezesToUse; i++) {
      if (inventory[i].status === 'active') {
        inventory[i] = {
          ...inventory[i],
          status: 'used',
          usedAt: now,
          usedForDate: yesterdayStr,
          descriptionBn: 'স্ট্রিক সুরক্ষায় স্বয়ংক্রিয়ভাবে ব্যবহৃত হয়েছে'
        };
        usedCount++;
      }
    }

    const updatedProfile: UserProfile = {
      ...profile,
      streakFreezeCount: newFreezeCount,
      streakFreezeInventory: inventory,
      lastStudyDate: yesterdayStr,
      lastStreakFreezeUsedAt: now,
      lastStreakFreezeUsedForDate: yesterdayStr
    };

    return {
      updatedProfile,
      freezeUsed: true,
      freezesConsumed: freezesToUse,
      message: `আপনার স্ট্রিক সুরক্ষায় ${freezesToUse}টি স্ট্রিক ফ্রিজ ব্যবহৃত হয়েছে এবং ${profile.streak} দিনের স্ট্রিক সংরক্ষিত রয়েছে!`
    };
  }

  return { updatedProfile: profile, freezeUsed: false, freezesConsumed: 0 };
}

export function calculateUpdatedStreak(lastStudyDate: string, currentStreak: number): { newStreak: number; newDate: string } {
  const today = getTodayDateString();
  if (!lastStudyDate) {
    return { newStreak: 1, newDate: today };
  }

  if (lastStudyDate === today) {
    // Already studied today, keep current streak
    return { newStreak: Math.max(1, currentStreak), newDate: today };
  }

  // Check if last study date was yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yYear = yesterday.getFullYear();
  const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

  if (lastStudyDate === yesterdayStr) {
    // Consecutive day
    return { newStreak: (currentStreak || 0) + 1, newDate: today };
  } else {
    // Missed one or more days, reset to 1
    return { newStreak: 1, newDate: today };
  }
}

// Helper for quick Firestore timeout fallback
function timeoutPromise<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
}

/**
 * Merges two user profiles deterministically, preserving highest XP,
 * longest streak, union of learned characters, completed levels, and achievements.
 */
export function mergeUserProfiles(existing: UserProfile, incoming: UserProfile): UserProfile {
  const mergedXp = Math.max(Number(existing.xp) || 0, Number(incoming.xp) || 0);
  const mergedStreak = Math.max(Number(existing.streak) || 1, Number(incoming.streak) || 1);

  const hLevels = Array.from(new Set([
    ...(existing.hiraganaProgress?.completedLevels || []),
    ...(incoming.hiraganaProgress?.completedLevels || [])
  ])).sort((a, b) => a - b);

  const hChars = Array.from(new Set([
    ...(existing.hiraganaProgress?.completedChars || []),
    ...(incoming.hiraganaProgress?.completedChars || [])
  ]));

  const hLastLevel = Math.max(
    existing.hiraganaProgress?.lastLevel || 1,
    incoming.hiraganaProgress?.lastLevel || 1
  );

  const kLevels = Array.from(new Set([
    ...(existing.katakanaProgress?.completedLevels || []),
    ...(incoming.katakanaProgress?.completedLevels || [])
  ])).sort((a, b) => a - b);

  const kChars = Array.from(new Set([
    ...(existing.katakanaProgress?.completedChars || []),
    ...(incoming.katakanaProgress?.completedChars || [])
  ]));

  const kLastLevel = Math.max(
    existing.katakanaProgress?.lastLevel || 1,
    incoming.katakanaProgress?.lastLevel || 1
  );

  const mergedAchievements = Array.from(new Set([
    ...(existing.achievements || []),
    ...(incoming.achievements || [])
  ]));

  const eQ = existing.quizStats || { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, accuracy: 100 };
  const iQ = incoming.quizStats || { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, accuracy: 100 };
  const totalQuizzes = Math.max(eQ.totalQuizzes, iQ.totalQuizzes);
  const totalQuestions = Math.max(eQ.totalQuestions, iQ.totalQuestions);
  const correctAnswers = Math.max(eQ.correctAnswers, iQ.correctAnswers);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;

  const dailyMap: Record<string, number> = {};
  if (existing.dailyXpHistory && typeof existing.dailyXpHistory === 'object') {
    Object.entries(existing.dailyXpHistory).forEach(([date, xp]) => {
      dailyMap[date] = Number(xp) || 0;
    });
  }
  if (incoming.dailyXpHistory && typeof incoming.dailyXpHistory === 'object') {
    Object.entries(incoming.dailyXpHistory).forEach(([date, xp]) => {
      dailyMap[date] = Math.max(dailyMap[date] || 0, Number(xp) || 0);
    });
  }

  const lastStudyDate = [existing.lastStudyDate, incoming.lastStudyDate]
    .filter(Boolean)
    .sort()
    .pop() || getTodayDateString();

  return reconcileLevelProgress({
    uid: incoming.uid || existing.uid,
    displayName: (incoming.displayName && incoming.displayName !== 'শিক্ষার্থী' ? incoming.displayName : existing.displayName) || 'শিক্ষার্থী',
    email: incoming.email || existing.email || '',
    photoURL: incoming.photoURL || existing.photoURL || '',
    createdAt: Math.min(existing.createdAt || Date.now(), incoming.createdAt || Date.now()),
    lastLogin: Math.max(existing.lastLogin || 0, incoming.lastLogin || 0, Date.now()),
    xp: mergedXp,
    streak: mergedStreak,
    lastStudyDate,
    hiraganaProgress: {
      completedLevels: hLevels,
      completedChars: hChars,
      lastLevel: hLastLevel
    },
    katakanaProgress: {
      completedLevels: kLevels,
      completedChars: kChars,
      lastLevel: kLastLevel
    },
    quizStats: {
      totalQuizzes,
      totalQuestions,
      correctAnswers,
      accuracy
    },
    achievements: mergedAchievements,
    dailyXpHistory: dailyMap,
    scriptLanguage: incoming.scriptLanguage || existing.scriptLanguage || 'bangla',
    studyReminderEnabled: incoming.studyReminderEnabled ?? existing.studyReminderEnabled ?? false,
    studyReminderTime: incoming.studyReminderTime || existing.studyReminderTime || '20:00',
    streakFreezeCount: typeof incoming.streakFreezeCount === 'number' ? incoming.streakFreezeCount : (existing.streakFreezeCount || 0),
    streakFreezeInventory: incoming.streakFreezeInventory || existing.streakFreezeInventory || [],
    lastStreakFreezeUsedAt: incoming.lastStreakFreezeUsedAt || existing.lastStreakFreezeUsedAt,
    lastStreakFreezeUsedForDate: incoming.lastStreakFreezeUsedForDate || existing.lastStreakFreezeUsedForDate,
    isGuest: Boolean(existing.isGuest && incoming.isGuest)
  });
}

let _activeProfileMemory: UserProfile | null = null;

export const userService = {
  getActiveProfile(): UserProfile | null {
    return _activeProfileMemory;
  },

  setActiveProfile(p: UserProfile | null) {
    _activeProfileMemory = p;
  },

  async getOrCreateUserProfile(uid: string, fallbackData?: { displayName?: string; email?: string; photoURL?: string }): Promise<UserProfile> {
    const today = getTodayDateString();
    const defaultProfile: UserProfile = {
      uid,
      displayName: fallbackData?.displayName || 'শিক্ষার্থী',
      email: fallbackData?.email || '',
      photoURL: fallbackData?.photoURL || '',
      createdAt: Date.now(),
      lastLogin: Date.now(),
      xp: 0,
      streak: 1,
      lastStudyDate: today,
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
      kanjiProgress: {
        learnedKanjiIds: []
      },
      scriptLanguage: 'bangla',
      studyReminderEnabled: false,
      studyReminderTime: '20:00',
      streakFreezeCount: 0,
      streakFreezeInventory: []
    };

    // 1. Try local storage first as instant local cache
    const localCached = localStorage.getItem(LOCAL_STORAGE_PROFILE_PREFIX + uid);
    let cachedProfile: UserProfile | null = null;
    if (localCached) {
      try {
        cachedProfile = JSON.parse(localCached);
      } catch (e) {
        console.warn('Failed parsing local profile cache:', e);
      }
    }

    // 2. Query centralized server endpoint (by UID or Email) to restore across different browsers
    let serverProfile: UserProfile | null = null;
    try {
      const res = await fetch(`/api/users/${uid}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const json = await res.json();
        if (json.profile) {
          serverProfile = json.profile;
        }
      } else if (fallbackData?.email && fallbackData.email.includes('@')) {
        const resEmail = await fetch(`/api/users/by-email/${encodeURIComponent(fallbackData.email)}`, { signal: AbortSignal.timeout(2000) });
        if (resEmail.ok) {
          const jsonEmail = await resEmail.json();
          if (jsonEmail.profile) {
            serverProfile = jsonEmail.profile;
          }
        }
      }
    } catch {
      // Server query fallback
    }

    // Combine local cache, server profile, and default
    let activeProfile: UserProfile = defaultProfile;
    if (serverProfile && cachedProfile) {
      activeProfile = mergeUserProfiles(cachedProfile, serverProfile);
    } else if (serverProfile) {
      activeProfile = mergeUserProfiles(defaultProfile, serverProfile);
    } else if (cachedProfile) {
      activeProfile = mergeUserProfiles(defaultProfile, cachedProfile);
    }

    // If local cache had higher XP than server, push the update to the server immediately
    if (cachedProfile && (!serverProfile || (cachedProfile.xp > (serverProfile.xp || 0)))) {
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeProfile)
      }).catch(() => {});
    }

    // 3. If Firestore is active and not guest, also query Firestore
    if (isFirebaseConfigured && db && !activeProfile.isGuest) {
      try {
        const userDocRef = doc(db, 'users', uid);
        const snapshot = await timeoutPromise(getDoc(userDocRef), 1500, null);
        if (snapshot && snapshot.exists()) {
          const firestoreData = snapshot.data() as UserProfile;
          activeProfile = mergeUserProfiles(activeProfile, firestoreData);
        }
      } catch {
        // Firestore offline / disabled fallback
      }
    }

    // Apply any active streak freeze if days were missed
    const freezeCheck = checkAndApplyStreakFreeze(activeProfile);
    activeProfile = freezeCheck.updatedProfile;

    const streakUpdate = calculateUpdatedStreak(activeProfile.lastStudyDate, activeProfile.streak);
    activeProfile.streak = streakUpdate.newStreak;
    activeProfile.lastStudyDate = streakUpdate.newDate;
    activeProfile.lastLogin = Date.now();

    const finalProfile = reconcileLevelProgress(activeProfile);
    _activeProfileMemory = finalProfile;

    // Save everywhere so future requests across tabs or browsers stay 100% in sync
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_PREFIX + uid, JSON.stringify(finalProfile));
      if (!finalProfile.isGuest) {
        localStorage.setItem('chandu_school_user', JSON.stringify(finalProfile));
      }
      window.dispatchEvent(new CustomEvent('chandu_user_profile_updated', { detail: finalProfile }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalProfile)
    }).catch(() => {});

    return finalProfile;
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    const reconciled = reconcileLevelProgress(profile);
    _activeProfileMemory = reconciled;

    // Always persist to localStorage for instant local responsiveness
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_PREFIX + reconciled.uid, JSON.stringify(reconciled));
      if (!reconciled.isGuest) {
        localStorage.setItem('chandu_school_user', JSON.stringify(reconciled));
      }
      window.dispatchEvent(new CustomEvent('chandu_user_profile_updated', { detail: reconciled }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // Save to server database immediately so other browsers and devices see it instantly
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reconciled)
    }).catch((e) => {
      console.warn('Server user sync error:', e);
    });

    // Update global shared registry in localStorage so all accounts see this student
    if (!reconciled.isGuest && reconciled.displayName && reconciled.displayName.trim() && reconciled.displayName !== 'গেস্ট শিক্ষার্থী') {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_GLOBAL_REGISTRY);
        const entries: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];
        const entry = profileToLeaderboardEntry(reconciled);
        const existingIdx = entries.findIndex(e => e.uid === reconciled.uid || (reconciled.email && e.email === reconciled.email));
        if (existingIdx >= 0) {
          entries[existingIdx] = entry;
        } else {
          entries.push(entry);
        }
        localStorage.setItem(LOCAL_STORAGE_GLOBAL_REGISTRY, JSON.stringify(entries));
      } catch (e) {
        console.warn('Failed syncing to global leaderboard local registry:', e);
      }
    }

    if (isFirebaseConfigured && db && !reconciled.isGuest) {
      try {
        const userDocRef = doc(db, 'users', reconciled.uid);
        await setDoc(userDocRef, reconciled, { merge: true });
        // Asynchronously sync unlocked badges to Firestore Badges collection
        badgeService.syncBadgesToFirestore(reconciled).catch((e) => {
          console.warn('Background badges sync error:', e);
        });
      } catch (err) {
        // Fallback gracefully
      }
    }
  },

  checkAchievements(profile: UserProfile): { updatedProfile: UserProfile; newlyUnlocked: string[] } {
    const newlyUnlocked: string[] = [];
    const currentUnlocked = new Set(profile.achievements || []);
    let xpBonus = 0;

    const totalCompletedChars = (profile.hiraganaProgress.completedChars.length) + (profile.katakanaProgress.completedChars.length);
    const hiraganaLevelsCompleted = profile.hiraganaProgress.completedLevels.length;
    const katakanaLevelsCompleted = profile.katakanaProgress.completedLevels.length;

    // 1. First Lesson
    if (totalCompletedChars >= 1 && !currentUnlocked.has('first_lesson')) {
      currentUnlocked.add('first_lesson');
      newlyUnlocked.push('first_lesson');
      xpBonus += 50;
    }

    // 2. Hiragana Beginner (5 levels)
    if (hiraganaLevelsCompleted >= 5 && !currentUnlocked.has('hiragana_beginner')) {
      currentUnlocked.add('hiragana_beginner');
      newlyUnlocked.push('hiragana_beginner');
      xpBonus += 150;
    }

    // 3. Hiragana Master (all 10 levels)
    if (hiraganaLevelsCompleted >= 10 && !currentUnlocked.has('hiragana_master')) {
      currentUnlocked.add('hiragana_master');
      newlyUnlocked.push('hiragana_master');
      xpBonus += 300;
    }

    // 4. Katakana Beginner (5 levels)
    if (katakanaLevelsCompleted >= 5 && !currentUnlocked.has('katakana_beginner')) {
      currentUnlocked.add('katakana_beginner');
      newlyUnlocked.push('katakana_beginner');
      xpBonus += 150;
    }

    // 5. Katakana Master (all 10 levels)
    if (katakanaLevelsCompleted >= 10 && !currentUnlocked.has('katakana_master')) {
      currentUnlocked.add('katakana_master');
      newlyUnlocked.push('katakana_master');
      xpBonus += 300;
    }

    // 6. Quiz Novice
    if (profile.quizStats.totalQuizzes >= 1 && !currentUnlocked.has('quiz_novice')) {
      currentUnlocked.add('quiz_novice');
      newlyUnlocked.push('quiz_novice');
      xpBonus += 50;
    }

    // 7. Quiz Master (100 correct answers)
    if (profile.quizStats.correctAnswers >= 100 && !currentUnlocked.has('quiz_master')) {
      currentUnlocked.add('quiz_master');
      newlyUnlocked.push('quiz_master');
      xpBonus += 250;
    }

    // 8. 3-day Streak
    if (profile.streak >= 3 && !currentUnlocked.has('streak_3')) {
      currentUnlocked.add('streak_3');
      newlyUnlocked.push('streak_3');
      xpBonus += 100;
    }

    // 9. Daily Challenger (First daily challenge completed)
    if (profile.lastDailyQuizDate && !currentUnlocked.has('daily_challenger')) {
      currentUnlocked.add('daily_challenger');
      newlyUnlocked.push('daily_challenger');
      xpBonus += 75;
    }

    // 10. Weekly Daily Challenge Champion (7-day daily quiz streak)
    if ((profile.dailyQuizStreak || 0) >= 7 && !currentUnlocked.has('daily_streak_7')) {
      currentUnlocked.add('daily_streak_7');
      newlyUnlocked.push('daily_streak_7');
      xpBonus += 200;
    }

    // 11. 7 Day Study Streak Milestone
    if ((profile.streak || 1) >= 7 && !currentUnlocked.has('streak_7')) {
      currentUnlocked.add('streak_7');
      newlyUnlocked.push('streak_7');
      xpBonus += 200;
    }

    // 12. 100 Characters Mastered Milestone
    const totalCharsLearned = (profile.hiraganaProgress.completedChars.length) + 
                              (profile.katakanaProgress.completedChars.length) + 
                              ((profile.mistakes || []).filter(m => m.mastered).length) +
                              (profile.totalCharactersMastered || 0);
    if ((totalCharsLearned >= 100 || (profile.totalCharactersMastered || 0) >= 100) && !currentUnlocked.has('chars_100')) {
      currentUnlocked.add('chars_100');
      newlyUnlocked.push('chars_100');
      xpBonus += 350;
    }

    // 13. Streak Protector Milestone (Purchased or equipped Streak Freeze)
    if (((profile.streakFreezeCount || 0) > 0 || (profile.streakFreezeInventory && profile.streakFreezeInventory.length > 0)) && !currentUnlocked.has('streak_protector')) {
      currentUnlocked.add('streak_protector');
      newlyUnlocked.push('streak_protector');
      xpBonus += 50;
    }

    if (newlyUnlocked.length > 0) {
      const updated: UserProfile = {
        ...profile,
        xp: profile.xp + xpBonus,
        achievements: Array.from(currentUnlocked)
      };
      this.saveUserProfile(updated);
      return { updatedProfile: updated, newlyUnlocked };
    }

    return { updatedProfile: profile, newlyUnlocked: [] };
  },

  isDailyQuizCompletedToday(profile?: UserProfile | null): boolean {
    if (!profile || !profile.lastDailyQuizDate) return false;
    return profile.lastDailyQuizDate === getTodayDateString();
  },

  getDailyStudyGoalMinutes(profile?: UserProfile | null): number {
    return profile?.dailyStudyGoalMinutes || 10;
  },

  async setDailyStudyGoalMinutes(profile: UserProfile, minutes: number): Promise<UserProfile> {
    const clampedMinutes = Math.max(1, Math.min(120, Math.round(minutes || 10)));
    const updated: UserProfile = {
      ...profile,
      dailyStudyGoalMinutes: clampedMinutes
    };
    await this.saveUserProfile(updated);
    return updated;
  },

  async completeGoalOnboarding(
    profile: UserProfile,
    settings: {
      dailyStudyGoalMinutes?: number;
      dailyXpGoal?: number;
      experienceLevel?: 'beginner' | 'some_knowledge' | 'know_hiragana' | 'know_katakana';
    }
  ): Promise<UserProfile> {
    const updated: UserProfile = {
      ...profile,
      dailyStudyGoalMinutes: Math.max(1, Math.min(120, Math.round(settings.dailyStudyGoalMinutes || profile.dailyStudyGoalMinutes || 10))),
      dailyXpGoal: Math.max(10, Math.min(500, Math.round(settings.dailyXpGoal || profile.dailyXpGoal || 50))),
      experienceLevel: settings.experienceLevel || profile.experienceLevel || 'beginner',
      hasCompletedGoalOnboarding: true
    };
    await this.saveUserProfile(updated);
    return updated;
  },

  getDailyXpGoal(profile?: UserProfile | null): number {
    return profile?.dailyXpGoal || 50;
  },

  getTodayEarnedXP(profile?: UserProfile | null): number {
    if (!profile) return 0;
    const today = getTodayDateString();
    if (profile.dailyXpHistory && typeof profile.dailyXpHistory[today] === 'number') {
      return profile.dailyXpHistory[today];
    }
    // Fallback heuristic if not explicitly set in history dictionary yet
    let fallbackXp = 0;
    if (profile.lastDailyQuizDate === today) {
      fallbackXp += 50;
    }
    if (profile.lastStudyDate === today && fallbackXp === 0 && profile.xp > 0) {
      fallbackXp = Math.min(profile.xp, 25);
    }
    return fallbackXp;
  },

  recordEarnedDailyXP(profile: UserProfile, xpToAdd: number): Record<string, number> {
    const today = getTodayDateString();
    const currentHistory = { ...(profile.dailyXpHistory || {}) };
    currentHistory[today] = (currentHistory[today] || 0) + Math.max(0, xpToAdd);
    return currentHistory;
  },

  async setDailyXpGoal(profile: UserProfile, goal: number): Promise<UserProfile> {
    const clampedGoal = Math.max(10, Math.min(500, Math.round(goal || 50)));
    const updated: UserProfile = {
      ...profile,
      dailyXpGoal: clampedGoal
    };
    await this.saveUserProfile(updated);
    return updated;
  },

  isDailyGoalCompletedToday(profile?: UserProfile | null): boolean {
    if (!profile) return false;
    const today = getTodayDateString();
    const todayXP = this.getTodayEarnedXP(profile);
    const targetGoal = this.getDailyXpGoal(profile);
    if (todayXP >= targetGoal) return true;
    return profile.lastDailyQuizDate === today || profile.lastStudyDate === today;
  },

  checkAndApplyStreakFreeze(profile: UserProfile): {
    updatedProfile: UserProfile;
    freezeUsed: boolean;
    freezesConsumed: number;
    message?: string;
  } {
    return checkAndApplyStreakFreeze(profile);
  },

  calculateUpdatedStreak(lastStudyDate: string, currentStreak: number): { newStreak: number; newDate: string } {
    return calculateUpdatedStreak(lastStudyDate, currentStreak);
  },

  getMissedDaysBetween(lastStudyDate: string, targetDate?: string): number {
    return getMissedDaysBetween(lastStudyDate, targetDate);
  },

  async purchaseStreakFreeze(profile: UserProfile, costXP: number = 100): Promise<{ success: boolean; profile: UserProfile; error?: string }> {
    const base = (_activeProfileMemory && _activeProfileMemory.uid === profile.uid) ? _activeProfileMemory : profile;
    const currentXP = Number(base.xp) || 0;
    const currentFreezes = Number(base.streakFreezeCount) || 0;
    const maxFreezes = 2; // Up to 2 active streak freezes can be equipped

    if (currentFreezes >= maxFreezes) {
      return {
        success: false,
        profile: base,
        error: `আপনার কাছে ইতিমধ্যে সর্বোচ্চ ${maxFreezes}টি স্ট্রিক ফ্রিজ মজুদ আছে!`
      };
    }

    if (currentXP < costXP) {
      return {
        success: false,
        profile: base,
        error: `পর্যাপ্ত XP নেই! আপনার আছে ${currentXP} XP, প্রয়োজন ${costXP} XP। কুইজ খেলে আরও পয়েন্ট অর্জন করুন।`
      };
    }

    const newRecord: StreakFreezeRecord = {
      id: `freeze_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      purchasedAt: Date.now(),
      costXP,
      status: 'active',
      descriptionBn: `কুইজ থেকে অর্জিত ${costXP} XP দিয়ে সংগৃহীত স্ট্রিক সুরক্ষা`
    };

    const existingInventory = base.streakFreezeInventory || [];
    const updatedProfile: UserProfile = {
      ...base,
      xp: currentXP - costXP,
      streakFreezeCount: currentFreezes + 1,
      streakFreezeInventory: [newRecord, ...existingInventory]
    };

    const { updatedProfile: finalProfile } = this.checkAchievements(updatedProfile);
    await this.saveUserProfile(finalProfile);
    _activeProfileMemory = finalProfile;
    try {
      window.dispatchEvent(new CustomEvent('chandu_user_profile_updated', { detail: finalProfile }));
    } catch {
      // ignore
    }

    return {
      success: true,
      profile: finalProfile
    };
  },

  async simulateMissedDayWithFreeze(profile: UserProfile): Promise<{ success: boolean; profile: UserProfile; message: string }> {
    const base = (_activeProfileMemory && _activeProfileMemory.uid === profile.uid) ? _activeProfileMemory : profile;
    const currentFreezes = Number(base.streakFreezeCount) || 0;

    if (currentFreezes <= 0) {
      return {
        success: false,
        profile: base,
        message: 'সিমুলেশন চালানোর জন্য অন্তত ১টি স্ট্রিক ফ্রিজ সক্রিয় থাকতে হবে!'
      };
    }

    const inventory = [...(base.streakFreezeInventory || [])];
    const activeIndex = inventory.findIndex(f => f.status === 'active');
    const now = Date.now();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (activeIndex >= 0) {
      inventory[activeIndex] = {
        ...inventory[activeIndex],
        status: 'used',
        usedAt: now,
        usedForDate: yStr,
        descriptionBn: 'পরীক্ষামূলক সিমুলেশনে স্ট্রিক সুরক্ষায় ব্যবহৃত'
      };
    }

    const updatedProfile: UserProfile = {
      ...base,
      streakFreezeCount: Math.max(0, currentFreezes - 1),
      streakFreezeInventory: inventory,
      lastStreakFreezeUsedAt: now,
      lastStreakFreezeUsedForDate: yStr
    };

    await this.saveUserProfile(updatedProfile);
    _activeProfileMemory = updatedProfile;
    try {
      window.dispatchEvent(new CustomEvent('chandu_user_profile_updated', { detail: updatedProfile }));
    } catch {
      // ignore
    }

    return {
      success: true,
      profile: updatedProfile,
      message: `সিমুলেশন সফল! আপনার ১টি ফ্রিজ ব্যবহৃত হয়েছে এবং ${base.streak} দিনের স্ট্রিক অক্ষুণ্ণ রয়েছে।`
    };
  },

  async completeDailyQuizChallenge(
    profile: UserProfile,
    score: number,
    totalQuestions: number = 5
  ): Promise<{
    updatedProfile: UserProfile;
    earnedXP: number;
    baseXP: number;
    bonusXP: number;
    streakBonusXP: number;
    newDailyStreak: number;
    newlyUnlocked: string[];
  }> {
    // Intercept with streak freeze in case user missed prior study days
    const freezeCheck = checkAndApplyStreakFreeze(profile);
    const baseProfile = freezeCheck.updatedProfile;

    const today = getTodayDateString();
    const isAlreadyDoneToday = baseProfile.lastDailyQuizDate === today;

    // Calculate daily quiz streak
    let newDailyStreak = baseProfile.dailyQuizStreak || 0;
    if (!isAlreadyDoneToday) {
      const streakCalc = calculateUpdatedStreak(baseProfile.lastDailyQuizDate || '', baseProfile.dailyQuizStreak || 0);
      newDailyStreak = streakCalc.newStreak;
    }

    // Update general study streak
    const generalStreakCalc = calculateUpdatedStreak(baseProfile.lastStudyDate, baseProfile.streak);

    // XP calculation:
    // Base: 10 XP per correct question (up to 50 XP)
    const baseXP = score * 10;
    // Daily completion bonus: 50 XP (only awarded on first completion of the day)
    const bonusXP = isAlreadyDoneToday ? 0 : 50;
    // Perfect score bonus: 25 XP if all 5 correct
    const perfectScoreBonus = score === totalQuestions ? 25 : 0;
    // Consecutive daily streak bonus: +10 XP per streak day (capped at +50 XP)
    const streakBonusXP = isAlreadyDoneToday ? 0 : Math.min(50, Math.max(0, newDailyStreak - 1) * 10);

    const totalEarnedXP = baseXP + bonusXP + perfectScoreBonus + streakBonusXP;

    // Update quiz stats
    const currentStats = profile.quizStats;
    const newTotalQuizzes = currentStats.totalQuizzes + 1;
    const newTotalQuestions = currentStats.totalQuestions + totalQuestions;
    const newCorrectAnswers = currentStats.correctAnswers + score;
    const newAccuracy = newTotalQuestions > 0 ? Math.round((newCorrectAnswers / newTotalQuestions) * 100) : 100;

    let updated: UserProfile = {
      ...baseProfile,
      xp: baseProfile.xp + totalEarnedXP,
      dailyXpHistory: this.recordEarnedDailyXP(baseProfile, totalEarnedXP),
      streak: generalStreakCalc.newStreak,
      lastStudyDate: generalStreakCalc.newDate,
      lastDailyQuizDate: today,
      dailyQuizStreak: newDailyStreak,
      dailyQuizLastCompletedAt: Date.now(),
      quizStats: {
        totalQuizzes: newTotalQuizzes,
        totalQuestions: newTotalQuestions,
        correctAnswers: newCorrectAnswers,
        accuracy: newAccuracy
      }
    };

    const { updatedProfile: checkedProfile, newlyUnlocked } = this.checkAchievements(updated);
    const { updatedProfile: finalProfile } = activityService.recordQuizActivity(checkedProfile, {
      course: 'daily_challenge',
      titleBn: 'দৈনিক কুইজ চ্যালেঞ্জ',
      totalQuestions,
      correctAnswers: score,
      scorePercentage: Math.round((score / totalQuestions) * 100),
      xpEarned: totalEarnedXP,
      timestamp: Date.now(),
      dateKey: today
    });
    await this.saveUserProfile(finalProfile);

    return {
      updatedProfile: finalProfile,
      earnedXP: totalEarnedXP,
      baseXP,
      bonusXP: bonusXP + perfectScoreBonus,
      streakBonusXP,
      newDailyStreak,
      newlyUnlocked
    };
  },

  async markCharacterLearned(profile: UserProfile, type: KanaType, charId: string, level: number): Promise<UserProfile> {
    const rawBase = (_activeProfileMemory && _activeProfileMemory.uid === profile.uid) ? _activeProfileMemory : profile;
    const freezeCheck = checkAndApplyStreakFreeze(rawBase);
    const base = freezeCheck.updatedProfile;

    const progressField = type === 'hiragana' ? 'hiraganaProgress' : 'katakanaProgress';
    const currentProgress = base[progressField];
    const completedChars = new Set(currentProgress.completedChars || []);
    const completedLevels = new Set(currentProgress.completedLevels || []);

    const isNewChar = !completedChars.has(charId);
    completedChars.add(charId);

    let xpToAdd = isNewChar ? 15 : 2;

    const streakUpdate = calculateUpdatedStreak(base.lastStudyDate, base.streak);

    const rawProfile: UserProfile = {
      ...base,
      xp: base.xp + xpToAdd,
      dailyXpHistory: this.recordEarnedDailyXP(base, xpToAdd),
      streak: streakUpdate.newStreak,
      lastStudyDate: streakUpdate.newDate,
      [progressField]: {
        ...currentProgress,
        completedChars: Array.from(completedChars),
        completedLevels: Array.from(completedLevels).sort((a, b) => a - b),
        lastLevel: currentProgress.lastLevel || level
      }
    };

    const reconciled = reconcileLevelProgress(rawProfile);
    const { updatedProfile: finalProfile } = this.checkAchievements(reconciled);
    await this.saveUserProfile(finalProfile);
    return finalProfile;
  },

  async markKanjiLearned(profile: UserProfile, kanjiId: string): Promise<UserProfile> {
    const rawBase = (_activeProfileMemory && _activeProfileMemory.uid === profile.uid) ? _activeProfileMemory : profile;
    const freezeCheck = checkAndApplyStreakFreeze(rawBase);
    const base = freezeCheck.updatedProfile;

    const currentKanjiProgress = base.kanjiProgress || { learnedKanjiIds: [] };
    const learnedSet = new Set(currentKanjiProgress.learnedKanjiIds || []);

    const isNew = !learnedSet.has(kanjiId);
    learnedSet.add(kanjiId);

    const xpToAdd = isNew ? 20 : 2;
    const streakUpdate = calculateUpdatedStreak(base.lastStudyDate, base.streak);

    const updatedProfile: UserProfile = {
      ...base,
      xp: (base.xp || 0) + xpToAdd,
      dailyXpHistory: this.recordEarnedDailyXP(base, xpToAdd),
      streak: streakUpdate.newStreak,
      lastStudyDate: streakUpdate.newDate,
      kanjiProgress: {
        learnedKanjiIds: Array.from(learnedSet),
        lastStudiedKanjiId: kanjiId
      }
    };

    const { updatedProfile: finalProfile } = this.checkAchievements(updatedProfile);
    await this.saveUserProfile(finalProfile);
    return finalProfile;
  },

  async unmarkKanjiLearned(profile: UserProfile, kanjiId: string): Promise<UserProfile> {
    const base = (_activeProfileMemory && _activeProfileMemory.uid === profile.uid) ? _activeProfileMemory : profile;
    const currentKanjiProgress = base.kanjiProgress || { learnedKanjiIds: [] };
    const learnedSet = new Set(currentKanjiProgress.learnedKanjiIds || []);

    learnedSet.delete(kanjiId);

    const updatedProfile: UserProfile = {
      ...base,
      kanjiProgress: {
        learnedKanjiIds: Array.from(learnedSet),
        lastStudiedKanjiId: kanjiId
      }
    };

    await this.saveUserProfile(updatedProfile);
    return updatedProfile;
  },

  async recordKanjiQuizResult(profile: UserProfile, score: number, totalQuestions: number): Promise<UserProfile> {
    const rawBase = (_activeProfileMemory && _activeProfileMemory.uid === profile.uid) ? _activeProfileMemory : profile;
    const freezeCheck = checkAndApplyStreakFreeze(rawBase);
    const base = freezeCheck.updatedProfile;

    const earnedXP = score * 5 + 10;
    const currentStats = base.quizStats || { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, accuracy: 100 };
    const newTotalQuizzes = currentStats.totalQuizzes + 1;
    const newTotalQuestions = currentStats.totalQuestions + totalQuestions;
    const newCorrectAnswers = currentStats.correctAnswers + score;
    const newAccuracy = newTotalQuestions > 0 ? Math.round((newCorrectAnswers / newTotalQuestions) * 100) : 100;

    const streakCalc = calculateUpdatedStreak(base.lastStudyDate, base.streak);

    const updatedProfile: UserProfile = {
      ...base,
      xp: (base.xp || 0) + earnedXP,
      dailyXpHistory: this.recordEarnedDailyXP(base, earnedXP),
      streak: streakCalc.newStreak,
      lastStudyDate: streakCalc.newDate,
      quizStats: {
        totalQuizzes: newTotalQuizzes,
        totalQuestions: newTotalQuestions,
        correctAnswers: newCorrectAnswers,
        accuracy: newAccuracy
      }
    };

    const { updatedProfile: checkedProfile } = this.checkAchievements(updatedProfile);
    const { updatedProfile: finalProfile } = activityService.recordQuizActivity(checkedProfile, {
      course: 'kanji',
      titleBn: 'N5 কাঞ্জি কুইজ টেস্ট',
      totalQuestions,
      correctAnswers: score,
      scorePercentage: Math.round((score / totalQuestions) * 100),
      xpEarned: earnedXP,
      timestamp: Date.now(),
      dateKey: getTodayDateString()
    });
    await this.saveUserProfile(finalProfile);
    return finalProfile;
  },

  async markLevelCompleted(profile: UserProfile, type: KanaType, level: number, customXp?: number): Promise<UserProfile> {
    const rawBase = (_activeProfileMemory && _activeProfileMemory.uid === profile.uid) ? _activeProfileMemory : profile;
    const freezeCheck = checkAndApplyStreakFreeze(rawBase);
    const base = freezeCheck.updatedProfile;

    const progressField = type === 'hiragana' ? 'hiraganaProgress' : 'katakanaProgress';
    const currentProgress = base[progressField];
    const completedLevels = new Set(currentProgress.completedLevels || []);
    const completedChars = new Set(currentProgress.completedChars || []);

    const isNewLevel = !completedLevels.has(level);
    completedLevels.add(level);

    // Also mark all characters of this level as learned
    const levelPool = type === 'hiragana' ? HIRAGANA_LEVELS : KATAKANA_LEVELS;
    const targetLvl = levelPool.find(l => l.level === level);
    if (targetLvl) {
      targetLvl.characters.forEach(c => completedChars.add(c.id));
    }

    const xpToAdd = typeof customXp === 'number' ? customXp : (isNewLevel ? 60 : 10);
    const streakUpdate = calculateUpdatedStreak(base.lastStudyDate, base.streak);

    let nextLevel = currentProgress.lastLevel;
    for (let i = 1; i <= 10; i++) {
      if (!completedLevels.has(i)) {
        nextLevel = i;
        break;
      }
      if (i === 10) nextLevel = 10;
    }

    const rawProfile: UserProfile = {
      ...base,
      xp: base.xp + xpToAdd,
      dailyXpHistory: this.recordEarnedDailyXP(base, xpToAdd),
      streak: streakUpdate.newStreak,
      lastStudyDate: streakUpdate.newDate,
      [progressField]: {
        ...currentProgress,
        completedLevels: Array.from(completedLevels).sort((a, b) => a - b),
        completedChars: Array.from(completedChars),
        lastLevel: Math.max(currentProgress.lastLevel, nextLevel)
      }
    };

    const reconciled = reconcileLevelProgress(rawProfile);
    const { updatedProfile: checkedProfile } = this.checkAchievements(reconciled);
    const lessonInfo = getLessonTitleBn(type, level);
    const { updatedProfile: finalProfile } = activityService.recordLessonActivity(checkedProfile, {
      id: `lesson_${type}_${level}_${Date.now()}`,
      course: type,
      level,
      titleBn: lessonInfo.title,
      titleJp: `${type === 'hiragana' ? 'ひらがな' : 'カタカナ'} レベル ${level}`,
      characters: lessonInfo.characters,
      xpEarned: xpToAdd,
      completedAt: Date.now(),
      dateKey: getTodayDateString()
    });
    await this.saveUserProfile(finalProfile);
    return finalProfile;
  },

  async getLeaderboard(
    sortBy: 'xp' | 'streak' = 'xp',
    currentProfile?: UserProfile | null
  ): Promise<LeaderboardEntry[]> {
    // 1. Initialize user map (starts empty - ONLY real users allowed)
    const userMap = new Map<string, LeaderboardEntry>();

    // 2. Fetch all real registered users from centralized server database (cross-browser)
    try {
      const res = await fetch(`/api/leaderboard?sortBy=${sortBy}`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.entries)) {
          for (const entry of json.entries) {
            if (entry && isRealRegisteredUser(entry)) {
              userMap.set(entry.uid, entry);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Server leaderboard query fallback:', err);
    }

    // 3. Fetch all real registered users from Firestore across all connected devices/accounts
    if (isFirebaseConfigured && db) {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, limit(100));
        const snapshot = await timeoutPromise(getDocs(q), 2500, null);

        if (snapshot && !snapshot.empty) {
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as UserProfile;
            if (data && isRealRegisteredUser(data)) {
              const entry = profileToLeaderboardEntry({
                ...data,
                uid: data.uid || docSnap.id
              });
              if (isRealRegisteredUser(entry)) {
                const prev = userMap.get(entry.uid);
                if (!prev || entry.xp >= prev.xp) {
                  userMap.set(entry.uid, entry);
                }
              }
            }
          });
        }
      } catch (err) {
        console.warn('Firestore leaderboard query fallback:', err);
      }
    }

    // 4. Read from shared local storage registry (and sanitize any legacy mock entries)
    try {
      const rawRegistry = localStorage.getItem(LOCAL_STORAGE_GLOBAL_REGISTRY);
      if (rawRegistry) {
        const localUsers: LeaderboardEntry[] = JSON.parse(rawRegistry);
        const cleanedRegistry: LeaderboardEntry[] = [];
        for (const user of localUsers) {
          if (user && isRealRegisteredUser(user)) {
            const prev = userMap.get(user.uid);
            if (!prev || user.xp >= prev.xp) {
              userMap.set(user.uid, user);
            }
            cleanedRegistry.push(user);
          }
        }
        localStorage.setItem(LOCAL_STORAGE_GLOBAL_REGISTRY, JSON.stringify(cleanedRegistry));
      }
    } catch (e) {
      console.warn('Error reading local leaderboard registry:', e);
    }

    // 5. Scan all individual chandu_profile_* in localStorage on this device
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LOCAL_STORAGE_PROFILE_PREFIX)) {
          const val = localStorage.getItem(key);
          if (val) {
            const p = JSON.parse(val) as UserProfile;
            if (p && isRealRegisteredUser(p)) {
              const entry = profileToLeaderboardEntry(p);
              const prev = userMap.get(p.uid);
              if (!prev || entry.xp >= prev.xp) {
                userMap.set(p.uid, entry);
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error harvesting local user profiles:', e);
    }

    // 6. Ensure current active logged-in user profile is up-to-date with 100% accurate current stats
    if (currentProfile && isRealRegisteredUser(currentProfile)) {
      const curEntry = profileToLeaderboardEntry(currentProfile);
      const prev = userMap.get(currentProfile.uid);
      if (!prev || curEntry.xp >= prev.xp) {
        userMap.set(currentProfile.uid, curEntry);
      }
    }

    // 7. Convert Map to array
    const rawUsers = Array.from(userMap.values());

    // 8. Sort strictly and deterministically based on requested criteria
    if (sortBy === 'streak') {
      rawUsers.sort((a, b) => (b.streak - a.streak) || (b.xp - a.xp) || a.displayName.localeCompare(b.displayName));
    } else {
      rawUsers.sort((a, b) => (b.xp - a.xp) || (b.streak - a.streak) || a.displayName.localeCompare(b.displayName));
    }

    return rawUsers;
  },

  /**
   * Syncs all existing non-guest profiles stored in localStorage to the centralized server database.
   */
  syncAllLocalProfilesToServer(): void {
    try {
      const profiles: UserProfile[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LOCAL_STORAGE_PROFILE_PREFIX)) {
          const val = localStorage.getItem(key);
          if (val) {
            const p = JSON.parse(val) as UserProfile;
            if (p && isRealRegisteredUser(p) && p.xp > 0) {
              profiles.push(p);
            }
          }
        }
      }
      if (profiles.length > 0) {
        fetch('/api/users/sync-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profiles })
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Sync profiles to server notice:', e);
    }
  },

  /**
   * Record a mistake for a kana character.
   */
  async recordMistake(
    profile: UserProfile,
    data: {
      kana: KanaChar;
      questionPrompt?: string;
      userAnswer?: string;
      correctAnswer?: string;
    }
  ): Promise<UserProfile> {
    const mistakes = [...(profile.mistakes || [])];
    const existingIndex = mistakes.findIndex(m => m.kanaId === data.kana.id);

    if (existingIndex >= 0) {
      const existing = mistakes[existingIndex];
      mistakes[existingIndex] = {
        ...existing,
        wrongCount: (existing.wrongCount || 1) + 1,
        lastMistakeAt: Date.now(),
        lastQuestionPrompt: data.questionPrompt || existing.lastQuestionPrompt,
        userAnswer: data.userAnswer || existing.userAnswer,
        correctAnswer: data.correctAnswer || existing.correctAnswer,
        mastered: false,
        resolvedAt: undefined
      };
    } else {
      const newMistake: MistakeRecord = {
        id: `mistake_${data.kana.id}`,
        kanaId: data.kana.id,
        character: data.kana.character,
        romaji: data.kana.romaji,
        bangla: data.kana.bangla,
        type: data.kana.type,
        level: data.kana.level,
        wrongCount: 1,
        lastMistakeAt: Date.now(),
        lastQuestionPrompt: data.questionPrompt,
        userAnswer: data.userAnswer,
        correctAnswer: data.correctAnswer,
        mastered: false
      };
      mistakes.unshift(newMistake);
    }

    const updatedProfile: UserProfile = {
      ...profile,
      mistakes
    };

    await this.saveUserProfile(updatedProfile);
    return updatedProfile;
  },

  /**
   * Resolve a mistake when practicing (user answers correctly).
   * Awards +15 bonus XP!
   */
  async resolveMistake(profile: UserProfile, kanaId: string): Promise<{ updatedProfile: UserProfile; xpEarned: number }> {
    const mistakes = [...(profile.mistakes || [])];
    const index = mistakes.findIndex(m => m.kanaId === kanaId);

    if (index === -1) {
      return { updatedProfile: profile, xpEarned: 0 };
    }

    const current = mistakes[index];
    mistakes[index] = {
      ...current,
      mastered: true,
      resolvedAt: Date.now()
    };

    const xpEarned = 15;
    const updatedProfile: UserProfile = {
      ...profile,
      xp: profile.xp + xpEarned,
      dailyXpHistory: this.recordEarnedDailyXP(profile, xpEarned),
      mistakes
    };

    await this.saveUserProfile(updatedProfile);
    return { updatedProfile, xpEarned };
  },

  /**
   * Remove a mistake completely from list.
   */
  async removeMistake(profile: UserProfile, kanaId: string): Promise<UserProfile> {
    const mistakes = (profile.mistakes || []).filter(m => m.kanaId !== kanaId);
    const updatedProfile: UserProfile = {
      ...profile,
      mistakes
    };
    await this.saveUserProfile(updatedProfile);
    return updatedProfile;
  },

  /**
   * Clear all mistakes.
   */
  async clearAllMistakes(profile: UserProfile): Promise<UserProfile> {
    const updatedProfile: UserProfile = {
      ...profile,
      mistakes: []
    };
    await this.saveUserProfile(updatedProfile);
    return updatedProfile;
  },

  /**
   * Get unresolved/active mistakes.
   */
  getActiveMistakes(profile: UserProfile | null): MistakeRecord[] {
    if (!profile || !profile.mistakes) return [];
    return profile.mistakes.filter(m => !m.mastered);
  },

  /**
   * Get all mistakes (active + mastered).
   */
  getAllMistakes(profile: UserProfile | null): MistakeRecord[] {
    if (!profile || !profile.mistakes) return [];
    return profile.mistakes;
  }
};
