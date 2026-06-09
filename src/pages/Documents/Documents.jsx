import { useState, useEffect } from 'react';
import { 
  UploadCloud, FileText, Trash2, BookOpen, MessageSquare, Zap, ChevronRight, Loader2, Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('studyai-token');
      const res = await fetch('/api/pdf', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Failed to fetch docs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('studyai-token');
      const res = await fetch('/api/pdf/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setDocuments([data, ...documents]);
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || !activeDoc) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const token = localStorage.getItem('studyai-token');
      const res = await fetch(`/api/pdf/${activeDoc._id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: userMsg.text })
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error.' }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!activeDoc) return;
    setChatLoading(true);
    setChatMessages(prev => [...prev, { role: 'ai', text: 'Generating a quiz from this document...' }]);
    
    try {
      const token = localStorage.getItem('studyai-token');
      const res = await fetch(`/api/pdf/${activeDoc._id}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic: '' })
      });
      
      if (res.ok) {
        setChatMessages(prev => [...prev, { role: 'ai', text: 'Quiz generated! Go to the Quizzes tab to take it.' }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', text: 'Failed to generate quiz.' }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Failed to generate quiz.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (activeDoc) {
    return (
      <div className="page-container" style={{ display: 'flex', gap: '24px', padding: '100px 24px 24px' }}>
        {/* Left Side: Summary and Actions */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <button className="btn btn-ghost" onClick={() => { setActiveDoc(null); setChatMessages([]); }}>
            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Documents
          </button>
          
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText style={{ color: '#6366f1' }} /> {activeDoc.title}
            </h2>
            <p style={{ color: '#9ca3af', marginTop: '8px' }}>Filename: {activeDoc.filename}</p>
          </div>

          <div className="glass-card" style={{ padding: '24px', flex: '1' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <BookOpen size={18} style={{ color: '#a855f7' }} /> AI Summary
            </h3>
            <p style={{ lineHeight: '1.6', color: '#d1d5db' }}>{activeDoc.summary || 'No summary available.'}</p>
          </div>

          <button className="btn btn-primary" onClick={handleGenerateQuiz} disabled={chatLoading} style={{ width: '100%' }}>
            <Zap size={18} /> Generate Quiz from PDF
          </button>
        </div>

        {/* Right Side: RAG Chat */}
        <div className="glass-card" style={{ flex: '1.5', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 124px)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MessageSquare size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ margin: 0 }}>Chat with Document</h3>
          </div>
          
          <div style={{ flex: '1', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {chatMessages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '40px' }}>
                <MessageSquare size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                <p>Ask anything about "{activeDoc.title}".</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>AI will search the document to answer your questions.</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? '#6366f1' : 'rgba(255,255,255,0.05)',
                padding: '12px 16px',
                borderRadius: '12px',
                maxWidth: '80%',
                lineHeight: '1.5'
              }}>
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div style={{ alignSelf: 'flex-start', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 className="animate-spin" size={16} /> AI is thinking...
              </div>
            )}
          </div>

          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px' }}>
            <input 
              className="input" 
              placeholder="Ask a question..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChat()}
              style={{ flex: '1' }}
            />
            <button className="btn btn-primary" onClick={handleChat} disabled={!chatInput.trim() || chatLoading}>
              <Play size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
      <div className="notes-header animate-fade-in-up">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Upload PDFs to summarize, chat, and generate quizzes</p>
        </div>
        
        {/* Upload Button */}
        <div>
          <input 
            type="file" 
            id="pdf-upload" 
            accept="application/pdf" 
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="pdf-upload" className="btn btn-primary" style={{ cursor: 'pointer' }}>
            {uploading ? <><Loader2 className="animate-spin" size={18} /> Processing PDF...</> : <><UploadCloud size={18} /> Upload PDF</>}
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }} className="stagger">
        {loading && <p>Loading documents...</p>}
        {!loading && documents.length === 0 && (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <UploadCloud size={48} style={{ margin: '0 auto 16px', color: '#6366f1' }} />
            <h3>No Documents Yet</h3>
            <p style={{ color: '#9ca3af', marginTop: '8px' }}>Upload your first PDF to get started with AI study tools.</p>
          </div>
        )}
        
        {documents.map(doc => (
          <div key={doc._id} className="glass-card animate-fade-in-up" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ fontSize: '32px' }}>{doc.icon}</div>
              <div style={{ flex: '1', overflow: 'hidden' }}>
                <h3 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.title}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{doc.filename}</p>
              </div>
            </div>
            
            <p style={{ fontSize: '14px', color: '#d1d5db', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {doc.summary}
            </p>

            <button className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }} onClick={() => setActiveDoc(doc)}>
              Open Document <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
