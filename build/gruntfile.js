module.exports = function(grunt){ 
	grunt.loadTasks('./indexgen');
	grunt.initConfig({
		index: {
	       	src: {'app':'tmpl/app-index.tmpl', 'main':'tmpl/main-index.tmpl'},
	       	dest: {'app':'../<%= feature.new %>/index.html', 'main': '../index.html'},
	       	js: '../<%= feature.new%>/js',
	       	feature: '../<%= feature.new %>'
	    }

	});

	grunt.config.set('feature.new',grunt.option('feature')||".");
	grunt.registerTask('default', 'index');
}