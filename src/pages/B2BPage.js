import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const partners = [
  { icon: '🎓', title: 'Universities & Higher Education', desc: 'Integrate Settle-In Buddy directly into your international student onboarding. Reduce drop-out rates, boost satisfaction scores and free up your international office team.', benefits: ['White-labelled platform with your branding', 'Direct integration with your student portal', 'Real-time student wellbeing dashboard', 'Automated arrival checklist and reminders', 'Dedicated account manager'] },
  { icon: '🤝', title: 'Student Unions', desc: 'Empower your international student community with tools that actually help. Give them a buddy, a checklist, and an AI assistant — all in one place.', benefits: ['Free tier for student union members', 'Buddy programme management tools', 'Wellbeing resource integration', 'Community event promotion', 'Multilingual support'] },
  { icon: '🏢', title: 'Recruitment Agents', desc: 'Add value to your student placement service with post-arrival support. Your students settle in better, you get better outcomes and more referrals.', benefits: ['Co-branded student portal', 'Track your students\' settlement progress', 'Referral commission programme', 'Priority buddy matching for your students', 'Dedicated support line'] },
  { icon: '🏠', title: 'Accommodation Providers', desc: 'List your properties directly on Settle-In Buddy and reach thousands of incoming international students before they even land in the UK.', benefits: ['Featured property listings', 'Direct enquiry management', 'Student-verified reviews', 'Integration with booking systems', 'Monthly occupancy reports'] },
  { icon: '💼', title: 'Employers & Recruiters', desc: 'Reach a highly motivated pool of international student talent. Post jobs, run employer spotlights and connect with students ready to work.', benefits: ['Featured job listings by sector', 'Campus recruitment promotion', 'Student talent database access', 'Employer branding opportunities', 'Sponsored content slots'] },
  { icon: '🏦', title: 'Financial & Service Providers', desc: 'Banks, insurance providers, SIM card companies and other student services can reach students at exactly the right moment — when they first arrive.', benefits: ['Sponsored onboarding checklist items', 'Banner placement in relevant sections', 'Referral tracking and commission', 'Student demographic insights', 'Co-branded offers and promotions'] },
];

const stats = [
  { num: '600K+', label: 'International students arrive in the UK annually' },
  { num: '£30B+', label: 'Contribution to the UK economy' },
  { num: '87%', label: 'Students say settling in is their biggest challenge' },
  { num: '5K+', label: 'Active users in Year 1 target' },
];

const tiers = [
  {
    name: 'Pilot',
    price: 'Free',
    period: '/ 6 months',
    color: 'var(--green)',
    bg: 'var(--green-light)',
    desc: 'For the first 3 qualifying universities. Remove all risk — get full access and provide a case study at the end.',
    badge: '🎓 Limited — 3 spots',
    features: [
      'Full platform access for 6 months',
      'Up to 1,000 student users',
      'Analytics dashboard',
      'Buddy matching and real-time chat',
      'AI assistant and document scanner',
      'Dedicated onboarding support',
      'Case study at end of pilot',
    ],
    cta: 'Apply for Pilot',
    note: 'In exchange for a named testimonial and case study.',
  },
  {
    name: 'University',
    price: '£2',
    period: '/ student / year',
    color: '#185fa5',
    bg: '#e6f1fb',
    desc: 'Scales naturally with your institution. A university with 500 international students pays £1,000/year. One with 5,000 pays £10,000.',
    badge: '⭐ Most Popular',
    features: [
      'Unlimited student users',
      'Priced per enrolled international student',
      'White-label branding option',
      'Advanced analytics & reporting',
      'Buddy matching and real-time chat',
      'Custom arrival checklist',
      'Dedicated account manager',
      'API integration with student portal',
    ],
    cta: 'Book a Demo',
    featured: true,
    note: 'Min. 250 students. Billed annually.',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    color: '#7c3aed',
    bg: '#f3f0ff',
    desc: 'For large university networks, national agents and multi-institution groups. Includes outcomes-based Graduate visa pathway add-on.',
    badge: '🏢 Multi-institution',
    features: [
      'Multi-institution management',
      'Full white-label solution',
      'Custom AI assistant training',
      'Graduate visa pathway tracker add-on',
      'Dedicated development support',
      'SLA guarantee',
      'On-site onboarding',
      'Revenue share model available',
    ],
    cta: 'Contact Us',
    note: 'Minimum 3 institutions or 5,000 students.',
  },
];

