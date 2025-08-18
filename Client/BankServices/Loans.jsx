import React, { useEffect, useState } from "react";
import { LoansService } from "../BankServices/service/loans.service.jsx";
import '../css/index.css';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [repayId, setRepayId] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [status, setStatus] = useState("");
  const FIXED_RATE = 0.5;

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
    await LoansService.request({ amount: val, termMonths: months, annualRate: FIXED_RATE });
    setAmount(""); setTerm("");
    setStatus("Loan requested");
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
          {loans.map((l) => (
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
          ))}
        </div>
      </section>

      <section className="grid cols-2 gap-2 mt-2">
        <form className="form form--card" onSubmit={onRequest}>
          <h3>Request new loan</h3>
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

        <form className="form form--card" onSubmit={onRepay}>
          <h3>Repay loan</h3>
          <div className="form__row">
            <label className="form__label">Loan</label>
            <select className="select" value={repayId} onChange={(e)=>setRepayId(e.target.value)}>
              <option value="">Choose loan</option>
              {loans.map((l)=>(
                <option key={l.id} value={l.id}>#{l.id} – remaining {l.remaining}</option>
              ))}
            </select>
          </div>
          <div className="form__row">
            <label className="form__label">Repay amount</label>
            <input className="input" type="number" placeholder="Repay amount" value={repayAmount} onChange={(e)=>setRepayAmount(e.target.value)} />
          </div>
          <div className="form__actions">
            <button className="btn" type="button">Cancel</button>
            <button className="btn btn--primary" type="submit">Repay</button>
          </div>
        </form>
      </section>

      {status && <p className="form__hint mt-2">{status}</p>}
    </div>
  </div>
);

}
