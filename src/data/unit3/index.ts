// Bölmə 3 — "Haradansan" (docs/BOLME_3_XERITESI.md). Map lessons 1–8; lessons 2, 3 and 5 have two parts.
// Cards are written in their final order in each lesson file; numbered() only renumbers them 1…n.
// Same rules as Bölmə 1–2: no template, no screen type twice in a row (scripts/check-taught.cjs).
import type { DesignLesson } from '../designLessonTypes';
import { lesson1 } from './lesson1';
import { lesson2a } from './lesson2a';
import { lesson2b } from './lesson2b';
import { lesson3a } from './lesson3a';
import { lesson3b } from './lesson3b';
import { lesson4 } from './lesson4';
import { lesson5a } from './lesson5a';
import { lesson5b } from './lesson5b';
import { lesson6 } from './lesson6';
import { lesson7 } from './lesson7';
import { lesson8 } from './lesson8';
import { exam } from './exam';

export function numbered(lesson: DesignLesson): DesignLesson {
  return { ...lesson, cards: lesson.cards.map((c, i) => ('number' in c ? { ...c, number: i + 1 } : c)) as DesignLesson['cards'] };
}

// Order: 1, 2a, 2b, 3a, 3b, 4, 5a, 5b, 6, 7, 8 (orders 23–33); the exam is order 34.
export const unit3Lessons: DesignLesson[] = [lesson1, lesson2a, lesson2b, lesson3a, lesson3b, lesson4, lesson5a, lesson5b, lesson6, lesson7, lesson8].map(numbered);
export const unit3Exam: DesignLesson[] = [numbered(exam)];
