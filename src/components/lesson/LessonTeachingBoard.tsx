import type { SpeechHighlight } from '../../utils/speechHighlight';
import PictureVocabularyDetails from './PictureVocabularyDetails';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';
import type { VocabularyEntry } from '../../utils/contextVocabulary';
import LessonVocabularyText from './LessonVocabularyText';
import CurrentSceneArt from './CurrentSceneArt';
import { currentTeachingScene } from '../../utils/currentScenePlan';
import TeachingBoardScene from './TeachingBoardScene';
import { LessonIcon } from './LessonSurface';
import { pictureTeachingEntries } from '../../utils/pictureTeaching';

// The board is native text, so it stays sharp and every phrase stays tappable.
// Context art follows the explicit scene plan; abstract teaching keeps the existing mascot.
export default function LessonTeachingBoard({ text, packet, cardId, onSelect, onSpeak, focus }: { focus?: SpeechHighlight | null; text: string; packet: PacketLesson; cardId: string; onSelect: (entry: VocabularyEntry) => void; onSpeak: (english: string) => void }) {
  const entry = pictureTeachingEntries(text, packet, Number(cardId.match(/_c(\d+)/)?.[1] || 0))[0];
  const scene = currentTeachingScene(packet.order, { kind: 'teach', number: Number(cardId.match(/_c(\d+)/)?.[1] || 0) });
  return <View style={s.board}><TeachingBoardScene art={scene ? <CurrentSceneArt scene={scene} height={136} /> : undefined}><Text style={[s.text, text.length > 150 && s.longText]}><LessonVocabularyText key={cardId} text={text} packet={packet} focus={focus} onSelect={onSelect} /></Text>{entry ? <Pressable accessibilityRole="button" accessibilityLabel="Lövhədəki ifadəni ingiliscə dinlə" style={s.listen} onPress={() => onSpeak(entry.word.split(/\s*\/\s*/)[0].replace(/…/g, ''))}><LessonIcon name="sound" size={19} color="#8735C9" /><Text style={s.label}>Dinlə</Text></Pressable> : null}</TeachingBoardScene><PictureVocabularyDetails key={cardId} text={text} packet={packet} cardNumber={Number(cardId.match(/_c(\d+)/)?.[1] || 0)} onSelect={onSelect} onSpeak={onSpeak} /></View>;
}
const s = StyleSheet.create({ board: { gap: 7 }, listen: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: 7, minHeight: 44, paddingHorizontal: 12, borderRadius: 22, backgroundColor: '#F6ECFF' }, label: { fontSize: 13, lineHeight: 18, color: '#8735C9', fontWeight: '600' }, text: { color: '#301341', fontSize: 18, lineHeight: 26, fontWeight: '700' }, longText: { fontSize: 15, lineHeight: 22 } });
