let log4js = require('log4js');
const config = require('./config')

module.exports = function (filename, loglvl = 'debug') {
  let logger = log4js.getLogger(filename);
  logger.level = config.LOG_LEVEL || loglvl;
  return logger;
};
