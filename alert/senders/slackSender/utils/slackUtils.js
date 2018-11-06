var unirest = require("unirest");
var config =  require('../../../../config/config.js');
var webhook = config.get('SLACK_WEBHOOK');

function postInChannel(post, onComplete = function(){}){
  var req = unirest("POST", webhook);

  req.headers({
    "cache-control": "no-cache",
    "Content-Type": "application/json"
  });

  req.type("json");
  req.send(post);

  // if (res.error) throw new Error(res.error);
  req.end(onComplete);
}

module.exports = {
  postInChannel:postInChannel
}
