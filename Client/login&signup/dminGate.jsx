import React, { useState } from "react";
import { AuthService } from "../services/auth.service.jsx";
import { useNavigate } from "react-router-dom";
import "../css/admin.css";

export default function AdminGate() {
  const nav = useNavigate();
  const [entryCode, setEntryCode] = useState("");
  const [err, setErr] = useState("");

  async function submit(e){
    e.preventDefault();
    setErr("");
    try {
      const res = await AuthService.adminGate(entryCode);
      if (res.canAdminLogin) nav("/admin/login");
      if (res.gateToken) { sessionStorage.setItem("admin_gate", res.gateToken); nav("/admin/login"); }
    } catch(e){ setErr(e.error || "Invalid code"); }
  }

  return (
    <form className="admin-gate" onSubmit={submit}>
      <input value={entryCode} onChange={e=>setEntryCode(e.target.value)} placeholder="Admin entry code" />
      {err && <div className="error">{err}</div>}
      <button type="submit">Continue</button>
    </form>
  );
}
