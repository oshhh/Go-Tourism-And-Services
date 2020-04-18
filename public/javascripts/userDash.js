var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope,$http)
{
	$scope.tab=0;

	$scope.my_trips={
		status : "Pending",
		data : [],
		user_id : "",
		sortOrder:"0",
		reviews:{},
	}

	$scope.completed_unrated_request={
		status : "Pending",
		data : [],
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
		departure_date : "",
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

	$scope.trip={
		status : "Pending",
		data : [],
		selected : {}
	}
	$scope.curUser={
		name:document.getElementById("nmU").innerHTML,
		uid:document.getElementById("idU").innerHTML
	};
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
			$scope.my_trips.status="Pending";
			console.log("sent");
			$http.get("/api/getData",{params:{
				type:"my_trips",
				}}).then(
				function(data, status, headers, config) {
				console.log(data.data.content);
				$scope.my_trips.data=data.data.content;
				$scope.my_trips.data.forEach(element => {
					element.showRev=false;
				});
				$scope.my_trips.status="OK";
				// $scope.$digest();
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
				departure_time: "\"%" + $scope.flight.departure_date + "%\"" 
				}}).then(
				function(data, status, headers, config) {
				$scope.flight.data=data.data.content;
				$scope.flight.data.forEach(element => {
					element.showRev=false;
				});
				$scope.flight.status="OK";
				
				},function(data, status, headers, config) {
					console.log("error");
				});
		}
		else if(tab==3)
		{
			$scope.taxi.status="Pending";
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
				$scope.bus_train.status="OK";
				
				},function(data, status, headers, config) {
					console.log("error");
				});
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
				wifi_facility: ( $scope.room.wifi_facility == 0) ? ("\"%\"") : ($scope.room.wifi_facility == 1 ? "\"Y\"" : "\"N\"" )
				}}).then(
				function(data, status, headers, config) {
				$scope.room.data=data.data.content;
				$scope.room.data.forEach(element => {
					element.showRev=false;
				});
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
				$scope.food.status="OK";
				
				},function(data, status, headers, config) {
					console.log("error");
				});
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
		$scope.new_trip.status="Pending";
		$http.get("/api/getData",{params:{
			type:"new_trip",
			user_id:$scope.curUser.uid,
			destination_city:$scope.new_trip.destination_city,
			departure_date:$scope.new_trip.departure_date,
			return_date:$scope.new_trip.return_date,
			}}).then(
			function(data, status, headers, config) {
			alert("Trip Created!")
			$scope.new_trip.status="OK";
			$scope.getData(0);
			
			},function(data, status, headers, config) {
				console.log("error");
			}
		);

	}

	//update trip input boxes with most recent trip for the user
	// $scope.getTrips=function()
	// {
	// 	rest={};
	// 	$scope.putData('/api/getData',{type:'trip',user_id:$scope.curUser.uid},rest,
	// 	function(){
	// 		console.log("got trips");
	// 		console.log(rest);
	// 		$scope.trip
	// 		if(rest.data[0])
	// 		{
	// 			let arrDate=new Date(rest.data[0].arrival_date);
	// 			let depDate=new Date(rest.data[0].departure_date);
	// 			$scope.trip.tdateEnd=arrDate;
	// 			$scope.trip.tdateStart=depDate;
	// 			$scope.trip.tcity=rest.data[0].city;
	// 		}
	// 		else{
	// 			currentTime = new Date();
	// 			$scope.trip.tdateStart=currentTime;
	// 			$scope.trip.tdateEnd=currentTime;
	// 			$scope.trip.tcity="-";
	// 		}
	// 	});
	// }

	$scope.request = function(it){
		console.log($scope.trip.selected);
		if(!$scope.trip.selected.trip_id) {
			// alert("No trip selected! Can't request service.");
			$('#toast_msg').text("No trip selected! Select A trip");
			$('.toast').toast("show");
			sidebarDOM=document.getElementById("sidebar");
			sidebarDOM.style.right="0px";
			return;
		}
		$http.get('/api/getData',{params:{
			type : 'request',
			trip_id:$scope.trip.selected.trip_id,
			service_id:it.service_id,
			cost : it.price,
		}}).then(
		function(data, status, headers, config) {
			console.log(data.data.content);
			$('#toast_msg').text("Request made. Please check trips tab for more info about request");
			$('.toast').toast("show");
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
		console.log(it);
		$scope.trip.selected = it;
	}
	console.log("init Done");
	$scope.getData(9);
	$scope.changeTab(0);
	$scope.toggle_sidebar=function(){
		$scope.getData(9);
		console.log($scope.trip.selected);
		sidebarDOM=document.getElementById("sidebar");
		sidebarDOM.style.right=(sidebarDOM.style.right=="-380px")?("0px"):("-380px");
		console.log("called toggle"+sidebarDOM.style.right);
	}
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
