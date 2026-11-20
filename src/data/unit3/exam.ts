// Bölmə 3 imtahanı (exam: true — Kömək və ipucu yoxdur, Təkrar turu yoxdur, keçid ≥70 %).
// Hər xəritə dərsindən (1–8) ən azı bir tapşırıq; dinlə + oxu + yaz + danış; yeni söz yoxdur.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { NAME } from '../unit2/shared';
import { FROM, FROM_MISTAKES, LIVE, LIVE_MISTAKES, NATIONALITY_FIELD, notices, own, resultTexts, said, SPEAK, SPEAK_MISTAKES } from './shared';

export const exam: DesignLesson = {
  id: 'a1_en_b3_exam', order: 34, unit: 3, exam: true, title: 'Bölmə 3 imtahanı', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3x_c01', badge: 'Bölmə 3 imtahanı', subtitle: 'Kömək yoxdur. Keçmək üçün 70% lazımdır. Keçməsən, səhv bacarıqlar təkrara düşür və imtahanı yenidən verə bilərsən.', start: 'İmtahana başla',
      goals: [
        { icon: 'chat', text: 'Ölkə, millət, dil və yaşayış yeri haqqında deyiləni anlayıram.' },
        { icon: 'wave', text: 'Haradan olduğumu, dillərimi deyir, başqası haqqında soruşuram.' },
        { icon: 'bye', text: 'Formada milləti, mesajda harada yaşadığımı yazıram.' },
      ],
    },
    {
      type: 'voice', id: 'u3x_c02', number: 2, title: 'Haradan olduğunu de', why: 'Haradan olduğunu “I’m from” ilə dedin.',
      prompt: 'Hava limanında yanındakı sərnişin soruşur: “Where are you from?”\nHaradan olduğunu de.', audio: 'Hi! Where are you from?', reply: 'Nice!',
      rule: own(FROM, "I'm from Azerbaijan.", "I'm from Baku."),
      variants: [...FROM_MISTAKES, other("I'm from + ölkə.", ex("I'm from Azerbaijan.", 'Haradan olduğunu “I’m from” ilə deyirsən.', "I'm from Azerbaijan. — haradan; I'm Azerbaijani. — millət.", "Where are you from? — I'm from Baku."))],
    },
    {
      type: 'choice', id: 'u3x_c03', number: 3, title: 'Dinlə və seç', why: '“the USA” — ABŞ.',
      prompt: 'Hostelin resepsiyasında qonaq ölkəsini deyir.\nO haradandır?', audio: "Hello! I'm from the USA.",
      options: ['Böyük Britaniyadan', 'ABŞ-dan', 'Almaniyadan'], answer: 'ABŞ-dan',
      variants: [
        pick('Böyük Britaniyadan', 'Səsdə “the UK” yox, “the USA” var.', ex('ABŞ-dan', '“the USA” — ABŞ; “the UK” — Böyük Britaniya.', "I'm from the USA. — ABŞ; I'm from the UK. — Böyük Britaniya.", "I'm from the USA.")),
        pick('Almaniyadan', 'Səsdə “Germany” yoxdur.', ex('ABŞ-dan', 'Almaniya ingiliscə “Germany”dir.', "I'm from the USA. — ABŞ; I'm from Germany. — Almaniya.", "I'm from the USA.")),
      ],
    },
    {
      type: 'write', id: 'u3x_c04', number: 4, letters: ['F', 'R', 'A', 'N', 'C', 'E', 'I', 'S'], title: 'Hərfləri tut', why: 'F-R-A-N-C-E — France.',
      prompt: 'Uçuş tablosunun yanında işçi ölkəni hərf-hərf deyir.\nEşitdiyin hərflərə toxun.', audio: "It's F-R-A-N-C-E.", placeholder: 'Ölkə',
      rule: exact('FRANCE'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('FRANCE', 'Səsdə F, R, A, N, C, E deyilir: E “i”, C “si”.', 'E — i; I — ay.', "It's F-R-A-N-C-E."))],
    },
    {
      type: 'two', id: 'u3x_c05', number: 5, title: 'Formanı doldur', why: 'Ad və millət öz yerindədir.', scenes: ['u3/hostel'],
      prompt: 'Hostelin qeydiyyatındasan.\nVərəqi doldur (istəsən, uydurma ad).', form: { title: 'Hostel', subtitle: 'Yeni qonaq' },
      fields: [
        { id: 'u3x_c05a', label: 'First name', placeholder: '…', rule: own(NAME, '…'), purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
        { id: 'u3x_c05b', label: 'Nationality', placeholder: '…', rule: own(NATIONALITY_FIELD, 'Azerbaijani'), purpose: 'millətini yazmaq', empty: 'Millətini də yaz.' },
      ],
      variants: [
        { field: 'u3x_c05a', match: { other: true }, explain: ex('…', 'Bu sətirdə yalnız adın lazımdır.', 'First name — adın; Nationality — millətin.', 'My name is …') },
        { field: 'u3x_c05b', match: { other: true }, explain: ex('Azerbaijani', 'Bu sətirdə ölkə yox, millət yazılır.', "Azerbaijani — millət; Azerbaijan — ölkə.", "I'm Azerbaijani.") },
      ],
    },
    {
      type: 'choice', id: 'u3x_c06', number: 6, title: 'Sözü tamamla', why: 'Ölkə Turkey, millət Turkish.',
      prompt: 'Dil klubunda yeni tanış özünü təqdim edir.\nHansı söz çatmır?', gap: { speaker: 'other', before: "I'm from Turkey. I'm", after: '.' },
      options: ['Turkey', 'Turkish', 'from'], answer: 'Turkish',
      variants: [
        pick('Turkey', '“Turkey” ölkədir, burada millət lazımdır.', ex("I'm Turkish.", '“from” olmadan millət deyilir: Turkish.', "I'm Turkish. — millət; I'm from Turkey. — ölkə.", "I'm from Turkey. I'm Turkish.")),
        pick('from', '“from”dan sonra ölkə gəlməlidir, cümlə bitir.', ex("I'm Turkish.", 'İkinci cümlədə millət lazımdır: Turkish.', "I'm Turkish. — millət; I'm from Turkey. — ölkə.", "I'm from Turkey. I'm Turkish.")),
      ],
    },
    {
      type: 'match', mode: 'reply', id: 'u3x_c07', number: 7, title: 'Cavab cütü', why: 'Hər suala uyğun qısa cavabı tapdın.',
      prompt: 'Hostelin mətbəxində suallar.\nSuala toxun, sonra onun cavabını seç.',
      rows: [{ en: 'Are you from Iran?', az: "No, I'm not.", from: 'other' }, { en: 'Is she Russian?', az: 'Yes, she is.', from: 'G' }, { en: 'Do you speak French?', az: "No, I don't.", from: 'B' }],
      extra: ['Yes, he is.'],
      variants: [other('Bir sualın cavabı yerində deyil.', ex("Are you from Iran? — No, I'm not.; Is she Russian? — Yes, she is.; Do you speak French? — No, I don't.", 'Cavab sualın ilk sözünü və adamını qaytarır: you — I am, she — she is, do — I do.', "Is she Russian? — Yes, she is.; Do you speak French? — No, I don't.", "Are you from Iran? — No, I'm not."))],
    },
    {
      type: 'choice', id: 'u3x_c08', number: 8, title: 'Seç', why: 'Oğlan haqqında “he”, sonra “’s from”.',
      prompt: 'Video zəngdə qız ekrandakı oğlanı göstərir: oğlan Gürcüstandandır.\nQız nə deyir?',
      options: ["She's from Georgia.", "He's from Georgia.", 'He from Georgia.'], answer: "He's from Georgia.",
      variants: [
        pick("She's from Georgia.", 'Oğlan haqqında “he” deyilir.', ex("He's from Georgia.", 'Azərbaycancada ikisi də “o”dur, ingiliscə oğlan üçün “he” gəlir.', "He's from Georgia. — oğlan; She's from Georgia. — qız.", "He's from Georgia.")),
        pick('He from Georgia.', 'He-dən sonra ’s lazımdır.', ex("He's from Georgia.", '“-dır” ingiliscə ayrıca gəlir: he’s.', "He's from Georgia. — düzdür; He from Georgia. — olmur.", "He's from Georgia.")),
      ],
    },
    {
      type: 'voice', id: 'u3x_c09', number: 9, title: 'Haqqında soruş', why: 'Qız haqqında “she” ilə soruşdun.',
      prompt: 'Ziyafətdə yeni tanışın yanında bir qız var.\nTanışdan qızın haradan olduğunu soruş.', reply: "She's from France.",
      rule: said(String.raw`^(?:excuse me[,.]?\s*)?where(?:'?s| is)\s+she\s+from\s*\??$`, "Where's she from?", 'Where is she from?'),
      variants: [
        { match: { pattern: String.raw`\bwhere(?:'?s| is)\s+he\b` }, short: 'Qız haqqında “she” deyilir.', explain: ex("Where's she from?", 'Azərbaycancada ikisi də “o”dur, ingiliscə qız üçün “she” gəlir.', "Where's she from? — qız; Where's he from? — oğlan.", "Where's she from? — She's from France.") },
        other("Where's she from?", ex("Where's she from?", 'Başqası haqqında soruşanda “Where’s” ilə başlayırsan.', "Where's she from? — o; Where are you from? — sən.", "Where's she from?")),
      ],
    },
    {
      type: 'write', id: 'u3x_c10', number: 10, title: 'Mesaj yaz', why: 'Harada yaşadığını “I live in” ilə yazdın.',
      prompt: 'Dil klubunun çatında yeni üzv soruşur.\nHarada yaşadığını yaz (istəsən, istənilən şəhər).', placeholder: 'Cavabını yaz',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: 'Hi! Where do you live?' }] },
      rule: own(LIVE, 'I live in Baku.'),
      variants: [...LIVE_MISTAKES, other('I live in + şəhər.', ex('I live in Baku.', 'Harada yaşadığını “I live in” ilə yazırsan.', "I live in Baku. — harada yaşayıram; I'm from Baku. — haradanam.", 'Where do you live? — I live in Ganja.'))],
    },
    {
      type: 'write', id: 'u3x_c11', number: 11, title: 'Dinlə və yaz', why: 'Yaşadığı şəhər “live in”dən sonra gəlir: Baku.',
      prompt: 'Qatarda sərnişin özü haqqında danışır.\nO hansı şəhərdə yaşayır? Şəhərin adını ingiliscə yaz.', audio: "I'm from Ganja, but I live in Baku.", placeholder: 'Şəhər',
      rule: exact('Baku'),
      variants: [
        { match: { words: ['Ganja'] }, short: 'Gəncə haradan olduğudur.', explain: ex('Baku', '“from”dan sonra gəldiyi yer, “live in”dən sonra yaşadığı yer gəlir.', "I'm from Ganja. — haradan; I live in Baku. — harada yaşayır.", "I'm from Ganja, but I live in Baku.") },
        other('Yaşadığı şəhəri yaz.', ex('Baku', '“live in”dən sonrakı şəhərə qulaq as.', "I live in Baku. — harada yaşayır; I'm from Ganja. — haradan.", "I'm from Ganja, but I live in Baku.")),
      ],
    },
    {
      type: 'voice', id: 'u3x_c12', number: 12, title: 'Dillərini de', why: 'Hansı dillərdə danışdığını dedin.',
      prompt: 'Dil mübadiləsi masasında yeni tanış soruşur.\nCavab ver və hansı dillərdə danışdığını de.', audio: 'Do you speak English?', reply: 'Really? Nice!',
      rule: own(SPEAK, 'Yes, I do. I speak Azerbaijani and a little English.', 'I speak Azerbaijani and English.'),
      variants: [...SPEAK_MISTAKES, other('I speak + dil.', ex('I speak Azerbaijani and a little English.', 'Danışdığın dilləri “I speak” ilə de; bir neçəsini “and” birləşdirir.', 'I speak Azerbaijani. — bir dil; I speak Azerbaijani and English. — iki dil.', 'Yes, I do. I speak Azerbaijani and a little English.'))],
    },
    {
      type: 'write', id: 'u3x_c13', number: 13, title: 'Sualı qur', why: 'Danışmaq haqqında sual “Do” ilə başlayır.',
      prompt: 'Hostelin mətbəxində yanındakı gəncin türkcə bilib-bilmədiyini öyrənmək istəyirsən.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
      tiles: ['Turkish', 'speak', 'Are', 'you', 'Do', 'Turkey', '?'], rule: exact('Do you speak Turkish?'),
      variants: [
        { match: { pattern: String.raw`^are\s+you\s+speak` }, short: 'Bu sualda “are” yox, “do” gəlir.', explain: ex('Do you speak Turkish?', 'Danışmaq haqqında sualı “Do” başladır.', 'Do you speak Turkish? — dil; Are you Turkish? — millət.', 'Excuse me, do you speak Turkish?') },
        other('Sıra: Do you speak Turkish?', ex('Do you speak Turkish?', 'Do, sonra you speak, sonda dilin adı.', 'Do you speak Turkish? — dil; Are you from Turkey? — ölkə.', 'Excuse me, do you speak Turkish?')),
      ],
    },
    {
      type: 'match', mode: 'order', id: 'u3x_c14', number: 14, title: 'Söhbəti sırala', why: 'Tanışlıq söhbəti düz sıradadır.',
      prompt: 'Dil klubunun ziyafəti.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Hello! Where are you from?', from: 'other' }, { en: '2', az: "I'm from Azerbaijan. And you?", from: 'B' }, { en: '3', az: "I'm from Georgia, but I live here.", from: 'other' }, { en: '4', az: 'Really? Me too! I live here too.', from: 'B' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hello! Where are you from? → I'm from Azerbaijan. And you? → I'm from Georgia, but I live here. → Really? Me too! I live here too.", 'Sual, cavab və qarşı sual, sonra o biri cavab verir.', "Where are you from? — sual; And you? — qarşı sual.", 'Hello! Where are you from?'))],
    },
  ],
  result: {
    done: ['Bölmə 3 imtahanı bitdi', 'Ölkəni, milləti, he/she-ni, yaşadığın yeri və dilləri bir yerdə yoxladın.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Haradan', text: 'Haradan olduğunu demək və tanışlıq söhbətini anlamaq', tasks: ['u3x_c02', 'u3x_c14'] },
      { group: 'Ölkələr', text: 'Eşitdiyin ölkəni tanımaq və hərf-hərf yazmaq', tasks: ['u3x_c03', 'u3x_c04'] },
      { group: 'Millət', text: 'Formada milləti yazmaq, ölkə ilə milləti ayırmaq', tasks: ['u3x_c05', 'u3x_c06'] },
      { group: 'Bəli/xeyr', text: 'Qısa cavabları suala uyğunlaşdırmaq', tasks: ['u3x_c07'] },
      { group: 'He / she', text: 'Başqası haqqında demək və soruşmaq', tasks: ['u3x_c08', 'u3x_c09'] },
      { group: 'Yaşayış yeri', text: 'Harada yaşadığını yazmaq və eşitdiyini anlamaq', tasks: ['u3x_c10', 'u3x_c11'] },
      { group: 'Dillər', text: 'Dillərini demək və dil haqqında soruşmaq', tasks: ['u3x_c12', 'u3x_c13'] },
    ],
    closing: 'Təbriklər! Bölmə 3-ün bacarıqlarını yoxladın.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [],
};
