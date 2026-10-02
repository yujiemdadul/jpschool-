import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Server-side persistent storage file for cross-browser synchronization
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const PDFS_FILE = path.join(DATA_DIR, "pdfs.json");
const DELETED_PDFS_FILE = path.join(DATA_DIR, "deleted_pdfs.json");
const COMMUNITY_POPUP_FILE = path.join(DATA_DIR, "community_popup.json");

export interface ServerCommunityPopupConfig {
  id: string;
  isEnabled: boolean;
  titleBn: string;
  titleJp?: string;
  tagBn?: string;
  descriptionBn: string;
  imageUrl?: string;
  primaryLinkUrl: string;
  primaryLinkText: string;
  primaryPlatform: "facebook" | "telegram" | "whatsapp" | "discord" | "youtube" | "custom";
  secondaryLinkUrl?: string;
  secondaryLinkText?: string;
  secondaryPlatform?: "facebook" | "telegram" | "whatsapp" | "discord" | "youtube" | "custom";
  badgeText?: string;
  highlightPoints?: string[];
  snoozeHours: number;
  updatedAt: number;
  updatedBy?: string;
}

const DEFAULT_COMMUNITY_POPUP: ServerCommunityPopupConfig = {
  id: "community_popup",
  isEnabled: true,
  titleBn: "আমাদের অফিশিয়াল জাপানিজ লার্নিং কমিউনিটিতে স্বাগতম!",
  titleJp: "日本語学習コミュニティへようこそ！",
  tagBn: "Chandu Japanese School • অফিশিয়াল কমিউনিটি",
  descriptionBn: "জাপানি বর্ণমালা, শব্দভাণ্ডার ও JLPT N5 পরীক্ষার সেরা প্রস্তুতির জন্য আমাদের লার্নিং কমিউনিটিতে যুক্ত হোন। প্রতিদিনের প্রশ্ন-উত্তর, কুইজ আলোচনা ও এক্সক্লুসিভ স্টাডি শিট সবার আগে পেতে আমাদের গ্রুপ ও চ্যানেলে যোগ দিন!",
  imageUrl: "/community_banner.jpg",
  primaryLinkUrl: "https://www.facebook.com/groups/chandujapanese",
  primaryLinkText: "কমিউনিটিতে যোগ দিন 🚀",
  primaryPlatform: "facebook",
  secondaryLinkUrl: "https://t.me/chandujapaneseschool",
  secondaryLinkText: "টেলিগ্রাম চ্যানেলে যুক্ত হোন",
  secondaryPlatform: "telegram",
  badgeText: "বিনামূল্যে স্টাডি মেটেরিয়াল ও সাপোর্ট",
  highlightPoints: [
    "দৈনিক জাপানি শব্দ ও ব্যাকরণ প্র্যাকটিস",
    "ফ্রি PDF শিট ও লেকচার নোটস কালেকশন",
    "JLPT N5 প্রশ্নব্যাংক ও এক্সপার্ট ডিসকাশন"
  ],
  snoozeHours: 6,
  updatedAt: Date.now(),
  updatedBy: "Admin"
};

let communityPopupCache: ServerCommunityPopupConfig = { ...DEFAULT_COMMUNITY_POPUP };

const ADMIN_EMAILS = [
  "emdadulff12@gmail.com",
  "gy755803@gmail.com"
];
const ADMIN_EMAIL = "emdadulff12@gmail.com";
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "chandu-admin-pass-2026";
const APP_START_TIME = Date.now();
let lastDataUpdateTime = Date.now();

// Prevent aggressive caching of API responses across all browsers & clients
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// App version endpoint for instant client update detection
app.get("/api/version", (req, res) => {
  res.json({
    success: true,
    version: "2.1.1",
    buildTime: APP_START_TIME,
    dataUpdateTime: lastDataUpdateTime,
    pdfCount: Object.keys(pdfsCache).length,
    adminEmails: ADMIN_EMAILS,
    adminEmail: ADMIN_EMAIL
  });
});

// Admin passcode verification endpoint
app.post("/api/admin/verify", (req, res) => {
  const { email, passkey } = req.body || {};
  const cleanEmail = (email || "").toString().toLowerCase().trim();
  const cleanKey = (passkey || "").toString().trim();

  const isKeyValid = cleanKey === ADMIN_SECRET_KEY;
  const isEmailValid = cleanEmail && ADMIN_EMAILS.includes(cleanEmail);

  if (isKeyValid || isEmailValid) {
    res.json({
      success: true,
      adminEmail: cleanEmail || ADMIN_EMAIL,
      adminKey: ADMIN_SECRET_KEY,
      message: "এডমিন সফলভাবে ভেরিফাইড হয়েছে"
    });
  } else {
    res.status(401).json({
      success: false,
      error: "ভুল এডমিন ইমেইল অথবা সিক্রেট পাসওয়ার্ড! শুধুমাত্র অনুমোদিত এডমিন প্রবেশ করতে পারবেন।"
    });
  }
});

