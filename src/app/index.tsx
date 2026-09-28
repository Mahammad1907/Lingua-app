import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  // Android back düyməsini blokla
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true
      );
      return () => backHandler.remove();
    }
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboarding_completed');
      if (completed === 'true') {
        router.replace('/(tabs)');
      } else {
        setChecking(false);
      }
    } catch (error) {
      setChecking(false);
    }
  };

  const selectLanguage = async (lang: string) => {
    await AsyncStorage.setItem('selected_language', lang);
    router.push('/onboarding/level');
  };

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.title}>Xoş gəldin!</Text>
          <Text style={styles.subtitle}>
            Hanı dili öyrənmək istəyirsən?
          </Text>

          <TouchableOpacity
            style={styles.langButton}
            onPress={() => selectLanguage('en')}
          >
            <Text style={styles.langFlag}>🇬🇧</Text>
            <Text style={styles.langName}>İngilis dili</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.langButton}
            onPress={() => selectLanguage('de')}
          >
            <Text style={styles.langFlag}>🇩🇪</Text>
            <Text style={styles.langName}>Alman dili</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.langButton}
            onPress={() => selectLanguage('ru')}
          >
            <Text style={styles.langFlag}>🇷🇺</Text>
            <Text style={styles.langName}>Rus dili</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  content: { alignItems: 'center' },
  emoji: { fontSize: 70, marginBottom: 20 },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#888888',
    marginBottom: 50,
    textAlign: 'center',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginBottom: 15,
    width: '100%',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  langFlag: { fontSize: 40, marginRight: 20 },
  langName: { fontSize: 20, color: '#ffffff', fontWeight: '600' },
});