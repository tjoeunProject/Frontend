import axios from 'axios';

// All API clients share a single refresh flight for the current browser session.
let refreshFlight = null;
const usable = value => typeof value === 'string' && value.length > 0 && value !== 'null' && value !== 'undefined';
const clearSession = () => {
  for (const key of ['access_token', 'refresh_token', 'user']) localStorage.removeItem(key);
};

export function createAuthenticatedClient(options = {}) {
  const client = axios.create({ ...options, withCredentials: true,
    headers: { 'Content-Type': 'application/json', ...options.headers } });
  client.interceptors.request.use(config => {
    const access = localStorage.getItem('access_token');
    if (usable(access)) config.headers.Authorization = `Bearer ${access}`;
    return config;
  });
  client.interceptors.response.use(response => response, async error => {
    const original = error.config;
    if (!original || error.response?.status !== 401 || original._retry || /\/auth\//.test(original.url ?? '')) throw error;
    original._retry = true;
    const refreshAtFailure = localStorage.getItem('refresh_token');
    try {
      const current = localStorage.getItem('access_token');
      // A delayed response may belong to the credential preceding a completed refresh.
      if (!usable(current) || original.headers.Authorization === `Bearer ${current}`) {
        if (!refreshFlight) {
          const refresh = localStorage.getItem('refresh_token');
          if (!usable(refresh)) throw new Error('Session expired');
          refreshFlight = axios.post('/sts/api/v1/auth/refresh-token', {}, {
            headers: { Authorization: `Bearer ${refresh}` },
          }).then(({ data }) => {
            if (!usable(data?.access_token) || !usable(data?.refresh_token)) throw new Error('Invalid session response');
            // Do not restore a session that was cleared or replaced during the request.
            if (localStorage.getItem('refresh_token') !== refresh) throw new Error('Session changed');
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
          }).finally(() => { refreshFlight = null; });
        }
        await refreshFlight;
      }
      original.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
      return client(original);
    } catch (failure) {
      if (localStorage.getItem('refresh_token') === refreshAtFailure) {
        clearSession();
        window.location.href = '/login1';
      }
      throw failure;
    }
  });
  return client;
}
