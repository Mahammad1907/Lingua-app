import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useUserStore } from '../store/userStore';
import { MAX_ENERGY } from '../utils/rewards';
import { HomeIcon } from './home/HomeIcon';

export default function EnergyMeter({ compact = false, appearance = 'default' }: { compact?: boolean; appearance?: 'default' | 'chapter' }) {
  const hearts = useUserStore((s) => s.hearts);
  const reduced = useReducedMotion();
  const percent = Math.round(hearts / MAX_ENERGY * 100);
  const previous = useRef(hearts);
  const [fill] = useState(() => new Animated.Value(percent));
  const [shake] = useState(() => new Animated.Value(0));
  const [spark] = useState(() => new Animated.Value(0));
  const focused = useRef(false);
  useFocusEffect(useCallback(() => {
    focused.current = true;
    return () => {
      focused.current = false;
      fill.stopAnimation(); shake.stopAnimation(); spark.stopAnimation();
    };
  }, [fill, shake, spark]));
  useEffect(() => {
    const lost = hearts < previous.current; previous.current = hearts;
    fill.stopAnimation(); shake.stopAnimation(); spark.stopAnimation();
    if (reduced || !focused.current) { fill.setValue(percent); shake.setValue(0); spark.setValue(0); return; }
    const animation = Animated.timing(fill, { toValue: percent, duration: lost ? 320 : 180, useNativeDriver: false });
    animation.start();
    if (lost) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      Animated.sequence([1, -1, 0].map((value) => Animated.timing(shake, { toValue: value * 2, duration: 55, useNativeDriver: true }))).start();
      spark.setValue(1);
      Animated.timing(spark, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    }
    return () => { animation.stop(); shake.stopAnimation(); spark.stopAnimation(); };
  }, [hearts, percent, reduced, fill, shake, spark]);
  return <Animated.View accessibilityLabel={`Enerji ${percent} faiz`} style={[styles.row, { transform: [{ translateX: shake }] }]}>
    <Text style={[styles.label, compact && styles.small]}>Enerji</Text>
    <View style={[styles.battery, compact && { width: 62 }, appearance === 'chapter' && { width: 98, height: 17 }]}>
      <View style={styles.inner}>
        <Animated.View style={[styles.fill, { width: fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]}>
          <LinearGradient colors={['#ffb24d', '#ff9535']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>
      <Text style={[styles.percent, { color: percent >= 60 ? '#171320' : '#f8eaff' },
        appearance === 'chapter' && { top: -15, left: undefined, right: 0, color: '#ffb344', fontSize: 10 }]}>{percent}%</Text>
      {appearance === 'chapter' && <View pointerEvents="none" style={styles.chapterBolt}><HomeIcon name="bolt" size={12} color={percent >= 60 ? '#211829' : '#ffb344'} /></View>}
      <View style={styles.cap} />
      <Animated.Text pointerEvents="none" style={[styles.spark, { opacity: spark }]}>ϟ</Animated.Text>
    </View>
  </Animated.View>;
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 }, label: { color: '#ac92f0', fontSize: 10.5, fontWeight: '700' }, small: { fontSize: 9 },
  battery: { width: 81, height: 15, borderRadius: 6, borderWidth: 1, borderColor: '#ae91f0', padding: 1 },
  inner: { flex: 1, borderRadius: 4, overflow: 'hidden' }, fill: { height: '100%' },
  percent: { position: 'absolute', left: 0, right: 0, top: 0, fontSize: 9, lineHeight: 13, fontWeight: '800', textAlign: 'center' },
  cap: { position: 'absolute', right: -6, top: 3, height: 8, width: 4, borderRadius: 2, backgroundColor: '#a38ade' },
  spark: { position: 'absolute', right: -4, top: -15, color: '#ffd18b', fontSize: 25 },
  chapterBolt: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
