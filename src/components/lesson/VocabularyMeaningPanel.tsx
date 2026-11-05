import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { VocabularyEntry } from '../../utils/contextVocabulary';
export default function VocabularyMeaningPanel({ entry, onClose, onSpeak }: {
  entry: VocabularyEntry | null; onClose: () => void; onSpeak: (text: string) => void;
}) {
  return <Modal visible={Boolean(entry)} transparent animationType="fade" onRequestClose={onClose}>
    <View style={s.backdrop}><Pressable accessibilityRole="button" accessibilityLabel="Məna panelini bağla" onPress={onClose} style={StyleSheet.absoluteFill} />
      {entry && <View style={s.card} accessibilityViewIsModal><Text style={s.title}>{entry.word}</Text><Text style={s.meaning}>{entry.translation}</Text>
        <Text style={s.example}>{entry.example}</Text><Text style={s.note}>{entry.exampleAz}</Text>
        <Pressable accessibilityRole="button" onPress={() => onSpeak(entry.word.split(/\s*\/\s*/)[0].replace(/…/g, ''))} style={s.button}><Text style={s.buttonText}>İngiliscə dinlə</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={onClose} style={s.close}><Text style={s.note}>Bağla</Text></Pressable>
      </View>}
    </View>
  </Modal>;
}
const s=StyleSheet.create({ backdrop:{flex:1,justifyContent:'center',padding:24,backgroundColor:'rgba(20,10,35,.55)'},card:{borderRadius:24,backgroundColor:'#FAF2FF',padding:22,gap:11},title:{fontSize:24,fontWeight:'800',color:'#34154B'},meaning:{fontSize:19,fontWeight:'700',color:'#7939B1'},example:{fontSize:17,lineHeight:24,color:'#34154B'},note:{fontSize:15,lineHeight:22,color:'#79558E'},button:{minHeight:44,borderRadius:18,backgroundColor:'#F59C34',justifyContent:'center',alignItems:'center',padding:10},buttonText:{fontSize:16,fontWeight:'700',color:'#351843'},close:{minHeight:44,alignItems:'center',justifyContent:'center'}});
