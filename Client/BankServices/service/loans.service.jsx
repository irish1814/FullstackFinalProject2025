import { http } from "../http.jsx";

export const LoansService = {
  list: async (accountNumber) => {
    const acc = await http(`/accounts/${accountNumber}`);
    return acc.loans || [];
  },

  request: ({ accountNumberSender, amount, termMonths, annualRate }) =>
    http("/transactions", {
      method: "POST",
      data: {
        accountNumberSender,
        typeOfTransaction: "loan",
        transactionAmount: amount,
        loanPayload: {
          termMonths,
          interestRate: annualRate,
          monthlyPayment: amount / termMonths,
        },
      },
    }),

  repay: ({ accountNumberSender, loanId, amount }) =>
    http("/transactions", {
      method: "POST",
      data: {
        accountNumberSender,
        typeOfTransaction: "repayLoan", 
        transactionAmount: amount,
        loanPayload: { loanId },
      },
    }),
};
