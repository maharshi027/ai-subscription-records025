import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';

const CAT_COLORS = {
  Food: '#10b981', Transport: '#3b82f6', Shopping: '#ec4899', Bills: '#f59e0b',
  Health: '#8b5cf6', Entertainment: '#f97316', Salary: '#22c55e', Investment: '#06b6d4',
  Subscription: '#6366f1', Other: '#64748b'
};

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

export default function Dashboard() {
  const { user } = useAuth();
  const now = new Date();
  const [summary, setSummary] = useState({ income: 0, expense: 0, savings: 0, savingsRate: 0, byCategory: {} });
  const [recent, setRecent] = useState([]);
  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', amount: '', type: 'expense', category: 'Food', note: '' });
  const [adding, setAdding] = useState(false);
  const [subAlert, setSubAlert] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [sumRes, txnRes, subRes] = await Promise.all([
        axios.get(`/api/transactions/summary/${now.getFullYear()}/${now.getMonth() + 1}`),
        axios.get('/api/transactions?limit=5'),
        axios.get('/api/subscriptions')
      ]);
      setSummary(sumRes.data);
      setRecent(txnRes.data.transactions);
      if (subRes.data.zombieCount > 0) setSubAlert(subRes.data);
    } catch (err) { console.error(err); }
  }, []);

  const loadInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const res = await axios.get('/api/ai/insights');
      setInsights(res.data.insights);
    } catch { setInsights([{ type: 'tip', title: 'Keep going', message: 'Add transactions to unlock AI insights.', action: 'Add a transaction' }]); }
    setInsightsLoading(false);
  }, []);

  useEffect(() => { loadData(); loadInsights(); }, []);

  const addTxn = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await axios.post('/api/transactions', { ...form, amount: Number(form.amount) });
      setForm({ name: '', amount: '', type: 'expense', category: 'Food', note: '' });
      await loadData();
    } catch (err) { alert(err.response?.data?.error || 'Error adding transaction'); }
    setAdding(false);
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const savRate = Number(summary.savingsRate) || 0;
  const budget = user?.monthlyBudget || 40000;
  const budgetPct = Math.min(100, Math.round((summary.expense / budget) * 100));
  const catData = Object.entries(summary.byCategory || {}).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const ICONS = { Food: '🍔', Transport: '🚗', Shopping: '🛍', Bills: '💡', Health: '💊', Entertainment: '🎬', Salary: '💼', Investment: '📈', Subscription: '🔄', Other: '📌' };
  const insightColors = { warning: '#f59e0b', success: '#10b981', tip: '#6366f1', danger: '#ef4444' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 2 }}>Good {now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋</h1>
          <div style={{ fontSize: 13, color: '#64748b' }}>{now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Savings rate</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: savRate >= 20 ? '#34d399' : '#f87171' }}>{savRate}%</div>
        </div>
      </div>

      {/* Zombie subscription alert */}
      {subAlert && (
        <div className="zombie-alert" style={{ marginBottom: 20 }}>
          ⚠️ <strong>Subscription Graveyard Alert!</strong> You have {subAlert.zombieCount} subscription{subAlert.zombieCount > 1 ? 's' : ''} you haven't used in 30+ days, wasting <strong>~{fmt(subAlert.zombieWaste)}/month</strong>. <a href="/subscriptions" style={{ color: '#fbbf24' }}>Review them →</a>
        </div>
      )}

      {/* Summary cards */}
      <div className="card-grid">
        {[
          { label: 'Income', val: fmt(summary.income), sub: 'this month', color: '#34d399' },
          { label: 'Expenses', val: fmt(summary.expense), sub: `${budgetPct}% of budget`, color: budgetPct > 90 ? '#f87171' : '#e2e8f0' },
          { label: 'Savings', val: fmt(summary.savings), sub: summary.savings >= 0 ? 'Great job!' : 'Over income', color: summary.savings >= 0 ? '#34d399' : '#f87171' },
          { label: 'Budget left', val: fmt(Math.max(0, budget - summary.expense)), sub: `of ${fmt(budget)}`, color: budget - summary.expense < 0 ? '#f87171' : '#e2e8f0' },
        ].map(c => (
          <div key={c.label} className="metric-card">
            <div className="metric-label">{c.label}</div>
            <div className="metric-val" style={{ color: c.color }}>{c.val}</div>
            <div className="metric-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Budget progress */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>Monthly budget progress</span>
          <span style={{ fontSize: 13, color: budgetPct > 90 ? '#f87171' : '#94a3b8' }}>{budgetPct}% used</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${budgetPct}%`, background: budgetPct > 90 ? '#ef4444' : budgetPct > 70 ? '#f59e0b' : '#6366f1' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Spending by category */}
        <div className="card">
          <div className="section-title">Spending by category</div>
          {catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {catData.map(entry => <Cell key={entry.name} fill={CAT_COLORS[entry.name] || '#64748b'} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#13131f', border: '1px solid #1e293b', borderRadius: 8 }} />
                <Legend formatter={(v) => <span style={{ fontSize: 11, color: '#94a3b8' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{ color: '#475569', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>No expenses yet</div>}
        </div>

        {/* Category bars */}
        <div className="card">
          <div className="section-title">Top expenses</div>
          {catData.slice(0, 5).map(c => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 28, textAlign: 'center', fontSize: 14 }}>{ICONS[c.name] || '📌'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: '#e2e8f0' }}>{fmt(c.value)}</span>
                </div>
                <div className="progress-track" style={{ height: 5 }}>
                  <div className="progress-fill" style={{ width: `${Math.round((c.value / (summary.expense || 1)) * 100)}%`, background: CAT_COLORS[c.name] || '#64748b' }} />
                </div>
              </div>
            </div>
          ))}
          {catData.length === 0 && <div style={{ color: '#475569', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>Add expenses to see breakdown</div>}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>AI spending insights</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge badge-info">Claude AI</span>
            <button className="btn btn-outline btn-sm" onClick={loadInsights} disabled={insightsLoading}>{insightsLoading ? '...' : '↻ Refresh'}</button>
          </div>
        </div>
        {insightsLoading ? (
          <div style={{ color: '#475569', fontSize: 13, padding: '10px 0' }}>Analyzing your finances...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.map((ins, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px', background: '#0f0f1a', borderRadius: 8, borderLeft: `3px solid ${insightColors[ins.type] || '#6366f1'}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: insightColors[ins.type] || '#e2e8f0', marginBottom: 3 }}>{ins.title}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{ins.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add transaction */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">Add transaction</div>
        <form onSubmit={addTxn}>
          <div className="form-row">
            <div className="form-group"><label>Description</label><input placeholder="e.g. Grocery at DMart" value={form.name} onChange={set('name')} required /></div>
            <div className="form-group"><label>Amount (₹)</label><input type="number" placeholder="0" value={form.amount} onChange={set('amount')} required min="1" /></div>
            <div className="form-group"><label>Type</label>
              <select value={form.type} onChange={set('type')}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="form-group"><label>Category</label>
              <select value={form.category} onChange={set('category')}>
                {['Food','Transport','Shopping','Bills','Health','Entertainment','Salary','Investment','Subscription','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={adding}>{adding ? 'Adding...' : '+ Add transaction'}</button>
        </form>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Recent transactions</div>
          <a href="/transactions" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none' }}>View all →</a>
        </div>
        <div className="txn-list">
          {recent.length === 0 && <div style={{ color: '#475569', fontSize: 13, padding: '12px 0' }}>No transactions yet.</div>}
          {recent.map(t => (
            <div key={t._id} className="txn-item">
              <div className="txn-left">
                <div className="txn-icon" style={{ background: (CAT_COLORS[t.category] || '#64748b') + '22' }}>{ICONS[t.category] || '📌'}</div>
                <div>
                  <div className="txn-name">{t.name}</div>
                  <div className="txn-meta">{new Date(t.date).toLocaleDateString('en-IN')} · {t.category}</div>
                </div>
              </div>
              <div className={`txn-amount ${t.type}`}>{t.type === 'income' ? '+' : '-'}{fmt(t.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
