import { http } from "../http.jsx"; 

export const TransactionsService = {
  async list(accountNumber) {
    const res = await http(`/transactions/account/${accountNumber}`, {
      token: localStorage.getItem("token"),
    });
    return res.data || res || [];
  },

  async create(data) {
    return http("/transactions/create", {
      method: "POST",
      data,
      token: localStorage.getItem("token"),
    });
  },
};
