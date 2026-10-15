import { Stack, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/userStore';
import { lessonTheme as t } from '../../constants/lessonTheme';
const questions = [
  ['Səhəri xüsusi bildirən salam hansıdır?', 'Good morning', ['Good evening', 'Good morning', 'Good afternoon']],
  ['Axşam salamını seç.', 'Good evening', ['Good evening', 'Good morning', 'Good afternoon']],
  ['Özünü düzgün təqdim edən cümlə hansıdır?', "I'm Ali.", ['I Ali.', "I'm Ali.", 'I is Ali.']],
  ['My name ___ Sara.', 'is', ['am', 'are', 'is']],
  ['Adını necə soruşarsan?', "What's your name?", ['How are you?', "What's your name?", 'See you!']],
  ['How are you? sualına uyğun cavab hansıdır?', "I'm fine, thanks.", ['My name is Ali.', "I'm fine, thanks.", 'Goodbye!']],
  ['Mesajı anlamadın. Təkrar istə.', 'Again, please.', ['Again, please.', 'Goodbye!', 'Good morning!']],
  ['Söhbət bitir. Sağollaş.', 'See you!', ['Hello!', 'Good afternoon!', 'See you!']],
] as const;
export default function ChapterCheck() {
  const router = useRouter(); const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0); const [answer, setAnswer] = useState(''); const [score, setScore] = useState(0); const submitted = useRef(false);
  const finished = index >= questions.length; const passed = score >= 7;
  const goBack = () => router.replace('/module/module_1');
  const next = () => {
    if (!answer || submitted.current) return;
    submitted.current = true;
    const total = score + Number(answer === questions[index][1]);
    if (index + 1 === questions.length) useUserStore.getState().savePlacementResult('module_1', total >= 7, total, questions.length);
    setScore(total); setIndex(value => value + 1); setAnswer(''); submitted.current = false;
  };
  return <View style={{ flex: 1, backgroundColor: t.background, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 16) }}><Stack.Screen options={{ headerShown: false }} />
    <TouchableOpacity onPress={goBack} style={{ padding: 20 }}><Text style={{ color: t.orange }}>‹ Bölmə xəritəsi</Text></TouchableOpacity>
    <ScrollView contentContainerStyle={{ padding: 22, gap: 16 }}>
      <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>{finished ? passed ? 'Sınaqdan keçdin!' : 'Birlikdə məşq edək' : 'Bölmə üzrə qısa sınaq'}</Text>
      <Text style={{ color: t.muted, lineHeight: 22 }}>{finished ? `${score}/8 düzgün. ${passed ? 'BirFox ilə yekun səsli söhbət açıldı. Dərsləri istəsən yenə məşq edə bilərsən.' : 'Dərslər xəritəsində məşqlərə davam edə bilərsən.'}` : '7 düzgün cavabla yekun səsli söhbəti aç. Bu sınaq tam A1 səviyyəsini qiymətləndirmir.'}</Text>
      {!finished ? <><Text style={{ color: t.orange }}>{index + 1}/8</Text><Text style={{ color: t.text, fontSize: 21, lineHeight: 29, fontWeight: '700' }}>{questions[index][0]}</Text>{questions[index][2].map(option => <TouchableOpacity key={option} onPress={() => setAnswer(option)} style={{ padding: 18, borderRadius: 16, backgroundColor: t.surface, borderWidth: 1, borderColor: answer === option ? t.orange : t.border }}><Text style={{ color: t.text, fontSize: 16 }}>{option}</Text></TouchableOpacity>)}</> : null}
    </ScrollView>
    <TouchableOpacity disabled={!finished && !answer} onPress={finished ? goBack : next} style={{ marginHorizontal: 20, padding: 18, borderRadius: 16, backgroundColor: t.orange, opacity: finished || answer ? 1 : .4 }}><Text style={{ color: '#241321', textAlign: 'center', fontWeight: '800' }}>{finished ? 'Xəritəyə qayıt' : 'Növbəti'}</Text></TouchableOpacity>
  </View>;
}
