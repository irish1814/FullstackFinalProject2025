import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../BankServices/service/auth.service.jsx";
import "../css/index.css";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [admin, setAdmin] = useState({ open: false, code: "", err: "", busy: false });
  const ADMIN_ENTRY_KEY = import.meta.env.VITE_ADMIN_ENTRY_KEY || "";


  const [twoFA, setTwoFA] = useState({
    required: false,
    tempToken: "",  
    code: "",
    verifying: false,
    error: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      nav("/dashboard");
    }
  }, [nav]);

  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setTwoFA(s => ({ ...s, error: "" }));
    if (!form.email || !form.password) { setErr("נא למלא אימייל וסיסמה"); return; }

    try {
      setLoading(true);
      const res = await AuthService.login(form.email, form.password);

      if (res?.twoFactorRequired && res?.userId) {
        setTwoFA({ required: true, tempToken: res.userId, code: "", verifying: false, error: "" });
        return; 
      }

        const { token, user , account} = res;
        if (!token) throw new Error("חסרים נתוני התחברות");
        localStorage.setItem("token", token);
        console.log(user);
        if(user?._id) localStorage.setItem("userId", user._id);
        if (user?.email) localStorage.setItem("email", user.email);
        if (user?.role) localStorage.setItem("role", user.role);
        if (account?.accountNumber) localStorage.setItem("accountNumber", account.accountNumber);
      nav("/dashboard");
    } catch (e2) {
      setErr(e2?.message || "שגיאת התחברות");
    } finally {
      setLoading(false);
    }
  }

  async function verify2fa(e) {
    e.preventDefault();
    if (!twoFA.code || twoFA.code.length !== 6) {
      setTwoFA(s => ({ ...s, error: "נא להזין קוד בן 6 ספרות" }));
      return;
    }
    setTwoFA(s => ({ ...s, verifying: true, error: "" }));
    try {
      const { jwtToken, user , account} = await AuthService.verify2fa(twoFA.code, twoFA.tempToken);
      if (!jwtToken) throw new Error("אימות דו-שלבי נכשל");
      localStorage.setItem("token", jwtToken);
      if (user?.email) localStorage.setItem("email", user.email);
      if (user?.role) localStorage.setItem("role", user.role);
      if (account?.accountNumber) localStorage.setItem("accountNumber", account.accountNumber);
      setTwoFA({ required: false, tempToken: "", code: "", verifying: false, error: "" });
      nav("/dashboard");
    } catch (e2) {
      setTwoFA(s => ({ ...s, error: e2?.message || "קוד שגוי", verifying: false }));
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
            <input id="email" name="email" className="input" type="email" autoComplete="email"
                   value={form.email} onChange={onChange} required />
            <span className="form__hint">Use the email you registered with</span>
          </div>

          <div className="form__row">
            <label className="form__label" htmlFor="password">Password</label>
            <div className="flex gap-1">
              <input id="password" name="password" className="input" type={show ? "text" : "password"}
                     autoComplete="current-password" value={form.password} onChange={onChange} required />
              <button type="button" className="btn" onClick={() => setShow(s => !s)}>{show ? "Hide" : "Show"}</button>
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

      {twoFA.required && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="twofa-title">
          <div className="auth-card" style={{ maxWidth: 420 }}>
            <h2 id="twofa-title" className="auth-title">Two-Factor Code</h2>
            <p className="auth-subtitle">Enter the 6-digit code from your authenticator</p>

            <form className="form" onSubmit={verify2fa}>
              <div className="form__row">
                <label className="form__label" htmlFor="twofa">Code</label>
                <input id="twofa" className="input" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
                       value={twoFA.code}
                       onChange={(e) => {
                         const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                         setTwoFA(s => ({ ...s, code: v, error: "" }));
                       }}
                       placeholder="••••••" required />
                <span className="form__hint">6 digits</span>
              </div>

              {twoFA.error ? <div className="form__error" aria-live="polite">{twoFA.error}</div> : null}

              <div className="auth-actions">
                <button className="btn btn--primary" type="submit"
                        disabled={twoFA.verifying || twoFA.code.length !== 6}>
                  {twoFA.verifying ? "Verifying…" : "Verify"}
                </button>
                <button className="btn" type="button"
                        onClick={() => setTwoFA({ required: false, tempToken: "", code: "", verifying: false, error: "" })}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {admin.open && (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="auth-card" style={{ maxWidth: 420 }}>
            <h2 className="auth-title">Admin Entry</h2>
            <p className="auth-subtitle">Enter the secret code</p>

            <form className="form" onSubmit={(e) => {
              e.preventDefault();
              if (!ADMIN_ENTRY_KEY) { setAdmin(a => ({ ...a, err: "חסר מפתח ב־ENV (VITE_ADMIN_ENTRY_KEY)" })); return; }
              if (admin.code.trim() !== ADMIN_ENTRY_KEY) { setAdmin(a => ({ ...a, err: "מפתח שגוי" })); return; }
              localStorage.setItem("adminEntry", "ok");
              setAdmin({ open: false, code: "", err: "", busy: false });
              nav("/accounts"); 
            }}>
              <div className="form__row">
                <label className="form__label" htmlFor="admin-code">Secret code</label>
                <input id="admin-code" className="input" value={admin.code}
                       onChange={(e) => setAdmin(a => ({ ...a, code: e.target.value, err: "" }))} />
              </div>

              {admin.err && <div className="form__error">{admin.err}</div>}

              <div className="auth-actions">
                <button className="btn" type="button"
                        onClick={() => setAdmin({ open: false, code: "", err: "", busy: false })}>
                  Cancel
                </button>
                <button className="btn btn--primary" type="submit">Enter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
