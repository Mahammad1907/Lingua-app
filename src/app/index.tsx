import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Frame, FeatureTiles, Mascot } from '../components/onboarding/OnboardingUI';
import { usePreferences } from '../components/onboarding/usePreferences';
import { APP_NAME } from '../utils/onboarding';

export default function Index() {
  const router = useRouter();
  const p = usePreferences();
  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem('onboarding_completed').then(value => {
      if (!active) return;
      if (value === 'true') router.replace('/(tabs)');
      else { setChecking(false); setCheckError(null); }
    }).catch(() => { if (active) setCheckError('Başlanğıc məlumatları oxunmadı. Yenidən cəhd et.'); });
    return () => { active = false; };
  }, [router, attempt]);
  const start = () => void p.run(async () => {
    // Preserve an existing language choice; new English onboarding defaults to English.
    if (!(await AsyncStorage.getItem('selected_language'))) await AsyncStorage.setItem('selected_language', 'en');
    router.push('/onboarding/goal');
  });
  return <Frame step={1} title={`${APP_NAME}-a xoş gəlmisən!`}
    subtitle="İngilis dilini real ünsiyyətlə, addım-addım və maraqlı şəkildə öyrən."
    action="Başlayaq" onAction={start} ready={p.ready && !checking} busy={p.busy}
    error={checkError || p.error} retry={() => { p.retry(); setAttempt(v => v + 1); }}>
    <Mascot name="welcome" large />
    <FeatureTiles />
  </Frame>;
}
