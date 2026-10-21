import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import ParticleWave from './ParticleWave';

export default function ListeningScene({ playing, height = 88 }: { playing: boolean; height?: number }) {
  return <LinearGradient colors={['#121831', '#16152F', '#10192D']} style={[s.scene, { height }]} accessibilityLabel={playing ? 'Səs oxunur' : 'Dinləmə tapşırığı'}><View style={s.wave}><ParticleWave active={playing} height={height} /></View></LinearGradient>;
}
const s = StyleSheet.create({ scene: { borderRadius: 20, borderWidth: 1, borderColor: '#403868', overflow: 'hidden', justifyContent: 'center' }, wave: { paddingHorizontal: 10 } });
