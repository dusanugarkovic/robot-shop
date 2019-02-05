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

load.load();

app.get('/', (req, res, next) => {
    callCatalogue();
    res.send("OK");
});

async function callCatalogue() {
    calls.getAllCategories();

    const productsResponse = await calls.getAllProducts();
    const products = productsResponse.data;

    const product = await getRandomProductWithQuantityInStock(products);
    logger.info(product);
}

async function getRandomProductWithQuantityInStock(products) {
    var product;
    while (true) {
        product = await helper.getRandomElement(products);
        if (product.instock != 0) {
            break;
        }
    }

    return product;
}