# G3 frontend final verification

Linked Backend #56 handles token purpose/rotation/revocation; Backend #58 validates Python requests against the live Spring session. Both map and survey generation now use the shared authenticated client, including optimize/nearby. Python photo_reference values become browser-key URLs without mutating response fixtures or exposing a server key. Existing 401 single-flight refresh,403 preservation, retry cap, session cleanup and shared Vite Hashids config remain.

`node --test tests/*.test.mjs`:18 tests pass, fail/skip0. Production Vite build passed, existing >500kB warning remains. Tests include real axios with external HTTP fixtures and actual module bundling; Python route/body contracts and photo reference encoding checked. No actual Google/browser E2E. Adapter latency before working auth support is incomparable, not an improvement claim. Python execution guard timing is in Backend #58; local real Spring/Python credential integration passed.

VITE_SALT and VITE_HASHIDS_MIN_LENGTH (default8) must match Spring. VITE_GOOGLE_MAPS_API_KEY is the existing public browser key. Configure /py proxy to forward Authorization and Python BACKEND_AUTH_URL to actual profile endpoint. Deploy with backend token schema migration and re-login plan. No merge/deploy.
