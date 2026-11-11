export type PacketGoal = 'greet' | 'farewell' | 'introduce' | 'askName' | 'meet' | 'feeling' | 'fine' | 'unwell' | 'askFeeling' | 'thanks' | 'welcome' | 'sorry' | 'noProblem' | 'politeName' | 'attention' | 'dontUnderstand' | 'repeat' | 'slow' | 'reason';
export interface PacketRule { answers: string[]; goals?: PacketGoal[]; roleName?: string; exact?: boolean }
export interface PacketTurn { id: string; audio: string; prompt: string; rule: PacketRule; sample?: string; reply?: string; rate?: number }
export interface PacketMessageField { id: string; label: string; placeholder: string; rule: PacketRule }
export interface PacketObjectWord {
  kind: 'object'; word: string; translation: string; image: string;
  example: string; exampleAz: string; structureTaught: boolean;
  pronunciation: { ipa: string; source: string; checkedAt: string; locale: 'en-GB' };
}
export interface PacketCard {
  id: string; number: number; title: string; kind: 'intro' | 'teach' | 'task' | 'voice' | 'review' | 'result';
  body: string; board?: string; examples?: string[]; options?: string[]; words?: string[]; audio?: string;
  messages?: [PacketMessageField, PacketMessageField]; messageHint?: string; messageExample?: [string, string];
  scenes?: [string, string]; objectWord?: PacketObjectWord; introducedWords?: string[];
  rule?: PacketRule; explanation?: string; turns?: PacketTurn[]; review?: PacketCard; source: string;
}
export interface PacketLesson { id: string; order: number; title: string; goal: string; cards: PacketCard[]; audioMeanings?: Record<string, string>; vocabulary: { word: string; translation: string; pronunciation: string; pronunciationSource?: string; example: string; exampleAz: string; usageNote: string; lexical?: boolean; acceptedAnswers?: string[]; acceptedTranslations?: string[]; quizEligible?: boolean }[] }
export interface PacketExam { variant: 'A' | 'B'; cards: PacketCard[]; required: number[] }
