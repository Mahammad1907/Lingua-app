import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import VocabularyTest, {
  VocabularyTestResult,
} from '../../components/VocabularyTest';
import { useVocabularyStore } from '../../store/vocabularyStore';

export default function VocabularyTestScreen() {
  const params = useLocalSearchParams<{ number: string }>();
  const pageNumber = parseInt(params.number || '1');
  const router = useRouter();

  const pages = useVocabularyStore((s) => s.pages);
  const saveTestResult = useVocabularyStore((s) => s.saveTestResult);

  const page = pages.find((p) => p.pageNumber === pageNumber);

  const handleFinish = (result: VocabularyTestResult) => {
    if (!page) return;

    saveTestResult(
      pageNumber,
      result.correct,
      result.wrong,
      result.wrongWordIds,
      result.correctWordIds
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <VocabularyTest
        words={page ? page.words : []}
        title={`Səhifə ${pageNumber} · Test`}
        onFinish={handleFinish}
        onBack={handleBack}
        emptyMessage="Səhifə tapılmadı"
      />
    </>
  );
}