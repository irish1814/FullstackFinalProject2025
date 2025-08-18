import React, { useEffect, useState } from "react";
import { AuthService } from "../BankServices/service/auth.service.jsx";
import { SupportService } from "../BankServices/service/support.service.jsx";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [status, setStatus] = useState("");

  const [ticket, setTicket] = useState({
    type: "limit_increase",
    subject: "",
    message: "",
    contact: "email" 
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingUser(true);
        const me = await (AuthService.me?.() ?? Promise.resolve(null));
        if (mounted) {
          const fallback = {
            email: localStorage.getItem("email") || "",
            name: "MyBank+ User",
          };
          setUser(me || fallback);
        }
      } catch {
        const fallback = {
          email: localStorage.getItem("email") || "",
          name: "MyBank+ User",
        };
        setUser(fallback);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  function onChangeTicket(e) {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  }

  async function onSend(e) {
    e.preventDefault();
    setStatus("");
    if (!ticket.subject.trim() || !ticket.message.trim()) {
      setStatus("נא למלא נושא והודעה");
      return;
    }
    try {
      await SupportService.send({
        type: ticket.type,
        subject: ticket.subject.trim(),
        message: ticket.message.trim(),
        contact: ticket.contact
      });
      setTicket(t => ({ ...t, subject: "", message: "" }));
      setStatus("ההודעה נשלחה לבנק. נחזור אליך בהקדם.");
    } catch (err) {
      setStatus(err?.message || "שגיאה בשליחת ההודעה");
    }
  }

  const name    = user?.name    || "-";
  const email   = user?.email   || "-";
  const country = user?.country || "-";
  const street  = user?.street  || "-";
  const city    = user?.city    || "-";
  const address = user?.address || "-";
  const phone   = user?.phone   || "-";
  const age     = user?.age     || "-";
  const dob     = user?.dob     || "-";

  return (
    <div className="content">
      <div className="container">
        <h1>Profile</h1>
            <p className="auth-subtitle">Welcome, {user?.name || email}</p>

        <div className="grid cols-2 gap-2 mt-2">
          <section className="card">
            <h3>Contact the bank</h3>
            <form className="form mt-2" onSubmit={onSend}>
              <div className="grid cols-3 gap-2">
                <div className="form__row">
                  <label className="form__label" htmlFor="type">Request type</label>
                  <select id="type" name="type" className="select" value={ticket.type} onChange={onChangeTicket}>
                    <option value="limit_increase">Increase credit limit</option>
                    <option value="unblock_account">Unblock my account</option>
                    <option value="general">General inquiry</option>
                  </select>
                </div>

                <div className="form__row">
                  <label className="form__label" htmlFor="contact">Preferred contact</label>
                  <select id="contact" name="contact" className="select" value={ticket.contact} onChange={onChangeTicket}>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>

                <div className="form__row">
                  <label className="form__label" htmlFor="subject">Subject</label>
                  <input id="subject" name="subject" className="input" value={ticket.subject} onChange={onChangeTicket} />
                </div>
              </div>

              <div className="form__row">
                <label className="form__label" htmlFor="message">Message</label>
                <textarea id="message" name="message" className="textarea" rows={6}
                          value={ticket.message} onChange={onChangeTicket} />
              </div>

              <div className="form__actions">
                <button className="btn" type="button" onClick={() => setTicket(t => ({ ...t, subject: "", message: "" }))}>
                  Clear
                </button>
                <button className="btn btn--primary" type="submit">Send</button>
              </div>

              {status && <p className="form__hint mt-1">{status}</p>}
            </form>
          </section>

          <aside className="card">
            <h3>Your profile</h3>

            {loadingUser ? (
              <div className="p-2">
                <div className="skeleton" style={{ width: "40%", height: 12 }} />
                <div className="skeleton mt-1" />
                <div className="skeleton mt-1" />
              </div>
            ) : (
              <div className="list mt-2">
                <div className="list-item">
                  <strong>Name</strong>
                  <div>{name}</div>
                </div>
                <div className="list-item">
                  <strong>Email</strong>
                  <div>{email}</div>
                </div>
                <div className="list-item">
                  <strong>Phone</strong>
                  <div>{phone}</div>
                </div>
                <div className="list-item">
                  <strong>Country</strong>
                  <div>{country}</div>
                </div>
                <div className="list-item">
                  <strong>City</strong>
                  <div>{city}</div>
                </div>
                <div className="list-item">
                  <strong>Street</strong>
                  <div>{street}</div>
                </div>
                <div className="list-item">
                  <strong>Address</strong>
                  <div>{address}</div>
                </div>
                <div className="list-item">
                  <strong>Age</strong>
                  <div>{age}</div>
                </div>
                <div className="list-item">
                  <strong>Date of Birth</strong>
                  <div>{dob}</div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
