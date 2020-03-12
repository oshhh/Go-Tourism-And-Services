/**
 * FireTPL runtime
 *
 * @module  FireTPL.Runtime
 */
(function(FireTPL) {
    'use strict';

    FireTPL.helpers = {};
    FireTPL.fn = {};
    FireTPL.templateCache = {};

    /**
     * Register a block helper
     *
     * @method registerHelper
     * @param {String} helper Helper name
     * @param {Function} fn Helper function
     */
    FireTPL.registerHelper = function(helper, fn) {
        FireTPL.helpers[helper] = fn;
    };

    FireTPL.registerFunction = function(func, fn) {
        FireTPL.fn[func] = fn;
    };

    /**
     * Register a global include
     * @method registerPartial
     * @param  {String}   include Partial name
     * @param  {Function|String} fn      Precompiled include or a include string
     * @param  {Object}   options (Optional) If second arg is a string, add parser options here
     */
    FireTPL.registerInclude = function(include, fn, options) {
        if (typeof fn === 'string') {
            options = options || {};
            options.include = true;
            fn = FireTPL.compile(fn, options);
        }

        FireTPL.templateCache[include] = fn;
    };

    /**
     * Clears a global include cache
     *
     * @method clearIncludes
     * 
     */
    FireTPL.clearIncludes = function() {
        FireTPL.templateCache = [];
    };

    /**
     * Register core helper
     *
     * @private
     * @method registerCoreHelper
     */
    FireTPL.registerCoreHelper = function() {
        this.registerHelper('if', function(context, fn) {
            var s = '';

            if (context.data) {
                s += fn(context.parent, context.root);
            }

            return s;
        });
        
        this.registerHelper('else', function(context, fn) {
            return fn(context.parent);
        });

        this.registerHelper('unless', function(context, fn) {
            var s = '';

            if (!(context.data)) {
                s += fn(context.parent);
            }

            return s;
        });

        this.registerHelper('each', function(context, fn) {
            var s = '';

            if (context.data) {
                context.data.forEach(function(item) {
                    s += fn(item);
                });
            }

            return s;
        });
    };

    var Runtime = function() {
        this.templateCache = FireTPL.templateCache;
    };

    Runtime.prototype.exec = function(helper, data, parent, root, ctx, fn) {
        console.warn('FireTPL.Runtime.prototype.exec is deprecated! Please use execHelper instead!');
        if (!FireTPL.helpers[helper]) {
            throw new Error('Helper ' + helper + ' not registered!');
        }

        return FireTPL.helpers[helper]({
            data: data,
            parent: parent,
            root: root,
            ctx: ctx
        }, fn);
    };

    Runtime.prototype.execHelper = function(helper, data, parent, root, ctx, tag, attrs, fn) {
        if (!FireTPL.helpers[helper]) {
            throw new Error('Helper ' + helper + ' not registered!');
        }

        if (typeof tag === 'function') {
            fn = tag;
            tag = null;
            attrs = null;
        }

        return FireTPL.helpers[helper]({
            data: data,
            parent: parent,
            root: root,
            ctx: ctx,
            tag: tag,
            attrs: attrs
        }, fn);
    };

    Runtime.prototype.execInclude = function(includeName, data) {
        var include = this.templateCache[includeName];
        if (!include) {
            throw new FireTPL.Error('Include \'' + includeName + '\' was not registered!');
        }

        return include(data);
    };

    Runtime.prototype.registerInclude = function(include, fn) {
        this.templateCache[include] = fn;
    };

    /**
     * Compiles and executes a template string
     *
     * Uses fire syntax as default. If you pass a hbs template please set the type option to *hbs*
     * 
     * @param {String} template Template string or precompiled tempalte
     * @param {Object} options (Optional) Compiler options
     *
     * @example {fire}
     * var tmpl = 'div "Hello $name"';
     * var template = FireTPL.compile(tmpl);
     * var html = template({
     *   name: 'Andi'
     * });
     *
     * // html == <div>Hello Andi</div>
     * 
     * @example {hbs}
     * var tmpl = '<div>Hello {{name}}</div>';
     * var template = FireTPL.compile(tmpl, 'hbs');
     * var html = template({
     *   name: 'Andi'
     * });
     *
     * // html == <div>Hello Andi</div>
     * @returns {String} Returns executed template
     */
    FireTPL.compile = function(template, options) {
        options = options || {};

        var runTime = new FireTPL.Runtime();
                

        if (typeof options === 'string') {
            options = {
                type: options
            };
        }

        if (!/^scopes=scopes/.test(template)) {
            // var fireTpl = new FireTPL.Compiler(options);
            var parser = new FireTPL.Parser(options);
            
            parser.parse(template);
            template = parser.flush();

            if (!options.skipIncludes) {
                var includes = parser.includeParser();
                if (includes) {
                    includes.forEach(function(item) {
                        try {
                            runTime.registerInclude(item.include, 
                                //jshint evil:true
                                eval('(function(data,scopes) {var t = new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude.bind(t);' + item.source + 'return s;})')
                            );
                        }
                        catch(err) {
                            console.error('Pregister include error!', err, err.lineNumber);
                        }
                    });
                }
            }
        }

        return function(data, scopes) {
            var h = runTime.execHelper,
                l = FireTPL.locale,
                f = FireTPL.fn,
                p = runTime.execInclude.bind(runTime);

            var s;

            var tmpl;
            //jshint evil:true
            try {
                tmpl = '(function(data, scopes) {\n' + template + 'return s;})(data, scopes)';
                return eval(tmpl);
            }
            catch (err) {
                throw new FireTPL.ParseError(err, data, prettify(tmpl));
            }

            return s;
        };
    };

    FireTPL.Runtime = Runtime;

    var prettify = function(str) {
        var indention = 0,
            out = '';

        var repeat = function(str, i) {
            var out = '';
            while (i > 0) {
                out += str;
                i--;
            }
            return out;
        };

        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            
            if(c === '}' && str.charAt(i - 1) !== '{') {
                indention--;
                out += '\n' + repeat('\t', indention);
            }

            out += c;

            if (c === '{' && str.charAt(i + 1) !== '}') {
                indention++;
                out += '\n' + repeat('\t', indention);
            }
            else if(c === ';') {
                out += '\n' + repeat('\t', indention);
            }
        }

        return out;
    };

    FireTPL.registerCoreHelper();

})(FireTPL);