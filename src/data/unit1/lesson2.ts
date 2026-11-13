// Bölmə 1 · Dərs 2 — Adını de (I'm… / My name is…). Spiral: Hello / Hi.
// Map: docs/BOLME_1_XERITESI.md. Standard: docs/DERS_STANDARTI.md. Learner errors: docs/AZ_OYRENEN_SEHVLERI.md.
// Character names are empty for now, so sentences that need a name use “…” (the learner says their own name).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const intro = goal(['introduce'], ["I'm …", 'My name is …']);
const greetIntro = goal(['greet', 'introduce'], ["Hello! I'm …", 'Hi! My name is …']);

export const lesson2: DesignLesson = {
  id: 'a1_en_b1_v2_d2', order: 2, title: 'Adını de', section: 'İlk tanışlıq',
  notices: {
    soundFailed: 'Səs açılmadı. Yenidən dinlə və ya mətnlə davam et.',
    unknown: 'Cavabı yoxlaya bilmədim. Bir az fərqli yaz və ya yenidən cəhd et.',
    voiceUnknown: 'Səsini aydın eşitmədim. Yenidən de.',
    micFailed: 'Mikrofon açılmadı. Keçə bilərsən.',
    review: 'Səhv etdiyin tapşırıqlara yeni vəziyyətdə qayıdırıq.',
  },
  cards: [
    {
      type: 'intro', id: 'd2_c01', badge: 'İlk tanışlıq', subtitle: 'Tanış olanda adını deyirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'wave', text: 'Salam verib adımı deyə bilirəm.' },
        { icon: 'chat', text: '“I’m …” və “My name is …” formalarını tanıyıram.' },
      ],
    },
    {
      type: 'word', id: 'd2_c02', number: 2,
      word: "I'm … · My name is …", pronunciation: '/aɪm/ · /maɪ neɪm ɪz/', reading: 'aym … · may neym iz …', az: 'Mən …-am · Mənim adım …-dır',
      notes: ['Hər ikisi ilə adını deyirsən. I’m daha qısadır.', 'I həmişə böyük hərflə yazılır.'],
      example: "Hello! I'm …", exampleAz: 'Salam! Mən …-am.',
    },
    {
      type: 'choice', id: 'd2_c03', number: 3, scenes: ['d2/new-friend'], title: 'Düzgün cümləni seç', why: 'İngiliscə “is” ayrıca söz kimi deyilir.',
      prompt: 'Yeni tanışın adını demək istəyir.\nHansı cümlə düzgündür?',
      options: ['My name …', 'My name is …', 'I name is …'], answer: 'My name is …',
      hint: 'Azərbaycanca “Mənim adım Aysudur” deyirik. Sondakı “-dur” ingiliscə ayrıca sözdür. Hansı cümlədə o söz var?', hintAssists: false,
      variants: [
        pick('My name …', '“is” buraxılıb.', ex('My name is …', 'İngiliscə “is” ayrıca söz kimi yazılır. Azərbaycan dilində bu məna şəkilçidədir: “adım …-dır”.', 'My name is + adın.', 'My name is …')),
        pick('I name is …', '“I” yox, “My” lazımdır.', ex('My name is …', '“I” — mən, “my” — mənim deməkdir. Ad “mənim adım”dır.', 'My name is + adın.', 'My name is …')),
      ],
      review: {
        scenes: ['d2/new-classmates'],
        title: 'Düzgün cümləni seç', why: 'İngiliscə “am” ayrıca söz kimi deyilir.', prompt: 'İndi qısa formanı seç.\nHansı cümlə düzgündür?',
        options: ["I'm …", 'I …', 'I is …'], answer: "I'm …",
        hint: '“Mən Aysuyam” deyirik. “-yam” ingiliscə ayrıca sözdür. Hansı cümlədə o söz var?', hintAssists: false,
        variants: [
          pick('I …', '“am” buraxılıb.', ex("I'm … (I am …)", '“Mən …-am” deyəndə ingiliscə “am” ayrıca söz kimi gəlir.', "I'm / I am + adın.", "I'm …")),
          pick('I is …', '“I” ilə “am” işlənir.', ex("I'm … (I am …)", '“is” başqa şəxslər üçündür. “I” ilə həmişə “am” gəlir.', "I'm / I am + adın.", "I'm …")),
        ],
      },
    },
    {
      type: 'choice', id: 'd2_c04', number: 4, title: 'Sözü tamamla', why: '“I” ilə “am” gəlir.', hint: 'Bu dərsdə “I’m” öyrəndin. O, iki sözün qısa formasıdır. Hansı söz gizlənib?',
      prompt: 'Qız özünü təqdim edir.\nCümləsində hansı söz çatmır?',
      gap: { speaker: 'G', before: 'Hi! I', after: '…' }, options: ['am', 'is', 'my'], answer: 'am',
      variants: [other('“I” ilə “am” gəlir.', ex('am', '“I” (mən) sözündən sonra “am” işlənir.', 'I am = I’m.', "I'm …"))],
      review: {
        title: 'Sözü tamamla', why: '“My name” ilə “is” gəlir.', hint: '“Mənim adım Aysudur” — “-dur” hissəsini ingiliscə hansı söz verir?', prompt: 'Oğlan adını deyir.\nCümləsində hansı söz çatmır?',
        gap: { speaker: 'B', before: 'Hello! My name', after: '…' }, options: ['am', 'is', 'my'], answer: 'is',
        variants: [other('“My name” ilə “is” gəlir.', ex('is', '“My name” (mənim adım) bir şeydir, onunla “is” işlənir.', 'My name is + adın.', 'My name is …'))],
      },
    },
    {
      type: 'match', id: 'd2_c05', number: 5, title: 'Kim nə dedi?', why: 'Salam, sağollaşma və ad — hər biri öz yerində.', hint: 'Əvvəl Dərs 1-dən tanıdığın sözləri yerinə qoy, qalanı asanlaşacaq.',
      prompt: 'Hər cümləyə mənasını qoş.',
      rows: [{ en: 'Hi!', az: 'Salam!', from: 'B' }, { en: "I'm …", az: 'Mən …-am.', from: 'G' }, { en: 'Bye!', az: 'Hələlik!', from: 'M' }],
      extra: ['Sağ ol!'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Hi! — Salam!; I’m … — Mən …-am.; Bye! — Hələlik!', 'Hi görüşü başladır, Bye bitirir, I’m adını deyir.', 'Əvvəl salam, sonra ad; sonda sağollaşma.', 'Hi! I’m … Bye!'))],
      review: {
        title: 'Kim nə dedi?', why: 'Salam, sağollaşma və ad — hər biri öz yerində.', hint: 'Əvvəl Dərs 1-dən tanıdığın sözləri yerinə qoy, qalanı asanlaşacaq.', prompt: 'Hər cümləyə mənasını qoş.',
        rows: [{ en: 'Hello!', az: 'Salam!', from: 'G' }, { en: 'My name is …', az: 'Mənim adım …', from: 'B' }, { en: 'Goodbye!', az: 'Görüşənədək!', from: 'M' }],
        extra: ['Necəsən?'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('Hello! — Salam!; My name is … — Mənim adım …; Goodbye! — Görüşənədək!', 'Hello görüşü başladır, Goodbye bitirir, My name is adını deyir.', 'Əvvəl salam, sonra ad; sonda sağollaşma.', 'Hello! My name is …'))],
      },
    },
    {
      type: 'voice', id: 'd2_c06', number: 6, title: 'Dinlə və təkrarla', why: 'Ayrı-ayrı sözlər birlikdə səsləndi.',
      prompt: 'İfadəni dinlə, sonra eyni cür de.', audio: 'My name is', repeat: { stress: 'name', note: 'Vurğu “name” sözünə düşür.', reading: 'may neym iz' },
      rule: exact('My name is'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('My name is', 'Üç söz birlikdə, axıcı deyilir.', 'Vurğu “name” sözünə düşür.', 'My NAME is …'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Qısa forma düzgün səsləndi.', prompt: 'İfadəni dinlə, sonra eyni cür de.', audio: "Hello! I'm", repeat: { stress: 'Hello', note: '“I’m” bir hecadır: /aɪm/.', reading: 'helou! aym' },
        rule: exact("Hello! I'm"),
        variants: [other('Bir daha dinlə və yavaş de.', ex("Hello! I'm", '“I’m” iki söz kimi yox, bir heca kimi deyilir.', 'I’m = /aɪm/.', "Hello! I'm …"))],
      },
    },
    {
      type: 'write', id: 'd2_c07', number: 7, title: 'Dialoqu tamamla', why: 'Salam verdin və adını dedin.',
      prompt: 'Yeni qonşun sənə yazır.\nSalam ver və adını de.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Yeni qonşu', from: 'G', lines: [{ from: 'G', text: 'Hello!' }] }, rule: greetIntro,
      hint: 'İki hissə yaz: əvvəl qonşuna salam ver, sonra özünü təqdim et.', hintAssists: false,
      variants: [
        insteadOf('farewell', 'Görüş yeni başlayır — sağollaşma yox, salam lazımdır.', ex("Hello! I'm …", 'Bye / Goodbye görüşü bitirir. Burada görüş başlayır.', 'Salam + adın.', 'Hi! My name is …')),
        other('Salam və adın ikisi də lazımdır.', ex("Hello! I'm …", 'Qonşun salam verdi. Sən də salam verib adını deyirsən.', 'Salam + I’m / My name is + adın.', 'Hi! My name is …')),
      ],
      review: {
        title: 'Dialoqu tamamla', why: 'Salam verdin və adını dedin.', prompt: 'Məktəbdə yeni yoldaşın yazır.\nSalam ver və adını de.', placeholder: 'Cavabını yaz',
        chat: { partner: 'Yeni yoldaş', from: 'B', lines: [{ from: 'B', text: 'Hi!' }] }, rule: greetIntro,
        hint: 'İki hissə yaz: əvvəl yoldaşına salam ver, sonra özünü təqdim et.', hintAssists: false,
        variants: [other('Salam və adın ikisi də lazımdır.', ex("Hi! I'm …", 'Yoldaşın salam verdi. Sən də salam verib adını deyirsən.', 'Salam + I’m / My name is + adın.', "Hello! I'm …"))],
      },
    },
    {
      type: 'voice', id: 'd2_c08', number: 8, speaker: 'mascot', title: 'Özünü səslə təqdim et', why: 'Salam verdin və adını dedin.', hint: 'Əvvəl salam, sonra adın.',
      prompt: '{M} salam verir.\nSalam ver və adını de.', audio: 'Hello!', sample: "Hello! I'm …", rule: greetIntro,
      variants: [other('Salam və adın ikisi də lazımdır.', ex("Hello! I'm …", '{M} salam verdi. Cavabda salam və adın olmalıdır.', 'Salam + I’m / My name is + adın.', 'Hi! My name is …'))],
      review: {
        speaker: 'mascot', title: 'Özünü səslə təqdim et', why: 'Salam verdin və adını dedin.', hint: 'Əvvəl salam, sonra adın.', prompt: 'Yeni gün. {M} yenə salam verir.\nSalam ver və adını de.', audio: 'Hi!', sample: "Hi! My name is …", rule: greetIntro,
        variants: [other('Salam və adın ikisi də lazımdır.', ex("Hi! My name is …", '{M} salam verdi. Cavabda salam və adın olmalıdır.', 'Salam + I’m / My name is + adın.', "Hello! I'm …"))],
      },
    },
    {
      type: 'voice', id: 'd2_c09', number: 9, speaker: 'mascot', title: 'Nümunəsiz de', why: 'Özünü nümunəsiz təqdim etdin.', hint: 'Əvvəl salam, sonra adın.',
      prompt: 'İndi növbə səndədir!\nSalam ver və adını de.', rule: greetIntro, reply: 'Hello!',
      variants: [other('Salam və adın ikisi də lazımdır.', ex("Hello! I'm …", 'Tanışlıqda əvvəl salam, sonra ad gəlir.', 'Salam + I’m / My name is + adın.', 'Hi! My name is …'))],
      review: {
        speaker: 'mascot', title: 'Nümunəsiz de', why: 'Özünü nümunəsiz təqdim etdin.', hint: 'Əvvəl salam, sonra adın.', prompt: 'Yeni qrupla tanış olursan.\nSalam ver və adını de.', rule: greetIntro, reply: 'Hi!',
        variants: [other('Salam və adın ikisi də lazımdır.', ex("Hi! I'm …", 'Tanışlıqda əvvəl salam, sonra ad gəlir.', 'Salam + I’m / My name is + adın.', 'Hello! My name is …'))],
      },
    },
    {
      type: 'write', id: 'd2_c10', number: 10, scenes: ['d2/registration'], title: 'Adını yaz', why: 'Qısa və düzgün təqdimat.', hint: 'Bu dərsdə öyrəndiyin iki formadan birini işlət, sonuna öz adını yaz.',
      prompt: 'Qeydiyyat söhbətində soruşurlar: kimsən?\nYalnız adını ingiliscə cümlə ilə yaz.', placeholder: "I'm …", rule: intro,
      variants: [other('I’m və ya My name is ilə yaz.', ex("I'm … / My name is …", 'Tək ad yazmaq olar, amma burada tam cümlə lazımdır.', 'I’m + adın və ya My name is + adın.', "I'm …"))],
      review: {
        scenes: ['d2/game-profile'],
        title: 'Adını yaz', why: 'Qısa və düzgün təqdimat.', hint: 'Bu dərsdə öyrəndiyin iki formadan birini işlət, sonuna öz adını yaz.', prompt: 'Yeni oyunda profil yaradırsan.\nAdını ingiliscə cümlə ilə yaz.', placeholder: 'My name is …', rule: intro,
        variants: [other('I’m və ya My name is ilə yaz.', ex("I'm … / My name is …", 'Burada tam cümlə lazımdır.', 'I’m + adın və ya My name is + adın.', 'My name is …'))],
      },
    },
  ],
  result: {
    done: ['Dərs 2 tamamlandı', 'Artıq salam verib adını deyə bilirsən.'],
    incomplete: 'Dərs tam bitmədi. Yoxlanmayan tapşırıqlara sonra qayıda bilərsən.',
    goals: [
      { group: 'Tanıma', text: '“is / am” formalarını tanımaq', tasks: ['d2_c03', 'd2_c04', 'd2_c05'] },
      { group: 'Yazı', text: 'Salam verib adını yazmaq', tasks: ['d2_c07', 'd2_c10'] },
      { group: 'Danışıq', text: 'Özünü səslə təqdim etmək', tasks: ['d2_c08', 'd2_c09'] },
    ],
    closing: 'Növbəti dərsdə başqasının adını soruşacaqsan.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [
    { word: "I'm", translation: 'Mən …-am', example: "I'm …", exampleAz: 'Mən …-am.', usageNote: 'I am-ın qısa formasıdır.', pronunciation: '/aɪm/', teachCard: 'd2_c02' },
    { word: 'My name is', translation: 'Mənim adım …-dır', example: 'My name is …', exampleAz: 'Mənim adım …', usageNote: 'Adını demək üçün.', pronunciation: '/maɪ neɪm ɪz/', teachCard: 'd2_c02' },
  ],
};
