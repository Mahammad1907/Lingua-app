import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import EnergyMeter from '../../components/EnergyMeter';
import { useUserStore } from '../../store/userStore';
import { moduleTest, moduleUnlocked } from '../../utils/moduleAccess';
import { isSessionAnswerCorrect } from '../../utils/sessionAnswer';

export default function ModuleCheck() {
  const { moduleId } = useLocalSearchParams<{ moduleId?: string }>();
  return <Exam key={moduleId ?? 'missing'} moduleId={moduleId ?? ''} />;
}
function Exam({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const test = moduleTest(moduleId);
  const completed = useUserStore((s) => s.completedLessons);
  const results = useUserStore((s) => s.placementResults);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const answers = useRef<Record<string, boolean>>({});
  const busy = useRef(false);
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState<{ passed: boolean; xp: number; correct: number } | null>(null);
  const [enteredLocked] = useState(() => !moduleUnlocked(moduleId, completed, results));
  const question = test?.questions[index];
  const check = () => {
    if (!question || !answer.trim() || question.id in answers.current) return;
    const correct = isSessionAnswerCorrect(answer, question.correctAnswer, question.answerLang ?? 'en', question.acceptedAnswers,
      question.type === 'translation' || question.type === 'fill_blank');
    answers.current[question.id] = correct;
    if (!correct) useUserStore.getState().loseHeart();
    setChecked(true);
  };
  const next = async () => {
    if (!test || !question || !checked || busy.current) return;
    if (index + 1 < test.questions.length) { setIndex(index + 1); setAnswer(''); setChecked(false); return; }
    busy.current = true; setError('');
    try { setOutcome(await useUserStore.getState().finishExam(moduleId, answers.current)); }
    catch { setError('Nəticə saxlanmadı. Yenidən cəhd et.'); }
    finally { busy.current = false; }
  };
  return <View style={s.screen}>
    <Stack.Screen options={{ title: 'Keçid imtahanı', headerShown: true }} />
    <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <EnergyMeter />
      {!test || !enteredLocked ? <Text style={s.title}>{!test ? 'Bu bölmə üçün sınaq hələ hazır deyil' : 'Bölmə artıq açıqdır'}</Text>
        : outcome ? <>
          <Text style={s.title}>{outcome.passed ? 'Bölmənin kilidi açıldı' : 'Bir az da məşq et'}</Text>
          <Text style={s.text}>{outcome.correct}/{test.questions.length} düzgün · +{outcome.xp} XP</Text>
          <Text style={s.text}>Dərslərin tamamlanma faizi dəyişməyib.</Text>
        </> : question ? <>
          <Text style={s.text}>{index + 1}/{test.questions.length} · Keçid həddi {Number.isFinite(test.passScore) ? test.passScore : 80}%</Text>
          <Text style={s.title}>{question.question}</Text>
          {question.type === 'multiple_choice' ? question.options?.map((option, i) =>
            <TouchableOpacity key={`${question.id}:${i}`} disabled={checked} accessibilityState={{ selected: answer === option }}
              style={[s.option, answer === option && s.selected]} onPress={() => setAnswer(option)}><Text style={s.text}>{option}</Text></TouchableOpacity>)
            : <TextInput accessibilityLabel="Cavabın" editable={!checked} value={answer} onChangeText={setAnswer} autoCorrect={false} autoCapitalize="none" style={s.input} />}
          {checked ? <Text style={s.text}>{answers.current[question.id] ? 'Düzdür' : `Düzgün cavab: ${question.correctAnswer}`}</Text> : null}
          <TouchableOpacity disabled={!answer.trim()} style={[s.button, !answer.trim() && { opacity: .4 }]} onPress={() => checked ? void next() : check()}>
            <Text style={s.dark}>{checked ? index + 1 === test.questions.length ? 'Sınağı bitir' : 'Davam et' : 'Yoxla'}</Text>
          </TouchableOpacity>
        </> : null}
      {error ? <Text accessibilityLiveRegion="polite" style={s.text}>{error}</Text> : null}
      <TouchableOpacity style={s.option} onPress={() => outcome?.passed ? router.replace({ pathname: '/module/[id]', params: { id: moduleId } }) : router.back()}>
        <Text style={s.text}>{outcome?.passed ? 'Bölməyə keç' : 'Geri'}</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>;
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1020' }, content: { padding: 20, gap: 16 }, title: { color: '#faf5ff', fontSize: 23, fontWeight: '800' },
  text: { color: '#d2c6e9', fontSize: 15, lineHeight: 23 }, option: { padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#38305e', backgroundColor: '#171b34' },
  selected: { borderColor: '#ff9b35' }, input: { padding: 16, color: '#fff', borderWidth: 1, borderColor: '#ac92f0', borderRadius: 14 },
  button: { backgroundColor: '#ff9b35', padding: 16, alignItems: 'center', borderRadius: 14 }, dark: { color: '#211822', fontSize: 16, fontWeight: '800' },
});
