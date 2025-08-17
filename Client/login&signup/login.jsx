import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// אם הקובץ אצלך ב-service השאר כך; אם לא – שנה ל"../BankServices/auth.service.jsx"
import { AuthService } from "../BankServices/service/auth.service.jsx";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.password) {
      setErr("נא למלא אימייל וסיסמה");
      return;
    }
    try {
      setLoading(true);
      const { token, user } = await AuthService.login(form.email, form.password);
      localStorage.setItem("token", token);
      if (user?.email) localStorage.setItem("email", user.email);
      nav("/dashboard");
    } catch (e) {
      setErr(e.message || "שגיאת התחברות");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Login</h1>

      <label>
        Email:
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@example.com"
        />
      </label>

      <label>
        Password:
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••••"
        />
      </label>

      {err && <div>{err}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>

      <p>
        אין לך חשבון? <Link to="/signup">הירשם</Link>
      </p>
    </form>
  );
}
