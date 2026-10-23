import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { getShortSession } from '../data/firstConversation';
import { getPacketLesson, packetTaskIds } from '../data/b1Course';
import { getLessonActivities } from '../data/lessonActivities';
import { lessons } from '../data/lessons';
import { getAllModules } from '../data/modules';
import type { LessonProgress, PlacementResult } from '../data/types';
import { moduleHasContent, moduleTest, moduleUnlocked } from '../utils/moduleAccess';
import { localDay, LESSON_XP, MAX_ENERGY, previousDay, type LessonAttempt, type RewardReceipt, type RewardRecord } from '../utils/rewards';

import { summarizeEvidence, type TaskEvidence } from '../utils/lessonEvidence';

const STORAGE_KEY = '@birtalk_user_data';
interface UserData {
  xp: number; streak: number; hearts: number; level: string; lastPlayedDate: string | null;
  completedLessons: string[]; lessonProgress: LessonProgress[]; placementResults: PlacementResult[];
  rewards: Record<string, RewardRecord>; lastQualifiedDay: string | null; streakStart: string | null;
}
interface UserState extends UserData {
  hydrated: boolean; storageError: string | null;
  attempts: Record<string, LessonAttempt>; receipts: Record<string, RewardReceipt>;
  beginLesson: (lessonId: string, mode?: 'session' | 'practice') => string;
  abandonLesson: (attemptId: string) => boolean;
  recordTask: (attemptId: string, taskId: string, correct: boolean | null, token: string, evidence?: TaskEvidence) => void;
  useHelp: (attemptId: string) => void;
  finishLesson: (attemptId: string) => Promise<RewardReceipt>;
  claimReceipt: (id: string) => RewardReceipt | undefined;
  finishExam: (moduleId: string, answers: Record<string, boolean>) => Promise<{ passed: boolean; xp: number; correct: number }>;
  loseHeart: () => void; refillHearts: () => void; resetHearts: () => void;
  checkDailyStreak: () => void; loadFromStorage: () => Promise<void>; saveToStorage: () => Promise<void>; resetAll: () => void;
  isLessonCompleted: (id: string) => boolean;
  getNextLessonId: (id: string) => string | undefined;
  getLessonProgress: (id: string) => LessonProgress | undefined;
  getPlacementResult: (id: string) => PlacementResult | undefined;
  hasPassedPlacement: (id: string) => boolean;
}
const initial: UserData = { xp: 0, streak: 0, hearts: MAX_ENERGY, level: 'A1', lastPlayedDate: null,
  completedLessons: [], lessonProgress: [], placementResults: [], rewards: {}, lastQualifiedDay: null, streakStart: null };
let writes: Promise<void> = Promise.resolve();
let hydration: Promise<void> | undefined;
let sequence = 0;
const finishing = new Map<string, Promise<RewardReceipt>>();

