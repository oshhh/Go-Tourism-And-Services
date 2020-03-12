module.exports = function(grunt) {
    'use strict';
    
    var pkg = grunt.file.readJSON('package.json'),
        version = pkg.version.replace(/-\d+$/g, '');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        syntax: {
            fire: JSON.stringify(grunt.file.readJSON('syntax/fire/fire.json')),
            hbs: JSON.stringify(grunt.file.readJSON('syntax/hbs/hbs.json'))
        },
        bumpup: {
            file: 'package.json'
        },
        concat: {
            options: {
                process: true
            },
            build: {
                src: [
                    'src/firetpl.js',
                    'src/firetpl-error.js',
                    'src/firetpl-parser.js',
                    'src/firetpl-i18n-parser.js',
                    'src/firetpl-compiler.js',
                    'syntax/syntax.js',
                    'src/firetpl-runtime.js',
                    'src/functions/*.js',
                    'src/helper/*.js',
                    'src/firetpl-browser.js'
                ],
                dest: 'firetpl.js'
            },
            'build-node': {
                src: [
                    'src/firetpl.js',
                    'src/firetpl-error.js',
                    'src/firetpl-parser.js',
                    'src/firetpl-i18n-parser.js',
                    'src/firetpl-compiler.js',
                    'syntax/syntax.js',
                    'src/firetpl-runtime.js',
                    'src/functions/*.js',
                    'src/helper/*.js',
                    'src/firetpl-node.js'
                ],
                dest: 'firetpl-node.js'
            },
            runtime: {
                src: [
                    'src/firetpl.js',
                    'src/firetpl-error.js',
                    'src/firetpl-runtime.js',
                    'src/functions/*.js',
                    'src/helper/*.js'
                ],
                dest: 'firetpl-runtime.js'
            },
            compiler: {
                src: [
                    'src/firetpl.js',
                    'src/firetpl-error.js',
                    'src/firetpl-compiler.js',
                    'syntax/syntax.js'
                ],
                dest: 'firetpl-compiler.js'
            }
        },

        copy: {
            component: {
                options: {
                    processContent: function (content, srcpath) {
                        return content.replace('<%= version %>', version);
                    }
                },
                files: [
                    {
                        src: ['firetpl.js'],
                        dest: '../component-builds/firetpl/firetpl.js'
                    }, {
                        src: ['component.json'],
                        dest: '../component-builds/firetpl/',
                    }
                ]
            }
        },
        jshint: {
            files: [
                'src/**/*.js',
                'syntax/**/*.json'
            ],
            jshintrc: '.jshintrc'
        },
        json: {
            main: {
                options: {
                    namespace: 'FireTPL.Syntax'
                },
                src: ['syntax/**/*.json'],
                dest: 'syntax/syntax.js'
            }
        },
        release: {
            options: {
                npm: true, //default: true
                indentation: '    ', //default: '  ' (two spaces)
                tagName: 'v<%= version %>', //default: '<%= version %>'
                commitMessage: 'Release v<%= version %>', //default: 'release <%= version %>'
                tagMessage: 'Tagging release v<%= version %>', //default: 'Version <%= version %>',
                beforeRelease: ['build']
            }
        },
        version: {
            component: {
                src: ['../component-builds/component.json']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-json');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-version');

    grunt.registerTask('default', 'jshint');
    grunt.registerTask('build', [
        'jshint',
        'json',
        'concat',
        'bumpup:prerelease'
    ]);
};