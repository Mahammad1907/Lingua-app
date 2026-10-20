"""Compile the attached author packet; only student screens enter the app bundle.

Usage: python scripts/import-b1-packet.py path/to/BirTalk_A1_B1_Ilk_Tanisliq_Paket.zip
No packages, network calls or changes to the uploaded source file.
"""
import hashlib
import copy
import json
import re
import sys
from pathlib import Path
from zipfile import ZipFile

# card: answers, semantic goals (empty means closed exact task), optional audio.
KEYS = {
 1: {3:('Salam!',[], 'Hello!'),4:('Hi',[], 'Hi!'),5:('Hello!|Hi!', ['greet']),8:('Sağ ol!',[], 'Goodbye!'),9:('Goodbye!|Bye!', ['farewell']),10:('Goodbye!|Bye!', ['farewell'])},
 2: {2:('Hello!|Hi!', ['greet']),3:('Bye!',[]),5:('Sam',[], "Hi. I’m Sam."),6:('I am Leyla.',[]),7:('am',[]),10:('Mənim adım Samdır.',[]),11:('My name is BirFox.|I am BirFox.|I’m BirFox.|My name’s BirFox.', ['introduce']),13:('My name is Alex.',[]),14:('is',[], 'Hello. My name is Sam.'),15:('Hello. I’m Leyla.', ['greet','introduce'])},
 3: {2:('Hi. I’m Leyla.', ['greet','introduce']),3:('Sam',[], 'My name is Sam.'),6:('Adın nədir?',[], 'What’s your name?'),7:('What’s your name?',[]),8:('What’s your name?',[]),10:('is',[]),11:('What’s your name?|What is your name?', ['askName']),15:('You too.',[]),16:('You too.|Nice to meet you too.', ['meet'], 'Nice to meet you.'),17:('Hello. I’m Leyla. What’s your name?', ['greet','introduce','askName'])},
 4: {2:('Hello. I’m Leyla.', ['greet','introduce']),3:('What’s your name?|What is your name?', ['askName']),6:('Necəsən?',[],'How are you?'),7:('I’m fine.',[]),8:('are',[]),11:('I’m fine. And you?',[]),12:('I’m fine, thanks. And you?', ['fine','askFeeling']),15:('I’m not very well.', ['unwell']),16:('Alex',[]),17:('I’m OK, thanks. And you?', ['feeling','askFeeling'])},
 5: {2:('I’m Leyla. What’s your name?', ['introduce','askName']),3:('I’m fine. And you?', ['feeling','askFeeling']),5:('Təşəkkür.',[],'Thank you.'),6:('You’re welcome.',[]),7:('Thank you.|Thanks.|Thanks a lot.', ['thanks']),10:('Your name please',[]),11:('Your name, please.', ['politeName']),16:('Excuse me.',[]),17:('Sorry.|I’m sorry.|I am sorry.', ['sorry']),18:('No problem.|That’s OK.|It’s OK.', ['noProblem'],'I’m sorry.')},
 6: {2:('I’m OK. And you?', ['feeling','askFeeling']),3:('You’re welcome.|You are welcome.|No problem.', ['welcome'],'Thank you!'),5:('Başa düşmürəm.',[], 'I don’t understand.'),6:('I don’t understand.|I do not understand.', ['dontUnderstand']),8:('Could you say that again please',[]),10:('again',[]),11:('I don’t understand.|I do not understand.', ['dontUnderstand']),14:('Daha yavaş danışılmasını.',[], 'More slowly, please.'),15:('Can you repeat that more slowly, please?', ['repeat','slow']),16:('B təkrar istədi.',[])},
 7: {},
}
# Each voice card can contain more than one exchange, at its authored location.
VOICES = {
 1: {6:[('Hi!','Salam ver.','Hello!|Hi!',['greet'],'Hello!')],11:[('Hello!','Salamına səslə cavab ver.','Hello!|Hi!',['greet']),('Goodbye!','Qısa görüş bitdi. Səslə sağollaş.','Goodbye!|Bye!',['farewell'])]},
 2: {8:[('Hello. I’m BirFox.','Sam rolundasan. Salam ver və adını de.','Hi. I’m Sam.',['greet','introduce'],'Hi. I’m Sam.','Sam')],12:[('Hi. My name is BirFox.','Öz adını və ya seçdiyin başqa adı de.','My name is Leyla.',['introduce'])],16:[('Hi. I’m BirFox.','Salam ver və öz adını de.','Hello. I’m Leyla.',['greet','introduce']),('Bye!','Qısa görüş bitdi. Sağollaş.','Goodbye!|Bye!',['farewell'])]},
 3: {9:[('Hello!','BirFox-un adını soruş.','What’s your name?',['askName'],'What’s your name?')],12:[('Hello. What’s your name?','Adını de, sonra onun adını soruş.','I’m Leyla. What’s your name?',['introduce','askName'])],18:[('Hello. What’s your name?','Adını de və onun adını soruş.','I’m Leyla. What’s your name?',['introduce','askName']),('I’m BirFox. Nice to meet you.','Sən də şad olduğunu bildir.','You too.|Nice to meet you too.',['meet']),('Goodbye!','Qısa görüş bitdi. Sağollaş.','Bye!|Goodbye!',['farewell'])]},
 4: {9:[('Hi. How are you?','Yaxşı olduğunu de.','I’m fine, thanks.',['fine'],'I’m fine, thanks.')],13:[('Hello. How are you?','Yaxşı olduğunu de və onun da halını soruş.','I’m fine. And you?',['fine','askFeeling'])],18:[('Hi. How are you?','Öz halına uyğun cavab ver və onun da halını soruş.','I’m OK, thanks. And you?',['feeling','askFeeling'])]},
 5: {8:[('Thank you!','Təşəkkürünə cavab ver.','You’re welcome.',['welcome'],'You’re welcome.')],12:[('Hello!','BirFox-dan adını nəzakətlə istə. Please işlət.','Your name, please.',['politeName'])],19:[('Sorry!','Eybi olmadığını bildir.','No problem.',['noProblem']),('Thank you!','Başqa anda BirFox təşəkkür edir. Cavab ver.','You’re welcome.',['welcome'])]},
 6: {9:[('I’m BirFox.','Adı dəqiq tutmadın. Yenidən deməsini istə.','Could you say that again, please?',['repeat'],'Could you say that again, please?')],12:[('How are you?','Anlamadığını bildir, sonra təkrar istə.','I don’t understand. Could you say that again, please?',['dontUnderstand','repeat'])],17:[('My name is BirFox.','BirFox-un adını daha yavaş deməsini istə.','More slowly, please.',['slow'])]},
 7: {2:[('Hi!','Salamına səslə cavab ver.','Hello!|Hi!',['greet'])],3:[('Thank you!','Təşəkkürə cavab ver.','You’re welcome.',['welcome'])],4:[('Hello. What’s your name?','Salam ver, adını de və onun adını soruş.','Hi. I’m Leyla. What’s your name?',['greet','introduce','askName'])],5:[('I’m BirFox. Nice to meet you.','Tanış olduğuna şad olduğunu bildir.','You too.',['meet'])],6:[('How are you?','Öz halına uyğun cavab ver və onun da halını soruş.','I’m OK, thanks. And you?',['feeling','askFeeling'])],7:[('My name is BirFox.','Adı anlamadığını bildir və təkrar istə.','I don’t understand. Could you say that again, please?',['dontUnderstand','repeat'])],8:[('My name is BirFox.','İndi eşitdin. Təşəkkür et.','Thank you.',['thanks'])],9:[('How are you?','Daha yavaş deməsini istə.','More slowly, please.',['slow'])],10:[('How are you?','Halına uyğun cavab ver.','I’m fine, thanks.',['feeling'])],11:[('I’m sorry.','Eybi olmadığını bildir.','No problem.',['noProblem'])],12:[('Thank you!','Təşəkkürə cavab ver.','You’re welcome.',['welcome'])],13:[('Bye!','Görüş bitdi. Sağollaş.','Bye!|Goodbye!',['farewell'])]},
}
TITLES=['Salamlaşma və sağollaşma','Öz adını demək','Qarşı tərəfin adını soruşmaq','Hal-əhval','Nəzakətli ifadələr','Təkrar və yavaş danışmağı istəmək','BirFox ilə səsli söhbət']

