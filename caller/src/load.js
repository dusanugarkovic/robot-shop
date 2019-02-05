const loadtest = require('loadtest');

const serverHost = process.env.SERVER_HOST || 'http://localhost';
const serverPort = process.env.SERVER_PORT || 8081;

module.exports.load = function () {
    const loadOptions = {
        url: serverHost + ':' + serverPort,
        timeout: 20000,
        concurrency: 3,
        requestsPerSecond: 0.5,
        agent: 'agentKeepAlive'
    };

    loadtest.loadTest(loadOptions, function (error, result) {
        if (error) {
            return console.error('Got an error: %s', error);
        }
    });
}