import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VoiceWave from './VoiceWave';
import { lessonTheme as t } from '../constants/lessonTheme';

export interface RecordedVoice { uri: string; duration: number }

export default function VoiceMessageComposer({ onSend }: { onSend: (voice: RecordedVoice) => void }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder);
  const [draft, setDraft] = useState<RecordedVoice | null>(null);
  const player = useAudioPlayer(draft ? { uri: draft.uri } : null);
  const playback = useAudioPlayerStatus(player);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const operation = useRef(false);
  const mounted = useRef(true);

  const stop = useCallback(async () => {
    if (operation.current || !recorder.isRecording) return;
    operation.current = true;
    setBusy(true);
    try {
      const duration = recorder.currentTime;
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (!mounted.current) return;
      if (!recorder.uri || duration < 0.3) {
        setError('Yazı çox qısa oldu. Yenidən danışıb dayandır.');
      } else {
        setDraft({ uri: recorder.uri, duration });
        setError('');
      }
    } catch {
      if (mounted.current) setError('Yazı alınmadı. Yenidən cəhd et.');
    } finally {
      operation.current = false;
      if (mounted.current) setBusy(false);
    }
  }, [recorder]);

  useEffect(() => {
    mounted.current = true;
    const subscription = AppState.addEventListener('change', (value) => {
      if (value !== 'active') { player.pause(); void stop(); }
    });
    return () => {
      mounted.current = false;
      subscription.remove();
      void setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    };
  }, [player, stop]);

  const start = async () => {
    if (operation.current) return;
    operation.current = true;
    setBusy(true);
    try {
      player.pause();
      await Speech.stop();
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!mounted.current) return;
      if (!permission.granted) {
        setError('Mikrofon icazəsi verilmədi. Telefon ayarlarında icazəni açıb yenidən cəhd et.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      if (!mounted.current || AppState.currentState !== 'active') {
        await setAudioModeAsync({ allowsRecording: false });
        return;
      }
      setDraft(null);
      setError('');
      recorder.record();
    } catch {
      if (mounted.current) setError('Mikrofon açıla bilmədi. Yenidən cəhd et.');
      await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    } finally {
      operation.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const listen = async () => {
    try {
      await Speech.stop();
      if (playback.playing) player.pause();
      else { await player.seekTo(0); player.play(); }
    } catch { setError('Səsi açmaq alınmadı. Yenidən cəhd et.'); }
  };

  const send = async () => {
    if (!draft || operation.current || recorder.isRecording) return;
    operation.current = true;
    setBusy(true);
    try {
      player.pause();
      await Speech.stop();
      onSend(draft);
      if (mounted.current) setDraft(null);
    } finally {
      operation.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const blocked = busy || state.isRecording;
  return (
    <View style={styles.container}>
      {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
      {draft ? (
        <View style={styles.row}>
          <TouchableOpacity disabled={blocked} style={styles.draft} onPress={() => void listen()}>
            <Text style={styles.draftText}>{playback.playing ? 'Ⅱ' : '▶'}</Text><VoiceWave playing={playback.playing} /><Text style={styles.draftText}>{Math.max(1, Math.round(draft.duration))} san.</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={blocked} accessibilityLabel="Yazını sil" onPress={() => { player.pause(); setDraft(null); }} style={styles.delete}><Text style={styles.text}>×</Text></TouchableOpacity>
        </View>
      ) : null}
      <View style={styles.row}>
        <TouchableOpacity disabled={busy} style={[styles.mic, state.isRecording && styles.recording]} onPress={() => void (recorder.isRecording ? stop() : start())}>
          <Text style={styles.text}>{busy ? 'Gözlə…' : state.isRecording ? `■ ${Math.floor(state.durationMillis / 1000)} san. · Dayandır` : '● Səsli cavab yaz'}</Text>
        </TouchableOpacity>
        {draft ? <TouchableOpacity disabled={blocked} onPress={() => void send()} style={styles.send}><Text style={styles.sendText}>Göndər ↑</Text></TouchableOpacity> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: t.surface, borderTopWidth: 1, borderTopColor: t.border, paddingHorizontal: 14, paddingTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }, mic: { flex: 1, minHeight: 48, padding: 14, borderRadius: 16, backgroundColor: t.raised, alignItems: 'center' }, recording: { backgroundColor: t.errorBg }, text: { color: t.text, fontSize: 13, fontWeight: '700' },
  draft: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5, backgroundColor: t.raised, padding: 12, borderRadius: 16 }, draftText: { color: t.text, fontWeight: '700', fontSize: 12 }, delete: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 14, backgroundColor: t.raised },
  send: { backgroundColor: t.orange, minHeight: 48, padding: 14, borderRadius: 16 }, sendText: { color: '#241321', fontWeight: '800', fontSize: 13 }, error: { color: t.error, fontSize: 12, lineHeight: 18, marginBottom: 8 },
});
