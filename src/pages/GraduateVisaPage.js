import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const eligibilityCriteria = [
  {
    icon: '🎓',
    title: 'Eligible Degree',
    desc: 'You must have completed or be about to complete a UK bachelor\'s, master\'s or PhD degree at a licensed student sponsor university.',
    pass: 'Undergraduate, postgraduate or doctoral degrees',
    fail: 'Foundation courses, pre-sessional English, short courses',
  },
  {
    icon: '📅',
    title: 'Study Duration',
    desc: 'You must have studied in the UK for the minimum required period.',
    pass: 'PhD: 12 months in the UK | Other degrees: full course duration in the UK',
    fail: 'Studied primarily overseas or switched from a non-qualifying visa',
  },
  {
    icon: '🛂',
    title: 'Valid Student Visa',
    desc: 'You must currently hold a valid UK Student visa or Tier 4 visa at the time of applying.',
    pass: 'Current Student visa or Tier 4 (General)',
    fail: 'Visitor visa, Graduate visa, or no valid visa',
  },
  {
    icon: '🏫',
    title: 'Licensed Sponsor',
    desc: 'Your university must be a Home Office licensed student sponsor with a track record of compliance.',
    pass: 'Most UK universities — check the official register',
    fail: 'Unlicensed institutions or sponsors with revoked status',
  },
];

const timeline = [
  {
    phase: 'Up to 6 months before course ends',
    icon: '📋',
    color: '#185fa5',
    bg: '#e6f1fb',
    steps: [
      'Check your university is a licensed sponsor on gov.uk',
      'Confirm your degree completion date with your university',
      'Start saving for the £700 application fee + IHS surcharge',
      'Set up or log into your UK Visas and Immigration account',
    ],
  },
  {
    phase: 'When your course ends',
    icon: '🎓',
    color: '#0a5c44',
    bg: 'var(--green-light)',
    steps: [
      'Receive your completion letter or results confirmation from university',
      'Your university notifies the Home Office (CAS marked as complete)',
      'Apply online through gov.uk — do not wait too long',
      'Pay the £700 fee and Immigration Health Surcharge',
    ],
  },
  {
    phase: 'After applying',
    icon: '⏳',
    color: '#d97706',
    bg: 'var(--amber-light)',
    steps: [
      'Attend a biometric appointment if required',
      'Track your application through the UKVI account',
      'Typical decision time: 8 weeks (apply early to be safe)',
      'Continue living and working in the UK while you wait',
    ],
  },
  {
    phase: 'Once approved',
    icon: '✅',
    color: '#059669',
    bg: '#ecfdf5',
    steps: [
      'Receive your new visa (2 years for bachelor\'s/master\'s, 3 years for PhD)',
      'Work in any job at any skill level — no sponsor needed',
      'Start building UK work experience',
      'Consider switching to Skilled Worker visa for longer-term settlement',
    ],
  },
];

const costs = [
  { item: 'Application fee', amount: '£700', note: 'Paid online when applying' },
  { item: 'Immigration Health Surcharge (IHS)', amount: '£1,035/year', note: '£2,070 for 2-year visa · £3,105 for PhD 3-year visa' },
  { item: 'Biometric enrolment', amount: 'Free', note: 'At a UK Visa and Citizenship Application Services centre' },
  { item: 'Priority service', amount: '+£500', note: 'Optional — faster decision (not always available)' },
];

