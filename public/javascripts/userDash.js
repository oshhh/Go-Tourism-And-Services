var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope,$http)
{
	$scope.tab=0;

	$scope.my_trips={
		status : "Pending",
		data : [],
		completed_requests : [],
		rate_services : false,
		user_id : "",
		sortOrder:"0",
		reviews:{},
	}

	$scope.new_trip={
		destination_city : "",
		departure_date : "",
		return_date : "",
	}

	$scope.food={
		status:"Pending",
		data:[],
		fname:"",
		rname:"",
		delivers:"0",
		sortOrder:"0",
		reviews:{}
	};

	$scope.flight={
		status : "Pending",
		data : [],
		from_city : "",
		to_city : "",
		sortOrder:"0",
		reviews:{},
	}

	$scope.bus_train={
		status : "Pending",
		data : [],
		route_data : [],
		t_type : "0",
		from : "",
		to : "",
		AC : "0",
		sortOrder : "0",
		reviews : {},
	}

	$scope.taxi={
		status : "Pending",
		data : [],
		car_name : "",
		capacity : "",
		AC : "0",
		sortOrder:"0",
		reviews:{},
	}

	$scope.room={
		status : "Pending",
		data : [],
		name : "",
		city : "",
		room_type : "",
		capacity : "",
		wifi_facility : "0",
		star : "",
		AC : "",
		sortOrder:"0",
		reviews:{},
	}

	$scope.tourist_spot={
		status : "Pending",
		data : [],
		name : "",
		t_type : "",
		city : "",
		sortOrder:"0",
		reviews:{},
	}

	$scope.guide={
		status : "Pending",
		data : [],
		tourist_spot_name : "",
		tourist_spot_city : "",
		sortOrder:"0",
		reviews:{},

	}
	$scope.plan_trip={
		status:"Pending",
		user_id: "USR00000",
		destination_city: "Delhi",
		user_city: "Mumbai",
		depDate: new Date(),
		number_of_people: 4,
		number_of_days: 2,
		budget: 50000,
		from_home:true,
		weightage: { food: 2, taxi: 3, room: 5, tourist_spot: 3, flight: 3 },
		itinerary : {}
	  }
	$scope.predictors={
		data:[],
		bindSpecialInput:async function(listName,finaltable,sourcetable,column,sameKey)
		{
			elementDOM = document.getElementById("predictionData");
			var containerList = document.createElement("datalist");
			dataState = await $http.get("/api/getData",{params:{
				type:"FilteredSingleColumn",
				target_column:column,
				target_table:finaltable,
				source_table:sourcetable,
				searchKey:sameKey
			}});
			if(!dataState.data.content)
				return;
			dataState.data.content.forEach(element => {
				var elemDOM = document.createElement("option");
				elemDOM.value=element.prediction;
				containerList.appendChild(elemDOM);
			});
			elementDOM.appendChild(containerList);
			containerList.id=listName;
			// console.log(containerList);
		},
        bindArray:async function(listName,arr)
        {
            elementDOM = document.getElementById("predictionData");
            var containerList = document.createElement("datalist");
            arr.forEach(element => {
				var elemDOM = document.createElement("option");
				elemDOM.value=element;
				containerList.appendChild(elemDOM);
			});
			elementDOM.appendChild(containerList);
			containerList.id=listName;
			console.log(containerList);
        },
		bindInput:async function(listName,table,column)
		{
			elementDOM = document.getElementById("predictionData");
			var containerList = document.createElement("datalist");
			dataState = await $http.get("/api/getData",{params:{
				type:"singleColumn",
				table_name:table,
				column_name:column
			}});
			if(!dataState.data.content)
				return;
			dataState.data.content.forEach(element => {
				var elemDOM = document.createElement("option");
				elemDOM.value=element.prediction;
				containerList.appendChild(elemDOM);
			});
			elementDOM.appendChild(containerList);
			containerList.id=listName;
			// console.log(containerList);
		}
	}
	$scope.trip={
		status : "Pending",
		data : [],
		selected : {}
	}
	$scope.curUser={
		name:document.getElementById("nmU").innerHTML,
		uid:document.getElementById("idU").innerHTML
	};

	$scope.addDestination = function()
	{
		$scope.planner.destinations.push({text:""});
		console.log($scope.planner.destinations);
	}
	$scope.addKeyword = function()
	{
		$scope.planner.keywords.push({text:""});
	}
	$scope.removeOutput = function(it)
	{
		$scope.planner.output.splice($scope.planner.output.indexOf(it),1);
	}
	$scope.order = function(domain) {

	}
	$scope.orderTouristSpot = function(domain) {
		switch(domain.sortOrder) {
			case 0:
				domain.data.sort(function(a, b) {return a.entry_fee - b.entry_fee});
			break;
			case 1:
					domain.data.sort(function(a, b) {return b.entry_fee - a.entry_fee});
			break;
		}
	}
	$scope.planTrip = function()
	{
		if(!$("#plannerForm").valid())
		{
			$('#toast_msg').text("Please Fill Correct parameters");
			$('.toast').toast("show");
			return;
		}
		//use $scope.planner.budget/destination/keywords to output in this format:
		//output - {service_id:"",quantity:1,price:10}
		$scope.plan_trip.status = "Calculating"
		// console.log($scope.plan_trip.budget);
		$http.get("/api/getData",{params:{
			type:"plan_trip",
			user_id: "\"" + $scope.plan_trip.user_id + "\"",
			destination_city: "\"" + $scope.plan_trip.destination_city + "\"" ,
			user_city: "\"" + $scope.plan_trip.user_city + "\"",
			number_of_people: $scope.plan_trip.number_of_people,
			number_of_days: $scope.plan_trip.number_of_days,
			budget: $scope.plan_trip.budget,
			from_home: $scope.plan_trip.from_home,
			food_weightage : $scope.plan_trip.weightage.food,
			taxi_weightage : $scope.plan_trip.weightage.taxi, 
			room_weightage : $scope.plan_trip.weightage.room, 
			tourist_spot_weightage : $scope.plan_trip.weightage.tourist_spot, 
			flight_weightage: $scope.plan_trip.weightage.flight, 
		}}).then(
			function(data, status, headers, config) {
			console.log(data.data.content);
			$scope.plan_trip.itinerary=data.data.content.itinerary;
			$scope.plan_trip.status="OK";
			$scope.$digest();
			},function(data, status, headers, config) {
				console.log("error");
			}
		);
	}
	$scope.updatePlannedTrip = function(it) {
		if(it != null) {
			for(var tsp = 0; tsp < $scope.plan_trip.itinerary.tourist_spots.length; ++ tsp) {
				if($scope.plan_trip.itinerary.tourist_spots[tsp].tourist_spot_id == it.tourist_spot_id) {
					$scope.plan_trip.itinerary.tourist_spots.splice(tsp, 1);
					break;
				}
			}
		}
		$scope.plan_trip.itinerary.cost = 0;
		$scope.plan_trip.itinerary.pleasure_value = 0
		if($scope.plan_trip.itinerary.food_expense != null) {
			$scope.plan_trip.itinerary.cost += $scope.plan_trip.itinerary.food_expense[0] * $scope.plan_trip.itinerary.food_expense[1];
			$scope.plan_trip.itinerary.pleasure_value += ($scope.plan_trip.itinerary.food_expense[0]/1500) * $scope.plan_trip.weightage.food;
		}
		console.log($scope.plan_trip.itinerary.pleasure_value);
		if($scope.plan_trip.itinerary.departure_flight != null) {
			$scope.plan_trip.itinerary.cost += ($scope.plan_trip.itinerary.departure_flight[0].price) * (1 - $scope.plan_trip.itinerary.departure_flight[0].discount * 0.01) * $scope.plan_trip.itinerary.departure_flight[1];
			$scope.plan_trip.itinerary.pleasure_value += (0.5) * $scope.plan_trip.weightage.flight;
		}
		console.log($scope.plan_trip.itinerary.pleasure_value);
		if($scope.plan_trip.itinerary.return_flight != null) {
			$scope.plan_trip.itinerary.cost += ($scope.plan_trip.itinerary.return_flight[0].price) * (1 - $scope.plan_trip.itinerary.return_flight[0].discount * 0.01) * $scope.plan_trip.itinerary.return_flight[1];
			$scope.plan_trip.itinerary.pleasure_value += (0.5) * $scope.plan_trip.weightage.flight;
		}
		console.log($scope.plan_trip.itinerary.pleasure_value);
		if($scope.plan_trip.itinerary.taxi != null) {
			$scope.plan_trip.itinerary.cost += $scope.plan_trip.itinerary.taxi[0].price * (1 - $scope.plan_trip.itinerary.taxi[0].discount * 0.01) * $scope.plan_trip.itinerary.taxi[1];
			$scope.plan_trip.itinerary.pleasure_value += ($scope.plan_trip.itinerary.taxi[0].AC == 'Y' ? 1 : 0) * $scope.plan_trip.weightage.taxi;
		}
		console.log($scope.plan_trip.itinerary.pleasure_value);
		if($scope.plan_trip.itinerary.room != null) {
			$scope.plan_trip.itinerary.cost += $scope.plan_trip.itinerary.room[0].price * (1 - $scope.plan_trip.itinerary.room[0].discount * 0.01) * $scope.plan_trip.itinerary.room[1];
			$scope.plan_trip.itinerary.pleasure_value += (($scope.plan_trip.itinerary.room[0].rating + ($scope.plan_trip.itinerary.room[0].wifi == 'Y'? 1 : 0))/6) * $scope.plan_trip.weightage.room ;
		}
		console.log($scope.plan_trip.itinerary.pleasure_value);
		for(i = 0; i < $scope.plan_trip.itinerary.tourist_spots.length; ++ i) {
			$scope.plan_trip.itinerary.cost += ($scope.plan_trip.itinerary.tourist_spots[i].entry_fee) * ($scope.plan_trip.number_of_people);
		}	
		console.log($scope.plan_trip.itinerary.pleasure_value);
		$scope.plan_trip.itinerary.pleasure_value += (($scope.plan_trip.itinerary.tourist_spots.length)/(3 * $scope.plan_trip.number_of_days)) * $scope.plan_trip.weightage.tourist_spot;
		console.log($scope.plan_trip.itinerary.pleasure_value);
		$scope.plan_trip.itinerary.pleasure_value /= (parseInt($scope.plan_trip.weightage.flight) + parseInt($scope.plan_trip.weightage.food) + parseInt($scope.plan_trip.weightage.taxi) + parseInt($scope.plan_trip.weightage.room) + parseInt($scope.plan_trip.weightage.tourist_spot));
		$scope.plan_trip.itinerary.pleasure_value *= 10;	
	}
	$scope.finalizeTrip = async function()
	{
		console.log($scope.plan_trip.itinerary);
		//Insert Trip
		departDate = $scope.plan_trip.depDate;
		returnDate = new Date();
		returnDate.setDate(departDate.getDate()+$scope.plan_trip.number_of_days);
		tripStatus = await $http.get("/api/getData",{params:{
			type:"new_trip_return_id",
			user_id:$scope.curUser.uid,
			destination_city:$scope.plan_trip.destination_city,
			departure_date:departDate.toISOString().slice(0,10),
			return_date:returnDate.toISOString().slice(0,10),
			}});
		newTripID="";
		if(tripStatus.data.content)
			newTripID=tripStatus.data.content.slice(1,-1);
		else
			return;
		getCreatedTrip= await $http.get("/api/getData",{params:{type:"my_trips",}});
		err=true;
		console.log(newTripID)
		console.log(getCreatedTrip);
		$scope.my_trips.data=getCreatedTrip.data.content.result;
		$scope.my_trips.completed_requests=getCreatedTrip.data.content.completed_requests;
		$scope.my_trips.data.forEach(element => {
		if(element.trip_id==newTripID)
		{
			console.log(element.trip_id);
			err=false;
			newTripID=element.trip_id;
			$scope.trip.selected=element;
		}
		});
		if(!err)
		{
			console.log($scope.trip.selected);
			if($scope.plan_trip.itinerary.departure_flight!=null)
			{
				if($scope.plan_trip.itinerary.departure_flight[0]!=null)
				{
					await $scope.addPlannedRequest($scope.plan_trip.itinerary.departure_flight[0],departDate,1,1);
				}
			}
			if($scope.plan_trip.itinerary.return_flight!=null)
			{
				if($scope.plan_trip.itinerary.return_flight[0]!=null)
				{
					await $scope.addPlannedRequest($scope.plan_trip.itinerary.return_flight[0],returnDate,1,1);
				}
			}
			if($scope.plan_trip.itinerary.room!=null)
			{
				if($scope.plan_trip.itinerary.room[0]!=null)
				{
					await $scope.addPlannedRequest($scope.plan_trip.itinerary.room[0],departDate,$scope.plan_trip.number_of_days,$scope.plan_trip.number_of_people);
				}
			}
			if($scope.plan_trip.itinerary.taxi!=null)
			{
				if($scope.plan_trip.itinerary.taxi[0]!=null)
				{
					await $scope.addPlannedRequest($scope.plan_trip.itinerary.taxi[0],departDate,$scope.plan_trip.number_of_days,1);
				}
			}
			console.log("Added Everything");
			$('#toast_msg').text("Trip Services Added");
			$('.toast').toast("show");
		}
		else{
			$('#toast_msg').text("There Was some error");
			$('.toast').toast("show");
		}
		$('#plannerModal').modal('hide');
		$scope.changeTab(0);
	}
	//sends get request with inputparams and put that data into destOBJ object
	$scope.putData=function(sourceUrl,inputParams,destObj,callback)
	{
		$http.get(sourceUrl,{params:inputParams}).then(
			function(data, status, headers, config) {
			if(data.data.isRes)
			{
				destObj.data=data.data.content;
				destObj.status="OK";
				callback();
			}
			},function(data, status, headers, config) {
				console.log("error");
			});
	}

		
	$scope.getData=function(tab)
	{
		if(tab == 0)
		{
			console.log($scope.my_trips.completed_requests.length);
			$scope.my_trips.status="Pending";
			console.log("sent");
			$http.get("/api/getData",{params:{
				type:"my_trips",
				}}).then(
				function(data, status, headers, config) {
				console.log(data.data.content);
				$scope.my_trips.data=data.data.content.result;
				$scope.my_trips.completed_requests=data.data.content.completed_requests;
				$scope.my_trips.data.forEach(element => {
					element.showRev=false;
				});
				$scope.my_trips.status="OK";
				$scope.$digest();
				},function(data, status, headers, config) {
					console.log("error");
				});
		}
		else if(tab==2)
		{
			$scope.flight.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
				type:"flight",
				from: "\"%" + $scope.flight.from_city + "%\"",
				to: "\"%" + $scope.flight.to_city + "%\"",
				}}).then(
				function(data, status, headers, config) {
				$scope.flight.data=data.data.content;
				$scope.flight.data.forEach(element => {
					element.showRev=false;
				});
				switch($scope.flight.sortOrder) {
					case "0":
						$scope.flight.data.sort(function(a, b) {return a.price - b.price});
					break;
					case "1":
							$scope.flight.data.sort(function(a, b) {return b.price - a.price});
					break;
					case "2":
						$scope.flight.data.sort(function(a, b) {return a.discount - b.discount});
					break;
					case "3":
						$scope.flight.data.sort(function(a, b) {return b.discount - a.discount});
					break;
				}	
				$scope.flight.status="OK";

				},function(data, status, headers, config) {
					console.log("error");
				}
			);
		}
		else if(tab==3)
		{
			$scope.bus_train.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
				type:"bus_train",
				t_type : ( $scope.bus_train.t_type == 0) ? ("\"%\"") : ($scope.bus_train.t_type == 1 ? "B" : "T" ),
				from: "\"%" + $scope.bus_train.from + "%\"",
				to: "\"%" + $scope.bus_train.to + "%\"",
				AC: ( $scope.bus_train.AC == 0) ? ("\"%\"") : ($scope.bus_train.AC == 1 ? "\"Y\"" : "\"N\"" )
				}}).then(
				function(data, status, headers, config) {
					$scope.bus_train.data=data.data.content;
					$scope.bus_train.data.forEach(element => {
					element.showRev=false;
				});
				console.log("sort order: " + $scope.bus_train.sortOrder)
				switch($scope.bus_train.sortOrder) {
					case "0":
						$scope.bus_train.data.sort(function(a, b) {return a.price - b.price});
					break;
					case "1":
							$scope.bus_train.data.sort(function(a, b) {return b.price - a.price});
					break;
					case "2":
						$scope.bus_train.data.sort(function(a, b) {return a.discount - b.discount});
					break;
					case "3":
						$scope.bus_train.data.sort(function(a, b) {return b.discount - a.discount});
					break;
				}				
				$scope.bus_train.status="OK";
	
				},function(data, status, headers, config) {
					console.log("error");
				}
			);
		}
		else if(tab==4)
		{
			$scope.taxi.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
				type:"taxi",
				car_name: "\"%" + $scope.taxi.car_name + "%\"",
				capacity:  ($scope.taxi.capacity == "" ? "\"%\"" : $scope.taxi.capacity) ,
				AC: ( $scope.taxi.AC == 0) ? ("\"%\"") : ($scope.taxi.AC == 1 ? "\"Y\"" : "\"N\"" )
				}}).then(
				function(data, status, headers, config) {
				$scope.taxi.data=data.data.content;
				$scope.taxi.data.forEach(element => {
					element.showRev=false;
				});
				switch($scope.taxi.sortOrder) {
					case "0":
						$scope.taxi.data.sort(function(a, b) {return a.price - b.price});
					break;
					case "1":
							$scope.taxi.data.sort(function(a, b) {return b.price - a.price});
					break;
					case "2":
						$scope.taxi.data.sort(function(a, b) {return a.discount - b.discount});
					break;
					case "3":
						$scope.taxi.data.sort(function(a, b) {return b.discount - a.discount});
					break;
				}				
				$scope.taxi.status="OK";
				
				},function(data, status, headers, config) {
					console.log("error");
				});
		}
		else if(tab==5)
		{
			$scope.room.status="Pending";
			// console.log("sent");
			console.log("room!");
			$http.get("/api/getData",{params:{
				type:"room",
				name: "\"%" + $scope.room.name + "%\"",
				city: "\"%" + $scope.room.city + "%\"",
				room_type: "\"%" + $scope.room.room_type + "%\"",
				capacity:  ($scope.room.capacity == "" ? "\"%\"" : $scope.room.capacity) ,
				wifi_facility: ( $scope.room.wifi_facility == 0) ? ("\"%\"") : ($scope.room.wifi_facility == 1 ? "\"Y\"" : "\"N\"" ),
				AC: ( $scope.room.AC == 0) ? ("\"%\"") : ($scope.room.AC == 1 ? "\"Y\"" : "\"N\"" ),
				star: ( $scope.room.star == 0) ? ("\"%\"") : $scope.room.star
				}}).then(
				function(data, status, headers, config) {
				$scope.room.data=data.data.content;
				$scope.room.data.forEach(element => {
					element.showRev=false;
				});
				switch($scope.room.sortOrder) {
					case "0":
						$scope.room.data.sort(function(a, b) {return a.price - b.price});
					break;
					case "1":
							$scope.room.data.sort(function(a, b) {return b.price - a.price});
					break;
					case "2":
						$scope.room.data.sort(function(a, b) {return a.discount - b.discount});
					break;
					case "3":
						$scope.room.data.sort(function(a, b) {return b.discount - a.discount});
					break;
				}				
				$scope.room.status="OK";

				},function(data, status, headers, config) {
					console.log("error");
				});
		}
		else if(tab==6)
		{
			$scope.food.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
				type: "food",
				fname: "\"%" + $scope.food.fname + "%\"",
				rname: "\"%" + $scope.food.rname + "%\"",
				delivers: ( $scope.food.delivers ==0) ? ("\"%\"") : ($scope.food.delivers == 1 ? "\"Y\"" : "\"N\"" )
				}}).then(
				function(data, status, headers, config) {
				$scope.food.data=data.data.content;
				$scope.food.data.forEach(element => {
					element.showRev=false;
				});
				switch($scope.food.sortOrder) {
					case "0":
						$scope.food.data.sort(function(a, b) {return a.price - b.price});
					break;
					case "1":
							$scope.food.data.sort(function(a, b) {return b.price - a.price});
					break;
					case "2":
						$scope.food.data.sort(function(a, b) {return a.discount - b.discount});
					break;
					case "3":
						$scope.food.data.sort(function(a, b) {return b.discount - a.discount});
					break;
				}				
				$scope.food.status="OK";

				
				},function(data, status, headers, config) {
					console.log("error");
				}
			);
		}
		else if(tab==7)
		{
			$scope.food.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
				type: "tourist_spot",
				name: "\"%" + $scope.tourist_spot.name + "%\"",
				t_type: "\"%" + $scope.tourist_spot.t_type + "%\"",
				city: "\"%" + $scope.tourist_spot.city + "%\"",
				}}).then(
				function(data, status, headers, config) {
				$scope.tourist_spot.data=data.data.content;
				$scope.tourist_spot.data.forEach(element => {
					element.showRev=false;
				});
				switch($scope.tourist_spot.sortOrder) {
					case "0":
						$scope.tourist_spot.data.sort(function(a, b) {return a.entry_fee - b.entry_fee});
					break;
					case "1":
							$scope.tourist_spot.data.sort(function(a, b) {return b.entry_fee - a.entry_fee});
					break;
				}				
				$scope.tourist_spot.status="OK";
				
				},function(data, status, headers, config) {
					console.log("error");
				});
		}
		else if(tab==8)
		{
			$scope.guide.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
				type: "guide",
				tourist_spot_name: "\"%" + $scope.guide.tourist_spot_name + "%\"",
				tourist_spot_city: "\"%" + $scope.guide.tourist_spot_city + "%\"",
				}}).then(
				function(data, status, headers, config) {
				$scope.guide.data=data.data.content;
				$scope.guide.data.forEach(element => {
					element.showRev=false;
				});
				switch($scope.guide.sortOrder) {
					case 0:
						$scope.guide.data.sort(function(a, b) {return a.price - b.price});
					break;
					case 1:
							$scope.guide.data.sort(function(a, b) {return b.price - a.price});
					break;
					case 2:
						$scope.guide.data.sort(function(a, b) {return a.discount - b.discount});
					break;
					case 3:
						$scope.guide.data.sort(function(a, b) {return a.discount - b.discount});
					break;
				}				
				$scope.guide.status="OK";

				},function(data, status, headers, config) {
					console.log("error");
				});
		}
		else if(tab==9)
		{
			$scope.trip.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
				type: "trip",
				}}).then(
				function(data, status, headers, config) {
				$scope.trip.data=data.data.content;
				$scope.trip.status="OK";
				
				},function(data, status, headers, config) {
					console.log("error");
				});
		}
	}

	$scope.createTrip = function() {
		if($scope.new_trip.destination_city=="" || $scope.new_trip.departure_date=="" || $scope.new_trip.return_date=="")
		{
			console.log("trip field empty");
			$('#toast_msg').text("Fill Details of trip");
			$('.toast').toast("show");
			return;
		}
		console.log("Start Adding Trip");
		$scope.new_trip.status="Pending";
		$http.get("/api/getData",{params:{
			type:"new_trip",
			user_id:$scope.curUser.uid,
			destination_city:$scope.new_trip.destination_city,
			departure_date:$scope.new_trip.departure_date,
			return_date:$scope.new_trip.return_date,
			}}).then(
			function(data, status, headers, config) {
			// alert("Trip Created!")
			$('#toast_msg').text("Trip Created!");
			$('.toast').toast("show");
			$scope.new_trip.status="OK";
			$scope.getData(0);
			
			},function(data, status, headers, config) {
				console.log("error");
			}
		);

	}
	$scope.requestModal={
		bookingDate:new Date(),
		days:1,
		quantity:1,
		isDate:false,
		isDays:true,
	}
	$scope.openRequest = function(it,isNumDays,isBookDate){
		console.log($scope.trip.selected);
		if(!$scope.trip.selected.trip_id) {
			// alert("No trip selected! Can't request service.");
			$('#toast_msg').text("No trip selected! Select A trip");
			$('.toast').toast("show");
			sidebarDOM=document.getElementById("sidebar");
			if(sidebarDOM.style.right=="-380px")
			{
				sidebarDOM.style.right="0px";
				$('#toggleIcon').removeClass("fa-angle-double-left");
				$('#toggleIcon').addClass("fa-angle-double-right");
			}
			sidebarDOM.style.right="0px";
			return;
		}
		$('#requestModal').modal('show');
		$scope.requestModal.days=1;
		$scope.requestModal.bookingDate=new Date();
		$scope.requestModal.isDays=isNumDays;
		$scope.requestModal.isDate=isBookDate;
		$scope.requestModal.service=it;
		// console.log("Date",$scope.requestModal.bookingDate.toISOString().slice(0,10));
		// $scope.request(it,$scope.requestModal.days,$scope.requestModal.bookingDate)
	}
	$scope.addPlannedRequest = async function(it,requiredDate,numDays,quantity){
		addState=await $http.get('/api/getData',{params:{
			type : 'request',
			trip_id: "\"" + $scope.trip.selected.trip_id + "\"",
			service_id:  "\"" + it.service_id +  "\"",
			service_required_date : '"'+requiredDate.toISOString().slice(0,10)+'"',
			number_of_days : numDays,
			quantity : quantity,
			cost : it.price * (1 - it.discount * 0.01),
		}});
	}
	$scope.request = function(){
		// dateString=$scope.requestModal.bookingDate.get
		it=$scope.requestModal.service;
		$http.get('/api/getData',{params:{
			type : 'request',
			trip_id: "\"" + $scope.trip.selected.trip_id + "\"",
			service_id:  "\"" + it.service_id +  "\"",
			service_required_date : '"'+$scope.requestModal.bookingDate.toISOString().slice(0,10)+'"',
			number_of_days : $scope.requestModal.days,
			quantity : $scope.requestModal.quantity,
			cost : it.price * (1 - it.discount * 0.01),
		}}).then(
		function(data, status, headers, config) {
			console.log(data.data.content);
			$('#toast_msg').text("Request made. Please check trips tab for more info about request");
			$('.toast').toast("show");
		});
	}
	$scope.rate_service = function(it) {
		$http.get('/api/getData',{params:{
			type : 'rate_service',
			request_id: "\"" + it.request_id + "\"",
			rating: it.rating
		}}).then(
		function(data, status, headers, config) {
			console.log(data.data.content);
			$('#toast_msg').text("The service has been rated");
			$('.toast').toast("show");
			getData(0);
		});
	}

	$scope.food.view=function(it)
	{
		if(it.showRev==false)
		{
			$scope.food.reviews[it.service_id]={};
			$scope.food.reviews[it.service_id].status="Pending";
			//get reviews in f.reviews[serviceID].data
			// console.log("sent Review")
			$http.get("/api/getData",{params:{
				type:"review",
				service_id:it.service_id
				}}).then(
				function(data, status, headers, config) {
				if(data.data.isRes)
				{
					$scope.food.reviews[it.service_id].data=data.data.content;
					$scope.food.reviews[it.service_id].status="OK";
					it.showRev=true;
				}
				},function(data, status, headers, config) {
					console.log("error");
				});
			//Turn status OK to replace loading text with comments
		}
		else{
			it.showRev=false;
		}
	}
	$scope.flight.view=function(it)
	{
		if(it.showRev==false)
		{
			$scope.flight.reviews[it.service_id]={};
			$scope.flight.reviews[it.service_id].status="Pending";
			//get reviews in transport.reviews[serviceID].data
			// console.log("sent Review")
			$http.get("/api/getData",{params:{
				type:"review",
				service_id:it.service_id
				}}).then(
				function(data, status, headers, config) {
				if(data.data.isRes)
				{
					$scope.flight.reviews[it.service_id].data=data.data.content;
					$scope.flight.reviews[it.service_id].status="OK";
					it.showRev=true;
				}
				},function(data, status, headers, config) {
					console.log("error");
				});
			//Turn status OK to replace loading text with comments
		}
		else{
			it.showRev=false;
		}
	}
	$scope.bus_train.view=function(it)
	{
		if(it.showRev==false)
		{
			$scope.bus_train.reviews[it.service_id]={};
			$scope.bus_train.reviews[it.service_id].status="Pending";
			//get reviews in transport.reviews[serviceID].data
			// console.log("sent Review")
			$http.get("/api/getData",{params:{
				type:"review",
				service_id:it.service_id
				}}).then(
				function(data, status, headers, config) {
				if(data.data.isRes)
				{
					$scope.bus_train.reviews[it.service_id].data=data.data.content;
					$scope.bus_train.reviews[it.service_id].status="OK";
					it.showRev=true;
				}
				},function(data, status, headers, config) {
					console.log("error");
				});
			//Turn status OK to replace loading text with comments
		}
		else{
			it.showRev=false;
		}
	}
	$scope.taxi.view=function(it)
	{
		if(it.showRev==false)
		{
			$scope.taxi.reviews[it.service_id]={};
			$scope.taxi.reviews[it.service_id].status="Pending";
			//get reviews in transport.reviews[serviceID].data
			// console.log("sent Review")
			$http.get("/api/getData",{params:{
				type:"review",
				service_id:it.service_id
				}}).then(
				function(data, status, headers, config) {
				if(data.data.isRes)
				{
					$scope.taxi.reviews[it.service_id].data=data.data.content;
					$scope.taxi.reviews[it.service_id].status="OK";
					it.showRev=true;
				}
				},function(data, status, headers, config) {
					console.log("error");
				});
			//Turn status OK to replace loading text with comments
		}
		else{
			it.showRev=false;
		}
	}
	$scope.room.view=function(it)
	{
		if(it.showRev==false)
		{
			$scope.room.reviews[it.service_id]={};
			$scope.room.reviews[it.service_id].status="Pending";
			//get reviews in transport.reviews[serviceID].data
			// console.log("sent Review")
			$http.get("/api/getData",{params:{
				type:"review",
				service_id:it.service_id
				}}).then(
				function(data, status, headers, config) {
				if(data.data.isRes)
				{
					$scope.room.reviews[it.service_id].data=data.data.content;
					$scope.room.reviews[it.service_id].status="OK";
					it.showRev=true;
				}
				},function(data, status, headers, config) {
					console.log("error");
				});
			//Turn status OK to replace loading text with comments
		}
		else{
			it.showRev=false;
		}
	}
	$scope.tourist_spot.view=function(it)
	{
		if(it.showRev==false)
		{
			$scope.tourist_spot.reviews[it.service_id]={};
			$scope.tourist_spot.reviews[it.service_id].status="Pending";
			//get reviews in transport.reviews[serviceID].data
			// console.log("sent Review")
			$http.get("/api/getData",{params:{
				type:"review",
				service_id:it.service_id
				}}).then(
				function(data, status, headers, config) {
				if(data.data.isRes)
				{
					$scope.tourist_spot.reviews[it.service_id].data=data.data.content;
					$scope.tourist_spot.reviews[it.service_id].status="OK";
					it.showRev=true;
				}
				},function(data, status, headers, config) {
					console.log("error");
				});
			//Turn status OK to replace loading text with comments
		}
		else{
			it.showRev=false;
		}
	}
	$scope.guide.view=function(it)
	{
		if(it.showRev==false)
		{
			$scope.guide.reviews[it.service_id]={};
			$scope.guide.reviews[it.service_id].status="Pending";
			//get reviews in transport.reviews[serviceID].data
			// console.log("sent Review")
			$http.get("/api/getData",{params:{
				type:"review",
				service_id:it.service_id
				}}).then(
				function(data, status, headers, config) {
				if(data.data.isRes)
				{
					$scope.guide.reviews[it.service_id].data=data.data.content;
					$scope.guide.reviews[it.service_id].status="OK";
					it.showRev=true;
				}
				},function(data, status, headers, config) {
					console.log("error");
				});
			//Turn status OK to replace loading text with comments
		}
		else{
			it.showRev=false;
		}
	}
	$scope.changeTab=function(newTab)
	{
		$scope.tab=newTab;
		$scope.getData(newTab);
		console.log("change Tab: "+newTab);
	}
	$scope.openTripMenu=function(){
		$scope.trip.formStatus=1;
	}
	$scope.addTrip=function()
	{
		$scope.trip.formStatus=0;
		// console.log("Trip MEnu")
	}
	$scope.selectTrip=function(it)
	{
		console.log(it.departure_date.slice(0,10));
		$scope.trip.selected = it;
	}
	$scope.openNewTripModal=function()
	{
		$('#newTripModal').modal('show');
	}
	$scope.openPlanner = function()
	{
		$('#plannerModal').modal('show');
	}
	$scope.toggle_sidebar=function(){
		console.log($scope.trip.selected);
		sidebarDOM=document.getElementById("sidebar");
		if(sidebarDOM.style.right=="-380px")
		{
			sidebarDOM.style.right="0px";
			$('#toggleIcon').removeClass("fa-angle-double-left");
			$('#toggleIcon').addClass("fa-angle-double-right");
			$scope.getData(9);
		}
		else{
			sidebarDOM.style.right="-380px";
			$('#toggleIcon').removeClass("fa-angle-double-right");
			$('#toggleIcon').addClass("fa-angle-double-left");
		}
		console.log("called toggle"+sidebarDOM.style.right);
	}
	$scope.initialize = async function()
	{
		//bind prediction lists to some name use list attrib of input to use that list
		$('#loadingCont').css('visibility', 'visible');
		await $scope.predictors.bindInput("locs","location","city");
		await $scope.predictors.bindInput("carname","taxi","car_name");
		await $scope.predictors.bindInput("roomList","room","room_type");
		await $scope.predictors.bindInput("spotName","tourist_spot","name");
		await $scope.predictors.bindArray("capList",["1","2","3","4","5","6","7"]);
		await $scope.predictors.bindInput("spotType","tourist_spot","type");
		await $scope.predictors.bindInput("locality","location","locality");
		await $scope.predictors.bindSpecialInput("hotelList","service_provider","hotel","name","service_provider_id");
		await $scope.predictors.bindSpecialInput("restaurantList","service_provider","restaurant","name","service_provider_id");
		await $scope.predictors.bindInput("foodList","food_item","name");
		$scope.getData(9);
		$scope.getData(0);
		// $scope.getData(3);
		$('#loadingCont').css('visibility', 'hidden');
		console.log("init Done");
	}
	$scope.initialize();	
});
var labels=["Bookings","Tra","All Hotels","All Food Items","Gui/tour"];
function bs(current)
{
	master=document.getElementById('togs')
	all=master.getElementsByClassName("i_bar")
	for(var i=0;i<all.length;i++)
	{
		if(i!=current){
		all[i].id="none"
		}
		else{
		all[i].id="act"
		}	
	}
}
