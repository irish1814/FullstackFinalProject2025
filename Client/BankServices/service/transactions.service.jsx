import { http } from "../http.jsx";

export const TransactionsService = {
  async create(payload) {
    const res = await http("/transactions", { method: "POST", data: payload });
    return res?.data ?? null;
  },
  async list() {
    const res = await http("/transactions", { method: "GET" });
    return res?.data ?? [];
  }
};
