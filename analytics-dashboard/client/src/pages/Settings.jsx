import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function Settings() {
  const [apiKey, setApiKey]   = useState('');
  const [copied, setCopied]   = useState(false);
  const [loading, setLoading] = useState(false);

  const generateKey = async () => {
    setLoading(true);
    try {
      const res = await api.post('/settings/api-key');
      setApiKey(res.data.key);
    } catch (err) {
      alert('Error generating key');
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const snippet = `<script src="https://analytics-dashboard-efi6.onrender.com/tracker.js"></script></script>\n<script>Analytics.init("${apiKey || 'YOUR_API_KEY'}")</script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet);
    alert('Snippet copied!');
  };

  return (
    <div style={s.page}>
      <div style={s.topRow}>
        <h2 style={s.title}>Settings</h2>
        <Link to="/dashboard" style={s.backBtn}>← Back to dashboard</Link>
      </div>
      <p style={s.sub}>Generate your API key and tracking snippet</p>

      <div style={s.card}>
        <p style={s.cardTitle}>API Key</p>
        <p style={s.cardDesc}>This key identifies your workspace. Keep it secret.</p>
        <button style={s.btn} onClick={generateKey} disabled={loading}>
          {loading ? 'Generating...' : 'Generate new API key'}
        </button>
        {apiKey && (
          <>
            <div style={s.keyBox}>
              <code style={s.keyText}>{apiKey}</code>
              <button style={s.copyBtn} onClick={copyKey}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p style={s.warning}>⚠ Save this key now. It will not be shown again.</p>
          </>
        )}
      </div>

      <div style={s.card}>
        <p style={s.cardTitle}>Tracking snippet</p>
        <p style={s.cardDesc}>Paste these 2 lines inside the &lt;head&gt; tag of any website.</p>
        <div style={s.snippetBox}>
          <pre style={s.snippetCode}>{snippet}</pre>
        </div>
        <button style={{ ...s.copyBtn, marginTop: '10px' }} onClick={copySnippet}>
          Copy snippet
        </button>
      </div>
    </div>
  );
}

const s = {
  page:        { padding: '2rem', maxWidth: '700px', margin: '0 auto' },
  topRow:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title:       { margin: '0 0 4px', fontSize: '20px', fontWeight: 500 },
  backBtn:     { fontSize: '13px', color: '#4F46E5', textDecoration: 'none' },
  sub:         { margin: '0 0 24px', fontSize: '13px', color: '#888' },
  card:        { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  cardTitle:   { fontSize: '15px', fontWeight: 500, margin: '0 0 6px' },
  cardDesc:    { fontSize: '13px', color: '#888', margin: '0 0 16px', lineHeight: 1.6 },
  btn:         { padding: '9px 18px', fontSize: '13px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  keyBox:      { display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f8f8', padding: '12px', borderRadius: '8px', marginTop: '14px' },
  keyText:     { flex: 1, fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all' },
  copyBtn:     { padding: '6px 14px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', cursor: 'pointer', flexShrink: 0 },
  warning:     { fontSize: '12px', color: '#e67e22', marginTop: '10px', background: '#fff8f0', padding: '8px 12px', borderRadius: '6px' },
  snippetBox:  { background: '#1e1e2e', borderRadius: '8px', padding: '16px', marginTop: '8px' },
  snippetCode: { color: '#a6e3a1', fontSize: '12px', fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7 }
};
