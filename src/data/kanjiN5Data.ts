import { KanjiChar, KanjiCategory } from '../types';

export interface KanjiCategoryMeta {
  id: KanjiCategory;
  nameBn: string;
  nameJp: string;
  icon: string;
  descriptionBn: string;
  badgeColor: string;
}

export const KANJI_CATEGORIES: KanjiCategoryMeta[] = [
  {
    id: 'nature',
    nameBn: 'প্রকৃতি ও উপাদান',
    nameJp: '自然・元素',
    icon: 'Sun',
    descriptionBn: 'সূর্য, চাঁদ, আগুন, জল, গাছ, পাহাড় ও নদীর মতো প্রাকৃতিক শক্তির কাঞ্জি',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
  },
  {
    id: 'numbers',
    nameBn: 'সংখ্যা ও গণনা',
    nameJp: '数字・計算',
    icon: 'Hash',
    descriptionBn: 'এক থেকে দশ হাজার এবং টাকা-পয়সার পরিমাপক কাঞ্জি',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
  },
  {
    id: 'people',
    nameBn: 'মানুষ, পরিবার ও শরীর',
    nameJp: '人・家族・体',
    icon: 'Users',
    descriptionBn: 'মানুষ, বাবা-মা, চোখ, কান, হাত, পায়ের অঙ্গপ্রত্যঙ্গ ও সম্পর্কের কাঞ্জি',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
  },
  {
    id: 'directions',
    nameBn: 'দিক, অবস্থান ও সময়',
    nameJp: '方角・位置・時間',
    icon: 'Compass',
    descriptionBn: 'উপরে, নিচে, পূর্ব, পশ্চিম, এখন, বছর এবং সময়ের পরিমাপক কাঞ্জি',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
  },
  {
    id: 'actions',
    nameBn: 'মৌলিক ক্রিয়া ও কাজ',
    nameJp: '基本動詞',
    icon: 'Activity',
    descriptionBn: 'দেখা, খাওয়া, পান করা, যাওয়া, আসা, পড়া ও লেখার মতো ক্রিয়াপদের কাঞ্জি',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
  },
  {
    id: 'life',
    nameBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    nameJp: '社会・学校・生活',
    icon: 'BookOpen',
    descriptionBn: 'স্কুল, বই, দেশ, গাড়ি, দোকান এবং দৈনন্দিন জীবনের গুরুত্বপূর্ণ কাঞ্জি',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
  }
];

