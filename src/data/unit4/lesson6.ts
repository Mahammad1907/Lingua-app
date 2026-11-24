// Bölmə 4 · Dərs 6 — Neçə yaşındadır? (old · How old is he? · He's [yaş]. / She's [yaş]. · How old is she?).
// Ailə şəkli və ad günü: xarici dost ailəsinin yaşlarını deyir, sən soruşursan. Yaş üçün keypad (Bölmə 2 kimi).
// Səhvlər: “How old he is?”, “He has thirty”, “He is thirty years”, fourteen ↔ forty, he ↔ she.
// Spiral: How old are you? I'm twenty-five. (Bölmə 2), rəqəmlər, He's / She's, Who's he?, Is this your…?, ailə sözləri.
import type { DesignLesson, ExplainCard } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, own, resultTexts, said } from '../unit3/shared';
import { AGE_OF_MISTAKES, ASK_AGE_MISTAKES, ageField, ageOf, num, whoAge } from './shared56';

const heShe = (p: 'he' | 'she', answer: string) => ({
  match: { pattern: p === 'she' ? String.raw`^(?:yes\s*,?\s*(?:it\s+is\s*[.,!]?\s*)?)?he(?:'?s|\s+is)?\b` : String.raw`^(?:yes\s*,?\s*(?:it\s+is\s*[.,!]?\s*)?)?she(?:'?s|\s+is)?\b` },
  short: p === 'she' ? 'Qadın haqqında She\'s deyilir.' : 'Kişi haqqında He\'s deyilir.',
  explain: ex(answer, p === 'she' ? 'Şəkildə qadındır — she.' : 'Şəkildə kişidir — he.', "He's thirty. — kişi; She's thirty. — qadın.", "How old is she? — She's twenty."),
});
const ageOther = (answer: string) => other("He's / She's + yaş.", ex(answer, 'Yaşı He\'s və ya She\'s ilə deyirsən, sonra rəqəm.', "He's thirty. — kişi; She's thirty. — qadın.", "How old is he? — He's forty."));

