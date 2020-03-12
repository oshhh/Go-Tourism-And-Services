/**
 * FireTPL node.js/io.js extensions
 *
 * @module Node
 */
(function(FireTPL) {
    'use strict';

    var fs = require('fs'),
        path = require('path'),
        extend = require('node.extend');

    FireTPL.__express = function(file, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        fs.readFile(file, { encoding: 'utf8' }, function(err, source) {
            if (err) {
                return callback(err);
            }

            var compiled = FireTPL.compile(source, options);
            return callback(null, compiled(options));
        });
    };

    /**
     * Compiles a file
     * @method compileFile
     * 
     * @param {String} template Template string or precompiled tempalte
     * @param {Object} options (Optional) Compiler options
     * 
     * @returns {String} Returns executed template
     */
    FireTPL.compileFile = function(file, options) {
        return FireTPL.compile(FireTPL.readFile(file), options);
    };

    /**
     * Synchronous read file function to read a file from file system.
     * @param  {string} file File path
     * @return {String}      Returns file content
     */
    FireTPL.readFile = function(file) {
        if (!fs.existsSync(file)) {
            throw new FireTPL.Error('Can not read file "' + file + '"! File was not found!');
        }

        return fs.readFileSync(file, { encoding: 'utf8'} );
    };

    /**
     * Precomüiles all templates at once and return an array of compiled templates
     * @method precompileAll
     * @static
     * @param  {Array}      templates Array of tempaltes. Expects this structire:
     *     {
     *         name: 'templateName',
     *         file: 'path/to/file.fire'
     *     }
     * @return {string} Returns precompiled templates
     */
    FireTPL.precompileAll = function(templates, options) {
        var compiled = [],
            tmplNames = [];

        var compilerOpts = extend({}, options);
        compilerOpts.commonjs = false;
        compilerOpts.amd = false;
        compilerOpts.scope = false;

        var compile = function(templates) {
            templates.forEach(function(tmpl) {
                if (tmplNames.indexOf(tmpl.name) !== -1) {
                    return;
                }

                if (tmpl.file) {
                    tmpl.source = FireTPL.readFile(tmpl.file);
                }

                var compiler = new FireTPL.Compiler();
                compiled.push(compiler.precompile(tmpl.source, tmpl.name, compilerOpts));
                tmplNames.push(tmpl.name);

                //Add includes
                if (!options.skipIncludes && compiler.includes) {
                    var includeFiles = [];
                    compiler.includes.forEach(function(include) {
                        if (tmplNames.indexOf(include) === -1) {
                            include = include.replace(/\.(fire|hbs)$/, '');
                            includeFiles.push({
                                file: path.join(path.dirname(tmpl.file), include + (options.type ? '.' + options.ty : '.fire')),
                                name: FireTPL.resolveName(tmpl.name, include)
                            });
                        }
                    });

                    compile(includeFiles);
                }
            });
        };

        compile(templates);

        var output;
        var compiler = new FireTPL.Compiler();
        if (options.commonjs) {
            output = compiler.wrapCJS(compiled.join(''), options.firetplModule || 'firetpl');
        }
        else if (options.amd) {
            output = compiler.wrapAMD(compiled.join(''), options.moduleName, options.firetplModule || 'firetpl');
        }
        else if (options.scope) {
            output = compiler.wrapScope(compiled.join(''));
        }
        else {
            output = compiled.join('');
        }

        return output;
    };

    FireTPL.resolveName = function(from, to) {
        from = from.split('/');
        to = to.split('/');

        //Pop last item
        from.pop();

        to.forEach(function(part) {
            if (part === '..') {
                from.pop();
                return;
            }

            if (part === '.') {
                return;
            }

            from.push(part);
        });

        return from.join('/');
    };
    
})(FireTPL);