var log4js = require('log4js');
var loggerLevel = 'debug';

function getLogger(){
  var logger = log4js.getLogger();
  logger.level = loggerLevel;
  return logger;
}

module.exports = getLogger();
