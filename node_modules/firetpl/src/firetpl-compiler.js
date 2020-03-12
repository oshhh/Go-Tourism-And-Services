/**
 * FireTPL compiler node module
 *
 * Usage:
 * var fireTPLCompiler = new FireTPL.Compiler();
 * var precompiled = fireTPLCompiler.precompile('./views/template.ftl');
 *
 * @module FireTPL.Compiler
 */
(function(FireTPL) {
    'use strict';

    /**
     * FireTPL Compiler
     *
     * (pre)compiles firetpl templates
     * @method Compiler
     * @constructor
     */
    var Compiler = function() {
        
        /**
         * Set the log level.
         * 
         * Levels are:
         *
         * 4 DEBUG
         * 3 INFO
         * 2 WARN
         * 1 ERROR
         * @type {Number}
         */
        this.logLevel = 1;
    };

    /**
     * Precompiles a template string.
     * 
     * If template has any include tags, the include names are present in the `includes` property
     *
     * @describe options
     * commonjs     {Boolean}   Compile as an commonjs module
     * amd          {Boolean}   Compile as an amd module
     * moduleName   {String}    Defines an amd module name
     * scope        {Boolean}   Wrap outputed code into a function (Only if commonjs or amd isn't used)
     * pretty       {Boolean}   Makes output prettier
     * firetplModule {String}   Overrides firetpl module name, used by commionjs. Defaults to `firetpl`
     *     `
     * @method precompile
     * @param {String} tmpl Tmpl source
     * @param {String} name Tmpl name
     * @param {Object} options Precompile options
     *
     * @return {Function} Returns a parsed tmpl source as a function.
     */
    Compiler.prototype.precompile = function(tmpl, name, options) {
        options = options || {};

        if (typeof name !== 'string') {
            throw new FireTPL.Error('Precompilation not possible! The options.name flag must be set!');
        }

        options.firetplModule = options.firetplModule || 'firetpl';

        if (options.partial) {
            console.warn('Partials are no longer supported! Use includes instead!');
        }

        var parser = new FireTPL.Parser(options);
        
        parser.parse(tmpl);
        var precompiled = parser.flush();
        this.includes = parser.includes;

        if (options.verbose) {
            console.log('\n---------- begin of precompiled file ----------\n');
            console.log(precompiled);
            console.log('\n----------- end of precompiled file -----------\n');
            console.log('size: ', precompiled.length, 'chars\n');
        }

        var output = '';
        precompiled = 'FireTPL.templateCache[\'' + name + '\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude.bind(t);' + precompiled + 'return s;};';
        if (options.commonjs) {
            output = this.wrapCJS(precompiled, options.firetplModule);
        }
        else if (options.amd) {
            output = this.wrapAMD(precompiled, options.moduleName, options.firetplModule);
        }
        else if (options.scope) {
            output = this.wrapScope(precompiled);
        }
        else {
            output = precompiled;
        }
        // if (options.commonjs) {
        //     output += '(function(require) {var FireTPL = require(\'' + options.firetplModule + '\');';
        // }
        // else if (options.amd) {
        //     output += 'define(' + (options.moduleName ? '\'' + options.moduleName + '\',' : '') + '[\'' + options.firetplModule + '\'],function(FireTPL) {';
        // }
        // else if (options.scope) {
        //     output = '(function(FireTPL) {';
        // }


        // if (options.commonjs) {
        //     output += '})(require);';
        // }
        // else if(options.amd) {
        //     output += '});';
        // }
        // else if (options.scope) {
        //     output += '})(FireTPL);';
        // }

        return options.pretty ? this.prettifyJs(output) : output;
    };

    /**
     * Precompiles a template string.
     * 
     * If template has any include tags, the include names are present in the `includes` property
     *
     * @describe options
     * commonjs     {Boolean}   Compile as an commonjs module
     * amd          {Boolean}   Compile as an amd module
     * moduleName   {String}    Defines an amd module name
     * scope        {Boolean}   Wrap outputed code into a function (Only if commonjs or amd isn't used)
     * pretty       {Boolean}   Makes output prettier
     * firetplModule {String}   Overrides firetpl module name, used by commionjs. Defaults to `firetpl`
     *     `
     * @method precompile
     * @param {String} tmpl Tmpl source
     * @param {String} name Tmpl name
     * @param {Object} options Precompile options
     *
     * @return {Function} Returns a parsed tmpl source as a function.
     */
    Compiler.prototype.precompileFn = function(tmpl, name, options) {
        options = options || {};

        if (typeof name !== 'string') {
            throw new FireTPL.Error('Precompilation not possible! The options.name flag must be set!');
        }

        options.firetplModule = options.firetplModule || 'firetpl';

        if (options.partial) {
            console.warn('Partials are no longer supported! Use includes instead!');
        }

        var parser = new FireTPL.Parser(options);
        
        parser.parse(tmpl);
        var precompiled = parser.flush();
        this.includes = parser.includes;

        if (options.verbose) {
            console.log('\n---------- begin of precompiled file ----------\n');
            console.log(precompiled);
            console.log('\n----------- end of precompiled file -----------\n');
            console.log('size: ', precompiled.length, 'chars\n');
        }

        var output = '';
        precompiled = 'function(data,scopes) {var t=new FireTPL.Runtime()t.templateCache=this.templateCache,h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude.bind(t);' + precompiled + 'return s;};';
        if (options.commonjs) {
            output = this.wrapCJS(precompiled, options.firetplModule);
        }
        else if (options.amd) {
            output = this.wrapAMD(precompiled, options.moduleName, options.firetplModule);
        }
        else if (options.scope) {
            output = this.wrapScope(precompiled);
        }
        else {
            output = precompiled;
        }

        //jshint evil:true
        return eval(output);
    };

    /* +---------- FireTPL methods ---------- */

    /**
     * Precompiles a template
     * 
     * @method precompile
     * @static
     * @param  {String}   tmpl    Template as a string
     * @param  {String}   name    Template name
     * @param  {Object}   [options] Template options
     * @return {String}           Returns precompiled code
     */
    FireTPL.precompile = function(tmpl, name, options) {
        var compiler = new Compiler();
        return compiler.precompile(tmpl, name, options);
    };

    FireTPL.fire2html = function(tmpl, data, options) {
        data = data || {};
        options = options || {};

        var template = FireTPL.compile(tmpl, options);

        if (options.pretty) {
            return FireTPL.prettify(template(data));
        }

        return template(data);
    };

    /**
     * Prettify html output
     * @method prettify
     * @param  {String} html Input html str
     * @return {String}      Prettified html str
     */
    FireTPL.prettify = function(html) {
        var inlineTags = ['a', 'b', 'big', 'dd', 'dt', 'em', 'i', 's', 'small', 'span', 'sub', 'sup',
            'td', 'th', 'track', 'tt', 'u', 'var', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'br'];
        var voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen',
            'link', 'meta', 'param', 'track', 'source', 'wbr'];
        var inlineTagPattern = new RegExp('^<(' + inlineTags.join('|') + ')\\b');
        var voidTagPattern = new RegExp('^<(' + voidTags.join('|') + ')\\b');
        var indentStr = '    ';
        var indention = 0;
        var skipNewLine = 0;

        var getIndention = function() {
            var str = '';
            for (var i = 0; i < indention; i++) {
                str += indentStr;
            }

            return str;
        };

        var pat = /(<\/?[a-z][a-z0-9_]+.*?>)/g;
        var split = html.split(pat);

        split = split.map(function(item) {
            if (item === '') {
                return '';
            }

            if (item.charAt(1) === '/') {
                if (skipNewLine > 0) {
                    skipNewLine--;
                    return item + (skipNewLine === 0 ? '\n' : '');
                }

                indention--;
                return  getIndention() + item + '\n';
            }

            if (item.charAt(0) === '<') {
                if (inlineTagPattern.test(item)) {
                    item = (skipNewLine > 0 ? '' : getIndention()) + item;
                    
                    if (voidTagPattern.test(item)) {
                        return item;
                    }

                    skipNewLine++;
                    return item;
                }

                if (voidTagPattern.test(item)) {
                    return getIndention() + item + '\n';
                }
                
                item = getIndention() + item;
                indention++;
                return item + '\n';
            }

            return (skipNewLine === 0 ? getIndention() + item + '\n' : item);
        });


        return split.join('').trim();
    };

    Compiler.prototype.prettifyJs = function(str) {
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

    Compiler.prototype.wrapCJS = function(code, firetplModule) {
        var above = '(function(require) {var FireTPL = require(\'' + firetplModule + '\');';
        var below = '})(require);';

        return above + code + below;
    };

    Compiler.prototype.wrapAMD = function(code, moduleName, firetplModule) {
        var above = 'define(' + (moduleName ? '\'' + moduleName + '\',' : '') + '[\'' + firetplModule + '\'],function(FireTPL) {';
        var below = '});';

        return above + code + below;
    };

    Compiler.prototype.wrapScope = function(code) {
        var above = '(function(FireTPL) {';
        var below = '})(FireTPL);';

        return above + code + below;
    };

    /**
     * Compile locales
     *
     * @method compileLocales
     * @param  {Object} locales Compiles locales and register it in FireTPL.locale
     * @return {[type]}         [description]
     */
    FireTPL.compileLocales = function(locales) {
        var parser = new FireTPL.I18nParser();
        for (var l in locales) {
            if (locales.hasOwnProperty(l)) {
                var item = locales[l];
                parser.add(l, item);
            }
        }

        //jshint evil:true
        eval(parser.parse());
    };

    FireTPL.Compiler = Compiler;
})(FireTPL);