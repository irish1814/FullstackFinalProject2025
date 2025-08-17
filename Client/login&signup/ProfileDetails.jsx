import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// ✔ נתיב נכון
import { AuthService } from "../BankServices/service/auth.service.jsx";

export default function ProfileDetails() {
  const nav = useNavigate();
  const { state } = useLocation();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    street: "",
    country: ""
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
      setErr("נא למלא את כל שדות הפרופיל");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: `${form.firstName} ${form.lastName}`.replace(/\s+/g, " ").trim(),
        email: String(state.email || "").trim(),
        password: state.password
      };

      await AuthService.signup(payload);

      nav("/login", { replace: true });
    } catch (e2) {
      setErr(e2.message || "שגיאה בהרשמה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>פרטי פרופיל</h1>

      <p>אימייל: <b>{state?.email}</b></p>

      <label>
        שם פרטי:
        <input
          name="firstName"
          value={form.firstName}
          onChange={onChange}
          placeholder="e.g. David"
        />
      </label>

      <label>
        שם משפחה:
        <input
          name="lastName"
          value={form.lastName}
          onChange={onChange}
          placeholder="e.g. Levi"
        />
      </label>

      <label>
        מגדר:
        <select name="gender" value={form.gender} onChange={onChange}>
          <option value="">בחר...</option>
          <option value="male">זכר</option>
          <option value="female">נקבה</option>
          <option value="other">אחר</option>
        </select>
      </label>

      <label>
        גיל:
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={onChange}
          placeholder="18"
        />
      </label>

      <label>
        רחוב:
        <input
          name="street"
          value={form.street}
          onChange={onChange}
          placeholder="Herzl 10"
        />
      </label>

      <label>
        מדינה:
        <input
          name="country"
          value={form.country}
          onChange={onChange}
          placeholder="Israel"
        />
      </label>

      {err && <div>{err}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "שולח..." : "סיום הרשמה"}
      </button>
    </form>
  );
}
