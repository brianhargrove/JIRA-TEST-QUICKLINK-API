'use strict';

var express = require('express');
var trusted = require('trusted-endpoint');

module.exports.wireup = function wireupRoutes(injector, configName) {
  var wireup = this.dir(__dirname, configName);

  injector.when('app', function(app) {

    // publicly visible routes...
    var publicRouter = express.Router();
    wireup('./public', publicRouter);
    app.use('/boilerplate/public/v1/:lang', publicRouter);

    // routes accessible only to trusted clients...
    var trustedRouter = express.Router();
    trustedRouter.all('*',
      trusted.demand.authenticatedEndpoint
    );
    wireup('./trusted', trustedRouter);
    app.use('/boilerplate/v1/:lang', trustedRouter);
  });
};
