'use strict';

/* globals module */

module.exports = function(grunt) {
  // configure project
  grunt.initConfig({
    // make node configurations available
    pkg: grunt.file.readJSON('package.json'),

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      strict: {
        options: {
          import: 2
        },
        src: ['**/*.css', '!node_modules/**/*']
      }
    },

    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      target: ['**/main.js']
    },

    githooks: {
      all: {
        'pre-commit': 'csslint htmlhint eslint'
      }
    },

    htmlhint: {
      default: {
        src: ['**/*.html', '!node_modules/**/*']
      }
    }

  });

  // enable plugins
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-htmlhint');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-htmlhint');

  // set default tasks to run when grunt is called without parameters
  grunt.registerTask('default', ['csslint', 'eslint', 'htmlhint']);

  // also possible to call JavaScript directly in registerTask()
  // or to call external tasks with grunt.loadTasks()
};
