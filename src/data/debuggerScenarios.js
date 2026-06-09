export const SIMULATOR_SCENARIOS = [
  {
    id: 1,
    title: "Batch Payroll Processing Failure",
    log: `IEF450I PAYROLL JOB1 STEP20 - ABEND=S0C7 U0000 REASON=00000007
GP0010I  *** DB2 SQLCA INTERCEPT IN PROGRAM PAYCALC ***
CEE3250C The system detected a data exception (System Completion Code=0C7).
         From entry point PAYROLL-CALC at statement 243 at address 1A09E380.
SYSOUT OUTPUT:
WS-HOURS = '40.00' (hex: F4F0F0F0)
WS-RATE  = '     ' (hex: 4040404040) <-- ERROR`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S0C7", "S0C4", "S322", "SB37"],
    answer1: "S0C7",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Initialize WS-RATE to zero and check 'IF WS-RATE IS NUMERIC' before processing.",
      "Increase the JCL REGION size to REGION=64M in the JOB card.",
      "Add a secondary allocation block to the space definition in JCL.",
      "Recompile the DB2 package with timestamp token updates."
    ],
    answer2: "Initialize WS-RATE to zero and check 'IF WS-RATE IS NUMERIC' before processing.",
    explanation: "The log shows WS-RATE contains spaces (hex 4040404040), which causes a S0C7 data exception when used in arithmetic. The correct solution is initialization and numeric verification."
  },
  {
    id: 2,
    title: "Production File Export Failure",
    log: `IEF251I EXPORTJOB STEP10 - ABEND=S37 U0000 REASON=00000004
IEC030I 37-04,IFG0554A,EXPORTJOB,STEP10,SYSUT2,3390,VOL102,PROD.EXPORT.DATA
IEF472I EXPORTJOB STEP10 - COMPLETION CODE - SYSTEM=B37 MEMBER=00000004
JCL CARD REFERENCE:
//SYSUT2   DD DSN=PROD.EXPORT.DATA,DISP=(NEW,CATLG,DELETE),
//            UNIT=SYSDA,SPACE=(TRK,(10,5))`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["SB37", "SD37", "SE37", "S806"],
    answer1: "SB37",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Increase the space parameters in JCL (e.g. SPACE=(CYL,(50,10)) and use RLSE).",
      "Compress the targeted dataset using IEBCOPY.",
      "Declare null indicators for the output fields.",
      "Add a STEPLIB parameter targeting the program loadlib."
    ],
    answer2: "Increase the space parameters in JCL (e.g. SPACE=(CYL,(50,10)) and use RLSE).",
    explanation: "The system completion code B37 indicates volume extent exhaustion. Increasing JCL space parameters and releasing unused tracks (RLSE) handles the large volume export safely."
  },
  {
    id: 3,
    title: "Financial Ledger Database Write Error",
    log: `DSNT408I SQLCODE = -305, ERROR: THE NOT NULL CONSTRAINT IS VIOLATED OR A NULL VALUE IS RETRIEVED INTO A HOST VARIABLE WITHOUT AN INDICATOR VARIABLE
DSNT418I SQLSTATE = 22002, DB2 SUB-SYSTEM=DB2P
PROGRAM CODE ERROR POINT:
EXEC SQL
    SELECT EMAIL INTO :WS-EMAIL FROM USERS WHERE USER_ID = :WS-ID
END-EXEC.`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -305", "SQLCODE -818", "SQLCODE -904", "SQLCODE -911"],
    answer1: "SQLCODE -305",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Declare a 2-byte binary host variable (PIC S9(4) COMP) and bind it as a null-indicator.",
      "Execute the BIND PACKAGE step to update consistency tokens.",
      "Switch lock granularity from tablespace level to row level.",
      "Add a CALL ... USING statement to map working-storage variables."
    ],
    answer2: "Declare a 2-byte binary host variable (PIC S9(4) COMP) and bind it as a null-indicator.",
    explanation: "SQLCODE -305 occurs when DB2 returns a NULL value into a host variable that has no null-indicator variable defined. Adding a 2-byte COMP variable captures this safely."
  },
  {
    id: 4,
    title: "Dev Compile Output File Blocked",
    log: `IEC032I E37-04,IFG0554P,DEVJOB,COMPILE,SYSLMOD,3390,DEV002,DEV.PROJECT.LOADLIB
IEF472I DEVJOB COMPILE - COMPLETION CODE - SYSTEM=E37
JCL CARD REFERENCE:
//SYSLMOD  DD DSN=DEV.PROJECT.LOADLIB(PAYROLL),DISP=SHR
*** ALL DIRECTORY BLOCKS ARE FULL ***`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["SE37", "SD37", "SB37", "S0C4"],
    answer1: "SE37",
    question2: "What is the most modern architectural solution to prevent this permanently?",
    options2: [
      "Migrate the PDS dataset to PDSE format by specifying DSNTYPE=LIBRARY in JCL.",
      "Add a compression step using IEBCOPY utility with COND=EVEN.",
      "Change JCL disposition from SHR to MOD.",
      "Double the volume capacity limit using UNIT=(SYSDA,2)."
    ],
    answer2: "Migrate the PDS dataset to PDSE format by specifying DSNTYPE=LIBRARY in JCL.",
    explanation: "An SE37 indicates PDS directory blocks exhaustion. Migrating to PDSE (DSNTYPE=LIBRARY) manages directory allocation dynamically, bypassing directory block limits."
  },
  {
    id: 5,
    title: "CICS Transaction Access Fault",
    log: `DFHAC2206 12:04:15 CICS01 Transaction TX02 failed with abend ASRA.
CEE3204S The system detected a protection exception (System Completion Code=0C4).
         From entry point PROCESS-TRANS at statement 145 in member ACCTRANS.
         EIBCALEN = 00000 (hex: 0000) <-- LINKAGE COMMAREA LENGTH IS ZERO!`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S0C4", "S0C7", "S0C1", "LENGERR"],
    answer1: "S0C4",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Check EIBCALEN to ensure it is greater than zero before accessing COMMAREA fields.",
      "Add a DSNTYPE=LIBRARY option to the target dataset.",
      "Increase the CICS transaction storage allocation inside the CSD.",
      "Compile with NUMPROC(NOPFD) sign override."
    ],
    answer2: "Check EIBCALEN to ensure it is greater than zero before accessing COMMAREA fields.",
    explanation: "EIBCALEN is zero, which means no COMMAREA data was passed. Accessing linkage fields without establishing validity causes an S0C4 protection exception. Checking EIBCALEN prevents this check."
  },
  {
    id: 6,
    title: "Batch Payroll Compilation Launch Error",
    log: `CSV003I REQUESTED MODULE PAYRPORT NOT FOUND
IEF450I PAYJOB STEP05 - ABEND=S806 U0000 REASON=00000000
IEF472I PAYJOB STEP05 - COMPLETION CODE - SYSTEM=806 MEMBER=00000000
JCL EXEC CARD:
//STEP05   EXEC PGM=PAYRPORT`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S806", "S0C1", "S322", "S222"],
    answer1: "S806",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Provide a STEPLIB DD card pointing to the library where the compiled load module PAYRPORT resides.",
      "Reallocate the source library with more directory blocks.",
      "Submit BIND PACKAGE command to DB2 subsystem.",
      "Update JCL EXEC statement to specify REGION=0M."
    ],
    answer2: "Provide a STEPLIB DD card pointing to the library where the compiled load module PAYRPORT resides.",
    explanation: "An S806 indicates that the loader cannot locate the program module. Specifying the correct load library in a STEPLIB DD statement resolves the program fetch error."
  },
  {
    id: 7,
    title: "Quarterly Report File Open Error",
    log: `IEC141I 013-34,IGG0193B,REPJOB,RPTSTEP,SYSUT1,3390,VOL105,PROD.REPORT.INPUT
IEF472I REPJOB RPTSTEP - COMPLETION CODE - SYSTEM=013 MEMBER=00000034
COBOL FD SOURCE SPEC:
    RECORD CONTAINS 80 CHARACTERS
    RECORDING MODE IS F.
JCL DD SPEC:
//SYSUT1   DD DSN=PROD.REPORT.INPUT,DISP=SHR,LRECL=120,RECFM=FB`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S013", "S213", "SB37", "SD37"],
    answer1: "S013",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Change JCL DD parameters to specify LRECL=80 to match the compiled program FD clause.",
      "Compress the dataset using IEBCOPY utility.",
      "Increase directory blocks using DSNTYPE=LIBRARY.",
      "Add indicator variables to bind nulls dynamically."
    ],
    answer2: "Change JCL DD parameters to specify LRECL=80 to match the compiled program FD clause.",
    explanation: "Abend S013-34 indicates a logical record length mismatch. The JCL references LRECL=120, but the compiled program expects 80-byte records. Aligning LRECL resolves the OPEN conflict."
  },
  {
    id: 8,
    title: "New Release Database Plan Failure",
    log: `DSNT408I SQLCODE = -805, ERROR: DBRM OR PACKAGE NAME NOT FOUND IN PLAN DB2PLAN.PRODCOLL.PAYROLL.1A90F8E109
DSNT418I SQLSTATE = 56098, DB2 SUB-SYSTEM=DB2P
PROGRAM COMPILE TIME: 2026-06-07-10.15.22`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -805", "SQLCODE -818", "SQLCODE -305", "SQLCODE -904"],
    answer1: "SQLCODE -805",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Execute BIND PACKAGE to link the PAYROLL DBRM into the PRODCOLL collection.",
      "Use COALESCE to force database columns to return non-null defaults.",
      "Modify table granularity to Row-level locking in DB2 catalog.",
      "Add a STEPLIB to point to the DB2 load module library."
    ],
    answer2: "Execute BIND PACKAGE to link the PAYROLL DBRM into the PRODCOLL collection.",
    explanation: "SQLCODE -805 indicates that the DB2 plan does not recognize the precompiled package. Binding the DBRM as a package into the referenced collection (PRODCOLL) updates the system catalog references."
  },
  {
    id: 9,
    title: "Transaction Catalog Retrieval Block",
    log: `IEC143I 213-04,IFG0194A,CATJOB,STEP05,SYSIN,3390,DEV005,DEV.CNTL.LIB(PAYROLL_NEW)
IEF472I CATJOB STEP05 - COMPLETION CODE - SYSTEM=213 MEMBER=00000004
*** DS1.DEV.CNTL.LIB DIRECTORY SEARCH FAILED FOR MEMBER: PAYROLL_NEW ***`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S213", "S013", "SE37", "S806"],
    answer1: "S213",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Ensure that the member PAYROLL_NEW exists in the PDS directory, or correct the JCL member spelling.",
      "Compress the Partitioned Dataset directory blocks using IEBCOPY.",
      "Use DSNTYPE=LIBRARY to expand space allocations dynamically.",
      "Add a null-indicator variable to the SELECT statement."
    ],
    answer2: "Ensure that the member PAYROLL_NEW exists in the PDS directory, or correct the JCL member spelling.",
    explanation: "An S213-04 abend during open indicates that the system is unable to locate the specified member in the PDS directory. Confirming spelling or verifying member presence solves the issue."
  },
  {
    id: 10,
    title: "CICS Customer Inquiry Failure",
    log: `DFHAC2206 14:32:00 CICS02 Transaction INQ1 failed with abend MAPFAIL.
DFH3254I Map inquiry screen INQMAP was requested, but zero data fields were received.
         The terminal user pressed the CLEAR key (AID: 1D) without inputting values.`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["MAPFAIL", "AEIP", "ASRA", "LENGERR"],
    answer1: "MAPFAIL",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Check the attention identifier key (EIBAID) first, and bypass RECEIVE MAP if CLEAR is pressed.",
      "Set the Modified Data Tag (MDT) to false on all screen fields.",
      "Increase the terminal transmission buffer length parameters.",
      "Link a 2-byte binary COMP null-indicator to the receiving layout."
    ],
    answer2: "Check the attention identifier key (EIBAID) first, and bypass RECEIVE MAP if CLEAR is pressed.",
    explanation: "A CICS MAPFAIL occurs when a transaction attempts to RECEIVE MAP but receives no data. Checking the EIBAID status first allows the program to bypass mapping safely on screen exit requests."
  },
  {
    id: 11,
    title: "High-Volume Account Rebalancer Hang",
    log: `DSNT408I SQLCODE = -911, ERROR: THE CURRENT TRANSACTION HAS BEEN ROLLED BACK BECAUSE OF DEADLOCK OR TIMEOUT. REASON 00C90088.
DSNT418I SQLSTATE = 40001, DB2 SUB-SYSTEM=DB2P
SYSTEM MESSAGE:
DSNT376I  PLAN=REBPLAN WITH CORRELATION-ID=REBJOB1 IS WAITING FOR A LOCK ON TABLESPACE PRODDB.CUSTTS`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -911", "SQLCODE -904", "SQLCODE -305", "SQLCODE -818"],
    answer1: "SQLCODE -911",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Issue periodic database COMMIT statements inside the batch loop to release locks.",
      "Re-run the BIND PACKAGE command with new qualifier tokens.",
      "Increase the JCL TIME parameter to TIME=1440.",
      "Initialize host storage variables to VALUE ZERO."
    ],
    answer2: "Issue periodic database COMMIT statements inside the batch loop to release locks.",
    explanation: "SQLCODE -911 indicates a deadlock/timeout. Committing locks periodically (e.g. every 500-1000 updates) frees database page locks, resolving lock contention."
  },
  {
    id: 12,
    title: "Batch Report Processor Call Fault",
    log: `CEE3201S The system detected an operation exception (System Completion Code=0C1).
         From entry point PRT-SUBPROG at address 00000000.
         Caller module WORKERSTEP attempted to branch to uninitialized address register.`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S0C1", "S0C4", "S0C5", "S806"],
    answer1: "S0C1",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Ensure the program call target is initialized and resolved, verifying the pointer is not NULL.",
      "Rebind database packages to align compiler consistency tokens.",
      "Reallocate PDS directory blocks to clear storage overlap.",
      "Increase JCL REGION parameters to expand core base capacity."
    ],
    answer2: "Ensure the program call target is initialized and resolved, verifying the pointer is not NULL.",
    explanation: "An S0C1 operation exception occurs when branching to an invalid address (commonly address 0 due to an uninitialized pointer). Validating pointers prevents operation exceptions."
  },
  {
    id: 13,
    title: "End-of-Month Consolidation Hang",
    log: `IEF450I MONTHJOB CONSOL - ABEND=S322 U0000 REASON=00000000
IEF472I MONTHJOB CONSOL - COMPLETION CODE - SYSTEM=322 MEMBER=00000000
*** JOB CONSOL CPU TIME EXCEEDED SYSTEM PARAMETER LIMIT OF 120 SECONDS ***`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S322", "S222", "S806", "SB37"],
    answer1: "S322",
    question2: "What is the primary JCL/program solution to resolve this issue?",
    options2: [
      "Increase JCL TIME parameter (e.g., TIME=1440) and verify program loops do not run infinitely.",
      "Configure STEPLIB DD parameter in compile link-edit.",
      "Declare 2-byte COMP binary null-indicators.",
      "Increase PDS directory block limits via DSNTYPE."
    ],
    answer2: "Increase JCL TIME parameter (e.g., TIME=1440) and verify program loops do not run infinitely.",
    explanation: "Abend S322 indicates a step timeout. Reviewing loop conditions to eliminate infinite loops and raising the JCL TIME parameter handles high volume safely."
  },
  {
    id: 14,
    title: "Master File Export Allocation Blown",
    log: `IEC031I D37-04,IFG0554A,VOLJOB,STEP1,SYSUT2,3390,VOL101,PROD.EXPORT.DATA
IEF472I VOLJOB STEP1 - COMPLETION CODE - SYSTEM=D37
*** DISK VOLUME VOL101 HAS 0 BYTES OF FREE SPACE LEFT FOR ALLOCATION ***`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["SD37", "SE37", "SB37", "S806"],
    answer1: "SD37",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Define multiple target volumes (e.g. UNIT=(SYSDA,3)) or assign dynamically managed SMS storage classes.",
      "Add a STEPLIB to resolve target libraries.",
      "Specify dynamic directories using DSNTYPE=LIBRARY.",
      "Declare null indicators for nullable DB2 columns."
    ],
    answer2: "Define multiple target volumes (e.g. UNIT=(SYSDA,3)) or assign dynamically managed SMS storage classes.",
    explanation: "An SD37 indicates a volume space exhaustion. Distributing allocations across multiple volumes or using dynamic SMS pools bypasses individual volume capacity boundaries."
  },
  {
    id: 15,
    title: "CICS Transaction Parameter Failure",
    log: `DFHAC2206 CICS03 Transaction INQ2 failed with abend AEIP.
DFHFC1200 Error in EXEC CICS READ command: LENGTH parameter (00250) exceeds defined CSD layout.
         RESP=00016 (INVREQ), RESP2=00022.`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["AEIP", "ASRA", "MAPFAIL", "LENGERR"],
    answer1: "AEIP",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Use RESP and RESP2 options to handle errors programmatically and verify field length parameters.",
      "Add an indicator variable to the query layout.",
      "Verify tablespace partitions match CICS environments.",
      "Check COMMAREA lengths first using EIBCALEN."
    ],
    answer2: "Use RESP and RESP2 options to handle errors programmatically and verify field length parameters.",
    explanation: "An AEIP abend is triggered by invalid parameters in CICS commands (such as length parameters exceeding buffers). Using RESP codes programmatically handles parameter issues safely."
  },
  {
    id: 16,
    title: "Database Sync Plan Timestamp Mismatch",
    log: `DSNT408I SQLCODE = -818, ERROR: THE PRECOMPILER-GENERATED CONSISTENCY TOKEN MISMATCH.
DSNT418I SQLSTATE = 56098, DB2 SUB-SYSTEM=DB2P
PLAN TIMESTAMP TOKEN:  1F09A321E5
LOAD MODULE TIMESTAMP: 1F09A322AA`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -818", "SQLCODE -805", "SQLCODE -305", "SQLCODE -904"],
    answer1: "SQLCODE -818",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Re-run BIND PACKAGE using the latest DBRM generated during code compilation.",
      "Declare indicator variables for DB2 nullable host targets.",
      "Add secondary extents to plan tablespaces.",
      "Specify QUALIFIER mappings in application statements."
    ],
    answer2: "Re-run BIND PACKAGE using the latest DBRM generated during code compilation.",
    explanation: "SQLCODE -818 indicates a timestamp discrepancy between the compiled load module and DB2 package. Re-binding the package updates consistency tokens in the DB2 catalog."
  },
  {
    id: 17,
    title: "Locked Batch Account File Read Block",
    log: `DSNT408I SQLCODE = -904, ERROR: UNSUCCESSFUL EXECUTION CAUSED BY AN UNAVAILABLE RESOURCE.
DSNT418I SQLSTATE = 57011, DB2 SUB-SYSTEM=DB2P
*** SQLERRMC: TYPE 00000D01 NAME PRODDB.CUSTTS STATUS STOPPED ***`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -904", "SQLCODE -911", "SQLCODE -305", "SQLCODE -805"],
    answer1: "SQLCODE -904",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Wait for conflicting DBA lock utilities to finish, and start the tablespace via -START DATABASE.",
      "Use COALESCE parameters to bypass null fields.",
      "Update JCL record size constraints.",
      "Recompile and bind plan tokens."
    ],
    answer2: "Wait for conflicting DBA lock utilities to finish, and start the tablespace via -START DATABASE.",
    explanation: "SQLCODE -904 indicates that a resource is unavailable (e.g. stopped tablespace). Ensuring competing utilities finish and issuing a START command releases the database resource."
  },
  {
    id: 18,
    title: "Online User Data Grid Overflow",
    log: `CEE3205S The system detected an addressing exception (System Completion Code=0C5).
         From entry point UPDATE-GRID at statement 345 in program GRIDSERV.
         Register 5 contained invalid address 0A09B250 (out of allocated region scope).`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S0C5", "S0C4", "S0C1", "S0C9"],
    answer1: "S0C5",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Check loop subscripts and indexes to ensure they do not exceed array limits.",
      "Migrate dataset allocation elements to dynamic PDSE storage.",
      "Increase step region boundaries inside JCL cards.",
      "Add BIND parameters targeting collection qualifiers."
    ],
    answer2: "Check loop subscripts and indexes to ensure they do not exceed array limits.",
    explanation: "An S0C5 addressing exception indicates the code accessed memory outside virtual bounds. Validating array subscripts prevents referencing invalid register regions."
  },
  {
    id: 19,
    title: "Interest Accrual Engine Crash",
    log: `CEE3209S The system detected a fixed-point divide exception (System Completion Code=0C9).
         From entry point CALC-INTEREST at statement 89 in program ACCENG.
         WS-TOTAL-ACCTS = 00000 (dividing WS-ACCRUED-VAL by WS-TOTAL-ACCTS).`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S0C9", "S0C5", "S0C7", "S322"],
    answer1: "S0C9",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Add defensive IF statements to check if the divisor variable is non-zero before division.",
      "Initialize host storage structures to spaces.",
      "Rebind compilation modules to clear thread locks.",
      "Allocate multi-volume disk configurations."
    ],
    answer2: "Add defensive IF statements to check if the divisor variable is non-zero before division.",
    explanation: "An S0C9 is a division-by-zero error. Adding a conditional validation check to verify that the divider is not zero prevents fixed-point runtime abends."
  },
  {
    id: 20,
    title: "Ad-hoc SQL Query Console Mismatch",
    log: `DSNT408I SQLCODE = -104, ERROR: ILLEGAL SYMBOL OR SYNTAX EXCEPTION.
DSNT418I SQLSTATE = 42601, DB2 SUB-SYSTEM=DB2P
PROGRAM CODE POINT:
    SELECT NAME INTO WS-NAME FROM EMPLOYEES WHERE DEPT = WS-DEPT`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -104", "SQLCODE -204", "SQLCODE -206", "SQLCODE -305"],
    answer1: "SQLCODE -104",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Prefix host variables with colons (e.g. :WS-DEPT, :WS-NAME) in static embedded SQL queries.",
      "Execute BIND commands to establish consistency tokens.",
      "Define null indicator COMP variables.",
      "Confirm database columns match the catalog definition."
    ],
    answer2: "Prefix host variables with colons (e.g. :WS-DEPT, :WS-NAME) in static embedded SQL queries.",
    explanation: "SQLCODE -104 indicates a syntax error. Static SQL statements in COBOL require host variables to be prefixed with colons to distinguish them from DB2 columns."
  },
  {
    id: 21,
    title: "Test Sandbox DB Schema Mismatch",
    log: `DSNT408I SQLCODE = -204, ERROR: DEVDB.CUSTOMERS_TEMP IS AN UNDEFINED NAME.
DSNT418I SQLSTATE = 42704, DB2 SUB-SYSTEM=DB2P`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -204", "SQLCODE -104", "SQLCODE -206", "SQLCODE -805"],
    answer1: "SQLCODE -204",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Verify table names match catalogs or re-run BIND specifying the correct QUALIFIER schema.",
      "Run precompiler updates to map consistency tokens.",
      "Add indicator variables to track null entries.",
      "Modify tablespace settings to row lock granularity."
    ],
    answer2: "Verify table names match catalogs or re-run BIND specifying the correct QUALIFIER schema.",
    explanation: "SQLCODE -204 indicates the DB2 object does not exist. Verifying qualifiers or schema prefixes in JCL BIND steps prevents referencing unresolved schemas."
  },
  {
    id: 22,
    title: "Developer Custom Column Integration Error",
    log: `DSNT408I SQLCODE = -206, ERROR: CUST_PHONE_NUM IS NOT A COLUMN OF TABLE DEVDB.CUSTOMERS.
DSNT418I SQLSTATE = 42703, DB2 SUB-SYSTEM=DB2P`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -206", "SQLCODE -204", "SQLCODE -104", "SQLCODE -305"],
    answer1: "SQLCODE -206",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Regenerate DCLGEN copybooks to align variables with DB2 column mappings.",
      "Specify schema prefix overrides using QUALIFIER bindings.",
      "Re-run BIND plan commands to synchronize precompiled variables.",
      "Bind null indicator COMP fields to the column interface."
    ],
    answer2: "Regenerate DCLGEN copybooks to align variables with DB2 column mappings.",
    explanation: "SQLCODE -206 indicates a column mismatch. Regenerating DCLGEN layout definitions synchronizes database fields with COBOL copybooks."
  },
  {
    id: 23,
    title: "Transaction Loop Database Cursor Crash",
    log: `DSNT408I SQLCODE = -501, ERROR: THE CURSOR SPECIFIED IN A FETCH OR CLOSE STATEMENT IS NOT OPEN.
DSNT418I SQLSTATE = 24501, DB2 SUB-SYSTEM=DB2P
PLAN=PAYPLAN, PROGRAM=PAYPROC, CURSOR=CUST_CUR`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -501", "SQLCODE -803", "SQLCODE -305", "SQLCODE -805"],
    answer1: "SQLCODE -501",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Ensure cursor OPEN statement executes before fetch, or specify WITH HOLD if commits are issued in loop.",
      "Add BIND plan collection details to JCL packages.",
      "Map binary COMP variables to host fields.",
      "Increase cursor tablespace lock limit thresholds."
    ],
    answer2: "Ensure cursor OPEN statement executes before fetch, or specify WITH HOLD if commits are issued in loop.",
    explanation: "SQLCODE -501 occurs when fetching from a closed cursor (often closed automatically by a COMMIT). Declaring the cursor WITH HOLD keeps it open across commits."
  },
  {
    id: 24,
    title: "Interactive Account Registration Block",
    log: `DSNT408I SQLCODE = -803, ERROR: AN INSERT OR UPDATE VALUE IS INVALID BECAUSE INDEX INDEX_CUST_ID IS UNIQUE.
DSNT418I SQLSTATE = 23505, DB2 SUB-SYSTEM=DB2P
SQLERRMC: CUST_ID = 'CUST105' (DUPLICATE DETECTED)`,
    question1: "Which SQL/Abend code is displayed in the incident report?",
    options1: ["SQLCODE -803", "SQLCODE -501", "SQLCODE -104", "SQLCODE -305"],
    answer1: "SQLCODE -803",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Perform check-before-insert (or SELECT COUNT) to verify key uniqueness before write.",
      "Check timestamp consistency bindings on DB2 precompilation.",
      "Establish tablespace lock parameters in JCL cards.",
      "Increase secondary allocations for unique index partitions."
    ],
    answer2: "Perform check-before-insert (or SELECT COUNT) to verify key uniqueness before write.",
    explanation: "SQLCODE -803 is a unique index constraint violation. Validating database key presence before calling INSERT prevents duplicate errors."
  },
  {
    id: 25,
    title: "Blocked High-Priority Batch Job Cancel",
    log: `IEF450I TESTJOB1 STEPA - ABEND=S222 U0000 REASON=00000000
IEF472I TESTJOB1 STEPA - COMPLETION CODE - SYSTEM=222
*** JOB WAS TERMINATED MANUALLY VIA SYSTEM OPERATOR CANCEL COMMAND ***`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S222", "S322", "S913", "S806"],
    answer1: "S222",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Investigate system trace for hangs or locking blockages that forced operator cancel.",
      "Provide STEPLIB paths to resolve loading dependencies.",
      "Compress partition libraries via IEBCOPY tasks.",
      "Add dynamic multi-volume DD targets."
    ],
    answer2: "Investigate system trace for hangs or locking blockages that forced operator cancel.",
    explanation: "Abend S222 indicates manual operator cancellation. Analyzing thread logs identifies resource contentions or infinite loops that forced the operator intervention."
  },
  {
    id: 26,
    title: "Production Output Write Access Blocked",
    log: `ICH408I USER(STCDEV) GROUP(DEV) CL(DATASET) INSUFFICIENT ACCESS AUTHORITY
IEF450I DEVJOB STEP10 - ABEND=S913 U0000 REASON=00000038
*** RACF PROTECTION VIOLATION ON TARGET DATASET PROD.CUSTOMER.EXPORT ***`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["S913", "S222", "S322", "S806"],
    answer1: "S913",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Request dataset security permissions from RACF administrators using PERMIT.",
      "Switch target load volumes in dynamic JCL specifications.",
      "Compress Partitioned Dataset directory blocks.",
      "Modify DB2 plan qualifications."
    ],
    answer2: "Request dataset security permissions from RACF administrators using PERMIT.",
    explanation: "Abend S913 indicates a RACF security validation failure. Securing dataset access authorization from system security administrators solves the write failure."
  },
  {
    id: 27,
    title: "HLL Core Runtime Stack Crash",
    log: `CEE3DMP V2 R4.0: Language Environment CEE3207S User Abend U4038.
         From module COBPROG at statement 105 in program PAYENG.
         wrapped error details: File Status 39 logical dataset open conflict.`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["U4038", "S0C4", "S806", "LENGERR"],
    answer1: "U4038",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Investigate wrapped error logs (like SYSOUT/CEEDUMP) to identify and fix program runtime issues.",
      "Allocate dynamic multi-volume tape libraries.",
      "Increase system directory block limits.",
      "Recompile database binding packages."
    ],
    answer2: "Investigate wrapped error logs (like SYSOUT/CEEDUMP) to identify and fix program runtime issues.",
    explanation: "User Abend U4038 is an LE (Language Environment) runtime error wrapper. Reviewing CEEDUMP or SYSOUT details isolates the actual exception details wrapped by LE."
  },
  {
    id: 28,
    title: "Called CICS Program Layout Mismatch",
    log: `DFHAC2206 Transaction TX03 failed with abend LENGERR.
DFHFC1400 Linkage comarea mapping length check failed: expected 00500, received 00350.`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["LENGERR", "AEIP", "ASRA", "MAPFAIL"],
    answer1: "LENGERR",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Validate layout copybook sizes match exactly across caller and receiver CICS programs.",
      "Establish attention identifier check tables.",
      "Map null indicators to embedded database variables.",
      "Use DSNTYPE=LIBRARY to bypass directory block limits."
    ],
    answer2: "Validate layout copybook sizes match exactly across caller and receiver CICS programs.",
    explanation: "A LENGERR indicates a CICS data communication area size mismatch. Aligning copybooks across systems ensures layout parameters interface correctly."
  },
  {
    id: 29,
    title: "CICS Calculation Screen Freeze",
    log: `DFHAC2206 Transaction TX04 failed with abend ASRA.
CEE3207C System detected a decimal data check exception (System Completion Code=0C7).
         From program CALCPROG at statement 402 in address 0B092A10.`,
    question1: "Which Abend code is displayed in the incident report?",
    options1: ["ASRA", "AEIP", "LENGERR", "MAPFAIL"],
    answer1: "ASRA",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Use CICS HANDLE ABEND commands or respond variables to capture checks programmatically.",
      "Specify volume serialization blocks inside transaction plans.",
      "Increase CICS catalog space configuration values.",
      "Declare binary S9(4) indicator components."
    ],
    answer2: "Use CICS HANDLE ABEND commands or respond variables to capture checks programmatically.",
    explanation: "An ASRA abend in CICS wraps hardware/program check exceptions. Implementing HANDLE ABEND routines catches these failures, preventing raw transaction dumps."
  },
  {
    id: 30,
    title: "Customer Transaction File Missing",
    log: `COBOL RUNTIME: File OPEN failed with FILE STATUS = 35 for logical name SYSUT1.
SYSTEM DETAILS:
ICH408I USER(STCJOB) dataset not found: PROD.TRANS.DATA1`,
    question1: "Which File Status/Abend code is displayed in the incident report?",
    options1: ["File Status 35", "File Status 39", "File Status 92", "File Status 23"],
    answer1: "File Status 35",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Check if dataset exists and verify JCL DSNAME spelling and disposition settings.",
      "Change JCL DD LRECL parameters to resolve block counts.",
      "Verify file open status flags prior to read tasks.",
      "Add key pre-existence checks to index definitions."
    ],
    answer2: "Check if dataset exists and verify JCL DSNAME spelling and disposition settings.",
    explanation: "File Status 35 indicates a dataset does not exist. Verifying name spellings or check physical file catalog allocations resolves the missing dataset exception."
  },
  {
    id: 31,
    title: "Inbound Invoice Record Length Conflict",
    log: `COBOL RUNTIME: File OPEN failed with FILE STATUS = 39 for logical name SYSUT1.
SYSTEM DATA DETAILS:
IEC141I logical block size mismatch. Expected 00080, dataset attributes specify 00100.`,
    question1: "Which File Status/Abend code is displayed in the incident report?",
    options1: ["File Status 39", "File Status 35", "File Status 92", "File Status 10"],
    answer1: "File Status 39",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Ensure JCL DD card LRECL matches compiler FD record size exactly.",
      "Compress PDS directories to purge record space.",
      "Open database cursor links before issuing fetching cycles.",
      "Re-run compile steps with updated consistency tokens."
    ],
    answer2: "Ensure JCL DD card LRECL matches compiler FD record size exactly.",
    explanation: "File Status 39 indicates attributes mismatch (like LRECL). Aligning compiled program FD declarations with JCL definitions resolves the open conflict."
  },
  {
    id: 32,
    title: "Batch Report Generation Logic Fault",
    log: `COBOL RUNTIME: File READ failed with FILE STATUS = 92 for logical name INFILE.
SYSTEM CODE LINE TRACE:
       PERFORM READ-PARAGRAPH UNTIL END-OF-FILE.
       * Error point: INFILE was never OPENed in INITIALIZATION paragraph.`,
    question1: "Which File Status/Abend code is displayed in the incident report?",
    options1: ["File Status 92", "File Status 35", "File Status 39", "File Status 23"],
    answer1: "File Status 92",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Verify file is successfully OPENed before executing READ or WRITE operations.",
      "Check JCL LRECL parameters for length consistency.",
      "Declare binary S9(4) null-indicator variables.",
      "Map secondary volume serial serial numbers."
    ],
    answer2: "Verify file is successfully OPENed before executing READ or WRITE operations.",
    explanation: "File Status 92 indicates a logical error (such as reading a closed file). Ensuring file OPEN is executed before READ prevents this runtime logic failure."
  },
  {
    id: 33,
    title: "VSAM Indexed Read Key Failure",
    log: `COBOL RUNTIME: VSAM KSDS read failed with FILE STATUS = 23 for logical name CUSTFILE.
KEY VAL: CUST_ID = 'CUST999' (record index target mismatch).`,
    question1: "Which File Status/Abend code is displayed in the incident report?",
    options1: ["File Status 23", "File Status 22", "File Status 92", "File Status 10"],
    answer1: "File Status 23",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Add INVALID KEY clauses or check key existence before executing READ/UPDATE on VSAM files.",
      "Reallocate index parameters via PDSE allocations.",
      "Execute BIND commands on precompiled database packages.",
      "Issue periodic COMMIT points inside loops."
    ],
    answer2: "Add INVALID KEY clauses or check key existence before executing READ/UPDATE on VSAM files.",
    explanation: "File Status 23 indicates record key not found. Incorporating INVALID KEY handlers or verifying key presence handles query misses safely."
  },
  {
    id: 34,
    title: "VSAM Duplicate Write Conflict",
    log: `COBOL RUNTIME: VSAM write failed with FILE STATUS = 22 for logical name EMPFILE.
KEY VAL: EMP_ID = 'EMP102' (duplicate unique key detected).`,
    question1: "Which File Status/Abend code is displayed in the incident report?",
    options1: ["File Status 22", "File Status 23", "File Status 92", "File Status 10"],
    answer1: "File Status 22",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Check key existence or handle duplicate key responses to update instead of write.",
      "Add STEPLIB allocations to JCL files.",
      "Switch table granularity levels inside DB2 systems.",
      "Modify record structures to variable-length."
    ],
    answer2: "Check key existence or handle duplicate key responses to update instead of write.",
    explanation: "File Status 22 is a duplicate key block. Implementing write verification or intercepting duplicates redirects conflict cases to update code paths."
  },
  {
    id: 35,
    title: "Infinite Loop Batch Extraction Mismatch",
    log: `COBOL RUNTIME: File READ reached FILE STATUS = 10 for logical name INFILE.
SYSTEM CODE LINE TRACE:
       * Infinite Loop: program did not check for EOF status and continued reading.`,
    question1: "Which File Status/Abend code is displayed in the incident report?",
    options1: ["File Status 10", "File Status 23", "File Status 92", "File Status 39"],
    answer1: "File Status 10",
    question2: "What is the primary architectural solution to resolve this issue?",
    options2: [
      "Implement AT END check in READ statement to terminate loops correctly.",
      "Reallocate storage volumes using unit specifications.",
      "Bind plan consistency package tokens.",
      "Increase step region sizes to expand memory boundaries."
    ],
    answer2: "Implement AT END check in READ statement to terminate loops correctly.",
    explanation: "File Status 10 indicates EOF. Adding AT END clauses or status key check boundaries handles stream completion and stops read loops safely."
  }
];
