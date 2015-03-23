'use strict';

var foldero = require('foldero');

var status = foldero('./status', { relative: __dirname });

module.exports.wireup = function wireupRoutes(injector, configName, router) {
  router.route('/status')
    .get(status.get);
};
