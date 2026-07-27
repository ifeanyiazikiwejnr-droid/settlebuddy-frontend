import { useState } from 'react';

const sections = [
  {
    key: 'mental',
    icon: '💚',
    title: 'Mental Health Support',
    color: '#0a5c44',
    bg: 'var(--green-light)',
    border: '#9FE1CB',
    content: [
      {
        type: 'text',
        body: 'Moving to a new country is exciting but can also be overwhelming. Feelings of loneliness, homesickness, anxiety and stress are completely normal. You are not alone — many students feel exactly the same way.',
      },
      {
        type: 'cards',
        items: [
          { icon: '🏥', title: 'University Counselling', desc: 'Every UK university has a free counselling service. Search "[your university] counselling service" to find and book an appointment.', link: null },
          { icon: '📞', title: 'Samaritans', desc: 'Free 24/7 emotional support line. Call any time if you are struggling.', link: 'tel:116123', linkText: 'Call 116 123' },
          { icon: '💬', title: 'Shout', desc: 'Free confidential text support. Text SHOUT to 85258 any time, day or night.', link: 'https://www.giveusashout.org', linkText: 'Visit Shout' },
          { icon: '🧠', title: 'Student Minds', desc: 'UK\'s leading student mental health charity with resources, peer support and guidance.', link: 'https://www.studentminds.org.uk', linkText: 'Visit Student Minds' },
          { icon: '🌍', title: 'Mind', desc: 'Mental health support and information. Their website has resources in multiple languages.', link: 'https://www.mind.org.uk', linkText: 'Visit Mind' },
          { icon: '📱', title: 'Togetherall', desc: 'Anonymous online community for mental health support. Many universities offer free access.', link: 'https://togetherall.com', linkText: 'Visit Togetherall' },
        ],
      },
    ],
  },
  {
    key: 'homesick',
    icon: '🏠',
    title: 'Dealing with Homesickness',
    color: '#185fa5',
    bg: '#e6f1fb',
    border: '#B5D4F4',
    content: [
      {
        type: 'text',
        body: 'Homesickness is one of the most common challenges for international students. It usually gets easier with time as you build new routines and friendships.',
      },
      {
        type: 'tips',
        items: [
          { icon: '📅', tip: 'Schedule regular video calls with family and friends back home — having something to look forward to helps.' },
          { icon: '🍽️', tip: 'Cook familiar foods from home. Finding ingredients at international supermarkets can itself be a fun adventure.' },
          { icon: '🤝', tip: 'Join your university\'s international student society or a society related to your home country.' },
          { icon: '🚶', tip: 'Get outside every day even for a short walk. Fresh air and movement significantly improve mood.' },
          { icon: '📸', tip: 'Document your journey — photos and a journal help you see how much you\'ve grown and experienced.' },
          { icon: '🎯', tip: 'Give yourself small goals each week — trying a new place, meeting someone new, or learning something about UK culture.' },
        ],
      },
    ],
  },
  {
    key: 'cultural',
    icon: '🌍',
    title: 'Cultural Adaptation',
    color: '#7c3aed',
    bg: '#f3f0ff',
    border: '#c4b5fd',
    content: [
      {
        type: 'text',
        body: 'Every culture has its own unwritten rules. Understanding UK culture helps you feel more confident and settled in your new home.',
      },
      {
        type: 'tips',
        items: [
          { icon: '☔', tip: 'Weather talk is a genuine conversation starter in the UK — embrace it!' },
          { icon: '🚶', tip: 'Queue etiquette is serious in the UK. Always join the back of a queue and never push in.' },
          { icon: '🙏', tip: 'British people say "sorry" and "thank you" very frequently — it\'s considered polite.' },
          { icon: '🕐', tip: 'Punctuality matters — being on time for lectures, appointments and work is expected.' },
          { icon: '🤫', tip: 'Personal space and privacy are valued. Avoid asking personal questions like salary or age too early.' },
          { icon: '🍺', tip: 'Pub culture is central to British social life — you can join without drinking alcohol, soft drinks are always available.' },
        ],
      },
    ],
  },
  {
    key: 'physical',
    icon: '🏃',
    title: 'Physical Wellbeing',
    color: '#d97706',
    bg: 'var(--amber-light)',
    border: '#fcd34d',
    content: [
      {
        type: 'text',
        body: 'Looking after your physical health is just as important as your mental health. As a student who paid the Immigration Health Surcharge, you have full access to NHS services for free.',
      },
      {
        type: 'cards',
        items: [
          { icon: '🏥', title: 'Register with a GP', desc: 'Your first step — register with a local GP surgery as soon as you arrive. You can search for your nearest one on the NHS website.', link: 'https://www.nhs.uk/service-search/find-a-gp', linkText: 'Find a GP' },
          { icon: '🦷', title: 'NHS Dentist', desc: 'Find an NHS dentist near you. As a student you may be entitled to free dental treatment.', link: 'https://www.nhs.uk/service-search/find-a-dentist', linkText: 'Find a Dentist' },
          { icon: '💊', title: 'Prescriptions', desc: 'If you are under 18 or have a qualifying condition, prescriptions are free. Otherwise they cost a fixed amount per item.', link: 'https://www.nhs.uk/nhs-services/prescriptions-and-pharmacies', linkText: 'Learn more' },
          { icon: '🏋️', title: 'University Gym', desc: 'Most universities have heavily discounted gym memberships for students. Check your student union website.', link: null },
          { icon: '🚨', title: 'Emergency — 999', desc: 'Call 999 for life-threatening emergencies — police, fire or ambulance.', link: 'tel:999', linkText: 'Call 999' },
          { icon: '🏥', title: 'Non-Emergency — 111', desc: 'Call 111 for urgent medical advice that is not life-threatening. Available 24/7.', link: 'tel:111', linkText: 'Call 111' },
        ],
      },
    ],
  },
  {
    key: 'financial',
    icon: '💰',
    title: 'Financial Wellbeing',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#6ee7b7',
    content: [
      {
        type: 'text',
        body: 'Financial stress is one of the biggest causes of anxiety for international students. Here are resources and tips to help you manage your money.',
      },
      {
        type: 'tips',
        items: [
          { icon: '🏦', tip: 'Open a UK bank account as soon as possible — Monzo and Starling are easiest for new arrivals with no credit history.' },
          { icon: '🛒', tip: 'Shop at budget supermarkets like Lidl, Aldi and Asda. They are significantly cheaper than Tesco or Sainsbury\'s.' },
          { icon: '🎓', tip: 'Always show your student ID — you get discounts at cinemas, restaurants, transport and hundreds of shops.' },
          { icon: '🍱', tip: 'Cooking at home saves a huge amount — meal prep on Sundays to save time and money through the week.' },
          { icon: '📱', tip: 'Use apps like Too Good To Go for discounted surplus food from restaurants and cafes near you.' },
          { icon: '💸', tip: 'If you are struggling financially, speak to your university\'s student support team — hardship funds are available.' },
        ],
      },
    ],
  },
  {
    key: 'emergency',
    icon: '🚨',
    title: 'Emergency Contacts',
    color: '#dc2626',
    bg: '#fff1f2',
    border: '#fecaca',
    content: [
      {
        type: 'emergency',
        items: [
          { number: '999', label: 'Emergency Services', desc: 'Police, Fire, Ambulance — life-threatening situations only', color: '#dc2626' },
          { number: '111', label: 'NHS Non-Emergency', desc: 'Urgent medical advice available 24/7', color: '#d97706' },
          { number: '101', label: 'Police Non-Emergency', desc: 'For reporting crime that is not happening right now', color: '#185fa5' },
          { number: '116 123', label: 'Samaritans', desc: 'Free emotional support anytime day or night', color: '#0a5c44' },
          { number: '116 000', label: 'Missing People', desc: 'If you or someone you know goes missing', color: '#7c3aed' },
          { number: '85258', label: 'Shout (Text)', desc: 'Text SHOUT for confidential mental health support', color: '#059669' },
        ],
      },
    ],
  },
];

