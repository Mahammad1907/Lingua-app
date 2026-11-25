import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioPlayer, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLessonSpeech } from '../../hooks/useLessonSpeech';
import { SPEECH_DEBUG } from '../../utils/speechEngine';
import { safelyReadRecorder, safelyStopRecorder } from '../../utils/recordedAudio';
import type { SpokenAnswer, UnverifiedRecording } from '../../utils/speechTurn';
import Icon from './Icons';
import VoiceOrb, { ORB, ORB_BOX } from './VoiceOrb';
import { d, font } from './theme';

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

/** The orb's own short sounds (25 Nov 2026, made for BirTalk): a soft rising chime when listening starts, a two-note one when the answer is sent. */
const START = require('../../../assets/sounds/orb-start.wav');
const SEND = require('../../../assets/sounds/orb-send.wav');
function useOrbSounds() {
  const start = useAudioPlayer(START), send = useAudioPlayer(SEND);
  const play = useCallback((p: typeof start) => { try { p.volume = .6; void p.seekTo(0).catch(() => {}); p.play(); } catch { /* a missing chime never blocks the answer */ } }, []);
  // Stable object: callbacks that depend on it must not change every render (the recorder cleanup keys on them).
  return useMemo(() => ({ start: () => play(start), send: () => play(send) }), [play, start, send]);
}
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

function NativeHold({ speech, disabled }: { speech: SpeechApi; disabled?: boolean }) {
  const held = useRef(false);
  const sounds = useOrbSounds();
  const was = useRef(speech.phase);
  useEffect(() => {
    // The recogniser ends by itself on silence (continuous: false) and submits — the send chime marks it.
    if (was.current === 'listening' && speech.phase !== 'listening') sounds.send();
    was.current = speech.phase;
  }, [speech.phase, sounds]);
  const [network, setNetwork] = useState(false);
  const listening = speech.phase === 'listening';
  const pending = speech.phase === 'preparing' || speech.phase === 'processing';
  // Released before the microphone actually opened: stop as soon as it does.
  useEffect(() => { if (listening && !held.current) speech.stop(); }, [listening, speech]);
  const status = listening ? '' : speech.phase === 'processing' ? 'Yoxlanılır…' : speech.phase === 'preparing' ? 'Hazırlanır…' : '';
  return <View style={{ gap: 8, alignItems: 'center' }}>
    <MicView active={listening} level={listening ? speech.level : 0} disabled={disabled || speech.phase === 'processing'} status={status} message={pending ? '' : speech.message}
      onIn={() => {
        held.current = true;
        // A stale review/processing state (e.g. after backgrounding) must never leave the mic dead.
        if (speech.phase === 'review') speech.cancel();
        if (speech.phase === 'idle' || speech.phase === 'review') { sounds.start(); void wait(180).then(() => speech.start(network)); }
      }}
      onOut={() => { held.current = false; if (speech.phase === 'listening') speech.stop(); }} />
    {speech.needsNetwork && !network ? <Pressable accessibilityRole="button" onPress={() => setNetwork(true)} style={s.netBtn}>
      <Text style={s.netText}>İnternet ilə səs tanımaya icazə ver</Text>
    </Pressable> : null}
    {SPEECH_DEBUG && speech.trace.length ? <Text selectable style={s.debug}>{speech.trace.join('\n')}</Text> : null}
  </View>;
}

