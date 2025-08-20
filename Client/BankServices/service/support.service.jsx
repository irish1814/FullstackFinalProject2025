import { http } from "../http.jsx";

export const SupportService = {
  async sendMessage(type, subject, message, contact) { 
    http("/contact/create", {
      method: "POST",
      token: localStorage.getItem("token"),
      data: { type, subject, message, contact }
    });
  },

  async getMessages() {
    return http("/contacts/all", {
      token: localStorage.getItem("token"),
    });
  },
};
