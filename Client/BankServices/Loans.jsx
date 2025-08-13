import React, { useEffect, useState } from "react";
import { LoansService } from "../BankServices/loans.service.jsx";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [repayId, setRepayId] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [status, setStatus] = useState("");

  const reload = async () => {
    const list = await LoansService.list();
    setLoans(list);
  };

  useEffect(() => {
    reload();
  }, []);

  const onRequest = async (e) => {
    e.preventDefault();
    setStatus("");
    const val = Number(amount);
    const months = Number(term);
    if (!val || val <= 0 || !months || months <= 0) {
      setStatus("Please enter valid amount and term.");
      return;
    }
    await LoansService.request({ amount: val, termMonths: months });
    setAmount(""); setTerm("");
    setStatus("Loan requested (local demo).");
    reload();
  };

  const onRepay = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!repayId) { setStatus("Choose a loan."); return; }
    const val = Number(repayAmount);
    if (!val || val <= 0) { setStatus("Invalid repayment amount."); return; }
    await LoansService.repay({ loanId: repayId, amount: val });
    setRepayAmount("");
    setStatus("Repayment recorded (local demo).");
    reload();
  };

  return (
    <div>
      <h1>Loans</h1>

      <section>
        <h3>Active / History</h3>
        <ul>
          {loans.map(l => (
            <li key={l.id}>
              <span>
                #{l.id} – principal: {l.principal}, remaining: {l.remaining}, term: {l.termMonths}m, status: {l.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Request new loan</h3>
        <form onSubmit={onRequest}>
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input type="number" placeholder="Term (months)" value={term} onChange={(e) => setTerm(e.target.value)} />
          <button type="submit">Request</button>
        </form>
      </section>

      <section>
        <h3>Repay loan</h3>
        <form onSubmit={onRepay}>
          <select value={repayId} onChange={(e) => setRepayId(e.target.value)}>
            <option value="">Choose loan</option>
            {loans.map(l => <option key={l.id} value={l.id}>#{l.id} remaining {l.remaining}</option>)}
          </select>
          <input type="number" placeholder="Repay amount" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} />
          <button type="submit">Repay</button>
        </form>
      </section>

      {status && <p>{status}</p>}
    </div>
  );
}
