var extend = require('extend');
var Winston = require('winston');
var Papertrail = require('winston-papertrail').Papertrail;

module.exports = function Logger(programName) {

    programName = programName || 'default';

    var paperTransport = new Papertrail({
        host: 'logs2.papertrailapp.com',
        port: 28144,
        program: programName,
        colorize: true
    });

    var consoleTransport = new Winston.transports.Console({
        level: 'debug',
        colorize: true,
        timestamp: function() {
            return (new Date()).toLocaleString();
        }
    });

    return new Winston.Logger({
        levels: {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        },
        transports: [
            consoleTransport,
            paperTransport
        ]
    });

}
