# node-rdio

node-rdio is a wrapper for the rdio web service api.

[![NPM version](https://badge.fury.io/js/rdio.png)](http://badge.fury.io/js/rdio)
[![Dependency Status](https://david-dm.org/dawnerd/node-rdio.png)](https://david-dm.org/dawnerd/node-rdio.png)

## Installation

`npm install rdio --save`

### Upgrading from < 3.0.0

Rdio is now requiring apps to switch over to OAuth 2.0. You can read more [about that here](http://www.rdio.com/developers/docs/web-service/oauth2/index/). The gist of it is you will need to create a new app and change how your app interfaces with the node-rdio module.

Good news is the module is much simpler to use and setup.

HUGE thanks to help from [@siboulet](https://github.com/siboulet) for bringing the module up to date. I've just gone in and merged it with my older v2.0 branch that was still using OAuth 1.0.

### Usage

```js
var Rdio = require('rdio'){
  rdio: {
    clientId: //client id from app manage page
    clientSecret: //client secret from app manage page
  }
};

// in a route or somewhere not global
var rdio = new Rdio({/*tokens*/}, {/*options*/});
```

 - (optional) Tokens should be passed in via an object that contains an `accessToken` and `refreshToken`.

 - (optional) Options can extend any of the defaults:

```js
{
  urls: {
    auth: 'https://www.rdio.com/oauth2/authorize',
    token: 'https://services.rdio.com/oauth2/token',
    resource: 'https://services.rdio.com/api/1/'
  },
  rdio: {
    clientId: "",
    clientSecret: ""
  }
}
```

When requesting an access token, your app must redirect the user to a url similar to:
```
https://www.rdio.com/oauth2/authorize?response_type=code&client_id=<clientId>&redirect_uri=<redirect_uri>
```

You can then take that code param and finalize the request:

```js
rdio.getAccessToken({
  code: request.query.code,
  redirect: 'http://localhost:8000/auth'
}, function(err) {
  if (err) {
    return reply(err);
  }

  reply.redirect('/user');
});
```

If everything went right you should see the `accessToken` and `refreshToken` set. To check this you can call `rdio.getTokens()`

For a more complete example checkout the example app in `examples/hapi/`.

### Unauthenticated calls

You can now make calls that only require client authentication by using the `rdio.getClientToken` method. See the example  directory for usage.

### Something go wrong?

Feel free to leave an issue if something is not working right. I've tested this with a few endpoints and it works, but there still may be some bugs lingering around.
