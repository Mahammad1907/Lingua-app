import { Stack } from 'expo-router';
import AnalysisScreen from '../components/analysis/AnalysisScreen';

export default function Analysis() {
  return <><Stack.Screen options={{ headerShown: false }} /><AnalysisScreen /></>;
}
