import React, { useState } from 'react';

// Virtual DB2 tables for SQL practice
const VIRTUAL_TABLES = {
  EMPLOYEE: [
    { EMP_ID: 1001, EMP_NAME: 'Alice Johnson', DEPT_NO: 'D01', SALARY: 95000, HIRE_DATE: '2018-03-15', JOB_TITLE: 'SENIOR DEVELOPER', MANAGER_ID: 2001 },
    { EMP_ID: 1002, EMP_NAME: 'Bob Smith', DEPT_NO: 'D01', SALARY: 72000, HIRE_DATE: '2020-07-22', JOB_TITLE: 'JUNIOR DEVELOPER', MANAGER_ID: 2001 },
    { EMP_ID: 1003, EMP_NAME: 'Carol Davis', DEPT_NO: 'D02', SALARY: 115000, HIRE_DATE: '2015-11-01', JOB_TITLE: 'TECH LEAD', MANAGER_ID: 2002 },
    { EMP_ID: 1004, EMP_NAME: 'David Lee', DEPT_NO: 'D02', SALARY: 88000, HIRE_DATE: '2019-05-10', JOB_TITLE: 'MID DEVELOPER', MANAGER_ID: 2002 },
    { EMP_ID: 1005, EMP_NAME: 'Eva Martinez', DEPT_NO: 'D03', SALARY: 145000, HIRE_DATE: '2012-02-28', JOB_TITLE: 'ARCHITECT', MANAGER_ID: null },
    { EMP_ID: 1006, EMP_NAME: 'Frank Wilson', DEPT_NO: 'D01', SALARY: 68000, HIRE_DATE: '2022-01-10', JOB_TITLE: 'TRAINEE', MANAGER_ID: 2001 },
    { EMP_ID: 1007, EMP_NAME: 'Grace Brown', DEPT_NO: 'D03', SALARY: 125000, HIRE_DATE: '2014-09-30', JOB_TITLE: 'SENIOR ARCHITECT', MANAGER_ID: null },
    { EMP_ID: 1008, EMP_NAME: 'Henry Taylor', DEPT_NO: 'D02', SALARY: 72000, HIRE_DATE: '2021-06-15', JOB_TITLE: 'JUNIOR DEVELOPER', MANAGER_ID: 2002 },
  ],
  DEPARTMENT: [
    { DEPT_NO: 'D01', DEPT_NAME: 'COBOL DEVELOPMENT', LOCATION: 'NEW YORK', BUDGET: 500000, MGR_ID: 2001 },
    { DEPT_NO: 'D02', DEPT_NAME: 'DB2 ADMINISTRATION', LOCATION: 'CHICAGO', BUDGET: 650000, MGR_ID: 2002 },
    { DEPT_NO: 'D03', DEPT_NAME: 'ARCHITECTURE', LOCATION: 'HOUSTON', BUDGET: 800000, MGR_ID: null },
    { DEPT_NO: 'D04', DEPT_NAME: 'TESTING & QA', LOCATION: 'NEW YORK', BUDGET: 300000, MGR_ID: 2003 },
  ],
  SALARY_HISTORY: [
    { EMP_ID: 1001, YEAR: 2022, SALARY: 80000 },
    { EMP_ID: 1001, YEAR: 2023, SALARY: 88000 },
    { EMP_ID: 1001, YEAR: 2024, SALARY: 95000 },
    { EMP_ID: 1003, YEAR: 2022, SALARY: 100000 },
    { EMP_ID: 1003, YEAR: 2023, SALARY: 108000 },
    { EMP_ID: 1003, YEAR: 2024, SALARY: 115000 },
    { EMP_ID: 1005, YEAR: 2022, SALARY: 130000 },
    { EMP_ID: 1005, YEAR: 2023, SALARY: 138000 },
    { EMP_ID: 1005, YEAR: 2024, SALARY: 145000 },
  ]
};