export const KANJI_N5_LIST: KanjiChar[] = [
  // ==========================================
  // 1. NATURE & ELEMENTS (প্রকৃতি ও উপাদান)
  // ==========================================
  {
    id: 'kanji_n5_sun',
    character: '日',
    meaningBn: 'সূর্য / দিন',
    meaningEn: 'Sun / Day',
    onyomi: ['ニチ', 'ジツ'],
    kunyomi: ['ひ', '-び', '-か'],
    onyomiBn: ['নিচি', 'জিৎসু'],
    kunyomiBn: ['হি', 'বি', 'কা'],
    strokeCount: 4,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'প্রাচীনকালে গোল বৃত্তের ভেতর একটি আলোর বিন্দু এঁকে সূর্য বোঝানো হতো। ব্রাশ দিয়ে গোল আঁকা কঠিন বলে তা চারকোনা বাক্সে রূপ নেয়, যার মাঝের দাগটি সূর্যের উজ্জ্বল আলোকচ্ছটা।',
    visualOrigin: {
      realWorldObject: 'দীপ্তিময় গোল সূর্য',
      ancientFormDescription: 'একটি গোল বৃত্তের কেন্দ্রে ছোট উজ্জ্বল আলোকবিন্দু',
      transformationHint: 'গোলাকার দাগটি পরবর্তীতে বাক্সে রূপ নিয়ে আধুনিক 日 তৈরি হয়েছে।',
      pictogramType: 'sun'
    },
    examples: [
      { word: '日本', reading: 'にほん (nihon)', readingBn: 'নিহন', meaningBn: 'জাপান (সূর্যের দেশ)' },
      { word: '日曜日', reading: 'にちようび (nichiyoubi)', readingBn: 'নিচিয়োওবি', meaningBn: 'রবিবার' },
      { word: '今日', reading: 'きょう (kyou)', readingBn: 'ক্যোও', meaningBn: 'আজ' }
    ]
  },
  {
    id: 'kanji_n5_moon',
    character: '月',
    meaningBn: 'চাঁদ / মাস',
    meaningEn: 'Moon / Month',
    onyomi: ['ゲツ', 'ガツ'],
    kunyomi: ['つき'],
    onyomiBn: ['গেৎসু', 'গাৎসু'],
    kunyomiBn: ['ৎসুকি'],
    strokeCount: 4,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'আকাশের সুন্দর বাঁকা কাস্তের মতো অর্ধচন্দ্র (Crescent Moon), আর তার পেট দিয়ে দুটি হালকা মেঘের টুকরো ভেসে যাচ্ছে। এই চাঁদের আকৃতি থেকেই তৈরি হয়েছে 月।',
    visualOrigin: {
      realWorldObject: 'বাঁকা কাস্তে আকারের চাঁদ',
      ancientFormDescription: 'একটি সরু অর্ধচন্দ্রের রূপরেখা এবং পাশে ভাসমান মেঘমালা',
      transformationHint: 'বাঁকা অর্ধচন্দ্রের আকৃতি ব্রাশে লিখে চার স্ট্রোকের 月 হয়েছে।',
      pictogramType: 'moon'
    },
    examples: [
      { word: '月', reading: 'つき (tsuki)', readingBn: 'ৎসুকি', meaningBn: 'চাঁদ' },
      { word: '一月', reading: 'いちがつ (ichigatsu)', readingBn: 'ইচিগাৎসু', meaningBn: 'জানুয়ারি মাস' },
      { word: '月曜日', reading: 'げつようび (getsuyoubi)', readingBn: 'গেৎসুয়োওবি', meaningBn: 'সোমবার' }
    ]
  },
  {
    id: 'kanji_n5_fire',
    character: '火',
    meaningBn: 'আগুন',
    meaningEn: 'Fire',
    onyomi: ['カ'],
    kunyomi: ['ひ', '-び', 'ほ-'],
    onyomiBn: ['কা'],
    kunyomiBn: ['হি'],
    strokeCount: 4,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'কাঠের অগ্নিকুণ্ড থেকে ওপরের দিকে লকলক করে আগুনের শিখা উঠছে, আর দুপাশে আগুনের স্ফুলিঙ্গ বা ফুলকি ছিটকে পড়ছে। মাঝখানের খাড়া অংশ শিখা, দুপাশের বিন্দু দুটি স্ফুলিঙ্গ।',
    visualOrigin: {
      realWorldObject: 'লেলিহান আগুনের শিখা ও ফুলকি',
      ancientFormDescription: 'মাটিতে জ্বলন্ত অগ্নিকুণ্ডের ৩টি শিখার স্কেচ',
      transformationHint: 'মাঝের শিখাটি সোজা হয়ে যায় আর পাশের দুটি শিখা ছোট ডটে পরিণত হয়।',
      pictogramType: 'fire'
    },
    examples: [
      { word: '火', reading: 'ひ (hi)', readingBn: 'হি', meaningBn: 'আগুন' },
      { word: '火曜日', reading: 'かようび (kayoubi)', readingBn: 'কায়োওবি', meaningBn: 'মঙ্গলবার' },
      { word: '花火', reading: 'はなび (hanabi)', readingBn: 'হানাবি', meaningBn: 'আতশবাজি (ফুলের মতো আগুন)' }
    ]
  },
  {
    id: 'kanji_n5_water',
    character: '水',
    meaningBn: 'জল / পানি',
    meaningEn: 'Water',
    onyomi: ['スイ'],
    kunyomi: ['みず'],
    onyomiBn: ['সুই'],
    kunyomiBn: ['মিজু'],
    strokeCount: 4,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'মাঝখান দিয়ে একটি প্রবল পানির স্রোত বা ঝরনা নিচের দিকে নেমে যাচ্ছে, আর দুপাশে পানির ফোঁটা বা জলের ছোট ছোট ঘূর্ণি ছিটিয়ে পড়ছে।',
    visualOrigin: {
      realWorldObject: 'প্রবাহিত জলের স্রোত ও পানির ফোঁটা',
      ancientFormDescription: 'মাঝখানে ঢেউখেলানো জলের রেখা ও দুপাশে চার ফোঁটা পানি',
      transformationHint: 'মাঝের জলের রেখাটি সোজা হয়ে উল্লম্ব স্ট্রোক হলো এবং পাশের ফোঁটাগুলো স্ট্রোকে পরিণত হলো।',
      pictogramType: 'water'
    },
    examples: [
      { word: '水', reading: 'みず (mizu)', readingBn: 'মিজু', meaningBn: 'পানি / জল' },
      { word: '水曜日', reading: 'すいようび (suiyoubi)', readingBn: 'সুইয়োওবি', meaningBn: 'বুধবার' },
      { word: '水泳', reading: 'すいえい (suiei)', readingBn: 'সুইয়েই', meaningBn: 'সাঁতার' }
    ]
  },
  {
    id: 'kanji_n5_tree',
    character: '木',
    meaningBn: 'গাছ / কাঠ',
    meaningEn: 'Tree / Wood',
    onyomi: ['ボク', 'モク'],
    kunyomi: ['き', 'こ-'],
    onyomiBn: ['বোকু', 'মোকু'],
    kunyomiBn: ['কি'],
    strokeCount: 4,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'মাঝখানে একটি সোজা গাছের কাণ্ড, ওপরের দিকে ডালপালা ছড়িয়ে আছে এবং নিচে মাটির ভেতরে দুটো মূল বা শিকড় গভীরভাবে প্রবেশ করেছে। এটি সরাসরি একটি সবুজ গাছের ছবি!',
    visualOrigin: {
      realWorldObject: 'ডালপালা ও শিকড়যুক্ত একটি বৃক্ষ',
      ancientFormDescription: 'গাছের প্রধান কাণ্ড, দুটি প্রসারিত ডাল ও মাটির নিচের শিকড়',
      transformationHint: 'গাছের ডাল ও শিকড়ের বাঁক সরল হয়ে ৪ স্ট্রোকের 木 রূপ পায়।',
      pictogramType: 'tree'
    },
    examples: [
      { word: '木', reading: 'き (ki)', readingBn: 'কি', meaningBn: 'গাছ' },
      { word: '木曜日', reading: 'もくようび (mokuyoubi)', readingBn: 'মোকুয়োওবি', meaningBn: 'বৃহস্পতিবার' },
      { word: '木材', reading: 'もくざい (mokuzai)', readingBn: 'মোকুজাই', meaningBn: 'কাঠের তক্তা / কাঠ' }
    ]
  },
  {
    id: 'kanji_n5_gold',
    character: '金',
    meaningBn: 'সোনা / টাকা / ধাতু',
    meaningEn: 'Gold / Money / Metal',
    onyomi: ['キン', 'コン'],
    kunyomi: ['かね', 'かな-'],
    onyomiBn: ['কিন', 'কোন'],
    kunyomiBn: ['কানে'],
    strokeCount: 8,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'একটি পাহাড় বা মাটির ছাদের নিচে (উপরে ছাদ) মাটির গর্ভে মূল্যবান খনিজ সোনা বা সোনার দানা চকচক করছে। মাটির নিচে লুকানো রত্নই সোনা বা টাকা (金)।',
    visualOrigin: {
      realWorldObject: 'মাটির নিচে লুকানো সোনার খনিজ',
      ancientFormDescription: 'মাটির স্তূপ ও তার নিচে থাকা সোনার দুটি উজ্জ্বল কণা',
      transformationHint: 'উপরে ছাদ বা পাহাড়ের রূপরেখা ও নিচে মাটির ভেতরে খনিজের দাগ।',
      pictogramType: 'gold'
    },
    examples: [
      { word: 'お金', reading: 'おかね (okane)', readingBn: 'ওকানে', meaningBn: 'টাকা / পয়সা' },
      { word: '金曜日', reading: 'きんようび (kinyoubi)', readingBn: 'কিনয়োওবি', meaningBn: 'শুক্রবার' },
      { word: '金メダル', reading: 'きんめだる (kinmedaru)', readingBn: 'কিন মেদারু', meaningBn: 'স্বর্ণপদক (Gold Medal)' }
    ]
  },
  {
    id: 'kanji_n5_earth',
    character: '土',
    meaningBn: 'মাটি / পৃথিবী',
    meaningEn: 'Soil / Earth / Ground',
    onyomi: ['ド', 'ト'],
    kunyomi: ['つち'],
    onyomiBn: ['দো', 'তো'],
    kunyomiBn: ['ৎসুরি'],
    strokeCount: 3,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'মাটির সমতল পৃষ্ঠের ওপর থেকে একটি চারাগাছ মাটি ফুঁড়ে ওপরের দিকে উঠছে। নিচের লম্বা দাগটি হলো বিস্তৃত মাটি, আর উপরের অংশ চারাগাছ।',
    visualOrigin: {
      realWorldObject: 'মাটির ওপর গজিয়ে ওঠা চারা',
      ancientFormDescription: 'মাটির স্তূপের ওপর থেকে মাথা তোলা উর্বর মাটি বা বীজ',
      transformationHint: 'নিচের অনুভূমিক রেখাটি মাটি এবং উপরের ক্রসটি মাটির ওপর চারাগাছ।',
      pictogramType: 'soil'
    },
    examples: [
      { word: '土', reading: 'つち (tsuchi)', readingBn: 'ৎসুচি', meaningBn: 'মাটি' },
      { word: '土曜日', reading: 'どようび (doyoubi)', readingBn: 'দোয়োওবি', meaningBn: 'শনিবার' },
      { word: '土地', reading: 'とち (tochi)', readingBn: 'তোচি', meaningBn: 'জমি / ভূখণ্ড' }
    ]
  },
  {
    id: 'kanji_n5_mountain',
    character: '山',
    meaningBn: 'পাহাড় / পর্বত',
    meaningEn: 'Mountain',
    onyomi: ['サン', 'ザン'],
    kunyomi: ['やま'],
    onyomiBn: ['সান', 'জান'],
    kunyomiBn: ['ইয়ামা'],
    strokeCount: 3,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'পাশাপাশি দাঁড়িয়ে থাকা তিনটি পর্বতশৃঙ্গ! মাঝখানের শৃঙ্গটি সবচেয়ে উঁচু, আর দুপাশের শৃঙ্গ দুটি একটু নিচু। সরাসরি পাহাড়ের দৃশ্য আঁকলে যেমন হয়, ঠিক তাই山।',
    visualOrigin: {
      realWorldObject: 'তিনটি পাহাড়ের চূড়া',
      ancientFormDescription: 'মাঝখানে বড় চূড়া এবং দুপাশে ছোট দুই চূড়ার রূপরেখা',
      transformationHint: 'চূড়ার রেখাগুলো সংযুক্ত হয়ে তিন স্ট্রোকের সহজ 山 তৈরি হয়েছে।',
      pictogramType: 'mountain'
    },
    examples: [
      { word: '山', reading: 'やま (yama)', readingBn: 'ইয়ামা', meaningBn: 'পাহাড়' },
      { word: '富士山', reading: 'ふじさん (fujisan)', readingBn: 'ফুজি-সান', meaningBn: 'ফুজি পর্বত' },
      { word: '登山', reading: 'とざん (tozan)', readingBn: 'তোজান', meaningBn: 'পাহাড়ে চড়া / পর্বতারোহণ' }
    ]
  },
  {
    id: 'kanji_n5_river',
    character: '川',
    meaningBn: 'নদী / প্রবাহ',
    meaningEn: 'River / Stream',
    onyomi: ['セン'],
    kunyomi: ['かわ', '-がわ'],
    onyomiBn: ['সেন'],
    kunyomiBn: ['কাওয়া', 'গাওয়া'],
    strokeCount: 3,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'দুটি নদীর তীরের মাঝখান দিয়ে কুলকুল রবে পানির ধারা বয়ে চলেছে। তিনটি উল্লম্ব দাগ হলো নদীর দুই পাড় ও মাঝের পানির প্রবাহ।',
    visualOrigin: {
      realWorldObject: 'নদীর পানির স্রোতধারা ও দুই তীর',
      ancientFormDescription: 'বক্ররেখায় প্রবাহিত নদীর জলপ্রবাহ',
      transformationHint: 'সহজে লেখার জন্য তিনটি সমান্তরাল রেখা 川 হিসেবে রূপ পেয়েছে।',
      pictogramType: 'river'
    },
    examples: [
      { word: '川', reading: 'かわ (kawa)', readingBn: 'কাওয়া', meaningBn: 'নদী' },
      { word: '小川', reading: 'おがわ (ogawa)', readingBn: 'ওগাওয়া', meaningBn: 'ছোট নদী / নালা' },
      { word: 'ナイル川', reading: 'ないるがわ (nairugawa)', readingBn: 'নাইল-গাওয়া', meaningBn: 'নীলনদ' }
    ]
  },
  {
    id: 'kanji_n5_ricefield',
    character: '田',
    meaningBn: 'ধানক্ষেত / মাঠ',
    meaningEn: 'Rice Field / Paddy',
    onyomi: ['デン'],
    kunyomi: ['た'],
    onyomiBn: ['দেন'],
    kunyomiBn: ['তা'],
    strokeCount: 5,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'আকাশ থেকে ওপরের দিকে তাকালে দেখা যায় একটি বর্গাকার ধানের খেতকে আইল বা বাঁধ দিয়ে সমান ৪টি ভাগে ভাগ করা হয়েছে। এটি সরাসরি ধানের খেতের নকশা!',
    visualOrigin: {
      realWorldObject: '৪ ভাগে বিভক্ত ধানক্ষেত',
      ancientFormDescription: 'আইল দিয়ে চারটি ভাগে ভাগ করা একটি চতুর্ভুজ শস্যক্ষেত',
      transformationHint: 'চতুর্ভুজ ফ্রেম ও মাঝের ক্রস দিয়ে ৫ স্ট্রোকে 田 রচিত।',
      pictogramType: 'ricefield'
    },
    examples: [
      { word: '田んぼ', reading: 'たんぼ (tanbo)', readingBn: 'তানবো', meaningBn: 'ধানের খেত' },
      { word: '田中', reading: 'たなか (tanaka)', readingBn: 'তানাকা', meaningBn: 'তানাকা (জনপ্রিয় জাপানি পদবী)' },
      { word: '水田', reading: 'すいでん (suiden)', readingBn: 'সুইদেন', meaningBn: 'জলে ভরা ধানের খেত' }
    ]
  },
  {
    id: 'kanji_n5_rain',
    character: '雨',
    meaningBn: 'বৃষ্টি',
    meaningEn: 'Rain',
    onyomi: ['ウ'],
    kunyomi: ['あめ', 'あま-'],
    onyomiBn: ['উ'],
    kunyomiBn: ['আমে'],
    strokeCount: 8,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'আকাশের উপর একখণ্ড ঘন মেঘ বা ছাদ রয়েছে, আর তার নিচ দিয়ে বৃষ্টির ৪টি ফোঁটা চারদিকে টপটপ করে ঝরে পড়ছে। নিচের চারটি ছোট দাগ হলো বৃষ্টির ফোঁটা!',
    visualOrigin: {
      realWorldObject: 'মেঘ থেকে ঝরে পড়া বৃষ্টির ফোঁটা',
      ancientFormDescription: 'আকাশের নিচে মেঘ এবং তা থেকে ঝরে পড়া পানির কণা',
      transformationHint: 'উপরের ছাদটি মেঘ এবং ভেতরের ৪টি বিন্দু বৃষ্টির ফোঁটা হিসেবে স্থির হয়।',
      pictogramType: 'rain'
    },
    examples: [
      { word: '雨', reading: 'あめ (ame)', readingBn: 'আমে', meaningBn: 'বৃষ্টি' },
      { word: '大雨', reading: 'おおあめ (ooame)', readingBn: 'ওওআমে', meaningBn: 'ভারী বৃষ্টিপাত' },
      { word: '雨季', reading: 'うき (uki)', readingBn: 'উকি', meaningBn: 'বর্ষাকাল' }
    ]
  },
  {
    id: 'kanji_n5_heaven',
    character: '天',
    meaningBn: 'আকাশ / স্বর্গ',
    meaningEn: 'Heaven / Sky',
    onyomi: ['テン'],
    kunyomi: ['あまつ', 'あめ'],
    onyomiBn: ['তেন'],
    kunyomiBn: ['আমাতসু'],
    strokeCount: 4,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'একজন মানুষ (大) দুই হাত ও পা ছড়িয়ে দাঁড়িয়ে আছে, আর তার মাথার ঠিক উপরে বিস্তৃত সুবিশাল আকাশ (উপরের অতিরিক্ত রেখা)। মানুষের মাথার উপরেই অসীম আকাশ বা স্বর্গ!',
    visualOrigin: {
      realWorldObject: 'মানুষের মাথার উপরে বিস্তৃত আকাশ',
      ancientFormDescription: 'একজন মানুষের মাথার ওপরে একটি ছাতার মতো আকাশ রেখা',
      transformationHint: 'বড় মানুষের কাঞ্জি (大) এর মাথার ওপর বাড়তি একটি দাগ দিয়ে 天 হয়েছে।',
      pictogramType: 'above'
    },
    examples: [
      { word: '天気', reading: 'てんき (tenki)', readingBn: 'তেনকি', meaningBn: 'আবহাওয়া' },
      { word: '天ぷら', reading: 'てんぷら (tenpura)', readingBn: 'তেনপুরা', meaningBn: 'তেনপুরা (বিখ্যাত জাপানি খাবার)' },
      { word: '天国', reading: 'てんごく (tengoku)', readingBn: 'তেনগোকু', meaningBn: 'স্বর্গ / বেহেশত' }
    ]
  },
  {
    id: 'kanji_n5_spirit',
    character: '気',
    meaningBn: 'বাতাস / শক্তি / মেজাজ / অনুভূতি',
    meaningEn: 'Spirit / Energy / Air / Mood',
    onyomi: ['キ', 'ケ'],
    kunyomi: ['いき'],
    onyomiBn: ['কি'],
    kunyomiBn: ['ইকি'],
    strokeCount: 6,
    level: 'N5',
    category: 'nature',
    categoryBn: 'প্রকৃতি ও উপাদান',
    mnemonicStoryBn: 'পাতিল বা পাত্র থেকে বাষ্প বা গরম বাতাস কুণ্ডলী পাকিয়ে ওপরের দিকে উঠছে। এই অদৃশ্য বাষ্পীয় শক্তি বা প্রাণের সঞ্চারই হলো 気 (কি)।',
    visualOrigin: {
      realWorldObject: 'বাতাসে উড়া বাষ্প ও অদৃশ্য প্রাণশক্তি',
      ancientFormDescription: 'আকাশে ভাসমান মেঘের স্তর ও বাষ্পের ঘূর্ণি',
      transformationHint: 'বাষ্পের ঘূর্ণি রেখাটি ৬ স্ট্রোকে 気 হিসেবে সুবিন্যস্ত হয়েছে।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '元気', reading: 'げんき (genki)', readingBn: 'গেনকি', meaningBn: 'সুস্থ / প্রাণবন্ত' },
      { word: '気をつけて', reading: 'きをつけて (ki o tsukete)', readingBn: 'কি ও ৎসুকেতে', meaningBn: 'সাবধানে থাকুন' },
      { word: '気持ち', reading: 'きもち (kimochi)', readingBn: 'কিমোচি', meaningBn: 'অনুভূতি / মেজাজ' }
    ]
  },

  // ==========================================
  // 2. NUMBERS & QUANTITIES (সংখ্যা ও গণনা)
  // ==========================================
  {
    id: 'kanji_n5_one',
    character: '一',
    meaningBn: 'এক (১)',
    meaningEn: 'One (1)',
    onyomi: ['イチ', 'イツ'],
    kunyomi: ['ひと', 'ひと.つ'],
    onyomiBn: ['ইচি'],
    kunyomiBn: ['হিতো', 'হিতোৎসু'],
    strokeCount: 1,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'একটিমাত্র সোজা কাঠি বা একটি প্রসারিত তর্জনী আঙুল। বাম থেকে ডানে একটি রেখা টেনে সহজেই বোঝানো হয় "এক"।',
    visualOrigin: {
      realWorldObject: 'একটি আনুভূমিক কাঠি বা একটি আঙুল',
      ancientFormDescription: 'একটিমাত্র সরলরেখার দাগ',
      transformationHint: 'আদিকাল থেকেই একটি সরলরেখা 一 হিসেবে অপরিবর্তিত আছে।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '一つ', reading: 'ひとつ (hitotsu)', readingBn: 'হিতোৎসু', meaningBn: 'একটি (বস্তু গণনায়)' },
      { word: '一人', reading: 'ひとり (hitori)', readingBn: 'হিতোরি', meaningBn: 'একজন একা মানুষ' },
      { word: '一日', reading: 'ついたち (tsuitachi)', readingBn: 'ৎসুইতাচি', meaningBn: 'মাসের এক তারিখ' }
    ]
  },
  {
    id: 'kanji_n5_two',
    character: '二',
    meaningBn: 'দুই (২)',
    meaningEn: 'Two (2)',
    onyomi: ['ニ', 'ジ'],
    kunyomi: ['ふた', 'ふた.つ'],
    onyomiBn: ['নি'],
    kunyomiBn: ['ফুতা', 'ফুতাৎসু'],
    strokeCount: 2,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'পাশাপাশি রাখা দুটি সমান্তরাল কাঠি বা দুটি আঙুল। ওপরের কাঠিটি কিছুটা ছোট, নিচেরটি কিছুটা লম্বা ভিত্তি। দুটি রেখা মানে "দুই"।',
    visualOrigin: {
      realWorldObject: 'দুটি সমান্তরাল কাঠি',
      ancientFormDescription: 'পরপর দুটি আনুভূমিক রেখা',
      transformationHint: 'উপরের ছোট ও নিচের বড় রেখা দিয়ে 二 তৈরি হয়েছে।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '二つ', reading: 'ふたつ (futatsu)', readingBn: 'ফুতাৎসু', meaningBn: 'দুটি' },
      { word: '二人', reading: 'ふたり (futari)', readingBn: 'ফুতোরি', meaningBn: 'দুজন মানুষ' },
      { word: '二月', reading: 'にがつ (nigatsu)', readingBn: 'নিগাৎসু', meaningBn: 'ফেব্রুয়ারি মাস' }
    ]
  },
  {
    id: 'kanji_n5_three',
    character: '三',
    meaningBn: 'তিন (৩)',
    meaningEn: 'Three (3)',
    onyomi: ['サン', 'ゾウ'],
    kunyomi: ['み', 'み.つ', 'みっ.つ'],
    onyomiBn: ['সান'],
    kunyomiBn: ['মি', 'মিৎসু'],
    strokeCount: 3,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'তিনটি কাঠি পরপর সাজানো। ওপরের রেখা স্বর্গ, মাঝের রেখা মানুষ, নিচের রেখা পৃথিবী—এই তিন স্তরের মিলনেই সংখ্যা "তিন"।',
    visualOrigin: {
      realWorldObject: 'তিনটি অনুভূমিক কাঠি',
      ancientFormDescription: 'পরপর তিনটি অনুভূমিক সমান্তরাল দাগ',
      transformationHint: 'উপরেরটা মাঝারি, মাঝেরটা ছোট এবং নিচেরটা সবচেয়ে বড় রেখা দিয়ে 三 গঠিত।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '三つ', reading: 'みっつ (mittsu)', readingBn: 'মিৎসু', meaningBn: 'তিনটি' },
      { word: '三人', reading: 'さんにん (sannin)', readingBn: 'সাননিন', meaningBn: 'তিনজন মানুষ' },
      { word: '三日', reading: 'みっか (mikka)', readingBn: 'মিক্কা', meaningBn: 'তিন তারিখ / তিন দিন' }
    ]
  },
  {
    id: 'kanji_n5_four',
    character: '四',
    meaningBn: 'চার (৪)',
    meaningEn: 'Four (4)',
    onyomi: ['シ'],
    kunyomi: ['よ', 'よ.つ', 'よっ.つ', 'よん'],
    onyomiBn: ['শি'],
    kunyomiBn: ['ইয়ো', 'ইয়োন', 'ইয়োৎসু'],
    strokeCount: 5,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'চার দেয়ালের একটি ঘরের ভেতরে দুটি পর্দা ঝুলছে (ভেতরের বাঁকা দাগ)। চারটি কোণা বিশিষ্ট সুরক্ষিত বক্সই সংখ্যা "চার"।',
    visualOrigin: {
      realWorldObject: 'চার কোণা বিশিষ্ট ফ্রেমের ভেতর ঝুলন্ত পর্দা',
      ancientFormDescription: 'মুখের ভেতর থেকে নিঃশ্বাস বের হওয়ার চার রেখা, যা পরে চার কোণা বাক্সে রূপ নেয়',
      transformationHint: 'বাইরের বাক্স এবং ভেতরের দুটি বাঁকা স্ট্রোক দিয়ে 四 গঠিত।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '四つ', reading: 'よっつ (yottsu)', readingBn: 'ইয়োৎসু', meaningBn: 'চারটি' },
      { word: '四月', reading: 'しがつ (shigatsu)', readingBn: 'শিগাৎসু', meaningBn: 'এপ্রিল মাস' },
      { word: '四季', reading: 'しき (shiki)', readingBn: 'শিকি', meaningBn: 'চার ঋতু' }
    ]
  },
  {
    id: 'kanji_n5_five',
    character: '五',
    meaningBn: 'পাঁচ (৫)',
    meaningEn: 'Five (5)',
    onyomi: ['ゴ'],
    kunyomi: ['いつ', 'いつ.つ'],
    onyomiBn: ['গো'],
    kunyomiBn: ['ইৎসু', 'ইৎসুৎসু'],
    strokeCount: 4,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'একটি কাঠের সুতা জড়ানোর চরকা বা ক্রস-বার। হাতের ৫টি আঙুল দিয়ে যেমন চরকা ধরা হয়, সেই নকশা থেকেই 五 (পাঁচ)।',
    visualOrigin: {
      realWorldObject: 'সুতা কাটার চরকা বা গণনার ফ্রেম',
      ancientFormDescription: 'আকাশ ও মাটির রেখার মাঝে ক্রসিং রেখা (X)',
      transformationHint: 'পরবর্তীতে ক্রসিং রেখাটি আরও বক্সের রূপ নিয়ে ৪ স্ট্রোকের 五 হয়েছে।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '五つ', reading: 'いつつ (itsutsu)', readingBn: 'ইৎসুৎসু', meaningBn: 'পাঁচটি' },
      { word: '五月', reading: 'ごがつ (gogatsu)', readingBn: 'গোগাৎসু', meaningBn: 'মে মাস' },
      { word: '五円', reading: 'ごえん (goen)', readingBn: 'গো-য়েন', meaningBn: 'পাঁচ ইয়েন' }
    ]
  },
  {
    id: 'kanji_n5_six',
    character: '六',
    meaningBn: 'ছয় (৬)',
    meaningEn: 'Six (6)',
    onyomi: ['ロク', 'リク'],
    kunyomi: ['む', 'む.つ', 'むっ.つ', 'むい'],
    onyomiBn: ['রোকু'],
    kunyomiBn: ['মুৎসু', 'মুই'],
    strokeCount: 4,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'একটি ছোট্ট কুঁড়েঘরের ছাদ (উপরের টুপি) আর নিচে দুটি পায়া বা থাম। ঘরের ছাদ ও থাম মিলিয়ে সংখ্যা "ছয়"।',
    visualOrigin: {
      realWorldObject: 'ছোট কুঁড়েঘর বা তাবু',
      ancientFormDescription: 'একটি ছোট্ট তাবুর রূপরেখা',
      transformationHint: 'উপরের ডট ও আনুভূমিক দাগ ছাদ, নিচের দুই দাগ পায়া হিসেবে ৪ স্ট্রোকে 六।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '六つ', reading: 'むっつ (muttsu)', readingBn: 'মুৎসু', meaningBn: 'ছয়টি' },
      { word: '六月', reading: 'ろくがつ (rokugatsu)', readingBn: 'রোকুগাৎসু', meaningBn: 'জুন মাস' },
      { word: '六日', reading: 'むいか (muika)', readingBn: 'মুইকা', meaningBn: 'ছয় তারিখ' }
    ]
  },
  {
    id: 'kanji_n5_seven',
    character: '七',
    meaningBn: 'সাত (৭)',
    meaningEn: 'Seven (7)',
    onyomi: ['シチ'],
    kunyomi: ['なな', 'なな.つ', 'なの'],
    onyomiBn: ['শিচি'],
    kunyomiBn: ['নানা', 'নানাৎসু'],
    strokeCount: 2,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'উল্টো করে তাকালে ইংরেজি "7" (সাত) সংখ্যার মতো মনে হয়, যার পেট দিয়ে একটি আড়াআড়ি রেখা কাটা হয়েছে। এটি ২ স্ট্রোকের 七 (সাত)।',
    visualOrigin: {
      realWorldObject: 'ছুরির চেরাই করা কাঠি',
      ancientFormDescription: 'একটি রেখাকে আড়াআড়ি কেটে সাত ভাগে ভাগ করার প্রতীক',
      transformationHint: 'সহজ দুই স্ট্রোকে ইংরেজি ৭ এর মতো আকৃতিতে 七 রূপ ধারণ করে।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '七つ', reading: 'ななつ (nanatsu)', readingBn: 'নানাৎসু', meaningBn: 'সাতটি' },
      { word: '七月', reading: 'しちがつ (shichigatsu)', readingBn: 'শিচিগাৎসু', meaningBn: 'জুলাই মাস' },
      { word: '七日', reading: 'なのか (nanoka)', readingBn: 'নানোকা', meaningBn: 'সাত তারিখ' }
    ]
  },
  {
    id: 'kanji_n5_eight',
    character: '八',
    meaningBn: 'আট (৮)',
    meaningEn: 'Eight (8)',
    onyomi: ['ハチ'],
    kunyomi: ['や', 'や.つ', 'やっ.つ', 'よう'],
    onyomiBn: ['হাচি'],
    kunyomiBn: ['ইয়া', 'ইয়াৎসু'],
    strokeCount: 2,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'একটি বস্তু মাঝখান দিয়ে বিভক্ত হয়ে দুদিকে দুটি ডানার মতো ছড়িয়ে পড়েছে। জাপানি সংস্কৃতিতে এই নিচের দিকে চওড়া হওয়া রূপকে সমৃদ্ধির প্রতীক মনে করা হয়।',
    visualOrigin: {
      realWorldObject: 'দুটি বিপরীতমুখী রেখা বা ডানা',
      ancientFormDescription: 'বিভাজন বা সম্প্রসারণ বোঝাতে দুটি বাঁকা রেখা',
      transformationHint: 'বাম ও ডানে প্রসারিত দুটি সোজা স্ট্রোক দিয়ে 八 গঠিত।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '八つ', reading: 'やっつ (yattsu)', readingBn: 'ইয়াৎসু', meaningBn: 'আটটি' },
      { word: '八月', reading: 'はちがつ (hachigatsu)', readingBn: 'হাচিগাৎসু', meaningBn: 'আগস্ট মাস' },
      { word: '八日', reading: 'ようか (youka)', readingBn: 'ইয়োওকা', meaningBn: 'আট তারিখ' }
    ]
  },
  {
    id: 'kanji_n5_nine',
    character: '九',
    meaningBn: 'নয় (৯)',
    meaningEn: 'Nine (9)',
    onyomi: ['キュウ', 'ク'],
    kunyomi: ['ここの', 'ここの.つ'],
    onyomiBn: ['কিউ', 'কু'],
    kunyomiBn: ['কোকোনো', 'কোকোনোৎসু'],
    strokeCount: 2,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'একটি হাত বা কনুই বাঁকিয়ে সর্বোচ্চ শক্তি দিয়ে কোনো কিছু তোলার চেষ্টা করা হচ্ছে। একক সংখ্যার সর্বোচ্চ স্তর হলো "নয়" (九)।',
    visualOrigin: {
      realWorldObject: 'বাঁকানো কনুই বা বাহু',
      ancientFormDescription: 'একটি বাঁকানো বাহু বা শক্তির প্রতীক',
      transformationHint: 'একটি খাড়া বাঁক ও একটি হুকযুক্ত স্ট্রোক দিয়ে 九 রচিত।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '九つ', reading: 'ここのつ (kokonotsu)', readingBn: 'কোকোনোৎসু', meaningBn: 'নয়টি' },
      { word: '九月', reading: 'くがつ (kugatsu)', readingBn: 'কুস্মাৎসু', meaningBn: 'সেপ্টেম্বর মাস' },
      { word: '九州', reading: 'きゅうしゅう (kyuushuu)', readingBn: 'কিউশু', meaningBn: 'কিউশু (জাপানের দ্বীপ)' }
    ]
  },
  {
    id: 'kanji_n5_ten',
    character: '十',
    meaningBn: 'দশ (১০)',
    meaningEn: 'Ten (10)',
    onyomi: ['ジュウ', 'ジッ'],
    kunyomi: ['とお', 'と'],
    onyomiBn: ['জিউ'],
    kunyomiBn: ['তোও'],
    strokeCount: 2,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'একটি প্লাস (+) চিহ্নের মতো সহজ রূপ। দুই হাতের দশটি আঙুল একসঙ্গে জোড় করলে যেমন ক্রস তৈরি হয়, তেমনই পূর্ণাঙ্গ সংখ্যা "দশ" (十)।',
    visualOrigin: {
      realWorldObject: 'দুই হাতের দশ আঙুলের মিলনে ক্রস',
      ancientFormDescription: 'একটি উল্লম্ব সূচ যার কেন্দ্রে একটি গিঁট দেওয়া ছিল',
      transformationHint: 'পরবর্তীতে অনুভূমিক ও উল্লম্ব দাগের ক্রসে 十 রূপ নেয়।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '十', reading: 'とお (too) / じゅう (juu)', readingBn: 'তোও / জিউ', meaningBn: 'দশ' },
      { word: '十月', reading: 'じゅうがつ (juugatsu)', readingBn: 'জিউগাৎসু', meaningBn: 'অক্টোবর মাস' },
      { word: '十日', reading: 'とおか (tooka)', readingBn: 'তোওকা', meaningBn: 'দশ তারিখ' }
    ]
  },
  {
    id: 'kanji_n5_hundred',
    character: '百',
    meaningBn: 'একশত (১০০)',
    meaningEn: 'Hundred (100)',
    onyomi: ['ヒャク'],
    kunyomi: ['もも'],
    onyomiBn: ['হিয়াকু'],
    kunyomiBn: ['মোমো'],
    strokeCount: 6,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'সাদা কাঞ্জি (白) এর উপরে আরেকটি অতিরিক্ত দাগ (一) দেওয়া হয়েছে। ১০০ পর্যন্ত সাদা কাগজে পরিষ্কার হিসেব গণনা করে লেখা হয়েছে 百 (হিয়াকু)।',
    visualOrigin: {
      realWorldObject: 'একশত গণনার কাঠি বা বড় পরিমাপক',
      ancientFormDescription: 'একটি আঙ্গুলের উপর সংখ্যা নির্দেশক ডট',
      transformationHint: 'এক (一) এবং সাদা (白) যুক্ত হয়ে ১০০ এর কাঞ্জি 百 হয়েছে।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '百', reading: 'ひゃく (hyaku)', readingBn: 'হিয়াকু', meaningBn: 'একশত' },
      { word: '三百', reading: 'さんびゃく (sanbyaku)', readingBn: 'সানবিয়াকু', meaningBn: 'তিনশত' },
      { word: '百科事典', reading: 'ひゃっかじてん (hyakkajiten)', readingBn: 'হিয়াক্কা-জিতন', meaningBn: 'বিশ্বকোষ (Encyclopedia)' }
    ]
  },
  {
    id: 'kanji_n5_thousand',
    character: '千',
    meaningBn: 'একহাজার (১,০০০)',
    meaningEn: 'Thousand (1,000)',
    onyomi: ['セン'],
    kunyomi: ['ち'],
    onyomiBn: ['সেন'],
    kunyomiBn: ['চি'],
    strokeCount: 3,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'দশ কাঞ্জি (十) এর মাথার উপর একটি বাঁকা দাগ দিয়ে এক হাজার (১০০০) গুণ বৃদ্ধি করা হয়েছে। 十 এর সাথে ১ স্ট্রোক যোগে 千।',
    visualOrigin: {
      realWorldObject: 'হাঁটাহাঁটি করা একদল মানুষের সমষ্টি',
      ancientFormDescription: 'মানুষ (人) এর পায়ের দিকে অতিরিক্ত দাগ দিয়ে ১০০০ বোঝানো হতো',
      transformationHint: 'পরবর্তীতে 十 এর ওপর একটি তির্যক স্ট্রোক দিয়ে ৩ স্ট্রোকে 千 হয়েছে।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '千', reading: 'せん (sen)', readingBn: 'সেন', meaningBn: 'একহাজার' },
      { word: '三千', reading: 'さんぜん (sanzen)', readingBn: 'সানজেন', meaningBn: 'তিনহাজার' },
      { word: '千葉', reading: 'ちば (chiba)', readingBn: 'চিবা', meaningBn: 'চিবা প্রিফেকচার (জাপান)' }
    ]
  },
  {
    id: 'kanji_n5_tenthousand',
    character: '万',
    meaningBn: 'দশহাজার (১০,০০০) / অগণিত',
    meaningEn: 'Ten Thousand (10,000)',
    onyomi: ['マン', 'バン'],
    kunyomi: ['よろず'],
    onyomiBn: ['মান', 'বান'],
    kunyomiBn: ['ইয়োরোজু'],
    strokeCount: 3,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'জাপানে গণনার মূল ইউনিট হলো 万 (মান = ১০,০০০)। একটি বাক্স অর্ধেক খুলে যেন অফুরন্ত সম্পদ উপচে পড়ছে—অগণিত ধনসম্পদের প্রতীক 万।',
    visualOrigin: {
      realWorldObject: 'বিশাল দল বা কাঁকড়াবিছার অগণিত বংশধর',
      ancientFormDescription: 'অগণিত প্রাণীর প্রতীকী চিত্রলিপি',
      transformationHint: 'আধুনিক যুগে ৩টি পরিষ্কার স্ট্রোকে 万 হিসেবে সরল করা হয়েছে।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '一万', reading: 'いちまん (ichiman)', readingBn: 'ইচিমান', meaningBn: 'দশ হাজার' },
      { word: '万年筆', reading: 'まんねんひつ (mannenhitsu)', readingBn: 'মাননেনহিতসু', meaningBn: 'ঝর্ণা কলম (Fountain Pen)' },
      { word: '万歳', reading: 'ばんざい (banzai)', readingBn: 'বানজাই', meaningBn: 'জয়ধ্বনি / দীর্ঘজীবী হোক!' }
    ]
  },
  {
    id: 'kanji_n5_yen',
    character: '円',
    meaningBn: 'ইয়েন (জাপানি মুদ্রা) / বৃত্তাকার',
    meaningEn: 'Yen / Circle / Round',
    onyomi: ['エン'],
    kunyomi: ['まる.い'],
    onyomiBn: ['এন'],
    kunyomiBn: ['মারুই'],
    strokeCount: 4,
    level: 'N5',
    category: 'numbers',
    categoryBn: 'সংখ্যা ও গণনা',
    mnemonicStoryBn: 'একটি চারকোনা তোরণের ফ্রেমের মধ্যে মূল্যবান একটি মুদ্রা রাখা আছে। মুদ্রাগুলো বৃত্তাকার বা গোল হয় বলেই এর অর্থ গোল এবং জাপানি মুদ্রা ইয়েন (円)।',
    visualOrigin: {
      realWorldObject: 'গোলাকার মুদ্রা বা রূপালী চক্র',
      ancientFormDescription: 'একটি নিখুঁত বৃত্ত বা গোলাকার বস্তু',
      transformationHint: 'ব্রাশ দিয়ে লেখার সুবিধার জন্য বৃত্তাকার রূপটি ৪ স্ট্রোকের বাক্সে পরিণত হয়।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '百円', reading: 'ひゃくえん (hyakuen)', readingBn: 'হিয়াকু-এন', meaningBn: '১০০ ইয়েন' },
      { word: '円い', reading: 'まるい (marui)', readingBn: 'মারুই', meaningBn: 'গোলাকার' },
      { word: '円高', reading: 'えんだか (endaka)', readingBn: 'এনদাকা', meaningBn: 'ইয়েনের মূল্যবৃদ্ধি' }
    ]
  },

  // ==========================================
  // 3. PEOPLE, FAMILY & BODY (মানুষ, পরিবার ও শরীর)
  // ==========================================
  {
    id: 'kanji_n5_person',
    character: '人',
    meaningBn: 'মানুষ / ব্যক্তি',
    meaningEn: 'Person / Human',
    onyomi: ['ジン', 'ニン'],
    kunyomi: ['ひと'],
    onyomiBn: ['জিন', 'নিন'],
    kunyomiBn: ['হিতো'],
    strokeCount: 2,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'একজন মানুষ দুই পায়ে সোজা হয়ে সামনের দিকে হাঁটছে। দুটি রেখা একটি আরেকটির ওপর ভর করে দাঁড়িয়ে আছে—মানুষ যেমন পরস্পরের সহযোগিতায় বেঁচে থাকে!',
    visualOrigin: {
      realWorldObject: 'হাঁটন্ত একজন মানুষের দুই পা',
      ancientFormDescription: 'পাশ থেকে দেখা একজন অবনত বা পদব্রজে চলা মানুষের চিত্র',
      transformationHint: 'দুই পায়ের সরল দুটি স্ট্রোকে তৈরি হয়েছে 人।',
      pictogramType: 'person'
    },
    examples: [
      { word: '日本人', reading: 'にほんじん (nihonjin)', readingBn: 'নিহনজিন', meaningBn: 'জাপানি ব্যক্তি' },
      { word: '外国人', reading: 'がいこくじん (gaikokujin)', readingBn: 'গাইকোকুজিন', meaningBn: 'বিদেশি মানুষ' },
      { word: 'あの人', reading: 'あのひと (anohito)', readingBn: 'আনো হিতো', meaningBn: 'ঐ ব্যক্তি' }
    ]
  },
  {
    id: 'kanji_n5_child',
    character: '子',
    meaningBn: 'শিশু / সন্তান',
    meaningEn: 'Child',
    onyomi: ['シ', 'ス'],
    kunyomi: ['こ', '-こ'],
    onyomiBn: ['শি', 'সু'],
    kunyomiBn: ['কো'],
    strokeCount: 3,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'একটি ছোট্ট ফুটফুটে শিশু, যার মাথাটি উপরে এবং সে আনন্দের সাথে দুই হাত ডানে-বামে প্রসারিত করে আছে, আর নিচে কাঁথায় জড়ানো শরীর।',
    visualOrigin: {
      realWorldObject: 'দুই হাত ছড়িয়ে থাকা একটি শিশু',
      ancientFormDescription: 'বড় মাথার শিশু যার হাত দুটি ছড়ানো ও পা মোড়ানো',
      transformationHint: 'মাথা, প্রসারিত হাত এবং দেহের রেখা ৩ স্ট্রোকে 子 হিসেবে দাঁড়ায়।',
      pictogramType: 'child'
    },
    examples: [
      { word: '子ども', reading: 'こども (kodomo)', readingBn: 'কোদোমো', meaningBn: 'বাচ্চা / শিশু' },
      { word: '女の子', reading: 'おんなのこ (onnanoko)', readingBn: 'ওননাকো', meaningBn: 'ছোট মেয়ে' },
      { word: '男の子', reading: 'おとこのこ (otokonoko)', readingBn: 'ওতোকোনোকো', meaningBn: 'ছোট ছেলে' }
    ]
  },
  {
    id: 'kanji_n5_woman',
    character: '女',
    meaningBn: 'নারী / মহিলা',
    meaningEn: 'Woman / Female',
    onyomi: ['ジョ', 'ニョ'],
    kunyomi: ['おんな', 'め'],
    onyomiBn: ['জো'],
    kunyomiBn: ['ওন্না'],
    strokeCount: 3,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'একজন নারী শান্ত ও মার্জিত ভঙ্গিতে হাঁটু গেড়ে বসে হাত দুটো সামনে রেখেছেন। তার বসার পেলব রেখাচিত্র থেকেই 女 কাঞ্জিটির উৎপত্তি।',
    visualOrigin: {
      realWorldObject: 'ভদ্রভাবে হাঁটু গেড়ে বসা নারী',
      ancientFormDescription: 'বসা নারী যার হাত দুটি সামনে জড়ো করা',
      transformationHint: 'হাতে ও হাঁটুর বাঁক ৩টি মার্জিত স্ট্রোকে 女 রূপ লাভ করে।',
      pictogramType: 'woman'
    },
    examples: [
      { word: '女の人', reading: 'おんなのひと (onnanohito)', readingBn: 'ওন্না নো হিতো', meaningBn: 'মহিলা' },
      { word: '女性', reading: 'じょせい (josei)', readingBn: 'জোসেই', meaningBn: 'নারীজাতি' },
      { word: '彼女', reading: 'かのじょ (kanojo)', readingBn: 'কানোজো', meaningBn: 'সে (মেয়ে) / বান্ধবী' }
    ]
  },
  {
    id: 'kanji_n5_man',
    character: '男',
    meaningBn: 'পুরুষ / ছেলে',
    meaningEn: 'Man / Male',
    onyomi: ['ダン', 'ナン'],
    kunyomi: ['おとこ'],
    onyomiBn: ['দান', 'নান'],
    kunyomiBn: ['ওতোকো'],
    strokeCount: 7,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'উপরে ধানক্ষেত (田) এবং নিচে শারীরিক শক্তি বা বাহুর পেশি (力)। যে ধানক্ষেতে কঠোর পরিশ্রম ও পেশিবল দিয়ে কাজ করে, সে-ই হলো পুরুষ (男)!',
    visualOrigin: {
      realWorldObject: 'ধানের জমিতে শক্তি প্রয়োগকারী কৃষক',
      ancientFormDescription: 'ধানের খেতের ওপর লাঙ্গল বা হাতের পেশির শক্তি',
      transformationHint: '田 (ধানক্ষেত) + 力 (শক্তি) একত্রিত হয়ে ৭ স্ট্রোকে 男।',
      pictogramType: 'person'
    },
    examples: [
      { word: '男の人', reading: 'おとこのひと (otokonohito)', readingBn: 'ওতোকো নো হিতো', meaningBn: 'পুরুষ মানুষ' },
      { word: '男性', reading: 'だんせい (dansei)', readingBn: 'দানসেই', meaningBn: 'পুরুষ' },
      { word: '長男', reading: 'ちょうなん (chounan)', readingBn: 'চোওনান', meaningBn: 'বড় ছেলে' }
    ]
  },
  {
    id: 'kanji_n5_father',
    character: '父',
    meaningBn: 'বাবা / পিতা',
    meaningEn: 'Father',
    onyomi: ['フ'],
    kunyomi: ['ちち'],
    onyomiBn: ['ফু'],
    kunyomiBn: ['চিচি'],
    strokeCount: 4,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'হাতে একটি ভারী কুঠার বা লাঠি ধরে পরিবারের প্রধান বা পিতা দৃঢ় পদক্ষেপে দাঁড়িয়ে আছেন, যিনি পরিবারকে সকল বিপদ থেকে রক্ষা করেন।',
    visualOrigin: {
      realWorldObject: 'হাতে কুঠার বা কর্তৃত্বের দণ্ডধারী পিতা',
      ancientFormDescription: 'একটি হাত যা কাটার হাতিয়ার বা কুঠার শক্তভাবে ধরে আছে',
      transformationHint: 'হাতিয়ার ও হাতের রেখা ক্রসিং স্ট্রোকে ৪টি দাগের 父 তৈরি করেছে।',
      pictogramType: 'person'
    },
    examples: [
      { word: '父', reading: 'ちち (chichi)', readingBn: 'চিচি', meaningBn: 'আমার বাবা' },
      { word: 'お父さん', reading: 'おとうさん (otousan)', readingBn: 'ওতোওসান', meaningBn: 'সম্মানিত বাবা' },
      { word: '父親', reading: 'ちちおや (chichioya)', readingBn: 'চিচিওইয়া', meaningBn: 'পিতা' }
    ]
  },
  {
    id: 'kanji_n5_mother',
    character: '母',
    meaningBn: 'মা / মাতা',
    meaningEn: 'Mother',
    onyomi: ['ボ'],
    kunyomi: ['はは'],
    onyomiBn: ['বো'],
    kunyomiBn: ['হাহা'],
    strokeCount: 5,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'নারী (女) কাঞ্জির উন্নত রূপ। বুকে সন্তানকে জড়িয়ে ধরে দুধ পান করানোর জন্য দুটি বিন্দু (স্তন্যপান)। সন্তানের প্রতি মমতাময়ী স্নেহশীল জননীই 母।',
    visualOrigin: {
      realWorldObject: 'সন্তানকে কোলে নেওয়া স্নেহময়ী মা',
      ancientFormDescription: 'একজন মা যার বুকে স্তন ও স্নেহের প্রতীক হিসেবে দুটি ডট',
      transformationHint: '女 কাঠামোর ভেতরে দুটি স্নেহের বিন্দু দিয়ে ৫ স্ট্রোকে 母 রচিত।',
      pictogramType: 'woman'
    },
    examples: [
      { word: '母', reading: 'はは (haha)', readingBn: 'হাহা', meaningBn: 'আমার মা' },
      { word: 'お母さん', reading: 'おかあさん (okaasan)', readingBn: 'ওকাআসান', meaningBn: 'সম্মানিত মা' },
      { word: '母国', reading: 'ぼこく (bokoku)', readingBn: 'বোকোকু', meaningBn: 'মাতৃভূমি' }
    ]
  },
  {
    id: 'kanji_n5_eye',
    character: '目',
    meaningBn: 'চোখ',
    meaningEn: 'Eye',
    onyomi: ['モク', 'ボク'],
    kunyomi: ['め', '-め', 'ま-'],
    onyomiBn: ['মোকু'],
    kunyomiBn: ['মে'],
    strokeCount: 5,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'মানুষের চোখ দেখতে আনুভূমিক হলেও প্রাচীন লিপিতে উলম্বভাবে দাঁড় করিয়ে আঁকা হয়েছে। চোখের রূপরেখা ও ভেতরের দুটি দাগ হলো চোখের মণি ও পাতা।',
    visualOrigin: {
      realWorldObject: 'চোখের পাতা ও চোখের তারা বা মণি',
      ancientFormDescription: 'একটি টানা টানা চোখের স্কেচ যার কেন্দ্রে অক্ষিগোলক',
      transformationHint: 'চোখটি উলম্বভাবে ৯০ ডিগ্রি ঘুরিয়ে ৫ স্ট্রোকের বাক্সে 目 রূপ পায়।',
      pictogramType: 'eye'
    },
    examples: [
      { word: '目', reading: 'め (me)', readingBn: 'মে', meaningBn: 'চোখ' },
      { word: '目薬', reading: 'めぐすり (megusuri)', readingBn: 'মেগুসুরি', meaningBn: 'চোখের ড্রপ / ওষুধ' },
      { word: '一番目', reading: 'いちばんめ (ichibanme)', readingBn: 'ইচিবানমে', meaningBn: 'প্রথমতম' }
    ]
  },
  {
    id: 'kanji_n5_ear',
    character: '耳',
    meaningBn: 'কান',
    meaningEn: 'Ear',
    onyomi: ['ジ'],
    kunyomi: ['みみ'],
    onyomiBn: ['জি'],
    kunyomiBn: ['মিমি'],
    strokeCount: 6,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'মানুষের কানের বাইরের খাঁজ ও লতির ছবি। ওপরের সোজা দাগ ও নিচের লতি মিলে কান যা দিয়ে আমরা সব শব্দ শুনি।',
    visualOrigin: {
      realWorldObject: 'মানুষের কানের রূপরেখা ও কানের লতি',
      ancientFormDescription: 'কানের বাঁকানো ছাঁচ ও কানের ছিদ্র',
      transformationHint: 'কানের রূপরেখাটি ৬টি সোজা ও পরিষ্কার স্ট্রোকে 耳 তৈরি করে।',
      pictogramType: 'ear'
    },
    examples: [
      { word: '耳', reading: 'みみ (mimi)', readingBn: 'মিমি', meaningBn: 'কান' },
      { word: '初耳', reading: 'はつみみ (hatsumimi)', readingBn: 'হাৎসুমিমি', meaningBn: 'প্রথমবার শোনা কথা' }
    ]
  },
  {
    id: 'kanji_n5_mouth',
    character: '口',
    meaningBn: 'মুখ / প্রবেশপথ',
    meaningEn: 'Mouth / Opening',
    onyomi: ['コウ', 'ク'],
    kunyomi: ['くち'],
    onyomiBn: ['কোও', 'কু'],
    kunyomiBn: ['কুচি'],
    strokeCount: 3,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'কথা বলা বা খাওয়ার জন্য হাঁ করা একটি খোলা মুখ! সহজ একটি চারকোনা বাক্স দিয়ে মানুষের হাঁ-করা মুখ বোঝানো হয়।',
    visualOrigin: {
      realWorldObject: 'কথা বলার জন্য উন্মুক্ত মুখ',
      ancientFormDescription: 'একটি বাঁকানো হাঁ করা মুখের ফাঁক',
      transformationHint: '৩ স্ট্রোকে নিখুঁত একটি চৌকো বাক্সে 口 রূপান্তর ঘটে।',
      pictogramType: 'mouth'
    },
    examples: [
      { word: '口', reading: 'くち (kuchi)', readingBn: 'কুচি', meaningBn: 'মুখ' },
      { word: '入口', reading: 'いりぐち (iriguchi)', readingBn: 'ইরিগুচি', meaningBn: 'প্রবেশপথ' },
      { word: '出口', reading: 'でぐち (deguchi)', readingBn: 'দেগুচি', meaningBn: 'বহির্গমন পথ' }
    ]
  },
  {
    id: 'kanji_n5_hand',
    character: '手',
    meaningBn: 'হাত',
    meaningEn: 'Hand',
    onyomi: ['シュ', 'ズ'],
    kunyomi: ['て', 'て-'],
    onyomiBn: ['শু'],
    kunyomiBn: ['তে'],
    strokeCount: 4,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'হাতের তালু এবং আঙ্গুলের রেখা। ওপরের অনুভূমিক দাগগুলো আঙ্গুল এবং নিচের বাঁকানো দাগটি হাতের কব্জি ও বৃদ্ধাঙ্গুল।',
    visualOrigin: {
      realWorldObject: 'পাঁচটি আঙ্গুলসহ হাতের তালু',
      ancientFormDescription: 'ছড়ানো আঙ্গুলযুক্ত একটি খোলা হাতের রূপরেখা',
      transformationHint: 'আঙ্গুলগুলো অনুভূমিক স্ট্রোকে ও কব্জি বাঁকানো স্ট্রোকে ৪টি দাগের 手 হয়।',
      pictogramType: 'hand'
    },
    examples: [
      { word: '手', reading: 'て (te)', readingBn: 'তে', meaningBn: 'হাত' },
      { word: '上手', reading: 'じょうず (jouzu)', readingBn: 'জোওজু', meaningBn: 'দক্ষ / পারদর্শী' },
      { word: '下手', reading: 'へた (heta)', readingBn: 'হেতা', meaningBn: 'কাঁচা / অদক্ষ' }
    ]
  },
  {
    id: 'kanji_n5_foot',
    character: '足',
    meaningBn: 'পা / পর্যাপ্ত হওয়া',
    meaningEn: 'Foot / Leg / Sufficient',
    onyomi: ['ソク'],
    kunyomi: ['あし', 'た.りる'],
    onyomiBn: ['সোকু'],
    kunyomiBn: ['আশি', 'তারিরু'],
    strokeCount: 7,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'উপরে হাঁটুর ঢাকনি (口 আকৃতি) এবং নিচে মাটির ওপর দাঁড়ানো গোড়ালি ও পায়ের পাতা। এই পা (足) দিয়েই আমরা সর্বত্র বিচরণ করি।',
    visualOrigin: {
      realWorldObject: 'মানুষের হাঁটু, পায়ের নলি ও পাতা',
      ancientFormDescription: 'হাঁটু এবং নিচের দিকে বিস্তৃত পায়ের রূপ',
      transformationHint: 'উপরে চারকোনা হাঁটু এবং নিচে পায়ের স্টেপ দিয়ে ৭ স্ট্রোকে 足।',
      pictogramType: 'foot'
    },
    examples: [
      { word: '足', reading: 'あし (ashi)', readingBn: 'আশি', meaningBn: 'পা' },
      { word: '足りる', reading: 'たりる (tariru)', readingBn: 'তারিরু', meaningBn: 'যথেষ্ট বা পর্যাপ্ত হওয়া' },
      { word: '一足', reading: 'いっそく (issoku)', readingBn: 'ইস্‌সোকু', meaningBn: 'এক জোড়া (জুতো)' }
    ]
  },
  {
    id: 'kanji_n5_friend',
    character: '友',
    meaningBn: 'বন্ধু / সখা',
    meaningEn: 'Friend',
    onyomi: ['ユウ'],
    kunyomi: ['とも'],
    onyomiBn: ['ইউ'],
    kunyomiBn: ['তোমো'],
    strokeCount: 4,
    level: 'N5',
    category: 'people',
    categoryBn: 'মানুষ, পরিবার ও শরীর',
    mnemonicStoryBn: 'দুটি হাত পরস্পরের দিকে বাড়িয়ে হ্যান্ডশেক করছে বা একে অপরকে আলিঙ্গন করছে। বন্ধুত্বের বন্ধনে হাত মেলানোই হলো 友 (তোমোদাচি)।',
    visualOrigin: {
      realWorldObject: 'পরস্পরের দিকে বাড়িয়ে দেওয়া দুটি হাত',
      ancientFormDescription: 'একই দিকে প্রসারিত দুটি হাতের আলিঙ্গন',
      transformationHint: 'দুই হাতের সংযোগ রেখা ৪ স্ট্রোকে 友 রূপ ধারণ করেছে।',
      pictogramType: 'friend'
    },
    examples: [
      { word: '友達', reading: 'ともだち (tomodachi)', readingBn: 'তোমোদাচি', meaningBn: 'বন্ধু' },
      { word: '友人', reading: 'ゆうじん (yuujin)', readingBn: 'ইউজিন', meaningBn: 'ঘনিষ্ঠ বন্ধু' },
      { word: '友好', reading: 'ゆうこう (yuukou)', readingBn: 'ইউকোও', meaningBn: 'বন্ধুত্বপূর্ণ সম্পর্ক' }
    ]
  },

  // ==========================================
  // 4. DIRECTIONS, POSITIONS & TIME (দিক, অবস্থান ও সময়)
  // ==========================================
  {
    id: 'kanji_n5_above',
    character: '上',
    meaningBn: 'উপরে / উচ্চে',
    meaningEn: 'Above / Up / Over',
    onyomi: ['ジョウ', 'ショウ'],
    kunyomi: ['うえ', '-うえ', 'あ.がる'],
    onyomiBn: ['জোও'],
    kunyomiBn: ['উয়ে', 'আগারু'],
    strokeCount: 3,
    level: 'N5',
    category: 'directions',
    categoryBn: 'দিক, অবস্থান ও সময়',
    mnemonicStoryBn: 'নিচের লম্বা আনুভূমিক রেখাটি হলো ভূমি বা বেসলাইন। সেই বেসলাইনের ওপর একটি স্তম্ভ ও উপরের দিকে নির্দেশক চিহ্ন—যা সরাসরি বোঝায় "উপরে" (うえ)।',
    visualOrigin: {
      realWorldObject: 'ভূমির ওপর অবস্থিত নির্দেশক',
      ancientFormDescription: 'একটি বেসলাইনের উপরে একটি উলম্ব দাগ ও ছোট ডট',
      transformationHint: 'সহজ ৩ স্ট্রোকে নির্দেশকটি 上 হিসেবে চূড়ান্ত হয়।',
      pictogramType: 'above'
    },
    examples: [
      { word: '上', reading: 'うえ (ue)', readingBn: 'উয়ে', meaningBn: 'উপরে' },
      { word: '上手', reading: 'じょうず (jouzu)', readingBn: 'জোওজু', meaningBn: 'দক্ষ / পারদর্শী' },
      { word: '上がる', reading: 'あがる (agaru)', readingBn: 'আগারু', meaningBn: 'ওপরে ওঠা' }
    ]
  },
  {
    id: 'kanji_n5_below',
    character: '下',
    meaningBn: 'নিচে / তলে',
    meaningEn: 'Below / Down / Under',
    onyomi: ['カ', 'ゲ'],
    kunyomi: ['した', 'しも', 'さ.がる'],
    onyomiBn: ['কা', 'গে'],
    kunyomiBn: ['শিতা', 'সাগারু'],
    strokeCount: 3,
    level: 'N5',
    category: 'directions',
    categoryBn: 'দিক, অবস্থান ও সময়',
    mnemonicStoryBn: 'উপরের লম্বা রেখাটি হলো ছাদ বা বেসলাইন। সেই রেখার নিচ থেকে একটি দাগ নিচে নেমে ডানদিকে নির্দেশ করছে—যা সরাসরি বোঝায় "নিচে" (した)।',
    visualOrigin: {
      realWorldObject: 'ভূমির তলদেশে অবস্থিত নির্দেশক',
      ancientFormDescription: 'একটি অনুভূমিক রেখার নিচে ঝুলন্ত উলম্ব দাগ',
      transformationHint: 'উপরের বার ও নিচের ড্রপ ৩ স্ট্রোকে 下 রূপ লাভ করে।',
      pictogramType: 'below'
    },
    examples: [
      { word: '下', reading: 'した (shita)', readingBn: 'শিতা', meaningBn: 'নিচে' },
      { word: '地下鉄', reading: 'ちかてつ (chikatetsu)', readingBn: 'চিকাতেৎসু', meaningBn: 'পাতালরেল (Subway)' },
      { word: '下手', reading: 'へた (heta)', readingBn: 'হেতা', meaningBn: 'কাঁচা / অপটু' }
    ]
  },
  {
    id: 'kanji_n5_middle',
    character: '中',
    meaningBn: 'মাঝখানে / ভেতরে / চীন',
    meaningEn: 'Middle / Inside / Center',
    onyomi: ['チュウ'],
    kunyomi: ['なか'],
    onyomiBn: ['চিউ'],
    kunyomiBn: ['নাকা'],
    strokeCount: 4,
    level: 'N5',
    category: 'directions',
    categoryBn: 'দিক, অবস্থান ও সময়',
    mnemonicStoryBn: 'একটি চারকোনা বাক্সের ঠিক মাঝখান দিয়ে তীর বা কাঠি বিদ্ধ করা হয়েছে। কোনো লক্ষ্যের বা বাক্সের ঠিক "মাঝখানে" বোঝাতে 中 ব্যবহৃত হয়।',
    visualOrigin: {
      realWorldObject: 'একটি বাক্সের মধ্য দিয়ে বিদ্ধ দণ্ড',
      ancientFormDescription: 'একটি গোল বা চারকোনার ঠিক কেন্দ্র ভেদ করা খাড়া রেখা',
      transformationHint: 'চারকোনা ফ্রেমের কেন্দ্র ভেদ করা ৪ স্ট্রোকের রূপই 中।',
      pictogramType: 'middle'
    },
    examples: [
      { word: '中', reading: 'なか (naka)', readingBn: 'নাকা', meaningBn: 'ভেতরে / মধ্যে' },
      { word: '一日中', reading: 'いちにちじゅう (ichinichijuu)', readingBn: 'ইচিনিচিজু', meaningBn: 'সারাদিন ধরে' },
      { word: '中国', reading: 'ちゅうごく (chuugoku)', readingBn: 'চুগোকু', meaningBn: 'চীন দেশ' }
    ]
  },
  {
    id: 'kanji_n5_left',
    character: '左',
    meaningBn: 'বাম / বাঁদিক',
    meaningEn: 'Left',
    onyomi: ['サ'],
    kunyomi: ['ひだり'],
    onyomiBn: ['সা'],
    kunyomiBn: ['হিদারি'],
    strokeCount: 5,
    level: 'N5',
    category: 'directions',
    categoryBn: 'দিক, অবস্থান ও সময়',
    mnemonicStoryBn: 'একটি হাত (হাতের ক্রস) ধরে আছে ছুতারের মাপের স্কেল বা কাঠের কার্পেন্টার স্কয়ার (工)। বাম হাত দিয়ে স্কেল ধরে ডান হাত দিয়ে কাটা হতো।',
    visualOrigin: {
      realWorldObject: 'বাম হাতে ধরা মাপক স্কেল',
      ancientFormDescription: 'একটি হাত যা একটি কাজের যন্ত্র বা স্কেল ধরে আছে',
      transformationHint: 'হাতের স্ট্রোকের নিচে 工 (কাজ/যন্ত্র) বসে ৫ স্ট্রোকে 左।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '左', reading: 'ひだり (hidari)', readingBn: 'হিদারি', meaningBn: 'বামদিক' },
      { word: '左手', reading: 'ひだりて (hidarite)', readingBn: 'হিদারিতি', meaningBn: 'বাম হাত' },
      { word: '左右', reading: 'さゆう (sayuu)', readingBn: 'সায়ু', meaningBn: 'ডানে ও বাঁয়ে' }
    ]
  },
  {
    id: 'kanji_n5_right',
    character: '右',
    meaningBn: 'ডান / ডানদিক',
    meaningEn: 'Right',
    onyomi: ['ウ', 'ユウ'],
    kunyomi: ['みぎ'],
    onyomiBn: ['উ', 'ইউ'],
    kunyomiBn: ['মিগি'],
    strokeCount: 5,
    level: 'N5',
    category: 'directions',
    categoryBn: 'দিক, অবস্থান ও সময়',
    mnemonicStoryBn: 'হাত (হাতের ক্রস) যা খাবার তুলে মুখের (口) ভেতর দিচ্ছে! সাধারণত ডান হাত দিয়েই মুখে খাবার তোলা হয়, তাই হাত + মুখ = ডানদিক (右)।',
    visualOrigin: {
      realWorldObject: 'মুখে খাবার তোলার জন্য ব্যবহৃত ডান হাত',
      ancientFormDescription: 'একটি হাত যা মুখের দিকে পৌঁছে যাচ্ছে',
      transformationHint: 'হাতের ক্রস স্ট্রোকের নিচে মুখ (口) বসে ৫ স্ট্রোকে 右।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '右', reading: 'みぎ (migi)', readingBn: 'মিগি', meaningBn: 'ডানদিক' },
      { word: '右手', reading: 'みぎて (migite)', readingBn: 'মিগিতে', meaningBn: 'ডান হাত' },
      { word: '右側', reading: 'みぎがわ (migigawa)', readingBn: 'মিগিগাওয়া', meaningBn: 'ডানপাশ' }
    ]
  },
  {
    id: 'kanji_n5_front',
    character: '前',
    meaningBn: 'সামনে / পূর্বে / আগে',
    meaningEn: 'Front / Before',
    onyomi: ['ゼン'],
    kunyomi: ['まえ', '-まえ'],
    onyomiBn: ['জেন'],
    kunyomiBn: ['মায়ে'],
    strokeCount: 9,
    level: 'N5',
    category: 'directions',
    categoryBn: 'দিক, অবস্থান ও সময়',
    mnemonicStoryBn: 'সামনে চলার জন্য একটি নৌকা প্রস্তুত এবং সেখানে পদচিহ্ন রাখা হয়েছে। সময়ের দিক থেকে আগে বা শারীরিক অবস্থানে সামনে বোঝাতে 前।',
    visualOrigin: {
      realWorldObject: 'নৌকায় চড়ে সামনে এগিয়ে যাওয়া',
      ancientFormDescription: 'নৌকার ভেতর পা রেখে জল কেটে সামনের দিকে যাওয়া',
      transformationHint: 'উপরে মাংস/চন্দ্র ও নিচে ছুরি ও পদচিহ্নের সংমিশ্রণে ৯ স্ট্রোকে 前।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '前', reading: 'まえ (mae)', readingBn: 'মায়ে', meaningBn: 'সামনে / আগে' },
      { word: '午前', reading: 'ごぜん (gozen)', readingBn: 'গোজেন', meaningBn: 'সকাল (AM)' },
      { word: '名前', reading: 'なまえ (namae)', readingBn: 'নামায়ে', meaningBn: 'নাম' }
    ]
  },
  {
    id: 'kanji_n5_behind',
    character: '後',
    meaningBn: 'পেছনে / পরে',
    meaningEn: 'Behind / After / Later',
    onyomi: ['ゴ', 'コウ'],
    kunyomi: ['のち', 'うし.ろ', 'あと'],
    onyomiBn: ['গো', 'কোও'],
    kunyomiBn: ['উশিরো', 'আতো'],
    strokeCount: 9,
    level: 'N5',
    category: 'directions',
    categoryBn: 'দিক, অবস্থান ও সময়',
    mnemonicStoryBn: 'রাস্তায় হাঁটার সময় (বামপাশে রাস্তা 彳) পেছনে ছোট ছোট সুতায় পা বেঁধে কেউ যেন ধীরগতিতে পেছনে পড়ে থাকছে। পেছনে বা পরে বোঝাতে 後।',
    visualOrigin: {
      realWorldObject: 'পায়ে বাঁধন নিয়ে ধীরগতিতে পেছনে চলা ব্যক্তি',
      ancientFormDescription: 'রাস্তায় সুতার গিঁট নিয়ে ধীরে ধীরে হাঁটা',
      transformationHint: 'রাস্তা + সুতা + পা মিলে ৯ স্ট্রোকে 後 তৈরি হয়।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '後ろ', reading: 'うしろ (ushiro)', readingBn: 'উশিরো', meaningBn: 'পেছনে' },
      { word: '午後', reading: 'ごご (gogo)', readingBn: 'গোগো', meaningBn: 'দুপুর / বিকাল (PM)' },
      { word: '後で', reading: 'あとで (atode)', readingBn: 'আতোদে', meaningBn: 'পরে' }
    ]
  },
  {
    id: 'kanji_n5_now',
    character: '今',
    meaningBn: 'এখন / বর্তমান',
    meaningEn: 'Now / Present',
    onyomi: ['コン', 'キン'],
    kunyomi: ['いま'],
    onyomiBn: ['কোন', 'কিন'],
    kunyomiBn: ['ইমা'],
    strokeCount: 4,
    level: 'N5',
    category: 'directions',
    categoryBn: 'দিক, অবস্থান ও সময়',
    mnemonicStoryBn: 'একটি ত্রিভুজাকার ছাদ বর্তমান এই মুহূর্তটিকে চারপাশ থেকে আবদ্ধ করে রেখেছে। অতীত বা ভবিষ্যৎ নয়, ঠিক ছাদের নিচের মুহূর্তটিই হলো "এখন" (いま)।',
    visualOrigin: {
      realWorldObject: 'বর্তমান মুহূর্তকে আবৃত করে রাখা ছাদ',
      ancientFormDescription: 'একটি উল্টানো পাত্র বা ছাদ যা বর্তমানকে ধরে রেখেছে',
      transformationHint: 'ছাদ ও নিচের আবদ্ধ রেখা মিলে ৪ স্ট্রোকে 今 গঠিত।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '今', reading: 'いま (ima)', readingBn: 'ইমা', meaningBn: 'এখন' },
      { word: '今日', reading: 'きょう (kyou)', readingBn: 'ক্যোও', meaningBn: 'আজ' },
      { word: '今年', reading: 'ことし (kotoshi)', readingBn: 'কোতোশি', meaningBn: 'চলতি বছর' }
    ]
  },
  {
    id: 'kanji_n5_time',
    character: '時',
    meaningBn: 'সময় / ঘন্টা',
    meaningEn: 'Time / Hour',
    onyomi: ['ジ'],
    kunyomi: ['とき', '-どき'],
    onyomiBn: ['জি'],
    kunyomiBn: ['তোকি'],
    strokeCount: 10,
    level: 'N5',
    category: 'directions',
    categoryBn: 'দিক, অবস্থান ও সময়',
    mnemonicStoryBn: 'বামে সূর্য (日) এবং ডানে প্রার্থনার মন্দির (寺)। প্রাচীনকালে মন্দিরে সূর্যের আলো ও ছায়ার গতি দেখে সঠিক সময় ও ঘণ্টা নির্ধারণ করা হতো!',
    visualOrigin: {
      realWorldObject: 'মন্দিরের ওপর সূর্যের আলো দেখে তৈরি সূর্যঘড়ি',
      ancientFormDescription: 'সূর্য এবং পদচিহ্নযুক্ত মন্দির',
      transformationHint: '日 (সূর্য) + 寺 (মন্দির) মিলে ১০ স্ট্রোকে 時।',
      pictogramType: 'time'
    },
    examples: [
      { word: '時間', reading: 'じかん (jikan)', readingBn: 'জিকান', meaningBn: 'সময়' },
      { word: '何時', reading: 'なんじ (nanji)', readingBn: 'নানজি', meaningBn: 'কয়টা বাজে?' },
      { word: '時々', reading: 'ときどき (tokidoki)', readingBn: 'তোকিদোকি', meaningBn: 'মাঝে মাঝে' }
    ]
  },
  {
    id: 'kanji_n5_year',
    character: '年',
    meaningBn: 'বছর / বয়স',
    meaningEn: 'Year / Age',
    onyomi: ['ネン'],
    kunyomi: ['とし'],
    onyomiBn: ['নেন'],
    kunyomiBn: ['তোশি'],
    strokeCount: 6,
    level: 'N5',
    category: 'directions',
    categoryBn: 'দিক, অবস্থান ও সময়',
    mnemonicStoryBn: 'মাঠের পাকা সোনালী শস্য বা ফসলের আঁটি মাথায় করে ঘরে তোলা হচ্ছে। বছরে একবারই মূল ফসল কাটা হতো, তাই এক ফসলি চক্র মানে এক বছর (年)!',
    visualOrigin: {
      realWorldObject: 'বার্ষিক ধান-গম কাটার ফসল আঁটি',
      ancientFormDescription: 'মাথায় পাকা শস্যের বোঝা নিয়ে চলা মানুষ',
      transformationHint: 'ফসলের আঁটি ও মানুষের সমন্বয়ে ৬ স্ট্রোকে 年 তৈরি হয়।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '今年', reading: 'ことし (kotoshi)', readingBn: 'কোতোশি', meaningBn: 'এই বছর' },
      { word: '去年', reading: 'きょねん (kyonen)', readingBn: 'কিয়োনেন', meaningBn: 'গত বছর' },
      { word: '来年', reading: 'らいねん (rainen)', readingBn: 'রাইনেন', meaningBn: 'আগামী বছর' }
    ]
  },

  // ==========================================
  // 5. BASIC ACTIONS & VERBS (মৌলিক ক্রিয়া ও কাজ)
  // ==========================================
  {
    id: 'kanji_n5_see',
    character: '見',
    meaningBn: 'দেখা / তাকানো',
    meaningEn: 'See / Look',
    onyomi: ['ケン'],
    kunyomi: ['み.る', 'み.える', 'み.せる'],
    onyomiBn: ['কেন'],
    kunyomiBn: ['মিরু', 'মিয়েরু', 'মিশেরু'],
    strokeCount: 7,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'উপরে একটি বড় চোখ (目) এবং নিচে হাঁটার দুটি পা (儿)! দুটি পায়ে ভর করে দাঁড়িয়ে বড় বড় চোখ মেলে কোনো কিছু মন দিয়ে দেখা বা অবলোকন করা।',
    visualOrigin: {
      realWorldObject: 'পায়ে হেঁটে চোখ দিয়ে দৃশ্য দেখার ভঙ্গি',
      ancientFormDescription: 'একটি বড় চোখ ও তার নিচে দুটি মানব পা',
      transformationHint: '目 (চোখ) + 人 (পা) একত্রিত হয়ে ৭ স্ট্রোকে 見।',
      pictogramType: 'see'
    },
    examples: [
      { word: '見る', reading: 'みる (miru)', readingBn: 'মিরু', meaningBn: 'দেখা' },
      { word: '見せる', reading: 'みせる (miseru)', readingBn: 'মিশেরু', meaningBn: 'দেখানো' },
      { word: '意見', reading: 'いけん (iken)', readingBn: 'ইকেন', meaningBn: 'মতামত' }
    ]
  },
  {
    id: 'kanji_n5_go',
    character: '行',
    meaningBn: 'যাওয়া / পরিচালনা করা',
    meaningEn: 'Go / Conduct',
    onyomi: ['コウ', 'ギョウ', 'アン'],
    kunyomi: ['い.く', 'ゆ.く', 'おこな.う'],
    onyomiBn: ['কোও', 'গিওও'],
    kunyomiBn: ['ইকু', 'ওকোনোউ'],
    strokeCount: 6,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'একটি বড় চাররাস্তার মোড় বা ক্রসরোড (Crossroad)। মানুষ যে পথ ধরে নতুন গন্তব্যের দিকে "যায়", সেই সংযোগ সড়কই হলো 行 (ইকু)।',
    visualOrigin: {
      realWorldObject: 'চাররাস্তার মোড় বা প্রধান রাজপথ',
      ancientFormDescription: 'একটি বড় চৌরাস্তার মোড়ের নকশা',
      transformationHint: 'চৌরাস্তার দুই অংশ দুই ভাগে বিভক্ত হয়ে ৬ স্ট্রোকে 行 গঠিত।',
      pictogramType: 'road'
    },
    examples: [
      { word: '行く', reading: 'いく (iku)', readingBn: 'ইকু', meaningBn: 'যাওয়া' },
      { word: '銀行', reading: 'ぎんこう (ginkou)', readingBn: 'গিনকোও', meaningBn: 'ব্যাংক' },
      { word: '旅行', reading: 'りょこう (ryokou)', readingBn: 'রিয়োকোও', meaningBn: 'ভ্রমণ / ট্যুর' }
    ]
  },
  {
    id: 'kanji_n5_come',
    character: '来',
    meaningBn: 'আসা / আগমন',
    meaningEn: 'Come / Next',
    onyomi: ['ライ', 'タイ'],
    kunyomi: ['く.る', 'きた.る', 'き.たる'],
    onyomiBn: ['রাই'],
    kunyomiBn: ['কুরু', 'কিতারু'],
    strokeCount: 7,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'সুদূর মাঠ থেকে পাকা গমের শিষ বা ফসল উপহার নিয়ে একজন লোক বাড়ি ফিরে "আসছে"। দূর থেকে আসা কোনো কিছুর আগমনই 来 (কুরু)।',
    visualOrigin: {
      realWorldObject: 'দূর দেশ থেকে বয়ে আনা শস্য বা গম গাছ',
      ancientFormDescription: 'মাথা নোয়ানো গমের শিষ যা ফসল হয়ে আগমন করে',
      transformationHint: 'বৃক্ষ সদৃশ কাণ্ডে অতিরিক্ত রেখা যুক্ত হয়ে ৭ স্ট্রোকে 来।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '来る', reading: 'くる (kuru)', readingBn: 'কুরু', meaningBn: 'আসা' },
      { word: '来月', reading: 'らいげつ (raigetsu)', readingBn: 'রাইগেৎসু', meaningBn: 'আগামী মাস' },
      { word: '未来', reading: 'みらい (mirai)', readingBn: 'মিরাই', meaningBn: 'ভবিষ্যৎ' }
    ]
  },
  {
    id: 'kanji_n5_eat',
    character: '食',
    meaningBn: 'খাওয়া / খাদ্য',
    meaningEn: 'Eat / Food',
    onyomi: ['ショク', 'ジキ'],
    kunyomi: ['た.べる', 'く.う'],
    onyomiBn: ['শোকু'],
    kunyomiBn: ['তাবেলু'],
    strokeCount: 9,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'উপরে খাবারের বাটির ওপর ঢাকনা (ছাদ) এবং নিচে সুস্বাদু ও পুষ্টিকর খাবার রাখা আছে। ঢাকনা খুলে তৃপ্তি সহকারে খাবার খাওয়া (食べる)।',
    visualOrigin: {
      realWorldObject: 'ঢাকনা দেওয়া খাবারের পাত্র বা বাটি',
      ancientFormDescription: 'একটি সুগন্ধি পাত্রে সাজানো খাবার ও তার ঢাকনা',
      transformationHint: 'ছাদ ও খাদ্যপাত্রের সমন্বয়ে ৯ স্ট্রোকে 食 রূপ নিয়েছে।',
      pictogramType: 'eat'
    },
    examples: [
      { word: '食べる', reading: 'たべる (taberu)', readingBn: 'তাবেলু', meaningBn: 'খাওয়া' },
      { word: '食堂', reading: 'しょくどう (shokudou)', readingBn: 'শোকুদোও', meaningBn: 'খাবার ঘর / ক্যাফেটেরিয়া' },
      { word: '食べ物', reading: 'たべもの (tabemono)', readingBn: 'তাবেমোনো', meaningBn: 'খাদ্যদ্রব্য' }
    ]
  },
  {
    id: 'kanji_n5_drink',
    character: '飲',
    meaningBn: 'পান করা / পানীয়',
    meaningEn: 'Drink',
    onyomi: ['イン'],
    kunyomi: ['の.む'],
    onyomiBn: ['ইন'],
    kunyomiBn: ['নোমু'],
    strokeCount: 12,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'বামে খাবারের চিহ্ন (食) এবং ডানে একজন মানুষ হাঁ করে পেছনে হেলান দিয়ে ঢকঢক করে জল বা শরবত পান করছে। খাবার ও তৃষ্ণা মেটানোই 飲む।',
    visualOrigin: {
      realWorldObject: 'গলায় পাত্র তুলে পানি পান করা মানুষ',
      ancientFormDescription: 'খাদ্যের পাশে মুখ হাঁ করে তৃষ্ণা নিবারণ করা লোক',
      transformationHint: 'খাবার র্যাডিকাল + হাঁ করা রূপ ১২ স্ট্রোকে 飲।',
      pictogramType: 'drink'
    },
    examples: [
      { word: '飲む', reading: 'のむ (nomu)', readingBn: 'নোমু', meaningBn: 'পান করা' },
      { word: '飲み物', reading: 'のみもの (nomimono)', readingBn: 'নোমিমোনো', meaningBn: 'পানীয়' },
      { word: '飲食店', reading: 'いんしょくてん (inshokuten)', readingBn: 'ইনশোকুতেন', meaningBn: 'রেস্তোরাঁ' }
    ]
  },
  {
    id: 'kanji_n5_speak',
    character: '話',
    meaningBn: 'কথা বলা / গল্প / আলোচনা',
    meaningEn: 'Speak / Talk / Story',
    onyomi: ['ワ'],
    kunyomi: ['はな.す', 'はなし'],
    onyomiBn: ['ওয়া'],
    kunyomiBn: ['হানাসু', 'হানাসি'],
    strokeCount: 13,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'বামে মুখের ভাষা বা শব্দ (言) এবং ডানে মুখের ভেতর থাকা জিব বা জিহ্বা (舌)। জিব নাড়িয়ে মুখ দিয়ে সুন্দর ও মধুর বাণী উচ্চারণ করাই কথা বলা (話す)।',
    visualOrigin: {
      realWorldObject: 'জিহ্বা নেড়ে মুখ দিয়ে কথা বলা',
      ancientFormDescription: 'শব্দের রেখা এবং মুখ থেকে বের হওয়া জিহ্বা',
      transformationHint: '言 (কথা) + 舌 (জিহ্বা) মিলে ১৩ স্ট্রোকে 話।',
      pictogramType: 'talk'
    },
    examples: [
      { word: '話す', reading: 'はなす (hanasu)', readingBn: 'হানাসু', meaningBn: 'কথা বলা' },
      { word: '電話', reading: 'でんわ (denwa)', readingBn: 'দেনওয়া', meaningBn: 'টেলিফোন' },
      { word: '会話', reading: 'かいわ (kaiwa)', readingBn: 'কাইওয়া', meaningBn: 'কথোপকথন' }
    ]
  },
  {
    id: 'kanji_n5_read',
    character: '読',
    meaningBn: 'পড়া / পাঠ করা',
    meaningEn: 'Read',
    onyomi: ['ドク', 'トク'],
    kunyomi: ['よ.む'],
    onyomiBn: ['দোকু'],
    kunyomiBn: ['ইওমু'],
    strokeCount: 14,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'বামে শব্দ বা ভাষা (言) এবং ডানে তা অর্থপূর্ণভাবে বারবার উচ্চারণ ও বিশ্লেষণ করা। লিখিত শব্দগুলোকে দৃষ্টি ও কণ্ঠ দিয়ে উপলব্ধি করাই "পড়া" (読む)।',
    visualOrigin: {
      realWorldObject: 'লিখিত স্ক্রিপ্ট দেখে পাঠ করা পণ্ডিত',
      ancientFormDescription: 'শব্দের চিহ্নের পাশে মননশীল বিশ্লেষণের প্রতীক',
      transformationHint: '言 (শব্দ) এর সাথে পড়ার র্যাডিকাল যুক্ত হয়ে ১৪ স্ট্রোকে 読।',
      pictogramType: 'book'
    },
    examples: [
      { word: '読む', reading: 'よむ (yomu)', readingBn: 'ইওমু', meaningBn: 'পড়া' },
      { word: '読書', reading: 'どくしょ (dokusho)', readingBn: 'দোকুশো', meaningBn: 'বই পড়া' },
      { word: '読者', reading: 'どくしゃ (dokusha)', readingBn: 'দোকুশা', meaningBn: 'পাঠক' }
    ]
  },
  {
    id: 'kanji_n5_write',
    character: '書',
    meaningBn: 'লেখা / গ্রন্থ',
    meaningEn: 'Write / Book',
    onyomi: ['ショ'],
    kunyomi: ['か.く'],
    onyomiBn: ['শো'],
    kunyomiBn: ['কাকু'],
    strokeCount: 10,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'একটি হাত যত্ন করে ব্রাশ বা কলম ধরেছে (উপরের অংশ), এবং নিচের কালির পাত্র বা কাগজের ওপর সুন্দরভাবে বর্ণমালা লিখে চলেছে। হাত দিয়ে ব্রাশ চালানোই লেখা (書く)।',
    visualOrigin: {
      realWorldObject: 'কালির ব্রাশ দিয়ে কাঠে বা কাপড়ে লেখা',
      ancientFormDescription: 'একটি হাত যা একটি কলম ধরে কালির দোয়াতের ওপর লিখছে',
      transformationHint: 'ব্রাশের রূপরেখা ও নিচের কালির পাত্র মিলে ১০ স্ট্রোকে 書।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '書く', reading: 'かく (kaku)', readingBn: 'কাকু', meaningBn: 'লেখা' },
      { word: '辞書', reading: 'じしょ (jisho)', readingBn: 'জিশো', meaningBn: 'অভিধান (Dictionary)' },
      { word: '図書館', reading: 'としょかん (toshokan)', readingBn: 'তোশোকান', meaningBn: 'গ্রন্থাগার / লাইব্রেরি' }
    ]
  },
  {
    id: 'kanji_n5_hear',
    character: '聞',
    meaningBn: 'শোনা / প্রশ্ন করা',
    meaningEn: 'Hear / Listen / Ask',
    onyomi: ['ブン', 'モン'],
    kunyomi: ['き.く', 'き.こえる'],
    onyomiBn: ['বুন', 'মোন'],
    kunyomiBn: ['কিকু', 'কিকোয়েরু'],
    strokeCount: 14,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'বাইরে রয়েছে বিশাল একটি দরজা বা গেট (門), আর সেই দরজার খাঁজে কেউ কান (耳) লাগিয়ে মনোযোগ দিয়ে কথা শুনছে! দরজায় কান পাতাই 聞 (কিকু)।',
    visualOrigin: {
      realWorldObject: 'দরজার খাঁজে কান পেতে কথা শোনা',
      ancientFormDescription: 'একটি বড় গেট এবং তার ভেতরের অংশে একটি কান',
      transformationHint: '門 (গেট) এর ঠিক পেটের ভেতর 耳 (কান) বসে ১৪ স্ট্রোকে 聞।',
      pictogramType: 'ear'
    },
    examples: [
      { word: '聞く', reading: 'きく (kiku)', readingBn: 'কিকু', meaningBn: 'শোনা / জিজ্ঞাসা করা' },
      { word: '新聞', reading: 'しんぶん (shinbun)', readingBn: 'শিনবুন', meaningBn: 'সংবাদপত্র (নতুন যা শোনা যায়)' },
      { word: '聞こえる', reading: 'きこえる (kikoeru)', readingBn: 'কিকোয়েরু', meaningBn: 'শোনা যাওয়া' }
    ]
  },
  {
    id: 'kanji_n5_rest',
    character: '休',
    meaningBn: 'বিশ্রাম / ছুটি',
    meaningEn: 'Rest / Holiday',
    onyomi: ['キュウ'],
    kunyomi: ['やす.む', 'やす.まる', 'やす.める'],
    onyomiBn: ['কিউ'],
    kunyomiBn: ['ইয়াসুমু'],
    strokeCount: 6,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'বামে একজন ক্লান্ত মানুষ (亻) এবং ডানে একটি ছায়াশীতল গাছ (木)। মানুষটি গাছের গুঁড়িতে হেলান দিয়ে শান্তিতে বিশ্রাম নিচ্ছে—এটাই বিশ্রাম (休む)!',
    visualOrigin: {
      realWorldObject: 'গাছের ছায়ায় হেলান দিয়ে বিশ্রামরত পথিক',
      ancientFormDescription: 'একটি গাছের পাশে দাঁড়ানো ক্লান্ত মানুষ',
      transformationHint: '亻 (মানুষ) + 木 (গাছ) পাশাপাশি বসে ৬ স্ট্রোকে 休 তৈরি করে।',
      pictogramType: 'rest'
    },
    examples: [
      { word: '休む', reading: 'やすむ (yasumu)', readingBn: 'ইয়াসুমু', meaningBn: 'বিশ্রাম নেওয়া' },
      { word: '休み', reading: 'やすみ (yasumi)', readingBn: 'ইয়াসুমি', meaningBn: 'ছুটি / অবকাশ' },
      { word: '休日', reading: 'きゅうじつ (kyuujitsu)', readingBn: 'কিউজিৎসু', meaningBn: 'ছুটির দিন' }
    ]
  },
  {
    id: 'kanji_n5_stand',
    character: '立',
    meaningBn: 'দাঁড়ানো / প্রতিষ্ঠা করা',
    meaningEn: 'Stand / Establish',
    onyomi: ['リツ', 'リュウ'],
    kunyomi: ['た.つ', 'た.てる'],
    onyomiBn: ['রিৎসু'],
    kunyomiBn: ['তাৎসু', 'তাতেরু'],
    strokeCount: 5,
    level: 'N5',
    category: 'actions',
    categoryBn: 'মৌলিক ক্রিয়া ও কাজ',
    mnemonicStoryBn: 'নিচের লম্বা অনুভূমিক দাগটি মাটি বা মেঝে। একজন মানুষ মাটির ওপর দুই পা ছড়িয়ে দৃঢ়ভাবে মাথা উঁচু করে সোজা হয়ে দাঁড়িয়ে আছে।',
    visualOrigin: {
      realWorldObject: 'জমিনের ওপর দৃঢ় পায়ে দাঁড়িয়ে থাকা মানুষ',
      ancientFormDescription: 'মাটিতে দুই পা সোজা রেখে দাঁড়ানো মানুষের প্রতিকৃতি',
      transformationHint: 'মাথা, দুই বাহু ও মাটির রেখা ৫ স্ট্রোকে 立 হিসেবে পরিণত হয়।',
      pictogramType: 'stand'
    },
    examples: [
      { word: '立つ', reading: 'たつ (tatsu)', readingBn: 'তাৎসু', meaningBn: 'দাঁড়ানো' },
      { word: '役立つ', reading: 'やくだつ (yakudatsu)', readingBn: 'ইয়াকুদাৎসু', meaningBn: 'কাজে লাগা / উপযোগী হওয়া' },
      { word: '国立', reading: 'こくりつ (kokuritsu)', readingBn: 'কোকুরিৎসু', meaningBn: 'জাতীয় / সরকারি' }
    ]
  },

  // ==========================================
  // 6. SOCIETY, SCHOOL & EVERYDAY LIFE (সমাজ, স্কুল ও দৈনন্দিন জীবন)
  // ==========================================
  {
    id: 'kanji_n5_learn',
    character: '学',
    meaningBn: 'শেখা / বিদ্যা / বিজ্ঞান',
    meaningEn: 'Learn / Study / Science',
    onyomi: ['ガク'],
    kunyomi: ['まな.ぶ'],
    onyomiBn: ['গাকু'],
    kunyomiBn: ['মানাবু'],
    strokeCount: 8,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'একটি স্কুল বা পাঠশালার ছাদের নিচে (মাঝখানের ছাদ) উজ্জ্বল জ্ঞানের আলোকচ্ছটা জ্বলছে, আর তার নিচে একটি শিশু (子) একাগ্রচিত্তে পড়াশোনা করছে।',
    visualOrigin: {
      realWorldObject: 'স্কুলঘরের ছাদের নিচে অধ্যয়নরত শিশু',
      ancientFormDescription: 'দুই হাত দিয়ে ছাদের নিচে শিশুকে পাঠদানের চিত্র',
      transformationHint: 'জ্ঞানের স্ফুলিঙ্গ + ছাদ + 子 (শিশু) মিলে ৮ স্ট্রোকে 学।',
      pictogramType: 'child'
    },
    examples: [
      { word: '学生', reading: 'がくせい (gakusei)', readingBn: 'গাকুসেই', meaningBn: 'শিক্ষার্থী / ছাত্র' },
      { word: '学校', reading: 'がっこう (gakkou)', readingBn: 'গাক্কোও', meaningBn: 'বিদ্যালয় / স্কুল' },
      { word: '大学', reading: 'だいがく (daigaku)', readingBn: 'দাইগাকু', meaningBn: 'বিশ্ববিদ্যালয়' }
    ]
  },
  {
    id: 'kanji_n5_school',
    character: '校',
    meaningBn: 'বিদ্যালয় / স্কুল',
    meaningEn: 'School',
    onyomi: ['コウ'],
    kunyomi: [],
    onyomiBn: ['কোও'],
    kunyomiBn: [],
    strokeCount: 10,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'বামে কাঠ বা কাঠের তৈরি ভবন (木) এবং ডানে একে অপরের সাথে মেলামেশা (交)। কাঠের তৈরি এমন একটি স্থান যেখানে বহু মানুষ ও শিক্ষার্থী এসে মিলিত হয়, সেটিই স্কুল (校)।',
    visualOrigin: {
      realWorldObject: 'শিক্ষার্থীদের মিলনায়তনের কাঠের স্কুলভবন',
      ancientFormDescription: 'কাঠের ভবন যেখানে বহু ছাত্রের সম্মেলন ঘটে',
      transformationHint: '木 (কাঠ) + 交 (মিলিত হওয়া) মিলে ১০ স্ট্রোকে 校।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '学校', reading: 'がっこう (gakkou)', readingBn: 'গাক্কোও', meaningBn: 'বিদ্যালয়' },
      { word: '高校', reading: 'こうこう (koukou)', readingBn: 'কোওকোও', meaningBn: 'উচ্চ বিদ্যালয় (High School)' },
      { word: '校長', reading: 'こうちょう (kouchou)', readingBn: 'কোওচোও', meaningBn: 'প্রধান শিক্ষক / অধ্যক্ষ' }
    ]
  },
  {
    id: 'kanji_n5_ahead',
    character: '先',
    meaningBn: 'আগে / অগ্রবর্তী / পূর্ববর্তী',
    meaningEn: 'Before / Ahead / Previous',
    onyomi: ['セン'],
    kunyomi: ['さき', 'ま.ず'],
    onyomiBn: ['সেন'],
    kunyomiBn: ['সাকি'],
    strokeCount: 6,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'একজন মানুষ অন্যদের চেয়ে এক কদম সামনে পা বাড়িয়ে এগিয়ে যাচ্ছে। যে ব্যক্তি বয়সে বা অভিজ্ঞতায় আমাদের আগে পথ দেখান, তিনিই অগ্রণী বা শিক্ষক (先生)।',
    visualOrigin: {
      realWorldObject: 'অন্যদের আগে কদম ফেলে এগিয়ে চলা ব্যক্তি',
      ancientFormDescription: 'এক জোড়া পা যা মাটির ওপর আগেভাগে চলছে',
      transformationHint: 'অগ্রবর্তী পদচিহ্নের স্কেচ ৬ স্ট্রোকে 先 রূপ ধারণ করে।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '先生', reading: 'せんせい (sensei)', readingBn: 'সেনসেই', meaningBn: 'শিক্ষক / গুরু' },
      { word: 'お先に', reading: 'おさきに (osakini)', readingBn: 'ওসাকিনি', meaningBn: 'আমি আগে যাই / বিদায়' },
      { word: '先月', reading: 'せんげつ (sengetsu)', readingBn: 'সেনগেৎসু', meaningBn: 'গত মাস' }
    ]
  },
  {
    id: 'kanji_n5_life',
    character: '生',
    meaningBn: 'জীবন / জন্ম / ছাত্র / কাঁচা',
    meaningEn: 'Life / Birth / Raw / Student',
    onyomi: ['セイ', 'ショウ'],
    kunyomi: ['い.きる', 'う.まれる', 'なま'],
    onyomiBn: ['সেই', 'শোও'],
    kunyomiBn: ['ইকিরু', 'উমারেলু', 'নামা'],
    strokeCount: 5,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'বসন্তকালে উর্বর মাটি ভেদ করে একটি কচি সবুজ চারাগাছ নতুন পাতা মেলে মাথা তুলেছে। নতুন প্রাণের স্পন্দন ও সতেজ জীবনই 生 (সেই/ইকিরু)।',
    visualOrigin: {
      realWorldObject: 'মাটি ফুঁড়ে ওঠা কচি চারাগাছের অঙ্কুর',
      ancientFormDescription: 'মাটি থেকে গজানো ছোট গাছের ডালপালা',
      transformationHint: 'চারাগাছের কাণ্ড ও পাতা ৫ স্ট্রোকে 生 হিসেবে সুবিন্যস্ত।',
      pictogramType: 'tree'
    },
    examples: [
      { word: '生きる', reading: 'いきる (ikiru)', readingBn: 'ইকিরু', meaningBn: 'বেঁচে থাকা' },
      { word: '生まれる', reading: 'うまれる (umareru)', readingBn: 'উমারেলু', meaningBn: 'জন্মগ্রহণ করা' },
      { word: '生ビール', reading: 'なまびーる (namabiiru)', readingBn: 'নামা বিয়ারু', meaningBn: 'ড্রাফট বিয়ার / টাটকা' }
    ]
  },
  {
    id: 'kanji_n5_book',
    character: '本',
    meaningBn: 'বই / মূল / ভিত্তি / প্রধান',
    meaningEn: 'Book / Origin / Base',
    onyomi: ['ホン'],
    kunyomi: ['もと'],
    onyomiBn: ['হন'],
    kunyomiBn: ['মোতো'],
    strokeCount: 5,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'গাছ (木) কাঞ্জির ঠিক গোড়ায় বা শিকড়ে একটি অনুভূমিক লাল দাগ দিয়ে চিহ্নিত করা হয়েছে—যা গাছের "মূল" বা "ভিত্তি"। জ্ঞানের মূল ভিত্তি হলো বই (本)!',
    visualOrigin: {
      realWorldObject: 'গাছের গোড়ায় বা শিকড়ে দেওয়া চিহ্ন',
      ancientFormDescription: 'একটি গাছের গোড়ায় চিহ্নিত ভিত্তিপ্রস্তর',
      transformationHint: '木 (গাছ) এর নিচে একটি অনুভূমিক রেখা দিয়ে ৫ স্ট্রোকে 本।',
      pictogramType: 'book'
    },
    examples: [
      { word: '本', reading: 'ほん (hon)', readingBn: 'হন', meaningBn: 'বই' },
      { word: '日本', reading: 'にほん (nihon)', readingBn: 'নিহন', meaningBn: 'জাপান (সূর্যের উৎস)' },
      { word: '本当に', reading: 'ほんとうに (hontouni)', readingBn: 'হোনতোওনি', meaningBn: 'সত্যিই / প্রকৃতপক্ষে' }
    ]
  },
  {
    id: 'kanji_n5_country',
    character: '国',
    meaningBn: 'দেশ / রাষ্ট্র / জন্মভূমি',
    meaningEn: 'Country / Nation',
    onyomi: ['コク'],
    kunyomi: ['くに'],
    onyomiBn: ['কোকু'],
    kunyomiBn: ['কুনি'],
    strokeCount: 8,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'বাইরে চারপাশের শক্তিশালী সীমানা প্রাচীর বা সীমান্ত (囗), আর তার সুরক্ষিত অভ্যন্তরে একটি মহামূল্যবান জেড রত্ন বা রাজা (玉)। সুরক্ষিত রাজত্বই হলো দেশ (国)!',
    visualOrigin: {
      realWorldObject: 'সীমান্তের প্রাচীর দিয়ে ঘেরা রাজ্য ও তার মহামূল্য রত্ন',
      ancientFormDescription: 'সুরক্ষিত প্রাচীর দ্বারা সুরক্ষিত মূল্যবান ধনরত্ন',
      transformationHint: 'বাইরের চারকোনা সীমানা ও ভেতরের 玉 মিলে ৮ স্ট্রোকে 国।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '国', reading: 'くに (kuni)', readingBn: 'কুনি', meaningBn: 'দেশ' },
      { word: '外国', reading: 'がいこく (gaikoku)', readingBn: 'গাইকোকু', meaningBn: 'বিদেশ' },
      { word: '外国人', reading: 'がいこくじん (gaikokujin)', readingBn: 'গাইকোকুজিন', meaningBn: 'বিদেশি নাগরিক' }
    ]
  },
  {
    id: 'kanji_n5_road',
    character: '道',
    meaningBn: 'পথ / রাস্তা / আদর্শ',
    meaningEn: 'Road / Path / Way',
    onyomi: ['ドウ', 'トウ'],
    kunyomi: ['みち'],
    onyomiBn: ['দোও'],
    kunyomiBn: ['মিচি'],
    strokeCount: 12,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'একজন মানুষ মাথা (首) উঁচু করে সামনের পথ দিয়ে (辶 - হাঁটার পথ) হেঁটে চলেছে। মানুষ যে পথ ধরে গন্তব্যে যায়, সেই সুগম পথই হলো 道 (মিচি)।',
    visualOrigin: {
      realWorldObject: 'রাস্তা ধরে সামনে হেঁটে চলা পথিক',
      ancientFormDescription: 'একটি পথ এবং তার ওপর পথিকের মাথা ও পা',
      transformationHint: '首 (মাথা) এবং 辶 (পথ চলা) মিলে ১২ স্ট্রোকে 道।',
      pictogramType: 'road'
    },
    examples: [
      { word: '道', reading: 'みち (michi)', readingBn: 'মিচি', meaningBn: 'রাস্তা / পথ' },
      { word: '北海道', reading: 'ほっかいどう (hokkaidou)', readingBn: 'হোক্কাইদোও', meaningBn: 'হোক্কাইডো প্রিফেকচার' },
      { word: '柔道', reading: 'じゅうどう (juudou)', readingBn: 'জিউদোও', meaningBn: 'জুডো (জাপানি মার্শাল আর্ট)' }
    ]
  },
  {
    id: 'kanji_n5_shop',
    character: '店',
    meaningBn: 'দোকান / বিপণি',
    meaningEn: 'Shop / Store',
    onyomi: ['テン'],
    kunyomi: ['みせ', 'たな'],
    onyomiBn: ['তেন'],
    kunyomiBn: ['মিশে'],
    strokeCount: 8,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'একটি ছাউনি দেওয়া ঘরের নিচে (广) জিনিসপত্রের পসরা সাজিয়ে হিসাব-নিকাশ করে বিক্রি করা হচ্ছে। ক্রেতা-বিক্রেতার কেনাকাটার ছাউনিই হলো দোকান (店)।',
    visualOrigin: {
      realWorldObject: 'ছাউনি বা চালের নিচে সাজানো পণ্যের দোকান',
      ancientFormDescription: 'একটি চালাঘরের নিচে মালামাল রাখার স্থান',
      transformationHint: 'ছাউনি র্যাডিকাল ও ভেতরের অংশ মিলে ৮ স্ট্রোকে 店।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '店', reading: 'みせ (mise)', readingBn: 'মিশে', meaningBn: 'দোকান' },
      { word: '店員', reading: 'てんいん (tenin)', readingBn: 'তেনইন', meaningBn: 'দোকানকর্মী / সেলসম্যান' },
      { word: '売店', reading: 'ばいてん (baiten)', readingBn: 'বাইতেন', meaningBn: 'স্টল / কিয়স্ক' }
    ]
  },
  {
    id: 'kanji_n5_car',
    character: '車',
    meaningBn: 'গাড়ি / চাকা / যানবাহন',
    meaningEn: 'Car / Vehicle / Wheel',
    onyomi: ['シャ'],
    kunyomi: ['くるま'],
    onyomiBn: ['শা'],
    kunyomiBn: ['কুরুমা'],
    strokeCount: 7,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'উপর থেকে দেখা প্রাচীন দ্বিচক্র রথ বা ঘোড়ার গাড়ি! মাঝখানে বসার আসন বা কুঠুরি এবং উপরে-নিচে দুটি বিশাল চাকা একটি অ্যাক্সেল দিয়ে যুক্ত।',
    visualOrigin: {
      realWorldObject: 'উপর থেকে দেখা দুই চাকার প্রাচীন রথ',
      ancientFormDescription: 'একটি চাকার গাড়ির পাখির চোখ দিয়ে দেখা ভিউ',
      transformationHint: 'চাকা ও বসার অংশ ৭ স্ট্রোকে 车/車 হিসেবে স্থায়ী হয়।',
      pictogramType: 'car'
    },
    examples: [
      { word: '車', reading: 'くるま (kuruma)', readingBn: 'কুরুমা', meaningBn: 'গাড়ি' },
      { word: '電車', reading: 'でんしゃ (densha)', readingBn: 'দেনশা', meaningBn: 'বৈদ্যুতিক ট্রেন' },
      { word: '自転車', reading: 'じてんしゃ (jitensha)', readingBn: 'জিতনশা', meaningBn: 'সাইকেল' }
    ]
  },
  {
    id: 'kanji_n5_gate',
    character: '門',
    meaningBn: 'দরজা / গেট / তোরণ',
    meaningEn: 'Gate',
    onyomi: ['モン'],
    kunyomi: ['かど', 'と'],
    onyomiBn: ['মোন'],
    kunyomiBn: ['কাদো'],
    strokeCount: 8,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'পশ্চিমা স্যালুনের মতো দুই পাল্লার একটি বিশাল কাঠের গেট বা দুর্গতোরণ। বামে একটি পাল্লা ও ডানে আরেকটি পাল্লা—মাঝখান দিয়ে প্রবেশ করা যায়।',
    visualOrigin: {
      realWorldObject: 'দুই পাল্লা বিশিষ্ট বিশাল কাঠের প্রবেশদ্বার',
      ancientFormDescription: 'দুটি কব্জা লাগানো কাঠের দরজার পাল্লা',
      transformationHint: 'দুই পাল্লার সমান্তরাল ফ্রেম ৮ স্ট্রোকে 門 গঠন করে।',
      pictogramType: 'gate'
    },
    examples: [
      { word: '門', reading: 'もん (mon)', readingBn: 'মোন', meaningBn: 'গেট / তোরণ' },
      { word: '正門', reading: 'せいもん (seimon)', readingBn: 'সেইমোন', meaningBn: 'প্রধান ফটক' },
      { word: '専門', reading: 'せんもん (senmon)', readingBn: 'সেনমোন', meaningBn: 'বিশেষত্ব (Specialty)' }
    ]
  },
  {
    id: 'kanji_n5_fish',
    character: '魚',
    meaningBn: 'মাছ',
    meaningEn: 'Fish',
    onyomi: ['ギョ'],
    kunyomi: ['うお', 'さかな', '-ざかな'],
    onyomiBn: ['গিও'],
    kunyomiBn: ['সাকানা'],
    strokeCount: 11,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'উপরে মাছের চোখ ও মুখ (মাথা), মাঝখানে আঁশযুক্ত দেহ (田 আকৃতির পট্টি), আর নিচে পানিতে সাঁতার কাটার জন্য চারটি ছোট পাখনা ও লেজ (৪টি ডট)!',
    visualOrigin: {
      realWorldObject: 'মাথা, আঁশযুক্ত পেট ও পাখনাওয়ালা জলজ মাছ',
      ancientFormDescription: 'একটি জ্যান্ত মাছ যার আঁশ ও লেজের রূপ স্পষ্ট',
      transformationHint: 'মাথা, পেট ও নিচের ৪টি পাখনার ডট মিলে ১১ স্ট্রোকে 魚।',
      pictogramType: 'fish'
    },
    examples: [
      { word: '魚', reading: 'さかな (sakana)', readingBn: 'সাকানা', meaningBn: 'মাছ' },
      { word: '金魚', reading: 'きんぎょ (kingyo)', readingBn: 'কিনগিও', meaningBn: 'গোল্ডফিশ (সোনালী মাছ)' },
      { word: '魚屋', reading: 'さかなや (sakanaya)', readingBn: 'সাকানায়া', meaningBn: 'মাছের দোকান' }
    ]
  },
  {
    id: 'kanji_n5_big',
    character: '大',
    meaningBn: 'বড় / বিশাল',
    meaningEn: 'Big / Large',
    onyomi: ['ダイ', 'タイ'],
    kunyomi: ['おお-', 'おお.きい', '-おお.いに'],
    onyomiBn: ['দাই', 'তাই'],
    kunyomiBn: ['ওওকিই'],
    strokeCount: 3,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'একজন মানুষ নিজের দুই হাত দুপাশে যতদূর সম্ভব ছড়িয়ে এবং দুই পা চওড়া করে দাঁড়িয়ে নিজেকে যথাসম্ভব "বিশাল বা বড়" দেখাচ্ছে! এটাই 大 (ওওকিই)।',
    visualOrigin: {
      realWorldObject: 'দুই হাত ও পা মেলে দাঁড়িয়ে থাকা বিশাল মানুষ',
      ancientFormDescription: 'হাত ও পা পুরো মেলে রাখা মানুষের অবয়ব',
      transformationHint: 'মানুষের দুই হাত প্রসারিত রূপ ৩ স্ট্রোকে 大 হিসেবে পরিচিত।',
      pictogramType: 'big'
    },
    examples: [
      { word: '大きい', reading: 'おおきい (ookii)', readingBn: 'ওওকিই', meaningBn: 'বড়' },
      { word: '大人', reading: 'おとな (otona)', readingBn: 'ওতোনা', meaningBn: 'প্রাপ্তবয়স্ক / বড় মানুষ' },
      { word: '大学', reading: 'だいがく (daigaku)', readingBn: 'দাইগাকু', meaningBn: 'বিশ্ববিদ্যালয়' }
    ]
  },
  {
    id: 'kanji_n5_small',
    character: '小',
    meaningBn: 'ছোট / ক্ষুদ্র',
    meaningEn: 'Small / Little',
    onyomi: ['ショウ'],
    kunyomi: ['ちい.さい', 'こ-', 'お-'],
    onyomiBn: ['শোও'],
    kunyomiBn: ['চিইসাই'],
    strokeCount: 3,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'মাঝখানের একটি বস্তুকে দুই পাশ থেকে কেটে ছোট দুটি টুকরায় আলাদা করা হচ্ছে। বড় কিছুকে ভেঙে ক্ষুদ্র বা ছোট করার রূপই 小 (চিইসাই)।',
    visualOrigin: {
      realWorldObject: 'ছোট ছোট দানা বা ক্ষুদ্র কণা',
      ancientFormDescription: 'তিনটি ছোট বিন্দুর সমষ্টি',
      transformationHint: 'মাঝের উল্লম্ব হুক ও দুপাশের দুটি ছোট ডট মিলে ৩ স্ট্রোকে 小।',
      pictogramType: 'small'
    },
    examples: [
      { word: '小さい', reading: 'ちいさい (chiisai)', readingBn: 'চিইসাই', meaningBn: 'ছোট' },
      { word: '小川', reading: 'おがわ (ogawa)', readingBn: 'ওগাওয়া', meaningBn: 'ছোট নদী' },
      { word: '小学校', reading: 'しょうがっこう (shougakkou)', readingBn: 'শোওগাক্কোও', meaningBn: 'প্রাথমিক বিদ্যালয়' }
    ]
  },
  {
    id: 'kanji_n5_white',
    character: '白',
    meaningBn: 'সাদা / শুভ্র',
    meaningEn: 'White',
    onyomi: ['ハク', 'ビャク'],
    kunyomi: ['しろ', 'しら-', 'しろ.い'],
    onyomiBn: ['হাকু'],
    kunyomiBn: ['শিরো', 'শিরোই'],
    strokeCount: 5,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'সূর্য (日) এর চূড়া থেকে এক ঝলক তীব্র সাদা আলোর রশ্মি (উপরের ডট) বিচ্ছুরিত হচ্ছে। উজ্জ্বল আলোর স্নিগ্ধ রং হলো সাদা (白)।',
    visualOrigin: {
      realWorldObject: 'সূর্য থেকে নির্গত তীব্র শুভ্র আলোকচ্ছটা বা চালের দানা',
      ancientFormDescription: 'সূর্যের ওপর এক ঝলক শুভ্র আলোর ডট',
      transformationHint: 'সূর্য (日) কাঠামোর চূড়ায় একটি আলোর স্ট্রোক দিয়ে ৫ স্ট্রোকে 白।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '白い', reading: 'しろい (shiroi)', readingBn: 'শিরোই', meaningBn: 'সাদা' },
      { word: '白鳥', reading: 'はくちょう (hakuchou)', readingBn: 'হাকুচোও', meaningBn: 'রাজহাঁস (সাদা পাখি)' },
      { word: '面白い', reading: 'おもしろい (omoshiroi)', readingBn: 'ওমোশিরোই', meaningBn: 'মজার / আকর্ষণীয়' }
    ]
  },
  {
    id: 'kanji_n5_long',
    character: '長',
    meaningBn: 'দীর্ঘ / লম্বা / প্রধান',
    meaningEn: 'Long / Leader',
    onyomi: ['チョウ'],
    kunyomi: ['なが.い', 'おさ'],
    onyomiBn: ['চোও'],
    kunyomiBn: ['নাগাই'],
    strokeCount: 8,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'একজন প্রবীণ জ্ঞানী মানুষ যার লম্বা চুল বাতাসে উড়ছে এবং তিনি লাঠিতে ভর দিয়ে হাঁটছেন। বয়সে বড়, পদে প্রধান বা আকৃতিতে দীর্ঘ বোঝাতে 長 (নাগাই)।',
    visualOrigin: {
      realWorldObject: 'দীর্ঘ কেশধারী প্রবীণ মুরব্বী বা নেতা',
      ancientFormDescription: 'বাতাসে উড়ন্ত লম্বা চুল ও লাঠিধারী প্রবীণ মানুষ',
      transformationHint: 'চুলের দীর্ঘ স্ট্রোক ও লাঠির রেখা ৮ স্ট্রোকে 長 রূপ নেয়।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '長い', reading: 'ながい (nagai)', readingBn: 'নাগাই', meaningBn: 'লম্বা / দীর্ঘ' },
      { word: '社長', reading: 'しゃちょう (shachou)', readingBn: 'শাচোও', meaningBn: 'কোম্পানির প্রেসিডেন্ট / প্রধান' },
      { word: '校長', reading: 'こうちょう (kouchou)', readingBn: 'কোওচোও', meaningBn: 'প্রধান শিক্ষক' }
    ]
  },
  {
    id: 'kanji_n5_what',
    character: '何',
    meaningBn: 'কী / কোনটি',
    meaningEn: 'What',
    onyomi: ['カ'],
    kunyomi: ['なに', 'なん'],
    onyomiBn: ['কা'],
    kunyomiBn: ['নানি', 'নান'],
    strokeCount: 7,
    level: 'N5',
    category: 'life',
    categoryBn: 'সমাজ, স্কুল ও দৈনন্দিন জীবন',
    mnemonicStoryBn: 'একজন মানুষ (亻) কাঁধে একটি ভারী পাত্র বহন করছে এবং জিজ্ঞাসা করছে: "ভেতরে কী (何) আছে?"। কোনো কিছু জানতে প্রশ্ন করতেই ব্যবহৃত হয় 何 (নানি/নান)।',
    visualOrigin: {
      realWorldObject: 'কাঁধে বোঝা বা পাত্র নিয়ে জিজ্ঞাসা করা ব্যক্তি',
      ancientFormDescription: 'একজন মানুষ যার কাঁধে একটি ভারী অজানা সামগ্রীর বোঝা',
      transformationHint: '亻 (মানুষ) + কাঁধের সামগ্রী মিলে ৭ স্ট্রোকে 何।',
      pictogramType: 'generic'
    },
    examples: [
      { word: '何', reading: 'なに (nani) / なん (nan)', readingBn: 'নানি / নান', meaningBn: 'কী?' },
      { word: '何時', reading: 'なんじ (nanji)', readingBn: 'নানজি', meaningBn: 'কয়টা বাজে?' },
      { word: '何人', reading: 'なんにん (nannin)', readingBn: 'নাননিন', meaningBn: 'কতজন মানুষ?' }
    ]
  }
];
