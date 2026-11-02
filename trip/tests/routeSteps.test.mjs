import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';

const directory = await mkdtemp(join(tmpdir(), 'routepick-steps-'));
const output = join(directory, 'client.cjs');
const bundle = await build({entryPoints:[fileURLToPath(new URL('../src/utils/computeRouteSteps.js',import.meta.url))],
  bundle:true,platform:'node',format:'cjs',write:false});
await writeFile(output,bundle.outputFiles[0].text);
const client = await import(pathToFileURL(output));

test('exports the backend steps client used by the map component', () => {
  assert.equal(typeof client.computeRouteStepsViaBackend,'function');
});

test('uses the authenticated backend proxy contract and decodes E5 steps', async () => {
  const calls=[];
  const fixture={routes:[{distanceMeters:120,duration:'60s',legs:[{steps:[{
    polyline:{encodedPolyline:'_p~iF~ps|U'},navigationInstruction:{instructions:'walk'},
  }]}]}]};
  const getSteps=client.createRouteStepsClient(async (url,body)=>{calls.push({url,body});return {data:fixture};});
  const origin={lat:0,lng:0},destination={lat:38.5,lng:-120.2};
  assert.deepEqual(await getSteps({origin,destination}),{
    distanceMeters:120,duration:'60s',steps:[{path:[{lat:38.5,lng:-120.2}],instructions:'walk'}],
  });
  assert.deepEqual(calls,[{url:'/sts/api/maps/route-steps',body:{origin,destination,travelMode:'WALK',languageCode:'ko-KR'}}]);
});

test('an empty provider result remains an empty steps response', async () => {
  const getSteps=client.createRouteStepsClient(async ()=>({data:{routes:[]}}));
  assert.deepEqual(await getSteps({origin:{lat:1,lng:1},destination:{lat:2,lng:2}}),{distanceMeters:null,duration:null,steps:[]});
});

test('HTTP failure is surfaced rather than accepted as a usable route', async () => {
  const failure=new Error('provider unavailable');
  const getSteps=client.createRouteStepsClient(async ()=>{throw failure;});
  await assert.rejects(getSteps({origin:{lat:1,lng:1},destination:{lat:2,lng:2}}),failure);
});

test.after(async () => { await rm(directory,{recursive:true,force:true}); });
