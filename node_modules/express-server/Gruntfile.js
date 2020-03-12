module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bumpup: {
            file: 'package.json'
        },
        jshint: {
            dist: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    src: [
                        'modules/**/*.js',
                        'routes/**/*.js',
                        '*.js'
                    ]
                }
            }
        },
        release: {
            options: {
                npm: true, //default: true
                indentation: '    ', //default: '  ' (two spaces)
                tagName: 'v<%= version %>', //default: '<%= version %>'
                commitMessage: 'Release v<%= version %>', //default: 'release <%= version %>'
                tagMessage: 'Tagging release v<%= version %>' //default: 'Version <%= version %>',
                // beforeRelease: ['build']
            }
        },
        tagrelease: {
            file: 'package.json',
            commit:  true,
            message: 'Release %version%',
            prefix:  'v',
            annotate: false
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-release');

    grunt.registerTask('default', 'jshint');
    grunt.registerTask('build', [
        'jshint',
        'bumpup:prerelease']);
};