export const useUserStore = create<UserState>((set, get) => ({
  ...initial, hydrated: false, storageError: null, attempts: {}, receipts: {},
  loadFromStorage: () => {
    if (hydration) return hydration;
    hydration = (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved: Partial<UserData> & { rewardVersion?: number } = JSON.parse(raw);
          const completed = saved.completedLessons ?? []; const results = saved.placementResults ?? [];
          const rewards = { ...saved.rewards };
          // Existing progress is already paid. Preserve XP; never pay it retroactively.
          if (saved.rewardVersion !== 1) {
            completed.forEach((id) => { rewards[`lesson:${id}`] = { amount: 0, day: '' }; });
            results.filter((r) => r.passed).forEach((r) => { rewards[`exam:${r.moduleId}`] = { amount: 0, day: '' }; });
            getAllModules().filter((m) => m.lessonIds.length && m.lessonIds.every((id) => completed.includes(id)))
              .forEach((m) => { rewards[`module:${m.id}`] = { amount: 0, day: '' }; });
          }
          set({ xp: saved.xp ?? 0, hearts: Math.max(0, Math.min(MAX_ENERGY, saved.hearts ?? MAX_ENERGY)),
            level: saved.level ?? 'A1', completedLessons: completed, lessonProgress: saved.lessonProgress ?? [], placementResults: results,
            rewards, lastQualifiedDay: saved.lastQualifiedDay ?? null, streakStart: saved.streakStart ?? null,
            streak: saved.lastQualifiedDay ? saved.streak ?? 0 : 0, lastPlayedDate: saved.lastPlayedDate ?? null });
        }
        set({ hydrated: true, storageError: null }); get().checkDailyStreak();
      } catch { set({ storageError: 'İrəliləyiş oxunmadı. Tətbiqi yenidən açaraq cəhd et.' }); hydration = undefined; }
    })();
    return hydration;
  },
  saveToStorage: () => {
    if (!get().hydrated) return Promise.reject(new Error('İrəliləyiş hələ yüklənməyib.'));
    const { xp, hearts, level, streak, lastPlayedDate, completedLessons, lessonProgress, placementResults,
      rewards, lastQualifiedDay, streakStart } = get();
    // Rewards, completion and unlocks are one atomic value; writes cannot overtake one another.
    const snapshot = JSON.stringify({ rewardVersion: 1, xp, hearts, level, streak, lastPlayedDate,
      completedLessons, lessonProgress, placementResults, rewards, lastQualifiedDay, streakStart });
    const write = writes.catch(() => {}).then(() => AsyncStorage.setItem(STORAGE_KEY, snapshot)); writes = write;
    return write.then(() => { set({ storageError: null }); }, (error: unknown) => {
      set({ storageError: 'İrəliləyiş saxlanmadı. Yenidən cəhd et.' }); throw error;
    });
  },
  loseHeart: () => {
    if (!get().hydrated) return;
    set((s) => ({ hearts: Math.max(0, s.hearts - 1) })); void get().saveToStorage().catch(() => {});
  },
  refillHearts: () => {
    if (!get().hydrated) return;
    set({ hearts: MAX_ENERGY }); void get().saveToStorage().catch(() => {});
  },
  resetHearts: () => get().refillHearts(),
  checkDailyStreak: () => {
    const last = get().lastQualifiedDay;
    if (last && last !== localDay() && last !== previousDay()) set({ streak: 0 });
  },
  resetAll: () => { set({ ...initial, attempts: {}, receipts: {} }); void get().saveToStorage().catch(() => {}); },
  beginLesson: (lessonId, mode = 'session') => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!get().hydrated || !lesson || !moduleUnlocked(lesson.moduleId, get().completedLessons, get().placementResults)) return '';
    const session = mode === 'session' ? getShortSession(lessonId) : undefined;
    const activities = mode === 'practice' ? getLessonActivities(lessonId) : undefined;
    const expected = lesson.exercises.map((e) => e.id);
    if (session?.warmup) expected.unshift(session.warmup.exercise.id);
    const count = session ? (session.turns?.length ?? (session.speaking ? 1 : 0)) : (activities?.speaking.length ?? 0);
    for (let i = 0; i < count; i++) expected.push(`voice:${i}`);
    activities?.game.stops.forEach((_, i) => expected.push(`game:${i}`));
    const packet = getPacketLesson(lessonId);
    const packetIds = packet ? packetTaskIds(packet) : undefined;
    const id = `${Date.now()}-${++sequence}`;
    set((s) => ({ attempts: { ...s.attempts, [id]: { id, lessonId, expected: packetIds?.required ?? expected, optional: packetIds?.optional, tasks: {}, assisted: false, finished: false } } })); return id;
  },
  abandonLesson: (id) => {
    const a = get().attempts[id];
    if (!a || a.finished || finishing.has(id)) return false;
    set((state) => { const attempts = { ...state.attempts }; delete attempts[id]; return { attempts }; });
    return true;
  },
  useHelp: (id) => {
    const a = get().attempts[id];
    if (a && !a.finished) set((s) => ({ attempts: { ...s.attempts, [id]: { ...a, assisted: true } } }));
  },
  recordTask: (id, taskId, correct, token, evidence) => {
    const a = get().attempts[id]; const old = a?.tasks[taskId];
    if (!a || a.finished || ![...a.expected, ...(a.optional ?? [])].includes(taskId) || old?.resolved || old?.token === token) return;
    // Mandatory voice tasks need an actual, unedited spoken answer.
    const packet = getPacketLesson(a.lessonId);
    const requiredVoice = packet?.order === 7 && a.expected.includes(taskId);
    if (correct === true && requiredVoice && evidence?.input === 'written') return;
    const task = { firstCorrect: old?.firstCorrect ?? correct === true, resolved: correct === true,
      skipped: correct === null, wrong: (old?.wrong ?? 0) + (correct === false ? 1 : 0), token, evidence };
    set((s) => ({ attempts: { ...s.attempts, [id]: { ...a, tasks: { ...a.tasks, [taskId]: task } } } }));
    if (correct === false) get().loseHeart();
  },
  finishLesson: (id) => {
    const pending = finishing.get(id); if (pending) return pending;
    const operation = (async () => {
      const s = get(); const a = s.attempts[id];
      if (!a) throw new Error('Dərs cəhdi tapılmadı. Dərsi yenidən aç.');
      if (a.finished) {
        await get().saveToStorage();
        return get().receipts[id] ?? { id, lessonId: a.lessonId, xp: 0, completed: false, correct: 0, total: a.expected.length };
      }
      const total = a.expected.length; const correct = a.expected.filter((key) => a.tasks[key]?.firstCorrect).length;
      const completed = total > 0 && a.expected.every((key) => a.tasks[key]?.resolved && !a.tasks[key]?.skipped);
      // Keep an incomplete attempt open so only missing answers need retrying.
      if (!completed) return { id, lessonId: a.lessonId, xp: 0, completed: false, correct, total };
      let xp = 0; const rewards = { ...s.rewards }; const now = new Date(); const today = localDay(now);
      const grant = (key: string, amount: number) => { if (!rewards[key]) { rewards[key] = { amount, day: today }; xp += amount; } };
      let streak = s.streak; let streakStart = s.streakStart; let lastQualifiedDay = s.lastQualifiedDay;
      const completedLessons = completed ? [...new Set([...s.completedLessons, a.lessonId])] : s.completedLessons;
      if (completed) {
        if (!s.completedLessons.includes(a.lessonId) && !rewards[`lesson:${a.lessonId}`]) {
          grant(`lesson:${a.lessonId}`, LESSON_XP);
          if (!a.assisted && !Object.values(a.tasks).some(t => t.evidence?.assisted || t.evidence?.technicalText) && correct === total && (a.optional ?? []).every((key) => a.tasks[key]?.firstCorrect && a.tasks[key]?.resolved)) grant(`perfect:${a.lessonId}`, 5);
        }
        if (s.lastQualifiedDay !== today && (!s.lastQualifiedDay || s.lastQualifiedDay < today)) {
          streak = s.lastQualifiedDay === previousDay(now) ? s.streak + 1 : 1;
          streakStart = streak === 1 ? today : s.streakStart ?? today; lastQualifiedDay = today;
          grant(`daily:${today}`, 10);
          if (streak === 3) grant(`streak:${streakStart}:3`, 25);
          if (streak === 7) grant(`streak:${streakStart}:7`, 60);
        }
        for (const m of getAllModules()) if (moduleHasContent(m.id) && m.lessonIds.every((key) => completedLessons.includes(key))) grant(`module:${m.id}`, 100);
      }
      const receipt: RewardReceipt = { id, lessonId: a.lessonId, xp, completed, correct, total };
      const progress: LessonProgress = { lessonId: a.lessonId, completed, correctCount: correct,
        wrongCount: a.expected.reduce((sum, key) => sum + (a.tasks[key]?.wrong ?? 0), 0), score: total ? Math.round(correct / total * 100) : 0,
        xpEarned: xp, completedAt: now.toISOString(), evidence: summarizeEvidence(Object.values(a.tasks)) };
      set({ xp: s.xp + xp, rewards, streak, streakStart, lastQualifiedDay, lastPlayedDate: completed ? today : s.lastPlayedDate,
        completedLessons, lessonProgress: completed ? [...s.lessonProgress.filter((p) => p.lessonId !== a.lessonId), progress] : s.lessonProgress,
        attempts: { ...s.attempts, [id]: { ...a, finished: true } }, receipts: { ...s.receipts, [id]: receipt } });
      await get().saveToStorage(); return receipt;
    })();
    finishing.set(id, operation); void operation.finally(() => finishing.delete(id)).catch(() => {}); return operation;
  },
  claimReceipt: (id) => {
    const r = get().receipts[id];
    if (r) set((s) => { const receipts = { ...s.receipts }; delete receipts[id]; return { receipts }; }); return r;
  },
  finishExam: async (moduleId, answers) => {
    const s = get(); const test = moduleTest(moduleId);
    if (!s.hydrated || !test || test.questions.some((q) => typeof answers[q.id] !== 'boolean')) throw new Error('Sınağın bütün suallarını cavablandır.');
    const correct = test.questions.filter((q) => answers[q.id]).length;
    const passed = test.requiredQuestionIds?.length ? test.requiredQuestionIds.every((id) => answers[id] === true)
      : correct / test.questions.length * 100 >= (Number.isFinite(test.passScore) ? test.passScore : 80);
    const key = `exam:${moduleId}`;
    const xp = passed && !s.rewards[key] && !s.placementResults.some((r) => r.moduleId === moduleId && r.passed) ? 50 : 0;
    const prior = s.placementResults.find((r) => r.moduleId === moduleId);
    const result: PlacementResult = prior?.passed ? prior : { moduleId, passed, correctCount: correct,
      totalCount: test.questions.length, attemptedAt: new Date().toISOString() };
    set({ xp: s.xp + xp, rewards: xp ? { ...s.rewards, [key]: { amount: xp, day: localDay() } } : s.rewards,
      placementResults: [...s.placementResults.filter((r) => r.moduleId !== moduleId), result] });
    await get().saveToStorage(); return { passed, xp, correct };
  },
  isLessonCompleted: (id) => get().completedLessons.includes(id),
  getLessonProgress: (id) => get().lessonProgress.find((p) => p.lessonId === id),
  getNextLessonId: (id) => { const current = lessons.find((l) => l.id === id); if (!current) return undefined;
    return lessons.filter((l) => l.moduleId === current.moduleId && l.order > current.order).sort((a, b) => a.order - b.order)[0]?.id; },
  getPlacementResult: (id) => get().placementResults.find((r) => r.moduleId === id),
  hasPassedPlacement: (id) => get().placementResults.some((r) => r.moduleId === id && r.passed),
}));
