import { JapanesePdf, PdfCategory, JlptLevel } from '../types';

export const ADMIN_EMAILS = [
  'emdadulff12@gmail.com',
  'gy755803@gmail.com'
];
export const ADMIN_EMAIL = 'emdadulff12@gmail.com';
export const ADMIN_PASSCODE_STORAGE_KEY = 'chandu_admin_secret_key';
export const DEFAULT_ADMIN_PASSCODE = 'chandu-admin-pass-2026';

const LOCAL_PDFS_CACHE_KEY = 'chandu_cached_japanese_pdfs';

export const getStoredAdminKey = (): string => {
  return localStorage.getItem(ADMIN_PASSCODE_STORAGE_KEY) || DEFAULT_ADMIN_PASSCODE;
};

export const setStoredAdminKey = (key: string): void => {
  localStorage.setItem(ADMIN_PASSCODE_STORAGE_KEY, key);
};

export const clearStoredAdminKey = (): void => {
  localStorage.removeItem(ADMIN_PASSCODE_STORAGE_KEY);
};

export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

export interface UploadPdfPayload {
  titleBn: string;
  titleJp?: string;
  descriptionBn: string;
  category: PdfCategory;
  level: JlptLevel;
  fileBase64?: string;
  fileName?: string;
  fileUrl?: string;
  driveUrl?: string;
  isFeatured?: boolean;
  pageCount?: number;
  adminEmail: string;
}

export const pdfService = {
  getAdminEmail(): string {
    return ADMIN_EMAIL;
  },

  isAdmin(email?: string | null): boolean {
    return isUserAdmin(email);
  },

  async verifyAdminCredentials(passkey: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, passkey })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStoredAdminKey(passkey);
        return true;
      }
      return false;
    } catch {
      return passkey === DEFAULT_ADMIN_PASSCODE;
    }
  },

  async fetchPdfs(): Promise<JapanesePdf[]> {
    try {
      const response = await fetch('/api/pdfs', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.pdfs)) {
        // Cache to localStorage for offline access (only real user uploads)
        try {
          localStorage.setItem(LOCAL_PDFS_CACHE_KEY, JSON.stringify(data.pdfs));
        } catch {
          // ignore quota error
        }
        return data.pdfs;
      }
      return [];
    } catch (err) {
      console.warn('Network error fetching PDFs, trying offline cache:', err);
      // Fallback to local cache, filtering out any legacy starter IDs
      const cached = localStorage.getItem(LOCAL_PDFS_CACHE_KEY);
      if (cached) {
        try {
          const list = JSON.parse(cached) as JapanesePdf[];
          if (Array.isArray(list)) {
            const starterIds = new Set(['pdf_hiragana_guide', 'pdf_katakana_guide', 'pdf_n5_grammar', 'pdf_n5_kanji', 'pdf_vocab_500', 'pdf_n5_model_test']);
            return list.filter(p => !starterIds.has(p.id));
          }
        } catch {
          // ignore
        }
      }
      return [];
    }
  },

  async uploadPdf(payload: UploadPdfPayload): Promise<JapanesePdf> {
    const adminKey = getStoredAdminKey();
    const res = await fetch('/api/pdfs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': payload.adminEmail || ADMIN_EMAIL,
        'x-admin-key': adminKey
      },
      body: JSON.stringify({ ...payload, adminKey })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'PDF আপলোড করতে ব্যর্থ হয়েছে');
    }

    // Immediately update localStorage cache
    try {
      const cached = localStorage.getItem(LOCAL_PDFS_CACHE_KEY);
      const arr = cached ? JSON.parse(cached) : [];
      if (Array.isArray(arr)) {
        localStorage.setItem(LOCAL_PDFS_CACHE_KEY, JSON.stringify([data.pdf, ...arr]));
      }
    } catch {
      // ignore
    }

    // Broadcast data update event for instant refresh across the app
    window.dispatchEvent(new CustomEvent('chandu_data_updated', { detail: { action: 'upload', pdf: data.pdf } }));

    return data.pdf;
  },

  async updatePdf(id: string, updates: Partial<JapanesePdf>, adminEmail: string): Promise<JapanesePdf> {
    const adminKey = getStoredAdminKey();
    const res = await fetch(`/api/pdfs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail || ADMIN_EMAIL,
        'x-admin-key': adminKey
      },
      body: JSON.stringify({ ...updates, adminEmail, adminKey })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'PDF আপডেট করতে ব্যর্থ হয়েছে');
    }

    // Update localStorage cache
    try {
      const cached = localStorage.getItem(LOCAL_PDFS_CACHE_KEY);
      if (cached) {
        const arr = JSON.parse(cached);
        if (Array.isArray(arr)) {
          const updated = arr.map((p: any) => p.id === id ? { ...p, ...data.pdf } : p);
          localStorage.setItem(LOCAL_PDFS_CACHE_KEY, JSON.stringify(updated));
        }
      }
    } catch {
      // ignore
    }

    window.dispatchEvent(new CustomEvent('chandu_data_updated', { detail: { action: 'update', pdf: data.pdf } }));

    return data.pdf;
  },

  async deletePdf(id: string, adminEmail: string): Promise<boolean> {
    const adminKey = getStoredAdminKey();
    const res = await fetch(`/api/pdfs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail || ADMIN_EMAIL,
        'x-admin-key': adminKey
      },
      body: JSON.stringify({ adminEmail, adminKey })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'PDF মুছতে ব্যর্থ হয়েছে');
    }

    // Immediately remove from localStorage cache so it never resurfaces offline
    try {
      const cached = localStorage.getItem(LOCAL_PDFS_CACHE_KEY);
      if (cached) {
        const arr = JSON.parse(cached);
        if (Array.isArray(arr)) {
          const filtered = arr.filter((p: any) => p && p.id !== id);
          localStorage.setItem(LOCAL_PDFS_CACHE_KEY, JSON.stringify(filtered));
        }
      }
    } catch {
      // ignore
    }

    // Broadcast delete event so all components refresh immediately
    window.dispatchEvent(new CustomEvent('chandu_data_updated', { detail: { action: 'delete', id } }));

    return true;
  },

  async trackDownload(id: string): Promise<void> {
    try {
      await fetch(`/api/pdfs/${id}/download`, {
        method: 'POST'
      });
    } catch {
      // Non-critical
    }
  },

  async trackView(id: string): Promise<number> {
    try {
      const res = await fetch(`/api/pdfs/${id}/view`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && typeof data.viewCount === 'number') {
        try {
          const cached = localStorage.getItem(LOCAL_PDFS_CACHE_KEY);
          if (cached) {
            const arr = JSON.parse(cached);
            if (Array.isArray(arr)) {
              const updated = arr.map((p: any) => p.id === id ? { ...p, viewCount: data.viewCount } : p);
              localStorage.setItem(LOCAL_PDFS_CACHE_KEY, JSON.stringify(updated));
            }
          }
        } catch {
          // ignore
        }
        return data.viewCount;
      }
    } catch {
      // Non-critical
    }
    return 0;
  }
};
