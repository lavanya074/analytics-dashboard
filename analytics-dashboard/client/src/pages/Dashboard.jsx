import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const { user, logout }      = useAuth();
  const [data, setData]       = useState(null);
  const [from, setFrom]       = useState('');
  const [to, setTo]           = useState('');
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const params = {};
      if (from) params.from = from;
      if (to)   params.to   = to;
      const res = await api.get('/analytics/overview', { params });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [from, to]); // eslint-disable-line

  const sendTestEvent = async () => {
    try {
      await api.post('/events', {
        event_type: 'test_event',
        properties: { source: 'dashboard_button' }
      });
      setMsg('Event sent!');
      setTimeout(() => setMsg(''), 2000);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={s.page}>

      <div style={s.header}>
        <div>
          <h2 style={s.title}>Analytics Dashboard</h2>
          <p style={s.welcome}>Welcome, {user?.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/settings" style={s.settingsBtn}>Settings</Link>
          <button style={s.testBtn} onClick={sendTestEvent}>Send test event</button>
          {msg && <span style={s.msg}>{msg}</span>}
          <button style={s.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      {data?.isDemo && (
        <div style={s.demoBanner}>
          You're viewing sample demo data. Install the tracking snippet
          (Settings → API Key) to start seeing real visitor activity — it'll
          replace this automatically.
        </div>
      )}

      <div style={s.filterRow}>
        <span style={s.filterLabel}>From</span>
        <input style={s.dateInput} type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <span style={s.filterLabel}>To</span>
        <input style={s.dateInput} type="date" value={to} onChange={e => setTo(e.target.value)} />
        <button style={s.clearBtn} onClick={() => { setFrom(''); setTo(''); }}>Clear</button>
      </div>

      <div style={s.statRow}>
        <div style={s.stat}>
          <p style={s.statLabel}>Total events</p>
          <p style={s.statVal}>{data?.total || 0}</p>
        </div>
        <div style={s.stat}>
          <p style={s.statLabel}>Event types</p>
          <p style={s.statVal}>{data?.breakdown?.length || 0}</p>
        </div>
        <div style={s.stat}>
          <p style={s.statLabel}>Top event</p>
          <p style={{ ...s.statVal, fontSize: '16px' }}>{data?.breakdown?.[0]?.event_type || '—'}</p>
        </div>
        <div style={s.stat}>
          <p style={s.statLabel}>Days tracked</p>
          <p style={s.statVal}>{data?.trend?.length || 0}</p>
        </div>
      </div>

      <div style={s.chartCard}>
        <p style={s.chartTitle}>Events over time</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data?.trend || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={s.chartCard}>
        <p style={s.chartTitle}>Events by type</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data?.breakdown || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="event_type" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#1D9E75" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

const s = {
  page:        { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  title:       { margin: 0, fontSize: '20px', fontWeight: 500 },
  welcome:     { margin: '4px 0 0', fontSize: '13px', color: '#888' },
  filterRow:   { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  filterLabel: { fontSize: '13px', color: '#666' },
  dateInput:   { padding: '7px 10px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '8px' },
  clearBtn:    { padding: '7px 14px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', cursor: 'pointer' },
  statRow:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' },
  stat:        { background: '#f8f8f8', borderRadius: '10px', padding: '14px' },
  statLabel:   { fontSize: '11px', color: '#888', margin: '0 0 4px' },
  statVal:     { fontSize: '24px', fontWeight: 500, margin: 0 },
  chartCard:   { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '16px', marginBottom: '16px' },
  chartTitle:  { fontSize: '13px', fontWeight: 500, color: '#555', margin: '0 0 12px' },
  demoBanner:  { background: '#FFF7E6', border: '1px solid #FFE2A8', color: '#8A5A00', fontSize: '13px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' },
  testBtn:     { padding: '8px 14px', fontSize: '13px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  settingsBtn: { padding: '8px 14px', fontSize: '13px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', color: '#333' },
  logoutBtn:   { padding: '8px 14px', fontSize: '13px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' },
  msg:         { fontSize: '12px', color: '#1D9E75' }
};