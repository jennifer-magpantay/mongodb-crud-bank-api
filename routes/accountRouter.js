import express from 'express';

import controller from '../controllers/accountController.js';

const app = express();

app.get('/accounts/getAll/', controller.getAll);

app.post('/accounts/create/', controller.create);

app.patch('/accounts/deposit/', controller.deposit);

app.patch('/accounts/withdraw/', controller.withdraw);

app.get('/accounts/checkBalance/:agencia/:conta', controller.checkBalance);

app.delete('/accounts/remove/', controller.remove);

app.patch('/accounts/transfer/', controller.transfer);

app.get('/accounts/avgBalance/:agencia', controller.avgBalance);

app.get('/accounts/lowestBalances/:limit', controller.lowestBalances);

app.get('/accounts/highestBalances/:limit', controller.highestBalances);

app.get('/accounts/moveToPrivate/', controller.moveToPrivate);

export { app as accountRouter };