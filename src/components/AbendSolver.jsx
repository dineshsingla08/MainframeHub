import React, { useState } from 'react';
import { abendsData } from '../data/abends';

const SEVERITY_COLORS = {
  CRITICAL: '#ff4444',
  HIGH: '#ffaa00',
  MEDIUM: '#00ccff'
};

const CATEGORIES = ['ALL', 'System', 'Space', 'DB2', 'CICS'];

const SIMULATOR_SCENARIOS = [
  {
    id: 1,
    title: "Batch Payroll Processing Failure",
    log: `IEF450I PAYROLL JOB1 STEP20 - ABEND=S0C7 U0000 REASON=00000007
GP0010I  *** DB2 SQLCA INTERCEPT IN PROGRAM PAYCALC ***
CEE3250C The system detected a data exception (System Completion Code=0C7).
         From entry point PAYROLL-CALC at statement 243 at address 1A09E380.
SYSOUT OUTPUT:
WS-HOURS = '40.00' (hex: F4F0F0F0)
WS-RATE  = '     ' (hex: 4040404040) <-- ERROR`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S0C7", "S0C4", "S322", "SB37"],
    answer1: "S0C7",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Initialize WS-RATE to zero and check 'IF WS-RATE IS NUMERIC' before processing.",
      "Increase the JCL REGION size to REGION=64M in the JOB card.",
      "Add a secondary allocation block to the space definition in JCL.",
      "Recompile the DB2 package with timestamp token updates."
    ],
    answer2: "Initialize WS-RATE to zero and check 'IF WS-RATE IS NUMERIC' before processing.",
    explanation: "The log shows WS-RATE contains spaces (hex 4040404040), which causes a S0C7 data exception when used in arithmetic. The correct solution is initialization and numeric verification."
  },
  {
    id: 2,
    title: "Production File Export Failure",
    log: `IEF251I EXPORTJOB STEP10 - ABEND=S37 U0000 REASON=00000004
IEC030I 37-04,IFG0554A,EXPORTJOB,STEP10,SYSUT2,3390,VOL102,PROD.EXPORT.DATA
IEF472I EXPORTJOB STEP10 - COMPLETION CODE - SYSTEM=B37 MEMBER=00000004
JCL CARD REFERENCE:
//SYSUT2   DD DSN=PROD.EXPORT.DATA,DISP=(NEW,CATLG,DELETE),
//            UNIT=SYSDA,SPACE=(TRK,(10,5))`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["SB37", "SD37", "SE37", "S806"],
    answer1: "SB37",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Increase the space parameters in JCL (e.g. SPACE=(CYL,(50,10)) and use RLSE).",
      "Compress the targeted dataset using IEBCOPY.",
      "Declare null indicators for the output fields.",
      "Add a STEPLIB parameter targeting the program loadlib."
    ],
    answer2: "Increase the space parameters in JCL (e.g. SPACE=(CYL,(50,10)) and use RLSE).",
    explanation: "The system completion code B37 indicates volume extent exhaustion. Increasing JCL space parameters and releasing unused tracks (RLSE) handles the large volume export safely."
  },
  {
    id: 3,
    title: "Financial Ledger Database Write Error",
    log: `DSNT408I SQLCODE = -305, ERROR: THE NOT NULL CONSTRAINT IS VIOLATED OR A NULL VALUE IS RETRIEVED INTO A HOST VARIABLE WITHOUT AN INDICATOR VARIABLE
DSNT418I SQLSTATE = 22002, DB2 SUB-SYSTEM=DB2P
PROGRAM CODE ERROR POINT:
EXEC SQL
    SELECT EMAIL INTO :WS-EMAIL FROM USERS WHERE USER_ID = :WS-ID
END-EXEC.`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -305", "SQLCODE -818", "SQLCODE -904", "SQLCODE -911"],
    answer1: "SQLCODE -305",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Declare a 2-byte binary host variable (PIC S9(4) COMP) and bind it as a null-indicator.",
      "Execute the BIND PACKAGE step to update consistency tokens.",
      "Switch lock granularity from tablespace level to row level.",
      "Add a CALL ... USING statement to map working-storage variables."
    ],
    answer2: "Declare a 2-byte binary host variable (PIC S9(4) COMP) and bind it as a null-indicator.",
    explanation: "SQLCODE -305 occurs when DB2 returns a NULL value into a host variable that has no null-indicator variable defined. Adding a 2-byte COMP variable captures this safely."
  },
  {
    id: 4,
    title: "Dev Compile Output File Blocked",
    log: `IEC032I E37-04,IFG0554P,DEVJOB,COMPILE,SYSLMOD,3390,DEV002,DEV.PROJECT.LOADLIB
IEF472I DEVJOB COMPILE - COMPLETION CODE - SYSTEM=E37
JCL CARD REFERENCE:
//SYSLMOD  DD DSN=DEV.PROJECT.LOADLIB(PAYROLL),DISP=SHR
*** ALL DIRECTORY BLOCKS ARE FULL ***`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["SE37", "SD37", "SB37", "S0C4"],
    answer1: "SE37",
    question2: "What is the most modern architectural solution to prevent this permanently?",
    options2: [
      "Migrate the PDS dataset to PDSE format by specifying DSNTYPE=LIBRARY in JCL.",
      "Add a compression step using IEBCOPY utility with COND=EVEN.",
      "Change JCL disposition from SHR to MOD.",
      "Double the volume capacity limit using UNIT=(SYSDA,2)."
    ],
    answer2: "Migrate the PDS dataset to PDSE format by specifying DSNTYPE=LIBRARY in JCL.",
    explanation: "An SE37 indicates PDS directory blocks exhaustion. Migrating to PDSE (DSNTYPE=LIBRARY) manages directory allocation dynamically, bypassing directory block limits."
  }
];

