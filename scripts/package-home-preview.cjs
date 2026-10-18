const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(path.dirname(module.filename),'..');
const source=process.argv[2] || path.join(root, 'dist');
let html=fs.readFileSync(path.join(source,'home-preview.html'),'utf8');
html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link[^>]*rel="icon"[^>]*>/g,'');
const images=['fox','family','backpack','house','clock','guitar'];let i=0;
html=html.replace(/<div class="[^"]*r-1niwhzg[^"]*"><\/div>/g,()=>{
 const name=images[i++];if(!name)throw Error('Unexpected image placeholder');
 const dataPath = '../../assets/home/' + name + '.webp';
 return `<img alt="" draggable="false" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain" src="${dataPath}">`;
});
if(i!==6)throw Error(`Expected 6 images, found ${i}`);
html=html.replace('<title data-rh="true"></title>','<title>BirTalk · Ana ekran nümunəsi</title>');
html=html.replace('</head>',`<style>html,body{background:#090c19!important}#root{max-width:430px;width:100%;height:calc(100dvh - 24px);margin:24px auto 0;border-left:1px solid #29243e;border-right:1px solid #29243e}.preview-note{position:fixed;top:0;left:0;right:0;height:24px;text-align:center;font:10px/24px system-ui;color:#b9abd3;background:#171428;z-index:99}.preview-toast{position:fixed;left:50%;bottom:100px;transform:translateX(-50%);max-width:320px;background:#30243d;color:#fff;border:1px solid #ff9b35;border-radius:12px;padding:12px;font:13px/1.4 system-ui;z-index:100;display:none}</style></head>`);
html=html.replace('<body>','<body><div class="preview-note">Dizayn nümunəsi · Rəqəmlər nümayiş üçündür</div>');
html=html.replace('</body>','<div class="preview-toast" id="preview-toast">Bu, görünüş nümunəsidir. Düymələr tətbiqdə müvafiq ekranları açır.</div><script>let timer;document.addEventListener("click",e=>{const b=e.target.closest("[role=button],[role=tab]");if(!b||b.getAttribute("aria-disabled")==="true")return;const t=document.getElementById("preview-toast");t.style.display="block";clearTimeout(timer);timer=setTimeout(()=>t.style.display="none",2200);});</script></body>');
fs.writeFileSync(path.join(root,'docs/previews/home-reference.html'),html);console.log('Preview: native component SSR + six relative WebP images.');
