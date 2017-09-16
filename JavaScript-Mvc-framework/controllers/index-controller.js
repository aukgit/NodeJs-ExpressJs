/// <reference path="../extensions/ajax.js" />
/// <reference path="../extensions/clone.js" />
/// <reference path="../extensions/constants.js" />
/// <reference path="../extensions/hiddenContainer.js" />
/// <reference path="../extensions/inputChangeTracker.js" />
/// <reference path="../extensions/modal.js" />
/// <reference path="../extensions/pagination.js" />
/// <reference path="../extensions/regularExp.js" />
/// <reference path="../extensions/selectors.js" />
/// <reference path="../extensions/spinner.js" />
/// <reference path="../libs/DevOrgPlugins/WeReviewApps.js" />
/// <reference path="../libs/jquery.blockUI.js" />
/// <reference path="../extensions/urls.js" />
/// <reference path="../libs/toastr.js" />
/// <reference path="../libs/underscore.js" />
/// <reference path="../byId.js" />
/// <reference path="../controllers.js" />
/// <reference path="../jQueryCaching.js" />
/// <reference path="../jQueryExtend.fn.js" />
/// <reference path="../app.global.js" />
/// <reference path="../jQueryExtend.js" />
/// <reference path="../schema/hashset.js" />
/// <reference path="../attachInitialize.js" />
/// <reference path="../schema/schema.js" />
/// <reference path="../libs/jQuery/jquery-2.2.3.intellisense.js" />
/// <reference path="../schema/url.js" />
/// <reference path="../Prototype/Array.js" />

