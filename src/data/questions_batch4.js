// BATCH 4: CICS + SQL Questions (250 questions)
export const questionsBatch4 = [

    // ============ CICS QUESTIONS ============
    {
        id: "cics_b4_001", category: "CICS", level: "Beginner",
        question: "What is IBM CICS and what types of applications use it?",
        answer: "CICS (Customer Information Control System) is IBM's transaction processing middleware for z/OS. It manages online transaction processing (OLTP) providing: terminal management, transaction routing, program execution, file access, DB2 connectivity, and recovery. Applications: banking (ATM backend, teller systems), insurance (policy management), retail (point-of-sale), government (benefit systems). CICS handles thousands of concurrent transactions per second.",
        tip: "CICS is the backbone of most large-scale financial transaction systems globally. Nearly every bank withdrawal or credit card transaction touches a CICS system somewhere in its processing chain.",
        quizOptions: ["CICS is a batch processing system", "CICS is IBM's transaction processing middleware for OLTP applications like banking, insurance, and retail on z/OS", "CICS only processes COBOL programs", "CICS replaces DB2 for data management"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_002", category: "CICS", level: "Beginner",
        question: "What is a CICS transaction and how does it differ from a batch job?",
        answer: "A CICS transaction is a unit of work initiated by a 1-4 character transaction ID. It's short-lived (milliseconds to seconds), interactive, and handles one user request. Characteristics: starts on user request, processes quickly, commits/rollbacks immediately, releases all resources. Batch jobs are long-running, non-interactive, process millions of records. CICS is designed for high-concurrency, quick-response work.",
        code: "/* CICS transaction flow: */\n/* 1. User types TRAN ID (e.g., 'EMPM') at terminal */\n/* 2. CICS routes to program defined in PCT */\n/* 3. Program executes: */\nEXEC CICS RECEIVE MAP('EMPMAP') MAPSET('EMPMSET') END-EXEC\n/* 4. Process request, update DB2/VSAM */\n/* 5. EXEC CICS SEND MAP and RETURN */\n/* 6. CICS commits, releases resources */",
        tip: "Transactions should complete in under 1 second for good user experience. A transaction that takes 5+ seconds should be investigated for performance issues.",
        quizOptions: ["Transactions run for hours like batch jobs", "A CICS transaction is a short-lived unit of work (milliseconds to seconds) initiated by a 4-char ID for one user request", "Transactions cannot access DB2", "CICS transactions don't commit work"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_003", category: "CICS", level: "Beginner",
        question: "What are the key CICS resource definition tables (PCT, PPT, FCT, DCT, TCT)?",
        answer: "Classic CICS resource definition tables: PCT (Program Control Table) - maps transaction IDs to programs. PPT (Processing Program Table) - defines program attributes. FCT (File Control Table) - defines VSAM and other files. DCT (Destination Control Table) - defines transient data queues. TCT (Terminal Control Table) - defines terminals. Modern CICS uses CSD (CICS System Dataset) replacing these tables, defined via CEDA/DFHCSDUP.",
        code: "/* Modern CICS resource definition using CEDA: */\nCEDA DEF TRANSACTION(EMPM)\n    PROGRAM(EMPMAING)\n    TWASIZE(0)\n    PROFILE(DFHCICST)\n\nCEDA DEF PROGRAM(EMPMAING)\n    LANGUAGE(COBOL)\n    RELOAD(NO)\n\nCEDA DEF FILE(EMPFILE)\n    DSNAME(PROD.EMPLOYEE.CLUSTER)\n    STRINGS(3) RLSACCESS(YES)",
        tip: "Always use CEDA or DFHCSDUP scripts for resource definitions. Document all resource definitions in source control for deployment automation.",
        quizOptions: ["CICS tables are defined in JCL only", "PCT maps transactions to programs; PPT defines programs; FCT defines files; DCT transient data; TCT terminals; modern CICS uses CSD", "Resource tables are automatically generated", "Only PCT and PPT exist in modern CICS"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_004", category: "CICS", level: "Intermediate",
        question: "What is CICS EXEC CICS RECEIVE MAP / SEND MAP and how do BMS maps work?",
        answer: "BMS (Basic Mapping Support) manages terminal screen I/O. RECEIVE MAP reads data from terminal screen into COBOL record. SEND MAP writes data to terminal screen from COBOL record. Maps are defined using BMS macro assembly (DFHMDI, DFHMDF) stored as mapsets. MAPONLY sends blank map; DATAONLY sends just data fields; both can combine with map attributes.",
        code: "/* Send map to terminal: */\nEXEC CICS SEND\n    MAP('EMPMAP')\n    MAPSET('EMPMSET')\n    FROM(WS-SCREEN-DATA)\n    ERASE CURSOR\nEND-EXEC\n\n/* Receive terminal input: */\nEXEC CICS RECEIVE\n    MAP('EMPMAP')\n    MAPSET('EMPMSET')\n    INTO(WS-SCREEN-DATA)\nEND-EXEC\n\n/* Check AID key pressed: */\nIF EIBAID = DFHPF3  /* PF3 pressed */\n    EXEC CICS XCTL PROGRAM('MAINMENU') END-EXEC",
        tip: "Use EIBAID to check which attention key the user pressed (PF1-PF24, ENTER, CLEAR, PA1-PA3). Always code PF3 (end) and PF12 (cancel) key handling.",
        quizOptions: ["BMS maps work like web forms automatically", "BMS RECEIVE MAP reads terminal input into COBOL record; SEND MAP writes COBOL data to terminal screen; maps defined via BMS macros", "Maps are XML definitions processed by CICS", "SEND MAP sends emails to users"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_005", category: "CICS", level: "Intermediate",
        question: "What is the CICS EIB (Execute Interface Block) and what information does it contain?",
        answer: "The EIB is a CICS-maintained block of information about the current transaction. Key fields: EIBAID (attention ID - which key was pressed), EIBTRNID (current transaction ID), EIBCALEN (length of COMMAREA), EIBTASKN (unique task number), EIBDATE/EIBTIME (transaction start date/time), EIBRSRCE (file name causing error), EIBRCODE (6-byte response code). Available to every CICS program without explicit declaration.",
        code: "/* EIB usage examples: */\nIF EIBAID = DFHPF3          /* PF3 pressed */\n    EXEC CICS RETURN END-EXEC\nEND-IF\n\nIF EIBCALEN > 0             /* COMMAREA exists */\n    EXEC CICS ADDRESS COMMAREA(WS-PTR) END-EXEC\nEND-IF\n\nDISPLAY 'Task: ' EIBTASKN\n        ' Tran: ' EIBTRNID\n        ' Time: ' EIBTIME",
        tip: "EIB is essential for CICS programming. EIBAID processing is required for every interactive transaction. EIBCALEN check determines if returning from a XCTL/LINK or starting fresh.",
        quizOptions: ["EIB must be explicitly declared in Working Storage", "EIB is automatically maintained by CICS containing EIBAID, EIBTRNID, EIBCALEN, task details available to every program", "EIB is only for error handling", "EIB contains database connection information"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_006", category: "CICS", level: "Intermediate",
        question: "What is the CICS COMMAREA and how is it used for inter-program communication?",
        answer: "COMMAREA (Communication Area) is data passed between CICS programs or between transactions (via RETURN TRANSID COMMAREA). On XCTL/LINK: passing program receives COMMAREA in Linkage Section and via EXEC CICS ADDRESS COMMAREA. Between transactions: previous transaction passes data for next invocation. Maximum size: 32,764 bytes. EIBCALEN contains the COMMAREA length.",
        code: "/* Passing COMMAREA on XCTL: */\nMOVE 'DATA' TO WS-COMM-DATA\nEXEC CICS XCTL\n    PROGRAM('PROG2')\n    COMMAREA(WS-COMMAREA)\n    LENGTH(LENGTH OF WS-COMMAREA)\nEND-EXEC\n\n/* In PROG2 - receiving COMMAREA: */\nLINKAGE SECTION.\n01 DFHCOMMAREA.\n   05 RECV-COMM-DATA PIC X(4).\n\nPROCEDURE DIVISION.\n    EXEC CICS ADDRESS\n        COMMAREA(WS-COMM-PTR)\n    END-EXEC\n    SET ADDRESS OF DFHCOMMAREA TO WS-COMM-PTR",
        tip: "For large data structures, use CICS CHANNELS and CONTAINERS instead of COMMAREA - they support unlimited data size and are more flexible.",
        quizOptions: ["COMMAREA is a VSAM file", "COMMAREA is data passed between CICS programs via XCTL/LINK or between transactions; received in Linkage Section", "COMMAREA is limited to 100 bytes", "COMMAREA is only for DB2 data"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_007", category: "CICS", level: "Intermediate",
        question: "What is the difference between CICS XCTL, LINK, and RETURN?",
        answer: "XCTL (Transfer Control): passes control to another program; current program terminates (not returned to). LINK: calls another program as a subroutine; control returns when called program executes RETURN. RETURN: returns control to the CICS task manager; with TRANSID resumes the transaction later; without TRANSID ends the transaction.",
        code: "/* XCTL: no return (current program terminates) */\nEXEC CICS XCTL PROGRAM('NEWPROG') COMMAREA(WS-CA) END-EXEC\n/* Code below here is NEVER executed */\n\n/* LINK: returns after called program finishes */\nEXEC CICS LINK PROGRAM('SUBPROG') COMMAREA(WS-CA) END-EXEC\n/* Code continues here after SUBPROG returns */\nIF WS-CA-RC = 0 PERFORM SUCCESS-LOGIC\n\n/* RETURN: end transaction or pseudo-conversation */\nEXEC CICS RETURN\n    TRANSID('EMPM')\n    COMMAREA(WS-CA)\nEND-EXEC",
        tip: "Use LINK for subroutine calls where you need results back. Use XCTL when logically transferring to a new screen/function. Use RETURN TRANSID for pseudo-conversational design.",
        quizOptions: ["XCTL, LINK, and RETURN are identical", "XCTL transfers control (no return); LINK calls and returns; RETURN ends or suspends transaction with optional restart TRANSID", "LINK terminates the transaction", "RETURN is only for error conditions"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_008", category: "CICS", level: "Expert",
        question: "What is pseudo-conversational CICS programming and why is it the standard approach?",
        answer: "Pseudo-conversational: transaction RETURNS after sending screen to user (releasing CICS resources). When user responds, a new transaction starts. Conversational: transaction waits for user input (holding CICS resources). Pseudo-conversational is standard because: (1) CICS resources freed between user interactions, (2) Supports thousands of concurrent users with minimal resources, (3) Automatically handles system failures during user think time.",
        code: "/* Pseudo-conversational pattern: */\nMAIN-LOGIC.\n    IF EIBCALEN = 0        /* First invocation */\n        PERFORM INITIALIZE-SCREEN\n    ELSE                   /* User responded */\n        PERFORM PROCESS-INPUT\n    END-IF\n    PERFORM DISPLAY-SCREEN\n    /* Return, free resources, wait for next input: */\n    EXEC CICS RETURN\n        TRANSID(EIBTRNID)\n        COMMAREA(WS-STATE)\n        LENGTH(LENGTH OF WS-STATE)\n    END-EXEC.",
        tip: "Pseudo-conversational is non-negotiable for production CICS. A conversational transaction holding resources can bring a CICS region down if thousands of users are connected.",
        quizOptions: ["Conversational is the recommended approach", "Pseudo-conversational frees CICS resources between user interactions; handles thousands of users with minimal resources", "Pseudo-conversational is slower for users", "Both approaches are equivalent in resource usage"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_009", category: "CICS", level: "Expert",
        question: "What is CICS SYNCPOINT (commit/rollback) and how does it differ from DB2 COMMIT?",
        answer: "EXEC CICS SYNCPOINT makes all recoverable changes permanent (equivalent to COMMIT). EXEC CICS SYNCPOINT ROLLBACK undoes changes. CICS SYNCPOINT coordinates: DB2 changes, VSAM recoverable file changes, and transient data queue changes atomically using the two-phase commit protocol. In CICS, never use EXEC SQL COMMIT directly - always use EXEC CICS SYNCPOINT for proper two-phase commit coordination.",
        code: "/* CICS - correct way to commit: */\nEXEC CICS SYNCPOINT END-EXEC        /* Commits DB2 + VSAM + TDQ */\n\n/* WRONG in CICS: */\nEXEC SQL COMMIT END-EXEC  /* Only commits DB2, not VSAM! */\n\n/* CICS rollback: */\nEXEC CICS SYNCPOINT ROLLBACK END-EXEC  /* Rolls back all resources */\n\n/* Program end causes automatic SYNCPOINT: */\nEXEC CICS RETURN END-EXEC  /* Auto-commits at transaction end */",
        tip: "NEVER use EXEC SQL COMMIT in a CICS program. It commits DB2 changes but not VSAM changes, breaking two-phase commit atomicity. Always use EXEC CICS SYNCPOINT.",
        quizOptions: ["EXEC SQL COMMIT and CICS SYNCPOINT are identical", "CICS SYNCPOINT coordinates DB2 + VSAM + TDQ commits via two-phase commit; never use EXEC SQL COMMIT in CICS programs", "CICS automatically commits after each SQL statement", "CICS SYNCPOINT only commits VSAM changes"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_010", category: "CICS", level: "Expert",
        question: "What is CICS ABEND handling and how do you recover gracefully from abends?",
        answer: "CICS programs can abend with IBM-defined (ASRA=S0C7, AEIA, AEIB) or user-defined codes. Handling options: (1) EXEC CICS HANDLE ABEND PROGRAM(errprog) - routes to handler program. (2) EXEC CICS IGNORE CONDITION ERROR - ignores conditions. (3) Structured error handling using RESP/RESP2. Modern approach: RESP/RESP2 testing is preferred over HANDLE ABEND which uses non-structured branching.",
        code: "/* Modern structured approach (recommended): */\nEXEC CICS READ FILE('EMPFILE')\n    INTO(WS-EMP-RECORD)\n    RIDFLD(WS-EMP-KEY)\n    RESP(WS-RESP)\nEND-EXEC\n\nEVALUATE WS-RESP\n    WHEN DFHRESP(NORMAL)    PERFORM PROCESS-RECORD\n    WHEN DFHRESP(NOTFND)    PERFORM RECORD-NOT-FOUND\n    WHEN DFHRESP(DISABLED)  PERFORM FILE-DISABLED\n    WHEN OTHER              PERFORM CICS-ERROR-HANDLER\nEND-EVALUATE",
        tip: "Always use RESP/RESP2 for all CICS commands. For truly unexpected abends, install a global error handler using EXEC CICS HANDLE ABEND in a startup program.",
        quizOptions: ["CICS abends always terminate the system", "CICS abend handling via RESP/RESP2 (modern) or HANDLE ABEND (legacy); always check RESP after every CICS command", "ABEND handling is automatic in CICS", "Only IBM can define CICS abend codes"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_011", category: "CICS", level: "Expert",
        question: "What are CICS Temporary Storage (TS) queues and how are they used?",
        answer: "TS queues (CICS WRITEQ TS / READQ TS / DELETEQ TS) are temporary data areas for inter-task or inter-transaction data sharing. Data can be on auxiliary storage (disk) or main storage (memory). Items are accessed by queue name and item number (1-based). Unlike TDQ, TS queues support random access. Uses: state saving between pseudo-conversations, multi-step transaction data, screen paging.",
        code: "/* Write to TS queue: */\nEXEC CICS WRITEQ TS\n    QUEUE('EMPDATA' || EIBTASKN)\n    FROM(WS-SCREEN-DATA)\n    LENGTH(LENGTH OF WS-SCREEN-DATA)\n    RESP(WS-RESP)\nEND-EXEC\n\n/* Read from TS queue: */\nEXEC CICS READQ TS\n    QUEUE('EMPDATA' || EIBTASKN)\n    INTO(WS-SCREEN-DATA)\n    LENGTH(WS-LENGTH)\n    ITEM(1)         /* Item number 1 */\n    RESP(WS-RESP)\nEND-EXEC\n\n/* Delete when done: */\nEXEC CICS DELETEQ TS QUEUE('EMPDATA' || EIBTASKN) END-EXEC",
        tip: "Always include task number in TS queue name to prevent different users' queues from colliding. Always DELETEQ when done to prevent TS queue buildup filling auxiliary storage.",
        quizOptions: ["TS queues can only be read once like a stack", "TS queues support random access by item number; used for inter-task data sharing and state saving in pseudo-conversational programs", "TS queues are automatically deleted at task end", "TS queues are identical to TDQ"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_012", category: "CICS", level: "Intermediate",
        question: "What are CICS Transient Data (TD) queues and how do they differ from TS queues?",
        answer: "TD queues (WRITEQ TD / READQ TD / DELETEQ TD) are sequential (FIFO) data streams. Types: Intrapartition (within one CICS region, trigger support), Extrapartition (sequential file for external access). READ destroys the item (unlike TS queues where data persists). Trigger level causes automatic transaction start when queue reaches a count. Uses: print spooling, inter-region messaging, asynchronous processing.",
        code: "/* Write to TD queue: */\nEXEC CICS WRITEQ TD\n    QUEUE('PRNT')           /* Intrapartition TDQ */\n    FROM(WS-PRINT-LINE)\n    LENGTH(LENGTH OF WS-PRINT-LINE)\n    RESP(WS-RESP)\nEND-EXEC\n\n/* TD queue trigger automatically starts PRNT transaction */\n/* when queue reaches TRIGNUM records */\n\n/* Read from TD queue (destructive): */\nEXEC CICS READQ TD\n    QUEUE('INPT')\n    INTO(WS-DATA)\n    LENGTH(WS-LEN)\n    RESP(WS-RESP)\nEND-EXEC",
        tip: "Use TD queues (with triggers) for asynchronous processing patterns: one transaction writes requests, another processes them. This decouples producers from consumers.",
        quizOptions: ["TD and TS queues are identical", "TD queues are FIFO (read destroys item); support triggers; intrapartition/extrapartition; unlike TS queues which allow random item access", "TD queues can hold unlimited data", "TD queues are for DB2 data only"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_013", category: "CICS", level: "Expert",
        question: "What is CICS MRO (Multi-Region Operation) and how does it work?",
        answer: "MRO allows multiple CICS regions in the same z/OS system to communicate and share resources. An AOR (Application-Owning Region) runs programs; a TOR (Terminal-Owning Region) owns terminals; a FOR (File-Owning Region) owns files. Function shipping transparently routes resource requests between regions. Uses: workload separation, resource sharing, availability isolation.",
        code: "/* MRO function shipping - transparent to programs: */\n/* CICS configuration defines remote resource: */\n/* DEFINE FILE(EMPFILE) REMOTESYSTEM(FOR1) */\n/*   REMOTENAME(EMPFILE) */\n\n/* Program code is identical: */\nEXEC CICS READ FILE('EMPFILE')\n    INTO(WS-EMP)\n    RIDFLD(WS-KEY)\nEND-EXEC\n/* CICS transparently ships this to FOR1 (File-Owning Region) */",
        tip: "MRO enables CICS horizontal scaling. By separating terminals (TOR), applications (AOR), and files (FOR) into different regions, each can be independently scaled and maintained.",
        quizOptions: ["MRO connects CICS to multiple mainframes", "MRO connects multiple CICS regions in the same z/OS system via function shipping for resource sharing and workload separation", "MRO is required for all CICS programs", "MRO is the same as VTAM"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_014", category: "CICS", level: "Expert",
        question: "What is CICS ISC (Inter-System Communication) and how does it support distributed processing?",
        answer: "ISC connects CICS regions on different z/OS systems or different platforms via VTAM/IP. Protocols: APPC (LU 6.2) for peer-to-peer communication, LUTYPE6.1 for hierarchical. ISC enables: distributed transaction processing (DTP) with two-phase commit across systems, remote file access, distributed program link. Modern CICS uses IP interconnectivity for connections to distributed systems.",
        code: "/* CICS-to-CICS LINK across systems (ISC): */\nEXEC CICS LINK\n    PROGRAM('REMOTPGM')\n    SYSID('CICS02')         /* Remote CICS system ID */\n    COMMAREA(WS-CA)\n    LENGTH(WS-CA-LEN)\n    RESP(WS-RESP)\nEND-EXEC\n/* CICS routes this request to CICS02 automatically */",
        tip: "ISC and MRO together form the CICS intercommunication foundation. Understanding these is essential for architecting multi-region CICS environments for availability and scale.",
        quizOptions: ["ISC connects CICS to DB2 only", "ISC connects CICS regions on different systems via VTAM/IP enabling distributed transaction processing with two-phase commit", "ISC is the same as MRO", "ISC requires special hardware"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_015", category: "CICS", level: "Expert",
        question: "What is CICS storage protection and what are the CICS storage violations?",
        answer: "CICS storage protection prevents programs from overwriting other programs' or CICS's own storage. Storage violation indicators: (1) ASRA abend - program tried to access storage at invalid address (S0C4/S0C7). (2) Loop/hang - program modifying loop counter or control blocks. (3) STORAGE CHECK option - CICS validates storage before RETURN. CICS Transaction Isolation (TRANISO) protects each task's storage.",
        code: "/* Storage violation symptoms: */\n/* 1. Unexpected abend with ASRA or AESR code */\n/* 2. Incorrect data in other programs' working storage */\n/* 3. CICS region crash with DFHSR0603 message */\n\n/* Enable storage checking: */\n/* CICS SIT parameter: STGPROT=YES */\n/* CICS transaction definition: ISOLATE(YES) */\n\n/* Diagnose via: */\n/* CICS CEMT INQUIRY TASK */\n/* Storage Dump with CSFE DEBUG */",
        tip: "Enable STGPROT=YES and ISOLATE=YES in production CICS regions. Storage violations are among the hardest bugs to diagnose because effects appear far from the actual cause.",
        quizOptions: ["CICS has no storage protection", "CICS storage protection prevents programs from overwriting others' storage; ASRA/AESR abends indicate violations; TRANISO isolates task storage", "Storage protection only applies to VSAM files", "Storage violations always cause z/OS IPL"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_016", category: "CICS", level: "Expert",
        question: "What is CEDF (CICS Execution Diagnostic Facility) and how is it used for debugging?",
        answer: "CEDF is CICS's interactive debugging tool. It intercepts CICS commands in a transaction, allowing inspection and modification before/after execution. Features: view/modify WS variables, EIB, CICS responses; step through EXEC CICS commands; set breakpoints; suppress abnormal completion. Enable by running CEDF before the transaction, or add CEDF at start of program.",
        code: "/* Enable CEDF interception: */\n/* At terminal, type: CEDF */\n/* Then run your transaction: EMPM */\n/* CEDF intercepts every EXEC CICS command */\n\n/* Or add to program for specific debugging: */\nEXEC CICS CEDF END-EXEC   /* Enable CEDF from within program */\n\n/* Key CEDF features: */\n/* - 'END' key: process command, show response */\n/* - PF1: suppress CICS abend */\n/* - PF4/PF5: turn CEDF on/off */",
        tip: "CEDF is invaluable for debugging CICS programs in test environments. Never run CEDF in production as it requires exclusive access to the transaction.",
        quizOptions: ["CEDF is a COBOL compiler option", "CEDF is CICS's interactive debugger that intercepts EXEC CICS commands for inspection and modification", "CEDF is only for DB2 SQL debugging", "CEDF requires special IBM software license"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_017", category: "CICS", level: "Expert",
        question: "What is CICS channel and container communication (modern CICS)?",
        answer: "Channels and containers replace COMMAREA for inter-program communication in modern CICS. A channel holds named containers (any size, binary/text). PUT CONTAINER adds data; GET CONTAINER retrieves data. Benefits over COMMAREA: unlimited size, multiple named data items, accessible across transaction boundaries, typed (binary or character). Used with LINK CHANNEL or XCTL CHANNEL.",
        code: "/* Put data into container: */\nEXEC CICS PUT CONTAINER('EMPDATA')\n    CHANNEL('EMPCHAN')\n    FROM(WS-EMP-RECORD)\n    FLENGTH(LENGTH OF WS-EMP-RECORD)\n    CHAR           /* Character data type */\nEND-EXEC\n\n/* LINK passing channel: */\nEXEC CICS LINK PROGRAM('EMPSVC')\n    CHANNEL('EMPCHAN')\nEND-EXEC\n\n/* In EMPSVC: Get container */\nEXEC CICS GET CONTAINER('EMPDATA')\n    CHANNEL('EMPCHAN')\n    INTO(WS-EMP)\n    FLENGTH(WS-LEN)\nEND-EXEC",
        tip: "Use channels/containers for all new CICS inter-program interfaces. They eliminate the 32KB COMMAREA limit and support future-proof named parameter passing.",
        quizOptions: ["Channels are a networking technology", "CICS channels/containers replace COMMAREA for inter-program data passing; unlimited size, named data items, typed data", "Channels are only for CICS-to-CICS communication", "Containers are only available in CICS TS 5.0+"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_018", category: "CICS", level: "Expert",
        question: "How does CICS handle transaction isolation for data integrity?",
        answer: "CICS provides transaction isolation at multiple levels: (1) Task isolation: CICS TRANISO(YES) gives each task its own protected storage. (2) Database isolation: DB2 isolation levels (CS, RS, RR, UR) control record locking. (3) VSAM locking: file DISP and RLS record-level locking. (4) Two-phase commit: CICS SYNCPOINT coordinates all recoverable resources atomically.",
        code: "/* CICS transaction with proper isolation: */\nEXEC CICS READ FILE('ACCOUNT')\n    INTO(WS-ACCT-REC)\n    RIDFLD(WS-ACCT-KEY)\n    UPDATE         /* Acquire UPDATE lock for REWRITE */\n    RESP(WS-RESP)\nEND-EXEC\n\nIF WS-RESP = DFHRESP(NORMAL)\n    ADD WS-AMOUNT TO WS-ACCT-BALANCE\n    EXEC CICS REWRITE FILE('ACCOUNT')\n        FROM(WS-ACCT-REC)\n        RESP(WS-RESP)\n    END-EXEC\n    EXEC CICS SYNCPOINT END-EXEC  /* Commit */\nEND-IF",
        tip: "READ UPDATE followed by REWRITE is CICS's optimistic locking mechanism for file updates. The UPDATE lock prevents other tasks from modifying the record until you REWRITE or UNLOCK.",
        quizOptions: ["CICS has no transaction isolation", "CICS isolation combines TRANISO for storage, DB2 isolation levels for DB, VSAM locks for files, and SYNCPOINT for atomic commit", "Isolation is automatically handled by VTAM", "All CICS tasks share the same memory space"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_019", category: "CICS", level: "Expert",
        question: "What is CICS ENQUEUE/DEQUEUE and when is it used instead of file locking?",
        answer: "EXEC CICS ENQ resource and EXEC CICS DEQ resource provide application-level mutual exclusion. Unlike file UPDATE locks, ENQ/DEQ can serialize any logical resource: a record, a batch process, a code block, or a business entity. ENQ waits (with timeout) if resource is held. Uses: serializing updates that span multiple files, preventing concurrent execution of critical sections.",
        code: "/* Serialize access to a logical resource: */\nEXEC CICS ENQ\n    RESOURCE(WS-ACCT-KEY)\n    LENGTH(LENGTH OF WS-ACCT-KEY)\n    MAXLIFETIME(TASK)\n    NOSUSPEND       /* Don't wait if already enqueued */\n    RESP(WS-RESP)\nEND-EXEC\n\nIF WS-RESP = DFHRESP(NORMAL)\n    PERFORM CRITICAL-SECTION\n    EXEC CICS DEQ\n        RESOURCE(WS-ACCT-KEY)\n        LENGTH(LENGTH OF WS-ACCT-KEY)\n    END-EXEC\nELSE\n    PERFORM RESOURCE-BUSY-HANDLER\nEND-IF",
        tip: "Always DEQ resources explicitly. Use MAXLIFETIME(TASK) to auto-release on task end. NOSUSPEND returns immediately if busy instead of waiting (prevents deadlock risks).",
        quizOptions: ["ENQ/DEQ are the same as file UPDATE locks", "CICS ENQ/DEQ provides application-level serialization for any logical resource beyond what file UPDATE locks can protect", "ENQ only works for VSAM files", "ENQ is automatically managed by CICS"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_020", category: "CICS", level: "Expert",
        question: "What are CICS web services and how does CICS expose COBOL programs as REST APIs?",
        answer: "CICS supports JSON and XML web services using CICS Web Support. Methods: (1) JSON/SOAP service binding - maps CICS programs to web services automatically using WSDL or JSON schema. (2) EXEC CICS WEB RECEIVE/SEND commands for HTTP handling. (3) HTTP client API (EXEC CICS WEB OPEN/CONVERSE) for calling external services. CICS Liberty profile enables Java EE/Jakarta EE REST services.",
        code: "/* CICS HTTP server handling: */\nEXEC CICS WEB RECEIVE\n    INTO(WS-HTTP-BODY)\n    LENGTH(WS-BODY-LEN)\n    MEDIATYPE(WS-CONTENT-TYPE)\nEND-EXEC\n\n* Parse JSON request, process, build JSON response:\nPERFORM PARSE-JSON-REQUEST\nPERFORM PROCESS-BUSINESS-LOGIC\nPERFORM BUILD-JSON-RESPONSE\n\nEXEC CICS WEB SEND\n    FROM(WS-JSON-RESPONSE)\n    LENGTH(WS-RESP-LEN)\n    MEDIATYPE('application/json')\n    STATUSCODE(200)\nEND-EXEC",
        tip: "CICS web services enable existing COBOL business logic to be exposed as REST/SOAP APIs without rewriting. This is the primary modernization approach for legacy CICS assets.",
        quizOptions: ["CICS cannot support web services", "CICS supports REST/SOAP via JSON/XML binding, WEB RECEIVE/SEND commands, and Liberty profile for exposing COBOL as APIs", "Web services require CICS replacement", "CICS web services only work with XML"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_021", category: "CICS", level: "Expert",
        question: "What is CICS transaction definition security and how does RACF protect CICS transactions?",
        answer: "CICS uses RACF to control transaction access. RACF profiles in TCICSTRN class (transaction access) define which users/groups can execute which transactions. Profiles in TFILE class protect file access. PTKTDATA class handles PassTickets. CICS checks RACF at transaction start and resource access. XSTERM, XTTCL, XTRACT RACF exits provide additional customization.",
        code: "/* RACF commands for CICS security: */\n/* RDEFINE TCICSTRN EMPM UACC(NONE) */\n/* PERMIT EMPM CLASS(TCICSTRN) ID(EMPUSERS) ACCESS(READ) */\n\n/* Only EMPUSERS group can execute EMPM transaction */\n\n/* Programmatic auth check in CICS program: */\nEXEC CICS QUERY SECURITY\n    RESTYPE('TRANSACTION')\n    RESID('EMPM')\n    READ(WS-ALLOWED)\n    RESP(WS-RESP)\nEND-EXEC\nIF WS-ALLOWED = 'N' PERFORM SECURITY-ERROR",
        tip: "Use RACF profiles for CICS transaction security rather than application-level security checks. Centralized RACF control is more consistent, auditable, and maintainable.",
        quizOptions: ["CICS has its own built-in user management", "RACF TCICSTRN profiles control transaction access; TFILE profiles control file access; CICS checks RACF at each transaction start", "CICS transaction security is always disabled by default", "Only TSO users need RACF profiles for CICS"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_022", category: "CICS", level: "Intermediate",
        question: "How do you perform CICS file BROWSE (start browse, read next, end browse)?",
        answer: "CICS file browsing starts with EXEC CICS STARTBR FILE pointing to an initial key, followed by repeated EXEC CICS READNEXT to retrieve records sequentially, and EXEC CICS ENDBR to clean up. REQID distinguishes multiple simultaneous browses. GTEQ option positions at or after the specified key. GENERIC with RIDFLD and KEYLENGTH browses records with a partial key prefix.",
        code: "/* Start browse from key >= '100': */\nMOVE '100' TO WS-EMP-KEY\nEXEC CICS STARTBR FILE('EMPFILE')\n    RIDFLD(WS-EMP-KEY)\n    GTEQ\n    RESP(WS-RESP)\nEND-EXEC\n\n/* Read records sequentially: */\nPERFORM UNTIL SQLCODE = 100 OR WS-DONE = 'Y'\n    EXEC CICS READNEXT FILE('EMPFILE')\n        INTO(WS-EMP-REC)\n        RIDFLD(WS-EMP-KEY)\n        RESP(WS-RESP)\n    END-EXEC\n    IF WS-RESP = DFHRESP(ENDFILE) MOVE 'Y' TO WS-DONE\n    ELSE IF WS-RESP = DFHRESP(NORMAL) PERFORM PROCESS-EMP\nEND-PERFORM\n\nEXEC CICS ENDBR FILE('EMPFILE') END-EXEC",
        tip: "Always ENDBR after browsing to release CICS browse resources. Unreleased browses consume CICS resources and can cause CICS storage shortages.",
        quizOptions: ["CICS doesn't support sequential file reading", "CICS browse: STARTBR positions, READNEXT reads sequentially, ENDBR releases resources; GTEQ for >= key positioning", "READNEXT only works with KSDS files", "STARTBR is identical to CICS READ"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_023", category: "CICS", level: "Expert",
        question: "What is CICS workload balancing and how does SYSPLEX load balancing work?",
        answer: "CICS sysplex load balancing routes transactions across multiple CICS regions in a sysplex for scalability. CICSPlex SM (CPSM) manages routing using: transaction class affinity, routing criteria (CPU, response time), connection pooling. The Workload Manager (WLM) assigns work based on service class goals. Workload routing connects clients to least-loaded eligible CICS regions.",
        code: "/* CICSPlex routing policy: */\n/* Defined in CPSM workload manager (WLM): */\n/* DEFINE TRANSACTION EMPM LOAD BALANCE IN CICSGROUP */\n\n/* Monitor load balancing via: */\nEXEC CICS COLLECT STATISTICS SET(WS-PTR)\n    /* Use CICSPlex SM monitoring for cross-region view */",
        tip: "CICSPlex SM is essential for managing large CICS environments. It provides single-point management for hundreds of CICS regions and automates workload distribution.",
        quizOptions: ["CICS doesn't support load balancing", "CICSPlex SM manages sysplex load balancing routing transactions to least-loaded CICS regions based on WLM service class goals", "Load balancing requires hardware upgrades", "Load balancing only works for batch jobs"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_024", category: "CICS", level: "Expert",
        question: "What is CICS ACQUIRE and how does it relate to conversation management?",
        answer: "EXEC CICS ACQUIRE TERMINAL acquires a specific terminal for sending data without the user initiating a transaction. Used for: operator notifications, pushing updates to screens, automated monitoring alerts. Must use the correct principal facility. Related: EXEC CICS RETRIEVE DATA retrieves data passed from a START TRANSID command.",
        code: "/* Trigger a transaction on a specific terminal: */\nEXEC CICS START\n    TRANSID('ALRT')\n    TERMID('T001')     /* Specific terminal */\n    FROM(WS-ALERT-DATA)\n    LENGTH(WS-ALERT-LEN)\n    RESP(WS-RESP)\nEND-EXEC\n\n/* In ALRT transaction, retrieve the passed data: */\nEXEC CICS RETRIEVE\n    INTO(WS-ALERT-DATA)\n    LENGTH(WS-ALERT-LEN)\n    RESP(WS-RESP)\nEND-EXEC\nEXEC CICS SEND TEXT FROM(WS-ALERT-MSG) END-EXEC",
        tip: "CICS START + RETRIEVE is the mechanism for asynchronous inter-transaction communication. Use it to notify online users of batch-processed results.",
        quizOptions: ["ACQUIRE is only for database connections", "EXEC CICS START initiates transactions on specific terminals; RETRIEVE gets passed data; used for push notifications and async messaging", "ACQUIRE replaces XCTL", "Terminals cannot be addressed programmatically in CICS"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_025", category: "CICS", level: "Expert",
        question: "How does CICS handle 3270 terminal screen attributes and extended color?",
        answer: "3270 terminal attributes control field behavior: MDT (Modified Data Tag - field was changed by user), PROT (protected - cannot type in field), ASKIP (auto-skip to next field), BRIGHT (intensified display), DARK (invisible - for passwords), BRT (bright). Extended attributes: color (blue, green, red, yellow, white, pink, turquoise), highlighting (blink, reverse video, underscore). Set via BMS map definitions or dynamically.",
        code: "/* BMS macro definition with color: */\nEMPFLDM  DFHMDF POS=(10,01),LENGTH=06,ATTRIB=(ASKIP,FSET),\n                COLOR=GREEN,HILIGHT=UNDERSCORE\n\n/* Dynamic attribute change in COBOL: */\nMOVE DFHBMFSE TO EMPFLDMA  /* Set MDT, PROT, BRIGHT */\n/* Or: */\nMOVE LOW-VALUE TO EMPFLDMA  /* Normal, unprotected */\nMOVE DFHYELLO TO EMPFLDCA  /* Yellow color via BMS extended attrs */",
        tip: "Use PROT and ASKIP for output fields. Use MDT programmatically to control which fields are returned in RECEIVE MAP. Color coding helps users identify field types (green=input, white=output, yellow=warning).",
        quizOptions: ["3270 terminals are all character-only", "3270 attributes control field behavior (PROT, ASKIP, MDT, BRIGHT) and extended colors/highlighting via BMS map or dynamic setting", "Color requires special 3270 hardware", "MDT is automatically set by CICS for all fields"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_026", category: "CICS", level: "Expert",
        question: "What is CICS GETMAIN and FREEMAIN for dynamic storage in programs?",
        answer: "EXEC CICS GETMAIN obtains a chunk of storage from CICS storage areas. EXEC CICS FREEMAIN releases it. Options: FLENGTH (byte count), SHARED for storage surviving task termination, BELOW for 24-bit storage. SET receives the address pointer. In COBOL, the pointer is set via SET ADDRESS OF Linkage-Section item. Essential when variable-length data structures are needed at runtime.",
        code: "01 WS-STORAGE-PTR POINTER.\n\nLINKAGE SECTION.\n01 LS-DYN-AREA.\n   05 LS-DYN-DATA PIC X(1000).\n\n/* Allocate dynamic storage: */\nEXEC CICS GETMAIN\n    SET(WS-STORAGE-PTR)\n    FLENGTH(1000)\n    RESP(WS-RESP)\nEND-EXEC\nSET ADDRESS OF LS-DYN-AREA TO WS-STORAGE-PTR\n\n/* Use LS-DYN-AREA for processing */\n\n/* Release when done: */\nEXEC CICS FREEMAIN DATAPOINTER(WS-STORAGE-PTR) END-EXEC",
        tip: "Always FREEMAIN dynamically obtained storage when finished. Unreleased storage causes CICS DSA (Dynamic Storage Area) shortages, eventually causing CICS abends.",
        quizOptions: ["GETMAIN allocates datasets", "EXEC CICS GETMAIN allocates dynamic storage; SET ADDRESS OF Linkage Section points to it; FREEMAIN releases it", "GETMAIN is only for non-reentrant programs", "CICS automatically manages all program storage"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_027", category: "CICS", level: "Intermediate",
        question: "What is CICS VERIFY PASSWORD and how is it used for application security?",
        answer: "EXEC CICS VERIFY PASSWORD validates a user ID and password against RACF. Returns RESP=NORMAL if valid. If invalid: RESP=NOTAUTH (incorrect password), RESP=INVREQ (user ID not found). Used to implement application-specific login screens or re-authentication before sensitive operations. Modern alternative: EXEC CICS VERIFY CERTIFICATE for certificate-based auth.",
        code: "EXEC CICS VERIFY PASSWORD\n    USERID(WS-USERID)\n    PASSWORD(WS-PASSWORD)\n    RESP(WS-RESP)\n    RESP2(WS-RESP2)\nEND-EXEC\n\nIF WS-RESP = DFHRESP(NORMAL)\n    PERFORM AUTHENTICATION-SUCCESS\nELSE IF WS-RESP = DFHRESP(NOTAUTH)\n    ADD 1 TO WS-FAILED-ATTEMPTS\n    IF WS-FAILED-ATTEMPTS >= 3\n        PERFORM LOCK-ACCOUNT\n    END-IF\nEND-IF",
        tip: "Implement lockout logic for failed authentication attempts. Log all authentication events for security audit requirements. Never display specific error reasons to prevent user enumeration attacks.",
        quizOptions: ["VERIFY PASSWORD connects to LDAP only", "EXEC CICS VERIFY PASSWORD validates credentials against RACF; returns NOTAUTH for invalid passwords; used for application login", "Password verification is automatic in CICS", "VERIFY PASSWORD is only for started tasks"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_028", category: "CICS", level: "Expert",
        question: "What are CICS service classes and how does WLM prioritize CICS work?",
        answer: "WLM service classes define goals (response time, execution velocity) for workload types. CICS transactions are classified by: transaction name, terminal type, user ID, or time of day. WLM dynamically allocates CPU and I/O resources to meet goals. High-priority service classes (customer-facing transactions) preempt lower-priority work (reports, background processing).",
        code: "/* WLM classification rules (defined in SDSF WLM policy): */\n/* CLASSIFY SUBSYSTEM(CICS) */\n/*   TRANSACTION('EMPM') SRVCLASS(PREMIUM) */\n/*   TRANSACTION('RPT*') SRVCLASS(BACKGROUND) */\n\n/* Monitor via: */\n/* SDSF WLM panel or OMEGAMON performance dashboard */",
        tip: "Work with your WLM administrator to define appropriate service classes. Customer-facing transactions should have response time goals (e.g., 0.5s 90th percentile) clearly defined.",
        quizOptions: ["All CICS transactions have identical priority", "WLM service classes define goals (response time, velocity) for different transaction types; WLM dynamically allocates resources to meet goals", "CICS manages its own priority without WLM", "WLM only works for batch jobs"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_029", category: "CICS", level: "Expert",
        question: "What is a CICS dump and how do you analyze it for debugging?",
        answer: "CICS dumps are produced for system errors (CICS system dump - SDUMP) or transaction abends (transaction dump). Transaction dump includes: task and program storage, EIB, COMMAREA, register contents at abend, trace entries. Analyze using IPCS (Interactive Problem Control System) or CICS-supplied dump analysis tools. CSFE debug facility assists dump analysis.",
        code: "/* Trigger a transaction dump manually: */\nEXEC CICS DUMP DUMPCODE('MYCD')\n    FROM(WS-DIAG-DATA)\n    LENGTH(LENGTH OF WS-DIAG-DATA)\nEND-EXEC\n\n/* Set dump table entry in CICS: */\n/* CEMT SET DUMPDS(TRANSACTION) */\n\n/* View dump using IPCS: */\n/* VERBEXIT CICSDATA VERB TRANDUMP */",
        tip: "For production abend debugging, always capture and save the CICS dump before the region recycles. Key dump sections: CICS trace table (shows last EXEC CICS commands before abend), program storage, EIB.",
        quizOptions: ["CICS dumps are only for IBM support use", "CICS dumps contain task storage, EIB, registers at abend point; analyze with IPCS for production debugging", "Transaction dumps are identical to z/OS system dumps", "CICS dumps are automatically analyzed by the system"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_030", category: "CICS", level: "Intermediate",
        question: "How does CICS handle interval control (ASKTIME, DELAY, POST)?",
        answer: "CICS interval control manages time-based processing: EXEC CICS ASKTIME updates EIBTIME/EIBDATE to current time. EXEC CICS DELAY INTERVAL(hhmmss) suspends task for a time period (without holding resources wastefully). EXEC CICS POST INTERVAL sets a time-event flag checked with EXEC CICS WAIT EVENT.",
        code: "/* Get current time: */\nEXEC CICS ASKTIME ABSTIME(WS-ABSTIME) END-EXEC\nEXEC CICS FORMATTIME ABSTIME(WS-ABSTIME)\n    DATESEP('/')\n    DDMMYYYY(WS-DATE)\n    TIMESEP(':')\n    HHMMSS(WS-TIME)\nEND-EXEC\n\n/* Suspend for 5 seconds without wasting CPU: */\nEXEC CICS DELAY INTERVAL(5) RESP(WS-RESP) END-EXEC\n\n/* The task is suspended and CICS processes other work */",
        tip: "Never use PERFORM VARYING...UNTIL WS-TIME-ELAPSED to wait in CICS. Use EXEC CICS DELAY which properly suspends the task and allows CICS to process other work.",
        quizOptions: ["CICS programs should use PERFORM loops to wait", "CICS DELAY properly suspends tasks without wasting CPU; ASKTIME updates EIB time; FORMATTIME formats timestamps for display", "DELAY blocks the entire CICS region", "Time-based processing requires batch jobs"],
        quizAnswerIndex: 1
    },

    // ============ SQL QUESTIONS ============
    {
        id: "sql_b4_001", category: "SQL", level: "Beginner",
        question: "What is the difference between WHERE and HAVING clause?",
        answer: "WHERE filters rows before grouping - operates on individual rows and cannot use aggregate functions. HAVING filters groups after GROUP BY - operates on aggregate results (COUNT, SUM, AVG, MAX, MIN). You can combine both: WHERE filters individual rows first, GROUP BY groups them, HAVING filters the groups.",
        code: "/* WHERE - filters rows before grouping: */\nSELECT DEPTNO, AVG(SALARY)\nFROM EMPLOYEE\nWHERE YEAR(HIREDATE) > 2020    /* Filter individual rows first */\nGROUP BY DEPTNO\nHAVING AVG(SALARY) > 50000;    /* Filter groups after aggregation */",
        tip: "Remember: WHERE cannot reference aliases created in SELECT. HAVING can reference grouped column aliases. Place filter conditions in WHERE whenever possible - it reduces the data before GROUP BY.",
        quizOptions: ["WHERE and HAVING are identical", "WHERE filters rows before grouping; HAVING filters after GROUP BY; only HAVING can use aggregate functions", "HAVING filters individual rows", "WHERE is used only for joins"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_002", category: "SQL", level: "Beginner",
        question: "What are the different types of SQL joins?",
        answer: "JOIN types: INNER JOIN returns only matching rows from both tables. LEFT OUTER JOIN returns all rows from left table + matching right rows (non-matched right rows are NULL). RIGHT OUTER JOIN returns all right rows + matching left rows. FULL OUTER JOIN returns all rows from both tables (NULLs where no match). CROSS JOIN returns Cartesian product of both tables.",
        code: "/* INNER JOIN - only matching: */\nSELECT E.EMPNO, E.LASTNAME, D.DEPTNAME\nFROM EMPLOYEE E INNER JOIN DEPARTMENT D\n    ON E.WORKDEPT = D.DEPTNO;\n\n/* LEFT OUTER JOIN - all employees, even without dept: */\nSELECT E.EMPNO, D.DEPTNAME\nFROM EMPLOYEE E LEFT OUTER JOIN DEPARTMENT D\n    ON E.WORKDEPT = D.DEPTNO;\n/* D.DEPTNAME is NULL for employees with no department */",
        tip: "Use INNER JOIN when you only want records with matches in both tables. Use LEFT JOIN when you need all records from the primary table regardless of matches.",
        quizOptions: ["JOIN always returns all rows from both tables", "INNER JOIN=matching only; LEFT/RIGHT=all from one side; FULL=all rows; CROSS=Cartesian product", "LEFT JOIN discards unmatched rows from both tables", "OUTER and JOIN are the same keyword"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_003", category: "SQL", level: "Beginner",
        question: "What are SQL aggregate functions and how do they work with GROUP BY?",
        answer: "Aggregate functions compute values across multiple rows: COUNT(*) counts rows (including NULLs), COUNT(col) counts non-NULL values, SUM(col) totals numeric values, AVG(col) computes average (ignores NULLs), MAX/MIN finds maximum/minimum. With GROUP BY, aggregates compute per-group. Without GROUP BY, they compute over the entire result set.",
        code: "SELECT DEPTNO,\n       COUNT(*) AS EMP_COUNT,\n       SUM(SALARY) AS TOTAL_SALARY,\n       AVG(SALARY) AS AVG_SALARY,\n       MAX(SALARY) AS MAX_SALARY,\n       MIN(SALARY) AS MIN_SALARY\nFROM EMPLOYEE\nGROUP BY DEPTNO\nORDER BY TOTAL_SALARY DESC;",
        tip: "COUNT(*) vs COUNT(col): COUNT(*) counts all rows; COUNT(col) skips NULLs. This difference matters for nullable columns. Always check which behavior you need.",
        quizOptions: ["Aggregate functions work on single rows", "Aggregate functions (COUNT, SUM, AVG, MAX, MIN) compute across groups defined by GROUP BY or across entire result set without GROUP BY", "SUM includes NULL values in calculation", "GROUP BY is optional with aggregate functions"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_004", category: "SQL", level: "Intermediate",
        question: "How do SQL window functions (RANK, ROW_NUMBER, DENSE_RANK) work?",
        answer: "Window functions compute values across a set of rows related to the current row, defined by OVER clause with PARTITION BY and ORDER BY. RANK(): gives same rank to ties, skips next ranks. DENSE_RANK(): no gaps after ties. ROW_NUMBER(): unique sequential number regardless of ties. These enable ranking within groups without self-joins.",
        code: "/* Rank employees by salary within department: */\nSELECT EMPNO, DEPTNO, SALARY,\n       RANK() OVER (PARTITION BY DEPTNO\n                   ORDER BY SALARY DESC) AS RANK,\n       DENSE_RANK() OVER (PARTITION BY DEPTNO\n                          ORDER BY SALARY DESC) AS DRANK,\n       ROW_NUMBER() OVER (PARTITION BY DEPTNO\n                          ORDER BY SALARY DESC) AS ROWNUM\nFROM EMPLOYEE;",
        tip: "Use ROW_NUMBER for pagination (top N per group). Use RANK/DENSE_RANK for actual ranking where ties matter. Window functions avoid complex self-joins for ranked data.",
        quizOptions: ["RANK and ROW_NUMBER are identical", "RANK skips after ties; DENSE_RANK doesn't skip; ROW_NUMBER always gives unique sequential numbers; all use OVER(PARTITION BY ORDER BY)", "Window functions require GROUP BY", "These functions are not available in DB2"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_005", category: "SQL", level: "Intermediate",
        question: "How do you find the maximum salary in each department using SQL?",
        answer: "Multiple approaches: (1) GROUP BY with MAX(): SELECT DEPTNO, MAX(SALARY) FROM EMPLOYEE GROUP BY DEPTNO. (2) Window function: SELECT DISTINCT DEPTNO, MAX(SALARY) OVER (PARTITION BY DEPTNO). (3) Correlated subquery: SELECT * FROM EMPLOYEE E WHERE SALARY = (SELECT MAX(SALARY) FROM EMPLOYEE WHERE DEPTNO = E.DEPTNO). GROUP BY approach is simplest and most efficient.",
        code: "/* Method 1: GROUP BY (simplest) */\nSELECT DEPTNO, MAX(SALARY) AS MAX_SALARY\nFROM EMPLOYEE\nGROUP BY DEPTNO\nORDER BY DEPTNO;\n\n/* Method 2: Window function (if need employee details too) */\nSELECT * FROM (\n    SELECT EMPNO, DEPTNO, SALARY,\n           RANK() OVER(PARTITION BY DEPTNO ORDER BY SALARY DESC) AS RNK\n    FROM EMPLOYEE) T\nWHERE RNK = 1;\n/* This returns ALL employees tied for max salary */",
        tip: "For maximum salary with employee details (name, empno), use the window function approach. For just the max value per department, GROUP BY is simpler and faster.",
        quizOptions: ["Only RANK() can find maximum salary", "MAX() with GROUP BY for simple max value; window function approach for employee details with ties; correlated subquery as alternative", "MAX salary requires DFSORT", "Maximum salary is only computable in COBOL"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_006", category: "SQL", level: "Intermediate",
        question: "What is the SQL CASE expression and how does it implement conditional logic?",
        answer: "CASE provides conditional logic in SQL. Two forms: (1) Simple CASE: CASE expression WHEN value THEN result... ELSE default END. (2) Searched CASE: CASE WHEN condition THEN result... ELSE default END. CASE can be used in SELECT, WHERE, GROUP BY, ORDER BY, and HAVING. Returns NULL if no WHEN matches and no ELSE is specified.",
        code: "/* Searched CASE for salary bands: */\nSELECT EMPNO, SALARY,\n       CASE\n           WHEN SALARY < 30000 THEN 'ENTRY'\n           WHEN SALARY BETWEEN 30000 AND 60000 THEN 'MID'\n           WHEN SALARY > 60000 THEN 'SENIOR'\n           ELSE 'UNKNOWN'\n       END AS SALARY_BAND,\n       CASE BONUS WHEN NULL THEN 0 ELSE BONUS END AS SAFE_BONUS\nFROM EMPLOYEE\nORDER BY SALARY_BAND;",
        tip: "CASE is evaluated left-to-right; first matching WHEN is used. Always include ELSE to handle unexpected values. CASE expressions can replace complex UNION queries.",
        quizOptions: ["CASE is only for WHERE clauses", "CASE expression implements conditional logic in SELECT/WHERE/GROUP BY/ORDER BY; two forms: simple (value matching) and searched (condition)", "CASE requires a separate WHEN for each row", "CASE cannot return NULL values"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_007", category: "SQL", level: "Intermediate",
        question: "What is the difference between SQL UNION, UNION ALL, INTERSECT, and EXCEPT?",
        answer: "UNION combines results of two SELECT statements, removing duplicates (slower). UNION ALL combines without removing duplicates (faster). INTERSECT returns only rows appearing in both result sets. EXCEPT (MINUS in Oracle) returns rows from first query not in second. All require same number of columns with compatible types.",
        code: "/* All active employees from US and Canada: */\nSELECT EMPNO, LASTNAME FROM EMP_US\nUNION ALL\nSELECT EMPNO, LASTNAME FROM EMP_CA\n/* UNION ALL is faster; duplicates allowed */\n\n/* Employees in both departments: */\nSELECT EMPNO FROM EMP_DEPT_A\nINTERSECT\nSELECT EMPNO FROM EMP_DEPT_B\n\n/* Employees in A but NOT in B: */\nSELECT EMPNO FROM EMP_DEPT_A\nEXCEPT\nSELECT EMPNO FROM EMP_DEPT_B",
        tip: "Prefer UNION ALL over UNION unless you explicitly need duplicate removal. The duplicate elimination step in UNION adds significant overhead for large result sets.",
        quizOptions: ["UNION and UNION ALL are identical", "UNION removes duplicates; UNION ALL keeps all; INTERSECT=in both; EXCEPT=in first not second; all need matching column counts/types", "INTERSECT combines all rows", "EXCEPT is not supported in DB2"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_008", category: "SQL", level: "Intermediate",
        question: "What are SQL subqueries and when should you use correlated vs non-correlated subqueries?",
        answer: "Non-correlated subquery executes once independently; its result is used by the outer query. Correlated subquery references outer query columns and executes once per outer row (usually slower). Use non-correlated subquery when: filtering by a set of values. Use correlated subquery when: row-by-row comparison needed. EXISTS is often more efficient than IN for large result sets.",
        code: "/* Non-correlated: executes once */\nSELECT * FROM EMPLOYEE\nWHERE DEPTNO IN (SELECT DEPTNO FROM DEPARTMENT WHERE LOCATION = 'NY');\n\n/* Correlated: executes per row */\nSELECT * FROM EMPLOYEE E\nWHERE SALARY > (SELECT AVG(SALARY) FROM EMPLOYEE\n                WHERE DEPTNO = E.DEPTNO);  /* E.DEPTNO references outer */\n\n/* EXISTS (often better than IN for large sets): */\nSELECT * FROM EMPLOYEE E\nWHERE EXISTS (SELECT 1 FROM PROJECT P WHERE P.EMPNO = E.EMPNO);",
        tip: "Correlated subqueries can be rewritten as JOINs for better performance. EXISTS stops searching after first match (efficient). NOT EXISTS is usually better than NOT IN when NULLs might be present.",
        quizOptions: ["Correlated subqueries execute only once", "Non-correlated subquery executes once; correlated executes per outer row; EXISTS is efficient for large IN checks", "Subqueries are always slower than joins", "EXISTS and IN always produce identical results"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_009", category: "SQL", level: "Expert",
        question: "How do SQL CTEs (Common Table Expressions) improve query readability and performance?",
        answer: "CTEs (WITH clause) define named temporary result sets reusable within a query. Benefits: (1) Improve readability by breaking complex queries into named sections. (2) Can reference themselves for recursive queries (hierarchical data). (3) Can be referenced multiple times without repeating the subquery. In DB2, CTEs are materialized as temporary tables when referenced multiple times.",
        code: "/* CTE for employee hierarchy: */\nWITH EMP_HIERARCHY (EMPNO, LASTNAME, MGRID, LEVEL) AS (\n    /* Anchor: top-level managers */\n    SELECT EMPNO, LASTNAME, MGRNO, 1\n    FROM EMPLOYEE WHERE MGRNO IS NULL\n    UNION ALL\n    /* Recursive: subordinates */\n    SELECT E.EMPNO, E.LASTNAME, E.MGRNO, H.LEVEL + 1\n    FROM EMPLOYEE E\n    JOIN EMP_HIERARCHY H ON E.MGRNO = H.EMPNO\n)\nSELECT * FROM EMP_HIERARCHY ORDER BY LEVEL, LASTNAME;",
        tip: "Recursive CTEs are the SQL standard way to traverse hierarchical data (org charts, bill-of-materials). They replace complex stored procedures for tree traversal.",
        quizOptions: ["CTEs always improve performance", "CTEs (WITH clause) define named reusable result sets; recursive CTEs traverse hierarchical data; DB2 materializes multiply-referenced CTEs", "CTEs cannot be recursive", "CTEs are only for SELECT statements"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_010", category: "SQL", level: "Expert",
        question: "What are SQL window frame specifications (ROWS BETWEEN, RANGE BETWEEN)?",
        answer: "Window frame specifies which rows are included in the window for each current row. ROWS BETWEEN: based on physical row positions. RANGE BETWEEN: based on logical value ranges (includes ties). Bounds: UNBOUNDED PRECEDING (start of partition), CURRENT ROW, UNBOUNDED FOLLOWING (end), n PRECEDING, n FOLLOWING. Used for running totals, moving averages.",
        code: "/* Running total salary: */\nSELECT EMPNO, SALARY, DEPTNO,\n       SUM(SALARY) OVER (\n           PARTITION BY DEPTNO\n           ORDER BY EMPNO\n           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS RUNNING_TOTAL,\n       AVG(SALARY) OVER (\n           ORDER BY HIREDATE\n           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n       ) AS MOVING_3_AVG\nFROM EMPLOYEE;",
        tip: "ROWS BETWEEN is usually preferred over RANGE BETWEEN for running totals to avoid including unexpected ties. Moving averages use ROWS BETWEEN n PRECEDING AND CURRENT ROW.",
        quizOptions: ["Window frames are only for ORDER BY", "Window frame (ROWS/RANGE BETWEEN bounds) specifies which rows are included in the window calculation for each row; enables running totals and moving averages", "RANGE and ROWS frames are always identical", "Window frames require GROUP BY"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_011", category: "SQL", level: "Expert",
        question: "What is SQL PIVOT and how do you transform rows to columns?",
        answer: "SQL PIVOT transforms row values into columns (crosstab). DB2 doesn't have a native PIVOT keyword but achieves it with CASE expressions and GROUP BY. For each desired column, write a CASE expression that selects the value for that specific condition. The GROUP BY collapses rows. DB2 11+ supports XMLAGG-based dynamic pivoting.",
        code: "/* Pivot quarterly sales into columns: */\nSELECT YEAR,\n       SUM(CASE WHEN QUARTER = 'Q1' THEN SALES ELSE 0 END) AS Q1,\n       SUM(CASE WHEN QUARTER = 'Q2' THEN SALES ELSE 0 END) AS Q2,\n       SUM(CASE WHEN QUARTER = 'Q3' THEN SALES ELSE 0 END) AS Q3,\n       SUM(CASE WHEN QUARTER = 'Q4' THEN SALES ELSE 0 END) AS Q4,\n       SUM(SALES) AS ANNUAL_TOTAL\nFROM QUARTERLY_SALES\nGROUP BY YEAR\nORDER BY YEAR;",
        tip: "PIVOT using CASE+SUM is the standard DB2 approach. When the columns are dynamic (unknown at query write time), build SQL dynamically with stored procedures.",
        quizOptions: ["DB2 has a native PIVOT keyword", "DB2 uses CASE expressions with SUM and GROUP BY to pivot rows to columns (crosstab transformation)", "PIVOT requires OLAP features", "Row-to-column transformation is not possible in SQL"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_012", category: "SQL", level: "Expert",
        question: "How do you find Nth highest salary using SQL?",
        answer: "Multiple methods: (1) Subquery with DISTINCT: SELECT MIN(SALARY) FROM (SELECT DISTINCT SALARY FROM EMPLOYEE ORDER BY SALARY DESC FETCH FIRST N ROWS ONLY). (2) Dense rank: SELECT SALARY FROM (SELECT SALARY, DENSE_RANK() OVER (ORDER BY SALARY DESC) AS RNK FROM EMPLOYEE) WHERE RNK = N. (3) Correlated subquery with COUNT DISTINCT.",
        code: "/* N=3: Third highest salary using DENSE_RANK: */\nSELECT DISTINCT SALARY\nFROM (\n    SELECT SALARY,\n           DENSE_RANK() OVER (ORDER BY SALARY DESC) AS RNK\n    FROM EMPLOYEE\n) WHERE RNK = 3;\n\n/* Alternative using FETCH FIRST: */\nSELECT MIN(SALARY) FROM (\n    SELECT DISTINCT SALARY FROM EMPLOYEE\n    ORDER BY SALARY DESC\n    FETCH FIRST 3 ROWS ONLY\n) T;\n/* MIN of top 3 unique salaries = 3rd highest */",
        tip: "DENSE_RANK() approach handles ties correctly (two employees with same salary both get same rank). FETCH FIRST N approach is simpler but requires a subquery.",
        quizOptions: ["Nth highest requires a COBOL program", "Use DENSE_RANK() OVER(ORDER BY SALARY DESC) in subquery and filter WHERE RNK = N; or FETCH FIRST N with MIN", "Nth highest is only possible with DFSORT", "SQL cannot compute Nth highest values"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_013", category: "SQL", level: "Intermediate",
        question: "What is the SQL FETCH FIRST n ROWS ONLY clause?",
        answer: "FETCH FIRST n ROWS ONLY (DB2 syntax; equivalent to LIMIT n in MySQL, TOP n in SQL Server) limits query results to the first n rows. Combined with ORDER BY, it retrieves top-N records efficiently. DB2 also supports OFFSET m ROWS for pagination. This syntax is SQL standard and supported natively by DB2.",
        code: "/* Top 10 highest-paid employees: */\nSELECT EMPNO, LASTNAME, SALARY\nFROM EMPLOYEE\nORDER BY SALARY DESC\nFETCH FIRST 10 ROWS ONLY;\n\n/* Pagination: rows 11-20 */\nSELECT EMPNO, LASTNAME, SALARY\nFROM EMPLOYEE\nORDER BY SALARY DESC\nOFFSET 10 ROWS\nFETCH FIRST 10 ROWS ONLY;",
        tip: "Always use FETCH FIRST with ORDER BY, otherwise results are non-deterministic. For DFSORT equivalent, use STOPAFT=n. Both give the same result for sequential processing.",
        quizOptions: ["FETCH FIRST requires a special cursor", "FETCH FIRST n ROWS ONLY limits query results to n rows; with ORDER BY retrieves top-N; OFFSET enables pagination", "FETCH FIRST is only for stored procedures", "FETCH FIRST cannot be used with ORDER BY"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_014", category: "SQL", level: "Expert",
        question: "What are SQL lateral joins and table-valued functions?",
        answer: "LATERAL join (DB2 11+) allows a subquery to reference columns from preceding table references in the FROM clause. This enables correlated subqueries in FROM. TABLE() constructor with table-valued functions works similarly. Useful for: calling functions with parameters from another table, row-level computation, limiting rows per group.",
        code: "/* LATERAL join to get top 2 per department: */\nSELECT D.DEPTNO, D.DEPTNAME, T.EMPNO, T.SALARY\nFROM DEPARTMENT D,\n     LATERAL (SELECT EMPNO, SALARY FROM EMPLOYEE E\n               WHERE E.WORKDEPT = D.DEPTNO\n               ORDER BY SALARY DESC\n               FETCH FIRST 2 ROWS ONLY) AS T;\n/* Returns top 2 employees per department */",
        tip: "LATERAL joins are the modern replacement for complex correlated subqueries in FROM clauses. They're particularly powerful for top-N per group problems.",
        quizOptions: ["LATERAL joins are identical to regular joins", "LATERAL joins allow subqueries in FROM to reference outer table columns; enables row-level computation and top-N per group", "LATERAL is only for OUTER JOINs", "LATERAL requires DB2 12+"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_015", category: "SQL", level: "Intermediate",
        question: "How do SQL MERGE statements work (upsert)?",
        answer: "MERGE (INSERT-or-UPDATE) statement performs conditional insert, update, or delete in a single atomic operation. When target row matches source: UPDATE or DELETE. When no match: INSERT. More efficient than separate SELECT + INSERT/UPDATE. Reduces round trips in applications. DB2 supports MERGE with MATCHED/NOT MATCHED conditions.",
        code: "/* MERGE = upsert (update or insert): */\nMERGE INTO EMPLOYEE_TARGET T\nUSING EMPLOYEE_SOURCE S\n    ON T.EMPNO = S.EMPNO\nWHEN MATCHED AND S.ACTION = 'U' THEN\n    UPDATE SET T.SALARY = S.SALARY, T.DEPTNO = S.DEPTNO\nWHEN MATCHED AND S.ACTION = 'D' THEN\n    DELETE\nWHEN NOT MATCHED AND S.ACTION != 'D' THEN\n    INSERT (EMPNO, LASTNAME, SALARY)\n    VALUES (S.EMPNO, S.LASTNAME, S.SALARY);",
        tip: "MERGE is ideal for data warehouse loading patterns where you need to sync a staging table to a target. One MERGE statement replaces three separate DML statements.",
        quizOptions: ["MERGE only works for INSERT operations", "MERGE performs conditional INSERT/UPDATE/DELETE in one atomic statement; WHEN MATCHED/NOT MATCHED conditions control which action", "MERGE requires two separate DB2 connections", "MERGE is not supported in DB2"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_016", category: "SQL", level: "Expert",
        question: "What is SQL GROUPING SETS, ROLLUP, and CUBE?",
        answer: "GROUPING SETS, ROLLUP, and CUBE extend GROUP BY for multi-dimensional aggregation. ROLLUP produces subtotals for a hierarchy: ROLLUP(A,B,C) = (A,B,C) + (A,B) + (A) + (). CUBE produces all possible combinations: CUBE(A,B) = (A,B) + (A) + (B) + (). GROUPING SETS lists specific combinations. GROUPING() function identifies which columns are subtotaled (returns 1 when NULL due to rollup).",
        code: "/* ROLLUP for hierarchical subtotals: */\nSELECT REGION, DEPARTMENT, SUM(SALES) AS TOTAL,\n       GROUPING(REGION) AS IS_REGION_SUBTOTAL\nFROM SALES_DATA\nGROUP BY ROLLUP(REGION, DEPARTMENT)\nORDER BY REGION, DEPARTMENT;\n/* Results: detail rows + dept subtotals + region subtotals + grand total */\n\n/* CUBE for all combinations: */\nSELECT YEAR, QUARTER, PRODUCT, SUM(SALES)\nFROM SALES\nGROUP BY CUBE(YEAR, QUARTER, PRODUCT);",
        tip: "Use ROLLUP for hierarchical reports (year > quarter > month > day). Use CUBE for data cubes where all dimension combinations are needed. GROUPING() identifies subtotal rows for formatting.",
        quizOptions: ["ROLLUP and CUBE are identical", "ROLLUP creates hierarchical subtotals; CUBE creates all dimension combinations; GROUPING SETS specifies exact combinations; GROUPING() identifies subtotal rows", "ROLLUP replaces GROUP BY", "CUBE is only for OLAP databases"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_017", category: "SQL", level: "Expert",
        question: "How do you implement slowly changing dimensions (SCD) in SQL?",
        answer: "SCD Type 2 tracks history with effective dates. MERGE statement checks if key exists: if yes and data changed, expire old record (set END_DATE to today) and insert new record. If key doesn't exist, insert new record. Query uses: WHERE CURRENT_DATE BETWEEN START_DATE AND END_DATE (or END_DATE = '9999-12-31' for current records).",
        code: "/* SCD Type 2 using MERGE: */\nMERGE INTO EMPLOYEE_DIM TGT\nUSING EMPLOYEE_SRC SRC ON TGT.EMPNO = SRC.EMPNO\n    AND TGT.CURRENT_IND = 'Y'\nWHEN MATCHED AND (TGT.SALARY != SRC.SALARY\n               OR TGT.DEPTNO != SRC.DEPTNO) THEN\n    UPDATE SET TGT.CURRENT_IND = 'N',\n               TGT.END_DATE = CURRENT DATE\nWHEN NOT MATCHED THEN\n    INSERT (EMPNO, SALARY, DEPTNO, START_DATE, END_DATE, CURRENT_IND)\n    VALUES (SRC.EMPNO, SRC.SALARY, SRC.DEPTNO,\n            CURRENT DATE, '9999-12-31', 'Y');\n/* Then insert new current version for updated rows */",
        tip: "SCD Type 2 requires careful handling of the insert-after-update step. Consider using a staging table approach: expire old, insert new in separate transactions to avoid constraint violations.",
        quizOptions: ["SCD requires special database software", "SCD Type 2 tracks history with effective dates; MERGE expires old records and inserts new versions when attributes change", "SCD is only for VSAM files", "SCD automatically handles all dimension changes"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_018", category: "SQL", level: "Expert",
        question: "How do you write SQL to find employees without managers (gaps in hierarchy)?",
        answer: "Find employees whose MGRNO doesn't exist in EMPNO column (orphaned references). Use NOT EXISTS or LEFT JOIN IS NULL or EXCEPT to identify records. Recursive CTE can traverse the tree to find all orphaned branches.",
        code: "/* Method 1: NOT EXISTS (efficient) */\nSELECT E.EMPNO, E.LASTNAME, E.MGRNO\nFROM EMPLOYEE E\nWHERE E.MGRNO IS NOT NULL\n  AND NOT EXISTS (\n      SELECT 1 FROM EMPLOYEE MGR\n      WHERE MGR.EMPNO = E.MGRNO\n  );\n\n/* Method 2: LEFT JOIN NULL check */\nSELECT E.EMPNO, E.LASTNAME, E.MGRNO\nFROM EMPLOYEE E\nLEFT JOIN EMPLOYEE MGR ON E.MGRNO = MGR.EMPNO\nWHERE E.MGRNO IS NOT NULL\n  AND MGR.EMPNO IS NULL;",
        tip: "LEFT JOIN IS NULL pattern is equivalent to NOT EXISTS for referential integrity checks. NOT EXISTS often performs better with proper indexes on the referenced column.",
        quizOptions: ["Hierarchy gaps cannot be detected with SQL", "Use NOT EXISTS or LEFT JOIN IS NULL to find employees with MGRNO that doesn't reference a valid EMPNO", "Only recursive CTEs can find hierarchy gaps", "Hierarchy analysis requires COBOL programs"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_019", category: "SQL", level: "Intermediate",
        question: "What is SQL indexing strategy and what is a covering index?",
        answer: "A covering index includes all columns needed by a query in the index itself (both key and non-key columns as includes). DB2 INDEXONLY=Y in EXPLAIN shows the optimizer can answer from index without accessing the table. Create: CREATE INDEX ... ON TABLE (key_cols) INCLUDE (non_key_cols). Covering indexes eliminate table I/O entirely for covered queries.",
        code: "/* Covering index example: */\nCREATE INDEX EMP_COVER_X\n    ON EMPLOYEE (DEPTNO ASC)\n    INCLUDE (EMPNO, LASTNAME, SALARY);\n/* Query: SELECT EMPNO, LASTNAME, SALARY FROM EMPLOYEE WHERE DEPTNO = 'A00' */\n/* DB2 can answer entirely from the index - INDEXONLY=Y */\n\n/* Check via EXPLAIN: */\nSELECT ACCESSTYPE, MATCHCOLS, INDEXONLY\nFROM SYSIBM.PLAN_TABLE\nWHERE QUERYNO = 1;",
        tip: "Covering indexes dramatically improve read performance for frequently-executed queries. The tradeoff is additional storage and maintenance overhead on DML operations.",
        quizOptions: ["Covering indexes are only for primary keys", "A covering index includes all query columns (key + INCLUDE) enabling INDEXONLY=Y access without table lookup", "INCLUDE columns are the same as key columns", "Covering indexes reduce write performance with no read benefit"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_020", category: "SQL", level: "Expert",
        question: "What are SQL OLAP functions (LAG, LEAD, FIRST_VALUE, LAST_VALUE)?",
        answer: "OLAP window functions access values from other rows without self-joins. LAG(col, n) returns column value from n rows before the current row. LEAD(col, n) returns value from n rows after. FIRST_VALUE(col) returns the first value in the window partition. LAST_VALUE(col) returns the last. Combined with OVER (PARTITION BY ORDER BY), they enable complex time-series and sequential analysis.",
        code: "/* Month-over-month salary change using LAG: */\nSELECT EMPNO, PERIOD, SALARY,\n       LAG(SALARY, 1) OVER (\n           PARTITION BY EMPNO\n           ORDER BY PERIOD\n       ) AS PREV_SALARY,\n       SALARY - LAG(SALARY, 1) OVER (\n           PARTITION BY EMPNO ORDER BY PERIOD\n       ) AS MOM_CHANGE,\n       FIRST_VALUE(SALARY) OVER (\n           PARTITION BY EMPNO ORDER BY PERIOD\n       ) AS FIRST_SALARY\nFROM EMP_HISTORY;",
        tip: "LAG/LEAD eliminate self-joins for sequential analysis. Define the window ORDER BY carefully to get meaningful previous/next values.",
        quizOptions: ["LAG and LEAD are not SQL standard", "LAG/LEAD access rows before/after current row; FIRST/LAST_VALUE get partition boundaries; all use OVER(PARTITION BY ORDER BY)", "These functions require GROUP BY", "LAG returns the previous table in the database"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_021", category: "SQL", level: "Expert",
        question: "How do you calculate running totals and cumulative percentages in SQL?",
        answer: "Running total uses SUM() OVER with ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. Cumulative percentage divides running total by total. RATIO_TO_REPORT(col) OVER (PARTITION BY group) computes ratio within group. Combined with cumulative sum, gives Pareto analysis (80/20 rule identification).",
        code: "/* Running total and cumulative percentage: */\nSELECT DEPTNO, SALARY,\n       SUM(SALARY) OVER (\n           ORDER BY SALARY DESC\n           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS RUNNING_TOTAL,\n       DECIMAL(100 * SUM(SALARY) OVER (\n           ORDER BY SALARY DESC\n           ROWS UNBOUNDED PRECEDING\n       ) / SUM(SALARY) OVER (), 5, 2) AS CUM_PCT\nFROM EMPLOYEE\nORDER BY SALARY DESC;",
        tip: "Cumulative percentages are useful for Pareto analysis (e.g., top 20% of salaries consuming 80% of payroll). Combined with CASE, you can label the Pareto segments.",
        quizOptions: ["Running totals require multiple queries", "SUM() OVER (ROWS UNBOUNDED PRECEDING) computes running totals; divide by total for cumulative percentage; single-pass calculation", "Running totals require temporary tables", "Cumulative percentages need special DB2 features"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_022", category: "SQL", level: "Intermediate",
        question: "What are SQL string functions and how are they used in mainframe DB2?",
        answer: "DB2 string functions: SUBSTR(str, start, len) or SUBSTRING(str FROM start FOR len) extracts substrings. CONCAT or || concatenates strings. TRIM/LTRIM/RTRIM removes spaces. UPPER/LOWER converts case. LENGTH returns character count. LOCATE(search, str, start) finds position. REPLACE(str, find, replace) replaces occurrences. CHAR(num) converts numeric to character.",
        code: "/* String function examples: */\nSELECT\n    SUBSTR(LASTNAME, 1, 10) AS SHORT_NAME,\n    TRIM(FIRSTNME) || ' ' || TRIM(LASTNAME) AS FULL_NAME,\n    UPPER(EMAIL) AS UPPER_EMAIL,\n    LENGTH(PHONE) AS PHONE_LEN,\n    LOCATE('@', EMAIL) AS AT_POSITION,\n    SUBSTR(EMAIL, 1, LOCATE('@', EMAIL) - 1) AS EMAIL_USER\nFROM EMPLOYEE;",
        tip: "String manipulation in SQL is often more efficient than doing it in COBOL after fetching data. Push string transformation into the SQL query to reduce data volume returned.",
        quizOptions: ["DB2 has no string manipulation functions", "DB2 string functions: SUBSTR, CONCAT/||, TRIM, UPPER/LOWER, LENGTH, LOCATE, REPLACE for text processing in SQL queries", "String functions can only be in WHERE clauses", "DB2 string functions return only fixed-length results"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_023", category: "SQL", level: "Expert",
        question: "How do you implement a SQL-based audit trail for data changes?",
        answer: "Approaches: (1) DB2 triggers: AFTER INSERT/UPDATE/DELETE writes to audit table. (2) DB2 temporal tables: automatic history maintained by DB2. (3) Application-level: application writes audit records explicitly. (4) DB2 Audit Manager: security auditing without application code. Audit table typically captures: old values, new values, change timestamp, user ID, transaction ID.",
        code: "/* Trigger-based audit: */\nCREATE TRIGGER EMPLOYEE_AUDIT_TRG\n    AFTER UPDATE ON EMPLOYEE\n    REFERENCING OLD AS O NEW AS N\n    FOR EACH ROW MODE DB2SQL\n    BEGIN ATOMIC\n        INSERT INTO EMPLOYEE_AUDIT\n        (EMPNO, FIELD_NAME, OLD_VAL, NEW_VAL, CHG_TS, CHG_USER)\n        SELECT 'SALARY', CHAR(O.SALARY), CHAR(N.SALARY),\n               CURRENT TIMESTAMP, USER\n        FROM SYSIBM.SYSDUMMY1\n        WHERE O.SALARY != N.SALARY;\n    END",
        tip: "For compliance-critical audit trails, use DB2 temporal tables (automatic, tamper-proof history). For selective auditing, triggers give more control over what's captured.",
        quizOptions: ["Audit trails require special IBM software", "SQL audit trails via DB2 triggers, temporal tables, application-level writes, or DB2 Audit Manager capture changes with timestamp and user", "Audit trails are only for VSAM files", "DB2 automatically maintains audit trails without configuration"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_024", category: "SQL", level: "Expert",
        question: "What is SQL normalization and what are the normal forms?",
        answer: "Normalization reduces data redundancy and improves integrity. Normal forms: 1NF (First): atomic values, no repeating groups. 2NF (Second): 1NF + no partial dependencies (all non-key columns depend on entire primary key). 3NF (Third): 2NF + no transitive dependencies (non-key columns depend only on primary key, not other non-key columns). BCNF: stricter 3NF variant. Denormalization trades redundancy for query performance.",
        code: "/* 1NF violation: */\n/* EMPLOYEE(EMPNO, SKILLS) where SKILLS='COBOL,JCL,DB2' - NOT atomic */\n\n/* Normalized 1NF: */\n/* EMPLOYEE(EMPNO, ...) */\n/* EMPLOYEE_SKILL(EMPNO, SKILL) */\n\n/* 2NF violation: */\n/* ORDER_ITEM(ORDERID, PRODID, QTY, PROD_NAME) - PROD_NAME depends only on PRODID */\n\n/* Normalized 2NF: */\n/* ORDER_ITEM(ORDERID, PRODID, QTY) */\n/* PRODUCT(PRODID, PROD_NAME) */",
        tip: "3NF is typically the target for OLTP databases. DSS/analytical databases are often deliberately denormalized (star/snowflake schemas) for query performance.",
        quizOptions: ["Normalization makes databases slower", "1NF=atomic values; 2NF=no partial dependencies; 3NF=no transitive dependencies; normalization reduces redundancy and improves integrity", "Denormalization is always superior to normalization", "Normal forms only apply to relational databases"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_025", category: "SQL", level: "Expert",
        question: "How do you detect and handle SQL injection vulnerabilities in DB2 programs?",
        answer: "SQL injection inserts malicious SQL through user input. Prevention: (1) Use parameterized queries (host variables in COBOL) - never concatenate user input into SQL strings. (2) Use PREPARE with parameter markers for dynamic SQL. (3) Validate and sanitize all input. (4) Use RACF to restrict DB2 authorities. (5) Never run SQL as a privileged user in applications.",
        code: "/* VULNERABLE - concatenating user input: */\nMOVE 'SELECT * FROM EMP WHERE ID = ' TO WS-SQL\nSTRING WS-SQL DELIMITED SPACE\n       WS-USER-INPUT INTO WS-FULL-SQL  /* DANGEROUS! */\n\n/* SAFE - parameterized query with host variable: */\nEXEC SQL\n    SELECT * FROM EMPLOYEE\n    WHERE EMPNO = :WS-EMPNO  /* Host variable - safe */\nEND-EXEC\n\n/* Safe dynamic SQL with parameter markers: */\nMOVE 'SELECT * FROM EMPLOYEE WHERE EMPNO = ?' TO WS-SQL\nEXEC SQL PREPARE STMT FROM :WS-SQL END-EXEC\nEXEC SQL OPEN CUR USING :WS-EMPNO END-EXEC",
        tip: "In COBOL/DB2, SQL injection is less common than in web applications but still possible with dynamic SQL. Use parameter markers (?) instead of string concatenation for dynamic queries.",
        quizOptions: ["SQL injection only affects web applications", "Prevent SQL injection with parameterized queries (host variables or parameter markers) never concatenating user input into SQL strings", "DB2 automatically prevents SQL injection", "SQL injection is harmless in batch programs"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_026", category: "SQL", level: "Intermediate",
        question: "What is the SQL DISTINCT keyword and how does it differ from GROUP BY for deduplication?",
        answer: "DISTINCT removes duplicate rows from the result set based on all selected columns. GROUP BY groups rows for aggregation and implicitly deduplicates the group keys. For simple deduplication without aggregation, DISTINCT is clearer. For getting unique keys with aggregated data, GROUP BY is necessary. Performance: DISTINCT and GROUP BY often use similar sort/hash operations.",
        code: "/* DISTINCT - unique employees working on projects: */\nSELECT DISTINCT EMPNO FROM EMPLOYEE_PROJECT;\n\n/* GROUP BY - with aggregation (DISTINCT not sufficient): */\nSELECT EMPNO, COUNT(*) AS PROJECT_COUNT\nFROM EMPLOYEE_PROJECT\nGROUP BY EMPNO;\n\n/* Both remove duplicates from EMPNO: */\nSELECT DISTINCT EMPNO FROM EMPLOYEE_PROJECT;\n/* Equivalent to: */\nSELECT EMPNO FROM EMPLOYEE_PROJECT GROUP BY EMPNO;",
        tip: "Prefer DISTINCT for simple deduplication. It's more readable and the optimizer may choose different, more efficient strategies. Avoid DISTINCT on all columns unnecessarily.",
        quizOptions: ["DISTINCT and GROUP BY are identical in all cases", "DISTINCT removes duplicate rows across all selected columns; GROUP BY is for aggregation and implicitly deduplicates group keys", "DISTINCT is slower than GROUP BY always", "DISTINCT cannot be used with ORDER BY"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_027", category: "SQL", level: "Expert",
        question: "What is SQL EXPLAIN PLAN analysis and how do you identify performance bottlenecks?",
        answer: "EXPLAIN PLAN stores access paths in PLAN_TABLE. Key indicators of problems: ACCESSTYPE='R' (table scan) instead of 'I' (index) on large tables, MATCHCOLS=0 (index not matched), PREFETCH=' ' (no prefetch), high SORTN_JOIN or SORTC_JOIN (unnecessary sorts), ROWS_FETCHED much higher than rows needed. Solutions: add indexes, RUNSTATS, REORG, REBIND, query rewriting.",
        code: "/* Analyze PLAN_TABLE: */\nSELECT QUERYNO, QBLOCKNO, PLANNO,\n       TNAME,\n       ACCESSTYPE,    /* I=index, R=tablespace scan */\n       MATCHCOLS,     /* # index cols matched */\n       INDEXONLY,     /* Y=no table I/O needed */\n       PREFETCH,      /* S=sequential, L=list, ' '=none */\n       SORTN_JOIN,    /* Sort for join? */\n       JOIN_TYPE,     /* H=hash join, N=nested loop, M=merge */\n       ROWS_FETCHED   /* Estimated rows */\nFROM SYSIBM.PLAN_TABLE\nWHERE QUERYNO = 1\nORDER BY QBLOCKNO, PLANNO;",
        tip: "Run EXPLAIN before and after every significant optimization attempt. Document the PLAN_TABLE contents to track performance improvements across REBIND iterations.",
        quizOptions: ["EXPLAIN PLAN is only for error detection", "PLAN_TABLE shows access path details: ACCESSTYPE (I=index, R=scan), MATCHCOLS, INDEXONLY, PREFETCH indicating performance characteristics", "Only IBM support can read PLAN_TABLE", "EXPLAIN PLAN automatically fixes performance issues"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_028", category: "SQL", level: "Expert",
        question: "How do you use SQL to generate sequential row numbers for report pagination?",
        answer: "ROW_NUMBER() OVER (ORDER BY col) assigns unique sequential numbers to rows. Combined with FETCH FIRST and OFFSET, implements efficient pagination. For ordered reports: generate row numbers in the query itself. For DFSORT alternative: use STOPAFT=n and SKIPREC=m JCL parameters.",
        code: "/* Paginated employee report, page 3 (rows 21-30): */\nSELECT ROWNUM, EMPNO, LASTNAME, SALARY\nFROM (\n    SELECT ROW_NUMBER() OVER (ORDER BY LASTNAME) AS ROWNUM,\n           EMPNO, LASTNAME, SALARY\n    FROM EMPLOYEE\n) T\nWHERE ROWNUM BETWEEN 21 AND 30;\n\n/* Or using OFFSET/FETCH: */\nSELECT EMPNO, LASTNAME, SALARY\nFROM EMPLOYEE\nORDER BY LASTNAME\nOFFSET 20 ROWS FETCH FIRST 10 ROWS ONLY;",
        tip: "OFFSET/FETCH FIRST is simpler but can be slow for large offsets (must skip n rows). For deep pagination, use keyset/cursor-based pagination with indexed WHERE predicates instead.",
        quizOptions: ["Pagination requires multiple queries", "ROW_NUMBER() OVER (ORDER BY) generates sequential row numbers; combined with OFFSET/FETCH FIRST enables efficient pagination", "SQL cannot implement pagination", "Pagination requires CICS programs"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_029", category: "SQL", level: "Expert",
        question: "What are DB2 user-defined functions (UDFs) and when are they used?",
        answer: "DB2 UDFs are custom functions used in SQL like built-in functions. Types: (1) Scalar UDF: returns one value per row. (2) Table UDF: returns a table (used in FROM clause). (3) Aggregate UDF: groups rows into one value. Written in SQL PL, C, COBOL, or Java. Useful for: complex business calculations reused in multiple queries, encapsulating format conversions.",
        code: "/* SQL PL scalar UDF: */\nCREATE FUNCTION CALC_TAX\n    (P_SALARY DECIMAL(9,2), P_RATE DECIMAL(5,2))\n    RETURNS DECIMAL(9,2)\n    LANGUAGE SQL\n    RETURN P_SALARY * P_RATE / 100;\n\n/* Use in query: */\nSELECT EMPNO, SALARY,\n       CALC_TAX(SALARY, 30.00) AS ESTIMATED_TAX\nFROM EMPLOYEE;\n\n/* Table function: */\nCREATE FUNCTION GET_EMP_BY_DEPT (P_DEPT CHAR(3))\n    RETURNS TABLE (EMPNO CHAR(6), SALARY DECIMAL(9,2))\n    ...",
        tip: "Scalar UDFs are excellent for standardizing business calculations used in multiple queries. Table functions can replace complex correlated subqueries or stored procedures.",
        quizOptions: ["UDFs are only for string operations", "DB2 UDFs (scalar, table, aggregate) create custom functions reusable in SQL; written in SQL PL, COBOL, C, or Java", "UDFs cannot access DB2 tables", "UDFs are automatically created from COBOL programs"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_030", category: "SQL", level: "Expert",
        question: "How do you implement a DB2 connection pool and manage thread reuse in CICS?",
        answer: "CICS uses DB2 thread pooling managed by the CICS-DB2 attach facility. Key parameters: THREADLIM (max threads per CICS region), THRDS (threads per transaction class), TXCLASS (transaction classification). Thread reuse: existing threads remain connected to DB2 between transactions (KEEP YES). Thread pool exhaustion causes SQLCODE -805 or -904. Monitor with CICS statistics and DB2 thread reports.",
        code: "/* CICS DB2 startup commands: */\n/* DSNC STRT NUMTCB(25) TXISOLATION(CS) */\n\n/* CICS CEDA definition for DB2 entry: */\n/* DEFINE DB2ENTRY(PRODDB2) */\n/*   THREADLIMIT(50) THREADS(25) */\n/*   TXCLASS(0) PRIORITY(1) */\n\n/* Monitor threads: */\n/* CEMT INQUIRE DB2CONN */\n/* DSNC DISPLAY STATISTICS */",
        tip: "Size the CICS DB2 thread pool based on peak concurrent transactions, not average. Too few threads causes queueing delays; too many wastes DB2 memory for unused threads.",
        quizOptions: ["CICS programs each create their own DB2 connection", "CICS DB2 attach manages thread pooling; THREADLIM controls max threads; KEEP YES reuses threads across transactions", "DB2 connections are automatically unlimited in CICS", "Thread pooling requires special DB2 license"],
        quizAnswerIndex: 1
    },

    // More SQL questions
    {
        id: "sql_b4_031", category: "SQL", level: "Beginner",
        question: "What is the difference between DELETE, TRUNCATE, and DROP in SQL?",
        answer: "DELETE removes specific rows matching WHERE clause (or all rows without WHERE), is logged, supports ROLLBACK, and fires triggers. TRUNCATE removes all rows quickly with minimal logging, typically cannot be rolled back, and doesn't fire row-level triggers (DDL-like operation). DROP removes the entire table structure and all its data permanently.",
        code: "DELETE FROM TEMP_TABLE WHERE STATUS = 'OLD';  /* Specific rows */\nDELETE FROM TEMP_TABLE;  /* All rows, fully logged */\n\n/* DB2 doesn't have TRUNCATE, use: */\nALTER TABLE TEMP_TABLE ACTIVATE NOT LOGGED INITIALLY;\nDELETE FROM TEMP_TABLE;  /* Not logged - fast */\n\nDROP TABLE OLD_TEMP_TABLE;  /* Removes table entirely */",
        tip: "In DB2, use ALTER TABLE...ACTIVATE NOT LOGGED INITIALLY followed by DELETE to achieve TRUNCATE-like performance. This resets the table statistics too.",
        quizOptions: ["DELETE, TRUNCATE, and DROP are identical", "DELETE=specific rows logged; TRUNCATE=all rows minimal logging; DROP=removes entire table structure; all permanently affect data", "TRUNCATE supports ROLLBACK always", "DROP only removes the table definition"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_032", category: "SQL", level: "Intermediate",
        question: "How do you use SQL EXISTS vs IN for checking membership?",
        answer: "EXISTS stops searching after finding first match (short-circuit evaluation). IN collects all values then checks membership. EXISTS handles NULLs safely (NULL doesn't cause unexpected results). NOT IN fails if subquery returns any NULL. IN with small static lists is fine; for large subquery results, EXISTS or JOIN is typically more efficient.",
        code: "/* IN with static list: */\nSELECT * FROM EMPLOYEE WHERE DEPTNO IN ('A00','B01','C01');\n\n/* EXISTS for correlated check (usually faster): */\nSELECT * FROM EMPLOYEE E\nWHERE EXISTS (SELECT 1 FROM PROJECT P WHERE P.EMPNO = E.EMPNO);\n\n/* NOT IN DANGER with NULLs: */\nSELECT * FROM EMP WHERE DEPTNO NOT IN\n    (SELECT DEPTNO FROM DEPT WHERE DEPTNO IS NOT NULL);  /* MUST add IS NOT NULL */\n\n/* NOT EXISTS safer with NULLs: */\nSELECT * FROM EMP E WHERE NOT EXISTS\n    (SELECT 1 FROM DEPT D WHERE D.DEPTNO = E.DEPTNO);",
        tip: "Prefer NOT EXISTS over NOT IN when subquery column may contain NULLs. NOT IN with a NULL in the subquery returns no rows at all - a subtle, dangerous bug.",
        quizOptions: ["IN and EXISTS are always identical in performance", "EXISTS short-circuits on first match; IN collects all values; NOT IN fails with NULL subquery values; NOT EXISTS is NULL-safe", "IN always outperforms EXISTS", "EXISTS cannot be used in WHERE clauses"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_033", category: "SQL", level: "Expert",
        question: "What are DB2 materialized query tables (MQTs) and how do they improve performance?",
        answer: "MQTs (called Materialized Views in other DBs) store precomputed query results as physical tables. DB2 automatically uses MQTs (query routing) when optimizer detects a query matches an MQT definition - no application changes needed. MQTs are refreshed manually (REFRESH TABLE) or automatically. Excellent for: aggregation-heavy queries, frequently-run complex joins.",
        code: "/* Create MQT: */\nCREATE TABLE DEPT_SALARY_SUMMARY\n    AS (SELECT DEPTNO, COUNT(*) AS EMP_COUNT,\n               SUM(SALARY) AS TOTAL_SALARY\n        FROM EMPLOYEE GROUP BY DEPTNO)\n    DATA INITIALLY DEFERRED\n    REFRESH DEFERRED\n    ENABLE QUERY OPTIMIZATION;\n\n/* Refresh MQT: */\nREFRESH TABLE DEPT_SALARY_SUMMARY;\n\n/* Now queries grouping by DEPTNO may use MQT automatically */\nSELECT DEPTNO, AVG(SALARY) FROM EMPLOYEE GROUP BY DEPTNO;\n/* Optimizer may route to DEPT_SALARY_SUMMARY instead */",
        tip: "MQTs are a transparent performance optimization. Monitor which queries are being routed to MQTs via EXPLAIN. Refresh MQTs as part of ETL/data refresh processes.",
        quizOptions: ["MQTs are identical to regular tables", "MQTs store precomputed query results; DB2 automatically routes matching queries to them without application changes; refreshed periodically", "MQTs require special DB2 version", "Queries must explicitly reference MQTs to use them"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_034", category: "SQL", level: "Expert",
        question: "How do you write a recursive SQL query to traverse a bill-of-materials structure?",
        answer: "Recursive CTE with UNION ALL traverses hierarchical structures. Anchor member selects root nodes. Recursive member joins to find children. Use LEVEL or LEVEL+1 to track depth. For bill-of-materials: quantity multiplied through levels gives total component quantity. Cycle detection prevents infinite loops (DB2 SEARCH BY BREADTH FIRST SET CYCLE).",
        code: "/* Bill-of-materials explosion: */\nWITH BOM (PARTNO, COMPNO, TOTAL_QTY, LEVEL) AS (\n    /* Anchor: top-level parts */\n    SELECT PARTNO, COMPNO, QTY, 1\n    FROM PARTS_ASSEMBLY\n    WHERE PARTNO = 'PRODUCT001'\n    UNION ALL\n    /* Recursive: sub-components */\n    SELECT A.PARTNO, A.COMPNO, B.TOTAL_QTY * A.QTY, B.LEVEL + 1\n    FROM PARTS_ASSEMBLY A\n    JOIN BOM B ON A.PARTNO = B.COMPNO\n    WHERE B.LEVEL < 10  /* Limit recursion depth */\n)\nSELECT COMPNO, SUM(TOTAL_QTY) AS TOTAL\nFROM BOM GROUP BY COMPNO ORDER BY COMPNO;",
        tip: "Always include a depth limit (LEVEL < n) in recursive CTEs to prevent infinite loops from circular references. Use SEARCH BY BREADTH FIRST for breadth-first traversal order.",
        quizOptions: ["SQL cannot traverse hierarchical structures", "Recursive CTEs with UNION ALL traverse hierarchies; anchor member selects roots, recursive member finds children, multiplying quantities through levels", "BOM traversal requires stored procedures", "SQL recursion requires a special license"],
        quizAnswerIndex: 1
    },
    {
        id: "sql_b4_035", category: "SQL", level: "Expert",
        question: "What is the SQL NTILE function and how is it used for percentile analysis?",
        answer: "NTILE(n) divides rows into n roughly equal groups (tiles) ordered by a specific column. Assigns each row a tile number from 1 to n. Used for: quartile analysis (NTILE(4)), decile analysis (NTILE(10)), percentile ranking. If rows aren't evenly divisible, some tiles get one more row than others (larger tiles come first).",
        code: "/* Divide employees into salary quartiles: */\nSELECT EMPNO, SALARY,\n       NTILE(4) OVER (ORDER BY SALARY) AS QUARTILE,\n       NTILE(10) OVER (ORDER BY SALARY) AS DECILE,\n       NTILE(100) OVER (ORDER BY SALARY) AS PERCENTILE\nFROM EMPLOYEE;\n\n/* Quartile 1 = bottom 25%, Quartile 4 = top 25% */\n\n/* Find employees in top 10% salary range: */\nSELECT * FROM (\n    SELECT EMPNO, SALARY,\n           NTILE(10) OVER (ORDER BY SALARY) AS DECILE\n    FROM EMPLOYEE\n) WHERE DECILE = 10;",
        tip: "NTILE is excellent for compensation analysis and reporting. Combine with CASE to label quartiles ('Bottom Quarter', 'Second Quarter', etc.) for executive reports.",
        quizOptions: ["NTILE computes statistical null checks", "NTILE(n) divides rows into n equal groups by ORDER BY column; row gets group number 1 to n; used for quartile/percentile analysis", "NTILE requires GROUP BY", "NTILE is only available in Oracle, not DB2"],
        quizAnswerIndex: 1
    },

    // Final additional CICS questions
    {
        id: "cics_b4_031", category: "CICS", level: "Expert",
        question: "What is CICS Liberty profile and how does it enable Java microservices on mainframe?",
        answer: "CICS Liberty is a Java EE/Jakarta EE application server integrated within CICS. Enables running: JAX-RS REST APIs, Servlets, EJBs, CDI beans, JPA on mainframe. Liberty applications can call CICS services (JCICS API), access DB2 via JDBC, and interact with COBOL programs. Provides containerized Java microservices colocated with mainframe data for low-latency hybrid architectures.",
        code: "// JCICS: Java accessing CICS from Liberty:\npublic class EmployeeService {\n    @GET @Path(\"/employee/{id}\")\n    public Employee getEmployee(@PathParam(\"id\") String empno) {\n        Program prog = new Program();\n        prog.setName(\"EMPQUERY\");\n        CommAreaHolder ca = new CommAreaHolder();\n        // ... set commarea fields\n        prog.link(ca);  // CICS LINK to COBOL program\n        return parseResponse(ca);\n    }\n}",
        tip: "CICS Liberty enables the 'strangler pattern' - gradually replacing CICS 3270 transactions with REST APIs while reusing the existing COBOL business logic via JCICS.",
        quizOptions: ["CICS cannot run Java applications", "CICS Liberty is an integrated Java EE server enabling REST APIs, Servlets, and microservices with CICS/COBOL integration via JCICS", "Liberty requires separate server hardware", "Liberty replaces CICS completely"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_032", category: "CICS", level: "Expert",
        question: "How does CICS handle distributed transactions with two-phase commit?",
        answer: "CICS two-phase commit (2PC) coordinates multiple resource managers atomically. Phase 1 (prepare): CICS asks all resource managers (DB2, VSAM, IMS) if they're ready to commit. Phase 2 (commit/rollback): if all say ready, commit all; if any says no, rollback all. Uses RRS (Resource Recovery Services) for cross-product coordination. Ensures 'all or nothing' across DB2 + VSAM + IMS in one transaction.",
        code: "/* CICS 2PC automatically coordinates: */\nEXEC CICS READ FILE('VSAM-ACCOUNT') UPDATE ... END-EXEC  /* Acquire VSAM lock */\nEXEC SQL UPDATE BALANCE_TABLE SET ... END-EXEC           /* Acquire DB2 lock */\n/* At SYNCPOINT: */\nEXEC CICS SYNCPOINT END-EXEC\n/* CICS automatically: */\n/* 1. Prepares VSAM and DB2 (Phase 1) */\n/* 2. Commits both if both ready (Phase 2) */\n/* 3. Rolls back both if either fails */",
        tip: "2PC ensures data consistency across multiple resource types. If CICS abends between Phase 1 and Phase 2, RRS helps resolve in-doubt transactions during recovery.",
        quizOptions: ["CICS cannot coordinate multiple databases", "CICS 2PC coordinates DB2, VSAM, and IMS atomically via RRS; prepare phase checks readiness, commit/rollback phase finalizes all", "2PC requires manual coding in COBOL", "2PC only works for DB2 transactions"],
        quizAnswerIndex: 1
    },
    {
        id: "cics_b4_033", category: "CICS", level: "Expert",
        question: "What is CICS FEPI (Front End Programming Interface)?",
        answer: "FEPI (Front End Programming Interface) allows CICS programs to drive other CICS applications as if they were terminal users. Used for: legacy application wrapping (creating APIs from terminal applications), application-to-application communication without rewriting, test automation of 3270 screens. FEPI sends 3270 data streams and receives responses, simulating a human operator.",
        code: "/* FEPI - drive another CICS application: */\nEXEC CICS FEPI ALLOCATE\n    NODE(WS-FEPI-NODE)\n    POOL('POOL01')\n    RESP(WS-RESP)\nEND-EXEC\n\nEXEC CICS FEPI CONVERSE\n    NODENAME(WS-FEPI-NODE)\n    INTO(WS-RESPONSE-SCREEN)\n    LENGTH(WS-LEN)\n    TOFLENGTH(WS-SEND-LEN)\n    TOFROM(WS-3270-DATA)\n    RESP(WS-RESP)\nEND-EXEC",
        tip: "FEPI is a legacy integration technique. Modern approaches use CICS channels/containers, web services, or direct CICS LINK calls. Use FEPI only when other integration options aren't feasible.",
        quizOptions: ["FEPI is a terminal emulator for users", "FEPI allows CICS programs to drive other CICS applications programmatically by simulating 3270 terminal interactions", "FEPI is required for all CICS communication", "FEPI only works between CICS and IMS"],
        quizAnswerIndex: 1
    }
];
