import React, { useEffect, useState } from "react";
import { SavingsService } from "./service/savings.service";

export default function Savings() {
  const [plans, setPlans] = useState([]);
  const [name, setName] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [term, setTerm] = useState("");
  const [contribId, setContribId] = useState("");
  const [contribAmount, setContribAmount] = useState("");
  const [status, setStatus] = useState("");

  const getRateByAmount = (amt) => {
    const a = Number(amt || 0);
    if (a > 20000) return 4;
    if (a >= 10000) return 3.4;
    return 3;
  };

  const reload = async () => {
    const list = await SavingsService.list();
    setPlans(list);
  };
  useEffect(() => { reload(); }, []);

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

    if (!name || !monthly || !months) {
      setStatus("Please fill all fields.");
      return;
    }

    await SavingsService.open({
      name,
      monthlyAmount: monthly,
      termMonths: months,
      annualRate: autoRate, 
    });

    setName("");
    setMonthlyAmount("");
    setTerm("");
    setStatus("Saving plan opened (local demo).");
    reload();
  };

  const onContribute = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!contribId) { setStatus("Choose a plan"); return; }
    const val = Number(contribAmount);
    if (!val || val <= 0) { setStatus("Invalid amount."); return; }
    await SavingsService.contribute({ savingId: contribId, amount: val });
    setContribAmount("");
    setStatus("Contribution recorded (local demo).");
    reload();
  };

  return (
    <div className="content">
      <div className="container">
        <h1>Savings</h1>

        <section className="card">
          <h3>My plans</h3>
          <div className="list mt-2">
            {plans.map((p) => {
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
            })}
          </div>
        </section>

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

            {/* ריבית מחושבת אוטומטית – תצוגה בלבד */}
            <div className="form__row">
              <label className="form__label">Annual rate</label>
              <div className="badge">Auto: {getRateByAmount(Number(monthlyAmount))}%</div>
              <p className="form__hint">
                &lt;10,000 → 3% · 10,000–20,000 → 3.4% · &gt;20,000 → 4%
              </p>
            </div>

            <div className="form__actions">
              <button className="btn btn--primary" type="submit">Open</button>
            </div>
          </form>

          <form className="form form--card" onSubmit={onContribute}>
            <h3>Contribute</h3>
            <div className="form__row">
              <label className="form__label">Plan</label>
              <select
                className="select"
                value={contribId}
                onChange={(e) => setContribId(e.target.value)}
              >
                <option value="">Choose plan</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} – balance ₪{p.balance ?? 0}
                  </option>
                ))}
              </select>
            </div>
            <div className="form__row">
              <label className="form__label">Amount</label>
              <input
                className="input"
                type="number"
                value={contribAmount}
                onChange={(e) => setContribAmount(e.target.value)}
              />
            </div>
            <div className="form__actions">
              <button className="btn" type="button">Cancel</button>
              <button className="btn btn--primary" type="submit">Add</button>
            </div>
          </form>
        </section>

        {status && <p className="form__hint mt-2">{status}</p>}
      </div>
    </div>
  );
}
