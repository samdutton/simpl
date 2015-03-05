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