export interface ServerJapanesePdf {
  id: string;
  titleBn: string;
  titleJp?: string;
  descriptionBn: string;
  category: "grammar" | "kanji" | "vocabulary" | "writing" | "jlpt" | "conversation" | "guide";
  level: "all" | "N5" | "N4" | "N3" | "beginner";
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  pageCount?: number;
  uploadedBy: string;
  uploadedAt: number;
  downloadCount: number;
  viewCount?: number;
  isFeatured?: boolean;
  driveUrl?: string;
  localFilePath?: string;
}

let pdfsCache: Record<string, ServerJapanesePdf> = {};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * Creates a valid, standard-compliant multi-page PDF-1.4 binary buffer
 */
interface PdfPageData {
  title: string;
  subtitle: string;
  lines: string[];
}

function createMultiPagePdfBuffer(pages: PdfPageData[]): Buffer {
  const pageCount = Math.max(1, pages.length);
  const fontObjId = 3;

  const pageObjIds: number[] = [];
  for (let i = 0; i < pageCount; i++) {
    pageObjIds.push(4 + i * 2);
  }

  let body = "";
  const offsets: number[] = [0];
  const header = "%PDF-1.4\n";

  const appendObj = (id: number, content: string) => {
    offsets[id] = Buffer.byteLength(header + body, "utf-8");
    body += `${id} 0 obj\n${content}\nendobj\n`;
  };

  // Obj 1: Catalog
  appendObj(1, `<< /Type /Catalog /Pages 2 0 R >>`);

  // Obj 2: Pages
  const kidsStr = pageObjIds.map(id => `${id} 0 R`).join(" ");
  appendObj(2, `<< /Type /Pages /Kids [${kidsStr}] /Count ${pageCount} >>`);

  // Obj 3: Standard Font
  appendObj(3, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);

  // Each Page & Stream
  for (let i = 0; i < pageCount; i++) {
    const p = pages[i] || { title: "Chandu Japanese School", subtitle: "", lines: [] };
    const pageObjId = 4 + i * 2;
    const contentObjId = pageObjId + 1;

    // Page object
    appendObj(pageObjId, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentObjId} 0 R /Resources << /Font << /F1 ${fontObjId} 0 R >> >> >>`);

    // Page content stream
    const pageNumberText = `Page ${i + 1} of ${pageCount}`;
    const safeTitle = (p.title || "").replace(/[()\\]/g, "\\$&");
    const safeSubtitle = (p.subtitle || "").replace(/[()\\]/g, "\\$&");

    const streamLines = [
      "BT",
      "/F1 18 Tf",
      "50 740 Td",
      `(${safeTitle}) Tj`,
      "/F1 12 Tf",
      "0 -26 Td",
      `(${safeSubtitle}) Tj`,
      "/F1 10 Tf",
      "0 -24 Td",
      ...p.lines.map(line => `0 -18 Td (${line.replace(/[()\\]/g, "\\$&")}) Tj`),
      "0 -40 Td",
      "/F1 9 Tf",
      `(${pageNumberText}   |   Chandu Japanese School) Tj`,
      "ET"
    ].join("\n");

    const streamLen = Buffer.byteLength(streamLines, "utf-8");
    appendObj(contentObjId, `<< /Length ${streamLen} >>\nstream\n${streamLines}\nendstream`);
  }

  const totalObjects = 4 + pageCount * 2;
  const startXref = Buffer.byteLength(header + body, "utf-8");

  let xref = `xref\n0 ${totalObjects}\n0000000000 65535 f \n`;
  for (let id = 1; id < totalObjects; id++) {
    const off = offsets[id] || 0;
    xref += off.toString().padStart(10, "0") + " 00000 n \n";
  }

  const trailer = `trailer\n<< /Size ${totalObjects} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
  return Buffer.from(header + body + xref + trailer, "utf-8");
}

function createMinimalPdfBuffer(title: string, subtitle: string, lines: string[]): Buffer {
  return createMultiPagePdfBuffer([{ title, subtitle, lines }]);
}

interface ServerUserProfile {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  createdAt?: number;
  lastLogin?: number;
  xp: number;
  streak: number;
  lastStudyDate?: string;
  hiraganaProgress?: {
    completedLevels: number[];
    completedChars: string[];
    lastLevel: number;
  };
  katakanaProgress?: {
    completedLevels: number[];
    completedChars: string[];
    lastLevel: number;
  };
  quizStats?: {
    totalQuizzes: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
  };
  achievements?: string[];
  dailyXpHistory?: Record<string, number>;
  mistakes?: any[];
  scriptLanguage?: string;
  isGuest?: boolean;
}

// In-memory cache synced with disk
let usersCache: Record<string, ServerUserProfile> = {};

function initStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // 1. Users storage
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf-8");
      usersCache = JSON.parse(raw) || {};
      console.log(`📦 Loaded ${Object.keys(usersCache).length} user profiles from persistent storage`);
    } else {
      fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2), "utf-8");
      usersCache = {};
    }

    // 2. PDFs storage
    if (fs.existsSync(PDFS_FILE)) {
      const rawPdf = fs.readFileSync(PDFS_FILE, "utf-8");
      pdfsCache = JSON.parse(rawPdf) || {};
      console.log(`📚 Loaded ${Object.keys(pdfsCache).length} PDF documents from persistent storage`);
    } else {
      pdfsCache = {};
    }

    // 3. Deleted PDFs storage (never restore PDFs that an admin deliberately deleted)
    if (fs.existsSync(DELETED_PDFS_FILE)) {
      try {
        const rawDel = fs.readFileSync(DELETED_PDFS_FILE, "utf-8");
        const list = JSON.parse(rawDel);
        if (Array.isArray(list)) {
          deletedPdfIds = new Set(list);
          console.log(`🗑️ Loaded ${deletedPdfIds.size} deleted PDF records from storage`);
        }
      } catch (e) {
        console.warn("Deleted PDFs load error:", e);
      }
    } else {
      deletedPdfIds = new Set();
    }

    // 4. Community Popup Storage
    if (fs.existsSync(COMMUNITY_POPUP_FILE)) {
      try {
        const rawPop = fs.readFileSync(COMMUNITY_POPUP_FILE, "utf-8");
        const parsed = JSON.parse(rawPop);
        if (parsed && typeof parsed === "object") {
          communityPopupCache = { ...DEFAULT_COMMUNITY_POPUP, ...parsed };
          console.log(`📢 Loaded community popup configuration: "${communityPopupCache.titleBn}"`);
        }
      } catch (e) {
        console.warn("Community popup load error:", e);
        communityPopupCache = { ...DEFAULT_COMMUNITY_POPUP };
      }
    } else {
      communityPopupCache = { ...DEFAULT_COMMUNITY_POPUP };
      persistCommunityPopupStorage();
    }
  } catch (err) {
    console.error("Storage initialization error:", err);
    usersCache = {};
    pdfsCache = {};
    communityPopupCache = { ...DEFAULT_COMMUNITY_POPUP };
  }
}

