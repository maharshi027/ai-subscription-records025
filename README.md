# 💰 FinanceAI Dashboard

A full-stack personal finance management app with AI-powered insights, intelligent chatbot advisor, and the unique **Subscription Graveyard** feature — built with React, Node.js, MongoDB, and Claude AI.

### 🎯 Mission

**Empower individuals to take control of their finances using artificial intelligence.** FinanceAI combines real-time transaction tracking with Claude AI to provide intelligent, personalized financial advice and helps identify hidden money-wasting patterns.

---

## 🚀 Features & Capabilities

### Core Finance Management

- ✅ **Secure Authentication** — Register/login with JWT tokens and bcryptjs password hashing
- ✅ **Transaction Management** — Record income & expense transactions with categories and notes
- ✅ **Visual Analytics** — Pie and bar charts showing spending patterns by category and month
- ✅ **Budget Tracking** — Set monthly budget and get real-time progress alerts
- ✅ **Monthly Summaries** — Automatic calculation of income, expenses, savings rate, and category breakdown

### 🤖 AI-Powered Intelligence (Claude Sonnet 4)

- ✅ **AI Spending Insights** — Claude analyzes your complete financial data and generates 3 actionable insights automatically
- ✅ **Interactive AI Chatbot** — Ask anything about your finances, budgeting strategies, or investment tips directly in the app sidebar
- ✅ **Intelligent Auto-Categorization** — Describe a transaction and Claude instantly suggests the category (no manual tagging needed)
- ✅ **Indian Finance Knowledge** — AI advisor recommends Indian investment products (Zerodha, Groww, ELSS, PPF, NPS, Nifty 50)
- ✅ **Tax Optimization Tips** — Chatbot references tax sections (80C, 80D, 24B) and provides relevant advice

### 🆕 Unique Feature: Subscription Graveyard

> **Real problem solved:** Users forget about recurring subscriptions and waste thousands of rupees every year on services they no longer use. Average Indian user wastes ₹2,000–6,000+ annually.

- **Zombie Detection** — Automatically identifies subscriptions not used in 30+ days
- **Wasted Money Alert** — Dashboard shows exactly how much money is being wasted on unused subscriptions per month/year
- **Easy Subscription Tracking** — Trace all subscriptions (Netflix, Spotify, Adobe, AWS, etc.) from one place
- **Quick Actions** — Mark as used or cancel with one click
- **Renewal Reminders** — Get notified before subscriptions renew
- **Category Organization** — Sort subscriptions by type (Streaming, Music, Software, Gaming, Cloud, etc.)

### 📊 New Enhanced Features (v2.0)

- **Real-time Savings Rate Calculator** — Shows your savings percentage dynamically
- **Spending by Category Breakdown** — Top 5 expense categories with visual progress bars
- **Transaction History with Filters** — Filter by month, year, type, and category
- **AI Error-Free Insights** — Claude generates warnings when spending spikes, success tips when you save, and recommendations based on your actual data
- **Auto-Sync Financial Data** — All your transactions are instantly analyzed for patterns
- **Recurring Transaction Support** — Mark transactions as daily, weekly, monthly, or yearly recurring

---

## 🔁 How AI Solves Finance Problems

### Problem 1: Information Overload

**Before:** Users lose track of spending across categories, miss improvement opportunities, overwhelmed by raw data.  
**After:** Claude AI automatically analyzes all your transactions and provides 3 specific, actionable insights tailored to your habits.

### Problem 2: Manual Categorization is Tedious

**Before:** Users had to manually tag each transaction, leading to inconsistency and abandoned tracking.  
**After:** Describe a transaction once, AI automatically categorizes it. Learn your spending patterns faster.

### Problem 3: Lack of Financial Guidance

**Before:** Users have generic budget advice with no context to their actual spending.  
**After:** Chat with FinanceAI about your specific situation. Get personalized recommendations for saving, investing, tax optimization—all based on your real financial data.

### Problem 4: Hidden Subscription Waste (Unique to FinanceAI)

**Before:** Users couldn't identify forgotten subscriptions. Average wasted: ₹2,000–6,000/year.  
**After:** FinanceAI's "Subscription Graveyard" shows unused subscriptions and exact monthly waste. One-click cancellation saves money automatically.

