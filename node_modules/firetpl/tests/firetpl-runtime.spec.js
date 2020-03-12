//jshint multistr: true

var parserFood = [{

title: 'simple HTML',

fire:
'div\n\
    ul\n\
        li\n\
        li\n',
hbs:
'<div>\n\
    <ul>\n\
        <li></li>\n\
        <li></li>\n\
    </ul>\n\
</div>',

data: {},

out:
'<div><ul><li></li><li></li></ul></div>'


}, {

title: 'simple strings',

fire:
'div\n\
    "Hello World!"',

hbs:
'<div>\n\
    Hello World!\n\
</div>',

data: {},

out:
'<div>Hello World!</div>'


}, {

title: 'simple string with vars',

fire:
'div\n\
    "Hello $name!"',

hbs:
'<div>\n\
    Hello {{name}}!\n\
</div>',

data: {
    name: 'Andi'
},

out:
'<div>Hello Andi!</div>'


}, {

title: 'simple string with double vars',

fire:
'div\n\
    "$greeding $name!"',

hbs:
'<div>\n\
    {{greeding}} {{name}}!\n\
</div>',

data: {
    name: 'Andi',
    greeding: 'Good morning'
},

out:
'<div>Good morning Andi!</div>'


}, {

title: 'tag with double vars',

fire:
'div\n\
    span "$greeding $name!"',

hbs:
'<div>\n\
    <span>{{greeding}} {{name}}!</span>\n\
</div>',

data: {
    name: 'Andi',
    greeding: 'Good morning'
},

out:
'<div><span>Good morning Andi!</span></div>'


}, {

title: 'if helper and vars',

fire:
'div\n\
    :if $name\n\
        span "$greeding $name!"\n\
    :else\n\
        span "Hello $name!"',

hbs:
'<div>\n\
    {{#if name}}\n\
        <span>{{greeding}} {{name}}!</span>\n\
    {{else}}\n\
        <span>Hello {{name}}!</span>\n\
    {{/if}}\n\
</div>',

data: {
    name: 'Andi',
    greeding: 'Good morning'
},

out:
'<div><span>Good morning Andi!</span></div>'


}, {

title: 'each helper with sub if',

fire:
'div\n\
    :each $listing\n\
        :if $greeding\n\
            span "$greeding $name!"\n\
        :else\n\
            span "Hello $name!"',

hbs:
'<div>\n\
    {{#each listing}}\n\
        {{#if greeding}}\n\
            <span>{{greeding}} {{name}}!</span>\n\
        {{else}}\n\
            <span>Hello {{name}}!</span>\n\
        {{/if}}\n\
    {{/each}}\n\
</div>',

data: {
    listing: [{
        name: 'Andi',
        greeding: 'Good morning'
    }, {
        name: 'Barney'
    }]
},

out:
'<div><span>Good morning Andi!</span><span>Hello Barney!</span></div>'


// }, {

// title: 'tag with inline func',

// fire:
// 'div\n\
//     span "State: $state.if(\'loggedin\', \'Logged-in\', \'Logged-out\')!"',

// hbs:
// null,

// data: {
//     state: 'loggedin'
// },

// out:
// '<div><span>State: Logged-in</span></div>'


}];

/* +------------------------------------------------------------------------------------+
   | Tests
   +------------------------------------------------------------------------------------+ */

