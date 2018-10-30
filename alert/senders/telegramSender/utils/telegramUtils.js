var unirest = require("unirest");
var config =  require('../../../../config/config.js');
var botToken = config.get('TELEGRAM_BOT_TOKEN');
var channelId = config.get('TELEGRAM_CHANNEL_ID');

function broadcastMessage(message, onComplete = function(){}){
  var req = unirest("POST", `https://api.telegram.org/bot${botToken}/sendMessage`);

  req.headers({
    "cache-control": "no-cache",
    "Content-Type": "application/json"
  });

  req.type("json");
  req.send({
    "chat_id": channelId,
    "text": message,
    "parse_mode": "HTML"
  });

  // if (res.error) throw new Error(res.error);
  req.end(onComplete);
}

module.exports = {
  broadcastMessage:broadcastMessage
}
