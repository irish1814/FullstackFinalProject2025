const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function http(path, { method = "GET", data, token, headers } = {}) {
  const authToken = token || localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const error = new Error(`Request failed with status ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}
