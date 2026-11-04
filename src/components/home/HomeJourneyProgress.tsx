import { useEffect, useId, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Defs, Path, RadialGradient, Stop } from 'react-native-svg';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Coordinates share the approved artwork's original 768 × 1536 space.
// Connectors stop at tile edges, so the fill never paints over lesson icons.
export const HOME_CONNECTORS = [
  'M 285 578 C 341 604 380 570 442 580',
  'M 454 635 C 450 660 374 666 320 696',
  'M 322 741 C 378 775 410 729 468 757',
  'M 474 834 C 409 884 342 873 278 899',
  'M 277 961 C 319 992 365 983 407 986',
  'M 409 1078 C 393 1080 370 1085 343 1080',
] as const;
// Sample each cubic once so the animated dash advances at the same rate as the
// visible curve, rather than spending most of the transition outside the path.
export const HOME_CONNECTOR_LENGTHS = HOME_CONNECTORS.map(d => {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = d.match(/[\d.]+/g)!.map(Number);
  let length = 0;
  let previous = [x0, y0];
  for (let step = 1; step <= 100; step++) {
    const t = step / 100;
    const u = 1 - t;
    const point = [u ** 3 * x0 + 3 * u ** 2 * t * x1 + 3 * u * t ** 2 * x2 + t ** 3 * x3,
      u ** 3 * y0 + 3 * u ** 2 * t * y1 + 3 * u * t ** 2 * y2 + t ** 3 * y3];
    length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    previous = point;
  }
  return Math.ceil(length);
});
const ISLAND = 'M 380 396 C 467 421 565 374 624 426 C 659 458 650 510 671 548 C 730 602 729 664 702 724 C 680 777 699 814 709 852 C 727 906 690 945 684 999 C 678 1052 710 1094 667 1142 C 641 1171 599 1186 554 1196 C 495 1240 444 1227 390 1217 C 326 1187 276 1231 217 1188 C 172 1163 113 1169 91 1116 C 66 1068 110 1038 93 989 C 75 942 36 921 58 857 C 79 802 48 756 54 707 C 32 645 53 585 88 548 C 119 511 105 463 140 434 C 191 390 277 393 324 400 C 347 406 366 400 380 396 Z';

export function HomeJourneyProgress({ completedCount, percent, scale }: {
  completedCount: number; percent: number; scale: number;
}) {
  const reduced = useReducedMotion();
  const tintId = `home-tint-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const count = Math.min(7, Math.max(0, completedCount));
  const target = Math.min(100, Math.max(0, percent));
  const [progress] = useState(() => new Animated.Value(target));
  const [route] = useState(() => new Animated.Value(count));
  const previousCount = useRef(count);

  useEffect(() => {
    progress.stopAnimation();
    route.stopAnimation();
    // Replays, storage hydration, and progress resets must settle honestly too.
    if (reduced || count <= previousCount.current) {
      progress.setValue(target);
      route.setValue(count);
      previousCount.current = count;
      return;
    }
    previousCount.current = count;
    const animation = Animated.parallel([
      Animated.timing(progress, { toValue: target, duration: 600,
        easing: Easing.inOut(Easing.cubic), useNativeDriver: false, isInteraction: false }),
      Animated.timing(route, { toValue: count, duration: 600,
        easing: Easing.inOut(Easing.cubic), useNativeDriver: false, isInteraction: false }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [count, target, reduced, progress, route]);

  return <View pointerEvents="none" accessible={false} style={StyleSheet.absoluteFill}>
    <Svg width={682 * scale} height={1312 * scale} viewBox="43 83 682 1312" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id={tintId} gradientUnits="userSpaceOnUse" cx={384} cy={810} rx={330} ry={410}>
          <Stop offset="0" stopColor="#7931C4" stopOpacity={1} />
          <Stop offset="0.65" stopColor="#7931C4" stopOpacity={0.8} />
          <Stop offset="1" stopColor="#7931C4" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {/* A restrained translucent tint keeps the original relief, text and icons legible. */}
      <AnimatedPath d={ISLAND} fill={`url(#${tintId})`} opacity={progress.interpolate({
        inputRange: [0, 100], outputRange: [0, 0.24], extrapolate: 'clamp',
      })} />
      {HOME_CONNECTORS.map((d, index) => <Path key={`track-${index}`} d={d}
        fill="none" stroke="#DEC2EF" strokeWidth={4} strokeLinecap="round" />)}
      {HOME_CONNECTORS.map((d, index) => <AnimatedPath key={`fill-${index}`} d={d}
        fill="none" stroke="#913AE2" strokeWidth={5} strokeLinecap="round"
        strokeDasharray={[HOME_CONNECTOR_LENGTHS[index], HOME_CONNECTOR_LENGTHS[index]]}
        opacity={route.interpolate({ inputRange: [index + 1, index + 1.001], outputRange: [0, 1], extrapolate: 'clamp' })}
        strokeDashoffset={route.interpolate({ inputRange: [index + 1, index + 2],
          outputRange: [HOME_CONNECTOR_LENGTHS[index], 0], extrapolate: 'clamp' })} />)}
    </Svg>
  </View>;
}
