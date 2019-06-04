var config = require('../../../../config/config.js');

function downAlert(logEntry) {
    var alert = {
        type: 'availability',
        value: 'DOWN',
        instance: logEntry.instance,
        extra: {}
    };
    return alert;
}

function upAlert(logEntry, downDuration) {
    var alert = {
        type: 'availability',
        value: 'UP',
        instance: logEntry.instance,
        extra: {
            downDuration: downDuration
        }
    };
    return alert;
}

function sslGoingToExpireAlert(instance, expireDate) {
    var alert = {
        type: 'certificate',
        value: 'EXPIRE_SOON',
        instance: instance,
        extra: {
            expirationDate: expireDate
        }
    };
    return alert;
}

function sslNotValidAlert(instance) {
    var alert = {
        type: 'certificate',
        value: 'EXPIRED',
        instance: instance,
        extra: {}
    };
    return alert;
}

module.exports = {
    downAlert: downAlert,
    upAlert: upAlert,
    sslGoingToExpireAlert: sslGoingToExpireAlert,
    sslNotValidAlert: sslNotValidAlert
}
