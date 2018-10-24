var logger =  require('../logger.js');
var config = require('../config/config.js');
var senders = [];

for (sender of config.get('ALERT_SENDERS').split(',')) {
   senders.push(require(`./senders/${sender}Sender/${sender}Sender.js`));
}

function sendDownAlert(logEntry){
  logger.debug('Sending DOWN alerts!');
  for (sender of senders) {
    sender.sendDownAlert(logEntry);
  }
}

function sendUpAlert(logEntry){
  logger.debug('Sending UP alerts!');
  for (sender of senders) {
    sender.sendUpAlert(logEntry);
  }
}

function sendSslNotValidAlert(instance){
  logger.debug('Sending SSL Cert not valid alerts!');
  for (sender of senders) {
    sender.sendSslNotValidAlert(instance);
  }
}

function sendSslGoingToExpireAlert(instance,certificate){
  logger.debug('Sending SSL Cert expiration alerts!');
  for (sender of senders) {
    sender.sendSslGoingToExpireAlert(instance,certificate);
  }
}

module.exports = {
  sendDownAlert:sendDownAlert,
  sendUpAlert:sendUpAlert,
  sendSslNotValidAlert:sendSslNotValidAlert,
  sendSslGoingToExpireAlert:sendSslGoingToExpireAlert
}
