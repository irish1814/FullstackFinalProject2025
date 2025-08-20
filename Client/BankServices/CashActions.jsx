import React, { useState } from "react";
import { CashActionsService } from "./service/cashActions.service";
import "../css/index.css";

export default function CashActions() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [checkFile, setCheckFile] = useState(null);
  const [status, setStatus] = useState("");

  const accountNumber = localStorage.getItem("accountNumber");

  // הפקדה
  const onDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) {
      setStatus("Enter a valid amount to deposit.");
      return;
    }
    try {
      await CashActionsService.deposit({
        accountNumberSender: accountNumber,
        amount: Number(depositAmount),
      });
      setStatus(`Deposited ${depositAmount} successfully.`);
      setDepositAmount("");
    } catch (err) {
      setStatus(err.message || "Deposit failed.");
    }
  };

  // משיכה
  const onWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setStatus("Enter a valid amount to withdraw.");
      return;
    }
    try {
      await CashActionsService.withdraw({
        accountNumberSender: accountNumber,
        amount: Number(withdrawAmount),
      });
      setStatus(`Withdrew ${withdrawAmount} successfully.`);
      setWithdrawAmount("");
    } catch (err) {
      setStatus(err.message || "Withdraw failed.");
    }
  };

  // הפקדת צ׳ק
  const onCheckDeposit = async (e) => {
    e.preventDefault();
    if (!checkFile) {
      setStatus("נא לבחור צילום צ׳ק.");
      return;
    }
    try {
      await CashActionsService.depositCheck(checkFile, accountNumber);
      setStatus("Check uploaded successfully.");
      setCheckFile(null);
    } catch (err) {
      setStatus(err.message || "Check deposit failed.");
    }
  };

  return (
    <div className="content">
      <div className="container">
        <h1>Cash Actions</h1>

        <div className="cash-actions">
          {/* Deposit */}
          <form className="form form--card cash-card" onSubmit={onDeposit}>
            <h3>Deposit</h3>
            <div className="form__row">
              <label className="form__label">Amount</label>
              <input
                className="input"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <div className="form__actions">
              <button className="btn" type="button">Cancel</button>
              <button className="btn btn--primary" type="submit">Deposit</button>
            </div>
          </form>

          {/* Withdraw */}
          <form className="form form--card cash-card" onSubmit={onWithdraw}>
            <h3>Withdraw</h3>
            <div className="form__row">
              <label className="form__label">Amount</label>
              <input
                className="input"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
            <div className="form__actions">
              <button className="btn" type="button">Cancel</button>
              <button className="btn btn--primary" type="submit">Withdraw</button>
            </div>
          </form>
        </div>

        {/* Deposit Check */}
        <div className="card mt-2">
          <h3>Deposit a Check</h3>
          <form onSubmit={onCheckDeposit}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCheckFile(e.target.files[0])}
            />
            <div className="form__actions mt-1">
              <button className="btn btn--primary" type="submit">Upload Check</button>
            </div>
          </form>
        </div>

        {status && <p className="form__hint mt-2">{status}</p>}
      </div>
    </div>
  );
}