let deletedPdfIds = new Set<string>();

function persistCommunityPopupStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${COMMUNITY_POPUP_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(communityPopupCache, null, 2), "utf-8");
    fs.renameSync(tempFile, COMMUNITY_POPUP_FILE);
  } catch (err) {
    console.error("Community popup persistence error:", err);
  }
}

function persistDeletedPdfsStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DELETED_PDFS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(Array.from(deletedPdfIds), null, 2), "utf-8");
    fs.renameSync(tempFile, DELETED_PDFS_FILE);
  } catch (err) {
    console.error("Deleted PDFs persistence error:", err);
  }
}

function persistStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${USERS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(usersCache, null, 2), "utf-8");
    fs.renameSync(tempFile, USERS_FILE);
  } catch (err) {
    console.error("Storage persistence error:", err);
  }
}

function persistPdfsStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${PDFS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(pdfsCache, null, 2), "utf-8");
    fs.renameSync(tempFile, PDFS_FILE);
  } catch (err) {
    console.error("PDF Storage persistence error:", err);
  }
}

/**
 * Safely merges an incoming profile with an existing profile so that
 * higher XP, higher streak, completed levels, and learned characters
 * are never lost or zeroed out across browsers or sessions.
 */
function mergeProfiles(existing: ServerUserProfile, incoming: ServerUserProfile): ServerUserProfile {
  const mergedXp = Math.max(Number(existing.xp) || 0, Number(incoming.xp) || 0);
  const mergedStreak = Math.max(Number(existing.streak) || 1, Number(incoming.streak) || 1);

  // Hiragana progress union
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

  // Katakana progress union
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

  // Achievements union
  const mergedAchievements = Array.from(new Set([
    ...(existing.achievements || []),
    ...(incoming.achievements || [])
  ]));

  // Quiz stats merge
  const eQ = existing.quizStats || { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, accuracy: 100 };
  const iQ = incoming.quizStats || { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, accuracy: 100 };
  const totalQuizzes = Math.max(eQ.totalQuizzes, iQ.totalQuizzes);
  const totalQuestions = Math.max(eQ.totalQuestions, iQ.totalQuestions);
  const correctAnswers = Math.max(eQ.correctAnswers, iQ.correctAnswers);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;

  // Daily XP history merge
  const dailyMap: Record<string, number> = {};
  if (existing.dailyXpHistory && typeof existing.dailyXpHistory === "object") {
    Object.entries(existing.dailyXpHistory).forEach(([date, xp]) => {
      dailyMap[date] = Number(xp) || 0;
    });
  }
  if (incoming.dailyXpHistory && typeof incoming.dailyXpHistory === "object") {
    Object.entries(incoming.dailyXpHistory).forEach(([date, xp]) => {
      dailyMap[date] = Math.max(dailyMap[date] || 0, Number(xp) || 0);
    });
  }

  // Last study date: latest non-empty date
  const lastStudyDate = [existing.lastStudyDate, incoming.lastStudyDate]
    .filter(Boolean)
    .sort()
    .pop() || new Date().toISOString().split("T")[0];

  return {
    uid: incoming.uid || existing.uid,
    displayName: (incoming.displayName && incoming.displayName !== "শিক্ষার্থী" ? incoming.displayName : existing.displayName) || "শিক্ষার্থী",
    email: incoming.email || existing.email || "",
    photoURL: incoming.photoURL || existing.photoURL || "",
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
    scriptLanguage: incoming.scriptLanguage || existing.scriptLanguage || "bangla",
    isGuest: Boolean(existing.isGuest && incoming.isGuest)
  };
}

