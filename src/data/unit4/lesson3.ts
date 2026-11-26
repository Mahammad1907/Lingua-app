// Bölmə 4 · Dərs 3 — his və her (his · His name is [ad]. · her · Her name is [ad]. · husband · wife).
// Ailə yeməyinin şəkli, video zəng. Əsas səhv: azərbaycancada his və her ikisi də “onun”dur; “He's name”, “His is name”, “His name Elvin”.
// his / her sahibə görə seçilir (kişinin → his, qadının → her), sonrakı sözə görə yox: her husband, his wife.
// Spiral: He's / She's (Bölmə 3), ailə sözləri və This is (Dərs 1–2), my, Who's this?, Is she…? (Bölmə 3).
import type { DesignLesson, ExplainCard } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, resultTexts, said } from '../unit3/shared';
import { END, HE_IS, SHE_IS, nameNoIs, nameOrder, ownerNotIs, wrongOwner } from './shared34';

/** “This is my sister. Her name is Nigar.” — the first sentence is optional. */
const herNameIs = (who: string, name: string) =>
  said(String.raw`^(?:(?:this\s+is|${SHE_IS})\s+my\s+${who}\s*[.,!]?\s*)?her\s+name\s+is\s+${name.toLowerCase()}${END}$`, `This is my ${who}. Her name is ${name}.`, `Her name is ${name}.`);
/** “Yes, she is. This is her husband.” (also “Yes, she's my sister. And this is her husband.”) — yes is required. */
const yesOwner = (subject: 'she' | 'he', owner: 'her' | 'his', who: 'husband' | 'wife') =>
  said(String.raw`^yes\s*[.,!]?\s*(?:(?:${subject}\s+is|${subject === 'she' ? SHE_IS : HE_IS}\s+my\s+${subject === 'she' ? 'sister' : 'brother'})\s*[.,!]?\s*)?(?:and\s+)?(?:this\s+is|${who === 'husband' ? HE_IS : SHE_IS})\s+${owner}\s+${who}${END}$`,
    `Yes, ${subject} is. This is ${owner} ${who}.`);

