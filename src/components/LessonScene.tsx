import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, AppState, Image, StyleSheet, Text, View } from 'react-native';
import { AtlasCrop, sceneCrops } from './BirTalkArtwork';
import { lessonTheme as t } from '../constants/lessonTheme';

export type ScenePlace = 'classroom' | 'cafe' | 'park';
export type FoxMood = 'idle' | 'listening' | 'thinking' | 'celebrate';
const foxImages = {
  idle: require('../../assets/mascot/fox_normal.png'),
  listening: require('../../assets/mascot/fox_normal.png'),
  thinking: require('../../assets/mascot/fox_sad.png'),
  celebrate: require('../../assets/mascot/fox_happy.png'),
};

// Native-driver transforms reuse existing artwork; this is not skeletal animation.
// Respect Reduce Motion and stop loops when the application is backgrounded.
export function AnimatedFox({ mood = 'idle', size = 84 }: { mood?: FoxMood; size?: number }) {
  const [motion] = useState(() => new Animated.Value(0));
  useEffect(() => {
    let disposed = false;
    let reduced = true;
    let running: Animated.CompositeAnimation | undefined;
    const sync = () => {
      running?.stop();
      motion.setValue(0);
      if (disposed || reduced || mood !== 'celebrate' || AppState.currentState !== 'active') return;
      const duration = mood === 'celebrate' ? 520 : 1400;
      running = Animated.sequence([
        Animated.timing(motion, { toValue: 1, duration, useNativeDriver: true, isInteraction: false }),
        Animated.timing(motion, { toValue: 0, duration, useNativeDriver: true, isInteraction: false }),
      ]);
      running.start();
    };
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => { reduced = value; sync(); }).catch(() => {});
    const reduce = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => { reduced = value; sync(); });
    const app = AppState.addEventListener('change', sync);
    return () => { disposed = true; running?.stop(); reduce.remove(); app.remove(); };
  }, [motion, mood]);
  return <Animated.View pointerEvents="none" style={{
    width: size, height: size * 1.23, overflow: 'hidden',
    transform: [
      { translateY: motion.interpolate({ inputRange: [0, 1], outputRange: [0, mood === 'celebrate' ? -9 : -3] }) },
      { rotate: motion.interpolate({ inputRange: [0, 1], outputRange: ['0deg', mood === 'celebrate' ? '2deg' : '0deg'] }) },
      { scale: motion.interpolate({ inputRange: [0, 1], outputRange: [1, mood === 'listening' ? 1.035 : 1.01] }) },
    ],
  }}>
    <Image source={foxImages[mood]} resizeMode="contain" style={{
      position: 'absolute', width: size * 2.65, height: size * 1.49, left: -size * 0.83, top: -size * 0.17,
    }} />
  </Animated.View>;
}

export function SceneArtwork({ place }: { place: ScenePlace; evening?: boolean }) {
  return <AtlasCrop crop={sceneCrops[place]} ratio={1.6} />;
}

export default function LessonScene({ place = 'classroom', label }: {
  place?: ScenePlace; mood?: FoxMood; evening?: boolean; label?: string;
}) {
  const placeLabel = { classroom: 'Sinif', cafe: 'Kafe', park: 'Park' }[place];
  return <View style={styles.scene} accessibilityLabel={label || placeLabel}>
    <AtlasCrop crop={sceneCrops[place]} ratio={1.6} />
    <View style={styles.badge}><Text style={styles.label}>{label || placeLabel}</Text></View>
  </View>;
}
const styles = StyleSheet.create({
  scene: { aspectRatio: 1.6, borderRadius: 22, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: t.border },
  fox: { position: 'absolute', left: '42%', bottom: 4 },
  badge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#201B34E8', borderRadius: 10 },
  label: { color: t.text, fontSize: 11, fontWeight: '700' },
});
