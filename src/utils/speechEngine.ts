import { requireOptionalNativeModule } from 'expo';
import type { ExpoSpeechRecognitionModuleType } from 'expo-speech-recognition/build/ExpoSpeechRecognitionModule.types';
import { Platform } from 'react-native';

// A type-only import is safe in Expo Go. Do not import the package's runtime
// entry: it calls requireNativeModule and would crash when the module is absent.
export function getSpeechEngine(): ExpoSpeechRecognitionModuleType | null {
  if (Platform.OS === 'web') return null;
  try { return requireOptionalNativeModule<ExpoSpeechRecognitionModuleType>('ExpoSpeechRecognition'); }
  catch { return null; }
}
