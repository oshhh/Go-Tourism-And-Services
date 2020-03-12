document.addEventListener('DOMContentLoaded', function() {

	var suite = new Benchmark.Suite();

	var data = {
		listing: [
			{name: 'Test I', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sed aliquet elit, nec adipiscing lectus. Pellentesque consectetur nunc eget massa luctus, quis vulputate nulla convallis. Maecenas sodales quam eget blandit faucibus. Duis tristique metus quis risus aliquam, eget aliquam erat posuere. Cras aliquet lectus enim, id cursus arcu sagittis nec. Cras pretium dignissim orci, sed tincidunt nisi eleifend nec. Pellentesque vestibulum vestibulum rutrum. Aliquam erat volutpat. Donec blandit vitae nibh ut adipiscing. Nam ut mi augue. Mauris molestie ultrices felis, non suscipit sapien convallis non. Etiam lobortis id mi ac rhoncus. Duis hendrerit libero et ornare pharetra.'},
			{name: 'Test II', description: 'Aliquam ut ligula vel sapien tincidunt posuere. Etiam facilisis quam nunc, vitae pharetra nisi faucibus et. Maecenas lectus metus, congue sodales lacus semper, dictum faucibus tortor. Quisque volutpat rhoncus risus ut placerat. In consectetur, mi sit amet porttitor hendrerit, lectus lectus volutpat lorem, sit amet tincidunt ligula lectus non magna. Vestibulum arcu purus, gravida vel dignissim a, suscipit et mi. Nam facilisis odio nec eros venenatis iaculis. Aliquam sed massa turpis.'},
			{name: 'Test III', description: 'Aenean non eros a tellus aliquam aliquet et non magna. Pellentesque sapien massa, convallis non nunc vitae, sodales tristique elit. Duis at convallis risus. Duis in diam sit amet mauris vehicula imperdiet sed sed diam. Curabitur laoreet suscipit felis. Donec sodales sagittis nisl, non accumsan ipsum. Morbi a urna et tortor elementum placerat nec quis purus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc cursus massa mi, ut fringilla nisi congue eu. Sed commodo adipiscing mi ac gravida. Nullam libero diam, aliquet at lectus nec, sagittis elementum purus.'},
			{name: 'Test IV', description: 'Cras sollicitudin fermentum augue, non blandit erat. Vivamus vitae erat nec ipsum venenatis mattis. Pellentesque interdum non nulla a auctor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam eu varius arcu. Phasellus sit amet aliquam massa, adipiscing interdum metus. Donec pellentesque lectus magna, vel rutrum velit blandit eget. In feugiat dolor eget scelerisque fermentum. Donec bibendum diam eu convallis semper. Suspendisse gravida semper arcu a euismod. Curabitur placerat imperdiet interdum. Donec dignissim eu purus sit amet varius. Nullam ultrices ipsum id dui consectetur, non feugiat lacus accumsan.'},
			{name: 'Test V', description: 'Nullam dictum lectus a eleifend porttitor. Nunc rhoncus in tortor ut iaculis. Donec eu enim ut ligula posuere eleifend eu et leo. Etiam in augue fermentum, rhoncus leo a, rhoncus dolor. Suspendisse dapibus, risus ut tincidunt vestibulum, augue nibh sodales elit, et tempor nibh est sed lectus. Quisque in lacus at ipsum dictum porta quis id quam. Fusce porta pulvinar odio, ac imperdiet libero sollicitudin sed. Suspendisse egestas ante vitae justo dictum euismod. In vulputate justo posuere iaculis dignissim.'}
		]
	};

	var fireTplTemplate = 'div class=example' +
		'	h1\n' +
		'		$title\n' +
		'	div class=description\n' +
		'		$description\n' +
		'	ul\n' +
		'		each $listing\n' +
		'			li\n' +
		'				$name';

	var HandlebarsTemplate = '<div class="example">' +
		'	<h1>{{title}}</h1>' +
		'	<div class="description">{{description}}</div>' +
		'	<ul>' +
		'		{{#each listing}}' +
		'			<li>{{$name}}</li>' +
		'		{{/each}}' +
		'	</ul>' +
		'</div>';

	var fireTplPrecompiled = (function() {return function(data) {var s='';var h=FireTPL.helpers;s+='<div class="example"><h1>'+data.title+'</h1><div class="description">'+data.description+'</div><ul class="xq-scope xq-scope001">';s+=h.each(data.listing,function(data){var s='';s+='<li>'+data.name+'</li>';return s;});s+='</ul></div>';return s;};})();

	var HandlebarsPrecompiled = (function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['in'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                 <li>";
  if (helper = helpers.$name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.$name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n          ";
  return buffer;
  }

  buffer += "<div class=\"example\">\n  <h1>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n  <div class=\"description\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n <ul>\n          ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.listing), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n </ul>\n</div>";
  return buffer;
  });
return templates['in'];
})();


	document.getElementById('start').onclick = function() {
		// add tests
		var suiteOne = function() {
			suite.add('Precompile FireTPL', function() {
				FireTPL.precompile(fireTplTemplate);
			})
			.add('Precompile Handlebars', function() {
				Handlebars.precompile(HandlebarsTemplate);
			})
			// add listeners
			.on('cycle', function(event) {
				document.getElementById('result').innerHTML += '<br>' + String(event.target);
			})
			.on('complete', function() {
				document.getElementById('result').innerHTML += '<br>Fastest is ' + this.filter('fastest').pluck('name');
				suiteTwo();
			})
			// run async
			.run({ 'async': true });
			document.getElementById('result').innerHTML += 'Running ...';
		};

		var suiteTwo = function() {
			//Compile templates

			var suite2 = new Benchmark.Suite();
			suite2.add('Compile FireTPL', function() {
				var template = FireTPL.compile(fireTplTemplate);
				var html = template(data);
			})
			.add('Compile Handlebars', function() {
				var template = Handlebars.compile(HandlebarsTemplate);
				var html = template(data);
			})
			// add listeners
			.on('cycle', function(event) {
				document.getElementById('result2').innerHTML += '<br>' + String(event.target);
			})
			.on('complete', function() {
				document.getElementById('result2').innerHTML += '<br>Fastest is ' + this.filter('fastest').pluck('name');
				suiteThree();
			})
			// run async
			.run({ 'async': true });
			document.getElementById('result2').innerHTML += 'Running ...';
		};

		var suiteThree = function() {
			//Execute precompiled templates

			var suite3 = new Benchmark.Suite(),
				htmlF,
				htmlH;
			
			suite3.add('Execute FireTPL', function() {
				htmlF = fireTplPrecompiled(data);
			})
			.add('Execute Handlebars', function() {
				htmlH = HandlebarsPrecompiled(data);
			})
			// add listeners
			.on('cycle', function(event) {
				document.getElementById('result3').innerHTML += '<br>' + String(event.target);
			})
			.on('complete', function() {
				document.getElementById('result3').innerHTML += '<br>Fastest is ' + this.filter('fastest').pluck('name');
			console.log('HTMLF', htmlF);
			console.log('HTMLH', htmlH);
			})
			// run async
			.run({ 'async': true });
			document.getElementById('result3').innerHTML += 'Running ...';

		};

		suiteOne();
	};


});