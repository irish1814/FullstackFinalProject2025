import { http } from "../http.jsx";

export const AccountsService = {
  async getAccounts() {
    return http("/accounts/all", {
      token: localStorage.getItem("token"),
    });
  },

  async getAccountById(accountNumber) {
    return http(`/accounts/${accountNumber}`, {
      token: localStorage.getItem("token"),
    });
  },

    /**
   * Toggle account status (freeze/close)
   * @param {string} accountNumber - number of the account
   * @param {string} status - New status (e.g., 'frozen' or 'closed')
   */
  async toggleAccount(accountNumber, status) {
    return http(`/accounts/toggleAccount/${accountNumber}`, {
      method: "PUT",
      token: localStorage.getItem("token"),
      body: { status }, // make sure your `http` helper does JSON.stringify()
    });
  }


};
