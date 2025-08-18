import { http } from "../http";

export const AuthService = {
  login(email, password) {
    return http("/auth/login", { method: "POST", data: { email, password } })
      .then(res => res?.data);   
  },

  verify2fa(code, userId) {
    return http("/auth/loginWithMFA", {
      method: "POST",
      data: { id: userId, twoFactorToken: code },
    }).then((res) => {
      const token = res?.jwtToken || res?.token;
      return { token, user: res?.user, account: res?.account };
    });
  },

  me(token) {
    return http("/auth/me", { token });
  },

  signup(payload) {
    return http("/auth/register", { method: "POST", data: payload });
  },

  adminGate(entryCode) {
    return http("/auth/admin-gate", { method: "POST", data: { entryCode } });
  },

  toggle2FA(userId) {
    return http("/auth/toggle-2fa", {
      method: "POST",
      data: { userId }
    }).then(res => res?.data);
  },

  getProfile() {
    return http("/auth/me", { method: "GET" })
      .then(res => res?.data);
  },
};
