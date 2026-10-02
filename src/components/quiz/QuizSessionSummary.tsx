import React, { useState } from 'react';
import { 
  Trophy, 
  Timer, 
  Target, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Volume2, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Award,
  Layers
} from 'lucide-react';
import { KanaChar, KanaType, QuizQuestion } from '../../types';
import { playJapaneseAudio } from '../../utils/speech';

export interface SessionMistakeItem {
  id: string;
  kanaId: string;
  character: string;
  romaji: string;
  bangla: string;
  type: KanaType;
  level: number;
  questionPrompt?: string;
  userAnswer?: string;
  correctAnswer?: string;
  fromRecentHistory?: boolean;
  wrongCount?: number;
  sourceKana?: KanaChar;
}

export interface QuizSessionSummaryProps {
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpentSeconds: number;
  earnedXP: number;
  sessionAnswers: {
    question: QuizQuestion;
    chosenIndex: number;
    isCorrect: boolean;
  }[];
  weakCharacters: SessionMistakeItem[];
  courseName?: string;
  levelNumber?: number;
  onRetry: () => void;
  onPracticeWeakCharacters?: (targetKanas: KanaChar[]) => void;
  onNavigateHome: () => void;
  onNavigateToMistakes?: () => void;
}

function toBengaliNumerals(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, d => bnDigits[Number(d)]);
}

function formatQuizTime(seconds: number): string {
  if (seconds < 60) {
    return `${toBengaliNumerals(seconds)} সেকেন্ড`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) {
    return `${toBengaliNumerals(mins)} মিনিট`;
  }
  return `${toBengaliNumerals(mins)} মিনিট ${toBengaliNumerals(secs)} সেকেন্ড`;
}

