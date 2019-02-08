const instana = require('instana-nodejs-sensor');
instana({
    tracing: {
        enabled: true
    }
});

const logger = require('bunyan').createLogger({
    name: 'catalogue',
    level: 'info'
});

// const mongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const express = require('express');
const request = require('request-promise-native');

// MongoDB
var collection;
var mongoConnected = false;

const app = express();
mongoConnect();

app.use((req, res, next) => {
    res.set('Timing-Allow-Origin', '*');
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/health', (req, res) => {
    var stat = {
        app: 'OK',
        mongo: mongoConnected
    };
    res.json(stat);
});

// all products
app.get('/products', (req, res) => {
    if (mongoConnected) {
        collection.find({}).toArray().then((products) => {
            getPromotion(products[0].sku);
            res.json(products);
        }).catch((e) => {
            logger.error('Error: ', err);
            res.status(500).send(e);
        });
    } else {
        res.status(500).send('database not avaiable');
    }
});

// product by SKU
app.get('/product/:sku', (req, res) => {
    if (mongoConnected) {
        collection.findOne({sku: req.params.sku}).then((product) => {
            logger.info('product: ', JSON.stringify(product));
            if (product) {
                getPromotion(product.sku).then((resp) => {
                    product.price = product.price * (1 - resp.discount);
                    logger.info('product price reduced: ' + product.price);
                    res.json(product);
                }).catch((err) => {
                    res.status(500).send(err);
                });
            } else {
                res.status(404).send('SKU not found');
            }
        }).catch((e) => {
            logger.error('Error: ', err);
            res.status(500).send(e);
        });
    } else {
        res.status(500).send('database not available');
    }
});

// products in a category
app.get('/products/:cat', (req, res) => {
    if (mongoConnected) {
        collection.find({categories: req.params.cat}).sort({name: 1}).toArray().then((products) => {
            res.json(products);
        }).catch((e) => {
            logger.error('Error: ', err);
            res.status(500).send(e);
        });
    } else {
        res.status(500).send('database not avaiable');
    }
});

// all categories
app.get('/categories', (req, res) => {
    if (mongoConnected) {
        collection.distinct('categories').then((categories) => {
            res.json(categories);
        }).catch((e) => {
            logger.error('Error: ', err);
            res.status(500).send(e);
        });
    } else {
        res.status(500).send('database not available');
    }
});

// search name and description
app.get('/search/:text', (req, res) => {
    if (mongoConnected) {
        collection.find({'$text': {'$search': req.params.text}}).toArray().then((hits) => {
            res.json(hits);
        }).catch((e) => {
            logger.error('Error: ', err);
            res.status(500).send(e);
        });
    } else {
        res.status(500).send('database not available');
    }
});

function getPromotion(sku) {
    return new Promise((resolve, reject) => {
        request({
            url: 'http://promotion-svc:8080/search?sku=' + sku,
            method: 'POST'
        }, (error, response, body) => {
            if (error) {
                logger.error('Error: ', err);
                reject(error);
            } else if (response.statusCode != 200) {
                logger.error('Error: ', err);
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        });
    })
}

function mongoConnect() {
    mongoose.connect('mongodb://mongodb:27017/catalogue', {
        useNewUrlParser: true
    }).then(() => {
        logger.info('Connecting to database successful.');
        mongoConnected = true;
        collection = mongoose.connection.collection('products');
    }).catch(err => {
        logger.error('Could not connect to Mongo DB: ', err);
        mongoConnect();
    });
}

// fire it up!
const port = process.env.CATALOGUE_SERVER_PORT || '8080';
app.listen(port, () => {
    logger.info('Started on port', port);
});
