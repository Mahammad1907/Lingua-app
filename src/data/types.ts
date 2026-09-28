// 📘 BirTalk — Dərs Tipləri (Data Structure)

export type Language = 'en' | 'de' | 'ru';
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ExerciseType =
  | 'multiple_choice'
  | 'translation'
  | 'sentence_build'
  | 'fill_blank';

// ═══════════════════════════════════════
// SÖZ (Vocabulary)
// ═══════════════════════════════════════
export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleAz: string;
  acceptedAnswers?: string[];
}

// ═══════════════════════════════════════
// MƏŞQ (Exercise)
// ═══════════════════════════════════════
export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  correctAnswer: string;
  options?: string[];
  words?: string[];
  translationAz?: string;
  explanation: string;
  difficulty: number;

  // ═══ DİL MƏLUMATI — TTS üçün ═══
  questionLang?: Language;
  answerLang?: Language;
  optionLangs?: Language[];
}

// ═══════════════════════════════════════
// DƏRS (Lesson)
// ═══════════════════════════════════════
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
  exercises: Exercise[];
}

// ═══════════════════════════════════════
// MODUL (Module)
// ═══════════════════════════════════════
export interface Module {
  id: string;
  title: string;
  titleAz: string;
  language: Language;
  level: Level;
  order: number;
  lessonIds: string[];
}

// ═══════════════════════════════════════
// DƏRS PROGRESS
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