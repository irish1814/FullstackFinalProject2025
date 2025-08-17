import { http } from "../http";

export const AuthService = {
  login: (email, password) =>
    http("/auth/login", { method: "POST", data: { email, password } }),

  signup: (payload) =>
    http("/auth/register", { method: "POST", data: payload }),

  me: (token) => http("/auth/me", { token })
};
