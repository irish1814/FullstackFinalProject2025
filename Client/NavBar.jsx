import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);         
  const btnRef = useRef(null);
  const drawerRef = useRef(null);
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setOpen(false);
    nav("/login", { replace: true });
  };

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (btnRef.current?.contains(e.target)) return;
      if (drawerRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 769 && open) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  return (
    <>
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__dot" />
          <span>MyBank+</span>
        </div>

        <nav className="topbar__nav" aria-label="Main">
          <NavLink to="/dashboard" end>Dashboard</NavLink>
          {role === "admin" && <NavLink to="/accounts">Accounts</NavLink>}
          <NavLink to="/transfers">Transfers</NavLink>
          <NavLink to="/cash">Cash</NavLink>
          <NavLink to="/loans">Loans</NavLink>
          <NavLink to="/savings">Savings</NavLink>
          <NavLink to="/exchange">Exchange</NavLink>
          {role === "admin" && <NavLink to="/admin">Admin</NavLink>}

        </nav>

        <div className="topbar__right">
          <div className="avatar" aria-hidden="true" />
          <button className="btn" onClick={() => { setOpen(false); nav("/profile"); }}>Profile</button>
          <button className="btn btn--ghost" onClick={logout}>Logout</button>

          <button
            ref={btnRef}
            className="topbar__toggle"
            aria-label="Open menu"
            aria-expanded={open ? "true" : "false"}
            aria-controls="mobile-drawer"
            onClick={() => setOpen(v => !v)}
          >
            <span className="burger" />
          </button>
        </div>
      </header>

      

      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`drawer ${open ? "drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
        <NavLink to="/accounts" onClick={() => setOpen(false)}>Accounts</NavLink>
        <NavLink to="/transfers" onClick={() => setOpen(false)}>Transfers</NavLink>
        <NavLink to="/cash" onClick={() => setOpen(false)}>Cash</NavLink>
        <NavLink to="/loans" onClick={() => setOpen(false)}>Loans</NavLink>
        <NavLink to="/savings" onClick={() => setOpen(false)}>Savings</NavLink>
        <NavLink to="/exchange" onClick={() => setOpen(false)}>Exchange</NavLink>
        {role === "admin" && <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>}
        <button className="btn btn--ghost" onClick={logout}>Logout</button>
      </div>
    </>
  );
}
