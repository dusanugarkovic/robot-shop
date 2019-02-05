const loadtest = require('loadtest');

const serverHost = process.env.SERVER_HOST || 'http://localhost';
const serverPort = process.env.SERVER_PORT || 8081;

module.exports.load = function () {
    const loadOptions = {
        url: serverHost + ':' + serverPort,
        timeout: 10000,
        concurrency: 8,
        requestsPerSecond: 5,
        agent: 'agentKeepAlive'
    };

    loadtest.loadTest(loadOptions, function (error, result) {
        if (error) {
            return console.error('Got an error: %s', error);
        }
    });
}