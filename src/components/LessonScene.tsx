import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, AppState, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
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
      running = Animated.loop(Animated.sequence([
        Animated.timing(motion, { toValue: 1, duration, useNativeDriver: true, isInteraction: false }),
        Animated.timing(motion, { toValue: 0, duration, useNativeDriver: true, isInteraction: false }),
      ]));
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

export function SceneArtwork({ place, evening = false }: { place: ScenePlace; evening?: boolean }) {
  return <Svg width="100%" height="100%" viewBox="0 0 360 180" preserveAspectRatio="xMidYMid slice">
    <Defs><LinearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <Stop offset="0" stopColor={evening ? '#342858' : '#F5CDA3'} />
      <Stop offset="1" stopColor={evening ? '#675394' : '#FBE9CF'} />
    </LinearGradient><LinearGradient id="floor" x1="0" y1="0" x2="1" y2="1">
      <Stop offset="0" stopColor="#9C7666" /><Stop offset="1" stopColor="#604456" />
    </LinearGradient></Defs>
    <Rect width="360" height="180" fill={place === 'park' ? 'url(#sky)' : '#C4AAAE'} />
    {place === 'park' ? <G>
      <Circle cx="290" cy="39" r="20" fill={evening ? '#F5EAD4' : '#FFE8AC'} />
      <Path d="M0 107 Q76 52 158 102 Q268 55 360 98 V180 H0Z" fill="#879B82" />
      <Path d="M0 130 Q95 103 170 135 Q267 107 360 127 V180 H0Z" fill="#507A66" />
      <Path d="M157 124 Q214 140 269 180 H113 Q167 144 157 124" fill="#D3B798" />
      <Rect x="24" y="66" width="9" height="82" rx="4" fill="#795650" />
      <Circle cx="28" cy="55" r="35" fill="#54786A" /><Circle cx="46" cy="67" r="26" fill="#668978" />
      <Rect x="247" y="117" width="88" height="12" rx="4" fill="#624D58" />
      <Rect x="253" y="131" width="6" height="27" fill="#624D58" /><Rect x="321" y="131" width="6" height="27" fill="#624D58" />
      <Path d="M247 108 H335 M247 98 H335" stroke="#765B61" strokeWidth="8" strokeLinecap="round" />
    </G> : <G>
      <Rect y="133" width="360" height="47" fill="url(#floor)" />
      <Rect x="17" y="16" width="105" height="103" rx="9" fill="#8B717F" />
      <Rect x="23" y="22" width="93" height="91" rx="5" fill="url(#sky)" />
      <Circle cx="85" cy="48" r="17" fill={evening ? '#E6DAFD' : '#FFF0C0'} />
      <Path d="M25 89 Q61 72 115 88 V113 H25Z" fill={evening ? '#695789' : '#BDACAF'} />
      <Path d="M70 22 V113 M23 69 H116" stroke="#8B717F" strokeWidth="4" />
      {place === 'classroom' ? <G>
        <Rect x="172" y="19" width="168" height="93" rx="8" fill="#A17C6B" />
        <Rect x="179" y="26" width="154" height="79" rx="3" fill="#354E4B" />
        <Path d="M193 44 H270 M193 56 H300 M193 68 H242" stroke="#A6BCAC" strokeWidth="3" strokeLinecap="round" />
        <Rect x="266" y="98" width="37" height="4" rx="2" fill="#E9D0A9" />
        <Rect x="15" y="146" width="123" height="10" rx="4" fill="#A68068" />
        <Rect x="29" y="156" width="7" height="24" fill="#654E54" /><Rect x="112" y="156" width="7" height="24" fill="#654E54" />
        <Rect x="32" y="136" width="34" height="10" rx="2" fill="#8B78B7" /><Rect x="32" y="131" width="38" height="5" rx="1" fill="#F0D19C" />
      </G> : <G>
        <Rect x="187" y="25" width="103" height="72" rx="8" fill="#594557" />
        <Path d="M205 44 H266 M205 57 H247 M205 70 H266" stroke="#D5BAAB" strokeWidth="3" strokeLinecap="round" />
        <Rect x="238" y="118" width="106" height="14" rx="5" fill="#9B736A" />
        <Rect x="255" y="132" width="8" height="48" fill="#604652" /><Rect x="323" y="132" width="8" height="48" fill="#604652" />
        <Rect x="267" y="97" width="25" height="21" rx="6" fill="#F9DFBD" />
        <Path d="M292 103 Q308 101 298 114 H291" fill="none" stroke="#F9DFBD" strokeWidth="4" />
        <Path d="M273 89 Q269 84 274 78 M282 89 Q278 84 283 78" fill="none" stroke="#E8D2CE" strokeWidth="2" strokeLinecap="round" />
      </G>}
      <Rect x="322" y="119" width="23" height="26" rx="5" fill="#A67F70" />
      <Ellipse cx="332" cy="101" rx="10" ry="25" fill="#526D60" /><Ellipse cx="346" cy="109" rx="9" ry="20" fill="#678371" />
    </G>}
    <Ellipse cx="190" cy="168" rx="38" ry="6" fill="#382F48" opacity=".24" />
  </Svg>;
}

export default function LessonScene({ place = 'classroom', mood = 'idle', evening = false, label }: {
  place?: ScenePlace; mood?: FoxMood; evening?: boolean; label?: string;
}) {
  const placeLabel = { classroom: 'Sinif', cafe: 'Kafe', park: 'Park' }[place];
  return <View style={styles.scene} accessibilityLabel={label || placeLabel}>
    <SceneArtwork place={place} evening={evening} />
    <View style={styles.fox}><AnimatedFox mood={mood} size={92} /></View>
    <View style={styles.badge}><Text style={styles.label}>{label || placeLabel}</Text></View>
  </View>;
}
const styles = StyleSheet.create({
  scene: { height: 176, borderRadius: 22, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: t.border },
  fox: { position: 'absolute', left: '42%', bottom: 4 },
  badge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#201B34E8', borderRadius: 10 },
  label: { color: t.text, fontSize: 11, fontWeight: '700' },
});
