var tab=0;
var contentArea;
var content0;
var content1;
// var content3;
function onStart()
{
	contentArea=document.getElementById("content");
	content0=document.getElementById("content0");
	content1=document.getElementById("content1");
	tab=0;
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
	tab=current;
	fillContent(current);
}
function fillContent(type)
{
	if(type==1)
	{
		content0.style.display="block";
		content1.style.display="none";
	}
	else{
		content0.style.display="none";
		content1.style.display="block";
	}
}