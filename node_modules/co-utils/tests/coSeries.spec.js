var co = require('../index.js');
var inspect = require('inspect.js');
var sinon = require('sinon');

describe('co.series()', function() {
    'use strict';

    describe('getCallbackPromise', function(done) {
        it('Should return a callback promise', function() {
            var callback = co.getCallbackPromise();

            inspect(callback).isFunction();
            inspect(callback).isPromise();
        });

        it('Should pass a callback call', function(done) {
            var callback = co.getCallbackPromise();

            var fn = function(cb) {
                cb(null, 'ok');
            }

            callback.then(function(data) {
                inspect(data).isEql('ok');
                done();
            }).catch(function(err) {
                done(err);
            });

            fn(callback);
        });

        it('Should fail a callback call', function(done) {
            var callback = co.getCallbackPromise();

            var fn = function(cb) {
                cb('fail');
            }

            callback.then(function() {
                done('Should fail, but it passed!');
            }).catch(function(err) {
                inspect(err).isEql('fail');
                done();
            });

            fn(callback);
        });

        it('Should pass a promise call', function(done) {
            var callback = co.getCallbackPromise();

            callback.then(function(data) {
                inspect(data).isEql('ok');
                done();
            }).catch(function(err) {
                done(err);
            });

            callback.resolve('ok');
        });

        it('Should fail a promise call', function(done) {
            var callback = co.getCallbackPromise();

            callback.then(function() {
                done('Should fail, but it passed!');
            }).catch(function(err) {
                inspect(err).isEql('fail');
                done();
            });

            callback.reject('fail');
        });

        it('Should call all final functions', function(done) {
            var callback = co.getCallbackPromise();

            var final1 = sinon.stub();
            var final2 = sinon.stub();

            callback.final(final1);
            callback.final(final2);

            callback.then(function() {
                inspect(final1.calledOnce).isTrue();
                inspect(final2.calledOnce).isTrue();
                done();
            }).catch(function(err) {
                done(err);
            });

            callback.resolve('ok');
        });

        it('Should call all final functions', function(done) {
            var callback = co.getCallbackPromise();

            var final1 = sinon.stub();
            var final2 = sinon.stub();

            callback.final(final1);
            callback.final(final2);

            callback.then(function() {
                done('Should fail, but it passed!');
            }).catch(function() {
                inspect(final1.calledOnce).isTrue();
                inspect(final2.calledOnce).isTrue();
                done();
            });

            callback.reject('fail');
        });
    });

    describe('method', function() {
        it('Should call functions in series', function(done) {
            var func1 = sinon.stub();
            var func2 = sinon.stub();
            var func3 = sinon.stub();
            var isGenStub = sinon.stub();
            isGenStub.returns(false);

            func1.yields(null, 'a');
            func2.yields(null, 'b');
            func3.yields(null, 'c');

            func1.isGenerator = isGenStub;
            func2.isGenerator = isGenStub;
            func3.isGenerator = isGenStub;

            var functions = [
                func1,
                func2,
                func3
            ];

            co.series(functions).then(function(result) {
                inspect(result).isEql(['a', 'b', 'c']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should fail if one function rejects', function(done) {
            var func1 = sinon.stub();
            var func2 = sinon.stub();
            var func3 = sinon.stub();
            var isGenStub = sinon.stub();
            isGenStub.returns(false);

            func1.yields(null, 'a');
            func2.yields(null, 'b');
            func3.yields('Booom');

            func1.isGenerator = isGenStub;
            func2.isGenerator = isGenStub;
            func3.isGenerator = isGenStub;

            co.series([func1, func2, func3]).then(function() {
                done('Fail!');
            }).catch(function(err) {
                inspect(err).isEql('Booom');
                done();
            });
        });

        it('Should fail if one function throws an error', function(done) {
            var func1 = sinon.stub();
            var func2 = sinon.stub();
            var func3 = sinon.stub();
            var isGenStub = sinon.stub();
            isGenStub.returns(false);

            func1.yields(null, 'a');
            func2.throws('Booom');
            func3.yields(null, 'c');

            func1.isGenerator = isGenStub;
            func2.isGenerator = isGenStub;
            func3.isGenerator = isGenStub;

            co.series([func1, func2, func3]).then(function() {
                done('Fail!');
            }).catch(function(err) {
                inspect(err.name).isEql('Booom');
                done();
            });
        });

        it('Should call promises in series', function(done) {
            var promises = [
                Promise.resolve('a'),
                Promise.resolve('b'),
                Promise.resolve('c')
            ];

            co.series(promises).then(function(result) {
                inspect(result).isEql(['a', 'b', 'c']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should fail if one promise rejects', function(done) {
            var p1 = new Promise(function(resolve, reject) { resolve ('a'); });
            var p2 = new Promise(function(resolve, reject) { resolve ('b'); });
            var p3 = new Promise(function(resolve, reject) { reject('Booom'); });

            co.series([p1, p2, p3]).then(function(res) {
                done('Fail!');
            }).catch(function(err) {
                inspect(err).isEql('Booom');
                done();
            });
        });

        it('Should fail if one promise throws an error', function(done) {
            var p1 = new Promise(function(resolve, reject) { resolve ('a'); });
            var p2 = new Promise(function(resolve, reject) { resolve ('b'); });
            var p3 = new Promise(function(resolve, reject) { throw new Error('Booom'); });

            co.series([p1, p2, p3]).then(function(res) {
                done('Fail!');
            }).catch(function(err) {
                inspect(err.message).isEql('Booom');
                done();
            });
        });

        it('Should call generators in series', function(done) {
            var gen1 = function *() { return 'a'; };
            var gen2 = function *() { return 'b'; };
            var gen3 = function *() { return 'c'; };

            var generators = [
                gen1,
                gen2,
                gen3
            ];

            co.series(generators).then(function(result) {
                inspect(result).isEql(['a', 'b', 'c']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should fail if one function throws an error', function(done) {
            var gen1 = function *() { return 'a'; };
            var gen2 = function *() { return 'b'; };
            var gen3 = function *() { throw 'Booom'; };

            var generators = [
                gen1,
                gen2,
                gen3
            ];

            co.series(generators).then(function(result) {
                done('Fail!');
            }).catch(function(err) {
                inspect(err).isEql('Booom');
                done();
            });
        });
    });

    describe('series with args', function() {
        it('Should fail if args param is not an array', function() {
            inspect(co.series).withArgs([], {}, 'string').doesThrow(/must be an array/);
        });

        it('Should call functions in series', function(done) {
            var func1 = function(a, b, c, done) {
                done(null, a);
            }
            var func2 = function(a, b, c, done) {
                done(null, b);
            }
            var func3 = function(a, b, c, done) {
                done(null, c);
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var args = ['apple', 'banana', 'coconut'];
            co.series(functions, args).then(function(result) {
                inspect(result).isEql(['apple', 'banana', 'coconut']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should call promises in series', function(done) {
            var func1 = function(a, b, c, promise) {
                promise.resolve(a);
            }
            var func2 = function(a, b, c, promise) {
                promise.resolve(b);
            }
            var func3 = function(a, b, c, promise) {
                promise.resolve(c);
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var args = ['apple', 'banana', 'coconut'];
            co.series(functions, args).then(function(result) {
                inspect(result).isEql(['apple', 'banana', 'coconut']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should call promise returning function in series', function(done) {
            var func1 = function(a, b, c) {
                return Promise.resolve(a);
            }
            var func2 = function(a, b, c) {
                return Promise.resolve(b);
            }
            var func3 = function(a, b, c) {
                return Promise.resolve(c);
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var args = ['apple', 'banana', 'coconut'];
            co.series(functions, args).then(function(result) {
                inspect(result).isEql(['apple', 'banana', 'coconut']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should call generators in series', function(done) {
            var gen1 = function *(a, b, c) { return a; };
            var gen2 = function *(a, b, c) { return b; };
            var gen3 = function *(a, b, c) { return c; };

            var generators = [
                gen1,
                gen2,
                gen3
            ];

            var args = ['apple', 'banana', 'coconut'];
            co.series(generators, args).then(function(result) {
                inspect(result).isEql(['apple', 'banana', 'coconut']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });
    });

    describe('series with args and context', function() {
        it('Should fail if args param is not an array', function() {
            inspect(co.series).withArgs([], {}, 'string').doesThrow(/must be an array/);
        });

        it('Should call functions in series', function(done) {
            var func1 = function(a, b, c, done) {
                done(null, this.prefix + a);
            }
            var func2 = function(a, b, c, done) {
                done(null, this.prefix + b);
            }
            var func3 = function(a, b, c, done) {
                done(null, this.prefix + c);
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var args = ['apple', 'banana', 'coconut'];
            var ctx = { prefix: 'I like: ' };
            co.series(functions, ctx, args).then(function(result) {
                inspect(result).isEql(['I like: apple', 'I like: banana', 'I like: coconut']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should call promises in series', function(done) {
            var func1 = function(a, b, c, promise) {
                promise.resolve(this.prefix + a);
            }
            var func2 = function(a, b, c, promise) {
                promise.resolve(this.prefix + b);
            }
            var func3 = function(a, b, c, promise) {
                promise.resolve(this.prefix + c);
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var args = ['apple', 'banana', 'coconut'];
            var ctx = { prefix: 'I like: ' };
            co.series(functions, ctx, args).then(function(result) {
                inspect(result).isEql(['I like: apple', 'I like: banana', 'I like: coconut']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should call promise returning function in series', function(done) {
            var func1 = function(a, b, c) {
                return Promise.resolve(this.prefix + a);
            }
            var func2 = function(a, b, c) {
                return Promise.resolve(this.prefix + b);
            }
            var func3 = function(a, b, c) {
                return Promise.resolve(this.prefix + c);
            }

            var functions = [
                func1,
                func2,
                func3
            ];

            var args = ['apple', 'banana', 'coconut'];
            var ctx = { prefix: 'I like: ' };
            co.series(functions, ctx, args).then(function(result) {
                inspect(result).isEql(['I like: apple', 'I like: banana', 'I like: coconut']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });

        it('Should call generators in series', function(done) {
            var gen1 = function *(a, b, c) { return this.prefix + a; };
            var gen2 = function *(a, b, c) { return this.prefix + b; };
            var gen3 = function *(a, b, c) { return this.prefix + c; };

            var generators = [
                gen1,
                gen2,
                gen3
            ];

            var args = ['apple', 'banana', 'coconut'];
            var ctx = { prefix: 'I like: ' };
            co.series(generators, ctx, args).then(function(result) {
                inspect(result).isEql(['I like: apple', 'I like: banana', 'I like: coconut']);
                done();
            }).catch(function(err) {
                done(err);
            });
        });
    });

    describe('series with timeout', function() {
        it('Should call functions in series until timeout was reached', function(done) {
            var counter = 0;
            var func1 = function(done) {
                // never call done
                setTimeout(function() {
                    counter++;
                    done();
                }, 200);
            }

            var func2 = function(done) {
                counter++;
                done();
            }

            var func3 = function(done) {
                counter++;
                done();
            }

            co.series([func1, func2, func3], 100).then(function(result) {
                done('Should never been called!');
            }).catch(function(err) {
                inspect(err).doesMatch(/Timeout/);
                inspect(counter).isLesserThan(2);
                done();
            });
        });

        it('Should call functions in series until timeout was reached with context', function(done) {
            var counter = 0;
            var func1 = function(done) {
                // never call done
                setTimeout(function() {
                    counter++;
                    done();
                }, 200);
            }

            var func2 = function(done) {
                counter++;
                done();
            }

            var func3 = function(done) {
                counter++;
                done();
            }

            co.series([func1, func2, func3], {}, 100).then(function(result) {
                done('Should never been called!');
            }).catch(function(err) {
                inspect(err).doesMatch(/Timeout/);
                inspect(counter).isLesserThan(2);
                done();
            });
        });

        it('Should call functions in series until timeout was reached with args', function(done) {
            var counter = 0;
            var func1 = function(done) {
                // never call done
                setTimeout(function() {
                    counter++;
                    done();
                }, 2000);
            }

            var func2 = function(done) {
                counter++;
                done();
            }

            var func3 = function(done) {
                counter++;
                done();
            }

            co.series([func1, func2, func3], ['foo'], 100).then(function(result) {
                done('Should never been called!');
            }).catch(function(err) {
                inspect(err).doesMatch(/Timeout/);
                inspect(counter).isLesserThan(2);
                done();
            });
        });

        it('Should call functions in series until timeout was reached with context and args', function(done) {
            var counter = 0;
            var func1 = function(done) {
                // never call done
                setTimeout(function() {
                    counter++;
                    done();
                }, 2000);
            }

            var func2 = function(done) {
                counter++;
                done();
            }

            var func3 = function(done) {
                counter++;
                done();
            }

            co.series([func1, func2, func3], {}, ['foo'], 100).then(function(result) {
                done('Should never been called!');
            }).catch(function(err) {
                inspect(err).doesMatch(/Timeout/);
                inspect(counter).isLesserThan(2);
                done();
            });
        });
    });
});
