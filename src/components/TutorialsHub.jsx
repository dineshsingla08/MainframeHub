import React, { useState } from 'react';

const TUTORIALS = {
  COBOL: {
    icon: '📦',
    color: '#00ff41',
    description: 'Common Business-Oriented Language — the backbone of enterprise computing.',
    chapters: [
      {
        title: 'COBOL Program Structure',
        level: 'Beginner',
        content: `A COBOL program is divided into four main Divisions:

1. **IDENTIFICATION DIVISION** — Identifies the program (name, author, etc.)
2. **ENVIRONMENT DIVISION** — Defines the computing environment and file assignments
3. **DATA DIVISION** — Declares all data items, files, and working storage
4. **PROCEDURE DIVISION** — Contains the actual program logic`,
        code: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO-WORLD.
       AUTHOR. MAINFRAME-DEV.

       ENVIRONMENT DIVISION.
       CONFIGURATION SECTION.
       SOURCE-COMPUTER. IBM-3090.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-MESSAGE         PIC X(30) VALUE 'HELLO, MAINFRAME WORLD!'.

       PROCEDURE DIVISION.
           DISPLAY WS-MESSAGE
           STOP RUN.`
      },
      {
        title: 'Data Types & PIC Clauses',
        level: 'Beginner',
        content: `The PICTURE (PIC) clause defines the format and size of data items:

- **PIC 9(n)** — Numeric, n digits (e.g., PIC 9(5) stores up to 99999)
- **PIC X(n)** — Alphanumeric, n characters
- **PIC A(n)** — Alphabetic only, n characters
- **PIC S9(n)** — Signed numeric (can be negative)
- **PIC 9(n)V9(m)** — Decimal: n integer digits, m decimal digits
- **PIC $9(n).99** — Edited numeric for display`,
        code: `       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-EMPLOYEE-REC.
          05 WS-EMP-ID       PIC 9(6).
          05 WS-EMP-NAME     PIC X(30).
          05 WS-EMP-SALARY   PIC S9(7)V99 COMP-3.
          05 WS-EMP-DEPT     PIC X(4).
          05 WS-HIRE-DATE    PIC 9(8).

       01 WS-DISPLAY-SALARY  PIC $ZZZ,ZZ9.99.`
      },
      {
        title: 'COBOL Verbs & Control Flow',
        level: 'Beginner',
        content: `Key COBOL procedural verbs:

- **MOVE** — Assigns values between data items
- **ADD / SUBTRACT / MULTIPLY / DIVIDE** — Arithmetic operations
- **COMPUTE** — Complex arithmetic expressions
- **IF / ELSE / END-IF** — Conditional logic
- **PERFORM** — Loop execution (UNTIL, TIMES, THRU)
- **EVALUATE** — Switch/case equivalent
- **GO TO** — Branch (use sparingly)`,
        code: `       PROCEDURE DIVISION.
       MAIN-LOGIC.
           MOVE 0 TO WS-TOTAL
           PERFORM VARYING WS-IDX FROM 1 BY 1
               UNTIL WS-IDX > 10
               ADD WS-IDX TO WS-TOTAL
           END-PERFORM

           EVALUATE TRUE
               WHEN WS-TOTAL > 50
                   DISPLAY 'SUM IS LARGE'
               WHEN WS-TOTAL > 25
                   DISPLAY 'SUM IS MEDIUM'
               WHEN OTHER
                   DISPLAY 'SUM IS SMALL'
           END-EVALUATE

           STOP RUN.`
      },
      {
        title: 'File Handling in COBOL',
        level: 'Intermediate',
        content: `COBOL file handling uses three components:

1. **SELECT statement** (ENVIRONMENT DIVISION) — Maps logical to physical file
2. **FD statement** (DATA DIVISION) — Defines file record structure
3. **OPEN/READ/WRITE/CLOSE verbs** (PROCEDURE DIVISION) — File operations

File organizations: SEQUENTIAL, INDEXED (VSAM KSDS), RELATIVE (VSAM RRDS)`,
        code: `       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMPLOYEE-FILE ASSIGN TO EMPFILE
               ORGANIZATION IS SEQUENTIAL
               ACCESS MODE IS SEQUENTIAL
               FILE STATUS IS WS-FILE-STATUS.

       DATA DIVISION.
       FILE SECTION.
       FD  EMPLOYEE-FILE.
       01  EMPLOYEE-RECORD.
           05  EMP-ID       PIC 9(6).
           05  EMP-NAME     PIC X(30).
           05  EMP-SALARY   PIC S9(7)V99 COMP-3.

       PROCEDURE DIVISION.
           OPEN INPUT EMPLOYEE-FILE
           PERFORM UNTIL WS-EOF = 'Y'
               READ EMPLOYEE-FILE
                   AT END MOVE 'Y' TO WS-EOF
                   NOT AT END PERFORM PROCESS-RECORD
               END-READ
           END-PERFORM
           CLOSE EMPLOYEE-FILE
           STOP RUN.`
      },
      {
        title: 'COBOL Copybooks & Modularity',
        level: 'Intermediate',
        content: `Copybooks are reusable data definitions stored in libraries:

- Defined with **COPY** statement
- Stored in PDS (Partitioned Data Set) libraries
- Can be replaced/modified using **REPLACING** clause
- Promote consistent record layouts across programs
- Think of them as "header files" in C or "modules" in Java`,
        code: `       * In copybook member: EMPREC
       01  EMPLOYEE-RECORD.
           05  EMP-ID       PIC 9(6).
           05  EMP-NAME     PIC X(30).
           05  EMP-DEPT     PIC X(4).

       * In main program:
       DATA DIVISION.
       WORKING-STORAGE SECTION.
           COPY EMPREC.

       * With REPLACING:
           COPY EMPREC REPLACING ==EMPLOYEE== BY ==MANAGER==.`
      },
      {
        title: 'DB2 Embedded SQL in COBOL',
        level: 'Advanced',
        content: `COBOL programs access DB2 tables using Embedded SQL:

- SQL statements enclosed in **EXEC SQL ... END-EXEC**
- **SQLCA** (SQL Communication Area) — check SQLCODE after each SQL call
- **SQLCODE = 0** → Success
- **SQLCODE = 100** → Not Found (no rows)
- **SQLCODE < 0** → Error
- Host variables prefixed with colon (:WS-EMP-ID)`,
        code: `       DATA DIVISION.
       WORKING-STORAGE SECTION.
           EXEC SQL INCLUDE SQLCA END-EXEC.
       01  WS-EMP-ID    PIC 9(6).
       01  WS-EMP-NAME  PIC X(30).
       01  WS-SALARY    PIC S9(7)V99 COMP-3.

       PROCEDURE DIVISION.
           MOVE 100234 TO WS-EMP-ID

           EXEC SQL
               SELECT EMP_NAME, SALARY
               INTO :WS-EMP-NAME, :WS-SALARY
               FROM EMPLOYEE
               WHERE EMP_ID = :WS-EMP-ID
           END-EXEC

           EVALUATE SQLCODE
               WHEN 0
                   DISPLAY 'FOUND: ' WS-EMP-NAME
               WHEN 100
                   DISPLAY 'EMPLOYEE NOT FOUND'
               WHEN OTHER
                   DISPLAY 'SQL ERROR: ' SQLCODE
                   PERFORM ERROR-HANDLER
           END-EVALUATE.`
      }
    ]
  },
  JCL: {
    icon: '⚙️',
    color: '#ffaa00',
    description: 'Job Control Language — the scripting language of IBM mainframe batch processing.',
    chapters: [
      {
        title: 'JCL Fundamentals',
        level: 'Beginner',
        content: `JCL (Job Control Language) controls batch job execution on IBM mainframes.

**Three main statement types:**
- **JOB statement** — Identifies and names the job, sets accounting/priority
- **EXEC statement** — Identifies the program or procedure to execute
- **DD statement** — Defines the datasets (files) used by the program

Every JCL statement starts with **//** in columns 1-2.`,
        code: `//MYJOB    JOB (ACCT001),'MY JOB',
//             CLASS=A,
//             MSGCLASS=X,
//             NOTIFY=&SYSUID,
//             REGION=4M
//*
//* THIS IS A COMMENT
//*
//STEP01   EXEC PGM=MYPROG
//INFILE   DD DSN=MY.INPUT.FILE,
//             DISP=SHR
//OUTFILE  DD DSN=MY.OUTPUT.FILE,
//             DISP=(NEW,CATLG,DELETE),
//             SPACE=(CYL,(5,2),RLSE),
//             DCB=(RECFM=FB,LRECL=80,BLKSIZE=8000)
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  SOME INLINE DATA
/*`
      },
      {
        title: 'Dataset Disposition (DISP)',
        level: 'Beginner',
        content: `DISP parameter has three sub-parameters: DISP=(status, normal-end, abnormal-end)

**Status options:**
- **NEW** — Create new dataset
- **OLD** — Existing dataset, exclusive use
- **SHR** — Existing dataset, shared use
- **MOD** — Append to existing dataset

**End-of-step options:**
- **KEEP** — Retain dataset
- **DELETE** — Remove dataset
- **CATLG** — Catalog the dataset
- **UNCATLG** — Remove from catalog
- **PASS** — Pass to next step`,
        code: `//STEP1    EXEC PGM=PROG1
//* Create new, catalog if OK, delete if ABEND
//NEWDS    DD DSN=MY.NEW.FILE,
//             DISP=(NEW,CATLG,DELETE),
//             SPACE=(TRK,(10,5))

//STEP2    EXEC PGM=PROG2
//* Use existing file shared (read-only safe)
//INFILE   DD DSN=MY.EXISTING.FILE,
//             DISP=SHR

//STEP3    EXEC PGM=PROG3
//* Append to existing sequential file
//APPENDF  DD DSN=MY.APPEND.FILE,
//             DISP=(MOD,KEEP,KEEP)`
      },
      {
        title: 'DFSORT — Sorting and Merging',
        level: 'Intermediate',
        content: `DFSORT (IBM Data Facility Sort) is the most powerful mainframe sort utility.

**Key control statements:**
- **SORT FIELDS** — Define sort keys (position, length, format, order)
- **MERGE FIELDS** — Merge pre-sorted files
- **INCLUDE COND** — Include only matching records
- **OMIT COND** — Exclude matching records
- **OUTREC / INREC** — Reformat output/input records
- **SUM FIELDS** — Aggregate (sum) numeric fields
- **OUTFIL** — Multiple output files from one pass`,
        code: `//SORTJOB  JOB ...
//STEP1    EXEC PGM=SORT
//SORTIN   DD DSN=MY.INPUT.FILE,DISP=SHR
//SORTOUT  DD DSN=MY.SORTED.FILE,
//             DISP=(NEW,CATLG,DELETE),
//             SPACE=(CYL,(5,2))
//SYSOUT   DD SYSOUT=*
//SYSIN    DD *
  SORT FIELDS=(1,4,CH,A,5,30,CH,A)
  INCLUDE COND=(45,3,CH,EQ,C'MGR')
  OUTREC FIELDS=(1,30,35,10)
/*
//*
//* Find max salary: sort descending, take first record
//STEP2    EXEC PGM=SORT
//SORTIN   DD DSN=EMP.DATA,DISP=SHR
//SORTOUT  DD DSN=EMP.MAXSAL,DISP=(NEW,CATLG,DELETE)
//SYSIN    DD *
  SORT FIELDS=(50,8,ZD,D)
  OUTREC FIELDS=(1,80)
  OUTFIL STARTREC=1,ENDREC=1
/*`
      },
      {
        title: 'IEBGENER — Copy & Reformat',
        level: 'Intermediate',
        content: `IEBGENER is a utility program for copying and reformatting sequential datasets.

**Common uses:**
- Copy one sequential file to another
- Print datasets to SYSOUT
- Create multiple copies of a file
- Reformat records using SYSIN control statements

When SYSIN is DD DUMMY, it does a straight copy with no reformatting.`,
        code: `//COPYJOB  JOB ...
//STEP1    EXEC PGM=IEBGENER
//SYSPRINT DD SYSOUT=*
//* Source file
//SYSUT1   DD DSN=MY.SOURCE.FILE,DISP=SHR
//* Destination file
//SYSUT2   DD DSN=MY.DEST.FILE,
//             DISP=(NEW,CATLG,DELETE),
//             SPACE=(CYL,(1,1))
//* No special control cards = straight copy
//SYSIN    DD DUMMY

//STEP2    EXEC PGM=IEBGENER
//SYSPRINT DD SYSOUT=*
//SYSUT1   DD DSN=MY.DATA.FILE,DISP=SHR
//* Print file to system output
//SYSUT2   DD SYSOUT=*
//SYSIN    DD DUMMY`
      },
      {
        title: 'Procedures (PROCs)',
        level: 'Advanced',
        content: `JCL Procedures (PROCs) are reusable sets of JCL statements stored in a library.

**Types:**
- **Instream PROC** — Defined within the JCL itself
- **Cataloged PROC** — Stored in a PROCLIB (PDS)

**Benefits:**
- Eliminate repetition
- Standardize job structures
- Support symbolic parameters (&&PARM)
- Can be overridden at execution time (override DD statements)`,
        code: `//MYPROC   PROC INDSN=MY.DEFAULT.IN,
//              OUTDSN=MY.DEFAULT.OUT
//*
//STEP1    EXEC PGM=MYPROG
//INPUT    DD DSN=&INDSN,DISP=SHR
//OUTPUT   DD DSN=&OUTDSN,
//             DISP=(NEW,CATLG,DELETE),
//             SPACE=(CYL,(5,2))
//SYSPRINT DD SYSOUT=*
//         PEND
//*
//* Calling the PROC with override
//JOBSTEP  EXEC MYPROC,
//              INDSN=MY.ACTUAL.INPUT,
//              OUTDSN=MY.ACTUAL.OUTPUT
//* Override a DD statement in the PROC
//STEP1.SYSPRINT DD SYSOUT=H`
      }
    ]
  },
  DB2: {
    icon: '🗄️',
    color: '#00aaff',
    description: 'IBM Db2 — the relational database management system for z/OS.',
    chapters: [
      {
        title: 'DB2 Architecture on z/OS',
        level: 'Beginner',
        content: `DB2 for z/OS has a unique multi-layer architecture:

- **DB2 Subsystem** — One or more DB2 instances per z/OS LPAR
- **Buffer Pools** — Memory areas for caching pages from disk
- **Log** — Active log and archive logs for recovery
- **VSAM datasets** — Underlying storage for table spaces
- **DBD** — Database Descriptor (metadata)
- **ICF Catalog** — Integrated Catalog Facility for VSAM
- **DB2 Catalog** — DB2's own system catalog (SYSIBM tables)`,
        code: `-- View DB2 catalog tables
SELECT NAME, CREATOR, TYPE
FROM SYSIBM.SYSTABLES
WHERE TYPE = 'T'
AND CREATOR = 'MYSCHEMA'
ORDER BY NAME;

-- Check table statistics
SELECT TABLENAME, CARDINALITY, NPAGES, PAGESAVE
FROM SYSIBM.SYSTABLESTAT
WHERE TABLESCHEMA = 'MYSCHEMA';`
      },
      {
        title: 'DB2 Data Types',
        level: 'Beginner',
        content: `DB2 for z/OS data types:

**Numeric:** INTEGER, SMALLINT, BIGINT, DECIMAL(p,s), FLOAT, DOUBLE
**Character:** CHAR(n), VARCHAR(n), CLOB(n)
**Binary:** BINARY(n), VARBINARY(n), BLOB(n)
**Date/Time:** DATE, TIME, TIMESTAMP
**Large Objects:** CLOB, BLOB, DBCLOB (double-byte characters)
**XML:** XML (native XML storage)`,
        code: `CREATE TABLE EMPLOYEE (
    EMP_ID      INTEGER       NOT NULL,
    EMP_NAME    VARCHAR(50)   NOT NULL,
    DEPT_NO     CHAR(3),
    HIRE_DATE   DATE          DEFAULT CURRENT DATE,
    SALARY      DECIMAL(10,2),
    BONUS_PCT   SMALLINT      DEFAULT 0,
    PHOTO       BLOB(1M),
    NOTES       CLOB(32K),
    LAST_UPD    TIMESTAMP     DEFAULT CURRENT TIMESTAMP,
    PRIMARY KEY (EMP_ID)
);`
      },
      {
        title: 'SQL Queries — SELECT & JOINs',
        level: 'Beginner',
        content: `Core SELECT patterns used in DB2 interviews:

- **Basic SELECT** — Retrieve data with WHERE, ORDER BY
- **INNER JOIN** — Rows matching in both tables
- **LEFT OUTER JOIN** — All rows from left, matching from right
- **GROUP BY + HAVING** — Aggregation with filter
- **Subquery** — Nested SELECT
- **MAX salary pattern** — Common interview question!`,
        code: `-- Basic select with filter
SELECT EMP_NAME, SALARY, DEPT_NO
FROM EMPLOYEE
WHERE SALARY > 50000
ORDER BY SALARY DESC;

-- INNER JOIN departments
SELECT E.EMP_NAME, D.DEPT_NAME, E.SALARY
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D ON E.DEPT_NO = D.DEPT_NO
WHERE D.LOCATION = 'NEW YORK';

-- MAX salary per department
SELECT DEPT_NO, MAX(SALARY) AS MAX_SAL
FROM EMPLOYEE
GROUP BY DEPT_NO
HAVING MAX(SALARY) > 80000;

-- Second highest salary
SELECT MAX(SALARY) AS SECOND_MAX
FROM EMPLOYEE
WHERE SALARY < (SELECT MAX(SALARY) FROM EMPLOYEE);

-- Second highest using RANK()
SELECT SALARY FROM (
    SELECT SALARY, RANK() OVER (ORDER BY SALARY DESC) AS RNK
    FROM EMPLOYEE
) WHERE RNK = 2;`
      },
      {
        title: 'DB2 Indexes & Performance',
        level: 'Intermediate',
        content: `Indexes are critical for DB2 performance:

- **Unique Index** — Enforces uniqueness (like PRIMARY KEY)
- **Non-unique Index** — For query performance only
- **Clustering Index** — Physically orders table pages
- **Partitioned Index** — For range partitioned table spaces
- **Access Path** — EXPLAIN to see how DB2 accesses data

**RUNSTATS** — Updates catalog statistics for optimizer
**REORG** — Physically reorganizes data for clustering`,
        code: `-- Create clustering index
CREATE UNIQUE INDEX EMP_IDX
    ON EMPLOYEE (EMP_ID ASC)
    CLUSTER;

-- Create composite index for query pattern
CREATE INDEX EMP_DEPT_SAL_IDX
    ON EMPLOYEE (DEPT_NO, SALARY DESC);

-- EXPLAIN an access path
EXPLAIN PLAN SET QUERYNO = 1 FOR
    SELECT EMP_NAME, SALARY
    FROM EMPLOYEE
    WHERE DEPT_NO = 'D01'
    AND SALARY > 60000;

-- Check explain output
SELECT * FROM PLAN_TABLE
WHERE QUERYNO = 1;`
      },
      {
        title: 'DB2 Stored Procedures & Functions',
        level: 'Advanced',
        content: `DB2 supports both SQL stored procedures and external (compiled language) procedures.

**SQL Stored Procedure:** Written in SQL PL dialect
**External Stored Procedure:** Written in COBOL, C, PL/I, compiled separately
**UDF (User Defined Function):** Scalar or table functions
**Triggers:** Automatic actions on INSERT/UPDATE/DELETE`,
        code: `-- SQL Stored Procedure
CREATE PROCEDURE GET_EMP_DETAILS
    (IN P_EMP_ID   INTEGER,
     OUT P_NAME    VARCHAR(50),
     OUT P_SALARY  DECIMAL(10,2))
LANGUAGE SQL
BEGIN
    SELECT EMP_NAME, SALARY
    INTO P_NAME, P_SALARY
    FROM EMPLOYEE
    WHERE EMP_ID = P_EMP_ID;
END;

-- Call the procedure
CALL GET_EMP_DETAILS(12345, ?, ?);

-- Table UDF
CREATE FUNCTION DEPT_EMPLOYEES(P_DEPT CHAR(3))
RETURNS TABLE (EMP_ID INT, EMP_NAME VARCHAR(50))
LANGUAGE SQL
READS SQL DATA
RETURN
    SELECT EMP_ID, EMP_NAME
    FROM EMPLOYEE
    WHERE DEPT_NO = P_DEPT;`
      }
    ]
  },
  CICS: {
    icon: '🖥️',
    color: '#ff6b35',
    description: 'Customer Information Control System — the mainframe transaction processing engine.',
    chapters: [
      {
        title: 'CICS Architecture Overview',
        level: 'Beginner',
        content: `CICS is a transaction server that processes millions of transactions per day in banking, insurance, and retail.

**Key concepts:**
- **Region** — CICS address space (one or more per LPAR)
- **Transaction** — A 4-character code identifying a unit of work
- **Task** — Instance of a transaction being executed
- **Terminal** — Physical or logical device (3270 screen)
- **Program** — COBOL/PL/I/C code executing under CICS
- **CSD** — CICS System Definition file (resource definitions)
- **Pseudo-conversational** — CICS's preferred design pattern`,
        code: `*Typical CICS transaction flow:
* 1. User types TXID on 3270 terminal → ENTER
* 2. CICS routes to program linked to TXID
* 3. Program reads COMMAREA / TWA
* 4. Program accesses DB2/VSAM/MQ
* 5. Program sends map back to terminal
* 6. Program issues EXEC CICS RETURN TRANSID(TXID)
* 7. Terminal waits (task ends, no system resources held)
* 8. User fills screen → ENTER
* 9. New task starts, COMMAREA re-read`
      },
      {
        title: 'EXEC CICS Commands',
        level: 'Beginner',
        content: `CICS commands use the EXEC CICS interface (translated by CICS preprocessor).

**Program control:**
- EXEC CICS RETURN — End task (pseudo-conversational)
- EXEC CICS LINK — Call subprogram synchronously
- EXEC CICS XCTL — Transfer control to another program

**Terminal I/O:**
- EXEC CICS SEND MAP — Send BMS map to terminal
- EXEC CICS RECEIVE MAP — Receive data from terminal

**Data storage:**
- EXEC CICS GETMAIN — Allocate dynamic memory
- EXEC CICS PUT CONTAINER — Store data in channel/container`,
        code: `       PROCEDURE DIVISION.
       MAIN-PARA.
           EXEC CICS HANDLE CONDITION
               ERROR(ERROR-PARA)
               NOTFOUND(NOTFOUND-PARA)
           END-EXEC

           EXEC CICS RECEIVE MAP('MYMAPNM')
               MAPSET('MYMAPST')
               INTO(MY-MAP-AREA)
           END-EXEC

           EXEC CICS READ
               FILE('CUSTOMER')
               INTO(CUST-REC)
               RIDFLD(CUST-KEY)
               RESP(WS-RESPONSE)
           END-EXEC

           IF WS-RESPONSE = DFHRESP(NORMAL)
               EXEC CICS SEND MAP('MYMAPNM')
                   MAPSET('MYMAPST')
                   FROM(OUTPUT-MAP)
                   ERASE
               END-EXEC
           END-IF

           EXEC CICS RETURN
               TRANSID('MYT1')
               COMMAREA(WS-COMMAREA)
               LENGTH(LENGTH OF WS-COMMAREA)
           END-EXEC.`
      },
      {
        title: 'BMS Maps (Basic Mapping Support)',
        level: 'Intermediate',
        content: `BMS maps define the layout of 3270 screens using assembler macro definitions.

**DFHMSD** — Map Set definition
**DFHMDI** — Map definition (one screen)
**DFHMDF** — Map field definition (one field on screen)

Maps are assembled and link-edited into a load library. CICS uses them to format/deformat 3270 datastreams automatically.`,
        code: `MYMAPST  DFHMSD TYPE=&SYSPARM,                     X
               LANG=COBOL,MODE=INOUT,TERM=3270-2,     X
               CTRL=FREEKB,STORAGE=AUTO
MYMAPNM  DFHMDI SIZE=(24,80),LINE=1,COLUMN=1
*
* Title field
TITLE    DFHMDF POS=(1,20),LENGTH=40,                 X
               ATTRB=(PROT,BRT),                       X
               INITIAL='CUSTOMER INQUIRY SCREEN'
* Input field - Customer ID
CUSTID   DFHMDF POS=(5,10),LENGTH=8,                  X
               ATTRB=(UNPROT,IC),                      X
               PICIN='99999999'
*
CUSTIDL  EQU   *
* Output fields
CUSTNAME DFHMDF POS=(7,10),LENGTH=30,                 X
               ATTRB=(PROT,NORM)
         DFHMSD TYPE=FINAL
         END`
      }
    ]
  },
  VSAM: {
    icon: '💾',
    color: '#9b59b6',
    description: 'Virtual Storage Access Method — IBM\'s primary file management system.',
    chapters: [
      {
        title: 'VSAM Dataset Types',
        level: 'Beginner',
        content: `VSAM has four main dataset organizations:

1. **KSDS (Key-Sequenced Data Set)** — Keyed access; records sorted by key
   - Has index component and data component
   - Supports sequential, keyed, and skip-sequential access
   
2. **ESDS (Entry-Sequenced Data Set)** — Records stored in arrival order
   - Accessed by RBA (Relative Byte Address)
   - Used as CICS VSAM logs, IMS overflow

3. **RRDS (Relative Record Data Set)** — Fixed-length records accessed by relative record number
   - Like arrays; fast direct access by slot number

4. **LDS (Linear Data Set)** — No records; just contiguous bytes
   - Used for Hiperspace, coupling facility buffers`,
        code: `//DEFKSDS  EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  DEFINE CLUSTER -
    (NAME(MY.EMPLOYEE.KSDS) -
     INDEXED -
     KEYS(6 0) -
     RECORDSIZE(100 200) -
     TRACKS(10 5) -
     SHAREOPTIONS(1 3)) -
  DATA -
    (NAME(MY.EMPLOYEE.KSDS.DATA)) -
  INDEX -
    (NAME(MY.EMPLOYEE.KSDS.INDEX))
/*`
      },
      {
        title: 'VSAM IDCAMS Utility',
        level: 'Intermediate',
        content: `IDCAMS (Access Method Services) is the utility for managing VSAM files.

**Common IDCAMS commands:**
- **DEFINE CLUSTER** — Create VSAM file
- **DELETE** — Delete VSAM file
- **LISTCAT** — List catalog entries
- **REPRO** — Copy/load records between datasets
- **PRINT** — Print VSAM contents
- **ALTER** — Change VSAM attributes
- **VERIFY** — Fix improperly closed datasets`,
        code: `//VSAMINIT EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//INFILE   DD DSN=MY.SEQ.INPUT,DISP=SHR
//SYSIN    DD *
* Delete and redefine
  DELETE MY.VSAM.KSDS CLUSTER PURGE

  DEFINE CLUSTER -
    (NAME(MY.VSAM.KSDS) -
     INDEXED -
     KEYS(8 0) -
     RECORDSIZE(200 500) -
     CYLINDERS(5 2) -
     FREESPACE(10 10)) -
  DATA(NAME(MY.VSAM.KSDS.DATA)) -
  INDEX(NAME(MY.VSAM.KSDS.INDEX))

* Load data from sequential file
  REPRO INFILE(INFILE) -
        OUTDATASET(MY.VSAM.KSDS)

* List the catalog entry
  LISTCAT ENTRIES(MY.VSAM.KSDS) ALL
/*`
      }
    ]
  },
  REXX: {
    icon: '🔧',
    color: '#e74c3c',
    description: 'Restructured Extended Executor — the mainframe scripting and automation language.',
    chapters: [
      {
        title: 'REXX Basics',
        level: 'Beginner',
        content: `REXX is a versatile scripting language available on z/OS, CMS, and TSO/ISPF.

**Key features:**
- No data types — everything is character or numeric automatically
- Excellent string manipulation built-in
- Interfaces with TSO, ISPF, RACF, JES
- Can invoke REXX execs from JCL (via IRXJCL)
- Commonly used for: automation, ISPF panels, system utilities`,
        code: `/* REXX */
/* Basic REXX program */
say 'Hello from REXX!'

/* Variables */
name = 'MAINFRAME'
count = 42
pi = 3.14159

/* String operations */
full = 'IBM' name
say 'Full:' full
say 'Length:' length(full)
say 'Upper:' translate(name)
say 'Substr:' substr(full, 1, 3)

/* Arithmetic */
result = count * 2 + 10
say 'Result:' result

/* DO loop */
do i = 1 to 5
  say 'Loop iteration:' i
end`
      },
      {
        title: 'REXX TSO Interface',
        level: 'Intermediate',
        content: `REXX can execute TSO commands, allocate files, and invoke ISPF services.

- **ADDRESS TSO** — Send command to TSO environment
- **OUTTRAP** — Capture TSO command output into a stem variable
- **LISTDSI** — Get dataset information
- **SYSDSN** — Check if dataset exists
- **ISPEXEC** — ISPF services from REXX`,
        code: `/* REXX - TSO interface example */

/* Check if dataset exists */
dsn = "'MY.DATASET.NAME'"
rc = SYSDSN(dsn)
if rc = 'OK' then
  say 'Dataset exists!'
else
  say 'Dataset not found:' rc

/* Get dataset info */
rc = LISTDSI(dsn)
say 'RECFM  :' SYSRECFM
say 'LRECL  :' SYSLRECL
say 'BLKSIZE:' SYSBLKSIZE
say 'TRACKS :' SYSUSED

/* Capture TSO LISTDS output */
rc = OUTTRAP('out.')
'LISTDS' dsn 'STATUS'
rc = OUTTRAP('OFF')
do i = 1 to out.0
  say out.i
end`
      }
    ]
  }
};

