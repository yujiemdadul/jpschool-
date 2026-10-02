import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  PenTool, 
  BookOpen, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Sparkles,
  ListOrdered,
  ArrowRight,
  RotateCcw,
  Trophy,
  Zap,
  Flame,
  Ear
} from 'lucide-react';
import { KanaChar, KanaLevel, KanaType } from '../../types';
import { HIRAGANA_LEVELS, HIRAGANA_CHARS } from '../../data/hiraganaData';
import { KATAKANA_LEVELS, KATAKANA_CHARS } from '../../data/katakanaData';
import { AudioButton } from '../common/AudioButton';
import { StrokeCanvas } from '../common/StrokeCanvas';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { playJapaneseAudio, playSuccessSound, playWrongSound, playFanfareSound } from '../../utils/speech';

export interface LevelDetailModalProps {
  courseType: KanaType;
  levelNumber: number;
  isOpen: boolean;
  initialStep?: StepType;
  onClose: () => void;
  onNextLevel?: (course: KanaType, nextLevel: number) => void;
  onStartQuiz: (course: KanaType, level: number) => void;
}

type StepType = 1 | 2 | 3 | 4;

interface MiniQuizQuestion {
  id: string;
  character: string;
  romaji: string;
  bangla: string;
  sourceKana?: KanaChar;
  options: {
    label: string;
    isCorrect: boolean;
    bangla: string;
    romaji: string;
  }[];
  correctIndex: number;
}

