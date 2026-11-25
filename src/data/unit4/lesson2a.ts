// Bölmə 4 · Dərs 2a — Ailə (1) (family · mother · father · brother · sister)
// Ailə şəkli: {F} albomu göstərir, ailə üzvlərini adlandırıram. Spiral: This is… (Dərs 1), my, Who's this?
// Tipik səhvlər: “This is mother” (my atmaq), th oxunuşu, “sistar”.
import type { DesignLesson, ExplainCard, Variant } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, resultTexts, said } from '../unit3/shared';

/** “This is my sister.” (also “She's my sister.”). “This is sister.” (my missing) is not accepted. */
const sayMy = (word: string, pron: 'he' | 'she') => said(String.raw`^(?:this\s+is|${pron}(?:'s|\s+is))\s+my\s+${word}\s*[.!]?$`, `This is my ${word}.`);
const noMy = (word: string, example: string): Variant => ({
  match: { pattern: String.raw`^this\s+is\s+${word}\b` }, short: `${word}-dən əvvəl my lazımdır.`,
  explain: ex(`This is my ${word}.`, `Azərbaycancada “${word === 'mother' ? 'anam' : 'bacım'}” bir sözdür; ingiliscə “mənim” ayrıca gəlir: my.`, `This is my ${word}. — düzdür; This is ${word}. — olmur.`, example) });
const otherMember = (word: string): Variant => other(`This is my ${word}.`, ex(`This is my ${word}.`, 'Ailə üzvünü This is my və onun adı ilə deyirsən.', 'This is my mother. — ana; This is my friend. — dost.', "Who's this? — This is my friend."));

