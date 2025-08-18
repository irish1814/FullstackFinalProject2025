import { http } from "../http.jsx";

export const SavingsService = {
  list: () => http("/savings"),
  open: ({ name, monthlyAmount, termMonths, annualRate }) =>
    http("/savings/open", { method: "POST", data: { name, monthlyAmount, termMonths, annualRate } }),
  contribute: ({ savingId, amount }) =>
    http(`/savings/${savingId}/contribute`, { method: "POST", data: { amount } }),
  close: ({ savingId }) =>
    http(`/savings/${savingId}/close`, { method: "POST" }),
};
