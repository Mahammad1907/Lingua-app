import { useEffect, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const frames = require('../../../assets/mascot/fox_review_frames.png');
const poses = [0, 1, 2, 3];

/** Four separate poses, blended once; the dust is timed to the brushing pose. */
export default function LessonReviewIntro() {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    progress.setValue(reduced ? 3 : 0);
    if (reduced) return;
    const animation = Animated.timing(progress, { toValue: 3, duration: 1500, easing: Easing.linear, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);
  return <View style={s.body}>
    <View accessibilityLabel="BirFox ayağa qalxıb üstünü təmizləyir" style={s.art}>
      {poses.map(i => <Animated.View key={i} style={[s.frame, { opacity: reduced ? i === 3 ? 1 : 0 : progress.interpolate({ inputRange: i === 0 ? [0, .6, 3] : i === 3 ? [0, 2.4, 3] : [0, i - .6, i, i + .6, 3], outputRange: i === 0 ? [1, 0, 0] : i === 3 ? [0, 0, 1] : [0, 0, 1, 0, 0], extrapolate: 'clamp' }) }]}>
        <Image source={frames} style={[s.sheet, { left: -i * 192 }]} resizeMode="stretch" />
      </Animated.View>)}
      {!reduced ? [0, 1, 2, 3].map((i) => <Animated.View key={i} style={[s.dust, { left: 92 + i * 14, top: 118 + i % 2 * 12, opacity: progress.interpolate({ inputRange: [0, 1.8, 2.15, 2.8, 3], outputRange: [0, 0, .65, 0, 0] }), transform: [{ translateX: progress.interpolate({ inputRange: [0, 1.8, 2.8, 3], outputRange: [0, 0, (i - 1.5) * 20, (i - 1.5) * 20] }) }, { translateY: progress.interpolate({ inputRange: [0, 1.8, 2.8, 3], outputRange: [0, 0, -15 - i * 4, -15 - i * 4] }) }] }]} />) : null}
    </View>
    <View style={s.card}><Text style={s.title}>Etdiyin səhvlərin təkrarı</Text><Text style={s.text}>Bu hissədə çətinlik oldu. İndi başqa vəziyyətdə yenidən məşq edək.</Text></View>
  </View>;
}
const s = StyleSheet.create({ body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, paddingHorizontal: 20 }, art: { width: 192, height: 256 }, frame: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' }, sheet: { position: 'absolute', width: 768, height: 256, top: 0 }, dust: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: '#C8BDAE' }, card: { width: '100%', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#8066AD', backgroundColor: '#211D3C', gap: 8 }, title: { color: '#FAF7FF', fontSize: 20, lineHeight: 27, fontWeight: '800' }, text: { color: '#D3C8EA', fontSize: 15, lineHeight: 22 } });
