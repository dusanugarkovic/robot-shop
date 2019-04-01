import instana
import shopping
import os
from threading import Thread
import logging
import time

load_concurrency = int(os.getenv('LOAD_CONCURRENCY', 6))

number_of_requests = 0


def threaded_process(number_of_threads):
    global number_of_requests

    threads = []
    for i in range(number_of_threads):
        thread = Thread(target=shopping.go_shopping,
                        args=(number_of_requests,))
        threads.append(thread)
        number_of_requests += 1
        thread.start()

    [thread.join() for thread in threads]
    time.sleep(2)


def main():
    logging.info('Application is running... ')
    logging.info('Load concurrency: ' + str(load_concurrency))
    while True:
        try:
            threaded_process(load_concurrency)
        except Exception as err:
            logging.error(err)
            continue


main()
