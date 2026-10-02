import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trophy, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Award,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { KANJI_N5_LIST, KANJI_CATEGORIES } from '../../data/kanjiN5Data';
import { KanjiChar, KanjiCategory } from '../../types';
import { KanjiCard } from './KanjiCard';
import { KanjiDetailModal } from './KanjiDetailModal';
import { KanjiQuizModal } from './KanjiQuizModal';
import { useAuth } from '../../context/AuthContext';

export const KanjiView: React.FC = () => {
  const { userProfile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<KanjiCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlearned' | 'learned'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [activeKanjiModal, setActiveKanjiModal] = useState<KanjiChar | null>(null);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);

  const learnedIds = useMemo(() => {
    return userProfile?.kanjiProgress?.learnedKanjiIds || [];
  }, [userProfile?.kanjiProgress?.learnedKanjiIds]);

  // Filter Kanji list
  const filteredKanji = useMemo(() => {
    return KANJI_N5_LIST.filter(k => {
      // Category check
      if (selectedCategory !== 'all' && k.category !== selectedCategory) {
        return false;
      }

      // Learned status check
      const isLearned = learnedIds.includes(k.id);
      if (statusFilter === 'learned' && !isLearned) return false;
      if (statusFilter === 'unlearned' && isLearned) return false;

      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesChar = k.character.includes(q);
        const matchesBn = k.meaningBn.toLowerCase().includes(q);
        const matchesEn = k.meaningEn.toLowerCase().includes(q);
        const matchesMnemonic = k.mnemonicStoryBn.toLowerCase().includes(q);
        const matchesKun = k.kunyomi.some(r => r.toLowerCase().includes(q)) || k.kunyomiBn.some(r => r.includes(q));
        const matchesOn = k.onyomi.some(r => r.toLowerCase().includes(q)) || k.onyomiBn.some(r => r.includes(q));

        if (!matchesChar && !matchesBn && !matchesEn && !matchesMnemonic && !matchesKun && !matchesOn) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, statusFilter, searchQuery, learnedIds]);

  const totalCount = KANJI_N5_LIST.length;
  const learnedCount = KANJI_N5_LIST.filter(k => learnedIds.includes(k.id)).length;
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header & Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-rose-500 via-rose-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background Kanji */}
        <div className="absolute -right-6 -bottom-8 text-9xl font-black opacity-10 select-none pointer-events-none font-serif">
          漢
        </div>

        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide">
            <Sparkles size={14} />
            <span>JLPT N5 বিশেষ চিত্রলিপি পাঠ্যক্রম</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            সহজ কৌশলে N5 কাঞ্জি শিক্ষা
          </h1>
          <p className="text-white/90 text-sm sm:text-base font-medium leading-relaxed">
            মুখস্থ না করে বাস্তব চিত্র ও মজার স্মৃতির গল্পের (Mnemonics) মাধ্যমে জাপানি কাঞ্জি সহজেই মনে রাখুন।
          </p>
        </div>

        {/* Action Button */}
        <div className="relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => setShowQuizModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-rose-600 hover:bg-stone-50 font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <Trophy size={18} className="text-amber-500" />
            <span>কাঞ্জি কুইজ পরীক্ষা</span>
          </button>
        </div>
      </div>

      {/* Progress & Stat Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-stone-500 dark:text-stone-400">
              N5 কাঞ্জি অগ্রগতি
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-0.5">
              {learnedCount} / {totalCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 dark:border-rose-500/30 flex items-center justify-center font-black text-xs text-rose-600 dark:text-rose-400">
            {progressPercent}%
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-stone-500 dark:text-stone-400">
              শেখায় অর্জিত কাঞ্জি XP
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400 mt-0.5">
              +{learnedCount * 20} XP
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award size={24} />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-stone-500 dark:text-stone-400">
              শিখতে বাকি কাঞ্জি
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {totalCount - learnedCount}টি
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <BookOpen size={24} />
          </div>
        </div>
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-3 bg-white dark:bg-stone-800/80 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs">
        {/* Search input & status filter row */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="কাঞ্জি, বাংলা অর্থ বা উচ্চারণ খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white placeholder-stone-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-all"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              সব ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('unlearned')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'unlearned'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              শিখতে বাকি ({totalCount - learnedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('learned')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'learned'
                  ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              শেখা শেষ ({learnedCount})
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            সব ক্যাটাগরি
          </button>
          {KANJI_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat.nameBn}
            </button>
          ))}
        </div>
      </div>

      {/* Kanji Cards Grid */}
      {filteredKanji.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredKanji.map(kanji => (
            <KanjiCard
              key={kanji.id}
              kanji={kanji}
              isLearned={learnedIds.includes(kanji.id)}
              onClick={() => setActiveKanjiModal(kanji)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
          <HelpCircle size={40} className="mx-auto text-stone-400" />
          <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">
            কোনো কাঞ্জি পাওয়া যায়নি
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো কাঞ্জি খুঁজে পাওয়া যায়নি। ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 cursor-pointer"
          >
            সব ফিল্টার মুছুন
          </button>
        </div>
      )}

      {/* Modals */}
      {activeKanjiModal && (
        <KanjiDetailModal
          kanji={activeKanjiModal}
          kanjiList={filteredKanji}
          onClose={() => setActiveKanjiModal(null)}
          onSelectKanji={k => setActiveKanjiModal(k)}
        />
      )}

      {showQuizModal && (
        <KanjiQuizModal
          kanjiList={KANJI_N5_LIST}
          onClose={() => setShowQuizModal(false)}
        />
      )}
    </div>
  );
};
