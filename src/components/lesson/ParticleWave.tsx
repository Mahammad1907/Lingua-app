import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Original vector particles inspired by the reference; no stock/watermarked bitmap.
export default function ParticleWave({ active, level, height = 86 }: { active: boolean; level?: number; height?: number }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!active || reduced) return;
    const timer = setInterval(() => setPhase(p => (p + .2) % (Math.PI * 2)), 90);
    return () => clearInterval(timer);
  }, [active, reduced]);
  // Playback uses decorative motion; recording amplitude follows measured volume.
  const amplitude = active ? level === undefined ? .7 : Math.max(0, Math.min(1, level)) : .13;
  const paths = Array.from({ length: 9 }, (_, strand) => {
    let d = '';
    for (let i = 0; i <= 72; i++) {
      const x = i / 72 * 320;
      const envelope = .3 + .7 * Math.exp(-(((x - 160) / 70) ** 2));
      const y = 50 + Math.sin(i * .18 + phase + strand * .23) * (8 + 31 * amplitude) * envelope * (1 - strand * .055);
      d += `M${x.toFixed(1)},${y.toFixed(1)}l.01,0`;
    }
    return d;
  });
  return <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[s.wave, { height }]}><Svg width="100%" height="100%" viewBox="0 0 320 100">{paths.map((d, i) => <Path key={i} d={d} stroke={i < 4 ? '#6DDFFF' : '#BD9AFF'} strokeWidth={1.6} strokeLinecap="round" opacity={.9 - i * .045} />)}</Svg></View>;
}
const s = StyleSheet.create({ wave: { width: '100%', justifyContent: 'center' } });
