[![NPM version](https://badge.fury.io/js/rdio.png)](http://badge.fury.io/js/rdio)
[![Dependency Status](https://david-dm.org/dawnerd/node-rdio.png)](https://david-dm.org/dawnerd/node-rdio.png)

node-rdio is a wrapper for the rdio web service api.

## Installation

`npm install rdio --save`

## Future Changes - Please Read

This library is over 3 years old now. At the time I wrote it I was still fairly new to nodejs. Version 2 is coming!

Planned changes:

 - No longer required to pass in oauth tokens every request
 - getRequestToken & getAccessToken will be deprecated
 - New config() method for setup
 - Promises & event support
 - Shortcut methods for api endpoints
 - Data validation
 - Error handling

I'm open for requests. If you'd like to see something added, please open an issue.

## Usage

```javascript
var rdio = require('rdio')(config);

rdio.api(oauth_access_token, oauth_access_token_secret, {
    method: 'getTopCharts',
    type: 'Track',
    count: 10
}, callback);
```

## Methods

### api(access_token, secret_token, payload, callback)

 - **access_token** string - Oauth access token secret
 - **secret_token** string - Oauth access token secret
 - **payload** object - Data to sent to rdio. See [rdio web service api documentationn](http://www.rdio.com/developers/docs/web-service/index/) for properties.
 - **callback** function(err, data, response) - Called when request is completed.

### getRequestToken(callback)

 - **callback** function(error, oauth_token, oauth_token_secret, results)

### getAccessToken(auth_token, auth_token_secret, oauth_verifier, callback)

 - **auth_token** string
 - **auth_token_secret** string
 - **oauth_verifier** string
 - **callback** function(error, oauth_token, oauth_token_secret, results)

## Config

 - **rdio_api_key** string - rdio api key
 - **rdio_api_shared** string - rdio api shared secret
 - **callback_url** string - url oauth request will redirect to