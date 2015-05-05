'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var ptr = require('json-ptr');
var expect = require('expect.js');
var uuid = require('node-uuid');
var ursa = require('ursa');
var portfinder = require('portfinder');
var url = require('url');
var failfast = require('fail-fast');
var template = require('uri-template');
var TrustedClient = require('trusted-client').TrustedClient;
var svcutils = require('svcutils');
require('./app_test_env');

var format = util.format;

var debug = (process.env.DEBUG === 'true');

var keyId = 'scripts/internal';
var keyFile = path.normalize(path.join(__dirname, './test-key.pem'));
var key = fs.readFileSync(keyFile);

var en_US = 'en-US';

function print(it) {
  if (typeof(it) === 'string') {
    util.log(it);
  } else {
    util.log(util.inspect(it, false, 9));
  }
}

function takePrincipalId(id) {
  var ids = id.split('/');
  return ids[0];
}

function takeKeyId(id) {
  var ids = id.split('/');
  return (ids.length > 1) ? ids[1] : '';
}

var log = {
  info: print,
  warning: print,
  error: print,
  debug: print
};

describe('quicklink-api', function() {
  var injector;
  var ourUri;
  var _app;
  var _scope;
  var _logger;
  var _initialized;

  before(function(done) {
    this.timeout(6000);

    portfinder.getPort(function(err, port) {
      if (err) done(err);
      process.env.QUICKLINK_SERVER_PORT = port;

      injector = require('../'); // api's app.

      ourUri = url.format({ // and URL
        protocol: 'http',
        slashes: true,
        hostname: '127.0.0.1',
        port: port,
        pathname: '/'
      });

      // give the app 5 seconds to startup
      setTimeout(function() {
        var unfulfilled = injector.listUnfulfilled();
        if (unfulfilled && unfulfilled.length) {
          done(new Error('Failed to startup in time.'));
        } else {
          _initialized = true;
          done();
        }
      }, 5000);
    });
  });

  after(function() {
    if (_app) {
      _app.shutdown();
    }
  });

  it('[can be initialized with data]', function(done) {
    this.timeout(8000);
    _initialized = true;
    done();
  });

  describe('after being seeded with initial data', function() {

    function pollWaitForInit(done) {
      if (_initialized) {
        return done();
      }
      setTimeout(function() {
        pollWaitForInit(done);
      }, 200);
    }

    before(function(done) {
      pollWaitForInit(done);
    });

    describe('#echo', function() {

      var echoUrl;
      var client;

      before(function() {
        echoUrl = template.parse(ourUri + 'quicklink/v1/{lang}/echo');
        client = new TrustedClient({
          keyId: keyId,
          key: key,
          log: log
        });
      });

      it('should respond by echoing', function(done) {
        client.request(echoUrl.expand({
            lang: en_US
          }), {
            method: 'PUT',
            json: {
              who: 'the test',
              what: 'Yo, whuaddup?'
            }
          },
          svcutils.success({
            200: function statusOk(response, body) {
              expect(response.statusCode).to.be(200);
              print(body);
              done();
            }
          }).error(done));
      });

    });
  });
});
