// Duotone lesson icons for the map (25 Nov 2026): royal purple + soft lavender, a small warm-orange accent.
// Drawn in code (no emoji, no picture files). `white` = the icon on the orange “current lesson” node.
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { d } from '../design/theme';

export type LessonIconName = 'wave' | 'idcard' | 'ask' | 'heart' | 'thanks' | 'sorry' | 'headphones' | 'chats' | 'digits' | 'phone'
  | 'letters' | 'spell' | 'mail' | 'cake' | 'form' | 'globe' | 'flag' | 'passport' | 'yesno' | 'pin' | 'home' | 'lang' | 'who'
  | 'family' | 'pair' | 'tag' | 'briefcase';

export default function LessonIcon({ name, size = 28, white }: { name: LessonIconName; size?: number; white?: boolean }) {
  const P = white ? '#FFFFFF' : d.purple;           // main
  const L = white ? 'rgba(255,255,255,.45)' : '#C4B5FD'; // duotone fill
  const O = white ? '#FFFFFF' : '#F97316';          // accent
  const st = { stroke: P, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const bubble = 'M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v6a3.5 3.5 0 0 1-3.5 3.5H11l-4.5 4v-4A3.5 3.5 0 0 1 4 12.5z';
  const g = (() => {
    switch (name) {
      case 'wave': return <><Path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6.5 7-3 0-4.5-2-6-4.5L3 13a1.5 1.5 0 0 1 2.6-1.5L8 14" fill={L} {...st} /><Path d="M19.5 3.5c1 .8 1.6 2 1.6 3.3" {...st} stroke={O} /></>;
      case 'idcard': return <><Rect x={3} y={6} width={18} height={13} rx={2.5} fill={L} {...st} /><Circle cx={8.5} cy={12} r={2} fill={P} /><Path d="M6 16.5c.5-1.3 1.5-2 2.5-2s2 .7 2.5 2M13.5 11h4.5M13.5 14h3" {...st} /><Rect x={10} y={3.5} width={4} height={3.5} rx={1} fill={O} /></>;
      case 'ask': return <><Path d={bubble} fill={L} {...st} /><Path d="M10 8a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2v.5" {...st} /><Circle cx={12} cy={13.6} r={.9} fill={O} /></>;
      case 'heart': return <><Path d={bubble} fill={L} {...st} /><Path d="M12 13s-3-1.8-3-3.6A1.6 1.6 0 0 1 12 8.6a1.6 1.6 0 0 1 3 .8C15 11.2 12 13 12 13z" fill={O} stroke={O} strokeWidth={1} strokeLinejoin="round" /></>;
      case 'thanks': return <><Path d="M12 20s-7.5-4.3-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.7-7.5 10-7.5 10z" fill={L} {...st} /><Path d="M12 10.2l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" fill={P} /><Circle cx={18.5} cy={4.5} r={1.2} fill={O} /></>;
      case 'sorry': return <><Path d={bubble} fill={L} {...st} /><Path d="M9 9.5a3.2 3.2 0 1 0 1-2.3M9 6v2.2h2.2" {...st} stroke={O} /></>;
      case 'headphones': return <><Path d="M4 15v-3a8 8 0 0 1 16 0v3" {...st} /><Rect x={3.5} y={13.5} width={4} height={6.5} rx={1.6} fill={L} {...st} /><Rect x={16.5} y={13.5} width={4} height={6.5} rx={1.6} fill={L} {...st} /><Circle cx={18.5} cy={5} r={2.4} fill={O} /><Path d="M18.5 4.2v1.1" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" /></>;
      case 'chats': return <><Path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h8A2.5 2.5 0 0 1 16 5.5v4a2.5 2.5 0 0 1-2.5 2.5H8l-3.5 3v-3A2.5 2.5 0 0 1 3 9.5z" fill={L} {...st} /><Path d="M10 14.5a2.5 2.5 0 0 0 2.5 2.5H17l3 2.5V17a2 2 0 0 0 1-1.8v-4A2.5 2.5 0 0 0 18.5 9" {...st} /><Circle cx={7} cy={7.5} r={.9} fill={O} /><Circle cx={10} cy={7.5} r={.9} fill={P} /></>;
      case 'digits': return <><Rect x={2.5} y={5} width={19} height={14} rx={3.5} fill={L} stroke="none" /><SvgText x={12} y={15.8} fontSize={9.5} fontWeight="900" fill={P} textAnchor="middle">123</SvgText><Circle cx={19.5} cy={5.5} r={1.6} fill={O} /></>;
      case 'phone': return <><Path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" fill={L} {...st} /><Path d="M15 3.5a5.5 5.5 0 0 1 5.5 5.5" {...st} stroke={O} /></>;
      case 'letters': return <><Rect x={2.5} y={5} width={19} height={14} rx={3.5} fill={L} stroke="none" /><SvgText x={12} y={16} fontSize={10.5} fontWeight="900" fill={P} textAnchor="middle">Aa</SvgText></>;
      case 'spell': return <><Rect x={2.5} y={7} width={8.5} height={10} rx={2.2} fill={L} {...st} /><Rect x={13} y={7} width={8.5} height={10} rx={2.2} fill="none" {...st} /><SvgText x={6.75} y={14.6} fontSize={7} fontWeight="900" fill={P} textAnchor="middle">A</SvgText><SvgText x={17.25} y={14.6} fontSize={7} fontWeight="900" fill={O} textAnchor="middle">B</SvgText></>;
      case 'mail': return <><Rect x={3} y={5.5} width={18} height={13} rx={2.5} fill={L} {...st} /><Path d="M4 7l8 6 8-6" {...st} /><Circle cx={19.5} cy={5.5} r={2} fill={O} /></>;
      case 'cake': return <><Rect x={4} y={11} width={16} height={9} rx={2} fill={L} {...st} /><Path d="M4 15c2 1.2 4 1.2 6 0s4-1.2 6 0 3 1 4 .5M12 11V8" {...st} /><Path d="M12 3.5c1 1.2 1 2.3 0 3-1-.7-1-1.8 0-3z" fill={O} /></>;
      case 'form': return <><Rect x={5} y={3} width={14} height={18} rx={2.5} fill={L} {...st} /><Path d="M8.5 8h7M8.5 12h7M8.5 16h4" {...st} /><Circle cx={16} cy={16} r={1.5} fill={O} /></>;
      case 'globe': return <><Circle cx={12} cy={12} r={8.5} fill={L} {...st} /><Path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.3 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.3-3.5-8.5s1-6 3.5-8.5z" {...st} /><Circle cx={17.5} cy={6.5} r={1.6} fill={O} /></>;
      case 'flag': return <><Path d="M5 21V4" {...st} /><Path d="M5 4.5h11.5l-2 3.8 2 3.7H5z" fill={L} {...st} /><Circle cx={10} cy={8.2} r={1.5} fill={O} /></>;
      case 'passport': return <><Rect x={5} y={3} width={14} height={18} rx={2.5} fill={L} {...st} /><Circle cx={12} cy={10.5} r={3} {...st} /><Path d="M9 10.5h6M12 7.5c1 .9 1 5.1 0 6M9 16.5h6" {...st} /><Circle cx={16.5} cy={5.5} r={1.1} fill={O} /></>;
      case 'yesno': return <><Circle cx={8} cy={12} r={5.5} fill={L} {...st} /><Path d="M5.8 12.2l1.6 1.6 3-3.2" {...st} /><Circle cx={16.5} cy={12} r={5} fill="none" stroke={O} strokeWidth={1.9} /><Path d="M14.8 10.3l3.4 3.4M18.2 10.3l-3.4 3.4" stroke={O} strokeWidth={1.9} strokeLinecap="round" /></>;
      case 'pin': return <><Path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" fill={L} {...st} /><Circle cx={12} cy={10} r={2.4} fill={O} /></>;
      case 'home': return <><Path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" fill={L} {...st} /><Rect x={10} y={14} width={4} height={6.5} rx={1} fill={O} /></>;
      case 'lang': return <><Path d={bubble} fill={L} {...st} /><SvgText x={12} y={12.8} fontSize={7.5} fontWeight="900" fill={P} textAnchor="middle">EN</SvgText><Circle cx={18.5} cy={4} r={1.6} fill={O} /></>;
      case 'who': return <><Circle cx={10} cy={8} r={3.5} fill={L} {...st} /><Path d="M3.5 20c.8-3.8 3.4-5.8 6.5-5.8s5.7 2 6.5 5.8" fill={L} {...st} /><Path d="M17 4.5a2.3 2.3 0 1 1 3.2 2.1c-.6.3-.9.7-.9 1.3" stroke={O} strokeWidth={1.8} strokeLinecap="round" fill="none" /><Circle cx={19.3} cy={10.2} r={.9} fill={O} /></>;
      case 'family': return <><Circle cx={7.5} cy={7.5} r={2.6} fill={L} {...st} /><Circle cx={16.5} cy={7.5} r={2.6} fill={L} {...st} /><Path d="M3 18.5c.4-3.2 2.2-5 4.5-5s4.1 1.8 4.5 5M12 18.5c.4-3.2 2.2-5 4.5-5s4.1 1.8 4.5 5" {...st} /><Circle cx={12} cy={15} r={1.8} fill={O} /></>;
      case 'pair': return <><Circle cx={8} cy={8} r={3} fill={L} {...st} /><Circle cx={16} cy={8} r={3} fill="none" {...st} /><Path d="M3.5 19c.5-3.3 2.3-5.2 4.5-5.2s4 1.9 4.5 5.2" fill={L} {...st} /><Path d="M11.5 19c.5-3.3 2.3-5.2 4.5-5.2s4 1.9 4.5 5.2" {...st} stroke={O} /></>;
      case 'tag': return <><Path d="M3 12V4h8l10 10-8 8z" fill={L} {...st} /><Circle cx={7.5} cy={8} r={1.6} fill={O} /></>;
      case 'briefcase': return <><Rect x={3} y={7} width={18} height={13} rx={2.5} fill={L} {...st} /><Path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" {...st} /><Rect x={10.5} y={11} width={3} height={3} rx={.8} fill={O} /></>;
    }
  })();
  return <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{g}</Svg>;
}
