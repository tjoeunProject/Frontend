import assert from 'node:assert/strict';
import test from 'node:test';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);
const axios=require('axios');
// Bundle only application source; retain the real shared axios package.
const temp=await mkdtemp(fileURLToPath(new URL('./.auth-',import.meta.url)));
const output=temp+'/client.cjs';
const bundle=await build({entryPoints:[fileURLToPath(new URL('../src/pages/Login/axiosConfig.js',import.meta.url))],bundle:true,platform:'node',format:'cjs',packages:'external',write:false});
await writeFile(output,bundle.outputFiles[0].text);
const exported=await import(pathToFileURL(output));
const api=exported.default.default ?? exported.default;
const values=new Map([['access_token','old'],['refresh_token','refresh']]);
globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
globalThis.window={location:{href:''}};
const response=(config,data={ok:true})=>({status:200,statusText:'OK',headers:{},config,data});
const fail=(config,status)=>Promise.reject(new axios.AxiosError('fixture',null,config,null,{status,config}));
test('concurrent 401 responses share one refresh and retry with rotated credentials',async()=>{
  let refreshes=0,attempts=0;
  axios.defaults.adapter=async config=>{
    assert.equal(config.url,'/sts/api/v1/auth/refresh-token');
    refreshes++;
    await new Promise(resolve=>setTimeout(resolve,5));
    return response(config,{access_token:'new',refresh_token:'new-refresh'});
  };
  api.defaults.adapter=async config=>{
    attempts++;
    return config.headers.Authorization==='Bearer new'?response(config):fail(config,401);
  };
  const result=await Promise.all([api.get('/sts/api/user/me'),api.get('/sts/api/user/me')]);
  assert.equal(result.length,2);assert.equal(refreshes,1);assert.equal(attempts,4);
  assert.equal(values.get('refresh_token'),'new-refresh');
});
test.after(async()=>{await rm(temp,{recursive:true,force:true});});

test('403 permission denial never refreshes or clears the session',async()=>{
  let calls=0;
  axios.defaults.adapter=()=>{calls++;throw new Error('must not refresh');};
  api.defaults.adapter=config=>fail(config,403);
  await assert.rejects(api.get('/sts/api/route/foreign'),e=>e.response.status===403);
  assert.equal(calls,0);assert.equal(values.get('access_token'),'new');
});

test('failed refresh clears stored credentials and does not retry the API',async()=>{
  let attempts=0;
  values.set('user','fixture');
  axios.defaults.adapter=config=>fail(config,401);
  api.defaults.adapter=config=>{attempts++;return fail(config,401);};
  await assert.rejects(api.get('/sts/api/user/me'));
  assert.equal(attempts,1);assert.equal(values.size,0);
  assert.equal(window.location.href,'/login1');
});

test('one retry maximum even when the refreshed credential is rejected',async()=>{
  values.set('access_token','old');values.set('refresh_token','refresh');
  let refreshes=0,attempts=0;
  axios.defaults.adapter=config=>{refreshes++;return Promise.resolve(response(config,{access_token:'new',refresh_token:'new-refresh'}));};
  api.defaults.adapter=config=>{attempts++;return fail(config,401);};
  await assert.rejects(api.get('/sts/api/user/me'));
  assert.equal(refreshes,1);assert.equal(attempts,2);
});

test('network failure without a request config remains the original error',async()=>{
  const failure=new Error('offline');
  api.defaults.adapter=()=>Promise.reject(failure);
  await assert.rejects(api.get('/sts/api/user/me'),error=>error===failure);
});
