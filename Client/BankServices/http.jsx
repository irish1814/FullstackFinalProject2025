const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function http(path, { method="GET", data, token, headers } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    ...(data ? { body: JSON.stringify(data) } : {})
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, ...json };
  return json;
}
