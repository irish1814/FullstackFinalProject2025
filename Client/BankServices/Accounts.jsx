import React, { useEffect, useState } from "react";
import { AccountsService } from "./service/accounts.service.jsx";
import '../css/index.css';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await AccountsService.getAccounts();
        setAccounts(data);
      } catch (e) {
        setErr(e.message || "Failed to load accounts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading accounts...</div>;
  if (err) return <div>Error: {err}</div>;

 return (
  <div className="content">
    <div className="container">
      <h1>Accounts</h1>

      {accounts.length === 0 ? (
        <div className="card mt-2">No accounts found.</div>
      ) : (
        <div className="grid cols-2 gap-2 mt-2">
          {accounts.map((acc) => (
            <div className="card" key={acc._id || acc.id}>
              <div className="flex justify-between items-center">
                <h3>#{acc.accountNumber}</h3>
                <span className="badge">{acc.accountType}</span>
              </div>
              <div className="mt-2">
                <strong>Balance:</strong> {acc.balance} {acc.currency}
              </div>
              <div className="mt-1">
                <strong>Status:</strong>{' '}
                <span className="badge badge--ok">{acc.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}
