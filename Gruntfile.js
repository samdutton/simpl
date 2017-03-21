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

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      strict: {
        options: {
          import: 2
        },
        src: ['**/*.css', '!video/split/css/main.css', '!node_modules/**/*']
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
