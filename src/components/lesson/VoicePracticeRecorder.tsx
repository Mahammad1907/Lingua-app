import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus, useAudioRecorder } from 'expo-audio';
import * as Speech from 'expo-speech';
import { loadRecordedAudio, safelyReadRecorder, safelyStopRecorder } from '../../utils/recordedAudio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { microphoneLevel } from '../../utils/lessonGuide';
import { LessonButton, LessonIcon, SoundMark, ink } from './LessonSurface';
import ParticleWave from './ParticleWave';

// Expo Go can record/replay, but cannot turn this recording into a verified spoken answer.
export default function VoicePracticeRecorder({ onBusyChange, suspended = false, onContinue, autoStart = false, continueLabel = 'Dinlədim · Davam et', compact = false }: { autoStart?: boolean; continueLabel?: string; compact?: boolean; onContinue?: () => void; onBusyChange?: (busy: boolean) => void; suspended?: boolean }) {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const [status, setStatus] = useState({ isRecording: false });
  const player = useAudioPlayer(null), playback = useAudioPlayerStatus(player);
  const [draft, setDraft] = useState<{ uri: string; duration: number } | null>(null);
  const [levels, setLevels] = useState<number[]>([]), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    const poll = setInterval(() => {
      const sample = safelyReadRecorder(() => recorder.getStatus());
      if (sample) { setStatus({ isRecording: sample.isRecording }); if (sample.isRecording) setLevels(v => [...v.slice(-24), microphoneLevel(sample.metering)]); }
    }, 120);
    return () => clearInterval(poll);
  }, [recorder]);
  useEffect(() => {
    if (loadRecordedAudio(player, draft?.uri) !== 'error') return;
    const failure = setTimeout(() => setError('Səsli yazı açıla bilmədi. Yenidən danış.'), 0);
    return () => clearTimeout(failure);
  }, [draft, player]);
  const mounted = useRef(true), operation = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suspendedNow = useRef(suspended);
  useEffect(() => { suspendedNow.current = suspended; }, [suspended]);
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  useEffect(() => { onBusyChange?.(busy || status.isRecording); }, [busy, status.isRecording, onBusyChange]);
  const stop = useCallback(async () => {
    if (operation.current || !safelyReadRecorder(() => recorder.isRecording)) return;
    operation.current = true; setBusy(true); clear();
    try {
      const duration = recorder.currentTime; await recorder.stop(); await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (!mounted.current) return;
      if (recorder.uri && duration >= .3) { setDraft({ uri: recorder.uri, duration }); setError(''); } else setError('Yazı çox qısa oldu. Yenidən danış.');
    } catch { if (mounted.current) setError('Səs yazılmadı. Yenidən cəhd et.'); }
    finally { operation.current = false; if (mounted.current) setBusy(false); }
  }, [recorder]);
  useEffect(() => { if (!suspended || !safelyReadRecorder(() => recorder.isRecording)) return; const pause = setTimeout(() => void stop(), 0); return () => clearTimeout(pause); }, [suspended, recorder, stop]);
  useEffect(() => {
    mounted.current = true;
    const app = AppState.addEventListener('change', state => { if (state !== 'active') { loadRecordedAudio(player); void stop(); } });
    return () => { mounted.current = false; clear(); app.remove(); loadRecordedAudio(player); safelyStopRecorder(recorder); void setAudioModeAsync({ allowsRecording: false }).catch(() => {}); onBusyChange?.(false); };
  }, [onBusyChange, player, recorder, stop]);
  const start = useCallback(async () => {
    if (operation.current) return;
    operation.current = true; setBusy(true);
    try {
      player.pause(); await Speech.stop(); const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!mounted.current) return;
      if (!permission.granted) { setError('Mikrofon icazəsi verilmədi. Telefon ayarlarında icazəni aç.'); return; }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true }); await recorder.prepareToRecordAsync();
      if (!mounted.current || suspendedNow.current || AppState.currentState !== 'active') { await setAudioModeAsync({ allowsRecording: false }); return; }
      setDraft(null); setLevels([]); setError(''); recorder.record(); timer.current = setTimeout(() => void stop(), 20000);
    } catch { if (mounted.current) setError('Mikrofon açıla bilmədi. Yenidən cəhd et.'); await setAudioModeAsync({ allowsRecording: false }).catch(() => {}); }
    finally { operation.current = false; if (mounted.current) setBusy(false); }
  }, [player, recorder, stop]);
  useEffect(() => { if (!autoStart) return; const begin = setTimeout(() => void start(), 0); return () => clearTimeout(begin); }, [autoStart, start]);
  const replay = async () => {
    if (!draft) return;
    try { await Speech.stop(); if (playback.playing) player.pause(); else { await player.seekTo(0); player.play(); } } catch { setError('Səs açıla bilmədi. Yenidən yaz.'); }
  };
  return <View style={[s.box, compact && { borderWidth: 0, padding: 0, gap: 6, backgroundColor: 'transparent' }]}><View style={compact ? s.compactHero : undefined}><View style={[s.mic, compact && { width: 48, height: 48, borderRadius: 24 }]}><LessonIcon name="mic" size={32} color={status.isRecording ? ink.orange : ink.violet} /></View><View style={compact ? { flex: 1 } : undefined}><ParticleWave active={status.isRecording ? (levels.at(-1) || 0) > .04 : playback.playing} level={status.isRecording ? levels.at(-1) || 0 : undefined} height={compact ? 38 : 86} /></View></View>{!compact ? <Text style={s.title}>{status.isRecording ? 'Səni dinləyirəm…' : 'Səsli məşq et'}</Text> : null}<Text style={s.note}>{compact ? 'Səsini yaz və dinlə. Avtomatik yoxlanmır.' : 'Səsini yaz və yenidən dinlə. Bu versiyada səs yazısı mətnə çevrilmir və qiymətləndirilmir.'}</Text>
    {error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}
    {draft ? <Pressable accessibilityRole="button" disabled={busy || status.isRecording} style={s.replay} onPress={() => void replay()}><LessonIcon name={playback.playing ? 'pause' : 'play'} color={ink.orange} /><SoundMark active={playback.playing} /><Text style={s.note}>{Math.round(draft.duration)} san.</Text></Pressable> : null}
    {draft ? <Pressable accessibilityRole="button" disabled={busy || status.isRecording} onPress={() => { try { player.pause(); } catch { /* Player already stopped. */ } setDraft(null); }}><Text style={s.note}>Sil</Text></Pressable> : null}
    <Pressable accessibilityRole="button" disabled={busy} onPress={() => void (status.isRecording ? stop() : start())} style={s.record}><Text style={s.recordText}>{busy ? 'Gözlə…' : status.isRecording ? 'Dayandır' : draft ? 'Yenidən danış' : 'Mikrofona toxun və danış'}</Text></Pressable>
    {draft && onContinue ? <LessonButton disabled={busy || status.isRecording} label={continueLabel} onPress={() => { player.pause(); onContinue(); }} /> : null}
  </View>;
}
const s = StyleSheet.create({ compactHero: { flexDirection: 'row', alignItems: 'center', gap: 12 }, box: { padding: 18, gap: 10, borderRadius: 24, borderWidth: 1, borderColor: '#61508F', backgroundColor: '#15172F' }, mic: { alignSelf: 'center', width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2B244A', borderWidth: 1, borderColor: '#9A7FE4' }, title: { color: ink.text, fontSize: 19, fontWeight: '700', textAlign: 'center' }, note: { color: ink.muted, fontSize: 12, lineHeight: 18 }, error: { color: '#FFB2A2', fontSize: 12, lineHeight: 18 }, record: { minHeight: 49, borderRadius: 17, backgroundColor: '#302746', alignItems: 'center', justifyContent: 'center', padding: 12 }, recordText: { color: ink.text, fontWeight: '700', fontSize: 14 }, replay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 12 } });
