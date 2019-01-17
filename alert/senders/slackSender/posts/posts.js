var config=require('../../../../config/config.js');

function downAlert(logEntry){
  var post = {
    attachments: [
      {
          fallback: `Monitor DOWN: ${logEntry.instance.nombre}`,
          color: "#b71c1c",
          title: `Monitor DOWN: ${logEntry.instance.nombre}`,
          text: `¡La instancia no esta respondiendo! <${logEntry.instance.urlMunicipio}|Verificar...>`,
          footer: "Webmonitor",
          footer_icon: `${config.get('URL')}/imgs/logo.png`
      }
    ]
  };
  return post;
}

function upAlert(logEntry, downDuration){
  var post = {
    attachments: [
      {
          fallback: `Monitor UP: ${logEntry.instance.nombre}`,
          color: "#33691e",
          title: `Monitor UP: ${logEntry.instance.nombre}`,
          text: `La instancia esta nuevamente activa (inactiva por ${downDuration}) <${logEntry.instance.urlMunicipio}|Verificar...>`,
          footer: "Webmonitor",
          footer_icon: `${config.get('URL')}/imgs/logo.png`
      }
    ]
  };
  return post;
}

function sslGoingToExpireAlert(instance, expireDate){
  var post = {
    attachments: [
      {
          fallback: `SSL Monitor: ${instance.nombre}`,
          color: "#ffea00",
          title: `SSL Monitor: ${instance.nombre}`,
          text: `El certificado vence el ${expireDate} <${instance.urlMunicipio}|Verificar...>`,
          footer: "Webmonitor",
          footer_icon: `${config.get('URL')}/imgs/alt-logo.png`
      }
    ]
  };
  return post;
}

function sslNotValidAlert(instance){
  var post = {
    attachments: [
      {
          fallback: `SSL Monitor: ${instance.nombre}`,
          color: "#b71c1c",
          title: `SSL Monitor: ${instance.nombre}`,
          text: `El certificado NO es valido! <${instance.urlMunicipio}|Verificar...>`,
          footer: "Webmonitor",
          footer_icon: `${config.get('URL')}/imgs/logo.png`
      }
    ]
  };
  return post;
}

module.exports = {
  downAlert:downAlert,
  upAlert:upAlert,
  sslGoingToExpireAlert:sslGoingToExpireAlert,
  sslNotValidAlert:sslNotValidAlert
}
