import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Link as LinkIcon,
  BookOpen,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react';
import { JapanesePdf, PdfCategory, JlptLevel } from '../../types';
import { pdfService, ADMIN_EMAIL } from '../../services/pdfService';
import { useAuth } from '../../context/AuthContext';
import { checkIsSpecificAdmin, SPECIFIC_ADMIN_EMAIL } from '../common/AdminGuard';
import confetti from 'canvas-confetti';

interface SelectedFileItem {
  id: string;
  file: File;
  title: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface PdfUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (pdfOrPdfs: JapanesePdf | JapanesePdf[]) => void;
  adminEmail?: string;
}

export const PdfUploadModal: React.FC<PdfUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  adminEmail
}) => {
  const { userProfile, isAdmin } = useAuth();
  const isAuthorizedAdmin = Boolean(isAdmin && checkIsSpecificAdmin(userProfile));

  // Mode: multiple files from device OR single link
  const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');

  // Multi-file state
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Link mode state
  const [driveUrl, setDriveUrl] = useState<string>('');
  const [linkTitle, setLinkTitle] = useState<string>('');

  // Common metadata for the uploaded PDF(s)
  const [category, setCategory] = useState<PdfCategory>('grammar');
  const [level, setLevel] = useState<JlptLevel>('N5');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  // Upload progress & state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; currentTitle: string }>({
    current: 0,
    total: 0,
    currentTitle: ''
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  if (!isAuthorizedAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
        <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 text-center space-y-4 border border-rose-300 dark:border-rose-900 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
            <X size={24} />
          </div>
          <h3 className="text-lg font-black text-rose-900 dark:text-white">এডমিন অনুমতি সীমাবদ্ধ</h3>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            শুধুমাত্র অনুমোদিত এডমিন (<strong>{SPECIFIC_ADMIN_EMAIL}</strong>) নতুন PDF আপলোড করতে পারবেন।
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

  // Format file size nicely
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Convert filename to clean title: removes .pdf and replaces hyphens/underscores if desired
  const getAutoTitleFromFilename = (fileName: string): string => {
    const withoutExt = fileName.replace(/\.pdf$/i, '').trim();
    return withoutExt || fileName;
  };

  // Add multiple files to the queue
  const handleAddFiles = (files: FileList | File[]) => {
    setErrorMsg(null);
    const newItems: SelectedFileItem[] = [];
    const invalidFiles: string[] = [];
    const oversizedFiles: string[] = [];

    Array.from(files).forEach((file) => {
      // Validate PDF format
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        invalidFiles.push(file.name);
        return;
      }

      // 45MB size limit
      if (file.size > 45 * 1024 * 1024) {
        oversizedFiles.push(file.name);
        return;
      }

      // Check if already selected
      const isAlreadyAdded = selectedFiles.some(
        (item) => item.file.name === file.name && item.file.size === file.size
      );
      if (isAlreadyAdded) return;

      newItems.push({
        id: `pdf_file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        file,
        title: getAutoTitleFromFilename(file.name),
        status: 'pending'
      });
    });

    if (invalidFiles.length > 0) {
      setErrorMsg(`শুধুমাত্র PDF ফাইল আপলোড করা যাবে (${invalidFiles.slice(0, 3).join(', ')}${invalidFiles.length > 3 ? '...' : ''} বাতিল করা হয়েছে)`);
    } else if (oversizedFiles.length > 0) {
      setErrorMsg(`ফাইলের সাইজ ৪৫ MB এর বেশি হওয়া যাবে না (${oversizedFiles.slice(0, 3).join(', ')}${oversizedFiles.length > 3 ? '...' : ''})`);
    }

    if (newItems.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newItems]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    setSelectedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  // Convert File to base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error(`"${file.name}" ফাইলটি পড়তে সমস্যা হয়েছে`));
      reader.readAsDataURL(file);
    });
  };

  // Submit all files or link
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Link Mode validation
    if (uploadMode === 'link') {
      if (!driveUrl.trim()) {
        setErrorMsg('অনুগ্রহ করে গুগল ড্রাইভ বা সরাসরি ডাউনলোড লিংক দিন।');
        return;
      }
      if (!linkTitle.trim()) {
        setErrorMsg('অনুগ্রহ করে এই PDF এর শিরোনাম দিন।');
        return;
      }

      setIsUploading(true);
      try {
        const newPdf = await pdfService.uploadPdf({
          titleBn: linkTitle.trim(),
          descriptionBn: descriptionBn.trim(),
          category,
          level,
          driveUrl: driveUrl.trim(),
          fileUrl: driveUrl.trim(),
          fileName: `${linkTitle.trim()}.pdf`,
          isFeatured,
          adminEmail: adminEmail || ADMIN_EMAIL
        });

        setSuccessMsg('PDF সফলভাবে সংযুক্ত ও পাবলিশ করা হয়েছে!');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => {
          onUploadSuccess(newPdf);
          onClose();
        }, 1200);
      } catch (err: any) {
        setErrorMsg(err?.message || 'আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      } finally {
        setIsUploading(false);
      }
      return;
    }

    // Multiple Files Mode validation
    if (selectedFiles.length === 0) {
      setErrorMsg('অনুগ্রহ করে অন্তত একটি PDF ফাইল নির্বাচন করুন।');
      return;
    }

    setIsUploading(true);
    const uploadedPdfs: JapanesePdf[] = [];
    let failureCount = 0;

    setUploadProgress({
      current: 0,
      total: selectedFiles.length,
      currentTitle: ''
    });

    for (let i = 0; i < selectedFiles.length; i++) {
      const item = selectedFiles[i];
      const titleToUse = item.title.trim() || getAutoTitleFromFilename(item.file.name);

      setUploadProgress({
        current: i + 1,
        total: selectedFiles.length,
        currentTitle: titleToUse
      });

      // Update status to uploading
      setSelectedFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'uploading' } : f))
      );

      try {
        const base64 = await readFileAsBase64(item.file);
        const newPdf = await pdfService.uploadPdf({
          titleBn: titleToUse,
          fileName: item.file.name,
          fileBase64: base64,
          category,
          level,
          descriptionBn: descriptionBn.trim(),
          isFeatured,
          adminEmail: adminEmail || ADMIN_EMAIL
        });

        uploadedPdfs.push(newPdf);

        // Update status to success
        setSelectedFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'success' } : f))
        );
      } catch (err: any) {
        console.error(`Error uploading ${item.file.name}:`, err);
        failureCount++;
        setSelectedFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'error', error: err?.message || 'আপলোড ব্যর্থ' } : f))
        );
      }
    }

    setIsUploading(false);

    if (uploadedPdfs.length > 0) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      onUploadSuccess(uploadedPdfs);

      if (failureCount === 0) {
        setSuccessMsg(`সবগুলো (${uploadedPdfs.length}টি) PDF সফলভাবে আপলোড ও পাবলিশ করা হয়েছে!`);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setSuccessMsg(`${uploadedPdfs.length}টি PDF সফলভাবে আপলোড হয়েছে, ${failureCount}টি আপলোড করতে সমস্যা হয়েছে।`);
      }
    } else {
      setErrorMsg('কোনো PDF আপলোড করা যায়নি। অনুগ্রহ করে ফাইল চেক করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-7 my-auto transition-all max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isUploading}
          aria-label="বন্ধ করুন"
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer disabled:opacity-40"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 text-xs font-bold mb-2">
            <ShieldCheck size={14} />
            <span>এডমিন প্যানেল: {adminEmail || ADMIN_EMAIL}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <span>এক সাথে একাধিক PDF আপলোড করুন</span>
            <BookOpen size={22} className="text-rose-600 dark:text-rose-400" />
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            এক সাথে যত খুশি PDF নির্বাচন করুন। প্রতিটি ফাইলের নাম স্বয়ংক্রিয়ভাবে তার শিরোনাম হয়ে যাবে।
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

        {/* Upload Progress Bar if in progress */}
        {isUploading && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-rose-800 dark:text-rose-200 mb-2">
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-rose-600" />
                <span>আপলোড হচ্ছে ({uploadProgress.current}/{uploadProgress.total}): {uploadProgress.currentTitle}</span>
              </span>
              <span>{Math.round((uploadProgress.current / Math.max(1, uploadProgress.total)) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-rose-200 dark:bg-rose-900/60 overflow-hidden">
              <div 
                className="h-full bg-rose-600 rounded-full transition-all duration-300"
                style={{ width: `${(uploadProgress.current / Math.max(1, uploadProgress.total)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
          
          {/* Upload Mode Selector */}
          <div className="flex rounded-xl bg-stone-100 dark:bg-stone-800 p-1 shrink-0">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => setUploadMode('file')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                uploadMode === 'file'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <Upload size={14} />
              <span>ডিভাইস থেকে PDF (মাল্টিপল ফাইল)</span>
            </button>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => setUploadMode('link')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                uploadMode === 'link'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <LinkIcon size={14} />
              <span>গুগল ড্রাইভ বা ডাউনলোড লিঙ্ক</span>
            </button>
          </div>

          {/* Mode 1: Multiple Device Files */}
          {uploadMode === 'file' ? (
            <div className="space-y-3">
              {/* Hidden multi-file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,application/pdf"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleAddFiles(e.target.files);
                    // Reset input so re-selecting same files triggers change
                    e.target.value = '';
                  }
                }}
              />
              
              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30'
                    : selectedFiles.length > 0
                      ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10 hover:border-rose-400'
                      : 'border-stone-300 dark:border-stone-700 hover:border-rose-400 bg-stone-50 dark:bg-stone-800/40'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-2">
                  <Upload size={20} />
                </div>
                <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  {selectedFiles.length > 0 ? (
                    <span>আরও PDF ফাইল যোগ করতে <span className="text-rose-600 dark:text-rose-400 underline">ক্লিক করুন</span> বা ড্রপ করুন</span>
                  ) : (
                    <span>এক সাথে একাধিক PDF ফাইল এখানে ড্রপ করুন অথবা <span className="text-rose-600 dark:text-rose-400 underline">ব্রাউজ করুন</span></span>
                  )}
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Ctrl / Shift চেপে এক সাথে বহু ফাইল সিলেক্ট করতে পারেন • সর্বোচ্চ ৪৫ MB পর্যন্ত
                </p>
              </div>

              {/* Selected Files List with Auto-naming */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <FileText size={14} className="text-rose-600" />
                      <span>নির্বাচিত ফাইল ({selectedFiles.length}টি) — ফাইলের নাম অনুযায়ী স্বয়ংক্রিয় নাম:</span>
                    </span>
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => setSelectedFiles([])}
                        className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 text-[11px] font-semibold transition"
                      >
                        সব মুছুন
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedFiles.map((item, index) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          item.status === 'success'
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                            : item.status === 'uploading'
                              ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 animate-pulse'
                              : item.status === 'error'
                                ? 'bg-rose-50/80 dark:bg-rose-950/50 border-rose-300 dark:border-rose-900'
                                : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700/80 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            item.status === 'success'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : item.status === 'uploading'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'
                                : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'
                          }`}>
                            {item.status === 'success' ? (
                              <CheckCircle2 size={16} />
                            ) : item.status === 'uploading' ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <input
                              type="text"
                              disabled={isUploading}
                              value={item.title}
                              onChange={(e) => handleUpdateTitle(item.id, e.target.value)}
                              placeholder="PDF এর নাম"
                              className="w-full text-xs font-bold text-stone-900 dark:text-white bg-transparent border-b border-transparent hover:border-stone-300 focus:border-rose-500 focus:outline-hidden py-0.5 truncate"
                              title="ফাইলের নাম স্বয়ংক্রিয়ভাবে বসেছে, প্রয়োজনে পরিবর্তন করতে পারেন"
                            />
                            <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                              <span className="truncate">{item.file.name}</span>
                              <span>•</span>
                              <span>{formatFileSize(item.file.size)}</span>
                              {item.error && (
                                <span className="text-rose-600 font-bold ml-1">({item.error})</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {!isUploading && item.status !== 'success' && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(item.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-stone-700 transition cursor-pointer"
                            title="তালিকা থেকে বাদ দিন"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl text-stone-600 dark:text-stone-300 hover:border-rose-400 hover:text-rose-600 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>আরও PDF ফাইল যোগ করুন</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Google Drive / Link */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  শিরোনাম (বাংলা) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="যেমন: Minna No Nihongo N5 Vocabulary"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  গুগল ড্রাইভ বা ডিরেক্ট PDF ডাউনলোড লিংক <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="url"
                    required
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/... অথবা ডিরেক্ট PDF লিঙ্ক"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Metadata Section: Shared Category & Level */}
          <div className="pt-2 border-t border-stone-200/80 dark:border-stone-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  ক্যাটাগরি
                </label>
                <select
                  value={category}
                  disabled={isUploading}
                  onChange={(e) => setCategory(e.target.value as PdfCategory)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500 transition"
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
                  JLPT লেভেল
                </label>
                <select
                  value={level}
                  disabled={isUploading}
                  onChange={(e) => setLevel(e.target.value as JlptLevel)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500 transition"
                >
                  <option value="beginner">বিগিনার (হিরাগানা/কাতাকানা)</option>
                  <option value="N5">JLPT N5</option>
                  <option value="N4">JLPT N4</option>
                  <option value="N3">JLPT N3</option>
                  <option value="all">সকল লেভেল (All Levels)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)
              </label>
              <textarea
                rows={2}
                disabled={isUploading}
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                placeholder="এই PDF উপাদানটি শিক্ষার্থীদের যেভাবে সহায়তা করবে..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-rose-500 transition resize-none"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pdf-is-featured"
                disabled={isUploading}
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded-sm border-stone-300 focus:ring-rose-500"
              />
              <label htmlFor="pdf-is-featured" className="text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer flex items-center gap-1.5">
                <span>লাইব্রেরির শীর্ষে পিন (Featured) হিসেবে প্রদর্শন করুন</span>
                <Sparkles size={14} className="text-amber-500" />
              </label>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2 shrink-0">
            <button
              type="submit"
              disabled={isUploading || (uploadMode === 'file' && selectedFiles.length === 0)}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>আপলোড হচ্ছে ({uploadProgress.current}/{uploadProgress.total})...</span>
                </span>
              ) : uploadMode === 'file' ? (
                <>
                  <Upload size={16} />
                  <span>
                    {selectedFiles.length > 1 
                      ? `এক সাথে ${selectedFiles.length}টি PDF আপলোড ও পাবলিশ করুন`
                      : selectedFiles.length === 1 
                        ? '১টি PDF আপলোড ও পাবলিশ করুন'
                        : 'PDF ফাইল নির্বাচন করুন'}
                  </span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>লিঙ্ক দিয়ে PDF পাবলিশ করুন</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