export const lesson2a: DesignLesson = {
  id: 'a1_en_b4_d2a', order: 36, unit: 4, number: 2, part: 1, title: 'Ailə (1)', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d2a_c01', badge: 'Ailə və insanlar', subtitle: '{F} ailə şəkillərini göstərir. Şəkildəki ailə üzvlərini adlandırırsan.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Ailə şəkli haqqında eşitdiyimi başa düşürəm.' },
        { icon: 'wave', text: 'Ailə üzvlərini adlandıra bilirəm.' },
        { icon: 'bye', text: 'Şəkildəki adamın kim olduğunu deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u4d2a_c02', number: 2, scenes: ['mascot/point'],
      word: 'family', pronunciation: '/ˈfæməli/', reading: 'fəməli', az: 'ailə',
      notes: ['Üç hecadır: fə-mə-li. Vurğu birinci hecadadır.'],
      example: 'This is my family.', exampleAz: 'Bu mənim ailəmdir.',
    },
    {
      type: 'choice', id: 'u4d2a_c03', number: 3, title: 'Dinlə və anla', why: 'family — ailə; This is my family. — ailəsini göstərir.', hint: 'Cümlənin sonundakı sözə qulaq as.',
      prompt: '{F} ailə albomunu açır və bir şəkli göstərir.\nO nə deyir?', audio: 'Hi! This is my family.',
      options: ['Ailəsini göstərir.', 'Dostunu göstərir.', 'Adını deyir.'], answer: 'Ailəsini göstərir.',
      variants: [
        pick('Dostunu göstərir.', 'Səsdə friend yox, family var.', ex('Ailəsini göstərir.', 'Cümlənin sonunda family var — ailə, dost deyil.', 'my family — ailəm; my friend — dostum.', 'Hi! This is my family.')),
        pick('Adını deyir.', 'Səsdə ad yoxdur.', ex('Ailəsini göstərir.', 'Ad deyəndə I’m və ad gəlir; burada This is my family var.', "I'm Emma. — ad; This is my family. — ailə.", 'Hi! This is my family.')),
      ],
      review: {
        title: 'Dinlə və anla', why: 'family — ailə; This is my family. — ailəsini göstərir.', hint: 'Ekrandakı şəkil haqqında deyilən son sözə qulaq as.',
        prompt: 'Video zəngdə iş yoldaşın ekrana bir şəkil tutur.\nO nə deyir?', audio: 'Hello! This is my family.',
        options: ['Dostunu göstərir.', 'Adını deyir.', 'Ailəsini göstərir.'], answer: 'Ailəsini göstərir.',
        variants: [
          pick('Dostunu göstərir.', 'Səsdə friend yox, family var.', ex('Ailəsini göstərir.', 'Cümlənin sonunda family var — ailə, dost deyil.', 'my family — ailəm; my friend — dostum.', 'Hello! This is my family.')),
          pick('Adını deyir.', 'Səsdə ad yoxdur.', ex('Ailəsini göstərir.', 'Ad deyəndə I’m və ad gəlir; burada This is my family var.', "I'm Emma. — ad; This is my family. — ailə.", 'Hello! This is my family.')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d2a_c04', number: 4, scenes: ['mascot/happy'],
      word: 'mother · father', pronunciation: '/ˈmʌðər/ · /ˈfɑðər/', reading: 'ma**th**ər · fa**th**ər', az: 'ana · ata',
      notes: ['mother — “ma**th**ər” (o hərfi “a” kimi), father — “fa**th**ər”. th: dil dişlərin arasındadır.'],
      example: 'This is my mother.', exampleAz: 'Bu mənim anamdır.',
    },
    {
      type: 'write', id: 'u4d2a_c05', number: 5, title: 'Mesaj yaz', why: 'This is my mother. — ananı təqdim etdin.', hint: 'Dərs 1-dəki təqdim cümləsi kimi qur, ailə sözü sonda gəlir.',
      prompt: 'Şəkildə anan var.\nSözlərdən cavab qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: "Who's this?" }] },
      tiles: ['This', 'is', 'my', 'mother', '.', 'are', "I'm"], rule: exact('This is my mother.'),
      variants: [noMy('mother', 'This is my mother.'), other('Sıra: This is my mother.', ex('This is my mother.', 'Əvvəl This is, sonra my mother.', 'This is my mother. — ana; This is my friend. — dost.', 'This is my mother.'))],
      review: {
        title: 'Mesaj yaz', why: 'This is my mother. — ananı təqdim etdin.', hint: 'Qonşuya ananı Dərs 1-dəki təqdim cümləsi kimi göstər, ailə sözü sonda gəlir.',
        prompt: 'Şəkildə anan var.\nSözlərdən cavab qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Qonşu', from: 'other', lines: [{ from: 'other', text: "Who's this?" }] },
        tiles: ['my', 'This', 'mother', 'is', '.', 'I', 'are'], rule: exact('This is my mother.'),
        variants: [noMy('mother', 'This is my mother.'), other('Sıra: This is my mother.', ex('This is my mother.', 'Əvvəl This is, sonra my mother.', 'This is my mother. — ana; This is my friend. — dost.', 'This is my mother.'))],
      },
    },
    {
      type: 'voice', id: 'u4d2a_c07', number: 6, title: 'Dinlə və təkrarla', why: 'Cümləni dedin: This is my father.', hint: 'Əvvəl yavaş dinlə, sonra cümləni iki hissədə de.',
      prompt: '{F} atasının şəklini göstərir.\nDinlə, sonra eyni cür de.', audio: 'This is my father.', repeat: { stress: 'fa', note: 'father — “fa**th**ər”: **th** dil dişlərin arasında, “d” kimi demə.', reading: '**th**is iz may fa**th**ər' },
      rule: said(String.raw`^this\s+is\s+my\s+father\s*[.!]?$`, 'This is my father.'),
      variants: [other('This is my father.', ex('This is my father.', 'Əvvəl This is, sonra my və father.', 'This is my father. — ata; This is my mother. — ana.', 'This is my father.'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Cümləni dedin: This is my father.', hint: 'Tısbağa düyməsi ilə yavaş dinlə, sonra cümləni bir nəfəsdə de.',
        prompt: 'Video zəngdə iş yoldaşı atasının şəklini göstərir.\nDinlə, sonra eyni cür de.', audio: 'This is my father.', repeat: { stress: 'fa', note: 'father — “fa**th**ər”: **th** dil dişlərin arasında, “d” kimi demə.', reading: '**th**is iz may fa**th**ər' },
        rule: said(String.raw`^this\s+is\s+my\s+father\s*[.!]?$`, 'This is my father.'),
        variants: [other('This is my father.', ex('This is my father.', 'Əvvəl This is, sonra my və father.', 'This is my father. — ata; This is my mother. — ana.', 'This is my father.'))],
      },
    },
    {
      type: 'word', id: 'u4d2a_c08', number: 7, scenes: ['mascot/wave'],
      word: 'brother · sister', pronunciation: '/ˈbrʌðər/ · /ˈsɪstər/', reading: 'bra**th**ər · sistər', az: 'qardaş · bacı',
      notes: ['brother — “bra**th**ər”: o hərfi “a” kimi, th dil dişlərin arasında. sister — sonda “ər”: sistər, “sistar” yox.'],
      example: 'This is my brother.', exampleAz: 'Bu mənim qardaşımdır.',
    },
    {
      type: 'match', id: 'u4d2a_c09', number: 8, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Cümlənin sonundakı ailə sözünə fikir ver.',
      prompt: 'Albomun səhifəsində üç cümlə var.\nHər cümləni mənasına uyğun gətir.',
      rows: [{ en: 'This is my mother.', az: 'Bu mənim anamdır.', from: 'other' }, { en: 'This is my father.', az: 'Bu mənim atamdır.', from: 'other' }, { en: 'This is my brother.', az: 'Bu mənim qardaşımdır.', from: 'other' }],
      extra: ['Bu mənim dostumdur.'],
      variants: [other('Bir məna yerində deyil.', ex('This is my mother. — anam; This is my father. — atam; This is my brother. — qardaşım.', 'Cümlənin sonundakı söz kimin olduğunu göstərir: mother, father, brother.', 'This is my mother. — ana; This is my father. — ata.', 'This is my brother.'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Cümlənin sonundakı ailə sözünə fikir ver.',
        prompt: 'Video zəngdə {f} yeni şəkillər göstərir.\nHər cümləni mənasına uyğun gətir.',
        rows: [{ en: 'This is my brother.', az: 'Bu mənim qardaşımdır.', from: 'other' }, { en: 'This is my mother.', az: 'Bu mənim anamdır.', from: 'other' }, { en: 'This is my father.', az: 'Bu mənim atamdır.', from: 'other' }],
        extra: ['Bu mənim ailəmdir.'],
        variants: [other('Bir məna yerində deyil.', ex('This is my brother. — qardaşım; This is my mother. — anam; This is my father. — atam.', 'Cümlənin sonundakı söz kimin olduğunu göstərir: brother, mother, father.', 'This is my mother. — ana; This is my father. — ata.', 'This is my brother.'))],
      },
    },
    {
      type: 'voice', id: 'u4d2a_c12', number: 9, title: 'Səslə cavab', why: 'Bacını təqdim etdin: This is my sister.', hint: 'Bacını Dərs 1-dəki təqdim cümləsi ilə göstər, sonda ailə sözünü de.',
      prompt: '{F} şəkildəki qızı göstərib soruşur. Bu qız sənin bacındır.\nCavab ver.', audio: "Who's this?", reply: 'Nice!',
      rule: sayMy('sister', 'she'),
      variants: [noMy('sister', 'This is my sister.'), otherMember('sister')],
      review: {
        title: 'Səslə cavab', why: 'Bacını təqdim etdin: This is my sister.', hint: 'Video zəngdə də bacını Dərs 1-dəki təqdim cümləsi ilə göstər.',
        prompt: 'Video zəngdə iş yoldaşın şəkildəki qızı göstərib soruşur. Bu qız sənin bacındır.\nCavab ver.', audio: "Who's this?", reply: 'Nice!',
        rule: sayMy('sister', 'she'),
        variants: [noMy('sister', 'This is my sister.'), otherMember('sister')],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u4d2a_c13', number: 10, title: 'Söhbəti sırala', why: 'Sual, cavab, ikinci sual və ikinci cavab düz sıradadır.', hint: 'Hər sualın cavabı onun dərhal ardınca gəlir.',
      prompt: 'Albomun səhifəsi.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: "Hi! Who's this?", from: 'other' }, { en: '2', az: 'This is my mother.', from: 'G' }, { en: '3', az: "And who's this?", from: 'other' }, { en: '4', az: 'This is my sister.', from: 'G' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hi! Who's this? → This is my mother. → And who's this? → This is my sister.", 'Sual, cavab, sonra ikinci sual və cavab.', "Who's this? — sual; This is my mother. — cavab.", "Hi! Who's this?"))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, cavab, ikinci sual və ikinci cavab düz sıradadır.', hint: 'Hər sualın cavabı onun dərhal ardınca gəlir.',
        prompt: 'Video zəng.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: "Who's this?", from: 'other' }, { en: '2', az: 'This is my brother.', from: 'B' }, { en: '3', az: "And who's this?", from: 'other' }, { en: '4', az: 'This is my father.', from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Who's this? → This is my brother. → And who's this? → This is my father.", 'Sual, cavab, sonra ikinci sual və cavab.', "Who's this? — sual; This is my brother. — cavab.", "Who's this?"))],
      },
    },
  ],
  pool: [
    {
      type: 'choice', id: 'u4d2a_c11', number: 12, title: 'Sözü tamamla', why: 'Ailə üzvündən əvvəl “mənim” — my gəlir.', hint: '“Mənim” deyən söz Bölmə 1-də “adım” cümləsində var.',
      prompt: '{F} albomundakı şəkildə öz bacısını göstərir.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'Hello! This is', after: 'sister.' },
      options: ['my', 'me', 'I'], answer: 'my',
      variants: [
        pick('me', 'me “mən” mənasındadır, “mənim” deyil.', ex('my', 'Ailə üzvündən əvvəl “mənim” mənasında my gəlir.', 'my sister — mənim bacım; Me too. — mən də.', 'This is my sister.')),
        pick('I', 'I “mən” deməkdir, “mənim” deyil.', ex('my', 'Ailə üzvündən əvvəl “mənim” mənasında my gəlir.', "my sister — mənim bacım; I'm Tom. — mən Tomam.", 'This is my sister.')),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Ailə üzvündən əvvəl “mənim” — my gəlir.', hint: 'Şəkildəki qardaş sənindir — Dərs 1-dəki “mənim dostum” ifadəsini xatırla.',
        prompt: 'Ofisdə iş yoldaşına telefonundakı şəkli göstərirsən. Şəkildə sənin qardaşın var.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'Hi! This is', after: 'brother.' },
        options: ['I', 'my', 'me'], answer: 'my',
        variants: [
          pick('me', 'me “mən” mənasındadır, “mənim” deyil.', ex('my', 'Ailə üzvündən əvvəl “mənim” mənasında my gəlir.', 'my brother — mənim qardaşım; Me too. — mən də.', 'This is my brother.')),
          pick('I', 'I “mən” deməkdir, “mənim” deyil.', ex('my', 'Ailə üzvündən əvvəl “mənim” mənasında my gəlir.', "my brother — mənim qardaşım; I'm Tom. — mən Tomam.", 'This is my brother.')),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 2 · 1-ci hissə tamamlandı', 'Artıq ailə üzvlərini adlandırır və şəkildəkinin kim olduğunu deyirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Ailə üzvlərini eşidib tanımaq və söhbəti sıralamaq', tasks: ['u4d2a_c03', 'u4d2a_c09', 'u4d2a_c13'] },
      { group: 'Yazı', text: 'Ailə üzvünü təqdim edən cümlə qurmaq', tasks: ['u4d2a_c05'] },
      { group: 'Danışıq', text: 'Ailə üzvünü təqdim etmək', tasks: ['u4d2a_c07', 'u4d2a_c12'] },
    ],
    closing: 'Növbəti hissə — daha geniş ailə: parents, grandmother, grandfather.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'family', translation: 'ailə', example: 'This is my family.', exampleAz: 'Bu mənim ailəmdir.', usageNote: 'Üç hecadır: fə-mə-li.', pronunciation: '/ˈfæməli/', teachCard: 'u4d2a_c02' },
    { word: 'mother', translation: 'ana', example: 'This is my mother.', exampleAz: 'Bu mənim anamdır.', usageNote: 'Oxunuşu “ma**th**ər”.', pronunciation: '/ˈmʌðər/', teachCard: 'u4d2a_c04' },
    { word: 'father', translation: 'ata', example: 'This is my father.', exampleAz: 'Bu mənim atamdır.', usageNote: 'Oxunuşu “fa**th**ər”.', pronunciation: '/ˈfɑðər/', teachCard: 'u4d2a_c04' },
    { word: 'brother', translation: 'qardaş', example: 'This is my brother.', exampleAz: 'Bu mənim qardaşımdır.', usageNote: 'Oxunuşu “bra**th**ər”.', pronunciation: '/ˈbrʌðər/', teachCard: 'u4d2a_c08' },
    { word: 'sister', translation: 'bacı', example: 'This is my sister.', exampleAz: 'Bu mənim bacımdır.', usageNote: 'Sonda “ər”: sistər.', pronunciation: '/ˈsɪstər/', teachCard: 'u4d2a_c08' },
  ],
};

export const explains: { after: string; card: ExplainCard }[] = [
  {
    after: 'u4d2a_c04',
    card: {
      type: 'explain', id: 'u4d2a_c04t', number: 0,
      lead: 'Ailə üzvündən əvvəl my deyirsən.', focus: 'my',
      sections: [
        { title: 'Nə fərqlənir?', text: 'Biz “anam” deyirik: “ana” və “-m” bir sözdür. İngiliscə “mənim” ayrıca söz kimi əvvəldə gəlir: my mother.' },
        { title: 'Necə qurulur?', build: { parts: ['This is my', 'ailə sözü'], examples: [{ en: 'This is my mother.', az: 'Bu mənim anamdır.' }] } },
      ],
      attention: 'my atma: This is mother olmur. De: This is my mother.',
    },
  },
];

export const ruleMeta: Record<string, { title: string; eg: string; topic: 'questions' | 'short' | 'order' | 'polite' | 'sound' | 'numbers' | 'letters' | 'country' }> = {
  u4d2a_c04t: { title: 'Ailə üzvünü necə təqdim edim?', eg: 'This is my mother.', topic: 'order' },
};
