import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { lessons } from '../data/lessons';
import { vocabularyKey } from '../utils/vocabularyIdentity';

const STORAGE_KEY = '@birtalk_vocabulary';
const WORDS_PER_PAGE = 30;

// ═══════════════════════════════════════
// TİPLƏR
// ═══════════════════════════════════════

export interface VocabWord {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleAz: string;
  language: string;
  level: string;
  lessonId: string;
  lessonTitle: string;
  acceptedAnswers?: string[];
  acceptedTranslations?: string[];
  quizEligible?: boolean;
}

export interface VocabPage {
  pageNumber: number;
  words: VocabWord[];
  createdAt: string;
}

export interface TestResult {
  id: string;
  pageNumber: number;
  correct: number;
  wrong: number;
  total: number;
  wrongWordIds: string[];
  testedAt: string;
}

export interface WrongWord {
  wordId: string;
  wrongCount: number;
  correctCount: number;
  lastTestedAt?: string;
}

interface VocabularyState {
  hydrated: boolean;
  storageError: string | null;
  reconcileCompletedLessons: (ids: readonly string[]) => Promise<void>;
  allWords: VocabWord[];
  pages: VocabPage[];
  completedLessons: string[];
  testResults: TestResult[];
  wrongWords: WrongWord[];

  addLessonWords: (lessonId: string) => Promise<void>;
  getPage: (pageNumber: number) => VocabPage | undefined;
  getTotalPages: () => number;
  saveTestResult: (
    pageNumber: number,
    correct: number,
    wrong: number,
    wrongWordIds: string[],
    correctWordIds?: string[]
  ) => void;
  addWrongWord: (wordId: string) => void;
  removeWrongWord: (wordId: string) => void;
  clearWrongWords: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  resetAll: () => void;
}

// ═══════════════════════════════════════
// KÖMƏKÇI — Səhifələri qur
// ═══════════════════════════════════════

const buildPages = (words: VocabWord[]): VocabPage[] => {
  const pages: VocabPage[] = [];
  for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
    pages.push({
      pageNumber: pages.length + 1,
      words: words.slice(i, i + WORDS_PER_PAGE),
      createdAt: new Date().toISOString(),
    });
  }
  return pages;
};

// ═══════════════════════════════════════
// STORE
// ═══════════════════════════════════════

