var logger =  require('../logger.js');
var config = require('../config/config.js');
var port = config.get('PORT');
var pushUtils = require('../alert/senders/pushSender/utils/pushUtils.js');
var pushNotifications = require('../alert/senders/pushSender/pushNotifications/pushNotifications.js');
var express = require('express');
var app = express();
var secure = require('express-force-https');

app.use(secure);
app.use(express.json());

app.use('/', express.static(__dirname + '/app/static'));
app.set('views', __dirname + '/app/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get(['/','/index.html'], function(req, res){
    res.render("index", {
      projectId:config.get('PUSH_PROJECTID'),
      apiKey:config.get('PUSH_APIKEY'),
      messagingSenderId:config.get('PUSH_MESSAGINGSENDERID'),
      publicVapidKey:config.get('PUSH_PUBLICVAPIDKEY'),
      telegramChannelUrl:config.get('TELEGRAM_CHANNEL_URL'),
      slackChannelUrl:config.get('SLACK_CHANNEL_URL')
    });
});

app.get('/messagingSenderId.js', function(req, res){
  var content = `var messagingSenderId = "${config.get('PUSH_MESSAGINGSENDERID')}";`
  res.set('Content-Type', 'application/javascript');
  res.send(content);
});

app.post('/api/subscribe_user', function (req, res) {
  var responseObject = { ok: true };
  if(req.body && req.body.token){
    var token = req.body.token;
    pushUtils.subscribeToTopic(token, config.get('PUSH_TOPIC'), function(){
      logger.debug('User subscribed to push notifications!');
      pushUtils.sendToOneDevice(token, pushNotifications.welcome());
    });
  } else {
    reponseObject.ok = false;
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(responseObject));
});

function initWebsocketServer(server) {
  var wsServer = require('../alert/senders/websocketSender/server/websocketServer.js');
  return wsServer.start(server);
}

function start(){
  const server = require('http').createServer(app);
  initWebsocketServer(server);
  server.listen(port, function () {
    logger.debug("Static file server running at port => " + port);
  });
}

module.exports = {
  start:start
}
