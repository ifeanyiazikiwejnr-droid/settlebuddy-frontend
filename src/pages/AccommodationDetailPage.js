import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import useConfirm from '../hooks/useConfirm';

export default function AccommodationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useOutletContext();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [detailedDesc, setDetailedDesc] = useState('');
  const [savingDesc, setSavingDesc] = useState(false);
  const { modal, confirm } = useConfirm();

  const load = async () => {
    try {
      const res = await axios.get(`/api/accommodations/${id}`);
      setListing(res.data);
      setDetailedDesc(res.data.detailed_description || '');
    } catch { navigate(-1); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  // All images combined — main image + extra images
  const allImages = listing ? [
    ...(listing.image_url ? [{ url: listing.image_url, main: true }] : []),
    ...(listing.images || []).map(i => ({ ...i, main: false })),
  ] : [];

  const uploadExtraImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('sib_token');
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const uploadRes = await axios.post(`${baseURL}/api/upload/accommodation`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.post(`/api/accommodations/${id}/images`, { url: uploadRes.data.url });
      showToast('Image added!');
      load();
    } catch { showToast('Error uploading image'); }
    finally { setUploading(false); }
  };

  const deleteImage = async (imageId) => {
    const ok = await confirm({
      title: 'Remove Image',
      message: 'Are you sure you want to remove this image?',
      confirmText: 'Remove',
      cancelText: 'Keep it',
      danger: true,
    });
    if (!ok) return;
    try {
      await axios.delete(`/api/accommodations/${id}/images/${imageId}`);
      showToast('Image removed');
      if (activeImg >= allImages.length - 1) setActiveImg(0);
      load();
    } catch { showToast('Error removing image'); }
  };

  const saveDesc = async () => {
    setSavingDesc(true);
    try {
      await axios.patch(`/api/accommodations/${id}`, { detailed_description: detailedDesc });
      showToast('Description saved!');
      setEditingDesc(false);
      load();
    } catch { showToast('Error saving'); }
    finally { setSavingDesc(false); }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!listing) return null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Back button */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

      {/* Hero image */}
      <div style={styles.heroWrap}>
        {allImages.length > 0 ? (
          <img src={allImages[activeImg]?.url} alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: 'var(--green-light)' }}>🏠</div>
        )}
        {/* Status badge */}
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <span className={`badge ${listing.status === 'available' ? 'badge-green' : 'badge-amber'}`}
            style={{ fontSize: 12, padding: '6px 14px' }}>
            {listing.status.replace('_', ' ')}
          </span>
        </div>
        {/* Image counter */}
        {allImages.length > 1 && (
          <div style={styles.imgCounter}>{activeImg + 1} / {allImages.length}</div>
        )}
      </div>

      {/* Thumbnail strip */}
      {allImages.length > 0 && (
        <div style={styles.thumbStrip}>
          {allImages.map((img, i) => (
            <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
              <div onClick={() => setActiveImg(i)}
                style={{ ...styles.thumb, outline: i === activeImg ? '3px solid var(--green)' : 'none', outlineOffset: 2 }}>
                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {user?.role === 'admin' && !img.main && (
                <button onClick={() => deleteImage(img.id)}
                  style={styles.deleteImgBtn} title="Remove image">✕</button>
              )}
            </div>
          ))}

          {/* Admin: add more images */}
          {user?.role === 'admin' && (
            <div style={styles.addImgBtn} onClick={() => document.getElementById('extra-img').click()}>
              {uploading ? '⏳' : '+ Add'}
            </div>
          )}
          <input id="extra-img" type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadExtraImage} />
        </div>
      )}

      {/* Main info */}
      <div style={styles.infoSection}>
        <div style={{ flex: 1 }}>
          <h1 style={styles.title}>{listing.title}</h1>
          <p style={styles.location}>📍 {listing.location}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            <span className="badge badge-green">{listing.type}</span>
            <span style={styles.infoPill}>💷 £{listing.price}/mo</span>
          </div>
        </div>
        <div style={styles.priceBox}>
          <div style={styles.priceNum}>£{listing.price}</div>
          <div style={styles.priceLabel}>per month</div>
        </div>
      </div>

      <hr className="divider" />

      {/* Short description */}
      {listing.description && (
        <div style={styles.section}>
          <div className="section-title">About this property</div>
          <p style={styles.bodyText}>{listing.description}</p>
        </div>
      )}

      {/* Detailed description */}
      <div style={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
          <div className="section-title" style={{ margin: 0 }}>Full Description</div>
          {user?.role === 'admin' && !editingDesc && (
            <button className="btn-outline" style={{ fontSize: 12, padding: '6px 16px', minHeight: 36 }}
              onClick={() => setEditingDesc(true)}>
              {listing.detailed_description ? 'Edit' : '+ Add'} description
            </button>
          )}
        </div>

        {editingDesc ? (
          <div>
            <textarea value={detailedDesc} onChange={e => setDetailedDesc(e.target.value)}
              rows={8} placeholder="Write a detailed description of the property — include nearby amenities, transport links, what's included in the rent, house rules, and anything else students should know..."
              style={{ width: '100%', padding: '14px', border: '2px solid var(--border)', borderRadius: 12, fontSize: 14, lineHeight: 1.7, outline: 'none', resize: 'vertical', fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn-primary" style={{ padding: '10px 24px', fontSize: 13 }}
                onClick={saveDesc} disabled={savingDesc}>
                {savingDesc ? 'Saving...' : 'Save Description'}
              </button>
              <button className="btn-outline" style={{ padding: '10px 20px', fontSize: 13 }}
                onClick={() => { setEditingDesc(false); setDetailedDesc(listing.detailed_description || ''); }}>
                Cancel
              </button>
            </div>
          </div>
        ) : listing.detailed_description ? (
          <div style={styles.detailedDesc}>
            {listing.detailed_description.split('\n').map((para, i) =>
              para.trim() ? <p key={i} style={{ marginBottom: 12 }}>{para}</p> : null
            )}
          </div>
        ) : (
          <div style={styles.emptyDesc}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📝</div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              {user?.role === 'admin' ? 'No detailed description yet. Click "Add description" to add one.' : 'No detailed description available yet.'}
            </p>
          </div>
        )}
      </div>

      <hr className="divider" />

      {/* Key details grid */}
      <div style={styles.section}>
        <div className="section-title">Property Details</div>
        <div style={styles.detailsGrid}>
          {[
            { label: 'Type', value: listing.type, icon: '🏠' },
            { label: 'Location', value: listing.location, icon: '📍' },
            { label: 'Monthly Rent', value: `£${listing.price}`, icon: '💷' },
            { label: 'Status', value: listing.status.replace('_', ' '), icon: '✅' },
          ].map(d => (
            <div key={d.label} style={styles.detailCard}>
              <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{d.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{d.label}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', textTransform: 'capitalize' }}>{d.value}</div>
            </div>
          ))}
        </div>
      </div>

    <ConfirmModal {...modal} />
    </div>
  );
}

const styles = {
  backBtn: { background: 'var(--green-light)', border: 'none', borderRadius: 50, padding: '8px 18px', fontSize: 13, fontWeight: 700, color: 'var(--green)', cursor: 'pointer', marginBottom: '1rem', minHeight: 44 },
  heroWrap: { borderRadius: 20, overflow: 'hidden', height: 'min(420px, 55vw)', position: 'relative', background: 'var(--cream-dark)', marginBottom: '0.75rem' },
  imgCounter: { position: 'absolute', bottom: 14, right: 14, background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: 50, padding: '4px 12px', fontSize: 12, fontWeight: 600 },
  thumbStrip: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: '1.5rem' },
  thumb: { width: 80, height: 60, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', flexShrink: 0 },
  deleteImgBtn: { position: 'absolute', top: -6, right: -6, background: 'var(--coral)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  addImgBtn: { width: 80, height: 60, borderRadius: 10, border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'var(--green)', flexShrink: 0, background: 'var(--green-light)' },
  infoSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: '1.5rem', flexWrap: 'wrap' },
  title: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: 6 },
  location: { fontSize: 14, color: 'var(--text-muted)' },
  infoPill: { background: 'var(--amber-light)', color: '#92600a', borderRadius: 50, padding: '4px 14px', fontSize: 12, fontWeight: 700 },
  priceBox: { background: 'var(--green)', borderRadius: 16, padding: '1rem 1.5rem', textAlign: 'center', flexShrink: 0 },
  priceNum: { fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700, color: '#fff' },
  priceLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  section: { marginBottom: '1.5rem' },
  bodyText: { fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8 },
  detailedDesc: { fontSize: 15, color: 'var(--text)', lineHeight: 1.9, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' },
  emptyDesc: { background: 'var(--cream)', border: '1px dashed var(--border)', borderRadius: 16, padding: '2rem', textAlign: 'center' },
  detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '1rem' },
  detailCard: { background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '1rem', textAlign: 'center' },
};