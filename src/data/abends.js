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
  }
];
