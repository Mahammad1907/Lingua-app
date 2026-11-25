// Situation ↔ screen check (user, 24 Nov 2026). A task's situation must fit what the learner does on the screen:
// meeting someone face to face → speak; a chat / message → write. Example of the bug this catches: Dərs 1
// “Tanışınla qarşılaşdın … salam yaz” shown in a messenger window. Reviews (task.review) are checked too.
// The words lists are a first filter; every hit is then read by a person. Rules L1–L12: docs/MENTIQ_YOXLAMASI.md.
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const { designLessons } = require('../src/data/designLessons.ts');

// A chat screen must say that it is a chat (someone writes, a message, a group chat …).
const WRITTEN = /yaz(ır|dı|ıb|ırsan|ışır)|mesaj|çat|qrup|onlayn|e-poçt/i;
// Things that only happen face to face (or by voice): pointing at someone, handing over, speaking, a call.
const FACE = /qarşılaş|rastlaş|tanış ol(ur|du)(?!ğ)|göstər(ir|ib)|yanındakı|yanında dost|qaytardı|sənə .{0,12}verdi|dedin|dedi\b|deyir\b|danışırsan|gəldi\b|evə gedir|gedirsən|tanış olursan|görüşün var|görüşə başlayarkən|video zəng|telefonda .{0,20}göstər/i;
const SPOKEN_QUESTION = /soruşur|deyib|deyir\b|dedi\b|danışmağı/i;
const NOT_A_REPLY = /dinlə və yaz|eşitdiyin|toxun|yığ|yerinə uyğun|siyahı|forma|qeydiyyat/i;

