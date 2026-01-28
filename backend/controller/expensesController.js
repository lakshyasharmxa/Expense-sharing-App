const Expense = require('../models/expense');
const Group = require('../models/group');
const User = require('../models/User');

exports.createExpense = async (req, res) => {
  try {
    const { title, amount, date, payer, groupId, splitType, splitAmounts } = req.body;

    // Validate models
    if (!Group || typeof Group.findById !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }
    if (!Expense || typeof Expense !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    let splitAmong = [];
    
    if (splitType === 'equal') {
      const perPerson = amount / group.members.length;
      splitAmong = group.members.map(memberId => ({
        user: memberId,
        amount: perPerson
      }));
    } else if (splitType === 'custom' && splitAmounts) {
      splitAmong = splitAmounts.map(item => ({
        user: item.userId,
        amount: item.amount
      }));
    } else {
      return res.status(400).json({ message: 'Invalid split type' });
    }

    const expense = new Expense({
      title,
      amount,
      date: new Date(date),
      payer,
      group: groupId,
      splitAmong
    });

    await expense.save();
    await expense.populate('payer', 'name email');
    await expense.populate('splitAmong.user', 'name email');
    await expense.populate('group', 'name');

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: error.message || 'Failed to create expense' });
  }
};

exports.getGroupExpenses = async (req, res) => {
  try {
    if (!Expense || typeof Expense.find !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }
    if (!Group || typeof Group.findById !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }

    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('payer', 'name email')
      .populate('splitAmong.user', 'name email')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Get group expenses error:', error);
    res.status(500).json({ message: error.message || 'Failed to load expenses' });
  }
};

exports.getBalances = async (req, res) => {
  try {
    if (!Expense || typeof Expense.find !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }
    if (!Group || typeof Group.findById !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }
    if (!User || typeof User.findById !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }

    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('payer', 'name email')
      .populate('splitAmong.user', 'name email');

    const balances = {};
    group.members.forEach(memberId => {
      balances[memberId.toString()] = {
        user: memberId,
        totalPaid: 0,
        totalOwed: 0,
        balance: 0
      };
    });

    expenses.forEach(expense => {
      const payerId = expense.payer._id.toString();
      if (balances[payerId]) {
        balances[payerId].totalPaid += expense.amount;
      }

      expense.splitAmong.forEach(split => {
        const userId = split.user._id.toString();
        if (balances[userId]) {
          balances[userId].totalOwed += split.amount;
        }
      });
    });

    Object.keys(balances).forEach(userId => {
      balances[userId].balance = balances[userId].totalPaid - balances[userId].totalOwed;
    });

    // Populate user names
    const balancesArray = await Promise.all(
      Object.values(balances).map(async (balance) => {
        const user = await User.findById(balance.user);
        if (!user) {
          return null;
        }
        return {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          totalPaid: balance.totalPaid,
          totalOwed: balance.totalOwed,
          balance: balance.balance
        };
      })
    );

    // Filter out null values
    const validBalances = balancesArray.filter(b => b !== null);

    res.json(validBalances);
  } catch (error) {
    console.error('Get balances error:', error);
    res.status(500).json({ message: error.message || 'Failed to load balances' });
  }
};

exports.getSettlementSuggestions = async (req, res) => {
  try {
    if (!Expense || typeof Expense.find !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }
    if (!Group || typeof Group.findById !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }
    if (!User || typeof User.findById !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }

    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('payer', 'name email')
      .populate('splitAmong.user', 'name email');

    const balances = {};
    group.members.forEach(memberId => {
      balances[memberId.toString()] = {
        totalPaid: 0,
        totalOwed: 0,
        balance: 0
      };
    });

    expenses.forEach(expense => {
      const payerId = expense.payer._id.toString();
      if (balances[payerId]) {
        balances[payerId].totalPaid += expense.amount;
      }

      expense.splitAmong.forEach(split => {
        const userId = split.user._id.toString();
        if (balances[userId]) {
          balances[userId].totalOwed += split.amount;
        }
      });
    });

    Object.keys(balances).forEach(userId => {
      balances[userId].balance = balances[userId].totalPaid - balances[userId].totalOwed;
    });

    const creditors = [];
    const debtors = [];

    Object.keys(balances).forEach(userId => {
      const balance = balances[userId];
      if (balance.balance > 0.01) {
        creditors.push({ userId, amount: balance.balance });
      } else if (balance.balance < -0.01) {
        debtors.push({ userId, amount: Math.abs(balance.balance) });
      }
    });

    const suggestions = [];
    let creditorIndex = 0;
    let debtorIndex = 0;

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];

      const amount = Math.min(creditor.amount, debtor.amount);
      
      const creditorUser = await User.findById(creditor.userId);
      const debtorUser = await User.findById(debtor.userId);

      if (!creditorUser || !debtorUser) {
        break;
      }

      suggestions.push({
        from: {
          id: debtorUser._id,
          name: debtorUser.name
        },
        to: {
          id: creditorUser._id,
          name: creditorUser.name
        },
        amount: parseFloat(amount.toFixed(2))
      });

      creditor.amount -= amount;
      debtor.amount -= amount;

      if (creditor.amount < 0.01) creditorIndex++;
      if (debtor.amount < 0.01) debtorIndex++;
    }

    res.json(suggestions);
  } catch (error) {
    console.error('Get settlement suggestions error:', error);
    res.status(500).json({ message: error.message || 'Failed to load settlement suggestions' });
  }
};