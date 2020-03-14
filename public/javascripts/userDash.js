var tab=0;
var contentArea;
var contentLabel;
var content_tabs=[];
var labels=["Bookings","Tra","All Hotels","All Food Items","Gui/tour"];
function onStart()
{
	tab=0;
	contentArea=document.getElementById("content");
	// contentLabel=document.getElementById("content_label");
	content_tabs.push(document.getElementById("content_tab0"));
	content_tabs.push(document.getElementById("content_tab1"));
	content_tabs.push(document.getElementById("content_tab2"));
	content_tabs.push(document.getElementById("content_tab3"));
	content_tabs.push(document.getElementById("content_tab4"));
	bs(0);
	fillContent();
}
function bs(current)
{
	master=document.getElementById('togs')
	all=master.getElementsByClassName("i_bar")
	for(var i=0;i<all.length;i++)
	{
		if(i!=current){
		all[i].id="none"
		content_tabs[i].style.display="none";
		}
		else{
		all[i].id="act"
		content_tabs[i].style.display="block";
		}	
	}
	tab=current;
	fillContent();
}
function fillContent()
{	
	// contentLabel.innerHTML=labels[tab];
	// content_tabs[tab].innerHTML="HAHA"+tab;
	//Hotel Content
	if(tab==3)
	{
		var fnameFilters=document.getElementById("fname").value;
		var rnameFilters=document.getElementById("rname").value;
		//dfilter = 0/1/2
		var dFilter=document.getElementById("fdelivery").value;
		//use filter to get queryResult
		queryResult=[
			{
				service_id:"FOO00001",
				name:"Food1",
				cuisine:"BUDBDUBDU",
				res_name:"Meisfn",
				locality:"neslo",
				city:"groxmi",
				delivery:"Y"
			},
			{
				service_id:"FOO00002",
				name:"Food2",
				cuisine:"NSHDSU",
				res_name:"Mef",
				locality:"nessaga",
				city:"groxag",
				delivery:"N"
			},
			{
				service_id:"FOO00003",
				name:"Food3",
				cuisine:"NSHasDSU",
				res_name:"Mef",
				locality:"nessaga",
				city:"groxag",
				delivery:"N"
			}
		];
		var attribs=['name','cuisine','res_name','locality','city','delivery'];
		//remove existing Rows tr Elemens
		tableElement=document.getElementById("table2");
		for (let i=tableElement.childNodes.length-1;i>=0;i--) {
			tableElement.removeChild(tableElement.childNodes[i]);
		 }
		 //Add Rows
		for(let i=0;i<queryResult.length;i++)
		{
			let trElement=document.createElement("tr");
			let numElement=document.createElement("th");
			numElement.scope="row";
			numElement.innerText=i+1;
			trElement.appendChild(numElement);
			attribs.forEach(element => {
				let newElement=document.createElement("td");
				newElement.innerText=queryResult[i][element];
				trElement.appendChild(newElement);
			});
			let bookTd=document.createElement("td");
			let bookButton=document.createElement("Button");
			bookButton.className="btn btn-outline-primary";
			bookButton.textContent="Request";
			bookButton.addEventListener("click", function(){
				alert("booked service: "+queryResult[i].service_id);
			  });
			bookTd.appendChild(bookButton);
			trElement.appendChild(bookTd);
			tableElement.appendChild(trElement);
		}
	}
	//Add other domains and Booking status
	else{

	}
}