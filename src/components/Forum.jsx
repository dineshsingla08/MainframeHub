import React, { useState, useEffect } from 'react';

export const Forum = ({ user, token, triggerAuthModal }) => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create Topic Form States
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  // Reply Form States
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/forum/topics');
      if (!res.ok) throw new Error('Failed to fetch topics');
      const data = await res.json();
      setTopics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/forum/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle, content: newContent, category: newCategory })
      });

      if (!res.ok) throw new Error('Failed to create topic');
      
      const created = await res.json();
      setTopics(prev => [created, ...prev]);
      setShowCreateForm(false);
      setNewTitle('');
      setNewContent('');
      setNewCategory('General');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSelectTopic = async (topic) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/forum/topics/${topic.id}`);
      if (!res.ok) throw new Error('Failed to fetch topic details');
      const data = await res.json();
      setSelectedTopic(data.topic);
      setReplies(data.replies);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!token || !selectedTopic) return;

    setSubmittingReply(true);
    try {
      const res = await fetch(`http://localhost:5000/api/forum/topics/${selectedTopic.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: replyContent })
      });

      if (!res.ok) throw new Error('Failed to submit reply');
      const added = await res.json();
      setReplies(prev => [...prev, added]);
      setReplyContent('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLike = async (topicId, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5000/api/forum/topics/${topicId}/like`, {
        method: 'POST'
      });
      if (res.ok) {
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, likes: t.likes + 1 } : t));
        if (selectedTopic && selectedTopic.id === topicId) {
          setSelectedTopic(prev => ({ ...prev, likes: prev.likes + 1 }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', minHeight: 'calc(100vh - 140px)', flexWrap: 'wrap' }}>
      
      {/* Topics List or Selected Details Container */}
      <div className="card-panel" style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.2rem', minHeight: '520px' }}>
        
        {!selectedTopic ? (
          <>
            {/* Header List View */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 className="section-title" style={{ margin: 0 }}>💬 COMMUNITY DISCUSSION</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Ask questions, share COBOL debug logs, and connect with Mainframe developers globally.
                </p>
              </div>
              <div>
                {token ? (
                  <button 
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="action-btn"
                    style={{ fontSize: '0.78rem', padding: '0.5rem 1rem' }}
                  >
                    {showCreateForm ? 'CANCEL' : '➕ ASK QUESTION'}
                  </button>
                ) : (
                  <button 
                    onClick={triggerAuthModal}
                    className="action-btn"
                    style={{ fontSize: '0.78rem', padding: '0.5rem 1rem', background: 'rgba(255,170,0,0.1)', borderColor: '#ffaa0055', color: '#ffaa00' }}
                  >
                    🔒 SIGN IN TO POST
                  </button>
                )}
              </div>
            </div>

            {/* Create Topic Form */}
            {showCreateForm && (
              <form onSubmit={handleCreateTopic} style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--border-muted)', 
                padding: '1.2rem', 
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem'
              }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-color)' }}>
                  CREATE NEW TOPIC
                </h4>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>TOPIC TITLE</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g., How to handle JCL duplicate catalog error?" 
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-muted)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>CATEGORY</label>
                    <select 
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-muted)', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}
                    >
                      <option value="General">General</option>
                      <option value="JCL">JCL</option>
                      <option value="COBOL">COBOL</option>
                      <option value="DB2">DB2</option>
                      <option value="VSAM">VSAM</option>
                      <option value="CICS">CICS</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>CONTENT / CODE LOG</label>
                  <textarea 
                    required 
                    rows={4}
                    placeholder="Describe your issue or write your question here..."
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-muted)', color: 'var(--text-primary)', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="action-btn" style={{ width: '120px', alignSelf: 'flex-start' }}>
                  SUBMIT POST
                </button>
              </form>
            )}

            {/* List topics */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-color)' }}>
                LOADING FORUM TOPICS...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto', flex: 1 }}>
                {topics.map(topic => (
                  <div 
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    style={{
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-muted)',
                      borderRadius: '6px',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', background: 'rgba(var(--accent-rgb), 0.15)', color: 'var(--accent-color)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          {topic.category.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          Posted by @{topic.username} • {new Date(topic.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {topic.title}
                      </div>
                    </div>

                    <button 
                      onClick={(e) => handleLike(topic.id, e)}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-muted)',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem'
                      }}
                    >
                      <span>👍</span> {topic.likes}
                    </button>
                  </div>
                ))}
                {topics.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                    NO DISCUSSION TOPICS FOUND. BE THE FIRST TO ASK A QUESTION!
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Detailed View with Comments */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', height: '100%' }}>
            
            {/* Back to list */}
            <button 
              onClick={() => { setSelectedTopic(null); setReplies([]); fetchTopics(); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-color)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: 0
              }}
            >
              ← BACK TO FORUM
            </button>

            {/* Topic Main Post */}
            <div style={{ borderBottom: '1px solid var(--border-muted)', paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', background: 'rgba(var(--accent-rgb),0.15)', color: 'var(--accent-color)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {selectedTopic.category.toUpperCase()}
                  </span>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0.5rem 0 0.1rem 0' }}>
                    {selectedTopic.title}
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Asked by @{selectedTopic.username} • {new Date(selectedTopic.created_at).toLocaleString()}
                  </div>
                </div>
                <button 
                  onClick={(e) => handleLike(selectedTopic.id, e)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-muted)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <span>👍 UPVOTE</span> {selectedTopic.likes}
                </button>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.6', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '6px', whiteSpace: 'pre-wrap', border: '1px solid rgba(255,255,255,0.02)' }}>
                {selectedTopic.content}
              </p>
            </div>

            {/* Replies List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Replies ({replies.length})
              </h4>
              {replies.map(rep => (
                <div key={rep.id} style={{ 
                  background: 'rgba(255,255,255,0.01)', 
                  borderLeft: '3px solid var(--accent-color)', 
                  padding: '0.8rem 1rem', 
                  borderRadius: '0 6px 6px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    @{rep.username} • {new Date(rep.created_at).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {rep.content}
                  </div>
                </div>
              ))}
              {replies.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  NO REPLIES YET. PROPOSE A SOLUTION BELOW!
                </div>
              )}
            </div>

            {/* Reply Input Form */}
            {token ? (
              <form onSubmit={handleAddReply} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-muted)', paddingTop: '1rem' }}>
                <label style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>YOUR REPLY</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Provide technical analysis, code correction, or system debugging suggestions..."
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-muted)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
                <button 
                  type="submit" 
                  disabled={submittingReply}
                  className="action-btn"
                  style={{ width: '100px', alignSelf: 'flex-start', fontSize: '0.78rem' }}
                >
                  {submittingReply ? 'POSTING...' : 'REPLY'}
                </button>
              </form>
            ) : (
              <div style={{ background: 'rgba(255,170,0,0.03)', border: '1px solid #ffaa0033', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  Please <button onClick={triggerAuthModal} style={{ background: 'none', border: 'none', color: '#ffaa00', textDecoration: 'underline', cursor: 'pointer', fontWeight: '800' }}>log in</button> to post your reply.
                </span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
