import instana
from flask import Flask
from bson.json_util import dumps
import logging
import requests
from pymongo import MongoClient
from logging.config import dictConfig

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = Flask(__name__)

client = MongoClient("mongodb://mongodb:27017/", maxPoolSize=100)
db = client["catalogue"]
collection = db["products"]


@app.route("/health")
def health_check():
    stat = dumps({
        "app": "OK",
        "mongo": True
    })
    app.logger.info(stat)
    return stat


@app.route("/products")
def products():
    products = dumps(collection.find())
    app.logger.info(products)
    return products


@app.route("/product/<sku>")
def product(sku):
    product = (collection.find_one({"sku": sku}))
    discount = get_discount(product['sku'])
    app.logger.info(dumps(discount))

    product["price"] *= 1 - discount['discount']
    app.logger.info(dumps(product))

    return dumps(product)


@app.route("/products/<category>")
def products_in(category):
    products = dumps(collection.find(
        {}, {"categories": category}).sort("name"))
    app.logger.info(products)
    return products


@app.route("/categories")
def categories():
    categories = dumps(collection.find().distinct("categories"))
    app.logger.info(categories)
    return categories


@app.route("/search/<text>")
def search(text):
    hits = dumps(collection.find({"$text": {"$search": text}}))
    app.logger.info(hits)
    return hits


def get_discount(sku):
    r = requests.get('http://discount-svc:8080/find/' + sku)
    return r.json()


if __name__ == "__main__":
    port = 8080
    app.logger.info('Starting on port {}'.format(port))
    app.run(host='0.0.0.0', port=port)
