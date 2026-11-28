// Bölmə 1 · Dərs 2 — Adını de (I'm… / My name is…). Spiral: Hello / Hi.
// Map: docs/BOLME_1_XERITESI.md. Standard: docs/DERS_STANDARTI.md. Learner errors: docs/AZ_OYRENEN_SEHVLERI.md.
// Character names are empty for now, so sentences that need a name use “…” (the learner says their own name).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const intro = goal(['introduce'], ["I'm [ad]", 'My name is [ad]']);
const greetIntro = goal(['greet', 'introduce'], ["Hello! I'm [ad]", 'Hi! My name is [ad]']);
// Before the “My name is” card only I'm is shown as a model (taught-before-shown).
const greetIntroEarly = goal(['greet', 'introduce'], ["Hello! I'm [ad]", "Hi! I'm [ad]"]);

export const lesson2: DesignLesson = {
  id: 'a1_en_b1_v2_d2', order: 2, unit: 1, number: 2, title: 'Adını de', section: 'İlk tanışlıq',
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
        { icon: 'chat', text: '“I’m [ad]” və “My name is [ad]” formalarını tanıyıram.' },
      ],
    },
    {
      type: 'word', id: 'd2_c02', number: 2, scenes: ['d2/word-im'], structure: ["I'm [ad]."],
      word: "I'm [ad]", pronunciation: '/aɪm/', reading: 'aym [ad]', az: 'Mən [ad]-am',
      notes: ['I — mən. Böyük hərflə yazılır.'],
      example: "Hello! I'm [ad]", exampleAz: 'Salam! Mən [ad]-am.',
    },
    {
      // Short form explained the first time it appears (20 Nov 2026, user rule: every short form is taught where it first comes).
      type: 'teach', id: 'd2_c02s', number: 2, title: 'Qısa forma',
      lead: 'İki söz birləşib bir söz olur. Hər ikisini dinlə:',
      phrases: [{ en: 'I am', az: 'mən [ad]-am' }, { en: "I'm", az: 'mən [ad]-am' }],
      // The Qısa forma row says both points: spoken short, same meaning; (') marks the dropped letter.
      shortForm: { full: 'I am', short: "I'm" }, notes: [],
    },
    {
      type: 'word', id: 'd2_c02b', number: 3, scenes: ['d2/word-my-name'], structure: ['My name is [ad].'],
      word: 'My name is [ad]', pronunciation: '/maɪ neɪm ɪz/', reading: 'may neym iz [ad]', az: 'Mənim adım [ad]-dır',
      notes: ["“I'm [ad]” ilə eyni mənadadır."],
      example: 'Hi! My name is [ad]', exampleAz: 'Salam! Mənim adım [ad]-dır.',
    },
    {
      type: 'choice', id: 'd2_c03', number: 3, scenes: ['d2/new-friend'], title: 'Düzgün cümləni seç', why: 'İngiliscə “is” ayrıca söz kimi deyilir.',
      prompt: 'Yeni tanışın adını demək istəyir.\nHansı cümlə düzgündür?',
      options: ['My name [ad]', 'My name is [ad]', 'I name is [ad]'], answer: 'My name is [ad]',
      hint: 'Azərbaycanca “adım [ad]-dır” deyirik, ingiliscə “-dır” ayrıca sözdür.', hintAssists: false,
      variants: [
        pick('My name [ad]', '“is” buraxılıb.', ex('My name is [ad]', 'Azərbaycancada -dır şəkilçidir, ingiliscə is isə ayrıca sözdür.', 'My name is + adın.', 'My name is [ad]')),
        pick('I name is [ad]', '“I” yox, “My” lazımdır.', ex('My name is [ad]', '“I” — mən, “my” — mənim deməkdir, ad isə “mənim adım”dır.', 'My name is + adın.', 'My name is [ad]')),
      ],
      review: {
        scenes: ['d2/new-classmates'],
        title: 'Düzgün cümləni seç', why: 'İngiliscə “is” ayrıca söz kimi deyilir.', prompt: 'Qonşun adını demək istəyir.\nHansı cümlə düzgündür?',
        options: ['I name is [ad]', 'My name [ad]', 'My name is [ad]'], answer: 'My name is [ad]',
        hint: 'Azərbaycanca “adım [ad]-dır” deyirik, ingiliscə “-dır” ayrıca sözdür.', hintAssists: false,
        variants: [
          pick('My name [ad]', '“is” buraxılıb.', ex('My name is [ad]', 'Azərbaycancada -dır şəkilçidir, ingiliscə is isə ayrıca sözdür.', 'My name is [ad] — düzgün; My name [ad] — is çatmır.', 'Hi! My name is [ad]')),
          pick('I name is [ad]', '“I” yox, “My” lazımdır.', ex('My name is [ad]', '“I” — mən, “my” — mənim deməkdir, ad isə “mənim adım”dır.', 'My name is [ad] — mənim adım; I’m [ad] — mən [ad]-am.', 'Hello! My name is [ad]')),
        ],
      },
    },
    {
      type: 'choice', id: 'd2_c04', number: 4, title: 'Sözü tamamla', why: '“I” ilə “am” gəlir.', hint: '“I’m” iki sözün qısa formasıdır — ikinci söz hansıdır?',
      prompt: 'Qız özünü təqdim edir.\nCümləsində hansı söz çatmır?',
      gap: { speaker: 'G', before: 'Hi! I', after: '[ad]' }, options: ['am', 'is', 'my'], answer: 'am',
      variants: [other('“I” ilə “am” gəlir.', ex('am', '“I” (mən) sözündən sonra “am” işlənir.', 'I ilə is demirik: I am [ad] → I’m [ad]', "I'm [ad]"))],
      review: {
        title: 'Sözü tamamla', why: '“I” ilə “am” gəlir.', hint: 'Azərbaycancada şəkilçi olan hissə ingiliscə I-dan sonra ayrıca söz kimi gəlir.', prompt: 'Oğlan özünü təqdim edir.\nCümləsində hansı söz çatmır?',
        gap: { speaker: 'B', before: 'Hello! I', after: '[ad]' }, options: ['am', 'is', 'my'], answer: 'am',
        variants: [other('“I” ilə “am” gəlir.', ex('am', 'I ilə is və my demirik, I ilə am gəlir.', "I + am → I'm.", "Hello! I'm [ad]"))],
      },
    },
    {
      type: 'match', id: 'd2_c05', number: 5, title: 'Kim nə dedi?', why: 'Salam, sağollaşma və ad — hər biri öz yerində.', hint: 'Əvvəl Dərs 1-dən tanıdığın sözləri yerinə qoy, qalanı asanlaşacaq.',
      prompt: 'Hər cümləyə mənasını qoş.',
      rows: [{ en: 'Hi!', az: 'Salam!', from: 'B' }, { en: "I'm [ad]", az: 'Mən [ad]-am.', from: 'G' }, { en: 'Bye!', az: 'Hələlik!', from: 'F' }],
      extra: ['Sağ ol!'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Hi! — Salam!; I’m [ad] — Mən [ad]-am.; Bye! — Hələlik!', 'Hi görüşü başladır, Bye bitirir, I’m adını deyir.', 'Hi! — görüşün əvvəli; Bye! — görüşün sonu.', 'Hi! I’m [ad]. Bye!'))],
      review: {
        title: 'Kim nə dedi?', why: 'Salam, sağollaşma və ad — hər biri öz yerində.', hint: 'Əvvəl Dərs 1-dən tanıdığın sözləri yerinə qoy, qalanı asanlaşacaq.', prompt: 'Hər cümləyə mənasını qoş.',
        rows: [{ en: 'Hello!', az: 'Salam!', from: 'G' }, { en: 'My name is [ad]', az: 'Mənim adım [ad]-dır.', from: 'B' }, { en: 'Goodbye!', az: 'Görüşənədək!', from: 'F' }],
        extra: ['Necəsən?'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('Hello! — Salam!; My name is [ad] — Mənim adım [ad]-dır.; Goodbye! — Görüşənədək!', 'Hello görüşü başladır, Goodbye bitirir, My name is adını deyir.', 'Hello! — görüşün əvvəli; Goodbye! — görüşün sonu.', 'Hello! My name is [ad]'))],
      },
    },
    {
      type: 'voice', id: 'd2_c06', number: 6, title: 'Dinlə və təkrarla', why: 'Ayrı-ayrı sözlər birlikdə səsləndi.',
      prompt: 'İfadəni dinlə, sonra eyni cür de.', audio: 'My name is', repeat: { stress: 'name', note: 'Vurğu “name” sözünə düşür.', reading: 'may neym iz' },
      rule: exact('My name is'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('My name is', 'Üç söz birlikdə, axıcı deyilir.', 'Vurğu “name” sözünə düşür.', 'My NAME is [ad]'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Qısa forma düzgün səsləndi.', prompt: 'İfadəni dinlə, sonra eyni cür de.', audio: "Hello! I'm", repeat: { stress: 'Hello', note: '“I’m” bir hecadır: “aym”.', reading: 'helou! aym' },
        rule: exact("Hello! I'm"),
        variants: [other('Bir daha dinlə və yavaş de.', ex("Hello! I'm", 'Səsdə I’m qısa formadadır və bir heca kimi deyilir.', 'I’m — “aym”, bir heca; I am — iki heca.', "Hello! I'm [ad]"))],
      },
    },
    {
      type: 'voice', id: 'd2_c08', number: 8, speaker: 'mascot', title: 'Özünü səslə təqdim et', why: 'Salam verdin və adını dedin.', hint: 'Əvvəl salam, sonra adın.',
      prompt: 'Yeni tanışın salam verir.\nSalam ver və adını de.', audio: 'Hello!', sample: "Hello! I'm [ad]", rule: greetIntroEarly,
      variants: [other('Salam və adın ikisi də lazımdır.', ex("Hello! I'm [ad]", 'Tanışın salam verdi, sən də salam verib adını deyirsən.', 'Salam + I’m + adın.', 'Hi! I’m [ad]'))],
      review: {
        speaker: 'mascot', title: 'Özünü səslə təqdim et', why: 'Salam verdin və adını dedin.', hint: 'Əvvəl salam, sonra adın.', prompt: 'Kursda yeni yoldaşın salam verir.\nSalam ver və adını de.', audio: 'Hi!', sample: "Hi! My name is [ad]", rule: greetIntro,
        variants: [other('Salam və adın ikisi də lazımdır.', ex("Hi! My name is [ad]", 'Yoldaşın salam verdi, sən də salam verib adını deyirsən.', 'Salam + I’m / My name is + adın.', "Hello! I'm [ad]"))],
      },
    },
    {
      type: 'voice', id: 'd2_c09', number: 9, speaker: 'mascot', title: 'Nümunəsiz de', why: 'Özünü nümunəsiz təqdim etdin.', hint: 'Əvvəl salam, sonra adın.',
      prompt: 'Kursda yeni müəllimlə tanış olursan.\nSalam ver və adını de.', rule: greetIntro, reply: 'Hello!',
      variants: [other('Salam və adın ikisi də lazımdır.', ex("Hello! I'm [ad]", 'Tanışlıqda əvvəl salam, sonra ad gəlir.', 'Salam + I’m / My name is + adın.', 'Hi! My name is [ad]'))],
      review: {
        speaker: 'mascot', title: 'Nümunəsiz de', why: 'Özünü nümunəsiz təqdim etdin.', hint: 'Əvvəl salam, sonra adın.', prompt: 'Yeni qrupla tanış olursan.\nSalam ver və adını de.', rule: greetIntro, reply: 'Hi!',
        variants: [other('Salam və adın ikisi də lazımdır.', ex("Hi! I'm [ad]", 'Tanışlıqda əvvəl salam, sonra ad gəlir.', 'Salam + I’m / My name is + adın.', 'Hello! My name is [ad]'))],
      },
    },
    {
      type: 'write', id: 'd2_c10', number: 10, scenes: ['d2/registration'], title: 'Adını yaz', why: 'Qısa və düzgün təqdimat.', hint: 'Bu dərsin iki formasından birini işlət, sonuna öz adını yaz.',
      prompt: 'Kursun qeydiyyat çatında adını soruşurlar.\nAdını ingiliscə cümlə ilə yaz.', placeholder: "I'm [ad]", rule: intro,
      variants: [other('I’m və ya My name is ilə yaz.', ex("I'm [ad] / My name is [ad]", 'Tapşırıq cümlə istəyir, tək ad isə cümlə deyil.', 'I’m + adın və ya My name is + adın.', "I'm [ad]"))],
      review: {
        scenes: ['d2/game-profile'],
        title: 'Adını yaz', why: 'Qısa və düzgün təqdimat.', hint: 'Bu dərsin iki formasından birini işlət, sonuna öz adını yaz.', prompt: 'Oyunda profilinin “Haqqımda” hissəsini yazırsan.\nÖzünü ingiliscə bir cümlə ilə təqdim et.', placeholder: 'My name is [ad]', rule: intro,
        variants: [other('I’m və ya My name is ilə yaz.', ex("I'm [ad] / My name is [ad]", 'Tapşırıq cümlə istəyir, tək ad isə cümlə deyil.', 'I’m + adın və ya My name is + adın.', 'My name is [ad]'))],
      },
    },
  ],
  result: {
    done: ['Dərs 2 tamamlandı', 'Artıq salam verib adını deyə bilirsən.'],
    incomplete: 'Dərs tam bitmədi. Yoxlanmayan tapşırıqlara sonra qayıda bilərsən.',
    goals: [
      { group: 'Tanıma', text: '“is / am” formalarını tanımaq', tasks: ['d2_c03', 'd2_c04', 'd2_c05'] },
      { group: 'Yazı', text: 'Salam verib adını yazmaq', tasks: ['d2_c10'] },
      { group: 'Danışıq', text: 'Özünü səslə təqdim etmək', tasks: ['d2_c08', 'd2_c09'] },
    ],
    closing: 'Növbəti dərsdə başqasının adını soruşacaqsan.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [
    { word: "I'm", translation: 'Mən [ad]-am', example: "I'm [ad]", exampleAz: 'Mən [ad]-am.', usageNote: 'I am-ın qısa formasıdır.', pronunciation: '/aɪm/', teachCard: 'd2_c02' },
    { word: 'My name is', translation: 'Mənim adım [ad]-dır', example: 'My name is [ad]', exampleAz: 'Mənim adım [ad]-dır.', usageNote: 'Adını demək üçün.', pronunciation: '/maɪ neɪm ɪz/', teachCard: 'd2_c02b' },
  ],
};
