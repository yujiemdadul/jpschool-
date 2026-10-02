import React from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';
import { KanjiChar } from '../../types';
import { KanjiPictogramVisual } from './KanjiPictogramVisual';
import { playJapaneseAudio } from '../../utils/speech';

interface KanjiCardProps {
  kanji: KanjiChar;
  isLearned: boolean;
  onClick: () => void;
}

export const KanjiCard: React.FC<KanjiCardProps> = ({
  kanji,
  isLearned,
  onClick
}) => {
  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playJapaneseAudio(kanji.character);
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left bg-white dark:bg-stone-800/90 hover:shadow-lg hover:-translate-y-0.5 ${
        isLearned
          ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-400/30'
          : 'border-stone-200 dark:border-stone-700 hover:border-rose-300 dark:hover:border-rose-700/80'
      }`}
    >
      {/* Top badges bar */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
          {kanji.categoryBn}
        </span>

        {isLearned ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={12} />
            <span>শেখা শেষ</span>
          </span>
        ) : (
          <span className="text-[10px] font-medium text-stone-400 dark:text-stone-500">
            {kanji.strokeCount} স্ট্রোক
          </span>
        )}
      </div>

      {/* Main Kanji & Visual Representation row */}
      <div className="flex items-center justify-between gap-3 my-1">
        <div className="flex items-center gap-3">
          {/* Kanji character */}
          <div className="w-14 h-14 rounded-xl bg-stone-50 dark:bg-stone-700/60 border border-stone-200 dark:border-stone-600 flex items-center justify-center group-hover:border-rose-400 transition-colors shrink-0">
            <span className="text-3xl font-black text-stone-900 dark:text-white font-serif group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {kanji.character}
            </span>
          </div>

          {/* Meaning & Readings */}
          <div className="space-y-0.5 min-w-0">
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white truncate">
              {kanji.meaningBn}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {kanji.meaningEn}
            </p>
            <div className="text-[11px] text-stone-600 dark:text-stone-300 truncate pt-0.5">
              <span className="font-semibold text-rose-600 dark:text-rose-400">{kanji.kunyomi[0] || kanji.onyomi[0]}</span>
              <span className="text-stone-400 ml-1">({kanji.kunyomiBn[0] || kanji.onyomiBn[0]})</span>
            </div>
          </div>
        </div>

        {/* Pictogram thumbnail */}
        <div className="shrink-0 scale-90 group-hover:scale-95 transition-transform">
          <KanjiPictogramVisual kanji={kanji} size="sm" showEvolution={false} />
        </div>
      </div>

      {/* Mnemonic short hook */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between gap-2 text-xs">
        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 italic">
          💡 {kanji.mnemonicStoryBn}
        </p>
        <button
          type="button"
          onClick={handleAudioClick}
          title="উচ্চারণ শুনুন"
          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-stone-700 transition-colors cursor-pointer shrink-0"
        >
          <Volume2 size={15} />
        </button>
      </div>
    </div>
  );
};
