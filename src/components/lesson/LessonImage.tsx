import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
export default function LessonImage({ source, fit = 'contain', style }: { source: number; fit?: 'cover' | 'contain'; style?: StyleProp<ViewStyle> }) {
  return <Artwork key={typeof source === 'number' ? source : JSON.stringify(source)} source={source} fit={fit} style={style} />;
}
function Artwork({ source, fit, style }: { source: number; fit: 'cover' | 'contain'; style?: StyleProp<ViewStyle> }) {
  const [error, setError] = useState(false), [loaded, setLoaded] = useState(false), [retry, setRetry] = useState(0);
  return <View style={[s.frame, style]}>
    {!loaded && !error ? <Text style={s.note}>Şəkil yüklənir…</Text> : null}
    <Image key={retry} source={source} contentFit={fit} cachePolicy="memory-disk" recyclingKey={`${source}:${retry}`} transition={0} accessible={false} style={StyleSheet.absoluteFill} onLoad={() => { setLoaded(true); setError(false); }} onError={() => { setLoaded(false); setError(true); }} />
    {error ? <Pressable accessibilityRole="button" style={s.retry} onPress={() => { setError(false); setRetry(v => v + 1); }}><Text style={s.note}>Şəkil açılmadı · Yenidən yüklə</Text></Pressable> : null}
  </View>;
}
const s = StyleSheet.create({ frame: { justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: '#141429' }, note: { color: '#ADA5CC', fontSize: 12, padding: 8 }, retry: { position: 'absolute', bottom: 0, left: 0, minHeight: 44, backgroundColor: '#141429E8', justifyContent: 'center' } });