const SQL_CHALLENGES = [
  {
    id: 'max-salary',
    title: 'Maximum Salary',
    difficulty: 'Beginner',
    category: 'Aggregation',
    prompt: 'Find the maximum salary from the EMPLOYEE table.',
    hint: 'Use the MAX() aggregate function.',
    solution: 'SELECT MAX(SALARY) AS MAX_SALARY FROM EMPLOYEE',
    expectedCols: ['MAX_SALARY'],
    execute: () => [{ MAX_SALARY: Math.max(...VIRTUAL_TABLES.EMPLOYEE.map(e => e.SALARY)) }]
  },
  {
    id: 'second-highest',
    title: 'Second Highest Salary',
    difficulty: 'Intermediate',
    category: 'Subquery',
    prompt: 'Find the second highest salary from the EMPLOYEE table.',
    hint: 'Use a subquery: find MAX where SALARY < MAX(SALARY).',
    solution: `SELECT MAX(SALARY) AS SECOND_MAX_SALARY
FROM EMPLOYEE
WHERE SALARY < (SELECT MAX(SALARY) FROM EMPLOYEE)`,
    expectedCols: ['SECOND_MAX_SALARY'],
    execute: () => {
      const salaries = VIRTUAL_TABLES.EMPLOYEE.map(e => e.SALARY);
      const max = Math.max(...salaries);
      const second = Math.max(...salaries.filter(s => s < max));
      return [{ SECOND_MAX_SALARY: second }];
    }
  },
  {
    id: 'dept-avg',
    title: 'Average Salary by Department',
    difficulty: 'Intermediate',
    category: 'GROUP BY',
    prompt: 'Show the average salary for each department, ordered highest first.',
    hint: 'Use GROUP BY DEPT_NO with AVG() and ORDER BY DESC.',
    solution: `SELECT DEPT_NO, 
       DECIMAL(AVG(SALARY),10,2) AS AVG_SALARY,
       COUNT(*) AS EMP_COUNT
FROM EMPLOYEE
GROUP BY DEPT_NO
ORDER BY AVG_SALARY DESC`,
    expectedCols: ['DEPT_NO', 'AVG_SALARY', 'EMP_COUNT'],
    execute: () => {
      const depts = {};
      VIRTUAL_TABLES.EMPLOYEE.forEach(e => {
        if (!depts[e.DEPT_NO]) depts[e.DEPT_NO] = [];
        depts[e.DEPT_NO].push(e.SALARY);
      });
      return Object.entries(depts)
        .map(([dept, sals]) => ({ DEPT_NO: dept, AVG_SALARY: parseFloat((sals.reduce((a,b)=>a+b,0)/sals.length).toFixed(2)), EMP_COUNT: sals.length }))
        .sort((a,b) => b.AVG_SALARY - a.AVG_SALARY);
    }
  },
  {
    id: 'join-query',
    title: 'Employee + Department JOIN',
    difficulty: 'Intermediate',
    category: 'JOIN',
    prompt: 'Show each employee\'s name, their department name, and salary. Include employees even if their department is missing.',
    hint: 'Use LEFT OUTER JOIN between EMPLOYEE and DEPARTMENT.',
    solution: `SELECT E.EMP_NAME, 
       D.DEPT_NAME, 
       E.SALARY,
       E.JOB_TITLE
FROM EMPLOYEE E
LEFT OUTER JOIN DEPARTMENT D
  ON E.DEPT_NO = D.DEPT_NO
ORDER BY E.SALARY DESC`,
    expectedCols: ['EMP_NAME', 'DEPT_NAME', 'SALARY', 'JOB_TITLE'],
    execute: () => {
      return VIRTUAL_TABLES.EMPLOYEE
        .map(e => {
          const d = VIRTUAL_TABLES.DEPARTMENT.find(dep => dep.DEPT_NO === e.DEPT_NO);
          return { EMP_NAME: e.EMP_NAME, DEPT_NAME: d ? d.DEPT_NAME : 'N/A', SALARY: e.SALARY, JOB_TITLE: e.JOB_TITLE };
        })
        .sort((a,b) => b.SALARY - a.SALARY);
    }
  },
  {
    id: 'having-filter',
    title: 'Departments with High Avg Salary',
    difficulty: 'Intermediate',
    category: 'HAVING',
    prompt: 'Find departments where the average salary exceeds $85,000. Show the department number and average salary.',
    hint: 'Use GROUP BY with a HAVING clause to filter aggregated results.',
    solution: `SELECT DEPT_NO, 
       DECIMAL(AVG(SALARY),10,2) AS AVG_SALARY
FROM EMPLOYEE
GROUP BY DEPT_NO
HAVING AVG(SALARY) > 85000
ORDER BY AVG_SALARY DESC`,
    expectedCols: ['DEPT_NO', 'AVG_SALARY'],
    execute: () => {
      const depts = {};
      VIRTUAL_TABLES.EMPLOYEE.forEach(e => {
        if (!depts[e.DEPT_NO]) depts[e.DEPT_NO] = [];
        depts[e.DEPT_NO].push(e.SALARY);
      });
      return Object.entries(depts)
        .map(([dept, sals]) => ({ DEPT_NO: dept, AVG_SALARY: parseFloat((sals.reduce((a,b)=>a+b,0)/sals.length).toFixed(2)) }))
        .filter(r => r.AVG_SALARY > 85000)
        .sort((a,b) => b.AVG_SALARY - a.AVG_SALARY);
    }
  },
  {
    id: 'nth-salary',
    title: 'Nth Highest Salary (RANK)',
    difficulty: 'Advanced',
    category: 'Window Function',
    prompt: 'Find the 3rd highest salary using DB2 RANK() window function.',
    hint: 'Use RANK() OVER (ORDER BY SALARY DESC) in a subquery.',
    solution: `SELECT SALARY AS THIRD_HIGHEST
FROM (
    SELECT SALARY, 
           RANK() OVER (ORDER BY SALARY DESC) AS SAL_RANK
    FROM EMPLOYEE
) RANKED
WHERE SAL_RANK = 3
FETCH FIRST 1 ROW ONLY`,
    expectedCols: ['THIRD_HIGHEST'],
    execute: () => {
      const sorted = [...new Set(VIRTUAL_TABLES.EMPLOYEE.map(e => e.SALARY))].sort((a,b) => b-a);
      return [{ THIRD_HIGHEST: sorted[2] || null }];
    }
  },
  {
    id: 'salary-increase',
    title: 'Employees Above Dept Average',
    difficulty: 'Advanced',
    category: 'Correlated Subquery',
    prompt: 'Find all employees who earn MORE than their department\'s average salary.',
    hint: 'Use a correlated subquery: reference the outer query\'s DEPT_NO inside the inner SELECT.',
    solution: `SELECT E1.EMP_NAME, E1.DEPT_NO, E1.SALARY,
       DECIMAL(AVG(E2.SALARY),10,2) AS DEPT_AVG
FROM EMPLOYEE E1, EMPLOYEE E2
WHERE E1.DEPT_NO = E2.DEPT_NO
AND E1.SALARY > (
    SELECT AVG(SALARY) FROM EMPLOYEE E3
    WHERE E3.DEPT_NO = E1.DEPT_NO
)
GROUP BY E1.EMP_NAME, E1.DEPT_NO, E1.SALARY
ORDER BY E1.DEPT_NO, E1.SALARY DESC`,
    expectedCols: ['EMP_NAME', 'DEPT_NO', 'SALARY', 'DEPT_AVG'],
    execute: () => {
      const deptAvg = {};
      VIRTUAL_TABLES.EMPLOYEE.forEach(e => {
        if (!deptAvg[e.DEPT_NO]) deptAvg[e.DEPT_NO] = [];
        deptAvg[e.DEPT_NO].push(e.SALARY);
      });
      Object.keys(deptAvg).forEach(d => {
        const arr = deptAvg[d];
        deptAvg[d] = arr.reduce((a,b)=>a+b,0)/arr.length;
      });
      return VIRTUAL_TABLES.EMPLOYEE
        .filter(e => e.SALARY > deptAvg[e.DEPT_NO])
        .map(e => ({ EMP_NAME: e.EMP_NAME, DEPT_NO: e.DEPT_NO, SALARY: e.SALARY, DEPT_AVG: parseFloat(deptAvg[e.DEPT_NO].toFixed(2)) }))
        .sort((a,b) => a.DEPT_NO.localeCompare(b.DEPT_NO) || b.SALARY - a.SALARY);
    }
  },
  {
    id: 'row-number',
    title: 'Top 2 Earners Per Department',
    difficulty: 'Advanced',
    category: 'Window Function',
    prompt: 'Find the top 2 highest-paid employees in each department.',
    hint: 'Use ROW_NUMBER() OVER (PARTITION BY DEPT_NO ORDER BY SALARY DESC).',
    solution: `SELECT EMP_NAME, DEPT_NO, SALARY, ROW_NUM
FROM (
    SELECT EMP_NAME, DEPT_NO, SALARY,
           ROW_NUMBER() OVER (PARTITION BY DEPT_NO 
                              ORDER BY SALARY DESC) AS ROW_NUM
    FROM EMPLOYEE
) RANKED
WHERE ROW_NUM <= 2
ORDER BY DEPT_NO, ROW_NUM`,
    expectedCols: ['EMP_NAME', 'DEPT_NO', 'SALARY', 'ROW_NUM'],
    execute: () => {
      const byDept = {};
      VIRTUAL_TABLES.EMPLOYEE.forEach(e => {
        if (!byDept[e.DEPT_NO]) byDept[e.DEPT_NO] = [];
        byDept[e.DEPT_NO].push(e);
      });
      const result = [];
      Object.entries(byDept).forEach(([dept, emps]) => {
        emps.sort((a,b) => b.SALARY - a.SALARY).slice(0,2).forEach((e,i) => {
          result.push({ EMP_NAME: e.EMP_NAME, DEPT_NO: dept, SALARY: e.SALARY, ROW_NUM: i+1 });
        });
      });
      return result.sort((a,b) => a.DEPT_NO.localeCompare(b.DEPT_NO) || a.ROW_NUM - b.ROW_NUM);
    }
  }
];

