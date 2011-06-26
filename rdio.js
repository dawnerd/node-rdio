/***
 *                                           
 *                  |                 |o     
 *    ,---.,---.,---|,---.   ,---.,---|.,---.
 *    |   ||   ||   ||---'---|    |   |||   |
 *    `   '`---'`---'`---'   `    `---'``---'
 *                                           
 *	Author: Troy Whiteley <troy@somanyscientists.com>
 *	Homepage: http://github.com/dawnerd/
 *	License: CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0/)
 *
 *
 *	Config options:
 *		rdio_api_key
 *		rdio_api_shared
 *		callback_url - URL user will be redirected to upon login
 */

module.exports = function(config, oauth) {
	if(typeof oauth == 'undefined') {
		var oauth = require('oauth').OAuth;
	}
	
	config.rdio_oauth_request = 'http://api.rdio.com/oauth/request_token';
	config.rdio_oauth_access = 'http://api.rdio.com/oauth/access_token';
	config.rdio_oauth_auth = 'https://www.rdio.com/oauth/authorize?oauth_token=';
	config.rdio_api = 'http://api.rdio.com/1/';
	
	//setup oauth
	var oa = new oauth(
		config.rdio_oauth_request,
		config.rdio_oauth_access, 
		config.rdio_api_key,
		config.rdio_api_shared, 
		"1.0", config.callback_url, "HMAC-SHA1");
	
	//public methods	
	return {
		getRequestToken: function(callback) {
			oa.getOAuthRequestToken(callback);
		},
		getAccessToken: function(auth_token, auth_token_secret, oauth_verifier, callback) {
			oa.getOAuthAccessToken(auth_token, auth_token_secret, oauth_verifier, callback);
		},
		getPlaybackToken: function(auth_token, auth_token_secret, host, callback) {
			this.api(
				auth_token,
				auth_token_secret,
				{
					method: 'getPlaybackToken',
					domain: encodeURIComponent(host)
				},
				callback
			);
		},
		
		api: function(auth_token, auth_token_secret, data, callback) {
			oa.post(
				config.rdio_api,
				auth_token,
				auth_token_secret,
				data,
				null,
				callback
			);
		}
	};
};