export const LevelDetailModal: React.FC<LevelDetailModalProps> = ({
  courseType,
  levelNumber,
  isOpen,
  initialStep = 1,
  onClose,
  onNextLevel,
  onStartQuiz
}) => {
  const { userProfile, setUserProfile, recordMistake } = useAuth();
  
  // Step navigation: 1: শেখা, 2: শ্রবণ, 3: অনুশীলন, 4: কুইজ
  const [currentStep, setCurrentStep] = useState<StepType>(initialStep || 1);
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);
  const [showCanvas, setShowCanvas] = useState<boolean>(true);

  // Mini quiz state for Step 4
  const [quizQuestions, setQuizQuestions] = useState<MiniQuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [earnedXP, setEarnedXP] = useState<number>(0);

  // Listening Step state (Step 2)
  const [listeningTestChar, setListeningTestChar] = useState<KanaChar | null>(null);
  const [listeningAnswered, setListeningAnswered] = useState<boolean>(false);
  const [listeningSelectedId, setListeningSelectedId] = useState<string | null>(null);

  const levels = courseType === 'hiragana' ? HIRAGANA_LEVELS : KATAKANA_LEVELS;
  const currentLevel: KanaLevel = levels.find(l => l.level === levelNumber) || levels[0];
  const characters = currentLevel.characters;
  const activeChar: KanaChar = characters[selectedCharIndex] || characters[0];

  const allPool = courseType === 'hiragana' ? HIRAGANA_CHARS : KATAKANA_CHARS;

  // Completed characters tracking
  const completedChars = (courseType === 'hiragana' 
    ? userProfile?.hiraganaProgress?.completedChars 
    : userProfile?.katakanaProgress?.completedChars) || [];

  const isCharCompleted = completedChars.includes(activeChar.id);
  const practicedCount = characters.filter(c => completedChars.includes(c.id)).length;
  const isAllPracticed = practicedCount === characters.length;

  // Practice state
  const [practiceSuccessMsg, setPracticeSuccessMsg] = useState<string | null>(null);
  const [isSubmittingPractice, setIsSubmittingPractice] = useState<boolean>(false);

  // Generate 5 mini-quiz questions for Step 4
  const generateMiniQuiz = () => {
    const questions: MiniQuizQuestion[] = [];
    const pool = characters.length >= 5 ? characters : allPool;

    // Pick 5 targets (starting with level characters, filling from pool)
    const targetChars: KanaChar[] = [...characters];
    while (targetChars.length < 5) {
      const randomChar = allPool[Math.floor(Math.random() * allPool.length)];
      if (!targetChars.some(c => c.id === randomChar.id)) {
        targetChars.push(randomChar);
      }
    }
    // Take first 5 and shuffle
    const chosenTargets = targetChars.slice(0, 5).sort(() => 0.5 - Math.random());

    const isEnglishMode = userProfile?.scriptLanguage === 'english';

    chosenTargets.forEach((target, qIdx) => {
      // Create 3 distractor options
      const distractors = allPool.filter(c => c.id !== target.id);
      const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);

      const allFour = [target, ...shuffledDistractors].sort(() => 0.5 - Math.random());
      const correctIdx = allFour.findIndex(c => c.id === target.id);

      const options = allFour.map(c => ({
        label: isEnglishMode ? c.romaji : c.bangla,
        bangla: c.bangla,
        romaji: c.romaji,
        isCorrect: c.id === target.id
      }));

      questions.push({
        id: `q_${qIdx}_${target.id}`,
        character: target.character,
        romaji: target.romaji,
        bangla: target.bangla,
        sourceKana: target,
        options,
        correctIndex: correctIdx
      });
    });

    setQuizQuestions(questions);
    setCurrentQIndex(0);
    setSelectedOptionIndex(null);
    setQuizScore(0);
    setIsQuizCompleted(false);
  };

  // Reset modal when opened or level changed
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep || 1);
      setSelectedCharIndex(0);
      generateMiniQuiz();
      setListeningTestChar(characters[0] || null);
      setListeningAnswered(false);
      setListeningSelectedId(null);
      setSelectedOptionIndex(null);
      setQuizScore(0);
      setIsQuizCompleted(false);
      setEarnedXP(0);
      setPracticeSuccessMsg(null);
      setIsSubmittingPractice(false);
    }
  }, [isOpen, levelNumber, courseType, initialStep]);

  if (!isOpen) return null;

  const handleMarkLearned = async (targetChar?: KanaChar) => {
    const currentProf = userService.getActiveProfile() || userProfile;
    if (!currentProf) return;
    const target = targetChar || activeChar;
    const updated = await userService.markCharacterLearned(currentProf, courseType, target.id, levelNumber);
    setUserProfile(updated);
    return updated;
  };

  const handlePracticeSubmit = async (targetChar?: KanaChar) => {
    const currentProf = userService.getActiveProfile() || userProfile;
    if (!currentProf || isSubmittingPractice) return;
    const target = targetChar || activeChar;
    setIsSubmittingPractice(true);

    try {
      const updated = await userService.markCharacterLearned(currentProf, courseType, target.id, levelNumber);
      setUserProfile(updated);
      playSuccessSound();

      try {
        confetti({
          particleCount: 55,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setPracticeSuccessMsg(`চমৎকার! ‘${target.character}’ বর্ণটির অনুশীলন সফলভাবে সম্পন্ন হয়েছে! (+15 XP)`);

      setTimeout(() => {
        setPracticeSuccessMsg(null);
      }, 4000);
    } catch (err) {
      console.warn('Practice submission error:', err);
    } finally {
      setIsSubmittingPractice(false);
    }
  };

  // Step 4: Quiz Option Click
  const handleSelectQuizOption = (optIdx: number) => {
    if (selectedOptionIndex !== null) return; // Already answered

    setSelectedOptionIndex(optIdx);
    const currentQ = quizQuestions[currentQIndex];
    const isCorrect = optIdx === currentQ.correctIndex;

    if (isCorrect) {
      playSuccessSound();
      setQuizScore(prev => prev + 1);
    } else {
      playWrongSound();
      if (currentQ?.sourceKana && recordMistake) {
        recordMistake({
          kana: currentQ.sourceKana,
          questionPrompt: `「${currentQ.character}」এর সঠিক উচ্চারণ কোনটি?`,
          userAnswer: currentQ.options[optIdx]?.label,
          correctAnswer: currentQ.options[currentQ.correctIndex]?.label
        });
      }
    }
  };

  // "চালিয়ে যাও" (Continue) Handler for Step 4 Quiz
  const handleContinueQuiz = async () => {
    if (currentQIndex < quizQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      // Quiz Finished
      setIsQuizCompleted(true);
      playFanfareSound();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {
        // ignore
      }

      // Record level completion and XP
      const currentProf = userService.getActiveProfile() || userProfile;
      if (currentProf) {
        const finalScore = quizScore;
        const xpToAdd = finalScore * 10 + 20; // 10 XP per question + 20 XP bonus
        setEarnedXP(xpToAdd);

        const updated = await userService.markLevelCompleted(currentProf, courseType, levelNumber, xpToAdd);
        setUserProfile(updated);
      }
    }
  };

  // Step labels matching the exact design
  const stepConfig = [
    { num: 1 as StepType, label: '১. শেখা' },
    { num: 2 as StepType, label: '২. শ্রবণ' },
    { num: 3 as StepType, label: '৩. অনুশীলন' },
    { num: 4 as StepType, label: '৪. কুইজ' },
  ];

  const currentQ = quizQuestions[currentQIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div 
        id="level-detail-modal"
        className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200/90 dark:border-stone-800 overflow-hidden my-auto max-h-[94vh] flex flex-col transition-all"
      >
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <h2 className="text-sm sm:text-base font-black text-rose-700 dark:text-rose-400 flex items-center gap-1.5 truncate">
            <span>{courseType === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'} • লেভেল {levelNumber}</span>
            <span className="text-stone-500 dark:text-stone-400 font-medium">
              (ধাপ {currentStep}: {stepConfig[currentStep - 1].label.replace(/^[১-৪]\.\s*/, '')})
            </span>
          </h2>

          <button
            type="button"
            id="btn-close-level-modal"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X size={19} />
          </button>
        </div>

        {/* 4-Step Indicator Bar (Exact Style with Top Color Line) */}
        <div className="px-5 sm:px-6 py-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/30">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {stepConfig.map((s) => {
              const isPassed = currentStep > s.num;
              const isActive = currentStep === s.num;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    setCurrentStep(s.num);
                    if (s.num === 4 && quizQuestions.length === 0) {
                      generateMiniQuiz();
                    }
                  }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  {/* Top Bar Indicator */}
                  <div 
                    className={`w-full h-1.5 rounded-full transition-all ${
                      isActive
                        ? 'bg-rose-700 dark:bg-rose-500 shadow-xs'
                        : isPassed
                        ? 'bg-emerald-600 dark:bg-emerald-500'
                        : 'bg-stone-200 dark:bg-stone-700 group-hover:bg-stone-300'
                    }`}
                  />
                  {/* Label Underneath */}
                  <span 
                    className={`text-[11px] sm:text-xs font-bold transition-colors ${
                      isActive
                        ? 'text-rose-700 dark:text-rose-400'
                        : isPassed
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Step Content Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-stone-50/40 dark:bg-stone-950/40 space-y-5">
          
          {/* ==================================================== */}
          {/* STEP 1: শেখা (Learn Characters)                     */}
          {/* ==================================================== */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Kana Quick Tabs */}
              <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1">
                <div className="flex items-center gap-2">
                  {characters.map((c, idx) => {
                    const isSelected = selectedCharIndex === idx;
                    const isLearned = completedChars.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCharIndex(idx)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-serif border transition cursor-pointer ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105'
                            : isLearned
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-stone-900 dark:text-stone-100 border-emerald-300 dark:border-emerald-800'
                            : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        <span className="text-lg sm:text-xl font-bold leading-none">{c.character}</span>
                        <span className={`text-[10px] font-sans font-bold mt-0.5 ${isSelected ? 'text-rose-100' : 'text-rose-600 dark:text-rose-400'}`}>
                          {userProfile?.scriptLanguage === 'english' ? c.romaji : c.bangla}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-bold text-stone-500 shrink-0">
                  {selectedCharIndex + 1} / {characters.length}
                </span>
              </div>

              {/* Main Character Showcase Card */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-200/90 dark:border-stone-800 shadow-xs text-center relative overflow-hidden">
                <div className="text-7xl sm:text-8xl font-black font-serif text-stone-900 dark:text-white leading-none my-3 select-none">
                  {activeChar.character}
                </div>

                {userProfile?.scriptLanguage === 'english' ? (
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      {activeChar.romaji}
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">|</span>
                    <span className="text-lg font-bold text-stone-600 dark:text-stone-300">
                      {activeChar.bangla}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                      {activeChar.bangla}
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">|</span>
                    <span className="text-lg font-mono font-bold text-stone-600 dark:text-stone-300 uppercase tracking-widest">
                      {activeChar.romaji}
                    </span>
                  </div>
                )}

                {/* Audio Button */}
                <div className="flex justify-center mb-5">
                  <button
                    type="button"
                    onClick={() => playJapaneseAudio(activeChar.character)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm border border-stone-200 dark:border-stone-700 transition cursor-pointer shadow-xs active:scale-95"
                  >
                    <Volume2 size={16} className="text-rose-600" />
                    <span>উচ্চারণ শুনুন</span>
                  </button>
                </div>

                {/* Mnemonic description */}
                <div className="text-left bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 border border-stone-200/70 dark:border-stone-700/60 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">
                    <Sparkles size={14} />
                    <span>মনে রাখার কৌশল ও বিবরণ</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                    {activeChar.mnemonicBn}
                  </p>
                </div>

                {/* Stroke steps preview */}
                <div className="text-left mb-4">
                  <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-2 flex items-center gap-1">
                    <ListOrdered size={14} className="text-rose-600" />
                    <span>স্ট্রোক অর্ডার ধাপ ({activeChar.strokeCount}টি ধাপ):</span>
                  </h4>
                  <div className="space-y-1.5">
                    {activeChar.strokeSteps.map(s => (
                      <div key={s.step} className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2 bg-stone-50 dark:bg-stone-800/40 px-3 py-1.5 rounded-lg">
                        <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 font-bold flex items-center justify-center text-[10px]">
                          {s.step}
                        </span>
                        <span>{s.instructionBn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vocabulary Examples */}
                <div className="text-left pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                    উদাহরণ শব্দ:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeChar.examples.slice(0, 2).map((ex, i) => (
                      <div 
                        key={i}
                        onClick={() => playJapaneseAudio(ex.japanese)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-rose-400 transition"
                      >
                        <div>
                          <span className="text-sm font-bold font-serif text-stone-900 dark:text-white block">{ex.japanese} ({ex.romaji})</span>
                          <span className="text-xs text-stone-500 dark:text-stone-400">{ex.bangla}</span>
                        </div>
                        <Volume2 size={15} className="text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: শ্রবণ (Listening Practice)                   */}
          {/* ==================================================== */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-200/90 dark:border-stone-800 shadow-xs text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-3">
                  <Ear size={32} />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  জাপানি উচ্চারণ শুনুন ও কান প্রস্তুত করুন
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1 mb-6">
                  লেভেল {levelNumber}-এর প্রতিটি বর্ণের প্রমিত জাপানি উচ্চারণ শুনে সঠিক ধ্বনি চিনে নিন।
                </p>

                {/* Character Audio Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {characters.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => playJapaneseAudio(c.character)}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-rose-400 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <span className="text-4xl font-black font-serif text-stone-900 dark:text-white">{c.character}</span>
                      <div className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <Volume2 size={13} />
                        <span>
                          {userProfile?.scriptLanguage === 'english'
                            ? `${c.romaji} (${c.bangla})`
                            : `${c.bangla} (${c.romaji})`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: অনুশীলন (Writing & Stroke Canvas)             */}
          {/* ==================================================== */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header with Title & Character Progress Tracker */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/80 dark:bg-stone-950/40 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                      অনুশীলন বর্ণ:
                    </span>
                    <span className="text-xl font-serif font-black text-rose-600 dark:text-rose-400">
                      {activeChar.character}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100/80 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                      {userProfile?.scriptLanguage === 'english' ? activeChar.romaji : activeChar.bangla}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    জাপানি ক্যালিগ্রাফি বোর্ডে বর্ণটি দেখে আঙুল বা মাউস দিয়ে এঁকে জমা দিন।
                  </p>
                </div>

                {/* Character selection buttons with completion checkmarks */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 mr-1 hidden sm:inline">
                    বর্ণ নির্বাচন:
                  </span>
                  <div className="flex gap-1.5">
                    {characters.map((c, i) => {
                      const isDone = completedChars.includes(c.id);
                      const isSelected = selectedCharIndex === i;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedCharIndex(i);
                            setPracticeSuccessMsg(null);
                          }}
                          className={`relative w-9 h-9 rounded-xl font-serif text-sm font-black border transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-400/30 scale-105'
                              : isDone
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-rose-300'
                          }`}
                        >
                          <span>{c.character}</span>
                          {isDone && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[8px] font-bold shadow-xs">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Success Notification Banner */}
              {practiceSuccessMsg && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{practiceSuccessMsg}</span>
                  </div>
                  {selectedCharIndex < characters.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCharIndex(prev => prev + 1);
                        setPracticeSuccessMsg(null);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition ml-2 shrink-0 cursor-pointer shadow-2xs"
                    >
                      পরবর্তী বর্ণ আঁকুন →
                    </button>
                  )}
                </div>
              )}

              {/* Shodo / Genkouyoushi Practice Studio Canvas Card */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col items-center">
                <StrokeCanvas
                  guideChar={activeChar.character}
                  romaji={activeChar.romaji}
                  bangla={activeChar.bangla}
                  isCompleted={isCharCompleted}
                  onPracticeComplete={() => {
                    handlePracticeSubmit(activeChar);
                  }}
                  onNextChar={() => {
                    if (selectedCharIndex < characters.length - 1) {
                      setSelectedCharIndex(prev => prev + 1);
                      setPracticeSuccessMsg(null);
                    }
                  }}
                  hasNextChar={selectedCharIndex < characters.length - 1}
                />
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: কুইজ (Mini Quiz Matching Exact Screenshot)   */}
          {/* ==================================================== */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {!isQuizCompleted && currentQ ? (
                <>
                  {/* Sub-header: Question Count & Score */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-black text-rose-700 dark:text-rose-400">
                      প্রশ্ন {currentQIndex + 1} / {quizQuestions.length}
                    </span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      স্কোর: {quizScore}
                    </span>
                  </div>

                  {/* Question Box Card (Matches Screenshot) */}
                  <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/90 dark:border-stone-800 shadow-xs text-center">
                    {/* Big Japanese Kana Character */}
                    <div className="text-7xl sm:text-8xl font-black font-serif text-stone-900 dark:text-white leading-none my-2 select-none">
                      {currentQ.character}
                    </div>

                    {/* Question Subtitle */}
                    <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white mt-4 mb-4">
                      এই {courseType === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'} বর্ণটির সঠিক উচ্চারণ কোনটি?
                    </h3>

                    {/* Audio Pill Button */}
                    <div className="flex justify-center">
                      <button
                        type="button"
                        id="btn-quiz-play-sound"
                        onClick={() => playJapaneseAudio(currentQ.character)}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm border border-stone-200 dark:border-stone-700 transition cursor-pointer shadow-xs active:scale-95"
                      >
                        <Volume2 size={16} className="text-rose-600" />
                        <span>উচ্চারণ শুনুন</span>
                      </button>
                    </div>
                  </div>

                  {/* 2x2 Options Grid (Matches Screenshot) */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = selectedOptionIndex === optIdx;
                      const isCorrect = option.isCorrect;
                      const hasAnswered = selectedOptionIndex !== null;

                      let btnStyle = 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-300 dark:hover:border-stone-700';

                      if (hasAnswered) {
                        if (isSelected && isCorrect) {
                          btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs font-black';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500 text-rose-800 dark:text-rose-200 shadow-xs font-black';
                        } else if (!isSelected && isCorrect) {
                          btnStyle = 'bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-500/80 text-emerald-700 dark:text-emerald-300';
                        } else {
                          btnStyle = 'opacity-40 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          id={`btn-quiz-option-${optIdx}`}
                          disabled={hasAnswered}
                          onClick={() => handleSelectQuizOption(optIdx)}
                          className={`min-h-[64px] sm:min-h-[72px] px-4 py-3 rounded-2xl border text-sm sm:text-base font-bold transition-all flex items-center justify-center text-center cursor-pointer active:scale-98 ${btnStyle}`}
                        >
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Quiz Complete Celebration Screen */
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 text-center space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-rose-600 text-white font-black text-3xl mx-auto flex items-center justify-center shadow-lg">
                    🏆
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                    লেভেল {levelNumber} কুইজ সমাপ্ত!
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    আপনি {quizQuestions.length}টির মধ্যে <strong>{quizScore}টি</strong> প্রশ্নের সঠিক উত্তর দিয়েছেন।
                  </p>

                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-extrabold text-base">
                    <Zap size={18} className="fill-amber-500 text-amber-500" />
                    <span>+{earnedXP || (quizScore * 10 + 20)} XP অর্জিত হয়েছে!</span>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Bottom Footer / "চালিয়ে যাও" (Continue) Bar */}
        <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between gap-3">
          
          {/* Back/Previous Button */}
          {currentStep > 1 && !isQuizCompleted ? (
            <button
              type="button"
              id="btn-modal-prev-step"
              onClick={() => setCurrentStep((currentStep - 1) as StepType)}
              className="px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-stone-700 dark:text-stone-300 text-xs font-bold transition cursor-pointer"
            >
              পূর্ববর্তী
            </button>
          ) : (
            <div className="text-xs font-medium text-stone-400">
              {currentStep === 1 && `লেভেল ${levelNumber} • ধাপ ১/৪`}
            </div>
          )}

          {/* Primary "চালিয়ে যাও" (Continue) Action Button */}
          {currentStep === 1 && (
            <button
              type="button"
              id="btn-continue-step-1"
              onClick={() => {
                handleMarkLearned();
                if (selectedCharIndex < characters.length - 1) {
                  setSelectedCharIndex(prev => prev + 1);
                } else {
                  setCurrentStep(2);
                }
              }}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer ml-auto"
            >
              <span>{selectedCharIndex < characters.length - 1 ? 'পরবর্তী বর্ণ →' : 'চালিয়ে যাও (ধাপ ২) →'}</span>
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              id="btn-continue-step-2"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer ml-auto"
            >
              <span>চালিয়ে যাও (ধাপ ৩: অনুশীলন) →</span>
            </button>
          )}

          {currentStep === 3 && (
            <div className="flex items-center gap-2 ml-auto">
              {selectedCharIndex < characters.length - 1 ? (
                <button
                  type="button"
                  id="btn-next-char-step-3"
                  onClick={() => {
                    setSelectedCharIndex(prev => prev + 1);
                    setPracticeSuccessMsg(null);
                  }}
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>পরবর্তী বর্ণ ({characters[selectedCharIndex + 1]?.character})</span>
                  <ArrowRight size={14} />
                </button>
              ) : null}

              <button
                type="button"
                id="btn-continue-step-3"
                onClick={() => {
                  setCurrentStep(4);
                  generateMiniQuiz();
                }}
                className={`px-5 sm:px-6 py-2 sm:py-2.5 rounded-2xl text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer ${
                  isAllPracticed
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 ring-2 ring-emerald-400/30'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <span>{isAllPracticed ? 'সব বর্ণ সম্পন্ন! ধাপ ৪: কুইজ →' : 'চালিয়ে যাও (ধাপ ৪: কুইজ) →'}</span>
              </button>
            </div>
          )}

          {currentStep === 4 && (
            !isQuizCompleted ? (
              selectedOptionIndex !== null ? (
                <div className="w-full flex items-center justify-between gap-3">
                  {/* Answer Feedback Text */}
                  <div className="flex items-center gap-2">
                    {currentQ.options[selectedOptionIndex].isCorrect ? (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={18} />
                        <span>চমৎকার! সঠিক উত্তর (+10 XP)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400">
                        <XCircle size={18} />
                        <span>ভুল উত্তর! সঠিক: {currentQ.options[currentQ.correctIndex].label}</span>
                      </div>
                    )}
                  </div>

                  {/* Prominent "চালিয়ে যাও" (Continue) Button */}
                  <button
                    type="button"
                    id="btn-continue-quiz"
                    onClick={handleContinueQuiz}
                    className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>চালিয়ে যাও</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-xs font-bold text-stone-400 ml-auto">
                  সঠিক উত্তরটি নির্বাচন করুন...
                </div>
              )
            ) : (
              /* When Quiz is Complete */
              <div className="w-full flex flex-col sm:flex-row items-center gap-2.5">
                {levelNumber < 10 ? (
                  <button
                    type="button"
                    id="btn-next-level"
                    onClick={() => {
                      if (onNextLevel) {
                        onNextLevel(courseType, levelNumber + 1);
                      } else {
                        onClose();
                      }
                    }}
                    className="flex-1 w-full py-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>পরবর্তী লেভেল (লেভেল {levelNumber + 1}) শুরু করুন</span>
                    <ArrowRight size={18} />
                  </button>
                ) : courseType === 'hiragana' ? (
                  <button
                    type="button"
                    id="btn-next-course"
                    onClick={() => {
                      if (onNextLevel) {
                        onNextLevel('katakana', 1);
                      } else {
                        onClose();
                      }
                    }}
                    className="flex-1 w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>হিরাগানা সমাপ্ত! কাতাকানা শুরু করুন</span>
                    <ArrowRight size={18} />
                  </button>
                ) : null}

                <button
                  type="button"
                  id="btn-finish-level"
                  onClick={onClose}
                  className={`${levelNumber < 10 || courseType === 'hiragana' ? 'w-full sm:w-auto px-5' : 'w-full'} py-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-sm transition flex items-center justify-center gap-1.5 cursor-pointer`}
                >
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>সম্পন্ন (বন্ধ করুন)</span>
                </button>
              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
};
