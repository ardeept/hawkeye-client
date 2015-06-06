(function() {
	"use strict";

	var request = require('request');
	var _ = require('lodash');

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

		self.with_authentication = config.with_authentication || false;
		self.authenticated 		 = false;



		var endpoints = config.endpoints;



		self.authenticate = function(cb)
		{
			// make sure there is an auth endpoint set
			if(endpoints['auth'])
			{

				var params = {
					form   : endpoints['auth'].params,
					json   : true,
					uri    : host + endpoints['auth'].url,
					method : 'post'
				};

				request(params, function(err, r, body) {
					if(err) {
						cb(err);
					} else {

						if(r.statusCode == 200)
						{
							// no error code, let's get the token
							self.auth_user_token 	= body.data.token;
							self.auth_user_id 		= body.data.id;

							console.log("Auth OK", body.data);

							self.authenticated = true;

							cb(null, body);	
						}
						else
						{


							console.log("FAILED_TO_AUTHENTICATE", body, params);
							process.exit(1);
							return false;
						}
					}
				});
			}
			else
			{
				// with_authentication set to true, but there is non auth endpoint set
				console.log("CANT_AUTHENTICATE");
				process.exit(1);
				return false;
			}
		}


		self.execute = function(endpoint_code, params, cb)
		{
			if(self.with_authentication && self.authenticated == false)
			{
				// authenticate first
				self.authenticate(function(err, data){
					self._execute(endpoint_code, params, cb);	
				});
			}
			else
			{
				self._execute(endpoint_code, params, cb);
			}
		}


		self._execute = function(endpoint_code, params, cb)
		{
			if(config.default_params)
			{
				params = _.merge(params, config.default_params);
			}

			var api_params = {
				json   : true,
				uri    : host + endpoints[endpoint_code].url,
				method : endpoints[endpoint_code].method,
				
			};

			if(api_params.method == 'get')
			{
				api_params['qs'] = params;
			}
			else
			{
				api_params['form'] = params;
			}

			if(self.with_authentication)
			{
				// let's add as header
				api_params['headers'] = {
					"token" 	: self.auth_user_token,
					"user-id" 	: self.auth_user_id
				};
			}

			request(api_params, function(err, r, body) {
				if(err) {
					cb(err);
				} else {

					if(r.statusCode == 200)
					{
						cb(null, body);	
					}
					else
					{
						cb(new Error(r.statusCode), body );
					}

					
				}
			});
		}
	};

	module.exports = HawkeyeClient;
})();