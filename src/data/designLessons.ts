// Every lesson that runs on the new screens (src/components/design/DesignLesson.tsx).
import type { DesignLesson } from './designLessonTypes';
import { lesson1Design } from './lesson1Design';
import { unit1Lessons } from './unit1';

export const designLessons: DesignLesson[] = [lesson1Design, ...unit1Lessons];
export const getDesignLesson = (id: string) => designLessons.find(l => l.id === id);
