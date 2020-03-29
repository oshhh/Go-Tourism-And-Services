var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope,$http)
{
	$scope.tab=0;

	$scope.f={};
	$scope.f.status="Pending";
	$scope.f.data=[];
	$scope.f.fname="";
	$scope.f.rname="";
	$scope.f.delivery="0";
	$scope.f.sortOrder="0";
	$scope.f.reviews={};
	$scope.f.order=function(it)
	{
		alert(it.service_id);
	}
	$scope.f.view=function(it)
	{
		// alert(it.service_id);
		if(it.showRev==false)
		{
			$scope.f.reviews[it.service_id]={};
			$scope.f.reviews[it.service_id].status="Pending";
			//get reviews in f.reviews[serviceID].data
			console.log("sent Review")
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
		else if(tab==3)
		{
			$scope.f.status="Pending";
			console.log("sent");
			$http.get("/data/getData",{params:{
				type:"food",
				fname:$scope.f.fname,
				rname:$scope.f.rname,
				delivery:$scope.f.delivery
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
			// $scope.f.data=[
			// {
			// 	service_id:"FOO00001",
			// 	name:"Food1",
			// 	cuisine:"BUDBDUBDU",
			// 	res_name:"Res name",
			// 	locality:"locality",
			// 	city:"city",
			// 	delivery:"Y",
			// 	price:550,
			// 	discount:0,
			// 	rating:3.9
			// }];
		}
	}
	$scope.changeTab=function(newTab)
	{
		$scope.tab=newTab;
		$scope.getData(newTab);
		console.log("change Tab: "+newTab);
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