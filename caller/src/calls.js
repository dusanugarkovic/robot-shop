const request = require('request-promise-native');

const webHost = process.env.WEB_HOST || 'http://35.193.134.114';
const webPort = process.env.WEB_PORT || '8080';
const webEndpoint = webHost + ":" + webPort;

module.exports = {
    getAllCategories: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/categories',
                method: 'GET'
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                } else if (response.statusCode != 200) {
                    reject(error);
                } else {
                    resolve(JSON.parse(body));
                }
            });
        });
    },
    getAllProducts: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/products',
                method: 'GET'
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                } else if (response.statusCode != 200) {
                    reject(error);
                } else {
                    resolve(JSON.parse(body));
                }
            });
        });
    }
};