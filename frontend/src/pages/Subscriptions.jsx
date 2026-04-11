import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const CAT_ICONS = { Streaming:'📺', Music:'🎵', Software:'💻', Gaming:'🎮', News:'📰', Fitness:'💪', Cloud:'☁️', Other:'📦' };

const POPULAR = [
  { name: 'Netflix', amount: 649, billingCycle: 'monthly', category: 'Streaming' },
  { name: 'Spotify', amount: 119, billingCycle: 'monthly', category: 'Music' },
  { name: 'Amazon Prime', amount: 1499, billingCycle: 'yearly', category: 'Streaming' },
  { name: 'YouTube Premium', amount: 189, billingCycle: 'monthly', category: 'Streaming' },
  { name: 'Adobe CC', amount: 4230, billingCycle: 'monthly', category: 'Software' },
  { name: 'Hotstar', amount: 899, billingCycle: 'yearly', category: 'Streaming' },
  { name: 'Zerodha Kite', amount: 0, billingCycle: 'monthly', category: 'Software' },
  { name: 'Google One', amount: 130, billingCycle: 'monthly', category: 'Cloud' },
];

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [stats, setStats] = useState({ totalMonthly: 0, zombieCount: 0, zombieWaste: 0 });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', amount: '', billingCycle: 'monthly', category: 'Streaming', nextRenewalDate: '' });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/subscriptions');
      setSubs(res.data.subscriptions);
      setStats({ totalMonthly: res.data.totalMonthly, zombieCount: res.data.zombieCount, zombieWaste: res.data.zombieWaste });
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const addSub = async (e) => {
    e.preventDefault(); setAdding(true);
    try {
      await axios.post('/api/subscriptions', { ...form, amount: Number(form.amount) });
      setForm({ name: '', amount: '', billingCycle: 'monthly', category: 'Streaming', nextRenewalDate: '' });
      setShowForm(false);
      await load();
    } catch (err) { alert(err.response?.data?.error || 'Error adding subscription'); }
    setAdding(false);
  };

  const markUsed = async (id) => {
    try { await axios.put(`/api/subscriptions/${id}/used`); await load(); } catch { }
  };

  const cancel = async (id, name) => {
    if (!window.confirm(`Cancel ${name}? This will mark it as inactive.`)) return;
    try { await axios.put(`/api/subscriptions/${id}/cancel`); await load(); } catch { }
  };

  const quickAdd = (sub) => {
    const nextMonth = new Date(); nextMonth.setMonth(nextMonth.getMonth() + 1);
    setForm({ ...sub, amount: String(sub.amount), nextRenewalDate: nextMonth.toISOString().split('T')[0] });
    setShowForm(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const zombies = subs.filter(s => s.isZombie);
  const active = subs.filter(s => !s.isZombie);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Subscription Manager</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>+ Add subscription</button>
      </div>

      {/* Stats */}
      <div className="card-grid" style={{ marginBottom: 20 }}>
        <div className="metric-card">
          <div className="metric-label">Monthly cost</div>
          <div className="metric-val" style={{ color: '#6366f1' }}>{fmt(stats.totalMonthly)}</div>
          <div className="metric-sub">all subscriptions</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Yearly cost</div>
          <div className="metric-val">{fmt(stats.totalMonthly * 12)}</div>
          <div className="metric-sub">projected</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Zombie subs</div>
          <div className="metric-val" style={{ color: stats.zombieCount > 0 ? '#f59e0b' : '#34d399' }}>{stats.zombieCount}</div>
          <div className="metric-sub">unused 30+ days</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Zombie waste</div>
          <div className="metric-val" style={{ color: stats.zombieWaste > 0 ? '#f87171' : '#34d399' }}>{fmt(stats.zombieWaste)}</div>
          <div className="metric-sub">Per month wasted</div>
        </div>
      </div>

      {zombies.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ background: '#1a1200', border: '1px solid #f59e0b30', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fbbf24', marginBottom: 6 }}>
              🪦 Subscription Graveyard — {zombies.length} zombie{zombies.length > 1 ? 's' : ''} found
            </div>
            <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
              These subscriptions haven't been used in <strong style={{ color: '#fbbf24' }}>30+ days</strong> but are still charging you. 
              You're wasting <span className="zombie-waste">{fmt(stats.zombieWaste)}/month</span> = <strong style={{ color: '#fb923c' }}>{fmt(stats.zombieWaste * 12)}/year</strong> on services you don't use.
              Cancel or mark as used.
            </div>
          </div>
          <div className="sub-grid">
            {zombies.map(s => (
              <div key={s._id} className="sub-card zombie">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{CAT_ICONS[s.category] || '📦'}</div>
                    <div className="sub-name">{s.name}</div>
                    <span className="badge badge-warning">🪦 Zombie — {s.daysSinceUse}d unused</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="sub-price">{fmt(s.amount)}</div>
                    <div className="sub-cycle">/{s.billingCycle}</div>
                  </div>
                </div>
                <div className="sub-renewal">🔄 Renews in {s.daysUntilRenewal} days</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn btn-success btn-sm" onClick={() => markUsed(s._id)} style={{ flex: 1 }}>✓ Mark used</button>
                  <button className="btn btn-danger btn-sm" onClick={() => cancel(s._id, s.name)} style={{ flex: 1 }}>✕ Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="section-title">Active subscriptions ({active.length})</div>
          <div className="sub-grid">
            {active.map(s => (
              <div key={s._id} className="sub-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{CAT_ICONS[s.category] || '📦'}</div>
                    <div className="sub-name">{s.name}</div>
                    <span className="badge badge-success">✓ Active</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="sub-price">{fmt(s.amount)}</div>
                    <div className="sub-cycle">/{s.billingCycle}</div>
                  </div>
                </div>
                <div className="sub-renewal">🔄 Renews in {s.daysUntilRenewal} days · Used {s.daysSinceUse}d ago</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn btn-success btn-sm" onClick={() => markUsed(s._id)} style={{ flex: 1 }}>✓ Mark used</button>
                  <button className="btn btn-danger btn-sm" onClick={() => cancel(s._id, s.name)} style={{ flex: 1 }}>✕ Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subs.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔄</div>
          <div style={{ fontSize: 15, marginBottom: 6 }}>No subscriptions tracked yet</div>
          <div style={{ fontSize: 13 }}>Add your subscriptions to detect zombie ones wasting your money</div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">Quick add popular subscriptions</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {POPULAR.map(p => (
            <button key={p.name} className="btn btn-outline btn-sm" onClick={() => quickAdd(p)}>
              {CAT_ICONS[p.category]} {p.name}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="card">
          <div className="section-title">Add subscription</div>
          <form onSubmit={addSub}>
            <div className="form-row">
              <div className="form-group"><label>Service name</label><input placeholder="e.g. Netflix" value={form.name} onChange={set('name')} required /></div>
              <div className="form-group"><label>Amount (₹)</label><input type="number" placeholder="649" value={form.amount} onChange={set('amount')} required min="0" /></div>
              <div className="form-group"><label>Billing cycle</label>
                <select value={form.billingCycle} onChange={set('billingCycle')}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="form-group"><label>Category</label>
                <select value={form.category} onChange={set('category')}>
                  {['Streaming','Music','Software','Gaming','News','Fitness','Cloud','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Next renewal date</label><input type="date" value={form.nextRenewalDate} onChange={set('nextRenewalDate')} required /></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={adding}>{adding ? 'Adding...' : '+ Add subscription'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
