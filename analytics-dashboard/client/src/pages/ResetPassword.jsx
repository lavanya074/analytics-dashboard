import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate  = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Reset your password</h2>
        <p style={s.sub}>Choose a new password for your account</p>

        {error && <p style={s.error}>{error}</p>}

        {success ? (
          <p style={s.success}>
            Password updated! Redirecting you to login...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={s.label}>New password</label>
            <input
              style={s.input}
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <label style={s.label}>Confirm password</label>
            <input
              style={s.input}
              type="password"
              placeholder="Re-enter password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />

            <button style={s.btn} disabled={loading}>
              {loading ? 'Updating...' : 'Update password →'}
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
  label:   { display: 'block', fontSize: '12px', fontWeight: 500, color: '#555', marginBottom: '5px', marginTop: '14px' },
  input:   { width: '100%', padding: '9px 12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
  btn:     { width: '100%', padding: '10px', marginTop: '20px', fontSize: '14px', fontWeight: 500, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  error:   { background: '#fff0f0', color: '#c0392b', padding: '10px', borderRadius: '8px', fontSize: '13px' },
  success: { background: '#f0fff4', color: '#1D9E75', padding: '12px', borderRadius: '8px', fontSize: '13px', lineHeight: 1.6 },
  link:    { textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '16px' }
};