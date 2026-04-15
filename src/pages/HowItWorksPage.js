const steps = [
  { num: 1, title: 'Create your student profile', body: 'Sign up as a student and tell us about yourself — your university, languages spoken, ethnicity, and what support you\'re looking for in the UK.' },
  { num: 2, title: 'Get matched with a buddy', body: 'We match you with a buddy who shares your language, ethnicity, or background. Your buddy has already been through the UK student experience and is ready to guide you.' },
  { num: 3, title: 'Connect and chat', body: 'Once matched, you can message your buddy directly. Ask anything — from which supermarket is cheapest, to how to open a UK bank account or get an Oyster card.' },
  { num: 4, title: 'Explore your resources', body: 'Use the Accommodations, Transport, and Jobs sections to find housing, understand how to get around, and discover work opportunities suited to students.' },
  { num: 5, title: 'Become a buddy yourself', body: 'Once you\'ve settled in, register as a buddy to help the next wave of international students arriving in the UK. Pay it forward!' },
];

export default function HowItWorksPage() {
  return (
    <div>
      <div className="page-header">
        <h2>How it Works</h2>
        <p>Settle-In Buddy makes your UK journey smooth from day one</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '2rem' }}>
        {steps.map(s => (
          <div key={s.num} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
              {s.num}
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{s.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: 'var(--teal-light)', borderColor: '#9FE1CB' }}>
        <div style={{ fontSize: '1rem', fontFamily: "'DM Serif Display',serif", color: 'var(--teal)', marginBottom: 6 }}>
          Who is Settle-In Buddy for?
        </div>
        <p style={{ fontSize: 13, color: '#085041', lineHeight: 1.7 }}>
          Any international student starting university life in the UK. Whether you're from Nigeria, India, China, Ghana, Pakistan, or anywhere else in the world — we have buddies who understand your culture, speak your language, and know exactly what you're going through.
        </p>
      </div>
    </div>
  );
}
