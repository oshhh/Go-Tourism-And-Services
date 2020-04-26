import random
from random import randint
import datetime

trip_id_limit = 40
service_request_offset = 50
flights_limit = 50
rooms_limit = 100
food_items_limit = 50
bus_train_limit = 30
guides_limit = 20
services = [('FLI', 50), ('ROO', 100), ('FOO', 50), ('BUS', 20), ('TRA', 15)]

start_date = datetime.date(2020, 1, 1)
end_date = datetime.date(2020, 4, 30)
time_between_dates = end_date - start_date
days_between_dates = time_between_dates.days

service_requests = []
for service in services:
    for i in range(200):
        request_id = '"RST' + '0' * (5 - len(str(service_request_offset))) + str(service_request_offset) + '"'
        service_request_offset += 1
        t_id = randint(0, trip_id_limit)
        trip_id = '"TRP' + '0' * (5 - len(str(t_id))) + str(t_id) + '"'
        s_id = randint(0, service[1])
        service_id = '"' + service[0] + '0' * (5 - len(str(s_id))) + str(s_id) + '"'
        cost = 1000 + randint(0, 1000)
        if service[0] == 'FOO':
            cost /= 10
        
        random_number_of_days = random.randrange(days_between_dates)
        request_timestamp = start_date + datetime.timedelta(days=random_number_of_days)
        service_required_date = request_timestamp + datetime.timedelta(days = randint(1, 10))
        service_request = {
            'request_id' : request_id,
            'trip_id' : trip_id,
            'service_id' : service_id,
            'request_timestamp' : str(request_timestamp), 
            'quantity': randint(1, 3), 
            'cost': cost, 
            'status': 'Paid', 
            'user_rating': randint(0, 5), 
            'service_rating': randint(0, 5), 
            'comments': 'null',
            'service_required_date': str(service_required_date),
            'number_days': 1,
            'completion_date': str(service_required_date),
        }
        service_requests.append(service_request)
print(service_requests, file = open('service_requests.txt', mode = 'w'))