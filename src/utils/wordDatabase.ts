// ═══════════════════════════════════════
// SÖZ BAZASI
// lessons.ts-dən bütün sözləri yığıb Set-lərə yığır.
// Lazy build: ilk istifadədə 1 dəfə qurulur, sonra cache.
// ═══════════════════════════════════════

import { lessons } from '../data/lessons';
import { Language as LessonLanguage } from '../data/types';

/**
 * Cavabın dili — dərs dili + 'az' (Azərbaycan tərcümələri üçün)
 */
export type AnswerLanguage = LessonLanguage | 'az';

interface WordDatabase {
  en: Set<string>;
  de: Set<string>;
  ru: Set<string>;
  az: Set<string>;
}

let cachedDatabase: WordDatabase | null = null;

/**
 * Söz bazasını qurur (yalnız 1 dəfə).
 * Növbəti çağırışlarda cache-dən qaytarır.
 */
export function getWordDatabase(): WordDatabase {
  if (cachedDatabase) return cachedDatabase;

  const db: WordDatabase = {
    en: new Set(),
    de: new Set(),
    ru: new Set(),
    az: new Set(),
  };

  for (const lesson of lessons) {
    const lessonLang = lesson.language as LessonLanguage;

    // ═══ 1) Xarici sözlər (vocabulary.word) ═══
    for (const v of lesson.vocabulary) {
      const word = v.word.toLowerCase().trim();
      if (word) {
        db[lessonLang].add(word);
      }
    }

    // ═══ 2) Azərbaycan tərcümələri (vocabulary.translation) ═══
    for (const v of lesson.vocabulary) {
      const translation = v.translation.toLowerCase().trim();
      if (translation) {
        db.az.add(translation);
      }
    }

    // ═══ 3) sentenceDictionary — yalnız tək sözlər ═══
    if (lesson.sentenceDictionary) {
      for (const key of Object.keys(lesson.sentenceDictionary)) {
        const normalized = key.toLowerCase().trim();
        // Yalnız tək söz (boşluq yoxdur)
        if (normalized && !normalized.includes(' ')) {
          db[lessonLang].add(normalized);
        }
      }
    }
  }

  cachedDatabase = db;
  return db;
}

/**
 * Müəyyən dildə sözün bazada olub-olmadığını yoxlayır.
 */
export function isWordInDatabase(
  word: string,
  language: AnswerLanguage
): boolean {
  const db = getWordDatabase();
  return db[language].has(word.toLowerCase().trim());
}

/**
 * Test/debug üçün — bazanı sıfırlayır.
 */
export function resetWordDatabase(): void {
  cachedDatabase = null;
}