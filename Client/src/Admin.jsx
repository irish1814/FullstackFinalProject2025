import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

async function api(path, opts = {}) {
  const API_URL = import.meta.env.VITE_API_URL || "/api";
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {})
  };
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || "Request failed");
  }
  return res.status === 204 ? null : res.json();
}

export default function AdminPage() {
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");         // חיפוש
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api("/users/all"); // :contentReference[oaicite:4]{index=4}
        console.log(data)
        if (alive) setUsers(data.data.users);
      } catch (e) {
        alert("Failed to load users: " + e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // סינון מקומי
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter(u =>
      (u.name || "").toLowerCase().includes(s) ||
      (u.email || "").toLowerCase().includes(s) ||
      (u.role || "").toLowerCase().includes(s)
    );
  }, [q, users]);

  async function onDelete(userId) {
    if (!confirm("Delete this user and all their accounts?")) return;
    try {
      await api(`/users/${userId}`, { method: "DELETE" }); // מוחק גם חשבונות משויכים :contentReference[oaicite:5]{index=5}
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  }

  return (
    <AdminRoute>
      <div className="container" style={{ marginTop: 16 }}>
        <div className="toolbar">
          <h2>Admin • Users</h2>
          <div className="flex items-center gap-2">
            <input className="input" placeholder="Search name/email/role…" value={q} onChange={e => setQ(e.target.value)} style={{width: 240}} />
            <button className="btn" onClick={() => nav("/dashboard")}>Back</button>
          </div>
        </div>

        <div className="card card--tilt">
          {loading ? (
            <div className="skeleton" style={{ height: 12 }} />
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Created</th><th style={{width: 1}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === "admin" ? "badge--warn" : "badge--ok"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleString()}</td>
                      <td className="flex items-center gap-1">
                        <button
                          className="btn btn--ghost"
                          onClick={() => nav(`/profile/${u._id}`)}
                          title="View"
                        >View</button>
                        <button
                          className="btn btn--danger"
                          onClick={() => onDelete(u._id)}
                          title="Delete"
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="text-muted">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-2 text-muted" style={{fontSize:12}}>
          Notes: This page calls <code>/users/all</code> (admin-only) and <code>/users/:id</code> DELETE.  
          Requires a valid Bearer token of an admin user. {/* :contentReference[oaicite:6]{index=6} :contentReference[oaicite:7]{index=7} */}
        </div>
      </div>
    </AdminRoute>
  );
}
