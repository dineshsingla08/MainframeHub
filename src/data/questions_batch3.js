// BATCH 3: VSAM + DB2 Questions (200 questions)
export const questionsBatch3 = [

    // ============ VSAM QUESTIONS ============
    {
        id: "vsam_b3_001", category: "VSAM", level: "Beginner",
        question: "What are the three types of VSAM datasets and their primary use cases?",
        answer: "VSAM (Virtual Storage Access Method) has three dataset types: (1) KSDS (Key-Sequenced Dataset) - primary key access for direct retrieval and updates; used for master files, customer records. (2) ESDS (Entry-Sequenced Dataset) - sequential access only, records added at end; used for audit logs, transaction journals. (3) RRDS (Relative Record Dataset) - fixed-size slot access by relative record number; used for direct access without keys.",
        tip: "KSDS is the most commonly used VSAM type. Think of it as the mainframe equivalent of a keyed database table. ESDS is like an append-only log file.",
        quizOptions: ["VSAM only has KSDS and ESDS", "VSAM has KSDS (key-based), ESDS (entry-sequential), and RRDS (relative record number) for different access pattern needs", "RRDS is only for temporary data", "All VSAM types support random access by key"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_002", category: "VSAM", level: "Beginner",
        question: "What is a VSAM cluster and what are its components?",
        answer: "A VSAM cluster is the complete VSAM file composed of two internal components: the Data Component (stores actual records) and the Index Component (for KSDS, stores key index to locate records). The cluster name is the external name. ESDS and RRDS have only a Data Component. The catalog has entries for both cluster and components.",
        code: "/* KSDS Cluster structure: */\nCLUSTER-NAME\n├── DATA-COMPONENT-NAME  (actual records)\n└── INDEX-COMPONENT-NAME (key index - KSDS only)\n\n/* IDCAMS defines all: */\nDEFINE CLUSTER (NAME(MY.KSDS.CLUSTER) ...)\n    DATA (NAME(MY.KSDS.CLUSTER.DATA) ...)\n    INDEX (NAME(MY.KSDS.CLUSTER.INDEX) ...)",
        tip: "You can access data and index components separately in JCL, but always open the cluster name in COBOL. Direct component access is only for diagnostic purposes.",
        quizOptions: ["A cluster is just another name for a dataset", "A VSAM cluster consists of a Data Component (records) and for KSDS an Index Component; together they form the complete file", "VSAM clusters always have three components", "The index component stores the actual records"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_003", category: "VSAM", level: "Beginner",
        question: "How do you define a VSAM KSDS using IDCAMS?",
        answer: "Use IDCAMS DEFINE CLUSTER with required parameters: NAME (cluster name), INDEXED (for KSDS), KEYS (position and length), RECORDS or CYLINDERS (allocation), RECORDSIZE (average,maximum), DATA NAME and INDEX NAME for component naming. Optional: BUFFERSPACE, IMBED, REPLICATE, VOLUMES, CATALOG.",
        code: "//DEFKSDS  EXEC PGM=IDCAMS\n//SYSPRINT DD SYSOUT=*\n//SYSIN    DD *\n  DEFINE CLUSTER                    -\n    (NAME(PROD.EMPLOYEE.CLUSTER)    -\n     INDEXED                        -\n     KEYS(5,0)                      -  /* Key length 5, offset 0 */\n     RECORDSIZE(100,500)            -  /* avg 100, max 500 */\n     CYLINDERS(10,5)                -\n     VOLUMES(DISK01))               -\n  DATA (NAME(PROD.EMPLOYEE.DATA))   -\n  INDEX (NAME(PROD.EMPLOYEE.INDEX))\n/*",
        tip: "KEYS(length,offset) - offset is 0-based! RECORDSIZE(avg,max) - set avg close to typical record size and max to the largest possible. IMBED puts index with data for better performance.",
        quizOptions: ["Use IEBGENER to define VSAM", "IDCAMS DEFINE CLUSTER with INDEXED, KEYS(length,offset), RECORDSIZE, and allocation parameters creates a KSDS", "VSAM files are created automatically at first use", "JCL DISP=(NEW,CATLG) creates VSAM files"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_004", category: "VSAM", level: "Beginner",
        question: "What is VSAM FREESPACE and how should it be set for different workloads?",
        answer: "FREESPACE(CI-percent, CA-percent) specifies percentage of each Control Interval (CI) and Control Area (CA) to leave free for insertions. CI-percent reserves space within each data CI. CA-percent reserves whole CIs within each CA. For mostly-sequential loads: CI=0, CA=0. For heavy random inserts: CI=15-30%, CA=10-20%. High FREESPACE wastes space but reduces CI/CA splits.",
        code: "/* For heavy random update workload: */\nDEFINE CLUSTER\n    (NAME(ACTIVE.TRANSACTIONS)\n     INDEXED KEYS(8,0)\n     RECORDSIZE(200,200)\n     FREESPACE(20,10)  /* 20% CI free, 10% CA free */\n     CYLINDERS(50,10))\n\n/* For read-mostly reference file: */\nDEFINE CLUSTER\n    (NAME(STATIC.REFERENCE)\n     FREESPACE(0,0)   /* No free space needed */\n     CYLINDERS(5,1))",
        tip: "Monitor CI and CA split frequency using IDCAMS LISTCAT or DFSMS statistics. If splits are high, increase FREESPACE or reorganize the file.",
        quizOptions: ["FREESPACE is always set to 20%", "FREESPACE(CI,CA) reserves space for insertions; higher values reduce splits but waste space; tune based on insert frequency", "FREESPACE only matters for ESDS files", "FREESPACE of 100% gives maximum performance"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_005", category: "VSAM", level: "Intermediate",
        question: "What is a VSAM CI (Control Interval) split and what causes it?",
        answer: "A CI split occurs when a new record is inserted into a full Control Interval. VSAM moves approximately half the records from the full CI to a free CI (from FREESPACE), maintaining key sequence. CI splits are expensive I/O operations. Causes: insufficient FREESPACE, records inserted in random key order, heavily-updated files not reorganized.",
        code: "/* Monitor CI/CA splits using IDCAMS LISTCAT: */\n//LISTCAT  EXEC PGM=IDCAMS\n//SYSPRINT DD SYSOUT=*\n//SYSIN    DD *\n  LISTCAT ENTRIES(PROD.EMPLOYEE.CLUSTER) ALL\n/* Look for: CI SPLITS, CA SPLITS in the output */\n/* High split counts indicate FREESPACE needs adjustment */",
        tip: "Schedule regular VSAM reorganizations (using DFDSS or IDCAMS REPRO to unload/delete/reload) to consolidate splits and reclaim fragmented space.",
        quizOptions: ["CI splits delete records from the file", "A CI split occurs when a full CI receives an insertion; VSAM moves half the records to a free CI, causing expensive I/O", "CI splits are a normal, low-cost operation", "CI splits only occur during batch loads"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_006", category: "VSAM", level: "Intermediate",
        question: "How do VSAM alternate indexes (AIX) work and how do you create one?",
        answer: "Alternate Indexes provide additional access paths to KSDS/ESDS data by building a secondary index on a non-primary field. Create using IDCAMS DEFINE ALTERNATEINDEX specifying the base cluster and the key field (RELATE to cluster). Then BLDINDEX to build the index. Applications access via a PATH definition that combines the AIX with the base cluster.",
        code: "//DEFAIX   EXEC PGM=IDCAMS\n//SYSIN    DD *\n  DEFINE ALTERNATEINDEX                   -\n    (NAME(EMPLOYEE.BY-DEPTNO.AIX)         -\n     RELATE(PROD.EMPLOYEE.CLUSTER)        -\n     KEYS(3,50)                           -  /* Dept code at offset 50 */\n     UNIQUEKEY                            -  /* Or NONUNIQUEKEY */\n     RECORDSIZE(40,4096))\n  \n  BLDINDEX                                -\n    INDATASET(PROD.EMPLOYEE.CLUSTER)      -\n    OUTDATASET(EMPLOYEE.BY-DEPTNO.AIX)\n\n  DEFINE PATH                             -\n    (NAME(EMPLOYEE.BY-DEPTNO.PATH)        -\n     PATHENTRY(EMPLOYEE.BY-DEPTNO.AIX))\n/*",
        tip: "Use NONUNIQUEKEY for AIX on non-unique fields (e.g., department code). UNIQUEKEY enforces uniqueness like a unique index in RDBMS.",
        quizOptions: ["Alternate indexes are only for ESDS files", "AIX provides secondary access paths; defined with DEFINE ALTERNATEINDEX, built with BLDINDEX, accessed via PATH definitions", "You can define unlimited alternate indexes with no overhead", "AIX automatically updates when base cluster changes"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_007", category: "VSAM", level: "Intermediate",
        question: "What is the VSAM SHAREOPTIONS parameter and when should it be used?",
        answer: "SHAREOPTIONS(cross-region, cross-system) controls concurrent access. Cross-region: 1=one writer OR many readers (exclusive), 2=one writer AND many readers, 3=full sharing (no data integrity guarantees), 4=full sharing with data integrity. Cross-system (SHR 2): similar but across systems. SHR(1,3) is typical for production files.",
        code: "/* Standard production setting: */\nDEFINE CLUSTER\n    (NAME(PROD.MASTER)\n     SHAREOPTIONS(1,3)   /* Exclusive in region, multiple systems */\n     ...)\n\n/* For shared read-only reference files: */\nDEFINE CLUSTER\n    (NAME(PROD.REFERENCE)\n     SHAREOPTIONS(2,3)   /* Concurrent readers, one writer */\n     ...)",
        tip: "SHR(3,3) or SHR(4,4) allows full concurrent access but removes VSAM's internal data integrity protection. Only use SHR(4) if your application implements its own serialization.",
        quizOptions: ["SHAREOPTIONS always allows full sharing", "SHAREOPTIONS controls concurrent access levels by cross-region and cross-system sharing; SHR(1,3) is typical for production", "SHAREOPTIONS is only relevant for CICS files", "Higher SHAREOPTIONS numbers are always safer"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_008", category: "VSAM", level: "Expert",
        question: "What is VSAM data buffering and how does BUFFERSPACE affect performance?",
        answer: "BUFFERSPACE specifies the minimum buffer space VSAM requests. More buffers reduce physical I/O: for KSDS, index buffers keep index levels in memory; for sequential access, lookahead data buffers improve performance. BUFND (buffer number for data), BUFNI (for index) can be specified at the cluster level or overridden in JCL DLBL/ACB parameters.",
        code: "/* Specify buffers at definition: */\nDEFINE CLUSTER\n    (NAME(LARGE.KSDS)\n     BUFFERSPACE(512000)  /* 512KB buffer space */\n     ...)\n\n/* Override in JCL with AMP parameter: */\n//MYDD   DD DSN=LARGE.KSDS,DISP=SHR,\n//          AMP=('BUFND=20,BUFNI=10')  /* 20 data, 10 index buffers */",
        tip: "Set BUFNI=number of index levels + 1 to keep the entire KSDS index in memory. For a large KSDS, this eliminates all index I/Os. Monitor using VSAM statistics.",
        quizOptions: ["BUFFERSPACE doesn't affect I/O performance", "BUFFERSPACE controls buffer allocation; more buffers reduce I/O; BUFNI for index buffers can eliminate index I/Os for KSDS", "Only BUFND matters for VSAM performance", "BUFFERSPACE is the maximum record size"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_009", category: "VSAM", level: "Expert",
        question: "How do you reorganize a VSAM KSDS to improve performance?",
        answer: "VSAM reorganization eliminates CI/CA splits and reclaims fragmented space. Process: (1) IDCAMS REPRO to unload to sequential file. (2) IDCAMS DELETE to delete the cluster. (3) IDCAMS DEFINE to redefine with same or adjusted parameters. (4) IDCAMS REPRO to reload from sequential. This recreates the cluster with optimal layout.",
        code: "//REORG    EXEC PGM=IDCAMS\n//SYSPRINT DD SYSOUT=*\n//SEQOUT   DD DSN=&&REORGSEQ,DISP=(NEW,PASS)\n//SYSIN    DD *\n  REPRO INFILE(KSDSDD) OUTFILE(SEQOUT)   /* Step 1: Unload */\n  DELETE PROD.EMPLOYEE.CLUSTER           /* Step 2: Delete */\n  DEFINE CLUSTER (NAME(PROD.EMPLOYEE.CLUSTER) /* Step 3: Redefine */\n                  INDEXED KEYS(5,0)...)\n  REPRO INFILE(SEQOUT) OUTFILE(NEWKSDS)  /* Step 4: Reload */\n/*",
        tip: "Schedule VSAM reorganizations during off-peak hours. Frequency depends on update rate and performance degradation. Monitor CI/CA split statistics to determine when reorg is needed.",
        quizOptions: ["VSAM files reorganize themselves automatically", "Reorganize by: REPRO to unload, DELETE cluster, DEFINE new cluster, REPRO to reload; eliminates splits and reclaims fragmented space", "IEBCOPY reorganizes VSAM files", "Reorganization requires IBM support"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_010", category: "VSAM", level: "Expert",
        question: "What is VSAM IMBED and REPLICATE and how do they improve performance?",
        answer: "IMBED places the sequence set (lowest index level) with the data it describes, reducing disk seeks for KSDS access. REPLICATE copies the sequence set into every track of the CA, reducing rotational delay. Both improve KSDS access performance. Drawback: they waste disk space (IMBED uses 1 CI per CA, REPLICATE fills a track per CA).",
        code: "DEFINE CLUSTER\n    (NAME(PROD.HIGH.PERF.KSDS)\n     INDEXED KEYS(8,0)\n     IMBED          /* Sequence set with data */\n     REPLICATE      /* Replicate sequence set */\n     RECORDSIZE(300,300)\n     CYLINDERS(100,20))",
        tip: "IMBED and REPLICATE improve random read performance at the cost of disk space. In modern solid-state storage environments, these parameters have less impact.",
        quizOptions: ["IMBED and REPLICATE are identical", "IMBED places sequence set with data; REPLICATE copies it to every track; both reduce I/O seeks for KSDS at the cost of space", "REPLICATE is only for ESDS files", "These are obsolete parameters in modern DFSMS"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_011", category: "VSAM", level: "Intermediate",
        question: "How do you use IDCAMS to list VSAM cluster attributes?",
        answer: "IDCAMS LISTCAT displays catalog information about datasets. ENTRIES(cluster-name) targets a specific cluster. ALL parameter shows complete information including space allocation, statistics (record count, CI/CA splits, bytes written), performance metrics. NAME shows just the entry names. LEVEL(prefix) shows all entries at a level.",
        code: "//LISTCAT  EXEC PGM=IDCAMS\n//SYSPRINT DD SYSOUT=*\n//SYSIN    DD *\n  LISTCAT ENTRIES(PROD.EMPLOYEE.CLUSTER) ALL\n  /* Shows: allocation, freespace, statistics, performance */\n  \n  LISTCAT LEVEL(PROD.EMPLOYEE) CLUSTER  /* All clusters under prefix */\n  \n  LISTCAT CLUSTER VOLUME(DISK01)  /* All clusters on volume */\n/*",
        tip: "Run LISTCAT ALL regularly on production VSAM files to track CI/CA split trends. Increasing splits indicate the file needs reorganization or FREESPACE adjustment.",
        quizOptions: ["IDCAMS LISTCAT shows only the cluster name", "IDCAMS LISTCAT with ALL parameter displays complete cluster information: allocation, statistics, splits, performance metrics", "LISTCAT only works for KSDS clusters", "LISTCAT requires special RACF permission"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_012", category: "VSAM", level: "Expert",
        question: "What is VSAM RLS (Record Level Sharing) and when is it used?",
        answer: "RLS (Record Level Sharing) allows VSAM datasets to be shared across multiple CICS systems in a sysplex using individual record-level locking rather than file-level sharing. Requires: Coupling Facility lock structure, CICS enablement, SMSVSAM server. RLS provides granular locking, deadlock detection, and global serialization. Used in high-availability CICS environments.",
        code: "/* Define VSAM cluster for RLS: */\nDEFINE CLUSTER\n    (NAME(SHARED.CICS.CLUSTER)\n     LOG(ALL)              /* Logging required for RLS */\n     SHAREOPTIONS(3,3)     /* Full sharing with RLS control */\n     ...)\n\n/* JCL must use VSAM RLS access mode: */\n//RDSFILE  DD DSN=SHARED.CICS.CLUSTER,DISP=SHR\n/* CICS configures RLS access in file definition */",
        tip: "RLS is essential for high-availability CICS environments where multiple CICS regions share the same VSAM files. It requires careful Coupling Facility planning and sizing.",
        quizOptions: ["RLS is the same as standard SHAREOPTIONS", "RLS allows granular record-level locking across CICS systems in a sysplex using Coupling Facility, enabling high-availability file sharing", "RLS is only for batch programs", "RLS requires special IBM hardware"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_013", category: "VSAM", level: "Expert",
        question: "What is VSAM ICF (Integrated Catalog Facility) and what are user catalogs?",
        answer: "ICF is the catalog structure on z/OS managing all dataset metadata. Structure: Master Catalog (one per system) → User Catalogs (installation-specific) → Dataset entries. Datasets are cataloged in the user catalog whose alias matches the dataset high-level qualifier. ALIAS entries connect user catalog to master catalog. Proper catalog organization improves system performance and availability.",
        code: "/* Define user catalog: */\n//DEFUCAT  EXEC PGM=IDCAMS\n//SYSIN    DD *\n  DEFINE USERCATALOG\n    (NAME(PROD.USER.CATALOG)\n     VOLUMES(CATVOL)\n     CYLINDERS(10,5))\n\n/* Define alias to route PROD.** to this catalog: */\n  DEFINE ALIAS\n    (NAME(PROD)\n     RELATE(PROD.USER.CATALOG))\n/*",
        tip: "Organize datasets into user catalogs by application or environment (PROD, TEST, DEV). This enables catalog-level backup, recovery, and performance isolation.",
        quizOptions: ["There is only one catalog on z/OS", "ICF has a Master Catalog at the top; User Catalogs organize datasets by high-level qualifier via ALIAS entries", "User catalogs are only for VSAM datasets", "ALIAS entries must be defined for every dataset"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_014", category: "VSAM", level: "Expert",
        question: "How does VSAM handle recoverable files (LOG and JRNL options)?",
        answer: "VSAM recoverable files use LOGSTREAM logging (SMF log records) to support forward and backward recovery. LOG(ALL) logs all updates; LOG(NONE) disables logging. JRNL creates journal records for every update to the cluster. The VSAM Recovery Tool or DFSMSdss can use these logs to recover files to a specific point in time. Required for mission-critical databases.",
        code: "/* Define recoverable VSAM cluster: */\nDEFINE CLUSTER\n    (NAME(CRITICAL.MASTER)\n     LOG(ALL)                          /* Log all updates */\n     LOGSTREAMID(PROD.LOG.STREAM)      /* LOGSTREAM for recovery */\n     INDEXED KEYS(8,0)\n     RECORDSIZE(500,500)\n     CYLINDERS(200,50))",
        tip: "Enable LOG(ALL) for mission-critical VSAM files that must be recoverable to specific points in time. Coordinate with your storage team to define appropriate LOGSTREAMs.",
        quizOptions: ["VSAM files are never recoverable", "LOG(ALL) enables update logging to LOGSTREAM; combined with periodic backups, enables point-in-time recovery of critical VSAM files", "LOG is only for ESDS datasets", "VSAM recovery requires separate IBM software purchase"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_015", category: "VSAM", level: "Intermediate",
        question: "How do you handle VSAM password protection using RACF?",
        answer: "Modern VSAM security uses RACF dataset profiles instead of built-in VSAM passwords. RACF controls access via dataset profiles in the DATASET class. VSAM built-in passwords (MASTERPW, CONTROLPW, UPDATEPW, READPW) are obsolete. RACF provides: user-level access control, group access, logging, and integration with SSO systems.",
        code: "/* RACF protection for VSAM (preferred): */\n/* RDEFINE DATASET PROD.EMPLOYEE.CLUSTER UACC(NONE) */\n/* PERMIT PROD.EMPLOYEE.CLUSTER CLASS(DATASET) */\n/*         ID(EMPAPP) ACCESS(UPDATE) */\n\n/* Never use built-in VSAM passwords - they're obsolete */\n/* Avoid: MASTERPW(password), READPW(password) in DEFINE */",
        tip: "Always use RACF for VSAM security. Built-in VSAM passwords cannot be centrally managed, are stored in the catalog in recoverable form, and are incompatible with modern security frameworks.",
        quizOptions: ["VSAM passwords are more secure than RACF", "Modern VSAM security uses RACF dataset profiles for user-level access control; built-in VSAM passwords are obsolete", "VSAM files are always publicly accessible", "Password protection requires the VSAM product key"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_016", category: "VSAM", level: "Expert",
        question: "What is VSAM Linear Dataset (LDS) and how is it used?",
        answer: "LDS (Linear Dataset) is a special VSAM type that maps directly to virtual memory as a page-like structure. Unlike KSDS/ESDS/RRDS, LDS has no VSAM record structure - it's a flat byte stream. Used by: IBM DB2 tablespaces, IMS databases, and applications requiring memory-mapped file access via VSAM Virtual Storage Access services. Not accessed via standard COBOL file I/O.",
        code: "/* Define a Linear Dataset: */\nDEFINE CLUSTER\n    (NAME(DB2.TABLESPACE.LINEAR)\n     LINEAR          /* LDS type */\n     MEGABYTES(100,20)\n     SHAREOPTIONS(3,3))\n    DATA (NAME(DB2.TABLESPACE.LINEAR.DATA))\n/* Accessed via VSAM DADSM or DB2 buffer manager */",
        tip: "LDS is primarily used by IBM middleware products like DB2 and IMS. Application developers typically don't work with LDS directly; it's managed by the middleware.",
        quizOptions: ["LDS is the fastest access method for COBOL", "LDS is a byte-stream VSAM type without record structure; used by DB2 tablespaces and IMS databases for memory-mapped access", "LDS supports key-based access like KSDS", "LDS is used for temporary work datasets"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_017", category: "VSAM", level: "Intermediate",
        question: "How does COBOL use VSAM File Status codes?",
        answer: "VSAM File Status is a 2-byte field checked after every VSAM I/O operation. Key codes: 00=success, 02=duplicate alternate key, 10=end of file, 21=sequence error (on sequential write), 22=duplicate key (on WRITE/REWRITE to KSDS), 23=record not found (on READ/DELETE), 24=boundary violation, 30=permanent I/O error, 35=file not found on OPEN, 39=conflict between DCB attributes.",
        code: "SELECT EMPLOYEE-FILE\n    ASSIGN TO EMPDATA\n    ORGANIZATION IS INDEXED\n    ACCESS IS DYNAMIC\n    RECORD KEY IS EMP-ID\n    FILE STATUS IS WS-FILE-STATUS.\n\n* Check after every I/O:\nREAD EMPLOYEE-FILE INTO WS-EMP-RECORD\n    INVALID KEY CONTINUE\nEND-READ\nIF WS-FILE-STATUS = '23'\n    PERFORM RECORD-NOT-FOUND\nELSE IF WS-FILE-STATUS NOT = '00'\n    PERFORM IO-ERROR-HANDLER",
        tip: "Check file status after EVERY I/O operation including OPEN and CLOSE. Many production bugs are caused by undetected I/O errors because programmers skip status checking.",
        quizOptions: ["VSAM file status is only checked after WRITE", "VSAM File Status 2-byte codes: 00=success, 10=EOF, 22=duplicate key, 23=not found, 30=I/O error, 35=file not found", "File status is automatically handled by COBOL", "File status only matters for KSDS files"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_018", category: "VSAM", level: "Expert",
        question: "What are VSAM control intervals (CI) and control areas (CA)?",
        answer: "Control Interval (CI): the unit of VSAM I/O transfer (4KB to 32KB). Contains records, free space, and a CIDF (Control Interval Definition Field) at the end. Optimal CI size balances I/O size vs wasted space for smaller records. Control Area (CA): a group of CIs (typically one cylinder). CA splits are more expensive than CI splits as they affect an entire cylinder.",
        code: "/* Specify CI size at definition: */\nDEFINE CLUSTER\n    (NAME(PROD.TRANS)\n     INDEXED KEYS(8,0)\n     CONTROLINTERVALSIZE(4096)  /* 4KB CI */\n     RECORDSIZE(200,200)\n     FREESPACE(20,10)\n     CYLINDERS(50,10))\n/* Rule: CI should be multiple of physical track size */",
        tip: "For random access workloads, smaller CIs (4096-8192) reduce buffer memory. For sequential access, larger CIs (16384-32768) improve throughput. Match CI size to disk track geometry for optimal performance.",
        quizOptions: ["CIs and CAs are the same", "CI is the I/O unit containing records and free space (4-32KB); CA groups CIs (typically a cylinder) for storage management", "CA size is always equal to one disk cylinder", "CI must always be 4096 bytes"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_019", category: "VSAM", level: "Intermediate",
        question: "How do you use IDCAMS to copy a VSAM file from one volume to another?",
        answer: "Use IDCAMS REPRO to unload VSAM to a sequential file, then redefine the cluster on the new volume and reload. Alternatively, DFSMSdss COPY handles VSAM file migration including updating catalog entries automatically. For in-place reorganization during copy, use REPRO with the REUSE parameter.",
        code: "/* Option 1: Using IDCAMS REPRO */\n//STEPA   EXEC PGM=IDCAMS\n//INVSAM  DD DSN=PROD.OLD.CLUSTER,DISP=SHR\n//SEQWORK DD DSN=&&WORK,DISP=(NEW,PASS)\n//SYSIN   DD *\n  REPRO INFILE(INVSAM) OUTFILE(SEQWORK)\n  DELETE PROD.OLD.CLUSTER\n  DEFINE CLUSTER (NAME(PROD.OLD.CLUSTER) VOLUMES(NEWDISK) ...)\n  REPRO INFILE(SEQWORK) OUTFILE(NEWVSAM)\n/*\n\n/* Option 2: DFSMSdss (simpler): */\n//DSSCP   EXEC PGM=ADRDSSU\n//SYSIN   DD *\n  COPY DATASET(INCLUDE(PROD.OLD.CLUSTER))\n       TOVOLUME(NEWDISK) REPLACE\n/*",
        tip: "DFSMSdss COPY is simpler for VSAM migration as it automatically handles catalog entry updates. IDCAMS REPRO gives more control over the definition parameters.",
        quizOptions: ["VSAM files cannot be moved between volumes", "Use IDCAMS REPRO to unload/reload, or DFSMSdss COPY which automatically updates catalog entries for VSAM volume migration", "IEBCOPY moves VSAM files between volumes", "Volume migration requires system restart"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_020", category: "VSAM", level: "Expert",
        question: "What is VSAM STRNO parameter and how does it affect concurrent access?",
        answer: "STRNO (String Number) specifies the number of concurrent requests a VSAM file can process simultaneously. Each string provides one complete set of I/O resources (buffers, pointers). STRNO determines how many concurrent COBOL OPEN statements or parallel access paths can operate on the same cluster. For CICS: STRNO must match or exceed the CICS STRINGS parameter for the file.",
        code: "/* Define with multiple strings for concurrent access: */\nDEFINE CLUSTER\n    (NAME(CICS.SHARED.FILE)\n     STRNO(5)          /* 5 concurrent access paths */\n     SHAREOPTIONS(2,3)\n     ...)\n\n/* Or specify in JCL AMP parameter: */\n//CICSFILE DD DSN=CICS.SHARED.FILE,DISP=SHR,\n//            AMP=('STRNO=5,BUFND=10,BUFNI=5')",
        tip: "CICS file definitions include a STRINGS parameter that must not exceed the VSAM STRNO. Size STRNO based on peak concurrent transaction rate accessing the file.",
        quizOptions: ["STRNO controls record length", "STRNO specifies concurrent access paths; must match or exceed the CICS STRINGS setting for shared files", "STRNO is the same as BUFFERSPACE", "STRNO is only relevant for ESDS files"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_021", category: "VSAM", level: "Intermediate",
        question: "What is the difference between COBOL ACCESS IS SEQUENTIAL, RANDOM, and DYNAMIC for VSAM?",
        answer: "ACCESS IS SEQUENTIAL: reads/writes only in key order (forward). Required for loading KSDS. READ NEXT navigates. ACCESS IS RANDOM: accesses specific records by key. Cannot use READ NEXT. ACCESS IS DYNAMIC: supports both sequential and random in the same program. Use READ for random, READ NEXT for sequential. Most flexible but requires careful mode management.",
        code: "SELECT EMP-FILE ASSIGN TO EMPDATA\n    ORGANIZATION IS INDEXED\n    ACCESS IS DYNAMIC          /* Both sequential and random */\n    RECORD KEY IS EMP-KEY.\n\n* Random access:\nMOVE '12345' TO EMP-KEY\nREAD EMP-FILE INVALID KEY PERFORM NOT-FOUND\n\n* Sequential (after START):\nSTART EMP-FILE KEY >= EMP-KEY\nREAD EMP-FILE NEXT AT END PERFORM EOF-HANDLER",
        tip: "Use ACCESS IS DYNAMIC when you need to process specific records AND also browse ranges. Use RANDOM when only direct key access is needed for performance.",
        quizOptions: ["All VSAM access modes are identical", "SEQUENTIAL=key-ordered only, RANDOM=direct key only, DYNAMIC=both sequential and random in same program", "RANDOM allows READ NEXT operations", "DYNAMIC is not supported in standard COBOL"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_022", category: "VSAM", level: "Expert",
        question: "How do you perform VSAM delete and REWRITE in COBOL?",
        answer: "REWRITE replaces an existing record: must READ the record first (sequential organization requirement), modify in Working Storage, then REWRITE FROM the new data. DELETE removes a record: for KSDS, you must READ first (sequential) or set the key and DELETE directly (random/dynamic). For ESDS: records cannot be deleted or their length changed.",
        code: "* REWRITE (must READ first for sequential):\nMOVE '12345' TO EMP-KEY\nREAD EMP-FILE INTO WS-EMP\n    INVALID KEY PERFORM NOT-FOUND\n    NOT INVALID KEY\n        MOVE WS-NEW-SALARY TO WS-EMP-SALARY\n        REWRITE EMP-RECORD FROM WS-EMP\n            INVALID KEY PERFORM REWRITE-ERROR\nEND-READ\n\n* DELETE by key (dynamic/random access):\nMOVE '99999' TO EMP-KEY\nDELETE EMP-FILE RECORD\n    INVALID KEY PERFORM DELETE-ERROR",
        tip: "File Status 43 (REWRITE without prior read) occurs if you REWRITE without first READing in sequential mode. Always READ before REWRITE. For random access, DELETE by key is more direct.",
        quizOptions: ["REWRITE doesn't require a prior READ", "REWRITE requires READ first; DELETE by key works directly in random/dynamic access; ESDS records cannot be deleted", "DELETE removes all records with the same key", "REWRITE cannot change record length"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_023", category: "VSAM", level: "Expert",
        question: "What is the VSAM HURBA (High-Used Relative Byte Address) and why is it important?",
        answer: "HURBA (High-Used Relative Byte Address) indicates the highest byte position in the VSAM cluster that has been written to. It marks the boundary between allocated and used space. HURBA is checked by VSAM to determine if space is available for new records and is used by utilities to determine the active portion of the cluster for backup and copy operations.",
        code: "/* Check HURBA via LISTCAT ALL: */\n//LISTCAT  EXEC PGM=IDCAMS\n//SYSIN    DD *\n  LISTCAT ENTRIES(PROD.CLUSTER) ALL\n/* In output look for:\n   HIGH-USED-RBA  000000000A2B4000\n   HIGH-ALLOC-RBA 000000001F400000 */\n/* HURBA < ALLOC means unused allocated space */",
        tip: "A very low HURBA relative to allocated space indicates over-allocation. A HURBA close to ALLOC indicates the file may need space expansion soon.",
        quizOptions: ["HURBA is the record count", "HURBA marks the highest byte position written to; VSAM uses it to determine available space and utilities use it for backup boundaries", "HURBA is only relevant for ESDS files", "HURBA is automatically reset by REPRO"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_024", category: "VSAM", level: "Intermediate",
        question: "How does VSAM REUSE option work?",
        answer: "REUSE allows a VSAM cluster to be reset to empty state by opening it with OPEN OUTPUT after it contains data. Without REUSE, opening a non-empty cluster with OPEN OUTPUT gives an error. With REUSE, the cluster's HURBA is reset to 0, effectively making it empty. Used when the same VSAM file is reloaded each batch run.",
        code: "/* Define with REUSE: */\nDEFINE CLUSTER\n    (NAME(BATCH.WORK.CLUSTER)\n     REUSE          /* Allow reset by OPEN OUTPUT */\n     INDEXED KEYS(8,0)\n     RECORDSIZE(200,200)\n     CYLINDERS(50,10))\n\n/* In COBOL, OPEN OUTPUT resets the cluster: */\nOPEN OUTPUT VSAM-WORK-FILE  /* Resets HURBA to 0, empty file */",
        tip: "REUSE is perfect for VSAM work files that are completely reloaded each batch cycle. It avoids delete/redefine overhead and maintains the cluster allocation.",
        quizOptions: ["REUSE allows reading previously deleted records", "REUSE allows OPEN OUTPUT to reset a VSAM cluster to empty state, useful for batch work files reloaded each run", "REUSE shares the file between multiple jobs", "REUSE is only for ESDS datasets"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_025", category: "VSAM", level: "Expert",
        question: "What is VSAM catalog recovery using the DIAGNOSE command?",
        answer: "IDCAMS DIAGNOSE checks VSAM catalog structures for inconsistencies. It verifies: catalog record integrity, component-to-cluster relationships, volume information accuracy, pointers between catalog entries. DIAGNOSE ALL checks everything. Useful after catalog corruption or volume failures. Output identifies specific inconsistencies requiring repair via LISTCAT/RECATALOG/ALTER.",
        code: "//DIAGCAT  EXEC PGM=IDCAMS\n//SYSPRINT DD SYSOUT=*\n//MCAT     DD DSN=MASTER.CATALOG.NAME,DISP=SHR\n//SYSIN    DD *\n  DIAGNOSE INFILE(MCAT) -\n    ALL -\n    ERRORLIMIT(100)      /* Stop after 100 errors */\n/*\n/* Review SYSPRINT for error messages */\n/* IDC messages indicate specific catalog problems */",
        tip: "Run DIAGNOSE after any volume or catalog incident. Catalog corruption is a serious issue that can make datasets inaccessible. Early detection prevents data loss.",
        quizOptions: ["DIAGNOSE creates new catalog entries", "IDCAMS DIAGNOSE checks VSAM catalog integrity, verifying record structures, component relationships, and volume information", "DIAGNOSE is only for user catalogs", "DIAGNOSE repairs catalog errors automatically"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_026", category: "VSAM", level: "Intermediate",
        question: "What is a VSAM RRDS (Relative Record Dataset) and how is it different from KSDS?",
        answer: "RRDS stores fixed-size records in numbered slots (relative record numbers, 1-based). No key field needed; access by slot number. Records can be added only to empty or new slots. Unlike KSDS which has variable-position records accessed by key, RRDS slots are fixed-size and accessed by number, making it ideal for direct lookup tables where the record number is the access key.",
        code: "/* Define RRDS: */\nDEFINE CLUSTER\n    (NAME(DIRECT.ACCESS.TABLE)\n     NUMBERED          /* RRDS type */\n     RECORDSIZE(100,100)\n     RECORDS(10000,1000))\n\n/* COBOL access: */\nSELECT RRDS-FILE ASSIGN TO RRDSDDN\n    ORGANIZATION IS RELATIVE\n    ACCESS IS RANDOM\n    RELATIVE KEY IS WS-SLOT-NUMBER.",
        tip: "RRDS is ideal for arrays where you need O(1) access by a numeric key. It's faster than KSDS for sequential number access because there's no index overhead.",
        quizOptions: ["RRDS and KSDS are identical in function", "RRDS stores fixed-size records in numbered slots accessed by relative record number; no key field; unlike KSDS which uses key-based access", "RRDS is only for numeric data", "RRDS supports key-based access like KSDS"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b3_027", category: "VSAM", level: "Expert",
        question: "How do you handle VSAM file locking and enqueue in batch and online environments?",
        answer: "VSAM uses internal locking at the dataset level (DISP=OLD for exclusive, DISP=SHR for shared). For record-level locking in CICS, use RLS (Record Level Sharing) with Coupling Facility. VSAM enqueue (ENQ macro) serializes access. For batch vs CICS sharing, use SHAREOPTIONS(1,3) with CICS file quiesce during batch exclusive operations.",
        code: "/* Batch exclusive while CICS is running: */\n/* CICS must quiesce file before batch opens DISP=OLD */\n/* Or use RLS which manages record-level locking */\n\n/* CICS file quiesce JCL command: */\n//QUIESCE EXEC PGM=DFHCSDUP\n//SYSIN   DD *\n  QUIESCE FILE(EMPFILE)\n/* Now safe to run batch with DISP=OLD */",
        tip: "Coordinate batch file access windows with CICS operations. Use CICS File Quiesce/Resume to safely open VSAM files exclusively during batch maintenance.",
        quizOptions: ["VSAM automatically handles all locking", "VSAM uses dataset-level locking via DISP; for record-level locking use RLS; batch vs CICS sharing requires coordinated quiesce operations", "Record-level locking is automatic", "VSAM locking is not configurable"],
        quizAnswerIndex: 1
    },

    // ============ DB2 QUESTIONS ============
    {
        id: "db2_b3_001", category: "DB2", level: "Beginner",
        question: "What is IBM DB2 and how does it differ from other SQL databases?",
        answer: "IBM DB2 for z/OS (officially IBM Db2) is a relational database management system native to IBM mainframes. Key differences from other SQL: (1) Uses VSAM linear datasets for tablespaces. (2) Buffer pools are managed explicitly. (3) Bind step creates access path package/plan. (4) Uses SPUFI/DSNTEP2 for SQL execution. (5) EXPLAIN command shows access path. (6) Tight integration with COBOL, CICS, IMS, and z/OS security.",
        tip: "DB2 for z/OS is optimized for high-volume, high-concurrency OLTP. Its buffer pool management, parallel query, and z/OS integration are unmatched for mainframe workloads.",
        quizOptions: ["DB2 is identical to SQL Server", "DB2 for z/OS uses VSAM storage, requires a Bind step, and has unique z/OS integration not found in other databases", "DB2 doesn't support standard SQL", "DB2 only runs on IBM Power systems"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_002", category: "DB2", level: "Beginner",
        question: "What is the DB2 BIND process and why is it necessary?",
        answer: "BIND (or REBIND) translates DB2 SQL statements embedded in programs into executable access plans. The bind step: (1) Validates SQL syntax, (2) Checks authorization against current privileges, (3) Selects optimal access path (indexes, sort order), (4) Creates a PACKAGE or PLAN containing the compiled SQL. BIND must be done after: program recompilation, table/index changes, or performance tuning.",
        code: "/* BIND a package: */\n//BINDJOB  EXEC PGM=IKJEFT01,DYNAMNBR=20\n//SYSTSPRT DD SYSOUT=*\n//SYSPRINT DD SYSOUT=*\n//SYSTSIN  DD *\n  DSN SYSTEM(DBPROD)\n  BIND PACKAGE(PRODPKGE) MEMBER(EMPQUERY) -\n    ACT(REP) ISOLATION(CS) EXPLAIN(YES) -\n    OWNER(EMPAPP) QUALIFIER(PRODSCHM)\n  END\n/*",
        tip: "Always REBIND after: runstats updates, major data volume changes, or new indexes. Outdated access paths due to stale statistics are a top performance issue in DB2 shops.",
        quizOptions: ["BIND is optional for DB2 programs", "BIND translates SQL to executable access paths, validating syntax, checking authorization, and selecting optimal access plan", "BIND is only needed after table changes", "BIND compiles the COBOL program"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_003", category: "DB2", level: "Beginner",
        question: "What is the SQLCA and how is it used in COBOL DB2 programs?",
        answer: "SQLCA (SQL Communication Area) is a structure populated by DB2 after every SQL statement. Key fields: SQLCODE (return code: 0=success, positive=warning, negative=error), SQLERRM (error message text), SQLSTATE (5-char ANSI standard code), SQLERRD (extended return codes). Declared with EXEC SQL INCLUDE SQLCA END-EXEC.",
        code: "EXEC SQL INCLUDE SQLCA END-EXEC.\n\n* Check SQLCODE after every SQL:\nEXEC SQL\n    SELECT SALARY INTO :WS-SALARY\n    FROM EMPLOYEE\n    WHERE EMPNO = :WS-EMPNO\nEND-EXEC\n\nIF SQLCODE = 0\n    PERFORM PROCESS-FOUND\nELSE IF SQLCODE = 100\n    PERFORM RECORD-NOT-FOUND\nELSE\n    PERFORM DB2-ERROR-HANDLER\nEND-IF",
        tip: "Always check SQLCODE after EVERY SQL statement. SQLCODE 100 means 'not found' (not an error). Negative SQLCODEs are errors. Positive (non-100) are warnings.",
        quizOptions: ["SQLCA stores SQL statement text", "SQLCA is populated after every SQL statement with SQLCODE (return code), SQLSTATE, and error message information", "SQLCA is only needed for UPDATE statements", "SQLCA must be manually populated by the programmer"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_004", category: "DB2", level: "Beginner",
        question: "What is a DB2 cursor and when must you use one?",
        answer: "A DB2 cursor processes SELECT statements returning multiple rows. Without cursor: SELECT INTO works only when exactly one row is expected. With cursor: DECLARE CURSOR defines the query, OPEN executes it, FETCH retrieves rows one at a time, CLOSE releases resources. Cursors are mandatory when a SELECT returns 0 or multiple rows.",
        code: "EXEC SQL\n    DECLARE EMP-CURSOR CURSOR FOR\n        SELECT EMPNO, LASTNAME, SALARY\n        FROM EMPLOYEE\n        WHERE DEPTNO = :WS-DEPT\n        ORDER BY SALARY DESC\nEND-EXEC\n\nEXEC SQL OPEN EMP-CURSOR END-EXEC\n\nPERFORM UNTIL SQLCODE = 100\n    EXEC SQL\n        FETCH EMP-CURSOR\n        INTO :WS-EMPNO, :WS-LNAME, :WS-SALARY\n    END-EXEC\n    IF SQLCODE = 0 PERFORM PROCESS-ROW\nEND-PERFORM\n\nEXEC SQL CLOSE EMP-CURSOR END-EXEC",
        tip: "Always CLOSE cursors when done. Unclosed cursors hold locks and consume resources. Use WITH HOLD to keep cursor open across COMMIT checkpoints.",
        quizOptions: ["Cursors are optional for all queries", "Cursors are required when SELECT can return multiple rows; use DECLARE/OPEN/FETCH/CLOSE", "Cursors are only for UPDATE operations", "SELECT INTO can handle any number of rows"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_005", category: "DB2", level: "Intermediate",
        question: "What are the DB2 isolation levels and their locking implications?",
        answer: "DB2 isolation levels (specified in BIND): RR (Repeatable Read) - acquires and holds all locks, prevents phantom reads, most restrictive. RS (Read Stability) - holds locks on qualifying rows, prevents non-repeatable reads. CS (Cursor Stability) - holds lock only on current row, allows reads of committed data. UR (Uncommitted Read) - no locks acquired, can read uncommitted (dirty) data.",
        code: "/* BIND with isolation level: */\nBIND PACKAGE(MYAPP) MEMBER(QUERY) ISOLATION(CS)\n/* CS is most common for OLTP applications */\n\n/* Or override at statement level: */\nEXEC SQL\n    SELECT * FROM INVENTORY WITH UR\nEND-EXEC  /* Dirty read - no locks */",
        tip: "Use CS for most OLTP programs. Use RR for report programs requiring consistent data during long reads. UR is only for approximate queries where dirty reads are acceptable.",
        quizOptions: ["All isolation levels acquire the same locks", "RR=holds all locks, RS=holds row locks, CS=current row lock only, UR=no locks; affects concurrency and data consistency", "UR provides the highest data consistency", "Isolation level cannot be set per-statement"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_006", category: "DB2", level: "Intermediate",
        question: "What is DB2 EXPLAIN and how do you interpret it?",
        answer: "DB2 EXPLAIN stores access path information in the PLAN_TABLE. After BIND EXPLAIN(YES) or EXPLAIN PLAN FOR, query PLAN_TABLE to see: ACCESSTYPE (I=index, R=tablespace scan), MATCHCOLS (index columns matched), PREFETCH (Y=sequential prefetch), SORTC_JOIN (sort for join), JOIN types, and ORDER BY handling. High PREFETCH and index use indicates good access paths.",
        code: "/* View access path after BIND: */\nSELECT QUERYNO, QBLOCKNO, PLANNO,\n       TNAME, ACCESSTYPE, MATCHCOLS,\n       INDEXONLY, PREFETCH\nFROM SYSIBM.PLAN_TABLE\nWHERE QUERYNO = 1\nORDER BY QUERYNO, QBLOCKNO, PLANNO;\n\n/* Or inline: */\nEXPLAIN PLAN FOR\n    SELECT * FROM EMPLOYEE WHERE DEPTNO = 'A00';",
        tip: "Check EXPLAIN after every significant query change. ACCESSTYPE='R' (tablespace scan) on large tables is usually a performance problem requiring an index.",
        quizOptions: ["EXPLAIN shows SQL syntax errors", "EXPLAIN stores access path details in PLAN_TABLE showing index usage, join methods, prefetch, and match columns for performance analysis", "EXPLAIN only works for SELECT statements", "EXPLAIN automatically optimizes the query"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_007", category: "DB2", level: "Intermediate",
        question: "What are DB2 tablespaces and what types exist?",
        answer: "A tablespace is a VSAM LDS that stores one or more DB2 tables. Types: (1) Simple tablespace: one table per tablespace. (2) Partitioned tablespace: large tables split across partitions for parallel processing. (3) Segmented tablespace: multiple tables, pages divided into segments. (4) Universal tablespace (UTS): modern type combining partition and segment features. (5) PBR (Partition By Range): modern partitioned.",
        code: "/* Create a tablespace: */\nCREATE TABLESPACE EMPTSBP\n    IN EMPDB\n    USING STOGROUP DSNSTOGG\n    PRIQTY 720\n    SECQTY 144\n    ERASE NO\n    PCTFREE 5\n    SEGSIZE 32     /* Segments of 32 pages */\n    BUFFERPOOL BP0;\n\n/* Partition by range (modern UTS): */\nCREATE TABLESPACE PARTTS IN EMPDB\n    NUMPARTS 4\n    USING STOGROUP DSNSTOGG\n    BUFFERPOOL BP0;",
        tip: "Use partition by range tablespaces for large tables. Partitioning enables parallel queries, partition-level utilities (REORG, COPY), and improves manageability.",
        quizOptions: ["DB2 stores all tables in a single tablespace", "DB2 tablespace types: Simple, Partitioned, Segmented, Universal (UTS), and PBR, stored as VSAM LDS", "Tablespaces and tables are the same object", "Tablespaces require one dataset per table"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_008", category: "DB2", level: "Intermediate",
        question: "How do you create a DB2 index and what factors determine its effectiveness?",
        answer: "CREATE INDEX defines an index on one or more table columns. Effectiveness factors: CARDINALITY (uniqueness of column values - high cardinality = better index), CLUSTERRATIO (how well data is physically sorted by index key - close to 1.0 is best), column sequence matching query predicates, leading column selectivity. Composite indexes should have most selective columns first.",
        code: "/* Create index: */\nCREATE UNIQUE INDEX EMP_X01\n    ON EMPLOYEE (EMPNO ASC);\n\nCREATE INDEX EMP_X02\n    ON EMPLOYEE (DEPTNO ASC, SALARY DESC)\n    CLUSTER;  /* Physical data order matches this index */\n\n/* DB2 uses an index when: */\n/* 1. Predicate matches index leading columns */\n/* 2. MATCHCOLS >= 1 in PLAN_TABLE */\n/* 3. CLUSTERRATIO is high (> 0.8) */",
        tip: "Index on foreign key columns to prevent table locks on parent table during child table DML. Missing FK indexes cause lock escalation in parent tables.",
        quizOptions: ["All columns should have indexes", "Index effectiveness depends on cardinality, cluster ratio, column sequence matching predicates, and selectivity", "Indexes always improve query performance", "Composite indexes should have least selective column first"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_009", category: "DB2", level: "Expert",
        question: "What is DB2 RUNSTATS and why must it be run regularly?",
        answer: "RUNSTATS collects statistics about DB2 objects: table rowcounts, column cardinality, index statistics (CLUSTERRATIO, NLEAF, NLEVELS), tablespace statistics (NPAGES, PAGESAVE). DB2 optimizer uses these statistics to select access paths. Stale statistics (from RUNSTATS not run after major data changes) cause DB2 to choose inefficient access paths - a common performance problem.",
        code: "/* RUNSTATS for table and all indexes: */\n//RUNSTATS EXEC PGM=IKJEFT01\n//SYSTSIN  DD *\n  DSN SYSTEM(DBPROD)\n  RUNSTATS TABLESPACE EMPDB.EMPTSBP -\n    TABLE (EMPLOYEE) -\n    INDEX (ALL) -\n    KEYCARD -\n    FREQVAL NUMCOLS 2 COUNT 10\n  END\n/*",
        tip: "Schedule RUNSTATS after any bulk load, major delete/insert, or significant data pattern change. Check REBIND after RUNSTATS to let the optimizer use new statistics.",
        quizOptions: ["RUNSTATS updates table data", "RUNSTATS collects table and index statistics (cardinality, cluster ratio) used by the DB2 optimizer for access path selection", "RUNSTATS is only needed for partitioned tablespaces", "DB2 automatically updates statistics continuously"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_010", category: "DB2", level: "Expert",
        question: "What is DB2 REORG and when is it needed?",
        answer: "REORG (Reorganization) physically reorganizes tablespace or index data: compresses free space, eliminates page fragmentation, rebuilds indexes, and reclusters data to match the clustering index. REORG is needed when: REORGCHK shows high PAGESAVE or poor CLUSTERRATIO, after bulk deletes create lots of empty pages, or when queries degrade due to poor physical organization.",
        code: "/* Tablespace REORG: */\n//REORGJOB EXEC PGM=DSNUTILB,PARM='DBPROD REORGJOB'\n//SYSIN    DD *\n  REORG TABLESPACE EMPDB.EMPTSBP -\n    INDEX (EMPLOYEE.EMP_X01) -\n    LOG YES -\n    STATISTICS -\n    KEEPDICTIONARY -\n    DRAIN NONE\n  RUNSTATS TABLESPACE EMPDB.EMPTSBP TABLE (ALL) INDEX (ALL)\n/*",
        tip: "Use REORG DRAIN NONE for minimal impact on production. For heavy fragmentation, schedule offline REORG during maintenance windows. Always run RUNSTATS after REORG and REBIND key programs.",
        quizOptions: ["REORG deletes and recreates tables", "REORG physically reorganizes tablespace/index data eliminating fragmentation and restoring physical clustering order", "REORG is only for VSAM files", "REORG automatically runs when fragmentation occurs"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_011", category: "DB2", level: "Expert",
        question: "What is DB2 lock escalation and how do you prevent it?",
        answer: "Lock escalation occurs when DB2 upgrades many individual row/page locks to a single tablespace lock when the lock limit threshold (LOCKMAX) is exceeded. This blocks all other users from the tablespace. Prevention: (1) Commit frequently to release locks. (2) Use CS isolation instead of RR/RS. (3) Increase LOCKMAX. (4) Create appropriate indexes to reduce rows locked. (5) Reduce transaction size.",
        code: "/* Frequent commits prevent lock escalation: */\nPERFORM VARYING WS-I FROM 1 BY 1 UNTIL WS-I > WS-TOTAL\n    EXEC SQL\n        UPDATE EMPLOYEE SET SALARY = SALARY * 1.05\n        WHERE EMPNO = :WS-EMPNO(WS-I)\n    END-EXEC\n    IF FUNCTION MOD(WS-I, 500) = 0\n        EXEC SQL COMMIT END-EXEC  /* Commit every 500 rows */\n    END-IF\nEND-PERFORM\nEXEC SQL COMMIT END-EXEC",
        tip: "Lock escalation is a top DB2 production incident. Monitor using DSNTRACE or performance monitoring tools. The fix is almost always more frequent COMMITs.",
        quizOptions: ["Lock escalation is a normal DB2 optimization", "Lock escalation upgrades many row locks to tablespace lock when LOCKMAX is exceeded; prevent with frequent COMMIT and CS isolation", "Lock escalation only occurs with UR isolation", "Increasing table size prevents lock escalation"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_012", category: "DB2", level: "Expert",
        question: "What is a DB2 deadlock and how does DB2 handle it?",
        answer: "A deadlock occurs when two transactions each hold a lock needed by the other, creating a circular wait. DB2 detects deadlocks using the Lock Manager's deadlock detection algorithm. The victim (usually the newer or lower-cost transaction) receives SQLCODE -911 (deadlock) or -913 (timeout). The victim's changes are rolled back. The application must handle -911 by retrying the transaction.",
        code: "/* Handle deadlock in COBOL DB2: */\nPERFORM DB2-UPDATE\n\nDB2-UPDATE.\n    EXEC SQL\n        UPDATE ACCOUNT SET BALANCE = :WS-NEWBAL\n        WHERE ACCT = :WS-ACCT\n    END-EXEC\n    EVALUATE SQLCODE\n        WHEN 0    CONTINUE\n        WHEN -911 PERFORM HANDLE-DEADLOCK  /* Retry logic */\n        WHEN -913 PERFORM HANDLE-TIMEOUT\n        WHEN OTHER PERFORM DB2-ERROR\n    END-EVALUATE\n\nHANDLE-DEADLOCK.\n    EXEC SQL ROLLBACK END-EXEC\n    ADD 1 TO WS-RETRY-COUNT\n    IF WS-RETRY-COUNT <= 3 PERFORM DB2-UPDATE.",
        tip: "Design applications to acquire locks in the same order across all transactions. This prevents deadlocks. Use short transactions and frequent COMMITs as additional protection.",
        quizOptions: ["Deadlocks are automatically resolved without error", "Deadlocks create circular lock waits; DB2 detects and rolls back the victim with SQLCODE -911/-913; application must retry", "Deadlocks only occur with SERIALIZABLE isolation", "DB2 prevents all deadlocks automatically"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_013", category: "DB2", level: "Intermediate",
        question: "What are DB2 host variables and how are they declared?",
        answer: "Host variables are COBOL Working Storage items used to exchange data with DB2 SQL statements. They're prefixed with colon (:) in SQL. Declare in COBOL's Working Storage or in SQL DECLARE SECTION. Must match DB2 column data types. Null indicators (small integer variables) detect NULL values. Names cannot contain hyphens in SQL (use underscore-equivalent or DCLGEN).",
        code: "EXEC SQL BEGIN DECLARE SECTION END-EXEC\n01 WS-EMPNO   PIC X(6).\n01 WS-SALARY  PIC S9(7)V99 COMP-3.\n01 WS-DEPT    PIC X(3).\nEXEC SQL END DECLARE SECTION END-EXEC\n\n01 WS-NULL-IND    PIC S9(4) COMP.  /* NULL indicator */\n\nEXEC SQL\n    SELECT SALARY, DEPT INTO :WS-SALARY :WS-NULL-IND,\n           :WS-DEPT\n    FROM EMPLOYEE WHERE EMPNO = :WS-EMPNO\nEND-EXEC\n\nIF WS-NULL-IND = -1 PERFORM SALARY-IS-NULL",
        tip: "Use DCLGEN to automatically generate host variable declarations from DB2 table definitions. This ensures type matching and reduces coding errors.",
        quizOptions: ["Host variables are optional in DB2 SQL", "Host variables are COBOL fields prefixed with : in SQL for data exchange; null indicators detect NULL values", "Host variables must be level 77 items", "Host variables use # prefix in SQL"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_014", category: "DB2", level: "Expert",
        question: "What is DCLGEN (Declaration Generator) and how do you use it?",
        answer: "DCLGEN generates COBOL data declarations for DB2 tables and host variable declarations. It connects to DB2 and retrieves the table's column definitions, generating correct PIC clauses that match DB2 data types. Output is stored as a copybook member. Use COPY DCLGEN-member in programs to include the generated declarations.",
        code: "/* Generate DCLGEN in TSO: */\nDCLGEN TABLE(EMPLOYEE)\n        LIBRARY(COBOL.COPYLIB(DCLEMP))\n        ACTION(REPLACE)\n        LANGUAGE(COBOL)\n        APOST\n\n/* Generated output in COBOL.COPYLIB(DCLEMP): */\n     01  DCLEMPLOYEE.\n         10  EMPNO         PIC X(6).\n         10  FIRSTNME      PIC X(12).\n         10  MIDINIT       PIC X(1).\n         10  LASTNAME      PIC X(15).\n         10  WORKDEPT      PIC X(3).\n         10  SALARY        PIC S9(7)V99 USAGE COMP-3.",
        tip: "Always use DCLGEN to generate host variable declarations rather than coding them manually. Manually coded declarations are often incorrect in data type or length.",
        quizOptions: ["DCLGEN generates SQL procedures", "DCLGEN generates correct COBOL host variable declarations from DB2 table metadata for use as copybooks", "DCLGEN requires special DB2 authorization", "DCLGEN is only for CICS programs"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_015", category: "DB2", level: "Intermediate",
        question: "What is a DB2 COMMIT and ROLLBACK and when are they used?",
        answer: "COMMIT makes all changes since the last COMMIT permanent and releases locks. ROLLBACK undoes all changes since the last COMMIT and releases locks. In DB2: work begins implicitly at program start or after each COMMIT. CICS handles commits via SYNCPOINT command instead. Programs must COMMIT periodically to: release locks, allow recovery checkpoints, and reduce rollback overhead.",
        code: "/* Batch program with periodic commit: */\nPERFORM VARYING WS-COUNT FROM 1 BY 1\n    UNTIL WS-EOF = 'Y'\n    READ INPUT-FILE AT END MOVE 'Y' TO WS-EOF\n    NOT AT END\n        EXEC SQL UPDATE ... END-EXEC\n        IF FUNCTION MOD(WS-COUNT, 1000) = 0\n            EXEC SQL COMMIT END-EXEC  /* Every 1000 rows */\n        END-IF\nEND-PERFORM\nEXEC SQL COMMIT END-EXEC  /* Final commit */\n\n/* On error: */\nEXEC SQL ROLLBACK END-EXEC",
        tip: "Never hold a transaction open for user input. Commit before waiting for external events. Long-running uncommitted transactions are a major source of lock contention.",
        quizOptions: ["COMMIT only saves SELECT results", "COMMIT makes changes permanent and releases locks; ROLLBACK undoes changes; use COMMIT periodically to release locks", "ROLLBACK commits partial work", "Programs automatically commit when they end"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_016", category: "DB2", level: "Expert",
        question: "How does DB2 dynamic SQL work and when should it be used?",
        answer: "Dynamic SQL constructs and executes SQL at runtime using PREPARE and EXECUTE (or EXECUTE IMMEDIATE for one-time). The query text is in a host variable string. Useful when: SQL structure isn't known at compile time, building query tools, conditional WHERE clauses needed. Drawbacks: no compile-time checking, access path determined at runtime (less optimizable).",
        code: "01 WS-SQL-STMT PIC X(500).\n\nMOVE 'SELECT * FROM EMPLOYEE WHERE DEPTNO = ?' TO WS-SQL-STMT\n\nEXEC SQL\n    PREPARE DYNAMIC-STMT FROM :WS-SQL-STMT\nEND-EXEC\n\nEXEC SQL\n    DECLARE DYN-CURSOR CURSOR FOR DYNAMIC-STMT\nEND-EXEC\n\nEXEC SQL\n    OPEN DYN-CURSOR USING :WS-DEPT\nEND-EXEC",
        tip: "Use PREPARE (not EXECUTE IMMEDIATE) when the same SQL will execute multiple times - prepared statements are reused from the statement cache, improving performance.",
        quizOptions: ["Dynamic SQL is faster than static SQL", "Dynamic SQL prepares SQL from a string variable at runtime; useful when SQL structure isn't known at compile time", "Dynamic SQL doesn't require BIND", "Dynamic SQL cannot use indexes"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_017", category: "DB2", level: "Expert",
        question: "What are DB2 stored procedures and when should they be used?",
        answer: "DB2 stored procedures are programs stored and executed within the DB2 subsystem. They can be written in SQL PL, COBOL, C, or Java. Benefits: (1) Reduce network/IPC calls for multi-statement operations, (2) Encapsulate business logic at database level, (3) Better performance for remote access, (4) Reusable across applications. Call via CALL statement from COBOL or SQL.",
        code: "/* Create SQL PL stored procedure: */\nCREATE PROCEDURE GET_EMP_SALARY\n    (IN  P_EMPNO   CHAR(6),\n     OUT P_SALARY  DECIMAL(9,2),\n     OUT P_RETURN  SMALLINT)\n    LANGUAGE SQL\n    BEGIN\n        SELECT SALARY INTO P_SALARY\n        FROM EMPLOYEE WHERE EMPNO = P_EMPNO;\n        IF SQLCODE = 0 THEN SET P_RETURN = 0;\n        ELSE SET P_RETURN = -1;\n        END IF;\n    END\n\n/* Call from COBOL: */\nEXEC SQL CALL GET_EMP_SALARY(:WS-EMPNO, :WS-SALARY, :WS-RC) END-EXEC",
        tip: "Use stored procedures for complex business rules that multiple applications share. This centralizes logic and reduces application-level code duplication.",
        quizOptions: ["DB2 stored procedures must be written in COBOL", "DB2 stored procedures support SQL PL, COBOL, C, and Java; they encapsulate logic at the database level", "Stored procedures cannot return values", "Stored procedures are only for batch programs"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_018", category: "DB2", level: "Expert",
        question: "What is DB2 COPY and RECOVER utility and how are they used?",
        answer: "COPY creates an image copy (backup) of a tablespace or partition. Full image copy (FULL YES) copies all pages. Incremental copy copies only changed pages. RECOVER restores tablespace from image copies and then applies log records to reach a specific point in time. RECOVER TORBA (to relative byte address) or TOPOINT restore to exact recovery points.",
        code: "/* COPY tablespace: */\n//COPYJOB  EXEC PGM=DSNUTILB,PARM='DBPROD COPYJOB'\n//SYSIN    DD *\n  COPY TABLESPACE EMPDB.EMPTSBP -\n    DSNUM ALL -\n    FULL YES -\n    DEVT SYSDA\n/*\n\n/* RECOVER to current time: */\n//RECOVJOB EXEC PGM=DSNUTILB,PARM='DBPROD RECOVJOB'\n//SYSIN    DD *\n  RECOVER TABLESPACE EMPDB.EMPTSBP DSNUM ALL\n/*",
        tip: "Run COPY after REORG and after large bulk loads. Establish RTO/RPO objectives and configure COPY frequency to meet them. Always test RECOVER procedures in a non-production environment.",
        quizOptions: ["COPY makes a VSAM backup of the tablespace", "COPY creates image copies for recovery; RECOVER restores from image copies and applies logs to reach a specific point in time", "DB2 recovery is automatic without COPY", "COPY only works for simple tablespaces"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_019", category: "DB2", level: "Expert",
        question: "How do you implement DB2 referential integrity and what are the cascade options?",
        answer: "Referential integrity (RI) enforces parent-child relationships via FOREIGN KEY constraints. DELETE rules: CASCADE (delete children when parent deleted), RESTRICT (prevent parent delete if children exist), SET NULL (set FK to NULL on parent delete), NO ACTION (like RESTRICT, enforced at end of statement). For INSERT on child: parent row must exist. For UPDATE of parent key: similar rules.",
        code: "/* Create tables with referential integrity: */\nCREATE TABLE DEPARTMENT (\n    DEPTNO  CHAR(3) NOT NULL PRIMARY KEY,\n    DEPTNAME VARCHAR(36));\n\nCREATE TABLE EMPLOYEE (\n    EMPNO   CHAR(6) NOT NULL PRIMARY KEY,\n    DEPTNO  CHAR(3),\n    SALARY  DECIMAL(9,2),\n    FOREIGN KEY (DEPTNO)\n        REFERENCES DEPARTMENT (DEPTNO)\n        ON DELETE RESTRICT   /* Cannot delete dept with employees */\n        ON DELETE SET NULL); /* Or: set DEPTNO to NULL on delete */",
        tip: "Be cautious with CASCADE DELETE on large tables. Deleting one parent row can trigger cascading deletes of thousands of child rows, causing long transactions and lock issues.",
        quizOptions: ["DB2 doesn't support referential integrity", "DB2 RI enforces parent-child relationships with DELETE rules: CASCADE, RESTRICT, SET NULL, NO ACTION", "CASCADE is the only delete rule", "RI only works at the database level, not application"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_020", category: "DB2", level: "Expert",
        question: "What is DB2 utility LOAD and when is it preferred over INSERT?",
        answer: "LOAD ingests large volumes of data directly into DB2 tablespaces, bypassing SQL insert processing. Benefits: much faster than INSERT (often 10-100x), supports parallel loading, minimal logging (LOG NO option), direct tablespace manipulation. Drawbacks: tablespace in COPY_PENDING state after LOG NO load (must COPY), no individual row validation (enforced by ENFORCE option).",
        code: "//LOADJOB  EXEC PGM=DSNUTILB,PARM='DBPROD LOADJOB'\n//SYSREC   DD DSN=INPUT.DATA.FILE,DISP=SHR\n//SYSIN    DD *\n  LOAD DATA LOG NO -         /* High performance, no logging */\n    INTO TABLE EMPLOYEE -\n    (EMPNO    POSITION(1:6)   CHAR,\n     FIRSTNME POSITION(7:18)  CHAR,\n     SALARY   POSITION(19:27) DECIMAL EXTERNAL)\n    ENFORCE NO -              /* Skip RI checking (validate later) */\n    STATISTICS YES\n/*",
        tip: "Use LOAD LOG NO for initial loads and large data migrations. Remember to run COPY immediately after to put tablespace out of COPY_PENDING status. Run CHECK DATA to validate RI after ENFORCE NO loads.",
        quizOptions: ["LOAD and INSERT have identical performance", "LOAD bypasses SQL processing for high-speed bulk ingestion; much faster than INSERT; requires COPY after LOG NO", "LOAD only works with character data", "LOAD requires CICS authorization"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_021", category: "DB2", level: "Expert",
        question: "What are DB2 buffer pools and how are they tuned?",
        answer: "Buffer pools are memory areas caching frequently-accessed DB2 data and index pages. Multiple buffer pools (BP0-BP49, BP8K0-BP8K9, BP16K0, BP32K) support different page sizes. Key metrics: GETPAGES (total reads), SYNCHRONOUS reads (cache misses = physical I/O), HITRATIO (cache hit %). Tune by: increasing pool size for high-traffic tablespaces, using PGSTEAL=LRU, and separating pools for different workloads.",
        code: "/* View buffer pool statistics: */\nDISPLAY BUFFERPOOL(*) DETAIL  /* z/OS DISPLAY command */\n\n/* Assign tablespace to specific buffer pool: */\nCREATE TABLESPACE HOTDATA IN EMPDB\n    BUFFERPOOL BP8K0   /* Use 8K page size pool */\n    SEGSIZE 64;\n\n/* ALTER to change buffer pool: */\nALTER TABLESPACE EMPDB.EMPDATA BUFFERPOOL BP1;",
        tip: "Separate OLTP and DSS (report) workloads into different buffer pools to prevent report queries from evicting OLTP data. Use BP32K for DSS queries with large page sizes.",
        quizOptions: ["DB2 only has one buffer pool", "DB2 buffer pools cache pages for performance; multiple pools (BP0-BP49) support different page sizes; tune by size and workload separation", "Buffer pools are managed by z/OS, not DB2", "Buffer pool size is fixed and cannot be changed"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_022", category: "DB2", level: "Expert",
        question: "What is the DB2 catalog and directory and how are they different?",
        answer: "DB2 Catalog (SYSIBM.SYSxxx tables) stores metadata: table definitions, column definitions, index definitions, privileges, statistics. DB2 Directory (internal tables) stores internal DB2 control information not directly accessible via SQL: database descriptors, skeleton packages, system pages. The Catalog is queryable; the Directory is not. Both are in the DSNDB06 and DSNDB01 databases respectively.",
        code: "/* Query DB2 catalog for table info: */\nSELECT NAME, COLCOUNT, STATUS, CLUSTERTYPE\nFROM SYSIBM.SYSTABLES\nWHERE CREATOR = 'EMPSCHM'\nORDER BY NAME;\n\n/* Query index statistics: */\nSELECT IXNAME, CLUSTERRATIO, FULLKEYCARD, NLEAF, NLEVELS\nFROM SYSIBM.SYSINDEXES\nWHERE TBNAME = 'EMPLOYEE'",
        tip: "The DB2 catalog is a goldmine for performance tuning. Query SYSIBM.SYSTABLES, SYSIBM.SYSINDEXES, SYSIBM.SYSSTATISTICS for optimization data.",
        quizOptions: ["The catalog and directory are the same", "DB2 Catalog (SYSIBM.SYSxxx) is queryable metadata; Directory contains internal control information not accessible via SQL", "The directory stores table data", "The catalog is only for security information"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_023", category: "DB2", level: "Expert",
        question: "How does DB2 handle NULL values in SQL operations?",
        answer: "NULL represents absence of value (not zero or space). Rules: (1) Any arithmetic with NULL produces NULL. (2) Comparisons with NULL use IS NULL/IS NOT NULL (not = NULL). (3) GROUP BY treats NULLs as equal. (4) In COBOL, null indicators are -1 for null, 0 for not null. Functions: COALESCE(val, default), IFNULL(val, default), VALUE() handle NULLs. COUNT(*) counts all rows; COUNT(column) excludes NULLs.",
        code: "/* Correct NULL handling: */\nSELECT EMPNO,\n       COALESCE(SALARY, 0) AS SALARY_OR_ZERO,\n       CASE WHEN BONUS IS NULL THEN 'NO BONUS'\n            ELSE CHAR(BONUS)\n       END AS BONUS_DESC\nFROM EMPLOYEE\nWHERE MANAGER IS NOT NULL  /* NOT: WHERE MANAGER != NULL */\n\n/* In COBOL with null indicator: */\nIF WS-NULL-IND = -1\n    PERFORM HANDLE-NULL-SALARY",
        tip: "NULL handling is the most common source of SQL bugs. Always test with NULL data in your test cases. Use COALESCE to provide default values and avoid NULL propagation.",
        quizOptions: ["NULL equals zero in arithmetic", "NULL represents absence of value; any operation with NULL produces NULL; use IS NULL not = NULL; host variable null indicators detect NULLs", "NULLs are treated as spaces in comparisons", "COUNT(*) excludes rows with NULL primary keys"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_024", category: "DB2", level: "Expert",
        question: "What are DB2 triggers and how are they used?",
        answer: "DB2 triggers are programs that automatically execute when a specified SQL operation occurs on a table. Types: BEFORE (before the triggering SQL, can modify NEW values), AFTER (after the triggering SQL, for audit/notifications), INSTEAD OF (for updatable view manipulation). Triggers fire for INSERT, UPDATE, and/or DELETE. Uses: audit logging, enforcing complex business rules, maintaining derived data.",
        code: "/* Create an audit trigger: */\nCREATE TRIGGER EMP_SALARY_AUDIT\n    AFTER UPDATE OF SALARY ON EMPLOYEE\n    REFERENCING OLD AS OLD_ROW NEW AS NEW_ROW\n    FOR EACH ROW MODE DB2SQL\n    BEGIN ATOMIC\n        INSERT INTO SALARY_AUDIT\n        (EMPNO, OLD_SALARY, NEW_SALARY, CHG_DATE, CHG_USER)\n        VALUES (OLD_ROW.EMPNO, OLD_ROW.SALARY, NEW_ROW.SALARY,\n                CURRENT DATE, USER);\n    END",
        tip: "Triggers add overhead to every DML operation on the table. For high-volume tables, consider application-level audit logging instead of triggers to avoid performance impact.",
        quizOptions: ["DB2 triggers are only for batch operations", "DB2 triggers (BEFORE/AFTER/INSTEAD OF) execute automatically on INSERT/UPDATE/DELETE for audit, validation, and derived data", "Triggers can only execute SQL statements", "Triggers cannot access OLD/NEW row values"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_025", category: "DB2", level: "Expert",
        question: "What is the DB2 connection type and how do COBOL batch and CICS programs connect differently?",
        answer: "DB2 connection types: (1) TSO attachments (for TSO batch/interactive). (2) IMS and CICS attachments (for online programs via respective subsystems). (3) Call Attach Facility (CAF) for standalone programs calling DB2 directly. (4) RRSAF (RRS Attach Facility) for two-phase commit coordination. Batch programs use TSO attachment; CICS programs use CICS attachment (EXEC CICS + EXEC SQL). Thread management differs by attachment type.",
        code: "/* Batch (TSO attachment) - DSN command processor: */\n//RUNDB2   EXEC PGM=IKJEFT01\n//SYSTSIN  DD *\n  DSN SYSTEM(DBPROD)\n  RUN PROGRAM(MYPROG) PLAN(MYPLAN) LIB('LOAD.LIB')\n  END\n\n/* CICS (CICS attachment) - no special JCL needed: */\n/* CICS establishes DB2 connection at startup */\n/* COBOL just uses EXEC SQL ... END-EXEC */",
        tip: "CICS DB2 programs don't need DSN command processor - CICS manages the DB2 thread pool automatically. Configure CICS-DB2 thread pool (DSNC STRT) appropriately for peak concurrency.",
        quizOptions: ["Batch and CICS programs connect to DB2 identically", "Batch uses TSO attachment (DSN command); CICS uses CICS attachment (automatic thread management); each has different setup", "CICS programs cannot access DB2", "All programs use CAF attachment"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_026", category: "DB2", level: "Expert",
        question: "How does DB2 temporal data (SYSTEMPORAL, BITEMPORAL) work?",
        answer: "DB2 supports temporal tables that automatically maintain historical data: (1) SYSTEM-PERIOD TEMPORAL: DB2 tracks row history using a system-maintained time period (system time). Deleted/updated rows move to a history table. Query with AS OF SYSTEM TIME. (2) BITEMPORAL: both system and business time. Supports AS OF, FROM/TO, BETWEEN temporal predicates.",
        code: "/* Create temporal table: */\nCREATE TABLE EMPLOYEE (\n    EMPNO      CHAR(6) NOT NULL,\n    SALARY     DECIMAL(9,2),\n    SYS_BEGIN  TIMESTAMP(12) GENERATED ALWAYS AS ROW BEGIN,\n    SYS_END    TIMESTAMP(12) GENERATED ALWAYS AS ROW END,\n    PERIOD SYSTEM_TIME (SYS_BEGIN, SYS_END))\n    IN EMPDB.EMPTS\n    WITH SYSTEM TIME HISTORY EMP_HISTORY;\n\n/* Query historical data: */\nSELECT EMPNO, SALARY\nFROM EMPLOYEE FOR SYSTEM_TIME AS OF '2025-01-01'",
        tip: "Temporal tables eliminate complex 'effective-date' coding patterns. They're excellent for audit trails and compliance requirements where historical accuracy is mandatory.",
        quizOptions: ["DB2 doesn't support temporal data", "DB2 SYSTEMPORAL tables maintain history automatically; FOR SYSTEM_TIME AS OF queries historical snapshots", "Temporal tables require special hardware", "History tables must be manually maintained"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_027", category: "DB2", level: "Expert",
        question: "What are DB2 XML columns and how is XML data stored and queried?",
        answer: "DB2 supports XML as a native data type. XML documents are stored in a special XML node in the tablespace. Query using XQuery (XMLQUERY function), SQL/XML (XMLEXISTS, XMLTABLE functions), and XPath expressions. XML indexes improve query performance. INSERT/UPDATE XML using XMLPARSE function. Useful for semi-structured data alongside structured relational data.",
        code: "/* Create table with XML column: */\nCREATE TABLE CUSTOMER (\n    CUSTID  INTEGER NOT NULL PRIMARY KEY,\n    CUSTNM  VARCHAR(50),\n    PROFILE XML);\n\n/* Insert XML: */\nINSERT INTO CUSTOMER VALUES\n    (1, 'IBM Corp', XMLPARSE(DOCUMENT\n    '<profile><email>info@ibm.com</email></profile>'));\n\n/* Query XML: */\nSELECT CUSTID, XMLQUERY(\n    '$D/profile/email' PASSING PROFILE AS \"D\") AS EMAIL\nFROM CUSTOMER;",
        tip: "Use XML columns for data with variable or complex structure. For high-volume XML queries, create XML indexes on frequently queried XPath expressions.",
        quizOptions: ["DB2 cannot store XML data", "DB2 stores XML natively; XMLQUERY, XMLTABLE, XMLEXISTS functions query XML data using XQuery and XPath", "XML must be stored as character data in DB2", "XML indexes are not supported in DB2"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_028", category: "DB2", level: "Intermediate",
        question: "How does DB2 handle table spaces in COPY PENDING, LOAD PENDING, and CHECK PENDING states?",
        answer: "Tablespace restrictive states limit operations: (1) COPY PENDING: after LOAD LOG NO - must run COPY before most DML. (2) LOAD PENDING: incomplete LOAD - must restart or terminate LOAD. (3) CHECK PENDING: RI constraints not checked - must run CHECK DATA. (4) REORG PENDING: after online REORG completion. Check states using DISPLAY DATABASE command or SYSIBM.SYSTABLESPACESTATS.",
        code: "/* Check tablespace states: */\nDISPLAY DATABASE(EMPDB) SPACENAM(*) RESTRICT\n\n/* Clear COPY PENDING: */\n  COPY TABLESPACE EMPDB.EMPTSBP FULL YES   /* Run COPY */\n\n/* Clear CHECK PENDING: */\n  CHECK DATA TABLESPACE EMPDB.EMPTSBP     /* Validate RI */\n\n/* Query catalog for states: */\nSELECT NAME, STATUS FROM SYSIBM.SYSTABLESPACES\nWHERE DBNAME = 'EMPDB'",
        tip: "Monitor for restrictive states daily. COPY PENDING and CHECK PENDING states prevent normal operations. Set up automation to detect and alert on these conditions.",
        quizOptions: ["Restrictive states are normal and harmless", "COPY PENDING, LOAD PENDING, CHECK PENDING restrict operations; must run COPY, restart LOAD, or CHECK DATA to clear them", "DISPLAY DATABASE shows memory usage", "Restrictive states automatically clear after 24 hours"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_029", category: "DB2", level: "Expert",
        question: "What is DB2 parallelism and how does it improve query performance?",
        answer: "DB2 parallelism divides query execution across multiple processors/I/O channels. Types: (1) I/O Parallelism: simultaneous I/O requests to multiple datasets. (2) CPU Parallelism: multiple CPU threads process different data partitions. (3) Sysplex Parallelism: query execution across multiple z/OS systems. For large partition-by-range tablespaces, DB2 automatically uses parallel query, dramatically improving DSS performance.",
        code: "/* Enable parallel query: */\nALTER SYSTEM SET DEGREE=ANY;  /* Allow maximum parallelism */\n\n/* BIND with parallel execution: */\nBIND PACKAGE(RPTPKG) MEMBER(BIGQUERY)\n    DEGREE(ANY)      /* Enable parallelism for this package */\n    CURRENTDATA(NO)  /* Required for parallel */\n\n/* Query DB2 parallelism stats: */\nSELECT * FROM SYSIBM.SYSPACKAGE WHERE NAME = 'BIGQUERY'",
        tip: "Parallelism benefits large partition tablespaces (PBR). Use DEGREE(ANY) only for DSS/reporting packages - OLTP queries are typically too small to benefit from parallelism.",
        quizOptions: ["DB2 is always single-threaded", "DB2 parallelism divides query execution across CPUs/I/O channels; especially effective for large partitioned tablespaces", "Parallelism requires separate DB2 product", "Parallelism only works for INSERT operations"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b3_030", category: "DB2", level: "Expert",
        question: "What is DB2 workload management with WLM and how does it affect DB2 stored procedures?",
        answer: "WLM (Workload Manager) manages z/OS resources including DB2 stored procedure and UDF execution. DB2 stored procedures run in WLM-managed address spaces (WLM application environments). Each environment maps to a started task. WLM classifies work by priority, ensuring high-priority transactions aren't starved by low-priority stored procedures. Configure WLM service classes to match business priorities.",
        code: "/* Define WLM application environment for stored procs: */\n/* (System programmer task - IWMCONN, SDSF SY.I) */\n/* WLM environment definition links to DB2 stored proc: */\nCREATE PROCEDURE EMPQUERY\n    WLM ENVIRONMENT FOR DEBUG MODE\n    (WLMENV  'DB2PROC_ENV1')\n    ...;\n\n/* Monitor stored procedure execution: */\nSELECT PROCSCHEMA, PROCNAME, RUNOPTS\nFROM SYSIBM.SYSROUTINES\nWHERE ROUTINETYPE = 'P'",
        tip: "Create separate WLM environments for different priority stored procedures. Critical customer-facing procedures should have higher service class priority than background reporting procedures.",
        quizOptions: ["WLM doesn't interact with DB2", "WLM manages DB2 stored procedures via application environments, ensuring proper priority and resource management for stored procedure execution", "All stored procedures run in the DB2 address space", "WLM is only for CICS workloads"],
        quizAnswerIndex: 1
    }
];
