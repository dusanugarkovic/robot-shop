const instana = require('instana-nodejs-sensor');
// init tracing
// MUST be done before loading anything else!
instana({
    tracing: {
        enabled: true
    }
});

const mongoClient = require('mongodb').MongoClient;
const mongoObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');

// MongoDB
var db;
var collection;
var mongoConnected = false;

const app = express();

app.use((req, res, next) => {
    res.set('Timing-Allow-Origin', '*');
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
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
    if(mongoConnected) {
        collection.find({}).toArray().then((products) => {
            res.json(products);
        }).catch((e) => {
            console.log('ERROR', e);
            res.status(500).send(e);
        });
    } else {
        res.status(500).send('database not avaiable');
    }
});

// product by SKU
app.get('/product/:sku', (req, res) => {
    if(mongoConnected) {
        collection.findOne({sku: req.params.sku}).then((product) => {
            console.log('product: ', JSON.stringify(product));
            if(product) {
            	getPromotion(product.sku).then((resp) => {
            		console.log('received body' + resp);
            		console.log('product price' + product.price);
            		product.price = product.price * 0.9;
            		console.log('product price reduced' + product.price);
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
    } else {
        res.status(500).send('database not available');
    }
});

// products in a category
app.get('/products/:cat', (req, res) => {
    if(mongoConnected) {
        collection.find({ categories: req.params.cat }).sort({ name: 1 }).toArray().then((products) => {
            res.json(products);
        }).catch((e) => {
            console.log('ERROR', e);
            res.status(500).send(e);
        });
    } else {
        res.status(500).send('database not avaiable');
    }
});

// all categories
app.get('/categories', (req, res) => {
    if(mongoConnected) {
        collection.distinct('categories').then((categories) => {
            res.json(categories);
        }).catch((e) => {
            console.log('ERROR', e);
            res.status(500).send(e);
        });
    } else {
        res.status(500).send('database not available');
    }
});

// search name and description
app.get('/search/:text', (req, res) => {
    if(mongoConnected) {
        collection.find({ '$text': { '$search': req.params.text }}).toArray().then((hits) => {
            res.json(hits);
        }).catch((e) => {
            console.log('ERROR', e);
            res.status(500).send(e);
        });
    } else {
        res.status(500).send('database not available');
    }
});

// set up Mongo
function mongoConnect() {
    return new Promise((resolve, reject) => {
    var mongoURL = process.env.MONGO_URL || 'mongodb://mongodb:27017/catalogue';
    mongoClient.connect(mongoURL, (error, _db) => {
        if(error) {
            reject(error);
        } else {
            db = _db;
            collection = db.collection('products');
            resolve('connected');
        }
    });
});
}

function mongoLoop() {
    mongoConnect().then((r) => {
        mongoConnected = true;
        console.log('MongoDB connected');
    }).catch((e) => {
        console.error('ERROR', e);
        setTimeout(mongoLoop, 2000);
    });
}

function getPromotion(sku) {
	return new Promise((resolve, reject) => {
		request({
		  url: 'http://promotion-svc:8080/search?sku=' + sku,
		  method: 'POST'
		}, (error, response, body) => {
		  if(error) {
			reject(error);
		  } else if(response.statusCode != 200) {
		    console.log('getPromotion promise response: ' + response.statusCode);
			reject(error);
		  } else {
		    resolve(body);
		  }
		});
	})
}

mongoLoop();

// fire it up!
const port = process.env.CATALOGUE_SERVER_PORT || '8080';
app.listen(port, () => {
    console.log('Started on port', port);
});
