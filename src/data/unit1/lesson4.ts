// Bölmə 1 · Dərs 4 — Necəsən? (How are you? I'm fine / OK, thanks. And you?). Recognition only: I'm not great.
// Spiral: Hello + name, Nice to meet you.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const answerBack = goal(['feeling', 'askFeeling'], ["I'm fine, thanks. And you?", "I'm OK. And you?"]);
const askHow = goal(['askFeeling'], ['How are you?']);

export const lesson4: DesignLesson = {
  id: 'a1_en_b1_v2_d4', order: 7, unit: 1, number: 4, part: 1, title: 'Necəsən?', section: 'İlk tanışlıq',
  notices: {
    soundFailed: 'Səs açılmadı. Yenidən dinlə və ya mətnlə davam et.',
    unknown: 'Cavabı yoxlaya bilmədim. Bir az fərqli yaz və ya yenidən cəhd et.',
    voiceUnknown: 'Səsini aydın eşitmədim. Yenidən de.',
    micFailed: 'Mikrofon açılmadı. Keçə bilərsən.',
    review: 'Səhv etdiyin tapşırıqlara yeni vəziyyətdə qayıdırıq.',
  },
  cards: [
    {
      type: 'intro', id: 'd4_c01', badge: 'İlk tanışlıq', subtitle: 'Salamdan sonra hal soruşulur.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Necə olduğunu soruşa bilirəm.' },
        { icon: 'wave', text: 'Halımı deyib sualı “And you?” ilə qaytarıram.' },
      ],
    },
    {
      type: 'match', id: 'd4_c02', number: 2, title: 'Kim nə dedi?', why: 'Keçən dərslərin ifadələrini xatırladın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
      prompt: 'Keçən dərsləri xatırla.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'Hello!', az: 'Salam!', from: 'G' }, { en: "What's your name?", az: 'Adın nədir?', from: 'B' }, { en: 'Nice to meet you.', az: 'Tanış olduğuma şadam.', from: 'G' }],
      extra: ['Hələlik!'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Hello! — Salam!; What’s your name? — Adın nədir?; Nice to meet you. — Tanış olduğuma şadam.', 'Tanışlıq salamla başlayır, sonra ad soruşulur, sonra xoş söz deyilir.', 'What’s your name? — ad sualı; Nice to meet you. — xoş söz.', 'Hi! What’s your name? I’m [ad]. Nice to meet you!'))],
      review: {
        title: 'Kim nə dedi?', why: 'Keçən dərslərin ifadələrini xatırladın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.', prompt: 'Keçən dərsləri xatırla.\nHər cümləyə mənasını qoş.',
        rows: [{ en: 'You too!', az: 'Mən də!', from: 'B' }, { en: "I'm [ad]", az: 'Mən [ad]-am.', from: 'G' }, { en: 'Goodbye!', az: 'Görüşənədək!', from: 'M' }],
        extra: ['Adın nədir?'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('You too! — Mən də!; I’m [ad] — Mən [ad]-am.; Goodbye! — Görüşənədək!', 'Hər ifadənin öz işi var: cavab, ad, sağollaşma.', 'You too! — xoş sözə cavab; Goodbye! — sağollaşma.', 'Nice to meet you! — You too!'))],
      },
    },
    {
      type: 'word', id: 'd4_c03', number: 3, scenes: ['d4/word-how-are-you'],
      word: 'How are you?', pronunciation: '/haʊ ɑr ju/', reading: 'hau ar yu?', az: 'Necəsən?',
      notes: ['Salamdan sonra soruşulur.'],
      example: 'Hi! How are you?', exampleAz: 'Salam! Necəsən?',
    },
    {
      type: 'word', id: 'd4_c04', number: 4, scenes: ['d4/word-im-fine'],
      word: "I'm fine, thanks. And you?", pronunciation: '/aɪm faɪn θæŋks ænd ju/', reading: 'aym fayn, **th**ənks. ənd yu?', az: 'Yaxşıyam, sağ ol. Bəs sən?',
      notes: ['th — dilin ucu dişlərin arasında.'],
      example: "How are you? — I'm fine, thanks. And you?", exampleAz: 'Necəsən? — Yaxşıyam, sağ ol. Bəs sən?',
    },
    {
      type: 'choice', id: 'd4_c06', number: 6, title: 'Sözü tamamla', why: '“I” ilə “am” gəlir.', hint: '“I’m” iki sözün qısa formasıdır — ikinci söz hansıdır?',
      prompt: 'Oğlan cavab verir.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'I', after: 'fine, thanks.' }, options: ['is', 'am', 'are'], answer: 'am',
      variants: [other('“I” ilə “am” gəlir.', ex('am', '“Mən yaxşıyam” — “-am” ingiliscə ayrıca “am” sözüdür.', 'I ilə is demirik: I am fine → I’m fine.', "I'm fine, thanks."))],
      review: {
        title: 'Sözü tamamla', why: '“you” ilə “are” gəlir.', hint: 'Bu dərsdə öyrəndiyin “Necəsən?” sualını tam xatırla.', prompt: 'Qız soruşur.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'How', after: 'you?' }, options: ['am', 'is', 'are'], answer: 'are',
        variants: [other('“you” ilə “are” gəlir.', ex('are', 'How is you? demirik, you ilə are gəlir.', 'How are you?', 'Hi! How are you?'))],
      },
    },
    {
      type: 'voice', id: 'd4_c08', number: 8, title: 'Dinlə və təkrarla', why: 'Cavab axıcı səsləndi.',
      prompt: 'Cavabı dinlə, sonra eyni cür de.', audio: "I'm fine, thanks. And you?", repeat: { stress: 'fine', note: '“thanks” sözündə dilin ucu dişlərin arasındadır; “And you?” sualı səsi qaldırır.', reading: 'aym fayn, **th**ənks. ənd yu?' },
      rule: exact("I'm fine thanks And you"),
      variants: [other('Bir daha dinlə və yavaş de.', ex("I'm fine, thanks. And you?", '“thanks” “tenks” kimi yox, dil dişlərin arasında deyilir.', 'th — dilin ucu dişlərin arasında: “tenks” yox, thanks.', "I'm fine, thanks. And you?"))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Sual axıcı səsləndi.', prompt: 'Sualı dinlə, sonra eyni cür de.', audio: 'How are you?', repeat: { stress: 'are', note: 'Üç söz bir nəfəsdə deyilir.', reading: 'hau ar yu?' },
        rule: exact('How are you'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('How are you?', 'Sözləri ayırmadan, bir nəfəsdə de.', 'How ARE you?', 'How are you?'))],
      },
    },
    // ── New tasks (26 Nov 2026, lesson split): part 1 practises How are you? and I'm fine, thanks. ──
    {
      type: 'write', id: 'd4_c13', number: 13, title: 'Eşitdiyini yaz', why: 'Səsdə How are you? deyildi.', hint: 'Yavaş dinlə və üç sözü ayrıca yaz.',
      prompt: 'Eşitdiyin sualı yaz.', audio: 'How are you?', placeholder: 'Eşitdiyini yaz', rule: exact('How are you?'),
      variants: [
        { match: { words: ['what', 'name'] }, short: 'Səsdə ad sualı yox, hal sualı var.', explain: ex('How are you?', 'Səsdə “What’s your name?” yox, “How are you?” deyilir.', 'How are you? — hal sualı; What’s your name? — ad sualı.', 'Hi! How are you?') },
        other('Bir daha dinlə və sözləri ayrıca yaz.', ex('How are you?', 'Səsdə üç söz var: How, are, you.', 'How are you? — hal sualı; What’s your name? — ad sualı.', 'Hello! How are you?')),
      ],
      review: {
        title: 'Eşitdiyini yaz', why: 'Səsdə I’m fine, thanks deyildi.', hint: 'Yavaş dinlə və eşitdiyini olduğu kimi yaz.', prompt: 'Eşitdiyin cavabı yaz.', audio: "I'm fine, thanks.", placeholder: 'Eşitdiyini yaz', rule: exact("I'm fine, thanks."),
        variants: [other('Bir daha dinlə və yavaş yaz.', ex("I'm fine, thanks.", 'Səsdə halını deyir və təşəkkür edir.', 'I’m fine — yaxşıyam; thanks — sağ ol.', "How are you? — I'm fine, thanks."))],
      },
    },
    {
      type: 'voice', id: 'd4_c14', number: 14, title: 'Halını de', why: 'Hal sualına cavab verdin.', hint: 'Yaxşı olduğunu de və təşəkkür et.',
      prompt: 'Qonşun soruşur: “How are you?”\nHalını de.', audio: 'How are you?', rule: goal(['feeling'], ["I'm fine, thanks."]),
      variants: [
        insteadOf('askFeeling', 'Sual verildi — əvvəl öz halını de.', ex("I'm fine, thanks.", 'Qonşun səndən soruşdu, sən halını deyirsən.', 'How are you? → I’m fine, thanks.', "I'm fine, thanks.")),
        other('Halını de.', ex("I'm fine, thanks.", '“How are you?” sualına cavab halındır.', 'How are you? → I’m fine, thanks.', "Hi! — I'm fine, thanks.")),
      ],
      review: {
        title: 'Halını de', why: 'Hal sualına cavab verdin.', hint: 'Yaxşı olduğunu de və təşəkkür et.', prompt: 'Kursda müəllim soruşur: “How are you?”\nHalını de.', audio: 'How are you?', rule: goal(['feeling'], ["I'm fine, thanks."]),
        variants: [other('Halını de.', ex("I'm fine, thanks.", 'Müəllim halını soruşdu — cavab halındır.', 'How are you? → I’m fine, thanks.', "I'm fine, thanks. And you?"))],
      },
    },
  ],
  result: {
    done: ['Dərs 4 · 1-ci hissə tamamlandı', 'Artıq hal soruşub “I’m fine, thanks” ilə cavab verə bilirsən.'],
    incomplete: 'Dərs tam bitmədi. Yoxlanmayan tapşırıqlara sonra qayıda bilərsən.',
    goals: [
      { group: 'Tanıma', text: 'Hal sualını və cavabını tanımaq', tasks: ['d4_c02', 'd4_c06'] },
      { group: 'Yazı', text: 'Eşidilən hal sualını yazmaq', tasks: ['d4_c13'] },
      { group: 'Danışıq', text: 'Halını səslə demək', tasks: ['d4_c14'] },
    ],
    closing: 'Növbəti hissədə “I’m OK” və “I’m not great” cavablarını öyrənəcəksən.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [
    { word: 'How are you?', translation: 'Necəsən?', example: 'Hi! How are you?', exampleAz: 'Salam! Necəsən?', usageNote: 'Salamdan sonra soruşulur.', pronunciation: '/haʊ ɑr ju/', teachCard: 'd4_c03' },
    { word: "I'm fine", translation: 'Yaxşıyam', example: "I'm fine, thanks.", exampleAz: 'Yaxşıyam, sağ ol.', usageNote: '“I’m OK” da olar.', pronunciation: '/aɪm faɪn/', teachCard: 'd4_c04' },
    { word: 'And you?', translation: 'Bəs sən?', example: "I'm OK. And you?", exampleAz: 'Normalam. Bəs sən?', usageNote: 'Sualı geri qaytarır.', pronunciation: '/ænd ju/', teachCard: 'd4_c04' },
  ],
};

