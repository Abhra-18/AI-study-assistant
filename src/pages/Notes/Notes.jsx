import { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Grid3X3, List, Star,
  MoreVertical, Edit3, Trash2, Heart, Clock, Tag, Sparkles, FileText, Brain, HelpCircle
} from 'lucide-react';
import './Notes.css';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showNewNote, setShowNewNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteSubject, setNewNoteSubject] = useState('');
  const [loading, setLoading] = useState(true);

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalTitle, setAiModalTitle] = useState('');

  // Fetch notes
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('studyai-token');
      const res = await fetch('/api/notes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch notes', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' ||
      (activeFilter === 'favorites' && note.isFavorite);
    return matchesSearch && matchesFilter;
  });

  const toggleFavorite = async (id) => {
    const noteToUpdate = notes.find(n => n._id === id);
    if (!noteToUpdate) return;
    
    // Optimistic update
    setNotes(prev => prev.map(n =>
      n._id === id ? { ...n, isFavorite: !n.isFavorite } : n
    ));

    try {
      const token = localStorage.getItem('studyai-token');
      await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ isFavorite: !noteToUpdate.isFavorite })
      });
    } catch (error) {
      console.error('Failed to update favorite status', error);
      // Revert on error
      setNotes(prev => prev.map(n =>
        n._id === id ? { ...n, isFavorite: noteToUpdate.isFavorite } : n
      ));
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const token = localStorage.getItem('studyai-token');
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setNotes(prev => prev.filter(n => n._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  const addNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    
    try {
      const token = localStorage.getItem('studyai-token');
      const color = ['#6366f1', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'][Math.floor(Math.random() * 6)];
      
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: newNoteTitle,
          content: newNoteContent,
          subject: newNoteSubject || 'General',
          color,
          tags: []
        })
      });
      
      if (res.ok) {
        const newNote = await res.json();
        setNotes(prev => [newNote, ...prev]);
        setNewNoteTitle('');
        setNewNoteContent('');
        setNewNoteSubject('');
        setShowNewNote(false);
      }
    } catch (error) {
      console.error('Failed to add note', error);
    }
  };

  const handleAiAction = async (action, note, titleStr) => {
    setAiModalTitle(titleStr);
    setAiLoading(true);
    setAiModalOpen(true);
    setAiResult(null);
    try {
      const token = localStorage.getItem('studyai-token');
      const res = await fetch(`/api/ai/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          content: note.content, 
          title: note.title, 
          subject: note.subject,
          concept: note.content // for explain endpoint
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        if (action === 'generate-quiz') {
           setAiResult(`Success! Quiz "${data.title}" generated with ${data.questionsCount} questions. Check the Quizzes tab!`);
        } else if (action === 'summarize') {
           setAiResult(data.summary);
        } else if (action === 'revision') {
           setAiResult(data.revision);
        } else if (action === 'explain') {
           setAiResult(data.explanation);
        }
      } else {
        setAiResult(`Error: ${data.message} - ${data.error || ''}`);
      }
    } catch (error) {
      setAiResult('Failed to connect to AI server. Check API Key.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="notes-page page-container">
      <div className="content-wrapper" style={{ paddingTop: '88px', paddingBottom: '40px' }}>
        {/* Header */}
        <div className="notes-header animate-fade-in-up">
          <div>
            <h1 className="page-title">My Notes</h1>
            <p className="page-subtitle">{loading ? 'Loading notes...' : `${notes.length} notes created`}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowNewNote(!showNewNote)}>
            <Plus size={18} />
            New Note
          </button>
        </div>

        {/* New Note Form */}
        {showNewNote && (
          <div className="new-note-form glass-card animate-fade-in-up">
            <div className="new-note-fields">
              <input
                className="input"
                placeholder="Note title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
              <input
                className="input"
                placeholder="Subject..."
                value={newNoteSubject}
                onChange={(e) => setNewNoteSubject(e.target.value)}
              />
              <textarea
                className="input"
                placeholder="Start writing your note..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={4}
              />
            </div>
            <div className="new-note-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowNewNote(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={addNote}>Save Note</button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="notes-toolbar animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              className="input search-input"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-tab ${activeFilter === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveFilter('favorites')}
              >
                <Star size={14} />
                Favorites
              </button>
            </div>

            <div className="view-toggle">
              <button
                className={`btn btn-icon btn-ghost ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                className={`btn btn-icon btn-ghost ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid/List */}
        <div className={`notes-container ${viewMode} stagger`}>
          {filteredNotes.map((note) => (
            <div key={note._id} className="note-card glass-card animate-fade-in-up">
              <div className="note-color-bar" style={{ background: note.color }} />
              <div className="note-content">
                <div className="note-top">
                  <span className="badge badge-primary">{note.subject}</span>
                  <div className="note-actions">
                    <button
                      className={`btn btn-icon btn-ghost btn-sm ${note.isFavorite ? 'favorited' : ''}`}
                      onClick={() => toggleFavorite(note._id)}
                    >
                      <Heart size={14} fill={note.isFavorite ? '#ef4444' : 'none'} color={note.isFavorite ? '#ef4444' : 'currentColor'} />
                    </button>
                    <button
                      className="btn btn-icon btn-ghost btn-sm"
                      onClick={() => deleteNote(note._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="note-title">{note.title}</h3>
                <p className="note-text">{note.content}</p>
                <div className="note-footer">
                  <div className="note-tags">
                    {note.tags.map((tag, i) => (
                      <span key={i} className="note-tag">
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="note-date">
                    <Clock size={12} />
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {/* AI Actions Row */}
                <div className="ai-actions-row" style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', flexWrap: 'wrap' }}>
                   <button className="btn btn-sm" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '12px', padding: '4px 8px' }} onClick={() => handleAiAction('summarize', note, 'AI Summary')}>
                     <FileText size={12} /> Summarize
                   </button>
                   <button className="btn btn-sm" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', fontSize: '12px', padding: '4px 8px' }} onClick={() => handleAiAction('revision', note, 'Revision Points')}>
                     <Brain size={12} /> Key Points
                   </button>
                   <button className="btn btn-sm" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', fontSize: '12px', padding: '4px 8px' }} onClick={() => handleAiAction('explain', note, 'ELI5 Explanation')}>
                     <HelpCircle size={12} /> Explain Simply
                   </button>
                   <button className="btn btn-sm" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', fontSize: '12px', padding: '4px 8px' }} onClick={() => handleAiAction('generate-quiz', note, 'Quiz Generator')}>
                     <Sparkles size={12} /> Gen Quiz
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && filteredNotes.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No notes found</h3>
            <p>Try adjusting your search or create a new note</p>
          </div>
        )}

        {/* AI Result Modal */}
        {aiModalOpen && (
          <div className="modal-overlay" onClick={() => setAiModalOpen(false)}>
            <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                <Sparkles style={{ color: '#a855f7' }} />
                <h3 style={{ margin: 0 }}>{aiModalTitle}</h3>
              </div>
              <div style={{ minHeight: '100px', maxHeight: '400px', overflowY: 'auto', lineHeight: '1.6' }}>
                {aiLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#9ca3af' }}>
                    Generating response...
                  </div>
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{aiResult}</div>
                )}
              </div>
              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={() => setAiModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
