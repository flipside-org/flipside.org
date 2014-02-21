module.exports = function(grunt) {
  grunt.initConfig({
    // https://github.com/gruntjs/grunt-contrib-clean
    clean : ['css/*', 'scripts/*', '_site/*'],
    
    // https://github.com/gruntjs/grunt-contrib-compass
    compass : {
      // Default options.
      options : {
          sassDir : 'src/sass',
          cssDir : 'css',
          raw : 'add_import_path "src/vendor/foundation/scss"'
      },
      
      dev : {
        options : {
          environment: 'development',
          outputStyle: 'expanded',
          debugInfo : true
        }
      },
      prod : {
        options : {
          environment: 'production',
          outputStyle: 'compressed',
        }
      }
    },
    
    // https://github.com/gruntjs/grunt-contrib-concat
    concat : {
      dev : {
        src: [
          'src/js/libs/flexslider/flexslider.css',
          // Compass result is the last one.
          'css/app.css'
        ],
        dest: 'css/app.css',
      }
    },
    
    // https://github.com/gruntjs/grunt-contrib-cssmin
    /*cssmin: {
      dev : {
        combine: {
          files: {
            'css/flexslider.css': ['src/js/libs/flexslider/flexslider.css']
          }
        }
      },
      prod : {
        combine: {
          files: {
            'css/app.css': [
              'src/js/libs/flexslider/flexslider.css',
              // Compass result is the last one.
              'css/app.css'
            ]
          }
        }
      }
    },*/
        
    // https://github.com/gruntjs/grunt-contrib-jshint
    jshint: {
      // Default options.
      options : {
        unused : true
      },
      
      dev : {
        options : {
          force : true
        },
        src : ['src/js/*.js']
      },
      
      prod: ['src/js/*.js']
    },
    
    // https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      prod: {
        files: {
          'scripts/flipside.min.js': [
            'src/js/libs/keypress/keypress-1.0.9.min.js',
            'src/js/libs/async/async.js',
            'src/js/libs/flexslider/jquery.flexslider.js',
            'src/js/*.js'
          ],
          //'scripts/modernizr.min.js': ['src/vendor/modernizr/modernizr.js'],
          
          'scripts/foundation.min.js': [
            'src/vendor/foundation/js/vendor/jquery.js',
            
            'src/vendor/foundation/js/foundation/foundation.js',
            //'src/vendor/foundation/js/foundation/foundation.abide.js',
            //'src/vendor/foundation/js/foundation/foundation.accordion.js',
            'src/vendor/foundation/js/foundation/foundation.clearing.js',
            'src/vendor/foundation/js/foundation/foundation.dropdown.js',
            'src/vendor/foundation/js/foundation/foundation.interchange.js',
            //'src/vendor/foundation/js/foundation/foundation.joyride.js',
            //'src/vendor/foundation/js/foundation/foundation.magellan.js',
            //'src/vendor/foundation/js/foundation/foundation.offcanvas.js',
            //'src/vendor/foundation/js/foundation/foundation.orbit.js',
            //'src/vendor/foundation/js/foundation/foundation.reveal.js',
            //'src/vendor/foundation/js/foundation/foundation.tab.js',
            //'src/vendor/foundation/js/foundation/foundation.tooltips.js',
            //'src/vendor/foundation/js/foundation/foundation.topbar.js'
          ]
        }
      }
    },
    
    // https://npmjs.org/package/grunt-contrib-watch
    watch : {
      src: {
        files: ['src/js/*.js', 'src/sass/*.scss'],
        tasks: ['default']
      },
      jekyll : {
        files: ['**/*.html', '**/*.json', '!_site/**/*', '**/**/*.md'],
        tasks: ['jekyll:generate']
      }
    },
    
    // https://github.com/dannygarcia/grunt-jekyll
    jekyll : {
      generate : {
        options : {
          config: '_config.yml',
          src: '.',
          dest: './_site',
        }
      },
      server : {
        options : {
          config: '_config.yml',
          src: '.',
          dest: './_site',
          serve: true
        }
      }
    }
    
  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jekyll');
  
  // Register tasks.
  grunt.registerTask('default', ['compass:dev', 'concat:dev', 'jshint:dev', 'uglify', 'jekyll:generate']);
  
  grunt.registerTask('prod', ['clean', 'compass:prod', 'concat:dev', 'jshint:prod', 'uglify']);
  
  grunt.registerTask('jk', ['jekyll:server']);

};
