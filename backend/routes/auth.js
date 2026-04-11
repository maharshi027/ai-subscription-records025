const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, monthlyBudget } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password, monthlyBudget: monthlyBudget || 40000 });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, monthlyBudget: user.monthlyBudget } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, monthlyBudget: user.monthlyBudget } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { monthlyBudget, savingsGoal, currency } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { monthlyBudget, savingsGoal, currency }, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
