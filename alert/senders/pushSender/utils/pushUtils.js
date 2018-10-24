var unirest = require("unirest");
var config =  require('../../../../config/config.js');
var pushServerKey = config.get('PUSH_SERVER_KEY');

function sendToOneDevice(subscriptionToken, notification, onComplete  = function(){}){
  var req = unirest("POST", "https://fcm.googleapis.com/fcm/send");
  
  req.headers({
    "cache-control": "no-cache",
    "authorization": `key=${pushServerKey}`,
    "content-type": "application/json"
  });
  
  req.type("json");
  req.send({
    "notification": notification,
    "to": subscriptionToken
  });
  
  req.end(onComplete);
}

function subscribeToTopic(subscriptionToken, topic, onComplete = function(){}){
  var req = unirest("POST", `https://iid.googleapis.com/iid/v1/${subscriptionToken}/rel/topics/${topic}`);

  req.headers({
    "cache-control": "no-cache",
    "authorization": `key=${pushServerKey}`
  });

  req.end(onComplete);
}

function sendToTopic(topic, notification, onComplete = function(){}){
  var req = unirest("POST", "https://fcm.googleapis.com/fcm/send");
  
  req.headers({
    "cache-control": "no-cache",
    "authorization": `key=${pushServerKey}`,
    "content-type": "application/json"
  });
  
  req.type("json");
  req.send({
    "notification": notification,
    "to": `/topics/${topic}`
  });
  
  // if (res.error) throw new Error(res.error);
  req.end(onComplete);
}

module.exports = {
  sendToOneDevice:sendToOneDevice,
  subscribeToTopic:subscribeToTopic,
  sendToTopic:sendToTopic
}
