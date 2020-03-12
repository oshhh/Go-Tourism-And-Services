var fs = require('fs');

var LocalePrecompiler = require('../localePrecompiler'),
	FireTPL = require('../../firetpl');

describe('LocalePrecompiler', function() {
	'use strict';
	
	describe('instance', function() {
		var compiler;

		beforeEach(function() {
			compiler = new LocalePrecompiler();
		});

		afterEach(function() {

		});

		it('Shoud be an instance of LocalePrecompiler', function() {
			expect(LocalePrecompiler).to.be.a('function');

			expect(compiler).to.be.an('object');
			expect(compiler).to.be.a(LocalePrecompiler);
		});
	});

	describe('compile', function() {
		var compiler,
			fsExistsStub,
			globStub,
			readFileStub;

		beforeEach(function() {
			compiler = new LocalePrecompiler();
			fsExistsStub = sinon.stub(fs, 'existsSync');
			globStub = sinon.stub(compiler,'glob');
			readFileStub = sinon.stub(compiler, 'readFile');
			
		});

		afterEach(function() {
			fsExistsStub.restore();
			globStub.restore();
			readFileStub.restore();
		});
		
		it('Should compile a locale folder', function() {
			fsExistsStub.returns(true);
			globStub.returns(['./locale/de-DE.json', './locale/en-US.json']);
			readFileStub.onFirstCall().returns({'greeding':'Hello World', 'char': 'a'});
			readFileStub.onSecondCall().returns({'greeding':'Hallo Welt', 'letter': 'b'});

			compiler.defaultLocale = 'en-US';
			var locales = compiler.parseFolder('test');

			expect(readFileStub).to.be.calledTwice();
			expect(readFileStub).to.be.calledWith('./locale/en-US.json');
			expect(readFileStub).to.be.calledWith('./locale/de-DE.json');
			
			expect(locales).to.eql({
				'en-US': {'greeding': 'Hello World', 'char': 'a'},
				'de-DE': {'greeding': 'Hallo Welt', 'char': 'a', 'letter': 'b'}
			});

		});
		
		it('Should compile a locale folder with .fire templates', function() {
			fsExistsStub.returns(true);
			globStub.returns(['./locale/de-DE.json', './locale/en-US.json', './locale/txt/test/content.en-US.fire']);
			readFileStub.onFirstCall().returns({'greeding':'Hello World', 'char': 'a'});
			readFileStub.onSecondCall().returns({'greeding':'Hallo Welt', 'letter': 'b'});
			readFileStub.onThirdCall().returns({txt: {test: { content: '<h1>Long text</h1><div>A very long text with a touch of html</div>'}}});

			compiler.defaultLocale = 'en-US';
			var locales = compiler.parseFolder('test');
			expect(readFileStub).to.be.calledThrice();
			expect(readFileStub).to.be.calledWith('./locale/en-US.json');
			expect(readFileStub).to.be.calledWith('./locale/de-DE.json');
			expect(readFileStub).to.be.calledWith('./locale/txt/test/content.en-US.fire');
			
			expect(locales).to.eql({
				'en-US': {'greeding': 'Hello World', 'char': 'a', txt: {test: { content: '<h1>Long text</h1><div>A very long text with a touch of html</div>'}}},
				'de-DE': {'greeding': 'Hallo Welt', 'char': 'a', 'letter': 'b', txt: {test: { content: '<h1>Long text</h1><div>A very long text with a touch of html</div>'}}}
			});
		});
	});

	describe('readFile', function() {
		var compiler;

		beforeEach(function() {
			compiler = new LocalePrecompiler();
			compiler.baseDir = 'locale';
		});

		it('Should read and parse a .fire file', function() {
			var readFileStub = sinon.stub(fs, 'readFileSync');
			readFileStub.returns('h1 "Long text"\n\tdiv "A verry long text with a touch of html"');

			var fire2htmlStub = sinon.stub(FireTPL, 'fire2html');
			fire2htmlStub.returns('<h1>Long text</h1><div>A very long text with a touch of html</div>');


			var out = compiler.readFile('./txt/test/content.en-US.fire');
			expect(out).to.eql({
				txt: {
					test: {
						content: '<h1>Long text</h1><div>A very long text with a touch of html</div>'
					}
				}
			});

			readFileStub.restore();
			fire2htmlStub.restore();
		});
	});
});