### Problem 5: No Proactive Financial Alerts

**Before:** No notifications about budget overspending or unusual transactions until month-end.  
**After:** Real-time budget progress bar, AI warnings when spending gets risky, and success messages when you hit savings goals.

---

## 📁 Project Structure

```
financeai/
├── backend/
│   ├── server.js           # Express app entry point + rate limiting
│   ├── .env.example        # Environment variables template
│   ├── config/
│   │   └── Database.js     # MongoDB connection setup
│   ├── models/
│   │   ├── User.js         # User schema + auth
│   │   ├── Transaction.js  # Transaction schema + indexing
│   │   └── Subscription.js # Subscription model + zombie detection
│   ├── routes/
│   │   ├── auth.js         # Register, login, profile update
│   │   ├── transactions.js # CRUD + filters + monthly summary
│   │   ├── ai.js           # Claude AI: chat, insights, auto-categorize
│   │   ├── budget.js       # Budget status + management
│   │   └── subscriptions.js# Subscription CRUD + zombie flag
│   └── middleware/
│       ├── auth.js         # JWT verification middleware
│       └── rateLimit.js    # API rate limiting (100 req/15min, AI: 20 req/min, Auth: 5 attempts/15min)
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx              # Main routing + Protected routes
        ├── index.css            # Dark theme + responsive design
        ├── context/
        │   └── AuthContext.jsx  # Global auth state + API client
        ├── components/
        │   └── Layout.jsx       # Sidebar navigation + AI Chatbot widget
        └── pages/
            ├── Dashboard.jsx     # Home: summary + AI insights + add transaction
            ├── Transactions.jsx  # List + filters + auto-categorize
            ├── Subscriptions.jsx # Subscription Graveyard
            ├── Login.jsx
            └── Register.jsx
```

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js v18+** — https://nodejs.org/
- **MongoDB** — https://www.mongodb.com/try/download/community (local) OR free Atlas cloud DB
- **npm** (comes with Node.js)
- **Anthropic API Key** — https://console.anthropic.com (for AI features)

### Step 1: Clone & install backend

```bash
cd financeai/backend
npm install
```

### Step 2: Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
ANTHROPIC_API_KEY=sk-ant-...                    # Get from https://console.anthropic.com/
MONGODB_URI=mongodb://localhost:27017/financeai  # Local or Atlas connection string
JWT_SECRET=your_super_secret_key_here_min_32    # Random 32+ character string
PORT=5000
FRONTEND_URL=http://localhost:3000,http://localhost:3001
```

### Step 3: Install & run backend

```bash
cd financeai/backend
npm install
npm run dev        # Starts with nodemon auto-reload on port 5000
```

Expected output:

```
✅ MongoDB connected: localhost:27017
🚀 Server running on http://localhost:5000
```

### Step 4: Install & run frontend

```bash
cd financeai/frontend
npm install
npm run dev        # Starts on http://localhost:3000 (or next available port)
```

Open browser and visit: **http://localhost:3000**

---

## 🔑 API Keys & Configuration

### Anthropic API Key (REQUIRED for AI)

1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy the key starting with `sk-ant-`
6. Paste into your `.env` as `ANTHROPIC_API_KEY`

### MongoDB Setup (Pick one)

**Option A: Local MongoDB** (easiest for development)

```bash
# Windows (if installed)
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

Connection string in `.env`:

```
MONGODB_URI=mongodb://localhost:27017/financeai
```

**Option B: MongoDB Atlas** (cloud, free tier available)

