import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLessonSpeech } from '../../hooks/useLessonSpeech';
import { safelyReadRecorder, safelyStopRecorder } from '../../utils/recordedAudio';
import type { SpokenAnswer, UnverifiedRecording } from '../../utils/speechTurn';
import Icon from './Icons';
import { Waveform } from './parts';
import { d, shadow, font } from './theme';

/**
 * Press and hold to talk; releasing sends the answer once. A short tap starts, a second tap finishes.
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
  const [network, setNetwork] = useState(false);
  const listening = speech.phase === 'listening';
  const pending = speech.phase === 'preparing' || speech.phase === 'processing';
  // Released before the microphone actually opened: stop as soon as it does.
  useEffect(() => { if (listening && !held.current) speech.stop(); }, [listening, speech]);
  const status = listening ? 'Səsin yazılır… Buraxanda göndəriləcək.' : speech.phase === 'processing' ? 'Yoxlanılır…' : speech.phase === 'preparing' ? 'Hazırlanır…' : '';
  return <View style={{ gap: 8, alignItems: 'center' }}>
    <MicView active={listening} level={listening ? speech.level : 0} disabled={disabled || speech.phase === 'processing'} status={status} message={pending ? '' : speech.message}
      onIn={() => {
        held.current = true;
        // A stale review/processing state (e.g. after backgrounding) must never leave the mic dead.
        if (speech.phase === 'review') speech.cancel();
        if (speech.phase === 'idle' || speech.phase === 'review') void speech.start(network);
      }}
      onOut={() => { held.current = false; if (speech.phase === 'listening') speech.stop(); }} />
    {speech.needsNetwork && !network ? <Pressable accessibilityRole="button" onPress={() => setNetwork(true)} style={s.netBtn}>
      <Text style={s.netText}>İnternet ilə səs tanımaya icazə ver</Text>
    </Pressable> : null}
  </View>;
}

function RecorderHold({ onRecording, onBusyChange, disabled, suspended }: { onRecording: (r: UnverifiedRecording) => void; onBusyChange: (b: boolean) => void; disabled?: boolean; suspended?: boolean }) {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const [recording, setRecording] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const held = useRef(false), serial = useRef(0), mounted = useRef(true);
  // Parent callbacks change every render; keep them in refs so recording is never torn down by a re-render.
  const deliver = useRef(onRecording), busyChange = useRef(onBusyChange);
  useEffect(() => { deliver.current = onRecording; busyChange.current = onBusyChange; }, [onRecording, onBusyChange]);
  useEffect(() => { busyChange.current(busy || recording); }, [busy, recording]);
  const stop = useCallback(async (send: boolean) => {
    if (!safelyReadRecorder(() => recorder.isRecording)) return;
    setBusy(true);
    try {
      const duration = recorder.currentTime; await recorder.stop(); await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (!mounted.current) return;
      setRecording(false);
      if (send && recorder.uri && duration >= .4 && AppState.currentState === 'active') deliver.current({ uri: recorder.uri, duration, token: `hold:${++serial.current}` });
      else if (send) setMessage('Yazı çox qısa oldu. Mikrofonu basılı saxlayıb danış.');
    } catch { if (mounted.current) setMessage('Səs yazılmadı. Yenidən cəhd et.'); }
    finally { if (mounted.current) setBusy(false); }
  }, [recorder]);
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
    return () => { mounted.current = false; app.remove(); safelyStopRecorder(recorder); void setAudioModeAsync({ allowsRecording: false }).catch(() => {}); busyChange.current(false); };
  }, [recorder, stop]);
  return <MicView active={recording} level={0} disabled={disabled} status={recording ? 'Səsin yazılır… Buraxanda göndəriləcək.' : busy ? 'Hazırlanır…' : ''} message={message}
    onIn={() => { held.current = true; void start(); }} onOut={() => { held.current = false; void stop(true); }} />;
}

function MicView({ active, level, disabled, status, message, onIn, onOut }: { active: boolean; level: number; disabled?: boolean; status: string; message?: string; onIn: () => void; onOut: () => void }) {
  // Two ways to talk: hold and release (sends on release), or a short tap to start and another tap to finish.
  const pressedAt = useRef(0), tapMode = useRef(false), ending = useRef(false), wasActive = useRef(false);
  const [tapping, setTapping] = useState(false);
  useEffect(() => {
    // Recording ended on its own (silence, app in background, help opened): leave tap mode.
    if (wasActive.current && !active) { tapMode.current = false; ending.current = false; setTapping(false); }
    wasActive.current = active;
  }, [active]);
  const pressIn = () => {
    pressedAt.current = Date.now();
    if (tapMode.current) { ending.current = true; return; }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onIn();
  };
  const pressOut = () => {
    if (ending.current) { ending.current = false; tapMode.current = false; setTapping(false); onOut(); return; }
    if (Date.now() - pressedAt.current < 350) { tapMode.current = true; setTapping(true); return; }
    onOut();
  };
  const sub = tapping ? 'Bitirəndə yenidən toxun.' : status || 'Buraxanda cavabın göndəriləcək.';
  return <View style={s.wrap}>
    <View style={[s.halo, active && s.haloActive]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Mikrofon. Basılı saxla və danış, buraxanda cavabın göndəriləcək. Və ya bir dəfə toxun, danış, sonra yenidən toxun." accessibilityState={{ disabled, busy: active }}
        disabled={disabled} onPressIn={pressIn} onPressOut={pressOut} style={[s.mic, active && s.micActive, disabled && { opacity: .5 }]}>
        <Icon name={tapping && active ? 'stop' : 'mic'} size={46} color="#fff" stroke={2.2} />
      </Pressable>
    </View>
    <Text style={s.title}>{tapping ? 'Danış' : 'Basılı saxla və danış'}</Text>
    <Text accessibilityLiveRegion="polite" style={s.sub}>{sub}</Text>
    {/* The wave appears only while the microphone is really open. */}
    <View style={{ height: 26, width: 180 }}>{active ? <Waveform active={level > .04 || active} height={24} /> : null}</View>
    {message ? <Text accessibilityLiveRegion="polite" style={s.message}>{message}</Text> : null}
  </View>;
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
  halo: { width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(142,99,232,.12)', alignItems: 'center', justifyContent: 'center' },
  haloActive: { backgroundColor: 'rgba(242,122,18,.18)' },
  mic: { width: 112, height: 112, borderRadius: 56, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center', ...shadow, shadowOpacity: .3 },
  micActive: { backgroundColor: '#7B2FE0', transform: [{ scale: 1.04 }] },
  title: { color: d.ink, fontSize: 22, ...font.extrabold, marginTop: 4 },
  sub: { color: d.lavenderText, fontSize: 15, ...font.semibold, textAlign: 'center' },
  netBtn: { minHeight: 44, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: d.purple, justifyContent: 'center' },
  netText: { color: d.purple, fontSize: 15, ...font.semibold },
  message: { color: d.inkSoft, fontSize: 14, ...font.regular, lineHeight: 20, textAlign: 'center', paddingHorizontal: 12 },
});
