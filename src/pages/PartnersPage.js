import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import useConfirm from '../hooks/useConfirm';

const PARTNER_TYPES = ['university', 'student_union', 'agent', 'accommodation', 'employer', 'other'];
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const emptyForm = { name: '', institution: '', email: '', type: 'university', commission_rate: '10' };

export default function PartnersPage() {
  const { showToast } = useOutletContext();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partnerStats, setPartnerStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const { modal, confirm } = useConfirm();

  const load = async () => {
    try {
      const res = await axios.get('/api/partners');
      setPartners(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async () => {
    if (!form.name || !form.institution || !form.email) return showToast('Please fill in all required fields');
    setSaving(true);
    try {
      await axios.post('/api/partners', form);
      showToast('Partner created!');
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Error creating partner');
    } finally { setSaving(false); }
  };

  const toggleActive = async (partner) => {
    try {
      await axios.patch(`/api/partners/${partner.id}`, { active: !partner.active });
      showToast(`Partner ${partner.active ? 'deactivated' : 'activated'}`);
      load();
    } catch { showToast('Error updating partner'); }
  };

  const deletePartner = async (partner) => {
    const ok = await confirm({
      title: 'Delete Partner',
      message: `Delete ${partner.name}? This cannot be undone. Their referral code will stop working.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      danger: true,
    });
    if (!ok) return;
    try {
      await axios.delete(`/api/partners/${partner.id}`);
      showToast('Partner deleted');
      load();
      if (selectedPartner?.id === partner.id) setSelectedPartner(null);
    } catch { showToast('Error deleting partner'); }
  };

  const viewStats = async (partner) => {
    setSelectedPartner(partner);
    setStatsLoading(true);
    try {
      const res = await axios.get(`/api/partners/${partner.id}/stats`);
      setPartnerStats(res.data);
    } catch { showToast('Error loading partner stats'); }
    finally { setStatsLoading(false); }
  };

  const copyLink = (code) => {
    const link = `${window.location.origin}/login?mode=register&ref=${code}`;
    navigator.clipboard.writeText(link);
    showToast('Referral link copied!');
  };

  const typeLabel = (type) => type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const totalReferred = partners.reduce((s, p) => s + parseInt(p.total_referred || 0), 0);
  const totalPremium = partners.reduce((s, p) => s + parseInt(p.premium_converted || 0), 0);
  const totalCommission = partners.reduce((s, p) => {
    return s + (parseFloat(p.premium_converted || 0) * 4.99 * (parseFloat(p.commission_rate || 10) / 100));
  }, 0);

  return (
    <div>
      <div className="page-header">
        <h2>Partner Management</h2>
        <p>Manage referral partners and track attribution</p>
      </div>

      {/* Stats row */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: 'var(--green)', marginBottom: 4 }}>{partners.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Partners</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: '#185fa5', marginBottom: 4 }}>{totalReferred}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Students Referred</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: '#f07020', marginBottom: 4 }}>£{totalCommission.toFixed(2)}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Commission Owed</div>
        </div>
      </div>

      {/* Add partner button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 13 }}
          onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕ Cancel' : '+ Add Partner'}
        </button>
      </div>

      {/* Add partner form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1rem' }}>New Partner</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Contact Name *</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Dr. Sarah Johnson" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Institution *</label>
              <input name="institution" value={form.institution} onChange={handle} placeholder="University of Birmingham" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="s.johnson@university.ac.uk" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Partner Type</label>
              <select name="type" value={form.type} onChange={handle}>
                {PARTNER_TYPES.map(t => <option key={t} value={t}>{typeLabel(t)}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Commission Rate (%)</label>
              <input name="commission_rate" type="number" min="0" max="50" value={form.commission_rate} onChange={handle} />
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: '1rem', padding: '11px 24px', fontSize: 13 }}
            onClick={save} disabled={saving}>
            {saving ? 'Creating...' : 'Create Partner →'}
          </button>
        </div>
      )}

      {/* Partners list + stats side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedPartner ? 'repeat(auto-fit,minmax(min(100%,340px),1fr))' : '1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Partners list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}
          {!loading && partners.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🤝</div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>No partners yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Add your first partner to start tracking referrals.</p>
            </div>
          )}

          {partners.map(p => (
            <div key={p.id} className="card"
              style={{ borderLeft: `4px solid ${p.active ? 'var(--green)' : 'var(--border)'}`, cursor: 'pointer' }}
              onClick={() => viewStats(p)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50,
                      background: p.active ? 'var(--green-light)' : 'var(--cream-dark)',
                      color: p.active ? 'var(--green)' : 'var(--text-muted)',
                    }}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: '#e6f1fb', color: '#185fa5' }}>
                      {typeLabel(p.type)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.institution}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{p.email}</div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                {[
                  { label: 'Referred', value: p.total_referred || 0 },
                  { label: 'Premium', value: p.premium_converted || 0 },
                  { label: 'Commission', value: `£${(parseFloat(p.premium_converted || 0) * 4.99 * (parseFloat(p.commission_rate) / 100)).toFixed(2)}` },
                  { label: 'Rate', value: `${p.commission_rate}%` },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--green)' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Referral code */}
              <div style={{ background: 'var(--cream)', borderRadius: 10, padding: '8px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Referral Code</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 15, color: 'var(--green)', letterSpacing: 2 }}>{p.referral_code}</div>
                </div>
                <button
                  style={{ background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 50, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  onClick={e => { e.stopPropagation(); copyLink(p.referral_code); }}>
                  📋 Copy Link
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  style={{ flex: 1, padding: '8px', border: `1px solid ${p.active ? 'var(--amber)' : 'var(--green)'}`, borderRadius: 50, background: 'transparent', fontSize: 12, fontWeight: 600, color: p.active ? '#92600a' : 'var(--green)', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  onClick={e => { e.stopPropagation(); toggleActive(p); }}>
                  {p.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  style={{ flex: 1, padding: '8px', border: '1px solid var(--coral)', borderRadius: 50, background: 'var(--coral-light)', fontSize: 12, fontWeight: 600, color: 'var(--coral-dark)', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  onClick={e => { e.stopPropagation(); deletePartner(p); }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Partner stats panel */}
        {selectedPartner && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: 80 }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem' }}>
                  {selectedPartner.institution}
                </h3>
                <button onClick={() => setSelectedPartner(null)}
                  style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
              </div>

              {statsLoading ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading stats...</p>
              ) : partnerStats ? (
                <>
                  {/* Summary stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
                    {[
                      { label: 'Total Referred', value: partnerStats.summary.total_referred, color: 'var(--green)' },
                      { label: 'Premium', value: partnerStats.summary.premium_converted, color: '#f07020' },
                      { label: 'Conversion Rate', value: `${partnerStats.summary.conversion_rate}%`, color: '#185fa5' },
                      { label: 'Commission Owed', value: `£${partnerStats.summary.commission_earned}`, color: '#7c3aed' },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'var(--cream)', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Weekly signups mini chart */}
                  {partnerStats.weekly_signups.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                        Weekly Signups
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
                        {partnerStats.weekly_signups.map((w, i) => {
                          const max = Math.max(...partnerStats.weekly_signups.map(x => x.signups)) || 1;
                          return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{w.signups}</div>
                              <div style={{ width: '100%', height: Math.max(4, (w.signups / max) * 44), background: 'var(--green)', borderRadius: '2px 2px 0 0' }} />
                              <div style={{ fontSize: 8, color: 'var(--text-faint)', textAlign: 'center' }}>{w.week}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Referred students list */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                      Referred Students ({partnerStats.referred_students.length})
                    </div>
                    {partnerStats.referred_students.length === 0 ? (
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No students referred yet</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 280, overflowY: 'auto' }}>
                        {partnerStats.referred_students.map((s, i) => (
                          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--green-mid))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                              {s.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                {new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {s.tasks_done} tasks done
                              </div>
                            </div>
                            {s.is_premium && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 50, background: 'linear-gradient(135deg,#f5a623,#f07020)', color: '#fff' }}>⭐</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal {...modal} />
    </div>
  );
}