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
  },
  {
    code: "S0C5",
    title: "Addressing Exception",
    category: "System",
    severity: "CRITICAL",
    description: "An S0C5 abend occurs when the program specifies an effective address that is outside the range of available virtual storage allocations.",
    causes: [
      "Invalid index or subscript calculations pointing to an unallocated region of memory.",
      "Buffer overflow causing the storage pointers of variables to become corrupted.",
      "Incorrect base register usage (usually in assembler subprograms)."
    ],
    fix: "1. Inspect the abend dump output for index boundary checks.\n2. Enable the SSRANGE compiler option during testing to locate addressing boundary overflows.\n3. Initialize base pointers before attempting storage updates.",
    proTip: "Testing with SSRANGE intercepts subscript address out-of-bounds at runtime and raises a clear warning instead of crashing with an S0C5 dump.",
    snippet: `* -- THE PROBLEM (SSRANGE catches this) --
01  TABLE-DATA.
    05  ARRAY-VAL  PIC X(10) OCCURS 5 TIMES.
...
MOVE "A" TO ARRAY-VAL(9) * <-- Address exception S0C5 (9 exceeds 5)`
  },
  {
    code: "S0C9",
    title: "Divide by Zero Exception",
    category: "System",
    severity: "HIGH",
    description: "An S0C9 abend occurs when an arithmetic statement attempts to divide a number by zero using binary integer division rules.",
    causes: [
      "Input variables representing the divisor hold zero due to missing input validation.",
      "Accumulator registers were not cleared prior to loop execution."
    ],
    fix: "1. Add defensive IF checks before executing division: e.g., IF WS-DIVISOR IS NOT EQUAL TO ZERO.\n2. Ensure variables are initialized correctly.",
    proTip: "Always validate variables that serve as dividers in calculation engines before triggering division instructions.",
    snippet: `* -- THE SOLUTION (Defensive Check) --
IF WS-DIVISOR NOT = ZERO
    DIVIDE WS-TOTAL BY WS-DIVISOR GIVING WS-AVG
ELSE
    MOVE ZERO TO WS-AVG
END-IF`
  },
  {
    code: "SQLCODE -104",
    title: "Syntax Error in SQL Statement",
    category: "DB2",
    severity: "HIGH",
    description: "An SQLCODE -104 indicates that a database query could not be executed because it contains a grammar or syntax error.",
    causes: [
      "Misspelled SQL reserved keyword (e.g. SELECT, FROM, WHERE).",
      "Missing commas between selected column targets, or unbalanced parenthesis.",
      "Invalid host variable binding syntax (missing colon prefix)."
    ],
    fix: "1. Check the SQL statement details around the token printed in the SQLERRMC.\n2. Ensure all host variables are prefixed with a colon (:WS-VAR).",
    proTip: "Utilize static code linting utilities or bind/precompile checks to validate SQL syntax prior to deployment.",
    snippet: `* -- THE PROBLEM (Missing Colon) --
EXEC SQL SELECT NAME INTO WS-NAME FROM EMP END-EXEC. * <-- Error!

* -- THE SOLUTION (Correct syntax) --
EXEC SQL SELECT NAME INTO :WS-NAME FROM EMP END-EXEC.`
  },
  {
    code: "SQLCODE -204",
    title: "Table or Object Not Defined",
    category: "DB2",
    severity: "HIGH",
    description: "An SQLCODE -204 indicates that the targeted table, view, or schema object name does not exist in the DB2 system catalog.",
    causes: [
      "Misspelled database object name.",
      "Connecting to the wrong database schema environment (e.g., pointing to DEV instead of PROD schema).",
      "Object was dropped by a database administrator."
    ],
    fix: "1. Verify table names match the DB2 catalog.\n2. Check DB2 schema prefix parameters (e.g. SELECT * FROM SCHEMA.TABLE).\n3. Re-run BIND steps specifying the correct Qualifier schema.",
    proTip: "Use QUALIFIER parameter in JCL BIND cards to direct packages to the correct database schema without hardcoding prefix names in application code.",
    snippet: `//-- JCL BIND WITH QUALIFIER --
//BIND    EXEC PGM=IKJEFT01
//SYSTSIN  DD *
 DSN SYSTEM(DB2D)
 BIND PACKAGE(COLL) MEMBER(PROG) QUALIFIER(DEVSCHEMA)`
  },
  {
    code: "SQLCODE -206",
    title: "Column Not Found in Table",
    category: "DB2",
    severity: "HIGH",
    description: "An SQLCODE -206 indicates that a column name referenced in a SELECT, INSERT, UPDATE, or WHERE clause does not exist in the targeted table definition.",
    causes: [
      "Column name misspelling in the query text.",
      "Mismatch between the table schema version and the static DCLGEN mapping structure used in the COBOL code."
    ],
    fix: "1. Regenerate DCLGEN declarations using DB2 utility panels.\n2. Cross-reference columns with DB2 system catalog tables (SYSIBM.SYSCOLUMNS).",
    proTip: "Always update DCLGEN structures in your copybooks whenever database columns are modified to ensure code variables match DB2 column catalogs.",
    snippet: `* -- COPYBOOK DCLGEN MAPPING EXAMPLE --
EXEC SQL DECLARE EMPLOYEE TABLE
( EMP_ID           INTEGER NOT NULL,
  EMP_NAME         CHAR(30) NOT NULL
) END-EXEC.`
  },
  {
    code: "SQLCODE -501",
    title: "Cursor Not Open",
    category: "DB2",
    severity: "HIGH",
    description: "An SQLCODE -501 indicates that a FETCH or CLOSE statement was executed against a DB2 cursor that is not currently open.",
    causes: [
      "Executing a FETCH statement before calling EXEC SQL OPEN cursor-name END-EXEC.",
      "Cursor closed automatically due to a prior COMMIT statement (when not declared WITH HOLD).",
      "Calling program logic skipped the OPEN paragraph due to condition branch changes."
    ],
    fix: "1. Inspect execution flow to ensure OPEN cursor executes before FETCH.\n2. Add WITH HOLD parameter to the cursor declaration if commits are processed within the fetch loop.",
    proTip: "Always specify DECLARE CURSOR ... WITH HOLD if you intend to execute database commits while looping through fetched cursor rows.",
    snippet: `* -- THE SOLUTION (Cursor WITH HOLD) --
EXEC SQL
    DECLARE C1 CURSOR WITH HOLD FOR
    SELECT EMP_ID FROM EMPLOYEE
END-EXEC.
...
EXEC SQL OPEN C1 END-EXEC.
PERFORM UNTIL SQLCODE = 100
    EXEC SQL FETCH C1 INTO :WS-ID END-EXEC
    * Commit here will not close the cursor:
    EXEC SQL COMMIT END-EXEC
END-PERFORM.
EXEC SQL CLOSE C1 END-EXEC.`
  },
  {
    code: "SQLCODE -803",
    title: "Duplicate Key Violation",
    category: "DB2",
    severity: "HIGH",
    description: "An SQLCODE -803 indicates that an INSERT or UPDATE statement failed because it attempted to create a row with a key that already exists in a unique index.",
    causes: [
      "Application logic failed to check for existing records before inserting new rows.",
      "Duplicate record present in input batch file.",
      "Sequence generator or key allocation index became out of sync."
    ],
    fix: "1. Check the duplicate key values in SQLERRMC.\n2. Add pre-existence verification checks: e.g., SELECT COUNT(*) to verify if key exists before running INSERT.\n3. Wrap insert operations in exception handlers and update SQLCODE error logic.",
    proTip: "In transaction engines, use MERGE statements (or check-before-insert) to handle duplicate write conflicts cleanly without throwing fatal database exceptions.",
    snippet: `* -- THE SOLUTION (Check SQLCODE -803) --
EXEC SQL
    INSERT INTO EMPLOYEE (EMP_ID, EMP_NAME) VALUES (:WS-ID, :WS-NAME)
END-EXEC.
IF SQLCODE = -803
    DISPLAY "RECORD ALREADY EXISTS, SWITCHING TO UPDATE..."
    PERFORM UPDATE-RECORD-PARA
END-IF`
  },
  {
    code: "S222",
    title: "Job Cancelled by Operator",
    category: "System",
    severity: "HIGH",
    description: "An S222 abend indicates that the running job was cancelled by a system operator or automated scheduling system without requesting a memory dump.",
    causes: [
      "Job was hanging or stuck in lock contention.",
      "Operator cancelled the job manually to free up resources.",
      "The job entered an infinite loop or exceeded CPU resource allocation thresholds."
    ],
    fix: "1. Check the operator log messages to see the reason for cancellation.\n2. Check for deadlock warnings or infinite loops in execution code.\n3. Re-run during low-activity schedules if resource contention was the primary cause.",
    proTip: "Add status logging outputs to batch loops so operators can see job progress. If progress stops, they can isolate lock conditions before cancelling.",
    snippet: `* -- JCL LOG MESSAGE --
$HASP395 BATCHJOB2 CANCELLED BY OPERATOR`
  },
  {
    code: "S913",
    title: "RACF Security Access Violation",
    category: "System",
    severity: "HIGH",
    description: "An S913 abend occurs when a job step attempts to open a dataset or access a system resource for which it does not have RACF (Resource Access Control Facility) authorization.",
    causes: [
      "The user executing the JCL does not have read/write permissions for the dataset defined in JCL DD statements.",
      "The job attempts to access tape volumes or system catalog resources without security credentials."
    ],
    fix: "1. Check the console message: e.g., ICH408I USER(userid) GROUP(group) CL(DATASET) INSUFFICIENT ACCESS AUTHORITY.\n2. Contact security administrators to grant access to the resource (e.g. using PERMIT command).",
    proTip: "Use RACF groups to manage permissions for batch job steps instead of assigning permissions to individual developer IDs, ensuring consistent access across project teams.",
    snippet: `* -- RACF COMMANDS --
* Check dataset permissions:
LISTDSD DATASET('PROD.CUSTOMER.DATA')
* Grant READ access:
PERMIT 'PROD.CUSTOMER.DATA' CLASS(DATASET) ID(DEVGRP) ACCESS(READ)`
  },
  {
    code: "U4038",
    title: "Language Environment (LE) Runtime Error",
    category: "System",
    severity: "HIGH",
    description: "A U4038 user abend is a generic runtime wrapper exception issued by IBM Language Environment (LE) indicating that a fatal execution error occurred inside a high-level language program (COBOL/PL/I).",
    causes: [
      "An unhandled severity 2 or higher LE error (such as mathematical library errors, file status mismatches, or internal compiler failures).",
      "Calling a subprogram with mismatching parameter counts, causing variable corruption in memory."
    ],
    fix: "1. Review the CEEDUMP or SYSOUT log outputs to view the original error code wrapped by the U4038 exception.\n2. Locate the specific error condition (such as status key codes or numerical overflows) and handle it programmatically.",
    proTip: "Ensure that JCL jobs allocate a SYSOUT DD statement for the CEEDUMP log so you can view LE diagnostics details rather than seeing only the generic U4038 code.",
    snippet: `* -- CEEDUMP DIAGNOSTICS SCREEN --
CEE3207S The system detected a data exception.
Location: Program COBPROG at statement 120.`
  },
  {
    code: "LENGERR",
    title: "CICS COMMAREA Length Error",
    category: "CICS",
    severity: "MEDIUM",
    description: "A LENGERR abend occurs when a program attempts to pass or read data from the CICS COMMAREA (or other containers) using size parameters that exceed actual allocation limits.",
    causes: [
      "The program tried to read DFHCOMMAREA fields when EIBCALEN was smaller than the structure format (or equal to 0).",
      "Mismatched data structure lengths between the calling CICS program and the called CICS program."
    ],
    fix: "1. Add length validation checks inside the PROCEDURE DIVISION before referencing linkage variables.\n2. Verify that copybook layouts are identical across calling and receiving programs.",
    proTip: "Always check EIBCALEN values before accessing COMMAREA fields. If EIBCALEN is 0, initialize default empty layouts instead of attempting direct variable moves.",
    snippet: `* -- THE SOLUTION (Defensive Length Check) --
PROCEDURE DIVISION.
    IF EIBCALEN = ZERO
        PERFORM INITIALIZE-NEW-SCREEN-PARA
    ELSE
        IF EIBCALEN < LENGTH OF DFHCOMMAREA
            PERFORM LENGERR-HANDLER-PARA
        ELSE
            MOVE DFHCOMMAREA TO WS-LOCAL-DATA
        END-IF
    END-IF.`
  },
  {
    code: "S013",
    title: "DCB Parameter Mismatch at OPEN",
    category: "System",
    severity: "HIGH",
    description: "An S013 abend indicates that a dataset could not be opened successfully due to a conflict in DCB (Data Control Block) parameters (such as logical record length LRECL, block size BLKSIZE, or record format RECFM) between the COBOL SELECT/FD clause and the JCL DD statement or physical file label.",
    causes: [
      "The program FD clause specifies a different LRECL (Logical Record Length) than the JCL DD parameter or the cataloged dataset structure.",
      "The block size is not a multiple of the record length in fixed blocked files (FBA/FB).",
      "Mismatched record formats (e.g. attempting to read a variable-length file using fixed-block FD layout)."
    ],
    fix: "1. Locate the failing DD statement in the job log (specified in message IEC141I).\n2. Cross-reference the compiler program FD clause description with the physical file definition using dynamic catalog lookups.\n3. Align JCL SPACE, LRECL, and RECFM parameters to match the compiled program specifications.",
    proTip: "Use dynamic block sizes (BLKSIZE=0) in JCL allocations to let DFSMS calculate the optimal block size for the device, preventing mismatch errors and maximizing track storage density.",
    snippet: `* -- COBOL FD CLAUSE --
FD  INPUT-FILE
    RECORD CONTAINS 80 CHARACTERS
    RECORDING MODE IS F.
01  IN-RECORD        PIC X(80).

* -- THE PROBLEM (JCL Mismatch) --
//SYSUT1   DD DSN=MY.DATASET,DISP=SHR,
//            LRECL=100,RECFM=FB  * <-- S013-34 Open Abend!

* -- THE SOLUTION (Match JCL block structure) --
//SYSUT1   DD DSN=MY.DATASET,DISP=SHR,
//            LRECL=80,RECFM=FB`
  },
  {
    code: "S213",
    title: "Dataset Open Volume Mismatch",
    category: "System",
    severity: "HIGH",
    description: "An S213 abend occurs during an OPEN statement when a partitioned dataset member was not found, or the dataset was bypassed due to missing catalog references on the target disk volume.",
    causes: [
      "The specified member of a Partitioned Dataset (PDS/PDSE) does not exist.",
      "The dataset catalog entry is incorrect, pointing to a disk volume serial number that is offline or incorrect.",
      "A tape file volume sequence mismatch."
    ],
    fix: "1. Verify member names in PDS/PDSE using ISPF panels.\n2. Ensure the catalog lists the dataset correctly, or supply explicit VOL=SER serial numbers in JCL.",
    proTip: "Ensure all datasets are cataloged globally rather than referenced via static JCL volume serialization (VOL=SER) to avoid runtime S213 open failures.",
    snippet: `* -- THE PROBLEM (Missing member in PDS) --
//SYSIN    DD DSN=PROD.JCL.CNTL(MEMBERA),DISP=SHR  * <-- S213-04 if MEMBERA is missing!

* -- THE SOLUTION (Ensure member exists) --
//SYSIN    DD DSN=PROD.JCL.CNTL(MEMBERB),DISP=SHR  * MEMBERB verified in PDS directory`
  },
  {
    code: "SQLCODE -805",
    title: "DB2 Package Not Found",
    category: "DB2",
    severity: "HIGH",
    description: "An SQLCODE -805 indicates that DB2 was unable to locate the package associated with the executed program plan. The package was not bound into the collection referenced by the plan.",
    causes: [
      "The package was compiled and precompiled, but BIND PACKAGE was not run in the subsystem.",
      "The collection name (COLLID) or package name in the DBRM does not match the DB2 system catalog references.",
      "Mismatch between the package consistency token (timestamp) and the precompiled source program module."
    ],
    fix: "1. Check the SQLERRMC field to find the collection name, package name, and consistency token.\n2. Run the JCL BIND step targeting the correct DB2 collection name.\n3. Recompile and rebind the program to align the load modules with the database catalog.",
    proTip: "Define package collections dynamically in plans by using the PKLIST parameter: e.g., PKLIST(COLL.*). This enables binding new packages to the collection without rebinding the whole plan.",
    snippet: `//-- JCL BIND PACKAGE STEP --
//BINDDB2  EXEC PGM=IKJEFT01
//SYSTSIN  DD *
 DSN SYSTEM(DB2P)
 BIND PACKAGE(PRODCOLL) MEMBER(PAYROLL) ACTION(REPLACE)
 BIND PLAN(PAYPLAN) PKLIST(PRODCOLL.*) ACTION(REPLACE)
 END
/*`
  },
  {
    code: "MAPFAIL",
    title: "CICS MAPFAIL Screen Input Error",
    category: "CICS",
    severity: "MEDIUM",
    description: "A MAPFAIL abend occurs in CICS when a RECEIVE MAP command is executed, but no data was entered on the terminal screen, or the user pressed an invalid AID key (like CLEAR or PA1/PA2) which does not transmit data fields.",
    causes: [
      "The user pressed CLEAR or PA keys and program logic tried to execute RECEIVE MAP directly.",
      "The input map fields had zero length, transmitting no modified data tags (MDT) to CICS."
    ],
    fix: "1. Establish checks for terminal attention identifier keys (EIBAID) prior to executing RECEIVE MAP.\n2. Bind condition handling: EXEC CICS HANDLE CONDITION MAPFAIL(MAPFAIL-PARA) END-EXEC.",
    proTip: "Enable the Modified Data Tag (MDT) attribute (FSET) in the map definition for at least one hidden field (like a screen title) to force the transmission of screen headers even if the user enters no data.",
    snippet: `* -- THE SOLUTION (Check EIBAID before RECEIVE) --
PROCEDURE DIVISION.
    IF EIBAID = DFHCLEAR OR DFHPA1 OR DFHPA2
        EXEC CICS SEND TEXT FROM(MSG-EXIT) FREEKB END-EXEC
        EXEC CICS RETURN END-EXEC
    END-IF.
    
    EXEC CICS HANDLE CONDITION
        MAPFAIL(MAPFAIL-HANDLER-PARA)
    END-EXEC.
    
    EXEC CICS RECEIVE MAP('SCREEN1') MAPSET('MAPSET1') END-EXEC.
    ...
MAPFAIL-HANDLER-PARA.
    MOVE "PLEASE ENTER VALID DATA TO SUBMIT" TO MSG-OUT.
    PERFORM SEND-ERROR-SCREEN-PARA.`
  },
  {
    code: "File Status 35",
    title: "Dataset/File Not Found",
    category: "File Status",
    severity: "HIGH",
    description: "File Status 35 occurs when a program attempts to open a file in input or input-output mode, but the physical dataset referenced in the JCL DD statement or environment variable does not exist, is not cataloged, or is spelled incorrectly.",
    causes: [
      "The physical dataset specified in the JCL DD card does not exist in the system catalog.",
      "The dataset name (DSN) in the JCL is misspelled.",
      "The program attempts to open a relative/indexed file that has not been initialized."
    ],
    fix: "1. Check the JCL DD card corresponding to the logical file name and verify the DSN spelling.\n2. Verify the physical file exists using ISPF 3.4 or system catalogs.\n3. Change disposition parameters or pre-allocate the file using utilities (e.g., IEFBR14) if needed.",
    proTip: "In corporate batch execution, use automated scheduler checks (like Control-M or OPC) to verify input file existence prior to job dispatch, preventing status 35 run-time abends.",
    snippet: `* -- THE PROBLEM (Attempting to open non-existent file) --
//SYSUT1   DD DSN=PROD.TRANS.DATA1,DISP=SHR  * If DSN does not exist
...
OPEN INPUT TRANSACTION-FILE.  * <-- Crashes with FILE STATUS = 35!

* -- THE SOLUTION (Defensive checking in COBOL) --
OPEN INPUT TRANSACTION-FILE.
IF FILE-STATUS-VAR = "35"
    DISPLAY "ERROR: Physical file not found!"
    MOVE 12 TO RETURN-CODE
    GOBACK
END-IF.`
  },
  {
    code: "File Status 39",
    title: "Record Attributes Mismatch",
    category: "File Status",
    severity: "HIGH",
    description: "File Status 39 occurs during an OPEN statement when the attributes of the physical file (such as Logical Record Length LRECL, Record Format RECFM, or block size) do not match the compiled file descriptions (FD block and record contains clause) inside the COBOL program.",
    causes: [
      "The program FD clause specifies a record size different from the physical dataset's LRECL.",
      "The physical dataset has a variable record format (V/VB) but the program specifies a fixed format (F/FB), or vice versa.",
      "The JCL specifies an overriding LRECL parameter that conflicts with the physical dataset label and program definitions."
    ],
    fix: "1. Identify the logical file name that failed to open and locate the corresponding JCL DD card.\n2. Query the catalog to find the exact RECFM and LRECL of the physical dataset.\n3. Modify the program's FD clause or re-allocate/modify JCL DD parameters to align them exactly.",
    proTip: "Avoid hardcoding RECFM and LRECL values in JCL DD statements when referencing cataloged datasets; let DFSMS dynamically resolve the physical block size to match the compiled FD structure.",
    snippet: `* -- THE PROBLEM (FD expects 80 bytes, dataset is 100 bytes) --
FD  INPUT-FILE RECORD CONTAINS 80 CHARACTERS.
...
//SYSUT1   DD DSN=PROD.DATA,DISP=SHR  * physical LRECL=100
...
OPEN INPUT INPUT-FILE.  * <-- Crashes with FILE STATUS = 39!

* -- THE SOLUTION (Align sizes) --
FD  INPUT-FILE RECORD CONTAINS 100 CHARACTERS.
* Now compiled program matches the physical file attributes.`
  },
  {
    code: "File Status 92",
    title: "Logic Error (Invalid I/O Operation)",
    category: "File Status",
    severity: "HIGH",
    description: "File Status 92 indicates a program logic error where an I/O operation (like READ, WRITE, REWRITE, START, or CLOSE) is executed on a file that is not in a valid state for that operation (e.g. reading a file that is closed or has not been opened successfully).",
    causes: [
      "Attempting to READ or WRITE a file before executing the OPEN statement.",
      "Attempting to READ a file that was opened in OUTPUT mode, or WRITE to a file opened in INPUT mode.",
      "Attempting to execute I/O after a previous OPEN failed with a non-zero status key.",
      "Closing a file that was never successfully opened."
    ],
    fix: "1. Check the program execution flow to ensure the OPEN statement was executed and was successful (returned status '00') before any READ/WRITE operations.\n2. Ensure the access mode (INPUT, OUTPUT, I-O) in the OPEN statement matches the operation (READ, WRITE, REWRITE).\n3. Implement status key checks after every OPEN to prevent cascading logic errors.",
    proTip: "Always verify the status key immediately after an OPEN statement. If the status is not '00', log the error and bypass subsequent READ/WRITE logic to prevent File Status 92 errors.",
    snippet: `* -- THE PROBLEM (Reading closed file) --
* Initialization missed OPEN INPUT OUT-FILE
READ OUT-FILE INTO WS-REC.  * <-- Crashes with FILE STATUS = 92!

* -- THE SOLUTION (Defensive OPEN Verification) --
OPEN INPUT OUT-FILE.
IF OUT-FILE-STATUS NOT = "00"
    DISPLAY "ERROR OPENING FILE, STATUS: " OUT-FILE-STATUS
    MOVE 16 TO RETURN-CODE
    GOBACK
END-IF.
* Safe to read now:
READ OUT-FILE INTO WS-REC.`
  },
  {
    code: "File Status 23",
    title: "Record Key Not Found",
    category: "File Status",
    severity: "HIGH",
    description: "File Status 23 occurs in relative or indexed files (like VSAM KSDS) when a random READ, START, DELETE, or REWRITE statement is executed, but the record with the specified key does not exist in the file.",
    causes: [
      "The search key variable (RECORD KEY or RELATIVE KEY) holds a value that does not exist in the VSAM dataset.",
      "Key variables were not fully initialized or contained spaces or incorrect formatting.",
      "The program attempts to read a record from an empty VSAM index file."
    ],
    fix: "1. Implement INVALID KEY clauses in your READ/START statements to catch key-not-found exceptions programmatically.\n2. Validate the key content (e.g., ensure no trailing spaces or corrupt characters) before calling the I/O statement.\n3. If using dynamic access, check the file status key after the read to handle missing keys gracefully.",
    proTip: "Use the INVALID KEY clause in COBOL I/O operations on VSAM files to divert execution to a fallback path or error-log routine, preventing a runtime abend when keys are missing.",
    snippet: `* -- THE PROBLEM (Abends if key doesn't exist) --
MOVE "CUST999" TO CUST-KEY.
READ CUST-FILE. * <-- Crashes with FILE STATUS = 23!

* -- THE SOLUTION (INVALID KEY clause handling) --
MOVE "CUST999" TO CUST-KEY.
READ CUST-FILE
    INVALID KEY
        DISPLAY "CUSTOMER CUST999 NOT FOUND IN VSAM FILE"
        PERFORM HANDLE-MISSING-CUSTOMER-PARA
    NOT INVALID KEY
        PERFORM PROCESS-CUSTOMER-PARA
END-READ.`
  },
  {
    code: "File Status 22",
    title: "Duplicate Key Violation",
    category: "File Status",
    severity: "HIGH",
    description: "File Status 22 occurs when a WRITE statement is executed on an indexed or relative file (like VSAM KSDS), but the key value of the record being written already exists in a unique index of the file, violating the unique key constraint.",
    causes: [
      "Attempting to write a record with an duplicate primary key to a VSAM KSDS.",
      "Attempting to write a record that duplicates an active alternate index (AIX) key that was defined as UNIQUE.",
      "Missing pre-existence checks in program logic before inserting new transaction records."
    ],
    fix: "1. Implement the INVALID KEY clause on your WRITE statement to handle duplicates programmatically.\n2. Run a random READ using the key prior to WRITE to determine if the record already exists, switching to REWRITE if found.\n3. Clean and sanitize input datasets to remove duplicate transaction keys before running the update step.",
    proTip: "When writing to VSAM datasets, standardizing on a 'READ then WRITE/REWRITE' pattern or catching the Status 22 constraint violation programmatically prevents duplicate key crashes.",
    snippet: `* -- THE PROBLEM (Duplicate key write failure) --
MOVE "EMP102" TO EMP-KEY.
WRITE EMP-RECORD.  * <-- Crashes with FILE STATUS = 22 if duplicate!

* -- THE SOLUTION (INVALID KEY intercept & REWRITE fallback) --
MOVE "EMP102" TO EMP-KEY.
WRITE EMP-RECORD
    INVALID KEY
        DISPLAY "KEY ALREADY EXISTS, UPDATING INSTEAD..."
        REWRITE EMP-RECORD
    NOT INVALID KEY
        DISPLAY "NEW EMPLOYEE RECORD SAVED"
END-WRITE.`
  },
  {
    code: "File Status 10",
    title: "End of File Reached",
    category: "File Status",
    severity: "MEDIUM",
    description: "File Status 10 indicates that a sequential READ statement was executed on a file, but the end of the file (EOF) has already been reached and no more records are available to read.",
    causes: [
      "The program continued calling the READ statement in a loop without checking if the previous read returned the EOF condition.",
      "An infinite loop where the exit condition (like checking for EOF) is never met or updated.",
      "Attempting to read a dataset that is empty."
    ],
    fix: "1. Add the AT END clause to the sequential READ statement to handle stream completion.\n2. Set an end-of-file flag variable when AT END triggers, and ensure the loop condition checks this flag before executing subsequent reads.\n3. Verify that the loop control variables are updated correctly.",
    proTip: "Always use structured loops with a clear EOF indicator variable (e.g., PERFORM UNTIL EOF-FLAG = 'Y') to ensure the program never attempts to read past the end of the dataset.",
    snippet: `* -- THE PROBLEM (Infinite loop reading past EOF) --
* Loops indefinitely if EOF condition is not evaluated
PERFORM UNTIL WS-DONE = "Y"
    READ IN-FILE INTO WS-REC
    PERFORM PROCESS-REC
END-PERFORM.

* -- THE SOLUTION (AT END Clause) --
MOVE "N" TO WS-EOF-FLAG.
PERFORM UNTIL WS-EOF-FLAG = "Y"
    READ IN-FILE INTO WS-REC
        AT END
            MOVE "Y" TO WS-EOF-FLAG
        NOT AT END
            PERFORM PROCESS-REC
    END-READ
END-PERFORM.`
  }
];
