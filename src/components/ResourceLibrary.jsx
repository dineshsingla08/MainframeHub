import React, { useState } from 'react';

const RESOURCES = {
  'IBM Official': {
    icon: '🔵',
    color: '#00aaff',
    items: [
      { title: 'IBM z/OS Documentation', url: 'https://www.ibm.com/docs/en/zos', desc: 'Official z/OS documentation library — the definitive reference for all z/OS components', type: 'Docs' },
      { title: 'IBM Enterprise COBOL Language Reference', url: 'https://www.ibm.com/docs/en/cobol-zos', desc: 'Complete COBOL for z/OS language specification with syntax diagrams', type: 'Docs' },
      { title: 'IBM Db2 for z/OS Documentation', url: 'https://www.ibm.com/docs/en/db2-for-zos', desc: 'Db2 12 and 13 for z/OS administration, SQL, and performance guides', type: 'Docs' },
      { title: 'IBM CICS Transaction Server Docs', url: 'https://www.ibm.com/docs/en/cics-ts', desc: 'CICS TS 5.6 documentation including BMS, API, and transaction design', type: 'Docs' },
      { title: 'IBM JCL Reference', url: 'https://www.ibm.com/docs/en/zos/2.5.0?topic=reference-jcl', desc: 'Complete JCL language reference for z/OS 2.5', type: 'Docs' },
      { title: 'IBM DFSORT Application Programming Guide', url: 'https://www.ibm.com/docs/en/zos/2.5.0?topic=dfsort', desc: 'DFSORT user guide with control statement syntax, examples, and optimization tips', type: 'Docs' },
      { title: 'IBM Z Xplore (Free Learning)', url: 'https://ibmzxplore.influitive.com', desc: 'IBM\'s official free mainframe learning platform with hands-on z/OS access', type: 'Course' },
    ]
  },
  'IBM Redbooks': {
    icon: '📕',
    color: '#e74c3c',
    items: [
      { title: 'Introduction to the New Mainframe: z/OS Basics', url: 'https://www.redbooks.ibm.com/redbooks/pdfs/sg246366.pdf', desc: 'SG24-6366 — The classic starting point for mainframe learning', type: 'Book' },
      { title: 'COBOL Programming Guide', url: 'https://www.redbooks.ibm.com/abstracts/sg246398.html', desc: 'Comprehensive COBOL programming with practical examples', type: 'Book' },
      { title: 'DB2 for z/OS: Database Administration', url: 'https://www.redbooks.ibm.com/abstracts/sg248076.html', desc: 'DB2 DBA guide covering installation, performance, and recovery', type: 'Book' },
      { title: 'CICS Performance Guide', url: 'https://www.redbooks.ibm.com/abstracts/sg248520.html', desc: 'CICS performance analysis and optimization techniques', type: 'Book' },
      { title: 'JCL in z/OS Environments', url: 'https://www.redbooks.ibm.com/abstracts/sg246105.html', desc: 'Practical JCL guide with real-world examples and tips', type: 'Book' },
      { title: 'VSAM Demystified', url: 'https://www.redbooks.ibm.com/abstracts/sg246105.html', desc: 'Complete guide to VSAM design, implementation, and tuning', type: 'Book' },
    ]
  },
  'Practice Platforms': {
    icon: '💻',
    color: '#00ff41',
    items: [
      { title: 'IBM Z Xplore Challenges', url: 'https://ibmzxplore.influitive.com', desc: 'Hands-on mainframe coding challenges with real z/OS access — completely FREE', type: 'Platform' },
      { title: 'Master the Mainframe Contest', url: 'https://www.ibm.com/academic/topic/master-mainframe', desc: 'IBM\'s annual mainframe skills competition for students and professionals', type: 'Platform' },
      { title: 'Marist College Mainframe', url: 'https://www.marist.edu/computer-science-math/information-technology/mainframe-access', desc: 'Free z/OS access for educational purposes', type: 'Platform' },
      { title: 'Hercules Mainframe Emulator', url: 'http://www.hercules-390.eu/', desc: 'Open-source IBM mainframe emulator for local practice (with MVS 3.8j)', type: 'Tool' },
      { title: 'TK4- (MVS 3.8j Turnkey)', url: 'http://wotho.ethz.ch/tk4-/', desc: 'Pre-configured MVS 3.8j system for Hercules — includes COBOL, JCL, VSAM', type: 'Tool' },
    ]
  },
  'YouTube Channels': {
    icon: '▶️',
    color: '#ff4444',
    items: [
      { title: 'IBM Z YouTube Channel', url: 'https://www.youtube.com/@IBMZ', desc: 'Official IBM Z channel with z/OS updates, demos, and educational content', type: 'Video' },
      { title: 'COBOL Programming with VSCode', url: 'https://www.youtube.com/playlist?list=PLzfuE90pv3M0guIDnPd3WNJJQM8SfkWzb', desc: 'Modern COBOL development using VS Code and IBM Z Open Editor', type: 'Video' },
      { title: 'Mainframe Expert (Murach COBOL)', url: 'https://www.youtube.com/results?search_query=mainframe+COBOL+interview', desc: 'COBOL and JCL interview preparation video series', type: 'Video' },
      { title: 'DB2 SQL Tutorial Series', url: 'https://www.youtube.com/results?search_query=DB2+z/OS+SQL+tutorial', desc: 'Step-by-step DB2 for z/OS SQL training videos', type: 'Video' },
    ]
  },
  'Reference Cards': {
    icon: '📄',
    color: '#9b59b6',
    items: [
      {
        title: 'JCL Quick Reference Card',
        url: null,
        desc: 'Key JCL parameters at a glance',
        type: 'Cheatsheet',
        content: `JOB: CLASS, MSGCLASS, NOTIFY, REGION, TIME
EXEC: PGM=, PROC=, COND=, PARM=
DD: DSN=, DISP=(status,normal,abnormal)
    SPACE=(TRK/CYL,(primary,secondary))
    DCB=(RECFM=,LRECL=,BLKSIZE=)
DISP Status: NEW,OLD,SHR,MOD
DISP End: KEEP,DELETE,CATLG,PASS
RECFM: F,FB,V,VB,U`
      },
      {
        title: 'COBOL PIC Clause Reference',
        url: null,
        desc: 'PICTURE clause symbols and usage',
        type: 'Cheatsheet',
        content: `9  - Numeric digit (0-9)
X  - Any character (alphanumeric)
A  - Alphabetic character only
S  - Sign (must be leftmost)
V  - Implied decimal point
P  - Assumed decimal position
Z  - Zero suppression
,  - Comma insertion
.  - Period (decimal point display)
$  - Dollar sign insertion
+/-  - Sign display
COMP-3 - Packed decimal storage
COMP   - Binary storage`
      },
      {
        title: 'DB2 SQL Quick Reference',
        url: null,
        desc: 'Common DB2 SQL patterns',
        type: 'Cheatsheet',
        content: `SQLCODE 0    = Success
SQLCODE 100  = Not Found
SQLCODE < 0  = Error

MAX salary:
  SELECT MAX(SAL) FROM EMP

2nd highest:
  SELECT MAX(SAL) FROM EMP
  WHERE SAL < (SELECT MAX(SAL) FROM EMP)

Rank function:
  RANK() OVER (ORDER BY SAL DESC)
  ROW_NUMBER() OVER (PARTITION BY DEPT ORDER BY SAL DESC)

Cursor: DECLARE → OPEN → FETCH → CLOSE`
      },
      {
        title: 'DFSORT Control Statements',
        url: null,
        desc: 'DFSORT key syntax reference',
        type: 'Cheatsheet',
        content: `SORT FIELDS=(pos,len,fmt,order)
  Formats: CH,ZD,PD,BI,AC,CSL
  Order: A (Ascending), D (Descending)

INCLUDE COND=(pos,len,fmt,op,value)
OMIT COND=(pos,len,fmt,op,value)
  Operators: EQ,NE,GT,GE,LT,LE

OUTREC FIELDS=(pos,len,...)
INREC FIELDS=(pos,len,...)

SUM FIELDS=(pos,len,fmt)
MERGE FIELDS=(pos,len,fmt,order)
OUTFIL FNAMES=,STARTREC=,ENDREC=`
      }
    ]
  },
  'Interview Websites': {
    icon: '🌐',
    color: '#ffaa00',
    items: [
      { title: 'mainframes360.com', url: 'https://www.mainframes360.com', desc: 'Comprehensive mainframe interview questions and tutorials covering COBOL, JCL, DB2, CICS', type: 'Website' },
      { title: 'mainframestechhelp.com', url: 'https://www.mainframestechhelp.com', desc: 'Mainframe technical help with Q&A, tutorials and tips for professionals', type: 'Website' },
      { title: 'ibmmainframer.com', url: 'https://www.ibmmainframer.com', desc: 'Free IBM mainframe training and interview preparation with 500+ questions', type: 'Website' },
      { title: 'GeeksForGeeks — COBOL', url: 'https://www.geeksforgeeks.org/cobol/', desc: 'COBOL tutorials and interview questions on GeeksForGeeks', type: 'Website' },
      { title: 'mainframesguru.in', url: 'https://www.mainframesguru.in', desc: 'Indian mainframe professionals community with interview experiences', type: 'Website' },
    ]
  }
};

