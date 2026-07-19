// URL del backend.
// - En local: usa VITE_API_URL del .env (ej. http://localhost:4000), porque el frontend
//   (Vite, puerto 5173) y el backend (puerto 4000) corren en puertos distintos.
// - En deploy MONOLITO (un solo servicio de Render sirviendo todo): no definas VITE_API_URL,
//   así queda '' y las peticiones van al mismo origen (ej. /api/auth/login).
// - En deploy SEPARADO (frontend en Vercel, backend en Render): define VITE_API_URL
//   con la URL pública del backend de Render.
const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Ocurrió un error inesperado.');
  }

  return data;
}

export function registerUser({ dni, password, name }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ dni, password, name }),
  });
}

export function loginUser({ dni, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ dni, password }),
  });
}

export function updateProfile(token, { name }) {
  return request('/api/auth/me', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });
}

export function createReport(token, { routeCode, incidentType, details }) {
  return request('/api/reports', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ routeCode, incidentType, details }),
  });
}

export function getMyReports(token) {
  return request('/api/reports/mine', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
