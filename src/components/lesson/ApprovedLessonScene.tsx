import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { approvedSceneLabels, type ApprovedSceneId } from '../../utils/approvedLessonScenes';
import { contentScene } from '../../utils/lessonContentAssets';
import { ink } from './ApprovedLessonSurface';
/** Entire source stays visible; generated art never contains the question or an answer. */
export default function ApprovedLessonScene({ ids, height = 145 }: { ids: readonly ApprovedSceneId[]; height?: number }) {
  return <View style={s.row}>{ids.map(id => <Scene key={id} id={id} height={height} />)}</View>;
}
function Scene({ id, height }: { id: ApprovedSceneId; height: number }) {
  const [failed, setFailed] = useState(false), [retry, setRetry] = useState(0);
  return <View style={[s.frame, { height }]}>
    {!failed ? <Image key={retry} source={contentScene(id)} contentFit="contain" cachePolicy="memory-disk" recyclingKey={`${id}:${retry}`} accessibilityLabel={approvedSceneLabels[id]} style={s.image} onError={() => setFailed(true)} /> : <Pressable accessibilityRole="button" accessibilityLabel={`${approvedSceneLabels[id]} şəklini yenidən yüklə`} onPress={() => { setRetry(v => v + 1); setFailed(false); }} style={s.retry}><Text style={s.note}>Şəkil açılmadı · Yenidən yüklə</Text></Pressable>}
  </View>;
}
const s = StyleSheet.create({ row: { width: '100%', flexDirection: 'row', gap: 8 }, frame: { flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#E9DEF6', borderWidth: 1, borderColor: ink.border }, image: { width: '100%', height: '100%' }, retry: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12 }, note: { color: ink.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' } });