export const QuizSessionSummary: React.FC<QuizSessionSummaryProps> = ({
  score,
  totalQuestions,
  accuracy,
  timeSpentSeconds,
  earnedXP,
  sessionAnswers,
  weakCharacters,
  courseName,
  levelNumber,
  onRetry,
  onPracticeWeakCharacters,
  onNavigateHome,
  onNavigateToMistakes
}) => {
  const [showFullReview, setShowFullReview] = useState<boolean>(true);
  const [playingChar, setPlayingChar] = useState<string | null>(null);

  // Performance category
  const isFlawless = accuracy === 100;
  const isHighAccuracy = accuracy >= 80;
  const isPass = accuracy >= 70;

  // Average time per question
  const avgSecondsPerQuestion = totalQuestions > 0 
    ? (timeSpentSeconds / totalQuestions).toFixed(1)
    : '0';

  const handlePlayAudio = (char: string) => {
    setPlayingChar(char);
    playJapaneseAudio(char, () => {
      setPlayingChar(null);
    });
    setTimeout(() => {
      setPlayingChar(prev => (prev === char ? null : prev));
    }, 1200);
  };

  // Separate session mistakes from previous unmastered mistakes
  const sessionSpecificMistakes = weakCharacters.filter(w => !w.fromRecentHistory);
  const recentHistoryMistakes = weakCharacters.filter(w => w.fromRecentHistory);

  // List of KanaChar objects for direct practice trigger
  const practiceCandidateKanas: KanaChar[] = weakCharacters
    .map(w => w.sourceKana || {
      id: w.kanaId,
      character: w.character,
      romaji: w.romaji,
      bangla: w.bangla,
      type: w.type,
      level: w.level,
      audioText: w.character,
      isLearned: true
    })
    .filter(Boolean);

  return (
    <div 
      id="quiz-session-summary-screen"
      className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-300 pb-12"
    >
      {/* 1. Header Card with Trophy and Performance Verdict */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${
          isFlawless 
            ? 'from-amber-400 via-rose-500 to-emerald-400' 
            : isPass 
              ? 'from-rose-500 to-emerald-500' 
              : 'from-amber-500 to-rose-500'
        }`} />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-black uppercase tracking-wider mb-4">
          <Sparkles size={14} />
          <span>সেশন সারসংক্ষেপ • Session Summary</span>
        </div>

        <div className="relative inline-block mb-3">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-black shadow-lg mx-auto ${
            isFlawless
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/30'
              : isPass
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-rose-500/20'
          }`}>
            {isFlawless ? (
              <Trophy size={42} className="fill-amber-100 text-white animate-bounce" />
            ) : isPass ? (
              <Award size={42} className="text-white" />
            ) : (
              <Target size={42} className="text-white" />
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          {isFlawless 
            ? 'অসাধারণ! নিখুঁত পারফরম্যান্স!' 
            : isHighAccuracy 
              ? 'চমৎকার পরীক্ষা! দারুণ ফলাফল!' 
              : isPass 
                ? 'ভালো অগ্রগতি! সাফল্যের সাথে সম্পন্ন!' 
                : 'ভালো চেষ্টা! হাল ছেড়ো না, চালিয়ে যাও!'}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-lg mx-auto mt-1.5 leading-relaxed">
          {courseName ? `${courseName}${levelNumber ? ` • লেভেল ${toBengaliNumerals(levelNumber)}` : ''} ` : ''}
          {isFlawless
            ? 'আপনি কুইজের সবকটি প্রশ্নের নির্ভুল উত্তর দিয়েছেন। বর্ণমালার উপর আপনার দখল প্রশংসনীয়!'
            : isPass
              ? 'কুইজটি সফলভাবে সম্পন্ন হয়েছে। কিছু নির্দিষ্ট বর্ণ রিভিশন দিলে আপনার দক্ষতা আরও দৃঢ় হবে।'
              : 'কুইজের প্রশ্নগুলো থেকে চিহ্নিত দুর্বল বর্ণগুলো মনোযোগ দিয়ে প্র্যাকটিস করুন।'}
        </p>

        {/* 2. Key Metrics Grid (Accuracy, Time Spent, Earned XP, Practice Needs) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 text-left">
          
          {/* Accuracy Card */}
          <div 
            id="stat-accuracy"
            className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Target size={14} className="text-rose-500" />
                <span>সঠিকতার হার</span>
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                isHighAccuracy 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : isPass 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {isHighAccuracy ? 'উন্নত' : isPass ? 'উত্তীর্ণ' : 'অনুশীলন দরকার'}
              </span>
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${
              isHighAccuracy ? 'text-emerald-600 dark:text-emerald-400' : isPass ? 'text-stone-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {toBengaliNumerals(accuracy)}%
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">
              {toBengaliNumerals(score)} / {toBengaliNumerals(totalQuestions)} সঠিক উত্তর
            </div>
          </div>

          {/* Time Spent Card */}
          <div 
            id="stat-time-spent"
            className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Timer size={14} className="text-blue-500" />
                <span>ব্যয়িত সময়</span>
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white truncate">
              {formatQuizTime(timeSpentSeconds)}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">
              গড়: {toBengaliNumerals(avgSecondsPerQuestion)} সে./প্রশ্ন
            </div>
          </div>

          {/* Earned XP Card */}
          <div 
            id="stat-earned-xp"
            className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-600 dark:text-amber-400 fill-amber-500" />
                <span>অর্জিত XP</span>
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-300">
              +{toBengaliNumerals(earnedXP)}
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
              লেভেল ও স্ট্রিক অগ্রগতি
            </div>
          </div>

          {/* Practice Need Card */}
          <div 
            id="stat-practice-need"
            className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                {weakCharacters.length > 0 ? (
                  <AlertCircle size={14} className="text-rose-500" />
                ) : (
                  <CheckCircle2 size={14} className="text-emerald-500" />
                )}
                <span>অনুশীলন প্রয়োজন</span>
              </span>
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${
              weakCharacters.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {weakCharacters.length > 0 ? `${toBengaliNumerals(weakCharacters.length)}টি বর্ণ` : '০টি বর্ণ'}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">
              {weakCharacters.length > 0 ? 'রিভিশন প্রস্তাবিত' : 'সব আয়ত্তে আছে ✓'}
            </div>
          </div>

        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            id="btn-session-retry"
            onClick={onRetry}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer active:scale-98"
          >
            <RotateCcw size={16} />
            <span>আবার পরীক্ষা দিন</span>
          </button>

          {weakCharacters.length > 0 && onPracticeWeakCharacters && practiceCandidateKanas.length > 0 && (
            <button
              type="button"
              id="btn-session-practice-weak-now"
              onClick={() => onPracticeWeakCharacters(practiceCandidateKanas)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-black text-sm shadow-md transition cursor-pointer active:scale-98"
            >
              <Target size={16} />
              <span>দুর্বল বর্ণগুলো প্র্যাকটিস করুন ({toBengaliNumerals(weakCharacters.length)})</span>
            </button>
          )}

          {weakCharacters.length > 0 && onNavigateToMistakes && (
            <button
              type="button"
              id="btn-session-go-mistakes"
              onClick={onNavigateToMistakes}
              className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer active:scale-98"
            >
              <BookOpen size={16} />
              <span>ভুল খাতা</span>
            </button>
          )}

          <button
            type="button"
            id="btn-session-back-home"
            onClick={onNavigateHome}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition shadow-xs cursor-pointer active:scale-98"
          >
            <span>হোমে ফিরুন</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 3. Section: Characters That Need More Practice Based on Recent Performance */}
      <div 
        id="section-characters-needing-practice"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900/50">
              <AlertCircle size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                যে বর্ণগুলো আরও অনুশীলন প্রয়োজন (Characters Needing Practice)
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                আপনার সাম্প্রতিক পারফরম্যান্স ও এই সেশনের ভুলের ভিত্তিতে প্রস্তাবিত
              </p>
            </div>
          </div>

          {weakCharacters.length > 0 && (
            <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900/60 w-fit">
              {toBengaliNumerals(weakCharacters.length)}টি বর্ণ চিহ্নিত
            </span>
          )}
        </div>

        {weakCharacters.length === 0 ? (
          /* Perfect Mastery View (No Weak Characters) */
          <div className="text-center py-8 px-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
              অভিনন্দন! কোনো দুর্বল বর্ণ নেই 🎉
            </h3>
            <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
              এই সেশনে আপনার সব উত্তর সঠিক হয়েছে এবং আপনার সাম্প্রতিক ইতিহাসে কোনো অমীমাংসিত দুর্বল বর্ণ পাওয়া যায়নি। আপনার দক্ষতা প্রশংসনীয়!
            </p>
          </div>
        ) : (
          /* List of Weak Characters */
          <div className="space-y-4">
            
            {/* Session Specific Mistakes first */}
            {sessionSpecificMistakes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>এই সেশনে ভুল হওয়া বর্ণসমূহ ({toBengaliNumerals(sessionSpecificMistakes.length)}টি):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sessionSpecificMistakes.map((item, idx) => (
                    <div 
                      key={`session_${item.kanaId}_${idx}`}
                      className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 flex items-start gap-4 transition-all hover:border-rose-300"
                    >
                      {/* Character Display */}
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center shadow-xs shrink-0 relative group">
                        <span className="text-3xl font-black font-serif text-stone-900 dark:text-white leading-none">
                          {item.character}
                        </span>
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-1">
                          {item.romaji}
                        </span>

                        <button
                          type="button"
                          onClick={() => handlePlayAudio(item.character)}
                          aria-label={`${item.character} উচ্চারণ শুনুন`}
                          className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-xs hover:scale-110 transition cursor-pointer ${
                            playingChar === item.character ? 'ring-2 ring-rose-500 scale-110' : ''
                          }`}
                        >
                          <Volume2 size={12} />
                        </button>
                      </div>

                      {/* Details & Mistakes info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-xs font-black text-stone-900 dark:text-white">
                            উচ্চারণ: {item.bangla}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            {item.type === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'} • লেভেল {toBengaliNumerals(item.level)}
                          </span>
                        </div>

                        {item.userAnswer && (
                          <div className="text-[11px] text-stone-600 dark:text-stone-400 space-y-0.5 pt-0.5">
                            <div>
                              আপনার উত্তর: <strong className="text-rose-600 dark:text-rose-400 line-through">{item.userAnswer}</strong>
                            </div>
                            <div>
                              সঠিক উত্তর: <strong className="text-emerald-600 dark:text-emerald-400">{item.correctAnswer}</strong>
                            </div>
                          </div>
                        )}

                        <div className="pt-1 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(item.character)}
                            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 size={12} />
                            <span>উচ্চারণ শুনুন</span>
                          </button>

                          {onPracticeWeakCharacters && item.sourceKana && (
                            <button
                              type="button"
                              onClick={() => onPracticeWeakCharacters([item.sourceKana!])}
                              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-700 transition cursor-pointer"
                            >
                              অনুশীলন
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historical recent unmastered mistakes */}
            {recentHistoryMistakes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>সাম্প্রতিক পারফরম্যান্স থেকে প্রস্তাবিত আরও দুর্বল বর্ণ ({toBengaliNumerals(recentHistoryMistakes.length)}টি):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recentHistoryMistakes.map((item, idx) => (
                    <div 
                      key={`hist_${item.kanaId}_${idx}`}
                      className="p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/40 flex items-start gap-4 transition-all hover:border-amber-300"
                    >
                      {/* Character Display */}
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center shadow-xs shrink-0 relative">
                        <span className="text-3xl font-black font-serif text-stone-900 dark:text-white leading-none">
                          {item.character}
                        </span>
                        <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 mt-1">
                          {item.romaji}
                        </span>

                        <button
                          type="button"
                          onClick={() => handlePlayAudio(item.character)}
                          aria-label={`${item.character} উচ্চারণ শুনুন`}
                          className="absolute -bottom-1 -right-1 p-1 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-xs hover:scale-110 transition cursor-pointer"
                        >
                          <Volume2 size={12} />
                        </button>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-xs font-black text-stone-900 dark:text-white">
                            উচ্চারণ: {item.bangla}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                            {item.type === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'}
                          </span>
                        </div>

                        <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                          সাম্প্রতিক কুইজে {toBengaliNumerals(item.wrongCount || 1)} বার ভুল হয়েছিল
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(item.character)}
                            className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 size={12} />
                            <span>উচ্চারণ শুনুন</span>
                          </button>

                          {onPracticeWeakCharacters && item.sourceKana && (
                            <button
                              type="button"
                              onClick={() => onPracticeWeakCharacters([item.sourceKana!])}
                              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-700 transition cursor-pointer"
                            >
                              অনুশীলন
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Practice Weak CTA banner */}
            {onPracticeWeakCharacters && practiceCandidateKanas.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900 dark:text-white">
                      এই {toBengaliNumerals(weakCharacters.length)}টি দুর্বল বর্ণ এখনই ঝালিয়ে নিন
                    </h4>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      সরাসরি এই বর্ণগুলোর উপর একটি কাস্টম কুইজ দিন এবং ভুলগুলো সংশোধন করুন।
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-quick-practice-weak-characters"
                  onClick={() => onPracticeWeakCharacters(practiceCandidateKanas)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                >
                  <span>অনুশীলন শুরু করুন</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

          </div>
        )}
      </div>

      {/* 4. Section: Question-by-Question Detailed Review */}
      <div 
        id="section-question-review"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4"
      >
        <div 
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowFullReview(prev => !prev)}
        >
          <div className="flex items-center gap-2.5">
            <BookOpen size={18} className="text-rose-600 dark:text-rose-400" />
            <h3 className="text-base font-black text-stone-900 dark:text-white">
              প্রশ্নোত্তর পর্যালোচনা (Question Review - {toBengaliNumerals(sessionAnswers.length)}টি প্রশ্ন)
            </h3>
          </div>

          <button 
            type="button"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
            aria-label="টগল প্রশ্ন পর্যালোচনা"
          >
            {showFullReview ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {showFullReview && (
          <div className="space-y-3 pt-2">
            {sessionAnswers.map((ua, idx) => {
              const selectedText = ua.question.options[ua.chosenIndex] || 'উত্তর দেওয়া হয়নি';
              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                    ua.isCorrect 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' 
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {ua.isCorrect ? (
                      <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle size={20} className="text-rose-600 dark:text-rose-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                        {toBengaliNumerals(idx + 1)}. {ua.question.promptText}
                      </p>
                      {ua.question.sourceKana && (
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(ua.question.sourceKana.character)}
                          aria-label="উচ্চারণ শুনুন"
                          className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition cursor-pointer"
                        >
                          <Volume2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-0.5">
                      <span className="text-stone-600 dark:text-stone-400">
                        আপনার উত্তর: <strong className={ua.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400 font-bold'}>{selectedText}</strong>
                      </span>
                      {!ua.isCorrect && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                          সঠিক উত্তর: {ua.question.correctAnswer}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 pt-0.5 border-t border-stone-200/50 dark:border-stone-800/50 mt-1">
                      {ua.question.explanationBn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