$.app.controllers.indexController = {
    // any thing related to controllers.
    pageId: "index-page",
    $pageElement: null,
    initialize: function () {
        //anything to config

    },
    isDebugging: true,
    actions: {
        /// <summary>
        /// Represents the collection of actions exist inside a controller.
        /// </summary>
        index: function () {
            /// <summary>
            /// Represents index action page.
            /// Refers to the data-action attribute.
            /// </summary>
            /// <returns type=""></returns>
            var self = $.app.controllers.indexController,
                consts = $.app.constants,
                server = consts.server,
                quriesTemplate = consts.jiraQueryData,
                projects = consts.jiraProjects,
                queryPath = consts.queryUrlPath;


            var compiledDataset = [];

            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            var $barchartPanel = $.byId("barchart-panel");
            $barchartPanel.hide();

            var projectsListInstance = []; // contains copy of constant structure

            var requestsCompleted = 0; // how many requests have been completed.

            var d = new Date();
            var monthIndex = d.getMonth();
            //console.log("Hello from login");
            //console.log(self);

            var $yearSelect = $("#year-select");
            var $monthSelect = $.byId("month-select");

            var options = [];
            var i;
            for (i = 0; i < months.length; i++) {
                var selected = '';
                if (monthIndex === i) {
                    selected = "selected";
                }
                options.push("<option value='" + i + "' " + selected + " >" + months[i] + "</option>");
            }

            $monthSelect.append(options.join(""));

            options = [];

            for (i = -20; i < 2; i++) {
                var selected = '';
                var year = parseFloat(d.getFullYear()) + i;

                if (year === d.getFullYear()) {
                    selected = "selected";
                }
                options.push("<option value='" + year + "' " + selected + " >" + year + "</option>");
            }

            $yearSelect.append(options.join(""));


            //console.log(quriesTemplate);
            //console.log(projects);
            //$monthSelect.selectpicker();
            //$monthSelect.selectpicker('val', monthIndex);

            var jiraCookie = $.cookie('jiraCookie');

            // console.log(self);


            if ($.isEmptyObject(jiraCookie)) {
                $.app.service.redirect.to("/views/login.html");
            } else {
                jiraCookie = JSON.parse(jiraCookie);
                if ($.isEmptyObject(jiraCookie.cookie)) {
                    $.app.service.redirect.to("/views/login.html");
                }
            }


            var login = JSON.parse($.cookie('jiraCookie'));
            // console.log(login);

            var $form = $.byId("jira-form");

            function lastDayOfMonth(Year, Month) {
                return new Date((new Date(Year, Month, 1)) - 1);
            }

            var getFirstAndLastDate = function (selectedMonth, year) {
                var y = parseFloat(year), m = selectedMonth;
                var firstDay = y + "-" + m + "-" + new Date(y, m, 1).getDate();
                var lastDay = y + "-" + m + "-" + lastDayOfMonth(y, selectedMonth).getDate();



                return {
                    firstDay: firstDay,
                    lastDay: lastDay
                }
            };

            $.byId("logout-button").click(function (e) {
                e.preventDefault();
                $.removeCookie('jiraCookie');
                $.app.service.redirect.to("/views/login.html");
            });

            var formRow = function (arr) {
                var str = [];
                for (var j = 0; j < arr.length; j++) {
                    var element = "<td>" + arr[j] + "</td>";
                    str.push(element);
                }
                return "<tr>" + str.join("") + "</tr>";
            }

            var processProjectDataIntoTable = function () {
                var tableHtml = [];
                var datasets = [];
                /**
                 * a.  Total # of JIRAs Delivered = 0
                 * c.  # of JIRAs Delivered without reopening = 1
                 * b.  # of JIRAs reopened due to Communication Gaps =2
                 * d.  # of JIRAs delivered and reopened for a Delta requirement =3
                 * e.  # of JIRAs delivered with defects = 4
                 * f.  # of JIRAs with quality issues in Product, Legacy or Bugs Post Warranty = 5
                 */
                console.log(projectsListInstance);

                var indexes = {
                    resolved: 0,
                    communication: 1,
                    delta: 2,
                    defects: 3,
                    bugs: 4
                }

                for (var j = 0; j < projectsListInstance.length; j++) {
                    var projectw = projectsListInstance[j],
                        title = projectw.projectsDisplayName,
                        results = projectw.results,
                        resolvedJiras = parseFloat(results[indexes.resolved].total),
                        communicationGap = parseFloat(results[indexes.communication].total),
                        delta = parseFloat(results[indexes.delta].total),
                        defects = parseFloat(results[indexes.defects].total),
                        bugs = parseFloat(results[indexes.bugs].total),
                        resolvedWithoutReOpen = resolvedJiras - communicationGap - delta - defects - bugs,
                        cells = [title, resolvedJiras, resolvedWithoutReOpen, communicationGap, delta, defects, bugs],
                        chartRow = { y: title, a: resolvedJiras, b: resolvedWithoutReOpen, c: communicationGap, d: delta, e: defects, f: bugs },
                        row = formRow(cells);
                    //console.log(cells);
                    // console.log(row);
                    // console.log(results);
                    datasets.push(chartRow);
                    tableHtml.push(row);
                }

                compiledDataset = datasets;
                var htmlString = tableHtml.join("");

                var $templateTable = $.byId("table-template").clone().attr('id', 'summary-table');
                var $placeHolder = $.byId("table-placeholder");

                $templateTable.find("tbody").html(htmlString);
                // console.log($templateTable.html());
                $placeHolder.empty().append($templateTable);
                $.byId("summary-table").DataTable({
                    responsive: true,
                    paging: false,
                    dom: 'Bfrtip',
                    buttons: [
                        'copy', 'csv', 'excel', 'print'
                    ]
                });

                $barchartPanel.show();
                $.byId("morris-bar-chart").empty();
                Morris.Bar({
                    element: 'morris-bar-chart',
                    data: datasets,
                    xkey: 'y',
                    ykeys: ['a', 'b', 'c', 'd', 'e', 'f'],
                    labels: ['Resolved Jiras',
                        'Resolve without ReOpen',
                        'ReOpen : Communication Gap',
                        'ReOpen : defects',
                        'ReOpen : Delta',
                        'ReOpen : Bugs, Legacy'],
                    barColors: ["#338eef", "green", "yellow", "red", "rgb(59, 70, 78)", "orange"]
                });
            }

            var getJiraResults = function (project, login) {
                /// <summary>
                /// Request each company wise JQL reqeust to NODEJS api server.
                /// </summary>
                /// <param name="project">Send a project type JSON , type of Project from Constants</param>
                /// <param name="login">Login json data from cookie. Extract cookie and then parse it to JSON and then send it here.</param>


                // each company JQL json format.
                var data = {
                    "jqls": project.jqls,
                    "login": login,
                    "additionalJiraFilters": {
                        "maxResults": 1
                    },
                    "filterFields": ["total"]
                };

                // console.log(data.jqls);
                var dataJsonString = JSON.stringify(data);

                $.ajax({
                    type: "POST",
                    url: server + queryPath,
                    data: dataJsonString,
                    contentType: "application/json",
                    dataType: "json",

                    success: function (response) {
                        // console.log(response);
                        project.results = response;
                        project.isDone = true;
                        // console.log(project);
                        // console.log(projectsListInstance);
                        requestsCompleted += 1;
                    },
                    error: function (x, e, d) {
                        //console.log("Error");
                        //console.log(x);
                        //console.log(e);
                        //console.log(d);

                        //alert("error");
                        toastr["error"]("Sorry failed to load data from NodeJS server.");
                    }
                }).always(function () {

                    $.app.global.documentFullSpinnerShow("... Loaded " + requestsCompleted + " Project(s) Successfully ...");
                    console.log("Req completed :" + requestsCompleted + " out of " + projectsListInstance.length);
                    if (requestsCompleted >= projectsListInstance.length) {
                        // console.log("triggering render");
                        processProjectDataIntoTable(projectsListInstance);
                        toastr["success"]("Everything loaded successfully.");
                        $.app.global.documentFullSpinnerHide();
                    }
                });
            }




            $form.submit(function (e) {
                e.preventDefault();

                requestsCompleted = 0;

                // var values = $form.serializeArray();
                var currentMonthIndex = d.getMonth() + 1;
                var selectedMonth = parseFloat($monthSelect.val()) + 1;
                var selectedYear = parseFloat($yearSelect.val());
                var currentDate = new Date();
                console.log(selectedMonth);
                console.log(selectedYear);

                var dateIsInFuture = (selectedMonth > currentMonthIndex && selectedYear === currentDate.getFullYear()) || selectedYear > currentDate.getFullYear();

                if (dateIsInFuture === true) {
                    toastr["error"]("Sorry your selected month is in future.");
                    return;
                }

                var dates = getFirstAndLastDate(selectedMonth, selectedYear);
                // console.log(dates);


                //alert("Processing the request ! Please wait");

                projectsListInstance = [];
                //var jqlList = [];
                //AND resolved >= @D1 AND resolved <= @D2, resolved >= 2017-08-01 AND resolved <= 2017-08-31

                var dateQuery = " AND resolved >= " + dates.firstDay + " AND resolved <= " + dates.lastDay;
                // console.log(dateQuery);


                $.app.global.documentFullSpinnerShow("... Requsting to NodeJS ...");

                for (var j = 0; j < projects.length; j++) {// 1; j++) {//
                    var project = projects[j],
                        projectId = project.projectsId,
                        projectQuery = "project in (" + projectId + ") ";

                    project.jqls = [];
                    for (var k = 0; k < quriesTemplate.length; k++) {//quriesTemplate.length; k++) {
                        var query = projectQuery + quriesTemplate[k] + dateQuery;
                        // console.log(query);
                        project.jqls.push(query);
                        //jqlList.push(query);
                    }

                    // console.log("starting : " + projectId);
                    // console.log(project);

                    // console.log(project.jqls);
                    getJiraResults(project, login);

                    projectsListInstance.push(project);

                    $.app.global.documentFullSpinnerShow("... Requsting " + j + " Project(s) ...");
                }

                console.log(projectsListInstance);
                //var interval = setInterval(function () {
                //    if (requestsCompleted === projectsListInstance.length) {
                //        // all processing done.
                //        processProjectDataIntoTable(projectsListInstance);
                //        alert("Done");
                //        clearInterval(interval);

                //    }
                //},
                //    400);



                //getJiraResults(jqlList, login);

                // console.log(jqlList);

                //var pass = $.jsonSearch(values, "name", "password").value;
                //var user = $.jsonSearch(values, "name", "email").value;
                // console.log($monthSelect.selectpicker('val'));
                //console.log(user);
                //console.log(pass);
            });

            //console.log($.cookie('name'));
            //console.log($.cookie('name', 'Hello'));
            //console.log($.cookie('name'));

        }

    }
}