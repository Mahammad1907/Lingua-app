import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LessonIcon, ink } from './LessonSurface';

// UI only; the existing recorder/recognizer continues to own native resources.
export default function VoiceCaptureBar({ recording = false, label, busy = false, onMic, onClose, children }: PropsWithChildren<{
  active: boolean; recording?: boolean; level?: number; label: string; busy?: boolean; onMic: () => void; onClose?: () => void;
}>) {
  return <View testID="compact-voice-bar" style={s.box}>
    <View style={s.row}>
      <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: busy }} disabled={busy} onPress={onMic} style={[s.mic, recording && s.live]}><LessonIcon name={recording ? 'pause' : 'mic'} size={25} color={recording ? ink.orange : ink.violet} /></Pressable>
      <View style={s.wave}><Text accessibilityLiveRegion="polite" style={s.label}>{label}</Text></View>
      {onClose ? <Pressable accessibilityRole="button" accessibilityLabel="Səsli paneli bağla" onPress={onClose} style={s.close}><Text style={s.cross}>×</Text></Pressable> : null}
    </View>
    {children}
  </View>;
}
export const compactVoiceStyle = StyleSheet.create({ link: { color: '#C8B3FF', fontSize: 14, lineHeight: 21, fontWeight: '600', minHeight: 44, paddingVertical: 10, textAlign: 'center' }, note: { color: ink.muted, fontSize: 13, lineHeight: 19 }, actions: { flexDirection: 'row', gap: 8 }, action: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#29233F', paddingHorizontal: 8 }, actionText: { color: '#C8B3FF', fontSize: 14, lineHeight: 21, fontWeight: '600' }, error: { color: '#FFB2A2', fontSize: 13, lineHeight: 19 } });
const s = StyleSheet.create({ box: { padding: 10, gap: 5, borderWidth: 1, borderColor: '#75609E', borderRadius: 20, backgroundColor: '#14162E' }, row: { flexDirection: 'row', alignItems: 'center', gap: 9 }, mic: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#A48BE8', backgroundColor: '#2B244A' }, live: { borderColor: ink.orange, backgroundColor: '#352632' }, wave: { flex: 1, minWidth: 0 }, label: { color: '#C8B3FF', fontSize: 14, lineHeight: 21, fontWeight: '600', textAlign: 'center' }, close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, cross: { color: ink.text, fontSize: 28, lineHeight: 32 } });
