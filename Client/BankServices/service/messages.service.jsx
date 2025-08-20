import { http } from "../http.jsx";

export const MessagesService = {
  async getMessages() {
    return http("/contacts/all", {
      token: localStorage.getItem("token"),
    });
  },
}