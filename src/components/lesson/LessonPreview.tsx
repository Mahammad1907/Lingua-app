/** Development-only showroom. Uses the real lesson components, never records progress or rewards. */
import { useEffect, useState, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { feedbackCopy } from '../../utils/lessonFeedbackCopy';
import LessonArtworkGallery from './LessonArtworkGallery';
import ApprovedLessonScene from './ApprovedLessonScene';
import { b1Packet } from '../../data/b1Course';
import type { PacketCard } from '../../data/b1PacketTypes';
import { assessPacketAnswer, type PacketVerdict } from '../../utils/packetAnswer';
import { assessMessages, type MessageResults } from '../../utils/messageTask';
import { contentScene, objectImage } from '../../utils/lessonContentAssets';
import { LessonButton, LessonIcon, SelectionMark, ink } from './ApprovedLessonSurface';
import FixedLessonViewport from './FixedLessonViewport';
import FirstLessonWelcome from './FirstLessonWelcome';
import LessonTeaching from './LessonTeaching';
import LessonResult from './LessonResult';
import LessonFeedback from './LessonFeedback';
import LessonSheet from './LessonSheet';
import LessonHelpSheet from './LessonHelpSheet';
import LessonReportSheet, { ReportAction } from './LessonReportSheet';
import LessonProgressBar from './ApprovedLessonProgressBar';
import LessonAudioWave from './LessonAudioWave';
import LessonMascot from './LessonMascot';
import HoldVoiceInput from './HoldVoiceInput';
import TwoMessageInput from './TwoMessageInput';
import ObjectWordCard from './ObjectWordCard';
import { LessonVocabularyProvider } from './LessonVocabularyText';
const listenChoice = b1Packet[0].cards.find(c => c.kind === 'task' && c.audio && c.options)!;
const listenWrite = b1Packet[0].cards.find(c => c.kind === 'task' && c.audio && !c.options)!;
const names = ['Dərsə giriş', 'Öyrətmə', 'Yazı tapşırığı', 'Dinlə və seç', 'Dinlə və yaz', 'Səslə cavab ver', 'İki mesaj yaz', 'Yeni söz', 'Dərsin nəticəsi'];
const messages: NonNullable<PacketCard['messages']> = [
  { id: 'opening', label: 'Görüşün əvvəlində', placeholder: 'Salamını yaz', rule: { answers: ['Hello!', 'Hi!'], goals: ['greet'] } },
  { id: 'closing', label: 'Görüşün sonunda', placeholder: 'Sağollaşmanı yaz', rule: { answers: ['Bye!', 'Goodbye!'], goals: ['farewell'] } },
];
const messageCard: PacketCard = { id: 'preview', number: 1, title: 'İki mesaj yaz', kind: 'task', body: '', source: 'Bu söhbətdə verilmiş vizual nümunə; kursa əlavə edilməyib.', messages };
export default function LessonPreview() {
  if (!__DEV__) return null;
  return <LessonVocabularyProvider><PreviewBody /></LessonVocabularyProvider>;
}
function PreviewBody() {
  const router = useRouter(), insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0), [picker, setPicker] = useState(false), [answer, setAnswer] = useState('');
  const [values, setValues] = useState<Record<string, string>>({}), [fields, setFields] = useState<MessageResults>({});
  const [feedback, setFeedback] = useState<PacketVerdict | null>(null), [feedbackOpen, setFeedbackOpen] = useState(false);
  const [help, setHelp] = useState(false), [helpOpen, setHelpOpen] = useState(false), [example, setExample] = useState(false), [text, setText] = useState(false);
  const [gallery, setGallery] = useState(false), [heard, setHeard] = useState(false), [audioError, setAudioError] = useState('');
  const request = useRef(0);
  const [report, setReport] = useState(false), [playing, setPlaying] = useState(false), [busy, setBusy] = useState(false);
  useEffect(() => { const token = request; return () => { token.current++; void Speech.stop(); }; }, []);
  const reset = (next: number) => { request.current++; void Speech.stop(); setHeard(false); setAudioError(''); setPlaying(false); setIndex(next); setAnswer(''); setValues({}); setFields({}); setFeedback(null); setFeedbackOpen(false); setHelp(false); setHelpOpen(false); setExample(false); setText(false); setPicker(false); };
  const speak = async (value: string, slow = false, listenTask = false) => {
    const token = ++request.current;
    setAudioError('');
    try {
      await Speech.stop(); if (token !== request.current) return;
      setPlaying(true); Speech.speak(value, { language: 'en-GB', rate: slow ? .45 : .75,
        onDone: () => { if (token === request.current) { setPlaying(false); if (listenTask) setHeard(true); } },
        onStopped: () => { if (token === request.current) setPlaying(false); },
        onError: () => { if (token === request.current) { setPlaying(false); setAudioError('Səs açılmadı. Yenidən dinlə və ya mətnlə davam et.'); } },
      });
    } catch { if (token === request.current) { setPlaying(false); setAudioError('Səs açılmadı. Yenidən cəhd et.'); } }
  };
  const showVerdict = (verdict: PacketVerdict) => { setFeedback(verdict); setFeedbackOpen(true); };
  const check = () => {
    if (index === 6) { const result = assessMessages(messageCard, values); setFields(result.fields); showVerdict(result.verdict); }
    else showVerdict(assessPacketAnswer(answer, index === 3 ? listenChoice.rule! : index === 4 ? listenWrite.rule! : { answers: ['Hello!', 'Hi!'], goals: ['greet'] }));
  };
  const audio = [3, 4, 5].includes(index), task = [2, 3, 4, 5, 6].includes(index);
  const audioText = index === 4 ? listenWrite.audio! : listenChoice.audio!;
  const promptReady = !audio || heard || text;
  const locked = Boolean(feedback && feedback.status !== 'unknown');
  const content = index === 0 ? <FirstLessonWelcome title={b1Packet[0].title} onStart={() => reset(1)} bottomInset={insets.bottom} /> : index === 1 ? <LessonTeaching card={b1Packet[0].cards.find(c => c.kind === 'teach')!} packet={b1Packet[0]} onSpeak={speak} /> : index === 7 ? <ObjectWordCard entry={{ kind: 'object', word: 'apple', translation: 'alma', image: objectImage('apple')!, example: 'This is an apple.', exampleAz: 'Bu, almadır.', structureTaught: true, pronunciation: { ipa: '/ˈæp.əl/', source: 'https://dictionary.cambridge.org/pronunciation/english/apple', checkedAt: '2026-11-11', locale: 'en-GB' } }} onSpeak={speak} onPractice={() => reset(2)} /> : index === 8 ? <LessonResult title={b1Packet[0].title} goal={b1Packet[0].goal} done={false} missing={0} summary={{ independent: 6, assisted: 2, wrong: 1, unverified: 1 }} evidence={{ written: 6, spoken: 2, listeningIndependent: 2, listeningAssisted: 1, textHelp: 1, technicalText: 0 }} receipt="" error="" onDetails={() => setPicker(true)} /> : <>
    <Text style={s.title}>{index === 2 ? 'Qısa salam yaz' : names[index]}</Text>
    <Text style={s.note}>{index === 6 ? 'Görüşün əvvəlində salam, sonunda isə sağollaşma yaz.' : index === 2 ? 'Tanışınla qarşılaşdın. Ona ingiliscə salam yaz.' : index === 5 ? 'Salama səslə cavab ver.' : 'Səsi dinlə və tapşırığı tamamla.'}</Text>
    {audio ? <View style={s.audio}>{index === 5 ? <LessonMascot height={55} pose="listening" style={{ width: 40 }} /> : null}<Pressable accessibilityRole="button" accessibilityLabel="Səsi dinlə" onPress={() => void speak(audioText, false, true)} style={s.play}><LessonIcon name="play" color="#FFF" /></Pressable><View style={{ flex: 1 }}><LessonAudioWave playing={playing} /></View><Pressable accessibilityRole="button" onPress={() => void speak(audioText, true, true)} style={s.slow}><LessonIcon name="turtle" /><Text style={s.small}>Yavaş dinlə</Text></Pressable></View> : null}
    <Pressable accessibilityRole="button" onPress={() => setHelpOpen(true)} style={s.hint}><LessonIcon name="hint" /><Text style={s.link}>İpucu</Text></Pressable>
    {text ? <Text style={s.note}>{audioText}</Text> : null}
    {audioError ? <Text accessibilityLiveRegion="polite" style={s.note}>ⓘ {audioError}</Text> : null}
    {index === 2 ? <ApprovedLessonScene ids={['toy-entrance']} height={135} /> : null}
    {index === 6 ? <TwoMessageInput fields={messages} values={values} results={locked ? fields : {}} scenes={[contentScene('toy-entrance')!, contentScene('toy-farewell')!]} onChange={(id, value) => setValues(old => ({ ...old, [id]: value }))} disabled={locked} /> : index === 5 && !promptReady ? <Text style={s.note}>Danışmazdan əvvəl səsi dinlə.</Text> : index === 5 ? <HoldVoiceInput key={index} suspended={helpOpen || picker || report || feedbackOpen} onBusyChange={setBusy} onFinal={spoken => { setAnswer(spoken.text); const verdict=assessPacketAnswer(spoken.text, { answers: ['Hello!', 'Hi!'], goals: ['greet'] }, true); showVerdict(verdict); return null; }} onUnverifiedRecording={() => showVerdict({ status: 'unknown', criteria: [], message: 'Səsin yazıldı, amma yoxlanmadı.' })} /> : index === 3 ? <View style={s.choices}>{listenChoice.options!.map(option => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ selected: answer === option }} disabled={locked || !promptReady} onPress={() => setAnswer(option)} style={[s.option, answer === option && { borderColor: ink.violet }]}><SelectionMark selected={answer === option} correct={Boolean(locked && feedback?.status === 'correct' && answer === option)} /><Text style={s.optionText}>{option}</Text></Pressable>)}</View> : <TextInput accessibilityLabel="Cavabını ingiliscə yaz" value={answer} onChangeText={setAnswer} editable={!locked && promptReady} placeholder="Cavabını yaz" placeholderTextColor={ink.muted} style={s.input} />}
  </>;
  return <View style={[s.screen, { paddingTop: insets.top }]}><LinearGradient colors={index === 0 ? ['#EEE0FC', '#F5ECFF', '#EAD9FA'] : ['#F5EEFF', '#EFE3FC']} style={StyleSheet.absoluteFill} /><Stack.Screen options={{ headerShown: false }} />
    <View style={[s.header, index === 0 && { paddingLeft: 36, paddingRight: 28, gap: 14 }]}><Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={() => router.back()} style={[s.round, index === 0 && { width: 32, height: 32, borderRadius: 16 }]}><LessonIcon name="back" color={index === 0 ? '#290A2E' : undefined} /></Pressable><Text style={[s.name, index === 0 && { fontSize: 16 }]}>{index === 0 ? 'Dərs 1' : 'Nümunə'}</Text>{index === 0 ? <View style={{ width: 1, height: 25, backgroundColor: ink.violet }} /> : null}<LessonProgressBar key={index} value={index / (names.length - 1)} /><Pressable accessibilityRole="button" accessibilityLabel="Ekran seç" disabled={busy} onPress={() => setPicker(true)} style={[s.round, index === 0 && { width: 32, minHeight: 44, backgroundColor: 'transparent' }]}><Text style={[s.name, index === 0 && { fontSize: 29 }]}>⋮</Text></Pressable></View>
    {index !== 0 ? <Pressable accessibilityRole="button" disabled={busy} onPress={() => setPicker(true)} style={s.notice}><Text style={s.small}>Sınaq: {names[index]} · irəliləyişə yazılmır ▾</Text></Pressable> : null}
    {index === 0 ? content : <FixedLessonViewport fill={index === 3} contentContainerStyle={s.content}>{content}</FixedLessonViewport>}
    {index !== 0 ? <View style={[s.footer, { paddingBottom: Math.max(12, insets.bottom) }]}>{audio && index !== 5 ? <Pressable accessibilityRole="button" onPress={() => setHelpOpen(true)} style={s.hint}><Text style={s.link}>İndi dinləyə bilmirəm</Text></Pressable> : null}{index === 7 ? null : index === 5 ? <Pressable accessibilityRole="button" disabled={busy} onPress={() => reset(6)} style={s.hint}><Text style={s.link}>Keç</Text></Pressable> : <LessonButton label={index === 0 ? 'Dərsə başla' : task && !feedback ? 'Yoxla' : 'Davam et'} disabled={task && !feedback && (!promptReady || (index === 6 ? messages.some(f => !values[f.id]?.trim()) : !answer.trim()))} tone={feedback ? feedback.status === 'correct' ? 'correct' : feedback.status === 'unknown' ? 'primary' : 'wrong' : 'primary'} onPress={task && !feedback ? check : () => reset((index + 1) % names.length)} />}</View> : null}
    <LessonSheet visible={picker} onClose={() => setPicker(false)} title="Ekran nümunələri"><Text style={s.note}>Bu bölmə vizual və cihaz sınağı üçündür. Kurs məzmununa əlavə edilmir, XP və lüğət dəyişmir.</Text>{names.map((name, i) => <Pressable key={name} accessibilityRole="button" onPress={() => reset(i)} style={s.option}><Text style={s.optionText}>{i + 1}. {name}</Text></Pressable>)}<Pressable accessibilityRole="button" onPress={() => { setPicker(false); setGallery(true); }} style={s.option}><Text style={s.optionText}>Bütün vizuallara bax</Text></Pressable><ReportAction onPress={() => { setPicker(false); setReport(true); }} /></LessonSheet>
    <LessonHelpSheet visible={helpOpen} onClose={() => setHelpOpen(false)} audio={audio} speaking={index === 5} hint={index === 6 ? 'Birinci sahədə görüşü başlayan salamı yaz. İkinci sahədə ayrılarkən dediyin sağollaşmanı yaz.' : 'Söhbəti salamla başla.'} revealed={help} onHint={() => setHelp(true)} onText={() => { setText(true); setHelpOpen(false); }} example={index === 6 ? 'Hello! / Bye!' : undefined} onExample={() => setExample(true)} exampleRevealed={example} />
    {feedback ? <LessonFeedback verdict={feedback} answer={index === 6 ? messages.map(f => `${f.label}: ${values[f.id]}`).join('\n') : answer} accepted={index === 6 ? ['Hello! / Hi!', 'Bye! / Goodbye!'] : index === 3 ? listenChoice.rule!.answers : index === 4 ? listenWrite.rule!.answers : ['Hello!', 'Hi!']} explanation={index === 6 || feedback.status === 'correct' || feedback.status === 'unknown' ? feedback.message : feedbackCopy(index === 3 ? listenChoice : index === 4 ? listenWrite : { ...messageCard, messages: undefined, rule: { answers: ['Hello!', 'Hi!'], goals: ['greet'] } }, answer).reason} shortRule="Görüşə başlayanda salam veririk." example="Qonşunla qarşılaşırsan: Hello!" open={feedbackOpen} onClose={() => setFeedbackOpen(false)} onContinue={() => reset((index + 1) % names.length)} onRetry={index === 5 ? () => { setFeedback(null); setFeedbackOpen(false); } : undefined} onReport={() => { setFeedbackOpen(false); setReport(true); }} /> : null}
    <LessonArtworkGallery visible={gallery} onClose={() => setGallery(false)} />
    <LessonReportSheet visible={report} onClose={() => setReport(false)} context={{ lessonId: 'preview', cardId: names[index], answer, verdict: feedback?.status }} />
  </View>;
}
const s = StyleSheet.create({ screen: { flex: 1, backgroundColor: ink.bg }, header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 10 }, round: { width: 40, height: 40, borderRadius: 20, backgroundColor: ink.soft, justifyContent: 'center', alignItems: 'center' }, name: { color: ink.text, fontSize: 17, fontWeight: '800' }, notice: { alignSelf: 'center', paddingHorizontal: 12, minHeight: 32, justifyContent: 'center' }, content: { paddingHorizontal: 20, paddingVertical: 12, gap: 12 }, title: { color: ink.text, fontSize: 28, lineHeight: 34, fontWeight: '800' }, note: { color: ink.muted, fontSize: 16, lineHeight: 23 }, small: { color: ink.muted, fontSize: 12, lineHeight: 18 }, link: { color: ink.violet, fontSize: 15, fontWeight: '700' }, footer: { paddingHorizontal: 20, paddingTop: 10, gap: 10 }, hint: { alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, borderRadius: 22, borderWidth: 1, borderColor: ink.border, paddingHorizontal: 14, backgroundColor: ink.soft }, audio: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 22, padding: 12, borderWidth: 1, borderColor: ink.border }, play: { width: 46, height: 46, borderRadius: 23, backgroundColor: ink.violet, alignItems: 'center', justifyContent: 'center' }, slow: { minWidth: 65, alignItems: 'center', gap: 5 }, choices: { flex: 1, justifyContent: 'flex-end', gap: 10 }, option: { minHeight: 54, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: ink.card, borderWidth: 1, borderColor: ink.border, borderRadius: 18 }, optionText: { color: ink.text, fontSize: 17, fontWeight: '600' }, input: { minHeight: 54, padding: 14, borderWidth: 1, borderColor: ink.border, borderRadius: 18, color: ink.text, fontSize: 17, backgroundColor: ink.card } });
