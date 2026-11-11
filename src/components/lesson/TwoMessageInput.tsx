import { Image, Text, TextInput, View, StyleSheet, type ImageSourcePropType } from 'react-native';
import { ink } from './ApprovedLessonSurface';
export interface MessageField { id: string; label: string; placeholder: string }
/** Content supplies fields and scenes; no greetings or answers are invented here. */
export default function TwoMessageInput({ fields, values, onChange, disabled, scenes = [] }: { fields: readonly MessageField[]; values: Record<string, string>; onChange: (id: string, value: string) => void; disabled: boolean; scenes?: ImageSourcePropType[] }) {
  return <View style={s.box}>
    {scenes.length ? <View style={s.scenes}>{scenes.slice(0, 2).map((source, index) => <Image key={index} source={source} resizeMode="cover" style={s.scene} accessibilityLabel={fields[index]?.label} />)}</View> : null}
    {fields.map(field => <View key={field.id} style={s.box}><Text style={s.label}>{field.label}</Text><TextInput accessibilityLabel={field.label} placeholder={field.placeholder} placeholderTextColor={ink.muted} value={values[field.id] || ''} onChangeText={v => onChange(field.id, v)} editable={!disabled} autoCorrect={false} style={s.input} /></View>)}
  </View>;
}
const s = StyleSheet.create({ box: { gap: 9 }, scenes: { flexDirection: 'row', gap: 10 }, scene: { flex: 1, height: 110, borderRadius: 18 }, label: { color: ink.text, fontSize: 16, fontWeight: '700' }, input: { minHeight: 54, borderRadius: 18, borderWidth: 1, borderColor: ink.border, paddingHorizontal: 14, color: ink.text, fontSize: 16, backgroundColor: ink.card } });
