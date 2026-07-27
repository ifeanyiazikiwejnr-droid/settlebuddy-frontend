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
    name: 'Starter',
    price: '£299',
    period: '/month',
    color: 'var(--green)',
    bg: 'var(--green-light)',
    desc: 'Perfect for student unions and small accommodation providers',
    features: ['Up to 500 student users', 'Basic analytics dashboard', 'Accommodation listings (up to 10)', 'Email support', 'Settle-In Buddy branding'],
    cta: 'Get Started',
  },
  {
    name: 'University',
    price: '£999',
    period: '/month',
    color: '#185fa5',
    bg: '#e6f1fb',
    desc: 'Built for universities and large student housing providers',
    features: ['Unlimited student users', 'White-label branding', 'Advanced analytics & reporting', 'API integration with student portal', 'Dedicated account manager', 'Priority buddy matching', 'Custom arrival checklist'],
    cta: 'Book a Demo',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    color: '#7c3aed',
    bg: '#f3f0ff',
    desc: 'For large networks, agents and national partnerships',
    features: ['Multi-institution management', 'Custom AI assistant training', 'Full white-label solution', 'Dedicated development support', 'SLA guarantee', 'On-site onboarding', 'Revenue share model'],
    cta: 'Contact Us',
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

export default function B2BPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

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
          alt="University students" style={styles.heroBg} />
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
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
              Book a Demo →
            </button>
            <button style={styles.ghostBtn}
              onClick={() => navigate('/landing')}>
              View Student Platform
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
            <h2 style={styles.sectionTitle}>Transparent pricing for every institution</h2>
            <p style={styles.sectionSub}>All plans include a 30-day pilot. No setup fees.</p>
          </div>
          <div style={styles.pricingGrid}>
            {tiers.map(t => (
              <div key={t.name} style={{
                ...styles.pricingCard,
                border: t.featured ? `2px solid ${t.color}` : '1.5px solid var(--border)',
                transform: t.featured ? 'scale(1.02)' : 'scale(1)',
                boxShadow: t.featured ? `0 8px 30px ${t.color}25` : 'var(--shadow-sm)',
              }}>
                {t.featured && (
                  <div style={{ ...styles.featuredBadge, background: t.color }}>Most Popular</div>
                )}
                <div style={{ ...styles.pricingTop, background: t.bg }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: t.color, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', fontWeight: 900, color: t.color }}>{t.price}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.period}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{t.desc}</div>
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
                  <button
                    style={{ ...styles.pricingBtn, background: t.color }}
                    onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                    {t.cta} →
                  </button>
                </div>
              </div>
            ))}
          </div>
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
  navInner: { maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  logoMark: { width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,var(--green),var(--green-mid))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 18 },
  logoText: { fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', fontWeight: 700, color: 'var(--green)' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 24 },
  navLink: { fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color .2s' },
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