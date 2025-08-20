import React from "react";
import AppRouter from "../router.jsx";      
import { AuthProvider } from "../AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
