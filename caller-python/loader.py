import instana
import shopping
import os
from threading import Thread
from multiprocessing import Process
import logging

load_concurrency = int(os.getenv('LOAD_CONCURRENCY', 6))

number_of_requests = 0


def threaded_process(number_of_threads):
    global number_of_requests

    # threads = []
    # for i in range(number_of_threads):
    #     thread = Thread(target=shopping.go_shopping)
    #     threads.append(thread)
    #     number_of_requests += 1
    #     logging.info('Number of requests: ' + str(number_of_requests))

    # [thread.start() for thread in threads]
    # [thread.join() for thread in threads]

    processes = []
    for i in range(number_of_threads):
        process = Process(target=shopping.go_shopping)
        processes.append(process)
        number_of_requests += 1
        logging.info('Number of requests: ' + str(number_of_requests))

    [process.start() for process in processes]
    [process.join() for process in processes]


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
