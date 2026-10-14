export interface LessonActivities {
  introduction: string;
  explanation: { title: string; text: string; example?: string }[];
  dialogue: { speaker: string; text: string; translation: string }[];
  game: {
    title: string;
    instructions: string;
    stops: { place: string; time: string; emoji: string; answer: string }[];
    options: string[];
  };
  speaking: { prompt: string; examples: string[] }[];
}

const activities: Record<string, LessonActivities> = {
  a1_en_01_d1_1: {
    introduction: 'İlk söhbətin bir salamla başlayır. Gəlin müxtəlif vəziyyətlərdə necə salam verəcəyini öyrənək.',
    explanation: [
      {
        title: 'Hello və Hi',
        text: 'Hello “Salam” deməkdir. Günün istənilən vaxtında, tanış və tanımadığın insanlarla işlədə bilərsən. Hi də “Salam” deməkdir, amma daha səmimi səslənir. Dostun və sinif yoldaşınla danışanda uyğundur; nəzakətsiz ifadə deyil.',
        example: 'Hello! / Hi!',
      },
      {
        title: 'Günün vaxtına uyğun salam',
        text: 'Səhər Good morning, günortadan sonra Good afternoon, axşam salamlaşanda Good evening deyirik. Hello və Hi bu vaxtlarda da işlənə bilər, amma günün vaxtını xüsusi bildirmir.',
        example: 'Good morning! / Good afternoon! / Good evening!',
      },
      {
        title: 'İfadəni bütöv öyrən',
        text: 'Good ayrıca “yaxşı” deməkdir. Amma Good morning ifadəsini sözbəsöz “yaxşı səhər” kimi çevirmirik: bütöv ifadə “Sabahınız xeyir” deməkdir. Good evening axşam salamıdır. Good night isə adətən gecə sağollaşanda və ya yatmazdan əvvəl deyilir.',
        example: 'Good evening!',
      },
    ],
    dialogue: [
      { speaker: 'Emma', text: 'Hello!', translation: 'Salam!' },
      { speaker: 'Alex', text: 'Hi!', translation: 'Salam!' },
    ],
    game: {
      title: 'Salamı çatdır',
      instructions: 'Maskotu üç dayanacaqdan keçir. Hər dayanacaqda günün vaxtına xüsusi salamı seç.',
      stops: [
        { place: 'Məktəb', time: '08:30', emoji: '🏫', answer: 'Good morning' },
        { place: 'Kitabxana', time: '15:00', emoji: '📚', answer: 'Good afternoon' },
        { place: 'Görüş yeri', time: '19:00', emoji: '🌆', answer: 'Good evening' },
      ],
      options: ['Good afternoon', 'Good evening', 'Good morning'],
    },
    speaking: [
      { prompt: 'Yeni sinif yoldaşını salamla.', examples: ['Hi!', 'Hello!'] },
      { prompt: 'Səhər müəlliminlə qarşılaşmısan. Səhərə xüsusi salam ver.', examples: ['Good morning!'] },
    ],
  },
};

export function getLessonActivities(id: string): LessonActivities | undefined {
  return activities[id];
}
