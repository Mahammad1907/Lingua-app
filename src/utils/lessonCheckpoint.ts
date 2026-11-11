import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PacketCard } from '../data/b1PacketTypes';
import type { PacketVerdict } from './packetAnswer';
import type { LessonAttempt } from './rewards';
import type { TaskEvidence } from './lessonEvidence';
export interface PacketOutcome { answer: string; status: 'independent' | 'assisted' | 'wrong' | 'unverified'; spoken: boolean; reason?: string; evidence?: TaskEvidence }
export interface LessonCheckpoint {
  version: 1; lessonId: string; flowIds: string[]; attempt: LessonAttempt;
  index: number; answer: string; built: number[]; feedback: PacketVerdict | null;
  queue: PacketCard[]; reviewing: boolean; reviewTotal: number; outcomes: Record<string, PacketOutcome>;
  help: boolean; heard: boolean; technicalText: boolean; transcriptShown: boolean; transcriptVisible: boolean;
}
const key = (lessonId: string) => `@birtalk_lesson_checkpoint_v1:${lessonId}`;
const queues = new Map<string, Promise<void>>();
function write(lessonId: string, work: () => Promise<void>) {
  const next = (queues.get(lessonId) || Promise.resolve()).catch(() => {}).then(work);
  queues.set(lessonId, next); return next;
}
export const saveLessonCheckpoint = (data: LessonCheckpoint) => write(data.lessonId, () => AsyncStorage.setItem(key(data.lessonId), JSON.stringify(data)));
export const clearLessonCheckpoint = (id: string) => write(id, () => AsyncStorage.removeItem(key(id)));
export async function loadLessonCheckpoint(id: string, flowIds: readonly string[]): Promise<LessonCheckpoint | null> {
  await queues.get(id)?.catch(() => {});
  const raw = await AsyncStorage.getItem(key(id));
  if (!raw) return null;
  const data: LessonCheckpoint = JSON.parse(raw);
  if (data.version !== 1 || data.lessonId !== id || data.attempt?.lessonId !== id || data.attempt.finished || JSON.stringify(data.flowIds) !== JSON.stringify(flowIds) || !Number.isInteger(data.index) || data.index < 0 || data.index >= flowIds.length || !Array.isArray(data.queue) || !data.outcomes || !Array.isArray(data.built)) return null;
  // Only authored IDs may re-enter the retry queue. Native resources are never saved.
  if (data.queue.some(card => !flowIds.includes(card.id)) || data.reviewing && !data.queue.length) return null;
  return data;
}