let hydration: Promise<void> | undefined;
let writes: Promise<void> = Promise.resolve();

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  hydrated: false, storageError: null,
  allWords: [],
  pages: [],
  completedLessons: [],
  testResults: [],
  wrongWords: [],

  addLessonWords: async (lessonId) => {
    await get().loadFromStorage();
    const state = get(), lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) throw new Error('Dərsin lüğəti tapılmadı.');
    const known = new Set(state.allWords.map(v => `${v.language}:${vocabularyKey(v.word)}`));
    const newWords: VocabWord[] = [];
    for (const v of lesson.vocabulary) {
      const key = `${lesson.language}:${vocabularyKey(v.word)}`;
      if (known.has(key)) continue;
      known.add(key);
      newWords.push({ ...v, id: `${lessonId}_${v.id}`, language: lesson.language, level: lesson.level,
        lessonId: lesson.id, lessonTitle: lesson.titleAz });
    }
    const metadata = new Map(lesson.vocabulary.map(v => [vocabularyKey(v.word), v]));
    const allWords = [...state.allWords.map(word => {
      const authored = word.language === lesson.language ? metadata.get(vocabularyKey(word.word)) : undefined;
      return authored ? { ...word, acceptedAnswers: authored.acceptedAnswers, acceptedTranslations: authored.acceptedTranslations, quizEligible: authored.quizEligible } : word;
    }), ...newWords];
    set({ allWords, pages: buildPages(allWords),
      completedLessons: [...new Set([...state.completedLessons, lessonId])] });
    await get().saveToStorage();
  },
  reconcileCompletedLessons: async (ids) => {
    await get().loadFromStorage();
    for (const id of ids) if (lessons.some(l => l.id === id)) await get().addLessonWords(id);
  },

  getPage: (pageNumber) => {
    return get().pages.find((p) => p.pageNumber === pageNumber);
  },

  getTotalPages: () => {
    return get().pages.length;
  },

  saveTestResult: (
    pageNumber,
    correct,
    wrong,
    wrongWordIds,
    correctWordIds
  ) => {
    const state = get();

    const result: TestResult = {
      id: `test_${Date.now()}`,
      pageNumber,
      correct,
      wrong,
      total: correct + wrong,
      wrongWordIds,
      testedAt: new Date().toISOString(),
    };

    const updatedResults = [...state.testResults, result];
    let updatedWrongWords = [...state.wrongWords];

    // ═══ SƏHV SÖZLƏR ═══
    wrongWordIds.forEach((wordId) => {
      const existing = updatedWrongWords.find((w) => w.wordId === wordId);
      if (existing) {
        updatedWrongWords = updatedWrongWords.map((w) =>
          w.wordId === wordId
            ? {
                ...w,
                wrongCount: w.wrongCount + 1,
                lastTestedAt: new Date().toISOString(),
              }
            : w
        );
      } else {
        updatedWrongWords.push({
          wordId,
          wrongCount: 1,
          correctCount: 0,
          lastTestedAt: new Date().toISOString(),
        });
      }
    });

    // ═══ DÜZGÜN SÖZLƏR ═══
    let finalCorrectWordIds: string[];

    if (correctWordIds !== undefined) {
      finalCorrectWordIds = correctWordIds;
    } else {
      finalCorrectWordIds =
        state.pages
          .find((p) => p.pageNumber === pageNumber)
          ?.words.filter((w) => !wrongWordIds.includes(w.id))
          .map((w) => w.id) || [];
    }

    finalCorrectWordIds.forEach((wordId) => {
      const existing = updatedWrongWords.find((w) => w.wordId === wordId);
      if (existing) {
        updatedWrongWords = updatedWrongWords.map((w) =>
          w.wordId === wordId
            ? {
                ...w,
                correctCount: w.correctCount + 1,
                lastTestedAt: new Date().toISOString(),
              }
            : w
        );
      }
    });

    set({
      testResults: updatedResults,
      wrongWords: updatedWrongWords,
    });

    void get().saveToStorage().catch(() => {});
  },

  addWrongWord: (wordId) => {
    const state = get();
    const existing = state.wrongWords.find((w) => w.wordId === wordId);

    if (existing) {
      set({
        wrongWords: state.wrongWords.map((w) =>
          w.wordId === wordId
            ? {
                ...w,
                wrongCount: w.wrongCount + 1,
                lastTestedAt: new Date().toISOString(),
              }
            : w
        ),
      });
    } else {
      set({
        wrongWords: [
          ...state.wrongWords,
          {
            wordId,
            wrongCount: 1,
            correctCount: 0,
            lastTestedAt: new Date().toISOString(),
          },
        ],
      });
    }

    void get().saveToStorage().catch(() => {});
  },

  removeWrongWord: (wordId) => {
    set((state) => ({
      wrongWords: state.wrongWords.filter((w) => w.wordId !== wordId),
    }));
    void get().saveToStorage().catch(() => {});
  },

  clearWrongWords: () => {
    set({ wrongWords: [] });
    void get().saveToStorage().catch(() => {});
  },

  loadFromStorage: () => {
    if (get().hydrated) return Promise.resolve();
    if (hydration) return hydration;
    hydration = (async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          const allWords: VocabWord[] = Array.isArray(parsed.allWords) ? parsed.allWords : [];
          set({ allWords, pages: buildPages(allWords), completedLessons: parsed.completedLessons || [],
            testResults: parsed.testResults || [], wrongWords: parsed.wrongWords || [] });
        }
        set({ hydrated: true, storageError: null });
      } catch (error) { hydration = undefined; set({ storageError: 'Lüğət oxunmadı. Yenidən cəhd et.' }); throw error; }
    })();
    return hydration;
  },
  saveToStorage: () => {
    const { allWords, pages, completedLessons, testResults, wrongWords } = get();
    const snapshot = JSON.stringify({ allWords, pages, completedLessons, testResults, wrongWords });
    const write = writes.catch(() => {}).then(() => AsyncStorage.setItem(STORAGE_KEY, snapshot)); writes = write;
    return write.then(() => { set({ storageError: null }); }, error => {
      set({ storageError: 'Lüğət saxlanmadı. Yenidən saxla düyməsinə toxun.' }); throw error;
    });
  },

  resetAll: () => {
    set({
      allWords: [],
      pages: [],
      completedLessons: [],
      testResults: [],
      wrongWords: [],
    });
    void get().saveToStorage().catch(() => {});
  },
}));