1. Go to https://mongodb.com/atlas
2. Create free account → New Project → Build Cluster (M0 free tier)
3. Add your IP to Network Access (or 0.0.0.0/0 for anywhere)
4. Create Database User with password
5. Click Connect → Drivers → Node.js → Copy connection string
6. Replace `<username>`, `<password>`, and `financeai` in your `.env`:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financeai?retryWrites=true&w=majority
```

---

## 📡 API Endpoints Reference

### Authentication

| Method | Endpoint             | Request                                  | Response        |
| ------ | -------------------- | ---------------------------------------- | --------------- |
| POST   | `/api/auth/register` | `{name, email, password, monthlyBudget}` | `{token, user}` |
| POST   | `/api/auth/login`    | `{email, password}`                      | `{token, user}` |
| GET    | `/api/auth/me`       | Headers: `Authorization: Bearer token`   | `{user}`        |
| PUT    | `/api/auth/profile`  | `{monthlyBudget, savingsGoal, currency}` | `{user}`        |

### Transactions

| Method | Endpoint                                                                  | Purpose                                                |
| ------ | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| GET    | `/api/transactions?month=1&year=2025&category=Food&type=expense&limit=50` | List with filters                                      |
| POST   | `/api/transactions`                                                       | Add new transaction                                    |
| PUT    | `/api/transactions/:id`                                                   | Update transaction                                     |
| DELETE | `/api/transactions/:id`                                                   | Delete transaction                                     |
| GET    | `/api/transactions/summary/2025/1`                                        | Monthly summary (income, expense, savings, byCategory) |

### AI Features

| Method | Endpoint             | Purpose                                                       |
| ------ | -------------------- | ------------------------------------------------------------- |
| POST   | `/api/ai/chat`       | Send message to chatbot: `{messages: [{role, content}, ...]}` |
| GET    | `/api/ai/insights`   | Get 3 AI insights for current month                           |
| POST   | `/api/ai/categorize` | Auto-categorize: `{description, amount}` → `{category}`       |

### Subscriptions (Zombie Detector)

| Method | Endpoint                        | Purpose                                         |
| ------ | ------------------------------- | ----------------------------------------------- |
| GET    | `/api/subscriptions`            | List all + zombie detection + waste calculation |
| POST   | `/api/subscriptions`            | Add subscription                                |
| PUT    | `/api/subscriptions/:id/used`   | Mark as used (updates lastUsedDate)             |
| PUT    | `/api/subscriptions/:id/cancel` | Cancel subscription                             |
| DELETE | `/api/subscriptions/:id`        | Delete subscription                             |

### Budget

| Method | Endpoint             | Purpose                                            |
| ------ | -------------------- | -------------------------------------------------- |
| GET    | `/api/budget/status` | Current month budget status + spending by category |
| PUT    | `/api/budget`        | Update monthly budget: `{monthlyBudget}`           |

---

## 🎨 Tech Stack & Architecture

| Component          | Technology                  | Reason                                               |
| ------------------ | --------------------------- | ---------------------------------------------------- |
| **Frontend**       | React 18 + React Router v6  | Modern SPA with client-side routing                  |
| **Styling**        | Custom CSS (dark theme)     | Fast, lightweight, no build overhead                 |
| **Charts**         | Recharts                    | Beautiful, responsive financial charts               |
| **Backend**        | Node.js + Express.js        | Fast, scalable async I/O                             |
| **Database**       | MongoDB + Mongoose          | Flexible schema for user data                        |
| **AI**             | Claude Sonnet 4 (Anthropic) | Best-in-class financial reasoning + Indian knowledge |
| **Authentication** | JWT + bcryptjs              | Secure token-based auth                              |
| **Rate Limiting**  | express-rate-limit          | Protect against API abuse                            |
| **HTTP Client**    | Axios                       | Promise-based requests                               |

---

## 💡 Why FinanceAI is Different

### Standard Finance Apps

❌ Show you transactions  
❌ You manually categorize  
❌ You figure out insights yourself  
❌ You forget subscription cancellations

### FinanceAI

✅ Auto-categorize with AI  
✅ AI generates insights automatically  
✅ Chat with AI about your exact situation  
✅ **Subscription Graveyard alerts you to waste**  
✅ Personalized India-focused financial advice  
✅ Real-time budget warnings

---

## 🧠 How Claude AI Works in FinanceAI

### 1. Building Financial Context

When you chat or ask for insights, Claude gets:

- Your complete transaction history (current month)
- Income, expenses, savings rate, breakdown by category
- Active subscriptions + renewal dates + last used dates
- Your monthly budget vs actual spending

### 2. Prompt Engineering for Indian Financial Context

Claude receives a carefully crafted system prompt that includes:

- Your actual financial numbers (₹ amounts in Indian Rupees)
- Context about Indian financial products (Zerodha, ELSS, PPF, NPS, Nifty 50)
- Tax knowledge (sections 80C, 80D, 24B)
- Spending by category with real amounts

### 3. Three Types of AI Analysis

**Type 1: Auto-Categorization**

```
Input: "Paid for dinner at Barbeque Nation"
Claude Output: "Food"
```

**Type 2: Actionable Insights** (3 per month)
Claude analyzes your data and generates:

- Warning insights (spending spike in category X)
- Success insights (savings rate improved to 25%!)
- Tips (suggestions based on your patterns)

Example: "You spent ₹5,200 on subscriptions this month. Cancel Adobe CC to save ₹599/month!"

**Type 3: Interactive Chatbot**
You ask: "Should I invest in mutual funds?"  
Claude responds with: Indian-specific fund recommendations, tax implications, how much to invest based on your current savings rate

---

## 🔐 Security & Rate Limiting

- **JWT Authentication** — Secure token-based auth, tokens expire in 7 days
- **Password Hashing** — bcryptjs with salt rounds (12)
- **Rate Limiting:**
  - General API: 100 requests/15 minutes
  - AI endpoints: 20 requests/minute (to manage Claude API costs)
  - Auth endpoints: 5 attempts/15 minutes (brute force protection)
- **Protected Routes** — All transaction/subscription endpoints require valid JWT

---

## 🚀 Performance Optimizations

- **Database Indexing** — Transactions indexed by (user_id, date) and (user_id, category)
- **Request Filtering** — Limit returned transactions to last 50 by default
- **Subscription Zombie Detection** — Calculated in memory (daysSinceUse = today - lastUsedDate)
- **Lazy Insights Loading** — AI insights load after page render (non-blocking)
- **Frontend Caching** — User context stored in localStorage

---

## 📚 Learning Outcomes & Skills Demonstrated

This project showcases:

- **Full-stack development** (frontend + backend)
- **Database design & indexing** (transactions, subscriptions)
- **API design & REST principles**
- **Authentication & security** (JWT, bcryptjs)
- **Third-party API integration** (Anthropic Claude)
- **Real-world problem solving** (Subscription Graveyard addresses actual user pain)
- **UI/UX thinking** (dark theme, responsive, accessible)
- **AI/ML application** (prompt engineering, context awareness)

---

## ⚡ Quick Start (5 minutes)

```bash
git clone <repo>
cd financeai/backend
npm install
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env
npm run dev

