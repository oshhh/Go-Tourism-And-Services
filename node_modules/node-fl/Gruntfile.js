module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,

        availabletasks: {
            tasks: {}
        },
        bumpup: {
            files: 'package.json',
            dateformat: 'YYYY-MM-DD HH:mm:ss Z',
            normalize: true
        },
        jshint: {
            files: [
                'src/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        release: {
            options: {
                npm: true, //default: true
                indentation: '    ', //default: '  ' (two spaces)
                tagName: 'v<%= version %>', //default: '<%= version %>'
                commitMessage: 'Release v<%= version %>', //default: 'release <%= version %>'
                tagMessage: 'Tagging release v<%= version %>', //default: 'Version <%= version %>',
                // beforeRelease: ['build']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-release');
    
    grunt.registerTask('default', ['availabletasks']);
};
