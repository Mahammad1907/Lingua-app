// Bölmə 1 lessons written for the new screens. Lesson 1 lives in ../lesson1Design.ts.
import type { DesignLesson } from '../designLessonTypes';
import { lesson2 } from './lesson2';
import { lesson3 } from './lesson3';
import { lesson4 } from './lesson4';
import { lesson5 } from './lesson5';
import { lesson6 } from './lesson6';
import { lesson7 } from './lesson7';
import { lesson8 } from './lesson8';

// Screen order per lesson (user, 13 Nov 2026): lessons must not follow one template, the same screen type never
// comes twice in a row, and speaking is spread through the lesson instead of piling up at the end.
// Card numbers follow the new order. scripts/check-taught.cjs and check-unit1.cjs verify the result.
function ordered(lesson: DesignLesson, ids: string[]): DesignLesson {
  const byId = new Map(lesson.cards.map(c => [c.id.split('_').pop()!, c]));
  if (ids.length !== lesson.cards.length || ids.some(id => !byId.has(id))) throw new Error(`${lesson.id}: card order does not list every card`);
  return { ...lesson, cards: ids.map((id, i) => { const c = byId.get(id)!; return 'number' in c ? { ...c, number: i + 1 } : c; }) as DesignLesson['cards'] };
}

export const unit1Lessons: DesignLesson[] = [
  ordered(lesson2, ['c01', 'c02', 'c08', 'c02b', 'c04', 'c03', 'c05', 'c06', 'c07', 'c09', 'c10']),
  ordered(lesson3, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c06b', 'c13', 'c10', 'c08', 'c09', 'c11', 'c12']),
  ordered(lesson4, ['c01', 'c03', 'c02', 'c04', 'c06', 'c04c', 'c05', 'c10', 'c04b', 'c07', 'c08', 'c11', 'c09', 'c12']),
  ordered(lesson5, ['c01', 'c02', 'c03', 'c04', 'c05', 'c11', 'c05b', 'c06', 'c07', 'c08', 'c09', 'c13', 'c12', 'c10']),
  ordered(lesson6, ['c01', 'c03', 'c02', 'c04', 'c05', 'c04b', 'c06', 'c11', 'c07', 'c08', 'c12', 'c09', 'c10', 'c13']),
  ordered(lesson7, ['c01', 'c03', 'c02', 'c04', 'c05', 'c11', 'c04b', 'c06', 'c09', 'c07', 'c12', 'c08', 'c10', 'c13']),
  ordered(lesson8, ['c01', 'c02', 'c03', 'c04', 'c10', 'c05', 'c06', 'c11', 'c13', 'c07', 'c09', 'c08', 'c12']),
];
