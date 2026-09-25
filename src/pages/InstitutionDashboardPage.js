import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function InstitutionDashboardPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    axios.get('/api/demo/dashboard')
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || 'Error loading dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const formatAction = (action) => {
    const map = {
      ai_chat: '🤖 Used AI Assistant',
      document_analysed: '📄 Analysed a document',
      checklist_completed: '✅ Completed a checklist task',
      wellbeing_visited: '💚 Visited Wellbeing Hub',
    };
    return map[action] || action.replace(/_/g, ' ');
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏫</div>
      Loading your institution dashboard...
    </div>
  );

  if (error) return (
    <div style={{ background: '#fff1f0', border: '1px solid #ffc9c9', borderRadius: 12, padding: '1rem', color: '#c92a2a', fontSize: 14 }}>
      {error}
    </div>
  );

  if (!data) return null;

  const urgentDemo = data.days_left !== null && data.days_left <= 3;

  return (
    <div>
      {/* Institution Header */}
      <div style={styles.header}>
        <div style={styles.headerBg} />
         <div style={styles.headerContent}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
            <div style={styles.institutionBadge}>🏫 Institution Dashboard</div>
            <button
              onClick={() => { logout(); }}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 50, padding: '6px 16px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Sign Out
            </button>
          </div>
          <h1 style={styles.institutionName}>{data.institution}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4 }}>
            Settle-In Buddy — International Student Settlement Platform
          </p>
        </div>
      </div>

      {/* Demo banner */}
      {data.is_demo && (
        <div style={{
          ...styles.demoBanner,
          background: urgentDemo
            ? 'linear-gradient(135deg,#dc2626,#ef4444)'
            : 'linear-gradient(135deg,#f5a623,#f07020)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
              {urgentDemo ? '🚨 Demo Expiring Soon' : '🎓 Demo Account'}
            </div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>
              {data.days_left > 0
                ? `${data.days_left} day${data.days_left !== 1 ? 's' : ''} remaining — this is a live preview of your institution's dashboard`
                : 'Demo expires today'}
            </div>
          </div>
          <a href="mailto:partners@settlebuddy.uk?subject=Partnership Enquiry"
            style={styles.upgradeBtn}>
            Upgrade to Full Access →
          </a>
        </div>
      )}

      {/* Summary stats */}
      <div style={styles.statsGrid}>
        {[
          { icon: '🎓', label: 'Total Students', value: data.summary.total_students, color: 'var(--green)' },
          { icon: '⭐', label: 'Premium Students', value: data.summary.premium_students, sub: `${data.summary.premium_rate}% conversion`, color: '#f07020' },
          { icon: '🤝', label: 'Buddy Matched', value: data.summary.matched_students, sub: `${data.summary.match_rate}% match rate`, color: '#7c3aed' },
          { icon: '✅', label: 'Avg Checklist', value: `${data.summary.avg_checklist_completion}%`, sub: 'completion rate', color: '#185fa5' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 900, color: s.color, marginBottom: 2 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {s.label}
            </div>
            {s.sub && <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 3 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { key: 'overview', label: '📊 Overview' },
          { key: 'students', label: `🎓 Students (${data.summary.total_students})` },
          { key: 'activity', label: '🕐 Activity' },
          { key: 'upgrade', label: '⭐ Get Full Access' },
        ].map(t => (
          <button key={t.key}
            style={{ ...styles.tab, ...(tab === t.key ? styles.tabActive : {}) }}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* What students can do */}
          <div className="card">
            <h3 style={styles.cardTitle}>What your students get with Settle-In Buddy</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,200px),1fr))', gap: '0.75rem' }}>
              {[
                { icon: '🤖', title: 'AI Settlement Assistant', desc: 'Answers student visa questions, NHS, NI, banking 24/7' },
                { icon: '✅', title: 'Arrival Checklist', desc: '20 personalised tasks from pre-arrival to first month' },
                { icon: '🤝', title: 'Buddy Matching', desc: 'Connect with verified buddies who speak their language' },
                { icon: '📋', title: 'Compliance Planner', desc: 'Track work hours and Graduate visa eligibility' },
                { icon: '🎓', title: 'Graduate Visa Guide', desc: 'Complete guide to staying in the UK after their degree' },
                { icon: '💚', title: 'Wellbeing Hub', desc: 'Mental health, cultural adaptation and emergency contacts' },
                { icon: '📄', title: 'Document Assistant', desc: 'Upload and understand immigration documents' },
                { icon: '🏡', title: 'Accommodation', desc: 'Verified UK student accommodation listings' },
              ].map(f => (
                <div key={f.title} style={{ background: 'var(--cream)', borderRadius: 12, padding: '0.875rem' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{f.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Institution-specific features */}
          <div className="card" style={{ borderLeft: '4px solid var(--green)' }}>
            <h3 style={styles.cardTitle}>🏫 What your institution gets</h3>
            {[
              { icon: '🤖', title: 'AI personalised for your campus', desc: 'Add your international office details, campus GP, local services and events. The AI automatically includes this information when your students ask questions.' },
              { icon: '📊', title: 'Analytics dashboard', desc: 'See your students\' engagement rates, checklist completion, buddy match rates and weekly active users — all scoped to your institution.' },
              { icon: '🔗', title: 'Referral tracking', desc: 'A unique referral link for your institution. Every student who registers via your link is tagged to you, tracked and attributed.' },
              { icon: '🎨', title: 'White-label option', desc: 'Your students can see your institution branding, your logo and your content — making Settle-In Buddy feel like part of your welcome programme.' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="card" style={{ background: 'linear-gradient(135deg,var(--green),var(--green-mid))', color: '#fff' }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', color: '#fff', marginBottom: 8 }}>
              University pricing — scales with you
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: '1rem', lineHeight: 1.7 }}>
              At <strong>£2 per enrolled international student per year</strong>, the cost scales naturally with your institution size.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))', gap: 8 }}>
              {[
                { students: '250', cost: '£500/yr' },
                { students: '500', cost: '£1,000/yr' },
                { students: '1,000', cost: '£2,000/yr' },
                { students: '5,000', cost: '£10,000/yr' },
              ].map(r => (
                <div key={r.students} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{r.cost}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{r.students} students</div>
                </div>
              ))}
            </div>
            <button
              style={{ marginTop: '1rem', width: '100%', padding: '12px', background: '#fff', color: 'var(--green)', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
              onClick={() => setTab('upgrade')}>
              Get Full Access →
            </button>
          </div>
        </div>
      )}

      {/* ── STUDENTS TAB ── */}
      {tab === 'students' && (
        <div>
          {data.students.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎓</div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>No students yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Share your referral link with incoming students and they'll appear here when they register.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: '#fff', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, padding: '10px 16px', background: 'var(--green)', fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <div>Student</div>
                <div>Checklist</div>
                <div>Buddy</div>
                <div>Status</div>
              </div>
              {data.students.map((s, i) => {
                const checklistPct = Math.round((parseInt(s.tasks_done) / 20) * 100);
                return (
                  <div key={s.id} style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: 8, padding: '12px 16px', alignItems: 'center',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    background: i % 2 === 0 ? '#fff' : 'var(--cream)',
                  }}>
                    {/* Name + email */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.email}
                      </div>
                    </div>
                    {/* Checklist */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: checklistPct >= 50 ? 'var(--green)' : 'var(--text-muted)', marginBottom: 3 }}>
                        {checklistPct}%
                      </div>
                      <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${checklistPct}%`, height: '100%', background: 'var(--green)', borderRadius: 3 }} />
                      </div>
                    </div>
                    {/* Buddy */}
                    <div style={{ fontSize: 12 }}>
                      {s.buddy_name ? (
                        <span style={{ color: 'var(--green)', fontWeight: 600 }}>🤝 {s.buddy_name.split(' ')[0]}</span>
                      ) : (
                        <span style={{ color: 'var(--text-faint)' }}>Unmatched</span>
                      )}
                    </div>
                    {/* Premium status */}
                    <div>
                      {s.is_premium ? (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 50, background: 'linear-gradient(135deg,#f5a623,#f07020)', color: '#fff' }}>⭐ Premium</span>
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 50, background: 'var(--cream-dark)', color: 'var(--text-muted)' }}>Free</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── ACTIVITY TAB ── */}
      {tab === 'activity' && (
        <div className="card">
          <h3 style={styles.cardTitle}>Recent Student Activity</h3>
          {data.recent_activity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: 13 }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🕐</div>
              No activity recorded yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.recent_activity.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                  <div style={{ fontSize: 20, flexShrink: 0 }}>
                    {a.action === 'ai_chat' ? '🤖' : a.action === 'document_analysed' ? '📄' : a.action === 'checklist_completed' ? '✅' : '💚'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {formatAction(a.action)}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', flexShrink: 0 }}>
                    {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── UPGRADE TAB ── */}
      {tab === 'upgrade' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 560, margin: '0 auto' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚀</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', marginBottom: 8 }}>
              Ready to go live?
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Your demo shows real platform data with pre-loaded students. The full version connects to your actual incoming cohort and includes everything you see here — plus white-label branding, your own content in the AI and a dedicated account manager.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem', textAlign: 'left' }}>
              {[
                'Your branding — logo, colours, domain',
                'AI assistant trained on your campus info',
                'Your own accommodation and service listings',
                'Student analytics tied to your enrolment data',
                'Referral link for your welcome email',
                'Dedicated account manager',
                'Annual billing — £2 per enrolled international student',
              ].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14 }}>
                  <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <a
              href="mailto:partners@settlebuddy.uk?subject=Ready to upgrade — Full Partnership Enquiry"
              style={{ display: 'block', width: '100%', padding: '14px', background: 'var(--green)', color: '#fff', borderRadius: 50, textDecoration: 'none', fontSize: 15, fontWeight: 700, textAlign: 'center', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 10 }}
            >
              Email Us to Get Started →
            </a>

            <a
              href="tel:+447000000000"
              style={{ display: 'block', fontSize: 13, color: 'var(--green)', fontWeight: 600 }}
            >
              Or call our partnership team
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: '1.5rem', minHeight: 160 },
  headerBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0a5c44 0%,#0f7a5a 60%,#185fa5 100%)' },
  headerContent: { position: 'relative', zIndex: 1, padding: '2rem 1.5rem' },
  institutionBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 14px', borderRadius: 50, fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: '0.5px' },
  institutionName: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#fff', fontWeight: 900, lineHeight: 1.2, marginBottom: 4 },
  demoBanner: { borderRadius: 14, padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', color: '#fff' },
  upgradeBtn: { background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 50, padding: '8px 16px', color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,160px),1fr))', gap: '1rem', marginBottom: '1.5rem' },
  tabs: { display: 'flex', background: 'var(--cream-dark)', borderRadius: 14, padding: 4, marginBottom: '1.5rem', gap: 4, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' },
  tab: { flex: 1, padding: '9px 8px', border: 'none', background: 'transparent', borderRadius: 10, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s', minHeight: 40, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" },
  tabActive: { background: '#fff', color: 'var(--green)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardTitle: { fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1rem' },
};