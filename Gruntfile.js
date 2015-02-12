module.exports = function(grunt) {

  grunt.task.loadNpmTasks('grunt-contrib-jshint');
  grunt.task.loadNpmTasks('grunt-contrib-uglify');
  grunt.task.loadNpmTasks('grunt-contrib-concat');
  grunt.task.loadNpmTasks('grunt-sass');

  var JS_FILES = ['scripts/**/*.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: JS_FILES,
      options: {
        jshintrc: '.jshintrc'
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: JS_FILES,
        dest: 'lib/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'lib/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    sass: {
      dist: {
        files: {
          'css/angular-scheduler.css': 'scss/angular-scheduler.scss'
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'sass', 'concat', 'uglify']);

};