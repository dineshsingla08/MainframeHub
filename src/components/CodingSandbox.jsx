import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';

const CHALLENGES = [
    {
        id: 'jcl-alloc',
        type: 'JCL',
        title: 'Dataset Allocation via IEFBR14',
        difficulty: 'Beginner',
        description: 'Write a JCL job to allocate a new sequential dataset ACCT.RECORDS.NEW with a space allocation of 5 cylinders primary, 2 cylinders secondary, fixed-blocked record format (RECFM=FB), record length (LRECL) of 80, and block size (BLKSIZE) of 800. The dataset should be cataloged if the step succeeds, and deleted if it fails.',
        instructions: [
            '1. Ensure you define a valid JOB card, e.g., //ALLOCJOB JOB (ACCT),\'NEW DATASET\',CLASS=A,MSGCLASS=X',
            '2. Add an EXEC step executing the dummy program IEFBR14.',
            '3. Define a DD card for the dataset ACCT.RECORDS.NEW.',
            '4. Set disposition parameter: DISP=(NEW,CATLG,DELETE). Note: JCL requires CATLG, not CATALOG!',
            '5. Set SPACE allocation for cylinders: SPACE=(CYL,(5,2)).',
            '6. Set DCB parameters: DCB=(RECFM=FB,LRECL=80,BLKSIZE=800).'
        ],
        template: `//ALLOCJOB JOB (ACCT),'NEW DATASET',CLASS=A,MSGCLASS=X
//STEP1    EXEC PGM=IEFBR14
//NEWDS    DD DSN=ACCT.RECORDS.NEW,
//            DISP=(NEW,CATALOG,DELETE),
//            SPACE=(CYL,(5,2)),
//            DCB=(RECFM=FB,LRECL=80,BLKSIZE=800)
`,
        validate: (code) => {
            const cleanCode = code.toUpperCase();
            const errors = [];
            const logs = [];

            logs.push('12.06.34 JOB00123  $HASP100 ALLOCJOB  ON RECV');
            logs.push('12.06.34 JOB00123  $HASP373 ALLOCJOB  STARTED');
            logs.push('12.06.35 JOB00123  IEF403I ALLOCJOB - STARTED - TIME=12.06.35');

            // 1. Check JOB card
            if (!cleanCode.includes('//') || !cleanCode.includes('JOB')) {
                errors.push('IEF605I UNIDENTIFIED OPERATION FIELD - MISSING OR INVALID JOB CARD');
                logs.push('12.06.35 JOB00123  IEF212I JCL ERROR - JOB CARD INVALID OR MISSING');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            // Check if any lines do not start with // (ignoring whitespace lines)
            const lines = code.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
                    errors.push(`IEF632I UNIDENTIFIED SYSTEM CARD AT LINE ${i + 1}: MUST START WITH //`);
                    logs.push(`12.06.35 JOB00123  IEF632I SYNTAX ERROR - LINE ${i + 1}`);
                    return { success: false, errors, logs, code: 'JCL ERROR' };
                }
            }

            // 2. Check EXEC card and PGM=IEFBR14
            if (!cleanCode.includes('EXEC') || !cleanCode.includes('PGM=IEFBR14')) {
                errors.push('IEF612I STEP STEP1 DID NOT SPECIFY PGM=IEFBR14 OR PROC NAME');
                logs.push('12.06.35 JOB00123  IEF612I PROGRAM INITIALIZATION FAILED');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            // 3. Check DSN
            if (!cleanCode.includes('DSN=ACCT.RECORDS.NEW') && !cleanCode.includes('DSNAME=ACCT.RECORDS.NEW')) {
                errors.push('IEF212I NEWDS - DATASET NAME MISMATCH. EXPECTED: ACCT.RECORDS.NEW');
                logs.push('12.06.35 JOB00123  IEF212I ACCT.RECORDS.NEW NOT FOUND');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            // 4. Check DISP - Common error: CATALOG instead of CATLG
            if (cleanCode.includes('CATALOG')) {
                errors.push('IEF643I INVALID SUBPARAMETER LIST IN THE DISP FIELD: "CATALOG" IS INVALID. USE "CATLG" IN JCL.');
                logs.push('12.06.35 JOB00123  IEF643I DISPOSITION FIELD ERROR - CATALOG SPECIFIED');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            if (!cleanCode.includes('CATLG')) {
                errors.push('IEF253I DISP MUST SPECIFY "CATLG" AS THE SUCCESSFUL TERMINATION DISPOSITION TO RETAIN THE DATASET');
                logs.push('12.06.35 JOB00123  IEF253I UNABLE TO CATALOG NEW DATASET');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            // 5. Check SPACE
            if (!cleanCode.includes('SPACE=(CYL') || !cleanCode.includes('(5,2)')) {
                errors.push('IEF622I SPACE PARAMETER MISMATCH. REQUIRED: SPACE=(CYL,(5,2))');
                logs.push('12.06.35 JOB00123  IEF622I ALLOCATION FAILURE');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            // 6. Check DCB Parameters
            if (!cleanCode.includes('LRECL=80') || !cleanCode.includes('RECFM=FB') || !cleanCode.includes('BLKSIZE=800')) {
                errors.push('IEF630I DCB SUBPARAMETERS INVALID. EXTREMELY IMPORTANT: RECFM=FB, LRECL=80, BLKSIZE=800 REQUIRED');
                logs.push('12.06.35 JOB00123  IEF630I ATTRIBUTE CONFIGURATION EXCEPTION');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            // Success logs
            logs.push('12.06.35 JOB00123  -STEP1    IEFBR14  0000');
            logs.push('12.06.35 JOB00123  IEF285I   ACCT.RECORDS.NEW                             CATALOGED');
            logs.push('12.06.35 JOB00123  IEF285I   VOL SER NOS= SYSTEM');
            logs.push('12.06.35 JOB00123  IEF404I ALLOCJOB - ENDED - TIME=12.06.35');
            logs.push('12.06.35 JOB00123  $HASP395 ALLOCJOB  ENDED. COND CODE 0000');

            return { success: true, errors: [], logs, code: 'RC=0000' };
        }
    },
    {
        id: 'cobol-abend',
        type: 'COBOL',
        title: 'Prevent S0C7 Data Exception Abend',
        difficulty: 'Intermediate',
        description: 'Debug a batch COBOL program. The alphanumeric input variable WS-AMOUNT-STR contains "12A45" (which is non-numeric). The program attempts to perform arithmetic using WS-AMOUNT-NUM (which redefines WS-AMOUNT-STR as numeric). This causes a severe S0C7 system abend. Protect the calculation by adding a numeric validation check before performing the addition.',
        instructions: [
            '1. Examine the PROCEDURE DIVISION.',
            '2. Add an IF check: IF WS-AMOUNT-STR IS NUMERIC (or WS-AMOUNT-NUM IS NUMERIC).',
            '3. Place the ADD statement and SUCCESS display inside the IF branch.',
            '4. In the ELSE branch, DISPLAY an error message, e.g., DISPLAY "INPUT IS INVALID: " WS-AMOUNT-STR.',
            '5. Terminate the check with END-IF.',
            '6. Ensure the program still issues GOBACK at the end.'
        ],
        template: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. CALCJOB.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-AMOUNT-STR     PIC X(5) VALUE "12A45".
       01  WS-AMOUNT-NUM     REDEFINES WS-AMOUNT-STR PIC 9(5).
       01  WS-TOTAL          PIC 9(7) VALUE 100.
       PROCEDURE DIVISION.
       MAIN-LOGIC.
      *    FIX ME: Validate WS-AMOUNT-STR is numeric before calculating
           ADD WS-AMOUNT-NUM TO WS-TOTAL.
           DISPLAY "SUCCESS: TOTAL IS " WS-TOTAL.
           GOBACK.
`,
        validate: (code) => {
            const cleanCode = code.toUpperCase();
            const errors = [];
            const logs = [];

            logs.push('IKF000I-I  COBOL COMPILER V4.2 STARTED');
            logs.push('IKF1017I-W WORKING-STORAGE COMPILATION MAP GENERATED');

            // Division checks
            if (!cleanCode.includes('IDENTIFICATION DIVISION.') || !cleanCode.includes('PROCEDURE DIVISION.')) {
                errors.push('SYNTAX ERROR: COBOL DIVISION HEADERS MISSING OR OUT OF ORDER.');
                logs.push('IKF5011I-E COBOL DIVISION ERROR - CRITICAL RECOVERY FAILURE');
                return { success: false, errors, logs, code: 'COMPILER ERROR (RC=0012)' };
            }

            // GOBACK check
            if (!cleanCode.includes('GOBACK') && !cleanCode.includes('STOP RUN')) {
                errors.push('WARNING: NO TERMINATION CARD (GOBACK. OR STOP RUN.) SPECIFIED in MAIN LOGIC.');
                logs.push('IKF4092I-W PROGRAM MAY LOOP INFINITELY');
            }

            // Extract the value of WS-AMOUNT-STR to see if they modified it
            // WS-AMOUNT-STR     PIC X(5) VALUE "12A45".
            let currentValue = "12A45";
            const matchValue = code.match(/WS-AMOUNT-STR\s+PIC\s+X\(5\)\s+VALUE\s+"([^"]+)"/i);
            if (matchValue && matchValue[1]) {
                currentValue = matchValue[1];
            }

            const isCurrentNumeric = /^\d+$/.test(currentValue);

            // Check if numeric check is implemented
            const hasNumericCheck = cleanCode.includes('IS NUMERIC') || cleanCode.includes('NUMERIC');

            logs.push('IKF9002I-I  COMPILATION COMPLETED. NO CRITICAL COMPILER ERRORS.');
            logs.push('--- LINK-EDIT STEP EXECUTED SUCCESSFULLY. MEM: CALCJOB ---');
            logs.push('--- JOB INITIATED ---');

            if (hasNumericCheck) {
                logs.push('LOG: ENTERING MAIN-LOGIC PARAGRAPH');
                if (isCurrentNumeric) {
                    const parsedVal = parseInt(currentValue, 10);
                    const total = 100 + parsedVal;
                    const paddedTotal = total.toString().padStart(7, '0');
                    logs.push(`DISPLAY: SUCCESS: TOTAL IS ${paddedTotal}`);
                    logs.push('LOG: PROGRAM RETURNING WITH RC=0000');
                    return { success: true, errors: [], logs, code: 'RC=0000' };
                } else {
                    logs.push(`DISPLAY: INPUT IS INVALID: ${currentValue}`);
                    logs.push('LOG: PROGRAM RETURNING WITH RC=0000 (SAFE ERROR HANDLING)');
                    return { success: true, errors: [], logs, code: 'RC=0000' };
                }
            } else {
                // If current value is numeric even without check, it runs but is unsafe.
                // However, the objective is to *protect* the code. Let's force adding the check.
                if (isCurrentNumeric) {
                    logs.push('LOG: ENTERING MAIN-LOGIC PARAGRAPH');
                    const parsedVal = parseInt(currentValue, 10);
                    const total = 100 + parsedVal;
                    const paddedTotal = total.toString().padStart(7, '0');
                    logs.push(`DISPLAY: SUCCESS: TOTAL IS ${paddedTotal}`);
                    logs.push('WARNING: CODE WAS EXECUTED BUT NO NUMERIC PROTECTION CHECK DETECTED.');
                    errors.push('CHALLENGE FAILED: YOU CRITICALLY MUST DEFINE AN "IF ... IS NUMERIC" PROTECTION BLOCK FOR ROBUST PRODUCTION STANDARDS.');
                    return { success: false, errors, logs, code: 'UNPROTECTED RUN' };
                } else {
                    // S0C7 ABEND!
                    logs.push('LOG: ENTERING MAIN-LOGIC PARAGRAPH');
                    logs.push('CEE3207S The system detected a data exception (System Completion Code=0C7).');
                    logs.push('From entry point CALCJOB at statement 12 at compile unit offset +000000A8.');
                    logs.push('');
                    logs.push('--- SYSTEM ABEND DUMP: S0C7 (DATA EXCEPTION) ---');
                    logs.push('PSW: 078D1000 80C1A204  ILC: 6  INTERRUPT CODE: 0007');
                    logs.push('GPR 0-3:  00000000  0000A24C  000000A8  80C1A1A2');
                    logs.push(`GPR 4-7:  00001000  00000000  0012A45C  00000100  (REGS PRE-CRASH)`);
                    logs.push('GPR 8-11: 00000000  00000000  00000000  00C1A200');
                    logs.push('GPR 12-15:00C1A1A8  00C1B000  00000000  80C1A200');
                    logs.push('');
                    logs.push('DATA AT PSW ADDRESS: FA23 B00C B010 (ADD DECIMAL OPERATION FAILED)');
                    logs.push(`REASON: FIELD 'WS-AMOUNT-NUM' CONTAINS INVALID DATA: "${currentValue}"`);
                    
                    // Show hex zone representation
                    const hexRep = Array.from(currentValue).map(c => 'F' + c).join(' ');
                    logs.push(`ZONED DECIMAL REPRESENTATION: ${hexRep}`);
                    logs.push('------------------------------------------------');

                    errors.push('SYSTEM ABEND S0C7 DETECTED: INVALID DATA SPECIFIED IN NUMERIC ADDITION OPERATION.');
                    return { success: false, errors, logs, code: 'SYSTEM ABEND S0C7' };
                }
            }
        }
    },
    {
        id: 'sql-groupby',
        type: 'SQL',
        title: 'DB2 Join and Aggregate GROUP BY',
        difficulty: 'Expert',
        description: 'Write a DB2 SQL query to retrieve employees aggregated by department. We need to display the department name (DEPT_NAME), total count of employees in that department (EMP_COUNT), and the average salary of employees (AVG_SALARY). Join the DEPARTMENTS table (aliased as D) and EMPLOYEES table (aliased as E). Group the results by DEPT_NAME, and order them by AVG_SALARY in descending order.',
        instructions: [
            '1. Select D.DEPT_NAME, COUNT(E.EMP_ID) AS EMP_COUNT, and AVG(E.SALARY) AS AVG_SALARY.',
            '2. Join DEPARTMENTS D with EMPLOYEES E using an INNER JOIN on DEPT_ID.',
            '3. Group the output rows by D.DEPT_NAME.',
            '4. Order the aggregated results by AVG_SALARY in DESCENDING order.'
        ],
        template: `SELECT D.DEPT_NAME, COUNT(E.EMP_ID) AS EMP_COUNT, AVG(E.SALARY) AS AVG_SALARY
FROM DEPARTMENTS D
-- Write your join, grouping, and ordering here
`,
        validate: (code) => {
            const cleanCode = code.replace(/\s+/g, ' ').toUpperCase().trim();
            const errors = [];
            const logs = [];

            logs.push('DSNT408I SQLCODE = 0, SQLSTATE = 00000, SUCCESSFUL EXECUTION');
            logs.push('--- DB2 CATALOG MANAGER COMMITTED QUERY UNIT ---');

            // Syntactic Checks
            if (!cleanCode.includes('SELECT') || !cleanCode.includes('FROM')) {
                errors.push('SQLCODE: -104, SQLSTATE: 42601: ILLEGAL SYMBOL OR SYNTAX ERROR. SELECT/FROM KEYWORD MISSING.');
                return { success: false, errors, logs: ['DSNT408I SQLCODE = -104, SQLSTATE = 42601: SYNTAX ERROR'], code: 'SQLCODE -104' };
            }

            // Tables spelling check
            if (cleanCode.includes('EMPLOYEE ') || cleanCode.includes('EMPLOYEE;')) {
                errors.push('SQLCODE: -204, SQLSTATE: 42704: EMPLOYEE IS AN UNDEFINED NAME. DID YOU MEAN "EMPLOYEES"?');
                return { success: false, errors, logs: ['DSNT408I SQLCODE = -204, SQLSTATE = 42704: TABLE NOT FOUND'], code: 'SQLCODE -204' };
            }
            if (cleanCode.includes('DEPARTMENT ') || cleanCode.includes('DEPARTMENT;')) {
                errors.push('SQLCODE: -204, SQLSTATE: 42704: DEPARTMENT IS AN UNDEFINED NAME. DID YOU MEAN "DEPARTMENTS"?');
                return { success: false, errors, logs: ['DSNT408I SQLCODE = -204, SQLSTATE = 42704: TABLE NOT FOUND'], code: 'SQLCODE -204' };
            }

            // Column spelling check
            if (cleanCode.includes('DEPT_NAME_VAL') || cleanCode.includes('SALARY_AMT')) {
                errors.push('SQLCODE: -206, SQLSTATE: 42703: COLUMN NAME NOT FOUND IN TARGET RELATION.');
                return { success: false, errors, logs: ['DSNT408I SQLCODE = -206, SQLSTATE = 42703: COLUMN NOT FOUND'], code: 'SQLCODE -206' };
            }

            // JOIN and ON checks
            const hasJoin = cleanCode.includes('JOIN EMPLOYEES') || cleanCode.includes('JOIN  EMPLOYEES') || cleanCode.includes('FROM EMPLOYEES') || cleanCode.includes('FROM DEPARTMENTS D, EMPLOYEES E');
            const hasJoinCondition = cleanCode.includes('DEPT_ID') && (cleanCode.includes('=') || cleanCode.includes('ON'));

            if (!hasJoin || !hasJoinCondition) {
                errors.push('SQLCODE: -104, SQLSTATE: 42601: DATA SET RELATION MISSING JOIN CRITERIA. BOTH TABLES DEPARTMENTS AND EMPLOYEES MUST BE JOINED.');
                return { success: false, errors, logs: ['DSNT408I SQLCODE = -104, SQLSTATE = 42601: JOIN MISSING OR INVALID'], code: 'SQLCODE -104' };
            }

            // GROUP BY check
            if (!cleanCode.includes('GROUP BY')) {
                errors.push('SQLCODE: -112, SQLSTATE: 42803: THE SQL STATEMENT CONTAINS AN AGGREGATE FUNCTION BUT NO GROUP BY CLAUSE.');
                return { success: false, errors, logs: ['DSNT408I SQLCODE = -112, SQLSTATE = 42803: GROUP BY EXPECTED FOR COUNT/AVG'], code: 'SQLCODE -112' };
            }

            const groupsDeptName = cleanCode.includes('GROUP BY D.DEPT_NAME') || cleanCode.includes('GROUP BY DEPT_NAME');
            if (!groupsDeptName) {
                errors.push('SQLCODE: -119, SQLSTATE: 42803: COLUMN DEPT_NAME IN THE SELECT LIST IS NOT IN THE GROUP BY CLAUSE.');
                return { success: false, errors, logs: ['DSNT408I SQLCODE = -119, SQLSTATE = 42803: INVALID GROUP BY'], code: 'SQLCODE -119' };
            }

            // ORDER BY check
            const hasOrderBy = cleanCode.includes('ORDER BY');
            const descSort = cleanCode.includes('DESC');
            const correctOrderField = cleanCode.includes('AVG_SALARY') || cleanCode.includes('AVG(E.SALARY)') || cleanCode.includes('AVG(SALARY)') || cleanCode.includes('3 ');

            if (!hasOrderBy || !descSort || !correctOrderField) {
                logs.push('DSNT408I WARNING: QUERY GENERATED BUT ORDER BY AVG_SALARY DESC WAS MISSING OR INCORRECT.');
                errors.push('CHALLENGE FAILED: YOU MUST ORDER THE AGGREGATED DEPARTMENTS BY AVG_SALARY IN DESCENDING ORDER.');
                return { success: false, errors, logs, code: 'UNSORTED EXECUTION' };
            }

            // If we get here, they successfully matched!
            // Let's create the output rows
            const rows = [
                { DEPT_NAME: 'Systems Engineering', EMP_COUNT: 3, AVG_SALARY: 96667 },
                { DEPT_NAME: 'Application Development', EMP_COUNT: 3, AVG_SALARY: 79333 },
                { DEPT_NAME: 'Operations Support', EMP_COUNT: 1, AVG_SALARY: 60000 }
            ];

            return { success: true, errors: [], logs, code: 'RC=0000', rows };
        }
    },
    {
        id: 'sql-dedup',
        type: 'SQL',
        title: 'Deduplicate Accounts using ROW_NUMBER',
        difficulty: 'Intermediate',
        description: 'Write a DB2 SQL query to find and keep only the primary unique rows from the BANK_ACCOUNTS table. Identify duplicate entries sharing the same ACCOUNT_NAME and BRANCH_ID, and retain only the entry with the lowest (minimum) ACCOUNT_ID.',
        instructions: [
            '1. Define a Common Table Expression (CTE) named RANKED_ACCTS.',
            '2. Inside the CTE, query ACCOUNT_ID, ACCOUNT_NAME, BRANCH_ID, and calculate ROW_NUMBER() partitioned by ACCOUNT_NAME, BRANCH_ID, ordered by ACCOUNT_ID ascending (aliased as ROW_NUM).',
            '3. In the main outer query, select ACCOUNT_ID, ACCOUNT_NAME, and BRANCH_ID from the CTE.',
            '4. Filter using a WHERE clause to keep only the records where ROW_NUM = 1.'
        ],
        template: `WITH RANKED_ACCTS AS (
  SELECT ACCOUNT_ID, ACCOUNT_NAME, BRANCH_ID,
         ROW_NUMBER() OVER(PARTITION BY ACCOUNT_NAME, BRANCH_ID ORDER BY ACCOUNT_ID ASC) AS ROW_NUM
  FROM BANK_ACCOUNTS
)
SELECT ACCOUNT_ID, ACCOUNT_NAME, BRANCH_ID
FROM RANKED_ACCTS
-- Filter rows here:
`,
        validate: (code) => {
            const cleanCode = code.replace(/\s+/g, ' ').toUpperCase().trim();
            const errors = [];
            const logs = [];

            logs.push('DSNT408I SQLCODE = 0, SQLSTATE = 00000, SUCCESSFUL EXECUTION');
            logs.push('--- DB2 DEDUPLICATION PLAN COMMITTED ---');

            if (!cleanCode.includes('WITH RANKED_ACCTS') && !cleanCode.includes('WITH')) {
                errors.push('SQLCODE: -104: CTE "RANKED_ACCTS" IS MISSING OR IMPROPERLY SPECIFIED.');
                return { success: false, errors, logs: ['DSNT408I SQLCODE = -104: CTE SYNTAX ERROR'], code: 'SQLCODE -104' };
            }

            if (!cleanCode.includes('ROW_NUMBER()') && !cleanCode.includes('ROW_NUMBER ()')) {
                errors.push('CHALLENGE FAILED: YOU MUST USE THE "ROW_NUMBER()" WINDOW FUNCTION TO DETECT DUPLICATE ENTRIES.');
                return { success: false, errors, logs, code: 'MISSING WINDOW FUNCTION' };
            }

            if (!cleanCode.includes('PARTITION BY') || !cleanCode.includes('ORDER BY')) {
                errors.push('CHALLENGE FAILED: ROW_NUMBER() CLAUSE REQUIRES BOTH "PARTITION BY" AND "ORDER BY" FOR PROPER ACCUMULATION.');
                return { success: false, errors, logs, code: 'INVALID WINDOW CLAUSE' };
            }

            if (!cleanCode.includes('ROW_NUM = 1') && !cleanCode.includes('ROW_NUM=1')) {
                errors.push('CHALLENGE FAILED: TO DEDUPLICATE, THE OUTER FILTER MUST SELECT ONLY ROWS WHERE THE RANK "ROW_NUM" IS EQUAL TO 1.');
                return { success: false, errors, logs, code: 'UNFILTERED DUPLICATES' };
            }

            const rows = [
                { ACCOUNT_ID: 1001, ACCOUNT_NAME: 'Savings Prime', BRANCH_ID: 10 },
                { ACCOUNT_ID: 1002, ACCOUNT_NAME: 'Corporate Checking', BRANCH_ID: 20 },
                { ACCOUNT_ID: 1005, ACCOUNT_NAME: 'Youth Savings', BRANCH_ID: 10 }
            ];

            logs.push('12.18.05 JOB00124  IEF285I   TEMP.SYSUT1                                  DELETED');
            logs.push('12.18.05 JOB00124  $HASP395 EXECUTION ENDED successfully');
            return { success: true, errors: [], logs, code: 'RC=0000', rows };
        }
    },
    {
        id: 'sql-run-total',
        type: 'SQL',
        title: 'Cumulative Running Balance',
        difficulty: 'Expert',
        description: 'Write a DB2 SQL query to calculate a running total balance for each row in the TRANSACTION_LOG table. Select ACCOUNT_ID, TRANSACTION_DATE, TRANSACTION_AMOUNT, and calculate a cumulative running balance (aliased as RUNNING_BALANCE) partitioned by ACCOUNT_ID and ordered by TRANSACTION_DATE.',
        instructions: [
            '1. Select ACCOUNT_ID, TRANSACTION_DATE, and TRANSACTION_AMOUNT columns.',
            '2. Compute the cumulative SUM of TRANSACTION_AMOUNT.',
            '3. Use the OVER clause partitioned by ACCOUNT_ID, and ordered by TRANSACTION_DATE.',
            '4. Alias the window output as RUNNING_BALANCE.'
        ],
        template: `SELECT ACCOUNT_ID, TRANSACTION_DATE, TRANSACTION_AMOUNT,
       SUM(TRANSACTION_AMOUNT) OVER(PARTITION BY ACCOUNT_ID ORDER BY TRANSACTION_DATE) AS RUNNING_BALANCE
FROM TRANSACTION_LOG
ORDER BY ACCOUNT_ID, TRANSACTION_DATE
`,
        validate: (code) => {
            const cleanCode = code.replace(/\s+/g, ' ').toUpperCase().trim();
            const errors = [];
            const logs = [];

            logs.push('DSNT408I SQLCODE = 0, SQLSTATE = 00000, SUCCESSFUL EXECUTION');
            logs.push('--- DB2 ANALYTICAL QUERY OPTIMIZATION COMPLETE ---');

            if (!cleanCode.includes('SUM(') && !cleanCode.includes('SUM (')) {
                errors.push('SQLCODE: -104: CUMULATIVE SUM() WINDOW EXPR NOT FOUND.');
                return { success: false, errors, logs: ['DSNT408I SQLCODE = -104: SUM MISSING'], code: 'SQLCODE -104' };
            }

            if (!cleanCode.includes('OVER') || !cleanCode.includes('PARTITION BY') || !cleanCode.includes('ORDER BY')) {
                errors.push('CHALLENGE FAILED: WINDOW CLAUSE "OVER (PARTITION BY ... ORDER BY ...)" IS MISSING OR INCOMPLETE.');
                return { success: false, errors, logs, code: 'INVALID WINDOWING' };
            }

            if (!cleanCode.includes('RUNNING_BALANCE')) {
                errors.push('CHALLENGE FAILED: YOU MUST ALIAS THE RESULTING WINDOW VALUE AS "RUNNING_BALANCE".');
                return { success: false, errors, logs, code: 'ALIAS ERROR' };
            }

            const rows = [
                { ACCOUNT_ID: 101, TRANSACTION_DATE: '2026-06-01', TRANSACTION_AMOUNT: 1000, RUNNING_BALANCE: 1000 },
                { ACCOUNT_ID: 101, TRANSACTION_DATE: '2026-06-02', TRANSACTION_AMOUNT: -200, RUNNING_BALANCE: 800 },
                { ACCOUNT_ID: 102, TRANSACTION_DATE: '2026-06-01', TRANSACTION_AMOUNT: 5000, RUNNING_BALANCE: 5000 }
            ];

            return { success: true, errors: [], logs, code: 'RC=0000', rows };
        }
    },
    {
        id: 'cobol-unstring',
        type: 'COBOL',
        title: 'Parse Delimited CSV Record',
        difficulty: 'Expert',
        description: 'Implement a CSV parser block in a batch COBOL program using the UNSTRING verb. Split the comma-delimited record WS-CSV-RECORD ("101,Savings Account,5000") into WS-ACCT-ID (numeric), WS-ACCT-NAME (alphanumeric), and WS-BALANCE (numeric).',
        instructions: [
            '1. Complete the UNSTRING WS-CSV-RECORD block.',
            '2. Specify DELIMITED BY "," or DELIMITED BY ",".',
            '3. Specify the INTO clause mapping to WS-ACCT-ID, WS-ACCT-NAME, and WS-BALANCE in that exact order.',
            '4. End the block with END-UNSTRING.'
        ],
        template: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. CSVPARSE.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-CSV-RECORD     PIC X(30) VALUE "101,Savings Account,5000".
       01  WS-ACCT-ID        PIC 9(3).
       01  WS-ACCT-NAME      PIC X(15).
       01  WS-BALANCE        PIC 9(4).
       PROCEDURE DIVISION.
       MAIN-LOGIC.
      *    FIX ME: Add UNSTRING block here:
           
           DISPLAY "SUCCESS: ID=" WS-ACCT-ID " NAME=" WS-ACCT-NAME.
           GOBACK.
`,
        validate: (code) => {
            const cleanCode = code.toUpperCase();
            const errors = [];
            const logs = [];

            logs.push('IKF000I-I  COBOL COMPILER V4.2 STARTED');
            logs.push('IKF9002I-I  COMPILATION COMPLETED. NO CRITICAL COMPILER ERRORS.');

            if (!cleanCode.includes('UNSTRING') || !cleanCode.includes('DELIMITED BY')) {
                errors.push('SYNTAX ERROR: UNSTRING VERB OR DELIMITED BY STATEMENT NOT SPECIFIED.');
                logs.push('IKF5011I-E COBOL SYNTAX EXCEPTION');
                return { success: false, errors, logs, code: 'COMPILER ERROR' };
            }

            if (!cleanCode.includes('WS-ACCT-ID') || !cleanCode.includes('WS-ACCT-NAME') || !cleanCode.includes('WS-BALANCE')) {
                errors.push('CHALLENGE FAILED: INTO CLAUSE TARGET VARIABLES MISMATCH. MAP TO WS-ACCT-ID, WS-ACCT-NAME, AND WS-BALANCE.');
                return { success: false, errors, logs, code: 'MAPPING ERROR' };
            }

            logs.push('DISPLAY: SUCCESS: ID=101 NAME=Savings Account');
            return { success: true, errors: [], logs, code: 'RC=0000' };
        }
    },
    {
        id: 'jcl-gdg',
        type: 'JCL',
        title: 'Generation Data Group Definition',
        difficulty: 'Intermediate',
        description: 'Write a JCL step executing the IDCAMS utility to define a Generation Data Group (GDG) named PROD.TRAN.BACKUPS with a maximum limit of 30 generations. Configure it with the SCRATCH parameter to physically delete rolled-off generations from storage disk.',
        instructions: [
            '1. Ensure you have PGM=IDCAMS on the EXEC card.',
            '2. Place the DEFINE GDG command inside the SYSIN input stream.',
            '3. Specify the name: NAME(PROD.TRAN.BACKUPS).',
            '4. Specify the limits: LIMIT(30) or LIMIT (30).',
            '5. Set the SCRATCH parameter (and optional NOEMPTY) for tape/disk release.'
        ],
        template: `//DEFGDGJOB JOB (ACCT),'DEFINE GDG',CLASS=A,MSGCLASS=X
//STEP1     EXEC PGM=IDCAMS
//SYSPRINT  DD SYSOUT=*
//SYSIN     DD *
  
/*
`,
        validate: (code) => {
            const cleanCode = code.toUpperCase();
            const errors = [];
            const logs = [];

            logs.push('12.20.15 JOB00125  $HASP100 DEFGDGJOB ON RECV');
            logs.push('12.20.16 JOB00125  $HASP373 DEFGDGJOB STARTED');

            if (!cleanCode.includes('PGM=IDCAMS')) {
                errors.push('IEF612I STEP STEP1 DID NOT SPECIFY IDCAMS UTILITY IN THE PGM PROPERTY');
                logs.push('12.20.16 JOB00125  JCL ERROR - EXEC PGM FAILURE');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            if (!cleanCode.includes('DEFINE GDG') && !cleanCode.includes('DEF GDG')) {
                errors.push('IDC3009I IDCAMS SYSTEM SERVICES EXCEPTION: DEFINE GDG STATEMENT EXPECTED.');
                logs.push('12.20.16 JOB00125  IDCAMS FAILURE - DEFINE STATEMENT MISSING');
                return { success: false, errors, logs, code: 'IDCAMS ERROR' };
            }

            if (!cleanCode.includes('NAME(PROD.TRAN.BACKUPS)')) {
                errors.push('IDC3009I INVALID GDG BASE NAME. EXPECTED: NAME(PROD.TRAN.BACKUPS)');
                return { success: false, errors, logs, code: 'IDCAMS ERROR' };
            }

            if (!cleanCode.includes('LIMIT(30)')) {
                errors.push('IDC3009I INVALID GDG LIMIT SPECIFICATION. REQUIRED: LIMIT(30) OR LIMIT (30).');
                return { success: false, errors, logs, code: 'IDCAMS ERROR' };
            }

            if (!cleanCode.includes('SCRATCH')) {
                errors.push('CHALLENGE FAILED: YOU MUST SPECIFY THE "SCRATCH" PARAMETER TO PHYSICALLY RELEASE COPIES FROM DISK STORAGE ON EXPIRY.');
                return { success: false, errors, logs, code: 'IDCAMS ERROR' };
            }

            logs.push('IDC0508I GDG BASE PROD.TRAN.BACKUPS DEFINED SUCCESSFULLY');
            logs.push('12.20.17 JOB00125  $HASP395 DEFGDGJOB ENDED. COND CODE 0000');
            return { success: true, errors: [], logs, code: 'RC=0000' };
        }
    },
    {
        id: 'jcl-sort',
        type: 'JCL',
        title: 'DFSORT Filter and Condense Records',
        difficulty: 'Intermediate',
        description: 'Write a JCL step executing the standard DFSORT utility. Read the input sequential dataset PROD.CLIENT.DATA (via SORTIN DD) and write the sorted, filtered results to PROD.CLIENT.SORTED (via SORTOUT DD). The sorting key starts at position 10, spans 5 bytes, character format, ascending. You must also omit (OMIT COND) any records where the character field at position 1, length 1, equals "D" (representing draft accounts).',
        instructions: [
            '1. Ensure you execute program SORT: EXEC PGM=SORT.',
            '2. Define the SORTIN DD card pointing to DSN=PROD.CLIENT.DATA with DISP=SHR.',
            '3. Define the SORTOUT DD card pointing to DSN=PROD.CLIENT.SORTED with DISP=(NEW,CATLG,DELETE).',
            '4. Provide space allocation for SORTOUT, e.g., SPACE=(TRK,(5,5)).',
            '5. Specify SORT control cards in SYSIN input stream: SORT FIELDS=(10,5,CH,A).',
            '6. Filter out draft accounts using OMIT COND=(1,1,CH,EQ,C\'D\').'
        ],
        template: `//SORTJOB  JOB (ACCT),'SORT RECORDS',CLASS=A,MSGCLASS=X
//STEP1    EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=PROD.CLIENT.DATA,DISP=SHR
//SORTOUT  DD DSN=PROD.CLIENT.SORTED,DISP=(NEW,CATLG,DELETE),
//            SPACE=(TRK,(5,5)),DCB=(RECFM=FB,LRECL=80,BLKSIZE=800)
//SYSIN    DD *
  SORT FIELDS=(10,5,CH,A)
  OMIT COND=(1,1,CH,EQ,C'D')
/*
`,
        validate: (code) => {
            const cleanCode = code.toUpperCase();
            const errors = [];
            const logs = [];

            logs.push('12.33.12 JOB00126  $HASP100 SORTJOB  ON RECV');
            logs.push('12.33.12 JOB00126  $HASP373 SORTJOB  STARTED');
            logs.push('12.33.13 JOB00126  IEF403I SORTJOB - STARTED - TIME=12.33.13');

            if (!cleanCode.includes('PGM=SORT')) {
                errors.push('IEF612I STEP STEP1 DID NOT SPECIFY SORT UTILITY IN THE PGM PROPERTY');
                logs.push('12.33.13 JOB00126  JCL ERROR - EXEC PGM FAILURE');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            if (!cleanCode.includes('SORTIN') || !cleanCode.includes('PROD.CLIENT.DATA')) {
                errors.push('IEF212I SORTIN DD STATEMENT MISSING OR REFERS TO UNEXPECTED DATASET. EXPECTED: DSN=PROD.CLIENT.DATA');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            if (!cleanCode.includes('SORTOUT') || !cleanCode.includes('PROD.CLIENT.SORTED')) {
                errors.push('IEF212I SORTOUT DD STATEMENT MISSING OR REFERS TO UNEXPECTED DATASET. EXPECTED: DSN=PROD.CLIENT.SORTED');
                return { success: false, errors, logs, code: 'JCL ERROR' };
            }

            if (!cleanCode.includes('SORT FIELDS') || !cleanCode.includes('10,5,CH,A')) {
                errors.push('ICE007A SYNTAX ERROR IN SORT CONTROL STATEMENT: FIELDS=(10,5,CH,A) REQUIRED.');
                logs.push('12.33.13 JOB00126  ICE185I DFSORT TERMINATED WITH ERRORS');
                return { success: false, errors, logs, code: 'DFSORT ERROR' };
            }

            if (!cleanCode.includes('OMIT COND') || !cleanCode.includes('1,1,CH,EQ') || !cleanCode.includes("C'D'")) {
                errors.push('ICE007A SYNTAX ERROR IN OMIT CONTROL STATEMENT: OMIT COND=(1,1,CH,EQ,C\'D\') REQUIRED.');
                logs.push('12.33.13 JOB00126  ICE185I DFSORT TERMINATED WITH ERRORS');
                return { success: false, errors, logs, code: 'DFSORT ERROR' };
            }

            logs.push('ICE143I 0 SORTIN LRECL=80, RECFM=FB, BLKSIZE=800');
            logs.push('ICE055I 0 INSERTION SORT ACTIVE');
            logs.push('ICE054I 0 RECORDS IN: 15, RECORDS OUT: 11 (4 DRAFT RECORDS OMITTED)');
            logs.push('ICE201I 0 SORTOUT LRECL=80, RECFM=FB, BLKSIZE=800');
            logs.push('12.33.14 JOB00126  IEF285I   PROD.CLIENT.SORTED                           CATALOGED');
            logs.push('12.33.14 JOB00126  $HASP395 SORTJOB  ENDED. COND CODE 0000');
            return { success: true, errors: [], logs, code: 'RC=0000' };
        }
    },
    {
        id: 'sql-second-max',
        type: 'SQL',
        title: 'Second Highest Salary via Dense Rank',
        difficulty: 'Expert',
        description: 'Write a DB2 SQL query to find the second highest employee salary from the EMPLOYEES table. To ensure accuracy if there are multiple employees earning the same salary, use the DENSE_RANK() window function partitioned by nothing, ordered by SALARY in descending order, and select only the record with a dense rank equal to 2.',
        instructions: [
            '1. Define a Common Table Expression (CTE) named RANKED_SALARIES.',
            '2. Inside the CTE, query SALARY and calculate DENSE_RANK() OVER(ORDER BY SALARY DESC) as SALARY_RANK from the EMPLOYEES table.',
            '3. In the main outer query, select DISTINCT SALARY (or SALARY) from the CTE.',
            '4. Filter using a WHERE clause to select only the records where SALARY_RANK = 2.'
        ],
        template: `WITH RANKED_SALARIES AS (
  SELECT SALARY,
         DENSE_RANK() OVER(ORDER BY SALARY DESC) AS SALARY_RANK
  FROM EMPLOYEES
)
SELECT DISTINCT SALARY
FROM RANKED_SALARIES
-- Filter rows here:
`,
        validate: (code) => {
            const cleanCode = code.replace(/\s+/g, ' ').toUpperCase().trim();
            const errors = [];
            const logs = [];

            logs.push('DSNT408I SQLCODE = 0, SQLSTATE = 00000, SUCCESSFUL EXECUTION');
            logs.push('--- DB2 DENSE RANKING ACCESS PATH REGISTERED ---');

            if (!cleanCode.includes('WITH RANKED_SALARIES') && !cleanCode.includes('WITH')) {
                errors.push('SQLCODE: -104: CTE "RANKED_SALARIES" IS MISSING OR IMPROPERLY SPECIFIED.');
                return { success: false, errors, logs: ['DSNT408I SQLCODE = -104: CTE SYNTAX ERROR'], code: 'SQLCODE -104' };
            }

            if (!cleanCode.includes('DENSE_RANK()') && !cleanCode.includes('DENSE_RANK ()')) {
                errors.push('CHALLENGE FAILED: YOU MUST USE THE "DENSE_RANK()" WINDOW FUNCTION.');
                return { success: false, errors, logs, code: 'MISSING DENSE_RANK' };
            }

            if (!cleanCode.includes('ORDER BY SALARY DESC')) {
                errors.push('CHALLENGE FAILED: DENSE_RANK() OVER CLAUSE MUST BE ORDERED BY SALARY DESCENDING.');
                return { success: false, errors, logs, code: 'INVALID ORDER BY' };
            }

            if (!cleanCode.includes('SALARY_RANK = 2') && !cleanCode.includes('SALARY_RANK=2')) {
                errors.push('CHALLENGE FAILED: THE OUTER WHERE FILTER MUST TARGET SALARY_RANK = 2.');
                return { success: false, errors, logs, code: 'FILTER MISMATCH' };
            }

            const rows = [
                { SALARY: 95000 }
            ];

            logs.push('12.35.01 JOB00127  $HASP395 EXECUTION ENDED successfully');
            return { success: true, errors: [], logs, code: 'RC=0000', rows };
        }
    }
];


export const CodingSandbox = () => {
    const [selectedChallengeId, setSelectedChallengeId] = useState(CHALLENGES[0].id);
    const challenge = CHALLENGES.find(c => c.id === selectedChallengeId) || CHALLENGES[0];

    const [code, setCode] = useState(challenge.template);
    const [isRunning, setIsRunning] = useState(false);
    const [runResult, setRunResult] = useState(null);
    const [logs, setLogs] = useState([]);
    const [errors, setErrors] = useState([]);
    
    const editorRef = useRef(null);
    const lineNumbersRef = useRef(null);

    // Sync template when challenge changes
    useEffect(() => {
        setCode(challenge.template);
        setRunResult(null);
        setLogs([]);
        setErrors([]);
    }, [selectedChallengeId, challenge.template]);

    // Synchronize scrolling of editor and line numbers gutter
    const handleScroll = () => {
        if (editorRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
        }
    };

    const handleExecute = () => {
        setIsRunning(true);
        setRunResult(null);
        setLogs(['SUBMITTING JOB TO WORKSTATION SPOOLER...', 'LINKING RESOURCE ALLOCATORS...']);
        setErrors([]);

        setTimeout(() => {
            const res = challenge.validate(code);
            setIsRunning(false);
            setRunResult(res.success ? 'SUCCESS' : 'FAILURE');
            setLogs(res.logs);
            setErrors(res.errors);
        }, 1200);
    };

    const handleReset = () => {
        if (window.confirm('Reset editor to original challenge template?')) {
            setCode(challenge.template);
            setRunResult(null);
            setLogs([]);
            setErrors([]);
        }
    };

    const linesCount = code.split('\n').length;
    const lineNumbers = Array.from({ length: Math.max(linesCount, 1) }, (_, i) => {
        // Format line number like a mainframe terminal (e.g. 000100, 000200)
        return String((i + 1) * 100).padStart(6, '0');
    });

    return (
        <div className="sandbox-container">
            {/* Title / Info Header */}
            <div className="sandbox-header-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div className="pulse-glow" style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>💻</div>
                    <div>
                        <h3 className="section-title" style={{ margin: 0 }}>Interactive Mainframe Terminal Sandbox</h3>
                        <p className="section-subtitle" style={{ margin: 0, textTransform: 'none' }}>
                            Compile JCL datasets, prevent COBOL abends, and perform DB2 SQL queries.
                        </p>
                    </div>
                </div>
                <div className="pill-group" style={{ margin: 0 }}>
                    {CHALLENGES.map(ch => (
                        <button
                            key={ch.id}
                            className={`filter-pill ${selectedChallengeId === ch.id ? 'active' : ''}`}
                            onClick={() => setSelectedChallengeId(ch.id)}
                        >
                            {ch.type}: {ch.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="sandbox-workspace-grid">
                {/* Challenge Details Sidebar (Left) */}
                <div className="sandbox-sidebar-panel">
                    <div className="panel-title-bar">
                        <Icon name="info" /> CHALLENGE SPECIFICATION
                    </div>
                    <div className="panel-body-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span className="badge badge-category">{challenge.type} Challenge</span>
                            <span className={`badge ${
                                challenge.difficulty === 'Beginner' ? 'badge-difficulty-beginner' :
                                challenge.difficulty === 'Intermediate' ? 'badge-difficulty-intermediate' : 'badge-difficulty-expert'
                            }`}>
                                {challenge.difficulty}
                            </span>
                        </div>
                        <h4 style={{ color: 'var(--text-light)', marginBottom: '0.5rem', fontWeight: 700 }}>{challenge.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                            {challenge.description}
                        </p>

                        <h5 style={{ color: 'var(--text-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                            Instructions:
                        </h5>
                        <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {challenge.instructions.map((inst, idx) => (
                                <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.4', paddingLeft: '1rem', textIndent: '-1rem' }}>
                                    • {inst}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Editor & Console Area (Right) */}
                <div className="sandbox-editor-panel">
                    {/* Terminal Header */}
                    <div className="code-header" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                        <span className="code-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="status-dot" style={{ width: '6px', height: '6px' }}></span>
                            3270 Terminal Screen — USER.SOURCE({challenge.id.toUpperCase()})
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="action-btn" onClick={handleReset} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                                <Icon name="reset" /> Reset
                            </button>
                            <button
                                className="action-btn mastered-active"
                                onClick={handleExecute}
                                disabled={isRunning}
                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
                            >
                                {isRunning ? (
                                    <>⏳ RUNNING...</>
                                ) : (
                                    <>⚡ SUBMIT / EXECUTE</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Interactive Editor Gutter + Textarea */}
                    <div className="terminal-editor-container">
                        {/* Line numbers column */}
                        <div className="terminal-line-numbers" ref={lineNumbersRef}>
                            {lineNumbers.map((num, i) => (
                                <div key={i} className="terminal-line-num">{num}</div>
                            ))}
                        </div>

                        {/* Code input text area */}
                        <textarea
                            ref={editorRef}
                            className="terminal-textarea"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onScroll={handleScroll}
                            spellCheck="false"
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                        />
                    </div>

                    {/* Terminal Console Output */}
                    <div className="terminal-console-panel">
                        <div className="console-title-bar">
                            <span>JES2 SPOOL WRITER / RUNTIME LOGS</span>
                            {runResult && (
                                <span className={`badge ${runResult === 'SUCCESS' ? 'badge-difficulty-beginner' : 'badge-difficulty-expert'}`} style={{ marginLeft: '1rem' }}>
                                    STATUS: {runResult}
                                </span>
                            )}
                        </div>
                        <div className="console-logs-container">
                            {logs.length === 0 ? (
                                <div className="console-placeholder-msg">
                                    [SYS] Waiting for job execution. Write your program above and click EXECUTE to view system outputs, catalog details, or abend registers.
                                </div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className={`console-log-line ${
                                        log.includes('ABEND') || log.includes('ERROR') || log.includes('CEE') || log.includes('FAILED') ? 'log-error' :
                                        log.includes('SUCCESS') || log.includes('RC=0000') || log.includes('CATALOGED') ? 'log-success' : 'log-info'
                                    }`}>
                                        {log}
                                    </div>
                                ))
                            )}

                            {/* If there are syntax errors / compiler reports */}
                            {errors.length > 0 && (
                                <div className="console-error-card">
                                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>❌ PARSE/COMPILER REPORTS:</div>
                                    {errors.map((err, i) => (
                                        <div key={i} style={{ fontSize: '0.85rem', marginBottom: '0.15rem' }}>
                                            &gt; {err}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Render DB2 SQL Grid if Success and exists */}
                            {runResult === 'SUCCESS' && challenge.type === 'SQL' && challenge.validate(code).rows && (
                                <div className="console-sql-grid-container">
                                    <div style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        DB2 OUTPUT DATA SET RECORDS:
                                    </div>
                                    <table className="console-sql-table">
                                        <thead>
                                            <tr>
                                                {Object.keys(challenge.validate(code).rows[0] || {}).map((colName) => (
                                                    <th key={colName}>{colName}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {challenge.validate(code).rows.map((row, idx) => (
                                                <tr key={idx}>
                                                    {Object.values(row).map((val, colIdx) => (
                                                        <td key={colIdx}>
                                                            {typeof val === 'number' && val > 1000 ? `$${val.toLocaleString()}` : String(val)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
