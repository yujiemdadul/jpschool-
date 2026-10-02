import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  BookOpen, 
  Trash2, 
  Check, 
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Flame,
  Award,
  Zap,
  Filter
} from 'lucide-react';
import { MistakeRecord, KanaType, QuizQuestion } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { quizService } from '../../services/quizService';
import { playJapaneseAudio, playSuccessSound, playWrongSound, playFanfareSound } from '../../utils/speech';
import { ProgressBar } from '../common/ProgressBar';

interface MistakesViewProps {
  onNavigateHome: () => void;
  onNavigateToQuiz: () => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({
  onNavigateHome,
  onNavigateToQuiz
}) => {
  const { userProfile, resolveMistake, removeMistake, clearAllMistakes } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'all' | 'hiragana' | 'katakana' | 'pending' | 'mastered'>('pending');
  const [selectedSingleKana, setSelectedSingleKana] = useState<MistakeRecord | null>(null);

  // Active Practice Session State
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [practiceQuestions, setPracticeQuestions] = useState<QuizQuestion[]>([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [practiceScore, setPracticeScore] = useState<number>(0);
  const [totalXpEarnedInPractice, setTotalXpEarnedInPractice] = useState<number>(0);
  const [isPracticeFinished, setIsPracticeFinished] = useState<boolean>(false);
  const [correctedKanaIds, setCorrectedKanaIds] = useState<string[]>([]);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  const allMistakes: MistakeRecord[] = userProfile?.mistakes || [];
  const pendingMistakes = allMistakes.filter(m => !m.mastered);
  const masteredMistakes = allMistakes.filter(m => m.mastered);

  // Filtered mistakes list
  const displayedMistakes = allMistakes.filter(m => {
    if (activeFilter === 'pending') return !m.mastered;
    if (activeFilter === 'mastered') return m.mastered;
    if (activeFilter === 'hiragana') return m.type === 'hiragana';
    if (activeFilter === 'katakana') return m.type === 'katakana';
    return true;
  });

  // Start practice for all pending mistakes (or specific filtered mistakes)
  const handleStartPractice = (targetMistakes: MistakeRecord[] = pendingMistakes) => {
    if (targetMistakes.length === 0) {
      setNoticeMsg('প্র্যাকটিস করার জন্য কোনো ভুল বর্ণ অবশিষ্ট নেই!');
      setTimeout(() => setNoticeMsg(null), 3000);
      return;
    }

    const generated = quizService.generateMistakesQuiz(targetMistakes, 10, userProfile?.scriptLanguage);
    if (!generated || generated.length === 0) {
      setNoticeMsg('প্রশ্ন তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে সাধারণ কুইজ খেলুন।');
      setTimeout(() => setNoticeMsg(null), 3000);
      return;
    }

    setPracticeQuestions(generated);
    setCurrentPracticeIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setPracticeScore(0);
    setTotalXpEarnedInPractice(0);
    setCorrectedKanaIds([]);
    setIsPracticeFinished(false);
    setIsPracticing(true);

    if (generated[0]?.type === 'listen_to_jp' && generated[0]?.audioChar) {
      setTimeout(() => {
        playJapaneseAudio(generated[0].audioChar!);
      }, 300);
    }
  };

  // Start single kana practice
  const handlePracticeSingle = (mistake: MistakeRecord) => {
    handleStartPractice([mistake]);
  };

  const currentQ = practiceQuestions[currentPracticeIndex];

  // Auto-play audio on listening questions
  useEffect(() => {
    if (isPracticing && currentQ && currentQ.type === 'listen_to_jp' && currentQ.audioChar) {
      playJapaneseAudio(currentQ.audioChar);
    }
  }, [currentPracticeIndex, isPracticing, currentQ]);

  // Handle option selection during practice
  const handleSelectPracticeOption = async (optionIndex: number) => {
    if (isAnswerSubmitted || !currentQ) return;

    setSelectedOption(optionIndex);
    setIsAnswerSubmitted(true);

    const isCorrect = optionIndex === currentQ.correctOptionIndex;
    if (isCorrect) {
      playSuccessSound();
      setPracticeScore(prev => prev + 1);

      // Resolve the mistake for this character and award XP!
      if (currentQ.sourceKana) {
        const xp = await resolveMistake(currentQ.sourceKana.id);
        setTotalXpEarnedInPractice(prev => prev + xp);
        setCorrectedKanaIds(prev => Array.from(new Set([...prev, currentQ.sourceKana.id])));
      }
    } else {
      playWrongSound();
    }
  };

  // Move to next question or complete practice session
  const handleNextPracticeQuestion = () => {
    if (currentPracticeIndex < practiceQuestions.length - 1) {
      setCurrentPracticeIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsPracticeFinished(true);
      playFanfareSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  // 1. PRACTICE MODE ACTIVE VIEW
  if (isPracticing) {
    if (isPracticeFinished) {
      return (
        <div className="max-w-xl mx-auto py-8 px-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
            <div className="inline-flex p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
              <Sparkles size={40} className="animate-pulse" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                ভুল সংশোধন সম্পন্ন! 🎉
              </h2>
              <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base mt-2">
                আপনি দারুণ একাগ্রতা দেখিয়েছেন। নিয়মিত রিভিশন আপনাকে নিখুঁত দক্ষ করে তুলবে!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 my-4">
              <div className="bg-stone-50 dark:bg-stone-800/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block">সঠিক উত্তর</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {practiceScore} / {practiceQuestions.length}
                </span>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">বোনাস অর্জিত XP</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-300 mt-1 block">
                  +{totalXpEarnedInPractice} XP
                </span>
              </div>
            </div>

            {correctedKanaIds.length > 0 && (
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-left">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs mb-1">
                  <CheckCircle2 size={16} />
                  <span>সফলভাবে সংশোধিত বর্ণ ({correctedKanaIds.length}টি):</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {correctedKanaIds.map(id => {
                    const char = allMistakes.find(m => m.kanaId === id);
                    if (!char) return null;
                    return (
                      <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 rounded-xl text-sm font-bold text-stone-900 dark:text-white shadow-2xs">
                        <span className="font-serif text-base">{char.character}</span>
                        <span className="text-xs text-stone-500">({char.bangla})</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                id="btn-return-mistakes-notebook"
                onClick={() => setIsPracticing(false)}
                className="flex-1 py-3 px-5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer"
              >
                ভুল তালিকায় ফিরে যান
              </button>

              <button
                type="button"
                id="btn-back-to-home-from-mistakes"
                onClick={onNavigateHome}
                className="flex-1 py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>হোম ড্যাশবোর্ড</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Active practice question card
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6 px-4 animate-in fade-in duration-200">
        
        {/* Top Progress & Exit Bar */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-lg">
              ভুল সংশোধন {currentPracticeIndex + 1} / {practiceQuestions.length}
            </span>
          </div>

          <div className="flex-1 max-w-xs mx-auto">
            <ProgressBar 
              value={((currentPracticeIndex + 1) / practiceQuestions.length) * 100} 
              colorClass="bg-rose-600" 
            />
          </div>

          <button
            type="button"
            onClick={() => setIsPracticing(false)}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
          >
            প্রস্থান
          </button>
        </div>

        {/* Question Card */}
        {currentQ && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900/50">
                দুর্বল বর্ণ প্র্যাকটিস (Weak Kana Practice)
              </span>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                স্কোর: {practiceScore}
              </span>
            </div>

            {/* Prompt */}
            <div className="text-center py-2 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                {currentQ.promptText}
              </h2>

              {currentQ.promptChar && (
                <div className="text-6xl sm:text-7xl font-black font-serif text-stone-900 dark:text-white tracking-tight my-2">
                  {currentQ.promptChar}
                </div>
              )}

              {/* Audio Listen Question Button */}
              {currentQ.type === 'listen_to_jp' && currentQ.audioChar && (
                <div className="py-3">
                  <button
                    type="button"
                    onClick={() => playJapaneseAudio(currentQ.audioChar!)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900 transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Volume2 size={24} className="animate-pulse" />
                    <span className="font-bold text-sm">উচ্চারণ শুনুন (Play Audio)</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              {currentQ.options.map((option, idx) => {
                let btnStyle = 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700';

                if (isAnswerSubmitted) {
                  if (idx === currentQ.correctOptionIndex) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500 font-bold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500 font-bold';
                  } else {
                    btnStyle = 'border-stone-200 dark:border-stone-800 opacity-50 text-stone-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectPracticeOption(idx)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-between gap-3 text-base sm:text-lg font-medium shadow-2xs ${btnStyle}`}
                  >
                    <span className="flex-1 font-bold">{option}</span>
                    {isAnswerSubmitted && idx === currentQ.correctOptionIndex && (
                      <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && idx === selectedOption && idx !== currentQ.correctOptionIndex && (
                      <XCircle size={20} className="text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation and Next Button */}
            {isAnswerSubmitted && (
              <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800 animate-in fade-in duration-200">
                <div className={`p-4 rounded-2xl text-xs sm:text-sm ${
                  selectedOption === currentQ.correctOptionIndex
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300'
                }`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {selectedOption === currentQ.correctOptionIndex ? (
                      <>
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span>সঠিক হয়েছে! এই ভুল বর্ণটি সফলভাবে সংশোধন করা হয়েছে (+১৫ XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} className="text-rose-600" />
                        <span>আবারও ভুল হয়েছে! বর্ণটি ভালো করে লক্ষ্য করুন।</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-stone-700 dark:text-stone-300">
                    {currentQ.explanationBn}
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-next-practice-question"
                  onClick={handleNextPracticeQuestion}
                  className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{currentPracticeIndex < practiceQuestions.length - 1 ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখুন'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    );
  }

  // 2. MAIN MISTAKES REVIEW NOTEBOOK VIEW
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-bold">
              <RotateCcw size={13} />
              <span>復習ノート • Revision Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              ভুল পর্যালোচনার খাতা (Mistakes Review)
            </h1>
            {noticeMsg && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold animate-in fade-in">
                {noticeMsg}
              </div>
            )}
            <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base max-w-xl">
              অনুশীলন বা কুইজে আপনার যে বর্ণগুলোতে ভুল হয়েছিল, সেগুলো এখানে স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে। নিয়মিত প্র্যাকটিস করে দুর্বলতা কাটিয়ে উঠুন।
            </p>
          </div>

          {/* Quick Practice CTA */}
          {pendingMistakes.length > 0 && (
            <div className="shrink-0 flex flex-col gap-2">
              <button
                type="button"
                id="btn-practice-all-mistakes"
                onClick={() => handleStartPractice(pendingMistakes)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
              >
                <Sparkles size={18} />
                <span>ভুলগুলো প্র্যাকটিস করুন ({pendingMistakes.length}টি)</span>
              </button>

              <button
                type="button"
                id="btn-clear-mistakes-safe"
                onClick={() => {
                  if (confirm('আপনি কি সত্যিই সমস্ত ভুল পর্যালোচনার তালিকা খালি করতে চান?')) {
                    clearAllMistakes();
                  }
                }}
                className="text-[11px] text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 font-medium text-center hover:underline cursor-pointer"
              >
                সব তালিকা খালি করুন
              </button>
            </div>
          )}
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
          <div className="bg-rose-50/60 dark:bg-rose-950/30 p-3 sm:p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40">
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 block">সংশোধন বাকি</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
              {pendingMistakes.length} টি
            </span>
          </div>

          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3 sm:p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">সংশোধিত বর্ণ</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              {masteredMistakes.length} টি
            </span>
          </div>

          <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3 sm:p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">মোট রেকর্ড</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
              {allMistakes.length} টি
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'pending'
                ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <span>সংশোধন প্রয়োজন</span>
            <span className="px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-full text-[10px]">
              {pendingMistakes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('mastered')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'mastered'
                ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <span>সংশোধিত</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px]">
              {masteredMistakes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            সবগুলো ({allMistakes.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('hiragana')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'hiragana'
                ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            হিরাগানা
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('katakana')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'katakana'
                ? 'bg-white dark:bg-stone-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            কাতাকানা
          </button>
        </div>

        {pendingMistakes.length > 1 && (
          <button
            type="button"
            onClick={() => handleStartPractice(displayedMistakes.filter(m => !m.mastered))}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>ফিল্টার করা বর্ণ প্র্যাকটিস করুন</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {displayedMistakes.length === 0 && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">
              {activeFilter === 'pending' ? 'কোনো অমীমাংসিত ভুল বর্ণ নেই!' : 'এই ফিল্টারে কোনো বর্ণ পাওয়া যায়নি'}
            </h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm max-w-md mx-auto">
              {activeFilter === 'pending'
                ? 'দারুণ প্রস্তুতি! আপনি কুইজে যে প্রশ্নগুলোর উত্তর দিয়েছেন সেগুলো নির্ভুল ছিল অথবা আপনি সফলভাবে সংশোধন করে নিয়েছেন।'
                : 'অন্যান্য ফিল্টার নির্বাচন করুন অথবা নতুন কুইজে অংশ নিন।'}
            </p>
          </div>

          <div className="pt-3">
            <button
              type="button"
              id="btn-empty-mistakes-go-quiz"
              onClick={onNavigateToQuiz}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <HelpCircle size={16} />
              <span>নতুন কুইজ শুরু করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* Mistakes Cards Grid */}
      {displayedMistakes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedMistakes.map((mistake) => {
            const isMastered = mistake.mastered;

            return (
              <div 
                key={mistake.id}
                className={`bg-white dark:bg-stone-900 border rounded-2xl p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-4 ${
                  isMastered 
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20' 
                    : 'border-stone-200 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-800'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      mistake.type === 'hiragana'
                        ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                        : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900'
                    }`}>
                      {mistake.type === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'} • লেভেল {mistake.level}
                    </span>

                    {isMastered ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Check size={11} />
                        <span>সংশোধিত</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                        <AlertCircle size={11} />
                        <span>{mistake.wrongCount || 1} বার ভুল</span>
                      </span>
                    )}
                  </div>

                  {/* Character Showcase */}
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black font-serif text-stone-900 dark:text-white">
                        {mistake.character}
                      </span>
                      <div>
                        <div className="text-base font-bold text-stone-800 dark:text-stone-200">
                          {mistake.bangla}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-400">
                          Romaji: <span className="font-mono font-medium">{mistake.romaji}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => playJapaneseAudio(mistake.character)}
                      className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                      title="উচ্চারণ শুনুন"
                      aria-label={`${mistake.character} এর উচ্চারণ শুনুন`}
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>

                  {/* Last Mistake Prompt & Comparison Context */}
                  {(mistake.userAnswer || mistake.correctAnswer || mistake.lastQuestionPrompt) && (
                    <div className="mt-3 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-[11px] space-y-1">
                      {mistake.lastQuestionPrompt && (
                        <p className="text-stone-600 dark:text-stone-400 line-clamp-1 font-medium">
                          {mistake.lastQuestionPrompt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 pt-0.5">
                        {mistake.userAnswer && (
                          <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                            <XCircle size={12} />
                            <span>আপনার উত্তর: <strong className="font-bold">{mistake.userAnswer}</strong></span>
                          </span>
                        )}
                        {mistake.correctAnswer && (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 size={12} />
                            <span>সঠিক: <strong className="font-bold">{mistake.correctAnswer}</strong></span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePracticeSingle(mistake)}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <Sparkles size={13} />
                    <span>প্র্যাকটিস করুন</span>
                  </button>

                  {!isMastered ? (
                    <button
                      type="button"
                      onClick={() => resolveMistake(mistake.kanaId)}
                      className="p-2 rounded-xl text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition cursor-pointer"
                      title="সংশোধিত হিসেবে চিহ্নিত করুন"
                      aria-label="সংশোধিত হিসেবে চিহ্নিত করুন"
                    >
                      <Check size={16} />
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => removeMistake(mistake.kanaId)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                    title="তালিকা থেকে মুছুন"
                    aria-label="তালিকা থেকে মুছুন"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