cd ../frontend
npm install
npm start
```

Navigate to `http://localhost:3000` → Register → Add transactions → See AI insights!

---

## 🤝 Contributing

This is a personal project. Feel free to fork and customize for learning!

Improvement ideas:

- Add dark/light theme toggle
- Email notifications for zombie subscriptions
- Transaction import from bank statements
- Multi-user shared budgets

---

## 📄 License

MIT — Feel free to use for learning and personal projects.

---

## ❓ FAQ

**Q: Do I need to buy anything?**  
A: No! All tools are free. Anthropic gives free API credits for new accounts. MongoDB has a free tier.

**Q: Is my data private?**  
A: Yes. All data is encrypted in transit (Bearer tokens) and stored in MongoDB. Claude AI only gets context when you explicitly ask for insights/chat.

**Q: Can I use this as a learning project for college?**  
A: Absolutely! This is perfect for demonstrating full-stack development, AI integration, and problem-solving.

**Q: How does the Subscription Graveyard detect unused subscriptions?**  
A: When you mark a subscription as "used", it updates `lastUsedDate`. If 30+ days pass without an update, it's flagged as a zombie 🪦

**Q: Can I integrate real banking APIs?**  
A: Yes! Add Plaid or your bank's API to auto-import transactions (future enhancement).

---

## 📞 Support & Feedback

Found a bug? Have a feature idea? Open an issue or reach out!

---

**Happy tracking! Let your finances be intelligent. 🤖💰**

---

Built with ❤️ using React + Node.js + Claude AI
