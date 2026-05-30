const express = require("express");
const Transaction = require("../models/Transaction");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const { month, year, category, type, limit = 50 } = req.query;
    const query = { user: req.user._id };
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }
    if (category) query.category = category;
    if (type) query.type = type;
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, amount, type, category, note } = req.body;
    if (!name || !amount || !type) {
      return res.status(400).json({
        error: "Name, amount, and type are required",
      });
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        error: "Amount must be a valid positive number",
      });
    }
    if (type !== "income" && type !== "expense") {
      return res.status(400).json({
        error: "Type must be either 'income' or 'expense'",
      });
    }
    const txn = await Transaction.create({ ...req.body, user: req.user._id });
    res.status(201).json({ transaction: txn });
  } catch (err) {
    const errorMsg = err.message || "Error creating transaction";
    res.status(400).json({ error: errorMsg });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const txn = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true },
    );
    if (!txn) return res.status(404).json({ error: "Transaction not found" });
    res.json({ transaction: txn });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const txn = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!txn) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/summary/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const txns = await Transaction.find({
      user: req.user._id,
      date: { $gte: start, $lte: end },
    });
    const income = txns
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = txns
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const byCategory = {};
    txns
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      });
    res.json({
      income,
      expense,
      savings: income - expense,
      savingsRate:
        income > 0 ? (((income - expense) / income) * 100).toFixed(1) : 0,
      byCategory,
      total: txns.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
