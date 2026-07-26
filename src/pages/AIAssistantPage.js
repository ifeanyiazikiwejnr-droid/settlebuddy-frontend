import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SUGGESTED_QUESTIONS = [
  'How many hours can I work on a student visa?',
  'How do I register with a GP?',
  'How do I apply for a National Insurance number?',
  'What is a BRP card and how do I collect it?',
  'Am I exempt from council tax as a student?',
  'How do I open a UK bank account?',
  'What is the Graduate visa route?',
  'Can I travel outside the UK on a student visa?',
];

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');

    const userMsg = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
      }]);
    } finally { setLoading(false); }
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          <span style={{ color: 'var(--green)', flexShrink: 0 }}>•</span>
          <span>{line.replace(/^[-•] /, '')}</span>
        </div>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: 700, marginBottom: 4, marginTop: i > 0 ? 8 : 0 }}>{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
      return <div key={i} style={{ marginBottom: 2 }}>{line}</div>;
    });
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatarWrap}>
            <span style={{ fontSize: 22 }}>🤖</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', marginBottom: 2 }}>
              SettleIn Assistant
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={styles.onlineDot} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>AI-powered · Always available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        ⚠️ I provide general guidance only — not legal advice. For complex immigration matters always consult your university's international office or a regulated adviser.
      </div>

      {/* Messages area */}
      <div style={styles.messagesArea}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>👋</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', marginBottom: 8 }}>
              Hi {user?.name?.split(' ')[0]}!
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 360 }}>
              I'm your AI settlement assistant. Ask me anything about student visa rules, NHS registration, bank accounts, working rights, and more.
            </p>
            {/* Suggested questions */}
            <div style={styles.suggestedGrid}>
              {SUGGESTED_QUESTIONS.map(q => (
                <button key={q} style={styles.suggestedBtn} onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div key={i} style={{ ...styles.msgRow, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              {!isUser && (
                <div style={styles.aiAvatar}>🤖</div>
              )}
              <div style={{
                ...styles.bubble,
                background: isUser ? 'var(--green)' : '#fff',
                color: isUser ? '#fff' : 'var(--text)',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                maxWidth: isUser ? '75%' : '85%',
                boxShadow: isUser ? '0 4px 14px rgba(10,92,68,0.25)' : 'var(--shadow-sm)',
              }}>
                {isUser ? msg.content : formatMessage(msg.content)}
              </div>
              {isUser && (
                <div style={styles.userAvatar}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading dots */}
        {loading && (
          <div style={{ ...styles.msgRow, justifyContent: 'flex-start' }}>
            <div style={styles.aiAvatar}>🤖</div>
            <div style={{ ...styles.bubble, background: '#fff', boxShadow: 'var(--shadow-sm)', borderRadius: '18px 18px 18px 4px' }}>
              <div style={styles.typingDots}>
                <span style={{ ...styles.dot, animationDelay: '0ms' }} />
                <span style={{ ...styles.dot, animationDelay: '160ms' }} />
                <span style={{ ...styles.dot, animationDelay: '320ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested follow-ups after first message */}
      {messages.length > 0 && !loading && (
        <div style={styles.followUps}>
          {SUGGESTED_QUESTIONS.slice(0, 3).map(q => (
            <button key={q} style={styles.followUpBtn} onClick={() => send(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask me anything about settling into the UK..."
          style={styles.input}
          disabled={loading}
        />
        <button
          className="btn-primary"
          style={{ padding: '12px 20px', borderRadius: 50, fontSize: 14, minWidth: 70, flexShrink: 0 }}
          onClick={() => send()}
          disabled={loading || !input.trim()}>
          Send →
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', minHeight: 500 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0 1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem', flexShrink: 0 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarWrap: { width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--green-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  onlineDot: { width: 8, height: 8, borderRadius: '50%', background: '#22c55e' },
  disclaimer: { background: 'var(--amber-light)', border: '1px solid var(--amber)', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#92600a', marginBottom: '1rem', lineHeight: 1.5, flexShrink: 0 },
  messagesArea: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: '1rem' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', padding: '2rem 1rem' },
  suggestedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,220px),1fr))', gap: 8, width: '100%', maxWidth: 600 },
  suggestedBtn: { background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12, padding: '10px 14px', fontSize: 13, fontWeight: 500, color: 'var(--text)', cursor: 'pointer', textAlign: 'left', fontFamily: "'Plus Jakarta Sans',sans-serif", transition: 'all .15s', lineHeight: 1.4 },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: 8 },
  aiAvatar: { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--green-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  userAvatar: { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--coral),var(--amber))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 },
  bubble: { padding: '12px 16px', fontSize: 14, lineHeight: 1.6, wordBreak: 'break-word' },
  typingDots: { display: 'flex', gap: 4, alignItems: 'center', padding: '2px 4px' },
  dot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'bounce 1.2s infinite' },
  followUps: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, flexShrink: 0 },
  followUpBtn: { background: 'var(--green-light)', border: '1px solid #9FE1CB', borderRadius: 50, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: 'var(--green)', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Plus Jakarta Sans',sans-serif" },
  inputArea: { display: 'flex', gap: 10, paddingTop: '0.75rem', borderTop: '1px solid var(--border)', alignItems: 'center', flexShrink: 0 },
  input: { flex: 1, padding: '12px 18px', border: '2px solid var(--border)', borderRadius: 50, fontSize: 15, outline: 'none', fontFamily: "'Plus Jakarta Sans',sans-serif", minWidth: 0 },
};