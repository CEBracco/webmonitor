var config=require('../../../../config/config.js');

function downAlert(logEntry){
  return `<b>Monitor DOWN: ${logEntry.instance.nombre}</b>\n`
  + `¡La instancia no esta respondiendo! <a href="${logEntry.instance.urlSem}">Verificar...</a>`;
}

function upAlert(logEntry, downDuration){
  return `<b>Monitor UP: ${logEntry.instance.nombre}</b>\n`
  + `La instancia esta nuevamente activa (inactiva por ${downDuration}) <a href="${logEntry.instance.urlSem}">Verificar...</a>`;
}

function sslGoingToExpireAlert(instance, expireDate){
  return `<b>SSL Monitor: ${instance.nombre}</b>\n`
  + `El certificado vence el ${expireDate} <a href="${instance.urlSem}">Verificar...</a>`;
}

function sslNotValidAlert(instance){
  return `<b>SSL Monitor: ${instance.nombre}</b>\n`
  + `El certificado NO es valido! <a href="${instance.urlSem}">Verificar...</a>`;
}

module.exports = {
  downAlert:downAlert,
  upAlert:upAlert,
  sslGoingToExpireAlert:sslGoingToExpireAlert,
  sslNotValidAlert:sslNotValidAlert
}
