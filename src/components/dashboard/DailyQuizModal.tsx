import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Flame, 
  Zap, 
  Trophy, 
  Sparkles, 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Clock,
  Gift,
  HelpCircle,
  Award,
  Target,
  Timer,
  AlertCircle
} from 'lucide-react';
import { QuizQuestion } from '../../types';
import { quizService } from '../../services/quizService';
import { userService, getTodayDateString } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { playJapaneseAudio, playSuccessSound, playWrongSound, playFanfareSound } from '../../utils/speech';
import { ACHIEVEMENTS } from '../../data/achievementsData';
import { StreakCounter } from '../common/StreakCounter';

interface DailyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const DailyQuizModal: React.FC<DailyQuizModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { userProfile, setUserProfile, recordMistake } = useAuth();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ question: QuizQuestion; chosenIndex: number; isCorrect: boolean }[]>([]);

  // Result summary breakdown
  const [rewardBreakdown, setRewardBreakdown] = useState<{
    totalXP: number;
    baseXP: number;
    bonusXP: number;
    streakBonusXP: number;
    newDailyStreak: number;
    newlyUnlocked: string[];
    isAlreadyDoneToday: boolean;
  } | null>(null);

  // Initialize or reset questions when opened
  const initChallenge = useCallback(() => {
    // Generate 5 balanced questions from both Hiragana & Katakana
    const generated = quizService.generateQuiz('mixed', undefined, 5, userProfile?.scriptLanguage);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
    setRewardBreakdown(null);
    setStartTime(Date.now());
    setTimeSpentSeconds(0);
    setUserAnswers([]);
  }, [userProfile?.scriptLanguage]);

  useEffect(() => {
    if (isOpen) {
      initChallenge();
    }
  }, [isOpen, initChallenge]);

  // Current active question
  const currentQuestion = questions[currentIndex];

  // Auto-play audio on question load if it's listening or has char
  useEffect(() => {
    if (isOpen && currentQuestion && !isAnswerSubmitted && !isFinished) {
      if (currentQuestion.type === 'listen_to_jp' && currentQuestion.audioChar) {
        playJapaneseAudio(currentQuestion.audioChar);
      }
    }
  }, [isOpen, currentQuestion, isAnswerSubmitted, isFinished]);

  if (!isOpen) return null;

  const currentStreak = userProfile?.dailyQuizStreak || 0;
  const isAlreadyDoneToday = userService.isDailyQuizCompletedToday(userProfile);

  // Handle Option Select
  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted || !currentQuestion) return;

    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQuestion.correctOptionIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      playSuccessSound();
    } else {
      playWrongSound();
      if (currentQuestion.sourceKana && recordMistake) {
        recordMistake({
          kana: currentQuestion.sourceKana,
          questionPrompt: currentQuestion.promptText,
          userAnswer: currentQuestion.options[index],
          correctAnswer: currentQuestion.correctAnswer
        });
      }
    }

    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQuestion,
        chosenIndex: index,
        isCorrect
      }
    ]);
  };

  // Move to next question or finish
  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished all 5 questions
      const finalDuration = Math.max(1, Math.round((Date.now() - (startTime || Date.now())) / 1000));
      setTimeSpentSeconds(finalDuration);
      setIsFinished(true);
      playFanfareSound();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (userProfile) {
        try {
          const result = await userService.completeDailyQuizChallenge(userProfile, score, 5);
          setUserProfile(result.updatedProfile);
          setRewardBreakdown({
            totalXP: result.earnedXP,
            baseXP: result.baseXP,
            bonusXP: result.bonusXP,
            streakBonusXP: result.streakBonusXP,
            newDailyStreak: result.newDailyStreak,
            newlyUnlocked: result.newlyUnlocked,
            isAlreadyDoneToday
          });
          if (onComplete) {
            onComplete();
          }
        } catch (err) {
          console.error('Error completing daily quiz:', err);
        }
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && isFinished) {
          onClose();
        }
      }}
    >
      <div 
        id="daily-quiz-modal"
        className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Zap size={20} className="fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-stone-900 dark:text-white">
                  দৈনিক কুইজ চ্যালেঞ্জ
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Daily 24h
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                ৫টি দ্রুত প্রশ্ন • স্ট্রিক বজায় রাখুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Daily Streak Badge */}
            <StreakCounter
              streak={isFinished && rewardBreakdown ? rewardBreakdown.newDailyStreak : currentStreak}
              isGoalCompleted={isFinished || isAlreadyDoneToday}
              variant="badge"
            />

            {/* Close Button */}
            <button
              type="button"
              id="btn-close-daily-quiz"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {!isFinished && currentQuestion ? (
            <div className="space-y-4 sm:space-y-5">
              {/* Question Progress Tracker */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/50">
                  প্রশ্ন {currentIndex + 1} / {questions.length}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                  স্কোর: {score}
                </span>
              </div>

              {/* Progress step dots */}
              <div className="grid grid-cols-5 gap-1.5 w-full">
                {questions.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i < currentIndex 
                        ? 'bg-emerald-500' 
                        : i === currentIndex 
                        ? 'bg-rose-600' 
                        : 'bg-stone-200 dark:bg-stone-700'
                    }`}
                  />
                ))}
              </div>

              {/* Center Prompt Box */}
              <div className="text-center py-4 px-3 sm:py-6 sm:px-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80">
                {currentQuestion.promptChar && (
                  <div className="text-5xl sm:text-6xl font-bold font-serif text-stone-900 dark:text-white mb-2 tracking-tight">
                    {currentQuestion.promptChar}
                  </div>
                )}

                <h4 className="text-sm sm:text-base font-bold text-stone-800 dark:text-stone-100">
                  {currentQuestion.promptText}
                </h4>

                {/* Audio Button if char available */}
                {(currentQuestion.promptChar || currentQuestion.audioChar) && (
                  <div className="mt-3">
                    <button
                      type="button"
                      id="btn-daily-quiz-audio"
                      onClick={() => playJapaneseAudio(currentQuestion.audioChar || currentQuestion.promptChar || '')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200 text-xs font-bold hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 shadow-2xs transition active:scale-95 cursor-pointer"
                    >
                      <Volume2 size={15} className="text-rose-600 dark:text-rose-400" />
                      <span>উচ্চারণ শুনুন</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2x2 Option Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {currentQuestion.options.map((option, idx) => {
                  let btnStyle = 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-rose-300 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 text-stone-800 dark:text-stone-200';
                  
                  if (isAnswerSubmitted) {
                    if (idx === currentQuestion.correctOptionIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 shadow-xs ring-2 ring-emerald-500/20';
                    } else if (selectedOption === idx) {
                      btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100 shadow-xs ring-2 ring-rose-500/20';
                    } else {
                      btnStyle = 'opacity-40 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      id={`btn-daily-opt-${idx}`}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3.5 sm:p-4 rounded-xl border text-center font-bold text-sm sm:text-base transition-all duration-150 flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span className="flex-1 text-center font-medium">
                        {option}
                      </span>
                      {isAnswerSubmitted && idx === currentQuestion.correctOptionIndex && (
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== currentQuestion.correctOptionIndex && (
                        <XCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Continue Action Bar */}
              {isAnswerSubmitted && (
                <div className="pt-2 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="text-xs text-stone-500 dark:text-stone-400 max-w-[65%] truncate">
                    {currentQuestion.explanationBn}
                  </div>
                  <button
                    type="button"
                    id="btn-daily-quiz-next"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer shrink-0 ml-auto"
                  >
                    <span>{currentIndex === questions.length - 1 ? 'ফলাফল দেখুন' : 'চালিয়ে যাও'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Finished Result Summary View */
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-3xl bg-amber-500 text-white flex items-center justify-center font-black text-4xl shadow-xl shadow-amber-500/20 mx-auto">
                  <Trophy size={40} className="fill-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-1.5 rounded-xl shadow-sm">
                  <Flame size={18} className="fill-white" />
                </div>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  🎉 আজকের চ্যালেঞ্জ সম্পন্ন!
                </span>
                <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
                  চমৎকার অনুশীলন!
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  আপনি ৫টির মধ্যে {score}টি প্রশ্নের সঠিক উত্তর দিয়েছেন।
                </p>
              </div>

              {/* Accuracy & Time Spent Badges */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-0.5">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <Target size={14} className="text-rose-500" />
                      <span>সঠিকতার হার</span>
                    </span>
                    <span className="font-bold text-stone-900 dark:text-white">
                      {Math.round((score / 5) * 100)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    ৫টির মধ্যে {score}টি সঠিক
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-0.5">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <Timer size={14} className="text-blue-500" />
                      <span>ব্যয়িত সময়</span>
                    </span>
                    <span className="font-bold text-stone-900 dark:text-white">
                      {timeSpentSeconds < 60 ? `${timeSpentSeconds} সে.` : `${Math.floor(timeSpentSeconds / 60)}মি. ${timeSpentSeconds % 60}সে.`}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    গড়: {(timeSpentSeconds / 5).toFixed(1)} সে./প্রশ্ন
                  </div>
                </div>
              </div>

              {/* Characters Needing Practice in Daily Quiz */}
              {userAnswers.filter(a => !a.isCorrect).length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-left space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                    <AlertCircle size={14} />
                    <span>অনুশীলন প্রস্তাবিত দুর্বল বর্ণ ({userAnswers.filter(a => !a.isCorrect).length}টি):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userAnswers.filter(a => !a.isCorrect).map((ans, idx) => {
                      const char = ans.question.sourceKana?.character || ans.question.promptChar || ans.question.correctAnswer;
                      const bn = ans.question.sourceKana?.bangla || ans.question.correctAnswer;
                      return (
                        <div 
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-rose-200 dark:border-rose-900 shadow-2xs text-xs font-bold text-stone-900 dark:text-white"
                        >
                          <span className="text-base font-serif text-rose-600 dark:text-rose-400">{char}</span>
                          <span className="text-stone-500 dark:text-stone-400">({bn})</span>
                          <button
                            type="button"
                            onClick={() => playJapaneseAudio(char)}
                            className="p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
                            aria-label={`${char} উচ্চারণ শুনুন`}
                          >
                            <Volume2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* XP & Rewards Breakdown Grid */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 text-left space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    <span>সঠিক উত্তর ({score}/৫):</span>
                  </span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    +{score * 10} XP
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                    <Gift size={15} className="text-amber-500" />
                    <span>দৈনিক চ্যালেঞ্জ বোনাস:</span>
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    +{rewardBreakdown?.bonusXP || 50} XP
                  </span>
                </div>

                {(rewardBreakdown?.streakBonusXP || 0) > 0 && (
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                      <Flame size={15} className="text-orange-500" />
                      <span>স্ট্রিক বোনাস ({rewardBreakdown?.newDailyStreak} দিন):</span>
                    </span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      +{rewardBreakdown?.streakBonusXP} XP
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between font-black text-sm sm:text-base">
                  <span className="text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles size={16} className="text-rose-600" />
                    <span>মোট অর্জিত XP:</span>
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-extrabold text-lg">
                    +{rewardBreakdown?.totalXP || (score * 10 + 50)} XP
                  </span>
                </div>
              </div>

              {/* Newly Unlocked Achievements if any */}
              {rewardBreakdown?.newlyUnlocked && rewardBreakdown.newlyUnlocked.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-300 dark:border-amber-800 text-left flex items-center gap-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      নতুন অর্জন আনলক হয়েছে!
                    </h5>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                      {ACHIEVEMENTS.find(a => a.id === rewardBreakdown.newlyUnlocked[0])?.titleBn || 'Daily Challenger'}
                    </p>
                  </div>
                </div>
              )}

              {/* Daily Streak Confirmation Banner with Fire & Sparkle Animation */}
              <div className="w-full">
                <StreakCounter
                  streak={rewardBreakdown?.newDailyStreak || (currentStreak + 1)}
                  isGoalCompleted={true}
                  variant="featured"
                  showBonusBadge={true}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  id="btn-daily-quiz-restart"
                  onClick={initChallenge}
                  className="flex-1 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-xs sm:text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={15} />
                  <span>পুনরায় অনুশীলন</span>
                </button>

                <button
                  type="button"
                  id="btn-daily-quiz-finish-close"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 font-black text-xs sm:text-sm text-white shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>ড্যাশবোর্ডে ফিরে যান</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
