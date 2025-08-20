import { http } from "../http.jsx";

export const AccountsService = {
  async getAccounts() {
    return http("/accounts", {
      token: localStorage.getItem("token"),
    });
  },

  async getAccountById(accountNumber) {
    return http(`/accounts/${accountNumber}`, {
      token: localStorage.getItem("token"),
    });
  },
};
