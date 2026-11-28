// Bölmə 4 · Dərs 4 — Bu sənin anandır? (your · Is this your mother? · Yes, it is. · No, it isn't. · Who's he? / Who's she?).
// Video zəng: {F} ailə şəkillərini göstərir, sən də öz şəkillərini. Səhvlər: “Is this you mother?”, “This is your mother?”,
// “Do this is your…?”, “Yes, it's.”, “No, it not.”, “No, I'm not.” (şəkildəki adam haqqında).
// Spiral: Is she Turkish? Yes, she is. (Bölmə 3), my, his / her (Dərs 3), ailə sözləri (Dərs 2).
import type { DesignLesson, ExplainCard } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, resultTexts, said } from '../unit3/shared';
import { END, HE_IS, NAME, NO_IT_MISTAKES, YES_IT_MISTAKES, QUESTION_MISTAKES, SHE_IS, isThisYour, noIt } from './shared34';

/** “He's my brother.” / “This is my brother.”, optionally with the name: “His name is Elvin.” */
const myPerson = (who: 'he' | 'she', word: string) =>
  said(String.raw`^(?:${who === 'he' ? HE_IS : SHE_IS}|this\s+is)\s+my\s+${word}${END}(?:\s*${who === 'he' ? 'his' : 'her'}\s+name\s+is\s+${NAME}${END})?$`,
    `${who === 'he' ? 'He' : 'She'}'s my ${word}.`);
const PERSON_MISTAKES = (who: 'he' | 'she', word: string) => {
  const answer = `${who === 'he' ? 'He' : 'She'}'s my ${word}.`;
  const example = who === 'he' ? "Who's he? — He's my brother." : "Who's she? — She's my sister.";
  return [
    { match: { pattern: who === 'he' ? String.raw`^she\b` : String.raw`^he\b` }, short: who === 'he' ? 'Kişi haqqında danışırsan — he.' : 'Qadın haqqında danışırsan — she.',
      explain: ex(answer, `Sual ${who === 'he' ? 'he' : 'she'} ilə gəlib, cavabda da eyni söz qayıdır.`, who === 'he' ? "Who's he? — He's my brother.; Who's she? — She's my sister." : "Who's she? — She's my sister.; Who's he? — He's my brother.", example) },
    { match: { pattern: String.raw`^(?:his|her)\s+my\b` }, short: '“odur” üçün he’s / she’s lazımdır.',
      explain: ex(answer, 'his və her “onun” deməkdir; burada “o, mənim qardaşımdır” deyirsən.', "He's my brother. — odur; His name is Elvin. — onun.", example) },
    { match: { pattern: String.raw`^s?he\s+my\b` }, short: 'He / she-dən sonra ’s (is) lazımdır.',
      explain: ex(answer, 'Azərbaycancada “-dır” şəkilçidir, ingiliscə ayrıca gəlir: ’s.', `${answer} — düzdür; ${answer.replace("'s", '')} — olmur.`, example) },
    { match: { pattern: String.raw`^s?he(?:'s|’s|\s+is)\s+(?!my\b)\p{L}` }, short: 'Ailə sözündən əvvəl my lazımdır.',
      explain: ex(answer, 'Azərbaycancada “qardaşım” bir sözdür; ingiliscə my ayrıca gəlir.', `${answer} — düzdür; ${answer.replace('my ', '')} — olmur.`, example) },
  ];
};

