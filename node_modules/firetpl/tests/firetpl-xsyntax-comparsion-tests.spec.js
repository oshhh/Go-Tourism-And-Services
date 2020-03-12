describe('FireTPL syntax comparsion tests', function() {
    'use strict';

    describe.skip('Compare results of .fire and .hbs templates', function() {
        beforeEach(function() {

        });

        afterEach(function() {

        });

        it('Should compare a minimal html construct', function() {
            var fire = 'div';
            var hbs = '<div></div>';
            var data = {};

            fire = FireTPL.compile(fire);
            fire = fire(data);

            hbs = FireTPL.compile(hbs);
            hbs = hbs(data);

            expect(fire).to.eql(hbs);
        });

        it('Should compare a basic html construct', function() {
            var fire = 'section class=test\n' +
                '    h1 $title';

            var hbs = '<section class="test"><h1>{{title}}</h1></section>';

            var data = {
                title: 'Hello world!'
            };

            fire = FireTPL.compile(fire);
            fire = fire(data);

            hbs = FireTPL.compile(hbs, {
                type: 'hbs'
            });
            hbs = hbs(data);

            // console.log('Fire:', fire);
            // console.log('Hbs:', hbs);

            expect(fire).to.eql(hbs);
        });

        it('Should compare a basic html construct with an if helper', function() {
            var fire = 'section class=test\n' +
                '    h1 $title\n' +
                '        :if $name\n' +
                '            "I\'m $name"';

            var hbs = '<section class="test"><h1>{{title}}</h1>' +
            '{{#if name}}I\'m {{name}}{{/if}}</section>';

            var data = {
                title: 'Hello world!'
            };

            fire = FireTPL.compile(fire);
            fire = fire(data);

            hbs = FireTPL.compile(hbs, {
                type: 'hbs'
            });

            hbs = hbs(data);

            // console.log(fire);
            // console.log(hbs);

            expect(fire).to.eql(hbs);
        });

        it('Should compare a basic html construct with an each helper', function() {
            var fire = 'section class=test\n' +
                '    h1 $title\n' +
                '    :each $listing : ul\n' +
                '        li $name\n';

            var hbs = '<section class="test"><h1>{{title}}</h1>' +
            '<ul>{{#each listing}}<li>{{name}}</li>{{/each}}</ul></section>';

            var data = {
                title: 'Hello world!',
                listing: [{name: 'Andi'}]
            };

            fire = FireTPL.compile(fire);
            fire = fire(data);

            hbs = FireTPL.compile(hbs, {
                type: 'hbs'
            });
            hbs = hbs(data);

            // console.log(fire);
            // console.log(hbs);

            expect(fire).to.eql(hbs);
        });

        it('Should compare a formated .hbs template with a .fire template', function() {
            var fire = 'section class=test\n' +
                '    h1 $title\n' +
                '    \n' +
                '    :each $listing : ul\n' +
                '        li $name\n';

            var hbs = '<section class="test">\n' +
            '  <h1>{{title}}</h1>\n' +
            '  <ul>\n' +
            '  {{#each listing}}\n' +
            '    <li>{{name}}</li>\n' +
            '  {{/each}}\n' +
            '  </ul>\n' +
            '</section>';

            var data = {
                title: 'Hello world!',
                listing: [{name: 'Andi'}]
            };

            fire = FireTPL.compile(fire);
            fire = fire(data);

            hbs = FireTPL.compile(hbs, {
                type: 'hbs'
            });
            hbs = hbs(data);

            // console.log(fire);
            // console.log(hbs);

            expect(fire).to.eql(hbs);
        });

        it('Should compare a basic html construct with an each helper and strings', function() {
            var fire = 'section class=test\n' +
                '    h1 "Name listing"\n' +
                '    \n' +
                '    :each $listing : ul\n' +
                '        li $name\n';

            var hbs = '<section class="test">\n' +
            '  <h1>Name listing</h1>\n' +
            '  <ul>\n' +
            '  {{#each listing}}\n' +
            '    <li>{{name}}</li>\n' +
            '  {{/each}}\n' +
            '  </ul>\n' +
            '</section>';

            var data = {
                title: 'Hello world!',
                listing: [{name: 'Andi'}]
            };

            fire = FireTPL.compile(fire);
            fire = fire(data);

            hbs = FireTPL.compile(hbs, {
                type: 'hbs'
            });
            hbs = hbs(data);

            // console.log(fire);
            // console.log(hbs);

            expect(fire).to.eql(hbs);
        });

        it('Should compare a basic html construct with multiline strings', function() {
            var fire = 'section class=test\n' +
                '    h1 "Name listing"\n' +
                '    \n' +
                '    p\n' +
                '        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n' +
                '        Integer cursus nibh non suscipit auctor.\n' +
                '        Pellentesque ullamcorper sapien sit amet dui molestie, quis gravida eros hendrerit."\n';

            var hbs = '<section class="test">\n' +
            '  <h1>Name listing</h1>\n' +
            '  <p>\n' +
            '    Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n' +
            '    Integer cursus nibh non suscipit auctor.\n' +
            '    Pellentesque ullamcorper sapien sit amet dui molestie, quis gravida eros hendrerit.\n' +
            '  </p>\n' +
            '</section>';

            var data = {
                title: 'Hello world!',
                listing: [{name: 'Andi'}]
            };

            fire = FireTPL.compile(fire);
            fire = fire(data);

            hbs = FireTPL.compile(hbs, {
                type: 'hbs'
            });
            
            hbs = hbs(data);

            // console.log(fire);
            // console.log(hbs);

            expect(fire).to.eql(hbs);
        });
    });
});