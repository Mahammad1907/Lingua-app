// The map opens where the learner last was (user, 21 Nov 2026): the section and lesson last opened from the map.
// Kept apart from lesson progress, so it never changes results.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const KEY = '@birtalk_last_opened_v1';

interface LastOpenedState {
  section: number | null; lessonId: string | null; hydrated: boolean;
  load: () => Promise<void>;
  remember: (section: number, lessonId: string) => void;
}

export const useLastOpenedStore = create<LastOpenedState>((set, get) => ({
  section: null, lessonId: null, hydrated: false,
  load: async () => {
    if (get().hydrated) return;
    try {
      const raw = await AsyncStorage.getItem(KEY);
      const saved: unknown = raw ? JSON.parse(raw) : null;
      if (saved && typeof saved === 'object') {
        const { section, lessonId } = saved as { section?: unknown; lessonId?: unknown };
        set({ section: typeof section === 'number' ? section : null, lessonId: typeof lessonId === 'string' ? lessonId : null });
      }
    } catch { /* A broken value only means the map opens at the first unfinished section. */ }
    set({ hydrated: true });
  },
  remember: (section, lessonId) => {
    set({ section, lessonId });
    void AsyncStorage.setItem(KEY, JSON.stringify({ section, lessonId })).catch(() => {});
  },
}));
