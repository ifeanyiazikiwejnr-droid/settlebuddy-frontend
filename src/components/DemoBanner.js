import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function DemoBanner() {
  const { user } = useAuth();
  const [demoStatus, setDemoStatus] = useState(null);

  useEffect(() => {
    if (user?.is_demo) {
      axios.get('/api/demo/status').then(res => setDemoStatus(res.data)).catch(() => {});
    }
  }, [user]);

  if (!user?.is_demo || !demoStatus?.is_demo) return null;

  const urgent = demoStatus.days_left <= 3;

  return (
    <div style={{
      background: urgent
        ? 'linear-gradient(135deg,#dc2626,#ef4444)'
        : 'linear-gradient(135deg,#f5a623,#f07020)',
      color: '#fff',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8,
      fontSize: 13,
      fontFamily: "'Plus Jakarta Sans',sans-serif",
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>{urgent ? '🚨' : '🎓'}</span>
        <div>
          <strong>Demo Account</strong> — {demoStatus.institution}
          <span style={{ opacity: 0.85, marginLeft: 8 }}>
            {demoStatus.days_left > 0
              ? `${demoStatus.days_left} day${demoStatus.days_left !== 1 ? 's' : ''} remaining`
              : 'Expires today'}
          </span>
        </div>
      </div>

      <a
        href="mailto:partners@settlebuddy.uk?subject=Demo to Partnership — Interest"
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: 50,
          padding: '5px 14px',
          color: '#fff',
          textDecoration: 'none',
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        Upgrade to Full Access →
      </a>
    </div>
  );
}