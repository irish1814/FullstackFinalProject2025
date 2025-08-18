import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../BankServices/service/auth.service.jsx";
import "../css/index.css";

export default function ProfileDetails() {
  const nav = useNavigate();
  const { state } = useLocation(); // מגיע מ- signup: { email, password }
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    street: "",
    country: "",
    phone: "",
    city: "",
    address: "",
    dob: ""
  });

  useEffect(() => {
    if (!state?.email || !state?.password) {
      nav("/signup", { replace: true });
    }
  }, [state, nav]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const ageNum = Number(form.age);
    if (!form.firstName || !form.lastName || !form.gender || !form.street || !form.country || !ageNum) {
      setErr("נא למלא את כל שדות הפרופיל החיוניים");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: `${form.firstName} ${form.lastName}`.replace(/\s+/g, " ").trim(),
        email: String(state.email || "").trim(),
        password: state.password,
        gender: form.gender,
        age: ageNum,
        street: form.street.trim(),
        country: form.country.trim(),
        // אופציונלי:
        phone: form.phone?.trim() || undefined,
        city: form.city?.trim() || undefined,
        address: form.address?.trim() || undefined,
        dob: form.dob || undefined
      };

      await AuthService.signup(payload);
      nav("/login", { replace: true });
    } catch (e2) {
      setErr(e2?.message || "שגיאה בהרשמה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <section className="auth-card" role="region" aria-labelledby="profile-title">
        <h1 id="profile-title" className="auth-title">Complete your profile</h1>
        <p className="auth-subtitle">This helps us personalize your banking experience</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="grid cols-2 gap-2">
            <div className="form__row">
              <label className="form__label" htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" className="input" value={form.firstName} onChange={onChange} required />
            </div>
            <div className="form__row">
              <label className="form__label" htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" className="input" value={form.lastName} onChange={onChange} required />
            </div>
          </div>

          <div className="grid cols-3 gap-2">
            <div className="form__row">
              <label className="form__label" htmlFor="gender">Gender</label>
              <select id="gender" name="gender" className="select" value={form.gender} onChange={onChange} required>
                <option value="">Choose…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="na">Prefer not to say</option>
              </select>
            </div>

            <div className="form__row">
              <label className="form__label" htmlFor="age">Age</label>
              <input id="age" name="age" className="input" type="number" value={form.age} onChange={onChange} min="1" required />
            </div>

            <div className="form__row">
              <label className="form__label" htmlFor="dob">Date of Birth</label>
              <input id="dob" name="dob" className="input" type="date" value={form.dob} onChange={onChange} />
            </div>
          </div>

          <div className="grid cols-2 gap-2">
            <div className="form__row">
              <label className="form__label" htmlFor="street">Street</label>
              <input id="street" name="street" className="input" value={form.street} onChange={onChange} required />
            </div>
            <div className="form__row">
              <label className="form__label" htmlFor="country">Country</label>
              <input id="country" name="country" className="input" value={form.country} onChange={onChange} required />
            </div>
          </div>

          <div className="grid cols-2 gap-2">
            <div className="form__row">
              <label className="form__label" htmlFor="city">City</label>
              <input id="city" name="city" className="input" value={form.city} onChange={onChange} />
            </div>
            <div className="form__row">
              <label className="form__label" htmlFor="address">Address (extra)</label>
              <input id="address" name="address" className="input" value={form.address} onChange={onChange} />
            </div>
          </div>

          <div className="form__row">
            <label className="form__label" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" className="input" value={form.phone} onChange={onChange} />
            <span className="form__hint">Optional</span>
          </div>

          {err && <div className="form__error" aria-live="polite">{err}</div>}

          <div className="auth-actions">
            <button className="btn" type="button" onClick={() => nav("/dashboard")}>Skip</button>
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
