import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/design/Icons';
import { d, font } from '../components/design/theme';

// AI söhbət is planned; the screen stays empty until it is built.
export default function AiChat() {
  const router = useRouter(); const insets = useSafeAreaInsets();
  return <View style={[s.screen, { paddingTop: insets.top }]}>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={s.top}>
      <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={() => router.back()} style={s.back}><Icon name="back" size={20} color={d.ink} /></Pressable>
      <Text accessibilityRole="header" style={s.title}>AI söhbət</Text>
    </View>
    <View style={s.center}><Icon name="chat" size={44} color={d.lavender} /><Text style={s.soon}>Tezliklə</Text></View>
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3ECFC' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, height: 56 },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  title: { color: d.ink, fontSize: 24, ...font.extrabold },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  soon: { color: d.lavenderText, fontSize: 18, ...font.extrabold },
});
