var opt=0;
var provider=0;
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
    master=document.getElementById('FormGroup');
	all=master.getElementsByClassName("forms");
	for(var i=0;i<all.length;i++)
	{
		if(i!=opt){
		all[i].style.display="none";
		}
		else{
		all[i].style.display="block";
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

