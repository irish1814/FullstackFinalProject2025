import { http } from "../http.jsx";

export const CashActionsService = {
  // הפקדה
  deposit: ({ accountNumberSender, amount }) =>
    http("/transactions/create", {
      method: "POST",
      data: {
        accountNumberSender,
        transactionAmount: amount,
        typeOfTransaction: "deposit",
        description: "Cash deposit",
      },
      token: localStorage.getItem("token"),
    }),

  // משיכה
  withdraw: ({ accountNumberSender, amount }) =>
    http("/transactions/create", {
      method: "POST",
      data: {
        accountNumberSender,
        transactionAmount: amount,
        typeOfTransaction: "withdraw",
        description: "Cash withdrawal",
      },
      token: localStorage.getItem("token"),
    }),

  // הפקדת צ׳ק
  depositCheck: async (file, accountNumberSender) => {
    const formData = new FormData();
    formData.append("checkImage", file);

    const res = await fetch("http://localhost:3000/api/check-deposit", {
  method: "POST",
  body: formData,
});

    if (!res.ok) throw new Error("Check deposit failed");
    const data = await res.json();

    // יוצרים גם רשומת טרנזקציה
    await http("/transactions/create", {
      method: "POST",
      data: {
        accountNumberSender,
        typeOfTransaction: "check-deposit",
        transactionAmount: 0,
        description: `Check deposit - ${data.filename}`,
      },
      token: localStorage.getItem("token"),
    });

    return data;
  },
};
