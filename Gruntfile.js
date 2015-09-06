module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['build'],

    jshint: {
      all: ['Gruntfile.js', 'es6/**/*.js', 'js/**/*.js']
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
      dynamic: {
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
        command: function() {
          var name = grunt.file.readJSON('package.json').name;
          grunt.log.oklns('已自动生成' + name + '.pem，请务必妥善保管！');
          grunt.log.oklns('pem文件是扩展的唯一凭证，升级扩展的时候必须用相同的pem打包');
          return 'openssl genrsa -out ' + name + '.pem 2048';
        }
      },
      rebuild: {
        command: 'grunt build'
      }
    },

    replace: {
      rename: {
        src: ['package.json'],
        overwrite: true,
        replacements: [{
          from: /\"name\":[\s]*\"([^"]+)\"/,
          to: function(matchedWord, index, fullText, regexMatches) {
            var name = process.cwd().replace(/.*[\/]([^/]+)/, '$1');
            return matchedWord.replace(regexMatches[0], name);
          }
        }]
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
      grunt.task.run(['replace']);
      grunt.task.run(['shell']);
    } else {
      grunt.task.run(['clean', 'csslint', 'jshint', 'uglify', 'cssmin', 'imagemin', 'htmlmin', 'copy', 'crx']);
    }
  });
};
