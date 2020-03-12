describe('I18n parser', function() {
    'use strict';

    describe('instance', function() {
        it('Should get an i18n parser instance', function() {
            var parser = new FireTPL.I18nParser();
            expect(parser).to.be.an(FireTPL.I18nParser);
        });
    });

    describe('flattn', function() {
        it('Should flat a nested object', function() {
            var parser = new FireTPL.I18nParser();
            expect(parser.flattn({
                hello: 'Hello $name!',
                btn: {
                    submit: {
                        sing: 'Absenden'
                    },
                    cancle: {
                        sing: 'Hallo $name!',
                        plur: 'Hallo $name!',
                        key: '$name'
                    }
                },
                msg: {
                    prompt: {
                        error: {
                            login: 'Login failed',
                            logout: {
                                sing: 'Logout failed'
                            }
                        }
                    }
                }
            })).to.eql([
                ['hello', 'Hello $name!'],
                ['btn.submit', 'Absenden'],
                ['btn.cancle', {
                        sing: 'Hallo $name!',
                        plur: 'Hallo $name!',
                        key: '$name'
                    }
                ],
                ['msg.prompt.error.login', 'Login failed'],
                ['msg.prompt.error.logout', 'Logout failed']
            ]);
        });
    });

    describe('add', function() {
        var parser;

        before(function() {
            parser = new FireTPL.I18nParser();
        });
        
        it('Should add a language file', function() {
            expect(parser.lang).to.be.an('object');
            expect(parser.lang).to.be.eql({});

            parser.add('en', {
                hello: 'Hello $name'
            });

            expect(parser.lang).to.be.eql({
                'hello': {
                    'en': 'Hello $name'
                }
            });
        });

        it('Should add german', function() {
            

            parser.add('de', {
                hello: {
                    plur: 'Hallo $name',
                    sing: ''
                }
            });

            expect(parser.lang).to.be.eql({
                'hello': {
                    'en': 'Hello $name',
                    'de': 'Hallo $name'
                }
            });
        });
    });

    describe('addItem', function() {
        var parser;

        before(function() {
            parser = new FireTPL.I18nParser();
        });
        
        it('Should add an i18n item', function() {
            parser.addItem('en', 'txt.value', 'English text');
            parser.addItem('de', 'txt.value', 'German text');

            expect(parser.lang).to.eql({
                'txt.value': {
                    'en': 'English text',
                    'de': 'German text'
                }
            });
        });
    });

    describe('parse', function() {var parser;

        before(function() {
            parser = new FireTPL.I18nParser();

            parser.add('en',{
                hello: 'Hello $name!',
                btn: {
                    submit: {
                        sing: 'Submit'
                    },
                    cancle: {
                        sing: 'Cancel'
                    }
                },
                msg: {
                    prompt: {
                        error: {
                            login: 'Login failed',
                            logout: {
                                sing: 'Logout failed'
                            }
                        }
                    }
                },
                txt: {
                    label: {
                        amount: {
                            sing: 'Item',
                            plur: 'Items',
                            key: '$numItems'
                        }
                    }
                }
            });

            parser.add('de',{
                hello: 'Hallo $name!',
                btn: {
                    submit: {
                        sing: 'Absenden'
                    },
                    cancle: {
                        sing: 'Abbrechen',
                    }
                },
                msg: {
                    prompt: {
                        error: {
                            login: 'Login fehlgeschlagen',
                            logout: {
                                sing: 'Logout fehlgeschlagen'
                            }
                        }
                    }
                },
                txt: {
                    label: {
                        amount: {
                            sing: 'Artikel',
                        }
                    }
                }
            });
        });

        it('Should parse an i18n file', function() {
            var fn = parser.parse();
            expect(fn).to.eql('FireTPL.locale=function(key,data,lang){var curLang=lang||FireTPL.i18nCurrent;' +
                'switch(key){' +
                'case\'hello\':switch(curLang){case\'de\':return \'Hallo \'+data.name+\'!\';default:return \'Hello \'+data.name+\'!\';}' +
                'case\'btn.submit\':switch(curLang){case\'de\':return \'Absenden\';default:return \'Submit\';}' +
                'case\'btn.cancle\':switch(curLang){case\'de\':return \'Abbrechen\';default:return \'Cancel\';}' +
                'case\'msg.prompt.error.login\':switch(curLang){case\'de\':return \'Login fehlgeschlagen\';default:return \'Login failed\';}' +
                'case\'msg.prompt.error.logout\':switch(curLang){case\'de\':return \'Logout fehlgeschlagen\';default:return \'Logout failed\';}' +
                'case\'txt.label.amount\':switch(curLang){case\'de\':return \'Artikel\';default:return data.numItems===1?\'Item\':\'Items\';}' +
                'default:return FireTPL.i18nFallbackText;' +
                '}};'
            );
        });
    });
});