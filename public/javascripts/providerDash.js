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
	$scope.changeStatus=function(it)
	{
		it.updateResult="Sending";
		$http.post('/data/updateData',JSON.stringify({
			table_name:"service_request",
			column_name:"status",
			newValue:it.status,
			whereColumn:"request_id",
			whereValue:it.request_id
		}))
		.then(function(response){
			if(response.data.content.affectedRows==0)
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
		$http.post('/data/updateData',JSON.stringify({
			table_name:"service_request",
			column_name:"user_rating",
			newValue:it.user_rating,
			whereColumn:"request_id",
			whereValue:it.request_id
		}))
		.then(function(response){
			if(response.data.content.affectedRows==0)
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
			$scope.putData('/data/getData',{type:'service_request'},$scope.reqs,function(){
				$scope.reqs.data.forEach(element => {
					element.updateResult="";
				});
				console.log('Got Everything');
				console.log($scope.reqs);
			})
		}
		else if(tab==1)
		{

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
	$scope.changeTab(0);
	console.log("init Done");
	console.log($scope.tab);
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