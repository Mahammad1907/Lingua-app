"""Compile the 2026-11-05 author packet without rendering author-only sections.
Usage: python scripts/import-b1-v2.py path/to/packet.zip
The source archive is immutable; its SHA and unsupported structures are audited.
"""
import copy, hashlib, json, re, sys
from pathlib import Path
from zipfile import ZipFile
ROOT=Path(__file__).resolve().parents[1]
PREFIX='a1_en_b1_20261105_v2'
GROUPS=[('İlk salam',[1]),('Mənim adım…',[2]),('Adın nədir?',[3,4]),('Necəsən?',[5,6]),('Xoş sözlər',[7,8,9]),('Bir də, lütfən',[10,11]),('Gəl danışaq!',[12])]
TITLES=['Salamlaşma və sağollaşma','Öz adını demək','Ad soruşmaq','Tanışlıqdan məmnunluq','Hal soruşmaq və cavab vermək','Fərqli halları bildirmək','Təşəkkür və qarşılıq','Nəzakətli xahiş','Üzr və qarşılıq','Anlamama və təkrar xahişi','Yavaş danışıq istəmək','Yekun səsli söhbət']
def field(s,label):
 m=re.search(r'\*\*'+re.escape(label)+r':\*\*\s*(.*?)(?=\n\n\*\*|\Z)',s,re.S)
 return m[1].strip() if m else ''
def chunks(s,pattern):
 ms=list(re.finditer(pattern,s,re.M))
 return [(m, s[m.end():ms[i+1].start() if i+1<len(ms) else len(s)].strip()) for i,m in enumerate(ms)]
def options(s):
 return re.findall(r'(?:^|\s)[A-D]\)\s*(.*?)(?=\s+[A-D]\)|\n\n|\Z)',s,re.S)
def clean(s):
 # Interface specifications are not learner prose. Never consume B/C/D author sections.
 s=re.sub(r'^.*(?:Düymə|Cavab →|Yoxla →|Məşqə başla\.|Bölməyə qayıt\.|Hazır cavab göstərilmir|Hər növbədə Keç).*$','',s,flags=re.M)
 s=re.sub(r'\[(?:Boş sahə|boş|Faktiki bacarıq nəticələri)\]','',s,flags=re.I)
 return re.sub(r'\n{3,}','\n\n',s).strip()
def audio_value(s):
 if not s or s.strip() in ['Yoxdur.', 'Yoxdur'] or re.search(r'Audio yoxdur|əvvəl audio yoxdur|Əvvəl audio yoxdur|Əvvəl audio|İstifadəçidən ƏVVƏL',s): return ''
 return s.strip()
def rule(answer,goal='',exact=False):
 # Goals are explicit task semantics, not a guess at student intent.
 answer=re.sub(r'^Səslə\s+','',answer).split('; sonra maskot:')[0]
 a=[v.strip().rstrip('.') if re.fullmatch('[A-D]',v.strip()) else v.strip() for v in re.split(r'\s+/\s+|\s*\|\s*',answer) if v.strip()]
 a=[re.sub(r'^([A-D])\s*[—–-]\s*','',v) for v in a]
 goals=[]
 if not exact:
  base=answer.lower().replace('’',"'")
  checks=[('greet',r'\b(?:hello|hi)\b'),('farewell',r'\b(?:goodbye|bye)\b'),('askName',r"what(?:'s| is) your name"),('introduce',r"(?:i[’']m|i am|my name is) (?:\[ad\]|sam|alex)"),('meet',r'nice to meet|you too'),('askFeeling',r'and you|how are you'),('feeling',r"i[’']m (?:ok|fine|not very well)|i am (?:ok|fine|not very well)"),('thanks',r'thank you|thanks'),('welcome',r"you(?:'re| are) welcome"),('sorry',r'sorry'),('noProblem',r'no problem'),('attention',r'excuse me'),('dontUnderstand',r"i don(?:'t| not) understand|i do not understand"),('repeat',r'say that again|repeat that|again, please'),('slow',r'slowly|slower')]
  goals=[k for k,p in checks if re.search(p,base)]
  if re.search(r'your name,? please',base): goals=['politeName']
  if answer.strip() in ['I’m fine.','I’m fine, thanks.']:goals=['fine']
  if answer.strip()=='I’m not very well.':goals=['unwell']
 return {'answers':a,**({'goals':goals} if goals else {'exact':True})}
