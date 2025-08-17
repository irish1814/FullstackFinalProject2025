import { http } from "../http.jsx";

export const LoansService = {
  list: () => http("/loans"),
  request: ({ amount, termMonths }) =>
    http("/loans/request", { method: "POST", data: { amount, termMonths } }),
  repay: ({ loanId, amount }) =>
    http(`/loans/${loanId}/repay`, { method: "POST", data: { amount } })
};

