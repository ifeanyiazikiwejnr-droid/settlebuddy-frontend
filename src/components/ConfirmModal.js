export default function ConfirmModal({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel, danger }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Icon */}
        <div style={{ ...styles.iconWrap, background: danger ? 'var(--coral-light)' : 'var(--green-light)' }}>
          <span style={{ fontSize: '1.8rem' }}>{danger ? '⚠️' : '❓'}</span>
        </div>

        {/* Content */}
        <h3 style={styles.title}>{title || 'Are you sure?'}</h3>
        <p style={styles.message}>{message || 'This action cannot be undone.'}</p>

        {/* Buttons */}
        <div style={styles.buttons}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            {cancelText || 'Cancel'}
          </button>
          <button
            style={{ ...styles.confirmBtn, background: danger ? 'var(--coral)' : 'var(--green)', boxShadow: danger ? '0 4px 14px rgba(255,92,58,0.35)' : '0 4px 14px rgba(10,92,68,0.3)' }}
            onClick={onConfirm}>
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 9998,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
    animation: 'fadeIn 0.15s ease',
  },
  modal: {
    background: '#fff',
    borderRadius: 24,
    padding: '2rem',
    width: '100%',
    maxWidth: 380,
    textAlign: 'center',
    boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
    animation: 'fadeUp 0.2s ease',
  },
  iconWrap: {
    width: 64, height: 64, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  title: {
    fontFamily: "'Playfair Display',serif",
    fontSize: '1.3rem',
    marginBottom: 8,
    color: 'var(--text)',
  },
  message: {
    fontSize: 14,
    color: 'var(--text-muted)',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  buttons: {
    display: 'flex',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    border: '2px solid var(--border-dark)',
    borderRadius: 50,
    background: 'transparent',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    transition: 'all .2s',
    minHeight: 44,
  },
  confirmBtn: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: 50,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    transition: 'all .2s',
    minHeight: 44,
  },
};