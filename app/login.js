module.exports = {
    login: function (req, reqParams, post, app, config) {
        var login,
            globals = require("./globals"),
            isEmpty = globals.isEmpty;
        if (isEmpty(req)) {

        }

        return "login"; //, params:  reqParams };
    },

	example: function (req, reqParams, post, app, config){
		
		console.log(reqParams);
		return "Hello, " + reqParams;
	}
};

