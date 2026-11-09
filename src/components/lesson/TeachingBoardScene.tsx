import type { PropsWithChildren, ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Reuse the actual approved mascot. Text and controls are never part of a bitmap.
export default function TeachingBoardScene({ children, art }: PropsWithChildren<{ art?: ReactNode }>) {
  return <View testID="teaching-board-scene" style={s.scene}>
    {art ? <View style={s.teacher}>{art}</View> : <Image source={require('../../../assets/onboarding/welcome.png')} accessible={false} resizeMode="contain" style={s.teacher} />}
    <View style={s.boardWrap}><LinearGradient colors={['#FDF8FF', '#EAD8F9']} style={s.board}>{children}</LinearGradient><View style={s.feet}><View style={s.foot} /><View style={s.foot} /></View></View>
  </View>;
}
const s = StyleSheet.create({
  scene: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
  teacher: { width: '29%', height: 136 }, boardWrap: { flex: 1, paddingBottom: 10 },
  board: { minHeight: 108, borderWidth: 4, borderColor: '#B47ADE', borderRadius: 17, padding: 12, justifyContent: 'center', gap: 7, shadowColor: '#8B51B2', shadowOpacity: .13, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  feet: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 23 }, foot: { height: 9, width: 9, backgroundColor: '#B47ADE', borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
});
