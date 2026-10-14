import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Local vector portraits: no network request, generated picture or extra package.
export default function ConversationAvatar({ person = 'alex', size = 42 }: { person?: 'alex' | 'emma'; size?: number }) {
  const emma = person === 'emma';
  return <Svg width={size} height={size} viewBox="0 0 80 80" accessibilityLabel={emma ? 'Emma' : 'Alex'}>
    <Circle cx="40" cy="40" r="40" fill={emma ? '#5C486E' : '#55486B'} />
    {emma ? <Path d="M18 47 V29 Q17 8 40 9 Q64 9 62 31 V53 H18Z" fill="#654237" /> : null}
    <Path d="M11 80 Q13 56 32 55 H48 Q68 55 70 80Z" fill={emma ? '#C68D7B' : '#8373AF'} />
    <Rect x="34" y="47" width="12" height="16" rx="5" fill="#D89E7C" />
    <Path d="M23 26 Q40 9 57 26 V38 Q56 56 40 57 Q24 54 23 38Z" fill="#EFBB93" />
    <Path d={emma ? 'M21 33 Q24 8 44 14 Q62 14 58 37 Q50 29 42 22 Q32 34 21 33Z' : 'M21 32 Q16 13 32 14 Q35 5 50 13 Q65 15 59 35 L53 26 Q37 32 28 24 L25 34Z'} fill={emma ? '#654237' : '#392D31'} />
    <Circle cx="32" cy="37" r="2" fill="#392D31" /><Circle cx="48" cy="37" r="2" fill="#392D31" />
    <Path d="M33 47 Q40 53 47 47" fill="none" stroke="#A46458" strokeWidth="2.2" strokeLinecap="round" />
    <Path d="M30 59 L40 67 L50 59" fill="none" stroke="#D8C8E3" strokeWidth="2" />
  </Svg>;
}
