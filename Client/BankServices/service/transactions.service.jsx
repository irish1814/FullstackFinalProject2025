import { http } from "../http.jsx";

export const TransactionsService = {
  list: ({ accountId, type = "all", page = 1, limit = 20 }) =>
    http(`/transactions?accountId=${accountId}&type=${type}&page=${page}&limit=${limit}`),

  transfer: ({ fromAccountId, toAccountNumber, amount, note }) =>
    http("/transactions/transfer", {
      method: "POST",
      data: { fromAccountId, toAccountNumber, amount, description: note }
    })
};
