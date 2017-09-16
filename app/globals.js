module.exports = {
    isEmpty: function (o) {
        return o === undefined || o === null;
    },

    getClientPostPromise: function (hostName, path, args, limitChunkNumber, acceptingStatus, checkDurationInMilisec) {
        /// <summary>
        /// Returns a promise , which can be used to get the post data.
        /// Handle it with Promise.then(function (data)...
        /// </summary>
        /// <param name="hostName">host url : example.com</param>
        /// <param name="path">give the path after the example.com</param>
        /// <param name="args">data and headers can be passed here.</param>
        /// <param name="limitChunkNumber">How many chunks we are going to capture.</param>
        /// <param name="acceptingStatus">By default status is 200</param>
        /// <param name="checkDurationInMilisec">by default it is 450ms</param>
        /// <returns type="">return data when the processing is done.</returns>

        var Promise = require('promise');
       

        var promise = new Promise((resolve, reject) => {
            var https = require("https");

            var data = args.data;
            var headers = args.headers;

            var query = JSON.stringify(data);
            var results = [], result = null;

            var isEmpty = function (o) {
                return o === undefined || o === null;
            };

            var options = {
                hostname: hostName,
                path: path,
                method: "POST"
            }

            if (isEmpty(acceptingStatus)) {
                acceptingStatus = 200;
            }

            if (isEmpty(limitChunkNumber)) {
                limitChunkNumber = -1;
            }

            if (isEmpty(checkDurationInMilisec)) {
                checkDurationInMilisec = 150;
            }

            // console.log("------- [Start] New Request at : " + hostName + path + "----------");
            var incrementingIndex = 0;
            var req2 = https.request(options,
                function (resp) {
                    // if the statusCode isn't what we expect, get out of here
                    if (resp.statusCode !== acceptingStatus) {
                        // console.log("StatusCode=" + resp.statusCode);
                        return null;
                    }

                    console.log("reading data : ");
                    resp.on("data", function (dataChunk) {
                        //  console.log('BODY: ' + cssMinified);
                        results.push(dataChunk);

                        if (limitChunkNumber > 0) {
                            if (results.length >= limitChunkNumber) {
                                result = results.join("");
                                //console.log("done reading");
                                // console.log("---------- [End] at : " + hostName + path + " with " + resp.statusCode + ", chunk :" + results.length + "---------");
                                resolve(result);
                            }
                        }

                        //console.log(dataChunk);
                    });

                    resp.on("end", function () {
                        result = results.join("");
                        //console.log("done reading");
                        // console.log("---------- [End] at : " + hostName + path + " with " + resp.statusCode + "---------");
                        resolve(result);
                    });
                    //resp.pipe(process.stdout);
                });

            req2.on("error", function (err) {
                throw err;
            });

            req2.setHeader("Content-Type", "application/json");
            req2.setHeader("Content-Length", query.length);

            if (!isEmpty(headers)) {
                for (var key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        // console.log(key + " -> " + headers[key]);
                        req2.setHeader(key, headers[key]);
                    }
                }
            }

            req2.end(query, "utf8");
            // console.log(req2.output);
        });

        return promise;
    },

    defferedClientPost: function (hostName, path, args, limitChunkNumber, acceptingStatus, checkDurationInMilisec) {
        /// <summary>
        /// Get deffered client post.
        /// </summary>
        /// <param name="hostName">host url : example.com</param>
        /// <param name="path">give the path after the example.com</param>
        /// <param name="args">data and headers can be passed here.</param>
        /// <param name="limitChunkNumber">How many chunks we are going to capture.</param>
        /// <param name="acceptingStatus">By default status is 200</param>
        /// <param name="checkDurationInMilisec">by default it is 450ms</param>
        /// <returns type="">return data when the processing is done.</returns>

       
        var result = null;
        var globals = require("./globals"),
            isEmpty = globals.isEmpty,
            promiseRequest = globals.getClientPostPromise;

        var sleep = require("system-sleep");
        

        if (isEmpty(acceptingStatus)) {
            acceptingStatus = 200;
        }

        if (isEmpty(limitChunkNumber)) {
            limitChunkNumber = -1;
        }

        if (isEmpty(checkDurationInMilisec)) {
            checkDurationInMilisec = 4;
        }

        var promise = promiseRequest(hostName, path, args, limitChunkNumber, acceptingStatus, checkDurationInMilisec);


        promise.then((resultx) => {
            result = resultx;
            return resultx;
        });


        while (result === null) {
            sleep(checkDurationInMilisec);
            //console.log("waiting " + checkDurationInMilisec);
            // console.log(result);
        }

        return result;
    }
};

