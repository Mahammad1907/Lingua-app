import AsyncStorage from '@react-native-async-storage/async-storage';
export interface LessonReport { lessonId: string; cardId: string; reason: string; note: string; answer?: string; verdict?: string }
const key = '@birtalk_lesson_reports_v1';
let writes: Promise<void> = Promise.resolve();
/** Local outbox. No report is claimed to have reached a server. */
export function saveLessonReport(report: LessonReport): Promise<void> {
  const next = writes.catch(() => {}).then(async () => {
    const raw = await AsyncStorage.getItem(key);
    const reports: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(reports)) throw new Error('Hesabatlar oxunmadı.');
    await AsyncStorage.setItem(key, JSON.stringify([...reports, { ...report, createdAt: new Date().toISOString() }]));
  });
  writes = next; return next;
}
