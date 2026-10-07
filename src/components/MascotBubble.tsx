import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

type BubbleVariant = 'intro' | 'hint' | 'success';

interface MascotBubbleProps {
  message: string;
  variant?: BubbleVariant;
  side?: 'left' | 'right';
  mascotSize?: number;
}

function getMascotImage(variant: BubbleVariant) {
  if (variant === 'success') {
    return require('../../assets/mascot/fox_happy.png');
  }
  return require('../../assets/mascot/fox_normal.png');
}

function getVariantColors(variant: BubbleVariant) {
  if (variant === 'success') {
    return {
      bg: colors.moduleCompletedBg,
      border: colors.success,
      accent: colors.success,
    };
  }
  if (variant === 'hint') {
    return {
      bg: colors.mascot.bgSoft,
      border: colors.mascot.border,
      accent: colors.mascot.orange,
    };
  }
  return {
    bg: colors.surface,
    border: colors.brd.light,
    accent: colors.primary,
  };
}

export default function MascotBubble({
  message,
  variant = 'intro',
  side = 'left',
  mascotSize = 90,
}: MascotBubbleProps) {
  const v = getVariantColors(variant);
  const isRight = side === 'right';

  return (
    <View style={[styles.container, isRight && styles.reverse]}>
      <View
        style={[
          styles.mascotWrapper,
          {
            width: mascotSize,
            height: mascotSize,
          },
        ]}
      >
        <Image
          source={getMascotImage(variant)}
          style={styles.mascotImage}
          resizeMode="contain"
        />
      </View>

      <View
        style={[
          styles.bubble,
          {
            backgroundColor: v.bg,
            borderColor: v.border,
          },
          isRight ? styles.bubbleLeft : styles.bubbleRight,
        ]}
      >
        <Text style={styles.message}>{message}</Text>

        {/* Speech bubble tail — fox tərəfə */}
        <View
          style={[
            styles.tail,
            {
              borderRightColor: v.border,
            },
            isRight && styles.tailRight,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 8,
    overflow: 'visible',
  },
  reverse: {
    flexDirection: 'row-reverse',
  },
  mascotWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  mascotImage: {
    width: '130%',
    height: '130%',
  },
  bubble: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    position: 'relative',
  },
  bubbleRight: {
    borderTopLeftRadius: 4,
  },
  bubbleLeft: {
    borderTopRightRadius: 4,
  },
  tail: {
    position: 'absolute',
    left: -8,
    top: 20,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  tailRight: {
    left: undefined,
    right: -8,
    borderRightWidth: 0,
    borderLeftWidth: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});