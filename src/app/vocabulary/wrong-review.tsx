import { Stack, useRouter } from 'expo-router';
import VocabularyTest, {
  VocabularyTestResult,
} from '../../components/VocabularyTest';
import { useVocabularyStore } from '../../store/vocabularyStore';

export default function WrongReviewScreen() {
  const router = useRouter();

  const allWords = useVocabularyStore((s) => s.allWords);
  const wrongWords = useVocabularyStore((s) => s.wrongWords);
  const removeWrongWord = useVocabularyStore((s) => s.removeWrongWord);

  // ═══ Səhv sözləri tam obyektlərə çevir ═══
  const wrongWordObjects = wrongWords
    .map((ww) => allWords.find((w) => w.id === ww.wordId))
    .filter((w): w is NonNullable<typeof w> => w !== undefined);

  // ═══ Düzgün cavablandırılan sözləri səhv siyahısından sil ═══
  const handleFinish = (result: VocabularyTestResult) => {
    result.correctWordIds.forEach((wordId) => {
      removeWrongWord(wordId);
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <VocabularyTest
        words={wrongWordObjects}
        title="Səhv sözlər"
        onFinish={handleFinish}
        onBack={handleBack}
        emptyMessage="Səhv söz yoxdur"
      />
    </>
  );
}