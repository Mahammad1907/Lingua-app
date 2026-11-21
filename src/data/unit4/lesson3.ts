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
/** “Yes, she is. This is her husband.” — the short answer is optional. */
const yesOwner = (subject: 'she' | 'he', owner: 'her' | 'his', who: 'husband' | 'wife') =>
  said(String.raw`^(?:yes\s*[.,!]?\s*(?:${subject}\s+is\s*[.!]?\s*)?)?(?:this\s+is|${who === 'husband' ? HE_IS : SHE_IS})\s+${owner}\s+${who}${END}$`,
    `Yes, ${subject} is. This is ${owner} ${who}.`);

export const lesson3: DesignLesson = {
  id: 'a1_en_b4_d3', order: 38, unit: 4, number: 3, title: 'his və her', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d3_c01', badge: 'Ailə və insanlar', subtitle: '{F} ailə yeməyinin şəklini göstərir. Sən də ailəni təqdim edirsən: onun adı, onun əri, onun arvadı.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'his və her fərqini eşidib seçə bilirəm.' },
        { icon: 'wave', text: 'Kişinin və qadının adını deyə bilirəm: His name is [ad]. / Her name is [ad].' },
        { icon: 'bye', text: 'Bacımın ərini və qardaşımın arvadını təqdim edə bilirəm.' },
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
        prompt: 'Video zəngdə oğlan ekranda qardaşını və yanındakı gənci göstərir.\nYanındakı gənc kimdir?', audio: "He's my brother. This is his friend.",
        options: ['Qardaşının dostu', 'Oğlanın öz dostu', 'Sənin dostun'], answer: 'Qardaşının dostu',
        variants: [
          pick('Oğlanın öz dostu', 'Öz dostu olsaydı, my friend deyərdi.', ex('Qardaşının dostu', 'Əvvəl qardaşını göstərir, sonra his friend deyir: qardaşının.', 'his friend — onun (kişinin); my friend — mənim.', 'This is his family.')),
          pick('Sənin dostun', 'Sənin dostun olsaydı, your friend deyərdi.', ex('Qardaşının dostu', 'Səsdə your yox, his var.', 'his friend — onun; your friend — sənin.', 'This is his family.')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d3_c04', number: 4, scenes: ['mascot/point'],
      word: 'His name is [ad].', pronunciation: '/hɪz neɪm ɪz/', reading: 'hiz neym iz [ad]', az: 'Onun (kişinin) adı [ad]-dır.',
      structure: ['His name is + ad.'],
      notes: ['My name is [ad]. kimi: yalnız my yerinə his.'],
      example: "He's my brother. His name is Elvin.", exampleAz: 'O, mənim qardaşımdır. Onun adı Elvindir.',
    },
    {
      type: 'write', id: 'u4d3_c05', number: 5, title: 'Mesaj yaz', why: 'Kişinin adı — His name is.', hint: '“Onun” sözü burada kişiyə aiddir; sıra My name is kimidir.',
      prompt: 'Ailə çatında {f} qardaşının şəklini görüb. Qardaşının adı Elvindir.\nSözlərdən cümlə qur: “Onun adı Elvindir.”', placeholder: 'Sözlərə toxun',
      tiles: ['His', "He's", 'name', 'is', 'Elvin', 'my', '.'], rule: exact('His name is Elvin.'),
      variants: [
        ownerNotIs('his', 'His name is Elvin.', "He's my brother. His name is Elvin."),
        nameOrder('His name is Elvin.', "He's my brother. His name is Elvin."),
        other('His name is Elvin.', ex('His name is Elvin.', 'Kişinin adı: His name is, sonra ad.', 'My name is [ad]. — mənim; His name is Elvin. — onun.', "He's my brother. His name is Elvin.")),
      ],
      review: {
        title: 'Mesaj yaz', why: 'Kişinin adı — His name is.', hint: '“Onun” sözü burada kişiyə aiddir; sıra My name is kimidir.',
        prompt: 'Oğlan kurs çatında yeni dostunun şəklini paylaşıb. Dostunun adı Turaldır.\nSözlərdən cümlə qur: “Onun adı Turaldır.”', placeholder: 'Sözlərə toxun',
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
      prompt: 'Ailə yeməyinin şəklində {f} bir qadını göstərir: “This is my sister.” Sonra onun ailəsini göstərir.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'This is', after: 'family.' },
      options: ['his', 'her', "she's"], answer: 'her',
      variants: [
        pick('his', 'Ailə bacınındır — qadının. Kişinin olsaydı, his olardı.', ex('her', 'Azərbaycancada ikisi də “onun”dur; qadının ailəsi üçün her.', 'her family — qadının; his family — kişinin.', "She's my friend. This is her mother.")),
        pick("she's", 'She’s “odur” deməkdir, “onun” yox.', ex('her', '“Onun ailəsi” üçün her deyilir.', "She's my sister. — odur; This is her family. — onun.", "She's my friend. This is her mother.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Qardaşının dostu — his friend.', hint: 'Dost kimindir: kişinin, yoxsa qadının?',
        prompt: 'Video zəngdə oğlan qardaşını göstərir: “He\'s my brother.” Sonra qardaşının dostunu göstərir.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'This is', after: 'friend.' },
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
      notes: ['Qadının adı: Her name is. She’s name demirik.'],
      example: "She's my mother. Her name is Leyla.", exampleAz: 'O, mənim anamdır. Onun adı Leyladır.',
    },
    {
      type: 'voice', id: 'u4d3_c09', number: 9, title: 'Səslə cavab', why: 'Bacını təqdim etdin və adını dedin.', hint: 'Əvvəl kim olduğunu de, sonra qadının adını.',
      prompt: 'Video zəngdə {f} sənin şəklindəki qadını göstərir. O, sənin bacındır, adı Nigardır.\nDe: bu, bacımdır, onun adı Nigardır.', audio: "Who's this?", reply: 'Hi, Nigar!',
      rule: herNameIs('sister', 'Nigar'),
      variants: [
        ownerNotIs('her', 'Her name is Nigar.', "She's my mother. Her name is Leyla."),
        wrongOwner('her', 'Her name is Nigar.', "She's my mother. Her name is Leyla."),
        nameNoIs('Her name is Nigar.', "She's my mother. Her name is Leyla."),
        other('This is my sister. Her name is Nigar.', ex('This is my sister. Her name is Nigar.', 'Bacın qadındır: əvvəl This is my sister, sonra Her name is.', 'Her name is Nigar. — qadının; His name is Elvin. — kişinin.', "She's my mother. Her name is Leyla.")),
      ],
      review: {
        title: 'Səslə cavab', why: 'Rəfiqəni təqdim etdin və adını dedin.', hint: 'Əvvəl kim olduğunu de, sonra qadının adını.',
        prompt: 'Ailə yeməyində yeni tanış yanındakı qızı göstərir. O, sənin rəfiqəndir, adı Ayseldir.\nDe: bu, rəfiqəmdir, onun adı Ayseldir.', audio: "Who's this?", reply: 'Nice to meet you, Aysel!',
        rule: herNameIs('friend', 'Aysel'),
        variants: [
          ownerNotIs('her', 'Her name is Aysel.', "She's my mother. Her name is Leyla."),
          wrongOwner('her', 'Her name is Aysel.', "She's my mother. Her name is Leyla."),
          nameNoIs('Her name is Aysel.', "She's my mother. Her name is Leyla."),
          other('This is my friend. Her name is Aysel.', ex('This is my friend. Her name is Aysel.', 'Rəfiqən qadındır: əvvəl This is my friend, sonra Her name is.', 'Her name is Aysel. — qadının; His name is Tural. — kişinin.', "She's my mother. Her name is Leyla.")),
        ],
      },
    },
    {
      type: 'word', id: 'u4d3_c10', number: 10, scenes: ['u4/family-dinner'],
      word: 'husband', pronunciation: '/ˈhʌzbənd/', reading: 'hazbənd', az: 'ər (qadının həyat yoldaşı)',
      notes: ['Vurğu birinci hecadadır: HAZ-bənd.'],
      example: 'This is my husband. His name is Rauf.', exampleAz: 'Bu, mənim ərimdir. Onun adı Raufdur.',
    },
    {
      type: 'match', id: 'u4d3_c11', number: 11, title: 'Kim nə dedi?', why: 'his, her və husband mənalarını tapdın.', hint: 'Hər cümlədə “kimin” sözünə bax: mənim, kişinin, yoxsa qadının?',
      prompt: 'Ailə yeməyində hamı ailəsini təqdim edir.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'This is my husband.', az: 'Bu, mənim ərimdir.', from: 'other' }, { en: 'His name is Kamal.', az: 'Onun (kişinin) adı Kamaldır.', from: 'G' }, { en: 'Her name is Sara.', az: 'Onun (qadının) adı Saradır.', from: 'B' }],
      extra: ['Mənim adım Saradır.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('This is my husband. — Bu, mənim ərimdir.; His name is Kamal. — Onun (kişinin) adı Kamaldır.; Her name is Sara. — Onun (qadının) adı Saradır.', 'my — mənim, his — kişinin, her — qadının.', 'His name is Kamal. — kişinin; Her name is Sara. — qadının.', 'This is my husband. His name is Rauf.'))],
      review: {
        title: 'Kim nə dedi?', why: 'his, her və husband mənalarını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
        prompt: 'Video zəngdə qız və oğlan ailə şəkillərini göstərir.\nHər cümləyə mənasını qoş.',
        rows: [{ en: 'This is her husband.', az: 'Bu, onun (qadının) əridir.', from: 'G' }, { en: 'Her name is Lala.', az: 'Onun (qadının) adı Laladır.', from: 'B' }, { en: 'My name is Rauf.', az: 'Mənim adım Raufdur.', from: 'other' }],
        extra: ['Onun (kişinin) adı Raufdur.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('This is her husband. — Bu, onun (qadının) əridir.; Her name is Lala. — Onun (qadının) adı Laladır.; My name is Rauf. — Mənim adım Raufdur.', 'my — mənim, his — kişinin, her — qadının.', 'My name is Rauf. — mənim; His name is Rauf. — onun.', 'This is my husband. His name is Rauf.'))],
      },
    },
    {
      type: 'word', id: 'u4d3_c12', number: 12, scenes: ['mascot/think'],
      word: 'wife', pronunciation: '/waɪf/', reading: 'uayf', az: 'arvad (kişinin həyat yoldaşı)',
      notes: ['w “u” kimi başlayır: uayf.'],
      example: 'This is my wife. Her name is Lala.', exampleAz: 'Bu, mənim arvadımdır. Onun adı Laladır.',
    },
    {
      type: 'write', id: 'u4d3_c13', number: 13, title: 'Dialoqu tamamla', why: 'Bacının əri — her husband.', hint: 'Ər kimindir? Ona görə “onun” sözünü seç.',
      prompt: 'Ailə şəklində bacın və onun əri var. {F} soruşur.\nYaz: bəli, o bacımdır. Bu da onun əridir.', placeholder: 'Cavabın',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: 'Is she your sister?' }] },
      rule: yesOwner('she', 'her', 'husband'),
      variants: [
        wrongOwner('her', 'Yes, she is. This is her husband.', 'This is my sister. This is her husband.', 'Ər bacınındır — qadının. Ona görə her: kişinin əri olmur.'),
        ownerNotIs('her', 'Yes, she is. This is her husband.', 'This is my sister. This is her husband.'),
        other('Yes, she is. This is her husband.', ex('Yes, she is. This is her husband.', 'Əvvəl qısa “bəli”, sonra bacının əri: her husband.', 'her husband — qadının əri; his wife — kişinin arvadı.', 'This is my sister. This is her husband.')),
      ],
      review: {
        title: 'Dialoqu tamamla', why: 'Qardaşının arvadı — his wife.', hint: 'Arvad kimindir? Ona görə “onun” sözünü seç.',
        prompt: 'Video zəngdə qardaşın və onun arvadı görünür. {F} soruşur.\nYaz: bəli, o qardaşımdır. Bu da onun arvadıdır.', placeholder: 'Cavabın',
        chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: 'Is he your brother?' }] },
        rule: yesOwner('he', 'his', 'wife'),
        variants: [
          wrongOwner('his', 'Yes, he is. This is his wife.', 'This is my brother. His wife is from Ganja.', 'Arvad qardaşınındır — kişinin. Ona görə his: qadının arvadı olmur.'),
          ownerNotIs('his', 'Yes, he is. This is his wife.', 'This is my brother. His wife is from Ganja.'),
          other('Yes, he is. This is his wife.', ex('Yes, he is. This is his wife.', 'Əvvəl qısa “bəli”, sonra qardaşının arvadı: his wife.', 'his wife — kişinin arvadı; her husband — qadının əri.', 'This is my brother. His wife is from Ganja.')),
        ],
      },
    },
    {
      type: 'choice', id: 'u4d3_c14', number: 14, title: 'Seçim', why: 'Qardaşının arvadı — his wife.', hint: 'Arvad kimindir: qardaşının, yoxsa başqa qadının?', scenes: ['u4/family-dinner'],
      prompt: 'Ailə yeməyində qardaşın və onun arvadı oturub. Arvadı Türkiyədəndir.\n{F:dat} nə deyirsən?',
      options: ['Her wife is from Turkey.', 'His wife is from Turkey.', "He's wife is from Turkey."], answer: 'His wife is from Turkey.',
      variants: [
        pick('Her wife is from Turkey.', 'Arvad qadına yox, qardaşına aiddir.', ex('His wife is from Turkey.', 'Sahib qardaşındır — kişi. Ona görə his wife.', 'his wife — kişinin arvadı; her husband — qadının əri.', 'This is my brother. His wife is from Ganja.')),
        pick("He's wife is from Turkey.", 'He’s “odur” deməkdir, “onun” yox.', ex('His wife is from Turkey.', '“Onun arvadı” üçün his deyilir.', "He's my brother. — odur; His wife is from Turkey. — onun.", 'This is my brother. His wife is from Ganja.')),
      ],
      review: {
        title: 'Seçim', why: 'Rəfiqənin əri — her husband.', hint: 'Ər kimindir: rəfiqənin, yoxsa başqa kişinin?',
        prompt: 'Video zəngdə rəfiqən və onun əri görünür. Əri Gürcüstandandır.\nOğlana nə deyirsən?',
        options: ["She's husband is from Georgia.", 'His husband is from Georgia.', 'Her husband is from Georgia.'], answer: 'Her husband is from Georgia.',
        variants: [
          pick('His husband is from Georgia.', 'Ər kişiyə yox, rəfiqənə aiddir.', ex('Her husband is from Georgia.', 'Sahib rəfiqəndir — qadın. Ona görə her husband.', 'her husband — qadının əri; his wife — kişinin arvadı.', 'This is my sister. This is her husband.')),
          pick("She's husband is from Georgia.", 'She’s “odur” deməkdir, “onun” yox.', ex('Her husband is from Georgia.', '“Onun əri” üçün her deyilir.', "She's my friend. — odur; Her husband is from Georgia. — onun.", 'This is my sister. This is her husband.')),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 3 tamamlandı', 'Artıq his və her ilə başqasının adını və ailəsini deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'his və her fərqini eşidib seçmək', tasks: ['u4d3_c03', 'u4d3_c07', 'u4d3_c11'] },
      { group: 'Yazı', text: 'Kişinin adını, bacının ərini və qardaşın arvadını yazmaq', tasks: ['u4d3_c05', 'u4d3_c13', 'u4d3_c14'] },
      { group: 'Danışıq', text: 'Bacını təqdim edib adını demək', tasks: ['u4d3_c09'] },
    ],
    closing: 'Növbəti dərs — Bu sənin anandır?', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'his', translation: 'onun (kişinin)', example: "He's my brother. This is his friend.", exampleAz: 'O, mənim qardaşımdır. Bu, onun dostudur.', usageNote: 'Kişinin — his.', pronunciation: '/hɪz/', teachCard: 'u4d3_c02' },
    { word: 'His name is [ad].', translation: 'Onun (kişinin) adı [ad]-dır.', example: "He's my brother. His name is Elvin.", exampleAz: 'O, mənim qardaşımdır. Onun adı Elvindir.', usageNote: 'My name is kimi, my yerinə his.', pronunciation: '/hɪz neɪm ɪz/', teachCard: 'u4d3_c04' },
    { word: 'her', translation: 'onun (qadının)', example: "She's my friend. This is her mother.", exampleAz: 'O, mənim rəfiqəmdir. Bu, onun anasıdır.', usageNote: 'Qadının — her.', pronunciation: '/hɝ/', teachCard: 'u4d3_c06' },
    { word: 'Her name is [ad].', translation: 'Onun (qadının) adı [ad]-dır.', example: "She's my mother. Her name is Leyla.", exampleAz: 'O, mənim anamdır. Onun adı Leyladır.', usageNote: 'Qadının adı: Her name is.', pronunciation: '/hɝ neɪm ɪz/', teachCard: 'u4d3_c08' },
    { word: 'husband', translation: 'ər', example: 'This is my husband. His name is Rauf.', exampleAz: 'Bu, mənim ərimdir. Onun adı Raufdur.', usageNote: 'Qadının həyat yoldaşı.', pronunciation: '/ˈhʌzbənd/', teachCard: 'u4d3_c10' },
    { word: 'wife', translation: 'arvad (həyat yoldaşı)', example: 'This is my wife. Her name is Lala.', exampleAz: 'Bu, mənim arvadımdır. Onun adı Laladır.', usageNote: 'Kişinin həyat yoldaşı.', pronunciation: '/waɪf/', teachCard: 'u4d3_c12' },
  ],
};

