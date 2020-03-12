'use strict';

let co = require('../index.js');
let inspect = require('inspect.js');
// let sinon = require('sinon');

describe('co.pipe()', function() {
    'use strict';

    describe('pipe', function() {
        it('Should fail if args param is not an object', function() {
            inspect(co.pipe).withArgs().doesThrow(/First argument must be an array/);
        });

        it('Should pipe functions in series', function(done) {
            let func1 = function(obj, done) {
                obj.a = true;
                done(null, obj);
            }
            let func2 = function(obj, done) {
                obj.b = true;
                done(null, obj);
            }
            let func3 = function(obj, done) {
                obj.c = true;
                done(null, obj);
            }

            let functions = [
                func1,
                func2,
                func3
            ];

            let pipeArg = {};
            co.pipe(functions, pipeArg).then(function(result) {
                inspect(result).isEql({
                  a: true,
                  b: true,
                  c: true
                });
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should pipe promises in series', function(done) {
            var func1 = function(obj, promise) {
                obj.a = true;
                promise.resolve(obj);
            }
            var func2 = function(obj, promise) {
                obj.b = true;
                promise.resolve(obj);
            }
            var func3 = function(obj, promise) {
                obj.c = true;
                promise.resolve(obj);
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var pipeArg = {};
            co.pipe(functions, pipeArg).then(function(result) {
                inspect(result).isEql({
                  a: true,
                  b: true,
                  c: true
                });
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should call promise returning function in series', function(done) {
            var func1 = function(obj) {
                obj.a = true;
                return Promise.resolve(obj);
            }
            var func2 = function(obj) {
                obj.b = true;
                return Promise.resolve(obj);
            }
            var func3 = function(obj) {
                obj.c = true;
                return Promise.resolve(obj);
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var args = {};
            co.pipe(functions, args).then(function(result) {
                inspect(result).isEql({
                  a: true,
                  b: true,
                  c: true
                });
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should pipe generators in series', function(done) {
            var gen1 = function *(obj) {
                obj.a = true;
                return obj;
            };

            var gen2 = function *(obj) {
                obj.b = true;
                return obj;
            };

            var gen3 = function *(obj) {
                obj.c = true;
                return obj;
            };

            var generators = [
                gen1,
                gen2,
                gen3
            ];

            var args = {};
            co.pipe(generators, args).then(function(result) {
                inspect(result).isEql({
                  a: true,
                  b: true,
                  c: true
                });

                done();
            }).catch(function(err) {
                done(err);
            });
        });
    });

    describe('pipe fail', function() {
        it('Should fail a pipe functions call', function(done) {
            let func1 = function(obj, done) {
                obj.a = true;
                done(null, obj);
            }
            let func2 = function(obj, done) {
                obj.b = true;
                done(null, obj);
            }
            let func3 = function(obj, done) {
                obj.c = true;
                done(new Error('Fail!'));
            }

            let functions = [
                func1,
                func2,
                func3
            ];

            let pipeArg = {};
            co.pipe(functions, pipeArg).then(function(result) {
                done('Should Fail!');
            }).catch(function(err) {
                inspect(err.message).isEql('Fail!');
                done();
            }).catch(function(err) {
              done(err);
            });
        });

        it('Should throw an error in a pipe functions call', function(done) {
            let func1 = function(obj, done) {
                obj.a = true;
                done(null, obj);
            }
            let func2 = function(obj, done) {
                obj.b = true;
                done(null, obj);
            }
            let func3 = function(obj, done) {
                obj.c = true;
                throw new Error('Fail!');
            }

            let functions = [
                func1,
                func2,
                func3
            ];

            let pipeArg = {};
            co.pipe(functions, pipeArg).then(function(result) {
                done('Should Fail!');
            }).catch(function(err) {
                inspect(err.message).isEql('Fail!');
                done();
            }).catch(function(err) {
              done(err);
            });
        });

        it('Should fail a pipe call of promises in series', function(done) {
            var func1 = function(obj, promise) {
                obj.a = true;
                promise.resolve(obj);
            }
            var func2 = function(obj, promise) {
                obj.b = true;
                promise.resolve(obj);
            }
            var func3 = function(obj, promise) {
                obj.c = true;
                promise.reject(new Error('Fail!'));
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var pipeArg = {};
            co.pipe(functions, pipeArg).then(function(result) {
              done('Should Fail!');
            }).catch(function(err) {
                inspect(err.message).isEql('Fail!');
                done();
            }).catch(function(err) {
              done(err);
            });
        });

        it('Should throw an error in a pipe call of promises in series', function(done) {
            var func1 = function(obj, promise) {
                obj.a = true;
                promise.resolve(obj);
            }
            var func2 = function(obj, promise) {
                obj.b = true;
                promise.resolve(obj);
            }
            var func3 = function(obj, promise) {
                obj.c = true;
                throw new Error('Fail!');
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var pipeArg = {};
            co.pipe(functions, pipeArg).then(function(result) {
              done('Should Fail!');
            }).catch(function(err) {
                inspect(err.message).isEql('Fail!');
                done();
            }).catch(function(err) {
              done(err);
            });
        });

        it('Should fail a pipe call of promise returning function in series', function(done) {
            var func1 = function(obj) {
                obj.a = true;
                return Promise.resolve(obj);
            }
            var func2 = function(obj) {
                obj.b = true;
                return Promise.resolve(obj);
            }
            var func3 = function(obj) {
                obj.c = true;
                return Promise.reject(new Error('Fail!'));
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var args = {};
            co.pipe(functions, args).then(function(result) {
                done('Should Fail!');
            }).catch(function(err) {
                inspect(err.message).isEql('Fail!');
                done();
            }).catch(function(err) {
              done(err);
            });
        });

        it('Should throw an error in a pipe call of promise returning function in series', function(done) {
            var func1 = function(obj) {
                obj.a = true;
                return Promise.resolve(obj);
            }
            var func2 = function(obj) {
                obj.b = true;
                return Promise.resolve(obj);
            }
            var func3 = function(obj) {
                obj.c = true;
                throw new Error('Fail!');
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var args = {};
            co.pipe(functions, args).then(function(result) {
                done('Should Fail!');
            }).catch(function(err) {
                inspect(err.message).isEql('Fail!');
                done();
            }).catch(function(err) {
              done(err);
            });
        });

        it('Should fail a pipe call of generators in series', function(done) {
            var gen1 = function *(obj) {
                obj.a = true;
                return obj;
            };

            var gen2 = function *(obj) {
                obj.b = true;
                return obj;
            };

            var gen3 = function *(obj) {
                obj.c = true;
                throw new Error('Fail!');
            };

            var generators = [
                gen1,
                gen2,
                gen3
            ];

            var args = {};
            co.pipe(generators, args).then(function(result) {
                done('Should Fail!');
            }).catch(function(err) {
                inspect(err.message).isEql('Fail!');
                done();
            }).catch(function(err) {
              done(err);
            });
        });
    });

});
