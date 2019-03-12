from time import sleep
import requests
from threading import Thread
import random


concurrent = 25


def call_service():
    while True:
        try:
            requests.get(url='http://35.193.44.124:8080/', timeout=10)
            # sleep(random.uniform(1, 3))
        except Exception as err:
            print(err)


def threaded_process(number_of_threads):
    threads = []
    for i in range(number_of_threads):
        t = Thread(target=call_service)
        threads.append(t)

    [t.start() for t in threads]
    [t.join() for t in threads]


def main():
    threaded_process(concurrent)


main()
