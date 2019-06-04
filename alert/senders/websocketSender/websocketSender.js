const humanizeDuration = require('humanize-duration');
var config = require('../../../config/config.js')
var alert = require('./alert/alert.js');
var websocketUtils = require('./utils/websocketUtils.js');

function sendDownAlert(logEntry) {
    websocketUtils.broadcastMessage(alert.downAlert(logEntry));
}

function sendUpAlert(logEntry) {
    websocketUtils.broadcastMessage(alert.upAlert(logEntry, humanizeDuration(new Date() - logEntry.date, { language: 'es', round: true })));
}

function sendSslNotValidAlert(instance) {
    websocketUtils.broadcastMessage(alert.sslNotValidAlert(instance));
}

function sendSslGoingToExpireAlert(instance, certificate) {
    websocketUtils.broadcastMessage(alert.sslGoingToExpireAlert(instance, new Date(certificate.valid_to).format("DD/MM/YYYY")));
}

module.exports = {
    sendDownAlert: sendDownAlert,
    sendUpAlert: sendUpAlert,
    sendSslNotValidAlert: sendSslNotValidAlert,
    sendSslGoingToExpireAlert: sendSslGoingToExpireAlert
}