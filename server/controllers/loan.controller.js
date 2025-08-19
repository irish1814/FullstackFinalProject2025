import AccountModel  from "../models/Account.model.js";


export const getLoansByAccountNumber = async (req, res, next) => {
    try {
        const { id } = req.params;
        const account = await AccountModel.findOne( { accountNumber: id });
        if (!account) {
            const error = new Error("Account not found");
            error.status = 404;
            throw error;
        }

        res.status(200).send( {
            success: true,
            data: {
                loans: account.loans,
            }
        });

    } catch (error) {
        next(error);
    }
}

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
