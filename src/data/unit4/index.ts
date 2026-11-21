// Bölmə 4 — "Ailə və insanlar" (docs/BOLME_4_XERITESI.md). Map lessons 1–8; lesson 2 has two parts.
// Cards are written in their final order in each lesson file; numbered() only renumbers them 1…n.
import type { DesignLesson } from '../designLessonTypes';
import { lesson1 } from './lesson1';
import { lesson2a } from './lesson2a';
import { lesson2b } from './lesson2b';
import { lesson3 } from './lesson3';
import { lesson4 } from './lesson4';
import { lesson5 } from './lesson5';
import { lesson6 } from './lesson6';
import { lesson7 } from './lesson7';
import { lesson8 } from './lesson8';
import { exam } from './exam';

export function numbered(lesson: DesignLesson): DesignLesson {
  return { ...lesson, cards: lesson.cards.map((c, i) => ('number' in c ? { ...c, number: i + 1 } : c)) as DesignLesson['cards'] };
}

// Order: 1, 2a, 2b, 3, 4, 5, 6, 7, 8 (orders 35–43); the exam is order 44.
export const unit4Lessons: DesignLesson[] = [lesson1, lesson2a, lesson2b, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8].map(numbered);
export const unit4Exam: DesignLesson[] = [numbered(exam)];
