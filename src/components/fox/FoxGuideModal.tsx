import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Trophy, 
  TrendingUp, 
  Smartphone, 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  MessageCircle, 
  Compass, 
  Play,
  RotateCcw
} from 'lucide-react';
import { FoxAvatar } from './FoxAvatar';
import { playJapaneseAudio, playKitsuneChime } from '../../utils/speech';
import { NavTab } from '../common/Navbar';
import { KanaType } from '../../types';

interface FoxGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab, subLevel?: number) => void;
  onOpenLevel?: (type: KanaType, level: number) => void;
  onStartQuiz?: (course: KanaType | 'mixed', level?: number) => void;
}

type GuideTab = 'tour' | 'tips' | 'phrases' | 'quick';

export const FoxGuideModal: React.FC<FoxGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenLevel,
  onStartQuiz
}) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('tour');
  const [tourStep, setTourStep] = useState<number>(0);
  const [activePhraseAudio, setActivePhraseAudio] = useState<string | null>(null);

  if (!isOpen) return null;

  const tourSteps = [
    {
      id: 'hiragana',
      badge: 'স্টেপ ১ • বর্ণমালা শুরু',
      titleBn: 'হিরাগানা কোর্স (Hiragana) - মৌলিক জাপানি বর্ণ',
      descriptionBn: 'জাপানি ভাষার মূল ভিত্তি হলো হিরাগানা (৪৬টি অক্ষর)। এখানে আপনি প্রতিটি অক্ষরের নিখুঁত স্ট্রোক অ্যানিমেশন, অডিও উচ্চারণ ও ক্যানভাসে লেখার অনুশীলন করতে পারবেন।',
      icon: <BookOpen size={20} className="text-rose-600" />,
      actionLabel: 'হিরাগানা লেভেল ১ শুরু করুন',
      action: () => {
        onClose();
        if (onOpenLevel) onOpenLevel('hiragana', 1);
        else onNavigate('hiragana');
      }
    },
    {
      id: 'katakana',
      badge: 'স্টেপ ২ • আধুনিক জাপানি',
      titleBn: 'কাতাকানা কোর্স (Katakana) - বিদেশি শব্দের বর্ণমালা',
      descriptionBn: 'বিদেশি শব্দ, নাম ও আধুনিক পরিভাষা লেখার জন্য কাতাকানা (৪৬টি অক্ষর) ব্যবহৃত হয়। হিরাগানার মতোই ১০টি লেভেলে সাজানো এই কোর্স সহজে আয়ত্ত করতে পারবেন।',
      icon: <Layers size={20} className="text-blue-600" />,
      actionLabel: 'কাতাকানা লেভেল ১ শুরু করুন',
      action: () => {
        onClose();
        if (onOpenLevel) onOpenLevel('katakana', 1);
        else onNavigate('katakana');
      }
    },
    {
      id: 'quiz',
      badge: 'স্টেপ ৩ • ইন্টারেক্টিভ পরীক্ষা',
      titleBn: '৫-ধরনের স্মার্ট কুইজ সিস্টেম (Interactive Quizzes)',
      descriptionBn: 'শুধু পড়া নয়, মেমোরি ঝালাইয়ের জন্য রয়েছে: MCQ, অডিও লিসেনিং টেস্ট, রোমাজি থেকে কাণা, শব্দার্থ ম্যাচিং এবং স্ট্রোক অর্ডার টেস্ট। প্রতি টেস্টে পাবেন লাইভ ফিডব্যাক ও সাউন্ড!',
      icon: <HelpCircle size={20} className="text-emerald-600" />,
      actionLabel: 'কুইজ প্র্যাকটিস শুরু করুন',
      action: () => {
        onClose();
        if (onStartQuiz) onStartQuiz('hiragana');
        else onNavigate('quiz');
      }
    },
    {
      id: 'streak',
      badge: 'স্টেপ ৪ • দৈনিক অভ্যাস',
      titleBn: 'দৈনিক ৫-প্রশ্নের চ্যালেঞ্জ ও স্ট্রিক ফ্লেম 🔥',
      descriptionBn: 'প্রতিদিন অ্যাপে প্রবেশ করে মাত্র ৫টি প্রশ্নের উত্তর দিয়ে ডেইলি স্ট্রিক বাড়িয়ে নিন এবং অতিরিক্ত এক্সপি ও বিশেষ ব্যাজ আনলক করুন। নিয়মিত অভ্যাসই দ্রুত শেখার চাবিকাঠি!',
      icon: <Sparkles size={20} className="text-orange-500" />,
      actionLabel: 'আজকের দৈনিক কুইজ দিন',
      action: () => {
        onClose();
        onNavigate('home');
      }
    },
    {
      id: 'leaderboard',
      badge: 'স্টেপ ৫ • আসল প্রতিযোগিতা',
      titleBn: '১০০% রিয়েল লিডারবোর্ড ও শিক্ষার্থী র‍্যাঙ্কিং 🏆',
      descriptionBn: 'কোনো ডামি বা ফেক বট নয়—এখানে ক্লাউড ডেটাবেসের মাধ্যমে আসল শিক্ষার্থীদের অর্জিত XP ও স্ট্রিক অনুযায়ী রিয়েল-টাইম লিডারবোর্ড আপডেট হয়। শীর্ষ স্থানে নিজের নাম তুলুন!',
      icon: <Trophy size={20} className="text-amber-500" />,
      actionLabel: 'লিডারবোর্ড দেখুন',
      action: () => {
        onClose();
        onNavigate('leaderboard');
      }
    },
    {
      id: 'progress',
      badge: 'স্টেপ ৬ • অ্যানালিটিক্স ও লেভেল আপ',
      titleBn: 'প্রোগ্রেস ড্যাশবোর্ড ও এক্সপি লেভেলিং 📈',
      descriptionBn: 'আপনার মোট শেখা অক্ষরের হিসাব, কুইজের নির্ভুলতা হার, অর্জিত ব্যাজ এবং নবাগত থেকে কাণা মাস্টার পর্যন্ত প্রতিটি লেভেল ট্র্যাকিং দেখতে পাবেন প্রোগ্রেস ড্যাশবোর্ডে।',
      icon: <TrendingUp size={20} className="text-indigo-600" />,
      actionLabel: 'প্রোগ্রেস ড্যাশবোর্ড দেখুন',
      action: () => {
        onClose();
        onNavigate('progress');
      }
    },
    {
      id: 'pwa',
      badge: 'স্টেপ ৭ • অফলাইন সুবিধা',
      titleBn: 'ইন্টারনেট ছাড়াই অফলাইন পড়াশোনা (PWA App) 📱',
      descriptionBn: 'উপরে "অ্যাপ ইন্সটল" বাটনে ক্লিক করে এটি মোবাইলে বা কম্পিউটারে সরাসরি অ্যাপ হিসেবে ডাউনলোড করে নিতে পারবেন। কোনো ইন্টারনেট সংযোগ ছাড়াও সব বর্ণ ও অডিও পড়া যাবে!',
      icon: <Smartphone size={20} className="text-teal-600" />,
      actionLabel: 'হোম স্ক্রিনে ফিরে যান',
      action: () => {
        onClose();
        onNavigate('home');
      }
    }
  ];

  const studyHacks = [
    {
      title: '১. হিরাগানা ও কাতাকানার পার্থক্য মনে রাখার কৌশল',
      text: 'হিরাগানার অক্ষরগুলো তুলনামূলক গোলগাল ও বাঁকানো (Curvy), যা জাপানি নিজস্ব শব্দের জন্য ব্যবহৃত হয় (যেমন: ありがとう)। আর কাতাকানার অক্ষরগুলো তীক্ষ্ণ ও সোজা রেখাভিত্তিক (Angular/Sharp), যা বিদেশি নামের জন্য ব্যবহৃত হয় (যেমন: বাংলাদেশ - バングラデシュ)।',
      icon: '🎌'
    },
    {
      title: '২. স্ট্রোক অর্ডারের গোল্ডেন রুল',
      text: 'জাপানি কাণা লেখার ২টি মূল নিয়ম: সবসময় "উপর থেকে নিচে" (Top to Bottom) এবং "বাম থেকে ডানে" (Left to Right) স্ট্রোক টানতে হয়। প্রতিটি অক্ষরের বিস্তারিত পাতায় স্ট্রোক অ্যানিমেশন দেখে খাতায় বা আমাদের স্ক্রিন ক্যানভাসে প্র্যাকটিস করুন।',
      icon: '✍️'
    },
    {
      title: '৩. নিখুঁত উচ্চারণ শেখার উপায়',
      text: 'জাপানি স্বরধ্বনি (Vowels) মাত্র ৫টি: A (আ), I (ই), U (উ), E (এ), O (ও)। প্রতিটি অক্ষরের স্পিকার বাটনে চাপ দিয়ে টোকিও স্ট্যান্ডার্ড অ্যাকসেন্টে উচ্চারণ শুনুন ও সাথে সাথে মুখে আওড়ান।',
      icon: '🔊'
    },
    {
      title: '৪. ১০ মিনিটের দৈনিক অভ্যাস ও মেমোরি রুল',
      text: 'একদিনে সব মুখস্থ না করে প্রতিদিন মাত্র ১টি লেভেল (৪-৫টি বর্ণ) শিখুন এবং সাথে সাথে রিভিশন কুইজ দিন। ঘুমানোর আগে একবার ফ্ল্যাশ কার্ডগুলো দেখে নিলে স্মৃতিতে স্থায়ী হয়ে যায়।',
      icon: '🧠'
    }
  ];

  const japanesePhrases = [
    { jp: 'おはようございます', romaji: 'Ohayou gozaimasu', bn: 'ওহাইয়ো গোজাইমাসু', mean: 'শুভ সকাল (Good morning)' },
    { jp: 'こんにちは', romaji: 'Konnichiwa', bn: 'কোন্নিচিওয়া', mean: 'নমস্কার / শুভ দুপুর (Hello / Good day)' },
    { jp: 'こんばんは', romaji: 'Konbanwa', bn: 'কোম্বানওয়া', mean: 'শুভ সন্ধ্যা (Good evening)' },
    { jp: 'ありがとうございます', romaji: 'Arigatou gozaimasu', bn: 'আরিগাতো গোজাইমাসু', mean: 'অনেক ধন্যবাদ (Thank you very much)' },
    { jp: 'がんばってください', romaji: 'Ganbatte kudasai', bn: 'গানবাত্তে কুদাসাই', mean: 'আপনার জন্য শুভকামনা / চালিয়ে যান!' },
    { jp: 'すみません', romaji: 'Sumimasen', bn: 'সুমিমাসেন', mean: 'মাফ করবেন / এক্সকিউজ মি (Excuse me / Sorry)' },
    { jp: 'さようなら', romaji: 'Sayounara', bn: 'সায়োনরা', mean: 'বিদায় (Goodbye)' },
    { jp: 'よろしくお願いします', romaji: 'Yoroshiku onegaishimasu', bn: 'ইয়োরোশিকু ওনেগাইশিমাসু', mean: 'আপনার সাহায্য ও শুভকামনা প্রত্যাশা করছি' }
  ];

  const handlePlayPhrase = (jp: string) => {
    setActivePhraseAudio(jp);
    playJapaneseAudio(jp, () => {
      setActivePhraseAudio(null);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Kitsune Sensei */}
        <div className="relative bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 p-5 sm:p-6 text-white overflow-hidden shrink-0">
          
          {/* Decorative background sakura circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-amber-400/15 rounded-full blur-lg pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            id="fox-guide-close-btn"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/35 text-white/90 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <FoxAvatar size="lg" isSpeaking={true} />
            
            <div className="flex-1 pr-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase text-amber-100 mb-1 border border-white/20">
                <Sparkles size={12} className="text-amber-300" />
                <span>Kitsune Sensei (きつね先生)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                কিটসুনে ফক্স গাইড ও শিক্ষক 🦊
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5 leading-relaxed">
                こんにちは! চান্দু জাপানিজ স্কুলের সবকিছু সহজে বুঝতে আমি আপনাকে সাহায্য করছি।
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/20 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveTab('tour');
                playKitsuneChime();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tour'
                  ? 'bg-white text-rose-700 shadow-md font-black'
                  : 'bg-white/15 text-white/90 hover:bg-white/25 hover:text-white'
              }`}
            >
              <Compass size={14} />
              <span>১. ওয়েবসাইট ট্যুর (Tour)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tips');
                playKitsuneChime();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tips'
                  ? 'bg-white text-rose-700 shadow-md font-black'
                  : 'bg-white/15 text-white/90 hover:bg-white/25 hover:text-white'
              }`}
            >
              <Lightbulb size={14} />
              <span>২. শেখার কৌশল (Tips)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('phrases');
                playKitsuneChime();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'phrases'
                  ? 'bg-white text-rose-700 shadow-md font-black'
                  : 'bg-white/15 text-white/90 hover:bg-white/25 hover:text-white'
              }`}
            >
              <MessageCircle size={14} />
              <span>৩. জাপানি কথোপকথন</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('quick');
                playKitsuneChime();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'quick'
                  ? 'bg-white text-rose-700 shadow-md font-black'
                  : 'bg-white/15 text-white/90 hover:bg-white/25 hover:text-white'
              }`}
            >
              <Play size={14} />
              <span>৪. কুইক অ্যাকশন</span>
            </button>
          </div>
        </div>

        {/* Modal Body Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">

          {/* TAB 1: INTERACTIVE TOUR */}
          {activeTab === 'tour' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                  পদক্ষেপ {tourStep + 1} / {tourSteps.length}
                </span>
                
                {/* Step indicators */}
                <div className="flex items-center gap-1.5">
                  {tourSteps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTourStep(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        tourStep === idx 
                          ? 'w-6 bg-rose-600 dark:bg-rose-500' 
                          : 'w-2 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300'
                      }`}
                      title={`Step ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Active Step Card */}
              <motion.div
                key={tourStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 via-stone-50 to-amber-50/50 dark:from-stone-800/80 dark:via-stone-850 dark:to-stone-800/60 border border-stone-200/80 dark:border-stone-700 shadow-xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-white dark:bg-stone-800 shadow-xs border border-stone-200/60 dark:border-stone-700">
                    {tourSteps[tourStep].icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/60">
                    {tourSteps[tourStep].badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-stone-900 dark:text-white mt-1">
                  {tourSteps[tourStep].titleBn}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                  {tourSteps[tourStep].descriptionBn}
                </p>

                <div className="mt-5 pt-4 border-t border-stone-200/60 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={tourSteps[tourStep].action}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 inline-flex items-center gap-2 transition cursor-pointer"
                  >
                    <span>{tourSteps[tourStep].actionLabel}</span>
                    <ArrowRight size={14} />
                  </button>

                  <div className="flex items-center gap-2">
                    {tourStep > 0 && (
                      <button
                        onClick={() => setTourStep(prev => prev - 1)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold transition cursor-pointer"
                      >
                        আগেরটি
                      </button>
                    )}
                    {tourStep < tourSteps.length - 1 ? (
                      <button
                        onClick={() => setTourStep(prev => prev + 1)}
                        className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition cursor-pointer"
                      >
                        পরবর্তী ধাপ
                      </button>
                    ) : (
                      <button
                        onClick={() => setTourStep(0)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        <span>শুরু থেকে</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* All Steps Grid Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {tourSteps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setTourStep(idx)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      tourStep === idx
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-800 ring-1 ring-rose-400'
                        : 'bg-white dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-700 text-[10px] font-bold flex items-center justify-center text-stone-700 dark:text-stone-300">
                        {idx + 1}
                      </span>
                      <span className="text-[11px] font-bold text-stone-900 dark:text-white truncate">
                        {step.badge.split(' • ')[1]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: STUDY TIPS & HACKS */}
          {activeTab === 'tips' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center gap-3">
                <FoxAvatar size="sm" isHappy={true} />
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 leading-snug">
                  "জাপানি বর্ণমালা শেখা কঠিন নয়, সঠিক কৌশল জানলে মাত্র ৩-৪ দিনেই ৯২টি বর্ণ আয়ত্ত করা সম্ভব!" — কিটসুনে সেনসেই
                </p>
              </div>

              <div className="space-y-3">
                {studyHacks.map((hack, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700 transition"
                  >
                    <h4 className="text-xs sm:text-sm font-black text-stone-900 dark:text-white flex items-center gap-2 mb-1.5">
                      <span className="text-base">{hack.icon}</span>
                      <span>{hack.title}</span>
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pl-6">
                      {hack.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DAILY PHRASES WITH AUDIO */}
          {activeTab === 'phrases' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                স্পিকার বাটনে ট্যাপ করে জাপানি শুদ্ধ উচ্চারণ শুনুন এবং সাথে সাথে মুখে বলার চেষ্টা করুন:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {japanesePhrases.map((phrase, idx) => {
                  const isPlaying = activePhraseAudio === phrase.jp;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-3 hover:border-rose-300 dark:hover:border-rose-700 transition"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-black text-stone-900 dark:text-white text-sm">
                            {phrase.jp}
                          </span>
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-900/40">
                            {phrase.romaji}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 mt-1 truncate">
                          {phrase.bn}
                        </div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                          {phrase.mean}
                        </div>
                      </div>

                      <button
                        onClick={() => handlePlayPhrase(phrase.jp)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition cursor-pointer ${
                          isPlaying
                            ? 'bg-rose-600 text-white border-rose-600 scale-105 shadow-md shadow-rose-600/30'
                            : 'bg-stone-100 dark:bg-stone-700/70 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50'
                        }`}
                        title="উচ্চারণ শুনুন"
                      >
                        <Volume2 size={16} className={isPlaying ? 'animate-pulse' : ''} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: QUICK ACTIONS */}
          {activeTab === 'quick' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                যেখানে যেতে চান সরাসরি ক্লিক করুন:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenLevel) onOpenLevel('hiragana', 1);
                    else onNavigate('hiragana');
                  }}
                  className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-left hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-300">হিরাগানা লেভেল ১</span>
                    <BookOpen size={16} className="text-rose-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    あ い う え お (A I U E O) দিয়ে শুরু করুন।
                  </p>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onOpenLevel) onOpenLevel('katakana', 1);
                    else onNavigate('katakana');
                  }}
                  className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-left hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300">কাতাকানা লেভেল ১</span>
                    <Layers size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    ア イ ウ エ オ (A I U E O) দিয়ে শুরু করুন।
                  </p>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onStartQuiz) onStartQuiz('hiragana');
                    else onNavigate('quiz');
                  }}
                  className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-left hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">কুইজ সেশন শুরু</span>
                    <HelpCircle size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    MCQ ও অডিও কুইজ দিয়ে নিজের মেমোরি টেস্ট করুন।
                  </p>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigate('leaderboard');
                  }}
                  className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-left hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">লিডারবোর্ড ও র‍্যাংক</span>
                    <Trophy size={16} className="text-amber-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    অন্য শিক্ষার্থীদের সাথে আপনার অবস্থান দেখুন।
                  </p>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Area */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              ফক্স গাইড সর্বদা আপনার সাথে আছে
            </span>
          </div>

          <button
            onClick={onClose}
            id="fox-guide-finish-btn"
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs transition cursor-pointer"
          >
            বুঝেছি, ধন্যবাদ! ✓
          </button>
        </div>

      </div>
    </div>
  );
};
