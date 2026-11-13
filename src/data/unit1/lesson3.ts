// Bölmə 1 · Dərs 3 — Adını soruş (What's your name? Nice to meet you. You too.). Spiral: I'm…, Bye.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const intro = goal(['introduce'], ["I'm …", 'My name is …']);
const askName = goal(['askName'], ["What's your name?"]);
const meet = goal(['meet'], ['You too!', 'Nice to meet you too!']);
const bye = goal(['farewell'], ['Bye!', 'Goodbye!']);

export const lesson3: DesignLesson = {
  id: 'a1_en_b1_v2_d3', order: 3, title: 'Adını soruş', section: 'İlk tanışlıq',
  notices: {
    soundFailed: 'Səs açılmadı. Yenidən dinlə və ya mətnlə davam et.',
    unknown: 'Cavabı yoxlaya bilmədim. Bir az fərqli yaz və ya yenidən cəhd et.',
    voiceUnknown: 'Səsini aydın eşitmədim. Yenidən de.',
    micFailed: 'Mikrofon açılmadı. Keçə bilərsən.',
    review: 'Səhv etdiyin tapşırıqlara yeni vəziyyətdə qayıdırıq.',
  },
  cards: [
    {
      type: 'intro', id: 'd3_c01', badge: 'İlk tanışlıq', subtitle: 'İndi başqasının adını öyrənirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Başqasının adını soruşa bilirəm.' },
        { icon: 'wave', text: 'Tanışlığa “Nice to meet you” ilə cavab verirəm.' },
      ],
    },
    {
      type: 'choice', id: 'd3_c02', number: 2, title: 'Oxu və anla', why: 'I’m … ilə adını deyir.', hint: 'Qız sual verir, yoxsa özü haqqında nəsə deyir? Dərs 2-ni xatırla.',
      prompt: 'Qız yazır: “Hi! I’m …”\nO nə edir?', options: ['Adını soruşur.', 'Adını deyir.', 'Sağollaşır.'], answer: 'Adını deyir.',
      variants: [
        pick('Adını soruşur.', 'Sual yoxdur — o, adını deyir.', ex('Adını deyir.', '“I’m …” — “Mən …-am” deməkdir. Bu, sual deyil.', 'I’m + ad = adını demək.', 'Hi! I’m …')),
        pick('Sağollaşır.', 'Hi salamdır, sağollaşma deyil.', ex('Adını deyir.', 'Hi görüşü başladır. Sonra “I’m …” ilə adını deyir.', 'I’m + ad = adını demək.', 'Hello! My name is …')),
      ],
      review: {
        title: 'Oxu və anla', why: 'My name is … ilə adını deyir.', hint: 'Oğlan sual verir, yoxsa özü haqqında nəsə deyir? Dərs 2-ni xatırla.', prompt: 'Oğlan yazır: “Hello! My name is …”\nO nə edir?',
        options: ['Sağollaşır.', 'Adını soruşur.', 'Adını deyir.'], answer: 'Adını deyir.',
        variants: [other('O, adını deyir.', ex('Adını deyir.', '“My name is …” — “Mənim adım …” deməkdir.', 'My name is + ad = adını demək.', 'Hi! I’m …'))],
      },
    },
    {
      type: 'word', id: 'd3_c03', number: 3,
      word: "What's your name?", pronunciation: '/wʌts jʊr neɪm/', reading: 'uats yor neym?', az: 'Adın nədir?',
      notes: ["Cavab: I'm … və ya My name is …"],
      example: "Hi! What's your name?", exampleAz: 'Salam! Adın nədir?',
    },
    {
      type: 'write', id: 'd3_c04', number: 4, title: 'Mesajı qur', why: 'Sual düzgün sırada qurulub.',
      prompt: 'Yeni yoldaşının adını bilmirsən.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Yeni yoldaş', from: 'B', lines: [{ from: 'B', text: 'Hello!' }] },
      tiles: ['your', 'is', "What's", 'name', 'my', '?'], rule: exact("What's your name?"),
      hint: 'Bu dərsin əvvəlində öyrəndiyin ad sualını qur. Sual “Nə” mənasındakı sözlə başlayır.', hintAssists: false,
      variants: [other('Sıra: What’s + your + name?', ex("What's your name?", '“What’s” içində artıq “is” var. “you” — sən, “your” — sənin.', 'What’s + your + name?', "Hello! What's your name?"))],
      review: {
        title: 'Mesajı qur', why: 'Sual düzgün sırada qurulub.', prompt: 'Kursda yeni qızla tanış olursan.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Kurs yoldaşı', from: 'G', lines: [{ from: 'G', text: 'Hi!' }] },
        tiles: ['name', "What's", 'my', 'your', 'is', '?'], rule: exact("What's your name?"),
        hint: 'Bu dərsin əvvəlində öyrəndiyin ad sualını qur. Sual “Nə” mənasındakı sözlə başlayır.', hintAssists: false,
        variants: [other('Sıra: What’s + your + name?', ex("What's your name?", '“my” — mənim, “your” — sənin. Sən onun adını soruşursan.', 'What’s + your + name?', "Hi! What's your name?"))],
      },
    },
    {
      type: 'choice', id: 'd3_c05', number: 5, title: 'Sözü tamamla', why: '“your” — sənin.', hint: '“Sənin adın” deyirik. Hansı söz “sənin” deməkdir?',
      prompt: 'Oğlan qızın adını soruşur.\nHansı söz çatmır?',
      gap: { speaker: 'B', before: "What's", after: 'name?' }, options: ['I', 'your', 'my'], answer: 'your',
      variants: [
        pick('I', '“I” — mən; burada “sənin” lazımdır.', ex('your', '“Sənin adın” deyirik, ona görə “your”.', 'What’s your name?', "Hi! What's your name?")),
        pick('my', '“my” — mənim. O, öz adını soruşmur.', ex('your', 'Qarşı tərəfin adını soruşanda “your” deyilir.', 'What’s your name?', "Hello! What's your name?")),
      ],
      review: {
        title: 'Sözü tamamla', why: '“your” — sənin.', hint: '“Sənin adın” deyirik, “sən adın” yox. İngiliscə də “sən” və “sənin” fərqli sözlərdir.', prompt: 'Qız oğlanın adını soruşur.\nHansı söz çatmır?',
        gap: { speaker: 'G', before: "Hi! What's", after: 'name?' }, options: ['my', 'you', 'your'], answer: 'your',
        variants: [other('Burada “sənin” — your lazımdır.', ex('your', 'Qarşı tərəfin adını soruşanda “your” deyilir.', 'What’s your name?', "What's your name?"))],
      },
    },
    {
      type: 'word', id: 'd3_c06', number: 6,
      word: 'Nice to meet you.', pronunciation: '/naɪs tə mit ju/', reading: 'nays tu mit yu', az: 'Tanış olmağıma şadam.',
      notes: ['Adları deyəndən sonra deyilir.'],
      example: "I'm …. Nice to meet you!", exampleAz: 'Mən …-am. Tanış olmağıma şadam!',
    },
    {
      type: 'word', id: 'd3_c06b', number: 7,
      word: 'You too.', pronunciation: '/ju tu/', reading: 'yu tu', az: 'Mən də.',
      notes: ['“Nice to meet you”ya qısa cavabdır.'],
      example: 'Nice to meet you! — You too!', exampleAz: 'Tanış olmağıma şadam! — Mən də!',
    },
    {
      type: 'voice', id: 'd3_c07', number: 7, title: 'Dinlə və təkrarla', why: 'İfadə axıcı səsləndi.',
      prompt: 'İfadəni dinlə, sonra eyni cür de.', audio: 'Nice to meet you.', repeat: { stress: 'meet', note: 'Vurğu “meet” sözünə düşür.', reading: 'nays tu mit yu' },
      rule: exact('Nice to meet you'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('Nice to meet you.', '“to” zəif və qısa deyilir, “meet” güclü.', 'Vurğu “meet” sözünə düşür.', 'Nice to MEET you.'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Sual axıcı səsləndi.', prompt: 'Sualı dinlə, sonra eyni cür de.', audio: "What's your name?", repeat: { stress: 'name', note: 'Səs sonda bir az enir.', reading: 'uats yor neym?' },
        rule: exact("What's your name"),
        variants: [other('Bir daha dinlə və yavaş de.', ex("What's your name?", '“What’s” bir hecadır: /wɒts/.', 'Vurğu “name” sözünə düşür.', "What's your NAME?"))],
      },
    },
    {
      type: 'choice', id: 'd3_c08', number: 8, title: 'Cavabı seç', why: 'You too — “Mən də”.', hint: 'Oğlan xoş söz dedi. Bu dərsdə ona qısa cavab öyrəndin: “Mən də”.',
      prompt: 'Oğlan deyir: “Nice to meet you!”\nNecə cavab verərsən?', options: ['Goodbye!', 'You too!', "What's your name?"], answer: 'You too!',
      variants: [
        pick('Goodbye!', 'Tanışlıq yeni başladı, hələ sağollaşmırsan.', ex('You too!', '“Nice to meet you” tanışlığın xoş sözüdür. Cavabı “You too!” olur.', 'Nice to meet you → You too!', 'Nice to meet you! — You too!')),
        pick("What's your name?", 'Ad artıq deyilib.', ex('You too!', 'Adlar deyilib, indi xoş söz deyilir. Cavab “You too!”dur.', 'Nice to meet you → You too!', 'Nice to meet you! — You too!')),
      ],
      review: {
        title: 'Cavabı seç', why: 'You too — “Mən də”.', hint: 'Qız xoş söz dedi. Bu dərsdə ona qısa cavab öyrəndin: “Mən də”.', prompt: 'Qız deyir: “Nice to meet you!”\nNecə cavab verərsən?', options: ['You too!', 'My name is …', 'Hi!'], answer: 'You too!',
        variants: [other('Burada “Mən də” deyirsən.', ex('You too!', '“Nice to meet you”ya qısa cavab “You too!”dur.', 'Nice to meet you → You too!', 'Nice to meet you! — You too!'))],
      },
    },
    {
      type: 'write', id: 'd3_c09', number: 9, title: 'Dialoqu tamamla', why: 'Sualı başa düşdün və adını dedin.', hint: 'Qız sənin adını soruşur. Dərs 2-də adını necə deyirdin?',
      prompt: 'Qız adını deyib səninkini soruşur.\nAdını de.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Qonşu qız', from: 'G', lines: [{ from: 'G', text: "Hi! I'm …" }, { from: 'G', text: "What's your name?" }] }, rule: intro,
      variants: [
        insteadOf('askName', 'O artıq soruşdu — sən cavab verirsən.', ex("I'm … / My name is …", 'Sual verilib. Cavabda adını deyirsən.', 'What’s your name? → I’m …', "My name is …")),
        other('Adını I’m və ya My name is ilə de.', ex("I'm … / My name is …", '“What’s your name?” sualına cavab adındır.', 'What’s your name? → I’m …', "I'm …")),
      ],
      review: {
        title: 'Dialoqu tamamla', why: 'Sualı başa düşdün və adını dedin.', hint: 'Oğlan sənin adını soruşur. Dərs 2-də adını necə deyirdin?', prompt: 'İdman zalında oğlan soruşur.\nAdını de.', placeholder: 'Cavabını yaz',
        chat: { partner: 'Zal yoldaşı', from: 'B', lines: [{ from: 'B', text: "Hello! What's your name?" }] }, rule: intro,
        variants: [other('Adını I’m və ya My name is ilə de.', ex("I'm … / My name is …", '“What’s your name?” sualına cavab adındır.', 'What’s your name? → My name is …', "I'm …"))],
      },
    },
    {
      type: 'voice', id: 'd3_c10', number: 10, speaker: 'mascot', title: 'Adını soruş', why: 'Adı düzgün soruşdun.', hint: 'Bu dərsin əvvəlində öyrəndiyin sualı xatırla.',
      prompt: '{M} ilə tanış olursan.\nOnun adını soruş.', rule: askName, reply: 'Nice to meet you!',
      variants: [other('Adı soruşmaq üçün sual lazımdır.', ex("What's your name?", 'Adını demək yox, onun adını soruşmaq lazımdır.', 'What’s your name?', "Hi! What's your name?"))],
      review: {
        speaker: 'mascot', title: 'Adını soruş', why: 'Adı düzgün soruşdun.', hint: 'Bu dərsin əvvəlində öyrəndiyin sualı xatırla.', prompt: 'Sinifdə yeni uşaq var.\nOnun adını soruş.', rule: askName, reply: 'Nice to meet you!',
        variants: [other('Adı soruşmaq üçün sual lazımdır.', ex("What's your name?", 'Sən onun adını öyrənmək istəyirsən.', 'What’s your name?', "Hello! What's your name?"))],
      },
    },
    {
      type: 'voice', id: 'd3_c11', number: 11, speaker: 'mascot', title: 'Tanışlığa cavab ver', why: 'Tanışlığa xoş cavab verdin.', hint: 'Xoş sözə qısa cavab verilir: “Mən də”.',
      prompt: '{M} deyir: “Nice to meet you!”\nCavab ver.', audio: 'Nice to meet you!', rule: meet,
      variants: [other('Qısa cavab: You too!', ex('You too! / Nice to meet you too!', 'Xoş sözə xoş cavab verilir.', 'Nice to meet you → You too!', 'You too!'))],
      review: {
        speaker: 'mascot', title: 'Tanışlığa cavab ver', why: 'Tanışlığa xoş cavab verdin.', hint: 'Xoş sözə qısa cavab verilir: “Mən də”.', prompt: 'Yeni yoldaşın deyir: “Nice to meet you!”\nCavab ver.', audio: 'Nice to meet you!', rule: meet,
        variants: [other('Qısa cavab: You too!', ex('You too! / Nice to meet you too!', 'Xoş sözə xoş cavab verilir.', 'Nice to meet you → You too!', 'Nice to meet you too!'))],
      },
    },
    {
      type: 'write', id: 'd3_c12', number: 12, title: 'Söhbəti bitir', why: 'Görüşü sağollaşma ilə bitirdin.', hint: 'Görüş bitir. Dərs 1-in sağollaşma sözlərini xatırla.',
      prompt: 'Tanışlıq bitdi, gedirsən.\nSağollaş.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Qonşu qız', from: 'G', lines: [{ from: 'G', text: 'Nice to meet you!' }, { from: 'G', text: 'You too!' }] }, rule: bye,
      variants: [
        insteadOf('greet', 'Gedirsən — salam yox, sağollaşma.', ex('Bye! / Goodbye!', 'Hello / Hi görüşü başladır. Sən gedirsən.', 'Ayrılarkən: Bye! / Goodbye!', 'Bye!')),
        other('Sağollaşma ifadəsi yaz.', ex('Bye! / Goodbye!', 'Görüş bitir, sağollaşırsan.', 'Ayrılarkən: Bye! / Goodbye!', 'Goodbye!')),
      ],
      review: {
        title: 'Söhbəti bitir', why: 'Görüşü sağollaşma ilə bitirdin.', hint: 'Görüş bitir. Dərs 1-in sağollaşma sözlərini xatırla.', prompt: 'Dərs bitdi, evə gedirsən.\nYoldaşınla sağollaş.', placeholder: 'Cavabını yaz',
        chat: { partner: 'Zal yoldaşı', from: 'B', lines: [{ from: 'B', text: 'Bye!' }] }, rule: bye,
        variants: [other('Sağollaşma ifadəsi yaz.', ex('Bye! / Goodbye!', 'Görüş bitir, sağollaşırsan.', 'Ayrılarkən: Bye! / Goodbye!', 'Bye!'))],
      },
    },
  ],
  result: {
    done: ['Dərs 3 tamamlandı', 'Artıq adı soruşub tanışlığa cavab verə bilirsən.'],
    incomplete: 'Dərs tam bitmədi. Yoxlanmayan tapşırıqlara sonra qayıda bilərsən.',
    goals: [
      { group: 'Tanıma', text: 'Ad sualını və cavabını tanımaq', tasks: ['d3_c02', 'd3_c05', 'd3_c08'] },
      { group: 'Yazı', text: 'Ad sualını qurmaq və cavab vermək', tasks: ['d3_c04', 'd3_c09', 'd3_c12'] },
      { group: 'Danışıq', text: 'Adı soruşmaq və tanışlığa cavab vermək', tasks: ['d3_c10', 'd3_c11'] },
    ],
    closing: 'Növbəti dərsdə “Necəsən?” soruşacaqsan.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [
    { word: "What's your name?", translation: 'Adın nədir?', example: "Hi! What's your name?", exampleAz: 'Salam! Adın nədir?', usageNote: 'What’s = What is.', pronunciation: '/wʌts jʊr neɪm/', teachCard: 'd3_c03' },
    { word: 'Nice to meet you', translation: 'Tanış olmağıma şadam', example: 'Nice to meet you!', exampleAz: 'Tanış olmağıma şadam!', usageNote: 'Tanış olanda deyilir.', pronunciation: '/naɪs tə mit ju/', teachCard: 'd3_c06' },
    { word: 'You too', translation: 'Mən də', example: 'You too!', exampleAz: 'Mən də!', usageNote: '“Nice to meet you”ya cavab.', pronunciation: '/ju tu/', teachCard: 'd3_c06b' },
  ],
};
