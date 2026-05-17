import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const agencies = [
  { name: 'Rightmove', desc: "UK's largest property portal", url: 'https://www.rightmove.co.uk', icon: '🏠' },
  { name: 'Zoopla', desc: 'Search homes to rent & buy', url: 'https://www.zoopla.co.uk', icon: '🔍' },
  { name: 'SpareRoom', desc: 'Find rooms & flatmates', url: 'https://www.spareroom.co.uk', icon: '🛏️' },
  { name: 'OpenRent', desc: 'Rent directly from landlords', url: 'https://www.openrent.co.uk', icon: '🗝️' },
  { name: 'Unipol', desc: 'Student accommodation specialist', url: 'https://www.unipol.org.uk', icon: '🎓' },
  { name: 'Student Accommodation', desc: 'Purpose-built student housing', url: 'https://www.studentaccommodation.com', icon: '🏢' },
];

const cityImages = {
  'birmingham': 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=400&q=70',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=70',
  'manchester': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
  'leeds': 'https://images.unsplash.com/photo-1590736969596-b27a3e3e39d3?w=400&q=70',
  'coventry': 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=400&q=70',
  'default': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70',
};

const getCityImage = (city) => {
  const key = city?.toLowerCase();
  return cityImages[key] || cityImages['default'];
};

const emptyForm = { title: '', location: '', price: '', type: 'Studio', description: '', status: 'available', image_url: '' };

