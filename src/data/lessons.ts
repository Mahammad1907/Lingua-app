import { Lesson } from './types';

// ═══════════════════════════════════════
// DƏRSLƏR
// ═══════════════════════════════════════
// Yeni akademik struktur:
//   Modul → D1/D2/D3/D4 → Sub-dərslər → Review
// ═══════════════════════════════════════

export const lessons: Lesson[] = [
  // Yeni dərslər buraya əlavə olunacaq
];

// ═══════════════════════════════════════
// KÖMƏKÇI FUNKSİYALAR
// ═══════════════════════════════════════

export const getLessonById = (id: string): Lesson | undefined => {
  return lessons.find((l) => l.id === id);
};

export const getLessonsByLevel = (level: string): Lesson[] => {
  return lessons.filter((l) => l.level === level);
};

export const getLessonsByLanguage = (language: string): Lesson[] => {
  return lessons.filter((l) => l.language === language);
};

export const getNextLesson = (currentId: string): Lesson | undefined => {
  const current = getLessonById(currentId);
  if (!current) return undefined;

  return lessons.find(
    (l) => l.order === current.order + 1 && l.language === current.language
  );
};