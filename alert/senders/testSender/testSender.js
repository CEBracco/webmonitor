const humanizeDuration = require('humanize-duration');
var alert = require('./alert/alert.js');

function sendDownAlert(logEntry) {
    console.log(alert.downAlert(logEntry));
}

function sendUpAlert(logEntry) {
    console.log(alert.upAlert(logEntry, humanizeDuration(new Date() - logEntry.date, { language: 'es', round: true })));
}

function sendSslNotValidAlert(instance) {
    console.log(alert.sslNotValidAlert(instance));
}

function sendSslGoingToExpireAlert(instance, certificate) {
    console.log(alert.sslGoingToExpireAlert(instance, new Date(certificate.valid_to).format("DD/MM/YYYY")));
}

module.exports = {
    sendDownAlert: sendDownAlert,
    sendUpAlert: sendUpAlert,
    sendSslNotValidAlert: sendSslNotValidAlert,
    sendSslGoingToExpireAlert: sendSslGoingToExpireAlert
}