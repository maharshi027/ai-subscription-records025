import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CAT_COLORS = { Food:'#10b981',Transport:'#3b82f6',Shopping:'#ec4899',Bills:'#f59e0b',Health:'#8b5cf6',Entertainment:'#f97316',Salary:'#22c55e',Investment:'#06b6d4',Subscription:'#6366f1',Other:'#64748b' };
const ICONS = { Food:'🍔',Transport:'🚗',Shopping:'🛍',Bills:'💡',Health:'💊',Entertainment:'🎬',Salary:'💼',Investment:'📈',Subscription:'🔄',Other:'📌' };
const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const CATS = ['Food','Transport','Shopping','Bills','Health','Entertainment','Salary','Investment','Subscription','Other'];

export default function Transactions() {
  const [txns, setTxns] = useState([]);
  const [filter, setFilter] = useState({ type: '', category: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', amount: '', type: 'expense', category: 'Food', note: '' });
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [autocat, setAutocat] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ month: filter.month, year: filter.year, limit: 100 });
      if (filter.type) params.append('type', filter.type);
      if (filter.category) params.append('category', filter.category);
      const res = await axios.get(`/api/transactions?${params}`);
      setTxns(res.data.transactions);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setF = (k) => (e) => setFilter(f => ({ ...f, [k]: e.target.value }));

  const autoCategorize = async () => {
    if (!form.name) return;
    setAutocat(true);
    try {
      const res = await axios.post('/api/ai/categorize', { description: form.name, amount: form.amount || 0 });
      setForm(f => ({ ...f, category: res.data.category }));
    } catch { }
    setAutocat(false);
  };

  const addTxn = async (e) => {
    e.preventDefault(); setAdding(true);
    try {
      await axios.post('/api/transactions', { ...form, amount: Number(form.amount) });
      setForm({ name: '', amount: '', type: 'expense', category: 'Food', note: '' });
      await load();
    } catch (err) { alert(err.response?.data?.error || 'Error'); }
    setAdding(false);
  };

  const deleteTxn = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    setDeleting(id);
    try { await axios.delete(`/api/transactions/${id}`); await load(); } catch { }
    setDeleting(null);
  };

  const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div>
      <h1 className="page-title">Transactions</h1>

      {/* Summary */}
      <div className="card-grid" style={{ marginBottom: 20 }}>
        <div className="metric-card"><div className="metric-label">Income</div><div className="metric-val" style={{ color: '#34d399' }}>{fmt(income)}</div></div>
        <div className="metric-card"><div className="metric-label">Expenses</div><div className="metric-val" style={{ color: '#f87171' }}>{fmt(expense)}</div></div>
        <div className="metric-card"><div className="metric-label">Net</div><div className="metric-val" style={{ color: income - expense >= 0 ? '#34d399' : '#f87171' }}>{fmt(income - expense)}</div></div>
        <div className="metric-card"><div className="metric-label">Transactions</div><div className="metric-val">{txns.length}</div></div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-row">
          <div className="form-group">
            <label>Month</label>
            <select value={filter.month} onChange={setF('month')}>
              {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <select value={filter.year} onChange={setF('year')}>
              {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={filter.type} onChange={setF('type')}>
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={filter.category} onChange={setF('category')}>
              <option value="">All categories</option>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Add transaction */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">Add new transaction</div>
        <form onSubmit={addTxn}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Description</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input placeholder="e.g. Swiggy order" value={form.name} onChange={set('name')} required />
                <button type="button" className="btn btn-outline btn-sm" onClick={autoCategorize} disabled={autocat} title="Auto-categorize with AI" style={{ whiteSpace: 'nowrap' }}>
                  {autocat ? '...' : '🤖 Auto'}
                </button>
              </div>
            </div>
            <div className="form-group"><label>Amount (₹)</label><input type="number" placeholder="0" value={form.amount} onChange={set('amount')} required min="1" /></div>
            <div className="form-group"><label>Type</label><select value={form.type} onChange={set('type')}><option value="expense">Expense</option><option value="income">Income</option></select></div>
            <div className="form-group"><label>Category</label><select value={form.category} onChange={set('category')}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="form-group"><label>Note (optional)</label><input placeholder="Any notes..." value={form.note} onChange={set('note')} /></div>
          <button type="submit" className="btn btn-primary" disabled={adding}>{adding ? 'Adding...' : '+ Add transaction'}</button>
        </form>
      </div>

      {/* Transaction list */}
      <div className="card">
        <div className="section-title">All transactions ({txns.length})</div>
        {loading ? (
          <div style={{ color: '#475569', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>Loading...</div>
        ) : (
          <div className="txn-list">
            {txns.length === 0 && <div style={{ color: '#475569', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>No transactions found for selected filters.</div>}
            {txns.map(t => (
              <div key={t._id} className="txn-item">
                <div className="txn-left">
                  <div className="txn-icon" style={{ background: (CAT_COLORS[t.category] || '#64748b') + '22' }}>{ICONS[t.category] || '📌'}</div>
                  <div>
                    <div className="txn-name">{t.name}</div>
                    <div className="txn-meta">{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {t.category}{t.note ? ` · ${t.note}` : ''}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className={`txn-amount ${t.type}`}>{t.type === 'income' ? '+' : '-'}{fmt(t.amount)}</div>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteTxn(t._id)} disabled={deleting === t._id}>
                    {deleting === t._id ? '...' : '✕'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
