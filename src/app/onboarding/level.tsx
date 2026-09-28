import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LevelSelection() {
  const router = useRouter();

  const handleTest = async () => {
    await AsyncStorage.setItem('user_level', 'test');
    router.push('/onboarding/placement');
  };

  const handleLevel = async (level: string) => {
    await AsyncStorage.setItem('user_level', level);
    router.push('/onboarding/welcome');
  };

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: true }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>📊</Text>
        <Text style={styles.title}>Səviyyəni bilirsən?</Text>
        <Text style={styles.subtitle}>
          Sənə uyğun yerdən başlayaq
        </Text>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleTest}
        >
          <Text style={styles.optionEmoji}>🧪</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Test et</Text>
            <Text style={styles.optionDesc}>
              10 sual ilə səviyyəni təyin edək
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleLevel('A1')}
        >
          <Text style={styles.optionEmoji}>🌱</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Başlanğıc (A1)</Text>
            <Text style={styles.optionDesc}>Sıfırdan başlayıram</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleLevel('A2')}
        >
          <Text style={styles.optionEmoji}>🌿</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Elementary (A2)</Text>
            <Text style={styles.optionDesc}>Əsas biliklərim var</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleLevel('B1')}
        >
          <Text style={styles.optionEmoji}>🌳</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Intermediate (B1)</Text>
            <Text style={styles.optionDesc}>Sərbəst danışıram</Text>
          </View>
        </TouchableOpacity>
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
  },
  emoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  optionEmoji: {
    fontSize: 36,
    marginRight: 18,
  },
  optionText: { flex: 1 },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: '#888888',
  },
});