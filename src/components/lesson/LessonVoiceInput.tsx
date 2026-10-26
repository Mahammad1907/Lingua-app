import { useEffect, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLessonSpeech } from '../../hooks/useLessonSpeech';
import { loadRecordedAudio } from '../../utils/recordedAudio';
import type { SpokenAnswer } from '../../utils/speechTurn';
import ParticleWave from './ParticleWave';
import VoicePracticeRecorder from './VoicePracticeRecorder';
import VoiceCaptureBar, { compactVoiceStyle as compactUI } from './VoiceCaptureBar';
import { LessonButton, LessonIcon, ink } from './LessonSurface';

export default function LessonVoiceInput({ onFinal, onBusyChange, suspended, disabled = false, autoStart = false, compact = false, onClose }: { onClose?: () => void; compact?: boolean;
  onFinal: (answer: SpokenAnswer) => string | null; onBusyChange: (busy: boolean) => void; suspended?: boolean; disabled?: boolean; autoStart?: boolean;
}) {
  const speech = useLessonSpeech({ onFinal, onBusyChange, suspended, autoStart });
  const player = useAudioPlayer(null), playback = useAudioPlayerStatus(player);
  const [playError, setPlayError] = useState('');
  const listening = speech.phase === 'listening', reviewing = speech.phase === 'review';
  const pending = speech.phase === 'processing' || speech.phase === 'preparing';
  useEffect(() => {
    if (loadRecordedAudio(player, speech.draft?.uri) !== 'error') return;
    const timer = setTimeout(() => setPlayError('Səsli yazı açılmadı. Yenidən danışa bilərsən.'), 0);
    return () => clearTimeout(timer);
  }, [player, speech.draft?.uri]);
  useEffect(() => () => { try { player.pause(); } catch { /* Native player may already be released. */ } }, [player]);
  const pause = () => { try { player.pause(); } catch { setPlayError('Səs dayandırıldı. Yenidən danışa bilərsən.'); } };
  const replay = async () => { try { if (playback.playing) player.pause(); else { await player.seekTo(0); player.play(); } } catch { setPlayError('Səsli yazı açılmadı. Yenidən danışa bilərsən.'); } };
  const start = () => { pause(); setPlayError(''); void speech.start(); };
  const clear = () => { pause(); setPlayError(''); speech.cancel(); };
  if (compact && !speech.available && !reviewing) return <View style={{ gap: 5 }}><VoicePracticeRecorder compact suspended={suspended} onBusyChange={onBusyChange} onClose={onClose} />{!onClose ? <Pressable accessibilityRole="button" disabled={disabled} onPress={speech.beginTyping}><Text style={s.link}>Yazılı məşq et</Text></Pressable> : null}</View>;
  if (compact) return <VoiceCaptureBar active={listening ? speech.level > .04 : playback.playing} recording={listening} level={listening ? speech.level : undefined} busy={disabled || pending} label={listening ? 'Dayandır' : pending ? 'Hazırlanır…' : reviewing ? 'Yenidən danış' : 'Danışmaq üçün toxun'} onMic={() => listening ? speech.stop() : start()} onClose={onClose}>
    {reviewing && speech.draft ? <>
      <TextInput accessibilityLabel="Tanınan cavabı yoxla və düzəlt" value={speech.reviewText} onChangeText={speech.setReviewText} editable={!disabled} autoCorrect={false} autoCapitalize="none" multiline maxLength={500} style={[s.reviewInput, { minHeight: 44, maxHeight: 70, padding: 8 }]} />
      <Text style={compactUI.note}>{speech.draft.edited ? 'Yazılı cavab kimi yoxlanır.' : 'Eşidilən mətni yoxla.'}</Text>
      <View style={compactUI.actions}>{speech.draft.uri ? <Pressable accessibilityRole="button" disabled={disabled} onPress={() => void replay()} style={compactUI.action}><Text style={compactUI.actionText}>Dinlə</Text></Pressable> : null}<Pressable accessibilityRole="button" disabled={disabled} onPress={clear} style={compactUI.action}><Text style={compactUI.actionText}>Sil</Text></Pressable><Pressable accessibilityRole="button" disabled={disabled || !speech.reviewText.trim()} onPress={() => { pause(); speech.confirm(); }} style={compactUI.action}><Text style={compactUI.actionText}>Göndər</Text></Pressable></View>
    </> : speech.partial ? <Text style={compactUI.note}>{speech.partial}</Text> : null}
    {speech.busy && pending ? <Pressable accessibilityRole="button" onPress={clear} style={compactUI.action}><Text style={compactUI.actionText}>Ləğv et</Text></Pressable> : null}
    {playError || speech.message ? <Text accessibilityLiveRegion="polite" style={compactUI.note}>{playError || speech.message}</Text> : null}
    {speech.needsModel && !speech.busy ? <Pressable accessibilityRole="button" disabled={disabled} onPress={() => void speech.downloadModel()}><Text style={s.link}>İngilis dili səs modelini yüklə</Text></Pressable> : null}
    {speech.needsNetwork && !speech.busy ? <Pressable accessibilityRole="button" disabled={disabled} onPress={() => void speech.start(true)}><Text style={s.link}>İnternetlə səs tanımanı sına</Text><Text style={compactUI.note}>Səs telefonun sistem xidməti tərəfindən internetdə emal oluna bilər.</Text></Pressable> : null}
  </VoiceCaptureBar>;
  return <View style={s.input}>
    {!speech.available && !reviewing ? <><VoicePracticeRecorder compact={autoStart} suspended={suspended} onBusyChange={onBusyChange} /><Pressable accessibilityRole="button" disabled={disabled} onPress={speech.beginTyping}><Text style={s.link}>Yazılı məşq et</Text></Pressable></> : <>
      <View style={[s.hero, autoStart && s.compact]}>
        <Pressable accessibilityRole="button" accessibilityLabel={listening ? 'Danışığı bitir' : reviewing ? 'Yenidən danış' : 'Səsli cavab ver'} accessibilityState={{ disabled: disabled || pending }} disabled={disabled || pending} onPress={() => listening ? speech.stop() : start()} style={[s.mic, autoStart && s.smallMic, listening && s.live]}><LessonIcon name="mic" color={listening ? ink.orange : '#F3EBFF'} size={autoStart ? 25 : 40} /></Pressable>
        <ParticleWave active={listening ? speech.level > .04 : playback.playing} level={listening ? speech.level : undefined} height={autoStart ? 58 : 86} />
        <Text accessibilityLiveRegion="polite" style={s.label}>{listening ? 'Səsin yazılır…' : speech.phase === 'processing' ? 'Səs mətnə çevrilir…' : speech.phase === 'preparing' ? 'Hazırlanır…' : reviewing ? speech.draft?.edited ? 'Yazılı cavabın' : 'Sistem belə eşitdi' : 'Danışmaq üçün mikrofona toxun'}</Text>
      </View>
      {listening ? <Pressable accessibilityRole="button" onPress={speech.stop} style={s.stop}><Text style={s.stopText}>■ Qeydi dayandır</Text></Pressable> : null}
      {reviewing && speech.draft ? <>
        <TextInput accessibilityLabel="Tanınan cavabı yoxla və düzəlt" value={speech.reviewText} onChangeText={speech.setReviewText} editable={!disabled} autoCorrect={false} autoCapitalize="none" multiline maxLength={500} style={s.reviewInput} />
        <Text style={s.note}>{speech.draft.edited ? 'Bu cavab yazılı cavab kimi yoxlanacaq.' : 'Səhv eşidilibsə, mətni düzəlt və yoxla.'}</Text>
        <View style={s.controls}>{speech.draft.uri ? <Pressable accessibilityRole="button" disabled={disabled} onPress={() => void replay()} style={s.control}><LessonIcon name={playback.playing ? 'pause' : 'play'} /><Text style={s.controlText}>Dinlə</Text></Pressable> : null}<Pressable accessibilityRole="button" disabled={disabled} onPress={clear} style={s.control}><Text style={s.controlText}>Sil</Text></Pressable><Pressable accessibilityRole="button" disabled={disabled} onPress={start} style={s.control}><Text style={s.controlText}>Yenidən danış</Text></Pressable></View>
        <LessonButton label="Göndər" disabled={disabled || !speech.reviewText.trim()} onPress={() => { pause(); speech.confirm(); }} />
      </> : speech.partial ? <Text style={s.transcript}>{speech.partial}</Text> : null}
      {speech.busy && !reviewing ? <Pressable accessibilityRole="button" accessibilityLabel="Səsli cavabı ləğv et" onPress={clear}><Text style={s.link}>Ləğv et</Text></Pressable> : null}
    </>}
    {playError || speech.message ? <Text accessibilityLiveRegion="polite" style={s.note}>{playError || speech.message}</Text> : null}
    {speech.message && !speech.busy ? <Pressable accessibilityRole="button" disabled={disabled} onPress={speech.beginTyping}><Text style={s.link}>Cavabı yazaraq davam et</Text></Pressable> : null}
    {speech.needsModel && !speech.busy ? <Pressable accessibilityRole="button" disabled={disabled} onPress={() => void speech.downloadModel()}><Text style={s.link}>İngilis dili səs modelini yüklə</Text></Pressable> : null}
    {speech.needsNetwork && !speech.busy ? <Pressable accessibilityRole="button" disabled={disabled} onPress={() => void speech.start(true)}><Text style={s.link}>Sistemin internetlə tanımasını sına</Text><Text style={s.note}>Bu seçimlə səs telefonunun sistem xidməti tərəfindən internetdə emal oluna bilər.</Text></Pressable> : null}
  </View>;
}
const s = StyleSheet.create({ input: { gap: 10, borderWidth: 1, borderColor: '#605086', borderRadius: 24, padding: 18, backgroundColor: '#13182E' }, hero: { alignItems: 'center', gap: 6 }, compact: { gap: 4 }, mic: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#6236B0', borderWidth: 2, borderColor: '#B58BFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#9359FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: .25, shadowRadius: 16 }, smallMic: { width: 48, height: 48, borderRadius: 24 }, live: { backgroundColor: '#553252', borderColor: ink.orange }, label: { fontSize: 15, lineHeight: 21, color: ink.text, fontWeight: '700', textAlign: 'center' }, note: { color: ink.muted, fontSize: 12, lineHeight: 18 }, transcript: { color: ink.text, fontSize: 16, lineHeight: 22, paddingVertical: 4 }, reviewInput: { color: ink.text, fontSize: 16, lineHeight: 23, minHeight: 55, maxHeight: 110, borderRadius: 15, borderWidth: 1, borderColor: '#8B77C0', backgroundColor: '#23223C', padding: 12 }, stop: { alignSelf: 'center', minHeight: 48, justifyContent: 'center', paddingHorizontal: 18, borderRadius: 24, backgroundColor: '#B63C4B' }, stopText: { color: '#FFF', fontWeight: '700' }, controls: { flexDirection: 'row', gap: 8 }, control: { flex: 1, minHeight: 44, borderRadius: 13, backgroundColor: '#29233F', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, padding: 7 }, controlText: { color: ink.violet, fontSize: 12 }, link: { color: ink.violet, paddingVertical: 10, fontSize: 12, lineHeight: 18, textAlign: 'center' } });
