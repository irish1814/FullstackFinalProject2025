import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Dashboard from "./BankServices/Dashboard.jsx";
import Accounts from "./BankServices/Accounts.jsx";
import Transfers from "./BankServices/Transfers.jsx";
import Loans from "./BankServices/Loans.jsx";
import Savings from "./BankServices/Savings.jsx";
import CurrencyExchange from "./BankServices/CurrencyExchange.jsx";
import Login from "./login&signup/login.jsx";
import Signup from "./login&signup/signup.jsx";
import ProfileDetails from "./login&signup/ProfileDetails.jsx";
import NavBar from "./NavBar"; 
import Profile from "./login&signup/Profile.jsx";
import AdminPage from "../Client/src/Admin";
import CashActions from "./BankServices/CashActions.jsx";   // ייבוא


function isAuthed() {
  return !!localStorage.getItem("token");
}

function RequireAuth({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function AppLayout() {
  const location = useLocation();
  const hideOn = ["/login", "/signup", "/signup/profileDetails"];
  const showNav = isAuthed() && !hideOn.includes(location.pathname);

  return (
    <>
      {showNav && <NavBar />}
      <main className="content">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<AppLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/profileDetails" element={<ProfileDetails />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<RequireAuth><Dashboard /></RequireAuth>}
          />
          <Route
            path="/accounts"
            element={<RequireAuth><Accounts /></RequireAuth>}
          />
          
          <Route
            path="/transfers"
            element={<RequireAuth><Transfers /></RequireAuth>}
          />
          <Route
            path="/cash"
            element={<RequireAuth><CashActions /></RequireAuth>}
          />
          <Route
            path="/loans"
            element={<RequireAuth><Loans /></RequireAuth>}
          />
          <Route
            path="/savings"
            element={<RequireAuth><Savings /></RequireAuth>}
          />
          <Route
            path="/exchange"
            element={<RequireAuth><CurrencyExchange /></RequireAuth>}
          />
        </Route>
        <Route 
         path="/profile"
          element={<RequireAuth><Profile /></RequireAuth>}
        />
        

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
