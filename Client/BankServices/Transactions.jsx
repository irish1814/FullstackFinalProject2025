import React, { useEffect, useState } from "react";
import { AccountsService } from "./service/accounts.service";
import { TransactionsService } from "./service/transactions.service.jsx";
import '../css/index.css';

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
  <div className="content">
    <div className="container">
      <div className="toolbar">
        <h1>Transactions</h1>
        <div className="flex gap-2 items-center">
          <label className="form__label">Filter</label>
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All</option>
            <option value="deposit">deposit</option>
            <option value="withdraw">withdraw</option>
            <option value="transfer">transfer</option>
            <option value="loan_repayment">loan_repayment</option>
          </select>
        </div>
      </div>

      <div className="card mt-2">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.type}</td>
                <td>{tx.amount}</td>
                <td>{tx.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

}
