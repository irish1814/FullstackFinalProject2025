import { http } from "../http.jsx";

export const SavingsService = {
  list: (accountNumber) =>
    http(`/savings/${accountNumber}`, {
      token: localStorage.getItem("token"),
    }),

  create: ({ accountNumberSender, amount, targetAmount, interestRate, termMonths }) =>
    http("/transactions/create", {
      method: "POST",
      data: {
        accountNumberSender,
        typeOfTransaction: "saving",
        transactionAmount: amount,
        savingPayload: {
          targetAmount,
          interestRate,
          termMonths,
        },
      },
      token: localStorage.getItem("token"),
    }),
};
