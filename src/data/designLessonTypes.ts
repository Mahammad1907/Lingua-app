import type { PacketGoal, PacketRule } from './b1PacketTypes';

/** Five-part “Mənə başa sal” explanation. “Sənin cavabın” is always the learner's actual answer. */
export interface Explanation { answers: string; reason: string; rule: string; example: string }

/** Which explanation applies to a confirmed wrong answer. Checked in order; the first match wins. */
export type VariantMatch =
  | { goal: PacketGoal }          // the answer fulfils this goal (e.g. a farewell where a greeting was needed)
  | { words: string[] }          // the normalized answer is one of these words
  | { option: string }           // choice tasks: the chosen option
  | { swapped: true }            // two-message task: both answers are in each other's place
  | { pattern: string }          // the raw answer matches this regular expression (typical mistakes in learner data, Bölmə 2)
  | { other: true };             // any other confirmed wrong answer

export interface Variant { match: VariantMatch; short?: string; explain: Explanation; field?: string }

interface BaseTask {
  id: string; number: number; title: string; prompt: string;
  hint?: string;
  /** One short sentence after a correct answer: why it fits (repeats the rule, teaches nothing new). */
  why?: string;
  /** A hint that points to the meaning makes a correct answer “Köməklə”. Format/approach hints do not. */
  hintAssists?: boolean;
  variants: Variant[];
  /** The mascot speaks or is talked about in this task: its avatar is shown so learners know who “dostun” is. */
  speaker?: 'mascot';
  /** Planned scene image(s) — see docs/SEKIL_SIYAHISI.md. Registered in src/config/sceneImages.ts; nothing is shown until the file exists. */
  scenes?: string[];
}
/** Who speaks in a chat bubble or sentence: mascot, girl, boy or someone unnamed. */
export type Who = 'M' | 'G' | 'B' | 'other';
export interface ChatLine { from: Who; text: string }

export interface ChoiceTask extends BaseTask {
  type: 'choice'; audio?: string; options: string[]; answer: string;
  /** “Sözü tamamla”: the options fill a gap in one spoken sentence. */
  gap?: { speaker?: Who; before: string; after: string };
  /** “Söhbəti tamamla” (20 Nov 2026): the earlier turns, shown ready above the sentence with the gap. */
  dialog?: ChatLine[];
  /** “Səhnədə tap”: numbered places on the scene picture, one per option (x, y in % of the picture).
   *  Until the picture file exists the options are shown as a normal list. */
  spots?: { option: string; x: number; y: number }[];
  /** “Xəritədə tap” (Bölmə 3): the options are country names (shown only as numbers on a code-drawn map, see CountryMap).
   *  neighbours: Russia, Georgia, Turkey, Iran (+ Azerbaijan); world: the USA, the UK/England, France, Germany, Russia, Turkey. */
  map?: 'neighbours' | 'world';
}
export interface WriteTask extends BaseTask {
  type: 'write'; audio?: string; placeholder: string; rule: PacketRule;
  /** “Nömrəni yığ” (Bölmə 2): the answer is typed on a phone keypad (digits only). `placeholder` is the screen label. */
  keypad?: boolean;
  /** “Hərfləri tut” (Bölmə 2): the answer is built from these letter tiles (capital letters, joined without spaces). Extra tiles are distractors. */
  letters?: string[];
  /** “Dialoqu tamamla” / “Mesaj yaz”: the task is shown as a short chat; the learner's reply is the last bubble. */
  chat?: { partner: string; from: Who; lines: ChatLine[];
    /** The partner's reaction after a correct check. Dərs 1: emoji only; later lessons: taught words only (check-taught). */ reply?: string };
  /** “Mesaj yaz”: the reply is built from these word tiles instead of typed. Extra tiles are distractors. */
  tiles?: string[];
  /** A code-drawn photo the partner sent (26 Nov 2026): shown instead of describing it in the task line. */
  photo?: PhotoSpec;
}
/** `from`: who sent it (name slots allowed). `shows`: what the picture shows — for the image to be added later. */
export interface PhotoSpec { from: string; who?: Who; shows: string }
export interface TwoField { id: string; label: string; placeholder: string; rule: PacketRule; purpose: string; empty: string }
/** `form` = “Formanı doldur” (Bölmə 2): the fields are shown as a printed registration form with this heading. */
export interface TwoTask extends BaseTask { type: 'two'; fields: TwoField[]; form?: { title: string; subtitle?: string };
  /** “İki mesajı özün yaz” as a chat timeline (25 Nov 2026): one time pill per field, the partner's opening lines, and
   *  optional reactions per field shown after a correct check (Dərs 1: emoji; later: taught words). */
  thread?: { partner: string; from: Who; lines: ChatLine[]; pills: string[]; replies?: string[] } }
