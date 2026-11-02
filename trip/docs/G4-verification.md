# G4: route steps and E5 coordinates

The map component's missing computeRouteStepsViaBackend export now calls the existing Spring /api/maps/route-steps contract through the shared authenticated client and decodes E5 coordinates. One request per invocation; no browser Google secret added.

TDD: baseline export assertion failed (undefined instead of function); the same test now passes. `node --test tests/polylineDecode.test.mjs tests/routeSteps.test.mjs`: 10 passed, zero failures/skips. `node node_modules/vite/bin/vite.js build`: passed on Windows / Node 24.13.0, Vite 7.2.6. Existing 500 kB bundle warning remains.

Performance: existing E5 benchmark raw evidence remains in polyline-performance-20261030.json. The new backend adapter has no working baseline export, so comparative adapter latency is BLOCKED; fixture asserts exactly one HTTP request. No speedup claimed. Production network/Google API latency and authenticated browser map rendering remain unverified. No paid provider calls were made.

Review: requirements checked against the actual map import and Spring controller; maintainability checked separately for shared client reuse and unchanged direct-client export. This PR is independent of backend G1/G2. G3 authentication changes will be a separate dependent frontend PR.
