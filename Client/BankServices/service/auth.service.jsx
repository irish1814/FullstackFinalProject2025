import { http } from "../http.jsx";

export const AuthService = {
  login: async (email, password) => {
    const res = await http("/auth/login", { method: "POST", data: { email, password } });
    if (res?.token) localStorage.setItem("token", res.token);
    if (res?.user?.email) localStorage.setItem("email", res.user.email);
    return res;
  },

  me: async () => {
    return await http("/auth/me"); 
  },

  signup: async (payload) => {
    return await http("/auth/signup", { method: "POST", data: payload });
  },
};
