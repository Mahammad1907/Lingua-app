// “Glow Line” sound visualizer (25 Nov 2026 design system). Never fills left to right.
// Idle: a calm thin lavender-grey line. Playing: the middle swells and undulates with a purple → orange glow and a soft
// lavender halo, tapering to thin ends. The wave moves at the playback speed (0.75x → 25% slower, 0.5x → 50%).
// The path is rebuilt on the UI thread every frame (Reanimated worklets), so it runs at the display rate.
import { useEffect, useId, useState } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useFrameCallback, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { d } from './theme';

const APath = Animated.createAnimatedComponent(Path);
const AG = Animated.createAnimatedComponent(G);

/** Closed outline of the swelling band: `reach` is the largest half-thickness (px), `amp` 0…1 how much it swells. */
function band(w: number, h: number, t: number, amp: number, reach: number, phase: number) {
  'worklet';
  const mid = h / 2, n = 44;
  const upper: string[] = [], lower: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = u * w;
    const env = Math.exp(-Math.pow((u - .5) / .19, 2));            // swell in the centre, thin ends
    const wob = .62 + .38 * Math.sin(t * 2.2 + u * 8 + phase) * Math.cos(t * 1.3 - u * 5);
    const top = .6 + amp * reach * env * wob;
    const bot = .6 + amp * reach * env * (.62 + .38 * Math.sin(t * 1.7 - u * 7 + phase * 1.6));
    upper.push(`${x.toFixed(1)},${(mid - top).toFixed(2)}`);
    lower.unshift(`${x.toFixed(1)},${(mid + bot).toFixed(2)}`);
  }
  return `M${upper.join(' L')} L${lower.join(' L')} Z`;
}

export default function GlowLine({ active, height = 40, rate = 1 }: { active?: boolean; height?: number; rate?: number }) {
  const reduced = useReducedMotion();
  const [w, setW] = useState(0);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const t = useSharedValue(0), amp = useSharedValue(0), speed = useSharedValue(rate), width = useSharedValue(0), h = useSharedValue(height);
  useEffect(() => { speed.value = rate; }, [rate, speed]);
  useEffect(() => { width.value = w; h.value = height; }, [w, height, width, h]);
  const frame = useFrameCallback(f => { t.value += ((f.timeSincePreviousFrame ?? 16) / 1000) * speed.value; }, false);
  useEffect(() => {
    amp.value = withTiming(active ? 1 : 0, { duration: active ? 420 : 520, easing: Easing.inOut(Easing.cubic) });
    frame.setActive(Boolean(active) && !reduced);
  }, [active, reduced, amp, frame]);

  const halo = useAnimatedProps(() => ({ d: band(width.value, h.value, t.value, amp.value, h.value * .46, 1.1) }));
  const glow = useAnimatedProps(() => ({ d: band(width.value, h.value, t.value, amp.value, h.value * .33, .4) }));
  const core = useAnimatedProps(() => ({ d: band(width.value, h.value, t.value, amp.value, h.value * .22, 0) }));
  const shown = useAnimatedProps(() => ({ opacity: amp.value }));

  return <View onLayout={e => setW(e.nativeEvent.layout.width)} style={{ height, justifyContent: 'center' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    {w > 0 ? <Svg width={w} height={height}>
      <Defs>
        <LinearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={d.lavenderMist} stopOpacity={.6} />
          <Stop offset=".34" stopColor={d.violet} />
          <Stop offset=".5" stopColor="#A855F7" />
          <Stop offset=".62" stopColor={d.actionLight} />
          <Stop offset=".8" stopColor={d.violetLight} />
          <Stop offset="1" stopColor={d.lavenderMist} stopOpacity={.6} />
        </LinearGradient>
        <LinearGradient id={`c${id}`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#fff" stopOpacity={0} />
          <Stop offset=".5" stopColor="#fff" stopOpacity={.95} />
          <Stop offset="1" stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {/* Idle line: always there, the glow grows out of it. */}
      <Rect x={0} y={height / 2 - 1} width={w} height={2} rx={1} fill="#DDD6FE" />
      <AG animatedProps={shown}>
        <APath animatedProps={halo} fill={d.lavenderMist} fillOpacity={.22} />
        <APath animatedProps={glow} fill={`url(#g${id})`} fillOpacity={.45} />
        <APath animatedProps={core} fill={`url(#g${id})`} />
        <Rect x={w * .18} y={height / 2 - .75} width={w * .64} height={1.5} rx={.75} fill={`url(#c${id})`} />
      </AG>
    </Svg> : null}
  </View>;
}
