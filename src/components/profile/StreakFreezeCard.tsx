import React, { useState } from 'react';
import { 
  Snowflake, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  History, 
  ArrowRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import { UserProfile, StreakFreezeRecord } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface StreakFreezeCardProps {
  userProfile: UserProfile | null;
  onProfileUpdated?: (updated: UserProfile) => void;
}

export const StreakFreezeCard: React.FC<StreakFreezeCardProps> = ({ userProfile, onProfileUpdated }) => {
  const { purchaseStreakFreeze, simulateMissedDayWithFreeze } = useAuth();
  const [purchasing, setPurchasing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const freezeCount = userProfile?.streakFreezeCount || 0;
  const maxFreezes = 2;
  const freezeCostXP = 100;
  const currentXP = userProfile?.xp || 0;
  const canAfford = currentXP >= freezeCostXP;
  const isFull = freezeCount >= maxFreezes;
  const currentStreak = userProfile?.streak || 1;

  const inventory: StreakFreezeRecord[] = userProfile?.streakFreezeInventory || [];
  const usedHistory = inventory.filter(f => f.status === 'used');

  const handlePurchase = async () => {
    if (isFull) {
      setFeedbackMessage({
        type: 'info',
        text: `আপনার কাছে ইতিমধ্যে সর্বোচ্চ ${maxFreezes}টি স্ট্রিক ফ্রিজ সক্রিয় আছে!`
      });
      return;
    }

    if (!canAfford) {
      setFeedbackMessage({
        type: 'error',
        text: `পর্যাপ্ত XP নেই! আপনার আছে ${currentXP} XP, স্ট্রিক ফ্রিজের জন্য প্রয়োজন ${freezeCostXP} XP। কুইজ খেলে আরও পয়েন্ট অর্জন করুন!`
      });
      return;
    }

    setPurchasing(true);
    setFeedbackMessage(null);

    try {
      const res = await purchaseStreakFreeze(freezeCostXP);
      if (res.success) {
        setFeedbackMessage({
          type: 'success',
          text: `🎉 সফলভাবে স্ট্রিক ফ্রিজ সংগ্রহ করা হয়েছে! কুইজ থেকে অর্জিত ${freezeCostXP} XP ব্যয় করা হলো। আপনার স্ট্রিক এখন সুরক্ষিত!`
        });
        if (onProfileUpdated && userProfile) {
          onProfileUpdated({
            ...userProfile,
            xp: Math.max(0, currentXP - freezeCostXP),
            streakFreezeCount: freezeCount + 1
          });
        }
      } else {
        setFeedbackMessage({
          type: 'error',
          text: res.error || 'স্ট্রিক ফ্রিজ সংগ্রহ করতে সমস্যা হয়েছে।'
        });
      }
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: 'অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
      });
    } finally {
      setPurchasing(false);
    }
  };

  const handleSimulate = async () => {
    if (freezeCount <= 0) {
      setFeedbackMessage({
        type: 'error',
        text: 'সিমুলেশন চালানোর জন্য প্রথমে অন্তত ১টি স্ট্রিক ফ্রিজ সংগ্রহ করুন।'
      });
      return;
    }

    setSimulating(true);
    setFeedbackMessage(null);

    try {
      const res = await simulateMissedDayWithFreeze();
      if (res.success) {
        setFeedbackMessage({
          type: 'success',
          text: `🛡️ ${res.message}`
        });
      } else {
        setFeedbackMessage({
          type: 'error',
          text: res.message || 'সিমুলেশন ব্যর্থ হয়েছে।'
        });
      }
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: 'সিমুলেশনে ত্রুটি ঘটেছে।'
      });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div 
      id="streak-freeze-card" 
      className="bg-white dark:bg-stone-900 border border-cyan-200 dark:border-cyan-900/60 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden"
    >
      {/* Subtle top icy highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-400 via-sky-500 to-indigo-500" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900 flex-shrink-0">
            <Snowflake size={24} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                স্ট্রিক ফ্রিজ (Streak Freeze)
              </h3>
              {freezeCount > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  <ShieldCheck size={13} />
                  স্ট্রিক সুরক্ষিত ({freezeCount}/{maxFreezes} সক্রিয়)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <ShieldAlert size={13} />
                  স্ট্রিক অরক্ষিত (০/{maxFreezes})
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1">
              কুইজ থেকে অর্জিত XP পয়েন্ট দিয়ে স্ট্রিক ফ্রিজ রাখুন। পড়া মিস হলেও আপনার স্ট্রিক রিসেট হবে না।
            </p>
          </div>
        </div>

        {/* Quick Streak info pill */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 self-start sm:self-center">
          <Flame size={18} className="text-orange-500 fill-orange-500" />
          <div>
            <div className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">বর্তমান স্ট্রিক</div>
            <div className="text-sm font-black text-orange-700 dark:text-orange-300">{currentStreak} দিন</div>
          </div>
        </div>
      </div>

      {/* Active Slots Visualizer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
        {/* Slot 1 */}
        <div className={`p-4 rounded-xl border transition-all ${
          freezeCount >= 1 
            ? 'bg-cyan-50/60 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200' 
            : 'bg-stone-50 dark:bg-stone-800/50 border-dashed border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                freezeCount >= 1 ? 'bg-cyan-500 text-white shadow-xs' : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
              }`}>
                ❄️
              </div>
              <div>
                <div className="text-xs font-bold">স্লট ১: স্ট্রিক শিল্ড</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  {freezeCount >= 1 ? 'সক্রিয় ও প্রস্তুত' : 'ফাঁকা (মজুদ নেই)'}
                </div>
              </div>
            </div>
            {freezeCount >= 1 ? (
              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1">
                <CheckCircle2 size={14} className="text-cyan-600 dark:text-cyan-400" /> সক্রিয়
              </span>
            ) : (
              <span className="text-xs text-stone-400">খালি</span>
            )}
          </div>
        </div>

        {/* Slot 2 */}
        <div className={`p-4 rounded-xl border transition-all ${
          freezeCount >= 2 
            ? 'bg-cyan-50/60 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200' 
            : 'bg-stone-50 dark:bg-stone-800/50 border-dashed border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                freezeCount >= 2 ? 'bg-cyan-500 text-white shadow-xs' : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
              }`}>
                ❄️
              </div>
              <div>
                <div className="text-xs font-bold">স্লট ২: ব্যাকআপ শিল্ড</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  {freezeCount >= 2 ? 'সক্রিয় ও প্রস্তুত' : 'ফাঁকা (মজুদ নেই)'}
                </div>
              </div>
            </div>
            {freezeCount >= 2 ? (
              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1">
                <CheckCircle2 size={14} className="text-cyan-600 dark:text-cyan-400" /> সক্রিয়
              </span>
            ) : (
              <span className="text-xs text-stone-400">খালি</span>
            )}
          </div>
        </div>
      </div>

      {/* Action / Purchase Banner */}
      <div className="mt-5 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
              মূল্য: {freezeCostXP} কুইজ XP / প্রতিটি
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500">•</span>
            <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
              আপনার জমা: <strong className="text-amber-600 dark:text-amber-400 font-bold">{currentXP} XP</strong>
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {isFull 
              ? `আপনার ব্যাকপ্যাকে সর্বোচ্চ ${maxFreezes}টি স্ট্রিক ফ্রিজ সুরক্ষিত আছে!`
              : canAfford
                ? `আপনার কাছে যথেষ্ট XP রয়েছে। স্ট্রিক ফ্রিজ সক্রিয় করে নিশ্চিত থাকুন!`
                : `স্ট্রিক ফ্রিজের জন্য আরও ${freezeCostXP - currentXP} XP প্রয়োজন। কুইজ খেলুন!`
            }
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            id="btn-buy-streak-freeze"
            disabled={purchasing || isFull || !canAfford}
            onClick={handlePurchase}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
              isFull
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
                : canAfford
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white active:scale-98 cursor-pointer'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed'
            }`}
          >
            <Snowflake size={16} />
            <span>
              {purchasing 
                ? 'প্রক্রিয়াধীন...' 
                : isFull 
                  ? 'মজুদ পূর্ণ (২/২)' 
                  : `${freezeCostXP} XP দিয়ে স্ট্রিক ফ্রিজ নিন`}
            </span>
          </button>

          {/* Test / Simulate button for user validation */}
          {freezeCount > 0 && (
            <button
              type="button"
              id="btn-simulate-freeze"
              disabled={simulating}
              onClick={handleSimulate}
              title="পরীক্ষা করে দেখুন কিভাবে স্ট্রিক ফ্রিজ একদিনের অনুপস্থিতি রক্ষা করে"
              className="px-3 py-2.5 rounded-xl font-medium text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700/60 border border-stone-300 dark:border-stone-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <ShieldCheck size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span>{simulating ? 'পরীক্ষা...' : 'পরীক্ষা করুন'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div className={`mt-3 p-3 rounded-xl text-xs flex items-start gap-2 animate-fadeIn ${
          feedbackMessage.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : feedbackMessage.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              : 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
        }`}>
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : feedbackMessage.type === 'error' ? (
            <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">{feedbackMessage.text}</div>
          <button 
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Toggles for "How it works" and "History" */}
      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 text-xs">
        <button
          type="button"
          id="btn-toggle-how-it-works"
          onClick={() => setShowHowItWorks(prev => !prev)}
          className="text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          <HelpCircle size={14} />
          <span>{showHowItWorks ? 'নিয়মাবলী লুকান' : 'স্ট্রিক ফ্রিজ কীভাবে কাজ করে?'}</span>
        </button>

        {usedHistory.length > 0 && (
          <button
            type="button"
            id="btn-toggle-freeze-history"
            onClick={() => setShowHistory(prev => !prev)}
            className="text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center gap-1 font-medium cursor-pointer"
          >
            <History size={14} />
            <span>ব্যবহারের ইতিহাস ({usedHistory.length})</span>
          </button>
        )}
      </div>

      {/* How it Works Details */}
      {showHowItWorks && (
        <div className="mt-3 p-4 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/60 text-xs text-stone-700 dark:text-stone-300 space-y-2.5 animate-fadeIn">
          <h4 className="font-bold text-cyan-900 dark:text-cyan-200 flex items-center gap-1.5">
            <Snowflake size={14} className="text-cyan-600 dark:text-cyan-400" />
            স্ট্রিক ফ্রিজের নিয়মাবলী ও সুরক্ষা কৌশল:
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 text-stone-600 dark:text-stone-300 pl-1 leading-relaxed">
            <li>
              <strong>পয়েন্ট অর্জন:</strong> কুইজ সেশন এবং লেসন সম্পন্ন করে পয়েন্ট (XP) অর্জন করুন।
            </li>
            <li>
              <strong>সুরক্ষা সজ্জিত করা:</strong> অর্জিত ১০০ XP দিয়ে স্ট্রিক ফ্রিজ কিনলে তা স্বয়ংক্রিয়ভাবে সক্রিয় হয়ে থাকে। আপনি একসাথে সর্বোচ্চ ২টি ফ্রিজ মজুদ রাখতে পারবেন।
            </li>
            <li>
              <strong>স্বয়ংক্রিয় সুরক্ষা:</strong> কোনো দিন পড়ার সময় না পেলে বা ভুলে গেলে স্ট্রিক ফ্রিজ নিজে থেকেই ব্যবহৃত হয়ে আপনার স্ট্রিক বজায় রাখবে (স্ট্রিক ০ হবে না)।
            </li>
            <li>
              <strong>অক্ষুণ্ণ ধারাবাহিকতা:</strong> পরবর্তী দিন আবার পড়া শুরু করলে আপনার পূর্বের স্ট্রিকের সাথে নতুন দিন যুক্ত হতে থাকবে।
            </li>
          </ol>
        </div>
      )}

      {/* History Log */}
      {showHistory && usedHistory.length > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-2 animate-fadeIn">
          <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <History size={13} className="text-stone-500" />
            পূর্ববর্তী ব্যবহারের বিবরণ:
          </div>
          <div className="space-y-1.5">
            {usedHistory.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">❄️ ব্যবহৃত</span>
                  <span className="text-stone-600 dark:text-stone-300">
                    {item.usedForDate ? `তারিখ: ${item.usedForDate}` : 'সংরক্ষিত স্ট্রিক'}
                  </span>
                </div>
                <span className="text-stone-400">
                  {item.usedAt ? new Date(item.usedAt).toLocaleDateString('bn-BD') : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
