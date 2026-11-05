import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const ISLAND = 'M 380 396 C 467 421 565 374 624 426 C 659 458 650 510 671 548 C 730 602 729 664 702 724 C 680 777 699 814 709 852 C 727 906 690 945 684 999 C 678 1052 710 1094 667 1142 C 641 1171 599 1186 554 1196 C 495 1240 444 1227 390 1217 C 326 1187 276 1231 217 1188 C 172 1163 113 1169 91 1116 C 66 1068 110 1038 93 989 C 75 942 36 921 58 857 C 79 802 48 756 54 707 C 32 645 53 585 88 548 C 119 511 105 463 140 434 C 191 390 277 393 324 400 C 347 406 366 400 380 396 Z';

export function homeConnectors(extra: number) {
  return [
    'M 363 575 C 380 593 390 570 404 575',
    'M 454 643 C 450 660 384 666 363 696',
    'M 363 741 C 378 775 390 729 404 757',
    'M 474 858 C 409 884 380 873 363 899',
    `M 363 961 C 319 ${992 + extra * .35} 365 ${983 + extra} 404 ${986 + extra}`,
    `M 409 ${1078 + extra} C 393 ${1080 + extra} 380 ${1085 + extra} 363 ${1080 + extra}`,
  ];
}
export function connectorLength(d: string) {
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
}

export function HomeJourneyProgress({ completedCount, percent, scale, headerHeight, captionExtra }: {
  completedCount: number; percent: number; scale: number; headerHeight: number; captionExtra: number;
}) {
  const reduced = useReducedMotion();
  const id = `island${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const count = Math.min(7, Math.max(0, completedCount));
  const target = Math.min(100, Math.max(0, percent));
  const [progress] = useState(() => new Animated.Value(target));
  const [route] = useState(() => new Animated.Value(count));
  const previousCount = useRef(count);
  const extra = captionExtra / scale;
  const connectors = useMemo(() => homeConnectors(extra), [extra]);
  const lengths = useMemo(() => connectors.map(connectorLength), [connectors]);

  useEffect(() => {
    progress.stopAnimation(); route.stopAnimation();
    if (reduced || count <= previousCount.current) {
      progress.setValue(target); route.setValue(count); previousCount.current = count;
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
    <Svg width={682 * scale} height={headerHeight + 737 * scale + captionExtra} viewBox="43 392 682 858"
      preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id={`${id}base`} x1="10%" y1="0%" x2="90%" y2="100%">
          <Stop offset="0" stopColor="#FCF7FF" /><Stop offset=".45" stopColor="#EFDEFB" /><Stop offset="1" stopColor="#DFBDF4" />
        </LinearGradient>
        <LinearGradient id={`${id}tint`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0" stopColor="#B480E5" /><Stop offset="1" stopColor="#8E4BCE" />
        </LinearGradient>
      </Defs>
      <Path d={ISLAND} transform="translate(0 8)" fill="#CEAAE6" opacity={.6} />
      <Path d={ISLAND} fill={`url(#${id}base)`} stroke="#F9EDFF" strokeWidth={4} />
      <AnimatedPath d={ISLAND} fill={`url(#${id}tint)`} opacity={progress.interpolate({
        inputRange: [0, 100], outputRange: [0, .36], extrapolate: 'clamp',
      })} />
    </Svg>
    <Svg width={682 * scale} height={737 * scale + captionExtra} viewBox={`43 507 682 ${737 + extra}`}
      style={{ position: 'absolute', top: headerHeight }}>
      {connectors.map((d, index) => <Path key={`track-${index}`} d={d}
        fill="none" stroke="#D7B8EB" strokeWidth={3} strokeLinecap="round" />)}
      {connectors.map((d, index) => <AnimatedPath key={`fill-${index}`} d={d}
        fill="none" stroke="#913AE2" strokeWidth={5} strokeLinecap="round"
        strokeDasharray={[lengths[index], lengths[index]]}
        opacity={route.interpolate({ inputRange: [index + 1, index + 1.001], outputRange: [0, 1], extrapolate: 'clamp' })}
        strokeDashoffset={route.interpolate({ inputRange: [index + 1, index + 2],
          outputRange: [lengths[index], 0], extrapolate: 'clamp' })} />)}
    </Svg>
  </View>;
}
