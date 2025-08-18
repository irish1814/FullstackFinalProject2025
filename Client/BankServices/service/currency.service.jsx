import { http } from "../http.jsx";

const EX_BASE = import.meta.env.VITE_EXCHANGE_API_URL; 

export const CurrencyService = {
  quote: ({ currencyToBuy, payingCurrency, amount }) =>
    http("/exchange/currencyExchange", {
      method: "POST",
      data: { currencyToBuy, payingCurrency, amount: Number(amount) },
      base: EX_BASE, 
    }),
};
