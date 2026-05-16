import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ students: 0, buddies: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/users')
      .then(res => setCounts({
        students: res.data.students.length,
        buddies: res.data.buddies.length,
        admins: res.data.admins.length,
      }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    {
      role: 'students',
      label: 'Students',
      icon: '🎓',
      desc: 'Registered student accounts',
      color: 'var(--green)',
      bg: 'var(--green-light)',
      border: '#9FE1CB',
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=70',
    },
    {
      role: 'buddies',
      label: 'Buddies',
      icon: '🤝',
      desc: 'Active buddy accounts',
      color: 'var(--coral-dark)',
      bg: 'var(--coral-light)',
      border: '#F5C4B3',
      img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=70',
    },
    {
      role: 'admins',
      label: 'Admins',
      icon: '🛡️',
      desc: 'Administrator accounts',
      color: '#185fa5',
      bg: '#e6f1fb',
      border: '#B5D4F4',
      img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=70',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>All Users</h2>
        <p>Select a category to view and manage users</p>
      </div>

      {/* Summary strip */}
      <div style={styles.summaryStrip}>
        <div style={styles.summaryItem}>
          <div style={styles.summaryNum}>{loading ? '—' : counts.students + counts.buddies + counts.admins}</div>
          <div style={styles.summaryLabel}>Total Users</div>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <div style={styles.summaryNum}>{loading ? '—' : counts.students}</div>
          <div style={styles.summaryLabel}>Students</div>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <div style={styles.summaryNum}>{loading ? '—' : counts.buddies}</div>
          <div style={styles.summaryLabel}>Buddies</div>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <div style={styles.summaryNum}>{loading ? '—' : counts.admins}</div>
          <div style={styles.summaryLabel}>Admins</div>
        </div>
      </div>

      {/* Category cards */}
      <div style={styles.cardGrid}>
        {categories.map(cat => (
          <div key={cat.role} style={styles.catCard} onClick={() => navigate(`/users/${cat.role}`)}
            className="card-hover">
            {/* Image */}
            <div style={styles.catImg}>
              <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: 4 }}>{cat.icon}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                  {cat.label}
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={styles.catBody}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>{cat.desc}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: 50, padding: '4px 14px' }}>
                  <span style={{ fontSize: 18, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: cat.color }}>
                    {loading ? '—' : counts[cat.role]}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    registered
                  </span>
                </div>
              </div>
              <div style={{ background: cat.bg, borderRadius: 50, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: cat.color, whiteSpace: 'nowrap' }}>
                View all →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  summaryStrip: { background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 },
  summaryItem: { textAlign: 'center' },
  summaryNum: { fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--green)', lineHeight: 1 },
  summaryLabel: { fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 },
  summaryDivider: { width: 1, height: 40, background: 'var(--border)' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem' },
  catCard: { background: '#fff', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer' },
  catImg: { height: 160, position: 'relative', overflow: 'hidden' },
  catBody: { padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
};