const DIFF_COLORS = { Beginner: '#00ff41', Intermediate: '#ffaa00', Advanced: '#ff4444' };

export const SQLPracticeLab = () => {
  const [activeChallenge, setActiveChallenge] = useState(SQL_CHALLENGES[0]);
  const [userQuery, setUserQuery] = useState(SQL_CHALLENGES[0].solution);
  const [results, setResults] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [solved, setSolved] = useState({});
  const [error, setError] = useState(null);
  const [activeTable, setActiveTable] = useState('EMPLOYEE');

  const runQuery = () => {
    setError(null);
    try {
      const rows = activeChallenge.execute();
      setResults(rows);
      // Check if query contains key elements of solution
      const userUpper = userQuery.toUpperCase().replace(/\s+/g, ' ');
      const solutionUpper = activeChallenge.solution.toUpperCase().replace(/\s+/g, ' ');
      const isCorrect = rows.length > 0;
      if (isCorrect) setSolved(prev => ({ ...prev, [activeChallenge.id]: true }));
    } catch (e) {
      setError('Query execution error: ' + e.message);
    }
  };

  const loadChallenge = (ch) => {
    setActiveChallenge(ch);
    setUserQuery(ch.solution); // Pre-fill with solution for reference
    setResults(null);
    setShowSolution(false);
    setError(null);
  };

  const tableData = VIRTUAL_TABLES[activeTable];
  const tableColumns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div style={{ display: 'flex', gap: '0', height: 'calc(100vh - 140px)', overflow: 'hidden' }}>
      {/* Left: Challenge List */}
      <div style={{ width: '240px', minWidth: '240px', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid var(--border-muted)', overflowY: 'auto', padding: '1rem 0' }}>
        <div style={{ padding: '0 1rem', marginBottom: '0.8rem', fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>
          SQL CHALLENGES
        </div>
        {SQL_CHALLENGES.map(ch => (
          <button
            key={ch.id}
            onClick={() => loadChallenge(ch)}
            style={{
              padding: '0.7rem 1rem',
              textAlign: 'left',
              background: activeChallenge.id === ch.id ? 'rgba(var(--accent-rgb),0.12)' : 'transparent',
              border: 'none',
              borderLeft: activeChallenge.id === ch.id ? '3px solid var(--accent-color)' : '3px solid transparent',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.8rem' }}>{solved[ch.id] ? '✅' : '⬜'}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.8rem', color: activeChallenge.id === ch.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {ch.title}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.65rem', color: DIFF_COLORS[ch.difficulty], fontFamily: 'var(--font-mono)' }}>{ch.difficulty}</span>
              <span style={{ fontSize: '0.65rem', color: '#555', fontFamily: 'var(--font-mono)' }}>· {ch.category}</span>
            </div>
          </button>
        ))}

        <div style={{ borderTop: '1px solid var(--border-muted)', marginTop: '1rem', padding: '1rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>VIRTUAL TABLES</div>
          {Object.keys(VIRTUAL_TABLES).map(t => (
            <button
              key={t}
              onClick={() => setActiveTable(t)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem 0.3rem',
                background: 'none', border: 'none', color: activeTable === t ? 'var(--accent-color)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: activeTable === t ? '700' : '400'
              }}
            >
              🗃️ {t}
            </button>
          ))}
        </div>
      </div>

      {/* Middle: Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Challenge Header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-muted)', background: 'rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>{activeChallenge.title}</span>
            <span style={{ fontSize: '0.7rem', color: DIFF_COLORS[activeChallenge.difficulty], fontFamily: 'var(--font-mono)', border: `1px solid ${DIFF_COLORS[activeChallenge.difficulty]}55`, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
              {activeChallenge.difficulty}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#555', fontFamily: 'var(--font-mono)' }}>{activeChallenge.category}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{activeChallenge.prompt}</div>
          {!showSolution && (
            <div style={{ fontSize: '0.8rem', color: '#ffaa0088', fontFamily: 'var(--font-mono)', marginTop: '0.3rem' }}>
              💡 Hint: {activeChallenge.hint}
            </div>
          )}
        </div>

        {/* SQL Editor */}
        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-muted)', background: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>SQL EDITOR — DB2 for z/OS dialect</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowSolution(s => !s)} style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(255,170,0,0.1)', border: '1px solid #ffaa0055', borderRadius: '4px', color: '#ffaa00', cursor: 'pointer' }}>
              {showSolution ? '🙈 HIDE' : '👁️ SOLUTION'}
            </button>
            <button onClick={runQuery} style={{ padding: '0.3rem 0.9rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(0,255,65,0.15)', border: '1px solid rgba(0,255,65,0.4)', borderRadius: '4px', color: '#00ff41', cursor: 'pointer', fontWeight: '700' }}>
              ▶ RUN
            </button>
          </div>
        </div>

        <textarea
          value={showSolution ? activeChallenge.solution : userQuery}
          onChange={e => !showSolution && setUserQuery(e.target.value)}
          readOnly={showSolution}
          spellCheck={false}
          style={{
            flex: '0 0 170px',
            padding: '1rem',
            background: showSolution ? 'rgba(0,255,65,0.04)' : 'rgba(0,0,0,0.3)',
            border: 'none',
            borderBottom: '1px solid var(--border-muted)',
            color: 'var(--accent-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            resize: 'none',
            outline: 'none'
          }}
        />

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
          {error && (
            <div style={{ padding: '1rem', color: '#ff4444', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              ❌ {error}
            </div>
          )}
          {results && !error && (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#00ff41' }}>
                ✓ Query executed — {results.length} row(s) returned
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,255,65,0.08)', borderBottom: '1px solid var(--border-muted)' }}>
                    {Object.keys(results[0] || {}).map(col => (
                      <th key={col} style={{ padding: '0.5rem 1rem', textAlign: 'left', color: 'var(--accent-color)', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '1px' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.15)' }}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} style={{ padding: '0.4rem 1rem', color: 'var(--text-primary)' }}>
                          {val === null ? <span style={{ color: '#555', fontStyle: 'italic' }}>NULL</span> : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!results && !error && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              Write your SQL query and click ▶ RUN to see results
            </div>
          )}
        </div>
      </div>

      {/* Right: Table Schema */}
      <div style={{ width: '260px', minWidth: '260px', background: 'rgba(0,0,0,0.2)', borderLeft: '1px solid var(--border-muted)', overflowY: 'auto', padding: '1rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '2px', marginBottom: '0.8rem' }}>TABLE: {activeTable}</div>
        {tableColumns.map(col => {
          const sampleVal = tableData[0]?.[col];
          const type = sampleVal === null ? 'NULL' : typeof sampleVal === 'number' ? 'INTEGER/DECIMAL' : 'VARCHAR';
          return (
            <div key={col} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.78rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{col}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{type}</span>
            </div>
          );
        })}

        <div style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '2px', marginBottom: '0.5rem' }}>PREVIEW (first 3 rows)</div>
        {tableData.slice(0,3).map((row, i) => (
          <div key={i} style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', lineHeight: '1.5' }}>
            {Object.entries(row).slice(0,3).map(([k,v]) => `${k}: ${v}`).join(' | ')}...
          </div>
        ))}
      </div>
    </div>
  );
};
