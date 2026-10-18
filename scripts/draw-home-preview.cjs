const { Buffer } = require('node:buffer');
// Static layout proof using the same prepared artwork. Not a device screenshot.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/sharp');
const root=path.resolve(path.dirname(module.filename),'..');
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
(async()=>{
 const art={};for(const name of ['fox','family','backpack','house','clock','guitar']) art[name]=(await sharp(path.join(root,'assets/home',name+'.webp')).png().toBuffer()).toString('base64');
 const parts=[`<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1648" viewBox="0 0 390 824"><defs>
 <linearGradient id="background" x2="0" y2="1"><stop stop-color="#0c1020"/><stop offset=".55" stop-color="#0f1225"/><stop offset="1" stop-color="#0c1020"/></linearGradient>
 <linearGradient id="card" x2="1" y2="1"><stop stop-color="#171b34"/><stop offset="1" stop-color="#14172d"/></linearGradient>
 <linearGradient id="active" x2="1" y2="1"><stop stop-color="#1a1a2e"/><stop offset=".7" stop-color="#1d2035"/><stop offset="1" stop-color="#27202b"/></linearGradient>
 <linearGradient id="orange"><stop stop-color="#ffb346"/><stop offset="1" stop-color="#ff962f"/></linearGradient>
 <radialGradient id="halo"><stop stop-color="#ff973b" stop-opacity=".25"/><stop offset="1" stop-color="#ff973b" stop-opacity="0"/></radialGradient>
 </defs><rect width="390" height="824" fill="url(#background)"/><g font-family="DejaVu Sans,sans-serif">`];
 const text=(x,y,t,size=12,color='#faf6ff',weight=500)=>parts.push(`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}">${escape(t)}</text>`);
 const image=(name,x,y,w,h)=>parts.push(`<image href="data:image/png;base64,${art[name]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`);
 const line=(d,color='#ab91f0',width=2)=>parts.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`);
 // Top row: the flag is drawn as a flag, not a replacement for 3D artwork.
 parts.push('<rect x="15" y="24" width="132" height="29" rx="15" fill="#16182d" stroke="#38305e"/>');
 parts.push('<g transform="translate(22 28)"><circle cx="11" cy="11" r="11" fill="#233f81"/><path d="m3 3 16 16M19 3 3 19" stroke="#fff" stroke-width="5"/><path d="m3 3 16 16M19 3 3 19" stroke="#d7495d" stroke-width="2"/><path d="M11 0V22M0 11H22" stroke="#fff" stroke-width="7"/><path d="M11 0V22M0 11H22" stroke="#da3857" stroke-width="4"/></g>');
 text(49,43,'İngilis dili',10.3,'#fffaff',700);line('m111 35 4 4 4-4');text(125,43,'A1',10.5,'#ac92f0',700);
 text(158,47,'Bir',23,'#fffaff',800);text(191,47,'Talk',23,'#ff9b35',800);
 text(251,42,'Enerji',10,'#ac92f0',700);parts.push('<rect x="287" y="31" width="81" height="14" rx="5" fill="none" stroke="#ae91f0"/><rect x="289" y="33" width="56" height="10" rx="4" fill="url(#orange)"/><rect x="371" y="34" width="4" height="8" rx="2" fill="#a38ade"/>');
 parts.push('<path d="m326 33-5 7h4l-1 5 6-8h-4l2-4Z" fill="#171320"/>');
 text(20,109,'Bölmələr',32,'#fffaff',800);text(21,132,'İngilis dili · A1',15,'#ac92f0',700);
 image('fox',238,57,129,96);line('M242 110l-7-5M240 119h-8M242 128l-7 5','#ff9b35',2);
 text(19,158,'A1 ·',11.5,'#ac92f0',700);text(47,158,'41%',11.5,'#ff9b35',700);
 parts.push('<rect x="78" y="151" width="184" height="7" rx="4" fill="#2b2b48"/><rect x="78" y="151" width="76" height="7" rx="4" fill="url(#orange)"/>');text(270,158,'Dərslərin tamamlanması',7.8,'#ac92f0',500);
 for(let y=208;y<751;y+=7)parts.push(`<circle cx="43" cy="${y}" r="1.4" fill="#695293"/>`);
 const rows=[{y:172,h:87,name:'family',order:3,title:'Ailə və yaxın insanlar',done:true},{y:270,h:87,name:'backpack',order:4,title:'Əşyalar və sahiblik',done:true},{y:368,h:179,name:'house',order:5,title:'Ev və əşyaların yeri',active:true},{y:558,h:87,name:'clock',order:6,title:'Gündəlik rejim və vaxt'},{y:656,h:87,name:'guitar',order:7,title:'Maraqlar və bacarıqlar'}];
 for(const r of rows){
  if(r.active)parts.push(`<ellipse cx="195" cy="${r.y+86}" rx="210" ry="120" fill="url(#halo)"/>`);
  parts.push(`<rect x="15" y="${r.y}" width="360" height="${r.h}" rx="13" fill="url(#${r.active?'active':'card'})" stroke="${r.active?'#d18b47':'#22253e'}"/>`);
  if(r.active){parts.push(`<path d="M22 ${r.y+1}Q16 ${r.y+2} 17 ${r.y+15}V${r.y+r.h-14}Q17 ${r.y+r.h-2} 25 ${r.y+r.h-1}" fill="none" stroke="#ffa039" stroke-width="4"/>`);parts.push(`<path d="m43 ${r.y-9}-6 12h5l-1 8 8-14h-5l2-6Z" fill="#ffb13f"/>`);}
  image(r.name,17,r.y+(r.active?18:5),r.active?110:102,r.active?105:77);
  text(133,r.y+23,`BÖLMƏ ${r.order}`,9.5,r.active?'#ff9b35':'#ac92f0',800);
  text(133,r.y+43,r.title,14.9,'#f9f6ff',800);
  if(r.done){parts.push(`<circle cx="143" cy="${r.y+64}" r="10" fill="#32e3bc"/>`);line(`m139 ${r.y+64} 3 3 5-6`,'#07372e',2.3);text(161,r.y+64,'Bölmə 100%',12,'#31e3bb',700);text(161,r.y+77,'Keçid imtahanı ✓',9,'#a290d1',500);}
  else if(r.active){text(133,r.y+66,'Bölmə',11.5,'#ac92f0',600);text(178,r.y+68,'27%',20,'#ff9b35',800);text(133,r.y+82,'4 / 15 dərs',11.5,'#e4ddfa');parts.push(`<rect x="133" y="${r.y+89}" width="228" height="7" rx="4" fill="#2b2b48"/><rect x="133" y="${r.y+89}" width="62" height="7" rx="4" fill="url(#orange)"/>`);text(133,r.y+114,'Keçid imtahanı  33%',11,'#ac92f0');parts.push(`<rect x="133" y="${r.y+121}" width="228" height="7" rx="4" fill="#2b2b48"/><rect x="133" y="${r.y+121}" width="76" height="7" rx="4" fill="#b495fa"/><rect x="133" y="${r.y+140}" width="228" height="30" rx="8" fill="url(#orange)"/>`);text(184,r.y+161,'Davam et',15,'#211822',800);line(`M285 ${r.y+155}h16m-6-5 6 5-6 5`,'#231b23',2.4);}
  else{line(`M138 ${r.y+63}v-5a4 4 0 0 1 8 0v5`,'#ac92f0',2);parts.push(`<rect x="135" y="${r.y+62}" width="14" height="11" rx="2" fill="#ac92f0"/>`);text(158,r.y+72,'Tezliklə',11,'#ac92f0');text(329,r.y+72,'0%',11,'#ac92f0');}
  if(!r.active)line(`m356 ${r.y+37} 5 6-5 6`,'#ac92f0',2);
 }
 parts.push('<rect x="183" y="749" width="24" height="3" rx="2" fill="#6958aa"/><path d="M0 765Q0 755 12 755H378Q390 755 390 767V824H0Z" fill="#0d1021" stroke="#29223f"/>');
 const nav=[{x:54,label:'Öyrən',color:'#ff9b35'},{x:149,label:'Təkrar',color:'#ac92f0'},{x:243,label:'Lüğətim',color:'#ac92f0'},{x:336,label:'Profil',color:'#ac92f0'}];
 parts.push('<path d="m43 779 11-9 11 9-3 1v14h-6v-8h-5v8h-6v-14Z" fill="#ff9b35"/>');
 line('M139 780a11 11 0 0 1 18-3l4 4M158 785a10 10 0 0 1-17 7l-4-4M161 773v8h-8M137 796v-8h8','#ac92f0',2);
 line('M243 777q-6-4-12-1v18q6-3 12 0 6-3 12 0v-18q-6-3-12 1v17','#ac92f0',1.9);
 parts.push('<circle cx="336" cy="776" r="5" fill="#ac92f0"/><path d="M325 794v-2a11 11 0 0 1 22 0v2Z" fill="#ac92f0"/>');
 for(const n of nav)text(n.x-(n.label.length*3),808,n.label,10.4,n.color,600);
 parts.push('<rect x="25" y="814" width="59" height="3" rx="2" fill="#ff9b35"/></g></svg>');
 const svg=parts.join('');fs.mkdirSync(path.join(root,'docs/previews'),{recursive:true});fs.writeFileSync(path.join(root,'docs/previews/home-layout.svg'),svg);
 await sharp(Buffer.from(svg)).png().toFile(path.join(root,'docs/previews/home-layout.png'));
 console.log('Layout proof rendered with prepared 3D artwork.');
})();
