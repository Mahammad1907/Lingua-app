import { Lesson } from './types';

// ═══════════════════════════════════════
// DƏRSLƏR
// ═══════════════════════════════════════

export const lessons: Lesson[] = [
  {
    id: 'a1_en_01_d1_1',
    title: 'Greetings',
    titleAz: 'Salamlaşma',
    description:
      'Hello, Hi, Good morning, Good afternoon, Good evening',
    language: 'en',
    level: 'A1',
    moduleId: 'module_1',
    order: 1,
    xpReward: 15,
    estimatedTime: 7,

    focus: 'vocabulary',
    parentGroup: 'd1',
    subOrder: 1,
    isReview: false,

    canDo:
      'Mən salam verə və günün vaxtına uyğun salamlaşma ifadəsi seçə bilirəm.',
    situation:
      'Kursda, kitabxanada və axşam görüşündə insanlarla salamlaşırsan.',

    vocabulary: [
      {
        id: 'a1_en_01_d1_1_v01',
        word: 'Hello',
        translation: 'Salam',
        pronunciation: '/həˈləʊ/',
        example: 'Hello, Sara!',
        exampleAz: 'Salam, Sara!',
        usageNote:
          'Neytral salamlaşmadır. Günün istənilən vaxtında, tanış və tanımadığın insanlarla işlədə bilərsən. Qarşı tərəf "Hello" deyəndə sən "Hi" ilə də cavab verə bilərsən.',
        imageEmoji: '👋',
      },
      {
        id: 'a1_en_01_d1_1_v02',
        word: 'Hi',
        translation: 'Salam',
        pronunciation: '/haɪ/',
        example: 'Hi, Sara!',
        exampleAz: 'Salam, Sara!',
        usageNote:
          'Daha səmimi salamlaşmadır. Dostunla və sinif yoldaşınla danışanda uyğundur. Nəzakətsiz ifadə deyil.',
        imageEmoji: '🙋',
      },
      {
        id: 'a1_en_01_d1_1_v03',
        word: 'Good morning',
        translation: 'Sabahınız xeyir',
        pronunciation: '/ɡʊd ˈmɔːnɪŋ/',
        example: 'Good morning, Sara!',
        exampleAz: 'Sabahınız xeyir, Sara!',
        usageNote:
          'Səhər salamlaşanda işlənir. "Hello" və "Hi" də səhər deyilə bilər, amma "Good morning" xüsusi olaraq səhəri bildirir. İfadəni bütöv şəkildə öyrən.',
        imageEmoji: '🌅',
      },
      {
        id: 'a1_en_01_d1_1_v04',
        word: 'Good afternoon',
        translation: 'Günortanız xeyir',
        pronunciation: '/ɡʊd ˌɑːftəˈnuːn/',
        example: 'Good afternoon, Sara!',
        exampleAz: 'Günortanız xeyir, Sara!',
        usageNote:
          'Günortadan sonra salamlaşanda işlənir. "Good" və "afternoon" sözləri birlikdə salamlaşma ifadəsini yaradır.',
        imageEmoji: '☀️',
      },
      {
        id: 'a1_en_01_d1_1_v05',
        word: 'Good evening',
        translation: 'Axşamınız xeyir',
        pronunciation: '/ɡʊd ˈiːvnɪŋ/',
        example: 'Good evening, Sara!',
        exampleAz: 'Axşamınız xeyir, Sara!',
        usageNote:
          'Axşam salamlaşanda işlənir. "Good night" isə adətən gecə sağollaşanda və ya yatmazdan əvvəl deyilir; axşam salamı üçün "Good evening" işlət.',
        imageEmoji: '🌆',
      },
    ],

    sentenceDictionary: {
      hello: 'salam',
      hi: 'salam',
      good: 'yaxşı',
      morning: 'səhər',
      afternoon: 'günortadan sonra',
      evening: 'axşam',
    },

    exercises: [
      {
        id: 'a1_en_01_d1_1_e01',
        type: 'multiple_choice',
        question: 'Səhər saatı üçün xüsusi salamlaşma hansıdır?',
        questionWords: [
          { text: 'Səhər', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'saatı', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'üçün', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'xüsusi', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'salamlaşma', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'hansıdır', lang: 'az' },
          { text: '?', lang: 'punctuation' },
        ],
        questionLang: 'az',
        correctAnswer: 'Good morning',
        answerLang: 'en',
        options: ['Good morning', 'Hi', 'Hello', 'Good evening'],
        optionLangs: ['en', 'en', 'en', 'en'],
        explanation:
          '"Good morning" xüsusi olaraq səhəri bildirir. "Hi" və "Hello" da səhər deyilə bilər, amma günün vaxtını bildirmir.',
        mascotHint: 'Səhər mənasını bildirən sözü xatırla.',
        difficulty: 1,
      },
      {
        id: 'a1_en_01_d1_1_e02',
        type: 'multiple_choice',
        question: '"Hello" nə deməkdir?',
        questionWords: [
          { text: '"', lang: 'punctuation' },
          { text: 'Hello', lang: 'en', vocabularyWord: 'Hello' },
          { text: '"', lang: 'punctuation' },
          { text: ' ', lang: 'punctuation' },
          { text: 'nə', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'deməkdir', lang: 'az' },
          { text: '?', lang: 'punctuation' },
        ],
        questionLang: 'az',
        correctAnswer: 'Salam',
        answerLang: 'az',
        options: ['Salam', 'Sağ ol', 'Sabahınız xeyir', 'Görüşərik'],
        optionLangs: ['az', 'az', 'az', 'az'],
        explanation:
          '"Hello" neytral salamlaşmadır və "Salam" deməkdir.',
        mascotHint: 'Günün istənilən vaxtında deyilə bilən salamdır.',
        difficulty: 1,
      },
      {
        id: 'a1_en_01_d1_1_e03',
        type: 'translation',
        question: 'Sabahınız xeyir!',
        questionWords: [
          { text: 'Sabahınız', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'xeyir', lang: 'az' },
          { text: '!', lang: 'punctuation' },
        ],
        questionLang: 'az',
        correctAnswer: 'Good morning',
        acceptedAnswers: ['Good morning!'],
        translationAz: 'Sabahınız xeyir!',
        answerLang: 'en',
        options: ['Good morning', 'Hello', 'Hi', 'Good evening'],
        optionLangs: ['en', 'en', 'en', 'en'],
        explanation:
          '"Sabahınız xeyir" ifadəsinin qarşılığı "Good morning"dir.',
        mascotHint: 'Cavab iki sözdən ibarətdir.',
        difficulty: 1,
      },
      {
        id: 'a1_en_01_d1_1_e04',
        type: 'fill_blank',
        question: '___ morning!',
        questionWords: [
          { text: '___', lang: 'punctuation' },
          { text: ' ', lang: 'punctuation' },
          { text: 'morning', lang: 'en', vocabularyWord: 'Good morning' },
          { text: '!', lang: 'punctuation' },
        ],
        questionLang: 'en',
        correctAnswer: 'Good',
        acceptedAnswers: ['good'],
        fullSentence: 'Good morning!',
        answerLang: 'en',
        options: ['Good', 'Hi', 'Hello', 'Evening'],
        optionLangs: ['en', 'en', 'en', 'en'],
        translationAz: 'Sabahınız xeyir!',
        explanation:
          '"Good morning" ifadəsində ilk söz "Good"dur. Bütöv ifadə "Sabahınız xeyir" mənasını verir.',
        mascotHint: 'Səhər salamını tamamla.',
        difficulty: 1,
      },
      {
        id: 'a1_en_01_d1_1_e05',
        type: 'multiple_choice',
        question:
          'Öyrəndiyin salamlar arasında daha səmimi olan qısa söz hansıdır?',
        questionWords: [
          { text: 'Öyrəndiyin', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'salamlar', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'arasında', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'daha', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'səmimi', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'olan', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'qısa', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'söz', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'hansıdır', lang: 'az' },
          { text: '?', lang: 'punctuation' },
        ],
        questionLang: 'az',
        correctAnswer: 'Hi',
        answerLang: 'en',
        options: ['Hi', 'Good morning', 'Good afternoon', 'Good evening'],
        optionLangs: ['en', 'en', 'en', 'en'],
        explanation:
          '"Hi" qısa və daha səmimi salamlaşmadır. Digər ifadələr günün müəyyən vaxtını bildirir.',
        mascotHint: 'Dostuna bir qısa sözlə salam ver.',
        difficulty: 1,
      },
      {
        id: 'a1_en_01_d1_1_e06',
        type: 'multiple_choice',
        question:
          'Saat 15:00-dır. Günortadan sonranı xüsusi bildirən salam hansıdır?',
        questionWords: [
          { text: 'Saat', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: '15:00-dır', lang: 'az' },
          { text: '.', lang: 'punctuation' },
          { text: ' ', lang: 'punctuation' },
          { text: 'Günortadan', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'sonranı', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'xüsusi', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'bildirən', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'salam', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'hansıdır', lang: 'az' },
          { text: '?', lang: 'punctuation' },
        ],
        questionLang: 'az',
        correctAnswer: 'Good afternoon',
        answerLang: 'en',
        options: [
          'Good evening',
          'Hello',
          'Good afternoon',
          'Good morning',
        ],
        optionLangs: ['en', 'en', 'en', 'en'],
        explanation:
          'Bu vəziyyətdə günortadan sonranı bildirən ifadə "Good afternoon"dur. "Hello" da salamdır, amma vaxtı bildirmir.',
        mascotHint: 'Günortadan sonrakı vaxt üçün öyrəndiyin ifadəni seç.',
        difficulty: 1,
      },
      {
        id: 'a1_en_01_d1_1_e07',
        type: 'fill_blank',
        question: 'Axşam salamını tamamla: Good ___.',
        questionWords: [
          { text: 'Axşam', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'salamını', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'tamamla', lang: 'az' },
          { text: ':', lang: 'punctuation' },
          { text: ' ', lang: 'punctuation' },
          { text: 'Good', lang: 'en', vocabularyWord: 'Good evening' },
          { text: ' ', lang: 'punctuation' },
          { text: '___', lang: 'punctuation' },
          { text: '.', lang: 'punctuation' },
        ],
        questionLang: 'az',
        correctAnswer: 'evening',
        acceptedAnswers: ['Evening'],
        fullSentence: 'Good evening!',
        answerLang: 'en',
        options: ['evening', 'morning', 'afternoon', 'hello'],
        optionLangs: ['en', 'en', 'en', 'en'],
        translationAz: 'Axşamınız xeyir!',
        explanation: 'Axşam salamlaşanda "Good evening" deyirik.',
        mascotHint: 'Axşam mənasını bildirən sözü yaz.',
        difficulty: 1,
      },
      {
        id: 'a1_en_01_d1_1_e08',
        type: 'multiple_choice',
        question:
          'Biri sənə "Hello!" deyir. Öyrəndiyin ifadələrdən hansı salam cavabıdır?',
        questionWords: [
          { text: 'Biri', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'sənə', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: '"', lang: 'punctuation' },
          { text: 'Hello', lang: 'en', vocabularyWord: 'Hello' },
          { text: '!"', lang: 'punctuation' },
          { text: ' ', lang: 'punctuation' },
          { text: 'deyir', lang: 'az' },
          { text: '.', lang: 'punctuation' },
          { text: ' ', lang: 'punctuation' },
          { text: 'Öyrəndiyin', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'ifadələrdən', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'hansı', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'salam', lang: 'az' },
          { text: ' ', lang: 'punctuation' },
          { text: 'cavabıdır', lang: 'az' },
          { text: '?', lang: 'punctuation' },
        ],
        questionLang: 'az',
        correctAnswer: 'Hi!',
        acceptedAnswers: ['Hi'],
        answerLang: 'en',
        options: ['Hi!', 'Yes', 'No', 'Thanks'],
        optionLangs: ['en', 'en', 'en', 'en'],
        explanation:
          '"Hello!" salamına "Hi!" ilə cavab vermək olar. Eyni sözü təkrarlamaq məcburi deyil.',
        mascotHint: 'Qarşı tərəfə salam ver.',
        difficulty: 1,
      },
    ],
  },
];

// ═══════════════════════════════════════
// KÖMƏKÇI FUNKSİYALAR
// ═══════════════════════════════════════

export const getLessonById = (id: string): Lesson | undefined => {
  return lessons.find((l) => l.id === id);
};

export const getLessonsByLevel = (level: string): Lesson[] => {
  return lessons.filter((l) => l.level === level);
};

export const getLessonsByLanguage = (language: string): Lesson[] => {
  return lessons.filter((l) => l.language === language);
};

export const getNextLesson = (currentId: string): Lesson | undefined => {
  const current = getLessonById(currentId);
  if (!current) return undefined;

  return lessons.find(
    (l) => l.order === current.order + 1 && l.language === current.language
  );
};