export default function AccommodationsPage() {
  const { user } = useAuth();
  const { showToast } = useOutletContext();
  const [view, setView] = useState('agencies'); // 'agencies' | 'cities' | 'listings'
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const loadCities = async () => {
    try {
      const res = await axios.get('/api/accommodations/cities');
      setCities(res.data);
    } catch {}
  };

  const loadListings = async (city) => {
    try {
      const res = await axios.get('/api/accommodations', { params: { city } });
      setListings(res.data);
    } catch {}
  };

  useEffect(() => { loadCities(); }, []);

  const selectCity = (city) => {
    setSelectedCity(city);
    loadListings(city);
    setView('listings');
  };

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!form.title || !form.location || !form.price) return showToast('Please fill required fields');
    setSaving(true);
    try {
      let image_url = form.image_url;
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        const token = localStorage.getItem('sib_token');
        const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const uploadRes = await axios.post(`${baseURL}/api/upload/accommodation`, formData, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        image_url = uploadRes.data.url;
        setUploading(false);
      }
      await axios.post('/api/accommodations', { ...form, price: parseInt(form.price), image_url });
      showToast('Listing added!');
      setForm(emptyForm);
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
      loadCities();
      if (selectedCity) loadListings(selectedCity);
    } catch (err) {
      showToast(err.response?.data?.error || 'Error saving');
    } finally { setSaving(false); setUploading(false); }
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Remove this listing?')) return;
    try {
      await axios.delete(`/api/accommodations/${id}`);
      showToast('Listing removed');
      loadCities();
      if (selectedCity) loadListings(selectedCity);
    } catch {}
  };

  return (
    <div>
      <div className="page-header">
        <h2>Accommodations</h2>
        <p>Find your perfect place to live in the UK</p>
      </div>

      {/* Tab switcher */}
      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(view === 'agencies' ? styles.tabActive : {}) }}
          onClick={() => setView('agencies')}>
          🔗 Housing Agencies
        </button>
        <button style={{ ...styles.tab, ...(view === 'cities' || view === 'listings' ? styles.tabActive : {}) }}
          onClick={() => { setView('cities'); setSelectedCity(null); }}>
          🏡 Listed Properties
        </button>
      </div>

      {/* AGENCIES VIEW */}
      {view === 'agencies' && (
        <div>
          <div className="section-title" style={{ marginTop: '1.5rem' }}>Popular Housing Agencies</div>
          <div className="grid-2">
            {agencies.map(a => (
              <a key={a.name} href={a.url} target="_blank" rel="noreferrer" style={styles.linkCard}>
                <div style={styles.linkIcon}>{a.icon}</div>
                <div>
                  <h4 style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{a.name}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.desc}</p>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--text-faint)', fontSize: 16 }}>→</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* CITIES VIEW */}
      {view === 'cities' && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
            <div className="section-title" style={{ margin: 0 }}>
              Cities with Listings
              <span style={styles.countBadge}>{cities.length}</span>
            </div>
            {user?.role === 'admin' && (
              <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}
                onClick={() => setShowForm(f => !f)}>
                {showForm ? 'Cancel' : '+ Add Listing'}
              </button>
            )}
          </div>

          {/* Admin upload form */}
          {user?.role === 'admin' && showForm && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '1rem', color: 'var(--green)' }}>
                New Listing
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,200px),1fr))', gap: 12 }}>
                <div className="form-group"><label>Title *</label><input name="title" value={form.title} onChange={handle} placeholder="e.g. 2-Bed Flat, Erdington" /></div>
                <div className="form-group"><label>Location * (City first)</label><input name="location" value={form.location} onChange={handle} placeholder="e.g. Birmingham, B23" /></div>
                <div className="form-group"><label>Monthly Rent (£) *</label><input name="price" type="number" value={form.price} onChange={handle} placeholder="650" /></div>
                <div className="form-group"><label>Type</label>
                  <select name="type" value={form.type} onChange={handle}>
                    {['Studio','1 Bed','2 Bed','Shared Room','En-suite'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Description</label><textarea name="description" rows={2} value={form.description} onChange={handle} placeholder="Bills included, close to university..." /></div>
              <div className="form-group"><label>Status</label>
                <select name="status" value={form.status} onChange={handle}>
                  <option value="available">Available</option>
                  <option value="under_offer">Under Offer</option>
                  <option value="taken">Taken</option>
                </select>
              </div>
              <div className="form-group">
                <label>Property Image</label>
                <div style={styles.uploadBox} onClick={() => document.getElementById('img-upload').click()}>
                  {imagePreview ? (
                    <div>
                      <img src={imagePreview} alt="preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 6 }} />
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: 6 }}>📷</div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Click to upload image</p>
                      <p style={{ fontSize: 11, color: 'var(--text-faint)' }}>JPG, PNG · Max 5MB</p>
                    </div>
                  )}
                </div>
                <input id="img-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>
              <button className="btn-primary" style={{ width: '100%', padding: 12 }}
                onClick={submit} disabled={saving || uploading}>
                {uploading ? 'Uploading image...' : saving ? 'Saving...' : 'Add Listing'}
              </button>
            </div>
          )}

          {cities.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🏙️</div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>No listings yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {user?.role === 'admin' ? 'Add your first listing above.' : 'Check back soon.'}
              </p>
            </div>
          ) : (
            <div style={styles.cityGrid}>
              {cities.map(c => (
                <div key={c.city} style={styles.cityCard} onClick={() => selectCity(c.city)}
                  className="card-hover">
                  <div style={styles.cityImg}>
                    <img src={getCityImage(c.city)} alt={c.city}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={styles.cityOverlay} />
                    <div style={styles.cityContent}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>
                        {c.city}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                        {c.count} {parseInt(c.count) === 1 ? 'property' : 'properties'}
                      </div>
                    </div>
                  </div>
                  <div style={styles.cityFooter}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>View properties →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LISTINGS VIEW */}
      {view === 'listings' && selectedCity && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button style={styles.backBtn} onClick={() => { setView('cities'); setSelectedCity(null); }}>
              ← Back
            </button>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', textTransform: 'capitalize' }}>
                {selectedCity}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{listings.length} {listings.length === 1 ? 'property' : 'properties'} available</p>
            </div>
          </div>

          {listings.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No listings found for {selectedCity}</p>
            </div>
          ) : (
            <div style={styles.listingsGrid}>
              {listings.map(l => (
                <div key={l.id} className="card card-hover" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => navigate(`/accommodations/${l.id}`)}>
                  {/* Image */}
                  <div style={{ height: 180, background: 'linear-gradient(135deg,#9FE1CB,#1d9e75)', position: 'relative', overflow: 'hidden' }}>
                    {l.image_url
                      ? <img src={l.image_url} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏠</div>
                    }
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <span className={`badge ${l.status === 'available' ? 'badge-green' : 'badge-amber'}`}>
                        {l.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{l.title}</h4>
                    <div style={{ fontSize: '1.2rem', fontFamily: "'Playfair Display',serif", color: 'var(--green)', marginBottom: 6 }}>
                      £{l.price}<span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                      📍 {l.location} · {l.type}
                    </div>
                    {l.description && (
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 }}>
                        {l.description}
                      </p>
                    )}
                    {user?.role === 'admin' && (
                      <button onClick={() => deleteListing(l.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--coral-dark)', fontWeight: 600, padding: 0 }}>
                        Remove listing
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  tabs: { display: 'flex', gap: 8, marginBottom: '0.5rem', background: 'var(--cream-dark)', borderRadius: 14, padding: 5 },
  tab: { flex: 1, padding: '10px 16px', border: 'none', background: 'transparent', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s', minHeight: 44 },
  tabActive: { background: '#fff', color: 'var(--green)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  linkCard: { background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, color: 'inherit', transition: 'all .15s' },
  linkIcon: { width: 40, height: 40, borderRadius: 10, background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  countBadge: { background: 'var(--green-light)', color: 'var(--green)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 },
  cityGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '1rem' },
  cityCard: { background: '#fff', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer' },
  cityImg: { height: 160, position: 'relative', overflow: 'hidden' },
  cityOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' },
  cityContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' },
  cityFooter: { padding: '0.75rem 1rem', borderTop: '1px solid var(--border)' },
  listingsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.25rem' },
  emptyState: { background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' },
  uploadBox: { border: '2px dashed var(--border)', borderRadius: 12, padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--cream)' },
  backBtn: { background: 'var(--green-light)', border: 'none', borderRadius: 50, padding: '8px 18px', fontSize: 13, fontWeight: 700, color: 'var(--green)', cursor: 'pointer', minHeight: 44 },
};