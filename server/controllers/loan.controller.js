// loansController.js
const { AccountModel } = require("../models/Account.model");

// Update all loans for a given user
const updateLoansMonthly = async (userId) => {
    const account = await AccountModel.findOne( { userId: userId })

    account.loans.forEach(loan => {
        if (loan.status !== 'closed') {
            const monthlyPayment = loan.monthlyPayment + loan.monthlyPayment * loan.interestRate;
            if (account.balance >= monthlyPayment) {
                account.balance -= monthlyPayment;
                loan.balance -= loan.monthlyPayment;

                if (loan.balance <= 0) {
                    loan.balance = 0;
                    loan.isPaid = true;
                }
            } else {
                account.status = "frozen";
            }
        }
    });

    await account.save();
};

module.exports = {
    updateLoansMonthly
};
