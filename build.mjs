import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
const base=(process.env.BASE_PATH||'/').replace(/^\/*/,'/').replace(/\/*$/,'/');
await rm('dist',{recursive:true,force:true}); await mkdir('dist',{recursive:true});
for (const f of ['index.html','style.css','app.js','interpreter.js','examples.js']) await cp(f,`dist/${f}`);
let html=await readFile('dist/index.html','utf8'); html=html.replace('<head>','<head>\n  <base href="'+base+'">'); await writeFile('dist/index.html',html);
console.log(`Built static site at dist/ (base ${base})`);