initStorage();

// API ROUTES
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    totalUsers: Object.keys(usersCache).length,
    timestamp: Date.now()
  });
});

// Get user profile by UID
app.get("/api/users/:uid", (req, res) => {
  const { uid } = req.params;
  const user = usersCache[uid];
  if (user) {
    res.json({ success: true, profile: user });
  } else {
    res.status(404).json({ success: false, error: "User not found" });
  }
});

// Get user profile by Email (critical for cross-browser restoration)
app.get("/api/users/by-email/:email", (req, res) => {
  const targetEmail = decodeURIComponent(req.params.email).toLowerCase().trim();
  if (!targetEmail) {
    res.status(400).json({ success: false, error: "Email required" });
    return;
  }

  const found = Object.values(usersCache).find(
    u => u.email && u.email.toLowerCase().trim() === targetEmail
  );

  if (found) {
    res.json({ success: true, profile: found });
  } else {
    res.status(404).json({ success: false, error: "User not found by email" });
  }
});

// Save or merge user profile
app.post("/api/users", (req, res) => {
  const incoming = (req.body.profile || req.body) as ServerUserProfile;
  if (!incoming || !incoming.uid) {
    res.status(400).json({ success: false, error: "Valid user profile with uid required" });
    return;
  }

  // Also check if an existing profile exists under the same email but different UID
  let existingByEmailKey: string | null = null;
  if (incoming.email && incoming.email.trim()) {
    const cleanEmail = incoming.email.toLowerCase().trim();
    for (const [key, val] of Object.entries(usersCache)) {
      if (val.email && val.email.toLowerCase().trim() === cleanEmail) {
        existingByEmailKey = key;
        break;
      }
    }
  }

  const existing = usersCache[incoming.uid] || (existingByEmailKey ? usersCache[existingByEmailKey] : null);

  let merged: ServerUserProfile;
  if (existing) {
    merged = mergeProfiles(existing, incoming);
    // If UID changed or was matched by email, ensure target UID is set
    merged.uid = incoming.uid;
  } else {
    merged = {
      ...incoming,
      xp: Number(incoming.xp) || 0,
      streak: Number(incoming.streak) || 1,
      lastLogin: Date.now()
    };
  }

  usersCache[incoming.uid] = merged;
  if (existingByEmailKey && existingByEmailKey !== incoming.uid) {
    // Keep secondary link updated
    usersCache[existingByEmailKey] = { ...merged, uid: existingByEmailKey };
  }

  persistStorage();
  res.json({ success: true, profile: merged });
});

