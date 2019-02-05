const axios = require('axios');

const webHost = process.env.WEB_HOST || 'http://35.193.162.239';
const webPort = process.env.WEB_PORT || '8080';
const webEndpoint = webHost + ":" + webPort;

module.exports = {
    login: async function () {
        return axios.post(webEndpoint + '/api/user/login', {
            name: 'user',
            password: 'password'
        }).catch(error => {
            console.log(error.response)
        });;
    },

    getUser: async function () {
        return axios.get(webEndpoint + '/api/user/uniqueid').catch(error => {
            console.log(error.response)
        });;
    },

    getAllCategories: async function () {
        return axios.get(webEndpoint + '/api/catalogue/categories').catch(error => {
            console.log(error.response)
        });;
    },

    getAllProducts: async function () {
        return axios.get(webEndpoint + '/api/catalogue/products').catch(error => {
            console.log(error.response)
        });;
    },

    getProduct: async function (sku) {
        return axios.get(webEndpoint + '/api/catalogue/product/' + sku).catch(error => {
            console.log(error.response)
        });;
    },

    rate: async function (sku, mark) {
        return axios.put(webEndpoint + '/api/ratings/api/rate/' + sku + '/' + mark).catch(error => {
            console.log(error.response)
        });;
    },

    getRating: async function (sku) {
        return axios.get(webEndpoint + '/api/ratings/api/fetch/' + sku).catch(error => {
            console.log(error.response)
        });;
    },

    addToCart: async function (uuid, sku) {
        return axios.get(webEndpoint + '/api/cart/add/' + uuid + '/' + sku + '/1').catch(error => {
            console.log(error.response)
        });;
    },

    updateCart: async function (uuid, sku) {
        return axios.get(webEndpoint + '/api/cart/update/' + uuid + '/' + sku + '/2').catch(error => {
            console.log(error.response)
        });;
    },

    getCart: async function (uuid) {
        return axios.get(webEndpoint + '/api/cart/cart/' + uuid).catch(error => {
            console.log(error.response)
        });;
    },

    getCodes: async function () {
        return axios.get(webEndpoint + '/api/shipping/codes').catch(error => {
            console.log(error.response)
        });;
    },

    getCities: async function (code) {
        return axios.get(webEndpoint + '/api/shipping/cities/' + code).catch(error => {
            console.log(error.response)
        });;
    },

    calculateShipping: async function (cityUuid) {
        return axios.get(webEndpoint + '/api/shipping/calc/' + cityUuid).catch(error => {
            console.log(error.response)
        });;
    },

    confirmShipping: async function (uuid, shipping) {
        return axios.post(webEndpoint + '/api/shipping/confirm/' + uuid, shipping).catch(error => {
            console.log(error.response)
        });;
    },

    pay: async function (uuid, cart) {
        return axios.post(webEndpoint + '/api/payment/pay/' + uuid, cart).catch(error => {
            console.log(error.response)
        });;
    }
};