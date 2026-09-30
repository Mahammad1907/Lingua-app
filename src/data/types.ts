export type Language = 'en' | 'de' | 'ru';
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ExerciseType =
  | 'multiple_choice'
  | 'translation'
  | 'sentence_build'
  | 'fill_blank';

export type TokenLang = Language | 'az' | 'punctuation';

export interface QuestionWord {
  text: string;
  lang: TokenLang;
  vocabularyWord?: string;
}

export interface TranslationWord {
  text: string;
  en: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleAz: string;
  acceptedAnswers?: string[];
}

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
}

export type SentenceDictionary = Record<string, string>;

export interface Lesson {
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
  vocabulary: VocabularyItem[];
  sentenceDictionary?: SentenceDictionary;
  exercises: Exercise[];
}

// ═══════════════════════════════════════
// MODUL (Module)
// ═══════════════════════════════════════
export interface Module {
  id: string;
  title: string;
  titleAz: string;
  /** Qısa açıqlama — ekranın yuxarısında göstərilir */
  description: string;
  language: Language;
  level: Level;
  order: number;
  /** Modul üçün emoji/ikon */
  icon: string;
  /** Modul daxilindəki dərs ID-ləri — sıra ilə */
  lessonIds: string[];
  /** Modul sonunda speaking practice var? */
  hasSpeakingPractice?: boolean;
  /** Speaking practice kartı üçün başlıq */
  speakingTitle?: string;
  /** Speaking practice kartı üçün açıqlama */
  speakingDescription?: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  correctCount: number;
  wrongCount: number;
  xpEarned: number;
  completedAt?: string;
}