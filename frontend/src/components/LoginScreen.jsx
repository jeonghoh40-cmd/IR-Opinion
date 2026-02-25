import { useState, useEffect } from 'react';
import { api } from '../api';

export default function LoginScreen({ onLogin }) {
  const [reviewers, setReviewers] = useState([]);
  const [reviewerId, setReviewerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getReviewers().then(setReviewers).catch(console.error);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const reviewer = await api.login({ reviewer_id: Number(reviewerId), password });
      onLogin(reviewer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>📊</span>
          <span style={styles.logoText}>IR Opinion</span>
        </div>

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>심사역 선택</label>
            <select
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">-- 심사역을 선택하세요 --</option>
              {reviewers.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>암호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="암호를 입력하세요"
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>

        <p style={styles.hint}>초기 암호: ir1234</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f2f5',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '48px 40px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 36,
  },
  logoIcon: { fontSize: 28 },
  logoText: { fontSize: 22, fontWeight: 700, color: '#1a1a2e' },
  form: {},
  field: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 },
  label: { fontSize: 13, fontWeight: 600, color: '#555' },
  input: {
    padding: '11px 14px',
    border: '1.5px solid #dde1e7',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    background: '#fff',
  },
  btn: {
    width: '100%',
    padding: '13px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
  },
  error: { color: '#c0392b', fontSize: 13, marginBottom: 8 },
  hint: { textAlign: 'center', fontSize: 12, color: '#bbb', marginTop: 20 },
};