const pathways = [
  {
    icon: '💼',
    title: 'Skilled Worker Visa',
    desc: 'The most common next step. Get a job offer from a licensed employer at the required skill and salary level and switch to a Skilled Worker visa — which can eventually lead to Indefinite Leave to Remain (ILR) after 5 years.',
    link: 'https://www.gov.uk/skilled-worker-visa',
    color: '#185fa5',
  },
  {
    icon: '🚀',
    title: 'Scale-up Worker Visa',
    desc: 'If you join a fast-growing UK business (scale-up) that meets UKVI criteria, you can switch to the Scale-up visa which offers more flexibility than Skilled Worker after 6 months.',
    link: 'https://www.gov.uk/scale-up-worker-visa',
    color: '#7c3aed',
  },
  {
    icon: '🔬',
    title: 'Global Talent Visa',
    desc: 'For exceptionally talented individuals in academia, research, arts, digital technology or science. Requires endorsement from a recognised body. No job offer needed.',
    link: 'https://www.gov.uk/global-talent',
    color: '#059669',
  },
  {
    icon: '💡',
    title: 'Innovator Founder Visa',
    desc: 'If you want to start your own UK business, the Innovator Founder visa allows you to set up an innovative, scalable business with endorsement from an approved body.',
    link: 'https://www.gov.uk/innovator-founder-visa',
    color: '#d97706',
  },
  {
    icon: '🏠',
    title: 'Indefinite Leave to Remain',
    desc: 'After 5 years on qualifying visas (e.g. Skilled Worker), you can apply for ILR — permanent residence in the UK. This is the key step towards British citizenship.',
    link: 'https://www.gov.uk/indefinite-leave-to-remain',
    color: '#dc2626',
  },
];

const faqs = [
  {
    q: 'Can I extend the Graduate visa?',
    a: 'No — the Graduate visa cannot be extended. Once it expires you must switch to another visa category (e.g. Skilled Worker) or leave the UK.',
  },
  {
    q: 'Can I go back to studying on the Graduate visa?',
    a: 'Yes, you can study on the Graduate visa but you cannot use it to enrol in a course that would require a Student visa. You also cannot switch back to a Student visa from the Graduate visa.',
  },
  {
    q: 'Can my family join me on the Graduate visa?',
    a: 'Yes — your dependants (partner and children under 18) who are already in the UK as your dependants on your Student visa can switch to join you. New dependants from overseas can also apply.',
  },
  {
    q: 'Does the Graduate visa count towards settlement?',
    a: 'No — time spent on the Graduate visa does not count towards the 5-year qualifying period for Indefinite Leave to Remain. Only time on qualifying routes like Skilled Worker counts.',
  },
  {
    q: 'What happens if my Student visa expires before I apply?',
    a: 'You must apply for the Graduate visa before your Student visa expires. If you miss the deadline you will need to leave the UK. Apply as early as possible — ideally before your course officially ends.',
  },
  {
    q: 'Can I apply from outside the UK?',
    a: 'No — you must be in the UK when you apply for the Graduate visa. You must also have been in the UK when your course was completed.',
  },
];

