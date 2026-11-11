import ApprovedLessonScene from './ApprovedLessonScene';
import type { ReusableSceneId } from '../../utils/packetScene';
import type { ApprovedSceneId } from '../../utils/approvedLessonScenes';
const aliases: Record<ReusableSceneId, readonly ApprovedSceneId[]> = {
  conversation: ['toy-park'], gratitude: ['toy-gratitude'], apology: ['toy-apology'],
  clarify: ['toy-clarify'], farewell: ['toy-farewell'], 'name-card': ['toy-introduction'],
  feelings: ['toy-feeling-good', 'toy-feeling-okay', 'toy-feeling-unwell'],
};
/** Preserve stable historical IDs while consistently rendering the approved people. */
export default function ReusableLessonScene({ name, height = 180 }: { name: ReusableSceneId; height?: number }) {
  return <ApprovedLessonScene ids={aliases[name]} height={height} />;
}
