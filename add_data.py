cities = {'leh' : [], 'ladakh' : [], 'goa' : [], 'jaipur' : [], 'hyderabad' : [], 'kolkata' : [], 'chennai' : [], 'lucknow' : [], 'shillong' : [], 'jodhpur' : [], 'jammu' : [], 'kanpur' : [], 'kasauli' : [], 'lonavala' : [], 'chandigarh' : [], 'dehradun' : [], 'darjeeling' : [], 'gurgaon':[], 'indore':[], 'ludhiana':[], 'corbett':[], 'mumbai':[], 'delhi':[]}
char = 'abcdefghijklmnopqrstuvwxyz0123456789'

import pandas as pd
import csv
from random import randint, shuffle
from math import isnan
service_providers = []
hotels = []
services = []
rooms = []
hotel_types = {1 : 1000, 2 : 2000, 3 :3000, 4 : 4000, 5 : 7000}
room_types = [['single', 1, 500], ['double', 2, 1000], ['triple', 3, 1000], ['family suite', 4, 1500], ['executive', 4, 2000], ['deluxe', 4, 2000], ['economy', 4, 1500], ['business', 2, 3000]]
location_id_offset = 71
service_provider_id_offset = 0
service_id_offset = 0
locations = {}
cities_2 = set({})
with open('hotel_room_data.csv') as file:
	data = pd.read_csv(file).values
	for row in data:
		name = row[0]
		city = row[3]
		country = 'India'
		locality = row[5]
		state = row[6]
		if type(locality) == float or type(city) == float or type(state) == float or city.lower() not in cities or len(cities[city.lower()]) > 10:
			continue
		locality = locality.lower()
		state = state.lower()
		city = city.lower()
		cities_2.add(city)
		country = country.lower()
		if (locality, city, state, country) not in locations:
			locations[(locality, city, state, country)] = 'LOC' + '0' * (5 - len(str(location_id_offset))) + str(location_id_offset)
			location_id_offset += 1
		
		service_provider_id = 'HOT' + '0' * (5 - len(str(service_provider_id_offset))) + str(service_provider_id_offset)
		service_provider_id_offset += 1
		
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
		if randint(0, 5 * star) > 0:
			AC = 'Y'
		else:
			AC = 'N'
		
		password = ''
		for i in range(randint(3, 10)):
			password += char[randint(0, 35)]
		service_provider = {
			'service_provider_id' : '"' + service_provider_id + '"',
			'approved' : '"' + approved + '"',
			'name' : '"' + name + '"',
			'password' : '"' + password + '"',
			'domain' : '"hotel"',
			'active' : '"' + active + '"',
		}
		hotel = {
			'service_provider_id' : '"' + service_provider_id + '"',
			'location_id' : '"' + locations[(locality, city, state, country)] + '"',
			'wifi_facility' : '"' + wifi_facility + '"',
			'star' : str(star),
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
				'service_id' : '"' + service_id + '"',
				'service_provider_id' : '"' + service_provider_id + '"',
				'price' : str(room[2] + randint(hotel_types[star] - 1000, hotel_types[star] + 1000)),
				'discount' : str(randint(0,40))		
			}
			room = {
				'service_id' : '"' + service_id + '"',
				'room_type' : '"' + room[0] + '"',
				'capacity' : str(room[1]),
				'AC' : '"' + AC + '"',
			}
			services.append(service)
			rooms.append(room)
		service_providers.append(service_provider)
		hotels.append(hotel)
		cities[city].append(hotel)