const TYPE_COLORS = {
  Docs: '#00aaff', Book: '#e74c3c', Course: '#00ff41', Platform: '#9b59b6',
  Tool: '#ff6b35', Video: '#ff4444', Cheatsheet: '#ffaa00', Website: '#66cc99'
};

export const ResourceLibrary = () => {
  const [activeSection, setActiveSection] = useState('IBM Official');
  const [expandedCard, setExpandedCard] = useState(null);
  const [copiedCheatsheet, setCopiedCheatsheet] = useState(null);

  const copyCheatsheet = (content, idx) => {
    navigator.clipboard.writeText(content);
    setCopiedCheatsheet(idx);
    setTimeout(() => setCopiedCheatsheet(null), 2000);
  };

  const section = RESOURCES[activeSection];

  return (
    <div style={{ display: 'flex', gap: '0', height: 'calc(100vh - 140px)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', minWidth: '200px', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid var(--border-muted)', overflowY: 'auto', padding: '1rem 0' }}>
        <div style={{ padding: '0 1rem', marginBottom: '0.8rem', fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>
          SECTIONS
        </div>
        {Object.entries(RESOURCES).map(([name, data]) => (
          <button
            key={name}
            onClick={() => setActiveSection(name)}
            style={{
              padding: '0.7rem 1rem',
              textAlign: 'left',
              background: activeSection === name ? 'rgba(var(--accent-rgb),0.12)' : 'transparent',
              border: 'none',
              borderLeft: activeSection === name ? `3px solid ${data.color}` : '3px solid transparent',
              color: activeSection === name ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              width: '100%',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: activeSection === name ? '700' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <span>{data.icon}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>{activeSection}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {section.items.map((item, idx) => (
            <div
              key={idx}
              className="metric-card"
              style={{ cursor: item.content ? 'pointer' : 'default', borderTop: `3px solid ${section.color}44`, transition: 'all 0.2s' }}
              onClick={() => item.content && setExpandedCard(expandedCard === idx ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.65rem',
                  color: TYPE_COLORS[item.type] || '#888',
                  fontFamily: 'var(--font-mono)',
                  border: `1px solid ${TYPE_COLORS[item.type] || '#888'}55`,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '3px',
                  fontWeight: '700'
                }}>{item.type}</span>
                {item.content && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {expandedCard === idx ? '▲' : '▼'}
                  </span>
                )}
              </div>

              <h3 style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0 0 0.4rem 0', lineHeight: '1.3' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.8rem 0', lineHeight: '1.5' }}>
                {item.desc}
              </p>

              {/* Cheatsheet expanded */}
              {item.content && expandedCard === idx && (
                <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                  <pre style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-muted)',
                    borderRadius: '6px',
                    padding: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    lineHeight: '1.6',
                    color: 'var(--accent-color)',
                    overflow: 'auto',
                    margin: 0,
                    maxHeight: '200px'
                  }}>
                    {item.content}
                  </pre>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyCheatsheet(item.content, idx); }}
                    style={{
                      position: 'absolute', top: '0.4rem', right: '0.4rem',
                      padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                      background: 'rgba(0,0,0,0.6)', border: '1px solid var(--border-muted)', borderRadius: '4px',
                      color: copiedCheatsheet === idx ? '#00ff41' : 'var(--text-secondary)', cursor: 'pointer'
                    }}
                  >
                    {copiedCheatsheet === idx ? '✓' : '⎘'}
                  </button>
                </div>
              )}

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: section.color,
                    textDecoration: 'none',
                    padding: '0.3rem 0.7rem',
                    border: `1px solid ${section.color}44`,
                    borderRadius: '4px',
                    background: `${section.color}11`,
                    transition: 'all 0.2s'
                  }}
                >
                  🔗 OPEN LINK
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
