import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

export const darkLessonColors = { bg: '#090C20', card: '#15162F', border: '#39315E', text: '#F6F3FF', muted: '#ADA5CC', violet: '#B597F7', orange: '#FFAB38', mint: '#58E4C1' };
export const lightLessonColors = { bg: '#F7F0FF', card: '#FFFBFF', border: '#DEC8F0', text: '#301341', muted: '#79578C', violet: '#8735C9', orange: '#AB5008', mint: '#237951' };
const LessonTheme = createContext(false);
export function LessonThemeProvider({ light, children }: PropsWithChildren<{ light: boolean }>) {
  return <LessonTheme.Provider value={light}>{children}</LessonTheme.Provider>;
}
export function useLessonTheme() {
  const light = useContext(LessonTheme);
  return { light, colors: light ? lightLessonColors : darkLessonColors };
}

// Adapt the existing control geometry through semantic paint roles. The context
// is confined to packet lessons; profile, home, exams and legacy routes keep theirs.
const textPaint: Record<string, string> = {
  '#58E4C1': '#237951', '#8CF0D3': '#237951', '#E9FFF5': '#237951', '#FAFFFC': '#237951',
  '#FFAB38': '#AB5008', '#FFD2A5': '#9C4815', '#F4D889': '#9C4815', '#FFD18D': '#9C4815',
  '#FFB5A7': '#A03B4B', '#FFB2A2': '#A03B4B', '#FFB59F': '#A03B4B',
  '#B597F7': '#8735C9', '#C8B3FF': '#8735C9', '#C2B2FF': '#8735C9', '#C1B0F2': '#8735C9', '#BDB0F2': '#79578C',
  '#ADA5CC': '#79578C', '#C5BBE3': '#79578C', '#D3C8EA': '#79578C', '#D1EDDF': '#237951',
};
const backgroundPaint: Record<string, string> = {
  '#090C20': '#F7F0FF', '#15162F': '#FFFBFF', '#15143F': '#F0E1FC', '#201D57': '#EEDBFB',
  '#282342': '#E7D5F3', '#312557': '#E0C8F0', '#2B2334': '#FFF0DE', '#322330': '#FFF0DE',
  '#143535': '#E9F7EE', '#173235': '#E9F7EE', '#133431': '#E9F7EE', '#12302F': '#E9F7EE', '#1D443D': '#E9F7EE',
  '#332B51': '#EEDBFB', '#2B244A': '#EEDBFB', '#352632': '#FFF0DE', '#553252': '#FFF0DE',
  '#6236B0': '#8735C9', '#B63C4B': '#A03B4B', '#FFAB38': '#FFAA35',
  '#030615D9': '#30134166', '#040617BD': '#30134166', '#FFF8D8': '#FFF8D8',
};
const darkBorder = new Set(['#39315E', '#1D1C35', '#413A62', '#474068', '#372C79', '#3F329C', '#4A3C9C', '#6A588F', '#554681', '#403868']);
export function lessonLightStyle<T extends object>(style: T): T {
  const next = { ...style } as Record<string, unknown>;
  for (const [key, value] of Object.entries(next)) {
    if (typeof value !== 'string' || !value.startsWith('#')) continue;
    const hex = value.toUpperCase();
    if (key === 'color') next[key] = textPaint[hex] || lightLessonColors.text;
    else if (key === 'backgroundColor') next[key] = backgroundPaint[hex] || '#FFFBFF';
    else if (/^border.*Color$/.test(key)) next[key] = hex === '#58E4C1' ? '#82BA96' : hex === '#FFAB38' ? '#F2A43F' : darkBorder.has(hex) ? lightLessonColors.border : '#C9A7E4';
  }
  return next as T;
}
export function useLessonStyles<T extends StyleSheet.NamedStyles<T>>(styles: T): T {
  const { light } = useLessonTheme();
  return useMemo(() => light ? Object.fromEntries(Object.entries(styles).map(([key, value]) => [key, lessonLightStyle(StyleSheet.flatten(value as object))])) as T : styles, [light, styles]);
}
