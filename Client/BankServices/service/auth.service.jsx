import { http } from "../http";

export const AuthService = {
  async login(email, password) {
    const res = await http("/auth/login", { method: "POST", data: { email, password } });
    return res?.data ?? null;  
  },

  async verify2fa(code, userId) {
    const res = await http("/auth/loginWithMFA", {
      method: "POST",
      data: { id: userId, twoFactorToken: code },
    });
    return res?.data ?? null;  
  },

  async me(token) {
    return http("/auth/me", { token }).then(res => res?.data ?? null);
  },

  async signup(payload) {
    const res = await http("/auth/register", { method: "POST", data: payload });
    return res?.data ?? null;  
  },

  async adminGate(entryCode) {
    const res = await http("/auth/admin-gate", { method: "POST", data: { adminKey: entryCode, role: "admin" } });
    return res?.data ?? null;  
  },

  async toggle2FA(id, disable=false) {
    const res = await http("/auth/toggleMFA", { 
      method: "POST", 
      data: { 
        id: id,
        disable: disable
      },
      token: localStorage.getItem("token"),
    });
    return res?.data ?? null;  
  },

  async getProfile() {
    const res = await http("/auth/me", { method: "GET" });
    return res?.data ?? null;
  },
};
