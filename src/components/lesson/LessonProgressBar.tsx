import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function LessonProgressBar({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const fraction = Math.min(1, Math.max(0, value));
  const [width, setWidth] = useState(0);
  const [progress] = useState(() => new Animated.Value(fraction));
  const [spark] = useState(() => new Animated.Value(1));
  const highest = useRef(fraction);
  useEffect(() => {
    highest.current = Math.max(highest.current, fraction);
    progress.stopAnimation(); spark.stopAnimation();
    if (reduced) { progress.setValue(highest.current); spark.setValue(1); return; }
    spark.setValue(0);
    const animation = Animated.parallel([
      Animated.timing(progress, { toValue: highest.current, duration: 450, useNativeDriver: false, isInteraction: false }),
      Animated.timing(spark, { toValue: 1, duration: 550, useNativeDriver: false, isInteraction: false }),
    ]);
    animation.start(); return () => animation.stop();
  }, [fraction, reduced, progress, spark]);
  return <View accessible accessibilityRole="progressbar" accessibilityLabel="Dərsdə irəliləyiş" accessibilityValue={{ min: 0, max: 100, now: Math.round(fraction * 100) }} onLayout={e => setWidth(e.nativeEvent.layout.width)} style={s.track}>
    <Animated.View style={[s.fill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: [0, width] }) }]}>
      <LinearGradient colors={['#FF912F', '#FFC04F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      {!reduced ? <Animated.View pointerEvents="none" style={[s.spark, { opacity: spark.interpolate({ inputRange: [0, .2, .7, 1], outputRange: [0, 1, .7, 0] }) }]} /> : null}
    </Animated.View>
  </View>;
}
const s = StyleSheet.create({ track: { flex: 1, height: 7, borderRadius: 7, backgroundColor: '#282342', overflow: 'hidden' }, fill: { height: '100%', borderRadius: 7, overflow: 'hidden' }, spark: { position: 'absolute', right: 0, width: 18, top: -2, bottom: -2, borderRadius: 5, backgroundColor: '#FFF1B5', transform: [{ skewX: '-25deg' }] } });
