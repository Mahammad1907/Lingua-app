import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
const KEY = 'birtalk.lesson.playback-speed';
export function useLessonSpeed() {
  const [speed, setSpeed] = useState(1);
  const selected = useRef(false);
  useEffect(() => {
    let mounted = true;
    void AsyncStorage.getItem(KEY).then(value => {
      const number = Number(value);
      if (mounted && !selected.current && [.75, 1, 1.25].includes(number)) setSpeed(number);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  const choose = useCallback((value: number) => {
    if (![.75, 1, 1.25].includes(value)) return;
    selected.current = true; setSpeed(value); void AsyncStorage.setItem(KEY, String(value)).catch(() => {});
  }, []);
  return [speed, choose] as const;
}
