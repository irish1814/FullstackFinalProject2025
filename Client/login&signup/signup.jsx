import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/index.css";

export default function Signup() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    adminCode: ""
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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

    setLoading(true);

    nav("/signup/profileDetails", {
      state: {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        adminCode: form.adminCode.trim() || null,
        role: adminCode ? "admin" : "user"
      }
    });
  }

  return (
    <div className="auth-wrap">
      <section className="auth-card" role="region" aria-labelledby="signup-title">
        <h1 id="signup-title" className="auth-title">Create your account</h1>
        <p className="auth-subtitle">It takes less than a minute</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="form__row">
            <label className="form__label" htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              className="input"
              value={form.name}
              onChange={onChange}
              placeholder="John Doe"
            />
          </div>

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
          </div>

          <div className="form__row">
            <label className="form__label" htmlFor="adminCode">Admin Code (optional)</label>
            <input
              id="adminCode"
              name="adminCode"
              className="input"
              type="password"
              value={form.adminCode}
              onChange={onChange}
              placeholder="Enter code if you have one"
            />
          </div>

          <div className="form__row">
            <label className="form__label" htmlFor="password">Password</label>
            <div className="flex gap-1">
              <input
                id="password"
                name="password"
                className="input"
                type={show ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="btn"
                onClick={() => setShow(s => !s)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            <span className="form__hint">At least 8 chars & numbers.</span>
          </div>

          <div className="form__row">
            <label className="form__label" htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              name="confirm"
              className="input"
              type={show ? "text" : "password"}
              value={form.confirm}
              onChange={onChange}
              required
            />
          </div>

          {err && <div className="form__error" aria-live="polite">{err}</div>}

          <div className="auth-actions">
            <button
              className="btn btn--primary"
              type="submit"
              disabled={loading || !form.email || !form.password || !form.confirm}
            >
              {loading ? "Redirecting…" : "Create account"}
            </button>
            <span className="form__hint">
              Already have an account? <Link to="/login">Log in</Link>
            </span>
          </div>
        </form>
      </section>
    </div>
  );
}
