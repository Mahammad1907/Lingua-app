import { VoiceIntent } from '../utils/spokenAnswer';
import { Exercise, Lesson, VocabularyItem } from './types';

export type SessionStyle = 'scene' | 'build' | 'repair' | 'dialogue' | 'order' | 'voice_chat';
export interface SessionStep {
  exercise: Exercise;
  audio?: string;
  teacher: string;
  foxSays?: string;
  activity?: Exclude<SessionStyle, 'voice_chat'>;
  place?: 'classroom' | 'cafe' | 'park';
}
export interface VoiceTurn {
  intent: VoiceIntent;
  text: string;
  meaning: string;
  task: string;
  examples: string[];
}
export interface ShortSession {
  style: SessionStyle;
  warmup?: SessionStep;
  steps: SessionStep[];
  personalCard?: boolean;
  turns?: VoiceTurn[];
  speaking?: VoiceTurn;
}

function question(id: string, type: Exercise['type'], prompt: string, answer: string,
  options: string[], explanation: string, extra: Partial<Exercise> = {}): Exercise {
  return { id, type, question: prompt, correctAnswer: answer, options,
    questionLang: 'az', answerLang: 'en', explanation, difficulty: 1,
    ...extra };
}
function vocab(id: string, word: string, translation: string, usageNote: string): VocabularyItem {
  return { id, word, translation, usageNote, pronunciation: '', example: word, exampleAz: translation };
}

const id1 = 'a1_en_01_d1_1';
const id2 = 'a1_en_01_d1_2';
const id3 = 'a1_en_01_d2_1';
const id4 = 'a1_en_01_d3_1';
const id5 = 'a1_en_01_d4_1';
const id6 = 'a1_en_01_final';

