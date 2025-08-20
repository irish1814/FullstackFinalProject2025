import { http } from "../http.jsx";

export const LoansService = {
  list: (accountNumber) =>
    http(`/loans/${accountNumber}`, {
      token: localStorage.getItem("token"),
    }),

  request: ({ accountNumberSender, transactionAmount, termMonths, annualRate }) =>
    http("/transactions/create", {
      method: "POST",
      data: {
        accountNumberSender,
        transactionAmount,
        termMonths,
        annualRate,
        typeOfTransaction: "loan",
      },
      token: localStorage.getItem("token"),
    }),

  repay: ({ loanId, amount }) =>
    http(`/transactions/loans/${loanId}/repay`, {
      method: "POST",
      data: { amount },
      token: localStorage.getItem("token"),
    }),
};