export default function GraduateVisaPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);

  const tabs = [
    { key: 'overview', label: '📋 Overview' },
    { key: 'eligibility', label: '✅ Eligibility' },
    { key: 'timeline', label: '📅 Timeline' },
    { key: 'costs', label: '💷 Costs' },
    { key: 'pathways', label: '🚀 After Graduate' },
    { key: 'faq', label: '❓ FAQ' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h2>Graduate Visa Route</h2>
        <p>Your complete guide to staying in the UK after your degree</p>
      </div>

      {/* Hero card */}
      <div style={styles.heroCard}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>🇬🇧 UK Immigration Route</div>
          <h3 style={styles.heroTitle}>The Graduate Visa</h3>
          <p style={styles.heroDesc}>
            The Graduate visa lets you stay and work in the UK for 2 years after finishing your degree (3 years for PhD graduates) — with no job offer or sponsor required.
          </p>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}>
              <div style={styles.heroStatNum}>2–3</div>
              <div style={styles.heroStatLabel}>Years to stay</div>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <div style={styles.heroStatNum}>£700</div>
              <div style={styles.heroStatLabel}>Application fee</div>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <div style={styles.heroStatNum}>Any</div>
              <div style={styles.heroStatLabel}>Job or salary</div>
            </div>
          </div>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.heroIcon}>🎓</div>
        </div>
      </div>

      {/* Compliance planner CTA */}
      <div style={styles.plannerCta}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            📊 Track your Graduate visa eligibility
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Use the Compliance Planner to track your study months, visa expiry and see exactly when you can apply.
          </div>
        </div>
        <button className="btn-primary" style={{ padding: '10px 18px', fontSize: 13, flexShrink: 0 }}
          onClick={() => navigate('/compliance')}>
          Open Planner →
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map(t => (
          <button key={t.key}
            style={{ ...styles.tab, ...(activeTab === t.key ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div style={styles.content}>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h3 style={styles.cardTitle}>What is the Graduate visa?</h3>
            <p style={styles.bodyText}>
              The Graduate visa (formerly called the Post-Study Work visa) was reintroduced in 2021 and allows international students who have completed a qualifying UK degree to remain in the UK to work or look for work for up to 2 years (3 years for PhD graduates).
            </p>
            <p style={styles.bodyText}>
              Unlike most UK work visas, the Graduate visa does not require a job offer or a sponsoring employer. You can work in virtually any job at any salary level, switch employers freely, and even be self-employed.
            </p>
          </div>

          <div style={styles.twoCol}>
            <div className="card">
              <h4 style={{ ...styles.cardTitle, color: 'var(--green)', fontSize: '1rem' }}>✅ What you CAN do</h4>
              {[
                'Work in any job at any skill level',
                'Switch jobs as many times as you like',
                'Be self-employed or freelance',
                'Study (in most cases)',
                'Bring your dependants with you',
                'Travel in and out of the UK freely',
              ].map(item => (
                <div key={item} style={styles.listItem}>
                  <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13 }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <h4 style={{ ...styles.cardTitle, color: 'var(--coral)', fontSize: '1rem' }}>❌ What you CANNOT do</h4>
              {[
                'Extend the Graduate visa',
                'Switch back to a Student visa',
                'Access most public funds',
                'Work as a professional sportsperson or coach',
                'Apply from outside the UK',
                'Count this time towards ILR',
              ].map(item => (
                <div key={item} style={styles.listItem}>
                  <span style={{ color: 'var(--coral)', flexShrink: 0 }}>✗</span>
                  <span style={{ fontSize: 13 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.govLink}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Apply on gov.uk</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>The official application is done online through the UK government website.</div>
            </div>
            <a href="https://www.gov.uk/graduate-visa" target="_blank" rel="noreferrer"
              style={styles.govBtn}>
              Apply Now →
            </a>
          </div>
        </div>
      )}

      {/* ── ELIGIBILITY TAB ── */}
      {activeTab === 'eligibility' && (
        <div style={styles.content}>
          <p style={{ ...styles.bodyText, marginBottom: '1.5rem' }}>
            You must meet all four of these criteria to be eligible for the Graduate visa. Check each one carefully before applying.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {eligibilityCriteria.map((c, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                  <div style={styles.criteriaIcon}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{c.title}</div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                  </div>
                </div>
                <div style={styles.criteriaGrid}>
                  <div style={styles.passBox}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>✓ Qualifies</div>
                    <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{c.pass}</div>
                  </div>
                  <div style={styles.failBox}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--coral-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>✗ Does not qualify</div>
                    <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{c.fail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.govLink, marginTop: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Check the sponsor register</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Verify your university is a licensed student sponsor on gov.uk.</div>
            </div>
            <a href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-students" target="_blank" rel="noreferrer"
              style={styles.govBtn}>
              Check Register →
            </a>
          </div>
        </div>
      )}

      {/* ── TIMELINE TAB ── */}
      {activeTab === 'timeline' && (
        <div style={styles.content}>
          <p style={{ ...styles.bodyText, marginBottom: '1.5rem' }}>
            Here is a step-by-step timeline for applying for the Graduate visa — from preparation to approval.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {timeline.map((phase, i) => (
              <div key={i} style={{ ...styles.timelineCard, borderLeftColor: phase.color }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ ...styles.timelineIcon, background: phase.bg, color: phase.color }}>
                    {phase.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: phase.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phase {i + 1}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{phase.phase}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {phase.steps.map((step, j) => (
                    <div key={j} style={styles.timelineStep}>
                      <div style={{ ...styles.stepDot, background: phase.color }} />
                      <span style={{ fontSize: 13, lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COSTS TAB ── */}
      {activeTab === 'costs' && (
        <div style={styles.content}>
          <p style={{ ...styles.bodyText, marginBottom: '1.5rem' }}>
            Make sure you budget for all the costs involved. The total for a 2-year Graduate visa is typically around £2,770–£3,170.
          </p>

          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h3 style={styles.cardTitle}>Cost Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {costs.map((c, i) => (
                <div key={i} style={{ ...styles.costRow, borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{c.item}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.note}</div>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '1.2rem', color: 'var(--green)', flexShrink: 0 }}>
                    {c.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total box */}
          <div style={styles.totalBox}>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Estimated total (2-year visa)</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: '#fff', fontWeight: 900 }}>~£2,770</div>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', maxWidth: 200, lineHeight: 1.5, textAlign: 'right' }}>
              Application fee £700 + IHS £2,070 (2 years × £1,035)
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.25rem' }}>
            <h3 style={styles.cardTitle}>💡 Money-saving tips</h3>
            {[
              'Apply well before your Student visa expires — priority service adds £500 and is rarely necessary.',
              'Check if your university offers financial support or hardship funds for visa application costs.',
              'The IHS is paid upfront for the full visa duration — budget for this as a single lump sum.',
              'Keep your bank statements showing sufficient funds — UKVI may request evidence.',
            ].map((tip, i) => (
              <div key={i} style={{ ...styles.listItem, paddingBottom: 10, borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: 'var(--green)', flexShrink: 0 }}>💡</span>
                <span style={{ fontSize: 13, lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PATHWAYS TAB ── */}
      {activeTab === 'pathways' && (
        <div style={styles.content}>
          <p style={{ ...styles.bodyText, marginBottom: '1.5rem' }}>
            The Graduate visa is a stepping stone — not a destination. Here are your main options after the Graduate visa expires.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pathways.map((p, i) => (
              <div key={i} className="card card-hover" style={{ borderLeft: `4px solid ${p.color}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ fontSize: '2rem', flexShrink: 0 }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: p.color, marginBottom: 6 }}>{p.title}</div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</p>
                    <a href={p.link} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, fontWeight: 700, color: p.color, textDecoration: 'none' }}>
                      Learn more on gov.uk →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Settlement timeline */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 style={styles.cardTitle}>Path to British Citizenship</h3>
            <div style={styles.citizenshipPath}>
              {[
                { label: 'Student Visa', sub: 'During studies', color: '#185fa5' },
                { label: 'Graduate Visa', sub: '2–3 years', color: '#0a5c44' },
                { label: 'Skilled Worker', sub: '5 years', color: '#7c3aed' },
                { label: 'ILR', sub: 'Permanent residence', color: '#d97706' },
                { label: 'Citizenship', sub: '12 months after ILR', color: '#dc2626' },
              ].map((step, i) => (
                <div key={i} style={styles.pathStep}>
                  <div style={{ ...styles.pathDot, background: step.color }}>
                    {i === 4 ? '🇬🇧' : i + 1}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: step.color, textAlign: 'center' }}>{step.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>{step.sub}</div>
                  {i < 4 && <div style={styles.pathArrow}>→</div>}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 12, textAlign: 'center' }}>
              Note: Graduate visa time does not count towards the 5-year ILR qualifying period.
            </p>
          </div>
        </div>
      )}

      {/* ── FAQ TAB ── */}
      {activeTab === 'faq' && (
        <div style={styles.content}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((f, i) => (
              <div key={i} style={styles.faqItem} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={styles.faqQ}>
                  <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{f.q}</span>
                  <span style={{ color: 'var(--green)', fontSize: 20, flexShrink: 0, transition: 'transform .2s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                </div>
                {openFaq === i && (
                  <p style={styles.faqA}>{f.a}</p>
                )}
              </div>
            ))}
          </div>

          <div style={{ ...styles.govLink, marginTop: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Still have questions?</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Visit the official gov.uk Graduate visa page for the most up-to-date guidance.</div>
            </div>
            <a href="https://www.gov.uk/graduate-visa" target="_blank" rel="noreferrer"
              style={styles.govBtn}>
              Visit gov.uk →
            </a>
          </div>

          <div style={styles.disclaimer}>
            ⚠️ This information is for general guidance only and may not reflect the latest policy changes. Always check gov.uk for the most current rules and consult your university's international student office or a regulated OISC immigration adviser for advice specific to your circumstances.
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  heroCard: { background: 'linear-gradient(135deg,#0a5c44,#0f7a5a)', borderRadius: 20, padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 16, overflow: 'hidden', position: 'relative' },
  heroLeft: { flex: 1, minWidth: 0 },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 12px', borderRadius: 50, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: '0.5px' },
  heroTitle: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#fff', marginBottom: 10, lineHeight: 1.2 },
  heroDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 16 },
  heroStats: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  heroStat: { textAlign: 'center' },
  heroStatNum: { fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', fontWeight: 900, color: '#fff' },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 },
  heroStatDivider: { width: 1, height: 36, background: 'rgba(255,255,255,0.2)' },
  heroRight: { flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroIcon: { fontSize: '4rem', opacity: 0.4 },
  plannerCta: { background: 'var(--green-light)', border: '1.5px solid #9FE1CB', borderRadius: 14, padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  tabs: { display: 'flex', background: 'var(--cream-dark)', borderRadius: 14, padding: 4, marginBottom: '1.5rem', gap: 4, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' },
  tab: { flex: 1, padding: '9px 8px', border: 'none', background: 'transparent', borderRadius: 10, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s', minHeight: 40, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" },
  tabActive: { background: '#fff', color: 'var(--green)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  content: { display: 'flex', flexDirection: 'column', gap: '0' },
  cardTitle: { fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text)' },
  bodyText: { fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '1rem', marginBottom: '1.25rem' },
  listItem: { display: 'flex', gap: 10, alignItems: 'flex-start', paddingTop: 8 },
  govLink: { background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 14, padding: '1rem', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  govBtn: { background: 'var(--green)', color: '#fff', borderRadius: 50, padding: '10px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0, display: 'inline-block' },
  criteriaIcon: { width: 44, height: 44, borderRadius: 12, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 },
  criteriaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 8 },
  passBox: { background: 'var(--green-light)', border: '1px solid #9FE1CB', borderRadius: 10, padding: '10px 12px' },
  failBox: { background: 'var(--coral-light)', border: '1px solid #F5C4B3', borderRadius: 10, padding: '10px 12px' },
  timelineCard: { background: '#fff', border: '1px solid var(--border)', borderLeft: '4px solid', borderRadius: '0 14px 14px 0', padding: '1.25rem' },
  timelineIcon: { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 },
  timelineStep: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  stepDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5 },
  costRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' },
  totalBox: { background: 'linear-gradient(135deg,var(--green),var(--green-mid))', borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  citizenshipPath: { display: 'flex', alignItems: 'flex-start', gap: 4, overflowX: 'auto', paddingBottom: 8, WebkitOverflowScrolling: 'touch', position: 'relative' },
  pathStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative', flexShrink: 0, width: 80 },
  pathDot: { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 },
  pathArrow: { position: 'absolute', right: -14, top: 12, color: 'var(--text-faint)', fontSize: 16, fontWeight: 700 },
  faqItem: { borderBottom: '1px solid var(--border)', padding: '1.25rem 0', cursor: 'pointer' },
  faqQ: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  faqA: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 10 },
  disclaimer: { background: 'var(--amber-light)', border: '1px solid var(--amber)', borderRadius: 12, padding: '12px 14px', fontSize: 12, color: '#92600a', lineHeight: 1.6, marginTop: '1.5rem' },
};