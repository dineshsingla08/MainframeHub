import React, { useState } from 'react';

const SCENARIOS = [
  {
    id: 1,
    title: "EBCDIC File Transfer Corruption",
    category: "Batch",
    difficulty: "Developer",
    problem: "A Java microservice receives a customer CSV extract file from z/OS. However, special characters are corrupted, and all numbers are shifted, causing Java parsing errors.",
    log: `INCIDENT ID: INC-009218
LOG SOURCE: Java Spring Batch Parser
ERROR MESSAGE: java.lang.NumberFormatException: For input string: "ñòô"
JCL CONTEXT: FTP PUT step transferring dataset with default transfer settings.`,
    analysis: "Mainframe datasets use EBCDIC (Extended Binary Coded Decimal Interchange Code) encoding. Standard Unix/Windows services expect ASCII or UTF-8. A binary file transfer (FTP type I) was used instead of text conversion (FTP type A), or the code page translation table (CONVB/XLATE) did not map special characters properly.",
    solution: "1. Update FTP transfer JCL parameters to enforce ASCII text mode transfer:\n   LOCSITE ENCODING=SBCS\n   LOCSITE LRECL=80 RECFM=FB\n   ASCII\n2. Specify standard code page conversions explicitly:\n   LOCSITE SBDATACONN=(IBM-1047,ISO8859-1)\n3. Verify record layout matches fixed-block properties.",
    tip: "When building modern API integration layers on z/OS, use z/OS Connect or native EBCDIC-to-UTF-8 character conversion libraries rather than raw binary data streams."
  },
  {
    id: 2,
    title: "DB2 Deadlock in Overnight Batch",
    category: "DB2",
    difficulty: "Architect",
    problem: "An overnight batch job updating 500,000 credit card accounts crashes with SQLCODE -911 (Reason 00C90088), causing downstream delays in account reconciliation.",
    log: `DSNT408I SQLCODE = -911, ERROR: THE TRANSACTION WAS ROLLED BACK DUE TO DEADLOCK
DSNT418I SQLSTATE = 22002, REASON CODE = 00C90088, TYPE OF RESOURCE = 00000302
INCIDENT DETAIL: Job UPDATEACCTS and Online API task OL_POSTING locked tablespace concurrently.`,
    analysis: "The batch job was updating records in alphabetical order, whereas the online microservice was updating accounts based on arrival sequence. Since the batch job processed 10,000 updates between COMMITs, it held massive exclusive page locks, creating a circular wait (deadlock) with the online transaction.",
    solution: "1. Restructure the batch program to commit transactions frequently (e.g. every 500 rows) using a cursor loop to release locks.\n2. Ensure both batch and online services update resources in the same logical sequence (e.g., sort inputs by ACCOUNT_ID).\n3. Consult DBA to change tablespace lock size from PAGE/TABLESPACE to ROW level locks.",
    tip: "Row-level locking reduces deadlocks significantly, but increases the memory overhead on DB2's Lock Manager. Use it selectively for high-contention tables."
  },
  {
    id: 3,
    title: "VSAM File Sharing (Record Lock)",
    category: "VSAM",
    difficulty: "Developer",
    problem: "A daily transaction file fails to load because the target VSAM file is held exclusively by an active CICS region, throwing a FILE STATUS 97 or 92 error.",
    log: `IEF210I EXPORTJCL STEP2 - VSAM FILE OPEN ERROR
IEC161I 052(013,SYSUT2)-061,EXPORTJCL,STEP2,VSAMDD,3390,,,
FILE STATUS = 97 (File was opened successfully but catalog check failed or file is currently open in CICS).`,
    analysis: "VSAM does not support active read/write sharing across multiple subsystems (Batch vs. CICS) without configuring Share Options. The dataset catalog defines SHAREOPTIONS(1,3), meaning only one user can write, preventing batch JCL from modifying it while CICS is online.",
    solution: "1. Close the VSAM file in CICS using a console command before running the JCL batch step:\n   EXEC CICS SET DSNAME('CUST.VSAM') CLOSED DISABLED END-EXEC\n2. Run the batch job and reopen it in CICS.\n3. For concurrent sharing, implement VSAM RLS (Record Level Sharing) by specifying RLS=CR or RLS=NRI in JCL and defining SHAREOPTIONS(2,3).",
    tip: "VSAM RLS is the modern enterprise standard for sharing datasets between online regions and batch pipelines safely without locking entire tables."
  },
  {
    id: 4,
    title: "CICS Transaction Loop (CPU Exhaustion)",
    category: "CICS",
    difficulty: "Architect",
    problem: "An online CICS region starts experiencing extreme slowdowns. System logs indicate transaction 'ACCT' is consuming 99% CPU and triggering automatic task cancellations.",
    log: `DFHAP0001 CICS REGION1 - AN ABEND CODE AICA HAS OCCURRED IN TRANSACTION ACCT
PROG=ACCTVIEW OFFSET=0000E290
REASON DETAIL: Transaction cancelled due to Runaway Task Time limit exceeded.`,
    analysis: "An AICA abend is CICS's runaway task indicator. A loop exists inside the COBOL-CICS program (e.g., an indexing variable is not incremented, or a cursor loop lacks an end-of-file check), causing the transaction execution to loop indefinitely without yielding control.",
    solution: "1. Trace the offset in the abend dump to find the loop boundary inside ACCTVIEW.\n2. Add defensive checks inside COBOL loops: ensure counter variables increment on every iteration.\n3. Add CICS yielding instructions if processing large arrays:\n   EXEC CICS DELAY INTERVAL(0) END-EXEC (forces CICS to dispatch other tasks).",
    tip: "Set CICS RUNAWAY parameter in transaction PCT definitions to prevent a single buggy transaction loop from freezing the entire regional thread pool."
  },
  {
    id: 5,
    title: "GDG Rollback Duplication on Job Restart",
    category: "Batch",
    difficulty: "Developer",
    problem: "A multi-step JCL batch job fails in Step 3. Upon fixing the error and restarting the job from Step 3, the job crashes immediately with a DUPLICATE CATALOG ENTRYS error.",
    log: `IEF286I STARTJOB STEP3 - DSN=PROD.LEDGER.BACKUP(+1) - DISP=NEW
IEF212I STARTJOB STEP3 - DATASET CONFLICTS WITH EXISTING CATALOG RECORD`,
    analysis: "In Step 1, the dataset was allocated as (+1). In JCL, (+1) is resolved to a physical generation (e.g. G0005V00) on job start. If Step 3 abends, the catalog entry G0005V00 still physically exists on disk. Restarting from Step 3 trying to allocate (+1) again points to the same resolved generation name, causing conflict.",
    solution: "1. Delete the failed generation using utility IDCAMS before restarting:\n   DELETE 'PROD.LEDGER.BACKUP.G0005V00'\n2. Restructure the restart script to run a cleanup step first.\n3. Standardize JCLs to use disposition parameter DISP=(NEW,CATLG,DELETE) so that abended steps automatically delete partial file allocations.",
    tip: "Use modern job schedulers (like Control-M) that automatically manage dynamic dataset catalog cleanups on job restarts."
  }
];

