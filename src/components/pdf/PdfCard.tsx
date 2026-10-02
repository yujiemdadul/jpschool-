import React from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Sparkles, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Bookmark,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { JapanesePdf, PdfCategory } from '../../types';
import { AdminGuard } from '../common/AdminGuard';

interface PdfCardProps {
  pdf: JapanesePdf;
  onRead: (pdf: JapanesePdf) => void;
  onDownload: (pdf: JapanesePdf) => void;
  onDelete?: (pdf: JapanesePdf) => void;
  onEdit?: (pdf: JapanesePdf) => void;
  isAdmin?: boolean;
}

const CATEGORY_MAP: Record<PdfCategory, { label: string; jp: string; color: string; bg: string }> = {
  grammar: {
    label: 'ব্যাকরণ ও বাক্য',
    jp: '文法',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60'
  },
  kanji: {
    label: 'কাঞ্জি শিট',
    jp: '漢字',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900/60'
  },
  vocabulary: {
    label: 'শব্দভাণ্ডার',
    jp: '単語',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60'
  },
  writing: {
    label: 'লেখার বই',
    jp: '書き方',
    color: 'text-sky-700 dark:text-sky-300',
    bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-900/60'
  },
  jlpt: {
    label: 'JLPT প্রশ্ন',
    jp: '試験対策',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60'
  },
  conversation: {
    label: 'কথোপকথন',
    jp: '会話',
    color: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900/60'
  },
  guide: {
    label: 'পূর্ণাঙ্গ গাইড',
    jp: 'ガイド',
    color: 'text-stone-700 dark:text-stone-300',
    bg: 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700'
  }
};

export const PdfCard: React.FC<PdfCardProps> = ({
  pdf,
  onRead,
  onDownload,
  onDelete,
  onEdit,
  isAdmin = false
}) => {
  const cat = CATEGORY_MAP[pdf.category] || CATEGORY_MAP.guide;

  return (
    <div className={`relative flex flex-col justify-between bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl border transition-all duration-200 hover:shadow-lg p-5 sm:p-6 group ${
      pdf.isFeatured 
        ? 'border-amber-300 dark:border-amber-800/80 shadow-xs' 
        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
    }`}>
      
      {/* Featured Star Badge */}
      {pdf.isFeatured && (
        <div className="absolute -top-2.5 -right-2.5 px-2.5 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black shadow-xs flex items-center gap-1 z-10">
          <Sparkles size={11} className="fill-white" />
          <span>বিশেষ সংকলন</span>
        </div>
      )}

      {/* Top Meta: Category & Level Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cat.bg} ${cat.color} flex items-center gap-1`}>
              <span>{cat.label}</span>
              <span className="opacity-60 text-[9px]">({cat.jp})</span>
            </span>

            {pdf.level && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/80">
                {pdf.level === 'all' ? 'All Levels' : pdf.level}
              </span>
            )}
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <AdminGuard>
              <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(pdf)}
                    className="px-2 py-1 rounded-lg text-amber-700 dark:text-amber-300 hover:text-amber-800 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 border border-amber-200 dark:border-amber-800/80 transition cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                    title="PDF এর নাম ও ক্যাটাগরি সম্পাদন করুন"
                  >
                    <Edit3 size={13} className="text-amber-600 dark:text-amber-400" />
                    <span>এডিট</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(pdf)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                    title="PDF মুছুন"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </AdminGuard>
          )}
        </div>

        {/* Title and Japanese name */}
        <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2">
          {pdf.titleBn}
        </h3>

        {pdf.titleJp && (
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5 truncate font-japanese">
            {pdf.titleJp}
          </p>
        )}

        {/* Description */}
        <p className="text-xs text-stone-600 dark:text-stone-300 mt-2.5 leading-relaxed line-clamp-2">
          {pdf.descriptionBn || 'জাপানিজ ভাষা দক্ষতার জন্য প্রয়োজনীয় অনুশীলন ও শিখন নোট।'}
        </p>
      </div>

      {/* Card Bottom: File Info & Buttons */}
      <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-stone-800">
        
        {/* File Meta row with View Counter & Download Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 dark:text-stone-400 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
              <FileText size={12} />
              <span>{pdf.fileSizeFormatted || 'PDF'}</span>
            </span>
            {pdf.pageCount && (
              <span>• {pdf.pageCount} পৃষ্ঠা</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span 
              className="inline-flex items-center gap-1 font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-lg border border-sky-200/80 dark:border-sky-900/50"
              title="অনলাইনে যতবার এই PDF পড়া হয়েছে"
            >
              <Eye size={12} className="text-sky-500" />
              <span>{pdf.viewCount || 0} বার দেখা হয়েছে</span>
            </span>

            <span 
              className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200/80 dark:border-emerald-900/50"
              title="ডিভাইসে যতবার ডাউনলোড করা হয়েছে"
            >
              <Download size={11} className="text-emerald-500" />
              <span>{pdf.downloadCount || 0} ডাউনলোড</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onRead(pdf)}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Eye size={14} className="text-rose-500" />
            <span>অনলাইনে পড়ুন</span>
          </button>

          <button
            type="button"
            onClick={() => onDownload(pdf)}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Download size={14} />
            <span>ডাউনলোড</span>
          </button>
        </div>

      </div>

    </div>
  );
};