// Batch sync for initial migration from local storage
app.post("/api/users/sync-batch", (req, res) => {
  const profiles = (req.body.profiles || []) as ServerUserProfile[];
  let updatedCount = 0;

  for (const p of profiles) {
    if (!p || !p.uid) continue;
    const existing = usersCache[p.uid];
    if (existing) {
      usersCache[p.uid] = mergeProfiles(existing, p);
    } else {
      usersCache[p.uid] = {
        ...p,
        xp: Number(p.xp) || 0,
        streak: Number(p.streak) || 1
      };
    }
    updatedCount++;
  }

  if (updatedCount > 0) {
    persistStorage();
  }

  res.json({ success: true, count: updatedCount });
});

// Centralized Global Leaderboard across all browsers and devices
app.get("/api/leaderboard", (req, res) => {
  const sortBy = req.query.sortBy === "streak" ? "streak" : "xp";

  const entries = Object.values(usersCache)
    .filter(u => {
      if (!u || u.isGuest) return false;
      const name = (u.displayName || "").trim();
      if (!name || name === "গেস্ট শিক্ষার্থী") return false;
      return true;
    })
    .map(u => {
      const hLevels = u.hiraganaProgress?.completedLevels?.length || 0;
      const kLevels = u.katakanaProgress?.completedLevels?.length || 0;
      const totalChars = (u.hiraganaProgress?.completedChars?.length || 0) +
                         (u.katakanaProgress?.completedChars?.length || 0);

      return {
        uid: u.uid,
        displayName: u.displayName.trim(),
        email: u.email || "",
        photoURL: u.photoURL || "",
        xp: Number(u.xp) || 0,
        streak: Number(u.streak) || 1,
        hiraganaLevelsCount: hLevels,
        katakanaLevelsCount: kLevels,
        totalCompletedChars: totalChars,
        lastLogin: u.lastLogin || Date.now()
      };
    });

  if (sortBy === "streak") {
    entries.sort((a, b) => (b.streak - a.streak) || (b.xp - a.xp) || a.displayName.localeCompare(b.displayName));
  } else {
    entries.sort((a, b) => (b.xp - a.xp) || (b.streak - a.streak) || a.displayName.localeCompare(b.displayName));
  }

  res.json({ success: true, entries });
});

// ==========================================
// JAPANESE PDF LIBRARY REST API ENDPOINTS
// Admin: emdadulff12@gmail.com
// ==========================================

function checkAdminAuth(req: express.Request): boolean {
  const reqEmail = (
    req.body?.adminEmail || 
    req.headers["x-admin-email"] || 
    req.query.adminEmail || 
    ""
  ).toString().toLowerCase().trim();

  const reqKey = (
    req.headers["x-admin-key"] || 
    req.body?.adminKey || 
    req.query?.adminKey || 
    ""
  ).toString().trim();

  // 1. Authorized if secret passcode matches
  if (reqKey && reqKey === ADMIN_SECRET_KEY) {
    return true;
  }

  // 2. Authorized if email belongs to approved admins
  if (reqEmail && ADMIN_EMAILS.includes(reqEmail)) {
    return true;
  }

  return false;
}

// 1. Get all Japanese PDFs
app.get("/api/pdfs", (req, res) => {
  const list = Object.values(pdfsCache);
  // Sort: featured first, then newest
  list.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return (b.uploadedAt || 0) - (a.uploadedAt || 0);
  });
  res.json({
    success: true,
    total: list.length,
    adminEmails: ADMIN_EMAILS,
    adminEmail: ADMIN_EMAIL,
    lastDataUpdateTime,
    pdfs: list
  });
});

