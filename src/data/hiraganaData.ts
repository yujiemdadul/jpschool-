import { KanaChar, KanaLevel } from '../types';

export const HIRAGANA_CHARS: KanaChar[] = [
  // Level 1: a-row (あいうえお)
  {
    id: 'h_a',
    character: 'あ',
    type: 'hiragana',
    row: 'a',
    level: 1,
    romaji: 'a',
    bangla: 'আ',
    strokeCount: 3,
    mnemonicBn: 'প্রথমে একটি আনুভূমিক রেখা, এরপর ওপর থেকে নিচে খাড়া রেখা এবং শেষে ডানদিকে একটি বৃত্তাকার লুপ আঁকা হয়।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক ছোট দাগ' },
      { step: 2, instructionBn: 'ওপর থেকে নিচে সামান্য বাঁকা খাড়া দাগ' },
      { step: 3, instructionBn: 'মাঝখান থেকে শুরু করে নিচে বৃত্তাকার লুপ' }
    ],
    examples: [
      { japanese: 'あさ', romaji: 'asa', bangla: 'সকাল' },
      { japanese: 'あめ', romaji: 'ame', bangla: 'বৃষ্টি / মিষ্টি ক্যান্ডি' },
      { japanese: 'あい', romaji: 'ai', bangla: 'ভালোবাসা' }
    ]
  },
  {
    id: 'h_i',
    character: 'い',
    type: 'hiragana',
    row: 'a',
    level: 1,
    romaji: 'i',
    bangla: 'ই',
    strokeCount: 2,
    mnemonicBn: 'বামদিকের রেখাটি সামান্য বাঁকা ও নিচে ছোট হুক, আর ডানদিকের রেখাটি ছোট ও সমান্তরাল।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে ওপর থেকে নিচে নামিয়ে হালকা উপরের দিকে হুক' },
      { step: 2, instructionBn: 'ডানপাশে সমান্তরাল ছোট খাড়া দাগ' }
    ],
    examples: [
      { japanese: 'いぬ', romaji: 'inu', bangla: 'কুকুর' },
      { japanese: 'いえ', romaji: 'ie', bangla: 'বাড়ি / ঘর' },
      { japanese: 'いま', romaji: 'ima', bangla: 'এখন' }
    ]
  },
  {
    id: 'h_u',
    character: 'う',
    type: 'hiragana',
    row: 'a',
    level: 1,
    romaji: 'u',
    bangla: 'উ',
    strokeCount: 2,
    mnemonicBn: 'উপরে একটি ছোট কোণাকুণি দাগ এবং নিচে বাঁকানো একটি ধনুকের মতো রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরে ছোট কোণাকুণি টান' },
      { step: 2, instructionBn: 'নিচে বাঁকানো অর্ধবৃত্তাকার রেখা' }
    ],
    examples: [
      { japanese: 'うみ', romaji: 'umi', bangla: 'সমুদ্র' },
      { japanese: 'うし', romaji: 'ushi', bangla: 'গরু' },
      { japanese: 'うた', romaji: 'uta', bangla: 'গান' }
    ]
  },
  {
    id: 'h_e',
    character: 'え',
    type: 'hiragana',
    row: 'a',
    level: 1,
    romaji: 'e',
    bangla: 'এ',
    strokeCount: 2,
    mnemonicBn: 'উপরে ছোট দাগ, তারপর নিচের দাগটি দেখতে ইংরেজি Z এবং নিচে হালকা ঢেউয়ের মতো।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরে ছোট কোণাকুণি দাগ' },
      { step: 2, instructionBn: 'জেড (Z) অক্ষরের মতো লিখে নিচের দিক টেনে ঢেউয়ের মতো শেষ করা' }
    ],
    examples: [
      { japanese: 'えき', romaji: 'eki', bangla: 'ট্রেন স্টেশন' },
      { japanese: 'えん', romaji: 'en', bangla: 'ইয়েন (জাপানি মুদ্রা)' },
      { japanese: 'えび', romaji: 'ebi', bangla: 'চিংড়ি মাছ' }
    ]
  },
  {
    id: 'h_o',
    character: 'お',
    type: 'hiragana',
    row: 'a',
    level: 1,
    romaji: 'o',
    bangla: 'ও',
    strokeCount: 3,
    mnemonicBn: 'আণুভূমিক রেখার পর খাড়া রেখা নামিয়ে বামে মোচড় দিয়ে বড় লুপ, আর ডানপাশে একটি ছোট ফোঁটা/টান।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক ছোট দাগ' },
      { step: 2, instructionBn: 'খাড়া দাগ নামিয়ে বামে ঘুরিয়ে নিচের দিকে বড় লুপ' },
      { step: 3, instructionBn: 'ডানদিকের উপরে একটি ছোট কোণাকুণি টান' }
    ],
    examples: [
      { japanese: 'おと', romaji: 'oto', bangla: 'শব্দ / আওয়াজ' },
      { japanese: 'おちゃ', romaji: 'ocha', bangla: 'সবুজ চা' },
      { japanese: 'おんな', romaji: 'onna', bangla: 'নারী' }
    ]
  },

  // Level 2: ka-row (かきくけこ)
  {
    id: 'h_ka',
    character: 'か',
    type: 'hiragana',
    row: 'ka',
    level: 2,
    romaji: 'ka',
    bangla: 'কা',
    strokeCount: 3,
    mnemonicBn: 'বামদিকের বাঁকানো মূল কাঠামো, মাঝে কোণাকুণি ছেদক রেখা এবং ডানে ছোট টান।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক থেকে নিচে বাঁকিয়ে হালকা হুক' },
      { step: 2, instructionBn: 'ওপর থেকে বাঁকা হয়ে ক্রস করা রেখা' },
      { step: 3, instructionBn: 'ডানপাশে ছোট কোণাকুণি দাগ' }
    ],
    examples: [
      { japanese: 'かわ', romaji: 'kawa', bangla: 'নদী' },
      { japanese: 'かさ', romaji: 'kasa', bangla: 'ছাতা' },
      { japanese: 'かお', romaji: 'kao', bangla: 'মুখমণ্ডল' }
    ]
  },
  {
    id: 'h_ki',
    character: 'き',
    type: 'hiragana',
    row: 'ka',
    level: 2,
    romaji: 'ki',
    bangla: 'কি',
    strokeCount: 4,
    mnemonicBn: 'দুটি সমান্তরাল আনুভূমিক রেখা, কোণাকুণি খাড়া দাগ এবং নিচে বাঁকানো বৃত্তাংশ।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'নিচের সমান্তরাল আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'কোণাকুণি ছেদকারী রেখা' },
      { step: 4, instructionBn: 'নিচে বাঁকানো অর্ধবৃত্ত' }
    ],
    examples: [
      { japanese: 'き', romaji: 'ki', bangla: 'গাছ' },
      { japanese: 'きょう', romaji: 'kyou', bangla: 'আজ' },
      { japanese: 'きっぷ', romaji: 'kippu', bangla: 'টিকেট' }
    ]
  },
  {
    id: 'h_ku',
    character: 'く',
    type: 'hiragana',
    row: 'ka',
    level: 2,
    romaji: 'ku',
    bangla: 'কু',
    strokeCount: 1,
    mnemonicBn: 'এক টানে পাখির ঠোঁটের মতো < কোণাকুণি রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'কোণাকুণি নিচে বামে এসে আবার ডানে নিচে টানা' }
    ],
    examples: [
      { japanese: 'くるま', romaji: 'kuruma', bangla: 'গাড়ি' },
      { japanese: 'くち', romaji: 'kuchi', bangla: 'মুখ' },
      { japanese: 'くも', romaji: 'kumo', bangla: 'মেঘ / মাকড়সা' }
    ]
  },
  {
    id: 'h_ke',
    character: 'け',
    type: 'hiragana',
    row: 'ka',
    level: 2,
    romaji: 'ke',
    bangla: 'কে',
    strokeCount: 3,
    mnemonicBn: 'বামে খাড়া রেখা ও হুক, ডানে একটি আড়াআড়ি ও একটি লম্বালম্বি বাঁকা রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে খাড়া দাগ দিয়ে নিচে হুক' },
      { step: 2, instructionBn: 'ডানপাশে আনুভূমিক ছোট দাগ' },
      { step: 3, instructionBn: 'ডানপাশের উপর দিয়ে নিচে নামা বাঁকা দাগ' }
    ],
    examples: [
      { japanese: 'けさ', romaji: 'kesa', bangla: 'আজ সকাল' },
      { japanese: 'けいさつ', romaji: 'keisatsu', bangla: 'পুলিশ' },
      { japanese: 'けむり', romaji: 'kemuri', bangla: 'ধোঁয়া' }
    ]
  },
  {
    id: 'h_ko',
    character: 'こ',
    type: 'hiragana',
    row: 'ka',
    level: 2,
    romaji: 'ko',
    bangla: 'কো',
    strokeCount: 2,
    mnemonicBn: 'উপরে একটি অনুভূমিক রেখা এবং নিচে আরেকটি সমান্তরাল রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের আনুভূমিক রেখা এবং ডানে হালকা মোচড়' },
      { step: 2, instructionBn: 'নিচের সমান্তরাল বাঁকা রেখা' }
    ],
    examples: [
      { japanese: 'こども', romaji: 'kodomo', bangla: 'শিশু / বাচ্চা' },
      { japanese: 'こえ', romaji: 'koe', bangla: 'কণ্ঠস্বর' },
      { japanese: 'ここ', romaji: 'koko', bangla: 'এখানে' }
    ]
  },

  // Level 3: sa-row (さしすせそ)
  {
    id: 'h_sa',
    character: 'さ',
    type: 'hiragana',
    row: 'sa',
    level: 3,
    romaji: 'sa',
    bangla: 'সা',
    strokeCount: 3,
    mnemonicBn: 'উপরে আনুভূমিক রেখা, কোণাকুণি ছেদক এবং নিচে সুন্দর বাঁকা লুপ।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'কোণাকুণি খাড়া দাগ নামিয়ে ডানে হালকা মোচড়' },
      { step: 3, instructionBn: 'নিচে বাঁকা অর্ধবৃত্তাকার রেখা' }
    ],
    examples: [
      { japanese: 'さかな', romaji: 'sakana', bangla: 'মাছ' },
      { japanese: 'さくら', romaji: 'sakura', bangla: 'চেরি ব্লসম (সাকুরা)' },
      { japanese: 'さとう', romaji: 'satou', bangla: 'চিনি' }
    ]
  },
  {
    id: 'h_shi',
    character: 'し',
    type: 'hiragana',
    row: 'sa',
    level: 3,
    romaji: 'shi',
    bangla: 'শি',
    strokeCount: 1,
    mnemonicBn: 'এক টানে মাছ ধরার বড়শির মতো উপর থেকে নেমে ডানে ঘুরে ওঠা।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপর থেকে সোজা নেমে নিচে গোল হয়ে ডানে ওপরে ওঠা' }
    ],
    examples: [
      { japanese: 'しお', romaji: 'shio', bangla: 'লবণ' },
      { japanese: 'しろ', romaji: 'shiro', bangla: 'সাদা' },
      { japanese: 'しんぶん', romaji: 'shinbun', bangla: 'সংবাদপত্র' }
    ]
  },
  {
    id: 'h_su',
    character: 'す',
    type: 'hiragana',
    row: 'sa',
    level: 3,
    romaji: 'su',
    bangla: 'সু',
    strokeCount: 2,
    mnemonicBn: 'আনুভূমিক রেখা এবং খাড়া নেমে মাঝে একটি ছোট প্যাঁচানো লুপ দিয়ে নিচে নামা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক রেখা' },
      { step: 2, instructionBn: 'ওপর থেকে নেমে মাঝে গোল লুপ দিয়ে সোজা নিচে নামা' }
    ],
    examples: [
      { japanese: 'すし', romaji: 'sushi', bangla: 'সুশি (জাপানি খাবার)' },
      { japanese: 'すき', romaji: 'suki', bangla: 'পছন্দ' },
      { japanese: 'すずしい', romaji: 'suzushii', bangla: 'ঠাণ্ডা / মনোরম' }
    ]
  },
  {
    id: 'h_se',
    character: 'せ',
    type: 'hiragana',
    row: 'sa',
    level: 3,
    romaji: 'se',
    bangla: 'সে',
    strokeCount: 3,
    mnemonicBn: 'আনুভূমিক রেখা, ডানপাশের বাঁকানো রেখা ও বামপাশের নিচে নেমে মোচড়ানো রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে দীর্ঘ আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'ডানপাশে খাড়া দাগ নামিয়ে বাঁকানো' },
      { step: 3, instructionBn: 'বামপাশে খাড়া দাগ নামিয়ে ডানে বাঁকিয়ে নিচে নেওয়া' }
    ],
    examples: [
      { japanese: 'せんせい', romaji: 'sensei', bangla: 'শিক্ষক' },
      { japanese: 'せかい', romaji: 'sekai', bangla: 'পৃথিবী' },
      { japanese: 'せき', romaji: 'seki', bangla: 'আসন / কাশি' }
    ]
  },
  {
    id: 'h_so',
    character: 'そ',
    type: 'hiragana',
    row: 'sa',
    level: 3,
    romaji: 'so',
    bangla: 'সো',
    strokeCount: 1,
    mnemonicBn: 'এক টানে ইংরেজি Z লিখে নিচে একটি C-এর মতো বাঁকানো অর্ধবৃত্ত যোগ করা।',
    strokeSteps: [
      { step: 1, instructionBn: 'জেড (Z) অক্ষরের মতো শুরু করে না থেমে নিচে সি (C) এর মতো বাঁকানো' }
    ],
    examples: [
      { japanese: 'そら', romaji: 'sora', bangla: 'আকাশ' },
      { japanese: 'そこ', romaji: 'soko', bangla: 'সেখানে' },
      { japanese: 'そば', romaji: 'soba', bangla: 'সোবা নুডলস / পাশে' }
    ]
  },

  // Level 4: ta-row (たちつてと)
  {
    id: 'h_ta',
    character: 'た',
    type: 'hiragana',
    row: 'ta',
    level: 4,
    romaji: 'ta',
    bangla: 'তা',
    strokeCount: 4,
    mnemonicBn: 'বামপাশে ক্রসের মতো এবং ডানে こ (ko) অক্ষরের মতো দুটি ছোট রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'কোণাকুণি ছেদক দাগ' },
      { step: 3, instructionBn: 'ডানপাশে উপরের ছোট আনুভূমিক দাগ' },
      { step: 4, instructionBn: 'ডানপাশে নিচের ছোট আনুভূমিক দাগ' }
    ],
    examples: [
      { japanese: 'たべる', romaji: 'taberu', bangla: 'খাওয়া' },
      { japanese: 'たまご', romaji: 'tamago', bangla: 'ডিম' },
      { japanese: 'たいよう', romaji: 'taiyou', bangla: 'সূর্য' }
    ]
  },
  {
    id: 'h_chi',
    character: 'ち',
    type: 'hiragana',
    row: 'ta',
    level: 4,
    romaji: 'chi',
    bangla: 'চি',
    strokeCount: 2,
    mnemonicBn: 'উপরে আনুভূমিক রেখা এবং নিচে নামিয়ে ইংরেজি 5 নম্বরের মতো পেট বাঁকানো।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক রেখা' },
      { step: 2, instructionBn: 'ওপর থেকে কোণাকুণি নেমে বড় অর্ধবৃত্তাকার পেটের মতো বাঁকানো' }
    ],
    examples: [
      { japanese: 'ちず', romaji: 'chizu', bangla: 'মানচিত্র' },
      { japanese: 'ちち', romaji: 'chichi', bangla: 'বাবা' },
      { japanese: 'ちいさい', romaji: 'chiisai', bangla: 'ছোট' }
    ]
  },
  {
    id: 'h_tsu',
    character: 'つ',
    type: 'hiragana',
    row: 'ta',
    level: 4,
    romaji: 'tsu',
    bangla: 'ৎসু',
    strokeCount: 1,
    mnemonicBn: 'সুনামির বড় ঢেউয়ের মতো এক টানে বাঁকানো বড় অর্ধবৃত্তাকার রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে শুরু করে উপরে বাঁকিয়ে বড় ঢেউয়ের মতো নিচে নামা' }
    ],
    examples: [
      { japanese: 'つき', romaji: 'tsuki', bangla: 'চাঁদ / মাস' },
      { japanese: 'つくえ', romaji: 'tsukue', bangla: 'টেবিল' },
      { japanese: 'つよい', romaji: 'tsuyoi', bangla: 'শক্তিশালী' }
    ]
  },
  {
    id: 'h_te',
    character: 'て',
    type: 'hiragana',
    row: 'ta',
    level: 4,
    romaji: 'te',
    bangla: 'তে',
    strokeCount: 1,
    mnemonicBn: 'এক টানে আনুভূমিক দাগ দিয়ে নিচে অর্ধবৃত্তাকার ধনুকের মতো বাঁকানো।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে গিয়ে নিচে বাঁকিয়ে সি (C) এর মতো অর্ধবৃত্ত' }
    ],
    examples: [
      { japanese: 'て', romaji: 'te', bangla: 'হাত' },
      { japanese: 'てがみ', romaji: 'tegami', bangla: 'চিঠি' },
      { japanese: 'てんき', romaji: 'tenki', bangla: 'আবহাওয়া' }
    ]
  },
  {
    id: 'h_to',
    character: 'と',
    type: 'hiragana',
    row: 'ta',
    level: 4,
    romaji: 'to',
    bangla: 'তো',
    strokeCount: 2,
    mnemonicBn: 'একটি ছোট খাড়া দাগ এবং নিচে বাঁকানো ইংরেজি C আকৃতির অংশ।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে কোণাকুণি ছোট দাগ' },
      { step: 2, instructionBn: 'ডান থেকে বড় অর্ধবৃত্তাকারে বাঁকিয়ে নিচের দিকে আনা' }
    ],
    examples: [
      { japanese: 'とり', romaji: 'tori', bangla: 'পাখি' },
      { japanese: 'ともだち', romaji: 'tomodachi', bangla: 'বন্ধু' },
      { japanese: 'とけい', romaji: 'tokei', bangla: 'ঘড়ি' }
    ]
  },

  // Level 5: na-row (なにぬねの)
  {
    id: 'h_na',
    character: 'な',
    type: 'hiragana',
    row: 'na',
    level: 5,
    romaji: 'na',
    bangla: 'না',
    strokeCount: 4,
    mnemonicBn: 'বামপাশে ক্রসের মতো দুটি দাগ এবং ডানপাশে একটি ছোট টান ও নিচে লুপযুক্ত অংশ।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'কোণাকুণি ছেদকারী দাগ' },
      { step: 3, instructionBn: 'ডানপাশের উপরের ছোট দাগ' },
      { step: 4, instructionBn: 'ডানপাশে নিচে নেমে গোল লুপ তৈরি করা' }
    ],
    examples: [
      { japanese: 'なつ', romaji: 'natsu', bangla: 'গ্রীষ্মকাল' },
      { japanese: 'なまえ', romaji: 'namae', bangla: 'নাম' },
      { japanese: 'なな', romaji: 'nana', bangla: 'সাত (৭)' }
    ]
  },
  {
    id: 'h_ni',
    character: 'に',
    type: 'hiragana',
    row: 'na',
    level: 5,
    romaji: 'ni',
    bangla: 'নি',
    strokeCount: 3,
    mnemonicBn: 'বামে খাড়া রেখা ও হুক, ডানে こ (ko) অক্ষরের মতো দুটি ছোট সমান্তরাল দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে খাড়া দাগ নামিয়ে হালকা হুক' },
      { step: 2, instructionBn: 'ডানপাশে উপরের আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'ডানপাশে নিচের সমান্তরাল দাগ' }
    ],
    examples: [
      { japanese: 'にく', romaji: 'niku', bangla: 'মাংস' },
      { japanese: 'にほん', romaji: 'nihon', bangla: 'জাপান' },
      { japanese: 'にちようび', romaji: 'nichiyoubi', bangla: 'রবিবার' }
    ]
  },
  {
    id: 'h_nu',
    character: 'ぬ',
    type: 'hiragana',
    row: 'na',
    level: 5,
    romaji: 'nu',
    bangla: 'নু',
    strokeCount: 2,
    mnemonicBn: 'নূডলসের মতো প্যাঁচানো রেখা এবং শেষে ছোট একটি গোল লুপ।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে কোণাকুণি নিচে নামা দাগ' },
      { step: 2, instructionBn: 'বাঁকা হয়ে ঘুরে নিচে এসে শেষে ছোট গোল লুপ দিয়ে শেষ' }
    ],
    examples: [
      { japanese: 'いぬ', romaji: 'inu', bangla: 'কুকুর' },
      { japanese: 'ぬの', romaji: 'nuno', bangla: 'কাপড় / বস্ত্র' },
      { japanese: 'ぬるい', romaji: 'nurui', bangla: 'হালকা গরম (কুসুম গরম)' }
    ]
  },
  {
    id: 'h_ne',
    character: 'ね',
    type: 'hiragana',
    row: 'na',
    level: 5,
    romaji: 'ne',
    bangla: 'নে',
    strokeCount: 2,
    mnemonicBn: 'বামে খাড়া দাগ, ডানে ইংরেজি Z-এর মতো হয়ে শেষে বিড়ালের লেজের মতো ছোট লুপ।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে সোজা খাড়া দাগ' },
      { step: 2, instructionBn: 'জেড (Z) এর মতো লিখে ওপরে উঠে নিচে ছোট লুপে শেষ' }
    ],
    examples: [
      { japanese: 'ねこ', romaji: 'neko', bangla: 'বিড়াল' },
      { japanese: 'ねる', romaji: 'neru', bangla: 'ঘুমানো' },
      { japanese: 'ねつ', romaji: 'netsu', bangla: 'জ্বর' }
    ]
  },
  {
    id: 'h_no',
    character: 'の',
    type: 'hiragana',
    row: 'na',
    level: 5,
    romaji: 'no',
    bangla: 'নো',
    strokeCount: 1,
    mnemonicBn: 'এক টানে কোণাকুণি নেমে বড় গোল বৃত্তের মতো ঘুরে শেষ করা।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে কোণাকুণি নেমে বৃত্তাকারে ঘুরে শেষ' }
    ],
    examples: [
      { japanese: 'のみもの', romaji: 'nomimono', bangla: 'পানীয়' },
      { japanese: 'のり', romaji: 'nori', bangla: 'সামুদ্রিক শৈবাল / আঠা' },
      { japanese: 'のむ', romaji: 'nomu', bangla: 'পান করা' }
    ]
  },

  // Level 6: ha-row (はひふへほ)
  {
    id: 'h_ha',
    character: 'は',
    type: 'hiragana',
    row: 'ha',
    level: 6,
    romaji: 'ha',
    bangla: 'হা',
    strokeCount: 3,
    mnemonicBn: 'বামে খাড়া দাগ, ডানে আনুভূমিক রেখা এবং খাড়া দাগের নিচে একটি লুপ।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে সোজা খাড়া দাগ' },
      { step: 2, instructionBn: 'ডানপাশে ছোট আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'খাড়া দাগ নামিয়ে নিচে গোল লুপ করে শেষ' }
    ],
    examples: [
      { japanese: 'はな', romaji: 'hana', bangla: 'ফুল / নাক' },
      { japanese: 'はし', romaji: 'hashi', bangla: 'চপস্টিক / সেতু' },
      { japanese: 'はい', romaji: 'hai', bangla: 'হ্যাঁ' }
    ]
  },
  {
    id: 'h_hi',
    character: 'ひ',
    type: 'hiragana',
    row: 'ha',
    level: 6,
    romaji: 'hi',
    bangla: 'হি',
    strokeCount: 1,
    mnemonicBn: 'এক টানে হাসিমুখের মতো নিচের দিকে গোল খাঁদ তৈরি করে ডানে ওঠা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে আনুভূমিক গিয়ে নিচে গোল বাটির মতো নেমে ডানে ওঠা' }
    ],
    examples: [
      { japanese: 'ひと', romaji: 'hito', bangla: 'মানুষ' },
      { japanese: 'ひ', romaji: 'hi', bangla: 'আগুন / দিন' },
      { japanese: 'ひかり', romaji: 'hikari', bangla: 'আলো' }
    ]
  },
  {
    id: 'h_fu',
    character: 'ふ',
    type: 'hiragana',
    row: 'ha',
    level: 6,
    romaji: 'fu',
    bangla: 'ফু',
    strokeCount: 4,
    mnemonicBn: 'ফুজি পর্বতের মতো মাঝের উঁচু অংশ এবং দুইপাশে ছোট ছোট ফোঁটা।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরে ছোট কোণাকুণি দাগ' },
      { step: 2, instructionBn: 'মাঝখান থেকে নেমে বাঁকানো মূল দাগ' },
      { step: 3, instructionBn: 'বামপাশে ছোট ফোঁটা' },
      { step: 4, instructionBn: 'ডানপাশে ছোট ফোঁটা' }
    ],
    examples: [
      { japanese: 'ふゆ', romaji: 'fuyu', bangla: 'শীতকাল' },
      { japanese: 'ふね', romaji: 'fune', bangla: 'নৌকা / জাহাজ' },
      { japanese: 'ふじさん', romaji: 'fujisan', bangla: 'ফুজি পর্বত' }
    ]
  },
  {
    id: 'h_he',
    character: 'へ',
    type: 'hiragana',
    row: 'ha',
    level: 6,
    romaji: 'he',
    bangla: 'হে',
    strokeCount: 1,
    mnemonicBn: 'পাহাড়ের চূড়ার মতো এক টানে উপরে উঠে নিচে নেমে যাওয়া।',
    strokeSteps: [
      { step: 1, instructionBn: 'কোণাকুণি ওপরে উঠে ডানে নিচে নেমে যাওয়া' }
    ],
    examples: [
      { japanese: 'へや', romaji: 'heya', bangla: 'কক্ষ / রুম' },
      { japanese: 'へび', romaji: 'hebi', bangla: 'সাপ' },
      { japanese: 'へた', romaji: 'heta', bangla: 'অদক্ষ / কাঁচা' }
    ]
  },
  {
    id: 'h_ho',
    character: 'ほ',
    type: 'hiragana',
    row: 'ha',
    level: 6,
    romaji: 'ho',
    bangla: 'হো',
    strokeCount: 4,
    mnemonicBn: 'বামে খাড়া দাগ, ডানে দুটি সমান্তরাল দাগ এবং খাড়া দাগের নিচে গোল লুপ।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে সোজা খাড়া দাগ' },
      { step: 2, instructionBn: 'ডানপাশে উপরের আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'ডানপাশে নিচের আনুভূমিক দাগ' },
      { step: 4, instructionBn: 'ওপর থেকে নেমে নিচের দিকে গোল লুপ' }
    ],
    examples: [
      { japanese: 'ほん', romaji: 'hon', bangla: 'বই' },
      { japanese: 'ほし', romaji: 'hoshi', bangla: 'তারা / নক্ষত্র' },
      { japanese: 'ホテル', romaji: 'hoteru', bangla: 'হোটেল' }
    ]
  },

  // Level 7: ma-row (まみむめも)
  {
    id: 'h_ma',
    character: 'ま',
    type: 'hiragana',
    row: 'ma',
    level: 7,
    romaji: 'ma',
    bangla: 'মা',
    strokeCount: 3,
    mnemonicBn: 'দুটি সমান্তরাল আনুভূমিক দাগ এবং খাড়া দাগ ওপর দিয়ে ভেদ করে নিচে গোল লুপ।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'নিচের সমান্তরাল আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'ওপর থেকে ভেদ করে নিচে গোল লুপ তৈরি' }
    ],
    examples: [
      { japanese: 'まち', romaji: 'machi', bangla: 'শহর' },
      { japanese: 'まつ', romaji: 'matsu', bangla: 'অপেক্ষা করা' },
      { japanese: 'まど', romaji: 'mado', bangla: 'জানালা' }
    ]
  },
  {
    id: 'h_mi',
    character: 'み',
    type: 'hiragana',
    row: 'ma',
    level: 7,
    romaji: 'mi',
    bangla: 'মি',
    strokeCount: 2,
    mnemonicBn: 'মিউজিক্যাল নোটের মতো লুপ তৈরি করে ডানপাশে কোণাকুণি ছেদক রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে আনুভূমিক গিয়ে নিচে লুপ দিয়ে ডানে ওঠা' },
      { step: 2, instructionBn: 'ডানপাশে কোণাকুণি ছেদক দাগ' }
    ],
    examples: [
      { japanese: 'みず', romaji: 'mizu', bangla: 'পানি' },
      { japanese: 'みみ', romaji: 'mimi', bangla: 'কান' },
      { japanese: 'みち', romaji: 'michi', bangla: 'রাস্তা' }
    ]
  },
  {
    id: 'h_mu',
    character: 'む',
    type: 'hiragana',
    row: 'ma',
    level: 7,
    romaji: 'mu',
    bangla: 'মু',
    strokeCount: 3,
    mnemonicBn: 'গরুর মুখ ও শিংয়ের মতো—আনুভূমিক দাগ, নিচে নেমে গোল লুপ দিয়ে ডানে ওঠা ও ফোঁটা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'ওপর থেকে নেমে নিচে লুপ দিয়ে ডানে ওপরে ওঠা' },
      { step: 3, instructionBn: 'ডানপাশের কোণায় ছোট ফোঁটা' }
    ],
    examples: [
      { japanese: 'むし', romaji: 'mushi', bangla: 'পোকামাকড়' },
      { japanese: 'むら', romaji: 'mura', bangla: 'গ্রাম' },
      { japanese: 'むずかしい', romaji: 'muzukashii', bangla: 'কঠিন' }
    ]
  },
  {
    id: 'h_me',
    character: 'め',
    type: 'hiragana',
    row: 'ma',
    level: 7,
    romaji: 'me',
    bangla: 'মে',
    strokeCount: 2,
    mnemonicBn: 'চোখের আকৃতির মতো বাঁকা রেখা দিয়ে ঘেরা (ぬ এর মতো শেষে লুপ থাকে না)।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে কোণাকুণি দাগ' },
      { step: 2, instructionBn: 'ওপর থেকে ঘুরে ডিম্বাকারে এসে শেষ' }
    ],
    examples: [
      { japanese: 'め', romaji: 'me', bangla: 'চোখ' },
      { japanese: 'めがね', romaji: 'megane', bangla: 'চশমা' },
      { japanese: 'あめ', romaji: 'ame', bangla: 'বৃষ্টি' }
    ]
  },
  {
    id: 'h_mo',
    character: 'も',
    type: 'hiragana',
    row: 'ma',
    level: 7,
    romaji: 'mo',
    bangla: 'মো',
    strokeCount: 3,
    mnemonicBn: 'মাছের বড়শির মতো মূল অংশ এবং মাঝে দুটি আনুভূমিক ছেদক দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে নেমে নিচে বড়শির মতো গোল হওয়া' },
      { step: 2, instructionBn: 'উপরের আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'নিচের আনুভূমিক দাগ' }
    ],
    examples: [
      { japanese: 'もり', romaji: 'mori', bangla: 'বন / জঙ্গল' },
      { japanese: 'もの', romaji: 'mono', bangla: 'জিনিস / বস্তু' },
      { japanese: 'もも', romaji: 'momo', bangla: 'পীচ ফল' }
    ]
  },

  // Level 8: ya-row (やゆよ)
  {
    id: 'h_ya',
    character: 'や',
    type: 'hiragana',
    row: 'ya',
    level: 8,
    romaji: 'ya',
    bangla: 'ইয়া',
    strokeCount: 3,
    mnemonicBn: 'ইয়াকের শিংয়ের মতো বাঁকা রেখা, উপরে ছোট ফোঁটা ও বামে খাড়া দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে বাঁকা হয়ে নিচে লুপের মতো নেমে বাঁকা' },
      { step: 2, instructionBn: 'উপরে ছোট কোণাকুণি দাগ' },
      { step: 3, instructionBn: 'বামপাশে খাড়া সোজা দাগ' }
    ],
    examples: [
      { japanese: 'やま', romaji: 'yama', bangla: 'পাহাড় / পর্বত' },
      { japanese: 'やすみ', romaji: 'yasumi', bangla: 'ছুটি / বিশ্রাম' },
      { japanese: 'やさい', romaji: 'yasai', bangla: 'শাকসবজি' }
    ]
  },
  {
    id: 'h_yu',
    character: 'ゆ',
    type: 'hiragana',
    row: 'ya',
    level: 8,
    romaji: 'yu',
    bangla: 'ইউ',
    strokeCount: 2,
    mnemonicBn: 'মাছের মতো বাঁকা পেটের রেখা এবং ওপর থেকে সোজা নিচে কাটা দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে নেমে নিচে গোল হয়ে উপরে উঠে আসা' },
      { step: 2, instructionBn: 'ওপর থেকে সোজা নিচে ছেদকারী দাগ' }
    ],
    examples: [
      { japanese: 'ゆき', romaji: 'yuki', bangla: 'বরফ' },
      { japanese: 'ゆめ', romaji: 'yume', bangla: 'স্বপ্ন' },
      { japanese: 'ゆうびんきょく', romaji: 'yuubinkyoku', bangla: 'ডাকঘর' }
    ]
  },
  {
    id: 'h_yo',
    character: 'よ',
    type: 'hiragana',
    row: 'ya',
    level: 8,
    romaji: 'yo',
    bangla: 'ইয়ো',
    strokeCount: 2,
    mnemonicBn: 'ছোট আনুভূমিক রেখা এবং খাড়া নেমে নিচে একটি গোল লুপ।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে ছোট আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'ওপর থেকে নেমে নিচে গোল লুপ করে ডানে যাওয়া' }
    ],
    examples: [
      { japanese: 'よる', romaji: 'yoru', bangla: 'রাত' },
      { japanese: 'よむ', romaji: 'yomu', bangla: 'পড়া' },
      { japanese: 'よい', romaji: 'yoi', bangla: 'ভালো' }
    ]
  },

  // Level 9: ra-row (らりるれろ)
  {
    id: 'h_ra',
    character: 'ら',
    type: 'hiragana',
    row: 'ra',
    level: 9,
    romaji: 'ra',
    bangla: 'রা',
    strokeCount: 2,
    mnemonicBn: 'উপরে ছোট কোণাকুণি দাগ এবং নিচে ইংরেজি 5 নম্বরের পেটের মতো বাঁকা অংশ।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরে ছোট দাগ' },
      { step: 2, instructionBn: 'নিচে সোজা নেমে গোল অর্ধবৃত্ত' }
    ],
    examples: [
      { japanese: 'らいしゅう', romaji: 'raishuu', bangla: 'আগামী সপ্তাহ' },
      { japanese: 'らくだ', romaji: 'rakuda', bangla: 'উট' },
      { japanese: 'ラジオ', romaji: 'rajio', bangla: 'রেডিও' }
    ]
  },
  {
    id: 'h_ri',
    character: 'り',
    type: 'hiragana',
    row: 'ra',
    level: 9,
    romaji: 'ri',
    bangla: 'রি',
    strokeCount: 2,
    mnemonicBn: 'বামে ছোট খাড়া দাগ এবং ডানে দীর্ঘ বাঁকা দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে ওপর থেকে নিচে ছোট দাগ ও হালকা হুক' },
      { step: 2, instructionBn: 'ডানপাশে ওপর থেকে দীর্ঘ বাঁকা দাগ' }
    ],
    examples: [
      { japanese: 'りんご', romaji: 'ringo', bangla: 'আপেল' },
      { japanese: 'りゆう', romaji: 'riyuu', bangla: 'কারণ' },
      { japanese: 'りょこう', romaji: 'ryokou', bangla: 'ভ্রমণ' }
    ]
  },
  {
    id: 'h_ru',
    character: 'る',
    type: 'hiragana',
    row: 'ra',
    level: 9,
    romaji: 'ru',
    bangla: 'রু',
    strokeCount: 1,
    mnemonicBn: 'ইংরেজি 3 নম্বরের মতো লিখে শেষে একটি ছোট গোল লুপ আঁকা।',
    strokeSteps: [
      { step: 1, instructionBn: '৩ (3) এর মতো লিখে শেষ প্রান্তে ছোট গোল লুপ দেওয়া' }
    ],
    examples: [
      { japanese: 'るす', romaji: 'rusu', bangla: 'অনুপস্থিতি / বাড়ি না থাকা' },
      { japanese: 'くる', romaji: 'kuru', bangla: 'আসা' },
      { japanese: 'みる', romaji: 'miru', bangla: 'দেখা' }
    ]
  },
  {
    id: 'h_re',
    character: 'れ',
    type: 'hiragana',
    row: 'ra',
    level: 9,
    romaji: 're',
    bangla: 'রে',
    strokeCount: 2,
    mnemonicBn: 'বামে সোজা খাড়া দাগ, ডানে জেড (Z) এর মতো লিখে ডানে টান দিয়ে শেষ (লুপ ছাড়া)।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে সোজা খাড়া দাগ' },
      { step: 2, instructionBn: 'জেড (Z) লিখে ডানে বাঁকিয়ে বের করে দেওয়া' }
    ],
    examples: [
      { japanese: 'れいぞうこ', romaji: 'reizouko', bangla: 'ফ্রিজ' },
      { japanese: 'れきし', romaji: 'rekishi', bangla: 'ইতিহাস' },
      { japanese: 'れんしゅう', romaji: 'renshuu', bangla: 'অনুশীলন' }
    ]
  },
  {
    id: 'h_ro',
    character: 'ろ',
    type: 'hiragana',
    row: 'ra',
    level: 9,
    romaji: 'ro',
    bangla: 'রো',
    strokeCount: 1,
    mnemonicBn: 'ইংরেজি 3 নম্বরের মতো এক টানে লেখা (る এর মতো কোনো লুপ নেই)।',
    strokeSteps: [
      { step: 1, instructionBn: 'এক টানে ৩ (3) নম্বরের মতো সুন্দর করে লেখা' }
    ],
    examples: [
      { japanese: 'ろうそく', romaji: 'rousoku', bangla: 'মোমবাতি' },
      { japanese: 'ろく', romaji: 'roku', bangla: 'ছয় (৬)' },
      { japanese: 'くろ', romaji: 'kuro', bangla: 'কালো' }
    ]
  },

  // Level 10: wa-row (わをん)
  {
    id: 'h_wa',
    character: 'わ',
    type: 'hiragana',
    row: 'wa',
    level: 10,
    romaji: 'wa',
    bangla: 'ওয়া',
    strokeCount: 2,
    mnemonicBn: 'বামে খাড়া দাগ এবং ডানে বড় গোল পেট তৈরি করা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে সোজা খাড়া দাগ' },
      { step: 2, instructionBn: 'জেড (Z) এর মতো শুরু করে বড় গোল পেট করে শেষ' }
    ],
    examples: [
      { japanese: 'わたし', romaji: 'watashi', bangla: 'আমি' },
      { japanese: 'わに', romaji: 'wani', bangla: 'কুমির' },
      { japanese: 'わるい', romaji: 'warui', bangla: 'খারাপ' }
    ]
  },
  {
    id: 'h_wo',
    character: 'を',
    type: 'hiragana',
    row: 'wa',
    level: 10,
    romaji: 'wo',
    bangla: 'ও',
    strokeCount: 3,
    mnemonicBn: 'ব্যাকরণগত পার্টিকেল হিসেবে ব্যবহৃত হয় (কর্মকারকের চিহ্ন)।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'কোণাকুণি নেমে ডানে মোচড় দেওয়া' },
      { step: 3, instructionBn: 'নিচে সি (C) আকৃতির অর্ধবৃত্ত' }
    ],
    examples: [
      { japanese: 'ほん を よむ', romaji: 'hon o yomu', bangla: 'বই পড়া' },
      { japanese: 'みず を のむ', romaji: 'mizu o nomu', bangla: 'পানি পান করা' },
      { japanese: 'ごはん を たべる', romaji: 'gohan o taberu', bangla: 'ভাত খাওয়া' }
    ]
  },
  {
    id: 'h_n',
    character: 'ん',
    type: 'hiragana',
    row: 'wa',
    level: 10,
    romaji: 'n',
    bangla: 'ন',
    strokeCount: 1,
    mnemonicBn: 'ইংরেজি ছোট হাতের n এবং হসন্তযুক্ত ‘ন্’ বা ‘ং’ ধ্বনি নির্দেশ করে। এটি একা বসে না, শব্দের মাঝে বা শেষে বসে।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে নেমে বাঁকা হয়ে ইংরেজি n এর মতো উঠে ডানে বাঁকানো' }
    ],
    examples: [
      { japanese: 'にほん', romaji: 'nihon', bangla: 'জাপান' },
      { japanese: 'しんぶん', romaji: 'shinbun', bangla: 'সংবাদপত্র' },
      { japanese: 'みかん', romaji: 'mikan', bangla: 'কমলালেবু' }
    ]
  }
];

