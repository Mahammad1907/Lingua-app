import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLessonSpeech } from '../../hooks/useLessonSpeech';
import type { SpokenAnswer } from '../../utils/speechTurn';
import ParticleWave from './ParticleWave';
import { LessonIcon, ink } from './LessonSurface';

export default function LessonVoiceInput({ onFinal, onBusyChange, suspended, disabled = false, autoStart = false }: {
  onFinal: (answer: SpokenAnswer) => string | null; onBusyChange: (busy: boolean) => void; suspended?: boolean; disabled?: boolean; autoStart?: boolean;
}) {
  const speech = useLessonSpeech({ onFinal, onBusyChange, suspended, autoStart });
  const listening = speech.phase === 'listening';
  return <View style={s.input}>
    {speech.busy ? <ParticleWave active={listening} level={speech.level} height={72} /> : null}
    <View style={s.row}><Pressable accessibilityRole="button" accessibilityLabel={listening ? 'Danışığı bitir' : 'Səsli cavab ver'} accessibilityState={{ disabled: disabled || speech.phase === 'processing' || speech.phase === 'preparing' }} disabled={disabled || speech.phase === 'processing' || speech.phase === 'preparing'} onPress={() => listening ? speech.stop() : void speech.start()} style={[s.mic, listening && s.live]}><LessonIcon name={speech.phase === 'processing' ? 'check' : 'mic'} color={listening ? ink.orange : ink.violet} size={25} /></Pressable><View style={s.flex}><Text accessibilityLiveRegion="polite" style={s.label}>{listening ? 'Səni dinləyirəm…' : speech.phase === 'processing' ? 'Cavab yoxlanır…' : speech.phase === 'preparing' ? 'Mikrofon açılır…' : 'Danışmaq üçün toxun'}</Text><Text style={s.note}>{listening ? 'Bitirəndə cavabın avtomatik yoxlanacaq.' : 'Cavabını ingiliscə de.'}</Text></View>{speech.busy ? <Pressable accessibilityRole="button" accessibilityLabel="Səsli cavabı ləğv et" onPress={speech.cancel} style={s.cancel}><Text style={s.cancelText}>×</Text></Pressable> : null}</View>
    {speech.partial ? <Text style={s.transcript}>{speech.partial}</Text> : null}
    {speech.message ? <Text accessibilityLiveRegion="polite" style={s.note}>{speech.message}</Text> : null}
    {speech.needsNetwork && !speech.busy ? <Pressable accessibilityRole="button" disabled={disabled} onPress={() => void speech.start(true)}><Text style={s.link}>İnternetlə tanımaya icazə ver və başla</Text><Text style={s.note}>Səs Apple/Google xidmətində emal oluna bilər.</Text></Pressable> : null}
  </View>;
}
const s = StyleSheet.create({ input: { gap: 8, borderWidth: 1, borderColor: '#605086', borderRadius: 22, padding: 14, backgroundColor: '#13182E' }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, flex: { flex: 1 }, mic: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#2D2449', borderWidth: 1, borderColor: '#8E74CF', alignItems: 'center', justifyContent: 'center' }, live: { backgroundColor: '#392A35', borderColor: ink.orange }, label: { fontSize: 15, lineHeight: 21, color: ink.text, fontWeight: '700' }, note: { color: ink.muted, fontSize: 11, lineHeight: 16 }, transcript: { color: ink.text, fontSize: 16, lineHeight: 22, paddingVertical: 4 }, cancel: { padding: 8 }, cancelText: { color: ink.muted, fontSize: 26 }, link: { color: ink.violet, paddingVertical: 8, fontSize: 12, lineHeight: 18 } });
