module.exports = function(grunt) {

  grunt.task.loadNpmTasks('grunt-sass');
  grunt.task.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'scripts/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.registerTask('default', ['jshint']);

};