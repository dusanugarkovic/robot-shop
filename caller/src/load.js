const loadtest = require('loadtest');

const serverHost = process.env.SERVER_HOST || 'http://localhost';
const serverPort = process.env.SERVER_PORT || 8081;

module.exports.load = function () {
    const loadOptions = {
        url: serverHost + ':' + serverPort,
        timeout: 10000,
        concurrency: process.env.LOAD_CONCURRENCY || 8,
        requestsPerSecond: process.env.LOAD_REQUESTS_PER_SECOND || 5,
        agent: 'agentKeepAlive'
    };

    loadtest.loadTest(loadOptions, function (error, result) {
        if (error) {
            return console.error('Got an error: %s', error);
        }
    });
}