import { http } from "../http.jsx";

export const SupportService = {
  async sendMessage(id, problemDescription) { 
    http("/contact/create", {
      method: "POST",
      token: localStorage.getItem("token"),
      data: { id, problemDescription }
    });
  },

  async getMessages() {
    return http("/contacts/all", {
      token: localStorage.getItem("token"),
    });
  },
};
