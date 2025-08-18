import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    nav("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__dot" />
        <span>MyBank+</span>
      </div>

      <nav className="topbar__nav" aria-label="Main">
        <NavLink to="/dashboard" end>Dashboard</NavLink>
        <NavLink to="/accounts">Accounts</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/transfers">Transfers</NavLink>
        <NavLink to="/loans">Loans</NavLink>
        <NavLink to="/savings">Savings</NavLink>
        <NavLink to="/exchange">Exchange</NavLink>
      </nav>

      <div className="topbar__right">
        <div className="avatar" aria-hidden="true" />
        <button className="btn" onClick={() => nav("/profile")}>Profile</button>
        <button className="btn btn--ghost" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
