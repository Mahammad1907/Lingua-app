import { useState, type PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

// Header/footer are siblings: only the lesson body uses the remaining real area.
// Natural content is measured without a height constraint. Fitting it does not
// change its measurement, so showing help/feedback cannot start a layout loop.
export default function FixedLessonViewport({ children, contentContainerStyle, onHeight, testID = 'fixed-lesson-viewport' }: PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>; onHeight?: (height: number) => void; testID?: string;
}>) {
  const [area, setArea] = useState({ width: 0, height: 0 });
  const [bodyHeight, setBodyHeight] = useState(0);
  const scale = area.height > 0 && bodyHeight > 0 ? Math.min(1, Math.max(0, area.height - 2) / bodyHeight) : 1;
  return <View testID={testID} style={s.viewport} onLayout={e => {
    const { width, height } = e.nativeEvent.layout;
    setArea(old => old.width === width && old.height === height ? old : { width, height });
    onHeight?.(height);
  }}>
    <View testID={`${testID}-content`} onLayout={e => setBodyHeight(e.nativeEvent.layout.height)} style={[
      s.body, contentContainerStyle,
      { width: area.width || '100%', left: area.width * (1 - scale) / 2, transform: [{ scale }], transformOrigin: 'top left' },
    ]}>{children}</View>
  </View>;
}
const s = StyleSheet.create({ viewport: { flex: 1, minHeight: 0, overflow: 'hidden' }, body: { position: 'absolute', top: 0, flexGrow: 0 } });
