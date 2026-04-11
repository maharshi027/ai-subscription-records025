const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { protect } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');
const router = express.Router();

router.use(protect);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Build financial context for AI
async function buildFinancialContext(userId) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const txns = await Transaction.find({ user: userId, date: { $gte: start, $lte: end } });
  const subs = await Subscription.find({ user: userId, isActive: true });

  const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const byCategory = {};
  txns.filter(t => t.type === 'expense').forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });
  const zombieSubs = subs.filter(s => {
    if (!s.lastUsedDate) return true;
    return (new Date() - s.lastUsedDate) / (1000 * 60 * 60 * 24) > 30;
  });
  const monthlySubCost = subs.reduce((s, sub) => {
    if (sub.billingCycle === 'monthly') return s + sub.amount;
    if (sub.billingCycle === 'yearly') return s + sub.amount / 12;
    if (sub.billingCycle === 'quarterly') return s + sub.amount / 3;
    return s;
  }, 0);

  return `
CURRENT MONTH FINANCIAL DATA:
- Income: ₹${income.toLocaleString('en-IN')}
- Expenses: ₹${expense.toLocaleString('en-IN')}
- Savings: ₹${(income - expense).toLocaleString('en-IN')}
- Savings Rate: ${income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0}%
- Spending by Category: ${JSON.stringify(byCategory, null, 2)}
- Total Active Subscriptions: ${subs.length}
- Monthly Subscription Cost: ₹${Math.round(monthlySubCost).toLocaleString('en-IN')}
- Zombie Subscriptions (unused 30+ days): ${zombieSubs.length} (${zombieSubs.map(s => s.name).join(', ') || 'none'})
- Recent transactions count: ${txns.length}
`;
}

// Chat endpoint (maintains conversation)
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }
    const financialContext = await buildFinancialContext(req.user._id);
    const systemPrompt = `You are FinanceAI, a personal finance advisor for Indian users. You are helpful, friendly, and give specific actionable advice.

${financialContext}

Guidelines:
- Always reference the user's actual financial data when giving advice
- Give specific amounts in ₹ (Indian Rupees)
- Suggest Indian-specific products: Zerodha, Groww, HDFC, SBI, NSE Nifty 50 index funds, ELSS, PPF, NPS
- Mention tax sections (80C, 80D, 24B) when relevant
- Keep responses concise but complete
- If asked about subscriptions, refer to their zombie subscriptions specifically
- Be encouraging and non-judgmental`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.slice(-10)
    });

    res.json({ reply: response.content[0].text, usage: response.usage });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'AI service error', message: err.message });
  }
});

// Auto-insights endpoint
router.get('/insights', async (req, res) => {
  try {
    const financialContext = await buildFinancialContext(req.user._id);
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `Based on this financial data, give me exactly 3 actionable insights as JSON array. Each insight must have: type (warning/tip/success), title (short), message (1-2 sentences), action (what to do). Return ONLY valid JSON array.\n\n${financialContext}`
      }]
    });
    let insights;
    try {
      const text = response.content[0].text.replace(/```json|```/g, '').trim();
      insights = JSON.parse(text);
    } catch {
      insights = [{ type: 'tip', title: 'Keep tracking', message: 'Add more transactions to get personalized AI insights.', action: 'Add a transaction' }];
    }
    res.json({ insights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categorize a transaction automatically
router.post('/categorize', async (req, res) => {
  try {
    const { description, amount } = req.body;
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Categorize this transaction. Description: "${description}", Amount: ₹${amount}. Reply with ONLY one word from: Food, Transport, Shopping, Bills, Health, Entertainment, Salary, Investment, Subscription, Other`
      }]
    });
    const category = response.content[0].text.trim();
    res.json({ category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