const CATEGORIES = ['COBOL', 'JCL', 'DB2', 'CICS', 'VSAM', 'REXX'];

const LEVEL_COLORS = {
  'Beginner': '#00ff41',
  'Intermediate': '#ffaa00',
  'Advanced': '#ff4444'
};

export const TutorialsHub = () => {
  const [activeCat, setActiveCat] = useState('COBOL');
  const [activeChapter, setActiveChapter] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);

  const tutorial = TUTORIALS[activeCat];
  const chapter = tutorial.chapters[activeChapter];

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(idx);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('- ') || line.match(/^\d+\. /)) {
        return <li key={i} style={{ marginBottom: '0.3rem' }} dangerouslySetInnerHTML={{ __html: boldLine.replace(/^[-\d]+\. ?/, '') }} />;
      }
      if (line === '') return <div key={i} style={{ height: '0.5rem' }} />;
      return <p key={i} style={{ margin: '0.2rem 0' }} dangerouslySetInnerHTML={{ __html: boldLine }} />;
    });
  };

  return (
    <div style={{ display: 'flex', gap: '0', height: 'calc(100vh - 140px)', overflow: 'hidden' }}>
      {/* Category Sidebar */}
      <div style={{
        width: '200px',
        minWidth: '200px',
        background: 'rgba(0,0,0,0.3)',
        borderRight: '1px solid var(--border-muted)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem 0',
        gap: '0.3rem',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '0 1rem', marginBottom: '0.8rem', fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>
          TECHNOLOGIES
        </div>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCat(cat); setActiveChapter(0); }}
            style={{
              padding: '0.7rem 1rem',
              textAlign: 'left',
              background: activeCat === cat ? 'rgba(var(--accent-rgb), 0.15)' : 'transparent',
              border: 'none',
              borderLeft: activeCat === cat ? '3px solid var(--accent-color)' : '3px solid transparent',
              color: activeCat === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: activeCat === cat ? '700' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <span>{TUTORIALS[cat].icon}</span> {cat}
          </button>
        ))}
      </div>

      {/* Chapter List */}
      <div style={{
        width: '230px',
        minWidth: '230px',
        background: 'rgba(0,0,0,0.2)',
        borderRight: '1px solid var(--border-muted)',
        overflowY: 'auto',
        padding: '1rem 0'
      }}>
        <div style={{ padding: '0 1rem', marginBottom: '0.8rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {tutorial.icon} {activeCat}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: '1.4' }}>
            {tutorial.description}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-muted)', paddingTop: '0.8rem' }}>
          <div style={{ padding: '0 1rem', marginBottom: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>
            CHAPTERS
          </div>
          {tutorial.chapters.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => setActiveChapter(idx)}
              style={{
                padding: '0.6rem 1rem',
                textAlign: 'left',
                background: activeChapter === idx ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                border: 'none',
                borderLeft: activeChapter === idx ? '2px solid var(--accent-color)' : '2px solid transparent',
                color: activeChapter === idx ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s',
                fontSize: '0.8rem',
                lineHeight: '1.4'
              }}
            >
              <div style={{ fontWeight: activeChapter === idx ? '700' : '400' }}>{ch.title}</div>
              <div style={{
                fontSize: '0.65rem',
                marginTop: '0.2rem',
                color: LEVEL_COLORS[ch.level] || '#888',
                fontFamily: 'var(--font-mono)'
              }}>
                ● {ch.level}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <div style={{ maxWidth: '900px' }}>
          {/* Chapter Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', margin: 0 }}>
                {chapter.title}
              </h2>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700',
                background: `${LEVEL_COLORS[chapter.level]}22`,
                color: LEVEL_COLORS[chapter.level],
                border: `1px solid ${LEVEL_COLORS[chapter.level]}44`
              }}>
                {chapter.level}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {activeCat} › {chapter.title}
            </div>
          </div>

          {/* Explanation */}
          <div className="metric-card" style={{ marginBottom: '1.5rem', lineHeight: '1.8', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {renderContent(chapter.content)}
            </ul>
          </div>

          {/* Code Example */}
          {chapter.code && (
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.5)',
                padding: '0.5rem 1rem',
                borderRadius: '8px 8px 0 0',
                borderTop: '1px solid var(--border-muted)',
                borderLeft: '1px solid var(--border-muted)',
                borderRight: '1px solid var(--border-muted)'
              }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  💻 CODE EXAMPLE — {activeCat}
                </span>
                <button
                  onClick={() => copyCode(chapter.code, activeChapter)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    background: copiedCode === activeChapter ? 'rgba(0,255,65,0.2)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-muted)',
                    borderRadius: '4px',
                    color: copiedCode === activeChapter ? '#00ff41' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {copiedCode === activeChapter ? '✓ COPIED' : '⎘ COPY'}
                </button>
              </div>
              <pre style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid var(--border-muted)',
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                padding: '1.5rem',
                margin: 0,
                overflow: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                lineHeight: '1.6',
                color: 'var(--accent-color)',
                maxHeight: '450px'
              }}>
                {chapter.code}
              </pre>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-muted)' }}>
            <button
              onClick={() => setActiveChapter(prev => Math.max(0, prev - 1))}
              disabled={activeChapter === 0}
              className="action-btn"
              style={{ opacity: activeChapter === 0 ? 0.3 : 1 }}
            >
              ← PREV CHAPTER
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>
              {activeChapter + 1} / {tutorial.chapters.length}
            </span>
            <button
              onClick={() => setActiveChapter(prev => Math.min(tutorial.chapters.length - 1, prev + 1))}
              disabled={activeChapter === tutorial.chapters.length - 1}
              className="action-btn"
              style={{ opacity: activeChapter === tutorial.chapters.length - 1 ? 0.3 : 1 }}
            >
              NEXT CHAPTER →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
