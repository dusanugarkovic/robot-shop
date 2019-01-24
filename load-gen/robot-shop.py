from locust import HttpLocust, TaskSet, task
from random import choice
from random import randint

class UserBehavior(TaskSet):
    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        print('Starting')

    @task
    def load(self):
        
        self.client.get('/categories')
        # all products in catalogue
        products = self.client.get('/products').json()
        for i in range(2):
            item = None
            while True:
                item = choice(products)
                if item['instock'] != 0:
                    break

            self.client.get('/product/{}'.format(item['sku']))
            




class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 1000
    max_wait = 2000
