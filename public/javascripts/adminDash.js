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

	$scope.user={};
	$scope.user.data=[];
	$scope.user.user_id="";
	$scope.user.name="";
	$scope.user.email="";
	$scope.user.phone_no ="";
	$scope.user.city="";
	$scope.user.status="Pending";

	$scope.service_provider={};
	$scope.service_provider.data=[];
	$scope.service_provider.service_provider_id="";
	$scope.service_provider.name="";
	$scope.service_provider.domain="";
	$scope.service_provider.active="";
	$scope.service_provider.approved="";
	$scope.service_provider.status="Pending";

	$scope.req={};
	$scope.req.data=[];
	$scope.req.user_id="";
	$scope.req.pname="";
	$scope.req.service_id="";
	$scope.req.loadStatus="Pending";

	$scope.trip={
		tdateStart:"",
		tdateEnd:"",
		tcity:""
	}

	$scope.toastmsg="";

	$scope.admin.updateRecord=async function(it)
	{
		// alert(it.service_id);
		//update records access modified details by it.service_id/name/role/email
		//Toast on successfull update
		let reqBody=[];
		reqBody.push({
			table_name:"administrator",
			column_name:"name",
			newValue:it.name,
			whereColumn:"admin_id",
			whereValue:it.admin_id
		});
		reqBody.push({
			table_name:"administrator",
			column_name:"role",
			newValue:it.role,
			whereColumn:"admin_id",
			whereValue:it.admin_id
		});
		reqBody.push({
			table_name:"administrator",
			column_name:"email",
			newValue:it.email,
			whereColumn:"admin_id",
			whereValue:it.admin_id
		});
		updateState=await $http.put('/api/updateList',JSON.stringify(reqBody));
		// $('#toast_msg').innerHTML="Updated Successfully";
		$('.toast').toast("show");
		console.log($scope.toastmsg);
	}
	$scope.admin.deleteRecord=async function(it)
	{
		// alert(it.service_id);
		//delete record by primary key it.service_id
		//Toast on successfull delete
		deleteState=await $http.post('/api/deleteData',JSON.stringify({
			type:'administrator',
			admin_id:it.admin_id
		}));
		// $scope.toastmsg=;
		$('#toast_msg').innerHTML="Deleted Successfully";
		$('.toast').toast("show");
		console.log("tosated");
	}

	$scope.user.updateRecord=async function(it)
	{
		// alert(it.service_id);
		//update records access modified details by it.service_id/name/role/email
		//Toast on successfull update
		let reqBody=[];
		reqBody.push({
			table_name:"user",
			column_name:"name",
			newValue:it.name,
			whereColumn:"user_id",
			whereValue:it.user_id
		});
		reqBody.push({
			table_name:"user",
			column_name:"phone_no",
			newValue:it.phone_no,
			whereColumn:"user_id",
			whereValue:it.user_id
		});
		reqBody.push({
			table_name:"user",
			column_name:"email",
			newValue:it.email,
			whereColumn:"user_id",
			whereValue:it.user_id
		});
		reqBody.push({
			table_name:"user",
			column_name:"email",
			newValue:it.email,
			whereColumn:"user_id",
			whereValue:it.user_id
		});
		reqBody.push({
			table_name:"user",
			column_name:"city",
			newValue:it.city,
			whereColumn:"user_id",
			whereValue:it.user_id
		});
		updateState=await $http.put('/api/updateList',JSON.stringify(reqBody));
		// $('#toast_msg').innerHTML="Updated Successfully";
		$('.toast').toast("show");
		console.log($scope.toastmsg);
	}
	$scope.user.deleteRecord=async function(it)
	{
		// alert(it.service_id);
		//delete record by primary key it.service_id
		//Toast on successfull delete
		deleteState=await $http.post('/api/deleteData',JSON.stringify({
			type:'user',
			user_id:it.user_id
		}));
		// $scope.toastmsg=;
		$('#toast_msg').innerHTML="Deleted Successfully";
		$('.toast').toast("show");
		console.log("tosated");
	}
	
	$scope.service_provider.updateRecord=async function(it)
	{
		// alert(it.service_id);
		//update records access modified details by it.service_id/name/role/email
		//Toast on successfull update
		let reqBody=[];
		reqBody.push({
			table_name:"service_provider",
			column_name:"name",
			newValue:it.name,
			whereColumn:"service_provider_id",
			whereValue:it.service_provider_id
		});
		reqBody.push({
			table_name:"service_provider",
			column_name:"domain",
			newValue:it.domain,
			whereColumn:"service_provider_id",
			whereValue:it.service_provider_id
		});
		reqBody.push({
			table_name:"service_provider",
			column_name:"active",
			newValue:it.active,
			whereColumn:"service_provider_id",
			whereValue:it.service_provider_id
		});
		reqBody.push({
			table_name:"service_provider",
			column_name:"approved",
			newValue:it.approved,
			whereColumn:"service_provider_id",
			whereValue:it.service_provider_id
		});

		updateState=await $http.put('/api/updateList',JSON.stringify(reqBody));
		// $('#toast_msg').innerHTML="Updated Successfully";
		$('.toast').toast("show");
		console.log($scope.toastmsg);
	}
	$scope.service_provider.deleteRecord=async function(it)
	{
		// alert(it.service_id);
		//delete record by primary key it.service_id
		//Toast on successfull delete
		deleteState=await $http.post('/api/deleteData',JSON.stringify({
			type:'service_provider',
			service_provider_id:it.service_provider_id
		}));
		// $scope.toastmsg=;
		$('#toast_msg').innerHTML="Deleted Successfully";
		$('.toast').toast("show");
		console.log("tosated");
	}

	$scope.admin.view=function(it)
	{

	}
	$scope.user.view=function(it)
	{

	}
	$scope.service_provider.view=function(it)
	{

	}
	$scope.getData=function(tab)
	{
		if(tab == 0)
		{
			console.log("sendingGET");
			console.log($scope.req);
			$http.get("/api/getData",{params:{
				type:"adminRequests",
				user_id:($scope.req.user_id=="")?(".*"):($scope.req.user_id),
				pname:($scope.req.pname=="")?(".*"):($scope.req.pname),
				service_id:($scope.req.service_id=="")?(".*"):($scope.req.service_id),
				}}).then(
				function(data, status, headers, config) {
				$scope.req.data=data.data.content;
				console.log(data.data);
				$scope.req.loadStatus="OK";
				},function(data, status, headers, config) {
					console.log("error");
				});
		}
		else if(tab==1)
		{
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
			$scope.admin.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
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
		} else if(tab == 2) {
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
			$scope.user.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
				type:"user",
				user_id: "\"%" + $scope.user.user_id + "%\"",
				name: "\"%" + $scope.user.name + "%\"",
				email: "\"%" + $scope.user.email + "%\"",
				phone_no: "\"%" + $scope.user.phone_no + "%\"",
				city: "\"%" + $scope.user.city + "%\"" ,
				}}).then(
				function(data, status, headers, config) {
				$scope.user.data=data.data.content;
				$scope.user.data.forEach(element => {
					element.showRev=false;
				});
				$scope.user.status="OK";
				},function(data, status, headers, config) {
					console.log("error");
				});		
		} else if(tab == 3) {
			var newDate = new Date($scope.trip.tdateStart);
			console.log(newDate.toUTCString());
			$scope.service_provider.status="Pending";
			// console.log("sent");
			$http.get("/api/getData",{params:{
				type:"service_provider",
				service_provider_id: "\"%" + $scope.service_provider.service_provider_id + "%\"",
				name: "\"%" + $scope.service_provider.name + "%\"",
				domain: "\"%" + $scope.service_provider.domain + "%\"",
				active: "\"%" + $scope.service_provider.active + "%\"" ,
				approved: "\"%" + $scope.service_provider.approved + "%\"" ,
				}}).then(
				function(data, status, headers, config) {
				$scope.service_provider.data=data.data.content;
				$scope.service_provider.data.forEach(element => {
					element.showRev=false;
				});
				$scope.service_provider.status="OK";
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
	$scope.changeTab($scope.tab);
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