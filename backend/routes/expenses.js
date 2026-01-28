const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const expenseController = require('../controller/expensesController');

router.use(auth);

router.post('/', expenseController.createExpense);
router.get('/group/:groupId', expenseController.getGroupExpenses);
router.get('/group/:groupId/balances', expenseController.getBalances);
router.get('/group/:groupId/settlements', expenseController.getSettlementSuggestions);

module.exports = router;