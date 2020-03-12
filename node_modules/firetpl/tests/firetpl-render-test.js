describe('Render test', function() {
    'use strict';

    var path = require('path'),
        readFile = function(file) {
            return require('fs').readFileSync(file, {
                encoding: 'utf8'
            });
        };

    var testFiles = require('./modules/fileLoader')(path.join(__dirname, './testdata'));
    
    describe('Load data', function() {
        it('Should have test data', function() {
            expect(testFiles).to.be.an('array');
        });
    });

    describe('Parse', function() {
        testFiles.forEach(function(file) {
            var data = file.json ? JSON.parse(readFile(file.json)) : {};
            var i18n = file.i18n ? JSON.parse(readFile(file.i18n)) : null;
            var html = readFile(file.html);

            var title = path.basename(file.html, '.html').replace('_', ' ');

            if (i18n) {
                FireTPL.compileLocales(i18n);
                FireTPL.i18nCurrent = 'en';
            }

            if (file.fire) {
                it('Should parse ' + (/^[aeiou]/.test(title) ? 'an' : 'a') + ' ' + title + ' fire template', function() {
                    var tmpl = readFile(file.fire);
                    var res = FireTPL.fire2html(tmpl, data, {
                        pretty: true,
                        includesPath: path.join(__dirname, './testdata'),
                        eventAttrs: true
                    });
                    expect(res).to.eql(html);
                });
            }

            if (file.hbs) {
                it('Should parse ' + (/^[aeiou]/.test(title) ? 'an' : 'a') + ' ' + title + ' hbs template', function() {
                    var tmpl = readFile(file.hbs);
                    var res = FireTPL.fire2html(tmpl, data, {
                        type: 'hbs',
                        pretty: true,
                        includesPath: path.join(__dirname, './testdata'),
                        eventAttrs: true
                    });
                    expect(res).to.eql(html);
                });
            }
        });
    });
});