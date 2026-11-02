// Usage: node benchmarks/polylineDecode.mjs /absolute/path/to/baseline/polylineDecode.js
// Keep the baseline inside an ES-module package (the project has type=module).
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { decodePolyline as candidate } from '../src/utils/polylineDecode.js';

assert.ok(process.argv[2], 'Supply the unmodified baseline file');
const baselinePath = resolve(process.argv[2]);
const { decodePolyline: baseline } = await import(pathToFileURL(baselinePath));
const fixture = '??'.repeat(1000);
// Both versions are correct for zero coordinates, so this is a shared-contract
// overhead measurement. Nonzero E5 correctness is covered by the regression tests.
const expected = Array.from({ length: 1000 }, () => ({ lat: 0, lng: 0 }));
assert.deepEqual(baseline(fixture), expected);
assert.deepEqual(candidate(fixture), expected);
const samples = { baseline: [], candidate: [] };
const functions = { baseline, candidate };
const warmups = 3;
const repeats = 15;
const iterations = 1000;
// Predeclared allowed median overhead: 25% plus 2ms for timer/runtime variability.
const maximumRelativeOverhead = 0.25;
const maximumAbsoluteOverheadMs = 2;
let checksum = 0;
for (let round = 0; round < warmups + repeats; round += 1) {
  const order = round % 2 ? ['candidate', 'baseline'] : ['baseline', 'candidate'];
  for (const label of order) {
    const start = performance.now();
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      const result = functions[label](fixture);
      checksum += result.length;
    }
    const duration = performance.now() - start;
    if (round >= warmups) samples[label].push(duration);
  }
}
assert.equal(checksum, (warmups + repeats) * 2 * iterations * 1000);
assert.deepEqual(candidate(fixture), expected);
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const before = median(samples.baseline);
const after = median(samples.candidate);
const budgetPassed = after <= before * (1 + maximumRelativeOverhead) + maximumAbsoluteOverheadMs;
const report = {
  metric: 'decoder loop wall time in ms', node: process.version, platform: process.platform,
  scenario: '1000 zero-delta points decoded 1000 times per batch sample',
  concurrency: 1, externalCalls: 0, warmups, repeats, iterations,
  order: 'alternating AB/BA in one process', samples, medianMs: { baseline: before, candidate: after },
  baselineSha256: createHash('sha256').update(readFileSync(baselinePath)).digest('hex'),
  candidateSha256: createHash('sha256').update(readFileSync(new URL('../src/utils/polylineDecode.js', import.meta.url))).digest('hex'),
  fixtureSha256: createHash('sha256').update(fixture).digest('hex'),
  maximumRelativeOverhead, maximumAbsoluteOverheadMs, budgetPassed,
  limitation: 'Shared zero-coordinate contract; not production rendering latency or a speedup claim. Timings include allocations and GC.',
};
console.log(JSON.stringify(report, null, 2));
assert.ok(budgetPassed, 'decoder exceeded the predeclared overhead budget');
