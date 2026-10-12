import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { lessons } from '../data/lessons';

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
  allWords: VocabWord[];
  pages: VocabPage[];
  completedLessons: string[];
  testResults: TestResult[];
  wrongWords: WrongWord[];

  addLessonWords: (lessonId: string) => void;
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

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  allWords: [],
  pages: [],
  completedLessons: [],
  testResults: [],
  wrongWords: [],

  addLessonWords: (lessonId) => {
    const state = get();

    if (state.completedLessons.includes(lessonId)) {
      console.log(`ℹ️ Dərs artıq əlavə olunub: ${lessonId}`);
      return;
    }

    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) {
      console.log(`❌ Dərs tapılmadı: ${lessonId}`);
      return;
    }

    const newWords: VocabWord[] = lesson.vocabulary
      .map((v) => ({
        id: `${lessonId}_${v.id}`,
        word: v.word,
        translation: v.translation,
        pronunciation: v.pronunciation,
        example: v.example,
        exampleAz: v.exampleAz,
        language: lesson.language,
        level: lesson.level,
        lessonId: lesson.id,
        lessonTitle: lesson.titleAz,
        acceptedAnswers: v.acceptedAnswers,
      }))
      .filter((newWord) => {
        const exists = state.allWords.some(
          (existing) =>
            existing.word.toLowerCase().trim() ===
              newWord.word.toLowerCase().trim() &&
            existing.language === newWord.language
        );
        return !exists;
      });

    if (newWords.length === 0) {
      set({ completedLessons: [...state.completedLessons, lessonId] });
      get().saveToStorage();
      return;
    }

    const updatedWords = [...state.allWords, ...newWords];
    const updatedPages = buildPages(updatedWords);
    const updatedCompleted = [...state.completedLessons, lessonId];

    set({
      allWords: updatedWords,
      pages: updatedPages,
      completedLessons: updatedCompleted,
    });

    get().saveToStorage();
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

    get().saveToStorage();
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

    get().saveToStorage();
  },

  removeWrongWord: (wordId) => {
    set((state) => ({
      wrongWords: state.wrongWords.filter((w) => w.wordId !== wordId),
    }));
    get().saveToStorage();
  },

  clearWrongWords: () => {
    set({ wrongWords: [] });
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({
          allWords: parsed.allWords || [],
          pages: parsed.pages || [],
          completedLessons: parsed.completedLessons || [],
          testResults: parsed.testResults || [],
          wrongWords: parsed.wrongWords || [],
        });
      }
    } catch (error) {
      console.log('❌ Vocabulary storage oxuma xətası:', error);
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          allWords: state.allWords,
          pages: state.pages,
          completedLessons: state.completedLessons,
          testResults: state.testResults,
          wrongWords: state.wrongWords,
        })
      );
    } catch (error) {
      console.log('❌ Vocabulary storage yazma xətası:', error);
    }
  },

  resetAll: () => {
    set({
      allWords: [],
      pages: [],
      completedLessons: [],
      testResults: [],
      wrongWords: [],
    });
    get().saveToStorage();
  },
}));