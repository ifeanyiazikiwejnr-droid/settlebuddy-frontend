const sectors = [
  { icon: '🏥', title: 'Healthcare & Care', desc: 'Nursing, care homes, NHS support, domiciliary care', links: [
    { name: 'NHS Jobs', url: 'https://www.jobs.nhs.uk' },
    { name: 'Carehome Jobs', url: 'https://www.carehome.co.uk/jobs' },
    { name: 'CV-Library Care', url: 'https://www.cv-library.co.uk/jobs/care' },
  ]},
  { icon: '📦', title: 'Warehouse & Logistics', desc: 'Packing, forklift, delivery driving, night shifts', links: [
    { name: 'Indeed Warehouse', url: 'https://www.indeed.co.uk/warehouse-jobs' },
    { name: 'Blue Arrow', url: 'https://www.blue-arrow.co.uk' },
    { name: 'Randstad', url: 'https://www.randstad.co.uk' },
  ]},
  { icon: '🏗️', title: 'Construction', desc: 'Labouring, trades, site work, CSCS card jobs', links: [
    { name: 'Construction Jobs', url: 'https://www.constructionjobs.com' },
    { name: 'Build Recruitment', url: 'https://www.buildrecruitment.co.uk' },
    { name: 'Indeed Construction', url: 'https://www.indeed.co.uk/construction-jobs' },
  ]},
  { icon: '💻', title: 'IT & Technology', desc: 'Software, support, data, cybersecurity, networking', links: [
    { name: 'CW Jobs', url: 'https://www.cwjobs.co.uk' },
    { name: 'Tech Jobs Fair', url: 'https://www.techjobsfair.com' },
    { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs' },
  ]},
  { icon: '🍽️', title: 'Hospitality & Catering', desc: 'Restaurants, hotels, kitchen, bar and event staff', links: [
    { name: 'Caterer.com', url: 'https://www.caterer.com' },
    { name: 'Hospitality Staff', url: 'https://www.hospitalitystaff.co.uk' },
    { name: 'Indeed Hospitality', url: 'https://www.indeed.co.uk/hospitality-jobs' },
  ]},
  { icon: '🛒', title: 'Retail', desc: 'Shop floor, cashier, customer service, stock room', links: [
    { name: 'Retail Choice', url: 'https://www.retailchoice.com' },
    { name: 'Tesco Jobs', url: 'https://www.jobs.tesco.com' },
    { name: 'Indeed Retail', url: 'https://www.indeed.co.uk/retail-jobs' },
  ]},
  { icon: '🎓', title: 'Education & Tutoring', desc: 'Teaching assistants, tutoring, university roles', links: [
    { name: 'TES Jobs', url: 'https://www.tes.com/jobs' },
    { name: 'Jobs.ac.uk', url: 'https://www.jobs.ac.uk' },
    { name: 'Tutor.com', url: 'https://www.tutor.com' },
  ]},
  { icon: '🔧', title: 'Maintenance & Cleaning', desc: 'Facilities, cleaning contracts, building services', links: [
    { name: 'Cleaning Jobs UK', url: 'https://www.cleaningjobs.co.uk' },
    { name: 'Indeed Cleaning', url: 'https://www.indeed.co.uk/cleaning-jobs' },
    { name: 'ServiceMaster', url: 'https://www.servicemasterjobs.co.uk' },
  ]},
];

const generalBoards = [
  { name: 'Indeed UK', url: 'https://www.indeed.co.uk', cls: 'badge-teal' },
  { name: 'Reed.co.uk', url: 'https://www.reed.co.uk', cls: 'badge-amber' },
  { name: 'Total Jobs', url: 'https://www.totaljobs.com', cls: 'badge-coral' },
  { name: 'Monster UK', url: 'https://www.monster.co.uk', cls: 'badge-teal' },
  { name: 'Gumtree Jobs', url: 'https://www.gumtree.com/jobs', cls: 'badge-amber' },
  { name: 'Glassdoor', url: 'https://www.glassdoor.co.uk', cls: 'badge-coral' },
];

export default function JobsPage() {
  return (
    <div>
      <div className="page-header">
        <h2>Jobs</h2>
        <p>Find work opportunities across different sectors in the UK</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {sectors.map(s => (
          <div key={s.title} className="card">
            <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{s.icon}</div>
            <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{s.title}</h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>{s.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {s.links.map(l => (
                <a key={l.name} href={l.url} target="_blank" rel="noreferrer"
                  style={{ fontSize: 12, color: 'var(--teal)', textDecoration: 'none' }}>
                  {l.name} →
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>General Job Boards</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {generalBoards.map(b => (
            <a key={b.name} href={b.url} target="_blank" rel="noreferrer"
              className={`badge ${b.cls}`} style={{ cursor: 'pointer' }}>
              {b.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
