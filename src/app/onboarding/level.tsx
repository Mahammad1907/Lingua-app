import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import { Choices, Frame, Mascot, s } from '../../components/onboarding/OnboardingUI';
import { usePreferences } from '../../components/onboarding/usePreferences';
import { levels, type LevelId } from '../../utils/onboarding';

export default function LevelSelection() {
  const router = useRouter();
  const p = usePreferences();
  const languageName = p.language === 'de' ? 'Alman' : p.language === 'ru' ? 'Rus' : 'İngilis';
  const next = () => void p.run(async () => {
    await p.save();
    if (p.preferences.levelChoice === 'unknown') {
      // Keep the existing placement questions, scoring, result and destination unchanged.
      // A previous completed score must not stand in for this newly requested test.
      await AsyncStorage.removeItem('placement_score');
      await AsyncStorage.setItem('user_level', 'test');
      router.push('/onboarding/placement');
    } else {
      await AsyncStorage.setItem('user_level', levels.find(l => l.id === p.preferences.levelChoice)!.code!);
      router.push('/onboarding/welcome');
    }
  });
  return <Frame step={3} back={() => router.canGoBack() ? router.back() : router.replace('/onboarding/goal')}
    title={<>{languageName} dilini <Text style={s.orange}>nə qədər</Text> bilirsən?</>}
    subtitle="Başlanğıc səviyyəni seç. Bu seçim test nəticəsi deyil." action="Davam et" onAction={next}
    ready={p.ready} busy={p.busy} error={p.error} retry={p.retry}>
    <Mascot name="welcome" />
    <Choices options={levels.map(l => ({ ...l, description: l.description.replace('İngilis', languageName) }))}
      selected={p.preferences.levelChoice} disabled={p.busy}
      onSelect={id => p.setPreferences(v => ({ ...v, levelChoice: id as LevelId }))} />
  </Frame>;
}