// Bölmə 1 · Dərs 4 · 2-ci hissə — I'm OK. / I'm not great. (26 Nov 2026: lessons over 12 screens are split into parts; nothing was removed).
export const lesson4b: DesignLesson = {
  id: 'a1_en_b1_v2_d4_2', order: 8, unit: 1, number: 4, part: 2, title: 'Necəsən?', section: 'İlk tanışlıq',
  notices: lesson4.notices,
  cards: [
    {
      type: 'intro', id: 'd4_c01b', badge: 'İlk tanışlıq', subtitle: 'Hər gün “yaxşıyam” olmur — başqa cavablar da var.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: '“I’m OK” və “I’m not great” cavablarını tanıyıram.' },
        { icon: 'wave', text: 'Halımı deyib sualı “And you?” ilə qaytarıram.' },
      ],
    },
    {
      type: 'word', id: 'd4_c04c', number: 6, scenes: ['d4/word-not-well'],
      word: "I'm not great.", pronunciation: '/aɪm nɑt ɡreɪt/', reading: 'aym nat greyt', az: 'Çox yaxşı deyiləm.',
      notes: ['not am-dan sonra gəlir: I am not → I’m not.'],
      example: "How are you? — I'm not great.", exampleAz: 'Necəsən? — Çox yaxşı deyiləm.',
    },
    {
      type: 'choice', id: 'd4_c05', number: 5, title: 'Dinlə və anla', why: 'I’m not great — Çox yaxşı deyiləm.',
      prompt: 'Qızın cavabını dinlə.\nO necədir?', audio: "I'm not great.", options: ['Yaxşıdır.', 'Çox yaxşı deyil.', 'Adını deyir.'], answer: 'Çox yaxşı deyil.',
      hint: 'Səsdə “not” sözü varmı, ona qulaq as.', hintAssists: true,
      variants: [
        pick('Yaxşıdır.', 'Səsdə “fine” yox, “not great” deyilir.', ex('Çox yaxşı deyil.', 'Səsdə I’m not great deyilir.', 'I’m fine — Yaxşıyam; I’m not great — Çox yaxşı deyiləm.', 'I’m fine. — Yaxşıyam. / I’m not great. — Çox yaxşı deyiləm.')),
        pick('Adını deyir.', 'Ad deyilmir, hal deyilir.', ex('Çox yaxşı deyil.', '“I’m”-dən sonra ad yox, “not great” gəlir.', 'I’m + hal = necə olduğunu demək.', 'I’m fine, thanks.')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“fine” — yaxşı.', prompt: 'Oğlanın cavabını dinlə.\nO necədir?', audio: "I'm fine, thanks.",
        options: ['Çox yaxşı deyil.', 'Yaxşıdır.', 'Sağollaşır.'], answer: 'Yaxşıdır.', hint: 'Səsdə “not” sözü varmı, ona qulaq as.', hintAssists: true,
        variants: [other('Səsdə “fine” deyilir.', ex('Yaxşıdır.', '“I’m fine, thanks” — “Yaxşıyam, sağ ol” deməkdir, burada “not” yoxdur.', 'I’m fine — Yaxşıyam; I’m not great — Çox yaxşı deyiləm.', 'I’m fine, thanks.'))],
      },
    },
    {
      type: 'word', id: 'd4_c04b', number: 5, scenes: ['d4/word-im-ok'],
      word: "I'm OK.", pronunciation: '/aɪm oʊˈkeɪ/', reading: 'aym oukey', az: 'Normalam.',
      notes: ["“I'm fine” ilə yaxındır."],
      example: "How are you? — I'm OK.", exampleAz: 'Necəsən? — Normalam.',
    },
    {
      type: 'voice', id: 'd4_c10', number: 10, speaker: 'mascot', title: 'Səslə cavab ver', why: 'Halını dedin və sualı qaytardın.', hint: 'İki hissə: öz halını de, sonra eyni sualı ona qaytar.',
      prompt: '{M} soruşur.\nCavab ver və sualı geri qaytar.', audio: 'How are you?', sample: "I'm fine, thanks. And you?", rule: answerBack,
      variants: [other('Halını de və “And you?” soruş.', ex("I'm fine, thanks. And you?", '{M} halını soruşdu — halını deyib eyni sualı ona qaytarırsan.', 'Halın + And you?', "I'm OK. And you?"))],
      review: {
        speaker: 'mascot', title: 'Səslə cavab ver', why: 'Halını dedin və sualı qaytardın.', hint: 'İki hissə: öz halını de, sonra eyni sualı ona qaytar.', prompt: 'Axşam {m} yenə soruşur.\nCavab ver və sualı geri qaytar.', audio: 'How are you?', sample: "I'm OK. And you?", rule: answerBack,
        variants: [other('Halını de və “And you?” soruş.', ex("I'm OK. And you?", '{M} halını soruşdu — halını deyib eyni sualı ona qaytarırsan.', 'Halın + And you?', "I'm fine, thanks. And you?"))],
      },
    },
    {
      // “Söhbəti tamamla” (20 Nov 2026, user): the turns are ready, only one word is missing.
      type: 'choice', id: 'd4_c07', number: 7, title: 'Söhbəti tamamla', why: 'Qız necə olduğunu dedi və sağollaşdı.', hint: 'Oğlan “And you?” soruşdu — qız öz halını deyir.',
      prompt: 'Qız və oğlan küçədə rastlaşır.\nSöhbətdə bir söz əskikdir. Düzgün sözü seç.',
      dialog: [{ from: 'G', text: 'Hi! How are you?' }, { from: 'B', text: "I'm fine, thanks. And you?" }],
      gap: { speaker: 'G', before: "I'm", after: '. Bye!' }, options: ['OK', 'you', 'name'], answer: 'OK',
      variants: [
        pick('you', '“And you?” sualına öz halını deyirsən.', ex('OK', 'Oğlan “Bəs sən?” soruşdu, qız necə olduğunu deyir.', "I'm OK. — normalam; I'm you — olmur.", "I'm OK. Bye!")),
        pick('name', 'Burada ad yox, hal soruşulur.', ex('OK', '“How are you?” halı soruşur, adı yox.', "I'm OK. — hal; My name is [ad] — ad.", "I'm OK. Bye!")),
      ],
      review: {
        title: 'Söhbəti tamamla', why: 'Oğlan necə olduğunu dedi.', hint: 'Qız “And you?” soruşdu — oğlan öz halını deyir.', prompt: 'Oğlan və qız dərsdən sonra görüşür.\nSöhbətdə bir söz əskikdir. Düzgün sözü seç.',
        dialog: [{ from: 'B', text: 'Hello! How are you?' }, { from: 'G', text: "I'm not great. And you?" }],
        gap: { speaker: 'B', before: "I'm", after: ', thanks.' }, options: ['fine', 'you', 'name'], answer: 'fine',
        variants: [
          pick('you', '“And you?” sualına öz halını deyirsən.', ex('fine', 'Qız “Bəs sən?” soruşdu, oğlan necə olduğunu deyir.', "I'm fine. — yaxşıyam; I'm you — olmur.", "I'm fine, thanks.")),
          pick('name', 'Burada ad yox, hal soruşulur.', ex('fine', '“How are you?” halı soruşur, adı yox.', "I'm fine. — hal; My name is [ad] — ad.", "I'm fine, thanks.")),
        ],
      },
    },
    {
      type: 'voice', id: 'd4_c11', number: 11, speaker: 'mascot', title: 'Söhbəti sən başlat', why: 'Salam verib onun halını soruşdun.', hint: 'Əvvəl salam ver, sonra onun halını soruş.',
      prompt: '{M:acc} görürsən.\nSalam ver və onun halını soruş.', rule: goal(['greet', 'askFeeling'], ['Hi! How are you?', 'Hello! How are you?']), reply: "I'm fine, thanks!",
      variants: [
        insteadOf('feeling', 'Öz halını demək yox — onun halını soruş.', ex('Hi! How are you?', 'Burada sən soruşursan.', 'Salam + How are you?', 'Hello! How are you?')),
        other('Salam və sual ikisi də lazımdır.', ex('Hi! How are you?', 'Görüş salamla başlayır, sonra hal soruşulur.', 'Salam + How are you?', 'Hello! How are you?')),
      ],
      review: {
        speaker: 'mascot', title: 'Söhbəti sən başlat', why: 'Salam verib onun halını soruşdun.', hint: 'Əvvəl salam ver, sonra onun halını soruş.', prompt: 'Səhər {m:acc} görürsən.\nSalam ver və onun halını soruş.', rule: goal(['greet', 'askFeeling'], ['Hello! How are you?', 'Hi! How are you?']), reply: "I'm OK, thanks!",
        variants: [other('Salam və sual ikisi də lazımdır.', ex('Hello! How are you?', 'Görüş salamla başlayır, sonra hal soruşulur.', 'Salam + How are you?', 'Hi! How are you?'))],
      },
    },
    {
      type: 'write', id: 'd4_c09', number: 9, title: 'Dinlə və yaz', why: 'Halını dedin və sualı qaytardın.',
      prompt: 'Dinlə, mesajla cavab ver və sualı geri qaytar.', audio: 'Hello! How are you?', placeholder: 'Cavabını yaz', rule: answerBack,
      hint: 'İki hissə: öz halını de, sonra eyni sualı ona qaytar.', hintAssists: false,
      variants: [
        insteadOf('askFeeling', 'Halını da de.', ex("I'm fine, thanks. And you?", 'Sualı qaytarmısan, amma öz halını deməmisən.', 'Halın + And you?', "I'm OK. And you?")),
        other('Halını de və “And you?” soruş.', ex("I'm fine, thanks. And you?", 'Qonşun soruşdu, sən cavab verib eyni sualı ona qaytarırsan.', 'Halın + And you?', "I'm OK. And you?")),
      ],
      review: {
        title: 'Dinlə və yaz', why: 'Halını dedin və sualı qaytardın.', prompt: 'Dinlə, mesajla cavab ver və sualı geri qaytar.', audio: 'Hi! How are you?', placeholder: 'Cavabını yaz', rule: answerBack, hint: 'İki hissə: öz halını de, sonra eyni sualı ona qaytar.', hintAssists: false,
        variants: [other('Halını de və “And you?” soruş.', ex("I'm OK. And you?", 'Cavab verirsən və eyni sualı qaytarırsan.', 'Halın + And you?', "I'm fine, thanks. And you?"))],
      },
    },
    {
      type: 'voice', id: 'd4_c12', number: 12, title: 'Tanışlıq və hal', why: 'Tanışlığa cavab verib halını dedin.', hint: 'Xoş sözə və suala ayrıca cavab ver.',
      prompt: 'Yeni tanışın deyir: “Nice to meet you! How are you?”\nİkisinə də cavab ver.', audio: 'Nice to meet you! How are you?',
      rule: goal(['meet', 'feeling'], ["You too! I'm fine, thanks.", "Nice to meet you too! I'm OK."]),
      variants: [other('İki cavab: “You too!” və halın.', ex("You too! I'm fine, thanks.", 'Xoş söz və sual deyildi, hər ikisinə cavab lazımdır.', 'You too! + halın.', "Nice to meet you too! I'm OK."))],
      review: {
        title: 'Tanışlıq və hal', why: 'Tanışlığa cavab verib halını dedin.', hint: 'Xoş sözə və suala ayrıca cavab ver.', prompt: 'Yeni yoldaşın deyir: “Nice to meet you! How are you?”\nİkisinə də cavab ver.', audio: 'Nice to meet you! How are you?',
        rule: goal(['meet', 'feeling'], ["You too! I'm OK.", "Nice to meet you too! I'm fine."]),
        variants: [other('İki cavab: “You too!” və halın.', ex("You too! I'm OK.", 'Xoş sözə və suala ayrıca cavab verilir.', 'You too! + halın.', "You too! I'm fine, thanks."))],
      },
    },
    {
      // New (26 Nov 2026, lesson split): three answers to How are you?
      type: 'match', id: 'd4_c15', number: 15, title: 'Kim nə dedi?', why: 'Üç cavabın mənasını ayırdın.', hint: 'Əvvəl “not” sözü olan cavabı yerinə qoy.',
      prompt: 'Üç nəfər “How are you?” sualına cavab verir.\nHər cümləyə mənasını qoş.',
      rows: [{ en: "I'm fine.", az: 'Yaxşıyam.', from: 'G' }, { en: "I'm OK.", az: 'Normalam.', from: 'B' }, { en: "I'm not great.", az: 'Çox yaxşı deyiləm.', from: 'M' }],
      extra: ['Necəsən?'],
      variants: [other('Bir cavabın mənası yerində deyil.', ex("I'm fine. — Yaxşıyam.; I'm OK. — Normalam.; I'm not great. — Çox yaxşı deyiləm.", 'Üç cavab üç fərqli haldır: yaxşı, normal, çox yaxşı deyil.', 'I’m fine — Yaxşıyam; I’m not great — Çox yaxşı deyiləm.', "How are you? — I'm OK."))],
      review: {
        title: 'Kim nə dedi?', why: 'Sualı və cavabları ayırdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.', prompt: 'Küçədə qısa söhbət.\nHər cümləyə mənasını qoş.',
        rows: [{ en: 'How are you?', az: 'Necəsən?', from: 'B' }, { en: "I'm not great.", az: 'Çox yaxşı deyiləm.', from: 'G' }, { en: 'And you?', az: 'Bəs sən?', from: 'G' }],
        extra: ['Normalam.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("How are you? — Necəsən?; I'm not great. — Çox yaxşı deyiləm.; And you? — Bəs sən?", 'Sual, cavab və sualı qaytarmaq — üç ayrı iş.', 'How are you? — hal sualı; And you? — sualı qaytarmaq.', "I'm not great. And you?"))],
      },
    },
  ],
  result: {
    done: ['Dərs 4 · 2-ci hissə tamamlandı', 'Artıq hal soruşub cavab verə bilirsən.'],
    incomplete: 'Dərs tam bitmədi. Yoxlanmayan tapşırıqlara sonra qayıda bilərsən.',
    goals: [
      { group: 'Tanıma', text: 'Halı dinləyib anlamaq', tasks: ['d4_c07', 'd4_c05', 'd4_c15'] },
      { group: 'Yazı', text: 'Hal soruşmaq və cavab vermək', tasks: ['d4_c09'] },
      { group: 'Danışıq', text: 'Halını demək və soruşmaq', tasks: ['d4_c10', 'd4_c11', 'd4_c12'] },
    ],
    closing: 'Növbəti dərsdə təşəkkür etməyi öyrənəcəksən.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [
    { word: "I'm not great", translation: 'Çox yaxşı deyiləm', example: "I'm not great.", exampleAz: 'Çox yaxşı deyiləm.', usageNote: 'Pis olanda deyilir.', pronunciation: '/aɪm nɑt ɡreɪt/', teachCard: 'd4_c04c' },
    { word: "I'm OK", translation: 'Normalam', example: "How are you? — I'm OK.", exampleAz: 'Necəsən? — Normalam.', usageNote: '“I’m fine” ilə yaxındır.', pronunciation: '/aɪm oʊˈkeɪ/', teachCard: 'd4_c04b' },
  ],
};
