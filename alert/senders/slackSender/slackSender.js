const humanizeDuration = require('humanize-duration');
var config = require('../../../config/config.js')
var posts = require('./posts/posts.js');
var slackUtils = require('./utils/slackUtils.js');

function sendDownAlert(logEntry){
  slackUtils.postInChannel(posts.downAlert(logEntry));
}

function sendUpAlert(logEntry){
  slackUtils.postInChannel(posts.upAlert(logEntry, humanizeDuration(new Date() - logEntry.date, { language: 'es', round: true })));
}

function sendSslNotValidAlert(instance){
  slackUtils.postInChannel(posts.sslNotValidAlert(instance));
}

function sendSslGoingToExpireAlert(instance,certificate){
  slackUtils.postInChannel(posts.sslGoingToExpireAlert(instance, new Date(certificate.valid_to).format("DD/MM/YYYY")));
}

module.exports = {
  sendDownAlert:sendDownAlert,
  sendUpAlert:sendUpAlert,
  sendSslNotValidAlert:sendSslNotValidAlert,
  sendSslGoingToExpireAlert:sendSslGoingToExpireAlert
}