// Müəllim izahı (2): his / her — kimin olduğuna görə; aralarında tapşırıqlar var (c07, c09, c11).
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
  {
    after: 'u4d3_c12',
    card: {
      type: 'explain', id: 'u4d3_c12t', number: 0,
      lead: 'his yoxsa her? Kimin ailəsi olduğuna bax.', focus: 'Kimin ailəsi',
      sections: [
        { title: 'Kimin əri, kimin arvadı?', pairs: [{ en: 'her husband', az: 'qadının əri' }, { en: 'his wife', az: 'kişinin arvadı' }] },
        { title: 'Necə seçirsən?', text: 'Sonra gələn adama yox, sahibinə bax. Bacının əri kişidir, amma bacın qadındır: her husband.' },
        { title: 'Nümunə', build: { parts: ['his / her', 'husband / wife'], examples: [{ en: 'This is my sister. This is her husband.', az: 'Bu, bacımdır. Bu, onun əridir.' }, { en: 'This is my brother. This is his wife.', az: 'Bu, qardaşımdır. Bu, onun arvadıdır.' }] } },
      ],
      attention: 'Sahib kişidirsə his, qadındırsa her.',
    },
  },
];
export const ruleMeta: Record<string, { title: string; eg: string; topic: 'questions' | 'short' | 'order' | 'polite' | 'sound' | 'numbers' | 'letters' | 'country' }> = {
  u4d3_c06t: { title: 'Başqasının adını və ailəsini necə deyim?', eg: 'His name is [ad]. · Her name is [ad].', topic: 'order' },
  u4d3_c12t: { title: 'his və her-i necə seçim?', eg: 'This is her husband.', topic: 'order' },
};
