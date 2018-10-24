var _ = require('lodash');
const humanizeDuration = require('humanize-duration');
var logger =  require('../../../logger.js');
var config =  require('../../../config/config.js');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  host: config.get('MAIL_HOST'),
  port: config.get('MAIL_PORT'),
  secure: config.getBoolean('MAIL_SECURE'),
  requireTLS: config.getBoolean('MAIL_REQUIRETLS'),
  auth: {
    user: config.get('MAIL_USER'),
    pass: config.get('MAIL_PASSWORD')
  }
});
var message = {
  from: config.get('MAIL_FROM'),
  to: config.get('MAIL_TO'),
  cc: config.get('MAIL_CC'),
  bcc: config.get('MAIL_CCO')
}

function sendDownAlert(logEntry){
  message.subject = `Monitor is DOWN: ${logEntry.instance.nombre}`;
  message.html = getMailContent('mailDown',{logEntry:logEntry});
  sendMail(message);
}

function sendUpAlert(logEntry){
  message.subject = `Monitor is UP: ${logEntry.instance.nombre}`;
  message.html = getMailContent('mailUp',{logEntry:logEntry, downDuration:humanizeDuration(new Date() - logEntry.date)});
  sendMail(message);
}

function sendSslNotValidAlert(instance){
  message.subject = `Monitor SSL Certificate NOT VALID Alert: ${instance.nombre}`;
  message.html = getMailContent('mailSslNotValid',{instance:instance});
  sendMail(message);
}

function sendSslGoingToExpireAlert(instance,certificate){
  message.subject = `Monitor SSL Certificate Expiration Alert: ${instance.nombre}`;
  message.html = getMailContent('mailSslGoingToExpire',{instance:instance, expireDate:new Date(certificate.valid_to).format("DD/MM/YYYY")});
  sendMail(message);
}

function sendMail(message){
  transporter.sendMail(message, function(error, info){
    if (error) {
      logger.error(error);
    } else {
      logger.debug('Email alert sent: ' + info.response);
    }
  });
}

function getMailContent(alertName, params){
  var fs = require('fs');
  var content = fs.readFileSync(`alert/senders/mailSender/templates/${alertName}.html`, 'utf8');
  var compiled = _.template(content);
  return compiled(params);
}

module.exports = {
  sendDownAlert:sendDownAlert,
  sendUpAlert:sendUpAlert,
  sendSslNotValidAlert:sendSslNotValidAlert,
  sendSslGoingToExpireAlert:sendSslGoingToExpireAlert
}
