// Bölmə 3 — "Haradansan" (docs/BOLME_3_XERITESI.md). Map lessons 1–8 in 20 parts (26 Nov 2026: every part 8–12 screens):
// lessons 1, 4, 6, 7 have two parts, lesson 5 three, lessons 2 and 3 four; lesson 8 is one.
// Cards are written in their final order in each lesson file; numbered() only renumbers them 1…n.
// Same rules as Bölmə 1–2: no template, no screen type twice in a row (scripts/check-taught.cjs).
import type { DesignLesson } from '../designLessonTypes';
import { lesson1, lesson1_2 } from './lesson1';
import { lesson2a, lesson2a_2 } from './lesson2a';
import { lesson2b, lesson2b_2 } from './lesson2b';
import { lesson3a, lesson3a_2 } from './lesson3a';
import { lesson3b, lesson3b_2 } from './lesson3b';
import { lesson4, lesson4_2 } from './lesson4';
import { lesson5a } from './lesson5a';
import { lesson5b, lesson5b_2 } from './lesson5b';
import { lesson6, lesson6_2 } from './lesson6';
import { lesson7, lesson7_2 } from './lesson7';
import { lesson8 } from './lesson8';
import { exam } from './exam';

export function numbered(lesson: DesignLesson): DesignLesson {
  return { ...lesson, cards: lesson.cards.map((c, i) => ('number' in c ? { ...c, number: i + 1 } : c)) as DesignLesson['cards'] };
}

// Order: orders 23–33; the new parts (…_2) have order + 0.5 until the orders are renumbered. The exam is order 34.
export const unit3Lessons: DesignLesson[] = [lesson1, lesson1_2, lesson2a, lesson2a_2, lesson2b, lesson2b_2, lesson3a, lesson3a_2, lesson3b, lesson3b_2, lesson4, lesson4_2, lesson5a, lesson5b, lesson5b_2, lesson6, lesson6_2, lesson7, lesson7_2, lesson8].map(numbered);
export const unit3Exam: DesignLesson[] = [numbered(exam)];
