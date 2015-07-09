var Hoek = require('hoek');
var OAuth2 = require('oauth').OAuth2;
var qs = require('querystring');

module.exports = function(config) {

  function configSetup(config) {
    options = Hoek.applyToDefaults(defaults, config);
  }

  var defaults = {
    urls: {
      auth: 'https://www.rdio.com/oauth2/authorize',
      token: 'https://services.rdio.com/oauth2/token',
      resource: 'https://services.rdio.com/api/1/'
    },
    rdio: {
      clientId: "",
      clientSecret: ""
    }
  };

  var options = defaults;

  if(config) {
    configSetup(config);
  }

  function api(tokens, config) {
    this.tokens = tokens || {};

    if(config) {
      configSetup(config);
    }

    this.oauth = new OAuth2(
      options.rdio.clientId,
      options.rdio.clientSecret,
      '',
      options.urls.auth,
      options.urls.token,
      null
    );

    return this;
  }

  api.prototype.request = function(data, authType, callback) {
    var args = Hoek.applyToDefaults({}, data);

    if (typeof authType === 'function') {
      callback = authType;
      authType = 'protected';
    }

    var headers = {
      'Authorization': this.oauth.buildAuthHeader(authType === 'protected' ? this.tokens.accessToken : this.tokens.clientToken),
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    this.oauth._request('POST', options.urls.resource, headers, qs.stringify(args), null, function(err, response) {
      if (err) {
        return callback(err);
      }

      try {
        response = JSON.parse(response);
      } catch(e) {
        return callback(e);
      }

      callback(null, response);
    });
  };

  api.prototype.getAccessToken = function(params, callback) {
    var self = this;

    params = Hoek.applyToDefaults({
      refreshToken: this.tokens.refreshToken,
      code: null,
      redirect: ''
    }, params);

    if (params.code) {
      this.oauth.getOAuthAccessToken(params.code, {
        grant_type: 'authorization_code',
        code: params.code,
        redirect_uri: params.redirect
      }, function(err, accessToken, refreshToken) {
        if (err) {
          return callback(err);
        }

        self.tokens.accessToken = accessToken;
        self.tokens.refreshToken = refreshToken;

        callback();
      });
    } else {
      this.oauth.getOAuthAccessToken(params.refreshToken, {
        grant_type: 'refresh_token',
        redirect_uri: params.redirect
      }, function(err, accessToken, refreshToken) {
        if (err) {
          return callback(err);
        }

        self.tokens.accessToken = accessToken;
        self.tokens.refreshToken = refreshToken;

        callback();
      });
    }
  };

  api.prototype.getClientToken = function(callback) {
    var self = this;

    var postData = qs.stringify({
      'grant_type': 'client_credentials',
      'client_id': options.rdio.clientId,
      'client_secret': options.rdio.clientSecret
    });

    var postHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    this.oauth._request('POST', this.oauth._getAccessTokenUrl(), postHeaders, postData, null, function(err, data, response) {
      if (err) {
        return callback(err);
      }

      var results = JSON.parse(data);

      self.tokens.clientToken = results.access_token;

      callback();
    });
  };

  // helper methods
  api.prototype.setTokens = function(tokens) {
    this.tokens = Hoek.applyToDefaults(this.tokens, tokens);

    return this;
  };

  api.prototype.getTokens = function() {
    return this.tokens;
  };

  api.prototype.getPlaybackToken = function(domain, callback) {
    this.request({
      method: 'getPlaybackToken',
      domain: domain
    }, callback);
  };

  return api;
};
