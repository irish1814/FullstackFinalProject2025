import React, { useEffect, useState } from "react";
import { AccountsService } from "./service/accounts.service"
import '../css/index.css';

export default function Transfers() {
  const [accounts, setAccounts] = useState([]);
  const [fromId, setFromId] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const accs = await AccountsService.getAccounts();
      setAccounts(accs);
      if (accs[0]) setFromId(accs[0].accountNumber);
    })();
  }, []);

  const onSubmit = async (e) => {
  e.preventDefault();
  setStatus("");
  const val = Number(amount);
  if (!fromId || !toAccountNumber || !val || val <= 0) {
    setStatus("Please fill all fields correctly.");
    return;
  }

  try {
    await TransactionsService.transfer({
      accountNumberSender: fromId,           
      accountNumberReceiver: toAccountNumber,
      typeOfTransaction: "transfer",         
      description: note || "Manual transfer",
      transactionAmount: val
    });

    setStatus("Transfer recorded successfully.");
    setAmount("");
    setNote("");
    setToAccountNumber("");
  } catch (e) {
    setStatus(e.message || "Transfer failed");
  }
};


  if (!accounts.length) return <div>Loading accounts...</div>;

  return (
  <div className="content">
    <div className="container">
      <h1>Transfers</h1>

      <form className="form form--card mt-2" onSubmit={onSubmit}>
        <div className="form__row">
          <label className="form__label">From account</label>
          <select className="select" value={fromId} onChange={(e) => setFromId(e.target.value)}>
            {accounts.map((a) => (
              <option key={a.id || a._id} value={a.id || a._id}>
                {a.accountNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="form__row">
          <label className="form__label">To account number</label>
          <input className="input" value={toAccountNumber} onChange={(e) => setToAccountNumber(e.target.value)} />
        </div>

        <div className="form__row">
          <label className="form__label">Amount</label>
          <input className="input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div className="form__row">
          <label className="form__label">Note</label>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="form__actions">
          <button className="btn" type="button">Cancel</button>
          <button className="btn btn--primary" type="submit">Send</button>
        </div>

        {status && <p className="form__hint mt-1">{status}</p>}
      </form>
    </div>
  </div>
);

}