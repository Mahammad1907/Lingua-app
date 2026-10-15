export type ResultMood = 'excellent' | 'good' | 'practice' | 'neutral';
export function lessonResult(correct: number, wrong: number) {
  const total = correct + wrong;
  const percent = total ? Math.round(correct / total * 100) : null;
  const mood: ResultMood = percent === null ? 'neutral' : percent >= 90 ? 'excellent' : percent >= 60 ? 'good' : 'practice';
  return { total, percent, mood };
}
