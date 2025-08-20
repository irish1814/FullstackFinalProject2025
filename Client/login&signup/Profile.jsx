import React, { useEffect, useState } from "react";
import { AuthService } from "../BankServices/service/auth.service.jsx";
import { SupportService } from "../BankServices/service/support.service.jsx";
import TwoFAToggle from "../login&signup/TwoFAToggle";
import '../css/index.css';

export default function Profile() {
  const [me, setMe] = useState(null);
  const [msg, setMsg] = useState({ subject: "", message: "" });
  const [note, setNote] = useState("");

  // Load user profile on mount
  useEffect(() => {
    (async () => {
      try {
        const u = await AuthService.me();
        setMe(u);
      } catch {
        setMe({
          _id: localStorage.getItem("userId") || "",
          name: "MyBank+ User",
          email: localStorage.getItem("email") || "",
          twofaEnabled: false,
        });
      }
    })();
  }, []);

  // Send message to support
  async function send(e) {
    e.preventDefault();
    if (!msg.subject.trim() || !msg.message.trim()) return setNote("נא למלא נושא והודעה");

    try {
      const res = await SupportService.sendMessage(localStorage.getItem('accountNumber'), msg);
      if (res) {
        console.log(res);
        setMsg({ subject: "", message: "" });
        setNote("נשלח. נחזור אליך בהקדם.");
      } else {
        throw new Error("Account not found");
      }
    } catch (error) {
      setNote(error.message || "Failed to send message");
    }
  }

  // Show QR code popup when enabling 2FA
  const handle2FAEnable = (data) => {
    if(!me.TwoFAToggle)
      setMe(prev => ({ ...prev, twofaEnabled: false }));
    if (!data || !data.qrcode || !data.oauth_url) return;
    const w = window.open("", "_blank", "width=400,height=450");
    if (!w) return alert("Pop-up blocked. Please allow pop-ups for this site.");

    w.document.write(`
      <html>
        <head><title>Enable 2FA</title></head>
        <body style="text-align:center; font-family:sans-serif; padding:10px;">
          <h2>Scan QR code to enable 2FA</h2>
          <img src="${data.qrcode}" alt="QR Code" style="width:250px;height:250px;" />
          <p>Or use this link: <a href="${data.oauth_url}" target="_blank">${data.oauth_url}</a></p>
        </body>
      </html>
    `);
  };

  // Handle 2FA toggle (enable or disable)
  const handle2FAToggle = async (enable) => {
    try {
      if (enable) {
        // Enable 2FA
        const res = await AuthService.toggle2FA(me._id); // enable

        if (res) {
          setMe(prev => ({ ...prev, twofaEnabled: true }));
          console.log(me)
          handle2FAEnable(res);
        }
      } else {
        // Disable 2FA
        const res = await AuthService.toggle2FA(me._id, true);
        if (res.success) {
          alert("2FA has been disabled");
          setMe(prev => ({ ...prev, twofaEnabled: false }));
        }
      }
    } catch (err) {
      alert("Failed to update 2FA: " + err.message);
    }
  };

  if (!me) return null;

  return (
    <div className="grid cols-2 gap-2">
      {/* Support Form */}
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

      {/* Profile and 2FA */}
      <aside className="card">
        <h3>Your profile</h3>
        <div className="list mt-1">
          <div className="list-item"><strong>Name</strong><div>{me.name || "-"}</div></div>
          <div className="list-item"><strong>Email</strong><div>{me.email || "-"}</div></div>
        </div>
        <div className="divider mt-2" />
        <TwoFAToggle 
          userId={me._id} 
          enabled={!!(me.mfa?.twoFactorEnabled ?? me.twofaEnabled)} 
          onChange={handle2FAToggle} 
        />
      </aside>
    </div>
  );
}
