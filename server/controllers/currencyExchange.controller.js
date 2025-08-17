import axios from "axios";

// Currency Exchange Controller
export const currencyExchange = async (req, res, next) => {
    try {
        const { currencyToBuy, payingCurrency, amount } = req.body;

        // Basic validation
        if (!currencyToBuy || !payingCurrency || !amount) {
            const error = new Error("currencyToBuy, payingCurrency, and amount are required");
            error.statusCode = 400;
            throw error;
        }

        // Fetch exchange rates using payingCurrency as the base
        const response = await axios.get(
            `https://open.er-api.com/v6/latest/${payingCurrency.toUpperCase()}`
        );
        const data = response.data;

        if (data.result !== "success") {
            const error = new Error("Failed to fetch exchange rates");
            error.statusCode = 500;
            throw error;
        }

        const rates = data.rates;
        const rate = rates[currencyToBuy.toUpperCase()];

        if (!rate) {
            return res.status(400).json({
                message: `Exchange rate for ${currencyToBuy.toUpperCase()} not available`
            });
        }

        // Amount of payingCurrency needed to buy "amount" of currencyToBuy
        const cost = (amount / rate).toFixed(2);

        res.status(200).json({
            currencyToBuy: currencyToBuy.toUpperCase(),
            payingCurrency: payingCurrency.toUpperCase(),
            amount: amount,
            exchangeRate: rate,
            costInPayingCurrency: cost,
            provider: data.provider,
            lastUpdated: data.time_last_update_utc
        });
    } catch (err) {
        next(err);
    }
};
