module.exports = {
  
	example: function (req, reqParams, post, app, config){
		
		console.log(reqParams);
		return reqParams;
	},
	
	exampleGet: function (req, reqParams, post, app, config){
		var id = req.params.id;
		var getParams = req.query;
		console.log(getParams);
		return getParams;
	},
	
	examplePut: function (req, reqParams, post, app, config){
		
		console.log(reqParams);
		return reqParams;
	},
	
	examplePost: function (req, reqParams, post, app, config){
		
		console.log(reqParams);
		return post;
	}
};

