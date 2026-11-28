import { Redirect } from 'expo-router';

// The old dark section screen was removed (13 noyabr 2026): lessons open from the island on the home screen.
// Any old link to a section lands on the home screen instead.
export default function SectionRedirect() {
  return <Redirect href="/(tabs)" />;
}
