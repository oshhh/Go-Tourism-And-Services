describe('FireTPL', function() {
    'use strict';

    var tmplScope = {
        out: 'scopes=scopes||{};var root=data,parent=data;',
        if: function(str) {
            this.out += 'scopes.scope001=function(data,parent){var s=\'\';var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'';
            this.out += str;
            this.out += '\';return s;});s+=r;return s;};';
            return this;
        },
        each: function(str) {
            return this;
        },
        root: function(str) {
            this.out += 'var s=\'\';s+=\'' + str + '\';';
            var out = this.out;
            this.out = 'scopes=scopes||{};var root=data,parent=data;';
            return out;
        }
    };

    describe('constructor', function() {
        it('Should create a FireTPL.Compiler instance', function() {
            var fireTpl = new FireTPL.Compiler();
            expect(fireTpl).to.be.a(FireTPL.Compiler);
        });
    });

    describe.skip('injectClass', function() {
        it('Should inject a class into the last tag', function() {
            var fireTpl = new FireTPL.Compiler();
            fireTpl.out.root = '<div><span>';
            fireTpl.injectClass('injected');
            expect(fireTpl.out.root).to.eql('<div><span class="injected">');
        });
    });

    describe('precompile', function() {
        it('Should precompile a tmpl string', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div id=myDiv\n';
            template += '        div id=mySecondDiv class=myClass\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass"></div>' +
                '</body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string (using spaces)', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div id=myDiv\n';
            template += '        div id=mySecondDiv class=myClass\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass"></div>' +
                '</body></html>\';' +
                'return s;};'
            );
        });
        
        it('Should precompile a tmpl string (using spaces and tabs)', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '\t    div id=myDiv\n';
            template += '\t    div id=mySecondDiv class=myClass\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass"></div>' +
                '</body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with inline text', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div id=myDiv\n';
            template += '        div id=mySecondDiv class=myClass\n';
            template += '            "Hello World"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass">Hello World</div>' +
                '</body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with line attribute', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div id=myDiv\n';
            template += '        div\n';
            template += '            id=mySecondDiv\n';
            template += '            class=myClass\n';
            template += '            \n';
            template += '            "Hello World"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass">Hello World</div>' +
                '</body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with an if statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit : div\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;' +
                'scopes.scope001=function(data,parent){var s=\'\';' +
                'var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'' + 
                '<div>Hello World</div>\';' +
                'return s;});s+=r;return s;' +
                '};var s=\'\';' +
                's+=\'<html><head></head><body><div>\';' + 
                's+=scopes.scope001(data.sayit,data);' +
                's+=\'</div></body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with a if..else statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit\n';
            template += '            div\n';
            template += '                "Hello World"\n';
            template += '        :else\n';
            template += '            div\n';
            template += '                "Good bye"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;' +
                'scopes.scope001=function(data,parent){var s=\'\';' +
                'var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';' +
                's+=\'<div>Hello World</div>\';' +
                'return s;});s+=r;' +
                'if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';' +
                's+=\'<div>Good bye</div>\';' +
                'return s;});}return s;' +
                '};var s=\'\';' +
                's+=\'<html><head></head><body>\';' +
                's+=scopes.scope001(data.sayit,data);' +
                's+=\'</body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with a if..else statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit : div\n';
            template += '            div\n';
            template += '                "Hello World"\n';
            template += '        :else\n';
            template += '            div\n';
            template += '                "Good bye"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;' +
                'scopes.scope001=function(data,parent){var s=\'\';' +
                'var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';' +
                's+=\'<div>Hello World</div>\';' +
                'return s;});s+=r;' +
                'if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';' +
                's+=\'<div>Good bye</div>\';' +
                'return s;});}return s;' +
                '};var s=\'\';' +
                's+=\'<html><head></head><body><div>\';' +
                's+=scopes.scope001(data.sayit,data);' +
                's+=\'</div>\';s+=\'</body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with an unless statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :unless $sayit\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;' +
                'scopes.scope001=function(data,parent){var s=\'\';' +
                's+=h(\'unless\',data,parent,root,function(data){var s=\'\';' +
                's+=\'<div>Hello World</div>\';' +
                'return s;});return s;' +
                '};var s=\'\';' +
                's+=\'<html><head></head><body>\';' +
                's+=scopes.scope001(data.sayit,data);' +
                's+=\'</body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with an unless statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :unless $sayit : div\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;' +
                'scopes.scope001=function(data,parent){var s=\'\';' +
                's+=h(\'unless\',data,parent,root,\'div\',\'\',function(data){var s=\'\';' +
                's+=\'<div>Hello World</div>\';' +
                'return s;});return s;' +
                '};var s=\'\';' +
                's+=\'<html><head></head><body><div>\';' +
                's+=scopes.scope001(data.sayit,data);' +
                's+=\'</div></body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with an each statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :each $listing\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;' +
                'scopes.scope001=function(data,parent){var s=\'\';' +
                's+=h(\'each\',data,parent,root,function(data){var s=\'\';' +
                's+=\'<div>Hello World</div>\';' +
                'return s;});return s;' +
                '};var s=\'\';' +
                's+=\'<html><head></head><body>\';' +
                's+=scopes.scope001(data.listing,data);' +
                's+=\'</body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with an each statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :each $listing : div\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;' +
                'scopes.scope001=function(data,parent){var s=\'\';' +
                's+=h(\'each\',data,parent,root,\'div\',\'\',function(data){var s=\'\';' +
                's+=\'<div>Hello World</div>\';' +
                'return s;});return s;' +
                '};var s=\'\';' +
                's+=\'<html><head></head><body><div>\';' +
                's+=scopes.scope001(data.listing,data);' +
                's+=\'</div></body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with a multiline string', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div class=content\n';
            template += '            "I\'m a multiline\n';
            template += '            String"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head></head><body>' +
                '<div class="content">I\\\'m a multiline String</div>' +
                '</body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with a multiline string (using spaces)', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div class=content\n';
            template += '            "I\'m a multiline\n';
            template += '            String"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head></head><body>' +
                '<div class="content">I\\\'m a multiline String</div>' +
                '</body></html>\';' +
                'return s;};'
            );
        });

        it.skip('Should precompile a tmpl string with multiple multiline strings', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '       div class=content\n';
            template += '           "I\'m a multiline\n';
            template += '           String"\n';
            template += '           "And a line break"\n';
            template += '           \n';
            template += '           "And a paragraph\n';
            template += '           Block"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head></head><body>' +
                '<div class="content">I\\\'m a multiline String<br>' +
                'And a line break<br><br>And a paragraph Block</div>' +
                '</body></html>\';' +
                'return s;};'
            );
        });

        it.skip('Should precompile a tmpl string with multiple multiline strings and placeholders', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '       div class=content\n';
            template += '           "I\'m a $super multiline\n';
            template += '           String"\n';
            template += '           "And a $super line break"\n';
            template += '           \n';
            template += '           "And a $super paragraph\n';
            template += '           Block"\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head></head><body>' +
                '<div class="content">I\\\'m a \'+data.super+\' multiline String<br>' +
                'And a \'+data.super+\' line break<br><br>And a \'+data.super+\' paragraph Block</div>' +
                '</body></html>\';' +
                'return s;};'
            );
        });

        it('Shouldn\'t close void tags', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '        meta\n';
            template += '        title\n';
            template += '        link\n';
            template += '    body\n';
            template += '        input\n';
            template += '        img\n';
            template += '        div class=content\n';
            template += '            map\n';
            template += '                area\n';
            template += '                area\n';
            template += '            br\n';
            template += '            colgroup\n';
            template += '                col\n';
            template += '                col\n';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head><meta><title></title><link></head><body>' +
                '<input><img>' +
                '<div class="content"><map><area><area></map><br>' +
                '<colgroup><col><col></colgroup></div></body></html>\';' +
                'return s;};'
            );
        });

        it('Should precompile a tmpl string with i18n tags', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div class=description\n';
            template += '            @txt.description\n';
            template += '        button @btn.submit';

            var fireTpl = new FireTPL.Compiler();
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;var s=\'\';' +
                's+=\'<html><head></head><body>' +
                '<div class="description">\'+l(\'txt.description\',data)+\'</div>' +
                '<button>\'+l(\'btn.submit\',data)+\'</button></body></html>\';' +
                'return s;};'
            );
        });

        it.skip('Should precompile a tmpl string with an each statement wrapped in a div scopeTags are enabled', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        h1 $title\n';
            template += '        :each $listing : div\n';
            template += '            div\n';
            template += '                "Hello $name"\n';

            var fireTpl = new FireTPL.Compiler({
                scopeTags: true
            });
            template = fireTpl.precompile(template, 'test');
            expect(template).to.eql(
                'FireTPL.templateCache[\'test\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;' +
                'scopes=scopes||{};var root=data,parent=data;' +
                'scopes.scope001=function(data,parent){var s=\'\';' +
                's+=h(\'each\',data,parent,root,function(data){var s=\'\';' +
                's+=\'<div>Hello \'+data.name+\'</div>\';' +
                'return s;});return s;' +
                '};var s=\'\';' +
                's+=\'<html><head></head><body>' +
                '<h1><scope path="title"></scope></h1>' +
                '<div>' +
                '<scope fire-scop="scope001" path="listing"></scope>\';' +
                's+=\'</div></body></html>\';' +
                'return s;};'
            );
        });
    });

    describe.skip('loadFile', function() {
        var server;

        beforeEach(function() {
            server = sinon.fakeServer.create();
            server.autoRespond = true;
        });

        afterEach(function() {
            server.restore();
        });

        it('Should load a template file', function() {
            var content = 'div class=test' + 
                '   h1' + 
                '       $title' + 
                '   div class=description' + 
                '       $description';

            server.respondWith('GET', 'templates/test.fire',
                [200, { 'Content-Type': 'text/plain' },
                content
            ]);


            var file = 'templates/test.fire';
            var source = FireTPL.loadFile(file);

            expect(source).to.eql(content);
        });

        it('Should fail loading a template file and should log an error to the console', function() {
            var errorStub = sinon.stub(console, 'error');
            
            server.respondWith('GET', 'templates/test.fire',
                [404, { 'Content-Type': 'text/plain' },
                'Page not found'
            ]);


            var file = 'templates/test.fire';
            var source = FireTPL.loadFile(file);

            expect(source).to.eql('');
            expect(errorStub).to.be.called();
            expect(errorStub).to.be.calledWith('Loading a FireTPL template failed! Template wasn\'t found!');
            errorStub.restore();
        });

        it('Should fail loading a template file and should log an error to the console', function() {
            var errorStub = sinon.stub(console, 'error');
            
            server.respondWith('GET', 'templates/test.fire',
                [500, { 'Content-Type': 'text/plain' },
                'Something went wrong!'
            ]);


            var file = 'templates/test.fire';
            var source = FireTPL.loadFile(file);
            expect(source).to.eql('');
            expect(errorStub).to.be.called();
            expect(errorStub).to.be.calledWith('Loading a FireTPL template failed! Server response was: 500 Internal Server Error');
            errorStub.restore();
        });
    });

    describe('prettify', function() {
        it('Should generate a pretty html string', function() {
            var uggly = '<div><span>Hello</span></div>';

            var pretty = FireTPL.prettify(uggly);

            expect(pretty).to.be.eql('<div>\n    <span>Hello</span>\n</div>');
        });

        it('Should generate a pretty html string from a complexer html string', function() {
            var uggly = '<div><span>Hello</span><ul>' +
                '<li><a href="page.html">Link I<br><small>page.html</small></a></li>' + 
                '<li><a href="page.html">Link II<br><small>page2.html</small></a></li>' + 
                '<li><a href="page.html">Link III<br><small>page3.html</small></a></li>' + 
                '</ul></div>';

            var pretty = FireTPL.prettify(uggly);

            expect(pretty).to.be.eql('<div>\n    <span>Hello</span>\n    '+
                '<ul>'+
                '\n        <li>\n            <a href="page.html">Link I<br><small>page.html</small></a>\n        </li>' + 
                '\n        <li>\n            <a href="page.html">Link II<br><small>page2.html</small></a>\n        </li>' + 
                '\n        <li>\n            <a href="page.html">Link III<br><small>page3.html</small></a>\n        </li>' + 
                '\n    </ul>\n</div>');
        });
    });
});