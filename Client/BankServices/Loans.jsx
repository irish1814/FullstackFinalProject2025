import React, { useEffect, useState } from "react";
import { AccountsService } from "./service/accounts.service";
import { LoansService } from "./service/loans.service";
import "../css/index.css";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("");
  const FIXED_RATE = 0.5; 

  const reload = async () => {
    try {
      if (!fromAccount) return;
      const acc = await AccountsService.getAccount(fromAccount);
      setLoans(acc.loans || []);
    } catch (err) {
      setStatus(err.message || "Failed to load loans");
    }
  };

  useEffect(() => {
    (async () => {
      const accs = await AccountsService.getAccounts();
      setAccounts(accs);
      if (accs[0]) {
        setFromAccount(accs[0].accountNumber);
      }
    })();
  }, []);

  useEffect(() => {
    if (fromAccount) {
      reload();
    }
  }, [fromAccount]);

  const onRequest = async (e) => {
    e.preventDefault();
    setStatus("");
    const val = Number(amount);
    const months = Number(term);

    if ( !val || val <= 0 || !months || months <= 0) {
      setStatus("Please enter valid account, amount and term.");
      return;
    }

    try {
      await LoansService.request({
        accountNumberSender: localStorage.getItem("accountNumber"),
        transactionAmount: amount,
        termMonths: months,
        annualRate: FIXED_RATE,
      });
      setAmount("");
      setTerm("");
      setStatus("Loan requested successfully.");
      reload();
    } catch (err) {
      setStatus(err.message || "Loan request failed.");
    }
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
              loans.map((l, idx) => (
                <div className="list-item" key={l._id || idx}>
                  <div className="flex justify-between items-center">
                    <strong>#{l._id || idx}</strong>
                    <span
                      className={`badge ${
                        l.isPaid ? "badge--ok" : "badge--warn"
                      }`}
                    >
                      {l.isPaid ? "closed" : "active"}
                    </span>
                  </div>
                  <div>Principal: {l.principal}</div>
                  <div>Remaining: {l.remainingBalance}</div>
                  <div>Term: {l.termMonths} months</div>
                  <div>Annual rate: {l.interestRate ?? FIXED_RATE}%</div>
                  <div>Monthly payment: ₪{l.monthlyPayment}</div>
                  <div>Due date: {new Date(l.dueDate).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="grid cols-2 gap-2 mt-2">
          <form className="form form--card" onSubmit={onRequest}>
            <h3>Request new loan</h3>

            <div className="form__row">
              <label className="form__label">Amount</label>
              <input
                className="input"
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form__row">
              <label className="form__label">Term (months)</label>
              <input
                className="input"
                type="number"
                placeholder="Term (months)"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>

            <div className="form__row">
              <label className="form__label">Annual rate</label>
              <div className="badge">Fixed {FIXED_RATE}%</div>
            </div>

            <div className="form__actions">
              <button className="btn btn--primary" type="submit">
                Request
              </button>
            </div>
          </form>

          <form className="form form--card">
            <h3>Repay loan</h3>
            <p className="form__hint">
              Repayment feature not implemented on server yet.
            </p>
          </form>
        </section>

        {status && <p className="form__hint mt-2">{status}</p>}
      </div>
    </div>
  );
}
