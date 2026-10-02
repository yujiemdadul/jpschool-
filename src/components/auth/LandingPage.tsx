import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Volume2, 
  PenTool, 
  HelpCircle, 
  Flame, 
  CheckCircle2, 
  Trophy,
  BookOpen,
  Award,
  ChevronDown,
  Play,
  Layers,
  GraduationCap,
  ShieldCheck,
  Zap,
  Code2,
  ExternalLink,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { HIRAGANA_CHARS } from '../../data/hiraganaData';
import { KATAKANA_CHARS } from '../../data/katakanaData';
import { playJapaneseAudio, playKitsuneChime } from '../../utils/speech';
import { FoxAvatar } from '../fox/FoxAvatar';
import { AppLogo } from '../common/AppLogo';
import { motion } from 'motion/react';

interface LandingPageProps {
  onOpenAuth: () => void;
  onStartGuest?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth
}) => {
  const [activeSoundTab, setActiveSoundTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [playingChar, setPlayingChar] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sampleHiragana = HIRAGANA_CHARS.slice(0, 15);
  const sampleKatakana = KATAKANA_CHARS.slice(0, 15);

  const handlePlaySound = (char: string, romaji: string) => {
    setPlayingChar(char);
    playJapaneseAudio(char, () => {
      setPlayingChar(null);
    });
  };

  const handleQuickStart = (_levelName?: string) => {
    onOpenAuth();
  };

  const faqs = [
    {
      q: 'জাপানি ভাষা শেখা শুরু করার সঠিক নিয়ম কী?',
      a: 'জাপানি ভাষার মূল ভিত্তি হলো হিরাগানা (Hiragana)। প্রথমে ৪৬টি হিরাগানা অক্ষর এবং তাদের সঠিক উচ্চারণ ও স্ট্রোক অর্ডার আয়ত্ত করার পর কাতাকানা (Katakana) এবং দৈনন্দিন শব্দভাণ্ডার শেখা সবচেয়ে কার্যকর।'
    },
    {
      q: 'এই অ্যাপে কি কোনো পেমেন্ট বা সাবস্ক্রিপশন লাগবে?',
      a: 'না, চান্দু জাপানিজ স্কুলের সমস্ত হিরাগানা, কাতাকানা, অডিও উচ্চারণ, স্ট্রোক অর্ডার ক্যানভাস ও কুইজ মোড সম্পূর্ণ বিনামূল্যে এবং সবার জন্য উন্মুক্ত।'
    },
    {
      q: 'অ্যাপটি ব্যবহারের জন্য কি লগইন করা বাধ্যতামূলক?',
      a: 'হ্যাঁ, আপনার ব্যক্তিগত পড়ার অগ্রগতি, কুইজের স্কোর, এক্সপি ও স্ট্রিক নিরাপদে সংরক্ষণ এবং লিডারবোর্ডে অংশ নিতে একটি বিনামূল্যে অ্যাকাউন্ট খুলে লগইন করা বাধ্যতামূলক।'
    },
    {
      q: 'জাপানি উচ্চারণ কি প্রমিত এবং নির্ভুল?',
      a: 'হ্যাঁ, প্রতিটি বর্ণ ও শব্দে প্রমিত জাপানিজ নেটিভ স্পিচ সিন্থেসিস (ja-JP) ব্যবহৃত হয়, যা টোকিও স্ট্যান্ডার্ড উচ্চারণ নিশ্চিত করে।'
    },
    {
      q: 'জাপানিজ শেখার প্রয়োজনীয় PDF বই বা শিখন শিট কি ডাউনলোড করা যায়?',
      a: 'হ্যাঁ, চান্দু জাপানিজ স্কুলের PDF লাইব্রেরি থেকে হিরাগানা-কাতাকানা প্র্যাকটিস শিট, JLPT N5 ব্যাকরণ সামারি, কাঞ্জি নোট এবং মডেল প্রশ্নপত্র যেকোনো সময় বিনামূল্যে পড়া ও ডাউনলোড করা যায়।'
    },
    {
      q: 'ওয়েবসাইটের ফক্স গাইড (Kitsune Sensei) কীভাবে সাহায্য করে?',
      a: 'স্ক্রিনের নিচে থাকা মিষ্টি ফক্স মাসকটটি আপনাকে সম্পূর্ণ ওয়েবসাইটের ফিচার বুঝিয়ে দেবে, স্টাডি টিপস দেবে এবং প্রয়োজনীয় জাপানি সম্ভাষণ ও অডিও প্র্যাকটিসে সাহায্য করবে।'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 animate-in fade-in duration-300 py-4 sm:py-8">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-stone-900 via-stone-900 to-stone-950 text-white p-7 sm:p-12 lg:p-16 border border-stone-800/80 shadow-2xl">
        
        {/* Subtle decorative elements */}
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Japanese Watermark */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none hidden lg:block">
          <span className="text-[22rem] font-serif font-black text-rose-400">
            日本語
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold shadow-xs">
                <Sparkles size={14} className="text-rose-400 animate-pulse" />
                <span>🌸 বাংলায় জাপানি ভাষা শিক্ষার পূর্ণাঙ্গ একাডেমি</span>
              </div>

              <a
                href="https://uchihaemdadul.bio.link/"
                target="_blank"
                rel="noopener noreferrer"
                id="hero-dev-badge"
                title="Developer Profile: uchihaemdadul"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/90 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold shadow-xs transition group cursor-pointer"
              >
                <Code2 size={13} className="text-rose-400" />
                <span className="text-stone-400 text-[11px]">Developer:</span>
                <span className="text-rose-300 font-bold group-hover:underline">uchihaemdadul</span>
                <ExternalLink size={11} className="text-stone-400 group-hover:text-white" />
              </a>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              জাপানি শেখার শুরু হোক <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300">
                বাংলায়, সহজ ও নির্ভুলভাবে।
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
              হিরাগানা ও কাতাকানার ৯২টি বর্ণমালা, ধাপে ধাপে স্ট্রোক অর্ডার, প্রমিত জাপানি অডিও এবং ৫-লেভেল ইন্টারেক্টিভ কুইজের মাধ্যমে জাপানি ভাষায় পারদর্শী হয়ে উঠুন।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                id="btn-landing-start-free"
                onClick={onOpenAuth}
                className="px-7 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-base shadow-xl shadow-rose-950/50 active:scale-98 transition flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>লগইন করে পড়া শুরু করুন</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                id="btn-landing-login"
                onClick={onOpenAuth}
                className="px-6 py-4 rounded-2xl border border-stone-700 bg-stone-800/90 hover:bg-stone-800 hover:border-stone-600 text-stone-200 font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>নতুন একাউন্ট খুলুন</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-800/80 text-xs text-stone-300 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">১০০% ফ্রি লার্নিং</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">প্রমিত জাপানি অডিও</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">কুইজ ও এক্সপি</span>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Interactive Live Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-stone-900/90 rounded-3xl p-6 border border-stone-700/80 shadow-2xl backdrop-blur-md relative">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm font-serif">
                    あ
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">লাইভ বর্ণ ও অডিও ট্রায়াল</h3>
                    <p className="text-[10px] text-stone-400">ক্লিক করে জাপানি উচ্চারণ শুনুন</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Interactive
                </span>
              </div>

              {/* Character grid */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { jp: 'あ', ro: 'a', bn: 'আ', ex: 'আমে (বৃষ্টি)' },
                  { jp: 'い', ro: 'i', bn: 'ই', ex: 'ইনু (কুকুর)' },
                  { jp: 'う', ro: 'u', bn: 'উ', ex: 'উমি (সমুদ্র)' },
                  { jp: 'え', ro: 'e', bn: 'এ', ex: 'একি (স্টেশন)' },
                  { jp: 'お', ro: 'o', bn: 'ও', ex: 'ওনে (টাকা)' },
                ].map((item) => (
                  <button
                    key={item.jp}
                    type="button"
                    onClick={() => handlePlaySound(item.jp, item.ro)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      playingChar === item.jp
                        ? 'bg-rose-600 border-rose-400 text-white scale-105 shadow-md shadow-rose-900'
                        : 'bg-stone-800/70 border-stone-700/70 text-stone-100 hover:bg-stone-750 hover:border-rose-500/50'
                    }`}
                  >
                    <span className="text-2xl font-black font-serif leading-none">{item.jp}</span>
                    <span className="text-[10px] font-bold text-rose-400 mt-1">{item.bn}</span>
                    <span className="text-[9px] text-stone-400">{item.ro}</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 text-[11px] text-stone-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Volume2 size={14} className="text-rose-400 shrink-0" />
                  <span>যেকোনো অক্ষরে ক্লিক করলে জাপানি অডিও বাজবে</span>
                </span>
                <span className="text-[10px] font-bold text-rose-400">ja-JP Audio</span>
              </div>

              {/* Animated Kitsune Sensei Guide Showcase Badge */}
              <div 
                onClick={() => playKitsuneChime()}
                className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-rose-950/70 via-stone-900 to-amber-950/50 border border-rose-800/40 flex items-center gap-3 shadow-lg cursor-pointer group hover:border-rose-600/60 transition-all select-none"
                title="ক্লিক করে কিটসুনে সেনসেই এর সাথে কথা বলুন!"
              >
                <motion.div
                  animate={{
                    y: [0, -4, 0],
                    rotate: [-2, 2, -2]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.4,
                    ease: 'easeInOut'
                  }}
                  className="shrink-0"
                >
                  <FoxAvatar size="sm" isSpeaking={true} isHappy={true} className="drop-shadow-md" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">Kitsune Sensei (きつね先生)</span>
                    <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/60">
                      AI গাইড
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-200/90 truncate mt-0.5">
                    "こんにちは！ আমার সাথে প্রতিদিন সহজ উপায়ে জাপানি ভাষা শিখুন 🦊"
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 2. STATS & KEY METRICS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { number: '৯২+', label: 'হিরাগানা ও কাতাকানা বর্ণ', sub: 'সম্পূর্ণ Gojuuon বিন্যাস', icon: BookOpen, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60' },
          { number: '১০টি', label: 'সুবিন্যস্ত স্টাডি লেভেল', sub: 'বেসিক থেকে অ্যাডভান্সড', icon: Layers, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' },
          { number: '৫টি', label: 'ইন্টারেক্টিভ কুইজ মোড', sub: 'রোমাজি, অডিও ও অর্থ', icon: Trophy, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' },
          { number: '১০০%', label: 'ফ্রি ও আনলিমিটেড অ্যাক্সেস', sub: 'কোনো হিডেন চার্জ নেই', icon: Zap, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  {stat.number}
                </span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                  {stat.label}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {stat.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. INTERACTIVE SOUNDBOARD PREVIEW */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Volume2 size={14} />
              Interactive Soundboard
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
              জাপানি বর্ণের অডিও প্রিভিউ শুনুন
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              যেকোনো কার্ডে ক্লিক করে প্রমিত জাপানি উচ্চারণ ও বাংলা অর্থ পরখ করুন।
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex rounded-xl bg-stone-100 dark:bg-stone-800 p-1 self-start sm:self-auto border border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setActiveSoundTab('hiragana')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeSoundTab === 'hiragana'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              হিরাগানা (Hiragana)
            </button>
            <button
              type="button"
              onClick={() => setActiveSoundTab('katakana')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeSoundTab === 'katakana'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              কাতাকানা (Katakana)
            </button>
          </div>
        </div>

        {/* Character Card Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-3">
          {(activeSoundTab === 'hiragana' ? sampleHiragana : sampleKatakana).map((c) => {
            const isCurrent = playingChar === c.character;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handlePlaySound(c.character, c.romaji)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 scale-102 shadow-md ring-2 ring-rose-500/30'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 hover:bg-white dark:hover:bg-stone-800 hover:border-rose-400'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">{c.romaji}</span>
                  <Volume2 size={12} className={isCurrent ? 'text-rose-600 animate-bounce' : 'text-stone-400'} />
                </div>
                
                <span className="text-3xl sm:text-4xl font-black font-serif text-stone-900 dark:text-white my-1">
                  {c.character}
                </span>

                <div className="w-full pt-1.5 border-t border-stone-200 dark:border-stone-700/60 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-rose-600 dark:text-rose-400">{c.bangla}</span>
                  <span className="text-[10px] text-stone-500 truncate max-w-[70px]">{c.examples?.[0]?.bangla || c.romaji}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            <span>লগইন করে সম্পূর্ণ ৯২টি বর্ণের চার্ট ও স্ট্রোক অর্ডার প্র্যাকটিস করুন</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>

      {/* 4. CHOOSE STARTING LEVEL */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Personalized Curriculum
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
            আপনার পছন্দের লেভেল থেকে শুরু করুন
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1.5">
            যে লেভেলটি আপনার জন্য উপযোগী, সরাসরি সেটিতে ক্লিক করে পড়া শুরু করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'beginner', title: 'একদম নতুন শিক্ষার্থী', jp: '初心者コース', desc: 'হিরাগানা লেভেল ১ (あ い う え お) এবং বাংলা উচ্চারণ', badge: 'Level 1', color: 'from-rose-500/10 to-transparent' },
            { id: 'some_knowledge', title: 'বেসিক রিভিশন', jp: '復習コース', desc: 'ব্যঞ্জনবর্ণ (ka, sa, ta, na) এবং রোমাজি অনুশীলন', badge: 'Level 2-5', color: 'from-amber-500/10 to-transparent' },
            { id: 'know_hiragana', title: 'কাতাকানা মাস্টারক্লাস', jp: 'カタカナ', desc: 'বিদেশি ও আধুনিক শব্দের জন্য সম্পূর্ণ কাতাকানা', badge: 'Katakana', color: 'from-blue-500/10 to-transparent' },
            { id: 'know_katakana', title: 'কুইজ ও এক্সাম চ্যালেঞ্জ', jp: 'クイズ挑戦', desc: '৫টি ভিন্ন কুইজ মোডে মেমরি টেস্ট ও XP অর্জন', badge: 'Quiz Arena', color: 'from-emerald-500/10 to-transparent' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleQuickStart(item.title)}
              className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-rose-500 dark:hover:border-rose-600 hover:shadow-lg transition-all text-left group cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${item.color} opacity-50 pointer-events-none`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                    {item.badge}
                  </span>
                  <span className="text-xs font-bold font-serif text-stone-400">
                    {item.jp}
                  </span>
                </div>
                <h3 className="text-base font-black text-stone-900 dark:text-white group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="relative z-10 mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                <span>এখনই শুরু করুন</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. 6 CORE CAPABILITIES (BENTO GRID) */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-xs">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Smart Learning Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
            কেন চান্দু জাপানিজ স্কুল সেরা?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            জাপানি ভাষার নিখুঁত ভিত্তি তৈরির জন্য প্রয়োজনীয় সব ফিচার এক প্ল্যাটফর্মে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-xl mb-4 font-serif">
              あ
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              সম্পূর্ণ হিরাগানা (৪৬ বর্ণ)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
              ১০টি Gojuuon লেভেলে বিভক্ত। প্রতিটি বর্ণের সঠিক বাংলা উচ্চারণ, রোমাজি এবং সহায়ক উদাহরণ শব্দ।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xl mb-4 font-serif">
              ア
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              সম্পূর্ণ কাতাকানা (৪৬ বর্ণ)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
              বিদেশি শব্দ, আধুনিক টার্ম এবং লোন-ওয়ার্ড পড়ার জন্য প্রয়োজনীয় কাতাকানা বর্ণের সহজ নির্দেশিকা।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold mb-4">
              <PenTool size={20} />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              স্ট্রোক অর্ডার ও ড্রয়িং ক্যানভাস
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
              জাপানি বর্ণ লেখার সঠিক অনুক্রম এবং ব্রাউজারে হাত ঘুরিয়ে প্র্যাকটিস করার ইন্টারঅ্যাক্টিভ প্যাড।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold mb-4">
              <Volume2 size={20} />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              নেটিভ স্পিচ অডিও সিন্থেসিস
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
              জাপানি নেটিভ স্পিকার অ্যাকসেন্টে প্রমিত টোকিও উচ্চারণ শোনার জন্য Web Speech API ইঞ্জিন।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold mb-4">
              <HelpCircle size={20} />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              ৫টি ভিন্ন মোডে কুইজ
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
              অডিও লিসেনিং, রোমাজি আইডেন্টিফিকেশন এবং বাংলা অর্থ মিলকরণ কুইজের মাধ্যমে দক্ষতা যাচাই।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold mb-4">
              <Flame size={20} />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              স্ট্রিক ও প্রগ্রেস ট্র্যাকিং
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
              প্রতিদিনের পড়ার ধারাবাহিকতা, এক্সপি পয়েন্ট এবং বিশেষ লার্নার ব্যাজ অর্জন করে মোটিভেশন ধরে রাখুন।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 via-stone-50 to-amber-500/10 dark:from-rose-950/30 dark:via-stone-850 dark:to-stone-850 border border-rose-200 dark:border-rose-900/60 md:col-span-2 lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                      নতুন ফিচার 📚
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      প্রয়োজনীয় রিসোর্স
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                    জাপানিজ PDF লাইব্রেরি — বই ও শিখন শিট
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                    হিরাগানা ও কাতাকানা লেখার ওয়ার্কশিট, ব্যাকরণ সামারি, কাঞ্জি চার্ট ও JLPT N5 মডেল প্রশ্ন শিট যেকোনো সময় পড়ুন ও ফ্রি ডাউনলোড করুন।
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition active:scale-95 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>PDF লাইব্রেরি দেখুন</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 6. FAQ SECTION */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
            সচরাচর জিজ্ঞাসিত প্রশ্নাবলী
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-stone-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-rose-600' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. BOTTOM CTA CALLOUT */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center mx-auto shadow-md border border-white/40">
            <AppLogo variant="emblem" size="lg" className="w-full h-full" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            আজই শুরু হোক আপনার জাপানি শেখার যাত্রা
          </h2>
          <p className="text-rose-100 text-xs sm:text-base leading-relaxed">
            কোনো ধরনের ফি ছাড়া এখনই সম্পূর্ণ সিলেবাস ও কুইজে অংশ নিন।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-rose-700 font-extrabold text-sm shadow-lg transition active:scale-98 cursor-pointer"
            >
              লগইন করে পড়া শুরু করুন
            </button>
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition cursor-pointer"
            >
              নতুন একাউন্ট তৈরি করুন
            </button>
          </div>

          {/* Developer Link Card */}
          <div className="pt-4 border-t border-rose-500/40 mt-4 flex items-center justify-center">
            <a
              href="https://uchihaemdadul.bio.link/"
              target="_blank"
              rel="noopener noreferrer"
              id="cta-developer-link"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/25 hover:bg-black/40 border border-white/20 text-xs text-rose-100 hover:text-white transition group cursor-pointer"
            >
              <Code2 size={15} className="text-amber-300 shrink-0" />
              <span>Developer:</span>
              <span className="font-bold underline decoration-rose-300">uchihaemdadul</span>
              <ExternalLink size={12} className="text-rose-200 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

