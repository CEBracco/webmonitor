var config=require('../../../../config/config.js');

function welcome(){
  return {
    "title": "Suscripción exitosa!",
    "body": "Las alertas del monitor llegarán por este medio",
    "click_action": "https://www.google.com",
    "icon": `${config.get('URL')}/imgs/logo.png`
  }
}

function downAlert(logEntry){
  return {
    "title": `Monitor DOWN: ${logEntry.instance.nombre}`,
    "body": '¡La instancia no esta respondiendo!',
    "click_action": logEntry.instance.urlMunicipio,
    "icon": `${config.get('URL')}/imgs/down.png`
  }
}

function upAlert(logEntry, downDuration){
  return {
    "title": `Monitor UP: ${logEntry.instance.nombre}`,
    "body": `La instancia esta nuevamente activa (inactiva por ${downDuration})`,
    "click_action": logEntry.instance.urlMunicipio,
    "icon": `${config.get('URL')}/imgs/up.png`
  }
}

function sslGoingToExpireAlert(instance, expireDate){
  return {
    "title": `SSL Monitor: ${instance.nombre}`,
    "body": `El certificado vence el ${expireDate}`,
    "click_action": instance.urlMunicipio,
    "icon": `${config.get('URL')}/imgs/cert_warning.png`
  }
}

function sslNotValidAlert(instance){
  return {
    "title": `SSL Monitor: ${instance.nombre}`,
    "body": `El certificado NO es valido!`,
    "click_action": instance.urlMunicipio,
    "icon": `${config.get('URL')}/imgs/cert_error.png`
  }
}

module.exports = {
  welcome: welcome,
  downAlert:downAlert,
  upAlert:upAlert,
  sslGoingToExpireAlert:sslGoingToExpireAlert,
  sslNotValidAlert:sslNotValidAlert
}
