module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['build'],

    jshint: {
      all: ['Gruntfile.js', 'es6/**/*.js', 'js/**/*.js']
    },

    csslint: {
      all: ['sass/**/*.css', 'css/**/*.css']
    },

    sass: {
      build: {
        options: {
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'src/sass',
          src: '**/*.css',
          dest: 'src/css',
          ext: '.css'
        }]
      }
    },

    less: {
      build: {
        options: {
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'src/less',
          src: '**/*.less',
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

    watch: {
      scripts: {
        files: ['src/es6/**/*.js'],
        tasks: ['jshint', '6to5']
      },
      sass: {
        files: ['src/sass/**/*.css'],
        tasks: ['csslint', 'sass']
      },
      less: {
        files: ['src/less/**/*.css'],
        tasks: ['csslint', 'less']
      }
    },

    uglify: {
      content: {
        files: {
          'build/content.js': ['src/content.js', 'src/js/content.js']
        }
      },
      bg: {
        files: {
          'build/bg.js': ['src/bg.js', 'src/js/bg.js']
        }
      },
      pop: {
        files: {
          'build/pop.js': ['src/pop.js', 'src/js/pop.js']
        }
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
          src: '*.html',
          dest: 'build/',
          ext: '.html',
          options: {
            maxLineLength: 1,
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

    requirejs: {
      content: {
        options: {
          baseUrl: 'src',
          mainConfigFile:'src/content.js',
          include: ['js/content.js'],
          out: 'src/js/content.js'
        }
      },
      bg: {
        options: {
          baseUrl: 'src',
          mainConfigFile:'src/bg.js',
          include: ['js/bg.js'],
          out: 'src/js/bg.js'
        }
      },
      pop: {
        options: {
          baseUrl: 'src',
          mainConfigFile:'src/pop.js',
          include: ['js/pop.js'],
          out: 'src/js/pop.js'
        }
      }
    },

    copy: {
      main: {
        expand: true,
        cwd: 'src',
        src: ['./**/*', '!./es6/**', '!./js/**', '!./sass/**', '!./less/**', '!./css/**', '!./img/**', '!./*.js', '!./*.html', '!./lib/require-cs.js'],
        dest: 'build'
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
      },
      manifest: {
        src: ['build/manifest.json'],
        overwrite: true,
        replacements: [{
          from: /\"lib\/require-cs\.js\"[\s]*(,)?/,
          to: ''
        }, {
          from: /\"js\/(.+\/)?.+\.js\"[\s]*(,)?(\n)?/g,
          to: ''
        }, {
          from: /(,)\n[\s\t]*\]/g,
          to: ']'
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
      grunt.task.run(['replace:rename']);
      grunt.task.run(['shell']);
    } else {
      grunt.task.run(['clean', 'csslint', 'jshint', '6to5', 'requirejs', 'uglify', 'cssmin', 'imagemin', 'htmlmin', 'copy', 'replace:manifest', 'crx']);
    }
  });
};
