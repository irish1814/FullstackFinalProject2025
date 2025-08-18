import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../BankServices/service/auth.service.jsx";
import "../css/index.css";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

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

      if (user?.role) localStorage.setItem("role", user.role);

      nav("/dashboard");

    } catch (e2) {
      setErr(e2?.message || "שגיאת התחברות");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <section className="auth-card" role="region" aria-labelledby="login-title">
        <h1 id="login-title" className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to your secure banking dashboard</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="form__row">
            <label className="form__label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className="input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={onChange}
              required
            />
            <span className="form__hint">Use the email you registered with</span>
          </div>

          <div className="form__row">
            <label className="form__label" htmlFor="password">Password</label>
            <div className="flex gap-1">
              <input
                id="password"
                name="password"
                className="input"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={onChange}
                required
              />
              <button type="button" className="btn" onClick={() => setShow(s => !s)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
            <span className="form__hint">8+ chars, keep it private</span>
          </div>

          {err && <div className="form__error" aria-live="polite">{err}</div>}

          <div className="auth-actions">
            <button className="btn btn--primary" type="submit" disabled={loading || !form.email || !form.password}>
              {loading ? "Logging in..." : "Log in"}
            </button>
            <span className="form__hint">
              No account? <Link to="/signup">Create one</Link>
            </span>
          </div>
        </form>
      </section>
    </div>
  );
}
