// Every lesson that runs on the new screens (src/components/design/DesignLesson.tsx).
// Order matters: scripts/check-taught.cjs counts words as taught in this order.
import type { DesignLesson } from './designLessonTypes';
import { lesson1Design } from './lesson1Design';
import { unit1Lessons } from './unit1';
import { unit1Exam } from './unit1/exam';
import { unit2Exam, unit2Lessons } from './unit2';
import { unit3Exam, unit3Lessons } from './unit3';
import { withExplains } from './explainCards';

// Müəllim izahı cards are added to every lesson here (src/data/explainCards.ts, 21 Nov 2026).
export const designLessons: DesignLesson[] = [lesson1Design, ...unit1Lessons, ...unit1Exam, ...unit2Lessons, ...unit2Exam, ...unit3Lessons, ...unit3Exam].map(withExplains);
export const getDesignLesson = (id: string) => designLessons.find(l => l.id === id);
