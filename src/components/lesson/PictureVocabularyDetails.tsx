import LessonVocabularyText from './LessonVocabularyText';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { VocabularyEntry } from '../../utils/contextVocabulary';
import { pictureTeachingEntries } from '../../utils/pictureTeaching';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { LessonIcon } from './LessonSurface';

// Uses only the author's lexical entries; never generates translations/examples.
export default function PictureVocabularyDetails({ text, packet, onSelect, onSpeak, cardNumber }: { cardNumber: number; text: string; packet: PacketLesson; onSelect: (entry: VocabularyEntry) => void; onSpeak: (english: string) => void }) {
  const entries = pictureTeachingEntries(text,packet,cardNumber);
  const [index, setIndex] = useState(0);
  const entry = entries[Math.min(index, Math.max(0,entries.length-1))];
  if (!entry) return null;
  return <View style={s.card}><View style={s.row}><Pressable style={s.copy} accessibilityRole="button" accessibilityLabel={`${entry.word}: mənasını göstər`} onPress={() => onSelect(entry)}><Text style={s.word}><LessonVocabularyText key={entry.word} text={entry.word} packet={packet} onSelect={onSelect} /></Text><Text style={s.meaning}>{entry.translation}</Text></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={`İngiliscə dinlə: ${entry.word}`} onPress={() => onSpeak(entry.word.split(/\s*\/\s*/)[0].replace(/…/g,''))} style={s.listen}><LessonIcon name="sound" size={20} /><Text style={s.link}>Dinlə</Text></Pressable></View>
    {entry.example ? <Pressable style={s.exampleBox} accessibilityRole="button" accessibilityLabel={`Nümunəni ingiliscə dinlə: ${entry.example}`} onPress={() => onSpeak(entry.example)}><Text style={s.example}>{entry.example}</Text><Text style={s.meaning}>{entry.exampleAz}</Text></Pressable> : null}
    {entries.length>1 ? <View style={s.pages}><Pressable accessibilityRole="button" disabled={index===0} onPress={()=>setIndex(i=>i-1)} style={s.audio}><Text style={[s.link,index===0&&s.disabled]}>Əvvəlki</Text></Pressable><Text style={s.meaning}>{index+1}/{entries.length}</Text><Pressable accessibilityRole="button" disabled={index===entries.length-1} onPress={()=>setIndex(i=>i+1)} style={s.audio}><Text style={[s.link,index===entries.length-1&&s.disabled]}>Növbəti ifadə</Text></Pressable></View>:null}
  </View>;
}
const s=StyleSheet.create({card:{gap:7,padding:12,borderRadius:19,backgroundColor:'#FFFAFF',borderWidth:1,borderColor:'#E4D1F0'},row:{flexDirection:'row',alignItems:'center',gap:10},copy:{flex:1},listen:{flexDirection:'row',gap:6,minHeight:44,paddingHorizontal:12,alignItems:'center',borderRadius:22,backgroundColor:'#F0E1FC'},exampleBox:{borderLeftWidth:3,borderLeftColor:'#AF6BE3',paddingLeft:10,paddingVertical:4},word:{fontSize:20,lineHeight:27,fontWeight:'700',color:'#301341'},meaning:{fontSize:13,lineHeight:19,color:'#79578C'},example:{fontSize:15,lineHeight:22,color:'#301341',fontWeight:'600'},link:{fontSize:13,fontWeight:'600',color:'#8735C9'},audio:{minHeight:44,justifyContent:'center'},pages:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},disabled:{opacity:.35}});
