'use strict';

var foldero = require('foldero');

var echo = foldero('./echo', { relative: __dirname });

module.exports.wireup = function wireupRoutes(injector, configName, router) {
  router.route('/echo')
    .put(echo.put);
};
