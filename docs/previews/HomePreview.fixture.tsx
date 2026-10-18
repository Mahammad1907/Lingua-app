// Local export fixture only. This route is not included in the GitHub change.
import { View } from 'react-native';
import { HomeDashboard, HomeNavigation } from '../../src/components/home/HomeDashboard';
import type { HomeCourse } from '../../src/utils/homeCourse';
const course: HomeCourse = { percent: 41, completedCount: 41, lessonsCount: 100, items: [
  { id: 'preview_3', order: 3, title: 'Ailə və yaxın insanlar', artwork: 'family', state: 'completed', completedCount: 12, lessonsCount: 12, percent: 100, examPercent: 100, examPassed: true },
  { id: 'preview_4', order: 4, title: 'Əşyalar və sahiblik', artwork: 'backpack', state: 'completed', completedCount: 10, lessonsCount: 10, percent: 100, examPercent: 100, examPassed: true },
  { id: 'preview_5', order: 5, title: 'Ev və əşyaların yeri', artwork: 'house', state: 'current', completedCount: 4, lessonsCount: 15, percent: 27, examPercent: 33, examPassed: false },
  { id: 'preview_6', order: 6, title: 'Gündəlik rejim və vaxt', artwork: 'clock', state: 'planned', completedCount: 0, lessonsCount: 0, percent: 0, examPercent: null, examPassed: false },
  { id: 'preview_7', order: 7, title: 'Maraqlar və bacarıqlar', artwork: 'guitar', state: 'planned', completedCount: 0, lessonsCount: 0, percent: 0, examPercent: null, examPassed: false },
] };
export default function HomePreview() {
  return <View style={{flex:1,backgroundColor:'#0c1020'}}><HomeDashboard course={course} energy={70} language="en" level="A1" onSelect={()=>{}} onOpen={()=>{}} /><HomeNavigation bottomInset={12} onNavigate={()=>{}} /></View>;
}
