// BATCH 2: JCL + COBOL Additional Questions (200 questions)
export const questionsBatch2 = [
    // ============ ADDITIONAL JCL QUESTIONS ============
    {
        id: "jcl_b2_001", category: "JCL", level: "Beginner",
        question: "What is the maximum length of a JCL statement, and how do you continue a JCL statement to the next line?",
        answer: "A JCL statement can be a maximum of 80 characters wide (columns 1-80). To continue a statement to the next line, you break the statement before column 72, place any non-blank character in column 72, and resume the continued content starting from column 16 on the next line. The continuation line must also have // in columns 1-2.",
        code: "//LONGDD   DD DSN=VERY.LONG.DATASET.NAME.THAT.NEEDS,\n//            CONTINUATION.ON.NEXT.LINE,\n//            DISP=SHR",
        tip: "Modern ISPF editors automatically wrap JCL statements. In CI/CD pipelines, use JCL preprocessors to handle long statements cleanly.",
        quizOptions: ["72 characters", "80 characters with continuation in column 72", "256 characters", "No limit"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_002", category: "JCL", level: "Beginner",
        question: "What does the CLASS parameter on the JOB card control?",
        answer: "The CLASS parameter assigns the job to a specific job class (A-Z or 0-9). Job classes are defined by the installation to route jobs to different initiators with specific resource requirements (memory, priority, output). For example, CLASS=A might be high-priority interactive jobs, CLASS=B long-running batch jobs.",
        code: "//MYJOB    JOB (ACCT),'DESCRIPTION',CLASS=A,MSGCLASS=X",
        tip: "Work with your systems programmer to understand your installation's class definitions. Using the wrong class can cause jobs to wait indefinitely in the queue.",
        quizOptions: ["Controls file access permissions", "Routes jobs to initiators with specific resource limits", "Sets CPU time limits", "Defines output printer class"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_003", category: "JCL", level: "Beginner",
        question: "What is the purpose of the MSGCLASS parameter?",
        answer: "MSGCLASS specifies the output class for job log messages (JES output). These messages include job start/end notifications, step return codes, JCL listings, and system messages. Common values are A (held in spool for review), X (purge immediately after printing), or specific printer class names.",
        code: "//MYJOB    JOB (ACCT),'TEST',CLASS=B,MSGCLASS=X,MSGLEVEL=(1,1)",
        tip: "Use MSGCLASS=X in production to avoid filling spool. Use MSGCLASS=A in testing to review all JCL output before it's purged.",
        quizOptions: ["Controls message encryption", "Specifies output class for job log messages", "Sets number of messages to display", "Controls VSAM message verbosity"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_004", category: "JCL", level: "Beginner",
        question: "What does MSGLEVEL=(1,1) vs MSGLEVEL=(0,0) control in JCL?",
        answer: "MSGLEVEL controls the detail level of job output messages. The first digit controls JCL listing (0=only JOB statement, 1=all JCL, 2=all JCL including PROC expansions). The second digit controls allocation/termination messages (0=print only if job abends, 1=always print). MSGLEVEL=(1,1) produces full JCL listing and all allocation messages.",
        code: "//MYJOB    JOB (ACCT),'PROD',MSGLEVEL=(2,1)  /* Full PROC expansion */",
        tip: "Use MSGLEVEL=(2,1) when debugging PROC-related issues to see the full expansion of cataloged procedures.",
        quizOptions: ["Controls message priority levels", "Controls JCL listing detail and allocation message verbosity", "Sets system log levels", "Defines DB2 message verbosity"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_005", category: "JCL", level: "Beginner",
        question: "What is the NOTIFY parameter on the JOB card?",
        answer: "NOTIFY=userid sends a message to a TSO user when the job completes. The user receives an immediate notification at their terminal showing the job name, job number, and completion code. This is especially useful for long-running batch jobs.",
        code: "//MYJOB    JOB (ACCT),'DESC',NOTIFY=&SYSUID",
        tip: "Using NOTIFY=&SYSUID automatically substitutes your TSO user ID, making JCL portable across different user accounts.",
        quizOptions: ["Sends email notification", "Notifies TSO user when job completes", "Sets system notification level", "Alerts operators to mount tapes"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_006", category: "JCL", level: "Intermediate",
        question: "Explain the difference between DISP=SHR and DISP=OLD for an existing dataset.",
        answer: "DISP=SHR (Shared) allows the dataset to be opened by multiple jobs simultaneously. The dataset is typically opened for read-only access. DISP=OLD (Exclusive) acquires exclusive control - only one job can open it at a time, blocking other jobs. Use SHR for read-only reference files and OLD when writing to prevent concurrent modifications.",
        code: "//REFFILE  DD DSN=PROD.REFERENCE,DISP=SHR   /* Multiple readers OK */\n//UPDFILE  DD DSN=PROD.MASTER,DISP=OLD       /* Exclusive write access */",
        tip: "Never open a dataset you intend to write to with DISP=SHR - other jobs may simultaneously read partially-written data leading to data corruption.",
        quizOptions: ["SHR reads faster; OLD writes faster", "SHR allows concurrent access; OLD is exclusive access", "SHR is for sequential; OLD is for VSAM", "They are identical for read operations"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_007", category: "JCL", level: "Intermediate",
        question: "What is the SPACE parameter syntax and what do TRK, CYL, and block count mean?",
        answer: "SPACE=(unit,(primary,secondary),RLSE) allocates disk space. Units: TRK (tracks), CYL (cylinders), or a block size number. Primary is initial allocation; secondary is additional extents (up to 15). RLSE releases unused space at job end. Example: SPACE=(CYL,(10,5),RLSE) allocates 10 cylinders with 5-cylinder secondary extents.",
        code: "//OUTFILE  DD DSN=OUTPUT.DATA,DISP=(NEW,CATLG,DELETE),\n//            SPACE=(TRK,(100,50),RLSE),\n//            DCB=(RECFM=FB,LRECL=80,BLKSIZE=27920)",
        tip: "Always specify RLSE for output files to return unused space to the system. Use CYL for large files and TRK for smaller datasets.",
        quizOptions: ["SPACE only works with TRK unit", "TRK=tracks, CYL=cylinders, block size for block-based allocation with primary+secondary", "CYL is only for VSAM files", "Secondary allocation is mandatory"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_008", category: "JCL", level: "Intermediate",
        question: "What is a GDG (Generation Data Group) base and how do you create one?",
        answer: "A GDG base is a catalog entry that manages a series of related dataset generations. Create it using IDCAMS DEFINE GDG with parameters: NAME (base name), LIMIT (max generations to keep), NOEMPTY/EMPTY (what to do when limit exceeded), SCRATCH/NOSCRATCH (whether to delete old generations).",
        code: "//DEFGDG   EXEC PGM=IDCAMS\n//SYSIN    DD *\n  DEFINE GDG (NAME(PROD.DAILY.REPORT) -\n              LIMIT(10)               -\n              NOEMPTY                 -\n              SCRATCH)\n/*",
        tip: "Use NOEMPTY to keep the catalog intact when limit is reached - only the oldest generation is removed. Use EMPTY to remove all entries when limit is exceeded.",
        quizOptions: ["Using IEFBR14 with special parameters", "Using IDCAMS DEFINE GDG with NAME, LIMIT, and disposition options", "GDGs are automatically created by MVS", "Using DFSMS allocation routines"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_009", category: "JCL", level: "Intermediate",
        question: "What is the UNIT parameter and what are the differences between UNIT=SYSDA, UNIT=TAPE, and UNIT=VIO?",
        answer: "UNIT specifies the device type for dataset allocation. UNIT=SYSDA means any available direct access storage device (disk). UNIT=TAPE means any available tape drive. UNIT=VIO (Virtual I/O) allocates the dataset in virtual paging space (memory), bypassing physical I/O completely - ideal for temporary datasets that need maximum speed.",
        code: "//TEMP    DD DSN=&&TEMPFILE,UNIT=VIO,SPACE=(CYL,(1,1))\n//DISK    DD DSN=PROD.DATA,UNIT=SYSDA,SPACE=(CYL,(5,2))",
        tip: "VIO datasets live in memory and are automatically deleted at job end. They're perfect for temporary sort work files in DFSORT steps.",
        quizOptions: ["SYSDA=disk, TAPE=cartridge, VIO=virtual memory I/O for temporary files", "They specify the physical device address", "SYSDA is for VSAM only", "They control I/O buffer sizes"],
        quizAnswerIndex: 0
    },
    {
        id: "jcl_b2_010", category: "JCL", level: "Intermediate",
        question: "What is a JCL PROC and how is it different from a regular JCL job?",
        answer: "A JCL PROC (Procedure) is a reusable set of JCL statements stored in a PROCLIB (procedure library). Unlike regular JCL which runs directly, a PROC is invoked via EXEC PROC=name or EXEC procname. PROCs use symbolic parameters (&name) for customization. In-stream PROCs are defined within the job itself. Cataloged PROCs are stored in system libraries.",
        code: "/* Cataloged PROC stored in PROCLIB: */\n//COMPLINK PROC LIB='PROD.LOAD',PGM=MYPROG\n//STEP1   EXEC PGM=&PGM\n//STEPLIB DD DSN=&LIB,DISP=SHR\n//PEND\n\n/* Usage in JCL: */\n//MYJOB   JOB\n//RUN    EXEC COMPLINK,LIB='TEST.LOAD'",
        tip: "Store frequently-used job steps in cataloged PROCs to standardize execution and reduce JCL maintenance. Use symbolic parameters to make PROCs flexible.",
        quizOptions: ["A PROC is a subset of JCL", "A PROC is a reusable set of JCL statements invoked via EXEC, supporting symbolic parameter substitution", "PROCs run faster than regular JCL", "PROCs cannot contain DD statements"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_011", category: "JCL", level: "Expert",
        question: "How does JCL INCLUDE work and when would you use it over a PROC?",
        answer: "JCL INCLUDE embeds pre-defined sets of JCL statements (stored in a library member) directly into a JCL stream at the point of the INCLUDE statement. Unlike PROCs which are invoked as complete steps, INCLUDEs inject raw JCL. Use INCLUDE for: common DD statements, standard job setup cards, or header/trailer information that's identical across jobs.",
        code: "//JCLLIB  ORDER=SYS.INCLUDE.LIBRARY\n//MYJOB   JOB\n//        INCLUDE MEMBER=STDSETUP\n//STEP1   EXEC PGM=MYPROG\n//        INCLUDE MEMBER=STDDDS",
        tip: "INCLUDE is more flexible than PROC for sharing DD statements across steps without creating formal procedures. Use JCLLIB to specify the include library.",
        quizOptions: ["INCLUDE is identical to PROC", "INCLUDE injects raw JCL statements; PROC creates complete step structures", "INCLUDE only works with DD statements", "INCLUDE requires special IBM license"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_012", category: "JCL", level: "Expert",
        question: "What is JCL SET and how are it and symbolic parameters different?",
        answer: "JCL SET defines symbolic parameters within the job stream itself (not just in PROCs). SET allows you to define variables that can be referenced throughout subsequent JCL statements. Unlike PROC symbolics which are defined in PROC headers, SET variables are defined anywhere in the JCL job and can override PROC symbolics.",
        code: "//MYJOB   JOB\n//        SET OUTLIB='PROD.OUTPUT.LIB'\n//        SET RUNDATE='20260606'\n//STEP1   EXEC PGM=MYPROG,PARM=&RUNDATE\n//OUTPUT  DD DSN=&OUTLIB,DISP=SHR",
        tip: "SET is invaluable for defining job-level constants that need to be referenced in multiple steps. Changes to one SET statement propagate everywhere it's referenced.",
        quizOptions: ["SET and symbolic parameters are identical", "SET defines job-stream variables; PROC symbolics are defined in procedure headers", "SET only works in PROC definitions", "SET overrides system symbols only"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_013", category: "JCL", level: "Expert",
        question: "Explain the SYSOUT DD statement and the various SYSOUT classes.",
        answer: "SYSOUT routes program output to the JES output queue. Format: SYSOUT=class where class determines routing: A=local printer, * (asterisk) = default output class, X=discard. Additional parameters: SYSOUT=(class,writer,form) for special handling. COPIES, DEST, and FCB parameters control printing details.",
        code: "//SYSPRINT DD SYSOUT=*              /* Default output class */\n//REPORT   DD SYSOUT=(A,,REPORT)   /* Printer with form name */\n//DEBUG    DD SYSOUT=X             /* Discard output */\n//REMOTE   DD SYSOUT=(A,),DEST=RMT1 /* Remote destination */",
        tip: "Use SYSOUT=* for standard output and SYSOUT=X for debugging output you don't need. DEST parameter routes output to specific network destinations.",
        quizOptions: ["SYSOUT writes to VSAM files", "SYSOUT routes program output to JES output queue with class determining disposition", "SYSOUT is only for error messages", "SYSOUT writes directly to disk"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_014", category: "JCL", level: "Expert",
        question: "What are JCL output statements (OUTPUT JCL) and when are they used?",
        answer: "OUTPUT statements define detailed output processing specifications that SYSOUT DD statements can reference. They specify: COPIES, FORMS, CHARS (character arrangement), FCB (forms control buffer), PAGEDEF, FORMDEF, CLASS, DEST, and HOLD. A SYSOUT DD references an OUTPUT statement using the OUTPUT=*.label syntax.",
        code: "//RPTOUT   OUTPUT CLASS=A,COPIES=3,DEST=PRINTER1,FORMS=REPT\n//STEP1    EXEC PGM=REPORTER\n//SYSPRINT DD SYSOUT=(*,,),OUTPUT=*.RPTOUT",
        tip: "OUTPUT statements centralize print parameters. Multiple SYSOUT DDs can reference the same OUTPUT statement for consistent print handling.",
        quizOptions: ["OUTPUT statements define report content", "OUTPUT JCL statements define detailed print/routing specifications for SYSOUT DD references", "OUTPUT is only for tape datasets", "OUTPUT statements replace SYSOUT"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_015", category: "JCL", level: "Intermediate",
        question: "What happens when you specify DCB=*.stepname.ddname (DCB referback)?",
        answer: "DCB referback copies DCB attributes (RECFM, LRECL, BLKSIZE) from a previously defined DD statement. This ensures that a new file is created with identical record format to a reference file, preventing mismatches. The syntax *.stepname.ddname points to a specific DD from a previous step.",
        code: "//STEP1   EXEC PGM=READER\n//INFILE  DD DSN=INPUT.DATA,DISP=SHR\n//STEP2   EXEC PGM=WRITER\n//OUTFILE DD DSN=OUTPUT.DATA,DISP=(NEW,CATLG),\n//           DCB=*.STEP1.INFILE,SPACE=(CYL,(5,5))",
        tip: "DCB referback is especially useful when creating output files that must match the format of input files exactly.",
        quizOptions: ["DCB referback creates a dataset copy", "DCB referback copies DCB attributes from a previously defined DD statement", "It creates a symbolic link between datasets", "DCB referback is only for tape files"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_016", category: "JCL", level: "Expert",
        question: "What is the JCLLIB statement and how does it affect PROC and INCLUDE resolution?",
        answer: "//JCLLIB ORDER= specifies libraries to search for cataloged procedures and INCLUDE members. It's placed after the JOB card and before any EXEC statements. Libraries are searched in the specified order before system PROCLIB libraries. This allows using private/test PROCs without modifying system libraries.",
        code: "//MYJOB   JOB (ACCT),'TEST'\n//JCLLIB  ORDER=(MY.TEST.PROCLIB,DEPT.SHARED.PROCS)\n//STEP1   EXEC MYPROC   /* Searches MY.TEST.PROCLIB first */",
        tip: "Use JCLLIB to test new PROC versions without affecting production. Place your test library first in the ORDER list to override system PROCs.",
        quizOptions: ["JCLLIB specifies datasets to be included as input", "JCLLIB specifies libraries to search for PROCs and INCLUDE members before system defaults", "JCLLIB is the job's load library", "JCLLIB overrides JOBLIB"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_017", category: "JCL", level: "Beginner",
        question: "What is the TYPRUN parameter on the JOB card and what are its valid values?",
        answer: "TYPRUN specifies special processing options: SCAN (syntax check only, don't execute), HOLD (submit to input queue but hold, don't execute until released), COPY (copy JCL to SYSOUT without checking), JCLHOLD (same as HOLD). SCAN is extremely useful for validating JCL syntax without running the job.",
        code: "//TESTJOB  JOB (ACCT),'SYNTAX CHECK',TYPRUN=SCAN\n//STEP1    EXEC PGM=MYPROG\n//INPUT    DD DSN=MY.INPUT,DISP=SHR\n/* This job won't run, just validates JCL syntax */",
        tip: "Always use TYPRUN=SCAN when making significant JCL changes in production before executing. It catches syntax errors without consuming resources.",
        quizOptions: ["TYPRUN=SCAN executes and scans output", "TYPRUN values control special processing: SCAN=syntax check only, HOLD=queue without executing", "TYPRUN sets the job type class", "TYPRUN=COPY creates a backup job"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_018", category: "JCL", level: "Intermediate",
        question: "How do you handle the SCHENV and JOBGROUP parameters for workload management?",
        answer: "SCHENV (Scheduling Environment) links a job to WLM (Workload Manager) scheduling environments that define available resources. JOBGROUP groups related jobs for collective management. These JES3 and WLM features allow sophisticated scheduling based on resource availability, time windows, and business priorities.",
        code: "//MYJOB   JOB (ACCT),'PROD',CLASS=A,\n//         SCHENV=DB2PROD\n/* Routes job only to systems where DB2PROD environment is active */",
        tip: "Work with your WLM administrator to define scheduling environments that match your application requirements, especially for jobs needing specific subsystem availability.",
        quizOptions: ["SCHENV routes jobs to specific processors", "SCHENV links jobs to WLM scheduling environments defining available resources", "SCHENV sets schedule times for jobs", "SCHENV is only for tape jobs"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_019", category: "JCL", level: "Expert",
        question: "What is RACF security consideration when writing JCL that accesses protected datasets?",
        answer: "RACF (Resource Access Control Facility) controls dataset access via profiles. When JCL accesses a dataset, RACF checks: (1) The job's user ID (from JOB card USER parameter or submitter), (2) Dataset profile permissions (READ, UPDATE, CONTROL, ALTER), (3) Group access. SURROGAT class allows one user to submit jobs under another's authority.",
        code: "//MYJOB   JOB (ACCT),'TEST',USER=PRODID,PASSWORD=XXXXXXXX\n/* Runs under PRODID's authority - needs SURROGAT permission */",
        tip: "Never hardcode passwords in JCL. Use password phrases or RACF PassTickets for automation. Modern shops use started tasks with proper RACF profiles instead.",
        quizOptions: ["RACF is bypassed for batch jobs", "RACF checks job user ID against dataset profile permissions using READ/UPDATE/CONTROL/ALTER authorities", "RACF only applies to online transactions", "JCL bypasses RACF by default"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_020", category: "JCL", level: "Expert",
        question: "Explain how JCL handles ABEND vs user return codes and how MAXCC is used.",
        answer: "System abends (Sxxx) are hardware/OS errors with hex codes. User abends (Unnn) are program-issued via ABEND macro. Regular return codes (0-4095) are set by programs. MAXCC is the highest return code issued during the job. Conditions like COND and IF/THEN/ELSE test MAXCC or step-specific RC values. RC=0 means success; RC=4 typically means warning; RC=8 means error.",
        code: "//STEP1   EXEC PGM=PROG1\n/* If PROG1 sets RC=4 (warning)... */\n//STEP2   IF (STEP1.RC <= 4) THEN\n//S2      EXEC PGM=PROG2\n//STEP2   ENDIF",
        tip: "Standardize return codes across your programs: 0=success, 4=warning (continue), 8=error (investigate), 12=severe (stop), 16=fatal. This makes JCL condition checking consistent.",
        quizOptions: ["MAXCC is set by the operator", "MAXCC tracks the highest return code; system abends are Sxxx, user abends Unnn, and step RCs are tested by COND/IF-THEN-ELSE", "MAXCC resets each step", "Return codes are always 0 or 8"],
        quizAnswerIndex: 1
    },

    // ============ MORE JCL QUESTIONS ============
    {
        id: "jcl_b2_021", category: "JCL", level: "Beginner",
        question: "What is the difference between PDS (Partitioned Dataset) and PDSE (Partitioned Dataset Extended)?",
        answer: "PDS stores members with a fixed directory; directory blocks fill up requiring IEBCOPY compression. PDSE dynamically manages directory space, never needs compression, supports program objects (load modules), allows concurrent updates, and is managed by DFSMS. PDSE also supports long member names (up to 8 chars same as PDS but with attributes).",
        code: "/* Allocate PDSE - note DSNTYPE=LIBRARY */\n//NEWPDSE  DD DSN=MY.SOURCE.LIBRARY,DISP=(NEW,CATLG),\n//            SPACE=(CYL,(10,5,50)),UNIT=SYSDA,\n//            DCB=(RECFM=FB,LRECL=80),DSNTYPE=LIBRARY",
        tip: "Always prefer PDSE over PDS for new library allocations. PDSE eliminates SE37 abends and compression requirements, simplifying library management.",
        quizOptions: ["PDS is larger; PDSE is smaller", "PDS has fixed directory needing compression; PDSE dynamically manages space and never needs compression", "PDSE is only for load libraries", "They are identical except for size limits"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_022", category: "JCL", level: "Intermediate",
        question: "How do you catalog an uncataloged dataset using JCL?",
        answer: "Use IDCAMS RECATALOG command or IEHPROGM CATLG to add an uncataloged dataset to the system catalog. Alternatively, open the dataset with DISP=(OLD,CATLG) in a JCL step using both the UNIT and VOL=SER parameters to physically locate it first, then the CATLG disposition adds it to the catalog.",
        code: "//CATALOG  EXEC PGM=IEFBR14\n//CATDD    DD DSN=LOST.DATASET,DISP=(OLD,CATLG),\n//            UNIT=SYSDA,VOL=SER=PROD01\n/* Or using IDCAMS: */\n//CATJOB   EXEC PGM=IDCAMS\n//SYSIN    DD *\n  RECATALOG DATASET(LOST.DATASET) DEVT(3390) VOLUMES(PROD01)\n/*",
        tip: "Always document the volume serial numbers of your datasets. When catalogs are corrupted or datasets are moved without recataloging, you'll need these to recover them.",
        quizOptions: ["Use IEBCOPY to catalog datasets", "Open with DISP=(OLD,CATLG) specifying UNIT and VOL=SER to physically locate, or use IDCAMS RECATALOG", "Datasets are always automatically cataloged", "Use DFDSS to catalog datasets"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_023", category: "JCL", level: "Expert",
        question: "What is the DSN system variable (&SYSDATE, &SYSTIME, &SYSUID) and how are they used?",
        answer: "JCL system variables are automatically set by MVS. &SYSUID contains the submitter's user ID. &SYSDATE contains the current date (yyddd Julian or yyyyddd). &SYSTIME contains the current time. &SYSJOBNAME contains the job name. They're useful for creating unique dataset names or passing runtime information to programs.",
        code: "//MYJOB   JOB (ACCT),&SYSUID\n//STEP1   EXEC PGM=MYPROG\n//OUTFILE DD DSN=&&TEMP.&SYSDATE.&SYSTIME,\n//           DISP=(NEW,DELETE,DELETE),SPACE=(TRK,(1,1))",
        tip: "Use &SYSUID in dataset names to ensure uniqueness across users when multiple people share the same JCL templates.",
        quizOptions: ["System variables must be manually set", "JCL system variables like &SYSUID, &SYSDATE, &SYSTIME are automatically populated by MVS", "System variables only work in PROCs", "They require special JCL INCLUDE statements"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_024", category: "JCL", level: "Intermediate",
        question: "How does IEBGENER work and what is it typically used for?",
        answer: "IEBGENER copies sequential datasets and PDS members. It can convert between sequential and PDS, create datasets, and perform simple reformatting via SYSIN control statements. Without SYSIN DD statements, it performs a straight copy. With GENERATE/MEMBER statements, it can create PDS members.",
        code: "//COPYJOB  EXEC PGM=IEBGENER\n//SYSPRINT DD SYSOUT=*\n//SYSIN    DD DUMMY          /* No control cards = straight copy */\n//SYSUT1   DD DSN=INPUT.SEQUENTIAL,DISP=SHR\n//SYSUT2   DD DSN=OUTPUT.DATASET,DISP=(NEW,CATLG),\n//            SPACE=(TRK,(5,5)),DCB=*.SYSUT1",
        tip: "IEBGENER with SYSIN DD DUMMY performs a simple file copy. Add control statements to SYSIN for member creation or field reformatting.",
        quizOptions: ["IEBGENER compiles COBOL programs", "IEBGENER copies sequential datasets and PDS members, optionally reformatting via control statements", "IEBGENER only works with VSAM files", "IEBGENER creates GDG base entries"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_025", category: "JCL", level: "Expert",
        question: "What is DFDSS (Data Facility Data Set Services) and when is it used over IEBGENER?",
        answer: "DFDSS (now called DFSMSdss) copies, moves, dumps, and restores datasets with high performance. Unlike IEBGENER, DFDSS can: handle all dataset organizations (VSAM, PDS, sequential), copy at the track/cylinder level, compress during copy, copy across systems, and is much faster for large datasets. Use it for disaster recovery, storage migration, and large-scale copies.",
        code: "//DSSBACK  EXEC PGM=ADRDSSU\n//SYSPRINT DD SYSOUT=*\n//SYSIN    DD *\n  COPY -\n    DATASET(INCLUDE(PROD.**)) -\n    TOVOLUME(BACKUP) -\n    REPLACE -\n    COMPRESS\n/*",
        tip: "DFDSS is the industry standard for mainframe backup/restore operations. It's far more capable than IEBGENER for production environments.",
        quizOptions: ["DFDSS is a slower alternative to IEBGENER", "DFDSS handles all dataset types at track-level with compression, encryption, and cross-system copy capabilities", "DFDSS only works for tape datasets", "They are identical in capability"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_026", category: "JCL", level: "Intermediate",
        question: "What is the purpose of the IEBUPDTE utility?",
        answer: "IEBUPDTE updates sequential datasets and PDS members using control records. It can add, change, or delete records using a special control card format. Primary uses: updating source code libraries, applying patches to text files, and maintaining configuration members. Control records begin with ./ (period-slash).",
        code: "//UPDATE   EXEC PGM=IEBUPDTE,PARM=NEW\n//SYSPRINT DD SYSOUT=*\n//SYSUT2   DD DSN=MY.SOURCE.LIB,DISP=SHR\n//SYSIN    DD *\n./ ADD NAME=MYPROG\n       IDENTIFICATION DIVISION.\n       PROGRAM-ID. MYPROG.\n./ ENDUP\n/*",
        tip: "IEBUPDTE is commonly used to deploy code changes to mainframe source libraries in batch, making it useful for automated deployment scripts.",
        quizOptions: ["IEBUPDTE compresses PDS libraries", "IEBUPDTE updates sequential datasets and PDS members using ./ control records", "IEBUPDTE is used for VSAM file updates", "IEBUPDTE copies datasets between volumes"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_027", category: "JCL", level: "Expert",
        question: "How do you use IEHLIST to list PDS directory contents?",
        answer: "IEHLIST lists contents of disk volumes and PDS directories. The LISTPDS control statement lists members of a partitioned dataset. LISTVTOC lists the Volume Table of Contents (VTOC) showing all datasets on a volume. The output includes member names, attributes, TTR (track/record location), and user data.",
        code: "//LISTPDS  EXEC PGM=IEHLIST\n//SYSPRINT DD SYSOUT=*\n//SYSVOL   DD UNIT=SYSDA,VOL=SER=DISK01,DISP=SHR\n//SYSIN    DD *\n  LISTPDS DSNAME=MY.SOURCE.LIBRARY,FORMAT=LONG,VOL=SER=DISK01\n/*",
        tip: "IEHLIST LISTVTOC is invaluable for finding all datasets on a specific volume when catalog entries are missing or corrupted.",
        quizOptions: ["IEHLIST compiles directory listings", "IEHLIST lists PDS directories (LISTPDS) and volume contents (LISTVTOC) showing member attributes and locations", "IEHLIST only lists VSAM clusters", "IEHLIST creates dataset catalogs"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_028", category: "JCL", level: "Intermediate",
        question: "What is IEHMOVE and how is it different from IEBGENER?",
        answer: "IEHMOVE moves or copies complete groups of datasets between volumes. Unlike IEBGENER which copies dataset contents, IEHMOVE works at the catalog and volume level - copying multiple datasets, maintaining catalog entries, and optionally scratching the source. It can copy entire PDS libraries, GDG groups, and sequential datasets.",
        code: "//MOVEJOB  EXEC PGM=IEHMOVE\n//SYSPRINT DD SYSOUT=*\n//SYSUT1   DD UNIT=SYSDA,VOL=SER=DISK01,DISP=SHR\n//SYSUT2   DD UNIT=SYSDA,VOL=SER=DISK02,DISP=SHR\n//SYSIN    DD *\n  COPY DSNAME=MY.IMPORTANT.LIB,TO=DISK02,FROMVOL=DISK01\n/*",
        tip: "IEHMOVE is useful for volume-level migrations. However, for modern environments, DFSMSdss (DFDSS) provides more robust dataset movement capabilities.",
        quizOptions: ["IEHMOVE only moves tape datasets", "IEHMOVE moves/copies groups of datasets between volumes maintaining catalog entries", "IEHMOVE and IEBGENER are identical", "IEHMOVE only works with PDS libraries"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_029", category: "JCL", level: "Expert",
        question: "What is the IEBCOPY COPYGRP function and when is it used?",
        answer: "IEBCOPY COPYGRP copies a group of PDS members that were defined as a group (using the ALTERMOD statement in a previous IEBCOPY run). It's used when you need to maintain versioning of related member sets. COPYGRP copies all members that were last modified in a single IEBCOPY run.",
        code: "//BACKUP   EXEC PGM=IEBCOPY\n//SYSPRINT DD SYSOUT=*\n//INLIB    DD DSN=PROD.LOAD.LIB,DISP=SHR\n//OUTLIB   DD DSN=BACKUP.LOAD.LIB,DISP=SHR\n//SYSIN    DD *\n  COPYGRP INDD=INLIB,OUTDD=OUTLIB\n/*",
        tip: "Use COPYGRP in release management to capture complete sets of related load modules that were compiled and link-edited together.",
        quizOptions: ["COPYGRP copies all PDS members", "COPYGRP copies PDS members defined as a group by previous ALTERMOD operations for version control", "COPYGRP creates GDG groups", "COPYGRP is identical to standard COPY"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_030", category: "JCL", level: "Intermediate",
        question: "How do you check if a dataset exists in JCL before allocating it?",
        answer: "Use IDCAMS LISTCAT to verify dataset existence. Alternatively, use the IF EXIST condition with SMS to check catalog. Another approach: attempt to open with DISP=SHR; if it fails with JCL error (IEF212I), the dataset doesn't exist. Modern JCL uses EXIST keyword in IF statements for catalog checks.",
        code: "//CHKEXIST EXEC PGM=IDCAMS\n//SYSPRINT DD SYSOUT=*\n//SYSIN    DD *\n  LISTCAT ENTRIES(MY.TARGET.DATASET) ALL\n  IF LASTCC = 0 THEN DO\n    /* Dataset exists - process it */\n  END\n/*",
        tip: "Always validate dataset existence before deletion or exclusive access operations. This prevents job failures from missing files.",
        quizOptions: ["JCL automatically handles missing datasets", "Use IDCAMS LISTCAT or IF EXIST conditions to verify dataset existence before operations", "IEBGENER checks dataset existence", "Datasets must always exist before JCL runs"],
        quizAnswerIndex: 1
    },

    // ============ ADDITIONAL COBOL QUESTIONS ============
    {
        id: "cobol_b2_001", category: "COBOL", level: "Beginner",
        question: "What are the COBOL special registers and give examples of their usage?",
        answer: "Special registers are pre-defined storage areas maintained by COBOL runtime: CURRENT-DATE (current date/time), WHEN-COMPILED (compilation date/time), RETURN-CODE (program return code), ADDRESS OF (memory address of Linkage Section variable), LENGTH OF (byte length of variable), LINAGE-COUNTER (current line number in LINAGE file).",
        code: "PROCEDURE DIVISION.\n    MOVE FUNCTION CURRENT-DATE TO WS-DATE-STR\n    MOVE RETURN-CODE TO WS-RC\n    MOVE LENGTH OF WS-RECORD TO WS-REC-LEN\n    DISPLAY 'COMPILED: ' WHEN-COMPILED",
        tip: "Use RETURN-CODE to set the job step return code: MOVE 8 TO RETURN-CODE before GOBACK. This integrates with JCL condition testing.",
        quizOptions: ["Special registers are user-defined variables", "Special registers are pre-defined COBOL storage areas like CURRENT-DATE, RETURN-CODE, LENGTH OF, ADDRESS OF", "Special registers only exist in CICS", "They must be declared in Working Storage"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_002", category: "COBOL", level: "Beginner",
        question: "What is the difference between PICTURE clause aliases (PIC) and what do common picture characters mean?",
        answer: "PIC (short for PICTURE) defines data format. Characters: 9=numeric digit, X=alphanumeric, A=alphabetic, V=implied decimal point (no physical byte), S=sign, P=assumed decimal position, Z=zero-suppressed numeric, *(asterisk)=zero-fill with asterisk, $(dollar)=floating currency sign, .(period)=actual decimal point, ,(comma)=formatting comma.",
        code: "01 WS-SALARY    PIC S9(7)V99 COMP-3    /* Signed, 7 digits, 2 decimal */\n01 WS-FORMATTED PIC $$$,$$9.99            /* Formatted: $1,234.56 */\n01 WS-ACCT-NO   PIC X(10)                 /* Alphanumeric 10 chars */\n01 WS-RATE      PIC 9(3)V9(4)             /* 3 digits, 4 decimals */",
        tip: "Use COMP-3 for monetary amounts and loop counters. Use COMP for binary indexes. Use X for text that includes non-numeric characters.",
        quizOptions: ["PIC characters are limited to 9 and X", "PIC characters define data format: 9=numeric, X=alphanumeric, V=implied decimal, S=sign, Z=zero-suppress, $=currency", "All numeric fields must use COMP storage", "PIC clauses are optional in COBOL"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_003", category: "COBOL", level: "Beginner",
        question: "What is the COBOL MOVE statement and what are the rules for incompatible moves?",
        answer: "MOVE transfers data between variables. Rules: Alphanumeric to numeric requires valid numeric content. Numeric to alphanumeric converts and left-justifies. Group moves (01-level) are treated as alphanumeric regardless of subordinate field types. Numeric moves truncate or right-justify with zero-fill. Incompatible moves (alphanumeric to numeric with non-numeric data) cause S0C7 abends.",
        code: "MOVE WS-SOURCE TO WS-DEST     /* Basic move */\nMOVE ZEROES TO WS-NUMERIC     /* Fill with zeros */\nMOVE SPACES TO WS-ALPHANUM    /* Fill with spaces */\nMOVE CORRESPONDING WS-REC1 TO WS-REC2  /* Move matching names */",
        tip: "MOVE CORRESPONDING (MOVE CORR) moves fields with identical names between group items, saving lines of code when mapping similar record structures.",
        quizOptions: ["MOVE always converts data automatically", "MOVE transfers data with rules: alphanumeric-to-numeric requires valid data, group moves are alphanumeric, incompatible moves cause S0C7", "MOVE only works between same data types", "MOVE creates copies of data in memory"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_004", category: "COBOL", level: "Intermediate",
        question: "How does the COBOL ON SIZE ERROR clause work and when should it be used?",
        answer: "ON SIZE ERROR executes when the result of an arithmetic operation exceeds the size of the receiving field (overflow) or when division by zero occurs. Without SIZE ERROR, overflow causes silent truncation and division by zero causes S0C7. The NOT ON SIZE ERROR clause executes when the operation succeeds.",
        code: "COMPUTE WS-RESULT = WS-A * WS-B\n    ON SIZE ERROR\n        MOVE 'OVERFLOW' TO WS-ERROR-FLAG\n        MOVE HIGH-VALUES TO WS-RESULT\n    NOT ON SIZE ERROR\n        PERFORM PROCESS-RESULT\nEND-COMPUTE",
        tip: "Always use ON SIZE ERROR for division operations. Division by zero without SIZE ERROR causes an S0C7 abend in COMP fields or produces incorrect results in decimal fields.",
        quizOptions: ["SIZE ERROR is only for multiplication", "ON SIZE ERROR traps arithmetic overflow and division by zero; NOT ON SIZE ERROR runs on success", "SIZE ERROR requires special compiler option", "It only works with COMP fields"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_005", category: "COBOL", level: "Intermediate",
        question: "What is the difference between PERFORM UNTIL and PERFORM VARYING for loop control?",
        answer: "PERFORM UNTIL tests the condition before each iteration (like WHILE). PERFORM VARYING automatically manages an index variable: initializes, tests the UNTIL condition, executes the paragraph, and increments. PERFORM VARYING FROM...BY...UNTIL controls the index explicitly. Both can have AFTER phrases for nested loops.",
        code: "* PERFORM UNTIL:\nPERFORM UNTIL WS-EOF = 'Y'\n    READ INPUT-FILE\n    PERFORM PROCESS-RECORD\nEND-PERFORM\n\n* PERFORM VARYING:\nPERFORM VARYING WS-I FROM 1 BY 1\n    UNTIL WS-I > WS-TABLE-SIZE\n    PERFORM PROCESS-TABLE-ENTRY\nEND-PERFORM",
        tip: "Use PERFORM VARYING for table/array processing where you need a counter. Use PERFORM UNTIL for event-driven loops like file reading where you don't know iteration count.",
        quizOptions: ["PERFORM UNTIL and VARYING are identical", "PERFORM UNTIL tests condition; PERFORM VARYING manages index variables automatically with FROM/BY/UNTIL control", "VARYING only works with OCCURS clauses", "UNTIL tests after execution; VARYING tests before"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_006", category: "COBOL", level: "Intermediate",
        question: "Explain COBOL's file READ statement variants: READ, READ INTO, READ NEXT, and READ KEY.",
        answer: "READ reads sequential file into its record area. READ INTO copies record into a separate working storage area (combining READ and MOVE). READ NEXT reads next record from indexed file in sequential mode. READ KEY reads a specific record by key in random mode. AT END executes when EOF is reached; INVALID KEY for keyed reads.",
        code: "* Sequential READ with AT END:\nREAD EMP-FILE AT END MOVE 'Y' TO WS-EOF\n\n* Random key READ:\nMOVE 12345 TO EMP-KEY\nREAD EMP-KSDS RECORD INTO WS-EMP-RECORD\n    INVALID KEY PERFORM KEY-NOT-FOUND-PARA\n    NOT INVALID KEY PERFORM PROCESS-RECORD\nEND-READ",
        tip: "Use READ INTO to keep Working Storage as the primary working area rather than using the FD record area directly. This prevents accidental overwrites.",
        quizOptions: ["READ variants are only for VSAM files", "READ=sequential, READ INTO=copies to WS, READ NEXT=next indexed record, READ KEY=random access by key", "READ INTO is slower than READ", "READ NEXT only works with ESDS files"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_007", category: "COBOL", level: "Intermediate",
        question: "What is the START verb in COBOL and how does it differ from READ KEY?",
        answer: "START positions a file cursor on an indexed or relative file without reading data. It uses a relational operator (=, >, >=, <, <=) to find the starting position. After START, subsequent READ NEXT statements read sequentially from that position. READ KEY reads a specific record immediately; START sets position for sequential reading.",
        code: "MOVE '100' TO EMP-KEY\nSTART EMP-KSDS KEY >= EMP-KEY\n    INVALID KEY MOVE 'Y' TO WS-EOF\nEND-START\n\n* Now read sequentially from position >= '100':\nPERFORM UNTIL WS-EOF = 'Y'\n    READ EMP-KSDS NEXT AT END MOVE 'Y' TO WS-EOF\n    NOT AT END PERFORM PROCESS-EMP\nEND-PERFORM",
        tip: "START followed by READ NEXT is the most efficient way to read a range of VSAM records (e.g., all employees in department 100-200) without reading the entire file.",
        quizOptions: ["START reads a record immediately", "START positions the file cursor using a relational operator; READ NEXT then reads sequentially from that position", "START only works with KSDS files", "START and READ KEY are identical"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_008", category: "COBOL", level: "Expert",
        question: "What are COBOL reference modification and how do you use it for substring operations?",
        answer: "Reference modification accesses a portion of a data item using (start:length) notation where start is the starting byte position (1-based) and length is the number of bytes. Both can be numeric literals or variables. Length is optional (defaults to end of field). This enables substring operations without separate working storage variables.",
        code: "01 WS-DATE PIC X(8) VALUE '20260606'.\n01 WS-YEAR  PIC X(4).\n01 WS-MONTH PIC X(2).\n\nMOVE WS-DATE(1:4) TO WS-YEAR    /* '2026' */\nMOVE WS-DATE(5:2) TO WS-MONTH   /* '06'   */\n\n* With variable positions:\nMOVE WS-FULL-NAME(WS-START:WS-LEN) TO WS-PARTIAL",
        tip: "Reference modification is more efficient than UNSTRING for simple substring extraction. Use UNSTRING when dealing with variable delimiters.",
        quizOptions: ["Reference modification only works on group items", "Reference modification (start:length) notation extracts substrings from data items without declaring separate variables", "It requires special compiler options", "Reference modification only works on numeric fields"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_009", category: "COBOL", level: "Expert",
        question: "How does COBOL handle floating-point arithmetic with COMP-1 and COMP-2?",
        answer: "COMP-1 is single-precision IEEE floating-point (4 bytes, ~7 significant digits). COMP-2 is double-precision IEEE floating-point (8 bytes, ~15 significant digits). They're stored in hardware floating-point format. COMP-1/2 should be avoided for financial calculations due to binary floating-point imprecision. Use COMP-3 (Packed Decimal) for monetary arithmetic.",
        code: "01 WS-FLOAT-S    PIC S9(7)V9(7)   COMP-1   /* Single precision */\n01 WS-FLOAT-D    PIC S9(15)V9(15)  COMP-2   /* Double precision */\n01 WS-FINANCIAL  PIC S9(9)V99      COMP-3   /* Exact decimal - preferred */\n\n* WARNING: floating-point imprecision:\n* COMP-1 calculation: 0.1 + 0.2 may NOT equal 0.3!",
        tip: "Never use COMP-1 or COMP-2 for financial calculations. Use COMP-3 (Packed Decimal) which stores exact decimal values without binary representation errors.",
        quizOptions: ["COMP-1 and COMP-2 are identical to COMP-3", "COMP-1 is single-precision floating-point; COMP-2 is double-precision; both unsuitable for exact financial calculations", "COMP-1 stores packed decimal data", "They are obsolete and not supported in modern COBOL"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_010", category: "COBOL", level: "Expert",
        question: "What is the COBOL INSPECT statement and what are its four forms?",
        answer: "INSPECT scans character strings. Four forms: (1) INSPECT...TALLYING: counts occurrences of characters/strings. (2) INSPECT...REPLACING: replaces characters/strings. (3) INSPECT...TALLYING...REPLACING: combined count and replace. (4) INSPECT...CONVERTING: converts characters using translation table (like TRANSLATE in other languages).",
        code: "* Count leading spaces:\nINSPECT WS-DATA TALLYING WS-COUNT\n    FOR LEADING SPACES\n\n* Replace all commas with spaces:\nINSPECT WS-CSV REPLACING ALL ',' BY SPACES\n\n* Convert lowercase to uppercase:\nINSPECT WS-NAME CONVERTING\n    'abcdefghijklmnopqrstuvwxyz'\n    TO 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'",
        tip: "INSPECT CONVERTING is the fastest way to convert case in COBOL. Use FUNCTION UPPER-CASE or LOWER-CASE for a simpler alternative in modern COBOL.",
        quizOptions: ["INSPECT only counts characters", "INSPECT has four forms: TALLYING, REPLACING, TALLYING+REPLACING, and CONVERTING for string inspection and modification", "INSPECT works only on numeric fields", "INSPECT requires special libraries"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_011", category: "COBOL", level: "Expert",
        question: "What is COBOL's COMPUTE verb and how does it differ from ADD/SUBTRACT/MULTIPLY/DIVIDE?",
        answer: "COMPUTE evaluates complex arithmetic expressions using standard mathematical notation with operators (+,-,*,/,**). It supports parentheses for operation ordering and can assign results directly. ADD/SUBTRACT/MULTIPLY/DIVIDE are simpler verbs for single operations. COMPUTE is more readable for complex expressions but may be slightly less efficient than individual arithmetic verbs.",
        code: "* COMPUTE with complex expression:\nCOMPUTE WS-TAX = (WS-SALARY * WS-TAX-RATE) / 100\n    ON SIZE ERROR PERFORM TAX-OVERFLOW-PARA\n\n* Equivalent using individual verbs (more verbose):\nMULTIPLY WS-SALARY BY WS-TAX-RATE GIVING WS-TEMP\nDIVIDE 100 INTO WS-TEMP GIVING WS-TAX",
        tip: "Use COMPUTE for complex multi-operation expressions. Use individual verbs (ADD, SUBTRACT) for simple single-operation arithmetic where ON SIZE ERROR handling is critical.",
        quizOptions: ["COMPUTE is faster than individual verbs", "COMPUTE evaluates complex expressions with standard math notation; individual verbs are simpler single operations", "COMPUTE doesn't support SIZE ERROR", "Individual verbs are deprecated in modern COBOL"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_012", category: "COBOL", level: "Intermediate",
        question: "What is the COBOL COPY statement and how does it facilitate code reuse?",
        answer: "COPY includes pre-written COBOL source code from a copybook library (COPY library specified in JCL SYSLIB DD). Copybooks typically contain: standard record layouts, common working storage declarations, and reusable procedure code. REPLACING phrase substitutes text in the copied code, allowing reuse with different variable names.",
        code: "DATA DIVISION.\nWORKING-STORAGE SECTION.\n01 EMP-RECORD.\n   COPY EMPREC01.          /* Standard employee record layout */\n\n* With REPLACING to avoid name conflicts:\nCOPY EMPREC01 REPLACING ==EMP-== BY ==MGR-==.\n/* All EMP- prefixes become MGR- */",
        tip: "Standardize all database record layouts, SQL INCLUDE statements, and common data structures in copybooks. This ensures consistency and reduces maintenance across hundreds of programs.",
        quizOptions: ["COPY duplicates files in the library", "COPY includes pre-written source code from copybook libraries with optional REPLACING for text substitution", "COPY only works in the DATA DIVISION", "COPY requires special RACF permissions"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_013", category: "COBOL", level: "Intermediate",
        question: "What is COBOL SORT verb and how does it differ from using DFSORT in JCL?",
        answer: "The COBOL SORT verb sorts records using SORT FILE with INPUT/OUTPUT PROCEDURES. INPUT PROCEDURE allows custom filtering before sorting. OUTPUT PROCEDURE processes sorted records. It's self-contained within the COBOL program. DFSORT runs as a separate JCL step outside the program. COBOL SORT is simpler for single-program use; DFSORT is more flexible and efficient for complex sorting needs.",
        code: "ENVIRONMENT DIVISION.\n  INPUT-OUTPUT SECTION.\n    FILE-CONTROL.\n      SELECT SORT-FILE ASSIGN TO SORTWORK.\n\nDATA DIVISION.\n  FILE SECTION.\n  SD SORT-FILE RECORD CONTAINS 80 CHARACTERS.\n\nPROCEDURE DIVISION.\n  SORT SORT-FILE ASCENDING KEY SF-SORT-KEY\n    INPUT PROCEDURE PREPARE-SORT-INPUT\n    OUTPUT PROCEDURE PROCESS-SORTED-OUTPUT.",
        tip: "Use COBOL SORT for small datasets within a program. For large-volume sorting, use DFSORT in a separate JCL step for better performance and memory management.",
        quizOptions: ["COBOL SORT and DFSORT are identical", "COBOL SORT verb is program-internal with INPUT/OUTPUT procedures; DFSORT is a separate JCL utility with more options", "DFSORT cannot handle more than 1000 records", "COBOL SORT doesn't support input filtering"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_014", category: "COBOL", level: "Expert",
        question: "How do you implement table lookups using binary search in COBOL for performance?",
        answer: "Define a table with OCCURS ASCENDING/DESCENDING KEY IS followed by INDEXED BY. Pre-sort the table data by the key field. Use SEARCH ALL verb which implements binary search (O(log n)). The table must be sorted and the SEARCH ALL condition can only use EQUAL TO. For unsorted data or non-equality conditions, use linear SEARCH.",
        code: "01 RATE-TABLE.\n   05 RATE-ENTRY OCCURS 1000 TIMES\n                ASCENDING KEY IS RATE-CODE\n                INDEXED BY RATE-IDX.\n      10 RATE-CODE    PIC X(5).\n      10 RATE-PERCENT PIC 9(3)V99.\n\n* Binary search - TABLE MUST BE SORTED:\nSEARCH ALL RATE-ENTRY\n    AT END PERFORM RATE-NOT-FOUND\n    WHEN RATE-CODE(RATE-IDX) = WS-LOOKUP-CODE\n        MOVE RATE-PERCENT(RATE-IDX) TO WS-CURRENT-RATE\nEND-SEARCH",
        tip: "Load tables at program initialization and sort them for SEARCH ALL. For very large tables (>10,000 entries), consider VSAM KSDS instead for better memory management.",
        quizOptions: ["Binary search works on unsorted tables", "SEARCH ALL implements binary search on tables defined with ASCENDING/DESCENDING KEY, requiring sorted data", "SEARCH ALL is slower than linear SEARCH", "Tables are automatically sorted by COBOL"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_015", category: "COBOL", level: "Expert",
        question: "What is COBOL's POINTER data type and how is it used for memory address manipulation?",
        answer: "POINTER (8 bytes on 64-bit systems) stores memory addresses. Used with ADDRESS OF special register to manipulate Linkage Section variables pointing to different memory areas. POINTER variables receive addresses via SET...TO ADDRESS OF and CALL...USING...BY REFERENCE. Essential for dynamic storage allocation (GETMAIN/FREEMAIN) and working with system-level interfaces.",
        code: "01 WS-PTR    POINTER.\n01 WS-LEN    PIC S9(9) COMP.\n\n* Get address of LS variable:\nSET WS-PTR TO ADDRESS OF LS-WORK-AREA\n\n* Allocate dynamic storage:\nCALL 'CEEGTST' USING WS-LEN WS-PTR WS-FC\n/* Now WS-PTR points to allocated storage */\nSET ADDRESS OF LS-WORK-AREA TO WS-PTR",
        tip: "Dynamic storage allocation should be used carefully in COBOL. Always free allocated storage (CEEFRST) when done to prevent memory leaks in long-running CICS transactions.",
        quizOptions: ["POINTER stores numeric values", "POINTER stores memory addresses, used with ADDRESS OF and SET...TO for dynamic memory and system interfaces", "POINTER is only for CICS programs", "POINTER replaces index variables in tables"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_016", category: "COBOL", level: "Expert",
        question: "What are COBOL object-oriented features and when should they be used?",
        answer: "Modern COBOL (2002 and later) supports OO concepts: CLASS definitions with data members and methods, OBJECT SECTION for instance data, METHOD statements for behavior, inheritance via INHERITS clause, polymorphism via INVOKE verb. Most mainframe shops don't use OO COBOL; traditional procedural COBOL dominates. OO COBOL is useful for new greenfield applications.",
        code: "CLASS-ID. EmployeeClass.\nDATA DIVISION.\nOBJECT SECTION.\n  01 EmpID       PIC 9(5).\n  01 EmpName     PIC X(20).\n\nMETHOD-ID. GetEmpName.\nPROCEDURE DIVISION RETURNING WS-Name.\n  MOVE EmpName TO WS-Name.\nEND METHOD GetEmpName.\nEND CLASS EmployeeClass.",
        tip: "OO COBOL is rarely used in practice. Traditional procedural COBOL with well-structured paragraphs and modules provides equivalent maintainability for most mainframe applications.",
        quizOptions: ["COBOL doesn't support OO concepts", "Modern COBOL supports CLASS, OBJECT SECTION, METHOD, and INHERITS for object-oriented programming", "OO COBOL is the standard approach today", "OO COBOL requires separate IBM compiler purchase"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_017", category: "COBOL", level: "Expert",
        question: "How does COBOL handle floating-point conversion with FUNCTION NUMVAL and NUMVAL-C?",
        answer: "FUNCTION NUMVAL converts an alphanumeric representation of a number to a numeric value (e.g., '  -12.34  ' to -12.34). FUNCTION NUMVAL-C converts currency string representations handling currency symbols, commas, and sign indicators (e.g., '$1,234.56' or '1,234.56CR'). Both return COMP-2 (floating-point) values.",
        code: "01 WS-CHAR-AMT  PIC X(15) VALUE '  $1,234.56 '.\n01 WS-NUM-AMT   PIC S9(9)V99 COMP-3.\n\nCOMPUTE WS-NUM-AMT =\n    FUNCTION NUMVAL-C(WS-CHAR-AMT, '$')\n\n* For simple numeric strings:\nCOMPUTE WS-NUM-AMT =\n    FUNCTION NUMVAL('  -9876.54  ')",
        tip: "Always validate input before NUMVAL conversion. Non-numeric content causes runtime errors. Use INSPECT to check character composition first.",
        quizOptions: ["NUMVAL and NUMVAL-C are identical", "NUMVAL converts simple numeric strings; NUMVAL-C handles currency strings with symbols and commas, both returning numeric values", "They only work with COMP fields", "NUMVAL converts numeric to alphanumeric"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_018", category: "COBOL", level: "Expert",
        question: "What is the COBOL WITH DEBUGGING MODE and the USE FOR DEBUGGING declarative?",
        answer: "IDENTIFICATION DIVISION. SOURCE-COMPUTER. IBM-MAINFRAME WITH DEBUGGING MODE activates the debugging declarative. USE FOR DEBUGGING ON paragraph-name/file-name executes automatically when that paragraph/file is used. The DEBUG-ITEM special register contains information about the debugging event. This feature is largely obsolete; modern debugging uses CEDF (CICS) or batch dump tools.",
        code: "SOURCE-COMPUTER. IBM-MAINFRAME WITH DEBUGGING MODE.\n\nDECLARATIVES.\nDEBUG-SECTION SECTION.\n    USE FOR DEBUGGING ON CRITICAL-PARA.\nDEBUG-DISPLAY.\n    DISPLAY 'DEBUG: Entering CRITICAL-PARA'\n    DISPLAY DEBUG-ITEM.\nEND DECLARATIVES.",
        tip: "WITH DEBUGGING MODE is obsolete in modern shops. Use IBM Debug Tool, Record Playback, or add conditional DISPLAY statements controlled by a debug flag variable instead.",
        quizOptions: ["DEBUGGING MODE is the primary COBOL debug method", "WITH DEBUGGING MODE activates USE FOR DEBUGGING declaratives - largely obsolete compared to modern debug tools", "DEBUGGING MODE requires special compiler options", "DEBUG-ITEM stores compiled program names"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_019", category: "COBOL", level: "Intermediate",
        question: "What is the COBOL LINAGE clause and how does it control printer output?",
        answer: "LINAGE clause in the FD (File Description) defines page layout for REPORT files: LINAGE=lines-per-page (total lines), FOOTING=first-footer-line, TOP=top-margin, BOTTOM=bottom-margin. The LINAGE-COUNTER special register tracks current line number. WRITE...AFTER ADVANCING PAGE starts a new page. Essential for producing formatted reports.",
        code: "FD REPORT-FILE\n    LINAGE IS 60 LINES\n    WITH FOOTING AT 55\n    LINES AT TOP 3\n    LINES AT BOTTOM 3.\n\n01 REPORT-RECORD PIC X(132).\n\n* Write with page advance:\nWRITE REPORT-RECORD FROM WS-HEADER-LINE\n    AFTER ADVANCING PAGE\nWRITE REPORT-RECORD FROM WS-DETAIL-LINE\n    AFTER ADVANCING 1 LINE",
        tip: "For complex reports with headers, footers, and page breaks, use LINAGE clause with WRITE AFTER ADVANCING. Modern shops often use DFSMS reports or IBM Report Writer instead.",
        quizOptions: ["LINAGE controls network latency", "LINAGE clause defines page layout: total lines, footing position, top/bottom margins for printer output files", "LINAGE only works with tape files", "LINAGE is a VSAM dataset attribute"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_020", category: "COBOL", level: "Expert",
        question: "How does COBOL handle character encoding and what is the impact of EBCDIC vs ASCII?",
        answer: "Mainframes natively use EBCDIC (Extended Binary Coded Decimal Interchange Code) encoding. Letters A-Z aren't contiguous in EBCDIC (unlike ASCII), so alphabetic comparisons work differently. COBOL's ALPHABET clause defines character ordering. When interfacing with ASCII systems (web services, Linux), character translation is required using CONVERT or explicit translation tables.",
        code: "* EBCDIC A-Z values: A=C1, B=C2... not contiguous!\n* ASCII  A-Z values: A=41, B=42... contiguous\n\n* Define translation alphabet:\nSPECIAL-NAMES.\n    ALPHABET EBCDIC-ORDER IS EBCDIC.\n\n* Test alphabetic ordering:\nIF WS-CHAR > 'A' AND < 'Z'  /* Works in EBCDIC - but not contiguous! */\n    PERFORM PROCESS-ALPHA",
        tip: "Be aware that EBCDIC character ranges aren't contiguous. 'A' to 'Z' in COBOL includes non-alphabetic characters. Use IS ALPHABETIC test instead of range comparison.",
        quizOptions: ["EBCDIC and ASCII are identical for programs", "Mainframes use EBCDIC encoding where A-Z aren't contiguous, requiring translation when interfacing with ASCII systems", "COBOL automatically converts between EBCDIC and ASCII", "ASCII is used internally; EBCDIC is for display only"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_021", category: "COBOL", level: "Expert",
        question: "What is COBOL's EXEC CICS HANDLE CONDITION and how does modern COBOL replace it?",
        answer: "EXEC CICS HANDLE CONDITION condition(paragraph) established error handlers for CICS conditions. When a condition occurs (NOTFND, DUPREC, LENGERR, etc.), control passes to the named paragraph. Modern COBOL uses RESP and RESP2 parameters instead: EXEC CICS command RESP(WS-RESP) END-EXEC, then IF WS-RESP NOT = DFHRESP(NORMAL). HANDLE CONDITION is considered harmful as it uses GOTO-like branching.",
        code: "/* Modern approach - preferred: */\nEXEC CICS READ DATASET('EMPFILE')\n    RIDFLD(WS-EMP-KEY)\n    INTO(WS-EMP-RECORD)\n    RESP(WS-RESP)\n    RESP2(WS-RESP2)\nEND-EXEC\nIF WS-RESP = DFHRESP(NOTFND)\n    PERFORM RECORD-NOT-FOUND\nELSE IF WS-RESP NOT = DFHRESP(NORMAL)\n    PERFORM CICS-ERROR-HANDLER\nEND-IF",
        tip: "Always use RESP/RESP2 instead of HANDLE CONDITION. Inline condition testing makes code clearer and avoids hidden control flow jumps.",
        quizOptions: ["HANDLE CONDITION is the modern approach", "EXEC CICS HANDLE CONDITION is legacy; modern code uses RESP/RESP2 parameters for inline condition checking", "RESP/RESP2 are only for CICS file operations", "HANDLE CONDITION cannot be replaced"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_022", category: "COBOL", level: "Expert",
        question: "What are COBOL XML extensions and how are they used for modern integration?",
        answer: "Modern IBM COBOL (Enterprise COBOL 5+) supports XML PARSE and XML GENERATE statements for XML processing without external libraries. XML PARSE processes XML documents calling processing procedures for each event. XML GENERATE creates XML from COBOL data structures. JSON PARSE and JSON GENERATE are similar for REST API integration.",
        code: "* Parse XML:\nXML PARSE XML-DOCUMENT\n    PROCESSING PROCEDURE XML-HANDLER\nON EXCEPTION\n    MOVE XML-CODE TO WS-ERROR-CODE\nEND-XML\n\n* Generate JSON (Enterprise COBOL 6.3+):\nJSON GENERATE JSON-OUTPUT\n    FROM WS-EMPLOYEE-RECORD\nON EXCEPTION\n    PERFORM JSON-ERROR\nEND-JSON",
        tip: "JSON GENERATE/PARSE in modern Enterprise COBOL eliminates the need for manual string manipulation when integrating with REST APIs and microservices.",
        quizOptions: ["COBOL cannot process XML or JSON", "Enterprise COBOL supports XML PARSE/GENERATE and JSON PARSE/GENERATE for modern service integration", "XML support requires separate purchase", "XML and JSON processing requires CICS"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_023", category: "COBOL", level: "Expert",
        question: "What is the COBOL FUNCTION BYTE-LENGTH and how does it differ from LENGTH OF?",
        answer: "FUNCTION BYTE-LENGTH returns the number of bytes in a data item as a numeric function result. LENGTH OF (special register) returns the length in bytes as a binary value you can use in arithmetic. For fixed-length items they're equivalent. For variable-length (Unicode NATIONAL types) BYTE-LENGTH returns bytes; LENGTH returns characters.",
        code: "01 WS-TEXT     PIC X(20).\n01 WS-UNICODE  PIC N(20).   /* National (Unicode) field */\n01 WS-LEN1     PIC S9(9) COMP.\n01 WS-LEN2     PIC S9(9) COMP.\n\nMOVE LENGTH OF WS-TEXT TO WS-LEN1      /* 20 */\nCOMPUTE WS-LEN2 = FUNCTION BYTE-LENGTH(WS-TEXT) /* 20 */\n\n/* For Unicode: */\nMOVE LENGTH OF WS-UNICODE TO WS-LEN1   /* 20 characters */\nCOMPUTE WS-LEN2 = FUNCTION BYTE-LENGTH(WS-UNICODE) /* 40 bytes */",
        tip: "Use BYTE-LENGTH when passing buffer sizes to system services or C APIs that expect byte counts. Use LENGTH OF for character-based operations.",
        quizOptions: ["BYTE-LENGTH and LENGTH OF are identical", "BYTE-LENGTH returns bytes as a function; LENGTH OF is a special register; they differ for Unicode National fields", "LENGTH OF only works in arithmetic", "BYTE-LENGTH is only for numeric fields"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_024", category: "COBOL", level: "Intermediate",
        question: "What is the difference between OPEN INPUT, OPEN OUTPUT, OPEN I-O, and OPEN EXTEND?",
        answer: "OPEN INPUT opens file for reading only (READ). OPEN OUTPUT creates new file for writing (WRITE) - destroys any existing content. OPEN I-O opens for both reading and updating (READ, REWRITE, DELETE) - file must exist. OPEN EXTEND opens for writing and positions to end - adds records to existing file. Sequential files only.",
        code: "OPEN INPUT  MASTER-FILE     /* Read only */\nOPEN OUTPUT REPORT-FILE     /* Create/write - destroys existing */\nOPEN I-O    EMPLOYEE-VSAM   /* Read and update - must exist */\nOPEN EXTEND AUDIT-LOG       /* Add to end of existing file */\n\n* Check file status after open:\nIF WS-FILE-STATUS NOT = '00'\n    PERFORM OPEN-ERROR-HANDLER\nEND-IF",
        tip: "Always check file status after OPEN. Status '35' means file not found (for INPUT/I-O). Status '00' is success. Never write to OPEN INPUT files - it causes program errors.",
        quizOptions: ["OPEN modes are interchangeable", "INPUT=read only, OUTPUT=create/write, I-O=read+update, EXTEND=append to end; each has specific access restrictions", "OPEN EXTEND creates a new file", "I-O mode is only for VSAM files"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_025", category: "COBOL", level: "Expert",
        question: "How do you implement a proper COBOL error handling framework?",
        answer: "Best practices: (1) Check file status after every I/O operation. (2) Check SQLCODE after every SQL statement. (3) Use a central error handler paragraph called via PERFORM. (4) Write error details to error log with context. (5) Set appropriate RETURN-CODE before terminating. (6) Use ABEND-related utilities (CEE3ABD or equivalent) for serious errors.",
        code: "CHECK-FILE-STATUS.\n    IF WS-FILE-STATUS = '00' CONTINUE\n    ELSE\n        MOVE WS-FILE-STATUS TO WS-ERR-CODE\n        MOVE 'FILE-ERROR' TO WS-ERR-TYPE\n        PERFORM WRITE-ERROR-LOG\n        MOVE 8 TO RETURN-CODE\n        GOBACK\n    END-IF.\n\nWRITE-ERROR-LOG.\n    MOVE CURRENT-DATE TO WS-ERR-TIMESTAMP\n    WRITE ERROR-RECORD FROM WS-ERROR-REC.",
        tip: "Centralize error handling in reusable paragraphs. Include: timestamp, program name, function name, error code, and context data in every error log entry. This dramatically reduces debugging time.",
        quizOptions: ["Error handling is automatic in COBOL", "Proper error framework checks all file/SQL status codes centrally, logs with context, and sets return codes before terminating", "Only database errors need handling", "Error logs are automatically written by the OS"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_026", category: "COBOL", level: "Expert",
        question: "What is the COBOL GLOBAL clause and how does it affect variable visibility?",
        answer: "GLOBAL clause makes a data item visible to all programs called from (nested programs) the program that defines it, including contained programs (nested programs defined with PROGRAM-ID within the main program). Without GLOBAL, variables are local to their defining program. This enables controlled data sharing between nested programs without parameters.",
        code: "IDENTIFICATION DIVISION.\nPROGRAM-ID. MAIN-PROGRAM.\nDATA DIVISION.\nWORKING-STORAGE SECTION.\n01 WS-GLOBAL-COUNTER PIC 9(5) GLOBAL.\n\n* Nested program has access to WS-GLOBAL-COUNTER:\nPROGRAM-ID. NESTED-PROG.\nPROCEDURE DIVISION.\n    ADD 1 TO WS-GLOBAL-COUNTER  /* WORKS - GLOBAL variable */\nEND PROGRAM NESTED-PROG.\n\nEND PROGRAM MAIN-PROGRAM.",
        tip: "Use GLOBAL sparingly as shared state creates tight coupling. Prefer explicit parameter passing for cleaner program interfaces in most cases.",
        quizOptions: ["GLOBAL makes variables system-wide", "GLOBAL makes variables visible to nested contained programs without parameter passing", "GLOBAL is equivalent to EXTERNAL", "GLOBAL only works with level 77 items"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_027", category: "COBOL", level: "Expert",
        question: "What is COBOL's EXTERNAL clause and how does it enable inter-program data sharing?",
        answer: "EXTERNAL clause creates storage that is shared across separately compiled programs running in the same runtime environment (run unit). Programs declare identical EXTERNAL data items independently; the runtime allocates one shared copy. Changes in one program are immediately visible in another. Different from GLOBAL (which is for nested programs).",
        code: "* Program A:\nWORKING-STORAGE SECTION.\n01 SHARED-CONTROL-BLOCK EXTERNAL.\n   05 SCB-STATUS  PIC X(1).\n   05 SCB-COUNTER PIC 9(9).\n\n* Program B (separately compiled - same run unit):\nWORKING-STORAGE SECTION.\n01 SHARED-CONTROL-BLOCK EXTERNAL.\n   05 SCB-STATUS  PIC X(1).\n   05 SCB-COUNTER PIC 9(9).\n/* Both programs access the SAME storage */",
        tip: "EXTERNAL is useful for shared control blocks and statistics counters in complex multi-module applications. Both programs must have identical EXTERNAL data definitions.",
        quizOptions: ["EXTERNAL makes data available system-wide", "EXTERNAL creates shared storage across separately compiled programs in the same run unit", "EXTERNAL requires message queue middleware", "EXTERNAL is the same as GLOBAL"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_028", category: "COBOL", level: "Intermediate",
        question: "How does COBOL handle multi-dimensional tables (arrays) and what are nested OCCURS?",
        answer: "Multi-dimensional tables use nested OCCURS clauses. OCCURS items can contain other OCCURS items. Access uses multiple index/subscript values. Up to 7 dimensions are supported. The INDEXED BY clause defines automatic index variables. Subscripts (WS-I, WS-J) or indexes (ENTRY-IDX) can both be used.",
        code: "01 SALES-MATRIX.\n   05 REGION-ROW OCCURS 10 TIMES INDEXED BY REG-IDX.\n      10 MONTH-COL OCCURS 12 TIMES INDEXED BY MTH-IDX.\n         15 SALES-AMOUNT PIC S9(9)V99 COMP-3.\n\n* Access with indexes:\nSET REG-IDX TO 3   /* Region 3 */\nSET MTH-IDX TO 6   /* June */\nADD WS-SALE TO SALES-AMOUNT(REG-IDX, MTH-IDX)\n\n* Or with subscripts:\nADD WS-SALE TO SALES-AMOUNT(3, 6)",
        tip: "Use INDEXED BY instead of subscripts for multi-dimensional tables accessed in SEARCH statements. Indexes are more efficient than subscript arithmetic.",
        quizOptions: ["COBOL only supports one-dimensional tables", "Multi-dimensional tables use nested OCCURS; up to 7 dimensions with index or subscript access", "OCCURS cannot be nested", "Multi-dimensional tables require VSAM storage"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_029", category: "COBOL", level: "Expert",
        question: "What is the significance of the COBOL 88-level condition name and how can it simplify complex conditions?",
        answer: "Level 88 items declare named conditions (boolean-like values) for their parent field. They can specify single values, ranges (THRU), or multiple values. SET level-88-name TO TRUE moves the first value in its list to the parent. This makes code self-documenting and eliminates magic number comparisons throughout the program.",
        code: "01 WS-TRANSACTION-CODE PIC X(2).\n   88 TC-DEPOSIT     VALUE 'DP'.\n   88 TC-WITHDRAWAL  VALUE 'WD'.\n   88 TC-TRANSFER    VALUE 'TR' 'XF'.\n   88 TC-VALID       VALUE 'DP' 'WD' 'TR' 'XF'.\n\n* Usage:\nIF TC-DEPOSIT\n    PERFORM PROCESS-DEPOSIT\nELSE IF TC-WITHDRAWAL\n    PERFORM PROCESS-WITHDRAWAL\nEND-IF\n\n* SET to TRUE:\nSET TC-DEPOSIT TO TRUE  /* Moves 'DP' to WS-TRANSACTION-CODE */",
        tip: "Define 88-level conditions for every meaningful state of important variables. This dramatically improves code readability and makes bugs easier to find.",
        quizOptions: ["88-level items store numeric values", "88-level items declare named conditions for parent fields; TRUE/FALSE conditions that simplify code readability", "88-level items require special compiler directives", "88 items can only specify single values"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_030", category: "COBOL", level: "Intermediate",
        question: "What is the COBOL ALTER verb and why should it never be used?",
        answer: "ALTER changes the destination of a GO TO statement at runtime. ALTER PARA-A PROCEED TO PARA-B changes a GO TO in PARA-A to jump to PARA-B. This creates dynamic, untraceable control flow that makes debugging almost impossible. ALTER is obsolete, non-structured programming and explicitly prohibited in modern coding standards. Use EVALUATE or PERFORM instead.",
        code: "/* NEVER USE THIS - shown for educational purposes only: */\nGO-TO-PLACE. GO TO PLACEHOLDER-PARA.  /* Will be altered */\n\nSOMEWHERE-IN-CODE.\n    ALTER GO-TO-PLACE PROCEED TO REAL-PROCESSING.\n\n/* MODERN EQUIVALENT: */\nPERFORM VARYING WS-STATE FROM 1 BY 1 UNTIL WS-STATE > 3\n    EVALUATE WS-STATE\n        WHEN 1 PERFORM STATE-ONE-PROCESSING\n        WHEN 2 PERFORM STATE-TWO-PROCESSING\n    END-EVALUATE\nEND-PERFORM",
        tip: "ALTER is listed in COBOL standards as an obsolete element. Any code using ALTER is a maintenance nightmare. Refactor it to EVALUATE or IF-THEN-ELSE structures immediately.",
        quizOptions: ["ALTER is recommended for performance", "ALTER changes GO TO destinations at runtime - it's obsolete, creates untraceable control flow, and should never be used", "ALTER is required for CICS programs", "ALTER is the recommended way to implement state machines"],
        quizAnswerIndex: 1
    },

    // ============ JCL SORT UTILITY QUESTIONS ============
    {
        id: "sort_b2_001", category: "JCL", level: "Beginner",
        question: "What is DFSORT and what are its primary control statement types?",
        answer: "DFSORT (Data Facility Sort) is IBM's high-performance sorting utility for sequential datasets. Primary control statements: SORT (defines sort keys), MERGE (merges pre-sorted files), COPY (copies without sorting), INCLUDE/OMIT (record selection), INREC/OUTREC (field manipulation), SUM (summarization), FIELDS (key specification).",
        code: "//SORTJOB  EXEC PGM=SORT\n//SORTIN   DD DSN=INPUT.DATA,DISP=SHR\n//SORTOUT  DD DSN=OUTPUT.SORTED,DISP=(NEW,CATLG),\n//            SPACE=(CYL,(10,5))\n//SYSOUT   DD SYSOUT=*\n//SYSIN    DD *\n  SORT FIELDS=(1,10,CH,A,11,4,ZD,D)\n/*",
        tip: "DFSORT processes billions of records efficiently. Always specify appropriate REGION and SORTSIZE parameters for large datasets.",
        quizOptions: ["DFSORT only sorts fixed-length records", "DFSORT is IBM's sort utility with SORT, MERGE, COPY, INCLUDE/OMIT, INREC/OUTREC, and SUM statement types", "DFSORT requires COBOL programs", "DFSORT only works with VSAM files"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_002", category: "JCL", level: "Beginner",
        question: "What is the syntax of the DFSORT SORT FIELDS statement?",
        answer: "SORT FIELDS=(start-pos, length, format, order, ...) where: start-pos is byte position (1-based), length is field length in bytes, format is data format (CH=character, ZD=zoned decimal, PD=packed decimal, BI=binary, FI=fixed-point), order is A (ascending) or D (descending). Multiple keys are comma-separated.",
        code: "//SYSIN DD *\n  SORT FIELDS=(1,10,CH,A,        /* Primary key: pos 1, 10 bytes, char, ascending */\n              21,4,PD,D,        /* Secondary: pos 21, 4 bytes, packed, descending */\n              31,2,ZD,A)        /* Tertiary: pos 31, 2 bytes, zoned, ascending */\n/*",
        tip: "Always verify field positions and lengths against your record layout. Off-by-one errors in sort keys cause incorrect ordering that can be hard to detect.",
        quizOptions: ["SORT FIELDS only accepts character format", "SORT FIELDS=(position, length, format, order) with formats: CH, ZD, PD, BI, FI and orders A or D", "Position is zero-based in SORT FIELDS", "SORT FIELDS only supports one sort key"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_003", category: "JCL", level: "Intermediate",
        question: "How do DFSORT INCLUDE and OMIT statements select records?",
        answer: "INCLUDE COND= selects only records that match the condition. OMIT COND= excludes records that match the condition. You cannot use both INCLUDE and OMIT in the same step. Condition syntax: (start,len,format,operator,value) with logical operators AND/OR. Operators: EQ, NE, GT, LT, GE, LE.",
        code: "//SYSIN DD *\n  SORT FIELDS=(1,10,CH,A)\n  INCLUDE COND=(21,2,ZD,GE,50,AND,21,2,ZD,LE,99)\n  /* Include only records where salary range 50-99 */\n\n/* OR using OMIT: */\n  SORT FIELDS=(1,10,CH,A)\n  OMIT COND=(31,1,CH,EQ,C'D')  /* Exclude deleted records */\n/*",
        tip: "INCLUDE is generally preferred over OMIT as it's more explicit about what you want. When filtering large datasets, INCLUDE/OMIT significantly reduces sort time.",
        quizOptions: ["INCLUDE and OMIT can both be used together", "INCLUDE selects matching records; OMIT excludes matching records; only one can be used per step", "INCLUDE is only for PD format fields", "OMIT permanently deletes records from input"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_004", category: "JCL", level: "Intermediate",
        question: "How do DFSORT INREC and OUTREC statements manipulate record fields?",
        answer: "INREC modifies records before sorting. OUTREC reformats records after sorting. Both use FIELDS=(col,len,...) to pick specific fields, or BUILD= for complex reformatting. Can: reorder fields, add padding, insert literals, convert formats. INREC is more efficient as it reduces the data volume being sorted.",
        code: "//SYSIN DD *\n  SORT FIELDS=(1,10,CH,A)\n  OUTREC FIELDS=(1,10,           /* First 10 chars */\n                11,20,           /* Next 20 chars */\n                C'|',            /* Literal separator */\n                41,5,ZD,         /* Zoned decimal field */\n                X'0D0A')         /* Add CR/LF at end */\n/*",
        tip: "Use INREC to extract and reformat key fields before sorting, reducing sort record length and improving performance on large datasets.",
        quizOptions: ["INREC and OUTREC are identical", "INREC modifies records before sorting; OUTREC reformats after sorting; both select/reorder fields and add literals", "INREC can only remove fields", "OUTREC is only for fixed-length records"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_005", category: "JCL", level: "Intermediate",
        question: "How does DFSORT SUM FIELDS statement work for data aggregation?",
        answer: "SUM FIELDS=(pos,len,format) sums numeric fields for duplicate records (records with identical sort keys). After sorting, all consecutive records with the same key have their specified numeric fields summed into one record; other fields take values from the first record. SUM NONE means: keep the first of each group and discard duplicates without summation.",
        code: "//SYSIN DD *\n  SORT FIELDS=(1,10,CH,A)     /* Sort by key */\n  SUM FIELDS=(11,4,ZD,        /* Sum salary field */\n              15,4,ZD)        /* Sum bonus field */\n  /* Result: one record per key with summed amounts */\n\n/* To remove duplicates: */\n  SORT FIELDS=(1,10,CH,A)\n  SUM FIELDS=NONE             /* Keep first, discard rest */\n/*",
        tip: "SUM FIELDS=NONE is a fast way to deduplicate sorted datasets. For financial summarization, always verify that numeric fields use the correct format (ZD, PD).",
        quizOptions: ["SUM adds a new record to the output", "SUM aggregates numeric fields for records with identical sort keys into one record; NONE removes duplicates", "SUM only works with character fields", "SUM requires a separate DFSORT step"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_006", category: "JCL", level: "Expert",
        question: "How do you find the maximum salary using DFSORT?",
        answer: "Multiple approaches: (1) Sort descending on salary, use STOPAFT=1 to output only the first (maximum) record. (2) Use DFSORT SPLICE or ICETOOL MAXIMUM function. (3) Use ICETOOL to compute statistics. STOPAFT=n outputs only the first n records after sorting, making it simple to extract top/bottom n records.",
        code: "/* Method 1: Sort descending, keep first record */\n//MAXSAL   EXEC PGM=SORT\n//SORTIN   DD DSN=EMPLOYEE.DATA,DISP=SHR\n//SORTOUT  DD DSN=MAX.SALARY.RECORD,DISP=(NEW,CATLG)\n//SYSIN    DD *\n  SORT FIELDS=(51,5,ZD,D)  /* Salary at pos 51, descending */\n  STOPAFT COUNT=1           /* Keep only first record */\n\n/* Method 2: Using ICETOOL */\n//ICETOOL  EXEC PGM=ICETOOL\n//TOOLIN   DD *\n  MAXIMUM FROM(EMPLOYEE) TO(MAXOUT) ON(51,5,ZD)\n/*",
        tip: "ICETOOL MAXIMUM/MINIMUM are the cleanest solutions for finding extreme values. STOPAFT with DESC sort is a simpler alternative when ICETOOL isn't available.",
        quizOptions: ["DFSORT cannot find maximum values", "Sort descending on salary field with STOPAFT=1 to get maximum; or use ICETOOL MAXIMUM function", "A COBOL program must be written to find MAX", "DFSORT finds maximum using MAXREC parameter"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_007", category: "JCL", level: "Expert",
        question: "What is ICETOOL and what are its key functions?",
        answer: "ICETOOL is DFSORT's multipurpose utility extending sort capabilities. Key functions: SORT (extended sorting), MERGE (file merging), COPY, SELECT (conditional selection), OCCUR (count occurrences), UNIQUE (unique value counting), RANGE (range checking), MINIMUM, MAXIMUM, STATS (statistics), DISPLAY (formatted output), PIVOT (cross-tabulation), REMAP (format conversion).",
        code: "//ICESTEP  EXEC PGM=ICETOOL\n//TOOLMSG  DD SYSOUT=*\n//DFSMSG   DD SYSOUT=*\n//EMPLOYEE DD DSN=EMPLOYEE.DATA,DISP=SHR\n//STATS    DD SYSOUT=*\n//TOOLIN   DD *\n  STATS FROM(EMPLOYEE) ON(51,5,ZD) -\n        MINIMUM MAXIMUM AVERAGE SUM\n/*",
        tip: "ICETOOL STATS gives you MIN, MAX, AVG, SUM, and COUNT in a single pass, eliminating the need for multiple sort steps or COBOL programs for basic statistics.",
        quizOptions: ["ICETOOL is only for sorting", "ICETOOL extends DFSORT with SORT, MERGE, SELECT, OCCUR, MINIMUM, MAXIMUM, STATS, PIVOT and other functions", "ICETOOL requires a separate product purchase", "ICETOOL only works with VSAM files"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_008", category: "JCL", level: "Expert",
        question: "How do you remove duplicate records using DFSORT?",
        answer: "DFSORT SUM FIELDS=NONE: Sort by the key fields that define uniqueness, then SUM FIELDS=NONE keeps the first record for each unique key. Alternatively, ICETOOLS SELECT FROM...ALLDUPS identifies duplicate records, SELECT FROM...NODUPS keeps only unique records.",
        code: "/* Remove duplicates, keep first occurrence: */\n//DEDUP    EXEC PGM=SORT\n//SORTIN   DD DSN=INPUT.RECORDS,DISP=SHR\n//SORTOUT  DD DSN=DEDUP.OUTPUT,DISP=(NEW,CATLG)\n//SYSIN    DD *\n  SORT FIELDS=(1,10,CH,A,11,5,CH,A)  /* Sort by unique key */\n  SUM FIELDS=NONE                      /* Keep first, drop rest */\n/*\n\n/* Find all duplicates using ICETOOL: */\n//TOOLIN  DD *\n  SELECT FROM(INPUT) TO(DUPS) ALLDUPS ON(1,10,CH)\n/*",
        tip: "SUM FIELDS=NONE is the classic deduplication technique. Use ICETOOL SELECT ALLDUPS to investigate what duplicates exist before deciding which to keep.",
        quizOptions: ["Duplicates cannot be removed with DFSORT", "SUM FIELDS=NONE after sorting removes duplicates keeping first occurrence; ICETOOL SELECT handles more complex cases", "DFSORT must first identify then delete duplicates separately", "Only COBOL programs can deduplicate records"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_009", category: "JCL", level: "Intermediate",
        question: "How do you sort records by second highest salary (rank-based selection)?",
        answer: "Sort descending on salary, then use STOPAFT=2 and SKIPREC=1 to skip the first record (maximum) and keep only the second record. Or use ICETOOL with SPLICE function for sophisticated ranking. Another approach: use two DFSORT steps - first find maximum, then exclude records with that value.",
        code: "/* Get 2nd highest salary: */\n//STEP1    EXEC PGM=SORT\n//SORTIN   DD DSN=EMPLOYEE.DATA,DISP=SHR\n//SORTOUT  DD DSN=SECOND.MAX,DISP=(NEW,CATLG)\n//SYSIN    DD *\n  SORT FIELDS=(51,5,ZD,D)  /* Sort by salary descending */\n  SKIPREC=1                 /* Skip first (max) record */\n  STOPAFT COUNT=1           /* Take next one */\n/*",
        tip: "SKIPREC and STOPAFT are powerful for rank-based selection. For Nth highest value problems, combine them: SKIPREC=N-1, STOPAFT=1.",
        quizOptions: ["Second highest requires a COBOL program", "Sort descending, use SKIPREC=1 to skip first record, STOPAFT=1 to keep second record", "DFSORT cannot do rank-based selection", "Use INCLUDE with a hardcoded value"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_010", category: "JCL", level: "Expert",
        question: "How does DFSORT handle variable-length records (VLR)?",
        answer: "Variable-length records have a 4-byte Record Descriptor Word (RDW) prefix containing the record length. In DFSORT, you must account for the 4-byte RDW when specifying field positions. RDW bytes 1-2 = record length including RDW, bytes 3-4 = zeros. All field positions in SORT/INCLUDE/INREC must add 4 to account for RDW offset.",
        code: "/* Variable-length record sort (VLR): */\n//SYSIN DD *\n  SORT FIELDS=(5,10,CH,A)  /* Pos 5 = actual pos 1 + 4 for RDW */\n  INCLUDE COND=(25,2,ZD,GT,+0)  /* Salary field adjusted for RDW */\n\n/* DFSORT handles RDW automatically if file opened with RECFM=VB */\n/* but field positions must be RDW-adjusted manually */\n/*",
        tip: "VLR processing is a common source of errors. Always check whether field positions in documentation account for the RDW or not, and adjust accordingly.",
        quizOptions: ["DFSORT cannot handle variable-length records", "Variable-length records have a 4-byte RDW prefix; all field positions must add 4 to account for RDW offset", "VLR files are automatically converted to fixed-length", "DFSORT uses a special VLR parameter for adjustment"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_011", category: "JCL", level: "Expert",
        question: "How do you use DFSORT MERGE statement?",
        answer: "MERGE combines multiple pre-sorted files into a single sorted output. Input files must already be sorted in the same order as the merge key. Specify up to 16 input files with SORTINnn DD statements (SORTIN01, SORTIN02, etc.). The MERGE statement is like SORT but for pre-sorted inputs.",
        code: "//MERGEJOB EXEC PGM=SORT\n//SORTIN01 DD DSN=SORTED.FILE.JAN,DISP=SHR\n//SORTIN02 DD DSN=SORTED.FILE.FEB,DISP=SHR\n//SORTIN03 DD DSN=SORTED.FILE.MAR,DISP=SHR\n//SORTOUT  DD DSN=MERGED.OUTPUT,DISP=(NEW,CATLG)\n//SYSIN    DD *\n  MERGE FIELDS=(1,10,CH,A,11,5,ZD,D)\n/*",
        tip: "MERGE is faster than SORT for pre-sorted inputs because it doesn't need to perform the initial sort phase. Ensure all inputs are sorted in the same key order.",
        quizOptions: ["MERGE sorts files before combining", "MERGE combines pre-sorted files (up to 16 with SORTINnn) into one sorted output using the specified key fields", "MERGE only works with two files", "MERGE requires COBOL input procedure"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_012", category: "JCL", level: "Expert",
        question: "How do you compute running totals and subtotals using DFSORT?",
        answer: "DFSORT doesn't directly support running totals in one step. Typical approach: (1) Sort data by group key. (2) Use a COBOL program to compute running totals. Alternatively, ICETOOL SPLICE function can compute subtotals. Another approach: use DFSORT to sort and group, then process with IEBCOMPR for group change detection.",
        code: "/* Sort by department then compute subtotals in COBOL: */\n//STEP1    EXEC PGM=SORT\n//SORTIN   DD DSN=TRANSACTIONS,DISP=SHR\n//SORTOUT  DD DSN=SORTED.TRANS,DISP=(NEW,PASS)\n//SYSIN    DD *\n  SORT FIELDS=(1,5,CH,A,11,4,ZD,A) /* Dept, then date */\n\n//STEP2    EXEC PGM=SUBTOTAL-PROG  /* Custom COBOL for totals */\n//SORTEDIN DD DSN=*.STEP1.SORTOUT,DISP=(OLD,DELETE)",
        tip: "For complex reporting with subtotals and running totals, combine DFSORT (for ordering) with a COBOL program (for computation). ICETOOL SPLICE is an alternative for simpler cases.",
        quizOptions: ["DFSORT SUM computes running totals automatically", "Running totals require DFSORT for sorting plus a COBOL program for computation, or ICETOOL SPLICE for simple cases", "DFSORT TOTAL statement computes running totals", "Only DB2 queries can compute running totals"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_013", category: "JCL", level: "Intermediate",
        question: "How do DFSORT OPTION EQUALS and OPTION NOEQUALS affect sort behavior?",
        answer: "OPTION EQUALS (default) preserves the original relative order of records with equal sort keys (stable sort). OPTION NOEQUALS allows DFSORT to reorder equal-key records for potentially better performance. For data integrity requiring consistent processing order of equal records, always use EQUALS. For pure performance where order of equals doesn't matter, NOEQUALS can be faster.",
        code: "//SYSIN DD *\n  OPTION EQUALS         /* Stable sort - preserves input order for equal keys */\n  SORT FIELDS=(1,10,CH,A)\n/*\n\n//SYSIN DD *\n  OPTION NOEQUALS       /* May reorder equal-key records for performance */\n  SORT FIELDS=(1,10,CH,A)\n/*",
        tip: "Always use OPTION EQUALS when sort results feed into programs that depend on processing order (e.g., first-match logic). NOEQUALS is an optimization only when order truly doesn't matter.",
        quizOptions: ["EQUALS and NOEQUALS are identical", "EQUALS preserves input order for equal-key records (stable sort); NOEQUALS allows reordering for performance", "NOEQUALS is always faster", "EQUALS is required for all DFSORT operations"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_014", category: "JCL", level: "Expert",
        question: "How do you use DFSORT to convert data formats (ZD to PD, date reformatting, etc.)?",
        answer: "DFSORT OUTREC FIELDS can convert between formats using conversion operators: TO=PD converts to packed decimal, TO=ZD converts to zoned decimal, TO=BI converts to binary, TO=CH converts to character. Date reformatting uses EDIT or explicit position manipulation. FINDREP function finds and replaces patterns in character fields.",
        code: "//SYSIN DD *\n  SORT FIELDS=(1,10,CH,A)\n  OUTREC BUILD=(1,10,           /* Keep key field */\n               21,5,ZD,TO=PD,LENGTH=3,  /* ZD to PD conversion */\n               31,8,CH,Y2T=CCYYDDD,     /* Date format conversion */\n               C' ')\n/*",
        tip: "OUTREC format conversion is much faster than COBOL for simple transformations. Avoid writing COBOL programs just for format conversion when DFSORT can do it directly.",
        quizOptions: ["DFSORT cannot convert data formats", "OUTREC FIELDS with TO= parameter converts between ZD, PD, BI, CH formats in a single sort step", "Format conversion requires separate COBOL programs", "Only INREC can do format conversion"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_015", category: "JCL", level: "Expert",
        question: "What is DFSORT's JOINKEYS function and how does it perform file matching?",
        answer: "JOINKEYS allows DFSORT to join two datasets based on a common key field without a COBOL program. It reads both files, sorts them internally by the join key, and matches records. REFORMAT statement defines the output record structure. JOIN UNPAIRED options control handling of non-matching records (ONLY, F1/F2 options).",
        code: "//SORTSTEP EXEC PGM=SORT\n//SORTJNF1 DD DSN=EMPLOYEE.MASTER,DISP=SHR     /* File 1 */\n//SORTJNF2 DD DSN=DEPARTMENT.TABLE,DISP=SHR    /* File 2 */\n//SORTOUT  DD DSN=JOINED.OUTPUT,DISP=(NEW,CATLG)\n//SYSIN    DD *\n  JOINKEYS F1=SORTJNF1,FIELDS=(1,5,A)  /* Join on dept code */\n  JOINKEYS F2=SORTJNF2,FIELDS=(1,5,A)\n  JOIN UNPAIRED,F1\n  REFORMAT FIELDS=(F1:1,80,F2:6,20)    /* Combine fields */\n/*",
        tip: "JOINKEYS replaces many COBOL match-merge programs. It's significantly faster and simpler for straightforward file joining operations.",
        quizOptions: ["JOINKEYS is only for merging sorted files", "JOINKEYS joins two datasets on a common key with REFORMAT defining output, replacing complex COBOL match programs", "JOINKEYS requires both files to be pre-sorted", "JOINKEYS only supports inner joins"],
        quizAnswerIndex: 1
    },

    // ============ MORE COBOL QUESTIONS ============
    {
        id: "cobol_b2_031", category: "COBOL", level: "Intermediate",
        question: "How does COBOL ACCEPT verb work for reading user input and date/time?",
        answer: "ACCEPT reads from SYSIN (or terminal) into a data item. For batch: ACCEPT from SYSIN reads operator-entered data. ACCEPT identifier FROM DATE gives YYMMDD, FROM DATE YYYYMMDD gives 8-digit year (Y2K-safe), FROM TIME gives HHMMSSCC (centiseconds), FROM DAY gives YYDDD (Julian), FROM COMMAND-LINE reads command arguments.",
        code: "ACCEPT WS-DATE FROM DATE YYYYMMDD     /* 20260606 */\nACCEPT WS-TIME FROM TIME              /* HHMMSSCC */\nACCEPT WS-DAY  FROM DAY              /* YYDDD */\nACCEPT WS-USER-INPUT FROM SYSIN      /* Read from JCL SYSIN DD */\nACCEPT WS-ENV-VAR FROM ENVIRONMENT 'MY_VAR'  /* Environment variable */",
        tip: "Always use FROM DATE YYYYMMDD instead of FROM DATE. The 4-digit year version is Y2K-safe. Use FUNCTION CURRENT-DATE for a single statement that returns date, time, and UTC offset.",
        quizOptions: ["ACCEPT only reads from terminals", "ACCEPT reads user input or system date/time with variants: FROM DATE YYYYMMDD, FROM TIME, FROM DAY for batch programs", "ACCEPT is only for interactive programs", "ACCEPT requires special compiler options"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_032", category: "COBOL", level: "Expert",
        question: "What is COBOL's DISPLAY verb behavior and its output routing?",
        answer: "DISPLAY writes to SYSOUT (default) or a specified destination. In batch: DISPLAY output goes to SYSOUT DD statement. DISPLAY...UPON CONSOLE writes to operator console. DISPLAY...UPON SYSERR writes to SYSOUT * (error output). In CICS, DISPLAY causes issues as there's no SYSOUT - use EXEC CICS WRITEQ TD or WTO instead.",
        code: "DISPLAY 'Error: ' WS-ERROR-MSG UPON SYSERR\nDISPLAY 'Process complete. Records: ' WS-COUNT\nDISPLAY 'URGENT: ' WS-ALERT UPON CONSOLE  /* Goes to operator */\n\n/* Avoid in CICS - use instead: */\nEXEC CICS WRITEQ TD QUEUE('CSMT')\n    FROM(WS-MSG)\n    LENGTH(WS-MSG-LEN)\nEND-EXEC",
        tip: "Excessive DISPLAY statements impact performance. In production, control debug output with a DEBUG-FLAG variable and only DISPLAY when debugging is enabled.",
        quizOptions: ["DISPLAY always writes to a printer", "DISPLAY writes to SYSOUT by default; UPON CONSOLE writes to operator console; UPON SYSERR goes to error output", "DISPLAY is not available in COBOL", "DISPLAY requires CICS in online programs"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_033", category: "COBOL", level: "Expert",
        question: "How does COBOL interact with system macros using EXEC calls?",
        answer: "COBOL calls system macros and APIs via CALL statements to assembler routines. Common system calls: CALL 'CEEGTST' for LE storage allocation, CALL 'CEEMOUT' for message formatting, CALL 'CEEDATM' for date manipulation. Platform-specific: CALL 'SYSDATE' for date services. LE (Language Environment) Runtime Services provide portable APIs.",
        code: "* Allocate LE storage:\nCALL 'CEEGTST' USING WS-CELL-SIZE\n                     WS-CELL-ADDRESS\n                     WS-FEEDBACK-CODE\n\n* Format message:\nCALL 'CEEMOUT' USING WS-MESSAGE\n                     WS-DEST-CODE\n                     WS-FEEDBACK-CODE",
        tip: "Use Language Environment (LE) runtime services rather than z/OS macros directly. LE services are portable, tested, and supported across Enterprise COBOL versions.",
        quizOptions: ["COBOL cannot call system routines", "COBOL calls system APIs via CALL statements to LE runtime services like CEEGTST, CEEMOUT, and CEEDATM", "System calls require assembler inserts", "COBOL only calls other COBOL programs"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_034", category: "COBOL", level: "Intermediate",
        question: "What is the COBOL FILE SECTION FD vs SD entry and when is each used?",
        answer: "FD (File Description) defines regular sequential, indexed, or relative files for READ/WRITE operations. SD (Sort Description) defines sort work files used specifically with the SORT verb's INPUT/OUTPUT PROCEDUREs. SD files are special internal files managed by the SORT verb. You cannot perform regular READ/WRITE on SD files.",
        code: "FILE SECTION.\nFD EMPLOYEE-FILE                    /* Regular file */\n   RECORDING MODE F\n   BLOCK CONTAINS 0 RECORDS\n   RECORD CONTAINS 80 CHARACTERS.\n01 EMPLOYEE-RECORD PIC X(80).\n\nSD SORT-WORK-FILE                   /* Sort work file */\n   RECORD CONTAINS 80 CHARACTERS.\n01 SORT-WORK-RECORD PIC X(80).",
        tip: "SD files are only used with the SORT verb. Never try to OPEN/CLOSE/READ/WRITE an SD file directly - it causes compilation errors.",
        quizOptions: ["FD and SD are identical declarations", "FD describes regular I/O files; SD describes sort work files used exclusively with the SORT verb's procedures", "SD files are faster than FD files", "SD files require VSAM allocation"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_035", category: "COBOL", level: "Expert",
        question: "What are the COBOL compiler options that most significantly impact program behavior?",
        answer: "Critical compiler options: TRUNC(STD/OPT/BIN) controls numeric truncation. NUMPROC(PFD/NOPFD) controls sign handling. ARITH(EXTEND/COMPAT) controls maximum digits (31 vs 18). OPTIMIZE(FULL/STD/0) controls optimization level. CICS(YES/NO) enables CICS preprocessor. SQL(YES/NO) enables DB2 precompiler. THREAD controls thread-safety. DATA(24/31/ANY) controls storage location.",
        code: "/* Common production compiler options: */\n//COBCOMP EXEC IGYWCL,PARM.COBOL='TRUNC(OPT),NUMPROC(PFD),\n// ARITH(EXTEND),OPTIMIZE(FULL),RENT,APOST,CICS(YES)'",
        tip: "TRUNC(OPT) improves performance but assumes correct numeric data. Use TRUNC(STD) during testing to catch data issues. RENT creates reentrant code required for CICS.",
        quizOptions: ["Compiler options don't affect runtime behavior", "TRUNC, NUMPROC, ARITH, OPTIMIZE, CICS, SQL options significantly impact truncation, performance, and interface handling", "Compiler options are documentation only", "Only OPTIMIZE affects program performance"],
        quizAnswerIndex: 1
    },

    // ============ MORE SORT QUESTIONS ============
    {
        id: "sort_b2_016", category: "JCL", level: "Expert",
        question: "How do you use DFSORT to count records and compute statistics without a COBOL program?",
        answer: "ICETOOL OCCUR function counts occurrences of unique values in a field. STATS function computes MIN, MAX, AVG, SUM, COUNT in one pass. DISPLAY function creates formatted reports. These eliminate the need for COBOL programs for basic statistics and reporting.",
        code: "//ICESTEP EXEC PGM=ICETOOL\n//TOOLMSG DD SYSOUT=*\n//EMP     DD DSN=EMPLOYEE.DATA,DISP=SHR\n//REPORT  DD SYSOUT=*\n//TOOLIN  DD *\n  STATS FROM(EMP) TO(REPORT) -\n        ON(51,5,ZD)           -  /* Salary field */\n        TITLE('SALARY STATISTICS') -\n        MINIMUM MAXIMUM AVERAGE SUM DIGITS(10)\n  OCCUR FROM(EMP) TO(REPORT) ON(1,3,CH) TITLE('DEPT COUNTS')\n/*",
        tip: "ICETOOL statistics eliminate entire COBOL programs for reporting. Schedule ICETOOL steps as part of your daily batch to generate operational reports automatically.",
        quizOptions: ["Statistics require COBOL programs", "ICETOOL STATS computes MIN/MAX/AVG/SUM/COUNT; OCCUR counts unique values - no COBOL program needed", "Statistics are only available in DB2", "DFSORT REPORT statement handles all statistics"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_017", category: "JCL", level: "Intermediate",
        question: "How does DFSORT OPTION LOCALE handle multi-language and special character sorting?",
        answer: "OPTION LOCALE specifies a locale for collating sequence. Different locales sort accented characters and special characters differently. For international applications with non-English data, specifying the correct locale ensures proper alphabetical ordering according to the language's rules.",
        code: "//SYSIN DD *\n  OPTION LOCALE='En_US'         /* English US locale */\n  SORT FIELDS=(1,30,CH,A)       /* Sort names correctly */\n\n/* For European languages: */\n  OPTION LOCALE='De_DE'         /* German locale */\n  SORT FIELDS=(1,30,CH,A)       /* Correct German umlaut ordering */\n/*",
        tip: "Locale-aware sorting is critical for international applications. Without proper locale, 'Ö' might sort incorrectly relative to other characters in German names.",
        quizOptions: ["LOCALE is only for Unicode files", "OPTION LOCALE specifies collating sequence for correct sorting of multi-language and special characters", "All sorts use the same collating order", "LOCALE is only available in DFSORT 2.0+"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_018", category: "JCL", level: "Expert",
        question: "How do you use DFSORT to join employee and department tables, creating a report?",
        answer: "Use JOINKEYS to join employee file (F1) with department lookup table (F2) on department code. REFORMAT builds the combined output record. INCLUDE selects only active employees. OUTREC formats the output for reporting. This entire operation runs in a single JCL step without COBOL.",
        code: "//SORTSTEP EXEC PGM=SORT\n//SORTJNF1 DD DSN=EMPLOYEE.FILE,DISP=SHR      /* F1: Employee data */\n//SORTJNF2 DD DSN=DEPARTMENT.TABLE,DISP=SHR  /* F2: Dept lookup */\n//SORTOUT  DD DSN=EMP.DEPT.REPORT,DISP=(NEW,CATLG)\n//SYSIN    DD *\n  JOINKEYS F1=SORTJNF1,FIELDS=(6,3,A)   /* Join on dept code (pos 6) */\n  JOINKEYS F2=SORTJNF2,FIELDS=(1,3,A)   /* Join on dept code (pos 1) */\n  INCLUDE COND=(F1:51,1,CH,EQ,C'A')     /* Active employees only */\n  JOIN UNPAIRED,F1                        /* Include unmatched F1 records */\n  REFORMAT FIELDS=(F1:1,5,              /* Emp ID */\n                   F1:11,20,            /* Emp Name */\n                   F2:4,20,             /* Dept Name */\n                   F1:51,5,ZD)          /* Salary */\n  SORT FIELDS=(21,20,CH,A)              /* Sort by dept name */\n/*",
        tip: "JOINKEYS with REFORMAT can replace entire COBOL match-merge programs. For production use, validate the join cardinality (1-to-1 vs 1-to-many) and choose JOIN UNPAIRED options accordingly.",
        quizOptions: ["Department joins require a DB2 query", "JOINKEYS joins employee and department files on dept code with REFORMAT building combined output and SORT ordering", "File joining cannot be done without COBOL", "JOINKEYS only supports two-file inner joins"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_019", category: "JCL", level: "Expert",
        question: "What is the DFSORT WHEN=ONLY clause and how does it enable conditional processing?",
        answer: "OUTREC WHEN=(condition,FIELDS=...) processes records differently based on conditions. Multiple WHEN clauses create conditional output formatting. WHEN=ONLY applies to records matching the condition. This allows a single sort step to create multiple output formats based on record type or content.",
        code: "//SYSIN DD *\n  SORT FIELDS=(1,10,CH,A)\n  OUTREC FIELDS=(WHEN=(1,1,CH,EQ,C'E',  /* When record type = Employee */\n                       1,80),            /* Output entire record */\n                WHEN=(1,1,CH,EQ,C'M',   /* When record type = Manager */\n                       1,10,             /* Output first 10 chars */\n                       C'*MANAGER*',    /* Append literal */\n                       11,70),\n                WHEN=NONE,              /* Default */\n                       1,80)\n/*",
        tip: "WHEN=ONLY is powerful for multi-record-type files common in legacy mainframe systems. It avoids splitting files into types before processing.",
        quizOptions: ["WHEN=ONLY requires multiple DFSORT steps", "OUTREC WHEN= creates conditional output formatting, processing different record types differently in a single step", "WHEN is only for INCLUDE statements", "Conditional processing requires COBOL programs"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_020", category: "JCL", level: "Expert",
        question: "How do you use DFSORT SPLICE for de-grouping and look-ahead operations?",
        answer: "ICETOOL SPLICE combines records from two sorted datasets, appending fields from one dataset to matching records in another. It's used for: lookup table joins (without JOINKEYS), adding master data to transaction records, appending summary totals to detail records. SPLICE requires both inputs sorted by the join key.",
        code: "//ICESTEP EXEC PGM=ICETOOL\n//TOOLMSG DD SYSOUT=*\n//MASTER  DD DSN=SORTED.MASTER,DISP=SHR\n//DETAIL  DD DSN=SORTED.DETAIL,DISP=SHR\n//OUTPUT  DD DSN=ENRICHED.DETAIL,DISP=(NEW,CATLG)\n//TOOLIN  DD *\n  SPLICE FROM(DETAIL) TO(OUTPUT) ON(1,5,CH) WITH(MASTER)\n        USING(CTL1)\n/*",
        tip: "SPLICE is the ICETOOL equivalent of a database lookup join. It's simpler than JOINKEYS for appending lookup data and more flexible for complex enrichment scenarios.",
        quizOptions: ["SPLICE merges unsorted files", "ICETOOL SPLICE combines sorted datasets by appending fields from a lookup dataset to matching records in the main dataset", "SPLICE requires a COBOL input procedure", "SPLICE only works with fixed-length records"],
        quizAnswerIndex: 1
    },

    // ============ MORE COMPLEX SORT SCENARIOS ============
    {
        id: "sort_b2_021", category: "JCL", level: "Expert",
        question: "How do you use DFSORT to get top N employees by salary per department?",
        answer: "This requires multiple steps: (1) Sort by department (ascending) then salary (descending). (2) Use ICETOOL SPLICE or a COBOL program to number records within each department group. (3) Select records with rank <= N. Alternative: Use ICETOOL with a custom TOOLIN specification using WHEN conditions.",
        code: "/* Step 1: Sort by dept, then salary desc */\n//SORT1    EXEC PGM=SORT\n//SORTIN   DD DSN=EMPLOYEE.DATA,DISP=SHR\n//SORTOUT  DD DSN=&&SORTED,DISP=(NEW,PASS)\n//SYSIN    DD *\n  SORT FIELDS=(1,3,CH,A,    /* Department */\n              51,5,ZD,D)    /* Salary descending */\n/* Step 2: Rank within department (requires COBOL) */\n//RANK     EXEC PGM=EMP-RANKER  /* Custom COBOL ranker */",
        tip: "For top-N per group, the most reliable approach is DFSORT for ordering plus a simple COBOL program for group ranking. ICETOOL can handle simpler variants.",
        quizOptions: ["Top N per group is impossible with DFSORT", "Sort by dept/salary then use COBOL for group ranking, or multi-step ICETOOL approach for simpler cases", "Use STOP COND to select top N", "Only SQL can solve top-N per group problems"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_022", category: "JCL", level: "Intermediate",
        question: "What is DFSORT OPTION VLSHRT and when is it needed?",
        answer: "VLSHRT (variable-length short) handles variable-length records that may be shorter than the key field definition. Without VLSHRT, records shorter than the key end position are rejected as errors. With VLSHRT, short records are padded and processed. Useful when dealing with inconsistently-formatted legacy files.",
        code: "//SYSIN DD *\n  OPTION VLSHRT                /* Handle short VLR records */\n  SORT FIELDS=(5,20,CH,A)     /* Key may extend beyond short records */\n/*\n\n/* Without VLSHRT, records shorter than 24 bytes would cause error */",
        tip: "VLSHRT is a safety net for poorly formatted files. Better practice is to validate and standardize record lengths before sorting.",
        quizOptions: ["VLSHRT makes records variable-length", "VLSHRT handles variable-length records shorter than the key field, padding them instead of rejecting them", "VLSHRT is required for all VLR sorts", "VLSHRT converts short records to fixed-length"],
        quizAnswerIndex: 1
    },

    // Adding more questions to reach our target
    {
        id: "sort_b2_023", category: "JCL", level: "Expert",
        question: "How do you use DFSORT to create a sorted summary report with group totals?",
        answer: "Use SORT to order data, SUM to aggregate numeric fields within groups. For formatted reports with subtotals, combine SORT+SUM with ICETOOL DISPLAY or use OUTREC HEADER/TRAILER processing. SECTIONS in OUTREC can add group headers and trailers automatically.",
        code: "//SYSIN DD *\n  SORT FIELDS=(1,3,CH,A)      /* Sort by department */\n  SUM FIELDS=(11,5,ZD,         /* Sum salaries */\n              16,5,ZD)         /* Sum bonuses */\n  /* Output: one summary record per department */\n\n/* Using ICETOOL for formatted report: */\n//TOOLIN DD *\n  DISPLAY FROM(SORTED) LIST(REPORT)\n    HEADER('DEPT SALARY REPORT')\n    DATE2,TIME2\n    ON(1,3,CH)    HEADER('DEPT')\n    ON(11,5,ZD)   HEADER('SALARY')  EDIT(III,IIV.99)\n/*",
        tip: "ICETOOL DISPLAY creates formatted reports with headers, footers, and column headings. Combine with DATE2/TIME2 for automatically dated reports.",
        quizOptions: ["Summary reports require report writer tools", "SORT+SUM creates group summaries; ICETOOL DISPLAY formats them into professional reports with headers", "Group totals require a COBOL program always", "DFSORT REPORT statement handles all formatting"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_024", category: "JCL", level: "Beginner",
        question: "What is STOPAFT and SKIPREC in DFSORT and when are they used?",
        answer: "STOPAFT=n stops processing after n output records have been produced. SKIPREC=n skips the first n input records before processing begins. Combined, they implement pagination and sampling: SKIPREC=100, STOPAFT=50 skips first 100 records and outputs the next 50. Useful for testing (process only first N records) and record sampling.",
        code: "//SYSIN DD *\n  SORT FIELDS=(1,10,CH,A)\n  STOPAFT COUNT=100   /* Process only first 100 records output */\n/*\n\n/* Get records 201-300 from sorted file: */\n  SORT FIELDS=(1,10,CH,A)\n  SKIPREC COUNT=200\n  STOPAFT COUNT=100\n/*",
        tip: "Use STOPAFT=1000 during testing to process a sample of a large production file without running the entire dataset, saving time and resources.",
        quizOptions: ["STOPAFT limits input file size", "STOPAFT limits output records; SKIPREC skips initial records; together they implement pagination and sampling", "SKIPREC deletes records from the input file", "They are only available in ICETOOL"],
        quizAnswerIndex: 1
    },
    {
        id: "sort_b2_025", category: "JCL", level: "Expert",
        question: "How do you use DFSORT to pad records to a standard length?",
        answer: "OUTREC FIELDS=(1,80,80X) pads record with 80 spaces after the existing content. LENGTH= parameter in OUTREC specifies target output length. For converting shorter records to standard length: OUTREC BUILD=(1,n,TRAN=LTOU,OVERLAY=(n+1:80X)) adds spaces. This is essential when feeding data to fixed-length programs.",
        code: "//SYSIN DD *\n  SORT FIELDS=COPY          /* Just copy, no sort */\n  OUTREC FIELDS=(1,50,      /* Keep first 50 bytes */\n                 30X)        /* Add 30 spaces to pad to 80 */\n\n/* Or use LENGTH= to ensure exact output length: */\n  OUTREC FIELDS=(1,50),LENGTH=80  /* Pad with spaces to 80 */\n/*",
        tip: "Record padding is essential when legacy programs expect fixed-length records but input files have variable lengths. Always verify the padded length matches the receiving program's LRECL.",
        quizOptions: ["DFSORT cannot change record lengths", "OUTREC FIELDS with X (space) padding or LENGTH= parameter pads records to standard length", "Only IEBGENER can pad records", "Record padding requires a COBOL program"],
        quizAnswerIndex: 1
    },

    // Additional COBOL questions
    {
        id: "cobol_b2_036", category: "COBOL", level: "Expert",
        question: "What is the COBOL CANCEL statement and when should you use it?",
        answer: "CANCEL releases the memory occupied by a dynamically-called program, forcing the next CALL to reload it fresh (re-initializing all Working Storage values). Without CANCEL, a dynamic call reuses the previously loaded program with its current state. CANCEL is needed when: (1) Testing programs that initialize on first call, (2) Processing that requires fresh state for each transaction.",
        code: "/* Process multiple transactions, each needing fresh program state: */\nPERFORM VARYING WS-IDX FROM 1 BY 1\n    UNTIL WS-IDX > WS-TRANS-COUNT\n    CALL 'TRANSMOD' USING TRANS-RECORD(WS-IDX)\n    CANCEL 'TRANSMOD'   /* Force re-initialize for next call */\nEND-PERFORM",
        tip: "CANCEL has a performance cost (module reload overhead). Design programs to explicitly handle re-initialization rather than relying on CANCEL for routine processing.",
        quizOptions: ["CANCEL terminates the COBOL program", "CANCEL releases a dynamically-called program from memory, forcing the next CALL to reload it fresh with reinitialized Working Storage", "CANCEL is only for CICS programs", "CANCEL clears Working Storage of the calling program"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_037", category: "COBOL", level: "Expert",
        question: "How does the COBOL WHEN-COMPILED special register differ from checking compilation date at runtime?",
        answer: "WHEN-COMPILED is a special register containing the date and time the program was compiled. It's fixed at compile time as a literal value in the load module. Unlike CURRENT-DATE which gives runtime date, WHEN-COMPILED gives the program's age. Useful for version tracking and auditing which version of a program is running.",
        code: "01 WS-COMPILE-INFO PIC X(16).\n01 WS-CURRENT-DATE  PIC X(21).\n\nMOVE WHEN-COMPILED TO WS-COMPILE-INFO\nMOVE FUNCTION CURRENT-DATE TO WS-CURRENT-DATE\n\nDISPLAY 'Compiled: ' WS-COMPILE-INFO\nDISPLAY 'Running:  ' WS-CURRENT-DATE",
        tip: "Include WHEN-COMPILED in your program's startup DISPLAY to automatically log which version is executing. This helps track down version-related issues in production.",
        quizOptions: ["WHEN-COMPILED gives the current date", "WHEN-COMPILED is fixed at compile time showing compilation date/time; CURRENT-DATE gives runtime date/time", "They are identical for new programs", "WHEN-COMPILED requires special runtime initialization"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_038", category: "COBOL", level: "Expert",
        question: "What is COBOL's SECTION structure in the PROCEDURE DIVISION and how does it affect paragraph scope?",
        answer: "SECTIONS group related paragraphs in the PROCEDURE DIVISION. A PERFORM section-name executes all paragraphs within that section until the next section header or end of division. SECTIONS can contain DECLARATIVES. A PERFORM exits the section after the last paragraph. Without sections, PERFORM paragraph-name THRU paragraph-name is used to execute multiple paragraphs.",
        code: "PROCEDURE DIVISION.\n\nINITIALIZATION SECTION.\n    OPEN-FILES.\n        OPEN INPUT MASTER-FILE OUTPUT REPORT.\n    LOAD-TABLES.\n        PERFORM LOAD-RATE-TABLE.\n\nMAIN-PROCESSING SECTION.\n    PROCESS-RECORDS.\n        PERFORM READ-AND-PROCESS UNTIL WS-EOF = 'Y'.\n\n/* PERFORM INITIALIZATION SECTION executes both paragraphs */",
        tip: "Sections can create subtle bugs if a PERFORM falls through to the next section unexpectedly. Modern COBOL style uses explicit PERFORM with scope terminators rather than SECTIONs.",
        quizOptions: ["SECTIONS are identical to paragraphs", "SECTIONS group paragraphs; PERFORM section executes all paragraphs until the next SECTION header", "SECTIONS only work in the DECLARATIVES area", "SECTIONS are obsolete and not supported"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_039", category: "COBOL", level: "Intermediate",
        question: "What is the COBOL CONFIGURATION SECTION and what goes in it?",
        answer: "CONFIGURATION SECTION in ENVIRONMENT DIVISION contains: SOURCE-COMPUTER (computer where program is compiled), OBJECT-COMPUTER (where it runs), SPECIAL-NAMES (maps EBCDIC special characters, currency symbol, decimal point notation, conditional switches, alphabet specifications), REPOSITORY (class/interface names in OO COBOL).",
        code: "ENVIRONMENT DIVISION.\nCONFIGURATION SECTION.\n    SOURCE-COMPUTER. IBM-MAINFRAME.\n    OBJECT-COMPUTER. IBM-MAINFRAME.\n    SPECIAL-NAMES.\n        CURRENCY SIGN IS '$'\n        DECIMAL-POINT IS COMMA       /* European decimal notation */\n        CONSOLE IS CRT-DEVICE\n        C01 IS PAGE-TOP\n        ALPHABET MY-ALPHA IS STANDARD-1.",
        tip: "DECIMAL-POINT IS COMMA changes the meaning of period and comma in numeric literals - '1.234,56' means 1234.56. Critical to set correctly for European financial applications.",
        quizOptions: ["CONFIGURATION SECTION is in DATA DIVISION", "CONFIGURATION SECTION in ENVIRONMENT DIVISION defines SOURCE-COMPUTER, OBJECT-COMPUTER, and SPECIAL-NAMES for currency, decimal, and character specifications", "It's optional and ignored by compilers", "CONFIGURATION SECTION only sets debug options"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_040", category: "COBOL", level: "Expert",
        question: "How does the COBOL RETURNING phrase differ from using LINKAGE SECTION for returning values?",
        answer: "RETURNING in PROCEDURE DIVISION USING...RETURNING defines a function-like return value. The calling program receives the return value after CALL...RETURNING. Linkage Section parameters require the caller to pass a receiving field explicitly. RETURNING is more readable for function-like subprograms with a single return value.",
        code: "/* Subprogram using RETURNING: */\nIDENTIFICATION DIVISION.\nPROGRAM-ID. CALCULATE-TAX.\nDATA DIVISION.\nLINKAGE SECTION.\n01 LK-SALARY  PIC S9(9)V99 COMP-3.\n01 LK-TAX     PIC S9(9)V99 COMP-3.  /* Return value */\nPROCEDURE DIVISION USING LK-SALARY RETURNING LK-TAX.\n    COMPUTE LK-TAX = LK-SALARY * 0.30\n    GOBACK.\n\n/* Calling program: */\nCALL 'CALCULATE-TAX' USING WS-SALARY RETURNING WS-TAX",
        tip: "Use RETURNING for utility-style subprograms that compute and return a single value. It makes the interface's intent clearer than passing a receive-parameter by reference.",
        quizOptions: ["RETURNING is identical to Linkage Section parameters", "RETURNING defines a function-like return value, making the subprogram interface clearer than explicit receive-field parameters", "RETURNING only works with numeric values", "RETURNING is only for CICS programs"],
        quizAnswerIndex: 1
    },

    // More COBOL expert questions
    {
        id: "cobol_b2_041", category: "COBOL", level: "Expert",
        question: "What are COBOL File Status codes 41, 42, 43, 46, 47, and 48?",
        answer: "File Status codes for specific errors: 41=Open attempted on open file, 42=Close attempted on closed file, 43=Rewrite without prior successful read (sequential), 46=Read attempted at EOF or before required READ, 47=READ on file opened as OUTPUT/EXTEND, 48=WRITE on file opened as INPUT. These indicate programming logic errors that need immediate correction.",
        code: "OPEN OUTPUT MASTER-FILE.  /* Opens file */\nOPEN OUTPUT MASTER-FILE.  /* Status 41! Already open */\n\nREAD SEQFILE AT END MOVE 'Y' TO EOF.\nREAD SEQFILE AT END MOVE 'Y' TO EOF.  /* After EOF - Status 46! */\n\n/* Always check status after every I/O operation! */\nIF WS-FILE-STATUS NOT = '00' AND NOT = '10'\n    PERFORM IO-ERROR-HANDLER",
        tip: "Status codes 41-48 indicate programming errors, not data errors. They should never occur in production code. If they do, fix the program logic, don't handle them with error recovery.",
        quizOptions: ["These codes indicate normal processing", "41=double open, 42=double close, 43=rewrite without read, 46=read past EOF, 47=read on output file, 48=write on input file", "These codes only occur with VSAM files", "Status 41-48 are warnings not errors"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_042", category: "COBOL", level: "Intermediate",
        question: "What is the COBOL RECORD VARYING DEPENDING ON clause for variable-length records?",
        answer: "RECORD CONTAINS minimum TO maximum CHARACTERS DEPENDING ON data-name declares variable-length record format. The data-name holds the actual length of the current record. On READ, the system sets the data-name to the actual record length. On WRITE, use the data-name to specify how many bytes to write.",
        code: "FD VARIABLE-FILE\n   RECORDING MODE V\n   RECORD CONTAINS 10 TO 200 CHARACTERS\n   DEPENDING ON WS-RECORD-LENGTH.\n\n01 VARIABLE-RECORD PIC X(200).\n\n/* Read variable record: */\nREAD VARIABLE-FILE INTO WS-WORK-AREA\n/* WS-RECORD-LENGTH now contains actual length of record read */\nDISPLAY 'Record length: ' WS-RECORD-LENGTH",
        tip: "Variable-length records are common in mainframe files. Always use DEPENDING ON to correctly handle the variable portion rather than processing full maximum-length records.",
        quizOptions: ["DEPENDING ON is only for table sizes", "RECORD VARYING DEPENDING ON declares variable-length records; the DEPENDING ON field holds actual record length", "Variable records always require maximum length processing", "DEPENDING ON is only for VSAM files"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_043", category: "COBOL", level: "Expert",
        question: "How do you implement a COBOL program that interfaces with z/OS Unix System Services?",
        answer: "COBOL programs interface with USS (Unix System Services) using: CALL 'BPX1OPN' to open Unix files, CALL 'BPX1RED' to read, CALL 'BPX1WRT' to write, CALL 'BPX1CLO' to close. Enterprise COBOL 6.3+ supports native file I/O for USS files using SELECT...ASSIGN TO /path/to/file. Programs must run in POSIX environment.",
        code: "* Enterprise COBOL 6.3+ direct USS access:\nENVIRONMENT DIVISION.\n    FILE-CONTROL.\n        SELECT UNIX-FILE ASSIGN TO '/u/myuser/data.txt'\n        ORGANIZATION IS LINE SEQUENTIAL.\n\n* Read Unix text file:\nOPEN INPUT UNIX-FILE\nREAD UNIX-FILE INTO WS-UNIX-LINE AT END ...",
        tip: "Modern hybrid mainframe applications often need to interact with USS file systems for container orchestration and DevOps pipelines. Enterprise COBOL 6.3+ makes this straightforward.",
        quizOptions: ["COBOL cannot access Unix files", "COBOL accesses USS files via BPX1xxx system calls or directly with ASSIGN TO /unix/path in Enterprise COBOL 6.3+", "USS access requires assembler programs", "Unix file access requires CICS"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_044", category: "COBOL", level: "Expert",
        question: "What is COBOL thread safety and how does the THREAD compiler option affect it?",
        answer: "Thread-safe COBOL programs can be called from multiple threads simultaneously. The THREAD compiler option enables thread safety by: making Working Storage thread-local (each thread gets its own copy), supporting CALL...ON EXCEPTION for thread-related conditions, and enabling Language Environment threading APIs. Required for CICS programs and multithreaded applications.",
        code: "/* Compile with THREAD option for thread safety: */\n//COBCOMP EXEC IGYWCL,PARM.COBOL='THREAD,RENT,OPTIMIZE'\n\n/* Thread-local Working Storage - each thread gets its own copy */\nWORKING-STORAGE SECTION.\n01 WS-LOCAL-DATA PIC X(100).   /* Thread-local with THREAD option */\n01 WS-COUNTER   PIC 9(9) COMP. /* Each thread has its own counter */",
        tip: "THREAD compiler option and RENT (Reentrant) are both required for CICS programs. Without THREAD, programs sharing Working Storage between calls can corrupt data when called concurrently.",
        quizOptions: ["THREAD only affects multithreaded batch", "THREAD makes Working Storage thread-local so multiple concurrent callers each get their own data copy; required for CICS", "THREAD is only for new COBOL programs", "THREAD is the same as RENT compiler option"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_045", category: "COBOL", level: "Expert",
        question: "How does COBOL handle NULL-terminated strings when interfacing with C programs?",
        answer: "C programs use null-terminated strings (ending with hex 00). COBOL PIC X fields don't include null terminators by default. When calling C: (1) Declare field one byte longer than needed and move LOW-VALUE or ZERO to the last byte. (2) Use STRING...DELIMITED BY...INTO with null appended. (3) COBOL's Z'...' literal creates null-terminated strings.",
        code: "* Create null-terminated string for C call:\n01 WS-C-STRING PIC X(26) VALUE SPACES.\n\nMOVE 'Hello C Program' TO WS-C-STRING\nMOVE LOW-VALUES TO WS-C-STRING(17:1)  /* Null terminate */\n\n/* Using Z literal: */\nMOVE Z'Hello C Program' TO WS-C-STRING\n/* Z'' creates 'Hello C Program' + X'00' automatically */\n\nCALL 'CPROGRAM' USING BY REFERENCE WS-C-STRING",
        tip: "The Z'' literal syntax in modern Enterprise COBOL is the cleanest way to create null-terminated strings. Always verify C function parameter types before the CALL.",
        quizOptions: ["COBOL automatically handles null termination", "C needs null-terminated strings; COBOL adds null (LOW-VALUE or Z'' literal) to the end of character fields before calling C programs", "NULL termination is handled by the linker", "Z'' literal is only for display purposes"],
        quizAnswerIndex: 1
    },

    // More JCL expert questions
    {
        id: "jcl_b2_031", category: "JCL", level: "Expert",
        question: "How does DFSMS automatic class selection (ACS) work in JCL?",
        answer: "ACS routines automatically assign storage class, data class, and management class to new datasets based on rules defined by storage administrators. When a JCL job creates a dataset, DFSMS ACS routines examine the dataset name, job name, step name, and other attributes to determine appropriate storage policies. Users don't need to specify STORCLAS/DATACLAS/MGMTCLAS explicitly.",
        code: "/* ACS assigns classes automatically: */\n//NEWDATA  DD DSN=PROD.APP.TRANS.DATA,DISP=(NEW,CATLG),\n//            SPACE=(CYL,(10,5))  /* ACS assigns storage class automatically */\n\n/* Override if ACS selection is wrong: */\n//OVERRIDE DD DSN=PROD.SPEC.FILE,DISP=(NEW,CATLG),\n//            SPACE=(CYL,(5,2)),STORCLAS=PREMIUM,MGMTCLAS=BACKUP30",
        tip: "Understand your installation's ACS rules. Naming conventions often trigger specific storage policies. Following naming conventions ensures optimal storage allocation without manual specification.",
        quizOptions: ["ACS requires manual storage class specification", "ACS routines automatically assign storage classes based on dataset name patterns and job attributes defined by storage administrators", "ACS is only for VSAM datasets", "ACS always requires override specification"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_032", category: "JCL", level: "Expert",
        question: "What are JCL secondary allocation failures and how do you prevent them?",
        answer: "Secondary allocation failures (SB37, SD37) occur when a dataset needs more space than primary+secondary*15 can provide. Prevention: (1) Estimate data size accurately, (2) Use RLSE to release unused primary space, (3) Use DSNTYPE=LARGE for large datasets (> 65535 tracks), (4) Use DATACLAS with auto-increment, (5) Monitor and pre-expand datasets before they run out.",
        code: "/* Properly sized allocation with release: */\n//BIGFILE  DD DSN=PROD.LARGE.OUTPUT,DISP=(NEW,CATLG),\n//            SPACE=(CYL,(500,100),RLSE),  /* 500 primary, 100 secondary */\n//            UNIT=SYSDA,\n//            DSNTYPE=LARGE                /* Enable large dataset support */",
        tip: "Use DSNTYPE=LARGE for any dataset expected to exceed 65535 tracks. Regular datasets cannot exceed this limit regardless of secondary allocation settings.",
        quizOptions: ["Secondary allocation never fails", "Secondary allocation fails when dataset exceeds primary+15 secondary; prevent with RLSE, DSNTYPE=LARGE, and accurate size estimation", "SB37 only occurs with PDS datasets", "Increase REGION to prevent space failures"],
        quizAnswerIndex: 1
    },

    // continue with more JCL and COBOL questions
    {
        id: "jcl_b2_033", category: "JCL", level: "Intermediate",
        question: "What is the SUBSYS DD parameter and when is it used?",
        answer: "SUBSYS=(subsystem-name,...) on a DD statement routes I/O through a software subsystem that intercepts normal I/O. Common uses: (1) SUBSYS=(SDSF,...) for viewing spool data, (2) Network File System access, (3) Third-party storage management software. The subsystem processes I/O requests before or instead of the physical device.",
        code: "/* Access spool dataset through SDSF subsystem: */\n//SPOOLDD  DD SUBSYS=(SDSF,jobname,dsname)\n\n/* Third-party storage manager subsystem: */\n//ARCVFILE DD DSN=ARCHIVE.DATA,SUBSYS=(STOREMGR,'RECALL')",
        tip: "SUBSYS is used by storage management products like IBM HSM (DFSMShsm) to automatically recall migrated datasets. Understanding SUBSYS helps debug recall failures.",
        quizOptions: ["SUBSYS specifies CPU subsystem class", "SUBSYS routes DD I/O through a software subsystem for special processing like recall, spool access, or third-party management", "SUBSYS is only for tape devices", "SUBSYS replaces the DISP parameter"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_034", category: "JCL", level: "Expert",
        question: "How do you debug JCL allocation problems using JES job log analysis?",
        answer: "JES job log analysis: (1) Check IEF message codes - IEF285I (dataset disposition messages), IEF877I (space allocation), IEF212I (dataset not found). (2) Review allocation/unallocation messages for each DD statement. (3) Check MSGLEVEL=(2,1) for full PROC expansion. (4) Use JCLTEST utility for syntax validation before submission.",
        code: "/* Common IEF messages to check: */\nIEF285I  dsname  KEPT          /* Normal keep */\nIEF285I  dsname  DELETED        /* Normal delete */\nIEF285I  dsname  CATLGD         /* Successfully cataloged */\nIEF212I  STEP1  - DATASET NOT FOUND  /* Missing dataset */\nIEF481I  STEP1  - ERROR IN SYSOUT=X   /* Bad output class */",
        tip: "Save JES job logs for all production failures. The IEF messages tell you exactly what happened with each dataset, making JCL debugging systematic rather than guesswork.",
        quizOptions: ["JES logs don't contain useful debug info", "JES job logs contain IEF messages showing dataset allocation/disposition status, space allocation, and error conditions for each step", "Only operator console logs help debug JCL", "JCL errors only show in SYSOUT"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_035", category: "JCL", level: "Expert",
        question: "How do you use RACF to control JCL job submission?",
        answer: "RACF controls job submission through: (1) SURROGAT class - allows user A to submit jobs as user B. (2) SUBMIT class - controls who can submit to specific job classes. (3) JESINPUT class - controls JES input queue access. (4) JESNEWS class - for JES news dataset. (5) FACILITY class - controls specific JES facilities. RACF profiles are checked when jobs enter the JES queue.",
        code: "/* RACF controls for job submission: */\n/* SURROGAT profile allows USER1 to submit as USER2: */\n/* RDEFINE SURROGAT USER2.SUBMIT UACC(NONE) */\n/* PERMIT USER2.SUBMIT CLASS(SURROGAT) ID(USER1) ACCESS(READ) */\n\n//JOBUSR2  JOB (ACCT),'PROXY JOB',USER=USER2\n/* USER1 can submit this if SURROGAT permits it */",
        tip: "Automation userIDs submitting production jobs need SURROGAT permissions configured by your security administrator. Document all RACF requirements in your runbooks.",
        quizOptions: ["RACF doesn't control job submission", "RACF controls submission via SURROGAT class for proxy submission, SUBMIT class for class access, and JESINPUT for queue access", "Only TSO RACF commands control jobs", "Job class controls all security"],
        quizAnswerIndex: 1
    },

    // Additional specialized questions
    {
        id: "jcl_b2_036", category: "JCL", level: "Expert",
        question: "What is the IDCAMS REPRO command and when is it used?",
        answer: "IDCAMS REPRO copies VSAM datasets or converts between VSAM and sequential formats. It can: copy KSDS/ESDS/RRDS to VSAM or sequential, load sequential data into VSAM, unload VSAM to sequential (backup), copy selected records. It's the primary tool for VSAM backup/restore and data migration.",
        code: "//REPROJOB EXEC PGM=IDCAMS\n//SYSPRINT DD SYSOUT=*\n//INFILE   DD DSN=PROD.KSDS.CLUSTER,DISP=SHR\n//OUTFILE  DD DSN=BACKUP.SEQ.FILE,DISP=(NEW,CATLG),\n//            RECFM=VB,LRECL=4096,BLKSIZE=0\n//SYSIN    DD *\n  REPRO INFILE(INFILE) OUTFILE(OUTFILE)\n  /* From VSAM to Sequential: unload backup */\n  REPRO INFILE(SEQIN) OUTFILE(KSDSIN)  /* Load sequential to VSAM */\n/*",
        tip: "Use REPRO for nightly VSAM backup to sequential. Sequential backups are easier to transport and restore than VSAM-to-VSAM copies, especially across systems.",
        quizOptions: ["REPRO copies programs in PDSE libraries", "IDCAMS REPRO copies VSAM datasets and converts between VSAM and sequential for backup, restore, and migration", "REPRO only works with ESDS files", "REPRO is the same as IEBCOPY for VSAM"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_037", category: "JCL", level: "Expert",
        question: "How do you use JCL PROC to implement a standard compile-link-go procedure?",
        answer: "A standard compile-link-go PROC performs three steps: (1) Compile COBOL source using IGYWCL. (2) Link-edit the object module using IEWL/IEWBLINK. (3) Execute the resulting load module. Each step uses DD statements referencing shared libraries. Symbolic parameters allow customization for each program.",
        code: "//COBAGO   PROC LIB='PROD.LOAD',SRC='PROD.SOURCE'\n//COMPILE  EXEC PGM=IGYWCL,\n//         PARM='RENT,OPTIMIZE,CICS(YES)'\n//STEPLIB  DD DSN=IGY.V6R4M0.SIGYCOMP,DISP=SHR\n//SYSIN    DD DSN=&SRC,DISP=SHR\n//SYSLIN   DD DSN=&&OBJMOD,DISP=(NEW,PASS)\n//LKED     EXEC PGM=IEWL,COND=(8,LT,COMPILE),\n//         PARM='RENT,REFR,NCAL'\n//SYSLIN   DD DSN=*.COMPILE.SYSLIN,DISP=(OLD,DELETE)\n//SYSLMOD  DD DSN=&LIB(&MEMBER),DISP=SHR\n//PEND",
        tip: "Keep your compile-link PROCs standardized across all programs. Different compiler options between modules can cause subtle incompatibilities at link time.",
        quizOptions: ["Compile-link-go requires three separate JCL jobs", "A PROC combines compile, link-edit, and optional execution steps with symbolic parameters for program-specific customization", "COBOL programs are directly executable without linking", "Link-edit is automatic and doesn't need JCL"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_038", category: "JCL", level: "Intermediate",
        question: "What is the purpose of JCL NULLFILE and how does it differ from DUMMY?",
        answer: "NULLFILE is a JES2-specific device type that performs similarly to DUMMY - it discards writes and returns EOF on reads. DD DUMMY and NULLFILE are functionally equivalent for discarding output. However, NULLFILE doesn't require the program to open the file successfully; DUMMY with DISP needs file catalog validation. NULLFILE is simpler for truly discarding output.",
        code: "//UNWANTED DD DSN=NULLFILE       /* Discard this output */\n//ALTDUMMY DD DUMMY               /* Also discards, but needs DCB match */\n//SUPPRESS DD DSN=NULLFILE,SYSOUT=* /* Route spool output to nowhere */",
        tip: "Use NULLFILE for output DD statements from utility programs that require specific output files but where you want to suppress the output entirely.",
        quizOptions: ["NULLFILE creates a new empty dataset", "NULLFILE discards all I/O (write to null, read returns EOF) similar to DUMMY but without dataset catalog requirements", "NULLFILE is identical to DUMMY in all cases", "NULLFILE is only for tape output"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_039", category: "JCL", level: "Beginner",
        question: "What is the JCL COMMENT field and how are comments written?",
        answer: "JCL comments are lines with //* in columns 1-3. Everything after //* is a comment. Comments can appear anywhere in the JCL stream between statements. They're ignored by MVS and don't affect job execution. Good commenting practices include: program purpose, modification history, parameter explanations, and special handling notes.",
        code: "//* =========================================================\n//* JOB: MONTHLY-REPORT\n//* PURPOSE: Generate monthly sales report for all regions\n//* AUTHOR: J.SMITH\n//* MODIFIED: 2026-06-06 - Added Pacific region\n//* =========================================================\n//MYJOB    JOB (ACCT001),'MONTHLY SALES REPORT',CLASS=A\n//STEP1    EXEC PGM=SALESRPT  /* Execute report program */",
        tip: "Treat JCL comments as seriously as code comments. Future maintainers (including yourself) will thank you for clear documentation of purpose, parameters, and special considerations.",
        quizOptions: ["Comments in JCL use /* notation", "JCL comments use //* in columns 1-3 and can appear between any JCL statements", "Only line-end comments are supported", "JCL doesn't support comments"],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_b2_040", category: "JCL", level: "Expert",
        question: "How do you implement a JCL checkpoint/restart mechanism using CHKPT?",
        answer: "DFSMS checkpoint/restart allows long-running batch jobs to be restarted from a checkpoint rather than the beginning. CHKPT on the DD statement specifies the GDG for checkpoint data. The job must call CHKPT macro periodically. On restart, use RESTART parameter to resume from the last checkpoint.",
        code: "//BIGBATCH EXEC PGM=LONGRUN\n//CHKDD    DD DSN=CHECKPOINT.GDG(+1),DISP=(NEW,CATLG),\n//            DCB=(RECFM=F,LRECL=80),UNIT=SYSDA,\n//            SPACE=(CYL,(1,1))\n//SYSIN    DD *\n/* Program must call CHKPT service internally */\n\n/* Restart from checkpoint: */\n//RESTART  JOB (ACCT),'RESTART',RESTART=BIGBATCH\n/* JCL automatically reads checkpoint and resumes */",
        tip: "Implement checkpointing for batch jobs that run more than 30 minutes. This dramatically reduces recovery time when jobs fail, especially for end-of-month processing.",
        quizOptions: ["Checkpoint/restart requires special hardware", "CHKPT DD defines a checkpoint dataset; programs call CHKPT periodically; RESTART parameter resumes from last checkpoint", "Checkpointing only works for COBOL programs", "Checkpoint data is stored in VSAM automatically"],
        quizAnswerIndex: 1
    },

    // Final batch of important COBOL and JCL questions
    {
        id: "cobol_b2_046", category: "COBOL", level: "Expert",
        question: "What is COBOL recursive programming and how do you implement it?",
        answer: "COBOL supports recursion when compiled with RECURSIVE keyword in PROGRAM-ID. A recursive program calls itself. Without RECURSIVE, re-calling a program that's already active causes unpredictable results. Recursive COBOL is useful for: tree traversal, factorial calculation, nested structure processing. Each recursive call creates new Working Storage allocation.",
        code: "IDENTIFICATION DIVISION.\nPROGRAM-ID. FACTORIAL RECURSIVE.\n\nDATA DIVISION.\nLINKAGE SECTION.\n01 LK-N       PIC 9(5).\n01 LK-RESULT  PIC 9(15).\n\nPROCEDURE DIVISION USING LK-N RETURNING LK-RESULT.\n    IF LK-N <= 1\n        MOVE 1 TO LK-RESULT\n    ELSE\n        SUBTRACT 1 FROM LK-N\n        CALL 'FACTORIAL' USING LK-N RETURNING LK-RESULT\n        ADD 1 TO LK-N\n        MULTIPLY LK-N BY LK-RESULT\n    END-IF\n    GOBACK.",
        tip: "Recursive COBOL consumes stack space for each call. Deep recursion can exhaust the Language Environment stack. Consider iterative approaches for deep recursion scenarios.",
        quizOptions: ["COBOL cannot implement recursion", "COBOL supports recursion with PROGRAM-ID...RECURSIVE; each recursive call gets its own Working Storage allocation", "Recursion requires special library calls", "RECURSIVE keyword is only for OO COBOL"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_047", category: "COBOL", level: "Expert",
        question: "How do you handle COBOL programs in a multilingual environment with different code pages?",
        answer: "Code page handling: (1) CODEPAGE compiler option specifies the program's source code page. (2) CONVERTING special character set specifications in SPECIAL-NAMES. (3) NATIONAL (PIC N) fields handle Unicode characters (DBCS). (4) EXEC CICS SET TERMINAL CODEPAGE for CICS applications. (5) Use TRANSLATE verb or service calls to convert between code pages.",
        code: "ENVIRONMENT DIVISION.\nCONFIGURATION SECTION.\n    SPECIAL-NAMES.\n        SYMBOLIC CHARACTERS CR-LF IS 26.\n\n/* Compile with code page: */\n//COBCOMP EXEC IGYWCL,PARM.COBOL='CODEPAGE(1140)'\n\n/* Convert code page in program: */\nCALL 'ICONV' USING WS-FROM-CP WS-TO-CP WS-DATA WS-LEN",
        tip: "Document the code page used by each program and file. Code page mismatches cause character corruption that can be very difficult to diagnose, especially with special characters.",
        quizOptions: ["COBOL always uses EBCDIC internally", "Code page handling uses CODEPAGE compiler option, NATIONAL (PIC N) for Unicode, and conversion routines for multilingual environments", "Code pages are automatically managed by z/OS", "Code page conversion requires CICS"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_048", category: "COBOL", level: "Expert",
        question: "What is COBOL's SERVICE RELOAD statement and why is it important for CICS?",
        answer: "SERVICE RELOAD identifier refreshes the Linkage Section pointer for a variable that may have moved in memory. In CICS, container/channel operations or memory management can relocate data areas. After CICS calls that might move data, SERVICE RELOAD ensures the COBOL pointer reflects the current address. Without it, stale pointers can cause S0C4 or data corruption.",
        code: "LINKAGE SECTION.\n01 LK-WORK-AREA PIC X(1000).\n\nPROCEDURE DIVISION.\n    EXEC CICS GET CONTAINER('MYDATA')\n        SET(ADDRESS OF LK-WORK-AREA)\n        LENGTH(WS-LEN)\n    END-EXEC\n    \n    SERVICE RELOAD LK-WORK-AREA  /* Refresh pointer after CICS GET */\n    MOVE LK-WORK-AREA(1:10) TO WS-RESULT  /* Safe to access now */",
        tip: "Always use SERVICE RELOAD after CICS operations that set ADDRESS OF Linkage Section variables. This is especially important in programs that call multiple CICS services.",
        quizOptions: ["SERVICE RELOAD reads a file", "SERVICE RELOAD refreshes Linkage Section pointers that may have moved in memory, critical after CICS memory operations", "SERVICE RELOAD is only for DB2", "SERVICE RELOAD reinitializes Working Storage"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_049", category: "COBOL", level: "Intermediate",
        question: "How does COBOL handle date arithmetic and what are the common date manipulation functions?",
        answer: "COBOL intrinsic functions for dates: FUNCTION DATE-OF-INTEGER(n) converts integer day number to YYYYMMDD. FUNCTION INTEGER-OF-DATE(yyyymmdd) converts YYYYMMDD to integer. Subtracting two integers gives days between dates. FUNCTION DAY-OF-INTEGER(n) returns day of week. FUNCTION CURRENT-DATE gives current date/time with UTC offset.",
        code: "01 WS-DATE1    PIC 9(8) VALUE 20260101.\n01 WS-DATE2    PIC 9(8) VALUE 20260606.\n01 WS-INT1     PIC 9(9) COMP.\n01 WS-INT2     PIC 9(9) COMP.\n01 WS-DAYS     PIC 9(9) COMP.\n\nCOMPUTE WS-INT1 = FUNCTION INTEGER-OF-DATE(WS-DATE1)\nCOMPUTE WS-INT2 = FUNCTION INTEGER-OF-DATE(WS-DATE2)\nCOMPUTE WS-DAYS = WS-INT2 - WS-INT1\nDISPLAY 'Days between dates: ' WS-DAYS  /* Should be 156 */\n\n/* Add 30 days to a date: */\nCOMPUTE WS-INT1 = FUNCTION INTEGER-OF-DATE(WS-DATE1) + 30\nCOMPUTE WS-DATE1 = FUNCTION DATE-OF-INTEGER(WS-INT1)",
        tip: "Always use INTEGER-OF-DATE/DATE-OF-INTEGER for date arithmetic instead of manual calendar calculations. They handle leap years, month boundaries, and century boundaries automatically.",
        quizOptions: ["COBOL cannot do date arithmetic", "Use INTEGER-OF-DATE and DATE-OF-INTEGER functions for date arithmetic; convert to integers, subtract/add, convert back", "Date arithmetic requires CICS services", "COBOL only supports YYYYMMDD format"],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_b2_050", category: "COBOL", level: "Expert",
        question: "What is COBOL's TYPEDEF clause and how does it simplify data definitions?",
        answer: "TYPEDEF (COBOL 2002 standard, Enterprise COBOL 6.4+) creates a named data type that can be referenced in multiple variable declarations using the LIKE clause. This enables type-safe programming: define a data type once and reuse it consistently. Changes to the TYPEDEF propagate to all declarations using LIKE.",
        code: "/* Define a reusable type: */\n01 MONEY-AMOUNT PIC S9(13)V99 COMP-3\n                TYPEDEF.\n\n/* Use the type: */\nDATA DIVISION.\n01 WS-SALARY    LIKE MONEY-AMOUNT.\n01 WS-BONUS     LIKE MONEY-AMOUNT.\n01 WS-TOTAL-PAY LIKE MONEY-AMOUNT.\n\n/* All three have identical definitions */",
        tip: "TYPEDEF is available in Enterprise COBOL 6.4+. For older versions, use COPY with a single-field copybook to achieve similar reuse of data type definitions.",
        quizOptions: ["TYPEDEF is not available in COBOL", "TYPEDEF (COBOL 2002+) creates reusable type definitions; LIKE clause uses them, ensuring consistent field definitions throughout the program", "TYPEDEF is only for numeric fields", "TYPEDEF requires OO COBOL mode"],
        quizAnswerIndex: 1
    }
];
