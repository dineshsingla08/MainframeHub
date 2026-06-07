import React, { useState } from 'react';

const ROLES = [
  {
    id: 'trainee',
    title: 'Mainframe Trainee',
    subtitle: 'Entry Level',
    years: '0–1 Year',
    salary: '$45K–$65K',
    salaryINR: '₹3.5–6 LPA',
    color: '#00ff41',
    icon: '🌱',
    skills: ['TSO/ISPF Navigation', 'Basic JCL', 'COBOL Syntax', 'z/OS Concepts', 'Job Submission & Monitoring'],
    certs: ['IBM Z Xplore (Free)', 'IBM COBOL Certificate'],
    tasks: ['Submit batch jobs', 'Read JCL & understand ABEND codes', 'Write basic COBOL programs', 'Understand file organizations'],
    tools: ['TSO', 'ISPF', 'SDSF', 'JES2']
  },
  {
    id: 'junior',
    title: 'Junior COBOL Developer',
    subtitle: 'Junior Level',
    years: '1–3 Years',
    salary: '$60K–$85K',
    salaryINR: '₹5–10 LPA',
    color: '#66ff66',
    icon: '💻',
    skills: ['Advanced COBOL', 'JCL/DFSORT', 'VSAM File Handling', 'DB2 Basic SQL', 'CICS Basics', 'Copybooks & PROCs'],
    certs: ['IBM Certified Developer – COBOL', 'IBM Z Systems Administrator'],
    tasks: ['Develop and maintain COBOL programs', 'Debug PIC/ABEND issues', 'Write JCL for batch jobs', 'Handle VSAM file operations'],
    tools: ['RDz (Rational Developer for z)', 'Compuware Topaz', 'ENDEVOR', 'CA-7']
  },
  {
    id: 'mid',
    title: 'Mid-Level Mainframe Developer',
    subtitle: 'Mid Level',
    years: '3–6 Years',
    salary: '$85K–$120K',
    salaryINR: '₹10–20 LPA',
    color: '#ffaa00',
    icon: '⚙️',
    skills: ['DB2 Advanced SQL', 'CICS Programming', 'IMS Basics', 'REXX Scripting', 'Performance Tuning', 'MQ Series Basics', 'Cross-platform Integration'],
    certs: ['IBM Certified System Administrator – DB2 for z/OS', 'IBM CICS Developer'],
    tasks: ['Design CICS transactions', 'Write complex DB2 queries', 'Performance analysis & tuning', 'Mentor junior developers', 'Production incident support'],
    tools: ['Omegamon', 'DB2 EXPLAIN', 'CICS Explorer', 'Strobe']
  },
  {
    id: 'senior',
    title: 'Senior Mainframe Engineer',
    subtitle: 'Senior Level',
    years: '6–10 Years',
    salary: '$120K–$160K',
    salaryINR: '₹20–40 LPA',
    color: '#ff6b35',
    icon: '🏆',
    skills: ['z/OS System Programming', 'Advanced CICS Architecture', 'DB2 DBA Skills', 'Security (RACF/ACF2/TopSecret)', 'Storage Management (SMS)', 'Disaster Recovery', 'DevOps for Mainframe'],
    certs: ['IBM Certified Systems Expert – Enterprise COBOL', 'IBM z/OS 2.5 Administrator'],
    tasks: ['Lead technical design', 'Capacity planning', 'Architecture reviews', 'Train & mentor teams', 'Production issue resolution'],
    tools: ['zTrial', 'IBM Z DevOps Acceleration Platform', 'Broadcom Compuware', 'Micro Focus Enterprise Suite']
  },
  {
    id: 'architect',
    title: 'Mainframe Architect / z/OS SME',
    subtitle: 'Principal / Architect',
    years: '10–15+ Years',
    salary: '$160K–$220K+',
    salaryINR: '₹40–80+ LPA',
    color: '#9b59b6',
    icon: '🏗️',
    skills: ['Enterprise Architecture', 'z/OS Internals', 'Parallel Sysplex', 'zIIP Optimization', 'Cloud-Mainframe Hybrid', 'API Gateway (z/OS Connect)', 'Business Continuity'],
    certs: ['IBM Master the Mainframe', 'TOGAF (Enterprise Architecture)'],
    tasks: ['Define enterprise architecture', 'z/OS release planning', 'Cost optimization (MLC)', 'Hybrid cloud strategy', 'C-Suite reporting'],
    tools: ['IBM Z Systems', 'z/OS Connect EE', 'IBM Cloud Pak for Integration', 'Parallel Sysplex']
  },
  {
    id: 'manager',
    title: 'Technical Manager / Director',
    subtitle: 'Leadership',
    years: '12+ Years',
    salary: '$180K–$260K+',
    salaryINR: '₹50–100+ LPA',
    color: '#e74c3c',
    icon: '👔',
    skills: ['Team Leadership', 'Project Management', 'Vendor Management', 'Budget Planning', 'Strategic Roadmapping', 'Agile/SAFe at Scale', 'Risk Management'],
    certs: ['PMP (Project Management Professional)', 'SAFe Program Consultant'],
    tasks: ['Manage development teams', 'Deliver mainframe modernization projects', 'Stakeholder communication', 'P&L ownership'],
    tools: ['ServiceNow', 'Jira', 'Confluence', 'IBM Planning Analytics']
  }
];

