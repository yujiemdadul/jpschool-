import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ZoomIn, 
  ZoomOut, 
  BookOpen, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  RefreshCw,
  Sliders,
  Layers,
  ArrowRight,
  ArrowLeft,
  Eye
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { JapanesePdf } from '../../types';
import { pdfService } from '../../services/pdfService';

// Configure PDF.js Worker securely for Vite
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface PdfReaderModalProps {
  pdf: JapanesePdf | null;
  onClose: () => void;
  onDownload?: (pdf: JapanesePdf) => void;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({
  pdf,
  onClose,
  onDownload
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomMultiplier, setZoomMultiplier] = useState<number>(1.0);
  const [fitMode, setFitMode] = useState<'width' | 'page'>('width');
  const [viewCount, setViewCount] = useState<number>(pdf?.viewCount || 0);
  
  // Loading & Error states
  const [isDocLoading, setIsDocLoading] = useState<boolean>(true);
  const [isPageRendering, setIsPageRendering] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [useIframeFallback, setUseIframeFallback] = useState<boolean>(false);

  // Canvas and render refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Reset state whenever target PDF changes
  useEffect(() => {
    if (!pdf) {
      setPdfDoc(null);
      setCurrentPage(1);
      setNumPages(1);
      setLoadError(null);
      setUseIframeFallback(false);
      return;
    }

    let isSubscribed = true;
    setIsDocLoading(true);
    setLoadError(null);
    setCurrentPage(1);
    setUseIframeFallback(false);
    setViewCount(pdf.viewCount || 0);

    // Increment and track online view count
    pdfService.trackView(pdf.id).then(newCount => {
      if (newCount > 0 && isSubscribed) {
        setViewCount(newCount);
      }
    });

    const loadDocument = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: pdf.fileUrl,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
        });

        const doc = await loadingTask.promise;
        if (!isSubscribed) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages || 1);
        setIsDocLoading(false);
      } catch (err: any) {
        console.warn('PDF.js render init warning, falling back to responsive reader:', err);
        if (!isSubscribed) return;
        setIsDocLoading(false);
        setUseIframeFallback(true);
      }
    };

    loadDocument();

    return () => {
      isSubscribed = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore cancel error
        }
      }
    };
  }, [pdf]);

  // Render specific page on Canvas
  const renderPage = useCallback(async (pageNumber: number) => {
    if (!pdfDoc) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    try {
      setIsPageRendering(true);

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }

      const page = await pdfDoc.getPage(pageNumber);
      const unscaledViewport = page.getViewport({ scale: 1.0 });

      // Compute responsive scale
      const containerWidth = container.clientWidth || 800;
      const containerHeight = container.clientHeight || 700;
      
      let baseScale = 1.0;
      if (fitMode === 'width') {
        const padding = window.innerWidth < 640 ? 16 : 48;
        baseScale = (containerWidth - padding) / unscaledViewport.width;
      } else {
        const scaleX = (containerWidth - 32) / unscaledViewport.width;
        const scaleY = (containerHeight - 32) / unscaledViewport.height;
        baseScale = Math.min(scaleX, scaleY);
      }

      const finalScale = Math.max(0.5, Math.min(3.0, baseScale * zoomMultiplier));
      const viewport = page.getViewport({ scale: finalScale });
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const renderContext = {
        canvasContext: ctx,
        transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null,
        viewport: viewport
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;
      await task.promise;
      setIsPageRendering(false);
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Page render error:', err);
      }
      setIsPageRendering(false);
    }
  }, [pdfDoc, fitMode, zoomMultiplier]);

  // Re-render when page number, zoom, or fit mode changes
  useEffect(() => {
    if (pdfDoc && !useIframeFallback) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, fitMode, zoomMultiplier, renderPage, useIframeFallback]);

  // Keyboard navigation listener (Arrow Left / Right, PageUp / Down)
  useEffect(() => {
    if (!pdf) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleNextPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, numPages, pdf]);

  if (!pdf) return null;

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(numPages, prev + 1));
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(numPages);
  };

  const handleDownload = () => {
    pdfService.trackDownload(pdf.id);
    if (onDownload) {
      onDownload(pdf);
    } else {
      const link = document.createElement('a');
      link.href = pdf.fileUrl;
      link.download = pdf.fileName || `${pdf.titleBn}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Touch Swipe Handlers for mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    
    // Swipe threshold 50px
    if (diff > 50) {
      handlePrevPage();
    } else if (diff < -50) {
      handleNextPage();
    }
    touchStartXRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        className={`bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col transition-all overflow-hidden ${
          isFullscreen 
            ? 'fixed inset-2 z-50 w-[calc(100vw-16px)] h-[calc(100vh-16px)]' 
            : 'w-full max-w-5xl h-[92vh]'
        }`}
      >
        
        {/* Top Header Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/90 dark:bg-stone-900/90 gap-3 shrink-0">
          
          {/* PDF Title & Level */}
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <BookOpen size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-white truncate">
                  {pdf.titleBn}
                </h3>
                {pdf.level && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    {pdf.level === 'all' ? 'All' : pdf.level}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  <Eye size={11} className="text-sky-500" />
                  <span>{viewCount} ভিউ</span>
                </span>
              </div>
              {pdf.titleJp ? (
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate font-japanese">
                  {pdf.titleJp}
                </p>
              ) : (
                <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                  অনলাইন ই-বুক রিডার • পৃষ্ঠা উল্টাতে চাপুন
                </p>
              )}
            </div>
          </div>

          {/* Action buttons (Download & Window controls) */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Primary Download Button (Option 1: ডাউনলোড) */}
            <button
              type="button"
              id="btn-reader-download"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
              title="PDF ফাইলটি ডিভাইসে ডাউনলোড করুন"
            >
              <Download size={15} />
              <span>ডাউনলোড করুন</span>
            </button>

            {/* Open in external new tab */}
            <a
              href={pdf.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition"
              title="নতুন ট্যাবে সরাসরি খুলুন"
            >
              <ExternalLink size={16} />
            </a>

            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition hidden sm:inline-flex cursor-pointer"
              title={isFullscreen ? 'সাধারণ ভিউ' : 'ফুলস্ক্রিন ভিউ'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X size={18} />
            </button>
          </div>

        </div>

        {/* Main Book Page Viewer Viewport */}
        <div 
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 bg-stone-200/70 dark:bg-stone-950 relative overflow-auto flex flex-col items-center justify-start p-3 sm:p-6 scrollbar-thin select-none"
        >
          
          {/* Document Initial Loading Indicator */}
          {isDocLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-100/90 dark:bg-stone-950/90 z-20">
              <div className="w-12 h-12 border-3 border-rose-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-stone-700 dark:text-stone-200">
                PDF বইটি অনলাইনে সাজানো হচ্ছে...
              </p>
              <p className="text-xs text-stone-500">
                পৃষ্ঠাগুলো স্বয়ংক্রিয়ভাবে লোড হচ্ছে
              </p>
            </div>
          )}

          {/* Interactive Floating Page Navigation Buttons (চাপ দিয়ে প্রতিটা পৃষ্ঠা সরানো যাবে) */}
          {!isDocLoading && !useIframeFallback && numPages > 1 && (
            <>
              {/* Left Arrow Button (আগের পৃষ্ঠা) */}
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                aria-label="পূর্ববর্তী পৃষ্ঠা"
                className={`fixed sm:absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/95 dark:bg-stone-800/95 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 shadow-xl flex items-center justify-center transition-all cursor-pointer ${
                  currentPage <= 1 
                    ? 'opacity-20 cursor-not-allowed pointer-events-none' 
                    : 'hover:bg-rose-600 hover:text-white hover:scale-105 active:scale-95'
                }`}
                title="পূর্ববর্তী পৃষ্ঠা (Keyboard: ←)"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Right Arrow Button (পরের পৃষ্ঠা) */}
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= numPages}
                aria-label="পরবর্তী পৃষ্ঠা"
                className={`fixed sm:absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/95 dark:bg-stone-800/95 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 shadow-xl flex items-center justify-center transition-all cursor-pointer ${
                  currentPage >= numPages 
                    ? 'opacity-20 cursor-not-allowed pointer-events-none' 
                    : 'hover:bg-rose-600 hover:text-white hover:scale-105 active:scale-95'
                }`}
                title="পরবর্তী পৃষ্ঠা (Keyboard: →)"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Book Page Canvas Sheet */}
          {!useIframeFallback ? (
            <div className="relative my-auto flex flex-col items-center">
              
              {/* Paper Shadow Container */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-white border border-stone-300 dark:border-stone-800 transition-all duration-200">
                <canvas 
                  ref={canvasRef} 
                  className="block mx-auto max-w-full transition-opacity duration-150"
                  style={{ opacity: isPageRendering ? 0.75 : 1.0 }}
                />

                {/* Page Loading Overlay */}
                {isPageRendering && (
                  <div className="absolute inset-0 bg-white/40 dark:bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Page Number indicator badge on paper bottom */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/70 text-white text-[11px] font-bold backdrop-blur-md shadow-xs">
                <span>পৃষ্ঠা {currentPage} / {numPages}</span>
              </div>

            </div>
          ) : (
            // Robust embedded reader fallback if PDF.js worker fails in specific browsers
            <div className="w-full h-full flex flex-col">
              <iframe
                src={`${pdf.fileUrl}#toolbar=1&navpanes=0&scrollbar=1&page=${currentPage}`}
                title={pdf.titleBn}
                className="w-full flex-1 rounded-2xl border border-stone-300 dark:border-stone-800 bg-white"
              />
            </div>
          )}

        </div>

        {/* Bottom Interactive Toolbar (চাপ দিয়ে পেজ সরানোর বার ও কন্ট্রোল) */}
        <div className="px-3 py-2.5 sm:px-6 sm:py-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Left: Quick Page Info & File size */}
          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            <span className="hidden sm:inline-flex items-center gap-1">
              <FileText size={13} className="text-rose-500" />
              <span>{pdf.fileSizeFormatted || 'PDF'}</span>
            </span>
            <span className="hidden md:inline">
              কী-বোর্ডের <strong>←</strong> এবং <strong>→</strong> তীর চাপুন
            </span>
          </div>

          {/* Center: Main Page-Flipping Controls (চাপ দিয়ে দিয়ে পৃষ্ঠা সরানো) */}
          <div className="flex items-center gap-1.5 sm:gap-2 mx-auto">
            
            {/* First Page */}
            <button
              type="button"
              onClick={handleFirstPage}
              disabled={currentPage <= 1}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              title="প্রথম পৃষ্ঠা"
            >
              <ChevronsLeft size={16} />
            </button>

            {/* Previous Page Button (আগের পৃষ্ঠা) */}
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
              title="পূর্ববর্তী পৃষ্ঠা"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">পূর্ববর্তী</span>
            </button>

            {/* Page Selector Pill / Dropdown */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-black shadow-xs">
              <span>পৃষ্ঠা</span>
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
                className="bg-transparent font-black text-rose-600 dark:text-rose-400 focus:outline-hidden cursor-pointer"
              >
                {Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
                  <option key={p} value={p} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">
                    {p}
                  </option>
                ))}
              </select>
              <span className="text-stone-400">/ {numPages}</span>
            </div>

            {/* Next Page Button (পরের পৃষ্ঠা) */}
            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= numPages}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
              title="পরবর্তী পৃষ্ঠা"
            >
              <span className="hidden sm:inline">পরবর্তী</span>
              <ChevronRight size={16} />
            </button>

            {/* Last Page */}
            <button
              type="button"
              onClick={handleLastPage}
              disabled={currentPage >= numPages}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              title="সর্বশেষ পৃষ্ঠা"
            >
              <ChevronsRight size={16} />
            </button>

          </div>

          {/* Right: Zoom controls & Secondary Download button */}
          <div className="flex items-center gap-1.5">
            
            {/* Zoom Out */}
            <button
              type="button"
              onClick={() => setZoomMultiplier(prev => Math.max(0.6, prev - 0.2))}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="জুম আউট"
            >
              <ZoomOut size={15} />
            </button>

            {/* Zoom Reset */}
            <button
              type="button"
              onClick={() => {
                setZoomMultiplier(1.0);
                setFitMode(fitMode === 'width' ? 'page' : 'width');
              }}
              className="px-2 py-1 rounded-lg text-[10px] font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="ফিট মোড পরিবর্তন"
            >
              {Math.round(zoomMultiplier * 100)}%
            </button>

            {/* Zoom In */}
            <button
              type="button"
              onClick={() => setZoomMultiplier(prev => Math.min(2.5, prev + 0.2))}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="জুম ইন"
            >
              <ZoomIn size={15} />
            </button>

            {/* Secondary Download Button for convenience */}
            <button
              type="button"
              onClick={handleDownload}
              className="ml-1 sm:hidden p-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              title="ডাউনলোড"
            >
              <Download size={14} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
