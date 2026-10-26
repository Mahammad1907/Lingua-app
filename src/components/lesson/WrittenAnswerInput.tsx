import { useState } from 'react';
import { Animated, Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { SpokenAnswer } from '../../utils/speechTurn';
import LessonVoiceInput from './LessonVoiceInput';
import { LessonIcon, ink } from './LessonSurface';
import { useLessonTextMotion, type LessonMotion } from './LessonTextMotion';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

export default function WrittenAnswerInput({ value, onChange, onVoiceFinal, disabled, onBusyChange, onFocus, suspended = false, motionState = 'idle' }: {
  value: string; onChange: (text: string) => void; onVoiceFinal: (answer: SpokenAnswer) => string | null;
  disabled: boolean; onBusyChange: (busy: boolean) => void; onFocus: () => void; suspended?: boolean; motionState?: LessonMotion;
}) {
  const [voice, setVoice] = useState(false);
  const motion = useLessonTextMotion(motionState);
  return <View style={s.container}>
    <Animated.View style={[s.frame, motion.borderStyle('#A297EF')]}><LessonIcon name="keyboard" /><AnimatedInput accessibilityLabel="Cavabını ingiliscə yaz" value={value} editable={!disabled && !voice} onFocus={onFocus} onChangeText={onChange} autoCorrect={false} autoCapitalize="none" multiline style={[s.input, motion.transformStyle, motion.active && { color: motion.color(ink.text) }]} placeholder="Cavabını yaz və ya de" placeholderTextColor={ink.muted} /><Pressable accessibilityRole="button" accessibilityLabel={voice ? 'Yazılı cavaba qayıt' : 'Cavabını mikrofonla de'} disabled={disabled} onPress={() => { Keyboard.dismiss(); setVoice(v => !v); }} style={s.mic}><LessonIcon name={voice ? 'keyboard' : 'mic'} /></Pressable></Animated.View>
    {voice && !disabled ? <LessonVoiceInput autoStart suspended={suspended} onBusyChange={onBusyChange} onFinal={result => { onChange(result.text); return onVoiceFinal(result); }} /> : null}
  </View>;
}
const s = StyleSheet.create({ container: { gap: 10 }, frame: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingLeft: 15, paddingRight: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#A297EF', backgroundColor: '#21213D' }, input: { flex: 1, minHeight: 56, maxHeight: 100, paddingVertical: 13, fontSize: 16, lineHeight: 23, color: ink.text }, mic: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#332B51' } });
