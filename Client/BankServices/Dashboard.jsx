import React, { useEffect, useMemo, useState } from "react";
import "../css/index.css";

async function api(path, opts = {}) {
  const API_URL = import.meta.env.VITE_API_URL || "/api";
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || "Request failed");
  }
  return res.status === 204 ? null : res.json();
}

export default function Dashboard() {
  const role = localStorage.getItem("role"); 
  const isAdmin = role === "admin";

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        const accs = isAdmin
          ? await api("/accounts/all")
          : await api("/accounts/my"); 

       
        const txs = isAdmin
          ? await api("/transactions/all")
          : await api("/transactions/my");

        if (!alive) return;
        setAccounts(Array.isArray(accs) ? accs : []);
        setTransactions(Array.isArray(txs) ? txs : []);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Failed to load dashboard data");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isAdmin]);

  const primaryAccount = accounts[0] || null;

  const totals = useMemo(() => {
    const sum = (arr, k) => arr.reduce((s, x) => s + (Number(x[k]) || 0), 0);
    return {
      accountsCount: accounts.length,
      balanceTotal: sum(accounts, "balance"),
    };
  }, [accounts]);

  const recentTx = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return sorted.slice(0, isAdmin ? 10 : 5);
  }, [transactions, isAdmin]);

  if (loading) return <div>Loading...</div>;
  if (err) return <div>Error: {err}</div>;

  return (
    <div className="content">
      <div className="container">
        <div className="toolbar">
          <h1>Dashboard</h1>
        </div>

        <section className="kpis">
          {isAdmin ? (
            <>
              <div className="kpi">
                <div className="kpi__label">Total Accounts</div>
                <div className="kpi__value">{totals.accountsCount}</div>
              </div>
              <div className="kpi">
                <div className="kpi__label">Total Balance (all)</div>
                <div className="kpi__value">
                  {totals.balanceTotal.toLocaleString()} ₪
                </div>
              </div>
            </>
          ) : primaryAccount ? (
            <>
              <div className="kpi">
                <div className="kpi__label">Account Number</div>
                <div className="kpi__value">{primaryAccount.accountNumber}</div>
              </div>
              <div className="kpi">
                <div className="kpi__label">Balance</div>
                <div className="kpi__value">
                  {primaryAccount.balance} {primaryAccount.currency}
                </div>
              </div>
            </>
          ) : (
            <div className="card mt-2">No account to show.</div>
          )}
        </section>

        <div className="grid-panels">
          <div className="card card--em">
            <h3>{isAdmin ? "System Summary" : "Account Summary"}</h3>
            {isAdmin ? (
              <div className="mt-2">
                <p>
                  <strong>Accounts:</strong> {totals.accountsCount}
                </p>
                <p>
                  <strong>Total Balance:</strong>{" "}
                  {totals.balanceTotal.toLocaleString()} ₪
                </p>
                <p className="text-muted" style={{ fontSize: 13 }}>
                </p>
              </div>
            ) : primaryAccount ? (
              <div className="mt-2">
                <p>Type: {primaryAccount.accountType}</p>
                <p>
                  Status:{" "}
                  <span className="badge badge--ok">
                    {primaryAccount.status || "active"}
                  </span>
                </p>
              </div>
            ) : (
              <div className="mt-2">No account selected.</div>
            )}
          </div>

          <div className="card">
            <h3>Shortcuts</h3>
            <div className="mt-2 flex gap-2">
              <button className="btn btn--primary">Transfer</button>
              <button className="btn">Deposit</button>
              <button className="btn btn--ghost">Loans</button>
            </div>
            <p className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>
            </p>
          </div>
        </div>

        <div className="card card--tilt mt-2">
          <h3>{isAdmin ? "Recent Transactions (All)" : "Recent Transactions"}</h3>

          {recentTx.length === 0 ? (
            <p className="text-muted mt-1">No transactions found.</p>
          ) : (
            <div style={{ overflowX: "auto", marginTop: 8 }}>
              <table className="table">
                <thead>
                  <tr>
                    {isAdmin && <th>User</th>}
                    <th>Date</th>
                    <th>Description</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th>Currency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map((tx) => (
                    <tr key={tx._id || tx.id}>
                      {isAdmin && <td>{tx.userEmail || tx.userId || "-"}</td>}
                      <td>{tx.date ? new Date(tx.date).toLocaleString() : "-"}</td>
                      <td>{tx.description || tx.note || "-"}</td>
                      <td style={{ textAlign: "right" }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              Number(tx.amount) < 0 ? "#ff5d73" : "rgb(37, 211, 102)",
                          }}
                        >
                          {Number(tx.amount) < 0 ? "" : "+"}
                          {tx.amount}
                        </span>
                      </td>
                      <td>{tx.currency || (primaryAccount && primaryAccount.currency) || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            (tx.status || "").toLowerCase() === "completed"
                              ? "badge--ok"
                              : (tx.status || "").toLowerCase() === "pending"
                              ? "badge--warn"
                              : "badge--danger"
                          }`}
                        >
                          {tx.status || "completed"}
                        </span>
                      </td>
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
