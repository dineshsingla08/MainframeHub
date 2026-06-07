// MAINFRAME INTERVIEW QUESTIONS BASE DATABASE
// All batches are merged via allQuestions export below

import { questionsBatch2 } from './questions_batch2.js';
import { questionsBatch3 } from './questions_batch3.js';
import { questionsBatch4 } from './questions_batch4.js';
import { questionsBatch5 } from './questions_batch5.js';
import { questionsBatch6 } from './questions_batch6.js';
import { questionsBatch7 } from './questions_batch7.js';
import { questionsBatch8 } from './questions_batch8.js';
import { questionsBatch9 } from './questions_batch9.js';

export const questionsData = [
    // ==================== COBOL QUESTIONS ====================
    {
        id: "cobol_01",
        category: "COBOL",
        level: "Beginner",
        question: "Explain the four main divisions of a COBOL program and their ordering.",
        answer: "Every COBOL program must have these four divisions in the exact order:\n\n1. **IDENTIFICATION DIVISION**: Specifies program metadata (Program-ID, Author, Date-Written). **PROGRAM-ID** is mandatory.\n2. **ENVIRONMENT DIVISION**: Links the program to external resources and device profiles. It houses `CONFIGURATION SECTION` and `INPUT-OUTPUT SECTION`.\n3. **DATA DIVISION**: Defines all working fields, variables, structures, and buffers used. Includes `FILE SECTION`, `WORKING-STORAGE SECTION`, and `LINKAGE SECTION` (for subprogram parameter mapping).\n4. **PROCEDURE DIVISION**: Contains executable statements, loops, database integrations, and operations. This is the logical core of the program.",
        code: "IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLOJOB.\n\nENVIRONMENT DIVISION.\nCONFIGURATION SECTION.\n\nDATA DIVISION.\nWORKING-STORAGE SECTION.\n01 WS-GREETING PIC X(15) VALUE \"HELLO MAINFRAME\".\n\nPROCEDURE DIVISION.\n    DISPLAY WS-GREETING.\n    GOBACK.",
        tip: "Make sure to emphasize that PROGRAM-ID is the only strictly mandatory clause in modern COBOL, but all four divisions remain standard to maintain structure.",
        quizOptions: [
            "Data, Identification, Procedure, Environment",
            "Identification, Environment, Data, Procedure",
            "Environment, Identification, Data, Procedure",
            "Identification, Data, Environment, Procedure"
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_02",
        category: "COBOL",
        level: "Beginner",
        question: "What is the difference between level numbers 01, 77, 88, and 66 in the DATA DIVISION?",
        answer: "COBOL uses level numbers to define data hierarchy and specific declarations:\n\n* **01**: Defines a record name or a major data structure that can contain nested group or elementary items.\n* **77**: Declares stand-alone, elementary variables that cannot contain subfields (e.g., individual loop index or temp flags). Cannot be subdivided.\n* **88**: Declares condition-names (conditional boolean variables) associated with values of a parent field, improving code readability.\n* **66**: Used for the `RENAMES` clause to regroup existing elementary data fields into a new structured layout.",
        code: "01 WS-EMPLOYEE.\n   05 WS-EMP-TYPE    PIC X.\n      88 WS-FULL-TIME VALUE 'F'.\n      88 WS-PART-TIME VALUE 'P'.\n77 WS-LOOP-COUNTER   PIC 9(4) COMP VALUE 0.\n66 WS-EMP-RENAME     RENAMES WS-EMPLOYEE.",
        tip: "Modern shops prefer using level 01 instead of level 77 for consistency, but you will see level 77 widely in legacy source files.",
        quizOptions: [
            "Level 88 defines a subprogram call, while 77 defines record layouts.",
            "Level 77 is for standalone fields, 88 for condition names, 66 for renaming, and 01 for group/record structures.",
            "Level 66 is for index variables, 88 for database keys, and 77 for files.",
            "Level 01 is only for numbers, while level 77 is for alphanumeric text."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_03",
        category: "COBOL",
        level: "Beginner",
        question: "Explain the difference between COMP (Binary) and COMP-3 (Packed Decimal) representations.",
        answer: "These computational forms optimize arithmetic speed and file storage:\n\n* **COMP (Binary)**: Stores values in hardware-native binary format. It allocates bytes in power-of-two increments:\n  - PIC 9(1) to 9(4) occupies 2 bytes (half-word)\n  - PIC 9(5) to 9(9) occupies 4 bytes (full-word)\n  - PIC 9(10) to 9(18) occupies 8 bytes (double-word)\n* **COMP-3 (Packed Decimal)**: Stores two digits per byte using binary-coded decimal (BCD), with the last half-byte (nibble) reserved for the sign (C/F for positive, D for negative). Formula for byte size is: `(Number of digits + 1) / 2` (rounded up).",
        code: "* COMP (Binary allocation)\n01 WS-BIN-VAL  PIC 9(4) COMP.    * Takes 2 bytes\n\n* COMP-3 (Packed Decimal allocation)\n01 WS-PACK-VAL PIC S9(5) COMP-3. * Takes (5+1)/2 = 3 bytes\n* Memory layout: |12|34|5D| where D is negative sign",
        tip: "Always choose COMP-3 for decimal/financial arithmetic to prevent binary precision loss, and use COMP for indices or loops due to fast CPU registry operations.",
        quizOptions: [
            "COMP is alphanumeric; COMP-3 is binary.",
            "COMP occupies twice the memory of COMP-3 regardless of the picture clause.",
            "COMP stores data in binary format; COMP-3 stores two digits per byte (Packed Decimal) with a trailing sign nibble.",
            "COMP-3 is used only for character strings; COMP is for float values."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "cobol_04",
        category: "COBOL",
        level: "Beginner",
        question: "What is the difference between STOP RUN, GOBACK, and EXIT PROGRAM?",
        answer: "These commands control execution flow differently:\n\n* **STOP RUN**: Terminates the entire run-unit (main program and all dynamically/statically loaded subprograms). It returns control back to the operating system (or JCL step). Closes opened files.\n* **GOBACK**: Returns execution control to the immediate caller. If called from a subprogram, it returns to the parent program. If executed in the main program, it functions like `STOP RUN` and returns to JCL.\n* **EXIT PROGRAM**: Exits a called subprogram and returns to the calling program. If executed inside a main program, it does nothing and execution simply drops through to the next statement.",
        code: "* In subprogram:\nPROCEDURE DIVISION.\n    ...\n    EXIT PROGRAM. * Returns to parent\n\n* In main program or subprogram:\nPROCEDURE DIVISION.\n    ...\n    GOBACK.       * Recommended exit statement",
        tip: "Standardize on GOBACK in all programs. It behaves intelligently whether the module is acting as a main program or a subprogram, reducing bugs during refactoring.",
        quizOptions: [
            "GOBACK resets the program state; STOP RUN loops forever.",
            "STOP RUN terminates the run unit; GOBACK returns to the immediate calling module; EXIT PROGRAM returns from a subprogram (noop in main).",
            "EXIT PROGRAM terminates the CICS region; STOP RUN resets JCL parameters.",
            "They are completely synonymous in all contexts."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_05",
        category: "COBOL",
        level: "Intermediate",
        question: "Compare the SEARCH and SEARCH ALL statements in COBOL table handling.",
        answer: "Both statements locate elements within a table (array) defined with the `OCCURS` clause, but they have major performance and logical differences:\n\n* **SEARCH**: Performs a sequential (linear) search. It scans records from the current index value. It does not require sorted data. You must manually initialize the index using the `SET` statement before executing search.\n* **SEARCH ALL**: Performs a binary search. It requires the table to be sorted and defined with an `ASCENDING/DESCENDING KEY` clause. It automatically sets the index to the midpoint to split search spaces. Only accepts the `EQUAL TO (=)` or `AND` conditions.",
        code: "01 WS-TABLE.\n   05 WS-ITEMS OCCURS 100 TIMES \n                ASCENDING KEY IS WS-ID\n                INDEXED BY WS-IDX.\n      10 WS-ID PIC 9(4).\n\n* SEARCH ALL Example:\nSEARCH ALL WS-ITEMS\n    AT END DISPLAY \"NOT FOUND\"\n    WHEN WS-ID(WS-IDX) = 1024\n        DISPLAY \"FOUND ITEM AT: \" WS-IDX.",
        tip: "Binary search (SEARCH ALL) runs in O(log N) time, making it exceptionally fast for large tables. Linear search (SEARCH) runs in O(N) but allows complex operators (<, >, OR).",
        quizOptions: [
            "SEARCH is for 2D tables; SEARCH ALL is for 3D tables.",
            "SEARCH performs a linear scan (requires manual SET); SEARCH ALL performs a binary search (requires sorted keys and INDEXED BY).",
            "SEARCH ALL operates only on databases; SEARCH is for internal memory arrays.",
            "SEARCH ALL runs slower than SEARCH on large tables."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_06",
        category: "COBOL",
        level: "Intermediate",
        question: "What is File Status in COBOL, and what does status code '35' mean?",
        answer: "The **FILE STATUS** clause binds a 2-character working-storage variable to a file. The system updates this variable after every file operation (OPEN, READ, WRITE, CLOSE) to denote success or failure.\n\n* **Common Status Keys**:\n  - `00`: Success.\n  - `10`: End of file reached (EOF) during READ.\n  - `23`: Record key not found (for indexed files).\n  - `35`: The file specified in `SELECT` could not be found or opened (e.g., the corresponding JCL DD statement is missing or contains a typo).\n  - `97`: The file was opened successfully, but was flagged as corrupted or previously uncommitted.",
        code: "INPUT-OUTPUT SECTION.\nFILE-CONTROL.\n    SELECT EMP-FILE ASSIGN TO EMPDD\n    ORGANIZATION IS SEQUENTIAL\n    FILE STATUS IS WS-FILE-STATUS.\n\nDATA DIVISION.\nWORKING-STORAGE SECTION.\n01 WS-FILE-STATUS PIC X(2).",
        tip: "Always inspect WS-FILE-STATUS immediately after every OPEN or READ command to prevent catastrophic crashes.",
        quizOptions: [
            "Status 35 means read access denied.",
            "Status 35 indicates the target file dataset was not found (missing JCL DD or catalog issue).",
            "Status 35 indicates a record lock collision.",
            "Status 35 represents numeric data overflow."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_07",
        category: "COBOL",
        level: "Intermediate",
        question: "Explain Static vs Dynamic calling of subprograms in COBOL.",
        answer: "COBOL subprograms are invoked using the `CALL` statement, executed in two ways:\n\n* **Static Call**: The subprogram name is specified as a literal string (e.g. `CALL \"SUBPROG\"`). The Linkage Editor compiles both the main program and subprogram into a single executable module. Faster execution since there is no load overhead, but increases the module size.\n* **Dynamic Call**: The subprogram name is specified via a variable name (e.g. `CALL WS-PROG-NAME`). The subprogram remains a separate executable load module, resolved and loaded into memory only when the statement runs. Saves memory and allows subprograms to be updated without recompiling parent programs.",
        code: "* Static call example:\nCALL \"BILLING\" USING WS-DATA.\n\n* Dynamic call example:\n01 WS-SUBPROG PIC X(8) VALUE \"BILLING\".\nCALL WS-SUBPROG USING WS-DATA.",
        tip: "In modern mainframe environments, dynamic calls are standard to facilitate maintenance, modular micro-testing, and reduce duplicate linkage space.",
        quizOptions: [
            "Static calls require JCL parameters; dynamic calls run inside CICS.",
            "Static calls are resolved at compilation/link-edit (hard-coded literal); dynamic calls are resolved at runtime via a variable containing the module name.",
            "Dynamic calls can only be run once; static calls can run multiple times.",
            "There is no functional difference in binary packaging."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_08",
        category: "COBOL",
        level: "Intermediate",
        question: "What is the difference between the REDEFINES and RENAMES clauses?",
        answer: "Both clauses map data elements differently, but they differ in purpose and level restrictions:\n\n* **REDEFINES**: Allows different fields to occupy the **exact same memory location**. Must immediately follow the field being redefined. Cannot redefine items at a lower level than the original block. Must retain identical memory sizes in bytes.\n* **RENAMES (Level 66)**: Regroups already existing variables (possibly spanning contiguous items) under a new variable name. It does not redefine memory, but creates an alternative logical alias for grouped items.",
        code: "* REDEFINES (reusing storage)\n05 WS-DATE-STR PIC X(8).\n05 WS-DATE-NUM REDEFINES WS-DATE-STR.\n   10 WS-YEAR  PIC 9(4).\n   10 WS-MONTH PIC 9(2).\n   10 WS-DAY   PIC 9(2).\n\n* RENAMES (grouping elements)\n01 WS-RECORD.\n   05 A PIC X.\n   05 B PIC X.\n   05 C PIC X.\n66 BC-GROUP RENAMES B THRU C.",
        tip: "REDEFINES is widely used to toggle interpretation of a variable between alphanumeric and numeric types, crucial for input sanitization.",
        quizOptions: [
            "REDEFINES is used to call DB2; RENAMES is for CICS maps.",
            "REDEFINES maps different variables to the same physical memory space; RENAMES (level 66) creates a grouping alias over existing contiguous variables.",
            "RENAMES must have the exact same picture format; REDEFINES can only run in the LINKAGE SECTION.",
            "REDEFINES deletes the original variable from memory."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_09",
        category: "COBOL",
        level: "Expert",
        question: "How do you handle and debug a S0C7 ABEND in a COBOL program?",
        answer: "A **S0C7 ABEND** is a Data Exception error. It occurs when a program tries to perform arithmetic calculations on a variable containing non-numeric data (e.g. spaces, hex nulls `Low-Values`, or alphabetic characters in a `PIC 9` variable).\n\n**Resolution Steps**:\n1. Look up the offset of the failure in the system logs or dump (Sysout / CEEDUMP).\n2. Locate the specific variable causing the issue in the symbol table or compile listing.\n3. Implement input sanitization using the `NUMERIC` class test: `IF WS-NUM-FIELD IS NOT NUMERIC...` before processing calculations.\n4. Initialize numeric fields to 0 (using `VALUE ZERO` or `INITIALIZE`).",
        code: "* Safe programming to avoid S0C7\nIF WS-INPUT-VAL IS NUMERIC\n    ADD WS-INPUT-VAL TO WS-TOTAL\nELSE\n    MOVE ZERO TO WS-INPUT-VAL\n    DISPLAY \"WARNING: BAD INPUT DATA DETECTED\"\nEND-IF.",
        tip: "Spaces in COBOL PIC 9 fields are stored as hex '40' in EBCDIC, which is invalid for arithmetic and will trigger an S0C7 abend instantly. Always initialize numbers to zero!",
        quizOptions: [
            "S0C7 is a division by zero error; fix by checking for zero divisors.",
            "S0C7 is a numeric data exception (non-numeric data in a numeric field); resolve by validating with the IS NUMERIC check and initializing variables properly.",
            "S0C7 is an out-of-memory abend; resolve by increasing the REGION size in JCL.",
            "S0C7 represents a file lock collision in DB2."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_10",
        category: "COBOL",
        level: "Expert",
        question: "Compare CALL BY REFERENCE, CALL BY CONTENT, and CALL BY VALUE.",
        answer: "These mechanisms define how parameters are passed to subprograms:\n\n* **CALL BY REFERENCE (Default)**: Passes the memory address of the argument variable. If the subprogram modifies this parameter, it directly alters the variable in the calling program.\n* **CALL BY CONTENT**: Passes a copy of the argument's data to a temporary memory location, then passes that address. The subprogram can modify the copy, but the calling program's original variable remains unchanged.\n* **CALL BY VALUE**: Passes the actual raw value of the variable directly. Ideal for calling non-COBOL programs (like C or Java) which do not use pointer reference semantics.",
        code: "* Passing configurations\nCALL 'MYSUB' USING BY REFERENCE WS-VAR1\n                   BY CONTENT   WS-VAR2\n                   BY VALUE     WS-VAR3.",
        tip: "Use BY CONTENT when passing read-only configuration variables or structures to prevent called modules from accidentally corrupting the parent module's states.",
        quizOptions: [
            "BY VALUE only works for text files.",
            "BY REFERENCE passes a copy; BY CONTENT passes the original variable address.",
            "BY REFERENCE passes the actual memory address (subprogram can edit parent data); BY CONTENT passes a copy (parent data is protected); BY VALUE passes the raw data directly.",
            "Dynamic calls can only use CALL BY REFERENCE."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "cobol_11",
        category: "COBOL",
        level: "Expert",
        question: "Explain the structure of the SELECT clause in COBOL and how it links to JCL.",
        answer: "The `SELECT` clause in the `FILE-CONTROL` paragraph of the `ENVIRONMENT DIVISION` binds a program's internal logical file name to the external physical dataset via the JCL DD name.\n\n* **SELECT [logical-file-name]**: Specifies the internal handle used in READ/WRITE commands.\n* **ASSIGN TO [ddname]**: Links the logical file to the DD name in the JCL execution step. In JCL, the `//ddname DD DSN=...` statement declares the physical dataset location.",
        code: "* COBOL Code:\nENVIRONMENT DIVISION.\nFILE-CONTROL.\n    SELECT EMP-FILE ASSIGN TO OUTFILE.\n\n* JCL Code:\n//STEP01 EXEC PGM=COBPROG\n//OUTFILE DD DSN=PROD.EMP.DATA,DISP=(NEW,CATLG,DELETE)",
        tip: "Make sure the ASSIGN name exactly matches the JCL DD name (limited to 8 characters). A mismatch results in a runtime File Status 35 error.",
        quizOptions: [
            "It maps DB2 schemas directly to variables.",
            "It establishes a dynamic memory pointer to CICS queues.",
            "It maps the internal program logical file name to the external JCL DD name via the ASSIGN TO clause.",
            "It compiles the COBOL source file directly into machine code."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "cobol_12",
        category: "COBOL",
        level: "Expert",
        question: "Explain the EVALUATE statement and how it optimizes conditional branches.",
        answer: "The `EVALUATE` statement implements multi-branch selection (similar to switch/case in other languages). It evaluates variables, conditions, or expressions, and executes matching clauses.\n\n* **Advantages**:\n  - Eliminates highly nested, unreadable `IF-ELSE` statements.\n  - Supports multiple conditional criteria (`ALSO`, `THRU`).\n  - Compiles into optimized branch-tables under IBM compilers, maximizing CPU execution speed.",
        code: "EVALUATE WS-AGE ALSO WS-GENDER\n    WHEN 18 THRU 65 ALSO \"M\"\n        PERFORM RENDER-ADULT-MALE\n    WHEN 18 THRU 65 ALSO \"F\"\n        PERFORM RENDER-ADULT-FEMALE\n    WHEN OTHER\n        PERFORM RENDER-OTHER\nEND-EVALUATE.",
        tip: "Use EVALUATE TRUE ALSO WS-VAR... to perform complex logical checks across multiple variables in a single declarative block.",
        quizOptions: [
            "It computes standard deviations of tables.",
            "It is a replacement for SELECT SQL statements in DB2.",
            "It acts as a multi-way branch selection (switch-case) that is highly optimized by compilers and simplifies nested conditions.",
            "It evaluates code performance at execution runtime."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "cobol_13",
        category: "COBOL",
        level: "Expert",
        question: "Explain the performance impact of computational USAGES (COMP, COMP-3, COMP-4, BINARY) and boundary alignment.",
        answer: "Mainframe architecture (System z) optimizes arithmetic operations depending on USAGE types:\n\n* **COMP / COMP-4 / BINARY**: Represent pure binary numbers. They are processed directly in CPU registers (GPRs). When used for array indexing or loop variables, they are highly performant. Boundary alignment ('SYNCHRONIZED' or compile option 'TRUNC(BIN)') ensures they align on halfword/fullword boundaries, avoiding memory alignment trap cycles.\n* **COMP-3 (Packed Decimal)**: Handled by the decimal execution unit (DFU). It stores two digits per byte with a sign nibble. Ideal for currency/accounting, preventing float precision errors, but requires decimal instruction overhead.\n* **DISPLAY (Zoned Decimal)**: Default representation. Requires conversion to packed decimal before any arithmetic, making it very slow for calculations.",
        code: "01  WS-IDX   PIC S9(4) COMP SYNCHRONIZED. * Aligned 2-byte binary\n01  WS-BAL   PIC S9(9)V92 COMP-3.          * Packed decimal (5 bytes)",
        tip: "Always use COMP with SYNCHRONIZED for loop indices to bypass CPU alignment overhead, and stick to COMP-3 for decimal variables.",
        quizOptions: [
            "COMP is alphanumeric; COMP-3 is binary.",
            "BINARY usage is slow because of rounding logic.",
            "COMP/BINARY is optimized for registers and loop indices; COMP-3 (Packed Decimal) avoids float rounding errors in financial math; DISPLAY requires conversions before arithmetic, slowing down CPU.",
            "They are completely identical in compiled code."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "cobol_14",
        category: "COBOL",
        level: "Expert",
        question: "Explain the difference between INITIALIZE and MOVE statements when handling structures.",
        answer: "These commands reset or assign variables differently:\n\n* **INITIALIZE**: Automatically checks field types in a group. It sets numeric fields to zeros and alphanumeric/alphabetic fields to spaces. It leaves FILLER fields unchanged. Does not clear indicator variables or fields set to REDEFINES/POINTERS unless specific options are supplied.\n* **MOVE**: Directly overrides the target memory buffer with a specific value. If applied to a group structure, it performs a bulk character block copy (alphanumeric move) without checking the internal fields, which can accidentally overwrite signs of numeric fields, potentially leading to S0C7 abends.",
        code: "01  WS-GRP.\n    05  WS-NAME PIC X(10) VALUE 'JANE'.\n    05  WS-AMT  PIC 9(5) COMP-3 VALUE 100.\n\n* Sets WS-NAME to spaces, WS-AMT to zero:\nINITIALIZE WS-GRP.\n\n* Bulk copy, overwriting numeric signs if source is non-matching:\nMOVE SPACES TO WS-GRP.",
        tip: "Do not use MOVE SPACES to initialize a group structure containing COMP-3 numeric fields, as spaces (hex 40) will corrupt packed signs, triggering S0C7 decimal exceptions.",
        quizOptions: [
            "INITIALIZE deletes the program from memory; MOVE copies it.",
            "INITIALIZE sets numerics to zeroes and strings to spaces; MOVE performs a direct bulk memory block copy regardless of nested field definitions.",
            "MOVE is only for database queries; INITIALIZE is for files.",
            "They behave identically on all group structures."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_15",
        category: "COBOL",
        level: "Expert",
        question: "Compare PERFORM WITH TEST BEFORE and PERFORM WITH TEST AFTER statements.",
        answer: "These loop instructions specify when a condition is evaluated:\n\n* **WITH TEST BEFORE (Default)**: Evaluates the conditional test *before* executing the paragraph. If the condition is met initially, the loop body runs zero times.\n* **WITH TEST AFTER**: Evaluates the conditional test *after* executing the paragraph. The loop body executes at least once, regardless of the condition state.",
        code: "* Condition checked before (Runs 0 times if WS-IDX = 5):\nPERFORM PARA-A WITH TEST BEFORE UNTIL WS-IDX = 5\n\n* Checked after (Runs at least 1 time):\nPERFORM PARA-B WITH TEST AFTER UNTIL WS-IDX = 5",
        tip: "Use TEST AFTER when writing initialization steps that must run once before checking loop conditions.",
        quizOptions: [
            "TEST BEFORE is for JCL steps; TEST AFTER is for CICS transactions.",
            "TEST BEFORE evaluates conditions before running the loop (can run zero times); TEST AFTER evaluates after the loop body executes (runs at least once).",
            "TEST AFTER compiles faster than TEST BEFORE.",
            "They are obsolete options replaced by EVALUATE."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_16",
        category: "COBOL",
        level: "Expert",
        question: "Explain the NUMPROC compile option and its performance impact.",
        answer: "The **NUMPROC** compiler option tells the IBM Enterprise COBOL compiler how to handle signs in decimal fields (like COMP-3 or zoned decimal):\n\n* **NUMPROC(NOPFD)**: Default. The compiler generates extra code to check and convert signs to preferred signs (C, D, F) before decimal arithmetic or comparisons. High overhead but safe for uninitialized data.\n* **NUMPROC(PFD)**: Preferred. Assumes all signs are already correct and preferred. Bypasses checking code, increasing arithmetic performance significantly. If invalid signs are present, it causes S0C7 abends.",
        code: "* Under NUMPROC(PFD), comparison is a simple hardware check.\n* Under NUMPROC(NOPFD), compiler adds code to map and standardize signs first.",
        tip: "Set NUMPROC(PFD) in production compile procedures to maximize CPU efficiency, provided your application sanitizes input variables.",
        quizOptions: [
            "NUMPROC sets the JCL CPU time limit.",
            "NUMPROC(PFD) assumes valid decimal signs and skips checking code for maximum speed; NUMPROC(NOPFD) generates extra checking code to handle non-preferred signs.",
            "NUMPROC is a DB2 database configuration.",
            "NUMPROC(PFD) increases memory allocation sizes."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_17",
        category: "COBOL",
        level: "Expert",
        question: "What are COBOL Intrinsic Functions and how do they benefit formatting?",
        answer: "COBOL Intrinsic Functions are built-in libraries that provide common calculations, string formatting, and date-time conversions without writing custom routines:\n\n* **FUNCTION NUMVAL-C**: Converts a string containing currency formats (e.g. '$1,200.50') into a numeric field, facilitating accounting updates.\n* **FUNCTION CURRENT-DATE**: Returns the current date, time, and timezone offset in a standard format (YYYYMMDDHHMMSSXX).\n* **FUNCTION UPPER-CASE**: Converts character strings to uppercase.",
        code: "01  WS-CURR-STR  PIC X(10) VALUE '$1,200.50'.\n01  WS-CURR-NUM  PIC 9(6)V92.\n\nCOMPUTE WS-CURR-NUM = FUNCTION NUMVAL-C(WS-CURR-STR).",
        tip: "Use Intrinsic Functions instead of writing custom parser logic to keep source code clean and exploit compiler-optimized libraries.",
        quizOptions: [
            "Intrinsic functions are CICS database commands.",
            "They are built-in functions (e.g., NUMVAL-C, CURRENT-DATE) that automate formatting, calculations, and conversions without manual parser logic.",
            "Intrinsic functions cannot run in dynamic calls.",
            "They are JCL syntax rules."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_18",
        category: "COBOL",
        level: "Expert",
        question: "How does native XML and JSON processing work in IBM Enterprise COBOL?",
        answer: "Modern IBM COBOL compilers provide native statements to parse and generate structured text formats directly:\n\n* **XML PARSE**: Parses XML documents inline. The statement calls an event-driven processing procedure (similar to SAX parsing), populating special registers like XML-TEXT or XML-EVENT for each parsed element.\n* **JSON GENERATE**: Converts COBOL group structures into JSON string buffers automatically. It handles hierarchies, numeric formatting, and variable lists.",
        code: "JSON GENERATE WS-JSON-BUFFER FROM WS-EMPLOYEE-RECORD\n    ON EXCEPTION\n        DISPLAY 'JSON GENERATION FAILED'\nEND-JSON-GENERATE.",
        tip: "Always ensure the destination buffer for JSON GENERATE is large enough, otherwise a truncation exception occurs.",
        quizOptions: [
            "By writing assembler subroutines.",
            "Enterprise COBOL provides XML PARSE (SAX-like event parsing) and JSON GENERATE/PARSING statements to process structured inputs natively in COBOL.",
            "JSON processing is only supported in DB2 queries.",
            "Mainframes do not support XML or JSON formats."
        ],
        quizAnswerIndex: 1
    },

    // ==================== JCL QUESTIONS ====================
    {
        id: "jcl_01",
        category: "JCL",
        level: "Beginner",
        question: "What are the three main statements in a JCL job and what are their roles?",
        answer: "Every JCL script contains three fundamental building blocks:\n\n1. **JOB Statement**: Marks the start of a job, specifies the job name, accounting credentials, class, message level, priority, and resource requirements.\n2. **EXEC Statement**: Defines the execution step. It specifies the program (`PGM=`) or procedure (`PROC=`) to run.\n3. **DD (Data Definition) Statement**: Declares the inputs, outputs, and parameters of datasets, directories, or terminal spoolers needed by the program in that step.",
        code: "//MYJOB01  JOB (ACCT123),'SALARY RUN',CLASS=A,MSGCLASS=X\n//STEP01   EXEC PGM=SALPROG\n//INPUTDD  DD DSN=PROD.SAL.INPUT,DISP=SHR\n//OUTPUTDD DD DSN=PROD.SAL.OUTPUT,DISP=(NEW,CATLG,DELETE),\n//            SPACE=(TRK,(10,5)),UNIT=SYSDA",
        tip: "Make sure you start JCL statements with two forward slashes (//) in columns 1 and 2, otherwise the operating system will fail the job with a syntax abend.",
        quizOptions: [
            "SELECT, FROM, WHERE",
            "JOB, EXEC, DD",
            "OPEN, READ, CLOSE",
            "IDENTIFICATION, DATA, PROCEDURE"
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_02",
        category: "JCL",
        level: "Beginner",
        question: "Explain the sub-parameters of the DISP parameter.",
        answer: "The **DISP (Disposition)** parameter tells the operating system how to handle a dataset before, during, and after a step runs. It accepts three positional parameters: `DISP=(status, normal-disp, abnormal-disp)`.\n\n1. **Status**: State of the dataset at step start:\n   - `NEW`: Create the dataset.\n   - `OLD`: Exclusive access to an existing dataset.\n   - `SHR`: Shared read access to an existing dataset.\n   - `MOD`: Append records to an existing sequential file.\n2. **Normal-Disp**: What to do if the step succeeds:\n   - `CATLG` (Catalog), `KEEP`, `DELETE`, `UNCATLG`.\n3. **Abnormal-Disp**: What to do if the step abends:\n   - `DELETE`, `KEEP`, `CATLG`.",
        code: "* Create new file, catalog on success, delete on abend:\n//OUTPUTDD DD DSN=USER.TEST.DATA,DISP=(NEW,CATLG,DELETE),\n//            SPACE=(CYL,(5,1)),UNIT=SYSDA",
        tip: "If the second and third sub-parameters are omitted, JCL defaults to keeping an existing file, and deleting a newly created file if the step fails.",
        quizOptions: [
            "DISP controls dataset formats and record sizes.",
            "DISP=(status, normal-disp, abnormal-disp) controls dataset access states and cleanup actions depending on step outcome.",
            "DISP connects SQL views directly to sequential files.",
            "DISP sets execution time limits in CPU minutes."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_03",
        category: "JCL",
        level: "Beginner",
        question: "What is IEFBR14 and why is it commonly used?",
        answer: "**IEFBR14** is a built-in IBM utility program that performs no actions except returning a return code of 0 (BR 14 stands for 'Branch to register 14', returning control to the caller).\n\nIt is used to:\n1. **Allocate datasets** in advance (using `DISP=(NEW,CATLG)`) before running actual business programs.\n2. **Delete datasets** (using `DISP=(OLD,DELETE)`) to clean up old temp data files before recreating them in subsequent steps.",
        code: "//CLEANUP  EXEC PGM=IEFBR14\n//DELDD    DD DSN=USER.TEST.TEMPFILE,DISP=(MOD,DELETE,DELETE),\n//            SPACE=(TRK,0),UNIT=SYSDA",
        tip: "Specifying MOD status on a delete step is a safe pattern: if the file exists, it is deleted; if the file doesn't exist, it allocates and immediately deletes it without abending.",
        quizOptions: [
            "IEFBR14 is a debugging tool for S0C7 errors.",
            "IEFBR14 is a dummy utility program used in JCL to allocate or delete datasets via DD statements.",
            "IEFBR14 compiles COBOL applications.",
            "IEFBR14 connects DB2 tables to VSAM clusters."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_04",
        category: "JCL",
        level: "Beginner",
        question: "What is a Generation Data Group (GDG) and how is it defined?",
        answer: "A **GDG (Generation Data Group)** is a collection of chronologically related datasets that share a common base name. It acts as an automatic backup history tracker.\n\n* **Referencing Generations**:\n  - `(0)`: Current version.\n  - `(+1)`: New generation to be created in the current job.\n  - `(-1)`: Immediate prior generation.\n* **Creation**: You define a GDG base index parameter using the `IDCAMS` utility, specifying the maximum number of history generations to maintain.",
        code: "* Define GDG Base via IDCAMS:\n//DEFGDG   EXEC PGM=IDCAMS\n//SYSPRINT DD SYSOUT=*\n//SYSIN    DD *\n  DEFINE GDG (NAME(PROD.EMP.BACKUP) LIMIT(30) NOEMPTY SCRATCH)\n/*",
        tip: "Specify SCRATCH during definition to automatically delete older generation datasets from the system disk when the limit (e.g. 30) is exceeded, preventing disk overflows.",
        quizOptions: [
            "A GDG is a SQL join template used in DB2.",
            "A GDG is a collection of chronologically related datasets tracked by relative generation numbers (e.g. +1, 0, -1).",
            "A GDG is a method to partition memory buffers.",
            "A GDG is a debugging layout for COBOL structures."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_05",
        category: "JCL",
        level: "Intermediate",
        question: "How do you override DD statements inside a PROC (Procedure)?",
        answer: "A **PROC** is a reusable JCL template. When calling a PROC, you can override its internal DD statements to use different files. \n\n**Syntax**: Specify the override DD statement in the calling step using the format `//procstepname.ddname DD ...`.\n\n* **Override Rules**:\n  - The overriding statement must come *after* the EXEC statement calling the PROC.\n  - Overrides must match the step order inside the PROC.",
        code: "* PROC Definition (MYPROC):\n//STEP1 EXEC PGM=PROG1\n//INFILE DD DSN=TEST.INPUT,DISP=SHR\n\n* Calling JCL with override:\n//RUNPROC EXEC MYPROC\n//STEP1.INFILE DD DSN=PROD.REAL.INPUT,DISP=SHR",
        tip: "Make sure you spell the step name inside the PROC correctly. If you get it wrong, the system will treat it as an extra DD statement instead of an override.",
        quizOptions: [
            "By writing dynamic COBOL instructions.",
            "By specifying the overrides directly after the EXEC statement using the '//procstepname.ddname DD ...' syntax.",
            "By modifying the CICS PPT table.",
            "PROC DD statements cannot be overridden."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_06",
        category: "JCL",
        level: "Intermediate",
        question: "Explain the difference between JOBLIB and STEPLIB statements.",
        answer: "Both statements define directories (PDS/PDSE load libraries) where the system should look for executable modules (`PGM=`) before searching standard system libraries. Their scope differs:\n\n* **JOBLIB**: Placed immediately after the JOB card, before any EXEC step. It applies to **all steps** within that job. If a module is found, it is executed; if not, the system searches the steps' STEPLIB or system library.\n* **STEPLIB**: Placed inside a specific EXEC step. It applies **only to that step**. It overrides a JOBLIB statement if both exist.",
        code: "//MYJOB    JOB (ACCT),'RUN',CLASS=A\n//JOBLIB   DD DSN=PROD.LOADLIB,DISP=SHR\n\n//STEP1    EXEC PGM=PROG1  * Searches PROD.LOADLIB\n\n//STEP2    EXEC PGM=PROG2  \n//STEPLIB  DD DSN=TEST.LOADLIB,DISP=SHR * Searches TEST.LOADLIB first",
        tip: "Avoid using JOBLIB in production systems containing many steps. It forces the system to search the same library for every step, which can slow down execution if most steps run standard utilities.",
        quizOptions: [
            "JOBLIB is for tape files; STEPLIB is for disks.",
            "JOBLIB applies to the entire job; STEPLIB applies only to the individual job step where it is declared.",
            "JOBLIB defines database connections; STEPLIB defines environment variables.",
            "STEPLIB runs only on CICS transactions."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_07",
        category: "JCL",
        level: "Intermediate",
        question: "What are symbolic parameters in JCL and how are they overridden?",
        answer: "**Symbolic parameters** are variables in JCL procedures. They begin with a single ampersand (`&`) in the PROC definition. They act as placeholders for dataset names, space values, or program names.\n\n* **Defining**: You specify a default value using the `PROC` statement keyword options.\n* **Overriding**: You override symbolic parameters by passing values on the `EXEC` statement that calls the PROC.",
        code: "* PROC Definition:\n//PAYPROC  PROC DSNIN='TEST.INPUT'\n//STEP1    EXEC PGM=PAYROLL\n//INPUT    DD DSN=&DSNIN,DISP=SHR\n\n* Calling JCL:\n//STEP01   EXEC PAYPROC,DSNIN='PROD.PAY.DATA'",
        tip: "Do not include the ampersand (&) when overriding a parameter on the EXEC statement (e.g. pass DSNIN='...', not &DSNIN='...').",
        quizOptions: [
            "Symbolics are accessed only by SQL statements.",
            "Symbolics are JCL variables (e.g., &DSNIN) defined in PROCs that can be overridden in the calling EXEC statement by passing parameters without the ampersand.",
            "Symbolics are indicators for negative numbers in COBOL.",
            "Symbolics are stored inside the CICS PPT."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_08",
        category: "JCL",
        level: "Intermediate",
        question: "How do you control step execution in JCL using COND parameters or IF-THEN-ELSE statements?",
        answer: "By default, steps run sequentially. If a step fails, the entire job terminates. You can bypass steps depending on previous step return codes (RC) using:\n\n* **COND Parameter**: Legacy method. Written as: `COND=(code, operator, stepname)`. If the condition evaluates to **TRUE**, the current step is **BYPASSED** (skipped).\n* **IF-THEN-ELSE**: Modern structure. Executes steps enclosed within block statements depending on logical conditions (e.g., `IF RC = 0 THEN...`).",
        code: "* COND parameter: Skip step if STEP1 return code was greater than 4\n//STEP2    EXEC PGM=REPORT,COND=(4,LT,STEP1)\n\n* IF-THEN-ELSE structure:\n//IFRC     IF (STEP1.RC = 0) THEN\n//STEP2    EXEC PGM=REPORT\n//         ENDIF",
        tip: "Use the modern IF-THEN-ELSE structure. Its logic is intuitive (run if true), unlike the COND parameter which can be confusing because it skips the step if the condition evaluates to true.",
        quizOptions: [
            "COND is for database conditions; IF-THEN-ELSE is for files.",
            "COND executes a step if the condition is true; IF-THEN-ELSE skips it.",
            "COND skips the step if the condition evaluates to TRUE; IF-THEN-ELSE behaves like standard programming logic (executes when true).",
            "There is no way to skip steps in JCL."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "jcl_09",
        category: "JCL",
        level: "Expert",
        question: "What is referback syntax (*.stepname.ddname) in JCL and when is it used?",
        answer: "**Referback** allows you to copy dataset parameters (like dataset name, space parameters, or volume serials) from a previous step in the same job, instead of writing them out again.\n\n* **Syntax**:\n  - `DSN=*.stepname.ddname` (copies dataset name)\n  - `VOL=REF=*.stepname.ddname` (copies volume settings)\n* **Use Case**: Best for temporary files generated in an early step and processed in a later step. This prevents typos and maintains clean code.",
        code: "//STEP1   EXEC PGM=CREATE\n//TEMPDS  DD DSN=&&TESTFILE,DISP=(NEW,PASS),SPACE=(TRK,5)\n\n//STEP2   EXEC PGM=PROCESS\n//INPUT   DD DSN=*.STEP1.TEMPDS,DISP=(OLD,DELETE)",
        tip: "Temp datasets in JCL are prefixed with two ampersands (&&). Combining temp datasets with referbacks ensures that temporary files are deleted upon job completion, saving disk space.",
        quizOptions: [
            "Referback refers to the COBOL division names.",
            "Referback is a method to query SQL rows from DB2.",
            "Referback is a JCL syntax (*.stepname.ddname) used to copy parameters (like dataset names or volumes) from a previously executed step.",
            "Referback is used to rollback transactions in CICS."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "jcl_10",
        category: "JCL",
        level: "Expert",
        question: "Compare the IEBGENER and IEBCOPY utilities.",
        answer: "Both are standard IBM data management utilities, but they operate on different dataset types:\n\n* **IEBGENER**: A sequential data copy utility. It is used to copy a sequential file to another sequential file, print contents (to SYSOUT), or load inline data into a dataset.\n* **IEBCOPY**: A partitioned dataset copy utility. It is used to copy members between Partitioned Datasets (PDS/PDSE), merge library modules, compress a PDS to reclaim deleted space, or backup a PDS to a sequential dataset.",
        code: "* IEBCOPY compressing a library:\n//COMPRESS EXEC PGM=IEBCOPY\n//SYSUT1   DD DSN=USER.MY.PDS,DISP=OLD\n//SYSUT2   DD DSN=USER.MY.PDS,DISP=OLD\n//SYSIN    DD *\n  COPY OUTDD=SYSUT2,INDD=SYSUT1\n/*",
        tip: "Using IEBGENER to copy a PDS will crash the step. You must use IEBCOPY for library operations.",
        quizOptions: [
            "IEBGENER runs only under CICS.",
            "IEBGENER is used to copy sequential datasets; IEBCOPY is used to copy, merge, and compress Partitioned Datasets (PDS/PDSE).",
            "IEBCOPY generates index structures; IEBGENER builds VSAM clusters.",
            "They are identical and can be used interchangeably."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_11",
        category: "JCL",
        level: "Expert",
        question: "What is the purpose of the IEFUSI exit and the REGION parameter?",
        answer: "The **REGION** parameter controls the maximum amount of virtual storage (memory) allocated to a job step (e.g. `REGION=4M` or `REGION=0M` to request all available address space).\n\n**IEFUSI** is a system exit routine installed by system administrators. It monitors user storage requests, overrides the REGION parameter if it exceeds installation limits, and prevents jobs from monopolizing mainframe system memory.",
        code: "//STEP01 EXEC PGM=BIGPROG,REGION=64M\n* If 64M exceeds limits, IEFUSI exit can restrict it to a safer limit.",
        tip: "Specifying REGION=0M gives the step unlimited virtual memory. Avoid using this in production jobs unless absolutely necessary, as it can hide memory leaks.",
        quizOptions: [
            "They configure network routing inside the mainframe.",
            "REGION specifies memory allocation, and IEFUSI is a system exit that restricts or overrides this request based on system configuration.",
            "They are used to handle DB2 transactions.",
            "REGION sets the CPU time limit in seconds."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_12",
        category: "JCL",
        level: "Expert",
        question: "Explain DFSORT/SYNCSORT control statements for Sorting and Filtering.",
        answer: "Mainframes handle massive data sorting using utilities like **DFSORT** or **SYNCSORT**. You control their behavior using control cards in the `SYSIN` DD statement:\n\n* **SORT FIELDS**: Defines keys to sort on. Syntax: `SORT FIELDS=(start, length, format, order)` where order is `A` (Ascending) or `D` (Descending).\n* **INCLUDE/OMIT**: Filters records. Syntax: `INCLUDE COND=(start, length, format, operator, constant)`.",
        code: "//SORTSTEP EXEC PGM=SORT\n//SORTIN   DD DSN=PROD.UNSORTED.DATA,DISP=SHR\n//SORTOUT  DD DSN=PROD.SORTED.DATA,DISP=(NEW,CATLG,DELETE),\n//            SPACE=(CYL,(5,2)),UNIT=SYSDA\n//SYSIN    DD *\n  SORT FIELDS=(1,10,CH,A)  * Sort by characters in col 1-10 ascending\n  INCLUDE COND=(20,2,CH,EQ,C'NY') * Only include New York records\n/*",
        tip: "You can use the SUM FIELDS=NONE statement to deduplicate records during a sort step. If duplicate sort keys are found, only the first record is kept.",
        quizOptions: [
            "They are used to write dynamic loops in JCL.",
            "They define database relations in DB2.",
            "They are control cards passed to sorting utilities to sort files by key ranges (SORT FIELDS) and filter rows (INCLUDE/OMIT COND).",
            "They configure files for CICS maps."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "jcl_13",
        category: "JCL",
        level: "Expert",
        question: "What are the rules for continuing parameters and strings in a JCL statement?",
        answer: "JCL maintains a strict 80-column structure inherited from punched cards. To continue a statement on a new line:\n\n1. **Interrupt** the statement after a comma (or complete parameter) on or before column 72.\n2. **Start** the next line with two slashes ('//') in columns 1 and 2.\n3. **Continue** the parameter starting exactly in column 4 up to column 16. Do not start past column 16, as that represents the JCL comment field, causing compilation errors.",
        code: "//STEP01   EXEC PGM=MYPROG,\n//             PARM='VAL1,VAL2'  * Starts inside columns 4-16",
        tip: "If JCL fails with a syntax error, inspect column 72 in your editor to verify no parameters accidentally overflowed beyond column 71.",
        quizOptions: [
            "Statements can be written anywhere on the line.",
            "Interrupt the line after a comma, start the next line with //, and continue the parameters in columns 4 to 16.",
            "By writing an ampersand (&) in column 80.",
            "JCL statements cannot be continued across multiple lines."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_14",
        category: "JCL",
        level: "Expert",
        question: "Explain GDG Generation Roll-In mechanism and catalog failures.",
        answer: "When a JCL job allocates a new relative generation of a Generation Data Group (e.g. 'DSN=PROD.EMP.BACKUP(+1)'), it is cataloged in a deferred status. It is only officially 'rolled-in' (becoming generation 0) upon **successful completion of the job step**.\n\nIf the step abends before termination, the system leaves the generation in a **non-rolled-in** (active but uncommitted) state. If you restart the job from the failed step, trying to allocate '(+1)' again will fail with a duplicate catalog error because the dataset name already physically exists in the catalog.",
        code: "* Job restarts often require cleaning up (+1) datasets created in failed steps first.",
        tip: "Use IEFBR14 in a recovery step to delete physical datasets named e.g., 'PROD.EMP.BACKUP.G0001V00' before restarting the (+1) step.",
        quizOptions: [
            "Roll-in happens at the start of the job card.",
            "New generations are rolled-in (becoming 0) when the job step completes successfully. If the step abends, the generation remains uncommitted, causing catalog errors on restarts.",
            "Generations are rolled-in only by CICS regions.",
            "Roll-in deletes all older generations instantly."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_15",
        category: "JCL",
        level: "Expert",
        question: "Compare COND=EVEN and COND=ONLY in JCL step execution.",
        answer: "These conditional execution parameters control whether a step runs after an abend:\n\n* **COND=EVEN**: Specifies that this step should run **even if** a previous step in the job abended. If no steps abended, it still executes normally.\n* **COND=ONLY**: Specifies that this step should run **only if** a previous step in the job abended. If all previous steps succeeded, this step is bypassed.",
        code: "* Runs only if an abend occurred:\n//STEPWARN EXEC PGM=WARNPGM,COND=ONLY\n\n* Runs regardless of abends:\n//CLEANUP  EXEC PGM=CLEANUP,COND=EVEN",
        tip: "Use COND=EVEN for cleanup steps (like releasing dataset locks) and COND=ONLY for alert steps (like sending notification messages upon batch failure).",
        quizOptions: [
            "COND=EVEN only runs on even days; COND=ONLY runs on odd days.",
            "COND=EVEN runs regardless of whether prior steps abended; COND=ONLY runs only if a prior step abended (otherwise bypassed).",
            "COND=ONLY limits execution to one processor thread.",
            "They are database access lock controls."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_16",
        category: "JCL",
        level: "Expert",
        question: "Explain the utility IKJEFT01 (TSO Runner) and its variations.",
        answer: "**IKJEFT01** is the TSO Terminal Session simulator. Since DB2 applications require a TSO environment to establish connection threads (via the DSN command), batch JCL runs COBOL-DB2 programs through IKJEFT01 instead of calling the program directly. Input commands are passed in the 'SYSTSIN' DD card.\n\n* **Variations**:\n  - 'IKJEFT01': Standard. If a command abends, it terminates processing.\n  - 'IKJEFT1A': If a command abends, it attempts to recover and execute subsequent commands in SYSTSIN.\n  - 'IKJEFT1B': Returns the actual abend code of the program to the JCL return code, simplifying error tracking.",
        code: "//RUNCOBDB  EXEC PGM=IKJEFT01\n//SYSTSIN   DD *\n  DSN SYSTEM(DB2P)\n  RUN PROGRAM(ACCTPROG) PLAN(ACCTPLAN)\n  END\n/*",
        tip: "Use IKJEFT1B in production environments to ensure that application program crashes propagate as JCL step failures instead of returning code 0.",
        quizOptions: [
            "IKJEFT01 is a VSAM file compression tool.",
            "IKJEFT01 is the TSO Terminal Session runner used to execute DB2 applications in batch by wrapping commands inside SYSTSIN.",
            "IKJEFT01 compiles CICS screens.",
            "IKJEFT01 runs only on IBM tape modules."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_17",
        category: "JCL",
        level: "Expert",
        question: "Explain JCL PARM buffer size limitations and workarounds.",
        answer: "The **PARM** parameter on the 'EXEC' statement passes runtime parameters to a program. It is strictly limited to a maximum of **100 characters**.\n\n**Workarounds**:\n1. Read configurations from a control dataset (e.g. '//SYSIN DD DSN=...' or '//CONFIG DD *') inside the program instead of passing them via PARM.\n2. Group parameters into a temporary JCL variable if they refer to dataset names, though this still counts toward the 100-character compile card limit.",
        code: "* Hard 100-character limit:\n//STEP1 EXEC PGM=PROG,PARM='PARAM1,PARAM2,...(MAX 100 CHARS)'",
        tip: "If passing multiple parameters to Java or C utilities in batch, use environment variable files (via STDENV DD cards) to bypass this limit.",
        quizOptions: [
            "PARM is limited to 8 characters.",
            "PARM limits inputs to 100 characters; bypass this by reading parameters from a control dataset (like SYSIN) inside the program.",
            "PARM allows infinite characters if using tape drives.",
            "There is no character limit for JCL PARM."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_18",
        category: "JCL",
        level: "Expert",
        question: "Compare JCL dataset disposition parameters (NEW, PASS) vs (NEW, DELETE).",
        answer: "These parameters control temporary file lifetimes across steps within a job:\n\n* **(NEW, PASS)**: Allocates a new dataset and retains it in a temporary status. The file remains cataloged on a temporary volume so that subsequent steps in the same job can read it. It is deleted automatically when the job ends.\n* **(NEW, DELETE)**: Allocates a new dataset for this step only, and deletes it immediately when this step terminates. Other steps cannot access it.",
        code: "* Step 1: Create and pass temporary file:\n//STEP1 EXEC PGM=PROG1\n//TEMP1 DD DSN=&&TEMPFILE,DISP=(NEW,PASS),SPACE=(TRK,5)\n\n* Step 2: Read and delete temporary file:\n//STEP2 EXEC PGM=PROG2\n//IN1   DD DSN=&&TEMPFILE,DISP=(OLD,DELETE)",
        tip: "Always use PASS for temporary intermediate files to prevent disk fragmentation, and use DELETE in the final processing step to release space.",
        quizOptions: [
            "PASS allocates tape drives only.",
            "PASS retains a temporary file for subsequent steps to use within the same job (deleted at job end); DELETE deletes the file immediately when the current step completes.",
            "DELETE is only for database tables.",
            "They are completely identical parameters."
        ],
        quizAnswerIndex: 1
    },

    // ==================== VSAM QUESTIONS ====================
    {
        id: "vsam_01",
        category: "VSAM",
        level: "Beginner",
        question: "What is VSAM and what are its four main dataset organizations?",
        answer: "**VSAM (Virtual Storage Access Method)** is an IBM storage access method designed for high-speed file operations on mainframes. It supports four dataset formats:\n\n1. **KSDS (Key Sequenced Dataset)**: Most common. Records are stored and accessed using a unique primary key field (e.g. employee ID). Uses an index to look up records.\n2. **ESDS (Entry Sequenced Dataset)**: Sequential file. Records are stored in the order they are inserted. Accessed using a Relative Byte Address (RBA).\n3. **RRDS (Relative Record Dataset)**: Fixed-length record file. Accessed using a Relative Record Number (RRN) index (similar to an array).\n4. **LDS (Linear Dataset)**: Unformatted byte stream, used for paging systems and database storage (like DB2 tablespaces).",
        code: "* KSDS Cluster: Data Component + Index Component\n* ESDS Cluster: Data Component only\n* RRDS Cluster: Data Component only\n* LDS Cluster: Data Component only",
        tip: "Make sure you understand KSDS thoroughly. Its combination of an index component and a data component makes it the standard choice for transactional database operations.",
        quizOptions: [
            "VSAM is a SQL query processor.",
            "VSAM is a storage method with four dataset types: KSDS (key-indexed), ESDS (entry sequence), RRDS (record number indexed), and LDS (unformatted byte stream).",
            "VSAM is a method to compile programs in batch.",
            "VSAM is a terminal management monitor."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_02",
        category: "VSAM",
        level: "Beginner",
        question: "What is a Control Interval (CI) and a Control Area (CA)?",
        answer: "VSAM does not use traditional physical blocks. It organizes data into logical structures:\n\n* **Control Interval (CI)**: The basic unit of data transfer between memory and disk storage. It contains data records, free space, and control information (RDFs and CIDFs). CI sizes typically range from 512 bytes to 4KB.\n* **Control Area (CA)**: A grouping of multiple Control Intervals. It is the basic unit of space allocation on disk. When a VSAM cluster is defined, it allocates disk space in Control Areas.",
        code: "Control Area (CA)\n+-----------------------------------------------+\n| Control Interval (CI 1)  [Data...] [Free] [CI]|\n| Control Interval (CI 2)  [Data...] [Free] [CI]|\n| Control Interval (CI 3)  [Data...] [Free] [CI]|\n+-----------------------------------------------+",
        tip: "Choose larger CI sizes (e.g., 4KB or 8KB) for sequential processing to speed up transfers, and smaller sizes (e.g., 1KB) for random reads to reduce memory overhead.",
        quizOptions: [
            "CI is an index page; CA is a database table.",
            "CI is the basic unit of I/O transfer containing records and control data; CA is a group of CIs that manages disk space allocation.",
            "CI is for COBOL variables; CA is for JCL steps.",
            "CI and CA are legacy parameters that are no longer used."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_03",
        category: "VSAM",
        level: "Beginner",
        question: "What is IDCAMS? List three common commands.",
        answer: "**IDCAMS** (also called Access Method Services) is the utility program used to define, modify, print, copy, and delete VSAM datasets.\n\n* **Common Commands**:\n  - `DEFINE CLUSTER`: Creates and configures a VSAM dataset.\n  - `REPRO`: Copies records (e.g., loads data from a sequential file into a VSAM cluster, or backs up a VSAM file).\n  - `PRINT`: Prints dataset records in hex, character, or dump format.\n  - `DELETE`: Deletes a VSAM cluster from the system catalog.",
        code: "//DEFVSAM  EXEC PGM=IDCAMS\n//SYSPRINT DD SYSOUT=*\n//SYSIN    DD *\n  DEFINE CLUSTER (NAME(USER.TEST.KSDS) -\n                  INDEXED KEYS(6 0) -\n                  RECORDSIZE(80 80) -\n                  CYLINDERS(2 1))\n/*",
        tip: "Always check the SYSPRINT output after running IDCAMS to verify the parameters were accepted and that there are no catalog mapping conflicts.",
        quizOptions: [
            "IDCAMS is a COBOL compiler optimizer.",
            "IDCAMS is a CICS terminal emulator.",
            "IDCAMS is the Access Method Services utility used to define, copy, print, and delete VSAM clusters.",
            "IDCAMS is a DB2 database administration tool."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "vsam_04",
        category: "VSAM",
        level: "Beginner",
        question: "Explain the difference between KSDS and ESDS clusters.",
        answer: "The access methods and storage organizations differ significantly:\n\n* **KSDS (Key Sequenced)**: Includes both a **Data Component** and an **Index Component**. Records are ordered by their primary key. Supports random, sequential, and dynamic access. You can update or delete records directly.\n* **ESDS (Entry Sequenced)**: Contains only a **Data Component**. Records are appended to the end of the file. Access is sequential or via Relative Byte Address (RBA). You cannot delete records; you must flag them as inactive.",
        code: "* KSDS:\nREAD FILE-KSDS KEY IS EMP-KEY.\n\n* ESDS:\nREAD FILE-ESDS NEXT. (Reads chronologically)",
        tip: "Use KSDS for business master files (like customer records) where direct updates are common. Use ESDS for logging or audit trails where write speed is key.",
        quizOptions: [
            "KSDS is for alphanumeric data; ESDS is for numbers.",
            "KSDS uses key-based index lookup and allows deletes/updates; ESDS appends sequentially, lacks a primary key index, and does not allow record deletions.",
            "KSDS is stored in memory; ESDS is stored on tape.",
            "KSDS is defined via DB2; ESDS is defined via JCL."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_05",
        category: "VSAM",
        level: "Intermediate",
        question: "What are CI and CA splits? How do they occur and what is their impact?",
        answer: "Splits occur in KSDS clusters when a program inserts new records or increases record lengths:\n\n* **Control Interval (CI) Split**: Occurs when a new record is inserted into a CI that doesn't have enough free space. VSAM allocates a new empty CI in the same Control Area (CA), moves about half the records from the full CI to the new one, and inserts the new record. Minimal performance impact.\n* **Control Area (CA) Split**: Occurs when a CI split is needed, but all CIs within the current CA are already full. VSAM allocates a new CA at the end of the file, moves half the CIs from the full CA to the new CA, and updates the index. This is a heavy disk operation that can slow down performance.",
        code: "Before split: CI 1 [Rec1, Rec2, Rec3 (Full)]\nAfter CI split: CI 1 [Rec1, Rec2] ---> CI 2 [Rec3 (New Rec)]",
        tip: "Monitor splits using IDCAMS LISTCAT. If splits are high, redefine the cluster with a larger FREESPACE percentage (e.g. FSPC(15 15)).",
        quizOptions: [
            "Splits are methods to partition SQL tables.",
            "Splits occur when records are deleted from a VSAM file.",
            "Splits occur in a KSDS when an insert lacks free space. CI splits move records to a new CI in the same CA; CA splits move CIs to a new CA when the current CA is full, slowing down performance.",
            "Splits are memory management tools in CICS."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "vsam_06",
        category: "VSAM",
        level: "Intermediate",
        question: "What is an Alternate Index (AIX) in VSAM and how is it defined?",
        answer: "An **Alternate Index (AIX)** allows you to access records in a KSDS or ESDS using a key other than the primary key (e.g., searching for employees by Department ID instead of Employee ID). An AIX key can contain duplicate values.\n\n**Definition Steps**:\n1. `DEFINE AIX`: Defines the AIX cluster, mapping the alternate key offset within the base cluster.\n2. `DEFINE PATH`: Creates a logical link connecting the alternate index to the base cluster.\n3. `BLDINDEX`: Populates the alternate index using base cluster data.",
        code: "* 1. Define AIX:\n  DEFINE AIX (NAME(USER.EMP.AIX) RELATE(USER.EMP.BASE) KEYS(4 20))\n* 2. Define Path:\n  DEFINE PATH (NAME(USER.EMP.PATH) PATHENTRY(USER.EMP.AIX))\n* 3. Build Index:\n  BLDINDEX INDATASET(USER.EMP.BASE) OUTDATASET(USER.EMP.AIX)",
        tip: "Set UPGRADE in the AIX definition so the alternate index updates automatically whenever records are modified in the base cluster.",
        quizOptions: [
            "An AIX is a Unix operating system partition inside the mainframe.",
            "An AIX is a secondary index built over a KSDS/ESDS using DEFINE AIX, DEFINE PATH, and BLDINDEX commands, allowing queries on non-primary keys.",
            "An AIX is an index type that only supports sequential reads.",
            "An AIX is defined using JCL DD cards directly."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_07",
        category: "VSAM",
        level: "Intermediate",
        question: "What is the purpose of the REPRO command in IDCAMS?",
        answer: "The **REPRO** command copies data. It is a highly efficient utility used to:\n\n1. **Load data**: Import records from a sequential dataset into a newly defined VSAM KSDS/ESDS cluster.\n2. **Backup**: Export records from a VSAM cluster into a sequential file for archival.\n3. **Merge/Replace**: Append or replace records from one VSAM dataset to another.\n4. **Reorganization**: Copy a fragmented KSDS (with many splits) to a sequential file, delete/redefine the KSDS, and copy the data back to rebuild indexes and clean up splits.",
        code: "* Backup KSDS to Sequential file:\n//BACKUP   EXEC PGM=IDCAMS\n//SYSIN    DD *\n  REPRO INDATASET(USER.PROD.KSDS) -\n        OUTDATASET(USER.BACKUP.SEQ)\n/*",
        tip: "When reloading a KSDS using REPRO, ensure the target KSDS is empty. If it contains records, REPRO will fail with duplicate key errors unless the REPLACE parameter is specified.",
        quizOptions: [
            "REPRO compiles source code components.",
            "REPRO is an IDCAMS command used to copy data to/from VSAM clusters, perform backups, and reorganize files.",
            "REPRO is a database migration agent for DB2.",
            "REPRO is used to configure CICS transaction queues."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_08",
        category: "VSAM",
        level: "Intermediate",
        question: "What do VSAM status keys '23' and '97' indicate?",
        answer: "These are return status codes returned by the operating system after a file operation:\n\n* **Status Key 23**: Record Key Not Found. Occurs during a `READ` on a KSDS or relative file when the requested key doesn't exist, or during a `WRITE` when trying to insert a record into an index position that is already occupied.\n* **Status Key 97**: Implicit Open Recovery. Indicates that the file was opened successfully, but the system detected that the file was not closed properly in a previous job. VSAM automatically runs a check and repair operation to make the file accessible.",
        code: "* COBOL handling for status 23:\nREAD EMP-FILE\n    INVALID KEY \n        DISPLAY \"EMPLOYEE RECORD NOT FOUND (STATUS 23)\"\nEND-READ.",
        tip: "A status 97 is not a failure. It means the file is open and ready to use, but you should check the prior job logs to investigate why the file was not closed cleanly.",
        quizOptions: [
            "Status 23 means file missing; 97 means disk full.",
            "Status 23 indicates a record key was not found or is duplicate; 97 indicates a successful open after the file was not closed cleanly in a prior run.",
            "Status 23 indicates CICS transaction abend; 97 is a security error.",
            "They are success codes for tape reads."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_09",
        category: "VSAM",
        level: "Expert",
        question: "How do you optimize VSAM performance using BUFND and BUFNI parameters?",
        answer: "VSAM transfers data using buffers in memory. You can optimize performance by adjusting buffer parameters in the JCL or program control blocks:\n\n* **BUFND (Buffer Number Data)**: Specifies the number of data buffers. For **sequential processing**, increase BUFND (e.g. `BUFND=10` or more) to enable read-ahead buffering.\n* **BUFNI (Buffer Number Index)**: Specifies the number of index buffers. For **random access**, increase BUFNI (e.g. `BUFNI=5` or more) to keep the index structure in memory and reduce disk lookups.",
        code: "* JCL DD override to optimize buffers:\n//VSAMDD   DD DSN=USER.PROD.KSDS,DISP=SHR,\n//            AMP=('BUFND=12','BUFNI=6')",
        tip: "Use the AMP parameter on the JCL DD statement to tune buffers without recompiling the COBOL code.",
        quizOptions: [
            "BUFND and BUFNI are DB2 indexing parameters.",
            "BUFND specifies data buffers (best for sequential processing); BUFNI specifies index buffers (best for random access), reducing physical I/O.",
            "They configure network packet sizes in CICS.",
            "They limit the size of file deletions."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_10",
        category: "VSAM",
        level: "Expert",
        question: "What is a Linear Dataset (LDS) and how does it differ from other VSAM files?",
        answer: "A **Linear Dataset (LDS)** is a VSAM file format that contains only unstructured data. It does not use record control fields (RDFs or CIDFs) and organizes data into a continuous byte stream structured in 4096-byte blocks.\n\n* **Access Method**: It is accessed using the **Data-In-Virtual (DIV)** service, which maps the file directly into virtual memory pages. This allows programs to read and write bytes using memory addresses instead of traditional I/O commands.\n* **Use Case**: Used for database spaces (like DB2 tablespaces) and z/OS system paging files.",
        code: "* Define LDS using IDCAMS:\n  DEFINE CLUSTER (NAME(USER.TEST.LDS) -\n                  LINEAR -\n                  CYLINDERS(10 2))",
        tip: "Since LDS has no record structure, you cannot read it using standard sequential COBOL READ statements. Access requires Assembler DIV macros or DB2 engines.",
        quizOptions: [
            "LDS is a sequential file used only on tape drives.",
            "LDS is an unformatted byte stream structured in 4096-byte blocks, accessed via Data-In-Virtual (DIV) to map disk directly to memory.",
            "LDS is a database structure used in CICS maps.",
            "LDS requires primary keys to write data."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_11",
        category: "VSAM",
        level: "Expert",
        question: "Explain the logical components of a KSDS cluster: Data component vs Index component.",
        answer: "A KSDS is a split cluster consisting of two separate physical components:\n\n1. **Data Component**: Stores the actual data records. Records are organized into Control Intervals (CIs).\n2. **Index Component**: Stores the index keys and pointers. It is structured as a B-Tree containing:\n   - **Index Set**: Higher-level index levels that direct searches down the tree.\n   - **Sequence Set**: The lowest level of the index. Each sequence set record points directly to a Control Interval in the Data Component. VSAM uses the sequence set to perform sequential reads quickly.",
        code: "Index Component (B-Tree)\n    [Index Set] \n       |\n    [Sequence Set] ---> Points to Data Component CIs\n                           |\nData Component:      [CI 1][CI 2][CI 3] ...",
        tip: "When running IDCAMS commands (like DEFINE or DELETE), reference the base Cluster Name instead of individual Data or Index component names to keep catalog mappings clean.",
        quizOptions: [
            "The Data component is on tape; the Index component is on disk.",
            "The Data component holds records; the Index component is a B-Tree structure (Index Set and Sequence Set) that maps keys to data CIs.",
            "The Index component is a flat file containing sorted keys.",
            "They are physical disks that must be placed on separate controllers."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_12",
        category: "VSAM",
        level: "Expert",
        question: "Explain the Freespace (FSPC) parameters and how they prevent splits.",
        answer: "When defining a KSDS, the **FREESPACE(CI-%, CA-%)** parameter reserves empty space inside each Control Interval and Control Area to accommodate future record inserts and updates.\n\n* **CI-%**: Percentage of space left empty in each CI when the file is first loaded or reorganized. Prevents CI splits.\n* **CA-%**: Percentage of CIs left empty in each CA when the file is first loaded. Prevents CA splits.",
        code: "* Define with 15% CI freespace and 10% CA freespace:\n  DEFINE CLUSTER (NAME(USER.EMP.KSDS) -\n                  INDEXED -\n                  KEYS(6 0) -\n                  FREESPACE(15 10) -\n                  RECORDSIZE(80 80))",
        tip: "Set higher freespace values (e.g. 20 20) for files with frequent inserts. For read-only files, set freespace to 0 to save disk space.",
        quizOptions: [
            "Freespace deletes inactive records automatically.",
            "Freespace reserves space within CIs and CAs during initial load/reorg to accommodate future inserts and prevent splits.",
            "Freespace is a memory management tool in CICS.",
            "Freespace specifies the maximum file size in tracks."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_13",
        category: "VSAM",
        level: "Expert",
        question: "Explain the difference between LSR (Local Shared Resources) and NSR (Normal Shared Resources) buffering.",
        answer: "VSAM manages file buffering using two distinct sharing policies in address spaces (like CICS regions):\n\n* **NSR (Normal Shared Resources)**: Default policy. Each VSAM file has its own dedicated set of data and index buffers. Ideal for sequential file processing. However, it consumes a large amount of memory if many files are open.\n* **LSR (Local Shared Resources)**: Buffers are grouped into a shared pool. Multiple VSAM files share these buffers. Ideal for direct random reads (like transactional OLTP). It drastically reduces memory usage and improves cache hit ratios by keeping popular index pages in memory.",
        code: "* CICS FCT definition commonly sets LSRPOOL=1 for transactions.",
        tip: "Always configure LSR buffering for online CICS transactional files to optimize cache performance, and reserve NSR for batch sorting steps.",
        quizOptions: [
            "LSR is for tape drives; NSR is for disks.",
            "NSR allocates a dedicated buffer pool per file (best for sequential batch); LSR pools buffers across multiple files (best for random online transactions, saving memory).",
            "LSR only works on ESDS datasets.",
            "They are VSAM dataset recovery utilities."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_14",
        category: "VSAM",
        level: "Expert",
        question: "How do you tune VSAM performance using BUFND and BUFNI parameters?",
        answer: "You specify buffer allocations in JCL DD statements using **BUFND** (number of data buffers) and **BUFNI** (number of index buffers):\n\n* **Sequential Processing (e.g. Batch Reads)**: Increase **BUFND** (e.g., BUFND=10). This allows VSAM to perform multi-track read-ahead operations. Keep **BUFNI** low (e.g., BUFNI=2) since indexes are read sequentially.\n* **Random Processing (e.g. Key Lookups)**: Increase **BUFNI** (e.g., BUFNI=5). This keeps the index set and sequence set nodes in memory, avoiding disk seeks. Keep **BUFND** low (e.g., BUFND=2).",
        code: "//VSAMDD   DD DSN=PROD.EMP.KSDS,DISP=SHR,\n//            AMP=('BUFND=12','BUFNI=2')  * Optimized for batch reading",
        tip: "Specify these parameters in the AMP clause on the JCL DD statement to override default VSAM buffers without recompiling programs.",
        quizOptions: [
            "BUFND is for DB2 tables; BUFNI is for CICS screens.",
            "BUFND tunes data buffers (increase for sequential processing); BUFNI tunes index buffers (increase for random index seeks).",
            "BUFND specifies JCL CPU times.",
            "Tuning is performed automatically by WLM."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_15",
        category: "VSAM",
        level: "Expert",
        question: "Explain the role of VSAM Control Interval (CI) sizes and how to choose them.",
        answer: "The **Control Interval (CI)** is the basic block size of VSAM transfer. Choosing the correct size balances transfer speed and buffer memory overhead:\n\n* **Data Component CI Size**: Commonly **4KB** (4096 bytes). It matches physical DASD track divisions. Larger sizes (e.g. 8KB, 16KB) are great for sequential reads (reducing I/O count) but slow down random inserts. Smaller sizes (e.g. 2KB) are best for random reads but increase split risks.\n* **Index Component CI Size**: Usually **1KB or 2KB**. Must be large enough to hold all pointers for sequence set records in a Control Area, avoiding index splitting.",
        code: "* Custom configuration inside definition macro:\n  DATA (NAME(USER.DATA) CISZ(4096))\n  INDEX (NAME(USER.INDEX) CISZ(2048))",
        tip: "A CISZ that doesn't divide cleanly into physical track sizes causes gaps and wastes disk space. Stick to standard sizes like 2048, 4096, and 8192.",
        quizOptions: [
            "CI size is always fixed at 80 bytes.",
            "CI sizes determine physical sector sizes on tape.",
            "CI size balances I/O speeds; choose 4KB for data component to match hardware tracks, and 1KB or 2KB for index components to keep pointers cached.",
            "They are compiled options set in COBOL."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "vsam_16",
        category: "VSAM",
        level: "Expert",
        question: "Explain VSAM SHAREOPTIONS and how they affect read/write concurrency.",
        answer: "The **SHAREOPTIONS (cross-region, cross-system)** parameter in the IDCAMS definition controls how multiple users can access a VSAM cluster concurrently:\n\n* **SHAREOPTIONS(1,3)**: Most common. Allows one user to write, or multiple users to read. Guarantees data integrity. Safe for transactional data.\n* **SHAREOPTIONS(2,3)**: Allows one user to write, and multiple users to read simultaneously. The program must handle read synchronization.\n* **SHAREOPTIONS(3,3)**: Fully shared. Allows multiple writers and multiple readers. VSAM provides zero write lock protection. The application program must manage locking manually to prevent data corruption.",
        code: "* SHAREOPTIONS definition:\n  DEFINE CLUSTER (NAME(USER.EMP.KSDS) SHAREOPTIONS(1 3) ...)",
        tip: "Never use SHAREOPTIONS(3,3) or (4,4) unless your program implements custom locking mechanisms, otherwise you risk corrupting dataset indexes.",
        quizOptions: [
            "SHAREOPTIONS links VSAM directly to DB2 plans.",
            "SHAREOPTIONS specifies access permissions; (1,3) allows one writer OR multiple readers; (3,3) allows unrestricted concurrent writes with zero system locking (application must lock).",
            "SHAREOPTIONS restricts file access to administrators only.",
            "It controls file backup frequencies."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "vsam_17",
        category: "VSAM",
        level: "Expert",
        question: "Explain VSAM dataset compression and zEDC hardware integration.",
        answer: "VSAM supports dataset compression via **DFSMS**. It reduces physical disk usage by compressing data records using system dictionaries:\n\n* **zEDC (zEnterprise Data Compression)**: A hardware-assisted compression card. It compresses data at high speeds with minimal CPU overhead.\n* **Mechanism**: VSAM compresses data blocks before writing to disk, and decompresses them when read into memory buffers. The index component is never compressed to maintain B-tree traversal performance.",
        code: "* Allocate compressed dataset via SMS Data Class:\n//COMPDS   DD DSN=PROD.COMP.KSDS,DISP=(NEW,CATLG),DATACLAS=COMPKSDS",
        tip: "Ensure you only compress datasets with long records (e.g., > 100 bytes) to justify the CPU overhead of dictionary lookups.",
        quizOptions: [
            "Compression is managed by JCL parameters directly.",
            "Compression compresses both index and data components.",
            "DFSMS manages VSAM compression using hardware-assisted zEDC cards to compress data blocks on disk while leaving index components uncompressed to preserve fast search speeds.",
            "Compression is only supported for tape drives."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "vsam_18",
        category: "VSAM",
        level: "Expert",
        question: "How do you recover a VSAM cluster that was closed improperly?",
        answer: "If a batch step abends or a system crash occurs while a VSAM dataset is open, the dataset catalog flag remains set to 'open'. Subsequent steps attempting to open the file will fail.\n\n**Recovery Steps**:\n1. Execute the **IDCAMS VERIFY** command. This tells VSAM to read the dataset control block, compare it with the physical file, update the catalog metadata (matching record count and high-used RBA), and reset the open flag.\n2. In modern systems, this can be automated by specifying the 'VERIFY' parameter in the dataset open parameters inside the program.",
        code: "//RECOVER  EXEC PGM=IDCAMS\n//SYSIN    DD *\n  VERIFY DATASET(USER.TEST.KSDS)\n/*",
        tip: "Always run IDCAMS VERIFY before starting batch recovery steps to ensure catalog statistics match physical files.",
        quizOptions: [
            "By deleting and restoring the dataset from backup.",
            "By executing IDCAMS VERIFY, which reconciles catalog statistics with physical file markers and resets the open flag.",
            "By re-running the abended step directly.",
            "VSAM datasets cannot be recovered from improper closures."
        ],
        quizAnswerIndex: 1
    },

    // ==================== DB2 QUESTIONS ====================
    {
        id: "db2_01",
        category: "DB2",
        level: "Beginner",
        question: "What are the primary DB2 database objects and their relationship?",
        answer: "DB2 organizes data in a hierarchical structure:\n\n1. **Storage Group (STOGROUP)**: A collection of physical disks where DB2 allocates space.\n2. **Database**: A logical grouping of tablespaces and index spaces.\n3. **Tablespace**: A physical file that contains one or more tables.\n4. **Table**: The logical grid structure containing rows and columns.\n5. **View**: A virtual table derived from queries on one or more tables.\n6. **Index**: A pointer structure built over table columns to speed up searches.",
        code: "STOGROUP (Disks) -> Database -> Tablespace -> Table -> Index / View",
        tip: "Create tablespaces to align with your storage policies. For example, use partitioned tablespaces for large transaction tables to optimize backups and search performance.",
        quizOptions: [
            "PDS, PDSE, GDG, sequential datasets",
            "Storage Groups, Databases, Tablespaces, Tables, Views, and Indexes",
            "Divisions, Sections, Paragraphs, Statements",
            "Transactions, Tasks, Programs, Maps"
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_02",
        category: "DB2",
        level: "Beginner",
        question: "Explain the purpose of Host Variables and Indicator Variables.",
        answer: "These variables handle data transfer between programs and DB2 tables:\n\n* **Host Variables**: Standard COBOL variables defined in the DATA DIVISION (inside `EXEC SQL BEGIN DECLARE SECTION` blocks) used to pass data parameters into SQL statements or receive query results.\n* **Indicator Variables**: Small 2-byte integer host variables (PIC S9(4) COMP) paired with a main host variable to handle `NULL` database values. If the value retrieved from the database is NULL, DB2 sets the indicator variable to `-1`.",
        code: "DATA DIVISION.\nWORKING-STORAGE SECTION.\nEXEC SQL BEGIN DECLARE SECTION END-EXEC.\n01 DCL-EMP.\n   05 EMP-ID     PIC S9(9) COMP.\n   05 EMP-NAME   PIC X(20).\n   05 EMP-COMM   PIC S9(7)V99 COMP-3.\n01 EMP-COMM-IND  PIC S9(4) COMP.\nEXEC SQL END DECLARE SECTION END-EXEC.\n\n* Usage in SQL:\nEXEC SQL\n    SELECT EMPNAME, COMM\n    INTO :EMP-NAME, :EMP-COMM :EMP-COMM-IND\n    FROM EMP_TABLE\n    WHERE EMPID = :EMP-ID\nEND-EXEC.",
        tip: "Always use an indicator variable when querying nullable columns. If a query returns a NULL value without an indicator variable, the program will crash with an SQLCODE -305.",
        quizOptions: [
            "Host variables are for JCL; indicator variables are for CICS.",
            "Host variables pass values between the COBOL program and SQL statements; indicator variables are S9(4) COMP integers used to check for NULL values (-1).",
            "Host variables are database keys; indicator variables are loop counters.",
            "They are used to define table indices."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_03",
        category: "DB2",
        level: "Beginner",
        question: "What is SQLCA and what do SQLCODE values 0, 100, and -803 mean?",
        answer: "The **SQLCA** (SQL Communications Area) is a system structure updated by DB2 after every SQL execution. It contains diagnostic flags, warning fields, and the execution status code (`SQLCODE`).\n\n* **Common SQLCODEs**:\n  - `0`: Execution completed successfully.\n  - `+100`: Record not found, or end of cursor result set reached.\n  - `-803`: Duplicate key violation. Occurs when trying to insert a record that violates a primary key or unique index constraint.\n  - `-305`: Null value returned without an indicator variable.",
        code: "* Include SQLCA in working storage:\nEXEC SQL INCLUDE SQLCA END-EXEC.\n\n* Check SQLCODE:\nIF SQLCODE = 0\n    PERFORM PROCESS-DATA\nELSE IF SQLCODE = 100\n    DISPLAY \"RECORD NOT FOUND\"\nELSE\n    DISPLAY \"SQL ERROR: \" SQLCODE\nEND-IF.",
        tip: "Make sure you include SQLCA in every program that uses SQL to track query execution status.",
        quizOptions: [
            "SQLCA is a configuration table in CICS.",
            "SQLCA is the SQL Communications Area; SQLCODE 0 is success, +100 is row not found/EOF, and -803 is a duplicate key constraint violation.",
            "SQLCA is a utility used to load tables.",
            "SQLCODE -803 indicates the tablespace is out of space."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_04",
        category: "DB2",
        level: "Beginner",
        question: "What is a DB2 Cursor and what are its four main lifecycle steps?",
        answer: "SQL SELECT statements inside a COBOL program must return exactly one row. If a query returns multiple rows, the program will crash with an SQLCODE -811. A **Cursor** solves this by pointing to a query result set and processing records one row at a time.\n\n**Lifecycle Steps**:\n1. **DECLARE**: Defines the cursor name and its associated SELECT query.\n2. **OPEN**: Executes the query and builds the result set.\n3. **FETCH**: Retrieves the current row from the result set into host variables and advances the cursor pointer.\n4. **CLOSE**: Releases the result set and locks.",
        code: "* 1. Declare Cursor\nEXEC SQL \n    DECLARE EMP_CUR CURSOR FOR\n    SELECT EMPID, EMPNAME FROM EMP_TABLE\nEND-EXEC.\n\n* 2. Open\nEXEC SQL OPEN EMP_CUR END-EXEC.\n\n* 3. Fetch (Loop until SQLCODE = 100)\nEXEC SQL FETCH EMP_CUR INTO :EMP-ID, :EMP-NAME END-EXEC.\n\n* 4. Close\nEXEC SQL CLOSE EMP_CUR END-EXEC.",
        tip: "Always close cursors when you are done to release database locks and free up database resources.",
        quizOptions: [
            "A cursor is a mouse pointer used in mainframe terminal emulators.",
            "A cursor processes multi-row query results one row at a time using DECLARE, OPEN, FETCH, and CLOSE statements.",
            "A cursor is a database index type that speeds up writes.",
            "A cursor is used to compile JCL steps."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_05",
        category: "DB2",
        level: "Intermediate",
        question: "Explain the DB2 program compilation and binding process.",
        answer: "A COBOL program with embedded SQL statements cannot be compiled by standard compilers directly. It must go through the **DB2 preparation process**:\n\n1. **Precompilation**: The DB2 Precompiler translates embedded SQL statements (`EXEC SQL...`) into COBOL call statements, and writes the raw SQL statements into a **Database Request Module (DBRM)** file.\n2. **Compilation & Link-Edit**: The modified COBOL source code is compiled and link-edited into an executable load module.\n3. **Binding**: The DB2 BIND engine processes the DBRM file to analyze SQL syntax, check table permissions, select optimal access paths, and package them into a **Package** or **Plan** stored in the DB2 database.",
        code: "COBOL + SQL Source ---> [Precompiler] ---> Modified COBOL ---> [Compiler] ---> Load Module\n                                 |\n                                 +---> DBRM ---> [BIND ENGINE] ---> Package/Plan",
        tip: "Make sure the consistency token (timestamp) matches between the Load Module and the Bind Plan. A mismatch will result in a runtime -818 SQLCODE error.",
        quizOptions: [
            "Compilation compiles the JCL; binding runs CICS.",
            "Precompilation extracts SQL into a DBRM; the COBOL source is compiled into a load module; the BIND process translates the DBRM into a package/plan containing optimized access paths.",
            "Binding connects physical disks to tablespaces.",
            "The process runs automatically during execution step runs."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_06",
        category: "DB2",
        level: "Intermediate",
        question: "What is the difference between a DB2 Plan and a DB2 Package?",
        answer: "Both represent bound SQL statements, but they differ in scope and how they are packaged:\n\n* **DB2 Package**: A bound DBRM representing a single program module. Packages are self-contained and run within collection IDs. If a program's SQL changes, you only need to bind its individual package.\n* **DB2 Plan**: The execution block referenced by the runtime environment (like a JCL job step or CICS transaction). A Plan is a collection of one or more Packages or DBRMs. The application binds packages into a plan to make them executable.",
        code: "* Bind Package:\nBIND PACKAGE(COLL_PROD) MEMBER(EMPPROG) OWNER(DBA1) ACT(REP)\n\n* Bind Plan:\nBIND PLAN(PLAN_PROD) PKLIST(COLL_PROD.EMPPROG) OWNER(DBA1) ACT(REP)",
        tip: "Use Packages instead of directly binding DBRMs to plans. This allows you to deploy program updates without binding the entire application plan, reducing downtime.",
        quizOptions: [
            "Plans are database backups; packages are tablespaces.",
            "A Package represents bound SQL for a single program module; a Plan is the parent execution block that groups packages for application runtime execution.",
            "Plans are for batch jobs; packages are for CICS online systems.",
            "They are identical and can be used interchangeably."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_07",
        category: "DB2",
        level: "Intermediate",
        question: "What are DB2 Isolation Levels? Explain CS and RR.",
        answer: "Isolation levels control how database transactions are isolated from other concurrent transactions. They balance data consistency against system concurrency:\n\n* **Cursor Stability (CS - Default)**: Releases locks on a row as soon as the cursor moves to the next row (unless the row was modified). This maximizes system concurrency.\n* **Repeatable Read (RR)**: Holds locks on all rows accessed during a transaction until the transaction commits. Prevents other users from modifying data that has been read, but can lead to lock contention and deadlocks.",
        code: "* Define Isolation Level during BIND:\nBIND PACKAGE(COLL) MEMBER(PROG) ISOLATION(CS) * Max concurrency\nBIND PACKAGE(COLL) MEMBER(PROG) ISOLATION(RR) * Max isolation",
        tip: "Use CS (Cursor Stability) for most transactions to keep systems running smoothly, and reserve RR (Repeatable Read) for financial balancing jobs that require complete data isolation.",
        quizOptions: [
            "Isolation levels specify tablespace backup schedules.",
            "Cursor Stability (CS) releases locks as the cursor moves (high concurrency); Repeatable Read (RR) holds locks on all read rows until commit (high consistency, low concurrency).",
            "CS is for batch; RR is for online transactions.",
            "They specify which users can access DB2 tables."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_08",
        category: "DB2",
        level: "Intermediate",
        question: "Explain the RUNSTATS utility and its importance.",
        answer: "The **RUNSTATS** utility updates performance statistics in the DB2 catalog tables (such as card, npages, and highkey values) for tablespaces, tables, and indexes.\n\n* **Importance**: The DB2 Optimizer uses these catalog statistics to choose the most efficient access paths (like choosing an index scan over a full table scan) when binding DBRMs or executing dynamic SQL. If statistics are outdated, the optimizer may choose inefficient access paths, slowing down performance.",
        code: "* RUNSTATS JCL execution:\n//RUNSTAT EXEC PGM=DSNUTILB,PARM='DB2P'\n//SYSIN    DD *\n  RUNSTATS TABLESPACE DB_HR.TS_EMP TABLE(ALL) INDEX(ALL) UPDATE(ALL)\n/*",
        tip: "Run RUNSTATS after loading a new table or performing major data updates, then rebuild/rebind application packages to apply the new access paths.",
        quizOptions: [
            "RUNSTATS processes database backups.",
            "RUNSTATS updates performance statistics in catalog tables, helping the optimizer select the most efficient SQL access paths during binding.",
            "RUNSTATS is a debugging tool for S0C7 errors.",
            "RUNSTATS checks table referential integrity."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_09",
        category: "DB2",
        level: "Expert",
        question: "Explain DB2 deadlocks and timeouts (-911 and -913 SQLCODEs).",
        answer: "These codes represent lock contention issues:\n\n* **Deadlock (SQLCODE -911)**: Occurs when two or more transactions hold locks on resources and attempt to lock resources held by each other. Neither transaction can proceed. DB2 automatically selects one transaction as the 'victim', rolls back its updates, and returns a SQLCODE -911.\n* **Timeout (SQLCODE -913)**: Occurs when a transaction requests a lock held by another transaction, and wait time exceeds system limits (defined by the `IRLMRWT` parameter). DB2 cancels the request and returns SQLCODE -913.",
        code: "Transaction A holds Lock 1, requests Lock 2.\nTransaction B holds Lock 2, requests Lock 1.\n---> DEADLOCK DETECTED! Victim rolled back (SQLCODE -911).",
        tip: "To prevent deadlocks, ensure all applications update tables in the same order, keep transactions short, and commit frequently.",
        quizOptions: [
            "-911 indicates tablespace out of space; -913 is duplicate key.",
            "-911 represents a deadlock where DB2 rolls back the transaction; -913 represents a lock request timeout without an automatic rollback.",
            "-911 is a connection error; -913 is a syntax error.",
            "They are success flags for index updates."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_10",
        category: "DB2",
        level: "Expert",
        question: "What is EXPLAIN and how do you analyze its output in PLAN_TABLE?",
        answer: "The **EXPLAIN** statement writes detailed information about the access path chosen by the DB2 optimizer for a given SQL query into a user table named `PLAN_TABLE`.\n\n**Key Columns in PLAN_TABLE**:\n* **ACCESSTYPE**: How DB2 accesses rows (`I` = Index scan, `R` = Tablespace scan, `I1` = One-fetch index scan).\n* **ACCESSCREATOR/NAME**: The schema and index name used.\n* **METHOD**: Join method used (`0` = First table, `1` = Nested loop join, `2` = Merge scan join, `3` = Hash join).\n* **PREFETCH**: Prefetch buffering used (`S` = Sequential prefetch, `L` = List prefetch).",
        code: "* Generate EXPLAIN data:\nEXEC SQL\n    EXPLAIN PLAN SET QUERYNO = 101 FOR\n    SELECT EMPNAME FROM EMP_TABLE WHERE EMPID = :EMP-ID\nEND-EXEC.",
        tip: "Analyze the ACCESSTYPE column. If you see 'R' (Tablespace Scan) on a large table, you should create an index to speed up the query.",
        quizOptions: [
            "EXPLAIN is a documentation tool for COBOL procedures.",
            "EXPLAIN writes access path information chosen by the optimizer into a PLAN_TABLE, showing query execution plans (index scans vs table scans).",
            "EXPLAIN runs SQL queries and displays the results.",
            "EXPLAIN is used to recover deleted database rows."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_11",
        category: "DB2",
        level: "Expert",
        question: "What is Lock Escalation in DB2 and how do you prevent it?",
        answer: "**Lock Escalation** is an automated memory management process. When a transaction acquires more page or row locks on a single table than system limits allow (defined by the `NUMLKTS` parameter), DB2 automatically releases all individual page/row locks and replaces them with a single exclusive lock on the entire tablespace.\n\n* **Impact**: Lock escalation reduces memory overhead, but can block other applications and lead to timeouts.\n* **Prevention**:\n  - Tune BIND parameters (`RELEASE(COMMIT)`).\n  - Commit frequently to release locks.\n  - Choose `LOCKSIZE ANY` or `LOCKSIZE ROW` in table definitions depending on application concurrency needs.",
        code: "* Create table with row locking:\nCREATE TABLE EMP_TABLE (EMPID INT, ...)\nIN DB_HR.TS_EMP\nLOCKSIZE ROW;  * Reduces escalation risks but uses more memory",
        tip: "For high-volume batch updates, you can temporarily lock the table in exclusive mode using LOCK TABLE... to prevent the system from escalating locks dynamically.",
        quizOptions: [
            "Lock escalation increases index search speeds.",
            "Lock escalation converts many fine-grained page/row locks into a single table/tablespace lock to save system memory, but decreases concurrency.",
            "Lock escalation is a security process that blocks unauthorized users.",
            "Lock escalation occurs only when table space is full."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_12",
        category: "DB2",
        level: "Expert",
        question: "What is an SQL Indicator Variable and how do you handle SQLCODE -305?",
        answer: "An **SQLCODE -305** occurs when a query retrieves a NULL database value into a host variable that does not have an associated indicator variable.\n\n**Resolution**:\n1. Declare a 2-byte binary integer indicator variable (PIC S9(4) COMP).\n2. Append the indicator variable to the host variable in the SQL statement, separated by a colon (e.g. `:HOST-VAR :IND-VAR` or `:HOST-VAR INDICATOR :IND-VAR`).\n3. Check the indicator variable value in your program logic. A value of `-1` indicates that the database column was NULL.",
        code: "* DB2 Query with indicator variable:\nEXEC SQL\n    SELECT MGR_ID INTO :WS-MGR-ID :WS-MGR-IND\n    FROM DEPT_TABLE WHERE DEPTID = '10'\nEND-EXEC.\n\n* Handle NULL values:\nIF WS-MGR-IND = -1\n    DISPLAY \"DEPARTMENT MANAGER IS NULL (SQLCODE -305 avoided)\"\nEND-IF.",
        tip: "Indicator variables can also return values greater than 0 if a character string was truncated during a fetch operation.",
        quizOptions: [
            "-305 indicates a duplicate key violation; fix by changing keys.",
            "-305 occurs when a NULL database value is retrieved without an indicator variable; resolve by declaring an S9(4) COMP variable and appending it to the host variable in the query.",
            "-305 indicates a cursor is already open; fix by closing the cursor first.",
            "-305 represents an invalid database connection."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_13",
        category: "DB2",
        level: "Expert",
        question: "Explain the differences and use cases for Static SQL vs Dynamic SQL.",
        answer: "DB2 supports two execution methods for SQL queries:\n\n* **Static SQL**: The SQL statement is hardcoded in the program (e.g. 'EXEC SQL SELECT... END-EXEC'). The access path is determined at **compile/BIND time** by the optimizer and stored in a package. Faster execution, secure (no SQL injection), and low runtime overhead. Ideal for standard transactional programs.\n* **Dynamic SQL**: The SQL statement is constructed as a text string at runtime and prepared dynamically (e.g. 'PREPARE SQL-STMT FROM :WS-QUERY-STR'). The access path is determined at **runtime**. High CPU overhead, but offers maximum flexibility. Ideal for ad-hoc reporting or search tools.",
        code: "* Static SQL (Pre-compiled):\nEXEC SQL SELECT NAME INTO :WS-NAME FROM EMP WHERE EMPID = 1 END-EXEC.\n\n* Dynamic SQL (Parsed at runtime):\nMOVE 'SELECT NAME FROM EMP WHERE DEPT = ?' TO WS-SQL-STR.\nEXEC SQL PREPARE S1 FROM :WS-SQL-STR END-EXEC.",
        tip: "Use Static SQL for transactional programs to keep execution fast. If using Dynamic SQL, ensure the DB2 Dynamic SQL Cache is enabled to reuse plans and reduce binding overhead.",
        quizOptions: [
            "Static SQL runs only in batch; Dynamic SQL runs in CICS.",
            "Static SQL resolves access paths at BIND time (fast, secure); Dynamic SQL resolves paths at runtime (flexible, higher CPU overhead).",
            "Dynamic SQL cannot accept parameters.",
            "They are identical in compilation."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_14",
        category: "DB2",
        level: "Expert",
        question: "Compare the BIND options RELEASE(COMMIT) and RELEASE(DEALLOCATE).",
        answer: "These BIND options control when DB2 releases table/page locks and thread resources:\n\n* **RELEASE(COMMIT)**: Releases all table/tablespace locks and database resources every time the program issues a 'COMMIT' command. Minimizes lock contention, allowing other jobs to access the table, but increases resource allocation overhead.\n* **RELEASE(DEALLOCATE)**: Retains locks and database resources across commits. Locks are released only when the entire program terminates (deallocates). High performance (saves CPU cycles), but can block other applications and lead to timeouts.",
        code: "* BIND JCL option:\n  BIND PACKAGE(HRCOL) MEMBER(HRPGM) RELEASE(DEALLOCATE) ACTION(REP)",
        tip: "Use RELEASE(DEALLOCATE) for high-frequency CICS transactions that use dedicated threads to save CPU cycles. Use RELEASE(COMMIT) for batch programs to prevent locking out other steps.",
        quizOptions: [
            "RELEASE(COMMIT) runs only under JCL; RELEASE(DEALLOCATE) is for CICS.",
            "RELEASE(COMMIT) releases locks at each database commit (best concurrency); RELEASE(DEALLOCATE) retains locks until program termination (best performance, risk of contention).",
            "RELEASE(DEALLOCATE) deletes tablespaces automatically.",
            "They specify database backup frequencies."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_15",
        category: "DB2",
        level: "Expert",
        question: "Explain the DB2 System Catalog and write a metadata query.",
        answer: "The **DB2 System Catalog** is a set of internal system tables maintained by DB2 that store all database metadata (table schemas, column definitions, indexes, plan binds, and permissions). These tables are queried using standard SELECT statements, and are prefixed with the schema **SYSIBM**.\n\n* **Common Tables**:\n  - 'SYSIBM.SYSTABLES': Contains information about all tables and views.\n  - 'SYSIBM.SYSCOLUMNS': List of all columns.\n  - 'SYSIBM.SYSINDEXES': Information about indexes.",
        code: "* Query columns for a specific table:\nSELECT NAME, COLTYPE, LENGTH\nFROM SYSIBM.SYSCOLUMNS\nWHERE TBNAME = 'EMPLOYEES'\n  AND TBCREATOR = 'PRODHR';",
        tip: "Never run UPDATE or DELETE statements against SYSIBM tables. They are modified automatically by DB2 during CREATE, ALTER, and DROP operations.",
        quizOptions: [
            "The Catalog is a JCL backup utility.",
            "The System Catalog (SYSIBM schema) stores database metadata (schemas, indexes, table structures) and is queried using standard SQL SELECT statements.",
            "Catalog tables are stored in VSAM clusters directly.",
            "It tracks user passwords and terminal security."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_16",
        category: "DB2",
        level: "Expert",
        question: "Explain DB2 Concurrency locks: Shared (S), Update (U), and Exclusive (X).",
        answer: "DB2 uses locks to manage concurrent access and prevent data corruption:\n\n* **Shared Lock (S)**: Acquired when reading data. Other transactions can read the data (acquire S locks), but cannot modify it.\n* **Update Lock (U)**: Acquired when reading data with the intent to update it (e.g. 'SELECT FOR UPDATE'). Only one transaction can hold a U lock on a page/row. Other transactions can read the data, but cannot acquire U or X locks. Prevents deadlocks by serializing updates.\n* **Exclusive Lock (X)**: Acquired when writing or updating data. Other transactions cannot read or modify the locked data. No other locks are allowed.",
        code: "* Compatibility Grid:\n* Lock Type | S | U | X \n* S         | Y | Y | N\n* U         | Y | N | N\n* X         | N | N | N",
        tip: "Use Update (U) locks when reading rows that will be updated later in the same transaction. This prevents deadlocks that occur when two transactions hold Shared locks and attempt to upgrade to Exclusive locks simultaneously.",
        quizOptions: [
            "Locks are only used for security validation.",
            "S allows shared read access; U serializes read-for-update operations to prevent deadlocks; X blocks all concurrent reads/writes during data modifications.",
            "X locks allow other users to write data simultaneously.",
            "U locks automatically delete tablespaces."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_17",
        category: "DB2",
        level: "Expert",
        question: "Explain DB2 Lock Escalation thresholds and parameter controls.",
        answer: "Lock Escalation is triggered automatically by DB2 to conserve memory. It is controlled by two system parameters:\n\n* **NUMLKTS (Locks per Tablespace)**: The maximum number of page or row locks a single transaction can acquire on a single tablespace before DB2 escalates them to an exclusive tablespace lock.\n* **NUMLKUS (Locks per User)**: The maximum number of locks a single user thread can acquire across all tablespaces. If exceeded, the transaction abends with SQLCODE -904 (resource unavailable).",
        code: "* Escalation: Row Locks (Fine granularity) ---> Tablespace Lock (Coarse, blocks others)",
        tip: "Design batch programs to issue database commits frequently (e.g., every 1000 inserts) to release locks and prevent lock escalation.",
        quizOptions: [
            "Locking thresholds are configured in JCL directly.",
            "Lock Escalation converts page/row locks to tablespace locks when NUMLKTS limits are exceeded, saving lock memory but reducing concurrency; NUMLKUS limits total locks per user thread.",
            "NUMLKTS limits JCL step counts.",
            "Escalation is disabled by setting LOCKSIZE ROW."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "db2_18",
        category: "DB2",
        level: "Expert",
        question: "What is the purpose of the WITH HOLD cursor parameter?",
        answer: "By default, DB2 automatically closes all open cursors when the program issues a database 'COMMIT' command. \n\nDeclaring a cursor **WITH HOLD** preserves its state across commits. The database retains the cursor position and lock resources. The program can commit updates frequently (to release page/row locks) without having to reopen the cursor and search the index tree again, improving performance.",
        code: "EXEC SQL\n    DECLARE EMP_CUR CURSOR WITH HOLD FOR\n    SELECT EMP_ID, SALARY FROM EMP\nEND-EXEC.",
        tip: "The database retains some lock resources when using WITH HOLD. Ensure you close the cursor explicitly when you are done to release these resources.",
        quizOptions: [
            "It holds JCL steps in the spool queue.",
            "It preserves the cursor's state and position across database COMMITS, allowing frequent commits during sequential processing without reopening the cursor.",
            "It prevents database rollback operations.",
            "It copies data to tape drives."
        ],
        quizAnswerIndex: 1
    },

    // ==================== CICS QUESTIONS ====================
    {
        id: "cics_01",
        category: "CICS",
        level: "Beginner",
        question: "What is CICS and what is its primary role in mainframe systems?",
        answer: "**CICS (Customer Information Control System)** is a transaction server and application container designed for high-performance online transaction processing (OLTP) on mainframes.\n\n* **Role**: It manages terminal interactions, concurrent users, transaction threads, program executions, memory allocation, and database connectivity. It acts as an operating system within z/OS, providing fast, interactive access to mainframe data for millions of users.",
        code: "Users (Terminals/Browsers) ---> [CICS Region] ---> COBOL Programs ---> DB2 / VSAM",
        tip: "CICS manages resources using tables (like PCT and PPT) that define transactions and programs, allowing it to process thousands of transactions per second.",
        quizOptions: [
            "CICS is a database compiler utility.",
            "CICS is an Online Transaction Processing (OLTP) monitor that manages terminal users, memory, transactions, and database connections.",
            "CICS is a batch job scheduler.",
            "CICS is a storage format for tape files."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_02",
        category: "CICS",
        level: "Beginner",
        question: "Explain the difference between a Transaction and a Task in CICS.",
        answer: "These terms describe execution states in CICS:\n\n* **Transaction**: A logical unit of work defined by a 4-character ID (e.g. `ACCT`) mapped to a program in CICS configuration tables. It represents a business capability.\n* **Task**: A single running instance of a transaction. If 100 users execute the `ACCT` transaction simultaneously, CICS creates 100 separate tasks, each running in its own thread with its own memory allocation.",
        code: "Transaction: ACCT (Logical Definition in PCT Table)\nTask 00102 (User 1 running ACCT) \nTask 00103 (User 2 running ACCT)\nTask 00104 (User 3 running ACCT)",
        tip: "Keep task lifetimes short. Long-running tasks can hold system memory and lock resources, slowing down other users.",
        quizOptions: [
            "Transactions run in batch; Tasks run in CICS.",
            "A Transaction is the logical 4-character ID (PCT definition); a Task is a single execution instance of that transaction allocated memory by CICS.",
            "Tasks are database queries; Transactions are file backups.",
            "They are identical and can be used interchangeably."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_03",
        category: "CICS",
        level: "Beginner",
        question: "Explain the PCT and PPT configuration tables in CICS.",
        answer: "CICS manages applications using control tables loaded at startup:\n\n* **PCT (Program Control Table)**: Maps a user's 4-character transaction ID (e.g., `MENU`) to the name of the executable program module (e.g., `MENUPROG`) that handles the transaction.\n* **PPT (Program Processing Table)**: Registers program names, compiles their usage metrics, and maps them to their physical load modules on disk. PPT tracks program states (like whether a program is loaded into memory or disabled).",
        code: "User inputs Trans ID \"ACCT\" \n  ---> [PCT Table Lookup] ---> Maps to Program \"ACCTPROG\"\n  ---> [PPT Table Lookup] ---> Locates load module on disk & loads into memory",
        tip: "If a user runs a transaction and gets an AEZN or PGMIDERR abend, it usually means the transaction or program is not registered in the PCT or PPT.",
        quizOptions: [
            "PCT is for printers; PPT is for databases.",
            "PCT maps a transaction ID to a program name; PPT registers program locations and load states.",
            "PCT is a compiler option; PPT is a JCL statement.",
            "They are used to define screen layouts."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_04",
        category: "CICS",
        level: "Beginner",
        question: "How do you send and receive map screens in CICS?",
        answer: "CICS interfaces with terminals using **BMS (Basic Mapping Support)** maps. You send and receive screens using these commands:\n\n* **SEND MAP**: Formats and sends a map screen to the user's terminal.\n* **RECEIVE MAP**: Reads and processes data entered by the user on the map screen.",
        code: "* Send Map:\nEXEC CICS SEND\n    MAP('EMPMAP')\n    MAPSET('EMPSET')\n    FROM(EMPMAPO)\n    ERASE\nEND-EXEC.\n\n* Receive Map:\nEXEC CICS RECEIVE\n    MAP('EMPMAP')\n    MAPSET('EMPSET')\n    INTO(EMPMAPI)\nEND-EXEC.",
        tip: "Use the ERASE option in the SEND MAP command to clear any previous screen data before displaying the new map.",
        quizOptions: [
            "By using standard COBOL READ and WRITE statements.",
            "Using CICS commands: EXEC CICS SEND MAP (to display a map screen) and EXEC CICS RECEIVE MAP (to retrieve input from a screen).",
            "By using SQL SELECT and INSERT statements.",
            "CICS screens cannot receive user input."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_05",
        category: "CICS",
        level: "Intermediate",
        question: "What is Pseudo-Conversational programming and why is it preferred?",
        answer: "In a **Conversational** program, the program stays active in memory while waiting for the user to type input. This wastes system memory and holds locks during the user's 'think time'.\n\n**Pseudo-Conversational** programming resolves this by:\n1. Displaying a screen map (using `SEND MAP`).\n2. Saving the application state in the **COMMAREA** memory block.\n3. Terminating the task (using `EXEC CICS RETURN TRANSID(next-id)`) to release system resources.\n4. When the user presses an action key (like Enter or PF1), CICS automatically starts a new task, loads the COMMAREA state, and resumes execution. This maximizes concurrency.",
        code: "* Pseudo-Conversational Exit:\nEXEC CICS RETURN\n    TRANSID('ACCT')  * Run ACCT again on next input\n    COMMAREA(WS-COMM-DATA)\n    LENGTH(EIBCALEN)\nEND-EXEC.",
        tip: "Always use pseudo-conversational design for online screens. Conversational programming can cause performance issues in systems with many concurrent users.",
        quizOptions: [
            "It is a conversational AI interface for mainframe systems.",
            "A design where a task terminates and releases resources while waiting for user input, saving its state in the COMMAREA and restarting on the next keystroke to maximize system efficiency.",
            "It is a method to run batch jobs from terminal sessions.",
            "It is a method to execute recursive SQL statements."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_06",
        category: "CICS",
        level: "Intermediate",
        question: "Compare the CICS LINK and XCTL commands.",
        answer: "Both commands transfer execution control to another program module, but they differ in call stack behavior:\n\n* **EXEC CICS LINK**: Behaves like a subprogram call. The calling program stays in memory, suspends execution, and transfers control to the target program. When the target program completes (runs `RETURN`), execution resumes in the calling program. Uses more memory.\n* **EXEC CICS XCTL (Transfer Control)**: Behaves like a goto branch. The calling program is removed from memory, and control transfers to the target program. When the target program completes, control returns directly to the calling program's parent (or CICS). Uses less memory.",
        code: "* LINK (Creates nested call stack level):\nEXEC CICS LINK PROGRAM('SUBPROG') COMMAREA(WS-COMM) END-EXEC.\n\n* XCTL (Replaces current program level):\nEXEC CICS XCTL PROGRAM('SUBPROG') COMMAREA(WS-COMM) END-EXEC.",
        tip: "Use XCTL instead of LINK when you don't need to return to the calling program (e.g. branching from a menu program to a detail screen) to save system memory.",
        quizOptions: [
            "LINK is for DB2; XCTL is for VSAM.",
            "LINK acts like a subprogram call (returns to caller); XCTL transfers control and terminates the calling program (returns directly to the caller's parent).",
            "XCTL is for batch jobs; LINK is for online screens.",
            "They are identical and can be used interchangeably."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_07",
        category: "CICS",
        level: "Intermediate",
        question: "What is the COMMAREA and how is it used in CICS?",
        answer: "The **COMMAREA** (Communication Area) is a block of memory used to pass data between programs within a task, or across different tasks in a pseudo-conversational transaction.\n\n* **Accessing**: In the calling program, you define the data in the WORKING-STORAGE section. In the called program, you map and access the data in the `LINKAGE SECTION` under the special reserve name **DFHCOMMAREA**.\n* **Checking Size**: The called program should verify the system variable `EIBCALEN` (COMMAREA Length) before accessing DFHCOMMAREA fields to prevent memory access abends.",
        code: "LINKAGE SECTION.\n01 DFHCOMMAREA.\n   05 LK-EMP-ID   PIC S9(9) COMP.\n\nPROCEDURE DIVISION.\n    IF EIBCALEN > 0\n        PERFORM PROCESS-COMM-DATA\n    ELSE\n        PERFORM INITIAL-RUN-STATE\n    END-IF.\n    GOBACK.",
        tip: "Always check EIBCALEN before accessing DFHCOMMAREA fields. If a program tries to read DFHCOMMAREA when EIBCALEN is 0, the program will crash with an LENGERR or protection abend.",
        quizOptions: [
            "COMMAREA is a CICS terminal screen buffer.",
            "COMMAREA is a memory block used to pass data between programs or tasks, mapped in the linkage section as DFHCOMMAREA, and checked using EIBCALEN.",
            "COMMAREA is a SQL view definition.",
            "COMMAREA is used to define JCL steps."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_08",
        category: "CICS",
        level: "Intermediate",
        question: "Compare Temporary Storage Queues (TSQ) and Transient Data Queues (TDQ).",
        answer: "Both are scratchpad storage queues in CICS, but they have different characteristics:\n\n* **TSQ (Temporary Storage Queue)**: A dynamic scratchpad queue. Created on the fly without system configuration. Supports random read/write access. Data remains in the queue until explicitly deleted. Ideal for storing multi-page screen lists.\n* **TDQ (Transient Data Queue)**: A sequential queue. Must be pre-defined in the DCT (Destination Control Table). Read operations are destructive (reading a record deletes it from the queue). Supports trigger actions (e.g. automatically starting a batch job when the queue reaches a certain limit). Ideal for auditing, logging, or printing.",
        code: "* Write to TSQ:\nEXEC CICS WRITEQ TS QUEUE('MYTSQ') FROM(WS-DATA) END-EXEC.\n\n* Write to TDQ:\nEXEC CICS WRITEQ TD QUEUE('LOGD') FROM(WS-DATA) END-EXEC.",
        tip: "Prefix TSQ names with the terminal ID (from EIBTRMID) to prevent concurrent users from overwriting each other's temporary data.",
        quizOptions: [
            "TSQ is for database tables; TDQ is for files.",
            "TSQ is dynamic and supports random reads; TDQ must be pre-defined and reads are destructive (automatically deletes records upon read).",
            "TDQ is stored in memory; TSQ is stored on tape.",
            "They are identical queue types."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_09",
        category: "CICS",
        level: "Expert",
        question: "How do you handle CICS conditions and exceptions? Explain HANDLE CONDITION and RESP.",
        answer: "CICS commands can trigger exceptions (e.g., `MAPFAIL` when receiving an empty screen, or `PGMIDERR` when a LINK program is missing). CICS provides two ways to handle exceptions:\n\n* **HANDLE CONDITION (Legacy)**: Sets up event handlers. When an exception occurs, execution branches to a specified label. This can lead to unstructured code (spaghetti code) with many labels.\n* **RESP / RESP2 (Modern)**: Inline error handling. You add the `RESP` parameter to the CICS command to store the response code in a variable, then inspect the code using standard conditional checks. This keeps code structured.",
        code: "* Modern Inline Exception Handling:\nEXEC CICS LINK PROGRAM('SUBPGM')\n    COMMAREA(WS-COMM)\n    RESP(WS-RESP)\nEND-EXEC.\n\nEVALUATE WS-RESP\n    WHEN DFHRESP(NORMAL)\n        PERFORM PROCESS-SUCCESS\n    WHEN DFHRESP(PGMIDERR)\n        DISPLAY \"ERROR: SUBPROGRAM NOT FOUND\"\n    WHEN OTHER\n        PERFORM CRITICAL-ERROR\nEND-EVALUATE.",
        tip: "Use the RESP parameter for all CICS commands. It prevents execution from branching unexpectedly and keeps your code structured.",
        quizOptions: [
            "HANDLE CONDITION handles database connections; RESP handles files.",
            "HANDLE CONDITION branches to labels when exceptions occur; RESP stores response codes in variables for inline structured checking (EVALUATE/IF).",
            "RESP can only handle terminal errors.",
            "CICS exceptions cannot be caught by programs."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_10",
        category: "CICS",
        level: "Expert",
        question: "Explain the CICS execution path for DB2 integration and the role of the RCT.",
        answer: "When a CICS program executes an SQL statement, the request must pass from the CICS region to the DB2 engine. This connection is managed by the **CICS-DB2 Attachment Facility**:\n\n* **RCT (Resource Control Table)**: A configuration table that maps CICS transactions to DB2 resources. It specifies which DB2 Entry Threads or Pool Threads a transaction can use, and maps transaction IDs to DB2 Application Plans. This allows CICS to manage database connections efficiently.",
        code: "CICS Program (EXEC SQL) ---> [CICS-DB2 Attachment] ---> [RCT Table Lookup] ---> Thread Allocation ---> DB2 Execution",
        tip: "Ensure your RCT settings match your peak transaction volumes to prevent transactions from waiting for available DB2 connection threads during peak hours.",
        quizOptions: [
            "RCT is used to compile JCL steps.",
            "RCT maps CICS transactions to DB2 threads and application plans, managing database connections.",
            "RCT is a CICS screen map utility.",
            "RCT is used to backup VSAM datasets."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_11",
        category: "CICS",
        level: "Expert",
        question: "What is basic BMS map definition and mapset structure?",
        answer: "CICS terminal screens are defined using **BMS (Basic Mapping Support) macros**. The definition consists of three assembler macro statements:\n\n1. **DFHMSD (Mapset Definition)**: Defines the mapset container, specifying attributes like terminal type, storage allocation, and language options.\n2. **DFHMDI (Map Definition)**: Defines individual screen maps within the mapset, specifying screen size and position.\n3. **DFHMDF (Field Definition)**: Defines individual fields on the screen, specifying position, length, attributes (like protection and intensity), and field names.",
        code: "* BMS Mapset Assembly Source:\nMYMAPSET DFHMSD TYPE=MAP,MODE=INOUT,LANG=COBOL,TIOAPFX=YES\nMYMAP    DFHMDI SIZE=(24,80),CTRL=(FREEKB,FRSET)\nFLDLABEL DFHMDF POS=(5,10),LENGTH=10,ATTRB=(ASKIP,BRT),INITIAL='ENTER ID:'\nFLDINPUT DFHMDF POS=(5,22),LENGTH=8,ATTRB=(NUM,DET),INITIAL=''\n         DFHMSD TYPE=FINAL\n         END",
        tip: "Assembling a BMS map generates two versions: a Physical Map (loaded into the CICS region to format terminal layouts) and a Symbolic Map (a COBOL copybook structure used to map screen variables in programs).",
        quizOptions: [
            "BMS maps are defined using SQL statements.",
            "BMS maps are compiled as DB2 database views.",
            "BMS mapsets are defined using DFHMSD (mapset), DFHMDI (map), and DFHMDF (field) assembler macros, generating physical layout files and symbolic copybooks.",
            "BMS maps are defined inside the CICS PCT table."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "cics_12",
        category: "CICS",
        level: "Expert",
        question: "Explain CICS Task Control. How do you implement resource synchronization using ENQ and DEQ?",
        answer: "CICS processes tasks concurrently. If multiple tasks attempt to update the same shared resource (such as a temporary storage queue or temporary record file) at the same time, it can cause data corruption. You can prevent this using **Task Control** commands:\n\n* **EXEC CICS ENQ (Enqueue)**: Locks a resource name. If another task attempts to enqueue on the same resource name, CICS suspends that task until the resource is released.\n* **EXEC CICS DEQ (Dequeue)**: Releases the lock on a resource name, allowing suspended tasks to resume execution.",
        code: "* Lock resource:\nEXEC CICS ENQ RESOURCE(WS-LOCK-NAME) LENGTH(8) END-EXEC.\n\n* Perform safe update:\nPERFORM UPDATE-SHARED-RESOURCE.\n\n* Unlock resource:\nEXEC CICS DEQ RESOURCE(WS-LOCK-NAME) LENGTH(8) END-EXEC.",
        tip: "Always execute a matching DEQ command to release locks when you are done. If you forget, CICS will release the lock automatically when the task ends, but holding locks too long can cause bottlenecks.",
        quizOptions: [
            "ENQ and DEQ are used to format terminal screens.",
            "ENQ and DEQ are database indexing commands in DB2.",
            "ENQ (Enqueue) and DEQ (Dequeue) lock and unlock shared resource names to synchronize task execution and prevent concurrent write collisions.",
            "They are batch execution flags in JCL."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "cics_13",
        category: "CICS",
        level: "Expert",
        question: "Compare CICS Channels & Containers vs COMMAREA.",
        answer: "Both methods pass data between CICS programs, but they have major architecture differences:\n\n* **COMMAREA**: A single memory buffer limited to a maximum size of **32,767 bytes**. Passing larger structures requires defining complex pointers or database records.\n* **Channels & Containers**: Modern replacement. A **Container** is a named data buffer of unlimited size. A **Channel** is a logical group of containers. Programs pass channels instead of single buffers. This allows applications to pass multiple large structures without size limitations, simplifying data mapping.",
        code: "* Pass Channel to Program:\nEXEC CICS LINK PROGRAM('DETAIL')\n    CHANNEL('HR-CHANNEL')\nEND-EXEC.",
        tip: "Use Channels and Containers for new CICS programs. They eliminate the 32KB size limit of COMMAREAs and make passing structured data easier.",
        quizOptions: [
            "Channels are network paths; Containers are disks.",
            "COMMAREA is limited to 32KB; Channels and Containers support named data buffers of unlimited size, allowing programs to pass large structured datasets.",
            "COMMAREA is only used in batch JCL.",
            "They are obsolete parameters replaced by VSAM."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_14",
        category: "CICS",
        level: "Expert",
        question: "Explain CICS TSQ storage types: MAIN vs AUXILIARY.",
        answer: "CICS Temporary Storage Queues (TSQ) are scratchpad storage structures. You define where they are stored using the MAIN or AUXILIARY options:\n\n* **MAIN TSQ**: Stored directly in CICS region virtual memory. Extremely fast access (no disk operations). However, it consumes CICS dynamic storage allocation space (DSA). If the region crashes, all data is lost.\n* **AUXILIARY TSQ**: Stored on physical disk (in the DFSUTSH dataset). Slower access (requires disk I/O). However, it does not consume CICS region memory, and data can be recovered after a system restart.",
        code: "* Write to Main memory TSQ:\nEXEC CICS WRITEQ TS QUEUE('MYTSQ') FROM(WS-DATA) MAIN END-EXEC.\n\n* Write to Disk TSQ:\nEXEC CICS WRITEQ TS QUEUE('MYTSQ') FROM(WS-DATA) AUXILIARY END-EXEC.",
        tip: "Use MAIN TSQ for small, short-lived scratchpad variables. Use AUXILIARY TSQ for larger datasets (like search result pages) to save CICS region memory.",
        quizOptions: [
            "MAIN is for JCL; AUXILIARY is for DB2.",
            "MAIN TSQs are stored in CICS virtual memory (fast, volatile, consumes DSA); AUXILIARY TSQs are stored on disk (slower, persistent, saves memory).",
            "AUXILIARY TSQ is stored on tape drives.",
            "They are identical and CICS chooses storage automatically."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_15",
        category: "CICS",
        level: "Expert",
        question: "Explain CICS Distributed Program Link (DPL) and program routing.",
        answer: "**Distributed Program Link (DPL)** allows a program running in one CICS region (the client region) to invoke a program located in a remote CICS region (the server region) using standard LINK commands.\n\n* **Mechanism**: The local CICS region checks the PPT to see if the program is marked as remote. If remote, CICS routes the request over a connection link (using IPIC or MRO protocol) to the remote region, executes the program, and returns the result COMMAREA.",
        code: "* Link command remains identical:\nEXEC CICS LINK PROGRAM('REMPG1') COMMAREA(WS-COMM) END-EXEC.",
        tip: "Ensure your programs are thread-safe and do not access local resources (like local screen maps) when running via DPL, as screen mapping must execute in the client region.",
        quizOptions: [
            "DPL connects CICS regions to DB2 databases directly.",
            "DPL routes CICS LINK commands to execute programs in remote CICS regions over network connections, returning the results transparently.",
            "DPL is a JCL execution class.",
            "DPL is used to compile COBOL copybooks."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_16",
        category: "CICS",
        level: "Expert",
        question: "Explain CICS Syncpoints and transaction rollback operations.",
        answer: "A CICS transaction is divided into logical units of work (LUW). Data modifications (VSAM updates, DB2 updates) are committed or rolled back using syncpoints:\n\n* **EXEC CICS SYNCPOINT**: Commits all changes made within the current LUW. It releases locks and establishes a recovery point.\n* **EXEC CICS SYNCPOINT ROLLBACK**: Rolls back all data modifications made within the current LUW to the last syncpoint, restoring database records to their previous states.",
        code: "* Rollback updates on failure:\nIF WS-ERR-CODE > 0\n    EXEC CICS SYNCPOINT ROLLBACK END-EXEC\nEND-IF.",
        tip: "CICS automatically issues a syncpoint rollback when a transaction abends. Issue rollback commands explicitly in your code to handle business logic validation failures gracefully.",
        quizOptions: [
            "Syncpoints are JCL checkpoints used to restart jobs.",
            "Syncpoints commit or rollback all transaction updates (VSAM and DB2) within a logical unit of work, managing locks and data integrity.",
            "Syncpoints are defined inside the CICS PCT table.",
            "Rollback deletes the transaction history from system logs."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_17",
        category: "CICS",
        level: "Expert",
        question: "What is a CICS ASRA abend and how do you diagnose it?",
        answer: "An **ASRA abend** is a general program execution abend. It is triggered when the operating system detects a hardware exception in a program running under CICS:\n\n* **Common Causes**:\n  - Zoned decimal data exceptions (System code S0C7).\n  - Memory protection exceptions (System code S0C4) caused by invalid pointers.\n  - Division by zero exceptions (System code S0C9).\n* **Diagnosis**: Check the CICS execution diagnostic facility (CEDF) or inspect the CEEDUMP log to find the offset and variable name where the exception occurred.",
        code: "* CICS CEDF panel will show: 'Transaction ACCT abended with code ASRA'",
        tip: "Zoned decimal exceptions (S0C7) are the most common cause of ASRA abends. Ensure all numeric variables are initialized to zero before processing.",
        quizOptions: [
            "ASRA is an out-of-memory abend resolved by increasing space parameters.",
            "ASRA is a CICS program exception abend (typically caused by S0C7 data exceptions or S0C4 memory protection issues) diagnosed using CEDF or CEEDUMP offset maps.",
            "ASRA is an index validation error.",
            "ASRA indicates a network connection timeout."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_18",
        category: "CICS",
        level: "Expert",
        question: "Explain CICS Threadsafe programs and open TCB execution.",
        answer: "By default, legacy CICS programs execute sequentially on a single central thread called the **Quasi-Reentrant (QR) TCB** (Task Control Block). This can cause performance bottlenecks in multi-core systems.\n\nDeclaring a program **THREADSAFE** tells CICS that it can execute concurrently on an **Open TCB** (such as an L8 TCB used for DB2 connections). This allows programs to run in parallel across multiple CPU cores, increasing transaction throughput.",
        code: "* CICS PPT Program Attribute definition:\n  CONCURRENCY(THREADSAFE)",
        tip: "Avoid using non-threadsafe CICS APIs (like temporary storage queues defined without threadsafe support) in threadsafe programs, as CICS will force the program to switch back to the QR TCB, reducing performance.",
        quizOptions: [
            "Threadsafe programs run only under JCL steps.",
            "Threadsafe programs run concurrently on Open TCBs (such as L8 TCBs for DB2) to utilize multi-core processors, avoiding bottlenecks associated with the QR TCB.",
            "Threadsafe programs cannot access databases.",
            "Threadsafe is a security profile set in RACF."
        ],
        quizAnswerIndex: 1
    },

    // ==================== SQL QUESTIONS ====================
    {
        id: "sql_01",
        category: "SQL",
        level: "Beginner",
        question: "Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN.",
        answer: "These joins combine records from two tables based on matching column values:\n\n* **INNER JOIN**: Returns only rows that have matching values in both tables.\n* **LEFT JOIN (or LEFT OUTER JOIN)**: Returns all rows from the left table, plus any matching rows from the right table. If there is no match, the right table columns return NULL.\n* **RIGHT JOIN (or RIGHT OUTER JOIN)**: Returns all rows from the right table, plus any matching rows from the left table. If there is no match, the left table columns return NULL.",
        code: "* Inner Join:\nSELECT A.EMPNAME, B.DEPTNAME \nFROM EMP A INNER JOIN DEPT B ON A.DEPTID = B.DEPTID;\n\n* Left Join:\nSELECT A.EMPNAME, B.DEPTNAME \nFROM EMP A LEFT JOIN DEPT B ON A.DEPTID = B.DEPTID;",
        tip: "Use LEFT JOIN when you want to retrieve all parent records (like all departments) regardless of whether they have child records (like employees) associated with them.",
        quizOptions: [
            "Inner Join returns all rows; Left Join returns only matching rows.",
            "INNER JOIN returns matching rows in both tables; LEFT JOIN returns all rows from the left table plus matching right rows; RIGHT JOIN returns all right rows plus matching left rows.",
            "Left Join is for text tables; Right Join is for numeric tables.",
            "They are database optimization parameters."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_02",
        category: "SQL",
        level: "Beginner",
        question: "What is the difference between the WHERE and HAVING clauses?",
        answer: "Both clauses filter data, but they operate at different stages of query execution:\n\n* **WHERE Clause**: Filters rows **before** any grouping occurs. It cannot contain aggregate functions (like `SUM()`, `AVG()`, or `COUNT()`).\n* **HAVING Clause**: Filters grouped rows **after** the `GROUP BY` clause has executed. It is used to filter groups based on aggregate function values.",
        code: "* Filter records and groups:\nSELECT DEPTID, AVG(SALARY) \nFROM EMP\nWHERE STATE = 'NY'          * Filters rows first\nGROUP BY DEPTID\nHAVING AVG(SALARY) > 50000; * Filters grouped results",
        tip: "Avoid using the HAVING clause to filter non-aggregated columns. Filter those columns in the WHERE clause instead to reduce the amount of data the query has to group, improving performance.",
        quizOptions: [
            "WHERE is used in SELECT queries; HAVING is used in UPDATE queries.",
            "WHERE filters rows before grouping; HAVING filters grouped results after GROUP BY.",
            "HAVING is used to search for indexes; WHERE is used to join tables.",
            "They are identical and can be used interchangeably."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_03",
        category: "SQL",
        level: "Beginner",
        question: "Explain the difference between correlated and non-correlated subqueries.",
        answer: "A subquery is a query nested inside another query (such as a SELECT, INSERT, UPDATE, or DELETE statement):\n\n* **Non-Correlated Subquery**: An independent query. It evaluates once, returns a result set, and passes that result to the outer query. It does not reference columns in the outer query.\n* **Correlated Subquery**: A dependent query. It references columns from the outer query and executes once for **every row** processed by the outer query. This can slow down performance on large tables.",
        code: "* Non-Correlated (Executes once):\nSELECT * FROM EMP WHERE DEPTID IN (SELECT DEPTID FROM DEPT WHERE LOC = 'NY');\n\n* Correlated (Executes for every row of outer query):\nSELECT E.NAME, E.SALARY FROM EMP E\nWHERE E.SALARY > (SELECT AVG(S.SALARY) FROM EMP S WHERE S.DEPTID = E.DEPTID);",
        tip: "Where possible, rewrite correlated subqueries as JOINs to allow the database optimizer to choose more efficient access paths.",
        quizOptions: [
            "Correlated subqueries use indexes; non-correlated subqueries do not.",
            "Non-correlated subqueries are independent and execute once; correlated subqueries reference outer query columns and execute once for every row processed by the outer query.",
            "Correlated subqueries can only return strings.",
            "They are identical in performance and execution."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_04",
        category: "SQL",
        level: "Beginner",
        question: "What is the difference between a clustered index and a non-clustered index?",
        answer: "Indexes speed up queries by pointing to data locations on disk:\n\n* **Clustered Index**: Determines the **physical order** of data storage on disk. A table can have only one clustered index because data rows can be physically sorted in only one way. Usually created on the primary key.\n* **Non-Clustered Index**: A separate structure containing index keys and pointers to the physical rows on disk. A table can have multiple non-clustered indexes. Searches require a double lookup: first searching the index, then fetching the physical row.",
        code: "* Create Clustered Index:\nCREATE CLUSTERED INDEX IDX_EMP_ID ON EMP(EMPID);\n\n* Create Non-Clustered Index:\nCREATE INDEX IDX_EMP_ZIP ON EMP(ZIPCODE);",
        tip: "Define your clustered index on columns that are frequently used in range queries or sorted outputs (like date ranges or numeric IDs) to speed up performance.",
        quizOptions: [
            "Clustered indexes are stored in memory; non-clustered indexes are stored on disk.",
            "A clustered index physically sorts the table rows on disk (limit one per table); a non-clustered index is a separate pointer structure (multiple allowed).",
            "Non-clustered indexes are only used for text columns.",
            "Clustered indexes cannot be modified."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_05",
        category: "SQL",
        level: "Intermediate",
        question: "What is a Common Table Expression (CTE) and why is it used?",
        answer: "A **Common Table Expression (CTE)** is a temporary result set defined using the `WITH` clause. It exists only during the execution of a single query.\n\n* **Benefits**:\n  - Improves readability by breaking complex queries into modular steps.\n  - Can be referenced multiple times within the same query.\n  - Supports recursion (allowing queries on hierarchical structures like organizational charts).",
        code: "* CTE Example:\nWITH DEPT_SUMMARY AS (\n    SELECT DEPTID, AVG(SALARY) AS AVG_SAL, COUNT(*) AS EMP_COUNT\n    FROM EMP\n    GROUP BY DEPTID\n)\nSELECT E.NAME, E.SALARY, D.AVG_SAL\nFROM EMP E INNER JOIN DEPT_SUMMARY D ON E.DEPTID = D.DEPTID\nWHERE E.SALARY > D.AVG_SAL;",
        tip: "Use CTEs instead of complex nested subqueries to make your SQL queries easier to read and maintain.",
        quizOptions: [
            "A CTE is a database backup file format.",
            "A CTE is a temporary query result set defined using the WITH clause that improves readability and supports recursion.",
            "A CTE is an index type used in DB2.",
            "A CTE is used to define JCL variables."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_06",
        category: "SQL",
        level: "Intermediate",
        question: "Compare the ROW_NUMBER, RANK, and DENSE_RANK window functions.",
        answer: "These window functions assign sequential integers to rows within a partition based on a sort order. They handle duplicate values (ties) differently:\n\n* **ROW_NUMBER()**: Assigns a unique, sequential integer to each row. If two rows have identical values, it still assigns different numbers (e.g. 1, 2, 3, 4).\n* **RANK()**: Assigns duplicate numbers to ties, then **skips** the next numbers. For example, if there is a tie for 2nd place, it assigns: 1, 2, 2, 4.\n* **DENSE_RANK()**: Assigns duplicate numbers to ties, but **does not skip** numbers. For example, if there is a tie for 2nd place, it assigns: 1, 2, 2, 3.",
        code: "SELECT NAME, SALARY,\n       ROW_NUMBER() OVER (ORDER BY SALARY DESC) AS RN,\n       RANK()       OVER (ORDER BY SALARY DESC) AS RK,\n       DENSE_RANK() OVER (ORDER BY SALARY DESC) AS DRK\nFROM EMP;\n\n* Data:     10000, 9000, 9000, 8000\n* RN values:  1,     2,    3,    4\n* RK values:  1,     2,    2,    4  (skips 3)\n* DRK values: 1,     2,    2,    3  (no skip)",
        tip: "Use DENSE_RANK() when calculating leaderboard rankings where you want consecutive rank numbers (e.g., 1st, 2nd, 3rd) even when there are ties.",
        quizOptions: [
            "ROW_NUMBER is for loops; RANK is for views.",
            "ROW_NUMBER assigns unique sequential numbers; RANK assigns duplicates to ties and skips numbers; DENSE_RANK assigns duplicates to ties but does not skip numbers.",
            "DENSE_RANK only works on numeric primary keys.",
            "They are identical and can be used interchangeably."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_07",
        category: "SQL",
        level: "Intermediate",
        question: "How do you locate and delete duplicate rows in a SQL table?",
        answer: "You can locate and delete duplicate rows by combining a **Common Table Expression (CTE)** with the `ROW_NUMBER()` window function:\n\n1. Define a CTE that partitions rows by the duplicate columns and assigns a sequential row number using `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)`.\n2. Delete rows from the CTE where the row number is greater than 1.",
        code: "* Remove duplicate employees keeping the lowest ID:\nWITH CTE_DUPLICATES AS (\n    SELECT EMPNAME, DEPTID,\n           ROW_NUMBER() OVER (\n               PARTITION BY EMPNAME, DEPTID \n               ORDER BY EMPID ASC\n           ) AS RN\n    FROM EMP\n)\nDELETE FROM CTE_DUPLICATES WHERE RN > 1;",
        tip: "Always run a SELECT query using the duplicate criteria before executing a DELETE statement to verify you are removing the correct rows.",
        quizOptions: [
            "By executing a ROLLBACK command.",
            "Using a CTE combined with the ROW_NUMBER() window function partitioned by the duplicate columns, then deleting rows where the row number is greater than 1.",
            "By deleting all rows and reloading the table from backup.",
            "SQL tables cannot contain duplicate rows."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_08",
        category: "SQL",
        level: "Intermediate",
        question: "Explain the concept of Database Normalization and Third Normal Form (3NF).",
        answer: "**Database Normalization** is a design process used to organize tables to reduce data redundancy and prevent update anomalies. It divides large tables into smaller tables and defines relationships between them:\n\n* **1NF (First Normal Form)**: All columns must contain atomic (indivisible) values, and there must be no repeating groups.\n* **2NF (Second Normal Form)**: Must be in 1NF, and all non-key columns must depend entirely on the primary key (no partial dependencies on composite keys).\n* **3NF (Third Normal Form)**: Must be in 2NF, and all non-key columns must depend **only** on the primary key, with no transitive dependencies (non-key columns depending on other non-key columns).",
        code: "* Violates 3NF (DEPTNAME depends on DEPTID, not EMPID):\n* EMP(EMPID, EMPNAME, DEPTID, DEPTNAME)\n\n* Normalized to 3NF (Split into two tables):\n* EMP(EMPID, EMPNAME, DEPTID)\n* DEPT(DEPTID, DEPTNAME)",
        tip: "Normalize to 3NF for transactional databases (OLTP) to keep updates fast. For reporting databases (OLAP), you may want to denormalize tables to speed up complex queries.",
        quizOptions: [
            "Normalization is the process of indexing columns.",
            "3NF requires that all non-key columns depend directly on the primary key, with no transitive dependencies, reducing data redundancy.",
            "3NF means a table cannot have more than three indexes.",
            "Normalization is used to backup database files."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_09",
        category: "SQL",
        level: "Expert",
        question: "Explain database transactions and ACID properties.",
        answer: "A **Transaction** is a logical unit of work containing one or more SQL statements that must execute successfully as a single block. Transactions must guarantee the four **ACID** properties:\n\n* **Atomicity**: The 'all-or-nothing' rule. If any statement in the transaction fails, the entire transaction is rolled back and the database state remains unchanged.\n* **Consistency**: The database must transition from one valid state to another, preserving all constraints, triggers, and foreign keys.\n* **Isolation**: Concurrent transactions must execute without interfering with each other. Intermediate states of a transaction are hidden from other transactions.\n* **Durability**: Once a transaction commits, its changes are written to persistent storage and will survive subsequent system crashes.",
        code: "BEGIN TRANSACTION;\n  UPDATE ACCOUNTS SET BAL = BAL - 100 WHERE ACC_ID = 1;\n  UPDATE ACCOUNTS SET BAL = BAL + 100 WHERE ACC_ID = 2;\n* If system crashes here, changes are rolled back (Atomicity).\nCOMMIT;",
        tip: "Keep transactions as short as possible to reduce lock times and prevent system timeouts.",
        quizOptions: [
            "ACID properties specify table formatting rules.",
            "ACID represents Atomicity (all-or-nothing), Consistency (valid states), Isolation (independent runs), and Durability (persistence), ensuring reliable database transactions.",
            "ACID is a database tuning utility.",
            "ACID properties apply only to index scans."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_10",
        category: "SQL",
        level: "Expert",
        question: "Compare Index Scans and Index Seeks. Which is better for performance?",
        answer: "These are the two main ways a database engine searches indexes to locate rows:\n\n* **Index Seek**: The optimizer uses the index tree structure to navigate directly to the specific rows that match the query filter (e.g. searching by an exact ID). Highly efficient because it processes only matching rows.\n* **Index Scan**: The engine reads the entire index from top to bottom (or a large range of it) because the query filter is not specific enough (e.g. searching using a wildcard suffix `LIKE '%NAME'`). Less efficient because it reads many index pages.\n\n**Performance**: An **Index Seek is significantly better** than an Index Scan. However, both are generally faster than a Full Table Scan.",
        code: "* Index Seek (Fastest):\nSELECT NAME FROM EMP WHERE EMPID = 1205;\n\n* Index Scan (Slower):\nSELECT NAME FROM EMP WHERE EMPID > 0; * Reads entire index",
        tip: "Avoid using leading wildcards in search queries (like '%text%'). They prevent the optimizer from performing index seeks, forcing full table scans instead.",
        quizOptions: [
            "Scans are only used for text; Seeks are for numbers.",
            "Index Seek navigates the index tree directly to matching rows (best performance); Index Scan reads the entire index page list because filters are not specific enough.",
            "Index Scans are faster than Index Seeks.",
            "They are physical disk alignment parameters."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_11",
        category: "SQL",
        level: "Expert",
        question: "How do you write a recursive SQL query? Give an example using CTE.",
        answer: "A **Recursive CTE** references itself in its own definition. It is used to query hierarchical data structures (such as organizational charts, bill of materials, or category trees). It consists of two parts:\n\n1. **Anchor Member**: A base query that returns the initial starting rows.\n2. **Recursive Member**: A query joined to the anchor query using `UNION ALL` that references the CTE name to retrieve nested child records.",
        code: "* Query employee hierarchy:\nWITH RECURSIVE EMP_ORG AS (\n    * Anchor: Find top-level manager\n    SELECT EMPID, NAME, MGR_ID, 1 AS LEVEL\n    FROM EMP WHERE MGR_ID IS NULL\n    \n    UNION ALL\n    \n    * Recursive: Find employees reporting to managers already found\n    SELECT E.EMPID, E.NAME, E.MGR_ID, O.LEVEL + 1\n    FROM EMP E \n    INNER JOIN EMP_ORG O ON E.MGR_ID = O.EMPID\n)\nSELECT * FROM EMP_ORG ORDER BY LEVEL, NAME;",
        tip: "Always specify a limit or verify your recursion join condition to prevent infinite loops when querying tables with circular references.",
        quizOptions: [
            "By nesting SELECT statements inside loops.",
            "Using a Recursive CTE (WITH RECURSIVE) consisting of an Anchor member (base query) and a Recursive member joined via UNION ALL that references the CTE itself.",
            "By running a loop command in JCL.",
            "Recursive queries are not supported in SQL."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_12",
        category: "SQL",
        level: "Expert",
        question: "How do you analyze a SQL execution plan to optimize a slow query?",
        answer: "You can analyze a SQL execution plan using the `EXPLAIN` statement. To optimize a slow query, look for these common issues in the plan:\n\n1. **Full Table Scans (FTS)**: Indicates the query is reading every row of the table. Resolve by creating indexes on columns used in `WHERE` and `JOIN` filters.\n2. **Key Lookups**: Occurs when the engine uses a non-clustered index but has to fetch missing columns from the physical table. Resolve by adding the missing columns to the index definition using the `INCLUDE` clause (creating a covering index).\n3. **Hash Joins**: Often indicates missing indexes on join key columns. Creating indexes can convert these to faster nested loop joins.",
        code: "* Analyze query path:\nEXPLAIN SELECT NAME, DEPTID FROM EMP WHERE DEPTID = 5;\n* Check the plan output to verify if an index is being used.",
        tip: "Create indexes on columns that are frequently used in JOIN, WHERE, ORDER BY, and GROUP BY clauses to speed up queries.",
        quizOptions: [
            "By adding more columns to the query select statement.",
            "By executing EXPLAIN, checking for Table Scans (FTS) and Key Lookups, and resolving them by creating appropriate indexes or covering indexes.",
            "By increasing the database buffer size.",
            "By compressing the database files using JCL."
        ],
        quizAnswerIndex: 1
    }
,
    {
        id: "sql_13",
        category: "SQL",
        level: "Expert",
        question: "Compare Stage 1 and Stage 2 predicates in DB2 query performance.",
        answer: "DB2 processes query filters (predicates) in two stages to optimize performance:\n\n* **Stage 1 Predicates (Indexable/Sargable)**: Processed directly by the DB2 Data Manager (DM). DM filters out non-matching rows quickly before copying pages to memory buffers. Extremely efficient. Examples include exact matches (col = ?) or simple comparisons (col > ?).\n* **Stage 2 Predicates (Residual)**: Processed later by the DB2 Relational Data System (RDS). Requires copying all data pages to memory first. High CPU overhead. Examples include functions (YEAR(date_col) = ?) or mathematical calculations (col + 10 = ?).",
        code: "* Stage 1 (Fast, processed by DM):\nSELECT NAME FROM EMP WHERE DEPTID = 5;\n\n* Stage 2 (Slower, processed by RDS):\nSELECT NAME FROM EMP WHERE DEPTID + 0 = 5;",
        tip: "Avoid applying arithmetic operations or functions directly to columns in your WHERE clause to prevent them from becoming Stage 2 predicates.",
        quizOptions: [
            "Stage 1 is for JCL; Stage 2 is for DB2.",
            "Stage 1 predicates are filtered quickly by the Data Manager during I/O; Stage 2 predicates are processed later in memory by the Relational Data System, consuming more CPU.",
            "Stage 2 predicates are faster than Stage 1 predicates.",
            "They specify database replication frequencies."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_14",
        category: "SQL",
        level: "Expert",
        question: "Explain the MERGE statement and how it optimizes upsert operations.",
        answer: "The **MERGE** statement combines insert, update, and delete operations into a single SQL statement. \n\n* **Performance**: It runs as a single optimized database call. The database engine performs key comparisons and decides whether to update or insert records inline, reducing network traffic and connection thread overhead.",
        code: "MERGE INTO EMPLOYEES T\nUSING (VALUES (101, 'JANE', 85000)) S (EMP_ID, FIRST_NAME, SALARY)\nON T.EMP_ID = S.EMP_ID\nWHEN MATCHED THEN\n    UPDATE SET T.SALARY = S.SALARY\nWHEN NOT MATCHED THEN\n    INSERT (EMP_ID, FIRST_NAME, SALARY) \n    VALUES (S.EMP_ID, S.FIRST_NAME, S.SALARY);",
        tip: "Use the MERGE statement for batch load operations instead of executing separate SELECT, INSERT, and UPDATE queries to speed up execution.",
        quizOptions: [
            "MERGE is used to merge sequential files in JCL.",
            "MERGE combines INSERT, UPDATE, and DELETE operations into a single database call, optimizing upsert transactions.",
            "MERGE only works on clustered indexes.",
            "MERGE is a legacy option replaced by JOIN."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_15",
        category: "SQL",
        level: "Expert",
        question: "How do you write a recursive Common Table Expression (CTE) to traverse hierarchical trees?",
        answer: "A recursive CTE uses self-referencing joins to traverse parent-child relationships (like organizational hierarchies):\n\n* **Anchor Member**: Base query that retrieves starting root records (e.g. employees with no managers).\n* **Recursive Member**: Joins the base CTE back to the physical table to fetch nested child records, incrementing tree levels dynamically. The query terminates automatically when no child records are found.",
        code: "WITH RECURSIVE EMP_TREE (EMP_ID, NAME, LEVEL) AS (\n    * Anchor query:\n    SELECT EMP_ID, FIRST_NAME, 1 FROM EMPLOYEES WHERE MANAGER_ID IS NULL\n    UNION ALL\n    * Recursive join:\n    SELECT E.EMP_ID, E.FIRST_NAME, T.LEVEL + 1 \n    FROM EMPLOYEES E \n    INNER JOIN EMP_TREE T ON E.MANAGER_ID = T.EMP_ID\n)\nSELECT * FROM EMP_TREE;",
        tip: "Ensure your join condition is correct to prevent infinite loops when traversing tables with circular references.",
        quizOptions: [
            "By writing nested subqueries for every level.",
            "Using a recursive CTE (WITH RECURSIVE) that combines a base query (Anchor) and a self-referencing subquery (Recursive) using UNION ALL.",
            "By executing a loop statement in JCL.",
            "Hierarchical traversals are not supported in SQL."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_16",
        category: "SQL",
        level: "Expert",
        question: "Explain the LEAD and LAG window functions and their performance benefits.",
        answer: "These window functions allow you to access data from subsequent or previous rows in a result set without performing self-joins:\n\n* **LAG()**: Retrieves values from a row located a specified offset *before* the current row.\n* **LEAD()**: Retrieves values from a row located a specified offset *after* the current row.\n\n**Performance**: They run in a single pass over the sorted data in memory, avoiding the expensive I/O operations associated with self-joins.",
        code: "SELECT FIRST_NAME, SALARY,\n       LAG(SALARY, 1, 0) OVER (ORDER BY SALARY DESC) AS PREV_SALARY\nFROM EMPLOYEES;",
        tip: "Specify a default value (like 0) as the third parameter in LAG/LEAD to prevent NULL values on the first or last rows.",
        quizOptions: [
            "They are database configuration commands.",
            "LAG retrieves data from a prior row, and LEAD retrieves data from a subsequent row within a sorted partition, avoiding expensive self-joins.",
            "LEAD and LAG only work on primary key indexes.",
            "They are JCL step execution flags."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_17",
        category: "SQL",
        level: "Expert",
        question: "Compare EXISTS and IN clauses. Which is better for performance?",
        answer: "Both clauses filter data based on subquery results, but the optimizer evaluates them differently:\n\n* **EXISTS**: Evaluates as a boolean test. The engine terminates processing the subquery as soon as a single match is found (semi-join optimization). Highly efficient for filtering parent rows based on child record presence.\n* **IN**: Evaluates the subquery, compiles the complete result set, and matches the outer query value. If the subquery result set is large, it can consume a large amount of memory.\n\n**Performance**: **EXISTS is generally faster** than IN for large subquery datasets.",
        code: "* EXISTS (Fastest for large sets):\nSELECT DEPT_NAME FROM DEPARTMENTS D\nWHERE EXISTS (SELECT 1 FROM EMPLOYEES E WHERE E.DEPT_ID = D.DEPT_ID);\n\n* IN (Can be slower):\nSELECT DEPT_NAME FROM DEPARTMENTS D\nWHERE DEPT_ID IN (SELECT DEPT_ID FROM EMPLOYEES);",
        tip: "Use EXISTS when checking for record presence in tables with large datasets to speed up query execution.",
        quizOptions: [
            "IN is always faster than EXISTS.",
            "EXISTS terminates the subquery scan upon locating the first match (best for large subquery sets); IN compiles a complete matching value list (can be slower).",
            "EXISTS only works on alphanumeric columns.",
            "They are completely synonymous in compiled plans."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_18",
        category: "SQL",
        level: "Expert",
        question: "Explain the WITH UR (Uncommitted Read) clause and its locking implications.",
        answer: "Specifying **WITH UR (Uncommitted Read)** at the end of a SELECT query overrides the default isolation level of the table/package:\n\n* **Locking**: DB2 does not acquire any locks when reading rows, and ignores exclusive locks held by other transactions. It reads data pages directly without waiting for active transactions to commit.\n* **Risk**: Allows 'dirty reads' (reading modified data that has not been committed yet). If the modifying transaction rolls back, your query has read invalid data.\n* **Use Case**: Best for reporting or dashboards where read speed is key and absolute data accuracy is not required.",
        code: "SELECT COUNT(*) FROM TRANSACTION_LOG WITH UR;",
        tip: "Do not use WITH UR for financial transactions or updates where read accuracy is vital to prevent processing incorrect data.",
        quizOptions: [
            "WITH UR locks the table for editing.",
            "WITH UR bypasses all read locks (avoiding contention and waits) at the risk of reading uncommitted/dirty data, suitable for reporting.",
            "WITH UR is a command used to create database tables.",
            "WITH UR only works under CICS regions."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_19",
        category: "COBOL",
        level: "Beginner",
        question: "What is the purpose of the FILLER clause in COBOL record layouts?",
        answer: "The **FILLER** clause is a reserved word used to define an unnamed, elementary data field in a record structure. It is commonly used for padding, aligning fields on boundaries, or reserving unused space in file layouts for future expansion. FILLER fields cannot be referenced directly in the PROCEDURE DIVISION.",
        code: "01  WS-RECORD.\n    05  WS-ID     PIC 9(5).\n    05  FILLER    PIC X(3) VALUE SPACES. * Padding space\n    05  WS-NAME   PIC X(20).",
        tip: "In modern COBOL (COBOL-85 and later), you can omit the word FILLER entirely and declare a blank elementary field (e.g. 05 PIC X(3) VALUE SPACES), but legacy codebases will have FILLER explicitly written.",
        quizOptions: [
            "FILLER calls database connection APIs.",
            "FILLER is used to declare unnamed, elementary fields for alignment, padding, or future database field space reservation.",
            "FILLER compiles program executable libraries.",
            "FILLER is a loop indexing variable."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_19",
        category: "JCL",
        level: "Intermediate",
        question: "Explain the utility IEHLIST and its common administration uses.",
        answer: "**IEHLIST** is an IBM system utility used to list catalog entries, Volume Table of Contents (VTOC) directories, or Partitioned Dataset (PDS) directory structures.\n\n* **Common Commands**:\n  - `LISTCTLG`: Lists catalog contents.\n  - `LISTVTOC`: Lists the datasets allocated on a specific disk volume and their serial attributes.\n  - `LISTPDS`: Lists members inside a Partitioned Dataset library.",
        code: "//LISTVTOC EXEC PGM=IEHLIST\n//SYSPRINT DD SYSOUT=*\n//SYSIN    DD *\n  LISTVTOC VOL=3390=SYS001\n/*",
        tip: "In modern shops, IDCAMS is preferred for listing catalog items, but IEHLIST remains useful for low-level disk volume (VTOC) inspections.",
        quizOptions: [
            "IEHLIST compiles COBOL applications.",
            "IEHLIST is used to copy datasets.",
            "IEHLIST is a system utility used to print directory lists, VTOC contents of a disk, and catalog structures.",
            "IEHLIST maps CICS transaction screens."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "vsam_19",
        category: "VSAM",
        level: "Expert",
        question: "Explain VSAM dynamic allocation via DFSMS SMS classes (DATACLAS, STORCLAS, MGMTCLAS).",
        answer: "**DFSMS (Data Facility System Managed Storage)** automates VSAM dataset creation and volume allocation using storage classes. When defining a VSAM cluster or JCL dataset, you specify:\n\n* **STORCLAS (Storage Class)**: Specifies performance requirements (like response time and SSD vs HDD mapping) and availability levels. Mandatory for SMS-managed files.\n* **DATACLAS (Data Class)**: Provides default physical attributes like record format, record size, space allocation, VSAM key offset, and whether compression is enabled.\n* **MGMTCLAS (Management Class)**: Specifies archive, retention, and migration policies (like moving files to tape after 30 days of inactivity).",
        code: "//NEWKSDS  DD DSN=PROD.EMP.SMSKSDS,DISP=(NEW,CATLG),\n//            STORCLAS=FASTSSD,DATACLAS=KSDS80,MGMTCLAS=RETAIN30",
        tip: "By using SMS classes, JCL developers do not need to specify hardcoded volume serial numbers (VOL=SER) or unit parameters (UNIT=SYSDA), simplifying environment migration.",
        quizOptions: [
            "SMS classes compile JCL procedures.",
            "STORCLAS defines physical folders; DATACLAS defines variables.",
            "DFSMS uses STORCLAS (performance/device targets), DATACLAS (file attributes/key structures), and MGMTCLAS (archival/retention rules) to automate VSAM dynamic allocation without hardcoded device IDs.",
            "SMS classes are used for text messaging systems on mainframes."
        ],
        quizAnswerIndex: 2
    },
    {
        id: "db2_19",
        category: "DB2",
        level: "Beginner",
        question: "What is a DB2 NULL value and how is it processed in SQL?",
        answer: "A **NULL** value represents missing or unknown data in a DB2 column. It is different from spaces or zeroes.\n\n* **SQL Processing**: Any comparison with NULL (e.g. `col = NULL` or `col <> NULL`) evaluates to UNKNOWN. To check for nulls, you must use the special clauses **IS NULL** or **IS NOT NULL**.\n* **Host Variables**: COBOL programs must pair host variables with negative indicator variables (like `:WS-IND = -1`) to fetch or insert NULL values, preventing SQLCODE -305 errors.",
        code: "* Check for nulls in SQL:\nSELECT NAME FROM EMP WHERE MANAGER_ID IS NULL;\n\n* Prevent NULL runtime exceptions in COBOL:\nEXEC SQL\n    SELECT SALARY INTO :WS-SAL :WS-SAL-IND \n    FROM EMP WHERE EMPID = 1\nEND-EXEC.",
        tip: "Always check indicator variables immediately after SQL calls. If DB2 returns a NULL and you did not provide an indicator variable, your program will abend with SQLCODE -305.",
        quizOptions: [
            "NULL is equal to spaces in character fields.",
            "NULL represents unknown data; checks require 'IS NULL' syntax, and COBOL programs must use indicator variables to process NULL values and avoid SQLCODE -305 abends.",
            "NULL is represented as hex 00.",
            "NULL values cannot be stored in indexes."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cics_19",
        category: "CICS",
        level: "Intermediate",
        question: "What is CICS CEDF (Execution Diagnostic Facility) and how is it used?",
        answer: "**CEDF (Execution Diagnostic Facility)**, started by typing the transaction code **CEDF**, is CICS's built-in interactive debugger. It intercepts and monitors a transaction step-by-step during execution.\n\n* **Debugging Capabilities**:\n  - Intercepts CICS commands *before* they execute (allowing developers to view input parameter lists and modify variables in memory).\n  - Intercepts commands *after* they execute (allowing developers to view response codes like DFHRESP values and system registers).\n  - Displays diagnostic abend information upon task failures.",
        code: "* Start terminal debug:\n  Type: CEDF\n  Response: 'THIS TERMINAL IS NOW IN EDF MODE'\n  Type: ACCT (Runs transaction under debugger)",
        tip: "Use CEDF to trace execution paths in called subprograms and check for LENGERR or PGMIDERR errors during dynamic program links.",
        quizOptions: [
            "CEDF compiles assembler screen macros.",
            "CEDF is CICS's interactive debugger that intercepts CICS commands before and after execution, allowing developers to inspect variables, response codes, and abends in real time.",
            "CEDF backups CICS datasets to tape.",
            "CEDF is transaction security database."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "sql_19",
        category: "SQL",
        level: "Expert",
        question: "Explain DB2 SQL recursive join queries using Common Table Expressions.",
        answer: "Hierarchical or tree relationships (such as organizational hierarchies or bill-of-materials trees) are queried in DB2 using a **Recursive CTE** (defined with the `WITH` clause):\n\n* **Anchor query**: Fetches the root node (e.g. employee with no manager).\n* **Recursive query**: Joins the base CTE back to the physical table to locate child rows, updating levels dynamically. The query ends automatically when no child records are matched.",
        code: "WITH EMP_TREE (EMP_ID, NAME, LEVEL) AS (\n    * Anchor query (Top level manager)\n    SELECT EMP_ID, FIRST_NAME, 1 FROM EMPLOYEES WHERE MANAGER_ID IS NULL\n    UNION ALL\n    * Recursive join (Retrieve reporting employees)\n    SELECT E.EMP_ID, E.FIRST_NAME, T.LEVEL + 1 \n    FROM EMPLOYEES E \n    INNER JOIN EMP_TREE T ON E.MANAGER_ID = T.EMP_ID\n)\nSELECT * FROM EMP_TREE ORDER BY LEVEL, FIRST_NAME;",
        tip: "Ensure your recursive join condition is correct to prevent infinite loops when traversing tables containing circular references.",
        quizOptions: [
            "By nesting SELECT statements inside loops.",
            "Using a recursive CTE (WITH keyword) combining an Anchor query and a self-referencing subquery joined via UNION ALL.",
            "By writing a loop statement in JCL.",
            "Hierarchical traversals are not supported in SQL."
        ],
        quizAnswerIndex: 1
    },
    // ==================== NEW JCL ARCHITECT QUESTIONS ====================
    {
        id: "jcl_arch_01",
        category: "JCL",
        level: "Expert",
        question: "What causes an S0C4 abend in a JCL execution step, how is it debugged, and how does the REGION parameter relate to memory abends?",
        answer: "An S0C4 abend is a protection exception occurring when a program attempts to access a storage area to which it does not have access permissions. Common causes include:\n\n* **Uninitialized pointers**: Trying to read or write to a memory address that hasn't been allocated or initialized.\n* **Array index out of bounds**: Scanning beyond the boundaries of a table or storage area (e.g. index variable exceeding OCCURS limit).\n* **Parameter mismatches**: Passing mismatched variables or length structures between calling programs and subprograms.\n\nThe JCL **REGION** parameter controls virtual memory size (e.g. REGION=64M or REGION=0M). While setting a low REGION causes S878 (out of region) or S822 abends, it does not cause S0C4 abends, which are logical addressing violations.",
        code: "* COBOL program causing S0C4:\nLINKAGE SECTION.\n01 LS-RECORD PIC X(100).\nPROCEDURE DIVISION.\n    * Mover fails if caller passed a shorter or null pointer address:\n    MOVE \"DATA\" TO LS-RECORD.",
        tip: "In modern hybrid environments, use IBM File Manager or system memory dumps to trace memory alignment. Ensure variables in the Linkage Section match the parent program's argument definitions exactly.",
        quizOptions: [
            "A S0C4 is caused by setting JCL REGION=0M.",
            "An S0C4 is a protection exception caused by invalid memory addressing or pointer misalignment, unrelated to REGION limits.",
            "A S0C4 occurs only when VSAM files are opened in wrong access mode.",
            "A S0C4 indicates that a batch job has timed out."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_02",
        category: "JCL",
        level: "Intermediate",
        question: "How does the COND parameter on the JOB and EXEC cards perform conditional step execution, and what is its evaluation logic?",
        answer: "The **COND** parameter evaluates return codes from previous steps. If a condition evaluates to **TRUE**, the corresponding step is **BYPASSED** (not executed). This is inverted compared to typical programming logic:\n\n* **Syntax**: `COND=(code, operator)` or `COND=((code, operator, stepname), ...)`\n* **Operators**: EQ (Equal), NE (Not Equal), GT (Greater Than), LT (Less Than), GE (Greater or Equal), LE (Less or Equal).\n* **Evaluation**: If you specify `COND=(4, LT)`, the test is: 'Is 4 Less Than the return code of any previous step?' If yes, the step is bypassed.\n* **JOB vs EXEC**: Job-level COND bypasses all remaining steps if evaluated to TRUE; step-level COND bypasses that specific step.",
        code: "//STEP2    EXEC PGM=REPTGEN,COND=(4,LT)\n* Bypasses STEP2 if any previous step returned a code greater than 4\n* Test: Is 4 < Previous Return Code? If so, bypass.",
        tip: "Migrate legacy JCL steps to the modern IF-THEN-ELSE execution structures. They support readable boolean conditions (AND/OR) and are much easier to debug.",
        quizOptions: [
            "If a COND parameter evaluates to TRUE, the step runs.",
            "If a COND parameter evaluates to TRUE, the step is bypassed. It tests return codes of prior steps with inverted execution rules.",
            "COND specifies the maximum CPU execution time allowed for the step.",
            "COND checks dataset allocation parameters on SMS disk systems."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_03",
        category: "JCL",
        level: "Intermediate",
        question: "Explain how JCL handles Generation Data Group (GDG) allocation, specifically how relative offsets like (+1) are resolved during step execution and failure.",
        answer: "Generation Data Groups (GDGs) allow storing consecutive versions of a dataset under a base name. Relative generation numbers are resolved as follows:\n\n* **Execution Lifecycle**: An offset (+1) represents a new generation. During a multi-step job run, a (+1) allocated in Step 1 remains (+1) for all subsequent steps of the same execution. It is only resolved to a physical absolute generation (GxxxxV00) and cataloged upon successful job termination.\n* **Job Failure**: If the job abends, the cataloging of (+1) depends on the disposition. If DISP=(NEW,CATLG,DELETE) is defined, the generation is deleted, preventing duplicate catalog records.",
        code: "//STEP1    EXEC PGM=WRITER\n//OUTDD    DD DSN=PROD.EMP.GDG(+1),DISP=(NEW,CATLG,DELETE),\n//            SPACE=(TRK,(10,5),RLSE),UNIT=SYSDA",
        tip: "When designing restartable jobs, ensure that abended jobs delete incomplete (+1) datasets before restarting, otherwise a duplicate file error occurs on rerun.",
        quizOptions: [
            "Relative offset (+1) represents the previous version of the dataset.",
            "Relative offset (+1) allocates a new generation which remains (+1) throughout the job execution and is cataloged as a physical version upon successful job end.",
            "Relative offsets are only supported on tape systems.",
            "Relative generations are converted to absolute generations dynamically inside the COBOL program."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_04",
        category: "JCL",
        level: "Beginner",
        question: "Explain the three parameters of the DISP statement: DISP=(status, normal-disp, abnormal-disp). What are the default values if omitted?",
        answer: "The **DISP** parameter defines the dataset's initial state, and what the system should do with it on successful or failed completion:\n\n1. **Status**: NEW (create file), OLD (exclusive access), SHR (shared access), MOD (append records or create if not found).\n2. **Normal-disp**: ACTION if the step succeeds (KEEP, CATLG, UNCATLG, DELETE, PASS).\n3. **Abnormal-disp**: ACTION if the step abends (KEEP, CATLG, UNCATLG, DELETE).\n\n* **Defaults**: If omitted entirely, it defaults to `(NEW,KEEP,KEEP)` for new files, or assumes current catalog values. Standard practice is to always define all three parameters to prevent file locking issues.",
        code: "//DATAIN   DD DSN=PROD.MASTER.FILE,DISP=(SHR,KEEP,KEEP)\n//DATAOUT  DD DSN=PROD.NEW.FILE,DISP=(NEW,CATLG,DELETE),\n//            SPACE=(CYL,(5,5)),UNIT=SYSDA",
        tip: "Avoid using DISP=PASS in modern systems as it depends on virtual storage catalog pools which can cause 'dataset not passed' JCL execution errors.",
        quizOptions: [
            "DISP indicates which output printer destination is selected.",
            "DISP defines dataset status (NEW/OLD/SHR/MOD), normal end disposition, and abnormal abend disposition to manage system catalogs.",
            "The default value of DISP is (SHR,DELETE,DELETE).",
            "DISP specifies file compression layouts."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_05",
        category: "JCL",
        level: "Expert",
        question: "How do you tune DFSORT or SYNCSORT execution steps to optimize memory usage and minimize I/O overhead?",
        answer: "Optimize sorting steps by maximizing memory allocations and managing workspace allocations:\n\n* **In-Memory Sorting**: Allocate enough JCL REGION (e.g. REGION=0M or REGION=64M) and sorting size (`OPTION SIZE=MAX`) so DFSORT sorts entirely in memory (memory sort), avoiding disk writes.\n* **Workspace Allocation**: Define sorting workspaces dynamically using `DYNSPC` or `DYNAREQ` variables instead of coding manual `SORTWK01` to `SORTWK06` DD statements. This allows DFSORT to calculate exact workspace sizes dynamically.\n* **zHPF Integration**: Enable High Performance FICON (zHPF) I/O processing to accelerate sorting speed.",
        code: "//SORTSTEP EXEC PGM=SORT,REGION=0M\n//SYSOUT   DD SYSOUT=*\n//SYSIN    DD *\n  OPTION SIZE=MAX,DYNSPC=256\n  SORT FIELDS=(1,10,CH,A)\n/*",
        tip: "DFSORT performs optimally when block sizes are system-determined (SDB). Avoid specifying fixed block sizes on temporary sort work files.",
        quizOptions: [
            "By setting REGION to a small value like 256K to save memory.",
            "By enabling in-memory sorting (SIZE=MAX, large REGION) and dynamic workspace allocations (DYNSPC) to eliminate physical work file disk bottlenecks.",
            "By running sorting steps sequentially in single threads.",
            "By compiling sorting routines dynamically inside COBOL."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_06",
        category: "JCL",
        level: "Beginner",
        question: "What are the common pitfalls of using the IEFBR14 utility in JCL, and how does the DISP parameter resolve file deletion issues?",
        answer: "IEFBR14 is a dummy assembler program that immediately returns execution control by branching to register 14. It is commonly used to allocate or delete datasets using the DISP parameter. Common pitfalls include:\n\n* **File Not Found on Delete**: Using `DISP=(OLD,DELETE)` on a dataset that does not exist causes a JCL execution error.\n* **Resolution**: Use `DISP=(MOD,DELETE)`. If the dataset does not exist, MOD creates it, and normal-disp (DELETE) deletes it. If it does exist, MOD accesses it and deletes it, preventing JCL errors.",
        code: "//DELETE   EXEC PGM=IEFBR14\n//OLDDD    DD DSN=PROD.TEMP.FILE,DISP=(MOD,DELETE,DELETE)\n* Safe allocation check: deletes the file whether it exists or not",
        tip: "In modern CI/CD batch frameworks, use IDCAMS DELETE commands. IDCAMS provides return code overrides (like SET MAXCC) which prevent pipeline job execution crashes.",
        quizOptions: [
            "IEFBR14 runs file search loops.",
            "IEFBR14 is a dummy utility; using DISP=(MOD,DELETE) is a standard practice to delete a file safely without raising a 'dataset not found' JCL error.",
            "IEFBR14 is used only for sorting database records.",
            "IEFBR14 compiles COBOL divisions."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_07",
        category: "JCL",
        level: "Expert",
        question: "What is the physical difference between SB37, SD37, and SE37 space abends, and how are they resolved?",
        answer: "These abends occur when the system cannot allocate or write more space to a dataset:\n\n* **SB37**: The dataset has reached the maximum of 16 extents on a single disk volume, and no secondary volumes are defined, even if disk space remains.\n* **SD37**: Physical storage on the current volume is completely full, and the system cannot locate secondary spaces.\n* **SE37**: The partitioned dataset (PDS) directory has run out of directory blocks, preventing new member creation, even if data space is available.\n\n* **Resolution**: Adjust the secondary allocations in the JCL SPACE parameter, compress PDS libraries using IEBCOPY, or allocate as a Partitioned Dataset Extended (PDSE).",
        code: "//NEWFILE  DD DSN=PROD.DATA.FILE,DISP=(NEW,CATLG),\n//            SPACE=(CYL,(50,20),RLSE),UNIT=SYSDA,VOL=(,,,5)\n* Secondary allocations + multi-volume (up to 5 volumes) prevents x37 abends",
        tip: "Standardize on Partitioned Dataset Extended (PDSE) formats for library allocations. PDSE manages directory blocks dynamically, eliminating SE37 abends.",
        quizOptions: [
            "SB37 indicates a compiler syntax error, while SD37 indicates file format mismatch.",
            "SB37 is a 16-extent limit abend; SD37 represents physical volume out-of-space; SE37 indicates PDS directory block exhaustion.",
            "They represent file access violation levels in security structures.",
            "They are time-out abends resolved by increasing regional CPU timers."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_08",
        category: "JCL",
        level: "Beginner",
        question: "Explain STEPLIB vs JOBLIB precedence. How does the system search for load modules when both are defined?",
        answer: "Both parameters specify search libraries (PDS/PDSE) containing compiled program load modules:\n\n* **JOBLIB**: Placed immediately after the JOB card, it applies to all steps within the job.\n* **STEPLIB**: Declared inside a specific EXEC step, it applies only to that step.\n* **Precedence & Lookup Order**: If a step has a STEPLIB, it completely overrides JOBLIB for that step. The search order for modules is:\n  1. Libraries defined in **STEPLIB** (if present).\n  2. Libraries defined in **JOBLIB** (if no STEPLIB in step).\n  3. Link Pack Area (**LPA**).\n  4. System Link List (**LNKLST**, e.g., SYS1.LINKLIB).",
        code: "//MYJOB    JOB (1234),CLASS=A\n//JOBLIB   DD DSN=PROD.LOADLIB,DISP=SHR\n//STEP1    EXEC PGM=MYPROG\n//STEPLIB  DD DSN=TEST.LOADLIB,DISP=SHR  * Overrides PROD.LOADLIB for STEP1",
        tip: "During pipeline testing, use STEPLIB to point to your testing load libraries, ensuring that debug modules do not run in production catalogs.",
        quizOptions: [
            "STEPLIB runs only under JCL; JOBLIB runs under CICS regions.",
            "STEPLIB overrides JOBLIB for the specific step in which it is defined; the loader searches STEPLIB, then JOBLIB, then LPA, and finally LNKLST.",
            "JOBLIB always takes precedence over STEPLIB in all steps.",
            "They are used to define DB2 tablespace parameters."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_09",
        category: "JCL",
        level: "Intermediate",
        question: "How do you override symbolic parameters in cataloged procedures (PROCs), and what are the overrides' limitations?",
        answer: "Symbolic parameters (prefixed with an ampersand, like `&DIR`) are variables inside a PROC. You override them by specifying values on the EXEC card calling the PROC (e.g. `//STEP1 EXEC MYPROC,DIR='PROD.OUT'`).\n\n* **DD Card Overrides**: If you need to override a specific DD statement within a PROC, you specify the step name followed by the DD name (e.g. `//PROCSTEP.SYSIN DD DSN=...`). Overrides must follow the exact sequence of steps inside the PROC.",
        code: "* Overriding a PROC in JCL:\n//RUNPROC  EXEC MYPROC,VAR1='VAL1'\n//STEP1.OUTDD DD DSN=TEST.OUT,DISP=SHR",
        tip: "Maintain a flat structure of JCL variables. In automated CI/CD pipelines, use INCLUDE statements to import configuration variables rather than using nested PROC overrides.",
        quizOptions: [
            "Symbolic variables cannot be overridden once declared in a PROC.",
            "Symbolics are overridden on the EXEC statement, while DD cards inside a PROC are overridden by referencing the step name and DD name in execution order.",
            "Overrides are configured inside the COBOL compile option files.",
            "Proc symbolics can only be overridden for tape allocation."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_10",
        category: "JCL",
        level: "Expert",
        question: "How are VSAM AMP parameters (specifically BUFND and BUFNI) used to tune I/O performance in JCL?",
        answer: "The **AMP** parameter on a JCL DD statement overrides default VSAM buffering options at runtime without changing the program code:\n\n* **BUFND (Data Buffers)**: Specifies the number of buffers for the data component. For **sequential processing** (e.g., batch reads), set BUFND high (e.g., BUFND=12) to enable multi-track read-ahead operations.\n* **BUFNI (Index Buffers)**: Specifies the number of buffers for the index component. For **random processing** (e.g., transactional key lookups), set BUFNI high (e.g., BUFNI=6) to cache VSAM index structures in memory, avoiding disk index seek times.",
        code: "//VSAMDD   DD DSN=PROD.KSDS.FILE,DISP=SHR,\n//            AMP=('BUFND=10','BUFNI=5')",
        tip: "For modern DFSMS-managed volumes, enable VSAM SMB (System Managed Buffering) in the storage class to let MVS adjust buffers dynamically at runtime.",
        quizOptions: [
            "AMP parameters are used to specify database SQL usernames.",
            "BUFND tunes data buffers (increase for sequential processing); BUFNI tunes index buffers (increase for random access lookups) to bypass disk seeks.",
            "BUFND is for DB2 columns; BUFNI is for CICS screens.",
            "They are compiled options set inside COBOL PROCEDURE divisions."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_11",
        category: "JCL",
        level: "Beginner",
        question: "Explain the life cycle and scope of temporary datasets in JCL (denoted by &&NAME).",
        answer: "Temporary datasets (prefixed with double ampersands, like `&&TEMP`) are created and used within a single job execution. They are automatically deleted at job termination:\n\n* **Scope**: Valid only within the job that allocated them. Other concurrent jobs cannot access them.\n* **Life Cycle**: Typically allocated with `DISP=(NEW,PASS)` in a step, passed to subsequent steps, and deleted in the final consumer step using `DISP=(OLD,DELETE)`.",
        code: "//STEP1    EXEC PGM=EXTRACT\n//TEMPFILE DD DSN=&&EXTR,DISP=(NEW,PASS),SPACE=(CYL,(5,5)),UNIT=SYSDA\n//STEP2    EXEC PGM=REPTGEN\n//INPUTDD  DD DSN=&&EXTR,DISP=(OLD,DELETE)",
        tip: "For high-performance batch applications, allocate temporary datasets to Virtual I/O (VIO) devices. VIO processes I/O operations directly in MVS paging memory, avoiding physical disk writes.",
        quizOptions: [
            "Temporary datasets exist indefinitely until manually deleted by a DBA.",
            "Temporary datasets (&&NAME) exist only for the life of the job and are deleted at completion. Bypassing physical disk writing via VIO optimizes I/O.",
            "They are used to backup database catalogs.",
            "They represent file structures shared across systems in a cluster."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_12",
        category: "JCL",
        level: "Intermediate",
        question: "What is the PARM parameter in JCL, and what are its physical limitations when passing arguments to COBOL programs?",
        answer: "The **PARM** parameter passes configuration parameters to a program from the EXEC step (e.g., `PARM='PROD,DATE,10'`).\n\n* **Limitations**: The PARM string length is strictly capped at **100 characters**.\n* **Program Interface**: In COBOL, this data is received in the **LINKAGE SECTION** of the main program. The first parameter declared in the `PROCEDURE DIVISION USING` clause must represent a 2-byte binary length field (`PIC S9(4) COMP`) followed by the character data matching the PARM length.",
        code: "LINKAGE SECTION.\n01  LK-PARM-DATA.\n    05  LK-PARM-LEN   PIC S9(4) COMP.\n    05  LK-PARM-VAL   PIC X(100).\nPROCEDURE DIVISION USING LK-PARM-DATA.",
        tip: "If you need to pass parameters longer than 100 characters in modern hybrid applications, write the values to a SYSIN DD card and read them as sequential files.",
        quizOptions: [
            "PARM allows passing unlimited text parameters directly to COBOL.",
            "PARM passes runtime arguments up to 100 characters, which must be received in the COBOL Linkage Section with a leading 2-byte length variable.",
            "PARM is used to configure regional database security clearances.",
            "PARM is only valid for compiler utilities like DFSORT."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_13",
        category: "JCL",
        level: "Intermediate",
        question: "What is the architectural purpose of DD DUMMY in JCL, and how does it affect program operations?",
        answer: "The **DD DUMMY** statement directs I/O operations to a null device, bypassing physical dataset access:\n\n* **Reads**: When a program reads a dummy DD card, the system immediately returns an End-of-File (EOF) status (File Status 10 in COBOL).\n* **Writes**: When a program writes to a dummy DD card, MVS discards the records without writing them to disk.\n* **Utility**: Great for testing programs without allocating files, or for bypassing optional reporting/logging steps in production.",
        code: "//REPTDD   DD DUMMY,DCB=(RECFM=FB,LRECL=80,BLKSIZE=800)\n* Program writes to REPTDD are discarded automatically",
        tip: "When dummying VSAM or sequential files in COBOL, ensure you specify essential DCB parameters (like LRECL and RECFM) on the dummy DD card to prevent open failures.",
        quizOptions: [
            "DD DUMMY deletes all database catalog mappings.",
            "DD DUMMY redirects program I/O to a null device, immediately returning EOF on reads and discarding writes, allowing testing without code changes.",
            "DD DUMMY is an obsolete command that must not be used in production.",
            "DD DUMMY is used only to create backup tape headers."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_14",
        category: "JCL",
        level: "Beginner",
        question: "Compare the legacy JCL COND parameter with the modern IF-THEN-ELSE execution structure.",
        answer: "Both structures control execution flow based on return codes, but they differ in syntax and readability:\n\n* **COND Parameter**: Legacy syntax using numeric relational tests (e.g. `COND=(8,LE)`). Bypasses steps when conditions evaluate to TRUE, which is counterintuitive.\n* **IF-THEN-ELSE**: Modern structure with standard logic. Steps within the block execute only when conditions are TRUE (e.g. `IF (STEP1.RC = 0) THEN`). Supports logical operators (AND/OR/NOT).",
        code: "//IFTEST   IF (STEP1.RC = 0 AND STEP2.RC < 8) THEN\n//STEP3    EXEC PGM=PROCESS\n//ELSE     IF\n//STEP4    EXEC PGM=ROLLBACK\n//ENDIF",
        tip: "Always standardize on IF-THEN-ELSE structures. They make JCL code easier to maintain and lint in Git repositories.",
        quizOptions: [
            "COND parameter is faster to execute than IF-THEN-ELSE.",
            "IF-THEN-ELSE uses standard boolean logic and is highly readable, replacing the legacy COND parameter which bypassed steps when evaluated to TRUE.",
            "IF-THEN-ELSE is only supported in JCL compiler steps.",
            "They are identical and can be combined on the same statement."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_15",
        category: "JCL",
        level: "Intermediate",
        question: "Explain System Managed Storage (SMS) parameters (STORCLAS, DATACLAS, MGMTCLAS) and how they replace traditional JCL properties.",
        answer: "SMS parameters delegate storage allocation details to z/OS storage rules:\n\n* **STORCLAS (Storage Class)**: Defines performance requirements (replacing UNIT and VOL parameters).\n* **DATACLAS (Data Class)**: Specifies dataset attributes like record format, LRECL, and space (replacing SPACE and DCB parameters).\n* **MGMTCLAS (Management Class)**: Handles backup, retention, and migration schedules (replacing volume retention dates).\n\nThis abstraction allows storage administrators to move files between physical storage arrays without requiring changes to JCL code.",
        code: "//ALLOC    DD DSN=PROD.SMS.FILE,DISP=(NEW,CATLG),\n//            DATACLAS=DCSQ80,STORCLAS=FASTDISK\n* DCB and unit parameters are assigned dynamically by SMS",
        tip: "Use SMS parameters to simplify JCL. This allows back-end systems to migrate datasets to virtual tape or cloud object storage automatically based on MGMTCLAS rules.",
        quizOptions: [
            "SMS parameters specify JCL compiler optimization levels.",
            "STORCLAS, DATACLAS, and MGMTCLAS abstract storage settings, allowing the z/OS system to manage file attributes, device mounts, and backup policies dynamically.",
            "SMS parameters are used to execute database transactions.",
            "SMS parameters cannot be used on sequential datasets."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_16",
        category: "JCL",
        level: "Intermediate",
        question: "What JCL parameters are required to read a multi-volume dataset stored on tape libraries?",
        answer: "To read a multi-volume dataset (a file that spans across multiple tapes), you must configure:\n\n* **UNIT**: Specifies the tape unit type (e.g., UNIT=TAPE or UNIT=SYSDA).\n* **VOL=SER**: Lists the volume serial numbers in order (e.g. `VOL=SER=(T00101,T00102)`).\n* **LABEL**: Declares tape label type and file sequence number (e.g. `LABEL=(1,SL)`).\n* **volume count override**: If there are more volumes than physical tape drives, the system will swap tapes dynamically.",
        code: "//TAPEIN   DD DSN=PROD.ARCH.DATA,DISP=OLD,\n//            UNIT=TAPE,VOL=SER=(T001,T002),LABEL=(1,SL)\n* MVS prompts console operators to mount T002 when T001 reaches EOF",
        tip: "In modern datacenters, physical tapes are replaced by Virtual Tape Libraries (VTL). VTL writes tape images directly to RAID disk systems to accelerate processing.",
        quizOptions: [
            "Tapes are read automatically without specifying volume serials.",
            "Reading multi-volume tape datasets requires specifying UNIT=TAPE, the sequence list of serials in VOL=SER, and the tape label type (LABEL).",
            "Multi-volume files can only be accessed using VSAM clusters.",
            "You must split the file into single steps to read each volume separately."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_17",
        category: "JCL",
        level: "Expert",
        question: "What are the structural differences in JCL execution handling between JES2 and JES3 subsystems?",
        answer: "JES2 and JES3 are Job Entry Subsystems that receive, schedule, and route jobs in a mainframe sysplex:\n\n* **JES2**: Decentralized scheduling. Each system in the sysplex executes jobs from its local queues based on priority and job class.\n* **JES3**: Centralized scheduling. A master global system evaluates resource requirements (disks, tapes, volumes) *before* jobs start, allocating devices upfront and avoiding runtime allocation waits.\n\nIBM has standardized modern systems on JES2, deprecating JES3.",
        code: "//*JES3 Statement (Centralized control - obsolete):\n//*MAIN LINES=(10,WARNING)\n\n//JES2 Statement (Decentralized command - active):\n/*JOBPARM PROCLIB=PROC01",
        tip: "Ensure your JCL scripts do not use JES3 statements (like `//*MAIN`). Update batch definitions to standard JES2 parameters to ensure compatibility with modern z/OS versions.",
        quizOptions: [
            "JES2 is for COBOL compilation; JES3 is for PL/I.",
            "JES2 performs decentralized scheduling from queues; JES3 managed resource scheduling centrally before execution (deprecated by IBM).",
            "JES3 runs only on physical tape arrays.",
            "JES2 and JES3 are obsolete systems replaced by Linux bash scripts."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_18",
        category: "JCL",
        level: "Beginner",
        question: "How do you compress a Partitioned Dataset (PDS) in JCL to release unused space and recover directory blocks?",
        answer: "Partitioned Datasets (PDS) allocate space for members. When a member is updated or deleted, the space it occupied becomes unusable ('gas'). You must compress the PDS using the **IEBCOPY** utility to recover this space:\n\n* **Syntax**: Set the input (SYSUT1) and output (SYSUT2) DD statements to point to the **same** dataset name, and specify the COPY statement.",
        code: "//COMPRESS EXEC PGM=IEBCOPY\n//SYSUT1   DD DSN=PROD.COB.SOURCE,DISP=SHR\n//SYSUT2   DD DSN=PROD.COB.SOURCE,DISP=SHR\n//SYSIN    DD *\n  COPY OUTDD=SYSUT2,INDD=SYSUT1\n/*",
        tip: "For modern libraries, use Partitioned Dataset Extended (PDSE). PDSE automatically reclaims deleted space and directory blocks dynamically, removing the need for IEBCOPY compress steps.",
        quizOptions: [
            "PDS libraries are compressed by deleting files manually.",
            "PDS space is reclaimed using IEBCOPY with both SYSUT1 and SYSUT2 DD cards pointing to the same dataset name.",
            "IEBCOPY can only compress sequential files.",
            "PDS compression runs automatically during COBOL compilation."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_19",
        category: "JCL",
        level: "Intermediate",
        question: "How do you implement the RESTART parameter in a JCL JOB card to resume execution from a failed step?",
        answer: "The **RESTART** parameter on the JOB card bypasses previous successful steps and restarts execution from a designated step:\n\n* **Syntax**: `RESTART=stepname` or `RESTART=stepname.procstepname` for steps nested inside a PROC.\n* **Handling NEW Datasets**: If a failed step allocated a dataset with `DISP=(NEW,CATLG)`, you must delete or change the disposition to `OLD` before restarting to prevent 'duplicate dataset' JCL errors.",
        code: "//MYJOB    JOB (ACCT),RESTART=STEP3\n//STEP1    EXEC PGM=PROG1 * Bypassed\n//STEP2    EXEC PGM=PROG2 * Bypassed\n//STEP3    EXEC PGM=PROG3 * Execution resumes here",
        tip: "Design your batch chains to delete target outputs in an IEFBR14 step before allocation, making steps cleanly rerun-safe without manual catalog edits.",
        quizOptions: [
            "RESTART automatically rolls back all database database records.",
            "RESTART=stepname bypasses prior steps and resumes execution from the specified step; output datasets from failed runs must be managed to avoid catalog errors.",
            "RESTART is defined within the COBOL Environment Division.",
            "RESTART is only supported in CICS transaction processing."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "jcl_arch_20",
        category: "JCL",
        level: "Expert",
        question: "Explain the TIME parameter in JCL, its syntax, and how to debug a resulting S322 abend.",
        answer: "The **TIME** parameter specifies the maximum CPU execution time allowed for a job or step. An **S322** abend occurs when execution time exceeds this limit:\n\n* **Syntax**: `TIME=(minutes, seconds)` or `TIME=1440` (disables timer limits, allowing unlimited CPU time).\n* **Debugging S322**: Check for infinite loops in the application code, unresolved VSAM database lock contentions, or lack of indexing causing tablespace scan bottlenecks.",
        code: "//STEP1    EXEC PGM=REPORT,TIME=(5,30)\n* Step will abend with S322 if CPU execution exceeds 5 minutes and 30 seconds",
        tip: "Never set TIME=1440 or TIME=NOLIMIT on general batch steps in production. Infinite timers can lock up shared sysplex queues if an infinite loop occurs.",
        quizOptions: [
            "S322 is a space abend resolved by allocating secondary extents.",
            "The TIME parameter sets CPU limits; exceeding it causes an S322 abend, indicating loops or database lock contentions.",
            "TIME=1440 restricts execution to exactly 1440 milliseconds.",
            "The TIME parameter sets execution times for tape mounts."
        ],
        quizAnswerIndex: 1
    },
    // ==================== NEW COBOL ARCHITECT QUESTIONS ====================
    {
        id: "cobol_arch_01",
        category: "COBOL",
        level: "Beginner",
        question: "Explain the physical memory layout of COMP-3 (Packed Decimal) fields in COBOL. How is the sign represented, and how do you calculate the byte size?",
        answer: "COMP-3 (Packed Decimal) stores numbers by putting two digits in each byte, saving memory compared to Zoned Decimal (PIC 9). The last half-byte (nibble) contains the sign:\n\n* **Sign nibbles**: Hex **C** (Positive), Hex **D** (Negative), Hex **F** (Unsigned).\n* **Formula**: `(Number of digits + 1) / 2` (rounded up to the next integer).\n* **Example**: `PIC S9(7) COMP-3` takes `(7 + 1) / 2 = 4` bytes. It stores 7 digits and the sign.",
        code: "* PIC S9(5) COMP-3 (Takes 3 bytes)\n* Memory representation of -12345 in Hex: |12|34|5D|\n* Digits: 1, 2, 3, 4, 5. Sign: D (Negative)",
        tip: "Always declare COMP-3 fields with an odd number of digits (e.g. S9(7) instead of S9(8)). An even number leaves the first nibble unused, which can trigger sign validation warnings.",
        quizOptions: [
            "COMP-3 stores one digit per byte and uses ASCII character codes.",
            "COMP-3 packs two digits per byte with the last nibble representing the sign (C=positive, D=negative, F=unsigned); byte size is (N+1)/2.",
            "COMP-3 variables occupy 8 bytes regardless of digits.",
            "COMP-3 stores binary values in base-2 directly."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_02",
        category: "COBOL",
        level: "Expert",
        question: "What causes an S0C7 Data Exception abend, how is it debugged, and how does the NUMPROC compiler option affect it?",
        answer: "An **S0C7** abend is a data exception occurring when an arithmetic operation is performed on a variable containing invalid data (e.g. spaces or alphanumeric characters in a COMP-3 or zoned decimal field):\n\n* **Causes**: Moving alphanumeric spaces/low-values to numeric fields, or reading unvalidated interface files.\n* **Debugging**: Inspect the abend address offset in the dump, check the compiler map (LIST output) to identify the variable, and view variables using tools like IBM File Manager.\n* **NUMPROC option**: NUMPROC(PFD) assumes standard signs, saving CPU cycles but raising abends on bad signs. NUMPROC(NOPFD) generates sign correction code at runtime, preventing abends but increasing overhead.",
        code: "01 WS-NUMERIC   PIC 9(5) COMP-3.\n* Moving spaces to numeric field causes S0C7 on addition:\nMOVE SPACES TO WS-NUMERIC\nADD 1 TO WS-NUMERIC. * S0C7 ABEND occurs here!",
        tip: "Sanitize external inputs using the 'NUMERIC' class test or 'FUNCTION NUMVAL' before transferring data to arithmetic fields, ensuring production runs are abend-safe.",
        quizOptions: [
            "An S0C7 is caused by dividing a number by zero.",
            "An S0C7 abend is a data exception caused by performing math on invalid data; NUMPROC(PFD) optimizes speed by assuming valid sign structures.",
            "An S0C7 represents system CPU timer limits being exceeded.",
            "S0C7 is fixed by increasing the JCL REGION parameters."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_03",
        category: "COBOL",
        level: "Intermediate",
        question: "Compare the performance, requirements, and execution differences between SEARCH and SEARCH ALL in COBOL table handling.",
        answer: "Both statements search tables (arrays) defined with the `OCCURS` clause, but they differ in search logic and sorting requirements:\n\n* **SEARCH**: Sequential linear scan. It starts from the current index value. Does not require sorted data. The programmer must initialize the index using the `SET` statement.\n* **SEARCH ALL**: Binary search. It requires the table to be sorted and defined with the `ASCENDING/DESCENDING KEY` clause. It automatically sets the index to the midpoint to split search spaces. Runs in O(log N) time, making it efficient for large datasets.",
        code: "01 WS-TABLE.\n   05 WS-ITEMS OCCURS 100 TIMES\n                ASCENDING KEY IS WS-KEY\n                INDEXED BY WS-IDX.\n      10 WS-KEY PIC 9(4).\n* SEARCH ALL binary search:\nSEARCH ALL WS-ITEMS\n    WHEN WS-KEY(WS-IDX) = 2026\n        DISPLAY 'FOUND!'",
        tip: "Use SEARCH ALL for tables with more than 50 elements. Ensure the keys are sorted; if keys are out of order, SEARCH ALL will fail to locate records without raising errors.",
        quizOptions: [
            "SEARCH ALL is for database lookups; SEARCH is for internal memory arrays.",
            "SEARCH performs a linear scan (requires manual index initialization); SEARCH ALL performs a binary search (requires ASCENDING/DESCENDING sorted keys).",
            "SEARCH is faster than SEARCH ALL on large arrays.",
            "SEARCH ALL requires level 88 variables to execute."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_04",
        category: "COBOL",
        level: "Intermediate",
        question: "Explain the differences between passing parameters BY REFERENCE, BY CONTENT, and BY VALUE in a COBOL CALL statement.",
        answer: "These keywords determine how arguments are passed to subprograms in the `CALL` statement:\n\n* **BY REFERENCE**: Passes the physical memory address of the variable. The calling program and subprogram share the same memory. Changes in the subprogram modify the caller's variable.\n* **BY CONTENT**: Passes a copy of the variable's value. The subprogram cannot modify the original variable's memory.\n* **BY VALUE**: Passes the value directly on the call stack (common in C/C++ integrations).",
        code: "* Pass configuration parameters safely:\nCALL 'SUBPROG' USING BY REFERENCE WS-SHARED-DB\n                     BY CONTENT   WS-CONFIG-FLAG.",
        tip: "Standardize on BY CONTENT when passing configuration flags or lookup keys to subprograms to protect parent program memory.",
        quizOptions: [
            "BY VALUE is the default parameter passing method in COBOL.",
            "BY REFERENCE shares memory addresses (modifies caller); BY CONTENT passes value copies (protects caller); BY VALUE passes arguments directly on the stack.",
            "BY CONTENT is only supported in CICS transaction linking.",
            "They are identical in memory allocation."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_05",
        category: "COBOL",
        level: "Beginner",
        question: "How does the INITIALIZE statement function? What are its default behaviors for numeric, alphanumeric, and FILLER fields?",
        answer: "The **INITIALIZE** statement sets fields to default values based on their category:\n\n* **Alphanumeric fields**: Set to SPACES.\n* **Numeric / Numeric-edited fields**: Set to ZEROES.\n* **Exclusions**: By default, FILLER fields, index names, and variables with REDEFINES clauses are **bypassed**.\n* **REPLACING**: You can override defaults using the `REPLACING` phrase to initialize variables to custom defaults.",
        code: "01 WS-RECORD.\n   05 WS-ID      PIC 9(5) VALUE 99999.\n   05 WS-NAME    PIC X(10) VALUE 'INIT'.\n* Initialize sets WS-ID to 0 and WS-NAME to spaces:\nINITIALIZE WS-RECORD.",
        tip: "Use INITIALIZE to clear record layouts before processing the next loop iteration. This avoids manual MOVE loops and optimizes memory layout clearing.",
        quizOptions: [
            "INITIALIZE deletes variables from memory completely.",
            "INITIALIZE sets alphanumeric fields to spaces and numeric fields to zeroes, bypassing FILLER and REDEFINES variables by default.",
            "INITIALIZE sets all variables to high-values.",
            "INITIALIZE is only valid in the Linkage Section."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_06",
        category: "COBOL",
        level: "Beginner",
        question: "What does File Status '35' mean during a file OPEN operation, and how should it be managed?",
        answer: "File Status **35** indicates that the dataset specified in the JCL DD statement (matching the SELECT ASSIGN clause) is missing or cannot be found.\n\n* **Handling**: If the file is mandatory, the program will terminate. If the file is optional, specify **SELECT OPTIONAL** in the file-control block. When opened, if the file is missing, the system returns File Status **05** instead of crashing with 35, allowing the program to continue.",
        code: "FILE-CONTROL.\n    SELECT OPTIONAL MASTER-FILE ASSIGN TO MASTDD\n    ORGANIZATION IS SEQUENTIAL\n    FILE STATUS IS WS-MAST-STAT.\n* If MASTDD is missing in JCL, OPEN returns status 05",
        tip: "Always use SELECT OPTIONAL for reference tables or optional inputs. This allows batch chains to run without dummying missing files.",
        quizOptions: [
            "File Status 35 represents record key duplicate violation.",
            "File Status 35 indicates that the target dataset is missing; using SELECT OPTIONAL changes the return status to 05, preventing execution abends.",
            "File Status 35 indicates that the tape volume is write-protected.",
            "It is a database timeout code."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_07",
        category: "COBOL",
        level: "Expert",
        question: "What are the structural differences between Static and Dynamic CALLs in COBOL?",
        answer: "The method of linking and loading subprograms differs:\n\n* **Static CALL**: Syntactically defined as `CALL 'SUBPROG'` (literal string). The BIND/link-edit process merges the subprogram's load module into the main program's executable. Fast execution, but increases size.\n* **Dynamic CALL**: Syntactically defined as `CALL WS-SUBPROG` (variable name). The system loads the subprogram load module from the STEPLIB/LNKLST library at runtime. Saves memory, but adds overhead.",
        code: "* Static call (resolved at link time):\nCALL 'DATEMOD' USING WS-DATE.\n\n* Dynamic call (resolved at runtime):\nMOVE 'DATEMOD' TO WS-MOD-NAME.\nCALL WS-MOD-NAME USING WS-DATE.",
        tip: "Use dynamic calls for subprograms that are shared across multiple modules. This allows updating subprograms without compiling the calling modules.",
        quizOptions: [
            "Static calls are resolved at runtime; dynamic calls are resolved at compilation.",
            "Static calls merge the subprogram module into the main executable at link time; dynamic calls load the subprogram from libraries at runtime.",
            "Dynamic calls require JCL PROC definitions.",
            "Static calls cannot accept parameters."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_08",
        category: "COBOL",
        level: "Intermediate",
        question: "Explain REDEFINES vs RENAMES. What are their use cases and syntactic rules?",
        answer: "Both clauses re-map memory locations, but they differ in structure and syntax:\n\n* **REDEFINES**: Overrides the storage allocation of an existing field. It allows accessing the same memory using different data structures. The redefining field must immediately follow the redefined field, and have the same level number.\n* **RENAMES (Level 66)**: Regroups existing elementary items into a new structure, potentially spanning multiple variables. It is declared at the end of the record description.",
        code: "01 WS-DATE-STR.\n   05 WS-YEAR    PIC 9(4).\n   05 WS-MONTH   PIC 9(2).\n01 WS-DATE-NUM REDEFINES WS-DATE-STR PIC 9(6).\n* Redefines maps a numeric field directly over the string layout",
        tip: "Use REDEFINES to parse inputs that contain varying formats. Avoid redefining variables to larger sizes to prevent memory corruption.",
        quizOptions: [
            "REDEFINES regroups fields; RENAMES changes variable data types.",
            "REDEFINES overlays the memory allocation of a field with a new structure; RENAMES (level 66) regroups multiple variables into a single record.",
            "They are identical and can be used interchangeably.",
            "REDEFINES is only valid in the Linkage Section."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_09",
        category: "COBOL",
        level: "Beginner",
        question: "What is the function of the REWRITE statement in COBOL, and what are its logical requirements?",
        answer: "The **REWRITE** statement updates an existing record in a file. Logical requirements include:\n\n* **File Open Mode**: The file must be opened in **I-O** (Input-Output) mode.\n* **Sequential Files**: A READ statement must precede the REWRITE statement. The system updates the last record read.\n* **Indexed / Relative Files**: A READ statement is not mandatory. The system updates the record matching the record key.",
        code: "* Update VSAM record key:\nOPEN I-O EMP-FILE.\nMOVE 1024 TO EMP-KEY.\nMOVE 'NEW NAME' TO EMP-NAME.\nREWRITE EMP-RECORD. * Updates row matching EMP-KEY",
        tip: "Always check the file status code after a REWRITE operation. If the record key is changed between the READ and REWRITE on indexed files, the write will fail with status 21.",
        quizOptions: [
            "REWRITE inserts a new record into a file.",
            "REWRITE updates an existing record; the file must be opened in I-O mode, and for sequential files, a READ statement must precede the REWRITE.",
            "REWRITE is only valid for tape files.",
            "REWRITE deletes records from physical storage."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_10",
        category: "COBOL",
        level: "Beginner",
        question: "How does the EVALUATE statement function? How does it handle multiple conditions compared to nested IFs?",
        answer: "The **EVALUATE** statement is COBOL's version of switch-case, supporting multi-branch conditional evaluations. It is cleaner and more readable than nested IF-ELSE structures:\n\n* **Capabilities**: Evaluates multiple variables in parallel using the `ALSO` keyword (e.g. `EVALUATE VAR1 ALSO VAR2`). Supports values, ranges (THEN), and boolean conditions.",
        code: "EVALUATE WS-AGE ALSO WS-STATUS\n    WHEN 18 THRU 65 ALSO 'ACTIVE'\n        PERFORM PROCESS-MEMBER\n    WHEN OTHER\n        PERFORM ROLLBACK\nEND-EVALUATE.",
        tip: "Use EVALUATE to implement business decision tables. This keeps conditional logic flat and matches transaction business rules, making code audits easier.",
        quizOptions: [
            "EVALUATE is a debugging utility in compile scripts.",
            "EVALUATE evaluates single or multiple variables (using ALSO) in a flat structure, replacing nested IF statements.",
            "EVALUATE can only test numeric ranges.",
            "EVALUATE executes subprograms dynamically."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_11",
        category: "COBOL",
        level: "Intermediate",
        question: "What are COBOL Intrinsic Functions, and how is FUNCTION NUMVAL-C used?",
        answer: "Intrinsic Functions are built-in compiler functions. They are prefixed with the keyword **FUNCTION**:\n\n* **FUNCTION NUMVAL-C**: Converts an alphanumeric string containing currency symbols, commas, and signs (e.g. '$1,234.56') into a numeric value (e.g. 1234.56), allowing math operations on formatted inputs.",
        code: "01 WS-CHAR-CURR PIC X(10) VALUE \"$1,250.00\".\n01 WS-NUM-VAL   PIC 9(5)V99 COMP-3.\n* Convert character string to numeric value:\nCOMPUTE WS-NUM-VAL = FUNCTION NUMVAL-C(WS-CHAR-CURR).",
        tip: "Use intrinsic functions like CURRENT-DATE to get timestamps including milliseconds, or upper/lower case helpers to sanitize input strings during integration.",
        quizOptions: [
            "NUMVAL-C is a security validation function.",
            "NUMVAL-C is an intrinsic function that converts formatted currency strings into numeric values for math operations.",
            "Intrinsic functions run only on database files.",
            "They are obsolete features replaced by level 88 flags."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_12",
        category: "COBOL",
        level: "Beginner",
        question: "How do Explicit Scope Terminators (e.g., END-IF, END-PERFORM) prevent logical errors?",
        answer: "Explicit scope terminators terminate a statement block, preventing the logic from dropping through to adjacent statements. In legacy COBOL, blocks were terminated strictly by a period (.), which was hard to see and prone to error.",
        code: "* Prevent logical nesting bugs:\nIF WS-TEST = 'Y'\n    MOVE 'OK' TO WS-OUT\n    PERFORM PROCESS-DATA\nEND-IF. * Terminated scope without period",
        tip: "Avoid using periods (.) to terminate logic blocks inside the PROCEDURE DIVISION. Instead, use explicit scope terminators and limit the use of periods to paragraph boundaries.",
        quizOptions: [
            "Explicit scope terminators are compile command line parameters.",
            "Scope terminators explicitly close statements, replacing the error-prone period (.) to prevent logical nesting errors.",
            "They are used to define file indexes.",
            "They restrict variable scope to specific paragraphs."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_13",
        category: "COBOL",
        level: "Intermediate",
        question: "Detail the loop execution pattern for retrieving database records using a DB2 Cursor in COBOL.",
        answer: "The pattern is: (1) DECLARE cursor statement, (2) OPEN cursor, (3) PERFORM a loop FETCHing records into host variables UNTIL SQLCODE = 100 (or SQLCODE < 0), and (4) CLOSE the cursor.",
        code: "EXEC SQL DECLARE C1 CURSOR FOR ... END-EXEC.\nEXEC SQL OPEN C1 END-EXEC.\nPERFORM FETCH-PARA UNTIL SQLCODE = 100.\nEXEC SQL CLOSE C1 END-EXEC.\n* Fetch paragraph:\nFETCH-PARA.\n    EXEC SQL FETCH C1 INTO :WS-EMP-ID :WS-EMP-NAME END-EXEC.",
        tip: "Always inspect SQLCODE after OPEN and FETCH. Close cursors in an AT END block to release locks and prevent thread resource exhaustion.",
        quizOptions: [
            "Cursors are managed dynamically by JCL step execution.",
            "Cursor processing requires DECLARE, OPEN, a FETCH loop (until SQLCODE = 100 or errors), and CLOSE statements.",
            "Cursors are used to backup database catalogs.",
            "A cursor fetches all records in a single execution."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_14",
        category: "COBOL",
        level: "Intermediate",
        question: "How do Indicator Variables prevent SQLCODE -305 errors when querying nullable DB2 columns?",
        answer: "An SQLCODE -305 occurs when an SQL query returns a NULL column value to a host variable that has no associated indicator variable. Pair a 2-byte binary integer (PIC S9(4) COMP) indicator variable with the host variable in the SELECT statement (e.g., SELECT COL INTO :VAR :IND-VAR).",
        code: "EXEC SQL\n    SELECT SALARY INTO :WS-SALARY :WS-SALARY-IND\n    FROM EMP WHERE EMPID = :WS-ID\nEND-EXEC.\nIF WS-SALARY-IND = -1\n    DISPLAY \"SALARY IS NULL (Avoided -305 abend)\".",
        tip: "Check the indicator variable value first. If it is -1, the column value is NULL. This prevents runtime crashes in transaction pipelines.",
        quizOptions: [
            "-305 indicates a duplicate key violation; fix by changing keys.",
            "-305 occurs when a NULL database value is retrieved without an indicator variable; resolve by declaring an S9(4) COMP variable and appending it to the host variable in the query.",
            "-305 indicates a cursor is already open; fix by closing the cursor first.",
            "-305 represents an invalid database connection."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_15",
        category: "COBOL",
        level: "Expert",
        question: "How does a COBOL program interface with CICS screens and pass data using COMMAREA?",
        answer: "The program reads data from the CICS Communication Area (COMMAREA) defined in the LINKAGE SECTION using the `EXEC CICS LINK` or `EXEC CICS RETURN` statements. The CICS transaction manager passes data between programs using this buffer.",
        code: "LINKAGE SECTION.\n01 DFHCOMMAREA.\n   05 LK-DATA    PIC X(100).\nPROCEDURE DIVISION.\n    IF EIBCALEN > 0 * Check if data passed\n        MOVE LK-DATA TO WS-INPUT.",
        tip: "Keep COMMAREA structures small (under 32KB) to save region memory. For larger structures, migrate to CICS Channels and Containers, which offer unlimited space.",
        quizOptions: [
            "CICS programs communicate using physical files only.",
            "COBOL programs map communication buffers in the Linkage Section via DFHCOMMAREA, allowing programs to receive data from CICS transactions.",
            "CICS screens are built as COBOL subprograms.",
            "COMMAREA is used only for JCL parameter mapping."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_16",
        category: "COBOL",
        level: "Expert",
        question: "What is the difference between COMP (Binary) and COMP-5 variables in COBOL?",
        answer: "COMP represents standard binary storage, allocating bytes based on the picture clause size. COMP-5 stores data in hardware-native formats (word, half-word), allowing variables to exceed the maximum value of their PIC clause up to physical byte capacity.",
        code: "01 WS-COMP    PIC 9(4) COMP.   * Max value: 9999\n01 WS-COMP-5  PIC 9(4) COMP-5. * Max value: 65535 (2 bytes limit)",
        tip: "Use COMP-5 when calling API routines written in C/C++ or interfacing with operating system variables, preventing truncation errors.",
        quizOptions: [
            "COMP stores strings; COMP-5 stores floats.",
            "COMP is standard binary storage capped by PIC bounds; COMP-5 is hardware-native binary storage that allows data values up to physical byte limits.",
            "COMP-5 is only supported for DB2 columns.",
            "They are identical and compiled to identical assembler layouts."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_17",
        category: "COBOL",
        level: "Beginner",
        question: "Explain how a PERFORM ... VARYING ... UNTIL loop evaluates its condition and increments loop indices.",
        answer: "The loop initializes the index, evaluates the UNTIL condition, and if FALSE, executes the designated paragraph. It then increments the index and repeats evaluation. The test occurs before paragraph execution.",
        code: "* Perform loop structure:\nPERFORM PROCESS-DATA VARYING WS-I FROM 1 BY 1 UNTIL WS-I > 10.",
        tip: "Ensure loop limits are correct. If the UNTIL condition evaluates to TRUE initially, the paragraph is never executed, which can cause uninitialized variable bugs.",
        quizOptions: [
            "The loop increments the index before evaluating the condition.",
            "The loop initializes the index, evaluates the UNTIL condition before each run, executes the paragraph if false, and increments the index.",
            "The loop runs at least once regardless of the condition status.",
            "Indexes must be modified manually inside the paragraph."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_18",
        category: "COBOL",
        level: "Intermediate",
        question: "Compare the memory allocation of WORKING-STORAGE SECTION vs LINKAGE SECTION variables.",
        answer: "WORKING-STORAGE allocates memory statically when the program loads. LINKAGE SECTION variables do not allocate memory; they act as a map (template) over memory addresses passed by the calling program.",
        code: "LINKAGE SECTION.\n01 LK-RECORD PIC X(100). * Acting as pointer map",
        tip: "Never reference a LINKAGE SECTION variable before it has been initialized via a CALL ... USING statement or CICS linkage, otherwise it will cause an S0C4 abend.",
        quizOptions: [
            "Linkage Section variables are stored in compiler database files.",
            "Working-Storage allocates static memory on program load; Linkage Section provides address templates to map variables passed by callers.",
            "Linkage Section allocates temporary variables on disk.",
            "They are compiled to the same heap memory segments."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_19",
        category: "COBOL",
        level: "Intermediate",
        question: "How do you parse variable-length text strings using STRING and UNSTRING statements?",
        answer: "Use STRING to concatenate multiple variables into a target field, specifying delimiters (e.g. DELIMITED BY SPACE). Use UNSTRING to split a source string into multiple variables based on delimiters.",
        code: "* Combine strings:\nSTRING WS-FIRST DELIMITED BY SPACE\n       \" \"      DELIMITED BY SIZE\n       WS-LAST  DELIMITED BY SPACE\n       INTO WS-FULL-NAME.",
        tip: "Always check the POINTER option and ON OVERFLOW clauses to catch buffer truncations when parsing user-submitted parameters.",
        quizOptions: [
            "STRING split data; UNSTRING merges text variables.",
            "STRING concatenates text variables based on delimiters; UNSTRING parses text fields into multiple destinations.",
            "They are database cursor operations.",
            "They can only operate on numeric data fields."
        ],
        quizAnswerIndex: 1
    },
    {
        id: "cobol_arch_20",
        category: "COBOL",
        level: "Expert",
        question: "How does the NUMPROC compiler option affect sign normalization and comparison performance in COBOL?",
        answer: "NUMPROC(PFD) assumes sign nibbles are standard (C, D, F) and performs fast comparisons. NUMPROC(NOPFD) validates sign nibbles, adding CPU overhead but preventing abends if fields contain non-standard signs.",
        code: "* NUMPROC settings inside compilation profile:\n  CBL NUMPROC(PFD)  * Standard sign alignment - fast comparisons",
        tip: "Use NUMPROC(PFD) for math-heavy applications to optimize CPU cycles. Sanitization tests must be run on external files before operations are executed.",
        quizOptions: [
            "NUMPROC defines screen printing locations in CICS.",
            "NUMPROC(PFD) assumes standard signs for fast comparisons; NUMPROC(NOPFD) validates signs to prevent abends, adding CPU cycles.",
            "NUMPROC is an obsolete parameter.",
            "NUMPROC adjusts the precision of floating-point arithmetic."
        ],
        quizAnswerIndex: 1
    }
];

// ============================================================
// MERGED EXPORT: Combines all batches into one master array
// Total: ~1000+ unique questions
// ============================================================
export const allQuestions = [
    ...questionsData,
    ...questionsBatch2,
    ...questionsBatch3,
    ...questionsBatch4,
    ...questionsBatch5,
    ...questionsBatch6,
    ...questionsBatch7,
    ...questionsBatch8,
    ...questionsBatch9
];
