import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Volume2, 
  Sparkles,
  ChevronRight,
  Brush
} from 'lucide-react';
import { playJapaneseAudio } from '../../utils/speech';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

interface StrokeCanvasProps {
  guideChar: string;
  romaji?: string;
  bangla?: string;
  className?: string;
  isCompleted?: boolean;
  onPracticeComplete?: () => void;
  onNextChar?: () => void;
  hasNextChar?: boolean;
}

const INK_COLORS = [
  { id: 'vermilion', name: '朱色 (লাল কালি)', hex: '#DC2626', label: 'লাল' },
  { id: 'sumi', name: '墨 (কালো কালি)', hex: '#1C1917', label: 'কালো' },
  { id: 'indigo', name: '藍 (নীল কালি)', hex: '#2563EB', label: 'নীল' },
  { id: 'matcha', name: '萌黄 (সবুজ কালি)', hex: '#059669', label: 'সবুজ' },
];

const BRUSH_SIZES = [
  { id: 'fine', label: 'চিকন', width: 8 },
  { id: 'medium', label: 'মাঝারি', width: 14 },
  { id: 'bold', label: 'পুরু', width: 22 },
];

type GuideOpacity = 'clear' | 'faint' | 'none';

export const StrokeCanvas: React.FC<StrokeCanvasProps> = ({
  guideChar,
  romaji,
  bangla,
  className = '',
  isCompleted = false,
  onPracticeComplete,
  onNextChar,
  hasNextChar = false
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [canvasSize, setCanvasSize] = useState<number>(290);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [strokeColor, setStrokeColor] = useState<string>('#DC2626'); // Traditional Japanese vermilion (Shu-iro)
  const [brushWidth, setBrushWidth] = useState<number>(14); // Medium calligraphy width
  const [guideMode, setGuideMode] = useState<GuideOpacity>('clear');
  const [validationAlert, setValidationAlert] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);

  // Resize canvas responsively to fit mobile and desktop
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        // Keep a balanced square between 250px and 330px
        const newSize = Math.max(240, Math.min(320, parentWidth - 24));
        setCanvasSize(newSize);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Clear canvas whenever character changes
  useEffect(() => {
    setStrokes([]);
    currentStrokeRef.current = null;
    setValidationAlert(null);
    setJustSubmitted(false);
  }, [guideChar]);

  // Redraw canvas whenever strokes or canvasSize change
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context and scale from normalized 300x300 space
    ctx.save();
    const scale = (canvasSize / 300) * dpr;
    ctx.scale(scale, scale);

    // Render all completed strokes
    const allStrokes: Stroke[] = [];
    if (Array.isArray(strokes)) {
      for (const s of strokes) {
        if (s && Array.isArray(s.points) && s.points.length > 0) {
          allStrokes.push(s);
        }
      }
    }
    if (currentStrokeRef.current && Array.isArray(currentStrokeRef.current.points) && currentStrokeRef.current.points.length > 0) {
      allStrokes.push(currentStrokeRef.current);
    }

    for (const stroke of allStrokes) {
      if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) continue;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.points.length === 1) {
        // Single dot
        const p = stroke.points[0];
        if (p) {
          ctx.arc(p.x, p.y, stroke.width / 2, 0, Math.PI * 2);
          ctx.fillStyle = stroke.color;
          ctx.fill();
        }
        continue;
      }

      // Smooth calligraphy curve using midpoint quadratic interpolation
      const first = stroke.points[0];
      if (!first) continue;
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < stroke.points.length - 1; i++) {
        const ptA = stroke.points[i];
        const ptB = stroke.points[i + 1];
        if (ptA && ptB) {
          const xc = (ptA.x + ptB.x) / 2;
          const yc = (ptA.y + ptB.y) / 2;
          ctx.quadraticCurveTo(ptA.x, ptA.y, xc, yc);
        }
      }

      // Final segment
      const last = stroke.points[stroke.points.length - 1];
      if (last) {
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }, [strokes, canvasSize]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Convert pointer event to normalized 300x300 coordinates
  const getNormalizedPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleFactor = 300 / (rect.width || 300);
    const x = Math.max(0, Math.min(300, (e.clientX - rect.left) * scaleFactor));
    const y = Math.max(0, Math.min(300, (e.clientY - rect.top) * scaleFactor));
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
    setIsDrawing(true);
    setValidationAlert(null);

    const pt = getNormalizedPoint(e);
    const newStroke: Stroke = {
      points: [pt],
      color: strokeColor,
      width: brushWidth,
    };
    currentStrokeRef.current = newStroke;
    redrawCanvas();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current || !Array.isArray(currentStrokeRef.current.points)) return;
    const pt = getNormalizedPoint(e);
    currentStrokeRef.current.points.push(pt);
    redrawCanvas();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }

    const stroke = currentStrokeRef.current;
    if (stroke && Array.isArray(stroke.points) && stroke.points.length > 0) {
      setStrokes((prev) => [...(Array.isArray(prev) ? prev.filter(Boolean) : []), stroke]);
    }
    currentStrokeRef.current = null;
    redrawCanvas();
  };

  const handleUndo = () => {
    setStrokes((prev) => (Array.isArray(prev) ? prev.filter(Boolean).slice(0, -1) : []));
    setValidationAlert(null);
  };

  const handleClear = () => {
    setStrokes([]);
    currentStrokeRef.current = null;
    setValidationAlert(null);
  };

  const toggleGuide = () => {
    setGuideMode((prev) => {
      if (prev === 'clear') return 'faint';
      if (prev === 'faint') return 'none';
      return 'clear';
    });
  };

  const validStrokes = Array.isArray(strokes)
    ? strokes.filter((s): s is Stroke => Boolean(s && Array.isArray(s.points)))
    : [];
  const totalPoints = validStrokes.reduce((acc, s) => acc + (s.points?.length || 0), 0);
  const hasSubstantialDrawing = validStrokes.length > 0 && totalPoints >= 4;

  const handleSubmit = () => {
    if (!hasSubstantialDrawing && !isCompleted) {
      setValidationAlert('অনুগ্রহ করে ক্যানভাসে দাগ টেনে বর্ণটি আঁকুন!');
      return;
    }

    setJustSubmitted(true);
    setValidationAlert(null);

    if (onPracticeComplete) {
      onPracticeComplete();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full flex flex-col items-center select-none ${className}`}
    >
      {/* Top Bar: Character Label & Audio + Guide Opacity Switcher */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-play-practice-audio"
            onClick={() => playJapaneseAudio(guideChar)}
            aria-label={`${guideChar} উচ্চারণ শুনুন`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-800 transition active:scale-95 cursor-pointer shadow-2xs"
          >
            <Volume2 size={14} className="text-rose-600" />
            <span className="font-serif text-sm font-black">{guideChar}</span>
            {(romaji || bangla) && (
              <span className="text-[11px] text-stone-600 dark:text-stone-400 font-normal">
                ({bangla || romaji})
              </span>
            )}
          </button>
        </div>

        {/* Guide Opacity Toggle */}
        <button
          type="button"
          id="btn-toggle-practice-guide"
          onClick={toggleGuide}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer border border-stone-200 dark:border-stone-700"
          title="গাইড মোড পরিবর্তন করুন"
        >
          {guideMode === 'clear' ? (
            <>
              <Eye size={13} className="text-rose-600" />
              <span>গাইড: স্পষ্ট</span>
            </>
          ) : guideMode === 'faint' ? (
            <>
              <Eye size={13} className="text-amber-600" />
              <span>গাইড: হালকা</span>
            </>
          ) : (
            <>
              <EyeOff size={13} className="text-stone-400" />
              <span>গাইড: বন্ধ</span>
            </>
          )}
        </button>
      </div>

      {/* ==================================================== */}
      {/* Genkouyoushi (原稿用紙) Traditional Calligraphy Board */}
      {/* ==================================================== */}
      <div 
        className="relative rounded-3xl bg-[#FAF8F5] dark:bg-[#161514] border-2 border-stone-300 dark:border-stone-700 shadow-inner overflow-hidden flex items-center justify-center touch-none transition-all"
        style={{ width: canvasSize, height: canvasSize }}
      >
        {/* Authentic Japanese Calligraphy Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle Outer Quadrant Boundary */}
          <div className="absolute inset-3 border border-dashed border-rose-200/50 dark:border-rose-950/40 rounded-2xl" />

          {/* Center Horizontal Dashed Red Line */}
          <div className="absolute top-1/2 left-3 right-3 h-px -translate-y-1/2 border-t border-dashed border-rose-300/60 dark:border-rose-900/60" />

          {/* Center Vertical Dashed Red Line */}
          <div className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 border-l border-dashed border-rose-300/60 dark:border-rose-900/60" />

          {/* Diagonal Guides (Diagonal Crosshairs) */}
          <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#DC2626" strokeDasharray="4,4" strokeWidth="0.8" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="#DC2626" strokeDasharray="4,4" strokeWidth="0.8" />
          </svg>

          {/* Center Optical Circle Guide */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-dashed border-rose-200/60 dark:border-rose-950/40" />

          {/* 4 Corner Traditional Alignment Marks (L-Tonbo) */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-stone-300 dark:border-stone-700 rounded-tl-sm" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-stone-300 dark:border-stone-700 rounded-tr-sm" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-stone-300 dark:border-stone-700 rounded-bl-sm" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-stone-300 dark:border-stone-700 rounded-br-sm" />
        </div>

        {/* Large Centered Watermark Character for Tracing */}
        {guideMode !== 'none' && (
          <div 
            className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-200 ${
              guideMode === 'clear' 
                ? 'opacity-35 dark:opacity-40 text-stone-900 dark:text-stone-100' 
                : 'opacity-15 dark:opacity-20 text-stone-700 dark:text-stone-300'
            }`}
          >
            <span 
              className="font-serif font-black tracking-tight"
              style={{ fontSize: `${canvasSize * 0.58}px`, lineHeight: 1 }}
            >
              {guideChar}
            </span>
          </div>
        )}

        {/* High-definition, Interactive Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative z-10 touch-none cursor-crosshair"
          style={{ width: canvasSize, height: canvasSize }}
        />

        {/* Floating Stroke Count Indicator */}
        <div className="absolute bottom-2 left-3 z-20 pointer-events-none text-[10px] font-bold text-stone-400 dark:text-stone-500 bg-white/70 dark:bg-stone-900/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
          স্ট্রোক: {strokes.length}
        </div>
      </div>

      {/* Validation / Helper Notice */}
      {validationAlert && (
        <div className="w-full mt-2 py-1 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs text-center font-medium animate-in fade-in">
          {validationAlert}
        </div>
      )}

      {/* ==================================================== */}
      {/* Traditional Brush & Palette Controls                 */}
      {/* ==================================================== */}
      <div className="w-full max-w-sm mt-3 flex flex-col gap-2.5 bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-200 dark:border-stone-700/80">
        
        {/* Row 1: Brush Widths & Ink Colors */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Brush Thickness selector */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mr-1 flex items-center gap-0.5">
              <Brush size={12} />
              <span>ব্রাশ:</span>
            </span>
            {BRUSH_SIZES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBrushWidth(b.width)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  brushWidth === b.width
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Traditional Ink Colors */}
          <div className="flex items-center gap-1.5">
            {INK_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={c.name}
                title={c.name}
                onClick={() => setStrokeColor(c.hex)}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer shadow-xs ${
                  strokeColor === c.hex
                    ? 'scale-115 ring-2 ring-offset-2 ring-stone-800 dark:ring-stone-200'
                    : 'hover:scale-105 opacity-85 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Action Buttons (Undo, Clear & Primary Submit) */}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-stone-200/80 dark:border-stone-700/60">
          
          {/* Undo & Clear Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="btn-undo-canvas-stroke"
              onClick={handleUndo}
              disabled={strokes.length === 0}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                strokes.length > 0
                  ? 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-600 hover:bg-stone-100 active:scale-95'
                  : 'bg-stone-100 dark:bg-stone-900 text-stone-400 dark:text-stone-600 border-stone-200 dark:border-stone-800 cursor-not-allowed opacity-50'
              }`}
              title="শেষ স্ট্রোকটি বাতিল করুন"
            >
              <RotateCcw size={12} />
              <span>আগের ধাপ</span>
            </button>

            <button
              type="button"
              id="btn-clear-canvas"
              onClick={handleClear}
              disabled={strokes.length === 0}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                strokes.length > 0
                  ? 'bg-white dark:bg-stone-800 text-rose-600 dark:text-rose-400 border-stone-300 dark:border-stone-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95'
                  : 'bg-stone-100 dark:bg-stone-900 text-stone-400 dark:text-stone-600 border-stone-200 dark:border-stone-800 cursor-not-allowed opacity-50'
              }`}
              title="পুরো ক্যানভাস পরিষ্কার করুন"
            >
              <Trash2 size={12} />
              <span>মুছুন</span>
            </button>
          </div>

          {/* Primary Submit Button */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="btn-submit-practice-stroke"
              onClick={handleSubmit}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl text-white shadow-md transition active:scale-95 cursor-pointer ${
                hasSubstantialDrawing || isCompleted
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 ring-2 ring-emerald-500/20'
                  : 'bg-stone-700 hover:bg-stone-800'
              }`}
            >
              <CheckCircle2 size={14} className={justSubmitted ? 'animate-bounce' : ''} />
              <span>
                {isCompleted || justSubmitted ? 'সম্পন্ন ✓ (+15 XP)' : 'অনুশীলন জমা দিন'}
              </span>
            </button>
          </div>

        </div>

      </div>

      {/* Optional Next Character Quick Link if submitted */}
      {(justSubmitted || isCompleted) && hasNextChar && onNextChar && (
        <div className="mt-3 flex items-center justify-center animate-in fade-in">
          <button
            type="button"
            onClick={onNextChar}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-800 transition cursor-pointer"
          >
            <span>পরবর্তী বর্ণ আঁকুন</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