export const firstConversationSessions: Record<string, ShortSession> = {
  [id1]: {
    style: 'scene',
    steps: [
      { audio: 'Good morning!', teacher: 'Hello və Hi “Salam” deməkdir, hər vaxt işlənir. Good morning isə səhər salamıdır: “Sabahınız xeyir”.',
        exercise: question(`${id1}_e01`, 'multiple_choice', 'Səsi dinlə. Mesajı günün vaxtına uyğun səhnəyə apar.', 'Səhər · 08:30',
          ['Səhər · 08:30', 'Günorta · 15:00', 'Axşam · 19:00'], 'Good morning xüsusi olaraq səhəri bildirir.', { answerLang: 'az' }) },
      { audio: 'Good afternoon!', teacher: 'Good afternoon — Günortanız xeyir. Günortadan sonra salamlaşanda işlənir.',
        exercise: question(`${id1}_e02`, 'multiple_choice', 'Bu səs hansı səhnəyə uyğundur?', 'Günorta · 15:00',
          ['Səhər · 08:30', 'Günorta · 15:00', 'Axşam · 19:00'], 'Good afternoon günortadan sonrakı salamdır.', { answerLang: 'az' }) },
      { audio: 'Good evening!', teacher: 'Good evening — Axşamınız xeyir. Hello və Hi isə günün istənilən vaxtında deyilə bilər.',
        exercise: question(`${id1}_e03`, 'multiple_choice', 'Son mesajı uyğun səhnəyə yerləşdir.', 'Axşam · 19:00',
          ['Səhər · 08:30', 'Günorta · 15:00', 'Axşam · 19:00'], 'Good evening axşam salamlaşanda deyilir.', { answerLang: 'az' }) },
    ],
  },
  [id2]: {
    style: 'build', personalCard: true,
    warmup: { audio: 'Hello!', teacher: 'Hello — Salam. Günün istənilən vaxtında işlənir.',
      exercise: question(`${id2}_warmup`, 'multiple_choice', 'Qısa təkrar: səsi dinlə. Nə deyildi?', 'Salam', ['Salam', 'Sağ ol'], 'Hello “Salam” deməkdir.', { answerLang: 'az' }) },
    steps: [
      { teacher: 'I “mən” deməkdir. Adını demək üçün I am + ad quruluşunu işlədirik. I Ali deyil, I am Ali deyirik.',
        exercise: question(`${id2}_e01`, 'sentence_build', 'Əli özünü təqdim edir. Sözlərdən cümlə qur.', 'I am Ali', [], 'I-dan sonra am gəlir.', { words: ['Ali', 'am', 'I'] }) },
      { teacher: 'I am danışıqda I’m kimi qısalır. Hər iki forma düzgündür və eyni mənanı verir.',
        exercise: question(`${id2}_e02`, 'fill_blank', 'Boşluğa yalnız I am ifadəsinin qısa formasını yaz: ___ Ali.', "I'm", [], 'I am → I’m. Ali artıq verilib; onu yenidən yazma.', { acceptedAnswers: ['I’m'], fullSentence: "I'm Ali." }) },
      { teacher: 'My name is… “Mənim adım…” deməkdir. My name is Sara və I’m Sara ilə adını təqdim edə bilərsən.',
        exercise: question(`${id2}_e03`, 'sentence_build', 'Sara adını deyir. Cümləni qur.', 'My name is Sara', [], 'My name is + ad.', { words: ['Sara', 'is', 'My', 'name'] }) },
      { teacher: 'What’s your name? — Adın nədir? İlk tanışlıqda Nice to meet you! — “Tanış olduğumuza şadam!” da deyilir.',
        exercise: question(`${id2}_e04`, 'sentence_build', 'Qarşı tərəfin adını soruş.', "What's your name", [], 'What’s your name? — Adın nədir?', { words: ['name', "What's", 'your'] }) },
    ],
  },
  [id3]: {
    style: 'repair',
    warmup: { teacher: 'Özünü təqdim edəndə I ilə am işlənir.',
      exercise: question(`${id3}_warmup`, 'fill_blank', 'Qısa təkrar: I ___ Ali.', 'am', [], 'I am Ali.', { fullSentence: 'I am Ali.' }) },
    steps: [
      { foxSays: 'I Ali.', teacher: 'Tülkü bir sözü unutdu. I ilə adın arasında am lazımdır.',
        exercise: question(`${id3}_e01`, 'sentence_build', 'Çatışmayan sözü əlavə edib cümləni yenidən qur.', 'I am Ali', [], 'I am Ali — Mən Əliyəm.', { words: ['I', 'Ali', 'am'] }) },
      { foxSays: 'I is Sara.', teacher: 'I ilə is yox, am işlənir. I am və I’m formalarının hər ikisi düzgündür.',
        exercise: question(`${id3}_e02`, 'multiple_choice', 'Tülkünün sözünü düzəlt.', 'I am Sara.', ['I am Sara.', "I'm Sara.", 'I are Sara.'], 'I am Sara və I’m Sara hər ikisi düzgündür.', { acceptedAnswers: ["I'm Sara."] }) },
      { foxSays: 'My name Ali.', teacher: 'My name is… ifadəsində is sözünü saxlamaq lazımdır.',
        exercise: question(`${id3}_e03`, 'fill_blank', 'Tülkünün cümləsini tamamla: My name ___ Ali.', 'is', [], 'My name is Ali.', { fullSentence: 'My name is Ali.' }) },
    ],
  },
  [id4]: {
    style: 'dialogue',
    warmup: { teacher: 'Adını I’m… və ya My name is… ilə deyə bilərsən.',
      exercise: question(`${id4}_warmup`, 'multiple_choice', 'Özünü təqdim edən cavab hansıdır?', "I'm Sara.", ["I'm Sara.", 'Good morning!'], 'I’m Sara — Mən Sarayam.') },
    steps: [
      { audio: 'How are you?', teacher: 'How are you? — Necəsən? Bu sual adını yox, halını soruşur.',
        exercise: question(`${id4}_e01`, 'multiple_choice', 'Səsi dinlə. Qarşı tərəf nəyi soruşdu?', 'Halımı', ['Adımı', 'Halımı'], 'How are you? — Necəsən?', { answerLang: 'az' }) },
      { audio: 'How are you?', teacher: 'I’m fine — Mən yaxşıyam. I’m tired — Mən yorğunam. Cavabdan sonra thanks və ya thank you deyə bilərsən.',
        exercise: question(`${id4}_e02`, 'multiple_choice', 'Yaxşı olduğunu bildirən cavabı seç.', "I'm fine, thanks.", ["I'm fine, thanks.", "I'm tired.", 'My name is Ali.'], 'I’m fine, thanks — Yaxşıyam, sağ ol.') },
      { teacher: 'And you? — Bəs sən? Cavab verdikdən sonra eyni sualı qarşı tərəfə qaytarmaq üçün işlənir.',
        exercise: question(`${id4}_e03`, 'sentence_build', '“Bəs sən?” sualını qur.', 'And you', [], 'And you? — Bəs sən?', { words: ['you', 'And'] }) },
    ],
  },
  [id5]: {
    style: 'order',
    warmup: { audio: 'How are you?', teacher: 'Hal-əhval sualına özünü necə hiss etdiyini bildirərək cavab ver.',
      exercise: question(`${id5}_warmup`, 'multiple_choice', 'Qısa təkrar: hansı cavab uyğundur?', "I'm fine.", ["I'm fine.", 'My name is Ali.'], 'How are you? sualı halını soruşur.') },
    steps: [
      { teacher: 'Goodbye və Bye sağollaşmaq üçündür. Hi və Hello isə salamlaşmaq üçündür.',
        exercise: question(`${id5}_e01`, 'multiple_choice', 'Söhbət bitir. Hansı mesajı göndərərsən?', 'Goodbye!', ['Goodbye!', 'Bye!', 'Hello!'], 'Goodbye və Bye hər ikisi uyğun sağollaşmadır.', { acceptedAnswers: ['Bye!'] }) },
      { teacher: 'See you — Görüşərik. Bu ifadə ilə də söhbəti bitirə bilərsən.',
        exercise: question(`${id5}_e02`, 'sentence_build', '“Görüşərik” mesajını hazırla.', 'See you', [], 'See you! — Görüşərik!', { words: ['you', 'See'] }) },
      { audio: 'My name is Alex.', teacher: 'Eşitmədikdə və ya anlamadıqda Again, please deyə bilərsən: “Bir də, zəhmət olmasa.” Sualı təkrar dinləmək olar.',
        exercise: question(`${id5}_e03`, 'multiple_choice', 'Adını tutmadın. Təkrar istəmək üçün hansı mesaj uyğundur?', 'Again, please.', ['Again, please.', 'Goodbye!', 'Good morning!'], 'Again, please — Bir də, zəhmət olmasa.') },
    ],
  },
  [id6]: {
    style: 'voice_chat', steps: [],
    turns: [
      { intent: 'introduce', text: "Hi! I'm BirFox. What's your name?", meaning: 'Salam! Mən BirFox-am. Sənin adın nədir?', task: 'Salam ver və öz adını de.', examples: ["Hi! I'm Ali.", 'Hello! My name is Sara.'] },
      { intent: 'feeling', text: 'Nice to meet you! How are you?', meaning: 'Tanış olduğumuza şadam! Necəsən?', task: 'Halını bildir. İstəsən And you? ilə halını da soruş.', examples: ["I'm fine, thanks. And you?", "I'm tired. And you?"] },
      { intent: 'farewell', text: "I'm fine, thanks. See you!", meaning: 'Yaxşıyam, sağ ol. Görüşərik!', task: 'Sağollaş.', examples: ['See you!', 'Bye!', 'Goodbye!'] },
    ],
  },
};

