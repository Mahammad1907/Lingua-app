// Bölmə 4 — "Ailə və insanlar" (docs/BOLME_4_XERITESI.md). Map lessons 1–8; 26 Nov 2026: lessons 1, 3–7 have two parts, lesson 2 four.
// Cards are written in their final order in each lesson file; numbered() only renumbers them 1…n.
import type { DesignLesson } from '../designLessonTypes';
import { lesson1, lesson1_2 } from './lesson1';
import { lesson2a, lesson2a_2 } from './lesson2a';
import { lesson2b, lesson2b_2 } from './lesson2b';
import { lesson3, lesson3_2 } from './lesson3';
import { lesson4, lesson4_2 } from './lesson4';
import { lesson5, lesson5_2 } from './lesson5';
import { lesson6, lesson6_2 } from './lesson6';
import { lesson7, lesson7_2 } from './lesson7';
import { lesson8 } from './lesson8';
import { exam } from './exam';

export function numbered(lesson: DesignLesson): DesignLesson {
  return { ...lesson, cards: lesson.cards.map((c, i) => ('number' in c ? { ...c, number: i + 1 } : c)) as DesignLesson['cards'] };
}

// Order: each part right after its first part (new parts have order + 0.5); the exam is order 44.
export const unit4Lessons: DesignLesson[] = [lesson1, lesson1_2, lesson2a, lesson2a_2, lesson2b, lesson2b_2, lesson3, lesson3_2, lesson4, lesson4_2, lesson5, lesson5_2, lesson6, lesson6_2, lesson7, lesson7_2, lesson8].map(numbered);
export const unit4Exam: DesignLesson[] = [numbered(exam)];
