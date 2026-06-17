import React, { useState, useEffect } from 'react';

export const Careers = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterExp, setFilterExp] = useState('ALL');

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (filterType !== 'ALL') queryParams.append('type', filterType);
      if (filterExp !== 'ALL') queryParams.append('experience', filterExp);

      const res = await fetch((window.API_BASE || '') + `/api/jobs?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch job postings.');
      const data = await res.json();
      setJobs(data);
      if (data.length > 0) {
        // Find if selectedJob is still in the new list, or default to first
        const stillExists = selectedJob ? data.find(j => j.id === selectedJob.id) : null;
        if (!stillExists) {
          setSelectedJob(data[0]);
        } else {
          setSelectedJob(stillExists);
        }
      } else {
        setSelectedJob(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, filterType, filterExp]);

  const handleApplyRedirect = (job) => {
    if (!job || !job.url) return;
    window.open(job.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 'calc(100vh - 140px)' }}>
      
      {/* UPPER PANEL: STATISTICS & HERO CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        
        {/* STAT 1 */}
        <div className="card-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(var(--accent-rgb), 0.03)' }}>
          <div style={{ fontSize: '2rem' }}>💼</div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>ACTIVE OPENINGS (INDIA)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)', marginTop: '0.1rem' }}>12+ Active Jobs</div>
          </div>
        </div>

        {/* STAT 2 */}
        <div className="card-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem' }}>🔗</div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>PARTNER PORTALS</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#00ff41', fontFamily: 'var(--font-mono)', marginTop: '0.1rem' }}>LinkedIn & Naukri</div>
          </div>
        </div>

        {/* STAT 3 */}
        <div className="card-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem' }}>💰</div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>AVG MAINFRAME SALARY (INR)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#00ccff', fontFamily: 'var(--font-mono)', marginTop: '0.1rem' }}>₹15,00,000 / yr</div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="card-panel" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search jobs by title, company, skills..." 
          className="search-input" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '240px', padding: '0.6rem', border: '1px solid var(--border-muted)', background: 'rgba(0,0,0,0.2)' }}
        />
        
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          {/* Job Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>TYPE:</span>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-muted)',
                borderRadius: '4px',
                padding: '0.4rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <option value="ALL">ALL TYPES</option>
              <option value="Full-time">FULL-TIME</option>
              <option value="Contract">CONTRACT</option>
              <option value="Remote">REMOTE</option>
              <option value="Hybrid">HYBRID</option>
              <option value="Onsite">ONSITE</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>EXPERIENCE:</span>
            <select
              value={filterExp}
              onChange={e => setFilterExp(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-muted)',
                borderRadius: '4px',
                padding: '0.4rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <option value="ALL">ALL LEVELS</option>
              <option value="Junior">JUNIOR (0-3 YRS)</option>
              <option value="Mid">MID-LEVEL (3-7 YRS)</option>
              <option value="Senior">SENIOR (7+ YRS)</option>
              <option value="Lead">LEAD / ARCHITECT</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(255, 68, 68, 0.1)',
          border: '1px solid #ff444455',
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          color: '#ff4444',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-mono)'
        }}>
          ❌ {error}
        </div>
      )}

      {/* MAIN CONTENT SPLIT LAYOUT */}
      <div className="workspace-grid" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* LEFT COMPONENT - JOB LIST */}
        <div className="card-panel" style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '680px' }}>
          
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.5rem' }}>
            <div style={{
              color: 'var(--accent-color)',
              padding: '0.5rem 0.5rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '800',
              fontSize: '0.85rem'
            }}>
              EXPLORE ACTIVE MAINFRAME ROLES
            </div>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                ⏳ QUERYING MAINFRAME JOBS DATABASE...
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                NO MAINFRAME ROLES MATCH YOUR SELECTION.
              </div>
            ) : (
              jobs.map(job => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    textAlign: 'left',
                    background: selectedJob?.id === job.id ? 'rgba(var(--accent-rgb), 0.1)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid',
                    borderColor: selectedJob?.id === job.id ? 'var(--accent-color)' : 'var(--border-muted)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{job.title}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>{job.company} • {job.location}</span>
                    <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{job.salary}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <span className="badge" style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem', background: 'rgba(255,255,255,0.05)' }}>
                        {job.type.toUpperCase()}
                      </span>
                      <span className="badge" style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem', background: 'rgba(var(--accent-rgb), 0.08)', color: 'var(--accent-color)' }}>
                        {job.experience.toUpperCase()}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      color: job.portal === 'LinkedIn' ? '#0077b5' : '#ff7518',
                      fontWeight: 'bold'
                    }}>
                      via {job.portal}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT - JOB DETAILS */}
        <div className="card-panel" style={{ flex: '2 2 500px', display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '680px', overflowY: 'auto' }}>
          {selectedJob ? (
            <>
              {/* Header Details */}
              <div style={{ borderBottom: '1px solid var(--border-muted)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                      {selectedJob.title}
                    </h2>
                    <div style={{ fontSize: '0.92rem', color: 'var(--accent-color)', fontWeight: '700', marginTop: '0.3rem' }}>
                      {selectedJob.company}
                    </div>
                  </div>
                  
                  {/* Action or Redirection Button */}
                  {!user ? (
                    <div style={{ fontSize: '0.8rem', color: '#ffaa00', fontFamily: 'var(--font-mono)' }}>
                      🔒 SIGN IN TO APPLY
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApplyRedirect(selectedJob)}
                      className="action-btn"
                      style={{
                        padding: '0.6rem 1.4rem',
                        fontSize: '0.8rem',
                        background: selectedJob.portal === 'LinkedIn' ? '#0077b5' : '#ff7518',
                        color: '#fff',
                        border: 'none',
                        boxShadow: selectedJob.portal === 'LinkedIn' ? '0 0 15px rgba(0, 119, 181, 0.4)' : '0 0 15px rgba(255, 127, 0, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedJob.portal === 'LinkedIn' ? '🔗 Apply on LinkedIn' : '💼 Apply on Naukri'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>📍 {selectedJob.location}</span>
                  <span>⏱️ {selectedJob.type}</span>
                  <span>📈 Level: {selectedJob.experience}</span>
                  <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>💰 {selectedJob.salary}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Job Description</h4>
                <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                  {selectedJob.description}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h4 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Key Requirements</h4>
                <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {selectedJob.requirements && selectedJob.requirements.map((req, idx) => (
                    <li key={idx}>
                      <span style={{ color: 'var(--accent-color)' }}>◈ </span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Tip */}
              <div style={{ background: 'rgba(0,255,65,0.03)', borderLeft: '4px solid var(--accent-color)', padding: '0.8rem 1rem', borderRadius: '0 6px 6px 0', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-color)', fontWeight: '800', marginBottom: '0.2rem', letterSpacing: '1px' }}>
                  ◈ MAINFRAMEHUB RECRUITER TIP
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                  Clicking the application button will securely redirect you to the live posting on <strong>{selectedJob.portal}</strong> where you can complete your submission.
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flex1: 1, justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              SELECT A JOB FROM THE LIST TO VIEW SPECIFICATIONS.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
