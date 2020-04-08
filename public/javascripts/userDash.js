var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope,$http)
{
	$scope.tab=0;

	$scope.service_request={}
	$scope.service_request.status = "Pending";
	$scope.service_request.data = [];
	$scope.service_request.user_id = "";
	$scope.service_request.sortOrder="0";
	$scope.service_request.reviews={};

	$scope.food={};
	$scope.food.status="Pending";
	$scope.food.data=[];
	$scope.food.fname="";
	$scope.food.rname="";
	$scope.food.delivers="0";
	$scope.food.sortOrder="0";
	$scope.food.reviews={};

	$scope.flight={}
	$scope.flight.status = "Pending";
	$scope.flight.data = [];
	$scope.flight.from_city = "";
	$scope.flight.to_city = "";
	$scope.flight.departure_date = "";
	$scope.flight.sortOrder="0";
	$scope.flight.reviews={};

	$scope.bus_train={}
	$scope.bus_train.status = "Pending";
	$scope.bus_train.data = [];
	$scope.bus_train.route_data = []
	$scope.bus_train.t_type = "0";
	$scope.bus_train.from = "";
	$scope.bus_train.to = "";
	$scope.bus_train.AC = "0";
	$scope.bus_train.sortOrder="0";
	$scope.bus_train.reviews={};

	$scope.taxi={}
	$scope.taxi.status = "Pending";
	$scope.taxi.data = [];
	$scope.taxi.car_name = "";
	$scope.taxi.capacity = "";
	$scope.taxi.AC = "0";
	$scope.taxi.sortOrder="0";
	$scope.taxi.reviews={};

	$scope.room={}
	$scope.room.status = "Pending";
	$scope.room.data = [];
	$scope.room.name = "";
	$scope.room.city = "";
	$scope.room.room_type = "";
	$scope.room.capacity = "";
	$scope.room.wifi_facility = "0";
	$scope.room.sortOrder="0";
	$scope.room.reviews={};

	$scope.tourist_spot={}
	$scope.tourist_spot.status = "Pending";
	$scope.tourist_spot.data = [];
	$scope.tourist_spot.name = "";
	$scope.tourist_spot.t_type = "";
	$scope.tourist_spot.city = "";
	$scope.tourist_spot.sortOrder="0";
	$scope.tourist_spot.reviews={};

	$scope.guide={}
	$scope.guide.status = "Pending";
	$scope.guide.data = [];
	$scope.guide.tourist_spot_name = "";
	$scope.guide.tourist_spot_city = "";
	$scope.guide.sortOrder="0";
	$scope.guide.reviews={};

	$scope.trip={
		tdateStart:"",
		tdateEnd:"",
		tcity:"",
		formStatus:0
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
	//update trip input boxes with most recent trip for the user
	$scope.getTrips=function()
	{
		rest={};
		$scope.putData('/api/getData',{type:'trip',user_id:$scope.curUser.uid},rest,
		function(){
			console.log("got trips");
			console.log(rest);
			if(rest.data[0])
			{
				let arrDate=new Date(rest.data[0].arrival_date);
				let depDate=new Date(rest.data[0].departure_date);
				$scope.trip.tdateEnd=arrDate;
				$scope.trip.tdateStart=depDate;
				$scope.trip.tcity=rest.data[0].city;
			}
			else{
				currentTime = new Date();
				$scope.trip.tdateStart=currentTime;
				$scope.trip.tdateEnd=currentTime;
				$scope.trip.tcity="-";
			}
		});
	}
	$scope.food.order=function(it)
	{
		// alert(it.service_id);
		// console.log($http.post);
		$http.post('/api/service_request',JSON.stringify({
			user_id:$scope.curUser.uid,
			depDate:$scope.trip.tdateStart.toISOString().slice(0, 19).replace('T', ' '),
			arrDate:$scope.trip.tdateEnd.toISOString().slice(0, 19).replace('T', ' '),
			service_id:it.service_id
		}))
		.then(function(response){
			console.log("got");
		},function(response){
			console.log("err");
		});
	}
	$scope.flight.order=function(it)
	{
		// alert(it.service_id);
		// console.log($http.post);
		$http.post('/api/service_request',JSON.stringify({
			user_id:$scope.curUser.uid,
			depDate:$scope.trip.tdateStart.toISOString().slice(0, 19).replace('T', ' '),
			arrDate:$scope.trip.tdateEnd.toISOString().slice(0, 19).replace('T', ' '),
			service_id:it.service_id
		}))
		.then(function(response){
			console.log("got");
		},function(response){
			console.log("err");
		});
	}
	$scope.bus_train.order=function(it)
	{
		// alert(it.service_id);
		// console.log($http.post);
		$http.post('/api/service_request',JSON.stringify({
			user_id:$scope.curUser.uid,
			depDate:$scope.trip.tdateStart.toISOString().slice(0, 19).replace('T', ' '),
			arrDate:$scope.trip.tdateEnd.toISOString().slice(0, 19).replace('T', ' '),
			service_id:it.service_id
		}))
		.then(function(response){
			console.log("got");
		},function(response){
			console.log("err");
		});
	}
	$scope.taxi.order=function(it)
	{
		// alert(it.service_id);
		// console.log($http.post);
		$http.post('/api/service_request',JSON.stringify({
			user_id:$scope.curUser.uid,
			depDate:$scope.trip.tdateStart.toISOString().slice(0, 19).replace('T', ' '),
			arrDate:$scope.trip.tdateEnd.toISOString().slice(0, 19).replace('T', ' '),
			service_id:it.service_id
		}))
		.then(function(response){
			console.log("got");
		},function(response){
			console.log("err");
		});
	}
	$scope.room.order=function(it)
	{
		// alert(it.service_id);
		// console.log($http.post);
		$http.post('/api/service_request',JSON.stringify({
			user_id:$scope.curUser.uid,
			depDate:$scope.trip.tdateStart.toISOString().slice(0, 19).replace('T', ' '),
			arrDate:$scope.trip.tdateEnd.toISOString().slice(0, 19).replace('T', ' '),
			service_id:it.service_id
		}))
		.then(function(response){
			console.log("got");
		},function(response){
			console.log("err");
		});
	}
	$scope.tourist_spot.order=function(it)
	{
		// alert(it.service_id);
		// console.log($http.post);
		$http.post('/api/service_request',JSON.stringify({
			user_id:$scope.curUser.uid,
			depDate:$scope.trip.tdateStart.toISOString().slice(0, 19).replace('T', ' '),
			arrDate:$scope.trip.tdateEnd.toISOString().slice(0, 19).replace('T', ' '),
			service_id:it.service_id
		}))
		.then(function(response){
			console.log("got");
		},function(response){
			console.log("err");
		});
	}
	$scope.guide.order=function(it)
	{
		// alert(it.service_id);
		// console.log($http.post);
		$http.post('/api/service_request',JSON.stringify({
			user_id:$scope.curUser.uid,
			depDate:$scope.trip.tdateStart.toISOString().slice(0, 19).replace('T', ' '),
			arrDate:$scope.trip.tdateEnd.toISOString().slice(0, 19).replace('T', ' '),
			service_id:it.service_id
		}))
		.then(function(response){
			console.log("got");
		},function(response){
			console.log("err");
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
	
	$scope.getData=function(tab)
	{
		if(tab == 0)
		{
			$scope.service_request.status="Pending";
			console.log("sent");
			$http.get("/api/getData",{params:{
				type:"service_request",
				}}).then(
				function(data, status, headers, config) {
				// console.log(data);
				$scope.service_request.data=data.data.content;
				$scope.service_request.data.forEach(element => {
					element.showRev=false;
				});
				$scope.service_request.status="OK";
				},function(data, status, headers, config) {
					console.log("error");
				});
		}
		else if(tab==1)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
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
		else if(tab==2)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
			$scope.taxi.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
				type:"bus_train",
				t_type : ( $scope.bus_train.t_type == 0) ? ("\"%\"") : ($scope.bus_train.t_type == 1 ? "\"Y\"" : "\"N\"" ),
				from: "\"%" + $scope.bus_train.from + "%\"",
				to: "\"%" + $scope.bus_train.to + "%\"",
				AC: ( $scope.bus_train.AC == 0) ? ("\"%\"") : ($scope.bus_train.AC == 1 ? "\"B\"" : "\"T\"" )
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
		else if(tab==3)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
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
		else if(tab==4)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
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
		else if(tab==5)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
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
		else if(tab==6)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
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
		else if(tab==7)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
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
		alert("works");
	}
	console.log("init Done");
	$scope.getTrips();
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
function toggle_sidebar()
{
	sidebarDOM=document.getElementById("sidebar");
	sidebarDOM.style.right=(sidebarDOM.style.right=="-380px")?("0px"):("-380px");
	console.log("called toggle"+sidebarDOM.style.right);
}