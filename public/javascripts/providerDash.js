var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope,$http)
{
	$scope.statusLabels={0:"Pending", 1:"Accepted", 2:"Rejected", 3:"Completed", 4:"Paid"};
	$scope.tab=0;
	$scope.curUser={
		name:document.getElementById("nmU").innerHTML,
		uid:document.getElementById("idU").innerHTML
	};
	$scope.reqs={
		data:[],
		status:"Pending",
	}
	$scope.currentServices={
		data:{},
		status:"Pending",
		showNew:false,
		newData:{},
		createStatus:""
	};
	$scope.changeStatus=function(it)
	{
		it.updateResult="Sending";
		$http.put('/api/updateData',JSON.stringify({
			table_name:"service_request",
			column_name:"status",
			newValue:it.status,
			whereColumn:"request_id",
			whereValue:it.request_id
		}))
		.then(function(response){
			if(response || response.data.content.affectedRows==0)
			{
				it.updateResult="Data Not updated";
			}
			else{
				it.updateResult="Data updated";
			}
			console.log(response);
		},function(response){
			console.log("err");
		});
	}
	$scope.changeRating=function(it)
	{
		it.updateResult="Sending";
		$http.put('/api/updateData',JSON.stringify({
			table_name:"service_request",
			column_name:"user_rating",
			newValue:it.user_rating,
			whereColumn:"request_id",
			whereValue:it.request_id
		}))
		.then(function(response){
			if(response || response.data.content.affectedRows==0)
			{
				it.updateResult="Data Not updated";
			}
			else{
				it.updateResult="Data updated";
			}
			console.log(response);
		},function(response){
			console.log("err");
		});
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
			console.log("sending");
			$scope.reqs.status="Pending";
			$scope.putData('/api/getData',{type:'service_request'},$scope.reqs,function(){
				$scope.reqs.data.forEach(element => {
					element.updateResult="";
				});
				console.log('Got Everything');
				console.log($scope.reqs);
			})
		}
		else if(tab==1)
		{
			if($scope.curUser.uid.startsWith("RES"))
			{
				$http.get("/api/getData",{params:{
					type: "food",
					fname: "\"%%\"",
					rname: "\"%%\"",
					delivers:"\"%\"",
					service_provider_id:"\""+$scope.curUser.uid+"\""
					}}).then(
					function(data, status, headers, config) {
					console.log(data.data);
					$scope.currentServices.data=data.data.content;
					$scope.currentServices.status="OK";
					$scope.currentServices.data.forEach(element => {
						element.updateResult="";
					});
					},function(data, status, headers, config) {
						console.log("error");
					});
			}
		}
		else if(tab==2)
		{
			
		}
	}
	$scope.changeTab=function(newTab)
	{
		console.log("changed tabbb");
		$scope.tab=newTab;
		$scope.getData(newTab);
		console.log("change Tab: "+newTab);
	}
	$scope.addServiceForm=function()
	{
		$scope.currentServices.showNew=true;
	}
	$scope.createService=function()
	{
		$scope.currentServices.createStatus="Sending";
		reqBody={};
		for(i in $scope.currentServices.model.newModel){
			it=$scope.currentServices.model.newModel[i];
			reqBody[it.value]=$scope.currentServices.newData[it.value];
		}
		reqBody.type=$scope.currentServices.model.type;
		reqBody.prefix=$scope.currentServices.model.prefix;
		reqBody.service_provider_id=$scope.curUser.uid;
		console.log(reqBody);
		$http.post('/api/addService',JSON.stringify(reqBody))
		.then(function(response){
			console.log("got");
			console.log(response);
			$scope.currentServices.createStatus="Added New Service";
			$scope.changeTab($scope.tab);
			$scope.currentServices.showNew=false;
		},function(response){
			console.log("err");
		});
	}
	$scope.updateService=function(it)
	{
		it.updateResult="Sending";
		reqBody=[];
		for(i in $scope.currentServices.model.editable)
		{
			reqBody.push({
				table_name:$scope.currentServices.model.editable[i].table,
				column_name:$scope.currentServices.model.editable[i].column,
				newValue:it[$scope.currentServices.model.editable[i].value],
				whereColumn:$scope.currentServices.model.editable[i].searchKey,
				whereValue:it[$scope.currentServices.model.editable[i].searchValue]
			})
		}
		console.log("send: ");
		console.log(reqBody);
		$http.put('/api/updateList',JSON.stringify(reqBody))
		.then(function(response){
			if(!response || !response.data.content)
			{
				it.updateResult="Data Not updated";
			}
			else if(!response.data.content[0])
			{
				it.updateResult="Data Not updated";
			}
			else{
				it.updateResult="Data updated";
			}
			console.log(response);
		},function(response){
			console.log("err");
		});
	}
	$scope.deleteService=function(it)
	{

	}
	$scope.initModel=function()
	{
		if($scope.curUser.uid.startsWith("RES")){
			$scope.currentServices.model={
				type:"restaurant",
				prefix:"FOO",
				newModel:[
					{
						type:0,
						name:"Name",
						value:"name"
					},
					{
						type:1,
						name:"Cuisine",
						value:"cuisine"
					},
					{
						type:0,
						name:"Price",
						value:"price"
					},
					{
						type:0,
						name:"Discount",
						value:"discount"
					}
				],
				route:false,
				routeModel:{},
				header:{
					name:"Service ID",
					value:"service_id"
				},
				view:[
					{
						name:"service_id",
						value:"service_id"
					}
				],
				editable:[
					{
						name:"Name",
						value:"name",
						column:"name",
						table:"food_item",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0
					},
					{
						name:"Cuisine",
						value:"cuisine",
						column:"cuisine",
						table:"food_item",
						searchKey:"service_id",
						searchValue:"service_id",
						type:1
					},
					{
						name:"Price",
						value:"price",
						column:"price",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0
					},
					{
						name:"Discount",
						value:"discount",
						column:"discount",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0
					},
				],
				globalID:{
					table:"food_item",
					searchKey:"service_id",
					searchValue:"service_id"
				} 
			}
		}
		else{
			$scope.currentServices.model={};
		}
	}
	$scope.changeTab(0);
	$scope.initModel();
	console.log("init Done");
	// console.log($scope.tab);
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
	sidebarDOM.style.right=(sidebarDOM.style.right=="0px")?("-380px"):("0px");
	console.log("called toggle"+sidebarDOM.style.right);
}