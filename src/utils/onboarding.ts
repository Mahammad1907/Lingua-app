// Onboarding preferences describe the learner's choices, never assessment evidence.
export const ONBOARDING_KEY = '@birtalk_onboarding_v1';
export const APP_NAME = 'BirTalk';
export const goals = [
  { id: 'daily', title: 'Gündəlik ünsiyyət', description: 'Tanışlıq və gündəlik həyat üçün', short: 'Tanışlıq və gündəlik həyat', icon: '💬' },
  { id: 'education', title: 'Təhsil', description: 'İmtahanlar, təqaüd və akademik məqsədlər', short: 'İmtahan və akademik məqsədlər', icon: '🎓' },
  { id: 'career', title: 'Karyera', description: 'İş görüşləri və peşəkar ünsiyyət', short: 'İş və peşəkar ünsiyyət', icon: '💼' },
  { id: 'travel', title: 'Səyahət', description: 'Səyahətdə rahat ünsiyyət qurmaq', short: 'Səyahətdə ünsiyyət', icon: '✈️' },
  { id: 'other', title: 'Digər', description: 'Mənim xüsusi məqsədim var', short: 'Xüsusi məqsədim var', icon: '💭' },
] as const;
export const levels = [
  { id: 'beginner', code: 'A1', title: 'Sıfırdan başlayıram', description: 'İngilis dilini yeni öyrənirəm.', short: 'Yeni öyrənirəm.', icon: '🌱' },
  { id: 'basic', code: 'A2', title: 'Bir az bilirəm', description: 'Sadə söz və cümlələri anlayıram.', short: 'Sadə cümlələri anlayıram.', icon: '📚' },
  { id: 'conversation', code: 'B1', title: 'Danışa bilirəm', description: 'Gündəlik mövzularda ünsiyyət qururam.', short: 'Gündəlik ünsiyyət qururam.', icon: '💬' },
  { id: 'confident', code: 'B2', title: 'Yaxşı bilirəm', description: 'Fikrimi daha geniş ifadə edə bilirəm.', short: 'Fikrimi geniş ifadə edirəm.', icon: '🏆' },
  { id: 'unknown', code: null, title: 'Səviyyəmi bilmirəm', description: 'Qısa testlə səviyyəmi müəyyən edim.', short: 'Mövcud qısa testi keçim.', icon: '🔎' },
] as const;
export type GoalId = typeof goals[number]['id'];
export type LevelId = typeof levels[number]['id'];
export const practiceMinutes = [5, 10, 15, 20] as const;
export interface OnboardingPreferences {
  goal: GoalId; levelChoice: LevelId; minutes: number;
}
export const defaultPreferences: OnboardingPreferences = { goal: 'daily', levelChoice: 'beginner', minutes: 10 };
export function parsePreferences(raw: string | null, legacyLevel?: string | null): OnboardingPreferences {
  let saved: Partial<OnboardingPreferences> = {};
  try { const value: unknown = raw ? JSON.parse(raw) : null; if (value && typeof value === 'object') saved = value; } catch { /* Recover invalid preference JSON without touching lesson progress. */ }
  return {
    goal: goals.some(g => g.id === saved.goal) ? saved.goal! : 'daily',
    levelChoice: levels.some(l => l.id === saved.levelChoice) ? saved.levelChoice!
      : levels.find(l => l.code === legacyLevel)?.id ?? (legacyLevel === 'test' ? 'unknown' : 'beginner'),
    minutes: practiceMinutes.some(m => m === saved.minutes) ? saved.minutes! : 10,
  };
}
export function levelSummary(preferences: OnboardingPreferences, storedLevel: string | null, placementScore: string | null) {
  if (preferences.levelChoice === 'unknown') return placementScore !== null && storedLevel && storedLevel !== 'test'
    ? `Test nəticəsi: ${storedLevel}` : 'Hələ müəyyən edilməyib';
  return levels.find(l => l.id === preferences.levelChoice)!.title;
}
