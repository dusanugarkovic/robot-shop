const axios = require('axios');

const webHost = process.env.WEB_HOST || 'http://35.193.134.114';
const webPort = process.env.WEB_PORT || '8080';
const webEndpoint = webHost + ":" + webPort;

module.exports = {
    getAllCategories: async function () {
        return axios.get(webEndpoint + '/categories').catch(error => {
            console.log(error.response)
        });
    },

    getAllProducts: async function () {
        return axios.get(webEndpoint + '/products').catch(error => {
            console.log(error.response)
        });
    }
};