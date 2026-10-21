import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getSpeechEngine } from '../utils/speechEngine';
import { SpeechTurn, type SpokenAnswer } from '../utils/speechTurn';

export function useLessonSpeech({ onFinal, onBusyChange, suspended = false, autoStart = false }: {
  onFinal: (answer: SpokenAnswer) => string | null;
  onBusyChange: (busy: boolean) => void;
  suspended?: boolean; autoStart?: boolean;
}) {
  const [engine] = useState(getSpeechEngine);
  const [turn] = useState(() => new SpeechTurn());
  const [phase, setPhase] = useState<'idle' | 'preparing' | 'listening' | 'processing'>('idle');
  const [partial, setPartial] = useState(''), [message, setMessage] = useState('');
  const [level, setLevel] = useState(0), [needsNetwork, setNeedsNetwork] = useState(false);
  const alive = useRef(false), pending = useRef(false), closing = useRef(false), generation = useRef(0);
  const handlers = useRef({ onFinal, onBusyChange, suspended });
  useEffect(() => { handlers.current = { onFinal, onBusyChange, suspended }; }, [onFinal, onBusyChange, suspended]);
  const busy = phase !== 'idle';
  useEffect(() => { onBusyChange(busy); }, [onBusyChange, busy]);
  useEffect(() => {
    alive.current = true;
    const invalidate = () => { generation.current += 1; pending.current = false; };
    const abort = () => { try { engine?.abort(); } catch { closing.current = false; } };
    const fail = (text: string) => {
      turn.cancel(); generation.current++; pending.current = false;
      closing.current = true; abort();
      if (alive.current) { setPhase('idle'); setLevel(0); setMessage(text); }
    };
    const finish = () => {
      closing.current = false;
      if (!alive.current || turn.phase === 'idle') return;
      if (handlers.current.suspended) { turn.cancel(); setPhase('idle'); setLevel(0); return; }
      const result = turn.finish(); setPhase('idle'); setLevel(0);
      setMessage(result ? handlers.current.onFinal(result) || '' : 'Səs dəqiq tanınmadı. Yenidən danış; bu, səhv sayılmır.');
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
      engine.addListener('end', finish),
      engine.addListener('nomatch', () => { if (turn.phase !== 'idle') fail('Səs dəqiq eşidilmədi. Yenidən danış; bu, səhv sayılmır.'); }),
      engine.addListener('error', event => {
        if (turn.phase === 'idle') return;
        if (event.error === 'language-not-supported' || event.error === 'service-not-allowed') setNeedsNetwork(true);
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
      alive.current = false; invalidate(); turn.cancel();
      clearInterval(timer); app.remove(); subscriptions.forEach(s => s.remove()); abort(); handlers.current.onBusyChange(false);
    };
  }, [engine, turn]);
  const cancel = useCallback(() => {
    generation.current++; pending.current = false;
    if (turn.phase !== 'idle') { closing.current = true; turn.cancel(); try { engine?.abort(); } catch { closing.current = false; } }
    setPhase('idle'); setLevel(0); setMessage('');
  }, [engine, turn]);
  useEffect(() => { if (!suspended) return; const timer = setTimeout(cancel, 0); return () => clearTimeout(timer); }, [suspended, cancel]);
  const start = useCallback(async (network = false) => {
    if (!engine) { setMessage('Səs tanıma Expo Go-da açılmır. Bu funksiya üçün ayrıca BirTalk tətbiqi lazımdır.'); return; }
    if (pending.current || turn.phase !== 'idle' || handlers.current.suspended) return;
    if (closing.current) { setMessage('Mikrofon bağlanır. Bir an sonra yenidən toxun.'); return; }
    const request = ++generation.current;
    pending.current = true; setPhase('preparing'); setMessage(''); setPartial('');
    try {
      await Speech.stop();
      if (!alive.current || request !== generation.current) return;
      const local = engine.supportsOnDeviceRecognition();
      if (!local && !network) { setNeedsNetwork(true); setMessage('Bu telefonda internetlə səs tanımaya icazə lazımdır.'); return; }
      const permission = network ? await engine.requestPermissionsAsync() : await engine.requestMicrophonePermissionsAsync();
      if (!alive.current || request !== generation.current || handlers.current.suspended || AppState.currentState !== 'active') return;
      if (!permission.granted) { setMessage('Mikrofon icazəsi verilmədi. Telefon ayarlarında icazəni aç.'); return; }
      if (!engine.isRecognitionAvailable()) { setMessage('Telefonun səs tanıma xidməti hazır deyil. Yenidən cəhd et.'); return; }
      turn.begin(Date.now()); setLevel(0); setPhase('listening');
      engine.start({ lang: 'en-US', interimResults: true, continuous: false, maxAlternatives: 1, requiresOnDeviceRecognition: !network, volumeChangeEventOptions: { enabled: true, intervalMillis: 120 } });
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
  return { phase, partial, message, level, needsNetwork, busy, start, stop, cancel, available: Boolean(engine) };
}