export const lesson6: DesignLesson = {
  id: 'a1_en_b4_d6', order: 41, unit: 4, number: 6, title: 'Neçə yaşındadır?', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d6_c01', badge: 'Ailə və insanlar', subtitle: 'Ad günü şəkillərində kim neçə yaşındadır — soruşursan və deyirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Ailə üzvünün yaşını soruşa bilirəm.' },
        { icon: 'wave', text: 'Onun yaşını deyə bilirəm: “She\'s twenty.”' },
        { icon: 'bye', text: 'Yaşı eşidib rəqəmlə yaza bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u4d6_c02', number: 2, scenes: ['mascot/think'],
      word: 'old', pronunciation: '/oʊld/', reading: 'ould', az: 'yaşlı',
      notes: ['How old are you? — hərfi mənası “nə qədər yaşlısan?”: yaş belə soruşulur.'],
      example: 'My grandfather is old.', exampleAz: 'Babam yaşlıdır.',
    },
    {
      type: 'match', id: 'u4d6_c03', number: 3, title: 'Kim nə dedi?', why: 'old — yaşlı; How old — neçə yaş.', scenes: ['u3/videocall'],
      prompt: '{F} video zəngdə ad günü şəkillərini göstərir.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'My grandfather is old.', az: 'Babam yaşlıdır.', from: 'other' }, { en: 'How old are you?', az: 'Neçə yaşın var?', from: 'G' }, { en: "I'm twenty-five.", az: '25 yaşındayam.', from: 'B' }],
      extra: ['Babam 25 yaşındadır.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("My grandfather is old. — Babam yaşlıdır.; How old are you? — Neçə yaşın var?; I'm twenty-five. — 25 yaşındayam.", 'old tək gələndə “yaşlı” deməkdir; How old isə yaş sualıdır.', "My grandfather is old. — yaşlıdır; How old are you? — neçə yaş.", "How old are you? — I'm thirty."))],
      review: {
        title: 'Kim nə dedi?', why: 'old — yaşlı; How old — neçə yaş.',
        prompt: 'Kursda yoldaşın nənəsinin şəklini göstərir.\nHər cümləyə mənasını qoş.',
        rows: [{ en: 'My grandmother is old.', az: 'Nənəm yaşlıdır.', from: 'other' }, { en: "I'm thirty.", az: '30 yaşındayam.', from: 'G' }, { en: 'Is this your grandmother?', az: 'Bu, sənin nənəndir?', from: 'B' }],
        extra: ['Nənəm 30 yaşındadır.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("My grandmother is old. — Nənəm yaşlıdır.; I'm thirty. — 30 yaşındayam.; Is this your grandmother? — Bu, sənin nənəndir?", 'old tək gələndə “yaşlı” deməkdir; rəqəm yaşı deyir.', "My grandmother is old. — yaşlıdır; I'm thirty. — yaş.", 'Is this your grandmother? — Yes, it is.'))],
      },
    },
    {
      type: 'word', id: 'u4d6_c04', number: 4, scenes: ['mascot/ask'],
      word: 'How old is he?', pronunciation: '/haʊ oʊld ɪz hi/', reading: 'hau ould iz hi?', az: 'O neçə yaşındadır? (kişi)',
      structure: ['How old are you? — sən', 'How old is he? — o (kişi)'],
      notes: ['you ilə are, he ilə is gəlir.'],
      example: 'Is this your brother? How old is he?', exampleAz: 'Bu, sənin qardaşındır? O neçə yaşındadır?',
    },
    {
      type: 'choice', id: 'u4d6_c05', number: 5, title: 'Dinlə və anla', why: '“How old is he?” — o neçə yaşındadır?', hint: 'Sualın ikinci hissəsindəki ikinci sözə qulaq as.',
      prompt: '{F} şəkildəki oğlanı göstərir. {G} soruşur.\n{G} nəyi soruşur?', audio: 'Is this your son? How old is he?',
      options: ['Oğlunun adı nədir?', 'Oğlun neçə yaşındadır?', 'Oğlun haradandır?'], answer: 'Oğlun neçə yaşındadır?',
      variants: [
        pick('Oğlunun adı nədir?', 'Səsdə “name” yoxdur, “old” var.', ex('Oğlun neçə yaşındadır?', 'How old — yaş sualıdır.', "How old is he? — yaş; What's his name? — ad.", 'Is this your brother? How old is he?')),
        pick('Oğlun haradandır?', 'Səsdə “from” yoxdur.', ex('Oğlun neçə yaşındadır?', 'Haradan olduğunu “Where is he from?” ilə soruşurlar, burada How old var.', 'How old is he? — yaş; Where are you from? — haradan.', 'Is this your brother? How old is he?')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“How old is he?” — o neçə yaşındadır?', hint: 'İki suala ayrıca qulaq as: ikincisi nəyi soruşur?',
        prompt: 'Kursda yoldaşın telefonda şəkil göstərir. Sən qulaq asırsan.\nO nəyi soruşur?', audio: "Who's he? How old is he?",
        options: ['O kimdir və neçə yaşındadır?', 'O kimdir və adı nədir?', 'O kimdir və necədir?'], answer: 'O kimdir və neçə yaşındadır?',
        variants: [
          pick('O kimdir və adı nədir?', 'Səsdə “name” yoxdur, “old” var.', ex('O kimdir və neçə yaşındadır?', 'How old — yaş sualıdır.', "How old is he? — yaş; What's his name? — ad.", 'Is this your father? How old is he?')),
          pick('O kimdir və necədir?', 'Hal sualında “old” olmur.', ex('O kimdir və neçə yaşındadır?', 'How are you? — hal; How old — yaş.', 'How old is he? — yaş; How are you? — hal.', "Who's he? How old is he?")),
        ],
      },
    },
    {
      type: 'word', id: 'u4d6_c06', number: 6, scenes: ['mascot/point'],
      word: "He's [yaş]. · She's [yaş].", pronunciation: '/hiz/ · /ʃiz/', reading: 'hiz [yaş] · şiz [yaş]', az: 'O, [yaş] yaşındadır. (kişi · qadın)',
      structure: ["He's + yaş", "She's + yaş"],
      notes: ['“yaşı var” tərcümə olunmur: He\'s + rəqəm kifayətdir.'],
      example: "How old is he? — He's thirty.", exampleAz: 'O neçə yaşındadır? — 30 yaşındadır.',
    },
    {
      type: 'write', id: 'u4d6_c07', number: 7, keypad: true, title: 'Yaşı yığ', why: "four-TEEN — 14.", hint: 'Vurğuya qulaq as: sonda güclüdürsə “teen”, əvvəldə güclüdürsə “ty”.',
      prompt: 'Ad günü tortuna şam rəqəmi sifariş edirsən. {F} bacısının yaşını deyir.\nDinlə və rəqəmi yığ.', audio: "My sister? She's fourteen.", placeholder: 'Şamın rəqəmi',
      rule: exact('14'),
      variants: [other('14 və 40-ı ayır.', ex('14', 'Vurğu sondadır: four-TEEN — 14.', 'four-TEEN — 14; FOR-ty — 40.', "She's fourteen."))],
      review: {
        keypad: true, title: 'Yaşı yığ', why: 'FOR-ty — 40.', hint: 'Atanın yaşında vurğu harada güclüdür — əvvəldə, yoxsa sonda?',
        prompt: 'Atanın ad günü üçün tort sifariş edirsən. Qardaşın atanın yaşını deyir.\nDinlə və rəqəmi yığ.', audio: "My father? He's forty.", placeholder: 'Şamın rəqəmi',
        rule: exact('40'),
        variants: [other('14 və 40-ı ayır.', ex('40', 'Vurğu əvvəldədir: FOR-ty — 40.', 'FOR-ty — 40; four-TEEN — 14.', "He's forty."))],
      },
    },
    {
      type: 'word', id: 'u4d6_c08', number: 8, scenes: ['mascot/globe'],
      word: 'How old is she?', pronunciation: '/haʊ oʊld ɪz ʃi/', reading: 'hau ould iz şi?', az: 'O neçə yaşındadır? (qadın)',
      structure: ['How old is he? — kişi', 'How old is she? — qadın'],
      notes: ['Qadın, qız haqqında she.'],
      example: "Is this your sister? How old is she? — She's twenty.", exampleAz: 'Bu, sənin bacındır? O neçə yaşındadır? — 20 yaşındadır.',
    },
    {
      type: 'choice', id: 'u4d6_c09', number: 9, title: 'Düz sualı seç', why: 'Qadın haqqında: How old is she?', hint: 'Şəkildə kim var — və is sualda harada durur?',
      prompt: 'Video zəngdə {f} nənəsinin şəklini göstərir.\nNənəsinin yaşını soruşmaq istəyirsən. Hansı sual düzdür?',
      options: ['How old she is?', 'How old is he?', 'How old is she?'], answer: 'How old is she?',
      variants: [
        pick('How old she is?', 'Sualda is qabağa keçir.', ex('How old is she?', 'Sualda is she sözündən əvvəl gəlir.', "How old is she? — sual; She's sixty. — cavab.", 'How old is your grandmother?')),
        pick('How old is he?', 'Nənə qadındır — she.', ex('How old is she?', 'he kişi, she qadın haqqındadır.', 'How old is he? — kişi; How old is she? — qadın.', 'Is this your grandmother? How old is she?')),
      ],
      review: {
        title: 'Düz sualı seç', why: 'Kişi haqqında: How old is he?', hint: 'Babanın yaşını soruşursan — kişi üçün hansı söz, is harada durur?',
        prompt: 'Kursda yoldaşın babasının şəklini göstərir.\nBabasının yaşını soruşmaq istəyirsən. Hansı sual düzdür?',
        options: ['How old is he?', 'How old is she?', 'How old he is?'], answer: 'How old is he?',
        variants: [
          pick('How old he is?', 'Sualda is qabağa keçir.', ex('How old is he?', 'Sualda is he sözündən əvvəl gəlir.', "How old is he? — sual; He's sixty. — cavab.", 'How old is your grandfather?')),
          pick('How old is she?', 'Baba kişidir — he.', ex('How old is he?', 'he kişi, she qadın haqqındadır.', 'How old is he? — kişi; How old is she? — qadın.', 'Is this your grandfather? How old is he?')),
        ],
      },
    },
    {
      type: 'voice', id: 'u4d6_c10', number: 10, title: 'Yaşını de', why: "She's + yaş: She's sixteen.", hint: 'Bacın haqqında de — “yaşındadır” üçün ayrıca söz lazım deyil.',
      prompt: '{F} sənin ailə şəklinə baxır və bacını soruşur.\nDe: o, 16 yaşındadır.', audio: 'Is this your sister? How old is she?', reply: 'Oh, nice!',
      rule: said(ageOf('she', num('sixteen', '16')), "She's sixteen."),
      variants: [...AGE_OF_MISTAKES, heShe('she', "She's sixteen."),
        { match: { pattern: String.raw`\bsixty\b|\b60\b` }, short: 'sixty — 60; 16 sixteen-dir.', explain: ex("She's sixteen.", 'Vurğu sondadır: six-TEEN — 16.', 'six-TEEN — 16; sixty — 60.', "She's sixteen.") },
        ageOther("She's sixteen.")],
      review: {
        title: 'Yaşını de', why: "He's + yaş: He's sixty-two.", hint: 'Baban haqqında de — “yaşındadır” üçün ayrıca söz lazım deyil.',
        prompt: 'Kursda yoldaşın sənin babanın şəklinə baxır və soruşur.\nDe: o, 62 yaşındadır.', audio: 'Is this your grandfather? How old is he?', reply: 'Really? Nice!',
        rule: said(ageOf('he', num('sixty-two', '62')), "He's sixty-two."),
        variants: [...AGE_OF_MISTAKES, heShe('he', "He's sixty-two."), ageOther("He's sixty-two.")],
      },
    },
    {
      type: 'profile', id: 'u4d6_profile', number: 11, title: 'Profil kartı', why: "This is my father. — ata; He's fifty-five. — 55 yaşındadır.", hint: 'İki cümləni ayrıca tut: birincisi kim olduğunu, ikincisi yaşını deyir.',
      prompt: '{F} ad günü şəklində bir kişini göstərir.\nDinlə və kartı doldur.', audio: "{F}: This is my father. He's fifty-five.",
      rows: [{ id: 'who', label: 'Kim', options: ['brother', 'father', 'grandfather'], answer: 'father' }, { id: 'age', label: 'Yaş', number: true, answer: '55' }],
      variants: [
        { field: 'who', ...pick('brother', 'Səsdə brother yox, father deyilir.', ex('father', 'Birinci cümlə This is my father ilə bitir — ata.', 'father — ata; brother — qardaş.', 'This is my father.')) },
        { field: 'who', ...pick('grandfather', 'Səsdə grand hissəsi yoxdur: yalnız father.', ex('father', 'grandfather uzun sözdür; səsdə qısa father deyilir.', 'father — ata; grandfather — baba.', 'This is my father.')) },
        { field: 'age', ...other('Səsdə fifty-five deyilir: 50 + 5.', ex('55', 'Əvvəl onluq gəlir: fifty — 50, sonra five — 5.', 'fifty-five — 55; fifteen — 15.', "He's fifty-five.")) },
        other('Kartı səslə yenidən yoxla.', ex('Kim — father; Yaş — 55', 'Birinci cümlə kim olduğunu, ikinci cümlə yaşını deyir.', "This is my father. — kim; He's fifty-five. — yaş.", "How old is he? — He's forty.")),
      ],
      review: {
        title: 'Profil kartı', why: "This is my daughter. — qızı; She's fifteen. — 15 yaşındadır.", hint: 'Birinci cümlədə ailə sözünü, ikincisində rəqəmin vurğusunu tut.',
        prompt: 'Kursda yoldaşın telefonda bir şəkil göstərir.\nDinlə və kartı doldur.', audio: "This is my daughter. She's fifteen.",
        rows: [{ id: 'who', label: 'Kim', options: ['sister', 'mother', 'daughter'], answer: 'daughter' }, { id: 'age', label: 'Yaş', number: true, answer: '15' }],
        variants: [
          { field: 'who', ...pick('sister', 'Səsdə sister yox, daughter deyilir.', ex('daughter', 'Birinci cümlə This is my daughter ilə bitir — qızı.', 'daughter — qız (övlad); sister — bacı.', 'This is my daughter.')) },
          { field: 'who', ...pick('mother', 'Səsdə mother yox, daughter deyilir.', ex('daughter', 'Birinci cümlə This is my daughter ilə bitir — qızı.', 'daughter — qız (övlad); mother — ana.', 'This is my daughter.')) },
          { field: 'age', ...other('fif-TEEN — 15, FIF-ty — 50.', ex('15', 'Vurğu sondadır: fif-TEEN — 15.', 'fif-TEEN — 15; FIF-ty — 50.', "She's fifteen.")) },
          other('Kartı səslə yenidən yoxla.', ex('Kim — daughter; Yaş — 15', 'Birinci cümlə kim olduğunu, ikinci cümlə yaşını deyir.', "This is my daughter. — kim; She's fifteen. — yaş.", "How old is she? — She's twenty.")),
        ],
      },
    },
    {
      type: 'write', id: 'u4d6_c11', number: 12, title: 'Sualı qur', why: 'How old + is + kim?', hint: 'Bu dərsin yaş sualını xatırla, sonda kimin nənəsi olduğunu qoy.',
      prompt: 'Qrup çatında {f} nənəsinin ad günü şəklini göndərdi.\nNənəsinin yaşını soruş. Sözlərdən sual qur.', placeholder: 'Sözlərə toxun',
      tiles: ['old', 'grandmother', 'is', 'How', 'your', 'are', 'you', '?'], rule: exact('How old is your grandmother?'),
      variants: [...ASK_AGE_MISTAKES, other('How old is your grandmother?', ex('How old is your grandmother?', 'Əvvəl How old, sonra is, sonra your grandmother.', 'How old is your grandmother? — o; How old are you? — sən.', 'How old is your father?'))],
      review: {
        title: 'Sualı qur', why: 'How old + is + kim?', hint: 'Bu dərsin yaş sualı ilə qur, sonda kimin oğlu olduğunu qoy.',
        prompt: 'Qonşu qadın oğlunun şəklini göstərir.\nOğlunun yaşını soruş. Sözlərdən sual qur.', placeholder: 'Sözlərə toxun',
        tiles: ['your', 'How', 'you', 'son', 'is', 'are', 'old', '?'], rule: exact('How old is your son?'),
        variants: [...ASK_AGE_MISTAKES, other('How old is your son?', ex('How old is your son?', 'Əvvəl How old, sonra is, sonra your son.', 'How old is your son? — o; How old are you? — sən.', 'How old is your daughter?'))],
      },
    },
    {
      type: 'two', id: 'u4d6_c12', number: 13, title: 'Vərəqi doldur', why: 'Ananın və atanın yaşını yazdın.', hint: 'Hər sətrin başlığını oxu; yaşı rəqəmlə yaza bilərsən.',
      prompt: 'Ad günü qonaqlarının siyahısını doldurursan.\nAnanın və atanın yaşını yaz (istəsən, uydurma).', form: { title: 'Ad günü', subtitle: 'Qonaqlar' },
      fields: [
        { id: 'u4d6_c12a', label: 'Mother', placeholder: 'Ananın yaşı', rule: own(ageField('she'), '50'), purpose: 'ananın yaşını yazmaq', empty: 'Ananın yaşını da yaz.' },
        { id: 'u4d6_c12b', label: 'Father', placeholder: 'Atanın yaşı', rule: own(ageField('he'), '55'), purpose: 'atanın yaşını yazmaq', empty: 'Atanın yaşını da yaz.' },
      ],
      variants: [
        { field: 'u4d6_c12a', match: { other: true }, explain: ex('50', 'Bu sətirdə ananın yaşı lazımdır: rəqəmlə və ya She\'s ilə.', "50 — rəqəmlə; She's fifty. — cümlə ilə.", "How old is she? — She's fifty.") },
        { field: 'u4d6_c12b', match: { other: true }, explain: ex('55', 'Bu sətirdə atanın yaşı lazımdır: rəqəmlə və ya He\'s ilə.', "55 — rəqəmlə; He's fifty-five. — cümlə ilə.", "How old is he? — He's fifty-five.") },
      ],
      review: {
        title: 'Vərəqi doldur', why: 'Babanın və nənənin yaşını yazdın.', hint: 'Hər sətrin başlığını oxu; sıra fərqli ola bilər.',
        prompt: 'Nənənin ad günü üçün qonaq siyahısı.\nBabanın və nənənin yaşını yaz (istəsən, uydurma).', form: { title: 'Ad günü', subtitle: 'Qonaqlar' },
        fields: [
          { id: 'u4d6_c12b', label: 'Grandfather', placeholder: 'Babanın yaşı', rule: own(ageField('he'), '65'), purpose: 'babanın yaşını yazmaq', empty: 'Babanın yaşını da yaz.' },
          { id: 'u4d6_c12a', label: 'Grandmother', placeholder: 'Nənənin yaşı', rule: own(ageField('she'), '60'), purpose: 'nənənin yaşını yazmaq', empty: 'Nənənin yaşını da yaz.' },
        ],
        variants: [
          { field: 'u4d6_c12b', match: { other: true }, explain: ex('65', 'Bu sətirdə babanın yaşı lazımdır: rəqəmlə və ya He\'s ilə.', "65 — rəqəmlə; He's sixty-five. — cümlə ilə.", "How old is he? — He's sixty-five.") },
          { field: 'u4d6_c12a', match: { other: true }, explain: ex('60', 'Bu sətirdə nənənin yaşı lazımdır: rəqəmlə və ya She\'s ilə.', "60 — rəqəmlə; She's sixty. — cümlə ilə.", "How old is she? — She's sixty.") },
        ],
      },
    },
    {
      type: 'write', id: 'u4d6_c13', number: 14, title: 'Mesaj yaz', why: 'Kim olduğunu və yaşını dedin.', hint: 'İki cümlə yaz: əvvəl bacının kim olduğunu, sonra yaşını.', scenes: ['u3/videocall'],
      prompt: '{F} çatda sənin ailə şəklinə baxıb bacın haqqında yazır.\nCavab yaz: o, sənin bacındır; yaşını da de (istəsən, uydurma).', placeholder: 'Cavabını yaz',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: "Who's she? How old is she?" }] },
      rule: own(whoAge('she', 'sister'), "She's my sister. She's twenty."),
      variants: [...AGE_OF_MISTAKES, heShe('she', "She's my sister. She's twenty."), other("She's my sister. She's [yaş].", ex("She's my sister. She's twenty.", 'Əvvəl kim olduğunu, sonra yaşını de.', "She's my sister. — kim; She's twenty. — yaş.", "He's my brother. He's thirty."))],
      review: {
        title: 'Mesaj yaz', why: 'Kim olduğunu və yaşını dedin.', hint: 'İki cümlə yaz: əvvəl qardaşının kim olduğunu, sonra yaşını.',
        prompt: 'Kurs yoldaşın çatda sənin ailə şəklinə baxıb qardaşın haqqında yazır.\nCavab yaz: o, sənin qardaşındır; yaşını da de (istəsən, uydurma).', placeholder: 'Cavabını yaz',
        chat: { partner: 'Kurs yoldaşı', from: 'other', lines: [{ from: 'other', text: "Who's he? How old is he?" }] },
        rule: own(whoAge('he', 'brother'), "He's my brother. He's thirty."),
        variants: [...AGE_OF_MISTAKES, heShe('he', "He's my brother. He's thirty."), other("He's my brother. He's [yaş].", ex("He's my brother. He's thirty.", 'Əvvəl kim olduğunu, sonra yaşını de.', "He's my brother. — kim; He's thirty. — yaş.", "She's my sister. She's twenty."))],
      },
    },
  ],
  result: {
    done: ['Dərs 6 tamamlandı', 'Artıq ailə üzvünün yaşını soruşur və deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Yaş sualını və rəqəmi eşidib anlamaq', tasks: ['u4d6_c03', 'u4d6_c05', 'u4d6_c07', 'u4d6_c09', 'u4d6_profile'] },
      { group: 'Yazı', text: 'How old is…? sualını qurmaq və yaşı yazmaq', tasks: ['u4d6_c11', 'u4d6_c12', 'u4d6_c13'] },
      { group: 'Danışıq', text: 'He\'s / She\'s ilə yaşı demək', tasks: ['u4d6_c10'] },
    ],
    closing: 'Növbəti dərs — ailəndə kim nə işləyir?', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'old', translation: 'yaşlı', example: 'My grandfather is old.', exampleAz: 'Babam yaşlıdır.', usageNote: 'How old — neçə yaş.', pronunciation: '/oʊld/', teachCard: 'u4d6_c02' },
    { word: 'How old is he?', translation: 'O neçə yaşındadır? (kişi)', example: 'Is this your brother? How old is he?', exampleAz: 'Bu, sənin qardaşındır? O neçə yaşındadır?', usageNote: 'he ilə is.', pronunciation: '/haʊ oʊld ɪz hi/', teachCard: 'u4d6_c04' },
    { word: "He's [yaş]. · She's [yaş].", translation: 'O, [yaş] yaşındadır.', example: "How old is he? — He's thirty.", exampleAz: 'O neçə yaşındadır? — 30 yaşındadır.', usageNote: '“yaşı var” tərcümə olunmur.', pronunciation: '/hiz/ · /ʃiz/', teachCard: 'u4d6_c06' },
    { word: 'How old is she?', translation: 'O neçə yaşındadır? (qadın)', example: "Is this your sister? How old is she? — She's twenty.", exampleAz: 'Bu, sənin bacındır? O neçə yaşındadır? — 20 yaşındadır.', usageNote: 'Qadın haqqında she.', pronunciation: '/haʊ oʊld ɪz ʃi/', teachCard: 'u4d6_c08' },
  ],
};

