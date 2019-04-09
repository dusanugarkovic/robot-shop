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

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request-promise-native');

var collection;
var mongoConnected = false;

const app = express();

if (!mongoConnected) {
    mongoConnect();
}

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
    collection.find({}).toArray().then((products) => {
        res.json(products);
    }).catch((e) => {
        logger.error('Error: ', e);
        res.status(500).send(e);
    });
});

// product by SKU
app.get('/product/:sku', (req, res) => {
    collection.findOne({sku: req.params.sku}).then((product) => {
        console.log('product: ', JSON.stringify(product));
        if (product) {
            getDiscount(product.sku).then((resp) => {
                product.price = product.price * (1 - resp.discount);
                console.log('product price reduced: ' + product.price);
                res.json(product);
            }).catch((err) => {
                res.status(500).send(err);
            });
        } else {
            res.status(404).send('SKU not found');
        }
    }).catch((e) => {
        console.log('ERROR', e);
        res.status(500).send(e);
    });
});

// products in a category
app.get('/products/:cat', (req, res) => {
    collection.find({categories: req.params.cat}).sort({name: 1}).toArray().then((products) => {
        res.json(products);
    }).catch((e) => {
        logger.error('Error: ', e);
        res.status(500).send(e);
    });
});

// all categories
app.get('/categories', (req, res) => {
    collection.distinct('categories').then((categories) => {
        res.json(categories);
    }).catch((e) => {
        logger.error('Error: ', e);
        res.status(500).send(e);
    });
});

// search name and description
app.get('/search/:text', (req, res) => {
    collection.find({'$text': {'$search': req.params.text}}).toArray().then((hits) => {
        res.json(hits);
    }).catch((e) => {
        logger.error('Error: ', e);
        res.status(500).send(e);
    });
})

function getDiscount(sku) {
    return new Promise((resolve, reject) => {
        request({
            url: 'http://discount-svc:8080/find/' + sku,
            method: 'GET'
        }, (error, response, body) => {
            if (error) {
                reject(error);
            } else if (response.statusCode != 200) {
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

const port = process.env.CATALOGUE_SERVER_PORT || '8080';
app.listen(port, () => {
    logger.info('Started on port', port);
});
