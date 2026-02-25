import { useState } from 'react';
import { api } from '../api';

const INITIAL = {
  company_name: '',
  stock_code: '',
  opinion_type: 'Buy',
  target_price: '',
  current_price: '',
  analyst: '',
  content: '',
};

export default function OpinionForm({ onCreated }) {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const created = await api.create({
        ...form,
        target_price: form.target_price ? Number(form.target_price) : null,
        current_price: form.current_price ? Number(form.current_price) : null,
      });
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

      <div style={styles.row}>
        <Field label="회사명 *" name="company_name" value={form.company_name} onChange={handle} placeholder="삼성전자" required />
        <Field label="종목코드 *" name="stock_code" value={form.stock_code} onChange={handle} placeholder="005930" required />
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>투자의견 *</label>
          <select name="opinion_type" value={form.opinion_type} onChange={handle} style={{ ...styles.input, ...opinionColor(form.opinion_type) }}>
            <option value="Buy">Buy (매수)</option>
            <option value="Hold">Hold (중립)</option>
            <option value="Sell">Sell (매도)</option>
          </select>
        </div>
        <Field label="목표주가 (원)" name="target_price" value={form.target_price} onChange={handle} placeholder="85000" type="number" />
        <Field label="현재주가 (원)" name="current_price" value={form.current_price} onChange={handle} placeholder="72000" type="number" />
      </div>

      <Field label="애널리스트" name="analyst" value={form.analyst} onChange={handle} placeholder="홍길동" />

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

function Field({ label, name, value, onChange, placeholder, required, type = 'text' }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        style={styles.input}
        min={type === 'number' ? 0 : undefined}
      />
    </div>
  );
}

function opinionColor(type) {
  if (type === 'Buy') return { color: '#c0392b', fontWeight: 600 };
  if (type === 'Sell') return { color: '#2980b9', fontWeight: 600 };
  return { color: '#7f8c8d', fontWeight: 600 };
}

const styles = {
  form: {
    background: '#fff',
    borderRadius: 12,
    padding: '28px 32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginBottom: 32,
  },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1a1a2e' },
  row: { display: 'flex', gap: 16, marginBottom: 0 },
  field: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: 600, color: '#555' },
  input: {
    padding: '10px 12px',
    border: '1.5px solid #dde1e7',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color .2s',
    fontFamily: 'inherit',
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: '#2c3e9e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    marginTop: 4,
    transition: 'background .2s',
  },
  error: { color: '#c0392b', fontSize: 13, marginBottom: 8 },
};
