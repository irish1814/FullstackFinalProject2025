import React, { useEffect, useState } from "react";
import { AccountsService } from "./service/accounts.service";
import { SavingsService } from "./service/savings.service";

export default function Savings() {
  const [plans, setPlans] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("");

  const reload = async () => {
  try {
    const accountNumber = localStorage.getItem("accountNumber");
    if (!accountNumber) return;

    const res = await AccountsService.getAccountById(accountNumber);
    if (res && res.data && res.data.account) {
      setPlans(res.data.account.savingsPlans || []);
    } else {
      setPlans([]);
    }
  } catch (err) {
    setStatus(err.message || "Failed to load saving plans.");
  }
};



  useEffect(() => {
    (async () => {
      const accountNumber = localStorage.getItem("accountNumber");
      if (!accountNumber) return;
      const res = await AccountsService.getAccountById(accountNumber);
      if (res && res.data && res.data.account) {
        reload();
      }
    })();
  }, []);

  const onOpen = async (e) => {
    e.preventDefault();
    setStatus("");

    const val = Number(amount);
    const months = Number(term);

    if (!name || !val || !months) {
      setStatus("Please fill all fields.");
      return;
    }

    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + months);

    try {
      await SavingsService.create({
        accountNumberSender: localStorage.getItem("accountNumber"),
        amount: val,
        targetAmount: val * months, 
        interestRate: 0.03,
        termMonths: months,
        maturityDate,
      });

      setName("");
      setAmount("");
      setTerm("");
      setStatus("Saving plan opened successfully.");
      reload();
    } catch (err) {
      setStatus(err.message || "Failed to open saving plan.");
    }
  };

  return (
    <div className="content">
      <div className="container">
        <h1>Savings</h1>

        <section className="grid cols-2 gap-2 mt-2">
          <form className="form form--card" onSubmit={onOpen}>
            <h3>Open new plan</h3>

            <div className="form__row">
              <label className="form__label">Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Vacation Fund"
              />
            </div>

            <div className="form__row">
              <label className="form__label">Amount</label>
              <input
                className="input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form__row">
              <label className="form__label">Term (months)</label>
              <input
                className="input"
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>

            <div className="form__actions">
              <button className="btn btn--primary" type="submit">
                Open
              </button>
            </div>
          </form>
        </section>

        {status && <p className="form__hint mt-2">{status}</p>}

        <section className="card">
          <h3>My plans</h3>
          <div className="list mt-2">
            {plans.length === 0 ? (
              <div>No saving plans yet.</div>
            ) : (
              plans.map((p, idx) => (
                <div className="list-item" key={p._id || idx}>
                  <div className="flex justify-between items-center">
                    <strong>{p.name}</strong>
                    <span className={`badge ${p.isLocked ? "badge--warn" : "badge--ok"}`}>
                      {p.isLocked ? "Locked" : "Open"}
                    </span>
                  </div>
                  <div>Balance: ₪{p.balance}</div>
                  <div>Target: ₪{p.targetAmount}</div>
                  <div>Interest rate: {p.interestRate * 100}%</div>
                  <div>Start date: {new Date(p.startDate).toLocaleDateString()}</div>
                  <div>Maturity date: {new Date(p.maturityDate).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
