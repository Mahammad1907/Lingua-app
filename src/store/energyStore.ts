import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
const KEY = '@birtalk_energy_v1';
export const ENERGY_INTERVAL = 20 * 60 * 1000;
export function recoverEnergy(value: number, at: number, now: number) {
  const ticks = Math.max(0, Math.floor((now - at) / ENERGY_INTERVAL));
  const energy = Math.min(100, Math.max(0, value) + ticks * 10);
  return { energy, updatedAt: energy === 100 ? now : at + ticks * ENERGY_INTERVAL };
}
interface EnergyState {
  energy: number; updatedAt: number; hydrated: boolean; activeLesson: string | null; charged: string[];
  hydrate: () => Promise<void>; refresh: () => void; begin: (id: string) => boolean;
  charge: (id: string) => void; finish: () => void;
}
let loading: Promise<void> | undefined;
let pendingWrite: Promise<unknown> = Promise.resolve();
export const useEnergyStore = create<EnergyState>((set, get) => {
  const persist = () => {
    const { energy, updatedAt, activeLesson, charged } = get();
    const value = JSON.stringify({ energy, updatedAt, activeLesson, charged });
    pendingWrite = pendingWrite.catch(() => {}).then(() => AsyncStorage.setItem(KEY, value)).catch(() => {});
  };
  return {
    energy: 100, updatedAt: Date.now(), hydrated: false, activeLesson: null, charged: [],
    hydrate: () => {
      if (get().hydrated) return Promise.resolve();
      if (!loading) loading = (async () => {
        try {
          const raw = await AsyncStorage.getItem(KEY);
          if (raw) {
            const saved = JSON.parse(raw);
            if (Number.isFinite(saved.energy) && Number.isFinite(saved.updatedAt)) {
              set({ ...recoverEnergy(saved.energy, Math.min(saved.updatedAt, Date.now()), Date.now()),
                activeLesson: typeof saved.activeLesson === 'string' ? saved.activeLesson : null,
                charged: Array.isArray(saved.charged) ? saved.charged.filter((v: unknown) => typeof v === 'string') : [] });
            }
          }
        } catch { /* A storage failure never prevents a lesson. */ }
        set({ hydrated: true });
      })();
      return loading;
    },
    refresh: () => { if (!get().hydrated) return; set(recoverEnergy(get().energy, get().updatedAt, Date.now())); persist(); },
    begin: (id) => {
      if (!get().hydrated) return false;
      get().refresh();
      if (get().energy <= 0 && get().activeLesson !== id) return false;
      if (get().activeLesson !== id) { set({ activeLesson: id, charged: [] }); persist(); }
      return true;
    },
    charge: (id) => {
      if (get().charged.includes(id) || !get().activeLesson) return;
      get().refresh();
      set({ energy: Math.max(0, get().energy - 10), charged: [...get().charged, id] }); persist();
    },
    finish: () => { set({ activeLesson: null, charged: [] }); persist(); },
  };
});
