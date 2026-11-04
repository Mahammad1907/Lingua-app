import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { APP_NAME } from '../../utils/onboarding';

export const colors = { ink: '#281044', purple: '#890CF4', muted: '#705689', border: '#E3C9F8' };
export function useOnboardingSize() {
  const { height, width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return { compact: height - insets.top - insets.bottom < 690 || width < 360 || fontScale > 1.2,
    height: height - insets.top - insets.bottom, width, fontScale };
}
export function Frame({ step, back, title, subtitle, children, action, onAction, ready = true, busy = false, error, retry }: {
  step: number; back?: () => void; title: ReactNode; subtitle: string; children: ReactNode;
  action: string; onAction: () => void; ready?: boolean; busy?: boolean; error?: string | null; retry?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { compact } = useOnboardingSize();
  return <LinearGradient colors={['#FCF9FF', '#ECDDFF', '#FAF5FF']} style={s.root}>
    <Stack.Screen options={{ headerShown: false }} />
    <StatusBar style="dark" />
    <Svg pointerEvents="none" width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
      <Path d="M0 280C120 250 100 560 390 380V620C180 760 90 460 0 450Z" fill="#CDA9F4" opacity={0.25} />
      <Path d="M0 720C130 820 270 830 390 680V844H0Z" fill="#FFFFFF" opacity={0.5} />
    </Svg>
    <View style={[s.safe, { paddingTop: insets.top + 6, paddingBottom: Math.max(insets.bottom, 12), paddingLeft: Math.max(insets.left + 16, 16), paddingRight: Math.max(insets.right + 16, 16) }]}>
      <View style={s.inner}>
        <View style={s.header}>
          <View style={s.logoRow}>
            {back && <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={back} disabled={busy} style={s.back}><Text style={s.backText}>‹</Text></Pressable>}
            <Text style={s.logo}><Text style={s.sparkle}>✦ </Text>{APP_NAME.slice(0, 3)}<Text style={s.orange}>{APP_NAME.slice(3)}</Text></Text>
          </View>
          <View testID="onboarding-progress" accessibilityLabel={`Mərhələ ${step}, cəmi 4`} style={s.dots}>
            {[1, 2, 3, 4].map(n => <View key={n} style={[s.dot, n === step && s.dotActive]} />)}
          </View>
        </View>
        <View style={[s.heading, compact && s.headingCompact]}>
          <Text accessibilityRole="header" style={[s.title, compact && s.titleCompact]}>{title}</Text>
          <Text style={s.subtitle}>{subtitle}</Text>
        </View>
        <View style={s.body}>
          {ready ? children : <View style={s.loading}>{!error && <ActivityIndicator color={colors.purple} accessibilityLabel="Seçimlər yüklənir" />}</View>}
        </View>
        {error && <Pressable accessibilityRole="button" onPress={ready ? onAction : retry} style={s.error}><Text accessibilityRole="alert" style={s.errorText}>{error}</Text></Pressable>}
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: !ready || busy, busy }} disabled={!ready || busy} onPress={onAction} style={({ pressed }) => [s.primary, (pressed || busy) && s.pressed, !ready && s.disabled]}>
          <LinearGradient colors={['#BF3CFF', '#7104EC']} style={[s.primaryFill, compact && s.primaryCompact]}>
            {busy ? <ActivityIndicator color="#FFF" /> : <><Text style={s.primaryText}>{action}</Text><Text style={s.arrow}>→</Text></>}
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  </LinearGradient>;
}
const mascots = {
  welcome: require('../../../assets/onboarding/welcome.png'),
  goal: require('../../../assets/onboarding/goal.png'),
  plan: require('../../../assets/onboarding/plan.png'),
};
export function Mascot({ name, large = false }: { name: keyof typeof mascots; large?: boolean }) {
  return <View testID="onboarding-mascot" style={[s.hero, !large && s.smallHero]} pointerEvents="none">
    <Image source={mascots[name]} style={s.heroImage} resizeMode="contain" accessible={false} />
  </View>;
}
export function FeatureTiles() {
  const { compact } = useOnboardingSize();
  return <View style={s.features}>{[['🎓', 'Öyrən'], ['🎧', 'Məşq et'], ['🎙️', 'Danış']].map(([icon, label]) =>
    <View key={label} style={[s.feature, compact && s.featureCompact]}><Text style={s.featureIcon} accessible={false}>{icon}</Text><Text style={s.featureText}>{label}</Text></View>)}</View>;
}
type Choice = { id: string; title: string; description: string; short: string; icon: string };
export function Choices({ options, selected, onSelect, disabled = false }: {
  options: readonly Choice[]; selected: string; onSelect: (id: string) => void; disabled?: boolean;
}) {
  const { compact, height, fontScale, width } = useOnboardingSize();
  const [requestedPage, setPage] = useState(0);
  // At accessibility sizes/short landscape, paginate choices rather than clipping or shrinking text.
  const paged = height < 500 || fontScale > 1.25 || (width < 350 && height < 600);
  const pageSize = paged ? (height < 400 || fontScale > 1.6 ? 1 : height < 600 ? 2 : 3) : options.length;
  const pages = Math.ceil(options.length / pageSize);
  const page = Math.min(requestedPage, pages - 1);
  return <View style={[s.choices, { gap: compact ? 6 : 9 }]} accessibilityRole="radiogroup">
    {options.slice(page * pageSize, (page + 1) * pageSize).map(option => <Pressable key={option.id} testID={`choice-${option.id}`} accessibilityRole="radio"
      accessibilityLabel={`${option.title}. ${option.description}`} accessibilityState={{ selected: selected === option.id, checked: selected === option.id, disabled }} disabled={disabled}
      onPress={() => onSelect(option.id)} style={({ pressed }) => [s.choice, compact && s.choiceCompact, selected === option.id && s.choiceSelected, pressed && s.pressed]}>
      <Text style={[s.choiceIcon, compact && s.choiceIconCompact]} accessible={false}>{option.icon}</Text>
      <View style={s.choiceCopy}><Text style={s.choiceTitle}>{option.title}</Text><Text style={s.choiceDescription}>{compact ? option.short : option.description}</Text></View>
      <View style={[s.radio, selected === option.id && s.radioSelected]}>{selected === option.id && <Text style={s.check}>✓</Text>}</View>
    </Pressable>)}
    {pages > 1 && <View style={s.pagination}>
      <Pressable accessibilityRole="button" accessibilityLabel="Əvvəlki seçimlər" disabled={page === 0} onPress={() => setPage(page - 1)} style={s.pageButton}><Text style={[s.pageText, page === 0 && s.disabled]}>‹ Əvvəlki</Text></Pressable>
      <Text style={s.choiceDescription}>{page + 1}/{pages}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Digər seçimlər" disabled={page + 1 === pages} onPress={() => setPage(page + 1)} style={s.pageButton}><Text style={[s.pageText, page + 1 === pages && s.disabled]}>Digər ›</Text></Pressable>
    </View>}
  </View>;
}
export const s = StyleSheet.create({
  root: { flex: 1 }, safe: { flex: 1 }, inner: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center' },
  header: { flexShrink: 0, paddingBottom: 8 }, logoRow: { height: 46, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 30, fontWeight: '900', color: colors.ink }, sparkle: { color: colors.purple }, orange: { color: '#FF8500' },
  back: { position: 'absolute', left: 0, top: 0, width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFFD9', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  backText: { fontSize: 36, lineHeight: 40, color: colors.purple }, dots: { flexDirection: 'row', gap: 10, alignSelf: 'center', paddingTop: 8, paddingBottom: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#DEC9EF' }, dotActive: { backgroundColor: colors.purple },
  heading: { gap: 8, paddingTop: 10, paddingBottom: 8, flexShrink: 0 }, headingCompact: { gap: 4, paddingTop: 2, paddingBottom: 4 },
  title: { fontSize: 29, lineHeight: 34, fontWeight: '900', textAlign: 'center', color: colors.ink }, titleCompact: { fontSize: 24, lineHeight: 28 },
  subtitle: { fontSize: 14, lineHeight: 19, color: colors.muted, textAlign: 'center' }, body: { flex: 1, minHeight: 0 },
  hero: { flex: 1, minHeight: 0, marginVertical: 6 }, smallHero: { maxHeight: 170 }, heroImage: { width: '100%', height: '100%' },
  loading: { flex: 1, justifyContent: 'center' }, primary: { flexShrink: 0, marginTop: 12, borderRadius: 28, overflow: 'hidden' },
  primaryFill: { minHeight: 54, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'center' },
  primaryCompact: { minHeight: 48, paddingVertical: 9 }, primaryText: { fontSize: 20, fontWeight: '800', color: '#FFF', textAlign: 'center', flexShrink: 1 }, arrow: { fontSize: 27, color: '#FFF' },
  pressed: { opacity: 0.75 }, disabled: { opacity: 0.4 }, error: { paddingVertical: 7, minHeight: 44, justifyContent: 'center' }, errorText: { color: '#8B2347', textAlign: 'center', fontSize: 13 },
  features: { flexDirection: 'row', gap: 8, flexShrink: 0, marginVertical: 12 }, feature: { flex: 1, paddingVertical: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 22, backgroundColor: '#FFFFFFC9', alignItems: 'center', gap: 6 },
  featureCompact: { paddingVertical: 8, gap: 2 }, featureIcon: { fontSize: 33 }, featureText: { fontSize: 16, fontWeight: '800', color: colors.ink },
  choices: { flexShrink: 0 }, choice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFFD9', borderRadius: 20, borderWidth: 1.5, borderColor: '#E7D5F7', paddingVertical: 12, paddingHorizontal: 12, gap: 11, minHeight: 64 },
  choiceCompact: { paddingVertical: 7, paddingHorizontal: 10, gap: 8, minHeight: 54 }, choiceSelected: { borderColor: colors.purple, backgroundColor: '#F8EEFF' },
  choiceIcon: { fontSize: 32, width: 40, textAlign: 'center' }, choiceIconCompact: { fontSize: 26, width: 32 }, choiceCopy: { flex: 1, borderLeftWidth: 1, borderColor: '#DDBAF4', paddingLeft: 10 },
  choiceTitle: { color: colors.ink, fontWeight: '800', fontSize: 16, lineHeight: 20 }, choiceDescription: { color: colors.muted, fontSize: 13, lineHeight: 17 },
  radio: { width: 23, height: 23, borderWidth: 1.5, borderColor: '#AC86CA', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }, radioSelected: { backgroundColor: colors.purple, borderColor: colors.purple }, check: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, pageButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }, pageText: { color: colors.purple, fontSize: 14, fontWeight: '700' },
  summary: { flexDirection: 'row', gap: 8, marginVertical: 8, flexShrink: 0 }, summaryCard: { flex: 1, borderRadius: 18, padding: 10, backgroundColor: '#FFFFFFD9', borderWidth: 1, borderColor: colors.border },
  label: { fontSize: 13, lineHeight: 17, color: colors.muted }, value: { fontSize: 16, lineHeight: 20, fontWeight: '800', color: colors.ink },
  plan: { borderRadius: 22, padding: 12, backgroundColor: '#FFFFFFD9', borderWidth: 1, borderColor: colors.border, gap: 8, flexShrink: 0 }, planTitle: { fontSize: 20, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  planRow: { flexDirection: 'row', gap: 10, alignItems: 'center' }, planIcon: { fontSize: 28, width: 36, textAlign: 'center' }, planCopy: { flex: 1 }, rule: { height: 1, backgroundColor: colors.border },
  note: { fontSize: 13, lineHeight: 17, color: colors.muted }, minutes: { flexDirection: 'row', gap: 7, marginTop: 5 }, minute: { flex: 1, minHeight: 44, borderRadius: 12, backgroundColor: '#F0E5FC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }, minuteSelected: { backgroundColor: '#8A1DE0', borderColor: '#8A1DE0' }, minuteText: { color: colors.ink, fontSize: 14, fontWeight: '700' }, minuteTextSelected: { color: '#FFF' },
});
