import { CommunityPopupConfig } from '../types';

const SNOOZE_STORAGE_KEY = 'chandu_community_popup_snooze_until';
const LOCAL_CACHE_KEY = 'chandu_community_popup_cache';

export const DEFAULT_COMMUNITY_CONFIG: CommunityPopupConfig = {
  id: 'community_popup',
  isEnabled: true,
  titleBn: 'আমাদের অফিশিয়াল জাপানিজ লার্নিং কমিউনিটিতে স্বাগতম!',
  titleJp: '日本語学習コミュニティへようこそ！',
  tagBn: 'Chandu Japanese School • অফিশিয়াল কমিউনিটি',
  descriptionBn: 'জাপানি বর্ণমালা, শব্দভাণ্ডার ও JLPT N5 পরীক্ষার সেরা প্রস্তুতির জন্য আমাদের লার্নিং কমিউনিটিতে যুক্ত হোন। প্রতিদিনের প্রশ্ন-উত্তর, কুইজ আলোচনা ও এক্সক্লুসিভ স্টাডি শিট সবার আগে পেতে আমাদের গ্রুপ ও চ্যানেলে যোগ দিন!',
  imageUrl: '/community_banner.jpg',
  primaryLinkUrl: 'https://www.facebook.com/groups/chandujapanese',
  primaryLinkText: 'কমিউনিটিতে যোগ দিন 🚀',
  primaryPlatform: 'facebook',
  secondaryLinkUrl: 'https://t.me/chandujapaneseschool',
  secondaryLinkText: 'টেলিগ্রাম চ্যানেলে যুক্ত হোন',
  secondaryPlatform: 'telegram',
  badgeText: 'বিনামূল্যে স্টাডি মেটেরিয়াল ও সাপোর্ট',
  highlightPoints: [
    'দৈনিক জাপানি শব্দ ও ব্যাকরণ প্র্যাকটিস',
    'ফ্রি PDF শিট ও লেকচার নোটস কালেকশন',
    'JLPT N5 প্রশ্নব্যাংক ও এক্সপার্ট ডিসকাশন'
  ],
  snoozeHours: 6,
  updatedAt: Date.now(),
  updatedBy: 'Admin'
};

export const communityService = {
  /**
   * Fetch current popup configuration from server with fallback to localStorage
   */
  async getPopupConfig(): Promise<CommunityPopupConfig> {
    try {
      const res = await fetch(`/api/community-popup?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.config) {
          try {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(json.config));
          } catch {
            // ignore
          }
          return json.config;
        }
      }
    } catch (e) {
      console.warn('Could not fetch community popup config from server, checking local cache:', e);
    }

    try {
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_COMMUNITY_CONFIG, ...parsed };
        }
      }
    } catch {
      // ignore
    }

    return DEFAULT_COMMUNITY_CONFIG;
  },

  /**
   * Save community popup configuration as Admin
   */
  async savePopupConfig(
    config: Partial<CommunityPopupConfig>,
    adminEmail?: string,
    passkey?: string
  ): Promise<{ success: boolean; config?: CommunityPopupConfig; error?: string }> {
    try {
      const res = await fetch('/api/admin/community-popup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          adminEmail,
          passkey
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || 'সংরক্ষণ ব্যর্থ হয়েছে' };
      }

      try {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(json.config));
      } catch {
        // ignore
      }

      // Notify any listeners across the app
      window.dispatchEvent(new CustomEvent('chandu_community_popup_updated', { detail: json.config }));

      return { success: true, config: json.config };
    } catch (err: any) {
      return { success: false, error: err.message || 'সার্ভার যোগাযোগ ত্রুটি' };
    }
  },

  /**
   * Upload an image banner for the community popup
   */
  async uploadBannerImage(
    file: File,
    adminEmail?: string,
    passkey?: string
  ): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/admin/community-popup/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          fileName: file.name,
          adminEmail,
          passkey
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || 'ছবি আপলোড ব্যর্থ হয়েছে' };
      }

      return { success: true, imageUrl: json.imageUrl };
    } catch (err: any) {
      return { success: false, error: err.message || 'ছবি প্রসেস করতে ব্যর্থ হয়েছে' };
    }
  },

  /**
   * Check if the user has snoozed this popup (e.g. for 6 hours)
   */
  isSnoozed(): boolean {
    try {
      const stored = localStorage.getItem(SNOOZE_STORAGE_KEY);
      if (!stored) return false;
      const expireTime = Number(stored);
      if (isNaN(expireTime)) return false;
      return Date.now() < expireTime;
    } catch {
      return false;
    }
  },

  /**
   * Snooze the popup for the specified hours (default: 6 hours)
   */
  snooze(hours: number = 6): void {
    try {
      const ms = Math.max(1, hours) * 60 * 60 * 1000;
      const expireTime = Date.now() + ms;
      localStorage.setItem(SNOOZE_STORAGE_KEY, String(expireTime));
    } catch {
      // ignore
    }
  },

  /**
   * Clear snooze so the popup can show again immediately
   */
  clearSnooze(): void {
    try {
      localStorage.removeItem(SNOOZE_STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Get remaining snooze hours/minutes as readable string
   */
  getSnoozeRemainingTime(): string | null {
    try {
      const stored = localStorage.getItem(SNOOZE_STORAGE_KEY);
      if (!stored) return null;
      const expireTime = Number(stored);
      const remainingMs = expireTime - Date.now();
      if (remainingMs <= 0) return null;

      const remainingMin = Math.ceil(remainingMs / (60 * 1000));
      if (remainingMin < 60) {
        return `${remainingMin} মিনিট`;
      }
      const hours = Math.floor(remainingMin / 60);
      const mins = remainingMin % 60;
      return mins > 0 ? `${hours} ঘণ্টা ${mins} মিনিট` : `${hours} ঘণ্টা`;
    } catch {
      return null;
    }
  }
};
