import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLessonSpeech } from '../../hooks/useLessonSpeech';
import type { SpokenAnswer, UnverifiedRecording } from '../../utils/speechTurn';
import { safelyReadRecorder, safelyStopRecorder } from '../../utils/recordedAudio';
import { LessonIcon, ink } from './ApprovedLessonSurface';
import ParticleWave from './ParticleWave';

function Mic({ label, active, pending, onStart, onRelease, onCancel, level = 0 }: { label: string; active: boolean; pending: boolean; onStart: () => void; onRelease: () => void; onCancel: () => void; level?: number }) {
  return <View style={s.body}>
    <Pressable accessibilityRole="button" accessibilityLabel="Basılı saxla və danış" accessibilityHint="Buraxanda cavabın yoxlanacaq" onPressIn={onStart} onPressOut={onRelease} onAccessibilityAction={e => e.nativeEvent.actionName === 'activate' && (active ? onRelease() : onStart())} accessibilityActions={[{ name: 'activate', label: active ? 'Danışığı bitir' : 'Danışığa başla' }]} style={[s.mic, active && s.live]}><LessonIcon name="mic" size={36} color="#FFF" /></Pressable>
    <Text accessibilityLiveRegion="polite" style={s.label}>{label}</Text>
    <Text style={s.note}>{active ? 'Buraxanda cavabın göndəriləcək.' : pending ? 'Bir az gözlə…' : 'Basılı saxla, danış və burax.'}</Text>
    <ParticleWave active={active && level > .04} level={level} height={35} />
    {active || pending ? <Pressable accessibilityRole="button" onPress={onCancel} style={s.cancel}><Text style={s.link}>Ləğv et</Text></Pressable> : null}
  </View>;
}
export default function HoldVoiceInput({ onFinal, onUnverifiedRecording, onBusyChange, suspended }: { onFinal: (answer: SpokenAnswer) => string | null; onUnverifiedRecording: (recording: UnverifiedRecording) => void; onBusyChange: (busy: boolean) => void; suspended: boolean }) {
  const speech = useLessonSpeech({ onFinal, onBusyChange, suspended, autoSubmit: true, holdToSpeak: true });
  if (!speech.available) return <RawHoldRecorder onRecorded={onUnverifiedRecording} onBusyChange={onBusyChange} suspended={suspended} />;
  const pending = speech.phase === 'processing' || speech.phase === 'preparing';
  return <View style={{ gap: 8 }}><Mic active={speech.phase === 'listening'} pending={pending} level={speech.level} label={speech.phase === 'listening' ? 'Səsin yazılır…' : pending ? 'Cavabın yoxlanılır…' : 'Basılı saxla və danış'} onStart={() => { if (!speech.busy && !suspended) void speech.start(); }} onRelease={speech.stop} onCancel={speech.cancel} />{speech.message ? <Text accessibilityLiveRegion="polite" style={s.note}>{speech.message}</Text> : null}</View>;
}
function RawHoldRecorder({ onRecorded, onBusyChange, suspended }: { onRecorded: (recording: UnverifiedRecording) => void; onBusyChange: (busy: boolean) => void; suspended: boolean }) {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const [phase, setPhase] = useState<'idle' | 'preparing' | 'recording' | 'processing'>('idle'), [level, setLevel] = useState(0), [message, setMessage] = useState('');
  const held = useRef(false), alive = useRef(true), generation = useRef(0), heard = useRef(false), starting = useRef(false), recording = useRef(false), stopping = useRef(false), suspendedNow = useRef(suspended), delivery = useRef(onRecorded);
  useEffect(() => { suspendedNow.current = suspended; delivery.current = onRecorded; }, [suspended, onRecorded]);
  const cancel = useCallback(() => { held.current = false; generation.current++; heard.current = false; if (recording.current) { recording.current = false; safelyStopRecorder(recorder); } setPhase('idle'); setLevel(0); void setAudioModeAsync({ allowsRecording: false }).catch(() => {}); }, [recorder]);
  useEffect(() => { onBusyChange(phase !== 'idle'); }, [phase, onBusyChange]);
  useEffect(() => { alive.current = true; const generationToken = generation; const sub = AppState.addEventListener('change', state => { if (state !== 'active') cancel(); }); return () => { alive.current = false; held.current = false; generationToken.current++; safelyStopRecorder(recorder); sub.remove(); onBusyChange(false); void setAudioModeAsync({ allowsRecording: false }).catch(() => {}); }; }, [recorder, cancel, onBusyChange]);
  useEffect(() => { if (!suspended) return; const timer = setTimeout(cancel, 0); return () => clearTimeout(timer); }, [suspended, cancel]);
  useEffect(() => { if (phase !== 'recording') return; const poll = setInterval(() => { const status = safelyReadRecorder(() => recorder.getStatus()); if (status?.isRecording && typeof status.metering === 'number') { heard.current ||= status.metering > -42; setLevel(Math.max(0, Math.min(1, (status.metering + 55) / 55))); } }, 100); const limit = setTimeout(() => { cancel(); setMessage('Qeyd dayandırıldı. Daha qısa cavabla yenidən cəhd et.'); }, 20000); return () => { clearInterval(poll); clearTimeout(limit); }; }, [phase, recorder, cancel]);
  const start = async () => {
    if (starting.current || recording.current || stopping.current || suspendedNow.current) return;
    held.current = true; heard.current = false; starting.current = true; const request = ++generation.current; setPhase('preparing'); setMessage('');
    const valid = () => alive.current && held.current && request === generation.current && !suspendedNow.current && AppState.currentState === 'active';
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!valid()) return;
      if (!permission.granted) { setMessage('Mikrofon icazəsi verilmədi. Telefon ayarlarında icazəni aç.'); return; }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      if (!valid()) return;
      await recorder.prepareToRecordAsync();
      if (!valid()) return;
      recorder.record(); recording.current = true; setPhase('recording');
    } catch { if (alive.current) setMessage('Mikrofon açılmadı. Yenidən cəhd et.'); }
    finally { starting.current = false; if (!recording.current) { void setAudioModeAsync({ allowsRecording: false }).catch(() => {}); if (alive.current) setPhase('idle'); } }
  };
  const release = async () => {
    held.current = false;
    if (starting.current) { generation.current++; return; }
    if (!recording.current || stopping.current) return;
    stopping.current = true; recording.current = false; const request = generation.current; setPhase('processing');
    const sample = safelyReadRecorder(() => recorder.getStatus()); if (sample?.metering !== undefined && sample.metering > -42) heard.current = true;
    const duration = recorder.currentTime;
    try {
      await recorder.stop(); await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (!alive.current || request !== generation.current || suspendedNow.current || AppState.currentState !== 'active') return;
      if (!heard.current || duration < .3 || !recorder.uri) { setMessage('Səs tanınmadı. Yenidən cəhd et; bu, səhv sayılmır.'); return; }
      delivery.current({ uri: recorder.uri, duration, token: `held:${request}` });
      setMessage('Səsin yazıldı, amma danışıq yoxlanmadı.');
    } catch { if (alive.current) setMessage('Səs yazılmadı. Yenidən cəhd et.'); }
    finally { stopping.current = false; if (alive.current) { setPhase('idle'); setLevel(0); } }
  };
  return <View style={{ gap: 8 }}><Mic active={phase === 'recording'} pending={phase === 'preparing' || phase === 'processing'} label={phase === 'recording' ? 'Səsin yazılır…' : phase === 'idle' ? 'Basılı saxla və danış' : 'Hazırlanır…'} level={level} onStart={() => void start()} onRelease={() => void release()} onCancel={cancel} />{message ? <Text accessibilityLiveRegion="polite" style={s.note}>{message}</Text> : null}</View>;
}
const s = StyleSheet.create({ body: { alignItems: 'center', gap: 6 }, mic: { width: 82, height: 82, borderRadius: 41, backgroundColor: ink.violet, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#DBBDF5' }, live: { backgroundColor: '#A746DB', borderColor: ink.orange }, label: { fontSize: 19, fontWeight: '800', lineHeight: 26, color: ink.text, textAlign: 'center' }, note: { color: ink.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' }, cancel: { minHeight: 44, paddingHorizontal: 16, justifyContent: 'center' }, link: { color: ink.violet, fontWeight: '600' } });
