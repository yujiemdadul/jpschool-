import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Volume2, 
  Sparkles, 
  Lock, 
  Play,
  Layers
} from 'lucide-react';
import { KanaLevel, KanaType } from '../../types';
import { HIRAGANA_LEVELS } from '../../data/hiraganaData';
import { KATAKANA_LEVELS } from '../../data/katakanaData';
import { useAuth } from '../../context/AuthContext';
import { ProgressBar } from '../common/ProgressBar';
import { playJapaneseAudio } from '../../utils/speech';

export interface CourseViewProps {
  courseType: KanaType;
  onOpenLevel: (type: KanaType, level: number, initialStep?: 1 | 2 | 3 | 4) => void;
  onStartLevelQuiz: (type: KanaType, level: number) => void;
}

export const CourseView: React.FC<CourseViewProps> = ({
  courseType,
  onOpenLevel,
  onStartLevelQuiz
}) => {
  const { userProfile } = useAuth();
  const [activeCourse, setActiveCourse] = useState<KanaType>(courseType);

  useEffect(() => {
    setActiveCourse(courseType);
  }, [courseType]);

  const levels = activeCourse === 'hiragana' ? HIRAGANA_LEVELS : KATAKANA_LEVELS;
  const progressData = activeCourse === 'hiragana' 
    ? userProfile?.hiraganaProgress 
    : userProfile?.katakanaProgress;

  const completedLevels = progressData?.completedLevels || [];
  const completedChars = progressData?.completedChars || [];

  const completedCount = completedChars.length;
  const percentage = Math.min(100, Math.round((completedCount / 46) * 100));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Course Header Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            {/* Course Switcher Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-stone-100 dark:bg-stone-800 mb-3">
              <button
                type="button"
                id="tab-select-hiragana"
                onClick={() => setActiveCourse('hiragana')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                  activeCourse === 'hiragana'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <BookOpen size={15} />
                <span>হিরাগানা (Hiragana)</span>
              </button>
              <button
                type="button"
                id="tab-select-katakana"
                onClick={() => setActiveCourse('katakana')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                  activeCourse === 'katakana'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Layers size={15} />
                <span>কাতাকানা (Katakana)</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              {activeCourse === 'hiragana' ? 'হিরাগানা (Hiragana)' : 'কাতাকানা (Katakana)'}
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base mt-1">
              {activeCourse === 'hiragana' 
                ? 'জাপানি পড়ার প্রথম ধাপ — স্ট্যান্ডার্ড Gojuuon বিন্যাসে সাজানো ১০টি সহজ লেভেল।' 
                : 'বিদেশি শব্দ, দেশ, আধুনিক প্রযুক্তি ও নাম লেখার কাতাকানা বর্ণমালা।'}
            </p>
          </div>

          {/* Progress Summary Card */}
          <div className="bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 rounded-xl p-4 min-w-56 shrink-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">কোর্সের অগ্রগতি</span>
              <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                {completedCount} / 46 অক্ষর ({percentage}%)
              </span>
            </div>
            <ProgressBar 
              value={percentage} 
              colorClass={activeCourse === 'hiragana' ? 'bg-rose-600' : 'bg-blue-600'} 
            />
            <div className="flex justify-between items-center text-[11px] font-semibold text-stone-500 dark:text-stone-400 mt-2">
              <span>লেভেল সমাপ্ত:</span>
              <span className="text-stone-800 dark:text-stone-200 font-bold">{completedLevels.length} / 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Levels Grid (Level 1 to Level 10) */}
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white">
            লেভেল তালিকা (Level 1 – 10)
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            প্রতিটি লেভেলে ক্লিক করে পাঠ ও উচ্চারণ অনুশীলন করুন
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {levels.map((lvl) => {
            const levelCharsCount = lvl.characters.length;
            const levelCompletedChars = lvl.characters.filter(c => completedChars.includes(c.id)).length;
            const isCompleted = completedLevels.includes(lvl.level);
            const isAllCharsLearned = levelCharsCount > 0 && levelCompletedChars === levelCharsCount;
            const levelPercentage = Math.round((levelCompletedChars / levelCharsCount) * 100);

            return (
              <div
                key={lvl.level}
                id={`level-card-${activeCourse}-${lvl.level}`}
                className={`bg-white dark:bg-stone-900 border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'border-emerald-300 dark:border-emerald-900/60 ring-1 ring-emerald-400/20'
                    : isAllCharsLearned
                    ? 'border-amber-300 dark:border-amber-900/60 ring-1 ring-amber-400/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-900/70'
                }`}
              >
                <div>
                  {/* Top Level Title and Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : isAllCharsLearned
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}>
                        Level {lvl.level}
                      </span>
                      <span className="text-xs font-bold text-stone-500 dark:text-stone-400 font-serif">
                        {lvl.titleJp}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={13} />
                        <span>সম্পন্ন</span>
                      </span>
                    ) : isAllCharsLearned ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                        <span>সব বর্ণ শেখা • কুইজ বাকি</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                        {levelCompletedChars} / {levelCharsCount} শেখা হয়েছে
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mb-1">
                    {lvl.titleBn}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                    {lvl.descriptionBn}
                  </p>

                  {/* Character Badges Row */}
                  <div className="grid grid-cols-5 gap-2 my-3">
                    {lvl.characters.map((char) => {
                      const isCharLearned = completedChars.includes(char.id);
                      const isEnglishMode = userProfile?.scriptLanguage === 'english';
                      return (
                        <div
                          key={char.id}
                          onClick={() => onOpenLevel(activeCourse, lvl.level)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                            isCharLearned
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                              : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700/60 hover:bg-white dark:hover:bg-stone-800'
                          }`}
                        >
                          <span className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
                            {char.character}
                          </span>
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            {isEnglishMode ? char.romaji : char.bangla}
                          </span>
                          <span className="text-[9px] text-stone-400 uppercase tracking-tighter">
                            {isEnglishMode ? char.bangla : char.romaji}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Level Footer Actions */}
                <div className="pt-4 mt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenLevel(activeCourse, lvl.level, (!isCompleted && isAllCharsLearned) ? 4 : 1)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs sm:text-sm hover:bg-stone-800 dark:hover:bg-stone-200 transition cursor-pointer"
                  >
                    <BookOpen size={14} />
                    <span>{isCompleted ? 'পুনরাবৃত্তি করুন' : isAllCharsLearned ? 'কুইজ সম্পন্ন করুন' : 'পাঠ শুরু করুন'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onStartLevelQuiz(activeCourse, lvl.level)}
                    title="এই লেভেলের কুইজ টেস্ট"
                    className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-rose-300 dark:border-rose-900/70 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs sm:text-sm hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
                  >
                    <HelpCircle size={14} />
                    <span>কুইজ</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
