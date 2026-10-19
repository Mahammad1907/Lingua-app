import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

export default function VoicePractice({ prompt, examples, onDone, last }: {
  prompt: string;
  examples: string[];
  onDone: (outcome: { skipped: boolean; assisted: boolean }) => void;
  last: boolean;
}) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [uri, setUri] = useState<string | null>(null);
  const player = useAudioPlayer(uri ? { uri } : null);
  const playerState = useAudioPlayerStatus(player);
  const [busy, setBusy] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const assisted = useRef(false);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [message, setMessage] = useState('');
  const operation = useRef(false);
  const mounted = useRef(true);

  const stopRecording = useCallback(async () => {
    if (operation.current || !recorder.isRecording) return;
    operation.current = true;
    setBusy(true);
    try {
      const duration = recorder.currentTime;
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (!mounted.current) return;
      if (duration < 0.5 || !recorder.uri) {
        setUri(null);
        setMessage('Yazı çox qısa oldu. Bir cümlə deyib yenidən cəhd et.');
      } else {
        setUri(recorder.uri);
        setMessage('Yazın hazırdır. Özünü dinlə və nümunə ilə müqayisə et.');
      }
    } catch {
      if (mounted.current) setMessage('Yazını saxlamaq alınmadı. Yenidən cəhd et.');
    } finally {
      operation.current = false;
      if (mounted.current) setBusy(false);
    }
  }, [recorder]);

  useEffect(() => {
    mounted.current = true;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        player.pause();
        void Speech.stop();
        void stopRecording();
      }
    });
    return () => {
      mounted.current = false;
      subscription.remove();
      void Speech.stop();
      // expo-audio hooks dispose their player and recorder on unmount.
      void setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    };
  }, [player, stopRecording]);

  const startRecording = async () => {
    if (operation.current || recorder.isRecording) return;
    operation.current = true;
    setBusy(true);
    try {
      player.pause();
      await Speech.stop();
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!mounted.current) return;
      if (!permission.granted) {
        setMessage('Səs yazmaq üçün mikrofon icazəsi lazımdır. Telefon ayarlarından icazəni aça və ya bu dəfə səssiz davam edə bilərsən.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      if (!mounted.current || AppState.currentState !== 'active') {
        await setAudioModeAsync({ allowsRecording: false });
        return;
      }
      setUri(null);
      setMessage('Danış. Bitirəndə “Dayandır” düyməsini bas.');
      recorder.record();
    } catch {
      if (mounted.current) setMessage('Mikrofon açıla bilmədi. Yenidən cəhd et və ya səssiz davam et.');
      await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    } finally {
      operation.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const listen = async () => {
    try {
      await Speech.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (playerState.playing) player.pause();
      else {
        await player.seekTo(0);
        player.play();
      }
    } catch {
      setMessage('Yazını dinləmək alınmadı. Yenidən cəhd et.');
    }
  };

  const listenExample = async (text: string) => {
    try {
      player.pause();
      await Speech.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      Speech.speak(text, { language: 'en-GB', rate: 0.75 });
    } catch {
      setMessage('Nümunənin səsi açıla bilmədi. Mətni oxuyub məşq edə bilərsən.');
    }
  };

  const finish = () => {
    if (operation.current || recorder.isRecording) return;
    player.pause();
    void Speech.stop();
    onDone({ skipped: !uri, assisted: assisted.current });
  };

  const blocked = busy || recorderState.isRecording;

  return (
    <View style={styles.card}>
      <Text style={styles.prompt}>{prompt}</Text>
      <Text style={styles.note}>Əvvəl özün de. Çətinlik çəkəndə nümunəni aç.</Text>
      <TouchableOpacity
        accessibilityLabel={recorderState.isRecording ? 'Səs yazısını dayandır' : 'Səs yazmağa başla'}
        disabled={busy}
        onPress={() => void (recorder.isRecording ? stopRecording() : startRecording())}
        style={[styles.microphone, recorderState.isRecording && styles.recording, busy && styles.disabled]}
      >
        <Text style={styles.micText}>{busy ? 'Gözlə…' : recorderState.isRecording ? '■ Dayandır' : '● Səsimi yaz'}</Text>
      </TouchableOpacity>
      {recorderState.isRecording ? <Text style={styles.timer}>{Math.floor(recorderState.durationMillis / 1000)} saniyə · yazılır</Text> : null}
      {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
      {uri ? (
        <TouchableOpacity disabled={blocked} style={styles.secondary} onPress={() => void listen()}>
          <Text style={styles.secondaryText}>{playerState.playing ? 'Ⅱ Dinləməni dayandır' : '▶ Özümü dinlə'}</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity disabled={blocked} style={styles.secondary} onPress={() => { assisted.current = true; setShowExample((value) => !value); }}>
        <Text style={styles.secondaryText}>{showExample ? 'Nümunəni gizlət' : 'Nümunəyə bax'}</Text>
      </TouchableOpacity>
      {showExample ? examples.map((text) => (
        <TouchableOpacity key={text} disabled={blocked} style={styles.example} onPress={() => void listenExample(text)}>
          <Text style={styles.exampleText}>▶ {text}</Text>
        </TouchableOpacity>
      )) : null}
      <Text style={styles.note}>Səsin serverə göndərilmir. Bu məşq avtomatik tələffüz qiyməti vermir.</Text>
      {uri ? (
        <TouchableOpacity disabled={blocked} style={[styles.next, blocked && styles.disabled]} onPress={finish}>
          <Text style={styles.micText}>{last ? 'Dərsi tamamla →' : 'Növbəti tapşırıq →'}</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity disabled={blocked} onPress={() => setConfirmSkip(true)} style={styles.skip}>
        <Text style={styles.note}>Bu dəfə səssiz davam et</Text>
      </TouchableOpacity>
      {confirmSkip ? (
        <View>
          <Text style={styles.note}>Bu dəfə səssiz davam edək? Danışığı sonra yenidən məşq edə bilərsən.</Text>
          <TouchableOpacity disabled={blocked} style={styles.secondary} onPress={finish}>
            <Text style={styles.secondaryText}>Bəli, davam et</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skip} onPress={() => setConfirmSkip(false)}>
            <Text style={styles.note}>Danışıqda qal</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 22, backgroundColor: colors.surface, marginTop: 16 },
  prompt: { color: '#fff', fontSize: 21, lineHeight: 29, fontWeight: '800' },
  note: { color: '#aeb5ca', fontSize: 13, lineHeight: 20, marginVertical: 10 },
  microphone: { backgroundColor: '#8b5cf6', borderRadius: 24, paddingVertical: 25, alignItems: 'center', marginVertical: 16 },
  recording: { backgroundColor: '#c74d61' },
  micText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  timer: { color: '#ff9fab', textAlign: 'center', marginBottom: 10 },
  message: { color: '#d2d8e6', fontSize: 14, lineHeight: 21, marginBottom: 12 },
  secondary: { padding: 15, backgroundColor: '#232340', borderRadius: 14, marginBottom: 10 },
  secondaryText: { color: '#e4defa', fontWeight: '700', textAlign: 'center' },
  example: { padding: 15, backgroundColor: colors.mascot.bgSoft, borderRadius: 14, marginBottom: 8 },
  exampleText: { color: colors.mascot.orange, fontSize: 18, fontWeight: '700' },
  next: { backgroundColor: colors.mascot.orange, padding: 17, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  skip: { paddingVertical: 8, alignItems: 'center' },
  disabled: { opacity: 0.45 },
});
