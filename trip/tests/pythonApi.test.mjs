import assert from 'node:assert/strict';
import test from 'node:test';
import {build} from 'esbuild';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir=await mkdtemp(fileURLToPath(new URL('./.python-',import.meta.url)));
const output=dir+'/api.cjs';
const bundle=await build({entryPoints:[fileURLToPath(new URL('../src/utils/pythonApi.js',import.meta.url))],bundle:true,platform:'node',format:'cjs',write:false,packages:'external',define:{'import.meta.env':'{}'}});
await writeFile(output,bundle.outputFiles[0].text);
const module=await import(pathToFileURL(output));
test('Python operations use the shared client and existing proxy paths',async()=>{
 const calls=[];
 const client=module.createPythonApi({post:async(path,body)=>{calls.push([path,body]);return {data:{optimized_places:[[]]}};}},'public-fixture');
 await client.generate({days:1});await client.optimize({places:[]});await client.nearby({places:[[]]});
 assert.deepEqual(calls,[['/py/generate',{days:1}],['/py/optimize',{places:[]}],['/py/nearby',{places:[[]]}]]);
});
test('photo references become browser-key URLs without mutating provider data',()=>{
 const source={optimized_places:[[{name:'meal',photo_reference:'ref + /'}]]};
 const output=module.normalizePythonPayload(source,'public-fixture');
 const url=new URL(output.optimized_places[0][0].photoUrl);
 assert.equal(url.searchParams.get('photoreference'),'ref + /');assert.equal(url.searchParams.get('key'),'public-fixture');
 assert.equal(source.optimized_places[0][0].photoUrl,undefined);
});
test.after(async()=>rm(dir,{recursive:true,force:true}));
