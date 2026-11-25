// “Şəkil göndərdi” (26 Nov 2026, user): the photo a task talks about is shown as a chat photo card. Until the real
// pictures are added, the photo area is an empty frame (code-drawn people were rejected). `shows` says what goes there.
import { StyleSheet, Text, View } from 'react-native';
import type { PhotoSpec } from '../../data/designLessonTypes';
import { nameSlot } from './parts';
import { Avatar } from './TaskScreens';
import { d, font } from './theme';

export function PhotoCard({ photo }: { photo: PhotoSpec }) {
  return <View style={s.card} accessibilityLabel={`Şəkil: ${nameSlot(photo.shows)}`}>
    <View style={s.head}>
      <Avatar who={photo.who ?? 'other'} size={30} />
      <Text style={s.from} numberOfLines={1}>{nameSlot(photo.from)}</Text>
    </View>
    <View style={s.photo}><Text style={s.wait}>Şəkil burada olacaq</Text></View>
  </View>;
}

const s = StyleSheet.create({
  card: { alignSelf: 'center', width: '78%', maxWidth: 320, backgroundColor: '#fff', borderRadius: 22, padding: 10, gap: 8,
    shadowColor: '#5B4B9A', shadowOpacity: .1, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  from: { flex: 1, color: d.title, fontSize: 15, ...font.extrabold },
  wait: { color: '#9AA0B2', fontSize: 13, ...font.bold },
  photo: { height: 150, borderRadius: 16, backgroundColor: '#EEF0F5', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D5D8E2', alignItems: 'center', justifyContent: 'center' },
});
