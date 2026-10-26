import ArtworkFade, { artworkCanvas } from './ArtworkFade';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
export default function LessonImage({ source, fit = 'contain', style, canvasColor = artworkCanvas }: { source: number; fit?: 'cover' | 'contain'; style?: StyleProp<ViewStyle>; canvasColor?: string }) {
  return <Artwork key={typeof source === 'number' ? source : JSON.stringify(source)} source={source} fit={fit} style={style} canvasColor={canvasColor} />;
}
function Artwork({ source, fit, style, canvasColor }: { source: number; fit: 'cover' | 'contain'; style?: StyleProp<ViewStyle>; canvasColor?: string }) {
  const [error, setError] = useState(false), [loaded, setLoaded] = useState(false), [retry, setRetry] = useState(0);
  return <View style={[s.frame, { backgroundColor: canvasColor }, style]}>
    {!loaded && !error ? <Text style={s.note}>Şəkil yüklənir…</Text> : null}
    <Image key={retry} source={source} contentFit={fit} cachePolicy="memory-disk" recyclingKey={`${source}:${retry}`} transition={0} accessible={false} style={StyleSheet.absoluteFill} onLoad={() => { setLoaded(true); setError(false); }} onError={() => { setLoaded(false); setError(true); }} />
    <ArtworkFade color={canvasColor} />
    {error ? <Pressable accessibilityRole="button" style={s.retry} onPress={() => { setError(false); setRetry(v => v + 1); }}><Text style={s.note}>Şəkil açılmadı · Yenidən yüklə</Text></Pressable> : null}
  </View>;
}
const s = StyleSheet.create({ frame: { justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: artworkCanvas }, note: { color: '#ADA5CC', fontSize: 12, padding: 8 }, retry: { position: 'absolute', bottom: 0, left: 0, minHeight: 44, backgroundColor: '#141429E8', justifyContent: 'center' } });
