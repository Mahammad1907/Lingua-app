// Bölmə 2 — "Şəxsi məlumat" (docs/BOLME_2_XERITESI.md). Map lessons 1–8; 26 Nov 2026: a lesson part is 8–12 screens, so
// lessons 1, 2, 4, 5, 6 have two parts, lesson 7 has four and lesson 3 has five (new parts: <id>_2, same file, second export).
// Card order per lesson is set with ordered() (same rule as Bölmə 1: no template, no screen type twice in a row).
import type { DesignLesson } from '../designLessonTypes';
import { lesson1a } from './lesson1a';
import { lesson1b } from './lesson1b';
import { lesson2, lesson2Part2 } from './lesson2';
import { lesson3a, lesson3aPart2 } from './lesson3a';
import { lesson3b, lesson3bPart2 } from './lesson3b';
import { lesson3c } from './lesson3c';
import { lesson4, lesson4Part2 } from './lesson4';
import { lesson5, lesson5Part2 } from './lesson5';
import { lesson6, lesson6Part2 } from './lesson6';
import { lesson7a, lesson7aPart2 } from './lesson7a';
import { lesson7b, lesson7bPart2 } from './lesson7b';
import { lesson8 } from './lesson8';
import { exam } from './exam';

export function ordered(lesson: DesignLesson, ids: string[]): DesignLesson {
  const byId = new Map(lesson.cards.map(c => [c.id.split('_').pop()!, c]));
  if (ids.length !== lesson.cards.length || ids.some(id => !byId.has(id))) throw new Error(`${lesson.id}: card order does not list every card`);
  return { ...lesson, cards: ids.map((id, i) => { const c = byId.get(id)!; return 'number' in c ? { ...c, number: i + 1 } : c; }) as DesignLesson['cards'] };
}

// Order: 1a, 1b, 2, 2_2, 3a, 3a_2, 3b, 3b_2, 3c, 4, 4_2, 5, 5_2, 6, 6_2, 7a, 7a_2, 7b, 7b_2, 8 (new parts have a temporary
// order = original + 0.5); the exam is order 22.
export const unit2Lessons: DesignLesson[] = [
  ordered(lesson1a, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c12', 'c11']),
  ordered(lesson1b, ['c01', 'c02', 'c05', 'c04', 'c03', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12']),
  ordered(lesson2, ['c01', 'c02', 'c03', 'c04', 'c05', 'c08', 'c07', 'c06']),
  ordered(lesson2Part2, ['c01', 'c09', 'c16', 'c10', 'c11', 'c12', 'c15', 'c13', 'c14']),
  ordered(lesson3a, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c13']),
  ordered(lesson3aPart2, ['c01', 'c09', 'c15', 'c10', 'c16', 'c14', 'c11', 'c12']),
  ordered(lesson3b, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c14']),
  ordered(lesson3bPart2, ['c01', 'c08', 'c17', 'c09', 'c10', 'c16', 'c11', 'c12', 'c15', 'c13']),
  ordered(lesson3c, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12']),
  ordered(lesson4, ['c01', 'c02', 'c07', 'c04', 'c05', 'c06', 'c10', 'c14']),
  ordered(lesson4Part2, ['c01', 'c08', 'c16', 'c12', 'c03', 'c15', 'c13', 'c11', 'c09']),
  ordered(lesson5, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c14', 'c07', 'c10', 'c11']),
  ordered(lesson5Part2, ['c01', 'c08', 'c15', 'c09', 'c17', 'c16', 'c12', 'c13']),
  ordered(lesson6, ['c01', 'c02', 'c03', 'c04', 'c16', 'c05', 'c06', 'c14', 'c15']),
  ordered(lesson6Part2, ['c01', 'c07', 'c08', 'c09', 'c13', 'c10', 'c17', 'c11', 'c12']),
  ordered(lesson7a, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09']),
  ordered(lesson7aPart2, ['c01', 'c14', 'c15', 'c10', 'c16', 'c11', 'c17', 'c12', 'c13']),
  ordered(lesson7b, ['c01', 'c02', 'c03', 'c13', 'c04', 'c05', 'c07', 'c14']),
  ordered(lesson7bPart2, ['c01', 'c06', 'c15', 'c08', 'c10', 'c16', 'c09', 'c12', 'c11']),
  ordered(lesson8, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c14', 'c12', 'c13']),
];
export const unit2Exam: DesignLesson[] = [exam];
