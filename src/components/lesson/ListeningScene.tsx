import { useLessonTheme, useLessonStyles } from './LessonTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import ParticleWave from './ParticleWave';

export default function ListeningScene({ playing, height = 88 }: { playing: boolean; height?: number }) {
  const { light } = useLessonTheme();
  const s = useLessonStyles(baseStyles);
  return <LinearGradient colors={light ? ['#FFFBFF', '#F0DFFB', '#F8EDFF'] : ['#121831', '#16152F', '#10192D']} style={[s.scene, { height }]} accessibilityLabel={playing ? 'Səs oxunur' : 'Dinləmə tapşırığı'}><View style={s.wave}><ParticleWave active={playing} height={height} /></View></LinearGradient>;
}
const baseStyles = StyleSheet.create({ scene: { borderRadius: 20, borderWidth: 1, borderColor: '#403868', overflow: 'hidden', flexDirection: 'row', alignItems: 'center' }, wave: { flex: 1, paddingHorizontal: 10 } });
