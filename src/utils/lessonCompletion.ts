import { Lesson } from '../data/types';
import { useUserStore } from '../store/userStore';
import { useVocabularyStore } from '../store/vocabularyStore';

// Səs və oyuna uydurma qiymət vermədən yalnız yazılı məşqləri saxla.
export function completeLessonSession(lesson: Lesson, correctCount: number) {
  const total = lesson.exercises.length;
  const correct = Number.isFinite(correctCount)
    ? Math.max(0, Math.min(total, Math.floor(correctCount)))
    : 0;
  const user = useUserStore.getState();
  const alreadyCompleted = user.completedLessons.includes(lesson.id);
  user.markLessonComplete(lesson.id, correct, total - correct, lesson.xpReward);
  if (!alreadyCompleted) user.addXP(lesson.xpReward);
  useVocabularyStore.getState().addLessonWords(lesson.id);
  return { correct, total, wrong: total - correct };
}