// 2. Stream/Download a PDF file safely
app.get("/api/pdfs/file/:filename", (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const targetPath = path.join(UPLOADS_DIR, safeFilename);

  if (!fs.existsSync(targetPath)) {
    res.status(404).send("PDF file not found");
    return;
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${safeFilename}"`);
  res.setHeader("Cache-Control", "public, max-age=86400");

  const stream = fs.createReadStream(targetPath);
  stream.pipe(res);
});

// 3. Upload a new Japanese PDF (Admin only)
app.post("/api/pdfs", (req, res) => {
  if (!checkAdminAuth(req)) {
    res.status(403).json({
      success: false,
      error: `শুধুমাত্র অনুমোদিত এডমিন জাপানিজ PDF আপলোড করতে পারবেন।`
    });
    return;
  }

  const {
    titleBn,
    titleJp,
    descriptionBn,
    category = "guide",
    level = "all",
    fileBase64,
    fileName,
    fileUrl,
    isFeatured = false,
    driveUrl
  } = req.body;

  if (!titleBn || !titleBn.trim()) {
    res.status(400).json({ success: false, error: "PDF এর বাংলা শিরোনাম প্রদান করা আবশ্যক।" });
    return;
  }

  const newId = `pdf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let finalFileUrl = fileUrl || "";
  let finalFileName = fileName || `${titleBn.trim().replace(/\s+/g, "_")}.pdf`;
  let fileSizeBytes = 0;
  let localFilePath: string | undefined = undefined;

  // If base64 file data is uploaded
  if (fileBase64) {
    try {
      // Remove data:application/pdf;base64, prefix if present
      const cleanBase64 = fileBase64.replace(/^data:application\/pdf;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");
      
      const safeName = `${Date.now()}_${finalFileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const destPath = path.join(UPLOADS_DIR, safeName);
      
      fs.writeFileSync(destPath, buffer);
      
      fileSizeBytes = buffer.length;
      finalFileUrl = `/api/pdfs/file/${safeName}`;
      finalFileName = safeName;
      localFilePath = destPath;
    } catch (e: any) {
      console.error("PDF upload save error:", e);
      res.status(500).json({ success: false, error: "PDF ফাইল সংরক্ষণে সমস্যা হয়েছে: " + e?.message });
      return;
    }
  } else if (!finalFileUrl && !driveUrl) {
    res.status(400).json({ success: false, error: "একটি PDF ফাইল অথবা ডাউনলোড লিঙ্ক নির্বাচন করুন।" });
    return;
  }

  const uploaderEmail = (req.body.adminEmail || ADMIN_EMAIL).toString();

  const newPdf: ServerJapanesePdf = {
    id: newId,
    titleBn: titleBn.trim(),
    titleJp: titleJp?.trim() || "",
    descriptionBn: descriptionBn?.trim() || "",
    category: category as any,
    level: level as any,
    fileUrl: finalFileUrl || driveUrl || "",
    fileName: finalFileName,
    fileSizeBytes: fileSizeBytes,
    fileSizeFormatted: formatBytes(fileSizeBytes || 500000),
    pageCount: req.body.pageCount || undefined,
    uploadedBy: uploaderEmail,
    uploadedAt: Date.now(),
    downloadCount: 0,
    viewCount: 0,
    isFeatured: Boolean(isFeatured),
    driveUrl: driveUrl || undefined,
    localFilePath
  };

  pdfsCache[newId] = newPdf;
  persistPdfsStorage();
  lastDataUpdateTime = Date.now();

  console.log(`✅ [Admin] New Japanese PDF uploaded by ${uploaderEmail}: "${newPdf.titleBn}"`);
  res.json({ success: true, pdf: newPdf });
});

// 4. Update PDF metadata (Admin only)
app.put("/api/pdfs/:id", (req, res) => {
  if (!checkAdminAuth(req)) {
    res.status(403).json({ success: false, error: "এডমিন অনুমতি প্রয়োজন" });
    return;
  }

  const { id } = req.params;
  const existing = pdfsCache[id];
  if (!existing) {
    res.status(404).json({ success: false, error: "PDF পাওয়া যায়নি" });
    return;
  }

  const { titleBn, titleJp, descriptionBn, category, level, isFeatured, driveUrl, pageCount, fileName, fileUrl } = req.body;
  
  if (titleBn) existing.titleBn = titleBn.trim();
  if (titleJp !== undefined) existing.titleJp = titleJp.trim();
  if (descriptionBn !== undefined) existing.descriptionBn = descriptionBn.trim();
  if (category) existing.category = category;
  if (level) existing.level = level;
  if (isFeatured !== undefined) existing.isFeatured = Boolean(isFeatured);
  if (driveUrl !== undefined) existing.driveUrl = driveUrl;
  if (pageCount !== undefined) existing.pageCount = pageCount ? parseInt(String(pageCount), 10) : undefined;
  if (fileName) existing.fileName = fileName.trim();
  if (fileUrl) existing.fileUrl = fileUrl.trim();
  else if (driveUrl && !existing.fileUrl.startsWith("/api/pdfs/file/")) existing.fileUrl = driveUrl.trim();

  persistPdfsStorage();
  lastDataUpdateTime = Date.now();
  res.json({ success: true, pdf: existing });
});

