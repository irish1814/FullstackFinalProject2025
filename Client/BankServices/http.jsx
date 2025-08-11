const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function http(path, { method = 'GET', data, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: data ? JSON.stringify(data) : undefined
  });

  let payload = null;
  try { payload = await res.json(); } catch (_) {}

  if (!res.ok) {
    const msg = (payload && (payload.message || payload.error)) || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return payload;
}