// A reusable setting and a different task, rather than another long explanation.
// Original exercises and IDs stay valid for users who have already completed them.
const extraSteps: Record<string, SessionStep[]> = {
  [id1]: [
    { activity: 'dialogue', place: 'park', audio: 'Hi!', teacher: 'Hi və Hello günün istənilən vaxtında salam vermək üçündür.',
      exercise: question(`${id1}_e04`, 'multiple_choice', 'Dostun “Hi!” deyir. Salamla cavab ver.', 'Hello!', ['Goodbye!', 'Hello!', 'See you!'], 'Hello və Hi ilə salamlaşırıq.') },
    { activity: 'build', place: 'classroom', teacher: 'Sabahınız xeyir — Good morning. İfadəni bütöv öyrən.',
      exercise: question(`${id1}_e05`, 'sentence_build', 'Səhər salamını sözlərdən qur.', 'Good morning', [], 'Good morning — Sabahınız xeyir.', { words: ['morning', 'Good'] }) },
    { activity: 'build', place: 'cafe', teacher: 'Günortadan sonra Good afternoon deyə bilərsən.',
      exercise: question(`${id1}_e06`, 'fill_blank', 'Günorta salamını tamamla: Good ___.', 'afternoon', [], 'Good afternoon — Günortanız xeyir.', { fullSentence: 'Good afternoon!' }) },
    { activity: 'repair', place: 'park', foxSays: 'Saat 19:00 · Good morning!', teacher: 'Günün vaxtını xüsusi bildirən salamı seç. Hello və Hi bütün gün işlənə bilər.',
      exercise: question(`${id1}_e07`, 'multiple_choice', 'Tülkünün salamını axşamı bildirən ifadə ilə dəyiş.', 'Good evening!', ['Good morning!', 'Good afternoon!', 'Good evening!'], 'Good evening axşam salamıdır.') },
    { activity: 'dialogue', place: 'cafe', audio: 'Good afternoon!', teacher: 'Eyni salamla cavab vermək olar. Hello və Hi də salam cavablarıdır.',
      exercise: question(`${id1}_e08`, 'sentence_build', 'Saat 15:00-dır. Eşitdiyin salamı özün qur.', 'Good afternoon', [], 'Good afternoon — Günortanız xeyir.', { words: ['afternoon', 'Good'] }) },
  ],
  [id2]: [
    { activity: 'dialogue', place: 'cafe', audio: "Hi! I'm Emma.", teacher: 'I’m + ad özünü təqdim edir.',
      exercise: question(`${id2}_e05`, 'multiple_choice', 'Dinlə: danışanın adı nədir?', 'Emma', ['Sara', 'Emma', 'Ali'], 'I’m Emma — Mən Emmayam.') },
    { activity: 'build', place: 'classroom', teacher: 'My name is ifadəsindən sonra ad gəlir.',
      exercise: question(`${id2}_e06`, 'fill_blank', 'Yalnız çatışmayan sözü yaz: My name ___ Alex.', 'is', [], 'My name is Alex.', { fullSentence: 'My name is Alex.' }) },
    { activity: 'dialogue', place: 'park', audio: "What's your name?", teacher: 'Ad sualına adını deyərək cavab ver.',
      exercise: question(`${id2}_e07`, 'multiple_choice', 'Əlisən. Eşitdiyin suala cavab seç.', "I'm Ali.", ["I'm Ali.", 'Good morning!', 'See you!'], 'What’s your name? sualı adını soruşur.') },
    { activity: 'order', place: 'cafe', teacher: 'Nice to meet you — Tanış olduğumuza şadam.',
      exercise: question(`${id2}_e08`, 'sentence_build', 'Yeni dostuna “Tanış olduğumuza şadam” de.', 'Nice to meet you', [], 'Nice to meet you! İlk tanışlıqda işlənir.', { words: ['meet', 'you', 'Nice', 'to'] }) },
  ],
  [id3]: [
    { activity: 'repair', place: 'classroom', foxSays: 'I are Ali.', teacher: 'I ilə am işlənir.',
      exercise: question(`${id3}_e04`, 'fill_blank', 'Səhv sözü düzəlt: I ___ Ali.', 'am', [], 'I am Ali.', { fullSentence: 'I am Ali.' }) },
    { activity: 'dialogue', place: 'cafe', audio: 'My name is Sara.', teacher: 'Səsi dinlə və adı saxlayaraq təqdimatı yenidən qur.',
      exercise: question(`${id3}_e05`, 'sentence_build', 'Eşitdiyin cümləni qur.', 'My name is Sara', [], 'My name is Sara.', { words: ['is', 'Sara', 'name', 'My'] }) },
    { activity: 'repair', place: 'park', foxSays: 'I’m am Alex.', teacher: 'I’m artıq I am deməkdir; ardınca bir də am lazım deyil.',
      exercise: question(`${id3}_e06`, 'multiple_choice', 'Tülkünün təqdimatını düzəlt.', "I'm Alex.", ["I'm Alex.", 'I is Alex.', 'I’m am Alex.'], 'I’m Alex və I am Alex düzgündür; I’m am Alex deyil.') },
    { activity: 'repair', place: 'classroom', foxSays: 'My name am Emma.', teacher: 'My name ilə is işlənir.',
      exercise: question(`${id3}_e07`, 'sentence_build', 'Emma üçün düzgün təqdimat qur.', 'My name is Emma', [], 'My name is Emma.', { words: ['Emma', 'My', 'is', 'name'] }) },
    { activity: 'dialogue', place: 'park', audio: "Hi! What's your name?", teacher: 'Salamdan sonra adını deyə bilərsən.',
      exercise: question(`${id3}_e08`, 'multiple_choice', 'Saranın yerinə cavab ver.', "Hi! I'm Sara.", ["Hi! I'm Sara.", 'Hi! My name Sara.', 'Hi! I is Sara.'], 'Hi! I’m Sara — Salam! Mən Sarayam.') },
  ],
  [id4]: [
    { activity: 'dialogue', place: 'park', audio: "I'm tired.", teacher: 'Tired — yorğun. Fine — yaxşı.',
      exercise: question(`${id4}_e04`, 'multiple_choice', 'Emma özünü necə hiss edir?', 'Yorğun', ['Yaxşı', 'Yorğun', 'Adını deyir'], 'I’m tired — Mən yorğunam.', { answerLang: 'az' }) },
    { activity: 'build', place: 'cafe', teacher: 'Halını I’m + fine və ya tired ilə bildir.',
      exercise: question(`${id4}_e05`, 'sentence_build', 'Yaxşı olduğunu de və təşəkkür et.', "I'm fine thanks", [], 'I’m fine, thanks — Yaxşıyam, sağ ol.', { words: ['thanks', "I'm", 'fine'], fullSentence: "I'm fine, thanks." }) },
    { activity: 'build', place: 'classroom', teacher: 'Öz halını dedikdən sonra And you? ilə qarşı tərəfdən soruş.',
      exercise: question(`${id4}_e06`, 'fill_blank', '“Bəs sən?” sualını tamamla: And ___?', 'you', [], 'And you? — Bəs sən?', { fullSentence: 'And you?' }) },
    { activity: 'dialogue', place: 'park', audio: "I'm fine, thanks. And you?", teacher: 'And you? eyni hal-əhval sualını sənə qaytarır.',
      exercise: question(`${id4}_e07`, 'multiple_choice', 'Yorğunsan. Emma səndən soruşur. Cavab seç.', "I'm tired.", ["I'm tired.", 'My name is Ali.', 'Goodbye!'], 'I’m tired — Yorğunam.') },
    { activity: 'order', place: 'cafe', teacher: 'Thank you və thanks təşəkkür bildirir.',
      exercise: question(`${id4}_e08`, 'sentence_build', '“Təşəkkür edirəm” mesajını qur.', 'Thank you', [], 'Thank you — Təşəkkür edirəm.', { words: ['you', 'Thank'] }) },
  ],
  [id5]: [
    { activity: 'dialogue', place: 'park', audio: 'See you!', teacher: 'See you söhbətin sonunda sağollaşmaq üçün işlənir.',
      exercise: question(`${id5}_e04`, 'multiple_choice', 'Dinlə. Emma nə edir?', 'Sağollaşır', ['Adını deyir', 'Salam verir', 'Sağollaşır'], 'See you — Görüşərik.', { answerLang: 'az' }) },
    { activity: 'order', place: 'cafe', teacher: 'Again, please — Bir də, zəhmət olmasa.',
      exercise: question(`${id5}_e05`, 'sentence_build', 'Mesajı anlamadın. Təkrar istə.', 'Again please', [], 'Again, please. — Bir də, zəhmət olmasa.', { words: ['please', 'Again'], fullSentence: 'Again, please.' }) },
    { activity: 'repair', place: 'classroom', foxSays: 'Söhbət bitdi: Hello!', teacher: 'Hello salamdır. Söhbətin sonunda Goodbye və ya Bye de.',
      exercise: question(`${id5}_e06`, 'multiple_choice', 'Tülkünün sağollaşmasını düzəlt.', 'Bye!', ['Bye!', 'Hi!', 'Hello!'], 'Bye — gündəlik sağollaşma.') },
    { activity: 'build', place: 'park', teacher: 'See you iki sözdən ibarətdir.',
      exercise: question(`${id5}_e07`, 'fill_blank', '“Görüşərik” ifadəsini tamamla: See ___.', 'you', [], 'See you! — Görüşərik!', { fullSentence: 'See you!' }) },
    { activity: 'dialogue', place: 'cafe', audio: 'Goodbye!', teacher: 'Goodbye salamlaşma deyil, sağollaşmadır.',
      exercise: question(`${id5}_e08`, 'multiple_choice', 'Alex gedir. Uyğun cavabı seç.', 'See you!', ['Good morning!', 'See you!', "What's your name?"], 'See you ilə sağollaşmaya cavab verə bilərsən.') },
  ],
};
for (const [lessonId, additions] of Object.entries(extraSteps)) {
  firstConversationSessions[lessonId].steps.push(...additions);
}

