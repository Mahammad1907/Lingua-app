// Dərs 1 — Salamlaşma və sağollaşma.
// Source: docs/BirTalk_Ders_1_Yekun.md (yekun variant, 24 oktyabr 2026). The learner-facing
// text is copied from that document; do not rewrite it here. Name tokens such as {M} come
// from src/config/characters.ts (see withNames).
import type { DesignLesson, Variant } from './designLessonTypes';

const greet = { answers: ['Hello!', 'Hi!'], goals: ['greet' as const] };
const farewell = { answers: ['Goodbye!', 'Bye!'], goals: ['farewell' as const] };
const twoVariants: Variant[] = [
        { match: { swapped: true }, explain: {
          answers: 'Əvvəl Hello! / Hi!; sonda Goodbye! / Bye!', reason: 'Sağollaşmanı başlanğıcda, salamı isə sonda yazmısan.',
          rule: 'Salam görüşü başladır; sağollaşma bitirir.', example: 'Başlanğıc: “Hi!” Son: “Bye!”' } },
        { field: 'd1_c10a', match: { goal: 'farewell' }, explain: {
          answers: 'Hello! / Hi!', reason: 'Bu sahə görüşün başlanğıcı üçündür; yazdığın sağollaşma görüşü bitirir.',
          rule: 'Əvvəl salam ver, ayrılarkən sağollaş.', example: 'Görüş başlayır: “Hello!” Görüş bitir: “Bye!”' } },
        { field: 'd1_c10b', match: { goal: 'greet' }, short: 'Birinci mesaj uyğundur. İkinci mesajda görüşü bitirən ifadə lazımdır.', explain: {
          answers: 'Goodbye! / Bye!', reason: 'İkinci sahədə ayrılırsan, Hello və Hi isə görüşü başladır.',
          rule: 'Görüşün sonunda sağollaşma yaz.', example: 'Söhbət bitir: “Goodbye!”' } },
        { match: { other: true }, explain: {
          answers: 'Başlanğıc üçün Hello! / Hi!; son üçün Goodbye! / Bye!', reason: 'Bu mesaj görüşün bu anına uyğun deyil.',
          rule: 'Hər mesajı görüşün həmin anına uyğun yaz.', example: 'Əvvəl “Hello!”, ayrılarkən “Goodbye!”' } },
      ];

