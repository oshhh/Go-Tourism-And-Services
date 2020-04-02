var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope, $http)
{
	$scope.tab=0;
	$scope.admin={};
	$scope.admin.data=[];
	$scope.admin.admin_id="";
	$scope.admin.name="";
	$scope.admin.role="";
	$scope.admin.email="";
	$scope.admin.status="Pending";

	$scope.trip={
		tdateStart:"",
		tdateEnd:"",
		tcity:""
	}


	$scope.admin.updateRecord=function(it)
	{
		// alert(it.service_id);
		//update records access modified details by it.service_id/name/role/email
		//Toast on successfull update
	}
	$scope.admin.deleteRecord=function(it)
	{
		// alert(it.service_id);
		//delete record by primary key it.service_id
		//Toast on successfull delete
	}
	$scope.admin.view=function(it)
	{

	}
	$scope.getData=function(tab)
	{
		if(tab == 0)
		{
		}
		else if(tab==1)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
			$scope.admin.status="Pending";
			// console.log("sent");
			$http.get("/data/getData",{params:{
				type:"admin",
				admin_id: "\"%" + $scope.admin.admin_id + "%\"",
				name: "\"%" + $scope.admin.name + "%\"",
				role: "\"%" + $scope.admin.role + "%\"",
				email: "\"%" + $scope.admin.email + "%\"" 
				}}).then(
				function(data, status, headers, config) {
				$scope.admin.data=data.data.content;
				$scope.admin.data.forEach(element => {
					element.showRev=false;
				});
				$scope.admin.status="OK";
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
});
function onStart()
{
	bs(0);
}
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