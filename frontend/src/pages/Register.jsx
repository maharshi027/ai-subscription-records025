import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', monthlyBudget: '40000' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password, Number(form.monthlyBudget));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
    setLoading(false);
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ fontSize: 28, fontWeight: 700, color: '#6366f1', marginBottom: 4 }}>FinanceAI</div>
        <div className="auth-title">Register here</div>
        <div className="auth-sub">Start managing money smarter</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input placeholder="Enter your full name" value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={form.password} onChange={set('password')} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Monthly budget (₹)</label>
            <input type="number" placeholder="Enter your monthly budget" value={form.monthlyBudget} onChange={set('monthlyBudget')} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Get started'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748b' }}>
          Have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