// 5. Delete PDF (Admin only)
app.delete("/api/pdfs/:id", (req, res) => {
  if (!checkAdminAuth(req)) {
    res.status(403).json({ success: false, error: "এডমিন অনুমতি প্রয়োজন" });
    return;
  }

  const { id } = req.params;
  const existing = pdfsCache[id];

  // 1. Delete physical files if present
  if (existing) {
    if (existing.localFilePath) {
      try {
        if (fs.existsSync(existing.localFilePath)) {
          fs.unlinkSync(existing.localFilePath);
        }
      } catch (err) {
        console.warn("Could not delete localFilePath:", err);
      }
    }

    if (existing.fileName) {
      try {
        const filePath = path.join(UPLOADS_DIR, path.basename(existing.fileName));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn("Could not delete physical PDF file:", err);
      }
    }

    if (existing.fileUrl && existing.fileUrl.startsWith("/api/pdfs/file/")) {
      try {
        const rawName = existing.fileUrl.replace("/api/pdfs/file/", "");
        const filePath = path.join(UPLOADS_DIR, path.basename(rawName));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn("Could not delete fileUrl path:", err);
      }
    }

    delete pdfsCache[id];
    persistPdfsStorage();
  }

  // 2. Mark in deletedPdfIds so starter seed never restores it
  deletedPdfIds.add(id);
  persistDeletedPdfsStorage();
  lastDataUpdateTime = Date.now();

  console.log(`🗑️ [Admin] PDF deleted permanently: id ${id}`);
  res.json({ success: true, id, message: "PDF সফলভাবে মুছে ফেলা হয়েছে" });
});

// 6. Track PDF download count
app.post("/api/pdfs/:id/download", (req, res) => {
  const { id } = req.params;
  const existing = pdfsCache[id];
  if (existing) {
    existing.downloadCount = (existing.downloadCount || 0) + 1;
    persistPdfsStorage();
    res.json({ success: true, downloadCount: existing.downloadCount });
  } else {
    res.status(404).json({ success: false, error: "PDF not found" });
  }
});

// 7. Track PDF online view count
app.post("/api/pdfs/:id/view", (req, res) => {
  const { id } = req.params;
  const existing = pdfsCache[id];
  if (existing) {
    existing.viewCount = (existing.viewCount || 0) + 1;
    persistPdfsStorage();
    res.json({ success: true, viewCount: existing.viewCount });
  } else {
    res.status(404).json({ success: false, error: "PDF not found" });
  }
});

// ==========================================
// 8. COMMUNITY POST / ENTRY POPUP ENDPOINTS
// ==========================================

// Get current community popup configuration
app.get("/api/community-popup", (req, res) => {
  res.json({
    success: true,
    config: communityPopupCache
  });
});

// Admin updates community popup configuration
app.post("/api/admin/community-popup", (req, res) => {
  const { config, adminEmail, passkey } = req.body || {};
  const cleanEmail = (adminEmail || "").toString().toLowerCase().trim();
  const cleanKey = (passkey || "").toString().trim();

  const isEmailAdmin = cleanEmail && ADMIN_EMAILS.includes(cleanEmail);
  const isKeyAdmin = cleanKey === ADMIN_SECRET_KEY;

  if (!isEmailAdmin && !isKeyAdmin) {
    res.status(403).json({
      success: false,
      error: "অননুমোদিত এডমিন! শুধুমাত্র অনুমোদিত এডমিন কমিউনিটি পোস্ট পরিবর্তন করতে পারবেন।"
    });
    return;
  }

  if (!config || typeof config !== "object") {
    res.status(400).json({ success: false, error: "ইনভ্যালিড কনফিগারেশন ডাটা" });
    return;
  }

  // Update popup configuration with validated fields
  communityPopupCache = {
    ...communityPopupCache,
    ...config,
    id: "community_popup",
    isEnabled: Boolean(config.isEnabled),
    titleBn: (config.titleBn || communityPopupCache.titleBn || "আমাদের অফিশিয়াল জাপানিজ লার্নিং কমিউনিটিতে স্বাগতম!").trim(),
    titleJp: config.titleJp ? config.titleJp.trim() : undefined,
    tagBn: config.tagBn ? config.tagBn.trim() : "Chandu Japanese School • অফিশিয়াল কমিউনিটি",
    descriptionBn: (config.descriptionBn || communityPopupCache.descriptionBn).trim(),
    imageUrl: config.imageUrl || communityPopupCache.imageUrl || "/community_banner.jpg",
    primaryLinkUrl: (config.primaryLinkUrl || communityPopupCache.primaryLinkUrl).trim(),
    primaryLinkText: (config.primaryLinkText || communityPopupCache.primaryLinkText || "কমিউনিটিতে যোগ দিন 🚀").trim(),
    primaryPlatform: config.primaryPlatform || "facebook",
    secondaryLinkUrl: config.secondaryLinkUrl ? config.secondaryLinkUrl.trim() : undefined,
    secondaryLinkText: config.secondaryLinkText ? config.secondaryLinkText.trim() : undefined,
    secondaryPlatform: config.secondaryPlatform || "telegram",
    badgeText: config.badgeText ? config.badgeText.trim() : undefined,
    highlightPoints: Array.isArray(config.highlightPoints) ? config.highlightPoints.filter(Boolean) : communityPopupCache.highlightPoints,
    snoozeHours: Math.max(1, Math.min(168, Number(config.snoozeHours) || 6)), // default 6 hours
    updatedAt: Date.now(),
    updatedBy: cleanEmail || "Admin"
  };

  persistCommunityPopupStorage();
  lastDataUpdateTime = Date.now();

  console.log(`📢 [Admin] Community popup updated: "${communityPopupCache.titleBn}" (isEnabled: ${communityPopupCache.isEnabled})`);

  res.json({
    success: true,
    config: communityPopupCache,
    message: "কমিউনিটি পোস্ট সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!"
  });
});

