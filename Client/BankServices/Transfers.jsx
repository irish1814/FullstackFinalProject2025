import React, { useEffect, useState } from "react";
import { TransactionsService } from "./service/transactions.service";
import '../css/index.css'

export default function Transfers() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [status, setStatus] = useState("");

  const accountNumber = localStorage.getItem("accountNumber");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await TransactionsService.list(accountNumber);
        setTransactions(res.data || []);
      } catch (err) {
        setStatus("❌ Failed to load transactions");
      }
    };
    load();
  }, [accountNumber]);

  const onTransfer = async (e) => {
    e.preventDefault();
    try {
      await TransactionsService.create({
        accountNumberSender: accountNumber,
        accountNumberReceiver: receiver,
        transactionAmount: Number(amount),
        typeOfTransaction: "transfer",
        description: "User transfer",
      });
      setStatus("✅ Transfer successful");
      setAmount("");
      setReceiver("");

      const res = await TransactionsService.list(accountNumber);
      setTransactions(res.data || []);
    } catch (err) {
      setStatus(err.message || "❌ Transfer failed");
    }
  };

  return (
    <div className="content">
      <div className="toolbar">
        <h1>Transfers</h1>
      </div>

      <div className="card card--em" style={{ marginBottom: "24px" }}>
        <form className="list" onSubmit={onTransfer}>
          <input
            className="input"
            type="text"
            placeholder="Receiver account number"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn btn--primary" type="submit">
            Transfer
          </button>
        </form>
        {status && <p className="badge badge--ok" style={{ marginTop: "12px" }}>{status}</p>}
      </div>

      <div className="card">
        <div className="toolbar">
          <h2>My Transactions</h2>
        </div>

        {transactions.length === 0 ? (
          <p className="badge badge--warn">No transactions yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Receiver</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td>{t.accountNumberReceiver}</td>
                  <td>{t.transactionAmount}</td>
                  <td>
                    <span className="badge">
                      {t.typeOfTransaction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
