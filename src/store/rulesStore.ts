// Qaydalar (user, 21 Nov 2026): which rules were opened (“Başa düşdüm”), starred, and how their tasks went.
// Kept apart from lesson progress and grading; it only feeds the Qaydalar tab.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { ruleOfTask } from '../data/rules';

const KEY = '@birtalk_rules_v1';
export type RuleStat = { wrong: number; right: number; last: 'wrong' | 'right' };
export type RuleStrength = 'new' | 'weak' | 'learning' | 'strong';

interface RulesState {
  seen: Record<string, true>; starred: Record<string, true>; stats: Record<string, RuleStat>; hydrated: boolean;
  load: () => Promise<void>;
  markSeen: (ruleId: string) => void;
  toggleStar: (ruleId: string) => void;
  /** A graded task: counts for the rule the task belongs to, if any. */
  recordTask: (taskId: string, correct: boolean) => void;
}

const save = (s: Pick<RulesState, 'seen' | 'starred' | 'stats'>) =>
  void AsyncStorage.setItem(KEY, JSON.stringify({ seen: s.seen, starred: s.starred, stats: s.stats })).catch(() => {});

export const useRulesStore = create<RulesState>((set, get) => ({
  seen: {}, starred: {}, stats: {}, hydrated: false,
  load: async () => {
    if (get().hydrated) return;
    try {
      const raw = await AsyncStorage.getItem(KEY);
      const v: unknown = raw ? JSON.parse(raw) : null;
      if (v && typeof v === 'object') {
        const o = v as Partial<RulesState>;
        set({ seen: { ...(o.seen ?? {}), ...get().seen }, starred: { ...(o.starred ?? {}), ...get().starred }, stats: { ...(o.stats ?? {}), ...get().stats } });
      }
    } catch { /* A broken value only resets the Qaydalar tab. */ }
    set({ hydrated: true });
  },
  markSeen: ruleId => { if (get().seen[ruleId]) return; set(s => ({ seen: { ...s.seen, [ruleId]: true } })); save(get()); },
  toggleStar: ruleId => {
    set(s => { const starred = { ...s.starred }; if (starred[ruleId]) delete starred[ruleId]; else starred[ruleId] = true; return { starred }; });
    save(get());
  },
  recordTask: (taskId, correct) => {
    const rule = ruleOfTask(taskId);
    if (!rule) return;
    set(s => {
      const old = s.stats[rule.id] ?? { wrong: 0, right: 0, last: 'right' as const };
      return { stats: { ...s.stats, [rule.id]: { wrong: old.wrong + (correct ? 0 : 1), right: old.right + (correct ? 1 : 0), last: correct ? 'right' : 'wrong' } } };
    });
    save(get());
  },
}));

/** weak: the last answer was wrong or mistakes outnumber right answers; strong: three right answers and the last one right. */
export function strengthOf(stat?: RuleStat): RuleStrength {
  if (!stat) return 'new';
  if (stat.last === 'wrong' || stat.wrong > stat.right) return 'weak';
  return stat.right >= 3 ? 'strong' : 'learning';
}
