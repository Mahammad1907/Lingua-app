import Svg, { Circle, Path, Rect } from 'react-native-svg';
export type HomeIconName = 'home' | 'repeat' | 'book' | 'person' | 'chevron' | 'check' | 'lock' | 'bolt' | 'down' | 'arrow' | 'close';
export function HomeIcon({ name, color = '#ac93f4', size = 24, filled = false }: {
  name: HomeIconName; color?: string; size?: number; filled?: boolean;
}) {
  return <Svg width={size} height={size} viewBox="0 0 28 28" fill="none" accessibilityElementsHidden>
    {name === 'home' && <><Path d="m3 12 11-9 11 9" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 11v13h6v-8h4v8h6V11L14 4Z" stroke={color} fill={filled ? color : 'none'} strokeWidth={2} strokeLinejoin="round" /></>}
    {name === 'repeat' && <><Path d="M5 10a10 10 0 0 1 17-3l3 3M23 18A10 10 0 0 1 6 21l-3-3M25 4v6h-6M3 24v-6h6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></>}
    {name === 'book' && <Path d="M14 6Q8 2 3 5v18q6-3 11 1 5-4 11-1V5q-5-3-11 1v18" stroke={color} strokeWidth={2} strokeLinejoin="round" />}
    {name === 'person' && <><Circle cx={14} cy={8} r={5.3} fill={color} /><Path d="M3 26v-2a11 11 0 0 1 22 0v2Z" fill={color} /></>}
    {name === 'chevron' && <Path d="m10 5 8 9-8 9" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />}
    {name === 'down' && <Path d="m7 10 7 7 7-7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />}
    {name === 'check' && <Path d="m7 14 5 5 10-11" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}
    {name === 'lock' && <><Path d="M8 12V8a6 6 0 0 1 12 0v4" stroke={color} strokeWidth={2.5} /><Rect x={5} y={11} width={18} height={15} rx={3} fill={color} /><Path d="M14 17v4" stroke="#16182d" strokeWidth={2.5} strokeLinecap="round" /></>}
    {name === 'bolt' && <Path d="m16 1-11 15h8l-2 11L24 11h-9l4-10Z" fill={color} />}
    {name === 'arrow' && <Path d="M4 14h20m-8-8 8 8-8 8" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />}
    {name === 'close' && <Path d="m7 7 14 14M21 7 7 21" stroke={color} strokeWidth={2.4} strokeLinecap="round" />}
  </Svg>;
}
