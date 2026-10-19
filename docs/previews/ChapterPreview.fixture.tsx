// Preview data only. Not a production route; never imported by app screens.
import ChapterJourney from '../../src/components/chapter/ChapterJourney';
import EnergyMeter from '../../src/components/EnergyMeter';
import { lessons } from '../../src/data/lessons';
import { buildChapterJourney } from '../../src/utils/chapterJourney';
import type { LessonAttempt } from '../../src/utils/rewards';
import { useUserStore } from '../../src/store/userStore';

// This module is only loaded through the temporary preview route.
useUserStore.setState({ hearts: 4 });

const sample = lessons.filter((lesson) => lesson.moduleId === 'module_1').sort((a, b) => a.order - b.order);
const attempt: LessonAttempt = { id: 'preview', lessonId: sample[2].id,
  expected: ['a', 'b', 'c', 'd', 'e'], assisted: false, finished: false,
  tasks: { a: { resolved: true, firstCorrect: true, skipped: false, wrong: 0, token: 'a' },
    b: { resolved: true, firstCorrect: true, skipped: false, wrong: 0, token: 'b' } } };
const items = buildChapterJourney(sample, [sample[0].id, sample[1].id], { preview: attempt }, false);

export default function ChapterPreview() {
  return <ChapterJourney title="İlk tanışlıq" order={1} level="A1" items={items}
    energy={<EnergyMeter appearance="chapter" />}
    topInset={44} bottomInset={24} onBack={() => {}} onLessonPress={() => {}} />;
}
