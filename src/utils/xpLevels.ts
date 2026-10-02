export interface UserLevelInfo {
  level: number;
  titleBn: string;
  titleJp: string;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  totalXp: number;
  badgeColor: string;
}

export function calculateUserLevel(totalXp: number): UserLevelInfo {
  const xp = Math.max(0, Number(totalXp) || 0);

  const thresholds = [
    { level: 1, minXp: 0, maxXp: 150, titleBn: 'নবাগত শিক্ষার্থী', titleJp: '入門 (Nyūmon)', badgeColor: 'from-slate-500 to-stone-600' },
    { level: 2, minXp: 150, maxXp: 350, titleBn: 'শিক্ষানবিস', titleJp: '見習い (Minarai)', badgeColor: 'from-emerald-500 to-teal-600' },
    { level: 3, minXp: 350, maxXp: 650, titleBn: 'অনুশীলনকারী', titleJp: '修行者 (Shugyōsha)', badgeColor: 'from-blue-500 to-indigo-600' },
    { level: 4, minXp: 650, maxXp: 1100, titleBn: 'কাণা অভিযাত্রী', titleJp: '仮名探検家 (Explorer)', badgeColor: 'from-violet-500 to-purple-600' },
    { level: 5, minXp: 1100, maxXp: 1700, titleBn: 'দক্ষ শিক্ষার্থী', titleJp: '熟練者 (Jukurensha)', badgeColor: 'from-amber-500 to-orange-600' },
    { level: 6, minXp: 1700, maxXp: 2450, titleBn: 'ক্ষুরধার পাঠক', titleJp: '精読者 (Reader)', badgeColor: 'from-cyan-500 to-sky-600' },
    { level: 7, minXp: 2450, maxXp: 3350, titleBn: 'জাপানি পণ্ডিত', titleJp: '達人 (Tatsujin)', badgeColor: 'from-rose-500 to-pink-600' },
    { level: 8, minXp: 3350, maxXp: 4400, titleBn: 'কাণা বিশারদ', titleJp: '専門家 (Expert)', badgeColor: 'from-purple-600 to-indigo-700' },
    { level: 9, minXp: 4400, maxXp: 5600, titleBn: 'কাণা মাস্টার', titleJp: '仮名名人 (Master)', badgeColor: 'from-red-500 to-rose-700' },
    { level: 10, minXp: 5600, maxXp: 7000, titleBn: 'গ্র্যান্ডমাস্টার', titleJp: '宗家 (Grandmaster)', badgeColor: 'from-yellow-400 to-amber-600' },
  ];

  for (const tier of thresholds) {
    if (xp < tier.maxXp) {
      const range = tier.maxXp - tier.minXp;
      const currentInTier = xp - tier.minXp;
      const percent = Math.min(100, Math.max(0, Math.round((currentInTier / range) * 100)));
      return {
        level: tier.level,
        titleBn: tier.titleBn,
        titleJp: tier.titleJp,
        currentLevelXp: currentInTier,
        xpForNextLevel: range,
        progressPercent: percent,
        totalXp: xp,
        badgeColor: tier.badgeColor
      };
    }
  }

  // Beyond Level 10 (Continuous Mastery)
  const beyondBaseXp = 7000;
  const xpPerBeyondLevel = 1500;
  const extraLevels = Math.floor((xp - beyondBaseXp) / xpPerBeyondLevel);
  const currentBeyondLevel = 10 + extraLevels;
  const currentInBeyondTier = (xp - beyondBaseXp) % xpPerBeyondLevel;
  const beyondPercent = Math.min(100, Math.max(0, Math.round((currentInBeyondTier / xpPerBeyondLevel) * 100)));

  return {
    level: currentBeyondLevel,
    titleBn: `সর্বোচ্চ মাস্টার ${currentBeyondLevel > 10 ? `(${currentBeyondLevel}★)` : ''}`,
    titleJp: '免許皆伝 (Menkyo Kaiden)',
    currentLevelXp: currentInBeyondTier,
    xpForNextLevel: xpPerBeyondLevel,
    progressPercent: beyondPercent,
    totalXp: xp,
    badgeColor: 'from-amber-400 via-yellow-500 to-rose-600'
  };
}
