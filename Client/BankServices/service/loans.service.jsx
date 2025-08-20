import { http } from "../http.jsx";

export const LoansService = {
  list: (accountNumber) => http(`/loans/${accountNumber}`),

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
    }),

  repay: ({ loanId, amount }) =>
    http(`/transactions/loans/${loanId}/repay`, {
      method: "POST",
      data: { amount },
    }),
};