export const explains: { after: string; card: ExplainCard }[] = [
  { after: 'u4d6_c08', card: { type: 'explain', id: 'u4d6_c08t', number: 0,
    lead: 'Başqasının yaşını soruşanda is gəlir.', focus: 'How old is',
    sections: [
      { title: 'Kim haqqında?', pairs: [{ en: 'How old is he?', az: 'kişi, oğlan' }, { en: 'How old is she?', az: 'qadın, qız' }] },
      { title: 'Sözlərin sırası', text: 'Biz “O neçə yaşındadır?” deyirik. İngiliscə sualda is he, she sözündən əvvəl gəlir.' },
      { title: 'Cavab', build: { parts: ["She's", 'yaş'], examples: [{ en: "How old is she? — She's fourteen.", az: 'O neçə yaşındadır? — 14 yaşındadır.' }, { en: "How old is he? — He's thirty.", az: 'O neçə yaşındadır? — 30 yaşındadır.' }] } },
    ],
    attention: '“yaşı var” sözbəsöz tərcümə olunmur. Rəqəmdən sonra tək years demirik.',
  } },
];

export const ruleMeta: Record<string, { title: string; eg: string; topic: 'questions' | 'short' | 'order' | 'polite' | 'sound' | 'numbers' | 'letters' | 'country' }> = {
  u4d6_c08t: { title: 'Onun yaşını necə soruşum?', eg: "How old is she? — She's fourteen.", topic: 'questions' },
};
