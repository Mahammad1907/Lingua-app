// Every lesson that runs on the new screens (src/components/design/DesignLesson.tsx).
// Order matters: scripts/check-taught.cjs counts words as taught in this order.
import type { DesignLesson } from './designLessonTypes';
import { lesson1Design } from './lesson1Design';
import { unit1Lessons } from './unit1';
import { unit1Exam } from './unit1/exam';
import { unit2Exam, unit2Lessons } from './unit2';

export const designLessons: DesignLesson[] = [lesson1Design, ...unit1Lessons, ...unit1Exam, ...unit2Lessons, ...unit2Exam];
export const getDesignLesson = (id: string) => designLessons.find(l => l.id === id);
