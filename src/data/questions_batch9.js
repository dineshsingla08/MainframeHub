// BATCH 9: CICS + SQL + COBOL Questions (150 questions)
export const questionsBatch9 = [
    {
        "id": "cics_gen_076",
        "category": "CICS",
        "level": "Beginner",
        "question": "What are the differences between legacy and modern approaches to handling Temporary Storage queues storage TS?",
        "answer": "Dealing with Temporary Storage queues storage TS requires understanding its impact on z/OS. scratchpads for saving state across tasks or transactions (WRITEQ/READQ/DELETEQ TS). In production, architects resolve issues by applying the following solution: Use unique queue names (e.g. append EIBTASKN or TermID) and DELETEQ when finished to reclaim storage.",
        "code": "EXEC CICS WRITEQ TS QUEUE(WS-QNAME) FROM(WS-DATA) END-EXEC.",
        "tip": "PRO-TIP: When configuring Temporary Storage queues storage TS, ensure your configurations follow current enterprise guidelines. Auxiliary TS queues write to disk; Main TS queues exist in virtual memory.",
        "quizOptions": [
            "TS queues are read sequentially only",
            "TS queues store temporary data for inter-task sharing, supporting direct random access by item index",
            "TS queues are automatically deleted on task end",
            "TS queues are only for SQL outputs"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_077",
        "category": "CICS",
        "level": "Intermediate",
        "question": "Describe a debugging technique to track and solve errors with Transient Data queues triggers TD using standard utilities.",
        "answer": "Dealing with Transient Data queues triggers TD requires understanding its impact on z/OS. sequential queues (WRITEQ/READQ TD) with automatic task triggers (Intrapartition). In production, architects resolve issues by applying the following solution: Define trigger levels in DCT or CSD, and read sequentially (destructive read - FIFO).",
        "code": "EXEC CICS WRITEQ TD QUEUE('PRNT') FROM(WS-DATA) END-EXEC.",
        "tip": "PRO-TIP: When configuring Transient Data queues triggers TD, ensure your configurations follow current enterprise guidelines. TD triggers are ideal for automating print jobs or asynchronous event handlers when queue threshold is met.",
        "quizOptions": [
            "TD queues support random access",
            "TD queues are sequential FIFO queues where read is destructive; supports automatic task triggers at threshold levels",
            "TD queues are stored in DB2 tables",
            "TD queues are only for Java integration"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_078",
        "category": "CICS",
        "level": "Expert",
        "question": "How do storage administrators optimize the allocation and block size parameters for CICS Syncpoint execution control?",
        "answer": "Dealing with CICS Syncpoint execution control requires understanding its impact on z/OS. committing or rolling back all recoverable resources (VSAM, DB2, TD) in task. In production, architects resolve issues by applying the following solution: Call EXEC CICS SYNCPOINT, or EXEC CICS SYNCPOINT ROLLBACK to reverse modifications.",
        "code": "EXEC CICS SYNCPOINT END-EXEC.",
        "tip": "PRO-TIP: When configuring CICS Syncpoint execution control, ensure your configurations follow current enterprise guidelines. Never call EXEC SQL COMMIT directly in CICS programs; syncpoints regulate all resources atomically.",
        "quizOptions": [
            "Syncpoint only commits DB2 changes",
            "Syncpoint coordinates the commit or rollback of all recoverable files, databases, and queues via two-phase commit",
            "Syncpoint terminates CICS session",
            "Syncpoint is only called during abends"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_079",
        "category": "CICS",
        "level": "Beginner",
        "question": "Explain the connection between CICS Abend handling RESP/RESP2 and z/OS workload management priorities.",
        "answer": "Dealing with CICS Abend handling RESP/RESP2 requires understanding its impact on z/OS. gracefully intercepting errors without crashing transactions. In production, architects resolve issues by applying the following solution: Use RESP(var) option in commands and check response values like DFHRESP(NORMAL) or DFHRESP(NOTFND).",
        "code": "EXEC CICS READ FILE('EMP') INTO(WS) RIDFLD(KEY) RESP(WS-RC) END-EXEC.",
        "tip": "PRO-TIP: When configuring CICS Abend handling RESP/RESP2, ensure your configurations follow current enterprise guidelines. RESP/RESP2 testing is the modern structured approach, replacing legacy HANDLE CONDITION statements.",
        "quizOptions": [
            "HANDLE CONDITION is preferred in modern COBOL",
            "Check RESP parameter value using DFHRESP(...) to perform structured conditional exception handling",
            "CICS abends always crash the region",
            "RESP is only for SQL query testing"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_080",
        "category": "CICS",
        "level": "Intermediate",
        "question": "What RACF authorizations and security constraints govern CICS security PassTickets and RACF inside enterprise databases?",
        "answer": "Dealing with CICS security PassTickets and RACF requires understanding its impact on z/OS. authenticating users and authorizing resource access. In production, architects resolve issues by applying the following solution: Specify transaction profiles in RACF (TCICSTRN) and check resource authorization using QUERY SECURITY.",
        "code": "EXEC CICS QUERY SECURITY RESTYPE('FILE') RESID('EMP') READ(WS-SEC) END-EXEC.",
        "tip": "PRO-TIP: When configuring CICS security PassTickets and RACF, ensure your configurations follow current enterprise guidelines. PassTickets are dynamic, one-time passwords generated by RACF for secure system-to-system access.",
        "quizOptions": [
            "CICS does not check RACF security",
            "CICS integrates with RACF to authorize transaction execution, file usage, using PassTickets for secure connections",
            "PassTickets are valid for 24 hours",
            "QUERY SECURITY requires terminal operators"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_081",
        "category": "CICS",
        "level": "Expert",
        "question": "How do you debug an issue related to BMS Maps RECEIVE/SEND screen I/O in a high-volume production environment?",
        "answer": "Dealing with BMS Maps RECEIVE/SEND screen I/O requires understanding its impact on z/OS. handling interactive terminal form input and output using Basic Mapping Support. In production, architects resolve issues by applying the following solution: Write maps using macros DFHMDI/DFHMDF, and use EXEC CICS RECEIVE/SEND MAP commands.",
        "code": "EXEC CICS SEND MAP('MAP1') MAPSET('SET1') ERASE END-EXEC.",
        "tip": "PRO-TIP: When configuring BMS Maps RECEIVE/SEND screen I/O, ensure your configurations follow current enterprise guidelines. Use the Modified Data Tag (MDT) to send only modified fields back to the COBOL program.",
        "quizOptions": [
            "BMS maps compile to Java files",
            "BMS provides device-independent screen definitions; RECEIVE maps read screens and SEND maps write to screens",
            "BMS maps only support monochrome text",
            "BMS is a legacy batch utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_082",
        "category": "CICS",
        "level": "Beginner",
        "question": "What are the performance implications of Execute Interface Block (EIB) fields under concurrent processing workloads?",
        "answer": "Dealing with Execute Interface Block (EIB) fields requires understanding its impact on z/OS. system-maintained variables containing transaction runtime details. In production, architects resolve issues by applying the following solution: Reference EIB variables like EIBAID, EIBTRNID, and EIBCALEN directly in the PROCEDURE DIVISION.",
        "code": "IF EIBAID = DFHPF3 EXEC CICS RETURN END-EXEC.",
        "tip": "PRO-TIP: When configuring Execute Interface Block (EIB) fields, ensure your configurations follow current enterprise guidelines. Check EIBAID (attention key) to detect if the user pressed PF3, Enter, Clear, etc.",
        "quizOptions": [
            "EIB must be declared in Linkage Section",
            "EIB is a system block containing runtime values like transaction ID, keys pressed, COMMAREA lengths",
            "EIB is for DB2 tracking only",
            "EIB fields are writable by programs"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_083",
        "category": "CICS",
        "level": "Intermediate",
        "question": "What is the architectural best practice for designing COMMAREA vs Channels & Containers in a hybrid cloud integration?",
        "answer": "Dealing with COMMAREA vs Channels & Containers requires understanding its impact on z/OS. passing transaction data across program components. In production, architects resolve issues by applying the following solution: Use PUT CONTAINER and GET CONTAINER for larger, typed data payloads (>32KB). Use COMMAREA for smaller structures.",
        "code": "EXEC CICS LINK PROGRAM('PROG2') CHANNEL('MYCHAN') END-EXEC.",
        "tip": "PRO-TIP: When configuring COMMAREA vs Channels & Containers, ensure your configurations follow current enterprise guidelines. Channels and containers eliminate the 32KB boundary constraint of the COMMAREA.",
        "quizOptions": [
            "COMMAREA is larger than Channels",
            "COMMAREA is limited to 32KB and unstructured; Channels contain named containers of unlimited size and type",
            "Both are stored in DB2 tables",
            "Channels are only for file transfers"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_084",
        "category": "CICS",
        "level": "Expert",
        "question": "Explain a scenario where misconfiguring Program Control Commands (LINK/XCTL/RETURN) causes database locking or transaction abends.",
        "answer": "Dealing with Program Control Commands (LINK/XCTL/RETURN) requires understanding its impact on z/OS. routing execution control between CICS programs. In production, architects resolve issues by applying the following solution: Use LINK for subroutine behaviors; XCTL for screen-to-screen transfers; and RETURN to terminate/suspend tasks.",
        "code": "EXEC CICS XCTL PROGRAM('PROG2') COMMAREA(WS-COMM) END-EXEC.",
        "tip": "PRO-TIP: When configuring Program Control Commands (LINK/XCTL/RETURN), ensure your configurations follow current enterprise guidelines. XCTL terminates the calling program, while LINK retains caller state in memory until return.",
        "quizOptions": [
            "XCTL keeps caller program in memory",
            "LINK calls program as subroutine (returns); XCTL transfers control (no return); RETURN goes back to CICS",
            "RETURN always terminates user session",
            "LINK and XCTL are identical in memory use"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_085",
        "category": "CICS",
        "level": "Beginner",
        "question": "How does the operating system or subsystem manage pseudo-conversational architecture design under high CPU utilization?",
        "answer": "Dealing with pseudo-conversational architecture design requires understanding its impact on z/OS. maintaining transaction state while freeing CICS threads between user inputs. In production, architects resolve issues by applying the following solution: Send map output, specify RETURN TRANSID(EIBTRNID) COMMAREA(...), and end task to release threads.",
        "code": "EXEC CICS RETURN TRANSID('EMP1') COMMAREA(WS-STATE) END-EXEC.",
        "tip": "PRO-TIP: When configuring pseudo-conversational architecture design, ensure your configurations follow current enterprise guidelines. Pseudo-conversational design is crucial to support thousands of concurrent users in a single region.",
        "quizOptions": [
            "It holds CICS threads while user thinks",
            "It releases CICS resources between screen interactions by returning with a transaction ID to process the next input",
            "It requires dedicated terminal hardware",
            "It is slower than conversational design"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_086",
        "category": "CICS",
        "level": "Intermediate",
        "question": "What are the differences between legacy and modern approaches to handling Temporary Storage queues storage TS?",
        "answer": "Dealing with Temporary Storage queues storage TS requires understanding its impact on z/OS. scratchpads for saving state across tasks or transactions (WRITEQ/READQ/DELETEQ TS). In production, architects resolve issues by applying the following solution: Use unique queue names (e.g. append EIBTASKN or TermID) and DELETEQ when finished to reclaim storage.",
        "code": "EXEC CICS WRITEQ TS QUEUE(WS-QNAME) FROM(WS-DATA) END-EXEC.",
        "tip": "PRO-TIP: When configuring Temporary Storage queues storage TS, ensure your configurations follow current enterprise guidelines. Auxiliary TS queues write to disk; Main TS queues exist in virtual memory.",
        "quizOptions": [
            "TS queues are read sequentially only",
            "TS queues store temporary data for inter-task sharing, supporting direct random access by item index",
            "TS queues are automatically deleted on task end",
            "TS queues are only for SQL outputs"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_087",
        "category": "CICS",
        "level": "Expert",
        "question": "Describe a debugging technique to track and solve errors with Transient Data queues triggers TD using standard utilities.",
        "answer": "Dealing with Transient Data queues triggers TD requires understanding its impact on z/OS. sequential queues (WRITEQ/READQ TD) with automatic task triggers (Intrapartition). In production, architects resolve issues by applying the following solution: Define trigger levels in DCT or CSD, and read sequentially (destructive read - FIFO).",
        "code": "EXEC CICS WRITEQ TD QUEUE('PRNT') FROM(WS-DATA) END-EXEC.",
        "tip": "PRO-TIP: When configuring Transient Data queues triggers TD, ensure your configurations follow current enterprise guidelines. TD triggers are ideal for automating print jobs or asynchronous event handlers when queue threshold is met.",
        "quizOptions": [
            "TD queues support random access",
            "TD queues are sequential FIFO queues where read is destructive; supports automatic task triggers at threshold levels",
            "TD queues are stored in DB2 tables",
            "TD queues are only for Java integration"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_088",
        "category": "CICS",
        "level": "Beginner",
        "question": "How do storage administrators optimize the allocation and block size parameters for CICS Syncpoint execution control?",
        "answer": "Dealing with CICS Syncpoint execution control requires understanding its impact on z/OS. committing or rolling back all recoverable resources (VSAM, DB2, TD) in task. In production, architects resolve issues by applying the following solution: Call EXEC CICS SYNCPOINT, or EXEC CICS SYNCPOINT ROLLBACK to reverse modifications.",
        "code": "EXEC CICS SYNCPOINT END-EXEC.",
        "tip": "PRO-TIP: When configuring CICS Syncpoint execution control, ensure your configurations follow current enterprise guidelines. Never call EXEC SQL COMMIT directly in CICS programs; syncpoints regulate all resources atomically.",
        "quizOptions": [
            "Syncpoint only commits DB2 changes",
            "Syncpoint coordinates the commit or rollback of all recoverable files, databases, and queues via two-phase commit",
            "Syncpoint terminates CICS session",
            "Syncpoint is only called during abends"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_089",
        "category": "CICS",
        "level": "Intermediate",
        "question": "Explain the connection between CICS Abend handling RESP/RESP2 and z/OS workload management priorities.",
        "answer": "Dealing with CICS Abend handling RESP/RESP2 requires understanding its impact on z/OS. gracefully intercepting errors without crashing transactions. In production, architects resolve issues by applying the following solution: Use RESP(var) option in commands and check response values like DFHRESP(NORMAL) or DFHRESP(NOTFND).",
        "code": "EXEC CICS READ FILE('EMP') INTO(WS) RIDFLD(KEY) RESP(WS-RC) END-EXEC.",
        "tip": "PRO-TIP: When configuring CICS Abend handling RESP/RESP2, ensure your configurations follow current enterprise guidelines. RESP/RESP2 testing is the modern structured approach, replacing legacy HANDLE CONDITION statements.",
        "quizOptions": [
            "HANDLE CONDITION is preferred in modern COBOL",
            "Check RESP parameter value using DFHRESP(...) to perform structured conditional exception handling",
            "CICS abends always crash the region",
            "RESP is only for SQL query testing"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_090",
        "category": "CICS",
        "level": "Expert",
        "question": "What RACF authorizations and security constraints govern CICS security PassTickets and RACF inside enterprise databases?",
        "answer": "Dealing with CICS security PassTickets and RACF requires understanding its impact on z/OS. authenticating users and authorizing resource access. In production, architects resolve issues by applying the following solution: Specify transaction profiles in RACF (TCICSTRN) and check resource authorization using QUERY SECURITY.",
        "code": "EXEC CICS QUERY SECURITY RESTYPE('FILE') RESID('EMP') READ(WS-SEC) END-EXEC.",
        "tip": "PRO-TIP: When configuring CICS security PassTickets and RACF, ensure your configurations follow current enterprise guidelines. PassTickets are dynamic, one-time passwords generated by RACF for secure system-to-system access.",
        "quizOptions": [
            "CICS does not check RACF security",
            "CICS integrates with RACF to authorize transaction execution, file usage, using PassTickets for secure connections",
            "PassTickets are valid for 24 hours",
            "QUERY SECURITY requires terminal operators"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_091",
        "category": "CICS",
        "level": "Beginner",
        "question": "How do you debug an issue related to BMS Maps RECEIVE/SEND screen I/O in a high-volume production environment?",
        "answer": "Dealing with BMS Maps RECEIVE/SEND screen I/O requires understanding its impact on z/OS. handling interactive terminal form input and output using Basic Mapping Support. In production, architects resolve issues by applying the following solution: Write maps using macros DFHMDI/DFHMDF, and use EXEC CICS RECEIVE/SEND MAP commands.",
        "code": "EXEC CICS SEND MAP('MAP1') MAPSET('SET1') ERASE END-EXEC.",
        "tip": "PRO-TIP: When configuring BMS Maps RECEIVE/SEND screen I/O, ensure your configurations follow current enterprise guidelines. Use the Modified Data Tag (MDT) to send only modified fields back to the COBOL program.",
        "quizOptions": [
            "BMS maps compile to Java files",
            "BMS provides device-independent screen definitions; RECEIVE maps read screens and SEND maps write to screens",
            "BMS maps only support monochrome text",
            "BMS is a legacy batch utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_092",
        "category": "CICS",
        "level": "Intermediate",
        "question": "What are the performance implications of Execute Interface Block (EIB) fields under concurrent processing workloads?",
        "answer": "Dealing with Execute Interface Block (EIB) fields requires understanding its impact on z/OS. system-maintained variables containing transaction runtime details. In production, architects resolve issues by applying the following solution: Reference EIB variables like EIBAID, EIBTRNID, and EIBCALEN directly in the PROCEDURE DIVISION.",
        "code": "IF EIBAID = DFHPF3 EXEC CICS RETURN END-EXEC.",
        "tip": "PRO-TIP: When configuring Execute Interface Block (EIB) fields, ensure your configurations follow current enterprise guidelines. Check EIBAID (attention key) to detect if the user pressed PF3, Enter, Clear, etc.",
        "quizOptions": [
            "EIB must be declared in Linkage Section",
            "EIB is a system block containing runtime values like transaction ID, keys pressed, COMMAREA lengths",
            "EIB is for DB2 tracking only",
            "EIB fields are writable by programs"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_093",
        "category": "CICS",
        "level": "Expert",
        "question": "What is the architectural best practice for designing COMMAREA vs Channels & Containers in a hybrid cloud integration?",
        "answer": "Dealing with COMMAREA vs Channels & Containers requires understanding its impact on z/OS. passing transaction data across program components. In production, architects resolve issues by applying the following solution: Use PUT CONTAINER and GET CONTAINER for larger, typed data payloads (>32KB). Use COMMAREA for smaller structures.",
        "code": "EXEC CICS LINK PROGRAM('PROG2') CHANNEL('MYCHAN') END-EXEC.",
        "tip": "PRO-TIP: When configuring COMMAREA vs Channels & Containers, ensure your configurations follow current enterprise guidelines. Channels and containers eliminate the 32KB boundary constraint of the COMMAREA.",
        "quizOptions": [
            "COMMAREA is larger than Channels",
            "COMMAREA is limited to 32KB and unstructured; Channels contain named containers of unlimited size and type",
            "Both are stored in DB2 tables",
            "Channels are only for file transfers"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_094",
        "category": "CICS",
        "level": "Beginner",
        "question": "Explain a scenario where misconfiguring Program Control Commands (LINK/XCTL/RETURN) causes database locking or transaction abends.",
        "answer": "Dealing with Program Control Commands (LINK/XCTL/RETURN) requires understanding its impact on z/OS. routing execution control between CICS programs. In production, architects resolve issues by applying the following solution: Use LINK for subroutine behaviors; XCTL for screen-to-screen transfers; and RETURN to terminate/suspend tasks.",
        "code": "EXEC CICS XCTL PROGRAM('PROG2') COMMAREA(WS-COMM) END-EXEC.",
        "tip": "PRO-TIP: When configuring Program Control Commands (LINK/XCTL/RETURN), ensure your configurations follow current enterprise guidelines. XCTL terminates the calling program, while LINK retains caller state in memory until return.",
        "quizOptions": [
            "XCTL keeps caller program in memory",
            "LINK calls program as subroutine (returns); XCTL transfers control (no return); RETURN goes back to CICS",
            "RETURN always terminates user session",
            "LINK and XCTL are identical in memory use"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_095",
        "category": "CICS",
        "level": "Intermediate",
        "question": "How does the operating system or subsystem manage pseudo-conversational architecture design under high CPU utilization?",
        "answer": "Dealing with pseudo-conversational architecture design requires understanding its impact on z/OS. maintaining transaction state while freeing CICS threads between user inputs. In production, architects resolve issues by applying the following solution: Send map output, specify RETURN TRANSID(EIBTRNID) COMMAREA(...), and end task to release threads.",
        "code": "EXEC CICS RETURN TRANSID('EMP1') COMMAREA(WS-STATE) END-EXEC.",
        "tip": "PRO-TIP: When configuring pseudo-conversational architecture design, ensure your configurations follow current enterprise guidelines. Pseudo-conversational design is crucial to support thousands of concurrent users in a single region.",
        "quizOptions": [
            "It holds CICS threads while user thinks",
            "It releases CICS resources between screen interactions by returning with a transaction ID to process the next input",
            "It requires dedicated terminal hardware",
            "It is slower than conversational design"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_096",
        "category": "CICS",
        "level": "Expert",
        "question": "What are the differences between legacy and modern approaches to handling Temporary Storage queues storage TS?",
        "answer": "Dealing with Temporary Storage queues storage TS requires understanding its impact on z/OS. scratchpads for saving state across tasks or transactions (WRITEQ/READQ/DELETEQ TS). In production, architects resolve issues by applying the following solution: Use unique queue names (e.g. append EIBTASKN or TermID) and DELETEQ when finished to reclaim storage.",
        "code": "EXEC CICS WRITEQ TS QUEUE(WS-QNAME) FROM(WS-DATA) END-EXEC.",
        "tip": "PRO-TIP: When configuring Temporary Storage queues storage TS, ensure your configurations follow current enterprise guidelines. Auxiliary TS queues write to disk; Main TS queues exist in virtual memory.",
        "quizOptions": [
            "TS queues are read sequentially only",
            "TS queues store temporary data for inter-task sharing, supporting direct random access by item index",
            "TS queues are automatically deleted on task end",
            "TS queues are only for SQL outputs"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_097",
        "category": "CICS",
        "level": "Beginner",
        "question": "Describe a debugging technique to track and solve errors with Transient Data queues triggers TD using standard utilities.",
        "answer": "Dealing with Transient Data queues triggers TD requires understanding its impact on z/OS. sequential queues (WRITEQ/READQ TD) with automatic task triggers (Intrapartition). In production, architects resolve issues by applying the following solution: Define trigger levels in DCT or CSD, and read sequentially (destructive read - FIFO).",
        "code": "EXEC CICS WRITEQ TD QUEUE('PRNT') FROM(WS-DATA) END-EXEC.",
        "tip": "PRO-TIP: When configuring Transient Data queues triggers TD, ensure your configurations follow current enterprise guidelines. TD triggers are ideal for automating print jobs or asynchronous event handlers when queue threshold is met.",
        "quizOptions": [
            "TD queues support random access",
            "TD queues are sequential FIFO queues where read is destructive; supports automatic task triggers at threshold levels",
            "TD queues are stored in DB2 tables",
            "TD queues are only for Java integration"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_098",
        "category": "CICS",
        "level": "Intermediate",
        "question": "How do storage administrators optimize the allocation and block size parameters for CICS Syncpoint execution control?",
        "answer": "Dealing with CICS Syncpoint execution control requires understanding its impact on z/OS. committing or rolling back all recoverable resources (VSAM, DB2, TD) in task. In production, architects resolve issues by applying the following solution: Call EXEC CICS SYNCPOINT, or EXEC CICS SYNCPOINT ROLLBACK to reverse modifications.",
        "code": "EXEC CICS SYNCPOINT END-EXEC.",
        "tip": "PRO-TIP: When configuring CICS Syncpoint execution control, ensure your configurations follow current enterprise guidelines. Never call EXEC SQL COMMIT directly in CICS programs; syncpoints regulate all resources atomically.",
        "quizOptions": [
            "Syncpoint only commits DB2 changes",
            "Syncpoint coordinates the commit or rollback of all recoverable files, databases, and queues via two-phase commit",
            "Syncpoint terminates CICS session",
            "Syncpoint is only called during abends"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_099",
        "category": "CICS",
        "level": "Expert",
        "question": "Explain the connection between CICS Abend handling RESP/RESP2 and z/OS workload management priorities.",
        "answer": "Dealing with CICS Abend handling RESP/RESP2 requires understanding its impact on z/OS. gracefully intercepting errors without crashing transactions. In production, architects resolve issues by applying the following solution: Use RESP(var) option in commands and check response values like DFHRESP(NORMAL) or DFHRESP(NOTFND).",
        "code": "EXEC CICS READ FILE('EMP') INTO(WS) RIDFLD(KEY) RESP(WS-RC) END-EXEC.",
        "tip": "PRO-TIP: When configuring CICS Abend handling RESP/RESP2, ensure your configurations follow current enterprise guidelines. RESP/RESP2 testing is the modern structured approach, replacing legacy HANDLE CONDITION statements.",
        "quizOptions": [
            "HANDLE CONDITION is preferred in modern COBOL",
            "Check RESP parameter value using DFHRESP(...) to perform structured conditional exception handling",
            "CICS abends always crash the region",
            "RESP is only for SQL query testing"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cics_gen_100",
        "category": "CICS",
        "level": "Beginner",
        "question": "What RACF authorizations and security constraints govern CICS security PassTickets and RACF inside enterprise databases?",
        "answer": "Dealing with CICS security PassTickets and RACF requires understanding its impact on z/OS. authenticating users and authorizing resource access. In production, architects resolve issues by applying the following solution: Specify transaction profiles in RACF (TCICSTRN) and check resource authorization using QUERY SECURITY.",
        "code": "EXEC CICS QUERY SECURITY RESTYPE('FILE') RESID('EMP') READ(WS-SEC) END-EXEC.",
        "tip": "PRO-TIP: When configuring CICS security PassTickets and RACF, ensure your configurations follow current enterprise guidelines. PassTickets are dynamic, one-time passwords generated by RACF for secure system-to-system access.",
        "quizOptions": [
            "CICS does not check RACF security",
            "CICS integrates with RACF to authorize transaction execution, file usage, using PassTickets for secure connections",
            "PassTickets are valid for 24 hours",
            "QUERY SECURITY requires terminal operators"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_001",
        "category": "SQL",
        "level": "Beginner",
        "question": "Explain the concept of HAVING vs WHERE queries. What is its significance in mainframe systems?",
        "answer": "In IBM mainframe architectures, HAVING vs WHERE queries represents filtering data before grouping (WHERE) vs after grouping (HAVING).. To implement or handle it: Use WHERE for row filters. Use HAVING for aggregated metrics.",
        "code": "SELECT DEPT, AVG(SAL) FROM EMP WHERE SAL > 50000 GROUP BY DEPT HAVING AVG(SAL) > 60000;",
        "tip": "Optimize queries by putting filters in WHERE whenever possible, reducing rows before grouping.",
        "quizOptions": [
            "WHERE and HAVING are identical",
            "WHERE filters rows before GROUP BY aggregation; HAVING filters groups after aggregation",
            "HAVING filters rows before GROUP BY",
            "WHERE can use aggregate functions like SUM"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_002",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Explain the concept of DB2 SQL join patterns. What is its significance in mainframe systems?",
        "answer": "In IBM mainframe architectures, DB2 SQL join patterns represents joining tables using INNER, LEFT OUTER, RIGHT OUTER, and FULL OUTER joins.. To implement or handle it: Select appropriate join based on whether unmatched rows must be retained.",
        "code": "SELECT E.NAME, D.NAME FROM EMP E LEFT JOIN DEPT D ON E.DID = D.ID;",
        "tip": "LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.",
        "quizOptions": [
            "INNER JOIN returns unmatched rows",
            "INNER JOIN returns matches only; LEFT/RIGHT OUTER returns unmatched rows from one side; FULL returns all",
            "CROSS JOIN requires a join key",
            "OUTER joins are slower than subqueries"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_003",
        "category": "SQL",
        "level": "Expert",
        "question": "Explain the concept of Common Table Expressions (CTE). What is its significance in mainframe systems?",
        "answer": "In IBM mainframe architectures, Common Table Expressions (CTE) represents defining temporary named result sets within a query statement.. To implement or handle it: Use WITH CTE_NAME (columns) AS (SELECT ...) query syntax.",
        "code": "WITH HIGHSAL AS (SELECT * FROM EMP WHERE SAL > 100000)\nSELECT * FROM HIGHSAL WHERE DEPT = 10;",
        "tip": "CTEs make complex nesting readable and can be referenced multiple times in the main query.",
        "quizOptions": [
            "CTEs create physical tables on disk",
            "CTEs define inline temporary named queries that act as virtual tables for the primary query",
            "CTEs only work for DB2 stored procedures",
            "CTEs require index-only scans"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_004",
        "category": "SQL",
        "level": "Beginner",
        "question": "Explain the concept of recursive CTEs hierarchies. What is its significance in mainframe systems?",
        "answer": "In IBM mainframe architectures, recursive CTEs hierarchies represents traversing tree structures or hierarchical tables (like manager-employee).. To implement or handle it: Define CTE containing anchor query UNION ALL recursive query referencing the CTE.",
        "code": "WITH ORG (ID, BOSS, LVL) AS (\n  SELECT ID, BOSS, 1 FROM EMP WHERE BOSS IS NULL\n  UNION ALL\n  SELECT E.ID, E.BOSS, O.LVL + 1 FROM EMP E JOIN ORG O ON E.BOSS = O.ID\n) SELECT * FROM ORG;",
        "tip": "Always include a termination check or level indicator to prevent infinite loops.",
        "quizOptions": [
            "Recursive CTEs are not supported in DB2",
            "They use UNION ALL joining anchor records with child records recursively to map hierarchical tree nodes",
            "Recursive CTEs write to temporary tapes",
            "They require cursor loops in COBOL"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_005",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Explain the concept of window functions ROW_NUMBER. What is its significance in mainframe systems?",
        "answer": "In IBM mainframe architectures, window functions ROW_NUMBER represents assigning unique sequential integers to rows within partitioned windows.. To implement or handle it: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) syntax.",
        "code": "SELECT EMPNO, ROW_NUMBER() OVER (PARTITION BY DEPTNO ORDER BY SALARY DESC) FROM EMP;",
        "tip": "Use DENSE_RANK() if you need matching ranks for duplicate sorted values without skipping integers.",
        "quizOptions": [
            "ROW_NUMBER requires temporary indexes",
            "ROW_NUMBER partitions rows into window groups and computes row ranks dynamically per group",
            "ROW_NUMBER is only for SELECT INTO single rows",
            "ROW_NUMBER modifies database keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_006",
        "category": "SQL",
        "level": "Expert",
        "question": "Explain the concept of Stage 1 sargable predicates. What is its significance in mainframe systems?",
        "answer": "In IBM mainframe architectures, Stage 1 sargable predicates represents efficient query filters processed directly by the DB2 Data Manager (DM) during I/O.. To implement or handle it: Avoid mathematical operations, functions, or data type conversion mismatches on filtered columns.",
        "code": "SELECT NAME FROM EMP WHERE SALARY > 50000; * Stage 1 filter",
        "tip": "Stage 1 filters are highly efficient because rows are skipped before being copied to RDS memory buffers.",
        "quizOptions": [
            "Stage 1 filters are slow",
            "Stage 1 (sargable) predicates are processed directly by the Data Manager, minimizing data copy and CPU cycles",
            "Stage 1 requires CICS maps",
            "Stage 1 predicates require temporary tables"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_007",
        "category": "SQL",
        "level": "Beginner",
        "question": "Explain the concept of Stage 2 residual predicates. What is its significance in mainframe systems?",
        "answer": "In IBM mainframe architectures, Stage 2 residual predicates represents slower query filters evaluated by the Relational Data System (RDS) after copying data.. To implement or handle it: Rewrite expressions to isolate columns: e.g. SALARY > 50000/12 instead of SALARY * 12 > 50000.",
        "code": "SELECT NAME FROM EMP WHERE SALARY * 1.1 > 100000; * Stage 2 filter",
        "tip": "Applying functions (like YEAR(HIREDATE) = 2026) forces Stage 2 processing and disables index usage.",
        "quizOptions": [
            "Stage 2 predicates are faster",
            "Stage 2 (residual) predicates require copying pages to memory first for evaluation by the Relational Data System",
            "Stage 2 filters are processed on tape",
            "Stage 2 predicates cannot use WHERE clauses"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_008",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Explain the concept of EXISTS vs IN subqueries optimization. What is its significance in mainframe systems?",
        "answer": "In IBM mainframe architectures, EXISTS vs IN subqueries optimization represents evaluating record presence in child subqueries efficiently.. To implement or handle it: Use EXISTS for correlated checks (checks presence and stops); use IN for small literal sets.",
        "code": "SELECT * FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DID = D.ID);",
        "tip": "EXISTS halts subquery scanning immediately upon finding the first match, saving I/O.",
        "quizOptions": [
            "IN is always faster than EXISTS",
            "EXISTS stops scanning on the first match, making it highly efficient for correlated subquery presence checks",
            "Both require full table scans",
            "EXISTS requires temporary tablespaces"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_009",
        "category": "SQL",
        "level": "Expert",
        "question": "Explain the concept of CASE conditional expressions. What is its significance in mainframe systems?",
        "answer": "In IBM mainframe architectures, CASE conditional expressions represents evaluating multi-branch logic directly within select or update statements.. To implement or handle it: Use CASE WHEN condition THEN val1 ELSE val2 END syntax.",
        "code": "SELECT NAME, CASE WHEN SAL > 100000 THEN 'HIGH' ELSE 'STD' END FROM EMP;",
        "tip": "CASE is processed on the database server, reducing the need to process conditionals in COBOL.",
        "quizOptions": [
            "CASE is only used in WHERE clauses",
            "CASE conditional statements return values based on evaluated branch conditions inside queries",
            "CASE requires BIND PLAN re-initialization",
            "CASE is a JCL utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_010",
        "category": "SQL",
        "level": "Beginner",
        "question": "Explain the concept of optimistic locking ROW_CHANGE_TIMESTAMP. What is its significance in mainframe systems?",
        "answer": "In IBM mainframe architectures, optimistic locking ROW_CHANGE_TIMESTAMP represents detecting concurrent table updates without holding locks during user edits.. To implement or handle it: Define ROW_CHANGE_TIMESTAMP column. Select its value, and filter by it in the UPDATE statement.",
        "code": "UPDATE EMP SET SAL = 60000 WHERE ID = 10 AND TS = :ORIGINAL-TS;",
        "tip": "If the row was modified by another task, the timestamp changes, and the update affects 0 rows.",
        "quizOptions": [
            "Optimistic locking blocks other queries",
            "Optimistic locking checks row version/timestamp at update time; if it changed, the update is rejected (0 rows affected)",
            "Optimistic locking is managed in CICS tables only",
            "It locks the entire tablespace"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_011",
        "category": "SQL",
        "level": "Intermediate",
        "question": "How do you debug an issue related to HAVING vs WHERE queries in a high-volume production environment?",
        "answer": "Dealing with HAVING vs WHERE queries requires understanding its impact on z/OS. filtering data before grouping (WHERE) vs after grouping (HAVING). In production, architects resolve issues by applying the following solution: Use WHERE for row filters. Use HAVING for aggregated metrics.",
        "code": "SELECT DEPT, AVG(SAL) FROM EMP WHERE SAL > 50000 GROUP BY DEPT HAVING AVG(SAL) > 60000;",
        "tip": "PRO-TIP: When configuring HAVING vs WHERE queries, ensure your configurations follow current enterprise guidelines. Optimize queries by putting filters in WHERE whenever possible, reducing rows before grouping.",
        "quizOptions": [
            "WHERE and HAVING are identical",
            "WHERE filters rows before GROUP BY aggregation; HAVING filters groups after aggregation",
            "HAVING filters rows before GROUP BY",
            "WHERE can use aggregate functions like SUM"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_012",
        "category": "SQL",
        "level": "Expert",
        "question": "What are the performance implications of DB2 SQL join patterns under concurrent processing workloads?",
        "answer": "Dealing with DB2 SQL join patterns requires understanding its impact on z/OS. joining tables using INNER, LEFT OUTER, RIGHT OUTER, and FULL OUTER joins. In production, architects resolve issues by applying the following solution: Select appropriate join based on whether unmatched rows must be retained.",
        "code": "SELECT E.NAME, D.NAME FROM EMP E LEFT JOIN DEPT D ON E.DID = D.ID;",
        "tip": "PRO-TIP: When configuring DB2 SQL join patterns, ensure your configurations follow current enterprise guidelines. LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.",
        "quizOptions": [
            "INNER JOIN returns unmatched rows",
            "INNER JOIN returns matches only; LEFT/RIGHT OUTER returns unmatched rows from one side; FULL returns all",
            "CROSS JOIN requires a join key",
            "OUTER joins are slower than subqueries"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_013",
        "category": "SQL",
        "level": "Beginner",
        "question": "What is the architectural best practice for designing Common Table Expressions (CTE) in a hybrid cloud integration?",
        "answer": "Dealing with Common Table Expressions (CTE) requires understanding its impact on z/OS. defining temporary named result sets within a query statement. In production, architects resolve issues by applying the following solution: Use WITH CTE_NAME (columns) AS (SELECT ...) query syntax.",
        "code": "WITH HIGHSAL AS (SELECT * FROM EMP WHERE SAL > 100000)\nSELECT * FROM HIGHSAL WHERE DEPT = 10;",
        "tip": "PRO-TIP: When configuring Common Table Expressions (CTE), ensure your configurations follow current enterprise guidelines. CTEs make complex nesting readable and can be referenced multiple times in the main query.",
        "quizOptions": [
            "CTEs create physical tables on disk",
            "CTEs define inline temporary named queries that act as virtual tables for the primary query",
            "CTEs only work for DB2 stored procedures",
            "CTEs require index-only scans"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_014",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Explain a scenario where misconfiguring recursive CTEs hierarchies causes database locking or transaction abends.",
        "answer": "Dealing with recursive CTEs hierarchies requires understanding its impact on z/OS. traversing tree structures or hierarchical tables (like manager-employee). In production, architects resolve issues by applying the following solution: Define CTE containing anchor query UNION ALL recursive query referencing the CTE.",
        "code": "WITH ORG (ID, BOSS, LVL) AS (\n  SELECT ID, BOSS, 1 FROM EMP WHERE BOSS IS NULL\n  UNION ALL\n  SELECT E.ID, E.BOSS, O.LVL + 1 FROM EMP E JOIN ORG O ON E.BOSS = O.ID\n) SELECT * FROM ORG;",
        "tip": "PRO-TIP: When configuring recursive CTEs hierarchies, ensure your configurations follow current enterprise guidelines. Always include a termination check or level indicator to prevent infinite loops.",
        "quizOptions": [
            "Recursive CTEs are not supported in DB2",
            "They use UNION ALL joining anchor records with child records recursively to map hierarchical tree nodes",
            "Recursive CTEs write to temporary tapes",
            "They require cursor loops in COBOL"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_015",
        "category": "SQL",
        "level": "Expert",
        "question": "How does the operating system or subsystem manage window functions ROW_NUMBER under high CPU utilization?",
        "answer": "Dealing with window functions ROW_NUMBER requires understanding its impact on z/OS. assigning unique sequential integers to rows within partitioned windows. In production, architects resolve issues by applying the following solution: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) syntax.",
        "code": "SELECT EMPNO, ROW_NUMBER() OVER (PARTITION BY DEPTNO ORDER BY SALARY DESC) FROM EMP;",
        "tip": "PRO-TIP: When configuring window functions ROW_NUMBER, ensure your configurations follow current enterprise guidelines. Use DENSE_RANK() if you need matching ranks for duplicate sorted values without skipping integers.",
        "quizOptions": [
            "ROW_NUMBER requires temporary indexes",
            "ROW_NUMBER partitions rows into window groups and computes row ranks dynamically per group",
            "ROW_NUMBER is only for SELECT INTO single rows",
            "ROW_NUMBER modifies database keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_016",
        "category": "SQL",
        "level": "Beginner",
        "question": "What are the differences between legacy and modern approaches to handling Stage 1 sargable predicates?",
        "answer": "Dealing with Stage 1 sargable predicates requires understanding its impact on z/OS. efficient query filters processed directly by the DB2 Data Manager (DM) during I/O. In production, architects resolve issues by applying the following solution: Avoid mathematical operations, functions, or data type conversion mismatches on filtered columns.",
        "code": "SELECT NAME FROM EMP WHERE SALARY > 50000; * Stage 1 filter",
        "tip": "PRO-TIP: When configuring Stage 1 sargable predicates, ensure your configurations follow current enterprise guidelines. Stage 1 filters are highly efficient because rows are skipped before being copied to RDS memory buffers.",
        "quizOptions": [
            "Stage 1 filters are slow",
            "Stage 1 (sargable) predicates are processed directly by the Data Manager, minimizing data copy and CPU cycles",
            "Stage 1 requires CICS maps",
            "Stage 1 predicates require temporary tables"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_017",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Describe a debugging technique to track and solve errors with Stage 2 residual predicates using standard utilities.",
        "answer": "Dealing with Stage 2 residual predicates requires understanding its impact on z/OS. slower query filters evaluated by the Relational Data System (RDS) after copying data. In production, architects resolve issues by applying the following solution: Rewrite expressions to isolate columns: e.g. SALARY > 50000/12 instead of SALARY * 12 > 50000.",
        "code": "SELECT NAME FROM EMP WHERE SALARY * 1.1 > 100000; * Stage 2 filter",
        "tip": "PRO-TIP: When configuring Stage 2 residual predicates, ensure your configurations follow current enterprise guidelines. Applying functions (like YEAR(HIREDATE) = 2026) forces Stage 2 processing and disables index usage.",
        "quizOptions": [
            "Stage 2 predicates are faster",
            "Stage 2 (residual) predicates require copying pages to memory first for evaluation by the Relational Data System",
            "Stage 2 filters are processed on tape",
            "Stage 2 predicates cannot use WHERE clauses"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_018",
        "category": "SQL",
        "level": "Expert",
        "question": "How do storage administrators optimize the allocation and block size parameters for EXISTS vs IN subqueries optimization?",
        "answer": "Dealing with EXISTS vs IN subqueries optimization requires understanding its impact on z/OS. evaluating record presence in child subqueries efficiently. In production, architects resolve issues by applying the following solution: Use EXISTS for correlated checks (checks presence and stops); use IN for small literal sets.",
        "code": "SELECT * FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DID = D.ID);",
        "tip": "PRO-TIP: When configuring EXISTS vs IN subqueries optimization, ensure your configurations follow current enterprise guidelines. EXISTS halts subquery scanning immediately upon finding the first match, saving I/O.",
        "quizOptions": [
            "IN is always faster than EXISTS",
            "EXISTS stops scanning on the first match, making it highly efficient for correlated subquery presence checks",
            "Both require full table scans",
            "EXISTS requires temporary tablespaces"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_019",
        "category": "SQL",
        "level": "Beginner",
        "question": "Explain the connection between CASE conditional expressions and z/OS workload management priorities.",
        "answer": "Dealing with CASE conditional expressions requires understanding its impact on z/OS. evaluating multi-branch logic directly within select or update statements. In production, architects resolve issues by applying the following solution: Use CASE WHEN condition THEN val1 ELSE val2 END syntax.",
        "code": "SELECT NAME, CASE WHEN SAL > 100000 THEN 'HIGH' ELSE 'STD' END FROM EMP;",
        "tip": "PRO-TIP: When configuring CASE conditional expressions, ensure your configurations follow current enterprise guidelines. CASE is processed on the database server, reducing the need to process conditionals in COBOL.",
        "quizOptions": [
            "CASE is only used in WHERE clauses",
            "CASE conditional statements return values based on evaluated branch conditions inside queries",
            "CASE requires BIND PLAN re-initialization",
            "CASE is a JCL utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_020",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What RACF authorizations and security constraints govern optimistic locking ROW_CHANGE_TIMESTAMP inside enterprise databases?",
        "answer": "Dealing with optimistic locking ROW_CHANGE_TIMESTAMP requires understanding its impact on z/OS. detecting concurrent table updates without holding locks during user edits. In production, architects resolve issues by applying the following solution: Define ROW_CHANGE_TIMESTAMP column. Select its value, and filter by it in the UPDATE statement.",
        "code": "UPDATE EMP SET SAL = 60000 WHERE ID = 10 AND TS = :ORIGINAL-TS;",
        "tip": "PRO-TIP: When configuring optimistic locking ROW_CHANGE_TIMESTAMP, ensure your configurations follow current enterprise guidelines. If the row was modified by another task, the timestamp changes, and the update affects 0 rows.",
        "quizOptions": [
            "Optimistic locking blocks other queries",
            "Optimistic locking checks row version/timestamp at update time; if it changed, the update is rejected (0 rows affected)",
            "Optimistic locking is managed in CICS tables only",
            "It locks the entire tablespace"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_021",
        "category": "SQL",
        "level": "Expert",
        "question": "How do you debug an issue related to HAVING vs WHERE queries in a high-volume production environment?",
        "answer": "Dealing with HAVING vs WHERE queries requires understanding its impact on z/OS. filtering data before grouping (WHERE) vs after grouping (HAVING). In production, architects resolve issues by applying the following solution: Use WHERE for row filters. Use HAVING for aggregated metrics.",
        "code": "SELECT DEPT, AVG(SAL) FROM EMP WHERE SAL > 50000 GROUP BY DEPT HAVING AVG(SAL) > 60000;",
        "tip": "PRO-TIP: When configuring HAVING vs WHERE queries, ensure your configurations follow current enterprise guidelines. Optimize queries by putting filters in WHERE whenever possible, reducing rows before grouping.",
        "quizOptions": [
            "WHERE and HAVING are identical",
            "WHERE filters rows before GROUP BY aggregation; HAVING filters groups after aggregation",
            "HAVING filters rows before GROUP BY",
            "WHERE can use aggregate functions like SUM"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_022",
        "category": "SQL",
        "level": "Beginner",
        "question": "What are the performance implications of DB2 SQL join patterns under concurrent processing workloads?",
        "answer": "Dealing with DB2 SQL join patterns requires understanding its impact on z/OS. joining tables using INNER, LEFT OUTER, RIGHT OUTER, and FULL OUTER joins. In production, architects resolve issues by applying the following solution: Select appropriate join based on whether unmatched rows must be retained.",
        "code": "SELECT E.NAME, D.NAME FROM EMP E LEFT JOIN DEPT D ON E.DID = D.ID;",
        "tip": "PRO-TIP: When configuring DB2 SQL join patterns, ensure your configurations follow current enterprise guidelines. LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.",
        "quizOptions": [
            "INNER JOIN returns unmatched rows",
            "INNER JOIN returns matches only; LEFT/RIGHT OUTER returns unmatched rows from one side; FULL returns all",
            "CROSS JOIN requires a join key",
            "OUTER joins are slower than subqueries"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_023",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What is the architectural best practice for designing Common Table Expressions (CTE) in a hybrid cloud integration?",
        "answer": "Dealing with Common Table Expressions (CTE) requires understanding its impact on z/OS. defining temporary named result sets within a query statement. In production, architects resolve issues by applying the following solution: Use WITH CTE_NAME (columns) AS (SELECT ...) query syntax.",
        "code": "WITH HIGHSAL AS (SELECT * FROM EMP WHERE SAL > 100000)\nSELECT * FROM HIGHSAL WHERE DEPT = 10;",
        "tip": "PRO-TIP: When configuring Common Table Expressions (CTE), ensure your configurations follow current enterprise guidelines. CTEs make complex nesting readable and can be referenced multiple times in the main query.",
        "quizOptions": [
            "CTEs create physical tables on disk",
            "CTEs define inline temporary named queries that act as virtual tables for the primary query",
            "CTEs only work for DB2 stored procedures",
            "CTEs require index-only scans"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_024",
        "category": "SQL",
        "level": "Expert",
        "question": "Explain a scenario where misconfiguring recursive CTEs hierarchies causes database locking or transaction abends.",
        "answer": "Dealing with recursive CTEs hierarchies requires understanding its impact on z/OS. traversing tree structures or hierarchical tables (like manager-employee). In production, architects resolve issues by applying the following solution: Define CTE containing anchor query UNION ALL recursive query referencing the CTE.",
        "code": "WITH ORG (ID, BOSS, LVL) AS (\n  SELECT ID, BOSS, 1 FROM EMP WHERE BOSS IS NULL\n  UNION ALL\n  SELECT E.ID, E.BOSS, O.LVL + 1 FROM EMP E JOIN ORG O ON E.BOSS = O.ID\n) SELECT * FROM ORG;",
        "tip": "PRO-TIP: When configuring recursive CTEs hierarchies, ensure your configurations follow current enterprise guidelines. Always include a termination check or level indicator to prevent infinite loops.",
        "quizOptions": [
            "Recursive CTEs are not supported in DB2",
            "They use UNION ALL joining anchor records with child records recursively to map hierarchical tree nodes",
            "Recursive CTEs write to temporary tapes",
            "They require cursor loops in COBOL"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_025",
        "category": "SQL",
        "level": "Beginner",
        "question": "How does the operating system or subsystem manage window functions ROW_NUMBER under high CPU utilization?",
        "answer": "Dealing with window functions ROW_NUMBER requires understanding its impact on z/OS. assigning unique sequential integers to rows within partitioned windows. In production, architects resolve issues by applying the following solution: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) syntax.",
        "code": "SELECT EMPNO, ROW_NUMBER() OVER (PARTITION BY DEPTNO ORDER BY SALARY DESC) FROM EMP;",
        "tip": "PRO-TIP: When configuring window functions ROW_NUMBER, ensure your configurations follow current enterprise guidelines. Use DENSE_RANK() if you need matching ranks for duplicate sorted values without skipping integers.",
        "quizOptions": [
            "ROW_NUMBER requires temporary indexes",
            "ROW_NUMBER partitions rows into window groups and computes row ranks dynamically per group",
            "ROW_NUMBER is only for SELECT INTO single rows",
            "ROW_NUMBER modifies database keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_026",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What are the differences between legacy and modern approaches to handling Stage 1 sargable predicates?",
        "answer": "Dealing with Stage 1 sargable predicates requires understanding its impact on z/OS. efficient query filters processed directly by the DB2 Data Manager (DM) during I/O. In production, architects resolve issues by applying the following solution: Avoid mathematical operations, functions, or data type conversion mismatches on filtered columns.",
        "code": "SELECT NAME FROM EMP WHERE SALARY > 50000; * Stage 1 filter",
        "tip": "PRO-TIP: When configuring Stage 1 sargable predicates, ensure your configurations follow current enterprise guidelines. Stage 1 filters are highly efficient because rows are skipped before being copied to RDS memory buffers.",
        "quizOptions": [
            "Stage 1 filters are slow",
            "Stage 1 (sargable) predicates are processed directly by the Data Manager, minimizing data copy and CPU cycles",
            "Stage 1 requires CICS maps",
            "Stage 1 predicates require temporary tables"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_027",
        "category": "SQL",
        "level": "Expert",
        "question": "Describe a debugging technique to track and solve errors with Stage 2 residual predicates using standard utilities.",
        "answer": "Dealing with Stage 2 residual predicates requires understanding its impact on z/OS. slower query filters evaluated by the Relational Data System (RDS) after copying data. In production, architects resolve issues by applying the following solution: Rewrite expressions to isolate columns: e.g. SALARY > 50000/12 instead of SALARY * 12 > 50000.",
        "code": "SELECT NAME FROM EMP WHERE SALARY * 1.1 > 100000; * Stage 2 filter",
        "tip": "PRO-TIP: When configuring Stage 2 residual predicates, ensure your configurations follow current enterprise guidelines. Applying functions (like YEAR(HIREDATE) = 2026) forces Stage 2 processing and disables index usage.",
        "quizOptions": [
            "Stage 2 predicates are faster",
            "Stage 2 (residual) predicates require copying pages to memory first for evaluation by the Relational Data System",
            "Stage 2 filters are processed on tape",
            "Stage 2 predicates cannot use WHERE clauses"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_028",
        "category": "SQL",
        "level": "Beginner",
        "question": "How do storage administrators optimize the allocation and block size parameters for EXISTS vs IN subqueries optimization?",
        "answer": "Dealing with EXISTS vs IN subqueries optimization requires understanding its impact on z/OS. evaluating record presence in child subqueries efficiently. In production, architects resolve issues by applying the following solution: Use EXISTS for correlated checks (checks presence and stops); use IN for small literal sets.",
        "code": "SELECT * FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DID = D.ID);",
        "tip": "PRO-TIP: When configuring EXISTS vs IN subqueries optimization, ensure your configurations follow current enterprise guidelines. EXISTS halts subquery scanning immediately upon finding the first match, saving I/O.",
        "quizOptions": [
            "IN is always faster than EXISTS",
            "EXISTS stops scanning on the first match, making it highly efficient for correlated subquery presence checks",
            "Both require full table scans",
            "EXISTS requires temporary tablespaces"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_029",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Explain the connection between CASE conditional expressions and z/OS workload management priorities.",
        "answer": "Dealing with CASE conditional expressions requires understanding its impact on z/OS. evaluating multi-branch logic directly within select or update statements. In production, architects resolve issues by applying the following solution: Use CASE WHEN condition THEN val1 ELSE val2 END syntax.",
        "code": "SELECT NAME, CASE WHEN SAL > 100000 THEN 'HIGH' ELSE 'STD' END FROM EMP;",
        "tip": "PRO-TIP: When configuring CASE conditional expressions, ensure your configurations follow current enterprise guidelines. CASE is processed on the database server, reducing the need to process conditionals in COBOL.",
        "quizOptions": [
            "CASE is only used in WHERE clauses",
            "CASE conditional statements return values based on evaluated branch conditions inside queries",
            "CASE requires BIND PLAN re-initialization",
            "CASE is a JCL utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_030",
        "category": "SQL",
        "level": "Expert",
        "question": "What RACF authorizations and security constraints govern optimistic locking ROW_CHANGE_TIMESTAMP inside enterprise databases?",
        "answer": "Dealing with optimistic locking ROW_CHANGE_TIMESTAMP requires understanding its impact on z/OS. detecting concurrent table updates without holding locks during user edits. In production, architects resolve issues by applying the following solution: Define ROW_CHANGE_TIMESTAMP column. Select its value, and filter by it in the UPDATE statement.",
        "code": "UPDATE EMP SET SAL = 60000 WHERE ID = 10 AND TS = :ORIGINAL-TS;",
        "tip": "PRO-TIP: When configuring optimistic locking ROW_CHANGE_TIMESTAMP, ensure your configurations follow current enterprise guidelines. If the row was modified by another task, the timestamp changes, and the update affects 0 rows.",
        "quizOptions": [
            "Optimistic locking blocks other queries",
            "Optimistic locking checks row version/timestamp at update time; if it changed, the update is rejected (0 rows affected)",
            "Optimistic locking is managed in CICS tables only",
            "It locks the entire tablespace"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_031",
        "category": "SQL",
        "level": "Beginner",
        "question": "How do you debug an issue related to HAVING vs WHERE queries in a high-volume production environment?",
        "answer": "Dealing with HAVING vs WHERE queries requires understanding its impact on z/OS. filtering data before grouping (WHERE) vs after grouping (HAVING). In production, architects resolve issues by applying the following solution: Use WHERE for row filters. Use HAVING for aggregated metrics.",
        "code": "SELECT DEPT, AVG(SAL) FROM EMP WHERE SAL > 50000 GROUP BY DEPT HAVING AVG(SAL) > 60000;",
        "tip": "PRO-TIP: When configuring HAVING vs WHERE queries, ensure your configurations follow current enterprise guidelines. Optimize queries by putting filters in WHERE whenever possible, reducing rows before grouping.",
        "quizOptions": [
            "WHERE and HAVING are identical",
            "WHERE filters rows before GROUP BY aggregation; HAVING filters groups after aggregation",
            "HAVING filters rows before GROUP BY",
            "WHERE can use aggregate functions like SUM"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_032",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What are the performance implications of DB2 SQL join patterns under concurrent processing workloads?",
        "answer": "Dealing with DB2 SQL join patterns requires understanding its impact on z/OS. joining tables using INNER, LEFT OUTER, RIGHT OUTER, and FULL OUTER joins. In production, architects resolve issues by applying the following solution: Select appropriate join based on whether unmatched rows must be retained.",
        "code": "SELECT E.NAME, D.NAME FROM EMP E LEFT JOIN DEPT D ON E.DID = D.ID;",
        "tip": "PRO-TIP: When configuring DB2 SQL join patterns, ensure your configurations follow current enterprise guidelines. LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.",
        "quizOptions": [
            "INNER JOIN returns unmatched rows",
            "INNER JOIN returns matches only; LEFT/RIGHT OUTER returns unmatched rows from one side; FULL returns all",
            "CROSS JOIN requires a join key",
            "OUTER joins are slower than subqueries"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_033",
        "category": "SQL",
        "level": "Expert",
        "question": "What is the architectural best practice for designing Common Table Expressions (CTE) in a hybrid cloud integration?",
        "answer": "Dealing with Common Table Expressions (CTE) requires understanding its impact on z/OS. defining temporary named result sets within a query statement. In production, architects resolve issues by applying the following solution: Use WITH CTE_NAME (columns) AS (SELECT ...) query syntax.",
        "code": "WITH HIGHSAL AS (SELECT * FROM EMP WHERE SAL > 100000)\nSELECT * FROM HIGHSAL WHERE DEPT = 10;",
        "tip": "PRO-TIP: When configuring Common Table Expressions (CTE), ensure your configurations follow current enterprise guidelines. CTEs make complex nesting readable and can be referenced multiple times in the main query.",
        "quizOptions": [
            "CTEs create physical tables on disk",
            "CTEs define inline temporary named queries that act as virtual tables for the primary query",
            "CTEs only work for DB2 stored procedures",
            "CTEs require index-only scans"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_034",
        "category": "SQL",
        "level": "Beginner",
        "question": "Explain a scenario where misconfiguring recursive CTEs hierarchies causes database locking or transaction abends.",
        "answer": "Dealing with recursive CTEs hierarchies requires understanding its impact on z/OS. traversing tree structures or hierarchical tables (like manager-employee). In production, architects resolve issues by applying the following solution: Define CTE containing anchor query UNION ALL recursive query referencing the CTE.",
        "code": "WITH ORG (ID, BOSS, LVL) AS (\n  SELECT ID, BOSS, 1 FROM EMP WHERE BOSS IS NULL\n  UNION ALL\n  SELECT E.ID, E.BOSS, O.LVL + 1 FROM EMP E JOIN ORG O ON E.BOSS = O.ID\n) SELECT * FROM ORG;",
        "tip": "PRO-TIP: When configuring recursive CTEs hierarchies, ensure your configurations follow current enterprise guidelines. Always include a termination check or level indicator to prevent infinite loops.",
        "quizOptions": [
            "Recursive CTEs are not supported in DB2",
            "They use UNION ALL joining anchor records with child records recursively to map hierarchical tree nodes",
            "Recursive CTEs write to temporary tapes",
            "They require cursor loops in COBOL"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_035",
        "category": "SQL",
        "level": "Intermediate",
        "question": "How does the operating system or subsystem manage window functions ROW_NUMBER under high CPU utilization?",
        "answer": "Dealing with window functions ROW_NUMBER requires understanding its impact on z/OS. assigning unique sequential integers to rows within partitioned windows. In production, architects resolve issues by applying the following solution: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) syntax.",
        "code": "SELECT EMPNO, ROW_NUMBER() OVER (PARTITION BY DEPTNO ORDER BY SALARY DESC) FROM EMP;",
        "tip": "PRO-TIP: When configuring window functions ROW_NUMBER, ensure your configurations follow current enterprise guidelines. Use DENSE_RANK() if you need matching ranks for duplicate sorted values without skipping integers.",
        "quizOptions": [
            "ROW_NUMBER requires temporary indexes",
            "ROW_NUMBER partitions rows into window groups and computes row ranks dynamically per group",
            "ROW_NUMBER is only for SELECT INTO single rows",
            "ROW_NUMBER modifies database keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_036",
        "category": "SQL",
        "level": "Expert",
        "question": "What are the differences between legacy and modern approaches to handling Stage 1 sargable predicates?",
        "answer": "Dealing with Stage 1 sargable predicates requires understanding its impact on z/OS. efficient query filters processed directly by the DB2 Data Manager (DM) during I/O. In production, architects resolve issues by applying the following solution: Avoid mathematical operations, functions, or data type conversion mismatches on filtered columns.",
        "code": "SELECT NAME FROM EMP WHERE SALARY > 50000; * Stage 1 filter",
        "tip": "PRO-TIP: When configuring Stage 1 sargable predicates, ensure your configurations follow current enterprise guidelines. Stage 1 filters are highly efficient because rows are skipped before being copied to RDS memory buffers.",
        "quizOptions": [
            "Stage 1 filters are slow",
            "Stage 1 (sargable) predicates are processed directly by the Data Manager, minimizing data copy and CPU cycles",
            "Stage 1 requires CICS maps",
            "Stage 1 predicates require temporary tables"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_037",
        "category": "SQL",
        "level": "Beginner",
        "question": "Describe a debugging technique to track and solve errors with Stage 2 residual predicates using standard utilities.",
        "answer": "Dealing with Stage 2 residual predicates requires understanding its impact on z/OS. slower query filters evaluated by the Relational Data System (RDS) after copying data. In production, architects resolve issues by applying the following solution: Rewrite expressions to isolate columns: e.g. SALARY > 50000/12 instead of SALARY * 12 > 50000.",
        "code": "SELECT NAME FROM EMP WHERE SALARY * 1.1 > 100000; * Stage 2 filter",
        "tip": "PRO-TIP: When configuring Stage 2 residual predicates, ensure your configurations follow current enterprise guidelines. Applying functions (like YEAR(HIREDATE) = 2026) forces Stage 2 processing and disables index usage.",
        "quizOptions": [
            "Stage 2 predicates are faster",
            "Stage 2 (residual) predicates require copying pages to memory first for evaluation by the Relational Data System",
            "Stage 2 filters are processed on tape",
            "Stage 2 predicates cannot use WHERE clauses"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_038",
        "category": "SQL",
        "level": "Intermediate",
        "question": "How do storage administrators optimize the allocation and block size parameters for EXISTS vs IN subqueries optimization?",
        "answer": "Dealing with EXISTS vs IN subqueries optimization requires understanding its impact on z/OS. evaluating record presence in child subqueries efficiently. In production, architects resolve issues by applying the following solution: Use EXISTS for correlated checks (checks presence and stops); use IN for small literal sets.",
        "code": "SELECT * FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DID = D.ID);",
        "tip": "PRO-TIP: When configuring EXISTS vs IN subqueries optimization, ensure your configurations follow current enterprise guidelines. EXISTS halts subquery scanning immediately upon finding the first match, saving I/O.",
        "quizOptions": [
            "IN is always faster than EXISTS",
            "EXISTS stops scanning on the first match, making it highly efficient for correlated subquery presence checks",
            "Both require full table scans",
            "EXISTS requires temporary tablespaces"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_039",
        "category": "SQL",
        "level": "Expert",
        "question": "Explain the connection between CASE conditional expressions and z/OS workload management priorities.",
        "answer": "Dealing with CASE conditional expressions requires understanding its impact on z/OS. evaluating multi-branch logic directly within select or update statements. In production, architects resolve issues by applying the following solution: Use CASE WHEN condition THEN val1 ELSE val2 END syntax.",
        "code": "SELECT NAME, CASE WHEN SAL > 100000 THEN 'HIGH' ELSE 'STD' END FROM EMP;",
        "tip": "PRO-TIP: When configuring CASE conditional expressions, ensure your configurations follow current enterprise guidelines. CASE is processed on the database server, reducing the need to process conditionals in COBOL.",
        "quizOptions": [
            "CASE is only used in WHERE clauses",
            "CASE conditional statements return values based on evaluated branch conditions inside queries",
            "CASE requires BIND PLAN re-initialization",
            "CASE is a JCL utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_040",
        "category": "SQL",
        "level": "Beginner",
        "question": "What RACF authorizations and security constraints govern optimistic locking ROW_CHANGE_TIMESTAMP inside enterprise databases?",
        "answer": "Dealing with optimistic locking ROW_CHANGE_TIMESTAMP requires understanding its impact on z/OS. detecting concurrent table updates without holding locks during user edits. In production, architects resolve issues by applying the following solution: Define ROW_CHANGE_TIMESTAMP column. Select its value, and filter by it in the UPDATE statement.",
        "code": "UPDATE EMP SET SAL = 60000 WHERE ID = 10 AND TS = :ORIGINAL-TS;",
        "tip": "PRO-TIP: When configuring optimistic locking ROW_CHANGE_TIMESTAMP, ensure your configurations follow current enterprise guidelines. If the row was modified by another task, the timestamp changes, and the update affects 0 rows.",
        "quizOptions": [
            "Optimistic locking blocks other queries",
            "Optimistic locking checks row version/timestamp at update time; if it changed, the update is rejected (0 rows affected)",
            "Optimistic locking is managed in CICS tables only",
            "It locks the entire tablespace"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_041",
        "category": "SQL",
        "level": "Intermediate",
        "question": "How do you debug an issue related to HAVING vs WHERE queries in a high-volume production environment?",
        "answer": "Dealing with HAVING vs WHERE queries requires understanding its impact on z/OS. filtering data before grouping (WHERE) vs after grouping (HAVING). In production, architects resolve issues by applying the following solution: Use WHERE for row filters. Use HAVING for aggregated metrics.",
        "code": "SELECT DEPT, AVG(SAL) FROM EMP WHERE SAL > 50000 GROUP BY DEPT HAVING AVG(SAL) > 60000;",
        "tip": "PRO-TIP: When configuring HAVING vs WHERE queries, ensure your configurations follow current enterprise guidelines. Optimize queries by putting filters in WHERE whenever possible, reducing rows before grouping.",
        "quizOptions": [
            "WHERE and HAVING are identical",
            "WHERE filters rows before GROUP BY aggregation; HAVING filters groups after aggregation",
            "HAVING filters rows before GROUP BY",
            "WHERE can use aggregate functions like SUM"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_042",
        "category": "SQL",
        "level": "Expert",
        "question": "What are the performance implications of DB2 SQL join patterns under concurrent processing workloads?",
        "answer": "Dealing with DB2 SQL join patterns requires understanding its impact on z/OS. joining tables using INNER, LEFT OUTER, RIGHT OUTER, and FULL OUTER joins. In production, architects resolve issues by applying the following solution: Select appropriate join based on whether unmatched rows must be retained.",
        "code": "SELECT E.NAME, D.NAME FROM EMP E LEFT JOIN DEPT D ON E.DID = D.ID;",
        "tip": "PRO-TIP: When configuring DB2 SQL join patterns, ensure your configurations follow current enterprise guidelines. LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.",
        "quizOptions": [
            "INNER JOIN returns unmatched rows",
            "INNER JOIN returns matches only; LEFT/RIGHT OUTER returns unmatched rows from one side; FULL returns all",
            "CROSS JOIN requires a join key",
            "OUTER joins are slower than subqueries"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_043",
        "category": "SQL",
        "level": "Beginner",
        "question": "What is the architectural best practice for designing Common Table Expressions (CTE) in a hybrid cloud integration?",
        "answer": "Dealing with Common Table Expressions (CTE) requires understanding its impact on z/OS. defining temporary named result sets within a query statement. In production, architects resolve issues by applying the following solution: Use WITH CTE_NAME (columns) AS (SELECT ...) query syntax.",
        "code": "WITH HIGHSAL AS (SELECT * FROM EMP WHERE SAL > 100000)\nSELECT * FROM HIGHSAL WHERE DEPT = 10;",
        "tip": "PRO-TIP: When configuring Common Table Expressions (CTE), ensure your configurations follow current enterprise guidelines. CTEs make complex nesting readable and can be referenced multiple times in the main query.",
        "quizOptions": [
            "CTEs create physical tables on disk",
            "CTEs define inline temporary named queries that act as virtual tables for the primary query",
            "CTEs only work for DB2 stored procedures",
            "CTEs require index-only scans"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_044",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Explain a scenario where misconfiguring recursive CTEs hierarchies causes database locking or transaction abends.",
        "answer": "Dealing with recursive CTEs hierarchies requires understanding its impact on z/OS. traversing tree structures or hierarchical tables (like manager-employee). In production, architects resolve issues by applying the following solution: Define CTE containing anchor query UNION ALL recursive query referencing the CTE.",
        "code": "WITH ORG (ID, BOSS, LVL) AS (\n  SELECT ID, BOSS, 1 FROM EMP WHERE BOSS IS NULL\n  UNION ALL\n  SELECT E.ID, E.BOSS, O.LVL + 1 FROM EMP E JOIN ORG O ON E.BOSS = O.ID\n) SELECT * FROM ORG;",
        "tip": "PRO-TIP: When configuring recursive CTEs hierarchies, ensure your configurations follow current enterprise guidelines. Always include a termination check or level indicator to prevent infinite loops.",
        "quizOptions": [
            "Recursive CTEs are not supported in DB2",
            "They use UNION ALL joining anchor records with child records recursively to map hierarchical tree nodes",
            "Recursive CTEs write to temporary tapes",
            "They require cursor loops in COBOL"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_045",
        "category": "SQL",
        "level": "Expert",
        "question": "How does the operating system or subsystem manage window functions ROW_NUMBER under high CPU utilization?",
        "answer": "Dealing with window functions ROW_NUMBER requires understanding its impact on z/OS. assigning unique sequential integers to rows within partitioned windows. In production, architects resolve issues by applying the following solution: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) syntax.",
        "code": "SELECT EMPNO, ROW_NUMBER() OVER (PARTITION BY DEPTNO ORDER BY SALARY DESC) FROM EMP;",
        "tip": "PRO-TIP: When configuring window functions ROW_NUMBER, ensure your configurations follow current enterprise guidelines. Use DENSE_RANK() if you need matching ranks for duplicate sorted values without skipping integers.",
        "quizOptions": [
            "ROW_NUMBER requires temporary indexes",
            "ROW_NUMBER partitions rows into window groups and computes row ranks dynamically per group",
            "ROW_NUMBER is only for SELECT INTO single rows",
            "ROW_NUMBER modifies database keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_046",
        "category": "SQL",
        "level": "Beginner",
        "question": "What are the differences between legacy and modern approaches to handling Stage 1 sargable predicates?",
        "answer": "Dealing with Stage 1 sargable predicates requires understanding its impact on z/OS. efficient query filters processed directly by the DB2 Data Manager (DM) during I/O. In production, architects resolve issues by applying the following solution: Avoid mathematical operations, functions, or data type conversion mismatches on filtered columns.",
        "code": "SELECT NAME FROM EMP WHERE SALARY > 50000; * Stage 1 filter",
        "tip": "PRO-TIP: When configuring Stage 1 sargable predicates, ensure your configurations follow current enterprise guidelines. Stage 1 filters are highly efficient because rows are skipped before being copied to RDS memory buffers.",
        "quizOptions": [
            "Stage 1 filters are slow",
            "Stage 1 (sargable) predicates are processed directly by the Data Manager, minimizing data copy and CPU cycles",
            "Stage 1 requires CICS maps",
            "Stage 1 predicates require temporary tables"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_047",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Describe a debugging technique to track and solve errors with Stage 2 residual predicates using standard utilities.",
        "answer": "Dealing with Stage 2 residual predicates requires understanding its impact on z/OS. slower query filters evaluated by the Relational Data System (RDS) after copying data. In production, architects resolve issues by applying the following solution: Rewrite expressions to isolate columns: e.g. SALARY > 50000/12 instead of SALARY * 12 > 50000.",
        "code": "SELECT NAME FROM EMP WHERE SALARY * 1.1 > 100000; * Stage 2 filter",
        "tip": "PRO-TIP: When configuring Stage 2 residual predicates, ensure your configurations follow current enterprise guidelines. Applying functions (like YEAR(HIREDATE) = 2026) forces Stage 2 processing and disables index usage.",
        "quizOptions": [
            "Stage 2 predicates are faster",
            "Stage 2 (residual) predicates require copying pages to memory first for evaluation by the Relational Data System",
            "Stage 2 filters are processed on tape",
            "Stage 2 predicates cannot use WHERE clauses"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_048",
        "category": "SQL",
        "level": "Expert",
        "question": "How do storage administrators optimize the allocation and block size parameters for EXISTS vs IN subqueries optimization?",
        "answer": "Dealing with EXISTS vs IN subqueries optimization requires understanding its impact on z/OS. evaluating record presence in child subqueries efficiently. In production, architects resolve issues by applying the following solution: Use EXISTS for correlated checks (checks presence and stops); use IN for small literal sets.",
        "code": "SELECT * FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DID = D.ID);",
        "tip": "PRO-TIP: When configuring EXISTS vs IN subqueries optimization, ensure your configurations follow current enterprise guidelines. EXISTS halts subquery scanning immediately upon finding the first match, saving I/O.",
        "quizOptions": [
            "IN is always faster than EXISTS",
            "EXISTS stops scanning on the first match, making it highly efficient for correlated subquery presence checks",
            "Both require full table scans",
            "EXISTS requires temporary tablespaces"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_049",
        "category": "SQL",
        "level": "Beginner",
        "question": "Explain the connection between CASE conditional expressions and z/OS workload management priorities.",
        "answer": "Dealing with CASE conditional expressions requires understanding its impact on z/OS. evaluating multi-branch logic directly within select or update statements. In production, architects resolve issues by applying the following solution: Use CASE WHEN condition THEN val1 ELSE val2 END syntax.",
        "code": "SELECT NAME, CASE WHEN SAL > 100000 THEN 'HIGH' ELSE 'STD' END FROM EMP;",
        "tip": "PRO-TIP: When configuring CASE conditional expressions, ensure your configurations follow current enterprise guidelines. CASE is processed on the database server, reducing the need to process conditionals in COBOL.",
        "quizOptions": [
            "CASE is only used in WHERE clauses",
            "CASE conditional statements return values based on evaluated branch conditions inside queries",
            "CASE requires BIND PLAN re-initialization",
            "CASE is a JCL utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_050",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What RACF authorizations and security constraints govern optimistic locking ROW_CHANGE_TIMESTAMP inside enterprise databases?",
        "answer": "Dealing with optimistic locking ROW_CHANGE_TIMESTAMP requires understanding its impact on z/OS. detecting concurrent table updates without holding locks during user edits. In production, architects resolve issues by applying the following solution: Define ROW_CHANGE_TIMESTAMP column. Select its value, and filter by it in the UPDATE statement.",
        "code": "UPDATE EMP SET SAL = 60000 WHERE ID = 10 AND TS = :ORIGINAL-TS;",
        "tip": "PRO-TIP: When configuring optimistic locking ROW_CHANGE_TIMESTAMP, ensure your configurations follow current enterprise guidelines. If the row was modified by another task, the timestamp changes, and the update affects 0 rows.",
        "quizOptions": [
            "Optimistic locking blocks other queries",
            "Optimistic locking checks row version/timestamp at update time; if it changed, the update is rejected (0 rows affected)",
            "Optimistic locking is managed in CICS tables only",
            "It locks the entire tablespace"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_051",
        "category": "SQL",
        "level": "Expert",
        "question": "How do you debug an issue related to HAVING vs WHERE queries in a high-volume production environment?",
        "answer": "Dealing with HAVING vs WHERE queries requires understanding its impact on z/OS. filtering data before grouping (WHERE) vs after grouping (HAVING). In production, architects resolve issues by applying the following solution: Use WHERE for row filters. Use HAVING for aggregated metrics.",
        "code": "SELECT DEPT, AVG(SAL) FROM EMP WHERE SAL > 50000 GROUP BY DEPT HAVING AVG(SAL) > 60000;",
        "tip": "PRO-TIP: When configuring HAVING vs WHERE queries, ensure your configurations follow current enterprise guidelines. Optimize queries by putting filters in WHERE whenever possible, reducing rows before grouping.",
        "quizOptions": [
            "WHERE and HAVING are identical",
            "WHERE filters rows before GROUP BY aggregation; HAVING filters groups after aggregation",
            "HAVING filters rows before GROUP BY",
            "WHERE can use aggregate functions like SUM"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_052",
        "category": "SQL",
        "level": "Beginner",
        "question": "What are the performance implications of DB2 SQL join patterns under concurrent processing workloads?",
        "answer": "Dealing with DB2 SQL join patterns requires understanding its impact on z/OS. joining tables using INNER, LEFT OUTER, RIGHT OUTER, and FULL OUTER joins. In production, architects resolve issues by applying the following solution: Select appropriate join based on whether unmatched rows must be retained.",
        "code": "SELECT E.NAME, D.NAME FROM EMP E LEFT JOIN DEPT D ON E.DID = D.ID;",
        "tip": "PRO-TIP: When configuring DB2 SQL join patterns, ensure your configurations follow current enterprise guidelines. LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.",
        "quizOptions": [
            "INNER JOIN returns unmatched rows",
            "INNER JOIN returns matches only; LEFT/RIGHT OUTER returns unmatched rows from one side; FULL returns all",
            "CROSS JOIN requires a join key",
            "OUTER joins are slower than subqueries"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_053",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What is the architectural best practice for designing Common Table Expressions (CTE) in a hybrid cloud integration?",
        "answer": "Dealing with Common Table Expressions (CTE) requires understanding its impact on z/OS. defining temporary named result sets within a query statement. In production, architects resolve issues by applying the following solution: Use WITH CTE_NAME (columns) AS (SELECT ...) query syntax.",
        "code": "WITH HIGHSAL AS (SELECT * FROM EMP WHERE SAL > 100000)\nSELECT * FROM HIGHSAL WHERE DEPT = 10;",
        "tip": "PRO-TIP: When configuring Common Table Expressions (CTE), ensure your configurations follow current enterprise guidelines. CTEs make complex nesting readable and can be referenced multiple times in the main query.",
        "quizOptions": [
            "CTEs create physical tables on disk",
            "CTEs define inline temporary named queries that act as virtual tables for the primary query",
            "CTEs only work for DB2 stored procedures",
            "CTEs require index-only scans"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_054",
        "category": "SQL",
        "level": "Expert",
        "question": "Explain a scenario where misconfiguring recursive CTEs hierarchies causes database locking or transaction abends.",
        "answer": "Dealing with recursive CTEs hierarchies requires understanding its impact on z/OS. traversing tree structures or hierarchical tables (like manager-employee). In production, architects resolve issues by applying the following solution: Define CTE containing anchor query UNION ALL recursive query referencing the CTE.",
        "code": "WITH ORG (ID, BOSS, LVL) AS (\n  SELECT ID, BOSS, 1 FROM EMP WHERE BOSS IS NULL\n  UNION ALL\n  SELECT E.ID, E.BOSS, O.LVL + 1 FROM EMP E JOIN ORG O ON E.BOSS = O.ID\n) SELECT * FROM ORG;",
        "tip": "PRO-TIP: When configuring recursive CTEs hierarchies, ensure your configurations follow current enterprise guidelines. Always include a termination check or level indicator to prevent infinite loops.",
        "quizOptions": [
            "Recursive CTEs are not supported in DB2",
            "They use UNION ALL joining anchor records with child records recursively to map hierarchical tree nodes",
            "Recursive CTEs write to temporary tapes",
            "They require cursor loops in COBOL"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_055",
        "category": "SQL",
        "level": "Beginner",
        "question": "How does the operating system or subsystem manage window functions ROW_NUMBER under high CPU utilization?",
        "answer": "Dealing with window functions ROW_NUMBER requires understanding its impact on z/OS. assigning unique sequential integers to rows within partitioned windows. In production, architects resolve issues by applying the following solution: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) syntax.",
        "code": "SELECT EMPNO, ROW_NUMBER() OVER (PARTITION BY DEPTNO ORDER BY SALARY DESC) FROM EMP;",
        "tip": "PRO-TIP: When configuring window functions ROW_NUMBER, ensure your configurations follow current enterprise guidelines. Use DENSE_RANK() if you need matching ranks for duplicate sorted values without skipping integers.",
        "quizOptions": [
            "ROW_NUMBER requires temporary indexes",
            "ROW_NUMBER partitions rows into window groups and computes row ranks dynamically per group",
            "ROW_NUMBER is only for SELECT INTO single rows",
            "ROW_NUMBER modifies database keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_056",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What are the differences between legacy and modern approaches to handling Stage 1 sargable predicates?",
        "answer": "Dealing with Stage 1 sargable predicates requires understanding its impact on z/OS. efficient query filters processed directly by the DB2 Data Manager (DM) during I/O. In production, architects resolve issues by applying the following solution: Avoid mathematical operations, functions, or data type conversion mismatches on filtered columns.",
        "code": "SELECT NAME FROM EMP WHERE SALARY > 50000; * Stage 1 filter",
        "tip": "PRO-TIP: When configuring Stage 1 sargable predicates, ensure your configurations follow current enterprise guidelines. Stage 1 filters are highly efficient because rows are skipped before being copied to RDS memory buffers.",
        "quizOptions": [
            "Stage 1 filters are slow",
            "Stage 1 (sargable) predicates are processed directly by the Data Manager, minimizing data copy and CPU cycles",
            "Stage 1 requires CICS maps",
            "Stage 1 predicates require temporary tables"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_057",
        "category": "SQL",
        "level": "Expert",
        "question": "Describe a debugging technique to track and solve errors with Stage 2 residual predicates using standard utilities.",
        "answer": "Dealing with Stage 2 residual predicates requires understanding its impact on z/OS. slower query filters evaluated by the Relational Data System (RDS) after copying data. In production, architects resolve issues by applying the following solution: Rewrite expressions to isolate columns: e.g. SALARY > 50000/12 instead of SALARY * 12 > 50000.",
        "code": "SELECT NAME FROM EMP WHERE SALARY * 1.1 > 100000; * Stage 2 filter",
        "tip": "PRO-TIP: When configuring Stage 2 residual predicates, ensure your configurations follow current enterprise guidelines. Applying functions (like YEAR(HIREDATE) = 2026) forces Stage 2 processing and disables index usage.",
        "quizOptions": [
            "Stage 2 predicates are faster",
            "Stage 2 (residual) predicates require copying pages to memory first for evaluation by the Relational Data System",
            "Stage 2 filters are processed on tape",
            "Stage 2 predicates cannot use WHERE clauses"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_058",
        "category": "SQL",
        "level": "Beginner",
        "question": "How do storage administrators optimize the allocation and block size parameters for EXISTS vs IN subqueries optimization?",
        "answer": "Dealing with EXISTS vs IN subqueries optimization requires understanding its impact on z/OS. evaluating record presence in child subqueries efficiently. In production, architects resolve issues by applying the following solution: Use EXISTS for correlated checks (checks presence and stops); use IN for small literal sets.",
        "code": "SELECT * FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DID = D.ID);",
        "tip": "PRO-TIP: When configuring EXISTS vs IN subqueries optimization, ensure your configurations follow current enterprise guidelines. EXISTS halts subquery scanning immediately upon finding the first match, saving I/O.",
        "quizOptions": [
            "IN is always faster than EXISTS",
            "EXISTS stops scanning on the first match, making it highly efficient for correlated subquery presence checks",
            "Both require full table scans",
            "EXISTS requires temporary tablespaces"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_059",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Explain the connection between CASE conditional expressions and z/OS workload management priorities.",
        "answer": "Dealing with CASE conditional expressions requires understanding its impact on z/OS. evaluating multi-branch logic directly within select or update statements. In production, architects resolve issues by applying the following solution: Use CASE WHEN condition THEN val1 ELSE val2 END syntax.",
        "code": "SELECT NAME, CASE WHEN SAL > 100000 THEN 'HIGH' ELSE 'STD' END FROM EMP;",
        "tip": "PRO-TIP: When configuring CASE conditional expressions, ensure your configurations follow current enterprise guidelines. CASE is processed on the database server, reducing the need to process conditionals in COBOL.",
        "quizOptions": [
            "CASE is only used in WHERE clauses",
            "CASE conditional statements return values based on evaluated branch conditions inside queries",
            "CASE requires BIND PLAN re-initialization",
            "CASE is a JCL utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_060",
        "category": "SQL",
        "level": "Expert",
        "question": "What RACF authorizations and security constraints govern optimistic locking ROW_CHANGE_TIMESTAMP inside enterprise databases?",
        "answer": "Dealing with optimistic locking ROW_CHANGE_TIMESTAMP requires understanding its impact on z/OS. detecting concurrent table updates without holding locks during user edits. In production, architects resolve issues by applying the following solution: Define ROW_CHANGE_TIMESTAMP column. Select its value, and filter by it in the UPDATE statement.",
        "code": "UPDATE EMP SET SAL = 60000 WHERE ID = 10 AND TS = :ORIGINAL-TS;",
        "tip": "PRO-TIP: When configuring optimistic locking ROW_CHANGE_TIMESTAMP, ensure your configurations follow current enterprise guidelines. If the row was modified by another task, the timestamp changes, and the update affects 0 rows.",
        "quizOptions": [
            "Optimistic locking blocks other queries",
            "Optimistic locking checks row version/timestamp at update time; if it changed, the update is rejected (0 rows affected)",
            "Optimistic locking is managed in CICS tables only",
            "It locks the entire tablespace"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_061",
        "category": "SQL",
        "level": "Beginner",
        "question": "How do you debug an issue related to HAVING vs WHERE queries in a high-volume production environment?",
        "answer": "Dealing with HAVING vs WHERE queries requires understanding its impact on z/OS. filtering data before grouping (WHERE) vs after grouping (HAVING). In production, architects resolve issues by applying the following solution: Use WHERE for row filters. Use HAVING for aggregated metrics.",
        "code": "SELECT DEPT, AVG(SAL) FROM EMP WHERE SAL > 50000 GROUP BY DEPT HAVING AVG(SAL) > 60000;",
        "tip": "PRO-TIP: When configuring HAVING vs WHERE queries, ensure your configurations follow current enterprise guidelines. Optimize queries by putting filters in WHERE whenever possible, reducing rows before grouping.",
        "quizOptions": [
            "WHERE and HAVING are identical",
            "WHERE filters rows before GROUP BY aggregation; HAVING filters groups after aggregation",
            "HAVING filters rows before GROUP BY",
            "WHERE can use aggregate functions like SUM"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_062",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What are the performance implications of DB2 SQL join patterns under concurrent processing workloads?",
        "answer": "Dealing with DB2 SQL join patterns requires understanding its impact on z/OS. joining tables using INNER, LEFT OUTER, RIGHT OUTER, and FULL OUTER joins. In production, architects resolve issues by applying the following solution: Select appropriate join based on whether unmatched rows must be retained.",
        "code": "SELECT E.NAME, D.NAME FROM EMP E LEFT JOIN DEPT D ON E.DID = D.ID;",
        "tip": "PRO-TIP: When configuring DB2 SQL join patterns, ensure your configurations follow current enterprise guidelines. LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.",
        "quizOptions": [
            "INNER JOIN returns unmatched rows",
            "INNER JOIN returns matches only; LEFT/RIGHT OUTER returns unmatched rows from one side; FULL returns all",
            "CROSS JOIN requires a join key",
            "OUTER joins are slower than subqueries"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_063",
        "category": "SQL",
        "level": "Expert",
        "question": "What is the architectural best practice for designing Common Table Expressions (CTE) in a hybrid cloud integration?",
        "answer": "Dealing with Common Table Expressions (CTE) requires understanding its impact on z/OS. defining temporary named result sets within a query statement. In production, architects resolve issues by applying the following solution: Use WITH CTE_NAME (columns) AS (SELECT ...) query syntax.",
        "code": "WITH HIGHSAL AS (SELECT * FROM EMP WHERE SAL > 100000)\nSELECT * FROM HIGHSAL WHERE DEPT = 10;",
        "tip": "PRO-TIP: When configuring Common Table Expressions (CTE), ensure your configurations follow current enterprise guidelines. CTEs make complex nesting readable and can be referenced multiple times in the main query.",
        "quizOptions": [
            "CTEs create physical tables on disk",
            "CTEs define inline temporary named queries that act as virtual tables for the primary query",
            "CTEs only work for DB2 stored procedures",
            "CTEs require index-only scans"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_064",
        "category": "SQL",
        "level": "Beginner",
        "question": "Explain a scenario where misconfiguring recursive CTEs hierarchies causes database locking or transaction abends.",
        "answer": "Dealing with recursive CTEs hierarchies requires understanding its impact on z/OS. traversing tree structures or hierarchical tables (like manager-employee). In production, architects resolve issues by applying the following solution: Define CTE containing anchor query UNION ALL recursive query referencing the CTE.",
        "code": "WITH ORG (ID, BOSS, LVL) AS (\n  SELECT ID, BOSS, 1 FROM EMP WHERE BOSS IS NULL\n  UNION ALL\n  SELECT E.ID, E.BOSS, O.LVL + 1 FROM EMP E JOIN ORG O ON E.BOSS = O.ID\n) SELECT * FROM ORG;",
        "tip": "PRO-TIP: When configuring recursive CTEs hierarchies, ensure your configurations follow current enterprise guidelines. Always include a termination check or level indicator to prevent infinite loops.",
        "quizOptions": [
            "Recursive CTEs are not supported in DB2",
            "They use UNION ALL joining anchor records with child records recursively to map hierarchical tree nodes",
            "Recursive CTEs write to temporary tapes",
            "They require cursor loops in COBOL"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_065",
        "category": "SQL",
        "level": "Intermediate",
        "question": "How does the operating system or subsystem manage window functions ROW_NUMBER under high CPU utilization?",
        "answer": "Dealing with window functions ROW_NUMBER requires understanding its impact on z/OS. assigning unique sequential integers to rows within partitioned windows. In production, architects resolve issues by applying the following solution: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) syntax.",
        "code": "SELECT EMPNO, ROW_NUMBER() OVER (PARTITION BY DEPTNO ORDER BY SALARY DESC) FROM EMP;",
        "tip": "PRO-TIP: When configuring window functions ROW_NUMBER, ensure your configurations follow current enterprise guidelines. Use DENSE_RANK() if you need matching ranks for duplicate sorted values without skipping integers.",
        "quizOptions": [
            "ROW_NUMBER requires temporary indexes",
            "ROW_NUMBER partitions rows into window groups and computes row ranks dynamically per group",
            "ROW_NUMBER is only for SELECT INTO single rows",
            "ROW_NUMBER modifies database keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_066",
        "category": "SQL",
        "level": "Expert",
        "question": "What are the differences between legacy and modern approaches to handling Stage 1 sargable predicates?",
        "answer": "Dealing with Stage 1 sargable predicates requires understanding its impact on z/OS. efficient query filters processed directly by the DB2 Data Manager (DM) during I/O. In production, architects resolve issues by applying the following solution: Avoid mathematical operations, functions, or data type conversion mismatches on filtered columns.",
        "code": "SELECT NAME FROM EMP WHERE SALARY > 50000; * Stage 1 filter",
        "tip": "PRO-TIP: When configuring Stage 1 sargable predicates, ensure your configurations follow current enterprise guidelines. Stage 1 filters are highly efficient because rows are skipped before being copied to RDS memory buffers.",
        "quizOptions": [
            "Stage 1 filters are slow",
            "Stage 1 (sargable) predicates are processed directly by the Data Manager, minimizing data copy and CPU cycles",
            "Stage 1 requires CICS maps",
            "Stage 1 predicates require temporary tables"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_067",
        "category": "SQL",
        "level": "Beginner",
        "question": "Describe a debugging technique to track and solve errors with Stage 2 residual predicates using standard utilities.",
        "answer": "Dealing with Stage 2 residual predicates requires understanding its impact on z/OS. slower query filters evaluated by the Relational Data System (RDS) after copying data. In production, architects resolve issues by applying the following solution: Rewrite expressions to isolate columns: e.g. SALARY > 50000/12 instead of SALARY * 12 > 50000.",
        "code": "SELECT NAME FROM EMP WHERE SALARY * 1.1 > 100000; * Stage 2 filter",
        "tip": "PRO-TIP: When configuring Stage 2 residual predicates, ensure your configurations follow current enterprise guidelines. Applying functions (like YEAR(HIREDATE) = 2026) forces Stage 2 processing and disables index usage.",
        "quizOptions": [
            "Stage 2 predicates are faster",
            "Stage 2 (residual) predicates require copying pages to memory first for evaluation by the Relational Data System",
            "Stage 2 filters are processed on tape",
            "Stage 2 predicates cannot use WHERE clauses"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_068",
        "category": "SQL",
        "level": "Intermediate",
        "question": "How do storage administrators optimize the allocation and block size parameters for EXISTS vs IN subqueries optimization?",
        "answer": "Dealing with EXISTS vs IN subqueries optimization requires understanding its impact on z/OS. evaluating record presence in child subqueries efficiently. In production, architects resolve issues by applying the following solution: Use EXISTS for correlated checks (checks presence and stops); use IN for small literal sets.",
        "code": "SELECT * FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DID = D.ID);",
        "tip": "PRO-TIP: When configuring EXISTS vs IN subqueries optimization, ensure your configurations follow current enterprise guidelines. EXISTS halts subquery scanning immediately upon finding the first match, saving I/O.",
        "quizOptions": [
            "IN is always faster than EXISTS",
            "EXISTS stops scanning on the first match, making it highly efficient for correlated subquery presence checks",
            "Both require full table scans",
            "EXISTS requires temporary tablespaces"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_069",
        "category": "SQL",
        "level": "Expert",
        "question": "Explain the connection between CASE conditional expressions and z/OS workload management priorities.",
        "answer": "Dealing with CASE conditional expressions requires understanding its impact on z/OS. evaluating multi-branch logic directly within select or update statements. In production, architects resolve issues by applying the following solution: Use CASE WHEN condition THEN val1 ELSE val2 END syntax.",
        "code": "SELECT NAME, CASE WHEN SAL > 100000 THEN 'HIGH' ELSE 'STD' END FROM EMP;",
        "tip": "PRO-TIP: When configuring CASE conditional expressions, ensure your configurations follow current enterprise guidelines. CASE is processed on the database server, reducing the need to process conditionals in COBOL.",
        "quizOptions": [
            "CASE is only used in WHERE clauses",
            "CASE conditional statements return values based on evaluated branch conditions inside queries",
            "CASE requires BIND PLAN re-initialization",
            "CASE is a JCL utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_070",
        "category": "SQL",
        "level": "Beginner",
        "question": "What RACF authorizations and security constraints govern optimistic locking ROW_CHANGE_TIMESTAMP inside enterprise databases?",
        "answer": "Dealing with optimistic locking ROW_CHANGE_TIMESTAMP requires understanding its impact on z/OS. detecting concurrent table updates without holding locks during user edits. In production, architects resolve issues by applying the following solution: Define ROW_CHANGE_TIMESTAMP column. Select its value, and filter by it in the UPDATE statement.",
        "code": "UPDATE EMP SET SAL = 60000 WHERE ID = 10 AND TS = :ORIGINAL-TS;",
        "tip": "PRO-TIP: When configuring optimistic locking ROW_CHANGE_TIMESTAMP, ensure your configurations follow current enterprise guidelines. If the row was modified by another task, the timestamp changes, and the update affects 0 rows.",
        "quizOptions": [
            "Optimistic locking blocks other queries",
            "Optimistic locking checks row version/timestamp at update time; if it changed, the update is rejected (0 rows affected)",
            "Optimistic locking is managed in CICS tables only",
            "It locks the entire tablespace"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_071",
        "category": "SQL",
        "level": "Intermediate",
        "question": "How do you debug an issue related to HAVING vs WHERE queries in a high-volume production environment?",
        "answer": "Dealing with HAVING vs WHERE queries requires understanding its impact on z/OS. filtering data before grouping (WHERE) vs after grouping (HAVING). In production, architects resolve issues by applying the following solution: Use WHERE for row filters. Use HAVING for aggregated metrics.",
        "code": "SELECT DEPT, AVG(SAL) FROM EMP WHERE SAL > 50000 GROUP BY DEPT HAVING AVG(SAL) > 60000;",
        "tip": "PRO-TIP: When configuring HAVING vs WHERE queries, ensure your configurations follow current enterprise guidelines. Optimize queries by putting filters in WHERE whenever possible, reducing rows before grouping.",
        "quizOptions": [
            "WHERE and HAVING are identical",
            "WHERE filters rows before GROUP BY aggregation; HAVING filters groups after aggregation",
            "HAVING filters rows before GROUP BY",
            "WHERE can use aggregate functions like SUM"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_072",
        "category": "SQL",
        "level": "Expert",
        "question": "What are the performance implications of DB2 SQL join patterns under concurrent processing workloads?",
        "answer": "Dealing with DB2 SQL join patterns requires understanding its impact on z/OS. joining tables using INNER, LEFT OUTER, RIGHT OUTER, and FULL OUTER joins. In production, architects resolve issues by applying the following solution: Select appropriate join based on whether unmatched rows must be retained.",
        "code": "SELECT E.NAME, D.NAME FROM EMP E LEFT JOIN DEPT D ON E.DID = D.ID;",
        "tip": "PRO-TIP: When configuring DB2 SQL join patterns, ensure your configurations follow current enterprise guidelines. LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.",
        "quizOptions": [
            "INNER JOIN returns unmatched rows",
            "INNER JOIN returns matches only; LEFT/RIGHT OUTER returns unmatched rows from one side; FULL returns all",
            "CROSS JOIN requires a join key",
            "OUTER joins are slower than subqueries"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_073",
        "category": "SQL",
        "level": "Beginner",
        "question": "What is the architectural best practice for designing Common Table Expressions (CTE) in a hybrid cloud integration?",
        "answer": "Dealing with Common Table Expressions (CTE) requires understanding its impact on z/OS. defining temporary named result sets within a query statement. In production, architects resolve issues by applying the following solution: Use WITH CTE_NAME (columns) AS (SELECT ...) query syntax.",
        "code": "WITH HIGHSAL AS (SELECT * FROM EMP WHERE SAL > 100000)\nSELECT * FROM HIGHSAL WHERE DEPT = 10;",
        "tip": "PRO-TIP: When configuring Common Table Expressions (CTE), ensure your configurations follow current enterprise guidelines. CTEs make complex nesting readable and can be referenced multiple times in the main query.",
        "quizOptions": [
            "CTEs create physical tables on disk",
            "CTEs define inline temporary named queries that act as virtual tables for the primary query",
            "CTEs only work for DB2 stored procedures",
            "CTEs require index-only scans"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_074",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Explain a scenario where misconfiguring recursive CTEs hierarchies causes database locking or transaction abends.",
        "answer": "Dealing with recursive CTEs hierarchies requires understanding its impact on z/OS. traversing tree structures or hierarchical tables (like manager-employee). In production, architects resolve issues by applying the following solution: Define CTE containing anchor query UNION ALL recursive query referencing the CTE.",
        "code": "WITH ORG (ID, BOSS, LVL) AS (\n  SELECT ID, BOSS, 1 FROM EMP WHERE BOSS IS NULL\n  UNION ALL\n  SELECT E.ID, E.BOSS, O.LVL + 1 FROM EMP E JOIN ORG O ON E.BOSS = O.ID\n) SELECT * FROM ORG;",
        "tip": "PRO-TIP: When configuring recursive CTEs hierarchies, ensure your configurations follow current enterprise guidelines. Always include a termination check or level indicator to prevent infinite loops.",
        "quizOptions": [
            "Recursive CTEs are not supported in DB2",
            "They use UNION ALL joining anchor records with child records recursively to map hierarchical tree nodes",
            "Recursive CTEs write to temporary tapes",
            "They require cursor loops in COBOL"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_075",
        "category": "SQL",
        "level": "Expert",
        "question": "How does the operating system or subsystem manage window functions ROW_NUMBER under high CPU utilization?",
        "answer": "Dealing with window functions ROW_NUMBER requires understanding its impact on z/OS. assigning unique sequential integers to rows within partitioned windows. In production, architects resolve issues by applying the following solution: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) syntax.",
        "code": "SELECT EMPNO, ROW_NUMBER() OVER (PARTITION BY DEPTNO ORDER BY SALARY DESC) FROM EMP;",
        "tip": "PRO-TIP: When configuring window functions ROW_NUMBER, ensure your configurations follow current enterprise guidelines. Use DENSE_RANK() if you need matching ranks for duplicate sorted values without skipping integers.",
        "quizOptions": [
            "ROW_NUMBER requires temporary indexes",
            "ROW_NUMBER partitions rows into window groups and computes row ranks dynamically per group",
            "ROW_NUMBER is only for SELECT INTO single rows",
            "ROW_NUMBER modifies database keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_076",
        "category": "SQL",
        "level": "Beginner",
        "question": "What are the differences between legacy and modern approaches to handling Stage 1 sargable predicates?",
        "answer": "Dealing with Stage 1 sargable predicates requires understanding its impact on z/OS. efficient query filters processed directly by the DB2 Data Manager (DM) during I/O. In production, architects resolve issues by applying the following solution: Avoid mathematical operations, functions, or data type conversion mismatches on filtered columns.",
        "code": "SELECT NAME FROM EMP WHERE SALARY > 50000; * Stage 1 filter",
        "tip": "PRO-TIP: When configuring Stage 1 sargable predicates, ensure your configurations follow current enterprise guidelines. Stage 1 filters are highly efficient because rows are skipped before being copied to RDS memory buffers.",
        "quizOptions": [
            "Stage 1 filters are slow",
            "Stage 1 (sargable) predicates are processed directly by the Data Manager, minimizing data copy and CPU cycles",
            "Stage 1 requires CICS maps",
            "Stage 1 predicates require temporary tables"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_077",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Describe a debugging technique to track and solve errors with Stage 2 residual predicates using standard utilities.",
        "answer": "Dealing with Stage 2 residual predicates requires understanding its impact on z/OS. slower query filters evaluated by the Relational Data System (RDS) after copying data. In production, architects resolve issues by applying the following solution: Rewrite expressions to isolate columns: e.g. SALARY > 50000/12 instead of SALARY * 12 > 50000.",
        "code": "SELECT NAME FROM EMP WHERE SALARY * 1.1 > 100000; * Stage 2 filter",
        "tip": "PRO-TIP: When configuring Stage 2 residual predicates, ensure your configurations follow current enterprise guidelines. Applying functions (like YEAR(HIREDATE) = 2026) forces Stage 2 processing and disables index usage.",
        "quizOptions": [
            "Stage 2 predicates are faster",
            "Stage 2 (residual) predicates require copying pages to memory first for evaluation by the Relational Data System",
            "Stage 2 filters are processed on tape",
            "Stage 2 predicates cannot use WHERE clauses"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_078",
        "category": "SQL",
        "level": "Expert",
        "question": "How do storage administrators optimize the allocation and block size parameters for EXISTS vs IN subqueries optimization?",
        "answer": "Dealing with EXISTS vs IN subqueries optimization requires understanding its impact on z/OS. evaluating record presence in child subqueries efficiently. In production, architects resolve issues by applying the following solution: Use EXISTS for correlated checks (checks presence and stops); use IN for small literal sets.",
        "code": "SELECT * FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DID = D.ID);",
        "tip": "PRO-TIP: When configuring EXISTS vs IN subqueries optimization, ensure your configurations follow current enterprise guidelines. EXISTS halts subquery scanning immediately upon finding the first match, saving I/O.",
        "quizOptions": [
            "IN is always faster than EXISTS",
            "EXISTS stops scanning on the first match, making it highly efficient for correlated subquery presence checks",
            "Both require full table scans",
            "EXISTS requires temporary tablespaces"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_079",
        "category": "SQL",
        "level": "Beginner",
        "question": "Explain the connection between CASE conditional expressions and z/OS workload management priorities.",
        "answer": "Dealing with CASE conditional expressions requires understanding its impact on z/OS. evaluating multi-branch logic directly within select or update statements. In production, architects resolve issues by applying the following solution: Use CASE WHEN condition THEN val1 ELSE val2 END syntax.",
        "code": "SELECT NAME, CASE WHEN SAL > 100000 THEN 'HIGH' ELSE 'STD' END FROM EMP;",
        "tip": "PRO-TIP: When configuring CASE conditional expressions, ensure your configurations follow current enterprise guidelines. CASE is processed on the database server, reducing the need to process conditionals in COBOL.",
        "quizOptions": [
            "CASE is only used in WHERE clauses",
            "CASE conditional statements return values based on evaluated branch conditions inside queries",
            "CASE requires BIND PLAN re-initialization",
            "CASE is a JCL utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_080",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What RACF authorizations and security constraints govern optimistic locking ROW_CHANGE_TIMESTAMP inside enterprise databases?",
        "answer": "Dealing with optimistic locking ROW_CHANGE_TIMESTAMP requires understanding its impact on z/OS. detecting concurrent table updates without holding locks during user edits. In production, architects resolve issues by applying the following solution: Define ROW_CHANGE_TIMESTAMP column. Select its value, and filter by it in the UPDATE statement.",
        "code": "UPDATE EMP SET SAL = 60000 WHERE ID = 10 AND TS = :ORIGINAL-TS;",
        "tip": "PRO-TIP: When configuring optimistic locking ROW_CHANGE_TIMESTAMP, ensure your configurations follow current enterprise guidelines. If the row was modified by another task, the timestamp changes, and the update affects 0 rows.",
        "quizOptions": [
            "Optimistic locking blocks other queries",
            "Optimistic locking checks row version/timestamp at update time; if it changed, the update is rejected (0 rows affected)",
            "Optimistic locking is managed in CICS tables only",
            "It locks the entire tablespace"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_081",
        "category": "SQL",
        "level": "Expert",
        "question": "How do you debug an issue related to HAVING vs WHERE queries in a high-volume production environment?",
        "answer": "Dealing with HAVING vs WHERE queries requires understanding its impact on z/OS. filtering data before grouping (WHERE) vs after grouping (HAVING). In production, architects resolve issues by applying the following solution: Use WHERE for row filters. Use HAVING for aggregated metrics.",
        "code": "SELECT DEPT, AVG(SAL) FROM EMP WHERE SAL > 50000 GROUP BY DEPT HAVING AVG(SAL) > 60000;",
        "tip": "PRO-TIP: When configuring HAVING vs WHERE queries, ensure your configurations follow current enterprise guidelines. Optimize queries by putting filters in WHERE whenever possible, reducing rows before grouping.",
        "quizOptions": [
            "WHERE and HAVING are identical",
            "WHERE filters rows before GROUP BY aggregation; HAVING filters groups after aggregation",
            "HAVING filters rows before GROUP BY",
            "WHERE can use aggregate functions like SUM"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_082",
        "category": "SQL",
        "level": "Beginner",
        "question": "What are the performance implications of DB2 SQL join patterns under concurrent processing workloads?",
        "answer": "Dealing with DB2 SQL join patterns requires understanding its impact on z/OS. joining tables using INNER, LEFT OUTER, RIGHT OUTER, and FULL OUTER joins. In production, architects resolve issues by applying the following solution: Select appropriate join based on whether unmatched rows must be retained.",
        "code": "SELECT E.NAME, D.NAME FROM EMP E LEFT JOIN DEPT D ON E.DID = D.ID;",
        "tip": "PRO-TIP: When configuring DB2 SQL join patterns, ensure your configurations follow current enterprise guidelines. LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.",
        "quizOptions": [
            "INNER JOIN returns unmatched rows",
            "INNER JOIN returns matches only; LEFT/RIGHT OUTER returns unmatched rows from one side; FULL returns all",
            "CROSS JOIN requires a join key",
            "OUTER joins are slower than subqueries"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_083",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What is the architectural best practice for designing Common Table Expressions (CTE) in a hybrid cloud integration?",
        "answer": "Dealing with Common Table Expressions (CTE) requires understanding its impact on z/OS. defining temporary named result sets within a query statement. In production, architects resolve issues by applying the following solution: Use WITH CTE_NAME (columns) AS (SELECT ...) query syntax.",
        "code": "WITH HIGHSAL AS (SELECT * FROM EMP WHERE SAL > 100000)\nSELECT * FROM HIGHSAL WHERE DEPT = 10;",
        "tip": "PRO-TIP: When configuring Common Table Expressions (CTE), ensure your configurations follow current enterprise guidelines. CTEs make complex nesting readable and can be referenced multiple times in the main query.",
        "quizOptions": [
            "CTEs create physical tables on disk",
            "CTEs define inline temporary named queries that act as virtual tables for the primary query",
            "CTEs only work for DB2 stored procedures",
            "CTEs require index-only scans"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_084",
        "category": "SQL",
        "level": "Expert",
        "question": "Explain a scenario where misconfiguring recursive CTEs hierarchies causes database locking or transaction abends.",
        "answer": "Dealing with recursive CTEs hierarchies requires understanding its impact on z/OS. traversing tree structures or hierarchical tables (like manager-employee). In production, architects resolve issues by applying the following solution: Define CTE containing anchor query UNION ALL recursive query referencing the CTE.",
        "code": "WITH ORG (ID, BOSS, LVL) AS (\n  SELECT ID, BOSS, 1 FROM EMP WHERE BOSS IS NULL\n  UNION ALL\n  SELECT E.ID, E.BOSS, O.LVL + 1 FROM EMP E JOIN ORG O ON E.BOSS = O.ID\n) SELECT * FROM ORG;",
        "tip": "PRO-TIP: When configuring recursive CTEs hierarchies, ensure your configurations follow current enterprise guidelines. Always include a termination check or level indicator to prevent infinite loops.",
        "quizOptions": [
            "Recursive CTEs are not supported in DB2",
            "They use UNION ALL joining anchor records with child records recursively to map hierarchical tree nodes",
            "Recursive CTEs write to temporary tapes",
            "They require cursor loops in COBOL"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_085",
        "category": "SQL",
        "level": "Beginner",
        "question": "How does the operating system or subsystem manage window functions ROW_NUMBER under high CPU utilization?",
        "answer": "Dealing with window functions ROW_NUMBER requires understanding its impact on z/OS. assigning unique sequential integers to rows within partitioned windows. In production, architects resolve issues by applying the following solution: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) syntax.",
        "code": "SELECT EMPNO, ROW_NUMBER() OVER (PARTITION BY DEPTNO ORDER BY SALARY DESC) FROM EMP;",
        "tip": "PRO-TIP: When configuring window functions ROW_NUMBER, ensure your configurations follow current enterprise guidelines. Use DENSE_RANK() if you need matching ranks for duplicate sorted values without skipping integers.",
        "quizOptions": [
            "ROW_NUMBER requires temporary indexes",
            "ROW_NUMBER partitions rows into window groups and computes row ranks dynamically per group",
            "ROW_NUMBER is only for SELECT INTO single rows",
            "ROW_NUMBER modifies database keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_086",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What are the differences between legacy and modern approaches to handling Stage 1 sargable predicates?",
        "answer": "Dealing with Stage 1 sargable predicates requires understanding its impact on z/OS. efficient query filters processed directly by the DB2 Data Manager (DM) during I/O. In production, architects resolve issues by applying the following solution: Avoid mathematical operations, functions, or data type conversion mismatches on filtered columns.",
        "code": "SELECT NAME FROM EMP WHERE SALARY > 50000; * Stage 1 filter",
        "tip": "PRO-TIP: When configuring Stage 1 sargable predicates, ensure your configurations follow current enterprise guidelines. Stage 1 filters are highly efficient because rows are skipped before being copied to RDS memory buffers.",
        "quizOptions": [
            "Stage 1 filters are slow",
            "Stage 1 (sargable) predicates are processed directly by the Data Manager, minimizing data copy and CPU cycles",
            "Stage 1 requires CICS maps",
            "Stage 1 predicates require temporary tables"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_087",
        "category": "SQL",
        "level": "Expert",
        "question": "Describe a debugging technique to track and solve errors with Stage 2 residual predicates using standard utilities.",
        "answer": "Dealing with Stage 2 residual predicates requires understanding its impact on z/OS. slower query filters evaluated by the Relational Data System (RDS) after copying data. In production, architects resolve issues by applying the following solution: Rewrite expressions to isolate columns: e.g. SALARY > 50000/12 instead of SALARY * 12 > 50000.",
        "code": "SELECT NAME FROM EMP WHERE SALARY * 1.1 > 100000; * Stage 2 filter",
        "tip": "PRO-TIP: When configuring Stage 2 residual predicates, ensure your configurations follow current enterprise guidelines. Applying functions (like YEAR(HIREDATE) = 2026) forces Stage 2 processing and disables index usage.",
        "quizOptions": [
            "Stage 2 predicates are faster",
            "Stage 2 (residual) predicates require copying pages to memory first for evaluation by the Relational Data System",
            "Stage 2 filters are processed on tape",
            "Stage 2 predicates cannot use WHERE clauses"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_088",
        "category": "SQL",
        "level": "Beginner",
        "question": "How do storage administrators optimize the allocation and block size parameters for EXISTS vs IN subqueries optimization?",
        "answer": "Dealing with EXISTS vs IN subqueries optimization requires understanding its impact on z/OS. evaluating record presence in child subqueries efficiently. In production, architects resolve issues by applying the following solution: Use EXISTS for correlated checks (checks presence and stops); use IN for small literal sets.",
        "code": "SELECT * FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DID = D.ID);",
        "tip": "PRO-TIP: When configuring EXISTS vs IN subqueries optimization, ensure your configurations follow current enterprise guidelines. EXISTS halts subquery scanning immediately upon finding the first match, saving I/O.",
        "quizOptions": [
            "IN is always faster than EXISTS",
            "EXISTS stops scanning on the first match, making it highly efficient for correlated subquery presence checks",
            "Both require full table scans",
            "EXISTS requires temporary tablespaces"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_089",
        "category": "SQL",
        "level": "Intermediate",
        "question": "Explain the connection between CASE conditional expressions and z/OS workload management priorities.",
        "answer": "Dealing with CASE conditional expressions requires understanding its impact on z/OS. evaluating multi-branch logic directly within select or update statements. In production, architects resolve issues by applying the following solution: Use CASE WHEN condition THEN val1 ELSE val2 END syntax.",
        "code": "SELECT NAME, CASE WHEN SAL > 100000 THEN 'HIGH' ELSE 'STD' END FROM EMP;",
        "tip": "PRO-TIP: When configuring CASE conditional expressions, ensure your configurations follow current enterprise guidelines. CASE is processed on the database server, reducing the need to process conditionals in COBOL.",
        "quizOptions": [
            "CASE is only used in WHERE clauses",
            "CASE conditional statements return values based on evaluated branch conditions inside queries",
            "CASE requires BIND PLAN re-initialization",
            "CASE is a JCL utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_090",
        "category": "SQL",
        "level": "Expert",
        "question": "What RACF authorizations and security constraints govern optimistic locking ROW_CHANGE_TIMESTAMP inside enterprise databases?",
        "answer": "Dealing with optimistic locking ROW_CHANGE_TIMESTAMP requires understanding its impact on z/OS. detecting concurrent table updates without holding locks during user edits. In production, architects resolve issues by applying the following solution: Define ROW_CHANGE_TIMESTAMP column. Select its value, and filter by it in the UPDATE statement.",
        "code": "UPDATE EMP SET SAL = 60000 WHERE ID = 10 AND TS = :ORIGINAL-TS;",
        "tip": "PRO-TIP: When configuring optimistic locking ROW_CHANGE_TIMESTAMP, ensure your configurations follow current enterprise guidelines. If the row was modified by another task, the timestamp changes, and the update affects 0 rows.",
        "quizOptions": [
            "Optimistic locking blocks other queries",
            "Optimistic locking checks row version/timestamp at update time; if it changed, the update is rejected (0 rows affected)",
            "Optimistic locking is managed in CICS tables only",
            "It locks the entire tablespace"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_091",
        "category": "SQL",
        "level": "Beginner",
        "question": "How do you debug an issue related to HAVING vs WHERE queries in a high-volume production environment?",
        "answer": "Dealing with HAVING vs WHERE queries requires understanding its impact on z/OS. filtering data before grouping (WHERE) vs after grouping (HAVING). In production, architects resolve issues by applying the following solution: Use WHERE for row filters. Use HAVING for aggregated metrics.",
        "code": "SELECT DEPT, AVG(SAL) FROM EMP WHERE SAL > 50000 GROUP BY DEPT HAVING AVG(SAL) > 60000;",
        "tip": "PRO-TIP: When configuring HAVING vs WHERE queries, ensure your configurations follow current enterprise guidelines. Optimize queries by putting filters in WHERE whenever possible, reducing rows before grouping.",
        "quizOptions": [
            "WHERE and HAVING are identical",
            "WHERE filters rows before GROUP BY aggregation; HAVING filters groups after aggregation",
            "HAVING filters rows before GROUP BY",
            "WHERE can use aggregate functions like SUM"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_092",
        "category": "SQL",
        "level": "Intermediate",
        "question": "What are the performance implications of DB2 SQL join patterns under concurrent processing workloads?",
        "answer": "Dealing with DB2 SQL join patterns requires understanding its impact on z/OS. joining tables using INNER, LEFT OUTER, RIGHT OUTER, and FULL OUTER joins. In production, architects resolve issues by applying the following solution: Select appropriate join based on whether unmatched rows must be retained.",
        "code": "SELECT E.NAME, D.NAME FROM EMP E LEFT JOIN DEPT D ON E.DID = D.ID;",
        "tip": "PRO-TIP: When configuring DB2 SQL join patterns, ensure your configurations follow current enterprise guidelines. LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.",
        "quizOptions": [
            "INNER JOIN returns unmatched rows",
            "INNER JOIN returns matches only; LEFT/RIGHT OUTER returns unmatched rows from one side; FULL returns all",
            "CROSS JOIN requires a join key",
            "OUTER joins are slower than subqueries"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_093",
        "category": "SQL",
        "level": "Expert",
        "question": "What is the architectural best practice for designing Common Table Expressions (CTE) in a hybrid cloud integration?",
        "answer": "Dealing with Common Table Expressions (CTE) requires understanding its impact on z/OS. defining temporary named result sets within a query statement. In production, architects resolve issues by applying the following solution: Use WITH CTE_NAME (columns) AS (SELECT ...) query syntax.",
        "code": "WITH HIGHSAL AS (SELECT * FROM EMP WHERE SAL > 100000)\nSELECT * FROM HIGHSAL WHERE DEPT = 10;",
        "tip": "PRO-TIP: When configuring Common Table Expressions (CTE), ensure your configurations follow current enterprise guidelines. CTEs make complex nesting readable and can be referenced multiple times in the main query.",
        "quizOptions": [
            "CTEs create physical tables on disk",
            "CTEs define inline temporary named queries that act as virtual tables for the primary query",
            "CTEs only work for DB2 stored procedures",
            "CTEs require index-only scans"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_094",
        "category": "SQL",
        "level": "Beginner",
        "question": "Explain a scenario where misconfiguring recursive CTEs hierarchies causes database locking or transaction abends.",
        "answer": "Dealing with recursive CTEs hierarchies requires understanding its impact on z/OS. traversing tree structures or hierarchical tables (like manager-employee). In production, architects resolve issues by applying the following solution: Define CTE containing anchor query UNION ALL recursive query referencing the CTE.",
        "code": "WITH ORG (ID, BOSS, LVL) AS (\n  SELECT ID, BOSS, 1 FROM EMP WHERE BOSS IS NULL\n  UNION ALL\n  SELECT E.ID, E.BOSS, O.LVL + 1 FROM EMP E JOIN ORG O ON E.BOSS = O.ID\n) SELECT * FROM ORG;",
        "tip": "PRO-TIP: When configuring recursive CTEs hierarchies, ensure your configurations follow current enterprise guidelines. Always include a termination check or level indicator to prevent infinite loops.",
        "quizOptions": [
            "Recursive CTEs are not supported in DB2",
            "They use UNION ALL joining anchor records with child records recursively to map hierarchical tree nodes",
            "Recursive CTEs write to temporary tapes",
            "They require cursor loops in COBOL"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_095",
        "category": "SQL",
        "level": "Intermediate",
        "question": "How does the operating system or subsystem manage window functions ROW_NUMBER under high CPU utilization?",
        "answer": "Dealing with window functions ROW_NUMBER requires understanding its impact on z/OS. assigning unique sequential integers to rows within partitioned windows. In production, architects resolve issues by applying the following solution: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) syntax.",
        "code": "SELECT EMPNO, ROW_NUMBER() OVER (PARTITION BY DEPTNO ORDER BY SALARY DESC) FROM EMP;",
        "tip": "PRO-TIP: When configuring window functions ROW_NUMBER, ensure your configurations follow current enterprise guidelines. Use DENSE_RANK() if you need matching ranks for duplicate sorted values without skipping integers.",
        "quizOptions": [
            "ROW_NUMBER requires temporary indexes",
            "ROW_NUMBER partitions rows into window groups and computes row ranks dynamically per group",
            "ROW_NUMBER is only for SELECT INTO single rows",
            "ROW_NUMBER modifies database keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_096",
        "category": "SQL",
        "level": "Expert",
        "question": "What are the differences between legacy and modern approaches to handling Stage 1 sargable predicates?",
        "answer": "Dealing with Stage 1 sargable predicates requires understanding its impact on z/OS. efficient query filters processed directly by the DB2 Data Manager (DM) during I/O. In production, architects resolve issues by applying the following solution: Avoid mathematical operations, functions, or data type conversion mismatches on filtered columns.",
        "code": "SELECT NAME FROM EMP WHERE SALARY > 50000; * Stage 1 filter",
        "tip": "PRO-TIP: When configuring Stage 1 sargable predicates, ensure your configurations follow current enterprise guidelines. Stage 1 filters are highly efficient because rows are skipped before being copied to RDS memory buffers.",
        "quizOptions": [
            "Stage 1 filters are slow",
            "Stage 1 (sargable) predicates are processed directly by the Data Manager, minimizing data copy and CPU cycles",
            "Stage 1 requires CICS maps",
            "Stage 1 predicates require temporary tables"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_097",
        "category": "SQL",
        "level": "Beginner",
        "question": "Describe a debugging technique to track and solve errors with Stage 2 residual predicates using standard utilities.",
        "answer": "Dealing with Stage 2 residual predicates requires understanding its impact on z/OS. slower query filters evaluated by the Relational Data System (RDS) after copying data. In production, architects resolve issues by applying the following solution: Rewrite expressions to isolate columns: e.g. SALARY > 50000/12 instead of SALARY * 12 > 50000.",
        "code": "SELECT NAME FROM EMP WHERE SALARY * 1.1 > 100000; * Stage 2 filter",
        "tip": "PRO-TIP: When configuring Stage 2 residual predicates, ensure your configurations follow current enterprise guidelines. Applying functions (like YEAR(HIREDATE) = 2026) forces Stage 2 processing and disables index usage.",
        "quizOptions": [
            "Stage 2 predicates are faster",
            "Stage 2 (residual) predicates require copying pages to memory first for evaluation by the Relational Data System",
            "Stage 2 filters are processed on tape",
            "Stage 2 predicates cannot use WHERE clauses"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_098",
        "category": "SQL",
        "level": "Intermediate",
        "question": "How do storage administrators optimize the allocation and block size parameters for EXISTS vs IN subqueries optimization?",
        "answer": "Dealing with EXISTS vs IN subqueries optimization requires understanding its impact on z/OS. evaluating record presence in child subqueries efficiently. In production, architects resolve issues by applying the following solution: Use EXISTS for correlated checks (checks presence and stops); use IN for small literal sets.",
        "code": "SELECT * FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DID = D.ID);",
        "tip": "PRO-TIP: When configuring EXISTS vs IN subqueries optimization, ensure your configurations follow current enterprise guidelines. EXISTS halts subquery scanning immediately upon finding the first match, saving I/O.",
        "quizOptions": [
            "IN is always faster than EXISTS",
            "EXISTS stops scanning on the first match, making it highly efficient for correlated subquery presence checks",
            "Both require full table scans",
            "EXISTS requires temporary tablespaces"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_099",
        "category": "SQL",
        "level": "Expert",
        "question": "Explain the connection between CASE conditional expressions and z/OS workload management priorities.",
        "answer": "Dealing with CASE conditional expressions requires understanding its impact on z/OS. evaluating multi-branch logic directly within select or update statements. In production, architects resolve issues by applying the following solution: Use CASE WHEN condition THEN val1 ELSE val2 END syntax.",
        "code": "SELECT NAME, CASE WHEN SAL > 100000 THEN 'HIGH' ELSE 'STD' END FROM EMP;",
        "tip": "PRO-TIP: When configuring CASE conditional expressions, ensure your configurations follow current enterprise guidelines. CASE is processed on the database server, reducing the need to process conditionals in COBOL.",
        "quizOptions": [
            "CASE is only used in WHERE clauses",
            "CASE conditional statements return values based on evaluated branch conditions inside queries",
            "CASE requires BIND PLAN re-initialization",
            "CASE is a JCL utility"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "sql_gen_100",
        "category": "SQL",
        "level": "Beginner",
        "question": "What RACF authorizations and security constraints govern optimistic locking ROW_CHANGE_TIMESTAMP inside enterprise databases?",
        "answer": "Dealing with optimistic locking ROW_CHANGE_TIMESTAMP requires understanding its impact on z/OS. detecting concurrent table updates without holding locks during user edits. In production, architects resolve issues by applying the following solution: Define ROW_CHANGE_TIMESTAMP column. Select its value, and filter by it in the UPDATE statement.",
        "code": "UPDATE EMP SET SAL = 60000 WHERE ID = 10 AND TS = :ORIGINAL-TS;",
        "tip": "PRO-TIP: When configuring optimistic locking ROW_CHANGE_TIMESTAMP, ensure your configurations follow current enterprise guidelines. If the row was modified by another task, the timestamp changes, and the update affects 0 rows.",
        "quizOptions": [
            "Optimistic locking blocks other queries",
            "Optimistic locking checks row version/timestamp at update time; if it changed, the update is rejected (0 rows affected)",
            "Optimistic locking is managed in CICS tables only",
            "It locks the entire tablespace"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_076",
        "category": "COBOL",
        "level": "Beginner",
        "question": "What are the differences between legacy and modern approaches to handling UNSTRING delimiter options?",
        "answer": "Dealing with UNSTRING delimiter options requires understanding its impact on z/OS. parsing delimited string inputs (like CSV data) into separate variable fields. In production, architects resolve issues by applying the following solution: Use DELIMITED BY ',' or other characters. Optionally capture delimiter lengths and match counts.",
        "code": "UNSTRING WS-INPUT DELIMITED BY ','\n    INTO WS-FIELD1 WS-FIELD2 WS-FIELD3.",
        "tip": "PRO-TIP: When configuring UNSTRING delimiter options, ensure your configurations follow current enterprise guidelines. Always check the OVERFLOW and TALLYING indicators to ensure the input string matched all target fields.",
        "quizOptions": [
            "UNSTRING only parses fixed-width strings",
            "UNSTRING splits a string into multiple fields based on specified delimiter characters",
            "UNSTRING is a legacy CICS command",
            "UNSTRING requires COMP-3 data"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_077",
        "category": "COBOL",
        "level": "Intermediate",
        "question": "Describe a debugging technique to track and solve errors with BY REFERENCE vs BY CONTENT parameter passing using standard utilities.",
        "answer": "Dealing with BY REFERENCE vs BY CONTENT parameter passing requires understanding its impact on z/OS. sharing memory locations (REFERENCE) vs sending a copy (CONTENT) to a subprogram. In production, architects resolve issues by applying the following solution: Use BY CONTENT to protect the caller's variables from modification. Use BY REFERENCE to update fields in the subprogram.",
        "code": "CALL 'SUBPROG' USING BY REFERENCE WS-DATA-REF\n                      BY CONTENT WS-DATA-VAL.",
        "tip": "PRO-TIP: When configuring BY REFERENCE vs BY CONTENT parameter passing, ensure your configurations follow current enterprise guidelines. Using BY CONTENT prevents accidental side effects and is highly recommended for read-only parameters.",
        "quizOptions": [
            "BY REFERENCE passes a copy; BY CONTENT passes a pointer",
            "BY REFERENCE passes the actual memory address (mutable); BY CONTENT passes a temporary copy (read-only to caller)",
            "Both pass copies",
            "BY CONTENT is only for numeric fields"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_078",
        "category": "COBOL",
        "level": "Expert",
        "question": "How do storage administrators optimize the allocation and block size parameters for FILE STATUS checking?",
        "answer": "Dealing with FILE STATUS checking requires understanding its impact on z/OS. 2-byte return code indicating the success or failure of a file operation. In production, architects resolve issues by applying the following solution: Check File Status after every file statement (OPEN, READ, WRITE, CLOSE) to handle errors gracefully.",
        "code": "IF WS-FILE-STATUS NOT = '00'\n    DISPLAY 'FILE ERROR: ' WS-FILE-STATUS.",
        "tip": "PRO-TIP: When configuring FILE STATUS checking, ensure your configurations follow current enterprise guidelines. File status '35' means file not found during OPEN INPUT. File status '23' means record not found during READ.",
        "quizOptions": [
            "File status is only checked during abends",
            "It is a 2-byte field checked after every file I/O operation to detect success or specific error codes",
            "File status is only for VSAM files",
            "File status is automatically printed by JES2"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_079",
        "category": "COBOL",
        "level": "Beginner",
        "question": "Explain the connection between REDEFINES clause rules and z/OS workload management priorities.",
        "answer": "Dealing with REDEFINES clause rules requires understanding its impact on z/OS. allowing different data structures to overlay the exact same memory location. In production, architects resolve issues by applying the following solution: The REDEFINES item must immediately follow the target item and must have the same or smaller level number.",
        "code": "05 WS-DATE PIC 9(8).\n05 WS-DATE-REDEF REDEFINES WS-DATE.\n   10 WS-YEAR  PIC 9(4).\n   10 WS-MONTH PIC 9(2).\n   10 WS-DAY   PIC 9(2).",
        "tip": "PRO-TIP: When configuring REDEFINES clause rules, ensure your configurations follow current enterprise guidelines. Use REDEFINES to parse generic text blocks into specific record structures based on header transaction codes.",
        "quizOptions": [
            "REDEFINES allocates new memory",
            "It allows a single storage area to be described by different data descriptions",
            "It must allocate larger memory than the target",
            "It can only be used with level 77 fields"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_080",
        "category": "COBOL",
        "level": "Intermediate",
        "question": "What RACF authorizations and security constraints govern Level 88 condition names inside enterprise databases?",
        "answer": "Dealing with Level 88 condition names requires understanding its impact on z/OS. associating boolean condition labels with specific values of a parent variable. In production, architects resolve issues by applying the following solution: Define level 88 entries immediately below a variable and set them using SET or check them in IF conditions.",
        "code": "05 WS-STATUS PIC X.\n   88 WS-ACTIVE VALUE 'A'.\n   88 WS-INACTIVE VALUE 'I'.",
        "tip": "PRO-TIP: When configuring Level 88 condition names, ensure your configurations follow current enterprise guidelines. Level 88 entries make code extremely readable and simplify logic checks (e.g. IF WS-VALID-RECORD instead of comparisons).",
        "quizOptions": [
            "Level 88 defines a loop index",
            "It defines condition names associated with specific values of a parent field",
            "It defines CICS map structures",
            "It is for database unique keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_081",
        "category": "COBOL",
        "level": "Expert",
        "question": "How do you debug an issue related to COMP-3 packed decimal fields in a high-volume production environment?",
        "answer": "Dealing with COMP-3 packed decimal fields requires understanding its impact on z/OS. packed decimal storage where 2 digits are packed per byte, with a sign nibble in the last half-byte. In production, architects resolve issues by applying the following solution: Define fields with PIC clause and COMP-3 usage. Ensure proper decimal alignment and sign control.",
        "code": "01 WS-AMOUNT PIC S9(7)V99 COMP-3.",
        "tip": "PRO-TIP: When configuring COMP-3 packed decimal fields, ensure your configurations follow current enterprise guidelines. Packed decimal (COMP-3) is critical for monetary calculations on the mainframe to avoid binary rounding errors.",
        "quizOptions": [
            "COMP-3 stores one digit per byte",
            "COMP-3 packs two decimal digits per byte with a sign nibble in the low-order position",
            "COMP-3 is used for floating point operations",
            "COMP-3 requires binary conversion before display"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_082",
        "category": "COBOL",
        "level": "Beginner",
        "question": "What are the performance implications of COMP binary fields under concurrent processing workloads?",
        "answer": "Dealing with COMP binary fields requires understanding its impact on z/OS. pure binary integers processed directly in CPU registers (GPRs). In production, architects resolve issues by applying the following solution: Define fields as COMP or BINARY with proper boundary alignment (SYNCHRONIZED) for maximum performance.",
        "code": "01 WS-INDEX PIC S9(4) COMP SYNCHRONIZED.",
        "tip": "PRO-TIP: When configuring COMP binary fields, ensure your configurations follow current enterprise guidelines. Always use COMP with SYNCHRONIZED for loop indexes and array subscripts to bypass CPU alignment overhead.",
        "quizOptions": [
            "COMP is zoned decimal",
            "COMP is a character representation",
            "COMP represents pure binary data stored in halfword or fullword formats",
            "COMP cannot be used for calculations"
        ],
        "quizAnswerIndex": 2
    },
    {
        "id": "cobol_gen_083",
        "category": "COBOL",
        "level": "Intermediate",
        "question": "What is the architectural best practice for designing OCCURS DEPENDING ON clause in a hybrid cloud integration?",
        "answer": "Dealing with OCCURS DEPENDING ON clause requires understanding its impact on z/OS. variable-length tables where the size of the table is determined at runtime by a control variable. In production, architects resolve issues by applying the following solution: Ensure the control variable is set to a valid value within the defined bounds before referencing the table.",
        "code": "01 WS-TABLE.\n   05 WS-ITEM OCCURS 1 TO 100 TIMES DEPENDING ON WS-COUNT PIC X(10).",
        "tip": "PRO-TIP: When configuring OCCURS DEPENDING ON clause, ensure your configurations follow current enterprise guidelines. Using OCCURS DEPENDING ON reduces memory usage but requires strict bounds checking to prevent memory corruption.",
        "quizOptions": [
            "OCCURS DEPENDING ON defines fixed-size tables",
            "It defines variable-length tables whose runtime size is controlled by another variable",
            "It is only used in CICS programs",
            "It requires DB2 queries to populate"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_084",
        "category": "COBOL",
        "level": "Expert",
        "question": "Explain a scenario where misconfiguring SEARCH ALL vs SEARCH causes database locking or transaction abends.",
        "answer": "Dealing with SEARCH ALL vs SEARCH requires understanding its impact on z/OS. binary search (SEARCH ALL) vs linear search (SEARCH) for table elements. In production, architects resolve issues by applying the following solution: SEARCH ALL requires the table to be sorted (ASCENDING/DESCENDING KEY) and accessed via INDEXED BY. SEARCH does linear scanning.",
        "code": "SEARCH ALL WS-ITEM\n    WHEN WS-ITEM-KEY(WS-IDX) = WS-KEY\n        PERFORM PROCESS-ITEM.",
        "tip": "PRO-TIP: When configuring SEARCH ALL vs SEARCH, ensure your configurations follow current enterprise guidelines. Use SEARCH ALL for tables with more than 50 elements to achieve O(log N) lookup speed.",
        "quizOptions": [
            "SEARCH ALL does a linear search",
            "SEARCH ALL performs a binary search and requires the table to be sorted by key; SEARCH performs a linear scan",
            "Both perform linear scans",
            "SEARCH ALL does not require an index"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_085",
        "category": "COBOL",
        "level": "Beginner",
        "question": "How does the operating system or subsystem manage STRING statement pointer tracking under high CPU utilization?",
        "answer": "Dealing with STRING statement pointer tracking requires understanding its impact on z/OS. concatenating multiple source fields into a single destination field while tracking characters written. In production, architects resolve issues by applying the following solution: Initialize the pointer variable to 1 before calling STRING and check its value afterwards to get the output size.",
        "code": "MOVE 1 TO WS-PTR.\nSTRING WS-FIRST DELIMITED BY SPACE\n       WS-LAST DELIMITED BY SPACE\n  INTO WS-FULLNAME WITH POINTER WS-PTR.",
        "tip": "PRO-TIP: When configuring STRING statement pointer tracking, ensure your configurations follow current enterprise guidelines. STRING POINTER helps you dynamically build variable-length records or CSV outputs cleanly.",
        "quizOptions": [
            "Pointer is automatically initialized to 0",
            "Pointer tracks the current offset in the destination field and must be initialized before execution",
            "Pointer is not modified by STRING",
            "Pointer is only for CICS transactions"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_086",
        "category": "COBOL",
        "level": "Intermediate",
        "question": "What are the differences between legacy and modern approaches to handling UNSTRING delimiter options?",
        "answer": "Dealing with UNSTRING delimiter options requires understanding its impact on z/OS. parsing delimited string inputs (like CSV data) into separate variable fields. In production, architects resolve issues by applying the following solution: Use DELIMITED BY ',' or other characters. Optionally capture delimiter lengths and match counts.",
        "code": "UNSTRING WS-INPUT DELIMITED BY ','\n    INTO WS-FIELD1 WS-FIELD2 WS-FIELD3.",
        "tip": "PRO-TIP: When configuring UNSTRING delimiter options, ensure your configurations follow current enterprise guidelines. Always check the OVERFLOW and TALLYING indicators to ensure the input string matched all target fields.",
        "quizOptions": [
            "UNSTRING only parses fixed-width strings",
            "UNSTRING splits a string into multiple fields based on specified delimiter characters",
            "UNSTRING is a legacy CICS command",
            "UNSTRING requires COMP-3 data"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_087",
        "category": "COBOL",
        "level": "Expert",
        "question": "Describe a debugging technique to track and solve errors with BY REFERENCE vs BY CONTENT parameter passing using standard utilities.",
        "answer": "Dealing with BY REFERENCE vs BY CONTENT parameter passing requires understanding its impact on z/OS. sharing memory locations (REFERENCE) vs sending a copy (CONTENT) to a subprogram. In production, architects resolve issues by applying the following solution: Use BY CONTENT to protect the caller's variables from modification. Use BY REFERENCE to update fields in the subprogram.",
        "code": "CALL 'SUBPROG' USING BY REFERENCE WS-DATA-REF\n                      BY CONTENT WS-DATA-VAL.",
        "tip": "PRO-TIP: When configuring BY REFERENCE vs BY CONTENT parameter passing, ensure your configurations follow current enterprise guidelines. Using BY CONTENT prevents accidental side effects and is highly recommended for read-only parameters.",
        "quizOptions": [
            "BY REFERENCE passes a copy; BY CONTENT passes a pointer",
            "BY REFERENCE passes the actual memory address (mutable); BY CONTENT passes a temporary copy (read-only to caller)",
            "Both pass copies",
            "BY CONTENT is only for numeric fields"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_088",
        "category": "COBOL",
        "level": "Beginner",
        "question": "How do storage administrators optimize the allocation and block size parameters for FILE STATUS checking?",
        "answer": "Dealing with FILE STATUS checking requires understanding its impact on z/OS. 2-byte return code indicating the success or failure of a file operation. In production, architects resolve issues by applying the following solution: Check File Status after every file statement (OPEN, READ, WRITE, CLOSE) to handle errors gracefully.",
        "code": "IF WS-FILE-STATUS NOT = '00'\n    DISPLAY 'FILE ERROR: ' WS-FILE-STATUS.",
        "tip": "PRO-TIP: When configuring FILE STATUS checking, ensure your configurations follow current enterprise guidelines. File status '35' means file not found during OPEN INPUT. File status '23' means record not found during READ.",
        "quizOptions": [
            "File status is only checked during abends",
            "It is a 2-byte field checked after every file I/O operation to detect success or specific error codes",
            "File status is only for VSAM files",
            "File status is automatically printed by JES2"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_089",
        "category": "COBOL",
        "level": "Intermediate",
        "question": "Explain the connection between REDEFINES clause rules and z/OS workload management priorities.",
        "answer": "Dealing with REDEFINES clause rules requires understanding its impact on z/OS. allowing different data structures to overlay the exact same memory location. In production, architects resolve issues by applying the following solution: The REDEFINES item must immediately follow the target item and must have the same or smaller level number.",
        "code": "05 WS-DATE PIC 9(8).\n05 WS-DATE-REDEF REDEFINES WS-DATE.\n   10 WS-YEAR  PIC 9(4).\n   10 WS-MONTH PIC 9(2).\n   10 WS-DAY   PIC 9(2).",
        "tip": "PRO-TIP: When configuring REDEFINES clause rules, ensure your configurations follow current enterprise guidelines. Use REDEFINES to parse generic text blocks into specific record structures based on header transaction codes.",
        "quizOptions": [
            "REDEFINES allocates new memory",
            "It allows a single storage area to be described by different data descriptions",
            "It must allocate larger memory than the target",
            "It can only be used with level 77 fields"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_090",
        "category": "COBOL",
        "level": "Expert",
        "question": "What RACF authorizations and security constraints govern Level 88 condition names inside enterprise databases?",
        "answer": "Dealing with Level 88 condition names requires understanding its impact on z/OS. associating boolean condition labels with specific values of a parent variable. In production, architects resolve issues by applying the following solution: Define level 88 entries immediately below a variable and set them using SET or check them in IF conditions.",
        "code": "05 WS-STATUS PIC X.\n   88 WS-ACTIVE VALUE 'A'.\n   88 WS-INACTIVE VALUE 'I'.",
        "tip": "PRO-TIP: When configuring Level 88 condition names, ensure your configurations follow current enterprise guidelines. Level 88 entries make code extremely readable and simplify logic checks (e.g. IF WS-VALID-RECORD instead of comparisons).",
        "quizOptions": [
            "Level 88 defines a loop index",
            "It defines condition names associated with specific values of a parent field",
            "It defines CICS map structures",
            "It is for database unique keys"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_091",
        "category": "COBOL",
        "level": "Beginner",
        "question": "How do you debug an issue related to COMP-3 packed decimal fields in a high-volume production environment?",
        "answer": "Dealing with COMP-3 packed decimal fields requires understanding its impact on z/OS. packed decimal storage where 2 digits are packed per byte, with a sign nibble in the last half-byte. In production, architects resolve issues by applying the following solution: Define fields with PIC clause and COMP-3 usage. Ensure proper decimal alignment and sign control.",
        "code": "01 WS-AMOUNT PIC S9(7)V99 COMP-3.",
        "tip": "PRO-TIP: When configuring COMP-3 packed decimal fields, ensure your configurations follow current enterprise guidelines. Packed decimal (COMP-3) is critical for monetary calculations on the mainframe to avoid binary rounding errors.",
        "quizOptions": [
            "COMP-3 stores one digit per byte",
            "COMP-3 packs two decimal digits per byte with a sign nibble in the low-order position",
            "COMP-3 is used for floating point operations",
            "COMP-3 requires binary conversion before display"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_092",
        "category": "COBOL",
        "level": "Intermediate",
        "question": "What are the performance implications of COMP binary fields under concurrent processing workloads?",
        "answer": "Dealing with COMP binary fields requires understanding its impact on z/OS. pure binary integers processed directly in CPU registers (GPRs). In production, architects resolve issues by applying the following solution: Define fields as COMP or BINARY with proper boundary alignment (SYNCHRONIZED) for maximum performance.",
        "code": "01 WS-INDEX PIC S9(4) COMP SYNCHRONIZED.",
        "tip": "PRO-TIP: When configuring COMP binary fields, ensure your configurations follow current enterprise guidelines. Always use COMP with SYNCHRONIZED for loop indexes and array subscripts to bypass CPU alignment overhead.",
        "quizOptions": [
            "COMP is zoned decimal",
            "COMP is a character representation",
            "COMP represents pure binary data stored in halfword or fullword formats",
            "COMP cannot be used for calculations"
        ],
        "quizAnswerIndex": 2
    },
    {
        "id": "cobol_gen_093",
        "category": "COBOL",
        "level": "Expert",
        "question": "What is the architectural best practice for designing OCCURS DEPENDING ON clause in a hybrid cloud integration?",
        "answer": "Dealing with OCCURS DEPENDING ON clause requires understanding its impact on z/OS. variable-length tables where the size of the table is determined at runtime by a control variable. In production, architects resolve issues by applying the following solution: Ensure the control variable is set to a valid value within the defined bounds before referencing the table.",
        "code": "01 WS-TABLE.\n   05 WS-ITEM OCCURS 1 TO 100 TIMES DEPENDING ON WS-COUNT PIC X(10).",
        "tip": "PRO-TIP: When configuring OCCURS DEPENDING ON clause, ensure your configurations follow current enterprise guidelines. Using OCCURS DEPENDING ON reduces memory usage but requires strict bounds checking to prevent memory corruption.",
        "quizOptions": [
            "OCCURS DEPENDING ON defines fixed-size tables",
            "It defines variable-length tables whose runtime size is controlled by another variable",
            "It is only used in CICS programs",
            "It requires DB2 queries to populate"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_094",
        "category": "COBOL",
        "level": "Beginner",
        "question": "Explain a scenario where misconfiguring SEARCH ALL vs SEARCH causes database locking or transaction abends.",
        "answer": "Dealing with SEARCH ALL vs SEARCH requires understanding its impact on z/OS. binary search (SEARCH ALL) vs linear search (SEARCH) for table elements. In production, architects resolve issues by applying the following solution: SEARCH ALL requires the table to be sorted (ASCENDING/DESCENDING KEY) and accessed via INDEXED BY. SEARCH does linear scanning.",
        "code": "SEARCH ALL WS-ITEM\n    WHEN WS-ITEM-KEY(WS-IDX) = WS-KEY\n        PERFORM PROCESS-ITEM.",
        "tip": "PRO-TIP: When configuring SEARCH ALL vs SEARCH, ensure your configurations follow current enterprise guidelines. Use SEARCH ALL for tables with more than 50 elements to achieve O(log N) lookup speed.",
        "quizOptions": [
            "SEARCH ALL does a linear search",
            "SEARCH ALL performs a binary search and requires the table to be sorted by key; SEARCH performs a linear scan",
            "Both perform linear scans",
            "SEARCH ALL does not require an index"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_095",
        "category": "COBOL",
        "level": "Intermediate",
        "question": "How does the operating system or subsystem manage STRING statement pointer tracking under high CPU utilization?",
        "answer": "Dealing with STRING statement pointer tracking requires understanding its impact on z/OS. concatenating multiple source fields into a single destination field while tracking characters written. In production, architects resolve issues by applying the following solution: Initialize the pointer variable to 1 before calling STRING and check its value afterwards to get the output size.",
        "code": "MOVE 1 TO WS-PTR.\nSTRING WS-FIRST DELIMITED BY SPACE\n       WS-LAST DELIMITED BY SPACE\n  INTO WS-FULLNAME WITH POINTER WS-PTR.",
        "tip": "PRO-TIP: When configuring STRING statement pointer tracking, ensure your configurations follow current enterprise guidelines. STRING POINTER helps you dynamically build variable-length records or CSV outputs cleanly.",
        "quizOptions": [
            "Pointer is automatically initialized to 0",
            "Pointer tracks the current offset in the destination field and must be initialized before execution",
            "Pointer is not modified by STRING",
            "Pointer is only for CICS transactions"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_096",
        "category": "COBOL",
        "level": "Expert",
        "question": "What are the differences between legacy and modern approaches to handling UNSTRING delimiter options?",
        "answer": "Dealing with UNSTRING delimiter options requires understanding its impact on z/OS. parsing delimited string inputs (like CSV data) into separate variable fields. In production, architects resolve issues by applying the following solution: Use DELIMITED BY ',' or other characters. Optionally capture delimiter lengths and match counts.",
        "code": "UNSTRING WS-INPUT DELIMITED BY ','\n    INTO WS-FIELD1 WS-FIELD2 WS-FIELD3.",
        "tip": "PRO-TIP: When configuring UNSTRING delimiter options, ensure your configurations follow current enterprise guidelines. Always check the OVERFLOW and TALLYING indicators to ensure the input string matched all target fields.",
        "quizOptions": [
            "UNSTRING only parses fixed-width strings",
            "UNSTRING splits a string into multiple fields based on specified delimiter characters",
            "UNSTRING is a legacy CICS command",
            "UNSTRING requires COMP-3 data"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_097",
        "category": "COBOL",
        "level": "Beginner",
        "question": "Describe a debugging technique to track and solve errors with BY REFERENCE vs BY CONTENT parameter passing using standard utilities.",
        "answer": "Dealing with BY REFERENCE vs BY CONTENT parameter passing requires understanding its impact on z/OS. sharing memory locations (REFERENCE) vs sending a copy (CONTENT) to a subprogram. In production, architects resolve issues by applying the following solution: Use BY CONTENT to protect the caller's variables from modification. Use BY REFERENCE to update fields in the subprogram.",
        "code": "CALL 'SUBPROG' USING BY REFERENCE WS-DATA-REF\n                      BY CONTENT WS-DATA-VAL.",
        "tip": "PRO-TIP: When configuring BY REFERENCE vs BY CONTENT parameter passing, ensure your configurations follow current enterprise guidelines. Using BY CONTENT prevents accidental side effects and is highly recommended for read-only parameters.",
        "quizOptions": [
            "BY REFERENCE passes a copy; BY CONTENT passes a pointer",
            "BY REFERENCE passes the actual memory address (mutable); BY CONTENT passes a temporary copy (read-only to caller)",
            "Both pass copies",
            "BY CONTENT is only for numeric fields"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_098",
        "category": "COBOL",
        "level": "Intermediate",
        "question": "How do storage administrators optimize the allocation and block size parameters for FILE STATUS checking?",
        "answer": "Dealing with FILE STATUS checking requires understanding its impact on z/OS. 2-byte return code indicating the success or failure of a file operation. In production, architects resolve issues by applying the following solution: Check File Status after every file statement (OPEN, READ, WRITE, CLOSE) to handle errors gracefully.",
        "code": "IF WS-FILE-STATUS NOT = '00'\n    DISPLAY 'FILE ERROR: ' WS-FILE-STATUS.",
        "tip": "PRO-TIP: When configuring FILE STATUS checking, ensure your configurations follow current enterprise guidelines. File status '35' means file not found during OPEN INPUT. File status '23' means record not found during READ.",
        "quizOptions": [
            "File status is only checked during abends",
            "It is a 2-byte field checked after every file I/O operation to detect success or specific error codes",
            "File status is only for VSAM files",
            "File status is automatically printed by JES2"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_099",
        "category": "COBOL",
        "level": "Expert",
        "question": "Explain the connection between REDEFINES clause rules and z/OS workload management priorities.",
        "answer": "Dealing with REDEFINES clause rules requires understanding its impact on z/OS. allowing different data structures to overlay the exact same memory location. In production, architects resolve issues by applying the following solution: The REDEFINES item must immediately follow the target item and must have the same or smaller level number.",
        "code": "05 WS-DATE PIC 9(8).\n05 WS-DATE-REDEF REDEFINES WS-DATE.\n   10 WS-YEAR  PIC 9(4).\n   10 WS-MONTH PIC 9(2).\n   10 WS-DAY   PIC 9(2).",
        "tip": "PRO-TIP: When configuring REDEFINES clause rules, ensure your configurations follow current enterprise guidelines. Use REDEFINES to parse generic text blocks into specific record structures based on header transaction codes.",
        "quizOptions": [
            "REDEFINES allocates new memory",
            "It allows a single storage area to be described by different data descriptions",
            "It must allocate larger memory than the target",
            "It can only be used with level 77 fields"
        ],
        "quizAnswerIndex": 1
    },
    {
        "id": "cobol_gen_100",
        "category": "COBOL",
        "level": "Beginner",
        "question": "What RACF authorizations and security constraints govern Level 88 condition names inside enterprise databases?",
        "answer": "Dealing with Level 88 condition names requires understanding its impact on z/OS. associating boolean condition labels with specific values of a parent variable. In production, architects resolve issues by applying the following solution: Define level 88 entries immediately below a variable and set them using SET or check them in IF conditions.",
        "code": "05 WS-STATUS PIC X.\n   88 WS-ACTIVE VALUE 'A'.\n   88 WS-INACTIVE VALUE 'I'.",
        "tip": "PRO-TIP: When configuring Level 88 condition names, ensure your configurations follow current enterprise guidelines. Level 88 entries make code extremely readable and simplify logic checks (e.g. IF WS-VALID-RECORD instead of comparisons).",
        "quizOptions": [
            "Level 88 defines a loop index",
            "It defines condition names associated with specific values of a parent field",
            "It defines CICS map structures",
            "It is for database unique keys"
        ],
        "quizAnswerIndex": 1
    }
];
