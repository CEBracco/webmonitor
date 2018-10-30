const humanizeDuration = require('humanize-duration');
var config = require('../../../config/config.js')
var messages = require('./messages/messages.js');
var telegramUtils = require('./utils/telegramUtils.js');

function sendDownAlert(logEntry){
  telegramUtils.broadcastMessage(messages.downAlert(logEntry));
}

function sendUpAlert(logEntry){
  telegramUtils.broadcastMessage(messages.upAlert(logEntry, humanizeDuration(new Date() - logEntry.date, { language: 'es' })));
}

function sendSslNotValidAlert(instance){
  telegramUtils.broadcastMessage(messages.sslNotValidAlert(instance));
}

function sendSslGoingToExpireAlert(instance,certificate){
  telegramUtils.broadcastMessage(messages.sslGoingToExpireAlert(instance, new Date(certificate.valid_to).format("DD/MM/YYYY")));
}

module.exports = {
  sendDownAlert:sendDownAlert,
  sendUpAlert:sendUpAlert,
  sendSslNotValidAlert:sendSslNotValidAlert,
  sendSslGoingToExpireAlert:sendSslGoingToExpireAlert
}
