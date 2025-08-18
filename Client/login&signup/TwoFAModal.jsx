import React, { useState } from "react";
import { AuthService } from "../BankServices/service/auth.service";
import "../css/index.css";

export default function TwoFAModal({ open, onClose, tempToken, onVerified }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  if (!open) return null;

  async function verify(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await AuthService.verify2fa(code, tempToken);
      onVerified(res.token);
    } catch (e) { setErr(e.error || "Invalid code"); }
  }

  return (
    <div className="modal">
      <div className="modal-body">
        <h3>Two-Factor Code</h3>
        <form onSubmit={verify}>
          <input value={code} onChange={e=>setCode(e.target.value)} inputMode="numeric" maxLength={6} placeholder="6-digit code" />
          {err && <div className="error">{err}</div>}
          <div className="row">
            <button type="submit">Verify</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
