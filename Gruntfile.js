module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['build'],

    jshint: {
      all:['Gruntfile.js','es6/**/*.js', 'js/**/*.js']
    },

    csslint: {
      all: ['styles/**/*.c', 'css/**/*.css']
    },

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

    imagemin: {
      dynamic:{
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'build/'
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
      scripts: {
        files: ['src/es6/**/*.js'],
        tasks: ['jshint', '6to5']
      },
      styles: {
        files: ['src/styles/**/*.scss'],
        tasks: ['csslint', 'sass']
      }
    },

    shell: {
      pem: {
        command: 'openssl genrsa -out <%= pkg.name %>.pem 2048'
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
  grunt.registerTask('build', function() {
    var pem = grunt.file.readJSON('package.json').name + '.pem';
    if (!grunt.file.exists(pem)) {
      grunt.task.run(['shell']);
      grunt.log.oklns('已自动生成' + pem + '，请务必妥善保管！');
      grunt.log.oklns('pem文件是扩展的唯一凭证，升级扩展的时候必须用相同的pem打包');
    }
    grunt.task.run(['clean', 'csslint', 'jshint', 'uglify', 'cssmin', 'imagemin', 'htmlmin', 'copy', 'crx']);
  });
};