export const AbendSolver = () => {
  const [selectedCode, setSelectedCode] = useState(abendsData[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  // Simulator State
  const [simIndex, setSimIndex] = useState(0);
  const [simAnswer1, setSimAnswer1] = useState(null);
  const [simAnswer2, setSimAnswer2] = useState(null);
  const [simChecked, setSimChecked] = useState(false);
  const [simResult, setSimResult] = useState(null); // 'success' or 'fail'
  const [score, setScore] = useState(0);
  const [checklist, setChecklist] = useState({});

  const filteredAbends = abendsData.filter(item => {
    const matchesSearch = item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectCode = (item) => {
    setSelectedCode(item);
    setChecklist({});
  };

  const handleCheckSim = () => {
    const scenario = SIMULATOR_SCENARIOS[simIndex];
    if (simAnswer1 === scenario.answer1 && simAnswer2 === scenario.answer2) {
      setSimResult('success');
      setScore(prev => prev + 10);
    } else {
      setSimResult('fail');
    }
    setSimChecked(true);
  };

  const handleNextScenario = () => {
    setSimIndex(prev => (prev + 1) % SIMULATOR_SCENARIOS.length);
    setSimAnswer1(null);
    setSimAnswer2(null);
    setSimChecked(false);
    setSimResult(null);
  };

  const toggleChecklist = (idx) => {
    setChecklist(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="workspace-grid" style={{ display: 'flex', gap: '1.5rem', minHeight: 'calc(100vh - 140px)', flexWrap: 'wrap' }}>
      
      {/* LEFT PANEL - LOOKUP LIST */}
      <div className="card-panel" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '720px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 className="section-title" style={{ margin: 0 }}>🚨 ABEND SOLVER</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Lookup standard mainframe system codes, database errors, and debug production crashes.
          </p>
        </div>

        {/* SEARCH */}
        <input 
          type="text" 
          placeholder="Search Abend code or title..." 
          className="search-input" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-muted)', background: 'rgba(0,0,0,0.2)' }}
        />

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`badge ${activeCategory === cat ? 'badge-primary' : ''}`}
              style={{ 
                cursor: 'pointer', 
                border: 'none', 
                padding: '0.3rem 0.6rem', 
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)' 
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {filteredAbends.map(item => (
            <button
              key={item.code}
              onClick={() => handleSelectCode(item)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                background: selectedCode.code === item.code ? 'rgba(var(--accent-rgb), 0.1)' : 'rgba(255,255,255,0.02)',
                border: '1px solid',
                borderColor: selectedCode.code === item.code ? 'var(--accent-color)' : 'var(--border-muted)',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '0.9rem', color: 'var(--accent-color)' }}>
                  {item.code}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {item.title}
                </div>
              </div>
              <span style={{ 
                fontSize: '0.6rem', 
                fontFamily: 'var(--font-mono)', 
                color: SEVERITY_COLORS[item.severity],
                border: `1px solid ${SEVERITY_COLORS[item.severity]}44`,
                padding: '0.1rem 0.3rem',
                borderRadius: '4px'
              }}>
                {item.category.toUpperCase()}
              </span>
            </button>
          ))}
          {filteredAbends.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              NO CODES MATCHING SEARCH.
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE PANEL - CODE DETAILS */}
      <div className="card-panel" style={{ flex: '2 2 500px', display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '720px', overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid var(--border-muted)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>⚡</span>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', fontSize: '1.6rem', color: 'var(--text-primary)', margin: 0 }}>
                {selectedCode.code}
              </h2>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '700', marginTop: '0.2rem' }}>
              {selectedCode.title}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ 
              fontSize: '0.7rem', 
              fontFamily: 'var(--font-mono)', 
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-muted)',
              padding: '0.25rem 0.6rem',
              borderRadius: '4px',
              color: 'var(--text-secondary)'
            }}>
              CATEGORY: {selectedCode.category.toUpperCase()}
            </span>
            <span style={{ 
              fontSize: '0.7rem', 
              fontFamily: 'var(--font-mono)', 
              background: `${SEVERITY_COLORS[selectedCode.severity]}22`,
              border: `1px solid ${SEVERITY_COLORS[selectedCode.severity]}66`,
              padding: '0.25rem 0.6rem',
              borderRadius: '4px',
              color: SEVERITY_COLORS[selectedCode.severity],
              fontWeight: '700'
            }}>
              {selectedCode.severity}
            </span>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Description</h4>
          <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            {selectedCode.description}
          </p>
        </div>

        {/* DIAGNOSTIC CHECKLIST */}
        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-muted)' }}>
          <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-color)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🔍</span> DIAGNOSTIC CHECKLIST (Trace Your Incident)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {selectedCode.causes.map((cause, idx) => (
              <label 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  gap: '0.6rem', 
                  fontSize: '0.8rem', 
                  color: checklist[idx] ? 'var(--text-secondary)' : 'var(--text-primary)', 
                  cursor: 'pointer',
                  textDecoration: checklist[idx] ? 'line-through' : 'none',
                  alignItems: 'flex-start'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={!!checklist[idx]} 
                  onChange={() => toggleChecklist(idx)} 
                  style={{ marginTop: '0.15rem', accentColor: 'var(--accent-color)' }}
                />
                <span>{cause}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RESOLUTION PLAN */}
        <div>
          <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>🔧 Step-by-Step Resolution Plan</h4>
          <div style={{ 
            background: 'var(--console-bg, #050b05)', 
            border: '1px solid rgba(var(--accent-rgb), 0.3)', 
            padding: '1rem', 
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--accent-color)',
            lineHeight: '1.6',
            whiteSpace: 'pre-line'
          }}>
            {selectedCode.fix}
          </div>
        </div>

        {/* ARCHITECT PRO TIP */}
        <div style={{ background: 'rgba(255,170,0,0.06)', borderLeft: '4px solid #ffaa00', padding: '0.8rem 1rem', borderRadius: '0 6px 6px 0' }}>
          <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#ffaa00', fontWeight: '800', marginBottom: '0.2rem', letterSpacing: '1px' }}>
            ◈ ARCHITECT SECURE PIPELINE DESIGN TIP
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            {selectedCode.proTip}
          </div>
        </div>

        {/* CODE BLOCK */}
        <div>
          <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>💻 Related Code Snippet Reference</h4>
          <pre style={{ 
            background: 'rgba(0,0,0,0.4)', 
            padding: '1rem', 
            borderRadius: '6px', 
            border: '1px solid var(--border-muted)', 
            overflowX: 'auto',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            color: '#a9b7c6',
            lineHeight: '1.5'
          }}>
            <code>{selectedCode.snippet}</code>
          </pre>
        </div>
      </div>

      {/* BOTTOM/RIGHT INTERACTIVE SIMULATOR */}
      <div className="card-panel" style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '1.2rem', background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(var(--accent-rgb), 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📟</span> SYS1.LOG DISPATCHER — INCIDENT DEBUGGER
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Analyze mainframe production failure reports, isolate abend codes, and resolve outages.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              REPAIR SCORE: <span style={{ color: 'var(--accent-color)', fontWeight: '800' }}>{score} XP</span>
            </span>
            <button 
              onClick={() => { setScore(0); setSimIndex(0); setSimAnswer1(null); setSimAnswer2(null); setSimChecked(false); setSimResult(null); }}
              className="font-scale-btn" 
              style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}
              title="Reset Simulator Stats"
            >
              RESET
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          
          {/* SIM LOG OUTPUT */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              SYSTEM DUMP OUTLET (JES2/CEEDUMP Logs):
            </div>
            <pre style={{ 
              background: '#040804', 
              color: '#39ff14', 
              padding: '1rem', 
              borderRadius: '6px', 
              border: '1px solid rgba(57,255,20,0.25)', 
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              lineHeight: '1.4',
              overflowX: 'auto',
              minHeight: '180px'
            }}>
              <code>{SIMULATOR_SCENARIOS[simIndex].log}</code>
            </pre>
          </div>

          {/* QUESTIONS PANEL */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* QUESTION 1 */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                Q1: {SIMULATOR_SCENARIOS[simIndex].question1}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.4rem' }}>
                {SIMULATOR_SCENARIOS[simIndex].options1.map(opt => (
                  <button
                    key={opt}
                    disabled={simChecked}
                    onClick={() => setSimAnswer1(opt)}
                    style={{
                      padding: '0.5rem',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      background: simAnswer1 === opt ? 'rgba(var(--accent-rgb), 0.15)' : 'rgba(255,255,255,0.03)',
                      border: '1px solid',
                      borderColor: simAnswer1 === opt ? 'var(--accent-color)' : 'var(--border-muted)',
                      borderRadius: '4px',
                      color: simAnswer1 === opt ? 'var(--accent-color)' : 'var(--text-primary)',
                      cursor: simChecked ? 'not-allowed' : 'pointer',
                      transition: 'all 0.1s'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* QUESTION 2 */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                Q2: {SIMULATOR_SCENARIOS[simIndex].question2}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {SIMULATOR_SCENARIOS[simIndex].options2.map(opt => (
                  <button
                    key={opt}
                    disabled={simChecked}
                    onClick={() => setSimAnswer2(opt)}
                    style={{
                      padding: '0.6rem 0.8rem',
                      fontSize: '0.78rem',
                      textAlign: 'left',
                      background: simAnswer2 === opt ? 'rgba(var(--accent-rgb), 0.12)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: simAnswer2 === opt ? 'var(--accent-color)' : 'var(--border-muted)',
                      borderRadius: '4px',
                      color: simAnswer2 === opt ? 'var(--accent-color)' : 'var(--text-primary)',
                      cursor: simChecked ? 'not-allowed' : 'pointer',
                      transition: 'all 0.1s'
                    }}
                  >
                    ◈ {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS & OUTCOMES */}
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!simChecked ? (
                  <button
                    onClick={handleCheckSim}
                    disabled={!simAnswer1 || !simAnswer2}
                    className="action-btn"
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.78rem', opacity: (!simAnswer1 || !simAnswer2) ? 0.5 : 1 }}
                  >
                    🔧 VERIFY REPAIR
                  </button>
                ) : (
                  <button
                    onClick={handleNextScenario}
                    className="action-btn"
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.78rem', background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    ⏩ NEXT INCIDENT
                  </button>
                )}
              </div>

              {simChecked && simResult === 'success' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00ff41', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: '800' }}>
                  <span>✓</span> CRASH RESOLVED! +10 XP
                </div>
              )}

              {simChecked && simResult === 'fail' && (
                <div style={{ color: '#ff4444', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: '800' }}>
                  <span>✗</span> DIAGNOSIS INCORRECT. RETRY INCIDENT.
                </div>
              )}
            </div>

            {/* SIM EXPLANATION */}
            {simChecked && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-muted)', padding: '0.8rem', borderRadius: '6px', fontSize: '0.78rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
                <strong>Incident Review:</strong> {SIMULATOR_SCENARIOS[simIndex].explanation}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
