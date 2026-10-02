import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  Clock, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Info, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  isNotificationSupported, 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendTestStudyReminder,
  formatTimeBengali,
  STUDY_TIME_PRESETS,
  toBengaliDigits,
  NotificationSupportStatus
} from '../../services/reminderService';
import { playKitsuneChime } from '../../utils/speech';

export const DailyStudyReminderCard: React.FC = () => {
  const { 
    userProfile, 
    setStudyReminderEnabled, 
    setStudyReminderTime 
  } = useAuth();

  const [permissionStatus, setPermissionStatus] = useState<NotificationSupportStatus>('default');
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [testSent, setTestSent] = useState<boolean>(false);

  const isEnabled = Boolean(userProfile?.studyReminderEnabled);
  const currentTime = userProfile?.studyReminderTime || '20:00';
  const supported = isNotificationSupported();

  // Refresh permission status on mount
  useEffect(() => {
    setPermissionStatus(getNotificationPermission());
  }, []);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string, durationMs: number = 3500) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, durationMs);
  };

  // Toggle master study reminder
  const handleToggleReminder = async () => {
    if (!supported) {
      showFeedback('error', 'আপনার বর্তমান ব্রাউজার Notification API সাপোর্ট করে না।');
      return;
    }

    if (isEnabled) {
      // Turn OFF
      await setStudyReminderEnabled(false);
      showFeedback('info', '✓ দৈনিক স্টাডি রিমাইন্ডার বন্ধ করা হয়েছে।');
      return;
    }

    // Attempting to turn ON: verify permission
    setIsRequesting(true);
    let perm = getNotificationPermission();

    if (perm !== 'granted') {
      perm = await requestNotificationPermission();
      setPermissionStatus(perm);
    }

    setIsRequesting(false);

    if (perm === 'granted') {
      await setStudyReminderEnabled(true);
      playKitsuneChime();
      showFeedback('success', '✓ দৈনিক স্টাডি রিমাইন্ডার সফলভাবে সক্রিয় করা হয়েছে!');
    } else if (perm === 'denied') {
      showFeedback('error', 'ব্রাউজারে নোটিফিকেশন ব্লক করা রয়েছে। অনুগ্রহ করে সাইট সেটিংসে গিয়ে Notifications Allow করুন।', 5000);
    } else {
      showFeedback('info', 'নোটিফিকেশন পারমিশন ছাড়া রিমাইন্ডার সক্রিয় করা সম্ভব নয়।');
    }
  };

  // Change preferred time
  const handleSelectTime = async (newTime: string) => {
    await setStudyReminderTime(newTime);
    playKitsuneChime();
    showFeedback('success', `✓ পড়ার সময় ${formatTimeBengali(newTime)} নির্ধারণ করা হয়েছে!`, 2500);
  };

  // Send a test browser notification immediately
  const handleSendTestNotification = async () => {
    if (!supported) {
      showFeedback('error', 'এই ব্রাউজারে নোটিফিকেশন সুবিধা অনুপলব্ধ।');
      return;
    }

    let perm = getNotificationPermission();
    if (perm !== 'granted') {
      perm = await requestNotificationPermission();
      setPermissionStatus(perm);
      if (perm !== 'granted') {
        showFeedback('error', 'টেস্ট নোটিফিকেশন পাঠাতে ব্রাউজারের নোটিফিকেশন পারমিশন মঞ্জুর করুন।');
        return;
      }
    }

    const success = sendTestStudyReminder(userProfile?.streak || 1);
    if (success) {
      setTestSent(true);
      playKitsuneChime();
      showFeedback('success', '🔔 আপনার ডিভাইসে টেস্ট নোটিফিকেশন পাঠানো হয়েছে! ব্রাউজার বা সিস্টেম ট্রের দিকে লক্ষ্য করুন।', 4000);
      setTimeout(() => setTestSent(false), 3000);
    } else {
      showFeedback('error', 'নোটিফিকেশন পাঠাতে সমস্যা হয়েছে। ব্রাউজার সেটিংসে নোটিফিকেশন চালু আছে কি না পরীক্ষা করুন।');
    }
  };

  return (
    <div 
      id="section-daily-study-reminder" 
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6"
    >
      {/* Header with Title and Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
            isEnabled 
              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400' 
              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500'
          }`}>
            {isEnabled ? <BellRing size={22} className="animate-bounce" /> : <Bell size={22} />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                দৈনিক স্টাডি রিমাইন্ডার (Daily Study Reminder)
              </h3>
              
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                isEnabled && permissionStatus === 'granted'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : isEnabled && permissionStatus === 'denied'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-stone-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isEnabled && permissionStatus === 'granted' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                }`} />
                <span>
                  {isEnabled 
                    ? (permissionStatus === 'granted' ? 'সক্রিয় (Active)' : 'পারমিশন প্রয়োজন') 
                    : 'বন্ধ (Off)'}
                </span>
              </span>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
              ব্রাউজারের নোটিফিকেশন এপিআই (Browser Notification API) ব্যবহার করে আপনার পছন্দমতো সময়ে জাপানি শেখার অ্যালার্ট ও স্ট্রিক সচেতনতা বার্তা পান।
            </p>
          </div>
        </div>

        {/* Master Switch */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <button
            type="button"
            id="toggle-daily-study-reminder-btn"
            role="switch"
            aria-checked={isEnabled}
            disabled={isRequesting}
            onClick={handleToggleReminder}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer ${
              isEnabled ? 'bg-rose-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
            title={isEnabled ? 'রিমাইন্ডার বন্ধ করুন' : 'রিমাইন্ডার চালু করুন'}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                isEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              {isEnabled ? (
                <Bell size={12} className="text-rose-600" />
              ) : (
                <BellOff size={12} className="text-stone-500" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Alert */}
      {feedback && (
        <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 ${
          feedback.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : feedback.type === 'error'
            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            : 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200'
        }`}>
          {feedback.type === 'success' && <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />}
          {feedback.type === 'error' && <AlertCircle size={16} className="shrink-0 text-rose-600" />}
          {feedback.type === 'info' && <Info size={16} className="shrink-0 text-blue-600" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Permission Block Warning if Denied */}
      {permissionStatus === 'denied' && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle size={14} className="text-amber-600" />
            <span>ব্রাউজারে নোটিফিকেশন অনুমতি ব্লক করা রয়েছে (Notification Permission Denied)</span>
          </div>
          <p className="text-amber-800/90 dark:text-amber-300">
            রিমাইন্ডার পেতে আপনার ব্রাউজারের অ্যাড্রেস বারের বাম পাশে সাইট সেটিংস/লক (🔒) আইকনে ক্লিক করে <strong>Notifications</strong> অপশনে <strong>"Allow"</strong> বা <strong>"অনুমতি দিন"</strong> নির্বাচন করুন।
          </p>
        </div>
      )}

      {/* Main Settings Body: Time Selector & Presets */}
      <div className="space-y-4 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              পছন্দের অনুশীলনের সময় (Preferred Study Time):
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              বর্তমান সময়সূচী: <strong className="text-rose-600 dark:text-rose-400">{formatTimeBengali(currentTime)}</strong> ({currentTime})
            </span>
          </div>

          {/* Native Time Input */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="relative flex items-center">
              <Clock size={14} className="absolute left-2.5 text-stone-400 pointer-events-none" />
              <input
                type="time"
                id="input-preferred-study-time"
                value={currentTime}
                onChange={(e) => {
                  if (e.target.value) {
                    handleSelectTime(e.target.value);
                  }
                }}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono font-bold text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden cursor-pointer"
                title="কাস্টম সময় নির্বাচন করুন"
              />
            </div>
            <span className="text-[11px] font-semibold text-stone-400">২৪ ঘণ্টা ফরম্যাট</span>
          </div>
        </div>

        {/* 6 Popular Time Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block uppercase tracking-wider">
            দ্রুত নির্বাচন করুন (Quick Presets):
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {STUDY_TIME_PRESETS.map((preset) => {
              const isSelected = currentTime === preset.time;
              return (
                <button
                  key={preset.time}
                  type="button"
                  id={`btn-time-preset-${preset.time.replace(':', '-')}`}
                  onClick={() => handleSelectTime(preset.time)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/80 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{preset.icon}</span>
                        <span className="text-xs font-black text-stone-900 dark:text-white">
                          {preset.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 block leading-tight">
                        {preset.period}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer: Test Notification & Browser API Status */}
      <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <span>
            API স্ট্যাটাস: {supported ? (
              <strong className="text-stone-800 dark:text-stone-200">
                {permissionStatus === 'granted' ? 'পারমিশন অনুমোদিত ✓' : (permissionStatus === 'denied' ? 'ব্লক করা ⚠️' : 'পারমিশন মুলতবি')}
              </strong>
            ) : (
              <strong className="text-rose-500">অনুপলব্ধ</strong>
            )}
          </span>
        </div>

        {/* Test Notification Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-send-test-reminder"
            onClick={handleSendTestNotification}
            disabled={!supported}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer shadow-2xs"
            title="ব্রাউজারে একটি পরীক্ষামূলক রিমাইন্ডার পাঠান"
          >
            <Send size={13} className={testSent ? 'animate-ping' : ''} />
            <span>{testSent ? 'পাঠানো হয়েছে!' : 'টেস্ট নোটিফিকেশন পাঠান'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
