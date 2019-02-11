const request = require('request-promise-native');

const webHostCatalogue = process.env.WEB_HOST_CATALOGUE || 'http://35.193.134.114';
const webPortCatalogue = process.env.WEB_PORT_CATALOGUE || '8080';
const webEndpointCatalogue = webHostCatalogue + ":" + webPortCatalogue;

module.exports = {
    getAllCategories: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpointCatalogue + '/categories',
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
                url: webEndpointCatalogue + '/products',
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