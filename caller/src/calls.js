const request = require('request-promise-native');

const webHost = process.env.WEB_HOST || 'http://35.193.44.124';
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
                error ? reject(error) : resolve(body);
            });
        });
    },
    getUser: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/user/uniqueid',
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    getAllCategories: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/catalogue/categories',
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    getAllProducts: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/catalogue/products',
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    getProduct: async function (sku) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/catalogue/product/' + sku,
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    rate: async function (sku, mark) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/ratings/api/rate/' + sku + '/' + mark,
                method: 'PUT'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    getRating: async function (sku) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/ratings/api/fetch/' + sku,
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    addToCart: async function (uuid, sku) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/cart/add/' + uuid + '/' + sku + '/1',
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    updateCart: async function (uuid, sku) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/cart/update/' + uuid + '/' + sku + '/2',
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    getCart: async function (uuid) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/cart/cart/' + uuid,
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    getCodes: async function () {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/shipping/codes',
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    getCities: async function (code) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/shipping/cities/' + code,
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
            });
        });
    },
    calculateShipping: async function (cityUuid) {
        return new Promise((resolve, reject) => {
            request({
                url: webEndpoint + '/api/shipping/calc/' + cityUuid,
                method: 'GET'
            }, (error, response, body) => {
                error ? reject(error) : resolve(JSON.parse(body));
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
                error ? reject(error) : resolve(body);
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
                error ? reject(error) : resolve(body);
            });
        });
    }
};