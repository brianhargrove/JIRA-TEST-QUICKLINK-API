'use strict';

var errors = require('http-equiv-errors');
var validator = require('is-my-json-valid');

var envelope = require('svcutils').envolope;

var schema = require('./schemas').echo.put;
var validate = validator(schema);

module.exports = function(request, response, next) {
  var auth = request.user || request.endpointAuth;

  var model = request.body;

  if (!validate(model)) {
    return next(new errors.UnprocessableEntityError("authentic:invalid-structure", {
      errors: validate.errors,
      expected: schema
    }));
  }

  response.status(200)
    .json(envelope.success({
      endpoint: request.endpointAuth.subject,
      user: (request.user) ? request.user.subject : '-none-',
      who: model.who,
      what: model.what
    })).end();
};
