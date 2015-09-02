module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['build'],

    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: 'src/js',
          src: '**/*.js',
          dest: 'build/js'
        }]
      }
    },

    cssmin: {
      build: {
        files: [{
          expand: true,
          cwd: 'src/css',
          src: '**/*.css',
          dest: 'build/css'
        }]
      }
    },

    htmlmin: {
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: './*.html',
          dest: 'build/',
          ext: '.html',
          options: {
            removeComments: true,
            removeCommentsFromCDATA: true,
            removeCDATASectionsFromCDATA: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            minifyJS: true,
            minifyCSS: true
          }
        }]
      }
    },

    sass: {
      build: {
        files: [{
          expand: true,
          cwd: 'src/styles',
          src: '**/*.scss',
          dest: 'src/css',
          ext: '.css'
        }]
      }
    },

    '6to5': {
      options: {
        modules: 'amd'
      },

      build: {
        files: [{
          expand: true,
          cwd: 'src/es6',
          src: ['**/*.js'],
          dest: 'src/js',
        }],
      }
    },

    copy: {
      main: {
        expand: true,
        cwd: 'src',
        src: ['./**/*', '!./es6/**', '!./js/**', '!./styles/**', '!./css/**', '!./*.html'],
        dest: 'build'
      }
    },

    watch: {
      scripts:{
        files: ['src/es6/**/*.js'],
        tasks: ['6to5']
      },
      styles:{
        files: ['src/styles/**/*.scss'],
        tasks: ['sass']
      }
    },

    crx: {
      pack: {
        src: 'build',
        dest: '<%= pkg.name %>.crx',
        privateKey: '<%= pkg.name %>.pem'
      }
    }
  });

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', [
    'clean',

    'cssmin',
    'uglify',
    'htmlmin',

    'copy',
    'crx'
  ]);
};