export const lesson4: DesignLesson = {
  id: 'a1_en_b4_d4', order: 67, unit: 4, number: 4, part: 1, title: 'Bu sənin anandır?', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d4_c01', badge: 'Ailə və insanlar', subtitle: 'Video zəngdə {f} ilə ailə şəkillərinə baxırsınız: kimdir, sənin ananmı, qardaşınmı?', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: '“Bu sənin bacındır?” sualını başa düşürəm.' },
        { icon: 'wave', text: '“Bu sənin anandır?” kimi sual verə bilirəm.' },
        { icon: 'bye', text: '“Bəli, elədir” ilə qısa cavab verə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u4d4_c02', number: 2, scenes: ['u4/videocall'],
      word: 'your', pronunciation: '/jʊr/', reading: 'yor', az: 'sənin, sizin',
      structure: ['your + ailə sözü'],
      notes: ['What’s your name? sualından tanışdır: you — sən, your — sənin.'],
      example: 'Is she your sister?', exampleAz: 'O, sənin bacındır?',
    },
    {
      type: 'choice', id: 'u4d4_c03', number: 3, title: 'Sözü tamamla', why: '“sənin bacın” — your sister.', hint: 'Bacı kimindir — şəkli kim göstərir?',
      prompt: 'Video zəngdə {f:dat} bacının şəklini göstərirsən. {F} soruşur.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'Is she', after: 'sister?' },
      options: ['you', 'your', 'my'], answer: 'your',
      variants: [
        pick('you', 'you — “sən”, your — “sənin”.', ex('your', 'Ailə sözündən əvvəl “sənin” lazımdır: your.', "What's your name? — your; How are you? — you.", 'Is she your sister?')),
        pick('my', '{F} öz bacısını yox, sənin bacını soruşur.', ex('your', 'my — “mənim”, your — “sənin”.', 'my sister — mənim bacım; your sister — sənin bacın.', 'Is she your sister?')),
      ],
      review: {
        title: 'Sözü tamamla', why: '“sənin atan” — your father.', hint: 'Ata kimindir — yeni tanış kimə sual verir?',
        prompt: 'Ailə yeməyində {b:gen} yanında yaşlı bir kişi oturub. Yeni tanış {b:abl} soruşur.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'Is he', after: 'father?' },
        options: ['my', 'you', 'your'], answer: 'your',
        variants: [
          pick('you', 'you — “sən”, your — “sənin”.', ex('your', 'Ailə sözündən əvvəl “sənin” lazımdır: your.', "What's your name? — your; How are you? — you.", 'Is she your sister?')),
          pick('my', 'Yeni tanış öz atasını yox, {b:gen} atasını soruşur.', ex('your', 'my — “mənim”, your — “sənin”.', 'my father — mənim atam; your father — sənin atan.', 'Is she your sister?')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d4_c04', number: 4, scenes: ['mascot/ask'],
      word: 'Is this your mother?', pronunciation: '/ɪz ðɪs jʊr ˈmʌðər/', reading: 'iz **th**is yor ma**th**ər?', az: 'Bu sənin anandır?',
      structure: ['Is this your + ailə sözü?'],
      notes: ['Is — sualı başladır, this — bu, your — sənin, mother — ana.'],
      example: 'Is this your father?', exampleAz: 'Bu sənin atandır?',
    },
    {
      type: 'choice', id: 'u4d4_c16', number: 5, title: 'Dinlə və anla', why: 'Is this your sister? — “Bu sənin bacındır?” sualıdır.', hint: 'Sual Is ilə başlayır — kimin bacısını soruşur?',
      prompt: 'Video zəngdə {f} sənin şəklinə baxır.\nO nə soruşur?', audio: 'Is this your sister?',
      options: ['Bu sənin bacındır?', 'Bu, mənim bacımdır.', 'Bacının adı nədir?'], answer: 'Bu sənin bacındır?',
      variants: [
        pick('Bu, mənim bacımdır.', 'Səsdə my yox, your var; cümlə də Is ilə başlayır — sualdır.', ex('Bu sənin bacındır?', 'Is ilə başlayan cümlə sualdır; your — sənin.', 'Is this your sister? — sual; This is my sister. — cümlə.', 'Is this your father?')),
        pick('Bacının adı nədir?', 'Səsdə name yoxdur.', ex('Bu sənin bacındır?', 'Ad soruşanda name deyilir; burada Is this your sister? var.', "Is this your sister? — bacındır?; What's your name? — ad.", 'Is this your father?')),
      ],
      review: {
        title: 'Dinlə və anla', why: 'Is this your father? — “Bu sənin atandır?” sualıdır.', hint: 'Sual Is ilə başlayır — kimin atasını soruşur?',
        prompt: 'Ailə yeməyində yeni tanış {b:gen} telefonundakı şəklə baxır.\nO nə soruşur?', audio: 'Is this your father?',
        options: ['Bu, mənim atamdır.', 'Atanın adı nədir?', 'Bu sənin atandır?'], answer: 'Bu sənin atandır?',
        variants: [
          pick('Bu, mənim atamdır.', 'Səsdə my yox, your var; cümlə də Is ilə başlayır — sualdır.', ex('Bu sənin atandır?', 'Is ilə başlayan cümlə sualdır; your — sənin.', 'Is this your father? — sual; This is my father. — cümlə.', 'Is this your father?')),
          pick('Atanın adı nədir?', 'Səsdə name yoxdur.', ex('Bu sənin atandır?', 'Ad soruşanda name deyilir; burada Is this your father? var.', "Is this your father? — atandır?; What's your name? — ad.", 'Is this your father?')),
        ],
      },
    },
    {
      type: 'write', id: 'u4d4_c05', number: 5, title: 'Mesaj yaz', why: 'Sual Is this ilə başlayır.', hint: 'Bəli/xeyr sualında hansı söz birinci gəlir?',
      prompt: '{F:gen} yanında yaşlı kişi var.\nSözlərdən sual qur: atasıdır?', placeholder: 'Sözlərə toxun',
      photo: { from: '{F} şəkil göndərdi', shows: 'dostun və yanında yaşlı kişi' },
      tiles: ['Is', 'this', 'your', 'father', 'you', 'This', 'is', '?'], rule: exact('Is this your father?'),
      variants: [...QUESTION_MISTAKES('Is this your father?'), other('Is this your father?', ex('Is this your father?', 'Sual Is ilə başlayır, sonra this, your və ailə sözü.', 'Is this your father? — sual; This is my father. — cümlə.', 'Is this your father?'))],
      review: {
        title: 'Mesaj yaz', why: 'Sual Is this ilə başlayır.', hint: 'Bu da bəli/xeyr sualıdır — söz sırasında hansı söz qabağa keçir?',
        prompt: '{G:gen} yanında kiçik qız var.\nSözlərdən sual qur: bacısıdır?', placeholder: 'Sözlərə toxun',
        photo: { from: '{G} şəkil göndərdi', who: 'G', shows: '{G} və yanında kiçik qız' },
        tiles: ['sister', 'Is', 'you', 'your', 'this', 'Do', '?'], rule: exact('Is this your sister?'),
        variants: [...QUESTION_MISTAKES('Is this your sister?'), other('Is this your sister?', ex('Is this your sister?', 'Sual Is ilə başlayır, sonra this, your və ailə sözü.', 'Is this your sister? — sual; This is my sister. — cümlə.', 'Is this your father?'))],
      },
    },
    {
      type: 'word', id: 'u4d4_c06', number: 6, scenes: ['mascot/happy'],
      word: 'Yes, it is.', pronunciation: '/jɛs ɪt ɪz/', reading: 'yes, it iz', az: 'Bəli, elədir.',
      structure: ['Is this your + ailə sözü? — Yes, it is.'],
      notes: ['Sualda this, cavabda it gəlir. Sonda is qısalmır.'],
      example: 'Is this your sister? — Yes, it is.', exampleAz: 'Bu sənin bacındır? — Bəli, elədir.',
    },
    {
      type: 'match', mode: 'reply', id: 'u4d4_c07', number: 7, title: 'Cavab cütü', why: 'Hər suala uyğun qısa cavabı tapdın.', hint: 'Sualın ilk iki sözünə bax: cavabda hansı söz qayıdır?',
      prompt: 'Video zəngdə {f} sənə suallar verir.\nSuala toxun, sonra onun cavabını seç.',
      rows: [{ en: 'Is this your brother?', az: 'Yes, it is.', from: 'other' }, { en: 'Are you from Baku?', az: 'Yes, I am.', from: 'G' }, { en: 'Is she Turkish?', az: 'Yes, she is.', from: 'B' }],
      extra: ["No, I don't."],
      variants: [other('Bir cavab yerində deyil.', ex('Is this your brother? — Yes, it is.; Are you from Baku? — Yes, I am.; Is she Turkish? — Yes, she is.', 'Sualdakı söz cavabda qayıdır: this → it, you → I, she → she.', 'Is this your brother? — Yes, it is.; Are you from Baku? — Yes, I am.', 'Is this your sister? — Yes, it is.'))],
      review: {
        title: 'Cavab cütü', why: 'Hər suala uyğun qısa cavabı tapdın.', hint: 'Əvvəl this olan sualı tap.',
        prompt: 'Ailə yeməyində yeni tanış suallar verir.\nSuala toxun, sonra onun cavabını seç.',
        rows: [{ en: 'Is this your father?', az: 'Yes, it is.', from: 'other' }, { en: 'Is he from Ganja?', az: 'Yes, he is.', from: 'G' }, { en: 'Do you speak English?', az: 'Yes, I do.', from: 'B' }],
        extra: ['Yes, I am.'],
        variants: [other('Bir cavab yerində deyil.', ex('Is this your father? — Yes, it is.; Is he from Ganja? — Yes, he is.; Do you speak English? — Yes, I do.', 'Sualdakı söz cavabda qayıdır: this → it, he → he, do → do.', 'Is this your father? — Yes, it is.; Do you speak English? — Yes, I do.', 'Is this your sister? — Yes, it is.'))],
      },
    },
    {
      type: 'voice', id: 'u4d4_c15', number: 8, title: 'Qısa cavab ver', why: 'Qısa “bəli” cavabı verdin: Yes, it is.', hint: 'Şəkildəki qadın sənin anandır — “bəli” cavabının sonunda is tam deyilir.',
      prompt: 'Video zəngdə {f} sənin şəklinə baxır. Şəkildəki qadın sənin anandır.\nQısa cavab ver.', audio: 'Is this your mother?', reply: 'Oh, nice!',
      rule: said(String.raw`^yes\s*[.,!]?\s*(?:it|she)\s+is${END}(?:\s*(?:${SHE_IS}|this\s+is)\s+my\s+mother${END})?$`, 'Yes, it is.'),
      variants: [...YES_IT_MISTAKES('Yes, it is.'), other('Yes, it is.', ex('Yes, it is.', 'O, sənin anandır — qısa “bəli” cavabı: Yes, it is.', 'Is this your mother? — Yes, it is.', 'Is this your sister? — Yes, it is.'))],
      review: {
        title: 'Qısa cavab ver', why: 'Qısa “bəli” cavabı verdin: Yes, it is.', hint: 'Şəkildəki kişi sənin babandır — “bəli” cavabının sonunda is tam deyilir.',
        prompt: 'Ailə yeməyində yeni tanış divardakı şəklə baxıb soruşur. Şəkildəki kişi sənin babandır.\nQısa cavab ver.', audio: 'Is this your grandfather?', reply: 'Oh, nice!',
        rule: said(String.raw`^yes\s*[.,!]?\s*(?:it|he)\s+is${END}(?:\s*(?:${HE_IS}|this\s+is)\s+my\s+grandfather${END})?$`, 'Yes, it is.'),
        variants: [...YES_IT_MISTAKES('Yes, it is.'), other('Yes, it is.', ex('Yes, it is.', 'O, sənin babandır — qısa “bəli” cavabı: Yes, it is.', 'Is this your grandfather? — Yes, it is.', 'Is this your sister? — Yes, it is.'))],
      },
    },
  ],
  result: {
    done: ['Dərs 4 · 1-ci hissə tamamlandı', 'Artıq “Bu sənin anandır?” soruşur və “bəli” cavabı verirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Şəkil haqqında sualı və qısa cavabları anlamaq', tasks: ['u4d4_c03', 'u4d4_c16', 'u4d4_c07'] },
      { group: 'Yazı', text: '“Bu sənin atandır?” sualını qurmaq', tasks: ['u4d4_c05'] },
      { group: 'Danışıq', text: 'Qısa “bəli” cavabı vermək', tasks: ['u4d4_c15'] },
    ],
    closing: 'Növbəti hissə — “xeyr” cavabı və “O kimdir?” sualı.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'your', translation: 'sənin, sizin', example: 'Is she your sister?', exampleAz: 'O, sənin bacındır?', usageNote: 'you — sən, your — sənin.', pronunciation: '/jʊr/', teachCard: 'u4d4_c02' },
    { word: 'Is this your mother?', translation: 'Bu sənin anandır?', example: 'Is this your father?', exampleAz: 'Bu sənin atandır?', usageNote: 'Is this your + ailə sözü?', pronunciation: '/ɪz ðɪs jʊr ˈmʌðər/', teachCard: 'u4d4_c04' },
    { word: 'Yes, it is.', translation: 'Bəli, elədir.', example: 'Is this your sister? — Yes, it is.', exampleAz: 'Bu sənin bacındır? — Bəli, elədir.', usageNote: 'Sonda is qısalmır.', pronunciation: '/jɛs ɪt ɪz/', teachCard: 'u4d4_c06' },
  ],
};

export const lesson4_2: DesignLesson = {
  id: 'a1_en_b4_d4_2', order: 68, unit: 4, number: 4, part: 2, title: 'Bu sənin anandır?', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d4_c20', badge: 'Ailə və insanlar', subtitle: 'Video zəngdə {f} ilə ailə şəkillərinə baxmağa davam edirsiniz: xeyr, bu o deyil — bəs kimdir?', start: 'Dərsə başla',
      goals: [
        { icon: 'bye', text: '“Xeyr, deyil” deyə bilirəm.' },
        { icon: 'chat', text: 'Şəkildəki kişinin və qadının kim olduğunu soruşa bilirəm.' },
        { icon: 'wave', text: 'Kim olduğunu deyə bilirəm: “He\'s my brother.”' },
      ],
    },
    {
      type: 'word', id: 'u4d4_c08', number: 8, scenes: ['mascot/think'],
      word: "No, it isn't.", pronunciation: '/noʊ ɪt ˈɪzənt/', reading: 'nou, it izənt', az: 'Xeyr, deyil.',
      structure: ["Is this your + ailə sözü? — No, it isn't."],
      notes: ["isn't — is not-un qısası."],
      example: "Is this your mother? — No, it isn't.", exampleAz: 'Bu sənin anandır? — Xeyr, deyil.',
    },
    {
      type: 'voice', id: 'u4d4_c09', number: 9, title: 'Qısa cavab ver', why: "Qısa “xeyr” cavabı verdin: No, it isn't.", hint: 'Şəkildəki qız sənin bacın deyil — “xeyr” cavabının sonunu xatırla.',
      prompt: 'Video zəngdə {f} sənin şəklinə baxır. Şəkildəki qız sənin rəfiqəndir, bacın deyil.\nQısa cavab ver.', audio: 'Is this your sister?', reply: 'Oh, OK!',
      rule: said(noIt('she', 'friend'), "No, it isn't."),
      variants: [...NO_IT_MISTAKES("No, it isn't."), other("No, it isn't.", ex("No, it isn't.", 'O, sənin bacın deyil — qısa “xeyr” cavabı.', "Yes, it is. — bəli; No, it isn't. — xeyr.", "Is this your mother? — No, it isn't."))],
      review: {
        title: 'Qısa cavab ver', why: "Qısa “xeyr” cavabı verdin: No, it isn't.", hint: 'Masadakı kişi sənin atan deyil — “xeyr” cavabının sonunu xatırla.',
        prompt: 'O kişi atan deyil, babandır.\nQısa cavab ver.', audio: 'Is this your father?', reply: 'Oh, sorry!',
        rule: said(noIt('he', 'grandfather'), "No, it isn't."),
        variants: [...NO_IT_MISTAKES("No, it isn't."), other("No, it isn't.", ex("No, it isn't.", 'O, sənin atan deyil — qısa “xeyr” cavabı.', "Yes, it is. — bəli; No, it isn't. — xeyr.", "Is this your mother? — No, it isn't."))],
      },
    },
    {
      type: 'word', id: 'u4d4_c10', number: 10, scenes: ['mascot/point'],
      word: "Who's he? · Who's she?", pronunciation: '/huz hi/ · /huz ʃi/', reading: 'huz hi? · huz şi?', az: 'O kimdir?',
      structure: ["Who's + he / she?"],
      notes: ['Who’s — kim(dir); kişi üçün he, qadın üçün she.'],
      example: "Who's she? — She's my sister.", exampleAz: 'O kimdir? — Mənim bacımdır.',
    },
    {
      type: 'write', id: 'u4d4_c17', number: 11, title: 'Mesaj yaz', why: 'Qadın haqqında soruşursan: Who’s she?', hint: 'Şəkildəki adam qadındır — sualın sonunda hansı söz gəlir?',
      prompt: 'Şəkildə tanımadığın bir qadın var.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
      photo: { from: '{F} şəkil göndərdi', shows: 'dostun və yanında tanımadığın qadın' },
      tiles: ["Who's", 'she', 'he', 'your', '?'], rule: exact("Who's she?", 'Who is she?'),
      variants: [
        { match: { pattern: String.raw`^who(?:'s|’s|\s+is)\s+he\b` }, short: 'Qadın haqqında soruşursan — she.', explain: ex("Who's she?", 'Şəkildəki adam qadındır: she.', "Who's she? — qadın; Who's he? — kişi.", "Who's she? — She's my sister.") },
        other("Who's she?", ex("Who's she?", 'Əvvəl Who’s, sonra qadın üçün she.', "Who's she? — qadın; Who's he? — kişi.", "Who's she? — She's my sister.")),
      ],
      review: {
        title: 'Mesaj yaz', why: 'Kişi haqqında soruşursan: Who’s he?', hint: 'Şəkildəki adam kişidir — sualın sonunda hansı söz gəlir?',
        prompt: 'Şəkildə tanımadığın bir kişi var.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
        photo: { from: '{G} şəkil göndərdi', who: 'G', shows: '{G} və yanında tanımadığın kişi' },
        tiles: ['he', "Who's", 'she', 'my', '?'], rule: exact("Who's he?", 'Who is he?'),
        variants: [
          { match: { pattern: String.raw`^who(?:'s|’s|\s+is)\s+she\b` }, short: 'Kişi haqqında soruşursan — he.', explain: ex("Who's he?", 'Şəkildəki adam kişidir: he.', "Who's he? — kişi; Who's she? — qadın.", "Who's he? — He's my brother.") },
          other("Who's he?", ex("Who's he?", 'Əvvəl Who’s, sonra kişi üçün he.', "Who's he? — kişi; Who's she? — qadın.", "Who's he? — He's my brother.")),
        ],
      },
    },
    {
      type: 'voice', id: 'u4d4_c11', number: 11, title: 'Səslə soruş', why: 'Bəli/xeyr sualı verdin: Is this your mother?', hint: 'Bəli/xeyr sualı qur — söz sırasına diqqət et.',
      prompt: 'Video zəngdə {f} öz şəklini göstərir: yanında yaşlı bir qadın var.\nSoruş: bu sənin anandır?', reply: 'Yes, it is!',
      rule: said(isThisYour('mother'), 'Is this your mother?'),
      variants: [...QUESTION_MISTAKES('Is this your mother?'), other('Is this your mother?', ex('Is this your mother?', 'Sual Is ilə başlayır, sonra this, your və ailə sözü.', 'Is this your mother? — sual; This is my mother. — cümlə.', 'Is this your father?'))],
      review: {
        title: 'Səslə soruş', why: 'Bəli/xeyr sualı verdin: Is this your brother?', hint: 'Yanındakı gənc haqqında bəli/xeyr sualı qur — söz sırasına diqqət et.',
        prompt: 'Ailə yeməyində {b} yanındakı gənci göstərir.\n{B:abl} soruş: bu sənin qardaşındır?', reply: "No, it isn't. He's my friend.",
        rule: said(isThisYour('brother'), 'Is this your brother?'),
        variants: [...QUESTION_MISTAKES('Is this your brother?'), other('Is this your brother?', ex('Is this your brother?', 'Sual Is ilə başlayır, sonra this, your və ailə sözü.', 'Is this your brother? — sual; This is my brother. — cümlə.', 'Is this your father?'))],
      },
    },
    {
      type: 'choice', id: 'u4d4_c12', number: 12, title: 'Dinlə və seç', why: '“she” — qadını soruşur.', hint: 'Who’s-dan sonrakı sözə qulaq as.',
      prompt: 'Video zəngdə {f} sənin ailə şəklinə baxır. Şəkildə atan və anan var.\n{F} kimi soruşur?', audio: "Who's she?",
      options: ['Atanı', 'Ananı', 'Səni'], answer: 'Ananı',
      variants: [
        pick('Atanı', 'Atan kişidir — onun üçün he olardı.', ex('Ananı', 'Səsdə she var: qadın haqqında soruşur.', "Who's she? — qadın; Who's he? — kişi.", "Who's she? — She's my sister.")),
        pick('Səni', 'Səni soruşsaydı, sualda you olardı.', ex('Ananı', 'Səsdə you yox, she var.', "Who's she? — o (qadın); What's your name? — sən.", "Who's she? — She's my sister.")),
      ],
      review: {
        title: 'Dinlə və seç', why: '“he” — kişini soruşur.', hint: 'Yeni tanışın sualındakı son sözə qulaq as: kişi, yoxsa qadın?',
        prompt: 'Ailə yeməyində yeni tanış divardakı şəklə baxır. Şəkildə nənən və baban var.\nO kimi soruşur?', audio: "Who's he?",
        options: ['Səni', 'Nənəni', 'Babanı'], answer: 'Babanı',
        variants: [
          pick('Nənəni', 'Nənən qadındır — onun üçün she olardı.', ex('Babanı', 'Səsdə he var: kişi haqqında soruşur.', "Who's he? — kişi; Who's she? — qadın.", "Who's he? — He's my brother.")),
          pick('Səni', 'Səni soruşsaydı, sualda you olardı.', ex('Babanı', 'Səsdə you yox, he var.', "Who's he? — o (kişi); What's your name? — sən.", "Who's he? — He's my brother.")),
        ],
      },
    },
    {
      type: 'write', id: 'u4d4_c13', number: 13, title: 'Dialoqu tamamla', why: 'Qardaşını təqdim etdin: He’s my brother.', hint: 'Oğlan haqqında “o” üçün uyğun sözü seç, sonra kimin qardaşı olduğunu de.',
      prompt: '{F} çatda sənin şəklinə baxıb yazır. Şəkildəki oğlan sənin qardaşındır.\nCavab yaz.', placeholder: 'Cavabın',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: "Who's he?" }] },
      rule: myPerson('he', 'brother'),
      variants: [...PERSON_MISTAKES('he', 'brother'), other("He's my brother.", ex("He's my brother.", 'Sual kişi haqqındadır: He’s my, sonra ailə sözü.', "He's my brother. — kişi; She's my sister. — qadın.", "Who's he? — He's my brother."))],
      review: {
        title: 'Dialoqu tamamla', why: 'Nənəni təqdim etdin: She’s my grandmother.', hint: 'Nənən haqqında “o” üçün uyğun sözü seç, sonra kimin nənəsi olduğunu de.',
        prompt: '{F} çatda sənin köhnə şəklinə baxıb yazır. Şəkildəki yaşlı qadın sənin nənəndir.\nCavab yaz.', placeholder: 'Cavabın',
        chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: "Who's she?" }] },
        rule: myPerson('she', 'grandmother'),
        variants: [...PERSON_MISTAKES('she', 'grandmother'), other("She's my grandmother.", ex("She's my grandmother.", 'Sual qadın haqqındadır: She’s my, sonra ailə sözü.', "She's my grandmother. — qadın; He's my grandfather. — kişi.", "Who's she? — She's my sister."))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u4d4_c14', number: 14, title: 'Söhbəti sırala', why: '“Xeyr” cavabından sonra “kimdir?” sualı və cavab gəlir.', hint: 'Bəli/xeyr sualı ilə başla; “xeyr”dən sonra kim olduğu soruşulur.',
      prompt: 'Video zəng. {F} {b:gen} şəklindəki adamları soruşur.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Is this your mother?', from: 'other' }, { en: '2', az: "No, it isn't.", from: 'B' }, { en: '3', az: "Who's she?", from: 'G' }, { en: '4', az: "She's my grandmother.", from: 'F' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Is this your mother? → No, it isn't. → Who's she? → She's my grandmother.", '“Xeyr” cavabından sonra kim olduğu soruşulur.', "Is this your mother? — bəli/xeyr sualı; Who's she? — kimdir.", "Is this your mother? — No, it isn't."))],
      review: {
        title: 'Söhbəti sırala', why: '“Xeyr” cavabından sonra “kimdir?” sualı və cavab gəlir.', hint: 'Əvvəl bəli/xeyr sualı gəlir; “xeyr”dən sonra nə soruşulur?',
        prompt: 'Ailə yeməyi. Yeni tanış {g:gen} albomundakı şəklə baxır.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Is this your father?', from: 'other' }, { en: '2', az: "No, it isn't.", from: 'G' }, { en: '3', az: "Who's he?", from: 'B' }, { en: '4', az: "He's my grandfather. His name is Kamal.", from: 'F' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Is this your father? → No, it isn't. → Who's he? → He's my grandfather. His name is Kamal.", '“Xeyr” cavabından sonra kim olduğu soruşulur.', "Is this your father? — bəli/xeyr sualı; Who's he? — kimdir.", "Who's he? — He's my brother."))],
      },
    },
  ],
  result: {
    done: ['Dərs 4 · 2-ci hissə tamamlandı', 'Artıq şəkildəki adamın kim olduğunu soruşur və qısa cavab verirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: '“O kimdir?” sualını anlamaq və söhbəti sıralamaq', tasks: ['u4d4_c12', 'u4d4_c14'] },
      { group: 'Yazı', text: 'Kim olduğunu soruşmaq və yazmaq', tasks: ['u4d4_c17', 'u4d4_c13'] },
      { group: 'Danışıq', text: 'Qısa “xeyr” cavabı vermək və “Bu sənin anandır?” soruşmaq', tasks: ['u4d4_c09', 'u4d4_c11'] },
    ],
    closing: 'Növbəti dərs — mənim qardaşım var: I have.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: "No, it isn't.", translation: 'Xeyr, deyil.', example: "Is this your mother? — No, it isn't.", exampleAz: 'Bu sənin anandır? — Xeyr, deyil.', usageNote: "isn't — is not.", pronunciation: '/noʊ ɪt ˈɪzənt/', teachCard: 'u4d4_c08' },
    { word: "Who's he? · Who's she?", translation: 'O kimdir?', example: "Who's she? — She's my sister.", exampleAz: 'O kimdir? — Mənim bacımdır.', usageNote: 'Kişi üçün he, qadın üçün she.', pronunciation: '/huz hi/ · /huz ʃi/', teachCard: 'u4d4_c10' },
  ],
};

