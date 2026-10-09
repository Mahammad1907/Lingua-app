// ═══════════════════════════════════════
// DİL VƏ SƏVİYYƏ
// ═══════════════════════════════════════

export type Language = 'en' | 'de' | 'ru' | 'az';
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// ═══════════════════════════════════════
// MƏŞQ TİPLƏRİ
// ═══════════════════════════════════════

export type ExerciseType =
  | 'multiple_choice'
  | 'translation'
  | 'sentence_build'
  | 'fill_blank';

export type TokenLang = Language | 'punctuation';

// ═══════════════════════════════════════
// TTS / TOKEN
// ═══════════════════════════════════════

export interface QuestionWord {
  text: string;
  lang: TokenLang;
  vocabularyWord?: string;
}

export interface TranslationWord {
  text: string;
  en: string;
}

// ═══════════════════════════════════════
// LÜĞƏT
// ═══════════════════════════════════════

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleAz: string;
  acceptedAnswers?: string[];
  usageNote?: string;
  imageKey?: string;
  imageEmoji?: string;
}

// ═══════════════════════════════════════
// MƏŞQ
// ═══════════════════════════════════════

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  questionWords?: QuestionWord[];
  correctAnswer: string;
  fullSentence?: string;
  translationWords?: TranslationWord[];
  options?: string[];
  words?: string[];
  translationAz?: string;
  explanation: string;
  difficulty: number;
  questionLang?: Language;
  answerLang?: Language;
  optionLangs?: Language[];
  acceptedAnswers?: string[];
  mascotHint?: string;
}

export type SentenceDictionary = Record<string, string>;

// ═══════════════════════════════════════
// DƏRS FOKUSU
// ═══════════════════════════════════════

export type LessonFocus =
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'review';

// ═══════════════════════════════════════
// REVIEW TİPİ
// ═══════════════════════════════════════

export type ReviewType = 'sub_review' | 'module_review';

// ═══════════════════════════════════════
// DƏRS QRUPU (D1 / D2 / D3 / D4 / Final)
// ═══════════════════════════════════════

export type LessonGroup = 'd1' | 'd2' | 'd3' | 'd4' | 'final';

// ═══════════════════════════════════════
// DƏRS
// ═══════════════════════════════════════

export interface Lesson {
  // ═══ ƏSAS ═══
  id: string;
  title: string;
  titleAz: string;
  description: string;
  language: Language;
  level: Level;
  moduleId: string;
  order: number;
  xpReward: number;
  estimatedTime: number;

  // ═══ STRUKTUR ═══
  focus: LessonFocus;
  parentGroup: LessonGroup;
  subOrder: number;
  isReview: boolean;
  reviewType?: ReviewType;

  // ═══ MƏZMUN ═══
  vocabulary: VocabularyItem[];
  sentenceDictionary?: SentenceDictionary;
  exercises: Exercise[];

  // ═══ PEDAQOJİ KÖMƏKÇİ ═══
  canDo?: string;
  situation?: string;
  mascotIntro?: string;
}

// ═══════════════════════════════════════
// MODUL
// ═══════════════════════════════════════

export interface Module {
  id: string;
  title: string;
  titleAz: string;
  description: string;
  language: Language;
  level: Level;
  phase: number;
  order: number;
  icon: string;
  lessonIds: string[];
  finalReviewId?: string;
  hasSpeakingPractice?: boolean;
  speakingTitle?: string;
  speakingDescription?: string;
}

// ═══════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  correctCount: number;
  wrongCount: number;
  xpEarned: number;
  completedAt?: string;
}