import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import { Choices, Frame, Mascot, s } from '../../components/onboarding/OnboardingUI';
import { usePreferences } from '../../components/onboarding/usePreferences';
import { goals, type GoalId } from '../../utils/onboarding';

export default function GoalSelection() {
  const router = useRouter();
  const p = usePreferences();
  return <Frame step={2} back={() => router.back()} title={<>Sənin <Text style={s.orange}>məqsədin</Text> nədir?</>}
    subtitle="Dili hansı məqsədlə öyrənmək istəyirsən?" action="Davam et"
    ready={p.ready} busy={p.busy} error={p.error} retry={p.retry}
    onAction={() => void p.run(async () => { await p.save(); router.push('/onboarding/level'); })}>
    <Mascot name="goal" />
    <Choices options={goals} selected={p.preferences.goal} disabled={p.busy}
      onSelect={id => p.setPreferences(v => ({ ...v, goal: id as GoalId }))} />
  </Frame>;
}
