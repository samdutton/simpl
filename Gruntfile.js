/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

/* globals module */

module.exports = function(grunt) {
  // configure project
  grunt.initConfig({
  // make node configurations available
    pkg: grunt.file.readJSON('package.json'),


    stylelint: {
      options: {
        configFile: '.stylelintrc',
        formatter: 'string',
        ignoreDisables: false,
        failOnError: true,
        outputFile: '',
        reportNeedlessDisables: false,
        syntax: ''
      },
      src: ['**/*.css', '!video/split/css/main.css',
        '!node_modules/**/*', '!gridpage/css/main.css']
    },
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      target: {
        src: ['**/main.js', '!node_modules/**/*']
      }
    },

    githooks: {
      all: {
        'pre-commit': 'stylelint eslint'
      }
    },

    htmlhint: {
      default: {
        src: ['**/*.html', '!node_modules/**/*', '!**/html/*']
      }
    }

  });

  // enable plugins
  grunt.loadNpmTasks('grunt-stylelint');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-githooks');
  // grunt.loadNpmTasks('grunt-htmlhint');

  // set default tasks to run when grunt is called without parameters
  grunt.registerTask('default', ['stylelint', 'eslint']);

  // also possible to call JavaScript directly in registerTask()
  // or to call external tasks with grunt.loadTasks()
};
