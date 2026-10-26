import { Children, Fragment, forwardRef, isValidElement, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { lessonPages, type LessonBlockBounds } from '../../utils/lessonPages';
import { ink } from './LessonSurface';

export interface LessonViewportHandle { scrollTo: (options: { y: number; animated?: boolean }) => void; scrollToEnd: (options?: { animated?: boolean }) => void }
function blocksOf(children: ReactNode, prefix = ''): { node: ReactNode; key: string }[] {
  return Children.toArray(children).flatMap((child, index) => {
    const key = `${prefix}/${isValidElement(child) ? child.key ?? index : index}`;
    return isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment ? blocksOf(child.props.children, key) : [{ node: child, key }];
  });
}

// One fixed card, no vertical swipe/ScrollView. Rare overflow (large fonts,
// keyboard, long authored text) uses explicit in-card pages, never clipped text.
const LessonViewport = forwardRef<LessonViewportHandle, { children: ReactNode; resetKey: string; onHeight: (height: number) => void }>(function LessonViewport({ children, resetKey, onHeight }, ref) {
  const [height, setHeight] = useState(0), [contentHeight, setContentHeight] = useState(0);
  const [pageState, setPage] = useState({ key: resetKey, index: 0 });
  const [bounds, setBounds] = useState<Record<number, LessonBlockBounds>>({});
  const currentKey = useRef(resetKey);
  const page = pageState.key === resetKey ? pageState.index : 0;
  const overflow = height > 0 && contentHeight > height + 1;
  const viewport = Math.max(0, height - (overflow ? 44 : 0));
  const pages = lessonPages(contentHeight, viewport, Object.values(bounds).sort((a, b) => a.y - b.y));
  const current = Math.min(page, pages.length - 1);
  const offset = pages[current];
  useImperativeHandle(ref, () => ({
    scrollTo: () => setPage({ key: resetKey, index: 0 }),
    scrollToEnd: () => setPage({ key: resetKey, index: pages.length - 1 }),
  }), [resetKey, pages.length]);
  return <View testID="lesson-fixed-viewport" style={s.root} onLayout={event => { const h = event.nativeEvent.layout.height; setHeight(h); onHeight(h); }}>
    <View style={s.window}>
      <View testID="lesson-card-content" style={[s.content, { top: -offset }]} onLayout={event => { setContentHeight(event.nativeEvent.layout.height); if (currentKey.current !== resetKey) { currentKey.current = resetKey; setBounds({}); } }}>
        {blocksOf(children).map(({ node, key }, i) => {
          const b = bounds[i];
          const hidden = Boolean(height && b && (b.y + b.height <= offset || b.y >= offset + viewport));
          return <View key={key} accessibilityElementsHidden={hidden} importantForAccessibility={hidden ? 'no-hide-descendants' : 'auto'} pointerEvents={hidden ? 'none' : 'auto'} onLayout={event => { const { y, height: h } = event.nativeEvent.layout; setBounds(all => all[i]?.y === y && all[i]?.height === h ? all : { ...all, [i]: { y, height: h } }); }}>{node}</View>;
        })}
      </View>
    </View>
    {overflow ? <View style={s.navigation}>
      <Pressable accessibilityRole="button" accessibilityLabel="Kartın əvvəlki hissəsi" disabled={!current} onPress={() => setPage({ key: resetKey, index: current - 1 })} style={[s.link, !current && s.disabled]}><Text style={s.label}>‹ Əvvəlki hissə</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Kartın davamını göstər" disabled={current === pages.length - 1} onPress={() => setPage({ key: resetKey, index: current + 1 })} style={[s.link, current === pages.length - 1 && s.disabled]}><Text style={s.label}>Ardını göstər ›</Text></Pressable>
    </View> : null}
  </View>;
});
export default LessonViewport;
const s = StyleSheet.create({ root: { flex: 1, minHeight: 0 }, window: { flex: 1, overflow: 'hidden' }, content: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 8, gap: 8 }, navigation: { height: 44, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' }, link: { minHeight: 44, minWidth: 100, justifyContent: 'center' }, label: { fontSize: 12, color: ink.violet }, disabled: { opacity: .3 } });
