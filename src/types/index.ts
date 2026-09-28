// 🏷️ Lingua App — Tiplər (TypeScript)

// ============ DİL ============
export type Language = 'en' | 'de' | 'ru';

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// ============ İSTİFADƏÇİ ============
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  nativeLanguage: string;      // Ana dili (az)
  learningLanguage: Language;  // Öyrəndiyi dil
  level: Level;                // Səviyyə
  xp: number;                  // Təcrübə xalı
  streak: number;              // Ardıcıllıq
  hearts: number;              // Ürəklər
  createdAt: string;
}

// ============ DƏRS ============
export interface Lesson {
  id: string;
  title: string;
  description: string;
  language: Language;
  level: Level;
  moduleId: string;
  order: number;
  exercises: Exercise[];
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  language: Language;
  level: Level;
  order: number;
  lessons: Lesson[];
}

// ============ MƏŞQLƏR ============
export type ExerciseType =
  | 'multiple_choice'    // Variant seç
  | 'translation'        // Tərcümə
  | 'sentence_build'     // Cümlə qur
  | 'listening'          // Dinləmə
  | 'reading'            // Oxuma
  | 'writing'            // Yazma
  | 'pronunciation'      // Tələffüz
  | 'match_pairs';       // Cüt tap

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  correctAnswer: string;
  options?: string[];      // Variantlı suallar üçün
  audioUrl?: string;       // Dinləmə üçün
  hint?: string;           // İpucu
  explanation?: string;    // İzah
}

// ============ İRƏLİLƏYİŞ ============
export interface Progress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;           // 0-100
  attempts: number;        // Cəhd sayı
  lastAttempt: string;
  mistakes: string[];      // Səhv etdiyi sual ID-ləri
}

// ============ NAVİQASİYA ============
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  'lesson/[id]': { id: string };
  'placement-test': undefined;
};