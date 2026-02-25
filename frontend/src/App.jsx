import { useState, useEffect } from 'react';
import { api } from './api';
import LoginScreen from './components/LoginScreen';
import OpinionForm from './components/OpinionForm';
import OpinionList from './components/OpinionList';
import ChangePassword from './components/ChangePassword';

export default function App() {
  const [reviewer, setReviewer] = useState(() => {
    const saved = sessionStorage.getItem('reviewer');
    return saved ? JSON.parse(saved) : null;
  });
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('list');
  const [showChangePw, setShowChangePw] = useState(false);

  useEffect(() => {
    if (!reviewer) return;
    api.getAll()
      .then(setOpinions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [reviewer]);

  const handleLogin = (r) => {
    sessionStorage.setItem('reviewer', JSON.stringify(r));
    setReviewer(r);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('reviewer');
    setReviewer(null);
    setOpinions([]);
    setLoading(true);
    setTab('list');
  };

  const handleCreated = (op) => {
    setOpinions((prev) => [op, ...prev]);
    setTab('list');
  };

  const handleDeleted = (id) => {
    setOpinions((prev) => prev.filter((op) => op.id !== id));
  };

  if (!reviewer) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>📊</span>
          <span style={styles.logoText}>IR Opinion</span>
        </div>
        <nav style={styles.nav}>
          <button onClick={() => setTab('list')} style={{ ...styles.navBtn, ...(tab === 'list' ? styles.navActive : {}) }}>
            목록
          </button>
          <button onClick={() => setTab('form')} style={{ ...styles.navBtn, ...(tab === 'form' ? styles.navActive : {}) }}>
            + 의견 등록
          </button>
        </nav>
        <div style={styles.userArea}>
          <span style={styles.userName}>{reviewer.name} 심사역</span>
          <button onClick={() => setShowChangePw(true)} style={styles.pwBtn}>암호변경</button>
          <button onClick={handleLogout} style={styles.logoutBtn}>로그아웃</button>
        </div>
      </header>

      <main style={styles.main}>
        {tab === 'form' ? (
          <OpinionForm reviewer={reviewer} onCreated={handleCreated} />
        ) : (
          <OpinionList opinions={opinions} loading={loading} onDeleted={handleDeleted} />
        )}
      </main>

      {showChangePw && (
        <ChangePassword reviewer={reviewer} onClose={() => setShowChangePw(false)} />
      )}
    </div>
  );
}

const styles = {
  root: { minHeight: '100vh' },
  header: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { fontSize: 22 },
  logoText: { fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' },
  nav: { display: 'flex', gap: 8 },
  navBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.7)',
    padding: '7px 18px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  navActive: {
    background: '#2c3e9e',
    border: '1px solid #2c3e9e',
    color: '#fff',
  },
  userArea: { display: 'flex', alignItems: 'center', gap: 8 },
  userName: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 },
  pwBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.25)',
    color: 'rgba(255,255,255,0.7)',
    padding: '5px 12px',
    borderRadius: 16,
    fontSize: 12,
    cursor: 'pointer',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.25)',
    color: 'rgba(255,255,255,0.7)',
    padding: '5px 12px',
    borderRadius: 16,
    fontSize: 12,
    cursor: 'pointer',
  },
  main: { maxWidth: 860, margin: '0 auto', padding: '32px 16px' },
};
