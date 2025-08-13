import React, { useEffect, useState } from "react";
import { AccountsService } from "../BankServices/accounts.service.jsx";
import { TransactionsService } from "../BankServices/transactions.service.jsx";

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
      if (accs[0]) setFromId(accs[0].id || accs[0]._id);
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
      // כרגע: דמו לוקאלי. כשיהיה שרת: נחליף ל TransactionsService.transfer אמיתי (POST).
      await TransactionsService.transfer({
        fromAccountId: fromId,
        toAccountNumber,
        amount: val,
        note: note || "Manual transfer"
      });
      setStatus("Transfer recorded (local demo).");
      setAmount("");
      setNote("");
      setToAccountNumber("");
    } catch (e) {
      setStatus(e.message || "Transfer failed");
    }
  };

  if (!accounts.length) return <div>Loading accounts...</div>;

  return (
    <div>
      <h1>Transfers</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label>From account:</label>
          <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
            {accounts.map(a => (
              <option key={a.id || a._id} value={a.id || a._id}>
                {a.accountNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>To account number:</label>
          <input value={toAccountNumber} onChange={(e) => setToAccountNumber(e.target.value)} />
        </div>

        <div>
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div>
          <label>Note:</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <button type="submit">Send</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
