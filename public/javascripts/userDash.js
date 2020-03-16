var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope)
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
			$scope.f.reviews[it.service_id].data=[
				{
					user:"abc1",
					timeStamp:"02-08-2015 at 22:10",
					body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Feugiat pretium nibh ipsum consequat nisl vel pretium. Urna cursus eget nunc scelerisque viverra mauris in.",
					rating:"4.6"
				},
				{
					user:"abc2",
					timeStamp:"On 02-08-2017 at 22:10",
					body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Feugiat pretium nibh ipsum consequat nisl vel pretium. Urna cursus eget nunc scelerisque viverra mauris in.",
					rating:"3.8"
				},
				{
					user:"abc3",
					timeStamp:"On 02-08-2016 at 22:10",
					body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Feugiat pretium nibh ipsum consequat nisl vel pretium. Urna cursus eget nunc scelerisque viverra mauris in.",
					rating:"4.1"
				}
			];
			//Turn status OK to replace loading text with comments
			$scope.f.reviews[it.service_id].status="OK";
			it.showRev=true;
		}
		else{
			it.showRev=false;
		}

	}

	$scope.getData=function(tab)
	{
		if(tab==3)
		{
			$scope.f.status="Pending";
			//Use $scope.f to get filters and fill $scope.f.data
			$scope.f.data=[
			{
				service_id:"FOO00001",
				name:"Food1",
				cuisine:"BUDBDUBDU",
				res_name:"Res name",
				locality:"locality",
				city:"city",
				delivery:"Y",
				price:550,
				discount:0,
				rating:3.9
			},
			{
				service_id:"FOO00002",
				name:"Food2",
				cuisine:"NSHDSU",
				res_name:"Res name",
				locality:"locality",
				city:"city",
				delivery:"N",
				price:150,
				discount:20,
				rating:4.1
			},
			{
				service_id:"FOO00003",
				name:"Food3",
				cuisine:"Description of Item",
				res_name:"Res name",
				locality:"locality",
				city:"city",
				delivery:"N",
				price:200,
				discount:15,
				rating:4.5
			}];
			$scope.f.data.forEach(element => {
				element.showRev=false;
			});
			$scope.f.status="OK";
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
var labels=["Bookings","Tra","All Hotels","All Food Items","Gui/tour"];
function onStart()
{

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