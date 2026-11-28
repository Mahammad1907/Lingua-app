// Compile check without node_modules (25 Nov 2026, user: “the app must never again fail to open like this”).
// Runs the TypeScript compiler over every file in src/ and reports only the errors that break the bundle or the
// screen at runtime — they do not depend on installed package types, so they are reliable here and on any PC:
//   syntax errors (TS1xxx), duplicate imports/names (TS2300, TS2451), a variable used before it is declared
//   (TS2448, TS2454), a name that does not exist at all (TS2304, TS2552), duplicate keys in an object (TS1117).
// Type errors caused by missing packages are ignored (they need `npm install`).
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(e.name) && !e.name.endsWith('.d.ts')) files.push(p);
  }
})(path.join(ROOT, 'src'));

const program = ts.createProgram(files, {
  noEmit: true, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true, allowJs: false, noResolve: false, types: [],
});
const BREAKING = new Set([1117, 2300, 2451, 2448, 2454, 2304, 2552]);
// Globals React Native / Metro provide at runtime.
const GLOBALS = new Set(['__DEV__', 'require', 'module', 'process', 'global', 'console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'fetch', 'FormData', 'AbortController', 'TextEncoder', 'TextDecoder', 'URL', 'URLSearchParams', 'Buffer', 'atob', 'btoa', 'queueMicrotask', 'performance', 'structuredClone', 'crypto', 'alert', 'cancelAnimationFrame', 'Blob', 'Headers', 'Request', 'Response', 'WebSocket', 'XMLHttpRequest', 'navigator']);

const problems = [];
for (const sf of program.getSourceFiles()) {
  if (!sf.fileName.includes(`${path.sep}src${path.sep}`) && !sf.fileName.includes('/src/')) continue;
  const diags = [...program.getSyntacticDiagnostics(sf), ...program.getSemanticDiagnostics(sf)];
  for (const dg of diags) {
    const syntax = dg.code >= 1000 && dg.code < 2000 && dg.category === ts.DiagnosticCategory.Error;
    if (!syntax && !BREAKING.has(dg.code)) continue;
    const msg = ts.flattenDiagnosticMessageText(dg.messageText, ' ');
    if ((dg.code === 2304 || dg.code === 2552) && [...GLOBALS].some(g => msg.includes(`'${g}'`))) continue;
    const at = dg.start !== undefined ? sf.getLineAndCharacterOfPosition(dg.start) : { line: 0, character: 0 };
    problems.push(`${path.relative(ROOT, sf.fileName)}:${at.line + 1}:${at.character + 1}  TS${dg.code}  ${msg}`);
  }
}

if (problems.length) {
  console.log(`check-compile: ${problems.length} xəta (tətbiq açılmaya bilər):`);
  for (const p of problems) console.log('  ' + p);
  process.exit(1);
}
console.log(`check-compile: OK (${files.length} fayl)`);
