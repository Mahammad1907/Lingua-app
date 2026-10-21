import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  title: string;
  lessonOrder: number;
  lessonCount: number;
  step: number;
  total: number;
  warmup?: boolean;
  hearts: number;
  question: string;
  boardText: string;
  hint?: string;
  audio?: string;
  onListen?: () => void;
  answer: string;
  placeholder: string;
  onAnswer: (value: string) => void;
  feedback: 'correct' | 'wrong' | null;
  explanation: string;
  actionLabel: string;
  actionEnabled: boolean;
  onAction: () => void;
  onBack: () => void;
}

function Icon({ name, color = '#C1ACF5', size = 20 }: {
  name: 'back' | 'arrow' | 'bolt' | 'chat' | 'bulb' | 'keyboard' | 'check' | 'sound'; color?: string; size?: number;
}) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {name === 'back' ? <Path d="m15 5-7 7 7 7" /> : null}
    {name === 'arrow' ? <Path d="M4 12h16m-6-6 6 6-6 6" /> : null}
    {name === 'bolt' ? <Path fill={color} strokeWidth={0} d="m14 1-10 13h7l-1 9 10-14h-7z" /> : null}
    {name === 'chat' ? <><Path d="M5 4h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V7a3 3 0 0 1 3-3Z" /><Circle cx={7} cy={12} r={.6} /><Circle cx={12} cy={12} r={.6} /><Circle cx={17} cy={12} r={.6} /></> : null}
    {name === 'bulb' ? <><Path d="M9 18h6m-6 3h6M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z" /></> : null}
    {name === 'keyboard' ? <><Rect x={2} y={5} width={20} height={14} rx={3} /><Path d="M6 9h1m4 0h1m4 0h1M6 12h1m4 0h1m4 0h1M7 16h10" /></> : null}
    {name === 'check' ? <Path d="m5 12 4 4L19 6" /> : null}
    {name === 'sound' ? <><Path d="m10 4-6 5H1v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></> : null}
  </Svg>;
}

