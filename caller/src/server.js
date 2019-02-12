const instana = require('instana-nodejs-sensor');
instana({
    tracing: {
        enabled: true
    }
});

const logger = require('bunyan').createLogger({
    name: 'caller',
    level: 'info'
});

const helper = require('./helper');
const calls = require('./calls');
const load = require('./load');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use((req, res, next) => {
    res.set('Timing-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', '*');
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.SERVER_PORT || 8081);

load.load();

app.get('/', async (req, res, next) => {
    try {
        const userInfo = await calls.login();
        logger.info('Login: ', JSON.stringify(userInfo));
    
        const result = await goShopping();
        res.json(result);
    } catch(error) {
        logger.error(error);
        res.send(error);
    }
});

async function goShopping() {
    const userResponse = await calls.getUser();
    const uuid = userResponse.uuid;

    var categories = await calls.getAllCategories();

    const products = await calls.getAllProducts();

    await workWithCart(uuid, products);
    await workWithCart(uuid, products);
    await workWithCart(uuid, products);

    await helper.timeout(0, 1000);

    const cart = await calls.getCart(uuid);
    logger.info("Cart:", JSON.stringify(cart));

    item = await helper.getRandomElement(cart.items);
    await calls.updateCart(uuid, item.sku);

    await helper.timeout(0, 1000);

    const updatedCart = await calls.getCart(uuid);
    logger.info('Updated Cart: ', JSON.stringify(updatedCart));

    const codes = await calls.getCodes();
    const code = await helper.getRandomElement(codes);

    await helper.timeout(0, 1000);

    const cities = await calls.getCities(code.code);
    const city = await helper.getRandomElement(cities);

    await helper.timeout(0, 1000);

    const shipping = await calls.calculateShipping(city.uuid);
    shipping.location = code.name + ' ' + city.name;

    const finalCart = await calls.confirmShipping(uuid, shipping);
    logger.info('Final Cart: ', JSON.stringify(finalCart));

    const order = await calls.pay(uuid, finalCart);
    logger.info('Order: ', JSON.stringify(order));

    return order;
}

async function workWithCart(uuid, products) {
    var sku;
    while (true) {
        const product = await helper.getRandomElement(products);
        if (product.instock != 0) {
            sku = product.sku;
            break;
        }
    }

    if (helper.getRandomInt(0, 10) < 5)
        await calls.rate(sku, helper.getRandomInt(1, 5))

    var product = await calls.getProduct(sku);
    logger.info('Product: ', JSON.stringify(product));

    var rating = await calls.getRating(sku);
    logger.info('Rating: ' + JSON.stringify(rating));

    const cart = await calls.addToCart(uuid, sku);
    return cart;
}