describe('FireTPL Runtime', function() {
    describe('Template Parser', function() {
        parserFood.forEach(function(item) {
            it('Should parse "' + item.title + '" using fire syntax', function() {
                var fire = FireTPL.compile(item.fire);
                var html = fire(item.data);
                expect(html).to.eql(item.out);
            });

            if (!item.hbs) {
                return;
            }

            it.skip('Should parse "' + item.title + '" using hbs syntax', function() {
                var hbs = FireTPL.compile(item.hbs, {
                    type: 'hbs'
                });
                var html = hbs(item.data);
                expect(html).to.eql(item.out);
            });
        });
    });

    describe('compile', function() {
        it('Should compile a tmpl string', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div id=myDiv\n';
            template += '        div id=mySecondDiv class=myClass\n';

            template = FireTPL.compile(template);
            var html = template();
            expect(html).to.eql(
                '<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass"></div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with inline text', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div id=myDiv\n';
            template += '        div id=mySecondDiv class=myClass\n';
            template += '            "Hello World"\n';

            template = FireTPL.compile(template);
            var html = template();
            expect(html).to.eql(
                '<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass">Hello World</div>' +
                '</body></html>'
            );
        });

        it.skip('Should compile a tmpl string with inline vars', function() {
            var ftl = 'html\n';
            ftl += '    head\n';
            ftl += '    body\n';
            ftl += '        div id=myDiv\n';
            ftl += '        div id=mySecondDiv class=myClass\n';
            ftl += '            "Hello $name"\n';

            var hbs = '<html>\n';
            hbs += '    <head></head>\n';
            hbs += '    <body>\n';
            hbs += '        <div id="myDiv"></div>\n';
            hbs += '        <div id="mySecondDiv" class="myClass">\n';
            hbs += '            Hello {{name}}\n';
            hbs += '        </div>\n';
            hbs += '    </body>\n';
            hbs += '</html>\n';

            var data = {
                name: 'Andi'
            };

            var out = '<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass">Hello Andi</div>' +
                '</body></html>';

            expect(FireTPL.compile(ftl)(data)).to.eql(out);
            expect(FireTPL.compile(hbs, {
                type: 'hbs'
            })(data)).to.eql(out);
        });

        it('Should compile a tmpl string with multiple inline vars', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div id=myDiv\n';
            template += '        div id=mySecondDiv class=myClass\n';
            template += '            "$greeding $name"\n';

            template = FireTPL.compile(template);
            var html = template({name: 'Andi', greeding: 'Good morning'});
            expect(html).to.eql(
                '<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass">Good morning Andi</div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with line attribute', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div id=myDiv\n';
            template += '        div\n';
            template += '            id=mySecondDiv\n';
            template += '            class=myClass\n';
            template += '            \n';
            template += '            "Hello World"\n';

            template = FireTPL.compile(template);
            var html = template();
            expect(html).to.eql(
                '<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass">Hello World</div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with an if statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body>'+
                '<div>Hello World</div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with an if statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit: div\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body>'+
                '<div>'+
                '<div>Hello World</div></div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with a truthy if..else statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit\n';
            template += '            div\n';
            template += '                "Hello World"\n';
            template += '        :else\n';
            template += '            div\n';
            template += '                "Good bye"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body><div>Hello World</div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with a truthy if..else statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit: div\n';
            template += '            div\n';
            template += '                "Hello World"\n';
            template += '        :else\n';
            template += '            div\n';
            template += '                "Good bye"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body><div><div>Hello World</div></div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with a falsy if..else statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit\n';
            template += '            div\n';
            template += '                "Hello World"\n';
            template += '        :else\n';
            template += '            div\n';
            template += '                "Good bye"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: false
            });
            expect(html).to.eql(
                '<html><head></head><body><div>Good bye</div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with a falsy if..else statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit : div\n';
            template += '            div\n';
            template += '                "Hello World"\n';
            template += '        :else\n';
            template += '            div\n';
            template += '                "Good bye"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: false
            });
            expect(html).to.eql(
                '<html><head></head><body><div><div>Good bye</div></div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with an truthy unless statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :unless $sayit\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with an truthy unless statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :unless $sayit : div\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body><div>' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with an falsy unless statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :unless $sayit\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: false
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '<div>Hello World</div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with an falsy unless statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :unless $sayit : div\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: false
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '<div><div>Hello World</div>' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with an falsy each statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :each $listing\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            template = FireTPL.compile(template);
            var html = template({
                listing: undefined
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with an falsy each statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :each $listing : div class="listing"\n';
            template += '            div\n';
            template += '                "Hello World"\n';

            template = FireTPL.compile(template);
            var html = template({
                listing: undefined
            });
            expect(html).to.eql(
                '<html><head></head><body><div class="listing">' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with inline variable', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :each $listing : div class="listing"\n';
            template += '            span class="type-$type" $name';

            template = FireTPL.compile(template);
            var html = template({
                listing: [
                    { name: 'Andi', type: 'cool' },
                    { name: 'Tini', type: 'sassy' }
                ]
            });
            expect(html).to.eql(
                '<html><head></head><body>' + 
                '<div class="listing">' +
                '<span class="type-cool">Andi</span>' +
                '<span class="type-sassy">Tini</span>' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with an truthy each statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :each $listing\n';
            template += '            span\n';
            template += '                $name\n';

            template = FireTPL.compile(template);
            var html = template({
                listing: [
                    {name: 'Andi'},
                    {name: 'Donnie'}
                ]
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '<span>Andi</span><span>Donnie</span>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with an truthy each statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :each $listing : div\n';
            template += '            span\n';
            template += '                $name\n';

            template = FireTPL.compile(template);
            var html = template({
                listing: [
                    {name: 'Andi'},
                    {name: 'Donnie'}
                ]
            });
            expect(html).to.eql(
                '<html><head></head><body><div>' +
                '<span>Andi</span><span>Donnie</span>' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with a truthy if..else and an if statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit\n';
            template += '            div\n';
            template += '                "Hello World"\n';
            template += '        :else\n';
            template += '            div\n';
            template += '                "Good bye"\n';
            template += '        ul\n';
            template += '            :if $name\n';
            template += '                li class=item\n';
            template += '                    $name\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '<div>Hello World</div>' +
                '<ul></ul>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with a truthy if..else and an if statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit : div\n';
            template += '            div\n';
            template += '                "Hello World"\n';
            template += '        :else\n';
            template += '            div\n';
            template += '                "Good bye"\n';
            template += '        :if $name : ul\n';
            template += '            li class=item\n';
            template += '                $name\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '<div>' +
                '<div>Hello World</div>' +
                '</div>' +
                '<ul>' +
                '</ul>' +
                '</body></html>'
            );

        });

        it('Should compile a tmpl string with a truthy if..else and a nested if statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit\n';
            template += '            div\n';
            template += '                "Hello World"\n';
            template += '            ul\n';
            template += '                :if $name\n';
            template += '                    li class=item\n';
            template += '                        $name\n';
            template += '        :else\n';
            template += '            div\n';
            template += '                "Good bye"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '<div>Hello World</div>' +
                '<ul>' +
                '</ul>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with a truthy if..else and a nested if statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :if $sayit : div\n';
            template += '            div\n';
            template += '                "Hello World"\n';
            template += '            :if $name : ul\n';
            template += '                li class=item\n';
            template += '                    $name\n';
            template += '        :else\n';
            template += '            div\n';
            template += '                "Good bye"\n';

            template = FireTPL.compile(template);
            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '<div>' +
                '<div>Hello World</div>' +
                '<ul>' +
                '</ul>' +
                '</div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with a truthy each and a nested if..else statement', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        ul class=listing\n';
            template += '            :each $listing\n';
            template += '                li\n';
            template += '                    :if $sayit\n';
            template += '                        div\n';
            template += '                            "Hello World"\n';
            template += '                    :else\n';
            template += '                        div\n';
            template += '                            "Good bye"\n';

            template = FireTPL.compile(template);
            var html = template({
                listing: [
                    { sayit: true },
                    { sayit: false }
                ]
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '<ul class="listing">' +
                '<li>' +
                '<div>Hello World</div>' +
                '</li>' +
                '<li>' +
                '<div>Good bye</div>' +
                '</li>' +
                '</ul>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with a truthy each and a nested if..else statement wrapped in a div', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        :each $listing : ul class="listing"\n';
            template += '            li\n';
            template += '                :if $sayit : div\n';
            template += '                    div\n';
            template += '                        "Hello World"\n';
            template += '                :else\n';
            template += '                    div\n';
            template += '                        "Good bye"\n';

            template = FireTPL.compile(template);
            var html = template({
                listing: [
                    { sayit: true },
                    { sayit: false }
                ]
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '<ul class="listing">' +
                '<li>' +
                '<div>' +
                '<div>Hello World</div>' +
                '</div>' +
                '</li>' +
                '<li>' +
                '<div>' +
                '<div>Good bye</div>' +
                '</div>' +
                '</li>' +
                '</ul>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with brace wrapped vars', function() {
            var template = 'html\n';
            template += '    head\n';
            template += '    body\n';
            template += '        div\n';
            template += '            "${name}User"\n';
            template += '        div\n';
            template += '            ${name}$key\n';

            template = FireTPL.compile(template);
            var html = template({
                name: 'Andi',
                key: 'User'
            });
            expect(html).to.eql(
                '<html><head></head><body>' +
                '<div>AndiUser</div>' +
                '<div>AndiUser</div>' +
                '</body></html>'
            );
        });
    });

    describe('compile (using template cache)', function() {
        it('Should compile a tmpl string', function() {
            var template = function(data, scopes) {
                var s = '';
                s+='<html><head></head><body><div id="myDiv"></div>';
                s+='<div id="mySecondDiv" class="myClass"></div>';
                s+='</body></html>';
                return s;
            };

            var html = template();
            expect(html).to.eql(
                '<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass"></div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with inline text', function() {
            var template = function(data, scopes) {
                var s = '';
                s+='<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass">Hello World</div>' +
                '</body></html>';
                return s;
            };

            var html = template();
            expect(html).to.eql(
                '<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass">Hello World</div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with line attribute', function() {
            var template = function(data, scopes) {
                var s = '';
                s+='<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass">Hello World</div>' +
                '</body></html>';
                return s;
            };

            var html = template();
            expect(html).to.eql(
                '<html><head></head><body><div id="myDiv"></div>' +
                '<div id="mySecondDiv" class="myClass">Hello World</div>' +
                '</body></html>'
            );
        });

        it('Should compile a tmpl string with an if statement', function() {
            var template = function(data, scopes) {
                var s='';
                var t = new FireTPL.Runtime();
                scopes=scopes||{};
                var parent = data;
                var root = data;
                scopes.scope001=function(data, parent){
                        var s='';
                        var c=data;
                        var r=t.execHelper('if', c, parent, root,function(data){
                                var s='';
                                s+='<div>Hello World</div>';
                                return s;

                        });
                        s+=r;
                        return s;

                };
                s+='<html><head></head><body><div>';
                s+=scopes.scope001(data.sayit, data);
                s+='</div></body></html>';
                return s;
            };

            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body><div><div>Hello World</div>' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with a truthy if..else statement', function() {
            var template = function(data, scopes) {
                var t = new FireTPL.Runtime();
                scopes=scopes||{};
                var parent = data;
                var root = data;
                scopes.scope001=function(data, parent){
                        var s='';
                        var c=data;
                        var r=t.execHelper('if', c, parent, root,function(data){
                                var s='';
                                s+='<div>Hello World</div>';
                                return s;

                        });
                        s+=r;
                        if(!r){
                                s+=t.execHelper('else', c, parent, root, function(data){
                                        var s='';
                                        s+='<div>Good bye</div>';
                                        return s;

                                });

                        }return s;

                };
                var s='';
                s+='<html><head></head><body><div>';
                s+=scopes.scope001(data.sayit, data);
                s+='</div></body></html>';
                return s;
            };

            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body><div><div>Hello World</div>' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with a falsy if..else statement', function() {
            var template = function(data, scopes) {
                var t = new FireTPL.Runtime();
                scopes=scopes||{};
                var parent = data;
                var root = data;
                scopes.scope001=function(data){
                        var s='';
                        var c=data;
                        var r=t.execHelper('if', c, parent, root,function(data){
                                var s='';
                                s+='<div>Hello World</div>';
                                return s;

                        });
                        s+=r;
                        if(!r){
                                s+=t.execHelper('else', c, parent, root, function(data){
                                        var s='';
                                        s+='<div>Good bye</div>';
                                        return s;

                                });

                        }return s;

                };
                var s='';
                s+='<html><head></head><body><div>';
                s+=scopes.scope001(data.sayit);
                s+='</div></body></html>';
                return s;

            };

            var html = template({
                sayit: false
            });
            expect(html).to.eql(
                '<html><head></head><body><div><div>Good bye</div>' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with a truthy unless statement', function() {
            var template = function(data, scopes) {
                var t = new FireTPL.Runtime();
                scopes=scopes||{};
                var parent = data;
                var root = data;
                scopes.scope001=function(data){
                        var s='';
                        s+=t.execHelper('unless', data, parent, root, function(data){
                                var s='';
                                s+='<div>Hello World</div>';
                                return s;

                        });
                        return s;

                };
                var s='';
                s+='<html><head></head><body><div>';
                s+=scopes.scope001(data.sayit);
                s+='</div></body></html>';
                return s;
            };

            var html = template({
                sayit: true
            });
            expect(html).to.eql(
                '<html><head></head><body><div>' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with a falsy unless statement', function() {
            var template = function(data, scopes) {
                var t = new FireTPL.Runtime();
                scopes=scopes||{};
                var parent = data;
                var root = data;
                scopes.scope001=function(data){
                        var s='';
                        s+=t.execHelper('unless', data, parent, root, function(data){
                                var s='';
                                s+='<div>Hello World</div>';
                                return s;

                        });
                        return s;
                };
                var s='';
                s+='<html><head></head><body><div>';
                s+=scopes.scope001(data.sayit);
                s+='</div></body></html>';
                return s;
            };

            var html = template({
                sayit: false
            });
            expect(html).to.eql(
                '<html><head></head><body><div><div>Hello World</div>' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with a falsy each statement', function() {
            var template = function(data, scopes) {
                var t = new FireTPL.Runtime();
                scopes=scopes||{};
                var parent = data;
                var root = data;
                scopes.scope001=function(data,parent){
                        var s='';
                        s+=t.execHelper('each',data,parent,root,function(data){
                                var s='';
                                s+='<div>Hello World</div>';
                                return s;

                        });
                        return s;

                };
                var s='';
                s+='<html><head></head><body><div class="listing">';
                s+=scopes.scope001(data.listing,data);
                s+='</div></body></html>';
                return s;
            };

            var html = template({
                listing: undefined
            });
            expect(html).to.eql(
                '<html><head></head><body><div class="listing">' +
                '</div></body></html>'
            );
        });

        it('Should compile a tmpl string with a truthy each statement', function() {
            var template = function(data, scopes) {
                var t = new FireTPL.Runtime();
                scopes=scopes||{};
                var parent = data;
                var root = data;
                scopes.scope001=function(data){
                        var s='';
                        s+=t.execHelper('each', data, parent, root, function(data){
                                var s='';
                                s+='<span>' + data.name + '</span>';
                                return s;

                        });
                        return s;

                };
                var s='';
                s+='<html><head></head><body><div class="listing">';
                s+=scopes.scope001(data.listing);
                s+='</div></body></html>';
                return s;
            };

            var html = template({
                listing: [
                    {name: 'Andi'},
                    {name: 'Donnie'}
                ]
            });
            expect(html).to.eql(
                '<html><head></head><body><div class="listing">' +
                '<span>Andi</span><span>Donnie</span>' +
                '</div></body></html>'
            );
        });
    });
    
    describe('Scopes', function() {
        it('Should call a scope function of a FireTemplate', function() {
            var template = function(data, scopes) {
                var t = new FireTPL.Runtime();
                scopes=scopes||{};
                var parent = data;
                var root = data;
                scopes.scope001=function(data){
                        var s='';
                        s+=t.execHelper('each', data, parent, root, function(data){
                                var s='';
                                s+='<span>' + data.name + '</span>';
                                return s;

                        });
                        return s;

                };
                var s='';
                s+='<html><head></head><body><div class="listing">';
                s+=scopes.scope001(data.listing);
                s+='</div></body></html>';
                return s;
            };

            var scopes = {};
            var html = template({
                listing: [
                    {name: 'Andi'},
                    {name: 'Donnie'}
                ]
            }, scopes);

            expect(scopes).to.be.an('object');
            expect(scopes.scope001).to.be.a('function');

            expect(html).to.eql(
                '<html><head></head><body><div class="listing">' +
                '<span>Andi</span><span>Donnie</span>' +
                '</div></body></html>'
            );

            var scopeCall = scopes.scope001([
                {name: 'Carl'}
            ]);

            expect(scopeCall).to.eql('<span>Carl</span>');
        });
    });

    describe('$parent, $root and $this', function() {
        it('Should get the parent data scope with $parent', function() {
            var tmpl = 'div\n' +
                '    :each $listing : div\n' +
                '        span $parent.name\n';

            var template = FireTPL.compile(tmpl);
            var html = template({
                name: 'Andi',
                listing: [
                    { key: 'A', value: 'AAA' },
                    { key: 'B', value: 'BBB' }
                ]
            });

            expect(html).to.eql('<div><div><span>Andi</span><span>Andi</span></div></div>');
        });

        it('Should get the root scope with $root', function() {
            var tmpl = 'div\n' +
                '    :each $list.listing : div\n' +
                '        span $root.name\n';

            var template = FireTPL.compile(tmpl);
            var html = template({
                name: 'Andi',
                list: {
                    name:'Donnie',
                    listing: [
                        { key: 'A', value: 'AAA' },
                        { key: 'B', value: 'BBB' }
                    ]
                }
            });

            expect(html).to.eql('<div><div><span>Andi</span><span>Andi</span></div></div>');
        });

        it('Should get the current scope with $this', function() {
            var tmpl = 'div\n' +
                '    :each $list.listing : div\n' +
                '        span $this.name\n';

            var template = FireTPL.compile(tmpl);
            var html = template({
                name: 'Andi',
                list: {
                    name:'Donnie',
                    listing: [
                        { name: 'Berney', key: 'A', value: 'AAA' },
                        { name: 'Donnie', key: 'B', value: 'BBB' }
                    ]
                }
            });

            expect(html).to.eql('<div><div><span>Berney</span><span>Donnie</span></div></div>');
        });
    });

    describe('template()', function() {
        it('Should not create a new data scope in an :if helper', function() {
            var tmpl = 'div\n' +
                '    :if $listing : div\n' +
                '        span $listing.name\n' +
                '    :if $name : div\n' +
                '        span $name\n';

            var template = FireTPL.compile(tmpl);
            var html = template({
                name: 'Andi',
                listing: {
                    name: 'Berney',
                    key: 'A',
                    value: 'AAA'
                }
            });

            expect(html).to.eql('<div>' +
                '<div><span>Berney</span></div>' +
                '<div><span>Andi</span></div>' +
                '</div>');
        });
    });

    describe('i18n support', function() {
        var l;

        before(function() {
            l = function(key, data, lang) {
                var curLang = lang || FireTPL.i18nCurrent;

                switch(key) {
                    case 'hello':
                        switch(curLang) {
                            case 'de': return 'Hallo ' + data.name + '!';
                            case 'se': return 'Hej ' + data.name + '!';
                            default: return 'Hello ' + data.name + '!';
                        }
                }
            };
        });

        it('Should return a german welcome message', function() {
            expect(l('hello', { name: 'Andi' }, 'de')).to.eql('Hallo Andi!');
        });
        
        it('Should return an english welcome message', function() {
            expect(l('hello', { name: 'Andi' })).to.eql('Hello Andi!');
        });
        
        it('Should return an swedish welcome message', function() {
            FireTPL.i18nCurrent = 'se';
            expect(l('hello', { name: 'Andi' })).to.eql('Hej Andi!');
        });
    });
});