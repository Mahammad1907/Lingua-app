// Dərs 1 — Salamlaşma və sağollaşma.
// Source: docs/BirTalk_Ders_1_Yekun.md (yekun variant, 24 oktyabr 2026). The learner-facing
// text is copied from that document; do not rewrite it here. Name tokens such as {M} come
// from src/config/characters.ts (see withNames).
import type { DesignLesson, Variant } from './designLessonTypes';

const greet = { answers: ['Hello!', 'Hi!'], goals: ['greet' as const] };
const farewell = { answers: ['Goodbye!', 'Bye!'], goals: ['farewell' as const] };
const twoVariants: Variant[] = [
        { match: { swapped: true }, explain: {
          answers: 'Əvvəl Hello! / Hi!; sonda Goodbye! / Bye!', reason: 'Sağollaşmanı başlanğıcda, salamı isə sonda yazmısan. Hər ifadənin uyğun vaxtı fərqlidir.',
          rule: 'Salam görüşü başladır; sağollaşma bitirir.', example: 'Başlanğıc: “Hi!” Son: “Bye!”' } },
        { field: 'd1_c10a', match: { goal: 'farewell' }, explain: {
          answers: 'Hello! / Hi!', reason: 'Bu sahə görüşün başlanğıcı üçündür; yazdığın sağollaşma görüşü bitirir.',
          rule: 'Əvvəl salam ver, ayrılarkən sağollaş.', example: 'Görüş başlayır: “Hello!” Görüş bitir: “Bye!”' } },
        { field: 'd1_c10b', match: { goal: 'greet' }, short: 'Birinci mesaj uyğundur. İkinci mesajda görüşü bitirən ifadə lazımdır.', explain: {
          answers: 'Goodbye! / Bye!', reason: 'İkinci sahədə artıq ayrılırsan. Hello və Hi görüşün başlanğıcına uyğundur.',
          rule: 'Görüşün sonunda sağollaşma yaz.', example: 'Söhbət bitir: “Goodbye!”' } },
        { match: { other: true }, explain: {
          answers: 'Başlanğıc üçün Hello! / Hi!; son üçün Goodbye! / Bye!', reason: 'Bu sahədə {purpose} tələb olunur. Cavab həmin məqsədi yerinə yetirmir.',
          rule: 'Hər mesajı görüşün həmin anına uyğun yaz.', example: 'Əvvəl “Hello!”, ayrılarkən “Goodbye!”' } },
      ];

