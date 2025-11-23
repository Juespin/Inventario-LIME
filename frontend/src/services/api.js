import axios from 'axios';
import { getAccessToken, getRefreshToken } from './auth';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(async (config) => {
  let token = getAccessToken();
  if (token) {
    try {
      // decode JWT payload without external dependency
      const decodeJwt = (t) => {
        try {
          const base64Url = t.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          return JSON.parse(jsonPayload);
        } catch (e) {
          return null;
        }
      };

      const payload = decodeJwt(token);
      const exp = payload?.exp;
      const willExpire = exp ? (exp * 1000 - Date.now() < 60 * 1000) : false; // expiring within 60s
      if (willExpire) {
        const refresh = getRefreshToken();
        const r = await axios.post(`${API}/api/token/refresh/`, { refresh });
        token = r.data.access;
        localStorage.setItem('access_token', token);
      }
    } catch (err) {
      // refreshing failed, remove tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      token = null;
    }
  }
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export default client;