function RecorderHold({ onRecording, onBusyChange, disabled, suspended }: { onRecording: (r: UnverifiedRecording) => void; onBusyChange: (b: boolean) => void; disabled?: boolean; suspended?: boolean }) {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const live = useAudioRecorderState(recorder, 120);
  const sounds = useOrbSounds();
  // Auto send (25 Nov 2026): once speech was heard, ~1.3 s of quiet sends the answer — no need to hold or tap again.
  const heard = useRef(false), loudAt = useRef(0), openedAt = useRef(0);
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
      if (send && recorder.uri && duration >= .4 && AppState.currentState === 'active') { sounds.send(); deliver.current({ uri: recorder.uri, duration, token: `hold:${++serial.current}` }); }
      else if (send) setMessage('Yazı çox qısa oldu. Mikrofonu basılı saxlayıb danış.');
    } catch { if (mounted.current) setMessage('Səs yazılmadı. Yenidən cəhd et.'); }
    finally { if (mounted.current) setBusy(false); }
  }, [recorder, sounds]);
  useEffect(() => {
    if (!recording || busy) return;
    const level = live.metering ?? -160, now = Date.now();
    if (level > -38) { heard.current = true; loudAt.current = now; }
    if (heard.current && now - loudAt.current > 1300) void stop(true);
    else if (!heard.current && now - openedAt.current > 7000) { void stop(false); setMessage('Səs eşidilmədi. Yenidən cəhd et.'); }
  }, [live.metering, live.durationMillis, recording, busy, stop]);
  const start = useCallback(async () => {
    if (busy || recording) return;
    setBusy(true); setMessage('');
    try {
      await Speech.stop();
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) { setMessage('Mikrofon icazəsi verilmədi. Telefon ayarlarında icazəni aç.'); return; }
      sounds.start(); await wait(220);   // the chime ends before the microphone opens, so it is not recorded
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true }); await recorder.prepareToRecordAsync();
      if (!held.current || !mounted.current) { await setAudioModeAsync({ allowsRecording: false }); return; }
      heard.current = false; loudAt.current = 0; openedAt.current = Date.now();
      recorder.record(); setRecording(true);
    } catch { setMessage('Mikrofon açıla bilmədi. Yenidən cəhd et.'); await setAudioModeAsync({ allowsRecording: false }).catch(() => {}); }
    finally { if (mounted.current) setBusy(false); }
  }, [busy, recording, recorder, sounds]);
  useEffect(() => { if (suspended) void stop(false); }, [suspended, stop]);
  useEffect(() => {
    mounted.current = true;
    const app = AppState.addEventListener('change', state => { if (state !== 'active') void stop(false); });
    return () => { mounted.current = false; app.remove(); safelyStopRecorder(recorder); void setAudioModeAsync({ allowsRecording: false }).catch(() => {}); busyChange.current(false); };
  }, [recorder, stop]);
  // Voice level for the orb: metering is dBFS (about -60 quiet … 0 loud).
  const meterLevel = recording ? Math.max(0, Math.min(1, ((live.metering ?? -160) + 55) / 40)) : 0;
  return <MicView active={recording} level={meterLevel} disabled={disabled} status={recording ? '' : busy ? 'Hazırlanır…' : ''} message={message}
    onIn={() => { held.current = true; void start(); }} onOut={() => { held.current = false; void stop(true); }} />;
}

function MicView({ active, level, disabled, status, message, onIn, onOut }: { active: boolean; level: number; disabled?: boolean; status: string; message?: string; onIn: () => void; onOut: () => void }) {
  // Two ways to talk: hold and release (sends on release), or a short tap to start and another tap to finish.
  const pressedAt = useRef(0), tapMode = useRef(false), ending = useRef(false), wasActive = useRef(false);
  const [, setTapping] = useState(false);
  useEffect(() => {
    // Recording ended on its own (silence, app in background, help opened): leave tap mode.
    if (wasActive.current && !active) { tapMode.current = false; ending.current = false; setTapping(false); }
    wasActive.current = active;
  }, [active]);
  const pressIn = () => {
    pressedAt.current = Date.now();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (tapMode.current) { ending.current = true; return; }
    onIn();
  };
  const pressOut = () => {
    if (ending.current) { ending.current = false; tapMode.current = false; setTapping(false); onOut(); return; }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (Date.now() - pressedAt.current < 350) { tapMode.current = true; setTapping(true); return; }
    onOut();
  };
  // While listening only the orb is on screen (user, 25 Nov 2026): no icon, no words. Texts keep their space (opacity) so nothing jumps.
  const sub = status || 'Buraxanda cavabın göndəriləcək.';
  const hide = active ? { opacity: 0 } : null;
  return <View style={s.wrap}>
    <View style={s.orbBox}>
      <VoiceOrb active={active} disabled={disabled} level={level} />
      <Pressable accessibilityRole="button" accessibilityLabel={active ? 'Dinləyirəm. Susanda cavabın göndəriləcək.' : 'Mikrofon. Basılı saxla və danış, və ya bir dəfə toxun və danış. Susanda cavabın göndəriləcək.'} accessibilityState={{ disabled, busy: active }}
        disabled={disabled} onPressIn={pressIn} onPressOut={pressOut} style={s.mic}>
        {active ? null : <Icon name="mic" size={40} color="#fff" stroke={2.2} />}
      </Pressable>
    </View>
    <Text style={[s.title, hide]}>Basılı saxla və danış</Text>
    <Text accessibilityLiveRegion="polite" style={[s.sub, hide]}>{sub}</Text>
    {message && !active ? <Text accessibilityLiveRegion="polite" style={s.message}>{message}</Text> : null}
  </View>;
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 2 },
  orbBox: { width: ORB_BOX, height: ORB_BOX, marginVertical: -45 },
  mic: { position: 'absolute', left: (ORB_BOX - ORB) / 2, top: (ORB_BOX - ORB) / 2, width: ORB, height: ORB, borderRadius: ORB / 2, alignItems: 'center', justifyContent: 'center' },
  title: { color: d.title, fontSize: 20, ...font.extrabold, marginTop: 4 },
  sub: { color: d.inkSoft, fontSize: 16, ...font.semibold, textAlign: 'center' },
  netBtn: { minHeight: 44, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: d.purple, justifyContent: 'center' },
  netText: { color: d.purple, fontSize: 15, ...font.semibold },
  debug: { color: d.ink, fontSize: 10, lineHeight: 12, alignSelf: 'stretch', paddingHorizontal: 12 },
  message: { color: d.ink, fontSize: 15, ...font.semibold, lineHeight: 20, textAlign: 'center', paddingHorizontal: 12 },
});
