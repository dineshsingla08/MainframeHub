import React, { useState } from 'react';
import { Icon } from './Icon';

const INITIAL_BLOGS = [
  {
    id: 1,
    title: 'The Future of COBOL in 2026',
    author: 'Dinesh Singla',
    date: 'Jun 01, 2026',
    tags: ['COBOL', 'Modernization'],
    summary: 'Why COBOL remains the backbone of the global financial system and how modern tools are bringing it into the DevOps era.',
    content: `COBOL is far from dead. With over 800 billion lines of code still running in production, the focus has shifted entirely from migration to modernization. Modern enterprise infrastructure relies on these systems because of their unparalleled transaction throughput, reliability, and security.

Tools like IBM Z Open Editor, Zowe, and robust CI/CD pipelines are changing how we write and deploy COBOL. You no longer need a green screen emulator to push code; modern developers are writing COBOL in VS Code, pushing to Git, and letting Jenkins or GitHub Actions handle the compile and link-edit phases.

The future is about hybrid cloud integration. We are seeing COBOL logic being exposed as microservices, allowing lightweight cloud front-ends to interface securely with massive, fast data processing backend logic. This guarantees that your core business logic remains rock solid while user experiences stay agile.`
  },
  {
    id: 2,
    title: 'Mastering DB2 Performance Tuning',
    author: 'Dinesh Singla',
    date: 'May 28, 2026',
    tags: ['DB2', 'Performance'],
    summary: 'Top 5 indexing and query design strategies to reduce CPU consumption in heavy DB2 workloads.',
    content: `DB2 performance tuning on z/OS is fundamentally about minimizing I/O and reducing CPU overhead, especially given MLC (Monthly License Charge) cost structures.

First, always use the EXPLAIN plan. Understanding the access path DB2 has chosen for your query is the single most important step. If DB2 is performing a tablespace scan on a billion-row table, your transaction will drag.

Second, clustering indexes are your best friend for sequential reads. Ensuring your data is physically clustered to match your most common access patterns minimizes page fetches.

Third, avoid sort merges on large tables. If DB2 has to sort massive temporary work files (like in an ORDER BY or GROUP BY without an index), the CPU cost is immense. Always ensure your indexes cover your ordering requirements.

Lastly, filter early. Ensure your WHERE clauses are highly selective and place the most restrictive predicates first.`
  },
  {
    id: 3,
    title: 'Demystifying VSAM File Structures',
    author: 'Dinesh Singla',
    date: 'May 15, 2026',
    tags: ['VSAM', 'Storage'],
    summary: 'A deep dive into KSDS, ESDS, RRDS, and LDS. When to use which, and how to define them with IDCAMS.',
    content: `Virtual Storage Access Method (VSAM) is an essential component of mainframe data architecture, handling high-speed data access outside of relational databases like DB2.

**KSDS (Key-Sequenced Data Set)** is the most common. It allows both random and sequential access using a predefined key. Think of it like a hash map mixed with a B-Tree. It uses an Index component and a Data component to rapidly find records.

**ESDS (Entry-Sequenced Data Set)** is purely sequential. Records are added to the end of the dataset, making it perfect for audit logs or transaction journals where chronological order is the only concern.

**RRDS (Relative Record Data Set)** gives you numbered slots. It is excellent for data where the key is a direct integer map (e.g., store numbers from 1 to 500).

Understanding the IDCAMS DEFINE CLUSTER utility is the first step to mastering VSAM. Allocating the right amount of Control Interval (CI) and Control Area (CA) freespace is crucial to prevent performance-killing CI/CA splits.`
  },
  {
    id: 4,
    title: 'Introduction to z/OS Connect',
    author: 'Dinesh Singla',
    date: 'May 10, 2026',
    tags: ['z/OS', 'APIs'],
    summary: 'How to expose your CICS transactions and IMS databases as RESTful APIs.',
    content: `z/OS Connect EE (Enterprise Edition) is fundamentally transforming how distributed applications talk to the mainframe.

Historically, interfacing with CICS or IMS required complex middleware, custom socket programming, or heavy MQ integrations. z/OS Connect simplifies this by acting as an API gateway residing directly on the mainframe. 

It allows mainframe subsystems to participate natively in the API economy. With z/OS Connect, you can map JSON HTTP REST requests directly to COBOL or PL/I copybooks. The tooling generates the necessary bindings so that your COBOL program simply sees standard data structures arriving in its COMMAREA or Container.

This enables web and mobile developers to consume mainframe data seamlessly, without needing to understand EBCDIC encoding or CICS transaction architecture. It significantly speeds up time-to-market for modern digital banking and retail applications.`
  },
  {
    id: 5,
    title: 'CICS Pseudo-Conversational Design',
    author: 'Dinesh Singla',
    date: 'May 02, 2026',
    tags: ['CICS', 'Architecture'],
    summary: 'Why conversational CICS programs are a bad idea and how pseudo-conversational design saves memory.',
    content: `When building interactive terminal applications in CICS, the architectural pattern you choose determines the scalability of your entire system.

In conversational CICS, the transaction is initiated, sends a screen to the user, and then *waits* for the user to type their response. During this waiting period, the task remains active in memory, holding locks and consuming system resources. If 10,000 users go to lunch while a screen is open, your system will crash.

Pseudo-conversational design solves this elegantly. The program sends the screen and immediately terminates (using EXEC CICS RETURN). Before terminating, it saves its state in a COMMAREA or Channel/Container. 

When the user hits ENTER, CICS starts a completely new task, passes the saved state back into the program, and resumes logic. To the user, it looks like a continuous conversation. To the system, it's a highly efficient series of split-second micro-tasks, allowing millions of concurrent users with minimal memory footprint.`
  },
  {
    id: 6,
    title: 'Top 10 JCL Interview Questions',
    author: 'Dinesh Singla',
    date: 'Apr 25, 2026',
    tags: ['JCL', 'Interview'],
    summary: 'The most commonly asked JCL questions in technical interviews and how to answer them.',
    content: `Preparing for a mainframe interview? Job Control Language (JCL) is almost guaranteed to come up. Here are the core areas you must understand deeply:

1. **COND Parameters**: Know how to bypass or execute steps based on the return codes of previous steps. For example, COND=(0,NE) means "if 0 is not equal to the previous return code, bypass this step."

2. **Restarts and Checkpointing**: Explain how to use the RESTART parameter on the JOB card to resume a failed batch job from a specific step without rerunning the entire sequence.

3. **JOBLIB vs STEPLIB**: Be ready to explain the search order for executable modules. STEPLIB applies to a single step and overrides JOBLIB, which applies to the whole job.

4. **GDGs (Generation Data Groups)**: Explain how relative generation numbers work. (+1) creates a new generation, (0) references the current generation.

5. **DISP Parameters**: You must know DISP=(status, normal-disp, abnormal-disp) by heart. Be able to explain the difference between CATLG and KEEP, and when to use PASS.`
  },
  {
    id: 7,
    title: 'Understanding RACF Security',
    author: 'Dinesh Singla',
    date: 'Apr 18, 2026',
    tags: ['RACF', 'Security'],
    summary: 'An overview of Resource Access Control Facility and how it protects mainframe assets.',
    content: `Mainframes are renowned for their impenetrable security, and RACF (Resource Access Control Facility) is the primary engine behind that reputation on z/OS.

RACF operates on a system of Users, Groups, and Resource Profiles. Every time a user attempts to access a dataset, initiate a transaction, or run a program, the System Authorization Facility (SAF) intercepts the request and asks RACF for a decision.

Administrators assign permissions (like READ, UPDATE, ALTER) to user IDs or group IDs against specific resource profiles. The principle of least privilege is heavily enforced.

Understanding UACC (Universal Access Authority) is critical. A secure system sets UACC to NONE for almost all resources, explicitly granting access only where required. Furthermore, RACF can log all access attempts and violations, providing immediate audit trails for compliance with regulations like GDPR, HIPAA, and SOX.`
  },
  {
    id: 8,
    title: 'Mainframe DevOps with Git',
    author: 'Dinesh Singla',
    date: 'Apr 10, 2026',
    tags: ['DevOps', 'Git'],
    summary: 'Moving away from PDS members: How to store COBOL code in Git and deploy via Jenkins.',
    content: `The era of editing code directly in ISPF PDS members is ending. Modern mainframe shops are migrating their source code to Git, bridging the gap between distributed teams and mainframe developers.

By utilizing tools like IBM Dependency Based Build (DBB), developers can push COBOL code to a Git repository like GitHub, GitLab, or Bitbucket. A push event triggers a webhook to a CI/CD orchestrator like Jenkins.

Jenkins then spins up an agent on the z/OS UNIX System Services (USS) environment, fetches the code, runs DBB to resolve copybook dependencies, and automatically compiles and link-edits the load modules.

This transition allows for modern practices like Pull Requests, automated code scanning (via SonarQube), and rigorous unit testing (via ZUnit) before code ever reaches a production environment.`
  },
  {
    id: 9,
    title: 'REXX Scripting for Automation',
    author: 'Dinesh Singla',
    date: 'Apr 05, 2026',
    tags: ['REXX', 'Automation'],
    summary: 'Write your first REXX exec to automate daily TSO/ISPF tasks.',
    content: `REXX (Restructured Extended Executor) is arguably the most powerful scripting language on the mainframe. It is interpreted, highly readable, and deeply integrated into TSO, ISPF, and z/OS batch processing.

If you find yourself performing the same sequence of ISPF panel navigations or dataset allocations every day, REXX can automate it.

You can use REXX to read datasets, allocate files dynamically using TSO ALLOCATE commands, interact with users via SAY and PULL, and even drive complex ISPF dialogs.

A strong system programmer relies heavily on REXX to automate health checks, monitor log files, format system outputs, and handle repetitive administrative tasks. Learning REXX elevates you from a standard developer to a power user.`
  },
  {
    id: 10,
    title: 'The Role of System Programmer',
    author: 'Dinesh Singla',
    date: 'Mar 28, 2026',
    tags: ['Career', 'Sysprog'],
    summary: 'What does a z/OS System Programmer actually do? An inside look at the role.',
    content: `Application developers write the business logic, but System Programmers (Sysprogs) keep the machine running. They are the mechanics and architects of the mainframe ecosystem.

A Sysprog's responsibilities are vast and highly technical. They install and upgrade the z/OS operating system using ServerPacs. They apply PTFs (Program Temporary Fixes) and APARs using SMP/E to patch vulnerabilities and fix bugs.

They are also responsible for tuning the system. Using Workload Manager (WLM), they define performance goals to ensure that critical CICS transactions get CPU priority over low-priority batch jobs.

When a severe system-level abend occurs (like an S0C4 in a core subsystem), the Sysprog is the one analyzing the system dump, reading hexadecimal registers, and communicating with IBM support to resolve the outage. It is a demanding role that requires deep architectural knowledge and a calm demeanor under immense pressure.`
  }
];

