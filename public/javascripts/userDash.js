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
			}
		];
		var attribs=['name','cuisine','res_name','locality','city','delivery','price','discount'];
		//remove existing Rows tr Elemens
		tableElement=document.getElementById("table2");
		for (let i=tableElement.childNodes.length-1;i>=0;i--) {
			tableElement.removeChild(tableElement.childNodes[i]);
		 }
		 //Add Rows
		for(let i=0;i<queryResult.length;i++)
		{
			// console.log("adding "+i);
			let outerCard=document.createElement("div");
			outerCard.className="rowElement card shadow p-4 mb-4 bg-white";
			
			let headerCard=document.createElement("div");
			headerCard.className="card-header text-center bg-white align-middle";
			headerCard.innerText="Restaurant: "+queryResult[i].res_name+","+queryResult[i].locality+","+queryResult[i].city;

			let bodyCard=document.createElement("div");
			bodyCard.className="card-body text-center d-flex flex-row justify-content-between align-middle";
			let nameCard=document.createElement("div");
			nameCard.className="cardText card-text";
			nameCard.innerHTML=queryResult[i].name+"<br>Delivery Available: "+((queryResult[i].delivery=="Y")?("Yes"):("No"));
			let middleCard=document.createElement("div");
			middleCard.className="cardText card-text";
			middleCard.innerHTML="Discount: "+queryResult[i].discount+"%<br> Description: "+ queryResult[i].cuisine;
			let bookButton=document.createElement("Button");
			bookButton.className="btn btn-outline-primary";
			bookButton.textContent="Request ("+queryResult[i].price+" Rs)";
			bookButton.addEventListener("click", function(){
				alert("booked service: "+queryResult[i].service_id);
			  });

			bodyCard.appendChild(nameCard);
			bodyCard.appendChild(middleCard);
			bodyCard.appendChild(bookButton);

			footerCard=document.createElement("div");
			footerCard.className="card-footer text-center d-flex flex-row justify-content-between align-middle bg-white align-middle";
			ratingCard=document.createElement("div");
			ratingCard.className="cardText card-text";
			ratingCard.innerText="Rating: "+queryResult[i].rating+"/5";
			let reviewButton=document.createElement("Button");
			reviewButton.className="btn btn-outline-primary";
			reviewButton.textContent="View Reviews";
			reviewButton.addEventListener("click", function(){
				alert("Open popUp Reviews for "+queryResult[i].service_id);
			  });
			footerCard.appendChild(ratingCard);
			footerCard.appendChild(reviewButton);

			outerCard.appendChild(headerCard);
			outerCard.appendChild(bodyCard);
			outerCard.appendChild(footerCard);
			tableElement.appendChild(outerCard);
		}
		
	}
	//Add other domains and Booking status
	else{

	}
}