const hits = [];
const look = (lesson, task, where) => {
  const text = [task.title, task.prompt, task.context, task.instruction].filter(Boolean).join(' ').replace(/\s+/g, ' ');
  const scenes = (task.scenes || []).join(' ');
  const id = `${lesson.id} · ${task.id}${where ? ` (${where})` : ''}`;
  if (task.type === 'write' && task.chat) {
    if (!WRITTEN.test(text)) hits.push(`${id}: mesajlaşma ekranı, amma mətndə yazışma yoxdur — “${text}”`);
    else if (FACE.test(text)) hits.push(`${id}: mesajlaşma ekranı, amma vəziyyət üz-üzədir — “${text}”`);
    if (/meet|street|yard/.test(scenes)) hits.push(`${id}: mesajlaşma ekranında görüş şəkli (${scenes})`);
  } else if (task.type === 'two' && FACE.test(text) && !/görüşəcəksən|görüşdən (əvvəl|sonra)|zəngdən|getdi\b|sonra mesaj/i.test(text)) {
    hits.push(`${id}: üz-üzə vəziyyət, amma mesaj yazmaq tapşırığı — “${text}”`);
  } else if (task.type === 'write' && task.audio && /cavab ver/i.test(text) && !WRITTEN.test(text)) {
    hits.push(`${id}: səslə deyilənə yazılı cavab — “${text}”`);
  } else if (task.type === 'write' && SPOKEN_QUESTION.test(text) && !WRITTEN.test(text.replace(/yaz\.?$/, '')) && !NOT_A_REPLY.test(text)) {
    hits.push(`${id}: danışıqla verilən suala yazılı cavab — “${text}”`);
  }
  // ── Realism checks added 24–25 Nov 2026 (full review of Bölmə 1–2, see docs/MENTIQ_YOXLAMASI.md) ──
  const chatText = task.chat ? task.chat.lines.map(l => l.text).join(' ') : '';
  // Text the learner hears or reads inside the task (audio, chat, match/order rows).
  const heard = `${task.audio || ''} ${chatText} ${(task.rows || []).map(r => [r.text, r.en, r.az, r.left].filter(Boolean).join(' ')).join(' ')}`;
  const NUMBER_WORD = /^(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|[a-z]+teen|[a-z]+ty)\.?$/i;
  const answers = (task.rule && task.rule.answers) || [];
  // L4: a written message never spells numbers out (“Zero five…”, “oh three”) — people type digits.
  if (task.chat && /\b(zero|oh)\b[ ,]+(one|two|three|four|five|six|seven|eight|nine|zero|oh)\b/i.test(chatText)) hits.push(`${id}: yazılı mesajda nömrə sözlə yazılıb (rəqəmlə olmalıdır) — “${chatText}”`);
  // L5: asking how to spell a word that the other person has just written.
  if (task.chat && answers.some(a => /spell/i.test(a)) && /[A-Za-z]{3,}/.test(chatText.replace(/🎤/g, ''))) hits.push(`${id}: söz söhbətdə yazılıb, amma “hərf-hərf necə yazılır?” soruşulur — “${chatText}”`);
  // L6: writing a heard number as a word needs a reason (someone asks how it is written).
  if (task.type === 'write' && (/sözlə yaz/i.test(text) || NUMBER_WORD.test((task.audio || '').trim())) && !/necə yazılır|necədir|soruşur/i.test(text)) hits.push(`${id}: rəqəmi sözlə yazmağın səbəbi yoxdur — “${text}”`);
  // L7: forms take data, not sentences.
  if (/formada|formaya|vərəqdə|anketdə/i.test(text) && /tam cümlə|cümlə ilə/i.test(text) && !/mesaj/i.test(text)) hits.push(`${id}: formaya tam cümlə yazılmır — “${text}”`);
  // L8: strangers in a queue / street / lift do not ask personal data.
  if (/növbədə|növbəsində|yanındakı adam|küçədə|liftdə/i.test(text) && /(how old|phone number|email|last name)/i.test(heard)) hits.push(`${id}: yad adam şəxsi məlumat soruşur — “${text}”`);
  // L9: an answer to a question does not start with “Excuse me”.
  if (/cavab ver|soruşur/i.test(text) && answers.some(a => /^excuse me/i.test(a))) hits.push(`${id}: suala cavabda “Excuse me” — ${answers.join(' / ')}`);
  // L10: “qonşu” means a neighbour at home, not the person next to you in a hotel/office lift.
  if (/\bqonşu/i.test(text) && /otel|ofis|lift/i.test(text)) hits.push(`${id}: “qonşu” otel/ofis/liftdə “yanındakı adam” olmalıdır — “${text}”`);
  // L11: “say it letter by letter” → the model answer shows the letters.
  if (task.type === 'voice' && /hərf-hərf de([.,\s]|$)/i.test(text) && answers.length && !answers.some(a => /[A-Z][-,] ?[A-Z]/.test(a))) hits.push(`${id}: “hərf-hərf de” deyilir, nümunə cavab hərflərlə deyil — ${answers.join(' / ')}`);
  // L12: personal data is asked privately, not in a group chat.
  if (/qrup(un)? çat/i.test(text) && answers.concat(task.fields ? task.fields.flatMap(f => (f.rule && f.rule.answers) || []) : []).some(a => /phone number|email/i.test(a))) hits.push(`${id}: şəxsi məlumat ümumi qrup çatında soruşulur — “${text}”`);
  // L13: checking a number you wrote down repeats the number (“050…? Is that right?”).
  if (task.fields && task.fields.some(f => ((f.rule && f.rule.answers) || []).some(a => /^is that right\?$/i.test(a.trim())))) hits.push(`${id}: “Is that right?” nömrəsiz yazılıb — yoxlanan nömrə də mesajda olmalıdır`);
  // ── Added 25 Nov 2026 (Bölmə 3 review) ──
  // L14: writing a question/sentence to someone who is right there (no chat, no message).
  if ((task.type === 'write' || task.type === 'two') && !task.chat && !task.audio && /masasındasan|mətbəxində|resepsiyasında|yanındakı|qarşında/i.test(text) && /qur|yaz/i.test(text) && !WRITTEN.test(text) && !/işləyirsən|formaya|vərəqə|vərəqini|vərəqi/i.test(text)) hits.push(`${id}: adam qarşındadır, amma yazırsan — “${text}”`);
  // L15: the picture shows the place of the situation.
  const PLACE = { videocall: /video/i, train: /qatar|stansiya/i, airport: /hava liman|uçuş|tablo/i, hostel: /hostel/i, 'hostel-kitchen': /mətbəx|hostel/i, cafe: /kafe/i, club: /klub/i, party: /ziyafət/i, passport: /pasport/i };
  for (const s of task.scenes || []) {
    const place = s.split('/')[1];
    if (PLACE[place] && !PLACE[place].test(text)) hits.push(`${id}: şəkil “${s}”, amma vəziyyət başqa yerdədir — “${text}”`);
  }
  // L16: writing down what you hear needs a reason (you work there, a form, someone asks).
  if (task.type === 'write' && task.audio && /eşitdiyini yaz|eşitdiyin sözü yaz|millətini yaz/i.test(text) && !/işləyirsən|formaya|vərəqə|soruşur|qeyd|yazmaq istəyirsən|dosta yazırsan/i.test(text)) hits.push(`${id}: diktənin səbəbi yoxdur (kim, niyə yazır?) — “${text}”`);
  // L17: staff do not ask you about strangers next to you.
  if (/bələdçi|işçi|resepsiyaçı/i.test(text) && /(where's|where is|is) (he|she)\b/i.test(heard) && /yanında/i.test(text)) hits.push(`${id}: işçi səndən yad adamlar haqqında soruşur — “${text}”`);
  // ── Added 25 Nov 2026 (Bölmə 4 review) ──
  // L18: the foreign friend is not in your family chat; family members do not ask who your relatives are.
  if (/ailə (çat|qrup)/i.test(text) && (/\{[Ff]/.test(text) || /who's (he|she|this)|is (this|she|he) your/i.test(heard))) hits.push(`${id}: “ailə çatı”nda xarici dost / ailəsi səndən qohumunu soruşur — “${text}”`);
  // L19: the person who shows a picture does not ask you who is in it.
  const asker = text.match(/(\S+) (?:nəyi |kimi )?soruşur/);
  if (/\bgöstərir\b/i.test(text) && !/göstərirsən|sənin/.test(text) && /who's (he|she|this)|what's (his|her) job|how old is (he|she)/i.test(heard) && (!asker || asker[1] === 'O')) hits.push(`${id}: şəkli göstərən özü soruşur — “${text}”`);
  // L20: the answer fits the question in the chat (“Who's this?” is not answered with a place).
  if (task.chat && /who's (this|he|she)\??$/i.test(chatText.trim()) && answers.length && !answers.some(a => /^(this|he|she|it)\b/i.test(a.trim()))) hits.push(`${id}: söhbətdə “${chatText.trim()}”, cavab isə başqa sualın cavabıdır — ${answers[0]}`);
  // L21: a written sentence needs someone to write to or somewhere to write it.
  if ((task.type === 'write' || task.type === 'two') && !task.chat && !task.audio && !/mesaj|çat|qrup|yaz(ır|ırsan|dı|dın)|altına|formaya|vərəq|siyahı|göndər|soruşur|imzala|kartına|kağız|yerinə/i.test(text)) hits.push(`${id}: kimə / harada yazırsan? — “${text}”`);
  if (task.type === 'voice' && /mesaj|çat|yazır\b|yazdı/i.test(text) && !/siyahıya yazır|adını .{0,20}yazır/i.test(text)) hits.push(`${id}: yazışma vəziyyəti, amma danışıq tapşırığı — “${text}”`);
};
for (const lesson of designLessons) {
  for (const card of lesson.cards || []) {
    if (!card || !card.type || ['intro', 'teach', 'explain', 'word'].includes(card.type)) continue;
    look(lesson, card, '');
    if (card.review) look(lesson, { ...card, ...card.review, id: card.id }, 'təkrar');
  }
}
if (hits.length) {
  console.log(`check-situation: ${hits.length} yer yoxlanmalıdır:\n- ${hits.join('\n- ')}`);
  process.exit(1);
}
console.log('check-situation: every task situation fits its screen (face to face → speak, message → write).');
