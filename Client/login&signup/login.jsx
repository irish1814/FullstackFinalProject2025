import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  function Change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function Submit(e) {
    e.preventDefault();
    setErr("");
    if (!form.username || !form.password) {
      setErr("נא למלא שם משתמש וסיסמה");
      return;
    }
    localStorage.setItem("token", "dev-mock-token");
    localStorage.setItem("username", form.username);
    nav("/");
  }

  return (
    <form Submit={Submit}>
      <h1>Login</h1>

      <label>
        User Name:
        <input name="username" value={form.username} Change={Change} />
      </label>

      <label>
        password:
        <input name="password" type="password" value={form.password} Change={Change} />
      </label>

      {err && <div>{err}</div>}

      <button type="submit">Login</button>

      <p>
        אין לך חשבון? <Link to="/signup">הירשם</Link>
      </p>
    </form>
  );
}
