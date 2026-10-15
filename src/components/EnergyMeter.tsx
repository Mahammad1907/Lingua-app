import { useEffect, useState } from 'react';
import { Animated, AppState, Text, View } from 'react-native';
import { useEnergyStore } from '../store/energyStore';
import { lessonTheme as t } from '../constants/lessonTheme';
export default function EnergyMeter() {
  const energy = useEnergyStore(s => s.energy);
  const [fill] = useState(() => new Animated.Value(energy));
  useEffect(() => {
    void useEnergyStore.getState().hydrate();
    const timer = setInterval(() => useEnergyStore.getState().refresh(), 30000);
    const sub = AppState.addEventListener('change', state => { if (state === 'active') useEnergyStore.getState().refresh(); });
    return () => { clearInterval(timer); sub.remove(); };
  }, []);
  useEffect(() => {
    const animation = Animated.timing(fill, { toValue: energy, duration: 350, useNativeDriver: false, isInteraction: false });
    animation.start(); return () => animation.stop();
  }, [energy, fill]);
  return <View accessibilityLabel={`Enerji ${energy} faiz`} style={{ gap: 4, width: 70 }}>
    <Text style={{ color: t.orange, fontSize: 11, fontWeight: '800', textAlign: 'right' }}>ϟ {energy}%</Text>
    <View style={{ height: 5, backgroundColor: t.raised, borderRadius: 4, overflow: 'hidden' }}><Animated.View style={{ height: 5, backgroundColor: energy <= 20 ? t.error : t.orange, width: fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }} /></View>
  </View>;
}
