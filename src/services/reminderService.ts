// Service for managing browser-based Daily Study Reminders using the Notification API

export type NotificationSupportStatus = 'granted' | 'denied' | 'default' | 'unsupported';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const toBengaliDigits = (num: number | string): string => {
  return num.toString().replace(/\d/g, d => BENGALI_DIGITS[+d]);
};

// Converts 24-hour HH:MM string to Bengali natural phrase (e.g. "20:00" -> "রাত ০৮:০০ টা")
export const formatTimeBengali = (timeStr: string): string => {
  if (!timeStr || !timeStr.includes(':')) return 'রাত ০৮:০০ টা';
  
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) return 'রাত ০৮:০০ টা';

  let period = 'রাত';
  if (hour >= 4 && hour < 6) period = 'ভোর';
  else if (hour >= 6 && hour < 12) period = 'সকাল';
  else if (hour >= 12 && hour < 15) period = 'দুপুর';
  else if (hour >= 15 && hour < 18) period = 'বিকেল';
  else if (hour >= 18 && hour < 20) period = 'সন্ধ্যা';
  else period = 'রাত';

  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const formattedHour = toBengaliDigits(String(hour12).padStart(2, '0'));
  const formattedMinute = toBengaliDigits(String(minute).padStart(2, '0'));

  return `${period} ${formattedHour}:${formattedMinute} টা`;
};

// Preset study times with Bengali labels and friendly icons
export interface StudyTimePreset {
  time: string; // HH:MM
  label: string;
  period: string;
  icon: string;
  isDefault?: boolean;
}

export const STUDY_TIME_PRESETS: StudyTimePreset[] = [
  { time: '08:00', label: 'সকাল ০৮:০০', period: 'সকালের ফ্রেশ স্টার্ট', icon: '🌅' },
  { time: '13:00', label: 'দুপুর ০১:০০', period: 'দুপুরের বিরতিতে প্র্যাকটিস', icon: '☀️' },
  { time: '18:00', label: 'সন্ধ্যা ০৬:০০', period: 'সান্ধ্যকালীন রিভিশন', icon: '🌇' },
  { time: '20:00', label: 'রাত ০৮:০০', period: 'প্রধান স্টাডি আওয়ার (ডিফল্ট)', icon: '🌙', isDefault: true },
  { time: '21:30', label: 'রাত ০৯:৩০', period: 'রাতের কুইজ ও প্রগ্রেস', icon: '✨' },
  { time: '22:30', label: 'রাত ১০:৩০', period: 'ঘুমানোর আগের শেষ রিভিশন', icon: '🛏️' },
];

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationSupportStatus => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationSupportStatus> => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.warn('Notification permission request error:', error);
    return Notification.permission || 'denied';
  }
};

export interface StudyReminderPayload {
  title?: string;
  body?: string;
  streak?: number;
}

// Icon for the notification
const NOTIFICATION_ICON = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="24" fill="#e11d48"/>
  <circle cx="50" cy="50" r="32" fill="#ffffff" fill-opacity="0.2"/>
  <path d="M22 34 h56 M26 44 h48 M34 34 v46 M66 34 v46 M42 44 v36 M58 44 v36" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

export const sendStudyNotification = (options?: StudyReminderPayload): boolean => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const streak = options?.streak ?? 1;
    const title = options?.title || '🦊 জাপানি পড়ার সময় হয়েছে! (Study Reminder)';
    
    let body = options?.body;
    if (!body) {
      if (streak > 1) {
        body = `আজকের জাপানি বর্ণমালা ও কুইজ প্র্যাকটিস করে আপনার ${toBengaliDigits(streak)} দিনের স্ট্রিক বজায় রাখুন! 🔥`;
      } else {
        body = 'আজকের দৈনিক হিরাগানা ও কাতাকানা অনুশীলন সম্পন্ন করে দারুণ স্ট্রিক শুরু করুন! 🌸';
      }
    }

    const notificationOptions: NotificationOptions & { renotify?: boolean } = {
      body,
      icon: NOTIFICATION_ICON,
      badge: NOTIFICATION_ICON,
      tag: 'chandu-daily-study-reminder',
      renotify: true
    };

    const notification = new Notification(title, notificationOptions as NotificationOptions);

    notification.onclick = () => {
      try {
        window.focus();
      } catch {
        // Safe fallback
      }
      notification.close();
    };

    return true;
  } catch (err) {
    console.error('Failed to trigger browser notification:', err);
    return false;
  }
};

export const sendTestStudyReminder = (streak?: number): boolean => {
  return sendStudyNotification({
    title: '🔔 টেস্ট স্টাডি রিমাইন্ডার (Test Reminder)',
    body: 'অভিনন্দন! আপনার ব্রাউজারে দৈনিক স্টাডি রিমাইন্ডার সক্রিয় রয়েছে। প্রতিদিন পছন্দের সময়ে নোটিফিকেশন পৌঁছে যাবে! 🦊✨',
    streak: streak || 1
  });
};

const STORAGE_LAST_REMINDER_DATE = 'chandu_last_study_reminder_sent_date';

export const getTodayDateKey = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Check if a reminder should fire right now
export const checkAndTriggerDailyReminder = (
  enabled: boolean | undefined,
  preferredTime: string | undefined,
  streak?: number
): boolean => {
  if (!enabled || !preferredTime || !isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  const now = new Date();
  const currentHH = String(now.getHours()).padStart(2, '0');
  const currentMM = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHH}:${currentMM}`;

  const todayKey = getTodayDateKey();
  const lastSent = localStorage.getItem(STORAGE_LAST_REMINDER_DATE);

  // If time matches and not sent today
  if (currentTime === preferredTime && lastSent !== todayKey) {
    const sent = sendStudyNotification({ streak });
    if (sent) {
      localStorage.setItem(STORAGE_LAST_REMINDER_DATE, todayKey);
      return true;
    }
  }

  return false;
};
