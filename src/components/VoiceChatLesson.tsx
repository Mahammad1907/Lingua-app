import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Stack } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VoiceTurn } from '../data/firstConversation';
import { RecordedVoice } from './VoiceMessageComposer';
import RecognizedVoiceComposer, { RecognizedVoice } from './RecognizedVoiceComposer';
import { checkSpokenAnswer } from '../utils/spokenAnswer';
import VoiceWave from './VoiceWave';
import { BirFoxPortrait } from './BirTalkArtwork';
import { lessonTheme as t } from '../constants/lessonTheme';

function OwnVoice({ voice, active, onPlay, disabled = false }: { voice: RecordedVoice; active: boolean; onPlay: () => void; disabled?: boolean }) {
  const player = useAudioPlayer({ uri: voice.uri });
  const status = useAudioPlayerStatus(player);
  useEffect(() => { if (!active || disabled) player.pause(); }, [active, disabled, player]);
  const toggle = async () => {
    try {
      await Speech.stop();
      onPlay();
      if (status.playing) player.pause();
      else { await player.seekTo(0); player.play(); }
    } catch { /* The saved audio remains replayable on the next attempt. */ }
  };
  return <TouchableOpacity disabled={disabled} onPress={() => void toggle()} style={[styles.bubble, styles.outgoing]}>
    <View style={styles.voiceRow}><Text style={styles.playIcon}>{status.playing ? 'Ⅱ' : '▶'}</Text><VoiceWave playing={status.playing} color={t.success} /></View>
    <Text style={styles.small}>{Math.max(1, Math.round(voice.duration))} san. · Sənin səsin</Text>
  </TouchableOpacity>;
}

