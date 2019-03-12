const request = require('request-promise-native');

const webHost = process.env.WEB_HOST || 'http://35.184.201.202';
const webPort = process.env.WEB_PORT || '8080';
const webEndpoint = webHost + ":" + webPort;

module.exports = {
    login: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/user/login',
                method: 'POST',
                body: {
                    name: 'user',
                    password: 'password'
                },
                json: true
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("login - Error: " + response.statusMessage) :
                        resolve(body);
            });
        });
    },
    getUser: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/user/uniqueid',
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("getUser - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    getAllCategories: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/catalogue/categories',
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("getAllCategories - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    getAllProducts: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/catalogue/products',
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("getAllProducts - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    getProduct: async function (sku) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/catalogue/product/' + sku,
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("getProduct - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    rate: async function (sku, mark) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/ratings/api/rate/' + sku + '/' + mark,
                method: 'PUT'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("rate - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    getRating: async function (sku) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/ratings/api/fetch/' + sku,
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("getRating - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    addToCart: async function (uuid, sku) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/cart/add/' + uuid + '/' + sku + '/1',
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("addToCart - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    updateCart: async function (uuid, sku) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/cart/update/' + uuid + '/' + sku + '/2',
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("updateCart - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    getCart: async function (uuid) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/cart/cart/' + uuid,
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("getCart - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    getCodes: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/shipping/codes',
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("getCodes - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    getCities: async function (code) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/shipping/cities/' + code,
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("getCities - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    calculateShipping: async function (cityUuid) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/shipping/calc/' + cityUuid,
                method: 'GET'
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("calculateShipping - Error: " + response.statusMessage) :
                        resolve(JSON.parse(body));
            });
        });
    },
    confirmShipping: async function (uuid, shipping) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/shipping/confirm/' + uuid,
                method: 'POST',
                body: shipping,
                json: true
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("confirmShipping - Error: " + response.statusMessage) :
                        resolve(body);
            });
        });
    },
    pay: async function (uuid, cart) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/payment/pay/' + uuid,
                method: 'POST',
                body: cart,
                json: true
            }, (error, response, body) => {
                error ?
                    reject(error) :
                    response.statusCode < 200 || response.statusCode > 299 ?
                        reject("pay - Error: " + response.statusMessage) :
                        resolve(body);
            });
        });
    }
};