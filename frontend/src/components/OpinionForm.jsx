import { useState, useEffect } from 'react';
import { api } from '../api';

const INITIAL = { company_name: '', opinion_type: '', content: '' };

export default function OpinionForm({ reviewer, onCreated }) {
  const [form, setForm] = useState(INITIAL);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCompanies().then(setCompanies).catch(console.error);
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const created = await api.create({ ...form, analyst: reviewer.name });
      onCreated(created);
      setForm(INITIAL);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={styles.form}>
      <h2 style={styles.title}>IR 의견 등록</h2>

      {/* 심사역 표시 (읽기 전용) */}
      <div style={styles.reviewerBadge}>
        <span style={styles.reviewerLabel}>심사역</span>
        <span style={styles.reviewerName}>{reviewer.name}</span>
      </div>

      {/* 회사 선택 */}
      <div style={styles.field}>
        <label style={styles.label}>회사명 *</label>
        <select name="company_name" value={form.company_name} onChange={handle} required style={styles.input}>
          <option value="">-- 회사 선택 --</option>
          {companies.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* 투자의견 버튼 */}
      <div style={styles.field}>
        <label style={styles.label}>투자의견 *</label>
        <div style={styles.radioGroup}>
          {['긍정적 의견', '부정적 의견'].map((opt) => {
            const isPos = opt === '긍정적 의견';
            const isSelected = form.opinion_type === opt;
            return (
              <label
                key={opt}
                style={{
                  ...styles.radioLabel,
                  ...(isSelected ? (isPos ? styles.radioActivePos : styles.radioActiveNeg) : {}),
                }}
              >
                <input
                  type="radio"
                  name="opinion_type"
                  value={opt}
                  checked={isSelected}
                  onChange={handle}
                  style={{ display: 'none' }}
                  required
                />
                {isPos ? '▲ 긍정적 의견' : '▼ 부정적 의견'}
              </label>
            );
          })}
        </div>
      </div>

      {/* 의견 내용 */}
      <div style={styles.field}>
        <label style={styles.label}>의견 내용 *</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handle}
          required
          rows={5}
          placeholder="투자 의견 및 근거를 입력하세요..."
          style={{ ...styles.input, resize: 'vertical' }}
        />
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" disabled={loading} style={styles.btn}>
        {loading ? '등록 중...' : '의견 등록'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    background: '#fff', borderRadius: 12,
    padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 32,
  },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1a1a2e' },
  reviewerBadge: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: '#f0f4ff', borderRadius: 8, padding: '10px 16px', marginBottom: 20,
  },
  reviewerLabel: { fontSize: 12, fontWeight: 600, color: '#2c3e9e' },
  reviewerName: { fontSize: 15, fontWeight: 700, color: '#1a1a2e' },
  field: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 },
  label: { fontSize: 13, fontWeight: 600, color: '#555' },
  input: {
    padding: '10px 12px', border: '1.5px solid #dde1e7',
    borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fff', outline: 'none',
  },
  radioGroup: { display: 'flex', gap: 12 },
  radioLabel: {
    flex: 1, textAlign: 'center', padding: '12px',
    border: '1.5px solid #dde1e7', borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#aaa',
  },
  radioActivePos: { background: '#fff0f0', borderColor: '#c0392b', color: '#c0392b' },
  radioActiveNeg: { background: '#f0f4ff', borderColor: '#2980b9', color: '#2980b9' },
  btn: {
    width: '100%', padding: '13px', background: '#1a1a2e',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4,
  },
  error: { color: '#c0392b', fontSize: 13, marginBottom: 8 },
};
