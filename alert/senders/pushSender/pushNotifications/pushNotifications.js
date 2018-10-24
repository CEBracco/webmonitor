function welcome(){
  return {
    "title": "Suscripción exitosa!",
    "body": "Las alertas del monitor llegarán por este medio",
    "click_action": "https://www.google.com"
  }
}

function downAlert(logEntry){
  return {
    "title": `Monitor DOWN: ${logEntry.instance.nombre}`,
    "body": '¡La instancia no esta respondiendo!',
    "click_action": logEntry.instance.urlSem
  }
}

function upAlert(logEntry, downDuration){
  return {
    "title": `Monitor UP: ${logEntry.instance.nombre}`,
    "body": `La instancia esta nuevamente activa (inactiva por ${downDuration})`,
    "click_action": logEntry.instance.urlSem
  }
}

function sslGoingToExpireAlert(instance, expireDate){
  return {
    "title": `SSL Monitor: ${instance.nombre}`,
    "body": `El certificado vence el ${expireDate}`,
    "click_action": instance.urlSem
  }
}

function sslNotValidAlert(instance){
  return {
    "title": `SSL Monitor: ${instance.nombre}`,
    "body": `El certificado NO es valido!`,
    "click_action": instance.urlSem
  }
}

module.exports = {
  welcome: welcome,
  downAlert:downAlert,
  upAlert:upAlert,
  sslGoingToExpireAlert:sslGoingToExpireAlert,
  sslNotValidAlert:sslNotValidAlert
}
