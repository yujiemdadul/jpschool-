import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    titleBn: 'First Step (প্রথম পদক্ষেপ)',
    titleJp: '最初の一歩',
    descriptionBn: 'প্রথম যেকোনো জাপানি অক্ষরের পাঠ সম্পন্ন করেছেন',
    icon: '🌱',
    xpReward: 50
  },
  {
    id: 'hiragana_beginner',
    titleBn: 'Hiragana Beginner (হিরাগানা শিক্ষানবিস)',
    titleJp: 'ひらがな初級',
    descriptionBn: 'হিরাগানার প্রথম ৫টি লেভেল (Level 1–5) সম্পন্ন করেছেন',
    icon: '🌸',
    xpReward: 150
  },
  {
    id: 'hiragana_master',
    titleBn: 'Hiragana Master (হিরাগানা মাস্টার)',
    titleJp: 'ひらがなマスター',
    descriptionBn: 'হিরাগানার সব ১০টি লেভেল (৪৬টি অক্ষর) সফলভাবে সমাপ্ত করেছেন',
    icon: '👑',
    xpReward: 300
  },
  {
    id: 'katakana_beginner',
    titleBn: 'Katakana Beginner (কাতাকানা শিক্ষানবিস)',
    titleJp: 'カタカナ初級',
    descriptionBn: 'কাতাকানার প্রথম ৫টি লেভেল (Level 1–5) সম্পন্ন করেছেন',
    icon: '⚡',
    xpReward: 150
  },
  {
    id: 'katakana_master',
    titleBn: 'Katakana Master (কাতাকানা মাস্টার)',
    titleJp: 'カタカナマスター',
    descriptionBn: 'কাতাকানার সব ১০টি লেভেল (৪৬টি অক্ষর) সফলভাবে সমাপ্ত করেছেন',
    icon: '🎌',
    xpReward: 300
  },
  {
    id: 'quiz_novice',
    titleBn: 'Quiz Novice (কুইজ শুরু)',
    titleJp: 'クイズ入門',
    descriptionBn: 'প্রথম কোনো কুইজ সম্পন্ন করেছেন',
    icon: '🎯',
    xpReward: 50
  },
  {
    id: 'quiz_master',
    titleBn: 'Quiz Master (কুইজ মাস্টার)',
    titleJp: 'クイズマスター',
    descriptionBn: '১০০টি কুইজ প্রশ্ন সঠিকভাবে উত্তর দিয়েছেন',
    icon: '🏆',
    xpReward: 250
  },
  {
    id: 'streak_3',
    titleBn: 'Consistent Learner (ধারাবাহিক শিক্ষার্থী)',
    titleJp: '三日坊主克服',
    descriptionBn: 'টানা ৩ দিনের লার্নিং স্ট্রিক অর্জন করেছেন',
    icon: '🔥',
    xpReward: 100
  },
  {
    id: 'perfect_score',
    titleBn: 'Flawless (নিখুঁত স্কোর)',
    titleJp: '満点',
    descriptionBn: 'কোনো কুইজে ১০০% সঠিক উত্তর দিয়ে পূর্ণমান পেয়েছেন',
    icon: '✨',
    xpReward: 100
  },
  {
    id: 'daily_challenger',
    titleBn: 'Daily Challenger (দৈনিক যোদ্ধা)',
    titleJp: 'デイリー挑戦者',
    descriptionBn: 'প্রথমবারের মতো দৈনিক কুইজ চ্যালেঞ্জ সম্পন্ন করেছেন',
    icon: '⚔️',
    xpReward: 75
  },
  {
    id: 'daily_streak_7',
    titleBn: 'Weekly Champion (৭ দিনের চ্যাম্পিয়ন)',
    titleJp: '週間チャンピオン',
    descriptionBn: 'টানা ৭ দিন দৈনিক কুইজ চ্যালেঞ্জ সম্পন্ন করেছেন',
    icon: '🌟',
    xpReward: 200
  },
  {
    id: 'streak_7',
    titleBn: '7 Day Streak (৭ দিনের স্টাডি স্ট্রিক)',
    titleJp: '7日間連続達成',
    descriptionBn: 'টানা ৭ দিন নিয়মিত জাপানি পড়ার অভ্যাস বজায় রেখেছেন',
    icon: '🔥',
    xpReward: 200
  },
  {
    id: 'chars_100',
    titleBn: '100 Characters Mastered (১০০ অক্ষর আয়ত্ত)',
    titleJp: '100文字習得',
    descriptionBn: 'হিরাগানা ও কাতাকানার মোট ১০০টি অক্ষর সফলভাবে মাস্টার করেছেন',
    icon: '🈴',
    xpReward: 350
  },
  {
    id: 'streak_protector',
    titleBn: 'Streak Shield (স্ট্রিক অভিভাবক)',
    titleJp: '連続保護',
    descriptionBn: 'কুইজ থেকে অর্জিত পয়েন্ট দিয়ে স্ট্রিক ফ্রিজ সংগ্রহ করে নিজের স্ট্রিক সুরক্ষিত করেছেন',
    icon: '❄️',
    xpReward: 50
  }
];
