
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
	secret: "98yKGKgkdrg94tnkfdh"
}));

app.dynamicHelpers({
	session: function(req, res){
		return req.session;
	}
});

//load rdio
var rdio = require('rdio')({
	rdio_api_key: '8nfujzs8m5td6wy5cquap8vb',
	rdio_api_shared: 'FajApfbYva',
	callback_url: 'http://localhost:3000/oauth/callback'
})

// Routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'node-rdio'
  });
});

app.get('/oauth/login', function(req, res, params) {
    if (!req.session.oauth_access_token) {
        oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
            if (error) {
                console.log('error');
                console.log(error);
            } else {
                // store the tokens in the session
                req.session.oauth_token = oauth_token;
                req.session.oauth_token_secret = oauth_token_secret;

                // redirect the user to authorize the token
                res.redirect(ct.config.rdio_oauth_auth + oauth_token);
            }
        });
    } else {
        res.redirect("/");
    }
});

app.listen(3000);
console.log("To test node-rdio, open a browser to http://localhost:%d", app.address().port);
