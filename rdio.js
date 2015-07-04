/***
 *                                           
 *                  |                 |o     
 *    ,---.,---.,---|,---.   ,---.,---|.,---.
 *    |   ||   ||   ||---'---|    |   |||   |
 *    `   '`---'`---'`---'   `    `---'``---'
 *                                           
 *	Author: Troy Whiteley <troy@somanyscientists.com>
 *	Homepage: http://github.com/dawnerd/
 *	License: MIT
 *
 */

var extend = require('util')._extend;
var querystring = require('querystring');

var OAuth2 = require('oauth').OAuth2;

var Rdio = function(config) {
  extend(this, config);

  this.oauth2 = new OAuth2(
    this.clientId,
    this.clientSecret,
    'https://services.rdio.com/',
    null,
    'oauth2/token',
    null
  );
}

Rdio.prototype.login = function(callback) {
  var self = this;

  this.oauth2.getOAuthAccessToken(this.refreshToken, {
    grant_type: 'refresh_token',
  }, function(err, accessToken, refreshToken) {
    if (err) return callback((err.data) ? new Error(JSON.parse(err.data).error_description) : err);
    self.accessToken = accessToken;
    self.refreshToken = refreshToken;
    callback();
  });
}

Rdio.prototype.call = function(method, args, callback) {
  if (typeof args === 'function') {
    callback = args;
    args = {};
  }

  var headers = {
    'Authorization': this.oauth2.buildAuthHeader(this.accessToken),
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  var data = querystring.stringify(extend(args, {method: method}));

  this.oauth2._request('POST', 'https://services.rdio.com/api/1/', headers, data, null, function(err, data) {
    if (err) return callback((err.data) ? new Error(JSON.parse(err.data).error_description) : err);
    data = JSON.parse(data);
    if (data.status !== 'ok') return callback(new Error(data.message));
    callback(null, data.result);
  });
};

module.exports = Rdio;
