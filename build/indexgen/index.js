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

module.exports = function(grunt) {
  grunt.registerTask("index", "Generate index.html depending on configuration", function() {
    var conf = grunt.config('index'),
      appTmpl = grunt.file.read(conf.src.app),
      mainTmpl = grunt.file.read(conf.src.main),
      mainjs = conf.js + "/main.js";

    grunt.file.mkdir(conf.js);
    grunt.file.write(mainjs, '//Replace with main logic')
    grunt.file.write(conf.dest.app, grunt.template.process(appTmpl));
    grunt.log.writeln('Generated \'' + conf.dest.app + '\' from \'' + conf.src.app + '\'');
    grunt.file.write(conf.dest.main, grunt.template.process(mainTmpl));
    grunt.log.writeln('Generated \'' + conf.dest.main + '\' from \'' + conf.src.main + '\'');
  });
}
