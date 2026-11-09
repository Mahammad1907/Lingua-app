import { useState, type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

// Header/footer are siblings: only the lesson body uses the remaining real area.
// Legacy cards keep their existing fitting mode. V2 keeps native font metrics:
// a card only permits overflow when measured content cannot fit (large text,
// keyboard, expanded support). Header and primary action never scroll away.
export default function FixedLessonViewport({ children, contentContainerStyle, onHeight, testID = 'fixed-lesson-viewport', preserveText = false }: PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>; onHeight?: (height: number) => void; testID?: string; preserveText?: boolean;
}>) {
  const [area, setArea] = useState({ width: 0, height: 0 });
  const [bodyHeight, setBodyHeight] = useState(0);
  const scale = area.height > 0 && bodyHeight > 0 ? Math.min(1, Math.max(0, area.height - 2) / bodyHeight) : 1;
  return <View testID={testID} style={s.viewport} onLayout={e => {
    const { width, height } = e.nativeEvent.layout;
    setArea(old => old.width === width && old.height === height ? old : { width, height });
    onHeight?.(height);
  }}>
    {preserveText ? <ScrollView testID={`${testID}-overflow`} scrollEnabled={bodyHeight > area.height + 1} bounces={false} keyboardShouldPersistTaps="handled" contentContainerStyle={contentContainerStyle} onContentSizeChange={(_width, height) => setBodyHeight(height)}>{children}</ScrollView> : <View testID={`${testID}-content`} onLayout={e => setBodyHeight(e.nativeEvent.layout.height)} style={[
      s.body, contentContainerStyle,
      { width: area.width || '100%', left: area.width * (1 - scale) / 2, transform: [{ scale }], transformOrigin: 'top left' },
    ]}>{children}</View>}
  </View>;
}
const s = StyleSheet.create({ viewport: { flex: 1, minHeight: 0, overflow: 'hidden' }, body: { position: 'absolute', top: 0, flexGrow: 0 } });
