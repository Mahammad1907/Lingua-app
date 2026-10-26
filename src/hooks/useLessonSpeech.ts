import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { getSpeechEngine } from '../utils/speechEngine';
import { SpeechTurn, type SpokenAnswer } from '../utils/speechTurn';

export function useLessonSpeech({ onFinal, onBusyChange, suspended = false, autoStart = false, autoSubmit = false }: {
  onFinal: (answer: SpokenAnswer) => string | null;
  onBusyChange: (busy: boolean) => void;
  suspended?: boolean; autoStart?: boolean; autoSubmit?: boolean;
}) {
  const [engine] = useState(getSpeechEngine);
  const [turn] = useState(() => new SpeechTurn());
  const [phase, setPhase] = useState<'idle' | 'preparing' | 'listening' | 'processing' | 'review'>('idle');
  const [partial, setPartial] = useState(''), [message, setMessage] = useState('');
  const [level, setLevel] = useState(0), [needsNetwork, setNeedsNetwork] = useState(false);
  const [needsModel, setNeedsModel] = useState(false);
  const [draft, setDraft] = useState<SpokenAnswer | null>(null), [reviewText, setReviewText] = useState('');
  const candidate = useRef<SpokenAnswer | null>(null);
  const audioUri = useRef(''), audioStart = useRef(0), audioGeneration = useRef(0);
  const networkAllowed = useRef(false);
  const alive = useRef(false), pending = useRef(false), closing = useRef(false), generation = useRef(0);
  const handlers = useRef({ onFinal, onBusyChange, suspended, autoSubmit });
  useEffect(() => { handlers.current = { onFinal, onBusyChange, suspended, autoSubmit }; }, [onFinal, onBusyChange, suspended, autoSubmit]);
  const busy = phase !== 'idle';
  useEffect(() => { onBusyChange(busy); }, [onBusyChange, busy]);
  useEffect(() => {
    alive.current = true;
    const invalidate = () => { generation.current += 1; pending.current = false; };
    const abort = () => { try { engine?.abort(); } catch { closing.current = false; } };
    const fail = (text: string) => {
      turn.cancel(); candidate.current = null; setDraft(null); generation.current++; pending.current = false;
      closing.current = true; abort();
      if (alive.current) { setPhase('idle'); setLevel(0); setMessage(text); }
    };
    const finish = () => {
      closing.current = false;
      if (!alive.current || turn.phase === 'idle') return;
      if (handlers.current.suspended) { turn.cancel(); setPhase('idle'); setLevel(0); return; }
      const recognized = turn.finish();
      const result = recognized ? { ...recognized, uri: audioUri.current || undefined } : null; setLevel(0);
      if (result && handlers.current.autoSubmit && AppState.currentState === 'active') {
        // The finished turn is consumed before calling out: duplicate native end
        // events cannot send the same recognized utterance again.
        candidate.current = null;
        const message = handlers.current.onFinal({ ...result, edited: false });
        if (!message) { setDraft(null); setReviewText(''); setPhase('idle'); setMessage(''); return; }
        candidate.current = result; setDraft(result); setReviewText(result.text); setPhase('review'); setMessage(message); return;
      }
      candidate.current = result; setDraft(result); setReviewText(result?.text || '');
      setPhase(result ? 'review' : 'idle');
      setMessage(result ? '' : 'Səs dəqiq tanınmadı. Yenidən danış; bu, səhv sayılmır.');
    };
    const subscriptions = engine ? [
      engine.addListener('start', () => { if (alive.current && turn.phase === 'listening') setPhase('listening'); }),
      engine.addListener('volumechange', event => {
        if (!alive.current || turn.phase !== 'listening') return;
        turn.volume(event.value, Date.now()); setLevel(Number.isFinite(event.value) ? Math.max(0, Math.min(1, event.value / 10)) : 0);
      }),
      engine.addListener('result', event => {
        if (!alive.current || turn.phase === 'idle') return;
        const result = event.results[0];
        turn.result(result?.transcript || '', event.isFinal, result?.confidence, Date.now());
        setPartial(result?.transcript || '');
        if (event.isFinal) setPhase('processing');
      }),
      engine.addListener('audiostart', event => { if (alive.current && turn.phase === 'listening') { audioStart.current = event.timestamp; audioGeneration.current = generation.current; } }),
      engine.addListener('audioend', event => {
        if (!alive.current || audioGeneration.current !== generation.current || !audioStart.current || event.timestamp < audioStart.current || typeof event.uri !== 'string') return;
        audioUri.current = event.uri;
        if (candidate.current) { const next = { ...candidate.current, uri: event.uri }; candidate.current = next; setDraft(previous => ({ ...next, edited: previous?.edited })); }
      }),
      engine.addListener('end', finish),
      engine.addListener('nomatch', () => { if (turn.phase !== 'idle') fail('Səs dəqiq eşidilmədi. Yenidən danış; bu, səhv sayılmır.'); }),
      engine.addListener('error', event => {
        if (turn.phase === 'idle') return;
        if (event.error === 'language-not-supported' || event.error === 'service-not-allowed') { setNeedsNetwork(true); if (Platform.OS === 'android' && Number(Platform.Version) >= 33) setNeedsModel(true); }
        fail(event.error === 'not-allowed' ? 'Mikrofon və səs tanıma icazəsini telefon ayarlarında aç.' : event.error === 'network' ? 'Bağlantı kəsildi. Yenidən cəhd et; bu, səhv sayılmır.' : 'Səs tanınmadı. Yenidən danış; bu, səhv sayılmır.');
      }),
    ] : [];
    const timer = setInterval(() => {
      const action = turn.tick(Date.now());
      if (action === 'stop') { setPhase('processing'); try { engine?.stop(); } catch { fail('Səs dayandırıla bilmədi. Yenidən cəhd et.'); } }
      if (action === 'empty' || action === 'timeout') fail(action === 'empty' ? 'Səs eşidilmədi. Mikrofona toxunub yenidən danış.' : 'Yekun mətn alınmadı. Yenidən danış; bu, səhv sayılmır.');
    }, 120);
    const app = AppState.addEventListener('change', state => {
      if (state !== 'active' && turn.phase !== 'idle') fail('Danışıq dayandırıldı. Hazır olanda yenidən danış.');
    });
    return () => {
      alive.current = false; candidate.current = null; invalidate(); turn.cancel();
      clearInterval(timer); app.remove(); subscriptions.forEach(s => s.remove()); abort(); handlers.current.onBusyChange(false);
    };
  }, [engine, turn]);
  const cancel = useCallback(() => {
    generation.current++; audioUri.current = ''; audioStart.current = 0; pending.current = false; candidate.current = null; setDraft(null); setReviewText('');
    if (turn.phase !== 'idle') { closing.current = true; turn.cancel(); try { engine?.abort(); } catch { closing.current = false; } }
    setPhase('idle'); setLevel(0); setMessage('');
  }, [engine, turn]);
  useEffect(() => { if (!suspended) return; const timer = setTimeout(cancel, 0); return () => clearTimeout(timer); }, [suspended, cancel]);
  const start = useCallback(async (network = false) => {
    if (!engine) { setMessage('Səs tanıma Expo Go-da açılmır. Bu funksiya üçün ayrıca BirTalk tətbiqi lazımdır.'); return; }
    if (pending.current || turn.phase !== 'idle' || handlers.current.suspended) return;
    if (closing.current) { setMessage('Mikrofon bağlanır. Bir an sonra yenidən toxun.'); return; }
    const useNetwork = network || networkAllowed.current;
    const request = ++generation.current;
    pending.current = true; audioUri.current = ''; audioStart.current = 0; audioGeneration.current = request; candidate.current = null; setDraft(null); setReviewText(''); setPhase('preparing'); setMessage(''); setPartial('');
    try {
      await Speech.stop();
      if (!alive.current || request !== generation.current) return;
      if (!engine.isRecognitionAvailable()) { setMessage('Telefonunda işlək səs tanıma xidməti tapılmadı. Cavabını yazaraq davam edə bilərsən.'); return; }
      const local = engine.supportsOnDeviceRecognition();
      if (!local && !useNetwork) { setNeedsNetwork(true); if (Platform.OS === 'android' && Number(Platform.Version) >= 33) setNeedsModel(true); setMessage('Bu telefonda internetlə səs tanımaya icazə lazımdır.'); return; }
      const permission = useNetwork ? await engine.requestPermissionsAsync() : await engine.requestMicrophonePermissionsAsync();
      if (!alive.current || request !== generation.current || handlers.current.suspended || AppState.currentState !== 'active') return;
      if (!permission.granted) { setMessage('Mikrofon icazəsi verilmədi. Telefon ayarlarında icazəni aç.'); return; }
      if (!engine.isRecognitionAvailable()) { setMessage('Telefonun səs tanıma xidməti hazır deyil. Yenidən cəhd et.'); return; }
      networkAllowed.current = useNetwork;
      turn.begin(Date.now()); setNeedsModel(false); setNeedsNetwork(false); setLevel(0); setPhase('listening');
      engine.start({ lang: 'en-US', interimResults: true, continuous: false, maxAlternatives: 1, requiresOnDeviceRecognition: !useNetwork, ...(engine.supportsRecording?.() ? { recordingOptions: { persist: true } } : {}), volumeChangeEventOptions: { enabled: true, intervalMillis: 120 } });
    } catch { if (!alive.current || request !== generation.current) return; turn.cancel(); try { engine.abort(); } catch { /* Native service may already be closed. */ } if (alive.current) setMessage('Səs tanıma açılmadı. Yenidən cəhd et.'); }
    finally {
      if (request === generation.current) { pending.current = false; if (alive.current && turn.phase === 'idle') setPhase('idle'); }
    }
  }, [engine, turn]);
  useEffect(() => { if (!autoStart) return; const timer = setTimeout(() => void start(), 0); return () => clearTimeout(timer); }, [autoStart, start]);
  const stop = () => {
    if (turn.phase !== 'listening') return;
    turn.processing(Date.now()); setPhase('processing');
    try { engine?.stop(); } catch { cancel(); setMessage('Səs alınmadı. Yenidən cəhd et.'); }
  };
  const confirm = (text = reviewText) => {
    const original = candidate.current;
    if (!alive.current || !original || handlers.current.suspended || AppState.currentState !== 'active') return;
    if (!text.trim()) { setMessage('Yoxlamaq üçün əvvəl cavabını yaz və ya yenidən danış.'); return; }
    // Disarm synchronously: a rapid second tap cannot submit the same answer twice.
    candidate.current = null;
    const answer = { ...original, text: text.trim(), edited: text.trim() !== original.text.trim() };
    const result = handlers.current.onFinal(answer);
    if (result) { candidate.current = original; setMessage(result); return; }
    setDraft(null); setReviewText(''); setMessage(''); setPhase('idle');
  };
  const beginTyping = () => {
    cancel();
    const typed = { text: '', token: `typed:${Date.now()}:${generation.current}`, edited: true };
    candidate.current = typed; setDraft(typed); setPhase('review');
  };
  const downloadModel = async () => {
    if (!engine || Platform.OS !== 'android' || !(Number(Platform.Version) >= 33) || pending.current || candidate.current || handlers.current.suspended || turn.phase !== 'idle') return;
    const request = ++generation.current; pending.current = true; setPhase('preparing'); setMessage('');
    try {
      const result = await engine.androidTriggerOfflineModelDownload({ locale: 'en-US' });
      if (!alive.current || request !== generation.current) return;
      setMessage(result.status === 'download_success' ? 'İngilis dili modeli hazırdır. Mikrofona toxunub yenidən danış.' : 'Telefonun model yükləməsini tamamla, sonra mikrofona toxun.');
      if (result.status === 'download_success') setNeedsModel(false);
    } catch { if (alive.current && request === generation.current) setMessage('Model yüklənmədi. İnternet bağlantısını və telefonun səs tanıma ayarlarını yoxla.'); }
    finally { if (request === generation.current) { pending.current = false; if (alive.current) setPhase('idle'); } }
  };
  const editReviewText = (text: string) => {
    setReviewText(text);
    if (candidate.current) setDraft({ ...candidate.current, edited: text.trim() !== candidate.current.text.trim() });
  };
  return { phase, partial, message, level, needsNetwork, needsModel, draft, reviewText, setReviewText: editReviewText, confirm, beginTyping, downloadModel, busy, start, stop, cancel, available: Boolean(engine) };
}
