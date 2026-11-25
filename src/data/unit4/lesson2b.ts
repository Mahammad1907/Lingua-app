// Bölmə 4 · Dərs 2b — Ailə (2) (parents · grandmother · grandfather · son · daughter)
// Albomun ikinci səhifəsi. “My parents are in Baku.” — are yalnız hazır cümlə kimi. Feil -s (lives) yoxdur: “My grandmother is in Ganja.”
// Spiral: ailə sözləri (Dərs 2a), This is my…, Who's this?, in + şəhər (Bölmə 3).
// Tipik səhvlər: grandmother yazılışı, daughter oxunuşu (dotır), son ↔ sun, “My parents is”.
import type { DesignLesson, ExplainCard, Variant } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, own, resultTexts, said } from '../unit3/shared';

const PLACE = String.raw`\p{L}[\p{L}'’-]*(?:\s+\p{L}[\p{L}'’-]*){0,2}`;
/** “My parents are in Baku.” — any city. “My parents is …” and “My parents in …” are not accepted. */
const PARENTS_IN = String.raw`^my\s+parents\s+are\s+in\s+${PLACE}\s*[.!]?$`;
/** “This is my grandfather.” (also “He's my grandfather.”). */
const sayMy = (word: string, pron: 'he' | 'she') => said(String.raw`^(?:this\s+is|${pron}(?:'s|\s+is))\s+my\s+${word}\s*[.!]?$`, `This is my ${word}.`);

const parentsMistakes: Variant[] = [
  { match: { pattern: String.raw`^my\s+parents\s+is\b` }, short: 'My parents-dən sonra are gəlir.',
    explain: ex('My parents are in Baku.', 'Ata-ana ikisidir; bu hazır cümlədə are deyilir.', 'My parents are in Baku. — düzdür; My parents is in Baku. — olmur.', 'My mother is in Baku.') },
  { match: { pattern: String.raw`^my\s+parents\s+in\b` }, short: 'in-dən əvvəl are gəlir.',
    explain: ex('My parents are in Baku.', 'Azərbaycancada “-dadır” şəkilçidir; ingiliscə are ayrıca söz kimi gəlir.', 'My parents are in Baku. — düzdür; My parents in Baku. — olmur.', 'My mother is in Baku.') },
];
const grandMistakes: Variant[] = [
  { match: { pattern: String.raw`^my\s+grandmother\s+(?:in|from)\b` }, short: 'in-dən əvvəl is gəlir.',
    explain: ex('My grandmother is in Ganja.', 'Azərbaycancada “-dadır” şəkilçidir; ingiliscə is ayrıca söz kimi gəlir.', 'My grandmother is in Ganja. — düzdür; My grandmother in Ganja. — olmur.', 'My mother is in Baku.') },
  { match: { pattern: String.raw`^my\s+grandmother\s+are\b` }, short: 'Bir nəfər üçün is gəlir.',
    explain: ex('My grandmother is in Ganja.', 'Nənə bir nəfərdir: My grandmother is. Ata-ana iki nəfərdir: My parents are.', 'My grandmother is in Ganja. — bir nəfər; My parents are in Baku. — iki nəfər.', 'My mother is in Baku.') },
];
const noMy = (word: string, example: string): Variant => ({
  match: { pattern: String.raw`^this\s+is\s+${word}\b` }, short: `${word}-dən əvvəl my lazımdır.`,
  explain: ex(`This is my ${word}.`, 'Ailə üzvündən əvvəl “mənim” ayrıca gəlir: my.', `This is my ${word}. — düzdür; This is ${word}. — olmur.`, example) });