export interface VoiceTask extends BaseTask {
  type: 'voice';
  /** What the counterpart says before the learner answers. Absent = the learner speaks first. */
  audio?: string;
  /** Shown model answer; makes a correct answer “Köməklə”. */
  sample?: string;
  rule: PacketRule;
  /** The counterpart's reply after a correct answer. Not listening evidence. */
  reply?: string;
  /** “Dinlə və təkrarla”: the phrase is shown; `audio` is the model to imitate. Pronunciation practice, not listening evidence. */
  repeat?: { stress?: string; note?: string; reading?: string };
}
/** “Kim nə dedi?”: put the meaning next to each sentence. */
export interface MatchTask extends BaseTask {
  type: 'match';
  /** meaning — “Kim nə dedi?” (sentence → Azerbaijani meaning, default);
   *  reply — “Cavab cütü” (sentence → its English reply);
   *  order — “Söhbəti sırala” (rows are the turns in the right order: en = turn number, az = the line). */
  mode?: 'meaning' | 'reply' | 'order';
  /** avatar (25 Nov 2026): the character's picture for this sentence, e.g. require('../../../assets/characters/nene.png').
   *  Optional — until the picture exists, the speaker's circle (from) or a neutral placeholder is shown. */
  rows: { en: string; az: string; from?: Who; avatar?: number | { uri: string };
    /** Word mode of “Söhbəti sırala” (set by utils/orderGaps): the whole line with “___” where `az` (the missing word) goes. */ line?: string }[];
  /** Word mode of an order task (“Söhbəti tamamla”, 25 Nov 2026) — set at run time, never in lesson data. */
  gaps?: boolean;
  /** Extra meanings that fit no sentence. */
  extra: string[];
}
/** “Söz sürüklə” (21 Nov 2026): word chips are dragged (or tapped, then a slot tapped) into the slot under each person.
 *  `answers` = person id → chip. Extra chips are distractors. Variants: `{ option: wrong chip }`, `field` = person id (optional). */
export interface DragTask extends BaseTask {
  type: 'drag'; audio?: string; people: { id: string; label?: string }[]; chips: string[]; answers: Record<string, string>;
}
/** “Profil kartı” (21 Nov 2026): after the audio line, every row of the card is filled (chips, or digits on the keypad).
 *  Whole card correct only when every row is; variants with `field` = row id explain each row. */
export interface ProfileRow { id: string; label: string; options?: string[]; number?: boolean; answer: string }
export interface ProfileTask extends BaseTask { type: 'profile'; audio?: string; rows: ProfileRow[] }
export type DesignTask = ChoiceTask | WriteTask | TwoTask | VoiceTask | MatchTask | DragTask | ProfileTask;
export type ReviewOf<T extends DesignTask> = T extends DesignTask ? Omit<T, 'id' | 'number' | 'type'> : never;

