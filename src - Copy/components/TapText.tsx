import * as Speech from 'expo-speech';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../constants/colors';
import SpeakerIcon from './SpeakerIcon';

interface TapTextProps {
  text: string;
  translation: string;
  language?: string;
  size?: 'small' | 'medium' | 'large';
  showSpeakButton?: boolean;
  speakText?: string;
}

export default function TapText({
  text,
  translation,
  language = 'en-US',
  size = 'medium',
  showSpeakButton = true,
  speakText,
}: TapTextProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    Speech.stop();
    setIsSpeaking(true);
    const toSpeak = speakText || text;
    Speech.speak(toSpeak, {
      language,
      rate: 0.85,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const fontSize = {
    small: 16,
    medium: 20,
    large: 26,
  }[size];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowTranslation(!showTranslation)}
        onLongPress={speak}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, { fontSize }]}>{text}</Text>
      </TouchableOpacity>

      {showTranslation && (
        <View style={styles.translationBox}>
          <Text style={styles.translation}>{translation}</Text>
        </View>
      )}

      {showSpeakButton && (
        <TouchableOpacity
          style={[styles.speakButton, isSpeaking && styles.speakButtonActive]}
          onPress={speak}
        >
          <SpeakerIcon size={14} active={isSpeaking} />
          <Text style={styles.speakText}>
            {isSpeaking ? 'Oxunur...' : 'Dinlə'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  text: {
    color: colors.textPrimary,
    fontWeight: '600',
    lineHeight: 32,
  },
  translationBox: {
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  translation: {
    fontSize: 16,
    color: colors.primary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 6,
  },
  speakButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderColor: colors.primary,
  },
  speakText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});