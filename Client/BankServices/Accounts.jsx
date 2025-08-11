import React, { useEffect, useState } from "react";
import { AccountsService } from "../BankServices/accounts.service.jsx";

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
    <div>
      <h1>Accounts</h1>
      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <ul>
          {accounts.map((acc) => (
            <li key={acc._id || acc.id}>
              <p>Account Number: {acc.accountNumber}</p>
              <p>Balance: {acc.balance} {acc.currency}</p>
              <p>Type: {acc.accountType}</p>
              <p>Status: {acc.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
