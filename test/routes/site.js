/*
	CrunchTune
	omnomnom - tasty tunes
	
	File: site.js
	Author: Troy Whiteley
	License: CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0/)
*/

var ct = require('../app/ct'),
	url = require('url');

module.exports = function(app, rdio){
	app.get('/', function(req, res){
		
		rdio.api(
			req.session.oauth_access_token,
			req.session.oauth_access_token_secret,
			{
				method: 'getTopCharts',
				type: 'Track',
				count: 10
			}, function(err, data, response) {
				if(err) throw new Error(err);
				var songs = JSON.parse(data);
				
				rdio.getPlaybackToken(
					req.session.oauth_access_token,
					req.session.oauth_access_token_secret,
					ct.config.host,
					function(err, data, response) {
						if(err) throw new Error(err);
						res.render('index', {
							playbackToken: JSON.parse(data).result,
							songs: songs.result
						});
					}
				);
			}
		);
	});
	
	app.get ('/oauth/login', function(req, res, params) {
		if(!req.session.oauth_access_token) {
			rdio.getRequestToken(function(error, oauth_token, oauth_token_secret, results){
				if(error) {
					throw new Error(error);
				} else { 
					// store the tokens in the session
					req.session.oauth_token = oauth_token;
					req.session.oauth_token_secret = oauth_token_secret;

					// redirect the user to authorize the token
					res.redirect(ct.config.rdio_oauth_auth+oauth_token);
				}
			});
		} else {
			res.redirect("/");
		}
	});

	app.get ('/oauth/callback', function(req, res, params) {
		var parsedUrl = url.parse(req.url, true);
		rdio.getAccessToken(parsedUrl.query.oauth_token, req.session.oauth_token_secret, parsedUrl.query.oauth_verifier, 
			function(error, oauth_access_token, oauth_access_token_secret, results) {
				req.session.oauth_access_token = oauth_access_token;
				req.session.oauth_access_token_secret = oauth_access_token_secret;
				res.redirect("/");
			}
		)
	});
};