export const Blogs = ({ user }) => {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [activeBlogId, setActiveBlogId] = useState(null);
  
  // Admin form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', tags: '', summary: '', content: '' });

  const isAdmin = user && (user.username === 'Dineshsingla08' || user.email === 'dineshsingla08@gmail.com');

  const handleAddBlog = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      title: newBlog.title,
      author: user.username,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      tags: newBlog.tags.split(',').map(t => t.trim()).filter(Boolean),
      summary: newBlog.summary,
      content: newBlog.content
    };
    setBlogs([newEntry, ...blogs]);
    setNewBlog({ title: '', tags: '', summary: '', content: '' });
    setShowAddForm(false);
  };

  const activeBlog = blogs.find(b => b.id === activeBlogId);

  if (activeBlog) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => setActiveBlogId(null)}
          className="action-btn"
          style={{ marginBottom: '2rem', background: 'transparent', border: '1px solid var(--border-muted)', padding: '0.4rem 1rem' }}
        >
          ← BACK TO BLOGS
        </button>

        <article className="metric-card animate-fade-in animate-delay-1" style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {activeBlog.tags.map((tag, i) => (
              <span key={i} style={{ background: 'rgba(var(--accent-rgb), 0.15)', color: 'var(--accent-color)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                {tag}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: '1.2' }}>
            {activeBlog.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-muted)' }}>
            <span>✍️ {activeBlog.author}</span>
            <span>📅 {activeBlog.date}</span>
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {activeBlog.content}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              Blogs
            </h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
              Insights, technical deep-dives, and updates from the mainframe ecosystem.
            </p>
          </div>
          
          {isAdmin && (
            <button 
              className="action-btn"
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ padding: '0.6rem 1.2rem', background: 'var(--accent-color)', color: '#000', fontWeight: 'bold' }}
            >
              {showAddForm ? 'CANCEL' : '➕ CREATE NEW BLOG'}
            </button>
          )}
        </div>

        {/* Admin Form */}
        {isAdmin && showAddForm && (
          <div className="metric-card animate-fade-in" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--accent-color)' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 0, marginBottom: '1.5rem' }}>Admin: Add New Blog</h3>
            <form onSubmit={handleAddBlog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Blog Title"
                value={newBlog.title}
                onChange={e => setNewBlog({...newBlog, title: e.target.value})}
                required
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-muted)', borderRadius: '6px', color: 'white', fontFamily: 'inherit' }}
              />
              <input
                type="text"
                placeholder="Tags (comma separated, e.g. COBOL, Modernization)"
                value={newBlog.tags}
                onChange={e => setNewBlog({...newBlog, tags: e.target.value})}
                required
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-muted)', borderRadius: '6px', color: 'white', fontFamily: 'inherit' }}
              />
              <textarea
                placeholder="Short Summary"
                value={newBlog.summary}
                onChange={e => setNewBlog({...newBlog, summary: e.target.value})}
                required
                rows="2"
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-muted)', borderRadius: '6px', color: 'white', fontFamily: 'inherit' }}
              />
              <textarea
                placeholder="Full Blog Content"
                value={newBlog.content}
                onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                required
                rows="6"
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-muted)', borderRadius: '6px', color: 'white', fontFamily: 'inherit' }}
              />
              <button type="submit" className="action-btn" style={{ background: 'var(--accent-color)', color: '#000', padding: '0.8rem', fontWeight: 'bold' }}>
                PUBLISH BLOG
              </button>
            </form>
          </div>
        )}

        {/* Blogs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {blogs.map((blog, idx) => (
            <div 
              key={blog.id}
              className={`metric-card animate-fade-in`}
              style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', borderTop: '3px solid var(--accent-color)', animationDelay: `${idx * 0.05}s` }}
              onClick={() => setActiveBlogId(blog.id)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {blog.tags.map((tag, i) => (
                  <span key={i} style={{ background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--text-primary)', margin: '0 0 1rem 0', lineHeight: '1.4' }}>
                {blog.title}
              </h3>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.5rem 0', flex: 1 }}>
                {blog.summary}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-muted)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>{blog.author}</span>
                <span>{blog.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
