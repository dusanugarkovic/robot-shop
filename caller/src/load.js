const loadtest = require('loadtest');

const serverHost = process.env.SERVER_HOST || 'http://localhost';
const serverPort = process.env.SERVER_PORT || 8081;
const concurrency = process.env.LOAD_CONCURRENCY || 4;
const requestsPerSecond = process.env.LOAD_REQUESTS_PER_SECOND || 2;

module.exports.load = function () {
    const loadOptions = {
        method: 'GET',
        url: serverHost + ':' + serverPort + '/',
        timeout: 10000,
        concurrency: concurrency,
        requestsPerSecond: requestsPerSecond,
        agentKeepAlive: true
    };

    loadtest.loadTest(loadOptions, function (error, result) {
        if (error) {
            return console.error('Got an error: %s', error);
        }
    });
};