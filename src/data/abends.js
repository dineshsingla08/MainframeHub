export const abendsData = [
  {
    code: "S0C7",
    title: "Data Exception",
    category: "System",
    severity: "CRITICAL",
    description: "An S0C7 abend occurs when the system attempts to perform an arithmetic operation on a field containing invalid numeric data (e.g., spaces, low-values, or letters in a zoned decimal or packed decimal COMP-3 field).",
    causes: [
      "Numeric variables in working-storage were not initialized (defaulting to hex spaces '40' in EBCDIC).",
      "Input files contained spaces or non-numeric characters in numeric zones.",
      "Redefining an alphanumeric variable as numeric and performing arithmetic without validating the content.",
      "Mismatch in data record lengths causing fields to shift and read alphanumeric bytes into numeric fields."
    ],
    fix: "1. Look up the offset of the failure in the system logs or CEEDUMP.\n2. Locate the specific variable causing the issue in the compiler listing (LIST output map).\n3. Implement input sanitization using the numeric class test: IF WS-NUM-FIELD IS NOT NUMERIC.\n4. Initialize numeric variables to ZERO (VALUE ZERO or INITIALIZE statement).",
    proTip: "Use the NUMPROC(NOPFD) compiler option if your data source has non-preferred sign configurations, but note that NUMPROC(PFD) is faster. Sanitizing inputs at boundary points is the most secure pattern in high-throughput batch systems.",
    snippet: `* -- THE PROBLEM (Spaces in numeric fields) --
01  WS-BALANCE       PIC S9(5)V99 COMP-3. * Uninitialized, holds low-values/spaces
...
ADD 100.00 TO WS-BALANCE  * <-- CRASHES WITH S0C7 HERE!

* -- THE SOLUTION (Sanitation & Initialization) --
01  WS-BALANCE       PIC S9(5)V99 COMP-3 VALUE ZERO.
...
IF IN-SALARY-TXT IS NUMERIC
    MOVE IN-SALARY-TXT TO WS-BALANCE
    ADD 100.00 TO WS-BALANCE
ELSE
    DISPLAY "ERROR: INVALID INPUT SALARY: " IN-SALARY-TXT
END-IF`
  },
  {
    code: "S0C4",
    title: "Protection Exception",
    category: "System",
    severity: "CRITICAL",
    description: "An S0C4 abend occurs when a program attempts to access storage that has not been allocated to it or is protected from access by the program's storage key.",
    causes: [
      "Accessing a variable in the LINKAGE SECTION before the address has been established (e.g., prior to CALL ... USING or CICS COMMAREA linkage).",
      "Array/Table subscript or index out of bounds, pointing to memory outside the program partition.",
      "Mismatched parameter list between the calling program and the called program.",
      "Using an uninitialized pointer variable."
    ],
    fix: "1. Check the line where the failure occurred and verify if it references a LINKAGE SECTION or pointer variable.\n2. Check the value of indices/subscripts at the moment of failure to ensure they are within the table's defined limit.\n3. Verify that the parameter count and types match exactly between the CALL statement and the ENTRY/PROCEDURE DIVISION header of the subprogram.",
    proTip: "In modern hybrid architectures using z/OS Connect API calls, ensure that CICS programs check EIBCALEN (COMMAREA length) before referencing DFHCOMMAREA fields to avoid S0C4 protection faults.",
    snippet: `* -- THE PROBLEM (Uninitialized Linkage Access) --
LINKAGE SECTION.
01  DFHCOMMAREA.
    05  LK-USER-ID   PIC X(8).
PROCEDURE DIVISION.
    MOVE "ADMIN" TO LK-USER-ID  * <-- S0C4 CRASH if EIBCALEN is 0!

* -- THE SOLUTION (Check length first) --
PROCEDURE DIVISION.
    IF EIBCALEN < 8
        EXEC CICS ABEND ABCODE('LENG') END-EXEC
    ELSE
        MOVE "ADMIN" TO LK-USER-ID
    END-IF`
  },
  {
    code: "S0C1",
    title: "Operation Exception",
    category: "System",
    severity: "CRITICAL",
    description: "An S0C1 abend occurs when the CPU attempts to execute an instruction code that is invalid or not supported by the system architecture.",
    causes: [
      "Branching to an invalid address or branch to location 0 (often caused by corrupt return addresses or uninitialized pointer values).",
      "Calling a subprogram that could not be loaded or was not linked successfully (missing load module).",
      "Opening an un-opened file and executing an I/O instruction on it.",
      "Overlaying program code in memory (buffer overflow overwriting executable instructions)."
    ],
    fix: "1. Check if all called subprograms are present in the job's STEPLIB/JOBLIB concatenate.\n2. Review pointer operations to ensure return addresses are not overwritten.\n3. Verify that file status is checked and open operations are successful before executing READ/WRITE commands.",
    proTip: "Compile with SSRANGE option to catch index out of bounds that could otherwise overwrite code instructions in memory, turning a potential S0C1 execution error into a controlled compiler exception.",
    snippet: `* -- THE PROBLEM (Calling Unresolved Program) --
SET PT-SUBPROG TO NULL.
CALL PT-SUBPROG.  * <-- S0C1 Operation Exception (branching to 0)

* -- THE SOLUTION (Defensive Pointer check) --
IF PT-SUBPROG NOT = NULL
    CALL PT-SUBPROG
ELSE
    DISPLAY "ERROR: Subprogram address is unassigned."
    MOVE 99 TO RETURN-CODE
END-IF`
  },
  {
    code: "S322",
    title: "Time Limit Exceeded",
    category: "System",
    severity: "HIGH",
    description: "An S322 abend occurs when a job step or the entire job runs longer than the CPU time limit specified in the JCL or the system defaults.",
    causes: [
      "An infinite loop in program logic (e.g., PERFORM UNTIL condition is never met).",
      "Extremely slow database operations due to missing indexes or massive table scans.",
      "Deadlock or contention on a resource keeping the job in a suspended state.",
      "TIME parameter in the JCL was set too low for the volume of records processed."
    ],
    fix: "1. Locate the program and check counter variables in your loop logic to ensure they increments correctly.\n2. Review the DB2 EXPLAIN path for slow SQL queries inside the job.\n3. If processing a high volume of transactions is expected, increase the JCL TIME parameter: e.g., TIME=1440 (infinite) or TIME=(minutes,seconds).",
    proTip: "Always use system trace logs to verify CPU time vs. elapsed time. If CPU time is high, look for infinite loops. If elapsed time is high but CPU time is low, look for lock contentions.",
    snippet: `//-- JCL TIME LIMIT EXAMPLES --
//BATCHJOB JOB (ACCT),'PROD',CLASS=A,MSGCLASS=X
//* Set limit to 5 minutes:
//STEP1    EXEC PGM=COBPROG,TIME=5
//* Set limit to unlimited (e.g. for long-running archives):
//STEP2    EXEC PGM=ARCHIVE,TIME=1440`
  },
  {
    code: "S806",
    title: "Module Not Found",
    category: "System",
    severity: "HIGH",
    description: "An S806 abend occurs when the system attempts to load a program module for execution, but the module cannot be found in the system libraries or designated load libraries.",
    causes: [
      "The program name is misspelled in the JCL EXEC statement.",
      "The load library containing the program is missing from the JOBLIB or STEPLIB DD statements.",
      "The program was not compiled or link-edited successfully into the load library."
    ],
    fix: "1. Cross-reference the EXEC PGM=name spelling with the load library member names.\n2. Check the STEPLIB DD statement in the job step. Ensure it points to the correct partition dataset (PDS) library.\n3. Review compilation logs to ensure the program compiled with return code 0 (or within acceptable limits) and was successfully bound.",
    proTip: "As a solution architect, standardizing compile pipelines to automatically deploy compiled load modules into a central SYS1.LINKLIB equivalent or managed dev-test loadlibs prevents manual configuration errors.",
    snippet: `* -- THE PROBLEM (Missing STEPLIB) --
//MYJOB    JOB (ACCT),'DEV'
//STEP1    EXEC PGM=PAYROLL   * <-- S806 if PAYROLL is not in system path

* -- THE SOLUTION (Specify correct STEPLIB) --
//MYJOB    JOB (ACCT),'DEV'
//STEP1    EXEC PGM=PAYROLL
//STEPLIB  DD DSN=DEV.PROJECT.LOADLIB,DISP=SHR
//SYSIN    DD *
...`
  },
  {
    code: "SB37",
    title: "Volume Space Exhausted (Extent Limit)",
    category: "Space",
    severity: "HIGH",
    description: "An SB37 space abend occurs when a dataset requires more space to write data, but the system cannot allocate any more space on the volume because the dataset has already reached the maximum limit of 16 extents per volume.",
    causes: [
      "The primary space allocation in JCL was too small, forcing the system to allocate small secondary extents until the 16-extent limit was reached.",
      "The disk volume became full and could not allocate the requested secondary space.",
      "Processing a much larger input file than planned without adjusting the JCL space parameters."
    ],
    fix: "1. Increase the primary space allocation parameters in the JCL.\n2. Ensure secondary allocation size is large enough to handle overflow (e.g., 20% to 50% of the primary size).\n3. Enable multi-volume allocations by specifying unit volume counts: e.g., UNIT=(SYSDA,5).",
    proTip: "Use SMS (Storage Managed Subsystem) data classes that support 'Extended Format' and 'Dynamic Volume Association' to automatically bypass the 16-extent volume boundary, consolidating extents dynamically.",
    snippet: `* -- THE PROBLEM (Insufficient Primary & Secondary space) --
//OUTDD    DD DSN=PROD.EXPORT.DATA,DISP=(NEW,CATLG,DELETE),
//            UNIT=SYSDA,SPACE=(TRK,(5,1)) * Max capacity: 5 + (15 * 1) = 20 tracks

* -- THE SOLUTION (Optimized Primary and secondary parameters) --
//OUTDD    DD DSN=PROD.EXPORT.DATA,DISP=(NEW,CATLG,DELETE),
//            UNIT=SYSDA,SPACE=(CYL,(50,10),RLSE) * RLSE releases unused space`
  },
  {
    code: "SD37",
    title: "Out of Space on Volume",
    category: "Space",
    severity: "HIGH",
    description: "An SD37 abend occurs when a dataset needs to write a new record, but no space is available on the current disk volume, and no secondary volume is defined or available.",
    causes: [
      "The targeted storage volume became 100% physically full during job execution.",
      "No secondary volumes were specified in the JCL (causing the write to fail once the first volume ran out of space)."
    ],
    fix: "1. Point the job to a different storage volume pool with more free space.\n2. Define secondary volumes in your DD card: e.g., UNIT=(SYSDA,3) and specify multiple volume serials (VOL=SER=(VOL001,VOL002)).\n3. Set up SMS rules to distribute datasets across less active volumes.",
    proTip: "Always monitor volume saturation. In modern batch environments, routing files to virtual tape systems or dynamic SMS storage classes is preferred over targeting static volumes.",
    snippet: `* -- THE SOLUTION (Allocate across multiple volumes) --
//MYDATA   DD DSN=PROD.LARGE.FILE,DISP=(NEW,CATLG,DELETE),
//            UNIT=(SYSDA,3),VOL=SER=(VOL001,VOL002,VOL003),
//            SPACE=(CYL,(100,50),RLSE)`
  },
  {
    code: "SE37",
    title: "PDS Directory Exhausted",
    category: "Space",
    severity: "HIGH",
    description: "An SE37 space abend occurs when a partitioned dataset (PDS) runs out of directory blocks, preventing new members from being created, even if there is physical space left in the dataset.",
    causes: [
      "A JCL allocation allocated too few directory blocks (the third parameter in the SPACE parameter).",
      "Repeatedly updating and replacing members in a PDS without compressing it (PDS members leave dead space until compressed)."
    ],
    fix: "1. Reallocate the Partitioned Dataset with a higher number of directory blocks: e.g., SPACE=(CYL,(10,5,50)) where 50 is the directory block parameter.\n2. Execute a compression step using utility IEBCOPY (command: ALTER/COPY) or TSO command 'COMPRESS' to reclaim dead space.\n3. Migrate the dataset to a PDSE (Library) format which manages directory space dynamically and does not require compression.",
    proTip: "Solution architects should mandate the use of DSNTYPE=LIBRARY (PDSE) for all project source libraries and JCL libraries, completely eliminating directory block abends and the need for periodic compressions.",
    snippet: `* -- THE PROBLEM (PDS with small directory blocks) --
//JCLIB    DD DSN=USER.TEST.JCLIB,DISP=(NEW,CATLG,DELETE),
//            UNIT=SYSDA,SPACE=(TRK,(10,5,2))  * Only 2 directory blocks (approx 8 members)

* -- THE SOLUTION (Define PDSE Library - No block limit) --
//JCLIB    DD DSN=USER.TEST.JCLIB,DISP=(NEW,CATLG,DELETE),
//            UNIT=SYSDA,DSNTYPE=LIBRARY,      * PDSE automatically handles directories
//            SPACE=(CYL,(5,2))`
  },
  {
    code: "ASRA",
    title: "CICS Program Check",
    category: "CICS",
    severity: "CRITICAL",
    description: "An ASRA abend is a generic CICS transaction abend code indicating that a program check (hardware exception) has occurred in an application program.",
    causes: [
      "An underlying S0C7 data exception (operating on non-numeric data) inside a COBOL-CICS program.",
      "An underlying S0C4 protection exception (referencing pointer addresses before linkage mapping is active).",
      "Division by zero (System code S0C9)."
    ],
    fix: "1. Access CICS diagnostic facilities like CEDF (Execution Diagnostic Facility) or review CICS logs.\n2. Locate the failing statement offset in the transaction dump.\n3. Sanitize data inputs using NUMERIC class checks and verify COMMAREA dimensions using EIBCALEN checks.",
    proTip: "Use CICS HANDLE ABEND commands or modern EXEC CICS ASSIGN variables to capture failures gracefully, redirecting users to an error screen rather than letting the transaction crash with ASRA.",
    snippet: `* -- THE SOLUTION (Graceful Abend handling) --
EXEC CICS HANDLE ABEND
    LABEL(ERR-EXIT-PARA)
END-EXEC.
...
* -- Error Exit Paragraph --
ERR-EXIT-PARA.
    MOVE "TRANS FAILED - DATA EXCEPTION CHECK" TO MSG-OUT.
    EXEC CICS SEND TEXT FROM(MSG-OUT) FREEKB END-EXEC.
    EXEC CICS RETURN END-EXEC.`
  },
  {
    code: "AEIP",
    title: "CICS Invalid Parameter",
    category: "CICS",
    severity: "MEDIUM",
    description: "An AEIP abend is triggered when a CICS command fails because one or more parameters passed to the CICS API are invalid or fail system validation checks.",
    causes: [
      "Specifying a length parameter larger than the actual allocated memory block.",
      "Referencing a mapset or map name that does not exist in the PPT or target load paths.",
      "Invoking CICS commands that are restricted in the current environment (e.g. file control command on a read-disabled file)."
    ],
    fix: "1. Inspect the CICS execution logs to determine the exact command that triggered AEIP (e.g., READ, SEND MAP).\n2. Verify that length variables (e.g. FLENGTH or LENGTH) match memory block layouts.\n3. Ensure all maps and resources referenced are defined and enabled in CSD (CICS System Definition).",
    proTip: "Use RESP and RESP2 options in every EXEC CICS command to capture condition codes programmatically and handle them, preventing CICS from automatically abending with AEIP.",
    snippet: `* -- THE PROBLEM (Automatic Abend) --
EXEC CICS READ DATASET('CUSTFILE') INTO(WS-REC) RIDFLD(WS-KEY) END-EXEC.
* Triggers AEIP or AEIM (Record Not Found) if file is disabled.

* -- THE SOLUTION (Handle response programmatically) --
EXEC CICS READ DATASET('CUSTFILE') 
          INTO(WS-REC) 
          RIDFLD(WS-KEY)
          RESP(WS-RESP)
END-EXEC.
IF WS-RESP = DFHRESP(NORMAL)
    DISPLAY "RECORD RETRIEVED"
ELSE
    IF WS-RESP = DFHRESP(NOTFND)
        DISPLAY "RECORD NOT FOUND"
    ELSE
        DISPLAY "CICS FILE ERROR CODE: " WS-RESP
    END-IF
END-IF`
  },
  {
    code: "SQLCODE -305",
    title: "Null Value Without Indicator Variable",
    category: "DB2",
    severity: "HIGH",
    description: "A SQLCODE -305 indicates that a DB2 SELECT, FETCH, or cursor operation retrieved a NULL value from the database, but the COBOL program did not provide an indicator variable to receive the NULL state.",
    causes: [
      "The database column allows NULL values, but the program host variables only mapped the data component (e.g., WS-CUST-PHONE) without the accompanying 2-byte sign field.",
      "A LEFT JOIN returned no match, causing join columns to evaluate as NULL without proper indicator variables."
    ],
    fix: "1. Declare a 2-byte binary host variable (PIC S9(4) COMP) immediately after the main variable.\n2. Include both variables in the SQL SELECT statement: e.g., SELECT PHONE INTO :WS-PHONE :WS-PHONE-IND.\n3. Check the indicator variable value. If it holds a negative value (normally -1), the database returned NULL.",
    proTip: "Establish a coding standard where any column defined as nullable must be bound to a null-indicator variable, or use the COALESCE or VALUE functions inside your SQL queries to replace NULLs with default values at the DB2 level.",
    snippet: `* -- THE PROBLEM (Crashes if column is NULL) --
EXEC SQL
    SELECT EMAIL INTO :WS-EMAIL
    FROM CUSTOMERS WHERE ID = :WS-ID
END-EXEC.

* -- THE SOLUTION (Indicator variable bound) --
01  WS-EMAIL         PIC X(50).
01  WS-EMAIL-IND     PIC S9(4) COMP. * Indicator variable

EXEC SQL
    SELECT EMAIL INTO :WS-EMAIL :WS-EMAIL-IND
    FROM CUSTOMERS WHERE ID = :WS-ID
END-EXEC.

IF WS-EMAIL-IND < 0
    MOVE "N/A" TO WS-EMAIL * Null value handled
END-IF`
  },
  {
    code: "SQLCODE -818",
    title: "Timestamp Mismatch (Consistency Token)",
    category: "DB2",
    severity: "HIGH",
    description: "A SQLCODE -818 indicates a timestamp mismatch between the load module (compiled code) and the DB2 bind package/plan, indicating the load module was recompiled without binding the database packages.",
    causes: [
      "The program was compiled and link-edited into the load library, but the BIND command was not executed to update the database plan/package catalog.",
      "Running an older version of the program load module with a newly bound database package (or vice versa)."
    ],
    fix: "1. Re-run the BIND PACKAGE or BIND PLAN step in your JCL compilation pipeline using the DBRM (Database Request Module) generated during compiler pre-processing.\n2. Ensure the STEPLIB points to the correct library where the latest load module member resides.",
    proTip: "Configure automated CI/CD pipelines (e.g., GitLab CI or Jenkins) to automatically bind the program's DBRM to the target DB2 subsystem environment whenever the COBOL code is compiled, preventing timestamp mismatches.",
    snippet: `//-- JCL BIND STEP EXAMPLE --
//BINDSTEP EXEC PGM=IKJEFT01
//STEPLIB  DD DSN=DSN10.SDSNLOAD,DISP=SHR
//DBRMLIB  DD DSN=DEV.PROJECT.DBRMLIB,DISP=SHR
//SYSTSIN  DD *
DSN SYSTEM(DB2P)
 BIND PACKAGE(COLL1) MEMBER(PAYPROG) -
      ACTION(REPLACE) VALIDATE(BIND) -
      ISOLATION(CS) RELEASE(COMMIT)
 END
/*`
  },
  {
    code: "SQLCODE -904",
    title: "Resource Unavailable",
    category: "DB2",
    severity: "HIGH",
    description: "A SQLCODE -904 indicates that a DB2 database operation failed because a required resource (such as a tablespace, partition, index, or buffer pool) was unavailable.",
    causes: [
      "The tablespace is currently locked in exclusive mode by another utility/job (e.g. running a image copy or reorg).",
      "The user transaction exceeded lock limits (NUMLKTS or NUMLKUS parameters), causing the connection thread to abend.",
      "The targeted tablespace or database was placed in 'STOP' status by a database administrator."
    ],
    fix: "1. Check the DB2 reason code provided in the SQLERRMC field of the SQLCA structure to identify the specific resource.\n2. Resubmit the job after verify that conflicting utilities have finished.\n3. Increase lock parameters or request DBA support to run a START command on the tablespace.",
    proTip: "Implement retry logic or transaction block limits (periodic COMMITs) in batch programs to keep lock counts well below NUMLKUS limits, avoiding resource escalation and -904 failures.",
    snippet: `* -- COBOL SQLCODE -904 HANDLING --
EXEC SQL
    UPDATE CUSTOMERS SET STATUS = 'A' WHERE REGION = 'EAST'
END-EXEC.

IF SQLCODE = -904
    DISPLAY "DB2 ERROR: RESOURCE UNAVAILABLE: " SQLERRMC
    EXEC SQL ROLLBACK END-EXEC
    MOVE 12 TO RETURN-CODE
END-IF`
  },
  {
    code: "SQLCODE -911",
    title: "Deadlock or Timeout (Rollback Triggered)",
    category: "DB2",
    severity: "HIGH",
    description: "A SQLCODE -911 indicates that a transaction was rolled back automatically by DB2 because it became deadlock-locked with another transaction, or it timed out waiting for a lock to be released.",
    causes: [
      "Two jobs attempting to update the same table rows in reverse order simultaneously.",
      "Long-running batch update steps processing massive amounts of data without issuing periodic COMMIT commands.",
      "High online transaction volumes locking tablespaces, causing batch jobs to time out."
    ],
    fix: "1. Implement periodic COMMITs in batch jobs (e.g., every 1000 updates) to release locks and minimize timeout exposure.\n2. Ensure all programs access database tables in the same order (e.g., update Table A then Table B) to prevent circular deadlock waits.\n3. Resubmit the job (in most cases, retry logic will succeed after the competing transaction completes).",
    proTip: "If deadlocks are frequent, consult DBAs to switch locking granularity from Tablespace or Page-level locks to Row-level locks, reducing contention at the cost of slight lock manager memory overhead.",
    snippet: `* -- THE SOLUTION (Periodic COMMIT in batch loop) --
PERFORM UNTIL END-OF-FILE
    READ CUST-FILE INTO WS-CUST-REC
    ...
    EXEC SQL
        UPDATE CUSTOMERS SET BAL = :WS-BAL WHERE ID = :WS-ID
    END-EXEC
    
    ADD 1 TO WS-UPDATE-COUNT
    IF WS-UPDATE-COUNT >= 500
        EXEC SQL COMMIT END-EXEC
        MOVE ZERO TO WS-UPDATE-COUNT
    END-IF
END-PERFORM.
EXEC SQL COMMIT END-EXEC. * Commit remainder`
  }
];
