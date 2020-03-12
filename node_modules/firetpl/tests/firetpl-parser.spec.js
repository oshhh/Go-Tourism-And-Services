describe('Parser', function() {
    'use strict';

    var Parser = FireTPL.Parser;

    var predefinedSyntaxConfig = {
        "pattern": [
            {
                "name": "tag",
                "func": "parseTag",
                "args": ["tag"],
                "parts": [
                    {
                        "name": "tagName",
                        "pattern": "([a-zA-Z][a-zA-Z0-9:_-]*)"
                    }
                ]
            }, {
                "name": "string",
                "func": "parseString",
                "args": ["string"],
                "parts": [
                    {
                        "name": "stringValue",
                        "pattern": "\"([^\"]*)\""
                    }
                ]
            }, {
                "name": "variable",
                "func": "parseVariable",
                "args": ["variableString"],
                "parts": [
                    {
                        "name": "variableString",
                        "pattern": "([@\\$](?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:\"[^\"]*\"|'[^']*'|\\d+))*\\))?)+)"
                    }
                ]
            }
        ]
    };

    describe('Instance', function() {
        it('Should be an instance of FireTPL.Parser', function() {
            expect(Parser).to.be.a('function');
            expect(new Parser()).to.be.a(Parser);
        });
    });

    describe('newScope', function() {
        var instance;

        beforeEach(function() {
            instance = new FireTPL.Parser();
        });

        it('Should add a new scope', function() {
            instance.newScope('scope001');
            expect(instance.curScope).to.eql(['scope001', 'root']);
            expect(instance.out).to.eql({ root: '', scope001: '' });
        });
    });

    describe('append', function() {
        it('Should append to out str', function() {
            var fireTpl = new FireTPL.Parser();
            fireTpl.out = { root: '' };
            fireTpl.append('str', '<div>');
            fireTpl.append('code', 'if(data.bla){');
            fireTpl.append('str', 'Hello');
            fireTpl.append('code', '}');
            fireTpl.append('code', 'else{');
            fireTpl.append('str', 'Good bye');
            fireTpl.append('code', '}');
            fireTpl.append('str', '</div>');
            expect(fireTpl.out.root).to.eql('s+=\'<div>\';if(data.bla){s+=\'Hello\';}else{s+=\'Good bye\';}s+=\'</div>');
        });
    });

    describe('flush', function() {
        var instance;

        beforeEach(function() {
            instance = new FireTPL.Parser();
        });

        it('Should get the output stream', function() {
            instance.out = {
                root: 's+=\'<html><head></head><body><div>\'+scope001(data)+\'</div></body></html>\';',
                scope001: 's+=\'<div class="listing"><div>\'+scope002(data.listing)+\'</div></div>\';',
                scope002: 's+=\'<img src="\'+data.img+\'">\';'
            };

            expect(instance.flush()).to.eql(
                'scopes=scopes||{};var root=data,parent=data;' +
                'scopes.scope002=function(data,parent){var s=\'\';s+=\'<img src="\'+data.img+\'">\';return s;};' +
                'scopes.scope001=function(data,parent){var s=\'\';s+=\'<div class="listing"><div>\'+scope002(data.listing)+\'</div></div>\';return s;};' +
                'var s=\'\';' +
                's+=\'<html><head></head><body><div>\'+scope001(data)+\'</div></body></html>\';'
            );
        });
    });

    describe('patternBuilder', function() {
        var parser,
            getSyntaxConfStub;

        beforeEach(function() {
            parser = new Parser();
            parser.syntax = predefinedSyntaxConfig;
        });

        it('Should create a names array from syntax conf', function() {
            var pat = parser.patternBuilder();
            expect(pat.names).to.eql([
                { name: 'tag', index: 1},
                { name: 'tagName', index: 2},
                { name: 'string', index: 3},
                { name: 'stringValue', index: 4},
                { name: 'variable', index: 5},
                { name: 'variableString', index: 6}
            ]);
        });

        it('Should create a funcs array from syntax conf', function() {
            var pat = parser.patternBuilder();
            expect(pat.funcs).to.eql([
                { func: 'parseTag', args: [1], index: 1},
                { func: 'parseString', args: [3], index: 3},
                { func: 'parseVariable', args: [6], index: 5}
            ]);
        });

        it('Should create a pattern from syntax conf', function() {
            var pattern = '(([a-zA-Z][a-zA-Z0-9:_-]*))|' +
                '(\"([^\"]*)\")|' +
                '(([@\\$](?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:"[^"]*"|\'[^\']*\'|\\d+))*\\))?)+))';

            var pat = parser.patternBuilder();
            expect(pat.pattern).to.eql(pattern);
        });

        it('Should create a firetpl pattern', function() {
            var getSyntaxConfStub = sinon.stub(Parser.prototype, 'getSyntaxConf');
            var parser = new Parser();

            expect(getSyntaxConfStub).to.be.calledOnce();
            expect(getSyntaxConfStub).to.be.calledWith('fire');
            
            getSyntaxConfStub.restore();
        });

        it('Should create a hbs pattern', function() {
            var getSyntaxConfStub = sinon.stub(Parser.prototype, 'getSyntaxConf');
            var parser = new Parser({
                type: 'hbs'
            });

            expect(getSyntaxConfStub).to.be.calledOnce();
            expect(getSyntaxConfStub).to.be.calledWith('hbs');
            
            getSyntaxConfStub.restore();
        });
    });

    describe('patternBuilder with subpattern', function() {
        var parser;

        beforeEach(function() {
            parser = new Parser();
            parser.syntax = predefinedSyntaxConfig;
        });

        it('Should get a sub pattern', function() {
            var pat = parser.patternBuilder('variable');
            expect(pat.names).to.eql([
                { name: 'variable', index: 1},
                { name: 'variableString', index: 2}
            ]);
        });

        it('Should create a funcs array from syntax conf', function() {
            var pat = parser.patternBuilder('variable');
            expect(pat.funcs).to.eql([
                { func: 'parseVariable', args: [2], index: 1}
            ]);
        });

        it('Should create a pattern from syntax conf', function() {
            var pattern = '(([@\\$](?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:"[^"]*"|\'[^\']*\'|\\d+))*\\))?)+))';

            var pat = parser.patternBuilder('variable');
            expect(pat.pattern).to.eql(pattern);
        });
    });

    describe('getIndention', function() {
        it('Should get the number of indention', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            var indention = fireTpl.getIndention('\t\t');
            expect(indention).to.eql(2);
        });

        it('Should get indention from an empty string', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            var indention = fireTpl.getIndention('');
            expect(indention).to.eql(0);
        });

        it('Should get indention from a null object', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            var indention = fireTpl.getIndention(null);
            expect(indention).to.eql(0);
        });

        it('Should throw an indention error if indention is to deep', function() {
            var fireTpl = new Parser();
            fireTpl.inputStream = '';
            fireTpl.lastIndention = 1;
            
            var fn = function()  {
                fireTpl.getIndention('\t\t\t');
            };

            expect(fn).to.throwError('invalid indention');
        });
    });

    describe('getIndention (using spaces)', function() {
        it('Should get the number of indention', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            var indention = fireTpl.getIndention('        ');
            expect(indention).to.eql(2);
        });

        it('Should get indention from an empty string', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            var indention = fireTpl.getIndention('');
            expect(indention).to.eql(0);
        });

        it('Should get indention from a null object', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            var indention = fireTpl.getIndention(null);
            expect(indention).to.eql(0);
        });

        it('Should throw an invalid indention error', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            fireTpl.inputStream = '';

            var fn = function() {
                fireTpl.getIndention('       ');
            };
            expect(fn).to.throwError('Invalid indention');
        });
    });

    describe('getIndention (using spaces and tabs)', function() {
        it('Should get the number of indention', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            var indention = fireTpl.getIndention('\t    ');
            expect(indention).to.eql(2);
        });

        it('Should get indention from an empty string', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            var indention = fireTpl.getIndention('');
            expect(indention).to.eql(0);
        });

        it('Should get indention from a null object', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            var indention = fireTpl.getIndention(null);
            expect(indention).to.eql(0);
        });

        it('Should throw an invalid indention error (using spaces and tabs)', function() {
            var fireTpl = new Parser();
            fireTpl.lastIndention = 1;
            var fn = function() {
                fireTpl.getIndention('\t       ');
            };
            expect(fn).to.throwError('Invalid indention');
        });
    });

    describe('matchVariables', function() {
        it('Should parse a string for variables', function() {
            var str = 'Hello $name!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello \'+f.escape(data.name)+\'!');
        });

        it('Should parse a string for variables', function() {
            var str = '@hello $name!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data.name)+\'!');
        });

        it('Should parse a string for variables and skip any escape seequences', function() {
            var str = 'Hello $name, my name is Dr \\$uper!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello \'+f.escape(data.name)+\', my name is Dr $uper!');
        });

        it('Should parse a string for variables and inline functions', function() {
            var str = 'Hello $name.ucase()!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello \'+f.escape(f.ucase(data.name))+\'!');
        });

        it('Should parse a string for variables and inline chained functions', function() {
            var str = 'Hello $name.ucase().bold()!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello \'+f.escape(f.bold(f.ucase(data.name)))+\'!');
        });

        it('Should parse a string for variables and inline functions with args', function() {
            var str = 'Hello $name.when("green").then("Green")!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello \'+f.escape(f.then(f.when(data.name,\'green\'),\'Green\'))+\'!');
        });

        it('Should parse a string for locale tags', function() {
            var str = '@hello $name!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data.name)+\'!');
        });

        it('Should parse a string for multiple variables and locale tags', function() {
            var str = '@hello $name! I\'m $reporter and live in $country!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data.name)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse a string ', function() {
            var str = '@hello $name! I\'m $reporter and live in $country!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data.name)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse a string and $this should point to data', function() {
            var str = '@hello $this! I\'m $reporter and live in $country!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse a string and $this.name should point to data', function() {
            var str = '@hello $this.name! I\'m $reporter and live in $country!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data.name)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse a string and $parent.name should point to data', function() {
            var str = '@hello $parent.name! I\'m $reporter and live in $country!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(parent.name)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse a string and $root.name should point to data', function() {
            var str = '@hello $root.name! I\'m $reporter and live in $country!';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(root.name)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse escape sequences', function() {
            var str = 'Escape \\$name \\@at and \\\\ within a string';
            var fireTpl = new Parser();
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Escape $name @at and \\ within a string');
        });
    });

    describe('matchVariables in hbs mode', function() {
        it('Should parse a string for variables', function() {
            var str = 'Hello {{name}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello \'+f.escape(data.name)+\'!');
        });

        it('Should parse a string for variables', function() {
            var str = '@hello {{name}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data.name)+\'!');
        });

        it('Should parse a string for variables and skip any escape seequences', function() {
            var str = 'Hello {{name}}, my name is Dr \\{{super}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello \'+f.escape(data.name)+\', my name is Dr {{super}}!');
        });

        it('Should parse a string for variables and inline functions', function() {
            var str = 'Hello {{name.ucase()}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello \'+f.escape(f.ucase(data.name))+\'!');
        });

        it('Should parse a string for variables and inline chained functions', function() {
            var str = 'Hello {{name.ucase().bold()}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello \'+f.escape(f.bold(f.ucase(data.name)))+\'!');
        });

        it('Should parse a string for variables and inline functions with args', function() {
            var str = 'Hello {{name.when("green").then("Green")}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello \'+f.escape(f.then(f.when(data.name,\'green\'),\'Green\'))+\'!');
        });

        it('Should parse a string for locale tags', function() {
            var str = '@hello {{name}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data.name)+\'!');
        });

        it('Should parse a string for multiple variables and locale tags', function() {
            var str = '@hello {{name}}! I\'m {{reporter}} and live in {{country}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data.name)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse a string ', function() {
            var str = '@hello {{name}}! I\'m {{reporter}} and live in {{country}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data.name)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse a string and $this should point to data', function() {
            var str = '@hello {{this}}! I\'m {{reporter}} and live in {{country}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse a string and $this.name should point to data', function() {
            var str = '@hello {{this.name}}! I\'m {{reporter}} and live in {{country}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(data.name)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse a string and $parent.name should point to data', function() {
            var str = '@hello {{parent.name}}! I\'m {{reporter}} and live in {{country}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(parent.name)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse a string and $root.name should point to data', function() {
            var str = '@hello {{root.name}}! I\'m {{reporter}} and live in {{country}}!';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+f.escape(root.name)+\'! I\\\'m \'+f.escape(data.reporter)+\' and live in \'+f.escape(data.country)+\'!');
        });

        it('Should parse escape sequences', function() {
            var str = 'Escape \\@at \\{{brackets}} and \\\\ within a string';
            var fireTpl = new Parser({ type: 'hbs' });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Escape @at {{brackets}} and \\ within a string');
        });
    });

    describe.skip('matchVariables scopeTags enabled', function() {
        it('Should parse a string for variables', function() {
            var str = 'Hello $name!';
            var fireTpl = new Parser({ scopeTags: true });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('Hello <scope path="name"></scope>!');
        });

        it('Should parse a string for locale tags', function() {
            var str = '@hello $name!';
            var fireTpl = new Parser({ scopeTags: true });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' <scope path="name"></scope>!');
        });

        it('Should parse a string for multiple variables and locale tags', function() {
            var str = '@hello $name! I\'m $reporter and live in $country!';
            var fireTpl = new Parser({ scopeTags: true });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' <scope path="name"></scope>! I\\\'m <scope path="reporter"></scope> and live in <scope path="country"></scope>!');
        });

        it('Should parse a string ', function() {
            var str = '@hello $name! I\'m $reporter and live in $country!';
            var fireTpl = new Parser({ scopeTags: true });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' <scope path="name"></scope>! I\\\'m <scope path="reporter"></scope> and live in <scope path="country"></scope>!');
        });

        it('Should parse a string and $this should point to data', function() {
            var str = '@hello $this! I\'m $reporter and live in $country!';
            var fireTpl = new Parser({ scopeTags: true });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' \'+data+\'! I\\\'m <scope path="reporter"></scope> and live in <scope path="country"></scope>!');
        });

        it('Should parse a string and $this.name should point to data', function() {
            var str = '@hello $this.name! I\'m $reporter and live in $country!';
            var fireTpl = new Parser({ scopeTags: true });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' <scope path="name"></scope>! I\\\'m <scope path="reporter"></scope> and live in <scope path="country"></scope>!');
        });

        it('Should parse a string and $parent.name should point to data (in a scope)', function() {
            var str = '@hello $parent.name! I\'m $reporter and live in $country!';
            var fireTpl = new Parser({ scopeTags: true });
            fireTpl.curScope.unshift('scope001');
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' <scope path="$parent.name"></scope>! I\\\'m <scope path="reporter"></scope> and live in <scope path="country"></scope>!');
        });

        it('Should parse a string and $parent should not be replaced by a scope tag (in a scope)', function() {
            var str = '@hello $parent! I\'m $reporter and live in $country!';
            var fireTpl = new Parser({ scopeTags: true });
            fireTpl.curScope.unshift('scope001');
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' <scope path="$parent"></scope>! I\\\'m <scope path="reporter"></scope> and live in <scope path="country"></scope>!');
        });

        it('Should parse a string and $root.name should point to data', function() {
            var str = '@hello $root.name! I\'m $reporter and live in $country!';
            var fireTpl = new Parser({ scopeTags: true });
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' <scope path="$root.name"></scope>! I\\\'m <scope path="reporter"></scope> and live in <scope path="country"></scope>!');
        });

        it('Should parse a string and $root should not be replaced by a scope tag (in a scope)', function() {
            var str = '@hello $root! I\'m $reporter and live in $country!';
            var fireTpl = new Parser({ scopeTags: true });
            fireTpl.curScope.unshift('scope001');
            var out = fireTpl.matchVariables(str);
            expect(out).to.eql('\'+l(\'hello\',data)+\' <scope path="$root"></scope>! I\\\'m <scope path="reporter"></scope> and live in <scope path="country"></scope>!');
        });
    });

    describe('matchAttributes', function() {
        var fireTpl;

        beforeEach(function() {
            fireTpl = new Parser();    
        });

        it('Should match all attributes', function() {
            var attrs = ' class="item"';
            expect(fireTpl.matchAttributes(attrs)).to.eql('class="item"');
        });

        it('Should match all attributes, using single quotes', function() {
            var attrs = ' class="item"  id=\'item001\'';
            expect(fireTpl.matchAttributes(attrs)).to.eql('class="item" id=\'item001\'');
        });

        it('Should match all attributes, using no quotes', function() {
            var attrs = ' class="item"  id=item001';
            expect(fireTpl.matchAttributes(attrs)).to.eql('class="item" id=item001');
        });

        it('Should match all attributes, using no value', function() {
            var attrs = ' class="item"  checked';
            expect(fireTpl.matchAttributes(attrs)).to.eql('class="item" checked');
        });

        it('Should match all attributes, over multiple lines', function() {
            var attrs = ' class="item"  \n      id=\'item001\'\n\n        tag=true   checked';
            expect(fireTpl.matchAttributes(attrs)).to.eql('class="item" id=\'item001\' tag=true checked');
        });

        it('Should not match any attributes if value is undefined', function() {
            var attrs;
            expect(fireTpl.matchAttributes(attrs)).to.eql('');
        });

        it('Should not match any attributes if value is null', function() {
            var attrs = null;
            expect(fireTpl.matchAttributes(attrs)).to.eql('');
        });

        it('Should not match any attributes if value is ""', function() {
            var attrs = '';
            expect(fireTpl.matchAttributes(attrs)).to.eql('');
        });
    });

    describe('undent', function() {
        it('Should undent a string block', function() {
            var fireTpl = new Parser();
            var str = '\n' + 
                '        div\n' +     
                '            span\n' +     
                '            "Undented"\n' +     
                '        \n';

            expect(fireTpl.undent(2, str)).to.eql(
                'div\n' +     
                '    span\n' +     
                '    "Undented"\n' +     
                ''
            );     
        });
    });

    describe('escape', function() {
        it('Should escape a string', function() {
            var fireTpl = new Parser();
            var str = fireTpl.escape('Hello \'Andi\'');
            expect(str).to.eql('Hello \\\'Andi\\\'');
        });
    });

    describe('htmlEscape', function() {
        it('Should escape a html string', function() {
            var fireTpl = new Parser();
            var str = fireTpl.htmlEscape('Hello "Andi"');
            expect(str).to.eql('Hello &quot;Andi&quot;');
        });
    });

    describe('grepNextChar', function() {
        it('Should grep next char in a string', function() {
            var fireTpl = new Parser();
            fireTpl.pos = 17;
            fireTpl.inputStream = 'Ich bin ein Uhu!"\n\t      "Bla ahhhahaha"';
            expect(fireTpl.grepNextChar()).to.eql('"');
            expect(fireTpl.pos).to.eql(17);
        });
    });

    describe('injectAtribute', function() {
        it('Should inject an attribute', function() {
            var fireTpl = new Parser();
            fireTpl.out.root = '<div><div class="test">';
            fireTpl.lastTagPos.root = 5;

            fireTpl.injectAtribute('id', 'test123');

            expect(fireTpl.out.root).to.eql('<div><div class="test" id="test123">');
        });

        it('Should inject an existing attribute', function() {
            var fireTpl = new Parser();
            fireTpl.out.root = '<div><div class="test">';
            fireTpl.lastTagPos.root = 5;

            fireTpl.injectAtribute('class', 'test123', ' ');

            expect(fireTpl.out.root).to.eql('<div><div class="test test123">');
        });

        it('Should inject an existing attribute and should trigger an error', function() {
            var fireTpl = new Parser();
            fireTpl.out.root = '<div><div class="test">';
            fireTpl.lastTagPos.root = 5;

            expect(fireTpl.injectAtribute.bind(fireTpl, 'class', 'test123')).to.throwException(function(err) {
                expect(err.message).to.eql('Attribute class already exists!');
            });

            expect(fireTpl.out.root).to.eql('<div><div class="test">');
        });
    });

    describe('parse', function() {
        var stubs;

        var parser, 
            result;

        beforeEach(function() {
            stubs = ['parseTag', 'parseCloseTag', 'parseString', 'parseVariable', 'parseHelper',
            'parseCodeBlock', 'parseAttribute', 'parseIndention', 'parseEmptyLine', 'parseComment',
            'parseInclude', 'parseLineOption'];

            result = [];
            parser = new Parser();
            stubs = stubs.map(function(stub) {
                return sinon.stub(parser, stub, function() {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(stub);
                    result.push(args);
                });
            });
        });
        
        afterEach(function() {
            stubs.forEach(function(stub) {
                stub.restore();
            });
        });

        it('Should parse a tag', function() {
            var tmpl =
                '/**\n' +
                ' * Example template\n' +
                ' */\n' +
                'div\n' +
                '    //A simple example\n' +
                '    span "Hello World". //Say hello ;)\n' +
                '    \n' +
                '    :if $name\n' +
                '        span $name.\n' +
                '        span $state.if("loggedin", "Logged-in", "Logged-out")\n' +
                '\n' +
                '    /* Register block */\n' +
                '    div class="register"\n' +
                '        id="regform"\n' +
                '            "Create new account $name"\n';

            parser.parse(tmpl);
            expect(result).to.eql([
                ['parseComment', '/**\n * Example template\n */'],
                ['parseIndention', '\n'],
                ['parseTag', 'div'],
                ['parseComment', '//A simple example'],
                ['parseIndention', '    '],
                ['parseTag', 'span'],
                ['parseString', 'Hello World'],
                ['parseLineOption', '.'],
                ['parseComment', '//Say hello ;)'],
                ['parseEmptyLine', '    '],
                ['parseIndention', '    '],
                ['parseHelper', 'if', '$name', undefined, undefined],
                ['parseIndention', '        '],
                ['parseTag', 'span'],
                ['parseVariable', '$name'],
                ['parseLineOption', '.'],
                ['parseIndention', '        '],
                ['parseTag', 'span'],
                ['parseVariable', '$state.if("loggedin", "Logged-in", "Logged-out")'],
                ['parseComment', '/* Register block */'],
                ['parseIndention', '    '],
                ['parseTag', 'div'],
                ['parseAttribute', 'class', '"register"'],
                ['parseIndention', '        '],
                ['parseAttribute', 'id', '"regform"'],
                ['parseIndention', '            '],
                ['parseString', 'Create new account $name']
            ]);
        });

        it('Should parse a code block', function() {
            var tmpl =
                'div\n' +
                '    ```js\n' +
                '        var bla = "blubb";\n' +
                '        bla = bla.concat(`$inlineVar`).trim();\n' +
                '        console.log(bla);\n' +
                '    ```\n';

            parser.parse(tmpl);
            expect(result).to.eql([
                ['parseTag', 'div'],
                ['parseIndention', '    '],
                ['parseCodeBlock', 'js',
                    '\n' +
                    '        var bla = "blubb";\n' +
                    '        bla = bla.concat(`$inlineVar`).trim();\n' +
                    '        console.log(bla);\n    '
                ]
            ]);
        });

        it('Should parse a include block', function() {
            var tmpl =
                'div\n' +
                '    > myInclude\n' +
                '';

            parser.parse(tmpl);
            expect(result).to.eql([
                ['parseTag', 'div'],
                ['parseIndention', '    '],
                ['parseInclude', 'myInclude']
            ]);
        });

        it('Should parse brace wrapped vars', function() {
            var tmpl =
                'div\n' +
                '    :if ${name}\n' +
                '        span ${name}.\n' +
                '        span $state.if("loggedin", "Logged-in", "Logged-out")\n' +
                '';
            parser.parse(tmpl);
            expect(result).to.eql([
                ['parseTag', 'div'],
                ['parseIndention', '    '],
                ['parseHelper', 'if', '${name}', undefined, undefined],
                ['parseIndention', '        '],
                ['parseTag', 'span'],
                ['parseVariable', '${name}'],
                ['parseLineOption', '.'],
                ['parseIndention', '        '],
                ['parseTag', 'span'],
                ['parseVariable', '$state.if("loggedin", "Logged-in", "Logged-out")'],
            ]);
        });

        it('Should parse a doctype tag', function() {
            var tmpl =
                'dtd\n' +
                'html\n' +
                '';
            parser.parse(tmpl);
            expect(result).to.eql([
                ['parseTag', 'dtd'],
                ['parseIndention', '\n'],
                ['parseTag', 'html'],
            ]);
        });

        it('Should parse a set of code tags', function() {
            var tmpl =
                'div\n' +
                '    h3 id="tags" "Tags"\n' +
                '        div class="description"\n' +
                '            div class="fire"\n' +
                '                ```fire\n' +
                '                    div\n' +
                '                        span "Hello World"\n' +
                '                ```\n' +
                '            div class="hbs"\n' +
                '                ```hbs\n' +
                '                    <div>\n' +
                '                        <span>Hello World</span>\n' +
                '                    </div>\n' +
                '                ```\n' +
                '            div class="html"\n' +
                '                ```html\n' +
                '                    <div>\n' +
                '                        <span>Hello World</span>\n' +
                '                    </div>\n' +
                '                ```\n' +
                '';
            parser.parse(tmpl);
            expect(result).to.eql([
                ['parseTag', 'div'],
                ['parseIndention', '    '],
                ['parseTag', 'h3'],
                ['parseAttribute', 'id', '"tags"'],
                ['parseString', 'Tags'],
                ['parseIndention', '        '],
                ['parseTag', 'div'],
                ['parseAttribute', 'class', '"description"'],
                ['parseIndention', '            '],
                ['parseTag', 'div'],
                ['parseAttribute', 'class', '"fire"'],
                ['parseIndention', '                '],
                ['parseCodeBlock', 'fire',
                '\n                    div\n' +
                '                        span "Hello World"\n' +
                '                '],
                ['parseIndention', '            '],
                ['parseTag', 'div'],
                ['parseAttribute', 'class', '"hbs"'],
                ['parseIndention', '                '],
                ['parseCodeBlock', 'hbs',
                '\n                    <div>\n' +
                '                        <span>Hello World</span>\n' +
                '                    </div>\n' +
                '                '],
                ['parseIndention', '            '],
                ['parseTag', 'div'],
                ['parseAttribute', 'class', '"html"'],
                ['parseIndention', '                '],
                ['parseCodeBlock', 'html',
                '\n                    <div>\n' +
                '                        <span>Hello World</span>\n' +
                '                    </div>\n' +
                '                ']
                
            ]);
        });
    });

    describe('parse hbs', function() {
        var stubs;

        var parser, 
            result;

        beforeEach(function() {
            stubs = ['parseTag', 'parseCloseTag', 'parseHtmlString', 'parseVariable', 'parseHelper',
            'parseCodeBlock', 'parseAttribute', 'parseIndention', 'parseEmptyLine', 'parseComment',
            'parseInclude'];

            result = [];
            parser = new Parser({
                type: 'hbs'
            });

            stubs = stubs.map(function(stub) {
                return sinon.stub(parser, stub, function() {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(stub);
                    result.push(args);
                });
            });
        });
        
        afterEach(function() {
            stubs.forEach(function(stub) {
                stub.restore();
            });
        });

        it('Should parse a tag', function() {
            var tmpl =
                '{{!--\n' +
                '  Example template\n' +
                '--}}\n' +
                '<div>\n' +
                '    {{! A simple example }}\n' +
                '    <span>Hello World</span> {{! Say hello ;) }}\n' +
                '    \n' +
                '    {{#if name}}\n' +
                '        <span>{{name}}</span>\n' +
                '        <span>{{state.if("loggedin", "Logged-in", "Logged-out")}}</span>\n' +
                '\n' +
                '    <!-- Register block -->\n' +
                '    <div class="register" id="regform">\n' +
                '        Create new account {{name}}\n' +
                '    </div>\n' +
                '</div>\n' +
                '\n';

            parser.parse(tmpl);

            expect(result).to.eql([
                ['parseComment', '{{!--\n  Example template\n--}}'],
                ['parseTag', 'div', undefined],
                ['parseComment', '{{! A simple example }}'],
                ['parseTag', 'span', undefined],
                ['parseHtmlString', 'Hello World'],
                ['parseCloseTag', 'span'],
                ['parseComment', '{{! Say hello ;) }}'],
                ['parseHelper', 'if', 'name'],
                ['parseTag', 'span', undefined],
                ['parseHtmlString', '{{name}}'],
                ['parseCloseTag', 'span'],
                ['parseTag', 'span', undefined],
                ['parseHtmlString', '{{state.if("loggedin", "Logged-in", "Logged-out")}}'],
                ['parseCloseTag', 'span'],
                ['parseComment', '<!-- Register block -->'],
                ['parseTag', 'div', 'class="register" id="regform"'],
                ['parseHtmlString', 'Create new account {{name}}\n    '],
                ['parseCloseTag', 'div'],
                ['parseCloseTag', 'div']
            ]);
        });

        it('Should parse a include block', function() {
            var tmpl = '<div>{{> myInclude}}</div>';

            parser.parse(tmpl);
            expect(result).to.eql([
                ['parseTag', 'div', undefined],
                ['parseInclude', 'myInclude'],
                ['parseCloseTag', 'div']
            ]);
        });
    });

    

    describe('parseTag', function() {
        it('Should parse a tag', function() {
            var parser = new Parser();
            parser.parseTag('div');

            expect(parser.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div></div>\';');
        });

        it('Should parse a void tag', function() {
            var parser = new Parser();
            parser.parseTag('img');

            expect(parser.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<img>\';');
        });

        it('Should parse a non standard tag', function() {
            var parser = new Parser();
            parser.parseTag('beer');

            expect(parser.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<beer></beer>\';');
        });

        it('Should parse a doctype tag', function() {
            var parser = new Parser();
            parser.parseTag('dtd');

            expect(parser.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<!DOCTYPE html>\';');
        });

        it('Should parse a complex doctype tag', function() {
            var parser = new Parser();
            parser.parsePlain('<!DOCTYPE html PUBLIC\n "-//W3C//DTD XHTML Basic 1.1//EN"\n "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">');

            expect(parser.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<!DOCTYPE html PUBLIC\n "-//W3C//DTD XHTML Basic 1.1//EN"\n "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">\';');
        });
    });

    describe('parseIndention', function() {
        it('Should handle indention on indent', function() {
            var fireTpl = new Parser();
            fireTpl.indention = 2;
            fireTpl.lastIndention = 2;
            fireTpl.closer = ['a', 'b', 'c'];
            fireTpl.parseIndention('\t\t\t');

            expect(fireTpl.indention).to.be(3);
            expect(fireTpl.closer).to.length(3);
            expect(fireTpl.closer).to.eql(['a', 'b', 'c']);
        });

        it('Should handle indention on outdent', function() {
            var fireTpl = new Parser();
            fireTpl.indention = 2;
            fireTpl.lastIndention = 2;
            fireTpl.closer = ['a', 'b', 'c'];
            fireTpl.parseIndention('\t');

            expect(fireTpl.indention).to.be(1);
            expect(fireTpl.closer).to.length(1);
            expect(fireTpl.closer).to.eql(['a']);
        });

        it('Should handle indention on same indention', function() {
            var fireTpl = new Parser();
            fireTpl.indention = 2;
            fireTpl.lastIndention = 2;
            fireTpl.closer = ['a', 'b', 'c'];
            fireTpl.parseIndention('\t\t');

            expect(fireTpl.indention).to.be(2);
            expect(fireTpl.closer).to.length(2);
            expect(fireTpl.closer).to.eql(['a', 'b']);
        });

        it('Should handle 5 step outdention', function() {
            var fireTpl = new Parser();
            fireTpl.indention = 8;
            fireTpl.lastIndention = 8;
            fireTpl.closer = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
            fireTpl.parseIndention('\t\t\t');

            expect(fireTpl.indention).to.be(3);
            expect(fireTpl.closer).to.length(3);
            expect(fireTpl.closer).to.eql(['a', 'b', 'c']);
        });
    });

    describe('parseIndention (using spaces)', function() {
        it('Should handle indention on indent', function() {
            var fireTpl = new Parser();
            fireTpl.indention = 2;
            fireTpl.lastIndention = 2;
            fireTpl.closer = ['a', 'b', 'c'];
            fireTpl.parseIndention('            ');

            expect(fireTpl.indention).to.be(3);
            expect(fireTpl.closer).to.length(3);
            expect(fireTpl.closer).to.eql(['a', 'b', 'c']);
        });

        it('Should handle indention on outdent', function() {
            var fireTpl = new Parser();
            fireTpl.indention = 2;
            fireTpl.lastIndention = 2;
            fireTpl.closer = ['a', 'b', 'c'];
            fireTpl.parseIndention('    ');

            expect(fireTpl.indention).to.be(1);
            expect(fireTpl.closer).to.length(1);
            expect(fireTpl.closer).to.eql(['a']);
        });

        it('Should handle indention on same indention', function() {
            var fireTpl = new Parser();
            fireTpl.indention = 2;
            fireTpl.lastIndention = 2;
            fireTpl.closer = ['a', 'b', 'c'];
            fireTpl.parseIndention('        ');

            expect(fireTpl.indention).to.be(2);
            expect(fireTpl.closer).to.length(2);
            expect(fireTpl.closer).to.eql(['a', 'b']);
        });

        it('Should handle 5 step outdention', function() {
            var fireTpl = new Parser();
            fireTpl.indention = 8;
            fireTpl.lastIndention = 8;
            fireTpl.closer = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
            fireTpl.parseIndention('            ');

            expect(fireTpl.indention).to.be(3);
            expect(fireTpl.closer).to.length(3);
            expect(fireTpl.closer).to.eql(['a', 'b', 'c']);
        });
    });

    describe('parseString', function() {
        it('Should parse a string', function() {
            var fireTpl = new Parser();
            fireTpl.parseString('Hello World!');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'Hello World!\';');
        });

        it('Should parse a string with with variables', function() {
            var fireTpl = new Parser();
            fireTpl.parseString('Hello $name!');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'Hello \'+f.escape(data.name)+\'!\';');
        });

        it('Should parse a string with with multiple variables', function() {
            var fireTpl = new Parser();
            fireTpl.parseString('Hello $name.firstname $name.lastname!');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'Hello \'+f.escape(data.name.firstname)+\' \'+f.escape(data.name.lastname)+\'!\';');
        });

        it('Should parse a string with inline functions', function() {
            var fireTpl = new Parser();
            fireTpl.parseString('Hello $name.if("andi", "Andi", "Other")!');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'Hello \'+f.escape(f.if(data.name,\'andi\',\'Andi\',\'Other\'))+\'!\';');
        });

        it('Should parse a string with line options (space)', function() {
            var fireTpl = new Parser();
            fireTpl.parseString('Hello space');
            fireTpl.parseLineOption('.');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'Hello space \';');
        });
    });

    describe('parseVariable', function() {
        it('Should parse a variable', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$name');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(data.name)+\'\';');
        });

        it('Should parse a noescape variable', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$$name');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+data.name+\'\';');
        });

        it('Should parse a brace wrapped variable', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('${name}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(data.name)+\'\';');
        });

        it('Should parse $this', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$this');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(data)+\'\';');
        });

        it('Should parse $root', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$root.name');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(root.name)+\'\';');
        });

        it('Should parse $parent', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$parent.name');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(parent.name)+\'\';');
        });

        it('Should parse a chained variable variables', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$name.firstname');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(data.name.firstname)+\'\';');
        });

        it('Should parse a variable with inline functions', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$name.if("andi", "Andi", "Other")');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.if(data.name,\'andi\',\'Andi\',\'Other\'))+\'\';');
        });

        it('Should parse a variable with inline functions, using single quotes', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$name.if(\'andi\', \'Andi\', \'Other\')');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.if(data.name,\'andi\',\'Andi\',\'Other\'))+\'\';');
        });

        it('Should parse an inline function with an integer value', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$number.eq(3)');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.eq(data.number,3))+\'\';');
        });

        it('Should parse a variable with inline functions, using single quotes in args', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$name.if("andi", "\'Andi\'", "\'Other\'")');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.if(data.name,\'andi\',\'\\\'Andi\\\'\',\'\\\'Other\\\'\'))+\'\';');
        });

        it('Should parse a variable with inline functions, using double quotes in args', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$name.if("andi", \'\"Andi\"\', \'\"Other\"\')');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.if(data.name,\'andi\',\'\"Andi\"\',\'\"Other\"\'))+\'\';');
        });

        it('Should parse a variable with multiple inline functions', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$name.when("andi").then("Andi")');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(data.name,\'andi\'),\'Andi\'))+\'\';');
        });

        it('Should parse a chained variable with multiple inline functions', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$name.firstname.when("andi").then("Andi")');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(data.name.firstname,\'andi\'),\'Andi\'))+\'\';');
        });

        it('Should parse a parent variable with multiple inline functions', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$parent.name.when("andi").then("Andi")');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(parent.name,\'andi\'),\'Andi\'))+\'\';');
        });

        it('Should parse a chained parent variable with multiple inline functions', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$parent.name.firstname.when("andi").then("Andi")');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(parent.name.firstname,\'andi\'),\'Andi\'))+\'\';');
        });

        it('Should parse a root variable with multiple inline functions', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$root.name.when("andi").then("Andi")');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(root.name,\'andi\'),\'Andi\'))+\'\';');
        });

        it('Should parse a chained root variable with multiple inline functions', function() {
            var fireTpl = new Parser();
            fireTpl.parseVariable('$root.name.firstname.when("andi").then("Andi")');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(root.name.firstname,\'andi\'),\'Andi\'))+\'\';');
        });
    });

    describe('parseVariable in hbs mode', function() {
        it('Should parse a variable', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{name}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(data.name)+\'\';');
        });

        it('Should parse a noescape variable', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{{name}}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+data.name+\'\';');
        });

        it('Should parse $this', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{this}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(data)+\'\';');
        });

        it('Should parse $root', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{root.name}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(root.name)+\'\';');
        });

        it('Should parse $parent', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{parent.name}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(parent.name)+\'\';');
        });

        it('Should parse a chained variable variables', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{name.firstname}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(data.name.firstname)+\'\';');
        });

        it('Should parse a variable with inline functions', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{name.if("andi", "Andi", "Other")}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.if(data.name,\'andi\',\'Andi\',\'Other\'))+\'\';');
        });

        it('Should parse a variable with inline functions, using single quotes', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{name.if(\'andi\', \'Andi\', \'Other\')}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.if(data.name,\'andi\',\'Andi\',\'Other\'))+\'\';');
        });

        it('Should parse an inline function with an integer value', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{number.eq(3)}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.eq(data.number,3))+\'\';');
        });

        it('Should parse a variable with inline functions, using single quotes in args', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{name.if("andi", "\'Andi\'", "\'Other\'")}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.if(data.name,\'andi\',\'\\\'Andi\\\'\',\'\\\'Other\\\'\'))+\'\';');
        });

        it('Should parse a variable with inline functions, using double quotes in args', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{name.if("andi", \'\"Andi\"\', \'\"Other\"\')}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.if(data.name,\'andi\',\'\"Andi\"\',\'\"Other\"\'))+\'\';');
        });

        it('Should parse a variable with multiple inline functions', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{name.when("andi").then("Andi")}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(data.name,\'andi\'),\'Andi\'))+\'\';');
        });

        it('Should parse a chained variable with multiple inline functions', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{name.firstname.when("andi").then("Andi")}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(data.name.firstname,\'andi\'),\'Andi\'))+\'\';');
        });

        it('Should parse a parent variable with multiple inline functions', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{parent.name.when("andi").then("Andi")}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(parent.name,\'andi\'),\'Andi\'))+\'\';');
        });

        it('Should parse a chained parent variable with multiple inline functions', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{parent.name.firstname.when("andi").then("Andi")}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(parent.name.firstname,\'andi\'),\'Andi\'))+\'\';');
        });

        it('Should parse a root variable with multiple inline functions', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{root.name.when("andi").then("Andi")}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(root.name,\'andi\'),\'Andi\'))+\'\';');
        });

        it('Should parse a chained root variable with multiple inline functions', function() {
            var fireTpl = new Parser({ type: 'hbs' });
            fireTpl.parseVariable('{{root.name.firstname.when("andi").then("Andi")}}');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'\'+f.escape(f.then(f.when(root.name.firstname,\'andi\'),\'Andi\'))+\'\';');
        });
    });

    describe('parseHelper', function() {
        it('Should parse a helper', function() {
            var fireTpl = new Parser();
            fireTpl.parseHelper('if', 'name');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;scopes.scope001=function(data,parent){var s=\'\';var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';return s;});s+=r;return s;};var s=\'\';s+=scopes.scope001(name,data);'); 
        });
    });

    describe('parseAttribute', function() {
        it('Should parse an attribute tag', function() {
            var fireTpl = new Parser();
            fireTpl.parseTag('div');
            fireTpl.parseAttribute('class', 'bla');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div class="bla"></div>\';');
        });

        it('Should parse an attribute tag, value within double quotes', function() {
            var fireTpl = new Parser();
            fireTpl.parseTag('div');
            fireTpl.parseAttribute('class', '"bla"');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div class="bla"></div>\';');
        });

        it('Should parse an attribute tag, value within single quotes', function() {
            var fireTpl = new Parser();
            fireTpl.parseTag('div');
            fireTpl.parseAttribute('class', '\'bla\'');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div class=\\\'bla\\\'></div>\';');
        });

        it('Should parse an tag with multiple attributes', function() {
            var fireTpl = new Parser();
            fireTpl.parseTag('div');
            fireTpl.parseAttribute('class', '\'bla\'');
            fireTpl.parseAttribute('id', '\'blubb\'');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div class=\\\'bla\\\' id=\\\'blubb\\\'></div>\';');
        });

        it('Should parse a tag with a newline attribute', function() {
            var fireTpl = new Parser();
            fireTpl.parseTag('div');
            fireTpl.parseIndention('    ');
            fireTpl.parseAttribute('class', '\'bla\'');
            fireTpl.parseAttribute('id', '\'blubb\'');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div class=\\\'bla\\\' id=\\\'blubb\\\'></div>\';');
        });

        it('Should parse a tag with an event attribute', function() {
            var fireTpl = new Parser({
                eventAttrs: true
            });
            
            fireTpl.parseTag('div');
            fireTpl.parseTag('div');
            fireTpl.parseAttribute('class', '\'bla\'');
            fireTpl.parseAttribute('onClick', '\'click-handler\'');
            fireTpl.parseAttribute('onMove', '\'move-handler\'');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div><div class=\\\'bla\\\' on="click:click-handler;move:move-handler"></div></div>\';');
        });
    });

    describe('parseCodeBlock', function() {
        it('Should parse a code block', function() {
            var fireTpl = new Parser();
            fireTpl.parseTag('div');
            fireTpl.parseIndention('    ');
            fireTpl.parseCodeBlock('js',
                '\n' +
                '        var bla = \'blubb\'\n' +
                '        console.log(bla);\n' +
                '    '
            );

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<div><code class="codeBlock js">var bla = \\\'blubb\\\'\\n\\\nconsole.log(bla);</code></div>\';');
        });
    });

    describe('parseInclude', function() {
        it('Should parse a include tag', function() {
            var fireTpl = new Parser();
            fireTpl.parseTag('div');
            fireTpl.parseIndention('    ');
            fireTpl.parseInclude('myInclude');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;' +
                'var s=\'\';s+=\'<div>\'+p(\'myInclude\',data)+\'</div>\';');
        });
    });

    describe('parsePlain', function() {
        it('Should parse a plain block', function() {
            var fireTpl = new Parser();
            fireTpl.parsePlain('<!DOCTYPE html>');

            expect(fireTpl.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<!DOCTYPE html>\';');
        });
    });

    describe('appendCloser', function() {
        var instance;

        beforeEach(function() {
            instance = new FireTPL.Parser();
            instance.lastItemType = 'code';
        });

        it('Should append a closer to the out stream', function() {
            instance.closer = ['</html>', '</div>'];
            instance.appendCloser();

            expect(instance.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'</div></html>\';');
        });

        it('Should append a closer to the out stream', function() {
            instance.closer = ['</html>', '</div>', ['code', 'data.bla;']];
            instance.appendCloser();
            instance.appendCloser();

            expect(instance.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;var s=\'\';data.bla;s+=\'</div></html>\';');
        });

        it('Should append a closer to the out stream', function() {
            instance.out = { root: '', scope001: '' };
            instance.curScope = ['scope001', 'root'];
            instance.closer = ['</html>', '</div>', '', 'scope', '<img>'];
            instance.lastItemType = 'code';
            instance.appendCloser();
            instance.appendCloser();

            expect(instance.out.root).to.eql('s+=\'</div>');
            expect(instance.out.scope001).to.eql('s+=\'<img>\';');
            expect(instance.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;scopes.scope001=function(data,parent){var s=\'\';s+=\'<img>\';return s;};var s=\'\';s+=\'</div></html>\';');
        });

        it('Should append a closer to the out stream', function() {
            instance.out = { root: '', scope001: '', scope002: '' };
            instance.curScope = ['scope002', 'scope001', 'root'];
            instance.closer = ['</html>', '</div>', '', 'scope', '<img>', '','scope', '<span>'];
            instance.lastItemType = 'code';
            instance.appendCloser();
            instance.appendCloser();
            instance.appendCloser();

            expect(instance.out.root).to.eql('s+=\'</div>');
            expect(instance.out.scope001).to.eql('s+=\'<img>\';');
            expect(instance.out.scope002).to.eql('s+=\'<span>\';');
            expect(instance.flush()).to.eql('scopes=scopes||{};var root=data,parent=data;scopes.scope002=function(data,parent){var s=\'\';s+=\'<span>\';return s;};scopes.scope001=function(data,parent){var s=\'\';s+=\'<img>\';return s;};var s=\'\';s+=\'</div></html>\';');
        });
    });

    describe('parse a fire tpl', function() {
        var tmpl,
            parser,
            next,
            rec,
            res = [],
            stubs = ['parseTag', 'parseCloseTag', 'parseString', 'parseVariable', 'parseHelper',
                'parseCodeBlock', 'parseAttribute', 'parseIndention'];

        before(function() {
            tmpl =
                'div class="firetpl-template"\n' +
                '    h1 "This is a basic firetpl tempalte"\n' +
                '    span $version\n' +
                '    :if $listing\n' +
                '        h2 "Has listings:"\n' +
                '        :each $listing : ul\n' +
                '            li class="item"\n' +
                '                span class="name" $name\n' +
                '                span class="gender" $gender\n' +
                '    :else\n' +
                '        h2 "Hasn\'t any listings!"\n'
            ;

            parser = new Parser();

            rec = coffeeTools.record(parser, stubs);

            parser.parse(tmpl);
            rec.play();
        });

        it('Should parse a template', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('div');
            expect(parser.out.root).to.eql('s+=\'<div>');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... add a class', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseAttribute');
            expect(step.args[0]).to.eql('class', '"firetpl-template"');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template">');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... indent one times', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('    ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template">');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... add a h1 tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('h1');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>');
            expect(parser.closer).to.eql(['</div>', '</h1>']);
        });

        it(' ... add a string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseString');
            expect(step.args[0]).to.eql('This is a basic firetpl tempalte');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte');
            expect(parser.closer).to.eql(['</div>', '</h1>']);
        });

        it(' ... indent one', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('    ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1>');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... add a span tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('span');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>');
            expect(parser.closer).to.eql(['</div>', '</span>']);
        });

        it(' ... add a $version', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseVariable');
            expect(step.args[0]).to.eql('$version');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'');
            expect(parser.closer).to.eql(['</div>', '</span>']);
        });

        it(' ... indent one', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('    ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... add if helper', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHelper');
            expect(step.args[0]).to.eql('if');
            expect(step.args[1]).to.eql('$listing');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope']);
        });

        it(' ... indent two', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('        ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope']);
        });

        it(' ... add h2 tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('h2');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</h2>']);
        });

        it(' ... add a string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseString');
            expect(step.args[0]).to.eql('Has listings:');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</h2>']);
        });

        it(' ... indent two', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('        ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope']);
        });

        it(' ... parse each helper', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHelper');
            expect(step.args).to.eql(['each', '$listing', 'ul', undefined]);
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope']);
        });

        it(' ... indent three', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('            ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope']);
        });

        it(' ... add a li tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('li');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope', '</li>']);
        });

        it(' ... add item class', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseAttribute');
            expect(step.args[0]).to.eql('class', 'item');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item">');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope', '</li>']);
        });

        it(' ... indent four', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('                ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item">');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope', '</li>']);
        });

        it(' ... add tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('span');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope', '</li>', '</span>']);
        });

        it(' ... add name class', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseAttribute');
            expect(step.args[0]).to.eql('class', 'name');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope', '</li>', '</span>']);
        });

        it(' ... add $name variable', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseVariable');
            expect(step.args[0]).to.eql('$name');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope', '</li>', '</span>']);
        });

        it(' ... indent four', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('                ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope', '</li>']);
        });

        it(' ... add span tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('span');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope', '</li>', '</span>']);
        });

        it(' ... add gender class', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseAttribute');
            expect(step.args[0]).to.eql('class', 'gender');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope', '</li>', '</span>']);
        });

        it(' ... add $gender variable', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseVariable');
            expect(step.args[0]).to.eql('$gender');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', ['code', 'return s;});'], 'scope', '</li>', '</span>']);
        });

        it(' ... indent one', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('    ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... add else helper', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHelper');
            expect(step.args[0]).to.eql('else');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>', ['code', ''], ['code', 'return s;});}'], 'scope']);
        });

        it(' ... indent two', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('        ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>', ['code', ''], ['code', 'return s;});}'], 'scope']);
        });

        it(' ... add h2 tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('h2');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';s+=\'<h2>');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>', ['code', ''], ['code', 'return s;});}'], 'scope', '</h2>']);
        });

        it(' ... add string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseString');
            expect(step.args[0]).to.eql('Hasn\'t any listings!');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Hasn\\\'t any listings!');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>', ['code', ''], ['code', 'return s;});}'], 'scope', '</h2>']);
        });

        it(' ... indent zero', function() {
            parser.parseIndention('');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);s+=\'</div>');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Hasn\\\'t any listings!</h2>\';return s;});}');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,\'ul\',\'\',function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql([]);
        });

    });

    describe('parse a hbs tpl', function() {
        var tmpl,
            parser,
            next,
            rec,
            res = [],
            stubs = ['parseTag', 'parseCloseTag', 'parseHtmlString', 'parseVariable', 'parseHelper',
                'parseCodeBlock', 'parseAttribute', 'parseIndention', 'parseCloseHelper', 'parseElseHelper'];

        before(function() {
            tmpl =
                '<div class="firetpl-template">\n' +
                '    <h1>This is a basic firetpl tempalte</h1>\n' +
                '    <span>{{version}}</span>\n' +
                '    {{#if listing}}\n' +
                '        <h2>Has listings:</h2>\n' +
                '        <ul>\n' +
                '            {{#each listing}}\n' +
                '                <li class="item">\n' +
                '                    <span class="name">{{name}}</span>\n' +
                '                    <span class="gender">{{gender}}</span>\n' +
                '                </li>\n' +
                '            {{/each}}\n' +
                '        </ul>\n' +
                '    {{else}}\n' +
                '        <h2>Hasn\'t any listings!</h2>\n' +
                '    {{/if}}\n' +
                '</div>'
            ;

            parser = new Parser({
                type: 'hbs'
            });

            rec = coffeeTools.record(parser, stubs);

            parser.parse(tmpl);
            rec.play();
        });

        it('Should parse a template', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('div');
            expect(step.args[1]).to.eql('class="firetpl-template"');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template">');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... add a h1 tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('h1');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>');
            expect(parser.closer).to.eql(['</div>', '</h1>']);
        });

        it(' ... add a string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHtmlString');
            expect(step.args[0]).to.eql('This is a basic firetpl tempalte');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte');
            expect(parser.closer).to.eql(['</div>', '</h1>']);
        });

        it(' ... add a close h1 tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseTag');
            expect(step.args[0]).to.eql('h1');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1>');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... add a span tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('span');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>');
            expect(parser.closer).to.eql(['</div>', '</span>']);
        });

        it(' ... add a {{version}} string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHtmlString');
            expect(step.args[0]).to.eql('{{version}}');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'');
            expect(parser.closer).to.eql(['</div>', '</span>']);
        });

        it(' ... add a span close tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseTag');
            expect(step.args[0]).to.eql('span');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... add if helper', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHelper');
            expect(step.args[0]).to.eql('if');
            expect(step.args[1]).to.eql('listing');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope']);
        });

        it(' ... add h2 tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('h2');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</h2>']);
        });

        it(' ... add a string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHtmlString');
            expect(step.args[0]).to.eql('Has listings:');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</h2>']);
        });

        it(' ... add a h2 closing tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseTag');
            expect(step.args[0]).to.eql('h2');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope']);
        });

        it(' ... add a ul tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('ul');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>']);
        });

        it(' ... parse each helper', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHelper');
            expect(step.args).to.eql(['each', 'listing']);
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', '', ['code', 'return s;});'], 'scope']);
        });

        it(' ... add a li tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('li');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item">');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', '', ['code', 'return s;});'], 'scope', '</li>']);
        });

        it(' ... add tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('span');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', '', ['code', 'return s;});'], 'scope', '</li>', '</span>']);
        });

        it(' ... add {{name}} variable', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHtmlString');
            expect(step.args[0]).to.eql('{{name}}');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', '', ['code', 'return s;});'], 'scope', '</li>', '</span>']);
        });

        it(' ... add a span closing tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseTag');
            expect(step.args[0]).to.eql('span');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', '', ['code', 'return s;});'], 'scope', '</li>']);
        });

        it(' ... add span tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('span');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', '', ['code', 'return s;});'], 'scope', '</li>', '</span>']);
        });

        it(' ... add {{gender}} variable', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHtmlString');
            expect(step.args[0]).to.eql('{{gender}}');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', '', ['code', 'return s;});'], 'scope', '</li>', '</span>']);
        });

        it(' ... add a span closing tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseTag');
            expect(step.args[0]).to.eql('span');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', '', ['code', 'return s;});'], 'scope', '</li>']);
        });

        it(' ... add a li closing tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseTag');
            expect(step.args[0]).to.eql('li');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>', '', ['code', 'return s;});'], 'scope']);
        });

        it(' ... add an each closing tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseHelper');
            expect(step.args[0]).to.eql('each');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope', '</ul>']);
        });

        it(' ... add a ul closing tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseTag');
            expect(step.args[0]).to.eql('ul');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>', '', ['code', 'return s;});s+=r;'], 'scope']);
        });

        it(' ... add else helper', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseElseHelper');
            expect(step.args[0]).to.eql('else');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>', ['code', ''], ['code', 'return s;});}'], 'scope']);
        });

        it(' ... add h2 tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('h2');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';s+=\'<h2>');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>', ['code', ''], ['code', 'return s;});}'], 'scope', '</h2>']);
        });

        it(' ... add string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseHtmlString');
            expect(step.args[0]).to.eql('Hasn\'t any listings!');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Hasn\\\'t any listings!');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>', ['code', ''], ['code', 'return s;});}'], 'scope', '</h2>']);
        });

        it(' ... close a h2 tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseTag');
            expect(step.args[0]).to.eql('h2');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Hasn\\\'t any listings!</h2>');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>', ['code', ''], ['code', 'return s;});}'], 'scope']);
        });

        it(' ... close an else helper', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseHelper');
            expect(step.args[0]).to.eql('if');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Hasn\\\'t any listings!</h2>\';return s;});}');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql(['</div>']);
        });
        
        it(' ... close an div tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCloseTag');
            expect(step.args[0]).to.eql('div');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>This is a basic firetpl tempalte</h1><span>\'+f.escape(data.version)+\'</span>\';s+=scopes.scope001(data.listing,data);s+=\'</div>');
            expect(parser.out.scope001).to.eql('var c=data;var r=h(\'if\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Has listings:</h2><ul>\';s+=scopes.scope002(data.listing,data);s+=\'</ul>\';return s;});s+=r;if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';s+=\'<h2>Hasn\\\'t any listings!</h2>\';return s;});}');
            expect(parser.out.scope002).to.eql('s+=h(\'each\',data,parent,root,function(data){var s=\'\';s+=\'<li class="item"><span class="name">\'+f.escape(data.name)+\'</span><span class="gender">\'+f.escape(data.gender)+\'</span></li>\';return s;});');
            expect(parser.closer).to.eql([]);
        });
    });

    describe('parse a fire tpl with a code block', function() {
        var tmpl,
            parser,
            next,
            rec,
            res = [],
            stubs = ['parseTag', 'parseCloseTag', 'parseString', 'parseVariable', 'parseHelper',
                'parseCodeBlock', 'parseAttribute', 'parseIndention'];

        before(function() {
            tmpl =
                'div class="firetpl-template"\n' +
                '    h1 "My Code"\n' +
                '    ```js\n' +
                '        $bla = \'blubb\';\n' +
                '        var log = function() {\n' +
                '            console.log($bla, `$inlineVar`);\n' +
                '            return true;\n' +
                '        }\n' +
                '    ```\n\n'
            ;

            parser = new Parser();

            rec = coffeeTools.record(parser, stubs);

            parser.parse(tmpl);
            rec.play();
        });

        it('Should parse a template', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('div');
            expect(parser.out.root).to.eql('s+=\'<div>');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... add attributes', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseAttribute');
            expect(step.args[0]).to.eql('class', '"firetpl-template"');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template">');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... indent one', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('    ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template">');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... parse tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('h1');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>');
            expect(parser.closer).to.eql(['</div>', '</h1>']);
        });

        it(' ... add a string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseString');
            expect(step.args[0]).to.eql('My Code');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>My Code');
            expect(parser.closer).to.eql(['</div>', '</h1>']);
        });

        it(' ... indent one', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('    ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>My Code</h1>');
            expect(parser.closer).to.eql(['</div>']);
        });

        it(' ... add a code block', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseCodeBlock');
            expect(step.args[0]).to.eql('js');
            expect(step.args[1]).to.eql('\n        $bla = \'blubb\';\n        var log = function() {\n            console.log($bla, `$inlineVar`);\n            return true;\n        }\n    ');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>My Code</h1><code class=\"codeBlock js\">$bla = \\\'blubb\\\';\\n\\\nvar log = function() {\\n\\\n    console.log($bla, \'+f.escape(data.inlineVar)+\');\\n\\\n    return true;\\n\\\n}</code>');
            expect(parser.closer).to.eql(['</div>', '']);
        });

        it(' ... indent zero', function() {
            parser.parseIndention('');
            expect(parser.out.root).to.eql('s+=\'<div class="firetpl-template"><h1>My Code</h1><code class=\"codeBlock js\">$bla = \\\'blubb\\\';\\n\\\nvar log = function() {\\n\\\n    console.log($bla, \'+f.escape(data.inlineVar)+\');\\n\\\n    return true;\\n\\\n}</code></div>');
            expect(parser.closer).to.eql([]);
        });
    });


    describe('parse a fire tpl without indentions', function() {
        var tmpl,
            parser,
            next,
            rec,
            res = [],
            stubs = ['parseTag', 'parseCloseTag', 'parseString', 'parseVariable', 'parseHelper',
                'parseCodeBlock', 'parseAttribute', 'parseIndention'];

        before(function() {
            tmpl =
                'h1 "Test page"\n' +
                'p "My Test Text"\n' +
                'p "Second block"\n\n'
            ;

            parser = new Parser();

            rec = coffeeTools.record(parser, stubs);

            parser.parse(tmpl);
            rec.play();
        });

        it('Should parse a template', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('h1');
            expect(parser.out.root).to.eql('s+=\'<h1>');
            expect(parser.closer).to.eql(['</h1>']);
        });

        it(' ... add string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseString');
            expect(step.args[0]).to.eql('Test page');
            expect(parser.out.root).to.eql('s+=\'<h1>Test page');
            expect(parser.closer).to.eql(['</h1>']);
        });

        it(' ... indent zero', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('\n');
            expect(parser.out.root).to.eql('s+=\'<h1>Test page</h1>');
            expect(parser.closer).to.eql([]);
        });

        it(' ... parse tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('p');
            expect(parser.out.root).to.eql('s+=\'<h1>Test page</h1><p>');
            expect(parser.closer).to.eql(['</p>']);
        });

        it(' ... add a string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseString');
            expect(step.args[0]).to.eql('My Test Text');
            expect(parser.out.root).to.eql('s+=\'<h1>Test page</h1><p>My Test Text');
            expect(parser.closer).to.eql(['</p>']);
        });

        it(' ... indent zero', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseIndention');
            expect(step.args[0]).to.eql('\n');
            expect(parser.out.root).to.eql('s+=\'<h1>Test page</h1><p>My Test Text</p>');
            expect(parser.closer).to.eql([]);
        });

        it(' ... parse tag', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseTag');
            expect(step.args[0]).to.eql('p');
            expect(parser.out.root).to.eql('s+=\'<h1>Test page</h1><p>My Test Text</p><p>');
            expect(parser.closer).to.eql(['</p>']);
        });

        it(' ... add a string', function() {
            var step = rec.next();
            expect(step.name).to.eql('parseString');
            expect(step.args[0]).to.eql('Second block');
            expect(parser.out.root).to.eql('s+=\'<h1>Test page</h1><p>My Test Text</p><p>Second block');
            expect(parser.closer).to.eql(['</p>']);
        });
    });

    describe('includeParser', function() {
        var tmpl = 'html\n' +
            '    > header\n' +
            '    body';

        var parser,
            readFileStub;

        beforeEach(function() {
            readFileStub = sinon.stub(FireTPL, 'readFile');
            readFileStub.returns('header\n    h1 "Hello $name"\n');
            
            parser = new FireTPL.Parser();
            parser.parse(tmpl);    
        });

        afterEach(function() {
            readFileStub.restore();
        });

        it('Should remember all includes', function() {
            expect(parser.includes).to.eql(['header']);
        });

        it('Should parse a include', function() {
            expect(parser.includes).to.eql(['header']);
            parser.includesPath = './includes/';
            var includes = parser.includeParser();

            expect(readFileStub).to.be.calledOnce();
            expect(readFileStub).to.be.calledWith('./includes/header.fire');

            expect(includes).to.eql([{
                include: 'header',
                source: 'scopes=scopes||{};var root=data,parent=data;var s=\'\';s+=\'<header><h1>Hello \'+f.escape(data.name)+\'</h1></header>\';'
            }]);
        });
    });

    describe('Escaping', function() {
        var parser;

        beforeEach(function() {
            parser = new FireTPL.Parser();
        });

        it('Should handle escaping of special chars in a string block', function() {
            var str = 'String with escaped chars \\" \\< \\> \\& \\$ \\@ \\\\';
            parser.parseString(str);
            expect(parser.out.root).to.eql('s+=\'String with escaped chars " < > & $ @ \\');
        });

        it('Should handle escaping of special chars in a html block', function() {
            var str = 'String with escaped chars \\\' \\< \\> \\& \\$ \\@';
            parser.parseHtmlString(str);
            expect(parser.out.root).to.eql('s+=\'String with escaped chars \' < > & $ @');
        });

        it('Should handle escaping of special chars in a code block', function() {
            var str = 'String with escaped chars \\\``` \\$ \\@';
            parser.parseCodeBlock('', str);
            expect(parser.out.root).to.eql('s+=\'<code class="codeBlock">String with escaped chars ``` $ @</code>');
        });
    });

    describe('Escaping in hbs', function() {
        var parser;

        beforeEach(function() {
            parser = new FireTPL.Parser({
                type: 'hbs'
            });
        });

        it('Should handle escaping of special chars in a string block', function() {
            var str = 'String with escaped chars \\{{{bla}}} \\{{blub}} \\@ \\\\';
            parser.parseString(str);
            expect(parser.out.root).to.eql('s+=\'String with escaped chars {{{bla}}} {{blub}} @ \\');
        });

        it('Should handle escaping of special chars in a html block', function() {
            var str = 'String with escaped chars \\{{{bla}}} \\{{blub}} \\@ \\\\';
            parser.parseHtmlString(str);
            expect(parser.out.root).to.eql('s+=\'String with escaped chars {{{bla}}} {{blub}} @ \\');
        });
    });
});