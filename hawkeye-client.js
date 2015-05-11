(function() {
	"use strict";

	var request = require('request');

	var HawkeyeClient = function(config) {
		var self = this;

		// console.log(config);

		// define all endpoints here
		if(!config)
		{
			console.log("HawkeyeClient no config found");
			return false;
		}

		if(!config.host)
		{
			console.log("HawkeyeClient host required");
			return false;
		}

		var host 	  = config.host;
		var port 	  = config.port || 80;


		// run connection test when this object is instantiated
		// assumes there is a test endpoint, else, this won't run
		self.connect_test 		= false;


		// this will be set to true when a success test is made
		self.connected		 	= false;

		var endpoints = config.endpoints;


		self.execute = function(endpoint_code, params, cb)
		{
			var params = {
				form   : params,
				json   : true,
				uri    : host + endpoints[endpoint_code].url,
				method : endpoints[endpoint_code].method
			};

			// console.log(params);

			request(params, function(err, body) {
				if(err) {
					cb(err);
				} else {
					cb(null, body.body);
				}
			});
		}
	};

	module.exports = HawkeyeClient;
})();