cities = list(cities)
flights = []
service_id_offset = 21
service_provider_id_offset = 23
for l1 in cities:
	for l2 in cities:
		spid = randint(0, service_provider_id_offset)
		service_provider_id = 'AIR' + '0' * (5 - len(str(spid))) + str(spid)
		service_id = 'FLI' + '0' * (5 - len(str(service_id_offset))) + str(service_id_offset)
		service_id_offset += 1

		service = {
			'service_id' : '"' + service_id + '"',
			'service_provider_id' : '"' + service_provider_id + '"',
			'price' : str(randint(2000, 15000)),
			'discount' : str(randint(0, 40))
		}
		flight = {
			'service_id' : '"' + service_id + '"',
			'from_city' : '"' + l1 + '"',
			'to_city' : '"' + l2 + '"',
			'departure_time' : '"' + char[randint(26, 27)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + '"',
			'arrival_time' : '"' + char[randint(26, 27)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + '"',
		}
		if(flight['arrival_time'] < flight['departure_time']):
			flight['arrival_time'], flight['departure_time'] = flight['departure_time'], flight['arrival_time']
		services.append(service)
		flights.append(flight)

for i in range(500):
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
		'service_id' : '"' + service_id + '"',
		'service_provider_id' : '"' + service_provider_id + '"',
		'price' : str(randint(2000, 15000)),
		'discount' : str(randint(0, 40))
	}
	flight = {
		'service_id' : '"' + service_id + '"',
		'from_city' : '"' + l1 + '"',
		'to_city' : '"' + l2 + '"',
		'departure_time' : '"' + char[randint(26, 27)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + '"',
		'arrival_time' : '"' + char[randint(26, 27)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + '"',
	}
	if(flight['arrival_time'] < flight['departure_time']):
		flight['arrival_time'], flight['departure_time'] = flight['departure_time'], flight['arrival_time']
	services.append(service)
	flights.append(flight)

service_provider_query = ["INSERT INTO service_provider VALUES "]
for service_provider in service_providers:
	service_provider_query.append('(' + service_provider['approved'] + ', ' + service_provider['service_provider_id'] + ', ' + service_provider['name'] + ', ' + service_provider['password'] + ', ' + service_provider['domain'] + ', ' + service_provider['active'] + ')')
	if service_provider != service_providers[-1]:
		service_provider_query += ', '
service_provider_query = ''.join(i for i in service_provider_query)

service_query = ["INSERT INTO service VALUES "]
for service in services:
	service_query.append('(' + service['service_id'] + ', ' + service['service_provider_id'] + ', ' + service['price'] + ', ' + service['discount'] + ')')
	if service != services[-1]:
		service_query += ', '
service_query = ''.join(i for i in service_query)

hotel_query = ["INSERT INTO hotel VALUES "]
for hotel in hotels:
	hotel_query.append('(' + hotel['service_provider_id'] + ', ' + hotel['location_id'] + ', ' + hotel['wifi_facility'] + ', ' + hotel['star'] + ')')
	if hotel != hotels[-1]:
		hotel_query += ', '
hotel_query = ''.join(i for i in hotel_query)

room_query = ["INSERT INTO room VALUES "]
for room in rooms:
	room_query.append('(' + room['service_id'] + ', ' + room['room_type'] + ', ' + room['capacity'] + ', ' + room['AC'] + ')')
	if room != rooms[-1]:
		room_query += ', '
room_query = ''.join(i for i in room_query)

location_query = ["INSERT INTO location VALUES "]
for location in locations:
	location_query.append('("' + locations[location] + '", "' + location[0] + '", "' + location[1] + '", "' + location[2] + '", "' + location[3] + '"), ')
location_query = ''.join(i for i in location_query)

flight_query = ["INSERT INTO flight VALUES "]
for flight in flights:
	flight_query.append('(' + flight['service_id'] + ', ' + flight['from_city'] + ', ' + flight['to_city'] + ', ' + flight['departure_time'] + ', ' + flight['arrival_time'] + ')')
	if flight != flights[-1]:
		flight_query += ', '
flight_query = ''.join(i for i in flight_query)


print(service_provider_query, file = open('service_providers.txt', mode = 'w'))
print(service_query, file = open('services.txt', mode = 'w'))
print(hotel_query, file = open('hotels.txt', mode = 'w'))
print(room_query, file = open('rooms.txt', mode = 'w'))
print(location_query, file = open('locations.txt', mode = 'w'))
print(flight_query, file = open('flights.txt', mode = 'w'))

print('cities', len(cities))
print('hotels', len(hotels))
print('rooms', len(rooms))
print('flights', len(flights))
print('cities2', cities_2)