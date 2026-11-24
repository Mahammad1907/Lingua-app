// Situation ↔ screen check (user, 24 Nov 2026). A task's situation must fit what the learner does on the screen:
// meeting someone face to face → speak; a chat / message → write. Example of the bug this catches: Dərs 1
// “Tanışınla qarşılaşdın … salam yaz” shown in a messenger window. Reviews (task.review) are checked too.
// The words lists are a first filter; every hit is then read by a person.
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const { designLessons } = require('../src/data/designLessons.ts');

// A chat screen must say that it is a chat (someone writes, a message, a group chat …).
const WRITTEN = /yaz(ır|dı|ıb|ırsan|ışır)|mesaj|çat|qrup|onlayn|e-poçt/i;
// Things that only happen face to face (or by voice): pointing at someone, handing over, speaking, a call.
const FACE = /qarşılaş|rastlaş|tanış ol(ur|du)(?!ğ)|göstər(ir|ib)|yanındakı|yanında dost|qaytardı|sənə .{0,12}verdi|dedin|dedi\b|deyir\b|danışırsan|gəldi\b|evə gedir|gedirsən|video zəng|telefonda .{0,20}göstər/i;
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
  } else if (task.type === 'write' && SPOKEN_QUESTION.test(text) && !WRITTEN.test(text.replace(/yaz\.?$/, '')) && !NOT_A_REPLY.test(text)) {
    hits.push(`${id}: danışıqla verilən suala yazılı cavab — “${text}”`);
  }
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
