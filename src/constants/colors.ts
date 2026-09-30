export const colors = {
  // ═══ KÖHNƏ (TOXUNULMUR) ═══
  primary: '#8b5cf6',
  primaryLight: '#a78bfa',
  secondary: '#06b6d4',
  accent: '#ec4899',
  gradientStart: '#06b6d4',
  gradientMid: '#8b5cf6',
  gradientEnd: '#ec4899',
  background: '#0a0a1a',
  backgroundAlt: '#0d0d20',
  surface: '#13132b',
  surfaceLight: '#1a1a35',
  surfaceGlass: 'rgba(139, 92, 246, 0.08)',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#52525b',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  heart: '#ef4444',
  xp: '#fbbf24',
  streak: '#f97316',
  border: 'rgba(139, 92, 246, 0.15)',
  borderLight: 'rgba(139, 92, 246, 0.25)',
  borderFocus: 'rgba(139, 92, 246, 0.6)',
  borderGlow: 'rgba(139, 92, 246, 0.4)',

  // ═══ YENİ — ANA SƏHİFƏ ÜÇÜN ═══
  // Əsas fon (çox tünd navy)
  bgBase: '#0a0e1a',
  bgElevated: '#0f1420',
  bgCard: '#131a2b',
  bgCardActive: '#1a2340',

  // Vurğular
  accentPurple: '#8b5cf6',
  accentPurpleDark: '#7c3aed',
  accentBlue: '#3b82f6',
  accentBlueDark: '#2563eb',
  accentGreen: '#22c55e',
  accentOrange: '#f97316',

  // Modul status rəngləri
  moduleActive: '#8b5cf6',
  moduleActiveBg: 'rgba(139, 92, 246, 0.15)',
  moduleLocked: '#f97316',
  moduleLockedBg: 'rgba(249, 115, 22, 0.1)',
  moduleCompleted: '#22c55e',
  moduleCompletedBg: 'rgba(34, 197, 94, 0.15)',

  // Mətn
  textOnDark: '#ffffff',
  textOnDarkSecondary: '#94a3b8',
  textOnDarkMuted: '#475569',
};

export type ColorType = keyof typeof colors;