// Presentation only. Grading, rewards and navigation remain in the caller.
export default function WrittenPracticeScreen(props: Props) {
  const insets = useSafeAreaInsets();
  const { width, height, fontScale } = useWindowDimensions();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const input = useRef<TextInput>(null);
  const percent = Math.round(Math.max(0, Math.min(5, props.hearts)) / 5 * 100);
  const progress = props.warmup ? 0 : Math.max(0, Math.min(100, props.step / Math.max(1, props.total) * 100));
  const sceneHeight = Math.min(width / 1.5, Math.max(150, height * .29));
  const sceneWidth = sceneHeight * 1.5;
  const compact = keyboardOpen || height < 700 || fontScale > 1.3;

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardOpen(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const submit = () => {
    if (!props.actionEnabled) return;
    Keyboard.dismiss();
    props.onAction();
  };

  return <KeyboardAvoidingView style={[s.screen, { paddingTop: insets.top }]}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <LinearGradient pointerEvents="none" colors={['#18143A88', '#0A0D2000']} style={s.ambient} />
    <View style={s.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Dərslərə qayıt" onPress={props.onBack} style={({ pressed }) => [s.back, pressed && s.pressed]}><Icon name="back" size={23} /></Pressable>
      <View style={s.titleArea}><Text style={s.eyebrow}>İLK TANIŞLIQ · {props.lessonOrder}/{props.lessonCount}</Text><Text style={s.title}>{props.title}</Text></View>
      <View accessibilityLabel={`Enerji ${percent} faiz`} style={s.energy}>
        <Icon name="bolt" size={21} color="#AF79F6" />
        <View><Text style={s.energyLabel}>Enerji {percent}%</Text><View style={s.energyTrack}><LinearGradient colors={['#FFB948', '#FF922E']} style={{ height: '100%', width: `${percent}%`, borderRadius: 3 }} /></View></View>
      </View>
    </View>
    <View style={s.progressRow}><View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(progress) }} style={s.track}><LinearGradient colors={['#FFC251', '#FF9635']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: '100%', width: `${progress}%`, borderRadius: 4 }} /></View><Text style={s.counter}>{props.warmup ? 'Təkrar' : `${props.step}/${props.total}`}</Text></View>

    <ScrollView ref={scroll} style={s.scroll} contentContainerStyle={[s.content, compact && s.compactContent]}
      keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" showsVerticalScrollIndicator={false}>
      {!compact ? <>
        <View style={s.badge}><Text style={s.badgeText}>{props.warmup ? 'QISA TƏKRAR' : `KART ${props.step}`}</Text></View>
        <View style={[s.scene, { height: sceneHeight }]} pointerEvents="none">
          <View style={{ width: sceneWidth, height: sceneHeight }}>
            <Image source={require('../../assets/lessons/written-classroom.webp')} accessible={false} resizeMode="contain" style={s.sceneImage} />
            <View style={s.boardWriting}><Text style={s.boardLabel}>BİRFOX İLƏ MƏŞQ</Text><Text style={[s.boardText, props.boardText.length > 35 && s.smallBoardText]}>{props.boardText}</Text><View style={s.chalkLine} /></View>
          </View>
          <LinearGradient colors={['#0A0D2000', '#0A0D20']} style={s.sceneFade} />
        </View>
      </> : null}

      <View style={s.questionCard}>
        {!compact ? <View style={s.chatBubble}><Icon name="chat" size={18} /></View> : null}
        <View style={s.questionAccent} />
        <View style={s.questionCopy}>
          <Text style={s.question}>{props.question}</Text>
          {props.hint?.trim() ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: hintOpen }} accessibilityLabel="Mənə başa sal" onPress={() => setHintOpen((value) => !value)} style={s.help}>
            <Icon name="bulb" size={15} /><Text style={s.helpText}>Mənə başa sal</Text><Text style={s.chevron}>{hintOpen ? '−' : '›'}</Text>
          </Pressable> : null}
          {hintOpen && props.hint ? <Text style={s.hint}>{props.hint}</Text> : null}
        </View>
      </View>

      {props.audio && props.onListen ? <Pressable accessibilityRole="button" onPress={props.onListen} style={s.audio}><Icon name="sound" size={18} color="#FFB34B" /><Text style={s.audioText}>Səsi dinlə</Text></Pressable> : null}
      <View style={s.inputShell}>
        <Icon name="keyboard" size={21} />
        <TextInput ref={input} accessibilityLabel="Cavabın" value={props.answer} onChangeText={props.onAnswer} editable={props.feedback !== 'correct'}
          onFocus={() => setKeyboardOpen(true)} onBlur={() => setKeyboardOpen(false)} onLayout={() => { if (keyboardOpen) scroll.current?.scrollToEnd({ animated: false }); }}
          autoCorrect={false} autoCapitalize="none" returnKeyType="done" onSubmitEditing={submit}
          placeholder={props.placeholder} placeholderTextColor="#A9A0CD" style={s.input} />
      </View>
      {!keyboardOpen ? <Text style={s.inputNote}>Cavabını ingiliscə yaz.</Text> : null}
    </ScrollView>

    <View style={[s.footer, { paddingBottom: keyboardOpen ? 10 : Math.max(14, insets.bottom) }]}>
      {props.feedback ? <View accessibilityLiveRegion="polite" style={[s.feedback, props.feedback === 'wrong' && s.wrongFeedback]}>
        <View style={s.feedbackTop}><Icon name={props.feedback === 'correct' ? 'check' : 'bulb'} color={props.feedback === 'correct' ? '#70EAC4' : '#FFBC96'} size={19} /><Text style={[s.feedbackTitle, props.feedback === 'wrong' && { color: '#FFBC96' }]}>{props.feedback === 'correct' ? 'Düzdür!' : 'Bir daha yoxlayaq'}</Text></View>
        <Text style={s.feedbackText}>{props.explanation}</Text>
      </View> : null}
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: !props.actionEnabled }} disabled={!props.actionEnabled} onPress={submit} style={({ pressed }) => [s.button, !props.actionEnabled && s.buttonDisabled, pressed && s.pressed]}>
        <LinearGradient colors={['#FFC04C', '#FF922F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: .6 }} style={s.buttonInner}>
          <Text style={s.buttonText}>{props.actionLabel}</Text><View style={s.buttonArrow}><Icon name="arrow" size={25} color="#261826" /></View>
        </LinearGradient>
      </Pressable>
    </View>
  </KeyboardAvoidingView>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0D20' }, ambient: { position: 'absolute', top: 0, left: 0, right: 0, height: 290 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 12 },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#171734', borderWidth: 1, borderColor: '#2D2855' },
  titleArea: { flex: 1, minWidth: 0 }, eyebrow: { fontSize: 9, letterSpacing: .8, color: '#B5A2DF', marginBottom: 4 },
  title: { fontSize: 16, lineHeight: 21, color: '#FAF6FF', fontWeight: '700' },
  energy: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 8, borderRadius: 19, borderWidth: 1, borderColor: '#30295C', backgroundColor: '#15132D' },
  energyLabel: { color: '#B9A6EF', fontSize: 9, fontWeight: '600' }, energyTrack: { width: 50, height: 4, backgroundColor: '#302552', borderRadius: 3, marginTop: 4, overflow: 'hidden' },
  progressRow: { marginHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }, track: { height: 6, flex: 1, borderRadius: 4, backgroundColor: '#292345', overflow: 'hidden' }, counter: { color: '#E8B575', fontSize: 10 },
  scroll: { flex: 1, minHeight: 0 }, content: { paddingTop: 4, paddingBottom: 16, gap: 14 }, compactContent: { paddingTop: 0, gap: 10 },
  badge: { alignSelf: 'flex-start', marginLeft: 18, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 13, backgroundColor: '#211B41' }, badgeText: { color: '#BBA5ED', fontSize: 9, letterSpacing: .8, fontWeight: '600' },
  scene: { width: '100%', alignItems: 'center', overflow: 'hidden' }, sceneImage: { width: '100%', height: '100%' }, sceneFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 14 },
  boardWriting: { position: 'absolute', left: '44%', top: '24%', width: '45%', height: '43%', alignItems: 'center', justifyContent: 'center', padding: 5 },
  boardLabel: { fontSize: 7, color: '#BEAFE8', letterSpacing: .6, marginBottom: 9, fontWeight: '700' }, boardText: { fontSize: 20, lineHeight: 26, color: '#F7F4E9', fontWeight: '700', textAlign: 'center' }, smallBoardText: { fontSize: 15, lineHeight: 20 }, chalkLine: { width: 52, height: 2, borderRadius: 1, backgroundColor: '#EF9A38', marginTop: 10, transform: [{ rotate: '-4deg' }] },
  questionCard: { marginHorizontal: 18, borderRadius: 20, backgroundColor: '#14142F', borderWidth: 1, borderColor: '#3D326E', padding: 14, flexDirection: 'row', gap: 11, shadowColor: '#7150D9', shadowOpacity: .13, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } },
  chatBubble: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2B1D54' }, questionAccent: { width: 2, borderRadius: 2, backgroundColor: '#F59649' }, questionCopy: { flex: 1 }, question: { fontSize: 15, lineHeight: 22, color: '#F3EEFF', fontWeight: '600' },
  help: { alignSelf: 'flex-end', minHeight: 34, flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }, helpText: { color: '#B6A1E9', fontSize: 11 }, chevron: { color: '#B6A1E9', fontSize: 20 }, hint: { color: '#C1B8D8', fontSize: 13, lineHeight: 20, marginTop: 7 },
  inputShell: { marginHorizontal: 18, minHeight: 58, borderRadius: 20, borderWidth: 1.5, borderColor: '#A29AF2', backgroundColor: '#22213F', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 12, shadowColor: '#8470FA', shadowOpacity: .22, shadowRadius: 9, shadowOffset: { width: 0, height: 2 } }, input: { flex: 1, minHeight: 55, color: '#F7F3FF', fontSize: 16, paddingVertical: 12 }, inputNote: { marginHorizontal: 22, color: '#8F85AE', fontSize: 11, marginTop: -4 },
  audio: { marginHorizontal: 18, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#393050', backgroundColor: '#17152E', flexDirection: 'row', gap: 8, alignItems: 'center' }, audioText: { color: '#FFB34B', fontSize: 13 },
  footer: { flexShrink: 0, paddingHorizontal: 18, paddingTop: 10, backgroundColor: '#0A0D20', gap: 10 }, feedback: { padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#3C8E7C', backgroundColor: '#12312D' }, wrongFeedback: { borderColor: '#855A61', backgroundColor: '#30202F' }, feedbackTop: { flexDirection: 'row', gap: 7, alignItems: 'center' }, feedbackTitle: { color: '#70EAC4', fontSize: 14, fontWeight: '700' }, feedbackText: { color: '#E4DCE9', fontSize: 12, lineHeight: 18, marginTop: 5 },
  button: { borderRadius: 27, backgroundColor: '#FF9A35', shadowColor: '#FF982F', shadowOpacity: .25, shadowRadius: 14, shadowOffset: { width: 0, height: 3 } }, buttonInner: { minHeight: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 45, paddingVertical: 13 }, buttonText: { color: '#291A26', fontSize: 17, fontWeight: '800' }, buttonArrow: { position: 'absolute', right: 21 }, buttonDisabled: { opacity: .48 }, pressed: { opacity: .85, transform: [{ scale: .985 }] },
});
