import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "./BankServices/service/auth.service";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const me = await AuthService.me(token);
        setUser(me);
      } catch (_) {
        setToken(""); localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const login = async (email, password) => {
    const res = await AuthService.login(email, password);
    if (res?.token) {
      setToken(res.token);
      localStorage.setItem("token", res.token);
      setUser(res.user || null);
    }
    return res;
  };

  const logout = () => {
    setToken(""); setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthCtx.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);

// רכיב מסלול מוגן
export function Protected({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token)   return <div>Must login.</div>;
  return children;
}