def blocks(text, pattern=r'^### Kart (\d+) [^\n]*'):
    matches=list(re.finditer(pattern,text,re.M))
    return [(int(m[1]), m[0].split('—',1)[-1].strip(),text[m.end():matches[i+1].start() if i+1<len(matches) else len(text)].strip()) for i,m in enumerate(matches)]

def clean(text):
    text=text.split('Yoxlamadan sonra:')[0]
    text=re.sub(r'\[[^\]\n]*\]', '',text)
    text=re.sub(r'^(EKRANDA:|BirFox:|Situasiya:|Vəziyyət:|Təlimat:|Məqsəd:|Cümlə:|Lövhə:|Lövhədə:|Qarşı tərəf:)\s*', '',text, flags=re.M)
    text=re.sub(r'^.*(?:cavabdan əvvəl|əvvəlcədən göstərilmir|əvvəlcədən görünmür|Boş cavab sahəsi|Hazır cavab|Hər növbədə Keç|Yoxla\.|Keç\.|Düymə:|Cavab sahəsi boşdur|İstifadəçi səsli cavab verir|Görünən nümunə|Verilən sözlər qarışıq sırada).*$', '',text,flags=re.M)
    text=re.sub(r'^.*(?:Audio mətni ayrıca|Nümunə və söz siyahısı).*$', '',text,flags=re.M)
    return re.sub(r'\n{3,}','\n\n',text).strip().replace('“','').replace('”','')

