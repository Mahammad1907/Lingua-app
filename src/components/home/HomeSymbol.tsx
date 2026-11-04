import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

export type HomeSymbolName = 'spark' | 'flame' | 'star' | 'analysis' | 'robot' | 'hand' | 'identity'
  | 'dialogue' | 'headphones' | 'mic' | 'puzzle' | 'speech' | 'cap' | 'repeat' | 'book' | 'person' | 'lock' | 'check';

// Vector artwork stays sharp at native device density. IDs are unique when the
// same symbol occurs twice, including simultaneous home/preview renders on web.
export function HomeSymbol({ name, size = 48, muted = false }: {
  name: HomeSymbolName; size?: number; muted?: boolean;
}) {
  const id = `hs${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const purple = `url(#${id}p)`;
  const orange = `url(#${id}o)`;
  const white = `url(#${id}w)`;
  const ink = muted ? '#B7B0C0' : '#7535BA';
  const body = muted ? white : purple;
  return <Svg width={size} height={size} viewBox="0 0 100 100" fill="none" accessible={false}>
    <Defs>
      <LinearGradient id={`${id}p`} x1="20%" y1="0%" x2="85%" y2="100%">
        <Stop offset="0" stopColor="#E3A0FF" /><Stop offset=".38" stopColor="#A343EE" /><Stop offset="1" stopColor="#6624C5" />
      </LinearGradient>
      <LinearGradient id={`${id}o`} x1="15%" y1="0%" x2="80%" y2="100%">
        <Stop offset="0" stopColor="#FFE888" /><Stop offset=".46" stopColor="#FFBB32" /><Stop offset="1" stopColor="#FF851B" />
      </LinearGradient>
      <LinearGradient id={`${id}w`} x1="0%" y1="0%" x2="90%" y2="100%">
        <Stop offset="0" stopColor="#FFFFFF" /><Stop offset=".5" stopColor="#F8F5FC" /><Stop offset="1" stopColor="#CFC9D7" />
      </LinearGradient>
    </Defs>
    {name === 'spark' && <>
      <Path d="m50 8 12 28 29 12-29 12-12 31-12-31L8 48l30-12Z" fill="#A349DC" transform="translate(0 4)" />
      <Path d="m50 5 12 29 29 12-29 12-12 31-12-31L8 46l30-12Z" fill={purple} stroke="#DFABFF" strokeWidth={2} strokeLinejoin="round" />
      <Path d="m49 12-7 24-23 10" stroke="#F6DFFF" strokeWidth={3} strokeLinecap="round" opacity={.8} />
    </>}
    {name === 'star' && <Path d="m50 8 13 26 29 5-21 21 5 30-26-14-26 14 5-30L8 39l29-5Z" fill={orange} stroke="#FFD867" strokeWidth={3} strokeLinejoin="round" />}
    {name === 'flame' && <><Path d="M56 5c10 27-5 26 4 44 9-6 10-15 11-20 23 25 21 62-16 64C18 97 11 74 22 49c3 13 8 15 11 17C25 39 45 34 56 5Z" fill={orange} /><Path d="M50 54c0 12-16 15-14 27 2 15 31 16 33-2 1-9-7-16-9-23-1 11-6 13-7 15-4-5-3-11-3-17Z" fill="#FFF1A0" /></>}
    {name === 'analysis' && <>
      <Ellipse cx={50} cy={89} rx={41} ry={5} fill="#9A52D6" opacity={.14} />
      {[{ x: 12, y: 58, h: 27 }, { x: 37, y: 38, h: 47 }, { x: 62, y: 15, h: 70 }].map((r, i) => <G key={i}>
        <Rect x={r.x} y={r.y + 3} width={22} height={r.h} rx={5} fill="#7420BF" />
        <Rect x={r.x} y={r.y} width={22} height={r.h} rx={5} fill={purple} />
        <Path d={`M${r.x + 4} ${r.y + r.h - 7}V${r.y + 8}q0-4 5-4`} stroke="#EDC5FF" strokeWidth={2.5} opacity={.8} strokeLinecap="round" />
      </G>)}
    </>}
    {name === 'robot' && <>
      <Path d="M50 26V12" stroke="#B77A43" strokeWidth={5} /><Circle cx={50} cy={10} r={7} fill={orange} />
      <Rect x={7} y={48} width={12} height={25} rx={6} fill={orange} /><Rect x={81} y={48} width={12} height={25} rx={6} fill={orange} />
      <Rect x={17} y={29} width={66} height={58} rx={20} fill="#BFB0CD" />
      <Rect x={17} y={25} width={66} height={58} rx={20} fill={white} stroke="#FFFFFF" strokeWidth={2} />
      <Rect x={24} y={35} width={52} height={37} rx={13} fill={purple} />
      <Path d="M33 49q5-8 10 0m14 0q5-8 10 0M42 59q8 8 16 0" stroke="white" strokeWidth={3.5} strokeLinecap="round" />
    </>}
    {name === 'hand' && <>
      <Path d="M28 56 18 42q-5-6-9-2-3 3 1 10l17 28q11 15 28 8 14-6 21-21l8-15q3-7-3-9-5-2-9 5l-6 10 5-34q1-7-5-8-6-1-7 6l-4 26 1-35q0-7-6-7t-6 7l-1 34-5-32q-1-7-7-6t-5 8l4 31-9-23q-3-7-8-4-5 2-2 9Z" fill={orange} stroke="#FFFFFF" strokeWidth={7} strokeLinejoin="round" />
      <Path d="M28 56 18 42q-5-6-9-2-3 3 1 10l17 28q11 15 28 8 14-6 21-21l8-15q3-7-3-9-5-2-9 5l-6 10 5-34q1-7-5-8-6-1-7 6l-4 26 1-35q0-7-6-7t-6 7l-1 34-5-32q-1-7-7-6t-5 8l4 31-9-23q-3-7-8-4-5 2-2 9Z" fill={orange} stroke="#F49C21" strokeWidth={1.5} />
      <Path d="M42 57q16-2 18 13" stroke="#E58A19" strokeWidth={3} strokeLinecap="round" />
      <Path d="M78 16q10 6 10 18M79 5q18 8 19 29" stroke={purple} strokeWidth={5} strokeLinecap="round" />
    </>}
    {name === 'identity' && <>
      <Rect x={9} y={25} width={82} height={64} rx={11} fill="#C4B3D4" transform="translate(0 3)" />
      <Rect x={8} y={22} width={84} height={64} rx={11} fill={body} stroke="white" strokeWidth={5} />
      <Rect x={17} y={33} width={66} height={43} rx={6} fill={white} />
      <Path d="M41 26V15a10 10 0 0 1 20 0v11Z" fill={muted ? white : orange} stroke="white" strokeWidth={3} />
      <Circle cx={51} cy={14} r={3} fill="#BE7C2E" /><Circle cx={34} cy={48} r={7} fill={muted ? ink : purple} />
      <Path d="M23 68v-4a11 11 0 0 1 22 0v4Z" fill={muted ? ink : purple} />
      <Path d="M55 46h20M55 59h16" stroke={ink} strokeWidth={5} strokeLinecap="round" />
    </>}
    {name === 'dialogue' && <>
      <Path d="M62 10c19 0 31 10 31 24 0 9-5 16-13 20l3 12-17-8C44 59 30 48 30 34s13-24 32-24Z" fill={orange} stroke="white" strokeWidth={5} />
      <Path d="M37 34C18 34 7 44 7 58c0 9 4 16 13 20l-4 12 18-8c20 1 34-10 34-24S56 34 37 34Z" fill={purple} stroke="white" strokeWidth={5} />
      {[51, 63, 75].map(x => <Circle key={x} cx={x} cy={34} r={3} fill="white" />)}
      {[24, 36, 48].map(x => <Circle key={x} cx={x} cy={58} r={3} fill="white" />)}
    </>}
    {name === 'headphones' && <>
      <Ellipse cx={50} cy={89} rx={35} ry={5} fill="#7C1DBA" opacity={.16} />
      <Path d="M18 55V45a32 32 0 0 1 64 0v10" stroke="#5E20AE" strokeWidth={13} strokeLinecap="round" />
      <Path d="M18 49v-4a32 32 0 0 1 64 0v4" stroke={purple} strokeWidth={11} strokeLinecap="round" />
      <Path d="M22 31a29 29 0 0 1 47-12" stroke="#E4ADFF" strokeWidth={3} strokeLinecap="round" opacity={.8} />
      <Rect x={9} y={44} width={27} height={40} rx={12} fill={white} stroke="white" strokeWidth={2} />
      <Rect x={64} y={44} width={27} height={40} rx={12} fill={white} stroke="white" strokeWidth={2} />
      <Rect x={21} y={43} width={18} height={42} rx={9} fill={body} /><Rect x={61} y={43} width={18} height={42} rx={9} fill={body} />
      <Path d="M26 50v24M66 50v24" stroke={muted ? '#FFF' : '#D78CFF'} strokeWidth={3} strokeLinecap="round" />
    </>}
    {name === 'mic' && <>
      <Path d="M27 46v8a23 23 0 0 0 46 0v-8M50 78v12M35 91h30" stroke="#B3A9BF" strokeWidth={12} strokeLinecap="round" />
      <Path d="M27 43v8a23 23 0 0 0 46 0v-8M50 75v12M35 88h30" stroke="white" strokeWidth={9} strokeLinecap="round" />
      <Rect x={34} y={8} width={32} height={54} rx={16} fill={white} stroke="white" strokeWidth={5} />
      <Rect x={41} y={14} width={18} height={40} rx={9} fill={muted ? '#C2BDCA' : purple} />
    </>}
    {name === 'puzzle' && <>
      <Path d="M19 29h19c-8-18 20-22 19 0h22v20c22-3 23 24 0 20v18H57c6-23-23-24-19 0H19V66c-22 7-24-23 0-19Z" fill="#B8B0C4" stroke="#B8B0C4" strokeWidth={8} strokeLinejoin="round" transform="translate(0 4)" />
      <Path d="M19 27h19c-8-18 20-22 19 0h22v20c22-3 23 24 0 20v18H57c6-23-23-24-19 0H19V64c-22 7-24-23 0-19Z" fill={muted ? white : purple} stroke="white" strokeWidth={6} strokeLinejoin="round" />
    </>}
    {name === 'speech' && <>
      <Path d="M50 13c24 0 41 14 41 32S74 78 50 78H34L15 90l5-23C-1 46 14 13 50 13Z" fill="#B4ABBF" transform="translate(0 4)" />
      <Path d="M50 10c24 0 41 14 41 32S74 75 50 75H34L15 87l5-23C-1 43 14 10 50 10Z" fill={body} stroke="white" strokeWidth={5} />
      {[32, 50, 68].map(x => <Circle key={x} cx={x} cy={43} r={4} fill={muted ? ink : '#FFF'} />)}
    </>}
    {name === 'cap' && <>
      <Path d="M25 47v28q25 18 50 0V47" fill={purple} stroke="#7A2FC5" strokeWidth={2} />
      <Path d="m5 33 45-20 45 20-45 20Z" fill={purple} stroke="#DDB0F7" strokeWidth={2} strokeLinejoin="round" />
      <Path d="M88 38v34" stroke="#FFB330" strokeWidth={4} strokeLinecap="round" /><Circle cx={88} cy={75} r={5} fill={orange} />
    </>}
    {name === 'repeat' && <Path d="M18 43a33 33 0 0 1 58-17l9 10M82 57a33 33 0 0 1-58 17L15 64M85 14v22H63M15 86V64h22" stroke={ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />}
    {name === 'book' && <Path d="M50 23Q28 8 8 20v61q22-12 42 1 20-13 42-1V20Q72 8 50 23v59" stroke={ink} strokeWidth={7} strokeLinejoin="round" />}
    {name === 'person' && <><Circle cx={50} cy={27} r={16} stroke={ink} strokeWidth={7} /><Path d="M17 86v-9a33 27 0 0 1 66 0v9Z" stroke={ink} strokeWidth={7} strokeLinejoin="round" /></>}
    {name === 'lock' && <><Path d="M31 44V29a19 19 0 0 1 38 0v15" stroke={ink} strokeWidth={10} /><Rect x={22} y={40} width={56} height={49} rx={10} fill={muted ? '#B6ACBF' : purple} /><Path d="M50 58v13" stroke="white" strokeWidth={6} strokeLinecap="round" /></>}
    {name === 'check' && <Path d="m22 50 19 19 37-43" stroke="white" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>;
}