const LEARNING_PATHS = [
  { from: 'trainee', to: 'junior', label: '~12-18 months' },
  { from: 'junior', to: 'mid', label: '~2-3 years' },
  { from: 'mid', to: 'senior', label: '~3-4 years' },
  { from: 'senior', to: 'architect', label: '~3-5 years' },
  { from: 'senior', to: 'manager', label: '~5+ years' },
];

export const CareerRoadmap = () => {
  const [activeRole, setActiveRole] = useState('trainee');
  const [activeTab, setActiveTab] = useState('skills');

  const role = ROLES.find(r => r.id === activeRole);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="metric-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
          🗺️ MAINFRAME CAREER ROADMAP
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Your complete guide from Trainee to Architect — skills, certifications, tools & salary expectations
        </p>
      </div>

      {/* Timeline */}
      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', minWidth: '800px', padding: '1rem 0' }}>
          {ROLES.map((r, idx) => (
            <React.Fragment key={r.id}>
              <div
                onClick={() => setActiveRole(r.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  flex: 1,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: activeRole === r.id ? r.color : 'rgba(0,0,0,0.4)',
                  border: `3px solid ${r.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  boxShadow: activeRole === r.id ? `0 0 20px ${r.color}66` : 'none',
                  transition: 'all 0.3s',
                  transform: activeRole === r.id ? 'scale(1.15)' : 'scale(1)'
                }}>
                  {r.icon}
                </div>
                <div style={{
                  marginTop: '0.6rem',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  color: activeRole === r.id ? r.color : 'var(--text-secondary)',
                  textAlign: 'center',
                  maxWidth: '80px',
                  lineHeight: '1.3',
                  transition: 'color 0.2s'
                }}>
                  {r.title.split(' ').slice(0, 2).join(' ')}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                  {r.years}
                </div>
              </div>
              {idx < ROLES.length - 1 && (
                <div style={{
                  flex: 0.3,
                  height: '3px',
                  background: `linear-gradient(90deg, ${r.color}88, ${ROLES[idx + 1].color}88)`,
                  position: 'relative',
                  top: '-20px'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Role Detail Panel */}
      {role && (
        <div className="metric-card" style={{ padding: '1.5rem', borderTop: `3px solid ${role.color}` }}>
          {/* Role Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '2rem' }}>{role.icon}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0 }}>{role.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: role.color, fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{role.subtitle} • {role.years}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '0.7rem 1.2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: `1px solid ${role.color}44` }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>USA SALARY</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: role.color, fontFamily: 'var(--font-mono)' }}>{role.salary}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '0.7rem 1.2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: `1px solid ${role.color}44` }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>INDIA SALARY</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: role.color, fontFamily: 'var(--font-mono)' }}>{role.salaryINR}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.5rem' }}>
            {['skills', 'tasks', 'certs', 'tools'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.4rem 0.9rem',
                  background: activeTab === tab ? role.color + '22' : 'transparent',
                  border: `1px solid ${activeTab === tab ? role.color : 'var(--border-muted)'}`,
                  borderRadius: '6px',
                  color: activeTab === tab ? role.color : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: activeTab === tab ? '700' : '400',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'skills' ? '💡 Skills' : tab === 'tasks' ? '📋 Day Tasks' : tab === 'certs' ? '🏅 Certs' : '🔧 Tools'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.7rem' }}>
            {(activeTab === 'skills' ? role.skills :
              activeTab === 'tasks' ? role.tasks :
              activeTab === 'certs' ? role.certs :
              role.tools
            ).map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 0.8rem',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: '6px',
                border: `1px solid ${role.color}22`,
                fontSize: '0.85rem',
                color: 'var(--text-primary)'
              }}>
                <span style={{ color: role.color, flexShrink: 0, fontSize: '0.9rem' }}>
                  {activeTab === 'skills' ? '▸' : activeTab === 'tasks' ? '✓' : activeTab === 'certs' ? '🏅' : '⚙️'}
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="tip-box">
        <span style={{ fontSize: '1.2rem' }}>💡</span>
        <div className="tip-text">
          <strong>Pro Career Tip:</strong> Most Fortune 500 banks run 95%+ of their transaction volume on IBM Z. COBOL developers with 5+ years are commanding <strong>$150K+</strong> in North American markets. The skill shortage is real — there are fewer than 100,000 active COBOL developers globally for 800+ billion lines of production code.
        </div>
      </div>
    </div>
  );
};
