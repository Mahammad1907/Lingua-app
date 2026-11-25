// Solid lesson icons for the map (25 Nov 2026, user: “like the mockup” — bold filled royal purple glyphs with white
// details and a small warm-orange accent). Drawn in code (no emoji, no picture files).
// `white` = the icon on the orange “current lesson” node: white glyph, orange details.
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { d } from '../design/theme';

export type LessonIconName = 'wave' | 'idcard' | 'ask' | 'heart' | 'thanks' | 'sorry' | 'headphones' | 'chats' | 'digits' | 'phone'
  | 'letters' | 'spell' | 'mail' | 'cake' | 'form' | 'globe' | 'flag' | 'passport' | 'yesno' | 'pin' | 'home' | 'lang' | 'who'
  | 'family' | 'pair' | 'tag' | 'briefcase';

export default function LessonIcon({ name, size = 32, white }: { name: LessonIconName; size?: number; white?: boolean }) {
  const F = white ? '#FFFFFF' : d.purple;            // solid glyph
  const D = white ? '#EA580C' : '#FFFFFF';           // details drawn on the glyph
  const S = white ? 'rgba(255,255,255,.6)' : '#A78BFA'; // second, lighter glyph
  const O = white ? '#FFFFFF' : '#F97316';           // accent
  const line = (c: string, w = 1.8) => ({ stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' });
  const bubble = 'M3.5 6.5A3.5 3.5 0 0 1 7 3h10a3.5 3.5 0 0 1 3.5 3.5v6.5A3.5 3.5 0 0 1 17 16.5h-6L6 20.5v-4A3.5 3.5 0 0 1 3.5 13z';
  const g = (() => {
    switch (name) {
      case 'wave': return <><Path d="M7.5 12.5V6.2a1.6 1.6 0 0 1 3.2 0v4.6V4.6a1.6 1.6 0 0 1 3.2 0v6.2V6a1.6 1.6 0 0 1 3.2 0v7.5c0 4.4-2.7 7.5-7 7.5-3 0-4.6-1.8-6.2-4.6L2.7 13a1.7 1.7 0 0 1 2.8-1.8z" fill={F} /><Path d="M19.4 3.2c1.2.9 1.9 2.3 1.9 3.8" {...line(O, 2)} /></>;
      case 'idcard': return <><Rect x={2.5} y={5.5} width={19} height={14} rx={3} fill={F} /><Circle cx={8.3} cy={11.3} r={2.1} fill={D} /><Path d="M5.6 16.3c.6-1.4 1.6-2.1 2.7-2.1s2.1.7 2.7 2.1M13.5 10.5h4.6M13.5 14h3.2" {...line(D)} /><Rect x={10} y={3} width={4} height={4} rx={1.2} fill={O} /></>;
      case 'ask': return <><Path d={bubble} fill={F} /><Path d="M10 7.8a2.1 2.1 0 1 1 3 1.9c-.6.3-1 .8-1 1.4v.4" {...line(D, 2)} /><Circle cx={12} cy={13.6} r={1.1} fill={O} /></>;
      case 'heart': return <><Path d={bubble} fill={F} /><Path d="M12 13.4s-3.4-2-3.4-4.1A1.8 1.8 0 0 1 12 8.4a1.8 1.8 0 0 1 3.4.9c0 2.1-3.4 4.1-3.4 4.1z" fill={O} /></>;
      case 'thanks': return <><Path d="M12 20.5S3.5 15.6 3.5 9.3A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.5 2.6c0 6.3-8.5 11.2-8.5 11.2z" fill={F} /><Path d="M12 9.2l1 2.3 2.3 1-2.3 1-1 2.3-1-2.3-2.3-1 2.3-1z" fill={D} /><Circle cx={19.5} cy={4} r={1.5} fill={O} /></>;
      case 'sorry': return <><Path d={bubble} fill={F} /><Path d="M8.8 9.8a3.3 3.3 0 1 0 1.1-2.5M8.8 6v2.4h2.4" {...line(D, 2)} /><Circle cx={18.5} cy={5.5} r={1.4} fill={O} /></>;
      case 'headphones': return <><Path d="M4 15.5V12a8 8 0 0 1 16 0v3.5" {...line(F, 2.2)} /><Rect x={2.8} y={13} width={5} height={8} rx={2} fill={F} /><Rect x={16.2} y={13} width={5} height={8} rx={2} fill={F} /><Circle cx={18.6} cy={5.2} r={2.8} fill={O} /><Path d="M18.6 4.1v1.3" {...line('#fff', 1.4)} /><Circle cx={18.6} cy={6.6} r={.4} fill="#fff" /></>;
      case 'chats': return <><Path d="M2.5 5.5A3 3 0 0 1 5.5 2.5h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H8.5l-4 3.3V12.3a3 3 0 0 1-2-2.8z" fill={F} /><Path d="M11 14.5a3 3 0 0 0 3 3h3.5l3.5 3V17a2.7 2.7 0 0 0 1-2v-4A3 3 0 0 0 19 8h-1" fill={S} /><Circle cx={6.5} cy={7.5} r={1} fill={D} /><Circle cx={9.5} cy={7.5} r={1} fill={D} /><Circle cx={12.5} cy={7.5} r={1} fill={O} /></>;
      case 'digits': return <><Rect x={2} y={4.5} width={20} height={15} rx={4} fill={F} /><SvgText x={12} y={15.9} fontSize={9.5} fontWeight="900" fill={D} textAnchor="middle">123</SvgText></>;
      case 'phone': return <><Path d="M6.3 3h3.2l1.6 4.2-2.1 1.6a11.5 11.5 0 0 0 5.9 5.9l1.6-2.1 4.2 1.6v3.2a2.3 2.3 0 0 1-2.3 2.3A16.6 16.6 0 0 1 4 5.3 2.3 2.3 0 0 1 6.3 3z" fill={F} /><Path d="M15 3.2a6 6 0 0 1 5.8 5.8" {...line(O, 2)} /></>;
      case 'letters': return <><Rect x={2} y={4.5} width={20} height={15} rx={4} fill={F} /><SvgText x={12} y={16.3} fontSize={11} fontWeight="900" fill={D} textAnchor="middle">Aa</SvgText></>;
      case 'spell': return <><Rect x={2} y={6} width={9.5} height={12} rx={2.6} fill={F} /><Rect x={12.5} y={6} width={9.5} height={12} rx={2.6} fill={S} /><SvgText x={6.75} y={14.8} fontSize={8} fontWeight="900" fill={D} textAnchor="middle">A</SvgText><SvgText x={17.25} y={14.8} fontSize={8} fontWeight="900" fill={white ? '#EA580C' : d.purple} textAnchor="middle">B</SvgText></>;
      case 'mail': return <><Rect x={2.5} y={5} width={19} height={14} rx={3} fill={F} /><Path d="M4.5 7.5l7.5 5.7 7.5-5.7" {...line(D)} /><Circle cx={20} cy={5.5} r={2.3} fill={O} /></>;
      case 'cake': return <><Rect x={3.5} y={10.5} width={17} height={10} rx={2.5} fill={F} /><Path d="M3.8 15c2.1 1.3 4.2 1.3 6.3 0s4.2-1.3 6.3 0 3 1 4 .4" {...line(D)} /><Path d="M12 10.5V7.8" {...line(F, 2)} /><Path d="M12 2.8c1.2 1.4 1.2 2.7 0 3.5-1.2-.8-1.2-2.1 0-3.5z" fill={O} /></>;
      case 'form': return <><Rect x={4.5} y={2.5} width={15} height={19} rx={3} fill={F} /><Path d="M8 8h8M8 12h8M8 16h4.5" {...line(D)} /><Circle cx={16.3} cy={16.2} r={1.7} fill={O} /></>;
      case 'globe': return <><Circle cx={12} cy={12} r={9} fill={F} /><Path d="M3.5 12h17M12 3.3c2.6 2.6 3.7 5.5 3.7 8.7S14.6 18.1 12 20.7c-2.6-2.6-3.7-5.5-3.7-8.7S9.4 5.9 12 3.3z" {...line(D, 1.5)} /><Circle cx={18} cy={6} r={1.8} fill={O} /></>;
      case 'flag': return <><Path d="M5 21.5V3.5" {...line(F, 2.4)} /><Path d="M5.5 3.8h13l-2.3 4.4 2.3 4.3h-13z" fill={F} /><Circle cx={11} cy={8.2} r={1.8} fill={O} /></>;
      case 'passport': return <><Rect x={4.5} y={2.5} width={15} height={19} rx={3} fill={F} /><Circle cx={12} cy={10.3} r={3.2} {...line(D, 1.5)} /><Path d="M8.8 10.3h6.4M12 7.1c1.1 1 1.1 5.4 0 6.4M9 16.8h6" {...line(D, 1.5)} /><Circle cx={17} cy={5} r={1.3} fill={O} /></>;
      case 'yesno': return <><Circle cx={8.3} cy={12} r={6} fill={F} /><Path d="M5.8 12.2l1.7 1.8 3.3-3.6" {...line(D, 2)} /><Circle cx={17} cy={12} r={5} fill={O} /><Path d="M15.2 10.2l3.6 3.6M18.8 10.2l-3.6 3.6" {...line('#fff', 1.8)} /></>;
      case 'pin': return <><Path d="M12 21.5s-7-6-7-11.7a7 7 0 0 1 14 0C19 15.5 12 21.5 12 21.5z" fill={F} /><Circle cx={12} cy={9.8} r={2.8} fill={O} /></>;
      case 'home': return <><Path d="M3.5 10.5L12 3.5l8.5 7V19a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" fill={F} /><Rect x={9.8} y={13.5} width={4.4} height={7.5} rx={1.2} fill={O} /></>;
      case 'lang': return <><Path d={bubble} fill={F} /><SvgText x={12} y={12.9} fontSize={8} fontWeight="900" fill={D} textAnchor="middle">EN</SvgText><Circle cx={19} cy={4} r={1.8} fill={O} /></>;
      case 'who': return <><Circle cx={9.5} cy={7.8} r={4} fill={F} /><Path d="M2.5 20.5c.8-4 3.7-6.2 7-6.2s6.2 2.2 7 6.2z" fill={F} /><Path d="M16.8 4.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.4" {...line(O, 2)} /><Circle cx={19.2} cy={10.3} r={1} fill={O} /></>;
      case 'family': return <><Circle cx={7.3} cy={7.3} r={3} fill={F} /><Circle cx={16.7} cy={7.3} r={3} fill={F} /><Path d="M2.3 19c.4-3.6 2.4-5.6 5-5.6s4.6 2 5 5.6zM11.7 19c.4-3.6 2.4-5.6 5-5.6s4.6 2 5 5.6z" fill={F} /><Circle cx={12} cy={14.8} r={2.2} fill={O} /></>;
      case 'pair': return <><Circle cx={7.8} cy={8} r={3.3} fill={F} /><Circle cx={16.2} cy={8} r={3.3} fill={S} /><Path d="M2.5 20c.5-3.7 2.6-5.8 5.3-5.8s4.8 2.1 5.3 5.8z" fill={F} /><Path d="M10.9 20c.5-3.7 2.6-5.8 5.3-5.8s4.8 2.1 5.3 5.8z" fill={O} /></>;
      case 'tag': return <><Path d="M2.5 12.3V4a1.5 1.5 0 0 1 1.5-1.5h8.3L21.5 11.7 12.7 20.5z" fill={F} /><Circle cx={7.5} cy={7.5} r={2} fill={O} /></>;
      case 'briefcase': return <><Path d="M9 6.5V5a1.8 1.8 0 0 1 1.8-1.8h2.4A1.8 1.8 0 0 1 15 5v1.5" {...line(F, 2)} /><Rect x={2.5} y={6.5} width={19} height={14} rx={3} fill={F} /><Path d="M2.8 12.5h18.4" {...line(D, 1.5)} /><Rect x={10.3} y={11} width={3.4} height={3.4} rx={1} fill={O} /></>;
    }
  })();
  return <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{g}</Svg>;
}
