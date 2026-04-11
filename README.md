# 💰 FinanceAI Dashboard

A full-stack personal finance management app with AI-powered insights, chatbot advisor, and the unique **Subscription Graveyard** feature — built with React, Node.js, MongoDB, and Claude AI.

---

## 🚀 Features

### Core
- ✅ User authentication (register/login with JWT)
- ✅ Add/delete income & expense transactions
- ✅ Monthly summary with charts (Pie + Bar via Recharts)
- ✅ Budget tracker with progress bar
- ✅ Spending breakdown by category

### AI-Powered (Claude API)
- ✅ AI Spending Insights — automatic analysis of your finances
- ✅ AI Chatbot — ask anything about your money (built into sidebar)
- ✅ Auto-categorize transactions — type a description, AI picks the category

### 🆕 Unique Feature: Subscription Graveyard
> **Real problem solved:** Users forget about recurring subscriptions and waste thousands of rupees every year on services they no longer use (average Indian user wastes ₹2,000–4,000/year).

- Tracks all your subscriptions (Netflix, Spotify, Adobe, etc.)
- Detects "zombie" subscriptions — services not used in 30+ days
- Shows exactly how much money is being wasted per month/year
- One-click "Mark as used" or "Cancel" actions
- Quick-add popular Indian/global subscriptions

---

## 📁 Project Structure

```
financeai/
├── backend/
│   ├── server.js           # Express app entry point
│   ├── .env.example        # Environment variables template
│   ├── models/
│   │   ├── User.js         # User schema
│   │   ├── Transaction.js  # Transaction schema
│   │   └── Subscription.js # Subscription + zombie detection
│   ├── routes/
│   │   ├── auth.js         # Register, login, profile
│   │   ├── transactions.js # CRUD + monthly summary
│   │   ├── ai.js           # Claude AI chat, insights, auto-categorize
│   │   ├── budget.js       # Budget status
│   │   └── subscriptions.js# Subscription CRUD + zombie detection
│   └── middleware/
│       └── auth.js         # JWT middleware
└── frontend/
    ├── public/index.html
    └── src/
        ├── App.js           # Routing
        ├── index.css        # Global dark theme styles
        ├── context/
        │   └── AuthContext.js  # Auth state management
        ├── components/
        │   └── Layout.js       # Sidebar + AI Chatbot widget
        └── pages/
            ├── Dashboard.js    # Main dashboard
            ├── Transactions.js # Transaction management
            ├── Subscriptions.js# Subscription Graveyard
            ├── Login.js
            └── Register.js
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+ — https://nodejs.org/
- MongoDB — https://www.mongodb.com/try/download/community (local) OR free Atlas cloud DB
- npm (comes with Node.js)

### Step 1: Clone & install backend

```bash
cd financeai/backend
npm install
```

### Step 2: Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
ANTHROPIC_API_KEY=sk-ant-...      # REQUIRED — from console.anthropic.com
MONGODB_URI=mongodb://localhost:27017/financeai   # REQUIRED
JWT_SECRET=any_long_random_string_here            # REQUIRED
```

### Step 3: Install frontend

```bash
cd ../frontend
npm install
```

### Step 4: Run the project

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev      # uses nodemon for auto-reload
# OR
npm start        # production mode
```
Server starts at: http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```
App opens at: http://localhost:3000

---

## 🔑 API Keys Required

| Service | Purpose | Required? | Get it from |
|---------|---------|-----------|-------------|
| **Anthropic** | AI chatbot + insights + auto-categorize | ✅ YES | https://console.anthropic.com/ |
| **MongoDB Atlas** | Cloud database (alternative to local) | Optional | https://mongodb.com/atlas |
| **Exchange Rate API** | Multi-currency support (future feature) | ❌ No | https://exchangeratesapi.io/ |

### Getting your Anthropic API Key:
1. Go to https://console.anthropic.com/
2. Sign up / log in
3. Navigate to **API Keys** → **Create Key**
4. Copy and paste into `.env` as `ANTHROPIC_API_KEY`

### Getting MongoDB Atlas (free cloud DB):
1. Go to https://mongodb.com/atlas
2. Create free account → New Project → Build a Cluster (free M0)
3. Add your IP to whitelist → Create DB user
4. Click **Connect** → **Drivers** → copy the connection string
5. Replace `MONGODB_URI` in `.env` with the Atlas connection string

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | List (filter by month/type/category) |
| POST | /api/transactions | Add transaction |
| DELETE | /api/transactions/:id | Delete transaction |
| GET | /api/transactions/summary/:year/:month | Monthly summary |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/chat | Chatbot (send message array) |
| GET | /api/ai/insights | Get 3 AI insights for current month |
| POST | /api/ai/categorize | Auto-categorize a transaction |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/subscriptions | List all + zombie detection |
| POST | /api/subscriptions | Add subscription |
| PUT | /api/subscriptions/:id/used | Mark as used (removes zombie) |
| PUT | /api/subscriptions/:id/cancel | Cancel subscription |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI | Anthropic Claude (claude-sonnet-4) |
| Auth | JWT + bcryptjs |
| Styling | Custom CSS (dark theme) |
| HTTP Client | Axios |

---

## 💡 Unique Selling Point — Subscription Graveyard

**The problem:** According to research, the average person forgets 2-4 active subscriptions at any given time. For Indian users this translates to ₹2,000–6,000 wasted per year.

**Existing apps don't solve this well** — they show you subscriptions but don't tell you which ones you actually use.

**Our solution:**
- Users mark when they last used a service via the "Mark as used" button
- After 30 days of no activity, a subscription becomes a "zombie" 🪦
- Dashboard shows a prominent warning with exact waste amount
- One-tap cancel button reduces friction to act

This is a genuine differentiator that can be highlighted in your project presentation.

---

## 🔮 Future Enhancements (for extra marks)

- [ ] Email alerts before subscription renewals
- [ ] Bank SMS parser (auto-import transactions from SMS)
- [ ] UPI transaction import
- [ ] Investment portfolio tracker (Zerodha API)
- [ ] PDF export of monthly reports
- [ ] Family/shared budget mode

---

## 🏃 Quick Demo Flow (for presentation)

1. Register a new account
2. Add a salary income (₹55,000)
3. Add 4-5 expense transactions
4. Watch AI Insights auto-generate
5. Open the chatbot and ask: "How can I save more?"
6. Go to Subscriptions → add Netflix, Spotify, Adobe CC
7. Set last used date to 40 days ago for Adobe CC
8. Watch the Zombie alert appear on dashboard
9. Show the cancel flow

---

Built with ❤️ using React + Node.js + Claude AI
