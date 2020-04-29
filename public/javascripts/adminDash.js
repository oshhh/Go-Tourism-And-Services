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
	$scope.predictors={
        data:[],
        bindArray:function(listName,arr)
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
			dataState.data.content.forEach(element => {
				var elemDOM = document.createElement("option");
				elemDOM.value=element.prediction;
				containerList.appendChild(elemDOM);
			});
			elementDOM.appendChild(containerList);
			containerList.id=listName;
			console.log(containerList);
		}
    }
	$scope.toastmsg="";

	$scope.admin.updateRecord=async function(it)
	{
		// alert(it.service_id);
		//update records access modified details by it.service_id/name/role/email
		//Toast on successfull update
		emailREGEX=/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
		matchStr=it.email;
		let reqBody=[];
		if(it.name=="" || it.role=="" || !matchStr.match(emailREGEX))
		{
			console.log("Fails");
			$('#toast_msg').text("Fill Correct Details");
			$('.toast').toast("show");
			return;
		}
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
		if(updateState.data.content)
		{
			$('#toast_msg').text("Updated Successfully");
			$('.toast').toast("show");
			it.editMode=false;
		}
		else{
			$('#toast_msg').text("Update Failed");
			$('.toast').toast("show");
		}
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
		$('#toast_msg').text("Deleted Successfully");
		$('.toast').toast("show");
		console.log("tosated");
	}

	$scope.user.updateRecord=async function(it)
	{
		// alert(it.service_id);
		//update records access modified details by it.service_id/name/role/email
		//Toast on successfull update
		emailREGEX=/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
		phoneREGEX=/([0-9]{10})|([0-9]{12})/;
		phString = it.phone_no;
		mailString = it.email;
		if(it.name=="" || it.role=="" || !phString.match(phoneREGEX) || !mailString.match(emailREGEX) || it.city=="")
		{
			console.log("Fails");
			$('#toast_msg').text("Fill Correct Details");
			$('.toast').toast("show");
			return;
		}
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
		let newLoc_ID= await $http.get("/api/getLocationID",{
			params:{
			city:it.city
			}
		});
		if(!newLoc_ID.data.content)
		{
			$('#toast_msg').text("Update Failed");
			$('.toast').toast("show");
			return;
		}
		reqBody.push({
			table_name:"user",
			column_name:"location_id",
			newValue:newLoc_ID.data.content,
			whereColumn:"user_id",
			whereValue:it.user_id
		});
		updateState=await $http.put('/api/updateList',JSON.stringify(reqBody));
		console.log(updateState);
		if(updateState.data.content)
		{
			$('#toast_msg').text("Updated Successfully");
			$('.toast').toast("show");
			it.editMode=false;
			$scope.$digest();
		}
		else{
			$('#toast_msg').text("Update Failed");
			$('.toast').toast("show");
		}
	}
	$scope.user.deleteRecord=async function(it)
	{
		// alert(it.service_id);
		//delete record by primary key it.service_id
		//Toast on successfull delete
		let reqBody=[];
		reqBody.push({
			table_name:"user",
			column_name:"active",
			newValue:"N",
			whereColumn:"user_id",
			whereValue:it.user_id
		});
		deleteState=await $http.put('/api/updateList',JSON.stringify(reqBody));
		if(deleteState.data.content)
		{
			$('#toast_msg').text("Deleted Successfully");
			$('.toast').toast("show");
			it.editMode=false;
		}
		else{
			$('#toast_msg').text("Deleted Failed");
			$('.toast').toast("show");
		}
		console.log("tosated");
	}
	
	$scope.service_provider.updateRecord=async function(it)
	{
		// alert(it.service_id);
		//update records access modified details by it.service_id/name/role/email
		//Toast on successfull update
		domainREGEX=/^(?:[hH][Oo][tT][Ee][Ll]|[Rr][Ee]stau[Rr]ant|[Aa]i[Rr]lin[Ee]|[tT]axi [Pp][Rr]ovid[Ee][Rr]|[bB]us [pP][Rr]ovid[Ee][Rr]|[tT][Rr]ain [pP][Rr]ovid[Ee][Rr]|[gG]uid[Ee] [pP][Rr]ovid[Ee][Rr])$/;
		yesnoREGEX=/^(?:Y|N)$/;
		domainString = it.domain;
		activeString = it.active;
		approveString = it.approved;
		console.log(!activeString.match(yesnoREGEX));
		console.log(!domainString.match(domainREGEX));
		if(it.name=="" || !activeString.match(yesnoREGEX) || !approveString.match(yesnoREGEX) || !domainString.match(domainREGEX))
		{
			console.log("Fails");
			$('#toast_msg').text("Fill Correct Details");
			$('.toast').toast("show");
			return;
		}
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
		if(updateState.data.content)
		{
			$('#toast_msg').text("Updated Successfully");
			$('.toast').toast("show");
			it.editMode=false;
			$scope.$digest();
		}
		else{
			$('#toast_msg').text("Update Failed");
			$('.toast').toast("show");
		}
		console.log($scope.toastmsg);
	}
	$scope.service_provider.deleteRecord=async function(it)
	{
		// alert(it.service_id);
		//delete record by primary key it.service_id
		//Toast on successfull delete
		let reqBody=[];
		reqBody.push({
			table_name:"service_provider",
			column_name:"active",
			newValue:"N",
			whereColumn:"service_provider_id",
			whereValue:it.service_provider_id
		});
		deleteState=await $http.put('/api/updateList',JSON.stringify(reqBody));
		if(deleteState.data.content)
		{
			$('#toast_msg').text("Deleted Successfully");
			$('.toast').toast("show");
			it.editMode=false;
		}
		else{
			$('#toast_msg').text("Deleted Failed");
			$('.toast').toast("show");
		}
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
	$scope.predictors.bindArray("roles",[
		"Admin","Service providers communications","Statistician",
		"Official Paperwork","User Information handling","Suggestions Implementation",
		"Respondent for user queries","Verification of guides","Tourist Spots Verification",
		"Editor"])
	$scope.predictors.bindArray("active",["Y","N"]);
	$scope.predictors.bindArray("domain",["Airline","Bus Provider","Guide Provider","Hotel","Restaurant","Taxi Provider","Train Provider",]);
	$scope.predictors.bindInput("locs","location","city");
	$scope.predictors.bindInput("1name","user","name");
	$scope.predictors.bindInput("umail","user","email");
	$scope.predictors.bindInput("uid","user","user_id");
	$scope.predictors.bindInput("uphone","user","phone_no");
	$scope.predictors.bindInput("1provider","service_provider","name");
	$scope.predictors.bindInput("1service_id","service","service_id");
	$scope.predictors.bindInput("pid","service_provider","service_provider_id");
	console.log("init Done");
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