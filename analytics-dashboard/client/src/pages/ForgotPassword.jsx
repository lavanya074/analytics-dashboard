import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Forgot your password?</h2>
        <p style={s.sub}>Enter your email and we'll send you a reset link</p>

        {error && <p style={s.error}>{error}</p>}

        {sent ? (
          <p style={s.success}>
            If that email exists in our system, a reset link has been sent.
            Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              placeholder="rahul@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button style={s.btn} disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link →'}
            </button>
          </form>
        )}

        <p style={s.link}>
          <Link to="/login">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page:    { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card:    { background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '380px', border: '1px solid #e5e5e5' },
  title:   { margin: '0 0 4px', fontSize: '20px', fontWeight: 500 },
  sub:     { margin: '0 0 20px', fontSize: '13px', color: '#888' },
  label:   { display: 'block', fontSize: '12px', fontWeight: 500, color: '#555', marginBottom: '5px' },
  input:   { width: '100%', padding: '9px 12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
  btn:     { width: '100%', padding: '10px', marginTop: '16px', fontSize: '14px', fontWeight: 500, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  error:   { background: '#fff0f0', color: '#c0392b', padding: '10px', borderRadius: '8px', fontSize: '13px' },
  success: { background: '#f0fff4', color: '#1D9E75', padding: '12px', borderRadius: '8px', fontSize: '13px', lineHeight: 1.6 },
  link:    { textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '16px' }
};