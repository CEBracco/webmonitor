var connectionPool = require('../connectionPool/connectionPool.js');

function broadcastMessage(message) {
    connectionPool.getConnections().forEach(connection => {
        connection.sendUTF(JSON.stringify(message));
    });
}

module.exports = {
    broadcastMessage: broadcastMessage
}