import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ChatPage() {
  const { user } = useAuth();
  const { showToast } = useOutletContext();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [showList, setShowList] = useState(true);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('sib_token');
    socketRef.current = io(SOCKET_URL, { auth: { token } });
    socketRef.current.on('new_message', (msg) => {
      setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
    });
    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => { loadConversations(); }, []);

  // Scroll only within the messages container — never scroll the page
  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await axios.get('/api/chat/conversations');
      setConversations(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  const openConversation = async (conv) => {
    setActiveConv(conv);
    setDisclaimerAgreed(false);
    setShowList(false);
    socketRef.current?.emit('join_conversation', conv.id);
    try {
      const res = await axios.get(`/api/chat/conversations/${conv.id}/messages`);
      setMessages(res.data);
      loadConversations();
    } catch {}
  };

  const sendMessage = () => {
    if (!input.trim() || !activeConv) return;
    socketRef.current?.emit('send_message', { conversationId: activeConv.id, content: input.trim() });
    setInput('');
  };

  const getOtherName = (conv) => user?.role === 'student' ? conv.buddy_name : conv.student_name;
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <>
      <style>{`
        .chat-shell {
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          gap: 0;
          background: var(--cream);
          z-index: 10;
        }
        .conv-panel {
          display: flex;
          flex-direction: column;
          width: 100%;
          background: #fff;
          border-right: 1px solid var(--border);
          overflow: hidden;
        }
        .chat-panel {
          display: none;
          flex-direction: column;
          flex: 1;
          background: #fff;
          overflow: hidden;
        }
        .chat-panel.active {
          display: flex;
          width: 100%;
        }
        .conv-panel.hidden {
          display: none;
        }
        .back-btn-wrap {
          display: flex;
        }
        @media (min-width: 768px) {
          .chat-shell {
            position: relative;
            top: auto;
            left: auto;
            right: auto;
            bottom: auto;
            height: calc(100vh - 80px);
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid var(--border);
          }
          .conv-panel {
            width: 280px !important;
            flex-shrink: 0;
            display: flex !important;
          }
          .conv-panel.hidden {
            display: flex !important;
          }
          .chat-panel {
            display: flex !important;
          }
          .back-btn-wrap {
            display: none;
          }
        }
      `}</style>

      <div className="chat-shell">

        {/* Conversation list */}
        <div className={`conv-panel ${!showList ? 'hidden' : ''}`}>
          <div style={styles.convHeader}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem' }}>Messages</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--cream)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
              {conversations.length}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {loading && <p style={styles.emptyText}>Loading...</p>}

            {!loading && conversations.length === 0 && (
              <div style={styles.emptyState}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💬</div>
                <p style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>No conversations yet</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {user?.role === 'student'
                    ? 'Get matched with a buddy to start chatting!'
                    : 'Accept a student request to start chatting!'}
                </p>
              </div>
            )}

            {conversations.map(conv => (
              <div key={conv.id} onClick={() => openConversation(conv)}
                style={{ ...styles.convItem, background: activeConv?.id === conv.id ? 'var(--green-light)' : 'transparent' }}>
                <div style={styles.convAvatar}>
                  {getInitials(getOtherName(conv))}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                      {getOtherName(conv)}
                    </span>
                    {conv.last_message_time && (
                      <span style={{ fontSize: 10, color: 'var(--text-faint)', flexShrink: 0 }}>
                        {formatDate(conv.last_message_time)}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.last_message || 'No messages yet'}
                  </div>
                </div>
                {parseInt(conv.unread_count) > 0 && (
                  <div style={styles.unreadBadge}>{conv.unread_count}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className={`chat-panel ${!showList ? 'active' : ''}`}>
          {activeConv ? (
            <>
              {/* Chat header */}
              <div style={styles.chatHeader}>
                <div className="back-btn-wrap">
                  <button onClick={() => setShowList(true)} style={styles.backBtn}>
                    ← Back
                  </button>
                </div>
                <div style={styles.convAvatar}>{getInitials(getOtherName(activeConv))}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {getOtherName(activeConv)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {user?.role === 'student' ? 'Your Buddy' : 'Your Student'}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              {!disclaimerAgreed && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={styles.disclaimer}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>⚠️</div>
                    <div style={styles.disclaimerTitle}>Safety Reminder</div>
                    <div style={styles.disclaimerText}>
                      Please be cautious when chatting. <strong>Never share</strong> your home address, bank details, passport number, or NI number. If anyone asks for money or makes you uncomfortable, report them immediately.
                    </div>
                    <button className="btn-primary"
                      style={{ marginTop: 14, width: '100%', padding: '12px' }}
                      onClick={() => setDisclaimerAgreed(true)}>
                      I understand — start chatting
                    </button>
                  </div>
                </div>
              )}

              {/* Messages + input — both contained, no page scroll */}
              {disclaimerAgreed && (
                <>
                  {/* Messages area — scrolls internally */}
                  <div
                    ref={messagesAreaRef}
                    style={styles.messagesArea}>
                    {messages.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: 13 }}>
                        No messages yet. Say hello! 👋
                      </div>
                    )}
                    {messages.map(msg => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div key={msg.id} style={{ ...styles.msgRow, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                          {!isMe && (
                            <div style={styles.msgAvatar}>{getInitials(msg.sender_name)}</div>
                          )}
                          <div style={{ maxWidth: '72%' }}>
                            {!isMe && <div style={styles.senderLabel}>{msg.sender_name}</div>}
                            <div style={{
                              ...styles.bubble,
                              background: isMe ? 'var(--green)' : '#fff',
                              color: isMe ? '#fff' : 'var(--text)',
                              borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            }}>
                              {msg.content}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 3, textAlign: isMe ? 'right' : 'left', paddingLeft: 4, paddingRight: 4 }}>
                              {formatTime(msg.created_at)}
                            </div>
                          </div>
                          {isMe && (
                            <div style={{ ...styles.msgAvatar, background: 'linear-gradient(135deg,var(--coral),var(--amber))' }}>
                              {getInitials(user?.name)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input bar — always pinned at bottom */}
                                    {/* Input bar — always pinned at bottom */}
                  <div style={styles.inputArea}>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Type a message..."
                      style={styles.msgInput}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      style={{
                        width: 44,
                        height: 44,
                        minWidth: 44,
                        borderRadius: '50%',
                        border: 'none',
                        background: input.trim() ? 'var(--green)' : 'var(--border)',
                        color: '#fff',
                        fontSize: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        cursor: input.trim() ? 'pointer' : 'not-allowed',
                        transition: 'background .2s',
                      }}>
                      ➤
                    </button>
                  </div>

                  <div style={styles.safetyBar}>
                    🔒 Never share personal details or bank info in chat
                  </div>
                </>
              )}
            </>
          ) : (
            /* Desktop empty state */
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text-muted)', padding: '2rem' }}>
              <div style={{ fontSize: '3rem' }}>💬</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Select a conversation</div>
              <div style={{ fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>Choose a conversation from the left to start chatting</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  convHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  convItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer', transition: 'background .15s', borderBottom: '1px solid var(--border)', minHeight: 70 },
  convAvatar: { width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--green-mid))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 },
  unreadBadge: { background: 'var(--coral)', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 },
  emptyState: { textAlign: 'center', padding: '2rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  emptyText: { padding: '1rem', color: 'var(--text-muted)', fontSize: 13 },
  chatHeader: { display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', flexShrink: 0, background: '#fff' },
  backBtn: { background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: 'var(--green)', cursor: 'pointer', padding: '6px 10px', borderRadius: 8, minHeight: 44, display: 'flex', alignItems: 'center' },
  disclaimer: { background: '#fff8ec', border: '1.5px solid var(--amber)', borderRadius: 16, padding: '1.25rem', textAlign: 'center', maxWidth: 380, width: '100%' },
  disclaimerTitle: { fontWeight: 700, fontSize: 15, marginBottom: 8, color: '#92600a' },
  disclaimerText: { fontSize: 13, color: '#78500a', lineHeight: 1.7 },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    background: 'var(--cream)',
  },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: 6 },
  msgAvatar: { width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--green-mid))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 10, flexShrink: 0 },
  senderLabel: { fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600, paddingLeft: 4 },
  bubble: { padding: '10px 14px', fontSize: 14, lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', wordBreak: 'break-word' },
    inputArea: { display: 'flex', gap: 8, padding: '0.75rem', borderTop: '1px solid var(--border)', background: '#fff', alignItems: 'center', flexShrink: 0, boxSizing: 'border-box', width: '100%' },
  msgInput: { flex: 1, padding: '11px 14px', border: '2px solid var(--border)', borderRadius: 50, fontSize: 16, outline: 'none', fontFamily: "'Plus Jakarta Sans',sans-serif", minWidth: 0, boxSizing: 'border-box' },
  safetyBar: { textAlign: 'center', padding: '5px', fontSize: 10, color: 'var(--text-faint)', background: '#fff', borderTop: '1px solid var(--border)', flexShrink: 0 },
};