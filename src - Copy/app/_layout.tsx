import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useVocabularyStore } from '../store/vocabularyStore';

export default function RootLayout() {
  const loadUser = useUserStore((state) => state.loadFromStorage);
  const checkDailyStreak = useUserStore((state) => state.checkDailyStreak);
  const loadVocab = useVocabularyStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadUser().then(() => {
      checkDailyStreak();
    });
    loadVocab();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a1a' },
        }}
      />
    </>
  );
}