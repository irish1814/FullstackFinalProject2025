import React, { useEffect, useState } from "react";
import { AccountsService } from "../BankServices/accounts.service.jsx";
import { TransactionsService } from "../BankServices/transactions.service.jsx";

export default function Transactions() {
  const [account, setAccount] = useState(null);
  const [items, setItems] = useState([]);
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const accounts = await AccountsService.getAccounts();
        const acc = accounts[0] || null;
        setAccount(acc);
        if (acc) {
          const list = await TransactionsService.list({ accountId: acc.id || acc._id });
          setItems(list);
        }
      } catch (e) {
        setErr(e.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = items.filter(tx => (type === "all" ? true : tx.type === type));

  if (loading) return <div>Loading transactions...</div>;
  if (err) return <div>Error: {err}</div>;
  if (!account) return <div>No account found.</div>;

  return (
    <div>
      <h1>Transactions</h1>

      <div>
        <label>Filter:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All</option>
          <option value="deposit">deposit</option>
          <option value="withdraw">withdraw</option>
          <option value="transfer">transfer</option>
          <option value="loan_repayment">loan_repayment</option>
        </select>
      </div>

      <ul>
        {filtered.map(tx => (
          <li key={tx.id}>
            <span>{tx.date} – {tx.type} – {tx.amount} – {tx.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
