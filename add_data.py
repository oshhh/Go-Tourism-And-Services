def createCSV(data, nameOfFile):
    with open(nameOfFile+'.csv', 'w') as csvFile:
        writer = csv.writer(csvFile)
        writer.writerows(data)

city = ['ladakh', 'Leh', 'Srinagar', 'Shimla', 'Dehradun', 'Chamoli', 'Haridwar', 'Amritsar', 'Delhi ', 'Jodhpur', 'Agra ', 'Shivpuri', 'Raisen', 'Balaghat', 'Sirohi', 'Junagadh', 'Mumbai', 'Thane', 'Aurangabad', 'Goa', 'North Panji', 'Bijapur', 'Ballari', 'Hydrabad', 'Vishakhapatnam', 'Shillong', 'Karbi Anglong', 'Chennai', 'Vadodara', 'Ahmedabad', 'Bangalore', 'Kolkata', 'Pune', 'Hyderabad', 'haryana', 'punjab', 'Varanasi', 'Nilgri', 'Tirupati', 'Madhurai', 'kerala', 'Bengal', 'Tamil Nadu', 'Bay of Bengal', 'Madhya Pradesh', 'Assam', 'Karnataka', 'Himachal Pradesh']

char = 'abcdefghijklmnopqrstuvwxyz0123456789'

import pandas as pd
import csv
from random import randint
from math import isnan

locations = set([])
with open('hotel_room_data.csv') as file:
	data = pd.read_csv(file).values
	data = data[:10000]
	for row in data:
		hotel_name = row[1]
		room_type = row[2]

		city = row[3]
		country = 'India'
		locality = row[5]
		state = row[6]
		if type(locality) == float:
			continue
		locations.add((locality, city, state, country))

flights = []
locations = list(locations)
for i in range(50000):
	l1 = 0
	l2 = 0
	while l1 == l2:
		l1 = randint(0, len(locations) - 1)
		l2 = randint(0, len(locations) - 1)
	l1 = locations[l1]
	l2 = locations[l2]
	flight = {
		'from_city' : l1[1],
		'to_city' : l2[1],
		'departure_time' : char[randint(26, 27)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)],
		'arrival_time' : char[randint(26, 27)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)] + ':' + char[randint(26, 31)] + char[randint(26, 35)],
		'price' : randint(2000, 15000),
		'discount' : randint(0, 40)
	}
	if(flight['arrival_time'] < flight['departure_time']):
		flight['arrival_time'], flight['departure_time'] = flight['departure_time'], flight['arrival_time']
	flights.append(flight)
print(flights)
