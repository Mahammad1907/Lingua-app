import { useUserStore } from '../store/userStore';
import { useVocabularyStore } from '../store/vocabularyStore';

export async function completeLessonSession(attemptId: string) {
  const receipt = await useUserStore.getState().finishLesson(attemptId);
  if (receipt.completed) useVocabularyStore.getState().addLessonWords(receipt.lessonId);
  return { correct: receipt.correct, total: receipt.total, wrong: receipt.total - receipt.correct, receiptId: receipt.id };
}