// The final conversation has six voice exchanges. It is a prepared scenario;
// replay/help is supported, but recording does not imply a correct answer.
firstConversationSessions[id6].turns = [
  { intent: 'greeting', text: 'Hello!', meaning: 'Salam!', task: 'BirFox-a salam ver.', examples: ['Hello!', 'Hi!'] },
  { intent: 'introduce', text: "I'm BirFox. What's your name?", meaning: 'Mən BirFox-am. Adın nədir?', task: 'Öz adını de.', examples: ["I'm Ali.", 'My name is Sara.'] },
  { intent: 'meet', text: 'Nice to meet you!', meaning: 'Tanış olduğumuza şadam!', task: 'Sən də tanış olduğuna şad olduğunu bildir.', examples: ['Nice to meet you!'] },
  { intent: 'feeling', text: 'How are you?', meaning: 'Necəsən?', task: 'Özünü necə hiss etdiyini de.', examples: ["I'm fine, thanks.", "I'm tired."] },
  { intent: 'repeat', text: "I'm fine, thanks.", meaning: 'Yaxşıyam, sağ ol.', task: 'Mesajı anlamadığını fərz et. Təkrar istə.', examples: ['Again, please.'] },
  { intent: 'farewell', text: "I'm fine, thanks. See you!", meaning: 'Yaxşıyam, sağ ol. Görüşərik!', task: 'İndi aydındır. BirFox ilə sağollaş.', examples: ['See you!', 'Bye!', 'Goodbye!'] },
];

