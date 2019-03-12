import requests
import os

timeout = 10
web_host = os.getenv('WEB_HOST', 'http://35.184.201.202:8080')


def login():
    requests.post(web_host + '/api/user/login',
                  data={'name': 'user', 'password': 'password'},
                  timeout=timeout)


def get_user():
    r = requests.get(web_host + '/api/user/uniqueid',
                     timeout=timeout)
    return r.json()


def get_all_categories():
    r = requests.get(web_host + '/api/catalogue/categories',
                     timeout=timeout)
    return r.json()


def get_all_products():
    r = requests.get(web_host + '/api/catalogue/products',
                     timeout=timeout)
    return r.json()


def get_product(sku):
    r = requests.get(web_host + '/api/catalogue/product/' + sku,
                     timeout=timeout)
    return r.json()


def rate_product(sku, mark):
    r = requests.put(web_host +
                     '/api/ratings/api/rate/' + sku +
                     '/' + str(mark),
                     timeout=timeout)
    return r.json()


def get_rating(sku):
    r = requests.get(web_host + '/api/ratings/api/fetch/' + sku,
                     timeout=timeout)
    return r.json()


def add_to_cart(uuid, sku):
    r = requests.get(web_host + '/api/cart/add/' + uuid + '/' + sku + '/1',
                     timeout=timeout)
    return r.json()


def update_cart(uuid, sku):
    r = requests.get(web_host + '/api/cart/update/' + uuid + '/' + sku + '/2',
                     timeout=timeout)
    return r.json()


def get_cart(uuid):
    r = requests.get(web_host + '/api/cart/cart/' + uuid,
                     timeout=timeout)
    return r.json()


def get_codes():
    r = requests.get(web_host + '/api/shipping/codes',
                     timeout=timeout)
    return r.json()


def get_cities(code):
    r = requests.get(web_host + '/api/shipping/cities/' + code,
                     timeout=timeout)
    return r.json()


def calculate_shipping(city_uuid):
    r = requests.get(web_host + '/api/shipping/calc/' + city_uuid,
                     timeout=timeout)
    return r.json()


def confirm_shipping(uuid, shipping):
    r = requests.post(web_host + '/api/shipping/confirm/' + uuid,
                      json=shipping,
                      timeout=timeout)
    return r.json()


def pay_cart(uuid, cart):
    r = requests.post(web_host + '/api/payment/pay/' + uuid,
                      json=cart,
                      timeout=timeout)
    return r.json()
