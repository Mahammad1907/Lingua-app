import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { defaultPreferences, ONBOARDING_KEY, parsePreferences } from '../../utils/onboarding';

export function usePreferences() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedLevel, setStoredLevel] = useState<string | null>(null);
  const [placementScore, setPlacementScore] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  const pending = useRef(false);
  const request = useRef(0);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const current = ++request.current;
    setReady(false); setError(null);
    try {
      const values = await AsyncStorage.multiGet([ONBOARDING_KEY, 'user_level', 'placement_score', 'selected_language']);
      if (current !== request.current) return;
      const data = Object.fromEntries(values);
      setPreferences(parsePreferences(data[ONBOARDING_KEY], data.user_level));
      setStoredLevel(data.user_level); setPlacementScore(data.placement_score);
      setLanguage(data.selected_language || 'en'); setReady(true);
    } catch { if (current === request.current) setError('Seçimlər oxunmadı. Yenidən cəhd et.'); }
  }, []);
  useFocusEffect(useCallback(() => {
    void load();
    return () => { request.current += 1; };
  }, [load]));
  // Commit only on explicit Continue; a failed write never navigates or completes onboarding.
  const run = async (work: () => Promise<void>) => {
    if (!ready || pending.current) return;
    pending.current = true; setBusy(true); setError(null);
    try { await work(); } catch { setError('Seçimlər saxlanmadı. Yenidən cəhd et.'); }
    finally { pending.current = false; setBusy(false); }
  };
  const save = () => AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(preferences));
  return { preferences, setPreferences, ready, error, busy, run, save, storedLevel, placementScore, language, retry: () => void load() };
}
