// Review schedule (src/utils/spacedReview.ts), kept in its own storage key so it never touches the lesson/reward snapshot.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { localDay } from '../utils/rewards';
import { dueItems, gradeItem, registerItem, SESSION_SIZE, type ReviewItem } from '../utils/spacedReview';

const KEY = '@birtalk_review_schedule';
interface ReviewState {
  items: Record<string, ReviewItem>; hydrated: boolean;
  load: () => Promise<void>;
  /** After a lesson is finished: every task enters the schedule (difficult ones tomorrow, the rest in 3 days). */
  registerLesson: (lessonId: string, tasks: { taskId: string; difficult: boolean; fresh?: boolean }[]) => void;
  /** A confirmed verdict in a review session. */
  recordResult: (key: string, correct: boolean) => void;
  dueCount: (day?: string) => number;
  resetAll: () => void;
}
let writes: Promise<void> = Promise.resolve();
let loading: Promise<void> | undefined;

export const useReviewStore = create<ReviewState>((set, get) => {
  const save = () => {
    const snapshot = JSON.stringify({ items: get().items });
    writes = writes.catch(() => {}).then(() => AsyncStorage.setItem(KEY, snapshot));
    void writes.catch(() => {});
  };
  return {
    items: {}, hydrated: false,
    load: () => loading ??= (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        const saved = raw ? JSON.parse(raw) as { items?: Record<string, ReviewItem> } : {};
        // Items registered before hydration finished are kept (they win over stored ones).
        set(s => ({ items: { ...(saved.items ?? {}), ...s.items }, hydrated: true }));
      } catch { set({ hydrated: true }); }
    })(),
    registerLesson: (lessonId, tasks) => {
      const today = localDay();
      set(s => ({ items: tasks.reduce((all, t) => registerItem(all, lessonId, t.taskId, today, t.difficult, t.fresh), s.items) }));
      save();
    },
    recordResult: (key, correct) => {
      const item = get().items[key]; if (!item) return;
      set(s => ({ items: { ...s.items, [key]: gradeItem(item, correct, localDay()) } }));
      save();
    },
    dueCount: (day = localDay()) => Math.min(SESSION_SIZE, dueItems(get().items, day).length),
    resetAll: () => { set({ items: {} }); save(); },
  };
});
