// 📏 Lingua App — Tema (Ölçülər, Şriftlər, Rənglər)

import { Platform } from 'react-native';
import { colors } from './colors';

// ============ EXPO UYĞUNLUĞU - RƏNGLƏR ============
export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    tint: colors.primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: colors.primary,
  },
  dark: {
    text: '#ffffff',
    background: '#0a1428',
    tint: colors.primary,
    icon: '#94a3b8',
    tabIconDefault: '#94a3b8',
    tabIconSelected: colors.primary,
  },
};

// ============ EXPO UYĞUNLUĞU - ŞRİFTLƏR ============
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

// ============ EXPO UYĞUNLUĞU - BOŞLUQLAR ============
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
};

// ============ BİZİM BOŞLUQLAR ============
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ============ YAZI ÖLÇÜLƏRİ ============
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 48,
};

// ============ YAZI QALINLIĞI ============
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ============ KÜNC YUMRULUĞU ============
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

// ============ BOTTOM TAB ÜÇÜN ============
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

// ============ TAM TEMA ============
export const theme = {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
};

export type Theme = typeof theme;