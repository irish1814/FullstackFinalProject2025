import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [err, setErr] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.email || !form.password || !form.confirm) {
      setErr("נא למלא אימייל, סיסמה ואימות סיסמה");
      return;
    }
    if (form.password !== form.confirm) {
      setErr("הסיסמאות לא תואמות");
      return;
    }
    if (form.password.length < 8) {
      setErr("הסיסמה חייבת להיות לפחות 8 תווים");
      return;
    }

    nav("/signup/profileDetails", { state: { email: form.email, password: form.password } });
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>הרשמה</h1>

      <label>
        אימייל:
        <input name="email" type="email" value={form.email} onChange={onChange} />
      </label>

      <label>
        סיסמה:
        <input name="password" type="password" value={form.password} onChange={onChange} />
      </label>

      <label>
        אימות סיסמה:
        <input name="confirm" type="password" value={form.confirm} onChange={onChange} />
      </label>

      {err && <div>{err}</div>}

      <button type="submit">המשך</button>
    </form>
  );
}
