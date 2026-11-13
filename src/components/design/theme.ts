// Light lesson design (approved mockups, 12 noyabr 2026): light lavender background,
// dark plum headings, purple and orange accents, rounded corners, thin borders, soft shadows.
export const d = {
  bg: '#EFE6FB',
  surface: '#F7F2FE',
  surfaceStrong: '#FFFFFF',
  border: '#D8C8F5',
  borderStrong: '#B79CF0',
  ink: '#2A1240',
  inkSoft: '#4B3566',
  lavender: '#8E63E8',          // decorative only (waveform, borders)
  lavenderText: '#6B45C8',      // readable text on the light background (≥5:1)
  purple: '#5B1FD1',
  purpleSoft: '#E6DAFB',
  purpleDisabled: '#CFC2E6',
  purpleDisabledText: '#8E80A6',
  orange: '#F27A12',
  orangeSoft: '#FFE3C7',
  green: '#169A3A',
  greenSoft: '#DDF4E3',
  red: '#DC2626',
  redSoft: '#F8DCE3',
  yellow: '#F4C430',
  shadow: '#6A3FC4',
};

export const shadow = { shadowColor: d.shadow, shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 } as const;
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