export const lesson3: DesignLesson = {
  id: 'a1_en_b4_d3', order: 65, unit: 4, number: 3, part: 1, title: 'his və her', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d3_c01', badge: 'Ailə və insanlar', subtitle: '{F} ailə yeməyinin şəklini göstərir. Sən də ailəni təqdim edirsən: onun (kişinin) adı, onun (qadının) adı.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'his və her fərqini eşidib seçə bilirəm.' },
        { icon: 'wave', text: 'Kişinin və qadının adını deyə bilirəm: His name is [ad]. / Her name is [ad].' },
        { icon: 'bye', text: 'Bacımı təqdim edib adını deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u4d3_c02', number: 2, scenes: ['u4/family-dinner'],
      word: 'his', pronunciation: '/hɪz/', reading: 'hiz', az: 'onun (kişinin)',
      notes: ['his — kişinin: atanın, qardaşının, dostunun.'],
      example: "He's my brother. This is his friend.", exampleAz: 'O, mənim qardaşımdır. Bu, onun dostudur.',
    },
    {
      type: 'choice', id: 'u4d3_c03', number: 3, title: 'Dinlə və seç', why: '“his family” — o kişinin ailəsi.', hint: 'family sözündən əvvəlki sözə qulaq as.',
      prompt: 'Ailə yeməyinin şəklində {f} masadakı bir kişini göstərir.\nBu, kimin ailəsidir?', audio: 'This is his family.',
      options: ['Sənin ailən', 'O kişinin ailəsi', '{F:gen} öz ailəsi'], answer: 'O kişinin ailəsi',
      variants: [
        pick('Sənin ailən', 'Sənin ailən olsaydı, your deyərdi.', ex('O kişinin ailəsi', 'Səsdə your yox, his var: kişinin.', 'his family — onun (kişinin); your family — sənin.', "He's my brother. This is his friend.")),
        pick('{F:gen} öz ailəsi', 'Öz ailəsi olsaydı, my deyərdi.', ex('O kişinin ailəsi', 'Səsdə my yox, his var: kişinin.', 'his family — onun (kişinin); my family — mənim.', "He's my brother. This is his friend.")),
      ],
      review: {
        title: 'Dinlə və seç', why: '“his friend” — qardaşının dostu.', hint: 'friend sözündən əvvəlki sözə qulaq as.',
        prompt: 'Video zəngdə {b} ekranda qardaşını və yanındakı gənci göstərir.\nYanındakı gənc kimdir?', audio: "He's my brother. This is his friend.",
        options: ['Qardaşının dostu', '{B:gen} öz dostu', 'Sənin dostun'], answer: 'Qardaşının dostu',
        variants: [
          pick('{B:gen} öz dostu', 'Öz dostu olsaydı, my friend deyərdi.', ex('Qardaşının dostu', 'Əvvəl qardaşını göstərir, sonra his friend deyir: qardaşının.', 'his friend — onun (kişinin); my friend — mənim.', 'This is his family.')),
          pick('Sənin dostun', 'Sənin dostun olsaydı, your friend deyərdi.', ex('Qardaşının dostu', 'Səsdə your yox, his var.', 'his friend — onun; your friend — sənin.', 'This is his family.')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d3_c04', number: 4, scenes: ['mascot/point'],
      word: 'His name is [ad].', pronunciation: '/hɪz neɪm ɪz/', reading: 'hiz neym iz [ad]', az: 'Onun (kişinin) adı [ad]-dır.',
      structure: ['His name is + ad.'],
      notes: ['his — onun (kişinin), name — ad, is — “-dır”: My name is kimi.'],
      example: "He's my brother. His name is Elvin.", exampleAz: 'O, mənim qardaşımdır. Onun adı Elvindir.',
    },
    {
      type: 'write', id: 'u4d3_c05', number: 5, title: 'Mesaj yaz', why: 'Kişinin adı — His name is.', hint: '“Onun” sözü burada kişiyə aiddir; sıra My name is kimidir.',
      prompt: 'Şəkildəki qardaşının adı Elvindir.\nSözlərdən cümlə qur: “Onun adı Elvindir.”', placeholder: 'Sözlərə toxun',
      photo: { from: 'Sən şəkil göndərdin', shows: 'qardaşın (Elvin)' },
      tiles: ['His', "He's", 'name', 'is', 'Elvin', 'my', '.'], rule: exact('His name is Elvin.'),
      variants: [
        ownerNotIs('his', 'His name is Elvin.', "He's my brother. His name is Elvin."),
        nameOrder('His name is Elvin.', "He's my brother. His name is Elvin."),
        other('His name is Elvin.', ex('His name is Elvin.', 'Kişinin adı: His name is, sonra ad.', 'My name is [ad]. — mənim; His name is Elvin. — onun.', "He's my brother. His name is Elvin.")),
      ],
      review: {
        title: 'Mesaj yaz', why: 'Kişinin adı — His name is.', hint: 'Tural kişidir — “onun” üçün kişi sözünü seç, sıra My name is kimidir.',
        prompt: 'Şəkildəki dostunun adı Turaldır.\nSözlərdən cümlə qur: “Onun adı Turaldır.”', placeholder: 'Sözlərə toxun',
        photo: { from: '{B} şəkil göndərdi', who: 'B', shows: '{B} və dostu Tural' },
        tiles: ['name', 'His', 'is', "He's", 'Tural', 'my', '.'], rule: exact('His name is Tural.'),
        variants: [
          ownerNotIs('his', 'His name is Tural.', "He's my friend. His name is Tural."),
          nameOrder('His name is Tural.', "He's my friend. His name is Tural."),
          other('His name is Tural.', ex('His name is Tural.', 'Kişinin adı: His name is, sonra ad.', 'My name is [ad]. — mənim; His name is Tural. — onun.', "He's my friend. His name is Tural.")),
        ],
      },
    },
    {
      type: 'word', id: 'u4d3_c06', number: 6, scenes: ['mascot/wave'],
      word: 'her', pronunciation: '/hɝ/', reading: 'hör', az: 'onun (qadının)',
      notes: ['her — qadının: ananın, bacının, rəfiqənin.'],
      example: "She's my friend. This is her mother.", exampleAz: 'O, mənim rəfiqəmdir. Bu, onun anasıdır.',
    },
    {
      type: 'choice', id: 'u4d3_c07', number: 7, title: 'Sözü tamamla', why: 'Bacının ailəsi — her family.', hint: 'Ailə kimindir: kişinin, yoxsa qadının?',
      prompt: '{F} bacısını göstərir, sonra onun ailəsini.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'This is', after: 'family.' },
      options: ['his', 'her', "she's"], answer: 'her',
      variants: [
        pick('his', 'Ailə bacınındır — qadının. Kişinin olsaydı, his olardı.', ex('her', 'Azərbaycancada ikisi də “onun”dur; qadının ailəsi üçün her.', 'her family — qadının; his family — kişinin.', "She's my friend. This is her mother.")),
        pick("she's", 'She’s “odur” deməkdir, “onun” yox.', ex('her', '“Onun ailəsi” üçün her deyilir.', "She's my sister. — odur; This is her family. — onun.", "She's my friend. This is her mother.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Qardaşının dostu — his friend.', hint: 'Dost kimindir: kişinin, yoxsa qadının?',
        prompt: 'Video zəngdə {b} qardaşını göstərir: “He\'s my brother.” Sonra qardaşının dostunu göstərir.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'This is', after: 'friend.' },
        options: ["he's", 'her', 'his'], answer: 'his',
        variants: [
          pick('her', 'Dost qardaşınındır — kişinin. Qadının olsaydı, her olardı.', ex('his', 'Azərbaycancada ikisi də “onun”dur; kişinin dostu üçün his.', 'his friend — kişinin; her friend — qadının.', "He's my brother. This is his friend.")),
          pick("he's", 'He’s “odur” deməkdir, “onun” yox.', ex('his', '“Onun dostu” üçün his deyilir.', "He's my brother. — odur; This is his friend. — onun.", "He's my brother. This is his friend.")),
        ],
      },
    },
    {
      type: 'word', id: 'u4d3_c08', number: 8, scenes: ['mascot/happy'],
      word: 'Her name is [ad].', pronunciation: '/hɝ neɪm ɪz/', reading: 'hör neym iz [ad]', az: 'Onun (qadının) adı [ad]-dır.',
      structure: ['Her name is + ad.'],
      notes: ['her — onun (qadının), name — ad, is — “-dır”; She’s name olmur.'],
      example: "She's my mother. Her name is Leyla.", exampleAz: 'O, mənim anamdır. Onun adı Leyladır.',
    },
    {
      type: 'voice', id: 'u4d3_c09', number: 9, title: 'Səslə cavab', why: 'Bacını təqdim etdin və adını dedin.', hint: 'Əvvəl kim olduğunu de, sonra qadının adını.',
      prompt: 'Şəkildəki bacının adı Nigardır.\nDe: bu, bacımdır, onun adı Nigardır.', audio: "Who's this?", reply: 'Hi, Nigar!',
      rule: herNameIs('sister', 'Nigar'),
      variants: [
        ownerNotIs('her', 'Her name is Nigar.', "She's my mother. Her name is Leyla."),
        wrongOwner('her', 'Her name is Nigar.', "She's my mother. Her name is Leyla."),
        nameNoIs('Her name is Nigar.', "She's my mother. Her name is Leyla."),
        other('This is my sister. Her name is Nigar.', ex('This is my sister. Her name is Nigar.', 'Bacın qadındır: əvvəl This is my sister, sonra Her name is.', 'Her name is Nigar. — qadının; His name is Elvin. — kişinin.', "She's my mother. Her name is Leyla.")),
      ],
      review: {
        title: 'Səslə cavab', why: 'Rəfiqəni təqdim etdin və adını dedin.', hint: 'Əvvəl Ayselin kim olduğunu de, sonra onun adını.',
        prompt: 'Yanındakı rəfiqənin adı Ayseldir.\nDe: bu, rəfiqəmdir, onun adı Ayseldir.', audio: "Who's this?", reply: 'Nice to meet you, Aysel!',
        rule: herNameIs('friend', 'Aysel'),
        variants: [
          ownerNotIs('her', 'Her name is Aysel.', "She's my mother. Her name is Leyla."),
          wrongOwner('her', 'Her name is Aysel.', "She's my mother. Her name is Leyla."),
          nameNoIs('Her name is Aysel.', "She's my mother. Her name is Leyla."),
          other('This is my friend. Her name is Aysel.', ex('This is my friend. Her name is Aysel.', 'Rəfiqən qadındır: əvvəl This is my friend, sonra Her name is.', 'Her name is Aysel. — qadının; His name is Tural. — kişinin.', "She's my mother. Her name is Leyla.")),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 3 · 1-ci hissə tamamlandı', 'Artıq his və her ilə başqasının adını deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'his və her fərqini eşidib seçmək', tasks: ['u4d3_c03', 'u4d3_c07'] },
      { group: 'Yazı', text: 'Kişinin adını yazmaq', tasks: ['u4d3_c05'] },
      { group: 'Danışıq', text: 'Bacını təqdim edib adını demək', tasks: ['u4d3_c09'] },
    ],
    closing: 'Növbəti hissə — ər və həyat yoldaşı: husband, wife.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'his', translation: 'onun (kişinin)', example: "He's my brother. This is his friend.", exampleAz: 'O, mənim qardaşımdır. Bu, onun dostudur.', usageNote: 'Kişinin — his.', pronunciation: '/hɪz/', teachCard: 'u4d3_c02' },
    { word: 'His name is [ad].', translation: 'Onun (kişinin) adı [ad]-dır.', example: "He's my brother. His name is Elvin.", exampleAz: 'O, mənim qardaşımdır. Onun adı Elvindir.', usageNote: 'My name is kimi, my yerinə his.', pronunciation: '/hɪz neɪm ɪz/', teachCard: 'u4d3_c04' },
    { word: 'her', translation: 'onun (qadının)', example: "She's my friend. This is her mother.", exampleAz: 'O, mənim rəfiqəmdir. Bu, onun anasıdır.', usageNote: 'Qadının — her.', pronunciation: '/hɝ/', teachCard: 'u4d3_c06' },
    { word: 'Her name is [ad].', translation: 'Onun (qadının) adı [ad]-dır.', example: "She's my mother. Her name is Leyla.", exampleAz: 'O, mənim anamdır. Onun adı Leyladır.', usageNote: 'Qadının adı: Her name is.', pronunciation: '/hɝ neɪm ɪz/', teachCard: 'u4d3_c08' },
  ],
};

export const lesson3_2: DesignLesson = {
  id: 'a1_en_b4_d3_2', order: 66, unit: 4, number: 3, part: 2, title: 'his və her', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d3_c20', badge: 'Ailə və insanlar', subtitle: '{F} ailə yeməyinin şəklini göstərir. Bacının ərini və qardaşının həyat yoldaşını təqdim edirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Ər və həyat yoldaşı sözlərini eşidib tanıyıram.' },
        { icon: 'wave', text: 'Bacımın ərini və qardaşımın həyat yoldaşını təqdim edə bilirəm.' },
        { icon: 'bye', text: 'his və her-i sahibinə görə seçə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u4d3_c10', number: 10, scenes: ['u4/family-dinner'],
      word: 'husband', pronunciation: '/ˈhʌzbənd/', reading: 'hazbənd', az: 'ər (qadının həyat yoldaşı)',
      notes: ['Vurğu birinci hecadadır: HAZ-bənd.'],
      example: 'This is my husband. His name is Rauf.', exampleAz: 'Bu, mənim ərimdir. Onun adı Raufdur.',
    },
    {
      type: 'choice', id: 'u4d3_c14', number: 11, title: 'Dinlə və seç', why: '“her husband” — bacısının əri.', hint: 'Əvvəl kimi göstərdiyinə, sonra husband-dan əvvəlki sözə qulaq as.',
      prompt: 'Ailə yeməyinin şəklində {f} bacısını, sonra yanındakı kişini göstərir.\nBu kişi kimdir?', audio: 'This is my sister. This is her husband.',
      options: ['Bacısının əri', '{F:gen} qardaşı', '{F:gen} atası'], answer: 'Bacısının əri',
      variants: [
        pick('{F:gen} qardaşı', 'Səsdə brother yoxdur, husband var.', ex('Bacısının əri', 'Əvvəl bacısını göstərir, sonra her husband deyir: bacısının əri.', 'her husband — qadının əri; my brother — qardaşım.', 'This is my sister. This is her husband.')),
        pick('{F:gen} atası', 'Səsdə father yoxdur, husband var.', ex('Bacısının əri', 'husband — ər; her — bacısının.', 'her husband — qadının əri; my father — atam.', 'This is my sister. This is her husband.')),
      ],
      review: {
        title: 'Dinlə və seç', why: '“his wife” — qardaşının həyat yoldaşı.', hint: 'Əvvəl kimi göstərdiyinə, sonra wife-dan əvvəlki sözə qulaq as.',
        prompt: 'Video zəngdə {b} qardaşını, sonra yanındakı qadını göstərir.\nBu qadın kimdir?', audio: 'This is my brother. This is his wife.',
        options: ['{B:gen} bacısı', 'Qardaşının həyat yoldaşı', '{B:gen} anası'], answer: 'Qardaşının həyat yoldaşı',
        variants: [
          pick('{B:gen} bacısı', 'Səsdə sister yoxdur, wife var.', ex('Qardaşının həyat yoldaşı', 'Əvvəl qardaşını göstərir, sonra his wife deyir: qardaşının həyat yoldaşı.', 'his wife — kişinin həyat yoldaşı; my sister — bacım.', 'This is my brother. This is his wife.')),
          pick('{B:gen} anası', 'Səsdə mother yoxdur, wife var.', ex('Qardaşının həyat yoldaşı', 'wife — həyat yoldaşı; his — qardaşının.', 'his wife — kişinin həyat yoldaşı; my mother — anam.', 'This is my brother. This is his wife.')),
        ],
      },
    },
    {
      type: 'write', id: 'u4d3_c13', number: 13, title: 'Dialoqu tamamla', why: 'Bacının əri — her husband.', hint: 'Əvvəl suala qısa cavab ver, sonra ərin kimin əri olduğunu düşün.',
      prompt: 'Çatda şəklinə baxırlar: bacın və onun əri.\nYaz: bəli, o bacımdır. Bu da onun əridir.', placeholder: 'Cavabın',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: 'Is she your sister?' }] },
      rule: yesOwner('she', 'her', 'husband'),
      variants: [
        wrongOwner('her', 'Yes, she is. This is her husband.', 'This is my sister. This is her husband.', 'Ər bacınındır, bacın qadındır — her.'),
        ownerNotIs('her', 'Yes, she is. This is her husband.', 'This is my sister. This is her husband.'),
        other('Yes, she is. This is her husband.', ex('Yes, she is. This is her husband.', 'Əvvəl qısa “bəli”, sonra bacının əri: her husband.', 'her husband — qadının əri; bacının əri də belə deyilir.', 'This is my sister. This is her husband.')),
      ],
      review: {
        title: 'Dialoqu tamamla', why: 'Qardaşının həyat yoldaşı — his wife.', hint: 'Əvvəl suala qısa cavab ver, sonra həyat yoldaşının kimin həyat yoldaşı olduğunu düşün.',
        prompt: 'Çatda şəklinə baxırlar: qardaşın və həyat yoldaşı.\nYaz: bəli, o qardaşımdır. Bu da onun həyat yoldaşıdır.', placeholder: 'Cavabın',
        chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: 'Is he your brother?' }] },
        rule: yesOwner('he', 'his', 'wife'),
        variants: [
          wrongOwner('his', 'Yes, he is. This is his wife.', 'This is my brother. His wife is from Ganja.', 'Həyat yoldaşı qardaşınındır, qardaşın kişidir — his.'),
          ownerNotIs('his', 'Yes, he is. This is his wife.', 'This is my brother. His wife is from Ganja.'),
          other('Yes, he is. This is his wife.', ex('Yes, he is. This is his wife.', 'Əvvəl qısa “bəli”, sonra qardaşının həyat yoldaşı: his wife.', 'his wife — kişinin həyat yoldaşı; her husband — qadının əri.', 'This is my brother. His wife is from Ganja.')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d3_c12', number: 12, scenes: ['mascot/think'],
      word: 'wife', pronunciation: '/waɪf/', reading: 'uayf', az: 'həyat yoldaşı (kişinin)',
      notes: ['w “u” kimi başlayır: uayf.'],
      example: 'This is my wife. Her name is Lala.', exampleAz: 'Bu, mənim həyat yoldaşımdır. Onun adı Laladır.',
    },
    {
      type: 'voice', id: 'u4d3_c15', number: 13, title: 'Səslə cavab', why: 'Qardaşının həyat yoldaşı — his wife.', hint: 'Həyat yoldaşı kimindir: kişinin, yoxsa qadının?',
      prompt: 'Telefonunda {f:dat} şəkil göstərirsən: qardaşın və həyat yoldaşı.\nDe: bu, qardaşımdır. Bu da onun həyat yoldaşıdır.', audio: "Who's this?", reply: 'Oh, nice!',
      rule: said(String.raw`^(?:(?:this\s+is|${HE_IS})\s+my\s+brother\s*[.,!]?\s*)?(?:and\s+)?(?:this\s+is|${SHE_IS})\s+his\s+wife${END}$`, 'This is my brother. This is his wife.', 'This is his wife.'),
      variants: [
        wrongOwner('his', 'This is my brother. This is his wife.', 'This is my brother. This is his wife.', 'Həyat yoldaşı qardaşınındır, qardaşın kişidir — his.'),
        ownerNotIs('his', 'This is my brother. This is his wife.', 'This is my brother. This is his wife.'),
        other('This is my brother. This is his wife.', ex('This is my brother. This is his wife.', 'Əvvəl qardaşını təqdim et, sonra onun həyat yoldaşını: his wife.', 'his wife — kişinin həyat yoldaşı; her husband — qadının əri.', 'This is my brother. This is his wife.')),
      ],
      review: {
        title: 'Səslə cavab', why: 'Bacının əri — her husband.', hint: 'Ər kimindir: kişinin, yoxsa qadının?',
        prompt: 'Qonşu evinizdəki şəklə baxıb soruşur. Şəkildə bacın və onun əri var.\nDe: bu, bacımdır. Bu da onun əridir.', audio: "Who's this?", reply: 'Oh, nice!',
        rule: said(String.raw`^(?:(?:this\s+is|${SHE_IS})\s+my\s+sister\s*[.,!]?\s*)?(?:and\s+)?(?:this\s+is|${HE_IS})\s+her\s+husband${END}$`, 'This is my sister. This is her husband.', 'This is her husband.'),
        variants: [
          wrongOwner('her', 'This is my sister. This is her husband.', 'This is my sister. This is her husband.', 'Ər bacınındır, bacın qadındır — her.'),
          ownerNotIs('her', 'This is my sister. This is her husband.', 'This is my sister. This is her husband.'),
          other('This is my sister. This is her husband.', ex('This is my sister. This is her husband.', 'Əvvəl bacını təqdim et, sonra onun ərini: her husband.', 'her husband — qadının əri; his wife — kişinin həyat yoldaşı.', 'This is my sister. This is her husband.')),
        ],
      },
    },
    {
      type: 'match', id: 'u4d3_c16', number: 14, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'his və her-dən sonrakı sözə fikir ver.',
      prompt: 'Ailə yeməyinin şəklinin altında üç cümlə var.\nHər cümləni mənasına uyğun gətir.',
      rows: [{ en: 'This is her husband.', az: 'Bu, onun (qadının) əridir.', from: 'other' }, { en: 'This is his wife.', az: 'Bu, onun (kişinin) həyat yoldaşıdır.', from: 'other' }, { en: 'His name is Rauf.', az: 'Onun adı Raufdur.', from: 'other' }],
      extra: ['Bu, mənim ərimdir.'],
      variants: [other('Bir məna yerində deyil.', ex('This is her husband. — qadının əri; This is his wife. — kişinin həyat yoldaşı; His name is Rauf. — onun adı.', 'husband — ər, wife — həyat yoldaşı; his — kişinin, her — qadının.', 'her husband — qadının əri; his wife — kişinin həyat yoldaşı.', 'This is my sister. This is her husband.'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'his və her-dən sonrakı sözə fikir ver.',
        prompt: 'Video zəngdə {f} yeni şəkillər göstərir.\nHər cümləni mənasına uyğun gətir.',
        rows: [{ en: 'This is his wife.', az: 'Bu, onun (kişinin) həyat yoldaşıdır.', from: 'other' }, { en: 'Her name is Lala.', az: 'Onun adı Laladır.', from: 'other' }, { en: 'This is my husband.', az: 'Bu, mənim ərimdir.', from: 'other' }],
        extra: ['Bu, onun (qadının) əridir.'],
        variants: [other('Bir məna yerində deyil.', ex('This is his wife. — kişinin həyat yoldaşı; Her name is Lala. — onun adı; This is my husband. — mənim ərim.', 'my — mənim, his — kişinin, her — qadının.', 'my husband — ərim; her husband — qadının əri.', 'This is my brother. This is his wife.'))],
      },
    },
    {
      type: 'drag', id: 'u4d3_drag', number: 14, title: 'Söz sürüklə', why: 'His name is Elvin — qardaşı; Her name is Lala — onun həyat yoldaşı.', hint: 'Hər adı eşidəndə ondan əvvəlki cümləyə fikir ver.',
      prompt: 'Ailə yeməyinin şəklində {f} iki nəfəri göstərir.\nDinlə və hər adamın altına sözü qoy.', audio: 'This is my brother. His name is Elvin. This is his wife. Her name is Lala.',
      people: [{ id: 'lala', label: 'Lala' }, { id: 'elvin', label: 'Elvin' }], chips: ['husband', 'brother', 'wife'], answers: { lala: 'wife', elvin: 'brother' },
      variants: [
        { field: 'lala', ...pick('husband', 'husband ərdir; Lala qadındır — his wife deyilir.', ex('Lala — wife', 'Lala qardaşın həyat yoldaşıdır: kişinin həyat yoldaşı — his wife.', 'his wife — kişinin həyat yoldaşı; her husband — qadının əri.', 'This is my brother. This is his wife.')) },
        { field: 'elvin', ...pick('husband', 'Elvin haqqında This is my brother deyilir.', ex('Elvin — brother', 'His name is Elvin cümləsi This is my brother cümləsindən sonra gəlir.', 'my brother — qardaşım; her husband — onun əri.', "He's my brother. His name is Elvin.")) },
        other('Lala ilə Elvinin sözləri yer dəyişib.', ex('Elvin — brother; Lala — wife', 'His name is Elvin — qardaş haqqındadır; Her name is Lala — həyat yoldaşı haqqında.', 'His name is Elvin. — kişinin; Her name is Lala. — qadının.', 'This is my wife. Her name is Lala.')),
      ],
      review: {
        title: 'Söz sürüklə', why: 'Her name is Nigar — bacısı; His name is Rauf — onun əri.', hint: 'Hər adı eşidəndə ondan əvvəlki cümləyə fikir ver.',
        prompt: 'Video zəngdə qonşu iki nəfəri göstərir.\nDinlə və hər adamın altına sözü qoy.', audio: 'This is my sister. Her name is Nigar. This is her husband. His name is Rauf.',
        people: [{ id: 'rauf', label: 'Rauf' }, { id: 'nigar', label: 'Nigar' }], chips: ['wife', 'sister', 'husband'], answers: { rauf: 'husband', nigar: 'sister' },
        variants: [
          { field: 'rauf', ...pick('wife', 'wife qadındır; Rauf kişidir — her husband deyilir.', ex('Rauf — husband', 'Rauf bacının əridir: qadının əri — her husband.', 'her husband — qadının əri; his wife — kişinin həyat yoldaşı.', 'This is my sister. This is her husband.')) },
          { field: 'nigar', ...pick('wife', 'Nigar haqqında This is my sister deyilir.', ex('Nigar — sister', 'Her name is Nigar cümləsi This is my sister cümləsindən sonra gəlir.', 'my sister — bacım; his wife — onun həyat yoldaşı.', "She's my mother. Her name is Leyla.")) },
          other('Rauf ilə Nigarın sözləri yer dəyişib.', ex('Nigar — sister; Rauf — husband', 'Her name is Nigar — bacı haqqındadır; His name is Rauf — ər haqqında.', 'Her name is Nigar. — qadının; His name is Rauf. — kişinin.', 'This is my husband. His name is Rauf.')),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 3 · 2-ci hissə tamamlandı', 'Artıq his və her ilə başqasının adını və ailəsini deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Əri və həyat yoldaşını eşidib tanımaq', tasks: ['u4d3_c14', 'u4d3_c16', 'u4d3_drag'] },
      { group: 'Yazı', text: 'Bacının ərini yazmaq', tasks: ['u4d3_c13'] },
      { group: 'Danışıq', text: 'Qardaşının həyat yoldaşını təqdim etmək', tasks: ['u4d3_c15'] },
    ],
    closing: 'Növbəti dərs — Bu sənin anandır?', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'husband', translation: 'ər', example: 'This is my husband. His name is Rauf.', exampleAz: 'Bu, mənim ərimdir. Onun adı Raufdur.', usageNote: 'Qadının həyat yoldaşı.', pronunciation: '/ˈhʌzbənd/', teachCard: 'u4d3_c10' },
    { word: 'wife', translation: 'həyat yoldaşı (kişinin)', example: 'This is my wife. Her name is Lala.', exampleAz: 'Bu, mənim həyat yoldaşımdır. Onun adı Laladır.', usageNote: 'Kişinin həyat yoldaşı.', pronunciation: '/waɪf/', teachCard: 'u4d3_c12' },
  ],
};

// Müəllim izahı (2): his / her — kimin olduğuna görə; aralarında tapşırıqlar var (c07, c09, ailə ağacı).
export const explains: { after: string; card: ExplainCard }[] = [
  {
    after: 'u4d3_c06',
    card: {
      type: 'explain', id: 'u4d3_c06t', number: 0,
      lead: 'Azərbaycancada bir söz var: “onun”. İngiliscə iki söz var: his və her.', focus: 'his və her',
      sections: [
        { title: 'Kimin haqqında danışırsan?', pairs: [{ en: 'his', az: 'kişinin' }, { en: 'her', az: 'qadının' }] },
        { title: 'He və she ilə necə bağlıdır?', text: 'Kişi haqqında he deyirsən, onun ailəsi üçün his. Qadın haqqında she deyirsən, onun ailəsi üçün her.' },
        { title: 'Necə qurulur?', build: { parts: ['his / her', 'ailə sözü'], examples: [{ en: "He's my brother. This is his friend.", az: 'O, qardaşımdır. Bu, onun dostudur.' }, { en: "She's my friend. This is her mother.", az: 'O, rəfiqəmdir. Bu, onun anasıdır.' }] } },
      ],
      attention: 'He’s “odur” deməkdir, his isə “onun”. Səsləri yaxındır, amma mənası başqadır.',
    },
  },
];

// Müəllim izahı of the second part (husband / wife).
export const explains2: { after: string; card: ExplainCard }[] = [
  {
    after: 'u4d3_c12',
    card: {
      type: 'explain', id: 'u4d3_c12t', number: 0,
      lead: 'his yoxsa her? Kimin ailəsi olduğuna bax.', focus: 'Kimin ailəsi',
      sections: [
        { title: 'Kimin əri, kimin həyat yoldaşı?', pairs: [{ en: 'her husband', az: 'qadının əri' }, { en: 'his wife', az: 'kişinin həyat yoldaşı' }] },
        { title: 'Necə seçirsən?', text: 'Sonra gələn adama yox, sahibinə bax. Bacının əri kişidir, amma bacın qadındır: her husband.' },
        { title: 'Nümunə', build: { parts: ['his / her', 'husband / wife'], examples: [{ en: 'This is my sister. This is her husband.', az: 'Bu, bacımdır. Bu, onun əridir.' }, { en: 'This is my brother. This is his wife.', az: 'Bu, qardaşımdır. Bu, onun həyat yoldaşıdır.' }] } },
      ],
      attention: 'Sahib kişidirsə his, qadındırsa her.',
    },
  },
];
export const ruleMeta: Record<string, { title: string; eg: string; topic: 'questions' | 'short' | 'order' | 'polite' | 'sound' | 'numbers' | 'letters' | 'country' }> = {
  u4d3_c06t: { title: 'Başqasının adını və ailəsini necə deyim?', eg: 'His name is [ad]. · Her name is [ad].', topic: 'order' },
  u4d3_c12t: { title: 'his və her-i necə seçim?', eg: 'This is her husband.', topic: 'order' },
};
