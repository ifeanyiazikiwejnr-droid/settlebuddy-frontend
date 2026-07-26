import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const categoryColors = {
  'Before You Arrive': { bg: '#e6f1fb', color: '#185fa5', border: '#B5D4F4' },
  'First 48 Hours':    { bg: '#fff8ec', color: '#92600a', border: '#f5d090' },
  'First Week':        { bg: 'var(--green-light)', color: 'var(--green)', border: '#9FE1CB' },
  'First Month':       { bg: 'var(--coral-light)', color: 'var(--coral-dark)', border: '#F5C4B3' },
};

export default function ChecklistPage() {
  const { showToast } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    axios.get('/api/checklist')
      .then(res => setTasks(res.data))
      .catch(() => showToast('Error loading checklist'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (key, current) => {
    setUpdating(u => ({ ...u, [key]: true }));
    try {
      await axios.patch(`/api/checklist/${key}`, { completed: !current });
      setTasks(ts => ts.map(t => t.key === key
        ? { ...t, completed: !current, completed_at: !current ? new Date().toISOString() : null }
        : t
      ));
    } catch { showToast('Error updating task'); }
    finally { setUpdating(u => ({ ...u, [key]: false })); }
  };

  // Group by category
  const grouped = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {});

  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading your checklist...</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Arrival Checklist</h2>
        <p>Everything you need to do to settle into UK student life</p>
      </div>

      {/* Progress card */}
      <div style={styles.progressCard}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', color: '#fff', marginBottom: 2 }}>
                Your Progress
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                {done} of {total} tasks completed
              </div>
            </div>
            <div style={styles.pctCircle}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{pct}%</span>
            </div>
          </div>
          {/* Progress bar */}
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${pct}%` }} />
          </div>
          {pct === 100 && (
            <div style={{ marginTop: 10, fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              🎉 You're all settled in — welcome to the UK!
            </div>
          )}
        </div>
      </div>

      {/* Task categories */}
      {Object.entries(grouped).map(([category, categoryTasks]) => {
        const catColors = categoryColors[category] || { bg: 'var(--cream)', color: 'var(--text)', border: 'var(--border)' };
        const catDone = categoryTasks.filter(t => t.completed).length;
        return (
          <div key={category} style={{ marginBottom: '2rem' }}>
            {/* Category header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{ ...styles.catBadge, background: catColors.bg, color: catColors.color, border: `1px solid ${catColors.border}` }}>
                {category}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                {catDone}/{categoryTasks.length} done
              </div>
              {catDone === categoryTasks.length && (
                <span style={{ fontSize: 14 }}>✅</span>
              )}
            </div>

            {/* Tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categoryTasks.map(task => (
                <div key={task.key} style={{
                  ...styles.taskCard,
                  background: task.completed ? 'var(--green-light)' : '#fff',
                  borderColor: task.completed ? '#9FE1CB' : 'var(--border)',
                  opacity: task.completed ? 0.85 : 1,
                }}>
                  {/* Checkbox */}
                  <button
                    onClick={() => toggle(task.key, task.completed)}
                    disabled={updating[task.key]}
                    style={{
                      ...styles.checkbox,
                      background: task.completed ? 'var(--green)' : '#fff',
                      borderColor: task.completed ? 'var(--green)' : 'var(--border-dark)',
                    }}>
                    {task.completed && <span style={{ color: '#fff', fontSize: 14, lineHeight: 1 }}>✓</span>}
                  </button>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 18 }}>{task.icon}</span>
                      <span style={{
                        fontWeight: 600, fontSize: 14,
                        color: task.completed ? 'var(--green)' : 'var(--text)',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}>
                        {task.title}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: task.link ? 8 : 0 }}>
                      {task.desc}
                    </p>
                    {task.link && (
                      <a href={task.link}
                        target={task.link.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        style={styles.taskLink}>
                        Learn more →
                      </a>
                    )}
                    {task.completed && task.completed_at && (
                      <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 4, fontWeight: 600 }}>
                        ✓ Completed {new Date(task.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  progressCard: {
    background: 'linear-gradient(135deg,var(--green),var(--green-mid))',
    borderRadius: 20,
    padding: '1.5rem',
    marginBottom: '2rem',
    display: 'flex',
    gap: 16,
    alignItems: 'center',
  },
  pctCircle: {
    width: 70, height: 70, borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    border: '2px solid rgba(255,255,255,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  progressBarBg: {
    height: 8, borderRadius: 4,
    background: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', borderRadius: 4,
    background: '#fff',
    transition: 'width 0.4s ease',
  },
  catBadge: {
    padding: '5px 14px', borderRadius: 50,
    fontSize: 12, fontWeight: 700,
    letterSpacing: '0.3px',
  },
  taskCard: {
    border: '1.5px solid',
    borderRadius: 16,
    padding: '1rem',
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    transition: 'all .2s',
  },
  checkbox: {
    width: 28, height: 28,
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all .2s',
    marginTop: 2,
  },
  taskLink: {
    fontSize: 12, fontWeight: 700,
    color: 'var(--green)',
    textDecoration: 'none',
  },
};