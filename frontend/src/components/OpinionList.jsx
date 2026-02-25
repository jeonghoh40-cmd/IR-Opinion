import { api } from '../api';

const OPINION_META = {
  Buy:  { label: 'Buy', bg: '#fff0f0', color: '#c0392b', border: '#f5c6c6' },
  Hold: { label: 'Hold', bg: '#fafafa', color: '#7f8c8d', border: '#dde1e7' },
  Sell: { label: 'Sell', bg: '#f0f4ff', color: '#2980b9', border: '#b6c9f0' },
};

export default function OpinionList({ opinions, loading, onDeleted }) {
  const handleDelete = async (id, company) => {
    if (!window.confirm(`[${company}] 의견을 삭제하시겠습니까?`)) return;
    try {
      await api.remove(id);
      onDeleted(id);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p style={styles.empty}>불러오는 중...</p>;
  if (!opinions.length) return <p style={styles.empty}>등록된 IR 의견이 없습니다.</p>;

  return (
    <div>
      <h2 style={styles.title}>IR 의견 목록 ({opinions.length}건)</h2>
      {opinions.map((op) => {
        const meta = OPINION_META[op.opinion_type] || OPINION_META.Hold;
        const upside = op.target_price && op.current_price
          ? (((op.target_price - op.current_price) / op.current_price) * 100).toFixed(1)
          : null;

        return (
          <div key={op.id} style={{ ...styles.card, borderLeft: `4px solid ${meta.border}` }}>
            <div style={styles.header}>
              <div style={styles.company}>
                <span style={styles.name}>{op.company_name}</span>
                <span style={styles.code}>{op.stock_code}</span>
              </div>
              <div style={styles.right}>
                <span style={{ ...styles.badge, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                  {meta.label}
                </span>
                <button onClick={() => handleDelete(op.id, op.company_name)} style={styles.del} title="삭제">✕</button>
              </div>
            </div>

            <div style={styles.prices}>
              {op.current_price && <span>현재 <b>{op.current_price.toLocaleString()}원</b></span>}
              {op.target_price && <span>목표 <b>{op.target_price.toLocaleString()}원</b></span>}
              {upside !== null && (
                <span style={{ color: Number(upside) >= 0 ? '#c0392b' : '#2980b9', fontWeight: 700 }}>
                  ({Number(upside) >= 0 ? '+' : ''}{upside}%)
                </span>
              )}
            </div>

            <p style={styles.content}>{op.content}</p>

            <div style={styles.footer}>
              {op.analyst && <span>· {op.analyst}</span>}
              <span>{formatDate(op.created_at)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatDate(str) {
  const d = new Date(str);
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function pad(n) { return String(n).padStart(2, '0'); }

const styles = {
  title: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#1a1a2e' },
  empty: { textAlign: 'center', color: '#aaa', padding: '60px 0', fontSize: 15 },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 16,
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  company: { display: 'flex', alignItems: 'center', gap: 10 },
  name: { fontSize: 17, fontWeight: 700 },
  code: { fontSize: 13, color: '#888', background: '#f0f2f5', padding: '2px 8px', borderRadius: 6 },
  right: { display: 'flex', alignItems: 'center', gap: 8 },
  badge: { padding: '3px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 },
  del: { background: 'none', border: 'none', color: '#ccc', fontSize: 16, padding: '2px 6px', transition: 'color .2s' },
  prices: { display: 'flex', gap: 16, fontSize: 14, color: '#555', marginBottom: 12 },
  content: { fontSize: 14, lineHeight: 1.7, color: '#333', whiteSpace: 'pre-wrap' },
  footer: { display: 'flex', gap: 12, marginTop: 12, fontSize: 12, color: '#aaa' },
};
