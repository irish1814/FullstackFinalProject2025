import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./BankServices/Dashboard.jsx";
import Accounts from "./BankServices/Accounts.jsx";
import Transactions from "./BankServices/Transactions.jsx";
import Transfers from "./BankServices/Transfers.jsx";
import Loans from "./BankServices/Loans.jsx";
import Login from "./login&signup/login.jsx";
import Signup from "./login&signup/signup.jsx";
import ProfileDetails from "./login&signup/ProfileDetails.jsx";

function isAuthed() {
  return !!localStorage.getItem("token");
}

function RequireAuth({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function Nav() {
  const location = useLocation();
  const nav = useNavigate();

  const hideOnPaths = ["/login", "/signup"];
  const onSignupFlow = location.pathname.startsWith("/signup"); // כולל /signup/profileDetails
  if (!isAuthed() || hideOnPaths.includes(location.pathname) || onSignupFlow) return null;

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login", { replace: true });
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/accounts">Accounts</Link> |{" "}
      <Link to="/transactions">Transactions</Link> |{" "}
      <Link to="/transfers">Transfers</Link> |{" "}
      <Link to="/loans">Loans</Link> |{" "}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/profileDetails" element={<ProfileDetails />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/accounts" element={<RequireAuth><Accounts /></RequireAuth>} />
        <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
        <Route path="/transfers" element={<RequireAuth><Transfers /></RequireAuth>} />
        <Route path="/loans" element={<RequireAuth><Loans /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
