import { http } from "../http.jsx";

export const CashActionsService = {
  // הפקדה
  deposit: ({ accountNumberSender, amount }) =>
    http("/cash/deposit", {             
      method: "POST",
      data: {
        accountNumberSender,
        transactionAmount: amount,
        type: "deposit",               
        description: "Cash deposit",
      },
      token: localStorage.getItem("token"),
    }),

  // משיכה
  withdraw: ({ accountNumberSender, amount }) =>
    http("/cash/withdraw", {           
      method: "POST",
      data: {
        accountNumberSender,
        transactionAmount: amount,
        type: "withdrawal",            
        description: "Cash withdrawal",
      },
      token: localStorage.getItem("token"),
    }),

  // הפקדת צ׳ק
  depositCheck: async (file, accountNumberSender) => {
  const formData = new FormData();
  formData.append("checkImage", file);
  formData.append("accountNumberSender", accountNumberSender); 

const res = await fetch("http://localhost:3000/api/check/deposit-check", {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Check deposit failed");
  
  return res.json();
},
};
