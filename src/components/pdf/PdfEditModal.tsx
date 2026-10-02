import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit3, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Link as LinkIcon,
  Loader2,
  FileText
} from 'lucide-react';
import { JapanesePdf, PdfCategory, JlptLevel } from '../../types';
import { pdfService, ADMIN_EMAIL } from '../../services/pdfService';
import { useAuth } from '../../context/AuthContext';
import { checkIsSpecificAdmin, SPECIFIC_ADMIN_EMAIL } from '../common/AdminGuard';
import confetti from 'canvas-confetti';

interface PdfEditModalProps {
  isOpen: boolean;
  pdf: JapanesePdf | null;
  onClose: () => void;
  onUpdateSuccess: (updatedPdf: JapanesePdf) => void;
  adminEmail?: string;
}

export const PdfEditModal: React.FC<PdfEditModalProps> = ({
  isOpen,
  pdf,
  onClose,
  onUpdateSuccess,
  adminEmail
}) => {
  const { userProfile, isAdmin } = useAuth();
  const isAuthorizedAdmin = Boolean(isAdmin && checkIsSpecificAdmin(userProfile));

  const [titleBn, setTitleBn] = useState('');
  const [titleJp, setTitleJp] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [category, setCategory] = useState<PdfCategory>('grammar');
  const [level, setLevel] = useState<JlptLevel>('N5');
  const [pageCount, setPageCount] = useState<string>('');
  const [driveUrl, setDriveUrl] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync state with selected PDF
  useEffect(() => {
    if (pdf) {
      setTitleBn(pdf.titleBn || '');
      setTitleJp(pdf.titleJp || '');
      setDescriptionBn(pdf.descriptionBn || '');
      setCategory(pdf.category || 'grammar');
      setLevel(pdf.level || 'N5');
      setPageCount(pdf.pageCount ? String(pdf.pageCount) : '');
      setDriveUrl(pdf.driveUrl || (pdf.fileUrl.startsWith('http') ? pdf.fileUrl : ''));
      setIsFeatured(Boolean(pdf.isFeatured));
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [pdf]);

  if (!isOpen || !pdf) return null;

  if (!isAuthorizedAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 text-center space-y-4 border border-rose-300 dark:border-rose-900 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
            <X size={24} />
          </div>
          <h3 className="text-lg font-black text-rose-900 dark:text-white">এডমিন অনুমতি সীমাবদ্ধ</h3>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            শুধুমাত্র অনুমোদিত এডমিন (<strong>{SPECIFIC_ADMIN_EMAIL}</strong>) PDF এর নাম ও ক্যাটাগরি সম্পাদন করতে পারবেন।
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 dark:hover:bg-stone-700 cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!titleBn.trim()) {
      setErrorMsg('অনুগ্রহ করে PDF এর নাম / শিরোনাম দিন');
      return;
    }

    setIsSubmitting(true);

    try {
      const emailToUse = adminEmail || userProfile?.email || ADMIN_EMAIL;
      const updated = await pdfService.updatePdf(
        pdf.id,
        {
          titleBn: titleBn.trim(),
          titleJp: titleJp.trim() || undefined,
          descriptionBn: descriptionBn.trim(),
          category,
          level,
          pageCount: pageCount ? parseInt(pageCount, 10) : undefined,
          driveUrl: driveUrl.trim() || undefined,
          isFeatured
        },
        emailToUse
      );

      setSuccessMsg('PDF এর তথ্য সফলভাবে আপডেট হয়েছে!');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        onUpdateSuccess(updated);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'PDF আপডেট করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-7 my-auto transition-all max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="বন্ধ করুন"
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer disabled:opacity-40"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 text-xs font-bold mb-2">
            <ShieldCheck size={14} />
            <span>এডমিন এডিটর: {adminEmail || ADMIN_EMAIL}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <span>PDF এর নাম ও ক্যাটাগরি সম্পাদন করুন</span>
            <Edit3 size={20} className="text-amber-600 dark:text-amber-400" />
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1.5 truncate">
            <FileText size={13} className="shrink-0 text-stone-400" />
            <span className="truncate">মূল ফাইল: {pdf.fileName}</span>
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2 shrink-0">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-start gap-2 shrink-0">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
          
          {/* PDF Name / Title (Bangla) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              PDF এর নাম / শিরোনাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              placeholder="যেমন: JLPT N5 পূর্ণাঙ্গ ব্যাকরণ গাইড"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>

          {/* Category & JLPT Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                ক্যাটাগরি <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                disabled={isSubmitting}
                onChange={(e) => setCategory(e.target.value as PdfCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 transition"
              >
                <option value="grammar">ব্যাকরণ ও বাক্য গঠন</option>
                <option value="kanji">কাঞ্জি শিট ও স্ট্রোক</option>
                <option value="vocabulary">শব্দভাণ্ডার ও শব্দকোষ</option>
                <option value="writing">হিরাগানা ও কাতাকানা লেখার বই</option>
                <option value="jlpt">JLPT N5/N4 প্রশ্ন ও সমাধান</option>
                <option value="conversation">প্রাত্যহিক কথোপকথন</option>
                <option value="guide">পূর্ণাঙ্গ গাইড ও রেফারেন্স</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                JLPT লেভেল <span className="text-rose-500">*</span>
              </label>
              <select
                value={level}
                disabled={isSubmitting}
                onChange={(e) => setLevel(e.target.value as JlptLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 transition"
              >
                <option value="beginner">বিগিনার (হিরাগানা/কাতাকানা)</option>
                <option value="N5">JLPT N5</option>
                <option value="N4">JLPT N4</option>
                <option value="N3">JLPT N3</option>
                <option value="all">সকল লেভেল (All Levels)</option>
              </select>
            </div>
          </div>

          {/* Japanese Title & Page Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                জাপানিজ নাম (ঐচ্ছিক)
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                value={titleJp}
                onChange={(e) => setTitleJp(e.target.value)}
                placeholder="যেমন: N5 文法まとめノート"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500 transition font-japanese"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                পৃষ্ঠা সংখ্যা (ঐচ্ছিক)
              </label>
              <input
                type="number"
                min="1"
                disabled={isSubmitting}
                value={pageCount}
                onChange={(e) => setPageCount(e.target.value)}
                placeholder="যেমন: 28"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              সংক্ষিপ্ত বিবরণ
            </label>
            <textarea
              rows={2}
              disabled={isSubmitting}
              value={descriptionBn}
              onChange={(e) => setDescriptionBn(e.target.value)}
              placeholder="এই PDF বইটিতে কি কি শিখন উপাদান রয়েছে সংক্ষেপে লিখুন..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 transition resize-none"
            />
          </div>

          {/* Drive / Download URL */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              গুগল ড্রাইভ বা ডাউনলোড লিংক (ঐচ্ছিক)
            </label>
            <div className="relative">
              <LinkIcon size={15} className="absolute left-3.5 top-3 text-stone-400" />
              <input
                type="url"
                disabled={isSubmitting}
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>
          </div>

          {/* Featured Pin Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="edit-pdf-is-featured"
              disabled={isSubmitting}
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm border-stone-300 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="edit-pdf-is-featured" className="text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer flex items-center gap-1.5">
              <span>লাইব্রেরির শীর্ষে পিন (Featured) হিসেবে প্রদর্শন করুন</span>
              <Sparkles size={14} className="text-amber-500" />
            </label>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-2 flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs transition cursor-pointer"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </span>
              ) : (
                <>
                  <Check size={16} />
                  <span>পরিবর্তন সংরক্ষণ করুন</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
