import React, { useEffect, useState } from "react";
import { AuthService } from "../BankServices/service/auth.service.jsx";
import { SupportService } from "../BankServices/service/support.service.jsx";
import TwoFAToggle from "../login&signup/TwoFAToggle";
import '../css/index.css';

export default function Profile() {
  const [me, setMe] = useState(null);
  const [msg, setMsg] = useState({ subject: "", message: "" });
  const [note, setNote] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const u = await AuthService.me();
        setMe(u);
      } catch {
        setMe({
          _id: localStorage.getItem("uid") || "",
          name: "MyBank+ User",
          email: localStorage.getItem("email") || "",
          twofaEnabled: false,
        });
      }
    })();
  }, []);

  async function send(e) {
    e.preventDefault();
    if (!msg.subject.trim() || !msg.message.trim()) return setNote("נא למלא נושא והודעה");
    try {
      await (SupportService?.send?.(msg) ?? Promise.resolve());
      setMsg({ subject: "", message: "" });
      setNote("נשלח. נחזור אליך בהקדם.");
    } catch {
      setNote("שגיאה בשליחה");
    }
  }

  if (!me) return null;

  return (
    <div className="grid cols-2 gap-2">
      <section className="card">
        <h3>Contact the bank</h3>
        <form onSubmit={send} className="mt-1">
          <input
            className="input"
            placeholder="Subject"
            value={msg.subject}
            onChange={(e) => setMsg({ ...msg, subject: e.target.value })}
          />
          <textarea
            className="textarea mt-1"
            rows={5}
            placeholder="Message"
            value={msg.message}
            onChange={(e) => setMsg({ ...msg, message: e.target.value })}
          />
          <div className="row mt-1">
            <button type="button" className="btn" onClick={() => setMsg({ subject: "", message: "" })}>Clear</button>
            <button className="btn btn--primary" type="submit">Send</button>
          </div>
          {note && <p className="form__hint mt-1">{note}</p>}
        </form>
      </section>

      <aside className="card">
        <h3>Your profile</h3>
        <div className="list mt-1">
          <div className="list-item"><strong>Name</strong><div>{me.name || "-"}</div></div>
          <div className="list-item"><strong>Email</strong><div>{me.email || "-"}</div></div>
        </div>
        <div className="divider mt-2" />
        <TwoFAToggle userId={me._id} enabled={!!(me.mfa?.twoFactorEnabled ?? me.twofaEnabled)} onChange={(v)=>setMe({...me, twofaEnabled:v})}/>
      </aside>
    </div>
  );
}
