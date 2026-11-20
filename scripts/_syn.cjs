const ts=require('typescript'),fs=require('fs');
for(const f of process.argv.slice(2)){const r=ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.React}});console.log(f,r.diagnostics.length?r.diagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')):'ok');}
