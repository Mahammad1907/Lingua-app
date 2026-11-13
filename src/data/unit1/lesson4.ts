// Bölmə 1 · Dərs 4 — Necəsən? (How are you? I'm fine / OK, thanks. And you?). Recognition only: I'm not very well.
// Spiral: Hello + name, Nice to meet you.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const answerBack = goal(['feeling', 'askFeeling'], ["I'm fine, thanks. And you?", "I'm OK. And you?"]);
const askHow = goal(['askFeeling'], ['How are you?']);

export const lesson4: DesignLesson = {
  id: 'a1_en_b1_v2_d4', order: 4, title: 'Necəsən?', section: 'İlk tanışlıq',
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
        { icon: 'wave', text: 'Halımı deyib “And you?” ilə qaytarıram.' },
      ],
    },
    {
      type: 'match', id: 'd4_c02', number: 2, title: 'Kim nə dedi?', why: 'Keçən dərslərin ifadələrini xatırladın.',
      prompt: 'Keçən dərsləri xatırla.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'Hello!', az: 'Salam!', from: 'G' }, { en: "What's your name?", az: 'Adın nədir?', from: 'B' }, { en: 'Nice to meet you.', az: 'Tanış olmağıma şadam.', from: 'G' }],
      extra: ['Hələlik!'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Hello! — Salam!; What’s your name? — Adın nədir?; Nice to meet you. — Tanış olmağıma şadam.', 'Tanışlıq salamla başlayır, sonra ad soruşulur, sonra xoş söz deyilir.', 'Salam → ad → Nice to meet you.', 'Hi! What’s your name? … Nice to meet you!'))],
      review: {
        title: 'Kim nə dedi?', why: 'Keçən dərslərin ifadələrini xatırladın.', prompt: 'Keçən dərsləri xatırla.\nHər cümləyə mənasını qoş.',
        rows: [{ en: 'You too!', az: 'Mən də!', from: 'B' }, { en: "I'm …", az: 'Mən …-am.', from: 'G' }, { en: 'Goodbye!', az: 'Görüşənədək!', from: 'M' }],
        extra: ['Adın nədir?'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('You too! — Mən də!; I’m … — Mən …-am.; Goodbye! — Görüşənədək!', 'Hər ifadənin öz işi var: cavab, ad, sağollaşma.', 'Mənaya görə qoş.', 'Nice to meet you! — You too!'))],
      },
    },
    {
      type: 'word', id: 'd4_c03', number: 3,
      word: 'How are you?', pronunciation: '/haʊ ɑː juː/', az: 'Necəsən?',
      notes: ['Salamdan sonra soruşulur.', 'Bu sual cavab gözləyir.'],
      example: 'Hi! How are you?', exampleAz: 'Salam! Necəsən?',
    },
    {
      type: 'word', id: 'd4_c04', number: 4,
      word: "I'm fine, thanks. · And you?", pronunciation: '/aɪm faɪn θæŋks/ · /ænd juː/', az: 'Yaxşıyam, sağ ol. · Bəs sən?',
      notes: ['Yerinə “I’m OK.” də demək olar.', 'Pis olanda deyilir: I’m not very well. (Çox yaxşı deyiləm.)'],
      example: "I'm fine, thanks. And you?", exampleAz: 'Yaxşıyam, sağ ol. Bəs sən?',
    },
    {
      type: 'choice', id: 'd4_c05', number: 5, title: 'Dinlə və anla', why: '“not very well” — çox yaxşı deyil.',
      prompt: 'Qızın cavabını dinlə.\nO necədir?', audio: "I'm not very well.", options: ['Yaxşıdır.', 'Çox yaxşı deyil.', 'Adını deyir.'], answer: 'Çox yaxşı deyil.',
      hint: '“not” sözünə qulaq as.', hintAssists: true,
      variants: [
        pick('Yaxşıdır.', '“not” sözü mənanı tərsinə çevirir.', ex('Çox yaxşı deyil.', 'Səsdə “I’m not very well” deyilir. “not” — “deyil” deməkdir.', 'not very well = çox yaxşı deyil.', 'I’m fine. — Yaxşıyam. / I’m not very well. — Çox yaxşı deyiləm.')),
        pick('Adını deyir.', 'Ad deyilmir, hal deyilir.', ex('Çox yaxşı deyil.', '“I’m” sonra ad yox, “not very well” gəlir.', 'I’m + hal = necə olduğunu demək.', 'I’m OK.')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“fine” — yaxşı.', prompt: 'Oğlanın cavabını dinlə.\nO necədir?', audio: "I'm fine, thanks.",
        options: ['Çox yaxşı deyil.', 'Yaxşıdır.', 'Sağollaşır.'], answer: 'Yaxşıdır.', hint: '“not” sözü var, yoxsa yox?', hintAssists: true,
        variants: [other('Səsdə “fine” deyilir.', ex('Yaxşıdır.', '“I’m fine, thanks” — “Yaxşıyam, sağ ol”. Burada “not” yoxdur.', 'fine = yaxşı.', 'I’m fine, thanks.'))],
      },
    },
    {
      type: 'choice', id: 'd4_c06', number: 6, title: 'Sözü tamamla', why: '“I” ilə “am” gəlir.',
      prompt: 'Oğlan cavab verir.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'I', after: 'fine, thanks.' }, options: ['is', 'am', 'are'], answer: 'am',
      variants: [other('“I” ilə “am” gəlir.', ex('am', '“Mən yaxşıyam” — “-am” ingiliscə ayrıca “am” sözüdür.', 'I am fine = I’m fine.', "I'm fine, thanks."))],
      review: {
        title: 'Sözü tamamla', why: '“you” ilə “are” gəlir.', prompt: 'Qız soruşur.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'How', after: 'you?' }, options: ['am', 'is', 'are'], answer: 'are',
        variants: [other('“you” ilə “are” gəlir.', ex('are', '“you” (sən) ilə həmişə “are” işlənir.', 'How are you?', 'How are you?'))],
      },
    },
    {
      type: 'write', id: 'd4_c07', number: 7, title: 'Mesajı qur', why: 'Sual düzgün sırada qurulub.',
      prompt: 'Qonşunla qarşılaşdın.\nSözlərdən onun halını soruş.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Qonşu qız', from: 'G', lines: [{ from: 'G', text: 'Hi!' }] }, tiles: ['you', 'How', 'is', 'are', 'your', '?'], rule: exact('How are you?'),
      variants: [other('Sıra: How + are + you?', ex('How are you?', 'Sual sözü “How” əvvəldə, sonra “are”, sonra “you”.', 'How are you?', 'Hi! How are you?'))],
      review: {
        title: 'Mesajı qur', why: 'Sual düzgün sırada qurulub.', prompt: 'Dostun sənə yazdı.\nSözlərdən onun halını soruş.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Yoldaş', from: 'B', lines: [{ from: 'B', text: 'Hello!' }] }, tiles: ['are', 'am', 'How', 'you', 'I', '?'], rule: exact('How are you?'),
        variants: [other('Sıra: How + are + you?', ex('How are you?', 'Sən onun halını soruşursan: “you” lazımdır, “I” yox.', 'How are you?', 'How are you?'))],
      },
    },
    {
      type: 'voice', id: 'd4_c08', number: 8, title: 'Dinlə və təkrarla', why: 'Cavab axıcı səsləndi.',
      prompt: 'Cavabı dinlə, sonra eyni cür de.', audio: "I'm fine, thanks.", repeat: { stress: 'fine', note: '“thanks” sözündə dil dişlərin arasındadır: /θ/.' },
      rule: exact("I'm fine thanks"),
      variants: [other('Bir daha dinlə və yavaş de.', ex("I'm fine, thanks.", '“thanks” “tenks” kimi yox, dil dişlərin arasında deyilir.', 'th = /θ/.', "I'm FINE, thanks."))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Sual axıcı səsləndi.', prompt: 'Sualı dinlə, sonra eyni cür de.', audio: 'How are you?', repeat: { stress: 'are', note: 'Üç söz bir nəfəsdə deyilir.' },
        rule: exact('How are you'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('How are you?', 'Sözləri ayırmadan, bir nəfəsdə de.', 'How ARE you?', 'How are you?'))],
      },
    },
    {
      type: 'write', id: 'd4_c09', number: 9, title: 'Dialoqu tamamla', why: 'Halını dedin və sualı qaytardın.',
      prompt: 'Qonşun halını soruşur.\nCavab ver və sualı geri qaytar.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Qonşu qız', from: 'G', lines: [{ from: 'G', text: 'Hello! How are you?' }] }, rule: answerBack,
      hint: 'İki hissə: halın + “And you?”', hintAssists: false,
      variants: [
        insteadOf('askFeeling', 'Halını da de.', ex("I'm fine, thanks. And you?", 'Sualı qaytarmısan, amma öz halını deməmisən.', 'Halın + And you?', "I'm OK. And you?")),
        other('Halını de və “And you?” soruş.', ex("I'm fine, thanks. And you?", 'Qonşun soruşdu. Sən cavab verirsən və eyni sualı ona qaytarırsan.', 'Halın + And you?', "I'm OK. And you?")),
      ],
      review: {
        title: 'Dialoqu tamamla', why: 'Halını dedin və sualı qaytardın.', prompt: 'Kursda yoldaşın halını soruşur.\nCavab ver və sualı geri qaytar.', placeholder: 'Cavabını yaz',
        chat: { partner: 'Kurs yoldaşı', from: 'B', lines: [{ from: 'B', text: 'Hi! How are you?' }] }, rule: answerBack, hint: 'İki hissə: halın + “And you?”', hintAssists: false,
        variants: [other('Halını de və “And you?” soruş.', ex("I'm OK. And you?", 'Cavab verirsən və eyni sualı qaytarırsan.', 'Halın + And you?', "I'm fine, thanks. And you?"))],
      },
    },
    {
      type: 'voice', id: 'd4_c10', number: 10, speaker: 'mascot', title: 'Səslə cavab ver', why: 'Halını dedin və sualı qaytardın.',
      prompt: '{M} soruşur.\nCavab ver və sualı geri qaytar.', audio: 'How are you?', sample: "I'm fine, thanks. And you?", rule: answerBack,
      variants: [other('Halını de və “And you?” soruş.', ex("I'm fine, thanks. And you?", '{M} halını soruşdu.', 'Halın + And you?', "I'm OK. And you?"))],
      review: {
        speaker: 'mascot', title: 'Səslə cavab ver', why: 'Halını dedin və sualı qaytardın.', prompt: 'Axşam {M} yenə soruşur.\nCavab ver və sualı geri qaytar.', audio: 'How are you?', sample: "I'm OK. And you?", rule: answerBack,
        variants: [other('Halını de və “And you?” soruş.', ex("I'm OK. And you?", '{M} halını soruşdu.', 'Halın + And you?', "I'm fine, thanks. And you?"))],
      },
    },
    {
      type: 'voice', id: 'd4_c11', number: 11, speaker: 'mascot', title: 'Söhbəti sən başlat', why: 'Salam verib halını soruşdun.',
      prompt: '{M} ilə qarşılaşırsan.\nSalam ver və halını soruş.', rule: goal(['greet', 'askFeeling'], ['Hi! How are you?', 'Hello! How are you?']), reply: "I'm fine, thanks!",
      variants: [
        insteadOf('feeling', 'Öz halını demək yox — onun halını soruş.', ex('Hi! How are you?', 'Burada sən soruşursan.', 'Salam + How are you?', 'Hello! How are you?')),
        other('Salam və sual ikisi də lazımdır.', ex('Hi! How are you?', 'Görüş salamla başlayır, sonra hal soruşulur.', 'Salam + How are you?', 'Hello! How are you?')),
      ],
      review: {
        speaker: 'mascot', title: 'Söhbəti sən başlat', why: 'Salam verib halını soruşdun.', prompt: 'Səhər {M} ilə rastlaşırsan.\nSalam ver və halını soruş.', rule: goal(['greet', 'askFeeling'], ['Hello! How are you?', 'Hi! How are you?']), reply: "I'm OK, thanks!",
        variants: [other('Salam və sual ikisi də lazımdır.', ex('Hello! How are you?', 'Görüş salamla başlayır, sonra hal soruşulur.', 'Salam + How are you?', 'Hi! How are you?'))],
      },
    },
    {
      type: 'voice', id: 'd4_c12', number: 12, speaker: 'mascot', title: 'Tanışlıq və hal', why: 'Tanışlığa cavab verib halını dedin.',
      prompt: '{M} deyir: “Nice to meet you! How are you?”\nİkisinə də cavab ver.', audio: 'Nice to meet you! How are you?',
      rule: goal(['meet', 'feeling'], ["You too! I'm fine, thanks.", "Nice to meet you too! I'm OK."]),
      variants: [other('İki cavab: “You too!” və halın.', ex("You too! I'm fine, thanks.", 'İki şey deyildi: xoş söz və sual. Hər ikisinə cavab verirsən.', 'You too! + halın.', "Nice to meet you too! I'm OK."))],
      review: {
        speaker: 'mascot', title: 'Tanışlıq və hal', why: 'Tanışlığa cavab verib halını dedin.', prompt: 'Yeni yoldaşın deyir: “Nice to meet you! How are you?”\nİkisinə də cavab ver.', audio: 'Nice to meet you! How are you?',
        rule: goal(['meet', 'feeling'], ["You too! I'm OK.", "Nice to meet you too! I'm fine."]),
        variants: [other('İki cavab: “You too!” və halın.', ex("You too! I'm OK.", 'Xoş sözə və suala ayrıca cavab verilir.', 'You too! + halın.', "You too! I'm fine, thanks."))],
      },
    },
  ],
  result: {
    done: ['Dərs 4 tamamlandı', 'Artıq hal soruşub cavab verə bilirsən.'],
    incomplete: 'Dərs tam bitmədi. Yoxlanmayan tapşırıqlara sonra qayıda bilərsən.',
    goals: [
      { group: 'Tanıma', text: 'Halı dinləyib anlamaq', tasks: ['d4_c02', 'd4_c05', 'd4_c06'] },
      { group: 'Yazı', text: 'Hal soruşmaq və cavab vermək', tasks: ['d4_c07', 'd4_c09'] },
      { group: 'Danışıq', text: 'Halını demək və soruşmaq', tasks: ['d4_c10', 'd4_c11', 'd4_c12'] },
    ],
    closing: 'Növbəti dərsdə təşəkkür etməyi öyrənəcəksən.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [
    { word: 'How are you?', translation: 'Necəsən?', example: 'Hi! How are you?', exampleAz: 'Salam! Necəsən?', usageNote: 'Salamdan sonra soruşulur.', pronunciation: '/haʊ ɑː juː/', teachCard: 'd4_c03' },
    { word: "I'm fine", translation: 'Yaxşıyam', example: "I'm fine, thanks.", exampleAz: 'Yaxşıyam, sağ ol.', usageNote: '“I’m OK” da olar.', pronunciation: '/aɪm faɪn/', teachCard: 'd4_c04' },
    { word: 'And you?', translation: 'Bəs sən?', example: "I'm OK. And you?", exampleAz: 'Normalam. Bəs sən?', usageNote: 'Sualı geri qaytarır.', pronunciation: '/ænd juː/', teachCard: 'd4_c04' },
    { word: "I'm not very well", translation: 'Çox yaxşı deyiləm', example: "I'm not very well.", exampleAz: 'Çox yaxşı deyiləm.', usageNote: 'Bu dərsdə yalnız tanımaq üçündür.', pronunciation: '/aɪm nɒt ˈveri wel/', teachCard: 'd4_c04' },
  ],
};
