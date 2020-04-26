def createCSV(data, nameOfFile):
    with open(nameOfFile+'.csv', 'w') as csvFile:
        writer = csv.writer(csvFile)
        writer.writerows(data)

char = 'abcdefghijklmnopqrstuvwxyz0123456789'

import pandas as pd
import csv
from random import randint
from math import isnan

cities = set([])
service_providers = []
hotels = []
services = []
rooms = []
hotel_types = {1 : 1000, 2 : 2000, 3 :3000, 4 : 4000, 5 : 7000}
room_types = [['single', 1, 500], ['double', 2, 1000], ['triple', 3, 1000], ['family suite', 4, 1500], ['executive', 4, 2000], ['deluxe', 4, 2000], ['economy', 4, 1500], ['business', 2, 3000]]
location_id_offset = 71
service_provider_id_offset = 45
service_id_offset = 45
locations = {}
with open('hotel_room_data.csv') as file:
	data = pd.read_csv(file).values
	data = data[:10000]
	for row in data:
		name = row[0]
		city = row[3]
		country = 'India'
		locality = row[5]
		state = row[6]
		
		if type(locality) == float:
			continue
		
		if (locality, city, state, country) not in locations:
			locations[(locality, city, state, country)] = 'LOC' + '0' * (5 - len(str(location_id_offset))) + str(location_id_offset)
			location_id_offset += 1
		
		service_provider_id = 'HOT' + '0' * (5 - len(str(service_provider_id_offset))) + str(service_provider_id_offset)
		service_provider_id_offset += 1
		
		cities.add(city)
		star = randint(1, 5)
		
		wifi_facility = None
		approved = None
		active = None
		
		if randint(0, 1) > 0:
			wifi_facility = 'Y'
		else:
			wifi_facility = 'N'
		if randint(0, 50) > 0:
			approved = 'Y'
		else:
			approved = 'N'
		if randint(0, 50) > 0:
			active = 'Y'
		else:
			active = 'N'
		if randint(0, 1) > 0:
			AC = 'Y'
		else:
			AC = 'N'
		
		password = ''
		for i in range(randint(3, 10)):
			password += char[randint(0, 35)]
		service_provider = {
			'service_provider_id' : service_provider_id,
			'approved' : approved,
			'name' : name,
			'password' : password,
			'domain' : 'hotel',
			'active' : active,
			'location_id' : locations[(locality, city, state, country)],
			'wifi_facility' : wifi_facility,
			'star' : star,
			'rooms' : []
		}
		hotel = {
			'service_provider_id' : service_provider_id,
			'location_id' : locations[(locality, city, state, country)],
			'wifi_facility' : wifi_facility,
			'star' : star,
		}
		for room in room_types:
			AC = None
			service_id = 'ROO' + '0' * (5 - len(str(service_id_offset))) + str(service_id_offset)
			service_id_offset += 1
			if randint(0, star) > 0:
				AC = 'Y'
			else:
				AC = 'N'
			service = {
				'service_id' : service_id,
				'service_provider_id' : service_provider_id,
				'price' : room[2] + randint(hotel_types[star] - 1000, hotel_types[star] + 1000),
				'discount' : randint(0,40)		
			}
			room = {
				'service_id' : service_id,
				'room_type' : room[0],
				'capacity' : room[1],
				'AC' : AC
			}
			services.append(service)
			rooms.append(room)
		service_providers.append(service_provider)
		hotels.append(hotel)

flights = []
cities = list(cities)
service_provider_id_offset = 23
service_id_offset = 24
for i in range(50000):
	l1 = 0
	l2 = 0
	while l1 == l2:
		l1 = randint(0, len(cities) - 1)
		l2 = randint(0, len(cities) - 1)
	l1 = cities[l1]
	l2 = cities[l2]
	
	spid = randint(0, service_provider_id_offset)
	service_provider_id = 'AIR' + '0' * (5 - len(str(spid))) + str(spid)
	service_id = 'FLI' + '0' * (5 - len(str(service_id_offset))) + str(service_id_offset)
	service_id_offset += 1

	service = {
		'service_id' : service_id,
		'service_provider_id' : service_provider_id,
		'price' : randint(2000, 15000),
		'discount' : randint(0, 40)
	}
	flight = {
		'service_id' : service_id,
		'from_city' : l1,
		'to_city' : l2,
		'departure_time' : char[randint(26, 27)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)],
		'arrival_time' : char[randint(26, 27)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)],
	}
	if(flight['arrival_time'] < flight['departure_time']):
		flight['arrival_time'], flight['departure_time'] = flight['departure_time'], flight['arrival_time']
	services.append(service)
	flights.append(flight)

print(service_providers, file = open('service_providers.txt', mode = 'w'))
print(services, file = open('services.txt', mode = 'w'))
print(hotels, file = open('hotels.txt', mode = 'w'))
print(rooms, file = open('rooms.txt', mode = 'w'))
print(locations, file = open('locations.txt', mode = 'w'))
print(flights, file = open('flights.txt', mode = 'w'))
print('hotels : ', len(hotels))
print('locations : ', len(locations), 'distinct cities : ', len(cities))
print('flights : ', len(flights))