export interface VoiceStats { correct: number; wrong: number; skipped: number }
export default function VoiceChatLesson({ turns, onFinish, onBack, initialName = '', onFirstAttempt }: {
  turns: VoiceTurn[]; onFinish: (stats: VoiceStats) => void; onBack: () => void; initialName?: string; onFirstAttempt?: (index: number, correct: boolean) => void;
}) {
  const insets = useSafeAreaInsets();
  const [sent, setSent] = useState<(RecognizedVoice | 'skipped')[]>([]);
  const [heard, setHeard] = useState(false);
  const [help, setHelp] = useState(false);
  const [active, setActive] = useState('');
  const [soundError, setSoundError] = useState('');
  const [name, setName] = useState(initialName);
  const [capturing, setCapturing] = useState(false);
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({});
  const judgedTurns = useRef(new Set<number>());
  const scroll = useRef<ScrollView>(null);
  const speechSequence = useRef(0);
  const [playing, setPlaying] = useState(-1);
  const finished = sent.length >= turns.length;
  const current = turns[sent.length];
  const stats = { correct: sent.filter((item, index) => item !== 'skipped' && firstTry[index] === true).length,
    wrong: sent.filter((item, index) => item !== 'skipped' && firstTry[index] === false).length,
    skipped: sent.filter((item) => item === 'skipped').length };

  useEffect(() => () => { speechSequence.current += 1; void Speech.stop(); }, []);
  const play = async (index: number, text: string) => {
    const request = ++speechSequence.current;
    try {
      if (playing === index && index >= 0) { await Speech.stop(); setPlaying(-1); return; }
      setActive(''); setPlaying(index); setSoundError(''); await Speech.stop();
      Speech.speak(text, { language: 'en-GB', rate: 0.75,
        onDone: () => { if (request !== speechSequence.current) return; setPlaying(-1); if (index === sent.length) setHeard(true); },
        onStopped: () => { if (request === speechSequence.current) setPlaying(-1); },
        onError: () => { if (request === speechSequence.current) { setPlaying(-1); setSoundError('Səs açılmadı. Telefonun səs rejimini yoxlayıb yenidən bas.'); } },
      });
    } catch { if (request === speechSequence.current) { setPlaying(-1); setSoundError('Səs açılmadı. Yenidən cəhd et.'); } }
  };
  const advance = (voice: RecognizedVoice | 'skipped') => {
    speechSequence.current += 1; void Speech.stop(); setPlaying(-1); setActive('');
    setSent((value) => value.length >= turns.length || (voice !== 'skipped' && value.some((item) => item !== 'skipped' && item.uri === voice.uri)) ? value : [...value, voice]);
    setHeard(false); setHelp(false);
  };
  return <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.back}><Text style={styles.backText}>←</Text></TouchableOpacity>
      <BirFoxPortrait size={42} />
      <View style={{ flex: 1 }}><Text style={styles.name}>BirFox</Text><Text style={styles.subtitle}>Səsli söhbət məşqi</Text></View>
      <Text style={styles.count}>{sent.length}/{turns.length}</Text>
    </View>
    <ScrollView ref={scroll} contentContainerStyle={styles.messages} keyboardShouldPersistTaps="handled" onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
      <Text style={styles.date}>İLK TANIŞLIQ</Text>
      {turns.slice(0, Math.min(sent.length + 1, turns.length)).map((turn, index) => {
        const voice = sent[index];
        return <View key={`voice-turn-${index}`}>
          <TouchableOpacity disabled={capturing} style={[styles.bubble, styles.incoming]} onPress={() => void play(index, turn.text)} accessibilityLabel="BirFox-un səsli mesajını dinlə">
            <Text style={styles.sender}>BirFox</Text><View style={styles.voiceRow}><Text style={styles.playIcon}>{playing === index ? 'Ⅱ' : '▶'}</Text><VoiceWave playing={playing === index} /></View>
            <Text style={styles.small}>Səsli mesaj · Dinlə</Text>
          </TouchableOpacity>
          {voice === 'skipped' ? <Text style={styles.small}>Bu danışıq tapşırığını keçdin. Səhv sayılmır.</Text> : voice ? <>
            <OwnVoice voice={voice} disabled={capturing} active={active === `you-${index}`} onPlay={() => { speechSequence.current += 1; setPlaying(-1); setActive(`you-${index}`); }} />
            <Text style={styles.transcript}>{voice.transcript}</Text>
          </> : null}
        </View>;
      })}
      {soundError ? <Text style={styles.error}>{soundError}</Text> : null}
      {!finished ? <>
        <Text style={styles.task}>{current.task}</Text>
        <TouchableOpacity onPress={() => setHelp((value) => !value)}><Text style={styles.link}>{help ? 'Mətni gizlət' : 'Mətni və mənasını göstər'}</Text></TouchableOpacity>
        {help ? <View style={styles.help}><Text style={styles.helpText}>{current.text}</Text><Text style={styles.small}>{current.meaning}</Text></View> : null}
        {current.intent === 'introduce' ? <View style={styles.help}>
          <Text style={styles.small}>Öz adını yaz ki, səsdə eşidilən təqdimatla müqayisə edək.</Text>
          <TextInput editable={!capturing} style={styles.nameInput} value={name} onChangeText={setName} maxLength={40} placeholder="Adın" placeholderTextColor={t.muted} accessibilityLabel="Öz adın" returnKeyType="done" />
        </View> : null}
      </> : <View style={styles.help}>
        <Text style={styles.helpText}>Danışıq məşqi tamamlandı.</Text>
        <Text style={styles.small}>İlk cəhddə uyğun: {stats.correct} · Yenidən məşq: {stats.wrong} · Keçildi: {stats.skipped}</Text>
        <Text style={styles.small}>Tanınan mətn bu bölmənin cavab qaydaları ilə yoxlanıb. Bu, tələffüz balı və sərbəst AI söhbəti deyil.</Text>
      </View>}
    </ScrollView>
    {!finished ? <>
      {!heard ? <Text style={styles.listenFirst}>Əvvəl BirFox-un son səsli mesajını dinlə.</Text>
        : current.intent === 'introduce' && !name.trim() ? <Text style={styles.listenFirst}>Əvvəl öz adını yaz.</Text>
        : <RecognizedVoiceComposer key={`composer-${sent.length}`} checkAnswer={(text) => checkSpokenAnswer(text, current.intent, name)}
          onBusyChange={setCapturing} onJudged={(correct) => { if (judgedTurns.current.has(sent.length)) return; judgedTurns.current.add(sent.length); onFirstAttempt?.(sent.length, correct); setFirstTry(value => ({ ...value, [sent.length]: correct })); }} onValid={advance} />}
      <TouchableOpacity style={styles.skip} onPress={() => advance('skipped')}><Text style={styles.link}>İndi danışa bilmirəm · Keç</Text></TouchableOpacity>
    </> : <TouchableOpacity style={styles.finish} onPress={() => { void Speech.stop(); onFinish(stats); }}><Text style={styles.finishText}>Nəticələrə bax</Text></TouchableOpacity>}
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.background },
  header: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 14, backgroundColor: t.background, borderBottomWidth: 1, borderBottomColor: t.border },
  back: { padding: 8 }, backText: { color: t.text, fontSize: 24 },
  nameInput: { backgroundColor: t.raised, borderWidth: 1, borderColor: t.border, borderRadius: 12, padding: 12, color: t.text, marginTop: 8 }, transcript: { color: t.muted, fontSize: 11, textAlign: 'right', marginBottom: 16 }, skip: { alignItems: 'center', paddingHorizontal: 16 },
  name: { color: t.text, fontSize: 18, fontWeight: '800' }, subtitle: { color: t.muted, fontSize: 11, marginTop: 3 }, count: { color: t.orange, fontSize: 12, fontWeight: '700' },
  messages: { padding: 18, paddingBottom: 20 }, date: { alignSelf: 'center', color: t.muted, backgroundColor: t.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, fontSize: 10, marginBottom: 20 },
  bubble: { width: '78%', padding: 14, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: t.border }, incoming: { backgroundColor: t.surface, alignSelf: 'flex-start', borderTopLeftRadius: 5 }, outgoing: { backgroundColor: t.successBg, borderColor: '#305C4C', alignSelf: 'flex-end', borderTopRightRadius: 5 },
  sender: { color: t.orange, fontSize: 11, fontWeight: '700', marginBottom: 8 }, voiceRow: { flexDirection: 'row', alignItems: 'center', gap: 14 }, playIcon: { color: t.text, fontSize: 20 },
  small: { color: t.muted, fontSize: 12, lineHeight: 19, marginTop: 7 }, taskRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: t.surface, borderRadius: 16, marginTop: 8 }, task: { flex: 1, color: t.text, fontSize: 13, lineHeight: 20 },
  link: { color: t.orange, fontSize: 12, fontWeight: '700', paddingVertical: 12 }, help: { backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, padding: 16, borderRadius: 16, marginVertical: 10 }, helpText: { color: t.text, fontSize: 15, lineHeight: 22 }, example: { color: t.orange, fontSize: 14, paddingTop: 12 },
  listenFirst: { color: t.muted, padding: 18, backgroundColor: t.surface, textAlign: 'center', fontSize: 12 }, disclosure: { color: t.muted, fontSize: 9, textAlign: 'center', padding: 10, backgroundColor: t.background }, error: { color: t.error, fontSize: 13, lineHeight: 19 },
  finish: { padding: 16, margin: 16, backgroundColor: t.orange, borderRadius: 16, alignItems: 'center' }, finishText: { color: '#241321', fontWeight: '800', fontSize: 15 },
});