export const Scenarios = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [expandedSection, setExpandedSection] = useState(null); // 'analysis' or 'solution'

  const categories = ['ALL', 'Batch', 'DB2', 'VSAM', 'CICS'];

  const filteredScenarios = SCENARIOS.filter(sc => 
    activeCategory === 'ALL' || sc.category === activeCategory
  );

  return (
    <div style={{ display: 'flex', gap: '1.5rem', minHeight: 'calc(100vh - 140px)', flexWrap: 'wrap' }}>
      
      {/* List Panel */}
      <div className="card-panel" style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '720px' }}>
        <div>
          <h3 className="section-title" style={{ margin: 0 }}>⚙️ PRODUCTION SCENARIOS</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Real-world incident reports from mainframe production environments. Select a case study to analyze.
          </p>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedSection(null);
              }}
              className={`badge ${activeCategory === cat ? 'badge-primary' : ''}`}
              style={{ cursor: 'pointer', border: 'none', padding: '0.35rem 0.6rem', fontSize: '0.65rem' }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Scenario Cards */}
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredScenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc);
                setExpandedSection(null);
              }}
              style={{
                width: '100%',
                padding: '0.9rem',
                textAlign: 'left',
                background: selectedScenario.id === sc.id ? 'rgba(var(--accent-rgb), 0.1)' : 'rgba(255,255,255,0.02)',
                border: '1px solid',
                borderColor: selectedScenario.id === sc.id ? 'var(--accent-color)' : 'var(--border-muted)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.4rem', color: 'var(--text-secondary)' }}>
                  {sc.category.toUpperCase()}
                </span>
                <span style={{ 
                  fontSize: '0.62rem', 
                  fontFamily: 'var(--font-mono)', 
                  color: sc.difficulty === 'Architect' ? '#ff4444' : '#ffaa00' 
                }}>
                  {sc.difficulty.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {sc.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="card-panel" style={{ flex: '2 2 500px', display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '720px', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.4rem' }}>🛠️</span>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>
              {selectedScenario.title}
            </h2>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
            CATEGORY: {selectedScenario.category.toUpperCase()} | LEVEL: {selectedScenario.difficulty.toUpperCase()}
          </div>
        </div>

        {/* Problem */}
        <div>
          <h4 style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Incident Description</h4>
          <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            {selectedScenario.problem}
          </p>
        </div>

        {/* Log Output */}
        <div>
          <h4 style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Incident Dump Log</h4>
          <pre style={{ 
            background: '#040804', 
            color: '#39ff14', 
            padding: '1rem', 
            borderRadius: '6px', 
            border: '1px solid rgba(57,255,20,0.2)', 
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            lineHeight: '1.4',
            overflowX: 'auto'
          }}>
            <code>{selectedScenario.log}</code>
          </pre>
        </div>

        {/* Action Buttons for Analysis/Solution */}
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'analysis' ? null : 'analysis')}
            className="action-btn"
            style={{ 
              background: expandedSection === 'analysis' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
              color: expandedSection === 'analysis' ? '#000' : 'var(--text-primary)',
              border: expandedSection === 'analysis' ? '1px solid var(--accent-color)' : '1px solid var(--border-muted)',
              fontSize: '0.78rem',
              padding: '0.5rem 1rem'
            }}
          >
            {expandedSection === 'analysis' ? '▲ HIDE ANALYSIS' : '▼ SHOW ARCHITECTURAL ANALYSIS'}
          </button>

          <button 
            onClick={() => setExpandedSection(expandedSection === 'solution' ? null : 'solution')}
            className="action-btn"
            style={{ 
              background: expandedSection === 'solution' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
              color: expandedSection === 'solution' ? '#000' : 'var(--text-primary)',
              border: expandedSection === 'solution' ? '1px solid var(--accent-color)' : '1px solid var(--border-muted)',
              fontSize: '0.78rem',
              padding: '0.5rem 1rem'
            }}
          >
            {expandedSection === 'solution' ? '▲ HIDE RESOLUTION' : '▼ SHOW RESOLUTION PLAN'}
          </button>
        </div>

        {/* Collapsible content */}
        {expandedSection === 'analysis' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-muted)', padding: '1.2rem', borderRadius: '6px', animation: 'fadeIn 0.2s' }}>
            <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>🔍 SYSTEM BEHAVIOR ANALYSIS</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
              {selectedScenario.analysis}
            </p>
          </div>
        )}

        {expandedSection === 'solution' && (
          <div style={{ background: 'rgba(0, 255, 65, 0.03)', border: '1px solid rgba(0, 255, 65, 0.2)', padding: '1.2rem', borderRadius: '6px', animation: 'fadeIn 0.2s' }}>
            <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#00ff41', marginBottom: '0.5rem' }}>🔧 INCIDENT RESOLUTION PLAN</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
              {selectedScenario.solution}
            </p>
          </div>
        )}

        {/* Professional Tip */}
        <div style={{ background: 'rgba(255,170,0,0.06)', borderLeft: '4px solid #ffaa00', padding: '0.8rem 1rem', borderRadius: '0 6px 6px 0' }}>
          <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#ffaa00', fontWeight: '800', marginBottom: '0.25rem', letterSpacing: '1px' }}>
            ◈ ARCHITECT LESSON LEARNED
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            {selectedScenario.tip}
          </div>
        </div>

      </div>

    </div>
  );
};
