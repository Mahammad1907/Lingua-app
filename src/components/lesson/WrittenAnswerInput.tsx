import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { AppState, Keyboard, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { getSpeechEngine } from '../../utils/speechEngine';
import VoicePracticeRecorder from './VoicePracticeRecorder';
import { InputLevelWave, LessonButton, LessonIcon, ink } from './LessonSurface';

export default function WrittenAnswerInput({ value, onChange, disabled, onBusyChange, onFocus, suspended = false }: { suspended?: boolean; value: string; onChange: (text: string) => void; disabled: boolean; onBusyChange: (busy: boolean) => void; onFocus: () => void }) {
  const [engine] = useState(getSpeechEngine);
  const [recording, setRecording] = useState(false);
  const [note, setNote] = useState('');
  const [network, setNetwork] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [levels, setLevels] = useState<number[]>([]);
  const active = useRef(false), mounted = useRef(true), starting = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suspendedNow = useRef(suspended);
  const input = useRef<TextInput>(null);
  const captureSession = useRef(0);
  const change = useRef(onChange);
  const busyChanged = useRef(onBusyChange);
  useEffect(() => { change.current = onChange; busyChanged.current = onBusyChange; suspendedNow.current = suspended; }, [onChange, onBusyChange, suspended]);
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  useEffect(() => {
    mounted.current = true;
    const subscriptions = engine ? [
      engine.addListener('volumechange', event => { if (active.current && mounted.current) setLevels(v => [...v.slice(-24), Math.min(1, Math.max(0, event.value / 10))]); }),
      engine.addListener('result', event => { if (active.current && mounted.current) { const text = event.results[0]?.transcript; if (text) change.current(text); } }),
      engine.addListener('end', () => { if (active.current && mounted.current) { active.current = false; clear(); setRecording(false); busyChanged.current(false); setNote('Mətni yoxla. İstəsən düzəldə bilərsən.'); } }),
      engine.addListener('error', () => { if (active.current && mounted.current) { active.current = false; clear(); setRecording(false); busyChanged.current(false); setNote('Səs dəqiq tanınmadı. Yenidən de və ya cavabını yaz.'); } }),
    ] : [];
    const app = AppState.addEventListener('change', state => { if (state !== 'active' && active.current) { active.current = false; clear(); engine?.abort(); setRecording(false); busyChanged.current(false); } });
    return () => { mounted.current = false; clear(); if (active.current) { active.current = false; engine?.abort(); } subscriptions.forEach(s => s.remove()); app.remove(); busyChanged.current(false); };
  }, [engine]);
  useEffect(() => { if (suspended && active.current) { active.current = false; clear(); engine?.abort(); setRecording(false); busyChanged.current(false); } }, [suspended, engine]);
  const toggle = async () => {
    if (disabled || starting.current) return;
    if (!engine) return;
    if (active.current) { engine.stop(); clear(); timer.current = setTimeout(() => { if (active.current && mounted.current) { active.current = false; engine.abort(); setRecording(false); busyChanged.current(false); setNote('Səs yazısı dayandırıldı. Mətni yoxlaya və düzəldə bilərsən.'); } }, 4000); return; }
    const session = captureSession.current;
    starting.current = true; busyChanged.current(true);
    try {
      await Speech.stop();
      if (session !== captureSession.current || !mounted.current) return;
      const local = engine.supportsOnDeviceRecognition();
      if (!local && !network) { setNote('Bu telefonda cihazdaxili tanıma yoxdur. İnternetlə tanımaya icazə verə və ya cavabını yaza bilərsən.'); return; }
      const permission = local ? await engine.requestMicrophonePermissionsAsync() : await engine.requestPermissionsAsync();
      if (!mounted.current || suspendedNow.current || session !== captureSession.current) return;
      if (!permission.granted) { setNote('Mikrofon icazəsi verilmədi. Telefon ayarlarında icazəni aça bilərsən.'); return; }
      if (!engine.isRecognitionAvailable()) { setNote('Səs tanıma hazır deyil. Cavabını yaza bilərsən.'); return; }
      active.current = true; setLevels([]); setRecording(true); setNote('Danış… Bitirəndə mikrofona yenidən toxun.');
      engine.start({ lang: 'en-US', interimResults: true, continuous: false, maxAlternatives: 1, requiresOnDeviceRecognition: !network, volumeChangeEventOptions: { enabled: true, intervalMillis: 120 } });
      timer.current = setTimeout(() => { if (active.current) engine.stop(); }, 20000);
    } catch { if (mounted.current) { active.current = false; setRecording(false); setNote('Mikrofon açıla bilmədi. Yenidən cəhd et və ya cavabını yaz.'); } }
    finally { starting.current = false; if (!active.current) busyChanged.current(false); }
  };
  const closeCapture = () => {
    captureSession.current += 1;
    if (active.current) { active.current = false; clear(); engine?.abort(); setRecording(false); }
    busyChanged.current(false); setCaptureOpen(false);
  };
  const openCapture = () => { captureSession.current += 1; Keyboard.dismiss(); setCaptureOpen(true); if (engine) void toggle(); };
  return <View style={s.container}><View style={s.frame}><LessonIcon name="keyboard" /><TextInput ref={input} accessibilityLabel="Cavabını ingiliscə yaz və ya de" value={value} editable={!disabled && !recording} onFocus={onFocus} onChangeText={onChange} autoCorrect={false} autoCapitalize="none" multiline style={s.input} placeholder="Cavabını yaz və ya de" placeholderTextColor={ink.muted} /><Pressable accessibilityRole="button" accessibilityLabel={recording ? 'Danışığı bitir' : 'Cavabını mikrofonla de'} disabled={disabled} onPress={openCapture} style={[s.mic, recording && s.active]}><LessonIcon name="mic" color={recording ? ink.orange : ink.violet} /></Pressable></View>
    {captureOpen ? <Modal transparent visible animationType="fade" onRequestClose={closeCapture}>
      <View style={s.scrim}><View accessibilityViewIsModal style={s.capture}>
        <View style={s.captureHeader}><Text accessibilityRole="header" style={s.captureTitle}>Səsli cavab</Text><Pressable accessibilityRole="button" accessibilityLabel="Səs pəncərəsini bağla" onPress={closeCapture} style={s.close}><Text style={s.closeText}>×</Text></Pressable></View>
        {engine ? <>
          <InputLevelWave levels={recording ? levels : []} active={recording} />
          <Text accessibilityLiveRegion="polite" style={s.status}>{recording ? 'Səni dinləyirəm…' : note || 'Danışmağa hazırsan?'}</Text>
          {value ? <View style={s.transcript}><Text style={s.note}>Cavabın</Text><Text numberOfLines={4} style={s.transcriptText}>{value}</Text></View> : null}
          <LessonButton label={recording ? 'Danışığı bitir' : 'Yenidən danış'} onPress={() => void toggle()} />
          {!recording ? <><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: network }} onPress={() => setNetwork(v => !v)}><Text style={s.note}>{network ? '☑' : '□'} İnternetlə tanıma · səs Apple/Google-a göndərilə bilər</Text></Pressable><Pressable accessibilityRole="button" style={s.backToAnswer} onPress={closeCapture}><Text style={s.backText}>Cavaba qayıt</Text></Pressable></> : null}
        </> : <VoicePracticeRecorder autoStart compact onBusyChange={onBusyChange} onContinue={closeCapture} continueLabel="Cavabı yazmaq üçün qayıt" />}
      </View></View>
    </Modal> : null}
  </View>;
}
const s = StyleSheet.create({ scrim: { flex: 1, justifyContent: 'center', padding: 22, backgroundColor: '#040716E8' }, capture: { width: '100%', maxWidth: 420, alignSelf: 'center', padding: 20, gap: 15, borderRadius: 27, borderWidth: 1, borderColor: '#7964B6', backgroundColor: '#14172F' }, captureHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, captureTitle: { color: ink.text, fontSize: 21, fontWeight: '800' }, close: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2A2343' }, closeText: { color: ink.violet, fontSize: 29 }, status: { color: ink.violet, fontSize: 15, lineHeight: 22, textAlign: 'center' }, transcript: { padding: 14, borderRadius: 16, backgroundColor: '#23223F', gap: 6 }, transcriptText: { color: ink.text, fontSize: 17, lineHeight: 24 }, backToAnswer: { padding: 13, alignItems: 'center' }, backText: { color: ink.violet, fontSize: 14, fontWeight: '700' }, container: { gap: 6 }, frame: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingLeft: 15, paddingRight: 7, borderRadius: 21, borderWidth: 1.5, borderColor: '#A297EF', backgroundColor: '#21213D', shadowColor: '#9C85FF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .18, shadowRadius: 13 }, input: { flex: 1, minHeight: 62, maxHeight: 112, paddingVertical: 15, fontSize: 16, lineHeight: 23, color: ink.text }, mic: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#332B51' }, active: { backgroundColor: '#49302D' }, note: { color: ink.muted, fontSize: 11, lineHeight: 17, paddingHorizontal: 4 } });
