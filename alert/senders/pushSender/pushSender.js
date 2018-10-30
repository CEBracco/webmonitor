const humanizeDuration = require('humanize-duration');
var config = require('../../../config/config.js')
var pushNotifications = require('./pushNotifications/pushNotifications.js');
var pushUtils = require('./utils/pushUtils.js');

function sendDownAlert(logEntry){
  pushUtils.sendToTopic(config.get('PUSH_TOPIC'), pushNotifications.downAlert(logEntry));
}

function sendUpAlert(logEntry){
  pushUtils.sendToTopic(config.get('PUSH_TOPIC'), pushNotifications.upAlert(logEntry, humanizeDuration(new Date() - logEntry.date, { language: 'es', round: true })));
}

function sendSslNotValidAlert(instance){
  pushUtils.sendToTopic(config.get('PUSH_TOPIC'), pushNotifications.sslNotValidAlert(instance));
}

function sendSslGoingToExpireAlert(instance,certificate){
  pushUtils.sendToTopic(config.get('PUSH_TOPIC'), pushNotifications.sslGoingToExpireAlert(instance, new Date(certificate.valid_to).format("DD/MM/YYYY")));
}

module.exports = {
  sendDownAlert:sendDownAlert,
  sendUpAlert:sendUpAlert,
  sendSslNotValidAlert:sendSslNotValidAlert,
  sendSslGoingToExpireAlert:sendSslGoingToExpireAlert
}
