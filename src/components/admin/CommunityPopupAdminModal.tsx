import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Save, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Eye, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Plus,
  Trash2,
  Share2,
  Users
} from 'lucide-react';
import { CommunityPopupConfig, CommunityPlatform } from '../../types';
import { communityService, DEFAULT_COMMUNITY_CONFIG } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { SPECIFIC_ADMIN_EMAIL } from '../common/AdminGuard';
import confetti from 'canvas-confetti';

interface CommunityPopupAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTestPreview?: () => void;
}

const PLATFORM_OPTIONS: { id: CommunityPlatform; label: string; icon: string }[] = [
  { id: 'facebook', label: 'Facebook Group / Page', icon: '🔵' },
  { id: 'telegram', label: 'Telegram Channel / Group', icon: '✈️' },
  { id: 'whatsapp', label: 'WhatsApp Community', icon: '🟢' },
  { id: 'youtube', label: 'YouTube Channel', icon: '🔴' },
  { id: 'discord', label: 'Discord Server', icon: '🟣' },
  { id: 'custom', label: 'অন্যান্য / কাস্টম লিংক', icon: '🔗' },
];

export const CommunityPopupAdminModal: React.FC<CommunityPopupAdminModalProps> = ({
  isOpen,
  onClose,
  onOpenTestPreview
}) => {
  const { userProfile, adminEmail } = useAuth();
  
  const [config, setConfig] = useState<CommunityPopupConfig>(DEFAULT_COMMUNITY_CONFIG);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load existing popup config
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      communityService.getPopupConfig()
        .then(res => {
          setConfig(res);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const emailToSend = userProfile?.email || adminEmail || SPECIFIC_ADMIN_EMAIL;
    const res = await communityService.savePopupConfig(config, emailToSend);

    setSaving(false);
    if (res.success && res.config) {
      setConfig(res.config);
      setStatusMessage({ type: 'success', text: '✓ কমিউনিটি পোস্ট সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!' });
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'সংরক্ষণ ব্যর্থ হয়েছে' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMessage(null);

    const emailToSend = userProfile?.email || adminEmail || SPECIFIC_ADMIN_EMAIL;
    const res = await communityService.uploadBannerImage(file, emailToSend);

    setUploadingImage(false);
    if (res.success && res.imageUrl) {
      setConfig(prev => ({ ...prev, imageUrl: res.imageUrl! }));
      setStatusMessage({ type: 'success', text: '✓ ছবি আপলোড সফল হয়েছে!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'ছবি আপলোড করতে ব্যর্থ হয়েছে' });
    }
  };

  const handleAddPoint = () => {
    const pts = config.highlightPoints || [];
    if (pts.length < 5) {
      setConfig(prev => ({
        ...prev,
        highlightPoints: [...pts, 'নতুন সুবিধা বা তথ্য']
      }));
    }
  };

  const handleRemovePoint = (index: number) => {
    const pts = config.highlightPoints || [];
    setConfig(prev => ({
      ...prev,
      highlightPoints: pts.filter((_, idx) => idx !== index)
    }));
  };

  const handlePointChange = (index: number, val: string) => {
    const pts = [...(config.highlightPoints || [])];
    pts[index] = val;
    setConfig(prev => ({ ...prev, highlightPoints: pts }));
  };

  const handleClearSnooze = () => {
    communityService.clearSnooze();
    setStatusMessage({ type: 'success', text: '✓ ৬ ঘণ্টার স্নুজ ক্লিয়ার করা হয়েছে! এখন পেজ রিলোড দিলে পপআপ সরাসরি আসবে।' });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div 
        id="community-admin-modal-card"
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-850/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-xs">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                  কমিউনিটি পোস্ট ও পপআপ ব্যানার নিয়ন্ত্রণ
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  এডমিন প্যানেল
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                ওয়েবসাইটে প্রবেশের সময় প্রদর্শিত পোস্ট, লিংক ও ছবির সেটিংস
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className={`p-3 text-xs font-bold text-center border-b ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Tab Toggle: Editor vs Live Preview */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-900/30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`pb-2.5 px-3 text-xs font-black transition border-b-2 cursor-pointer ${
                activeTab === 'editor'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              পোস্ট এডিটর (Settings)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`pb-2.5 px-3 text-xs font-black transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Eye size={13} />
              <span>লাইভ প্রিভিউ (Live Preview)</span>
            </button>
          </div>

          {/* Quick Clear Snooze & Test Launch */}
          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              onClick={handleClearSnooze}
              className="text-[11px] font-bold text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-300 transition cursor-pointer flex items-center gap-1"
              title="৬ ঘণ্টার স্নুজ রিসেট করুন"
            >
              <Clock size={11} />
              <span>স্নুজ রিসেট</span>
            </button>
            {onOpenTestPreview && (
              <button
                type="button"
                onClick={onOpenTestPreview}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold transition cursor-pointer flex items-center gap-1"
              >
                <Eye size={12} />
                <span>ফুল পপআপ টেস্ট</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'editor' ? (
            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Master Enable/Disable Toggle */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-black text-stone-900 dark:text-white block">
                    ওয়েবসাইটে প্রবেশের সময় পপআপ পোস্ট প্রদর্শন
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    চালু থাকলে ব্যবহারকারী ওয়েবসাইটে প্রবেশের সময় কমিউনিটি ব্যানার দেখতে পাবেন (স্নুজ সক্রিয় না থাকলে)
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={config.isEnabled}
                  onClick={() => setConfig(prev => ({ ...prev, isEnabled: !prev.isEnabled }))}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer shrink-0 ${
                    config.isEnabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                      config.isEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  >
                    {config.isEnabled ? (
                      <Check size={12} className="text-emerald-600 font-bold" />
                    ) : (
                      <X size={12} className="text-stone-400" />
                    )}
                  </div>
                </button>
              </div>

              {/* Title & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    পোস্টের মূল শিরোনাম (Bangla Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={config.titleBn}
                    onChange={(e) => setConfig(prev => ({ ...prev, titleBn: e.target.value }))}
                    placeholder="যেমন: আমাদের অফিশিয়াল জাপানিজ লার্নিং কমিউনিটিতে স্বাগতম!"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    জাপানি সাবটাইটেল (Japanese Title - ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={config.titleJp || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, titleJp: e.target.value }))}
                    placeholder="যেমন: 日本語学習コミュニティへようこそ！"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Category Tag */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  ট্যাগ / ব্যাজ টেক্সট (Tag Badge)
                </label>
                <input
                  type="text"
                  value={config.tagBn || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, tagBn: e.target.value }))}
                  placeholder="যেমন: Chandu Japanese School • অফিশিয়াল কমিউনিটি"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Description Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  পোস্টের বিস্তারিত বর্ণনা / মেসেজ (Description Text) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={config.descriptionBn}
                  onChange={(e) => setConfig(prev => ({ ...prev, descriptionBn: e.target.value }))}
                  placeholder="পোস্টে কী লেখা থাকবে লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Banner Image Management */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-rose-600" />
                    <span>কমিউনিটি ব্যানার ছবি (Banner Image)</span>
                  </span>
                  <span className="text-[10px] font-bold text-stone-500">অনুপাত: ১৬:৯ বা ল্যান্ডস্কেপ</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Current image preview thumbnail */}
                  <div className="w-24 h-16 rounded-xl bg-stone-900 overflow-hidden shrink-0 border border-stone-300 dark:border-stone-700 relative">
                    <img 
                      src={config.imageUrl || '/community_banner.jpg'} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={config.imageUrl || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="ছবির লিংক (URL), যেমন: /community_banner.jpg"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Upload Button */}
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition cursor-pointer shadow-2xs">
                        <Upload size={12} className={uploadingImage ? 'animate-bounce' : ''} />
                        <span>{uploadingImage ? 'আপলোড হচ্ছে...' : 'কম্পিউটার/মোবাইল থেকে ছবি আপলোড'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>

                      {/* Reset to High-Res Torii Preset */}
                      <button
                        type="button"
                        onClick={() => setConfig(prev => ({ ...prev, imageUrl: '/community_banner.jpg' }))}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
                      >
                        🌸 ডিফল্ট তোরিই ব্যানার
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Community Link Details */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 space-y-3">
                <span className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                  <LinkIcon size={14} className="text-rose-600" />
                  <span>মূল কমিউনিটি লিংক (Primary Community Link) *</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                      প্ল্যাটফর্ম নির্বাচন
                    </label>
                    <select
                      value={config.primaryPlatform}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryPlatform: e.target.value as CommunityPlatform }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-rose-500"
                    >
                      {PLATFORM_OPTIONS.map(p => (
                        <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-7 space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                      বাটন টেক্সট (Button Label)
                    </label>
                    <input
                      type="text"
                      required
                      value={config.primaryLinkText}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryLinkText: e.target.value }))}
                      placeholder="যেমন: কমিউনিটিতে যোগ দিন 🚀"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                    কমিউনিটি লিঙ্ক URL (Target Web/App Link) *
                  </label>
                  <input
                    type="url"
                    required
                    value={config.primaryLinkUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryLinkUrl: e.target.value }))}
                    placeholder="https://www.facebook.com/groups/your-group"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Secondary Community Link (Optional) */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 space-y-3">
                <span className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Share2 size={14} className="text-blue-600" />
                  <span>দ্বিতীয় লিংক / চ্যানেল (Secondary Link - ঐচ্ছিক)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                      প্ল্যাটফর্ম
                    </label>
                    <select
                      value={config.secondaryPlatform || 'telegram'}
                      onChange={(e) => setConfig(prev => ({ ...prev, secondaryPlatform: e.target.value as CommunityPlatform }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-bold"
                    >
                      {PLATFORM_OPTIONS.map(p => (
                        <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-7 space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                      বাটন টেক্সট
                    </label>
                    <input
                      type="text"
                      value={config.secondaryLinkText || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, secondaryLinkText: e.target.value }))}
                      placeholder="যেমন: টেলিগ্রাম চ্যানেলে যুক্ত হোন"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                    লিঙ্ক URL
                  </label>
                  <input
                    type="url"
                    value={config.secondaryLinkUrl || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, secondaryLinkUrl: e.target.value }))}
                    placeholder="https://t.me/your-channel (খালি রাখলে এই বাটনটি দেখাবে না)"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Snooze Duration Setting (Default: 6 Hours) */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-500" />
                    <span>ইউজার স্নুজ সময়সীমা (Snooze Duration)</span>
                  </span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    ইউজার যখন "৬ ঘণ্টার জন্য আর দেখাবেন না" বক্সে টিক দেবে, তখন কতক্ষণ পপআপ বন্ধ থাকবে (ডিফল্ট: ৬ ঘণ্টা)
                  </p>
                </div>

                <select
                  value={config.snoozeHours || 6}
                  onChange={(e) => setConfig(prev => ({ ...prev, snoozeHours: Number(e.target.value) }))}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-xs shrink-0"
                >
                  <option value={2}>২ ঘণ্টা</option>
                  <option value={4}>৪ ঘণ্টা</option>
                  <option value={6}>৬ ঘণ্টা (ডিফল্ট/সুপারিশকৃত)</option>
                  <option value={12}>১২ ঘণ্টা</option>
                  <option value={24}>২৪ ঘণ্টা (১ দিন)</option>
                </select>
              </div>

              {/* Highlight Perks Bullet Points */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    হাইলাইট পয়েন্টসমূহ (বক্সে যা যা পাবেন)
                  </label>
                  {(config.highlightPoints || []).length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddPoint}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>পয়েন্ট যোগ করুন</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {(config.highlightPoints || []).map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => handlePointChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(idx)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Bar */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
                </button>
              </div>

            </form>
          ) : (
            /* LIVE PREVIEW TAB */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500 shrink-0" />
                <span>এটি ওয়েবসাইটে প্রবেশের সময় শিক্ষার্থীদের সামনে যেভাবে প্রদর্শিত হবে তার সরাসরি প্রিভিউ:</span>
              </div>

              <div className="max-w-md mx-auto rounded-3xl overflow-hidden border border-stone-300 dark:border-stone-700 shadow-xl bg-white dark:bg-stone-900">
                {/* Image */}
                <div className="relative aspect-16/9 bg-stone-900 overflow-hidden">
                  <img
                    src={config.imageUrl || '/community_banner.jpg'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/community_banner.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                      {config.tagBn || 'অফিশিয়াল কমিউনিটি'}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    {config.titleJp && (
                      <span className="text-[10px] font-black text-amber-300 block">
                        {config.titleJp}
                      </span>
                    )}
                    <h4 className="text-sm font-black leading-tight drop-shadow-xs">
                      {config.titleBn}
                    </h4>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {config.descriptionBn}
                  </p>

                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-1.5">
                    <span className="text-[11px] font-black text-amber-900 dark:text-amber-200 block">
                      {config.badgeText || 'কমিউনিটিতে যা যা পাচ্ছেন:'}
                    </span>
                    {(config.highlightPoints || []).map((pt, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-700 dark:text-stone-300">
                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>{config.primaryLinkText}</span>
                    <ExternalLink size={12} />
                  </button>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-amber-500" />
                      <span>{config.snoozeHours || 6} ঘণ্টার জন্য আর দেখাবেন না</span>
                    </span>
                    <span className="underline">এখনই ওয়েবসাইটে যান</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-white text-xs font-bold hover:bg-stone-200 transition cursor-pointer"
                >
                  ← সম্পাদনায় ফিরে যান
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
