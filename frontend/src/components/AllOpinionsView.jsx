const OPINION_META = {
  '긍정적 의견': { label: '▲ 긍정적', bg: '#fff0f0', color: '#c0392b', border: '#f5c6c6' },
  '부정적 의견': { label: '▼ 부정적', bg: '#f0f4ff', color: '#2980b9', border: '#b6c9f0' },
};

export default function AllOpinionsView({ opinions, loading }) {
  if (loading) return <p style={styles.empty}>불러오는 중...</p>;
  if (!opinions.length) return <p style={styles.empty}>등록된 IR 의견이 없습니다.</p>;

  // 회사별로 그룹화
  const grouped = opinions.reduce((acc, op) => {
    if (!acc[op.company_name]) acc[op.company_name] = [];
    acc[op.company_name].push(op);
    return acc;
  }, {});

  const companies = Object.keys(grouped).sort();

  return (
    <div>
      <h2 style={styles.title}>전체 현황 ({opinions.length}건 / {companies.length}개 회사)</h2>
      {companies.map((company) => {
        const ops = grouped[company];
        const posCount = ops.filter(o => o.opinion_type === '긍정적 의견').length;
        const negCount = ops.filter(o => o.opinion_type === '부정적 의견').length;
        return (
          <div key={company} style={styles.companyCard}>
            <div style={styles.companyHeader}>
              <span style={styles.companyName}>{company}</span>
              <div style={styles.summary}>
                {posCount > 0 && <span style={styles.posCount}>▲ {posCount}</span>}
                {negCount > 0 && <span style={styles.negCount}>▼ {negCount}</span>}
                <span style={styles.totalCount}>총 {ops.length}건</span>
              </div>
            </div>
            <div style={styles.opinionList}>
              {ops.map((op) => {
                const meta = OPINION_META[op.opinion_type] || OPINION_META['긍정적 의견'];
                return (
                  <div key={op.id} style={{ ...styles.opinionRow, borderLeft: `3px solid ${meta.border}` }}>
                    <div style={styles.opinionTop}>
                      <span style={{ ...styles.badge, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                        {meta.label}
                      </span>
                      <span style={styles.analyst}>{op.analyst}</span>
                      <span style={styles.date}>{formatDate(op.created_at)}</span>
                    </div>
                    <p style={styles.content}>{op.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatDate(str) {
  const d = new Date(str);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

const styles = {
  title: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#1a1a2e' },
  empty: { textAlign: 'center', color: '#aaa', padding: '60px 0', fontSize: 15 },
  companyCard: {
    background: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  companyHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#1a1a2e', padding: '14px 20px',
  },
  companyName: { fontSize: 16, fontWeight: 700, color: '#fff' },
  summary: { display: 'flex', alignItems: 'center', gap: 10 },
  posCount: { fontSize: 13, fontWeight: 700, color: '#ff8080', background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: 12 },
  negCount: { fontSize: 13, fontWeight: 700, color: '#80b0ff', background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: 12 },
  totalCount: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  opinionList: { padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  opinionRow: {
    padding: '12px 14px',
    borderRadius: 8,
    background: '#f8f9fc',
    paddingLeft: 14,
  },
  opinionTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  badge: { padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 },
  analyst: { fontSize: 13, fontWeight: 600, color: '#444' },
  date: { fontSize: 12, color: '#aaa', marginLeft: 'auto' },
  content: { fontSize: 13, lineHeight: 1.7, color: '#555', whiteSpace: 'pre-wrap', margin: 0 },
};
