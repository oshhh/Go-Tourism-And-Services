var	angularApp = angular.module("dash", ['angularUtils.directives.dirPagination']);
angularApp.controller("ngContent",function($scope,$http)
{
	$scope.statusLabels={0:"Pending", 1:"Accepted", 2:"Rejected", 3:"Completed", 4:"Paid",5:"Completed"};
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

	$scope.analyse_max_service_requests = {
		data : {},
		status : "Pending"
	}

	$scope.analyse_max_rating = {
		data : {},
		status : "Pending"
	}

	$scope.analyse_min_query_response_time = {
		data : {},
		status : "Pending"
	}

	$scope.analyse_user_by_region = {
		data : {},
		status : "Pending"
	}

	$scope.analyse_status_of_requests = {
		data : {},
		status : "Pending"
	}

	$scope.changeStatus=function(it)
	{
		console.log(it);
		if(it.completion_date!=null)
		{
			it.status="Completed";
			$('#toast_msg').text("Status Can't be changed now");
			$('.toast').toast("show");
			return;
		}
		it.updateResult="Sending";
		$http.put('/api/updateData',JSON.stringify({
			table_name:"service_request",
			column_name:"status",
			newValue:"\"" + it.status + "\"",
			whereColumn:"request_id",
			whereValue:"\"" + it.request_id + "\""
		}))
		.then(function(response){
			console.log("response",response);
			if(response || response.data.content.affectedRows==0)
			{
				it.updateResult="Data updated";
			}
			else{
				it.updateResult="Data Not updated";
			}
		},function(response){
			console.log("err");
		});
		if(it.status == "Completed") {
			it.updateResult="Sending";
			it.completion_date="";
			$http.put('/api/updateData',JSON.stringify({
				table_name:"service_request",
				column_name:"completion_date",
				newValue: "CURDATE()",
				whereColumn:"request_id",
				whereValue: "\"" + it.request_id + "\""
			}))
			.then(function(response){
				if(response || response.data.content.affectedRows==0)
				{
					it.updateResult="Data updated";
				}
				else{
					it.updateResult="Data Not updated";
				}
			},function(response){
				console.log("err");
			});	
		}
	}
	$scope.changeRating=function(it)
	{
		it.updateResult="Sending";
		$http.put('/api/updateData',JSON.stringify({
			table_name:"service_request",
			column_name:"user_rating",
			newValue:"\"" + it.user_rating + "\"",
			whereColumn:"request_id",
			whereValue:"\"" + it.request_id + "\""
		}))
		.then(function(response){
			if(response || response.data.content.affectedRows==0)
			{
				it.updateResult="Data updated";
			}
			else{
				it.updateResult="Data Not updated";
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

	$scope.analyseMaxServiceRequests = async function() {
		domain = null
		console.log($scope.curUser.uid.substring(0, 3));
		switch($scope.curUser.uid.substring(0, 3)) {
			case 'AIR':
				domain = '"Airline"'
			break;
			case 'BPR':
				domain = '"Bus Provider"'
			break;
			case 'TRP':
				domain = '"Train Provider"'
			break;
			case 'TAP':
				domain = '"Taxi Provider"'
			break;
			case 'RES':
				domain = '"Restaurant"'
			break;
			case 'HOT':
				domain = '"Hotel"'
			break;
			case 'GUP':
				domain = '"guide provider"'
			break;
		}
		console.log("sending");
		$scope.analyse_max_service_requests.status="Pending";
		try{
			putState= await $http.get('/api/getData',{params:{type:'analyseMaxServiceRequests', domain : domain}});
			console.log(putState);
			$scope.analyse_max_service_requests.data=putState.data.content;
			$scope.analyse_max_service_requests.status="OK";
			$scope.$digest();
			$scope.analyse_max_service_requests.data.forEach(element => {
				element.updateResult="";
			});
			console.log($scope.analyse_max_service_requests.data);
		}
		catch(err)
		{
			console.error(err);
		}

	}
	$scope.analyseMaxRating = async function() {
		domain = null
		console.log($scope.curUser.uid.substring(0, 3));
		switch($scope.curUser.uid.substring(0, 3)) {
			case 'AIR':
				domain = '"Airline"'
			break;
			case 'BPR':
				domain = '"Bus Provider"'
			break;
			case 'TRP':
				domain = '"Train Provider"'
			break;
			case 'TAP':
				domain = '"Taxi Provider"'
			break;
			case 'RES':
				domain = '"Restaurant"'
			break;
			case 'HOT':
				domain = '"Hotel"'
			break;
			case 'GUP':
				domain = '"guide provider"'
			break;
		}
		console.log("sending");
		$scope.analyse_max_rating.status="Pending";
		try{
			putState= await $http.get('/api/getData',{params:{type:'analyseMaxRating', domain : domain}});
			console.log(putState);
			$scope.analyse_max_rating.data=putState.data.content;
			$scope.analyse_max_rating.status="OK";
			$scope.$digest();
			$scope.analyse_max_rating.data.forEach(element => {
				element.updateResult="";
			});
			console.log($scope.analyse_max_rating.data);
		}
		catch(err)
		{
			console.error(err);
		}

	}
	$scope.analyseMinQueryResponseTime = async function() {
		domain = null
		console.log($scope.curUser.uid.substring(0, 3));
		switch($scope.curUser.uid.substring(0, 3)) {
			case 'AIR':
				domain = '"Airline"'
			break;
			case 'BPR':
				domain = '"Bus Provider"'
			break;
			case 'TRP':
				domain = '"Train Provider"'
			break;
			case 'TAP':
				domain = '"Taxi Provider"'
			break;
			case 'RES':
				domain = '"Restaurant"'
			break;
			case 'HOT':
				domain = '"Hotel"'
			break;
			case 'GUP':
				domain = '"guide provider"'
			break;
		}
		console.log("sending");
		$scope.analyse_min_query_response_time.status="Pending";
		try{
			putState= await $http.get('/api/getData',{params:{type:'analyseMinQueryResponseTime', domain : domain}});
			console.log(putState);
			$scope.analyse_min_query_response_time.data=putState.data.content;
			$scope.analyse_min_query_response_time.status="OK";
			$scope.$digest();
			$scope.analyse_min_query_response_time.data.forEach(element => {
				element.updateResult="";
			});
			console.log($scope.analyse_min_query_response_time.data);
		}
		catch(err)
		{
			console.error(err);
		}

	}
	$scope.analyseUserByRegion = async function() {
		$scope.analyse_user_by_region.status="Pending";
		try{
			putState= await $http.get('/api/getData',{params:{type:'analyseUserByRegion', service_provider_id : '"' + $scope.curUser.uid + '"'}});
			console.log(putState);
			$scope.analyse_user_by_region.data=putState.data.content;
			$scope.analyse_user_by_region.status="OK";
			$scope.$digest();
			$scope.analyse_user_by_region.data.forEach(element => {
				element.updateResult="";
			});
			console.log($scope.analyse_user_by_region.data);
		}
		catch(err)
		{
			console.error(err);
		}
	}
	$scope.analyseStatusOfRequests = async function() {
		$scope.analyse_status_of_requests.status="Pending";
		try{
			putState= await $http.get('/api/getData',{params:{type:'analyseStatusOfRequests', service_provider_id : '"' + $scope.curUser.uid + '"'}});
			console.log(putState);
			$scope.analyse_status_of_requests.data=putState.data.content;
			$scope.analyse_status_of_requests.status="OK";
			$scope.$digest();
			$scope.analyse_status_of_requests.data.forEach(element => {
				element.updateResult="";
			});
			console.log($scope.analyse_status_of_requests.data);
		}
		catch(err)
		{
			console.error(err);
		}
	}
	$scope.query={
		data:{},
		status:"Pending",
		newData:{}
	}
	$scope.toggleChat = function(uid)
	{
		if($scope.query.data[uid])
			$scope.query.data[uid].showChat= !$scope.query.data[uid].showChat;
	}
	$scope.sendMessage = async function(uid)
	{
		console.log(uid);
		if(!$scope.query.data[uid])
			return;
		if($scope.query.newData[uid]=="")
		{
			$('#toast_msg').text("Write Something");
			$('.toast').toast("show");
			return;
		}
		msgString=$scope.query.newData[uid];
		$scope.query.data[uid].unshift({
			pname:$scope.query.data[uid][0].pname,
			timestamp:"just now",
			query:$scope.query.newData[uid],
			side:"S"
		})
		$scope.query.newData[uid]="";
		reqBody={
			user:uid,
			provider:$scope.curUser.uid,
			msg:msgString,
			side:"S"
		}
		sendState=await $http.post('/api/insertquery',JSON.stringify(reqBody));
		console.log("message Sent");
	}
	$scope.getData=async function(tab)
	{
		if(tab==2)
		{
			$scope.query.data={};
			$scope.query.status="Pending";
			dataState = await $http.get("/api/getData",{params:{
				type:"allQueries",
				uid:".*",
				pid:$scope.curUser.uid
			}});
			console.log(dataState);
			if(dataState.data.content)
			{
				dataState.data.content.forEach(element => {
					if(!$scope.query.data[element.user_id])
						$scope.query.data[element.user_id]=[];
					$scope.query.data[element.user_id].push(element);
					$scope.query.data[element.user_id].showChat=false;
					$scope.query.newData[element.user_id]="";
				});
			}
			$scope.$digest();
			console.log($scope.query.data);
			$scope.query.status="OK";
		}
		else if(tab == 0)
		{
			console.log("sending");
			$scope.reqs.status="Pending";
			try{
				putState= await $http.get('/api/getData',{params:{type:'requestByProvider'}});
				console.log(putState);
				$scope.reqs.data=putState.data.content;
				$scope.reqs.status="OK";
				// $scope.$digest();
				$scope.reqs.data.forEach(element => {
					element.updateResult="";
				});
				console.log('Got Everything');
				console.log($scope.reqs);
				$scope.$digest();
			}
			catch(err)
			{
				console.error(err);
			}

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
					city:"\"%%\"",
					service_provider_id:"\""+$scope.curUser.uid+"\""
					}}).then(
					function(data, status, headers, config) {
					console.log(data.data);
					$scope.currentServices.data=data.data.content;
					$scope.currentServices.status="OK";
					$scope.currentServices.data.forEach(element => {
						element.updateResult="";
					});
					$scope.$digest();
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
					$scope.$digest();
				}
				catch(err) {
					console.log(err);
				  }
			}
			else if($scope.curUser.uid.startsWith("TRP"))
			{
				try{
					let res= await $http.get("/api/getData",{
						params:{
						type:'servicesByProvider',
						func:"getTrains",
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
					$scope.$digest();
				}
				catch(err) {
					console.log(err);
				  }
			}
			else if($scope.curUser.uid.startsWith("AIR"))
			{
				try{
					let res= await $http.get("/api/getData",{
						params:{
						type:'servicesByProvider',
						func:"getFlight",
						service_provider_id:$scope.curUser.uid
						}
					});
					$scope.currentServices.data=res.data.content;
					console.log($scope.currentServices.data);
					$scope.currentServices.status="OK";
					$scope.currentServices.data.forEach(async element => {
						element.updateResult="";
						element.routeData=[];
					});
					$scope.$digest();
				}
				catch(err) {
					console.log(err);
				  }
			}
			else if($scope.curUser.uid.startsWith("HOT"))
			{
				try{
					let res= await $http.get("/api/getData",{
						params:{
						type:'servicesByProvider',
						func:"getRoom",
						service_provider_id:$scope.curUser.uid
						}
					});
					$scope.currentServices.data=res.data.content;
					console.log($scope.currentServices.data);
					$scope.currentServices.status="OK";
					$scope.currentServices.data.forEach(async element => {
						element.updateResult="";
						element.routeData=[];
					});
					$scope.$digest();
				}
				catch(err) {
					console.log(err);
				  }
			}
			else if($scope.curUser.uid.startsWith("TAP"))
			{
				try{
					let res= await $http.get("/api/getData",{
						params:{
						type:'servicesByProvider',
						func:"getTaxi",
						service_provider_id:$scope.curUser.uid
						}
					});
					$scope.currentServices.data=res.data.content;
					console.log($scope.currentServices.data);
					$scope.currentServices.status="OK";
					$scope.currentServices.data.forEach(async element => {
						element.updateResult="";
						element.routeData=[];
					});
					$scope.$digest();
				}
				catch(err) {
					console.log(err);
				  }
			}
			else if($scope.curUser.uid.startsWith("GUP"))
			{
				try{
					let res= await $http.get("/api/getData",{
						params:{
						type:'servicesByProvider',
						func:"getGuide",
						service_provider_id:$scope.curUser.uid
						}
					});
					$scope.currentServices.data=res.data.content;
					console.log($scope.currentServices.data);
					$scope.currentServices.status="OK";
					$scope.currentServices.data.forEach(async element => {
						element.updateResult="";
						element.routeData=[];
					});
					$scope.$digest();
				}
				catch(err) {
					console.log(err);
				  }
			}
			
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
		// var form = $("#newModelFrom");
		// form.validate();
		// console.log($("#newModelFrom").hasClass("ng-invalid"));
		if($("#newModelFrom").hasClass("ng-invalid"))
		{
			console.log("showing toast")
			$('#toast_msg').text("Please Fill correct details");
			$('.toast').toast("show");
			return;
		}
		try{
			$scope.currentServices.createStatus="Sending";
			reqBody={};
			let flag=0;
			for(i in $scope.currentServices.model.newModel){
				it=$scope.currentServices.model.newModel[i];
				if(it.type==2)
				{
					let newLoc_ID= await $http.get("/api/getLocationID",{
						params:{
						city:$scope.currentServices.newData[it.value]
						}
					});
					console.log("finding city ID",$scope.currentServices.newData[it.value],newLoc_ID.data.content);
					// console.log(it.value);
					reqBody[it.value]='"'+newLoc_ID.data.content+'"';
					// console.log(reqBody);
				}
				else if(it.type==4)
				{
					flag=1;
				}
				else{
					reqBody[it.value]='"'+$scope.currentServices.newData[it.value]+'"';
				}
			}
			if(flag==1)
			{

				let newLoc_ID= await $http.get("/api/getLocationID",{
					params:{
					city:$scope.currentServices.newData.city
					}
				});
				let t_spot_id= await $http.get("/api/getTouristSpotID",{
					params:{
						name:$scope.currentServices.newData.Tname,
						type:$scope.currentServices.newData.type,
						city:$scope.currentServices.newData.city,
						location_id:newLoc_ID.data.content,
						entry_fee:$scope.currentServices.newData.entry_fee
					}
				});
				console.log('got tspot',t_spot_id);
				if(t_spot_id.data.content && newLoc_ID.data.content)
				{
					reqBody.tourist_spot_id='"'+t_spot_id.data.content+'"';
				}
				else{
					$('#toast_msg').text("Some error with Database");
					$('.toast').toast("show");
					return;
				}
			}
			console.log(reqBody);
			reqBody.type=$scope.currentServices.model.type;
			reqBody.prefix=$scope.currentServices.model.prefix;
			reqBody.service_provider_id='"'+$scope.curUser.uid+'"';
			console.log(reqBody);

			addServiceResult=await $http.post('/api/addService',JSON.stringify(reqBody));
			if(!addServiceResult.data.content)
			{
				$('#toast_msg').text("Some error with Database");
				$('.toast').toast("show");
				return;
			}
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
				// console.log(addServiceResult.data);
			}
			$('#toast_msg').text("Service Added Successfuly");
			$('.toast').toast("show");
			$scope.currentServices.createStatus="Added New Service";
			$scope.changeTab($scope.tab);
			$scope.currentServices.showNew=false;
		}
		catch(err)
		{

		}
	}
	$scope.updateService=async function(it,index)
	{
		console.log("#editForm_"+index.toString());
		console.log($("#editForm_"+index.toString()).hasClass("ng-invalid"));
		if($("#editForm_"+index.toString()).hasClass("ng-invalid"))
		{
			console.log("showing toast")
			$('#toast_msg').text("Please Fill correct details");
			$('.toast').toast("show");
			return;
		}
		try{
			it.updateResult="Sending";
			reqBody=[];
			let flag=0;
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
				else if($scope.currentServices.model.editable[i].type==3)
				{
					newTime = it[$scope.currentServices.model.editable[i].value];
					console.log(newTime);
					reqBody.push({
						table_name:$scope.currentServices.model.editable[i].table,
						column_name:$scope.currentServices.model.editable[i].column,
						newValue:newTime,
						whereColumn:$scope.currentServices.model.editable[i].searchKey,
						whereValue:it[$scope.currentServices.model.editable[i].searchValue]
					});
				}
				else if($scope.currentServices.model.editable[i].type==4)
				{
					flag=1;
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
			if(flag==1)
			{
				try{
					let newLoc_ID= await $http.get("/api/getLocationID",{
						params:{
						city:it.city
						}
					});
					let t_spot_id= await $http.get("/api/getTouristSpotID",{
						params:{
							name:it.name,
							type:it.type,
							city:it.city,
							location_id:newLoc_ID.data.content,
							entry_fee:it.entry_fee
						}
					});
					console.log('got tspot',t_spot_id);
					if(t_spot_id.data.content && newLoc_ID.data.content)
					{
						reqBody.push({
							table_name:'guide',
							column_name:"tourist_spot_id",
							newValue:t_spot_id.data.content,
							whereColumn:"service_id",
							whereValue:it.service_id
						});
					}
				}
				catch(err)
				{
					console.error(err);
				}

			}
			updateState=await $http.put('/api/updateList',JSON.stringify(reqBody));
			if($scope.currentServices.model.route==true)
			{
				console.log("sending Delet");
				// deleteState=await $http.post('/api/deleteData',JSON.stringify({
				// 	type:'route',
				// 	service_id:it[$scope.currentServices.model.globalID.searchKey]
				// }));
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
				console.log(it[$scope.currentServices.model.globalID.searchKey]);
				insertState=await $http.post('/api/insertList',JSON.stringify({
					type:'route',
					service_id:it[$scope.currentServices.model.globalID.searchKey],
					arr:insertData
				}));
				console.log("Complete");
			}
			response=updateState.data;
			it.updateResult="Data updated";
			$scope.$digest();
			console.log("updated Data",response);
		}
		catch(err)
		{
			it.updateResult="Data Not updated";
			console.log(err);
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
						value:"name",
						pattern:"^.*$"
					},
					{
						type:1,
						name:"Cuisine",
						value:"cuisine"
					},
					{
						type:0,
						name:"Price",
						value:"price",
						pattern:"^[0-9.]+$"
					},
					{
						type:0,
						name:"Discount",
						value:"discount",
						pattern:"^[0-9.]+$"
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
						type:0,
						pattern:"^.*$"
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
						type:0,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Discount",
						value:"discount",
						column:"discount",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
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
						type:0,
						pattern:"^(?:Y|N){7}$"
					},
					{
						name:"AC(Y/N)",
						value:"AC",
						type:0,
						pattern:"^(?:Y|N)$"
					},
					{
						name:"Price",
						value:"price",
						type:0,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Discount",
						value:"discount",
						type:0,
						pattern:"^[0-9.]+$"
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
						type:0,
						pattern:"^(?:Y|N){7}$"
					},
					{
						name:"AC(Y/N)",
						value:"AC",
						column:"AC",
						table:"bus",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^(?:Y|N)$"
					},
					{
						name:"Price",
						value:"price",
						column:"price",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Discount",
						value:"discount",
						column:"discount",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
				],
				globalID:{
					table:"bus",
					searchKey:"service_id",
					searchValue:"service_id"
				} 
			};
		}
		else if($scope.curUser.uid.startsWith("TRP")){
			$scope.currentServices.model={
				type:'train',
				prefix:"TRA",
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
						type:0,
						pattern:"^(?:Y|N){7}$"
					},
					{
						name:"AC(Y/N)",
						value:"AC",
						type:0,
						pattern:"^(?:Y|N)$"
					},
					{
						name:"Price",
						value:"price",
						type:0,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Discount",
						value:"discount",
						type:0,
						pattern:"^[0-9.]+$"
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
						table:"train",
						searchKey:"service_id",
						searchValue:"service_id",
						type:2
					},
					{
						name:"To",
						value:"to_location_id",
						display:"to_location_id_v",
						column:"to_location_id",
						table:"train",
						searchKey:"service_id",
						searchValue:"service_id",
						type:2
					},
					{
						name:"Active Days",
						value:"active_days",
						column:"active_days",
						table:"train",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^(?:Y|N){7}$"
					},
					{
						name:"AC(Y/N)",
						value:"AC",
						column:"AC",
						table:"train",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^(?:Y|N)$"
					},
					{
						name:"Price",
						value:"price",
						column:"price",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Discount",
						value:"discount",
						column:"discount",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
				],
				globalID:{
					table:"train",
					searchKey:"service_id",
					searchValue:"service_id"
				} 
			};
		}
		else if($scope.curUser.uid.startsWith("AIR")){
			$scope.currentServices.model={
				type:"airline",
				prefix:"FLI",
				route:false,
				newModel:[
					{
						type:0,
						name:"From",
						value:"from_city",
						pattern:"^.*$"
					},
					{
						type:0,
						name:"To",
						value:"to_city",
						pattern:"^.*$"
					},
					{
						name:"Departure",
						value:"departure_time",
						type:3
					},
					{
						name:"Arrival",
						value:"arrival_time",
						type:3
					},
					{
						type:0,
						name:"Price",
						value:"price",
						pattern:"^[0-9.]*$"
					},
					{
						type:0,
						name:"Discount",
						value:"discount",
						pattern:"^[0-9.]*$"
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
						name:"From",
						value:"from_city",
						column:"from_city",
						table:"flight",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^.*$"
					},
					{
						name:"To",
						value:"to_city",
						column:"to_city",
						table:"flight",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^.*$"
					},
					{
						name:"Departure",
						value:"departure_time",
						column:"departure_time",
						table:"flight",
						searchKey:"service_id",
						searchValue:"service_id",
						type:3
					},
					{
						name:"Arrival",
						value:"arrival_time",
						column:"arrival_time",
						table:"flight",
						searchKey:"service_id",
						searchValue:"service_id",
						type:3
					},
					{
						name:"Price",
						value:"price",
						column:"price",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Discount",
						value:"discount",
						column:"discount",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
				],
				globalID:{
					table:"food_item",
					searchKey:"service",
					searchValue:"service_id"
				} 
			};
		}
		else if($scope.curUser.uid.startsWith("HOT")){
			$scope.currentServices.model={
				type:"hotel",
				prefix:"ROO",
				route:false,
				newModel:[
					{
						name:"RoomType",
						value:"room_type",
						type:1
					},
					{
						name:"Capacity",
						value:"capacity",
						type:0,
						pattern:"^[0-9]+$"
					},
					{
						type:0,
						name:"Price",
						value:"price",
						pattern:"^[0-9.]+$"
					},
					{
						type:0,
						name:"Discount",
						value:"discount",
						pattern:"^[0-9.]+$"
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
						name:"RoomType",
						value:"room_type",
						column:"room_type",
						table:"room",
						searchKey:"service_id",
						searchValue:"service_id",
						type:1
					},
					{
						name:"Capacity",
						value:"capacity",
						column:"capacity",
						table:"room",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9]+$"
					},
					{
						name:"Price",
						value:"price",
						column:"price",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Discount",
						value:"discount",
						column:"discount",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
				],
				globalID:{
					table:"room",
					searchKey:"service_id",
					searchValue:"service_id"
				} 
			};
		}
		else if($scope.curUser.uid.startsWith("TAP")){
			$scope.currentServices.model={
				type:"taxi",
				prefix:"TAX",
				route:false,
				newModel:[
					{
						name:"Car Name",
						value:"car_name",
						type:0,
						pattern:"^.*$"
					},
					{
						name:"Capacity",
						value:"capacity",
						type:0,
						pattern:"^[0-9]+$"
					},
					{
						name:"AC",
						value:"AC",
						type:0,
						pattern:"^(?:Y|N)$"
					},
					{
						type:0,
						name:"Price",
						value:"price",
						pattern:"^[0-9.]+$"
					},
					{
						type:0,
						name:"Discount",
						value:"discount",
						pattern:"^[0-9.]+$"
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
						name:"Car Name",
						value:"car_name",
						column:"car_name",
						table:"taxi",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^.*$"
					},
					{
						name:"Capacity",
						value:"capacity",
						column:"capacity",
						table:"taxi",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9]+$"
					},
					{
						name:"AC",
						value:"AC",
						column:"AC",
						table:"taxi",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^(?:Y|N)$"
					},
					{
						name:"Price",
						value:"price",
						column:"price",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Discount",
						value:"discount",
						column:"discount",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
				],
				globalID:{
					table:"taxi",
					searchKey:"service_id",
					searchValue:"service_id"
				} 
			};
		}
		else if($scope.curUser.uid.startsWith("GUP")){
			$scope.currentServices.model={
				isGuide:true,
				type:"guide",
				prefix:"GUI",
				route:false,
				newModel:[
					{
						name:"Guide Name",
						value:"name",
						type:0,
						pattern:".*$"
					},
					{
						name:"Tourist Spot",
						value:"Tname",
						type:4
					},
					{
						name:"Spot Type",
						value:"type",
						type:4
					},
					{
						name:"Entry Fee",
						value:"entry_fee",
						type:4,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Location City",
						value:"city",
						type:4
					},
					{
						name:"Price",
						value:"price",
						type:0,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Discount",
						value:"discount",
						type:0,
						pattern:"^[0-9.]+$"
					},
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
						name:"Guide Name",
						value:"gname",
						column:"name",
						table:"guide",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^.*$"
					},
					{
						name:"Tourist Spot",
						value:"name",
						column:"name",
						display:"name",
						table:"tourist_spot",
						searchKey:"tourist_spot_id",
						searchValue:"tourist_spot_id",
						type:4
					},
					{
						name:"Spot Type",
						value:"type",
						column:"type",
						display:"type",
						table:"tourist_spot",
						searchKey:"tourist_spot_id",
						searchValue:"tourist_spot_id",
						type:4
					},
					{
						name:"Entry Fee",
						value:"entry_fee",
						column:"entry_fee",
						display:"entry_fee",
						table:"tourist_spot",
						searchKey:"tourist_spot_id",
						searchValue:"tourist_spot_id",
						type:4
					},
					{
						name:"Location City",
						value:"location_id",
						display:"city",
						column:"location_id",
						table:"tourist_spot",
						searchKey:"tourist_spot_id",
						searchValue:"tourist_spot_id",
						type:4
					},
					{
						name:"Price",
						value:"price",
						column:"price",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
					{
						name:"Discount",
						value:"discount",
						column:"discount",
						table:"service",
						searchKey:"service_id",
						searchValue:"service_id",
						type:0,
						pattern:"^[0-9.]+$"
					},
				],
				globalID:{
					table:"guide",
					searchKey:"service_id",
					searchValue:"service_id"
				} 
			};
		}
		else{
			$scope.currentServices.model={};
		}

		console.log($scope.currentServices.model);
	}
	$scope.initModel();
	$scope.changeTab(0);
	// $scope.$digest();
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