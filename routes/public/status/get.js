'use strict';

var errors = require('http-equiv-errors');

var envelope = require('svcutils').envolope;

module.exports = function(request, response, next) {

  response.status(200)
    .json(envelope.success({
      status: 'nothing to report'
    })).end();
};
