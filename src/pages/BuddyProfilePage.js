import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const emptyForm = { origin: '', university: '', languages: '', bio: '', available: true };

const avatarColors = ['#0f6e56','#ba7517','#993c1d','#185fa5','#3b6d11'];

export default function BuddyProfilePage() {
  const { showToast } = useOutletContext();
  const [form, setForm] = useState(emptyForm);
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [editing, setEditing] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await axios.get('/api/buddies/my-profile');
      if (res.data && res.data.origin) {
        setProfile(res.data);
        setForm({
          origin: res.data.origin || '',
          university: res.data.university || '',
          languages: Array.isArray(res.data.languages) ? res.data.languages.join(', ') : '',
          bio: res.data.bio || '',
          available: res.data.available ?? true,
        });
      } else {
        setEditing(true);
      }
    } catch {
      setEditing(true);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await axios.get('/api/buddies/my-students');
      setStudents(res.data);
    } catch {
      showToast('Error loading students');
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => { loadProfile(); loadStudents(); }, []);

  const handle = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  };

  const submit = async () => {
    if (!form.origin || !form.university || !form.languages || !form.bio)
      return showToast('Please fill in all fields');
    setSaving(true);
    try {
      const langs = form.languages.split(',').map(l => l.trim()).filter(Boolean);
      await axios.post('/api/buddies/profile', { ...form, languages: langs });
      showToast('Profile saved!');
      setEditing(false);
      loadProfile();
    } catch (err) {
      showToast(err.response?.data?.error || 'Error saving profile');
    } finally { setSaving(false); }
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div>
      <div className="page-header">
        <h2>My Buddy Profile</h2>
        <p>Manage your profile and see the students under your care</p>
      </div>

      {/* Profile Card */}
      {!editing && profile?.origin ? (
        <div style={{ marginBottom: '2rem' }}>
          <div className="section-title">👤 My Details</div>
          <div className="card" style={{ maxWidth: 560 }}>

            {/* Avatar + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: avatarColors[0], color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 22, flexShrink: 0
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: 18, fontFamily: "'DM Serif Display',serif" }}>{profile.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{profile.email}</div>
                <span className={`badge ${profile.available ? 'badge-teal' : 'badge-amber'}`} style={{ marginTop: 6 }}>
                  {profile.available ? 'Available' : 'Busy'}
                </span>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>🌍 Country</span>
                <span style={styles.detailValue}>{profile.origin}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>🎓 University</span>
                <span style={styles.detailValue}>{profile.university}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>🗣️ Languages</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {(Array.isArray(profile.languages) ? profile.languages : []).map(l => (
                    <span key={l} className="badge badge-teal">{l}</span>
                  ))}
                </div>
              </div>
              <div style={{ ...styles.detailRow, alignItems: 'flex-start' }}>
                <span style={styles.detailLabel}>📝 Bio</span>
                <span style={{ ...styles.detailValue, lineHeight: 1.6 }}>{profile.bio}</span>
              </div>
            </div>

            <button className="btn-outline" style={{ marginTop: '1.25rem', width: '100%' }}
              onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        /* Edit Form */
        <div style={{ marginBottom: '2rem' }}>
          <div className="section-title">👤 {profile?.origin ? 'Edit My Details' : 'Set Up My Profile'}</div>
          <div className="card" style={{ maxWidth: 560 }}>
            <div className="form-group">
              <label>Country of Origin</label>
              <input name="origin" value={form.origin} onChange={handle} placeholder="e.g. Nigeria" />
            </div>
            <div className="form-group">
              <label>University</label>
              <input name="university" value={form.university} onChange={handle} placeholder="e.g. University of Birmingham" />
            </div>
            <div className="form-group">
              <label>Languages Spoken (comma separated)</label>
              <input name="languages" value={form.languages} onChange={handle} placeholder="e.g. Yoruba, Igbo, English" />
            </div>
            <div className="form-group">
              <label>Bio — tell students about yourself</label>
              <textarea name="bio" rows={4} value={form.bio} onChange={handle}
                placeholder="e.g. 2nd year Nursing student. Happy to help with NI numbers, bank accounts & NHS registration." />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <input type="checkbox" name="available" id="available" checked={form.available} onChange={handle}
                style={{ width: 16, height: 16 }} />
              <label htmlFor="available" style={{ fontSize: 14, color: 'var(--text-muted)', cursor: 'pointer' }}>
                I am available to take on new students
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={submit} disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              {profile?.origin && (
                <button className="btn-outline" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* My Students Section */}
      <div className="section-title">
        🎓 My Students
        <span style={{ background: 'var(--teal-light)', color: 'var(--teal)', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20 }}>
          {students.length}
        </span>
      </div>

      {loadingStudents && (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading students...</p>
      )}

      {!loadingStudents && students.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🎓</div>
          <p style={{ fontWeight: 500, marginBottom: 6 }}>No students yet</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Once you accept a student request, they will appear here.
          </p>
        </div>
      )}

      {students.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {students.map((student, index) => (
            <div key={student.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderTop: index === 0 ? 'none' : '1px solid var(--border)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--teal-light)', color: 'var(--teal)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 15, flexShrink: 0
              }}>
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{student.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.email}</div>
              </div>
              <span className="badge badge-teal">Active</span>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right', flexShrink: 0 }}>
                Matched<br />
                {new Date(student.request_date).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {students.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem', background: 'var(--teal-light)', borderColor: '#9FE1CB' }}>
          <p style={{ fontSize: 13, color: '#085041', lineHeight: 1.6 }}>
            💡 <strong>Tip:</strong> Reach out to your students proactively — a quick check-in message goes a long way when they're new to the UK.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  detailRow: { display: 'flex', alignItems: 'center', gap: 12 },
  detailLabel: { fontSize: 13, color: 'var(--text-muted)', width: 110, flexShrink: 0 },
  detailValue: { fontSize: 14, color: 'var(--text)', fontWeight: 400 },
};