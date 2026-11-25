// Light lesson design (user's new style, 23 noyabr 2026): neutral light background (#F8F8FA), pure white cards and fields
// with thin cool-grey borders, brand purple (#5B21B6) only for focus and main actions, soft shadows.
export const d = {
  bg: '#F6F7FB',                 // cool off-white canvas (25 Nov 2026 design system)
  surface: '#FFFFFF',
  surfaceStrong: '#FFFFFF',
  border: '#E2E4EC',
  track: '#E5E7EB',
  borderStrong: '#CBCFDC',
  ink: '#1C1A2E',               // near-black navy, as in the approved mockup
  inkSoft: '#6B6F82',           // cool grey for subtitles and ghost buttons (≥5:1 on white)
  lavender: '#8E63E8',          // decorative only (waveform, borders)
  lavenderText: '#6B45C8',      // readable text on the light background (≥5:1)
  purple: '#5B21B6',
  action: '#EA580C',             // warm orange (25 Nov 2026): progress bar + forward buttons, everywhere
  actionLight: '#F97316',        // top of the orange gradient
  actionHot: '#FF8A1F',          // progress bar during a streak of 3+ correct answers             // mascot orange, darker so white text reads (≥3:1): progress, main Play, active main button
  purpleSoft: '#EDE9FE',
  purpleTint: '#F5F3FF',         // selected option background
  violet: '#6D28D9',
  violetLight: '#7C3AED',
  lavenderMist: '#C4B5FD',
  slate: '#475569',              // task subtitle (≥7:1 on the canvas)
  title: '#0F172A',
  purpleDisabled: '#E5E4F0',
  purpleDisabledText: '#9A94B3',
  orange: '#F27A12',
  orangeSoft: '#FFE3C7',
  green: '#169A3A',
  greenSoft: '#DDF4E3',
  red: '#DC2626',
  redSoft: '#F8DCE3',
  yellow: '#F4C430',
  // Text versions of the accent colors (WCAG AA ≥4.5:1 on the light backgrounds) — 14 Nov 2026 audit.
  orangeText: '#A84A08',
  greenText: '#0F6E2A',
  redText: '#B42318',
  shadow: '#5B4B9A',
};

export const shadow = { shadowColor: d.shadow, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 } as const;
export const radius = { card: 22, field: 16, pill: 999 };

/**
 * Nunito, loaded once in src/app/_layout.tsx. Each weight is its own file, so styles use the family
 * (not fontWeight) — Android cannot pick weights from one custom family.
 */
export const font = {
  regular: { fontFamily: 'Nunito-Regular' },
  semibold: { fontFamily: 'Nunito-SemiBold' },
  bold: { fontFamily: 'Nunito-Bold' },
  extrabold: { fontFamily: 'Nunito-ExtraBold' },
} as const;
