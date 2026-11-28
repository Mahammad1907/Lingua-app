import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IslandNavigation, NAV_HEIGHT, type IslandDestination } from '../components/home/IslandHome';
import { RulesScreen } from '../components/rules/RulesScreen';
import { d } from '../components/design/theme';
import { getShortSession } from '../data/firstConversation';
import { useLastOpenedStore } from '../store/lastOpenedStore';

// Qaydalar tab (user, 21 Nov 2026), opened from the floating menu.
export default function Rules() {
  const router = useRouter(); const insets = useSafeAreaInsets();
  const go = (id: IslandDestination) => {
    if (id === 'learn') router.navigate('/(tabs)');
    if (id === 'chat') router.push('/ai-chat');
    if (id === 'vocabulary') router.navigate('/(tabs)/vocabulary');
    if (id === 'profile') router.navigate('/(tabs)/profile');
  };
  return <View style={{ flex: 1, backgroundColor: d.bg }}>
    <Stack.Screen options={{ headerShown: false }} />
    <RulesScreen topInset={insets.top} bottomSpace={NAV_HEIGHT + Math.max(insets.bottom, 10)}
      onOpenLesson={(id, unit) => {
        useLastOpenedStore.getState().remember(unit, id);
        router.push(getShortSession(id) ? { pathname: '/lesson/session', params: { id } } : { pathname: '/lesson/vocabulary', params: { id } });
      }} />
    <IslandNavigation bottomInset={insets.bottom} onNavigate={go} active="rules" />
  </View>;
}
