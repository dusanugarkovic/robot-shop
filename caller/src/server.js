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

const webHost = process.env.WEB_HOST || '35.193.162.239';
const webPort = process.env.WEB_PORT || '8080';
const protocol = process.env.WEB_PROTOCOL || 'http://';
const webEndpoint = protocol + webHost + ":" + webPort;

const requestTimeOut = 40000;

main();

async function main() {
    try {
        await Promise
            .resolve(login())
            .then(await delay(1000, 2000))
            .then(await load())
            .then(await main());
    } catch (error) {
        logger.error(error);
        main();
    }
}

async function load() {
    user = await Promise.resolve(getUser()).then(JSON.parse);

    await delay(1000, 2000);

    uuid = user['uuid'];

    categories = await Promise.resolve(getAllCategories()).then(JSON.parse);

    await delay(1000, 2000);

    products = await Promise.resolve(getAllProducts()).then(JSON.parse);

    await delay(0, 2000);

    Promise.all([
        await workWithCart(uuid, products),
        await workWithCart(uuid, products),
        await workWithCart(uuid, products)
    ]);

    cart = await Promise.resolve(getCart(uuid)).then(JSON.parse);
    console.log('Cart: ', cart);

    await delay(1000, 2000);

    items = cart['items'];
    item = items[Math.floor(Math.random() * items.length)];
    cartPromise = await Promise.resolve(updateCart(uuid, item['sku']));

    await delay(1000, 4000);

    updatedCart = await Promise.resolve(getCart(uuid)).then(JSON.parse);
    console.log('Updated Cart: ', updatedCart);

    await delay(1500, 2500);

    codes = await Promise.resolve(getCodes()).then(JSON.parse);
    code = getRandomElement(codes);
    console.log('Code: ', code);

    await delay(1000, 3000);

    cities = await Promise.resolve(getCities(code['code'])).then(JSON.parse);
    city = getRandomElement(cities);
    console.log('City: ', city);

    await delay(1500, 2000);

    shipping = await Promise.resolve(calculateShipping(city['uuid'])).then(JSON.parse);
    shipping['location'] = code['name'] + ' ' + city['name'];

    await delay(2000, 5000);

    finalCart = await Promise.resolve(confirmShipping(uuid, shipping));
    console.log('Final Cart: ', finalCart);

    await delay(1000, 3000);

    order = await Promise.resolve(pay(uuid, finalCart));
    console.log('Order: ', order);
}

async function workWithCart(uuid, products) {
    var sku;
    while (true) {
        product = getRandomElement(products);

        if (product['instock'] != 0) {
            sku = product['sku'];
            break;
        }
    }

    if (getRandomInt(0, 10) <= 3)
        await Promise.resolve(rate(sku, getRandomInt(1, 5))).then(await delay(1000, 2000));

    Promise.all([
        await getProduct(sku).then(await delay(0, 2000)),
        await getRating(sku).then(await delay(0, 2000)),
        await addToCart(uuid, sku).then(await delay(0, 2000))
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
            url: webEndpoint + '/api/catalogue/categories',
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("getAllCategories(): " + error) : resolve(data);
        });
    });
}

function getAllProducts() {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/api/catalogue/products',
            timeout: requestTimeOut
        }, function callback(error, response, data) {
            error ? reject("getAllProducts(): " + error) : resolve(data);
        });
    });
}

function getProduct(sku) {
    return new Promise((resolve, reject) => {
        request.get({
            url: webEndpoint + '/api/catalogue/product/' + sku,
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