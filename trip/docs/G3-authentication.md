# G3 frontend

Linked backend: https://github.com/tjoeunProject/Backend/pull/56 . Based on G4 #73 to reuse test tooling and avoid conflicting lockfile edits. This PR contains only authentication/ID changes.

Shared authenticated client refreshes 401 once, shares concurrent refresh, preserves 403, rotates both stored credentials, clears failed sessions, and leaves a newer session intact. Route requests and general API now use this same factory. Hashids reads VITE_SALT and VITE_HASHIDS_MIN_LENGTH (default 8); values must match backend hashids.salt/min-length. Salt is public URL configuration, not an authorization secret.

TDD: existing client rejected valid 401 recovery; same concurrent request test now succeeds with exactly one refresh and two successful retries. Existing hashid config assertion failed 4 != 8 then passed unchanged. Node suite 16 tests, zero failures/skips; actual axios with fixture HTTP adapters, actual application modules bundled by esbuild. Full Vite production build passed after clean npm ci --ignore-scripts. Existing >500kB chunk warning remains.

Performance: two simultaneous expired-token requests cause exactly one refresh, two retries, and no retry loop. Baseline does not recover 401, so successful-recovery latency is not comparable (BLOCKED); network timing and actual browser storage races are unmeasured. No speedup claimed. Provider calls zero. Backend registration timing is recorded in Backend #56.

Requirements review traced both general client and route hook. Maintainability review removed duplicate refresh code and Hashids configuration. Oracle migration/backend deployment must precede enabling frontend 401 flow; real authenticated browser E2E remains a release check. No auto merge.
