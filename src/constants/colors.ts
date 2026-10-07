export const colors = {
  // ═══════════════════════════════════════
  // KÖHNƏ (TOXUNULMUR) — Mövcud kod bunları istifadə edir
  // ═══════════════════════════════════════
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

  // ═══════════════════════════════════════
  // KÖHNƏ (TOXUNULMUR) — Əvvəlki əlavələr
  // ═══════════════════════════════════════
  bgBase: '#0a0e1a',
  bgElevated: '#0f1420',
  bgCard: '#131a2b',
  bgCardActive: '#1a2340',
  accentPurple: '#8b5cf6',
  accentPurpleDark: '#7c3aed',
  accentBlue: '#3b82f6',
  accentBlueDark: '#2563eb',
  accentGreen: '#22c55e',
  accentOrange: '#f97316',
  moduleActive: '#8b5cf6',
  moduleActiveBg: 'rgba(139, 92, 246, 0.15)',
  moduleLocked: '#f97316',
  moduleLockedBg: 'rgba(249, 115, 22, 0.1)',
  moduleCompleted: '#22c55e',
  moduleCompletedBg: 'rgba(34, 197, 94, 0.15)',
  textOnDark: '#ffffff',
  textOnDarkSecondary: '#94a3b8',
  textOnDarkMuted: '#475569',

  // ═══════════════════════════════════════
  // YENİ — MƏRKƏZLƏŞDİRİLMİŞ KATEQORİYALAR
  // ═══════════════════════════════════════

  // ─── FON ───
  bg: {
    main: '#0a0a1a',
    alt: '#0d0d20',
    card: '#13132b',
    cardLight: '#1a1a35',
    elevated: '#0f1420',
    base: '#0a0e1a',
    cardAlt: '#131a2b',
    cardActive: '#1a2340',
  },

  // ─── MƏTN ───
  txt: {
    primary: '#ffffff',
    secondary: '#a1a1aa',
    muted: '#52525b',
    accent: '#c4b5fd',
    onDark: '#ffffff',
    onDarkSecondary: '#94a3b8',
    onDarkMuted: '#475569',
  },

  // ─── BREND RƏNGLƏR ───
  brand: {
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryDark: '#7c3aed',
    primaryAlt: '#a855f7',
    secondary: '#06b6d4',
    accent: '#ec4899',
    indigo: '#6366f1',
  },

  // ═══ MASKOT VURĞU RƏNGLƏRİ (FOX) ═══
  mascot: {
    orange: '#f97316',
    orangeDark: '#ea580c',
    orangeLight: '#fb923c',
    gradient: ['#fb923c', '#f97316', '#ea580c'] as const,
    gradientSoft: [
      'rgba(249, 115, 22, 0.15)',
      'rgba(234, 88, 12, 0.1)',
    ] as const,
    bgSoft: 'rgba(249, 115, 22, 0.1)',
    bgMedium: 'rgba(249, 115, 22, 0.2)',
    border: 'rgba(249, 115, 22, 0.3)',
    borderStrong: 'rgba(249, 115, 22, 0.5)',
  },

  // ─── STATUS ───
  status: {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    heart: '#ef4444',
    xp: '#fbbf24',
    streak: '#f97316',
  },

  // ─── BORDER ───
  brd: {
    default: 'rgba(139, 92, 246, 0.15)',
    light: 'rgba(139, 92, 246, 0.25)',
    focus: 'rgba(139, 92, 246, 0.6)',
    glow: 'rgba(139, 92, 246, 0.4)',
    strong: 'rgba(139, 92, 246, 0.5)',
    muted: 'rgba(82, 82, 91, 0.4)',
  },

  // ─── MODUL RƏNGLƏRİ ───
  mod: {
    colors: ['#f97316', '#06b6d4', '#22c55e', '#ef4444', '#a855f7'],
    orange: '#f97316',
    cyan: '#06b6d4',
    green: '#22c55e',
    red: '#ef4444',
    purple: '#a855f7',
  },

  // ─── GRADIENT-LƏR ───
  grad: {
    main: ['#0a0a1a', '#1e1b4b', '#0a0a1a'] as const,
    button: ['#06b6d4', '#8b5cf6', '#ec4899'] as const,
    retryButton: ['#06b6d4', '#8b5cf6'] as const,
    statsCard: ['#1e1b4b', '#4c1d95', '#7c3aed'] as const,
    avatar: ['#6366f1', '#a855f7'] as const,
    primaryButton: ['#8b5cf6', '#06b6d4'] as const,
  },

  // ─── KÖMƏKÇI RƏNGLƏR ───
  helper: {
    purple: '#8b5cf6',
    pink: '#ec4899',
    teal: '#14b8a6',
    blue: '#3b82f6',
    indigo: '#6366f1',
    violet: '#a855f7',
    grayDisabled: '#3f3f46',
    grayMuted: '#52525b',
  },
};

export type ColorType = keyof typeof colors;