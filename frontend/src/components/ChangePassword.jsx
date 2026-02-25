import { useState } from 'react';
import { api } from '../api';

export default function ChangePassword({ reviewer, onClose }) {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.new_password !== form.confirm) {
      return setError('새 암호와 확인 암호가 일치하지 않습니다.');
    }
    setLoading(true);
    try {
      await api.changePassword({
        reviewer_id: reviewer.id,
        current_password: form.current_password,
        new_password: form.new_password,
      });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>암호 변경</h3>
        <p style={styles.sub}>{reviewer.name} 심사역</p>

        {done ? (
          <div style={styles.successBox}>
            <p>암호가 성공적으로 변경되었습니다.</p>
            <button onClick={onClose} style={styles.btn}>닫기</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            {[
              { name: 'current_password', label: '현재 암호' },
              { name: 'new_password', label: '새 암호' },
              { name: 'confirm', label: '새 암호 확인' },
            ].map(({ name, label }) => (
              <div key={name} style={styles.field}>
                <label style={styles.label}>{label}</label>
                <input
                  type="password"
                  name={name}
                  value={form[name]}
                  onChange={handle}
                  required
                  style={styles.input}
                />
              </div>
            ))}
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.actions}>
              <button type="button" onClick={onClose} style={styles.cancelBtn}>취소</button>
              <button type="submit" disabled={loading} style={styles.btn}>
                {loading ? '변경 중...' : '변경'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff', borderRadius: 14,
    padding: '36px 32px', width: '100%', maxWidth: 380,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#1a1a2e' },
  sub: { fontSize: 13, color: '#888', marginBottom: 24 },
  field: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 },
  label: { fontSize: 13, fontWeight: 600, color: '#555' },
  input: {
    padding: '10px 12px', border: '1.5px solid #dde1e7',
    borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none',
  },
  error: { color: '#c0392b', fontSize: 13, marginBottom: 8 },
  actions: { display: 'flex', gap: 10, marginTop: 8 },
  btn: {
    flex: 1, padding: '11px', background: '#1a1a2e',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1, padding: '11px', background: '#f0f2f5',
    color: '#555', border: 'none', borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  successBox: { textAlign: 'center', padding: '20px 0' },
};
