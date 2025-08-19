import { http } from "../http.jsx";

export const SavingsService = {
  list: () => http("/transactions"),
  create: ({ accountNumberSender, amount, targetAmount, interestRate, termMonths }) =>
    http("/transactions", {
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
    }),
};
