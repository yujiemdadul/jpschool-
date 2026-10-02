import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  CheckCircle, 
  RotateCcw, 
  PenTool, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Eye,
  Layers,
  Lightbulb
} from 'lucide-react';
import { KanjiChar } from '../../types';
import { KanjiPictogramVisual } from './KanjiPictogramVisual';
import { playJapaneseAudio, playSuccessSound } from '../../utils/speech';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import confetti from 'canvas-confetti';

interface KanjiDetailModalProps {
  kanji: KanjiChar;
  kanjiList: KanjiChar[];
  onClose: () => void;
  onSelectKanji: (kanji: KanjiChar) => void;
}

export const KanjiDetailModal: React.FC<KanjiDetailModalProps> = ({
  kanji,
  kanjiList,
  onClose,
  onSelectKanji
}) => {
  const { userProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'visual' | 'drawing' | 'vocab'>('visual');
  const [showStrokeGuide, setShowStrokeGuide] = useState<boolean>(true);
  const [isMarking, setIsMarking] = useState<boolean>(false);
  const [justLearnedMessage, setJustLearnedMessage] = useState<string | null>(null);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  const learnedIds = userProfile?.kanjiProgress?.learnedKanjiIds || [];
  const isLearned = learnedIds.includes(kanji.id);

  // Find index in kanji list for Next / Prev navigation
  const currentIndex = kanjiList.findIndex(k => k.id === kanji.id);
  const prevKanji = currentIndex > 0 ? kanjiList[currentIndex - 1] : null;
  const nextKanji = currentIndex < kanjiList.length - 1 ? kanjiList[currentIndex + 1] : null;

  // Clear canvas when kanji changes or tab changes
  useEffect(() => {
    clearCanvas();
  }, [kanji.id, activeTab]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#E11D48'; // Rose-600 color for ink
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Toggle Learned status
  const handleToggleLearned = async () => {
    if (!userProfile) return;
    setIsMarking(true);
    try {
      if (isLearned) {
        await userService.unmarkKanjiLearned(userProfile, kanji.id);
        await refreshProfile();
      } else {
        await userService.markKanjiLearned(userProfile, kanji.id);
        playSuccessSound();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
        setJustLearnedMessage(`অভিনন্দন! 「${kanji.character}」কাঞ্জিটি আপনার শেখা তালিকায় যুক্ত হয়েছে! (+20 XP)`);
        await refreshProfile();
        setTimeout(() => setJustLearnedMessage(null), 4000);
      }
    } catch (err) {
      console.warn('Error updating kanji status:', err);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/50">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              JLPT {kanji.level}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-200/70 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
              {kanji.categoryBn}
            </span>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 hidden sm:inline">
              স্ট্রোক: {kanji.strokeCount}টি
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {justLearnedMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
              <Sparkles size={18} className="text-emerald-600 shrink-0" />
              <span>{justLearnedMessage}</span>
            </div>
          )}

          {/* Hero Kanji Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-linear-to-br from-rose-50/80 via-white to-amber-50/50 dark:from-stone-800 dark:via-stone-900 dark:to-stone-800 border border-rose-100 dark:border-stone-700/80 shadow-xs">
            {/* Big Character Frame with Audio */}
            <div className="relative flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white dark:bg-stone-800 border-2 border-rose-200 dark:border-rose-900/60 shadow-md shrink-0">
              <span className="text-6xl sm:text-7xl font-black text-rose-600 dark:text-rose-400 font-serif select-none">
                {kanji.character}
              </span>
              <button
                type="button"
                onClick={() => playJapaneseAudio(kanji.character)}
                title="উচ্চারণ শুনুন"
                className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-rose-50 dark:bg-stone-700 hover:bg-rose-100 dark:hover:bg-stone-600 text-rose-600 dark:text-rose-300 transition-colors cursor-pointer"
              >
                <Volume2 size={16} />
              </button>
            </div>

            {/* Kanji Meaning & Readings Summary */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  {kanji.meaningBn}
                </h2>
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-md">
                  {kanji.meaningEn}
                </span>
              </div>

              {/* Kunyomi & Onyomi row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-xl bg-white/90 dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80">
                  <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 font-semibold mb-1">
                    <span>কুন-ইয়োমি (জাপানি):</span>
                    <button
                      type="button"
                      onClick={() => kanji.kunyomi[0] && playJapaneseAudio(kanji.kunyomi[0])}
                      className="hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>
                  <div className="font-bold text-stone-800 dark:text-stone-100 flex flex-wrap gap-1.5 items-center">
                    <span>{kanji.kunyomi.join(', ') || 'নেই'}</span>
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 font-normal">
                      ({kanji.kunyomiBn.join(', ')})
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/90 dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80">
                  <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 font-semibold mb-1">
                    <span>অন-ইয়োমি (চীনা):</span>
                    <button
                      type="button"
                      onClick={() => kanji.onyomi[0] && playJapaneseAudio(kanji.onyomi[0])}
                      className="hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>
                  <div className="font-bold text-stone-800 dark:text-stone-100 flex flex-wrap gap-1.5 items-center">
                    <span>{kanji.onyomi.join(', ') || 'নেই'}</span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-normal">
                      ({kanji.onyomiBn.join(', ')})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Selection Navigation */}
          <div className="flex border-b border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'visual'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/20'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Lightbulb size={16} />
              <span>চিত্র ও স্মৃতির কৌশল</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('drawing')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'drawing'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/20'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <PenTool size={16} />
              <span>হাতে আঁকার প্র্যাকটিস</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vocab')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'vocab'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/20'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <BookOpen size={16} />
              <span>বাস্তব শব্দভাণ্ডার ({kanji.examples.length})</span>
            </button>
          </div>

          {/* TAB 1: VISUAL & MNEMONIC */}
          {activeTab === 'visual' && (
            <div className="space-y-4">
              {/* Visual Pictogram Diagram Component */}
              <div>
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Eye size={14} className="text-rose-600" />
                  চিত্রভিত্তিক উৎপত্তি ও রূপান্তর (Pictorial Evolution):
                </h4>
                <KanjiPictogramVisual kanji={kanji} size="lg" showEvolution={true} />
              </div>

              {/* Bengali Mnemonic Trick Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                  <span className="p-1 rounded-lg bg-amber-200/70 dark:bg-amber-900/60">🧠</span>
                  <span>সহজে মনে রাখার সহজ কৌশল:</span>
                </div>
                <p className="text-sm leading-relaxed text-stone-800 dark:text-stone-200 font-medium">
                  {kanji.mnemonicStoryBn}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DRAWING PRACTICE CANVAS */}
          {activeTab === 'drawing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-stone-600 dark:text-stone-400">
                  মাউস বা আঙুল দিয়ে স্ক্রিনে কাঞ্জিটি লিখে অনুশীলন করুন:
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStrokeGuide(!showStrokeGuide)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    {showStrokeGuide ? 'হালকা গাইড লুকান' : 'হালকা গাইড দেখান'}
                  </button>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>মুছুন</span>
                  </button>
                </div>
              </div>

              {/* Canvas Area with Watermark */}
              <div className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl bg-stone-50 dark:bg-stone-800/90 border-2 border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center overflow-hidden touch-none shadow-inner">
                {/* Background Watermark Character */}
                {showStrokeGuide && (
                  <span className="absolute inset-0 flex items-center justify-center text-8xl sm:text-9xl font-black text-stone-300/60 dark:text-stone-600/40 select-none pointer-events-none font-serif">
                    {kanji.character}
                  </span>
                )}

                {/* Guidelines grid */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2">
                  <div className="border-r border-b border-stone-200/50 dark:border-stone-700/50" />
                  <div className="border-b border-stone-200/50 dark:border-stone-700/50" />
                  <div className="border-r border-stone-200/50 dark:border-stone-700/50" />
                  <div />
                </div>

                <canvas
                  ref={canvasRef}
                  width={360}
                  height={360}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="relative z-10 w-full h-full cursor-crosshair"
                />
              </div>

              <p className="text-center text-xs text-stone-500 dark:text-stone-400">
                {hasDrawn ? 'দারুণ! লেখার অভ্যাস স্মৃতিশক্তিকে অনেক বেশি স্থায়ী করে।' : 'ক্যানভাসে আঙুল বা মাউস টেনে লিখুন।'}
              </p>
            </div>
          )}

          {/* TAB 3: REAL VOCABULARY EXAMPLES */}
          {activeTab === 'vocab' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BookOpen size={14} className="text-rose-600" />
                বাস্তব N5 শব্দ উদাহরণ ও বাক্য প্রয়োগ:
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {kanji.examples.map((ex, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700/80 flex items-center justify-between gap-3 shadow-xs hover:border-rose-300 dark:hover:border-rose-800 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 font-serif">
                          {ex.word}
                        </span>
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                          {ex.reading}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                        <span className="text-stone-500 dark:text-stone-400">উচ্চারণ: {ex.readingBn}</span>
                        <span>•</span>
                        <span className="font-bold text-stone-900 dark:text-white">অর্থ: {ex.meaningBn}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => playJapaneseAudio(ex.word)}
                      title="শব্দটি শুনুন"
                      className="p-2.5 rounded-xl bg-white dark:bg-stone-700 hover:bg-rose-50 dark:hover:bg-stone-600 text-rose-600 dark:text-rose-300 border border-stone-200 dark:border-stone-600 transition-colors cursor-pointer shrink-0"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Action Bar */}
        <div className="px-5 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Previous & Next Kanji buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              disabled={!prevKanji}
              onClick={() => prevKanji && onSelectKanji(prevKanji)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>আগেরটি</span>
            </button>

            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {currentIndex + 1} / {kanjiList.length}
            </span>

            <button
              type="button"
              disabled={!nextKanji}
              onClick={() => nextKanji && onSelectKanji(nextKanji)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>পরেরটি</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Mark as Learned Button */}
          <button
            type="button"
            disabled={isMarking}
            onClick={handleToggleLearned}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer ${
              isLearned
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow-rose-600/20'
            }`}
          >
            <CheckCircle size={17} />
            <span>{isLearned ? 'শেখা হয়েছে (সম্পন্ন ✓)' : 'শেখা শেষ? চিহ্নিত করুন (+20 XP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
