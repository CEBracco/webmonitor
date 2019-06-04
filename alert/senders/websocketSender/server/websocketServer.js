var config = require('../../../../config/config.js');
var logger = require('../../../../logger.js');
var connectionPool = require('../connectionPool/connectionPool.js');

function start(server) {
    var WebSocketServer = require('websocket').server;
    wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    wsServer.on('request', function (request) {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            // logger.debug((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }
        var connection = request.accept(null, request.origin);
        // logger.debug((new Date()) + ' Connection accepted.');
        connectionPool.pushConnection(connection);
        connection.on('close', function (reasonCode, description) {
            connectionPool.removeConnection(connection);
            // logger.debug((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });
}

function originIsAllowed(origin) {
    return true;
}

module.exports = {
    start: start
}