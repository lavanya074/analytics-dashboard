import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Welcome back</h2>
        <p style={s.sub}>Log in to your dashboard</p>

        {error && <p style={s.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="rahul@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required />

          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="Your password"
            value={password} onChange={e => setPassword(e.target.value)} required />

          <button style={s.btn} disabled={loading}>
            {loading ? 'Logging in...' : 'Log in →'}
          </button>
        </form>

        <p style={s.link}>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p style={s.link}>No account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
}

const s = {
  page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card:  { background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '380px', border: '1px solid #e5e5e5' },
  title: { margin: '0 0 4px', fontSize: '20px', fontWeight: 500 },
  sub:   { margin: '0 0 20px', fontSize: '13px', color: '#888' },
  label: { display: 'block', fontSize: '12px', fontWeight: 500, color: '#555', marginBottom: '5px', marginTop: '14px' },
  input: { width: '100%', padding: '9px 12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
  btn:   { width: '100%', padding: '10px', marginTop: '20px', fontSize: '14px', fontWeight: 500, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  error: { background: '#fff0f0', color: '#c0392b', padding: '10px', borderRadius: '8px', fontSize: '13px' },
  link:  { textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '16px' }
};