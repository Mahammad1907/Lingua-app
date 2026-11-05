"""Compile supplements from the immutable author ZIP; never count these as main lessons."""
import json,re,runpy,sys
from pathlib import Path
from zipfile import ZipFile
api=runpy.run_path(str(Path(__file__).with_name('import-b1-v2.py')))
rule,clean,options=api['rule'],api['clean'],api['options']
def plain(s,label):
 m=re.search(r'^'+re.escape(label)+r':\s*(.*?)(?=\n\n|\Z)',s,re.M|re.S)
 return m[1].strip() if m else ''
def card(cid,num,body,answer,audio='',meaning='',voice=False,goals=None):
 opts=options(body);rr=rule(answer,exact=bool(opts or audio and not voice))
 if goals:rr={'answers':rr['answers'],'goals':goals}
 if opts:
  letter=re.match('[A-D]',answer);rr=rule(opts[ord(letter[0])-65],exact=True);body=re.split(r'(?:^|\s)A\)',body)[0].strip()
 return {'id':cid,'number':num,'title':f'Tapşırıq {num}','kind':'voice' if voice else 'task','body':clean(body),'rule':rr,'options':opts or None,'audio':audio or None,'meaning':meaning or None}
def main(path):
 with ZipFile(path) as z:
  source=z.read('05_Kecid_Imtahani_A_B.md').decode();extra={}
  goals={5:['introduce'],6:['askName'],7:['feeling','askFeeling'],8:['politeName'],9:['noProblem'],10:['welcome'],11:['greet'],12:['introduce','askName'],13:['dontUnderstand','repeat','slow'],14:['farewell']}
  for variant in ['A','B']:
   student=source.split(f'## Variant {variant} — tələbənin tapşırıqları',1)[1].split('## Variant',1)[0]
   hidden=source.split(f'## Variant {variant} — gizli cavab açarı, audio və ölçmə',1)[1].split('\n## ',1)[0]
   keys={int(m[1]):b for m,b in api['chunks'](hidden,r'^### '+variant+r'(\d+)\s*$')};cards=[]
   for m,body in api['chunks'](student,r'^### '+variant+r'(\d+) — ([^\n]+)'):
    n=int(m[1]);key=keys[n];answer=plain(key,'Cavab');audio=api['audio_value'](plain(key,'Audio'));meaning=plain(key,'Mənasını göstər məlumatı')
    c=card(f'exam_{variant}_{n:02d}',n,body,answer,audio,meaning,n>=11,goals.get(n))
    if n==5:c['rule']['roleName']='Sam' if variant=='A' else 'Alex'
    alt=plain(key,'Alternativlər')
    # Only explicitly authored English alternatives, never explanations following a semicolon.
    if not c['options'] and not audio:
     for a in re.split(r'\s+/\s+|;\s*',alt):
      if a and not re.search('[ƏəıİşŞğĞçÇöÖüÜ]|hədəfi|qaydası',a) and len(a)<120:c['rule']['answers'].append(a)
    target={1:(1,3),2:(2,5),3:(4,5),4:(2,7),5:(2,11),6:(3,11),7:(6,8),8:(8,6),9:(9,7),10:(7,9),11:(1,5),12:(3,12),13:(12,7),14:(1,11)}[n]
    c['reviewTarget']={'lesson':target[0],'number':target[1]}
    if n==14:c['reviewTarget']['suffix']='b'
    cards.append(c)
    if n==12:
     after=card(f'exam_{variant}_12b',12,'Tanış olduğuna şad olduğunu səslə bildir.','You too.','I’m Alex. Nice to meet you.','Mən Aleksəm. Tanış olduğuma şadam.',True,['meet'])
     after['after']={'id':c['id'],'goals':['introduce','askName']};cards.append(after)
    if n==13:
     a='How are you?' if variant=='A' else 'What’s your name?';ans='I’m fine.' if variant=='A' else 'I’m Sam.'
     after=card(f'exam_{variant}_13b',13,'Yavaş təkrarlanan suala səslə cavab ver.',ans,a,'Necəsən?' if variant=='A' else 'Adın nədir?',True,['feeling'] if variant=='A' else ['introduce'])
     after['rate']=.45;after['after']={'id':c['id'],'goals':['slow']};cards.append(after)
   extra[f'exam-{variant}']={'title':f'Keçid imtahanı · {variant}','cards':cards,'exam':True,'source':'05_Kecid_Imtahani_A_B.md'}
  rows=[]
  for line in z.read('06_Ozunu_Yoxla.md').decode().splitlines():
   if re.match(r'^\| [1-6] \|',line):rows.append([c.strip() for c in line.strip('|').split('|')])
  answers=['B','Hi. I’m [ad].','I’m [ad]. What’s your name?','I’m fine. And you?','You’re welcome.','Could you say that again more slowly, please?']
  audios=['Goodbye!','','Hi. What’s your name?','','','How are you?'];meanings=['Sağ ol!','','Salam. Adın nədir?','','','Necəsən?']
  gs=[None,['greet','introduce'],['introduce','askName'],['feeling','askFeeling'],['welcome'],['repeat','slow']]
  targets=[(1,3),(2,15),(3,12),(6,8),(7,6),(12,7)]
  cards=[]
  for i,row in enumerate(rows):
   c=card(f'self_{i+1}',i+1,row[1],answers[i],audios[i],meanings[i],i in [2,5],gs[i]);c['reviewTarget']={'lesson':targets[i][0],'number':targets[i][1]};cards.append(c)
  extra['self-check']={'title':'Özünü yoxla','cards':cards,'exam':True,'source':'06_Ozunu_Yoxla.md'}
  # Verbatim student story text and author keys: no author commentary enters its reading cards.
  story=z.read('07_Elave_Oxu_Hekayesi.md').decode();section=story.split('## Tələbəyə göstərilən ardıcıllıq',1)[1].split('\n## ',1)[0]
  readings=[]
  for number in [2,4,7]:
   m=re.search(r'^'+str(number)+r'\. Oxu, hissə \d: “(.*?)”',section,re.M);readings.append(m[1])
  def read(i,text):return {'id':f'story_read_{i}','number':i,'kind':'read','title':'Oxu','body':text}
  cards=[read(1,readings[0]),card('story_3',3,'Adını əvvəl kim deyir?','Sam'),read(2,readings[1]),card('story_5',5,'I’m fine deyən kimdir?','Alex'),card('story_6',6,'Yeni görüşdəsən. Öz halını de və qarşı tərəfdən soruş.','I’m OK. And you?','How are you?','Necəsən?',True,['feeling','askFeeling']),read(3,readings[2]),card('story_8',8,'Mesajların yeri qarışıb. Görüşün əvvəlini seç: A) Goodbye, Alex! B) Hello. I’m Sam.','B'),card('story_9',9,'Hekayənin sonunda Alex-in yerinə uyğun bir sağollaşma yaz.','Bye! / Goodbye!',goals=['farewell'])]
  cards[1]['review']=card('story_3_retry',3,'Alex: Hello. I’m Alex. / Sam: Hi. I’m Sam.\nKim öz adını əvvəl deyir?','Alex')
  cards[3]['review']=card('story_5_retry',5,'Sam: I’m not very well. / Alex: I’m OK.\nKim özünü yaxşı hiss etmir?','Sam')
  cards[4]['review']=card('story_6_retry',6,'Halını de və sualı qaytar.','I’m fine. And you?','Hello. How are you?','Salam. Necəsən?',True,['feeling','askFeeling'])
  cards[6]['review']=card('story_8_retry',8,'Görüşün sonunu seç: A) Hi! B) Bye!','B')
  cards[7]['review']=card('story_9_retry',9,'Yeni mesajlaşmanız bitdi. Son mesajını yaz.','Bye! / Goodbye!',goals=['farewell'])
  extra['story']={'title':'İki tanış, iki mesaj','cards':cards,'requiresAllLessons':True,'source':'07_Elave_Oxu_Hekayesi.md'}
  (Path(__file__).resolve().parents[1]/'src/data/b1ExtrasV2.json').write_text(json.dumps(extra,ensure_ascii=False,indent=2)+'\n')
  print({k:len(v['cards']) for k,v in extra.items()})
if __name__=='__main__':main(sys.argv[1])
