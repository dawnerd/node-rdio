var Hapi = require('hapi');
var qs = require('querystring');

var rdioConfig = {
  clientId: '',
  clientSecret: ''
}


var Rdio = require('../../')({
  rdio: rdioConfig
});

var server = new Hapi.Server('localhost', 8000);


// Please don't actually do this
// This variable will contain the users auth tokens.
// You should save the tokens in a session or something.
// You can pass the tokens into Rdio() to restore.
var rdio = new Rdio(/* tokens, config*/);

server.route([
  {
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply('<a href="/auth">Login here</a>');
    }
  },
  {
    method: 'GET',
    path: '/auth',
    handler: function(request, reply) {

      if (!request.query.code) {
        return reply.redirect('https://www.rdio.com/oauth2/authorize?response_type=code&client_id='+rdioConfig.clientId+'&redirect_uri=http://localhost:8000/auth');
      }

      rdio.getAccessToken({
        code: request.query.code,
        redirect: 'http://localhost:8000/auth'
      }, function(err) {
        if (err) {
          return reply(err);
        }

        reply.redirect('/user');
      });
    },
  },
  {
    method: 'GET',
    path: '/playback',
    handler: function(request, reply) {
      rdio.getPlaybackToken('localhost', function(err, response) {
        if (err) {
          return reply(err);
        }

        reply(response);
      });
    }
  },
  {
    method: 'GET',
    path: '/user',
    handler: function(request, reply) {
      rdio.request({
        method: 'currentUser'
      }, function(err, response) {
        if (err) {
          return reply(err);
        }

        reply(response);
      });
    }
  },
  {
    method: 'GET',
    path: '/search',
    handler: function(request, reply) {
      rdio.request({
        method: 'search',
        query: 'diplo',
        start: 0,
        count: 20,
        types: 'Track'
      }, function(err, response) {
        if (err) {
          return reply(err);
        }

        reply(response);
      });
    }
  },
  {
    method: 'GET',
    path: '/lastPlayed',
    handler: function(request, reply) {
      rdio.getClientToken(function(err) {
        if (err) {
          return reply(err);
        }

        rdio.request({
          method: 'findUser',
          vanityName: 'dawnerd',
          extras: 'lastSongPlayed'
        }, false, function(err, response) {
          if (err) {
            return reply(err);
          }

          reply(response);
        });
      });
    }
  },
]);

server.start();
