import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Welcome() {
  const router = useRouter();
  const [level, setLevel] = useState('A1');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedLevel = await AsyncStorage.getItem('user_level');
    const savedLang = await AsyncStorage.getItem('selected_language');
    if (savedLevel) setLevel(savedLevel);
    if (savedLang) setLanguage(savedLang);
  };

  const getLanguageName = () => {
    if (language === 'en') return '🇬🇧 İngilis';
    if (language === 'de') return '🇩🇪 Alman';
    if (language === 'ru') return '🇷🇺 Rus';
    return '';
  };

  const handleCreateAccount = () => {
    router.push('/register');
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboarding_completed', 'true');
    router.replace('/(tabs)');
  };

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
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Hazırsan!</Text>
          <Text style={styles.subtitle}>
            Sənin üçün hazırladıq:
          </Text>

          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dil:</Text>
              <Text style={styles.infoValue}>{getLanguageName()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Səviyyə:</Text>
              <Text style={styles.infoValue}>{level}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCreateAccount}
          >
            <Text style={styles.primaryButtonText}>
              Hesab yarat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSkip}
          >
            <Text style={styles.secondaryButtonText}>
              Sonra
            </Text>
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
    paddingHorizontal: 25,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 40,
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#888888',
  },
  infoValue: {
    fontSize: 18,
    color: '#4ade80',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginVertical: 5,
  },
  buttons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4ade80',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0a0a0a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  secondaryButtonText: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '600',
  },
});