const oralTasks: Record<string, VoiceTurn> = {
  [id1]: { intent: 'greeting', text: 'Good morning!', meaning: 'Sabahınız xeyir!', task: 'BirFox-a salam ver.', examples: ['Good morning!', 'Hello!', 'Hi!'] },
  [id2]: { intent: 'introduce', text: "What's your name?", meaning: 'Adın nədir?', task: 'Öz adını de.', examples: ["I'm Ali.", 'My name is Sara.'] },
  [id3]: { intent: 'introduce', text: "What's your name?", meaning: 'Adın nədir?', task: 'Düzgün cümlə ilə özünü təqdim et.', examples: ['I am Ali.', "I'm Sara."] },
  [id4]: { intent: 'feeling', text: 'How are you?', meaning: 'Necəsən?', task: 'Halını bildir və istəsən qarşı tərəfdən də soruş.', examples: ["I'm fine, thanks. And you?", "I'm tired."] },
  [id5]: { intent: 'farewell', text: 'See you!', meaning: 'Görüşərik!', task: 'BirFox ilə sağollaş.', examples: ['Bye!', 'See you!'] },
};
for (const [lessonId, turn] of Object.entries(oralTasks)) firstConversationSessions[lessonId].speaking = turn;

const definitions: { id: string; title: string; description: string; focus: Lesson['focus']; group: Lesson['parentGroup']; canDo: string; vocabulary: VocabularyItem[] }[] = [
  { id: id1, title: 'Salamlaşma ifadələri', description: 'Səsi səhnəyə yerləşdir', focus: 'listening', group: 'd1', canDo: 'Günün vaxtına uyğun salamı anlaya bilirəm.', vocabulary: [
    vocab(`${id1}_v01`, 'Hello', 'Salam', 'Neytral salamdır. Günün istənilən vaxtında işlənir.'),
    vocab(`${id1}_v02`, 'Hi', 'Salam', 'Daha səmimi salamdır; nəzakətsiz deyil.'),
    vocab(`${id1}_v03`, 'Good morning', 'Sabahınız xeyir', 'Səhər salamlaşanda işlənir.'),
    vocab(`${id1}_v04`, 'Good afternoon', 'Günortanız xeyir', 'Günortadan sonra salamlaşanda işlənir.'),
    vocab(`${id1}_v05`, 'Good evening', 'Axşamınız xeyir', 'Axşam salamlaşanda işlənir. Good night adətən gecə sağollaşanda və ya yatmazdan əvvəl deyilir.'),
  ] },
  { id: id2, title: 'Özünü təqdim etmə', description: 'Öz tanışlıq kartını hazırla', focus: 'grammar', group: 'd1', canDo: 'Adımı deyə və qarşı tərəfin adını soruşa bilirəm.', vocabulary: [
    vocab(`${id2}_v01`, "I'm", 'Mən…', 'I am ifadəsinin qısa formasıdır.'),
    vocab(`${id2}_v02`, 'My name is', 'Mənim adım…', 'Ardınca adını de: My name is Ali.'),
    vocab(`${id2}_v03`, "What's your name?", 'Adın nədir?', 'Qarşı tərəfin adını soruşur.'),
    vocab(`${id2}_v04`, 'Nice to meet you!', 'Tanış olduğumuza şadam!', 'İlk tanışlıqda işlənən ifadədir.'),
  ] },
  { id: id3, title: 'Təqdimat cümlələrinin quruluşu', description: 'Təqdimatındakı səhvləri düzəlt', focus: 'grammar', group: 'd2', canDo: 'I am və My name is quruluşlarını düzgün işlədə bilirəm.', vocabulary: [
    vocab(`${id3}_v01`, 'I am', 'Mən…', 'Özünü təqdim edərkən işlədilir.'),
  ] },
  { id: id4, title: 'Hal-əhval soruşma və cavablandırma', description: 'Hal-əhval söhbətini tamamla', focus: 'vocabulary', group: 'd3', canDo: 'Hal-əhval soruşa və qısa cavab verə bilirəm.', vocabulary: [
    vocab(`${id4}_v01`, 'How are you?', 'Necəsən?', 'Qarşı tərəfin halını soruşur.'),
    vocab(`${id4}_v02`, "I'm fine.", 'Yaxşıyam.', 'Hal-əhval sualına cavabdır.'),
    vocab(`${id4}_v03`, "I'm tired.", 'Yorğunam.', 'Özünü necə hiss etdiyini bildirir.'),
    vocab(`${id4}_v04`, 'Thank you!', 'Təşəkkür edirəm!', 'Thanks daha qısa gündəlik formadır.'),
    vocab(`${id4}_v05`, 'And you?', 'Bəs sən?', 'Eyni sualı qarşı tərəfə qaytarır.'),
  ] },
  { id: id5, title: 'Sağollaşma və təkrar istəmə', description: 'Sağollaş və lazım olduqda təkrar istə', focus: 'review', group: 'd4', canDo: 'Sağollaşa və deyiləni təkrar istəyə bilirəm.', vocabulary: [
    vocab(`${id5}_v01`, 'Goodbye!', 'Sağ ol!', 'Söhbətin sonunda işlənir.'),
    vocab(`${id5}_v02`, 'Bye!', 'Sağ ol!', 'Qısa, gündəlik sağollaşmadır.'),
    vocab(`${id5}_v03`, 'See you!', 'Görüşərik!', 'Söhbəti bitirmək üçün işlənir.'),
    vocab(`${id5}_v04`, 'Again, please.', 'Bir də, zəhmət olmasa.', 'Qarşı tərəfdən təkrar istəmək üçündür.'),
  ] },
  { id: id6, title: 'BirFox ilə səsli söhbət', description: 'Dinlə, səsini yaz və göndər', focus: 'speaking', group: 'final', canDo: 'Köməkdən istifadə edərək qısa tanışlıq söhbəti apara bilirəm.', vocabulary: [] },
];

export const firstConversationLessons: Lesson[] = definitions.map((definition, index) => ({
  id: definition.id, title: definition.title, titleAz: definition.title,
  description: definition.description, language: 'en', level: 'A1', moduleId: 'module_1',
  order: index + 1, xpReward: 15, estimatedTime: index === 5 ? 6 : 5,
  focus: definition.focus, parentGroup: definition.group, subOrder: index === 1 ? 2 : 1,
  isReview: index === 5, reviewType: index === 5 ? 'module_review' : undefined,
  canDo: definition.canDo, vocabulary: definition.vocabulary,
  exercises: firstConversationSessions[definition.id].steps.map((step) => step.exercise),
}));

export function getShortSession(id: string): ShortSession | undefined {
  return firstConversationSessions[id];
}
