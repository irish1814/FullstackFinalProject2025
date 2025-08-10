import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [err, setErr] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.username || !form.password || !form.confirm) {
      setErr("נא למלא את כל השדות");
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

    localStorage.setItem("signup-username", form.username);
    localStorage.setItem("signup-password", form.password);

    nav("/signup/profileDetails");
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>הרשמה</h1>

      <label>
        שם משתמש:
        <input name="username" value={form.username} onChange={onChange} />
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