export default function WellbeingPage() {
  const [active, setActive] = useState('mental');
  const activeSection = sections.find(s => s.key === active);

  return (
    <div>
      <div className="page-header">
        <h2>Wellbeing Hub</h2>
        <p>Your mental, physical and financial health matters — we've got you covered</p>
      </div>

      {/* Section tabs — horizontal scroll on mobile */}
      <div style={styles.tabStrip}>
        {sections.map(s => (
          <button key={s.key} onClick={() => setActive(s.key)}
            style={{
              ...styles.tab,
              background: active === s.key ? s.color : '#fff',
              color: active === s.key ? '#fff' : 'var(--text-muted)',
              borderColor: active === s.key ? s.color : 'var(--border)',
              boxShadow: active === s.key ? `0 4px 14px ${s.color}40` : 'none',
            }}>
            <span>{s.icon}</span>
            <span style={{ fontSize: 12 }}>{s.title.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active section content */}
      {activeSection && (
        <div>
          {/* Section header */}
          <div style={{ ...styles.sectionHeader, background: activeSection.bg, borderColor: activeSection.border }}>
            <div style={{ fontSize: '2.5rem' }}>{activeSection.icon}</div>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', color: activeSection.color, marginBottom: 4 }}>
                {activeSection.title}
              </h3>
            </div>
          </div>

          {/* Content blocks */}
          {activeSection.content.map((block, i) => (
            <div key={i}>
              {block.type === 'text' && (
                <p style={styles.bodyText}>{block.body}</p>
              )}

              {block.type === 'cards' && (
                <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                  {block.items.map(item => (
                    <div key={item.title} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ fontSize: '1.8rem' }}>{item.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>{item.desc}</p>
                      {item.link && (
                        <a href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'}
                          rel="noreferrer" style={styles.cardLink}>
                          {item.linkText} →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {block.type === 'tips' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
                  {block.items.map((item, j) => (
                    <div key={j} className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</div>
                      <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>{item.tip}</p>
                    </div>
                  ))}
                </div>
              )}

              {block.type === 'emergency' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
                  {block.items.map(item => (
                    <a key={item.number} href={`tel:${item.number.replace(/\s/g, '')}`}
                      style={{ ...styles.emergencyCard, borderColor: item.color, textDecoration: 'none' }}>
                      <div style={{ ...styles.emergencyNum, background: item.color }}>
                        {item.number}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.desc}</div>
                      </div>
                      <span style={{ color: item.color, fontSize: 20, flexShrink: 0 }}>→</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  tabStrip: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 8,
    marginBottom: '1.5rem',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '10px 14px',
    border: '1.5px solid',
    borderRadius: 14,
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontWeight: 600,
    flexShrink: 0,
    transition: 'all .2s',
    minWidth: 70,
    minHeight: 60,
    fontSize: 20,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '1.25rem',
    borderRadius: 16,
    border: '1.5px solid',
    marginBottom: '1.25rem',
  },
  bodyText: {
    fontSize: 15,
    color: 'var(--text-muted)',
    lineHeight: 1.8,
    marginBottom: '1.25rem',
  },
  cardLink: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--green)',
    textDecoration: 'none',
  },
  emergencyCard: {
    background: '#fff',
    border: '1.5px solid',
    borderRadius: 14,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    cursor: 'pointer',
    transition: 'all .15s',
  },
  emergencyNum: {
    color: '#fff',
    fontFamily: "'Playfair Display',serif",
    fontWeight: 700,
    fontSize: 16,
    padding: '8px 12px',
    borderRadius: 10,
    flexShrink: 0,
    minWidth: 70,
    textAlign: 'center',
  },
};