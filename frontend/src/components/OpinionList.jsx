import { api } from '../api';

const OPINION_META = {
  '긍정적 의견': { label: '▲ 긍정적 의견', bg: '#fff0f0', color: '#c0392b', border: '#f5c6c6' },
  '부정적 의견': { label: '▼ 부정적 의견', bg: '#f0f4ff', color: '#2980b9', border: '#b6c9f0' },
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
        const meta = OPINION_META[op.opinion_type] || OPINION_META['긍정적 의견'];
        return (
          <div key={op.id} style={{ ...styles.card, borderLeft: `4px solid ${meta.border}` }}>
            <div style={styles.header}>
              <span style={styles.name}>{op.company_name}</span>
              <div style={styles.right}>
                <span style={{ ...styles.badge, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                  {meta.label}
                </span>
                <button onClick={() => handleDelete(op.id, op.company_name)} style={styles.del} title="삭제">✕</button>
              </div>
            </div>

            <p style={styles.content}>{op.content}</p>

            <div style={styles.footer}>
              {op.analyst && <span>심사역: {op.analyst}</span>}
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  name: { fontSize: 17, fontWeight: 700 },
  right: { display: 'flex', alignItems: 'center', gap: 8 },
  badge: { padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 },
  del: { background: 'none', border: 'none', color: '#ccc', fontSize: 16, padding: '2px 6px', cursor: 'pointer' },
  content: { fontSize: 14, lineHeight: 1.8, color: '#333', whiteSpace: 'pre-wrap', marginBottom: 12 },
  footer: { display: 'flex', gap: 16, fontSize: 12, color: '#aaa' },
};
