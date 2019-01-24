const logger = require('bunyan').createLogger({
    name: 'caller',
    level: 'info'
});

require('instana-nodejs-sensor')({
    logger,
    level: 'info',
    tracing: {
        enabled: false
    }
});

process.on('SIGINT', terminateAllCalls);
process.on('SIGTERM', terminateAllCalls);

const request = require('request')

const webHost = process.env.WEB_HOST || 'catalogue';
const webPort = process.env.WEB_PORT || '8080';
const protocol = process.env.WEB_PROTOCOL || 'http://';
const webEndpoint = protocol + webHost + ":" + webPort;

const requestTimeOut = 10000; //ms

main();

async function main() {
    try {
        await Promise
            .resolve(load())
            .then(await main());
    } catch (error) {
        logger.error(error);
        main();
    }
}

async function load() {

    categories = await Promise.resolve(getAllCategories()).then(JSON.parse);
    products = await Promise.resolve(getAllProducts()).then(JSON.parse);

    Promise.all([
        await workWithCart(products),
        await workWithCart(products),
        await workWithCart(products)
    ]);

    await delay(0, 1000);

}

async function workWithCart(products) {
    var sku;
    while (true) {
        product = getRandomElement(products);

        if (product['instock'] != 0) {
            sku = product['sku'];
            break;
        }
    }

    Promise.all([
        await getProduct(sku)
    ]);
}

function login() {
    return new Promise((resolve, reject) => {
        request.post({
            url: webEndpoint + '/api/user/login',
            timeout: requestTimeOut,
            form: {
                name: 'user',
                password: 'password'
            }
        }, function callback(error, response, data) {
            error ? reject("login(): " + error) : resolve(data);
        });
    });
}

function getUser() {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/api/user/uniqueid',
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("getUser(): " + error) : resolve(data);
        });
    });
}

function getAllCategories() {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/categories',
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("getAllCategories(): " + error) : resolve(data);
        });
    });
}

function getAllProducts() {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/products',
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("getAllProducts(): " + error) : resolve(data);
        });
    });
}

function getProduct(sku) {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/product/' + sku,
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("getProduct(): " + error) : resolve(data);
        });
    });
}

function rate(sku, mark) {
    return new Promise((resolve, reject) => {
        request.put({
            url: webEndpoint + '/api/ratings/api/rate/' + sku + '/' + mark,
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("rate(): " + error) : resolve(data);
        });
    });
}

function getRating(sku) {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/api/ratings/api/fetch/' + sku,
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("getRating(): " + error) : resolve(data);
        });
    });
}

function addToCart(uuid, sku) {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/api/cart/add/' + uuid + '/' + sku + '/1',
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("addToCart(): " + error) : resolve(data);
        });
    });
}

function updateCart(uuid, sku) {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/api/cart/update/' + uuid + '/' + sku + '/2',
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("updateCart(): " + error) : resolve(data);
        });
    });
}

function getCart(uuid) {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/api/cart/cart/' + uuid,
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("getCart(): " + error) : resolve(data);
        });
    });
}

function getCodes() {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/api/shipping/codes',
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("getCodes(): " + error) : resolve(data);
        });
    });
}

function getCities(code) {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/api/shipping/cities/' + code,
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("getCities(): " + error) : resolve(data);
        });
    });
}

function calculateShipping(cityUuid) {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/api/shipping/calc/' + cityUuid,
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("calculateShipping(): " + error) : resolve(data);
        });
    });
}

function confirmShipping(uuid, shipping) {
    return new Promise((resolve, reject) => {
        request.post({
            url: webEndpoint + '/api/shipping/confirm/' + uuid,
            timeout: requestTimeOut,
            json: shipping
        }, function callback(error, response, data) {
            error ? reject("confirmShipping(): " + error) : resolve(data);
        });
    });
}

function pay(uuid, cart) {
    return new Promise((resolve, reject) => {
        request.post({
            url: webEndpoint + '/api/payment/pay/' + uuid,
            timeout: requestTimeOut,
            json: cart
        }, function callback(error, response, data) {
            error ? reject("pay(): " + error) : resolve(data);
        });
    });
}

function delay(min, max) {
    return new Promise(resolve => setTimeout(resolve, getRandomInt(min, max)));
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
}

/*
    Returns a random integer between min (inclusive) and max (inclusive)
*/
function getRandomInt(min, max) {
    min = Math.ceil(0);
    max = Math.floor(1000);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function terminateAllCalls() {
    enabledModules.forEach(mod => {
        if (mod.impl.enabled) {
            mod.impl.enabled = false;
            if (mod.impl.terminate) {
                mod.impl.terminate();
            }
        }
    });
    setTimeout(() => process.exit(0), 2000);
}