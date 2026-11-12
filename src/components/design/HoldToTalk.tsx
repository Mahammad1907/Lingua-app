import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLessonSpeech } from '../../hooks/useLessonSpeech';
import { safelyReadRecorder, safelyStopRecorder } from '../../utils/recordedAudio';
import type { SpokenAnswer, UnverifiedRecording } from '../../utils/speechTurn';
import Icon from './Icons';
import { Waveform } from './parts';
import { d, shadow } from './theme';

/**
 * Press and hold to talk; releasing sends the answer once.
 * With native speech recognition only a final transcript is delivered (never a partial).
 * Without it (e.g. Expo Go) a real recording is delivered as unverified — it is never graded.
 */
export default function HoldToTalk({ onFinal, onRecording, onBusyChange, disabled, suspended }: {
  onFinal: (answer: SpokenAnswer) => string | null;
  onRecording: (recording: UnverifiedRecording) => void;
  onBusyChange: (busy: boolean) => void;
  disabled?: boolean; suspended?: boolean;
}) {
  const speech = useLessonSpeech({ onFinal, onBusyChange, suspended, autoSubmit: true });
  return speech.available
    ? <NativeHold speech={speech} disabled={disabled} />
    : <RecorderHold onRecording={onRecording} onBusyChange={onBusyChange} disabled={disabled} suspended={suspended} />;
}

type SpeechApi = ReturnType<typeof useLessonSpeech>;

function NativeHold({ speech, disabled }: { speech: SpeechApi; disabled?: boolean }) {
  const held = useRef(false);
  const listening = speech.phase === 'listening';
  const pending = speech.phase === 'preparing' || speech.phase === 'processing';
  // Released before the microphone actually opened: stop as soon as it does.
  useEffect(() => { if (listening && !held.current) speech.stop(); }, [listening, speech]);
  const status = listening ? 'Səsin yazılır… Buraxanda göndəriləcək.' : speech.phase === 'processing' ? 'Yoxlanılır…' : speech.phase === 'preparing' ? 'Hazırlanır…' : '';
  return <MicView active={listening} level={listening ? speech.level : 0} disabled={disabled || speech.phase === 'processing'} status={status} message={pending ? '' : speech.message}
    onIn={() => { held.current = true; if (speech.phase === 'idle') void speech.start(); }}
    onOut={() => { held.current = false; if (speech.phase === 'listening') speech.stop(); }} />;
}

function RecorderHold({ onRecording, onBusyChange, disabled, suspended }: { onRecording: (r: UnverifiedRecording) => void; onBusyChange: (b: boolean) => void; disabled?: boolean; suspended?: boolean }) {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const [recording, setRecording] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const held = useRef(false), serial = useRef(0), mounted = useRef(true);
  useEffect(() => { onBusyChange(busy || recording); }, [busy, recording, onBusyChange]);
  const stop = useCallback(async (send: boolean) => {
    if (!safelyReadRecorder(() => recorder.isRecording)) return;
    setBusy(true);
    try {
      const duration = recorder.currentTime; await recorder.stop(); await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (!mounted.current) return;
      setRecording(false);
      if (send && recorder.uri && duration >= .4 && AppState.currentState === 'active') onRecording({ uri: recorder.uri, duration, token: `hold:${++serial.current}` });
      else if (send) setMessage('Yazı çox qısa oldu. Mikrofonu basılı saxlayıb danış.');
    } catch { if (mounted.current) setMessage('Səs yazılmadı. Yenidən cəhd et.'); }
    finally { if (mounted.current) setBusy(false); }
  }, [recorder, onRecording]);
  const start = useCallback(async () => {
    if (busy || recording) return;
    setBusy(true); setMessage('');
    try {
      await Speech.stop();
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) { setMessage('Mikrofon icazəsi verilmədi. Telefon ayarlarında icazəni aç.'); return; }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true }); await recorder.prepareToRecordAsync();
      if (!held.current || !mounted.current) { await setAudioModeAsync({ allowsRecording: false }); return; }
      recorder.record(); setRecording(true);
    } catch { setMessage('Mikrofon açıla bilmədi. Yenidən cəhd et.'); await setAudioModeAsync({ allowsRecording: false }).catch(() => {}); }
    finally { if (mounted.current) setBusy(false); }
  }, [busy, recording, recorder]);
  useEffect(() => { if (suspended) void stop(false); }, [suspended, stop]);
  useEffect(() => {
    mounted.current = true;
    const app = AppState.addEventListener('change', state => { if (state !== 'active') void stop(false); });
    return () => { mounted.current = false; app.remove(); safelyStopRecorder(recorder); void setAudioModeAsync({ allowsRecording: false }).catch(() => {}); onBusyChange(false); };
  }, [recorder, stop, onBusyChange]);
  return <MicView active={recording} level={0} disabled={disabled} status={recording ? 'Səsin yazılır… Buraxanda göndəriləcək.' : busy ? 'Hazırlanır…' : ''} message={message}
    onIn={() => { held.current = true; void start(); }} onOut={() => { held.current = false; void stop(true); }} />;
}

function MicView({ active, level, disabled, status, message, onIn, onOut }: { active: boolean; level: number; disabled?: boolean; status: string; message?: string; onIn: () => void; onOut: () => void }) {
  return <View style={s.wrap}>
    <View style={[s.halo, active && s.haloActive]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Mikrofon. Basılı saxla və danış, buraxanda cavabın göndəriləcək." accessibilityState={{ disabled, busy: active }}
        disabled={disabled} onPressIn={onIn} onPressOut={onOut} style={[s.mic, active && s.micActive, disabled && { opacity: .5 }]}>
        <Icon name="mic" size={46} color="#fff" stroke={2.2} />
      </Pressable>
    </View>
    <Text style={s.title}>Basılı saxla və danış</Text>
    <Text accessibilityLiveRegion="polite" style={s.sub}>{status || 'Buraxanda cavabın göndəriləcək.'}</Text>
    <View style={{ height: 26, opacity: active ? 1 : .45 }}><Waveform active={active && level > .04 || active} height={24} /></View>
    {message ? <Text accessibilityLiveRegion="polite" style={s.message}>{message}</Text> : null}
  </View>;
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
  halo: { width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(142,99,232,.12)', alignItems: 'center', justifyContent: 'center' },
  haloActive: { backgroundColor: 'rgba(242,122,18,.18)' },
  mic: { width: 112, height: 112, borderRadius: 56, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center', ...shadow, shadowOpacity: .3 },
  micActive: { backgroundColor: '#7B2FE0', transform: [{ scale: 1.04 }] },
  title: { color: d.ink, fontSize: 22, fontWeight: '800', marginTop: 4 },
  sub: { color: d.lavender, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  message: { color: d.inkSoft, fontSize: 14, lineHeight: 20, textAlign: 'center', paddingHorizontal: 12 },
});
