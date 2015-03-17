'use strict';

var express = require('express');
var trusted = require('trusted-endpoint');

module.exports.wireup = function wireupRoutes(injector, configName) {
  var wireup = this.dir(__dirname, configName);

  injector.when('app', function(app) {

    // publicly visible routes...
    var public = express.Router();
    wireup('./public')(public);
    app.use('/authentic/public/v1/:lang', public);

    // routes accessible only to trusted clients...
    var trusted = express.Router();
    trusted.all('*',
      trusted.demand.authenticatedEndpoint
    );
    wireup('./trusted')(trusted);
    app.use('/authentic/v1/:lang', trusted);
  });
};
