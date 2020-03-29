var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope,$http)
{
	$scope.tab=0;
	$scope.f={};
	$scope.f.status="Pending";
	$scope.f.data=[];

	$scope.f.from_city = ""
	$scope.f.to_city = ""
	$scope.f.departure_date = ""

	$scope.f.fname="";
	$scope.f.rname="";
	$scope.f.delivery="0";
	$scope.f.sortOrder="0";
	$scope.f.reviews={};

	$scope.trip={
		tdateStart:"",
		tdateEnd:"",
		tcity:""
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
		$scope.putData('/data/getData',{type:'trip',user_id:$scope.curUser.uid},rest,
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
	$scope.f.order=function(it)
	{
		// alert(it.service_id);
		// console.log($http.post);
		$http.post('/data/service_request',JSON.stringify({
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
	$scope.f.view=function(it)
	{
		if(it.showRev==false)
		{
			$scope.f.reviews[it.service_id]={};
			$scope.f.reviews[it.service_id].status="Pending";
			//get reviews in f.reviews[serviceID].data
			// console.log("sent Review")
			$http.get("/data/getData",{params:{
				type:"review",
				service_id:it.service_id
				}}).then(
				function(data, status, headers, config) {
				if(data.data.isRes)
				{
					$scope.f.reviews[it.service_id].data=data.data.content;
					$scope.f.reviews[it.service_id].status="OK";
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
			$scope.f.status="Pending";
			console.log("sent");
			$http.get("/data/getData",{params:{
				type:"service_request"
				}}).then(
				function(data, status, headers, config) {
				// console.log(data);
				$scope.f.data=data.data.content;
				$scope.f.data.forEach(element => {
					element.showRev=false;
				});
				$scope.f.status="OK";
				},function(data, status, headers, config) {
					console.log("error");
				});
		}
		else if(tab==1)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
			$scope.f.status="Pending";
			// console.log("sent");
			$http.get("/data/getData",{params:{
				type:"flight",
				from: "\"%" + $scope.f.from_city + "%\"",
				to: "\"%" + $scope.f.to_city + "%\"",
				departure_time: "\"%" + $scope.f.departure_date + "%\"" 
				}}).then(
				function(data, status, headers, config) {
				$scope.f.data=data.data.content;
				$scope.f.data.forEach(element => {
					element.showRev=false;
				});
				$scope.f.status="OK";
				},function(data, status, headers, config) {
					console.log("error");
				});
		}
		else if(tab==5)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
			$scope.f.status="Pending";
			// console.log("sent");
			$http.get("/data/getData",{params:{
				type: "food",
				fname: "\"%" + $scope.f.fname + "%\"",
				rname: "\"%" + $scope.f.rname + "%\"",
				delivery:($scope.f.delivery)
				}}).then(
				function(data, status, headers, config) {
				$scope.f.data=data.data.content;
				$scope.f.data.forEach(element => {
					element.showRev=false;
				});
				$scope.f.status="OK";
				},function(data, status, headers, config) {
					console.log("error");
				});
		}
	}
	$scope.changeTab=function(newTab)
	{
		console.log("changed tabbb");
		$scope.tab=newTab;
		$scope.getData(newTab);
		console.log("change Tab: "+newTab);
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