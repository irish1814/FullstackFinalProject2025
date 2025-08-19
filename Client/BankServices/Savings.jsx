import React, { useEffect, useState } from "react";
import { AccountsService } from "./service/accounts.service";
import { TransactionsService } from "./service/transactions.service";

export default function Savings() {
  const [plans, setPlans] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [name, setName] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("");

  const getRateByAmount = (amt) => {
    const a = Number(amt || 0);
    if (a > 20000) return 4;
    if (a >= 10000) return 3.4;
    return 3;
  };

  const reload = async () => {
    // כאן אפשר למשוך את התכניות מהשרת אם בנית endpoint מתאים
    // כרגע נשתמש בדמו לוקאלי (או תחליף לפי הצורך שלך)
    setPlans([]);
  };

  useEffect(() => {
    (async () => {
      const accs = await AccountsService.getAccounts();
      setAccounts(accs);
      if (accs[0]) setFromAccount(accs[0].accountNumber);
    })();
    reload();
  }, []);

  const futureValue = (p, annualRate, months) => {
    const r = Number(annualRate || 0) / 12 / 100;
    const n = Number(months || 0);
    const P = Number(p || 0);
    if (!P || !n) return 0;
    if (!r) return (P * n).toFixed(2);
    const fv = P * ((Math.pow(1 + r, n) - 1) / r);
    return fv.toFixed(2);
  };

  const onOpen = async (e) => {
    e.preventDefault();
    setStatus("");

    const monthly = Number(monthlyAmount);
    const months = Number(term);
    const autoRate = getRateByAmount(monthly);

    if (!fromAccount || !name || !monthly || !months) {
      setStatus("Please fill all fields.");
      return;
    }

    try {
      await TransactionsService.create({
        accountNumberSender: fromAccount,
        typeOfTransaction: "saving",
        transactionAmount: monthly,
        savingPayload: {
          name,
          targetAmount: monthly * months,
          interestRate: autoRate,
          termMonths: months
        }
      });

      setName("");
      setMonthlyAmount("");
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

        <section className="card">
          <h3>My plans</h3>
          <div className="list mt-2">
            {plans.length === 0 ? (
              <div>No saving plans yet.</div>
            ) : (
              plans.map((p) => {
                const planRate = (p.annualRate ?? getRateByAmount(p.monthlyAmount));
                return (
                  <div className="list-item" key={p.id}>
                    <div className="flex justify-between items-center">
                      <strong>{p.name}</strong>
                      <span className={`badge ${p.status === 'active' ? 'badge--ok' : 'badge--warn'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div>Monthly: ₪{p.monthlyAmount}</div>
                    <div>Term: {p.termMonths} months</div>
                    <div>Annual rate: {planRate}%</div>
                    <div>Projected FV (calc): ₪{futureValue(p.monthlyAmount, planRate, p.termMonths)}</div>
                    <div>Balance: ₪{p.balance ?? 0}</div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="grid cols-2 gap-2 mt-2">
          <form className="form form--card" onSubmit={onOpen}>
            <h3>Open new plan</h3>

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
              <label className="form__label">Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Vacation Fund"
              />
            </div>

            <div className="form__row">
              <label className="form__label">Monthly amount</label>
              <input
                className="input"
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
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

            <div className="form__row">
              <label className="form__label">Annual rate</label>
              <div className="badge">Auto: {getRateByAmount(Number(monthlyAmount))}%</div>
            </div>

            <div className="form__actions">
              <button className="btn btn--primary" type="submit">Open</button>
            </div>
          </form>
        </section>

        {status && <p className="form__hint mt-2">{status}</p>}
      </div>
    </div>
  );
}
