import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { d } from './theme';

export type IconName = 'back' | 'dots' | 'bulb' | 'play' | 'pause' | 'turtle' | 'mic' | 'flag' | 'close' | 'check' | 'alert'
  | 'muted' | 'doc' | 'wave' | 'chat' | 'bye' | 'arrow' | 'tag' | 'layers' | 'speaker' | 'retry' | 'stop';

export default function Icon({ name, size = 22, color = d.purple, stroke = 2 }: { name: IconName; size?: number; color?: string; stroke?: number }) {
  const p = { stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    {name === 'back' ? <Path d="M15 5l-7 7 7 7" {...p} /> : null}
    {name === 'arrow' ? <Path d="M4 12h15M13 6l6 6-6 6" {...p} /> : null}
    {name === 'dots' ? <><Circle cx={12} cy={5} r={1.8} fill={color} /><Circle cx={12} cy={12} r={1.8} fill={color} /><Circle cx={12} cy={19} r={1.8} fill={color} /></> : null}
    {name === 'bulb' ? <><Path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0012 3z" {...p} /><Path d="M12 0.5v0M3 5l1 1M21 5l-1 1" {...p} /></> : null}
    {name === 'play' ? <Path d="M8 5.5v13l11-6.5z" fill={color} /> : null}
    {name === 'pause' ? <><Rect x={7} y={5} width={3.5} height={14} rx={1} fill={color} /><Rect x={13.5} y={5} width={3.5} height={14} rx={1} fill={color} /></> : null}
    {name === 'turtle' ? <><Path d="M4 14c0-4 3.6-7 8-7s8 3 8 7H4z" {...p} /><Path d="M8 9.5l2 4.5M16 9.5l-2 4.5M12 7v7" {...p} /><Path d="M20 13.5c1.2 0 2-.8 2-2s-1-1.8-2-1.5" {...p} /><Path d="M6.5 14v2.5M17.5 14v2.5" {...p} /></> : null}
    {name === 'mic' ? <><Rect x={9} y={3} width={6} height={11} rx={3} {...p} /><Path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M8.5 21h7" {...p} /></> : null}
    {name === 'flag' ? <Path d="M5 21V4M5 4h11l-2 4 2 4H5" {...p} /> : null}
    {name === 'stop' ? <Rect x={6.5} y={6.5} width={11} height={11} rx={2.5} fill={color} /> : null}
    {name === 'close' ? <Path d="M6 6l12 12M18 6L6 18" {...p} /> : null}
    {name === 'check' ? <Path d="M5 12.5l4.5 4.5L19 7.5" {...p} /> : null}
    {name === 'alert' ? <><Circle cx={12} cy={12} r={9.5} {...p} /><Path d="M12 7v6.5" {...p} /><Circle cx={12} cy={16.8} r={1.2} fill={color} /></> : null}
    {name === 'muted' ? <><Path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" {...p} /><Path d="M16 10l4 4M20 10l-4 4" {...p} /></> : null}
    {name === 'speaker' ? <><Path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" {...p} /><Path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" {...p} /></> : null}
    {name === 'doc' ? <><Path d="M7 3h7l4 4v14H7z" {...p} /><Path d="M14 3v4h4M10 12h5M10 15.5h5M10 9h2" {...p} /></> : null}
    {name === 'wave' ? <Path d="M8 13V6.5a1.5 1.5 0 013 0V12M11 11V4.5a1.5 1.5 0 013 0V11M14 11V6a1.5 1.5 0 013 0v7c0 4-2.5 7-6.5 7-3 0-4.5-2-6-4.5l-1.5-2.5a1.5 1.5 0 012.6-1.5L8 13" {...p} /> : null}
    {name === 'chat' ? <><Path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3H10l-5 4v-4.3A3 3 0 014 13z" {...p} /><Circle cx={8.5} cy={9.5} r={1} fill={color} /><Circle cx={12} cy={9.5} r={1} fill={color} /><Circle cx={15.5} cy={9.5} r={1} fill={color} /></> : null}
    {name === 'bye' ? <><Path d="M9 13V6.5a1.5 1.5 0 013 0V12M12 11V4.5a1.5 1.5 0 013 0V11M15 11V6a1.5 1.5 0 013 0v7c0 4-2.5 7-6.5 7-3 0-4.5-2-6-4.5L4 13a1.5 1.5 0 012.6-1.5L9 14" {...p} /><Path d="M2 15c0 2 1 4 2.5 5M20.5 4.5c1 1 1.5 2.5 1.5 4" {...p} /></> : null}
    {name === 'tag' ? <><Path d="M3 12V4h8l10 10-8 8z" {...p} /><Circle cx={7.5} cy={8} r={1.4} fill={color} /></> : null}
    {name === 'layers' ? <><Path d="M12 3l9 5-9 5-9-5z" {...p} /><Path d="M3 12.5l9 5 9-5M3 16.5l9 5 9-5" {...p} /></> : null}
    {name === 'retry' ? <><Path d="M4 12a8 8 0 1 0 2.4-5.7" {...p} /><Path d="M4 4v4.5h4.5" {...p} /></> : null}
  </Svg>;
}
