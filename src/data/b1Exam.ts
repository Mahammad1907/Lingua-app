import raw from './b1Exams.json';
import type { PacketExam } from './b1PacketTypes';
import type { PlacementTest } from './types';
import { packetExercise } from './b1Course';
export const b1Exams = raw as PacketExam[];
export const b1PlacementTest: PlacementTest = {
  moduleId: 'module_1', language: 'en', level: 'A1', passScore: 100,
  description: 'İlk tanışlıq · 17 tapşırıq · əsas ünsiyyət məqsədləri ayrı yoxlanır',
  questions: b1Exams[0].cards.map(packetExercise),
  requiredQuestionIds: b1Exams[0].required.map((n) => `b1_exam_q${String(n).padStart(2, '0')}`),
};
