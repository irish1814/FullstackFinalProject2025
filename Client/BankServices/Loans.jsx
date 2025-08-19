import React, { useEffect, useState } from "react";
import { AccountsService } from "./service/accounts.service";
import { TransactionsService } from "./service/transactions.service";
import '../css/index.css';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("");
  const FIXED_RATE = 0.5;

  const reload = async () => {
    setLoans([]);
  };

  useEffect(() => {
    (async () => {
      const accs = await AccountsService.getAccounts();
      setAccounts(accs);
      if (accs[0]) setFromAccount(accs[0].accountNumber);
    })();
    reload();
  }, []);

  const onRequest = async (e) => {
    e.preventDefault();
    setStatus("");
    const val = Number(amount);
    const months = Number(term);
    if (!fromAccount || !val || val <= 0 || !months || months <= 0) {
      setStatus("Please enter valid account, amount and term.");
      return;
    }
    try {
      await TransactionsService.create({
        accountNumberSender: fromAccount,
        typeOfTransaction: "loan",
        transactionAmount: val,
        loanPayload: {
          termMonths: months,
          interestRate: FIXED_RATE,
          monthlyPayment: val / months
        }
      });
      setAmount(""); setTerm("");
      setStatus("Loan requested successfully.");
      reload();
    } catch (err) {
      setStatus(err.message || "Loan request failed.");
    }
  };

  const monthlyPayment = (principal, annualRate, termMonths) => {
    const r = Number((annualRate ?? FIXED_RATE)) / 12 / 100;
    const n = Number(termMonths || 0);
    if (!principal || !n) return 0;
    if (!r) return (principal / n).toFixed(2);
    const m = principal * (r / (1 - Math.pow(1 + r, -n)));
    return m.toFixed(2);
  };

  return (
    <div className="content">
      <div className="container">
        <h1>Loans</h1>

        <section className="card">
          <h3>Active / History</h3>
          <div className="list mt-2">
            {loans.length === 0 ? (
              <div>No loans yet.</div>
            ) : (
              loans.map((l) => (
                <div className="list-item" key={l.id}>
                  <div className="flex justify-between items-center">
                    <strong>#{l.id}</strong>
                    <span className={`badge ${l.status === 'active' ? 'badge--warn' : 'badge--ok'}`}>{l.status}</span>
                  </div>
                  <div>Principal: {l.principal}</div>
                  <div>Remaining: {l.remaining}</div>
                  <div>Term: {l.termMonths} months</div>
                  <div>Annual rate: {l.annualRate ?? 0}%</div>
                  <div>Monthly payment (calc): ₪{monthlyPayment(l.principal, l.annualRate, l.termMonths)}</div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="grid cols-2 gap-2 mt-2">
          <form className="form form--card" onSubmit={onRequest}>
            <h3>Request new loan</h3>

            <div className="form__row">
              <label className="form__label">From account</label>
              <select
                className="select"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
              >
                {accounts.map((a) => (
                  <option key={a.accountNumber} value={a.accountNumber}>
                    {a.accountNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__row">
              <label className="form__label">Amount</label>
              <input className="input" type="number" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
            </div>
            <div className="form__row">
              <label className="form__label">Term (months)</label>
              <input className="input" type="number" placeholder="Term (months)" value={term} onChange={(e)=>setTerm(e.target.value)} />
            </div>
            <div className="form__row">
              <label className="form__label">Annual rate</label>
              <div className="badge">Fixed {FIXED_RATE}%</div>
            </div>
            <div className="form__actions">
              <button className="btn btn--primary" type="submit">Request</button>
            </div>
          </form>

          <form className="form form--card">
            <h3>Repay loan</h3>
            <p className="form__hint">Repayment feature not implemented on server yet.</p>
          </form>
        </section>

        {status && <p className="form__hint mt-2">{status}</p>}
      </div>
    </div>
  );
}
