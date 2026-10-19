import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { lessonTheme as t } from '../constants/lessonTheme';
import { getSpeechEngine } from '../utils/speechEngine';
import { SpokenVerdict } from '../utils/spokenAnswer';
import { RecordedVoice } from './VoiceMessageComposer';
import VoiceWave from './VoiceWave';

export interface RecognizedVoice extends RecordedVoice { transcript: string; confidence?: number }
type Phase = 'idle' | 'preparing' | 'recording' | 'finishing' | 'draft';
interface Capture { text: string; final: boolean; uri: string; start: number; end: number; finished: boolean; failed: boolean; confidence?: number }
const emptyCapture = (): Capture => ({ text: '', final: false, uri: '', start: 0, end: 0, finished: false, failed: false });

export default function RecognizedVoiceComposer({ checkAnswer, onValid, onJudged, onBusyChange }: {
  checkAnswer: (text: string) => SpokenVerdict;
  onValid: (voice: RecognizedVoice) => void;
  onJudged: (correct: boolean, token: string) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [engine] = useState(getSpeechEngine);
  const [phase, setPhase] = useState<Phase>('idle');
  useEffect(() => { onBusyChange?.(phase === 'preparing' || phase === 'recording' || phase === 'finishing'); }, [onBusyChange, phase]);
  useEffect(() => () => onBusyChange?.(false), [onBusyChange]);
  const [draft, setDraft] = useState<RecognizedVoice | null>(null);
  const [partial, setPartial] = useState('');
  const [error, setError] = useState('');
  const [networkConsent, setNetworkConsent] = useState(false);
  const [needsModel, setNeedsModel] = useState(false);
  const capture = useRef<Capture>(emptyCapture());
  const active = useRef(false);
  const starting = useRef(false);
  const judged = useRef(new Set<string>());
  const mounted = useRef(true);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const player = useAudioPlayer(null);
  useEffect(() => { player.replace(draft ? { uri: draft.uri } : null); }, [draft, player]);
  const playback = useAudioPlayerStatus(player);
  const clearTimers = useCallback(() => {
    if (stopTimer.current) clearTimeout(stopTimer.current);
    if (endTimer.current) clearTimeout(endTimer.current);
    stopTimer.current = null; endTimer.current = null;
  }, []);
  const syncDraft = useCallback(() => {
    const result = capture.current;
    if (!mounted.current || !active.current || result.failed || !result.finished || !result.final || !result.uri || !result.text.trim() || result.start <= 0 || result.end <= result.start) return;
    active.current = false; clearTimers();
    setDraft({ uri: result.uri, duration: Math.max(.3, (result.end - result.start) / 1000), transcript: result.text, confidence: result.confidence });
    setPhase('draft'); setError('');
    void setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
  }, [clearTimers]);
  const fail = useCallback((message: string) => {
    if (!mounted.current) return;
    capture.current.failed = true; active.current = false; clearTimers();
    setPhase('idle'); setError(message); setDraft(null);
    try { engine?.abort(); } catch { /* Recorder may already be inactive. */ }
    void setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
  }, [clearTimers, engine]);
  const stop = useCallback(() => {
    if (!engine || !active.current || capture.current.finished) return;
    clearTimers(); setPhase('finishing');
    try { engine.stop(); } catch { fail('Səs tanıma dayandırıla bilmədi. Yenidən cəhd et.'); return; }
    endTimer.current = setTimeout(() => fail('Səsin yekun mətni alınmadı. Bu, dil səhvi sayılmır; yenidən danış.'), 15000);
  }, [clearTimers, engine, fail]);

  useEffect(() => {
    mounted.current = true;
    if (!engine) return () => { mounted.current = false; };
    const subscriptions = [
      engine.addListener('result', (event) => {
        if (!active.current || capture.current.failed) return;
        const text = event.results[0]?.transcript || '';
        setPartial(text);
        if (event.isFinal) { capture.current.text = text; capture.current.confidence = event.results[0]?.confidence; capture.current.final = true; syncDraft(); }
      }),
      engine.addListener('audiostart', (event) => { if (active.current) capture.current.start = event.timestamp; }),
      engine.addListener('audioend', (event) => {
        if (!active.current) return;
        capture.current.uri = event.uri || ''; capture.current.end = event.timestamp; syncDraft();
      }),
      engine.addListener('end', () => {
        if (!active.current) return;
        capture.current.finished = true; setPhase('finishing'); syncDraft();
        if (active.current) {
          clearTimers();
          endTimer.current = setTimeout(() => fail('Səs və yekun mətn tam alınmadı. Yenidən danış; səhv kimi hesablanmır.'), 1500);
        }
      }),
      engine.addListener('error', (event) => {
        if (!active.current) return;
        if (event.error === 'language-not-supported' || event.error === 'service-not-allowed') setNeedsModel(true);
        fail(event.error === 'not-allowed' ? 'Mikrofon və səs tanıma icazəsini telefon ayarlarında aç.'
          : event.error === 'network' ? 'İnternet bağlantısı alınmadı. Yenidən cəhd et.'
          : 'Səs tanınmadı. Eşidilən mətni yoxla və yenidən danış; bu, dil səhvi sayılmır.');
      }),
    ];
    const app = AppState.addEventListener('change', (state) => {
      if (state !== 'active') { player.pause(); if (active.current) fail('Yazı dayandırıldı. Tətbiqə qayıdıb yenidən danış.'); }
    });
    return () => {
      mounted.current = false; active.current = false; clearTimers();
      subscriptions.forEach((subscription) => subscription.remove()); app.remove();
      try { engine.abort(); } catch { /* Recorder may already be inactive. */ }
      void setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    };
  }, [clearTimers, engine, fail, player, syncDraft]);

  const start = async () => {
    if (!engine || starting.current || active.current) return;
    starting.current = true; setPhase('preparing');
    try {
      player.pause(); await Speech.stop();
      const permission = await engine.requestPermissionsAsync();
      if (!mounted.current) return;
      if (!permission.granted) { fail('Mikrofon və səs tanıma icazəsi verilmədi. Ayarlarda icazəni aç.'); return; }
      if (!engine.isRecognitionAvailable()) { fail('Telefonun səs tanıma xidməti hazır deyil. Ayarları yoxla və ya bu tapşırığı keç.'); return; }
      if (!engine.supportsRecording()) { fail('Bu cihazda səs tanıma ilə birlikdə səsli mesaj yazılması dəstəklənmir. Bu tapşırığı keçə bilərsən.'); return; }
      if (!networkConsent && !engine.supportsOnDeviceRecognition()) {
        fail('Cihazda yerli səs tanıma dəstəklənmir. İstəsən aşağıda internetlə tanımaya icazə ver.'); return;
      }
      if (AppState.currentState !== 'active') { fail('Danışmaq üçün tətbiqə qayıt.'); return; }
      capture.current = emptyCapture(); active.current = true; setDraft(null); setPartial(''); setError(''); setNeedsModel(false);
      setPhase('recording');
      engine.start({ lang: 'en-US', interimResults: true, maxAlternatives: 1, continuous: false,
        requiresOnDeviceRecognition: !networkConsent, recordingOptions: { persist: true },
      });
      if (active.current) stopTimer.current = setTimeout(stop, 20000);
    } catch { fail('Səs tanıma başlaya bilmədi. Yenidən cəhd et və ya tapşırığı keç.'); }
    finally { starting.current = false; }
  };
  const replay = async () => {
    try { await Speech.stop(); if (playback.playing) player.pause(); else { await player.seekTo(0); player.play(); } }
    catch { setError('Səsli yazı açıla bilmədi. Yenidən yaz.'); }
  };
  const submit = () => {
    if (!draft || phase !== 'draft') return;
    player.pause();
    if (draft.confidence !== undefined && draft.confidence >= 0 && draft.confidence < .35) {
      setError('Səs tanıma cavabı etibarlı eşitmədi. Yenidən danış; səhv kimi hesablanmır.'); return;
    }
    const result = checkAnswer(draft.transcript);
    if (result.countAsAttempt !== false && !judged.current.has(draft.uri)) {
      judged.current.add(draft.uri);
      onJudged(result.correct, draft.uri);
    }
    if (!result.correct) { setError(result.message); return; }
    onValid(draft);
  };

  if (!engine) return <View style={styles.box}><Text style={styles.note}>Səsin yoxlanması üçün BirTalk-ın ayrıca sınaq yığımı lazımdır. Expo Go-da bu modul yoxdur. Səsli tapşırığı keçə bilərsən.</Text></View>;
  const busy = phase === 'preparing' || phase === 'finishing';
  return <View style={styles.box}>
    {partial ? <Text style={styles.note}>Eşidilən: {partial}</Text> : null}
    {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    {draft ? <TouchableOpacity accessibilityLabel="Səsli cavabını dinlə" style={styles.replay} onPress={() => void replay()}><Text style={styles.note}>{playback.playing ? 'Ⅱ' : '▶'}</Text><VoiceWave playing={playback.playing} /><Text style={styles.note}>{Math.round(draft.duration)} san.</Text></TouchableOpacity> : null}
    <View style={styles.row}>
      <TouchableOpacity disabled={busy} onPress={() => phase === 'recording' ? stop() : void start()} style={styles.record}><Text style={styles.text}>{busy ? 'Səs tanınır…' : phase === 'recording' ? '■ Dayandır' : draft ? 'Yenidən danış' : '● Səsli cavab yaz'}</Text></TouchableOpacity>
      {draft ? <TouchableOpacity onPress={submit} style={styles.send}><Text style={styles.dark}>Yoxla və göndər</Text></TouchableOpacity> : null}
    </View>
    {needsModel && Platform.OS === 'android' && !networkConsent ? <TouchableOpacity disabled={busy || phase === 'recording'} onPress={() => void engine.androidTriggerOfflineModelDownload({ locale: 'en-US' }).then(() => setError('İngilis dili modelinin quraşdırılmasını tamamlayıb yenidən danış.')).catch(() => setError('Model yüklənmədi. İnternet və telefon ayarlarını yoxla.'))}><Text style={styles.link}>İngilis dili səs modelini yüklə</Text></TouchableOpacity> : null}
    <TouchableOpacity disabled={busy || phase === 'recording'} onPress={() => setNetworkConsent((value) => !value)}><Text style={styles.link}>{networkConsent ? '☑' : '□'} İnternetlə səs tanımaya icazə ver</Text></TouchableOpacity>
    <Text style={styles.small}>{networkConsent ? 'Səs tanıma üçün Apple/Google xidmətinə göndərilə bilər.' : 'Yerli tanıma: səs bu funksiya tərəfindən serverə göndərilmir.'} Tanınan mətn yoxlanır; tələffüz balı verilmir.</Text>
  </View>;
}
const styles = StyleSheet.create({
  box: { padding: 14, backgroundColor: t.surface, borderTopWidth: 1, borderTopColor: t.border }, note: { color: t.text, fontSize: 12, lineHeight: 18 },
  error: { color: t.error, fontSize: 12, lineHeight: 18, marginBottom: 8 }, row: { flexDirection: 'row', gap: 8, marginVertical: 8 }, record: { flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: t.raised, borderRadius: 14, padding: 10 },
  text: { color: t.text, fontSize: 12, fontWeight: '700' }, send: { backgroundColor: t.orange, justifyContent: 'center', borderRadius: 14, padding: 10 }, dark: { color: '#241321', fontSize: 12, fontWeight: '700' },
  replay: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 8 }, link: { color: t.orange, fontSize: 11, paddingVertical: 9 }, small: { color: t.muted, fontSize: 10, lineHeight: 15 },
});
