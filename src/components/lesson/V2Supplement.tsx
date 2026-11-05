import LessonPicture from './LessonPicture';
import FixedLessonViewport from './FixedLessonViewport';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import extras from '../../data/b1ExtrasV2.json';
import { b1Packet } from '../../data/b1Course';
import { useUserStore } from '../../store/userStore';
import { assessSupplement, supplementalFlow, followUpAvailable, validateSupplementDraft, type SupplementAttempt, type SupplementCard, type SupplementPlan, type SupplementResponse } from '../../utils/supplement';
import { authoredRetry } from '../../utils/v2Flow';
import { feedbackCopy } from '../../utils/lessonFeedbackCopy';
import type { PacketCard } from '../../data/b1PacketTypes';
import type { SpokenAnswer } from '../../utils/speechTurn';
import LessonVoiceInput from './LessonVoiceInput';
import LessonVocabularyText from './LessonVocabularyText';
import VocabularyMeaningPanel from './VocabularyMeaningPanel';
import type { VocabularyEntry } from '../../utils/contextVocabulary';

const plans=extras as unknown as Record<string,SupplementPlan>;
export default function V2Supplement({kind}:{kind:string}) {
  const safe=useSafeAreaInsets();
  const [variant,setVariant]=useState('A');
  const [practice,setPractice]=useState<{key:string;plan:SupplementPlan}|null>(null);
  const key=kind==='exam'?`exam-${variant}`:kind;
  const plan=practice?.plan||plans[key];
  return <View style={{flex:1,backgroundColor:'#FBF5FF',paddingTop:safe.top}}>
    {kind==='exam'&&!practice?<View style={s.variants}>{['A','B'].map(v=><Pressable accessibilityRole="button" key={v} onPress={()=>setVariant(v)} style={[s.pill,v===variant&&s.selected]}><Text style={s.text}>Variant {v}</Text></Pressable>)}</View>:null}
    {plan?<Runner key={practice?.key||key} storageKey={practice?.key||key} plan={plan} onPractice={(card,response)=>{
      const target=card.reviewTarget;
      const lesson=target?b1Packet.find(l=>l.order===target.lesson):undefined;
      const original=lesson?.cards.find(c=>c.number===target?.number&&(!target?.suffix||c.id.endsWith(target.suffix)));
      let retry=original?.review;
      // Self-check 6 has its own explicitly authored repeat+slow prompt, not the D12 three-goal prompt.
      if(card.id==='self_6')retry={id:'self_6_retry',number:1,title:'Təkrar və sürət',kind:'voice',body:'Bu sualı həm bir də, həm daha yavaş deməsini səslə istə.',source:'06_Ozunu_Yoxla.md',turns:[{id:'self_6_retry',audio:'What’s your name?',prompt:'Bu sualı həm bir də, həm daha yavaş deməsini səslə istə.',rule:{answers:['Can you repeat that more slowly, please?','Again, please. More slowly, please.'],goals:['repeat','slow']}}]};
      if(!retry)return;
      const source=authoredRetry({...original!,review:retry},response.verdict,response.value);
      const t=source.turns?.[0];
      const next:SupplementCard={id:source.id,number:1,title:'Yenidən məşq',kind:source.kind==='voice'?'voice':'task',body:t?.prompt||source.body,rule:t?.rule||source.rule,audio:t?.audio||source.audio,options:source.options};
      setPractice({key:`practice-${card.id}`,plan:{title:'Köməklə təkrar',source:plan.source,cards:[next]}});
    }}/>:<Text style={s.text}>Əlavə tapılmadı.</Text>}
  </View>;
}
function Runner({plan,storageKey,onPractice}:{plan:SupplementPlan;storageKey:string;onPractice:(card:SupplementCard,response:SupplementResponse)=>void}) {
  const router=useRouter();const insets=useSafeAreaInsets();
  const completed=useUserStore(s=>s.completedLessons);
  const [draft,setDraft]=useState<SupplementAttempt>({version:2,index:0,responses:{},completed:false});
  const [loaded,setLoaded]=useState(false),[started,setStarted]=useState(false),[answer,setAnswer]=useState('');
  const [candidate,setCandidate]=useState<SupplementResponse|null>(null),[heard,setHeard]=useState(false),[helped,setHelped]=useState(false),[showHelp,setShowHelp]=useState(false);
  const [technical,setTechnical]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false),[capturing,setCapturing]=useState(false),[playing,setPlaying]=useState(false);
  const [selected,setSelected]=useState<VocabularyEntry|null>(null);
  const speech=useRef(0),writeLock=useRef(false),watchdog=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const key=`@birtalk_supplement_v2:${storageKey}`;
  const flow=supplementalFlow(plan,draft.responses);
  const card=flow[draft.index];
  useEffect(()=>{let active=true;AsyncStorage.getItem(key).then(raw=>{if(!active)return;if(raw){try{const value=validateSupplementDraft(JSON.parse(raw),plan);if(value)setDraft(value);}catch{setError('Saxlanmış cəhd oxunmadı.');}}setLoaded(true);}).catch(()=>{if(active){setError('Yaddaş açılmadı. Çıxıb yenidən cəhd et.');}});return()=>{active=false;};},[key,plan]);
  const stop=useCallback(()=>{speech.current++;if(watchdog.current)clearTimeout(watchdog.current);void Speech.stop();setPlaying(false);},[]);
  useFocusEffect(useCallback(()=>()=>{speech.current++;if(watchdog.current)clearTimeout(watchdog.current);void Speech.stop();},[]));
  const save=async(next:SupplementAttempt)=>{if(writeLock.current)return false;writeLock.current=true;setBusy(true);setError('');try{await AsyncStorage.setItem(key,JSON.stringify(next));setDraft(next);return true;}catch{setError('Nəticə saxlanmadı. Yenidən cəhd et.');return false;}finally{writeLock.current=false;setBusy(false);}};
  const listen=async(text:string,assessed=false)=>{stop();const token=speech.current;setPlaying(true);const fail=()=>{if(speech.current!==token)return;stop();setTechnical(true);setError('Səs açılmadı. Yenidən dinlə, dəstək seç və ya Yoxlanmadı ilə davam et.');};watchdog.current=setTimeout(fail,Math.max(10000,text.length*240+5000));try{await Speech.stop();if(token!==speech.current)return;Speech.speak(text,{language:'en-GB',rate:assessed?card?.rate||.75:.75,onDone:()=>{if(token===speech.current){if(watchdog.current)clearTimeout(watchdog.current);setPlaying(false);if(assessed)setHeard(true);}},onError:fail,onStopped:()=>{if(token===speech.current)setPlaying(false);}});}catch{fail();}};
  const readDialogue=async()=>{
    if(!card)return;stop();const token=speech.current;setPlaying(true);
    try {
      const voices=(await Speech.getAvailableVoicesAsync()).filter(v=>v.language.toLowerCase().startsWith('en'));
      if(token!==speech.current)return;
      const lines=card.body.split(' / ').map(line=>{const match=/^([^:]+):\s*(.*)$/.exec(line);return {speaker:match?.[1],text:match?.[2]||line};});
      if(voices.length<2)setError('Bu cihazda iki ayrı ingilis səsi yoxdur; mövcud səs istifadə olunur.');
      const run=(i:number)=>{
        if(token!==speech.current)return;
        if(i===lines.length){setPlaying(false);if(watchdog.current)clearTimeout(watchdog.current);return;}
        const line=lines[i],voice=voices[line.speaker==='Alex'&&voices.length>1?1:0];
        Speech.speak(line.text,{language:'en-GB',voice:voice?.identifier,rate:.75,onDone:()=>run(i+1),onError:()=>{stop();setError('Oxu audiosu açılmadı.');}});
      };
      watchdog.current=setTimeout(()=>{if(token===speech.current){stop();setError('Oxu audiosu dayanıb. Yenidən dinlə.');}},Math.max(10000,card.body.length*240));run(0);
    }catch{stop();setError('Oxu audiosu açılmadı.');}
  };
  const submit=(value:string,spoken=false,skip=false)=>{
    if(!card||!card.rule||candidate||writeLock.current)return;
    if(card.audio&&!heard&&!helped&&!technical&&!skip){setError('Əvvəl səsi dinlə.');return;}
    const response=assessSupplement(card,value,{spoken,helped:helped||storageKey.startsWith('practice-')||card.id.endsWith(':review'),heard,technical:technical&&!heard,skipped:skip});
    setAnswer(value);setCandidate(response);void save({...draft,responses:{...draft.responses,[card.id]:response}});
  };
  const next=async()=>{
    if(!card||busy||capturing)return;const saved=candidate||draft.responses[card.id];
    if(card.kind!=='read'&&!saved)return;
    const responses={...draft.responses,...(candidate?{[card.id]:candidate}:{})};
    const advance={...draft,responses,index:draft.index+1,completed:draft.index+1===supplementalFlow(plan,responses).length};
    if(await save(advance)){stop();setCandidate(null);setAnswer('');setHeard(false);setHelped(false);setTechnical(false);setShowHelp(false);}
  };
  const speechAnswer=(value:SpokenAnswer)=>{if(card.audio&&!heard&&!helped&&!technical)return 'Əvvəl səsi dinlə.';if(card.rule&&assessSupplement(card,value.text,{spoken:true,helped,heard}).verdict.status==='unknown'){setError('Səs dəqiq qiymətləndirilmədi. Yenidən danış və ya Keç seç.');return 'Yenidən danış və ya Keç seç.';}if(value.edited)return 'Bu səsli cavabdır. Yenidən danış və ya Keç seç.';submit(value.text,true);return null;};
  if(!loaded)return <View style={s.center}>{error?<Text style={s.error}>{error}</Text>:<ActivityIndicator/>}</View>;
  if(plan.requiresAllLessons&&b1Packet.some(l=>!completed.includes(l.id)))return <View style={[s.page,{paddingTop:12}]}><Text style={s.title}>Əvvəl 12 əsas dərsi tamamla.</Text><Pressable onPress={()=>router.back()} style={s.button}><Text style={s.buttonText}>Geri</Text></Pressable></View>;
  if(!started)return <View style={[s.page,{paddingTop:12}]}><Text style={s.title}>{plan.title}</Text><Text style={s.text}>{plan.exam?'Bildiyin ifadələri nümunəsiz istifadə et. Danışa bilmədiyin hissəni keçə bilərsən; o, yoxlanmamış qalacaq. Cavablar cəhdin sonunda açılır.':'Mesajlardan kimin nə dediyini tap.'}</Text><Text style={s.note}>Bu əlavə 12 əsas dərsin faizinə daxil deyil.</Text><Pressable accessibilityRole="button" onPress={()=>setStarted(true)} style={s.button}><Text style={s.buttonText}>{draft.completed?'Nəticəyə bax':draft.index?'Davam et':'Başla'}</Text></Pressable><Pressable onPress={()=>router.back()} style={s.helper}><Text style={s.note}>Geri</Text></Pressable></View>;
  if(draft.completed){const rows=flow.filter(c=>c.kind!=='read');const suggestions=rows.filter(c=>draft.responses[c.id]?.status==='needsPractice'&&c.reviewTarget).slice(0,2);return <ScrollView contentContainerStyle={[s.page,{paddingTop:12,paddingBottom:insets.bottom+20}]}><Text style={s.title}>{plan.title} · Nəticə</Text><Text style={s.note}>Bu nəticə bütün A1 səviyyəsinin təsdiqi deyil. İmtahan üçün avtomatik kilid açma həddi təyin edilməyib.</Text>{rows.map(c=>{const r=draft.responses[c.id];return <View key={c.id} style={s.card}><Text style={s.heading}>{c.number}. {c.body}</Text><Text style={s.text}>{r?.value||'Cavab verilmədi'}</Text>{c.audio&&(r?.helped||r?.technical||!r?.heard)?<Text style={s.note}>Mətn/texniki dəstək · Müstəqil dinləmə təsdiqlənmir</Text>:null}<Text style={s.status}>{r?.status==='independent'?'Müstəqil':r?.status==='assisted'?'Köməklə':r?.status==='needsPractice'?'Yenidən məşq lazımdır':'Yoxlanmadı'}</Text>{r?.verdict.criteria.map(g=><Text key={g.goal} style={s.note}>{g.passed?'✓':'○'} {g.goal}</Text>)}<Text style={s.text}>Uyğun cavab: {c.rule?.answers.join(' / ')}</Text>{r&&r.status==='needsPractice'?<Text style={s.note}>{feedbackCopy({...c,source:plan.source,kind:c.kind==='voice'?'voice':'task'} as PacketCard,r.value).reason}</Text>:null}</View>})}{suggestions.map(c=><Pressable key={c.id} onPress={()=>onPractice(c,draft.responses[c.id])} style={s.helper}><Text style={s.status}>Bu bacarığı yenidən məşq et: {c.reviewTarget?.lesson}-ci dərs</Text></Pressable>)}<Pressable style={s.button} onPress={async()=>{if(await save({version:2,index:0,responses:{},completed:false})){setStarted(false);setCandidate(null);}}}><Text style={s.buttonText}>Yeni cəhd</Text></Pressable><Pressable style={s.helper} onPress={()=>router.back()}><Text style={s.note}>Ana səhifəyə qayıt</Text></Pressable></ScrollView>;}
  if(!card)return null;
  const unavailable=!followUpAvailable(card,draft.responses),response=candidate||draft.responses[card.id];
  return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}><View style={[s.header,{paddingTop:4}]}><Pressable disabled={capturing} accessibilityLabel="Əlavədən çıx" onPress={()=>{stop();router.back();}} style={s.helper}><Text style={s.status}>‹ Geri</Text></Pressable><Text style={s.heading}>{plan.title}</Text><Text style={s.note}>{draft.index+1}/{flow.length} mərhələ</Text></View><FixedLessonViewport contentContainerStyle={s.page}>
    {card.kind==='read'?<LessonPicture ids={['P04']} compact />:null}
    <View style={s.card}><Text style={s.heading}>{card.title}</Text><Text style={s.text}><LessonVocabularyText key={card.id} packet={b1Packet[11]} text={card.body} highlight={false} onSelect={e=>{if(card.kind!=='read')setHelped(true);setSelected(e);}}/></Text></View>
    {unavailable?<><Text style={s.note}>Əvvəlki növbədə tələb olunan hissə təsdiqlənmədiyi üçün bu əlavə qarşılıq yoxlanmır.</Text><Pressable style={s.button} onPress={()=>submit('',false,true)} disabled={Boolean(response)}><Text style={s.buttonText}>Yoxlanmadı kimi qeyd et</Text></Pressable></>:<>
    {card.kind==='read'?<Pressable style={s.helper} onPress={()=>void readDialogue()}><Text style={s.status}>İngiliscə dinlə · Bu, dinləmə qiyməti deyil</Text></Pressable>:null}
    {card.audio?<><Pressable disabled={capturing} style={s.helper} onPress={()=>playing?stop():void listen(card.audio!,true)}><Text style={s.status}>{playing?'Səsi dayandır':'Səsi dinlə'}</Text></Pressable><Pressable disabled={capturing} style={s.helper} onPress={()=>{setHelped(true);setShowHelp(true);}}><Text style={s.note}>Mətn / məna dəstəyi</Text></Pressable>{showHelp?<View style={s.card}><Text style={s.text}>{card.audio}</Text><Text style={s.note}>{card.meaning}</Text></View>:null}</>:null}
    {card.kind==='voice'&&!response?<LessonVoiceInput key={card.id} compact manualSend disabled={busy} onBusyChange={setCapturing} onFinal={speechAnswer} onUnverifiedRecording={()=>{setTechnical(true);setError('Səs yazısı alındı, amma etibarlı tanınmadı. Yoxlanmadı ilə davam edə bilərsən.');}}/>:card.kind==='task'&&!response?card.options?<View style={{gap:9}}>{card.options.map(o=><Pressable accessibilityRole="radio" accessibilityState={{selected:answer===o}} key={o} onPress={()=>setAnswer(o)} style={[s.option,answer===o&&s.selected]}><Text style={s.text}>{o}</Text></Pressable>)}</View>:<TextInput value={answer} onChangeText={setAnswer} accessibilityLabel="Cavab" multiline maxLength={500} autoCorrect={false} style={s.input}/>:null}
    {card.kind==='task'&&!response?<Pressable accessibilityRole="button" disabled={!answer.trim()||busy||Boolean(card.audio&&!heard&&!helped&&!technical)} onPress={()=>submit(answer)} style={s.button}><Text style={s.buttonText}>Cavabı saxla</Text></Pressable>:null}
    {card.kind==='voice'&&!response?<Pressable disabled={capturing||busy} onPress={()=>submit('',false,true)} style={s.helper}><Text style={s.note}>Keç · Yoxlanmadı</Text></Pressable>:null}
    {technical&&!response?<Pressable onPress={()=>submit('',false,true)} style={s.helper}><Text style={s.note}>Texniki səbəbdən Yoxlanmadı ilə davam et</Text></Pressable>:null}
    </>}
    {response?<Text style={s.note}>Cavab qeydə alındı. Qiymətləndirmə cəhdin sonunda görünəcək.</Text>:null}{error?<Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text>:null}
    
    <VocabularyMeaningPanel entry={selected} onClose={()=>setSelected(null)} onSpeak={text=>void listen(text)}/>
  </FixedLessonViewport><View style={{paddingHorizontal:20,paddingBottom:Math.max(12,insets.bottom),paddingTop:8}}>{card.kind==='read'||response?<Pressable disabled={busy||capturing} onPress={()=>void next()} style={s.button}><Text style={s.buttonText}>{draft.index+1===flow.length?'Nəticəyə bax':'Davam et'}</Text></Pressable>:null}</View></KeyboardAvoidingView>;
}
const s=StyleSheet.create({center:{flex:1,alignItems:'center',justifyContent:'center'},page:{padding:20,gap:16},header:{paddingHorizontal:16,gap:5},variants:{flexDirection:'row',gap:10,justifyContent:'center',padding:8},pill:{padding:12,borderWidth:1,borderRadius:18,borderColor:'#D5B5EA'},selected:{backgroundColor:'#E7CFFA',borderColor:'#9743CC'},title:{fontSize:28,lineHeight:35,fontWeight:'900',color:'#301246'},heading:{fontSize:18,lineHeight:25,fontWeight:'800',color:'#35164A'},text:{fontSize:17,lineHeight:25,color:'#3A1C4E'},note:{fontSize:14,lineHeight:21,color:'#805F94'},status:{fontSize:16,lineHeight:23,fontWeight:'700',color:'#8B3DC0'},card:{padding:16,gap:10,borderRadius:20,borderWidth:1,borderColor:'#E2CDF0',backgroundColor:'#FFF9FF'},button:{minHeight:48,padding:12,borderRadius:22,justifyContent:'center',alignItems:'center',backgroundColor:'#FFA437'},buttonText:{fontSize:17,fontWeight:'800',color:'#432014'},helper:{minHeight:44,padding:10,justifyContent:'center'},option:{padding:15,borderWidth:1,borderColor:'#D4B8E6',borderRadius:16},input:{minHeight:70,maxHeight:120,padding:14,borderWidth:1,borderRadius:16,borderColor:'#A77BC4',fontSize:18,color:'#35164A'},error:{fontSize:14,lineHeight:21,color:'#A73845'}});
