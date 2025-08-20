import { http } from "../http.jsx";

export const SavingsService = {
  list: () => http("/api/transactions"),  
  create: ({ accountNumberSender, amount, targetAmount, interestRate, termMonths }) =>
    http("/api/transactions", {          
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
