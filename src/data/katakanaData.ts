import { KanaChar, KanaLevel } from '../types';

export const KATAKANA_CHARS: KanaChar[] = [
  // Level 1: a-row (アイウエオ)
  {
    id: 'k_a',
    character: 'ア',
    type: 'katakana',
    row: 'a',
    level: 1,
    romaji: 'a',
    bangla: 'আ',
    strokeCount: 2,
    mnemonicBn: 'উপরে একটি আনুভূমিক কোণ এবং বামদিকে কোণাকুণি বাঁকা রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক থেকে শুরু করে নিচে বামে কোণাকুণি বাঁকা' },
      { step: 2, instructionBn: 'ডানপাশ থেকে কোণাকুণি বামে দীর্ঘ দাগ' }
    ],
    examples: [
      { japanese: 'アメリカ', romaji: 'amerika', bangla: 'আমেরিকা' },
      { japanese: 'アイス', romaji: 'aisu', bangla: 'আইসক্রিম' },
      { japanese: 'アニメ', romaji: 'anime', bangla: 'অ্যানিমেশন (অ্যানিমে)' }
    ]
  },
  {
    id: 'k_i',
    character: 'イ',
    type: 'katakana',
    row: 'a',
    level: 1,
    romaji: 'i',
    bangla: 'ই',
    strokeCount: 2,
    mnemonicBn: 'বামে কোণাকুণি দাগ এবং ডানে সোজা খাড়া দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে কোণাকুণি নিচে নামা দাগ' },
      { step: 2, instructionBn: 'ডানপাশে ওপর থেকে নিচে সোজা খাড়া দাগ' }
    ],
    examples: [
      { japanese: 'インド', romaji: 'indo', bangla: 'ভারত (ইন্ডিয়া)' },
      { japanese: 'イギリス', romaji: 'igirisu', bangla: 'যুক্তরাজ্য (ব্রিটেন)' },
      { japanese: 'イタリア', romaji: 'itaria', bangla: 'ইতালি' }
    ]
  },
  {
    id: 'k_u',
    character: 'ウ',
    type: 'katakana',
    row: 'a',
    level: 1,
    romaji: 'u',
    bangla: 'উ',
    strokeCount: 3,
    mnemonicBn: 'উপরে ছোট খাড়া দাগ, বামে ছোট দাগ এবং ডানে আনুভূমিক হয়ে নিচে বাঁকা।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরে ছোট খাড়া ফোঁটা' },
      { step: 2, instructionBn: 'বামপাশে ছোট খাড়া দাগ' },
      { step: 3, instructionBn: 'আনুভূমিক গিয়ে নিচে কোণাকুণি নামা' }
    ],
    examples: [
      { japanese: 'ウェブ', romaji: 'webu', bangla: 'ওয়েব / ওয়েবসাইট' },
      { japanese: 'ウイルス', romaji: 'uirusu', bangla: 'ভাইরাস' },
      { japanese: 'ウール', romaji: 'uuru', bangla: 'পশম / উল' }
    ]
  },
  {
    id: 'k_e',
    character: 'エ',
    type: 'katakana',
    row: 'a',
    level: 1,
    romaji: 'e',
    bangla: 'এ',
    strokeCount: 3,
    mnemonicBn: 'ইংরেজি বড় হাতের I এর মতো উপরে-নিচে দুটি সমান্তরাল দাগ এবং মাঝে খাড়া স্তম্ভ।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'মাঝের খাড়া সোজা দাগ' },
      { step: 3, instructionBn: 'নিচের দীর্ঘ আনুভূমিক দাগ' }
    ],
    examples: [
      { japanese: 'エレベーター', romaji: 'erebeetaa', bangla: 'লিফট / এলিভেটর' },
      { japanese: 'エアコン', romaji: 'eakon', bangla: 'এসি / এয়ার কন্ডিশনার' },
      { japanese: 'エプロン', romaji: 'epuron', bangla: 'অ্যাপ্রন' }
    ]
  },
  {
    id: 'k_o',
    character: 'オ',
    type: 'katakana',
    row: 'a',
    level: 1,
    romaji: 'o',
    bangla: 'ও',
    strokeCount: 3,
    mnemonicBn: 'আনুভূমিক দাগ, খাড়া দাগের নিচে হুক এবং বামপাশে কোণাকুণি ছেদক।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'ওপর থেকে খাড়া নেমে নিচে হুক' },
      { step: 3, instructionBn: 'বামপাশে কোণাকুণি নিচে নামা দাগ' }
    ],
    examples: [
      { japanese: 'オレンジ', romaji: 'orenji', bangla: 'কমলা (অরেঞ্জ)' },
      { japanese: 'オフィス', romaji: 'ofisu', bangla: 'অফিস' },
      { japanese: 'オーストラリア', romaji: 'oosutoraria', bangla: 'অস্ট্রেলিয়া' }
    ]
  },

  // Level 2: ka-row (カキクケコ)
  {
    id: 'k_ka',
    character: 'カ',
    type: 'katakana',
    row: 'ka',
    level: 2,
    romaji: 'ka',
    bangla: 'কা',
    strokeCount: 2,
    mnemonicBn: 'হিরাগানা か এর মতোই তবে ডানপাশের ফোঁটা ছাড়া সরল ও তীক্ষ্ণ।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক গিয়ে নিচে বাঁকিয়ে হুক' },
      { step: 2, instructionBn: 'ওপর থেকে কোণাকুণি ছেদক রেখা' }
    ],
    examples: [
      { japanese: 'カメラ', romaji: 'kamera', bangla: 'ক্যামেরা' },
      { japanese: 'カレー', romaji: 'karee', bangla: 'কারি (তরকারি)' },
      { japanese: 'カード', romaji: 'kaado', bangla: 'কার্ড' }
    ]
  },
  {
    id: 'k_ki',
    character: 'キ',
    type: 'katakana',
    row: 'ka',
    level: 2,
    romaji: 'ki',
    bangla: 'কি',
    strokeCount: 3,
    mnemonicBn: 'দুটি সমান্তরাল আনুভূমিক দাগ এবং ওপর থেকে কোণাকুণি নামা ছেদক।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'নিচের সমান্তরাল আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'ওপর থেকে কোণাকুণি নিচে নামা দাগ' }
    ],
    examples: [
      { japanese: 'キーボード', romaji: 'kiiboodo', bangla: 'কীবোর্ড' },
      { japanese: 'キッチン', romaji: 'kicchin', bangla: 'রান্নাঘর (কিচেন)' },
      { japanese: 'キャンプ', romaji: 'kyanpu', bangla: 'ক্যাম্প' }
    ]
  },
  {
    id: 'k_ku',
    character: 'ク',
    type: 'katakana',
    row: 'ka',
    level: 2,
    romaji: 'ku',
    bangla: 'কু',
    strokeCount: 2,
    mnemonicBn: 'বামে কোণাকুণি ছোট দাগ এবং ডানে আনুভূমিক গিয়ে দীর্ঘ বাঁকা হয়ে নামা।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে কোণাকুণি ছোট দাগ' },
      { step: 2, instructionBn: 'আনুভূমিক থেকে কোণাকুণি দীর্ঘ বাঁকা রেখা' }
    ],
    examples: [
      { japanese: 'クラス', romaji: 'kurasu', bangla: 'শ্রেণি / ক্লাস' },
      { japanese: 'クッキー', romaji: 'kukkii', bangla: 'কুকিজ' },
      { japanese: 'クレジットカード', romaji: 'kurejittokaado', bangla: 'ক্রেডিট কার্ড' }
    ]
  },
  {
    id: 'k_ke',
    character: 'ケ',
    type: 'katakana',
    row: 'ka',
    level: 2,
    romaji: 'ke',
    bangla: 'কে',
    strokeCount: 3,
    mnemonicBn: 'বামে কোণাকুণি দাগ, মাঝে আনুভূমিক দাগ এবং ওপর থেকে বাঁকা ছেদক।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে কোণাকুণি ছোট দাগ' },
      { step: 2, instructionBn: 'মাঝে আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'মাঝখান দিয়ে কোণাকুণি নিচে নামা দাগ' }
    ],
    examples: [
      { japanese: 'ケーキ', romaji: 'keeki', bangla: 'কেক' },
      { japanese: 'ケース', romaji: 'keesu', bangla: 'কেস / বাক্স' },
      { japanese: 'ケータイ', romaji: 'keetai', bangla: 'মোবাইল ফোন' }
    ]
  },
  {
    id: 'k_ko',
    character: 'コ',
    type: 'katakana',
    row: 'ka',
    level: 2,
    romaji: 'ko',
    bangla: 'কো',
    strokeCount: 2,
    mnemonicBn: 'একটি বক্স বা আয়তক্ষেত্রের ডান ও নিচের অংশ (খোলা বাক্স)।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক গিয়ে নিচে খাড়া নামা' },
      { step: 2, instructionBn: 'নিচের সমান্তরাল আনুভূমিক দাগ' }
    ],
    examples: [
      { japanese: 'コーヒー', romaji: 'koohii', bangla: 'কফি' },
      { japanese: 'コンピューター', romaji: 'konpyuutaa', bangla: 'কম্পিউটার' },
      { japanese: 'コート', romaji: 'kooto', bangla: 'কোট (পোশাক)' }
    ]
  },

  // Level 3: sa-row (サシスセソ)
  {
    id: 'k_sa',
    character: 'サ',
    type: 'katakana',
    row: 'sa',
    level: 3,
    romaji: 'sa',
    bangla: 'সা',
    strokeCount: 3,
    mnemonicBn: 'একটি দীর্ঘ আনুভূমিক দাগ এবং নিচে দুটি খাড়া নামা রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে দীর্ঘ আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'বামপাশে খাড়া ছোট দাগ' },
      { step: 3, instructionBn: 'ডানপাশে খাড়া দীর্ঘ দাগ' }
    ],
    examples: [
      { japanese: 'サラダ', romaji: 'sarada', bangla: 'সালাদ' },
      { japanese: 'サッカー', romaji: 'sakkaa', bangla: 'ফুটবল (সকার)' },
      { japanese: 'サイン', romaji: 'sain', bangla: 'স্বাক্ষর (সাইন)' }
    ]
  },
  {
    id: 'k_shi',
    character: 'シ',
    type: 'katakana',
    row: 'sa',
    level: 3,
    romaji: 'shi',
    bangla: 'শি',
    strokeCount: 3,
    mnemonicBn: 'দুটি ছোট কোণাকুণি ফোঁটা এবং নিচ থেকে ওপরের দিকে ওঠা দীর্ঘ রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের বামে ছোট ফোঁটা' },
      { step: 2, instructionBn: 'নিচের বামে ছোট ফোঁটা' },
      { step: 3, instructionBn: 'নিচ থেকে ওপরের ডানদিকে সোয়াইপ করে ওঠা দাগ' }
    ],
    examples: [
      { japanese: 'シャツ', romaji: 'shatsu', bangla: 'শার্ট' },
      { japanese: 'シャワー', romaji: 'shawaa', bangla: 'গোসল / শাওয়ার' },
      { japanese: 'システム', romaji: 'shisutemu', bangla: 'সিস্টেম' }
    ]
  },
  {
    id: 'k_su',
    character: 'ス',
    type: 'katakana',
    row: 'sa',
    level: 3,
    romaji: 'su',
    bangla: 'সু',
    strokeCount: 2,
    mnemonicBn: 'আনুভূমিক থেকে কোণাকুণি নিচে নামা এবং ডানপাশে ছেদক রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক গিয়ে কোণাকুণি নিচে বামে নামা' },
      { step: 2, instructionBn: 'মাঝখান থেকে ডানে কোণাকুণি নিচে নামা' }
    ],
    examples: [
      { japanese: 'スーパー', romaji: 'suupaa', bangla: 'সুপারমার্কেট' },
      { japanese: 'スポーツ', romaji: 'supootsu', bangla: 'খেলাধুলা (স্পোর্টস)' },
      { japanese: 'スプーン', romaji: 'supuun', bangla: 'চামচ (স্পুন)' }
    ]
  },
  {
    id: 'k_se',
    character: 'セ',
    type: 'katakana',
    row: 'sa',
    level: 3,
    romaji: 'se',
    bangla: 'সে',
    strokeCount: 2,
    mnemonicBn: 'আনুভূমিক থেকে নিচে নেমে হুক এবং ডানে খাড়া রেখা ও এল (L) আকৃতি।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক গিয়ে নিচে খাড়া নেমে হুক' },
      { step: 2, instructionBn: 'ওপর থেকে নেমে ডানে আনুভূমিক টানা' }
    ],
    examples: [
      { japanese: 'セーター', romaji: 'seetaa', bangla: 'সোয়েটার' },
      { japanese: 'サービス', romaji: 'saabisu', bangla: 'সেবা (সার্ভিস)' },
      { japanese: 'セット', romaji: 'setto', bangla: 'সেট' }
    ]
  },
  {
    id: 'k_so',
    character: 'ソ',
    type: 'katakana',
    row: 'sa',
    level: 3,
    romaji: 'so',
    bangla: 'সো',
    strokeCount: 2,
    mnemonicBn: 'উপরে ছোট কোণাকুণি ফোঁটা এবং ওপর থেকে নিচের দিকে নামা দীর্ঘ দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরে বামে ছোট কোণাকুণি দাগ' },
      { step: 2, instructionBn: 'ওপর থেকে নিচে বামে নামা দীর্ঘ দাগ' }
    ],
    examples: [
      { japanese: 'ソファ', romaji: 'sofa', bangla: 'সোফা' },
      { japanese: 'ソフト', romaji: 'sofuto', bangla: 'সফটওয়্যার' },
      { japanese: 'ソース', romaji: 'soosu', bangla: 'সস' }
    ]
  },

  // Level 4: ta-row (タチツテト)
  {
    id: 'k_ta',
    character: 'タ',
    type: 'katakana',
    row: 'ta',
    level: 4,
    romaji: 'ta',
    bangla: 'তা',
    strokeCount: 3,
    mnemonicBn: 'ク (ku) অক্ষরের ভেতর একটি কোণাকুণি ছেদক দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে কোণাকুণি ছোট দাগ' },
      { step: 2, instructionBn: 'আনুভূমিক গিয়ে কোণাকুণি নিচে নামা' },
      { step: 3, instructionBn: 'মাঝে কোণাকুণি ছেদক দাগ' }
    ],
    examples: [
      { japanese: 'タクシー', romaji: 'takushii', bangla: 'ট্যাক্সি' },
      { japanese: 'タオル', romaji: 'taoru', bangla: 'তোয়ালে (টাওয়েল)' },
      { japanese: 'タイプ', romaji: 'taipu', bangla: 'টাইপ / ধরন' }
    ]
  },
  {
    id: 'k_chi',
    character: 'チ',
    type: 'katakana',
    row: 'ta',
    level: 4,
    romaji: 'chi',
    bangla: 'চি',
    strokeCount: 3,
    mnemonicBn: 'উপরে কোণাকুণি দাগ, আনুভূমিক রেখা এবং খাড়া বাঁকা ছেদক।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরে কোণাকুণি বামে নামা দাগ' },
      { step: 2, instructionBn: 'মাঝে আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'ওপর থেকে নিচে নামা বাঁকা দাগ' }
    ],
    examples: [
      { japanese: 'チーズ', romaji: 'chiizu', bangla: 'পনির (চীজ)' },
      { japanese: 'チケット', romaji: 'chiketto', bangla: 'টিকেট' },
      { japanese: 'チーム', romaji: 'chiimu', bangla: 'দল (টিম)' }
    ]
  },
  {
    id: 'k_tsu',
    character: 'ツ',
    type: 'katakana',
    row: 'ta',
    level: 4,
    romaji: 'tsu',
    bangla: 'ৎসু',
    strokeCount: 3,
    mnemonicBn: 'উপরে দুটি আনুভূমিক সমান্তরাল ফোঁটা এবং ওপর থেকে নিচে নামা দীর্ঘ দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের বামে ছোট ফোঁটা' },
      { step: 2, instructionBn: 'উপরের ডানে ছোট ফোঁটা' },
      { step: 3, instructionBn: 'ওপর থেকে নিচে বামে নামা দীর্ঘ দাগ' }
    ],
    examples: [
      { japanese: 'ツアー', romaji: 'tsuaa', bangla: 'ভ্রমণ (ট্যুর)' },
      { japanese: 'ツナ', romaji: 'tsuna', bangla: 'টুনা মাছ' },
      { japanese: 'スーツ', romaji: 'suutsu', bangla: 'স্যুট (পোশাক)' }
    ]
  },
  {
    id: 'k_te',
    character: 'テ',
    type: 'katakana',
    row: 'ta',
    level: 4,
    romaji: 'te',
    bangla: 'তে',
    strokeCount: 3,
    mnemonicBn: 'দুটি আনুভূমিক রেখা এবং নিচে নামা বাঁকা স্তম্ভ।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের ছোট আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'নিচের দীর্ঘ আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'মাঝখান থেকে নিচে বাঁকা দাগ' }
    ],
    examples: [
      { japanese: 'テレビ', romaji: 'terebi', bangla: 'টেলিভিশন (টিভি)' },
      { japanese: 'テスト', romaji: 'tesuto', bangla: 'পরীক্ষা (টেস্ট)' },
      { japanese: 'テーブル', romaji: 'teeburu', bangla: 'টেবিল' }
    ]
  },
  {
    id: 'k_to',
    character: 'ト',
    type: 'katakana',
    row: 'ta',
    level: 4,
    romaji: 'to',
    bangla: 'তো',
    strokeCount: 2,
    mnemonicBn: 'খাড়া স্তম্ভ এবং ডানপাশে কোণাকুণি শাখা দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে নিচে সোজা খাড়া দাগ' },
      { step: 2, instructionBn: 'মাঝখান থেকে ডানে কোণাকুণি নিচে নামা দাগ' }
    ],
    examples: [
      { japanese: 'トマト', romaji: 'tomato', bangla: 'টমেটো' },
      { japanese: 'トイレ', romaji: 'toire', bangla: 'টয়লেট / বাথরুম' },
      { japanese: 'ドア', romaji: 'doa', bangla: 'দরজা (ডোর)' }
    ]
  },

  // Level 5: na-row (ナニヌネノ)
  {
    id: 'k_na',
    character: 'ナ',
    type: 'katakana',
    row: 'na',
    level: 5,
    romaji: 'na',
    bangla: 'না',
    strokeCount: 2,
    mnemonicBn: 'একটি আনুভূমিক রেখা এবং ওপর থেকে কোণাকুণি বামে নামা দীর্ঘ ছেদক।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'মাঝখান থেকে নিচে বামে কোণাকুণি বাঁকা দাগ' }
    ],
    examples: [
      { japanese: 'ナイフ', romaji: 'naifu', bangla: 'ছুরি (নাইফ)' },
      { japanese: 'ナプキン', romaji: 'napukin', bangla: 'ন্যাপকিন' },
      { japanese: 'バナナ', romaji: 'banana', bangla: 'কলা (ব্যানানা)' }
    ]
  },
  {
    id: 'k_ni',
    character: 'ニ',
    type: 'katakana',
    row: 'na',
    level: 5,
    romaji: 'ni',
    bangla: 'নি',
    strokeCount: 2,
    mnemonicBn: 'দুটি সমান্তরাল আনুভূমিক রেখা (জাপানি কাঞ্জি ২ এর মতো)।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের ছোট আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'নিচের দীর্ঘ আনুভূমিক দাগ' }
    ],
    examples: [
      { japanese: 'ニュース', romaji: 'nyuusu', bangla: 'সংবাদ (নিউজ)' },
      { japanese: 'ニューヨーク', romaji: 'nyuuyooku', bangla: 'নিউইয়র্ক' },
      { japanese: 'スニーカー', romaji: 'suniikaa', bangla: 'স্নিকার্স (জুতো)' }
    ]
  },
  {
    id: 'k_nu',
    character: 'ヌ',
    type: 'katakana',
    row: 'na',
    level: 5,
    romaji: 'nu',
    bangla: 'নু',
    strokeCount: 2,
    mnemonicBn: 'আনুভূমিক থেকে কোণাকুণি নামা এবং ডানে ছেদক দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক গিয়ে নিচে কোণাকুণি বাঁকা দাগ' },
      { step: 2, instructionBn: 'মাঝখান থেকে কোণাকুণি ডানে নামা ছেদক দাগ' }
    ],
    examples: [
      { japanese: 'カヌー', romaji: 'kanuu', bangla: 'ডিঙি নৌকা (ক্যানু)' },
      { japanese: 'ヌードル', romaji: 'nuudoru', bangla: 'নুডলস' },
      { japanese: 'イヌイット', romaji: 'inuitto', bangla: 'ইনুইট (এস্কিমো)' }
    ]
  },
  {
    id: 'k_ne',
    character: 'ネ',
    type: 'katakana',
    row: 'na',
    level: 5,
    romaji: 'ne',
    bangla: 'নে',
    strokeCount: 4,
    mnemonicBn: 'উপরে ফোঁটা, আনুভূমিক ও কোণাকুণি নামা, খাড়া দাগ এবং ডানপাশের ফোঁটা।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরে ছোট কোণাকুণি ফোঁটা' },
      { step: 2, instructionBn: 'আনুভূমিক গিয়ে নিচে বাঁকা' },
      { step: 3, instructionBn: 'মাঝখান দিয়ে খাড়া সোজা দাগ' },
      { step: 4, instructionBn: 'ডানপাশে ছোট কোণাকুণি দাগ' }
    ],
    examples: [
      { japanese: 'ネクタイ', romaji: 'nekutai', bangla: 'নেকটাই' },
      { japanese: 'ネット', romaji: 'netto', bangla: 'ইন্টারনেট / নেট' },
      { japanese: 'ノート', romaji: 'nooto', bangla: 'নোটবুক / খাতা' }
    ]
  },
  {
    id: 'k_no',
    character: 'ノ',
    type: 'katakana',
    row: 'na',
    level: 5,
    romaji: 'no',
    bangla: 'নো',
    strokeCount: 1,
    mnemonicBn: 'এক টানে ওপর থেকে নিচে বামে নেমে যাওয়া মসৃণ কোণাকুণি দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে নিচে বামে কোণাকুণি মসৃণ রেখা' }
    ],
    examples: [
      { japanese: 'ノート', romaji: 'nooto', bangla: 'নোটবুক' },
      { japanese: 'ノルウェー', romaji: 'noruwee', bangla: 'নরওয়ে' },
      { japanese: 'ピアノ', romaji: 'piano', bangla: 'পিয়ানো' }
    ]
  },

  // Level 6: ha-row (ハヒフヘホ)
  {
    id: 'k_ha',
    character: 'ハ',
    type: 'katakana',
    row: 'ha',
    level: 6,
    romaji: 'ha',
    bangla: 'হা',
    strokeCount: 2,
    mnemonicBn: 'পাহাড়ের মতো দুটি বিপরীতমুখী কোণাকুণি দাগ (কাঞ্জি ৮ এর মতো)।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে কোণাকুণি নিচে নামা দাগ' },
      { step: 2, instructionBn: 'ডানপাশে কোণাকুণি নিচে নামা দাগ' }
    ],
    examples: [
      { japanese: 'ハンバーガー', romaji: 'hanbaagaa', bangla: 'বার্গার' },
      { japanese: 'ハワイ', romaji: 'hawai', bangla: 'হাওয়াই' },
      { japanese: 'ハム', romaji: 'hamu', bangla: 'হ্যাম' }
    ]
  },
  {
    id: 'k_hi',
    character: 'ヒ',
    type: 'katakana',
    row: 'ha',
    level: 6,
    romaji: 'hi',
    bangla: 'হি',
    strokeCount: 2,
    mnemonicBn: 'উপরে আনুভূমিক দাগ এবং খাড়া নেমে ডানে বাঁকানো এল (L) আকৃতি।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক ছোট দাগ' },
      { step: 2, instructionBn: 'ওপর থেকে নেমে ডানে সোজা লম্বা দাগ' }
    ],
    examples: [
      { japanese: 'ヒーロー', romaji: 'hiiroo', bangla: 'হিরো / নায়ক' },
      { japanese: 'ヒーター', romaji: 'hiitaa', bangla: 'হিটার' },
      { japanese: 'コーヒー', romaji: 'koohii', bangla: 'কফি' }
    ]
  },
  {
    id: 'k_fu',
    character: 'フ',
    type: 'katakana',
    row: 'ha',
    level: 6,
    romaji: 'fu',
    bangla: 'ফু',
    strokeCount: 1,
    mnemonicBn: 'এক টানে আনুভূমিক গিয়ে কোণাকুণি নিচে নেমে যাওয়া।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক গিয়ে নিচে বামে কোণাকুণি নামা' }
    ],
    examples: [
      { japanese: 'フォーク', romaji: 'fooku', bangla: 'কাঁটাচামচ (ফর্ক)' },
      { japanese: 'フランス', romaji: 'furansu', bangla: 'ফ্রান্স' },
      { japanese: 'フルーツ', romaji: 'furuutsu', bangla: 'ফলমূল (ফ্রুটস)' }
    ]
  },
  {
    id: 'k_he',
    character: 'ヘ',
    type: 'katakana',
    row: 'ha',
    level: 6,
    romaji: 'he',
    bangla: 'হে',
    strokeCount: 1,
    mnemonicBn: 'হিরাগানা へ এর অনুরূপ পাহাড়ের চূড়ার মতো এক টানে আঁকা রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'কোণাকুণি ওপরে উঠে ডানে নিচে নামা' }
    ],
    examples: [
      { japanese: 'ヘリコプター', romaji: 'herikoputaa', bangla: 'হেলিকপ্টার' },
      { japanese: 'ヘルメット', romaji: 'herumetto', bangla: 'হেলমেট' },
      { japanese: 'ヘッドホン', romaji: 'heddohon', bangla: 'হেডফোন' }
    ]
  },
  {
    id: 'k_ho',
    character: 'ホ',
    type: 'katakana',
    row: 'ha',
    level: 6,
    romaji: 'ho',
    bangla: 'হো',
    strokeCount: 4,
    mnemonicBn: 'ক্রস আকৃতির ওপর-নিচে দাগ এবং দুই পাশে দুটি বিপরীতমুখী ফোঁটা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বাম থেকে ডানে আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'মাঝখান দিয়ে খাড়া সোজা দাগ ও হুক' },
      { step: 3, instructionBn: 'বামপাশে ছোট কোণাকুণি দাগ' },
      { step: 4, instructionBn: 'ডানপাশে ছোট কোণাকুণি দাগ' }
    ],
    examples: [
      { japanese: 'ホテル', romaji: 'hoteru', bangla: 'হোটেল' },
      { japanese: 'ホワイト', romaji: 'howaito', bangla: 'সাদা (হোয়াইট)' },
      { japanese: 'ホット', romaji: 'hotto', bangla: 'গরম (হট)' }
    ]
  },

  // Level 7: ma-row (マミムメモ)
  {
    id: 'k_ma',
    character: 'マ',
    type: 'katakana',
    row: 'ma',
    level: 7,
    romaji: 'ma',
    bangla: 'মা',
    strokeCount: 2,
    mnemonicBn: 'আনুভূমিক থেকে কোণাকুণি নেমে নিচে ছোট ফোঁটা।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক গিয়ে নিচে বামে কোণাকুণি নামা' },
      { step: 2, instructionBn: 'নিচের দিকে ছোট কোণাকুণি ফোঁটা' }
    ],
    examples: [
      { japanese: 'マスク', romaji: 'masuku', bangla: 'মাস্ক' },
      { japanese: 'マンゴー', romaji: 'mangoo', bangla: 'আম (ম্যাঙ্গো)' },
      { japanese: 'マイク', romaji: 'maiku', bangla: 'মাইক্রোফোন' }
    ]
  },
  {
    id: 'k_mi',
    character: 'ミ',
    type: 'katakana',
    row: 'ma',
    level: 7,
    romaji: 'mi',
    bangla: 'মি',
    strokeCount: 3,
    mnemonicBn: 'তিনটি সমান্তরাল কোণাকুণি দাগ (কাঞ্জি ৩ এর মতো)।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের কোণাকুণি দাগ' },
      { step: 2, instructionBn: 'মাঝের কোণাকুণি দাগ' },
      { step: 3, instructionBn: 'নিচের কোণাকুণি দাগ' }
    ],
    examples: [
      { japanese: 'ミルク', romaji: 'miruku', bangla: 'দুধ (মিল্ক)' },
      { japanese: 'ミシン', romaji: 'mishin', bangla: 'সেলাই মেশিন' },
      { japanese: 'ミネラル', romaji: 'mineraru', bangla: 'খনিজ (মিনারেল)' }
    ]
  },
  {
    id: 'k_mu',
    character: 'ム',
    type: 'katakana',
    row: 'ma',
    level: 7,
    romaji: 'mu',
    bangla: 'মু',
    strokeCount: 2,
    mnemonicBn: 'ত্রিভুজের মতো দুটি রেখা—কোণাকুণি নেমে আনুভূমিক গিয়ে শেষ হওয়া।',
    strokeSteps: [
      { step: 1, instructionBn: 'কোণাকুণি নেমে ডানে আনুভূমিক যাওয়া' },
      { step: 2, instructionBn: 'ডানপাশে কোণাকুণি ছোট দাগ' }
    ],
    examples: [
      { japanese: 'ムード', romaji: 'muudo', bangla: 'মেজাজ / পরিবেশ (মুড)' },
      { japanese: 'ミュージアム', romaji: 'myuujiamu', bangla: 'জাদুঘর (মিউজিয়াম)' },
      { japanese: 'ゲーム', romaji: 'geemu', bangla: 'খেলা (গেম)' }
    ]
  },
  {
    id: 'k_me',
    character: 'メ',
    type: 'katakana',
    row: 'ma',
    level: 7,
    romaji: 'me',
    bangla: 'মে',
    strokeCount: 2,
    mnemonicBn: 'একটি এক্স (X) বা তরবারি ক্রসের মতো দুটি ছেদক রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে নিচে বামে নামা দাগ' },
      { step: 2, instructionBn: 'ওপর থেকে নিচে ডানে নামা ছেদক দাগ' }
    ],
    examples: [
      { japanese: 'メール', romaji: 'meeru', bangla: 'ইমেইল / বার্তা' },
      { japanese: 'メニュー', romaji: 'menyuu', bangla: 'মেনু তালিকা' },
      { japanese: 'メッセージ', romaji: 'messeji', bangla: 'বার্তা' }
    ]
  },
  {
    id: 'k_mo',
    character: 'モ',
    type: 'katakana',
    row: 'ma',
    level: 7,
    romaji: 'mo',
    bangla: 'মো',
    strokeCount: 3,
    mnemonicBn: 'দুটি আনুভূমিক রেখা এবং ওপর থেকে নেমে ডানে এল (L) আকৃতির রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'নিচের দীর্ঘ আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'ওপর থেকে নেমে ডানে সোজা যাওয়া' }
    ],
    examples: [
      { japanese: 'モデル', romaji: 'moderu', bangla: 'মডেল' },
      { japanese: 'モーター', romaji: 'mootaa', bangla: 'মোটর' },
      { japanese: 'モール', romaji: 'mooru', bangla: 'শপিং মল' }
    ]
  },

  // Level 8: ya-row (ヤユヨ)
  {
    id: 'k_ya',
    character: 'ヤ',
    type: 'katakana',
    row: 'ya',
    level: 8,
    romaji: 'ya',
    bangla: 'ইয়া',
    strokeCount: 2,
    mnemonicBn: 'হিরাগানা や এর জ্যামিতিক রূপ—উপরে কোণ এবং নিচে কোণাকুণি ছেদক।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক গিয়ে নিচে বাঁকা' },
      { step: 2, instructionBn: 'ওপর থেকে কোণাকুণি নিচে নামা দাগ' }
    ],
    examples: [
      { japanese: 'ヤング', romaji: 'yangu', bangla: 'তরুণ / যুবক' },
      { japanese: 'タイヤ', romaji: 'taiya', bangla: 'টায়ার' },
      { japanese: 'ダイヤ', romaji: 'daiya', bangla: 'হীরা (ডায়মন্ড)' }
    ]
  },
  {
    id: 'k_yu',
    character: 'ユ',
    type: 'katakana',
    row: 'ya',
    level: 8,
    romaji: 'yu',
    bangla: 'ইউ',
    strokeCount: 2,
    mnemonicBn: 'একটি বক্স আকৃতি এবং নিচ দিয়ে বর্ধিত আনুভূমিক রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'আনুভূমিক গিয়ে নিচে খাড়া নামা' },
      { step: 2, instructionBn: 'নিচ দিয়ে ডানে দীর্ঘ আনুভূমিক দাগ' }
    ],
    examples: [
      { japanese: 'ユニフォーム', romaji: 'yunifoomu', bangla: 'পোশাক (ইউনিফর্ম)' },
      { japanese: 'ユーモア', romaji: 'yuumoa', bangla: 'রসবোধ (হিউমার)' },
      { japanese: 'ユーザー', romaji: 'yuuzaa', bangla: 'ব্যবহারকারী (ইউজার)' }
    ]
  },
  {
    id: 'k_yo',
    character: 'ヨ',
    type: 'katakana',
    row: 'ya',
    level: 8,
    romaji: 'yo',
    bangla: 'ইয়ো',
    strokeCount: 3,
    mnemonicBn: 'ইংরেজি বড় হাতের E এর বিপরীতমুখী বা ৩টি দাঁতওয়ালা চিরুনির মতো আকৃতি।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের আনুভূমিক হয়ে নিচে খাড়া নামা' },
      { step: 2, instructionBn: 'মাঝের আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'নিচের দীর্ঘ আনুভূমিক দাগ' }
    ],
    examples: [
      { japanese: 'ヨーグルト', romaji: 'yooguruto', bangla: 'দই (দই / ইয়োগার্ট)' },
      { japanese: 'ヨーロッパ', romaji: 'yooroppa', bangla: 'ইউরোপ' },
      { japanese: 'ヨガ', romaji: 'yoga', bangla: 'যোগব্যায়াম (ইয়োগা)' }
    ]
  },

  // Level 9: ra-row (ラリルレロ)
  {
    id: 'k_ra',
    character: 'ラ',
    type: 'katakana',
    row: 'ra',
    level: 9,
    romaji: 'ra',
    bangla: 'রা',
    strokeCount: 2,
    mnemonicBn: 'উপরে ছোট আনুভূমিক দাগ এবং নিচে フ (fu) অক্ষরের মতো বাঁকা রেখা।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'নিচে আনুভূমিক গিয়ে বামে কোণাকুণি নামা' }
    ],
    examples: [
      { japanese: 'ラジオ', romaji: 'rajio', bangla: 'রেডিও' },
      { japanese: 'ラーメン', romaji: 'raamen', bangla: 'রামেন নুডলস' },
      { japanese: 'ライオン', romaji: 'raion', bangla: 'সিংহ (লায়ন)' }
    ]
  },
  {
    id: 'k_ri',
    character: 'リ',
    type: 'katakana',
    row: 'ra',
    level: 9,
    romaji: 'ri',
    bangla: 'রি',
    strokeCount: 2,
    mnemonicBn: 'বামে খাড়া ছোট দাগ এবং ডানে দীর্ঘ বাঁকা সোজা দাগ।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে ওপর থেকে ছোট খাড়া দাগ' },
      { step: 2, instructionBn: 'ডানপাশে ওপর থেকে দীর্ঘ সোজা দাগ' }
    ],
    examples: [
      { japanese: 'リンゴ', romaji: 'ringo', bangla: 'আপেল' },
      { japanese: 'リモコン', romaji: 'rimokon', bangla: 'রিমোট কন্ট্রোল' },
      { japanese: 'リーダー', romaji: 'riidaa', bangla: 'নেতা (লিডার)' }
    ]
  },
  {
    id: 'k_ru',
    character: 'ル',
    type: 'katakana',
    row: 'ra',
    level: 9,
    romaji: 'ru',
    bangla: 'রু',
    strokeCount: 2,
    mnemonicBn: 'বামে কোণাকুণি দাগ এবং ডানে নিচে বাঁকিয়ে ওপরের দিকে হুক।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে ওপর থেকে নিচে কোণাকুণি দাগ' },
      { step: 2, instructionBn: 'ডানপাশে নিচে নেমে ডানদিকে বাঁকিয়ে ওপরে হুক' }
    ],
    examples: [
      { japanese: 'ルール', romaji: 'ruuru', bangla: 'নিয়ম (রুল)' },
      { japanese: 'ルビー', romaji: 'rubii', bangla: 'চুনি পাথর (রুবি)' },
      { japanese: 'ホテル', romaji: 'hoteru', bangla: 'হোটেল' }
    ]
  },
  {
    id: 'k_re',
    character: 'レ',
    type: 'katakana',
    row: 'ra',
    level: 9,
    romaji: 're',
    bangla: 'রে',
    strokeCount: 1,
    mnemonicBn: 'এক টানে ওপর থেকে সোজা নিচে নেমে ডানদিকে ওপরে উঠে যাওয়া।',
    strokeSteps: [
      { step: 1, instructionBn: 'ওপর থেকে নিচে নেমে ডানদিকে ওপরে সোয়াইপ' }
    ],
    examples: [
      { japanese: 'レストラン', romaji: 'resutoran', bangla: 'রেস্তোরাঁ' },
      { japanese: 'レモン', romaji: 'remon', bangla: 'লেবু (লেমন)' },
      { japanese: 'レポート', romaji: 'repooto', bangla: 'প্রতিবেদন (রিপোর্ট)' }
    ]
  },
  {
    id: 'k_ro',
    character: 'ロ',
    type: 'katakana',
    row: 'ra',
    level: 9,
    romaji: 'ro',
    bangla: 'রো',
    strokeCount: 3,
    mnemonicBn: 'একটি সম্পূর্ণ নিখুঁত চতুর্ভুজ বা স্কয়ার বক্স।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে খাড়া সোজা দাগ' },
      { step: 2, instructionBn: 'উপরে আনুভূমিক হয়ে ডানে খাড়া নামা' },
      { step: 3, instructionBn: 'নিচের আনুভূমিক দাগ দিয়ে বাক্স বন্ধ করা' }
    ],
    examples: [
      { japanese: 'ロボット', romaji: 'robotto', bangla: 'রোবট' },
      { japanese: 'ロッカー', romaji: 'rokkaa', bangla: 'লকার' },
      { japanese: 'ロシア', romaji: 'roshia', bangla: 'রাশিয়া' }
    ]
  },

  // Level 10: wa-row (ワヲン)
  {
    id: 'k_wa',
    character: 'ワ',
    type: 'katakana',
    row: 'wa',
    level: 10,
    romaji: 'wa',
    bangla: 'ওয়া',
    strokeCount: 2,
    mnemonicBn: 'বামে খাড়া ছোট দাগ এবং ডানে আনুভূমিক হয়ে কোণাকুণি নিচে নামা।',
    strokeSteps: [
      { step: 1, instructionBn: 'বামপাশে ছোট খাড়া দাগ' },
      { step: 2, instructionBn: 'আনুভূমিক গিয়ে নিচে বামে বাঁকা দাগ' }
    ],
    examples: [
      { japanese: 'ワイン', romaji: 'wain', bangla: 'ওয়াইন (আঙুরের রস)' },
      { japanese: 'ワイシャツ', romaji: 'waishatsu', bangla: 'হোয়াইট শার্ট' },
      { japanese: 'ワールド', romaji: 'waarudo', bangla: 'বিশ্ব (ওয়ার্ল্ড)' }
    ]
  },
  {
    id: 'k_wo',
    character: 'ヲ',
    type: 'katakana',
    row: 'wa',
    level: 10,
    romaji: 'wo',
    bangla: 'ও',
    strokeCount: 3,
    mnemonicBn: 'দুটি আনুভূমিক রেখা এবং কোণাকুণি বাঁকা রেখা (আধুনিক কাতাকানায় বিরল)।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের আনুভূমিক দাগ' },
      { step: 2, instructionBn: 'নিচের আনুভূমিক দাগ' },
      { step: 3, instructionBn: 'ওপর থেকে কোণাকুণি বাঁকা দাগ' }
    ],
    examples: [
      { japanese: 'ヲタク', romaji: 'wotaku', bangla: 'ওতাকু (অ্যানিমে ভক্ত - বিকল্প বানান)' },
      { japanese: 'ヲト', romaji: 'woto', bangla: 'শব্দ (ঐতিহাসিক রূপ)' },
      { japanese: 'パン ヲ タベル', romaji: 'pan o taberu', bangla: 'রুটি খাওয়া (পার্টিকেল রূপ)' }
    ]
  },
  {
    id: 'k_n',
    character: 'ン',
    type: 'katakana',
    row: 'wa',
    level: 10,
    romaji: 'n',
    bangla: 'ন',
    strokeCount: 2,
    mnemonicBn: 'একটি ছোট কোণাকুণি ফোঁটা এবং নিচ থেকে ওপরের দিকে সোয়াইপ (シ এর সাথে পার্থক্য খেয়াল করুন, ン এ ১টি ফোঁটা)।',
    strokeSteps: [
      { step: 1, instructionBn: 'উপরের বামে ছোট কোণাকুণি ফোঁটা' },
      { step: 2, instructionBn: 'নিচ থেকে ওপরের ডানদিকে উঠে যাওয়া সোয়াইপ' }
    ],
    examples: [
      { japanese: 'パン', romaji: 'pan', bangla: 'পাউরুটি (ব্রেড)' },
      { japanese: 'ペン', romaji: 'pen', bangla: 'কলম (পেন)' },
      { japanese: 'レモン', romaji: 'remon', bangla: 'লেবু' }
    ]
  }
];