// Müəllim izahı (1): qısa cavabda this → it; “Yes, it's.” olmur.
export const explains: { after: string; card: ExplainCard }[] = [];
// Müəllim izahı of the second part.
export const explains2: { after: string; card: ExplainCard }[] = [
  {
    after: 'u4d4_c08',
    card: {
      type: 'explain', id: 'u4d4_c08t', number: 0,
      lead: 'Is this your mother? sualına qısa cavab belədir.', focus: 'qısa cavab',
      sections: [
        { title: 'Cavablar', pairs: [{ en: 'Yes, it is.', az: 'bəli' }, { en: "No, it isn't.", az: 'xeyr' }] },
        { title: 'Niyə it?', text: 'Sualda this var: “bu”. Cavabda this təkrar deyilmir, onun yerinə it gəlir.' },
        { title: 'Qısa forma', short: { full: 'is not', drop: 'o', short: "isn't", note: 'Danışıqda qısa deyilir, mənası eynidir.' } },
      ],
      attention: "“Yes, it's.” olmur: “bəli” cavabının sonunda is tam deyilir.",
    },
  },
];
export const ruleMeta: Record<string, { title: string; eg: string; topic: 'questions' | 'short' | 'order' | 'polite' | 'sound' | 'numbers' | 'letters' | 'country' }> = {
  u4d4_c08t: { title: '“Bu sənin anandır?” sualına necə cavab verim?', eg: "Yes, it is. · No, it isn't.", topic: 'short' },
};
