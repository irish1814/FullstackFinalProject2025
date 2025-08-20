import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AccountsService } from "../BankServices/service/accounts.service.jsx";
import { UsersService } from "../BankServices/service/users.service.jsx";
import { MessagesService } from "../BankServices/service/messages.service.jsx"; // import messages service

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AdminPage() {
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]); // state for messages
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true); // separate loading for messages

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [userRes, accRes] = await Promise.all([
          UsersService.getUsers(),
          AccountsService.getAccounts(),
        ]);

        if (alive) {
          setUsers(userRes.data.users || []);
          setAccounts(accRes.data || []);
        }
      } catch (e) {
        alert("Failed to load data: " + e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingMessages(true);
        const res = await MessagesService.getMessages(); // fetch all messages
        if (alive) setMessages(res.data.messages || []);
      } catch (e) {
        alert("Failed to load messages: " + e.message);
      } finally {
        if (alive) setLoadingMessages(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Attach accounts to users for rendering
  const usersWithAccounts = useMemo(() => {
    return users.map((u) => ({
      ...u,
      accounts: accounts.filter((a) => a.userId === u._id),
    }));
  }, [users, accounts]);

  // Search filter
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return usersWithAccounts;
    return usersWithAccounts.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(s) ||
        (u.email || "").toLowerCase().includes(s) ||
        (u.role || "").toLowerCase().includes(s) ||
        (u.accounts || []).some(
          (a) =>
            (a.accountNumber || "").toLowerCase().includes(s) ||
            (a.status || "").toLowerCase().includes(s)
        )
    );
  }, [q, usersWithAccounts]);

  async function onDelete(userId) {
    if (!confirm("Delete this user and all their accounts?")) return;
    try {
      await UsersService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setAccounts((prev) => prev.filter((a) => a.userId !== userId));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  }

  async function onSetAccountStatus(accNumber, status) {
    try {
      await AccountsService.toggleAccountStatus(accNumber, status);
      setAccounts((prev) =>
        prev.map((a) => (a.accountNumber === accNumber ? { ...a, status } : a))
      );
    } catch (e) {
      alert("Failed to update account status: " + e.message);
    }
  }

  return (
    <AdminRoute>
      <div className="container" style={{ marginTop: 16 }}>
        {/* USERS & ACCOUNTS TABLE */}
        <div className="toolbar">
          <h2>Admin • Users & Accounts</h2>
          <div className="flex items-center gap-2">
            <input
              className="input"
              placeholder="Search name/email/role/account…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: 240 }}
            />
            <button className="btn" onClick={() => nav("/dashboard")}>
              Back
            </button>
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Accounts</th>
                    <th>Created</th>
                    <th style={{ width: 1 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === "admin" ? "badge--warn" : "badge--ok"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.accounts && u.accounts.length > 0 ? (
                          <ul className="list-disc ml-4">
                            {u.accounts.map((acc) => (
                              <li
                                key={acc._id || acc.accountNumber}
                                className="flex items-center gap-2"
                              >
                                <strong>{acc.accountNumber}</strong> — {acc.status}
                                <div className="flex gap-1 ml-2">
                                  {acc.status !== "frozen" &&
                                    acc.status !== "closed" && (
                                      <button
                                        className="btn btn--ghost"
                                        onClick={() =>
                                          onSetAccountStatus(
                                            acc.accountNumber,
                                            "frozen"
                                          )
                                        }
                                        title="Freeze"
                                      >
                                        Freeze
                                      </button>
                                    )}
                                  {acc.status !== "closed" && (
                                    <button
                                      className="btn btn--ghost"
                                      onClick={() =>
                                        onSetAccountStatus(
                                          acc.accountNumber,
                                          "closed"
                                        )
                                      }
                                      title="Close"
                                    >
                                      Close
                                    </button>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted">No accounts</span>
                        )}
                      </td>
                      <td>{new Date(u.createdAt).toLocaleString()}</td>
                      <td className="flex items-center gap-1">
                        <button
                          className="btn btn--ghost"
                          onClick={() => nav(`/profile/${u._id}`)}
                          title="View"
                        >
                          View
                        </button>
                        <button
                          className="btn btn--danger"
                          onClick={() => onDelete(u._id)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-muted">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MESSAGES TABLE */}
        <div className="mt-6">
          <h2>All Messages</h2>
          <div className="card card--tilt">
            {loadingMessages ? (
              <div className="skeleton" style={{ height: 12 }} />
            ) : messages.length === 0 ? (
              <div className="text-muted p-2">No messages found</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((m) => (
                      <tr key={m._id}>
                        <td>{m.userId}</td>
                        <td>{m.email}</td>
                        <td>{m.subject}</td>
                        <td>{m.content}</td>
                        <td>{new Date(m.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 text-muted" style={{ fontSize: 12 }}>
          Notes: This page calls <code>/users/all</code>, <code>/accounts/all</code> and <code>/messages/all</code> (admin-only). Requires a valid Bearer token of an admin user.
        </div>
      </div>
    </AdminRoute>
  );
}
