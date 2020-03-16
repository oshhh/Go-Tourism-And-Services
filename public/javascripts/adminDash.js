var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope)
{
	$scope.tab=0;
	$scope.a={};
	$scope.a.data=[];
	$scope.a.aName="";
	$scope.a.aRole="";
	$scope.a.aMail="";
	$scope.a.status="Pending";
	$scope.a.updateRecord=function(it)
	{
		// alert(it.service_id);
		//update records access modified details by it.service_id/name/role/mail
		//Toast on successfull update
	}
	$scope.a.deleteRecord=function(it)
	{
		// alert(it.service_id);
		//delete record by primary key it.service_id
		//Toast on successfull delete
	}
	$scope.a.view=function(it)
	{

	}
	$scope.getData=function(tab)
	{
		if(tab==1)
		{
			console.log("reached");
			$scope.a.status="Pending";
			$scope.a.data=[
				{
					service_id:"ADM00001",
					name:"name1",
					role:"help",
					mail:"asb@nsw.com"
				},
				{
					service_id:"ADM00002",
					name:"name1",
					role:"help",
					mail:"asb@nsw.com"
				},
				{
					service_id:"ADM00003",
					name:"name1",
					role:"help",
					mail:"asb@nsw.com"
				}];

			$scope.a.data.forEach(element => {
				element.editMode=false;
			});
			$scope.a.status="OK";
		}
		else{

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