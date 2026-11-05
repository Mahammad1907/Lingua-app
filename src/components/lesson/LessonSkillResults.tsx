import { StyleSheet, Text } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { summarizeEvidence, type TaskEvidence } from '../../utils/lessonEvidence';
import { goalLabels } from '../../utils/packetAnswer';
import { packetFlow } from '../../data/b1Course';
import { Surface } from './LessonSurface';
type Result = { status: 'independent' | 'assisted' | 'wrong' | 'unverified'; evidence?: TaskEvidence };
const labels = { independent: 'Müstəqil', assisted: 'Köməklə', wrong: 'Məşq lazımdır', unverified: 'Yoxlanmadı' };
// Report demonstrated goals, never a score inferred from pressing Continue.
export function skillResults(packet: PacketLesson, outcomes: Record<string, Result>) {
  return packetFlow(packet).filter(c => c.kind === 'task' || c.kind === 'voice').map(c => {
    const result = outcomes[c.id];
    const goals = (c.turns?.[0]?.rule || c.rule)?.goals;
    const title = goals?.length ? goals.map(g => goalLabels[g] || g).join(' · ') : c.fields ? 'Salam və sağollaşmanı ayrı yazmaq' : c.audio ? 'Eşitdiyini anlamaq' : c.title;
    const support = Boolean(result?.evidence?.transcriptShown || result?.evidence?.technicalText);
    return { id: c.id, title, status: labels[result?.status || 'unverified'], listening: support ? 'Dinləmə yoxlanmadı · Mətn dəstəyi' : undefined, voice: c.kind === 'voice', verifiedVoice: c.kind === 'voice' && (result?.status === 'independent' || result?.status === 'assisted') && result.evidence?.input === 'spoken' };
  });
}
export default function LessonSkillResults({ packet, outcomes }: { packet: PacketLesson; outcomes: Record<string, Result> }) {
  const results = skillResults(packet, outcomes);
  const voice = results.filter(r => r.voice);
  const evidence = summarizeEvidence(Object.values(outcomes).map(r => ({ resolved: r.status === 'independent' || r.status === 'assisted', evidence: r.evidence }))); 
  return <Surface><Text style={s.title}>Konkret nəticən</Text><Text style={s.body}>Danışıq: {voice.filter(r => r.verifiedVoice).length}/{voice.length} cavab yoxlanıb.</Text><Text style={s.body}>Dinləmə: {evidence.listeningIndependent} müstəqil · {evidence.listeningAssisted} köməklə</Text>{evidence.textHelp + evidence.technicalText ? <Text style={s.note}>Mətn dəstəyi ilə {evidence.textHelp + evidence.technicalText} dinləmə cavabı ayrıca yoxlanmadı.</Text> : null}<Text style={s.note}>Keçilən və texniki səbəbdən yoxlanmayan cavab bacarığın təsdiqi sayılmır. Ətraflı nəticəni aşağıdan aça bilərsən.</Text></Surface>;
}
const s=StyleSheet.create({title:{fontSize:16,lineHeight:23,fontWeight:'800',color:'#301341'},body:{fontSize:15,lineHeight:22,color:'#301341'},note:{fontSize:13,lineHeight:19,color:'#79578C'}});
