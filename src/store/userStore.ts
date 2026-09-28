import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { lessons } from '../data/lessons';
import { LessonProgress } from '../data/types';

const STORAGE_KEY = '@birtalk_user_data';

// ═══════════════════════════════════════
// STATE TİPİ
// ═══════════════════════════════════════
interface UserState {
  // ═══ MÖVCUD (QORUNUR) ═══
  xp: number;
  streak: number;
  hearts: number;
  level: string;
  lastPlayedDate: string | null;

  // ═══ YENİ — DƏRS PROGRESS ═══
  completedLessons: string[];
  lessonProgress: LessonProgress[];

  // ═══ MÖVCUD ACTIONS ═══
  addXP: (amount: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  resetHearts: () => void;
  checkDailyStreak: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  resetAll: () => void;

  // ═══ YENİ ACTIONS ═══
  markLessonComplete: (
    lessonId: string,
    correctCount: number,
    wrongCount: number,
    xpEarned: number
  ) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getNextLessonId: (currentLessonId: string) => string | undefined;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
}

// ═══════════════════════════════════════
// STORE
// ═══════════════════════════════════════
export const useUserStore = create<UserState>((set, get) => ({
  // ═══ INITIAL STATE ═══
  xp: 0,
  streak: 0,
  hearts: 5,
  level: 'A1',
  lastPlayedDate: null,
  completedLessons: [],
  lessonProgress: [],

  // ═══════════════════════════════════════
  // MÖVCUD ACTIONS (QORUNUR)
  // ═══════════════════════════════════════
  addXP: (amount) => {
    set((state) => ({ xp: state.xp + amount }));
    get().saveToStorage();
  },

  loseHeart: () => {
    set((state) => ({ hearts: Math.max(0, state.hearts - 1) }));
    get().saveToStorage();
  },

  refillHearts: () => {
    set({ hearts: 5 });
    get().saveToStorage();
  },

  resetHearts: () => {
    set({ hearts: 5 });
    get().saveToStorage();
  },

  checkDailyStreak: () => {
    const today = new Date().toDateString();
    const last = get().lastPlayedDate;

    if (last === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (last === yesterdayStr) {
      set((state) => ({ streak: state.streak + 1, lastPlayedDate: today }));
    } else {
      set({ streak: 1, lastPlayedDate: today });
    }
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({
          xp: parsed.xp || 0,
          streak: parsed.streak || 0,
          hearts: parsed.hearts ?? 5,
          level: parsed.level || 'A1',
          lastPlayedDate: parsed.lastPlayedDate || null,
          completedLessons: parsed.completedLessons || [],
          lessonProgress: parsed.lessonProgress || [],
        });
      }
    } catch (error) {
      console.log('❌ User storage oxuma xətası:', error);
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          xp: state.xp,
          streak: state.streak,
          hearts: state.hearts,
          level: state.level,
          lastPlayedDate: state.lastPlayedDate,
          completedLessons: state.completedLessons,
          lessonProgress: state.lessonProgress,
        })
      );
    } catch (error) {
      console.log('❌ User storage yazma xətası:', error);
    }
  },

  resetAll: () => {
    set({
      xp: 0,
      streak: 0,
      hearts: 5,
      level: 'A1',
      lastPlayedDate: null,
      completedLessons: [],
      lessonProgress: [],
    });
    get().saveToStorage();
  },

  // ═══════════════════════════════════════
  // YENİ ACTIONS
  // ═══════════════════════════════════════

  /**
   * Dərsi tamamlanmış kimi qeyd et
   * Əgər əvvəl tamamlanıbsa — mövcud nəticəni yenilə
   */
  markLessonComplete: (lessonId, correctCount, wrongCount, xpEarned) => {
    const state = get();
    const total = correctCount + wrongCount;
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const newProgress: LessonProgress = {
      lessonId,
      completed: true,
      score,
      correctCount,
      wrongCount,
      xpEarned,
      completedAt: new Date().toISOString(),
    };

    // ═══ Duplicate yoxla ═══
    const existingIndex = state.lessonProgress.findIndex(
      (p) => p.lessonId === lessonId
    );

    let updatedProgress: LessonProgress[];

    if (existingIndex >= 0) {
      // Mövcud — yenilə
      updatedProgress = [...state.lessonProgress];
      updatedProgress[existingIndex] = newProgress;
    } else {
      // Yeni — əlavə et
      updatedProgress = [...state.lessonProgress, newProgress];
    }

    // ═══ completedLessons ═══
    const updatedCompleted = state.completedLessons.includes(lessonId)
      ? state.completedLessons
      : [...state.completedLessons, lessonId];

    set({
      lessonProgress: updatedProgress,
      completedLessons: updatedCompleted,
    });

    get().saveToStorage();
  },

  /**
   * Dərs tamamlanıb?
   */
  isLessonCompleted: (lessonId) => {
    return get().completedLessons.includes(lessonId);
  },

  /**
   * Dərsin progress-ni götür
   */
  getLessonProgress: (lessonId) => {
    return get().lessonProgress.find((p) => p.lessonId === lessonId);
  },

  /**
   * Növbəti dərsin ID-sini tap
   * Level + Language + ModuleId + Order strukturuna uyğun
   */
  getNextLessonId: (currentLessonId) => {
    // Cari dərsi tap
    const current = lessons.find((l) => l.id === currentLessonId);
    if (!current) return undefined;

    // Eyni level, language, moduleId olan dərsləri filter et
    const sameGroup = lessons
      .filter(
        (l) =>
          l.level === current.level &&
          l.language === current.language &&
          l.moduleId === current.moduleId
      )
      .sort((a, b) => a.order - b.order);

    // Cari dərsin indeksini tap
    const currentIndex = sameGroup.findIndex((l) => l.id === currentLessonId);
    if (currentIndex < 0) return undefined;

    // Növbəti dərs varsa — onun ID-sini qaytar
    const nextLesson = sameGroup[currentIndex + 1];
    return nextLesson?.id;
  },
}));