import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import ParticleWave from './ParticleWave';
import { Image } from 'expo-image';
import { lessonSceneSources } from '../../utils/lessonAssets';

export default function ListeningScene({ playing, height = 88, showIllustration = false }: { playing: boolean; height?: number; showIllustration?: boolean }) {
  return <LinearGradient colors={['#121831', '#16152F', '#10192D']} style={[s.scene, { height }]} accessibilityLabel={playing ? 'Səs oxunur' : 'Dinləmə tapşırığı'}>{showIllustration ? <Image source={lessonSceneSources.clarify} contentFit="contain" accessible={false} style={s.art} /> : null}<View style={s.wave}><ParticleWave active={playing} height={height} /></View></LinearGradient>;
}
const s = StyleSheet.create({ scene: { borderRadius: 20, borderWidth: 1, borderColor: '#403868', overflow: 'hidden', flexDirection: 'row', alignItems: 'center' }, art: { width: '40%', height: '100%' }, wave: { flex: 1, paddingHorizontal: 10 } });
