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
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // Connect socket
  useEffect(() => {
    const token = localStorage.getItem('sib_token');
    socketRef.current = io(SOCKET_URL, { auth: { token } });
    socketRef.current.on('new_message', (msg) => {
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return () => socketRef.current?.disconnect();
  }, []);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    socketRef.current?.emit('join_conversation', conv.id);
    try {
      const res = await axios.get(`/api/chat/conversations/${conv.id}/messages`);
      setMessages(res.data);
      // Mark as read by reloading conversations
      loadConversations();
    } catch {}
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return;
    const content = input.trim();
    setInput('');
    socketRef.current?.emit('send_message', {
      conversationId: activeConv.id,
      content,
    });
  };

  const getOtherName = (conv) => {
    return user?.role === 'student' ? conv.buddy_name : conv.student_name;
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={styles.container}>

      {/* Conversations sidebar */}
      <div style={styles.convList}>
        <div style={styles.convHeader}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem' }}>Messages</h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{conversations.length} chats</span>
        </div>

        {loading && <p style={styles.emptyText}>Loading...</p>}

        {!loading && conversations.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💬</div>
            <p style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>No conversations yet</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {user?.role === 'student'
                ? 'Request a buddy and once accepted, you can start chatting!'
                : 'Accept a student request to start chatting!'}
            </p>
          </div>
        )}

        {conversations.map(conv => (
          <div key={conv.id} onClick={() => openConversation(conv)}
            style={{ ...styles.convItem, background: activeConv?.id === conv.id ? 'var(--green-light)' : 'transparent', borderLeft: activeConv?.id === conv.id ? '3px solid var(--green)' : '3px solid transparent' }}>
            <div style={{ ...styles.convAvatar, background: 'linear-gradient(135deg,var(--green),var(--green-mid))' }}>
              {getInitials(getOtherName(conv))}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{getOtherName(conv)}</span>
                {conv.last_message_time && (
                  <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>{formatDate(conv.last_message_time)}</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.last_message || 'No messages yet'}
              </div>
            </div>
            {parseInt(conv.unread_count) > 0 && (
              <div style={styles.unreadBadge}>{conv.unread_count}</div>
            )}
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div style={styles.chatWindow}>
        {!activeConv ? (
          <div style={styles.noChatSelected}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>💬</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>Select a conversation</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Choose a chat from the left to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div style={styles.chatHeader}>
              <div style={{ ...styles.convAvatar, background: 'linear-gradient(135deg,var(--green),var(--coral))' }}>
                {getInitials(getOtherName(activeConv))}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{getOtherName(activeConv)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {user?.role === 'student' ? 'Your Buddy' : 'Your Student'}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            {!disclaimerAgreed && (
              <div style={styles.disclaimer}>
                <div style={styles.disclaimerIcon}>⚠️</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.disclaimerTitle}>Safety Reminder</div>
                  <div style={styles.disclaimerText}>
                    Please be cautious when chatting with people online. <strong>Never share personal details</strong> such as your home address, bank details, passport number, or National Insurance number. Settle-In Buddy will <strong>never</strong> ask you for money or financial information. If anyone asks for payment or makes you feel uncomfortable, please report them immediately. Stay safe and enjoy your UK journey! 🇬🇧
                  </div>
                  <button className="btn-primary" style={{ marginTop: 12, padding: '8px 20px', fontSize: 13 }}
                    onClick={() => setDisclaimerAgreed(true)}>
                    I understand, start chatting
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            {disclaimerAgreed && (
              <>
                <div style={styles.messagesArea}>
                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: 13 }}>
                      No messages yet. Say hello! 👋
                    </div>
                  )}
                  {messages.map(msg => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} style={{ ...styles.messageRow, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        {!isMe && (
                          <div style={{ ...styles.msgAvatar, background: 'linear-gradient(135deg,var(--green),var(--green-mid))' }}>
                            {getInitials(msg.sender_name)}
                          </div>
                        )}
                        <div style={{ maxWidth: '65%' }}>
                          {!isMe && <div style={styles.senderName}>{msg.sender_name}</div>}
                          <div style={{ ...styles.bubble, background: isMe ? 'var(--green)' : '#fff', color: isMe ? '#fff' : 'var(--text)', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }}>
                            {msg.content}
                          </div>
                          <div style={{ ...styles.msgTime, textAlign: isMe ? 'right' : 'left' }}>
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

                {/* Input */}
                <div style={styles.inputArea}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..."
                    style={styles.input}
                  />
                  <button className="btn-primary" style={{ padding: '11px 20px', borderRadius: 50, fontSize: 14 }}
                    onClick={sendMessage} disabled={!input.trim()}>
                    Send →
                  </button>
                </div>

                {/* Safety footer */}
                <div style={styles.safetyFooter}>
                  🔒 Never share personal details, bank information, or passwords in this chat
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: 'calc(100vh - 100px)', gap: '1rem', minHeight: 500 },
  convList: { width: 280, background: '#fff', borderRadius: 20, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 },
  convHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1rem 0.75rem', borderBottom: '1px solid var(--border)' },
  convItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer', transition: 'all .15s', borderLeft: '3px solid transparent' },
  convAvatar: { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 },
  unreadBadge: { background: 'var(--coral)', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 },
  emptyState: { textAlign: 'center', padding: '2rem 1rem' },
  emptyText: { padding: '1rem', color: 'var(--text-muted)', fontSize: 13 },
  chatWindow: { flex: 1, background: '#fff', borderRadius: 20, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  noChatSelected: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' },
  chatHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: '#fff' },
  disclaimer: { margin: '1rem', background: '#fff8ec', border: '1.5px solid #f5a623', borderRadius: 16, padding: '1.25rem', display: 'flex', gap: 12, alignItems: 'flex-start' },
  disclaimerIcon: { fontSize: '1.8rem', flexShrink: 0 },
  disclaimerTitle: { fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#92600a' },
  disclaimerText: { fontSize: 13, color: '#78500a', lineHeight: 1.7 },
  messagesArea: { flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--cream)' },
  messageRow: { display: 'flex', alignItems: 'flex-end', gap: 8 },
  msgAvatar: { width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 },
  senderName: { fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600, paddingLeft: 4 },
  bubble: { padding: '10px 14px', fontSize: 14, lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', wordBreak: 'break-word' },
  msgTime: { fontSize: 10, color: 'var(--text-faint)', marginTop: 3, paddingLeft: 4, paddingRight: 4 },
  inputArea: { display: 'flex', gap: 10, padding: '1rem', borderTop: '1px solid var(--border)', background: '#fff', alignItems: 'center' },
  input: { flex: 1, padding: '11px 18px', border: '2px solid var(--border)', borderRadius: 50, fontSize: 14, outline: 'none', fontFamily: "'Plus Jakarta Sans',sans-serif" },
  safetyFooter: { textAlign: 'center', padding: '8px', fontSize: 11, color: 'var(--text-faint)', background: '#fff', borderTop: '1px solid var(--border)' },
};