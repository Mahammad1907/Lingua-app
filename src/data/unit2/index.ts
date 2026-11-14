// Bölmə 2 — "Şəxsi məlumat" (docs/BOLME_2_XERITESI.md). Map lessons 1–8; lessons 1, 3 and 7 have two parts.
// Card order per lesson is set with ordered() (same rule as Bölmə 1: no template, no screen type twice in a row).
import type { DesignLesson } from '../designLessonTypes';
import { lesson1a } from './lesson1a';
import { lesson1b } from './lesson1b';
import { lesson2 } from './lesson2';
import { lesson3a } from './lesson3a';
import { lesson3b } from './lesson3b';
import { lesson4 } from './lesson4';
import { lesson5 } from './lesson5';
import { lesson6 } from './lesson6';
import { lesson7a } from './lesson7a';
import { lesson7b } from './lesson7b';
import { lesson8 } from './lesson8';
import { exam } from './exam';

export function ordered(lesson: DesignLesson, ids: string[]): DesignLesson {
  const byId = new Map(lesson.cards.map(c => [c.id.split('_').pop()!, c]));
  if (ids.length !== lesson.cards.length || ids.some(id => !byId.has(id))) throw new Error(`${lesson.id}: card order does not list every card`);
  return { ...lesson, cards: ids.map((id, i) => { const c = byId.get(id)!; return 'number' in c ? { ...c, number: i + 1 } : c; }) as DesignLesson['cards'] };
}

// Order: 1a, 1b, 2, 3a, 3b, 4, 5, 6, 7a, 7b, 8 (orders 10–20); the exam is order 21.
export const unit2Lessons: DesignLesson[] = [
  ordered(lesson1a, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c12', 'c11']),
  ordered(lesson1b, ['c01', 'c02', 'c05', 'c04', 'c03', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12']),
  ordered(lesson2, ['c01', 'c02', 'c03', 'c04', 'c05', 'c08', 'c07', 'c06', 'c09', 'c10', 'c11', 'c12', 'c13', 'c14']),
  ordered(lesson3a, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12', 'c13']),
  ordered(lesson3b, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12', 'c13', 'c14']),
  ordered(lesson4, ['c01', 'c02', 'c07', 'c04', 'c05', 'c06', 'c10', 'c08', 'c12', 'c03', 'c13', 'c11', 'c09']),
  ordered(lesson5, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12', 'c13']),
  ordered(lesson6, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c13', 'c10', 'c11', 'c12']),
  ordered(lesson7a, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12', 'c13']),
  ordered(lesson7b, ['c01', 'c02', 'c13', 'c04', 'c05', 'c06', 'c07', 'c08', 'c03', 'c10', 'c09', 'c12', 'c14', 'c11']),
  ordered(lesson8, ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c14', 'c12', 'c13']),
];
export const unit2Exam: DesignLesson[] = [exam];
