import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Sparkles, 
  Download, 
  Filter, 
  ShieldCheck, 
  FileText, 
  Layers, 
  CheckCircle2, 
  RefreshCw,
  FolderDown,
  LogIn,
  Eye
} from 'lucide-react';
import { JapanesePdf, PdfCategory, JlptLevel } from '../../types';
import { pdfService, ADMIN_EMAIL } from '../../services/pdfService';
import { useAuth } from '../../context/AuthContext';
import { AdminGuard, checkIsSpecificAdmin, SPECIFIC_ADMIN_EMAIL } from '../common/AdminGuard';
import { PdfCard } from './PdfCard';
import { PdfReaderModal } from './PdfReaderModal';
import { PdfUploadModal } from './PdfUploadModal';
import { PdfEditModal } from './PdfEditModal';
import { motion, AnimatePresence } from 'motion/react';

interface PdfLibraryViewProps {
  onOpenAuthModal?: () => void;
}

export const PdfLibraryView: React.FC<PdfLibraryViewProps> = ({
  onOpenAuthModal
}) => {
  const { userProfile, isAdmin } = useAuth();
  const isAuthorizedAdmin = Boolean(isAdmin && checkIsSpecificAdmin(userProfile));

  const [pdfs, setPdfs] = useState<JapanesePdf[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<PdfCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<JlptLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'downloads'>('featured');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [activeReadingPdf, setActiveReadingPdf] = useState<JapanesePdf | null>(null);
  const [pdfToDelete, setPdfToDelete] = useState<JapanesePdf | null>(null);
  const [pdfToEdit, setPdfToEdit] = useState<JapanesePdf | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load PDFs
  const loadPdfs = async () => {
    setLoading(true);
    try {
      const data = await pdfService.fetchPdfs();
      setPdfs(data);
    } catch (err) {
      console.error('Failed to load PDFs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPdfs();

    // Listen for live database updates from server or other actions
    const handleDataUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.action === 'delete') {
        const delId = customEvent.detail.id;
        setPdfs(prev => prev.filter(p => p.id !== delId));
      } else {
        loadPdfs();
      }
    };

    window.addEventListener('chandu_data_updated', handleDataUpdate);
    return () => {
      window.removeEventListener('chandu_data_updated', handleDataUpdate);
    };
  }, []);

  // Filtered & Sorted PDFs
  const filteredPdfs = useMemo(() => {
    return pdfs.filter(p => {
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitleBn = p.titleBn.toLowerCase().includes(query);
        const matchesTitleJp = p.titleJp?.toLowerCase().includes(query);
        const matchesDesc = p.descriptionBn.toLowerCase().includes(query);
        if (!matchesTitleBn && !matchesTitleJp && !matchesDesc) {
          return false;
        }
      }

      // Category match
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Level match
      if (selectedLevel !== 'all' && p.level !== 'all' && p.level !== selectedLevel) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.uploadedAt || 0) - (a.uploadedAt || 0);
      }
      if (sortBy === 'downloads') {
        return (b.downloadCount || 0) - (a.downloadCount || 0);
      }
      return (b.uploadedAt || 0) - (a.uploadedAt || 0);
    });
  }, [pdfs, searchQuery, selectedCategory, selectedLevel, sortBy]);

  const handleDownload = (pdf: JapanesePdf) => {
    pdfService.trackDownload(pdf.id);
    setPdfs(prev => prev.map(item => item.id === pdf.id ? { ...item, downloadCount: (item.downloadCount || 0) + 1 } : item));
    
    const link = document.createElement('a');
    link.href = pdf.fileUrl;
    link.download = pdf.fileName || `${pdf.titleBn}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRead = (pdf: JapanesePdf) => {
    setActiveReadingPdf(pdf);
    setPdfs(prev => prev.map(item => item.id === pdf.id ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item));
  };

  const confirmDelete = async () => {
    if (!pdfToDelete) return;
    setDeleteError(null);
    setIsDeleting(true);

    try {
      const emailToUse = userProfile?.email || ADMIN_EMAIL;
      await pdfService.deletePdf(pdfToDelete.id, emailToUse);
      const deletedTitle = pdfToDelete.titleBn;
      const deletedId = pdfToDelete.id;
      
      setPdfs(prev => prev.filter(p => p.id !== deletedId));
      setPdfToDelete(null);
      setSuccessToast(`"${deletedTitle}" ফাইলটি সফলভাবে স্থায়ীভাবে মুছে ফেলা হয়েছে।`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: any) {
      setDeleteError(err?.message || 'PDF মুছতে সমস্যা হয়েছে');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadSuccess = (newPdfOrPdfs: JapanesePdf | JapanesePdf[]) => {
    if (Array.isArray(newPdfOrPdfs)) {
      setPdfs(prev => [...newPdfOrPdfs, ...prev.filter(p => !newPdfOrPdfs.some(n => n.id === p.id))]);
      setSuccessToast(`${newPdfOrPdfs.length}টি PDF সফলভাবে লাইব্রেরিতে যুক্ত হয়েছে!`);
    } else {
      setPdfs(prev => [newPdfOrPdfs, ...prev.filter(p => p.id !== newPdfOrPdfs.id)]);
      setSuccessToast(`"${newPdfOrPdfs.titleBn}" সফলভাবে লাইব্রেরিতে যুক্ত হয়েছে!`);
    }
    setTimeout(() => setSuccessToast(null), 3500);
    loadPdfs();
  };

  const handleUpdateSuccess = (updatedPdf: JapanesePdf) => {
    setPdfs(prev => prev.map(p => p.id === updatedPdf.id ? updatedPdf : p));
    setSuccessToast(`"${updatedPdf.titleBn}" এর তথ্য সফলভাবে আপডেট হয়েছে!`);
    setTimeout(() => setSuccessToast(null), 3500);
    setPdfToEdit(null);
  };

  const totalDownloads = useMemo(() => {
    return pdfs.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);
  }, [pdfs]);

  const totalViews = useMemo(() => {
    return pdfs.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
  }, [pdfs]);

  const categories: { id: PdfCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'সকল উপাদান' },
    { id: 'writing', label: 'লেখার বই' },
    { id: 'grammar', label: 'ব্যাকরণ' },
    { id: 'kanji', label: 'কাঞ্জি শিট' },
    { id: 'vocabulary', label: 'শব্দভাণ্ডার' },
    { id: 'jlpt', label: 'JLPT প্রশ্ন' },
    { id: 'conversation', label: 'কথোপকথন' },
    { id: 'guide', label: 'গাইড' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-rose-900 via-stone-900 to-stone-950 p-6 sm:p-8 text-white border border-rose-900/40 shadow-xl">
        {/* Ambient glowing blooms */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
              <span>🌸</span>
              <span>জাপানিজ লার্নিং রিসোর্স লাইব্রেরি</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              প্রয়োজনীয় জাপানিজ PDF বই ও শিখন শিট
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              হিরাগানা ও কাতাকানা প্র্যাকটিস শিট, JLPT N5 ব্যাকরণ সামারি, ১০০ কাঞ্জি ওয়ার্কবুক এবং পরীক্ষার প্রশ্ন শিট এক ক্লিকে পড়ুন ও ডাউনলোড করুন।
            </p>

            {/* Quick stats tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <BookOpen size={14} className="text-rose-400" />
                <span>{pdfs.length}টি সংকলিত শিট ও বই</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-xs font-bold text-sky-200 flex items-center gap-1.5">
                <Eye size={14} className="text-sky-400" />
                <span>{totalViews} বার পড়া হয়েছে</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                <FolderDown size={14} className="text-emerald-400" />
                <span>{totalDownloads} বার ডাউনলোড হয়েছে</span>
              </span>
            </div>
          </div>

          {/* Admin CTA - only visible if logged in as verified Admin */}
          <AdminGuard>
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
              <button
                type="button"
                id="btn-admin-upload-pdf"
                onClick={() => setIsUploadOpen(true)}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Plus size={18} />
                <span>নতুন PDF আপলোড করুন</span>
              </button>
            </div>
          </AdminGuard>
        </div>
      </div>

      {/* Admin Notice Strip if Logged in as Admin */}
      <AdminGuard>
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 font-semibold">
            <span className="p-1 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
              👑
            </span>
            <span>
              <strong>এডমিন এক্সেস সক্রিয়:</strong> আপনি <strong>{SPECIFIC_ADMIN_EMAIL}</strong> হিসেবে ভেরিফাইড। আপনি নতুন জাপানিজ PDF আপলোড, এডিট ও ডিলিট করতে পারবেন।
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shrink-0 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus size={15} />
            <span>নতুন PDF আপলোড</span>
          </button>
        </div>
      </AdminGuard>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="PDF খুঁজুন (যেমন: ব্যাকরণ, N5 কাঞ্জি, কাতাকানা)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500 transition shadow-xs"
          />
        </div>

        {/* Level & Sort Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <option value="all">সব লেভেল</option>
            <option value="beginner">বিগিনার</option>
            <option value="N5">JLPT N5</option>
            <option value="N4">JLPT N4</option>
            <option value="N3">JLPT N3</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <option value="featured">বাছাইকৃত (Featured)</option>
            <option value="newest">সর্বশেষ আপলোড</option>
            <option value="downloads">সর্বাধিক ডাউনলোড</option>
          </select>

          <button
            type="button"
            onClick={loadPdfs}
            title="রিফ্রেশ করুন"
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-500 hover:text-stone-800 dark:hover:text-white transition shadow-xs cursor-pointer"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* PDF Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-500 dark:text-stone-400">
            PDF লাইব্রেরি লোড হচ্ছে...
          </p>
        </div>
      ) : filteredPdfs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPdfs.map(pdf => (
            <PdfCard
              key={pdf.id}
              pdf={pdf}
              onRead={handleRead}
              onDownload={handleDownload}
              onDelete={(p) => setPdfToDelete(p)}
              onEdit={(p) => setPdfToEdit(p)}
              isAdmin={isAuthorizedAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
            <BookOpen size={28} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
            {pdfs.length === 0 ? 'এখনো কোনো PDF ফাইল আপলোড করা হয়নি' : 'কোনো PDF উপাদান পাওয়া যায়নি'}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            {pdfs.length === 0 
              ? 'এডমিন প্যানেল থেকে নতুন PDF ফাইল আপলোড করলে সেগুলো এখানে প্রদর্শিত হবে এবং স্থায়ীভাবে সংরক্ষিত থাকবে।'
              : 'আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো উপাদান পাওয়া যায়নি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {pdfs.length > 0 && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedLevel('all'); }}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
            <AdminGuard>
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus size={14} />
                <span>নতুন PDF আপলোড করুন</span>
              </button>
            </AdminGuard>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal protected by AdminGuard */}
      {pdfToDelete && (
        <AdminGuard
          showAccessDeniedMessage
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-rose-300 dark:border-rose-900 space-y-3 text-center">
                <p className="text-sm font-bold text-rose-600">শুধুমাত্র অনুমোদিত এডমিন ({SPECIFIC_ADMIN_EMAIL}) PDF ডিলিট করতে পারবেন।</p>
                <button type="button" onClick={() => setPdfToDelete(null)} className="px-4 py-2 bg-stone-200 rounded-xl text-xs font-bold cursor-pointer">বন্ধ করুন</button>
              </div>
            </div>
          }
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
              <h3 className="text-lg font-black text-stone-900 dark:text-white">
                PDF মুছে ফেলার নিশ্চিতকরণ
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                আপনি কি নিশ্চিত যে <strong>"{pdfToDelete.titleBn}"</strong> ফাইলটি স্থায়ীভাবে মুছে ফেলতে চান?
              </p>
              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  {deleteError}
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setPdfToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>মুছে ফেলা হচ্ছে...</span>
                    </>
                  ) : (
                    <span>হ্যাঁ, মুছে ফেলুন</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </AdminGuard>
      )}

      {/* Floating Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* PDF Reader Modal */}
      <PdfReaderModal
        pdf={activeReadingPdf}
        onClose={() => setActiveReadingPdf(null)}
        onDownload={handleDownload}
      />

      {/* Admin Upload Modal protected by AdminGuard */}
      <AdminGuard>
        <PdfUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
          adminEmail={userProfile?.email || SPECIFIC_ADMIN_EMAIL}
        />
      </AdminGuard>

      {/* Admin Edit Modal protected by AdminGuard */}
      <AdminGuard>
        <PdfEditModal
          isOpen={Boolean(pdfToEdit)}
          pdf={pdfToEdit}
          onClose={() => setPdfToEdit(null)}
          onUpdateSuccess={handleUpdateSuccess}
          adminEmail={userProfile?.email || SPECIFIC_ADMIN_EMAIL}
        />
      </AdminGuard>

    </div>
  );
};
