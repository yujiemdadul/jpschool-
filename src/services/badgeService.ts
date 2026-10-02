import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { BadgeRecord, UserProfile } from '../types';
import { BADGE_DEFINITIONS, evaluateBadgesForUser } from '../data/badgesData';

const LOCAL_STORAGE_BADGES_KEY = 'chandu_user_badges_cache';

export const badgeService = {
  /**
   * Retrieves user badges from Firestore (or local cache if offline/guest).
   * Also reconciles with userProfile's live stats.
   */
  async getUserBadges(profile: UserProfile): Promise<{ 
    badges: BadgeRecord[]; 
    isCloudConnected: boolean;
    error?: string;
  }> {
    if (!profile) {
      return { badges: [], isCloudConnected: false };
    }

    const cachedMap: Record<string, { unlockedAt: number }> = {};

    // 1. Try local cache first for instant response
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_BADGES_KEY}_${profile.uid}`);
      if (stored) {
        const parsed: BadgeRecord[] = JSON.parse(stored);
        parsed.forEach(b => {
          if (b.unlocked && b.unlockedAt) {
            cachedMap[b.badgeId] = { unlockedAt: b.unlockedAt };
          }
        });
      }
    } catch (e) {
      console.warn('Could not read badges local cache:', e);
    }

    let isCloudConnected = false;

    // 2. If Firebase is active and not guest, fetch from Firestore 'badges' collection
    if (isFirebaseConfigured && db && !profile.isGuest) {
      try {
        // Query top-level Badges collection
        const badgesRef = collection(db, 'badges');
        const q = query(badgesRef, where('userId', '==', profile.uid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as Partial<BadgeRecord>;
            if (data.badgeId && data.unlocked && data.unlockedAt) {
              cachedMap[data.badgeId] = { unlockedAt: data.unlockedAt };
            }
          });
          isCloudConnected = true;
        } else {
          // Also check subcollection fallback: /users/{userId}/badges
          const subRef = collection(db, 'users', profile.uid, 'badges');
          const subSnapshot = await getDocs(subRef);
          if (!subSnapshot.empty) {
            subSnapshot.forEach(docSnap => {
              const data = docSnap.data() as Partial<BadgeRecord>;
              if (data.badgeId && data.unlocked && data.unlockedAt) {
                cachedMap[data.badgeId] = { unlockedAt: data.unlockedAt };
              }
            });
          }
          isCloudConnected = true;
        }
      } catch (err) {
        console.warn('Firestore badges fetch warning (falling back to evaluated state):', err);
      }
    }

    // 3. Evaluate live badges from user stats
    const evaluated = evaluateBadgesForUser(profile, cachedMap);

    // Update synced status
    const result = evaluated.map(b => ({
      ...b,
      syncedToFirestore: isCloudConnected && b.unlocked
    }));

    // Cache locally
    try {
      localStorage.setItem(`${LOCAL_STORAGE_BADGES_KEY}_${profile.uid}`, JSON.stringify(result));
    } catch {
      // ignore
    }

    return { badges: result, isCloudConnected };
  },

  /**
   * Syncs all unlocked badges to Firestore 'badges' collection and subcollection.
   */
  async syncBadgesToFirestore(profile: UserProfile): Promise<{
    syncedCount: number;
    badges: BadgeRecord[];
    isCloudConnected: boolean;
  }> {
    if (!profile) {
      return { syncedCount: 0, badges: [], isCloudConnected: false };
    }

    const { badges } = await this.getUserBadges(profile);
    const unlockedBadges = badges.filter(b => b.unlocked);

    let syncedCount = 0;
    let isCloudConnected = false;

    if (isFirebaseConfigured && db && !profile.isGuest) {
      try {
        for (const badge of unlockedBadges) {
          const docId = `${profile.uid}_${badge.badgeId}`;
          const badgePayload = {
            id: docId,
            userId: profile.uid,
            badgeId: badge.badgeId,
            milestone: badge.milestone,
            titleBn: badge.titleBn,
            titleEn: badge.titleEn,
            titleJp: badge.titleJp,
            descriptionBn: badge.descriptionBn,
            icon: badge.icon,
            category: badge.category,
            targetValue: badge.targetValue,
            currentValue: badge.currentValue,
            xpReward: badge.xpReward,
            unlocked: true,
            unlockedAt: badge.unlockedAt || Date.now(),
            updatedAt: Date.now()
          };

          // 1. Write to top-level 'badges' collection
          const topDocRef = doc(db, 'badges', docId);
          await setDoc(topDocRef, badgePayload, { merge: true });

          // 2. Write to subcollection /users/{userId}/badges/{badgeId}
          const subDocRef = doc(db, 'users', profile.uid, 'badges', badge.badgeId);
          await setDoc(subDocRef, badgePayload, { merge: true });

          syncedCount++;
        }
        isCloudConnected = true;
      } catch (err) {
        console.error('Error syncing badges to Firestore:', err);
      }
    }

    const updatedBadges = badges.map(b => ({
      ...b,
      syncedToFirestore: isCloudConnected && b.unlocked
    }));

    try {
      localStorage.setItem(`${LOCAL_STORAGE_BADGES_KEY}_${profile.uid}`, JSON.stringify(updatedBadges));
    } catch {
      // ignore
    }

    return {
      syncedCount,
      badges: updatedBadges,
      isCloudConnected
    };
  },

  /**
   * Helper to simulate milestones for demonstration/testing
   * E.g. '7 Day Streak' or '100 Characters Mastered'
   */
  simulateMilestone(
    currentProfile: UserProfile,
    milestoneType: 'streak_7' | 'chars_100'
  ): UserProfile {
    const updated = { ...currentProfile };
    const achievementsSet = new Set(updated.achievements || []);

    if (milestoneType === 'streak_7') {
      updated.streak = Math.max(updated.streak || 1, 7);
      achievementsSet.add('streak_7');
      achievementsSet.add('streak_3');
      updated.xp = (updated.xp || 0) + 200;
    } else if (milestoneType === 'chars_100') {
      updated.totalCharactersMastered = 100;
      // Also ensure completed characters count is at least 100
      achievementsSet.add('chars_100');
      achievementsSet.add('first_lesson');
      achievementsSet.add('hiragana_master');
      achievementsSet.add('katakana_master');
      updated.xp = (updated.xp || 0) + 350;
    }

    updated.achievements = Array.from(achievementsSet);
    return updated;
  }
};
