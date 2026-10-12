import { AudioPlayer, createAudioPlayer } from 'expo-audio';

// ═══════════════════════════════════════
// ✅ TƏSDİQ SƏSİ — yüksək, xoş "ding"
// (düzgün cavab üçün)
// ═══════════════════════════════════════
const correctSoundUri =
  'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

// ═══════════════════════════════════════
// ❌ ERROR SƏSİ — aşağı, xəbərdarlıq tonu
// (səhv cavab üçün)
// ═══════════════════════════════════════
const wrongSoundUri =
  'https://actions.google.com/sounds/v1/alarms/error.ogg';

let correctPlayer: AudioPlayer | null = null;
let wrongPlayer: AudioPlayer | null = null;

export const playCorrectSound = async () => {
  try {
    if (correctPlayer) {
      correctPlayer.remove();
    }
    correctPlayer = createAudioPlayer({ uri: correctSoundUri });
    correctPlayer.play();
  } catch (error) {
    console.log('Düzgün səs xətası:', error);
  }
};

export const playWrongSound = async () => {
  try {
    if (wrongPlayer) {
      wrongPlayer.remove();
    }
    wrongPlayer = createAudioPlayer({ uri: wrongSoundUri });
    wrongPlayer.play();
  } catch (error) {
    console.log('Səhv səs xətası:', error);
  }
};