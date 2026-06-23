import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate      = useNavigate();

  const [form, setForm]       = useState({ orgName: '', name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.orgName, form.name, form.email, form.password);
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
        <h2 style={s.title}>Create your account</h2>
        <p style={s.sub}>Start tracking your website in 2 minutes</p>

        {error && <p style={s.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Workspace name</label>
          <input style={s.input} name="orgName" placeholder="e.g. My Blog"
            value={form.orgName} onChange={handleChange} required />

          <label style={s.label}>Your name</label>
          <input style={s.input} name="name" placeholder="e.g. Rahul Sharma"
            value={form.name} onChange={handleChange} />

          <label style={s.label}>Email</label>
          <input style={s.input} name="email" type="email" placeholder="rahul@example.com"
            value={form.email} onChange={handleChange} required />

          <label style={s.label}>Password</label>
          <input style={s.input} name="password" type="password" placeholder="Min 6 characters"
            value={form.password} onChange={handleChange} required />

          <button style={s.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        <p style={s.link}>Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}

const s = {
  page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card:  { background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid #e5e5e5' },
  title: { margin: '0 0 4px', fontSize: '20px', fontWeight: 500 },
  sub:   { margin: '0 0 20px', fontSize: '13px', color: '#888' },
  label: { display: 'block', fontSize: '12px', fontWeight: 500, color: '#555', marginBottom: '5px', marginTop: '14px' },
  input: { width: '100%', padding: '9px 12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
  btn:   { width: '100%', padding: '10px', marginTop: '20px', fontSize: '14px', fontWeight: 500, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  error: { background: '#fff0f0', color: '#c0392b', padding: '10px', borderRadius: '8px', fontSize: '13px' },
  link:  { textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '16px' }
};
