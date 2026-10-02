import React, { useState, useEffect } from 'react';
import { X, Trophy, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { KanjiChar } from '../../types';
import { KanjiPictogramVisual } from './KanjiPictogramVisual';
import { playJapaneseAudio, playSuccessSound, playWrongSound, playFanfareSound } from '../../utils/speech';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import confetti from 'canvas-confetti';

interface KanjiQuizModalProps {
  kanjiList: KanjiChar[];
  onClose: () => void;
}

interface QuizQ {
  type: 'meaning' | 'character' | 'pictogram' | 'reading';
  prompt: string;
  kanji: KanjiChar;
  options: { label: string; isCorrect: boolean }[];
}

export const KanjiQuizModal: React.FC<KanjiQuizModalProps> = ({
  kanjiList,
  onClose
}) => {
  const { userProfile, refreshProfile } = useAuth();
  const [questions, setQuestions] = useState<QuizQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptIndex, setSelectedOptIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Generate 5 random diverse questions
  useEffect(() => {
    if (!kanjiList.length) return;
    const shuffledPool = [...kanjiList].sort(() => Math.random() - 0.5);
    const selectedKanji = shuffledPool.slice(0, 5);

    const generated: QuizQ[] = selectedKanji.map((target, idx) => {
      // Pick question mode
      const modes: ('meaning' | 'character' | 'pictogram' | 'reading')[] = ['meaning', 'pictogram', 'character', 'reading', 'meaning'];
      const mode = modes[idx % modes.length];

      // Get 3 random distractors
      const distractors = kanjiList
        .filter(k => k.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      let prompt = '';
      let correctLabel = '';
      let wrongLabels: string[] = [];

      if (mode === 'meaning') {
        prompt = `「${target.character}」কাঞ্জিটির সঠিক অর্থ কী?`;
        correctLabel = target.meaningBn;
        wrongLabels = distractors.map(d => d.meaningBn);
      } else if (mode === 'character') {
        prompt = `‘${target.meaningBn}’ (Meaning) এর সঠিক কাঞ্জি বর্ণ কোনটি?`;
        correctLabel = target.character;
        wrongLabels = distractors.map(d => d.character);
      } else if (mode === 'reading') {
        prompt = `「${target.character}」এর কুন-ইয়োমি (জাপানি উচ্চারণ) কোনটি?`;
        correctLabel = `${target.kunyomi[0] || target.onyomi[0]} (${target.kunyomiBn[0] || target.onyomiBn[0]})`;
        wrongLabels = distractors.map(d => `${d.kunyomi[0] || d.onyomi[0]} (${d.kunyomiBn[0] || d.onyomiBn[0]})`);
      } else {
        // pictogram
        prompt = `চিত্রের রূপান্তর দেখে বলুন, এটি কোন কাঞ্জি নির্দেশ করে?`;
        correctLabel = `${target.character} (${target.meaningBn})`;
        wrongLabels = distractors.map(d => `${d.character} (${d.meaningBn})`);
      }

      const allOpts = [
        { label: correctLabel, isCorrect: true },
        ...wrongLabels.map(l => ({ label: l, isCorrect: false }))
      ].sort(() => Math.random() - 0.5);

      return {
        type: mode,
        prompt,
        kanji: target,
        options: allOpts
      };
    });

    setQuestions(generated);
  }, [kanjiList]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOptIndex !== null) return;
    setSelectedOptIndex(index);

    const isCorrect = currentQ.options[index]?.isCorrect;
    if (isCorrect) {
      playSuccessSound();
      setScore(prev => prev + 1);
    } else {
      playWrongSound();
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptIndex(null);
    } else {
      setIsFinished(true);
      playFanfareSound();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }

      // Award XP
      if (userProfile) {
        try {
          await userService.recordKanjiQuizResult(userProfile, score, questions.length);
          await refreshProfile();
        } catch (e) {
          console.warn('Error awarding quiz XP:', e);
        }
      }
    }
  };

  if (!currentQ) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold text-sm text-stone-800 dark:text-stone-200">
              N5 কাঞ্জি কুইজ
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isFinished && (
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                প্রশ্ন {currentIndex + 1} / {questions.length}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* QUIZ CONTENT */}
        {!isFinished ? (
          <div className="py-4 space-y-5">
            {/* Progress bar */}
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Visual preview if pictogram question */}
            {currentQ.type === 'pictogram' ? (
              <div className="flex justify-center my-2">
                <KanjiPictogramVisual kanji={currentQ.kanji} size="md" showEvolution={false} />
              </div>
            ) : currentQ.type !== 'character' ? (
              <div className="flex flex-col items-center justify-center my-2">
                <div className="w-20 h-20 rounded-2xl bg-rose-50 dark:bg-stone-800 border-2 border-rose-200 dark:border-rose-900/60 flex items-center justify-center shadow-xs">
                  <span className="text-5xl font-black text-rose-600 dark:text-rose-400 font-serif">
                    {currentQ.kanji.character}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => playJapaneseAudio(currentQ.kanji.character)}
                  className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Volume2 size={13} />
                  <span>উচ্চারণ শুনুন</span>
                </button>
              </div>
            ) : null}

            {/* Question prompt */}
            <h3 className="text-center text-base sm:text-lg font-bold text-stone-900 dark:text-white px-2">
              {currentQ.prompt}
            </h3>

            {/* Options grid */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOptIndex === idx;
                const isCorrect = opt.isCorrect;
                const showResult = selectedOptIndex !== null;

                let btnStyle = 'border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700/80 text-stone-800 dark:text-stone-200';
                if (showResult) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 font-bold';
                  } else {
                    btnStyle = 'opacity-40 border-stone-200 dark:border-stone-800 text-stone-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={showResult}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left font-semibold text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt.label}</span>
                    {showResult && isCorrect && <span className="text-emerald-600 font-black">✓</span>}
                    {showResult && isSelected && !isCorrect && <span className="text-rose-600 font-black">✕</span>}
                  </button>
                );
              })}
            </div>

            {/* Continue Button */}
            {selectedOptIndex !== null && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  <span>চালিয়ে যান</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* RESULT SCREEN */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Trophy size={32} />
            </div>

            <h3 className="text-xl font-black text-stone-900 dark:text-white">
              কুইজ সম্পন্ন হয়েছে!
            </h3>

            <p className="text-sm text-stone-600 dark:text-stone-300">
              আপনি {questions.length}টির মধ্যে <strong className="text-rose-600 dark:text-rose-400 text-lg">{score}</strong>টি প্রশ্নের সঠিক উত্তর দিয়েছেন।
            </p>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-bold inline-flex items-center gap-1.5">
              <Sparkles size={15} />
              <span>+{score * 5 + 10} XP পয়েন্ট অর্জিত হয়েছে!</span>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-stone-900 hover:bg-black dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-bold text-sm shadow-md cursor-pointer"
              >
                শেষ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