const faqs = [
  { q: 'How long does integration take?', a: 'Most university integrations are live within 4-6 weeks. We handle the technical setup and provide a dedicated onboarding manager to guide your team through the process.' },
  { q: 'Can we use our own branding?', a: 'Yes — our University and Enterprise tiers include full white-labelling. Your students see your logo, colours and domain name throughout the platform.' },
  { q: 'Is student data secure?', a: 'Absolutely. We are fully GDPR compliant, store all data in UK-based servers, and never sell student data to third parties. We can provide a full Data Processing Agreement.' },
  { q: 'Do you support multiple languages?', a: 'Yes — the platform supports multiple languages and our AI assistant can respond in the student\'s preferred language. We currently support English, French, Arabic, Hindi, Mandarin and more.' },
  { q: 'What kind of ROI can we expect?', a: 'Universities typically see a 15-20% reduction in international student drop-out rates and significant savings in international office staff time within the first academic year.' },
  { q: 'Is there a free trial?', a: 'Yes — we offer a 30-day pilot programme for qualifying institutions. Contact us to discuss eligibility and setup.' },
];

const emptyForm = { name: '', organisation: '', role: '', email: '', phone: '', message: '', type: 'University' };
const emptyDemoForm = { name: '', institution: '', role: '', email: '' };

