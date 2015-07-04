## Installation

`npm install rdio --save`

## Usage

```javascript
var Rdio = require('rdio');

var rdio = new Rdio({
  clientId: 'oauth2 app client ID',
  clientSecret: 'oauth2 app client secret',
  refreshToken: 'oauth2 user refresh token',
});

rdio.login(function(err) {
  if (err) throw err;
  rdio.call('currentUser', function(err, result) {
    if (err) throw err;
    console.log(result);
  });
});
```


To obtain the oauth2 (refresh) token for your Rdio user:

 - Create an OAuth 2.0 App: http://www.rdio.com/developers/
 - Grant your application access to your Rdio user. From your browser, login to Rdio, then open: https://www.rdio.com/oauth2/authorize?response_type=code&client_id=APP_CLIENT_ID&redirect_uri=APP_REDIRECT_URL
 - If successful, watch the URL you are being redirected to. It will include a special code= paramater. This is the Authorization Code needed to obtain the Refresh Token.
 - Get the Refresh Token. From the command line: curl -d grant_type=authorization_code -d code=AUTHORIZATION_CODE -d redirect_uri=APP_REDIRECT_URL -d client_id=APP_CLIENT_ID -d client_secret=APP_CLIENT_SECRET https://services.rdio.com/oauth2/token
 - On success you will be given a Refresh Token.
