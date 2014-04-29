var express = require('express'),
	ct = require('./app/ct.js'),
	OAuth = require('oauth').OAuth,
	querystring = require('querystring'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session');
	
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//oauth setup
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
	secret: "98yKGKgkdrg94tnkfdh"
}));

// app.dynamicHelpers({
// 	base: function(){
// 		return '/' == app.route ? '' : app.route;
// 	},
// 	session: function(req, res){
// 		return req.session;
// 	}
// });

// Middleware
// app.configure(function(){
// 	app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
// 	app.use(express.bodyParser());
// 	app.use(express.methodOverride());
// 	app.use(app.router);
// 	app.use(express.static(__dirname + '/public'));
// 	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

app.use(express.static(__dirname + '/public'));

//setup rdio
var rdio = require('../')({
	rdio_api_key: ct.config.rdio_api_key,
	rdio_api_shared: ct.config.rdio_api_shared,
	callback_url: ct.config.host+":"+ct.config.port+"/oauth/callback"
});

// Routes
require('./routes/site')(app, rdio);

if (!module.parent) {
	app.listen(ct.config.port);
	console.log('Server started on port '+ct.config.port);
}