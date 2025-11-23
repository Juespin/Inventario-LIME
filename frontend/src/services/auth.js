import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function login(username, password) {
  const resp = await axios.post(`${API}/api/token/`, { username, password });
  localStorage.setItem('access_token', resp.data.access);
  localStorage.setItem('refresh_token', resp.data.refresh);
  axios.defaults.headers.common['Authorization'] = `Bearer ${resp.data.access}`;
  return resp.data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete axios.defaults.headers.common['Authorization'];
}

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}