export interface IntroCard { type: 'intro'; id: string; badge: string; subtitle: string; goals: { icon: 'wave' | 'chat' | 'bye'; text: string }[]; start: string }
export interface TeachCard {
  type: 'teach'; id: string; number: number; title: string; lead?: string; phrases: { en: string; az: string }[]; notes: string[];
  /** “Quruluşu”: the pattern(s); [ad] marks the slot for a name. */
  structure?: string[];
  example?: { en: string; az: string };
  scenes?: string[];
}
/** “Müəllim izahı” (approved mockup, 20 Nov 2026): the mascot explains a rule in up to three numbered parts and a
 *  “Diqqət et” note. Comes right after the word card when a topic needs more than the short card. */
export interface ExplainCard {
  type: 'explain'; id: string; number: number;
  /** Mascot bubble; the `focus` phrase inside it is coloured. */
  lead: string; focus?: string;
  /** Big title of the explanation (24 Nov 2026 design). Without it the first section's title is used. */
  heading?: string;
  sections: {
    title: string;
    /** One or two short sentences in Azerbaijani (no grammar terms). */
    text?: string;
    /** Two side-by-side chips, e.g. He's · kişi / She's · qadın. */
    pairs?: { en: string; az: string; /** Small label on the card, e.g. Rəsmi / Gündəlik. */ tag?: string }[];
    /** A line from one end to the other with the forms placed on it (e.g. Səmimi … Rəsmi). `at` is 0…1. */
    scale?: { left: string; right: string; marks: { en: string; at: number }[] };
    /** Long → short form with the dropped letter crossed out, with sound. */
    short?: { full: string; drop: string; short: string; note: string };
    /** Pattern chips and spoken examples. */
    build?: { parts: string[]; examples: { en: string; az: string }[] };
  }[];
  attention?: string;
}
/** “Yeni söz”: one new word or phrase, shown right before the task that first uses it. */
export interface WordCard {
  type: 'word'; id: string; number: number;
  word: string; pronunciation: string; az: string; example: string; exampleAz: string;
  /** One short note (only the first is shown). */
  notes?: string[]; scenes?: string[];
  /** Short form shown with sound under the word, the first time it appears (e.g. What is → What's). */
  shortForm?: { full: string; short: string };
  /** Reading in Azerbaijani letters (American pronunciation, no phonetic marks); **th** marks a sound Azerbaijani has no letter for. */
  reading?: string;
  /** “Quruluşu”: the pattern(s); [ad] marks the slot for a name. */
  structure?: string[];
}
export interface ResultGoal { group: string; text: string; tasks: string[] }

export interface DesignLesson {
  id: string; order: number; title: string; section: string;
  /** Section (Bölmə) number; absent = Bölmə 1. */
  unit?: number;
  /** Lesson number on the section map (1–8) when it differs from `order`. */
  number?: number;
  /** A map lesson split in two: this lesson is part 1 or 2 (docs/BOLME_2_XERITESI.md §0). */
  part?: 1 | 2 | 3;
  /** Daily review session (src/data/reviewSession.ts): task or field id → review item key. Never set on course lessons. */
  reviewOf?: Record<string, string>;
  /** Section exam: no Kömək or hints, no retry round, pass mark 70 % (docs/BOLME_2_XERITESI.md §0). */
  exam?: boolean;
  cards: (IntroCard | TeachCard | WordCard | ExplainCard | TaskWithReview)[];
  result: {
    done: string[]; incomplete: string; goals: ResultGoal[]; closing: string; button: string;
    technical: string; unverified: string;
  };
  /** Shared notices. */
  notices: { soundFailed: string; unknown: string; voiceUnknown: string; micFailed: string; review: string };
  vocabulary: { word: string; translation: string; example: string; exampleAz: string; usageNote: string; pronunciation: string; teachCard: string }[];
}
/** A task with its retry version (new situation, same skill and answer method). */
export type TaskWithReview = { [K in DesignTask['type']]: Extract<DesignTask, { type: K }> & { review?: ReviewOf<Extract<DesignTask, { type: K }>> } }[DesignTask['type']];
