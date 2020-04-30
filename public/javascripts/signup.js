var	angularApp = angular.module("dash", []);
angularApp.controller("ngContent",function($scope,$http)
{
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
    $scope.predictors.bindArray("roles",[
    "Admin","Service providers communications","Statistician",
    "Official Paperwork","User Information handling","Suggestions Implementation",
    "Respondent for user queries","Verification of guides","Tourist Spots Verification",
    "Editor"])
    // $scope.predictors.bindInput("locs","location","city");
    console.log("init Done");
});
var opt=0;
var provider=0;
var formsObj=[]
function updateProvider()
{
    wifi=document.getElementById('wifihid');
    delivery=document.getElementById('delhid');
    cuisine=document.getElementById('cuisine');
    loc=document.getElementById('slochid');
    if(provider==0)
    {
        wifi.style.display="block";
        delivery.style.display="none";
        cuisine.style.display="none";
        loc.style.display="block";
    }
    else if(provider==1)
    {
        wifi.style.display="none";
        delivery.style.display="block";
        cuisine.style.display="flex";
        loc.style.display="block";
    }
    else{
        wifi.style.display="none";
        delivery.style.display="none";
        cuisine.style.display="none";
        loc.style.display="none";
    }
}
function updateForm()
{
	for(var i=0;i<2;i++)
	{
		if(i!=opt){
		formsObj[i].style.display="none";
		}
		else{
		formsObj[i].style.display="block";
		}	
    }
    if(opt!=1)
        {
            wifi=document.getElementById('wifihid');
            delivery=document.getElementById('delhid');
            cuisine=document.getElementById('cuisine');
            loc=document.getElementById('slochid');
            wifi.style.display="none";
            delivery.style.display="none";
            cuisine.style.display="none";
            loc.style.display="none";
        }
    updateProvider();
}
function onStart()
{
    console.log("ag");
    formsObj.push(document.getElementById("ProviderForm"));
    formsObj.push(document.getElementById("UserForm"));
    console.log("ag")
    formElements=document.getElementsByClassName('needs-validation');
    Array.prototype.forEach.call(formElements, function(iter) {
        iter.addEventListener('submit', function(event) {
            if (iter.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            iter.className='was-validated';
          }, false);
    });
}
function selectOpt(selection)
{
    opt=selection.selectedIndex;
    updateForm();
    // console.log("updated "+selection);
}
function selectProvider(selection)
{
    provider=selection.selectedIndex;
    updateProvider();
    console.log("updated "+selection);
}

