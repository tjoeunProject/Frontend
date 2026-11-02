import assert from 'node:assert/strict';
import test from 'node:test';
import {build} from 'esbuild';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir=await mkdtemp(fileURLToPath(new URL('./.hashid-',import.meta.url)));
const output=dir+'/codec.cjs';
const result=await build({entryPoints:[fileURLToPath(new URL('../src/utils/hashidUtils.js',import.meta.url))],bundle:true,platform:'node',format:'cjs',packages:'external',write:false,
  define:{'import.meta.env':JSON.stringify({VITE_SALT:'routepick-fixture',VITE_HASHIDS_MIN_LENGTH:'8'})}});
await writeFile(output,result.outputFiles[0].text);
const codec=await import(pathToFileURL(output));
test('uses Vite salt and minimum length rather than undefined import.meta fields',()=>{
  assert.equal(codec.encodeId(12345).length,8);
  assert.equal(codec.decodeId(codec.encodeId(12345)),12345);
});
test.after(async()=>rm(dir,{recursive:true,force:true}));
