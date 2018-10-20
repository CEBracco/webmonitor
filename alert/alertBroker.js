var logger =  require('../logger.js');
var mailSender = require('./senders/mailSender/mailSender.js');

function sendDownAlert(logEntry){
  logger.debug('Sending DOWN alerts!')
  mailSender.sendDownAlert(logEntry);
}

function sendUpAlert(logEntry){
  logger.debug('Sending UP alerts!')
  mailSender.sendUpAlert(logEntry);
}

function sendSslNotValidAlert(){
  logger.debug('Sending SSL Cert not valid alerts!')
  mailSender.sendSslNotValidAlert();
}

function sendSslGoingToExpireAlert(instance,certificate){
  logger.debug('Sending SSL Cert expiration alerts!')
  mailSender.sendSslGoingToExpireAlert(instance,certificate);
}

module.exports = {
  sendDownAlert:sendDownAlert,
  sendUpAlert:sendUpAlert,
  sendSslNotValidAlert:sendSslNotValidAlert,
  sendSslGoingToExpireAlert:sendSslGoingToExpireAlert
}