export default function B2BPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [demoForm, setDemoForm] = useState(emptyDemoForm);
  const [demoSent, setDemoSent] = useState(false);
  const [demoCredentials, setDemoCredentials] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleDemo = e => setDemoForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submitDemo = async (e) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.email || !demoForm.institution) return;
    setDemoLoading(true);
    setDemoError('');
    try {
      const res = await fetch('https://settlebuddy-backend.onrender.com/api/demo/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setDemoCredentials(data.credentials);
      setDemoSent(true);
    } catch (err) {
      setDemoError(err.message);
    } finally { setDemoLoading(false); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.organisation) return;
    // In production this would send to a CRM or email
    setSent(true);
  };

  return (
    <div style={styles.page}>

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.navLogo} onClick={() => navigate('/landing')} >
            <div style={styles.logoMark}>S</div>
            <span style={styles.logoText}>Settle-In Buddy</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#partners" style={styles.navLink}>Partners</a>
            <a href="#pricing" style={styles.navLink}>Pricing</a>
            <a href="#demo" style={styles.navLink}>Demo</a>
            <a href="#faq" style={styles.navLink}>FAQ</a>
            <button className="btn-primary" style={{ padding: '10px 22px', fontSize: 13 }}
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
              Book a Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&q=80"
          alt="" role="presentation" style={styles.heroBg} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🇬🇧 Trusted by UK international students</div>
          <h1 style={styles.heroTitle}>
            Help your international<br />students <em style={{ color: '#f8c060' }}>thrive</em> in the UK
          </h1>
          <p style={styles.heroSub}>
            Settle-In Buddy is the UK's dedicated settlement platform for international students. Partner with us to reduce drop-out rates, boost student satisfaction and free up your support team.
          </p>
            <div style={styles.heroBtns}>
            <button className="btn-primary" style={{ padding: '15px 36px', fontSize: 15 }}
              onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}>
              🚀 Get Instant Demo →
            </button>
            <button style={styles.ghostBtn}
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
              Book a Call
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsSection}>
        <div style={styles.inner}>
          <div style={styles.statsGrid}>
            {stats.map(s => (
              <div key={s.label} style={styles.statItem}>
                <div style={styles.statNum}>{s.num}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner types */}
      <section id="partners" style={styles.section}>
        <div style={styles.inner}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionBadge}>Who we work with</div>
            <h2 style={styles.sectionTitle}>Built for the whole international student ecosystem</h2>
            <p style={styles.sectionSub}>From universities to accommodation providers, we have a partnership model that works for you.</p>
          </div>
          <div style={styles.partnersGrid}>
            {partners.map(p => (
              <div key={p.title} className="card card-hover" style={styles.partnerCard}>
                <div style={styles.partnerIcon}>{p.icon}</div>
                <h3 style={styles.partnerTitle}>{p.title}</h3>
                <p style={styles.partnerDesc}>{p.desc}</p>
                <ul style={styles.benefitsList}>
                  {p.benefits.map(b => (
                    <li key={b} style={styles.benefit}>
                      <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ ...styles.section, background: 'var(--green-light)' }}>
        <div style={styles.inner}>
          <div style={styles.sectionHeader}>
            <div style={{ ...styles.sectionBadge, background: 'var(--green)', color: '#fff' }}>Simple process</div>
            <h2 style={styles.sectionTitle}>Up and running in weeks, not months</h2>
          </div>
          <div style={styles.stepsGrid}>
            {[
              { num: '01', title: 'Book a demo', desc: 'We walk you through the platform and discuss how it fits your institution\'s specific needs.' },
              { num: '02', title: 'Customise & integrate', desc: 'We set up your white-labelled instance, configure your branding and integrate with your existing systems.' },
              { num: '03', title: 'Onboard your students', desc: 'We provide marketing materials, orientation guides and support to get your students signed up.' },
              { num: '04', title: 'Monitor & grow', desc: 'Access your analytics dashboard to track student engagement, wellbeing indicators and satisfaction scores.' },
            ].map(s => (
              <div key={s.num} style={styles.stepCard}>
                <div style={styles.stepNum}>{s.num}</div>
                <h4 style={styles.stepTitle}>{s.title}</h4>
                <p style={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={styles.section}>
        <div style={styles.inner}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionBadge}>Pricing</div>
            <h2 style={styles.sectionTitle}>Pricing that scales with your institution</h2>
            <p style={styles.sectionSub}>Start free with our pilot programme, then move to per-student pricing that grows with you. No fixed monthly fees — you pay for what you use.</p>
          </div>
          <div style={styles.pricingGrid}>
            {tiers.map(t => (
              <div key={t.name} style={{
                ...styles.pricingCard,
                border: t.featured ? `2px solid ${t.color}` : '1.5px solid var(--border)',
                transform: t.featured ? 'scale(1.02)' : 'scale(1)',
                boxShadow: t.featured ? `0 8px 30px ${t.color}25` : 'var(--shadow-sm)',
              }}>
            {t.badge && (
                <div style={{ ...styles.featuredBadge, background: t.color }}>{t.badge}</div>
              )}
                <div style={{ ...styles.pricingTop, background: t.bg }}>
                    <div style={{ fontWeight: 700, fontSize: 18, color: t.color, marginBottom: 4 }}>{t.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', fontWeight: 900, color: t.color }}>{t.price}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.period}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6 }}>{t.desc}</div>
                </div>
                <div style={styles.pricingBody}>
                    <ul style={styles.featuresList}>
                    {t.features.map(f => (
                        <li key={f} style={styles.feature}>
                        <span style={{ color: t.color, flexShrink: 0, fontWeight: 700 }}>✓</span>
                        <span style={{ fontSize: 13 }}>{f}</span>
                        </li>
                    ))}
                    </ul>
                    {t.note && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--cream)', borderRadius: 8, padding: '6px 10px', marginBottom: 12, lineHeight: 1.5 }}>
                        ℹ️ {t.note}
                    </div>
                    )}
                    <button
                    style={{ ...styles.pricingBtn, background: t.color }}
                    onClick={() => document.getElementById(t.name === 'Pilot' ? 'contact' : 'demo').scrollIntoView({ behavior: 'smooth' })}>
                    {t.cta} →
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Pricing comparison note */}
          <div style={{ maxWidth: 700, margin: '2rem auto 0', background: 'var(--green-light)', border: '1.5px solid #9FE1CB', borderRadius: 16, padding: '1.25rem 1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--green)', marginBottom: 8 }}>
              📊 How per-student pricing compares
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap: '1rem' }}>
              {[
                { students: '250', annual: '£500', monthly: '£41.67/mo' },
                { students: '500', annual: '£1,000', monthly: '£83/mo' },
                { students: '1,000', annual: '£2,000', monthly: '£167/mo' },
                { students: '5,000', annual: '£10,000', monthly: '£833/mo' },
              ].map(r => (
                <div key={r.students} style={{ textAlign: 'center', background: '#fff', borderRadius: 10, padding: '10px' }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 900, color: 'var(--green)' }}>{r.annual}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{r.students} students</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>({r.monthly})</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.6 }}>
              Based on £2 per enrolled international student per year. Billed annually. Minimum 250 students.
            </p>
          </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ ...styles.section, background: 'var(--cream)' }}>
        <div style={styles.inner}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionBadge}>FAQ</div>
            <h2 style={styles.sectionTitle}>Common questions</h2>
          </div>
          <div style={styles.faqList}>
            {faqs.map((f, i) => (
              <div key={i} style={styles.faqItem} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={styles.faqQ}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{f.q}</span>
                  <span style={{ color: 'var(--green)', fontSize: 20, transition: 'transform .2s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                </div>
                {openFaq === i && (
                  <p style={styles.faqA}>{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Demo Section */}
      <section id="demo" style={{ ...styles.section, background: '#fff' }}>
        <div style={styles.inner}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionBadge}>🎓 Try Before You Buy</div>
            <h2 style={styles.sectionTitle}>Get instant demo access</h2>
            <p style={styles.sectionSub}>
              Request a free 14-day demo account and explore the full platform — pre-loaded with student data, buddy matches and live AI — right now, no sales call needed.
            </p>
          </div>

          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            {demoSent && demoCredentials ? (
              <div style={{ background: '#fff', border: '2px solid var(--green)', borderRadius: 24, padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', marginBottom: 8, color: 'var(--green)' }}>
                  Your demo is ready!
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                  Use these credentials to log into the platform. Your demo includes 15 pre-loaded students, 5 verified buddies, live buddy matches and the full admin dashboard.
                </p>

                {/* Credentials box */}
                <div style={{ background: 'var(--green-light)', border: '1.5px solid #9FE1CB', borderRadius: 16, padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                    Login Credentials
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Email</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>{demoCredentials.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Password</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>{demoCredentials.password}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Expires</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--coral-dark)' }}>
                        {new Date(demoCredentials.expires).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                
                <a
                  href="https://settleinbuddy.netlify.app/login"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block', width: '100%', padding: '14px',
                    background: 'var(--green)', color: '#fff',
                    borderRadius: 50, textDecoration: 'none',
                    fontSize: 15, fontWeight: 700, textAlign: 'center',
                    marginBottom: 12, boxSizing: 'border-box',
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}>
                  Open Platform →
                </a>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Save your credentials — they won't be shown again. Questions? Email <strong>partners@settlebuddy.uk</strong>
                </p>
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg,var(--green),var(--green-mid))', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🚀</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: '#fff', fontWeight: 700, marginBottom: 4 }}>
                    14-Day Free Demo
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                    Full platform access · Pre-loaded data · No credit card
                  </div>
                </div>

                {/* What's included */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: '1px solid var(--border)' }}>
                  {[
                    ['15', 'Pre-loaded students'],
                    ['5', 'Verified buddies'],
                    ['5', 'Active buddy matches'],
                    ['Full', 'Admin dashboard'],
                    ['Live', 'AI assistant'],
                    ['Real', 'Chat messages'],
                  ].map(([num, label], i) => (
                    <div key={i} style={{
                      padding: '12px 16px',
                      borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                      borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 900, color: 'var(--green)' }}>{num}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <form style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={submitDemo}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Your Name *</label>
                    <input name="name" value={demoForm.name} onChange={handleDemo} placeholder="Dr. Sarah Johnson" required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Institution *</label>
                    <input name="institution" value={demoForm.institution} onChange={handleDemo} placeholder="University of Birmingham" required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Your Role</label>
                    <input name="role" value={demoForm.role} onChange={handleDemo} placeholder="International Student Officer" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Work Email *</label>
                    <input name="email" type="email" value={demoForm.email} onChange={handleDemo} placeholder="s.johnson@university.ac.uk" required />
                  </div>
                  {demoError && (
                    <div style={{ background: '#fff1f0', border: '1px solid #ffc9c9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#c92a2a' }}>
                      {demoError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={demoLoading}
                    style={{
                      width: '100%', padding: '14px',
                      background: 'linear-gradient(135deg,var(--green),var(--green-mid))',
                      color: '#fff', border: 'none', borderRadius: 50,
                      fontSize: 15, fontWeight: 700, cursor: demoLoading ? 'not-allowed' : 'pointer',
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      opacity: demoLoading ? 0.7 : 1,
                    }}>
                    {demoLoading ? 'Creating your demo...' : '🚀 Get Instant Demo Access →'}
                  </button>
                  <p style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center', lineHeight: 1.5 }}>
                    Your demo account will be created instantly with full admin access and pre-loaded student data. No credit card required.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Contact form */}
      <section id="contact" style={{ ...styles.section, background: 'linear-gradient(135deg,var(--green-dark),var(--green))' }}>
        <div style={styles.inner}>
          <div style={{ ...styles.sectionHeader, marginBottom: '2rem' }}>
            <h2 style={{ ...styles.sectionTitle, color: '#fff' }}>Let's talk</h2>
            <p style={{ ...styles.sectionSub, color: 'rgba(255,255,255,0.8)' }}>
              Fill in the form and we'll get back to you within one business day.
            </p>
          </div>

          {sent ? (
            <div style={styles.successBox}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', marginBottom: 8 }}>Thank you!</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                We've received your enquiry and will be in touch within one business day.
              </p>
            </div>
          ) : (
            <form style={styles.contactForm} onSubmit={submit}>
              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)' }}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handle} placeholder="Your full name" required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)' }}>Organisation *</label>
                  <input name="organisation" value={form.organisation} onChange={handle} placeholder="University / Company name" required />
                </div>
              </div>
              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)' }}>Your Role</label>
                  <input name="role" value={form.role} onChange={handle} placeholder="e.g. International Student Officer" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)' }}>Partner Type</label>
                  <select name="type" value={form.type} onChange={handle}>
                    <option>University</option>
                    <option>Student Union</option>
                    <option>Recruitment Agent</option>
                    <option>Accommodation Provider</option>
                    <option>Employer / Recruiter</option>
                    <option>Financial / Service Provider</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)' }}>Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@organisation.ac.uk" required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)' }}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="+44 ..." />
                </div>
              </div>
              <div className="form-group">
                <label style={{ color: 'rgba(255,255,255,0.8)' }}>Message</label>
                <textarea name="message" value={form.message} onChange={handle} rows={4}
                  placeholder="Tell us about your institution and what you're looking to achieve..." />
              </div>
              <button type="submit" className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: 15, background: '#fff', color: 'var(--green)', boxShadow: '0 4px 20px rgba(255,255,255,0.3)' }}>
                Send Enquiry →
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.inner}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={styles.navLogo}>
              <div style={styles.logoMark}>S</div>
              <span style={{ ...styles.logoText, color: 'rgba(255,255,255,0.8)' }}>Settle-In Buddy</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              © {new Date().getFullYear()} Settle-In Buddy Ltd. All rights reserved.
            </p>
            <button style={{ ...styles.ghostBtn, fontSize: 12, padding: '6px 14px' }}
              onClick={() => navigate('/landing')}>
              Student Platform →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: { background: '#fff', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',sans-serif" },
  nav: { position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', zIndex: 100, padding: '0 1.5rem' },
  navInner: { maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, overflow: 'hidden' },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  logoMark: { width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,var(--green),var(--green-mid))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 18 },
  logoText: { fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', fontWeight: 700, color: 'var(--green)' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 8 },
  navLink: { fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', display: 'none' },
  hero: { position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' },
  heroBg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(6,40,30,0.92) 0%, rgba(10,92,68,0.80) 50%, rgba(255,92,58,0.3) 100%)' },
  heroContent: { position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem', width: '100%' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '8px 18px', borderRadius: 50, fontSize: 12, fontWeight: 700, marginBottom: 24, letterSpacing: '0.5px' },
  heroTitle: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.2rem,5vw,4rem)', color: '#fff', lineHeight: 1.15, marginBottom: 20, textShadow: '0 2px 20px rgba(0,0,0,0.3)' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.8, maxWidth: 560, marginBottom: 36 },
  heroBtns: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  ghostBtn: { background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: 50, padding: '13px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", transition: 'all .2s' },
  statsSection: { background: 'var(--green)', padding: '3rem 1.5rem' },
  statsGrid: { maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2rem' },
  statItem: { textAlign: 'center' },
  statNum: { fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: 6 },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 600, lineHeight: 1.4 },
  section: { padding: '5rem 1.5rem' },
  inner: { maxWidth: 1100, margin: '0 auto' },
  sectionHeader: { textAlign: 'center', marginBottom: '3rem' },
  sectionBadge: { display: 'inline-block', background: 'var(--green-light)', color: 'var(--green)', padding: '6px 18px', borderRadius: 50, fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 },
  sectionTitle: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--text)', marginBottom: 12, lineHeight: 1.2 },
  sectionSub: { fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' },
  partnersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: '1.25rem' },
  partnerCard: { display: 'flex', flexDirection: 'column', gap: 10 },
  partnerIcon: { fontSize: '2rem' },
  partnerTitle: { fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: 'var(--text)' },
  partnerDesc: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 },
  benefitsList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 },
  benefit: { display: 'flex', gap: 8, fontSize: 13, color: 'var(--text)' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' },
  stepCard: { background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-sm)' },
  stepNum: { fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontWeight: 900, color: 'var(--green)', opacity: 0.3, marginBottom: 8 },
  stepTitle: { fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: 8 },
  stepDesc: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 },
  pricingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: '1.5rem', alignItems: 'start' },
  pricingCard: { background: '#fff', borderRadius: 20, overflow: 'hidden', position: 'relative' },
  featuredBadge: { position: 'absolute', top: 16, right: 16, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50, letterSpacing: '0.5px' },
  pricingTop: { padding: '1.5rem' },
  pricingBody: { padding: '1.25rem 1.5rem' },
  featuresList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' },
  feature: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  pricingBtn: { width: '100%', padding: '12px', border: 'none', borderRadius: 50, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" },
  faqList: { maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 },
  faqItem: { borderBottom: '1px solid var(--border)', padding: '1.25rem 0', cursor: 'pointer' },
  faqQ: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  faqA: { fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 10 },
  contactForm: { maxWidth: 700, margin: '0 auto', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', borderRadius: 24, padding: '2rem', border: '1px solid rgba(255,255,255,0.15)' },
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: '1rem' },
  successBox: { maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 24, padding: '3rem', textAlign: 'center' },
  footer: { background: 'var(--green-dark)', padding: '2rem 1.5rem' },
};