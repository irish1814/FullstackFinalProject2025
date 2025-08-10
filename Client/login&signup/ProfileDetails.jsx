import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileDetails() {
  const nav = useNavigate();
  const [form, setForm] = useState({ age: "", gender: "", region: "" });
  const [err, setErr] = useState("");

  function Change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function Submit(e) {
    e.preventDefault();
    setErr("");

    const ageNum = Number(form.age);
    if (!form.age || !form.gender || !form.region) {
      setErr("נא למלא את כל השדות");
      return;
    }
    if (!Number.isFinite(ageNum) || ageNum < 16) {
      setErr("גיל חייב להיות 16 ומעלה");
      return;
    }

    const username = localStorage.getItem("signup-username") || "";
    const password = localStorage.getItem("signup-password") || "";
    const profile = { username, age: ageNum, gender: form.gender, region: form.region };

    localStorage.setItem("profile", JSON.stringify(profile));

    localStorage.removeItem("signup-username");
    localStorage.removeItem("signup-password");

    nav("/login");
  }

  return (
    <form Submit={Submit}>
      <h1>פרטי פרופיל</h1>

      <label>
        גיל:
        <input name="age" value={form.age} Change={Change} />
      </label>

      <label>
        מגדר:
        <select name="gender" value={form.gender} Change={Change}>
          <option value="">בחר...</option>
          <option value="Male">זכר</option>
          <option value="Female">נקבה</option>
          <option value="Other">אחר</option>
        </select>
      </label>

      <label>
        אזור מגורים:
        <input name="region" value={form.region} Change={Change} />
      </label>

      {err && <div>{err}</div>}

      <button type="submit">סיום והרשמה</button>
    </form>
  );
}
