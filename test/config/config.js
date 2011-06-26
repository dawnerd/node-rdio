/*
	CrunchTune
	omnomnom - tasty tunes
	
	File: config-template.js
	Author: Troy Whiteley
	License: CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0/)
*/
exports.config = {
	//Server settings
	port: 3000,
	host: 'http://localhost',
	
	//Rdio settings
	rdio_oauth_request: 'http://api.rdio.com/oauth/request_token',
	rdio_oauth_access: 'http://api.rdio.com/oauth/access_token',
	rdio_oauth_auth: 'https://www.rdio.com/oauth/authorize?oauth_token=',
	rdio_api: 'http://api.rdio.com/1/',
	rdio_api_key: '8nfujzs8m5td6wy5cquap8vb',
	rdio_api_shared: 'FajApfbYva',
	songs_to_grab: 10,
};