const logger = require('bunyan').createLogger({
    name: 'caller',
    level: 'info'
});

const helper = require('./helper');
const calls = require('./calls');
const load = require('./load');

const express = require('express');
require('http').globalAgent.maxSockets = Infinity;

const app = express().use((req, res, next) => {
    res.set('Timing-Allow-Origin', '*');
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.listen(process.env.SERVER_PORT || 8081);

// load.load();

app.get('/', async (req, res, next) => {
    await calls.login();
    await goShopping();
    res.send("OK");
});

async function goShopping() {
    const userResponse = await calls.getUser();
    const uuid = userResponse.data.uuid;

    await calls.getAllCategories();

    const productsResponse = await calls.getAllProducts();
    const products = productsResponse.data;

    await workWithCart(uuid, products);
    await workWithCart(uuid, products);
    await workWithCart(uuid, products);

    await helper.timeout(0, 1000);

    const cartResponse = await calls.getCart(uuid);
    logger.info("Cart:", JSON.stringify(cartResponse.data));

    item = await helper.getRandomElement(cartResponse.data.items);
    await calls.updateCart(uuid, item.sku);

    await helper.timeout(0, 1000);

    const updatedCartResponse = await calls.getCart(uuid);
    logger.info('Updated Cart: ', JSON.stringify(updatedCartResponse.data));

    const codesResponse = await calls.getCodes();
    const code = await helper.getRandomElement(codesResponse.data);

    await helper.timeout(0, 1000);

    const citiesResponse = await calls.getCities(code.code);
    const city = await helper.getRandomElement(citiesResponse.data);

    await helper.timeout(0, 1000);

    const shippingResponse = await calls.calculateShipping(city.uuid);
    const shipping = shippingResponse.data;
    shipping.location = code.name + ' ' + city.name;

    const finalCartResponse = await calls.confirmShipping(uuid, shipping);
    logger.info('Final Cart: ', JSON.stringify(finalCartResponse.data));

    const orderResponse = await calls.pay(uuid, finalCartResponse.data);
    logger.info('Order: ', JSON.stringify(orderResponse.data));
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

    await calls.getProduct(sku);
    await calls.getRating(sku);

    const cartResponse = await calls.addToCart(uuid, sku);
    return cartResponse.data;
}