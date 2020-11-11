import { Account } from '../models/accountModel.js'

//app.get('/accounts/getAll/', controller.getAll);
const getAll = async (req, res) => {
    try {
        const account = await Account.find({}, { _id: 0, agencia: 1, conta: 1, name: 1, balance: 1 })
        res.send(account);
    } catch (error) {
        res.status(500).send(error);
    }
}

//app.post('/accounts/create/', controller.create);
const create = async (req, res) => {
    const input = req.body;
    try {
        const account = new Account(input);
        await account.save();
        res.send(account);
    } catch (error) {
        res.status(500).send(error);
    }
}

//app.patch('/account/deposit/', controller.deposit);
// for this operation use as params: agency, account and value 
const deposit = async (req, res) => {
    const input = req.body;
    try {
        // pass a validation to check if the account exists
        const account = await Account.updateOne(
            { agencia: parseInt(input.agencia), conta: parseInt(input.conta) },
            { $inc: { balance: parseInt(input.valor) } },
            { _id: 0 }
        );
        // ERROR to print the result - but function is ok.
        res.send(account);
    } catch (error) {
        res.status(status).send("Operation failed. Error to proceed with", error);
    }
};

//app.patch('/account/withdraw/', controller.withdraw); - ERROR!
const withdraw = async (req, res) => {
    const input = req.body;
    // input = { agencia, conta, valor };
    const newValue = parseInt(input.valor) + 1;
    try {
        const account = await Account.updateOne(
            { agencia: parseInt(input.agencia), conta: parseInt(input.conta) },
            { $inc: { balance: balance - newValue } },
            { _id: 0 }
        );
        //    PS: COO SUBTRAIR/DECREEMNTAR??
        res.send(account);
    } catch (error) {
        res.status(status).send("Operation failed. Error to proceed with", error);
    }
};

//app.get('/account/checkBalance/:agencia/:conta', controller.checkBalance);
const checkBalance = async (req, res) => {
    const agencia = req.params.agencia;
    const conta = req.params.conta;
    try {
        let account = await Account.find({ agencia: parseInt(agencia), conta: parseInt(conta) }, { _id: 0, agencia: 1, conta: 1, name: 1, balance: 1 })
        res.send(account);
    } catch (error) {
        res.status(500).send(`Error to check the balance account from agency ${agency} , account ${account}`, error);
    }
};

// app.delete('/account/remove/', controller.remove);
// use as params: agency and account numbers 
const remove = async (req, res) => {
    const input = req.body;
    try {
        let account = await Account.remove({ conta: parseInt(input.conta) });
        console.log(account);
        let remainAcc = await Account.find({
            agencia: parseInt(input.agencia),
        }).count();
        res.send({ totalAccounts: remainAcc });
    } catch (error) {
        res.status(500).send('Erro ao excluir a conta ' + error);
    }
};

//app.patch('/account/transfer/', controller.transfer);
const transfer = async (req, res) => {

};

// app.get('/account/avgBalance/:agencia', controller.avgBalance);
const avgBalance = async (req, res) => {
    // get the params values from body
    const input = req.params.agencia;
    try {
        // missing validation
        const avg = await Account.aggregate([
            {
                $match: {
                    agencia: parseInt(input),
                },
            },
            {
                $group: {
                    _id: "$agencia",
                    media: { $avg: "$balance", },
                }
            },
            {
                $project: {
                    _id: 0,
                    media: 1,
                },
            }
        ])
        if (avg.length === 0) {
            throw new Error("Agency not found")
        }
        res.send(avg);
    } catch (error) {
        res.status(500).send("Error to finish the operation", error);
    }
};

//app.get('/accounts/lowestBalances/:limit', controller.lowestBalances);
const lowestBalances = async (req, res) => {
    const limit = req.params.limit;
    try {
        // searching through all data using find() + filters
        const account = await Account.find({}, {
            _id: 0, agencia: 1, balance: 1, name: 1,
        })
            // then, passing the limit and sort 
            .limit(parseInt(limit))
            .sort({ balance: 1 });
        // add a condition
        if (account.length === 0) {
            throw new Error("There are no clients found")
        }
        res.send(account);
    } catch (error) {
        res.status(500).send(error);
    }
};

// app.get('/account/highestBalances/:limit', controller.topByBalanceHighest);
const highestBalances = async (req, res) => {
    const limit = req.params.limit;
    try {
        // searching through all data using find() + filters
        const account = await Account.find({}, {
            _id: 0, agencia: 1, balance: 1, name: 1,
        })
            // then, passing the limit and sort 
            .limit(parseInt(limit))
            .sort({ balance: -1 });
        // add a condition
        if (account.length === 0) {
            throw new Error("There are no clients found")
        }
        res.send(account);
    } catch (error) {
        res.status(500).send(error);
    }
};

// app.get('/account/moveToPrivate/', controller.moveToPrivate);
const moveToPrivate = async (req, res) => {
    try {
        let privateAccounts = await Account.aggregate([
            {
                $group: {
                    _id: "$agencia",
                    balance: { $max: "$balance" },
                },
            },
        ]);
        // add a for of loop to read the list and to save each item into a new list of acccounts
        for (const privateAccount of privateAccounts) {
            const { _id, balance } = privateAccount;
            let newListAccount = await Account.findOne({
                agencia: _id,
                balance,
            });
            // setting the private agency
            newListAccount.agencia = 99;
            // and save it
            newListAccount.save()
        }
        privateAccounts = await Account.find({ agencia: 99, }).sort({ balance: -1 });
        res.send(privateAccounts);
    } catch (error) {
        res.status(500).send(error);
    }
};

export default {
    getAll, create, deposit, withdraw, checkBalance, remove, transfer, avgBalance, lowestBalances, highestBalances, moveToPrivate
};