import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SceneArtwork, ScenePlace } from './LessonScene';
import VoiceWave from './VoiceWave';
import { lessonTheme as t } from '../constants/lessonTheme';

interface Box { x: number; y: number; width: number; height: number }
export default function AudioSceneActivity({ audio, options, disabled, onAnswer, selected }: {
  audio: string; options: string[]; disabled: boolean; onAnswer: (answer: string) => void; selected?: string;
}) {
  const [hasHeard, setHasHeard] = useState(false);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; void Speech.stop(); }; }, []);
  const heard = useRef(false);
  const locked = useRef(disabled);
  const answerRef = useRef(onAnswer);
  const boxes = useRef<Box[]>([]);
  const targetRefs = useRef<(View | null)[]>([]);
  const [drag] = useState(() => new Animated.ValueXY());
  // Event handlers read these flags; refs are never used as UI values.
  useEffect(() => { locked.current = disabled; answerRef.current = onAnswer; }, [disabled, onAnswer]);
  // PanResponder stores these callbacks; ref reads happen only during gestures.
  // eslint-disable-next-line react-hooks/refs
  const [responder] = useState(() => PanResponder.create({
    onStartShouldSetPanResponder: () => !locked.current && heard.current,
    onPanResponderGrant: () => targetRefs.current.forEach((target, index) => {
      target?.measureInWindow((x, y, width, height) => { boxes.current[index] = { x, y, width, height }; });
    }),
    onPanResponderMove: (_, gesture) => drag.setValue({ x: gesture.dx, y: gesture.dy }),
    onPanResponderRelease: (_, gesture) => {
      const index = boxes.current.findIndex((box) => box && gesture.moveX >= box.x && gesture.moveX <= box.x + box.width && gesture.moveY >= box.y && gesture.moveY <= box.y + box.height);
      Animated.spring(drag, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
      if (index >= 0 && !locked.current) answerRef.current(options[index]);
    },
    onPanResponderTerminate: () => Animated.spring(drag, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start(),
  }));
  const listen = async () => {
    try {
      if (playing) { await Speech.stop(); setPlaying(false); return; }
      await Speech.stop();
      setError(''); setPlaying(true);
      Speech.speak(audio, { language: 'en-GB', rate: 0.75,
        onDone: () => { if (mounted.current) { heard.current = true; setHasHeard(true); setPlaying(false); } },
        onStopped: () => { if (mounted.current) setPlaying(false); },
        onError: () => { if (mounted.current) { setPlaying(false); setError('Səs açılmadı. Telefonun səsini yoxlayıb yenidən bas.'); } },
      });
    } catch { setPlaying(false); setError('Səsi açmaq alınmadı. Yenidən cəhd et.'); }
  };
  return <View>
    <Animated.View {...responder.panHandlers} style={[styles.message, { transform: drag.getTranslateTransform() }]}>
      <TouchableOpacity accessibilityLabel="Salamlaşmanı dinlə" onPress={() => void listen()} style={styles.play}>
        <Text style={styles.playText}>{playing ? 'Ⅱ' : '▶'}</Text>
      </TouchableOpacity>
      <VoiceWave playing={playing} />
      <Text style={styles.messageLabel}>{playing ? 'Dinlənilir' : 'Səsi dinlə'}</Text>
    </Animated.View>
    {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    <View style={styles.scenes}>
      {options.map((option, index) => <View key={option} ref={(node) => { targetRefs.current[index] = node; }} style={styles.sceneWrap}>
        <TouchableOpacity disabled={!hasHeard || disabled} accessibilityRole="button" accessibilityState={{ disabled: !hasHeard || disabled, selected: selected === option }} onPress={() => onAnswer(option)} style={[styles.scene, selected === option && styles.selected]}>
          <View style={styles.art}><SceneArtwork place={(['classroom', 'cafe', 'park'] as ScenePlace[])[index % 3]} evening={index % 3 === 2} /></View>
          <Text style={styles.sceneLabel}>{option.split(' · ')[0]}</Text>
          <Text style={styles.time}>{option.split(' · ')[1]}</Text>
        </TouchableOpacity>
      </View>)}
    </View>
    <Text style={styles.note}>{hasHeard ? 'Mesajı sürüşdür və ya uyğun səhnəyə toxun.' : 'Əvvəl səsi dinlə, sonra səhnəni seç.'}</Text>
  </View>;
}
const styles = StyleSheet.create({
  message: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: t.surface, borderRadius: 18, borderWidth: 1, borderColor: t.border, marginBottom: 14, zIndex: 10 },
  play: { width: 38, height: 38, borderRadius: 19, backgroundColor: t.raised, alignItems: 'center', justifyContent: 'center' }, playText: { color: t.orange, fontSize: 17 },
  messageLabel: { color: t.muted, fontSize: 11, paddingLeft: 6 },
  scenes: { flexDirection: 'row', gap: 8 }, sceneWrap: { flex: 1 },
  scene: { borderRadius: 16, overflow: 'hidden', paddingBottom: 10, borderWidth: 1.5, borderColor: t.border, backgroundColor: t.surface }, selected: { borderColor: t.orange },
  art: { height: 64 }, sceneLabel: { color: t.text, fontSize: 12, textAlign: 'center', fontWeight: '700', marginTop: 8 }, time: { color: t.muted, fontSize: 10, textAlign: 'center', marginTop: 3 },
  note: { color: t.muted, textAlign: 'center', marginTop: 10, fontSize: 11 }, error: { color: t.error, marginBottom: 10, fontSize: 13 },
});
