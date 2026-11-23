// Light lesson design (user's new style, 23 noyabr 2026): neutral light background (#F8F8FA), pure white cards and fields
// with thin cool-grey borders, brand purple (#5B21B6) only for focus and main actions, soft shadows.
export const d = {
  bg: '#F8F8FA',
  surface: '#FFFFFF',
  surfaceStrong: '#FFFFFF',
  border: '#E2E4EC',
  borderStrong: '#CBCFDC',
  ink: '#2A1240',
  inkSoft: '#4B3566',
  lavender: '#8E63E8',          // decorative only (waveform, borders)
  lavenderText: '#6B45C8',      // readable text on the light background (≥5:1)
  purple: '#5B21B6',
  purpleSoft: '#EFE9FB',
  purpleDisabled: '#E3E0EE',
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
