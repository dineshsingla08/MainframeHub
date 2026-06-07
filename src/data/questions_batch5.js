// BATCH 5: Advanced cross-topic and production-level questions (300+ more questions)
export const questionsBatch5 = [

    // ============ ADVANCED JCL PRODUCTION QUESTIONS ============
    {
        id: "prod_b5_001", category: "JCL", level: "Expert",
        question: "What is the JES2 JECL (JES2 Control Language) and how is it used?",
        answer: "JECL (/*JES2 or /*JOBPARM) statements provide JES2-specific job control beyond standard JCL. Used for: ROUTE statements (route output to remote printers), NETRC (network route), SETUP (notify operator to mount tapes), JOBPARM (job-level parameters like priority). JECL statements begin with /* (slash-asterisk) and appear in specific locations in the JCL.",
        code: "//MYJOB    JOB (ACCT),'TEST'\n/*JOBPARM SYSAFF=SC64    /* Affinity to specific system */\n/*ROUTE PRINT RMT007     /* Route output to remote printer 007 */\n/*SETUP R=TAPE01         /* Notify operator to mount TAPE01 */\n//STEP1   EXEC PGM=MYPROG",
        tip: "JECL is JES2-specific - JES3 uses different syntax. If running in a mixed JES2/JES3 environment, document which JES is active on each system.",
        quizOptions: ["JECL is the same as standard JCL", "JECL provides JES2-specific control for routing, output, system affinity using /* statements", "JECL is only for tape operations", "JECL requires separate software"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_002", category: "JCL", level: "Expert",
        question: "What is the OUTPUT JCL statement and how does it control report distribution?",
        answer: "The OUTPUT JCL statement defines detailed output processing characteristics for SYSOUT datasets. Parameters include: CLASS, COPIES, DEST, HOLD, FORMS, PAGEDEF, FORMDEF, CHARS, FCB, and BURST. Multiple SYSOUT DDs can reference the same OUTPUT statement using OUTPUT=*.label syntax. This centralizes print routing configuration.",
        code: "//RPTOUT  OUTPUT CLASS=A,COPIES=3,DEST=PRINTER1,\n//                FORMS=STANDARD,PAGEDEF=P1A06462,\n//                FORMDEF=A10110\n//STEP1    EXEC PGM=REPORTER\n//SYSPRINT DD SYSOUT=(*,,),OUTPUT=*.RPTOUT\n//REPORT1  DD SYSOUT=(*,,),OUTPUT=*.RPTOUT\n/* Both reports use same output configuration */",
        tip: "Use OUTPUT statements to standardize report formatting across a job. When print requirements change, update one OUTPUT statement instead of modifying each SYSOUT DD.",
        quizOptions: ["OUTPUT statements define report content", "OUTPUT JCL statements centralize print configuration (class, copies, destination, forms) referenced by SYSOUT DD statements", "OUTPUT is only for SYSOUT=X discarding", "OUTPUT requires special printer drivers"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_003", category: "JCL", level: "Expert",
        question: "How do you use JCL to conditionally skip steps based on a previous step's return code?",
        answer: "Use IF/THEN/ELSE/ENDIF constructs or COND parameter. IF (stepname.RC condition) THEN executes enclosed steps. ELSE handles alternative. ENDIF closes the block. COND=(n,op,stepname) on EXEC skips step if condition is true. Modern practice uses IF/THEN/ELSE for readability.",
        code: "//STEP1   EXEC PGM=PROG1\n//STEP2   IF (STEP1.RC = 0) THEN\n//S2      EXEC PGM=PROG2  /* Only if STEP1 succeeded */\n//STEP2   ENDIF\n//STEP3   IF (STEP1.RC > 4) THEN\n//S3ERR   EXEC PGM=ERRHANDLER  /* Only on STEP1 error */\n//STEP3   ELSE\n//S3NORM  EXEC PGM=NORMALFLOW  /* Normal processing */\n//STEP3   ENDIF\n\n/* Legacy COND parameter: */\n//STEP4   EXEC PGM=CLEANUP,COND=(0,NE,STEP1) /* Skip if STEP1 RC != 0 */",
        tip: "IF/THEN/ELSE is more readable than COND and supports complex boolean logic. Always use IF/THEN/ELSE for new JCL development. COND is confusing because it skips when the condition is TRUE (opposite of most languages).",
        quizOptions: ["JCL cannot conditionally execute steps", "IF/THEN/ELSE or COND parameter on EXEC enables conditional step execution based on return codes", "Only COND parameter supports conditional execution", "Conditional execution requires ISPF dialog"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_004", category: "JCL", level: "Expert",
        question: "How does the DSNTYPE=PIPE work in JCL for inter-step communication?",
        answer: "DSNTYPE=PIPE creates an unnamed temporary pipe between steps without physical disk I/O. One step writes to the pipe DD; the next reads from it. Data flows directly in memory between steps. Eliminates intermediate temporary datasets, improving performance for large data volumes. Both steps must run concurrently (parallel steps in same job step group).",
        code: "//STEP1   EXEC PGM=PRODUCER\n//OUTPUT  DD DSN=&&PIPE,DISP=(NEW,PASS),\n//           DSNTYPE=PIPE  /* No physical dataset */\n\n//STEP2   EXEC PGM=CONSUMER\n//INPUT   DD DSN=&&PIPE,DISP=(OLD,DELETE)  /* Read from pipe */\n/* STEP1 writes; STEP2 reads concurrently */",
        tip: "DSNTYPE=PIPE is ideal for large data volumes that would exceed temporary space. The pipe size is limited by available virtual memory, not disk space.",
        quizOptions: ["DSNTYPE=PIPE creates a network socket", "DSNTYPE=PIPE creates in-memory pipes between steps eliminating disk I/O for large inter-step data flows", "PIPE datasets are stored on tape", "DSNTYPE=PIPE requires special IBM hardware"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_005", category: "JCL", level: "Expert",
        question: "How do you use JCL DD * (in-stream data) vs DUMMY vs NULLFILE?",
        answer: "DD * (DD DATA) - in-stream data follows JCL; program reads it as input. DD DUMMY - simulates a file; OPEN succeeds but READ returns EOF immediately, WRITE is ignored; must match DCB requirements. NULLFILE - writes to null device, reads return EOF; doesn't require DCB match; used for suppressing output. /* delimiter ends in-stream data.",
        code: "//STEP1   EXEC PGM=SORT\n//SYSIN   DD *     /* In-stream data for SORT control cards */\n  SORT FIELDS=(1,10,CH,A)\n/*\n//SORTOUT DD DUMMY         /* Discard sort output */\n//LOGFILE DD DSN=NULLFILE  /* Suppress log output, no DCB needed */\n\n/* DD DATA allows /* within the data: */\n//SYSIN   DD DATA,DLM=$$\n  SORT FIELDS=(1,10,CH,A)\n/*  This comment with /* is OK in DD DATA\n$$",
        tip: "Use DD DATA with a custom delimiter (DLM=$$) when your in-stream data contains /* characters. This prevents early termination of the in-stream data.",
        quizOptions: ["DD *, DUMMY, and NULLFILE are identical", "DD *=in-stream data; DUMMY=simulated file; NULLFILE=null device without DCB constraints; each has specific use cases", "DUMMY and NULLFILE require separate JCL datasets", "DD * creates a permanent dataset"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_006", category: "JCL", level: "Expert",
        question: "What is the SMS DATACLAS parameter and what dataset attributes does it define?",
        answer: "DATACLAS (Data Class) is an SMS parameter defining default dataset attributes: record format, record length, block size, dataset type, and expiration dates. When specified (or defaulted by ACS routines), it eliminates the need for explicit DCB parameters in JCL. Data classes are defined by storage administrators using ISMF (Interactive Storage Management Facility).",
        code: "/* Without DATACLAS - explicit DCB: */\n//DD1  DD DSN=DATA.FILE,DISP=(NEW,CATLG),\n//        SPACE=(CYL,(10,5)),UNIT=SYSDA,\n//        DCB=(RECFM=FB,LRECL=80,BLKSIZE=27920)\n\n/* With DATACLAS - attributes from class definition: */\n//DD1  DD DSN=DATA.FILE,DISP=(NEW,CATLG),\n//        SPACE=(CYL,(10,5)),\n//        DATACLAS=STANDARD80  /* Gets RECFM=FB,LRECL=80 from class */",
        tip: "Work with your storage team to define appropriate data classes. Standardizing via DATACLAS ensures consistent dataset attributes and simplifies JCL maintenance.",
        quizOptions: ["DATACLAS specifies the dataset content type", "DATACLAS is an SMS parameter defining default dataset attributes (RECFM, LRECL, BLKSIZE) to simplify JCL", "DATACLAS is only for VSAM datasets", "DATACLAS replaces the SPACE parameter"],
        quizAnswerIndex: 1
    },

    // ============ ADVANCED COBOL PRODUCTION QUESTIONS ============
    {
        id: "prod_b5_007", category: "COBOL", level: "Expert",
        question: "What is COBOL program pre-initialization and how does it affect shared programs?",
        answer: "COBOL Working Storage is initialized at program load (first CALL). Subsequent dynamic CALLs reuse the same loaded program with its current Working Storage state. For reentrant programs (RENT), each thread gets its own Working Storage copy. CANCEL forces re-initialization. In CICS, COBOL programs are quasi-reentrant: each task gets its own Working Storage instance automatically.",
        code: "/* Problem: shared static COBOL program: */\n/* First CALL: WS-COUNT = 0 (initialized) */\n/* Second CALL without CANCEL: WS-COUNT may still have old value! */\n\n/* Solutions: */\n/* 1. Initialize in PROCEDURE DIVISION before use: */\nINITIALIZE WS-COUNTER-AREA  /* Explicit initialization each call */\n\n/* 2. CANCEL before re-calling: */\nCANCEL 'SUBPROG'\nCALL 'SUBPROG' USING ...\n\n/* 3. Use RECURSIVE or RENT for thread-safe programs */",
        tip: "Never assume Working Storage is initialized to zero or spaces on subsequent CALL invocations without CANCEL. Always explicitly initialize critical variables.",
        quizOptions: ["Working Storage is always re-initialized", "Working Storage is initialized at first load; subsequent calls reuse current state; CANCEL forces re-initialization", "CANCEL is not needed for COBOL programs", "RENT programs share Working Storage across calls"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_008", category: "COBOL", level: "Expert",
        question: "How do you implement robust COBOL error logging that captures useful debugging context?",
        answer: "Effective error logging captures: (1) Timestamp from FUNCTION CURRENT-DATE. (2) Program name from WHEN-COMPILED or a hard-coded constant. (3) Paragraph/function name where error occurred. (4) Error code (SQLCODE, file status, system return code). (5) Context data (key fields, record values). Write to a dedicated error log file opened with OPEN EXTEND, or a transient data queue in CICS.",
        code: "01 WS-ERROR-LOG-RECORD.\n   05 WS-LOG-TIMESTAMP  PIC X(21).\n   05 WS-LOG-PROGRAM    PIC X(8) VALUE 'EMPPROC '.\n   05 WS-LOG-PARA       PIC X(20).\n   05 WS-LOG-ERR-CODE   PIC X(8).\n   05 WS-LOG-CONTEXT    PIC X(40).\n\nWRITE-ERROR-LOG.\n    MOVE FUNCTION CURRENT-DATE TO WS-LOG-TIMESTAMP\n    WRITE ERROR-RECORD FROM WS-ERROR-LOG-RECORD\n        AFTER ADVANCING 1 LINE.",
        tip: "Create a reusable error logging COPY member with standard fields. Every program that COPYs it gets consistent, parseable error log entries that simplify production support.",
        quizOptions: ["Error logs are automatically generated by COBOL", "Effective error logging captures timestamp, program, paragraph, error code, and context data to a dedicated log file or TDQ", "Only DISPLAY statements provide error information", "Error logging degrades performance too much"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_009", category: "COBOL", level: "Expert",
        question: "What is COBOL's EVALUATE TRUE vs EVALUATE identifier?",
        answer: "EVALUATE TRUE: each WHEN clause contains a condition; evaluates conditions in order, executes first true condition. This is COBOL's powerful multi-way conditional. EVALUATE identifier: each WHEN clause contains a value or range; compares identifier to each WHEN value. Both are equivalent to IF-ELSIF chains but more readable.",
        code: "/* EVALUATE TRUE (condition-based): */\nEVALUATE TRUE\n    WHEN WS-SALARY < 30000\n        PERFORM ENTRY-LEVEL-PROCESS\n    WHEN WS-SALARY BETWEEN 30000 AND 60000\n        PERFORM MID-LEVEL-PROCESS\n    WHEN WS-SALARY > 60000\n        PERFORM SENIOR-PROCESS\n    WHEN OTHER\n        PERFORM UNKNOWN-PROCESS\nEND-EVALUATE\n\n/* EVALUATE identifier (value-based): */\nEVALUATE WS-TRANS-CODE\n    WHEN 'DP' PERFORM PROCESS-DEPOSIT\n    WHEN 'WD' PERFORM PROCESS-WITHDRAWAL\n    WHEN 'TR' 'XF' PERFORM PROCESS-TRANSFER\nEND-EVALUATE",
        tip: "EVALUATE TRUE is the most flexible form. Use EVALUATE identifier when comparing against specific values or ranges for transaction code routing or state machines.",
        quizOptions: ["EVALUATE TRUE and EVALUATE identifier are identical", "EVALUATE TRUE tests conditions in WHEN clauses; EVALUATE identifier compares a value; both are multi-way conditionals", "EVALUATE requires THRU for ranges", "EVALUATE cannot have WHEN OTHER"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_010", category: "COBOL", level: "Expert",
        question: "What is the COBOL UNSTRING verb and how does it parse delimited strings?",
        answer: "UNSTRING splits a source string into multiple receiving fields based on delimiters. Parameters: INTO fields for output, DELIMITED BY multiple delimiters, POINTER for starting position, COUNT IN to capture delimiter/length information, TALLYING counts successful delimitings, OVERFLOW/NOT OVERFLOW for completion status. Handles multiple delimiters and variable-length segments.",
        code: "01 WS-CSV-LINE PIC X(100) VALUE '100,John Smith,Engineer,75000'.\n01 WS-EMP-ID   PIC X(5).\n01 WS-EMP-NAME PIC X(20).\n01 WS-EMP-TITL PIC X(15).\n01 WS-EMP-SAL  PIC 9(8).\n\nUNSTRING WS-CSV-LINE\n    DELIMITED BY ','\n    INTO WS-EMP-ID\n         WS-EMP-NAME\n         WS-EMP-TITL\n         WS-EMP-SAL\n    TALLYING WS-FIELD-COUNT\n    ON OVERFLOW PERFORM OVERFLOW-HANDLER\nEND-UNSTRING",
        tip: "UNSTRING is essential for parsing CSV files and other delimited text formats without external libraries. Use POINTER to process the string in segments.",
        quizOptions: ["UNSTRING is the same as STRING", "UNSTRING splits a source string into multiple fields based on delimiters with optional POINTER, TALLYING, and OVERFLOW handling", "UNSTRING only works on numeric fields", "UNSTRING requires VSAM input"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_011", category: "COBOL", level: "Intermediate",
        question: "How does the COBOL STRING verb concatenate fields?",
        answer: "STRING concatenates multiple fields into a single destination field. DELIMITED BY SIZE uses the full field size; DELIMITED BY SPACE stops at trailing spaces; DELIMITED BY literal stops at the specified value. POINTER specifies starting position in destination. OVERFLOW fires when destination is too small. More flexible than MOVE for building variable-length strings.",
        code: "01 WS-FULLNAME PIC X(50).\n01 WS-FIRST    PIC X(15) VALUE 'John '.\n01 WS-LAST     PIC X(15) VALUE 'Smith  '.\n01 WS-TITLE    PIC X(10) VALUE 'Engineer'.\n01 WS-PTR      PIC 9(3).\n\nMOVE 1 TO WS-PTR\nSTRING WS-FIRST DELIMITED BY SPACE  /* Stop at spaces */\n       ' '     DELIMITED BY SIZE     /* Add single space */\n       WS-LAST DELIMITED BY SPACE\n       ', '    DELIMITED BY SIZE\n       WS-TITLE DELIMITED BY SPACE\n    INTO WS-FULLNAME\n    WITH POINTER WS-PTR\n    ON OVERFLOW PERFORM OVERFLOW-HANDLER\nEND-STRING\n/* Result: 'John Smith, Engineer' */",
        tip: "DELIMITED BY SPACE removes trailing spaces from each piece - perfect for variable-length names. Check POINTER after STRING to know where the string ended.",
        quizOptions: ["STRING only works with literal values", "STRING concatenates multiple fields with delimiter control: DELIMITED BY SIZE/SPACE/literal, POINTER for position tracking", "STRING is the same as MOVE CORRESPONDING", "STRING requires matching field types"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_012", category: "COBOL", level: "Expert",
        question: "What are COBOL intrinsic functions for mathematical operations?",
        answer: "COBOL provides 40+ intrinsic functions. Mathematical: SQRT(n), ABS(n), LOG(n), LOG10(n), EXP(n), SIN(n), COS(n), TAN(n), ASIN(n), ACOS(n), ATAN(n), FACTORIAL(n), INTEGER(n) (floor), INTEGER-PART(n), FRACTION-PART(n), RANDOM (pseudo-random), REM(m,n) (remainder), MOD(m,n). Used with COMPUTE or MOVE.",
        code: "COMPUTE WS-SQRT = FUNCTION SQRT(WS-VALUE)\nCOMPUTE WS-ABS  = FUNCTION ABS(WS-NEGATIVE-VAL)\nCOMPUTE WS-LN   = FUNCTION LOG(WS-VALUE)   /* Natural log */\nCOMPUTE WS-LOG  = FUNCTION LOG10(WS-VALUE)  /* Log base 10 */\nCOMPUTE WS-RAND = FUNCTION RANDOM(WS-SEED) /* 0 <= n < 1 */\nCOMPUTE WS-REM  = FUNCTION REM(WS-DIVIDEND, WS-DIVISOR)\n\n/* Date arithmetic: */\nCOMPUTE WS-JULIAN = FUNCTION INTEGER-OF-DATE(WS-DATE-YYYYMMDD)",
        tip: "FUNCTION RANDOM requires seeding with the RANDOM(seed) form on the first call. Subsequent calls to FUNCTION RANDOM (no argument) return the next pseudo-random value.",
        quizOptions: ["COBOL has no mathematical functions", "COBOL provides 40+ intrinsic functions including SQRT, ABS, LOG, SIN, COS, RANDOM, INTEGER-OF-DATE for mathematical operations", "Mathematical functions require external libraries", "Only COMPUTE can do complex mathematics"],
        quizAnswerIndex: 1
    },

    // ============ MORE DB2 ADVANCED QUESTIONS ============
    {
        id: "db2_b5_001", category: "DB2", level: "Expert",
        question: "What is DB2 data sharing and how does it work in a sysplex environment?",
        answer: "DB2 data sharing allows multiple DB2 subsystems (members) to simultaneously access the same data on shared disk storage using a Coupling Facility for cache coherence and locking. Benefits: near-linear scalability, continuous availability (other members serve requests when one fails), workload balancing. Requires: Coupling Facility, group buffer pools, inter-system communication via CF links.",
        code: "/* DB2 data sharing architecture: */\n/* DB2 Member 1 (DSNA) ─┐                 */\n/* DB2 Member 2 (DSNB) ─┼──► Coupling Facility (CF) */\n/* DB2 Member 3 (DSNC) ─┘      Lock Structure        */\n/*                              Cache Structure       */\n/*                              ↓                     */\n/*                         Shared Disk (DASD)         */\n\n/* Monitor data sharing: */\nDISPLAY DDF DETAIL  /* DB2 data sharing status */",
        tip: "DB2 data sharing is the foundation for continuous availability in mainframe banking systems. A member failure doesn't interrupt service - other members take over immediately.",
        quizOptions: ["Data sharing means multiple users reading the same table", "DB2 data sharing allows multiple DB2 members to simultaneously access shared DASD with Coupling Facility for locking and cache coherence", "Data sharing requires identical hardware for each member", "Data sharing is only available in DB2 for LUW"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b5_002", category: "DB2", level: "Expert",
        question: "What is DB2 Workload Manager (WLM) stored procedure execution and how is it configured?",
        answer: "DB2 stored procedures execute in WLM-managed address spaces for isolation and resource management. WLM application environment (application type = 'DB2 PROCEDURE') is associated with a started task (JCL procedure). When a stored procedure is called, DB2 requests a thread from the WLM environment's started task. WLM manages the address space lifecycle, restart on failures, and resource limits.",
        code: "/* WLM application environment for DB2 SPs: */\n/* Defined in SDSF WLM application: */\n/* Application environment: DB2PROD_PROC */\n/*   Application type: DB2 PROCEDURE */\n/*   Subsystem type: DB2 */\n\n/* Started task JCL for WLM SP: */\n//DB2SPROC PROC\n//IEFPROC  EXEC PGM=DSNX9WLM,REGION=0M,\n//         PARM='SSID=DB2P,NUMTCB=5'\n//STEPLIB  DD DSN=DB2.SDSNEXIT,DISP=SHR\n//PEND",
        tip: "Size the NUMTCB (TCBs per WLM address space) based on peak concurrent stored procedure invocations. More TCBs allow more parallelism.",
        quizOptions: ["DB2 stored procedures run in the DB2 address space", "DB2 stored procedures run in WLM-managed address spaces; configured with application environment, started task, and NUMTCB for parallelism", "WLM configuration is automatic for stored procedures", "Stored procedures require CICS to execute"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b5_003", category: "DB2", level: "Expert",
        question: "What is the DB2 REBIND and when must it be performed?",
        answer: "REBIND regenerates an existing package or plan's access path using current DB2 catalog statistics and any parameter changes. Must perform after: RUNSTATS (to use new statistics), new indexes (optimizer may now prefer them), DB2 version upgrades (new optimizer capabilities), performance degradation after data distribution changes, parameter changes (ISOLATION, CURRENTDATA, DEGREE).",
        code: "/* REBIND a specific package: */\n//REBINDJOB EXEC PGM=IKJEFT01\n//SYSTSIN   DD *\n  DSN SYSTEM(DBPROD)\n  REBIND PACKAGE(MYAPP.EMPQUERY) ACT(REP) EXPLAIN(YES)\n  END\n/*\n\n/* REBIND all packages in collection: */\n  REBIND PACKAGE(MYAPP.*) ACT(REP)\n\n/* AUTO_REBIND: DB2 can automatically rebind invalidated packages */",
        tip: "Establish a monthly REBIND schedule for all production packages, especially after RUNSTATS. Access path degradation from stale statistics is a top DB2 performance issue.",
        quizOptions: ["REBIND is only needed after DB2 upgrades", "REBIND must happen after RUNSTATS, new indexes, version upgrades, and performance degradation to use current statistics and optimizer capabilities", "REBIND and BIND are identical", "Packages automatically rebind when statistics change"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b5_004", category: "DB2", level: "Expert",
        question: "What is DB2 compression and what are the benefits and trade-offs?",
        answer: "DB2 row compression uses the Lempel-Ziv algorithm to compress data within tablespace pages. COMPRESS YES on tablespace definition enables it. Benefits: reduced DASD usage (often 50-75% savings), improved buffer pool efficiency (more rows per page), potentially faster sequential scans. Trade-offs: CPU overhead for compression/decompression, requires LOAD or REORG to compress existing data.",
        code: "/* Enable compression: */\nCREATE TABLESPACE COMPTBS IN EMPDB\n    COMPRESS YES\n    USING STOGROUP DSNSTOGG;\n\n/* Create dictionary for better compression: */\n  LOAD DATA REPLACE INTO TABLE EMPLOYEE ...;\n  /* After LOAD, REORG to build compression dictionary */\n\n  REORG TABLESPACE EMPDB.COMPTBS -\n    KEEPDICTIONARY YES;\n\n/* Check compression stats: */\nSELECT COMPRESS, PAGESAVE FROM SYSIBM.SYSTABLESPACES\nWHERE DBNAME = 'EMPDB';",
        tip: "PAGESAVE in SYSIBM.SYSTABLESPACES shows compression savings. Run REORG DISCARD to rebuild the compression dictionary after major data pattern changes.",
        quizOptions: ["DB2 compression is always enabled by default", "DB2 compression reduces storage 50-75% with CPU overhead; COMPRESS YES on tablespace; requires LOAD/REORG to compress existing data", "Compression only works for CLOB columns", "Compression increases all query response times"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b5_005", category: "DB2", level: "Expert",
        question: "What is DB2 Accelerator and how does it offload DSS queries?",
        answer: "IBM DB2 Analytics Accelerator (IDAA) is a Netezza-based appliance tightly integrated with DB2 for z/OS. DSS (Decision Support System) queries are transparently routed to the accelerator without application changes when ACCELERATOR=ELIGIBLE at BIND. IDAA runs analytical queries in parallel, returning results to DB2, often 100-1000x faster than native DB2 for complex analytics.",
        code: "/* BIND with accelerator eligibility: */\nBIND PACKAGE(RPTPKG) MEMBER(BIGRPT)\n    ACCELERATOR(DB2ACC01)  /* Use specific accelerator */\n    CURRENTDATA(NO)        /* Required for acceleration */\n    DEGREE(ANY);\n\n/* Check if query was accelerated: */\nSELECT ACCELERATOR, ACCELERATECOST\nFROM SYSIBM.SYSPACKSTMT\nWHERE COLLID = 'RPTPKG';",
        tip: "IDAA is excellent for end-of-month reporting and analytics that previously required overnight batch jobs. Identify the top 10 longest-running queries and test them on IDAA first.",
        quizOptions: ["DB2 Accelerator replaces DB2 entirely", "DB2 Analytics Accelerator offloads DSS queries to a Netezza appliance transparently via BIND ACCELERATOR, enabling 100-1000x speedup", "Accelerator requires application code changes", "Accelerator only works for OLTP transactions"],
        quizAnswerIndex: 1
    },

    // ============ MORE VSAM ADVANCED QUESTIONS ============
    {
        id: "vsam_b5_001", category: "VSAM", level: "Expert",
        question: "What is the VSAM VERIFY command and when should it be used?",
        answer: "IDCAMS VERIFY recovers a VSAM file after an abnormal job termination or system failure. VSAM maintains open/close counters and end-of-file markers. If a job fails without properly closing the file, these are left inconsistent. VERIFY resets them to correct values so the file can be opened again. Always run VERIFY before opening a file that may have been improperly closed.",
        code: "//VERIFYJB EXEC PGM=IDCAMS\n//SYSPRINT DD SYSOUT=*\n//INDD     DD DSN=PROD.EMPLOYEE.CLUSTER,DISP=SHR\n//SYSIN    DD *\n  VERIFY FILE(INDD)\n  /* Or: */\n  VERIFY DATASET(PROD.EMPLOYEE.CLUSTER)\n/*\n/* IDC0001I FUNCTION COMPLETED, HIGHEST CONDITION CODE WAS 0 */",
        tip: "Automate VERIFY in job step recovery procedures. If VSAM abends with RC=168 'CLOSE FAILED', run VERIFY before restarting the job.",
        quizOptions: ["VERIFY validates VSAM record contents", "IDCAMS VERIFY recovers VSAM files from abnormal termination by resetting open/close counters and EOF markers", "VERIFY is the same as LISTCAT", "VERIFY requires the file to be empty"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b5_002", category: "VSAM", level: "Expert",
        question: "What is VSAM Extended Addressability and when is it needed?",
        answer: "Extended Addressability allows VSAM datasets to exceed 4GB (the 32-bit VSAM RBA limitation). Without it, VSAM datasets have a maximum of 4GB of data. With DSNTYPE=EXTREQ or EXTPREF (via data class or DEFINE CLUSTER), datasets can be addressed with 64-bit RBAs, supporting terabyte-scale VSAM files. Required for large-volume KSDS/ESDS in modern mainframe environments.",
        code: "/* Define large VSAM with extended addressability: */\nDEFINE CLUSTER\n    (NAME(LARGE.KSDS)\n     INDEXED KEYS(8,0)\n     RECORDSIZE(500,500)\n     GIGABYTES(200,20)     /* 200GB primary, 20GB secondary */\n     DSNTYPE(EXTREQ))      /* Require extended addressability */\n    DATA (NAME(LARGE.KSDS.DATA))\n    INDEX (NAME(LARGE.KSDS.INDEX))",
        tip: "Most modern VSAM datasets should use extended addressability proactively. Setting it when the file is small avoids the risk of hitting the 4GB limit unexpectedly.",
        quizOptions: ["VSAM has no size limitations", "Extended Addressability allows VSAM to exceed 4GB using 64-bit RBAs; specify via DSNTYPE=EXTREQ or EXTPREF in DEFINE CLUSTER", "VSAM files can never exceed 4GB on mainframe", "Extended Addressability is only for LDS datasets"],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_b5_003", category: "VSAM", level: "Expert",
        question: "How do you handle VSAM KSDS key length changes after initial definition?",
        answer: "VSAM key length and key position cannot be changed after the cluster is defined. To change key definition: (1) Export all data via IDCAMS REPRO to sequential. (2) DELETE the old cluster. (3) DEFINE new cluster with new key attributes. (4) Transform exported data (reposition key field if needed) - may require a COBOL program or DFSORT. (5) REPRO data back to new cluster.",
        code: "/* Key length change process: */\n//STEP1   EXEC PGM=IDCAMS  /* Unload old KSDS */\n//SYSIN   DD *\n  REPRO INFILE(OLDKSDS) OUTFILE(SEQBACK)\n//\n//STEP2   EXEC PGM=SORT   /* Reformat if key position changed */\n//SYSIN   DD *\n  SORT FIELDS=COPY\n  OUTREC FIELDS=(new key position layout...)\n//\n//STEP3   EXEC PGM=IDCAMS  /* Redefine with new key */\n//SYSIN   DD *\n  DELETE PROD.EMPLOYEE.CLUSTER\n  DEFINE CLUSTER (NAME(PROD.EMPLOYEE.CLUSTER) KEYS(10,0) ...)\n  REPRO INFILE(SEQREFORMAT) OUTFILE(NEWKSDS)",
        tip: "Key changes are major VSAM operations requiring carefully planned maintenance windows. Always backup data first and test the entire process in a lower environment.",
        quizOptions: ["VSAM key length can be changed with ALTER", "Key length/position changes require unload, delete, redefine with new key, optional reformat, and reload", "VSAM key changes happen automatically", "Only the IBM DFSMSdss can change VSAM key length"],
        quizAnswerIndex: 1
    },

    // ============ MORE CICS ADVANCED QUESTIONS ============
    {
        id: "cics_b5_001", category: "CICS", level: "Expert",
        question: "What is the CICS INQUIRE PROGRAM command and how is it used for runtime monitoring?",
        answer: "EXEC CICS INQUIRE PROGRAM retrieves runtime information about a loaded program: NEWCOPY (load a fresh copy), PHASEIN (load for new tasks when safe), LIBRARY (source library), STATUS (enabled/disabled). Used in management programs and monitoring tools. CICS CEMT provides the same information interactively. Essential for automated deployment and monitoring.",
        code: "/* Check program status: */\nEXEC CICS INQUIRE PROGRAM('EMPMAING')\n    STATUS(WS-PROG-STATUS)  /* ENABLED or DISABLED */\n    LOADPOINT(WS-LOAD-ADDR)\n    PROGTYPE(WS-PROG-TYPE)\n    RESP(WS-RESP)\nEND-EXEC\n\n/* Load new version of program: */\nEXEC CICS PERFORM PROGRAM('EMPMAING')\n    NEWCOPY\n    RESP(WS-RESP)\nEND-EXEC",
        tip: "NEWCOPY is required after deploying new program versions to CICS. PHASEIN loads the new version for new tasks while existing tasks complete with the old version.",
        quizOptions: ["INQUIRE PROGRAM reads source code", "CICS INQUIRE PROGRAM retrieves runtime program attributes; NEWCOPY loads fresh versions; used for monitoring and deployment automation", "INQUIRE requires operator authority always", "Programs are automatically reloaded when changed on disk"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b5_002", category: "CICS", level: "Expert",
        question: "What is CICS business transaction services (BTS) and how does it manage long-running processes?",
        answer: "CICS Business Transaction Services (BTS) manages complex, long-running business processes that span multiple transactions. Uses: activities (units of work), processes (collections of activities), compensation (undo completed activities on failure). BTS maintains state durably in VSAM. Enables: sagas, workflow orchestration, multi-step business processes with checkpointing.",
        code: "/* Define a BTS process: */\nEXEC CICS DEFINE PROCESS\n    PROCESSTYPE('LOAN-APP')\n    PROCESS('LOAN-2026-001')\n    RESP(WS-RESP)\nEND-EXEC\n\n/* Define an activity within the process: */\nEXEC CICS DEFINE ACTIVITY\n    ACTIVITY('CREDIT-CHECK')\n    PROGRAM('CRCKHECK')\n    RESP(WS-RESP)\nEND-EXEC\n\n/* Run the activity: */\nEXEC CICS RUN ACTIVITY('CREDIT-CHECK')\n    SYNCHRONOUS\n    RESP(WS-RESP)\nEND-EXEC",
        tip: "BTS is excellent for loan origination, insurance claims, and other multi-day business processes. It provides durable state management that survives system restarts.",
        quizOptions: ["BTS manages database batch jobs", "CICS BTS manages long-running processes (activities/processes) spanning multiple transactions with durable state and compensation support", "BTS requires separate IBM software", "BTS is only for financial transactions"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b5_003", category: "CICS", level: "Expert",
        question: "How does CICS TCP/IP support enable modern connectivity?",
        answer: "CICS TCP/IP support enables: HTTP/HTTPS listener for RESTful/SOAP web services, WebSockets for push notifications, FTP client for file transfer, socket programming (EXEC CICS OPEN SOCKET), SNA-to-TCP/IP conversion. Configured via CICS TCPIPSERVICE definitions. Enables CICS to participate in modern SOA and microservices architectures as both consumer and provider.",
        code: "/* CICS TCPIPSERVICE definition: */\n/* CEDA DEFINE TCPIPSERVICE(HTTPPORT) */\n/*   PORT(8080) PROTOCOL(HTTP) MAXCONN(200) */\n/*   AUTHENTICATE(NO) BACKLOG(50) */\n\n/* CICS program receiving HTTP request: */\nEXEC CICS WEB READ FORMFIELD('empno')\n    VALUE(WS-EMPNO)\n    RESP(WS-RESP)\nEND-EXEC\nEXEC CICS WEB SEND\n    FROM(WS-JSON-RESPONSE)\n    MEDIATYPE('application/json')\n    STATUSCODE(200)\nEND-EXEC",
        tip: "CICS TCP/IP enables existing COBOL programs to serve REST APIs with minimal code changes. Wrap business logic in thin HTTP handlers for modern integration.",
        quizOptions: ["CICS cannot use TCP/IP networks", "CICS TCP/IP enables HTTP/HTTPS, WebSockets, FTP, and socket programming for modern web service and microservices connectivity", "TCP/IP requires replacing COBOL programs with Java", "TCP/IP support requires CICS TS 6.0+"],
        quizAnswerIndex: 1
    },

    // ============ MORE SQL ADVANCED QUESTIONS ============
    {
        id: "sql_b5_001", category: "SQL", level: "Expert",
        question: "What are DB2 sequence objects and how do they compare to identity columns?",
        answer: "DB2 SEQUENCE generates unique sequential numbers. CREATE SEQUENCE defines start, increment, max/min, cycle behavior. Access via NEXT VALUE FOR sequence (generates next) and PREVIOUS VALUE FOR sequence (returns last generated). Identity columns automatically generate values on INSERT using GENERATED ALWAYS AS IDENTITY. Sequences are more flexible (shared across tables, callable independently).",
        code: "/* Create sequence: */\nCREATE SEQUENCE EMP_SEQ\n    START WITH 1000\n    INCREMENT BY 1\n    MAXVALUE 9999999\n    NO CYCLE\n    CACHE 20;  /* Pre-allocate 20 values */\n\n/* Use sequence: */\nINSERT INTO EMPLOYEE (EMPNO, LASTNAME)\nVALUES (NEXT VALUE FOR EMP_SEQ, 'Smith');\n\n/* Identity column: */\nCREATE TABLE ORDER_HEADER (\n    ORDER_ID INTEGER GENERATED ALWAYS AS IDENTITY\n                     (START WITH 1, INCREMENT BY 1),\n    ...\n);",
        tip: "Use SEQUENCE when you need the generated value before INSERT (e.g., to use in multiple related rows). Use IDENTITY when the table itself should own the counter.",
        quizOptions: ["Sequences and identity columns are identical", "Sequences are standalone objects shared across tables; identity columns are table-specific; both generate unique sequential numbers", "Sequences require stored procedures", "Identity columns must start at 1"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b5_002", category: "SQL", level: "Expert",
        question: "How do you implement optimistic locking in DB2 to handle concurrent updates?",
        answer: "Optimistic locking assumes concurrent updates are rare. Pattern: (1) Read row noting a version column (TIMESTAMP or version counter). (2) Process without holding locks. (3) UPDATE with WHERE including the original version: UPDATE SET ... WHERE KEY = ? AND VERSION = ?. (4) If 0 rows updated, someone else changed it (conflict). (5) Handle conflict: retry, merge, or report error.",
        code: "/* Read with version: */\nEXEC SQL\n    SELECT SALARY, ROW_CHANGE_TIMESTAMP\n    INTO :WS-SALARY, :WS-VERSION\n    FROM EMPLOYEE WHERE EMPNO = :WS-EMPNO\nEND-EXEC\n\n/* Process... then update with version check: */\nEXEC SQL\n    UPDATE EMPLOYEE\n    SET SALARY = :WS-NEW-SALARY,\n        ROW_CHANGE_TIMESTAMP = CURRENT TIMESTAMP\n    WHERE EMPNO = :WS-EMPNO\n      AND ROW_CHANGE_TIMESTAMP = :WS-VERSION  /* Optimistic check */\nEND-EXEC\nIF SQLERRD(3) = 0  /* SQLERRD(3) = rows updated */\n    PERFORM CONCURRENT-UPDATE-CONFLICT",
        tip: "DB2 supports ROW_CHANGE_TIMESTAMP (automatically updated on change) as an ideal optimistic locking column. This eliminates the need for manual version counter updates.",
        quizOptions: ["Optimistic locking always holds locks during processing", "Optimistic locking reads without locks, then updates with version check; 0 rows affected indicates concurrent modification conflict", "DB2 automatically implements optimistic locking", "Optimistic locking requires CICS"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b5_003", category: "SQL", level: "Expert",
        question: "What is the DB2 SELECT...FOR UPDATE OF and how is it used with positioned UPDATES?",
        answer: "SELECT...FOR UPDATE OF acquires UPDATE locks on fetched rows, enabling positioned UPDATE (UPDATE...WHERE CURRENT OF cursor). Without FOR UPDATE OF, cursor fetches are read-only and positioned UPDATE fails. FOR UPDATE OF column-list acquires locks only needed columns. WHERE CURRENT OF cursor-name updates the last fetched row without re-specifying key.",
        code: "EXEC SQL\n    DECLARE UPDC CURSOR FOR\n        SELECT EMPNO, SALARY\n        FROM EMPLOYEE\n        WHERE DEPTNO = :WS-DEPT\n        FOR UPDATE OF SALARY    /* Acquire update locks */\nEND-EXEC\n\nEXEC SQL OPEN UPDC END-EXEC\nPERFORM UNTIL SQLCODE = 100\n    EXEC SQL FETCH UPDC INTO :WS-EMPNO, :WS-SALARY END-EXEC\n    IF SQLCODE = 0\n        COMPUTE WS-NEWSAL = WS-SALARY * 1.05\n        EXEC SQL\n            UPDATE EMPLOYEE SET SALARY = :WS-NEWSAL\n            WHERE CURRENT OF UPDC   /* Update fetched row */\n        END-EXEC\nEND-PERFORM\nEXEC SQL CLOSE UPDC END-EXEC",
        tip: "Positioned UPDATE is more efficient than keyed UPDATE when processing many rows sequentially - no index lookup needed for the update since cursor already positions to the row.",
        quizOptions: ["FOR UPDATE OF is the same as SELECT...FOR SHARE", "FOR UPDATE OF acquires update locks for cursor positions; WHERE CURRENT OF cursor updates the last fetched row without key specification", "Positioned UPDATE requires no cursor", "FOR UPDATE OF requires ISOLATION(RR)"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b5_004", category: "SQL", level: "Intermediate",
        question: "How do you find duplicate records in a DB2 table?",
        answer: "Find duplicates using GROUP BY with HAVING COUNT > 1. This groups by the key columns and finds groups with more than one row. To see the actual duplicate rows, use the result as a subquery in EXISTS. For DFSORT equivalent: sort by key, then SUM FIELDS=NONE to see what would be removed.",
        code: "/* Find departments with duplicate employees (same name): */\nSELECT LASTNAME, FIRSTNME, COUNT(*) AS DUP_COUNT\nFROM EMPLOYEE\nGROUP BY LASTNAME, FIRSTNME\nHAVING COUNT(*) > 1;\n\n/* See all duplicate employee rows: */\nSELECT * FROM EMPLOYEE E\nWHERE EXISTS (\n    SELECT 1 FROM EMPLOYEE E2\n    WHERE E2.LASTNAME = E.LASTNAME\n      AND E2.FIRSTNME = E.FIRSTNME\n      AND E2.EMPNO != E.EMPNO  /* Different employee number */\n);",
        tip: "For large tables, GROUP BY HAVING is faster than EXISTS for finding the duplicate keys. Use EXISTS to retrieve the full duplicate rows for investigation.",
        quizOptions: ["Duplicates require a COBOL program to detect", "GROUP BY with HAVING COUNT(*) > 1 finds duplicate groups; EXISTS subquery retrieves full duplicate rows", "SQL cannot detect duplicate records", "Use DISTINCT to find duplicates"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b5_005", category: "SQL", level: "Expert",
        question: "How do you delete duplicate records keeping only one copy?",
        answer: "To delete duplicates keeping one (e.g., lowest EMPNO): DELETE rows whose key matches a higher-priority row. Use ROW_NUMBER() to assign ranks within duplicates, then DELETE where rank > 1. Alternative: INSERT unique rows to temp table, delete all from original, insert back from temp.",
        code: "/* Delete duplicates, keep row with minimum EMPNO: */\nDELETE FROM EMPLOYEE E\nWHERE EMPNO NOT IN (\n    SELECT MIN(EMPNO)\n    FROM EMPLOYEE\n    GROUP BY LASTNAME, FIRSTNME, DEPTNO\n);\n\n/* Using ROW_NUMBER (DB2 11+): */\nDELETE FROM (\n    SELECT ROW_NUMBER() OVER (\n        PARTITION BY LASTNAME, FIRSTNME\n        ORDER BY EMPNO\n    ) AS RN\n    FROM EMPLOYEE\n) WHERE RN > 1;",
        tip: "The ROW_NUMBER approach is more flexible - you can change which record to keep by changing the ORDER BY clause. Always test in a lower environment first.",
        quizOptions: ["SQL cannot delete specific duplicate rows", "Delete duplicates with NOT IN (SELECT MIN/MAX) or using ROW_NUMBER > 1 in a DELETE statement", "Deleting duplicates requires COBOL programs", "DFSORT is the only way to remove duplicates"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b5_006", category: "SQL", level: "Expert",
        question: "What are DB2 hash-partitioned tablespaces and how do they improve performance?",
        answer: "Hash-partitioned tablespaces distribute data across partitions based on a hash of the partitioning key. DB2 automatically directs rows to partitions and balances insert workload across partitions. Benefits: even data distribution (no hot partitions from sequential keys), parallel insert performance, no need to define partition ranges. Best for: tables with natural sequential keys (timestamps, identities) that cause partition hot-spots.",
        code: "/* Create hash-partitioned tablespace: */\nCREATE TABLESPACE HASHTBS IN EMPDB\n    NUMPARTS 16    /* 16 hash partitions */\n    USING STOGROUP DSNSTOGG;\n\nCREATE TABLE TRANSACTIONS (\n    TRANS_ID   BIGINT GENERATED ALWAYS AS IDENTITY,\n    TRANS_DATE DATE,\n    AMOUNT     DECIMAL(15,2)\n) IN EMPDB.HASHTBS\nPARTITION BY HASH(TRANS_ID) PARTITIONS 16;  /* Hash by TRANS_ID */",
        tip: "Use hash partitioning for tables with sequential identity columns to spread inserts across all partitions. Range partitioning with sequential keys causes all inserts to go to the last partition (hot spot).",
        quizOptions: ["Hash partitioning is the same as range partitioning", "Hash partitioning distributes data evenly via hash function, preventing hot-spot partitions from sequential key inserts", "Hash partitioning requires sorting all data first", "Hash partitioning is only for temporary tables"],
        quizAnswerIndex: 1
    },

    // ============ COBOL + DB2 INTERACTION QUESTIONS ============
    {
        id: "cobol_db2_b5_001", category: "DB2", level: "Expert",
        question: "How do you handle SQLCODE -803 (duplicate key) in a COBOL DB2 program?",
        answer: "SQLCODE -803 occurs when INSERT or UPDATE violates a unique constraint. Handling: check SQLCODE after every INSERT/UPDATE. If -803: determine which constraint was violated using SQLERRD(3) which contains the constraint number. Options: update the existing record instead, generate a different unique key, report the duplicate to the user, or log and skip.",
        code: "EXEC SQL\n    INSERT INTO EMPLOYEE (EMPNO, LASTNAME, SALARY)\n    VALUES (:WS-EMPNO, :WS-LNAME, :WS-SALARY)\nEND-EXEC\n\nIF SQLCODE = -803    /* Duplicate key violation */\n    PERFORM DUPLICATE-KEY-HANDLER\nELSE IF SQLCODE NOT = 0\n    PERFORM GENERIC-DB2-ERROR\nEND-IF\n\nDUPLICATE-KEY-HANDLER.\n    /* Log the duplicate attempt */\n    MOVE WS-EMPNO TO WS-ERR-KEY\n    PERFORM LOG-DUPLICATE\n    /* Or: UPDATE instead of INSERT */\n    EXEC SQL\n        UPDATE EMPLOYEE SET SALARY = :WS-SALARY\n        WHERE EMPNO = :WS-EMPNO\n    END-EXEC.",
        tip: "SQLERRD(3) contains the constraint number that was violated. This is useful when a table has multiple unique indexes and you need to distinguish which caused the -803.",
        quizOptions: ["-803 causes automatic rollback", "SQLCODE -803 is duplicate key violation; check SQLCODE after INSERT; handle by UPDATE, alternative key, or error reporting", "-803 means record not found", "-803 only occurs with VSAM files"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_db2_b5_002", category: "DB2", level: "Expert",
        question: "What is SQLCODE -911 and how do you implement retry logic for deadlock recovery?",
        answer: "SQLCODE -911 indicates the transaction was the deadlock victim and was rolled back. SQLCODE -913 indicates timeout. After -911, all work since last COMMIT is rolled back automatically. Retry logic: rollback explicitly (confirm), increment retry counter, wait briefly, then resubmit the transaction. Limit retries (usually 3-5) to prevent infinite loops. Log all deadlock occurrences.",
        code: "01 WS-RETRY-COUNT   PIC 9(2) VALUE 0.\n01 WS-MAX-RETRIES   PIC 9(2) VALUE 3.\n01 WS-SUCCESS-FLAG  PIC X(1) VALUE 'N'.\n\nPERFORM UNTIL WS-SUCCESS-FLAG = 'Y'\n           OR WS-RETRY-COUNT >= WS-MAX-RETRIES\n    PERFORM DO-TRANSACTION\n    IF SQLCODE = -911  /* Deadlock - retry */\n        EXEC SQL ROLLBACK END-EXEC\n        ADD 1 TO WS-RETRY-COUNT\n        /* Brief delay before retry */\n    ELSE IF SQLCODE = 0\n        MOVE 'Y' TO WS-SUCCESS-FLAG\n    ELSE\n        PERFORM DB2-ERROR-HANDLER\n        MOVE 'Y' TO WS-SUCCESS-FLAG  /* Don't retry other errors */\n    END-IF\nEND-PERFORM\nIF WS-RETRY-COUNT >= WS-MAX-RETRIES\n    PERFORM DEADLOCK-MAX-RETRY-ERROR.",
        tip: "Add a random delay (50-500ms) before retry to reduce the probability of deadlocking again immediately. Log retry counts to identify tables that are hotspots for deadlocks.",
        quizOptions: ["After -911 you can continue without rollback", "SQLCODE -911 rolls back the transaction automatically; retry by rolling back, waiting briefly, and resubmitting with a retry limit", "-911 is a normal end-of-file condition", "Retry logic requires CICS"],
        quizAnswerIndex: 1
    },

    // More comprehensive questions for all categories
    {
        id: "jcl_b5_007", category: "JCL", level: "Expert",
        question: "How do you implement JCL to handle tape mounts and automatic tape management?",
        answer: "For tape files, specify: UNIT=TAPE (generic tape), UNIT=device-type (specific model like 3592), LABEL=(n,SL,RETPD=days) for standard labels and retention. VOLUME=SER=volser for specific volumes, or omit for scratch tape. EXPDT=yyyyddd or RETPD=days sets expiration. DFSMShsm and Tape Management software (CA1, TLMS) handle scratch pool management automatically.",
        code: "/* Tape output with retention: */\n//TAPEFILE DD DSN=PROD.DAILY.BACKUP,DISP=(NEW,KEEP),\n//            UNIT=CART,\n//            LABEL=(1,SL,RETPD=30),  /* Keep 30 days */\n//            VOL=(,,,2)              /* Max 2 volumes */\n\n/* Read specific tape: */\n//TAPEIN  DD DSN=ARCHIVE.2025.DATA,DISP=(OLD,KEEP),\n//           UNIT=CART,\n//           VOL=SER=TAPE01,\n//           LABEL=(1,SL)",
        tip: "Modern mainframe shops use virtual tape (VTS/TS7700) for performance and automated scratch management. Physical tape is increasingly reserved for disaster recovery copies.",
        quizOptions: ["Tape files use DISP=SHR like disk files", "Tape files use UNIT=TAPE/CART, LABEL for label type and retention, VOL=SER for specific volumes; tape management software handles scratch pools", "Tape files don't need LABEL parameters", "RETPD is set by the job scheduler, not JCL"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b5_013", category: "COBOL", level: "Expert",
        question: "What is the COBOL CHAIN option and how does it support CICS pseudo-conversation?",
        answer: "In CICS COBOL, EXEC CICS RETURN TRANSID COMMAREA implements pseudo-conversation. The CHAIN option (legacy) passes data to the next invocation. Modern programs use COMMAREA or Channels/Containers. CHAIN is not standard COBOL but a legacy CICS interaction model. Understanding it helps maintain legacy code.",
        code: "/* Modern pseudo-conversational pattern (recommended): */\nEXEC CICS RETURN\n    TRANSID(EIBTRNID)\n    COMMAREA(WS-STATE-DATA)\n    LENGTH(LENGTH OF WS-STATE-DATA)\nEND-EXEC\n/* Next invocation checks EIBCALEN to detect state */\nIF EIBCALEN > 0\n    EXEC CICS ADDRESS COMMAREA(WS-COMM-PTR) END-EXEC\n    SET ADDRESS OF DFHCOMMAREA TO WS-COMM-PTR\n    /* Resume from saved state */",
        tip: "Always save minimal state in COMMAREA - only what's needed to resume processing. Large COMMAREA wastes CICS spool space. Use TS queues for larger state data.",
        quizOptions: ["CHAIN is a COBOL SORT directive", "Pseudo-conversation uses RETURN TRANSID COMMAREA to save state between transactions; EIBCALEN detects whether state exists on next invocation", "Pseudo-conversation requires FEPI", "COMMAREA is automatically populated by CICS"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_013", category: "JCL", level: "Expert",
        question: "What is the z/OS WTO (Write To Operator) and how is it used in programs?",
        answer: "WTO writes a message to the operator console and optionally to hardcopy log. In COBOL, use DISPLAY...UPON CONSOLE to write WTO messages. More control using CALL 'CEEMOUT' or assembler WTO macro. WTO messages appear in system log (SYSLOG) and can trigger automated responses via NetView or IBM Automation. Route codes control which consoles see the message.",
        code: "/* COBOL WTO via DISPLAY: */\nDISPLAY 'MYJOB001W: Processing delayed - checking data'\n        UPON CONSOLE\n\n/* WTO via LE runtime service: */\nCALL 'CEEMOUT' USING WS-MESSAGE\n                     WS-DEST-CODE  /* 1=SYSOUT, 2=CONSOLE */\n                     WS-FC-CODE\n\n/* Monitor SYSLOG for WTO messages: */\n/* NetView rules can trigger automation based on WTO text */",
        tip: "Standardize WTO message format: 'PROGID###t: description' where t is I(info), W(warning), or E(error). This enables automated monitoring rules to classify and respond to messages.",
        quizOptions: ["WTO is only for CICS programs", "WTO writes messages to operator console and system log; in COBOL via DISPLAY UPON CONSOLE; enables automated monitoring responses", "WTO requires special operator authority", "WTO writes to the print queue only"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_014", category: "COBOL", level: "Expert",
        question: "What is the IBM Language Environment (LE) and how does it unify runtime for COBOL, C, and PL/I?",
        answer: "IBM Language Environment is a common runtime library providing services to COBOL, C, PL/I, and Fortran programs. LE provides: storage management (GETMAIN/FREEMAIN), condition handling, date/time services, message handling, traceback on abends. Programs compiled for LE can call routines in other LE-compliant languages. LE replaces older language-specific runtimes.",
        code: "/* LE services in COBOL: */\nCALL 'CEEGTST' USING WS-SIZE WS-PTR WS-FC    /* Get storage */\nCALL 'CEEFRST' USING WS-PTR WS-FC             /* Free storage */\nCALL 'CEESECS' USING WS-LILIAN WS-FC          /* Seconds since epoch */\nCALL 'CEEDATM' USING WS-SECONDS WS-FORMAT\n                     WS-OUTPUT WS-FC           /* Format datetime */\n\n/* LE startup options (CEEOPTS): */\n/* STORAGE(NONE,NONE,NONE,00)  - no storage initialization */\n/* THREADSTACK(ON,128K,ANY)    - thread stack size */",
        tip: "Understanding LE is essential for advanced COBOL programming. LE condition handling can intercept system abends for graceful recovery - configure via TERMTHDACT and TRAP options.",
        quizOptions: ["LE is only for C programs", "IBM Language Environment provides unified runtime services (storage, condition handling, datetime) for COBOL, C, PL/I programs", "LE is a CICS-specific component", "LE must be purchased separately from COBOL compiler"],
        quizAnswerIndex: 1
    },
    {
        id: "prod_b5_015", category: "JCL", level: "Expert",
        question: "How do you monitor and analyze job performance using SMF records?",
        answer: "SMF (System Management Facility) records are written by z/OS and subsystems to capture performance data. Key record types: SMF 30 (job step resource usage), SMF 14/15 (dataset I/O statistics), SMF 02 (dataset statistics), DB2 100-103 (SQL performance), CICS 110 (transaction stats). Tools: VSAM RRDS for SMF, SAS, or IBM Performance Analytics to analyze. SAS PROC FREQ or report programs create performance reports.",
        code: "/* Read SMF 30 records using DFSORT: */\n//SMFREAD  EXEC PGM=IFASMFDP  /* SMF dump program */\n//SMFIN    DD DSN=SYS1.MAN1,DISP=SHR  /* Active SMF dataset */\n//SMFOUT   DD DSN=SMFWORK,DISP=(NEW,PASS)\n//SYSIN    DD *\n  INDD(SMFIN,OPTIONS(DUMP))   /* Dump active SMF */\n  OUTDD(SMFOUT,TYPE(30))       /* SMF type 30 records only */\n/*\n/* Then analyze SMFWORK with DFSORT/SAS/COBOL */",
        tip: "SMF data is the gold standard for mainframe performance analysis. Keep at least 30 days of SMF data for capacity planning and trend analysis.",
        quizOptions: ["SMF records are only for security audit", "SMF records capture z/OS performance data (job CPU/I/O, DB2 SQL, CICS transactions); analyzed for performance tuning and capacity planning", "SMF data is only readable by IBM", "SMF analysis requires special hardware"],
        quizAnswerIndex: 1
    },

    // More specialized questions
    {
        id: "vsam_b5_004", category: "VSAM", level: "Expert",
        question: "What is DFSMShsm (Hierarchical Storage Manager) and how does it manage VSAM datasets?",
        answer: "DFSMShsm automatically migrates, backs up, and recovers datasets based on usage patterns and policies. VSAM datasets: (1) Actively used datasets remain on primary DASD. (2) Inactive datasets migrate to ML1 (nearline DASD) then ML2 (tape). (3) Daily/incremental backups captured via INCREMENTAL command. (4) Recovery via RECOVER command. On access of migrated dataset, DFSMShsm automatically recalls it.",
        code: "/* TSO HSM commands: */\nHMIGRATE 'PROD.OLD.FILE'    /* Manually migrate */\nHRECALL 'PROD.OLD.FILE'     /* Manually recall */\nhdelete 'PROD.BACKUP' PURGE /* Delete all backup versions */\n\n/* JCL - force recall on open: */\n//INFILE  DD DSN=PROD.MIGRATED.DATA,DISP=SHR\n/* If migrated, CICS/JCL automatically recalls via SUBSYS=(HSM) */",
        tip: "DFSMShsm recall can cause job delays if many datasets need recall simultaneously. Check migration status with HLIST before running jobs that reference potentially migrated files.",
        quizOptions: ["DFSMShsm only manages tape datasets", "DFSMShsm automatically migrates inactive VSAM to nearline/tape, performs daily backups, and recalls on access transparently", "DFSMShsm requires manual recall for all files", "DFSMShsm is only for sequential files"],
        quizAnswerIndex: 1
    },
    {
        id: "db2_b5_006", category: "DB2", level: "Expert",
        question: "What is DB2 CHECK DATA utility and when is it required?",
        answer: "CHECK DATA validates referential integrity (RI) constraints for tablespaces in CHECK PENDING status. After LOAD ENFORCE NO or disabling RI constraints, CHECK DATA verifies all FK/PK relationships. If violations found, rows are reported and optionally written to an exception table. CHECK DATA clears the CHECK PENDING status. Also validates check constraints.",
        code: "/* Run CHECK DATA after LOAD ENFORCE NO: */\n//CHECKJOB EXEC PGM=DSNUTILB,PARM='DBPROD CHECKJOB'\n//SYSIN    DD *\n  CHECK DATA TABLESPACE EMPDB.EMPTSBP -\n    EXCEPTIONS 100 -          /* Report up to 100 exceptions */\n    FOR EXCEPTION IN EMPLOYEE -\n      USE EXCEPTION_TABLE     /* Write violators here */\n/*\n/* Review exceptions and correct data before proceeding */",
        tip: "Always run CHECK DATA after bulk loads with ENFORCE NO. Unchecked RI violations cause inconsistencies that are expensive to find and fix later.",
        quizOptions: ["CHECK DATA validates SQL syntax", "CHECK DATA validates RI constraints for CHECK PENDING tablespaces after LOAD ENFORCE NO; reports and optionally captures violations", "CHECK DATA is only for VSAM files", "CHECK DATA automatically fixes RI violations"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b5_007", category: "SQL", level: "Expert",
        question: "What is a star schema and how do SQL join strategies differ for OLAP queries?",
        answer: "Star schema: central fact table with foreign keys to multiple dimension tables. OLAP queries join fact to multiple dimensions filtering on dimension attributes. DB2 handles star joins specially with 'star join' optimization: build hash tables for dimension filters, then probe the fact table. Key: proper partitioning of fact table by date, good indexes on FK columns, and frequent RUNSTATS.",
        code: "/* Star schema query (dimension filtering): */\nSELECT T.YEAR, P.PRODUCT_NAME, SUM(F.SALES_AMT)\nFROM FACT_SALES F\nJOIN DIM_TIME T ON F.TIME_KEY = T.TIME_KEY\nJOIN DIM_PRODUCT P ON F.PROD_KEY = P.PROD_KEY\nJOIN DIM_STORE S ON F.STORE_KEY = S.STORE_KEY\nWHERE T.YEAR = 2025\n  AND S.REGION = 'NORTHEAST'\n  AND P.CATEGORY = 'ELECTRONICS'\nGROUP BY T.YEAR, P.PRODUCT_NAME\nORDER BY SUM(F.SALES_AMT) DESC;",
        tip: "For star schema queries, the DB2 optimizer needs accurate statistics on both fact and dimension tables. Run RUNSTATS with KEYCARD on all tables participating in star joins.",
        quizOptions: ["Star schema queries are identical to normalized queries", "Star schemas have a fact table with multiple dimension tables; DB2 optimizes via hash joins on filtered dimensions then fact table probe", "Star schema requires special DB2 license", "OLAP queries cannot be optimized in DB2"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b5_008", category: "SQL", level: "Intermediate",
        question: "How do you use SQL to generate a list of dates (date series)?",
        answer: "DB2 can generate date series using recursive CTEs. The recursive CTE increments a date by one day per iteration until reaching the end date. Applications: filling gaps in time-series data, generating calendar tables, identifying missing dates in datasets.",
        code: "/* Generate all dates in 2026: */\nWITH DATE_SERIES (D) AS (\n    VALUES (DATE('2026-01-01'))    /* Anchor: start date */\n    UNION ALL\n    SELECT D + 1 DAY              /* Recursive: next day */\n    FROM DATE_SERIES\n    WHERE D < DATE('2026-12-31')  /* Stop: end date */\n)\nSELECT D, DAYNAME(D) AS DAY_NAME,\n       DAYOFWEEK(D) AS DAY_NUM\nFROM DATE_SERIES\nORDER BY D;",
        tip: "A pre-built calendar dimension table in your data warehouse is faster than generating dates on-the-fly. Generate it once and index by all date attributes used in queries.",
        quizOptions: ["SQL cannot generate date series", "Recursive CTE generates date series by incrementing from start date to end date; used for calendar tables and gap filling", "Date generation requires stored procedures", "Date series can only be created with COBOL"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b5_009", category: "SQL", level: "Expert",
        question: "How do you write SQL to detect gaps in sequential data?",
        answer: "Gap detection compares each row with the next/previous row. Use LEAD/LAG functions to compare sequential values. For numeric sequences: LAG to get previous ID, subtract, if difference > 1 there's a gap. For date ranges: compare END_DATE of one row with START_DATE of next row.",
        code: "/* Find gaps in employee ID sequence: */\nSELECT\n    EMPNO + 1 AS GAP_START,\n    NEXT_EMPNO - 1 AS GAP_END,\n    NEXT_EMPNO - EMPNO - 1 AS GAP_SIZE\nFROM (\n    SELECT EMPNO,\n           LEAD(EMPNO) OVER (ORDER BY EMPNO) AS NEXT_EMPNO\n    FROM EMPLOYEE\n) T\nWHERE NEXT_EMPNO - EMPNO > 1  /* Gap exists */\nORDER BY EMPNO;",
        tip: "Gap detection is common in data quality checks. After identifying gaps, determine whether they're expected (deleted records) or unexpected (loading errors, sequence generator issues).",
        quizOptions: ["SQL cannot detect sequence gaps", "LEAD/LAG functions compare adjacent row values; where the difference > 1, a gap exists in the sequence", "Gap detection requires COBOL programs", "Gaps can only be detected by sorting and comparing"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b5_010", category: "SQL", level: "Expert",
        question: "What are SQL table aliases and how do they improve multi-table query readability?",
        answer: "Table aliases (correlation names) provide short names for tables in a query. Required for: self-joins (same table referenced twice), subqueries referencing outer tables. Improve readability for long table names. Alias is active only within the query. In COBOL, aliases may conflict with host variable names - avoid identical names.",
        code: "/* Self-join using aliases (find employees and their managers): */\nSELECT E.EMPNO, E.LASTNAME AS EMPLOYEE,\n       M.LASTNAME AS MANAGER,\n       M.EMPNO AS MGR_EMPNO\nFROM EMPLOYEE E      /* E = employee alias */\nLEFT JOIN EMPLOYEE M /* M = manager alias (same table!) */\n    ON E.MGRNO = M.EMPNO\nORDER BY M.LASTNAME, E.LASTNAME;\n\n/* Alias for subquery: */\nSELECT D.DEPTNAME,\n       (SELECT COUNT(*) FROM EMPLOYEE E\n        WHERE E.WORKDEPT = D.DEPTNO) AS EMP_COUNT\nFROM DEPARTMENT D;",
        tip: "Use meaningful aliases (E for employee, D for department) rather than single letters when tables have similar roles. Clear aliases make SQL code self-documenting.",
        quizOptions: ["Aliases are only allowed in subqueries", "Table aliases provide short names required for self-joins and correlated subqueries; improve multi-table query readability", "Aliases must match the full table name", "Aliases create permanent views"],
        quizAnswerIndex: 1
    },

    // Final batch of cross-topic questions
    {
        id: "arch_b5_001", category: "COBOL", level: "Expert",
        question: "How do you implement the strangler pattern to modernize legacy COBOL applications?",
        answer: "Strangler pattern gradually replaces legacy functionality: (1) Expose COBOL as REST APIs via CICS web services (no rewrite needed). (2) Route new functionality to new microservices. (3) Gradually migrate business logic from COBOL to new services. (4) Keep COBOL for complex, stable core logic. Tools: CICS Liberty for Java, zOSConnect for API management, IBM Transformation Advisor for code analysis.",
        code: "/* Strategy: CICS COBOL as REST API backend */\n/* 1. CICS web service wraps existing COBOL: */\n/* EXEC CICS WEB RECEIVE + parse JSON */\n/* EXEC CICS LINK PROGRAM('LEGACY-PROG') */\n/* EXEC CICS WEB SEND JSON response */\n\n/* 2. New services call the API: */\n/* REST API: POST /employee/{id}/salary */\n/* Routes to CICS which calls COBOL */\n\n/* 3. Over time, replace COBOL logic with new service */",
        tip: "The strangler pattern is the safest mainframe modernization approach. It allows gradual migration with zero downtime and easy rollback if the new service has issues.",
        quizOptions: ["Modernization requires rewriting all COBOL", "Strangler pattern exposes COBOL as APIs, routes new functionality to new services, gradually migrating while keeping stable core COBOL logic", "COBOL programs cannot be exposed as REST APIs", "Modernization requires switching to a different database"],
        quizAnswerIndex: 1
    },
    {
        id: "arch_b5_002", category: "CICS", level: "Expert",
        question: "What is IBM z/OS Connect EE and how does it enable API economy for mainframe?",
        answer: "IBM z/OS Connect Enterprise Edition (EE) bridges mainframe services to modern API economy. It creates RESTful APIs from: CICS programs, IMS transactions, DB2 stored procedures, and Batch programs without code changes. Features: API management, OAuth security, API catalog, transformation (JSON to EBCDIC and back), metering. Enables mainframe services to participate in microservices architectures.",
        code: "/* z/OS Connect EE creates APIs automatically: */\n/* 1. Create API definition (JSON descriptor): */\n/* {\n     \"name\": \"getEmployee\",\n     \"version\": \"1.0.0\",\n     \"cicsProgram\": \"EMPMAING\",\n     \"inputRecord\": \"EMP-REQUEST\",\n     \"outputRecord\": \"EMP-RESPONSE\"\n   } */\n\n/* 2. Deploy via z/OS Connect EE server */\n/* 3. Automatic REST endpoint: */\n/* GET /employee/{empno} -> calls CICS EMPMAING */",
        tip: "z/OS Connect EE is the fastest path to exposing mainframe functionality as APIs. Measure the ROI in terms of reuse: one z/OS Connect API definition can serve 100s of API consumers.",
        quizOptions: ["z/OS Connect replaces CICS entirely", "z/OS Connect EE creates REST APIs from CICS, IMS, DB2, and Batch without code changes, enabling mainframe participation in microservices architectures", "z/OS Connect requires complete COBOL rewrites", "z/OS Connect is only for mobile applications"],
        quizAnswerIndex: 1
    },
    {
        id: "arch_b5_003", category: "DB2", level: "Expert",
        question: "How do you design a disaster recovery strategy for mainframe DB2 and VSAM?",
        answer: "DR strategy components: (1) DB2: GEOSORT log shipping to secondary site, DB2 data sharing across sites in Metro Mirror, COPY image copies to tape/cloud. (2) VSAM: DFSMSdss incremental dump via FlashCopy, DFSMShsm backup to remote tape, VTS (Virtual Tape Server) mirroring. (3) RTO/RPO objectives drive: synchronous vs async replication, copy frequency, recovery procedures.",
        code: "/* DB2 DR via DFDSS incremental: */\n//DSSBACKUP EXEC PGM=ADRDSSU\n//SYSIN    DD *\n  DUMP DATASET(INCLUDE(DB2.TABLESPACE.**)) -\n       OUTDD(TAPEOUT) -\n       FULL -               /* Alternate: DIFFERENCING */\n       COMPRESS\n/*\n\n/* DB2 log shipping to DR site: */\n/* DB2 Active log archived to DR via DFSMShsm */\n/* DR recovery: restore base, apply archive logs */",
        tip: "Test DR procedures quarterly. Many organizations find their DR procedures don't work when actually needed because they haven't been tested since installation.",
        quizOptions: ["DR is only for VSAM files", "DR strategy combines DB2 log shipping/mirroring, VSAM DFDSS/FlashCopy backups, and VTS mirroring; driven by RTO/RPO objectives", "DB2 automatically creates DR copies", "DR requires duplicate hardware on-site only"],
        quizAnswerIndex: 1
    },
    {
        id: "arch_b5_004", category: "COBOL", level: "Expert",
        question: "What is COBOL object orientation vs service-orientation and which is used in practice?",
        answer: "OO COBOL (COBOL 2002): uses CLASS-ID, METHOD definitions, INVOKE for method calls, INHERITS for class hierarchies. Rarely used in practice - complex, not widely supported across mainframe tooling. Service-oriented COBOL: structured programs with clear interfaces (COBOL CALL/LINK), shared copybooks, standard entry/exit patterns. This is the actual industry standard. Modern approach: COBOL programs as services behind REST APIs.",
        code: "/* Service-oriented COBOL (actual practice): */\nIDENTIFICATION DIVISION.\nPROGRAM-ID. EMP-SALARY-SVC.\n\n/* Clear interface: Input/Output in Linkage: */\nLINKAGE SECTION.\nCOPY EMPSRVCIN.    /* Standard input copybook */\nCOPY EMPSRVCOUT.   /* Standard output copybook */\n\nPROCEDURE DIVISION USING LK-INPUT LK-OUTPUT.\n    PERFORM VALIDATE-INPUT\n    PERFORM CALCULATE-SALARY\n    PERFORM BUILD-RESPONSE\n    GOBACK.",
        tip: "Service-oriented COBOL with clear interfaces, copybook-defined contracts, and REST API exposure is the practical modernization approach. Pure OO COBOL is a theoretical exercise.",
        quizOptions: ["OO COBOL is the modern industry standard", "Service-oriented COBOL (structured programs with clear interfaces) is the actual practice; OO COBOL exists in the standard but is rarely used", "COBOL programs cannot be service-oriented", "COBOL must be rewritten as Java for service orientation"],
        quizAnswerIndex: 1
    },
    {
        id: "arch_b5_005", category: "JCL", level: "Expert",
        question: "What is IBM Workload Scheduler (IWS/TWS) and how does it manage JCL job dependencies?",
        answer: "IBM Workload Scheduler (formerly TWS - Tivoli Workload Scheduler) automates batch job scheduling with dependencies: run job B after job A completes, run C only if A's RC=0, schedule at specific times, handle calendar dependencies (business days only, month-end). Features: restart/recovery automation, predecessor/successor relationships, cross-platform scheduling, SLA monitoring.",
        code: "/* TWS job stream definition (conceptual): */\n/* JOB: DAILY-EXTRACT */\n/*   PRECEDING: PREV-DAY-CLOSE(RC=0) */\n/*   SCHEDULE: EVERY-BUSINESS-DAY 00:30 */\n/*   RECOVERY: RERUN-SAME-JOB */\n/*   ALERTS: PAGE-ON-CALL IF LATE */\n\n/* JOB: DAILY-LOAD */\n/*   PRECEDING: DAILY-EXTRACT(RC<=4) */\n/*   SCHEDULE: AFTER(DAILY-EXTRACT) */\n/*   SLA: COMPLETE-BY 04:00 */",
        tip: "Document all IWS job dependencies in a dependency map. Circular dependencies cause jobs to never execute. Missing dependencies cause jobs to run out of order and fail.",
        quizOptions: ["IWS is only for CICS transaction scheduling", "IBM Workload Scheduler manages batch job dependencies, time-based scheduling, restart/recovery automation, and SLA monitoring across platforms", "JCL jobs always run in sequence automatically", "Job scheduling requires manually submitted JCL"],
        quizAnswerIndex: 1
    },
    {
        id: "arch_b5_006", category: "COBOL", level: "Expert",
        question: "What are the most critical production abend codes and how do you debug each?",
        answer: "Critical abends: S0C4 (protection exception - invalid memory address, often POINTER issues or uninitialized variables). S0C7 (data exception - invalid packed decimal data, often caused by bad input or MOVE incompatibility). S0CB (division by zero for fixed-point). S0CA (overflow). S222/S522 (time exceeded - infinite loop). S806 (program not found in load library). S913 (RACF access denied).",
        code: "/* S0C7 debugging approach: */\n/* 1. Get dump from CICS CEDF or batch dump */\n/* 2. Find failing instruction using PSW offset */\n/* 3. Use LISTING to map instruction to source line */\n/* 4. Check packed decimal fields near that line */\n/* 5. Add: MOVE WS-SUSPICIOUS-FIELD TO DISPLAY-ITEM */\n/*         DISPLAY 'VALUE IS: ' DISPLAY-ITEM */\n/* 6. INSPECT WS-FIELD TALLYING SPACES FOR ALL SPACES */\n/*    to check if field has invalid content */\n\n/* S0C4 debugging: */\n/* Check POINTER variables and ADDRESS OF assignments */\n/* Ensure GETMAIN was called before SET ADDRESS OF */",
        tip: "S0C7 is the most common production COBOL abend. It always indicates a packed decimal field contains non-numeric data. The fix is always upstream data validation.",
        quizOptions: ["All abends require IBM support to debug", "S0C4=invalid address, S0C7=bad packed decimal, S0CB=divide by zero, S806=program not found, S913=RACF denied; each has specific debug approach", "S0C7 indicates disk I/O error", "Abend codes are meaningless without IBM support"],
        quizAnswerIndex: 1
    },
    {
        id: "arch_b5_007", category: "DB2", level: "Expert",
        question: "What is DB2 SQL Performance Monitoring and what tools are available?",
        answer: "DB2 performance monitoring tools: IBM OMEGAMON for DB2 (real-time SQL thread analysis, lock contention, buffer pool), DSNTRACE (internal DB2 tracing), SMF record analysis (SMF 100-103 for DB2 performance), IBM Data Studio (query analysis), EXPLAIN PLAN TABLE analysis, DB2 AUDIT MANAGER (security audit). Third-party: BMC MainView DB2, CA Detector. Key metrics: CPU per SQL, I/O per SQL, lock waits, buffer pool hit ratio.",
        code: "/* DB2 TRACE for performance analysis: */\n//STARTTRC EXEC PGM=IKJEFT01\n//SYSTSIN  DD *\n  DSN SYSTEM(DBPROD)\n  START TRACE(PERF) CLASS(1 2 3) DEST(SMF)\n  END\n\n/* After running workload, stop trace: */\n  STOP TRACE DEST(SMF)\n\n/* Analyze via SMF Type 100-103 records */\n/* Or using OMEGAMON: real-time view of */\n/* in-flight SQL threads and their resource usage */",
        tip: "Enable DB2 accounting traces (CLASS 1,2,3) for all production work during performance tuning. Analyze the highest CPU SQL statements first - they have the most optimization potential.",
        quizOptions: ["DB2 has no performance monitoring tools", "DB2 monitoring tools: OMEGAMON, DSNTRACE, SMF 100-103, EXPLAIN, DB2 Audit Manager; key metrics: CPU/SQL, I/O, lock waits, buffer pool hit ratio", "Performance monitoring requires stopping DB2", "Only IBM provides DB2 performance analysis"],
        quizAnswerIndex: 1
    },
    {
        id: "arch_b5_008", category: "CICS", level: "Expert",
        question: "How does CICS container/channel-based programming replace COMMAREA for microservices?",
        answer: "Channels contain named typed containers for inter-program communication. Unlike COMMAREA (32KB max, unnamed blob), channels support: multiple named data items, unlimited size (each container can be megabytes), typed data (binary or character), inheritance across XCTL. CICS pipelines (web services) automatically create channels from HTTP requests. This aligns with microservices patterns where operations have named input/output parameters.",
        code: "/* Channel-based microservice interface: */\nEXEC CICS PUT CONTAINER('REQUEST-EMPNO')\n    CHANNEL('EMP-SERVICE')\n    FROM(WS-EMPNO)\n    FLENGTH(6)\nEND-EXEC\n\nEXEC CICS PUT CONTAINER('REQUEST-INCLUDE-SALARY')\n    CHANNEL('EMP-SERVICE')\n    FROM(WS-INCL-SAL)\n    FLENGTH(1)\nEND-EXEC\n\nEXEC CICS LINK PROGRAM('EMPSVC01')\n    CHANNEL('EMP-SERVICE')\nEND-EXEC\n\nEXEC CICS GET CONTAINER('RESPONSE-EMPLOYEE')\n    CHANNEL('EMP-SERVICE')\n    INTO(WS-EMP-RESPONSE)\n    FLENGTH(WS-RESP-LEN)\nEND-EXEC",
        tip: "Design your container names as a formal API contract. Document them in copybooks or API specifications so callers and callees have a clear, versioned interface.",
        quizOptions: ["Channels are only for network communication", "Channels with named typed containers replace COMMAREA for unlimited-size, named-parameter inter-program communication aligned with microservices patterns", "Channels require special CICS hardware", "Container/channel programming is deprecated"],
        quizAnswerIndex: 1
    },
    {
        id: "arch_b5_009", category: "JCL", level: "Intermediate",
        question: "What are JCL in-stream procedures (PROC/PEND) and how do they differ from cataloged procs?",
        answer: "In-stream PROCs are defined within the JCL job itself using PROC (begin) and PEND (end) markers. They're not stored in a library. Cataloged PROCs are stored in PROCLIB datasets. In-stream PROCs are invoked like cataloged ones but only within the same job. Use in-stream when: testing a PROC before cataloging, PROC is specific to one job, or PROCLIB access is restricted.",
        code: "//MYJOB   JOB (ACCT),'TEST'\n//MYPROC  PROC LIB='TEST.LOAD'  /* In-stream PROC start */\n//S1      EXEC PGM=MYPROG\n//STEPLIB DD DSN=&LIB,DISP=SHR\n//SYSOUT  DD SYSOUT=*\n//        PEND                  /* End in-stream PROC */\n\n/* Use the in-stream PROC: */\n//STEP1   EXEC MYPROC,LIB='PROD.LOAD'\n/* Or with different parameter: */\n//STEP2   EXEC MYPROC,LIB='TEST.LOAD'",
        tip: "Debug PROC changes using in-stream PROC in a test job before updating the cataloged version in PROCLIB. This prevents disrupting other jobs using the same PROC.",
        quizOptions: ["In-stream and cataloged PROCs are identical", "In-stream PROCs (PROC/PEND) are defined within the job; cataloged PROCs are stored in libraries; both support symbolic parameters", "In-stream PROCs cannot have parameters", "In-stream PROCs run faster than cataloged ones"],
        quizAnswerIndex: 1
    },
    {
        id: "arch_b5_010", category: "SQL", level: "Expert",
        question: "What are the best practices for DB2 application performance tuning?",
        answer: "Key tuning practices: (1) Add appropriate indexes (check EXPLAIN for ACCESSTYPE=R). (2) Run RUNSTATS regularly, especially after bulk operations. (3) REBIND after RUNSTATS and structural changes. (4) Use COMMIT frequently in batch to release locks. (5) Use CS isolation for OLTP. (6) Avoid SELECT * (fetch only needed columns). (7) Avoid correlated subqueries when joins work. (8) Use FETCH FIRST n ROWS for top-N queries.",
        code: "/* Performance checklist for a slow query: */\n/* 1. Run EXPLAIN - check ACCESSTYPE, MATCHCOLS */\nEXPLAIN PLAN FOR SELECT ...;\nSELECT ACCESSTYPE, MATCHCOLS, INDEXONLY FROM SYSIBM.PLAN_TABLE;\n\n/* 2. Check statistics currency: */\nSELECT STATSTIME FROM SYSIBM.SYSTABLES WHERE NAME = 'EMPLOYEE';\n\n/* 3. Review row count estimates: */\nSELECT NPAGES, CARD FROM SYSIBM.SYSTABLESPACES T\n    JOIN SYSIBM.SYSTABLES TBL ON T.DBNAME = TBL.DBNAME;\n\n/* 4. Add index if ACCESSTYPE=R on large table: */\nCREATE INDEX EMP_PERF_X ON EMPLOYEE (DEPTNO, SALARY DESC);",
        tip: "Performance tuning order: (1) Check EXPLAIN. (2) Run RUNSTATS. (3) REBIND. (4) Add indexes. (5) Rewrite query. This order maximizes impact with minimum risk.",
        quizOptions: ["DB2 performance is automatic and needs no tuning", "Key tuning: proper indexes, regular RUNSTATS, REBIND, frequent COMMITs, CS isolation, specific column selection, avoiding correlated subqueries", "Only hardware upgrades improve DB2 performance", "Performance tuning requires stopping DB2"],
        quizAnswerIndex: 1
    }
];
