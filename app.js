'use strict';

var util = require('util');
var foldero = require('foldero');
var fs = require('fs');
var path = require('path');
var ursa = require('ursa');

var pkg = require('./package');

var Configurator = require('env-configurator');
var injector = new(require('service-inject'))();
var wireup = require('wireup').dir(__dirname, injector).loader(require);

var spec = require('./config/${boilerplate}-spec');
var config = new Configurator();

require('./app_default_env');

var authKeyFile = path.normalize(process.env.${BOILERPLATE}_JWT_ISSUER_PUB);
var authenticPublicKey = fs.readFileSync(authKeyFile, 'utf8');

var privKeyFile = path.normalize(process.env.${BOILERPLATE}_TRUSTED_ENDPOINT_KEYFILE);
var endpointPrivateKey = fs.readFileSync(privKeyFile, 'utf8');

var options = {
  package: require('./package'),
  configName: spec.name,
  endpointPrivateKey: endpointPrivateKey,
  authenticPublicKey: authenticPublicKey,

  enableRemoteAuthority: true,
  enableCookieAuthority: false,

  wireupLibrary: function(app) {
    wireup('./lib', spec.name, app);
  },

  wireupRoutes: function(app) {
    wireup('./routes', spec.name, app);
  }
};

var logger = wireup('./lib/Logger').logger;

config.fulfill(spec, function(errs) {
  if (errs) {
    if (errs.length === 1) {
      throw errs[0];
    }
    errs.forEach(function(e) {
      logger.error('' + e);
    });
    throw new Error('Configuration errors occurred, see the logs.');
  }

  // use call-site to inject the options since it is only
  // intended for the app itself.
  wireup('trusted-app', options);

  // many services are dependent on config; injecting it last
  // will trigger many dependent wireups.
  injector.set('config', config);
});

module.exports = injector;
