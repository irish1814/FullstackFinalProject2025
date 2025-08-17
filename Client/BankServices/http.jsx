const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function http(path, { method = "GET", data, token, headers } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  let body = null;
  try { body = await res.json(); } catch (_) {}

  if (!res.ok) {
    const msg = body?.message || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return body?.data ?? body;
}

export { API_URL };
