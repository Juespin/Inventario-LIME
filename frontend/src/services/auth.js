import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function login(username, password) {
  const resp = await axios.post(`${API}/api/token/`, { username, password });
  localStorage.setItem('access_token', resp.data.access);
  localStorage.setItem('refresh_token', resp.data.refresh);
  // Guardar información del usuario si está disponible
  if (resp.data.user) {
    localStorage.setItem('user_data', JSON.stringify(resp.data.user));
  }
  axios.defaults.headers.common['Authorization'] = `Bearer ${resp.data.access}`;
  return resp.data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
  delete axios.defaults.headers.common['Authorization'];
}

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function getUserData() {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      return null;
    }
  }
  // Si no hay user_data, intentar decodificar el token
  const token = getAccessToken();
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      return {
        username: payload.username,
        role: payload.role,
        user_id: payload.user_id
      };
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function isAdmin() {
  const userData = getUserData();
  return userData?.role === 'admin';
}