def rule(spec):
    return {'answers':spec[0].split('|'), **({'goals':spec[1]} if spec[1] else {'exact':True})}

def add_reviews(n,cards,text):
    early={
      1:{3:('Qonşunla qarşılaşdın. İngiliscə salam yaz.','Hello!|Hi!',['greet']),4:('Dinlə və eşitdiyin sözü yaz.','Hi',[],'Hi!'),5:('Tanışın Hello deyir. Salamına cavab yaz.','Hello!|Hi!',['greet']),8:('Qonağın evdən gedir. Onunla ingiliscə sağollaş.','Goodbye!|Bye!',['farewell']),9:('BirFox görüşə yeni gəlir, amma Bye deyir. Salamını düzəlt.','Hello!|Hi!',['greet']),10:('Tanışın Bye deyir və gedir. Cavab yaz.','Goodbye!|Bye!',['farewell'])},
      2:{2:('Yeni tanışın Hi deyir. Salamına cavab yaz.','Hello!|Hi!',['greet']),3:('Tanışın Goodbye deyir. Cavab yaz.','Bye!|Goodbye!',['farewell']),5:('Dinlə. Danışanın adını yaz.','Alex',[],'Hello. I’m Alex.'),6:('Sam öz adını deyir. Boşluğu tamamla: I ___ Sam.','am',[]),7:('Sam öz adını deyir. Boşluğu tamamla: I ___ Sam.','am',[]),10:('Oxu və adı yaz: My name is Alex.','Alex',[]),11:('Leyla özünü təqdim edir. Düzəlt: My name am Leyla.','My name is Leyla.|I’m Leyla.',['introduce']),13:('Leyla özünü təqdim edir. Düzəlt: My name am Leyla.','My name is Leyla.|I’m Leyla.',['introduce']),14:('Leyla özünü təqdim edir. Düzəlt: My name am Leyla.','My name is Leyla.|I’m Leyla.',['introduce']),15:('Qonşunla ilk dəfə tanış olursan. Salam ver və adını yaz.','Hello. I’m Leyla.',['greet','introduce'])},
      3:{2:('Yeni qonşuna salam ver və öz adını yaz.','Hello. I’m Leyla.',['greet','introduce']),3:('Dinlə. Danışanın adını yaz.','Alex',[],'Hi. I’m Alex.'),6:('Qarşı tərəfin adını öyrənmək üçün sual yaz.','What’s your name?',['askName']),7:('Yeni qonağın adını soruş.','What’s your name?',['askName']),8:('Yeni qonağın adını soruş.','What’s your name?',['askName']),10:('Tam sualı tamamla: What ___ your name?','is',[]),11:('Yeni qonağın adını soruş.','What’s your name?',['askName']),15:('Dinlə və tanış olduğuna şad olduğunu bildir.','You too.|Nice to meet you too.',['meet'],'Nice to meet you.'),16:('Dinlə və tanış olduğuna şad olduğunu bildir.','You too.|Nice to meet you too.',['meet'],'Nice to meet you.'),17:('Başqa bir tanışınla görüşürsən. Salam ver, adını de və onun adını soruş.','Hello. I’m Leyla. What’s your name?',['greet','introduce','askName'])},
    }
    changed={4:{6:('How are you?',['askFeeling']),7:('fine|well|good',[]),8:('How are you?',['askFeeling']),11:('I’m fine. And you?',['feeling','askFeeling']),16:('Sam',[])},5:{5:('Thank you.|Thanks.',['thanks']),6:('You’re welcome.|No problem.',['welcome']),10:('please',[]),16:('Excuse me.|Sorry.',['attention'])},6:{5:('I don’t understand.',['dontUnderstand']),8:('Again, please.',['repeat']),10:('Could you say that again, please?',['repeat']),14:('More slowly, please.',['slow']),15:('More slowly, please.',['slow']),16:('Ad təqdimatı|I’m Alex.',[])}}
    rows={}
    if n in [4,5,6]:
        for line in text.splitlines():
            if not re.match(r'^\| T\d+',line):continue
            cols=[v.strip() for v in line.strip('|').split('|')]
            rows[int(cols[1])]=cols[2].strip('“”')
    for card in cards:
        if card['kind'] not in ['task','voice']:continue
        number=card['number'];review={k:copy.deepcopy(v) for k,v in card.items() if k not in ['options','words','board','examples']}
        if n in early and number in early[n]:
            spec=early[n][number];review['body']=spec[0];review['rule']=rule((spec[1],spec[2]));review.pop('audio',None)
            if len(spec)>3:review['audio']=spec[3]
        elif number in rows:
            review['body']=rows[number];review.pop('audio',None)
            if number in changed.get(n,{}):review['rule']=rule(changed[n][number])
            if n==4 and number==2:review['rule']['roleName']='Sam';review['rule']['answers']=['Hello. I’m Sam.']
            if n==5 and number==2:review['rule']['roleName']='Leyla'
        elif card['kind']=='voice':
            review['turns']=[{k:v for k,v in turn.items() if k!='sample'} for turn in card['turns']]
            for turn in review['turns']:
                turn['prompt']='Bir daha məşq edək. '+turn['prompt']
        else:raise ValueError(f'Missing review mapping: D{n} card {number}')
        if review['kind']=='task':
            review['explanation']='Nümunə: '+review['rule']['answers'][0]
        card['review']=review

