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

$.app.controllers.loginController = {
    // any thing related to controllers.
    pageId: "login-page",
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
            var self = $.app.controllers.loginController,
                consts = $.app.constants,
                server = consts.server,
                authPath = consts.authUrlPath,
                queryPath = consts.queryUrlPath;

            //console.log("Hello from login");
            //console.log(self);
            var jiraCookie = $.cookie('jiraCookie');
            if (!$.isEmptyObject(jiraCookie)) {
                jiraCookie = JSON.parse(jiraCookie);
                if (!$.isEmptyObject(jiraCookie.cookie)) {
                    $.app.service.redirect.to("/views/index.html");
                }
            }

            var $form = $.byId("login-form");

            $form.submit(function (e) {
                e.preventDefault();
                var values = $form.serializeArray();
                var pass = $.jsonSearch(values, "name", "password").value;
                var user = $.jsonSearch(values, "name", "email").value;


                var loginArgs = {
                    username: user,
                    password: pass
                };


                var jsonString = JSON.stringify(loginArgs);
                // message, $blockingElement, $elementToHide, onBlockExecuteMethod;
                // toastr["error"]("Sorry couldn't reach API server or login failed. Please try to run the server first.");

                $.app.global.documentFullSpinnerShow("... Requesting for login ...");
                $.ajax({
                    type: "POST",
                    url: server + authPath,
                    data: jsonString,
                    contentType: "application/json",
                    dataType: "json",

                    success: function (response) {
                        console.log("Success");
                        console.log(response);
                        response = JSON.stringify(response);
                        $.cookie('jiraCookie', response);
                        $.app.service.redirect.to("/views/index.html");
                    },
                    error: function (x, e, d) {
                        //console.log("Error");
                        //console.log(x);
                        //console.log(e);
                        //console.log(d);
                        //alert("Please run the API server, cannot login to the jira or probably credentials are wrong.");
                        toastr["error"](
                            "Sorry couldn't reach API server or login failed. Please try to run the server first. Please try to run the API server againa nd try agian.");
                    }
                }).always(function () {
                    // alert("complete");
                    $.app.global.documentFullSpinnerHide();
                });;



            });

            //console.log($.cookie('name'));
            //console.log($.cookie('name', 'Hello'));
            //console.log($.cookie('name'));

        }

    }
}