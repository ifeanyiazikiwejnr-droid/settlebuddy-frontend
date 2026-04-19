import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const agencies = [
  { name: 'Rightmove', desc: "UK's largest property portal", url: 'https://www.rightmove.co.uk', icon: '🏠' },
  { name: 'Zoopla', desc: 'Search homes to rent & buy', url: 'https://www.zoopla.co.uk', icon: '🔍' },
  { name: 'SpareRoom', desc: 'Find rooms & flatmates', url: 'https://www.spareroom.co.uk', icon: '🛏️' },
  { name: 'OpenRent', desc: 'Rent directly from landlords', url: 'https://www.openrent.co.uk', icon: '🗝️' },
  { name: 'Unipol', desc: 'Student accommodation specialist', url: 'https://www.unipol.org.uk', icon: '🎓' },
  { name: 'Student Accommodation', desc: 'Purpose-built student housing', url: 'https://www.studentaccommodation.com', icon: '🏢' },
];

const emptyForm = { title: '', location: '', price: '', type: 'Studio', description: '', status: 'available', image_url: '' };

export default function AccommodationsPage() {
  const { user } = useAuth();
  const { showToast } = useOutletContext();
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try { const res = await axios.get('/api/accommodations'); setListings(res.data); } catch {}
  };

  useEffect(() => { load(); }, []);

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

      // Upload image first if one was selected
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        const token = localStorage.getItem('sib_token');
        const uploadRes = await axios.post('/api/upload/accommodation', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });
        image_url = uploadRes.data.url;
        setUploading(false);
      }

      await axios.post('/api/accommodations', { ...form, price: parseInt(form.price), image_url });
      showToast('Listing added!');
      setForm(emptyForm);
      setImageFile(null);
      setImagePreview(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Error saving');
    } finally { setSaving(false); setUploading(false); }
  };

  const deleteListing = async (id) => {
    try { await axios.delete(`/api/accommodations/${id}`); showToast('Deleted'); load(); } catch {}
  };

  return (
    <div>
      <div className="page-header">
        <h2>Accommodations</h2>
        <p>Find your perfect place to live in the UK</p>
      </div>

      <div className="section-title">🔗 Popular Housing Agencies</div>
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {agencies.map(a => (
          <a key={a.name} href={a.url} target="_blank" rel="noreferrer" style={styles.linkCard}>
            <div style={styles.linkIcon}>{a.icon}</div>
            <div><h4 style={{ fontSize: 13.5, fontWeight: 500 }}>{a.name}</h4><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.desc}</p></div>
          </a>
        ))}
      </div>

      <hr className="divider" />
      <div className="section-title">
        🏡 Available Properties <span className="badge badge-teal">Admin Listed</span>
      </div>

      {listings.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No listings yet. {user?.role === 'admin' ? 'Add one below.' : 'Check back soon.'}</p>
      ) : (
        <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
          {listings.map(l => (
            <div key={l.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ height: 140, background: 'linear-gradient(135deg,#9FE1CB,#1d9e75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', overflow: 'hidden', position: 'relative' }}>
                {l.image_url
                  ? <img src={l.image_url} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : '🏠'
                }
              </div>
              <div style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{l.title}</h4>
                <div style={{ fontSize: '1.1rem', fontFamily: "'DM Serif Display',serif", color: 'var(--teal)', margin: '6px 0' }}>£{l.price}/mo</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.location} · {l.type}</div>
                {l.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{l.description}</p>}
                <span className={`badge ${l.status === 'available' ? 'badge-teal' : 'badge-amber'}`} style={{ marginTop: 8 }}>
                  {l.status.replace('_', ' ')}
                </span>
                {user?.role === 'admin' && (
                  <button onClick={() => deleteListing(l.id)} style={{ display: 'block', marginTop: 8, fontSize: 12, color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Remove listing
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {user?.role === 'admin' && (
        <>
          <hr className="divider" />
          <div className="section-title">➕ Upload New Listing</div>
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div className="form-group"><label>Title *</label><input name="title" value={form.title} onChange={handle} placeholder="e.g. 2-Bed Flat, Erdington" /></div>
              <div className="form-group"><label>Location *</label><input name="location" value={form.location} onChange={handle} placeholder="e.g. Birmingham, B23" /></div>
              <div className="form-group"><label>Monthly Rent (£) *</label><input name="price" type="number" value={form.price} onChange={handle} placeholder="650" /></div>
              <div className="form-group"><label>Type</label>
                <select name="type" value={form.type} onChange={handle}>
                  {['Studio','1 Bed','2 Bed','Shared Room','En-suite'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label>Property Image</label>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 12, padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--cream)' }}
                onClick={() => document.getElementById('img-upload').click()}>
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click to change image</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>📷</div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Click to upload image</p>
                    <p style={{ fontSize: 11, color: 'var(--text-faint)' }}>JPG, PNG or WebP · Max 5MB</p>
                  </div>
                )}
              </div>
              <input id="img-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>
            <div className="form-group"><label>Description</label><textarea name="description" rows={2} value={form.description} onChange={handle} placeholder="Bills included, close to university..." /></div>
            <div className="form-group"><label>Status</label>
              <select name="status" value={form.status} onChange={handle}>
                <option value="available">Available</option>
                <option value="under_offer">Under Offer</option>
                <option value="taken">Taken</option>
              </select>
            </div>
            <button className="btn-primary" onClick={submit} disabled={saving || uploading}>
              {uploading ? 'Uploading image...' : saving ? 'Saving...' : 'Add Listing'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  linkCard: { background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, color: 'inherit', transition: 'all .15s' },
  linkIcon: { width: 38, height: 38, borderRadius: 8, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
};