def compile_lesson(n,source,text):
    if n==1: a=text.split('## “Mənə başa sal”')[0]
    else: a=text.split('## A.',1)[1].split('## B.',1)[0]
    cards=[]
    for number,title,raw in blocks(a):
        raw=raw.split('HAZIRLAYAN ÜÇÜN:')[0].replace('EKRANDA:','').strip()
        cid=f'a1_en_b1_v2_d{n}_c{number:02d}'
        kind='voice' if number in VOICES[n] else 'task' if number in KEYS[n] else 'intro' if number==1 else 'review' if 'təkrar' in title and 'başlanğıc' not in title.lower() else 'result' if 'nəticə' in title.lower() else 'teach'
        card={'id':cid,'number':number,'title':title,'kind':kind,'source':f'{source}#Kart {number:02d}','body':clean(raw)}
        if kind=='task':
            spec=KEYS[n][number];card['rule']=rule(spec)
            if n==5 and number==10:card['rule']['answers'].append('Please, your name.')
            if n==6 and number==8:card['rule']['answers'] += ['Could you please say that again?','Please, could you say that again?']
            if n==2 and number==11:card['rule']['roleName']='BirFox'
            if len(spec)>2:card['audio']=spec[2]
            options=re.findall(r'^[A-D]\)\s*(.+)$',raw,re.M)
            if options:card['options']=options;card['body']=re.sub(r'^[A-D]\).*$','',card['body'],flags=re.M).strip()
            wordline=next((line for line in raw.splitlines() if ' / ' in line and not line.startswith(('Lövhə','Goodbye','Bye'))),None)
            if wordline and ('qur' in title or 'cümlə qur' in title):
                card['words']=[v.strip() for v in wordline.split('/')];card['body']=card['body'].replace(wordline,'').strip()
            if 'Lövhədə' in raw:
                m=re.search(r'Lövhədə(?: BirFox-un dediyi)?:\s*\n?([^\n]+)',raw);card['board']=m[1].strip('“”') if m else ''
            card['explanation']=f'Bu tapşırıqda uyğun cavab: {card["rule"]["answers"][0]}'
            if card.get('audio'):
                card['explanation']=f'Bu səsdə “{card["audio"]}” deyilir. Tapşırığın uyğun cavabı: {card["rule"]["answers"][0]}'
            if n==1 and number==4:card['explanation']='Hello da salamdır. Amma bu səsdə Hi deyilir. Burada eşitdiyin sözü yazmalısan.'
        if kind=='teach':
            before=raw.split('Səsləndiriləcək')[0]
            card['body']=clean(before)
            board=re.search(r'Lövhə:\s*\n?([^\n]+)',before)
            if board:card['board']=board[1].strip('“”')
            examples=[]
            if n<=3 and 'Səsləndiriləcək' in raw:
                examples=[v.strip('“” ') for v in raw.split('Səsləndiriləcək',1)[1].split('\n')[1:] if v.strip()]
            if n>=4:
                b=text.split('## B.',1)[1].split('## C.',1)[0]
                bb=next((v for k,_,v in blocks(b) if k==number),'')
                examples=re.findall(r'^\d+\. (.+)$',bb,re.M)
            card['examples']=examples
        if kind=='voice':
            card['body']='';card['turns']=[]
            for i,spec in enumerate(VOICES[n][number]):
                turn={'id':f'{cid}_v{i+1}','audio':spec[0],'prompt':spec[1],'rule':rule((spec[2],spec[3]))}
                if len(spec)>4 and spec[4]:turn['sample']=spec[4]
                if len(spec)>5:turn['rule']['roleName']=spec[5]
                if 'askName' in spec[3]:turn['reply']='I’m BirFox.'
                if n==7 and number==10:turn['rate']=0.45
                card['turns'].append(turn)
        cards.append(card)
    # Preserve original author vocabulary table, excluding duplicated headers.
    vocab=[]
    section=next((part for part in text.split('\n## ') if 'lüğətim' in part.split('\n')[0].lower()),'')
    for line in section.splitlines():
        if not line.startswith('|'):continue
        row=[v.strip() for v in line.strip('|').split('|')]
        if len(row)>=4 and row[0] not in ['Forma','İfadə','Maddə','Yeni ifadə'] and not set(row[0])<=set('- :'):
            if any(x in row[0] for x in ['söz','ifadə','İngilis','İngiliscə']):continue
            if len(row)==4:
                example,_,az=row[2].partition(' — ')
                vocab.append({'word':row[0],'translation':row[1],'example':example,'exampleAz':az,'usageNote':row[3],'pronunciation':''})
            else:vocab.append({'word':row[0],'translation':row[1],'example':row[2],'exampleAz':row[3],'usageNote':row[4],'pronunciation':row[5] if len(row)>5 else ''})
    add_reviews(n,cards,text)
    return {'id':f'a1_en_b1_v2_d{n}','order':n,'title':TITLES[n-1],'goal':cards[0]['body'],'cards':cards,'vocabulary':vocab}

