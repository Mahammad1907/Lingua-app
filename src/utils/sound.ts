import { AudioPlayer, createAudioPlayer } from 'expo-audio';

// Test üçün pulsuz səslər
const correctSoundUri =
  'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
const wrongSoundUri =
  'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

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
    console.log('Səs xətası:', error);
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
    console.log('Səs xətası:', error);
  }
};