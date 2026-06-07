import React, { useState } from 'react';
import { Icon } from './Icon';

const DIAGRAM_DATA = {
    cics: {
        title: 'CICS Online Transaction Lifecycle',
        subtitle: 'From user keypress to program invocation and database return.',
        nodes: [
            {
                id: 'terminal',
                label: '1. User Terminal',
                desc: 'The transaction starts at a physical 3270 terminal or a web service request. The user types a 4-character Transaction ID (e.g., "ACCT") and presses ENTER. The terminal sends an input buffer containing the ID and any input data.',
                tips: 'In traditional networks, this used SNA (Systems Network Architecture) protocol, now commonly encapsulated over TCP/IP (TN3270).'
            },
            {
                id: 'pct',
                label: '2. PCT (Program Control Table)',
                desc: 'CICS intercepts the request and performs a lookup in the PCT using the 4-char Transaction ID. The PCT maps the Transaction ID to the corresponding COBOL Program Name (e.g., "ACCT01") and specifies transaction security parameters.',
                tips: 'A missing entry in the PCT results in the notorious "AK31" CICS abend or "transaction not defined" screen.'
            },
            {
                id: 'ppt',
                label: '3. PPT (Processing Program Table)',
                desc: 'Once CICS obtains the Program Name, it checks the PPT. The PPT tracks the program\'s physical location, language (e.g., COBOL, PL/I, Assembler), usage count, and whether the executable binary is currently loaded in the CICS region\'s virtual storage.',
                tips: 'If the program is not in memory, CICS loads it from the DFHRPL library. If the PPT record is disabled, an "AEI0" abend occurs.'
            },
            {
                id: 'program',
                label: '4. Application Program',
                desc: 'The program is executed in a multi-threaded CICS environment. The COBOL program accesses input parameters using the Linkage Section and executes CICS APIs (using EXEC CICS commands) to process business logic.',
                tips: 'Programs must be thread-safe in modern CICS to run concurrently on open TCBs (Task Control Blocks) without blocking the CICS main thread.'
            },
            {
                id: 'commarea',
                label: '5. COMMAREA (Comm. Area)',
                desc: 'The COMMAREA (Communication Area) is a shared memory buffer used to pass state, structures, and business variables between different programs or across sequential transaction steps (pseudo-conversational processing).',
                tips: 'COMMAREA has a maximum size of 32,767 bytes. For larger structures, modern CICS applications use Channels and Containers.'
            },
            {
                id: 'db2',
                label: '6. DB2 / VSAM Storage',
                desc: 'The program interacts with databases (like DB2 via EXEC SQL) or file systems (like VSAM via EXEC CICS READ DATASET). The CICS Attachment Facility coordinates locking and two-phase commit protocols (syncpoints).',
                tips: 'DFHRPL search paths are used to locate data components. Locks are released at CICS Syncpoints or upon task termination.'
            }
        ]
    },
    db2: {
        title: 'DB2 Storage Hierarchy',
        subtitle: 'Logical abstractions mapping down to physical storage allocations.',
        nodes: [
            {
                id: 'stogroup',
                label: 'Storage Group (STOGROUP)',
                desc: 'A collection of physical disk volumes (DASD) defined to DB2. DB2 uses the volumes specified within a STOGROUP to automatically define and allocate physical VSAM datasets for tablespaces and indexes.',
                tips: 'STOGROUPs allow DBAs to group fast SSDs for transactional tables and slower HDDs for historical archival tables.'
            },
            {
                id: 'database',
                label: 'DB2 Database',
                desc: 'A logical grouping of related DB2 tablespaces and indexspaces. It serves as a management unit for authorization, backup operations, and catalog grouping, but does not represent a physical file.',
                tips: 'Commands like START DATABASE and STOP DATABASE act on all underlying tablespaces simultaneously.'
            },
            {
                id: 'tablespace',
                label: 'Tablespace',
                desc: 'The physical VSAM Linear Dataset (LDS) where database tables are stored. Tablespaces are divided into pages (typically 4KB, 8KB, 16KB, or 32KB). A tablespace can hold one or more tables.',
                tips: 'Types include Partitioned (each partition in a separate VSAM file, good for huge tables) and Universal Tablespaces (UTS).'
            },
            {
                id: 'table',
                label: 'Table',
                desc: 'The logical representation of rows and columns. This is what the application code queries via SQL. In DB2, tables are defined inside a Database and allocated within a specific Tablespace.',
                tips: 'Table schema definitions are stored in the DB2 Catalog (system catalog tables like SYSIBM.SYSTABLES).'
            },
            {
                id: 'index',
                label: 'Index & Indexspace',
                desc: 'A physical structure (B-tree) used to accelerate data access. Indexes are stored in their own physical datasets called Indexspaces. An index maps keys to Record IDs (RIDs) pointing directly to data pages.',
                tips: 'A Clustering Index forces DB2 to physically organize table rows in the same order as the index key, drastically reducing page I/O.'
            }
        ]
    },
    vsam: {
        title: 'VSAM KSDS & Tree Splits',
        subtitle: 'Understanding Key Sequenced Data Set structure and performance bottlenecks.',
        nodes: [
            {
                id: 'indexset',
                label: 'Index Set (B-Tree Root)',
                desc: 'The upper levels of the VSAM B-Tree index structure. These nodes guide the VSAM record management system from the root down to the leaf levels. They store high key values and control interval pointers.',
                tips: 'Having an Index Set fully cached in memory is vital for fast direct reads.'
            },
            {
                id: 'sequenceset',
                label: 'Sequence Set (Leaf Nodes)',
                desc: 'The lowest level of the VSAM index. Each Sequence Set record corresponds to a Control Area (CA) and contains pointers to every Control Interval (CI) in that CA. Sequence Set nodes are linked horizontally for fast sequential scanning.',
                tips: 'Sequence set records contain index entries for the highest keys in each Control Interval.'
            },
            {
                id: 'controlarea',
                label: 'Control Area (CA)',
                desc: 'A logical unit of physical space that contains multiple Control Intervals. When a VSAM dataset is created, it is allocated in units of Control Areas (often size of 1 cylinder). Track allocations are grouped here.',
                tips: 'A CA Split is triggered when a CI split is needed but there are no free Control Intervals left in that entire Control Area.'
            },
            {
                id: 'controlinterval',
                label: 'Control Interval (CI)',
                desc: 'The basic unit of physical I/O transfer in VSAM, containing data records, free space, and control information (RDFs and CIDFs). Common CI sizes are 2KB, 4KB, or 8KB.',
                tips: 'When a record is inserted into a full CI, a CI Split occurs: VSAM moves half the records to a free CI in the same CA.'
            },
            {
                id: 'freespace',
                label: 'Free Space (FSPC)',
                desc: 'Unallocated space intentionally reserved inside Control Intervals (CI) and Control Areas (CA) at creation time (specified as percentages, e.g. FREESPACE(15, 10)). It allows direct inserts without immediate splits.',
                tips: 'High split counts indicate a need to run the IDCAMS REORG (REPRO/DELETE/DEFINE/REPRO) to restore free space and optimize performance.'
            }
        ]
    },
    devops: {
        title: 'z/OS Hybrid Cloud & DevOps Pipeline',
        subtitle: 'From local Git commit to automated mainframe compilation, deployment, and REST API exposure.',
        nodes: [
            {
                id: 'git',
                label: '1. Git Repository',
                desc: 'Developers commit COBOL and JCL source code changes to a centralized Git repository (like GitHub/GitLab). Pre-commit hooks run initial lints or syntax validation.',
                tips: 'Source code management on mainframe has shifted from legacy library hosts (like CA-Panvalet or Endevor) to Git for unified enterprise CI/CD.'
            },
            {
                id: 'jenkins',
                label: '2. Jenkins / GitLab CI',
                desc: 'A CI pipeline runner (like Jenkins) detects changes in Git, spins up a pipeline job, and communicates with the mainframe via z/OS UNIX System Services (USS) or REST interfaces.',
                tips: 'The runner coordinates automated testing steps and invokes compilation utilities via command execution ports.'
            },
            {
                id: 'dbb',
                label: '3. IBM DBB (Dependency Based Build)',
                desc: 'IBM DBB executes on z/OS to analyze code dependencies, extract compilation requirements, and run the compiler (Enterprise COBOL 6.x) to generate executable load modules.',
                tips: 'DBB runs Java/Groovy scripts under USS, ensuring that only modified files and their dependents are compiled, saving CPU cycles.'
            },
            {
                id: 'ucd',
                label: '4. UrbanCode Deploy (UCD)',
                desc: 'The deployment coordinator package loads the built binaries (load modules) into targeted execution environments, refreshing CICS program tables (NEWCOPY) and DB2 tablespace binders.',
                tips: 'UCD automates rollback processes: if verification tests fail, it restores the previous load module version instantly.'
            },
            {
                id: 'zosconnect',
                label: '5. z/OS Connect EE',
                desc: 'Exposes CICS transactions and DB2 stored procedures as REST APIs, converting JSON request payloads to native COBOL copybook buffers (EBCDIC) automatically.',
                tips: 'z/OS Connect enables legacy COBOL functions to be called directly by modern mobile apps, web servers, or cloud microservices via standard HTTP/JSON.'
            },
            {
                id: 'cloud',
                label: '6. Hybrid Cloud Apps',
                desc: 'Distributed cloud applications (Node.js, Java, Python) interact with z/OS Connect REST endpoints, enabling real-time transactions without understanding COBOL formats.',
                tips: 'Exposing mainframe business logic as REST APIs prevents high replication costs and maintains data residency standards.'
            }
        ]
    },
    sort: {
        title: 'z/OS DFSORT Utility Processing Pipeline',
        subtitle: 'Flow of dataset sorting, filtering, and conversion via JCL SORT control cards.',
        nodes: [
            {
                id: 'sortin',
                label: '1. SORTIN (Input Dataset)',
                desc: 'The input sequential or VSAM dataset (e.g. PROD.CLIENT.DATA) containing unsorted raw records. Defined in the JCL via the //SORTIN DD card.',
                tips: 'Ensure correct RECFM and LRECL are specified. If the file is empty, DFSORT behavior is determined by the NULLOUT/NOOMIT options.'
            },
            {
                id: 'inrec',
                label: '2. INREC (Reformatting)',
                desc: 'An optional pre-sort phase that reformats input records before they are sorted. This helps reduce record size by truncating unused fields, saving CPU sorting time.',
                tips: 'Use INREC FIELDS=(...) to parse, align, or add fields to records before sorting.'
            },
            {
                id: 'sortwk',
                label: '3. SORTWK (Work Datasets)',
                desc: 'Temporary work datasets (SORTWK01, SORTWK02, etc.) allocated on disk (DASD) or virtual storage. DFSORT uses these files to store intermediate runs when sorting datasets larger than memory.',
                tips: 'Allocate at least three SORTWK datasets for large volume sorts to avoid 0C4 or space-related abends.'
            },
            {
                id: 'sortfields',
                label: '4. SORT/MERGE Control Block',
                desc: 'The sorting core executing the SORT FIELDS=(pos,len,format,order) control cards. Records are reordered based on multiple keys in ascending (A) or descending (D) sequence.',
                tips: 'Supported formats include CH (Character), ZD (Zoned Decimal), and PD (Packed Decimal).'
            },
            {
                id: 'omitinclude',
                label: '5. OMIT / INCLUDE Filter',
                desc: 'Applies boolean condition filters to records during processing. INCLUDE retains only records matching a criteria; OMIT discards matching records (e.g., OMIT COND=(1,1,CH,EQ,C\'D\')).',
                tips: 'Filtering records via OMIT/INCLUDE is significantly faster than parsing and filtering records programmatically inside COBOL.'
            },
            {
                id: 'sortout',
                label: '6. SORTOUT (Output Dataset)',
                desc: 'The final destination for sorted/filtered records (cataloged via //SORTOUT DD). Optionally formatted post-sort using OUTREC control cards to build custom reports.',
                tips: 'Use OUTREC to re-align fields, insert headers, or format reports before writing to the physical output sequential file.'
            }
        ]
    }
};


