import { warmLessonArtwork } from '../utils/lessonAssets';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Text, View, Pressable } from 'react-native';
import { useUserStore } from '../store/userStore';
import { useVocabularyStore } from '../store/vocabularyStore';

export default function RootLayout() {
  const loadUser = useUserStore((state) => state.loadFromStorage);
  const hydrated = useUserStore((state) => state.hydrated);
  const storageError = useUserStore((state) => state.storageError);
  const loadVocab = useVocabularyStore((state) => state.loadFromStorage);
  const vocabReady = useVocabularyStore(state => state.hydrated);
  const vocabError = useVocabularyStore(state => state.storageError);

  useEffect(() => {
    void warmLessonArtwork();
    void loadUser();
    void loadVocab().catch(() => {});
  }, [loadUser, loadVocab]);
  useEffect(() => {
    if (hydrated && vocabReady) void useVocabularyStore.getState().reconcileCompletedLessons(useUserStore.getState().completedLessons).catch(() => {});
  }, [hydrated, vocabReady]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') useUserStore.getState().checkDailyStreak();
    });
    return () => listener.remove();
  }, []);

  if (!hydrated || !vocabReady) return <View style={{ flex: 1, backgroundColor: '#0a0a1a', justifyContent: 'center', padding: 24 }}>
    <Text style={{ color: '#fff', textAlign: 'center' }}>{storageError || vocabError || 'İrəliləyiş yüklənir…'}</Text>
    {storageError || vocabError ? <Pressable onPress={() => { void loadUser().catch(() => {}); void loadVocab().catch(() => {}); }}><Text style={{ color: '#ffb24d', textAlign: 'center', padding: 16 }}>Yenidən cəhd et</Text></Pressable> : null}
  </View>;

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