export const lesson1Design: DesignLesson = {
  id: 'a1_en_b1_v2_d1', order: 1, unit: 1, number: 1, part: 1, title: 'Salamlaşma və sağollaşma', section: 'İlk tanışlıq',
  notices: {
    soundFailed: 'Səs açılmadı. Yenidən dinləməyə cəhd et və ya mətnlə davam et. Bu texniki problem dil səhvi sayılmayacaq.',
    unknown: 'Cavabını dəqiq qiymətləndirə bilmədim. Yenidən cəhd edə və ya yoxlanmamış kimi davam edə bilərsən.',
    voiceUnknown: 'Səsli cavabın dəqiq tanınmadı. Yenidən səs yaza və ya bu məşqi keçə bilərsən.',
    micFailed: 'Səs yazılmadı. Yenidən cəhd edə və ya danışıq məşqini keçə bilərsən.',
    review: 'Bu hissədə çətinlik oldu. İndi başqa vəziyyətdə yenidən məşq edək.',
  },
  cards: [
    {
      type: 'intro', id: 'd1_c01', badge: 'İlk tanışlıq', subtitle: 'İlk görüş bir salamla başlayır.', start: 'Dərsə başla',
      // “Bu dərsdə salam verməyi, salama cavab verməyi və sağollaşmağı məşq edəcəksən.”
      // 26 Nov 2026: the lesson has two parts; this part is the greeting, part 2 (lesson1Design2) the farewell.
      goals: [{ icon: 'wave', text: 'Salam verməyi' }, { icon: 'chat', text: 'Salama cavab verməyi məşq edəcəksən' }],
    },
    {
      type: 'word', id: 'd1_c02', number: 2, scenes: ['d1/word-hello'], structure: ['Hello!', 'Hello, [ad]!'],
      word: 'Hello! · Hi!', pronunciation: '/həˈloʊ/ · /haɪ/', reading: 'helou · hay', az: 'Salam!',
      notes: ['Hi daha qeyri-rəsmidir.'],
      example: 'Hello{en,G}!', exampleAz: 'Salam{,G}!',
    },
    {
      type: 'choice', id: 'd1_c03', why: 'Hi salamdır — {m} salam verir.', speaker: 'mascot', number: 3, title: 'Dinlə və anla', prompt: 'Səsi dinlə. {M} nə edir?',
      audio: 'Hi!', options: ['Salam verir.', 'Sağollaşır.', 'Təşəkkür edir.'], answer: 'Salam verir.',
      hint: 'Bu söz görüş başlayanda deyilir, yoxsa bitəndə?', hintAssists: true,
      variants: [{ match: { option: 'Təşəkkür edir.' }, short: 'Hi təşəkkür deyil, salamdır. Bu səsdə {m} salam verir.', explain: {
        answers: 'Salam verir.', reason: 'Səsdə “Hi!” deyilir — bu, təşəkkür yox, salamdır.',
        rule: 'Hello və Hi salam vermək üçün işlənir.', example: 'Bir tanışın səninlə qarşılaşır və “Hello!” deyir. O, salam verir.' } },
      { match: { other: true }, short: 'Hi salamlaşmaq üçündür. Bu səsdə {m} salam verir.', explain: {
        answers: 'Salam verir.', reason: 'Səsdə “Hi!” deyilir — bu, sağollaşma yox, salamdır.',
        rule: 'Hello və Hi salam vermək üçün işlənir.', example: 'Bir tanışın səninlə qarşılaşır və “Hello!” deyir. O, salam verir.' } }],
      review: { why: 'Hello salamdır — danışan salam verir.',
        title: 'Dinlə və anla', prompt: 'Dinlə. Danışan nə edir?', audio: 'Hello!', options: ['Sağollaşır.', 'Təşəkkür edir.', 'Salam verir.'], answer: 'Salam verir.',
        hint: 'Bu söz görüş başlayanda deyilir, yoxsa bitəndə?', hintAssists: true,
        variants: [{ match: { option: 'Təşəkkür edir.' }, short: 'Hello təşəkkür deyil, salamdır. Bu səsdə danışan salam verir.', explain: {
          answers: 'Salam verir.', reason: 'Səsdə “Hello!” deyilir — bu, təşəkkür yox, salamdır.',
          rule: 'Hello və Hi salam vermək üçün işlənir.', example: '“Hi!” — salam verir.' } },
        { match: { other: true }, short: 'Hello salamlaşmaq üçündür. Bu səsdə danışan salam verir.', explain: {
          answers: 'Salam verir.', reason: 'Səsdə “Hello!” deyilir — bu, sağollaşma yox, salamdır.',
          rule: 'Hello və Hi salam vermək üçün işlənir.', example: '“Hi!” — salam verir.' } }],
      },
    },
    {
      type: 'write', chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: '👋' }], reply: '😊' }, id: 'd1_c04', why: 'Hello və Hi görüşü başladır.', number: 4, title: 'Salamı özün yaz', prompt: 'Yeni tanışınla ilk dəfə mesajlaşırsan.\nOna ingiliscə salam yaz.',
      placeholder: 'Cavabını yaz', rule: greet, hint: 'Dərsin əvvəlindəki salam sözlərindən birini yaz.',
      variants: [
        { match: { goal: 'farewell' }, short: 'Bu ifadə sağollaşmaq üçündür. Burada salam vermək lazımdır.', explain: {
          answers: 'Hello! / Hi!', reason: 'Yazdığın söz sağollaşmadır, sən isə tanışınla söhbətə yeni başlayırsan.',
          rule: 'Görüşü salamla başlat.', example: 'Tanışını məktəbin qarşısında görürsən: “Hi!”' } },
        { match: { other: true }, short: 'Burada qarşı tərəfə ingiliscə salam yazmaq lazımdır.', explain: {
          answers: 'Hello! / Hi!', reason: 'Yazdığın söz salam deyil.',
          rule: 'Cavab qarşı tərəfə salam verməlidir.', example: 'Qonşunla qarşılaşırsan: “Hello!”' } },
      ],
      review: { chat: { partner: 'Tanışın', from: 'B', lines: [{ from: 'B', text: '👋' }] },
        title: 'Salamı özün yaz', prompt: 'Tanışın sənə mesajda əl yellədi. Ona ingiliscə salam yaz.', placeholder: 'Cavabını yaz', rule: greet,
        hint: 'Dərsin əvvəlindəki salam sözlərindən birini yaz.',
        variants: [
          { match: { goal: 'farewell' }, short: 'Bu ifadə sağollaşmaq üçündür. Burada salam vermək lazımdır.', explain: {
            answers: 'Hello! / Hi!', reason: 'Yazdığın söz sağollaşmadır, sən isə tanışınla söhbətə yeni başlayırsan.',
            rule: 'Görüşü salamla başlat.', example: '“Hello!” ilə salamlaş.' } },
          { match: { other: true }, short: 'Burada qarşı tərəfə ingiliscə salam yazmaq lazımdır.', explain: {
            answers: 'Hello! / Hi!', reason: 'Yazdığın söz salam deyil.',
            rule: 'Cavab qarşı tərəfə salam verməlidir.', example: '“Hello!” ilə salamlaş.' } },
        ],
      },
    },
    {
      type: 'voice', id: 'd1_c05', why: 'Salama salamla cavab verdin.', hint: 'Salama salamla cavab ver.', speaker: 'mascot', number: 5, title: 'Salama səslə cavab ver', prompt: '{M} sənə salam verir. Səslə cavab ver.',
      audio: 'Hello!', sample: 'Hi!', rule: { answers: ['Hi!', 'Hello!'], goals: ['greet'] },
      variants: [
        { match: { goal: 'farewell' }, short: '{M} salam verir. Cavabın da salamlaşma olmalıdır.', explain: {
          answers: 'səslə Hi! / Hello!', reason: 'Dediyin sağollaşma görüşü bitirir; burada {m:gen} salamına qarşılıq verilir.',
          rule: 'Salama salamla cavab verə bilərsən.', example: 'Biri “Hi!” deyir. Sən “Hello!” deyə cavab verirsən.' } },
        { match: { other: true }, explain: {
          answers: 'səslə Hi! / Hello!', reason: 'Bu cavab {m:gen} salamına qarşılıq vermir.',
          rule: 'Qarşı tərəf salam verəndə salam ifadəsi ilə cavab ver.', example: '{M} “Hello!” deyir, sən “Hi!” deyirsən.' } },
      ],
      review: {
        speaker: 'mascot', title: 'Salama səslə cavab ver', hint: 'Salama salamla cavab ver.', prompt: '{M} “Hi!” deyir.\nOnun salamına səslə cavab ver.', audio: 'Hi!', rule: { answers: ['Hello!', 'Hi!'], goals: ['greet'] },
        variants: [
          { match: { goal: 'farewell' }, short: '{M} salam verir. Cavabın da salamlaşma olmalıdır.', explain: {
            answers: 'səslə Hi! / Hello!', reason: 'Dediyin sağollaşma görüşü bitirir; burada {m:gen} salamına qarşılıq verilir.',
            rule: 'Salama salamla cavab verə bilərsən.', example: 'Qarşı tərəf “Hello!” deyir, sən “Hi!” deyirsən.' } },
          { match: { other: true }, explain: {
            answers: 'səslə Hi! / Hello!', reason: 'Bu cavab {m:gen} salamına qarşılıq vermir.',
            rule: 'Qarşı tərəf salam verəndə salam ifadəsi ilə cavab ver.', example: 'Qarşı tərəf “Hello!” deyir, sən “Hi!” deyirsən.' } },
        ],
      },
    },
    {
      // New (26 Nov 2026, lesson split): Part 1 needs 8 screens. Same form as card 7B, with the greeting.
      type: 'write', id: 'd1_c12', why: 'Səsdə Hello deyildi.', number: 0, title: 'Eşitdiyini yaz', prompt: 'Eşitdiyin sözü yaz.',
      audio: 'Hello!', placeholder: 'Eşitdiyin sözü yaz', rule: { answers: ['Hello'], exact: true },
      hint: 'Yavaş dinlə və eşitdiyin sözü olduğu kimi yaz.',
      variants: [
        { match: { words: ['hi'] }, short: 'Hi də salamdır, amma səsdə Hello deyilir.', explain: {
          answers: 'Hello!', reason: 'Səsdə Hi yox, Hello deyilir.',
          rule: 'Eşitdiyini yazmaq tapşırığında səslənən sözü yaz.', example: 'Başqa səsdə “Hi!” eşidirsənsə, “Hi” yazırsan.' } },
        { match: { other: true }, explain: {
          answers: 'Hello!', reason: 'Yazdığın söz səsdəki Hello deyil.',
          rule: 'Səslənən sözü yaz.', example: '“Hi!” eşidəndə “Hi” yazılır.' } },
      ],
      review: { why: 'Səsdə Hi deyildi.',
        title: 'Eşitdiyini yaz', prompt: 'Eşitdiyin sözü yaz.', audio: 'Hi!', placeholder: 'Eşitdiyin sözü yaz',
        rule: { answers: ['Hi'], exact: true }, hint: 'Yavaş dinlə və eşitdiyin sözü olduğu kimi yaz.',
        variants: [
          { match: { words: ['hello'] }, short: 'Hello da salamdır, amma səsdə Hi deyilir.', explain: {
            answers: 'Hi!', reason: 'Bu səsdə Hello yox, Hi deyilir.', rule: 'Səslənən sözü yaz.', example: '“Hello!” eşidəndə “Hello” yazılır.' } },
          { match: { other: true }, explain: {
            answers: 'Hi!', reason: 'Yazdığın söz səsdəki Hi deyil.', rule: 'Səslənən sözü yaz.', example: '“Hello!” eşidəndə “Hello” yazılır.' } },
        ],
      },
    },
    {
      // New (26 Nov 2026, lesson split): reading a greeting in a message.
      type: 'choice', id: 'd1_c13', why: 'Hi salamdır — tanışın salam verir.', number: 0, title: 'Oxu və anla', prompt: 'Tanışın mesajda yazır: “Hi!”\nO nə edir?',
      options: ['Sağollaşır.', 'Salam verir.', 'Təşəkkür edir.'], answer: 'Salam verir.',
      hint: 'Bu söz görüş başlayanda deyilir, yoxsa bitəndə?', hintAssists: true,
      variants: [{ match: { option: 'Təşəkkür edir.' }, short: 'Hi təşəkkür deyil, salamdır.', explain: {
        answers: 'Salam verir.', reason: 'Mesajda “Hi!” yazılıb — bu, təşəkkür yox, salamdır.',
        rule: 'Hello və Hi salam vermək üçün işlənir.', example: 'Tanışın sənə “Hello!” yazır. O, salam verir.' } },
      { match: { other: true }, short: 'Hi görüşü başladır, bitirmir.', explain: {
        answers: 'Salam verir.', reason: 'Mesajda “Hi!” yazılıb — bu, sağollaşma yox, salamdır.',
        rule: 'Hello və Hi salam vermək üçün işlənir.', example: 'Tanışın sənə “Hello!” yazır. O, salam verir.' } }],
      review: { why: 'Hello salamdır — qonşun salam verir.',
        title: 'Oxu və anla', prompt: 'Qonşun mesajda yazır: “Hello!”\nO nə edir?', options: ['Salam verir.', 'Təşəkkür edir.', 'Sağollaşır.'], answer: 'Salam verir.',
        hint: 'Bu söz görüş başlayanda deyilir, yoxsa bitəndə?', hintAssists: true,
        variants: [{ match: { option: 'Təşəkkür edir.' }, short: 'Hello təşəkkür deyil, salamdır.', explain: {
          answers: 'Salam verir.', reason: 'Mesajda “Hello!” yazılıb — bu, təşəkkür yox, salamdır.',
          rule: 'Hello və Hi salam vermək üçün işlənir.', example: 'Qonşun sənə “Hi!” yazır. O, salam verir.' } },
        { match: { other: true }, short: 'Hello görüşü başladır, bitirmir.', explain: {
          answers: 'Salam verir.', reason: 'Mesajda “Hello!” yazılıb — bu, sağollaşma yox, salamdır.',
          rule: 'Hello və Hi salam vermək üçün işlənir.', example: 'Qonşun sənə “Hi!” yazır. O, salam verir.' } }],
      },
    },
    {
      type: 'voice', id: 'd1_c11a', why: 'Görüşü salamla özün başlatdın.', hint: 'Görüş başlayır və ilk sözü sən deyirsən.', speaker: 'mascot', number: 12, title: 'Salamı sən başlat', prompt: '{M:acc} görürsən.\nSalamı sən başlat.',
      rule: greet, reply: 'Hi!',
      variants: [
        { match: { goal: 'farewell' }, explain: {
          answers: 'səslə Hello! / Hi!', reason: 'Yeni qarşılaşırsan, sağollaşma isə görüşü bitirir.',
          rule: 'Yeni görüşü salamla başlat.', example: '{M:acc} görürsən və “Hello!” deyirsən.' } },
        { match: { other: true }, explain: {
          answers: 'səslə Hello! / Hi!', reason: 'Dediyin söz salam deyil.',
          rule: 'Qarşı tərəfə salam ifadəsi de.', example: 'Yeni görüşdə əvvəl sən “Hi!” deyirsən.' } },
      ],
      review: {
        speaker: 'mascot', title: 'Salamı sən başlat', hint: 'Görüş başlayır və ilk sözü sən deyirsən.', prompt: 'Yeni gün {m:acc} görürsən. Salamı sən başlat.', rule: greet, reply: 'Hello!',
        variants: [
          { match: { goal: 'farewell' }, explain: {
            answers: 'səslə Hello! / Hi!', reason: 'Yeni qarşılaşırsan, sağollaşma isə görüşü bitirir.',
            rule: 'Yeni görüşü salamla başlat.', example: '{M:acc} görürsən və “Hello!” deyirsən.' } },
          { match: { other: true }, explain: {
            answers: 'səslə Hello! / Hi!', reason: 'Dediyin söz salam deyil.',
            rule: 'Qarşı tərəfə salam ifadəsi de.', example: 'Yeni görüşdə əvvəl sən “Hi!” deyirsən.' } },
        ],
      },
    },
  ],
  result: {
    done: ['Əhsən! Dərs 1-in 1-ci hissəsini tamamladın.', 'İndi hansı hissələri özün etdiyinə, hansılarda dəstək aldığına baxaq.'],
    incomplete: 'Dərs tamamlanmayıb. Qaldığın yerdən davam et.',
    technical: 'Bu hissə texniki səbəbdən mətnlə məşq edildi. Dinləmə yoxlanmadı.',
    unverified: 'Bu hissədə cavabın qiymətləndirilmədi. Nəticə: Yoxlanmadı.',
    goals: [
      { group: 'Dinləmə', text: 'Salam səsinin mənasını tanımaq.', tasks: ['d1_c03'] },
      { group: 'Dinləmə', text: 'Eşidilən salam sözünü dəqiq müəyyən edib yazmaq.', tasks: ['d1_c12'] },
      { group: 'Oxu', text: 'Yazılı salamın mənasını tanımaq.', tasks: ['d1_c13'] },
      { group: 'Yazı', text: 'Salamı özün yazmaq.', tasks: ['d1_c04'] },
      { group: 'Danışıq', text: 'Salama səslə cavab vermək.', tasks: ['d1_c05'] },
      { group: 'Danışıq', text: 'Salamı özün başlatmaq.', tasks: ['d1_c11a'] },
    ],
    closing: 'Növbəti hissədə sağollaşmağı öyrənəcəksən.',
    button: 'Bölməyə qayıt',
  },
  vocabulary: [
    { word: 'Hello', translation: 'Salam', example: 'Hello{en,G}!', exampleAz: 'Salam{,G}!', usageNote: 'Hello ümumi salamlaşmadır.', pronunciation: '/həˈloʊ/', teachCard: 'd1_c02' },
    { word: 'Hi', translation: 'Salam', example: 'Hi{en,B}!', exampleAz: 'Salam{,B}!', usageNote: 'Hi daha qeyri-rəsmi salamlaşmadır.', pronunciation: '/haɪ/', teachCard: 'd1_c02' },
  ],
};

