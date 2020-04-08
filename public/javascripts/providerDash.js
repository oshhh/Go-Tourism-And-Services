var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope,$http)
{
	$scope.statusLabels={0:"Pending", 1:"Accepted", 2:"Rejected", 3:"Completed", 4:"Paid"};
	$scope.tab=0;
	$scope.curUser={
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
		newData:{
			routeData:[]
		},
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
	$scope.getData=async function(tab)
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
			else if($scope.curUser.uid.startsWith("BPR"))
			{
				try{
					let res= await $http.get("/api/getData",{
						params:{
						type:'servicesByProvider',
						func:"getBuses",
						service_provider_id:$scope.curUser.uid
						}
					});
					$scope.currentServices.data=res.data.content;
					console.log($scope.currentServices.data);
					$scope.currentServices.status="OK";
					$scope.currentServices.data.forEach(async element => {
						element.updateResult="";
						element.routeData=[];
					let routeData=await $http.get("/api/getData",{
							params:
							{
							type: "route",
							service_id:element.service_id
							}
						});
					element.routeData=routeData.data.content;
					});
				}
				catch(err) {
					console.log(err);
				  }
			}
		}
		else if(tab==2)
		{
			
		}
	}
	$scope.incrementRoute=function(it)
	{
		// console.log(it);
		it.push({
			arrival_time:"",
			location_id_v:""
		});
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
	$scope.createService=async function()
	{
		try{
			$scope.currentServices.createStatus="Sending";
			reqBody={};
			for(i in $scope.currentServices.model.newModel){
				it=$scope.currentServices.model.newModel[i];
				if(it.type==2)
				{
					let newLoc_ID= await $http.get("/api/getLocationID",{
						params:{
						city:$scope.currentServices.newData[it.value]
						}
					});
					reqBody[it.value]=newLoc_ID.data.content;
				}
				else{
					reqBody[it.value]=$scope.currentServices.newData[it.value];
				}
			}
			console.log(reqBody);
			reqBody.type=$scope.currentServices.model.type;
			reqBody.prefix=$scope.currentServices.model.prefix;
			reqBody.service_provider_id=$scope.curUser.uid;
			console.log(reqBody);

			addServiceResult=await $http.post('/api/addService',JSON.stringify(reqBody));

			if($scope.currentServices.model.route==true)
			{
				insertData=[];
				console.log($scope.currentServices.newData.routeData);
				for(j in $scope.currentServices.newData.routeData)
				{
					it=$scope.currentServices.newData.routeData[j];
					if(it.location_id!="" && it.arrival_time!="")
					{
						let newLoc_ID= await $http.get("/api/getLocationID",{
							params:{
							city:it.location_id_v
							}
						});
						insertData.push({
							location_id:newLoc_ID.data.content,
							arrival_time:it.arrival_time,
						})
					}
				}
				console.log("sending Route Insert");
				console.log(insertData);
				insertState=await $http.post('/api/insertList',JSON.stringify({
					type:'route',
					service_id:addServiceResult.data,
					arr:insertData
				}));
				$scope.currentServices.createStatus="Added New Service";
				$scope.changeTab($scope.tab);
				$scope.currentServices.showNew=false;
				console.log(addServiceResult.data);
			}
		}
		catch(err)
		{

		}
	}
	$scope.updateService=async function(it)
	{
		try{
			it.updateResult="Sending";
			reqBody=[];
			for(i in $scope.currentServices.model.editable)
			{
				if($scope.currentServices.model.editable[i].type==2)
				{
					let newLoc_ID= await $http.get("/api/getLocationID",{
						params:{
						city:it[$scope.currentServices.model.editable[i].display]
						}
					});
					// console.log(newLoc_ID);
					it[$scope.currentServices.model.editable[i].value]=newLoc_ID.data.content;
					// console.log("got location ID");
					// console.log(newLoc_ID.data.content);
					reqBody.push({
						table_name:$scope.currentServices.model.editable[i].table,
						column_name:$scope.currentServices.model.editable[i].column,
						newValue:it[$scope.currentServices.model.editable[i].value],
						whereColumn:$scope.currentServices.model.editable[i].searchKey,
						whereValue:it[$scope.currentServices.model.editable[i].searchValue]
					})
				}
				else{
					reqBody.push({
						table_name:$scope.currentServices.model.editable[i].table,
						column_name:$scope.currentServices.model.editable[i].column,
						newValue:it[$scope.currentServices.model.editable[i].value],
						whereColumn:$scope.currentServices.model.editable[i].searchKey,
						whereValue:it[$scope.currentServices.model.editable[i].searchValue]
					});
				}
			}
			updateState=await $http.put('/api/updateList',JSON.stringify(reqBody));
			if($scope.currentServices.model.route==true)
			{
				console.log("sending Delet");
				deleteState=await $http.post('/api/deleteData',JSON.stringify({
					type:'route',
					service_id:it[$scope.currentServices.model.globalID.searchKey]
				}));
				console.log("delet done");
				insertData=[];
				console.log(it.routeData);
				for(j in it.routeData)
				{
					if(it.routeData[j].location_id_v!="" && it.routeData[j].arrival_time!="")
					{
						let newLoc_ID= await $http.get("/api/getLocationID",{
							params:{
							city:it.routeData[j].location_id_v
							}
						});
						insertData.push({
							location_id:newLoc_ID.data.content,
							arrival_time:it.routeData[j].arrival_time,
						})
						console.log(insertData);
					}
				}
				console.log("sending Route Insert");
				console.log(insertData);
				insertState=await $http.post('/api/insertList',JSON.stringify({
					type:'route',
					service_id:it[$scope.currentServices.model.globalID.searchKey],
					arr:insertData
				}));
				console.log("Complete");
			}
			response=updateState.data;
			it.updateResult="Data updated";
			console.log(it);
		}
		catch(err)
		{
			it.updateResult="Data Not updated";
		}
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
				route:false,
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
			};
		}
		else if($scope.curUser.uid.startsWith("BPR")){
			$scope.currentServices.model={
				type:'bus',
				prefix:"BUS",
				route:true,
				newModel:[
					{
						name:"From",
						value:"from_location_id",
						display:"from_location_id_v",
						type:2
					},
					{
						name:"To",
						value:"to_location_id",
						display:"to_location_id_v",
						type:2
					},
					{
						name:"Active Days",
						value:"active_days",
						type:0
					},
					{
						name:"AC(Y/N)",
						value:"AC",
						type:0
					},
					{
						name:"Price",
						value:"price",
						type:0
					},
					{
						name:"Discount",
						value:"discount",
						type:0
					},
				],
				routeModel:{

				},
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
						name:"From",
						value:"from_location_id",
						display:"from_location_id_v",
						column:"from_location_id",
						table:"bus",
						searchKey:"service_id",
						searchValue:"service_id",
						type:2
					},
					{
						name:"To",
						value:"to_location_id",
						display:"to_location_id_v",
						column:"to_location_id",
						table:"bus",
						searchKey:"service_id",
						searchValue:"service_id",
						type:2
					},
					{
						name:"Active Days",
						value:"active_days",
						column:"active_days",
						table:"bus",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0
					},
					{
						name:"AC(Y/N)",
						value:"AC",
						column:"AC",
						table:"bus",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0
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
					table:"bus",
					searchKey:"service_id",
					searchValue:"service_id"
				} 
			};
		}
		else{
			$scope.currentServices.model={};
		}
	}
	$scope.initModel();
	$scope.changeTab(0);
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