// Admin uploads an image for the community banner
app.post("/api/admin/community-popup/upload-image", (req, res) => {
  const { imageBase64, fileName, adminEmail, passkey } = req.body || {};
  const cleanEmail = (adminEmail || "").toString().toLowerCase().trim();
  const cleanKey = (passkey || "").toString().trim();

  const isEmailAdmin = cleanEmail && ADMIN_EMAILS.includes(cleanEmail);
  const isKeyAdmin = cleanKey === ADMIN_SECRET_KEY;

  if (!isEmailAdmin && !isKeyAdmin) {
    res.status(403).json({ success: false, error: "অননুমোদিত এক্সেস" });
    return;
  }

  if (!imageBase64 || typeof imageBase64 !== "string") {
    res.status(400).json({ success: false, error: "কোনো ছবি পাওয়া যায়নি" });
    return;
  }

  try {
    // Strip data URI prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    if (buffer.length > 15 * 1024 * 1024) {
      res.status(400).json({ success: false, error: "ছবির সাইজ ১৫ মেগাবাইট এর বেশি হতে পারবে না" });
      return;
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const extMatch = imageBase64.match(/^data:image\/(\w+);base64,/);
    let ext = extMatch ? extMatch[1] : "jpg";
    if (ext === "jpeg") ext = "jpg";

    const cleanSafeName = (fileName || "community_banner")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_")
      .slice(0, 30);
    const targetFilename = `banner_${Date.now()}_${cleanSafeName}.${ext}`;
    const targetPath = path.join(UPLOADS_DIR, targetFilename);

    fs.writeFileSync(targetPath, buffer);

    const imageUrl = `/api/pdfs/file/${targetFilename}`;

    // Auto-update popup cache with newly uploaded image
    communityPopupCache.imageUrl = imageUrl;
    communityPopupCache.updatedAt = Date.now();
    persistCommunityPopupStorage();
    lastDataUpdateTime = Date.now();

    console.log(`🖼️ [Admin] Community banner image uploaded: ${targetFilename} (${buffer.length} bytes)`);

    res.json({
      success: true,
      imageUrl,
      message: "কমিউনিটি ব্যানার ছবি সফলভাবে আপলোড করা হয়েছে!"
    });
  } catch (err: any) {
    console.error("Community banner upload error:", err);
    res.status(500).json({ success: false, error: "ছবি সংরক্ষণ করতে ব্যর্থ হয়েছে: " + err.message });
  }
});

// Vite Middleware or Static Assets
async function start() {
  const server = http.createServer(app);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Hashed assets in /assets can be cached aggressively
    app.use("/assets", express.static(path.join(distPath, "assets"), {
      maxAge: "1y",
      immutable: true
    }));
    // Static root assets with anti-caching for HTML and SW
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html") || filePath.endsWith("sw.js")) {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        }
      }
    }));
    // SPA Fallback: NEVER cache index.html
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Chandu Japanese School server running at http://0.0.0.0:${PORT}`);
  });
}

start();