export const lesson1Design: DesignLesson = {
  id: 'a1_en_b1_v2_d1', order: 1, title: 'Salamlaşma və sağollaşma', section: 'İlk tanışlıq',
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
      goals: [{ icon: 'wave', text: 'Salam verməyi' }, { icon: 'chat', text: 'Salama cavab verməyi' }, { icon: 'bye', text: 'Sağollaşmağı məşq edəcəksən' }],
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
      hint: 'Bir də dinlə. Bu söz görüş başlayanda deyilir, yoxsa bitəndə?', hintAssists: true,
      variants: [{ match: { option: 'Təşəkkür edir.' }, short: 'Hi təşəkkür deyil, salamdır. Bu səsdə {m} salam verir.', explain: {
        answers: 'Salam verir.', reason: 'Səsdə “Hi!” deyilir. Bu, təşəkkür yox, salamdır.',
        rule: 'Hello və Hi salam vermək üçün işlənir.', example: 'Bir tanışın səninlə qarşılaşır və “Hello!” deyir. O, salam verir.' } },
      { match: { other: true }, short: 'Hi salamlaşmaq üçündür. Bu səsdə {m} salam verir.', explain: {
        answers: 'Salam verir.', reason: 'Səsdə “Hi!” deyilir. “Sağollaşır” seçimi bu salamın mənasına uyğun deyil.',
        rule: 'Hello və Hi salam vermək üçün işlənir.', example: 'Bir tanışın səninlə qarşılaşır və “Hello!” deyir. O, salam verir.' } }],
      review: { why: 'Hello salamdır — danışan salam verir.',
        title: 'Dinlə və anla', prompt: 'Dinlə. Danışan nə edir?', audio: 'Hello!', options: ['Sağollaşır.', 'Təşəkkür edir.', 'Salam verir.'], answer: 'Salam verir.',
        hint: 'Bir də dinlə. Bu söz görüş başlayanda deyilir, yoxsa bitəndə?', hintAssists: true,
        variants: [{ match: { option: 'Təşəkkür edir.' }, short: 'Hello təşəkkür deyil, salamdır. Bu səsdə danışan salam verir.', explain: {
          answers: 'Salam verir.', reason: 'Səsdə “Hello!” deyilir. Bu, təşəkkür yox, salamdır.',
          rule: 'Hello və Hi salam vermək üçün işlənir.', example: '“Hi!” — salam verir.' } },
        { match: { other: true }, short: 'Hello salamlaşmaq üçündür. Bu səsdə danışan salam verir.', explain: {
          answers: 'Salam verir.', reason: 'Səsdə “Hello!” deyilir. “Sağollaşır” seçimi bu salamın mənasına uyğun deyil.',
          rule: 'Hello və Hi salam vermək üçün işlənir.', example: '“Hi!” — salam verir.' } }],
      },
    },
    {
      type: 'write', chat: { partner: 'Tanışın', from: 'G', lines: [] }, id: 'd1_c04', why: 'Hello və Hi görüşü başladır.', scenes: ['d1/meet-street'], number: 4, title: 'Salamı özün yaz', prompt: 'Tanışınla qarşılaşdın.\nOna ingiliscə qısa salam yaz.',
      placeholder: 'Cavabını yaz', rule: greet, hint: 'Bu dərsin əvvəlində iki salam sözü öyrəndin. Onlardan birini yaz.',
      variants: [
        { match: { goal: 'farewell' }, short: 'Bu ifadə sağollaşmaq üçündür. Burada salam vermək lazımdır.', explain: {
          answers: 'Hello! / Hi!', reason: 'Bye və Goodbye görüşü bitirir. Bu vəziyyətdə isə tanışınla yeni qarşılaşmısan.',
          rule: 'Görüşü salamla başlat.', example: 'Tanışını məktəbin qarşısında görürsən: “Hi!”' } },
        { match: { other: true }, short: 'Burada qarşı tərəfə ingiliscə salam yazmaq lazımdır.', explain: {
          answers: 'Hello! / Hi!', reason: 'Bu cavabın salamlaşma məqsədini yerinə yetirdiyi müəyyən edilmədi.',
          rule: 'Cavab qarşı tərəfə salam verməlidir.', example: 'Qonşunla qarşılaşırsan: “Hello!”' } },
      ],
      review: { chat: { partner: 'Tanışın', from: 'B', lines: [] },
        scenes: ['d1/meet-yard'], title: 'Salamı özün yaz', prompt: 'Həyətdə tanışınla qarşılaşdın. Ona ingiliscə salam yaz.', placeholder: 'Cavabını yaz', rule: greet,
        hint: 'Bu dərsin əvvəlində iki salam sözü öyrəndin. Onlardan birini yaz.',
        variants: [
          { match: { goal: 'farewell' }, short: 'Bu ifadə sağollaşmaq üçündür. Burada salam vermək lazımdır.', explain: {
            answers: 'Hello! / Hi!', reason: 'Bye və Goodbye görüşü bitirir. Bu vəziyyətdə isə tanışınla yeni qarşılaşmısan.',
            rule: 'Görüşü salamla başlat.', example: '“Hello!” ilə salamlaş.' } },
          { match: { other: true }, short: 'Burada qarşı tərəfə ingiliscə salam yazmaq lazımdır.', explain: {
            answers: 'Hello! / Hi!', reason: 'Bu cavabın salamlaşma məqsədini yerinə yetirdiyi müəyyən edilmədi.',
            rule: 'Cavab qarşı tərəfə salam verməlidir.', example: '“Hello!” ilə salamlaş.' } },
        ],
      },
    },
    {
      type: 'voice', id: 'd1_c05', why: 'Salama salamla cavab verdin.', hint: 'Sənə salam verdilər. Sən də salamla cavab ver.', speaker: 'mascot', number: 5, title: 'Salama səslə cavab ver', prompt: '{M} sənə salam verir. Səslə cavab ver.',
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
        speaker: 'mascot', title: 'Salama səslə cavab ver', hint: 'Sənə salam verdilər. Sən də salamla cavab ver.', prompt: 'Salamına səslə cavab ver.', audio: 'Hi!', rule: { answers: ['Hello!', 'Hi!'], goals: ['greet'] },
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
      type: 'word', id: 'd1_c06', number: 6, scenes: ['d1/word-goodbye'], structure: ['Goodbye!', 'Bye, [ad]!'],
      word: 'Goodbye! · Bye!', pronunciation: '/ˌɡʊdˈbaɪ/ · /baɪ/', reading: 'qudbay · bay', az: 'Görüşənədək! · Hələlik!',
      notes: ['Görüş bitəndə deyilir. Bye daha qeyri-rəsmidir.'],
      example: 'Bye{en,B}!', exampleAz: 'Hələlik{,B}!',
    },
    {
      type: 'choice', id: 'd1_c07a', scenes: ['d1/cafe-door-scene'], why: 'Goodbye görüşü bitirir.', number: 7, title: 'Oxu və seç', prompt: 'Görüş bitdi. İndi gedirsən.\nHansı ifadə uyğundur?',
      options: ['Hello!', 'Goodbye!', 'Hi!'], answer: 'Goodbye!',
      hint: 'Görüş bitir. Seçimlərdən hansı görüşü bitirir, hansı başladır?', hintAssists: true,
      variants: [{ match: { option: 'Hi!' }, explain: {
        answers: 'Bu seçimlərdə Goodbye! Sərbəst sağollaşmada Bye! də uyğundur.', reason: 'Hi salamlaşmaq üçündür. Burada görüş bitir.',
        rule: 'Ayrılarkən sağollaşma ifadəsi seç.', example: 'Söhbətin sonunda tanışından ayrılırsan: “Bye!”' } },
      { match: { other: true }, explain: {
        answers: 'Bu seçimlərdə Goodbye! Sərbəst sağollaşmada Bye! də uyğundur.', reason: 'Hello salamlaşmaq üçündür. Burada görüş bitir.',
        rule: 'Ayrılarkən sağollaşma ifadəsi seç.', example: 'Söhbətin sonunda tanışından ayrılırsan: “Bye!”' } }],
      review: { why: 'Bye görüşü bitirir.',
        title: 'Oxu və seç', prompt: 'Yazışmanız bitir. Hansı mesaj uyğundur?', options: ['Hi!', 'Bye!', 'Hello!'], answer: 'Bye!',
        hint: 'Görüş bitir. Seçimlərdən hansı görüşü bitirir, hansı başladır?', hintAssists: true,
        variants: [{ match: { option: 'Hello!' }, explain: {
          answers: 'Bye!', reason: 'Yazışma bitir. Hello salamlaşmaq üçündür.', rule: 'Ayrılarkən sağollaş.', example: '“Goodbye!”' } },
        { match: { other: true }, explain: {
          answers: 'Bye!', reason: 'Yazışma bitir. Hi salamlaşmaq üçündür.', rule: 'Ayrılarkən sağollaş.', example: '“Goodbye!”' } }],
      },
    },
    {
      type: 'write', id: 'd1_c07b', why: 'Səsdə Bye deyildi.', number: 7, title: 'Eşitdiyini yaz', prompt: 'Səsi dinlə və eşitdiyin sözü yaz.',
      audio: 'Bye!', placeholder: 'Eşitdiyin sözü yaz', rule: { answers: ['Bye'], exact: true },
      hint: '“Yavaş dinlə” ilə bir də qulaq as. Eyni mənalı başqa sözü yox, məhz eşitdiyini yaz.',
      variants: [
        { match: { words: ['goodbye', 'good bye'] }, short: 'Goodbye da sağollaşmadır. Bu səsdə isə Bye deyilir. Burada eşitdiyin sözü yazmaq tələb olunur.', explain: {
          answers: 'Bye!', reason: 'Goodbye mənaca uyğundur, amma audio məhz Bye sözüdür. Bu tapşırıq eynimənalı başqa ifadə seçməyi yoxlamır.',
          rule: 'Eşitdiyini yazmaq tapşırığında səslənən sözü yaz.', example: 'Başqa səsdə “Goodbye!” eşidirsənsə, “Goodbye” yazırsan.' } },
        { match: { words: ['hello', 'hi'] }, explain: {
          answers: 'Bye!', reason: 'Audio Bye sözüdür. Hello və Hi başqa səslənən salamlaşma sözləridir.',
          rule: 'Audioda eşitdiyin sözü yaz.', example: '“Hello!” eşidirsənsə, “Hello” yazırsan.' } },
        { match: { other: true }, explain: {
          answers: 'Bye!', reason: 'Yazdığın söz audiodakı Bye sözü deyil.',
          rule: 'Səslənən sözü yaz.', example: '“Hi!” eşidəndə “Hi” yazılır.' } },
      ],
      review: { why: 'Səsdə Goodbye deyildi.',
        title: 'Eşitdiyini yaz', prompt: 'Səsi dinlə və eşitdiyin sözü yaz.', audio: 'Goodbye!', placeholder: 'Eşitdiyin sözü yaz',
        rule: { answers: ['Goodbye'], exact: true }, hint: '“Yavaş dinlə” ilə bir də qulaq as. Eyni mənalı başqa sözü yox, məhz eşitdiyini yaz.',
        variants: [
          { match: { words: ['bye'] }, short: 'Bye də sağollaşmadır. Bu səsdə isə Goodbye deyilir. Burada eşitdiyin sözü yazmaq tələb olunur.', explain: {
            answers: 'Goodbye!', reason: 'Bu səsdə Bye deyil, Goodbye deyilir.', rule: 'Səslənən sözü yaz.', example: '“Hi!” eşidəndə “Hi” yazılır.' } },
          { match: { words: ['hello', 'hi'] }, explain: {
            answers: 'Goodbye!', reason: 'Audio Goodbye sözüdür. Hello və Hi başqa səslənən salamlaşma sözləridir.',
            rule: 'Audioda eşitdiyin sözü yaz.', example: '“Hello!” eşidirsənsə, “Hello” yazırsan.' } },
          { match: { other: true }, explain: {
            answers: 'Goodbye!', reason: 'Yazdığın söz audiodakı Goodbye sözü deyil.',
            rule: 'Səslənən sözü yaz.', example: '“Hi!” eşidəndə “Hi” yazılır.' } },
        ],
      },
    },
    {
      type: 'voice', id: 'd1_c08', why: 'Sağollaşmaya sağollaşma ilə cavab verdin.', hint: 'Dostun gedir. Sən də sağollaşma sözlərindən birini de.', speaker: 'mascot', number: 8, title: 'Sağollaşmaya səslə cavab ver', prompt: '{M} səninlə sağollaşır.\nSən də səslə sağollaş.',
      audio: 'Goodbye!', rule: farewell,
      variants: [
        { match: { goal: 'greet' }, short: 'Bu ifadə salamlaşmaq üçündür. {M} isə səninlə sağollaşır.', explain: {
          answers: 'səslə Goodbye! / Bye!', reason: 'Hello və Hi görüşü başlatmaq üçündür. Bu növbədə isə sağollaşmaya qarşılıq verilir.',
          rule: 'Sağollaşmaya sağollaşma ilə cavab ver.', example: 'Qarşı tərəf “Bye!” deyir. Sən “Goodbye!” deyirsən.' } },
        { match: { other: true }, explain: {
          answers: 'səslə Goodbye! / Bye!', reason: 'Bu cavab görüşü bitirən qarşılıq vermir.',
          rule: 'Görüş bitəndə sağollaşma ifadəsi işlət.', example: 'Tanışın “Goodbye!” deyir. Sən “Bye!” deyirsən.' } },
      ],
      review: {
        speaker: 'mascot', title: 'Sağollaşmaya səslə cavab ver', hint: 'Dostun gedir. Sən də sağollaşma sözlərindən birini de.', prompt: 'Sən də səslə sağollaş.', audio: 'Bye!', rule: farewell,
        variants: [
          { match: { goal: 'greet' }, short: 'Bu ifadə salamlaşmaq üçündür. {M} isə səninlə sağollaşır.', explain: {
            answers: 'səslə Goodbye! / Bye!', reason: 'Hello və Hi görüşü başlatmaq üçündür. Bu növbədə isə sağollaşmaya qarşılıq verilir.',
            rule: 'Sağollaşmaya sağollaşma ilə cavab ver.', example: 'Qarşı tərəf “Bye!” deyir. Sən “Goodbye!” deyirsən.' } },
          { match: { other: true }, explain: {
            answers: 'səslə Goodbye! / Bye!', reason: 'Bu cavab görüşü bitirən qarşılıq vermir.',
            rule: 'Görüş bitəndə sağollaşma ifadəsi işlət.', example: 'Tanışın “Goodbye!” deyir. Sən “Bye!” deyirsən.' } },
        ],
      },
    },
    {
      type: 'write', id: 'd1_c09', why: '{M} gedir — ona Bye və ya Goodbye yaraşır.', scenes: ['d1/mascot-leaving'], speaker: 'mascot', number: 9, title: '{M:dat} kömək et', prompt: '{M} görüşü bitirib gedir, amma “Hello!” deyir.\nOnun yerinə uyğun sağollaşma yaz.',
      placeholder: 'Uyğun ifadəni yaz', rule: farewell, hint: '{M} gedir. Gedən adam salam verir, yoxsa sağollaşır?',
      variants: [
        { match: { goal: 'greet' }, short: 'Bu ifadə salamlaşmaq üçündür. Burada görüş bitir və sağollaşmaq lazımdır.', explain: {
          answers: 'Goodbye! / Bye!', reason: '{M} gedir. Yazdığın salam görüşü bitirən ifadəni əvəz etmir.',
          rule: 'Görüşün sonunda sağollaş.', example: 'Tanışınla söhbəti bitirirsən: “Bye!”' } },
        { match: { other: true }, explain: {
          answers: 'Goodbye! / Bye!', reason: 'Tapşırıqda Hello əvəzinə görüşü bitirən ifadə tələb olunur. Bu cavab həmin dəyişikliklə uyğunlaşmır.',
          rule: 'İfadəni vəziyyətin başlanmasına və ya bitməsinə uyğun seç.', example: '{M} qapıdan çıxarkən “Goodbye!” deyir.' } },
      ],
      review: {
        speaker: 'mascot', scenes: ['d1/mascot-party-leaving'], title: '{M:dat} kömək et', prompt: '{M} qonaqlıqdan gedir, amma “Hi!” deyir. Uyğun sağollaşma yaz.', placeholder: 'Uyğun ifadəni yaz', rule: farewell,
        hint: '{M} gedir. Gedən adam salam verir, yoxsa sağollaşır?',
        variants: [
          { match: { goal: 'greet' }, short: 'Bu ifadə salamlaşmaq üçündür. Burada görüş bitir və sağollaşmaq lazımdır.', explain: {
            answers: 'Goodbye! / Bye!', reason: '{M} gedir. Yazdığın salam görüşü bitirən ifadəni əvəz etmir.',
            rule: 'Görüşün sonunda sağollaş.', example: 'Tanışınla söhbəti bitirirsən: “Bye!”' } },
          { match: { other: true }, explain: {
            answers: 'Goodbye! / Bye!', reason: 'Tapşırıqda Hi əvəzinə görüşü bitirən ifadə tələb olunur. Bu cavab həmin dəyişikliklə uyğunlaşmır.',
            rule: 'İfadəni vəziyyətin başlanmasına və ya bitməsinə uyğun seç.', example: '{M} qapıdan çıxarkən “Goodbye!” deyir.' } },
        ],
      },
    },
    {
      type: 'two', id: 'd1_c10', why: 'Əvvəldə salam, sonda sağollaşma.', scenes: ['d1/visit-start', 'd1/visit-end'], number: 10, title: 'İki mesajı özün yaz',
      prompt: 'Bir tanışınla qısa görüşün var.\nİki qısa mesaj yaz:\n1. Görüşə başlayarkən deyəcəyin salam.\n2. Ayrılarkən deyəcəyin sağollaşma.',
      hint: 'Birinci sahədə görüş başlayır, ikincidə bitir. Hər birinə uyğun sözü yaz.',
      fields: [
        { id: 'd1_c10a', label: 'Görüşün əvvəlində', placeholder: 'Salamını yaz', rule: greet, purpose: 'salam vermək', empty: 'Birinci mesajı da yaz.' },
        { id: 'd1_c10b', label: 'Görüşün sonunda', placeholder: 'Sağollaşmanı yaz', rule: farewell, purpose: 'sağollaşmaq', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: twoVariants,
      review: {
        scenes: ['d1/video-start', 'd1/video-end'], title: 'İki mesajı özün yaz', prompt: 'Qısa video görüşün var. Görüşün əvvəlində salam, sonunda sağollaşma mesajı yaz.',
        hint: 'Birinci sahədə görüş başlayır, ikincidə bitir. Hər birinə uyğun sözü yaz.',
        fields: [
          { id: 'd1_c10a', label: 'Görüşün əvvəlində', placeholder: 'Salamını yaz', rule: greet, purpose: 'salam vermək', empty: 'Birinci mesajı da yaz.' },
          { id: 'd1_c10b', label: 'Görüşün sonunda', placeholder: 'Sağollaşmanı yaz', rule: farewell, purpose: 'sağollaşmaq', empty: 'İkinci mesajı da yaz.' },
        ],
        variants: twoVariants, // T8 uses the same explanations as card 10
      },
    },
    {
      type: 'voice', id: 'd1_c11a', why: 'Görüşü salamla özün başlatdın.', hint: 'Görüş başlayır və ilk sözü sən deyirsən.', speaker: 'mascot', number: 11, title: 'Salamı sən başlat', prompt: '{M} ilə qarşılaşırsan.\nSalamı sən başlat.',
      rule: greet, reply: 'Hi!',
      variants: [
        { match: { goal: 'farewell' }, explain: {
          answers: 'səslə Hello! / Hi!', reason: 'Yeni qarşılaşırsan. Dediyin sağollaşma görüşü bitirir, salamlaşmanı başlatmır.',
          rule: 'Yeni görüşü salamla başlat.', example: '{M:acc} görürsən və “Hello!” deyirsən.' } },
        { match: { other: true }, explain: {
          answers: 'səslə Hello! / Hi!', reason: 'Bu növbənin məqsədi salamı özün başlatmaqdır. Cavab salamlaşmanı başlatmır.',
          rule: 'Qarşı tərəfə salam ifadəsi de.', example: 'Yeni görüşdə əvvəl sən “Hi!” deyirsən.' } },
      ],
      review: {
        speaker: 'mascot', title: 'Salamı sən başlat', hint: 'Görüş başlayır və ilk sözü sən deyirsən.', prompt: 'Yeni gün {m} ilə qarşılaşırsan. Salamı sən başlat.', rule: greet, reply: 'Hello!',
        variants: [
          { match: { goal: 'farewell' }, explain: {
            answers: 'səslə Hello! / Hi!', reason: 'Yeni qarşılaşırsan. Dediyin sağollaşma görüşü bitirir, salamlaşmanı başlatmır.',
            rule: 'Yeni görüşü salamla başlat.', example: '{M:acc} görürsən və “Hello!” deyirsən.' } },
          { match: { other: true }, explain: {
            answers: 'səslə Hello! / Hi!', reason: 'Bu növbənin məqsədi salamı özün başlatmaqdır. Cavab salamlaşmanı başlatmır.',
            rule: 'Qarşı tərəfə salam ifadəsi de.', example: 'Yeni görüşdə əvvəl sən “Hi!” deyirsən.' } },
        ],
      },
    },
    {
      type: 'voice', id: 'd1_c11b', why: 'Görüşü sağollaşma ilə özün bitirdin.', hint: 'Görüş bitir. Ayrılarkən nə deyirsən?', speaker: 'mascot', number: 11, title: 'Sağollaşmanı sən başlat', prompt: 'Bir az sonra görüş bitir.\n{M} ilə sağollaş.',
      rule: farewell, reply: 'Bye!',
      variants: [
        { match: { goal: 'greet' }, explain: {
          answers: 'səslə Goodbye! / Bye!', reason: 'Görüş bitir. Dediyin salam yeni görüşü başlatmaq üçündür.',
          rule: 'Ayrılarkən sağollaşmanı başlat.', example: '{M:abl} ayrılırsan: “Goodbye!”' } },
        { match: { other: true }, explain: {
          answers: 'səslə Goodbye! / Bye!', reason: 'Bu növbədə görüşü bitirən ifadə tələb olunur. Cavab sağollaşmanı yerinə yetirmir.',
          rule: 'Görüşü sağollaşma ilə bitir.', example: 'Getməzdən əvvəl “Bye!” deyirsən.' } },
      ],
      review: {
        speaker: 'mascot', title: 'Sağollaşmanı sən başlat', hint: 'Görüş bitir. Ayrılarkən nə deyirsən?', prompt: 'Yeni görüşünüz bitir. {M} ilə sağollaş.', rule: farewell, reply: 'Goodbye!',
        variants: [
          { match: { goal: 'greet' }, explain: {
            answers: 'səslə Goodbye! / Bye!', reason: 'Görüş bitir. Dediyin salam yeni görüşü başlatmaq üçündür.',
            rule: 'Ayrılarkən sağollaşmanı başlat.', example: '{M:abl} ayrılırsan: “Goodbye!”' } },
          { match: { other: true }, explain: {
            answers: 'səslə Goodbye! / Bye!', reason: 'Bu növbədə görüşü bitirən ifadə tələb olunur. Cavab sağollaşmanı yerinə yetirmir.',
            rule: 'Görüşü sağollaşma ilə bitir.', example: 'Getməzdən əvvəl “Bye!” deyirsən.' } },
        ],
      },
    },
  ],
  result: {
    done: ['Əhsən! Dərs üzrə məşqini tamamladın.', 'İndi hansı hissələri özün etdiyinə, hansılarda dəstək aldığına baxaq.'],
    incomplete: 'Dərs tamamlanmayıb. Qaldığın yerdən davam et.',
    technical: 'Bu hissə texniki səbəbdən mətnlə məşq edildi. Dinləmə yoxlanmadı.',
    unverified: 'Bu hissədə cavabın qiymətləndirilmədi. Nəticə: Yoxlanmadı.',
    goals: [
      { group: 'Dinləmə', text: 'Salam səsinin mənasını tanımaq.', tasks: ['d1_c03'] },
      { group: 'Dinləmə', text: 'Eşidilən sağollaşma sözünü dəqiq müəyyən edib yazmaq.', tasks: ['d1_c07b'] },
      { group: 'Oxu', text: 'Yazılı ifadəni görüşün bitməsinə uyğun seçmək.', tasks: ['d1_c07a'] },
      { group: 'Yazı', text: 'Salamı özün yazmaq.', tasks: ['d1_c04'] },
      { group: 'Yazı', text: 'Uyğunsuz salamı sağollaşma ilə əvəz etmək.', tasks: ['d1_c09'] },
      { group: 'Yazı', text: 'Görüşün başlanğıcı üçün mesaj yazmaq.', tasks: ['d1_c10a'] },
      { group: 'Yazı', text: 'Görüşün sonu üçün mesaj yazmaq.', tasks: ['d1_c10b'] },
      { group: 'Danışıq', text: 'Salama səslə cavab vermək.', tasks: ['d1_c05'] },
      { group: 'Danışıq', text: 'Sağollaşmaya səslə cavab vermək.', tasks: ['d1_c08'] },
      { group: 'Danışıq', text: 'Salamı özün başlatmaq.', tasks: ['d1_c11a'] },
      { group: 'Danışıq', text: 'Sağollaşmanı özün başlatmaq.', tasks: ['d1_c11b'] },
    ],
    closing: 'Növbəti dərsdə bu ifadələri yeni vəziyyətlərdə istifadə edəcəyik.',
    button: 'Bölməyə qayıt',
  },
  vocabulary: [
    { word: 'Hello', translation: 'Salam', example: 'Hello{en,G}!', exampleAz: 'Salam{,G}!', usageNote: 'Hello ümumi salamlaşmadır.', pronunciation: '/həˈloʊ/', teachCard: 'd1_c02' },
    { word: 'Hi', translation: 'Salam', example: 'Hi{en,B}!', exampleAz: 'Salam{,B}!', usageNote: 'Hi daha qeyri-rəsmi salamlaşmadır.', pronunciation: '/haɪ/', teachCard: 'd1_c02' },
    { word: 'Goodbye', translation: 'Görüşənədək', example: 'Goodbye{en,G}!', exampleAz: 'Görüşənədək{,G}!', usageNote: 'Goodbye burada ayrılma mənasındadır.', pronunciation: '/ˌɡʊdˈbaɪ/', teachCard: 'd1_c06' },
    { word: 'Bye', translation: 'Hələlik', example: 'Bye{en,B}!', exampleAz: 'Hələlik{,B}!', usageNote: 'Bye daha qeyri-rəsmi sağollaşmadır.', pronunciation: '/baɪ/', teachCard: 'd1_c06' },
  ],
};
