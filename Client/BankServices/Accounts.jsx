import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import "../css/index.css";

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

export default function Accounts() {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [qUser, setQUser] = useState("");
  const [qAcc, setQAcc] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAccs, setLoadingAccs] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingUsers(true);
        const data = await api("/users");
        if (alive) setUsers(data);
      } catch (e) {
        setErr(e.message || "Failed to load users");
      } finally {
        if (alive) setLoadingUsers(false);
      }
    })();

    (async () => {
      try {
        setLoadingAccs(true);
        const data = await api("/accounts");
        if (alive) setAccounts(data);
      } catch (e) {
        setErr(prev => prev || e.message || "Failed to load accounts");
      } finally {
        if (alive) setLoadingAccs(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  const usersFiltered = useMemo(() => {
    const s = qUser.trim().toLowerCase();
    if (!s) return users;
    return users.filter(u =>
      (u.name || "").toLowerCase().includes(s) ||
      (u.email || "").toLowerCase().includes(s) ||
      (u.role || "").toLowerCase().includes(s)
    );
  }, [qUser, users]);

  const accountsFiltered = useMemo(() => {
    const s = qAcc.trim().toLowerCase();
    if (!s) return accounts;
    return accounts.filter(a =>
      (a.accountNumber || "").toString().toLowerCase().includes(s) ||
      (a.accountType || "").toLowerCase().includes(s) ||
      (a.currency || "").toLowerCase().includes(s) ||
      (a.status || "").toLowerCase().includes(s) ||
      (a.userEmail || "").toLowerCase().includes(s) ||
      (a.userId || "").toLowerCase().includes(s)
    );
  }, [qAcc, accounts]);

  async function deleteUser(userId) {
    if (!confirm("Delete this user and all their accounts?")) return;
    try {
      await api(`/users/${userId}`, { method: "DELETE" });
      setUsers(prev => prev.filter(u => u._id !== userId));
      setAccounts(prev => prev.filter(a => a.userId !== userId));
    } catch (e) {
      alert("Delete user failed: " + e.message);
    }
  }

  async function deleteAccount(accId) {
    if (!confirm("Delete this account permanently?")) return;
    try {
      await api(`/accounts/${accId}`, { method: "DELETE" });
      setAccounts(prev => prev.filter(a => (a._id || a.id) !== accId));
    } catch (e) {
      alert("Delete account failed: " + e.message);
    }
  }

  async function setAccountStatus(accId, status) {
    try {
      await api(`/accounts/${accId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }) 
      });
      setAccounts(prev =>
        prev.map(a =>
          (a._id || a.id) === accId ? { ...a, status } : a
        )
      );
    } catch (e) {
      alert(`Set status failed: ${e.message}`);
    }
  }

  const StatusBadge = ({ status }) => {
    const s = (status || "").toLowerCase();
    const tone =
      s === "active" ? "badge--ok" :
      s === "frozen" ? "badge--warn" :
      s === "closed" ? "badge--danger" : "";
    return <span className={`badge ${tone}`}>{status}</span>;
  };

  const ActionButtons = ({ acc }) => {
    const id = acc._id || acc.id;
    const s = (acc.status || "").toLowerCase();
    return (
      <div className="flex items-center gap-1">
        {s !== "frozen" && s !== "closed" && (
          <button className="btn" onClick={() => setAccountStatus(id, "frozen")}>Freeze</button>
        )}
        {s !== "closed" && (
          <button className="btn btn--ghost" onClick={() => setAccountStatus(id, "closed")}>Close</button>
        )}
        <button className="btn btn--danger" onClick={() => deleteAccount(id)}>Delete</button>
      </div>
    );
  };

  if (err) return <div className="container"><div className="card mt-2">Error: {err}</div></div>;

  return (
    <div className="content">
      <div className="container">
        <h1>Admin • Accounts & Users</h1>

        <div className="toolbar mt-2">
          <h2>Users</h2>
          <input
            className="input"
            placeholder="Search name/email/role…"
            value={qUser}
            onChange={e => setQUser(e.target.value)}
            style={{ width: 260 }}
          />
        </div>

        <div className="card card--tilt mt-1">
          {loadingUsers ? (
            <div className="skeleton" style={{ height: 12 }} />
          ) : usersFiltered.length === 0 ? (
            <div>No users found.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Created</th><th style={{width:1}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersFiltered.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role === "admin" ? "badge--warn" : "badge--ok"}`}>{u.role}</span></td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                      <td>
                        <button className="btn btn--danger" onClick={() => deleteUser(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="toolbar mt-3">
          <h2>Accounts</h2>
          <input
            className="input"
            placeholder="Search acc # / type / currency / status / user…"
            value={qAcc}
            onChange={e => setQAcc(e.target.value)}
            style={{ width: 360 }}
          />
        </div>

        <div className="card card--tilt mt-1">
          {loadingAccs ? (
            <div className="skeleton" style={{ height: 12 }} />
          ) : accountsFiltered.length === 0 ? (
            <div>No accounts found.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Currency</th>
                    <th>Status</th>
                    <th>User</th>
                    <th style={{width:1}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accountsFiltered.map(acc => (
                    <tr key={acc._id || acc.id}>
                      <td>{acc.accountNumber}</td>
                      <td>{acc.accountType}</td>
                      <td>{acc.balance}</td>
                      <td>{acc.currency}</td>
                      <td><StatusBadge status={acc.status} /></td>
                      <td>{acc.userEmail || acc.userId || "-"}</td>
                      <td><ActionButtons acc={acc} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
