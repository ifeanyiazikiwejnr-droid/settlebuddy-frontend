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
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');
    inputRef.current?.blur();

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
        return (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }}>•</span>
            <span>{line.replace(/^[-•] /, '')}</span>
          </div>
        );
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
          <div style={styles.aiAvatar}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>SettleIn Assistant</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={styles.onlineDot} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI · Always available</span>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button style={styles.clearBtn} onClick={() => setMessages([])}>
            Clear
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        ⚠️ General guidance only — not legal advice. For complex matters consult your university's international office or a regulated adviser.
      </div>

      {/* Messages */}
      <div style={styles.messagesArea}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>👋</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', marginBottom: 6 }}>
              Hi {user?.name?.split(' ')[0]}!
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: 300, textAlign: 'center' }}>
              Ask me anything about student visas, NHS, bank accounts, working rights and more.
            </p>
            {/* Suggested questions - scrollable on mobile */}
            <div style={styles.suggestedList}>
              {SUGGESTED_QUESTIONS.map(q => (
                <button key={q} style={styles.suggestedBtn} onClick={() => send(q)}>
                  <span style={{ fontSize: 14 }}>💬</span>
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div key={i} style={{
              ...styles.msgRow,
              justifyContent: isUser ? 'flex-end' : 'flex-start',
            }}>
              {!isUser && <div style={styles.aiAvatarSmall}>🤖</div>}
              <div style={{
                ...styles.bubble,
                background: isUser ? 'var(--green)' : '#fff',
                color: isUser ? '#fff' : 'var(--text)',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                maxWidth: isUser ? '78%' : '88%',
                boxShadow: isUser ? '0 4px 14px rgba(10,92,68,0.2)' : 'var(--shadow-sm)',
              }}>
                {isUser ? msg.content : formatMessage(msg.content)}
              </div>
              {isUser && (
                <div style={styles.userAvatarSmall}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div style={{ ...styles.msgRow, justifyContent: 'flex-start' }}>
            <div style={styles.aiAvatarSmall}>🤖</div>
            <div style={{ ...styles.bubble, background: '#fff', borderRadius: '18px 18px 18px 4px', boxShadow: 'var(--shadow-sm)' }}>
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

      {/* Follow-up suggestions */}
      {messages.length > 0 && !loading && (
        <div style={styles.followUpStrip}>
          {SUGGESTED_QUESTIONS.slice(0, 4).map(q => (
            <button key={q} style={styles.followUpBtn} onClick={() => send(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={styles.inputBar}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask a question..."
          style={styles.input}
          disabled={loading}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{
            ...styles.sendBtn,
            background: input.trim() && !loading ? 'var(--coral)' : 'var(--border)',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
          }}>
          ➤
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 70px)',
    minHeight: 400,
    maxWidth: 800,
    margin: '0 auto',
    width: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--border)',
    marginBottom: '0.75rem',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  aiAvatar: {
    width: 42, height: 42,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,var(--green),var(--green-mid))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, flexShrink: 0,
  },
  onlineDot: {
    width: 7, height: 7,
    borderRadius: '50%',
    background: '#22c55e',
  },
  clearBtn: {
    background: 'var(--cream-dark)',
    border: 'none',
    borderRadius: 50,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    minHeight: 36,
  },
  disclaimer: {
    background: 'var(--amber-light)',
    border: '1px solid var(--amber)',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 11,
    color: '#92600a',
    marginBottom: '0.75rem',
    lineHeight: 1.5,
    flexShrink: 0,
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingBottom: '0.5rem',
    WebkitOverflowScrolling: 'touch',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 0',
  },
  suggestedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  },
  suggestedBtn: {
    background: '#fff',
    border: '1.5px solid var(--border)',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text)',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    minHeight: 44,
    transition: 'all .15s',
  },
  msgRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 6,
    width: '100%',
  },
  aiAvatarSmall: {
    width: 28, height: 28,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,var(--green),var(--green-mid))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, flexShrink: 0,
  },
  userAvatarSmall: {
    width: 28, height: 28,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,var(--coral),var(--amber))',
    color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 12, flexShrink: 0,
  },
  bubble: {
    padding: '10px 14px',
    fontSize: 14,
    lineHeight: 1.6,
    wordBreak: 'break-word',
  },
  typingDots: {
    display: 'flex', gap: 4, alignItems: 'center', padding: '2px 2px',
  },
  dot: {
    width: 7, height: 7,
    borderRadius: '50%',
    background: 'var(--green)',
    display: 'inline-block',
    animation: 'bounce 1.2s infinite',
  },
  followUpStrip: {
    display: 'flex',
    gap: 6,
    overflowX: 'auto',
    paddingBottom: 6,
    flexShrink: 0,
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
  },
  followUpBtn: {
    background: 'var(--green-light)',
    border: '1px solid #9FE1CB',
    borderRadius: 50,
    padding: '6px 12px',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--green)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    flexShrink: 0,
    minHeight: 36,
  },
  inputBar: {
    display: 'flex',
    gap: 8,
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border)',
    alignItems: 'center',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid var(--border)',
    borderRadius: 50,
    fontSize: 16,
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    minWidth: 0,
    background: '#fff',
  },
  sendBtn: {
    width: 46, height: 46,
    borderRadius: '50%',
    border: 'none',
    color: '#fff',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background .2s',
  },
};