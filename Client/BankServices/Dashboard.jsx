import React, { useEffect, useMemo, useState } from "react";
import { AccountsService } from '../BankServices/service/accounts.service.jsx'
import { TransactionsService } from '../BankServices/service/transactions.service.jsx'

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
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        const accountNumber = localStorage.getItem("accountNumber");
        const accRes = await AccountsService.getAccountById(accountNumber);
        const txRes = await TransactionsService.list(accountNumber);


        if (!alive) return;
        setAccounts(accRes?.data?.account ? [accRes.data.account] : []);
        setTransactions(txRes?.data?.transactions ?? []); 
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
  }, []);

  const primaryAccount = accounts[0] || null;

  const recentTx = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return sorted.slice(0, 5);
  }, [transactions]);

  if (loading) return <div>Loading...</div>;
  if (err) return <div>Error: {err}</div>;

  return (
    <div className="content">
      <div className="container">
        <div className="toolbar">
          <h1>Dashboard</h1>
        </div>

        <section className="kpis">
          {primaryAccount ? (
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

        {primaryAccount && (
          <div className="card card--em mt-2">
            <h3>Account Summary</h3>
            <div className="mt-2">
              <p>Type: {primaryAccount.accountType}</p>
              <p>
                Status:{" "}
                <span className="badge badge--ok">
                  {primaryAccount.status || "active"}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="card card--tilt mt-2">
          <h3>Recent Transactions</h3>
          {recentTx.length === 0 ? (
            <p className="text-muted mt-1">No transactions found.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="text-right">Amount</th>
                    <th>Currency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map((tx) => (
                    <tr key={tx._id || tx.id}>
                      <td>{tx.date ? new Date(tx.date).toLocaleString() : "-"}</td>
                      <td>{tx.description || tx.note || "-"}</td>
                      <td className="text-right">
                        <span
                          className={
                            Number(tx.amount) < 0
                              ? "amount-negative"
                              : "amount-positive"
                          }
                        >
                          {Number(tx.amount) < 0 ? "" : "+"}
                          {tx.amount}
                        </span>
                      </td>
                      <td>{tx.currency || primaryAccount.currency || "-"}</td>
                      <td>
                        <span className={`badge status-${(tx.status || "completed").toLowerCase()}`}>
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
