import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export const artworkCanvas = '#090C20';
// Feather the frame, not the picture: no blur, raster regeneration or extra asset.
export default function ArtworkFade({ color = artworkCanvas }: { color?: string }) {
  const clear = `${color}00`;
  return <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
    <LinearGradient colors={[color, clear]} style={s.top} />
    <LinearGradient colors={[clear, color]} style={s.bottom} />
    <LinearGradient colors={[color, clear]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.left} />
    <LinearGradient colors={[clear, color]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.right} />
  </View>;
}
const s = StyleSheet.create({
  top: { position: 'absolute', top: 0, left: 0, right: 0, height: '9%' },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '13%' },
  left: { position: 'absolute', top: 0, bottom: 0, left: 0, width: '4%' },
  right: { position: 'absolute', top: 0, bottom: 0, right: 0, width: '4%' },
});