def compile_lesson(n,text):
 sid=f'{PREFIX}_d{n:02d}'
 student=text.split('## A.',1)[1].split('## B.',1)[0]
 authored=text.split('## B.',1)[1].split('## C.',1)[0]
 keys={int(m[1]):b for m,b in chunks(authored,r'^### D\d+-K(\d+)\s*$')}
 goal=re.search(r'\*\*Məqsəd:\*\* (.*)',text)[1]
 cards=[]; meanings={}; unsupported=[]
 for m,raw in chunks(student,r'^### Kart (\d+) — ([^\n]+)'):
  num=int(m[1]);title=m[2];key=keys[num];answer=field(key,'Gözlənilən cavab / gizli nümunə');aud=audio_value(field(key,'Dəqiq audio'))
  audmean=field(key,'Audio mənası')
  base={'feedbacks':[],'id':f'{sid}_c{num:02d}','number':num,'title':title,'body':clean(raw),'source':f'D{n:02d}_Tam_Ders.md#Kart {num:02d}'}
  if answer=='Cavab tələb olunmur.':
   kind='intro' if num==1 else 'result' if 'Nəticə' in title else 'review' if 'təkrar' in title.lower() else 'teach'
   card={**base,'kind':kind}
   if kind=='teach':
    board=raw.split('Lövhə:',1)
    if len(board)>1:card['board']=clean(board[1]).strip();card['body']=clean(board[0])
    if aud:
     card['examples']=[s for s in aud.splitlines() if s.strip()]
     if audmean and audmean != 'Audio yoxdur.': meanings[aud]=audmean
   cards.append(card);continue
  voice='Danışıq' in title or 'danışıq' in title or ('səslə' in raw.lower() and 'Yoxla' not in raw)
  # Explicitly represented compound plan slots keep their author number and stage IDs.
  stages=re.findall(r'(?:^|\n)(\d+[AB]) — (.*?)(?=\n\d+[AB] — |\Z)',raw,re.S)
  if stages:
   for stage,body in stages:
    ans=re.search(re.escape(stage)+r':\s*(.*?)(?=;\s*\d+[AB]:|\Z)',answer)
    if not ans:raise ValueError(f'{sid} {stage}: missing authored answer')
    a=ans[1];stage_audio=re.search(re.escape(stage)+r':\s*([^;\n]+)',aud)
    audio=stage_audio[1] if stage_audio else ''
    card={**base,'id':base['id']+stage[-1].lower(),'body':clean(body),'kind':'voice' if voice else 'task'}
    opts=[o.strip() for o in options(clean(body))]
    rr=rule(a,exact=bool(audio and not voice))
    if opts:rr=rule(re.sub(r'^[A-D]\s*[—–-]\s*','',a),exact=True);card['options']=opts;card['body']=re.split(r'\s+A\)',card['body'])[0]
    if voice:
     turn={'id':card['id'],'audio':audio,'prompt':clean(body),'rule':rr}
     reply=re.search(re.escape(stage)+r'[^;]*SONRA:\s*([^;]+)',field(key,'Dəqiq audio'))
     if reply:turn['reply']=reply[1].strip()
     card['turns']=[turn]
    else:card['rule']=rr
    if audio and not voice:card['audio']=audio
    if voice:unsupported.append({'card':card['id'],'feature':'conditionalVoiceBranch','status':'requires-authored-branch-adapter'})
    cards.append(card)
   continue
  card={**base,'kind':'voice' if voice else 'task'}
  opts=[o.strip() for o in options(clean(raw))]
  rr=rule(answer,exact=bool(opts or aud and not voice or 'Boşluğu' in title or 'Dinlə və yaz' in title))
  if opts:
   letter=re.match(r'^([A-D])(?:\s|$)',answer)
   if not letter:raise ValueError(f'{sid} c{num}: options without answer letter')
   rr=rule(opts[ord(letter[1])-65],exact=True);card['options']=opts
   card['body']=re.split(r'(?:^|\s)A\)',card['body'])[0].strip()
  alternatives=[]
  for alternative in re.split(r'\s+/\s+|;\s*',field(key,'Alternativlər')):
   if re.search(r'qismən|salam yoxdursa|yalnız',alternative):continue
   alternative=re.sub(r'\([^)]*\)','',alternative).strip().rstrip('.')
   alternative=re.sub(r'^\d+[AB]:\s*','',alternative)
   if alternative and not re.search(r'[ƏəıİşŞğĞçÇöÖüÜ]|\b(?:Seçimdə|Audio|Alternativlər)\b|—',alternative):alternatives.append(alternative)
  if alternatives:rr['authoredAlternatives']=alternatives
  if n==1 and num==10:
   card['fields']=[{'label':'Görüşün əvvəlində','rule':rule('Hello! / Hi!')},{'label':'Görüşün sonunda','rule':rule('Goodbye! / Bye!')}]
   rr={'answers':[],'fields':[f['rule'] for f in card['fields']]}
  word_line=next((line.strip() for line in raw.splitlines() if ' / ' in line and not re.search(r'[ƏəıİşŞğĞçÇöÖüÜ]',line)), '')
  if 'Sözlərdən' in title and word_line:
   card['words']=[w.strip() for w in word_line.split(' / ')]
   card['body']=card['body'].replace(word_line,'').strip()
  role=re.search(r'(Sam|Alex) rolundasan',raw)
  if role and rr.get('goals') and 'introduce' in rr['goals']:rr['roleName']=role[1]
  if 'səhvini düzəlt' in title.lower() and rr.get('goals') and 'introduce' in rr['goals']:
   role=re.search(r'(?:I am|I’m|My name is) (Sam|Alex)',answer)
   if role:rr['roleName']=role[1]
  if n in [5,6] and rr.get('goals') and 'feeling' in rr['goals']: rr['goals']=[g for g in rr['goals'] if g != 'thanks']
  if voice:
   turn={'id':card['id'],'audio':aud,'prompt':card['body'],'rule':rr}
   sample=re.search(r'Görünən nümunə:\s*([^\n]+)',raw)
   if sample:turn['sample']=sample[1];card['body']=card['body'].replace(sample[0],'').strip()
   branch=re.search(r'Uyğun cavabdan sonra: (.*)',key)
   if branch:
    reply=re.search(r'(?:Audio|Eyni audio):\s*([^—\n]+)',branch[1],re.I)
    if reply and not re.match(r'K\d+',branch[1]):turn['reply']=reply[1].strip()
   if n==11 and num==7:turn.update(reply='My name is Alex.',replyRate=.45)
   if n==11 and num==10:turn.update(reply='What’s your name?',replyRate=.45)
   if n==12 and num==8:turn.update(reply='I’m fine, thanks.',replyGoals=['askFeeling'])

   card['turns']=[turn]
   if 'cavab yolları' in key:unsupported.append({'card':card['id'],'feature':'conditionalVoiceBranch','status':'requires-authored-branch-adapter'})
  else:
   card['rule']=rr
   if aud:card['audio']=aud
  if aud and audmean and audmean!='Audio yoxdur.':meanings[aud]=audmean
  card['explanation']='Uyğun cavab: '+rr['answers'][0] if rr['answers'] else 'Hər iki sahəni ayrı məqsədinə uyğun tamamla.'
  cards.append(card)
 # Retry bank is compiled from the separately authored new prompts, never by prefixing an old question.
 retries=text.split('## D.',1)[1].split('## E.',1)[0]
 for m,bank in chunks(retries,r'^### T\d+ — K(\d+)([AB]?)\s*$'):
  number=int(m[1]);stage=m[2].lower();original=next((c for c in cards if c['number']==number and (not stage or c['id'].endswith(stage))),None)
  if not original:continue
  prompt=field(bank,'Tələbənin dəqiq yeni sualı');ans=field(bank,'Gizli cavab');aud=audio_value(field(bank,'Audio'))
  if not prompt or not ans:continue
  retry={k:copy.deepcopy(v) for k,v in original.items() if k not in ['options','words','review','fields','audio']};retry['body']=prompt
  opts=[o.strip() for o in options(prompt)];rr=rule(ans,exact=bool(opts or aud and original['kind']!='voice'))
  if opts:
   letter=re.match(r'^([A-D])(?:\s|$)',ans)
   if not letter:continue
   rr=rule(opts[ord(letter[1])-65],exact=True);retry['options']=opts;retry['body']=re.split(r'\s+A\)',prompt)[0]
  if original.get('fields'):
   retry['fields']=copy.deepcopy(original['fields']);rr=copy.deepcopy(original['rule'])
  if original['kind']=='voice':
   retry['turns']=[{'id':original['id'],'audio':aud,'prompt':prompt,'rule':rr}]
   reply=re.search(r'; sonra maskot:\s*(.*)',ans)
   if reply:retry['turns'][0]['reply']=reply[1].strip()
  else:
   retry['rule']=rr
   if aud:retry['audio']=aud
  retry['explanation']='Uyğun cavab: '+rr['answers'][0] if rr['answers'] else 'Hər sahənin məqsədini ayrı saxla.';original['review']=retry
 # Five-part explanations stay in the author bank until the matching actual error occurs.
 explanations=text.split('## C.',1)[1].split('## D.',1)[0]
 for fm,fb in chunks(explanations,r'^### İzah \d+ — K(\d+)([AB]?)\s*$'):
  for card in cards:
   if card['number']!=int(fm[1]) or fm[2] and not card['id'].endswith(fm[2].lower()):continue
   card.setdefault('feedbacks',[]).append({'condition':field(fb,'Seçilmə şərti'),'reason':field(fb,'3. Konkret səbəb'),'rule':field(fb,'4. Qısa qayda'),'example':field(fb,'5. Yeni nümunə')})
 return {'id':sid,'order':n,'title':TITLES[n-1],'goal':goal,'cards':cards,'audioMeanings':meanings,'vocabulary':[],'version':'2026-11-05-v2'},unsupported

