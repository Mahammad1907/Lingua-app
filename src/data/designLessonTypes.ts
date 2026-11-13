import type { PacketGoal, PacketRule } from './b1PacketTypes';

/** Five-part “Mənə başa sal” explanation. “Sənin cavabın” is always the learner's actual answer. */
export interface Explanation { answers: string; reason: string; rule: string; example: string }

/** Which explanation applies to a confirmed wrong answer. Checked in order; the first match wins. */
export type VariantMatch =
  | { goal: PacketGoal }          // the answer fulfils this goal (e.g. a farewell where a greeting was needed)
  | { words: string[] }          // the normalized answer is one of these words
  | { option: string }           // choice tasks: the chosen option
  | { swapped: true }            // two-message task: both answers are in each other's place
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
  /** “Səhnədə tap”: numbered places on the scene picture, one per option (x, y in % of the picture).
   *  Until the picture file exists the options are shown as a normal list. */
  spots?: { option: string; x: number; y: number }[];
}
export interface WriteTask extends BaseTask {
  type: 'write'; audio?: string; placeholder: string; rule: PacketRule;
  /** “Dialoqu tamamla” / “Mesaj yaz”: the task is shown as a short chat; the learner's reply is the last bubble. */
  chat?: { partner: string; from: Who; lines: ChatLine[] };
  /** “Mesaj yaz”: the reply is built from these word tiles instead of typed. Extra tiles are distractors. */
  tiles?: string[];
}
export interface TwoField { id: string; label: string; placeholder: string; rule: PacketRule; purpose: string; empty: string }
export interface TwoTask extends BaseTask { type: 'two'; fields: TwoField[] }
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
  rows: { en: string; az: string; from?: Who }[];
  /** Extra meanings that fit no sentence. */
  extra: string[];
}
export type DesignTask = ChoiceTask | WriteTask | TwoTask | VoiceTask | MatchTask;
export type ReviewOf<T extends DesignTask> = T extends DesignTask ? Omit<T, 'id' | 'number' | 'type'> : never;

export interface IntroCard { type: 'intro'; id: string; badge: string; subtitle: string; goals: { icon: 'wave' | 'chat' | 'bye'; text: string }[]; start: string }
export interface TeachCard {
  type: 'teach'; id: string; number: number; title: string; lead?: string; phrases: { en: string; az: string }[]; notes: string[];
  /** “Quruluşu”: the pattern(s); [ad] marks the slot for a name. */
  structure?: string[];
  example?: { en: string; az: string };
  scenes?: string[];
}
/** “Yeni söz”: one new word or phrase, shown right before the task that first uses it. */
export interface WordCard {
  type: 'word'; id: string; number: number;
  word: string; pronunciation: string; az: string; example: string; exampleAz: string;
  /** One short note (only the first is shown). */
  notes?: string[]; scenes?: string[];
  /** Reading in Azerbaijani letters (American pronunciation, no phonetic marks); **th** marks a sound Azerbaijani has no letter for. */
  reading?: string;
  /** “Quruluşu”: the pattern(s); [ad] marks the slot for a name. */
  structure?: string[];
}
export interface ResultGoal { group: string; text: string; tasks: string[] }

export interface DesignLesson {
  id: string; order: number; title: string; section: string;
  cards: (IntroCard | TeachCard | WordCard | TaskWithReview)[];
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