export const lesson2b: DesignLesson = {
  id: 'a1_en_b4_d2b', order: 37, unit: 4, number: 2, part: 2, title: 'Ailə (2)', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d2b_c01', badge: 'Ailə və insanlar', subtitle: '{F} albomun ikinci səhifəsini açır. Orada daha geniş ailə var.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Ailənin yeni üzvlərini eşidib başa düşürəm.' },
        { icon: 'wave', text: 'Ata-ananı, nənə-babanı, oğul və qızı adlandıra bilirəm.' },
        { icon: 'bye', text: 'Ailəmin harada olduğunu deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u4d2b_c02', number: 2, scenes: ['mascot/point'],
      word: 'parents', pronunciation: '/ˈpɛrənts/', reading: 'perənts', az: 'valideynlər (ata-ana)',
      notes: ['İkisi birlikdə: ata və ana. “My parents” cümlə başlanğıcıdır, sonra are gəlir.'],
      example: 'My parents are in Baku.', exampleAz: 'Ata-anam Bakıdadır.',
    },
    {
      type: 'choice', id: 'u4d2b_c03', number: 3, title: 'Dinlə və anla', why: 'My parents are in + şəhər — ata-anasının harada olduğunu deyir.', hint: 'Cümlənin əvvəlindəki sözə və sonundakı şəhərə qulaq as.',
      prompt: '{F} albomun ikinci səhifəsində bir şəkil göstərir.\nO nə deyir?', audio: 'My parents are in Ganja.',
      options: ['Ata-anasının Gəncədə olduğunu deyir.', 'Özünün Gəncədə olduğunu deyir.', 'Ata-anasının Gəncədən olduğunu deyir.'], answer: 'Ata-anasının Gəncədə olduğunu deyir.',
      variants: [
        pick('Özünün Gəncədə olduğunu deyir.', 'Cümlə “My parents” ilə başlayır, özü haqqında deyil.', ex('Ata-anasının Gəncədə olduğunu deyir.', 'Cümlə My parents ilə başlayır — ata-anadan danışır.', "My parents are in Ganja. — ata-anam; I'm in Ganja. — mən.", 'My parents are in Ganja.')),
        pick('Ata-anasının Gəncədən olduğunu deyir.', 'Səsdə from yoxdur, in var — harada olduğunu deyir.', ex('Ata-anasının Gəncədə olduğunu deyir.', 'Şəhərdən əvvəl in var; from yox. Bu, hazırda harada olduqlarını deyir.', 'are in Ganja — Gəncədədirlər; are from Ganja — Gəncədəndirlər.', 'My parents are in Ganja.')),
      ],
      review: {
        title: 'Dinlə və anla', why: 'My parents are in + şəhər — ata-anasının harada olduğunu deyir.', hint: 'İş yoldaşının ilk sözü kimləri göstərir və onlar haradadır — qulaq as.',
        prompt: 'Video zəngdə iş yoldaşın ailə şəkli göstərir.\nO nə deyir?', audio: 'My parents are in Baku.',
        options: ['Özünün Bakıda olduğunu deyir.', 'Ata-anasının Bakıdan olduğunu deyir.', 'Ata-anasının Bakıda olduğunu deyir.'], answer: 'Ata-anasının Bakıda olduğunu deyir.',
        variants: [
          pick('Özünün Bakıda olduğunu deyir.', 'Cümlə “My parents” ilə başlayır, özü haqqında deyil.', ex('Ata-anasının Bakıda olduğunu deyir.', 'Cümlə My parents ilə başlayır — ata-anadan danışır.', "My parents are in Baku. — ata-anam; I'm in Baku. — mən.", 'My parents are in Baku.')),
          pick('Ata-anasının Bakıdan olduğunu deyir.', 'Səsdə from yoxdur, in var — harada olduğunu deyir.', ex('Ata-anasının Bakıda olduğunu deyir.', 'Şəhərdən əvvəl in var; from yox. Bu, hazırda harada olduqlarını deyir.', 'are in Baku — Bakıdadırlar; are from Baku — Bakıdandırlar.', 'My parents are in Baku.')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d2b_c04', number: 4, scenes: ['mascot/happy'],
      word: 'grandmother', pronunciation: '/ˈɡrænˌmʌðər/', reading: 'qrənma**th**ər', az: 'nənə',
      notes: ['İki hissədən ibarətdir: grand + mother. Bir söz kimi yazılır.'],
      example: 'This is my grandmother.', exampleAz: 'Bu mənim nənəmdir.',
    },
    {
      type: 'write', id: 'u4d2b_c05', number: 5, title: 'Dinlə və yaz', why: 'grandmother — grand + mother, bir söz kimi.', hint: 'Sözün iki hissəsi var: biri sənin Dərs 2a-dan bildiyin söz.',
      prompt: '{F} səsli mesajda bir söz deyib, yazılışını soruşur.\nEşitdiyin sözü yaz.', audio: 'grandmother', placeholder: 'Eşitdiyin sözü yaz',
      rule: exact('grandmother'),
      variants: [
        { match: { pattern: String.raw`^grand\s+mother$|^gran[d]?mother$|^grandmoth[ae]r?$` }, short: 'Bir söz kimi yaz: grandmother.',
          explain: ex('grandmother', 'Söz iki hissədən qurulub, amma boşluqsuz yazılır: grand + mother.', 'grandmother — düzdür; ayrı-ayrı yazmaq — olmur.', 'This is my grandmother.') },
        other('Eşitdiyin söz: grandmother.', ex('grandmother', 'Eşitdiyin sözü yaz: grand + mother, boşluqsuz.', 'grandmother — nənə; mother — ana.', 'This is my grandmother.')),
      ],
      review: {
        title: 'Dinlə və yaz', why: 'grandmother — grand + mother, bir söz kimi.', hint: 'Telefonda eşitdiyin uzun sözü iki hissəyə böl və hər hissəni ayrıca yaz.',
        prompt: 'Telefonda dostun bir söz deyir və soruşur ki, o necə yazılır.\nEşitdiyin sözü yaz.', audio: 'grandmother', placeholder: 'Eşitdiyin sözü yaz',
        rule: exact('grandmother'),
        variants: [
          { match: { pattern: String.raw`^grand\s+mother$|^gran[d]?mother$|^grandmoth[ae]r?$` }, short: 'Bir söz kimi yaz: grandmother.',
            explain: ex('grandmother', 'Söz iki hissədən qurulub, amma boşluqsuz yazılır: grand + mother.', 'grandmother — düzdür; ayrı-ayrı yazmaq — olmur.', 'This is my grandmother.') },
          other('Eşitdiyin söz: grandmother.', ex('grandmother', 'Eşitdiyin sözü yaz: grand + mother, boşluqsuz.', 'grandmother — nənə; mother — ana.', 'This is my grandmother.')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d2b_c06', number: 6, scenes: ['mascot/wave'],
      word: 'grandfather', pronunciation: '/ˈɡrænˌfɑðər/', reading: 'qrənfa**th**ər', az: 'baba',
      notes: ['grand + father: grandmother kimi bir söz yazılır.'],
      example: 'This is my grandfather.', exampleAz: 'Bu mənim babamdır.',
    },
    {
      type: 'write', id: 'u4d2b_c07', number: 7, title: 'Mesaj yaz', why: 'My grandmother is in Ganja. — nənənin harada olduğunu dedin.', hint: 'Əvvəl kimin nənəsi olduğunu de, şəhər cümlənin sonunda gəlir.',
      prompt: '{F} öz nənəsindən yazır və sənin nənəni soruşur. Nənən Gəncədədir.\nSözlərdən cavab qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: 'My grandmother is in London. And your grandmother?' }] },
      tiles: ['My', 'grandmother', 'is', 'in', 'Ganja', '.', 'are', 'from'], rule: exact('My grandmother is in Ganja.'),
      variants: [...grandMistakes, other('Sıra: My grandmother is in Ganja.', ex('My grandmother is in Ganja.', 'Əvvəl My grandmother, sonra is in və şəhər.', 'My grandmother is in Ganja. — nənəm Gəncədədir.', 'My mother is in Baku.'))],
      review: {
        title: 'Mesaj yaz', why: 'My grandmother is in Ganja. — nənənin harada olduğunu dedin.', hint: 'İş yoldaşına da əvvəl kimin nənəsi olduğunu de, şəhəri sona saxla.',
        prompt: 'İş yoldaşı öz nənəsindən yazır və sənin nənəni soruşur. Nənən Gəncədədir.\nSözlərdən cavab qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'İş yoldaşı', from: 'other', lines: [{ from: 'other', text: 'My grandmother is in Baku. And your grandmother?' }] },
        tiles: ['is', 'Ganja', 'My', 'in', 'grandmother', '.', 'from', 'are'], rule: exact('My grandmother is in Ganja.'),
        variants: [...grandMistakes, other('Sıra: My grandmother is in Ganja.', ex('My grandmother is in Ganja.', 'Əvvəl My grandmother, sonra is in və şəhər.', 'My grandmother is in Ganja. — nənəm Gəncədədir.', 'My mother is in Baku.'))],
      },
    },
    {
      type: 'word', id: 'u4d2b_c08', number: 8, scenes: ['mascot/ask'],
      word: 'son', pronunciation: '/sʌn/', reading: 'san', az: 'oğul',
      notes: ['Yazılışı son, oxunuşu “san”: o hərfi “a” kimi oxunur.'],
      example: 'This is my son.', exampleAz: 'Bu mənim oğlumdur.',
    },
    {
      type: 'drag', id: 'u4d2b_drag', number: 9, title: 'Söz sürüklə', why: 'grandfather — baba, son — oğul: hər sözü eşitdiyin adamın altına qoydun.', hint: 'Səsdə iki cümlə var: birinci cümlə birinci adam üçündür.',
      prompt: '{F} albomun ikinci səhifəsində iki şəkil göstərir.\nDinlə və hər adamın altına sözü qoy.', audio: '{F}: This is my grandfather. This is my son.',
      people: [{ id: 'p1' }, { id: 'p2' }], chips: ['son', 'grandmother', 'grandfather'], answers: { p1: 'grandfather', p2: 'son' },
      variants: [
        { field: 'p1', ...pick('grandmother', 'Birinci cümlədə grandmother yox, grandfather deyilir.', ex('grandfather', 'Sözün sonuna qulaq as: father — kişi, baba.', 'grandfather — baba; grandmother — nənə.', 'This is my grandfather.')) },
        { field: 'p2', ...pick('grandmother', 'İkinci cümlədə qısa söz deyilir: son.', ex('son', 'İkinci cümlə This is my son ilə bitir — oğul.', 'son — oğul; grandmother — nənə.', 'This is my son.')) },
        other('Sözlərin yeri dəyişib.', ex('1 — grandfather; 2 — son', 'Birinci deyilən söz birinci adamın, ikincisi ikinci adamın altına gedir.', 'grandfather — baba; son — oğul.', 'This is my son.')),
      ],
      review: {
        title: 'Söz sürüklə', why: 'grandmother — nənə, daughter — qız: hər sözü eşitdiyin adamın altına qoydun.', hint: 'Hər cümlənin son sözünü tut və o adamın altına qoy.',
        prompt: 'Qonşu telefonda iki şəkil göstərir.\nDinlə və hər adamın altına sözü qoy.', audio: 'This is my grandmother. This is my daughter.',
        people: [{ id: 'p1' }, { id: 'p2' }], chips: ['daughter', 'son', 'grandmother'], answers: { p1: 'grandmother', p2: 'daughter' },
        variants: [
          { field: 'p2', ...pick('son', 'son oğuldur; ikinci cümlədə daughter deyilir.', ex('daughter', 'daughter — “dotər”: qız övlad.', 'daughter — qız; son — oğul.', 'This is my daughter.')) },
          { field: 'p1', ...pick('son', 'Birinci cümlədə grandmother deyilir.', ex('grandmother', 'Birinci cümlə This is my grandmother ilə bitir — nənə.', 'grandmother — nənə; son — oğul.', 'This is my grandmother.')) },
          other('Sözlərin yeri dəyişib.', ex('1 — grandmother; 2 — daughter', 'Birinci deyilən söz birinci adamın, ikincisi ikinci adamın altına gedir.', 'grandmother — nənə; daughter — qız.', 'This is my daughter.')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d2b_c10', number: 10, scenes: ['mascot/think'],
      word: 'daughter', pronunciation: '/ˈdɔtər/', reading: 'dotər', az: 'qız (övlad)',
      notes: ['Oxunuşu “dotər”: yazılışdakı gh səssizdir.'],
      example: 'This is my daughter.', exampleAz: 'Bu mənim qızımdır.',
    },
    {
      type: 'voice', id: 'u4d2b_c11', number: 11, title: 'Dinlə və təkrarla', why: 'Cümləni dedin: This is my daughter.', hint: 'Yavaş dinlə: daughter-in ortasındakı gh oxunmur.',
      prompt: '{F} qızının şəklini göstərir.\nDinlə, sonra eyni cür de.', audio: 'This is my daughter.', repeat: { stress: 'daugh', note: 'daughter — “dotər”: gh səssizdir, “q” demə.', reading: '**th**is iz may dotər' },
      rule: said(String.raw`^this\s+is\s+my\s+daughter\s*[.!]?$`, 'This is my daughter.'),
      variants: [other('This is my daughter.', ex('This is my daughter.', 'Əvvəl This is my, sonra daughter.', 'This is my daughter. — qızım; This is my son. — oğlum.', 'This is my daughter.'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Cümləni dedin: This is my daughter.', hint: 'Tısbağa düyməsi ilə yavaş dinlə, sonra cümləni bir nəfəsdə de.',
        prompt: 'Video zəngdə qonşu qızının şəklini göstərir.\nDinlə, sonra eyni cür de.', audio: 'This is my daughter.', repeat: { stress: 'daugh', note: 'daughter — “dotər”: gh səssizdir, “q” demə.', reading: '**th**is iz may dotər' },
        rule: said(String.raw`^this\s+is\s+my\s+daughter\s*[.!]?$`, 'This is my daughter.'),
        variants: [other('This is my daughter.', ex('This is my daughter.', 'Əvvəl This is my, sonra daughter.', 'This is my daughter. — qızım; This is my son. — oğlum.', 'This is my daughter.'))],
      },
    },
    {
      type: 'voice', id: 'u4d2b_c12', number: 13, title: 'Səslə cavab', why: 'Ata-ananın harada olduğunu dedin: My parents are in + şəhər.', hint: 'Bu dərsin ilk söz kartını xatırla, şəhərin adını sona qoy.',
      prompt: '{F} sənin ailən haqqında maraqlanır.\nDe: ata-anan Bakıdadır.', reply: 'Nice!',
      rule: own(PARENTS_IN, 'My parents are in Baku.'),
      variants: [...parentsMistakes, other('My parents are in + şəhər.', ex('My parents are in Baku.', 'Ata-ananı My parents ilə, harada olduqlarını are in və şəhərlə deyirsən.', 'My parents are in Baku. — Bakıdadırlar.', 'My mother is in Baku.'))],
      review: {
        title: 'Səslə cavab', why: 'Ata-ananın harada olduğunu dedin: My parents are in + şəhər.', hint: 'Qonşuya da ata-ananı bu dərsin ilk söz kartı ilə de, şəhəri sona qoy.',
        prompt: 'Qonşu sənin ailən haqqında soruşur.\nDe: ata-anan Gəncədədir.', reply: 'Nice!',
        rule: own(PARENTS_IN, 'My parents are in Ganja.'),
        variants: [...parentsMistakes, other('My parents are in + şəhər.', ex('My parents are in Ganja.', 'Ata-ananı My parents ilə, harada olduqlarını are in və şəhərlə deyirsən.', 'My parents are in Ganja. — Gəncədədirlər.', 'My mother is in Baku.'))],
      },
    },
    {
      type: 'tree', id: 'u4d2b_tree', number: 12, title: 'Ailə ağacı', why: 'grandmother — nənə: ananın da yuxarısında, babanın yanında.', hint: 'Xətlərə bax: “?” ananın üstündə, babanın yanındadır.',
      prompt: '{F} albomun ikinci səhifəsində sənin ailə ağacını çəkib. “?” olan yerdə bir qadın var.\nO kimdir? İngiliscə sözü seç.',
      nodes: [{ id: 'gm', x: 25, y: 0 }, { id: 'gf', label: 'grandfather', x: 75, y: 0 }, { id: 'mom', label: 'mother', x: 50, y: 50 }, { id: 'me', label: 'sən', x: 50, y: 100 }],
      links: [['gm', 'gf'], ['gm', 'mom'], ['mom', 'me']], target: 'gm', options: ['mother', 'grandmother', 'daughter'], answer: 'grandmother',
      variants: [
        pick('mother', 'mother ortadadır; “?” ananın da yuxarısındadır.', ex('grandmother', 'Ananın üstündəki qadın nənəndir: grand + mother.', 'grandmother — nənə; mother — ana.', 'This is my grandmother.')),
        pick('daughter', 'daughter səndən aşağıda olardı; “?” ən yuxarıdadır.', ex('grandmother', 'Ən yuxarı sırada, babanın yanındakı qadın nənəndir.', 'grandmother — nənə; daughter — qız.', 'This is my grandmother.')),
      ],
      review: {
        title: 'Ailə ağacı', why: 'son — oğul: səndən aşağıda, sənin övladın.', hint: 'Xətlərə bax: “?” səndən aşağıdadır və oğlandır.',
        prompt: 'Sən iş yoldaşına öz ailə ağacını göstərirsən. “?” olan yerdə bir oğlan var.\nO kimdir? İngiliscə sözü seç.',
        nodes: [{ id: 'me', label: 'sən', x: 50, y: 0 }, { id: 'dau', label: 'daughter', x: 25, y: 100 }, { id: 'boy', x: 75, y: 100 }],
        links: [['me', 'dau'], ['me', 'boy']], target: 'boy', options: ['brother', 'son', 'grandfather'], answer: 'son',
        variants: [
          pick('brother', 'Qardaş səninlə eyni sırada olur; “?” səndən aşağıdadır.', ex('son', 'Səndən aşağıdakı oğlan sənin oğlundur.', 'son — oğul; brother — qardaş.', 'This is my son.')),
          pick('grandfather', 'Baba ən yuxarıda olur; “?” səndən aşağıdadır.', ex('son', 'Səndən aşağıdakı oğlan sənin oğlundur.', 'son — oğul; grandfather — baba.', 'This is my son.')),
        ],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u4d2b_c14', number: 14, title: 'Söhbəti sırala', why: 'Sual, cavab və davamı düz sıradadır.', hint: 'Hər sualın cavabı onun dərhal ardınca gəlir.',
      prompt: 'Albomun ikinci səhifəsi.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: "Hi! Who's this?", from: 'other' }, { en: '2', az: "This is my grandfather. He's from Ganja.", from: 'B' }, { en: '3', az: "Really? And who's this?", from: 'other' }, { en: '4', az: 'This is my daughter.', from: 'B' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hi! Who's this? → This is my grandfather. He's from Ganja. → Really? And who's this? → This is my daughter.", 'Sual, cavab, təəccüb və ikinci sual, ikinci cavab.', "Who's this? — sual; This is my grandfather. — cavab.", "Hi! Who's this?"))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, cavab və davamı düz sıradadır.', hint: 'Hər sualın cavabı onun dərhal ardınca gəlir.',
        prompt: 'Video zəng.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: "Who's this?", from: 'other' }, { en: '2', az: "This is my grandmother. She's from Baku.", from: 'G' }, { en: '3', az: "Really? And who's this?", from: 'other' }, { en: '4', az: 'This is my son.', from: 'G' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Who's this? → This is my grandmother. She's from Baku. → Really? And who's this? → This is my son.", 'Sual, cavab, təəccüb və ikinci sual, ikinci cavab.', "Who's this? — sual; This is my grandmother. — cavab.", "Who's this?"))],
      },
    },
  ],
  result: {
    done: ['Dərs 2 · 2-ci hissə tamamlandı', 'Artıq daha geniş ailəni adlandırır və ata-ananın harada olduğunu deyirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Geniş ailə sözlərini eşidib tanımaq, ailə ağacında tapmaq və söhbəti sıralamaq', tasks: ['u4d2b_c03', 'u4d2b_drag', 'u4d2b_tree', 'u4d2b_c14'] },
      { group: 'Yazı', text: 'Ailə üzvünün harada olduğunu yazmaq', tasks: ['u4d2b_c05', 'u4d2b_c07'] },
      { group: 'Danışıq', text: 'Ailə üzvünü təqdim etmək və ata-ananın harada olduğunu demək', tasks: ['u4d2b_c11', 'u4d2b_c12'] },
    ],
    closing: 'Növbəti dərs — his və her: onun adı nədir?', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'parents', translation: 'valideynlər (ata-ana)', example: 'My parents are in Baku.', exampleAz: 'Ata-anam Bakıdadır.', usageNote: 'My parents cümlə başlanğıcıdır, sonra are gəlir.', pronunciation: '/ˈpɛrənts/', teachCard: 'u4d2b_c02' },
    { word: 'grandmother', translation: 'nənə', example: 'This is my grandmother.', exampleAz: 'Bu mənim nənəmdir.', usageNote: 'grand + mother, bir söz.', pronunciation: '/ˈɡrænˌmʌðər/', teachCard: 'u4d2b_c04' },
    { word: 'grandfather', translation: 'baba', example: 'This is my grandfather.', exampleAz: 'Bu mənim babamdır.', usageNote: 'grand + father, bir söz.', pronunciation: '/ˈɡrænˌfɑðər/', teachCard: 'u4d2b_c06' },
    { word: 'son', translation: 'oğul', example: 'This is my son.', exampleAz: 'Bu mənim oğlumdur.', usageNote: 'Oxunuşu “san”.', pronunciation: '/sʌn/', teachCard: 'u4d2b_c08' },
    { word: 'daughter', translation: 'qız (övlad)', example: 'This is my daughter.', exampleAz: 'Bu mənim qızımdır.', usageNote: 'Oxunuşu “dotər”.', pronunciation: '/ˈdɔtər/', teachCard: 'u4d2b_c10' },
  ],
};

export const explains: { after: string; card: ExplainCard }[] = [
  {
    after: 'u4d2b_c02',
    card: {
      type: 'explain', id: 'u4d2b_c02t', number: 0,
      lead: 'Ata-ana iki nəfərdir, ona görə My parents are deyirik.', focus: 'My parents are',
      sections: [
        { title: 'Bir nəfər, iki nəfər', pairs: [{ en: 'My mother is in Baku.', az: 'bir nəfər' }, { en: 'My parents are in Baku.', az: 'iki nəfər' }] },
        { title: 'Necə qurulur?', build: { parts: ['My parents are in', 'şəhər'], examples: [{ en: 'My parents are in Baku.', az: 'Ata-anam Bakıdadır.' }] } },
      ],
      attention: 'Azərbaycancada “-dadır” sonda gəlir. İngiliscə are və in ayrıca sözlərdir.',
    },
  },
];

export const ruleMeta: Record<string, { title: string; eg: string; topic: 'questions' | 'short' | 'order' | 'polite' | 'sound' | 'numbers' | 'letters' | 'country' }> = {
  u4d2b_c02t: { title: 'Ata-anam haqqında necə danışım?', eg: 'My parents are in Baku.', topic: 'order' },
};
