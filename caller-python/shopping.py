import calls
import logging
from random import choice
from random import randint
import time
from datetime import datetime

logging.basicConfig(level=logging.INFO)


def go_shopping(request_id):
    start_time = time.time()
    logging.info(str(datetime.now()) +
                 ' - START: Request with ID: ' + str(request_id))
    calls.login()
    uuid = calls.get_user()['uuid']
    calls.get_all_categories()
    products = calls.get_all_products()

    update_cart(uuid, products)
    update_cart(uuid, products)
    update_cart(uuid, products)

    calls.get_cart(uuid)

    codes = calls.get_codes()
    code = choice(codes)

    cities = calls.get_cities(code['code'])
    city = choice(cities)

    shipping = calls.calculate_shipping(city['uuid'])
    shipping['location'] = code['name'] + ' ' + city['name']

    cart = calls.confirm_shipping(uuid, shipping)

    order = calls.pay_cart(uuid, cart)
    logging.info(order)

    end_time = time.time()
    logging.info(str(datetime.now()) +
                 ' - END: Request with ID: ' + str(request_id))
    logging.info('Request ' + str(request_id) + ' duration: '
                 + str(end_time-start_time) + ' s')

    return order


def update_cart(uuid, products):
    sku = None
    while True:
        product = choice(products)
        if product['instock'] != 0:
            sku = product['sku']
            break

    if randint(0, 10) < 5:
        calls.rate_product(sku, randint(1, 5))

    product = calls.get_product(sku)
    logging.info(product)

    rating = calls.get_rating(sku)
    logging.info(rating)

    return calls.add_to_cart(uuid, sku)