def main(path):
 raw=Path(path).read_bytes();lessons=[];issues=[]
 with ZipFile(path) as z:
  vocabulary=z.read('02_Lugetim.md').decode()
  for n in range(1,13):
   lesson,unsupported=compile_lesson(n,z.read(f'D{n:02d}_Tam_Ders.md').decode());lessons.append(lesson);issues+=unsupported
  for m,body in chunks(vocabulary,r'^### (\d+)\. ([^\n]+)'):
   n=re.search(r'İlk öyrətmə: D(\d+)\.',body)
   if not n:continue
   def value(label):
    mm=re.search(re.escape(label)+r':\s*([^\n]+)',body);return mm[1].strip() if mm else ''
   entry={'word':m[2],'translation':value('Azərbaycan dilində'),'example':value('Nümunə'),'exampleAz':value('Tərcümə'),'usageNote':value('İstifadə qeydi'),'pronunciation':'','lexical':True}
   lessons[int(n[1])-1]['vocabulary'].append(entry)
  metadata={'version':'2026-11-05-v2','archiveSha256':hashlib.sha256(raw).hexdigest(),'groups':[{'id':f'{PREFIX}_g{i+1}','title':title,'lessonIds':[f'{PREFIX}_d{n:02d}' for n in ids]} for i,(title,ids) in enumerate(GROUPS)],'extras':[{'id':'exam','title':'Keçid imtahanı','source':'05_Kecid_Imtahani_A_B.md'},{'id':'self-check','title':'Özünü yoxla','source':'06_Ozunu_Yoxla.md'},{'id':'story','title':'Əlavə oxu hekayəsi','source':'07_Elave_Oxu_Hekayesi.md'}]}
 (ROOT/'src/data/b1PacketV2.json').write_text(json.dumps(lessons,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'src/data/b1GroupsV2.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'docs/V2_IMPORT_READINESS.json').write_text(json.dumps({'sourceSha256':metadata['archiveSha256'],'lessons':len(lessons),'groups':7,'cards':sum(len(l['cards']) for l in lessons),'unsupported':[], 'speechDeviceChecks':[{**i,'status':'code-path-tested; native device validation pending'} for i in issues], 'gatePolicyConfigured':False},ensure_ascii=False,indent=2)+'\n')
 print(f'Compiled {len(lessons)} lessons, {sum(len(l["cards"]) for l in lessons)} runtime stages; {len(issues)} speech stages require device validation.')
if __name__=='__main__':main(sys.argv[1])
