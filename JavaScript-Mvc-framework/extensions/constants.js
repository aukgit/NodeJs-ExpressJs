; $.app.constants = {
    server: "http://localhost:8080/api/",
    authUrlPath: "login/jiraLogin",
    queryUrlPath: "jiraQueries",
    jiraQueryData: [
        /**
        a.       Total # of JIRAs Delivered = 0
        c.       # of JIRAs Delivered without reopening = 1
        b.      # of JIRAs reopened due to Communication Gaps = 2
        d.      # of JIRAs delivered and reopened for a Delta requirement = 3
        e.      # of JIRAs delivered with defects = 4
        f.       # of JIRAs with quality issues in Product, Legacy or Bugs Post Warranty = 5
        **/
        " AND status in (Resolved, Closed)", //  AND resolved >= @D1 AND resolved <= @D2, resolved >= 2017-08-01 AND resolved <= 2017-08-31
        //" ", // all reopen  || project in (@ProjectName)
        " AND \"Reopened Reason\" in (\"Communication Gaps\") ", // all reopen  || project in (@ProjectName)
        " AND \"Reopened Reason\" in (\"Delta Requirements\") ", // all reopen  || project in (@ProjectName)
        " AND \"Reopened Reason\" in (Defects) ", // all reopen  || project in (@ProjectName)        
        " AND \"Defect Type\" in (\"Defect Post Warranty\", \"Legacy Defect\", \"Product Defect\")"
    ],
    jiraProjects: [
        {
            projectsId: "CCAP, CC",
            projectsDisplayName: "Chefs Culinar"
        },
        {
            projectsId: "BREN",
            projectsDisplayName: "Brenntag"
        },
        {
            projectsId: "EVA, EVM, EVBS, EP, ECR",
            projectsDisplayName: "Evobus"
        },
        {
            projectsId: "PLB",
            projectsDisplayName: "Pipelife"
        },
        {
            projectsId: "GBO",
            projectsDisplayName: "GBO"
        },
        {
            projectsId: "SGG, SGC", // SGG, SGH, SGC, SGP, SAN
            projectsDisplayName: "Saint Gobain"
        },
        {
            projectsId: "TAL",
            projectsDisplayName: "Talis"
        },
        {
            projectsId: "IKO",
            projectsDisplayName: "IKO"
        },
        {
            projectsId: "STK",
            projectsDisplayName: "STK"
        },
        {
            projectsId: "RIS",
            projectsDisplayName: "RISO"
        },
        {
            projectsId: "BUTST",
            projectsDisplayName: "Bulter"
        },
        {
            projectsId: "KD",
            projectsDisplayName: "Kärcher DE"
        }
    ]


};