export const HIRAGANA_LEVELS: KanaLevel[] = [
  {
    level: 1,
    type: 'hiragana',
    titleBn: 'Level 1 : A-সারি (あ い う え お)',
    titleJp: 'あ行 (あいうえお)',
    descriptionBn: 'জাপানি ভাষার মূল ৫টি স্বরবর্ণ (Vowels)',
    characters: HIRAGANA_CHARS.filter(c => c.level === 1)
  },
  {
    level: 2,
    type: 'hiragana',
    titleBn: 'Level 2 : Ka-সারি (か き く け こ)',
    titleJp: 'か行 (かきくけこ)',
    descriptionBn: '‘K’ ব্যঞ্জনধ্বনি যুক্ত ৫টি বর্ণ',
    characters: HIRAGANA_CHARS.filter(c => c.level === 2)
  },
  {
    level: 3,
    type: 'hiragana',
    titleBn: 'Level 3 : Sa-সারি (さ し す せ そ)',
    titleJp: 'さ行 (さしすせそ)',
    descriptionBn: '‘S’ ব্যঞ্জনধ্বনি (লক্ষ্য করুন: し = shi)',
    characters: HIRAGANA_CHARS.filter(c => c.level === 3)
  },
  {
    level: 4,
    type: 'hiragana',
    titleBn: 'Level 4 : Ta-সারি (た ち つ て と)',
    titleJp: 'た行 (たちつてと)',
    descriptionBn: '‘T’ ব্যঞ্জনধ্বনি (লক্ষ্য করুন: ち = chi, つ = tsu)',
    characters: HIRAGANA_CHARS.filter(c => c.level === 4)
  },
  {
    level: 5,
    type: 'hiragana',
    titleBn: 'Level 5 : Na-সারি (な に ぬ ね の)',
    titleJp: 'な行 (なにぬねの)',
    descriptionBn: '‘N’ ব্যঞ্জনধ্বনি যুক্ত ৫টি বর্ণ',
    characters: HIRAGANA_CHARS.filter(c => c.level === 5)
  },
  {
    level: 6,
    type: 'hiragana',
    titleBn: 'Level 6 : Ha-সারি (は ひ ふ へ ほ)',
    titleJp: 'は行 (はひふへほ)',
    descriptionBn: '‘H’ ব্যঞ্জনধ্বনি (লক্ষ্য করুন: ふ = fu)',
    characters: HIRAGANA_CHARS.filter(c => c.level === 6)
  },
  {
    level: 7,
    type: 'hiragana',
    titleBn: 'Level 7 : Ma-সারি (ま み む め も)',
    titleJp: 'ま行 (まみむめも)',
    descriptionBn: '‘M’ ব্যঞ্জনধ্বনি যুক্ত ৫টি বর্ণ',
    characters: HIRAGANA_CHARS.filter(c => c.level === 7)
  },
  {
    level: 8,
    type: 'hiragana',
    titleBn: 'Level 8 : Ya-সারি (や ゆ よ)',
    titleJp: 'や行 (やゆよ)',
    descriptionBn: '‘Y’ গ্লাইড ধ্বনি যুক্ত ৩টি বর্ণ',
    characters: HIRAGANA_CHARS.filter(c => c.level === 8)
  },
  {
    level: 9,
    type: 'hiragana',
    titleBn: 'Level 9 : Ra-সারি (ら り る れ ろ)',
    titleJp: 'ら行 (らりるれろ)',
    descriptionBn: 'জাপানি ‘R/L’ সম্মিলিত মৃদু ব্যঞ্জনধ্বনি',
    characters: HIRAGANA_CHARS.filter(c => c.level === 9)
  },
  {
    level: 10,
    type: 'hiragana',
    titleBn: 'Level 10 : Wa-সারি ও বিশেষ ‘ন্’ (わ を ん)',
    titleJp: 'わ行・ん (わを行・ん)',
    descriptionBn: 'বিশেষ ব্যাকরণিক পার্টিকেল を ও একক নাসিক্য ‘ん’',
    characters: HIRAGANA_CHARS.filter(c => c.level === 10)
  }
];
