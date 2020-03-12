document.addEventListener('DOMContentLoaded', function() {

	//Load template
	var listingTmpl = FireTPL.loadFile('./views/listing.fire');

	//Compile template
	listingTmpl = FireTPL.compile(listingTmpl);

	//Template data
	var data = {
		title: 'List of Fruits',
		description: 'Fruits are delicious and good for your health!',
		listing: [
			{name: 'Aple'},
			{name: 'Banana'},
			{name: 'Coconut'},
			{name: 'Dragon fruit'}
		]
	};

	//Insert into the DOM
	document.getElementsByTagName('body')[0].innerHTML = listingTmpl(data);

}, false);