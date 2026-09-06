import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const TERM_LIMIT = 20;
const HOLIDAY_LIMIT = 40;

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CompliancePage() {
  const { showToast } = useOutletContext();
  const [tab, setTab] = useState('hours');
  const [hours, setHours] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Hours form
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [hoursWorked, setHoursWorked] = useState('');
  const [isHoliday, setIsHoliday] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    university: '',
    course_name: '',
    course_start: '',
    course_end: '',
    visa_expiry: '',
  });

  useEffect(() => {
    axios.get('/api/compliance')
      .then(res => {
        setHours(res.data.hours);
        if (res.data.profile) {
          setProfile(res.data.profile);
          setProfileForm({
            university: res.data.profile.university || '',
            course_name: res.data.profile.course_name || '',
            course_start: res.data.profile.course_start?.split('T')[0] || '',
            course_end: res.data.profile.course_end?.split('T')[0] || '',
            visa_expiry: res.data.profile.visa_expiry?.split('T')[0] || '',
          });
        }
      })
      .catch(() => showToast('Error loading compliance data'))
      .finally(() => setLoading(false));
  }, []);

  const logHours = async () => {
    if (!hoursWorked || isNaN(hoursWorked)) return showToast('Please enter valid hours');
    const h = parseFloat(hoursWorked);
    if (h < 0 || h > 168) return showToast('Hours must be between 0 and 168');
    const limit = isHoliday ? HOLIDAY_LIMIT : TERM_LIMIT;
    if (h > limit && !window.confirm(`${h} hours exceeds the ${limit}hr ${isHoliday ? 'holiday' : 'term-time'} limit. Log anyway?`)) return;
    setSaving(true);
    try {
      await axios.post('/api/compliance/hours', {
        week_start: weekStart,
        hours_worked: h,
        is_holiday: isHoliday,
      });
      const res = await axios.get('/api/compliance');
      setHours(res.data.hours);
      setHoursWorked('');
      showToast('Hours logged!');
    } catch { showToast('Error logging hours'); }
    finally { setSaving(false); }
  };

  const deleteHours = async (week) => {
    try {
      await axios.delete(`/api/compliance/hours/${week}`);
      setHours(h => h.filter(r => r.week_start !== week));
      showToast('Entry removed');
    } catch { showToast('Error removing entry'); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await axios.post('/api/compliance/profile', profileForm);
      setProfile(profileForm);
      showToast('Profile saved!');
      setTab('hours');
    } catch { showToast('Error saving profile'); }
    finally { setSaving(false); }
  };

  // Calculations
  const thisWeek = getMonday(new Date());
  const thisWeekEntry = hours.find(h => h.week_start?.split('T')[0] === thisWeek);
  const totalHours = hours.reduce((s, h) => s + parseFloat(h.hours_worked), 0);
  const violations = hours.filter(h => {
    const limit = h.is_holiday ? HOLIDAY_LIMIT : TERM_LIMIT;
    return parseFloat(h.hours_worked) > limit;
  });
  const visaDaysLeft = profile?.visa_expiry ? daysUntil(profile.visa_expiry) : null;
  const courseDaysLeft = profile?.course_end ? daysUntil(profile.course_end) : null;

  // Graduate visa eligibility
  // Eligible if course ends within 6 months and studied for at least 1 year
  const courseStarted = profile?.course_start ? new Date(profile.course_start) : null;
  const courseEnded = profile?.course_end ? new Date(profile.course_end) : null;
  const monthsStudied = courseStarted ? Math.floor((new Date() - courseStarted) / (1000 * 60 * 60 * 24 * 30)) : 0;
  const gradVisaEligible = monthsStudied >= 12 && courseDaysLeft !== null && courseDaysLeft <= 180;
  const gradVisaProgress = Math.min(100, Math.floor((monthsStudied / 12) * 100));

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Compliance & Pathway Planner</h2>
        <p>Track your work hours, visa dates and Graduate visa eligibility</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { key: 'hours', label: '⏱ Work Hours' },
          { key: 'visa', label: '🛂 Visa & Course' },
          { key: 'graduate', label: '🎓 Graduate Visa' },
          { key: 'profile', label: '⚙️ My Profile' },
        ].map(t => (
          <button key={t.key} style={{ ...styles.tab, ...(tab === t.key ? styles.tabActive : {}) }}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── WORK HOURS TAB ── */}
      {tab === 'hours' && (
        <div>
          {/* This week status */}
          <div style={{
            ...styles.statusCard,
            background: thisWeekEntry
              ? (parseFloat(thisWeekEntry.hours_worked) > (thisWeekEntry.is_holiday ? HOLIDAY_LIMIT : TERM_LIMIT)
                ? 'linear-gradient(135deg,#dc2626,#ef4444)'
                : 'linear-gradient(135deg,var(--green),var(--green-mid))')
              : 'linear-gradient(135deg,#6b7280,#9ca3af)',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
                This week ({formatDate(thisWeek)})
              </div>
              {thisWeekEntry ? (
                <>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', color: '#fff', fontWeight: 900, lineHeight: 1 }}>
                    {parseFloat(thisWeekEntry.hours_worked)}h
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
                    {parseFloat(thisWeekEntry.hours_worked) > (thisWeekEntry.is_holiday ? HOLIDAY_LIMIT : TERM_LIMIT)
                      ? '⚠️ Exceeds visa limit!'
                      : `✓ Within ${thisWeekEntry.is_holiday ? 'holiday' : 'term-time'} limit`}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 15, color: '#fff', fontWeight: 600, marginTop: 4 }}>
                  No hours logged yet
                </div>
              )}
            </div>
            <div style={styles.limitBadge}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>Limit</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', color: '#fff', fontWeight: 900 }}>
                {thisWeekEntry?.is_holiday ? HOLIDAY_LIMIT : TERM_LIMIT}h
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>per week</div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: 'var(--green)', marginBottom: 4 }}>{hours.length}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weeks Logged</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: 'var(--green)', marginBottom: 4 }}>{totalHours.toFixed(1)}h</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Hours</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: violations.length > 0 ? 'var(--coral)' : 'var(--green)', marginBottom: 4 }}>{violations.length}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Over Limit</div>
            </div>
          </div>

          {/* Log hours form */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1rem' }}>Log This Week's Hours</h3>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Week Starting</label>
                <input type="date" value={weekStart}
                  onChange={e => setWeekStart(getMonday(e.target.value))} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Hours Worked</label>
                <input type="number" min="0" max="168" step="0.5"
                  value={hoursWorked}
                  onChange={e => setHoursWorked(e.target.value)}
                  placeholder="e.g. 18"
                  onKeyDown={e => e.key === 'Enter' && logHours()} />
              </div>
            </div>
            <div style={styles.toggleRow}>
              <button
                style={{ ...styles.toggleBtn, ...(isHoliday ? styles.toggleActive : {}) }}
                onClick={() => setIsHoliday(false)}>
                📚 Term Time (max 20h)
              </button>
              <button
                style={{ ...styles.toggleBtn, ...(isHoliday ? styles.toggleActiveHoliday : {}) }}
                onClick={() => setIsHoliday(true)}>
                🌴 Holiday (max 40h)
              </button>
            </div>

            {/* Limit info */}
            <div style={styles.infoBox}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                {isHoliday ? '🌴 Holiday Rules' : '📚 Term-Time Rules'}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                {isHoliday
                  ? 'During official university holidays you can work full time — up to 40 hours per week.'
                  : 'During term time your Student visa allows you to work up to 20 hours per week. This includes paid and unpaid work, volunteering and work placements.'}
              </p>
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: 8 }}
              onClick={logHours} disabled={saving || !hoursWorked}>
              {saving ? 'Saving...' : '+ Log Hours'}
            </button>
          </div>

          {/* Hours history */}
          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1rem' }}>Hours History</h3>
            {hours.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '1rem' }}>
                No hours logged yet. Start tracking above.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {hours.map((h, i) => {
                  const limit = h.is_holiday ? HOLIDAY_LIMIT : TERM_LIMIT;
                  const over = parseFloat(h.hours_worked) > limit;
                  const pct = Math.min(100, (parseFloat(h.hours_worked) / limit) * 100);
                  return (
                    <div key={h.id} style={{ ...styles.hoursRow, borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>
                            w/c {formatDate(h.week_start)}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: h.is_holiday ? '#e6f1fb' : 'var(--green-light)', color: h.is_holiday ? '#185fa5' : 'var(--green)' }}>
                            {h.is_holiday ? '🌴 Holiday' : '📚 Term'}
                          </span>
                          {over && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: 'var(--coral-light)', color: 'var(--coral-dark)' }}>⚠️ Over limit</span>}
                        </div>
                        {/* Progress bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: over ? 'var(--coral)' : 'var(--green)', borderRadius: 3, transition: 'width .3s' }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: over ? 'var(--coral)' : 'var(--green)', flexShrink: 0 }}>
                            {parseFloat(h.hours_worked)}h / {limit}h
                          </span>
                        </div>
                      </div>
                      <button style={styles.deleteBtn} onClick={() => deleteHours(h.week_start?.split('T')[0])}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VISA & COURSE TAB ── */}
      {tab === 'visa' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!profile ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>⚙️</div>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Set up your profile first</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>Add your course and visa dates to see your timeline and get personalised alerts.</p>
              <button className="btn-primary" style={{ padding: '11px 24px' }} onClick={() => setTab('profile')}>
                Set Up Profile →
              </button>
            </div>
          ) : (
            <>
              {/* Visa status */}
              <div style={{ ...styles.dateCard, borderColor: visaDaysLeft !== null && visaDaysLeft < 90 ? 'var(--coral)' : '#9FE1CB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>🛂 Visa Expiry</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: visaDaysLeft !== null && visaDaysLeft < 90 ? 'var(--coral)' : 'var(--green)' }}>
                      {formatDate(profile.visa_expiry)}
                    </div>
                  </div>
                  {visaDaysLeft !== null && (
                    <div style={{ ...styles.daysLeft, background: visaDaysLeft < 90 ? 'var(--coral-light)' : 'var(--green-light)', color: visaDaysLeft < 90 ? 'var(--coral-dark)' : 'var(--green)' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: "'Playfair Display',serif" }}>{visaDaysLeft}</div>
                      <div style={{ fontSize: 10 }}>days left</div>
                    </div>
                  )}
                </div>
                {visaDaysLeft !== null && visaDaysLeft < 90 && (
                  <div style={styles.warningBox}>
                    ⚠️ Your visa expires in less than 90 days. Start your extension or Graduate visa application now.
                    <a href="https://www.gov.uk/student-visa/extend-your-visa" target="_blank" rel="noreferrer" style={{ color: 'var(--coral-dark)', fontWeight: 700, marginLeft: 4 }}>
                      Apply on gov.uk →
                    </a>
                  </div>
                )}
              </div>

              {/* Course dates */}
              <div style={{ ...styles.dateCard, borderColor: '#9FE1CB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>🎓 Course End Date</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: 'var(--green)' }}>
                      {formatDate(profile.course_end)}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{profile.course_name} · {profile.university}</div>
                  </div>
                  {courseDaysLeft !== null && (
                    <div style={{ ...styles.daysLeft, background: 'var(--green-light)', color: 'var(--green)' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: "'Playfair Display',serif" }}>{courseDaysLeft}</div>
                      <div style={{ fontSize: 10 }}>days left</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Course timeline */}
              <div className="card">
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1rem' }}>Course Timeline</h3>
                {(() => {
                  const start = new Date(profile.course_start);
                  const end = new Date(profile.course_end);
                  const now = new Date();
                  const total = end - start;
                  const elapsed = Math.max(0, Math.min(total, now - start));
                  const pct = Math.round((elapsed / total) * 100);
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                        <span>{formatDate(profile.course_start)}</span>
                        <span>{pct}% complete</span>
                        <span>{formatDate(profile.course_end)}</span>
                      </div>
                      <div style={{ height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,var(--green),var(--green-mid))', borderRadius: 5 }} />
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
                        {monthsStudied} months studied · {Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24 * 30)))} months remaining
                      </div>
                    </>
                  );
                })()}
              </div>

              <button className="btn-outline" style={{ padding: '10px' }} onClick={() => setTab('profile')}>
                ✏️ Edit Profile
              </button>
            </>
          )}
        </div>
      )}

      {/* ── GRADUATE VISA TAB ── */}
      {tab === 'graduate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Eligibility card */}
          <div style={{ ...styles.statusCard, background: gradVisaEligible ? 'linear-gradient(135deg,var(--green),var(--green-mid))' : 'linear-gradient(135deg,#6b7280,#9ca3af)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>Graduate Visa Eligibility</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: '#fff', fontWeight: 900, marginBottom: 4 }}>
                {gradVisaEligible ? '✓ Eligible to Apply' : 'Not Yet Eligible'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                {gradVisaEligible
                  ? 'You can apply for the Graduate visa when your course ends.'
                  : monthsStudied < 12
                    ? `${12 - monthsStudied} more months of study needed`
                    : 'You can apply within 6 months of your course ending'}
              </div>
            </div>
          </div>

          {/* Progress to eligibility */}
          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1rem' }}>Progress to Graduate Visa</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  label: 'Study Duration',
                  desc: 'Must have studied in the UK for at least 12 months',
                  done: monthsStudied >= 12,
                  progress: gradVisaProgress,
                  detail: `${monthsStudied} / 12 months`,
                },
                {
                  label: 'Eligible Course',
                  desc: 'Your course must be at undergraduate level or above at a licensed student sponsor',
                  done: !!profile,
                  progress: profile ? 100 : 0,
                  detail: profile ? `${profile.course_name || 'Course set'}` : 'Set up your profile',
                },
                {
                  label: 'Valid Student Visa',
                  desc: 'You must currently hold a valid UK Student visa',
                  done: visaDaysLeft !== null && visaDaysLeft > 0,
                  progress: visaDaysLeft !== null && visaDaysLeft > 0 ? 100 : 0,
                  detail: visaDaysLeft !== null ? (visaDaysLeft > 0 ? `${visaDaysLeft} days remaining` : 'Expired') : 'Add visa expiry date',
                },
                {
                  label: 'Apply at the Right Time',
                  desc: 'Apply no earlier than 6 months before your course ends or after it ends',
                  done: gradVisaEligible,
                  progress: courseDaysLeft !== null ? Math.min(100, Math.max(0, Math.floor(((180 - courseDaysLeft) / 180) * 100))) : 0,
                  detail: courseDaysLeft !== null ? (courseDaysLeft <= 180 ? 'Window is open' : `Opens in ${courseDaysLeft - 180} days`) : 'Set your course end date',
                },
              ].map(item => (
                <div key={item.label} style={styles.criteriaRow}>
                  <div style={{ ...styles.criteriaCheck, background: item.done ? 'var(--green)' : 'var(--border)' }}>
                    {item.done ? <span style={{ color: '#fff', fontSize: 12 }}>✓</span> : <span style={{ color: '#fff', fontSize: 12 }}>○</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, lineHeight: 1.5 }}>{item.desc}</div>
                    <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
                      <div style={{ width: `${item.progress}%`, height: '100%', background: item.done ? 'var(--green)' : 'var(--amber)', borderRadius: 3, transition: 'width .4s' }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key info */}
          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1rem' }}>About the Graduate Visa</h3>
            {[
              { icon: '📅', title: '2 years to stay', desc: 'The Graduate visa lets you stay in the UK for 2 years after graduating (3 years for PhD graduates).' },
              { icon: '💼', title: 'Work freely', desc: 'You can work in most jobs at any skill level — no sponsorship needed. Great for building UK work experience.' },
              { icon: '💷', title: 'Fee', desc: 'The application fee is £700. You must also pay the Immigration Health Surcharge.' },
              { icon: '⚠️', title: 'One-time only', desc: 'You cannot extend the Graduate visa or switch back to a Student visa. Plan carefully.' },
              { icon: '🏠', title: 'Path to settlement', desc: 'After the Graduate visa you can switch to a Skilled Worker visa if you get a sponsored job, which can lead to Indefinite Leave to Remain.' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
            <button className="btn-primary" style={{ width: '100%', padding: '11px', fontSize: 13, marginTop: '1rem' }}
              onClick={() => navigate('/graduate-visa')}>
              📖 Full Graduate Visa Guide →
            </button>
            <a href="https://www.gov.uk/graduate-visa" target="_blank" rel="noreferrer"
              style={{ display: 'block', marginTop: '1rem', textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--green)', textDecoration: 'none' }}>
              Full details on gov.uk →
            </a>
          </div>
        </div>
      )}

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <div className="card">
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', marginBottom: '1.25rem' }}>Your Study Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group">
              <label>University / Institution</label>
              <input value={profileForm.university} onChange={e => setProfileForm(f => ({ ...f, university: e.target.value }))} placeholder="e.g. University of Birmingham" />
            </div>
            <div className="form-group">
              <label>Course Name</label>
              <input value={profileForm.course_name} onChange={e => setProfileForm(f => ({ ...f, course_name: e.target.value }))} placeholder="e.g. MSc Computer Science" />
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Course Start Date</label>
                <input type="date" value={profileForm.course_start} onChange={e => setProfileForm(f => ({ ...f, course_start: e.target.value }))} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Course End Date</label>
                <input type="date" value={profileForm.course_end} onChange={e => setProfileForm(f => ({ ...f, course_end: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label>Visa Expiry Date</label>
              <input type="date" value={profileForm.visa_expiry} onChange={e => setProfileForm(f => ({ ...f, visa_expiry: e.target.value }))} />
            </div>
            <div style={styles.infoBox}>
              <p style={{ fontSize: 12, color: 'var(--green)', margin: 0, lineHeight: 1.6 }}>
                🔒 Your dates are stored securely and only used to calculate your visa and Graduate visa eligibility. We never share this data.
              </p>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '13px', fontSize: 15 }}
              onClick={saveProfile} disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  tabs: { display: 'flex', background: 'var(--cream-dark)', borderRadius: 14, padding: 4, marginBottom: '1.5rem', gap: 4, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' },
  tab: { flex: 1, padding: '9px 8px', border: 'none', background: 'transparent', borderRadius: 10, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s', minHeight: 40, whiteSpace: 'nowrap', flexShrink: 0 },
  tabActive: { background: '#fff', color: 'var(--green)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  statusCard: { borderRadius: 20, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.25rem' },
  limitBadge: { background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px', textAlign: 'center', flexShrink: 0 },
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: '0.75rem' },
  toggleRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 },
  toggleBtn: { padding: '10px', border: '2px solid var(--border)', borderRadius: 12, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", transition: 'all .2s', minHeight: 44 },
  toggleActive: { borderColor: 'var(--green)', background: 'var(--green-light)', color: 'var(--green)' },
  toggleActiveHoliday: { borderColor: '#185fa5', background: '#e6f1fb', color: '#185fa5' },
  infoBox: { background: 'var(--green-light)', border: '1px solid #9FE1CB', borderRadius: 10, padding: '10px 12px' },
  hoursRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' },
  deleteBtn: { background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: 16, cursor: 'pointer', padding: '4px 8px', flexShrink: 0 },
  dateCard: { background: '#fff', border: '2px solid', borderRadius: 16, padding: '1.25rem' },
  daysLeft: { borderRadius: 12, padding: '10px 14px', textAlign: 'center', flexShrink: 0 },
  warningBox: { background: 'var(--coral-light)', border: '1px solid var(--coral)', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: 'var(--coral-dark)', marginTop: 10, lineHeight: 1.6 },
  criteriaRow: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  criteriaCheck: { width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
};