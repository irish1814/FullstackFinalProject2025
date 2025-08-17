import React, { useEffect, useState } from "react";
import { AccountsService } from "./service/accounts.service.jsx";
import '../css/index.css';

export default function Dashboard() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const accounts = await AccountsService.getAccounts();
        setAccount(accounts[0] || null);
      } catch (e) {
        setErr(e.message || "Failed to load account");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (err) return <div>Error: {err}</div>;
  if (!account) return <div>No account to show.</div>;

 return (
  <div className="content">
    <div className="container">
      <div className="toolbar">
        <h1>Dashboard</h1>
        {/* מקום לכפתורים עתידיים */}
      </div>

      <section className="kpis">
        <div className="kpi">
          <div className="kpi__label">Account Number</div>
          <div className="kpi__value">{account.accountNumber}</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Balance</div>
          <div className="kpi__value">
            {account.balance} {account.currency}
          </div>
        </div>
      </section>

      <div className="grid-panels">
        <div className="card card--em">
          <h3>Account Summary</h3>
          <p className="mt-2">Type: {account.accountType}</p>
          <p>
            Status: <span className="badge badge--ok">{account.status || 'active'}</span>
          </p>
        </div>

        <div className="card">
          <h3>Shortcuts</h3>
          <div className="mt-2 flex gap-2">
            <button className="btn btn--primary">Transfer</button>
            <button className="btn">Deposit</button>
            <button className="btn btn--ghost">Loans</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
