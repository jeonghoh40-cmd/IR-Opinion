import { useState, useEffect } from 'react';
import { api } from './api';
import OpinionForm from './components/OpinionForm';
import OpinionList from './components/OpinionList';

export default function App() {
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('list'); // 'form' | 'list'

  useEffect(() => {
    api.getAll()
      .then(setOpinions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (op) => {
    setOpinions((prev) => [op, ...prev]);
    setTab('list');
  };

  const handleDeleted = (id) => {
    setOpinions((prev) => prev.filter((op) => op.id !== id));
  };

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
      </header>

      <main style={styles.main}>
        {tab === 'form' ? (
          <OpinionForm onCreated={handleCreated} />
        ) : (
          <OpinionList opinions={opinions} loading={loading} onDeleted={handleDeleted} />
        )}
      </main>
    </div>
  );
}

const styles = {
  root: { minHeight: '100vh' },
  header: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '0 32px',
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
    transition: 'all .2s',
  },
  navActive: {
    background: '#2c3e9e',
    border: '1px solid #2c3e9e',
    color: '#fff',
  },
  main: { maxWidth: 860, margin: '0 auto', padding: '32px 16px' },
};