export const KATAKANA_LEVELS: KanaLevel[] = [
  {
    level: 1,
    type: 'katakana',
    titleBn: 'Level 1 : A-সারি (ア イ ウ エ オ)',
    titleJp: 'ア行 (アイウエオ)',
    descriptionBn: 'কাতাকানার মূল ৫টি স্বরবর্ণ',
    characters: KATAKANA_CHARS.filter(c => c.level === 1)
  },
  {
    level: 2,
    type: 'katakana',
    titleBn: 'Level 2 : Ka-সারি (カ キ ク ケ コ)',
    titleJp: 'カ行 (カキクケコ)',
    descriptionBn: '‘K’ ব্যঞ্জনধ্বনি যুক্ত ৫টি কাতাকানা বর্ণ',
    characters: KATAKANA_CHARS.filter(c => c.level === 2)
  },
  {
    level: 3,
    type: 'katakana',
    titleBn: 'Level 3 : Sa-সারি (サ シ ス セ ソ)',
    titleJp: 'サ行 (サシスセソ)',
    descriptionBn: '‘S’ ব্যঞ্জনধ্বনি (লক্ষ্য করুন: シ = shi ও ソ = so)',
    characters: KATAKANA_CHARS.filter(c => c.level === 3)
  },
  {
    level: 4,
    type: 'katakana',
    titleBn: 'Level 4 : Ta-সারি (タ チ ツ テ ト)',
    titleJp: 'タ行 (タチツテト)',
    descriptionBn: '‘T’ ব্যঞ্জনধ্বনি (লক্ষ্য করুন: チ = chi, ツ = tsu)',
    characters: KATAKANA_CHARS.filter(c => c.level === 4)
  },
  {
    level: 5,
    type: 'katakana',
    titleBn: 'Level 5 : Na-সারি (ナ ニ ヌ ネ ノ)',
    titleJp: 'ナ行 (ナニヌネノ)',
    descriptionBn: '‘N’ ব্যঞ্জনধ্বনি যুক্ত ৫টি কাতাকানা বর্ণ',
    characters: KATAKANA_CHARS.filter(c => c.level === 5)
  },
  {
    level: 6,
    type: 'katakana',
    titleBn: 'Level 6 : Ha-সারি (ハ ヒ フ ヘ ホ)',
    titleJp: 'ハ行 (ハヒフヘホ)',
    descriptionBn: '‘H’ ব্যঞ্জনধ্বনি (লক্ষ্য করুন: フ = fu)',
    characters: KATAKANA_CHARS.filter(c => c.level === 6)
  },
  {
    level: 7,
    type: 'katakana',
    titleBn: 'Level 7 : Ma-সারি (マ ミ ム メ モ)',
    titleJp: 'マ行 (マミムメモ)',
    descriptionBn: '‘M’ ব্যঞ্জনধ্বনি যুক্ত ৫টি কাতাকানা বর্ণ',
    characters: KATAKANA_CHARS.filter(c => c.level === 7)
  },
  {
    level: 8,
    type: 'katakana',
    titleBn: 'Level 8 : Ya-সারি (ヤ ユ ヨ)',
    titleJp: 'ヤ行 (ヤユヨ)',
    descriptionBn: '‘Y’ গ্লাইড ধ্বনি যুক্ত ৩টি কাতাকানা বর্ণ',
    characters: KATAKANA_CHARS.filter(c => c.level === 8)
  },
  {
    level: 9,
    type: 'katakana',
    titleBn: 'Level 9 : Ra-সারি (ラ リ ル レ ロ)',
    titleJp: 'ラ行 (ラリルレロ)',
    descriptionBn: 'কাতাকানা ‘R’ ব্যঞ্জনধ্বনি যুক্ত ৫টি বর্ণ',
    characters: KATAKANA_CHARS.filter(c => c.level === 9)
  },
  {
    level: 10,
    type: 'katakana',
    titleBn: 'Level 10 : Wa-সারি ও বিশেষ ‘ন্’ (ワ ヲ ン)',
    titleJp: 'ワ行・ン (ワヲン)',
    descriptionBn: 'কাতাকানা ‘ワ’, ‘ヲ’ এবং একক নাসিক্য ‘ン’',
    characters: KATAKANA_CHARS.filter(c => c.level === 10)
  }
];
