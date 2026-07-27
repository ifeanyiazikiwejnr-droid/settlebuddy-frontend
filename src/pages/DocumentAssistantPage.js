import { useState, useRef } from 'react';
import axios from 'axios';

const DOC_TYPES = [
  { icon: '🛂', label: 'Student Visa / BRP' },
  { icon: '📘', label: 'Passport' },
  { icon: '🎓', label: 'CAS Letter' },
  { icon: '📋', label: 'Offer Letter' },
  { icon: '🏠', label: 'Tenancy Agreement' },
  { icon: '💼', label: 'Employment Contract' },
  { icon: '🏥', label: 'NHS Letter' },
  { icon: '🔢', label: 'NI Number Letter' },
  { icon: '🏦', label: 'Bank Statement' },
  { icon: '📄', label: 'Other Document' },
];

const EXAMPLE_QUESTIONS = [
  'When does my visa expire?',
  'Am I allowed to work part-time?',
  'What are my tenancy rights?',
  'What does this letter mean?',
  'Are there any important deadlines?',
  'What do I need to do next?',
];

export default function DocumentAssistantPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(f.type)) {
      setError('Please upload a JPG, PNG, WebP or PDF file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      return;
    }
    setError('');
    setFile(f);
    setAnalysis(null);
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview('pdf');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyse = async (q) => {
    if (!file) return;
    setLoading(true);
    setError('');
    setAnalysis(null);
    const queryText = q || question;

    try {
      const formData = new FormData();
      formData.append('document', file);
      if (queryText) formData.append('question', queryText);

      const token = localStorage.getItem('sib_token');
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${baseURL}/api/documents/analyse`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalysis(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || 'Error analysing document. Please try again.');
    } finally { setLoading(false); }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setQuestion('');
    setAnalysis(null);
    setError('');
  };

  const formatAnalysis = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ') || line.startsWith('# ')) {
        return <h3 key={i} style={styles.analysisH3}>{line.replace(/^#+\s/, '')}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} style={{ fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <span style={{ color: 'var(--green)', flexShrink: 0, fontWeight: 700 }}>•</span>
            <span style={{ fontSize: 14, lineHeight: 1.6 }}>{line.replace(/^[-•] /, '')}</span>
          </div>
        );
      }
      if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
      return <p key={i} style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 4, color: 'var(--text)' }}>{line}</p>;
    });
  };

  return (
    <div style={styles.page}>
      <div className="page-header">
        <h2>Document Assistant</h2>
        <p>Upload any student document and our AI will read, explain and answer questions about it</p>
      </div>

      {/* Security notice */}
      <div style={styles.securityNote}>
        🔒 Your documents are processed securely and never stored on our servers. Each upload is analysed in real time and immediately discarded.
      </div>

      {/* Document type guide */}
      <div style={styles.docTypes}>
        <div style={styles.docTypesLabel}>Documents I can help with:</div>
        <div style={styles.docTypesList}>
          {DOC_TYPES.map(d => (
            <span key={d.label} style={styles.docTypeTag}>
              {d.icon} {d.label}
            </span>
          ))}
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* Left — Upload */}
        <div style={styles.uploadCol}>

          {!file ? (
            <div
              style={{ ...styles.dropZone, borderColor: dragOver ? 'var(--green)' : 'var(--border)', background: dragOver ? 'var(--green-light)' : 'var(--cream)' }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--text)' }}>
                Drop your document here
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                or click to browse
              </div>
              <div style={styles.uploadFormats}>
                JPG · PNG · WebP · PDF · Max 10MB
              </div>
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf"
                style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div style={styles.filePreview}>
              {preview === 'pdf' ? (
                <div style={styles.pdfPreview}>
                  <div style={{ fontSize: '3rem', marginBottom: 8 }}>📑</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {(file.size / 1024).toFixed(0)} KB · PDF
                  </div>
                </div>
              ) : (
                <img src={preview} alt="Document" style={styles.imgPreview} />
              )}
              <button style={styles.removeBtn} onClick={reset}>✕ Remove</button>
            </div>
          )}

          {error && <div style={styles.errorBox}>{error}</div>}

          {/* Question input */}
          {file && (
            <div style={styles.questionSection}>
              <label style={styles.questionLabel}>
                Ask a specific question (optional)
              </label>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="e.g. When does my visa expire?"
                style={styles.questionInput}
                onKeyDown={e => e.key === 'Enter' && analyse()}
              />
              <div style={styles.exampleQuestions}>
                {EXAMPLE_QUESTIONS.map(q => (
                  <button key={q} style={styles.exampleBtn} onClick={() => { setQuestion(q); analyse(q); }}>
                    {q}
                  </button>
                ))}
              </div>
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 8 }}
                onClick={() => analyse()}
                disabled={loading}>
                {loading ? '🔍 Analysing...' : '🔍 Analyse Document →'}
              </button>
            </div>
          )}
        </div>

        {/* Right — Analysis results */}
        <div style={styles.resultsCol}>
          {!file && !analysis && (
            <div style={styles.emptyResults}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤖</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', marginBottom: 8 }}>
                Ready to help
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Upload a document on the left and I'll extract all the key information, highlight important dates and answer any questions you have.
              </p>
            </div>
          )}

          {loading && (
            <div style={styles.loadingState}>
              <div style={styles.loadingSpinner} />
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Reading your document...</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                This usually takes 5-15 seconds
              </div>
            </div>
          )}

          {analysis && !loading && (
            <div style={styles.analysisBox}>
              {/* Analysis header */}
              <div style={styles.analysisHeader}>
                <div style={styles.analysisIcon}>🤖</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Document Analysis</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button style={styles.copyBtn} onClick={() => {
                  navigator.clipboard.writeText(analysis);
                }}>
                  📋 Copy
                </button>
              </div>

              {/* Analysis content */}
              <div style={styles.analysisContent}>
                {formatAnalysis(analysis)}
              </div>

              {/* Follow up */}
              <div style={styles.followUp}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                  Ask a follow-up question:
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Ask another question..."
                    style={{ ...styles.questionInput, margin: 0, flex: 1 }}
                    onKeyDown={e => e.key === 'Enter' && analyse()}
                  />
                  <button className="btn-primary"
                    style={{ padding: '10px 16px', fontSize: 13, flexShrink: 0 }}
                    onClick={() => analyse()} disabled={loading || !question.trim()}>
                    Ask →
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div style={styles.analysisDisclaimer}>
                ⚠️ This analysis is for guidance only. For legal immigration advice always consult your university's international office or a regulated OISC adviser.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 1000, margin: '0 auto' },
  securityNote: { background: 'var(--green-light)', border: '1px solid #9FE1CB', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: 'var(--green)', marginBottom: '1.25rem', fontWeight: 500 },
  docTypes: { background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '1rem', marginBottom: '1.5rem' },
  docTypesLabel: { fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 },
  docTypesList: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  docTypeTag: { background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 50, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' },
  mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: '1.5rem', alignItems: 'start' },
  uploadCol: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  dropZone: { border: '2px dashed', borderRadius: 20, padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all .2s', minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  uploadFormats: { fontSize: 11, color: 'var(--text-faint)', background: 'var(--cream-dark)', padding: '4px 12px', borderRadius: 50, fontWeight: 600 },
  filePreview: { borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' },
  pdfPreview: { background: 'var(--cream)', padding: '2rem', textAlign: 'center', minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  imgPreview: { width: '100%', maxHeight: 280, objectFit: 'contain', display: 'block', background: 'var(--cream)' },
  removeBtn: { display: 'block', width: '100%', padding: '10px', background: 'var(--coral-light)', border: 'none', color: 'var(--coral-dark)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" },
  errorBox: { background: '#fff1f0', border: '1px solid #ffc9c9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#c92a2a' },
  questionSection: { background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10 },
  questionLabel: { fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  questionInput: { padding: '11px 16px', border: '2px solid var(--border)', borderRadius: 12, fontSize: 14, outline: 'none', fontFamily: "'Plus Jakarta Sans',sans-serif", width: '100%', boxSizing: 'border-box' },
  exampleQuestions: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  exampleBtn: { background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 50, padding: '5px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" },
  resultsCol: {},
  emptyResults: { background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '3rem 2rem', textAlign: 'center', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  loadingState: { background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '3rem', textAlign: 'center', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingSpinner: { width: 48, height: 48, borderRadius: '50%', border: '4px solid var(--green-light)', borderTopColor: 'var(--green)', animation: 'spin 1s linear infinite' },
  analysisBox: { background: '#fff', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' },
  analysisHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--green-light)' },
  analysisIcon: { width: 36, height: 36, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  copyBtn: { marginLeft: 'auto', background: 'none', border: '1px solid var(--border)', borderRadius: 50, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" },
  analysisContent: { padding: '1.25rem', maxHeight: 500, overflowY: 'auto' },
  analysisH3: { fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: 'var(--green)', marginBottom: 8, marginTop: 12 },
  followUp: { padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', background: 'var(--cream)' },
  analysisDisclaimer: { padding: '10px 1.25rem', background: 'var(--amber-light)', borderTop: '1px solid var(--amber)', fontSize: 11, color: '#92600a', lineHeight: 1.5 },
};