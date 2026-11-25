// Bölmə 4 imtahanı (exam: true — Kömək və ipucu yoxdur, Təkrar turu yoxdur, keçid ≥70 %).
// Hər xəritə dərsindən (1–7) ən azı bir tapşırıq; dinlə + oxu + yaz + danış; yeni söz yoxdur.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, own, resultTexts, said } from '../unit3/shared';
import { nameNoIs, nameOrder, noIt, NO_IT_MISTAKES, ownerNotIs, QUESTION_MISTAKES, wrongOwner } from './shared34';
import { ASK_AGE_MISTAKES, ASK_MISTAKES, HAVE_MISTAKES, haveReply } from './shared56';
import { anForConsonant, aForVowel, forField, heForShe, noArticle } from './shared78';

/** “Who's this?” / “Who's she?” about a woman. “Who this?” is not accepted. */
const WHO = String.raw`^(?:excuse me[,.]?\s*)?who(?:'s|’s|\s+is)\s+(?:this|she)\s*\??$`;
/** Photo caption: “This is my mother.” (also “She's my mother.”). */
const MY_MOTHER = String.raw`^(?:this\s+is|she(?:'s|’s|\s+is))\s+my\s+mother\s*[.!]?$`;

export const exam: DesignLesson = {
  id: 'a1_en_b4_exam', order: 44, unit: 4, exam: true, title: 'Bölmə 4 imtahanı', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4x_c01', badge: 'Bölmə 4 imtahanı', subtitle: 'Kömək yoxdur. Keçmək üçün 70% lazımdır. Keçməsən, səhv bacarıqlar təkrara düşür və imtahanı yenidən verə bilərsən.', start: 'İmtahana başla',
      goals: [
        { icon: 'chat', text: 'Ailə, ad, yaş və peşə haqqında deyiləni anlayıram.' },
        { icon: 'wave', text: 'Kim olduğunu soruşur, ailəmi təqdim edir, yaşı soruşuram.' },
        { icon: 'bye', text: 'Ailəmdə kimin olduğunu, adını və peşəsini yazıram.' },
      ],
    },
    {
      type: 'voice', id: 'u4x_c02', number: 2, title: 'Kim olduğunu soruş', why: 'Kim olduğunu soruşdun: Who’s this?',
      prompt: 'Parkda {f} ilə görüşürsən. Onun yanında tanımadığın bir qadın var.\n{F:abl} qadının kim olduğunu soruş.', reply: 'This is my friend.',
      rule: said(WHO, "Who's this?", "Who's she?"),
      variants: [
        { match: { pattern: String.raw`^who\s+(?:this|she)\b` }, short: 'Sualda is lazımdır: Who’s this?',
          explain: ex("Who's this?", 'Azərbaycancada “kimdir” bir sözdür; ingiliscə is ayrıca gəlir: Who’s.', "Who's this? — düzdür; Who this? — olmur.", "Who's this? — This is my friend.") },
        { match: { pattern: String.raw`^who(?:'s|’s|\s+is)\s+he\b` }, short: 'Qadın haqqında “she” deyilir.',
          explain: ex("Who's she?", 'Azərbaycancada ikisi də “o”dur, ingiliscə qadın üçün “she” gəlir.', "Who's she? — qadın; Who's he? — kişi.", "Who's she? — She's my sister.") },
        { match: { pattern: String.raw`^this\s+is\b` }, short: 'Bu cümlə təqdimdir, sual deyil.',
          explain: ex("Who's this?", 'Kim olduğunu soruşursan: Who’s this? This is isə cavabdır.', "Who's this? — sual; This is my friend. — cavab.", "Who's this? — This is my friend.") },
        other("Who's this?", ex("Who's this?", 'Kim olduğunu soruşanda Who’s this? deyilir.', "Who's this? — sual; This is my friend. — cavab.", "Who's this? — This is my friend.")),
      ],
    },
    {
      type: 'tree', id: 'u4x_tree', number: 3, title: 'Ailə ağacı', why: 'grandfather — baba: atanın atası, ən yuxarı sırada.',
      prompt: '{F} sənin ailə ağacına baxır. “?” olan yerdə yaşlı bir kişi var.\nO kimdir? İngiliscə sözü seç.',
      nodes: [{ id: 'gm', label: 'grandmother', x: 25, y: 0 }, { id: 'gf', x: 75, y: 0 }, { id: 'dad', label: 'father', x: 50, y: 50 }, { id: 'me', label: 'sən', x: 50, y: 100 }],
      links: [['gm', 'gf'], ['gf', 'dad'], ['dad', 'me']], target: 'gf', options: ['father', 'grandfather', 'brother'], answer: 'grandfather',
      variants: [
        pick('father', 'father ortadadır; “?” onun da yuxarısındadır.', ex('grandfather', 'Atanın üstündəki kişi babandır: grand + father.', 'grandfather — baba; father — ata.', 'This is my grandfather.')),
        pick('brother', 'Qardaş səninlə eyni sırada olur; “?” ən yuxarıdadır.', ex('grandfather', 'Ən yuxarı sırada, nənənin yanındakı kişi babandır.', 'grandfather — baba; brother — qardaş.', 'This is my grandfather.')),
      ],
    },
    {
      type: 'choice', id: 'u4x_c04', number: 4, title: 'Sözü tamamla', why: 'Bacının əri — her husband.',
      prompt: 'Toy şəklində {f} bir qadını göstərir: “This is my sister.” Sonra onun yanındakı kişini göstərir.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'And this is', after: 'husband.' },
      options: ['his', 'her', "she's"], answer: 'her',
      variants: [
        pick('his', 'Ər qadınındır — her.', ex('And this is her husband.', 'Azərbaycancada ikisi də “onun”dur; ər bacınındır, qadının — her.', 'her husband — qadının əri; his wife — kişinin arvadı.', 'This is my sister. And this is her husband.')),
        pick("she's", 'She’s “odur” deməkdir, “onun” yox.', ex('And this is her husband.', '“Onun əri” üçün her lazımdır; she’s isə “odur” deməkdir.', "She's my sister. — odur; her husband — onun əri.", 'This is my sister. And this is her husband.')),
      ],
    },
    {
      type: 'write', id: 'u4x_c05', number: 5, keypad: true, title: 'Yaşı yığ', why: 'seven-TEEN — 17.',
      prompt: 'Ad günü siyahısını doldurursan. {F} qızının yaşını deyir.\nDinlə və rəqəmi yığ.', audio: "My daughter? She's seventeen.", placeholder: 'Yaş',
      rule: exact('17'),
      variants: [
        { match: { pattern: '^70$' }, short: '17 və 70-i ayır.', explain: ex('17', 'Vurğu sondadır: seven-TEEN — 17.', 'seven-TEEN — 17; SEV-en-ty — 70.', "She's seventeen.") },
        other('Rəqəmləri bir-bir yoxla.', ex('17', 'seventeen — 17: vurğu sondadır.', 'seven-TEEN — 17; SEV-en-ty — 70.', "She's seventeen.")),
      ],
    },
    {
      type: 'write', id: 'u4x_c06', number: 6, title: 'Sualı qur', why: 'Sual Is this ilə başlayır.',
      prompt: '{F} çata ailə şəkli göndərib: yanında kiçik bir qız var.\nSözlərdən sual qur: “Bu sənin qızındır?”', placeholder: 'Sözlərə toxun',
      tiles: ['Is', 'this', 'you', 'daughter', 'This', 'your', 'is', '?'], rule: exact('Is this your daughter?'),
      variants: [
        ...QUESTION_MISTAKES('Is this your daughter?'),
        other('Sıra: Is this your daughter?', ex('Is this your daughter?', 'Əvvəl Is this, sonra your və ailə sözü.', 'Is this your daughter? — sual; This is my daughter. — cümlə.', 'Is this your son?')),
      ],
    },
    {
      type: 'voice', id: 'u4x_c07', number: 7, title: 'Qısa cavab ver', why: "Qısa “xeyr” cavabı verdin: No, it isn't.",
      prompt: 'Video zəngdə {f} sənin şəklinə baxır. Şəkildəki kişi sənin baban, atan deyil.\nQısa cavab ver.', audio: 'Is this your father?', reply: 'Oh, OK!',
      rule: said(noIt('he', 'grandfather'), "No, it isn't.", "No, it isn't. He's my grandfather."),
      variants: [
        ...NO_IT_MISTAKES("No, it isn't."),
        other("No, it isn't.", ex("No, it isn't.", 'Şəkildəki adam soruşulan adam deyilsə, No, it isn’t deyirsən.', "Yes, it is. — bəli; No, it isn't. — xeyr.", "Is this your father? — No, it isn't. He's my grandfather.")),
      ],
    },
    {
      type: 'match', mode: 'reply', id: 'u4x_c08', number: 8, title: 'Cavab cütü', why: 'Hər suala uyğun qısa cavabı tapdın.',
      prompt: 'Ailə yeməyində {f} sənə suallar verir.\nSuala toxun, sonra onun cavabını seç.',
      rows: [{ en: 'Do you have a son?', az: "No, I don't.", from: 'other' }, { en: 'Is she your wife?', az: 'Yes, she is.', from: 'other' }, { en: 'How old is he?', az: "He's ten.", from: 'other' }],
      extra: ['Yes, I am.'],
      variants: [other('Bir sualın cavabı yerində deyil.', ex("Do you have a son? — No, I don't.; Is she your wife? — Yes, she is.; How old is he? — He's ten.", 'Do ilə suala do ilə, Is she ilə suala she is ilə, yaş sualına yaşla cavab verilir.', "Do you have a son? — No, I don't.; How old is he? — He's ten.", 'Is she your wife? — Yes, she is.'))],
    },
    {
      type: 'write', id: 'u4x_c09', number: 9, title: 'Cavab yaz', why: 'Do ilə suala do ilə cavab verdin.',
      prompt: '{F} çatda soruşur.\nDüzünü yaz: bacın var, yoxsa yox? (istəsən, uydurma)', placeholder: 'Cavabını yaz',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: 'Do you have a sister?' }] },
      rule: own(haveReply('sister'), 'Yes, I do.', "No, I don't.", 'Yes, I do. I have a sister.'),
      variants: [
        ...HAVE_MISTAKES, ...ASK_MISTAKES,
        other("Yes, I do. / No, I don't.", ex("Yes, I do. / No, I don't.", 'Sual Do ilə başlayıb — cavabda da do gəlir.', "Yes, I do. — var; No, I don't. — yoxdur.", 'Do you have a sister? — Yes, I do.')),
      ],
    },
    {
      type: 'choice', id: 'u4x_c10', number: 10, title: 'Seç', why: 'Qadın haqqında she; engineer-dən əvvəl an.',
      prompt: 'Video zəngdə {f} ananın şəklinə baxıb soruşur: “What’s her job?” Anan mühəndisdir.\nNə deyirsən?',
      options: ["She's a engineer.", "He's an engineer.", "She's an engineer."], answer: "She's an engineer.",
      variants: [
        pick("She's a engineer.", 'engineer-dən əvvəl a yox, an gəlir.', ex("She's an engineer.", 'engineer e səsi ilə başlayır: belə sözdən əvvəl an gəlir.', "She's an engineer. — düzdür; She's a engineer. — olmur.", "He's a doctor.")),
        pick("He's an engineer.", 'Qadın haqqında “she” deyilir.', ex("She's an engineer.", 'Azərbaycancada ikisi də “o”dur, ingiliscə qadın üçün “she” gəlir.', "She's an engineer. — qadın; He's an engineer. — kişi.", "What's her job? — She's an engineer.")),
      ],
    },
    {
      type: 'two', id: 'u4x_c11', number: 11, title: 'İki mesaj yaz', why: 'Bacının adını və peşəsini yazdın.',
      prompt: '{F} çatda sənin bacın haqqında soruşur. Bacının adı Laladır, tələbədir.\nİki mesaj yaz:\n1. Adı.\n2. Peşəsi.',
      fields: [
        { id: 'u4x_c11a', label: 'Birinci mesaj', placeholder: 'Adı', rule: exact('Her name is Lala.'), purpose: 'adını demək', empty: 'Birinci mesajı da yaz.' },
        { id: 'u4x_c11b', label: 'İkinci mesaj', placeholder: 'Peşəsi', rule: exact("She's a student.", 'She is a student.'), purpose: 'peşəsini demək', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: [
        forField('u4x_c11a', ownerNotIs('her', 'Her name is Lala.', 'This is my sister. Her name is Lala.')),
        forField('u4x_c11a', wrongOwner('her', 'Her name is Lala.', 'This is my sister. Her name is Lala.')),
        forField('u4x_c11a', nameNoIs('Her name is Lala.', 'This is my sister. Her name is Lala.')),
        forField('u4x_c11a', nameOrder('Her name is Lala.', 'This is my sister. Her name is Lala.')),
        forField('u4x_c11a', other('Her name is Lala.', ex('Her name is Lala.', 'Qadının adını demək üçün Her name is yazırsan.', 'Her name is Lala. — qadın; His name is Anar. — kişi.', 'This is my sister.'))),
        forField('u4x_c11b', heForShe("She's a student.", "He's a doctor.")),
        forField('u4x_c11b', noArticle("She's a student.", "She's student.", "He's a doctor.")),
        forField('u4x_c11b', anForConsonant("She's a student.", "She's an student.", 'student s səsi ilə başlayır: an yox, a gəlir.', "She's an engineer.")),
        forField('u4x_c11b', aForVowel("She's a student.", "She's a engineer.", "He's a doctor.")),
        forField('u4x_c11b', other("She's a student.", ex("She's a student.", 'Peşəni She\'s, a və peşə sözü ilə yazırsan.', "She's a student. — qadın; He's a student. — kişi.", "What's her job? — She's a student."))),
      ],
    },
    {
      type: 'voice', id: 'u4x_c12', number: 12, title: 'Yaşını soruş', why: 'Kişinin yaşını soruşdun: How old is he?',
      prompt: 'Video zəngdə {f} atasının şəklini göstərir.\nAtasının neçə yaşında olduğunu soruş.', reply: "He's sixty.",
      rule: said(String.raw`^how\s+old\s+is\s+(?:he|your\s+father)\s*\??$`, 'How old is he?', 'How old is your father?'),
      variants: [
        ...ASK_AGE_MISTAKES,
        { match: { pattern: String.raw`^how\s+old\s+is\s+she\b` }, short: 'Kişi haqqında “he” deyilir.',
          explain: ex('How old is he?', 'Azərbaycancada ikisi də “o”dur, ingiliscə kişi üçün “he” gəlir.', 'How old is he? — kişi; How old is she? — qadın.', 'How old is your father?') },
        other('How old is he?', ex('How old is he?', 'Yaşı soruşanda əvvəl How old, sonra is və kim.', 'How old is he? — o; How old are you? — sən.', 'How old is your father?')),
      ],
    },
    {
      type: 'profile', id: 'u4x_profile', number: 13, title: 'Profil kartı', why: "brother — qardaş; thirty-four — 34; a doctor — həkim.",
      prompt: 'Video zəngdə {f} albomdakı bir kişini göstərir.\nDinlə və kartı doldur.', audio: "{F}: This is my brother. He's thirty-four. He's a doctor.",
      rows: [{ id: 'who', label: 'Kim', options: ['father', 'son', 'brother'], answer: 'brother' }, { id: 'age', label: 'Yaş', number: true, answer: '34' },
        { id: 'job', label: 'Peşə', options: ['doctor', 'student', 'engineer'], answer: 'doctor' }],
      variants: [
        { field: 'who', ...pick('father', 'Səsdə father yox, brother deyilir.', ex('brother', 'Birinci cümlə This is my brother ilə bitir — qardaş.', 'brother — qardaş; father — ata.', 'This is my brother.')) },
        { field: 'who', ...pick('son', 'Səsdə son yox, brother deyilir.', ex('brother', 'Birinci cümlə This is my brother ilə bitir — qardaş.', 'brother — qardaş; son — oğul.', 'This is my brother.')) },
        { field: 'age', ...other('thirty-four — 34: əvvəl 30, sonra 4.', ex('34', 'Əvvəl onluq gəlir: thirty — 30, sonra four — 4.', 'thirty-four — 34; forty-three — 43.', "He's thirty-four.")) },
        { field: 'job', ...pick('student', 'Səsdə student yox, doctor deyilir.', ex('doctor', "Son cümlə He's a doctor-dur — həkim.", "He's a doctor. — həkim; He's a student. — tələbə.", "He's a doctor.")) },
        { field: 'job', ...pick('engineer', 'Səsdə an engineer yox, a doctor deyilir.', ex('doctor', 'Son cümlədə a doctor eşidilir; engineer olsaydı, an gələrdi.', "He's a doctor. — həkim; He's an engineer. — mühəndis.", "He's a doctor.")) },
        other('Kartı səslə yenidən yoxla.', ex('Kim — brother; Yaş — 34; Peşə — doctor', 'Hər cümlə kartın bir sətridir: kim, yaş, peşə.', "He's thirty-four. — yaş; He's a doctor. — peşə.", "What's his job? — He's a doctor.")),
      ],
    },
    {
      type: 'write', id: 'u4x_c13', number: 14, title: 'Şəklin altına yaz', why: 'Ananı təqdim etdin: This is my mother.',
      prompt: 'Ailə şəkillərini {f:dat} göndərirsən. Şəkildə sənin anan var.\nŞəklin altına yaz: “Bu mənim anamdır.”', placeholder: 'Yazını yaz',
      rule: own(MY_MOTHER, 'This is my mother.'),
      variants: [
        { match: { pattern: String.raw`^this\s+are\b` }, short: 'This ilə are olmur: is gəlir.',
          explain: ex('This is my mother.', 'Azərbaycancada “-dır” sonda gəlir; ingiliscə o, This-dən sonra ayrıca gəlir: is.', 'This is my mother. — düzdür; This are my mother. — olmur.', 'This is my family.') },
        { match: { pattern: String.raw`^this\s+is\s+mother\b|\bmother\s+my\b` }, short: 'mother-dən əvvəl my lazımdır.',
          explain: ex('This is my mother.', 'Azərbaycancada “anam” bir sözdür; ingiliscə “mənim” ayrıca gəlir: my.', 'This is my mother. — düzdür; This is mother. — olmur.', 'This is my family.') },
        { match: { pattern: String.raw`\byour\s+mother\b` }, short: 'Öz ananı göstərirsən — my.',
          explain: ex('This is my mother.', 'my — “mənim”, your — “sənin”.', 'This is my mother. — mənim; Is this your mother? — sənin.', 'This is my family.') },
        other('This is my mother.', ex('This is my mother.', 'Ailə üzvünü This is my və ailə sözü ilə yazırsan.', 'This is my mother. — ana; This is my father. — ata.', 'This is my family.')),
      ],
    },
    {
      type: 'match', id: 'u4x_c14', number: 15, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.',
      prompt: '{F} ailə albomundakı yazıları oxuyur.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'My parents are in Ganja.', az: 'Valideynlərim Gəncədədir.', from: 'other' }, { en: 'This is my son.', az: 'Bu mənim oğlumdur.', from: 'other' }, { en: "I don't have a brother.", az: 'Mənim qardaşım yoxdur.', from: 'other' }],
      extra: ['Bu mənim qızımdır.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("My parents are in Ganja. — Valideynlərim Gəncədədir.; This is my son. — Bu mənim oğlumdur.; I don't have a brother. — Mənim qardaşım yoxdur.", 'parents — valideynlər, son — oğul, I don’t have — yoxdur.', "This is my son. — oğul; This is my daughter. — qız.", 'I have a sister.'))],
    },
    {
      type: 'match', mode: 'order', id: 'u4x_c15', number: 16, title: 'Söhbəti sırala', why: 'Qarşılama, sual, təqdim və cavab düz sıradadır.',
      prompt: '{F} evinin qapısını açır, yanında kiçik oğlan var.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Hello! Welcome!', from: 'other' }, { en: '2', az: "Thank you! Who's this?", from: 'B' }, { en: '3', az: "This is my son. He's ten.", from: 'other' }, { en: '4', az: 'Hi! Nice to meet you!', from: 'B' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hello! Welcome! → Thank you! Who's this? → This is my son. He's ten. → Hi! Nice to meet you!", 'Əvvəl qarşılama, sonra kim olduğunu soruşur, təqdim gəlir, sonda salam.', "Who's this? — sual; This is my son. — cavab.", 'Hello! Welcome!'))],
    },
  ],
  result: {
    done: ['Bölmə 4 imtahanı bitdi', 'Ailəni, his/her-i, your sualını, var/yoxu, yaşı və peşəni bir yerdə yoxladın.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Bu kimdir?', text: 'Kim olduğunu soruşmaq və tanışlıq söhbətini anlamaq', tasks: ['u4x_c02', 'u4x_c15'] },
      { group: 'Ailə', text: 'Ailə sözlərini eşidib anlamaq və ailə üzvünü yazmaq', tasks: ['u4x_tree', 'u4x_c13', 'u4x_c14'] },
      { group: 'His / her', text: '“Onun” sözünü kişiyə və qadına görə seçmək', tasks: ['u4x_c04', 'u4x_c11a'] },
      { group: 'Your', text: 'Bəli/xeyr sualı qurmaq və qısa cavab vermək', tasks: ['u4x_c06', 'u4x_c07'] },
      { group: 'Var / yoxdur', text: 'Do sualına cavab vermək və qısa cavabları uyğunlaşdırmaq', tasks: ['u4x_c08', 'u4x_c09'] },
      { group: 'Yaş', text: 'Eşitdiyin yaşı yığmaq və yaşı soruşmaq', tasks: ['u4x_c05', 'u4x_c12', 'u4x_profile'] },
      { group: 'Peşə', text: 'Peşəni a və an ilə demək', tasks: ['u4x_c10', 'u4x_c11b'] },
    ],
    closing: 'Təbriklər! Bölmə 4-ün bacarıqlarını yoxladın.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [],
};
