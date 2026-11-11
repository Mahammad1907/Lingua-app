import { Text, TextInput, View, StyleSheet, type ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { ink } from './ApprovedLessonSurface';
export interface MessageField { id: string; label: string; placeholder: string }
/** Content supplies fields and scenes; no greetings or answers are invented here. */
export default function TwoMessageInput({ fields, values, onChange, disabled, scenes = [], retained = {}, results = {} }: { fields: readonly MessageField[]; values: Record<string, string>; onChange: (id: string, value: string) => void; disabled: boolean; scenes?: ImageSourcePropType[]; retained?: Record<string, string>; results?: Record<string, { verdict: { status: string } }> }) {
  return <View style={s.box}>
    {scenes.length ? <View style={s.scenes}>{scenes.slice(0, 2).map((source, index) => <Image key={index} source={source} contentFit="contain" style={s.scene} accessibilityLabel={`Səhnə: ${fields[index]?.label}`} />)}</View> : null}
    {fields.map(field => <View key={field.id} style={s.box}><Text style={s.label}>{field.label}{retained[field.id] ? ' · ✓ Saxlanılıb' : results[field.id]?.verdict.status === 'correct' ? ' · ✓ Düzgündür' : results[field.id] ? ' · ! Bir daha bax' : ''}</Text><TextInput accessibilityLabel={field.label} placeholder={field.placeholder} placeholderTextColor={ink.muted} value={values[field.id] || ''} onChangeText={v => onChange(field.id, v)} editable={!disabled && !retained[field.id]} autoCorrect={false} style={[s.input, results[field.id] && { borderColor: results[field.id].verdict.status === 'correct' ? ink.mint : ink.error }]} /></View>)}
  </View>;
}
const s = StyleSheet.create({ box: { gap: 9 }, scenes: { flexDirection: 'row', gap: 10 }, scene: { flex: 1, height: 110, borderRadius: 18, backgroundColor: '#E9DEF6' }, label: { color: ink.text, fontSize: 16, fontWeight: '700' }, input: { minHeight: 54, borderRadius: 18, borderWidth: 1, borderColor: ink.border, paddingHorizontal: 14, color: ink.text, fontSize: 16, backgroundColor: ink.card } });