def compile_exams(text,source):
    goals={3:['greet','introduce','askName'],5:['politeName'],6:['meet','fine','askFeeling'],7:['thanks'],9:['noProblem'],10:['reason'],11:['introduce'],12:['dontUnderstand','repeat'],13:['slow'],14:['attention'],15:['slow'],16:['sorry'],17:['farewell']}
    variants=[]
    keys=text.split('## Cavab açarı və audio',1)[1].split('## “Mənə başa sal”',1)[0]
    for variant in ['A','B']:
        section=text.split(f'## {variant} variantı — tələbənin',1)[1].split('\n## ',1)[0]
        keysection=keys.split(f'### {variant} variantı',1)[1].split('\n### ',1)[0]
        keyblocks={n:b for n,_,b in blocks(keysection,r'^#### Tapşırıq (\d+) · [AB]')}
        cards=[]
        for number,title,raw in blocks(section):
            q=number-1
            if not 1<=q<=17:continue
            b=keyblocks[q]
            expected=re.search(r'Gözlənilən cavab / nümunə: (.+)',b)[1].strip()
            alternatives=re.search(r'Alternativlər: (.+)',b)[1].split(' — ')[0]
            accepted=[expected]+([x.strip().rstrip('.') for x in alternatives.split(' / ')] if not alternatives.startswith('Ortaq') else [])
            options=re.findall(r'^[A-C]\)\s*(.+)$',raw,re.M)
            if options:accepted=[options[ord(expected)-ord('A')]]
            card={'id':f'b1_exam_q{q:02d}','number':q,'title':title,'source':f'{source}#{variant} Tapşırıq {q:02d}','kind':'task','body':clean(raw), 'rule':{'answers':accepted}}
            card['body']=re.sub(r'^[A-C]\).*$','',card['body'],flags=re.M)
            card['body']=re.sub(r'^.*(?:Yazılı davam et|Variantı seç|Göndər|cavab nümunəsi yoxdur).*$', '',card['body'],flags=re.M).strip()
            if options:card['options']=options
            if q in goals:card['rule']['goals']=goals[q].copy()
            else:card['rule']['exact']=True
            if q==3:card['rule']['roleName']='Nora' if variant=='A' else 'Leo'
            if q==6 and variant=='B':card['rule']['goals']=['meet','unwell','askFeeling']
            if q==11:card['rule']['roleName']='BirFox' if variant=='A' else 'Mila'
            audiosection=b.split('Dəqiq ingilis audio mətni:',1)[1].split('Tələb olunan funksiya:',1)[0]
            audios=re.findall(r'^\d+\. “(.+)”',audiosection,re.M)
            if audios:card['audio']=audios[0]
            if 'Səsli cavab' in title:card['kind']='voice';card['turns']=[{'id':card['id'],'prompt':card['body'],'audio':card.get('audio',''),'rule':card['rule']}]
            if q==4:card['words']=['your','What','name','is'] if variant=='A' else ['name','your','What’s']
            cards.append(card)
        variants.append({'variant':variant,'cards':cards,'required':[1,2,3,5,6,7,9,10,12,14,15,16,17]})
    return variants

def main():
    package=Path(sys.argv[1]); data=[]
    with ZipFile(package) as z:
        for n in range(1,8):
            source=next(name for name in z.namelist() if f'_D{n}_' in name)
            data.append(compile_lesson(n,source,z.read(source).decode('utf-8-sig')))
        source=next(name for name in z.namelist() if '_Kecid_Imtahani' in name)
        exams=compile_exams(z.read(source).decode('utf-8-sig'),source)
    # Consistent Azerbaijani names in UI, answers, role facts, examples and audio.
    payload=json.dumps(data,ensure_ascii=False,indent=2)
    payload=payload.replace('Samdır','Əlidir').replace('Samam','Əliyəm').replace('Sam','Ali').replace('Alex','Murad')
    target=Path(__file__).resolve().parents[1]/'src/data/b1Packet.json'
    target.write_text(payload+'\n',encoding='utf-8')
    target.with_name('b1Exams.json').write_text(json.dumps(exams,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Compiled',len(data),'lessons;',sum(len(l['cards']) for l in data),'cards; ZIP SHA256',hashlib.sha256(package.read_bytes()).hexdigest())

if __name__=='__main__':main()