// Dərs 1 · 2-ci hissə — Sağollaşma (26 Nov 2026: lessons over 12 screens are split into parts; nothing was removed).
export const lesson1Design2: DesignLesson = {
  id: 'a1_en_b1_v2_d1_2', order: 2, unit: 1, number: 1, part: 2, title: 'Salamlaşma və sağollaşma', section: 'İlk tanışlıq',
  notices: lesson1Design.notices,
  cards: [
    {
      type: 'intro', id: 'd1_c01b', badge: 'İlk tanışlıq', subtitle: 'Görüş bitəndə sağollaşırsan.', start: 'Dərsə başla',
      goals: [{ icon: 'bye', text: 'Sağollaşmağı' }, { icon: 'chat', text: 'Salamı və sağollaşmanı yerində işlətməyi məşq edəcəksən' }],
    },
    {
      type: 'word', id: 'd1_c06', number: 6, scenes: ['d1/word-goodbye'], structure: ['Goodbye!', 'Bye, [ad]!'],
      word: 'Goodbye! · Bye!', pronunciation: '/ˌɡʊdˈbaɪ/ · /baɪ/', reading: 'qudbay · bay', az: 'Görüşənədək! · Hələlik!',
      notes: ['Görüş bitəndə deyilir. Bye daha qeyri-rəsmidir.'],
      example: 'Bye{en,B}!', exampleAz: 'Hələlik{,B}!',
    },
    {
      type: 'choice', id: 'd1_c07a', scenes: ['d1/cafe-door-scene'], why: 'Goodbye görüşü bitirir.', number: 7, title: 'Oxu və seç', prompt: 'Görüş bitdi. İndi gedirsən.\nHansı ifadə uyğundur?',
      options: ['Hello!', 'Goodbye!', 'Hi!'], answer: 'Goodbye!',
      hint: 'Görüş bitir — seçimlərdən hansı görüşü bitirir?', hintAssists: true,
      variants: [{ match: { option: 'Hi!' }, explain: {
        answers: 'Goodbye!', reason: 'Hi salamlaşmaq üçündür, burada isə görüş bitir.',
        rule: 'Ayrılarkən sağollaşma ifadəsi seç.', example: 'Söhbətin sonunda tanışından ayrılırsan: “Bye!”' } },
      { match: { other: true }, explain: {
        answers: 'Goodbye!', reason: 'Hello salamlaşmaq üçündür, burada isə görüş bitir.',
        rule: 'Ayrılarkən sağollaşma ifadəsi seç.', example: 'Söhbətin sonunda tanışından ayrılırsan: “Bye!”' } }],
      review: { why: 'Bye yazışmanı bitirir.', scenes: [],
        title: 'Oxu və seç', prompt: 'Yazışmanız bitir. Hansı mesaj uyğundur?', options: ['Hi!', 'Bye!', 'Hello!'], answer: 'Bye!',
        hint: 'Yazışma bitir — hansı mesaj sağollaşmadır?', hintAssists: true,
        variants: [{ match: { option: 'Hello!' }, explain: {
          answers: 'Bye!', reason: 'Yazışma bitir, Hello isə salamlaşmaq üçündür.', rule: 'Ayrılarkən sağollaş.', example: '“Goodbye!”' } },
        { match: { other: true }, explain: {
          answers: 'Bye!', reason: 'Yazışma bitir, Hi isə salamlaşmaq üçündür.', rule: 'Ayrılarkən sağollaş.', example: '“Goodbye!”' } }],
      },
    },
    {
      type: 'write', id: 'd1_c07b', why: 'Səsdə Bye deyildi.', number: 8, title: 'Eşitdiyini yaz', prompt: 'Eşitdiyin sözü yaz.',
      audio: 'Bye!', placeholder: 'Eşitdiyin sözü yaz', rule: { answers: ['Bye'], exact: true },
      hint: 'Yavaş dinlə və eşitdiyin sözü olduğu kimi yaz.',
      variants: [
        { match: { words: ['goodbye', 'good bye'] }, short: 'Goodbye da sağollaşmadır, amma səsdə Bye deyilir.', explain: {
          answers: 'Bye!', reason: 'Səsdə Goodbye yox, Bye deyilir.',
          rule: 'Eşitdiyini yazmaq tapşırığında səslənən sözü yaz.', example: 'Başqa səsdə “Goodbye!” eşidirsənsə, “Goodbye” yazırsan.' } },
        { match: { words: ['hello', 'hi'] }, explain: {
          answers: 'Bye!', reason: 'Səsdə Bye deyilir, Hello və Hi yox.',
          rule: 'Səsdə eşitdiyin sözü yaz.', example: '“Hello!” eşidirsənsə, “Hello” yazırsan.' } },
        { match: { other: true }, explain: {
          answers: 'Bye!', reason: 'Yazdığın söz səsdəki Bye deyil.',
          rule: 'Səslənən sözü yaz.', example: '“Hi!” eşidəndə “Hi” yazılır.' } },
      ],
      review: { why: 'Səsdə Goodbye deyildi.',
        title: 'Eşitdiyini yaz', prompt: 'Eşitdiyin sözü yaz.', audio: 'Goodbye!', placeholder: 'Eşitdiyin sözü yaz',
        rule: { answers: ['Goodbye'], exact: true }, hint: 'Yavaş dinlə və eşitdiyin sözü olduğu kimi yaz.',
        variants: [
          { match: { words: ['bye'] }, short: 'Bye də sağollaşmadır, amma səsdə Goodbye deyilir.', explain: {
            answers: 'Goodbye!', reason: 'Bu səsdə Bye deyil, Goodbye deyilir.', rule: 'Səslənən sözü yaz.', example: '“Hi!” eşidəndə “Hi” yazılır.' } },
          { match: { words: ['hello', 'hi'] }, explain: {
            answers: 'Goodbye!', reason: 'Səsdə Goodbye deyilir, Hello və Hi yox.',
            rule: 'Səsdə eşitdiyin sözü yaz.', example: '“Hello!” eşidirsənsə, “Hello” yazırsan.' } },
          { match: { other: true }, explain: {
            answers: 'Goodbye!', reason: 'Yazdığın söz səsdəki Goodbye deyil.',
            rule: 'Səslənən sözü yaz.', example: '“Hi!” eşidəndə “Hi” yazılır.' } },
        ],
      },
    },
    {
      // New (26 Nov 2026, lesson split): listening, the farewell side of card 3.
      type: 'choice', id: 'd1_c16', why: 'Bye sağollaşmadır — tanışın sağollaşır.', number: 0, title: 'Dinlə və anla', prompt: 'Səsi dinlə. Tanışın nə edir?',
      audio: 'Bye!', options: ['Salam verir.', 'Sağollaşır.', 'Təşəkkür edir.'], answer: 'Sağollaşır.',
      hint: 'Bu söz görüş başlayanda deyilir, yoxsa bitəndə?', hintAssists: true,
      variants: [{ match: { option: 'Salam verir.' }, short: 'Bye salam deyil, sağollaşmadır.', explain: {
        answers: 'Sağollaşır.', reason: 'Səsdə “Bye!” deyilir — bu, salam yox, sağollaşmadır.',
        rule: 'Goodbye və Bye sağollaşmaq üçün işlənir.', example: 'Tanışın gedir və “Goodbye!” deyir. O, sağollaşır.' } },
      { match: { other: true }, short: 'Bye görüşü bitirir. Bu səsdə tanışın sağollaşır.', explain: {
        answers: 'Sağollaşır.', reason: 'Səsdə “Bye!” deyilir — bu, təşəkkür yox, sağollaşmadır.',
        rule: 'Goodbye və Bye sağollaşmaq üçün işlənir.', example: 'Tanışın gedir və “Goodbye!” deyir. O, sağollaşır.' } }],
      review: { why: 'Goodbye sağollaşmadır — qonşun sağollaşır.',
        title: 'Dinlə və anla', prompt: 'Səsi dinlə. Qonşun nə edir?', audio: 'Goodbye!', options: ['Sağollaşır.', 'Təşəkkür edir.', 'Salam verir.'], answer: 'Sağollaşır.',
        hint: 'Bu söz görüş başlayanda deyilir, yoxsa bitəndə?', hintAssists: true,
        variants: [{ match: { option: 'Salam verir.' }, short: 'Goodbye salam deyil, sağollaşmadır.', explain: {
          answers: 'Sağollaşır.', reason: 'Səsdə “Goodbye!” deyilir — bu, salam yox, sağollaşmadır.',
          rule: 'Goodbye və Bye sağollaşmaq üçün işlənir.', example: 'Qonşun gedir və “Bye!” deyir. O, sağollaşır.' } },
        { match: { other: true }, short: 'Goodbye görüşü bitirir. Bu səsdə qonşun sağollaşır.', explain: {
          answers: 'Sağollaşır.', reason: 'Səsdə “Goodbye!” deyilir — bu, təşəkkür yox, sağollaşmadır.',
          rule: 'Goodbye və Bye sağollaşmaq üçün işlənir.', example: 'Qonşun gedir və “Bye!” deyir. O, sağollaşır.' } }],
      },
    },
    {
      type: 'voice', id: 'd1_c08', why: 'Sağollaşmaya sağollaşma ilə cavab verdin.', hint: 'Gedən adama sağollaşma ilə cavab ver.', speaker: 'mascot', number: 9, title: 'Sağollaşmaya səslə cavab ver', prompt: '{M} səninlə sağollaşır.\nSən də səslə sağollaş.',
      audio: 'Goodbye!', rule: farewell,
      variants: [
        { match: { goal: 'greet' }, short: 'Bu ifadə salamlaşmaq üçündür. {M} isə səninlə sağollaşır.', explain: {
          answers: 'səslə Goodbye! / Bye!', reason: 'Hello və Hi görüşü başladır, {m} isə səninlə sağollaşır.',
          rule: 'Sağollaşmaya sağollaşma ilə cavab ver.', example: 'Qarşı tərəf “Bye!” deyir. Sən “Goodbye!” deyirsən.' } },
        { match: { other: true }, explain: {
          answers: 'səslə Goodbye! / Bye!', reason: 'Bu cavab sağollaşmaya sağollaşma ilə qarşılıq vermir.',
          rule: 'Görüş bitəndə sağollaşma ifadəsi işlət.', example: 'Tanışın “Goodbye!” deyir. Sən “Bye!” deyirsən.' } },
      ],
      review: {
        speaker: 'mascot', title: 'Sağollaşmaya səslə cavab ver', hint: 'Gedən adama sağollaşma ilə cavab ver.', prompt: '{M} gedir və “Bye!” deyir.\nSən də səslə sağollaş.', audio: 'Bye!', rule: farewell,
        variants: [
          { match: { goal: 'greet' }, short: 'Bu ifadə salamlaşmaq üçündür. {M} isə səninlə sağollaşır.', explain: {
            answers: 'səslə Goodbye! / Bye!', reason: 'Hello və Hi görüşü başladır, {m} isə səninlə sağollaşır.',
            rule: 'Sağollaşmaya sağollaşma ilə cavab ver.', example: 'Qarşı tərəf “Bye!” deyir. Sən “Goodbye!” deyirsən.' } },
          { match: { other: true }, explain: {
            answers: 'səslə Goodbye! / Bye!', reason: 'Bu cavab sağollaşmaya sağollaşma ilə qarşılıq vermir.',
            rule: 'Görüş bitəndə sağollaşma ifadəsi işlət.', example: 'Tanışın “Goodbye!” deyir. Sən “Bye!” deyirsən.' } },
        ],
      },
    },
    {
      // New (26 Nov 2026, lesson split): a farewell in a chat.
      type: 'write', chat: { partner: 'Tanışın', from: 'B', lines: [{ from: 'B', text: 'Bye!' }], reply: '👋' }, id: 'd1_c15', why: 'Sağollaşmaya sağollaşma ilə cavab verdin.', number: 0, title: 'Sağollaşmanı özün yaz',
      prompt: 'Tanışın yazışmanın sonunda yazır: “Bye!”\nSən də mesajla sağollaş.', placeholder: 'Cavabını yaz', rule: farewell,
      hint: 'Dərsin sağollaşma sözlərindən birini yaz.',
      variants: [
        { match: { goal: 'greet' }, short: 'Bu ifadə salamlaşmaq üçündür. Burada sağollaşmaq lazımdır.', explain: {
          answers: 'Goodbye! / Bye!', reason: 'Yazdığın söz salamdır, tanışın isə yazışmanı bitirir.',
          rule: 'Sağollaşmaya sağollaşma ilə cavab ver.', example: 'Tanışın “Bye!” yazır. Sən “Goodbye!” yazırsan.' } },
        { match: { other: true }, short: 'Burada qarşı tərəfə ingiliscə sağollaşma yazmaq lazımdır.', explain: {
          answers: 'Goodbye! / Bye!', reason: 'Yazdığın söz sağollaşma deyil.',
          rule: 'Görüş bitəndə sağollaşma ifadəsi işlət.', example: 'Tanışın “Goodbye!” yazır. Sən “Bye!” yazırsan.' } },
      ],
      review: { chat: { partner: 'Qonşun', from: 'G', lines: [{ from: 'G', text: 'Goodbye!' }] },
        title: 'Sağollaşmanı özün yaz', prompt: 'Qonşun yazışmanın sonunda yazır: “Goodbye!”\nSən də mesajla sağollaş.', placeholder: 'Cavabını yaz', rule: farewell,
        hint: 'Dərsin sağollaşma sözlərindən birini yaz.',
        variants: [
          { match: { goal: 'greet' }, short: 'Bu ifadə salamlaşmaq üçündür. Burada sağollaşmaq lazımdır.', explain: {
            answers: 'Goodbye! / Bye!', reason: 'Yazdığın söz salamdır, qonşun isə yazışmanı bitirir.',
            rule: 'Sağollaşmaya sağollaşma ilə cavab ver.', example: 'Qonşun “Goodbye!” yazır. Sən “Bye!” yazırsan.' } },
          { match: { other: true }, short: 'Burada qarşı tərəfə ingiliscə sağollaşma yazmaq lazımdır.', explain: {
            answers: 'Goodbye! / Bye!', reason: 'Yazdığın söz sağollaşma deyil.',
            rule: 'Görüş bitəndə sağollaşma ifadəsi işlət.', example: 'Qonşun “Goodbye!” yazır. Sən “Bye!” yazırsan.' } },
        ],
      },
    },
    {
      type: 'write', id: 'd1_c09', why: '{B} gedir — ona Bye və ya Goodbye yaraşır.', scenes: ['d1/boy-leaving'], number: 10, title: '{B:dat} kömək et', prompt: '{B} görüşü bitirib gedir, amma “Hello!” deyir.\nOnun yerinə uyğun sağollaşma yaz.',
      placeholder: 'Uyğun ifadəni yaz', rule: farewell, hint: 'Gedən adam salam verir, yoxsa sağollaşır?',
      variants: [
        { match: { goal: 'greet' }, short: 'Bu ifadə salamlaşmaq üçündür. Burada görüş bitir və sağollaşmaq lazımdır.', explain: {
          answers: 'Goodbye! / Bye!', reason: '{B} gedir, salam isə görüşü bitirmir.',
          rule: 'Görüşün sonunda sağollaş.', example: 'Tanışınla söhbəti bitirirsən: “Bye!”' } },
        { match: { other: true }, explain: {
          answers: 'Goodbye! / Bye!', reason: 'Yazdığın söz sağollaşma deyil.',
          rule: 'İfadəni vəziyyətin başlanmasına və ya bitməsinə uyğun seç.', example: '{B} qapıdan çıxarkən “Goodbye!” deyir.' } },
      ],
      review: {
        scenes: ['d1/boy-party-leaving'], title: '{B:dat} kömək et', prompt: '{B} qonaqlıqdan gedir, amma “Hi!” deyir. Onun yerinə uyğun sağollaşma yaz.', placeholder: 'Uyğun ifadəni yaz', rule: farewell,
        hint: 'Gedən adam salam verir, yoxsa sağollaşır?',
        variants: [
          { match: { goal: 'greet' }, short: 'Bu ifadə salamlaşmaq üçündür. Burada görüş bitir və sağollaşmaq lazımdır.', explain: {
            answers: 'Goodbye! / Bye!', reason: '{B} gedir, salam isə görüşü bitirmir.',
            rule: 'Görüşün sonunda sağollaş.', example: 'Tanışınla söhbəti bitirirsən: “Bye!”' } },
          { match: { other: true }, explain: {
            answers: 'Goodbye! / Bye!', reason: 'Yazdığın söz sağollaşma deyil.',
            rule: 'İfadəni vəziyyətin başlanmasına və ya bitməsinə uyğun seç.', example: '{B} qapıdan çıxarkən “Goodbye!” deyir.' } },
        ],
      },
    },
    {
      type: 'two', id: 'd1_c10', why: 'Əvvəldə salam, sonda sağollaşma.', number: 11, title: 'İki mesajı özün yaz',
      prompt: 'Bu gün tanışınla görüşəcəksən.\nİki qısa mesaj yaz.',
      hint: 'Birinci mesajda görüş başlayır, ikincidə bitir.',
      thread: { partner: 'Tanışın', from: 'B', lines: [{ from: 'B', text: '👋' }], pills: ['14:00 · Görüşdən əvvəl', '☕ Görüş bitdi · 16:30'], replies: ['😊', '👋'] },
      fields: [
        { id: 'd1_c10a', label: 'Görüşdən əvvəl', placeholder: 'Salamını yaz', rule: greet, purpose: 'salam vermək', empty: 'Birinci mesajı da yaz.' },
        { id: 'd1_c10b', label: 'Görüşdən sonra', placeholder: 'Sağollaşmanı yaz', rule: farewell, purpose: 'sağollaşmaq', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: twoVariants,
      review: {
        scenes: ['d1/video-start', 'd1/video-end'], title: 'İki mesajı özün yaz', prompt: 'Qısa video zəngin var. Zəngdən əvvəl çatda salam, zəngdən sonra sağollaşma mesajı yaz.',
        hint: 'Birinci mesajda zəng başlayır, ikincidə bitir.',
        thread: { partner: 'Tanışın', from: 'B', lines: [{ from: 'B', text: '👋' }], pills: ['19:00 · Zəngdən əvvəl', '📹 Zəng bitdi · 19:20'], replies: ['😊', '👋'] },
        fields: [
          { id: 'd1_c10a', label: 'Görüşdən əvvəl', placeholder: 'Salamını yaz', rule: greet, purpose: 'salam vermək', empty: 'Birinci mesajı da yaz.' },
          { id: 'd1_c10b', label: 'Görüşdən sonra', placeholder: 'Sağollaşmanı yaz', rule: farewell, purpose: 'sağollaşmaq', empty: 'İkinci mesajı da yaz.' },
        ],
        variants: twoVariants, // T8 uses the same explanations as card 10
      },
    },
    {
      type: 'voice', id: 'd1_c11b', why: 'Görüşü sağollaşma ilə özün bitirdin.', hint: 'Ayrılarkən nə deyirsən?', speaker: 'mascot', number: 13, title: 'Sağollaşmanı sən başlat', prompt: 'Bir az sonra görüş bitir.\n{M:abl} ayrılırsan, sağollaş.',
      rule: farewell, reply: 'Bye!',
      variants: [
        { match: { goal: 'greet' }, explain: {
          answers: 'səslə Goodbye! / Bye!', reason: 'Görüş bitir, salam isə yeni görüşü başladır.',
          rule: 'Ayrılarkən sağollaşmanı başlat.', example: '{M:abl} ayrılırsan: “Goodbye!”' } },
        { match: { other: true }, explain: {
          answers: 'səslə Goodbye! / Bye!', reason: 'Dediyin söz sağollaşma deyil.',
          rule: 'Görüşü sağollaşma ilə bitir.', example: 'Getməzdən əvvəl “Bye!” deyirsən.' } },
      ],
      review: {
        speaker: 'mascot', title: 'Sağollaşmanı sən başlat', hint: 'Ayrılarkən nə deyirsən?', prompt: 'Yeni görüşünüz bitir. {M:abl} ayrılarkən sağollaş.', rule: farewell, reply: 'Goodbye!',
        variants: [
          { match: { goal: 'greet' }, explain: {
            answers: 'səslə Goodbye! / Bye!', reason: 'Görüş bitir, salam isə yeni görüşü başladır.',
            rule: 'Ayrılarkən sağollaşmanı başlat.', example: '{M:abl} ayrılırsan: “Goodbye!”' } },
          { match: { other: true }, explain: {
            answers: 'səslə Goodbye! / Bye!', reason: 'Dediyin söz sağollaşma deyil.',
            rule: 'Görüşü sağollaşma ilə bitir.', example: 'Getməzdən əvvəl “Bye!” deyirsən.' } },
        ],
      },
    },
  ],
  result: {
    done: ['Əhsən! Dərs 1-in 2-ci hissəsini tamamladın.', 'İndi hansı hissələri özün etdiyinə, hansılarda dəstək aldığına baxaq.'],
    incomplete: 'Dərs tamamlanmayıb. Qaldığın yerdən davam et.',
    technical: 'Bu hissə texniki səbəbdən mətnlə məşq edildi. Dinləmə yoxlanmadı.',
    unverified: 'Bu hissədə cavabın qiymətləndirilmədi. Nəticə: Yoxlanmadı.',
    goals: [
      { group: 'Dinləmə', text: 'Sağollaşma səsinin mənasını tanımaq.', tasks: ['d1_c16'] },
      { group: 'Dinləmə', text: 'Eşidilən sağollaşma sözünü dəqiq müəyyən edib yazmaq.', tasks: ['d1_c07b'] },
      { group: 'Oxu', text: 'Yazılı ifadəni görüşün bitməsinə uyğun seçmək.', tasks: ['d1_c07a'] },
      { group: 'Yazı', text: 'Sağollaşmaya mesajla cavab vermək.', tasks: ['d1_c15'] },
      { group: 'Yazı', text: 'Uyğunsuz salamı sağollaşma ilə əvəz etmək.', tasks: ['d1_c09'] },
      { group: 'Yazı', text: 'Görüşün başlanğıcı üçün mesaj yazmaq.', tasks: ['d1_c10a'] },
      { group: 'Yazı', text: 'Görüşün sonu üçün mesaj yazmaq.', tasks: ['d1_c10b'] },
      { group: 'Danışıq', text: 'Sağollaşmaya səslə cavab vermək.', tasks: ['d1_c08'] },
      { group: 'Danışıq', text: 'Sağollaşmanı özün başlatmaq.', tasks: ['d1_c11b'] },
    ],
    closing: 'Növbəti dərsdə bu ifadələri yeni vəziyyətlərdə istifadə edəcəyik.',
    button: 'Bölməyə qayıt',
  },
  vocabulary: [
    { word: 'Goodbye', translation: 'Görüşənədək', example: 'Goodbye{en,G}!', exampleAz: 'Görüşənədək{,G}!', usageNote: 'Goodbye burada ayrılma mənasındadır.', pronunciation: '/ˌɡʊdˈbaɪ/', teachCard: 'd1_c06' },
    { word: 'Bye', translation: 'Hələlik', example: 'Bye{en,B}!', exampleAz: 'Hələlik{,B}!', usageNote: 'Bye daha qeyri-rəsmi sağollaşmadır.', pronunciation: '/baɪ/', teachCard: 'd1_c06' },
  ],
};
