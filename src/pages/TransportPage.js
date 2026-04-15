const rideSections = [
  { title: '🚗 Ride-Hailing', links: [
    { name:'Uber', desc:'Available across major UK cities', url:'https://www.uber.com/gb' },
    { name:'Bolt', desc:'Often cheaper than Uber', url:'https://bolt.eu/en-gb' },
    { name:'Free Now', desc:'Taxis & private hire', url:'https://www.freenow.com/gb' },
    { name:'Ola Cabs', desc:'Popular alternative', url:'https://www.ola.com/gb' },
  ]},
  { title: '🚌 Bus Networks', links: [
    { name:'NX Bus', desc:'Midlands bus network', url:'https://www.nxbus.co.uk' },
    { name:'Stagecoach', desc:'Nationwide bus services', url:'https://www.stagecoachbus.com' },
    { name:'First Bus', desc:'England & Scotland', url:'https://www.firstbus.co.uk' },
    { name:'Arriva', desc:'Buses across 11 regions', url:'https://www.arrivabus.co.uk' },
  ]},
  { title: '🚆 Rail & Long Distance', links: [
    { name:'National Rail', desc:'Train times & tickets', url:'https://www.nationalrail.co.uk' },
    { name:'Megabus', desc:'Budget intercity coaches', url:'https://www.megabus.com/uk' },
    { name:'16-25 Railcard', desc:'Save 1/3 on all rail travel', url:'https://www.16-25railcard.co.uk' },
    { name:'TfL (London)', desc:'Tube, bus & Elizabeth line', url:'https://tfl.gov.uk' },
  ]},
];

export default function TransportPage() {
  return (
    <div>
      <div className="page-header">
        <h2>Transportation</h2>
        <p>Getting around the UK as a student</p>
      </div>
      <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--teal-light)', borderColor: '#9FE1CB' }}>
        <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--teal)' }}>🚌 How UK Transport Works</h4>
        <p style={{ fontSize: 13, color: '#085041', lineHeight: 1.7 }}>
          The UK has an extensive public transport network. Most cities have local buses, and major cities like Birmingham, London, Manchester and Leeds have metro or tram systems. You can get a <strong>16-25 Railcard</strong> to save a third on train fares. As a student, many universities also offer discounted bus passes. Always keep a contactless card — most transport now accepts tap-to-pay. For London, download the <strong>TfL Go</strong> app to plan journeys.
        </p>
      </div>
      {rideSections.map(section => (
        <div key={section.title} style={{ marginBottom: '1.5rem' }}>
          <div className="section-title">{section.title}</div>
          <div className="grid-2">
            {section.links.map(l => (
              <a key={l.name} href={l.url} target="_blank" rel="noreferrer" style={styles.linkCard}>
                <div style={styles.linkIcon}>🔗</div>
                <div><h4 style={{ fontSize: 13.5, fontWeight: 500 }}>{l.name}</h4><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.desc}</p></div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  linkCard: { background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, color: 'inherit', transition: 'all .15s' },
  linkIcon: { width: 36, height: 36, borderRadius: 8, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
};