export const ArchitectureDiagrams = () => {
    const [selectedTab, setSelectedTab] = useState('cics');
    const [selectedNodeId, setSelectedNodeId] = useState(null);

    const diagram = DIAGRAM_DATA[selectedTab];
    const nodes = diagram.nodes;
    const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

    const renderCICSFlow = () => {
        return (
            <svg viewBox="0 0 760 380" className="svg-diagram" width="100%" height="100%">
                {/* Definitions for arrow heads */}
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border-primary)" />
                    </marker>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="var(--border-primary)" floodOpacity="0.4" />
                    </filter>
                </defs>

                {/* Grid guidelines / Background */}
                <rect width="100%" height="100%" fill="rgba(0,0,0,0.15)" rx="8" />

                {/* 1. Terminal Node */}
                <g className={`diag-node ${selectedNodeId === 'terminal' ? 'active' : ''}`} onClick={() => setSelectedNodeId('terminal')} cursor="pointer">
                    <rect x="30" y="140" width="100" height="70" rx="8" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'terminal' ? 'url(#glow)' : ''} />
                    <text x="80" y="170" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="12">Terminal</text>
                    <text x="80" y="190" fill="var(--text-primary)" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)">TX: ACCT</text>
                </g>

                {/* Connection 1 -> 2 */}
                <path d="M 130 175 L 180 175" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* CICS Core boundary box */}
                <rect x="160" y="40" width="410" height="300" rx="12" fill="rgba(255,255,255,0.01)" stroke="var(--border-muted)" strokeWidth="1" strokeDasharray="5,5" />
                <text x="365" y="60" fill="var(--text-secondary)" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1px">CICS REGION BOUNDARY</text>

                {/* 2. PCT Node */}
                <g className={`diag-node ${selectedNodeId === 'pct' ? 'active' : ''}`} onClick={() => setSelectedNodeId('pct')} cursor="pointer">
                    <rect x="180" y="110" width="110" height="50" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'pct' ? 'url(#glow)' : ''} />
                    <text x="235" y="135" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="11">PCT Table</text>
                    <text x="235" y="150" fill="var(--text-secondary)" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)">TX -&gt; Program</text>
                </g>

                {/* Connection 2 -> 3 */}
                <path d="M 235 160 L 235 210" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* 3. PPT Node */}
                <g className={`diag-node ${selectedNodeId === 'ppt' ? 'active' : ''}`} onClick={() => setSelectedNodeId('ppt')} cursor="pointer">
                    <rect x="180" y="210" width="110" height="50" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'ppt' ? 'url(#glow)' : ''} />
                    <text x="235" y="235" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="11">PPT Table</text>
                    <text x="235" y="250" fill="var(--text-secondary)" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)">Load Executable</text>
                </g>

                {/* Connection 3 -> 4 */}
                <path d="M 290 235 L 340 235" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* 4. Program Node */}
                <g className={`diag-node ${selectedNodeId === 'program' ? 'active' : ''}`} onClick={() => setSelectedNodeId('program')} cursor="pointer">
                    <rect x="340" y="195" width="110" height="80" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'program' ? 'url(#glow)' : ''} />
                    <text x="395" y="225" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="11">COBOL Program</text>
                    <text x="395" y="240" fill="var(--text-primary)" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)">ACCT01</text>
                    <text x="395" y="260" fill="var(--text-secondary)" textAnchor="middle" fontSize="9">Linkage/Logic</text>
                </g>

                {/* Connection 4 -> 5 */}
                <path d="M 395 195 L 395 150" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* 5. COMMAREA Node */}
                <g className={`diag-node ${selectedNodeId === 'commarea' ? 'active' : ''}`} onClick={() => setSelectedNodeId('commarea')} cursor="pointer">
                    <rect x="340" y="90" width="110" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'commarea' ? 'url(#glow)' : ''} />
                    <text x="395" y="115" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="11">COMMAREA</text>
                    <text x="395" y="130" fill="var(--text-secondary)" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)">State & Buffers</text>
                    <text x="395" y="142" fill="var(--text-secondary)" textAnchor="middle" fontSize="8">(DFHCOMMAREA)</text>
                </g>

                {/* Connection 4 -> 6 */}
                <path d="M 450 235 L 600 235" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* 6. DB2 Storage Node */}
                <g className={`diag-node ${selectedNodeId === 'db2' ? 'active' : ''}`} onClick={() => setSelectedNodeId('db2')} cursor="pointer">
                    {/* Database cylindrical representation */}
                    <path d="M 600 150 C 600 130, 680 130, 680 150 L 680 230 C 680 250, 600 250, 600 230 Z" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'db2' ? 'url(#glow)' : ''} />
                    <ellipse cx="640" cy="150" rx="40" ry="15" fill="var(--bg-panel-hover)" stroke="var(--border-primary)" strokeWidth="2" />
                    <text x="640" y="195" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="11">Databases</text>
                    <text x="640" y="215" fill="var(--text-secondary)" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)">DB2 & VSAM</text>
                </g>
            </svg>
        );
    };

    const renderDB2Flow = () => {
        return (
            <svg viewBox="0 0 760 380" className="svg-diagram" width="100%" height="100%">
                <rect width="100%" height="100%" fill="rgba(0,0,0,0.15)" rx="8" />

                {/* Storage Group Outer Boundary */}
                <g className={`diag-node ${selectedNodeId === 'stogroup' ? 'active' : ''}`} onClick={() => setSelectedNodeId('stogroup')} cursor="pointer">
                    <rect x="40" y="40" width="680" height="300" rx="12" fill="rgba(255, 255, 255, 0.02)" stroke="var(--border-primary)" strokeWidth="2" strokeDasharray="6,4" filter={selectedNodeId === 'stogroup' ? 'url(#glow)' : ''} />
                    <text x="60" y="65" fill="var(--text-primary)" fontWeight="bold" fontSize="12" fontFamily="var(--font-mono)">Storage Group (STOGROUP)</text>
                    <text x="60" y="80" fill="var(--text-secondary)" fontSize="9">Maps logical datasets to physical DASD Volumes</text>
                </g>

                {/* Database Boundary */}
                <g className={`diag-node ${selectedNodeId === 'database' ? 'active' : ''}`} onClick={() => setSelectedNodeId('database')} cursor="pointer">
                    <rect x="80" y="100" width="600" height="220" rx="8" fill="rgba(0,0,0,0.3)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'database' ? 'url(#glow)' : ''} />
                    <text x="100" y="125" fill="var(--text-light)" fontWeight="bold" fontSize="12">Logical DB: DSNACCDB</text>
                </g>

                {/* Tablespace */}
                <g className={`diag-node ${selectedNodeId === 'tablespace' ? 'active' : ''}`} onClick={() => setSelectedNodeId('tablespace')} cursor="pointer">
                    <rect x="100" y="150" width="260" height="150" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'tablespace' ? 'url(#glow)' : ''} />
                    <text x="120" y="175" fill="var(--text-light)" fontWeight="bold" fontSize="11">Tablespace (DSNACCT1)</text>
                    <text x="120" y="190" fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">Physical VSAM LDS (Page Sets)</text>
                </g>

                {/* Table inside Tablespace */}
                <g className={`diag-node ${selectedNodeId === 'table' ? 'active' : ''}`} onClick={() => setSelectedNodeId('table')} cursor="pointer">
                    <rect x="120" y="210" width="220" height="70" rx="4" fill="rgba(255,255,255,0.03)" stroke="var(--border-primary)" strokeWidth="1.5" filter={selectedNodeId === 'table' ? 'url(#glow)' : ''} />
                    <text x="140" y="235" fill="var(--text-light)" fontWeight="bold" fontSize="11">Table: EMPLOYEES</text>
                    <text x="140" y="250" fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">Rows & Columns</text>
                    <text x="140" y="262" fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">EMP_ID, FIRST_NAME, ...</text>
                </g>

                {/* Index / Indexspace */}
                <g className={`diag-node ${selectedNodeId === 'index' ? 'active' : ''}`} onClick={() => setSelectedNodeId('index')} cursor="pointer">
                    <rect x="400" y="150" width="260" height="150" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'index' ? 'url(#glow)' : ''} />
                    <text x="420" y="175" fill="var(--text-light)" fontWeight="bold" fontSize="11">Indexspace (DSNACCX1)</text>
                    <text x="420" y="190" fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">B-Tree Index dataset</text>

                    {/* Simple B-Tree visual */}
                    <g stroke="var(--border-primary)" strokeWidth="1.5">
                        {/* Parent Node */}
                        <rect x="510" y="210" width="40" height="20" fill="none" />
                        <line x1="530" y1="230" x2="480" y2="260" />
                        <line x1="530" y1="230" x2="580" y2="260" />
                        {/* Child Nodes */}
                        <rect x="460" y="260" width="40" height="20" fill="none" />
                        <rect x="560" y="260" width="40" height="20" fill="none" />
                    </g>
                    <text x="530" y="222" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Root</text>
                    <text x="480" y="272" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Leaf</text>
                    <text x="580" y="272" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Leaf</text>
                </g>
            </svg>
        );
    };

    const renderVSAMFlow = () => {
        return (
            <svg viewBox="0 0 760 380" className="svg-diagram" width="100%" height="100%">
                <rect width="100%" height="100%" fill="rgba(0,0,0,0.15)" rx="8" />

                {/* Index Set Block */}
                <g className={`diag-node ${selectedNodeId === 'indexset' ? 'active' : ''}`} onClick={() => setSelectedNodeId('indexset')} cursor="pointer">
                    <rect x="230" y="40" width="300" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'indexset' ? 'url(#glow)' : ''} />
                    <text x="380" y="65" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="12">Index Set (Root & Intermediate Levels)</text>
                    <text x="380" y="82" fill="var(--text-secondary)" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)">Direct Pointer Nodes (High Key Maps)</text>
                </g>

                {/* Lines Index Set -> Sequence Set */}
                <line x1="380" y1="100" x2="210" y2="140" stroke="var(--border-primary)" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="380" y1="100" x2="550" y2="140" stroke="var(--border-primary)" strokeWidth="1.5" strokeDasharray="3,3" />

                {/* Sequence Set Block */}
                <g className={`diag-node ${selectedNodeId === 'sequenceset' ? 'active' : ''}`} onClick={() => setSelectedNodeId('sequenceset')} cursor="pointer">
                    <rect x="80" y="140" width="600" height="50" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'sequenceset' ? 'url(#glow)' : ''} />
                    <text x="380" y="165" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="12">Sequence Set (Leaf Nodes - linked horizontally for sequential reads)</text>
                    <text x="380" y="180" fill="var(--text-secondary)" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)">Pointers to Control Intervals (CIs) in Control Areas (CAs)</text>
                </g>

                {/* Control Area boundary */}
                <g className={`diag-node ${selectedNodeId === 'controlarea' ? 'active' : ''}`} onClick={() => setSelectedNodeId('controlarea')} cursor="pointer">
                    <rect x="40" y="210" width="680" height="140" rx="8" fill="rgba(255, 255, 255, 0.01)" stroke="var(--border-primary)" strokeWidth="1.5" strokeDasharray="5,5" filter={selectedNodeId === 'controlarea' ? 'url(#glow)' : ''} />
                    <text x="380" y="228" fill="var(--text-primary)" textAnchor="middle" fontWeight="bold" fontSize="11" fontFamily="var(--font-mono)">Control Area (CA) — Cylinders / Extents</text>
                </g>

                {/* Control Intervals */}
                <g className={`diag-node ${selectedNodeId === 'controlinterval' ? 'active' : ''}`} onClick={() => setSelectedNodeId('controlinterval')} cursor="pointer">
                    {/* CI 1 */}
                    <rect x="60" y="240" width="180" height="90" rx="4" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'controlinterval' ? 'url(#glow)' : ''} />
                    <text x="150" y="260" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">Control Interval (CI-1)</text>
                    
                    {/* Mini layout inside CI 1 */}
                    <rect x="70" y="275" width="45" height="30" fill="rgba(0,255,102,0.1)" stroke="var(--border-muted)" />
                    <text x="92" y="293" fill="var(--text-light)" textAnchor="middle" fontSize="8">Rec 1</text>

                    <rect x="120" y="275" width="45" height="30" fill="rgba(0,255,102,0.1)" stroke="var(--border-muted)" />
                    <text x="142" y="293" fill="var(--text-light)" textAnchor="middle" fontSize="8">Rec 2</text>

                    {/* CI Control Info */}
                    <rect x="175" y="275" width="55" height="30" fill="rgba(255,255,255,0.05)" stroke="var(--border-muted)" />
                    <text x="202" y="287" fill="var(--text-secondary)" textAnchor="middle" fontSize="7">RDF</text>
                    <text x="202" y="298" fill="var(--text-secondary)" textAnchor="middle" fontSize="7">CIDF</text>
                </g>

                {/* CI 2 */}
                <g className={`diag-node ${selectedNodeId === 'controlinterval' ? 'active' : ''}`} onClick={() => setSelectedNodeId('controlinterval')} cursor="pointer">
                    <rect x="260" y="240" width="180" height="90" rx="4" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'controlinterval' ? 'url(#glow)' : ''} />
                    <text x="350" y="260" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">Control Interval (CI-2)</text>

                    <rect x="270" y="275" width="45" height="30" fill="rgba(0,255,102,0.1)" stroke="var(--border-muted)" />
                    <text x="292" y="293" fill="var(--text-light)" textAnchor="middle" fontSize="8">Rec 3</text>

                    {/* CI Free Space inside CI 2 */}
                    <g className={`diag-node ${selectedNodeId === 'freespace' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedNodeId('freespace'); }} cursor="pointer">
                        <rect x="320" y="275" width="50" height="30" fill="none" stroke="var(--border-primary)" strokeDasharray="3,2" />
                        <text x="345" y="293" fill="var(--text-primary)" textAnchor="middle" fontSize="8" fontWeight="bold">Free Space</text>
                    </g>

                    <rect x="375" y="275" width="55" height="30" fill="rgba(255,255,255,0.05)" stroke="var(--border-muted)" />
                    <text x="402" y="287" fill="var(--text-secondary)" textAnchor="middle" fontSize="7">RDF</text>
                    <text x="402" y="298" fill="var(--text-secondary)" textAnchor="middle" fontSize="7">CIDF</text>
                </g>

                {/* CI 3 - Free Interval */}
                <g className={`diag-node ${selectedNodeId === 'freespace' ? 'active' : ''}`} onClick={() => setSelectedNodeId('freespace')} cursor="pointer">
                    <rect x="460" y="240" width="180" height="90" rx="4" fill="rgba(0, 0, 0, 0.4)" stroke="var(--border-primary)" strokeWidth="2" strokeDasharray="4,4" filter={selectedNodeId === 'freespace' ? 'url(#glow)' : ''} />
                    <text x="550" y="260" fill="var(--text-primary)" textAnchor="middle" fontWeight="bold" fontSize="10">CI-3 (Entirely Free Interval)</text>
                    <text x="550" y="290" fill="var(--text-secondary)" textAnchor="middle" fontSize="8">Reserved for CI Splits</text>
                </g>
            </svg>
        );
    };

    const renderDevOpsFlow = () => {
        return (
            <svg viewBox="0 0 760 380" className="svg-diagram" width="100%" height="100%">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border-primary)" />
                    </marker>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="var(--border-primary)" floodOpacity="0.4" />
                    </filter>
                </defs>

                <rect width="100%" height="100%" fill="rgba(0,0,0,0.15)" rx="8" />

                {/* Git Node */}
                <g className={`diag-node ${selectedNodeId === 'git' ? 'active' : ''}`} onClick={() => setSelectedNodeId('git')} cursor="pointer">
                    <rect x="20" y="150" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'git' ? 'url(#glow)' : ''} />
                    <text x="67" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">Git Repo</text>
                    <text x="67" y="195" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Commit / Push</text>
                </g>

                <path d="M 115 180 L 140 180" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* Jenkins Node */}
                <g className={`diag-node ${selectedNodeId === 'jenkins' ? 'active' : ''}`} onClick={() => setSelectedNodeId('jenkins')} cursor="pointer">
                    <rect x="140" y="150" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'jenkins' ? 'url(#glow)' : ''} />
                    <text x="187" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">CI Runner</text>
                    <text x="187" y="195" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Jenkins / Gitlab</text>
                </g>

                <path d="M 235 180 L 260 180" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* DBB Node */}
                <g className={`diag-node ${selectedNodeId === 'dbb' ? 'active' : ''}`} onClick={() => setSelectedNodeId('dbb')} cursor="pointer">
                    <rect x="260" y="150" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'dbb' ? 'url(#glow)' : ''} />
                    <text x="307" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">IBM DBB</text>
                    <text x="307" y="195" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">USS Compile</text>
                </g>

                <path d="M 355 180 L 380 180" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* UCD Node */}
                <g className={`diag-node ${selectedNodeId === 'ucd' ? 'active' : ''}`} onClick={() => setSelectedNodeId('ucd')} cursor="pointer">
                    <rect x="380" y="150" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'ucd' ? 'url(#glow)' : ''} />
                    <text x="427" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">UCD Deploy</text>
                    <text x="427" y="195" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Module Refresh</text>
                </g>

                <path d="M 475 180 L 500 180" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* z/OS Connect Node */}
                <g className={`diag-node ${selectedNodeId === 'zosconnect' ? 'active' : ''}`} onClick={() => setSelectedNodeId('zosconnect')} cursor="pointer">
                    <rect x="500" y="150" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'zosconnect' ? 'url(#glow)' : ''} />
                    <text x="547" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="9">z/OS Connect</text>
                    <text x="547" y="195" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">REST API Host</text>
                </g>

                <path d="M 595 180 L 620 180" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* Hybrid Cloud Node */}
                <g className={`diag-node ${selectedNodeId === 'cloud' ? 'active' : ''}`} onClick={() => setSelectedNodeId('cloud')} cursor="pointer">
                    <rect x="620" y="150" width="105" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'cloud' ? 'url(#glow)' : ''} />
                    <text x="672" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">Cloud / APIs</text>
                    <text x="672" y="195" fill="var(--text-primary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">JSON Consumers</text>
                </g>

                {/* Mainframe z/OS Sysplex Boundary Box */}
                <rect x="250" y="50" width="355" height="290" rx="10" fill="none" stroke="var(--border-muted)" strokeWidth="1" strokeDasharray="4,4" />
                <text x="427" y="70" fill="var(--text-secondary)" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="1px">MAINFRAME CORES (z/OS)</text>
            </svg>
        );
    };

    const renderSORTFlow = () => {
        return (
            <svg viewBox="0 0 760 380" className="svg-diagram" width="100%" height="100%">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border-primary)" />
                    </marker>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="var(--border-primary)" floodOpacity="0.4" />
                    </filter>
                </defs>

                <rect width="100%" height="100%" fill="rgba(0,0,0,0.15)" rx="8" />

                {/* SORTIN Node */}
                <g className={`diag-node ${selectedNodeId === 'sortin' ? 'active' : ''}`} onClick={() => setSelectedNodeId('sortin')} cursor="pointer">
                    <rect x="20" y="150" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'sortin' ? 'url(#glow)' : ''} />
                    <text x="67" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">SORTIN DD</text>
                    <text x="67" y="195" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Input Dataset</text>
                </g>

                <path d="M 115 180 L 140 180" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* INREC Node */}
                <g className={`diag-node ${selectedNodeId === 'inrec' ? 'active' : ''}`} onClick={() => setSelectedNodeId('inrec')} cursor="pointer">
                    <rect x="140" y="150" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'inrec' ? 'url(#glow)' : ''} />
                    <text x="187" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">INREC Block</text>
                    <text x="187" y="195" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Pre-Sort Form</text>
                </g>

                <path d="M 235 180 L 260 180" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* SORTFIELDS Node */}
                <g className={`diag-node ${selectedNodeId === 'sortfields' ? 'active' : ''}`} onClick={() => setSelectedNodeId('sortfields')} cursor="pointer">
                    <rect x="260" y="150" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'sortfields' ? 'url(#glow)' : ''} />
                    <text x="307" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="9">SORT FIELDS</text>
                    <text x="307" y="195" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Keys Sorting</text>
                </g>

                {/* Arrow up to SORTWK */}
                <path d="M 295 150 L 295 100" stroke="var(--border-primary)" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
                {/* Arrow down from SORTWK */}
                <path d="M 320 100 L 320 150" stroke="var(--border-primary)" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />

                {/* SORTWK Node */}
                <g className={`diag-node ${selectedNodeId === 'sortwk' ? 'active' : ''}`} onClick={() => setSelectedNodeId('sortwk')} cursor="pointer">
                    <rect x="260" y="40" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'sortwk' ? 'url(#glow)' : ''} />
                    <text x="307" y="70" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">SORTWK01-03</text>
                    <text x="307" y="85" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Work Storage</text>
                </g>

                <path d="M 355 180 L 380 180" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* OMIT/INCLUDE Node */}
                <g className={`diag-node ${selectedNodeId === 'omitinclude' ? 'active' : ''}`} onClick={() => setSelectedNodeId('omitinclude')} cursor="pointer">
                    <rect x="380" y="150" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'omitinclude' ? 'url(#glow)' : ''} />
                    <text x="427" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="9">OMIT / INCLUDE</text>
                    <text x="427" y="195" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Record Filters</text>
                </g>

                <path d="M 475 180 L 500 180" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* OUTREC / SORTOUT Node */}
                <g className={`diag-node ${selectedNodeId === 'sortout' ? 'active' : ''}`} onClick={() => setSelectedNodeId('sortout')} cursor="pointer">
                    <rect x="500" y="150" width="95" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'sortout' ? 'url(#glow)' : ''} />
                    <text x="547" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="9">OUTREC Phase</text>
                    <text x="547" y="195" fill="var(--text-secondary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Post-Sort Form</text>
                </g>

                <path d="M 595 180 L 620 180" stroke="var(--border-primary)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* SORTOUT Node */}
                <g className={`diag-node ${selectedNodeId === 'sortout' ? 'active' : ''}`} onClick={() => setSelectedNodeId('sortout')} cursor="pointer">
                    <rect x="620" y="150" width="105" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-primary)" strokeWidth="2" filter={selectedNodeId === 'sortout' ? 'url(#glow)' : ''} />
                    <text x="672" y="180" fill="var(--text-light)" textAnchor="middle" fontWeight="bold" fontSize="10">SORTOUT DD</text>
                    <text x="672" y="195" fill="var(--text-primary)" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)">Sorted Output</text>
                </g>

                {/* DFSORT Utility Processing Boundary Box */}
                <rect x="130" y="20" width="480" height="320" rx="10" fill="none" stroke="var(--border-muted)" strokeWidth="1" strokeDasharray="4,4" />
                <text x="370" y="330" fill="var(--text-secondary)" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="1px">DFSORT ENGINE INTERNALS</text>
            </svg>
        );
    };

    return (
        <div className="architecture-container">
            {/* Header Area */}
            <div className="sandbox-header-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div className="pulse-glow" style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>⛓️</div>
                    <div>
                        <h3 className="section-title" style={{ margin: 0 }}>Interactive Mainframe Systems Architecture</h3>
                        <p className="section-subtitle" style={{ margin: 0, textTransform: 'none' }}>
                            Inspect real-world data flows, DB2 storage datasets, and VSAM structures.
                        </p>
                    </div>
                </div>

                <div className="pill-group" style={{ margin: 0 }}>
                    <button
                        className={`filter-pill ${selectedTab === 'cics' ? 'active' : ''}`}
                        onClick={() => { setSelectedTab('cics'); setSelectedNodeId(null); }}
                    >
                        CICS Transaction flow
                    </button>
                    <button
                        className={`filter-pill ${selectedTab === 'db2' ? 'active' : ''}`}
                        onClick={() => { setSelectedTab('db2'); setSelectedNodeId(null); }}
                    >
                        DB2 Storage Layout
                    </button>
                    <button
                        className={`filter-pill ${selectedTab === 'vsam' ? 'active' : ''}`}
                        onClick={() => { setSelectedTab('vsam'); setSelectedNodeId(null); }}
                    >
                        VSAM KSDS Splits
                    </button>
                    <button
                        className={`filter-pill ${selectedTab === 'sort' ? 'active' : ''}`}
                        onClick={() => { setSelectedTab('sort'); setSelectedNodeId(null); }}
                    >
                        DFSORT Processing Pipeline
                    </button>
                    <button
                        className={`filter-pill ${selectedTab === 'devops' ? 'active' : ''}`}
                        onClick={() => { setSelectedTab('devops'); setSelectedNodeId(null); }}
                    >
                        Hybrid Cloud & DevOps
                    </button>
                </div>
            </div>

            <div className="sandbox-workspace-grid">
                {/* SVG Visual Canvas (Left / Main) */}
                <div className="diagram-canvas-panel">
                    <div className="panel-title-bar">
                        <Icon name="architecture" /> VISUAL LAYOUT SYSTEM — {diagram.title.toUpperCase()}
                    </div>
                    <div className="diagram-canvas-body">
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                            💡 Click on any node in the SVG diagram below to inspect detailed system operations, specifications, and performance tips.
                        </p>
                        
                        <div className="svg-wrapper">
                            {selectedTab === 'cics' && renderCICSFlow()}
                            {selectedTab === 'db2' && renderDB2Flow()}
                            {selectedTab === 'vsam' && renderVSAMFlow()}
                            {selectedTab === 'sort' && renderSORTFlow()}
                            {selectedTab === 'devops' && renderDevOpsFlow()}
                        </div>
                    </div>
                </div>

                {/* Node Inspector Panel (Right) */}
                <div className="diagram-inspector-panel">
                    <div className="panel-title-bar" style={{ backgroundColor: 'var(--terminal-header)' }}>
                        <Icon name="info" /> COMPONENT INSPECTOR
                    </div>
                    <div className="panel-body-content">
                        <div style={{ borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                            <div className="logo-subtitle" style={{ fontSize: '0.65rem', color: 'var(--text-primary)' }}>ACTIVE BLOCK DEFINITION</div>
                            <h4 style={{ color: 'var(--text-light)', fontSize: '1.15rem', fontWeight: 800, marginTop: '0.25rem' }}>
                                {activeNode.label}
                            </h4>
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div className="logo-subtitle" style={{ fontSize: '0.65rem', marginBottom: '0.4rem' }}>FUNCTIONAL DESCRIPTION</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                {activeNode.desc}
                            </p>
                        </div>

                        <div className="tip-box" style={{ marginTop: 'auto' }}>
                            <Icon name="star" className="tip-box-icon" />
                            <div>
                                <div className="logo-subtitle" style={{ fontSize: '0.65rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>MAINFRAME INTERVIEW TIP</div>
                                <p className="tip-text" style={{ fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                                    {activeNode.tips}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
