import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { getSpeechEngine } from '../../utils/speechEngine';
import { LessonIcon, ink } from './LessonSurface';

export default function WrittenAnswerInput({ value, onChange, disabled, onBusyChange, onFocus, suspended = false }: { suspended?: boolean; value: string; onChange: (text: string) => void; disabled: boolean; onBusyChange: (busy: boolean) => void; onFocus: () => void }) {
  const [engine] = useState(getSpeechEngine);
  const [recording, setRecording] = useState(false);
  const [note, setNote] = useState('');
  const [network, setNetwork] = useState(false);
  const active = useRef(false), mounted = useRef(true), starting = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suspendedNow = useRef(suspended);
  const input = useRef<TextInput>(null);
  const change = useRef(onChange);
  const busyChanged = useRef(onBusyChange);
  useEffect(() => { change.current = onChange; busyChanged.current = onBusyChange; suspendedNow.current = suspended; }, [onChange, onBusyChange, suspended]);
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  useEffect(() => {
    mounted.current = true;
    const subscriptions = engine ? [
      engine.addListener('result', event => { if (active.current && mounted.current) { const text = event.results[0]?.transcript; if (text) change.current(text); } }),
      engine.addListener('end', () => { if (active.current && mounted.current) { active.current = false; clear(); setRecording(false); busyChanged.current(false); } }),
      engine.addListener('error', () => { if (active.current && mounted.current) { active.current = false; clear(); setRecording(false); busyChanged.current(false); setNote('Səs dəqiq tanınmadı. Yenidən de və ya cavabını yaz.'); } }),
    ] : [];
    const app = AppState.addEventListener('change', state => { if (state !== 'active' && active.current) { active.current = false; clear(); engine?.abort(); setRecording(false); busyChanged.current(false); } });
    return () => { mounted.current = false; clear(); if (active.current) { active.current = false; engine?.abort(); } subscriptions.forEach(s => s.remove()); app.remove(); busyChanged.current(false); };
  }, [engine]);
  useEffect(() => { if (suspended && active.current) { active.current = false; clear(); engine?.abort(); setRecording(false); busyChanged.current(false); } }, [suspended, engine]);
  const toggle = async () => {
    if (disabled || starting.current) return;
    if (!engine) { setNote('Cavabını səsli yazmaq üçün klaviaturanın mikrofonuna toxun. İngilis dilini seç.'); input.current?.focus(); return; }
    if (active.current) { engine.stop(); clear(); timer.current = setTimeout(() => { if (active.current && mounted.current) { active.current = false; engine.abort(); setRecording(false); busyChanged.current(false); setNote('Səs yazısı dayandırıldı. Mətni yoxlaya və düzəldə bilərsən.'); } }, 4000); return; }
    starting.current = true; busyChanged.current(true);
    try {
      await Speech.stop();
      const local = engine.supportsOnDeviceRecognition();
      if (!local && !network) { setNote('Bu telefonda cihazdaxili tanıma yoxdur. İnternetlə tanımaya icazə verə və ya cavabını yaza bilərsən.'); return; }
      const permission = local ? await engine.requestMicrophonePermissionsAsync() : await engine.requestPermissionsAsync();
      if (!mounted.current || suspendedNow.current) return;
      if (!permission.granted) { setNote('Mikrofon icazəsi verilmədi. Telefon ayarlarında icazəni aça bilərsən.'); return; }
      if (!engine.isRecognitionAvailable()) { setNote('Səs tanıma hazır deyil. Cavabını yaza bilərsən.'); return; }
      active.current = true; setRecording(true); setNote('Danış… Bitirəndə mikrofona yenidən toxun.');
      engine.start({ lang: 'en-US', interimResults: true, continuous: false, maxAlternatives: 1, requiresOnDeviceRecognition: !network });
      timer.current = setTimeout(() => { if (active.current) engine.stop(); }, 20000);
    } catch { if (mounted.current) { active.current = false; setRecording(false); setNote('Mikrofon açıla bilmədi. Yenidən cəhd et və ya cavabını yaz.'); } }
    finally { starting.current = false; if (!active.current) busyChanged.current(false); }
  };
  return <View style={s.container}><View style={s.frame}><LessonIcon name="keyboard" /><TextInput ref={input} accessibilityLabel="Cavabını ingiliscə yaz və ya de" value={value} editable={!disabled && !recording} onFocus={onFocus} onChangeText={onChange} autoCorrect={false} autoCapitalize="none" multiline style={s.input} placeholder="Cavabını yaz və ya de" placeholderTextColor={ink.muted} /><Pressable accessibilityRole="button" accessibilityLabel={recording ? 'Danışığı bitir' : 'Cavabını mikrofonla de'} disabled={disabled} onPress={() => void toggle()} style={[s.mic, recording && s.active]}><LessonIcon name="mic" color={recording ? ink.orange : ink.violet} /></Pressable></View>
    {note ? <Text accessibilityLiveRegion="polite" style={s.note}>{note}</Text> : null}
    {engine && note && !recording ? <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: network }} onPress={() => setNetwork(v => !v)}><Text style={s.note}>{network ? '☑' : '□'} İnternetlə tanıma · səs Apple/Google-a göndərilə bilər</Text></Pressable> : null}
  </View>;
}
const s = StyleSheet.create({ container: { gap: 6 }, frame: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingLeft: 15, paddingRight: 7, borderRadius: 21, borderWidth: 1.5, borderColor: '#A297EF', backgroundColor: '#21213D', shadowColor: '#9C85FF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .18, shadowRadius: 13 }, input: { flex: 1, minHeight: 62, maxHeight: 112, paddingVertical: 15, fontSize: 16, lineHeight: 23, color: ink.text }, mic: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#332B51' }, active: { backgroundColor: '#49302D' }, note: { color: ink.muted, fontSize: 11, lineHeight: 17, paddingHorizontal: 4 } });
