import React, { useState } from "react";
import { CurrencyService } from "./service/currency.service.jsx";

const CODES = ["USD", "EUR", "ILS", "GBP", "JPY", "AUD", "CAD"];

export default function CurrencyExchange() {
  const [payingCurrency, setPayingCurrency] = useState("ILS");
  const [currencyToBuy, setCurrencyToBuy] = useState("USD");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(""); setQuote(null);
    const amt = Number(amount);
    if (!currencyToBuy || !payingCurrency || !amt || amt <= 0) {
      setStatus("Please fill valid amount and currencies."); return;
    }
    try {
      setLoading(true);
      const res = await CurrencyService.quote({
        currencyToBuy,
        payingCurrency,
        amount: amt,
      });
      setQuote(res);
    } catch (err) {
      setStatus(err?.message || "Failed to fetch exchange quote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="container">
        <div className="toolbar">
          <h1>Currency Exchange</h1>
        </div>

        <form className="form form--card mt-2" onSubmit={onSubmit}>
          <div className="grid cols-3 gap-2">
            <div className="form__row">
              <label className="form__label">Paying currency</label>
              <select className="select" value={payingCurrency}
                      onChange={(e)=>setPayingCurrency(e.target.value.toUpperCase())}>
                {CODES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form__row">
              <label className="form__label">Currency to buy</label>
              <select className="select" value={currencyToBuy}
                      onChange={(e)=>setCurrencyToBuy(e.target.value.toUpperCase())}>
                {CODES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form__row">
              <label className="form__label">Amount to buy</label>
              <input className="input" type="number" min="0" step="0.01"
                     value={amount} onChange={(e)=>setAmount(e.target.value)} />
            </div>
          </div>

          <div className="form__actions">
            <button className="btn" type="button" onClick={()=>{ setAmount(""); setQuote(null); setStatus(""); }}>
              Clear
            </button>
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Get quote"}
            </button>
          </div>

          {status && <p className="form__hint mt-1">{status}</p>}
        </form>

        {quote && (
          <section className="card mt-2">
            <h3>Quote</h3>
            <div className="grid cols-3 gap-2 mt-2">
              <div className="list-item">
                <div><strong>Rate</strong></div>
                <div>1 {quote.payingCurrency} = { (1/quote.exchangeRate).toFixed(6) } {quote.currencyToBuy}</div>
                <div>1 {quote.currencyToBuy} = { quote.exchangeRate.toFixed(6) } {quote.payingCurrency}</div>
              </div>
              <div className="list-item">
                <div><strong>To buy</strong></div>
                <div>{quote.amount} {quote.currencyToBuy}</div>
              </div>
              <div className="list-item">
                <div><strong>Cost</strong></div>
                <div>≈ {quote.costInPayingCurrency} {quote.payingCurrency}</div>
              </div>
            </div>
            {quote.lastUpdated && (
              <p className="form__hint mt-2">
                Last updated: {quote.lastUpdated}
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
