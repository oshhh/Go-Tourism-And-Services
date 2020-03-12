describe('Shorthand Functions', function() {
    'use strict';

    describe('precompile', function() {
        it('Should be a function', function() {
            expect(FireTPL.precompile).to.be.a('function');
        });

        it('Should fail precompile a template', function() {
            try {
                var precompiled = FireTPL.precompile();
            } catch(err) {
                expect(err.message).to.eql('Precompilation not possible! The options.name flag must be set!');
                return;
            }

            this.fail();
        });

        it('Should precompile a template', function() {
            var tpl = 'div class=test\n\tspan "Hello World"';
            var precompiled = FireTPL.precompile(tpl, 'test');

            expect(precompiled).to.be.a('string');
            expect(precompiled).to.eql('FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div class=\"test\"><span>Hello World</span></div>\';return s;};');
        });

        it('Should precompile a template in CommonJS style', function() {
            var tpl = 'div class=test\n\tspan "Hello World"';
            var precompiled = FireTPL.precompile(tpl, 'test', {
                commonjs: true
            });

            expect(precompiled).to.be.a('string');
            expect(precompiled).to.eql('(function(require) {var FireTPL = require(\'firetpl\');FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div class=\"test\"><span>Hello World</span></div>\';return s;};})(require);');
        });

        it('Should precompile a template in AMD style', function() {
            var tpl = 'div class=test\n\tspan "Hello World"';
            var precompiled = FireTPL.precompile(tpl, 'test', {
                amd: true
            });

            expect(precompiled).to.be.a('string');
            expect(precompiled).to.eql('define([\'firetpl\'],function(FireTPL) {FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div class=\"test\"><span>Hello World</span></div>\';return s;};});');
        });
    });

    describe('fire2html', function() {
        it('Should convert a firetpl into html', function() {
            var tmpl = FireTPL.compile('div class="test"\n\t"Hello $name"');
            var html = tmpl({ name: 'Andi' });
            expect(html).to.eql('<div class="test">Hello Andi</div>');
        });
    });
});