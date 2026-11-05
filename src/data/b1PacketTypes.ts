export type PacketGoal = 'greet' | 'farewell' | 'introduce' | 'askName' | 'meet' | 'feeling' | 'fine' | 'unwell' | 'askFeeling' | 'thanks' | 'welcome' | 'sorry' | 'noProblem' | 'politeName' | 'attention' | 'dontUnderstand' | 'repeat' | 'slow' | 'reason';
export interface PacketRule { answers: string[]; goals?: PacketGoal[]; roleName?: string; exact?: boolean; fields?: PacketRule[] }
export interface PacketTurn { id: string; audio: string; prompt: string; rule: PacketRule; sample?: string; reply?: string; replyRate?: number; replyGoals?: PacketGoal[]; rate?: number }
export interface PacketCard {
  id: string; number: number; title: string; kind: 'intro' | 'teach' | 'task' | 'voice' | 'review' | 'result';
  fields?: { label: string; rule: PacketRule }[];
  body: string; board?: string; examples?: string[]; options?: string[]; words?: string[]; audio?: string;
  rule?: PacketRule; explanation?: string; turns?: PacketTurn[]; review?: PacketCard; source: string;
}
export interface PacketLesson { version?: string; id: string; order: number; title: string; goal: string; cards: PacketCard[]; audioMeanings?: Record<string, string>; vocabulary: { word: string; translation: string; pronunciation: string; example: string; exampleAz: string; usageNote: string; lexical?: boolean; acceptedAnswers?: string[]; acceptedTranslations?: string[]; quizEligible?: boolean }[] }
export interface PacketExam { variant: 'A' | 'B'; cards: PacketCard[]; required: number[] }
