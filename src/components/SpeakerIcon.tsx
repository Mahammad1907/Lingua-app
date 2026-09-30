import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

interface SpeakerIconProps {
  size?: number;
  color?: string;
  active?: boolean;
}

export default function SpeakerIcon({
  size = 14,
  color,
  active = false,
}: SpeakerIconProps) {
  const iconColor = active ? colors.success : color ?? colors.primaryLight;
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.icon, { fontSize: size, color: iconColor }]}>
        ▶︎
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: '800',
    marginLeft: 2,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});