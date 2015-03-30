'use strict';

var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: true,
      prettyPrint: true,
      depth: 1,
      level: 'info',
      handleExceptions: true,
      colorize: true
    })
  ],
  exitOnError: false
});

if (process.env.LOCAL_LOG_FILE === 'localdev') {
  logger.add(winston.transports.File, {
      level: 'debug',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    });
}

module.exports.logger = logger;

module.exports.wireup = function (injector) {
  injector.set('Logger', logger);
};
