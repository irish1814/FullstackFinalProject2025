import React, { useEffect, useState } from "react";
import { AccountsService } from "../BankServices/accounts.service.jsx";

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
    <div>
      <h1>Dashboard</h1>
      <section>
        <h3>Account Summary</h3>
        <p>Account Number: {account.accountNumber}</p>
        <p>Balance: {account.balance} {account.currency}</p>
      </section>
    </div>
  );
}
