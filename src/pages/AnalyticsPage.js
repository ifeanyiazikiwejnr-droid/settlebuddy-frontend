import { useState, useEffect } from 'react';
import axios from 'axios';

const FEATURE_COLORS = ['#0a5c44','#ff5c3a','#185fa5','#7c3aed','#f5a623','#059669','#dc2626','#0f766e'];

function StatCard({ label, value, sub, color = 'var(--green)', icon }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
      <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>{icon}</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 900, color, marginBottom: 2 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data, valueKey, labelKey, color = 'var(--green)', height = 160 }) {
  if (!data?.length) return <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No data yet</p>;
  const max = Math.max(...data.map(d => d[valueKey])) || 1;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, paddingTop: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: '1 0 auto', minWidth: 36 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{d[valueKey]}</div>
          <div style={{
            width: '100%', minWidth: 28,
            height: Math.max(4, (d[valueKey] / max) * (height - 40)),
            background: color,
            borderRadius: '4px 4px 0 0',
            transition: 'height 0.3s ease',
          }} />
          <div style={{ fontSize: 10, color: 'var(--text-faint)', textAlign: 'center', lineHeight: 1.2, maxWidth: 48, wordBreak: 'break-word' }}>
            {d[labelKey]}
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ value, total, color = 'var(--green)', label }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const circumference = 2 * Math.PI * 36;
  const strokeDash = (pct / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="36" fill="none" stroke="var(--border)" strokeWidth="10"/>
        <circle cx="50" cy="50" r="36" fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 18, fontWeight: 900, fill: color, fontFamily: 'Calibri,sans-serif' }}>
          {pct}%
        </text>
      </svg>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{value} of {total}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    axios.get('/api/analytics/overview')
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || 'Error loading analytics'))
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'engagement', label: '📈 Engagement' },
    { key: 'features', label: '🔧 Features' },
    { key: 'activity', label: '🕐 Activity' },
  ];

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2rem', marginBottom: 12 }}>📊</div>
      Loading analytics...
    </div>
  );

  if (error) return (
    <div style={{ background: '#fff1f0', border: '1px solid #ffc9c9', borderRadius: 12, padding: '1rem', color: '#c92a2a', fontSize: 14 }}>
      {error}
    </div>
  );

  const premiumRate = data?.totals.students > 0
    ? Math.round((data.totals.premium / data.totals.students) * 100)
    : 0;

  const matchRate = data?.match_rate.eligible > 0
    ? Math.round((data.match_rate.matched / data.match_rate.eligible) * 100)
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h2>Analytics Dashboard</h2>
        <p>Platform engagement and usage metrics</p>
      </div>

      {/* Export button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn-outline" style={{ fontSize: 13, padding: '8px 16px' }}
          onClick={() => {
            const csv = [
              ['Metric', 'Value'],
              ['Total Students', data.totals.students],
              ['Premium Students', data.totals.premium],
              ['Verified Buddies', data.totals.buddies],
              ['Active Matches', data.totals.matches],
              ['Messages Sent (30d)', data.totals.messages],
              ['Premium Conversion Rate', `${premiumRate}%`],
              ['Buddy Match Rate', `${matchRate}%`],
              ['Avg Checklist Completion', `${data.checklist.avg_completion}%`],
            ].map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'settlebuddy-analytics.csv';
            a.click();
          }}>
          📥 Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map(t => (
          <button key={t.key}
            style={{ ...styles.tab, ...(tab === t.key ? styles.tabActive : {}) }}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Key metrics grid */}
          <div style={styles.statsGrid}>
            <StatCard icon="🎓" label="Total Students" value={data.totals.students} color="var(--green)" />
            <StatCard icon="🤝" label="Verified Buddies" value={data.totals.buddies} color="#185fa5" />
            <StatCard icon="⭐" label="Premium Students" value={data.totals.premium} sub={`${premiumRate}% conversion`} color="#f07020" />
            <StatCard icon="💬" label="Active Matches" value={data.totals.matches} color="#7c3aed" />
            <StatCard icon="📨" label="Messages (30d)" value={data.totals.messages} color="#059669" />
            <StatCard icon="📄" label="Docs Analysed (30d)" value={data.totals.documents} color="#dc2626" />
          </div>

          {/* Donut charts row */}
          <div className="card">
            <h3 style={styles.cardTitle}>Key Rates</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem', padding: '1rem 0' }}>
              <DonutChart
                value={data.totals.premium}
                total={data.totals.students}
                color="#f07020"
                label="Premium Conversion"
              />
              <DonutChart
                value={data.match_rate.matched}
                total={data.match_rate.eligible}
                color="#7c3aed"
                label="Buddy Match Rate"
              />
              <DonutChart
                value={data.checklist.students_using}
                total={data.totals.students}
                color="var(--green)"
                label="Checklist Adoption"
              />
              <DonutChart
                value={parseFloat(data.checklist.avg_completion)}
                total={100}
                color="#185fa5"
                label="Avg Checklist Complete"
              />
            </div>
          </div>

          {/* Weekly registrations */}
          <div className="card">
            <h3 style={styles.cardTitle}>New Student Registrations — Last 8 Weeks</h3>
            <BarChart
              data={data.weekly_registrations}
              valueKey="new_users"
              labelKey="week"
              color="var(--green)"
            />
          </div>
        </div>
      )}

      {/* ── ENGAGEMENT TAB ── */}
      {tab === 'engagement' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Weekly active users chart */}
          <div className="card">
            <h3 style={styles.cardTitle}>Weekly Active Users — Last 8 Weeks</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Users who interacted with the AI assistant, checklist, documents or wellbeing hub
            </p>
            {data.weekly_active.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: 13 }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📊</div>
                Activity data will appear here as students use the platform
              </div>
            ) : (
              <BarChart
                data={data.weekly_active}
                valueKey="active_users"
                labelKey="week"
                color="#185fa5"
              />
            )}
          </div>

          {/* Languages */}
          <div className="card">
            <h3 style={styles.cardTitle}>Languages Spoken by Buddies</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.languages.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No buddy language data yet</p>
              ) : (
                data.languages.map((l, i) => {
                  const max = data.languages[0].count;
                  const pct = Math.round((l.count / max) * 100);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 80, fontSize: 13, fontWeight: 600, color: 'var(--text)', flexShrink: 0 }}>
                        {l.language}
                      </div>
                      <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: FEATURE_COLORS[i % FEATURE_COLORS.length], borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0, width: 20, textAlign: 'right' }}>
                        {l.count}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Buddy matching summary */}
          <div className="card">
            <h3 style={styles.cardTitle}>Buddy Matching Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '1rem' }}>
              {[
                { label: 'Premium students', value: data.match_rate.eligible, color: '#f07020' },
                { label: 'Matched students', value: data.match_rate.matched, color: '#7c3aed' },
                { label: 'Unmatched', value: Math.max(0, data.match_rate.eligible - data.match_rate.matched), color: 'var(--text-muted)' },
                { label: 'Match rate', value: `${matchRate}%`, color: 'var(--green)' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: '1rem', background: 'var(--cream)', borderRadius: 12 }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', fontWeight: 900, color: item.color, marginBottom: 4 }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FEATURES TAB ── */}
      {tab === 'features' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={styles.cardTitle}>Feature Usage — Last 30 Days</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Number of times each feature was used across all students
            </p>
            {data.feature_usage.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: 13 }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔧</div>
                Feature usage data will appear here as students use the platform
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.feature_usage.map((f, i) => {
                  const max = data.feature_usage[0].count;
                  const pct = Math.round((f.count / max) * 100);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 130, fontSize: 13, fontWeight: 500, color: 'var(--text)', flexShrink: 0 }}>
                        {f.action}
                      </div>
                      <div style={{ flex: 1, height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: FEATURE_COLORS[i % FEATURE_COLORS.length], borderRadius: 5, transition: 'width 0.4s ease' }} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: FEATURE_COLORS[i % FEATURE_COLORS.length], flexShrink: 0, width: 36, textAlign: 'right' }}>
                        {f.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checklist stats */}
          <div className="card">
            <h3 style={styles.cardTitle}>Arrival Checklist Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '1rem' }}>
              {[
                { label: 'Students using checklist', value: data.checklist.students_using, color: 'var(--green)' },
                { label: 'Avg completion rate', value: `${data.checklist.avg_completion}%`, color: '#185fa5' },
                { label: 'Total students', value: data.totals.students, color: 'var(--text-muted)' },
                { label: 'Adoption rate', value: data.totals.students > 0 ? `${Math.round((data.checklist.students_using / data.totals.students) * 100)}%` : '0%', color: '#f07020' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: '1rem', background: 'var(--cream)', borderRadius: 12 }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', fontWeight: 900, color: item.color, marginBottom: 4 }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.4 }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVITY TAB ── */}
      {tab === 'activity' && (
        <div className="card">
          <h3 style={styles.cardTitle}>Recent Activity Feed</h3>
          {data.recent_activity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: 13 }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🕐</div>
              No activity recorded yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {data.recent_activity.map((a, i) => {
                const actionLabel = a.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const actionIcon = {
                  'ai_chat': '🤖',
                  'document_analysed': '📄',
                  'checklist_completed': '✅',
                  'wellbeing_visited': '💚',
                }[a.action] || '📋';
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: 18, flexShrink: 0 }}>{actionIcon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                        {a.name}
                        <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>
                          {actionLabel}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
                        {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px',
                      borderRadius: 50, flexShrink: 0,
                      background: a.role === 'student' ? 'var(--green-light)' : 'var(--amber-light)',
                      color: a.role === 'student' ? 'var(--green)' : '#92600a',
                    }}>
                      {a.role}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,160px),1fr))', gap: '1rem' },
  tabs: { display: 'flex', background: 'var(--cream-dark)', borderRadius: 14, padding: 4, marginBottom: '1.5rem', gap: 4, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' },
  tab: { flex: 1, padding: '9px 8px', border: 'none', background: 'transparent', borderRadius: 10, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s', minHeight: 40, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" },
  tabActive: { background: '#fff', color: 'var(--green)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardTitle: { fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1rem' },
};