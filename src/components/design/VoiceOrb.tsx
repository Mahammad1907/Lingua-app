// Press-and-hold microphone (25 Nov 2026 design system).
// Idle: a royal-purple gradient circle with soft lavender halo rings. While recording it melts into the “AI Voice Orb”:
// slowly rotating, morphing soft blobs of royal purple, translucent lavender and warm orange inside a breathing circle,
// with a radiant outer aura. The white mic stays centred on top. Release → it settles back into the purple circle.
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, cancelAnimation, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { d } from './theme';

export const ORB = 112;          // the button itself
export const ORB_BOX = 200;      // room for the aura and halo rings
const BOX = ORB_BOX;

/** A soft round blob: a colour that fades to transparent at its edge (no blur filter needed). */
function Blob({ size, color, opacity = 1 }: { size: number; color: string; opacity?: number }) {
  const id = `b${color.replace('#', '')}${size}`;
  return <Svg width={size} height={size}>
    <Defs><RadialGradient id={id} cx="50%" cy="50%" r="50%">
      <Stop offset="0" stopColor={color} stopOpacity={opacity} />
      <Stop offset=".55" stopColor={color} stopOpacity={opacity * .75} />
      <Stop offset="1" stopColor={color} stopOpacity={0} />
    </RadialGradient></Defs>
    <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
  </Svg>;
}

export default function VoiceOrb({ active, disabled }: { active: boolean; disabled?: boolean }) {
  const reduced = useReducedMotion();
  const on = useSharedValue(0), spin = useSharedValue(0), breathe = useSharedValue(0);
  useEffect(() => {
    on.value = withTiming(active ? 1 : 0, { duration: active ? 380 : 480, easing: Easing.inOut(Easing.cubic) });
    if (active && !reduced) {
      spin.value = withRepeat(withTiming(spin.value + 1, { duration: 5200, easing: Easing.linear }), -1, false);
      breathe.value = withRepeat(withSequence(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) })), -1, false);
    } else { cancelAnimation(spin); cancelAnimation(breathe); breathe.value = withTiming(0, { duration: 300 }); }
  }, [active, reduced, on, spin, breathe]);

  const aura = useAnimatedStyle(() => ({ opacity: on.value, transform: [{ scale: .75 + .25 * on.value + .06 * breathe.value }] }));
  const rings = useAnimatedStyle(() => ({ opacity: 1 - on.value }));
  const idle = useAnimatedStyle(() => ({ opacity: 1 - on.value }));
  // The orb body wobbles a little out of round, so its outline feels organic.
  const body = useAnimatedStyle(() => ({
    opacity: on.value,
    transform: [
      { scale: interpolate(on.value, [0, 1], [.92, 1.14]) + .04 * breathe.value },
      { scaleX: 1 + .035 * Math.sin(spin.value * Math.PI * 2 * 2) },
      { scaleY: 1 + .035 * Math.cos(spin.value * Math.PI * 2 * 3) },
    ],
  }));
  const turnA = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));
  const turnB = useAnimatedStyle(() => ({ transform: [{ rotate: `${-spin.value * 720 + 120}deg` }] }));
  const turnC = useAnimatedStyle(() => ({ transform: [{ rotate: `${-spin.value * 360 + 240}deg` }] }));

  return <View pointerEvents="none" style={[s.box, disabled && { opacity: .5 }]}>
    {/* Radiant aura while listening */}
    <Animated.View style={[s.layer(BOX), aura]}>
      <Svg width={BOX} height={BOX}>
        <Defs><RadialGradient id="orbAura" cx="50%" cy="50%" r="50%">
          <Stop offset=".45" stopColor={d.violetLight} stopOpacity={.32} />
          <Stop offset=".72" stopColor={d.actionLight} stopOpacity={.14} />
          <Stop offset="1" stopColor={d.lavenderMist} stopOpacity={0} />
        </RadialGradient></Defs>
        <Circle cx={BOX / 2} cy={BOX / 2} r={BOX / 2} fill="url(#orbAura)" />
      </Svg>
    </Animated.View>
    {/* Idle halo rings */}
    <Animated.View style={[s.layer(ORB + 56), { borderRadius: (ORB + 56) / 2, backgroundColor: 'rgba(196,181,253,.16)' }, rings]} />
    <Animated.View style={[s.layer(ORB + 26), { borderRadius: (ORB + 26) / 2, backgroundColor: 'rgba(196,181,253,.28)' }, rings]} />
    {/* Idle: purple gradient circle */}
    <Animated.View style={[s.layer(ORB), idle]}>
      <LinearGradient colors={[d.violetLight, d.purple]} start={{ x: .2, y: 0 }} end={{ x: .8, y: 1 }} style={s.circle} />
    </Animated.View>
    {/* Recording: the AI Voice Orb */}
    <Animated.View style={[s.layer(ORB), body]}>
      <View style={[s.circle, s.orbClip]}>
        <Animated.View style={[s.spin, turnA]}><View style={{ position: 'absolute', left: -14, top: -8 }}><Blob size={ORB} color={d.violet} /></View></Animated.View>
        <Animated.View style={[s.spin, turnB]}><View style={{ position: 'absolute', left: ORB * .42, top: -ORB * .06 }}><Blob size={ORB * .68} color={d.actionLight} opacity={.9} /></View></Animated.View>
        <Animated.View style={[s.spin, turnC]}><View style={{ position: 'absolute', left: ORB * .05, top: ORB * .42 }}><Blob size={ORB * .8} color={d.lavenderMist} opacity={.95} /></View></Animated.View>
        <Animated.View style={[s.spin, turnB]}><View style={{ position: 'absolute', left: ORB * .3, top: ORB * .3 }}><Blob size={ORB * .55} color={d.purple} opacity={.8} /></View></Animated.View>
        {/* Glassy highlight */}
        <View style={{ position: 'absolute', left: ORB * .12, top: ORB * .06 }}><Blob size={ORB * .5} color="#FFFFFF" opacity={.35} /></View>
      </View>
    </Animated.View>
  </View>;
}

const at = (size: number) => ({ position: 'absolute' as const, width: size, height: size, left: (BOX - size) / 2, top: (BOX - size) / 2 });
const s = {
  ...StyleSheet.create({
    box: { width: BOX, height: BOX, position: 'relative' },
    circle: { width: ORB, height: ORB, borderRadius: ORB / 2 },
    orbClip: { overflow: 'hidden', backgroundColor: '#8B5CF6' },
    spin: { position: 'absolute', left: 0, top: 0, width: ORB, height: ORB },
  }),
  /** Every layer gets its own exact square, centred in the box — no absoluteFill/alignment (layers drifted on device). */
  layer: at,
};
