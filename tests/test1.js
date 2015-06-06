var HC = require('../hawkeye-client.js');

var hc = new HC({
	host: "http://api.he.loc:20002/public",
	endpoints : {
		'test' : {
			url : '/test',
			method : 'GET'
		},
		'login' : {
			url : '/access/login',
			method : 'POST'
		},
		'logout' : {
			url : '/access/logout',
			method : 'POST'
		},
		'sendSms' 		: {
			url		 	: '/sms/send',
			method 		: 'post'
		},
		'pullOutbox' 		: {
			url		 	: '/sms/outbox',
			method 		: 'GET'
		},
		'inbox' 		: {
			url		 	: '/sms/inbox',
			method 		: 'GET'
		},
		'auth' 		    : {
			url  		: '/ajax/verify/login',
			method 		: 'POST',
			params 		: {
				'username' : 'inbound@yondu.com',
				'password' : '1234'
			}
		}
	},
	default_params : {
		ardee : 'test',
	}
});

var token = "";

function login()
{
	hc.execute('login', {
		username 	: 'a9_keyword_user1@yondu.com',
		password 	: '1234',
		txtid 		: 'globe9'
	}, check_login);
}

function check_login(err, data)
{
	console.log("check_login", err, data);

	if(!err)
	{
		if(data.status == true)
		{
			token = data.data.token;
			run();
		}
	}
}

function sendMessage(param)
{
	param.token = token;
	hc.execute('sendSms', param, function(err, data){
		console.log(err, data);
	});
}

function getInbox(param)
{
	param.token = token;
	hc.execute('inbox', param, function(err, data){
		console.log(err, data);
	});
}

// we are now logged in
function run()
{
	// sendMessage({
	// 	to 		: '09178802642',
	// 	message : 'hello there'
	// });

	getInbox({});
}

login();