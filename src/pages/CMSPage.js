import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const CONTENT_TYPES = [
  { key: 'contact', label: 'International Office', icon: '📞', desc: 'Contact details, opening hours, email' },
  { key: 'gp', label: 'Local GPs', icon: '🏥', desc: 'Campus and nearby GP surgeries' },
  { key: 'accommodation', label: 'Accommodation', icon: '🏡', desc: 'University-managed and recommended housing' },
  { key: 'event', label: 'Events', icon: '🎓', desc: 'Welcome events, orientation, cultural activities' },
  { key: 'service', label: 'Local Services', icon: '🛒', desc: 'Banks, supermarkets, transport, food' },
  { key: 'checklist_item', label: 'Custom Checklist Tasks', icon: '✅', desc: 'Institution-specific arrival tasks' },
];

const emptyForm = {
  title: '', description: '', link: '', address: '', phone: '', display_order: '0',
};

export default function CMSPage() {
  const { showToast } = useOutletContext();
  const [partners, setPartners] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [activeTab, setActiveTab] = useState('contact');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load partners for selector
  useEffect(() => {
    axios.get('/api/partners')
      .then(res => {
        setPartners(res.data);
        if (res.data.length > 0) setSelectedCode(res.data[0].referral_code);
      })
      .catch(() => showToast('Error loading partners'));
  }, []);

  // Load content when partner or tab changes
  useEffect(() => {
    if (!selectedCode) return;
    loadContent();
  }, [selectedCode, activeTab]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/cms/admin/${selectedCode}`);
      setItems(res.data.filter(i => i.content_type === activeTab));
    } catch { showToast('Error loading content'); }
    finally { setLoading(false); }
  };

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async () => {
    if (!form.title.trim()) return showToast('Title is required');
    setSaving(true);
    try {
      if (editingId) {
        await axios.patch(`/api/cms/${editingId}`, form);
        showToast('Updated!');
      } else {
        await axios.post('/api/cms', {
          ...form,
          referral_code: selectedCode,
          content_type: activeTab,
        });
        showToast('Added!');
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      loadContent();
    } catch (err) {
      showToast(err.response?.data?.error || 'Error saving');
    } finally { setSaving(false); }
  };

  const toggleActive = async (item) => {
    try {
      await axios.patch(`/api/cms/${item.id}`, { active: !item.active });
      loadContent();
    } catch { showToast('Error updating'); }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/api/cms/${id}`);
      showToast('Deleted');
      loadContent();
    } catch { showToast('Error deleting'); }
  };

  const startEdit = (item) => {
    setForm({
      title: item.title || '',
      description: item.description || '',
      link: item.link || '',
      address: item.address || '',
      phone: item.phone || '',
      display_order: item.display_order?.toString() || '0',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const activeType = CONTENT_TYPES.find(t => t.key === activeTab);
  const selectedPartner = partners.find(p => p.referral_code === selectedCode);

  const showFields = (type) => ({
    link: ['contact', 'accommodation', 'service', 'checklist_item'].includes(type),
    address: ['gp', 'accommodation', 'service'].includes(type),
    phone: ['contact', 'gp', 'service'].includes(type),
  });

  const fields = showFields(activeTab);

  return (
    <div>
      <div className="page-header">
        <h2>University CMS</h2>
        <p>Manage institution-specific content for partner universities</p>
      </div>

      {partners.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏫</div>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>No partners yet</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Add a partner in the Partners section first, then come back to add their content.
          </p>
        </div>
      ) : (
        <>
          {/* Partner selector */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>
                Managing content for:
              </div>
              <select
                value={selectedCode}
                onChange={e => setSelectedCode(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', border: '2px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif", outline: 'none', minWidth: 200 }}>
                {partners.map(p => (
                  <option key={p.referral_code} value={p.referral_code}>
                    {p.institution} ({p.referral_code})
                  </option>
                ))}
              </select>
              {selectedPartner && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Code: <strong style={{ fontFamily: 'monospace', color: 'var(--green)' }}>{selectedCode}</strong>
                </div>
              )}
            </div>

            {/* AI context preview */}
            {selectedPartner && (
              <div style={{ marginTop: '1rem', background: 'var(--green-light)', border: '1px solid #9FE1CB', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 4 }}>
                  🤖 AI Context Active
                </div>
                <p style={{ fontSize: 12, color: '#085041', lineHeight: 1.6, margin: 0 }}>
                  Content added here will automatically be injected into the AI assistant for all students from <strong>{selectedPartner.institution}</strong>. Their AI responses will include institution-specific information.
                </p>
              </div>
            )}
          </div>

          {/* Content type tabs */}
          <div style={styles.tabs}>
            {CONTENT_TYPES.map(t => (
              <button key={t.key}
                style={{ ...styles.tab, ...(activeTab === t.key ? styles.tabActive : {}) }}
                onClick={() => { setActiveTab(t.key); setShowForm(false); setEditingId(null); setForm(emptyForm); }}>
                <span>{t.icon}</span>
                <span style={{ fontSize: 11 }}>{t.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Section header + add button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{activeType?.icon} {activeType?.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{activeType?.desc}</div>
            </div>
            <button className="btn-primary" style={{ padding: '9px 18px', fontSize: 13 }}
              onClick={() => { cancelForm(); setShowForm(s => !s); }}>
              {showForm && !editingId ? '✕ Cancel' : '+ Add Item'}
            </button>
          </div>

          {/* Add/Edit form */}
          {showForm && (
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--green)' }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', marginBottom: '1rem' }}>
                {editingId ? 'Edit Item' : `Add ${activeType?.label} Item`}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Title *</label>
                  <input name="title" value={form.title} onChange={handle}
                    placeholder={
                      activeTab === 'contact' ? 'e.g. International Student Support Office' :
                      activeTab === 'gp' ? 'e.g. University Medical Centre' :
                      activeTab === 'accommodation' ? 'e.g. Victoria Halls of Residence' :
                      activeTab === 'event' ? 'e.g. International Welcome Fair — 25 Sept' :
                      activeTab === 'service' ? 'e.g. Tesco Express — 5 min walk' :
                      'e.g. Register with International Student Support'
                    } />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handle} rows={3}
                    placeholder={
                      activeTab === 'contact' ? 'Opening hours, what they can help with...' :
                      activeTab === 'event' ? 'What to expect, who should attend...' :
                      activeTab === 'checklist_item' ? 'What the student needs to do and why...' :
                      'Additional details...'
                    } />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 10 }}>
                  {fields.phone && (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Phone Number</label>
                      <input name="phone" value={form.phone} onChange={handle} placeholder="e.g. 0121 414 3344" />
                    </div>
                  )}
                  {fields.address && (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Address</label>
                      <input name="address" value={form.address} onChange={handle} placeholder="e.g. Aston Webb Building" />
                    </div>
                  )}
                  {fields.link && (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Link / URL</label>
                      <input name="link" value={form.link} onChange={handle} placeholder="https://..." />
                    </div>
                  )}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Display Order</label>
                    <input name="display_order" type="number" value={form.display_order} onChange={handle} placeholder="0" />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1, padding: '11px', fontSize: 13 }}
                  onClick={save} disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Item →'}
                </button>
                <button className="btn-outline" style={{ padding: '11px 20px', fontSize: 13 }}
                  onClick={cancelForm}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Content items list */}
          {loading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</p>
          ) : items.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>{activeType?.icon}</div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>No {activeType?.label} added yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Click "+ Add Item" to add {activeType?.label.toLowerCase()} content for {selectedPartner?.institution}.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <div key={item.id} className="card"
                  style={{ borderLeft: `4px solid ${item.active ? 'var(--green)' : 'var(--border)'}`, opacity: item.active ? 1 : 0.6 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50,
                          background: item.active ? 'var(--green-light)' : 'var(--cream-dark)',
                          color: item.active ? 'var(--green)' : 'var(--text-muted)',
                        }}>
                          {item.active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      {item.description && (
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 6 }}>
                          {item.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--text-faint)' }}>
                        {item.phone && <span>📞 {item.phone}</span>}
                        {item.address && <span>📍 {item.address}</span>}
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer"
                            style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>
                            🔗 View link
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      <button style={styles.actionBtn} onClick={() => startEdit(item)}>✏️ Edit</button>
                      <button style={{ ...styles.actionBtn, color: item.active ? '#92600a' : 'var(--green)', borderColor: item.active ? 'var(--amber)' : 'var(--green)' }}
                        onClick={() => toggleActive(item)}>
                        {item.active ? '👁️ Hide' : '👁️ Show'}
                      </button>
                      <button style={{ ...styles.actionBtn, color: 'var(--coral-dark)', borderColor: 'var(--coral)' }}
                        onClick={() => deleteItem(item.id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  tabs: { display: 'flex', background: 'var(--cream-dark)', borderRadius: 14, padding: 4, marginBottom: '1.25rem', gap: 4, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' },
  tab: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 6px', border: 'none', background: 'transparent', borderRadius: 10, fontSize: 18, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s', minHeight: 52, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" },
  tabActive: { background: '#fff', color: 'var(--green)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  actionBtn: { background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", color: 'var(--text-muted)', whiteSpace: 'nowrap' },
};