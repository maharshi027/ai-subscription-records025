const express = require('express');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// Get budget status for current month
router.get('/status', async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const txns = await Transaction.find({ user: req.user._id, type: 'expense', date: { $gte: start, $lte: end } });
    const totalSpent = txns.reduce((s, t) => s + t.amount, 0);
    const budget = req.user.monthlyBudget || 40000;
    const remaining = budget - totalSpent;
    const pct = Math.round((totalSpent / budget) * 100);
    const byCategory = {};
    txns.forEach(t => { byCategory[t.category] = (byCategory[t.category] || 0) + t.amount; });
    res.json({ budget, spent: totalSpent, remaining, percentUsed: pct, byCategory, isOverBudget: totalSpent > budget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update budget
router.put('/', protect, async (req, res) => {
  try {
    const { monthlyBudget } = req.body;
    req.user.monthlyBudget = monthlyBudget;
    await req.user.save();
    res.json({ monthlyBudget: req.user.monthlyBudget });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
